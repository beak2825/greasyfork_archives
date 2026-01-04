// ==UserScript==
// @name         去他妈的灰色网页
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @license       MIT
// @description  去掉灰色滤镜，让网页恢复正常的颜色
// @author       Ihurryup
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455762/%E5%8E%BB%E4%BB%96%E5%A6%88%E7%9A%84%E7%81%B0%E8%89%B2%E7%BD%91%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/455762/%E5%8E%BB%E4%BB%96%E5%A6%88%E7%9A%84%E7%81%B0%E8%89%B2%E7%BD%91%E9%A1%B5.meta.js
// ==/UserScript==
function getQueryVariable(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}
function addNewStyle(newStyle) {
    var styleElement = document.getElementById('styles_js');

    if (!styleElement) {
         styleElement = document.createElement('style');
         styleElement.type = 'text/css';
         styleElement.id = 'styles_js';
         document.getElementsByTagName('head')[0].appendChild(styleElement);
     }
     styleElement.appendChild(document.createTextNode(newStyle));
}



(function() {
    'use strict';
    document.querySelector("html").classList.add("removeGray")
addNewStyle("html.removeGray {-webkit-filter: none!important; -moz-filter:none!important; -ms-filter:none!important; filter: none!important;} html.removeGray *  {-webkit-filter: none!important; -moz-filter:none!important; -ms-filter:none!important; filter: none!important;}");
    // Your code here...
})();