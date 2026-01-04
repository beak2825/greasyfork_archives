// ==UserScript==
// @name         huPuTopicZone
// @version      1.1.3
// @description  这是一个为虎扑崩版编写的脚本，主要为了网页端的各个分区
// @author       孤独的海浪
// @match        https://*.hupu.com/*
// @icon         https://i1.hoopchina.com.cn/newsPost/22621-2u62scrc-upload-1655706446630-7.png?x-oss-process=image/resize,m_fill,w_72,h_72
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @connect      hupu.com
// @license      MIT
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/459452/huPuTopicZone.user.js
// @updateURL https://update.greasyfork.org/scripts/459452/huPuTopicZone.meta.js
// ==/UserScript==

// 用来让虎扑网页查看剧场帖子的脚本

// 创建 HTML 结构
// 获取并创建各个子分区的内容
function createHTML(topicId, zoneId, page = 1) {
    // 将title回复/浏览改为 回复/推荐
    let titleSelector = document.querySelector("#container > div > div.bbs-sl-web-holder > div > div.bbs-sl-web-topic-wrap > div.bbs-sl-web-post > div > div:nth-child(2)")
    titleSelector.innerText = "回复/推荐"
    let url = `https://bbs.mobileapi.hupu.com/1/8.0.34/topics/getTopicThreads?topic_id=${topicId}&tab_type=2&page=${page}&zoneId=${zoneId}`
    let list_tmp = ""

    getURL_GM(url).then(
        (result) => {
            result = JSON.parse(result)
            let data = result.data.list
            let hasNextPage = result.data.next_page
            for (let each_data of data) {
                let tid = each_data.tid
                let post_time = each_data.time
                let title = each_data.title
                let replies = each_data.replys
                let recommends = each_data.recommends
                let userName = each_data.user_name

                list_tmp += `
                    <li class="bbs-sl-web-post-body">
                        <div class="bbs-sl-web-post-layout">
                            <div class="post-title">
                                <a href="/${tid}.html" target="_blank" class="p-title" style="color:;font-style:normal">${title}</a>
                            </div>
                            <div class="post-datum">${replies}/${recommends}</div>
                            <div class="post-auth">
                                <a href="https://my.hupu.com/">${userName}</a>
                            </div>
                            <div class="post-time">${post_time}</div>
                        </div>
                    </li>`
            }
            let logo = document.querySelector("#container > div > div.bbs-sl-web-holder > div > div.bbs-sl-web-topic-wrap > div.bbs-sl-web-post > ul")
            logo.innerHTML = list_tmp

            // 创建翻页标签
            createPageBar(topicId, zoneId, page, hasNextPage)
        }
    )
}


// 分页
function createPageBar(topicId, zoneId, curPage, hasNextPage) {
    let pageBar = `
        <li class="hupu-rc-pagination-item hupu-rc-pagination-item-active">
            <a id="curPage">${curPage}</a>
        </li>`

    let prePageBar = `
        <li class="hupu-rc-pagination-prev">
            <div class="iconContainer_2ZI3F ">
                <i class="iconfont iconxialax icon_1Q115 leftIcon_Wccrv" id="prePage"></i>
                <span class="text_MtRno" id="prePage">上一页</span>
            </div>
        </li>`

    let nextPageBar = `
        <li class="hupu-rc-pagination-next">
            <div class="iconContainer_2ZI3F">
                <span class="text_MtRno" id="nextPage">下一页</span>
                <i class="iconfont iconxialax icon_1Q115 rightIcon_11DFD" id="nextPage"></i>
            </div>
        </li>
        `
    if (hasNextPage) {
        pageBar += nextPageBar
    }
    if (curPage != 1) {
        pageBar = prePageBar + pageBar
    }
    let pageSelector = document.querySelector("#container > div > div.bbs-sl-web-holder > div > div.bbs-sl-web-topic-wrap > div:nth-child(5) > div > ul")
    pageSelector.innerHTML = pageBar

    pageSelector.onclick = function (event) {
        let pageId = event.target.id
        let page = curPage
        if (pageId == "curPage") {
            page = curPage
        } else if (pageId == "nextPage") {
            page = curPage + 1
        } else if (pageId == "prePage") {
            page = curPage - 1
        } else {
            return
        }
        createHTML(topicId, zoneId, page)
        //返回页面顶部
        let topBtn = document.querySelector("#container > div > section.hp-pc-footer > div.backToTop_2mZa6 > div:nth-child(3) > a")
        topBtn.click()
    }
}


