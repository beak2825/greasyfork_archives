// ==UserScript==
// @name         GameFAQs - Purge Monitor
// @namespace    Betelgeuse
// @author       Betelgeuse
// @version      2.2.3
// @description  Displays indicators on the topic list showing when each topic will purge.
// @include      /^https:\/\/gamefaqs\.gamespot\.com\/boards\/\d+-.*\/?$/
// @exclude      /^https:\/\/gamefaqs\.gamespot\.com\/boards\/\d+-.*\/.+$/
// @noframes
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.23/moment-timezone-with-data.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/378974/GameFAQs%20-%20Purge%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/378974/GameFAQs%20-%20Purge%20Monitor.meta.js
// ==/UserScript==

//GM function alternatives:
if ((typeof GM_getValue == 'undefined') || (GM_getValue('a', 'b') == undefined)) {
  //Source: devign.me/greasemonkey-gm_getvaluegm_setvalue-functions-for-google-chrome
  this.GM_getValue = function(key, def) {
    return localStorage[key] || def;
  };
  this.GM_setValue = function(key, value) {
    return (localStorage[key] = value);
  };
    this.GM_deleteValue = function(name) {
        localStorage.removeItem(name);
    };
  //Source: stackoverflow.com/q/23683439/
  function GM_addStyle(css) {
    var head = document.getElementsByTagName('head')[0];
    if (!head) {return;}
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
  }
}

var  debugMode = false
   , forceStickyRefresh = false
   , forceTppRefresh = false
   , tpp
   , tppRefreshed = 'Never'
   , stickyCount = 0
   , stickyCountRefreshed = 'Never'
   , runningTopicCount = 0
   , currPageNum
   , maxPageNum
   , i
   , nextPurgeTime
   , lastPostTimestamp
   , purgeSched = [
                     [1,    5 ,   Infinity]
                   , [6,    20,   365]
                   , [21,   40,   180]
                   , [41,   100,  90]
                   , [101,  200,  30]
                   , [201,  400,  10]
                   , [401,  750,  5]
                   , [751,  1000, 2]
                   , [1001, Infinity, 0]
                  ];

