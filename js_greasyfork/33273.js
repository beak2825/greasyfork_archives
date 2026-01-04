// ==UserScript==
// @name         YouTube: Subscriptions Watch Later
// @namespace    https://github.com/ackoujens
// @version      1.2
// @description  Adds unwatched videos from your YouTube subscriptions page to the "Watch later" playlist
// @author       Jens Ackou
// @grant        GM_addStyle
// @include      http://*.youtube.com/*
// @include      http://youtube.com/*
// @include      https://*.youtube.com/*
// @include      https://youtube.com/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/33273/YouTube%3A%20Subscriptions%20Watch%20Later.user.js
// @updateURL https://update.greasyfork.org/scripts/33273/YouTube%3A%20Subscriptions%20Watch%20Later.meta.js
// ==/UserScript==

// To submit bugs or submit revisions please see visit the repository at:
// https://github.com/ackoujens/youtube-subcriptions-watch-later
// You can open new issues at:
// https://github.com/ackoujens/youtube-subcriptions-watch-later/issues

// I highly recommend using the "YouTube: Hide Watched Videos" script
// created by Evguani Naverniouk. This is a flow that I use and find very useful.
// This script also helped me getting an idea of how to add a button to the YouTube AI.
// Probably the reason why I chose to make it look like the icons are part of eachother.

(function(undefined) {
  // Enable for debugging
  var __DEV__ = true;

  // Set defaults
  localStorage.YTSP = localStorage.YTSP || 'false';

  GM_addStyle(`
.YT-SP-BUTTON {
    background: transparent;
    border: 0;
    color: #888888;
    cursor: pointer;
    height: 40px;
    outline: 0;
    margin-right: 8px;
    padding: 0 8px;
    width: 40px;
}

.YT-SP-BUTTON svg {
    margin-top: 8px;
    height: 34px;
    width: 34px;
}

.YT-SP-BUTTON:focus,
.YT-SP-BUTTON:hover {
    color: #FFF;
}

.YT-SP-MENU {
    background: #F8F8F8;
    border: 1px solid #D3D3D3;
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.05);
    display: none;
    font-size: 12px;
    margin-top: -1px;
    padding: 10px;
    position: absolute;
    right: 0;
    text-align: center;
    top: 100%;
    white-space: normal;
    z-index: 9999;
}

.YT-SP-MENU-ON { display: block; }
.YT-SP-MENUBUTTON-ON span { transform: rotate(180deg) }
`);

  var counter = 0;
  var watched = 0;
  var unwatched = 0;
  var watchlaterIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><g fill="currentColor"><path d="M32 4h-4v-4h-4v4h-4v4h4v4h4v-4h4z"></path><path d="M26.996 13.938c0.576 0.64 1.1 1.329 1.563 2.062-1.197 1.891-2.79 3.498-4.67 4.697-2.362 1.507-5.090 2.303-7.889 2.303s-5.527-0.796-7.889-2.303c-1.88-1.199-3.473-2.805-4.67-4.697 1.197-1.891 2.79-3.498 4.67-4.697 0.122-0.078 0.246-0.154 0.371-0.228-0.311 0.854-0.482 1.776-0.482 2.737 0 4.418 3.582 8 8 8s8-3.582 8-8c0-0.022-0.001-0.043-0.001-0.065-3.415-0.879-5.947-3.957-5.998-7.635-0.657-0.074-1.325-0.113-2.001-0.113-6.979 0-13.028 4.064-16 10 2.972 5.936 9.021 10 16 10s13.027-4.064 16-10c-0.551-1.101-1.209-2.137-1.958-3.095-0.915 0.537-1.946 0.897-3.046 1.034zM13 10c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3z"></path></g></svg>';


  // ===========================================================
  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  var debounce = function(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this,
        args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };

  // ===========================================================
  // Button will be injected into the main header menu
  var findButtonTarget = function() {
    return $('#container #end #buttons');
  };

  // ===========================================================
  // Check if button is already present
  var isButtonAlreadyThere = function() {
    return $('.YT-SP-BUTTON').length > 0;
  };

  // ===========================================================
  // Pausing the script in milliseconds
  function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds) {
        break;
      }
    }
  }

  // ===========================================================
  // Add button to page
  var addButton = function() {
    if (isButtonAlreadyThere()) return;

    // Find button target
    var target = findButtonTarget();
    if (!target) return;

    // Generate button DOM
    //var icon = localStorage.SP === 'true' ? visibilityIcon : visibilityOffIcon;
    var icon = localStorage.YTSP = watchlaterIcon;
    var button = $('<button class="YT-SP-BUTTON" title="Add Videos to Watch Later">' + icon + '</button>');

    // Attach button event
    button.on("click", function() {

      var allItems = $('ytd-thumbnail-overlay-toggle-button-renderer').not('[aria-label="Added"]');

      for (i = 0; i < allItems.length; i++) {
        if (!$(allItems[i]).parent().find('ytd-thumbnail-overlay-resume-playback-renderer').length) {
          $(allItems[i]).click();
          // Executing this too fast seems to drop videos being added
          sleep(100);
        }
      }
    });

    // Insert button into DOM
    target.prepend(button);
  };

  var run = debounce(function() {
    if (__DEV__) console.log('[YT-SP] Running check for subcription videos');
    addButton();
  }, 500);

  // ===========================================================

  // Hijack all XHR calls
  var send = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function(data) {
    this.addEventListener("readystatechange", function() {
      if (
        // Anytime more videos are fetched -- re-run script
        this.responseURL.indexOf('browse_ajax?action_continuation') > 0
      ) {
        setTimeout(function() {
          run();
        }, 0);
      }
    }, false);
    send.call(this, data);
  };

  // ===========================================================

  var observeDOM = (function() {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var eventListenerSupported = window.addEventListener;

    return function(obj, callback) {
      if (__DEV__) console.log('[YT-SP] Attaching DOM listener');

      // Invalid `obj` given
      if (!obj) return;

      if (MutationObserver) {
        var obs = new MutationObserver(function(mutations, observer) {
          if (mutations[0].addedNodes.length || mutations[0].removedNodes.length) {
            callback(mutations);
          }
        });

        obs.observe(obj, {
          childList: true,
          subtree: true
        });
      } else if (eventListenerSupported) {
        obj.addEventListener('DOMNodeInserted', callback, false);
        obj.addEventListener('DOMNodeRemoved', callback, false);
      }
    };
  })();

  // ===========================================================

  if (__DEV__) console.log('[YT-SP] Starting Script');

  // YouTube does navigation via history and also does a bunch
  // of AJAX video loading. In order to ensure we're always up
  // to date, we have to listen for ANY DOM change event, and
  // re-run our script.
  observeDOM(document.body, run);

  run();
})();
