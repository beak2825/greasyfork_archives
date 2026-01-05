// ==UserScript==
// @name         HIT Database Analytics
// @author       feihtality
// @namespace    https://greasyfork.org/en/users/12709
// @version      0.9.005
// @description  Analytics for HIT Database--makes pretty graphs
// @match        https://www.mturk.com/mturk/dashboard
// @require      https://cdn.jsdelivr.net/momentjs/2.10.6/moment.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12612/HIT%20Database%20Analytics.user.js
// @updateURL https://update.greasyfork.org/scripts/12612/HIT%20Database%20Analytics.meta.js
// ==/UserScript==



setTimeout(() => {
  'use strict';

  console.log('hdb-a hook');
  if (!('decRound' in self.Math) || !('Status' in window) || !('Progress' in window)) {
      console.log('HITdb MKII not detected');
      return;
  }

  Math.decRound = self.Math.decRound;
  var digitGroup = function(n) {
        n = String(n).split('.');
        if (n[0].length < 4) return n.join('.');
        n[0] = n[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
        return n.join('.');
      },
      dec = (n,l) => Number(Math.decRound(n,l)).toFixed(l),
      m = this.moment;

  // inject interface {{{
  var insertion = document.getElementById('hdbCSVInput'),
      searchbtn = document.getElementById('hdbSearch'),
      acheckbox = insertion.parentNode.insertBefore(document.createElement('INPUT'), insertion.nextSibling),
      alabel    = insertion.parentNode.insertBefore(document.createElement('LABEL'), insertion.nextSibling),
      metrics   = null;

  acheckbox.type     = 'checkbox';
  acheckbox.id       = 'hdbAnalytics';
  acheckbox.style.verticalAlign = 'middle';
  alabel.textContent = 'Analyze';
  alabel.htmlFor     = 'hdbAnalytics';
  alabel.style.verticalAlign = 'middle';

  acheckbox.onclick = function() {
    if (searchbtn.textContent === "Export CSV") insertion.click();
    if (searchbtn.textContent === "Analyze") searchbtn.textContent = 'Search';
    else searchbtn.textContent = 'Analyze';
  };
  searchbtn.addEventListener('click', getData);
//}}}

  function getData(e) {//{{{
    if (e.target.textContent !== "Analyze") return;
    if (!window.HITStorage.db) { window.Status.push('AccessViolation: Database is not defined.', 'red'); return; }
    
    var range;
    dbrange = [document.getElementById('hdbMinDate').value || undefined, document.getElementById('hdbMaxDate').value || undefined];
    dbrange[3] = ['9999-99-99', '0000-00-00'];
    if (!dbrange[0] && !dbrange[1]) {
      dbrange[2] = 'ALL';
      range = null;
    } else if (dbrange[0] && !dbrange[1]) {
      dbrange[2] = dbrange[0]+'>>';
      range = window.IDBKeyRange.lowerBound(dbrange[0]);
    } else if (!dbrange[0] && dbrange[1]) {
      dbrange[2] = '<<'+dbrange[1];
      range = window.IDBKeyRange.upperBound(dbrange[1]);
    } else {
      dbrange[2] = dbrange[0]+':'+dbrange[1];
      range = window.IDBKeyRange.bound(dbrange[0],dbrange[1]);
    }

    sets = new Sets();
    window.Progress.show();
    metrics = new window.Metrics('database_analytics');
    metrics.mark('dbrecall', 'start');
    dbrecall("HIT", {range: range}).then(analyzeData);
  }//}}}

/* . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . */

  var
    Sets = function() {//{{{ main data obj
      this.quarter = {
        aggregate: {},
        pay:   { labels: [], data: [] },
        hits:  { labels: [], data: [] },
      };
      this.month = {
        aggregate: {},
        pay:   { labels: [], data: [] },
        hits:  { labels: [], data: [] },
      };
      this.week = {
        aggregate: {},
        pay:   { labels: [], data: [] },
        hits:  { labels: [], data: [] },
      };
      this.day = {
        aggregate: {},
        pay:   { labels: [], data: [] },
        hits:  { labels: [], data: [] },
      };
      this.dayofweek = {
        aggregate: {},
        pay:   { labels: [], data: [] },
        hits:  { labels: [], data: [] },
      };
      this.all = {
        aggregate: {},
        distribution: {
          hits: {'1':0,'2-5':0,'6-10':0,'11-15':0,'16-20':0,'21-25':0,'26-30':0,'31-35':0,
            '36-40':0,'41-45':0,'46-50':0,'51-100':0,'101-150':0,'151-200':0,'201-250':0,'251-300':0,
            '301-350':0,'351-400':0,'401-450':0,'451-500':0,'501-550':0,'551-600':0,'601-650':0,'651-700':0,
            '701-750':0,'751-800':0,'801-850':0,'851-900':0,'901-950':0,'951-1000':0,'1001+':0},
          pay: {'0':0, '0.01-0.05':0,'0.06-0.10':0,'0.11-0.15':0,'0.16-0.20':0,'0.21-0.25':0,
            '0.26-0.30':0,'0.31-0.35':0,'0.36-0.40':0,'0.41-0.45':0,'0.46-0.50':0,'0.51-0.55':0,
            '0.56-0.60':0,'0.61-0.65':0,'0.66-0.70':0,'0.71-0.75':0,'0.76-0.80':0,'0.81-0.85':0,
            '0.86-0.90':0,'0.91-0.95':0,'0.96-1.00':0,'1.01-1.25':0,'1.26-1.50':0,'1.51-1.75':0,
            '1.76-2.00':0,'2.01-2.25':0,'2.26-2.50':0,'2.51-2.75':0,'2.76-3.00':0,'3.01-3.25':0,
            '3.26-3.50':0,'3.51-3.75':0,'3.76-4.00':0,'4.01-4.25':0,'4.26-4.50':0,'4.51-4.75':0,
            '4.76-5.00':0,'5.01+':0},
          data: { hits: [], labelsh: [], pay: [], labelsp: [] } },
        hits: { total: 0, rejected: 0, pending: 0, bonus: 0, titles: {}, batch: [[],[],[],[]] },
        pay : { total: 0, rejected: 0, pending: 0, bonus: 0 },
        hitsPerRequester: { avg: 0, data: [], sd: 0, se: 0 },
        payPerHit: { avg: 0, data: [], sd: 0, se: 0 }
      };
    },//}}}
    sets   = new Sets(),
    disth  = Object.keys(sets.all.distribution.hits),
    distp  = Object.keys(sets.all.distribution.pay),
    qmwdLabels = Object.keys(sets), dbrange;

  function dbrecall(os, options) {
    options = options || {};
    var 
      index = options.index || "date",
      range = options.range || null;
      //wRange = [null, null];

    var total = 0;
    return new Promise( y => {
      window.HITStorage.db.transaction(os, "readonly").objectStore(os).index(index).openCursor(range).onsuccess = function() {
        if (this.result) { 
          window.Status.message = 'Aggregating data... [ '+(total++)+' ]';
          aggregateCursor(this.result.value);
          this.result.continue();
        }
        else y(1);
      };
    });
  }

  function analyzeData(r) {
    void(r);
    metrics.mark('dbrecall','end');
    metrics.mark('dsWorker', 'start');
    dsWorker.postMessage(sets);
  }

  function drawCharts(sets) {//{{{
    var 
      hitlineopt = { 
        label: 'HITs Submitted',
        yAxixID: 'hits',
        backgroundColor: 'rgba(149,89,240,0.1)'/*'rgba(42,161,152,0.1)'*/,
        borderColor    : 'rgba(149,89,240,0.5)'/*'rgba(42,161,152,0.5)'*/,
        pointBackgroundColor     : 'rgba(149,89,240,1)'/*'rgba(42,161,152,1)'*/,
        pointHoverBackgroundColor: 'rgba(92,0,230,1)'/*'rgba(38,139,210,1)'*/
      },
      paylineopt = {
        label: 'Total Pay',
        yAxisID: 'pay',
        backgroundColor: 'rgba(200,242,48,0.1)'/*'rgba(181,137,0,0.1)'*/,
        borderColor    : 'rgba(200,242,48,0.5)'/*'rgba(181,137,0,0.5)'*/,
        pointBackgroundColor     : 'rgba(200,242,48,1)'/*'rgba(181,137,0,1)'*/,
        pointHoverBackgroundColor: 'rgba(129,163,5,1)'/*'rgba(133,153,0,1)'*/
      },
      chartopt = {}, humps = {};
      
    for (var k of Object.keys(sets)) {
      if (k === 'all') {
        var a = sets.all.hits;
        chartopt.bsratio = {
          type: 'pie', data: {
            labels: ['batch', 'survey'],
            datasets: [{ data: [Math.decRound(100*a.batch.total/a.total,2), Math.decRound(100*(a.total-a.batch.total)/a.total,2)],
              backgroundColor: ['#6A90F7', '#EDC147'] }]
          }, options: { tooltips: { template: '<%= label %>: <%= value %>%', fontSize: 12 } }
        };
        chartopt.pdist = {
          type: 'bar', data: {
            labels: sets.all.distribution.data.labelsp,
            datasets: [{ data: sets.all.distribution.data.pay,
              backgroundColor: '#47EDE1', hoverBackgroundColor: '#C7ED3E' }]
          }, options: { scales: { xAxes: [{ ticks: {show: false}, categorySpacing: 1 }] },
            tooltips: { multiTemplate: '<%= datasetLabel %><%= value %>%' }
          }
        };
        chartopt.hdist = {
          type: 'bar', data: {
            labels: sets.all.distribution.data.labelsh,
            datasets: [{ data: sets.all.distribution.data.hits,
              backgroundColor: '#47EDE1', hoverBackgroundColor: '#C7ED3E' }]
          }, options: { scales: { xAxes: [{ ticks: {show: false}, categorySpacing: 1}] },
            tooltips: { multiTemplate: '<%= datasetLabel %><%= value %>%' }
          }
        };
        continue;
      }
      var timeOpts,
          _hit = sets[k].hits.data.map(v => v).sort((a,b) => b-a),
          _pay = sets[k].pay.data.map(v => v).sort((a,b) => b-a);

      _hit = [ _hit.shift(), _hit.pop() ];
      _pay = [ _pay.shift(), _pay.pop() ];
      humps[k] = { hit: { high: [_hit[0], sets[k].hits.labels[sets[k].hits.data.findIndex(v => v === _hit[0])]],
                          low:  [_hit[1], sets[k].hits.labels[sets[k].hits.data.findIndex(v => v === _hit[1])]] },
                   pay: { high: [_pay[0], sets[k].hits.labels[sets[k].pay.data.findIndex(v => v === _pay[0])]],
                          low:  [_pay[1], sets[k].hits.labels[sets[k].pay.data.findIndex(v => v === _pay[1])]] } };
      switch (k) {
        case 'day': timeOpts = { format: 'YYYY-MM-DD (ddd)', displayFormat: 'MMMDD', unit: 'week', round: false }; break;
        case 'week': timeOpts = { format: 'gggg[ week ]ww', displayFormat: 'gg[w]ww', unit: k, round: false }; break;
        case 'month': timeOpts = { format: 'MMMM YYYY', displayFormat: 'MMM[\']YY', unit: k, round: false }; break;
        case 'quarter': timeOpts = { format: 'YYYY [Q]Q', displayFormat: 'YYYY [Q]Q', unit: k, round: false }; break;
        case 'dayofweek': timeOpts = false;/*{ format: 'dddd', displayFormat: 'dddd', unit: false, round: false };*/ break;
      }
      Object.assign(sets[k].hits, hitlineopt);
      Object.assign(sets[k].pay, paylineopt);
      chartopt[k] = {
        type:'line', data: { labels: sets[k].hits.labels, datasets: [sets[k].hits, sets[k].pay] }, 
        options: {
          stacked: false, scales: {
            xAxes: [{ gridLines: { offsetGridLines: false }, display: true, type: k === 'dayofweek' ? 'category' : 'time', time: timeOpts,
              scaleLabel: { show: false, labelString: k }, ticks: { maxRotation:45, fontColor: '#969696'} }],
            yAxes: [{ type: 'linear', display: true, position: 'left', id: 'hits',
                      /*scaleLabel: {show: true, labelString: 'hits', fontColor: '#EEE8d5', fontFamily: 'Arial'}*/ },
                    { type: 'linear', display: true, position: 'right', id: 'pay', gridLines: { drawOnChartArea: false },
                      /*scaleLabel: {show:true, labelString: 'pay', fontColor: '#EEE8d5', fontFamily: 'Arial'}*/ }]
          }
        }
      };
    }
    var html = ['<head>',//{{{
       '<link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400" rel="stylesheet" type="text/css">',
       '<script src="https://cdn.jsdelivr.net/g/momentjs@2.10.6,chart.js@2.0.0-alpha4"></script>',
       '<style>',
        '.caption {width:72%;margin:auto;padding:5px;text-align:center;font-size:0.85em}',
        '.hc {color:#AA7DF0} .pc {color:#C8F230}',
        '.bc {color:#6A90F7} .sc {color:#EDC147}',
        '.container {display:flex;align-content:center;justify-content:space-around}',
        '.mi {font-size:0.6em}',
        '.title {background-color:#EEE8D5;color:#073642;width:90%;margin:1% 6% 0% 5%;padding-left:2%;font-weight:400;}',
        '.btn {border:1px solid #EEE8D5; color:#EEE8D5; background:#073642; padding:1%; text-align:center; cursor:pointer; font-weight:400; flex:1}',
        '.btn-active {border:1px solid #073642; color:#073642; background:#EEE8D5}',
        '.btn:hover {border:1px solid #073642; color:#EEE8D5; background:rgba(238,232,213,0.3)}',
       '</style>',
       '<title>HIT Database Analytics | '+dbrange[2]+'</title>',
      '</head>',
      '<body style="color:#fff;background-color:#073642;font-size:100%;font-family:\'Open Sans\',Arial;font-weight:300">',
       '<h2 style="margin:1% 15%">MTurk HIT Database Analytics</h2>',
       '<h4 style="margin:0.5% 20%">'+dbrange[3][0]+' to '+dbrange[3][1]+'</h4>',
       '<div class="title">GENERAL STATISTICS</div>',
       '<div class="container">',
        '<div style="margin-top:5%;margin-left:5%;flex:1">',
         '<div class="container" style="margin-right:10%">',
           '<span style="text-align:right;color:#C7ED3E;flex:1">'+digitGroup(sets.all.hits.total)+'</span>',
           '<span style="text-align:center;flex:1">SUBMITTED</span>',
           '<span style="text-align:left;color:#C7ED3E;flex:1">$'+digitGroup(dec(sets.all.pay.total,2))+'</span>',
         '</div><div class="container" style="margin-right:10%">',
           '<span style="text-align:right;color:#C7ED3E;flex:1">'+digitGroup(sets.all.hits.bonus)+'</span>',
           '<span style="text-align:center;flex:1">BONUSES</span>',
           '<span style="text-align:left;color:#C7ED3E;flex:1">$'+digitGroup(dec(sets.all.pay.bonus,2))+'</span>',
         '</div><div class="container" style="margin-right:10%">',
           '<span style="text-align:right;color:#FF6666;flex:1">'+digitGroup(sets.all.hits.rejected)+'</span>',
           '<span style="text-align:center;flex:1">REJECTED</span>',
           '<span style="text-align:left;color:#FF6666;flex:1">$'+digitGroup(dec(sets.all.pay.rejected,2))+'</span>',
         '</div><div class="container" style="margin-right:10%">',
           '<span style="text-align:right;color:#E0B438;flex:1">'+digitGroup(sets.all.hits.pending)+'</span>',
           '<span style="text-align:center;flex:1">PENDING</span>',
           '<span style="text-align:left;color:#E0B438;flex:1">$'+digitGroup(dec(sets.all.pay.pending,2))+'</span>',
         '</div>',
         '<span class="mi" style="text-align:justify"><span style="color:#30CEF2">NOTE:</span> DOLLAR AMOUNT FOR \'PENDING\' MAY ',
           'REFLECT VALUES FOR HITS WHICH HAVE ALREADY BEEN APPROVED. THESE FUNDS HAVE NOT BEEN FULLY CLEARED ',
           'AND CREDITED TO YOUR ACCOUNT, AND THUS ARE STILL TECHNICALLY PENDING.</span>',
         '<div style="margin:10% 10% 10% 0;flex:1;text-align:center;">',
          'AVERAGE SUBMISSION OF <span style="color:#C7ED3E">'+dec(sets.all.hitsPerRequester.avg,3)+'</span> ',
          '(<span style="color:#C7ED3E">&#177;'+dec(sets.all.hitsPerRequester.se,3)+'</span>) HITS PER REQUESTER',
          '<br><span class="mi">STANDARD DEVIATION: <span style="color:#FA5583">'+dec(sets.all.hitsPerRequester.sd,3)+'</span></span>',
          '<hr style="width:45%;color:#fff;background-color:#fff">',
          'AVERAGE PAY OF <span style="color:#C7ED3E">$'+dec(sets.all.payPerHit.avg,3)+'</span> ',
          '(<span style="color:#C7ED3E">&#177;$'+dec(sets.all.payPerHit.se,3)+'</span>) PER HIT',
          '<br><span class="mi">STANDARD DEVIATION: <span style="color:#FA5583">'+dec(sets.all.payPerHit.sd,3)+'</span></span>',
          '<hr style="width:45%;color:#fff;background-color:#fff">',
          'AVERAGING <span style="color:#C7ED3E">'+Math.ceil(1/(sets.all.payPerHit.avg+sets.all.payPerHit.se))+'</span>',
          '<span id="minbound"> TO <span style="color:#C7ED3E">'+Math.ceil(1/(sets.all.payPerHit.avg-sets.all.payPerHit.se))+
            '</span></span> HITS PER $1.00',
         '</div>',
        '</div>',
        '<div style="margin-top:3%;flex:1">',
         '<div><canvas id="hitdist"></canvas><div class="caption">HIT DISTRIBUTION PER REQUESTER</div></div>',
         '<div><canvas id="paydist"></canvas><div class="caption">PAY DISTRIBUTION PER HIT</div></div>',
        '</div>',
        '<div style="margin-top:10%;flex:1">',
         '<canvas id="batchpie"></canvas>',
         '<div class="caption"><span class="bc">BATCH</span> : <span class="sc">SURVEY</span><br>RATIO APPROXIMATION</div>',
        '</div>',
       '</div>',
       '<div class="title">ACTIVITY</div>',
       '<div class="container" style="margin-top:1%;margin-left:10%;margin-right:10%">',
        '<div class="btn btn-active" data-p="day">DAILY</div><div class="btn" data-p="week">WEEKLY</div>',
        '<div class="btn" data-p="month">MONTHLY</div><div class="btn" data-p="quarter">QUARTERLY</div>',
        '<div class="btn" data-p="dayofweek">DAY OF WEEK</div>',
       '</div>',
       '<div style="margin-top:1%;margin-left:5%;margin-right:5%">',
        '<div style="margin-left:5%;margin-right:5%"><canvas id="activityLines"></canvas></div>',
        '<div class="caption container" style="font-size:0.73em;font-weight:400">',
         '<div style="flex:1">',
          'HIGHEST:&ensp;<span id="hh" class="hc"></span> (<span id="hhd"></span>), <span id="hp" class="pc"></span> (<span id="hpd"></span>)',
         '</div>',
         '<div style="flex:1">',
          'LOWEST:&ensp;<span id="lh" class="hc"></span> (<span id="lhd"></span>), <span id="lp" class="pc"></span> (<span id="lpd"></span>)',
         '</div>',
        '</div>',
        '<div class="caption"><span class="hc">HITS SUBMITTED</span> | <span class="pc">TOTAL PAY</span></div>',
       '</div>',
       '<div class="title">TOP REQUESTERS</div>',
       '<div class="container">',
        '<table id="req10pay" style="font-weight:300;margin-top:1%;margin-left:5%;">',
         '<thead><tr><th colspan="2" style="text-align:left;padding-left:15">PAY</th></tr></thead><tbody></tbody></table>',
        '<table id="req10hit" style="font-weight:300;margin-top:1%;">',
         '<thead><tr><th colspan="2" style="text-align:left;padding-left:15">HITS</th></tr></thead><tbody></tbody></table>',
        '<table id="req10bns" style="font-weight:300;margin-top:1%;">',
         '<thead><tr><th colspan="2" style="text-align:left;padding-left:15">BONUS</th></tr></thead><tbody></tbody></table>',
        '<table id="req10rej" style="font-weight:300;margin-top:1%;margin-right:5%;">',
         '<thead><tr><th colspan="2" style="text-align:left;padding-left:15">REJECTIONS</th></tr></thead><tbody></tbody></table>',
       '</div>',
       '<script>',
        'if (!NodeList.prototype[Symbol.iterator]) NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];',
        'var chartopt = '+JSON.stringify(chartopt)+',',
            'range  = '+JSON.stringify(humps)+',',
            'n = id => document.getElementById(id), _t = (n,t) => n.textContent = t, dec = v => Number(v).toFixed(2), dg = '+digitGroup+',',
            'setHPstats = p => {',
              '_t(hh,dg(range[p].hit.high[0])); _t(hhd,range[p].hit.high[1]);',
              '_t(hp,"$"+dg(dec(range[p].pay.high[0]))); _t(hpd,range[p].pay.high[1]);',
              '_t(lh,dg(range[p].hit.low[0])); _t(lhd,range[p].hit.low[1]);',
              '_t(lp,"$"+dg(dec(range[p].pay.low[0]))); _t(lpd,range[p].pay.low[1]);',
             '},',
            'aLines = new Chart(n("activityLines").getContext("2d"), Object.assign({}, chartopt.day)),',
            'bsPie  = new Chart(n("batchpie").getContext("2d"), chartopt.bsratio),',
            'hdist  = new Chart(n("hitdist").getContext("2d"), chartopt.hdist),',
            'pdist  = new Chart(n("paydist").getContext("2d"), chartopt.pdist),',
            'r10hit = n("req10hit").tBodies[0], r10hHtml = [],',
            'r10pay = n("req10pay").tBodies[0], r10pHtml = [],',
            'r10bns = n("req10bns").tBodies[0], r10bHtml = [],',
            'r10rej = n("req10rej").tBodies[0], r10rHtml = [],',
            'hh = n("hh"), hhd = n("hhd"), hp = n("hp"), hpd = n("hpd"), lh = n("lh"), lhd = n("lhd"), lp = n("lp"), lpd = n("lpd"),',
            'btns   = Array.from(document.querySelectorAll(".btn")),',
            'payArr = '+JSON.stringify(sets.all.rpay)+',',
            'hitArr = '+JSON.stringify(sets.all.rhits)+',',
            'bnsArr = '+JSON.stringify(sets.all.rbonus)+',',
            'rejArr = '+JSON.stringify(sets.all.rrej)+',',
            'mb     = n("minbound"),',
            'btnFn  = function(e) {',
                      'if (e.target.classList.contains("btn-active")) return;',
                      'var _p = e.target.dataset.p;',
                      'document.querySelector(".btn-active").classList.toggle("btn-active");',
                      'e.target.classList.toggle("btn-active");',
                      'aLines.data = chartopt[_p].data;',
                      'aLines.options.scales.xAxes[0].time = chartopt[_p].options.scales.xAxes[0].time;',
                      'aLines.options.scales.xAxes[0].type = chartopt[_p].options.scales.xAxes[0].type;',
                      'aLines.buildScales();',
                      'aLines.update();',
                      'aLines.resetElements();',
                      'aLines.update();',
                      'aLines.initToolTip();',
                      'setHPstats(_p);',
                     '};',
        'btns.forEach(n => n.onclick = btnFn);',
        'setHPstats("day");',
        'if (mb.children[0].textContent === mb.previousSibling.textContent) mb.style.display = "none";',
        'payArr.forEach(v => r10pHtml',
          '.push("<tr><td style=\\"text-align:right;padding-right:10;color:#47EDE1\\">$"+v.pay+"</td>',
            '<td style=\\"max-width:200\\">"+v.name+"</td></tr>"));',
        'hitArr.forEach(v => r10hHtml',
          '.push("<tr><td style=\\"text-align:right;padding-right:10;color:#47EDE1\\">"+v.hits+"</td>',
            '<td style=\\"max-width:200\\">"+v.name+"</td></tr>"));',
        'bnsArr.forEach(v => r10bHtml',
          '.push("<tr><td style=\\"text-align:right;padding-right:10;color:#47EDE1\\">$"+v.bonus+"</td>',
            '<td style=\\"max-width:200\\">"+v.name+"</td></tr>"));',
        'rejArr.forEach(v => r10rHtml',
          '.push("<tr><td style=\\"text-align:right;padding-right:10;color:#FF6666\\">"+v.rej+',
            '" <span style=\\"color:#fff\\">(</span>$"+v.rejAmt+"<span style=\\"color:#fff\\">)</span></td>',
            '<td style=\\"max-width:200\\">"+v.name+"</td></tr>"));',
        'if (r10bHtml.length === 0) r10bns.parentNode.style.display="none";',
        'if (r10rHtml.length === 0) r10rej.parentNode.style.display="none";',
        'r10hit.innerHTML = r10hHtml.join(""); r10pay.innerHTML = r10pHtml.join("");',
        'r10bns.innerHTML = r10bHtml.join(""); r10rej.innerHTML = r10rHtml.join("");',
       '</script>',
      '</body>'];//}}}
    var blob = new Blob(html, {type:'text/html'}), _a = document.body.appendChild(document.createElement('A'));
    _a.href = URL.createObjectURL(blob);
    _a.target = '_blank';
    _a.click();
    _a.remove();
  }//}}}

  function aggregateCursor(dat) {//{{{
    var _m = m(dat.date, 'YYYY-MM-DD'),
        qmwd = [
          _m.format('YYYY [Q]Q'),
          _m.format('MMMM YYYY'),
          _m.format('gggg[ week ]ww'),
          _m.format('YYYY-MM-DD (ddd)'),
          _m.format('dddd'),
        ],
        pay = +dat.reward,
        bonus = +dat.bonus  || 0;

    if (dat.date < dbrange[3][0]) dbrange[3][0] = dat.date;
    else if (dat.date > dbrange[3][1]) dbrange[3][1] = dat.date;

    // populate scaled aggregates
    for (var i=0; i<qmwd.length; i++) {
      var def = sets[qmwdLabels[i]].aggregate;
      if (!([qmwd[i]] in def)) {
        def[qmwd[i]] = { hits:0, pay:0 };
      }
      def[qmwd[i]].hits += 1;
      def[qmwd[i]].pay  += pay;
    }// end for qmwd loop
    // repeat requester aggregation for 'all'
    if (!(dat.requesterId in sets.all.aggregate))
        sets.all.aggregate[dat.requesterId] = { name: dat.requesterName, hits: 0, pay: 0, bonus: 0, rej: 0, rejAmt: 0};
    sets.all.aggregate[dat.requesterId].hits += 1;
    sets.all.aggregate[dat.requesterId].pay += pay;
    sets.all.aggregate[dat.requesterId].bonus += bonus;
    sets.all.aggregate[dat.requesterId].rej += dat.status === "Rejected" ? 1 : 0;
    sets.all.aggregate[dat.requesterId].rejAmt += dat.status === "Rejected" ? pay : 0;

    // populate pay distribution data
    //   hit distribution needs to wait until later--after aggregation
    sets.all.payPerHit.data.push(pay);
    distp.forEach( v => {
      var range = v.split('-');
      if (pay === +v) { sets.all.distribution.pay[v] += 1; return; }
      if (v === '5.01+' && pay > 5) { sets.all.distribution.pay[v] += 1; return; }
      if (pay >= range[0] && pay <= range[1]) { sets.all.distribution.pay[v] += 1; return; }
    });
    // increment general stats
    var _t = dat.title.trim(), _t1 = _t.charAt(0).toLowerCase(), _ss;
    sets.all.hits.total += 1;
    sets.all.hits.rejected += dat.status === 'Rejected' ? 1 : 0;
    sets.all.hits.pending += dat.status === 'Pending Approval' ? 1 : 0;
    sets.all.hits.bonus += bonus ? 1 : 0;
    //sets.all.hits.titles[_t] = sets.all.hits.titles[_t] + 1 || 1;
    sets.all.pay.total += pay;
    sets.all.pay.rejected += dat.status === 'Rejected' ? pay : 0;
    sets.all.pay.pending += /pending/i.test(dat.status) ? pay : 0;
    sets.all.pay.bonus += bonus;
    // populate data for batch approximation
    if (_t1 < "h") _ss = 0;
    else if (_t1 < "o") _ss = 1;
    else if (_t1 < "v") _ss = 2;
    else _ss = 3;
    var hitLoc = sets.all.hits.batch[_ss].findIndex(v => v.title === _t && v.req === dat.requesterId);
    if (~hitLoc)
      sets.all.hits.batch[_ss][hitLoc].count += 1;
    else
      sets.all.hits.batch[_ss].push({ title: _t, req: dat.requesterId, count: 1 });
  }//}}}


  //set up a worker thread to prevent interface locking on large datasets
  var datasetsWorker = [//{{{
    'var dec = '+dec+', digitGroup = '+digitGroup+';',
    'Math.decRound = '+Math.decRound+';',
    // calculate the standard deviation
    'function stdev(avg, N, data) {',
      'var sum = 0;',
      'data.forEach(v => sum += Math.pow(v-avg, 2));',
      'return Math.sqrt(sum/(N-1));',
    '}',

    'function arrayFromObj(obj) {',
      'var arr = [];',
      'for (var k in obj) {',
        'if (obj.hasOwnProperty(k))',
          'arr.push(obj[k]);',
      '}',
      'return arr;',
    '}',

    'onmessage = (e) => {',
      'var sets = e.data, disth = '+JSON.stringify(disth)+', distp = '+JSON.stringify(distp)+', reqArr;',
      // sort aggregates
      'for (var period of Object.keys(sets)) {',
        'if (period === \'all\') { ',
          'reqArr = arrayFromObj(sets.all.aggregate);',
          // calculate averages, sd, se
          'postMessage( {type: "status", data: "Calculating averages..." });',
          'var _pph = sets.all.payPerHit, _hpr = sets.all.hitsPerRequester;',
          '_pph.avg = sets.all.pay.total / sets.all.hits.total;',
          '_pph.sd = stdev(_pph.avg, _pph.data.length, _pph.data);',
          '_pph.se = _pph.sd/Math.sqrt(_pph.data.length);',
          '_hpr.data = reqArr.map( v => v.hits );',
          '_hpr.avg = sets.all.hits.total / _hpr.data.length;',
          '_hpr.sd = stdev(_hpr.avg, _hpr.data.length, _hpr.data);',
          '_hpr.se = _hpr.sd/Math.sqrt(_hpr.data.length);',
          // get hit distribution
          'postMessage( {type: "status", data: "Populating distributions..." });',
          'reqArr.forEach(v => {',
            'disth.forEach(w => {',
              'var range = w.split(\'-\');',
              'if (range.length === 1) range.push(\'1\');',
              'if (v.hits > 1000 && w === \'1001+\') { sets.all.distribution.hits[w] += 1; return; }',
              'if (v.hits >= range[0] && v.hits <= range[1]) { sets.all.distribution.hits[w] += 1; return; }',
            '});',
          '});',
          // extract raw data for distributions
          'disth.forEach(v => sets.all.distribution.data.hits.push(Math.decRound(100*sets.all.distribution.hits[v]/reqArr.length,3)));',
          'distp.forEach(v => sets.all.distribution.data.pay.push(Math.decRound(100*sets.all.distribution.pay[v]/sets.all.hits.total,3)));',
          'sets.all.distribution.data.labelsh = Object.keys(sets.all.distribution.hits);',
          'sets.all.distribution.data.labelsp = Object.keys(sets.all.distribution.pay);',
          // get 'top' lists
          'sets.all.rpay  = reqArr.sort((a,b) => b.pay  - a.pay ).slice(0,10);',
          'sets.all.rhits = reqArr.sort((a,b) => b.hits - a.hits).slice(0,10);',
          'sets.all.rbonus= reqArr.filter(e => e.bonus > 0).sort((a,b) => b.bonus - a.bonus).slice(0,10);',
          'sets.all.rrej  = reqArr.filter(e => e.rej > 0).sort((a,b) => b.rej - a.rej).slice(0,10);',
          'sets.all.rpay.forEach(v => v.pay = digitGroup(dec(v.pay,2)));',
          'sets.all.rhits.forEach(v => v.hits = digitGroup(v.hits));',
          'sets.all.rbonus.forEach(v => v.bonus = digitGroup(dec(v.bonus,2)));',
          'sets.all.rrej.forEach(v => v.rejAmt = dec(v.rejAmt,2));',
          'continue;',
        '}',
        // populate labels/data for graphing
        'postMessage({ type: "status", data: "Sorting by "+period+"..." });',
        'var labels = Object.keys(sets[period].aggregate);',
        'if (period === "dayofweek") labels = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]',
          '.filter(v => !!~Object.keys(sets[period].aggregate).indexOf(v));',
        'for (k of labels) {',
          'if (~[\'hits\',\'pay\'].indexOf(k)) continue;',
          'sets[period].pay.labels.push(k);',
          'sets[period].hits.labels.push(k);',
          'sets[period].pay.data.push(Math.decRound(sets[period].aggregate[k].pay,2));',
          'sets[period].hits.data.push(sets[period].aggregate[k].hits);',
        '}',
      '}',
      // if there are more than 5 hits with the same title under the same requester, assume it's a batch
      'var _temp = [];',
      'while (sets.all.hits.batch.length) _temp = _temp.concat(sets.all.hits.batch.shift().filter(v => v.count > 5));',
      'sets.all.hits.batch = _temp;',
      'sets.all.hits.batch.total = 0;',
      'sets.all.hits.batch.forEach(v => {if (typeof v === "object") sets.all.hits.batch.total += v.count});',

      'postMessage({ type: "obj", data: sets });',

    '}'];//}}}

  datasetsWorker = new Blob(datasetsWorker, {type:'text/javascript'});
  var workerURL = URL.createObjectURL(datasetsWorker);
  var dsWorker = new Worker(workerURL);

  dsWorker.onmessage = (e) => {//{{{
    if (e.data.type === 'status') {
      window.Status.message = e.data.data;
      console.log(e.data.data);
    } else {
      metrics.mark('dsWorker','end');
      metrics.stop();metrics.report();
      window.Status.message = 'Done!';
      window.Progress.hide();
      drawCharts(e.data.data);
    }
  };//}}}

}, 100);

// vim: ts=2:sw=2:et:fdm=marker:noai