function main() {
  var iTag, boardStatus;

  /*load date format prototype*/
  dateFormat();

  /*get topic page number*/
  currPageNum = getCurrPageNum();

  /*count total topic pages*/
  maxPageNum = getMaxPageNum();

  /*get user's topics per page setting*/
  getTPP();

  /*get number of stickies on the board*/
  getStickyCount();

  /*calculate when the purge will run next*/
  getNextPurgeTime();

  /*get all topics*/
  var allTrs = $('tr.topics');

  /*get running topic count (from lower pages)*/
  runningTopicCount = currPageNum == 0 ? 0 : currPageNum * tpp - stickyCount;
  debugLog('Non-sticky topics from lower pages amount to '+runningTopicCount+'.');

  /*loop through TRs*/
  for (i = 0; i < allTrs.length; i++) {
    iTag = document.createElement('i');
    boardStatus = $(allTrs[i]).find('td.board_status>:first-child').attr('class');

    /*remove any purge indicators that already exist*/
    $(allTrs[i]).find('.bg_icon').remove();

    /*if we reach an archived topic, then stop*/
    if (boardStatus.indexOf('board_icon_archived') >= 0) {
      break;
    }

    /*check if topic is sticky*/
    if (boardStatus.indexOf('sticky') >= 0) {
      iTag.classList.add('fa', 'fa-circle', 'bg_icon', 'bg_sticky');
      iTag.title = 'Topic will not purge (sticky).';
      $(allTrs[i]).find('td.lastpost').append(iTag);
    }

    /*topic is not sticky, so calculate position and purge date*/
    else {
      var iconClass, topicPurgeTimestamp, topicPurgeTimeString, daysUntilPurge = 'n/a', sep = '\u000d';
      runningTopicCount += 1;
      if (runningTopicCount > 5) {
        /*topic is below top 5 position and is subject to purge*/
        lastPostString = $(allTrs[i]).find('td.lastpost>:first-child').text();
        lastPostTimestamp = parsePostTime(lastPostString);
        topicPurgeTimestamp = getTopicPurgeTime(lastPostTimestamp, runningTopicCount);
        topicPurgeTimeString = topicPurgeTimestamp.local().format('DD MMM YYYY HH:mm a');
        daysUntilPurge = Math.round(topicPurgeTimestamp.diff(nextPurgeTime, 'days', true));
      }
      else {
        /*topic is in top 5 position and will not purge*/
        topicPurgeTimeString = 'Topic will not purge.';
      }

      /*assign icon class*/
      if (daysUntilPurge == 0) {
        iconClass = 'bg_danger';
      }
      else if (daysUntilPurge >= 1 && daysUntilPurge <= 2) {
        iconClass = 'bg_alert';
      }
      else if (daysUntilPurge >= 3 && daysUntilPurge <= 7) {
        iconClass = 'bg_caution';
      }
      else {
        iconClass = 'bg_safe';
      }
      iTag.classList.add('fa', 'fa-circle', 'bg_icon', iconClass);

      /*make tag title*/
      purgeTimeString = 'Purge Time: ' + topicPurgeTimeString;
      daysTilPurgeString = 'Days Until Purge: ' + daysUntilPurge;
      topicNumberString = 'Topic Position: ' + runningTopicCount;
      positionString = 'Purge Category: ' + getPositionLabel(runningTopicCount);
      iTag.title = purgeTimeString + sep + daysTilPurgeString + sep + topicNumberString + sep + positionString;

      /*append title to lastpost TD*/
      $(allTrs[i]).find('td.lastpost').append(iTag);
    }
  }

  /*place link to refresh settings pop-up on screen*/
  $('.bg_contain').remove();
  document.getElementsByClassName('page-header')[0].classList.add('bg_page_header');
  document.getElementsByClassName('page-title')[0].classList.add('bg_h1');

  var refreshContain = document.createElement('div');
  refreshContain.classList.add('bg_contain');
  refreshContain.appendChild(document.createElement('span'));

  refreshContain.childNodes[0].innerHTML = '<a href="javascript:void(0);" class="p-1">Purge Monitor Settings <i id="bg-settings-icon" class="fa fa-trash"></i></a>';
  refreshContain.childNodes[0].id = 'bg-settings-link';
  refreshContain.childNodes[0].title = 'Click to manually refresh sticky count or topics per page setting.';

  $(refreshContain).insertAfter($('.page-title')[0]);
  $('#bg-settings-link').on('click', function() {showSettings();});
}

function getCurrPageNum() {
  var  re = new RegExp(/^(\/boards\/\d+-[^\?]*)(?:\?page=(\d+))?$/)
     , m = re.exec(window.location.pathname + window.location.search);
  return m[2] ? m[2] : 0;
}

function getMaxPageNum() {
  var  maxPage = 0, lastOption = $('select#pagejump option:last');
  if (lastOption.length) {
    maxPage = lastOption.val();
  }
  return maxPage;
}

function updateTPP() {
  debugLog('Updating Topics Per Page.');
  var  basicSettings = 'https://gamefaqs.gamespot.com/user/settings_basic'
     , savedTppInfo
     , tempTpp;
  $.ajax({
            url: basicSettings
          , type: 'GET'
          , async: false
          , success: function(data) {tempTpp = $(data).find('select[name=topp]').val();}
        });
  savedTppInfo = new Object ({
    tpp: tempTpp,
    lastChecked: Date.now()
  });
  debugLog('Saving Topics Per Page to local storage.');
  GM_setValue('TopicsPerPage', JSON.stringify(savedTppInfo));
  return savedTppInfo;
}

