// ==UserScript==
// @name         Awesome Lobby Overhaul Q2 2022 for Webcamdarts
// @version      0.1.1
// @description  Overhaul of the Webcamdarts Lobby layout with additional friend- and blocklist functions, heavily inspired and based on Ultimate Webcamdarts Lobby, not inteded to be used with the same or corresponding scripts.
// @author       AlexisDot, AntoineMaingeot (Friendlist Features)
// @license      MIT
// @match        https://www.webcamdarts.com/GameOn/Lobby*
// @match        https://www.webcamdarts.com/wda-games/tournaments/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace    https://greasyfork.org/en/users/913506-alexisdot
// @downloadURL https://update.greasyfork.org/scripts/446051/Awesome%20Lobby%20Overhaul%20Q2%202022%20for%20Webcamdarts.user.js
// @updateURL https://update.greasyfork.org/scripts/446051/Awesome%20Lobby%20Overhaul%20Q2%202022%20for%20Webcamdarts.meta.js
// ==/UserScript==
/*jshint esversion: 6 */ 

(function() {
    'use strict';

    document.head.insertAdjacentHTML("beforeend",`
<style>

    html {
        overflow: hidden;
    }

    #current-user {
        width: 300px;
        border-radius: unset !important;
        position: absolute !important;
        right: 150px;
        top: 0;
        z-index: 9999;
        height: 84px;
        margin-right: 0 !important;
        border-color: #333 !important;
    }

    #current-user .logout {
        display: flex;
        justify-content: space-between;
        width: 280px;
    }

    #current-user.busy::after {
        content: "";
        position: absolute;
        top: 0;
        right: -10px;
        height: 100%;
        width: 10px;
        background: #CB0A0A !important;
    }

    #current-user.available::after {
        content: "";
        position: absolute;
        top: 0;
        right: -10px;
        height: 100%;
        width: 10px;
        background: #00C300 !important;
    }

    #current-user .logout {
        top: 60px;
        margin-left: 0px;
    }

    #current-user .optionContainer {
        position: absolute !important;
        top: -1px !important;
        right: -160px !important;
        transform: none !important;
    }

    #current-user .useroptions {
        background: none !important;
        border: none !important;
        border-radius: 0 !important;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        height: 100% !important;
        display: block !important;
        overflow: visible !important;
    }

    .useroptions * {
        display: flex;
        width: 150px;
    }

    .useroptions .useropt {
        height: 42px !important;
        border: #333 1px solid;
        border-style: inset
    }

    .rMenu.userli.available.order-friends {
        order: 1
    }

    .rMenu.userli.available {
        background: #DDD;
        border: 0px solid transparent;
        border-bottom: 10px solid #00C300;
        color: #030303;
        order: 2;
    }

    .rMenu.userli.busy.order-friends {
        order: 3;
    }

    .rMenu.userli.busy {
        background: #BBB;
        border: 0px solid transparent;
        border-bottom: 10px solid #CB0A0A;
        color: #030303;
        order: 4;
    }

    .rMenu.userli.available.order-block {
        order: 5
    }

    .rMenu.userli.busy.order-block {
        order: 6;
    }



    .info-handle {
        position: absolute;
        top: 28px;
        z-index: 99999;
        left: calc(50vw + 6px) !important;
        -webkit-transform: rotate(0deg);
        -moz-transform: rotate(0deg);
        -ms-transform: rotate(0deg);
        -o-transform: rotate(0deg);
        border-top: none !important;
        margin: 0 !important;
        background: none !important;
        padding: unset !important;
        float: none;
        width: unset !important;
        height: 24px;
        line-height: 24px;
        text-decoration: underline;
    }


    .lobby-game-info.k-pane {
        left: calc(50vw - 240px) !important;
    }


    #nav>div:first-child {
        width: calc(100vw - 500px);
        max-width: calc(100vw - 500px);
    }

    #nav>div:first-child .container {
        width: calc(100vw - 500px);
        max-width: calc(100vw - 500px);
        height: 100% !important;
    }


    .useroptions {
        display: block !important;
    }

    .useropt {
        width: 150px !important;
        height: 28px !important;
    }

    .useropt:first-child {
        top: 28px !important;
    }

    .cusermenu {
        display: none;
    }


    .uwdal-clickable {
        text-decoration: underline !important;
        cursor: pointer !important;
        font-weight: bold !important;
    }

    #topheader {
        display: none !important;
    }

    #tray {
        padding: 0;
        height: 84px !important
    }

    #tray #nav {
        position: relative;
        top: 0;
        height: 100% !important;
    }

    #nav nav ul li a {
        padding: 0 6px;
    }

    .stausicon.available {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 6 6'%3E%3Cdefs%3E%3CradialGradient id='c' gradientUnits='userSpaceOnUse' cy='21.5' cx='47.5' r='2.5'%3E%3Cstop style='stop-color:%2300c300;stop-opacity:0' offset='0'/%3E%3Cstop style='stop-color:%2300c300;stop-opacity:.49804' offset='.82'/%3E%3Cstop style='stop-color:%23aeffae' offset='1'/%3E%3C/radialGradient%3E%3CradialGradient id='b' gradientUnits='userSpaceOnUse' cy='21.5' cx='47.5' r='2.5'%3E%3Cstop style='stop-color:%23fff' offset='0'/%3E%3Cstop style='stop-color:%230dee1b;stop-opacity:0' offset='1'/%3E%3C/radialGradient%3E%3CradialGradient id='a' cx='-87.5' gradientUnits='userSpaceOnUse' cy='62.5' r='2.5'%3E%3Cstop style='stop-color:%23000' offset='0'/%3E%3Cstop style='stop-color:%23000' offset='.516'/%3E%3Cstop style='stop-color:%23a6a6a6' offset='.76'/%3E%3Cstop style='stop-color:%23353535' offset='.9'/%3E%3Cstop style='stop-color:%23000' offset='1'/%3E%3C/radialGradient%3E%3C/defs%3E%3Cpath style='fill:url(%23a)' d='M-85 62.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z' transform='matrix(1.2 0 0 1.2 108 -72)'/%3E%3Cpath style='fill:%2300c300' d='M50 21.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z' transform='translate(-44.5 -18.5)'/%3E%3Cpath style='fill:url(%23b)' d='M50 21.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z' transform='translate(-44.1 -18.9)'/%3E%3Cpath style='fill:url(%23c)' d='M50 21.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z' transform='translate(-44.5 -18.5)'/%3E%3C/svg%3E");
    }

    .stausicon.busy {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 6 6'%3E%3Cdefs%3E%3CradialGradient id='b' gradientUnits='userSpaceOnUse' cy='21.5' cx='47.5' r='2.5'%3E%3Cstop style='stop-color:%23c30000;stop-opacity:0' offset='0'/%3E%3Cstop style='stop-color:%23c30000;stop-opacity:.49804' offset='.82'/%3E%3Cstop style='stop-color:%23ffaeae' offset='1'/%3E%3C/radialGradient%3E%3CradialGradient id='c' gradientUnits='userSpaceOnUse' cy='21.5' cx='47.5' r='2.5'%3E%3Cstop style='stop-color:%23fff' offset='0'/%3E%3Cstop style='stop-color:%23ee0d0d;stop-opacity:0' offset='1'/%3E%3C/radialGradient%3E%3CradialGradient id='a' cx='-87.5' gradientUnits='userSpaceOnUse' cy='62.5' r='2.5'%3E%3Cstop style='stop-color:%23000' offset='0'/%3E%3Cstop style='stop-color:%23000' offset='.452'/%3E%3Cstop style='stop-color:%23a6a6a6' offset='.76'/%3E%3Cstop style='stop-color:%23353535' offset='.91'/%3E%3Cstop style='stop-color:%23000' offset='1'/%3E%3C/radialGradient%3E%3C/defs%3E%3Cpath style='fill:url(%23a)' d='M-85 62.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z' transform='matrix(1.2 0 0 1.2 108 -72)'/%3E%3Cpath style='fill:%23c30000' d='M50 21.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z' transform='translate(-44.5 -18.5)'/%3E%3Cpath style='fill:url(%23b)' d='M50 21.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z' transform='translate(-44.5 -18.5)'/%3E%3Cpath style='fill:url(%23c)' d='M50 21.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z' transform='translate(-44.1 -18.9)'/%3E%3C/svg%3E");
    }

    .stausicon {
        border-radius: 50% !important;
        box-shadow: 0px 0px 5px black;
    }

    .chat-users>div:first-child {
        text-align: right
    }

    #users {
        height: calc(100vh - 235px) !important;
    }

    .userimage {
        width: 50px;
    }

    .userli .userinfo {
        width: calc(100% - 60px);
    }


    .userinfo .fn {
        color: #444
    }

    div.user-camapproved {
        margin-right: 5px;
        filter: drop-shadow(0px 0px 2px #000);
    }

    div.user-camapproved {
        margin-right: 5px;
        filter: drop-shadow(0px 0px 2px #000);
    }

    div.user-camnotapproved {
        margin-right: 5px;
        filter: drop-shadow(0px 0px 1px #000);
    }

    .maincont {
        margin: 0;
        padding: 0;
    }

    .maincont .tabs {
        padding: 0 5px;
        height: 30px !important;
    }

    .motdcont.k-pane.k-scrollable {
        width: 100% !important;
        height: 26px !important;
        border-bottom: 1px solid white;
        padding-left: 10px;
        padding-top: 3px;
    }

    .motdcont a {
        margin-right: 10px;
    }

    .motds a,
    .motds a::visited {
        color: #ccc !important;
    }

    .tabs-content li {
        border: none !important;
    }


    .band.container {
        width: 100vw;
        margin-top: 5px !important;
    }

    .band.container .band.container {
        width: 100%;
    }

    .k-widget {
        border-radius: unset !important;
    }

    .split-view.k-pane.k-scrollable.k-widget.k-splitter {
        width: 100% !important;
        height: 100% !important;
        position: relative !important;
        top: 26px !important;
    }

    .chat-container #chatWindow {
        padding: 30px 0px 0px 30px;
    }

    .chat-window-container.k-pane.k-scrollable,
    #chatWindow {
        position: relative !important;
        width: 50vw !important;
        max-width: 50vw !important;
    }

    .chat-messagebar.k-pane {
        top: unset !important;
        bottom: 0 !important;
        position: relative !important;
        width: 100% !important;
        margin-top: 22px !important;
    }

    .GameMessageWindow .profileuser {
        font-size: 2.5em;
        line-height: 1.5em;
        margin: unset;
    }

    .game-result {
        border-radius: 5px
    }

    .chat-users.k-pane.k-scrollable {
        width: calc(50vw - 15px) !important;
        max-width: calc(50vw - 15px) !important;
        left: 50vw !important;
        margin: 0 !important;
        margin-right: 7px !important;
        height: calc(100% - 15px) !important;
    }

    #users {
        display: flex;
        width: 100%;
        flex-wrap: wrap
    }

    .userli {
        width: calc(100% / 4 - 10px);
        min-width: 220px;
        flex-grow: 1
    }

    .users-filter-div {
        position: relative;
        height: 26px;
    }

    .pm .chat-history {
        width: 100% !important;
        height: calc(100vh - 225px) !important;
        ;
    }

    .personal-message.tc {
        height: calc(100vh - 180px) !important;
    }
</style>`);



    let myCurrentUser = document.querySelector('#current-user');

    document.querySelector('#tray').appendChild(myCurrentUser);

    let logoutLink = document.querySelector('.bighonkinglogoutbutton a');

    logoutLink.classList.remove('button');

    logoutLink.id = 'logout-link';

    document.querySelector('#current-user .logout').appendChild(logoutLink);

    document.querySelector('.bighonkinglogoutbutton').remove();

    let infoHandle = document.querySelector('.info-handle');

    let usersFilterDiv = document.querySelector('#users-available-filter').closest('div');

    usersFilterDiv.classList.add('users-filter-div');

    document.querySelectorAll('.k-splitbar-vertical').forEach(i => i.remove());

    let modtWrapper = document.querySelector('.motdcont');

    setTimeout(function() {
        document.querySelectorAll('.motds li a').forEach(i => {
            if (i.innerText != 'Tungsten Membership 202' && i.innerText != '>>New Member Help<<' && i.innerText != '>>Rejoin Game<<' && i.innerText != '') {
                i.innerText = i.innerText.replaceAll('<', '');
                i.innerText = i.innerText.replaceAll('>', '');
                i.style = null;
                if (i.innerText === 'Cam Test') {
                    i.classList.add('cam-test-link');
                }
                modtWrapper.insertAdjacentHTML('beforeend', i.outerHTML);
            }
            i.remove()
        });
        document.querySelector('.motds').remove();
        let camTestLink = document.querySelector('.cam-test-link');

        if(camTestLink) {
            document.querySelector('#logout-link').insertAdjacentElement('beforebegin', camTestLink);
        }

        var whitespace = ' ';

        camTestLink.insertAdjacentText('afterend', whitespace);
    }, 1000);






})();

