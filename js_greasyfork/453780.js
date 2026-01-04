// ==UserScript==
// @name         XHR Hooker
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Leo
// @match        https://mobile.pinduoduo.com/search_result.html*
// @match        https://waphb.189.cn/view/esmpOrder/*
// @icon         https://bpic.51yuansu.com/pic2/cover/00/47/01/58159d67cbed9_610.jpg
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453780/XHR%20Hooker.user.js
// @updateURL https://update.greasyfork.org/scripts/453780/XHR%20Hooker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function copyToClipboard(text) {
        //console.log(text);
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
        }else {
            var dummy = document.createElement("textarea");
            // to avoid breaking orgain page when copying more words
            // cant copy when adding below this code
            // dummy.style.display = 'none'
            document.body.appendChild(dummy);
            //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
            dummy.value = text;
            dummy.select();
            document.execCommand("copy", true);
            //document.body.removeChild(dummy);
        }
    }
    window.msgCount = 0;
    // Your code here...
    (function() {
    var origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        // console.log('request started!');
        this.addEventListener('load', function() {
            //console.log('request completed!');
            //console.log(this.readyState); //will always be 4 (ajax is completed successfully)
            if(this.responseText.length > 500){
                console.log("get xhr result" + window.msgCount);
                window.msgCount += 1;
                copyToClipboard(this.responseText); //whatever the response was
            }
        });
        origOpen.apply(this, arguments);
    };
    })();
    // set interval to wait for the arrival of the rawData and copy it
//     var id = setInterval(() => {
//         // copy the rawData to the clipboard
//         if (rawData) {
//             // clear interval
//             //console.log(rawData);
//             clearInterval(id);
//             console.log("get rawData");
//             copyToClipboard(JSON.stringify(rawData));
//         }
//         // console.log(rawData);
//     }, 1500);

})();