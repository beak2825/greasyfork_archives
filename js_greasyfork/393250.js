// ==UserScript==
// @name        SmartSearch
// @namespace   E-Hentai
// @author      Superlatanium
// @description a
// @include     /https:\/\/forums.e-hentai.org\/index.php.*showforum=/
// @include     https://hentaiverse.org/fakepage
// @version     1.3.7.s2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/393250/SmartSearch.user.js
// @updateURL https://update.greasyfork.org/scripts/393250/SmartSearch.meta.js
// ==/UserScript==

var version = '1.3.7';

//set to true if you want to show lines that have strikethroughs, otherwise they'll be hidden:
var showStrikeouts = false;

//set to true if you want to see database size
var showSize = true;

//If a thread was last saved or a post was last edited more than daysAgoLimit days ago, the color of the table row is changed in search results
var daysAgoLimit = 60;

//set to true if you want the Price column to list a wild guess if the post line doesn't match a common format for the price
var wildGuess = false;

var hideLocked = false;

//If a database problem comes up, uncomment (remove the two slashes before) dbDelete and run the script, and then uncomment dbCreate and run the script.
//dbDelete(function(){ error('Deleted'); });
//dbCreate(function(){ error('Created'); });






/*
forums.e-hentai.org and HV are on different domains, so they must use postMessage to talk to each other
(1) forums. opens a window to hv
(2) forums. sends postMessage request to hv window with the equips to download
(3) hv window sees the request, downloads, and replies with the equips and their levels
(4) forums. sees the postMessage from hv
*/

function createMessage(msg, obj) {
  return '{"postedMessage":{"string":"' + msg + '","object":' + obj + '}}';
}

//Empty page where the script can Post to HV and reply to the request for equips
if (window.location.href === 'https://hentaiverse.org/fakepage'){
  window.addEventListener('message', function(hvEvent) {
    if (hvEvent.origin === 'https://forums.e-hentai.org'){
      var msg = JSON.parse(hvEvent.data);
      if (!msg.postedMessage || msg.postedMessage.string !== 'request for equips')
        return;
      var equips = [];
      var totalEquips = msg.postedMessage.object.length;
      var responseCount = 0;
      document.body.textContent = 'Got 0 / ' + totalEquips + ' equips';
      msg.postedMessage.object.forEach(function(equip){
        get('https://hentaiverse.org/pages/showequip.php?eid=' + equip.eid + '&key=' + equip.key, function(response){
          equip = parseEquip(response.body, equip);
          equips.push(equip);
          responseCount++;
          document.body.textContent = 'Got ' + responseCount + ' / ' + totalEquips + ' equips';
          if (responseCount === totalEquips){
            var msgBackToForums = createMessage('here are equips', JSON.stringify(equips));
            hvEvent.source.postMessage(msgBackToForums, 'https://forums.e-hentai.org');
          }
        });
      });
    }
  });
  return;
}


var forum = window.location.href.match(/showforum=(\d+)/);
if (!forum || (forum[1] !== '77' && forum[1] !== '78'))
  return;
forum = forum[1];

var headTable = document.getElementsByClassName('ipbtable')[0];
var searchDiv = headTable.parentNode.insertBefore(document.createElement("div"),headTable.nextSibling);

var useRE = searchDiv.appendChild(document.createElement('input'));
useRE.type = 'checkbox';
useRE.title = 'Use regular expression in search field?';

var input = searchDiv.appendChild(document.createElement('input'));
input.type = 'text';
input.style.width = '350px';
var select = true;
input.onkeyup = function(event){
  if (event.keyCode === 13)
    search.click();
};
input.addEventListener('click', function() {
  if (select) input.select();
  select = false;
});

if (typeof localStorage.SmartSearch === 'undefined' || /ignored/.test(localStorage.SmartSearch)){
  dbCreate(function(){ error('Database created'); });
  localStorage.SmartSearch = '{"lastSearch":"* = wildcard. Use checkbox for regular expression.", "lowestEid":"67180000"}';
  //EID: ~67180000 for 0.82+: See
  //https://forums.e-hentai.org/index.php?s=&showtopic=22234&view=findpost&p=4468312
  //https://forums.e-hentai.org/index.php?s=&showtopic=22234&view=findpost&p=4468357
}

if (!/lastSearch/.test(localStorage.SmartSearch))
  localStorage.SmartSearch = '{"lastSearch":"* = wildcard. Use checkbox for regular expression.", "lowestEid":"67180000"}';

var lastStorage = JSON.parse(localStorage.SmartSearch);
var lastSearch = lastStorage.lastSearch;
var lowestEid = lastStorage.lowestEid;
var include = 0;

input.value = lastSearch;

function updateStorage(){
  lastStorage.lastSearch = lastSearch;
  lastStorage.lowestEid = lowestEid;
  localStorage.SmartSearch = JSON.stringify(lastStorage);
}

var SmartSearch;