/* ---------- average on available message -------------- */
(function() {
  'use strict';

  let chatWrapper = document.querySelector('#chatWindow');
  let observerConfig = { attributes: false, childList: true, characterData: false };

  var availableObserver = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
          mutation.addedNodes.forEach(function(node){
              if(node.querySelector('.stausicon.available') !== null){
                  let msgTxt = node.querySelector('.mc-m');
                  let userName = msgTxt.textContent.split(' is available for games')[0];
                  let ownName = document.querySelector('div.currenuser-info p:first-child').textContent;
                  LoadUserList(ownName);
                  setTimeout(function(){
                  let userAvgElement = document.querySelector(`div.rMenu.userli[value="${userName}"] .fn`);
                      if(userAvgElement !== null) {
                          let avg = userAvgElement.textContent;
                          node.querySelector('.stausicon.available').insertAdjacentHTML('afterend', `<strong class="available-avg uwdal-clickable">(${avg})&nbsp;</strong>`);
                          node.querySelector('.mc-m').classList.add('uwdal-clickable');
                          node.querySelector('.stausicon.available').classList.add('uwdal-clickable');
                      }
                  }, 500);
              }
          })
      });
  });

  availableObserver.observe(chatWrapper, observerConfig);

})();

/* --------clickable available Messages --------- */
(function() {
  'use strict';

  document.addEventListener('click', function(e){
      if(e.target.matches('.mc-m') || e.target.matches('.stausicon.available') || e.target.matches('.available-avg')) {
          let msgWrapper = e.target.closest('.mc-l');
          if(msgWrapper.querySelector('.stausicon.available')) {
              let msgTxt = msgWrapper.querySelector('.mc-m');
              let userListElement = document.querySelector(`div.rMenu.userli[value="${msgTxt.textContent.split(' is available for games')[0]}"]`);
              if(userListElement !== null) {
                  userListElement.click();
              }
          }
      }
  })


})();


