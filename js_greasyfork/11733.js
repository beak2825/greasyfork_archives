// ==UserScript==
// @name         MTurk HIT Database Mk.II
// @author       feihtality
// @namespace    https://greasyfork.org/en/users/12709
// @version      1.2.1
// @description  Keep track of the HITs you've done (and more!). Cross browser compatible.
// @include      /^https://www\.mturk\.com/mturk/(dash|view|sort|find|prev|search|accept|cont|myhits).*/
// @exclude      https://www.mturk.com/mturk/findhits?*hit_scraper
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/11733/MTurk%20HIT%20Database%20MkII.user.js
// @updateURL https://update.greasyfork.org/scripts/11733/MTurk%20HIT%20Database%20MkII.meta.js
// ==/UserScript==

/**\
 ** 
 ** This is a complete rewrite of the MTurk HIT Database script from the ground up, which
 ** eliminates obsolete methods, fixes many bugs, and brings this script up-to-date 
 ** with the modern browser environment.
 **
\**/ 



/*globals self*/

const DB_VERSION = 8;
const DB_NAME = 'HITDB';
const MTURK_BASE = 'https://www.mturk.com/mturk/';

/***************************      Native code modifications      *******************************/
if (!NodeList.prototype[Symbol.iterator]) NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
Number.prototype.toPadded = function(length) { // format leading zeros
  'use strict';
  length = length || 2;
  return ("0000000"+this).substr(-length);
};
Math.decRound = function(v, shift) { // decimal rounding
  'use strict';
  v = Math.round(+(v+"e"+shift));
  return +(v+"e"+-shift);
};
Date.prototype.toLocalISOString = function() { // ISOString by local timezone
  'use strict';
  var pad = function(num) { return Number(num).toPadded(); },
      offset = pad(Math.floor(this.getTimezoneOffset()/60)) + pad(this.getTimezoneOffset()%60),
      timezone = this.getTimezoneOffset() > 0 ? "-" + offset : "+" + offset;
  return this.getFullYear() + "-" + pad(this.getMonth()+1) + "-" + pad(this.getDate()) +
    "T" + pad(this.getHours()) + ":" + pad(this.getMinutes()) + ":" + pad(this.getSeconds()) + timezone;
};
if (!('includes' in Array.prototype)) Array.prototype.includes = function(arg) { 'use strict'; return Boolean(~this.indexOf(arg)); };
/***********************************************************************************************/

