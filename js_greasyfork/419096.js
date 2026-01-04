// ==UserScript==
// @name         command-center to paragon
// @namespace    http://tampermonkey.net/
// @version      0.0.4
// @description  command center to paragon.
// @author       You
// @include  /^https?://command-center\.support\.aws\.a2z.com/case-console*/

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419096/command-center%20to%20paragon.user.js
// @updateURL https://update.greasyfork.org/scripts/419096/command-center%20to%20paragon.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    // @match        *://command-center.support.aws.a2z.com/case-console/*

    // 获取case Id
    var url = window.location.href;
    console.log(url);


    var arrs=url.split("/");
    var caseId=arrs[arrs.length-1];
    console.log(caseId);   

    // 进行跳转
    var newUrl="https://paragon-na.amazon.com/hz/view-case?caseId="+caseId+"&no_redirect=1";
    location.replace(newUrl);

})();