// 创建子分区
function createZone(topicId) {
    let zoneUrl = "https://bbs.hupu.com/pcmapi/pc/bbs/v1/topicZone?topicId=" + topicId
    // 加上本身的分区id，用来区分不同的板块
    let oldSelectZoneId = GM_getValue("clickZoneId" + topicId)
    let unSelectZoneArray = GM_getValue("unselectZoneArray" + topicId, [])
    let zoneDict = {}

    getURL_GM(zoneUrl).then(
        (result) => {
            result = JSON.parse(result)
            let zone_list = result.data
            let cur_div = ""
            for (let each_zone of zone_list) {
                let zoneId = each_zone.id
                zoneId = zoneId ? String(zoneId) : zoneId
                let checked = "checked"
                if (unSelectZoneArray.includes(zoneId)) {
                    checked = ""
                }
                let zoneName = each_zone.zoneName
                zoneDict[zoneId] = zoneName
                cur_div += `<input type="checkbox" name="zoneSelect" value="${zoneId}" ${checked}><div class="bbs-sl-web-type " value="${zoneId}">${zoneName}</div>`
            }
            let tf = document.querySelector("#container > div > div.bbs-sl-web-holder > div > div.bbs-sl-web-topic-wrap > div.bbs-sl-web-type-wrap")
            tf.innerHTML += cur_div
            tf.onchange = function (event) {
                if (event.type != "change") {
                    return
                }
                let oldSelectZoneId = GM_getValue("clickZoneId" + topicId)

                let selectZoneId = event.target.getAttribute("value")
                selectZoneId = selectZoneId ? String(selectZoneId) : selectZoneId
                if (event.target.checked && unSelectZoneArray.includes(selectZoneId)) {
                    unSelectZoneArray = unSelectZoneArray.filter((x) => x !== selectZoneId)
                }
                if (!event.target.checked && !unSelectZoneArray.includes(selectZoneId)) {
                    unSelectZoneArray.push(selectZoneId)
                }
                GM_setValue("unselectZoneArray" + topicId, unSelectZoneArray)
                // 重新加载该页面
                if (!oldSelectZoneId) window.location.reload()
            }

            tf.onclick = function (event) {
                if (event.type != "click" || !event.target.className.includes("bbs-sl-web-type") || event.target.className.includes("bbs-sl-web-type-wrap")) {
                    return
                }

                let zoneName = event.target.innerText
                let clickZoneId = event.target.getAttribute("value")

                clickZoneId = clickZoneId ? String(clickZoneId) : clickZoneId

                if (clickZoneId) {
                    // 重置选中元素
                    let selector = document.querySelectorAll(`.bbs-sl-web-type`)

                    for (var i = 0; i < selector.length; i++) {
                        if (selector[i].innerText == zoneName) {
                            selector[i].classList.add("active");
                        } else {
                            selector[i].classList.remove("active");
                        }
                    }

                    // 当选中添加的标签时，记住该标签，以便于初始化时直接跳转到该标签
                    GM_setValue("clickZoneId" + topicId, clickZoneId)
                    createHTML(topicId, clickZoneId, 1)

                } else {
                    GM_deleteValue("clickZoneId" + topicId)
                    let href = ""
                    if (zoneName == "最新发布") {
                        href = topicId + "-postdate"
                    } else if (zoneName == "最新回复"){
                        href = topicId
                    } else if (zoneName == "24小时榜") {
                        href = topicId + "-hot"
                    }
                    window.location.href = "https://bbs.hupu.com/" + href
                }
            };
            if (oldSelectZoneId) {
                let selector = document.querySelectorAll(`.bbs-sl-web-type`)

                for (var i = 0; i < selector.length; i++) {
                    if (selector[i].getAttribute("value") == oldSelectZoneId) {
                        selector[i].click();
                        return
                    }
                }
            } else htmlReload(unSelectZoneArray, zoneDict)
        }
    )

}


