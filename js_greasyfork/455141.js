// ==UserScript==
// @name         『南+』 关键词屏蔽 自动无缝翻页
// @namespace    Tide
// @version      0.5
// @description  关键词屏蔽 自动无缝翻页
// @author       Tide
// @match        https://www.east-plus.net/read.php*
// @match        https://www.south-plus.net/read.php*
// @match        https://www.white-plus.net/read.php*
// @match        https://www.north-plus.net/read.php*
// @match        https://www.level-plus.net/read.php*
// @match        https://www.spring-plus.net/read.php*
// @match        https://www.summer-plus.net/read.php*
// @match        https://www.snow-plus.net/read.php*
// @match        https://bbs.imoutolove.me/read.php*
// @icon         https://www.level-plus.net/images/face/none.gif
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455141/%E3%80%8E%E5%8D%97%2B%E3%80%8F%20%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD%20%E8%87%AA%E5%8A%A8%E6%97%A0%E7%BC%9D%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/455141/%E3%80%8E%E5%8D%97%2B%E3%80%8F%20%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD%20%E8%87%AA%E5%8A%A8%E6%97%A0%E7%BC%9D%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    function loadNextPage(url) {
        loadMsg.innerHTML = "正在加载下一页..."
        var xhr = new XMLHttpRequest();
        xhr.responseType = "document";
        xhr.onload = function () {
            var nextPage = xhr.response;
            var content = nextPage.querySelector("div > form").querySelectorAll("div.t5.t2");
            for (let i = 0; i < content.length; i++) {
                document.querySelector("div > form").appendChild(content[i])
            }
            block(keywords);
            pageNum++;
            loadMsg.innerHTML = "当前已加载到第" + pageNum + "页"
            sw = true;
        }
        xhr.onerror = function () {
            console.log("发生错误")
            console.log(xhr.readyState);
            console.log(xhr.response);
            console.log(xhr.responseUrl, xhr.state);
        }
        xhr.open("GET", url, true);
        xhr.send();
    }

    function isEmoji(replyContent) {
        if (replyContent.innerText.trim() === "") {
            var replyImgList = replyContent.querySelectorAll("img")
            for (let i = 0; i < replyImgList.length; i++) {
                if (replyImgList[i].src.search("/images/post/") === -1) {
                    return false
                }
            return true
            }
        }
    }

    function block(keywords) {
        var allReply = document.querySelectorAll("div.t2.t5");
        var i = 0;
        if (getCurrentPageNum() === 1) {
            i = 1
        }
        for (i; i < allReply.length; i++) {
            let reply = allReply[i].querySelector("div.f14")

            if (isEmoji(reply)) {
                allReply[i].remove();
            }

            for (var j = 0; j < keywords.length; j++) {
                //console.log(reply.innerText.trim())
                if (reply.innerText.trim() === keywords[j]) {
                    allReply[i].remove();
                }
            }
        }
    }



    function getPageCount() {
        var pageShow = document.querySelector(".pagesone");
        if (pageShow !== null) {
            var pageStr = pageShow.innerText.match(/\/+\d+/);
            var pageCount= +pageStr.join('').slice(1,);
            return pageCount;
        } else {
            return 1;
        }
    }

    function getCurrentPageNum() {
        let pageInfo = document.querySelector(".pagesone");
        if (pageInfo !== null) {
            let pageNum = pageInfo.innerText.match(/\d+/g);
            return parseInt(pageNum[0]);
        } else {
            return 1;
        }
    }


    function generateUrl(pageNum) {
        let link = window.location.href
        let tid = link.match(/\d+/g)[0]
        let url = "https://" + document.domain + "/read.php?tid=" + tid + "&page=" + pageNum
        console.log(url)
        return url
    }


    var loadMsg = document.createElement("p")
    loadMsg.style = "text-align: center;"
    loadMsg.id = "breadcrumbs";
    document.querySelector("#main > form:nth-child(13)").insertAdjacentElement("Afterend", loadMsg);


    var keywords = ["mark","MARK","Mark", "马克", "马克一下", "马", "插眼", "等大佬", "马可", "顶", "make", "mark!", "mark!!", "mark!!!", "markmark", "mmm", "mark！", "mark！！", "mark！！！", "马克！", "马克马克"]
    block(keywords);

    function currentScrollPercentage() {
        return ((document.documentElement.scrollTop + document.body.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight) * 100)
    }

    var pageNum = getCurrentPageNum();

    function main() {
            if (pageNum < getPageCount()) {
                let url = generateUrl(pageNum + 1)
                loadNextPage(url);
            } else {
                loadMsg.innerHTML = "已经到底了"
            }
    }

    window.addEventListener("scroll", Throttler);

    var sw = true;

    function Throttler() {
        if (currentScrollPercentage() > 80) {
            if (sw) {
                console.log("run!")
                main()
                sw = false;
            }
        }
    }
    

})();