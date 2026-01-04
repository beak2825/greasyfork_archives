// ==UserScript==
// @name         Ultimate Webcamdarts Lobby
// @name:fr      Webcamdarts style du lobby et filtrage
// @version      0.98
// @description  New design for Lobby. More Space, color for active player, Friend List & Black List. View more player in lobby and some addditonal feature. Don't use with "webcamdarts" color" and "webcamdarts font-size"
// @description:fr Nouvelle affichage des joueurs dans le lobby ( grille de plus de joueurs) et mise en subrillance des joueurs de votre choix).
// @author       Antoine Maingeot
// @match        https://www.webcamdarts.com/GameOn/Lobby*
// @match        https://www.webcamdarts.com/wda-games/tournaments/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace    https://greasyfork.org/fr/users/505971-antoine-maingeot
// @downloadURL https://update.greasyfork.org/scripts/401652/Ultimate%20Webcamdarts%20Lobby.user.js
// @updateURL https://update.greasyfork.org/scripts/401652/Ultimate%20Webcamdarts%20Lobby.meta.js
// ==/UserScript==

//$('<a class="camtest" href="/GameOn/Game/MemberStats/Antoine" target="_blank" style="position: relative ; bottom:0">Profil </a>').appendTo('#current-user');

//$('<a class="camtest" href="/GameOn/Game/MemberStats/Antoine" target="_blank"style="position: relative:bottom:0">Stats </a>').appendTo('#current-user');
//$('<a class="camtest" href="/GameOn/Game/MemberStats/Antoine" target="_blank"style="position: relative:bottom:0">Messages </a>').appendTo('#current-user');
//$('<a class="camtest" href="/GameOn/Game/MemberStats/Antoine" target="_blank"style="position: relative:bottom:0">Camtest</a>').appendTo('#current-user');
//$('<div><a href="/members/my-profile" target="_blank">Profile</a><a href="/members/my-profile" target="_blank">Profile</a></div>').prependTo('#current-user');

//$('.logout').prepend('<div class="info-profil"><a href="https://game.webcamdarts.com/CamTest" target="_blank">Camtest</a><a href="/members/my-profile" target="_blank">Profile</a></div>');
//$("#myDiv").append('<div id="mySecondDiv"></div>');

//$('.chat-users.k-pane.k-scrollable').html('<div class="info-perso"><a href="https://game.webcamdarts.com/CamTest" target="_blank">Camtest</a><a href="/members/my-profile" target="_blank">Profile</a><a href="#" target="_blank" stats>Stats</a><a href="/members/messages" target="_blank" id="messagesLink">Messages</a><input id="available-filter" type="checkbox" name="available"></div>');
//$( "#info-profil" ).insertAfter( $( ".currenuser-info" ) );
$('#current-user').append('<a class="Camtesting"href="https://game.webcamdarts.com/CamTest" target="_blank">Camtest</a>');
$( "<a class='deco' href='javascript:doLogout()'>Logout</a>" ).appendTo( ".logout" );
//$('.messages-container').html('<div class="info-message"><a href="https://www.webcamdarts.com/forum/wda-archives/2018/1/some-help-for-new-members-2018" target="_blank">New Member Help-</a><a href="https://game.webcamdarts.com/CamTest" target="_blank">Cam Test-</a><a href="https://www.webcamdarts.com/utils/smilies.html" target="_blank">Smilies-</a><a href="https://www.facebook.com/groups/440581142678738/" target="_blank">Facebook Group-</a><a href="https://game.webcamdarts.com/game" target="_blank">Rejoin Game-</a><a href="https://www.webcamdarts.com/shop/category/membership" target="_blank">Tungsten Membership 2020</a></div>');
$('.messages-container').append('<div class="info-message"><a href="https://www.webcamdarts.com/forum/wda-archives/2018/1/some-help-for-new-members" target="_blank">New Member Help</a><a href="https://game.webcamdarts.com/CamTest" target="_blank">Cam Test</a><a href="https://www.webcamdarts.com/utils/smilies.html" target="_blank">Smilies</a><a href="https://www.facebook.com/groups/440581142678738/" target="_blank">Facebook Group</a><a href="https://game.webcamdarts.com/game" target="_blank">Rejoin Game</a><a href="https://www.webcamdarts.com/shop/category/membership" target="_blank">Tungsten Membership 2020</a></div>');
//<span id="span_VGV4dCBIaWdobGlnaHQgYW5kIFNlZWtfMWEyMmYxMjYtMDUxOC00ZGQyLTllYWYtOWE4ZGIxZjVmOTk0_menucmd_undefined" class="clickable" title="Text Highlight and Seek">Show Text Highlight and Seek Bar - View, Edit, Add Keywords and Styles</span>
//$( "<div class='useropt k-link k-header'><div class='stausicon available'></div><div class='label'><strong>Available</strong></div></div>" ).appendTo( ".logout" );
//$('#lobby').append('<div class="useropt k-link k-header"><div class="stausicon available"></div><div class="label"><strong>Available</strong></div></div> ');
 //var avail = $("<div class='useropt k-link k-header'><div class='stausicon available'></div><div class='label'><strong>Available</strong></div></div>");
  //      var busy = $("<div class='useropt k-link k-header'><div class='stausicon busy'></div><div class='label'><strong>Busy</strong></div></div>");

