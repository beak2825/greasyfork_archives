// ==UserScript==
// @name         CSDN_CODE_COPY
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  CSDN code copy
// @author       ZF
// @license MIT
// @match        https://blog.csdn.net/*
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451977/CSDN_CODE_COPY.user.js
// @updateURL https://update.greasyfork.org/scripts/451977/CSDN_CODE_COPY.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('#article_content').css('height', 'auto');
    $('#article_content').css('overflow', 'auto');

    $('#treeSkill').css('display', 'none');
    $('.hide-article-box').css('display', 'none');

    $('#content_views pre code').css('user-select', 'text');
    $('.cnblogs_code pre').css('user-select', 'text');

})();