//shamelessly copied and slightly modified from "Ultimate Webcamdarts Lobby" written by Antoine Maingeot, many thanks to him for inspiring this user-script
/* --------- FOR Friends ---------*/

(function () { // anonymous function wrapper, used for error checking & limiting scope
  'use strict';

  if (window.self !== window.top) {
    return;
  } // end execution if in a frame

  // Adding Name to Friendlist
  function setUserPref(varName, defaultVal, menuText, promtText, sep) {
    GM_registerMenuCommand(menuText, function () {
      let val = prompt(promtText, GM_getValue(varName, defaultVal));
      if (val === null) {
        return;
      } // end execution if clicked CANCEL
      // prepare string of variables separated by the separator
      if (sep && val) {
        var pat1 = new RegExp('\\s*' + sep + '+\\s*', 'g'); // trim space/s around separator & trim repeated separator
        var pat2 = new RegExp('(?:^' + sep + '+|' + sep + '+$)', 'g'); // trim starting & trailing separator
        val = val.replace(pat1, sep).replace(pat2, '');
      }
      val = val.replace(/\s{2,}/g, ' ').trim(); // remove multiple spaces and trim
      GM_setValue(varName, val);
      // Apply changes (immediately if there are no existing highlights, or upon reload to clear the old ones)
      if (!document.body.querySelector(".THmo")) THmo_doHighlight(document.body);
      else location.reload();
    });
  }

  // prepare UserPrefs
  setUserPref(
    'keywordsfriends',
    'Name 1,Name 2,Name 3',
    'Set Friendlist',
    `Enter the usernames of your friends,
usernames must be seperated by a comma
    e.g.: Name 1,Name 2,Name 3`,
    ','
  );

  setUserPref(
    'highlightStyleFriends',
    'color: transparent; background-color: #ffebcd;',
    'Set Friendlist Style',
    'Set the Friendlist Style (use proper CSS)\r\Example color: www.color-hex.com\r\nExample:\r\ncolor: #f00; font-weight: bold; background-color: #ffe4b5;'
  );

  // Add MutationObserver to catch content added dynamically
  var THmo_MutOb = (window.MutationObserver) ? window.MutationObserver : window.WebKitMutationObserver;
  if (THmo_MutOb) {
    var THmo_chgMon = new THmo_MutOb(function (mutationSet) {
      mutationSet.forEach(function (mutation) {
        for (var i = 0; i < mutation.addedNodes.length; i++) {
          if (mutation.addedNodes[i].nodeType == 1) {
            THmo_doHighlight(mutation.addedNodes[i]);
          }
        }
      });
    });
    // attach chgMon to document.body
    var opts = {
      childList: true,
      subtree: true
    };
    THmo_chgMon.observe(document.body, opts);
  }
  // Main workhorse routine
  function THmo_doHighlight(el) {
    var keywordsfriends = GM_getValue('keywordsfriends');
    if (!keywordsfriends) {
      return;
    } // end execution if not found
    var highlightStyleFriends = GM_getValue('highlightStyleFriends');
    if (!highlightStyleFriends) {
        highlightStyleFriends = 'color: #fff; text-shadow: rgb(0, 159, 38) 2px 0px 0px, rgb(0, 159, 38) 1.75517px 0.958851px 0px, rgb(0, 159, 38) 1.0806px 1.68294px 0px, rgb(0, 159, 38) 0.141474px 1.99499px 0px, rgb(0, 159, 38) -0.832294px 1.81859px 0px, rgb(0, 159, 38) -1.60229px 1.19694px 0px, rgb(0, 159, 38) -1.97999px 0.28224px 0px, rgb(0, 159, 38) -1.87291px -0.701566px 0px, rgb(0, 159, 38) -1.30729px -1.51361px 0px, rgb(0, 159, 38) -0.421592px -1.95506px 0px, rgb(0, 159, 38) 0.567324px -1.91785px 0px, rgb(0, 159, 38) 1.41734px -1.41108px 0px, rgb(0, 159, 38) 1.92034px -0.558831px 0px;';
    }

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

    if (!snapElements.snapshotItem(0)) {
      return;
    } // end execution if not found

    for (var i = 0, len = snapElements.snapshotLength; i < len; i++) {
      var node = snapElements.snapshotItem(i);
      // check if it contains the keywords
      if (pat.test(node.nodeValue)) {
        // check that it isn't already highlighted
        if (node.className != "THmo" && node.parentNode.className != "THmo") {
          // create an element, replace the text node with an element
          var sp = span.cloneNode(true);
            sp.innerHTML = node.nodeValue.replace(pat, '<span title="Friendlist" style="' + highlightStyleFriends + '" class="THmo" data-thmo="friend">$1</span>');
          node.parentNode.replaceChild(sp, node);
        }
      }
    }


    document.querySelectorAll('.THmo[data-thmo="friend"]').forEach(i => {
      let userCard = i.closest('.rMenu');
      if(typeof userCard !== 'undefined' && userCard !== null) {
        userCard.classList.add('order-friends');
      }
    });
  }

  /* --------- FOR BLOCKLIST ---------*/

  // first run
  THmo_doHighlight(document.body);



  // setting User Preferences
  function setUserPref2(varName, defaultVal, menuText, promtText, sep) {
    GM_registerMenuCommand(menuText, function () {
      var val = prompt(promtText, GM_getValue(varName, defaultVal));
      if (val === null) {
        return;
      } // end execution if clicked CANCEL
      // prepare string of variables separated by the separator
      if (sep && val) {
        var pat1 = new RegExp('\\s*' + sep + '+\\s*', 'g'); // trim space/s around separator & trim repeated separator
        var pat2 = new RegExp('(?:^' + sep + '+|' + sep + '+$)', 'g'); // trim starting & trailing separator
        val = val.replace(pat1, sep).replace(pat2, '');
      }
      val = val.replace(/\s{2,}/g, ' ').trim(); // remove multiple spaces and trim
      GM_setValue(varName, val);
      // Apply changes (immediately if there are no existing highlights, or upon reload to clear the old ones)
      if (!document.body.querySelector(".THmo")) THmo_doHighlight2(document.body);
      else location.reload();
    });
  }

  // prepare UserPrefs
  setUserPref2(
    'keywordsblock',
    'Name 1,Name 2,Name 3',
    'Set Blocklist',
    'Set keywordsblock separated by comma\t\t\t\t\t\t\t\r\n\r\nExample:\r\nName 1,Name 2,Name 3',
    ','
  );

  setUserPref2(
    'highlightStyleBlock',
    'color: #FFF; background-color: #000;',
    'Set Blocklist Style',
    'Set the Blocklist Style (use proper CSS)\r\Example color: www.color-hex.com\r\nExample:\r\ncolor: #000; font-weight: bold; background-color: #FFF;'
  );


  // Add MutationObserver to catch content added dynamically
  var THmo_MutOb2 = (window.MutationObserver) ? window.MutationObserver : window.WebKitMutationObserver;
  if (THmo_MutOb2) {
    var THmo_chgMon2 = new THmo_MutOb2(function (mutationSet) {
      mutationSet.forEach(function (mutation) {
        for (var i = 0; i < mutation.addedNodes.length; i++) {
          if (mutation.addedNodes[i].nodeType == 1) {
            THmo_doHighlight2(mutation.addedNodes[i]);
          }
        }
      });
    });
    // attach chgMon to document.body
    var opts2 = {
      childList: true,
      subtree: true
    };
    THmo_chgMon2.observe(document.body, opts2);
  }
  // Main workhorse routine
  function THmo_doHighlight2(el) {
    var keywordsblock = GM_getValue('keywordsblock');
    if (!keywordsblock) {
      return;
    } // end execution if not found
    var highlightStyleBlock = GM_getValue('highlightStyleBlock');
    if (!highlightStyleBlock) {
        highlightStyleBlock = 'color: #999; text-shadow: rgb(187, 0, 0) 1px 0px 0px, rgb(187, 0, 0) 0.540302px 0.841471px 0px, rgb(187, 0, 0) -0.416147px 0.909297px 0px, rgb(187, 0, 0) -0.989993px 0.14112px 0px, rgb(187, 0, 0) -0.653644px -0.756803px 0px, rgb(187, 0, 0) 0.283662px -0.958924px 0px, rgb(187, 0, 0) 0.96017px -0.279416px 0px;'
    }

    var rQuantifiers = /[-\/\\^$*+?.()|[\]{}]/g;
    keywordsblock = "\\b" + keywordsblock.replace(/\,/g, "\\b|\\b", '\\$&').split(',').join('|') + "\\b";
    var pat = new RegExp('(' + keywordsblock + ')', 'gi');
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

    if (!snapElements.snapshotItem(0)) {
      return;
    } // end execution if not found

    for (var i = 0, len = snapElements.snapshotLength; i < len; i++) {
      var node = snapElements.snapshotItem(i);
      // check if it contains the keywords
      if (pat.test(node.nodeValue)) {
        // check that it isn't already highlighted
        if (node.className != "THmo" && node.parentNode.className != "THmo") {
          // create an element, replace the text node with an element
          var sp = span.cloneNode(true);
          sp.innerHTML = node.nodeValue.replace(pat, '<span title="Blocklist" style="' + highlightStyleBlock + '" class="THmo" data-thmo="block">$1</span>');
          node.parentNode.replaceChild(sp, node);
        }
      }
    }

    document.querySelectorAll('.THmo[data-thmo="block"]').forEach(i => {
      let userCard = i.closest('.rMenu');
      console.log(userCard);
      if(typeof userCard !== 'undefined' && userCard !== null) {
        userCard.classList.add('order-block');
      }
    });
  }


  // first run
  THmo_doHighlight2(document.body);
})(); // end of anonymous function

