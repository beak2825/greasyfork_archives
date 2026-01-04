    // ==UserScript==
    // @name         FK CD ANQUAN
    // @namespace    http://tampermonkey.net/
    // @version      0.2
    // @description  学校安全教育平台自动选择答案
    // @author       Anonymous
    // @match       https://*.xueanquan.com/html/jt/student/SeeVideo.html*
    // @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
    // @require https://code.jquery.com/jquery-3.6.0.min.js
    // @grant        none
    // @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461024/FK%20CD%20ANQUAN.user.js
// @updateURL https://update.greasyfork.org/scripts/461024/FK%20CD%20ANQUAN.meta.js
    // ==/UserScript==
     
     
    (function() {
        'use strict';
        var $ = window.jQuery;
        var fillingForm = function() {
            $("input[type=radio][value=1]").prop('checked', true);
        };
        $(document).ready(function() {
            window.setTimeout(fillingForm, 1000);
        });
    })();

