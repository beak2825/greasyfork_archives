// ==UserScript==
// @name         完美看看-将当前播放的剧名发送给iframe。
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  与手动跳过片头联动
// @author       weiv
// @match        *://www.wanmeikk.film/play/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanmeikk.me
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451076/%E5%AE%8C%E7%BE%8E%E7%9C%8B%E7%9C%8B-%E5%B0%86%E5%BD%93%E5%89%8D%E6%92%AD%E6%94%BE%E7%9A%84%E5%89%A7%E5%90%8D%E5%8F%91%E9%80%81%E7%BB%99iframe%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/451076/%E5%AE%8C%E7%BE%8E%E7%9C%8B%E7%9C%8B-%E5%B0%86%E5%BD%93%E5%89%8D%E6%92%AD%E6%94%BE%E7%9A%84%E5%89%A7%E5%90%8D%E5%8F%91%E9%80%81%E7%BB%99iframe%E3%80%82.meta.js
// ==/UserScript==

const title_prefix = "title";
const command_prefix = "command";

(function() {
    'use strict';

    const title = 获取当前播放的剧名();

    // 注册消息事件监听，接受子元素给的数据
    window.addEventListener('message', (e) => {
        console.log(e.data);
        let datas = e.data;
        if(datas.indexOf(command_prefix) >= 0) {
            datas = datas.replace(command_prefix, "");
            switch(datas){
                case "get_title":
                    // 获取 iframe的 对象
                    var iframeObj = document.querySelector("#playleft > iframe")
                    // 触发子页面的监听事件, 将页面的名称传过去。
                    iframeObj.contentWindow.postMessage(title, "*");
                    break;
                case "next":
                    console.log("这里处理next 的命令！");
                    点击下一集();
                    break;
                default:
            }
        }
    }, false);

})();

function 获取当前播放的剧名() {
    let title = document.querySelector("body > div.container > div > div.col-lg-wide-75.col-xs-1 > div.stui-player__item.clearfix > div.stui-player__detail.detail > h1 > a").text;
    title = title_prefix + title;
    console.log("当前播放的剧名是：", title);
    return title;
}

function 点击下一集() {
    document.querySelector("body > div.container > div > div.col-lg-wide-75.col-xs-1 > div.stui-player__item.clearfix > div.stui-player__detail.detail > ul > li:nth-child(3) > a").click();
}

// 监听按键
window.document.onkeydown=function(event) {
    const key = event.key;
    console.log("按下的是：",key);
    // 如果是按下的n 键，就点击下一集。
    if("n" === key) {
        点击下一集()
    }
};