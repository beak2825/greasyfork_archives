/* eslint-disable  userscripts/use-download-and-update-url */
/* -eslint-disable  userscripts/better-use-match  --  Is this a thing? */
// ==UserScript==
// @name         YouTube arrow keys FIX
// @version      2.0.0
// @description  Fix YouTube keyboard controls (arrow keys) to be more consistent (Left,Right - jump, Up,Down - volume) after page load or clicking individual controls.
// @author       Calcifer
// @license      MIT
// @namespace    https://github.com/Calciferz
// @homepageURL  https://github.com/Calciferz/YoutubeKeysFix
// @supportURL   https://github.com/Calciferz/YoutubeKeysFix/issues
// @icon         http://youtube.com/yts/img/favicon_32-vflOogEID.png
// @match        https://*.youtube.com/*
// @match        https://youtube.googleapis.com/embed*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38643/YouTube%20arrow%20keys%20FIX.user.js
// @updateURL https://update.greasyfork.org/scripts/38643/YouTube%20arrow%20keys%20FIX.meta.js
// ==/UserScript==

/* eslint-disable  no-multi-spaces */
/* eslint-disable  no-multi-str */


(function () {
    'use strict';

    var playerContainer;  // = document.getElementById('player-container') || document.getElementById('player') in embeds
    var playerElem;  // = document.getElementById('movie_player')
    var playerObserver;
    var isEmbeddedUI;
    var subtitleObserver;
    var subtitleContainer;

    var lastFocusedPageArea;
    var areaOrder= [ null ],
        areaContainers= [ null ],
        areaFocusDefault= [ null ],
        areaFocusedSubelement= [ null ];



    function formatElemIdOrClass(elem) {
      return   elem.id ?  '#' + elem.id
      : elem.className ?  '.' + elem.className.replace(' ', '.')
      : elem.tagName;
    }

    function formatElemIdOrTag(elem) {
      return   elem.id ?  '#' + elem.id
      : elem.tagName;
    }

    function isElementWithin(elementWithin, ancestor) {
        if (! ancestor)  return null;
        for (; elementWithin; elementWithin= elementWithin.parentElement) {
            if (elementWithin === ancestor)  return true;
        }
        return false;
    }

    function getAreaOf(elementWithin) {
        for (var i= 1; i<areaContainers.length; i++) {
          if (isElementWithin(elementWithin, areaContainers[i]))  return i;
        }
        return 0;
    }
    function getFocusedArea() { return getAreaOf(document.activeElement); }

    // Source: jquery
    function isVisible(elem) {
        return !elem ? null : !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
    }

    function tryFocus(newFocus) {
        if (!newFocus)  return null;
        if (!isVisible(newFocus))  return false;
        //var oldFocus= document.activeElement;
        newFocus.focus();
        var done= (newFocus === document.activeElement);
        if (! done)  console.error("[YoutubeKeysFix]  tryFocus():  Failed to focus newFocus=", [newFocus], "activeElement=", [document.activeElement]);
        return done;
    }

    function focusNextArea() {
        // Focus next area's areaFocusedSubelement (activeElement)
        var currentArea= getFocusedArea() || 0;
        var nextArea= (lastFocusedPageArea && lastFocusedPageArea !== currentArea) ? lastFocusedPageArea : currentArea + 1;
        // captureFocus() will store lastFocusedPageArea again if moving to a non-player area
        // if moving to the player then lastFocusedPageArea resets, Shift-Esc will move to search bar (area 2)
        lastFocusedPageArea= null;
        // To enter player after last area: nextArea= 1;  To skip player: nextArea= 2;
        if (nextArea >= areaContainers.length)  nextArea= 2;

        let done = false;
        do {
          done= tryFocus( areaFocusedSubelement[nextArea] );
          if (! done)  done= tryFocus( document.querySelector( areaFocusDefault[nextArea] ) );
          //if (! done)  done= tryFocus( areaContainers[nextArea] );
          if (! done)  nextArea++;
        } while (!done && nextArea < areaContainers.length);
        return done;
    }


    function redirectEventTo(target, event, cloneEvent) {
        if (!isVisible(target))  return;
        cloneEvent= cloneEvent || new Event(event.type);
        // shallow copy every property
        for (var k in event)  if (! (k in cloneEvent))  cloneEvent[k]= event[k];
        cloneEvent.originalEvent= event;

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        try { console.log("[YoutubeKeysFix]  redirectEventTo():  type=" + cloneEvent.type, "key='" + cloneEvent.key + "' to=" + formatElemIdOrTag(target), "from=", [event.target, event, cloneEvent]); }
        catch (err)  { console.error("[YoutubeKeysFix]  redirectEventTo():  Error while logging=", err); }

        target.dispatchEvent(cloneEvent);
    }


    function handleShiftEsc(event) {
        // Shift-Esc only implemented for watch page
        if (window.location.pathname !== "/watch")  return;
        // Not in fullscreen
        if (getFullscreen())  return;
        // Bring focus to next area
        focusNextArea();
        event.preventDefault();
        event.stopPropagation();
    }


    // Tag list from YouTube Plus: https://github.com/ParticleCore/Particle/blob/master/src/Userscript/YouTubePlus.user.js#L885
    var keyHandlingElements= { INPUT:1, TEXTAREA:1, IFRAME:1, OBJECT:1, EMBED:1 };

    function onKeydown(event) {
        // Debug log of key event
        //if (event.key != 'Shift')  console.log("[YoutubeKeysFix]  onKeydown():  type=" + event.type, "key='" + event.key + "' target=", [event.target, event]);

        let keyCode = event.which;

        // Ignore redirected events to avoid recursion
        if (event.originalEvent)  return;

        let redirect = false;
        let inTextbox= keyHandlingElements[event.target.tagName]  ||  event.target.isContentEditable;  //||  event.target.getAttribute('role') == 'textbox';
        // event.target is the focused element that received the keypress

        // Space -> pause video except when writing a comment - Youtube takes care of this
        //if (keyCode == 32)  redirect = !inTextbox;
        //if (keyCode == 32)  return redirectEventTo(document.body, event);

        // Left,Right -> jump 5sec - Youtube takes care of this
        //if (keyCode == 37 || keyCode == 39)  redirect = !inTextbox;

        // End,Home,Up,Down -> control the player if page is scrolled to the top, otherwise scroll the page
        if (keyCode == 35 || keyCode == 36 || keyCode == 38 || keyCode == 40) {
          redirect = !inTextbox && 0 == document.documentElement.scrollTop;
        }

        // Debug log of redirect
        //if (redirect)  console.log("[YoutubeKeysFix]  onKeydown():  redirect, type=" + event.type, "key='" + event.key + "' target=", [event.target, event]);
        if (redirect) {
          return redirectEventTo(playerElem, event);
        }
    }


    function captureKeydown(event) {
        // Debug log of key event
        //if (event.key != 'Shift')  console.log("[YoutubeKeysFix]  captureKeydown():  type=" + event.type, "key='" + event.key + "' target=", [event.target, event]);

        let keyCode = event.which;

        // Shift-Esc -> cycle through search box, videos, comments
        // Event is not received when fullscreen in Opera (already handled by browser)
        if (keyCode == 27 && event.shiftKey) {
          return handleShiftEsc(event);
        }

        // Ignore redirected events to avoid recursion
        if (event.originalEvent) {
          return;
        }

        // Only capture events within player
        if (!isElementWithin(event.target, playerElem))  return;

        // End,Home,Up,Down -> scroll the page if not scrolled to the top
        if (keyCode == 35 || keyCode == 36 || keyCode == 38 || keyCode == 40) {
          if (0 < document.documentElement.scrollTop)  return redirectEventTo(document.body, event);
        }

        // Sliders' key handling behaviour is inconsistent with the default player behaviour
        // Redirect arrow keys (33-40: PageUp,PageDown,End,Home,Left,Up,Right,Down) to page scroll/video player (position/volume)
        if (33 <= keyCode && keyCode <= 40 && event.target !== playerElem && event.target.getAttribute('role') == 'slider') {
          return redirectEventTo(playerElem, event);
        }
    }


    function captureMouse(event) {
        // Called when mouse button is pressed/released over an element.
        // Debug log of mouse button event
        //console.log("[YoutubeKeysFix]  captureMouse():  type=" + event.type, "button=" + event.button, "target=", [event.target, event]);
    }


    function onMouse(event) {
        // Called when mouse button is pressed over an element.
        // Debug log of mouse button event
        //console.log("[YoutubeKeysFix]  onMouse():  type=" + event.type, "button=" + event.button, "target=", [event.target, event]);
    }

    function onWheel(event) {
        //console.log("[YoutubeKeysFix]  onWheel():  deltaY=" + Math.round(event.deltaY), "phase=" + event.eventPhase, "target=", [event.currentTarget, event]);
        if (! playerElem || ! playerElem.contains(event.target))  return;

        var deltaY= null !== event.deltaY ? event.deltaY : event.wheelDeltaY;
        var up= deltaY <= 0;    // null == 0 -> up
        var cloneEvent= new Event('keydown');
        cloneEvent.which= cloneEvent.keyCode= up ? 38 : 40;
        cloneEvent.key= up ? 'ArrowUp': 'ArrowDown';
        redirectEventTo(playerElem, event, cloneEvent);
    }

    function getFullscreen() {
        return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
    }

    function onFullscreen(event) {
        var fullscreen= getFullscreen();
        if (fullscreen) {
            if ( !fullscreen.contains(document.activeElement) ) {
                onFullscreen.prevFocus= document.activeElement;
                fullscreen.focus();
            }
        } else if (onFullscreen.prevFocus) {
            onFullscreen.prevFocus.focus();
            onFullscreen.prevFocus= null;
        }
    }

    function captureFocus(event) {
        // Called when an element gets focus (by clicking or TAB)
        // Debug log of focused element
        //console.log("[YoutubeKeysFix]  captureFocus():  target=", [event.target, event]);

        // Window will focus the activeElement, do nothing at the moment
        if (event.target === window)  return;

        // Save focused element inside player or on page
        var area= getAreaOf(event.target);
        if (0 !== area) {
            areaFocusedSubelement[area]= event.target;
            //if (areaContainers[area])  areaContainers[area].activeElement= event.target;
            // store if not focusing player area
            if (area !== 1)  lastFocusedPageArea= area;
        }
    }



    function initEvents() {
        // Handlers are capture type to see all events before they are consumed
        document.addEventListener('mousedown', captureMouse, true);
        //document.addEventListener('mouseup', captureMouse, true);

        // captureFocus captures focus changes before the event is handled
        // does not capture body.focus() in Opera, material design
        document.addEventListener('focus', captureFocus, true);
        //window.addEventListener('focusin', captureFocus);

        document.addEventListener('mousedown', onMouse);
        // mousewheel over player area adjusts volume
        // Passive event handler can call preventDefault() on wheel events to prevent scrolling the page
        //document.addEventListener('wheel', onWheel, { passive: false, capture: true });

        // captureKeydown is run before original handlers to capture key presses before the player does
        document.addEventListener('keydown', captureKeydown, true);
        // onKeydown handles Tab,End,Home,Up,Down in the bubbling phase after other elements (textbox, button, link) got a chance.
        document.addEventListener('keydown', onKeydown);

        if (document.onfullscreenchange !== undefined)  document.addEventListener('fullscreenchange', onFullscreen);
        else if (document.onwebkitfullscreenchange !== undefined)  document.addEventListener('webkitfullscreenchange', onFullscreen);
        else if (document.onmozfullscreenchange !== undefined)  document.addEventListener('mozfullscreenchange', onFullscreen);
        else if (document.MSFullscreenChange !== undefined)  document.addEventListener('MSFullscreenChange', onFullscreen);
    }


    function initStyle() {
        let s= document.createElement('style');
        s.name= 'YoutubeKeysFix-styles';
        s.type= 'text/css';
        s.textContent= `

/* Highlight focused button in player */
.ytp-probably-keyboard-focus :focus {
  background-color: rgba(120, 180, 255, 0.6);
}

/* Hide the obstructive video suggestions in the embedded player when paused */
.ytp-pause-overlay-container {
  display: none;
}

        `;
        document.head.appendChild(s);
    }


    function initDom() {

        // Area names
        areaOrder= [
            null,
            //'player',
            'header',
            'comments',
            'videos',
        ];

        // Areas' root elements
        areaContainers= [
            null,
            //document.getElementById('player-container'),  // player
            document.getElementById('masthead-container'),  // header
            document.getElementById('sections'),  // comments
            document.getElementById('related'),   // videos
        ];

        // Areas' default element to focus
        areaFocusDefault= [
            null,
            //'#movie_player',         // player
            '#masthead input#search',  // header
            '#info #menu #top-level-buttons button:last()',  // comments
            '#items a.ytd-compact-video-renderer:first()',   // videos
        ];
    }


    function observePlayer() {
        // The movie player frame #movie_player is not part of the initial page load.
        playerElem= document.getElementById('movie_player');
        if (playerElem)  return initPlayer();

        // Player elem observer setup
        playerObserver = new MutationObserver( mutationHandler );
        playerObserver.observe(document.body, { childList: true, subtree: true });

        function mutationHandler(mutations, observer) {
            playerElem= document.getElementById('movie_player');
            if (!playerElem)  return;

            console.log("[YoutubeKeysFix]  mutationHandler():  #movie_player created, stopped observing body", [playerElem]);
            // Stop playerObserver
            observer.disconnect();

            initPlayer();
        }
    }

    function initPlayer() {
        // Path (on page load):  body  >  ytd-app
        // Path (DOMContentLoaded):  >  div#content  >  ytd-page-manager#page-manager
        // Path (created 1st step):  >  ytd-watch-flexy.ytd-page-manager  >  div#full-bleed-container  >  div#player-full-bleed-container
        // Path (created 2nd step):  >  div#player-container  >  ytd-player#ytd-player  >  div#container  >  div#movie_player.html5-video-player  >  html5-video-container
        // Path (created 3rd step):  >  video.html5-main-video

        isEmbeddedUI= playerElem.classList.contains('ytp-embed');

        playerContainer= document.getElementById('player-container')  // full-bleed-container > player-full-bleed-container > player-container > ytd-player > container > movie_player
          || isEmbeddedUI && document.getElementById('player');  // body > player > movie_player.ytp-embed

        console.log("[YoutubeKeysFix]  initPlayer():  player=", [playerElem]);

        removeTabStops();
    }

    // Disable focusing certain player controls: volume slider, progress bar, fine seeking bar, subtitle.
    // It was possible to focus these using TAB, but the controls (space, arrow keys)
    // change in a confusing manner, creating a miserable UX.
    // Maybe this is done for accessibility reasons? The irony...
    // Youtube should have rethought this design for a decade now.
    function removeTabStops() {
        //console.log("[YoutubeKeysFix]  removeTabStops()");

        function removeTabIndexWithSelector(rootElement, selector) {
            for (let elem of rootElement.querySelectorAll(selector)) {
                console.log("[YoutubeKeysFix]  removeTabIndexWithSelector():", "tabindex=", elem.getAttribute('tabindex'), [elem]);
                elem.removeAttribute('tabindex');
            }
        }

        // Remove tab stops from video player
        //playerElem.removeAttribute('tabindex');
        //removeTabIndexWithSelector(document, '#' + playerElem.id + '[tabindex]');
        //removeTabIndexWithSelector(document, '#' + playerElem.id);
        removeTabIndexWithSelector(document, '.html5-video-player');
        //removeTabIndexWithSelector(playerElem, '.html5-video-container [tabindex]');
        //removeTabIndexWithSelector(playerElem, '.html5-main-video[tabindex]');
        removeTabIndexWithSelector(playerElem, '.html5-main-video');

        // Remove tab stops from progress bar
        //removeTabIndexWithSelector(playerElem, '.ytp-progress-bar[tabindex]');
        removeTabIndexWithSelector(playerElem, '.ytp-progress-bar');

        // Remove tab stops from fine seeking bar
        //removeTabIndexWithSelector(playerElem, '.ytp-fine-scrubbing-container [tabindex]');
        //removeTabIndexWithSelector(playerElem, '.ytp-fine-scrubbing-thumbnails[tabindex]');
        removeTabIndexWithSelector(playerElem, '.ytp-fine-scrubbing-thumbnails');

        // Remove tab stops from volume slider
        //removeTabIndexWithSelector(playerElem, '.ytp-volume-panel[tabindex]');
        removeTabIndexWithSelector(playerElem, '.ytp-volume-panel');

        // Remove tab stops of non-buttons and links (inclusive selector)
        //removeTabIndexWithSelector(playerElem, '[tabindex]:not(button):not(a):not(div.ytp-ce-element)');

        // Make unfocusable all buttons in the player
        //removeTabIndexWithSelector(playerElem, '[tabindex]');

        // Make unfocusable all buttons in the player controls (bottom bar)
        //removeTabIndexWithSelector(playerElem, '.ytp-chrome-bottom [tabindex]');
        //removeTabIndexWithSelector(playerElem.querySelector('.ytp-chrome-bottom'), '[tabindex]');

        // Remove tab stops from subtitle element when created
        function mutationHandler(mutations, observer) {
            for (let mut of mutations) {
                //console.log("[YoutubeKeysFix]  mutationHandler():\n", mut);  // spammy
                //removeTabIndexWithSelector(mut.target, '.caption-window[tabindex]');
                removeTabIndexWithSelector(mut.target, '.caption-window');

                if (subtitleContainer)  continue;
                subtitleContainer = playerElem.querySelector('#ytp-caption-window-container');
                // If subtitle container is created
                if (subtitleContainer) {
                    console.log("[YoutubeKeysFix]  mutationHandler():  Subtitle container created, stopped observing #movie_player", [subtitleContainer]);
                    // Observe subtitle container instead of movie_player
                    observer.disconnect();
                    observer.observe(subtitleContainer, { childList: true });
                }
            }
        }

        // Subtitle container observer setup
        // #movie_player > #ytp-caption-window-container > .caption-window
        subtitleContainer = playerElem.querySelector('#ytp-caption-window-container');
        if (!subtitleObserver) {
            subtitleObserver = new MutationObserver( mutationHandler );
            // Observe movie_player because subtitle container is not created yet
            subtitleObserver.observe(subtitleContainer || playerElem, { childList: true, subtree: !subtitleContainer });
        }
    }


    console.log("[YoutubeKeysFix]  loading:  version=" + GM_info.script.version,  "sandboxMode=" + GM_info.sandboxMode, "onYouTubePlayerReady=", window.onYouTubePlayerReady);

    initDom();
    initEvents();
    initStyle();
    // Run initPlayer() when #movie_player is created
    observePlayer();


})();

