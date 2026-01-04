// ==UserScript==
// @name         PKU auto login
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically log in to IAAA, portal and course.
// @author       You
// @match        https://portal.pku.edu.cn/portal2017/
// @match        https://iaaa.pku.edu.cn/*
// @match        https://course.pku.edu.cn/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pku.edu.cn
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445950/PKU%20auto%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/445950/PKU%20auto%20login.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */


(function() {
    'use strict';

    if(document.domain == "portal.pku.edu.cn"){
        setTimeout(function(){
            var ele = $("section.mainWrap:nth-child(2) > ul:nth-child(1) > li:nth-child(1) > a:nth-child(1)");
            if(ele && ele[0].href == "https://portal.pku.edu.cn/portal2017/login.jsp"){
                ele[0].click();
            }
        }, 1000);
    }

    if(document.domain == "iaaa.pku.edu.cn"){
        setTimeout(function(){
            $("#logon_button")[0].click();
        }, 500);
    }

    if(document.domain == "course.pku.edu.cn"){
        setTimeout(function(){
            $(".login_stu_a")[0].click();
        }, 500);
    }

})();