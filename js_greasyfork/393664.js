// ==UserScript==
// @name         快眼看书去广告
// @namespace    http://www.wandhi.com/
// @version      1.0.0
// @description  移除快眼看书广告
// @author       Wandhi
// @icon         https://www.wandhi.com/favicon.ico
// @include      https://www.kuaiyankanshu.net/*/read_*.html
// @downloadURL https://update.greasyfork.org/scripts/393664/%E5%BF%AB%E7%9C%BC%E7%9C%8B%E4%B9%A6%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/393664/%E5%BF%AB%E7%9C%BC%E7%9C%8B%E4%B9%A6%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    function closeAd(){
        document.querySelector("#note").previousElementSibling&&document.querySelector("#note").previousElementSibling.remove();
        document.querySelector("#note")&&document.querySelector("#note").remove();
    }
var adSwitch= setInterval(function(){
    closeAd();
},1000);
})();