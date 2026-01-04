// ==UserScript==
// @name         ych"filter"
// @namespace    *
// @version      6.9
// @description  owo
// @author       AkunaPaw
// @include      http://ych.commishes.com/*
// @include      https://ych.commishes.com/*
// @downloadURL https://update.greasyfork.org/scripts/396634/ych%22filter%22.user.js
// @updateURL https://update.greasyfork.org/scripts/396634/ych%22filter%22.meta.js
// ==/UserScript==


(function () {


    var MaximumPrice = prompt("max price?")

    setInterval(function () {
        var allstuff = document.getElementsByClassName("bid").length
        for (var i = 0; allstuff > i; i++) {


            if (Number(document.getElementsByClassName("bid")[allstuff - i - 1].innerText.replace(/\$/g, '')) > MaximumPrice) {
                document.getElementsByClassName("bid")[allstuff - i -1].parentElement.parentElement.remove()
            }
        }
    }, 1000);



})();