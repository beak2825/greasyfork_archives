// ==UserScript==
// @name         Remove channel and next video overlays on YouTube
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes the large "play next" overlays and channel link that cover the end of some videos on YouTube
// @author       https://greasyfork.org/en/users/728793-keyboard-shortcuts
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=128&domain=youtube.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452776/Remove%20channel%20and%20next%20video%20overlays%20on%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/452776/Remove%20channel%20and%20next%20video%20overlays%20on%20YouTube.meta.js
// ==/UserScript==

(function() {
    GM_addStyle('.ytp-ce-element.ytp-ce-website.ytp-ce-element-show,' +
                '.ytp-ce-element.ytp-ce-channel.ytp-ce-element-show,' +
                '.ytp-ce-element.ytp-ce-merchandise.ytp-ce-element-show,' +
                '.ytp-ce-element.ytp-ce-website.ytp-ce-element-show,' +
                '.ytp-ce-element.ytp-ce-channel.ytp-ce-element-show,' +
                '.ytp-ce-element.ytp-ce-merchandise.ytp-ce-element-show,' +
                '.ytp-ce-element.ytp-ce-website.ytp-ce-element-show.ytp-ce-force-expand,' +
                '.ytp-ce-element.ytp-ce-channel.ytp-ce-element-show.ytp-ce-force-expand,' +
                '.ytp-ce-element.ytp-ce-element-show,' +
                '.ytp-ce-element.ytp-ce-channel.ytp-ce-channel-this' +
                '.ytp-ce-element.ytp-ce-channel.ytp-ce-channel-this.ytp-ce-top-left-quad' +
                '.ytp-ce-element.ytp-ce-merchandise.ytp-ce-element-show.ytp-ce-force-expand' +
                ' { display: none; visibility: hidden; width: 0px; height: 0px; opacity:0; }');
})();