function getTPP() {
  var savedTppInfo;
  try {
    savedTppInfo = JSON.parse(GM_getValue('TopicsPerPage'));
    debugLog('Got Topics Per Page from local storage.');
  }
  catch (e) {
    debugLog('Topics Per Page not found in local storage.');
  }
  /*auto-update once per day*/
  if (!savedTppInfo || ((Date.now() - savedTppInfo.lastChecked)/1000/60 > 1440) || (currPageNum != 0 && currPageNum == maxPageNum) || forceTppRefresh) {
    savedTppInfo = updateTPP();
  }
  else {
    debugLog('Not updating Topics Per Page.');
  }
  tpp = savedTppInfo.tpp;
  tppRefreshed = new Date(savedTppInfo.lastChecked).pformat('d M Y g:iA');
  debugLog('Topics Per Page is ' + tpp + '.');
  debugLog('Topics Per Page last refreshed ' + tppRefreshed + '.');
}

function updateStickyCount(boardId) {
  debugLog('Updating sticky count.');
  var  boardPageOne = 'https://gamefaqs.gamespot.com/' + window.location.pathname
     , savedStickyInfo
     , tempStickyCount = 0
     , stickySelector = '.board_icon_sticky, .board_icon_sticky_new, .board_icon_sticky_unread, .board_icon_sticky_read';
  if (currPageNum == 0) {
    debugLog('Already viewing page 1.');
    tempStickyCount = $(stickySelector).length;
  }
  else {
    debugLog('Not viewing page 1. Page 1 will be loaded via AJAX.');
    $.ajax({
              url: boardPageOne
            , type: 'GET'
            , async: false
            , success: function(data) {tempStickyCount = $(data).find(stickySelector).length;}
          });
  }
  savedStickyInfo = new Object ({
    stickyCount: tempStickyCount,
    lastChecked: Date.now()
  });
  debugLog('Saving sticky count to local storage.');
  GM_setValue(boardId, JSON.stringify(savedStickyInfo));
  return savedStickyInfo;
}

function getStickyCount() {
  var  savedStickyInfo
     , re = new RegExp(/^\/boards\/(\d+)-.*$/)
     , boardId = re.exec(window.location.pathname)[1];
  debugLog('Board ID is ' + boardId + '.');
  try {
    savedStickyInfo = JSON.parse(GM_getValue(boardId));
    debugLog('Got sticky count from local storage.');
  }
  catch (e) {
    debugLog('Sticky count not found in local storage.');
  }
  /*auto-update once per day*/
  if (!savedStickyInfo || ((Date.now() - savedStickyInfo.lastChecked)/1000/60 > 1440) || forceStickyRefresh) {
    savedStickyInfo = updateStickyCount(boardId);
  }
  else {
    debugLog('Not updating sticky count.');
  }
  stickyCount = savedStickyInfo.stickyCount;
  stickyCountRefreshed = new Date(savedStickyInfo.lastChecked).pformat('d M Y g:iA');
  debugLog('Sticky count is '+ stickyCount +'.');
  debugLog('Sticky count last refreshed ' + stickyCountRefreshed + '.');
}

function getPositionLabel(position) {
  var j;
  for (j = 0; j < purgeSched.length; j++) {
    if (position >= purgeSched[j][0] && position <= purgeSched[j][1]) {
      return purgeSched[j][0] + (purgeSched[j][1] == Infinity ? '+' : '-' + purgeSched[j][1]);
    }
  }
}

function getTopicPurgeTime(lastPostTimestamp, position) {
  var purgeAfterDays, j,
      tempPurgeTime = moment(lastPostTimestamp);
  /*find out after how many days is the topic eligible for purging*/
  for (j = 0; j < purgeSched.length; j++) {
    if (position >= purgeSched[j][0] && position <= purgeSched[j][1]) {
      purgeAfterDays = purgeSched[j][2];
    }
  }

  /*while daylight savings time is in effect, the window in which a topic can be posted in and be safe changes-this effectively takes that into consideration*/
  if (!timeInDst(moment(lastPostTimestamp)) && timeInDst(moment(tempPurgeTime).add(purgeAfterDays, 'days'))) {
    tempPurgeTime.subtract(1, 'hours');
  }
  else if (timeInDst(moment(lastPostTimestamp)) && !timeInDst(moment(tempPurgeTime).add(purgeAfterDays, 'days'))) {
    tempPurgeTime.add(1, 'hours');
  }

  tempPurgeTime.add(purgeAfterDays, 'days');
  tempPurgeTime.hours(35);
  tempPurgeTime.startOf('hour');
  if (tempPurgeTime < nextPurgeTime) {
    tempPurgeTime = moment(nextPurgeTime);
  }
  return tempPurgeTime;
}

