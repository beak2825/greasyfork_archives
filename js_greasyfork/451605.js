// ==UserScript==
// @name        Clip all coupons at wegmans.com
// @namespace   https://github.com/jrib/userscripts/
// @match       https://shop.wegmans.com/shop/coupons
// @grant       none
// @version     1.0
// @author      jrib
// @description 9/12/2022, 6:07:45 PM
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/451605/Clip%20all%20coupons%20at%20wegmanscom.user.js
// @updateURL https://update.greasyfork.org/scripts/451605/Clip%20all%20coupons%20at%20wegmanscom.meta.js
// ==/UserScript==

(function() {
  // https://gist.githubusercontent.com/jrib/22d6dc3c55b768910bc5bb4e6d2ddf2f/raw/debc0e6d4d537ac228d1d71f44b1162979a5278c/waitForKeyElements.js
  // inlined due to greasyfork @require restriction
  function waitForKeyElements (
      selectorTxt,    /* Required: The selector string that
                          specifies the desired element(s).
                      */
      actionFunction, /* Required: The code to run when elements are
                          found. It is passed a jNode to the matched
                          element.
                      */
      bWaitOnce      /* Optional: If false, will continue to scan for
                          new elements even after the first match is
                          found.
                      */
  ) {
      var targetNodes, btargetsFound;
      targetNodes = document.querySelectorAll(selectorTxt);

      if (targetNodes  &&  targetNodes.length > 0) {
          btargetsFound = true;
          /*--- Found target node(s).  Go through each and act if they
              are new.
          */
          targetNodes.forEach(function(element) {
              var alreadyFound = element.dataset.found == 'alreadyFound' ? 'alreadyFound' : false;

              if (!alreadyFound) {
                  //--- Call the payload function.
                  var cancelFound     = actionFunction (element);
                  if (cancelFound)
                      btargetsFound   = false;
                  else
                      element.dataset.found = 'alreadyFound';
              }
          } );
      }
      else {
          btargetsFound = false;
      }

      //--- Get the timer-control variable for this selector.
      var controlObj  = waitForKeyElements.controlObj  ||  {};
      var controlKey  = selectorTxt.replace (/[^\w]/g, "_");
      var timeControl = controlObj [controlKey];

      //--- Now set or clear the timer as appropriate.
      if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
          //--- The only condition where we need to clear the timer.
          clearInterval (timeControl);
          delete controlObj [controlKey];
      }
      else {
          //--- Set a timer, if needed.
          if ( ! timeControl) {
              timeControl = setInterval ( function () {
                      waitForKeyElements (    selectorTxt,
                                              actionFunction,
                                              bWaitOnce
                                          );
                  },
                  300
              );
              controlObj [controlKey] = timeControl;
          }
      }
      waitForKeyElements.controlObj   = controlObj;
  }

  // https://github.com/greasemonkey/gm4-polyfill/blob/master/gm4-polyfill.js#L33
  function addCss(aCss) {
    let head = document.getElementsByTagName('head')[0];
    if (head) {
      let style = document.createElement('style');
      style.setAttribute('type', 'text/css');
      style.textContent = aCss;
      head.appendChild(style);
      return style;
    }
  }

  function clipAll() {
    for (const clipButton of document.querySelectorAll('.coupon button')) {
      clipButton.click();
    }
  }

  function drawButton() {
    // button style from https://github.com/andybrewer/mvp
    css = '.clipAllButton {' +
            'background-color: #4DA4EA;' +
            'border: 2px solid #4DA4EA;' +
            'color: #FFF;' +
            'border-radius: 5px;' +
            'display: inline-block;' +
            'font-size: medium;' +
            'font-weight: bold;' +
            'line-height: 1.5;' +
            'margin: 0 0.5rem;' +
            'padding: 1rem 2rem;' +
          '}' +
          '.clipAllButton:hover { cursor: pointer; filter: brightness(1.2); }';
    addCss(css);

    var container = document.getElementsByClassName('cell-container')[0];
    var button = document.createElement('div');
    button.className = 'clipAllButton';
    button.innerHTML = 'Clip all';
    button.onclick = clipAll;
    container.prepend(button);
  }

  waitForKeyElements('.cell-container', drawButton, true);
})()
