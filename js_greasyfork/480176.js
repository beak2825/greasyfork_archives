// ==UserScript==
// @name         v2ex+
// @namespace    http://tampermonkey.net/
// @version      0.19
// @description  auto load item detail when mouseover title
// @author       Silvio27
// @match        https://*.v2ex.com/*
// @match        https://v2ex.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=v2ex.com
// @license      GPLv3
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand

// @downloadURL https://update.greasyfork.org/scripts/480176/v2ex%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/480176/v2ex%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("script")
    topics_node_page(true, true, true, 600)
    member_replies_page(true, false, false, 0)
    linksToImgs()


    const menu_command_id = GM_registerMenuCommand("加载页面全部内容", function () {
        document.querySelectorAll(".triangle").forEach(e => {setTimeout(e.click(), 500)})
    }, "a");


    function topics_node_page(show_topic, show_fav_btn, show_reply, defaultHeight) {
        let topics
        if (document.getElementById("TopicsNode")) {
            // alert("TopicsNode")
            topics = document.querySelectorAll("#TopicsNode>.cell")
        } else {
            // alert("No TopicsNode")
            topics = document.querySelectorAll(".cell.item")
        }
        topics.forEach((element, index) => {
            let new_item = create_item("td", element.querySelector("tr"), element.querySelector("tr").lastElementChild,
                                       '▼', "triangle", 30)
            // 修改cursor_style
            cursor_style(new_item)
            new_item.onclick = function () {
                let url = element.querySelector(".topic-link").href
                let id = url.replace("https://www.v2ex.com/t/", "").split("#")[0] + "_topic"
                load_item_change_btn(element, id, url, new_item, show_topic, show_fav_btn, show_reply, defaultHeight)

            }

        })
    }

    function member_replies_page(show_topic, show_fav_btn, show_reply, defaultHeight) {
        let dock_areas = document.querySelectorAll(".dock_area")
        dock_areas.forEach((element, index) => {
            // 创建新的列
            let new_item = create_item("span", element.querySelector("td"), "",
                                       '▼', "triangle", 30)
            cursor_style(new_item)
            new_item.onclick = function () {
                let url = element.querySelectorAll("a")[2].href
                let id = url.replace("https://www.v2ex.com/t/", "").split("#")[0] + "_reply"
                load_item_change_btn(element, id, url, new_item, show_topic, show_fav_btn, show_reply, defaultHeight)
            }
        })
    }

    function load_item_change_btn(element, id, url, btn, show_topic, show_fav_btn, show_reply, defaultHeight) {
        let content = document.getElementById(id)
        if (content) {
            if (content.style.display === "none") {
                content.style.display = "block"
                btn.innerText = "▲"
            } else {
                content.style.display = "none"
                btn.innerText = "▼"
            }
        } else {
            btn.innerText = "加载中"
            document.body.style.cursor = "wait";
            btn.className = "content-loaded"
            load_item_topic_favBtn_reply(element, url, id, btn, show_topic, show_fav_btn, show_reply, defaultHeight)

        }
    }

    function load_item_topic_favBtn_reply(target_ele, url, id, load_btn, show_topic, show_fav_btn, show_reply, defaultHeight) {
        // 创建一个临时容器元素来容纳加载的内容
        const tempContainer = document.createElement('div');
        // 使用Ajax异步加载下一页的内容
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = function () {
            if (xhr.status === 200) {
                tempContainer.innerHTML = xhr.responseText
                // 创建返回的内容元素
                let contents = document.createElement('div')
                contents.id = id
                contents.className = "woDeStyle"

                // 绑定Escape折叠contents
                mouse_escape(contents)

                if (show_topic) {
                    // 获得 topic_content
                    let topic_contents = tempContainer.querySelectorAll(".topic_content")
                    contents.innerHTML += '<div class="topic-content-box"></div>'
                    topic_contents.forEach((e) => {
                        // 即 .topic-content-box
                        contents.firstChild.appendChild(e.parentElement)
                    })
                }

                if (show_fav_btn) {
                    // 添加topic_buttons
                    let favorite_btn = tempContainer.querySelector(".topic_buttons")
                    // 点击收藏，页面在新标签中打开
                    let fav_ele = favorite_btn.querySelector("a")
                    fav_ele.onclick = function (e) {
                        // 阻止原始a标签打开新页面
                        e.preventDefault()
                        // 后台发送xhr
                        mark_favourite(this)
                    }
                    contents.firstElementChild.appendChild(favorite_btn)
                }

                if (show_reply) {
                    // todo 展示不清楚为什么box会出现不同的情况，待研究
                    // 获得 reply_content
                    let reply_box = tempContainer.querySelectorAll(".box")
                    reply_box.forEach((e, index) => {
                        if (e.innerText.includes("条回复")) {
                            contents.appendChild(e)
                        }
                    })

                    // 去除reply_content中头像及空格
                    contents.querySelectorAll("tbody>tr").forEach((e) => {
                        e.removeChild(e.firstElementChild)
                        e.removeChild(e.firstElementChild)
                    })

                    // 添加一个折叠按钮 todo 是否可以直接把tr中添加的拿来用？
                    let hideBtn = document.createElement("div")
                    hideBtn.innerText = "▲"
                    hideBtn.className = "content-loaded"
                    hideBtn.style.textAlign = "right"
                    hideBtn.onclick = (() => {
                        // 隐藏主题详情
                        contents.style.display = "none"
                        // 切换主题展开为关闭
                        contents.parentElement.querySelector(".content-loaded").innerText = "▼"
                    })
                    cursor_style(hideBtn)
                    contents.appendChild(hideBtn)
                }

                // content添加到target_ele
                target_ele.appendChild(contents)
                // 解析markdown图片
                linksToImgs()

                // 设置默认高度
                set_content_default_height(contents, defaultHeight)

                // 修改折叠按钮为展开，切换样式
                set_btn_up(load_btn)
            }
        };
        xhr.send();
    }

    function cursor_style(element) {
        element.addEventListener("mouseover", function () {
            document.body.style.cursor = "pointer";
        });
        element.addEventListener("mouseout", function () {
            document.body.style.cursor = "auto";
        });
    }

    function create_item(tagName, element, element_place, inner_text, class_name, width) {
        let item = document.createElement(tagName)
        item.setAttribute("width", width)
        item.setAttribute("align", "center")
        item.setAttribute("class", class_name)
        item.innerText = inner_text
        if (element_place) {
            element.insertBefore(item, element_place)
        } else {
            element.appendChild(item)
        }
        return item
    }

    function mark_favourite(ele) {
        let url = ele.href
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = function () {
            if (xhr.status === 200) {
                if (ele.innerText !== "取消收藏") {
                    ele.innerText = "取消收藏"
                    ele.style.backgroundColor = "gold"
                    ele.href = url.replace("fav", "unfav")
                } else {
                    // todo 取消收藏，好像有页面重定向的问题
                    console("目前需要手动处理")
                    // ele.innerText = "加入收藏"
                    // ele.style.backgroundColor = ""
                    // ele.href = url.replace("unfav", "fav")
                }
            }
        }
        xhr.send();

    }

    function mouse_escape(element) {
        element.addEventListener('mouseover', function () {
            document.addEventListener('keydown', escKeyPressed);
        });

        element.addEventListener('mouseout', function () {
            document.removeEventListener('keydown', escKeyPressed);
        });

        function escKeyPressed(event) {
            if (event.key === 'Escape') {
                element.style.display = 'none';
                // todo 这个位置应该需要结构
                element.parentElement.querySelector(".content-loaded").innerText = "▼"
            }
        }
    }

    function set_content_default_height(element, defaultHeight) {
        // 如果没有设置，默认高度600px；如果输入0，完整显示
        if (defaultHeight === 0) {
            defaultHeight = element.offsetHeight
        } else if (!defaultHeight) {
            defaultHeight = 600
        }

        if (element.offsetHeight > defaultHeight) {
            element.style.height = defaultHeight + "px"
        } else {
            element.style.height = element.offsetHeight
        }
    }

    function set_btn_up(element) {
        element.innerText = "▲"
        element.className = "content-loaded"
        document.body.style.cursor = "auto";
    }


    // 链接转图片
    // 修改自 https://greasyfork.org/zh-CN/scripts/424246
    // size调整为30%；考虑可以点击图片，窗口最大化
    // todo 可以考虑把外面的括号进行替换
    function linksToImgs() {
        let links = document.links;
        Array.from(links).forEach(function (_this) {
            if (/^https.*\.(?:jpg|jpeg|jpe|bmp|png|gif)/i.test(_this.href) && !(/<img\s/i.test(_this.innerHTML))) {
                _this.innerHTML = `<img src="${_this.href}" style="max-width: 30%!important;" />`;
                // alert("有图片被替换了")
            } else if (/^https:\/\/imgur\.com\/[a-z]+$/i.test(_this.href)) { // 针对没有文件后缀的 imgur 图床链接
                _this.innerHTML = `<img src="${_this.href}.png" style="max-width: 30%!important;" />`;
            }
        });
    }





    let css = `
         .woDeStyle {
        /*height: 600px;*/
        padding: 10px;
        margin: 10px auto;
        border: 1px solid gray;
        border-radius: 10px;
        overflow: scroll;
    }

    .topic-content-box {
        border-bottom: 2px dashed gray;
        padding-bottom: 10px;
        margin-bottom: 10px;
    }

    .triangle {
        color: gray;
        padding-left: 10px;
    }

    .content-loaded {
        color: greenyellow;
        padding-left: 10px;
    }

    #Wrapper {
        background-color: var(--box-background-color) !important;
        background-image: none !important;
    }

    .toggle-more-nodes {
        display: none;
    }

    #nodes-more-children, #nodes-more-related {
        display: block !important;
    }


    `
    GM_addStyle(css)



})();