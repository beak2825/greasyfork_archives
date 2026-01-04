// ==UserScript==
// @name         subhd.tv 去广告
// @namespace    https://github.com/frinkr/my-scripts
// @version      0.1
// @description  去除顶层巨大的广告
// @author       frinkr
// @match        *://subhd.tv/*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391913/subhdtv%20%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/391913/subhdtv%20%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('div').filter(function() {return this.className.match(/^ADTOPLB.*$/);}).remove();
    $("ldgindexbuttom").remove();
})();