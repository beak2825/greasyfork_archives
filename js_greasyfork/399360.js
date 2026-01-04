// ==UserScript==
// @name         bilibili删除没有订阅过的话题
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在动态页面删除最热/发起/参与/话题这样的hashtag，只保留自己订阅过的。
// @author       zxhzxhz
// @match        https://t.bilibili.com/
// @grant        none
// @esversion    6
// @downloadURL https://update.greasyfork.org/scripts/399360/bilibili%E5%88%A0%E9%99%A4%E6%B2%A1%E6%9C%89%E8%AE%A2%E9%98%85%E8%BF%87%E7%9A%84%E8%AF%9D%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/399360/bilibili%E5%88%A0%E9%99%A4%E6%B2%A1%E6%9C%89%E8%AE%A2%E9%98%85%E8%BF%87%E7%9A%84%E8%AF%9D%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    "use strict";
    var taglist = document.getElementsByClassName("tag-list");
    function waitfortags() {
        var count = 0;
        return new Promise((res, rej) => {
            let id = window.setInterval(() => {
                taglist = document.getElementsByClassName("tag-list");
                count += 1;
                try {
                    if (taglist.item(0).childNodes.length > 0) {
                        clearInterval(id);
                        res("success");
                    } else if (
                        (taglist.item(0).childNodes.length === 0) &
                        (count > 1000)
                    ) {
                        rej("failed");
                    }
                } catch(err) {
                    /*do nothing*/
                }
            }, 100);
        });
    }
    waitfortags()
        .then(() => {

        taglist.item(0).childNodes.forEach(element => {
            if (element.firstChild.children[1].textContent != "订阅") {
                setTimeout(() => {
                    element.remove();
                }, 150);

            }
        });
    })
        .catch(err => {/*do nothing*/});

    // Your code here...
})();
