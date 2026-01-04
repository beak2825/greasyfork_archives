// ==UserScript==
// @name         zhangzs+
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  get detail pic from every item
// @author       Sivlio27
// @match        https://www.zhangzs.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhangzs.com
// @grant        GM_xmlhttpRequest
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/459672/zhangzs%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/459672/zhangzs%2B.meta.js
// ==/UserScript==

function setData1(abc) {
    document.body.insertBefore(abc, document.getElementById("wrap"))
}

function getDataInBackground(url) {
    let getData = GM_xmlhttpRequest({
        url: url,
        // url:"https:www.taobao.com",
        method: "GET",
        headers: {
            "Content-Type": "text/html",
            // "cookies": document.cookie
        },
        onload: function (res) {
            let domparser = new DOMParser()
            let doc = domparser.parseFromString(res.response, "text/html")
            let data = doc.body.getElementsByClassName("entry")[0]
            let img = data.getElementsByClassName("j-lazy")
            for (let i of img) {
                i.src = i.getAttribute("data-original")
            }
            data.style.width = "70%"
            // data.style.display = "inline-block"
            data.style.margin = "0px auto"
            data.style.paddingBottom = "20px"
            data.style.marginBottom = "20px"
            data.style.borderBottom = "5px dashed grey"
            setData1(data)
        }
    })

}


(function () {
    'use strict';
    console.warn("code loaded")

    let btn = document.getElementsByClassName("j-load-more")[0]
    btn.click()

    setTimeout(() => {
        let items = document.querySelectorAll(".item-title > a")
        let b = [...items]

        for (let i = 1; i < b.length; i++) {
            getDataInBackground(b[i])
        }

        for (let i of document.getElementsByClassName("item")) {
            i.style.display = "none"
        }
    }, 500)


})();