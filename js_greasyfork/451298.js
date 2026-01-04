// ==UserScript==
// @name         pcrock CSDN
// @description  去广告
// @match        *

// @version 0.0.1.20220913094648
// @namespace https://greasyfork.org/users/144763
// @downloadURL https://update.greasyfork.org/scripts/451298/pcrock%20CSDN.user.js
// @updateURL https://update.greasyfork.org/scripts/451298/pcrock%20CSDN.meta.js
// ==/UserScript==
(function() {
    window.onload = function() {
        if (window.location.host == "blog.csdn.net") {
            var asideFooter = document.querySelector("#asideFooter");
            if (asideFooter != null) {
                asideFooter.style.visibility = "hidden"
            }
            var pulllogBox = document.querySelector(".pulllog-box");
            if (pulllogBox != null) {
                pulllogBox.style.visibility = "hidden"
            }
            var dmp_ad_58 = document.querySelector("#dmp_ad_58");
            if (dmp_ad_58 != null) {
                dmp_ad_58.style.visibility = "hidden"
            }
            var indexSuperise = document.querySelector(".indexSuperise");
            if (indexSuperise != null) {
                indexSuperise.style.visibility = "hidden"
            }
            var adContent = document.querySelector("#adContent");
            if (adContent != null) {
                adContent.style.visibility = "hidden"
            }
            var recommendadbox = document.querySelectorAll(".recommend-ad-box");
            if (recommendadbox != null) {
                for (var i = 0; i < recommendadbox.length; i++) {
                    recommendadbox[i].style.visibility = "hidden"
                }
            }
            var type_hot_word = document.querySelector(".type_hot_word");
            if (type_hot_word != null) {
                type_hot_word.style.visibility = "hidden"
            }
            var recommendRight = document.querySelector(".recommend-right");
            if (recommendRight != null) {
                recommendRight.style.visibility = "hidden"
            }
            var aside = document.querySelector("aside");
            if (aside != null) {
                aside.parentNode.removeChild(aside)
            }
            document.querySelector("#btn-readmore").click()
        }
    };
})();