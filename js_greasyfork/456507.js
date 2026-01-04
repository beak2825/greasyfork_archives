// ==UserScript==
// @name         OpenAI CatGirl Chat
// @version      0.0.3
// @description  让你的OpenAI一键变猫！同时屏蔽安全检查！
// @author       CyanFalse
// @match        https://chat.openai.com/chat
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @namespace https://greasyfork.org/users/370662
// @downloadURL https://update.greasyfork.org/scripts/456507/OpenAI%20CatGirl%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/456507/OpenAI%20CatGirl%20Chat.meta.js
// ==/UserScript==

setTimeout(() => {
    'use strict';
    const catgirl_avatar = "https://i.imgur.com/AjKO6G3.png"


    //修改p-1的padding为0
    document.querySelector(".p-1").style.padding = "0px";

    const chat_list_ele = document.getElementsByClassName("flex flex-col items-center")[0]
    //监听变动，如果发生了元素新增，执行fake_avatar函数
    const observer = new MutationObserver(fake_avatar)
    observer.observe(chat_list_ele, { childList: true })
    function fake_avatar() {
        //遍历class为bg-gray-50 dark:bg-[#444654]的元素
        for (let ele of document.getElementsByClassName("bg-gray-50 dark:bg-[#444654]")) {
            //遍历其中的svg元素，将图片替换为catgirl_avatar
            for (let svg of ele.getElementsByTagName("svg")) {
                //如果其class为w-6 h-6，那么就是头像
                if (svg.getAttribute("width") == "41") {
                    //将此元素转换为img
                    let img = document.createElement("img")
                    img.setAttribute("src", catgirl_avatar)
                    //替换
                    svg.replaceWith(img)
                }
            }
        }
    }
    function addNewStyle(newStyle) {
        var styleElement = document.getElementById('styles_js');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.type = 'text/css';
            styleElement.id = 'styles_js';
            document.getElementsByTagName('head')[0].appendChild(styleElement);
        }
        styleElement.appendChild(document.createTextNode(newStyle));
    }
    addNewStyle('.p-1 {padding:0px !important;}');


    const originFetch = fetch;
    unsafeWindow.fetch = (...arg) => {
        if (arg[0].match('/moderations')) {
            return new Response("")
        } else {
            return originFetch(...arg);
        }
    }

}, 50)