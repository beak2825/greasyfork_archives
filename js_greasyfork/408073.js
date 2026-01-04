// ==UserScript==
// @name         移除今日热榜首页广告
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  GET RID OF ADS ON TOPHUB'S MAIN PAGE!
// @author       Samir Duran
// @match        https://tophub.today/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408073/%E7%A7%BB%E9%99%A4%E4%BB%8A%E6%97%A5%E7%83%AD%E6%A6%9C%E9%A6%96%E9%A1%B5%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/408073/%E7%A7%BB%E9%99%A4%E4%BB%8A%E6%97%A5%E7%83%AD%E6%A6%9C%E9%A6%96%E9%A1%B5%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

let styleSheet = `
.logoPlaceHolder {
    display: block;
    box-sizing: content-box;
    margin-left: auto;
    margin-right: auto;
    width: 150px;
    height: 150px;
}

.dark .cc-cd-ih .cc-cd-is a{color:#FFFFFF}
`;

let s = document.createElement('style');
s.type = "text/css";
s.innerHTML = styleSheet;
(document.head || document.documentElement).appendChild(s);


(function() {
    'use strict';

    (function removeAdBanner() {
        var adBanner = document.getElementsByClassName("alert-warning")[0];
        if (adBanner.parentNode) {
            adBanner.parentNode.removeChild(adBanner);
        }
    })();

    var logo = document.createElement("img");
    logo.src = "https://file.ipadown.com/tophub/assets/images/logo.png";
    logo.alt = "logo";
    logo.className = "logoPlaceHolder";

    (function removeNewRecommend() {
        var newRecommend = document.getElementsByClassName("qc")[0];
        var recommendParent = newRecommend.parentNode;
        if (recommendParent) {
            recommendParent.replaceChild(logo, newRecommend);
        }

    })();

    (function smoothScrollToAnchor() {
        var target = document.getElementsByClassName("c-d")[0];
        if (window.scrollTo) {
            window.scrollTo({"behavior": "smooth", "top": 210});
        }
    })();

})();