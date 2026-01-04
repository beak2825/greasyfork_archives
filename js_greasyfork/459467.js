// ==UserScript==
// @name         自动跳转QQ劫持的页面
// @namespace    http://tampermonkey.net/
// @version      1
// @description  自动跳转 "当前网页非官方页面，请复制后访问" 网页到原地址，修改自作者solstice23的版本。
// @author       mengshouer
// @match        https://c.pc.qq.com/middlem.html*
// @match        http://c.pc.qq.com/middlem.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459467/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%ACQQ%E5%8A%AB%E6%8C%81%E7%9A%84%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/459467/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%ACQQ%E5%8A%AB%E6%8C%81%E7%9A%84%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function getParams(name){
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return decodeURIComponent(r[2].startsWith("http") ? r[2] : `https://${r[2]}`);
        }
        return '';
    }
    function htmlEscape(text){
        return text.replace(/[<>"&]/g, function(match, pos, originalText){
            switch(match){
                case "<": return "&lt;";
                case ">":return "&gt;";
                case "&":return "&amp;";
                case "\"":return "&quot;";
            }
        });
    }
    let url = getParams('pfurl');
    document.body.innerHTML="<style>body{overflow: hidden;}#msg{text-align: center;font-size: 25px;margin-top: 20vh;}#text{font-size: 80%;opacity: .6;margin-bottom: 20px;}</style><div id='msg'><div id='text'>正在跳转到</div>" + htmlEscape(url) + "</div>";
    window.location.replace(url);
})();