//$( ".info-handle" ).add( document.getElementById( "div" ) ).css({"position":"relative","left":"0px","margin-top":"0px"});

var recbutton = document.createElement("div");
recbutton.innerHTML = '<div id="recbutton" style="width:100%;height:25px; position:fixed; bottom:0px;font-size:smaller;margin-left:2px;white-space: nowrap;display: inline-block; " ><a href="https://chrome.google.com/webstore/detail/recordrtc/ndcljioonkecdnaaihodjgiliohngojp" target="_blank">Record your match (save & upload youtube) with RecordRTC</a> or <a href="https://chrome.google.com/webstore/detail/webrtc-desktop-sharing/nkemblooioekjnpfekmjhpgkackcajhg" target="_blank">Stream your match (max 10 friends) with WebRTC Sharing</a> Extension for Google Chrome</div>';

// Get the reference node
var referenceNode1 = document.querySelector('#textMessage');

// Insert the new node before the reference node
referenceNode1.after(recbutton);

(function() {
    'use strict';
function addGlobalStyle(css) {
   var head, style;
   head = document.getElementsByTagName('head')[0];
   if (!head) { return; }
   style = document.createElement('style');
   style.type = 'text/css';
   style.innerHTML = css;
   head.appendChild(style);
}
addGlobalStyle('.rMenu.userli.avaiable{order:1;}')
addGlobalStyle('.rMenu.userli.busy{order:2;}')
addGlobalStyle('.container{max-width: 670px;}')
addGlobalStyle('.Camtesting{position: absolute;right:40px;bottom:18px;float:right;}')
addGlobalStyle('.logout {position: relative;top: 50px;}');
addGlobalStyle('#current-user > div.currenuser-info > div.userinfo {position: relative;left:57px;bottom: 17px;height:100%;width:fit-content }');
addGlobalStyle('#current-user > div.currenuser-info > div.userinfo > p:nth-child(2) {font-size: 14px;}');
addGlobalStyle('#current-user > div.currenuser-info > div.userimage,#current-user > div.currenuser-info > div.userimage > img {position: absolute;top: 0px;width:54px;height:53px;  }');
addGlobalStyle(' .info-message a {padding-right:5px;}');
addGlobalStyle(' .info-message {font-weight: bold;background-color:#302E2E;font-size:14px;width: 65%;overflow-x: auto;overflow-y: hidden;white-space: nowrap;display: inline-block; }');
addGlobalStyle('k-widget {background-color:transparent;}');
addGlobalStyle(' #currenuser-info {z-index:4000; }');
addGlobalStyle(' #current-user.available, .userli.available {cursor: pointer; background-color: #4b560d60; }');
addGlobalStyle('.cusermenu {top: 77px;position: absolute;opacity:0.7;}');
addGlobalStyle('#current-user.busy{ background-color: #572525; }');
addGlobalStyle('.motdcont {display:none;}');
addGlobalStyle('#info-profil {position:absolute;display:block;width:100%;color:white;}');
addGlobalStyle('.logout {position: relative;top: 35px;float:right;}');
//TEST avec search bar//
addGlobalStyle('.messages-container {height: 23px;position: sticky;min-width: 100%;width: 100%;top: -4px;background-color: #302E2E;');
addGlobalStyle(' .info-message {font-weight: bold;background-color:#302E2E;font-size:14px;width: 100%;overflow-x: auto;overflow-y: hidden;white-space: nowrap;display: inline-block; }');
addGlobalStyle('#lobby > div > div:nth-child(16) > div.chat-container.k-widget.k-splitter > div.split-view.k-pane.k-scrollable.k-widget.k-splitter > div.chat-users.k-pane.k-scrollable > div:nth-child(1){font-size:13px;height:31px;position: fixed;top:60px;right:7px;background-color:#302E2E;}');
addGlobalStyle('#lobby > div > div:nth-child(16) > div.chat-container.k-widget.k-splitter{min-height: 100%;position: fixed;}');
addGlobalStyle('#lobby > div > div:nth-child(16) > div.chat-container.k-widget.k-splitter > div.split-view.k-pane.k-scrollable.k-widget.k-splitter {min-height: 82.5%;}');
addGlobalStyle('.bighonkinglogoutbutton{display:none; }');
addGlobalStyle('#lobby > div > div:nth-child(16) > div.chat-container.k-widget.k-splitter > div.split-view.k-pane.k-scrollable.k-widget.k-splitter > div.chat-users.k-pane.k-scrollable > div.bighonkinglogoutbutton > a {display:none;}');
//TEST//
addGlobalStyle('.messages-container {height: 23px;position: sticky;min-width: 100%;width: 100%;top: -4px;background-color: #302E2E;');
addGlobalStyle('#nav,.band.navigation{max-width: 670px;position:absolute;z-index:10; }');
addGlobalStyle('#nav{display:inline;border-bottom: 0px;}');
addGlobalStyle('#current-user {height: auto;border: none;padding-top: 0px;padding-left: 0px;border-radius: 0px;padding-top: 0px;margin-right: 0px;}');
addGlobalStyle('div.chat-window-container.k-pane.k-scrollable{padding:0px; }');
addGlobalStyle('#users{height:fit-content;min-height: 78%;}');
addGlobalStyle('.chat-messagebar{margin-left:0px;}');
addGlobalStyle('#textMessage{min-width:100%;margin-left:0px;}');
addGlobalStyle('#lobby > div > div:nth-child(16) > div.chat-container.k-widget.k-splitter > div.chat-messagebar.k-pane{margin-top:-120px;margin-left:0px;}');
addGlobalStyle('.chat-container .chat-messagebar #textMessage {;margin-left:0px;}');
addGlobalStyle('.k-state-default{border-color: #2b2b2b00; }');
addGlobalStyle('#lobby > div > div:nth-child(16) > div.chat-container.k-widget.k-splitter > div:nth-child(4) {display: none; }');
addGlobalStyle('#lobby > div > div:nth-child(16) > div.chat-container.k-widget.k-splitter{min-height:100%;}');
addGlobalStyle('#lobby, .lobby {min-height:100%;}');
addGlobalStyle('#users {margin-top:28px; padding-top:0px;margin-top:18px;position:fixed;right: 0px;min-height: 77.2%;min-width: max-content; box-sizing:border-box; height:200px; background-color: #8cffa0;}');
//grille joueurs
addGlobalStyle('#users {display: flex;flex-wrap: wrap;place-content: flex-start;height:fit-content;right: 0px;box-sizing: border-box;min-width: 50%;max-width: 50%;zoom: 83%;}');
addGlobalStyle('#users{height:fit-content;}');
addGlobalStyle('#lobby > div > div:nth-child(16) > div.chat-container.k-widget.k-splitter > div.split-view.k-pane.k-scrollable.k-widget.k-splitter{min-height:100%;}');
addGlobalStyle('.cusermenu{position:absolute; top:0px;}');
addGlobalStyle('div#current-user {position: fixed;top:0px;width: 275px;right: 0px;height: 55px;padding-right: 4px;;z-index:9999992;}');
addGlobalStyle('#current-user > div > div.optionContainer > div {width:0px;display:none;position:fixedvisibility:hidden;}');
addGlobalStyle('.optionContainer {position: fixed;width: 150px;top: 25px;right: 340px;visibility: visible;;}');
addGlobalStyle('#current-user > div > div.optionContainer > div > div:nth-child(1) {position: fixed;right: 275px;height: 25px;width: fit-content;top: 24px;width: -moz-fit-content;}');
addGlobalStyle('#current-user > div > div.optionContainer > div > div:nth-child(2) {position: fixed;right: 275px;top: 0px;height: 25px;width: 111px;width: -moz-fit-content;}');
addGlobalStyle('.useropt .label {float: left;padding: 6px;padding-top:0px;width: fit-content; }');
addGlobalStyle('.stausicon.available, .stausicon.busy {height: 20px;width: 20px;padding: 10px;margin-left: 10px;margin-top: 2px;}');
addGlobalStyle('#current-user > div > div.user-camnotapproved,#current-user > div > div.user-camapproved {    margin-top: 0px;margin-left: 0px;float: right;margin-top: 0px;margin-right: 5px; }');
addGlobalStyle('#current-user .user-camnotapproved,#current-user .user-camapproved {width: 16px;height: 16px;background-size: 16px 16px;margin-left: 0px;left: 0px;}');
addGlobalStyle('.userimage {float: left;height: 50px;width: 50px;}');
//EFFACER MESSAGE
addGlobalStyle('#lobby > div > div:nth-child(16) > div.chat-container.k-widget.k-splitter > div.split-view.k-pane.k-scrollable.k-widget.k-splitter > div.chat-window-container.k-pane.k-scrollable { padding: 0px;min-width: 50%;max-width: 50%;overflow:visible;max-height:80%;min-height:80%;}');
addGlobalStyle('#nav > div{display:block;max-width:50%;}');
addGlobalStyle('#lobby > div > div:nth-child(16) > div.chat-container.k-widget.k-splitter > div.split-view.k-pane.k-scrollable.k-widget.k-splitter > div.lobby-game-info.k-pane {z-index:15;}');
addGlobalStyle('.maincont{margin-top:23px;width:100%;margin-left:0px;}');
addGlobalStyle('#tray{position:absolute;max-width:40%;}');
addGlobalStyle('#mc-l{width: fit-content;}');
addGlobalStyle('#nav {position: fixed;  font: initial; }');
addGlobalStyle('#tray {padding: 0 0 0 0; }');
addGlobalStyle('.social_menu { display: none; }');
addGlobalStyle('.motds a { font-size: 12px; }');
addGlobalStyle('#nav { top: 0px; }');
addGlobalStyle('.mt35 {margin-top:6px!important;min-width: 100%;min-height: 100%;position: fixed;top: 0px; }');
addGlobalStyle('.tabs-content {height: 100%;width: 100%;position: absolute;');
addGlobalStyle('nav.primary ul li a {font-size: 12px;line-height: 12px; padding: 0 7px; }');
addGlobalStyle('.username {display: none; }');
addGlobalStyle('.mc-l { width:100%; }');
addGlobalStyle('#current-user .userinfo p {margin-top: 0px;}');
addGlobalStyle('.summary .inplay.title .THmo{    width: auto;})');

addGlobalStyle('.game-result{margin-left:0px;padding:2px;min-width:540px;max-width:100%;padding-bottom: 5px;opacity:1;}');
addGlobalStyle('.gr table{text-align:center;}');
addGlobalStyle('.gr table tbody td{color: #7D7D7D;border-left: 1px solid #7D7D7D;font-size: 0.9em;}');
addGlobalStyle('.gr table td{padding: 3px 3px;}');
addGlobalStyle('.full-game-result tr:nth-child(even){background: #525252})');
addGlobalStyle('.full-game-result tr:nth-child(odd){background: #302E2E})');
addGlobalStyle('.full-game-result td {text-transform: uppercase;})');
addGlobalStyle('.full-game-result tr td {color: unset;text-align: right; font-weight:bold})');
addGlobalStyle('.full-game-result tr td + td { color: white;font-weight:unset})');
//addGlobalStyle('.info-handle {position: sticky;top: 59px;height:19px;width:51px;opacity: 0.7;margin-bottom: 1px;margin-left: 6px;line-height:14px;padding-top: 1px;padding-left: 1px;transform: rotate(0turn);background: content-box;border: none;text-transform: uppercase;}');
addGlobalStyle('.info-handle {position: absolute; height: 0px;opacity: 0.7;top:unset;bottom:unset;width:0px; margin-bottom: unset;margin-left: unset;line-height: 20px;padding-top: 25%;transform: rotate(0turn);padding-bottom: unset;background: content-box;border: none;text-transform: uppercase;padding-left: unset;}');
addGlobalStyle('#lobby > div > div:nth-child(16) > div.chat-container.k-widget.k-splitter > div.split-view.k-pane.k-scrollable.k-widget.k-splitter > div.lobby-game-info.k-pane{ z-index: 2;})');



})();

