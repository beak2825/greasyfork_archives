// ==UserScript==
// @name         FB 預設使用所有留言
// @namespace    http://tampermonkey.net/
// @version      2.94
// @description  FB 預設開啟所有留言
// @description:zh-tw  FB 預設開啟所有留言
// @author       You
// @match        https://www.facebook.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=facebook.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448538/FB%20%E9%A0%90%E8%A8%AD%E4%BD%BF%E7%94%A8%E6%89%80%E6%9C%89%E7%95%99%E8%A8%80.user.js
// @updateURL https://update.greasyfork.org/scripts/448538/FB%20%E9%A0%90%E8%A8%AD%E4%BD%BF%E7%94%A8%E6%89%80%E6%9C%89%E7%95%99%E8%A8%80.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log("FB 預設開啟所有留言 開始作業")

    //this line is show the possible menu text, you can change to your language
    var checker1 = ["與星星一同傳送的留言", "即時留言", "最舊", "最相關", "最熱門留言", "最新"]

    //this line is show the possible menu text's under explain, you can change to your language
    var checker2 = ["顯示所有留言，從舊到新排序。", "留言出現在影片中的時候便會同步顯示。", "顯示所有留言，最舊的留言會顯示在最上方。", "顯示所有留言，包括可能是垃圾訊息的內容。", "顯示所有留言，包括可能是垃圾訊息的內容。最相關的留言會顯示在最上方。", "依時間順序顯示所有留言，包括可能是垃圾訊息的留言。","Show all comments, including potential spam."]

    //this line is show the possible menu text's under explain, you can change to your language
    var checker3 = ["顯示先前的留言", "檢視另", "查看"]

    //All messages
    var allMessage1 = ["所有留言","All comments"]

    //All messages are displayed with the latest message at the top.
    var allMessage2 = ["顯示所有留言，且最新的留言顯示在最上方。","Show all comments, including potential spam."]


    async function onMyEnter(event) {
        lastClickText="";
    }

    function allow(){
        return lastClickText=="最相關" || lastClickText=="最新動態" || lastClickText=="新貼文" || lastClickText==undefined;
    }
    var lastClickText="";
    async function onMyClick(event) {
        console.log(event.srcElement.innerText);
        lastClickText=event.srcElement.innerText;
        if(allow()) return;
        for (let t = 0; t < 2; t++) {
            console.log("click")
            let a, b
            let has = false
            let originAll = false
            await new Promise(r => setTimeout(r, 50));
            if(allow()) return;
            let timeOut = 0;
            let article = []
            while (!has) {
                a = document.querySelectorAll("i[data-visualcompletion]")
                let top = window.scrollTop
                for (let i = 0; i < a.length; i++) {
                    b = a[i];
                    if (b == null) continue;
                    if (b.getAttribute("fb_doac") == "true") {
                        //console.log("jump")
                        continue;
                    }
                    b.setAttribute("fb_doac", true);
                    b = b.parentElement.parentElement.parentElement;
                    if (getInnerDepth(b) > 5) continue;
                    let text = b.innerText
                    let isChecked = ckeck1(text, checker1)
                    let isNull = b.querySelector("[data-ad-preview]") == null && b.closest("[data-ad-preview]") == null
                    if (isChecked && isNull) {
                        b.click()
                        window.scrollTop = top
                        //b.innerText="-"+b.innerText
                        has = true
                        console.log("發現 所有留言的存在")
                    }
                    for (let iAll = 0; iAll < allMessage1.length; iAll++) {
                        if (text.indexOf(allMessage1[iAll]) != -1) {
                            has = true
                            break
                        }
                    }
                }
                await new Promise(r => setTimeout(r, 50));
                if(allow()) return;
                timeOut += 50
                if (timeOut > 5000) return;
            }
            if (!has) return
            //console.log(article)

            timeOut = 0

            let second = []
            while (has) {
                a = document.querySelectorAll("span:not([fb_doac]), div:not([fb_doac])")
                let top = window.scrollTop
                for (let i = 0; i < a.length; i++) {
                    b = a[i];
                    if (getInnerDepth(b) > 3) continue;
                    let text = b.innerText
                    let isChecked = ckeck1(text, checker2)
                    let isNull = b.querySelector("[data-ad-preview]") == null && b.closest("[data-ad-preview]") == null

                    let isAll2=false;
                    for (let iAll = 0; iAll < allMessage2.length; iAll++) {
                        if (text.indexOf(allMessage2[iAll]) != -1) {
                            isAll2 = true
                            break
                        }
                    }

                    if (isChecked && isNull) {
                        //console.log(b)
                        b.click()
                        window.scrollTop = top
                        //b.innerText="-"+b.innerText
                        //console.log("自動按所有留言")
                        has = false
                    }
                    else if (second == null &&isAll2 && isNull) {
                        second.push(b)
                    }
                }
                await new Promise(r => setTimeout(r, 100));
                if(allow()) return;
                timeOut += 50
                if (has && timeOut > 1000) {
                    if (second.length > 0) {
                        second.foreach(x => x.click())
                        window.scrollTop = top
                        has = false
                    }
                }
            }
            await new Promise(r => setTimeout(r, 50));
            if(allow()) return;

            timeOut = 0
            has = false
            while (!has) {
                let top = window.scrollTop
                for (let i = 0; i < article.length; i++) {
                    let item = article[i]
                    let c = item.querySelectorAll("span:not([fb_doac]), div:not([fb_doac])")
                    for (let j = 0; j < c.length; j++) {
                        b = c[j]
                        if (getInnerDepth(b) > 3) continue
                        let text = b.innerText
                        let isChecked = ckeck1(text, checker3)
                        //this line is show the possible menu text's under explain, you can change to your language
                        if (isChecked) {
                            b.click()
                            window.scrollTop = top
                            has = true
                        }
                    }
                }

                await new Promise(r => setTimeout(r, 50))
                if(allow()) return;
                timeOut += 100
                if (timeOut > 5000) break
            }
            await new Promise(r => setTimeout(r, 50))
            if(allow()) return;
        }
        //console.log("完成任務")
    }
    document.body.addEventListener('mousedown', onMyClick)
    document.body.addEventListener('mouseup', onMyEnter)

    function getInnerDepth(node, max = 10, now = 1) {
        if (now >= max) {
            return max
        }
        if (node.children.length) {
            let mm = 0
            for (let i = 0; i < node.children.length; i++) {
                let n = node.children[i]
                if (now + 1 >= max) return max
                let x = getInnerDepth(n, max, now + 1);
                if (x > mm) { mm = x }
                if (mm >= max) {
                    return max
                }
            }
            return 1 + mm;
        } else {
            return 1;
        }
    }
    var dic = {}
    function ckeck1(text, checker) {
        if (dic.hasOwnProperty(text)) {
            return dic[text]
        }
        for (let x = 0; x < checker.length; x++) {
            if (text.startsWith(checker[x])) {
                dic[text] = true
                return true
            }
        }
        dic[text] = false
        return false
    }
    function ckeck2(text, checker) {
        let isChecked = false
        for (let x = 0; x < checker.length; x++) {
            if (text.indexOf(checker[x]) != -1) {
                isChecked = true
                break
            }
        }
        return isChecked
    }
}
)();