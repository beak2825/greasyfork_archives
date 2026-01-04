// ==UserScript==
// @name         Evaluation on Teaching Hust
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  This is a script to evaluate teachers in hust using best choices
// @author       Merky Gogh
// @match        http://curriculum.hust.edu.cn/wspj/awspj.jsp*
// @icon         https://www.google.com/s2/favicons?domain=hust.edu.cn
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/428803/Evaluation%20on%20Teaching%20Hust.user.js
// @updateURL https://update.greasyfork.org/scripts/428803/Evaluation%20on%20Teaching%20Hust.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function log(x){
        console.log(x);
    }
    function run(){
        // Write here
        log("Succeed!");
        var radio01s = document.querySelectorAll('[dj="01"]');
        var s3 = document.getElementById("satis03");
        for(var i = 0; i < radio01s.length; i = i + 1) {
            radio01s[i].checked = "checked";
        }
        s3.checked = "checked";
    }
    // Run after doc is ready
    window.onload=function(){
        MyWinOnLoad();
        setTimeout(function(){
            run();
        },700);
    }

})()