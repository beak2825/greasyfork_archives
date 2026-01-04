// ==UserScript==
// @name         torlook speedster
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  removes 10 seconds counter
// @author       You
// @match        https://*.torlook.info/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420494/torlook%20speedster.user.js
// @updateURL https://update.greasyfork.org/scripts/420494/torlook%20speedster.meta.js
// ==/UserScript==

(function () {

    function divInner() {
        let inner = document.getElementsByClassName("fancybox-stage").item(0);
        console.log(inner);
        let script = inner.getElementsByTagName("script")[2].innerHTML;
        let link = script.match(/magnet.*?(?=')/)[0];
        location.href = link;

        let popUp = document.getElementsByClassName('fancybox-container fancybox-is-open fancybox-can-swipe');
        popUp[0].parentNode.removeChild(popUp[0]);
        location.reload();
    }

    function eventListener(obj) {
        obj.addEventListener("click", function (event) {
            setTimeout(divInner, 500);
        });
    }


    let changeList = document.getElementById('resultsDiv'),
        options = {
            childList: true
        },
        observer = new MutationObserver(mCallback);

    function mCallback(mutations) {
        for (let mutation of mutations) {
            if (mutation.type === 'childList') {
                let magnetDivs = document.querySelectorAll("span.magnet");
                magnetDivs.forEach(element => eventListener(element));
            }
        }
    }

    observer.observe(changeList, options);
})();