// ==UserScript==
// @name         Auto Answer ComplianceOnline
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       Yich Lin
// @include     /^https?://.*complianceonline.admin-agylia.com/.*$/
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372081/Auto%20Answer%20ComplianceOnline.user.js
// @updateURL https://update.greasyfork.org/scripts/372081/Auto%20Answer%20ComplianceOnline.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.top != window.self) {
        //直接跳轉到測驗頁面 會有些persistence data不能保留
        //var url = window.location.href;
        //if(url.indexOf("a001_")>-1 && url.indexOf("a001_test_your_understanding_test") ===-1){
            //ObjLayerActionGoTo('a001_test_your_understanding_test_start_tyu.html');
           // return;
        //}
        var html = $("html").html();

        var regex = /The correct answer is \w+/;
        var match = regex.exec(html);
        //如果有match到解答
        if(match !=null){
            alert(match[0]);
        }
    }


})();