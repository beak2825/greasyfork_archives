// ==UserScript==
// @name         B站共同关注查询
// @namespace    https://github.com/XiaoMiku01
// @version      0.2
// @description  查成分！
// @author       晓轩
// @match        https://*.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428381/B%E7%AB%99%E5%85%B1%E5%90%8C%E5%85%B3%E6%B3%A8%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/428381/B%E7%AB%99%E5%85%B1%E5%90%8C%E5%85%B3%E6%B3%A8%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==
(function () {
    async function readJSON(uid) {
        return new Promise((resolve, reject) => {
            fetch('https://api.bilibili.com/x/relation/same/followings?vmid=' + uid, {
                credentials: 'include'
            }).then(function (data) { resolve(data.json()) })
        })
    }
    var handler = function () {
        setTimeout(async function addP() {
            let a = document.getElementsByClassName("user-card")[0].getElementsByClassName("info");
            let p = document.createElement("p");
            let uid = a[0].getElementsByClassName("user")[0].getElementsByClassName("name")[0].getAttribute("href").split("/").slice(-1);
            let names = '共同关注：</br>';
            try {
                let data = await readJSON(uid);
                for (let i of data.data.list) {
                    names += i.uname + '</br>'
                }
            } catch (error) {
                names = "关注列表未开放";
            }
            p.innerHTML = names;
            a[0].appendChild(p);
        }, 1000);
    }
    var myVar = setInterval(function () { myTimer() }, 1000);
    function myTimer() {
        if (document.getElementsByClassName("user-face").length < 2) {}
        else {
            for (let i of document.querySelectorAll('.user-face, .reply-face')) {
                i.removeEventListener("mouseenter", handler)
                i.addEventListener("mouseenter", handler)
            }
        }
    }
})();