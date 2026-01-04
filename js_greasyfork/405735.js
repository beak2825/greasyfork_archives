// ==UserScript==
// @name         自动填写萌娘百科验证码
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  用于萌百编辑者自动填写验证码
// @author       CirnoGiovanna
// @match        https://zh.moegirl.org/*
// @downloadURL https://update.greasyfork.org/scripts/405735/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E9%AA%8C%E8%AF%81%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/405735/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E9%AA%8C%E8%AF%81%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(document.domain == 'zh.moegirl.org'){
        var test = document.getElementById('wpCaptchaWord');
        if(test){
            var ref = document.getElementsByClassName('external free');
            var url = ref.item(ref.length-1).href;
            //console.log(url)
            var name1 = url.replace(/.*\//,'');
            var name2 = name1.replace(/.*:/,'');
            test.value = decodeURI(name2);
        }
    }
})();