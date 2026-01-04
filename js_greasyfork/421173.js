// ==UserScript==
// @name         Auto Signin
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto Sigin for sockboom flow usage
// @author       Jeromy
// @include      *://www.baidu.com*
// @include      *://www.google.com*
// @include      *://www.dogedoge.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421173/Auto%20Signin.user.js
// @updateURL https://update.greasyfork.org/scripts/421173/Auto%20Signin.meta.js
// ==/UserScript==

(function() {
    console.log("begin now");
    var func = () => {
        'use strict';
        var httpRequest = new XMLHttpRequest();
        httpRequest.open('GET', 'https://api.sockboom.cc/client/checkin?token=PHSTZYEKQVQTGKH6', true);
        httpRequest.send();
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                var json = httpRequest.responseText;
                console.log(json);
            }
        };
        httpRequest.onreadystatechange();
    };
    //setTimeout(func, 1000*3600);
    func();
    // Your code here...
})();