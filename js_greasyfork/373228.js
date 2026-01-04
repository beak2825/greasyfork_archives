// ==UserScript==
// @name         GITHUB
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://github.com/**/stargazers**
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373228/GITHUB.user.js
// @updateURL https://update.greasyfork.org/scripts/373228/GITHUB.meta.js
// ==/UserScript==


(function() {
    'use strict';

    window.onload = function() {
        setTimeout(() => {
            var $btnOn = document.querySelectorAll('.js-social-container:not(.on) .btn.btn-sm.js-toggler-target');
            var $btnDis = document.querySelectorAll('.js-social-container.on .btn.btn-sm.js-toggler-target');

            // Blocked by github
            if ($btnOn.length <= 2 && $btnDis.length <= 2) {
                return setTimeout(() => {
                    location.reload();
                }, 60000)
            }

            var unfollowList = [];
            $btnOn.forEach(item => {
                if(/Follow/.test(item.getAttribute('title'))) {
                    unfollowList.push(item);
                }
            })

            // Turn the page
            if(!unfollowList.length) {
                var $pList = document.querySelectorAll(".pagination a");
                var pIndex = $pList.length - 1;
                return document.querySelectorAll(".pagination a")[pIndex].click();
            }

            var nowIndex = 0;
            function clickFollow(unfollowList, nowIndex) {
                unfollowList[nowIndex].click();
                nowIndex++;
                if (nowIndex >= unfollowList.length) {
                    setTimeout(() => {
                        location.reload();
                    }, 100)
                } else {
                    setTimeout(() => {
                        clickFollow(unfollowList, nowIndex);
                    }, 300 + parseInt(Math.random()*300));
                }
            }

            clickFollow(unfollowList, nowIndex);
        }, 100)
    }

})();