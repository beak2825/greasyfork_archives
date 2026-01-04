// ==UserScript==
// @name         Disable whereby knocking
// @namespace    http://31337.it/
// @version      0.1
// @description  disables knocking on https://whereby.com/
// @author       Simon
// @match        https://whereby.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400109/Disable%20whereby%20knocking.user.js
// @updateURL https://update.greasyfork.org/scripts/400109/Disable%20whereby%20knocking.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var checkExist = function(selector, cb) {
        return setInterval(function() {
            var el = document.querySelectorAll(selector);
            if (el.length) {
                cb(el[0]);
            }
        }, 100);
    }


    var setEverytingUpTimer;
    var setEverytingUp = function() {
        var disableText = 'disable knocking';
        var enableText = 'enable knocking';
        var timer;

        var addLinkBefore = document.querySelectorAll('.NavButton-2kvr.IconButton-2aoD')[0];
        var toggleLink = document.createElement('a');
        toggleLink.appendChild(document.createTextNode(enableText));
        toggleLink.href = 'javascript:///';
        toggleLink.addEventListener('click', function(el) {
            if (toggleLink.innerHTML === enableText) {
                clearInterval(timer);
                toggleLink.innerHTML = disableText;
            } else {
                timer = checkExist('.BaseNotification-2Lci', function(el) {
                    el.setAttribute('style', 'display: none;');
                });
                toggleLink.innerHTML = enableText;
            }
        });

        var parentNode = addLinkBefore.parentElement;
        parentNode.insertBefore(toggleLink, addLinkBefore);

        //start
        timer = checkExist('.BaseNotification-2Lci', function(el) {
            el.setAttribute('style', 'display: none;');
        });

    }

    setEverytingUpTimer = checkExist('.jstest-room-header', function() {
        clearInterval(setEverytingUpTimer);
        setEverytingUp();
    });

})();