/*get last post time*/
function parsePostTime(lastPostString) {
  var lastPostDay, lastPostMonth, lastPostYear, lastPostHour = 0, lastPostMin = 0;
  /*check if the last post string has a time in it*/
  if (lastPostString.indexOf(':') !== -1) {
    lastPostDay = lastPostString.split('/')[1].split(' ')[0];
    lastPostMonth = lastPostString.split('/')[0] - 1; /*months are 0-11 so subtract 1*/
    if ((lastPostMonth > new Date().getMonth()) || (lastPostMonth == new Date().getMonth() && lastPostDay > new Date().getDate())) {
      /*then the post must be from the prior year*/
      lastPostYear = new Date().getFullYear() - 1;
    }
    else {
      /*then the post is from this year*/
      lastPostYear = new Date().getFullYear();
    }
    if (lastPostString.indexOf('AM') !== -1) { /*AM*/
      if (lastPostString.split(' ')[1].split(':')[0] === '12' ) {
        lastPostHour = 0; /*12:00 a.m. should be converted to 00:00*/
      }
      else {
        lastPostHour = Number(lastPostString.split(' ')[1].split(':')[0]);
      }
    }
    else { /*PM*/
      if (lastPostString.split(' ')[1].split(':')[0] === '12' ) {
        lastPostHour = 12; /*12:00 p.m. shouldn't have 12 hours added to it*/
      }
      else {
        /*add 12 hours (e.g., 1:00 p.m. -> 13:00)*/
        lastPostHour = Number(lastPostString.split(' ')[1].split(':')[0]) + 12;
      }
    }
    lastPostMin = lastPostString.split(' ')[1].split(':')[1].split(/[AM|PM]/)[0];
  }
  else {
    /*last post string doesn't have a time in it*/
    lastPostDay = lastPostString.substring(lastPostString.indexOf('/') + 1, lastPostString.lastIndexOf('/'));
    lastPostMonth = lastPostString.substring(0, lastPostString.indexOf('/')) - 1; /*months are 0-11 so subtract 1*/
    lastPostYear = lastPostString.substring(lastPostString.lastIndexOf('/') + 1, lastPostString.length);
  }
  return (moment(lastPostYear.toString()+'-'+(lastPostMonth+1).toString()+'-'+lastPostDay.toString()+' '+lastPostHour.toString()+':'+lastPostMin.toString(), 'YYYY-MM-DD HH:mm')).utc();
}

function getNextPurgeTime() {
  nextPurgeTime = moment.utc('11:00:00', 'HH:mm').startOf('hour');
  if (moment.utc() > nextPurgeTime) {
    nextPurgeTime.add('24', 'hours');
  }
}

function timeInDst(dttm) {
  /*checks if GameFAQs servers will be observing daylight savings time at the specified time*/
  return moment(dttm).tz('America/Los_Angeles').isDST();
}

