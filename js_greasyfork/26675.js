// ==UserScript== 
// @name 全局Css
// @description 美化网页
// @run-at document-start
// @author Royli
// @version 1.2    
// @grant unsafeWindow
// @include *
// @match *://*/*
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/26675/%E5%85%A8%E5%B1%80Css.user.js
// @updateURL https://update.greasyfork.org/scripts/26675/%E5%85%A8%E5%B1%80Css.meta.js
// ==/UserScript==
(function() {
    function addStyle(rules) {
        var styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
        styleElement.appendChild(document.createTextNode(rules));
    }
    addStyle('* {text-decoration: none!important;}');
    addStyle('a:hover {-webkit-border-radius: 2px;-webkit-box-shadow: 0px 0px 3px #666666;color: #39F !important;text-shadow: -5px 3px 18px #39F;}');
    addStyle('a:visited {color: #666666;}');
    addStyle('a[target="_blank"]:hover {color: red !important;text-shadow: 0px 0px 20px #F90 !important;}');
    addStyle('img {-webkit-transition-duration: .31s;-webkit-transition-property: box-shadow;}');
    addStyle('img:hover {-webkit-transition-duration: .31s;-webkit-transition-property: box-shadow;box-shadow: 0px 0px 4px 4px rgba(130, 190, 10, 0.6);}');
})();
