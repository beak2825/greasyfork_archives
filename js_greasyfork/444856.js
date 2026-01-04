// ==UserScript==
// @name         拷贝兔（自用）
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  拷贝兔回车键自动点击提取内容;
// @author       GnA1J
// @match        https://cp.anyknew.com/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444856/%E6%8B%B7%E8%B4%9D%E5%85%94%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/444856/%E6%8B%B7%E8%B4%9D%E5%85%94%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
window.onkeydown = function(e){
var button = document.getElementsByTagName("button");
var a = document.getElementsByTagName("a");
            if(e.keyCode == 13){
                button[0].click();
            }

        }


})();