/* --------- FOR Friends ---------*/

(function() { // anonymous function wrapper, used for error checking & limiting scope
  'use strict';

  if (window.self !== window.top) { return; } // end execution if in a frame

  // setting User Preferences
  function setUserPref(varName, defaultVal, menuText, promtText, sep){
    GM_registerMenuCommand(menuText, function() {
      var val = prompt(promtText, GM_getValue(varName, defaultVal));
      if (val === null)  { return; }  // end execution if clicked CANCEL
      // prepare string of variables separated by the separator
      if (sep && val){
        var pat1 = new RegExp('\\s*' + sep + '+\\s*', 'g'); // trim space/s around separator & trim repeated separator
        var pat2 = new RegExp('(?:^' + sep + '+|' + sep + '+$)', 'g'); // trim starting & trailing separator
        val = val.replace(pat1, sep).replace(pat2, '');
      }
      val = val.replace(/\s{2,}/g, ' ').trim();    // remove multiple spaces and trim
      GM_setValue(varName, val);
      // Apply changes (immediately if there are no existing highlights, or upon reload to clear the old ones)
      if(!document.body.querySelector(".THmo")) THmo_doHighlight(document.body);
      else location.reload();
    });
  }

  // prepare UserPrefs
  setUserPref(
  'keywordsfriends',
  'word 1,word 2,word 3',
  'Set Friends List',
  'Set keywordsfriends separated by comma\t\t\t\t\t\t\t\r\n\r\nExample:\r\nword 1,word 2,word 3',
  ','
  );

  setUserPref(
  'highlightStyleFriends',
  'color: transparent; background-color: #ffebcd;',
  'Set Highlight Style',
  'Set the Highlight Style (use proper CSS)\r\Example color: www.color-hex.com\r\nExample:\r\ncolor: #f00; font-weight: bold; background-color: #ffe4b5;'
  );

  // Add MutationObserver to catch content added dynamically
  var THmo_MutOb = (window.MutationObserver) ? window.MutationObserver : window.WebKitMutationObserver;
  if (THmo_MutOb){
    var THmo_chgMon = new THmo_MutOb(function(mutationSet){
      mutationSet.forEach(function(mutation){
        for (var i=0; i<mutation.addedNodes.length; i++){
          if (mutation.addedNodes[i].nodeType == 1){
            THmo_doHighlight(mutation.addedNodes[i]);
          }
        }
      });
    });
    // attach chgMon to document.body
    var opts = {childList: true, subtree: true};
    THmo_chgMon.observe(document.body, opts);
  }
  // Main workhorse routine
  function THmo_doHighlight(el){
    var keywordsfriends = GM_getValue('keywordsfriends');
    if(!keywordsfriends)  { return; }  // end execution if not found
    var highlightStyleFriends = GM_getValue('highlightStyleFriends');
    if (!highlightStyleFriends) highlightStyleFriends = "color:#00f; font-weight:bold; background-color: #0f0;"

    var rQuantifiers = /[-\/\\^$*+?.()|[\]{}]/g;
    keywordsfriends = "\\b" + keywordsfriends.replace(/\,/g, "\\b|\\b", '\\$&').split(',').join('|') + "\\b";
    var pat = new RegExp('(' + keywordsfriends + ')', 'gi');
    var span = document.createElement('span');
    // getting all text nodes with a few exceptions
    var snapElements = document.evaluate(
        './/text()[normalize-space() != "" ' +
        'and not(ancestor::style) ' +
        'and not(ancestor::script) ' +
        'and not(ancestor::textarea) ' +
        'and not(ancestor::code) ' +
        'and not(ancestor::pre)]',
        el, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

    if (!snapElements.snapshotItem(0)) { return; }  // end execution if not found

    for (var i = 0, len = snapElements.snapshotLength; i < len; i++) {
      var node = snapElements.snapshotItem(i);
      // check if it contains the keywords
      if (pat.test(node.nodeValue)) {
        // check that it isn't already highlighted
        if (node.className != "THmo" && node.parentNode.className != "THmo"){
          // create an element, replace the text node with an element
          var sp = span.cloneNode(true);
          sp.innerHTML = node.nodeValue.replace(pat, '<span style="' + highlightStyleFriends + '" class="THmo">$1</span>');
          node.parentNode.replaceChild(sp, node);
        }
      }
    }
  }

    /* --------- FOR BLACK LIST ---------*/

    // first run
  THmo_doHighlight(document.body);



  // setting User Preferences
  function setUserPref2(varName, defaultVal, menuText, promtText, sep){
    GM_registerMenuCommand(menuText, function() {
      var val = prompt(promtText, GM_getValue(varName, defaultVal));
      if (val === null)  { return; }  // end execution if clicked CANCEL
      // prepare string of variables separated by the separator
      if (sep && val){
        var pat1 = new RegExp('\\s*' + sep + '+\\s*', 'g'); // trim space/s around separator & trim repeated separator
        var pat2 = new RegExp('(?:^' + sep + '+|' + sep + '+$)', 'g'); // trim starting & trailing separator
        val = val.replace(pat1, sep).replace(pat2, '');
      }
      val = val.replace(/\s{2,}/g, ' ').trim();    // remove multiple spaces and trim
      GM_setValue(varName, val);
      // Apply changes (immediately if there are no existing highlights, or upon reload to clear the old ones)
      if(!document.body.querySelector(".THmo")) THmo_doHighlight2(document.body);
      else location.reload();
    });
  }

  // prepare UserPrefs
  setUserPref2(
  'keywordsblack',
  'word 1,word 2,word 3',
  'Set Black List',
  'Set keywordsblack separated by comma\t\t\t\t\t\t\t\r\n\r\nExample:\r\nword 1,word 2,word 3',
  ','
  );

  setUserPref2(
  'highlightStyleBlack',
  'color: #FFF; background-color: #000;',
  'Set Black List Style',
  'Set the Highlight Style (use proper CSS)\r\Example color: www.color-hex.com\r\nExample:\r\ncolor: #000; font-weight: bold; background-color: #FFF;'
  );


  // Add MutationObserver to catch content added dynamically
  var THmo_MutOb2 = (window.MutationObserver) ? window.MutationObserver : window.WebKitMutationObserver;
  if (THmo_MutOb2){
    var THmo_chgMon2 = new THmo_MutOb2(function(mutationSet){
      mutationSet.forEach(function(mutation){
        for (var i=0; i<mutation.addedNodes.length; i++){
          if (mutation.addedNodes[i].nodeType == 1){
            THmo_doHighlight2(mutation.addedNodes[i]);
          }
        }
      });
    });
    // attach chgMon to document.body
    var opts2 = {childList: true, subtree: true};
    THmo_chgMon2.observe(document.body, opts2);
  }
  // Main workhorse routine
  function THmo_doHighlight2(el){
    var keywordsblack = GM_getValue('keywordsblack');
    if(!keywordsblack)  { return; }  // end execution if not found
    var highlightStyleBlack = GM_getValue('highlightStyleBlack');
    if (!highlightStyleBlack) highlightStyleBlack = "color:#fff; font-weight:bold; background-color: #000;"

    var rQuantifiers = /[-\/\\^$*+?.()|[\]{}]/g;
    keywordsblack = "\\b" + keywordsblack.replace(/\,/g, "\\b|\\b", '\\$&').split(',').join('|') + "\\b";
    var pat = new RegExp('(' + keywordsblack + ')', 'gi');
    var span = document.createElement('span');
    // getting all text nodes with a few exceptions
    var snapElements = document.evaluate(
        './/text()[normalize-space() != "" ' +
        'and not(ancestor::style) ' +
        'and not(ancestor::script) ' +
        'and not(ancestor::textarea) ' +
        'and not(ancestor::code) ' +
        'and not(ancestor::pre)]',
        el, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

    if (!snapElements.snapshotItem(0)) { return; }  // end execution if not found

    for (var i = 0, len = snapElements.snapshotLength; i < len; i++) {
      var node = snapElements.snapshotItem(i);
      // check if it contains the keywords
      if (pat.test(node.nodeValue)) {
        // check that it isn't already highlighted
        if (node.className != "THmo" && node.parentNode.className != "THmo"){
          // create an element, replace the text node with an element
          var sp = span.cloneNode(true);
          sp.innerHTML = node.nodeValue.replace(pat, '<span style="' + highlightStyleBlack + '" class="THmo">$1</span>');
          node.parentNode.replaceChild(sp, node);
        }
      }
    }
  }


  // first run
  THmo_doHighlight2(document.body);
})(); // end of anonymous function

/* --------- FOR THIRD STYLE ---------*/

(function() { // anonymous function wrapper, used for error checking & limiting scope
  'use strict';

  if (window.self !== window.top) { return; } // end execution if in a frame

  // setting User Preferences
  function setUserPref3(varName, defaultVal, menuText, promtText, sep){
    GM_registerMenuCommand(menuText, function() {
      var val = prompt(promtText, GM_getValue(varName, defaultVal));
      if (val === null)  { return; }  // end execution if clicked CANCEL
      // prepare string of variables separated by the separator
      if (sep && val){
        var pat1 = new RegExp('\\s*' + sep + '+\\s*', 'g'); // trim space/s around separator & trim repeated separator
        var pat2 = new RegExp('(?:^' + sep + '+|' + sep + '+$)', 'g'); // trim starting & trailing separator
        val = val.replace(pat1, sep).replace(pat2, '');
      }
      val = val.replace(/\s{2,}/g, ' ').trim();    // remove multiple spaces and trim
      GM_setValue(varName, val);
      // Apply changes (immediately if there are no existing highlights, or upon reload to clear the old ones)
      if(!document.body.querySelector(".THmo")) THmo_doHighlight3(document.body);
      else location.reload();
    });
  }

  // prepare UserPrefs
  setUserPref3(
  'keywords3',
  'word 1,word 2,word 3',
  'Set Personal Style',
  'Set keywords separated by comma\t\t\t\t\t\t\t\r\n\r\nExample:\r\nword 1,word 2,word 3',
  ','
  );

  setUserPref3(
  'highlightStyle3',
  'color: #f00; background-color: #ffebcd;',
  'Set Highlight Syle 01',
  'Set the Highlight Style (use proper CSS)\r\Example color: www.color-hex.com\r\nExample:\r\ncolor: #f01466; font-weight: bold; background-color: #dedede;'
  );


  // Add MutationObserver to catch content added dynamically
  var THmo_MutOb3 = (window.MutationObserver) ? window.MutationObserver : window.WebKitMutationObserver;
  if (THmo_MutOb3){
    var THmo_chgMon3 = new THmo_MutOb3(function(mutationSet){
      mutationSet.forEach(function(mutation){
        for (var i=0; i<mutation.addedNodes.length; i++){
          if (mutation.addedNodes[i].nodeType == 1){
            THmo_doHighlight3(mutation.addedNodes[i]);
          }
        }
      });
    });
    // attach chgMon to document.body
    var opts3 = {childList: true, subtree: true};
    THmo_chgMon3.observe(document.body, opts3);
  }
  // Main workhorse routine
  function THmo_doHighlight3(el){
    var keywords3 = GM_getValue('keywords3');
    if(!keywords3)  { return; }  // end execution if not found
    var highlightStyle3 = GM_getValue('highlightStyle3');
    if (!highlightStyle3) highlightStyle3 = "color:#f01466; font-weight:bold; background-color: #dedede;"

    var rQuantifiers = /[-\/\\^$*+?.()|[\]{}]/g;
    keywords3 = "\\b" + keywords3.replace(/\,/g, "\\b|\\b", '\\$&').split(',').join('|') + "\\b";
    var pat = new RegExp('(' + keywords3 + ')', 'gi');
    var span = document.createElement('span');
    // getting all text nodes with a few exceptions
    var snapElements = document.evaluate(
        './/text()[normalize-space() != "" ' +
        'and not(ancestor::style) ' +
        'and not(ancestor::script) ' +
        'and not(ancestor::textarea) ' +
        'and not(ancestor::code) ' +
        'and not(ancestor::pre)]',
        el, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

    if (!snapElements.snapshotItem(0)) { return; }  // end execution if not found

    for (var i = 0, len = snapElements.snapshotLength; i < len; i++) {
      var node = snapElements.snapshotItem(i);
      // check if it contains the keywords
      if (pat.test(node.nodeValue)) {
        // check that it isn't already highlighted
        if (node.className != "THmo" && node.parentNode.className != "THmo"){
          // create an element, replace the text node with an element
          var sp = span.cloneNode(true);
          sp.innerHTML = node.nodeValue.replace(pat, '<span style="' + highlightStyle3 + '" class="THmo">$1</span>');
          node.parentNode.replaceChild(sp, node);
        }
      }
    }
  }
  // first run
  THmo_doHighlight3(document.body);
})(); // end of anonymous function