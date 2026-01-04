// ==UserScript==
// @name         B站分P搜索
// @namespace    https://github.com/LianTianYou
// @version      1.0.2
// @description  在B站的多P稿件和合集中添加搜索框，进行内容搜索
// @author       LianTianYou
// @license      MIT
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498535/B%E7%AB%99%E5%88%86P%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/498535/B%E7%AB%99%E5%88%86P%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(() => {

    const clearBox = document.createElement("div");
    const isDebug = false;

    function debug(...msg) {
        const isDebug = false;

        if (isDebug) {
            console.log(...msg);
        };
    }

    /**
     * 清空筛选结果
     */
    function clearFilter(data) {
        if (data == null) return;
        if (data.parts == null || data.parts.length === 0) return;
        if (data.pages == null || data.pages.length === 0) return;

        data.parts.forEach((part, index) => {
            data.pages[index].style.display = "flex";
            part.innerHTML = part.textContent;
        });


        /* 定位到正在播放的分P */
        // 分P的容器
        const listContainer = document.querySelector('.video-pod__body');
        // 当前选择的分P
        const selectedItem = document.querySelector('.video-pod__item.active');

        if (listContainer && selectedItem) {
            // const offsetTop = selectedItem.offsetTop - listContainer.offsetTop;
            listContainer.scrollTo({ top: selectedItem.offsetTop, behavior: 'instant' });
        }
    }

    /**
     * 根据关键字进行筛选
     */
    function toggleFilter(data, keyword) {
        if (keyword == null || data == null) return;
        if (data.parts == null || data.parts.length === 0) return;
        if (data.pages == null || data.pages.length === 0) return;

        const regex = new RegExp(`(${keyword})`, "ig");
        debug(keyword);
        debug(regex);
        data.parts.forEach((part, index) => {
            const page = data.pages[index];
            let value = part.textContent;
            if(value.search(regex) != -1) {
                // 匹配到关键词
                page.style.display = "flex";
                part.innerHTML = value.replaceAll(regex, '<em class="keyword">$1</em>');
            } else {
                // 未匹配项
                page.style.display = "none";
            }
        });
    }

    /**
     * 根据搜索框的结果进行处理
     */
    function searchFilter(data, keyword = "") {
        keyword = keyword.trim();
        if (!keyword) {
            // 关键词为空
            clearFilter(data);
        } else {
            // 有关键词
            toggleFilter(data, keyword);
        }
    }

    /**
     * 改变清空按钮的显示状态
     */
    function changeClearBtn(value) {
        if (!value || value.trim() === "") {
            clearBox.style.display = "none";
        } else if(clearBox.style.display !== "block") {
            clearBox.style.display = "block";
        }
    }

    /**
     * 添加 style 标签
     */
    function addStyle() {
        let styleTag = document.createElement("style");
        styleTag.type = "text/css";
        styleTag.id = "bili-filter";
        let styleCode = `
            .search-box {
                margin: 5px auto 0 auto;
                /* padding: 0 10px; */
                background: #F1F2F3;
                height: 44px;
                display: flex;
                align-items: center;
            }
            .search-box > input.search {
                height: 34px;
                width: 100%;
                padding: 0 10px;
                font-size: 14px;
                outline: none;
                border: 1px solid #e3e5e7;
                border-radius: 5px;
                caret-color: #5e5e5e;
            }
            .search-box > input.search:focus {
                border: 1px solid #00aeec;
            }
            .keyword {
                color: #f25d8e;
                font-style: normal;
            }
            .clear-box {
                display: none;
                position: absolute;
                right: 16px;
            }
            .clear-btn {
                width: 20px;
                height: 20px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .clear-btn > svg {
                height: 8px;
                width: 8px;
                fill: #61666d;
            }
        `;
        styleTag.appendChild(document.createTextNode(styleCode));
        document.querySelector("head").appendChild(styleTag);
    }

    /**
     * 创建自定义的 DOM 元素，并返回容器的节点
     */
    function createElement(data) {
        // 插入 style 标签
        addStyle();

        // 容器
        const searchBox = document.createElement("div");
        searchBox.className = "search-box";

        // 搜索框
        const search = document.createElement("input");
        search.type = "search";
        search.className = "search";
        search.placeholder = "搜索分P...";
        // search.addEventListener("change", function(e) {
        //     searchFilter(data, e.target.value);
        // });
        search.addEventListener("input", function(e) {
            searchFilter(data, e.target.value);
            changeClearBtn(e.target.value);
        });
        searchBox.append(search);

        // 清空按钮
        clearBox.className = "clear-box";
        const clearBtn = document.createElement("div");
        clearBtn.className = "clear-btn";
        clearBtn.innerHTML = '<svg t="1706028151814" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9157" width="200" height="200"><path d="M632.117978 513.833356l361.805812 361.735298a85.462608 85.462608 0 1 1-121.001515 120.789974L511.116463 634.552816 146.913186 998.756094a86.026718 86.026718 0 0 1-121.706652-121.706652L389.480325 512.775651 27.674513 150.969839A85.392095 85.392095 0 0 1 148.393973 30.250379L510.199785 392.056191l366.671258-366.671258a86.026718 86.026718 0 0 1 121.706652 121.706652z" p-id="9158"></path></svg>';
        clearBtn.addEventListener("click", function() {
            search.value = "";
            searchFilter(data);
            changeClearBtn("");
        });
        clearBox.append(clearBtn);
        searchBox.append(clearBox);

        return searchBox;
    }

    /**
     * 在普通分P中添加元素
     */
    function insertToPages() {
        const data = {
            pages: document.querySelectorAll(".video-pod__body .video-pod__item.normal"),
            parts: document.querySelectorAll(".video-pod__body .video-pod__item.normal div.title-txt")
        };

        if (data.pages == null || data.pages.length === 0 || data.parts == null || data.parts.length === 0) {
            return;
        }
        // 将元素插入到网页中
        const searchBox = createElement(data);
        const pageList = document.querySelector(".video-pod__header .header-top");     // 分P列表
        if (pageList) {
            pageList.after(searchBox);
        }
    }

    /**
     * 在合集中添加元素
     */
    function insertToSections() {
        const data = {
            pages: document.querySelectorAll(".video-episode-card"),
            parts: document.querySelectorAll(".video-episode-card .video-episode-card__info-title")
        };

        // 将元素插入到网页中
        const searchBox = createElement(data);
        // const headCon = document.querySelector(".video-sections-head");
        // headCon.after(searchBox);
        // document.querySelector(".video-section-list").style.height = "auto";
    }

    /** 等待元素出现 */
    function waitExist(selecter, timeout = 5, check = null) {
        let interval = 50;
        let count = 0;

        const p = new Promise((resolve, reject) => {
            const timer = setInterval(() => {
                const ele = document.querySelector(selecter);

                if (interval * count > timeout * 1000) {
                    clearInterval(timer);
                    // debug("等待超时");
                    reject(new Error("等待超时"));
                }
                count++;

                debug(ele);

                if (!ele) return;
                if (check && !check(ele)) return;

                clearInterval(timer);
                resolve(ele);
            }, interval);
        });
        return p;
    }

    /**
     * 入口函数
     */
    async function main() {
        try {
            // 等待弹幕列表出现
            await waitExist("#danmukuBox", 5);
            debug("#danmukuBox 出现");

            // 等待分P列表出现
            await waitExist(".video-pod__body", 5);
            debug(".video-pod__body 出现");
            // 等待分P列表顶部操作栏出现
            await waitExist(".video-pod__header > .header-top", 5);
            debug(".header-top 出现");
            await waitExist(".video-pod__item.active", 5);
            // 等待弹幕列表的标题出现
            await waitExist("#danmukuBox .bui-dropdown-name", 5);
            debug(".bui-dropdown-name 出现");
            insertToPages();

//             if (document.querySelector(".video-pod__body")) {
//                 // 等待分P列表出现
//                 debug(".video-pod__body 出现");
//                 // 等待分P列表顶部操作栏出现
//                 await waitExist(".video-pod__header > .header-top", 5);
//                 debug(".header-top 出现");
//                 insertToPages();
//             } else if(document.querySelector(".base-video-sections-v1")) {
//                 debug("sections 出现");

//                 const result = await waitExist(".video-episode-card__info-playing .cur-play-icon", 5, (e) => e.style.display !== "none");
//                 debug("cur-play-icon 出现");
//                 debug(result);
//                 await new Promise((resolve) => requestAnimationFrame(resolve));
//                 insertToSections();
//                 requestIdleCallback(() => {
//                     debug("浏览器空闲");
//                     // debugger;
//                 });
//             }
        } catch(err) {
            debug(err);
        }

        debug("执行完毕");
    }

    window.onload = () => {
        debug("onloaded");
        main();
    };
})();