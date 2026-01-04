// ==UserScript==
// @name         JableBlock
// @namespace    http://tampermonkey.net/
// @version      1.17
// @description  This script removes unfriendly comments on jable.tv. 移除 jable.tv 不友善的留言及關鍵字。
// @author       oldhunter
// @match        https://jable.tv/videos/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jable.tv
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445387/JableBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/445387/JableBlock.meta.js
// ==/UserScript==

(function() {
  'use strict';

  /* https://gist.github.com/raw/2625891/waitForKeyElements.js */

  /*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
     that detects and handles AJAXed content.

     Usage example:

     waitForKeyElements (
     "div.comments"
     , commentCallbackFunction
     );

     //--- Page-specific function to do what we want when the node is found.
     function commentCallbackFunction (jNode) {
     jNode.text ("This comment changed by waitForKeyElements().");
     }

     IMPORTANT: This function requires your script to have loaded jQuery.
   */
  function waitForKeyElements (
    selectorTxt,    /* Required: The jQuery selector string that
                       specifies the desired element(s).
                     */
    actionFunction, /* Required: The code to run when elements are
                       found. It is passed a jNode to the matched
                       element.
                     */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                       new elements even after the first match is
                       found.
                     */
    iframeSelector  /* Optional: If set, identifies the iframe to
                       search.
                     */
  ) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
      targetNodes     = $(selectorTxt);
    else
      targetNodes     = $(iframeSelector).contents ()
                                         .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
      btargetsFound   = true;
      /*--- Found target node(s).  Go through each and act if they
         are new.
       */
      targetNodes.each ( function () {
        var jThis        = $(this);
        var alreadyFound = jThis.data ('alreadyFound')  ||  false;

        if (!alreadyFound) {
          //--- Call the payload function.
          var cancelFound     = actionFunction (jThis);
          if (cancelFound)
            btargetsFound   = false;
          else
            jThis.data ('alreadyFound', true);
        }
      } );
    }
    else {
      btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
      //--- The only condition where we need to clear the timer.
      clearInterval (timeControl);
      delete controlObj [controlKey]
    }
    else {
      //--- Set a timer, if needed.
      if ( ! timeControl) {
        timeControl = setInterval ( function () {
          waitForKeyElements (    selectorTxt,
                                  actionFunction,
                                  bWaitOnce,
                                  iframeSelector
          );
        },
                                    300
        );
        controlObj [controlKey] = timeControl;
      }
    }
    waitForKeyElements.controlObj   = controlObj;
  }


  /* My code here */

  let blocklist = [
    'XXXXOOOO', 'XXXXOOOO　', 'jostar2', 'GG_ininder', 'ХХХХОООО',
    'xxxxටටටට', '口口口口ＸＸＸＸ', 'ooooxxxx'
  ];
  let blockedIDs = ['445965', '385216', '399011', '477129', '465205', '508122', '102345'];
  let keywords = ['XO', 'xo', '不要尻', '再尻', '再打手槍', '在尻', '別尻', '別再尻', '别撸', '别再撸', '不要撸', '别再撸'];

  function filter() {
    console.log('start filter');
    let items = document.querySelectorAll('.item');
    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      if (item == null) {
        continue;
      }

      let blocked = false;
      let author = item.querySelector('a');
      let title = '';
      let url = '';
      let userID = '';

      if (author) {
        title = author.getAttribute('title');
        url = author.getAttribute('href');
        let pat = /members\/(\d+)/;
        let m = url.match(pat);
        if (m != null) {
          userID = m[1];
        }
      }
      let contentElem = item.querySelector('.original-text');

      if (contentElem) {
        let content = contentElem.textContent;
        for (let j = 0; j < keywords.length; j++) {
          if (title.includes(keywords[j]) || content.includes(keywords[j])) {
            item.style.display = 'none';
            blocked = true;
            break;
          }
        }
      }

      if (blocked) {
        continue;
      }

      for (let j = 0; j < blocklist.length; j++) {
        if (title.includes(blocklist[j])) {
          item.style.display = 'none';
          blocked = true;
          break;
        }
      }

      if (blocked) {
        continue;
      }

      for (let j = 0; j < blockedIDs.length; j++) {
        if (userID == blockedIDs[j]) {
          item.style.display = 'none';
          blocked = true;
          break;
        }
      }
    }
  }

  waitForKeyElements('.item', filter);
})();