(function() {
  'use strict';

  var qc = { 
    //extraDays: !!localStorage.getItem("hitdb_extraDays") || false, 
    save: function(key, name, isObj) {
      if (isObj) 
        localStorage.setItem(name, JSON.stringify(this[key]));
      else 
        localStorage.setItem(name, this[key]);
    }
  },
    metrics = {},
    get = (...args) => (args.length > 1 ? args[1] : document).querySelector(args[0] || args[1]),
    getAll = (...args) => (args.length > 1 ? args[1] : document).querySelectorAll(args[0] || args[1]);

  var 
  HITStorage = { //{{{
    data: {}, db: null,
    versionChange: function hsversionChange() { //{{{
      var db = this.result;
      db.onversionchange = function(e) { console.log("detected version change??",console.dir(e)); db.close(); };
      var dbo, idx;

      console.groupCollapsed("HITStorage.versionChange::onupgradeneeded");

      if (!db.objectStoreNames.contains("HIT")) { 
        console.log("creating HIT OS");
        dbo = db.createObjectStore("HIT", { keyPath: "hitId" });
        for (idx of ['date', 'requesterName', 'title', 'reward', 'bonus', 'status', 'requesterId'])
          dbo.createIndex(idx, idx, { unique: false });

        //localStorage.setItem("hitdb_extraDays", true);
        //qc.extraDays = true;
      } else if (!this.transaction.objectStore('HIT').indexNames.contains('bonus')) {
        this.transaction.objectStore('HIT').createIndex('bonus','bonus',{ unique: false });
      }
      
      if (!db.objectStoreNames.contains("STATS")) {
        console.log("creating STATS OS");
        dbo = db.createObjectStore("STATS", { keyPath: "date" });
      }
      if (this.transaction.objectStore("STATS").indexNames.length < 5) { // new in v5: schema additions
        for (idx of ['approved', 'earnings', 'pending', 'rejected', 'submitted'])
          this.transaction.objectStore("STATS").createIndex(idx, idx, { unique: false });
      }

      if (db.objectStoreNames.contains("NOTES") && this.transaction.objectStore("NOTES").indexNames.length < 3)
        db.deleteObjectStore("NOTES");

      if (!db.objectStoreNames.contains("NOTES")) { // new in v5; schema change
        console.log("creating NOTES OS");
        dbo = db.createObjectStore("NOTES", { keyPath: "id", autoIncrement: true });
        dbo.createIndex("hitId", "hitId", { unique: false });
        dbo.createIndex("requesterId", "requesterId", { unique: false });
        dbo.createIndex("tags", "tags", { unique: false, multiEntry: true });
        dbo.createIndex("date", "date", { unique: false });
      }

      if (db.objectStoreNames.contains("BLOCKS"))
        db.deleteObjectStore("BLOCKS");

      console.groupEnd();
    }, // }}} versionChange
    parseDOM: function(doc) {//{{{
      Status.color = "black";

      var errorCheck = doc.querySelector('td[class="error_title"]'),
          extraInfo = [];

      if (doc.title.search(/Status$/) > 0)            // status overview
        parseStatus();
      else if (doc.querySelector('td[colspan="4"]'))  // valid status detail, but no data
        parseMisc("next");
      else if (doc.title.search(/Status Detail/) > 0) // status detail with data
        parseDetail();
      else if (errorCheck) {                          // encountered an error page
        // hit max request rate
        if (~errorCheck.textContent.indexOf("page request rate")) {
          try {
            var _d = doc.documentURI.match(/\d{8}/)[0],
                _p = doc.documentURI.match(/ber=(\d+)/)[1];
            metrics.dbupdate.mark("[PRE]"+_d+"p"+_p, "start");
            console.log("exceeded max requests; refetching %sp%s", _d, _p);
            Status.node.innerHTML = "Exceeded maximum server requests; retrying "+Utils.ISODate(_d)+" page "+_p+"."+
              "<br>Please wait...";
          } catch (err) {
            console.log('exceeded max requests; refetching status page');
            Status.node.innerHTML = 'Exceeded maximum server requests; retrying status page<br />Please wait...';
          } finally {
            return setTimeout(HITStorage.fetch, 3050, doc.documentURI);
          }
        }
        // no more staus details left in range
        else if (qc.extraDays)
          parseMisc("end");
        else
          Utils.errorHandler(new Error("Failed to parse '" + doc.documentURI + "'"));
      }
      else 
        Utils.errorHandler(new Error("Unhandled document '" + doc.docuemntURI + "'"));

      function parseStatus() {//{{{
        HITStorage.data = { HIT: [], STATS: [] };
        qc.seen = {};

        qc.aat = JSON.parse(localStorage.getItem("hitdb_autoAppTemp") || "{}");
        qc.fetchData = JSON.parse(localStorage.getItem("hitdb_fetchData") || "{}");
        ProjectedEarnings.clear();
        var _pastDataExists = Boolean(Object.keys(qc.fetchData).length),
            timeout = 0, scope = [],
            range = _pastDataExists ? Object.keys(qc.fetchData).filter(v => !isNaN(v)) : [],
            raw = { 
          day: doc.querySelectorAll(".statusDateColumnValue"), 
          sub: doc.querySelectorAll(".statusSubmittedColumnValue"),
          app: doc.querySelectorAll(".statusApprovedColumnValue"),
          rej: doc.querySelectorAll(".statusRejectedColumnValue"),
          pen: doc.querySelectorAll(".statusPendingColumnValue"),
          pay: doc.querySelectorAll(".statusEarningsColumnValue") 
        };
        for (var i=0;i<raw.day.length;i++) {
          var d = {};
          var _date = raw.day[i].childNodes[1].href.substr(53);
          d.date      = Utils.ISODate(_date);
          d.submitted = +raw.sub[i].textContent;
          d.approved  = +raw.app[i].textContent;
          d.rejected  = +raw.rej[i].textContent;
          d.pending   = +raw.pen[i].textContent;
          d.earnings  = +raw.pay[i].textContent.substr(1);
          HITStorage.data.STATS.push(d);

          // bonus received on date with 0 HITs
          if (!d.submitted && !d.pending) { if (_date in qc.fetchData) delete qc.fetchData[_date]; continue; }
          // check whether or not we need to get status detail pages for date, then
          // fetch status detail pages per date in range and slightly slow
          // down GET requests to avoid making too many in too short an interval
          var payload = { encodedDate: _date, pageNumber: 1, sortType: "All" };
          if (_pastDataExists) {
            // date not in range but is new date (or old date but we need updates)
            // lastDate stored in ISO format, fetchData date keys stored in mturk's URI ecnodedDate format
            if ( (d.date >= qc.fetchData.lastDate) || ~(Object.keys(qc.fetchData).indexOf(_date)) || 
                (d.pending && !~Object.keys(qc.fetchData).indexOf(_date))) {
              setTimeout(HITStorage.fetch, timeout, MTURK_BASE+"statusdetail", payload);
              timeout += 380;

              qc.fetchData[_date] = { submitted: d.submitted, pending: d.pending };
              scope.push(_date);
            } 
          } else { // get everything
            setTimeout(HITStorage.fetch, timeout, MTURK_BASE+"statusdetail", payload);
            timeout += 380;

            qc.fetchData[_date] = { submitted: d.submitted, pending: d.pending };
          }
        } // for

        // remove out of range dates to prevent lockup when scanning after a long hiatus
        range.filter(v => !scope.includes(v)).forEach(v => delete qc.fetchData[v]);

        // try for extra days
        if (qc.extraDays === true) {
          localStorage.removeItem("hitdb_extraDays");
          d = _decDate(HITStorage.data.STATS[HITStorage.data.STATS.length-1].date);
          qc.extraDays = d; // repurpose extraDays for QC
          payload = { encodedDate: d, pageNumber: 1, sortType: "All" };
          setTimeout(HITStorage.fetch, 1000, MTURK_BASE+"statusdetail", payload);
        }
        qc.fetchData.expectedTotal = _calcTotals(qc.fetchData);
        qc.fetchData.lastDate = HITStorage.data.STATS[0].date; // most recent date seen
        qc.save("fetchData", "hitdb_fetchData", true);

      }//}}} parseStatus
      function parseDetail() {//{{{
        var _date = doc.documentURI.replace(/.+(\d{8}).+/, "$1"),
            _page = doc.documentURI.replace(/.+ber=(\d+).+/, "$1"),
            getExtras = function(entry) {
              return new Promise( function(y) {
                HITStorage.db.transaction('HIT', 'readonly').objectStore('HIT').get(entry.hitId).onsuccess = function() {
                  if (this.result && +this.result.bonus)
                    entry.bonus = +this.result.bonus;
                  if (this.result && +this.result.autoAppTime)
                    entry.autoAppTime = this.result.autoAppTime;
                  HITStorage.data.HIT.push(entry); y(1);
                };
              });
            };

        metrics.dbupdate.mark("[PRE]"+_date+"p"+_page, "end");
        Status.message = "Processing "+Utils.ISODate(_date)+" page "+_page;
        var raw = {
          req:      doc.querySelectorAll(".statusdetailRequesterColumnValue"),
          title:    doc.querySelectorAll(".statusdetailTitleColumnValue"),
          pay:      doc.querySelectorAll(".statusdetailAmountColumnValue"),
          status:   doc.querySelectorAll(".statusdetailStatusColumnValue"),
          feedback: doc.querySelectorAll(".statusdetailRequesterFeedbackColumnValue")
        };

        for (var i=0;i<raw.req.length;i++) {
          var d = {};
          d.date          = Utils.ISODate(_date);
          d.feedback      = raw.feedback[i].textContent.trim().replace(/[\n\t]/g, ' ');
          d.hitId         = raw.req[i].childNodes[1].href.replace(/.+hitId=([^&]+).*/, "$1");
          d.requesterId   = raw.req[i].childNodes[1].href.replace(/.+rId=([^&]+).+/, "$1");
          d.requesterName = raw.req[i].textContent.trim();
          d.reward        = +raw.pay[i].textContent.substr(1);
          d.status        = raw.status[i].textContent.replace(/\s/g, " "); // replace char160 spaces with char32 spaces
          d.title         = raw.title[i].textContent.trim();

          // mturk apparently never marks $0.00 HITs as 'Paid' so we fix that
          if (!d.reward && ~d.status.search(/approved/i)) d.status = "Paid";
          // insert autoApproval times
          d.autoAppTime = HITStorage.autoApprovals.getTime(_date,d.hitId);

          extraInfo.push(getExtras(d));

          if (!qc.seen[_date]) qc.seen[_date] = {};
          qc.seen[_date] = { 
            submitted:   qc.seen[_date].submitted + 1 || 1,
            pending: ~d.status.search(/pending/i)  ? 
              (qc.seen[_date].pending + 1 || 1) : (qc.seen[_date].pending || 0)
          };

          ProjectedEarnings.updateValues(d);
        } //for

        // additional pages remain; get them
        var morePages = doc.querySelector('img[src="/media/right_dbl_arrow.gif"]')/* || doc.querySelector('a[href*="&pageNumber='+(_page+1)+'"]')*/;
        if (morePages) {
          var payload = { encodedDate: _date, pageNumber: +_page+1, sortType: "All" };
          setTimeout(HITStorage.fetch, 380, MTURK_BASE+"statusdetail", payload);
          return;
        } else if (Utils.ISODate(_date) !== qc.fetchData.lastDate &&
            qc.seen[_date].submitted === qc.fetchData[_date].submitted && qc.seen[_date].pending === 0) {
          console.log("no more pending hits, removing",_date,"from fetchData");
          delete qc.fetchData[_date];
          qc.save("fetchData", "hitdb_fetchData", true);
        }

        if (!qc.extraDays) { // not fetching extra days
          console.log("date:", _date, "pages:", _page, "totals:", _calcTotals(qc.seen), "of", qc.fetchData.expectedTotal);
          Status.message += " [ "+_calcTotals(qc.seen)+"/"+ qc.fetchData.expectedTotal+" ]";
          if (_calcTotals(qc.seen) === qc.fetchData.expectedTotal) {
            Status.message = "Writing to database...";
            HITStorage.autoApprovals.purge();
            Promise.all(extraInfo).then(function() { HITStorage.write(HITStorage.data, cbUpdate); });
          } 
        } else if (_date <= qc.extraDays) { // day is older than default range and still fetching extra days
          parseMisc("next");
          console.log("fetchrequest for", _decDate(Utils.ISODate(_date)));
        }
      }//}}} parseDetail
      function parseMisc(type) {//{{{
        var _d = doc.documentURI.match(/\d{8}/)[0],
            _p = doc.documentURI.match(/ber=(\d+)/)[1];
        metrics.dbupdate.mark("[PRE]"+_d+"p"+_p, "end");
        var payload = { encodedDate: _decDate(Utils.ISODate(_d)), pageNumber: 1, sortType: "All" };

        if (type === "next" && +qc.extraDays > 1) {
          setTimeout(HITStorage.fetch, 250, MTURK_BASE+"statusdetail", payload);
          console.log("going to next page", payload.encodedDate);
        } else if (type === "end" && +qc.extraDays > 1) {
          Status.message = "Writing to database...";
          Promise.all(extraInfo).then(function() { HITStorage.write(HITStorage.data, cbUpdate); });
        } else 
          Utils.errorHandler(new TypeError("Failed to execute '"+type+"' in '"+doc.documentURI+"'"));
      }//}}}
      function _decDate(date) {//{{{
        var y = date.substr(0,4);
        var m = date.substr(5,2);
        var d = date.substr(8,2);
        date = new Date(y,m-1,d-1);
        return Number(date.getMonth()+1).toPadded() + Number(date.getDate()).toPadded() + date.getFullYear();
      }//}}}
      function _calcTotals(obj) {//{{{
        var sum = 0;
        for (var k in obj){
          if (obj.hasOwnProperty(k) && !isNaN(+k)) 
            sum += obj[k].submitted;
        }
        return sum;
      }//}}}
    },//}}} parseDOM
    autoApprovals: {//{{{
      getTime : function(date, hitId) {
        if (qc.extraDays || !Object.keys(qc.aat).length) return "";
        var found = false,
            autoApp = "";

        if (!found && Object.keys(qc.aat).length) {
          for (var key in qc.aat) { if (qc.aat.hasOwnProperty(key)) { // for all dates in aat
            var id = Object.keys(qc.aat[key]).filter(id => id === hitId)[0];
            autoApp = qc.aat[key][id] || "";
            if (autoApp) {
              found = true;
              delete qc.aat[key][id];
              qc.save("aat", "hitdb_autoAppTemp", true);
              break;
            }
          }} // for key (dates)
        } // if !found && aat not empty
        return autoApp;
      },// getTime
      purge : function() {
        if (!Object.keys(qc.aat).length) return; // nothing here
        var pad = function(num) { return Number(num).toPadded(); },
            _date = Date.parse(new Date().getFullYear() + "-" + pad(new Date().getMonth()+1) + "-" + pad(new Date().getDate()));

        for (var key of Object.keys(qc.aat)) {
          if (_date - key > 169200000) delete qc.aat[key]; // at least 2 days old, no need to keep it around
        }
        qc.save("aat", "hitdb_autoAppTemp", true);
      } // purge
    },//}}} autoApprovals
    fetch: function(url, payload) { //{{{
      //format GET request with query payload
      if (payload) {
        var args = 0;
        url += "?";
        for (var k in payload) {
          if (payload.hasOwnProperty(k)) {
            if (args++) url += "&";
            url += k + "=" + payload[k];
          }
        }
      }
      // defer XHR to a promise
      var fetch = new Promise( function(fulfill, deny) {
        var urlreq = new XMLHttpRequest();
        urlreq.open("GET", url, true);
        urlreq.responseType = "document";
        urlreq.send();
        urlreq.onload = function() { 
          if (this.status === 200) {
            fulfill(this.response);
          } else {
            deny(new Error(this.status + " - " + this.statusText));
          }
        };
        urlreq.onerror   = function() { deny(new Error(this.status + " - " + this.statusText)); };
        urlreq.ontimeout = function() { deny(new Error(this.status + " - " + this.statusText)); };
      } );
      fetch.then( HITStorage.parseDOM, Utils.errorHandler );

    }, //}}} fetch
    write: function(input, callback) { //{{{
      var counts = { requests: 0, total: 0 },
          os = Object.keys(input),
          dbo = [],
          dbt = HITStorage.db.transaction(os, "readwrite");
      for (var i=0;i<os.length;i++) { // cycle object stores
        dbo[i] = dbt.objectStore(os[i]);
        for (var k of input[os[i]]) { // cycle entries to put into object stores
          if (typeof k.reward === 'object') { k.bonus = k.reward.bonus; k.reward = k.reward.pay; }
          if (typeof callback === 'function' && ++counts.requests)
            dbo[i].put(k).onsuccess = callback.bind(counts);
          else
            dbo[i].put(k);
        }
      }
    }, //}}} write
    recall: function(store, options) {//{{{
      var _cb = function(cursor) {
            try { Status.message = `Retrieving data... [ ${matches} / ${++total} ]`; } catch(e) {}
            if (filter(cursor.value)) {
              sr.include(cursor.value);
              try { Status.message = `Retrieving data... [ ${++matches} / ${total} ]`; } catch(e) {}
            }
            cursor.continue();
          },
          o = Object.assign({
        index: null, range: null, dir: 'next', limit: Infinity, progress: false, mode: 'readonly', callback: _cb,
        status: null, query: null, date: null, reward: null, bonus: null, requesterId: null, requesterName: null
      }, options || {});
      if (o.status === '*') o.status = null; //if (o.query === '*') o.query = null;
      if (o.progress) Progress.show();

      var sr = new DBResult(), matches = 0, total = 0,
          filter = function(obj) {//{{{
            var fields = ['status', 'query', 'reward', 'bonus', 'requesterId', 'requesterName'], matches = {};
            // out of date range
            if (o.date && (obj.date < (o.date[0]) || obj.date > (o.date[1]))) return false;

            for (var f of fields) {
              matches[f] = false;
              if (!o[f]) {
                matches[f] = true;
              } else if (f === 'query') { // general search - title, rname, hitid
                if ((obj.title + obj.requesterName + obj.hitId).toLowerCase().includes(o[f].toLowerCase())) matches[f] = true;
              } else if (!isNaN(obj[f])) {// number
                if (+obj[f] >= o[f][0] && +obj[f] <= o[f][1]) matches[f] = true;
              } else { // text
                if (obj[f] && obj[f].toLowerCase().includes(o[f].toLowerCase())) matches[f] = true;
              }
            }
            return fields.reduce((a,b) => a && matches[b], true);
          };//}}}

      return new Promise( function(resolve) {
        var dbo = HITStorage.db.transaction(store, o.mode).objectStore(store), dbq = null;
        if (o.index) 
          dbq = dbo.index(o.index).openCursor(o.range, o.dir);
        else
          dbq = dbo.openCursor(o.range, o.dir);
        dbq.onsuccess = function() {
          if (this.result && matches < o.limit)
            o.callback(this.result, { resolve: resolve });
          else {
            try { Status.message = "Done."; } catch(e) {}
            resolve(sr);
          }
        }; // IDBCursor
      }); // promise
    },//}}} HITStorage::recall
    backup: function(internal) {//{{{
      var bData = {},
          os    = ["STATS", "NOTES", "HIT"],
          count = 0;

      Progress.show();
      Status.push("Preparing backup...", "black");

      for (var store of os) 
        HITStorage.db.transaction(os, "readonly").objectStore(store).openCursor().onsuccess = populateBackup;

      function populateBackup(e) {
        var cursor = e.target.result;
        if (cursor) {
          if (!bData[cursor.source.name]) bData[cursor.source.name] = [];
          bData[cursor.source.name].push(cursor.value);
          cursor.continue();
        } else 
          if (++count === 3)
            finalizeBackup();
      }
      function finalizeBackup() {
        if (typeof internal === 'function') { qc.merge = bData; internal(true); return; }
        var backupblob = new Blob([JSON.stringify(bData)], {type:"application/json"});
        var date = new Date();
        var dl = document.createElement("A");
        date = date.getFullYear() + Number(date.getMonth()+1).toPadded() + Number(date.getDate()).toPadded();
        dl.href = URL.createObjectURL(backupblob);
        console.log(dl.href);
        dl.download = "hitdb_"+date+".bak";
        document.body.appendChild(dl); // FF doesn't support forced events unless element is part of the document
        dl.click();                    // so we make it so and click,
        dl.remove();                   // then immediately remove it
        Progress.hide();
        Status.push("Done!", "green");
      }

    }//}}} backup
  }, //}}} HITStorage

  Utils = { //{{{
    disableButtons: function(arr, status) { //{{{
      for (var b of arr) document.getElementById(b).disabled = status;
    }, //}}}
    ftime : function(t,options) {//{{{
      if (t !== undefined && isNaN(t)) return;
      options = Object.assign({verbose: false, partial: true}, options);
      var units = ['day', 'hour', 'minute', 'second'];
      units = units.reduce((a,b) => (a[b] = options.verbose ? ' '+b : b.charAt()) && a, {});
      units.day = options.partial ? ' day' : units.day;
      if (String(t).length && +t === 0) return [0 + units.second].map(v => options.verbose ? v+'s' : v);
      if (!t) return ['n/a'];
      var pluralize = (num, str) => num > 1 && str.length > 1 ? num + str + 's' : num + str,
        time = [ pluralize(Math.floor(t/86400), units.day),
          pluralize(Math.floor(t%86400/3600), units.hour),
          pluralize(Math.floor(t%86400%3600/60), units.minute),
          pluralize(t%86400%3600%60, units.second) ];

      return time.filter(v => +v.charAt() > 0);
    },//}}}ftime
    ISODate: function(date) { //{{{ MMDDYYYY <-> YYYY-MM-DD
      if (date.length === 10)
        return date.substr(5,2)+date.substr(-2)+date.substr(0,4);
      else
        return date.substr(4)+"-"+date.substr(0,2)+"-"+date.substr(2,2);
    },//}}} ISODate
    getPosition: function(element, includeHeight) {//{{{
      var offsets = { x: 0, y: includeHeight ? element.offsetHeight : 0 };
      do {
        offsets.x += element.offsetLeft;
        offsets.y += element.offsetTop;
        element = element.offsetParent;
      } while (element);
      return offsets;
    },//}}} getPosition
    errorHandler: function(err) {//{{{
      try { Status.push(err.name + ": " + err.message, "red"); }
      catch(e) {}
      finally { 
        console.error(err);
        if (err.message.includes('AccessViolation')) {
          var _m = 'HITdb probably needs to run an internal update.\nPlease close all tabs running HITdb to complete the process. ' +
              'This includes all other MTurk pages and all tabs running HIT Scraper.',
              span = str => '<span style="color:#c60;margin-top:6px;width:400px;display:block;position:relative;left:50%;transform:translateX(-50%)">' + str + '</span>';
          console.warn(_m);
          try { Status.html = Status.html + span(_m); } catch(e) {}
        }
      }
    },//}}}
    updateTimestamp: function() {//{{{
      var time = get('time'),
        then = Date.parse(time.getAttribute('datetime')),
        now = Date.now(),
        diff = Utils.ftime(Math.floor((now-then)/1000), {verbose:true});
      if (!diff) return;
      time.textContent = diff[0] + ' ago';
      time.title = [new Date(then), '\n', 'Last updated:', diff.join(' '), 'ago'].join(' ');
    }//}}}
  }, //}}} Utils

  ProjectedEarnings = (function() {//{{{
    if (document.location.pathname !== "/mturk/dashboard") return null;
    var _date = new Date(),
        _weekStart, _weekEnd,
        _default = { today:null, weekStart:null, weekEnd:null, day:new Date().getDay(), dbUpdated:'n/a',
          pending:0, approved:0, earnings:{}, target:{ day:10, week:50 } },
        _data = Object.assign(_default, JSON.parse(localStorage.getItem('hitdb_projectedEarnings'))),
        _interface = {updateDate: updateDate, setProperties: setProperties, clear: clear, updateValues: updateValues},
        painter;

    _date.setDate(_date.getDate() - _date.getDay()); // sunday
    _weekStart = Date.parse(_date.toLocalISOString().slice(0,10));
    _date.setDate(_date.getDate() + 7); // next sunday
    _weekEnd   = Date.parse(_date.toLocalISOString().slice(0,10));
    if (_data.weekStart === null) _data.weekStart = _weekStart;
    if (_data.weekEnd === null) _data.weekEnd = _weekEnd;

    function _findAnchor() {//{{{
      var table = Array.prototype.filter.call(getAll('.metrics-table'), v => v.rows.length > 1 && v.rows[1].cells.length > 5)[0];
      if (!table) return undefined;
      else return { node: table.rows[1].cells[0].children[0], date: table.rows[1].cells[0].children[0].href.match(/\d{8}/)[0] };
    }//}}}
    function _save() {//{{{
      saveState("hitdb_projectedEarnings", JSON.stringify(_data));
    }//}}}
    function updateDate() {//{{{
      var anchor = _findAnchor(),
        isToday = anchor.node.textContent.trim() === 'Today',
        isNewWeek = (Date.parse(Utils.ISODate(anchor.date)) >= _data.weekEnd) || (!isToday && new Date().getDay() < _data.day),
        isNewDay = (!_data.today && isToday) || (_data.today && (anchor.date !== _data.today || !isToday));

      if (isNewWeek) setProperties({ earnings: {}, weekEnd: _weekEnd, weekStart: _weekStart });
      if (isNewDay) setProperties({ today: (anchor.date === _data.today ? null : anchor.date), day: new Date().getDay() });
      return _interface;
    }//}}}
    function setProperties(obj, scope) {//{{{
      if (scope) _data[scope] = Object.assign(_data[scope], obj);
      else _data = Object.assign(_data, obj);
      _save();
      return _interface;
    }//}}}
    function _getWeekTotal() {//{{{
      return Math.decRound(Object.keys(_data.earnings).reduce((a,b) => a + _data.earnings[b], 0), 2);
    }//}}}
    function clear() {//{{{
      _data.pending = _data.approved = 0;
      for (var day of Object.keys(_data.earnings))
        if (day in qc.fetchData || day === _data.today) _data.earnings[day] = 0;
    }//}}}
    function updateValues(obj) {//{{{
      var vDate = Date.parse(obj.date), iDate = Utils.ISODate(obj.date);
      if (/pending/i.test(obj.status)) // sum pending earnings (include approved until fully cleared as paid)
        _data.pending = Math.decRound(obj.reward + _data.pending, 2);
      if (/approved/i.test(obj.status))
        _data.approved = Math.decRound(obj.reward + _data.approved, 2);
      if (vDate < _data.weekEnd && vDate >= _data.weekStart && !/rejected/i.test(obj.status)) // sum weekly earnings by day
        _data.earnings[iDate] = Math.decRound(obj.reward + (_data.earnings[iDate] || 0), 2);
    }//}}}
    painter = (function() {//{{{
      var _parentTable = get("#total_earnings_amount").offsetParent,
          _rows = ['pending', 'projectedDay', 'projectedWeek'];

      _rows = _rows.map(() => _parentTable.insertRow(-1));

      function draw() {//{{{
        var meterTitle = "Click to set/change the target value",
            weekTotal = _getWeekTotal(),
            dayTotal = _data.earnings[_data.today] || 0;

        document.head.appendChild(document.createElement('STYLE')).innerHTML =
          '.timestamp { font-family:arial; font-size:10px; white-space:nowrap; }' + 
          'td meter { width:220px; cursor:pointer}' +
          '.pending-offset { color:blue; font-family:arial; font-size:10px; margin-left:3px }';
        _rows.forEach((v,i) => {
          for (var j = 0; j < 2; j++) v.insertCell(-1);
          if (i === 0)
            for (j = 0; j < v.cells.length; j++) v.cells[j].style.borderTop = 'dotted 1px black';
          v.cells[0].className = 'metrics-table-first-value';
        });
        Array.prototype.slice.call(_parentTable.rows, 1).forEach((v,i) => v.className = ++i % 2 ? 'odd' : 'even');
        _rows[0].cells[0].innerHTML = 'Pending earnings ' +
          `<span class="timestamp">[ Last updated: <time datetime="${_data.dbUpdated}"></time> ]</span>`;
        _rows[1].cells[0].innerHTML = '<span>Projected earnings for the day</span>' +
          `<div><meter id="projectedDayProgress" title="${meterTitle}" value="${dayTotal}" max="${_data.target.day}"></meter>` +
          '<span class="pending-offset">' + (dayTotal - _data.target.day).toFixed(2) + '</span></div>';
        _rows[2].cells[0].innerHTML = '<span>Projected earnings for the week</span>' +
          `<div><meter id="projectedWeekProgress" title="${meterTitle}" value="${weekTotal}" max="${_data.target.week}"></meter>` +
          '<span class="pending-offset">' + (weekTotal - _data.target.week).toFixed(2) + '</span></div>';
        _rows[0].cells[1].title = _makePendingTitle();
        _rows[0].cells[1].textContent = "$" + _data.pending.toFixed(2);
        _rows[1].cells[1].textContent = "$" + dayTotal.toFixed(2);
        _rows[2].cells[1].textContent = "$" + weekTotal.toFixed(2);
        if (_data.dbUpdated === 'n/a') get('time', _rows[0]).textContent = 'Never';
        else Utils.updateTimestamp();
        get("#projectedDayProgress").onclick = _setGoals;
        get("#projectedWeekProgress").onclick = _setGoals;
      }//}}}
      function update() {//{{{
        _rows[0].cells[1].title = _makePendingTitle();
        _rows[0].cells[1].textContent = '$' + _data.pending.toFixed(2);
        _rows[1].cells[1].textContent = '$' + (_data.earnings[_data.today] || 0).toFixed(2);
        _rows[2].cells[1].textContent = '$' + _getWeekTotal().toFixed(2);
        get('time').setAttribute('datetime', _data.dbUpdated);
        Utils.updateTimestamp();
        var _day = get('meter', _rows[1]).value = _data.earnings[_data.today] || 0;
        var _week = get('meter', _rows[2]).value = _getWeekTotal();
        get('.pending-offset', _rows[1]).textContent = (+_day - _data.target.day).toFixed(2);
        get('.pending-offset', _rows[2]).textContent = (+_week - _data.target.week).toFixed(2);
      }//}}}
      function _makePendingTitle() {//{{{
        return "This value includes all earnings that are not yet fully cleared as 'Paid'\n" +
          "\n   Pending Approval: $" + (_data.pending - _data.approved).toFixed(2) +
          "\n   Pending Payment: $" + (_data.approved).toFixed(2) +
          "\n   Total Pending:        $" + _data.pending.toFixed(2);
      }//}}}
      function _setGoals(e) {//{{{
        var type = e.target.id.includes('Day') ? 'day' : 'week',
            goal = prompt('Set your ' + (type.replace('y','i') + 'ly') + ' target:', _data.target[type]);
        if (!goal || isNaN(goal)) return;
        var obj = {}; obj[type] = +goal;
        setProperties(obj, 'target');
        e.target.max = goal;
        e.target.nextSibling.textContent = ((type === 'day' ? (_data.earnings[_data.today] || 0) : _getWeekTotal()) - goal).toFixed(2);
      }//}}}
      return { draw: draw, update: update };
    })();//}}} ProjectedEarnings::painter
    _interface.painter = painter;
    return _interface;
  })(),//}}} ProjectedEarnings

  DBResult = function(resArr, colObj) {//{{{
    this.results = resArr || [];
    this.collation = colObj || null;
    this.formatHTML = function(options) {//{{{
      options = Object.assign({ compact: false, type: 'default' }, options);
      var count = 0, htmlTxt = [], entry, r, templates;

      if (this.results.length < 1) return "<h2>No entries found matching your query.</h2>";

      templates = (function(type) {//{{{
        var header, body, footer;
        if (type === 'daily') {
          header = '<thead><tr class="hdbHeaderRow"><th></th><th>Date</th><th>Submitted</th><th>Approved</th><th>Rejected</th><th>Pending</th><th>Earnings</th></tr></thead><tbody>';
          body = obj => `<tr ${obj.class} style="text-align:right"><td><span class="hdbExpandRow">[+]</span></td><td style="text-align:center;">${obj.date}</td><td>${obj.submitted}</td><td>${obj.approved}</td><td>${obj.rejected}</td><td>${obj.pending}</td><td>${(+obj.earnings).toFixed(2)}</td></tr>`;
          footer = obj => `</tbody><tfoot><tr class="hdbTotalsRow" style="text-align:right;"><td>Totals:</td><td>${obj.totalEntries} days</td><td>${obj.totalSub}</td><td>${obj.totalApp}</td><td>${obj.totalRej}</td><td>${obj.totalPen}</td><td>$${(+Math.decRound(obj.totalPay,2)).toFixed(2)}</td></tr></tfoot>`;
        } else if (type === 'pending' || type === 'requester') {
          header = '<thead><tr class="hdbHeaderRow"><th width="160">Requester ID</th><th>Requester</th><th style="width:36">' + (type === 'pending' ? 'Pending' : 'HITs') + '</th><th style="width:76">Rewards</th></tr></thead><tbody>';
          body = arr => {
            var innerRows = [], outerRow = `<tr data-sort="${Math.decRound(arr.pay,2)}"><td><span class="hdbExpandRow" title="Display all pending HITs from this requester">[+]</span> ${arr[0].requesterId}</td><td>${arr[0].requesterName}</td><td style="text-align:center;">${arr.length}</td><td style="text-align:center;">${(+Math.decRound(arr.pay,2)).toFixed(2)}</td></tr>`;
            for (var hit of arr) // hits in range per requester id
              innerRows.push(`<tr data-rid="${arr[0].requesterId}" style="color:#c60000;display:none;"><td style="text-align:right">${hit.date}</td><td width="500" colspan="2" class="nowrap" style="max-width:520" title="${hit.title}">[ <span class="helpSpan" title="Auto-approval time">AA: ${Utils.ftime(hit.autoAppTime).join(' ')}</span> ] ${hit.title}</td><td style="text-align:right">${hit.reward.toFixed(2)}</td></tr>`);
            return outerRow + innerRows.join('');
          };
          footer = obj => `</tbody><tfoot><tr class="hdbTotalsRow"><td style="text-align:right;">Totals:</td><td style="text-align:center;">${Object.keys(obj).length-7} Requesters</td><td style="text-align:right;">${obj.totalEntries}</td><td style="text-align:right;">$${(+Math.decRound(obj.totalPay,2)).toFixed(2)}</td></tr></tfoot>`;
        } else {
          header = '<thead><tr class="hdbHeaderRow"><th colspan="3"></th><th colspan="2" title="Bonuses must be added in manually.\n\nClick inside the cell to edit, click out of the cell to save">Reward</th><th colspan="3"></th></tr><tr class="hdbHeaderRow"><th style="min-width:65">Date</th><th>Requester</th><th>HIT title</th><th style="font-size:10px;">Pay</th><th style="font-size:10px;"><span class="helpSpan" title="Click the cell to edit.\nIts value is automatically saved">Bonus</span></th><th>Status</th><th><span class="helpSpan" title="Auto-approval times">AA</span></th><th>Feedback</th></tr></thead><tbody>';
          body = obj => {
            if (options.compact)
              return `<tr><td class="nowrap" title="${obj.requesterName}" style="max-width:130">${obj.requesterName}</td><td class="nowrap" title="${obj.title}" style="max-width:520">${obj.title}</td><td>${obj.reward.toFixed(2)}</td><td class="nowrap" title="${obj.status}" style="max-width:60">${obj.status}</td></tr>`;
            else
              return `<tr ${obj.class} data-id="${obj.hitId}"><td width="74px">${obj.date}</td><td style="max-width:145px;"><a target="_blank" title="Contact this requester" href="${obj.contact}">${obj.requesterName}</a></td><td width="375px" title="HIT ID:   ${obj.hitId}"><span title="Add a note" id="note-${obj.hitId}" style="cursor:pointer;">&nbsp;&#128221;&nbsp;</span>${obj.title}</td><td style="text-align:right">${obj.reward.toFixed(2)}</td><td style="text-align:right" class="bonusCell" title="Click to add/edit" contenteditable="true" data-hitid="${obj.hitId}">${(obj.bonus ? obj.bonus.toFixed(2) : "")}</td><td style="color:${obj.statusColor};text-align:center">${obj.status}</td><td>${Utils.ftime(obj.autoAppTime).join(' ')}</td><td>${obj.feedback}</td></tr>`;
          };
          footer = obj => `</tbody><tfoot><tr class="hdbTotalsRow"><td></td><td style="text-align:right">Totals:</td><td style="text-align:center;">${obj.totalEntries} HITs</td><td style="text-align:right">$${(+Math.decRound(obj.totalPay,2)).toFixed(2)}</td><td style="text-align:right">$${(+Math.decRound(obj.totalBonus,2) || 0).toFixed(2)}</td><td colspan="3"></td></tr></tfoot>`;
        }
        return { header: header, body: body, footer: footer };
      })(options.type);//}}}

      if (options.type === "daily") {
        r = this.collate(this.results,"stats");
        for (entry of this.results) {
          entry.class = (count++ % 2 === 0) ? 'class="even"' : 'class="odd"';
          htmlTxt.push(templates.body(entry));
        }
        htmlTxt.unshift(templates.header);
        htmlTxt.push(templates.footer(r));
      } else if (options.type === "pending" || options.type === "requester") {
        r = this.collate(this.results,"requesterId");
        for (var k of Object.keys(r).filter(v => !v.includes('total')))
          htmlTxt.push(templates.body(r[k]));
        htmlTxt.sort((a,b) => +b.substr(15,5).match(/\d+\.?\d*/) - +a.substr(15,5).match(/\d+\.?\d*/));
        htmlTxt.unshift(templates.header);
        htmlTxt.push(templates.footer(this.collation || r));
      } else { // default
        this.results.sort((a,b) => a.date === b.date ? (a.requesterName.toLowerCase() > b.requesterName.toLowerCase() ? 1 : -1) : a.date < b.date ? -1 : 1);
        for (entry of this.results) {
          entry.class = (count++ % 2 === 0) ? 'class="even"' : 'class="odd"';
          entry.statusColor = ~entry.status.search(/(paid|approved)/i) ? "green" : entry.status === "Pending Approval" ? "orange" : "red";
          entry.contact = MTURK_BASE+'contact?requesterId='+entry.requesterId+'&requesterName='+entry.requesterName+'&subject=Regarding+Amazon+Mechanical+Turk+HIT+'+entry.hitId;
          htmlTxt.push(templates.body(entry));
        }

        if (options.compact)
          return htmlTxt.join('');

        r = this.collation || this.collate(this.results,"requesterId");
        htmlTxt.unshift(templates.header);
        htmlTxt.push(templates.footer(r));
      }
      return htmlTxt.join('');
    };//}}} formatHTML
    this.formatCSV = function(type) {//{{{
      var csvTxt = [], entry = null, delimiter="\t";
      if (type === "daily") {
        csvTxt.push( ["Date", "Submitted", "Approved", "Rejected", "Pending", "Earnings\n"].join(delimiter) );
        for (entry of this.results) {
          csvTxt.push( [entry.date, entry.submitted, entry.approved, entry.rejected, 
              entry.pending, Number(entry.earnings).toFixed(2)+"\n"].join(delimiter) );
        }
        _csvToFile(csvTxt, "hitdb_dailyOverview.csv");
      } else if (type === "pending" || type === "requester") {
        csvTxt.push( ["RequesterId","Requester", (type === "pending" ? "Pending" : "HITs"), "Rewards\n"].join(delimiter) );
        var r = this.collation || this.collate(this.results,"requesterId");
        for (var k in r) {
          if (!~k.search(/total/) && r.hasOwnProperty(k))
            csvTxt.push( [k, r[k][0].requesterName, r[k].length, Number(Math.decRound(r[k].pay,2)).toFixed(2)+"\n"].join(delimiter) );
        }
        _csvToFile(csvTxt, "hitdb_"+type+"Overview.csv");
      } else {
        csvTxt.push(["hitId","date","requesterName","requesterId","title","pay","bonus","status","autoAppTime","feedback\n"].join(delimiter));
        for (entry of this.results) {
          csvTxt.push([entry.hitId, entry.date, entry.requesterName, entry.requesterId, entry.title, entry.reward.toFixed(2),
              (entry.bonus ? entry.bonus.toFixed(2) : ''), entry.status, entry.autoAppTime, 
              entry.feedback.replace(/[\t\n]/g,' ')+"\n"].join(delimiter));
        }
        _csvToFile(csvTxt, "hitdb_queryResults.csv");
      }

      return null;

      function _csvToFile(csv, filename) {
        var blob = new Blob(csv, {type: "text/csv", endings: "native"}),
            dl   = document.createElement("A");
        dl.href = URL.createObjectURL(blob);
        dl.download = filename;
        document.body.appendChild(dl); // FF doesn't support forced events unless element is part of the document
        dl.click();                    // so we make it so and click,
        dl.remove();                   // then immediately remove it
        return dl;
      }
    };//}}} formatCSV
    this.include = function(value) {
      this.results.push(value);
    };
    this.collate = function(data, index) {//{{{
      var r = { 
        totalPay: 0, totalBonus: 0, totalEntries: data.length,
        totalSub: 0, totalApp: 0, totalRej: 0, totalPen: 0
      };
      for (var e of data) {
        if (!r[e[index]]) { 
          r[e[index]] = [];
          Object.defineProperty(r[e[index]], "pay", {value: 0, enumerable: false, configurable: true, writable: true});
        }
        r[e[index]].push(e);

        if (index === "stats") {
          r.totalSub += e.submitted;
          r.totalApp += e.approved;
          r.totalRej += e.rejected;
          r.totalPen += e.pending;
          r.totalPay += e.earnings;
        } else {
          r[e[index]].pay += (+e.reward);
          r.totalPay += (+e.reward);
          r.totalBonus += (+e.bonus || 0);
        }
      }
      return r;
    };//}}} _collate

  },//}}} databaseresult

  DashboardUI = {//{{{
    draw: function() {//{{{
      var controlPanel = document.createElement("TABLE"),
          insertionNode = get(".footer_separator").previousSibling;
      document.body.insertBefore(controlPanel, insertionNode);
      controlPanel.width = "760";
      controlPanel.align = "center";
      controlPanel.id = "hdbControlPanel";
      controlPanel.cellSpacing = "0";
      controlPanel.cellPadding = "0";
      controlPanel.innerHTML = '<tr height="25px"><td width="10" bgcolor="#7FB448" style="padding-left: 10px;"></td>' +
        '<td class="white_text_14_bold" style="padding-left:10px; background-color:#7FB448;">' +
          'HIT Database Mk. II&nbsp;<a href="https://greasyfork.org/en/scripts/11733-mturk-hit-database-mk-ii#userGuide" '+
            'class="whatis" target="turkPopUp" onclick="customPopup(this, 500, 400)">' +
          '(What\'s this?)</a></td></tr>' +
        '<tr><td class="container-content" colspan="2">' +
        '<div style="text-align:center; position:relative" id="hdbDashboardInterface">' +
         '<button id="hdbBackup" title="Export your entire database!\nPerfect for moving between computers or as a periodic backup">Create Backup</button>' +
         '<button id="hdbRestore" title="Import data from an external file" style="margin:5px">Import</button>' +
         '<button id="hdbUpdate" title="Update... the database" style="color:green;">Update Database</button>' +
         '<input id="hdbFileInput" type="file" style="display:none"/>' +
         '<br>'+
         '<div style="position:absolute; top:0; right:0; text-align:initial">' +
          //'<label title="Popout search results in a new window" style="vertical-align:middle;">popout' +
          //'<input id="hdbPopout" type="checkbox" style="vertical-align:middle"></label>' +
          '<label for="hdbCSVInput" title="Export results as CSV file" style="vertical-align:middle;">export CSV</label>' +
          '<input id="hdbCSVInput" title="Export results as CSV file" type="checkbox" style="vertical-align:middle;">' +
         '</div>' +
         '<button id="hdbPending" title="Summary of all pending HITs\n Can be exported as CSV" style="margin: 0px 5px 5px;">Pending Overview</button>' +
         '<button id="hdbRequester" title="Summary of all requesters\n Can be exported as CSV" style="margin: 0px 5px 5px;">Requester Overview</button>' +
         '<button id="hdbDaily" title="Summary of each day you\'ve worked\nCan be exported as CSV" style="margin:0px 5px 5px;">Daily Overview</button>' +
         '<br>' +
         '<label>Find </label>' +
         '<select id="hdbStatusSelect" style="width:100px"><option value="*">ALL</option>' +
         '<option value="Pending Approval" style="color: orange;">Pending Approval</option>' +
         '<option value="Rejected" style="color: red;">Rejected</option>' +
         '<option value="Approved - Pending Payment" style="color:green;">Approved - Pending Payment</option>' +
         '<option value="Paid" style="color:green;">Paid</option></select>' +
         '<label> HITs from </label><input id="hdbMinDate" type="date" size="10" title="Specify a date, or leave blank">' +
         '<label> to </label><input id="hdbMaxDate" type="date" size="10" title="Specify a date, or leave blank">' +
         '<label> matching </label>'+
         '<br>' +
         '<input id="hdbSearchInput" style="width:400px" title="Query can be HIT title, HIT ID, or requester name" />' +
         '<button id="hdbSearch" style="margin-left:5px">Search</button>' +
         '<br>' +
         '<label id="hdbStatusText"></label>' +
         '<div id="hdbProgressBar">' +
          '<div id="hdbB1" class="ball"></div><div id="hdbB2" class="ball"></div>' +
          '<div id="hdbB3" class="ball"></div><div id="hdbB4" class="ball"></div>' +
         '</div>' +
        '</div></td></tr>';

      var searchResults = document.createElement("DIV");
      searchResults.align = "center";
      searchResults.id = "hdbSearchResults";
      searchResults.style.display = "block";
      searchResults.innerHTML = 
        '<span class="hdbResControl" id="hdbResClear">[ clear results ]</span>' +
        '<span class="hdbTablePagination" id="hdbPageTop"></span><br>' +
        '<table cellSpacing="0" cellpadding="2" width="760" id="hdbResultsTable"></table>' +
        '<span class="hdbResControl" id="hdbVpTop">Back to top</span>' +
        '<span class="hdbTablePagination" id="hdbPageBot"></span><br>';
      document.body.insertBefore(searchResults, insertionNode);
    },//}}} dashboardUI::draw
    initClickables: function() {//{{{
      var main = get('#hdbControlPanel'),
          isGecko = /Gecko\/\d+/.test(navigator.userAgent);

      get('#hdbSearchResults').firstChild.onclick = function() { //{{{ clear results
        get('#hdbResultsTable').innerHTML = null; qc.sr = null;
        for (var d of ["hdbResClear","hdbPageTop","hdbVpTop", "hdbPageBot"]) {
          if (/page/i.test(d)) get(`#${d}`, get('#hdbSearchResults')).innerHTML = "";
          get(`#${d}`, get('#hdbSearchResults')).style.display = "none";
        }
      };//}}}
      get('#hdbVpTop').onclick = function() { autoScroll("#hdbControlPanel"); };

      get('#hdbUpdate',main).onclick = function() { //{{{
        if (!HITStorage.db) { return Utils.errorHandler(new TypeError('(AccessViolation) Database is not defined')); }
        Utils.disableButtons(['hdbUpdate'], true);
        Progress.show();
        metrics.dbupdate = new Metrics("database_update");
        HITStorage.fetch(MTURK_BASE+"status");
        Status.message = "fetching status page....";
      };//}}}
      get('#hdbCSVInput',main).addEventListener("click", function() {//{{{
        var a = get('#hdbAnalytics'), buttons = ['#hdbPending','#hdbRequester','#hdbDaily'];
        if (a && a.checked) a.click();
        if (this.checked) {
          get('#hdbSearch',main).textContent = "Export CSV";
          buttons.map(v => get(v,main)).forEach(v => v.textContent += ' (csv)');
        }
        else {
          get('#hdbSearch',main).textContent = "Search";
          buttons.map(v => get(v,main)).forEach(v => v.textContent = v.textContent.replace(" (csv)",""));
        }
      });//}}}
      if (isGecko) {//{{{
        get('#hdbMinDate',main).addEventListener("focus", function() {
          var offsets = Utils.getPosition(this, true);
          new Calendar(offsets.x, offsets.y, this).drawCalendar();
        });
        get('#hdbMaxDate',main).addEventListener("focus", function() {
          var offsets = Utils.getPosition(this, true);
          new Calendar(offsets.x, offsets.y, this).drawCalendar();
        });
      }//}}}

      get('#hdbBackup',main).onclick = HITStorage.backup;
      get('#hdbRestore',main).onclick = function() { get('#hdbFileInput',main).value = ''; get('#hdbFileInput',main).click(); };
      get('#hdbFileInput',main).onchange = FileHandler.delegate;//processFile;
      get('#hdbSearchInput',main).onkeydown = function(e) { if (e.keyCode === 13) get('#hdbSearch',main).click(); };

      get('#hdbSearch',main).addEventListener('click', function(e) {//{{{
        if (!/^[se]/i.test(e.target.textContent)) return;
        var opt = this.getRange(get('#hdbStatusSelect',main).value, _getFilters(get('#hdbSearchInput',main).value.trim()));
        opt.progress = true;
        if (opt.query && opt.query.length === 30 && !/\s/.test(opt.query)) {
          opt.range = window.IDBKeyRange.only(opt.query.toUpperCase());
          opt.index = null;
        }
        _dbaccess("search", ["HIT", opt], function(r) {
          var limiter = 300,
              _cb = function(slice) {
                for (var _r of slice)
                  HITStorage.recall("NOTES", { index: "hitId", range: window.IDBKeyRange.only(_r.hitId) }).then(NoteHandler.pin);
                
                var _nodes   = [getAll(".bonusCell"), getAll('span[id^="note-"]')];
                for (var i=0;i<_nodes[0].length;i++) {
                  var bonus = _nodes[0][i],
                      note  = _nodes[1][i];
                  bonus.dataset.initial = bonus.textContent;
                  bonus.onkeydown = updateBonus;
                  bonus.onblur    = updateBonus;
                  note.onclick    = NoteHandler.createNewNote;
                }
              };
          if (get('#hdbCSVInput',main).checked) 
            get('#hdbResultsTable').innerHTML = r.formatCSV();
          else if (r.results.length > limiter) {
            var collation = r.collate(r.results, 'requesterId');
            do { qc.sr.push(new DBResult(r.results.splice(0,limiter), collation)) } while (r.results.length);
            resultConstrain(qc.sr, 0, 'default', _cb);
          } else
            resultConstrain(r, 0, 'default', _cb);
        });
      }.bind(this)); //}}} search button click event
      //{{{ overview buttons
      get('#hdbPending',main).onclick = function() {
        var opt = this.getRange('pending', _getFilters(get('#hdbSearchInput',main).value.trim())),
            _opt = { index:'status', dir:'prev', range:window.IDBKeyRange.only('Pending Approval'), progress:true };

        opt = Object.assign(opt, _opt);
        _dbaccess("pending", ["HIT", opt], function(r) {
          get('#hdbResultsTable').innerHTML = get('#hdbCSVInput',main).checked ?
            r.formatCSV("pending") : r.formatHTML({type:'pending'});
          var expands = getAll(".hdbExpandRow");
          for (var el of expands)
            el.onclick = showHiddenRows;
        });
      }.bind(this); //pending overview click event
      get('#hdbRequester',main).onclick = function() {
        var opt = this.getRange(get('#hdbStatusSelect',main).value, _getFilters(get('#hdbSearchInput',main).value.trim()));
        opt.progress = true;

        _dbaccess("requester", ["HIT", opt], function(r) {
          var limiter = 100,
              _cb = function() {
                var expands = getAll(".hdbExpandRow");
                for (var el of expands) 
                  el.onclick = showHiddenRows;
              };
          if (get('#hdbCSVInput',main).checked)
            get('#hdbResultsTable').innerHTML = r.formatCSV("requester");
          else if (r.results.length > limiter) {
            var collation = r.collate(r.results, "requesterId"), _r = [], count = 0;
            var keys = Object.keys(collation)
              .filter(function(e) { return !/total/.test(e); })
              .sort(function(a,b) { return collation[b].pay - collation[a].pay; });
            keys.forEach(function(key){
              if (++count > limiter) {
                qc.sr.push(new DBResult(_r, collation));
                count = 0; _r = [];
              } else _r = _r.concat(collation[key]);
            });
            qc.sr.push(new DBResult(_r, collation));
            resultConstrain(qc.sr, 0, 'requester', _cb);
          } else
            resultConstrain(r, 0, 'requester', _cb);
        });
      }.bind(this); //requester overview click event
      get('#hdbDaily',main).onclick = function() {
        var opt = Object.assign(this.getRange("*"), { index:null, dir:'prev', progress:true });
        _dbaccess("daily", ["STATS", opt], function(r) {
          get('#hdbResultsTable').innerHTML = get('#hdbCSVInput',main).checked ?
            r.formatCSV("daily") : r.formatHTML({type: 'daily'});
          var expands = getAll(".hdbExpandRow");
          for (var el of expands)
            el.onclick = showHitsByDate;
        });
      }.bind(this); //daily overview click event
      //}}}
      function _getFilters(str) {//{{{
        var re = /(?:[rh][equstri]*(?:id|name)|bonus|reward|pay|req|id):[^;]+/ig,
            matches = str.match(re),
            filters = { query: str },
            _setRange = function(str) {
              var rng = str.split(/[><,]/).filter(v => v).sort(); rng.forEach((v,i,a) => a[i] = +v);
              if (rng.length === 1) {
                if (str.startsWith('<')) {
                  rng[0] -= 0.01;
                  rng.unshift(0.01);
                } else if (str.startsWith('>')) {
                  rng[0] += 0.01;
                  rng.push(Infinity);
                } else rng.push(rng[0]);
              }
              return rng;
            };

        if (!matches) return filters;
        filters.query = str.slice(0,str.indexOf(matches[0])).trim();
        if (!filters.query.length) filters.query = null;
        for (var m of matches) {
          var _m = m.split(':');
          if (/(^req$|r[eqstr]*name)/i.test(_m[0])) filters.requesterName = _m[1].trimLeft();
          else if (/(^id$|hitid)/i.test(_m[0])) filters.hitId = _m[1].toUpperCase().trimLeft();
          else if (/r[eqstr]*id/i.test(_m[0])) filters.requesterId = _m[1].toUpperCase().trimLeft();
          else if (/(reward|pay)/i.test(_m[0])) filters.reward = _setRange(_m[1]);
          else if (_m[0].toLowerCase() === 'bonus') filters.bonus = _setRange(_m[1]);
        }
        return filters;
      }//}}}
      function _dbaccess(method, rargs, tfn) {//{{{
        if (!HITStorage.db) { Utils.errorHandler(new TypeError('(AccessViolation) Database is not defined')); return; }
        Utils.disableButtons(['hdbDaily','hdbRequester','hdbPending','hdbSearch'], true);
        get('#hdbSearchResults').firstChild.click();
        Status.push("Preparing database...", "black");
        metrics.dbrecall = new Metrics("database_recall::"+method);
        metrics.dbrecall.mark("data retrieval", "start");

        HITStorage.recall(rargs[0],rargs[1]).then(function(r) {
          qc.sr = [];
          metrics.dbrecall.mark("data retrieval", "end");
          Status.message = "Building HTML...";
          try {
            for (var d of ["hdbResClear","hdbPageTop","hdbVpTop", "hdbPageBot"]) {
              if (get('#hdbCSVInput',main).checked || (~d.search(/page/i) && !/^[sr]/.test(method))) continue;
              document.getElementById(d).style.display = "initial";
            }
            metrics.dbrecall.mark("HTML construction", "start");
            tfn(r); 
            metrics.dbrecall.mark("HTML construction", "end");
          } catch(e) { 
            Utils.errorHandler(e);
          } finally {
            Utils.disableButtons(['hdbDaily','hdbRequester','hdbPending','hdbSearch'], false);
            autoScroll("#hdbSearchResults");
            Status.push("Done!", "green");
            Progress.hide();
            metrics.dbrecall.stop(); metrics.dbrecall.report();
          }
        });
      }//}}} _dbaccess
    },//}}} dashboardUI::initClickables
    getRange: function(status, filters) {//{{{
      var obj = Object.assign({}, filters || {}), r = window.IDBKeyRange, main = get('#hdbControlPanel');
      obj.status = status || get('#hdbStatusSelect',main).value;
      obj.date = [ (get('#hdbMinDate',main).value || '0000'), (get('#hdbMaxDate',main).value || '9999') ];
      obj.index = obj.date[0] !== '0000' || obj.date[1] !== '9999' ? 'date' : 'status';
      if (filters) {
        var indexPriority = { hitId:100, bonus:80, date:70, status:60, requesterId:50, requesterName:40, reward:30,  },
            indices = Object.keys(filters);
        indices.push(obj.index);
        obj.index = indices.reduce((a,b) => indexPriority[a] || 0 > indexPriority[b] || 0 ? a : b);
      }
      obj.range = (function(i) {
        if (['date','reward','pay','bonus'].includes(i))
          return (obj[i] = obj[i].sort()) && r.bound(obj[i][0], obj[i][1]);
        else if (i === 'status' && status.length > 1)
          return r.only(status);
        else if (['hitId','requesterName','requesterId'].includes(i)) 
          return r.bound(obj[i], obj[i].slice(0,-1) + String.fromCharCode(obj[i].slice(-1).charCodeAt()+1));
      })(obj.index);
      if (obj.index === 'hitId' || (obj.index === 'status' && status.length === 1)) obj.index = null;
      return obj;
    }//}}} dashboardUI::getRange
  },//}}} dashboard
  
  FileHandler = { //{{{
    //
    // TODO: JSON integrity check
    //
    delegate: function(e) {//{{{
      var f = e.target.files;
      if (f.length && ~f[0].name.search(/\.(bak|csv|json)$/i)/* && ~f[0].type.search(/(text|json)/)*/) {
        var reader = new FileReader(), testing = true, isCsv = false;
        metrics.dbimport = new Metrics("file_import");

        reader.readAsText(f[0].slice(0,10));
        reader.onload = function(e) { 
          var r = e.target.result;
          if (testing && !~r.search(/(STATS|NOTES|HIT)/)) { // failed json check, test if csv
            console.log("failed json integrity:", r, "\nchecking csv schema...");
            if (!~r.search(/hitId/)) { // failed csv check, return error
              console.log("failed csv integrity:", r, "\naborting");
              return Utils.errorHandler(new TypeError("Invalid data structure"));
            } else { // passed initial csv check, parse full file
              console.log("deferring to csv parser");
              isCsv   = true;
              testing = false;
              Progress.show();
              reader.readAsText(f[0]);
            }
          } else if (testing) {
            testing = false;
            Progress.show();
            reader.readAsText(f[0]);
          } else {
            if (isCsv) this.csv.fromFile(r);
            else HITStorage.write(JSON.parse(r), cbImport);
          }
        }.bind(FileHandler); // reader.onload
      } else if (f.length)
        Utils.errorHandler(new TypeError("Unsupported file format"));
    },//}}}
    csv: {//{{{
      fromFile: function(r) {//{{{
        var validKeys  = ["autoAppTime","date","feedback","hitId","requesterId","requesterName","reward","pay","bonus","status","title"],
            //lines      = r.replace(/\r?\n^(?!"?[A-Z0-9]{30})/gm,' ').split(/\r?\n/);
            lines      = r.split(/\r?\n(?="?[A-Z0-9]{30})/);
        this.delimiter = /^"/.test(lines[0]) ? r.substr(7,1) : r.substr(5,1);
        this.header    = lines.splice(0,1)[0].replace(new RegExp(`([" ]|${this.delimiter}$)`,'g'),'').split(this.delimiter);
        this.data      = { HIT:[] };

        console.log('delimiter:',this.delimiter==='\t'?'tab':this.delimiter,'\nlines:',lines.length,'\nheader:',this.header);
        if (!lines.length) return Utils.errorHandler(new Error("CSV file must contain at least one record"));
        // make sure header keys are valid
        for (var key of this.header)
          if (!~validKeys.indexOf(key)) {
            Progress.hide();
            return Utils.errorHandler(new TypeError("Invalid key '"+key+"' found in column header"));
          }
        this.core(lines);
      },//}}}
      core: function(lr, syn) {//{{{
        syn = syn || false;
        var badLines = [],
            deq = function(str) { if (/^"/.test(str) && /"$/.test(str)) return str.replace(/(^"|"$)/g,''); else return str;},
            qfix = arr => arr.reduce((a,b) => {
              if (a.length && /^".+[^"]$/.test(a[a.length-1])) {
                a[a.length-1] = a[a.length-1] + this.delimiter + b;
                return a;
              } else return a.concat(b);
            }, []);
        for (var line of lr) {
          var record = {};
          line = line.split(this.delimiter);
          if (line.length <= 1) continue;
          if (line.length !== this.header.length) {
            // attempt to resolve delimiter conflicts within field values
            line = qfix(line);
            while (line.length > this.header.length) {
              var datum = line.pop();
              if (/\S/.test(deq(datum))) { line.push(datum); break; }
            }
            if (line.length !== this.header.length) { 
              badLines.push({record: line, reason: "SyntaxError: Number of field do not match number of columns"}); continue; }
          }
          // convert into usable JSON
          for (var i=0;i<line.length;i++) {
            if (/(pay|bonus|reward|autoAppTime)/.test(this.header[i]) && isNaN(+line[i])) { 
              badLines.push({record: line, reason: `TypeError: Value in '${this.header[i]}' is not a number.`}); break; }
            if (this.header[i] === 'hitId' && (/\W/.test(deq(line[i])) || deq(line[i]).length !== 30)) { 
              badLines.push({record: line, reason: "TypeError: Invalid hitId."}); break; }
            if (this.header[i] === 'date' && !/\d{4}-\d{2}-\d{2}/.test(line[i])) { 
              badLines.push({record: line, reason: "TypeError: Invalid date. Dates must be in ISO format (YYYY-MM-DD)."}); break; }

            if (this.header[i] === 'pay' || this.header[i] === 'reward')
              record.reward = +line[i];
            else if (this.header[i] === 'bonus')
              record.bonus = +line[i];
            else
              record[this.header[i]] = deq(line[i]);
          } // for each field
          if (!syn && !badLines.find(v => v.record === line)) this.data.HIT.push(record);
        } // for each record 
        if (syn) return !badLines.length;
        else if (badLines.length) { console.warn('SyntaxError'); console.dir(badLines); this.manualFix(badLines); }
        else HITStorage.write(this.data, cbImport);
      },//}}}
      manualFix: function(lr) {//{{{
        var div      = document.body.appendChild(document.createElement('DIV')),
            title    = div.appendChild(document.createElement('P')),
            divInner = div.appendChild(document.createElement('DIV')),
            buttons  = div.appendChild(document.createElement('P')),
            trimSansTab = function(str) {
              var c = "[ \f\n\r\v\u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+";
              return str.replace(new RegExp("^"+c),'').replace(new RegExp(c+"$"),'');
            },
            kdFn     = function(e) {
              if (e.keyCode === 9) {// tab
                e.preventDefault();
                var zs = e.target.selectionStart,
                    ze = e.target.selectionEnd;
                e.target.value = e.target.value.substr(0,zs) + '\t' + e.target.value.substr(ze);
              }
              e.target.style.height = '1px';
              e.target.style.height = e.target.scrollHeight + 10 +'px';
            },
            blurFn   = function(e) {
              var check = this.core([trimSansTab(e.target.value)],true);
              if (check) e.target.style.background = '#9EFF9E'; else e.target.style.background = 'white';
            }.bind(this);
        title.outerHTML = '<p style="margin:0;text-align:center;font-weight:bold;font-size:1.2em">Failed lines</p>' +
          '<p style="text-align:center;font-weight:bold;font-size:0.9em;margin:1%">' + this.header.join(this.delimiter)+'</p>';
        div.style.cssText = "z-index:5; position:fixed; top:50%;left:50%; padding:0.7%; width:650px; resize:both; overflow:auto;" +
          "background:rgba(204,204,204,0.88); box-shadow: 0px 0px 15px 2px #000; margin-right:-50%; transform:translate(-50%, -50%);";
        divInner.style.cssText = "position:relative; max-height:350px; overflow:auto;";
        for (var v of lr) {
          divInner.appendChild(document.createTextNode(v.reason));
          var ta = divInner.appendChild(document.createElement('TEXTAREA'));
          ta.style.cssText = "resize:none; overflow:hidden; width:100%; display:block";
          ta.onkeydown = kdFn;
          ta.onblur = blurFn;
          ta.value = v.record.join(this.delimiter);
          ta.style.height = ta.scrollHeight + 10 + 'px';
        }
        buttons.style.cssText = "margin:1% auto; text-align:center;";
        buttons.innerHTML = '<button id="fretry" title="Retry failed lines.")">Retry</button> ' +
          '<button id="fskip" title="Skip these failed lines and import the rest to the database.">Skip</button> ' +
          '<button id="fcancel" title="Cancel the entire import process">Cancel</button><br>' +
          'Modify the above entries and retry, or skip them, or cancel the entire import.';
        buttons.querySelector('#fretry').onclick = function() {
          var l = [];
          for (var el of div.querySelectorAll('textarea')) l.push(trimSansTab(el.value));
          this.core(l);
          div.remove();
        }.bind(this);
        buttons.querySelector('#fskip').onclick = function() { div.remove(); HITStorage.write(this.data, cbImport); }.bind(this);
        buttons.querySelector('#fcancel').onclick = function() { div.remove(); this.data = null; Progress.hide();}.bind(this);
      }//}}}
    }//}}} FileHandler::csv
  },//}}}

  NoteHandler = (function() {//{{{
    if (document.location.pathname !== '/mturk/dashboard') return null;
    var _interface = { pin:pin, createNewNote:createNewNote, deleteNote:deleteNote, saveNote:saveNote };

    function pin(dbr) {//{{{
      if (!dbr.results.length) return;
      for (var n of dbr.results) new Note(n).pin();
    }//}}}
    function createNewNote(e) {//{{{
      new Note({ hitId: e.target.id.slice(5) }).pin();
    }//}}}
    function deleteNote(e) {//{{{
      var row = e.target.parentNode.parentNode, range = window.IDBKeyRange.only(row.cells[2].dataset.id);
      if (!row.cells[2].dataset.initial) return row.remove();
      HITStorage.recall('NOTES', { mode:'readwrite', index:'hitId', callback:cb, range:range }).then(() => row.remove());
      function cb(c,promise) {
        if (c.value.note === row.cells[2].dataset.initial) return c.delete() && promise.resolve(true);
        c.continue();
      }
    }//}}}
    function saveNote(e) {//{{{
      var note = e.target.textContent.trim(), update, initial = e.target.dataset.initial,
        date = e.target.previousSibling.textContent, hitId = e.target.dataset.id, range = window.IDBKeyRange.only(hitId);
      if (e instanceof window.KeyboardEvent) return (e.keyCode === 13 || null) && !!e.target.blur();
      if (note === initial) return; // no change
      if (!note) return e.target.parentNode.cells[0].firstChild.click(); // assume intent to delete
      HITStorage.recall('NOTES', { mode:'readwrite', index:'hitId', range:range, callback:cb }).then(finalize);
      function cb(c,promise) {
        var r = c.value;
        if (r.note === initial) return (update = true) && (r.note = note) && c.update(r) && promise.resolve(true);
        c.continue();
      }
      function finalize() {
        if (!update) HITStorage.write({ NOTES: [ {hitId:hitId, date:date, note:note} ]});
        e.target.dataset.initial = note;
      }
    }//}}}
    function Note(obj) {//{{{
      obj = Object.assign({ date: new Date().toLocalISOString().slice(0,10) }, obj);
      this.row = document.createElement('TR');
      this.pin = function() {
        var target = get('tr[data-id="'+obj.hitId+'"]');
        return target.parentNode.insertBefore(this.row, target.nextSibling) && !obj.note && cells[2].focus();
      };
      var cells = ['del', 'date', 'note'].map(() => this.row.insertCell(-1));
      cells[0].innerHTML = '<span class="hdbNote" title="Delete this note">[x]</span>';
      cells[0].firstChild.onclick = NoteHandler.deleteNote;
      cells[0].style.textAlign = "right";
      cells[1].title = "Date on which the note was added";
      cells[1].textContent = obj.date;
      cells[2].textContent = cells[2].dataset.initial = obj.note || '';
      cells[2].dataset.id = obj.hitId;
      cells[2].classList.add('hdbNote');
      cells[2].colSpan = "6";
      cells[2].contentEditable = "true";
      cells[2].onblur = cells[2].onkeydown = NoteHandler.saveNote;
    }//}}}
    return _interface;
  })();//}}}

  /* 
   *
   *
   *
   *
   *///{{{
  console.log('hdb hook');
  if (document.location.pathname === "/mturk/dashboard") {
    DashboardUI.draw();
    DashboardUI.initClickables();
    
    ProjectedEarnings.updateDate().painter.draw();
    setInterval(Utils.updateTimestamp, 1000*60);

    var Status = {
      node: document.getElementById("hdbStatusText"),
      get message() { return this.node.textContent; },
      set message(str) { this.node.textContent = str; },
      get color() { return this.node.style.color; },
      set color(c) { this.node.style.color = c; },
      push: function(m,c) { c = c || "black"; this.message = m; this.color = c; },
      get html() { return this.node.innerHTML },
      set html(str) { this.node.innerHTML = str; }
    }, Progress = {
      node: document.getElementById("hdbProgressBar"),
      hide: function() { this.node.style.display = "none"; },
      show: function() { this.node.style.display = "block"; }
    };

    var dbh = window.indexedDB.open(DB_NAME, DB_VERSION);
    dbh.onerror = function(e) { Utils.errorHandler(e.target.error); };
    dbh.onupgradeneeded = HITStorage.versionChange;
    dbh.onsuccess = INITDB;

    // export some variables for external extensions
    self.Status = Status; self.Progress = Progress; self.Metrics = Metrics; self.Math.decRound = Math.decRound;
  } else { // page is not dashboard
    window.indexedDB.open(DB_NAME).onsuccess = function() { HITStorage.db = this.result; beenThereDoneThat(); };
  }
  /*}}}
   *
   *
   *
   *
   */

  function saveState(key, value) {//{{{
    try { 
      localStorage.setItem(key,value);
    } catch(err) {
      if (err.name !== 'QuotaExceededError') return Utils.errorHandler(err);
      try {
        localStorage.removeItem(key);
        localStorage.setItem(key, value);
      } catch(errr) {
        return Utils.errorHandler(errr);
      }
    }
  }//}}}

  // {{{ css injection
  document.head.appendChild(document.createElement('STYLE')).innerHTML =
  "#hdbProgressBar {margin:auto; width:250px; height:15px; position:relative; display:none;}" +
  ".ball {position:absolute; left:0; width:12px; height:12px; border-radius:5px;" +
    "animation:kfpballs 2s cubic-bezier(0.24,0.77,0.68,1) infinite;" +
    "background:linear-gradient(222deg, rgba(208,69,247,0), rgba(208,69,247,1), rgba(69,197,247,1), rgba(69,197,247,0))}" +
  "#hdbB2{animation-delay:.19s} #hdbB3{animation-delay:.38s} #hdbB4{animation-delay:.55s}" +
  "@keyframes kfpballs {0% {left:0%;opacity:1} 50% {left:98%;opacity:0.2} 100% {left:0%;opacity:1}}" +
  ".hitdbRTButtons {border:1px solid; font-size: 10px; height: 18px; padding-left: 5px; padding-right: 5px; background: pink;}" +
  ".hitdbRTButtons-green {background: lightgreen;}" +
  ".hitdbRTButtons-large {width:80px;}" +
  ".hdbCalControls {cursor:pointer;} .hdbCalControls:hover {color:#c27fcf;}" +
  ".hdbCalCells {background:#f0f6f9; height:19px}" +
  ".hdbCalDays {cursor:pointer; text-align:center;} .hdbCalDays:hover {background:#7fb4cf; color:white;}" +
  ".hdbDayHeader {width:26px; text-align:center; font-weight:bold; font-size:12px; background:#f0f6f9;}" +
  ".hdbCalHeader {background:#7fb4cf; color:white; font-weight:bold; text-align:center; font-size:11px; padding:3px 0px;}" +
  "#hdbCalendarPanel {position:absolute; z-index:10; box-shadow:-2px 3px 5px 0px rgba(0,0,0,0.68);}" +
  ".hdbExpandRow {cursor:pointer; color:blue;}" +
  ".hdbTotalsRow {background:#CCC; color:#369; font-weight:bold;}" +
  ".hdbHeaderRow {background:#7FB448; font-size:12px; color:white;}" +
  ".helpSpan {border-bottom:1px dotted; cursor:help;}" +
  ".hdbResControl {border-bottom:1px solid; color:#c60; cursor:pointer; display:none;}" +
  ".hdbTablePagination {margin-left:15em; color:#c60; display:none;}" +
  ".spin {animation: kfspin 0.7s infinite linear; font-weight:bold;}" +
  "@keyframes kfspin { 0% { transform: rotate(0deg) } 100% { transform: rotate(359deg) } }" +
  ".spin:before{content:'*'}" +
  ".nowrap {white-space:nowrap; overflow:hidden; text-overflow:ellipsis}" +
  ".hdbNote {color:crimson} span.hdbNote {cursor:pointer}" +
  "#javascriptDependentFunctionality { display:block !important }";
  // }}}

  function resultConstrain(data, index, type, callback) {//{{{
    data = data || qc.sr;

    var table  = document.getElementById("hdbResultsTable"),
        rslice = data.length ? data[index].results : data.results,
        pager  = [document.getElementById("hdbPageTop"), document.getElementById("hdbPageBot")],
        sopt   = [],
        _f     = function(e) { resultConstrain(null,e.target.value,type,callback); };
    pager[0].innerHTML = ''; pager[1].innerHTML = '';

    if (data instanceof DBResult)
      table.innerHTML = data.formatHTML({type: type});
    else {
      table.innerHTML = data[index].formatHTML({type: type});
      pager[0].innerHTML = '<span style="cursor:pointer;">' + (index > 0 ? '&#9664; Prev' : '') + '</span> ' +
        '<span style="cursor:pointer;">' + (+index+1 === data.length ? '' : 'Next &#9654;') + '</span> &nbsp; || &nbsp; '+
        '<label>Select page: </label><select></select>';
      for (var i=0;i<data.length;i++) {
        if (i === +index)
          sopt.push('<option value="' + i + '" selected="selected">' + (i+1) + '</option>');
        else
          sopt.push('<option value="' + i + '">' + (i+1) + '</option>');
      }
      pager[0].lastChild.innerHTML = sopt.join('');
      pager[2] = pager[0].cloneNode(true);
      pager[2].id = "hdbPageBot";
      for (i of [0,2]) {
        pager[i].children[0].onclick = resultConstrain.bind(null,null,+index-1,type,callback);
        pager[i].children[1].onclick = resultConstrain.bind(null,null,+index+1,type,callback);
        pager[i].children[3].onchange = _f;
      }
      pager[0].parentNode.replaceChild(pager[2], pager[1]);
    }

    callback(rslice);
  }//}}} resultConstrain

  function beenThereDoneThat() {//{{{
    const pathname = document.location.pathname.split('/').slice(-1).toString();
    if (/(accept|continue)/.test(pathname)) {
      if (!get('input[name="hitAutoAppDelayInSeconds"]')) return;

      // capture autoapproval times
      var _aa = get('input[name="hitAutoAppDelayInSeconds"]').value,
          _hid = getAll('input[name="hitId"]')[1].value,
          pad = function(num) { return Number(num).toPadded(); },
          _d  = Date.parse(new Date().getFullYear() + "-" + pad(new Date().getMonth()+1) + "-" + pad(new Date().getDate()));
      qc.aat = JSON.parse(localStorage.getItem("hitdb_autoAppTemp") || "{}");

      if (!qc.aat[_d]) qc.aat[_d] = {};
      qc.aat[_d][_hid] = _aa;
      qc.save("aat", "hitdb_autoAppTemp", true);
      return;
    }

    const qualNode = get('td[colspan="11"]');
    if (qualNode) { // we're on the preview page!
      const requesterid   = get('input[name="requesterId"]').value,
            requestername = get('input[name="prevRequester"]').value,
            autoApproval  = get('input[name="hitAutoAppDelayInSeconds"]').value,
            hitTitle      = get('div[style*="ellipsis"]').textContent.trim(),
            row = document.createElement("TR"), cellL = document.createElement("TD"), cellR = document.createElement("TD"),
            results = { r: document.createElement("TABLE"), t: document.createElement("TABLE") };
      results.r.dataset.rid = requesterid;
      results.t.dataset.title = hitTitle;
      qualNode.closest('table').parentNode.appendChild(results.r).parentNode.appendChild(results.t);

      cellR.innerHTML = '<span class="capsule_field_title">Auto-Approval:</span>&nbsp;&nbsp;'+Utils.ftime(autoApproval).join(' ');
      const rbutton = document.createElement("BUTTON");
      rbutton.classList.add("hitdbRTButtons","hitdbRTButtons-large");
      rbutton.textContent = "Requester";
      rbutton.onclick = function(e) { e.preventDefault(); showResults.call(results.r, "req", hitTitle); };
      const tbutton = rbutton.cloneNode(false);
      rbutton.title = "Show HITs completed from this requester";
      tbutton.textContent = "HIT Title";
      tbutton.onclick = function(e) { e.preventDefault(); showResults.call(results.t, "title", requestername) };
      HITStorage.recall("HIT", {index: "requesterId", range: window.IDBKeyRange.only(requesterid), limit: 1})
        .then(processResults.bind(rbutton,results.r));
      HITStorage.recall("HIT", {index: "title", range: window.IDBKeyRange.only(hitTitle), limit: 1})
        .then(processResults.bind(tbutton,results.t));
      row.appendChild(cellL);
      row.appendChild(cellR);
      cellL.appendChild(rbutton);
      cellL.appendChild(tbutton);
      cellL.colSpan = "3";
      cellR.colSpan = "8";
      qualNode.closest('tbody').appendChild(row);
    } else { // browsing HITs n sutff 
      const titleNodes = getAll('a[class="capsulelink"]');
      if (titleNodes.length < 1) return; // nothing left to do here!
      const requesterNodes = pathname === 'myhits' 
        ? getAll('.requesterIdentity') 
        : getAll('td > a[href*="hitgroups&requester"]');

      [].forEach.call(requesterNodes, (req, i) => {
        const title   = titleNodes[i].textContent.trim(),
              tbutton = document.createElement('BUTTON'),
              id      = pathname === 'myhits' 
                ? get('a[href*="contact"]', titleNodes[i].closest('table').parentNode.closest('table')).href.match(/rId=([A-Z0-9]+)/)[1]
                : req.href.replace(/.+Id=([A-Z0-9]+)/, '$1'),
              name    = req.textContent,
              rbutton = document.createElement('BUTTON'),
              div     = document.createElement('DIV'),
              tr      = document.createElement('TR'),
              results = { r: document.createElement('TABLE'), t: document.createElement('TABLE') };
        results.r.dataset.rid = id;
        results.t.dataset.title = title;
        req.closest('td[width="100%"] > table').parentNode
          .appendChild(results.r).parentNode
          .appendChild(results.t);

        HITStorage.recall('HIT', {index: 'title', range: window.IDBKeyRange.only(title), limit: 1} )
          .then(processResults.bind(tbutton,results.t));
        HITStorage.recall('HIT', {index: 'requesterId', range: window.IDBKeyRange.only(id), limit: 1} )
          .then(processResults.bind(rbutton,results.r));

        tr.appendChild(div);
        div.id = `hitdbRTInjection-${i}`;
        div.appendChild(rbutton);
        rbutton.textContent = 'R';
        rbutton.classList.add('hitdbRTButtons');
        rbutton.onclick = showResults.bind(results.r, 'req', title);
        rbutton.title = 'Show HITs completed from this requester';
        div.appendChild(tbutton);
        tbutton.textContent = 'T';
        tbutton.classList.add('hitdbRTButtons');
        tbutton.onclick = showResults.bind(results.t, 'title', name);
        req.closest('tbody').appendChild(tr);
      });
    } // else

    function showResults(type, match) {//{{{
      /*jshint validthis: true*/
      if (!this.dataset.hasResults) return;
      if (this.children.length) // table is populated
        this.innerHTML = '';
      else { // need to populate table
        var head = this.createTHead(),
            body = this.createTBody(),
            capt = this.createCaption(),
            style= "font-size:10px;font-weight:bold;text-align:center",
            validKeys = function(obj) { return Object.keys(obj).filter(function(v) { return !~v.search(/total[A-Z]/); }); };

        capt.innerHTML = '<span style="'+style+'">Loading...<label class="spin"></label></span>';

        if (type === "req") {
          HITStorage.recall("HIT", {index:"requesterId", range:window.IDBKeyRange.only(this.dataset.rid)})
            .then( function(r) {
              var cbydate = r.collate(r.results, "date"),
                  kbydate = validKeys(cbydate),
                  cbydatextitle, kbytitle, bodyHTML = [];
              kbydate.forEach(function(date) {
                cbydatextitle = r.collate(cbydate[date], "title");
                kbytitle = validKeys(cbydatextitle);
                kbytitle.forEach(function(title) {
                  bodyHTML.push('<tr style="text-align:center;"><td>'+date+'</td>' +
                      '<td style="text-align:left">'+title.trim()+'</td><td>'+cbydatextitle[title].length+'</td>' +
                      '<td>'+Number(Math.decRound(cbydatextitle[title].pay,2)).toFixed(2)+'</td></tr>');
                });
              });
              var help = "Total number of HITs submitted for a given date with the same title\n" +
                "(aggregates results with the same title to simplify the table and reduce unnecessary spam for batch workers)"; 
              head.innerHTML = '<tr style="'+style+'"><th>Date</th><th>Title</th>' +
                '<th><span class="helpSpan" title="'+help+'">#HITs</span></th><th>Total Rewards</th></tr>';
              body.innerHTML = bodyHTML.sort(function(a,b) {
                return a.match(/\d{4}-\d{2}-\d{2}/)[0] < b.match(/\d{4}-\d{2}-\d{2}/)[0] ? 1 : -1;
              }).join('');
              capt.innerHTML = '<label style="'+style+'">HITs Matching This Requester</label>';

              var mrows = Array.prototype.filter.call(body.rows, function(v) {return v.cells[1].textContent === match});
              for (var row of mrows)
                row.style.background = "lightgreen";
            });
        }
        else if (type === "title") {
          HITStorage.recall("HIT", {index:"title", range:window.IDBKeyRange.only(this.dataset.title)})
            .then( function(r) {
              var cbyreq = r.collate(r.results, "requesterName"),
                  kbyreq = validKeys(cbyreq),
                  bodyHTML = [];
              for (var key of kbyreq)
                bodyHTML.push('<tr style="text-align:center;"><td>'+key+'</td><td>'+cbyreq[key].length+'</td>' +
                    '<td>'+Number(Math.decRound(cbyreq[key].pay,2)).toFixed(2)+'</td></tr>');
              var help = "Total number of HITs matching this title submitted for a given requester\n" +
                "(aggregates results with the same requester name to simplify the table and reduce unnecessary spam for batch workers)";
              head.innerHTML = '<tr style="'+style+'"><th>Requester Name</th>' +
                '<th><span class="helpSpan" title="'+help+'">#HITs</span></th><th>Total Rewards</th></tr>';
              body.innerHTML = bodyHTML.join('');
              capt.innerHTML = '<label style="'+style+'">Reqesters With HITs Matching This Title</label>';

              var mrows = Array.prototype.filter.call(body.rows, function(v) {return v.cells[0].textContent === match});
              for (var row of mrows)
                row.style.background = "lightgreen";
            });
        } //if type === 'title'
      }//populate table
    }//}}} showResults

    function processResults(table, r) {
      /*jshint validthis: true*/
      if (r.results.length) {
        table.dataset.hasResults = 'true';
        this.classList.add('hitdbRTButtons-green');
      }
    }
    
  }//}}} btdt

  function showHiddenRows(e) {//{{{
    var rid = e.target.parentNode.textContent.substr(4);
    var nodes = getAll('tr[data-rid="'+rid+'"]'), el = null;
    if (e.target.textContent === "[+]") {
      for (el of nodes)
        el.style.display="table-row";
      e.target.textContent = "[-]";
    } else {
      for (el of nodes)
        el.style.display="none";
      e.target.textContent = "[+]";
    }
  }//}}}

  function showHitsByDate(e) {//{{{
    var date = e.target.parentNode.nextSibling.textContent,
        row  = e.target.parentNode.parentNode,
        table= row.parentNode;

    if (e.target.textContent === "[+]") {
      e.target.textContent = "[-]";
      var nrow = table.insertBefore(document.createElement("TR"), row.nextSibling);
      nrow.className = row.className;
      nrow.innerHTML = '<td><b>Loading...<label class="spin"></label></b></td>';
      HITStorage.recall("HIT", {index: "date", range: window.IDBKeyRange.only(date)}).then( function(r) {
        nrow.innerHTML = '<td colspan="7"><table style="width:760;color:#c60;">' + r.formatHTML({compact: true}) + '</table></td>';
      });
    } else {
      e.target.textContent = "[+]";
      table.removeChild(row.nextSibling);
    }
  }//}}} showHitsByDate

  function updateBonus(e) {//{{{
    if (e instanceof window.KeyboardEvent && e.keyCode === 13) {
      e.target.blur();
      return false;
    } else if (e instanceof window.FocusEvent) {
      var _bonus = +e.target.textContent.replace(/[^\d.]/g,""),
          _tBonusCell = e.target.offsetParent.tFoot.rows[0].cells[4],
          _tBonus = +_tBonusCell.textContent.replace(/\$/,"");
      e.target.textContent = Number(_bonus).toFixed(2);
      _tBonusCell.textContent = '$'+Number(_tBonus-e.target.dataset.initial+_bonus).toFixed(2);
      if (_bonus !== +e.target.dataset.initial) {
        console.log("updating bonus to",_bonus,"from",e.target.dataset.initial,"("+e.target.dataset.hitid+")");
        e.target.dataset.initial = _bonus;
        var _range = window.IDBKeyRange.only(e.target.dataset.hitid);

        HITStorage.db.transaction("HIT", "readwrite").objectStore("HIT").openCursor(_range).onsuccess = function() {
          var c = this.result;
          if (c) {
            c.value.bonus = _bonus;
            c.update(c.value);
          } 
        }; // idbcursor
      } // bonus is new value
    } // keycode
  } //}}} updateBonus

  // writing callback functions {{{
  function cbImport() {
    /*jshint validthis:true*/
    Status.push("Importing " + this.total + " entries");
    if (++this.total !== this.requests) return;
    Status.push("Importing " + this.total + " entries... Done!", "green");
    try { Progress.hide(); metrics.dbimport.stop(); metrics.dbimport.report(); } catch(err) {}
  }
  function cbUpdate() {
    /*jshint validthis:true*/
    if (++this.total !== this.requests) return;
    if (qc.extraDays) qc.extraDays = false;
    if (HITStorage.data) HITStorage.data = null;
    Status.push("Update Complete!", "green");
    ProjectedEarnings.setProperties({ dbUpdated: new Date().toLocalISOString() }).painter.update();
    Utils.disableButtons(['hdbUpdate'], false);
    Progress.hide(); metrics.dbupdate.stop(); metrics.dbupdate.report();
  }
  //}}}

  function autoScroll(location, dt) {//{{{
    var target = get(location).offsetTop,
        pos    = window.scrollY,
        dpos   = Math.ceil((target - pos)/3);
    dt = dt ? dt-1 : 25; // time step/max recursions

    if (target === pos || dpos === 0 || dt === 0) return;

    window.scrollBy(0, dpos);
    setTimeout(function() { autoScroll(location, dt); }, dt);
  }//}}}

  function Calendar(offsetX, offsetY, caller) {//{{{
    this.date = new Date();
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.caller = caller;
    this.drawCalendar = function(year,month,day) {//{{{
      year = year || this.date.getFullYear();
      month = month || this.date.getMonth()+1;
      day = day || this.date.getDate();
      var longMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      var date = new Date(year,month-1,day);
      var anchors = _getAnchors(date);

      //make new container if one doesn't already exist
      var container = null;
      if (get("#hdbCalendarPanel")) { 
        container = get("#hdbCalendarPanel");
        container.removeChild( container.getElementsByTagName("TABLE")[0] );
      }
      else {
        container = document.createElement("DIV");
        container.id = "hdbCalendarPanel";
        document.body.appendChild(container);
      }
      container.style.left = this.offsetX;
      container.style.top = this.offsetY;
      var cal = document.createElement("TABLE");
      cal.cellSpacing = "0";
      cal.cellPadding = "0";
      cal.border = "0";
      container.appendChild(cal);
      cal.innerHTML = '<tr>' +
        '<th class="hdbCalHeader hdbCalControls" title="Previous month" style="text-align:right;"><span>&lt;</span></th>' +
        '<th class="hdbCalHeader hdbCalControls" title="Previous year" style="text-align:center;"><span>&#8810;</span></th>' +
        '<th colspan="3" id="hdbCalTableTitle" class="hdbCalHeader">'+date.getFullYear()+'<br>'+longMonths[date.getMonth()]+'</th>' +
        '<th class="hdbCalHeader hdbCalControls" title="Next year" style="text-align:center;"><span>&#8811;</span></th>' +
        '<th class="hdbCalHeader hdbCalControls" title="Next month" style="text-align:left;"><span>&gt;</span></th>' +
        '</tr><tr><th class="hdbDayHeader" style="color:red;">S</th><th class="hdbDayHeader">M</th>' +
        '<th class="hdbDayHeader">T</th><th class="hdbDayHeader">W</th><th class="hdbDayHeader">T</th>' +
        '<th class="hdbDayHeader">F</th><th class="hdbDayHeader">S</th></tr>';
      
      get('th[title="Previous month"]').addEventListener( "click", function() { 
        this.drawCalendar(date.getFullYear(), date.getMonth(), 1);
      }.bind(this) );
      get('th[title="Previous year"]').addEventListener( "click", function() {
        this.drawCalendar(date.getFullYear()-1, date.getMonth()+1, 1);
      }.bind(this) );
      get('th[title="Next month"]').addEventListener( "click", function() {
        this.drawCalendar(date.getFullYear(), date.getMonth()+2, 1);
      }.bind(this) );
      get('th[title="Next year"]').addEventListener( "click", function() {
        this.drawCalendar(date.getFullYear()+1, date.getMonth()+1, 1);
      }.bind(this) );

      var hasDay = false, thisDay = 1;
      for (var i=0;i<6;i++) { // cycle weeks
        var row = document.createElement("TR");
        for (var j=0;j<7;j++) { // cycle days
          if (!hasDay && j === anchors.first && thisDay < anchors.total)
            hasDay = true;
          else if (hasDay && thisDay > anchors.total)
            hasDay = false;

          var cell = document.createElement("TD");
          cell.classList.add("hdbCalCells");
          row.appendChild(cell);
          if (hasDay) {
            cell.classList.add("hdbCalDays");
            cell.textContent = thisDay;
            cell.addEventListener("click", _clickHandler.bind(this));
            cell.dataset.year = date.getFullYear();
            cell.dataset.month = date.getMonth()+1;
            cell.dataset.day = thisDay++;
          }
        } // for j
        cal.appendChild(row);
      } // for i
      var controls = cal.insertRow(-1);
      controls.insertCell(0);
      controls.cells[0].colSpan = "7";
      controls.cells[0].classList.add("hdbCalCells");
      controls.cells[0].innerHTML = ' &nbsp; &nbsp; <a href="javascript:void(0)" style="font-weight:bold;text-decoration:none;">Clear</a>' + 
        ' &nbsp; <a href="javascript:void(0)" style="font-weight:bold;text-decoration:none;">Close</a>';
      controls.cells[0].children[0].onclick = function() { this.caller.value = ""; }.bind(this);
      controls.cells[0].children[1].onclick = this.die;

      function _clickHandler(e) {
        /*jshint validthis:true*/

        var y = e.target.dataset.year;
        var m = Number(e.target.dataset.month).toPadded();
        var d = Number(e.target.dataset.day).toPadded();
        this.caller.value = y+"-"+m+"-"+d;
        this.die();
      }

      function _getAnchors(date) {
        var _anchors = {};
        date.setMonth(date.getMonth()+1);
        date.setDate(0);
        _anchors.total = date.getDate();
        date.setDate(1);
        _anchors.first = date.getDay();
        return _anchors;
      }
    };//}}} drawCalendar

    this.die = function() { document.getElementById('hdbCalendarPanel').remove(); };

  }//}}} Calendar

  // instance metrics apart from window scoped PerformanceTiming API
  function Metrics(name) {//{{{
    this.name = name || "undefined";
    this.marks = {};
    this.start = window.performance.now();
    this.end = null;
    this.stop = function(){
      if (!this.end) 
        this.end = window.performance.now();
      else
        Utils.errorHandler(new Error("Metrics::AccessViolation - end point cannot be overwritten"));
    };
    this.mark = function(name,position) {
      if (position === "end" && !this.marks[name]) return;

      if (!this.marks[name])
        this.marks[name] = {};
      if (!this.marks[name][position])
        this.marks[name][position] = window.performance.now();
    };
    this.report = function() {
      console.group("Metrics for",this.name.toUpperCase());
      console.log("Process completed in",+Number((this.end-this.start)/1000).toFixed(3),"seconds");
      for (var k in this.marks) {
        if (this.marks.hasOwnProperty(k)) {
          console.log(k,"occurred after",+Number((this.marks[k].start-this.start)/1000).toFixed(3),"seconds,",
              "resolving in", +Number((this.marks[k].end-this.marks[k].start)/1000).toFixed(3), "seconds");
        }
      }
      console.groupEnd();
    };
  }//}}}

  function INITDB() {//{{{
    HITStorage.db = this.result;
    self.HITStorage = {db: this.result};
    if (localStorage.getItem('hitdb_ridx') === 'true') return;

    Utils.disableButtons(['hdbDaily','hdbRequester','hdbPending','hdbSearch'], true);
    var count = 0;
    this.result.transaction('HIT', 'readwrite').objectStore('HIT').openCursor().onsuccess = function() {
      if (!this.result) {
        Status.push('Done.');
        Utils.disableButtons(['hdbDaily','hdbRequester','hdbPending','hdbSearch'], false);
        return localStorage.setItem('hitdb_ridx', 'true');
      }
      Status.push('Performing integrity check... ' + (++count));
      var r = this.result.value;
      if (typeof r.reward === 'object') {
        if (r.reward === null) r.reward = 0;
        else {
          r.bonus = r.reward.bonus || 0;
          r.reward = r.reward.pay || 0;
        }
        this.result.update(r);
      }
      this.result.continue();
    };
  }//}}}
})(); //scoping

// vim: ts=2:sw=2:et:fdm=marker:noai
