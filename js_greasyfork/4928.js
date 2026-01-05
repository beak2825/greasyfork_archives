// ==UserScript==
// @name           HKG BM finder
// @namespace      http://userscripts.org/users/peach
// @version        1.0.0
// @description    HKGolden BM finder
// @homepageURL    https://greasyfork.org/scripts/4928-hkg-bm-finder
// @include        http://forum*.hkgolden.com/*
// @include        http://search.hkgolden.com/*
// @include        http://archive.hkgolden.com/*
// @include        http://profile.hkgolden.com/*
// @exclude        http://*.hkgolden.com/*rofile*age.aspx*
// @require        http://code.jquery.com/jquery-1.10.2.min.js
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_xmlhttpRequest
// @copyright      2013, Xelio & Peach (The part of the program is based on HKG LM finder)
// @downloadURL https://update.greasyfork.org/scripts/4928/HKG%20BM%20finder.user.js
// @updateURL https://update.greasyfork.org/scripts/4928/HKG%20BM%20finder.meta.js
// ==/UserScript==

/*
HKG BM finder (HKGolden BM finder)
Copyright (C) 2013 Xelio Cheong & Peach (The part of the program is based on HKG LM finder)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var $j = jQuery.noConflict();

var userID;
var bmStyle;

var ajaxTimeout = 15000;
var ajaxRequest;
var ajaxRequestTimer;

storeLocal = function(key, value) {
  if(typeof(value) !== 'undefined' && value !== null) {
    localStorage[key] = JSON.stringify(value);
  } else {
    localStorage.removeItem(key);
  }
}

loadLocal = function(key) {
  var objectJSON = localStorage[key];
  if(!objectJSON) return;
  return JSON.parse(objectJSON);
}

deleteLocal = function(key) {
  localStorage.remoteItem(key);
}

// Common functions called in MEL & PM

changeAndFlashMessage = function(message) {
  var messageDiv = $j('div#bm_message');
  messageDiv.html(message);
  // Show LM message
  messageDiv.stop();
  messageDiv.show().animate({"top": "0"},500);
}

clearMessage = function() {
  var messageDiv = $j('div#bm_message');
  // Hide LM message
  messageDiv.stop();
  messageDiv.delay(1000).animate({"top": "-30px"},1000, function(){messageDiv.hide(); messageDiv.html('');});
}

setup = function() {
  var message = 'Load緊呀等陣啦';
  changeAndFlashMessage(message);
}

handleError2 = function() {
  console.log('server error');
  var message = 'Server 有問題，你遲的再試下啦';

  changeAndFlashMessage(message);
}

// Ming E Lau Start
requestMEL = function() {

  var message = 'Load 緊';
  changeAndFlashMessage(message);

  var bmType = loadLocal('bmType') || 'lastPost';
  var bmPage = loadLocal('bmPage') || '1';

  var requestUrl = 'http://' + window.location.hostname + '/ProfilePage.aspx?type=bookmark&page=' + bmPage + '&orderType=' + bmType + '&userid=' + userID;

  GM_xmlhttpRequest({
    method: "GET",
    url: requestUrl,
    timeout: ajaxTimeout,
    onload: function(response) {
      ajaxRequest = null;
      clearTimeout(ajaxRequestTimer);
      if(replaceContent2(response)) {
      // success
      } else {
        handleError2();
      }
    }
  });
}

// Handle data response
replaceContent2 = function(response) {
  var message = 'Load 完';
  changeAndFlashMessage(message);
  clearMessage();
  var data = response.responseText;
  var history;

  if(!data || (data.length === 0)) {
    // No history in data response
    console.log('No data response');
    return false;
  }

  $j.each($j.parseHTML(data), function(i, el) {
      if(el.id === 'aspnetForm') {
  var doms = $j(el);
  history = doms.find('#ctl00_ContentPlaceHolder1_dataLabel');
  bmTotal = doms.find('#ctl00_ContentPlaceHolder1_totalBM');
        return false;
      }
    });

  if(history.length === 0) {
  console.log('No history found');
  //console.log(data);
  return false;
  }

  history.find('#bookmark tbody tr').find('td:eq(6)').remove();
  history.find('#bookmark tbody tr:eq(0) td:eq(5)').remove();

  var bmType = loadLocal('bmType') || 'lastPost';
  var bmPage = loadLocal('bmPage') || '1';
  var lp='';
  var bm='';

  if(bmType=='lastPost') {
    lp=' selected="selected"';
  } else {
    bm=' selected="selected"';
  }

  $j('div#bm_history').html('<table id="bookmarkTable" cellspacing="0" cellpadding="0" border="0" width="100%">' + 
    '<tr><td align="right" class="title"><span id="bmTotal">' + bmTotal.html() + '</span>' +
    '<select name="bmOrder" id="bmOrder"><option' + lp + ' value="lastPost">以最後回應時間排列</option><option' + bm + ' value="bookmark">以加入留明時間排列</option></select>' +
    '<b>第<input name="pageTextBox" type="text" value="' + bmPage + '" id="pageTextBox" onkeypress="return isNumberKey(event)" style="width:25px;">頁</b>' +
    '<input type="submit" name="pageGoBtn" value="Go" id="pageGoBtn">&nbsp;&nbsp;' +
    '<input type="submit" name="previousBtn" value="上一頁" id="previousBtn">' +
    '<input type="submit" name="nextBtn" value="下一頁" id="nextBtn">'+
    '</td></tr></table>' + history.html());

  buttonTrigger();

  // Display modal box when history was successfully loaded
  $j('div#bm').fadeIn(800);
  $j('div#bm-mask').fadeTo(500, 0.7);

  // Update modal box height to fit the viewport
  var wHeight = $j(window).height() - 72;
  $j('div#bm_history').css('height', 'auto');
  if($j('div#bm_history').height() > wHeight) $j('div#bm_history').css('height', wHeight+'px');

  console.log('MEL request finished');

  return true;
}

buttonTrigger = function() {

  bmPageGo = function(e) {
    e.preventDefault;
    var page = history.find('#pageTextBox').val();
    var type = history.find('#bmOrder').val();
    storeLocal('bmType', type);
    storeLocal('bmPage', page);
    requestMEL(page);
    return false;
  }

  previousBtn = function(e) {
    e.preventDefault;
    var bmPage = loadLocal('bmPage') || '1';
    var page = parseInt(bmPage) - 1;
    var type = history.find('#bmOrder').val();
    storeLocal('bmType', type);
    if(page<1) { page = '1' }
    storeLocal('bmPage', page);
    requestMEL(page);
    return false;
  }

  nextBtn = function(e) {
    e.preventDefault;
    var bmPage = loadLocal('bmPage') || '1';
    var page = parseInt(bmPage) + 1;
    var type = history.find('#bmOrder').val();
    storeLocal('bmType', type);
    if(page>25) { page = '25' }
    storeLocal('bmPage', page);
    requestMEL(page);
    return false;
  }

  var history = $j('div#bm_history');

  history.find('#pageGoBtn').click(bmPageGo);
  history.find('#previousBtn').click(previousBtn);
  history.find('#nextBtn').click(nextBtn);

}
// Ming E Lau End

// PM Start
requestPM = function(type, btn) {

  var message = 'Load 緊';
  changeAndFlashMessage(message);

  var pmPage = loadLocal('pmPage') || '1';

  var requestUrl = 'http://' + window.location.hostname + '/ProfilePage.aspx?&type=pm&page=' + pmPage + '&userid=' + userID;

  GM_xmlhttpRequest({
    method: "GET",
    url: requestUrl,
    timeout: ajaxTimeout,
    onload: function(response) {
      ajaxRequest = null;
      clearTimeout(ajaxRequestTimer);
      if(replaceContent3(response)) {
      // success
      } else {
        handleError2();
      }
    }
  });
}

// Handle data response
replaceContent3 = function(response) {
  var message = 'Load 完';
  changeAndFlashMessage(message);
  clearMessage();
  var data = response.responseText;
  var history;

  if(!data || (data.length === 0)) {
    // No history in data response
    console.log('No data response');
    return false;
  }

  $j.each($j.parseHTML(data), function(i, el) {
      if(el.id === 'aspnetForm') {
  var doms = $j(el);
  history = doms.find('#ctl00_ContentPlaceHolder1_dataLabel');
        return false;
      }
    });

  if(history.length === 0) {
  console.log('No history found');
  //console.log(data);
  return false;
  }

  history.find('#pm tbody tr').find('td:eq(3)').remove();

  var pmPage = loadLocal('pmPage') || '1';

  $j('div#bm_history').html('<div id="DivShowPM" style="display:none;"> <div class="TransparentGrayBackground"></div> <div class="ListPMText"> <table width="100%" border="0" cellspacing="1" cellpadding="1" align="center"> <tr> <td> <table width="100%" border="0" cellspacing="0" cellpadding="0"> <tr> <td> <table width="100%" border="0" cellspacing="0" cellpadding="0"> <tr> <td class="title" width="2%"><img src="images/left_menu/p.jpg" alt="" width="22" height="21" /></td> <td class="title" width="98%" align="left"><b>訊息內容 - <span id="spanPMMessageTitle"></span></b></td> </tr> </table> </td> </tr> <tr> <td valign="top"><img src="images/index_images/blank.gif" alt="" width="1" height="1" /></td> </tr> <tr> <td height="8" valign="top" bgcolor="#CCDDEA"><img src="images/index_images/blank.gif" alt="" width="5" height="8" /></td> </tr> <tr> <td valign="top" class="main_table1" align="left"> <div id="divPMMessageBody"></div> </td> </tr> </table> </td> </tr> </table> <input type="Button" value="關閉" onclick="Javascript: $get(\'DivShowPM\').style.display = \'none\';" /> </div> </div>' + 
  '<table id="pmTable" cellspacing="0" cellpadding="0" border="0" width="100%">' +
  '<td align="right" class="title"><b>第<input name="pageTextBox" type="text" value="' + pmPage + '" id="pageTextBox" onkeypress="return isNumberKey(event)" style="width:25px;">頁</b>' +
  '<input type="submit" name="pageGoBtn" value="Go" id="pageGoBtn">&nbsp;&nbsp;' +
  '<input type="submit" name="previousBtn" value="上一頁" id="previousBtn">' +
  '<input type="submit" name="nextBtn" value="下一頁" id="nextBtn">' +
  '</td></tr></table>' + history.html());

  buttonTrigger2();

  // Display modal box when history was successfully loaded
  $j('div#bm').fadeIn(800);
  $j('div#bm-mask').fadeTo(500, 0.7);

  // Update modal box height to fit the viewport
  var wHeight = $j(window).height() - 72;
  $j('div#bm_history').css('height', 'auto');
  if($j('div#bm_history').height() > wHeight) $j('div#bm_history').css('height', wHeight+'px');

  console.log('PM request finished');

  return true;
}

buttonTrigger2 = function() {

  pmPageGo = function(e) {
    e.preventDefault;
    var page = history.find('#pageTextBox').val();
    storeLocal('pmPage', page);
    requestPM(page);
    return false;
  }

  previousBtn = function(e) {
    e.preventDefault;
    var pmPage = loadLocal('pmPage') || '1';
    var page = parseInt(pmPage) - 1;
    if(page<1) { page = '1' }
    storeLocal('pmPage', page);
    requestPM(page);
    return false;
  }

  nextBtn = function(e) {
    e.preventDefault;
    var pmPage = loadLocal('pmPage') || '1';
    var page = parseInt(pmPage) + 1;
    storeLocal('pmPage', page);
    requestPM(page);
    return false;
  }

  var history = $j('div#bm_history');

  history.find('#pageGoBtn').click(pmPageGo);
  history.find('#previousBtn').click(previousBtn);
  history.find('#nextBtn').click(nextBtn);

}
// PM End

// Get User ID
userID = $j('#ctl00_ContentPlaceHolder1_lb_UserName a:eq(0)').attr('href').replace(/[^0-9]/g, '');

// Define CSS Style (You can overide it by other script, if you want to)
bmStyle = '<style id="bm-style" type="text/css">';
bmStyle += '#bm-finder{z-index: 1; position: fixed; left: 0; top: 2px; padding:4px; cursor: pointer; text-decoration: none; color: #808080;}#bm-finder:hover{color: #9ACD32;}';
bmStyle += '#bm-pm{display:none; z-index: 1; position: fixed; left: 0; top: 28px; padding:4px; cursor: pointer; text-decoration: none; color: #808080; background: #FFF;}#bm-pm:hover{color: #9ACD32;}';
bmStyle += '#bm_message{display: none; z-index: 20; position: fixed; left: 50%; top: -30px; width: 600px; margin: 0 0 0 -300px; padding: 2px 0; background: #F7F3F7; border: 1px solid #000; border-width:0 1px 1px; text-align: center;}';
bmStyle += '#bm{display: none;}';
bmStyle += '#bm_history{z-index: 15; width: 898px; position: fixed; left: 50%; top:0; margin: 42px 0 0 -450px; padding:0; background: #000; border: 1px solid #000; overflow-y: auto;}';
bmStyle += '#bm-finder-2{z-index: 10; position: fixed; left: 50%; top:0; width: 450px; margin: 0 0 0 -450px; padding:12px 0; color:#FFF; text-align: center; cursor: pointer;background: #333;}#bm-finder-2:hover{color: #9ACD32; background: #000;}';
bmStyle += '#bm-pm-2{z-index: 10; position: fixed; left: 50%; top:0; width: 450px; margin: 0 0 0 0px; padding:12px 0; color:#FFF; text-align: center; cursor: pointer;background: #333;}#bm-pm-2:hover{color: #9ACD32; background: #000;}';
bmStyle += '#bm-mask{display: none; z-index: 5; position: fixed; left: 0; top: 0; width: 100%; height: 100%; background: gray;}';
bmStyle += '#bm_history table[cellpadding="2"][cellspacing="1"] > tbody > tr:not(:first-child):not([style]) {display: none;}';
bmStyle += '</style>';

closeHistory = function() {
  $j('div#bm').fadeOut(500);
  $j('div#bm-mask').fadeOut(800);
}

if(userID) {
  $j('head').append(bmStyle);
  $j('body').append('<ul id="bm-menu"><li id="bm-finder">名已留</li><li id="bm-pm">PM</li></ul>' + 
                    '<div id="bm_message"></div>' +
                    '<div id="bm"><div id="bm_history"></div><div id="bm-finder-2">名已留</div><div id="bm-pm-2">PM</div></div>' +
                    '<div id="bm-mask"></div>');

  $j('#bm-pm').css("opacity", "0");
  $j('#bm-finder-2').css("opacity", "0.7");
  $j('#bm-pm-2').css("opacity", "0.7");

  $j('#bm-menu').hover(function(){
      $j('#bm-pm').stop();
      $j('#bm-pm').css("display", "block");
      $j('#bm-pm').animate({"opacity": "1"},500);
  },function(){
    $j('#bm-pm').animate({"opacity": "0"},500, function(){$j('#bm-pm').hide()});
  });

  $j('#bm-finder').click(function () {requestMEL()});
  $j('#bm-finder-2').click(function () {requestMEL()});

  $j('#bm-pm').click(function () {requestPM()});
  $j('#bm-pm-2').click(function () {requestPM()});

  $j('#bm-mask').click(function () {closeHistory()});
}

var script = document.createElement('script');
script.type = "text/javascript";
script.innerHTML = "function isNumberKey(evt) { \n\
  var charCode = (evt.which) ? evt.which : event.keyCode \n\
  if (charCode > 31 && (charCode < 48 || charCode > 57)) { \n\
    return false; \n\
  } \n\
  return true; \n\
} \n\
function GetMessageBody(id, title) { \n\
  if ($get('ctl00_ContentPlaceHolder1_siteUpdateProgressPM') != null) { \n\
    $get('ctl00_ContentPlaceHolder1_siteUpdateProgressPM').style.display = ''; \n\
    PutBoxToMiddle($get('ctl00_ContentPlaceHolder1_siteUpdateProgressPM'), 150, 30); \n\
  } \n\
  PageMethods.GetPMMessageBody(id, onGetPMBodySucceed, onGetPMBodyFailed); \n\
  $get('spanPMMessageTitle').innerHTML = title; \n\
} \n\
 \n\
function onGetPMBodySucceed(result, userContext, methodName) { \n\
  if ($get('ctl00_ContentPlaceHolder1_siteUpdateProgressPM') != null) { \n\
    $get('ctl00_ContentPlaceHolder1_siteUpdateProgressPM').style.display = 'none'; \n\
  } \n\
  $get('divPMMessageBody').innerHTML = result; \n\
  PutBoxToMiddle($get('DivShowPM'), document.documentElement.clientWidth-220, document.documentElement.clientHeight-60); \n\
  $get('DivShowPM').style.display = ''; \n\
} \n\
 \n\
function onGetPMBodyFailed(error, userContext, methodName) { \n\
  if ($get('ctl00_ContentPlaceHolder1_siteUpdateProgressPM') != null) { \n\
      $get('ctl00_ContentPlaceHolder1_siteUpdateProgressPM').style.display = 'none'; \n\
  } \n\
  alert('An error occurred') \n\
}var PageMethods = function() { \n\
PageMethods.initializeBase(this); \n\
this._timeout = 0; \n\
this._userContext = null; \n\
this._succeeded = null; \n\
this._failed = null; \n\
} \n\
PageMethods.prototype = { \n\
_get_path:function() { \n\
 var p = this.get_path(); \n\
 if (p) return p; \n\
 else return PageMethods._staticInstance.get_path();}, \n\
GetPMMessageBody:function(PM_ID,succeededCallback, failedCallback, userContext) { \n\
return this._invoke(this._get_path(), 'GetPMMessageBody',false,{PM_ID:PM_ID},succeededCallback,failedCallback,userContext); }} \n\
PageMethods.registerClass('PageMethods',Sys.Net.WebServiceProxy); \n\
PageMethods._staticInstance = new PageMethods(); \n\
PageMethods.set_path = function(value) { PageMethods._staticInstance.set_path(value); } \n\
PageMethods.get_path = function() { return PageMethods._staticInstance.get_path(); } \n\
PageMethods.set_timeout = function(value) { PageMethods._staticInstance.set_timeout(value); } \n\
PageMethods.get_timeout = function() { return PageMethods._staticInstance.get_timeout(); } \n\
PageMethods.set_defaultUserContext = function(value) { PageMethods._staticInstance.set_defaultUserContext(value); } \n\
PageMethods.get_defaultUserContext = function() { return PageMethods._staticInstance.get_defaultUserContext(); } \n\
PageMethods.set_defaultSucceededCallback = function(value) { PageMethods._staticInstance.set_defaultSucceededCallback(value); } \n\
PageMethods.get_defaultSucceededCallback = function() { return PageMethods._staticInstance.get_defaultSucceededCallback(); } \n\
PageMethods.set_defaultFailedCallback = function(value) { PageMethods._staticInstance.set_defaultFailedCallback(value); } \n\
PageMethods.get_defaultFailedCallback = function() { return PageMethods._staticInstance.get_defaultFailedCallback(); } \n\
PageMethods.set_path('/profilepage.aspx'); \n\
PageMethods.GetPMMessageBody= function(PM_ID,onSuccess,onFailed,userContext) {PageMethods._staticInstance.GetPMMessageBody(PM_ID,onSuccess,onFailed,userContext); }";
document.getElementsByTagName('head')[0].appendChild(script);