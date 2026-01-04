// ==UserScript==
// @name         TikTok Larger Video + Mouse Volume Control
// @namespace    https://greasyfork.org/en/users/807108-jeremy-r
// @version      1.2
// @description  Makes the TikTok video take up more of the screen
// @author       JRem
// @require      https://cdn.jsdelivr.net/gh/mlcheng/js-toast@ebd3c889a1abaad615712485ce864d92aab4c7c0/toast.min.js
// @match        https://www.tiktok.com/*/video/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455388/TikTok%20Larger%20Video%20%2B%20Mouse%20Volume%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/455388/TikTok%20Larger%20Video%20%2B%20Mouse%20Volume%20Control.meta.js
// ==/UserScript==

(function() {
    // Set to 0, if you want to keep the blur
    const removeBlur="1"
    // Set to 0, to disable toast msg's
    const enableToasts="1"

    // Toast Vars
    const options = {settings: {duration: 500,},style: {main: {background: "black",color: "white",width: "auto",'max-width': '10%',}}};

    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    // Volume Control via mouse scroll
    // 1 Scroll = 5%
    var stepAmount = 5;

    function volChange(e){
        e.preventDefault()
        var video = document.querySelector('video')
        var curVol = video.volume;
        var direction = e.deltaY < 0;
        var actualChange = stepAmount / 100;
        if (direction) curVol += actualChange;
        else curVol -= actualChange;
        if (curVol > 1) curVol = 1;
        else if (curVol < 0) curVol = 0;
        video.volume = curVol;

        if (enableToasts==1) {iqwerty.toast.toast(Math.floor(100 * video.volume) +"%", options);}
    }

    document.querySelector('div[class*="-DivVideoContainer"]').addEventListener("wheel", volChange);


    waitForElm('div[class*="-DivVideoContainer"]').then((elm) => {
        console.log('Element Found, Starting Fullscreen');

        var cssClass = document.querySelector('div[class*="-DivVideoContainer"]').className.split(" ")
        var css = "."+cssClass[0]+", ."+cssClass[1]+" { height: 80vh !important; }";
        GM_addStyle(css);
        if (enableToasts==1) {iqwerty.toast.toast('Fullscreen added', options);}

        if (removeBlur==1) {
            var cssClass1 = document.querySelector('div[class*="-DivBlurBackground"]').className.split(" ")
            var css1 = "."+cssClass1[0]+", ."+cssClass1[1]+" { opacity: 0 !important; }";
            GM_addStyle(css1);
            if (enableToasts==1) {iqwerty.toast.toast('Blur Removed', options);}
        }
    });
})();