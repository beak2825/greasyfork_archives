// ==UserScript==
// @name         起点小说解锁
// @version      2.1
// @description  可解锁起点小说VIP付费章节，可点击下一页实现不翻页加载下一章
// @author       浩浩逆天
// @match        https://vipreader.qidian.com/chapter/*
// @match        https://read.qidian.com/chapter/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @grant        GM_notification
// @run-at       document-end
// @namespace https://greasyfork.org/users/811763
// @downloadURL https://update.greasyfork.org/scripts/435772/%E8%B5%B7%E7%82%B9%E5%B0%8F%E8%AF%B4%E8%A7%A3%E9%94%81.user.js
// @updateURL https://update.greasyfork.org/scripts/435772/%E8%B5%B7%E7%82%B9%E5%B0%8F%E8%AF%B4%E8%A7%A3%E9%94%81.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var { Aliaslist, maintail, clist, mainspace, nextpage } = mainFunction();

    // 对修改书名的情况，构建现书名至原书名的映射表
    function SetAliasBook() {
        return {
            "你有科学，我有神功": "我弟子明明超强却以德服人",
        };
    }

    //获取章节名
    function QDgetBookChapter(doc) {
        let head = doc.querySelector("div > div.text-head > h3 > span.content-wrap")
        if (head) {
            let res = '' + head.innerText
            res = res.replace(' ', '')
            return res
        }
        return undefined
    }

    //获取书本名
    function QDgetBookName() {
        return g_data.bookInfo.bookName
    }

    //获取书本原名
    function QDgetAliasBookName() {
        return Aliaslist[QDgetBookName()]
    }

    //获取作者
    function QDgetAuthorName() {
        return g_data.bookInfo.authorName
    }

    //设置页面阅读内容
    function QDsetContent(content) {
        let con = document.createElement("div")
        con.innerHTML = content
        con.setAttribute("class", "read-content")
        maintail.insertAdjacentHTML('beforebegin', con.outerHTML)
    }

    //将请求的url的html内容转化成document对象
    async function parseDocFromAjax(method, url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method,
                url,
                onload: (res) => {
                    let htmldoc = document.createElement('html')
                    htmldoc.innerHTML = res.response
                    resolve(htmldoc)
                },
                onerror: (err) => {
                    reject(err)
                }
            })
        })
    }

    //搜索小说并返回结果
    async function searchBook() {
        let r = await parseDocFromAjax('GET', 'http://www.wbxsw.com/search.php?q=' + QDgetBookName())
        let res = r.querySelector("body > div.result-list > div > div.result-game-item-detail ")
        if (res == null) {
            r = await parseDocFromAjax('GET', 'http://www.wbxsw.com/search.php?q=' + QDgetAliasBookName())
            res = r.querySelector("body > div.result-list > div > div.result-game-item-detail ")
        }
        let bookList = res.querySelectorAll("h3 > a")
        let authorList = res.querySelectorAll("div > p:nth-child(1) > span:nth-child(2)")
        let resList = []
        for (let i in bookList) {
            if (bookList[i].title) {
                resList.push({ bookName: bookList[i].title, author: authorList[i].innerText, url: 'http://www.wbxsw.com' + bookList[i].pathname })
            }
        }
        return resList
    }

    //获取小说目录
    async function getChapterList(bookUrl) {
        let resList = []
        let r = await parseDocFromAjax('GET', bookUrl)
        let cateList = r.querySelectorAll("#list > dl > dd > a")
        for (let i in cateList) {
            let url = '' + cateList[i].href
            url = url.replace('https://vipreader.qidian.com/', 'http://www.wbxsw.com/')
            url = url.replace('https://read.qidian.com/', 'http://www.wbxsw.com/')
            resList.push({ title: cateList[i].innerText, url: url })
        }
        return resList
    }

    //获取章节内容
    async function getContent(pageUrl) {
        const res = await parseDocFromAjax('GET', pageUrl)
        return res.querySelector("#content").innerHTML
    }

    //获取标题和下一页的document
    async function getQDtitleurl(pageUrl) {
        const res = await parseDocFromAjax('GET', pageUrl)
        return [res.querySelector("div > div.text-head"), res.querySelector("div > div.chapter-control")]
    }

    //解析页面函数
    async function prelaunch() {
        //搜索小说名字
        let r = await searchBook()
        let ii = 0
        //优先匹配名字相同的
        for (let suoyin in r) {
            if (r[suoyin].bookName == QDgetBookName() || r[suoyin].bookName == QDgetAliasBookName()) {
                ii = suoyin
                if (r[suoyin].author == QDgetAuthorName()) {
                    break
                }
            }
        }
        //获取第一项结果章节目录
        if (r[ii] == undefined) {
            alert('该小说暂无资源')
            return
        }
        clist = await getChapterList(r[ii].url)
        let QDChaptertitle = QDgetBookChapter(document)
        if (QDChaptertitle == undefined) {
            alert('抓取目录失败')
            return
        }
        //获取章节名
        for (let i in clist) {
            let tit = '' + clist[i].title
            tit = tit.replace(' ', '')
            if (tit == QDChaptertitle) {
                let content = await getContent(clist[i].url)
                mainspace = document.querySelector("div > div.main-text-wrap")
                mainspace.removeChild(mainspace.querySelector(".read-content"))
                if (maintail == null) {
                    maintail = document.querySelector(".admire-wrap")
                } else {
                    maintail.querySelector("h3").innerText = '已订阅本章付费VIP章节'
                    maintail.removeChild(maintail.querySelector("div"))
                    maintail.removeChild(maintail.querySelector("p"))
                }
                QDsetContent(content)
                console.log('写入成功')
                nextpage.idx = +i + 1;
                break
            }
        }
    }

    //点击下一页、实现不翻页加载下一章
    unsafeWindow.next = async function () {
        const content = await getContent(clist[nextpage.idx].url)
        const titleurl = await getQDtitleurl(nextpage.qdurl)
        maintail.insertAdjacentHTML('beforebegin', titleurl[0].outerHTML)
        QDsetContent(content)
        nextpage.idx += 1
        nextpage.qdurl = titleurl[1].childNodes[7].href
    };

    function mainFunction() {
        var clist = [];
        var nextpage = {
            idx: 0,
            qdurl: '',
        };
        var Aliaslist = SetAliasBook();
        var mainspace;
        var maintail = document.querySelector(".vip-limit-wrap");
        prelaunch();
        var orginele_pagina = document.getElementById('j_chapterNext');
        nextpage.qdurl = orginele_pagina.href;
        orginele_pagina.removeAttribute("href");
        orginele_pagina.setAttribute("onclick", "window.next()");
        return { Aliaslist, maintail, clist, mainspace, nextpage };
    }
})();