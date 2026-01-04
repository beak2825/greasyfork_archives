// ==UserScript==
// @name         LztCDN proxy
// @version      0.1
// @description  unblock cdn
// @author       Kernel
// @match        https://zelenka.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/1186395
// @downloadURL https://update.greasyfork.org/scripts/476587/LztCDN%20proxy.user.js
// @updateURL https://update.greasyfork.org/scripts/476587/LztCDN%20proxy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let timer = setInterval(() => {
        if (XenForo.activate && XenForo.register)
            clearInterval(timer)
        $(document).bind('XenForoActivateHtml', () => {
            const images = $('img').toArray();
            for (let i = 0; i < images.length; i++) {
                let image = $(images[i])
                if (image)
                    image.attr('src', image.attr('src').replace('https://lztcdn.com', 'https://external-content.duckduckgo.com/iu/?u=https://lztcdn.com'))
            }
        });
    }, 1);
})();