var search = searchDiv.appendChild(document.createElement('button'));
search.textContent = 'SmartSearch';
search.style['margin-left'] = '30px';
search.addEventListener('click', async () => {
  search.disabled = true;
  save.disabled = true;
  lastSearch = input.value;
  updateStorage();
  setTimeout(function(){
    search.textContent = 'SmartSearch';
    search.disabled = false;
  }, 1500);
  if (input.value.length < 3){
    search.textContent = 'String is too short';
    return;
  }
  if (inProgress !== false){
    search.textContent = 'Another transaction is in progress, please wait';
    return;
  }
  var w = typeof unsafeWindow !== 'undefined' ? unsafeWindow.open() : window.open();
  if (w === null || w === undefined){
    error('Pop-ups appear to be blocked, so SmartSearch\'s window can\'t be opened. Please add an exception allowing popups from http://forums.e-hentai.org/');
    return;
  }
  w.document.title = 'SmartSearch';

  function buildCSS(){
    var cssSource = `
body {background:#DFEBED; font-family:arial; text-align:center;}
ul {text-align:left;}

input::-webkit-inner-spin-button {-webkit-appearance: none; margin:0;}
input[type='number'] {-moz-appearance:textfield;}

.filterInput {margin-left:3px; margin-right:20px;}
#filterThreadCheckboxDiv {display:inline-block; vertical-align:middle;}
#filterThreadResult {width:270px}

table {border-collapse:collapse; width:100%; table-layout:fixed; margin-top:20px;}
tr {border:1px solid black; font-size:80%;}
tr:hover {background-color:#ccd9ff;}
td {padding:0 10px; overflow:hidden; white-space:nowrap;}
.main th:nth-child(1) {width:100px;}
.main th:nth-child(2) {width:220px;}
.main th:nth-child(3) {width:80px; color:blue; text-decoration:underline;}
.main th:nth-child(4) {width:70px; color:blue; text-decoration:underline;}
.main td:nth-child(3), .main td:nth-child(4) {text-align:right;}
.main th:nth-child(5) {width:90px; color:blue; text-decoration:underline;}
.main th:nth-child(7) {width:100px;}
.main th:nth-child(8) {width:90px; color:blue; text-decoration:underline;}
.main th:nth-child(9) {width:70px;}
.warn {background:#fdb;}
.ended {background:#fff;}

.ignoredDiv {text-align:center; background:white; width:95%; border:3px solid black; padding:20px; margin-bottom:100px;}
.ignoredDiv td:nth-child(1) {width:70px;}
.ignoredDiv td:nth-child(2) {width:200px;}
.ignoredPosts td:nth-child(3) {width:170px;}

a:visited {color:#c06}

`;
    w.document.head.appendChild(w.document.createElement('style')).innerHTML = cssSource;
  }
  buildCSS();

  var re;
  if (useRE.checked === true)
    re = new RegExp(input.value, 'i');
  else
    re = new RegExp(input.value.replace(/\*/g, '.+').replace(/[\-\[\]\/\{\}\(\)\*\?\^\$\|]/g, '\\$&').replace(/\s+/g, '\\s'), 'i');


  dbGet(function(obj){
    SmartSearch = obj;

    w.document.body.appendChild(w.document.createElement('h3')).textContent = document.getElementById('navstrip').textContent + ':\n' + Object.keys(SmartSearch[forum]).length + ' threads saved in this forum';
    if (showSize === true)
      w.document.body.appendChild(w.document.createElement('h3')).textContent = Math.round(JSON.stringify(SmartSearch).length / 1000) + 'k characters in database';
    w.document.body.appendChild(w.document.createElement('h6')).textContent = (useRE.checked === false ? input.value + '\u00A0\u00A0\u00A0\u00A0\u00A0|\u00A0\u00A0\u00A0\u00A0\u00A0' : '') + re.source;

    var resultsCountDiv = w.document.body.appendChild(w.document.createElement('div'));
    var filterEidDiv = w.document.body.appendChild(w.document.createElement('div'));
    filterEidDiv.appendChild(w.document.createElement('span')).textContent = 'Lowest EID:';
    var lowestEidInput = filterEidDiv.appendChild(w.document.createElement('input'));
    var filterEidResult = filterEidDiv.appendChild(w.document.createElement('span'));
    lowestEidInput.className = 'filterInput';
    lowestEidInput.type = 'number';
    lowestEidInput.value = lowestEid;
    lowestEidInput.onblur = function(){
      lowestEid = lowestEidInput.value;
      updateStorage();
      hide();
    };

    var filterThreadDiv = w.document.body.appendChild(w.document.createElement('div'));
    var filterThreadSpan = filterThreadDiv.appendChild(w.document.createElement('span'));
    filterThreadSpan.textContent = 'Filter by thread title:';
    filterThreadSpan.id = 'filterThreadSpan';
    var filterThreadCheckboxDiv = filterThreadDiv.appendChild(w.document.createElement('div'));
    filterThreadCheckboxDiv.id = 'filterThreadCheckboxDiv';
    var includeCbox = filterThreadCheckboxDiv.appendChild(w.document.createElement('input'));
    includeCbox.type = 'checkbox';
    includeCbox.checked = (include === 1 ? true : false);
    includeCbox.addEventListener('click', function(){
      if (includeCbox.checked === true) {
        include = 1;
        excludeCbox.checked = false;
      } else
        include = 0;
      hide();
    });
    filterThreadCheckboxDiv.appendChild(w.document.createElement('span')).textContent = 'Include';

    filterThreadCheckboxDiv.appendChild(w.document.createElement('br'));

    var excludeCbox = filterThreadCheckboxDiv.appendChild(w.document.createElement('input'));
    excludeCbox.type = 'checkbox';
    excludeCbox.checked = (include === -1 ? true : false);
    excludeCbox.addEventListener('click', function() {
      if (excludeCbox.checked === true){
        include = -1;
        includeCbox.checked = false;
      } else
        include = 0;
      hide();
    });
    filterThreadCheckboxDiv.appendChild(w.document.createElement('span')).textContent = 'Exclude';

    var filterThreadInput = filterThreadDiv.appendChild(w.document.createElement('input'));
    filterThreadInput.className = 'filterInput';
    filterThreadInput.value = 'auction';
    filterThreadInput.onblur = hide;
    var filterThreadResult = filterThreadDiv.appendChild(w.document.createElement('span'));
    filterThreadResult.id = 'filterThreadResult';

    var checkLevels = w.document.body.appendChild(w.document.createElement('button'));
    checkLevels.textContent = 'Check Levels';
    checkLevels.addEventListener('click', function(){
      checkLevels.disabled = true;
      var equips = [];
      [].forEach.call(table.getElementsByTagName('tr'), function(tr){
        var a = tr.children[5].getElementsByTagName('a');
        if (a.length === 0)
          return;
        var equip = getEquipFromLink(a[0].href);
        if (!equip)
          return;
        equips.push(equip);
      });
      getLevelsFromHv(equips, checkLevels);
    });

    var showingStats = false;
    var showStats = w.document.body.appendChild(w.document.createElement('button'));
    showStats.textContent = 'Show Stats';
    showStats.addEventListener('click', function(){
      showingStats = !showingStats;
      if (showingStats === true){
        showStats.textContent = 'Don\'t Show Stats';
        [].slice.call(table.getElementsByTagName('tr')).forEach(function(tr){
          if (tr.style.display === 'none')
            return;
          var a = tr.children[5].getElementsByTagName('a');
          if (a.length === 0)
            return;
          var equip = getEquipFromLink(a[0].href);
          if (!equip)
            return;
          var item = SmartSearch.savedEquips[equip.eid];
          if (!item || !item.info)
            return;
          var infoTr = w.document.createElement('tr');
          infoTr.setAttribute('class', 'info');
          infoTr.innerHTML = '<td></td><td></td><td></td><td></td><td></td><td>' + item.info + '</td><td></td><td></td><td></td>';
          table.children[1].insertBefore(infoTr, tr.nextSibling);
        });
      } else {
        showStats.textContent = 'Show Stats';
        [].slice.call(table.getElementsByTagName('tr')).forEach(function(tr){
          if (tr.className === 'info')
            tr.parentElement.removeChild(tr);
        });
      }
    });

    function getEquipFromLink(href){
      var eidRe = href.match(/showequip\.php\?eid=(\d+)&amp;key=(\w+)/);
      if (!eidRe)
        eidRe = href.match(/hentaiverse.org\/equip\/(\d+)\/(\w+)/);
      if (!eidRe)
        return false;
      return {eid:eidRe[1], key:eidRe[2]};
    }

    function hide(){
      try {
        lowestEid = parseInt(lowestEid);
      } catch (e){
        filterEidResult.textContent = 'lowestEid is not an integer';
        return;
      }
      var hideEidCount = 0;
      var hideTitleCount = 0;
      [].forEach.call(table.getElementsByTagName('tr'), function(tr){
        if (tr.children[0].tagName === 'TH')
          return;
        tr.style.display = '';
        var eid = tr.children[2].textContent;
        if (eid && eid < lowestEid){
          tr.style.display = 'none';
          hideEidCount++;
        }
        if (filterThreadInput.value){
          if (include === -1 && tr.children[1].textContent.toLowerCase().indexOf(filterThreadInput.value) !== -1) {
            tr.style.display = 'none';
            hideTitleCount++;
          } else if (include === 1 && tr.children[1].textContent.toLowerCase().indexOf(filterThreadInput.value) === -1) {
            tr.style.display = 'none';
            hideTitleCount++;
          }
        }
      });
      if (hideEidCount.value === 0)
        filterEidResult.textContent = '';
      else
        filterEidResult.textContent = hideEidCount + ' hidden';
      if (hideTitleCount === 0) {
        filterThreadResult.textContent = '0 hidden';
        filterThreadResult.style.visibility = 'hidden';
      } else {
        filterThreadResult.style.visibility = '';
        filterThreadResult.textContent = hideTitleCount + ' hidden';
      }
    }

    var table = w.document.body.appendChild(w.document.createElement('table'));
    table.className = 'main';
    table.appendChild(w.document.createElement('thead')).innerHTML = '<tr><th>Poster</th><th>Thread</th><th>eid</th><th>Price</th><th>Level</th><th>Line content</th><th>Thread saved</th><th>Post edited</th><th>Ignore</th></td>';
    var tbody = table.appendChild(w.document.createElement('tbody'));
    var now = Date.now();
    var resultsCount = 0;
    Object.keys(SmartSearch[forum]).forEach(function(threadId){
      if (threadId === 'ignored' || Object.keys(SmartSearch.ignored.threads).indexOf(threadId) !== -1)
        return;
      var thread = SmartSearch[forum][threadId];
      if (thread.locked && hideLocked)
        return;
      thread.posts.forEach(function(post){
        if (Object.keys(SmartSearch.ignored.posts).indexOf(post.postId) !== -1)
          return;
        var lines = post.postText.split('\n');
        var lineStartsWithStrikethrough = false;
        var lineEndsWithStrikethrough = false;
        var i = 0;
        lines.forEach(function(line){
          if (line.indexOf('[s]') !== -1)
            lineEndsWithStrikethrough = true;
          if (line.indexOf('[/s]') !== -1)
            lineEndsWithStrikethrough = false;
          if (!re.test(line)){
            lineStartsWithStrikethrough = lineEndsWithStrikethrough;
            i++;
            return;
          }
          if (!showStrikeouts && (lineStartsWithStrikethrough || lineEndsWithStrikethrough || line.indexOf('[s]') !== -1))
            return;
          resultsCount++;
          var tr = tbody.appendChild(w.document.createElement('tr'));
          tr.appendChild(w.document.createElement('td')).textContent = thread.opName;
          var titleTd = tr.appendChild(w.document.createElement('td'));
          titleTd.innerHTML = '<a href="https://forums.e-hentai.org/index.php?showtopic=' + threadId + '&view=findpost&p=' +post.postId + '" target="_blank">' + thread.title + '</a>';
          titleTd.title = thread.title;
          if (/close/i.test(thread.title) || /delete/i.test(thread.title) || /end/i.test(thread.title) || /done/i.test(thread.title))
            tr.className = 'ended';
          var eidTd = tr.appendChild(w.document.createElement('td'));
          var equip = getEquipFromLink(line);
          if (equip && equip.eid)
            eidTd.textContent = equip.eid;
          var priceRe = line.replace(/start(\s?bid)?\s?:\s?[0-9,.]+\s?[kmc]/ig,"#").match(/([1-9]\d*(?:[\.,]\d+)?\s?[kmc])(?:[^\w"]|$)/i);
          if (!priceRe)
            priceRe = line.match(/@\s?([1-9]\d*(?:[\.,]\d+)?)/i);
          if (!priceRe && wildGuess)
            priceRe = line.match(/[^\=\d]([1-9]\d*(?:[\.,]\d+)?)([^\w"]|$)/i);
          tr.appendChild(w.document.createElement('td')).textContent = priceRe && (priceRe[1].length < 9 || priceRe[1].indexOf(',') !== -1) ? priceRe[1] : '';
          tr.appendChild(w.document.createElement('td'));
          //tr.appendChild(w.document.createElement('td')).innerHTML = (lineStartsWithStrikethrough && line.indexOf('[s]') !== 0 ? '[s]' : '') + line.replace(/<a\s/g, '<a target="_blank" ');
          tr.appendChild(w.document.createElement('td')).innerHTML = (lineStartsWithStrikethrough && line.indexOf('[s]') !== 0 ? '[s]' : '') + line.replace(/<a\s/g, '<a target="_blank" ').replace(/https?:\/\/(?:alt\.)?hentaiverse\.org\/pages\/showequip\.php\?eid=(\d+)&amp;key=(\w+)/g,"https://hentaiverse.org/equip/$1/$2");
          var warn1 = false;
          var warn2 = false;
          var agoObj = ago(thread.dateSaved);
          tr.appendChild(w.document.createElement('td')).textContent = agoObj[0];
          warn1 = agoObj[1];
          agoObj = ago(post.lastEdited);
          tr.dataset.edited = post.lastEdited;
          tr.appendChild(w.document.createElement('td')).textContent = agoObj[0];
          warn2 = agoObj[1];
          if (warn1 || warn2)
            tr.className = 'warn';
          var ignoreBtn = tr.appendChild(w.document.createElement('td')).appendChild(w.document.createElement('button'));
          ignoreBtn.textContent = 'Ignore';
          ignoreBtn.addEventListener('click', function(){
            makeIgnoreInterface(threadId, post, line);
          });
          lineStartsWithStrikethrough = lineEndsWithStrikethrough;
          i++;
        });
      });
    });
    resultsCountDiv.textContent = resultsCount + ' results';
    hide();

    function refreshLevels(){
      [].forEach.call(table.getElementsByTagName('tr'), function(tr){
        var a = tr.children[5].getElementsByTagName('a');
        if (a.length === 0)
          return;
        var equip = getEquipFromLink(a[0].href);
        if (!equip)
          return;
        if (!SmartSearch.savedEquips[equip.eid])
          return;
        tr.children[4].textContent = SmartSearch.savedEquips[equip.eid].level;
      });
    }

    refreshLevels();

    function getLevelsFromHv(equips, btn){
      var hvWin = window.open('https://hentaiverse.org/fakepage');
      var msgToHv = createMessage('request for equips', JSON.stringify(equips));
      //Send request after the window opens
      setTimeout(function(){
        hvWin.postMessage(msgToHv, 'https://hentaiverse.org/fakepage');
      }, 1500);
      //When the response is received, proceed to saveDisplayGears()
      window.addEventListener('message', function(forumsEvent) {
        if (forumsEvent.origin === 'https://hentaiverse.org') {
          var msg = JSON.parse(forumsEvent.data);
          if (msg.postedMessage && msg.postedMessage.string === 'here are equips' && msg.postedMessage.object){
            hvWin.close();
            saveDisplayGears(msg.postedMessage.object, btn);
          }
        }
      });
    }
    function saveDisplayGears(equips, btn){
      btn.textContent = 'Saving levels of ' + equips.length + ' gears';
      dbGet(function(obj){
        SmartSearch = obj;
        if (!SmartSearch.savedEquips)
          SmartSearch.savedEquips = {};
        equips.forEach(function(equip){
          if (equip.level !== equip.info)
            SmartSearch.savedEquips[equip.eid] = {key:equip.key, level:equip.level, info:equip.info};
          else
            SmartSearch.savedEquips[equip.eid] = {key:equip.key, level:equip.level};
        });
        dbSet(SmartSearch, function(){
          btn.textContent = 'Saved levels of ' + equips.length + ' gears';
          refreshLevels();
        });
      });
    }

    function ago(num){
      var daysAgo = Math.round((now - num) / (1000 * 3600 * 24));
      if (daysAgo < 364){
        if (daysAgo < daysAgoLimit)
          return [daysAgo + ' days ago', false];
        else
          return [daysAgo + ' days ago', true];
      }
      else
        return [Math.round(daysAgo / 36.5) / 10 + ' years ago', 1];
    }

    //Sort by level
    table.children[0].children[0].children[4].addEventListener('click', function(){
      showingStats = false;
      var trs = [];
      for (var i = table.children[1].children.length - 1; i >= 0; i--){
        var tr = table.children[1].children[i];
        if (tr.className !== 'info')
          trs.push(tr);
        table.children[1].removeChild(tr);
      }
      trs.sort(function(a, b){
        return levelValue(b.children[4].textContent) - levelValue(a.children[4].textContent);
      });
      function levelValue(levelText){
        if (levelText === 'No such item')
          return -3;
        else if (levelText === 'Soulbound')
          return -2;
        else if (!levelText)
          return -1;
        else if (levelText === 'Unassigned')
          return 501;
        else
          return 500 - levelText;
      }
      trs.forEach(function(tr){
        table.children[1].appendChild(tr);
      });
    });

    //Sort by price
    table.children[0].children[0].children[3].addEventListener('click', function(){
      showingStats = false;
      var trs = [];
      for (var i = table.children[1].children.length - 1; i >= 0; i--){
        var tr = table.children[1].children[i];
        if (tr.className !== 'info')
          trs.push(tr);
        table.children[1].removeChild(tr);
      }
      trs.sort(function(a, b){
        return priceValue(b.children[3].textContent) - priceValue(a.children[3].textContent);
      });
      function priceValue(priceText){
        if (!priceText)
          return -999999;
        priceText = priceText.replace(/,/g, '').toLowerCase();
        var priceNumber;
        try {
          priceNumber = priceText.match(/\d+\.?(\d+)?/)[0];
        } catch (err) {
          return -499999;
        }
        if (priceText.substring(priceText.length - 1) === 'k')
          priceNumber *= 1000;
        else if (priceText.substring(priceText.length - 1) === 'm')
          priceNumber *= 1000000;
        return priceNumber / 1000000;
      }
      trs.forEach(function(tr){
        table.children[1].appendChild(tr);
      });
    });

    //Sort by eid
    table.children[0].children[0].children[2].addEventListener('click', function(){
      showingStats = false;
      var trs = [];
      for (var i = table.children[1].children.length - 1; i >= 0; i--){
        var tr = table.children[1].children[i];
        if (tr.className !== 'info')
          trs.push(tr);
        table.children[1].removeChild(tr);
      }
      trs.sort(function(a, b){
        return parseInt(b.children[2].textContent||0) - parseInt(a.children[2].textContent||0);
      });
      trs.forEach(function(tr){
        table.children[1].appendChild(tr);
      });
    });

    //Sort by date
    table.children[0].children[0].children[7].addEventListener('click', function(){
      showingStats = false;
      var trs = [];
      for (var i = table.children[1].children.length - 1; i >= 0; i--){
        var tr = table.children[1].children[i];
        if (tr.className !== 'info')
          trs.push(tr);
        table.children[1].removeChild(tr);
      }
      trs.sort(function(a, b){
        return parseInt(b.dataset.edited||0) - parseInt(a.dataset.edited||0);
      });
      trs.forEach(function(tr){
        table.children[1].appendChild(tr);
      });
    });
    table.children[0].children[0].children[7].click();

    checkUpdate();
  });


  var ignoredDiv;
  function makeIgnoreInterface(threadId, post, str){
    if (ignoredDiv)
      return;

    var thread = SmartSearch[forum][threadId];

    ignoredDiv = w.document.body.insertBefore(w.document.createElement('div'), w.document.body.children[0]);
    ignoredDiv.className = 'ignoredDiv';

    var addToIgnoredThreads = ignoredDiv.appendChild(w.document.createElement('button'));
    addToIgnoredThreads.textContent = 'Always ignore thread by ' + thread.opName + ' titled "' + thread.title + '"?';
    addToIgnoredThreads.addEventListener('click', function(){
      if (inProgress !== false){
        addToIgnoredThreads.textContent = 'Another transaction is in progress, please wait';
        setTimeout(function(){
          addToIgnoredThreads.textContent = 'Always ignore thread by ' + thread.opName + ' titled "' + thread.title + '"?';
        }, 1500);
        return;
      }
      SmartSearch.ignored.threads[thread.threadId] = thread;
      dbSet(SmartSearch, function(){
        w.close();
        search.click();
      });
    });
    ignoredDiv.appendChild(w.document.createElement('br'));
    ignoredDiv.appendChild(w.document.createElement('br'));

    var addToIgnoredPosts = ignoredDiv.appendChild(w.document.createElement('button'));
    str = str.replace(/<\/?[^>]+(>|$)/g, '');
    addToIgnoredPosts.textContent = 'Always ignore the post in this thread that includes "' + str + '"?';
    addToIgnoredPosts.addEventListener('click', function(){
      if (inProgress !== false){
        addToIgnoredPosts.textContent = 'Another transaction is in progress, please wait';
        setTimeout(function(){
          addToIgnoredPosts.textContent = 'Always ignore the post in this thread that includes "' + str + '"?';
        }, 1500);
        return;
      }
      var ignoredPost = {postId:post.postId, threadId:thread.threadId, opName:thread.opName, title:thread.title, str:str};
      SmartSearch.ignored.posts[post.postId] = ignoredPost;
      dbSet(SmartSearch, function(){
        w.close();
        search.click();
      });
    });
    ignoredDiv.appendChild(w.document.createElement('br'));
    ignoredDiv.appendChild(w.document.createElement('br'));

    var deleteFromDb = ignoredDiv.appendChild(w.document.createElement('button'));
    deleteFromDb.textContent = 'Completely remove this thread from the database?';
    deleteFromDb.addEventListener('click', function(){
      if (inProgress !== false){
        deleteFromDb.textContent = 'Another transaction is in progress, please wait';
        setTimeout(function(){
          deleteFromDb.textContent = 'Completely remove this thread from the database?';
        }, 1500);
        return;
      }
      delete SmartSearch[forum][threadId];
      dbSet(SmartSearch, function(){
        reload.click();
      });
    });

    ignoredDiv.appendChild(w.document.createElement('br'));
    ignoredDiv.appendChild(w.document.createElement('br'));

    ignoredDiv.appendChild(w.document.createElement('span')).textContent = 'Ignored threads';
    var ignoredThreadsTable = ignoredDiv.appendChild(w.document.createElement('table'));
    Object.keys(SmartSearch.ignored.threads).forEach(function(threadId){
      var ignoredThread = SmartSearch.ignored.threads[threadId];
      var tr = ignoredThreadsTable.appendChild(w.document.createElement('tr'));
      tr.appendChild(w.document.createElement('td')).textContent = ignoredThread.opName;
      tr.appendChild(w.document.createElement('td')).innerHTML = '<a href="https://forums.e-hentai.org/index.php?showtopic=' + ignoredThread.threadId + '">' + ignoredThread.title + '</a>';
      var removeIgnoreButton = tr.appendChild(w.document.createElement('td')).appendChild(w.document.createElement('button'));
      removeIgnoreButton.textContent = 'Remove from ignoredThreads';
      removeIgnoreButton.addEventListener('click', function(){
        if (inProgress !== false){
          removeIgnoreButton.textContent = 'Another transaction is in progress, please wait';
          setTimeout(function(){
            removeIgnoreButton.textContent = 'Remove from ignoredThreads';
          }, 1500);
        }
        delete SmartSearch.ignored.threads[threadId];
        dbSet(SmartSearch, function(){
          ignoredThreadsTable.removeChild(tr);
        });
      });
    });
    ignoredDiv.appendChild(w.document.createElement('br'));
    ignoredDiv.appendChild(w.document.createElement('br'));

    ignoredDiv.appendChild(w.document.createElement('span')).textContent = 'Ignored posts';
    var ignoredPostsTable = ignoredDiv.appendChild(w.document.createElement('table'));
    ignoredPostsTable.className = 'ignoredPosts';
    Object.keys(SmartSearch.ignored.posts).forEach(function(postId){
      var ignoredPost = SmartSearch.ignored.posts[postId];
      var tr = ignoredPostsTable.appendChild(w.document.createElement('tr'));
      tr.appendChild(w.document.createElement('td')).textContent = ignoredPost.opName;
      tr.appendChild(w.document.createElement('td')).innerHTML = '<a href="https://forums.e-hentai.org/index.php?showtopic=' + ignoredPost.threadId + '&view=findpost&p=' + ignoredPost.postId + '">' + ignoredPost.title + '</a>';

      var removeIgnoreButton = tr.appendChild(w.document.createElement('td')).appendChild(w.document.createElement('button'));
      removeIgnoreButton.textContent = 'Remove from ignoredPosts';
      removeIgnoreButton.addEventListener('click', function(){
        if (inProgress !== false){
          removeIgnoreButton.textContent = 'Another transaction is in progress, please wait';
          setTimeout(function(){
            removeIgnoreButton.textContent = 'Remove from ignoredPosts';
          }, 1500);
          return;
        }
        delete SmartSearch.ignored.posts[postId];
        dbSet(SmartSearch, function(){
          ignoredPostsTable.removeChild(tr);
        });
      });

      tr.appendChild(w.document.createElement('td')).textContent = '...' + ignoredPost.str.substring(0, 80) + '...';
    });
    ignoredDiv.appendChild(w.document.createElement('br'));
    ignoredDiv.appendChild(w.document.createElement('br'));

    var close = ignoredDiv.appendChild(w.document.createElement('button'));
    close.textContent = 'Close';
    close.addEventListener('click', function(){
      w.document.body.removeChild(ignoredDiv);
      ignoredDiv = null;
    });
    ignoredDiv.appendChild(w.document.createElement('br'));
    ignoredDiv.appendChild(w.document.createElement('br'));

    var reload = ignoredDiv.appendChild(w.document.createElement('button'));
    reload.textContent = 'Reload interface';
    reload.addEventListener('click', function(){
      w.close();
      search.click();
    });
    w.scrollTo(0, 0);
  }
  function checkUpdate(){
    var img = w.document.body.appendChild(w.document.createElement('img'));
    img.src = 'https://reasoningtheory.net/ping';
    img.style.display = 'none';
    var b = new XMLHttpRequest();
    b.open('POST', 'https://reasoningtheory.net/EHCheckScriptVersion.php');
    b.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    b.onreadystatechange = checkDone;
    function checkDone() {
      if (b.readyState === 4 && b.status === 200) {
        var response = JSON.parse(b.responseText);
        if (response.version && parseInt(response.version.replace(/\./g, '')) > parseInt(version.replace(/\./g, ''))){
          var div = w.document.body.insertBefore(w.document.createElement('div'), w.document.body.children[0]);
          div.appendChild(w.document.createElement('br'));
          div.appendChild(w.document.createElement('br'));
          var updateLink = w.document.createElement('a');
          updateLink.href = response.link;
          updateLink.textContent = 'New version: ' + response.version;
          div.appendChild(updateLink);
          var ul = w.document.createElement('ul');
          response.notes.forEach(function(note){
            ul.appendChild(w.document.createElement('li')).textContent = note;
          });
          div.appendChild(ul);
        }
      }
    }
    b.send('name=SmartSearch&version=' + version);
  }
});

var save = searchDiv.appendChild(document.createElement('button'));
save.textContent = 'Save';
save.style['margin-left'] = '30px';
save.addEventListener('click', function(){
  save.disabled = true;
  save.textContent = 'Downloading...';
  var threadIds = [];
  dbGet(function(obj){
    SmartSearch = obj;
    if (typeof SmartSearch[forum] === 'undefined')
      SmartSearch[forum] = {};
    [].forEach.call(document.getElementsByClassName('ipbtable')[1].getElementsByTagName('tr'), function(tr){
      var threadId = tr.children[0].id.match(/\d+/);
      if (!threadId)
        return;
      if(!checkInit.inited || checkIds[threadId[0]].checked) {
        threadIds.push(threadId[0]);
      }
    });
    var numResponses = 0;
    var https = /https:/.test(window.location.href) ? 's' : '';
    threadIds.forEach(function(threadId){
      get('http' + https + '://forums.e-hentai.org/index.php?showtopic=' + threadId, function(response){
        //response = response.replace(/<img[^>]*>/g, '');
        var locked = false;
        if (response.querySelectorAll('.ipbtable img[border="0"]')[1].src.includes('t_closed.gif'))
          locked = true;
        var title = response.querySelector('.borderwrap b').textContent;
        var postElms = [].slice.call(response.querySelectorAll('.borderwrap tbody > tr:nth-child(2)'));
        if (postElms.length === 0){ //empty thread
          tryFinish();
          return;
        }
        var posts = [];
        while(postElms[0].getElementsByClassName('radiobutton').length !== 0 || postElms[0].children.length !== 2) //poll (votable), or likely poll (already voted)
          postElms.splice(0, 1);
        var opName = getPosterName(postElms[0]);
        var postnum = 0;
        [].forEach.call(postElms, function(post){
          postnum++;
          try {
            if (getPosterName(post) !== opName)
              return;
          }
          catch (except){
            return;
          }
          var postId = post.children[1].id.match(/\d+/)[0];
          var postContentElm = post.children[1].children[0];
          if (postContentElm.textContent === ''){
            if (typeof post.children[1].children[1] === 'undefined')
              return;
            postContentElm = post.children[1].children[1]; //Cutie Mark
          }
          var postHtml = postContentElm.innerHTML;
          [].forEach.call(postContentElm.getElementsByClassName('quotetop'), function(quoteTopElm){
            postHtml = postHtml.replace(quoteTopElm.outerHTML, '');
          });
          [].forEach.call(postContentElm.getElementsByClassName('quotemain'), function(quoteMainElm){
            postHtml = postHtml.replace(quoteMainElm.outerHTML, '');
          });
          [].forEach.call(postContentElm.getElementsByTagName('a'), function(a){
            if (a.href.indexOf('hentaiverse') === -1)
            postHtml = postHtml.replace(a.outerHTML, '');
          });

          var replacements = [
          [/&nbsp;/g, ' '],
          [/\s+/g, ' '],
          [/<br[^>]*>/g, '\n'],
          [/<li>/g, '\n'],
          [/<strike>/g, '[s]'],
          [/<\/strike>/g, '[/s]'],
          //[/<\/?[^>]+(>|$)/g, ''], //remove all html tags
          [/<\/?([^a\/]|a\w)[^>]*(>|$)/g, ''], //remove all html tags except <a>,</a>
          [/\srel="[^"]+"/g, ''],
          [/\starget="[^"]+"/g, ''],
          [/&lt;/g, '<'],
          [/&gt;/g, '>']];
          var postText = postHtml;
          replacements.forEach(function(replacement){
            postText = postText.replace(replacement[0], replacement[1]);
          });
          var lastEdited;
          var editElms = postContentElm.getElementsByClassName('edit');
          if (editElms.length > 0){
            var editStr1 = editElms[0].innerHTML.match(/<\/b>:\s(.+)$/)[1];
            lastEdited = getDateFromForumStr(editStr1);
          } else {
            var editStr2 = post.previousSibling.previousSibling.getElementsByTagName('span')[0].textContent.trim();
            lastEdited = getDateFromForumStr(editStr2);
          }
          posts.push({postId:postId, postText:postText, lastEdited:lastEdited});
        });
        var thread = {};
        thread.threadId = threadId;
        thread.locked = locked;
        thread.opName = opName;
        thread.title = title;
        thread.posts = posts;
        thread.dateSaved = Date.now();
        SmartSearch[forum][threadId] = thread;
        tryFinish();
      });
    });
    function getPosterName(post){
      return post.children[0].getElementsByTagName('a')[0].textContent;
    }
    function tryFinish(){
      numResponses++;
      if (numResponses < threadIds.length)
        return;
      dbSet(SmartSearch, function(){
        save.textContent = 'Saved';
        save.style.cssText = 'margin-left:30px; background-color:#33cccc; color:black;';
      });
    }
    function getDateFromForumStr(str){
      if (/Yesterday/.test(str))
        return Date.now() - (1000*3600*24);
      else if (/Today/.test(str))
        return Date.now();
      else
        return Date.UTC(/\d{4}/.exec(str), getMonthFromString(str.substring(0, 3)), str.substring(4, 6));
    }
    function getMonthFromString(mon){
      return new Date(Date.parse(mon + ' 1, 2016')).getMonth();
    }
  });
});

document.head.appendChild(document.createElement('style')).innerHTML = `
  .ss-excluded > td {background-color:#ddd}
  .ss-checked > td {background-color:#fec}
`;
var checkIds = {};
var checkExclusions = ["1790314"]; // 1790314=FreeSHop
var checkInit = document.createElement("input");
searchDiv.appendChild(document.createElement("label")).append(checkInit,"Save checked threads only");
checkInit.type = "checkbox";
checkInit.style.marginLeft = "20px";
checkInit.addEventListener("change",function(e){
  if(!checkInit.inited) {
    checkInit.inited = true;
    [].forEach.call(document.getElementsByClassName('ipbtable')[1].getElementsByTagName('tr'), function(tr){
      var threadId = tr.children[0].id.match(/\d+/);
      if (!threadId)
        return;
      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.style.cssText = "position:absolute;margin:0;left:20px";
      if(tr.children[2].textContent.trim().startsWith("Pinned: ")) {
        checkbox.dataset.pinned = "pinned";
      }
      if(tr.children[4].children[0].href.match(/showuser=(\d+)/) && checkExclusions.includes(RegExp.$1)) {
        checkbox.dataset.excluded = "excluded";
        tr.classList.add("ss-excluded");
      }
      checkbox.addEventListener("change",function(){
        tr.classList[this.checked?"add":"remove"]("ss-checked");
      });
      tr.cells[1].appendChild(checkbox);
      checkIds[threadId[0]] = checkbox;
    });
    checkInit.nextSibling.nodeValue = "Check/Uncheck All";
  }
  var checked = checkInit.checked;
  for(let id in checkIds) {
    if(checkIds[id].checked!==checked && !checkIds[id].dataset.excluded && !checkIds[id].dataset.pinned) {
      checkIds[id].click();
    }
  }
});

var manage = searchDiv.appendChild(document.createElement("button"));
manage.textContent = "Manage Database";
manage.style.marginLeft = "30px";
manage.addEventListener("click",function(){
  manage.disabled = true;

  var backup = searchDiv.appendChild(document.createElement("button"));
  backup.textContent = "Backup";
  backup.style.marginLeft = "10px";
  var link = searchDiv.appendChild(document.createElement("a"));
  var date = new Date();
  link.download = "SmartSearch_" + ({"77":"WTS","78":"WTB"})[forum] + "_" + (date.getFullYear()+("0"+(date.getMonth()+1)).slice(-2)+("0"+date.getDate()).slice(-2)) +".json";
  link.style.display = "none";
  backup.addEventListener("click",function(){
    dbGet(function(obj){
      window.URL.revokeObjectURL(link.href);
      link.href = window.URL.createObjectURL( new Blob([JSON.stringify({key:forum,value:obj.hasOwnProperty(forum)?obj[forum]:{}})],{type:"application/json"}) );
      link.click();
    });
  });

  var restore = searchDiv.appendChild(document.createElement("button"));
  restore.textContent = "Restore";
  restore.style.marginLeft = "10px";
  var restoreFile = document.createElement("input");
  restoreFile.type = "file";
  restoreFile.style.cssText = "margin:0;border:0;padding:0;vertical-align:baseline;background:none";
  searchDiv.appendChild(restoreFile);
  restore.addEventListener("click",function(){
    var file = restoreFile.files[0];
    if (!file) {
      alert("Select a file first");
      return;
    }
    var reader = new FileReader();
    reader.onload = function(e) {
      var json;
      try {
        json = JSON.parse(e.target.result);
        if(!json.key || !json.value) {
          alert("Invalid JSON");
          return;
        }
      } catch(e) {
        alert("Failed to parse the file\n\nSelect a valid SmartSearch_*.json file");
        return;
      }
      dbGet(function(obj){
        if(!obj[json.key] || !confirm("[OK] Just merge the file with the dabatase\n[Cancel] Clear the database and replace with the file")) {
          obj[json.key] = {};
        }
        Object.assign(obj[json.key],json.value);
        dbSet(obj,function(){
          alert("Restored SmartSearch Database successfully");
        });
      });
    };
    reader.onerror = function() {
      alert("Failed to read the file");
    };
    reader.readAsText(file);
  });

  var del = searchDiv.appendChild(document.createElement("button"));
  del.textContent = "Delete";
  del.style.marginLeft = "10px";
  del.addEventListener("click",function(){
    if(!confirm("This will delete the current SmartSearch Database in the browser.\nAre you sure?")) {
      return;
    }
    localStorage.removeItem("SmartSearch");
    dbDelete(function(){ alert('Deleted\nRefresh the page'); });
  });
});


//The database is always updated by the variable, not the other way around, except at the very beginning when getting the object for the first time

var inProgress = false;

function error(str){
  console.log(str);
  var errorDiv = searchDiv.appendChild(document.createElement('h2'));
  errorDiv.textContent = str;
  errorDiv.style.color = 'red';
}

function dbDelete(callback){
  inProgress = true;
  var DBDeleteRequest = window.indexedDB.deleteDatabase("SmartSearchDb");
  DBDeleteRequest.onerror = function(event) {
    error('Error deleting db ' + event.target.errorCode);
  };
  DBDeleteRequest.onsuccess = function(event) {
    console.log('Db deleted');
    inProgress = false;
    callback();
  };
}

function dbCreate(callback){
  inProgress = true;
  var dbRequest = window.indexedDB.open("SmartSearchDb", 2);
  dbRequest.onupgradeneeded = function (event) {
    console.log('Creating objectStore');
    var db = event.target.result;
    db.onerror = function(event) {
      error('dbCreate: Error on creating objectStore: ' + event.target.errorCode);
    };
    db.createObjectStore("SmartSearchObjectStore", {keyPath: "SmartSearchObjectStoreKey", autoIncrement: true});
  };
  dbRequest.onsuccess = function(event) {
    console.log('Adding default object');
    var db = dbRequest.result;
    var transaction = db.transaction(['SmartSearchObjectStore'], 'readwrite');
    transaction.oncomplete = function(event) {
      inProgress = false;
      callback();
    };
    transaction.onerror = function(event) {
      error('dbCreate: Error adding default object ' + event.target.errorCode);
    };
    transaction.objectStore("SmartSearchObjectStore").add({SmartSearchObjectStoreKey: '1', obj: JSON.stringify({
      ignored: { threads: {}, posts: {}},
      savedEquips: {},
    })});
  };
  dbRequest.onerror = function(event) {
    error('dbCreate: Error opening db ' + event.target.errorCode);
  };
}

function dbSet(obj, callback){
  inProgress = true;
  var dbRequest = window.indexedDB.open("SmartSearchDb");
  dbRequest.onsuccess = function(event) {
    var db = dbRequest.result;
    var transaction = db.transaction(['SmartSearchObjectStore'], 'readwrite');
    var objectStore = transaction.objectStore("SmartSearchObjectStore");

    var getRequest = objectStore.get('1');
    getRequest.onsuccess = function(event){
      getRequest.result.obj = JSON.stringify(obj);
      objectStore.put(getRequest.result);
      inProgress = false;
      callback();
    };
    transaction.onerror = function(event) {
      error('dbSet: Error on transaction ' + event.target.errorCode);
    };
    getRequest.onerror = function(event) {
      error('dbSet: Error on getRequest ' + event.target.errorCode);
    };
  };
  dbRequest.onerror = function(event) {
    error('dbSet: Error opening db ' + event.target.errorCode);
  };
}

function dbGet(callback){
  inProgress = true;
  var dbRequest = window.indexedDB.open("SmartSearchDb");
  dbRequest.onsuccess = function(event) {
    var db = dbRequest.result;
    var getRequest = db.transaction(["SmartSearchObjectStore"],"readwrite").objectStore("SmartSearchObjectStore").get('1');
    getRequest.onsuccess = function(event){
      inProgress = false;
      var obj = JSON.parse(getRequest.result.obj);
      if (/showforum/.test(Object.keys(obj)[0])){
        obj = {};
      }
      callback(obj);
    };
    getRequest.onerror = function(event) {
      error('dbGet: Error on getRequest ' + event.target.errorCode);
    };
  };
  dbRequest.onerror = function(event) {
    error('dbGet: Error opening db ' + event.target.errorCode);
  };
}

//dbCreate(function(){ alert('Created'); });
//dbDelete(function(){ alert('Deleted'); });

//dbSet({'example2':'object2'}, function(){ alert('Setted'); });
//dbGet(function(obj){ alert('Getted obj is ' + JSON.stringify(obj)); });

function get(url, done){
  const r = new XMLHttpRequest();
  r.open('GET', url, true);
  r.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  r.responseType = 'document';
  r.onload = function () {
    if (r.readyState !== 4)
      return;
    if (r.status === 200){
      done(r.response);
    }
  };
  r.send();
}


function sendEquipRanges(){
  // https://forums.e-hentai.org/index.php?showtopic=53281
  if (/https/.test(window.location.href))
    alert('Can\'t post to HTTP from HTTPS');
  dbGet(function(obj){
    SmartSearch = obj;
    allEquips = [];
    function add(forum){
      Object.keys(SmartSearch[forum]).forEach(function(threadId){
        var thread = SmartSearch[forum][threadId];
          thread.posts.forEach(function(post){
          var lines = post.postText.split('\n');
          lines.forEach(function(line){
            var equipLink = line.match(/\.php\?eid=(\d+)\&amp;key=(\w+)/);
            while (equipLink){
              allEquips.push({'eid':equipLink[1], 'key':equipLink[2]});
              line = line.substring(line.indexOf(equipLink[2]));
              equipLink = line.match(/\.php\?eid=(\d+)&key=(\w+)\//);
            }
          });
        });
      });
    }
    add(77);
    add(78);
    var w = window.open();
    w.document.body.appendChild(w.document.createElement('div')).value = 'Equips found: ' + allEquips.length;
    w.document.body.appendChild(w.document.createElement('textarea')).value = JSON.stringify(allEquips);
  });

  if (!/https/.test(window.location.href)){
    var w = window.open();
    var textarea = w.document.body.appendChild(w.document.createElement('textarea'));
    w.document.body.appendChild(w.document.createElement('br'));
    w.document.body.appendChild(w.document.createElement('br'));
    var button = w.document.body.appendChild(w.document.createElement('button'));
    button.textContent = 'send';
    button.addEventListener('click', function(){
      if (textarea.value.length < 50){
        alert('textarea is too short');
        return;
      }
      var exists = new XMLHttpRequest();
      var data = new FormData();
      data.append('action', 'store');
      data.append('equipment', textarea.value);
      exists.open("POST","http://hvitems.niblseed.com/",false);
      exists.send( data );
      button.textContent = 'sent';
    });
  }
}
//sendEquipRanges();
//If you want to help out the effort on the wiki to figure out equipment ranges:
//Then every so often, use sendEquipRanges to send all equipment URLs found in threads:
//Uncomment sendEquipRanges. If you use HTTPS then copy everything in the text field, navigate to HTTP, paste it into the text field, press the button, and wait a few seconds.









function parseEquip(data, item){
  var ranges = [
    ['ADB', 67.83, 75.92, ['axe', 'slaughter']],
    ['ADB', 54.16, 59.87, ['axe'], ['slaughter']],
    ['ADB', 59.21, 67.72, ['club', 'slaughter']], //https://hentaiverse.org/pages/showequip.php?eid=115176184&key=487667fdfa
    ['ADB', 45.36, 53.04, ['club'], ['slaughter']],
    ['ADB', 42.8, 51.33, ['rapier', 'slaughter']],
    ['ADB', 31.95, 39.38, ['rapier'], ['slaughter']],
    ['Parry', 23.81, 26.94, ['rapier', 'nimble']],
    ['Parry', 16.3, 18.89, ['rapier'], ['nimble']],
    ['ADB', 53.41, 61.58, ['shortsword', 'slaughter']],
    ['ADB', 41.26, 47.92, ['shortsword'], ['slaughter']],
    ['ADB', 39.84, 46.21, ['wakizashi', 'slaughter']],
    ['ADB', 30.49, 35.11, ['wakizashi'], ['slaughter']],
    ['Parry', 27.67, 30.53, ['wakizashi', 'nimble']],
    ['Parry', 19.97, 22.48, ['wakizashi'], ['nimble']],

    ['ADB', 73.29, 82.07, ['estoc', 'slaughter']],
    ['ADB', 58.13, 64.99, ['estoc'], ['slaughter']],
    ['ADB', 86.45, 98.47, ['longsword', 'slaughter']],
    ['ADB', 68.94, 78.66, ['longsword'], ['slaughter']],
    ['ADB', 73.38, 82.07, ['mace', 'slaughter']],
    ['ADB', 58.09, 64.99, ['mace'], ['slaughter']],
    ['ADB', 72.61, 82.07, ['katana', 'slaughter']],
    ['ADB', 57.39, 64.99, ['katana'], ['slaughter']],

    ['MDB', 46.07, 52.2, ['katalox', 'destruction']],
    ['MDB', 28.09, 32.4, ['katalox'], ['destruction']],
    ['MDB', 45.95, 51.71, ['redwood', 'destruction']],
    ['MDB', 27.76, 31.99, ['redwood'], ['destruction']],
    ['MDB', 44.93, 51.71, ['willow', 'destruction']],  //https://hentaiverse.org/pages/showequip.php?eid=126921600&key=b796b51c3d
    ['MDB', 27.76, 31.99, ['willow'], ['destruction']],
    ['MDB', 27.77, 31.99, ['oak']], //https://hentaiverse.org/equip/135938071/e00834649e

    ['EDB', 33.92, 37.84, ['hallowed katalox', 'heimdall']],
    ['EDB', 19.05, 21.76, ['hallowed katalox'], ['heimdall']],
    ['EDB', 33.92, 37.84, ['demonic katalox', 'fenrir']],
    ['EDB', 19.05, 21.76, ['demonic katalox'], ['fenrir']],

    ['EDB', 38.11, 42.68, ['hallowed oak', 'heimdall']],
    ['EDB', 23.01, 26.6, ['hallowed oak'], ['heimdall']],

    ['EDB', 34.42, 37.4, ['tempestuous redwood', 'freyr']], //https://hentaiverse.org/pages/showequip.php?eid=113172450&key=5a980f3474
    ['EDB', 18.97, 21.78, ['tempestuous redwood'], ['freyr']], //https://hentaiverse.org/pages/showequip.php?eid=128883702&key=7823a528d1
    ['EDB', 34.42, 37.4, ['shocking redwood', 'mjolnir']],
    ['EDB', 18.97, 21.78, ['shocking redwood'], ['mjolnir']],
    ['EDB', 34.42, 37.4, ['arctic redwood', 'niflheim']],
    ['EDB', 18.97, 21.78, ['arctic redwood'], ['niflheim']],
    ['EDB', 34.42, 37.4, ['fiery redwood', 'surtr']],
    ['EDB', 18.97, 21.78, ['fiery redwood'], ['surtr']],

    ['EDB', 16.41, 18.56, ['tempestuous willow']],
    ['EDB', 16.41, 18.56, ['shocking willow']],
    ['EDB', 22.92, 26.6, ['demonic willow']],
    ['EDB', 10.28, 11.33, ['fiery willow']],
    ['EDB', 10.28, 11.33, ['arctic willow']],
    ['EDB', 10.28, 11.33, ['hallowed willow']],

    ['Int', 6.12, 7.22, ['katalox']],
    ['Wis', 4.13, 4.82, ['katalox']],
    ['Int', 5.46, 6.33, ['redwood']],
    ['Wis', 5.46, 6.33, ['redwood']],
    ['Int', 4.13, 4.83, ['willow']],
    ['Wis', 6.12, 7.23, ['willow']],
    ['Int', 4.14, 4.83, ['oak']],
    ['Wis', 6, 7.23, ['oak']],


    ['BLK', 33.43, 37.52, ['buckler', 'barrier']], //https://hentaiverse.org/pages/showequip.php?eid=115077551&key=44ca1fa116, http://hentaiverse.org/pages/showequip.php?eid=115253588&key=3a324ad469
    ['BLK', 27.67, 31.03, ['buckler'], ['barrier']],
    ['BLK', 32.63, 36.02, ['kite']],
    ['BLK', 35.64, 38.52, [' force']], //reinforced

    ['EDB', 15.12, 16.97, ['phase cap']],
    ['Int', 6, 7.08, ['phase cap']],
    ['Wis', 6, 7.08, ['phase cap']],
    ['Agi', 5.07, 6.03, ['phase cap']],
    ['Evd', 4.7, 5.28, ['phase cap']],
    ['Pmit', 3.01, 3.38, ['phase cap']],

    ['EDB', 18.02, 20.18, ['phase robe']],
    ['Int', 7.14, 8.43, ['phase robe']],
    ['Wis', 7.14, 8.43, ['phase robe']],
    ['Agi', 6.03, 7.17, ['phase robe']],
    ['Evd', 5.6, 6.28, ['phase robe']],
    ['Pmit', 3.57, 4.01, ['phase robe']],

    ['EDB', 13.66, 15.36, ['phase gloves']],
    ['Int', 5.43, 6.42, ['phase gloves']],
    ['Wis', 5.43, 6.42, ['phase gloves']],
    ['Agi', 4.59, 5.46, ['phase gloves']],
    ['Evd', 4.25, 4.78, ['phase gloves']],
    ['Pmit', 2.73, 3.07, ['phase gloves']],

    ['EDB', 16.58, 18.58, ['phase pants']],
    ['Int', 6.57, 7.77, ['phase pants']],
    ['Wis', 6.57, 7.77, ['phase pants']],
    ['Agi', 5.55, 6.6, ['phase pants']],
    ['Evd', 5.15, 5.78, ['phase pants']],
    ['Pmit', 3.28, 3.7, ['phase pants']],

    ['EDB', 12.23, 13.75, ['phase shoes']],
    ['Int', 4.86, 5.73, ['phase shoes']],
    ['Wis', 4.86, 5.73, ['phase shoes']],
    ['Agi', 4.11, 4.89, ['phase shoes']],
    ['Evd', 3.8, 4.28, ['phase shoes']],
    ['Pmit', 2.44, 2.75, ['phase shoes']],


    ['Prof', 7.38, 8.29, ['cotton cap']],
    ['Prof', 8.79, 9.89, ['cotton robe']],
    ['Prof', 6.68, 7.5, ['cotton gloves']],
    ['Prof', 8.08, 9.09, ['cotton pants']],
    ['Prof', 5.97, 6.7, ['cotton shoes']],


    ['Int', 5.31, 6.33, ['cotton cap']],
    ['Wis', 5.31, 6.33, ['cotton cap']],
    ['Agi', 4.08, 4.83, ['cotton cap']],
    ['Evd', 3.45, 4.03, ['cotton cap']],
    ['Pmit', 3.95, 4.43, ['cotton cap'], ['protection']],

    ['Int', 6.3, 7.53, ['cotton robe']],
    ['Wis', 6.3, 7.53, ['cotton robe']],
    ['Agi', 4.83, 5.73, ['cotton robe']],
    ['Evd', 4.11, 4.78, ['cotton robe']],
    ['Pmit', 4.71, 5.27, ['cotton robe'], ['protection']],

    ['Int', 4.8, 5.73, ['cotton gloves']],
    ['Wis', 4.8, 5.73, ['cotton gloves']],
    ['Agi', 3.69, 4.38, ['cotton gloves']],
    ['Evd', 3.13, 3.65, ['cotton gloves']],
    ['Pmit', 3.57, 4.01, ['cotton gloves'], ['protection']],

    ['Int', 5.82, 6.93, ['cotton pants']],
    ['Wis', 5.82, 6.93, ['cotton pants']],
    ['Agi', 4.47, 5.28, ['cotton pants']],
    ['Evd', 3.78, 4.4, ['cotton pants']],
    ['Pmit', 4.33, 4.85, ['cotton pants'], ['protection']],

    ['Int', 4.32, 5.13, ['cotton shoes']],
    ['Wis', 4.32, 5.13, ['cotton shoes']],
    ['Agi', 3.33, 3.93, ['cotton shoes']],
    ['Evd', 2.8, 3.28, ['cotton shoes']],
    ['Pmit', 3.19, 3.59, ['cotton shoes'], ['protection']],

    ['ADB', 9.37, 11.25, ['shade helmet']], //https://hentaiverse.org/pages/showequip.php?eid=106210856&key=4fbb85f2ae
    ['ADB', 11.09, 13.3, ['shade breastplate']], //https://hentaiverse.org/equip/135797961/c3f79353fe
    ['ADB', 8.53, 10.22, ['shade gauntlets']], //https://hentaiverse.org/?s=Bazaar&ss=la&lottery=1166
    ['ADB', 10.23, 12.28, ['shade leggings']], //https://hentaiverse.org/pages/showequip.php?eid=107182535&key=1051411ae1
    ['ADB', 7.67, 9.2, ['shade boots']], //https://hentaiverse.org/pages/showequip.php?eid=95898375&key=bc1d23301c

    ['ADB', 21.89, 25.73, ['power helmet', 'slaughter']],
    ['ADB', 13.18, 18.04, ['power helmet'], ['slaughter']],
    ['ADB', 25.4, 30.68, ['power armor', 'slaughter']],
    ['ADB', 15.42, 21.46, ['power armor'], ['slaughter']],
    ['ADB', 20.02, 23.25, ['power gauntlets', 'slaughter']],
    ['ADB', 11.82, 16.33, ['power gauntlets'], ['slaughter']],
    ['ADB', 23.94, 28.2, ['power leggings', 'slaughter']],
    ['ADB', 14.22, 19.75, ['power leggings'], ['slaughter']],
    ['ADB', 17.3, 20.77, ['power boots', 'slaughter']],
    ['ADB', 11, 14.63, ['power boots'], ['slaughter']] //https://forums.e-hentai.org/index.php?s=&showtopic=194413&view=findpost&p=4878569
  ];
  function getName(body){
    var nameDiv;
    if (typeof body.children[1] === 'undefined')
      return 'No such item';
    var showequip = body.children[1];
    if (showequip.children.length === 3)
      nameDiv = showequip.children[0].children[0];
    else
      nameDiv = showequip.children[1].children[0];
    var name = nameDiv.children[0].textContent;
    if (nameDiv.children.length === 3)
      name += ' ' + nameDiv.children[2].textContent;
    return name;
  }


  item.name = getName(data);
  if (item.name === 'No such item'){
    item.level = 'No such item';
    return item;
  }
  var dataText = data.innerHTML;
  if (/Soulbound/.test(dataText))
    item.level = 'Soulbound';
  else
    item.level = dataText.match(/Level\s([^\s]+)/)[1];
  item.info = item.level;
  if (/(Shield\s)|(Buckler)/.test(item.name)){
    item.info += ',';
    if (/Strength/.test(dataText))
      item.info += ' Str';
    if (/Dexterity/.test(dataText))
      item.info += ' Dex';
    if (/Endurance/.test(dataText))
      item.info += ' End';
    if (/Agility/.test(dataText))
      item.info += ' Agi';
  }
  item.badinfo = '';

  function getPxp0(pxpN, n){
    var pxp0Est = 300;
    for (var i = 1; i < 15; i++){
      var sumPxpNextLevel = 1000*(Math.pow(1+pxp0Est/1000, n + 1) - 1);
      var sumPxpThisLevel = 1000*(Math.pow(1+pxp0Est/1000, n) - 1);
      var estimate = sumPxpNextLevel - sumPxpThisLevel;
      if (estimate > pxpN)
        pxp0Est -= 300 / Math.pow(2, i);
      else
        pxp0Est += 300 / Math.pow(2, i);
    }
    return Math.round(pxp0Est);
  }

  var pxp0;
  var potencyStr = dataText.match(/Potency\sTier:\s([^\)]+\))/)[1];
  if (potencyStr === '10 (MAX)'){
    item.info += ', IW 10';
    if (/Peerless/.test(item.name))
      pxp0 = 400;
    else if (/Legendary/.test(item.name))
      pxp0 = 357;
    else if (/Magnificent/.test(item.name))
      pxp0 = 326;
    else
      pxp0 = 280; //too low to matter
  } else if (potencyStr[0] !== '0'){
    pxp0 = getPxp0(parseInt(potencyStr.match(/\d+(?=\))/)[0]), parseInt(potencyStr[0]));
    item.info += ', IW ' + potencyStr[0];
  } else
    pxp0 = parseInt(potencyStr.match(/(\d+)\)/)[1]);

  // statNames: [abbreviated name, forging name, html name, base multiplier, level scaling factor]
  var statNames = [['ADB', 'Physical Damage', 'Attack Damage', 0.0854, 50/3],
    ['MDB', 'Magical Damage', 'Magic Damage', 0.082969, 50/3 ],
    ['Pmit', 'Physical Defense', 'Physical Mitigation', 0.021, 2000],
    ['Mmit', 'Magical Defense', 'Magical Mitigation', 0.0201, 2000],
    ['BLK', 'Block Chance', 'Block Chance', 0.0998, 2000],
    ['Parry', 'Parry Chance', 'Parry Chance', 0.0894, 2000],
    ['Prof', 'Elemental Proficiency', 'Elemental', 0.0306, 250/7],
    ['Prof', 'Divine Proficiency', 'Divine', 0.0306, 250/7],
    ['Prof', 'Forbidden Proficiency', 'Forbidden', 0.0306, 250/7],
    ['Str', 'Strength Bonus', 'Strength', 0.03, 250/7],
    ['Dex', 'Dexterity Bonus', 'Dexterity', 0.03, 250/7],
    ['End', 'Endurance Bonus', 'Endurance', 0.03, 250/7],
    ['Agi', 'Agility Bonus', 'Agility', 0.03, 250/7],
    ['Int', 'Intelligence Bonus', 'Intelligence', 0.03, 250/7],
    ['Wis', 'Wisdom Bonus', 'Wisdom', 0.03, 250/7],
    ['Evd', 'Evade Chance', 'Evade Chance', 0.025, 2000],
    ['EDB', 'Holy Spell Damage', 'Holy', 0.0804, 200],
    ['EDB', 'Dark Spell Damage', 'Dark', 0.0804, 200],
    ['EDB', 'Wind Spell Damage', 'Wind', 0.0804, 200],
    ['EDB', 'Elec Spell Damage', 'Elec', 0.0804, 200],
    ['EDB', 'Cold Spell Damage', 'Cold', 0.0804, 200],
    ['EDB', 'Fire Spell Damage', 'Fire', 0.0804, 200]];

  var maxUpgrade = 0;
  item.forging = {};
  [].forEach.call(data.querySelectorAll('#eu > span'), function(span){
    var re = span.textContent.match(/(.+)\sLv\.(\d+)/);
    var thisUpgrade = parseInt(re[2]);
    if (maxUpgrade < thisUpgrade)
      maxUpgrade = thisUpgrade;
    var htmlNameObj = forgeNameToHtmlName(re[1]);
    if (htmlNameObj)
      item.forging[htmlNameObj.htmlName] = {amount:thisUpgrade, baseMultiplier:htmlNameObj.baseMultiplier, scalingFactor:htmlNameObj.scalingFactor};
  });
  function reverseForgeMultiplierDamage(forgedBase, forgeLevelObj){
    var qualityBonus = (pxp0 - 100)/25 * forgeLevelObj.baseMultiplier;
    var forgeCoeff = 1 + 0.278875 * Math.log(0.1 * forgeLevelObj.amount + 1);
    var unforgedBase = (forgedBase - qualityBonus) / forgeCoeff + qualityBonus;
    //alert('forgedBase ' + forgedBase + ' @ forged ' + forgeLevelObj.amount + ' is ' + unforgedBase + ' @ 0 , qualityBonus ' + qualityBonus);
    return unforgedBase;
  }
  function reverseForgeMultiplierPlain(forgedBase, forgeLevelObj){
    var qualityBonus = (pxp0 - 100)/25 * forgeLevelObj.baseMultiplier;
    var forgeCoeff = 1 + 0.2 * Math.log(0.1 * forgeLevelObj.amount + 1);
    var unforgedBase = (forgedBase - qualityBonus) / forgeCoeff + qualityBonus;
    //alert('forgedBase ' + forgedBase + ' @ forged ' + forgeLevelObj.amount + ' is ' + unforgedBase + ' @ 0 , qualityBonus ' + qualityBonus);
    return unforgedBase;
  }

  if (maxUpgrade > 0)
    item.info += ', forged ' + maxUpgrade;

  function forgeNameToHtmlName(forgeName){
    var htmlNameObj;
    statNames.forEach(function(stats){
      if (forgeName === stats[1])
        htmlNameObj = {htmlName:stats[2], baseMultiplier:stats[3], scalingFactor:stats[4]};
    });
    return htmlNameObj;
  }
  var lower = item.name.toLowerCase();

  if (/leather/.test(lower) || /\splate/.test(lower) || (/cotton/.test(lower) && (/protection/.test(lower) || /warding/.test(lower))))
    return item;

  var htmlMagicTypes = ['Holy', 'Dark', 'Wind', 'Elec', 'Cold', 'Fire'];
  var htmlProfTypes = ['Divine', 'Forbidden', 'Elemental', 'Deprecating', 'Supportive'];
  var staffPrefixes = {'Holy':'Hallowed', 'Dark':'Demonic', 'Wind':'Tempestuous', 'Elec':'Shocking', 'Cold':'Arctic', 'Fire':'Fiery'};

  var equipStats = {};
  function titleStrToBase(title){
    return parseFloat(title.substr(6));
  }
  [].forEach.call(data.querySelectorAll('div[title]'), function(div){
    if (div.parentElement.parentElement.id === 'equip_extended'){
      equipStats['Attack Damage'] = titleStrToBase(div.title);
      return;
    }
    var htmlName = div.childNodes[0].textContent;
    if (/\+/.test(htmlName)) // "Elec +"
      htmlName = htmlName.substr(0, htmlName.length - 2);
    if (htmlMagicTypes.indexOf(htmlName) !== -1){
      if (div.parentElement.children[0].textContent === 'Damage Mitigations')
        htmlName += ' Mit';
    }
    equipStats[htmlName] = titleStrToBase(div.title);
  });

  function abbrevNameToHtmlName(abbrevName){
    var htmlName;

    if (abbrevName === 'Prof'){ //ambiguous/wrong for prof and EDB without adding these tests, so:
      Object.keys(equipStats).forEach(function(equipStatName){
        if (htmlName)
          return;
        //console.log(lower + ' checking ' + equipStatName + ' against ' + htmlProfTypes);
        if (htmlProfTypes.indexOf(equipStatName) !== -1)
          htmlName = equipStatName;
      });
    } else if (abbrevName === 'EDB'){
      Object.keys(equipStats).forEach(function(equipStatName){
        if (htmlMagicTypes.indexOf(equipStatName) !== -1 && !/Staff/.test(item.name))
          htmlName = equipStatName;
        if (htmlMagicTypes.indexOf(equipStatName) !== -1 && /Staff/.test(item.name)) //For staff, continue on to list EDB of prefixed element only
          if (item.name.indexOf(staffPrefixes[equipStatName]) !== -1)
            htmlName = equipStatName;
      });
    } else {
      statNames.forEach(function(stats){
        if (abbrevName === stats[0]){
          htmlName = stats[2];
        }
      });
    }
    return htmlName;
  }

  var found = false;
  ranges.forEach(function(range){
    if (!range[3].every(function(subName){
      if (lower.indexOf(subName) !== -1)
        return true;
    }))
      return;
    if (range[4] && lower.indexOf(range[4]) !== -1)
      return;

    var abbrevName = range[0];
    var htmlName = abbrevNameToHtmlName(abbrevName);
    if (!htmlName){
      alert('no htmlname for ' + abbrevName);
      return;
    }

    var stat = equipStats[htmlName];
    if (!stat){
      alert('found no stat for ' + htmlName);
      return;
    }

    if (abbrevName === 'ADB' || abbrevName === 'MDB'){
      if (item.forging[htmlName])
        stat = reverseForgeMultiplierDamage(stat, item.forging[htmlName]);
    } else if (item.forging[htmlName])
      stat = reverseForgeMultiplierPlain(stat, item.forging[htmlName]);

    if (abbrevName === 'ADB'){
      var butcher = dataText.match(/Butcher\sLv.(\d)/);
      if (butcher)
        stat = stat / (1 + 0.02 * parseInt(butcher[1]));
    } else if (abbrevName === 'MDB') {
      var archmage = dataText.match(/Archmage\sLv.(\d)/);
      if (archmage)
        stat = stat / (1 + 0.02 * parseInt(archmage[1]));
    }

    if (!stat){
      alert('didnt find a stat for ' + abbrevName);
      return;
    }
    found = true;
    var percentile = Math.round(100 * (stat - range[1]) / (range[2] - range[1]));
    var dontShowInAuction = [/Int/, /Wis/, /Agi/, /Evd/, /Pmit/];
    if (percentile < 0)
      item.badinfo += ', ' + range[0] + ' ' + percentile + '%';
    else if (typeof showSeller === 'undefined' || !showSeller || dontShowInAuction.every(function(re){ return !re.test(range[0]); }))
      item.info += ', ' + range[0] + ' ' + percentile + '%';
  });

  if (found === false && !/plate/.test(lower) && !/leather/.test(lower))
    alert('No match for ' + lower);
  return item;
}