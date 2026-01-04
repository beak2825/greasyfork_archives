// ==UserScript==
// @name         Don't fuck with my scroll!!!
// @namespace    http://github.com/YePpHa
// @version      1.1
// @description  Whenever the user scrolls using the mouse wheel it will disable all methods to programmatically scroll for 500 ms (0.5 seconds). Basically preventing websites to implement custom scrolling behaviors like smooth scrolling.
// @author       Jeppe Rune Mortensen <jepperm@gmail.com>
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/381674/Don%27t%20fuck%20with%20my%20scroll%21%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/381674/Don%27t%20fuck%20with%20my%20scroll%21%21%21.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var inject = function() {
    // Change this value to decide how long it would take before restoring the
    // default scrolling methods.
    var timeout = 1000; // in milliseconds (there's 1000 ms in a second)

    // Prevent websites from cancelling the default action of the scroll wheel.
    WheelEvent.prototype.preventDefault = function() {};

    function init() {
      function enableScrolling() {
        window.scrollBy = _scrollBy;
        window.scrollTo = _scrollTo;
        Object.defineProperty(scrollingElement, "scrollTop", {
          configurable: true,
          enumerable: false,
          get: _scrollTopGetter,
          set: _scrollTopSetter
        });
      }

      function disableScrolling() {
        window.scrollBy = _void;
        window.scrollTo = _void;
        Object.defineProperty(scrollingElement, "scrollTop", {
          configurable: true,
          enumerable: false,
          get: _scrollTopGetter,
          set: _void
        });
      }

      function scrollHandler() {
        disableScrolling();

        // Restore normal scrolling functionality after a certain delay. If the
        // user is still scrolling after we set the delay. Delete our delay and
        // start a new one instead. This is to only allow the scrolling to be
        // enabled after the user has stopped scrolling for x amount of time.
        clearTimeout(timer);
        timer = setTimeout(enableScrolling, timeout);
      }

      // Keep a reference of the scrolling element as we will change the
      // `scrollTop` definition on it whenever the user scrolls.
      var scrollingElement = document.scrollingElement;

      // Keep a list of all the original functions that we will replace
      // temporarily.
      var _scrollBy = window.scrollBy;
      var _scrollTo = window.scrollTo;
      var _scrollTopGetter = scrollingElement.__lookupGetter__("scrollTop");
      var _scrollTopSetter = scrollingElement.__lookupSetter__("scrollTop");

      // Let's also define our void function as we really don't need to create a
      // new one every single time.
      var _void = function() {};
      
      var timer;

      // Make sure that we're doing this synchronous (not passive) and as soon
      // as possible (in the capture phase) as we actually need to make sure
      // that we do our stuff first before websites can touch the scrolling.
      scrollingElement.addEventListener("wheel", scrollHandler, {
        passive: false,
        capture: true
      });
      window.addEventListener("wheel", scrollHandler, {
        passive: false,
        capture: true
      });
      scrollingElement.addEventListener("mousewheel", scrollHandler, {
        passive: false,
        capture: true
      });
      window.addEventListener("mousewheel", scrollHandler, {
        passive: false,
        capture: true
      });
    }

    function isReady() {
      // We could probably do this a lot sooner, but for now let's try to do it
      // after the DOM has loaded and accessible.
      return document.readyState === "complete"
        || document.readyState === "interactive";
    }

    function handleReadyStateChange() {
      if (isReady()) {
        document.removeEventListener("readystatechange", handleReadyStateChange, false);
        init();
      }
    }
    
    
    // Are we ready to actually add the scroll/wheel event listeners to the main
    // scrolling element? If not, wait for it to be ready by listening for the
    // `readystatechange` event.
    if (isReady()) {
      init();
    } else {
      document.addEventListener("readystatechange", handleReadyStateChange, false);
    }
  };

  // We want to execute our code in the page context as we actually need to
  // modify properties that the website is accessing.
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.appendChild(document.createTextNode('(' + inject.toString() + ')();'));

  var scriptParent = document.body || document.head || document.documentElement;
  scriptParent.appendChild(script);
})();