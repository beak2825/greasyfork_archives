// ==UserScript==
// @name         Anti CodeChum Ad
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Para mawala tong ad
// @author       You
// @match        https://citu.codechum.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=codechum.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452005/Anti%20CodeChum%20Ad.user.js
// @updateURL https://update.greasyfork.org/scripts/452005/Anti%20CodeChum%20Ad.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    const closeAd = () => {
        // if loaded on playground, stop
        if(window.location.href.includes("playground")) return;

        // either put delay or wait until the thing is loaded and stop if that thing is still not appearing for 5s
        let passed = 0;
        const delay = 100;

        let exitBtn = Array.from(document.querySelectorAll("i")).filter(e => e.innerHTML == "close");
        while(exitBtn.length == 0){
            if(passed >= 5000) return;
            setTimeout(() => {
                exitBtn = Array.from(document.querySelectorAll("i")).filter(e => e.innerHTML == "close");
                console.log("Still Looping");
                passed += delay;
            }, delay);
        }

        exitBtn.forEach(e => e.parentElement.click());
    }

    closeAd();


    // EXPERIMENTAL PART

    var open = window.XMLHttpRequest.prototype.open,
        send = window.XMLHttpRequest.prototype.send;

    function openReplacement(method, url, async, user, password) {
        this._url = url;
        return open.apply(this, arguments);
    }

    function sendReplacement(data) {
        if(this.onreadystatechange) {
            this._onreadystatechange = this.onreadystatechange;
        }

        // if you want to modify send requests

        this.onreadystatechange = onReadyStateChangeReplacement;
        return send.apply(this, arguments);
    }

    function onReadyStateChangeReplacement() {

        // modify here received requests
        if(this.responseURL.includes("page-visits/count")){
            setTimeout(closeAd, 200);
        }

        if(this._onreadystatechange) {
            return this._onreadystatechange.apply(this, arguments);
        }
    }

    window.XMLHttpRequest.prototype.open = openReplacement;
    window.XMLHttpRequest.prototype.send = sendReplacement;

    var request = new XMLHttpRequest();
    request.open('GET', '.', true);
    request.send();

})();