// ==UserScript==
// @name         Biliplus启用在线播放按钮
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  强制启用在线播放按钮
// @author       none
// @license      MIT
// @match        *://*.biliplus.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/542436/Biliplus%E5%90%AF%E7%94%A8%E5%9C%A8%E7%BA%BF%E6%92%AD%E6%94%BE%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/542436/Biliplus%E5%90%AF%E7%94%A8%E5%9C%A8%E7%BA%BF%E6%92%AD%E6%94%BE%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const enablePlayback = localStorage.getItem('enablePlayback');
    if (enablePlayback !== 'on') {
        localStorage.setItem('enablePlayback', 'on');
    }
    

    
})();