function dateFormat() {
/*Source: https://github.com/jacwright/date.format
  Copyright (c) 2005 Jacob Wright
  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.*/
Date.prototype.pformat=function(e){var t="";var n=Date.replaceChars;for(var r=0;r<e.length;r++){var i=e.charAt(r);if(r-1>=0&&e.charAt(r-1)=="\\"){t+=i}else if(n[i]){t+=n[i].call(this)}else if(i!="\\"){t+=i}}return t};Date.replaceChars={shortMonths:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],longMonths:["January","February","March","April","May","June","July","August","September","October","November","December"],shortDays:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],longDays:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],d:function(){return(this.getDate()<10?"0":"")+this.getDate()},D:function(){return Date.replaceChars.shortDays[this.getDay()]},j:function(){return this.getDate()},l:function(){return Date.replaceChars.longDays[this.getDay()]},N:function(){return this.getDay()+1},S:function(){return this.getDate()%10==1&&this.getDate()!=11?"st":this.getDate()%10==2&&this.getDate()!=12?"nd":this.getDate()%10==3&&this.getDate()!=13?"rd":"th"},w:function(){return this.getDay()},z:function(){var e=new Date(this.getFullYear(),0,1);return Math.ceil((this-e)/864e5)},W:function(){var e=new Date(this.getFullYear(),0,1);return Math.ceil(((this-e)/864e5+e.getDay()+1)/7)},F:function(){return Date.replaceChars.longMonths[this.getMonth()]},m:function(){return(this.getMonth()<9?"0":"")+(this.getMonth()+1)},M:function(){return Date.replaceChars.shortMonths[this.getMonth()]},n:function(){return this.getMonth()+1},t:function(){var e=new Date;return(new Date(e.getFullYear(),e.getMonth(),0)).getDate()},L:function(){var e=this.getFullYear();return e%400==0||e%100!=0&&e%4==0},o:function(){var e=new Date(this.valueOf());e.setDate(e.getDate()-(this.getDay()+6)%7+3);return e.getFullYear()},Y:function(){return this.getFullYear()},y:function(){return(""+this.getFullYear()).substr(2)},a:function(){return this.getHours()<12?"am":"pm"},A:function(){return this.getHours()<12?"AM":"PM"},B:function(){return Math.floor(((this.getUTCHours()+1)%24+this.getUTCMinutes()/60+this.getUTCSeconds()/3600)*1e3/24)},g:function(){return this.getHours()%12||12},G:function(){return this.getHours()},h:function(){return((this.getHours()%12||12)<10?"0":"")+(this.getHours()%12||12)},H:function(){return(this.getHours()<10?"0":"")+this.getHours()},i:function(){return(this.getMinutes()<10?"0":"")+this.getMinutes()},s:function(){return(this.getSeconds()<10?"0":"")+this.getSeconds()},u:function(){var e=this.getMilliseconds();return(e<10?"00":e<100?"0":"")+e},e:function(){return"Not Yet Supported"},I:function(){var e=null;for(var t=0;t<12;++t){var n=new Date(this.getFullYear(),t,1);var r=n.getTimezoneOffset();if(e===null)e=r;else if(r<e){e=r;break}else if(r>e)break}return this.getTimezoneOffset()==e|0},O:function(){return(-this.getTimezoneOffset()<0?"-":"+")+(Math.abs(this.getTimezoneOffset()/60)<10?"0":"")+Math.abs(this.getTimezoneOffset()/60)+"00"},P:function(){return(-this.getTimezoneOffset()<0?"-":"+")+(Math.abs(this.getTimezoneOffset()/60)<10?"0":"")+Math.abs(this.getTimezoneOffset()/60)+":00"},T:function(){var e=this.getMonth();this.setMonth(0);var t=this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/,"$1");this.setMonth(e);return t},Z:function(){return-this.getTimezoneOffset()*60},c:function(){return this.pformat("Y-m-d\\TH:i:sP")},r:function(){return this.toString()},U:function(){return this.getTime()/1e3}}
}

function debugLog(msg) {
  if (debugMode) {
    console.log(msg);
  }
}

