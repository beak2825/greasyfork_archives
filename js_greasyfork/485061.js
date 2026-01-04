// ==UserScript==
// @name         惠州学院教务查成绩
// @version      0.1
// @description  在学籍预警处
// @match        *://jwxt.hzu.edu.cn/*
// @run-at       document-start
// @grant        unsafeWindow
// @license MIT
// @namespace https://greasyfork.org/users/1241091
// @downloadURL https://update.greasyfork.org/scripts/485061/%E6%83%A0%E5%B7%9E%E5%AD%A6%E9%99%A2%E6%95%99%E5%8A%A1%E6%9F%A5%E6%88%90%E7%BB%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/485061/%E6%83%A0%E5%B7%9E%E5%AD%A6%E9%99%A2%E6%95%99%E5%8A%A1%E6%9F%A5%E6%88%90%E7%BB%A9.meta.js
// ==/UserScript==
(async function() {
    'use strict';
    let xhr_bak = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (_, url) {
        if (/\/xjyj\/xjyj_cxXjyjjdlb.html/.test(url)) {
            this.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    let response = this.responseText;

                    Object.defineProperty(this, "responseText", {
                        writable: true,
                    });

                    this.responseText = JSON.stringify(JSON.parse(response, (key, value) =>
                        (this.bfzcj = key === 'bfzcj' || key !== 'cj' ? value : this.bfzcj)
                    ));
                }
            });
        }
        xhr_bak.apply(this, arguments);
    };
})();