// ==UserScript==
// @name         GeekBang Recorder
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  submit articles
// @author       c01dkit
// @match        https://time.geekbang.org/column/article/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480425/GeekBang%20Recorder.user.js
// @updateURL https://update.greasyfork.org/scripts/480425/GeekBang%20Recorder.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // Your code here...
    var data=null;
    const originOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(_,url) {
        var self = this;
        if (url === "https://time.geekbang.org/serv/v1/article") {
            this.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    data = JSON.parse(this.responseText);
                    // console.log(data);
                    // console.log(this.readyState);
                    // console.log(data);
                    data['cur_url'] = location.href;
                    GM_xmlhttpRequest({
                        url: "http://1.94.3.68/index.php",
                        method: "post",
                        data: JSON.stringify(data),
                        headers: {
                            "Content-Type": 'application/json',
                            "auth": 'Xhzsyy04J7ho0wIdZJ5pBj4zbwjCP87h'
                        },
                        onload: function (response) {
                            console.log('onload');
                        },
                        onerror: function (response) {
                            console.log('onfail');
                        }
                    })
                } else {
                    console.log(this.readyState);
                }
            })

        }
        originOpen.apply(this, arguments);
    };
})();