function stylize() {
  GM_addStyle('\
    .c-white {color: white;}\
    .bg-trans {background-color: transparent;}\
    .b-none {border: none;}\
    .p-1 {padding: 1px;}\
    .bg_icon {margin-left: 1px;}\
    .bg_icon:before {cursor: default; font-size: .75em !important;}\
    .bg_sticky {color: gray;}\
    .bg_safe {color: green;}\
    .bg_caution {color: yellow;}\
    .bg_alert {color: orange;}\
    .bg_danger {color: red;}\
    .bg_page_header {margin-bottom: 5px;}\
    .bg_h1 {display: inline-block;}\
    .bg_settings {position: absolute;padding: 15px;background-color: ' + getStyle(document.getElementById('content'), 'background-color') + ';width: 35%;z-index: 999000000;overflow: visible;}\
    @media (max-width: 767px) {.bg_settings{width:90%;}}\
    .bg_ui_title {margin-top: 15px;}\
     #bg_settings tbody {display:table-row-group;}\
    .bg_btn {display: block;margin: 5px auto 0;}\
    .bg_contain {cursor: default;display: inline-block;font-size: 12px;list-style-type: none;margin: 0 !important;margin-bottom: 9px;padding-left: 15px;vertical-align: bottom;}\
    .bg_contain span {display: inline-block;padding-left: 2px;margin-bottom: 9px;}\
    .bg_calculating {-webkit-animation: spin 1s linear infinite;-moz-animation: spin 1s linear infinite;animation:  spin 1s linear infinite;}\
    @-webkit-keyframes spin {from {-webkit-transform: rotate(0deg);} to {-webkit-transform: rotate(359deg);}}\
    @-moz-keyframes spin {from {-moz-transform: rotate(0deg);} to {-moz-transform: rotate(359deg);}}\
    @keyframes spin {from {transform: rotate(0deg);} to {transform: rotate(359deg);}}\
  ');
}

function showSettings() {
  /*add overlay*/
  $('<div class="ui-widget-overlay ui-front" id="bg-overlay"></div>').appendTo($('body')[0]);
  $('#bg-overlay').on('click', function() {hideSettings();});

  /*add settings window*/
  $('<div class="reg_dialog body settings bg_settings" id="bg_settings"><div class="ui-dialog-titlebar"><button id="bg-x" class="ui-dialog-titlebar-close" title="Close"><span class="ui-button-text">X</span></button></div><h3 class="title userinfo bg_ui_title">Purge Monitor Settings</h3><table class="board topics tlist newbeta"><colgroup><col class="smallest"><col class="medium"><col class="smaller"><col class="medium"></colgroup><thead><tr><th class="tsort" scope="col"></th><th  class="tsort" scope="col">Item</th><th  class="tsort" scope="col">Value</th><th  class="tsort" scope="col">Last Updated</th></tr></thead><tbody><tr><td><button class="bg-trans b-none p-1"><i id="bg-recalc-sticky" class="fa fa-refresh"></i></button></td><td>Sticky Count</td><td>'+stickyCount+'</td><td>'+stickyCountRefreshed+'</td></tr><tr><td><button class="bg-trans b-none p-1"><i id="bg-recalc-tpp" class="fa fa-refresh"></i></button></td><td>Topics per Page</td><td>'+tpp+'</td><td>'+tppRefreshed+'</td></tr></tbody></table><input id="bg-close-btn" type="button" class="btn bg_btn" value="Close"></div>').appendTo($('body')[0]);
  $('#bg-x').on('click',function() {hideSettings();});
  $('#bg-close-btn').on('click',function() {hideSettings();});
  $('#bg-recalc-sticky').on('click', function() {mainAndForceSticky();});
  $('#bg-recalc-tpp').on('click', function() {mainAndForceTpp();});

  /*center window*/
  settingsWindow = document.getElementById('bg_settings');
  settingsWindow.style.top = (window.outerHeight / 2) - (settingsWindow.offsetHeight / 2) + 'px';
  settingsWindow.style.left = (window.outerWidth / 2) - (settingsWindow.offsetWidth / 2) + 'px';
}

function hideSettings() {
  $('#bg-overlay').remove();
  $('#bg_settings').remove();
}

function getStyle(el, styleProp) {
  return document.defaultView.getComputedStyle(el, null).getPropertyValue(styleProp)
}

function mainAndForceSticky() {
  forceTppRefresh = false;
  forceStickyRefresh = true;
  hideSettings();
  $('#bg-settings-icon').attr('class', 'fa fa-spinner bg_calculating');
  setTimeout(function() {main();}, 1);
}

function mainAndForceTpp() {
  forceTppRefresh = true;
  forceStickyRefresh = false;
  hideSettings();
  $('#bg-settings-icon').attr('class', 'fa fa-spinner bg_calculating');
  setTimeout(function() {main();}, 1);
}

/*apply custom styles*/
stylize();

/*run main function*/
main();