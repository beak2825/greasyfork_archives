// ==UserScript==
// @name         煎蛋瀑布流+评论
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  for me
// @author       silvio27
// @match        *://jandan.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jandan.net
// @grant        GM_xmlhttpRequest
// @license      GPLv3


// @downloadURL https://update.greasyfork.org/scripts/457813/%E7%85%8E%E8%9B%8B%E7%80%91%E5%B8%83%E6%B5%81%2B%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/457813/%E7%85%8E%E8%9B%8B%E7%80%91%E5%B8%83%E6%B5%81%2B%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==


(function () {
    console.warn("\t\t\t\t in localscript1")


    // 移除adsbygoogle.js
    // TODO 是否需要提取函数？再议
    let items = document.querySelectorAll("script")
    items.forEach(e => {
        if (e.src.includes("adsbygoogle.js")) {
            e.remove()
        }
    })

    function removeItem(item) {
        let items = document.querySelectorAll(item)
        items.forEach(e => e.remove())
    }

    function moveItem(item) {
        let items = document.querySelectorAll(item)
        items.forEach(e => document.body.insertBefore(e, document.body.firstChild))
    }

    setTimeout(() => {
        removeItem("ins")
        removeItem("iframe")
        removeItem("#google_esf")
    }, 1000)


    moveItem(".cp-pagenavi")
    moveItem("#header")
    moveItem("#nav_prev")

    //获得comments 返回一个list
    function getComments(commentsId) {
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://jandan.net/api/tucao/list/${commentsId}`,
                headers: {
                    "Content-Type": "application/json"
                },
                onload: function (response) {
                    let abc = []
                    let data = JSON.parse(response.response)
                    for (let i of data.tucao) {
                        abc.push(i.comment_content)
                    }
                    resolve(abc)
                }
            });
        })
    }

    function addPicAutoMove(item) {
        item.addEventListener("click", e => {
            window.scrollTo(0, e.target.offsetTop)
        }, false)
    }

    async function main() {
        let data = ""
        let picAndComments = document.querySelectorAll("ol li")
        // 获得大图url和评论
        for (const li of picAndComments) {
            let pics = li.querySelectorAll("p a")
            pics.forEach(e => {
                data += `<img src=${e.href} style="display: inline;padding: 10px;width:80%;">`
            })
            let tucao = li.getElementsByClassName("tucao-btn")
            for (let i of tucao) {
                if (!i.innerText.includes("吐槽 [0]")) {
                    let commentId = i.dataset.id
                    // TODO 一个异步获取评论，其实可以先生成DOM，然后找到对应的id再插入评论
                    let comments = await getComments(commentId); /* forEach是一个函数，不能放在函数的函数中 */
                    for (let c of comments) {
                        data += `<p style="text-align: left;width: 80%;padding-left: 10%;">${c}</p>`
                    }
                }
            }
        }

        let item = document.createElement("div")
        item.innerHTML = data
        document.body.insertBefore(item, document.body.childNodes[3])

        //移除原始页面
        removeItem("#wrapper")


        let imgs = document.querySelectorAll("img")
        imgs.forEach(e => addPicAutoMove(e))

        //移除加载失败的图片
        removeItem("img[src='javascript:;']")

        // 将翻页tab文字变大
        let pageNavi = document.querySelectorAll(".cp-pagenavi")
        pageNavi.forEach(e => {
            e.style.fontSize = "xx-large"
            e.style.paddingBottom = "50px"
        })

        // 调整上一页按钮大小
        let nextTab = document.querySelector("#nav_prev a")
        nextTab.style.marginLeft = "90%"
        nextTab.style.top = "70%"
        nextTab.style.width = "10%"
        nextTab.style.zIndex = "999"

    }

    main();


})();