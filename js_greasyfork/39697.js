// ==UserScript==
// @name  pornhub.com helper
// @namespace    https://github.com/maijz128
// @version      0.1.0
// @description  remove AD.
// @author       MaiJZ
// @match        *://*.pornhub.com/*
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39697/pornhubcom%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/39697/pornhubcom%20helper.meta.js
// ==/UserScript==

(function () {
    main();
})();


function main() {
    if (matchURL("view_video.php")) {
        ViewVideo();
    }

    removeAD();
}

function removeAD() {
    function removeFooterAD() {
        $('.wrapper:first').next().remove();
    }
    
    function removeRightAD() {
        $('.container .sectionWrapper .adlink2').parent().parent().remove();
    }

    removeFooterAD();
    removeRightAD();
}


function ViewVideo() {

    function removeRightAD() {
        const hd_rightColVideoPage = document.getElementById("hd-rightColVideoPage");
        if (hd_rightColVideoPage) {
            const element = hd_rightColVideoPage.children[0];

            if (elementHasClass(element, "clearfix")) {
                // hd_rightColVideoPage.removeChild(element);
                element.setAttribute("style", "display: block;");
                element.innerHTML = "";
                console.log("删除右侧广告");
                console.log(element);
            } else {
                setTimeout(() => {
                    removeRightAD();
                }, 200);
            }
        }
    }


    // 未完成
    function autoLargePlayer(params) {
        const SELECTOR = "div.mhp1138_cinema > div.mhp1138_large";
        const btn = document.querySelector(SELECTOR);
        if (btn) {
            console.log("宽屏播放");
            btn.click();
        }
    }

    removeRightAD();
    autoLargePlayer();

}

function matchURL(url) {
    const URL = window.location.href;
    return URL.indexOf(url) > -1;
}

function elementHasClass(element, className) {
    if (element) {
        // HTML5
        return element.classList.contains(className);
    }
    return false;
}