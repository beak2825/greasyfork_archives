// ==UserScript==
// @name         iCloud PWA App Icons
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  iCloud favicon/icons for the apps of icloud and PWAs
// @author       https://greasyfork.org/en/users/996660-olgro
// @match        https://www.icloud.com/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=icloud.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456505/iCloud%20PWA%20App%20Icons.user.js
// @updateURL https://update.greasyfork.org/scripts/456505/iCloud%20PWA%20App%20Icons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function iconUrl(id) {
        return 'https://www.icloud.com/system/icloud.com/2303Hotfix61/en-us/' + id + '.png';
    }

    const appIcons = {
        'find': iconUrl('32f2db22e40a7765c151f4d947c2be50'),
        'notes': iconUrl('ddc3380f93d44a376c586796bb7c16a7'),
        'mail': iconUrl('a6e032ae59d1fd9d47ac97d7b2e2a3af'),
        'contacts': iconUrl('4b1d90456b68a8d4d4b91adb39e60b70'),
        'photos': iconUrl('1c11f0fa22d4e93f8dc179b8ff84791d'),
        'iclouddrive': iconUrl('dccb81ba3f0f63e9a50c162007f59c4a'),
        'reminders': iconUrl('1b5c615b834cbb4d30e0c229e8e099a3'),
        'pages': iconUrl('3c581ce16ec89eedc1d6862e31ccd8b3'),
        'numbers': iconUrl('f5b837094af69a157a6fc7f413e04fb7'),
        'keynote': iconUrl('43f50d5d6df53dc6bddf56d7ceb257d0'),
        'default': '/system/icloud.com/current/static/apple-touch-icon-precomposed.png',
    }

    function changeIcon() {
        console.log('change icon');
        const currentApp = window.location.href.split('/')[3];
        const currentIcon = appIcons[currentApp] ?? appIcons['default'];
        console.log(currentApp, currentIcon);


        // remove icon tags from header
        [...document.head.children].forEach(child => {
            const rel = child.rel;
            if (rel && rel.includes('icon')) {
                document.head.removeChild(child);
            }
        });

        const link = document.createElement('link');
        link.type = 'image/png';
        link.rel = 'shortcut icon';
        link.href = currentIcon;

        //link.href = 'http://fonts.googleapis.com/css?family=Oswald&effect=neon';
        document.head.appendChild(link);
    }

    changeIcon();
    window.addEventListener('locationchange', changeIcon);
    window.addEventListener('popstate', changeIcon);

    (function(history){
        var pushState = history.pushState;
        history.pushState = function(state) {
            setTimeout(() => {
                changeIcon();
            }, 100);
            return pushState.apply(history, arguments);
        };
    })(window.history);
})();