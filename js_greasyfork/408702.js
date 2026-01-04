// ==UserScript==
// @name         Fiction.Live Top Live Timer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds the live timer back to the top of the page. Or it should anyway.
// @author       You
// @match        https://fiction.live/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408702/FictionLive%20Top%20Live%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/408702/FictionLive%20Top%20Live%20Timer.meta.js
// ==/UserScript==
waitForTimer()
function waitForTimer() {
        var options = {
            childList: true,
            subtree: true
        };
        var observerTimer = new MutationObserver(awaitTimer);
        function awaitTimer(mutations) {
            for (let mutation of mutations) {
                try {
                    var canvas = document.querySelector('header[class="next-live ng-scope"]');
                } catch (error) {}
                if (canvas && (canvas !== undefined && canvas.length != 0)) {
                    observerTimer.disconnect(); // stop observing
                    liveRestore()
                    return;
                };
            };
        };
        observerTimer.observe(document, options);
    };

function liveRestore() {
        var navBar = document.querySelector('[id="mainMenuReplacement"][class="navbar navbar-default navbar-fixed-top"]');
        var liveTimer = document.querySelectorAll('[class="next-live ng-scope"]');
        var myLive = document.createElement('div');
        myLive.setAttribute('id', 'liveBox');
        myLive.style.display = 'block';
        myLive.style.height = '100%';
        myLive.style.width = 'auto';
        myLive.style.float = 'left';
        myLive.style.paddingLeft = '1%';
        myLive.style.paddingRight = '1%';
        myLive.style.borderLeft = 'solid';
        myLive.style.borderRight = 'solid';
        myLive.style.borderColor = '#323448';
        myLive.style.boxSizing = 'border-box';
        myLive.style.color = 'white';
        myLive.style.textShadow = '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000';
        myLive.style.fontWeight = 'bold';
        while (liveTimer[0].childNodes.length > 0) {
            myLive.appendChild(liveTimer[0].childNodes[0]);
        }
        navBar.appendChild(myLive);
        liveTimer[0].style.display = 'none';
        myLive.firstChild.style.color = 'white';
    };
