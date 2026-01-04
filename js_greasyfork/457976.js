// ==UserScript==
// @name         CSDN净化
// @namespace    http://tampermonkey.net/
// @version      0.3.0
// @description  filter/format csdn css
// @author       细粒丁
// @match        *://*.csdn.net/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457976/CSDN%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/457976/CSDN%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const config = {
        blog_container_aside: true,    // 左边侧边栏
        left: {
            asideProfile: true,         // 用户信息简介（左边）
            asideSearchArticle: true,   // 搜索博主文章（左边）
            asideHotArticle: true,      // 热门文章（左边）
            asideCategory: true,        // 分类专栏（左边）
            asideNewComments: true,     // 最新评论（左边）
            asideNewNps: true,          // 推荐意愿（左边）
            asideArchive: true,         // 最新文章（左边）
        },
        rightAside: false,               // 右边侧边栏
        right: {
            groupfile: true,            // 目录（右边）
            programmer1Box: true,       // 广告（右边）
            "aside-box kind_person d-flex flex-column": true,   // 分类专栏（右边）
        },
        recommendDownloadFilter: true,  // 过滤末尾推荐文章中的资源下载
    }

    const list = {
        recommendNps: true,                 // 相关推荐调查（底部）
        "blog-footer-bottom": true,         // 底部声明（底部）
        "recommend-box": false,             // 文章末尾的推荐文章（底部）
        "sidetool-writeguide-box": true     // 创作话题
    }


    function format(key) {
        let id = "#" + key
        let cls = "." + key.replace(/\s/g, ".")
        return `${id},${cls}`
    }

    function del(obj) {
        let target = true
        for (const key in obj) {
            const element = obj[key];
            if (element) {
                let arr = document.querySelectorAll(format(key))
                for (let i = 0; i < arr.length; i++) {
                    const item = arr[i];
                    item.remove()
                }
            } else {
                target = false
            }
        }
        return target
    }

    del(list)

    if ((config.blog_container_aside && document.querySelector(".blog_container_aside").remove()) || del(config.left)) {
        let main = document.querySelector("main")
        main.style.width = "100%"
        main.style.float = "none"
    }

    if (config.rightAside || del(config.right)) {
        document.querySelector("#rightAside").remove()
    }

    if (config.recommendDownloadFilter & !list["recommend-box"]) {
        const linklist = document.querySelectorAll(".recommend-item-box")
        for (let i = 0; i < linklist.length; i++) {
            const element = linklist[i];
            const url = element.getAttribute("data-url")
            url && url.includes("download.csdn.net") && element.remove()
        }
    }


})();
