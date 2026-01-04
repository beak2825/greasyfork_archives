// ==UserScript==
// @name         nhentai Page Changer
// @namespace    http://tampermonkey.net/
// @version      0.5.7
// @description  Allows to change page with keyboard arrows in results /search pages
// @author       You
// @match        https://nhentai.net/search/*
// @include      https://nhentai.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398470/nhentai%20Page%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/398470/nhentai%20Page%20Changer.meta.js
// ==/UserScript==

(function () {
    "use strict";
    // Your code here...
    window.onkeydown = function (e) {
        var origURL = document.URL;
        var num;
        var prenum;
        var newUrl;
        function getNum() {
            var counter = 1;
            do {
                prenum = origURL.charAt(origURL.length - counter - 1);
                console.log(origURL);
                console.log("prenum: " + prenum);
                console.log(prenum.match(/[0-9]+/g));
                if (prenum.match(/[0-9]+/g)) {
                    counter++;
                }
            } while (prenum.match(/[0-9]+/g));

            return counter;
        }

        var code = e.keyCode ? e.keyCode : e.which;
        if (code === 39) {
            //right key
            if (origURL.includes("page")) {
                if (
                    document.URL.includes("page") &&
                    !document.URL.charAt(document.URL.length - 1).match(/[1-9]/)
                ) {
                    var regx = /(&page=[0-9]+)/g;
                    var match;
                    match = regx.exec(this.document.URL);
                    var index1 = match.index;
                    var index2 = match[0].length;
                    this.console.log(`index 1: ${index1} y index 2: ${index2}`);
                    this.console.log(this.document.URL.substr(index1,index2));
                    var array1 = origURL.split(/(&page=[0-9]+)/g);
                    this.console.log(array1);
                    var temp = array1[2];
                    array1[2] = array1[1];
                    array1[1] = temp;
                    origURL = array1.join("");
                }
                var counter = getNum();
                console.log("counter: " + counter);
                num = origURL.substring(origURL.length - counter, origURL.length);
                num++;
                newUrl = origURL.substring(0, origURL.length - counter);
                newUrl = newUrl.concat(num);
                window.location = newUrl;
            }
            else if (origURL.match(/^.*nhentai.net\/g\/[0-9]*\/$/)){
                window.location = origURL.concat("1/");
            }else if (origURL.match(/.*nhentai.net\/g\/[0-9]*\//)){
                return;
            }
            else if (origURL.includes("tag") || origURL == "https://nhentai.net/") {
                newUrl = origURL;
                newUrl = newUrl.concat("?page=2");
                window.location = newUrl;
            }
            else if (!origURL.includes("page")) {
                newUrl = origURL.substring(0, origURL.length - 1);
                newUrl = newUrl.concat("&page=2");
                window.location = newUrl;
            }
        } else if (code === 37 && !origURL.match(/.*nhentai.net\/g\/[0-9]*\//)) {
            //left key
            counter = getNum();
            console.log(counter);
            num = origURL.substring(origURL.length - counter, origURL.length);
            console.log(num);
            num--;
            newUrl = origURL.substring(0, origURL.length - counter);
            newUrl = newUrl.concat(num);
            window.location = newUrl;
        }
    };
})();
