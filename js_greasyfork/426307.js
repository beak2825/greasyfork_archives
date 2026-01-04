// ==UserScript==
// @name         Onlyfans - Hide Ads & shoutouts
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Hide all posts that contains shoutouts or ads for other profiles
// @author       the-juju
// @include      https://*onlyfans.com/*
// @include      http://*onlyfans.com/*
// @icon         https://static.cdn.onlyfans.com/favicon-32x32.png?rev=202105071701-4c46682989
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426307/Onlyfans%20-%20Hide%20Ads%20%20shoutouts.user.js
// @updateURL https://update.greasyfork.org/scripts/426307/Onlyfans%20-%20Hide%20Ads%20%20shoutouts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var init = function() {
        console.log('hide !');
        var adsRegex = /@/gm;
        var blocSelector = '.b-post__wrapper';
        var contentSelector = '.b-post__text';

        var blocs = document.querySelectorAll(blocSelector);
        for (var i = 0; i < blocs.length; i++) {
            var bloc = blocs[i];
            var contentElement = bloc.querySelector(contentSelector);

            if (!contentElement || adsRegex.exec(contentElement.innerText) === null) {
                continue;
            }

            bloc.remove();
        }
    }

    var interval = window.setInterval(function() {
        init()
    }, 5000);
})();