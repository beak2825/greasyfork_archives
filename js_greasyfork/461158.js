// ==UserScript==
// @name         R DATE
// @namespace    XB
// @version      0.1
// @description  Change Date
// @author       You
// @match        http://10.111.36.3:2029/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=36.3
// @grant        none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/461158/R%20DATE.user.js
// @updateURL https://update.greasyfork.org/scripts/461158/R%20DATE.meta.js
// ==/UserScript==


(function() {
    'use strict';
    taskReport_checkDay=function(){
        openLoader();
        var e = $("li[field='report_action_date'] textarea");
        var a = e.val();
        taskReport_init(false, a);
        closeLoader()
    };

})();

