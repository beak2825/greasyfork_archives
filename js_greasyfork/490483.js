// ==UserScript==
// @name        海角社区黑名单
// @namespace   Violentmonkey Scripts
// @match       https://haijiao.com/*
// @match       https://hj*.*/*
// @grant       none
// @version     0.0.2
// @author      YYSSLL
// @license     GPL-3.0-or-later
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @description 海角社区黑名单系统屏蔽不喜欢的作者
// @downloadURL https://update.greasyfork.org/scripts/490483/%E6%B5%B7%E8%A7%92%E7%A4%BE%E5%8C%BA%E9%BB%91%E5%90%8D%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/490483/%E6%B5%B7%E8%A7%92%E7%A4%BE%E5%8C%BA%E9%BB%91%E5%90%8D%E5%8D%95.meta.js
// ==/UserScript==



(function () {
    'use strict';

    console.log("开始运行黑名单系统")
    const iconOut = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8BAMAAADI0sRBAAAAHlBMVEVHcEzV1dXY2NjZ2dna2trY2NjX19fZ2dnX19fY2Njh5OoZAAAACXRSTlMAMO/vMJdgXiAyZE3cAAAAqUlEQVQ4y+3UMRKDIBAFUJzRxDLDDVLac4Acwc4T2Nuk5wym4rYB1sWC/zkBW+24Pga+jMb06gXq67Ubt3r6CE5bG45qPIXfR7phCWs1jg+d4tPXq9uLx/feYGvKI36hrQsnWDnDwikWznHmHGfewIk3cB4701xck4f4XDhPZ7acpzMPlEtglEtgjGvahGvamM8lbcinkja8is87bXSRzV4+1bz1n0IvVH+2gTclx+L2cQAAAABJRU5ErkJggg==) no-repeat 50%"
    const iconOver = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8BAMAAADI0sRBAAAAG1BMVEVHcEzvQEDwQUHwQUHxQEHxQELvQUHvQEDwQUJ81f6CAAAACHRSTlMAMO/vX5+QIH0cREEAAACNSURBVDjLY2AYBaMAC3ArgLEYQzBlWToMYUzhDgcMadaOZgGoZouOBAxpoKAhTHNzAabpwlDtCHVYtQvDbcGmHYdmmAQuzRAZnJoh2nFrBmvHrRmsHY9mkHY8mglJEzAcv9MIeAx/sBAIVPxRQiBC8ScHduTEhKmdDTkpBpCakBlc4Sayp4wWCqMAGwAA1UYyEwpcChIAAAAASUVORK5CYII=)"

    // 获取黑名单列表
    let blacklist = GM_getValue("blacklist")
    // console.log(blacklist)

    // 声明一个对象不同页面需要的不同选择器  作者（选择作者昵称）  描述（选择作品的标题描述）  祖父（选择祖父方便屏蔽）  写入标题（是否用标题来储存值）  删除（是否直接删除祖父元素）
    let selector = { author: "", describe: "", grandfather: "", writeTitle: false, remove: false }


    // 创建一个不喜欢按钮
    function createDislikeButton() {
        // 添加一个屏蔽按钮
        let div = document.createElement('div')
        div.style.display = "inline-block"
        div.style.width = "20px"
        div.style.height = "20px"
        div.style.background = iconOut
        div.style.backgroundSize = "contain"
        div.style.cursor = "pointer"
        div.classList.add("dislikeIcon")

        // 鼠标移入事件
        div.onmouseover = function () {
            div.style.background = iconOver
            div.style.backgroundSize = "contain"
        }
        // 鼠标移出事件
        div.onmouseout = function () {
            div.style.background = iconOut
            div.style.backgroundSize = "contain"
        }

        return div
    }




    // 每个元素都要执行的操作的回调函数
    function checkNode(element) {
        // 兼容性补充，没有标题就用内容来替换
        if (selector.writeTitle) {
            element.title = element.innerText
        }
        // 兼容性补充，添加一个类方便选择
        element.classList.add("author")


        // 得到这行的祖宗方便删除
        let li = element.parentNode.parentNode.parentNode.parentNode
        // 得到这个作品的标题描述
        let describe = li.querySelector(selector.describe)
        // console.log("取到值")
        if (selector.writeTitle) {
            // 兼容性补充，没有标题就用内容来替换
            describe.title = describe.innerText
        }


        // 非直接删除的先恢复显示，后期再优化通过添加自定义类去屏蔽
        if (!selector.remove) {
            li.style.display = "block"
        }

        // 判断一个数组是否包含一个指定的值
        if (blacklist.includes(element.title)) {
            console.log("已屏蔽 [ " + element.title + " ] " + describe.title)
            // 是否直接删除
            if (selector.remove) {
                li.remove()
            } else {
                li.style.display = "none"
            }
            return
        }

        // 创建不喜欢按钮
        let div = createDislikeButton()
        div.addEventListener("click", function () {

            if (confirm("确定要屏蔽昵称 [ " + element.title + " ] 的全部作品吗？")) {

                console.log("新加黑 [ " + element.title + " ]")
                blacklist.push(element.title)
                GM_setValue("blacklist", blacklist)
                // 是否直接删除
                if (selector.remove) {
                    li.remove()
                } else {
                    li.style.display = "none"
                }
                return
            }
        })


        // 没有才追加
        if (!li.querySelector(".dislikeIcon")) {
            // 追加一个不喜欢按钮
            li.querySelector(selector.grandfather).appendChild(div)
        }

    }



    // 核心工作函数，返回当前所在网页是否是支持加黑的页面，如果不支持就返回 false
    function work() {

        if (window.location.href.indexOf("/home") > -1) {
            // 当前在首页
            selector.author = "i+.hjbox-linkcolor"
            selector.describe = "h4>span"
            selector.grandfather = ".d-flex.justify-content-between"
            selector.writeTitle = false
            selector.remove = true
        } else if (window.location.href.indexOf("/es?key=") > -1) {
            // 当前在搜索页
            selector.author = "i+.hjbox-linkline"
            selector.describe = "h4>div"
            selector.grandfather = ".show_list_info"
            selector.writeTitle = true
            selector.remove = false
        } else {
            // 不在这两个位置自然没有执行的必要
            console.log("不受支持的页面已停止运行")
            return
        }


        // 设置一个定时器
        let id = setInterval(function () {
            // 得到一堆作者昵称
            let nicknames = document.querySelectorAll(selector.author)

            // 如果找到元素就清除定时器
            if (nicknames.length > 0) {
                clearInterval(id) // 清除定时器

                // 对数组的每个元素执行一次给定的函数
                nicknames.forEach(checkNode)
            }
        }, 1000)

    }




    // 主函数
    function main() {

        // 选择要观察的元素列表
        let targetNode = document.documentElement

        let observerOptions = {
            childList: true, // 观察目标子节点的变化，是否有添加或者删除
            // attributes: true, // 观察属性变动
            subtree: true, // 观察后代节点，默认为 false
        };
        // 实例化一个观察器
        let observer = new MutationObserver(function (mutationsList, observer) {
            // 元素变化
            console.log("页面变化了重新执行")
            work()
        });
        // 开始观察目标节点
        observer.observe(targetNode, observerOptions);


        // 页面加载成功执行一次
        work()

    }

    main();

})();








