// ==UserScript==
// @name            抖音评论过滤
// @name:en         Tiktok Comment Filter
// @namespace       net.coolkk.tiktokcommentfilter
// @description     自定义过滤抖音的评论
// @description:en  Customized filtering of Tiktok comments
// @version         1.0.0
// @author          Coolkk
// @icon            https://lf1-cdn-tos.bytegoofy.com/goofy/ies/douyin_web/public/favicon.ico
// @homepage        https://github.com/Coolkkmeat/TiktokCommentFilter
// @supportURL      https://github.com/Coolkkmeat/TiktokCommentFilter/issues
// @contributionURL https://coolkk.net/
// @license         Apache License 2.0
// @charset		    UTF-8
// @include         http*://*douyin.com/*
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_registerMenuCommand
// @run-at          document-idle
// @downloadURL https://update.greasyfork.org/scripts/488322/%E6%8A%96%E9%9F%B3%E8%AF%84%E8%AE%BA%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/488322/%E6%8A%96%E9%9F%B3%E8%AF%84%E8%AE%BA%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

(function () {
    /**
     * 严格模式
     */
    "use strict";

    /**
     * 初始化
     */
    //菜单
    GM_registerMenuCommand("设置需要过滤的字符", function () {
        control_character();
    });
    //设置
    const config = { "config_character": GM_getValue("config_character", "none") }
    if (config["config_character"] == "none") {
        control_character();
    }
    const character = config["config_character"].split(",");
    //监听
    listen();

    /**
     * 控制-设置字符
     */
    function control_character() {
        let configNew = prompt("请输入需要过滤的字符（使用,分割）：", config["config_character"]);
        if (configNew && configNew !== config["config_character"]) {
            GM_setValue("config_character", configNew);
            window.location.reload();
        }
    }

    /**
     * 监听
     */
    function listen() {
        let xhr = XMLHttpRequest.prototype;
        let originSend = xhr.send;
        xhr.send = async function (postData) {
            //处理
            work();
            //返回
            return originSend.apply(this, arguments);
        }
    }

    /**
     * 处理
     */
    function work() {
        //寻找
        let documents = document.querySelector('[data-e2e="comment-list"]')
        if (documents != null) {
            let commentList = documents.querySelectorAll("div > span[class]");
            commentList.forEach(function (commentElement) {
                //判断
                if (character.find(item => commentElement.textContent.includes(item))) {
                    //处理
                    commentElement.parentNode.parentNode.parentNode.parentNode.remove();
                }
            });
        }
    }
})();