function htmlReload(unSelectZoneArray, zoneDict) {

    let selector = document.querySelectorAll(`.bbs-sl-web-post-body`)
    let ul = ""
    for (let i = 0; i < selector.length; i++) {

        let postTitle = selector[i].querySelector(".post-title").innerText
        let unSelect = false
        for (let unSelectZone of unSelectZoneArray) {
            let unSelectZoneName = zoneDict[unSelectZone]
            if (postTitle.includes(unSelectZoneName + " | ")) {
                unSelect = true
                break
            }
        }
        if (!unSelect) {
            ul += selector[i].outerHTML
        }
    }
    let postList = document.querySelector(`#container > div > div.bbs-sl-web-holder > div > div.bbs-sl-web-topic-wrap > div.bbs-sl-web-post > ul`)
    postList.innerHTML = ul
}


function imResource() {
    let script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.src = "https://cdn.staticfile.org/twitter-bootstrap/5.1.1/js/bootstrap.bundle.min.js";
    document.documentElement.appendChild(script);

    let cssLink = document.createElement('link');
    cssLink.setAttribute('rel', 'stylesheet');
    cssLink.setAttribute('type', 'text/css');
    cssLink.href = "https://cdn.staticfile.org/twitter-bootstrap/5.1.1/css/bootstrap.min.css";
    document.documentElement.appendChild(cssLink);
}


// 同步emoji，未实现
function createEmoji() {
    // imResource()
    // 在评论框旁边添加同步emoji的按钮，并展开以供选择，选择后填入评论框中文字后
    // todo 用户的sign不知道怎么算的，无法实现该功能
    //let btn = document.createElement("button")
    //btn.classList = ["btn btn-primary"]
    //btn.setAttribute("data-bs-toggle", "popover")
    //btn.setAttribute("title", "aaaa")
    //btn.setAttribute("data-bs-content", "bbbbb")
    //btn.innerText = "表情"

    //let container = document.createElement("div")
    //container.classList = ["container"]
    //container.appendChild(btn)

    //let replySelector = document.querySelector("#hupu-compact-editor")
    //replySelector.parentElement.insertBefore(container, replySelector)

    let top_gif = `https://bbs.mobileapi.hupu.com/1/8.0.34/bbsreplyapi/user/emoji/v1/emojiTab`

    let user_gif = `https://bbs.mobileapi.hupu.com/1/8.0.34/bbsreplyapi/user/emoji/v1/getUserEmojiCollectList`

    console.log("emoji同步未实现！")
}


(function () {
    let href = window.location.href
    let hrefArray = href.split("/")
    // 只对形如https://bbs.hupu.com/788的地址加载该脚本
    if (hrefArray.length - 1 > 3) {
        return
    }
    // 默认取第三个值作为topicId
    let hrefTail = hrefArray[3]
    if (!isNaN(Number(hrefTail, 10))) {
        let topicId = hrefTail
        createZone(topicId)
    } else if (hrefTail.includes("-") && !hrefTail.includes("html")) {
        let paramUrl = "%2F" + hrefTail
        let navUrl = `https://bbs.hupu.com/api/v2/nav?url=` + paramUrl

        getURL_GM(navUrl).then(
            (result) => {
                result = JSON.parse(result)
                let topicId = result.data.anchor.id
                createZone(topicId)
            }
        )
    }
    // 只有在帖子内才会加载emoji
    if (hrefTail.includes("html")) {
        console.log("load btn resource")
        createEmoji()
    }
})();


//实现接口请求的通用方法
function getURL_GM(url) {
    return new Promise(resolve => GM.xmlHttpRequest({
        method: 'GET',
        url: url,
        onload: function (response) {
            if (response.status >= 200 && response.status < 400) {
                resolve(response.responseText);
            } else {
                console.error(`Error getting ${url}:`, response.status, response.statusText, response.responseText);
                resolve();
            }
        },
        onerror: function (response) {
            console.error(`Error during GM.xmlHttpRequest to ${url}:`, response.statusText);
            resolve();
        }
    }));
}