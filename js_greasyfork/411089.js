  
// ==UserScript==
// @name         文学城去广告
// @namespace    https://github.com/frinkr/my-scripts
// @version      0.2
// @description  文学城Kill Ads
// @author       frinkr
// @match        *://www.wenxuecity.com/*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411089/%E6%96%87%E5%AD%A6%E5%9F%8E%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/411089/%E6%96%87%E5%AD%A6%E5%9F%8E%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function () {
    'use strict';

    setInterval(function () {
        $('div[class=wxc-ab-root]').hide();
        document.body.style.position = '';
        document.body.style.top = ''
    }, 500)
})();