/* --------- FOR THIRD STYLE ---------*/

(function () { // anonymous function wrapper, used for error checking & limiting scope
  'use strict';

  if (window.self !== window.top) {
    return;
  } // end execution if in a frame

  // setting User Preferences
  function setUserPref3(varName, defaultVal, menuText, promtText, sep) {
    GM_registerMenuCommand(menuText, function () {
      var val = prompt(promtText, GM_getValue(varName, defaultVal));
      if (val === null) {
        return;
      } // end execution if clicked CANCEL
      // prepare string of variables separated by the separator
      if (sep && val) {
        var pat1 = new RegExp('\\s*' + sep + '+\\s*', 'g'); // trim space/s around separator & trim repeated separator
        var pat2 = new RegExp('(?:^' + sep + '+|' + sep + '+$)', 'g'); // trim starting & trailing separator
        val = val.replace(pat1, sep).replace(pat2, '');
      }
      val = val.replace(/\s{2,}/g, ' ').trim(); // remove multiple spaces and trim
      GM_setValue(varName, val);
      // Apply changes (immediately if there are no existing highlights, or upon reload to clear the old ones)
      if (!document.body.querySelector(".THmo")) THmo_doHighlight3(document.body);
      else location.reload();
    });
  }

  // prepare UserPrefs
  setUserPref3(
    'keywords3',
    'word 1,word 2,word 3',
    'Set Extra Highlight List',
    'Set keywords separated by comma\t\t\t\t\t\t\t\r\n\r\nExample:\r\nword 1,word 2,word 3',
    ','
  );

  setUserPref3(
    'highlightStyle3',
    'color: #f00; background-color: #ffebcd;',
    'Set Extra Highlight Style',
    'Set the Highlight Style (use proper CSS)\r\Example color: www.color-hex.com\r\nExample:\r\ncolor: #f01466; font-weight: bold; background-color: #dedede;'
  );


  // Add MutationObserver to catch content added dynamically
  var THmo_MutOb3 = (window.MutationObserver) ? window.MutationObserver : window.WebKitMutationObserver;
  if (THmo_MutOb3) {
    var THmo_chgMon3 = new THmo_MutOb3(function (mutationSet) {
      mutationSet.forEach(function (mutation) {
        for (var i = 0; i < mutation.addedNodes.length; i++) {
          if (mutation.addedNodes[i].nodeType == 1) {
            THmo_doHighlight3(mutation.addedNodes[i]);
          }
        }
      });
    });
    // attach chgMon to document.body
    var opts3 = {
      childList: true,
      subtree: true
    };
    THmo_chgMon3.observe(document.body, opts3);
  }
  // Main workhorse routine
  function THmo_doHighlight3(el) {
    var keywords3 = GM_getValue('keywords3');
    if (!keywords3) {
      return;
    } // end execution if not found
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

    if (!snapElements.snapshotItem(0)) {
      return;
    } // end execution if not found

    for (var i = 0, len = snapElements.snapshotLength; i < len; i++) {
      var node = snapElements.snapshotItem(i);
      // check if it contains the keywords
      if (pat.test(node.nodeValue)) {
        // check that it isn't already highlighted
        if (node.className != "THmo" && node.parentNode.className != "THmo") {
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