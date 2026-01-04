// ==UserScript==
// @name         YouTube To Invidious Button
// @version      1.0
// @description  Adds a button to redirect from YouTube to an Invidious instance
// @author       Rust1667
// @match        *://www.youtube.com/*
// @namespace https://greasyfork.org/users/980489
// @downloadURL https://update.greasyfork.org/scripts/509894/YouTube%20To%20Invidious%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/509894/YouTube%20To%20Invidious%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const invInstances = [
          'redirect.invidious.io',
          'inv.nadeko.net',
          'invidious.nerdvpn.de',
          'invidious.privacyredirect.com',
          'invidious.jing.rocks',
        ];
    const invInstance = invInstances[Math.floor(Math.random() * invInstances.length)];

    var button = document.createElement('button');
    button.innerHTML = 'Redirect to Invidious';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '300px';
    button.style.zIndex = '10000';
    button.style.padding = '10px';
    button.style.backgroundColor = '#ff0000';
    button.style.color = '#ffffff';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    document.body.appendChild(button);

    button.onclick = function () {
        window.location.assign(window.location.toString().replace('www.youtube.com', invInstance));
    };

})();
