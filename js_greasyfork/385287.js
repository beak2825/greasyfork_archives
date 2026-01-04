// ==UserScript==
// @name         BaiduAutoJump
// @namespace    https://github.com/JosephusZhou
// @version      0.2
// @description  Automatically redirect to third-party download site.
// @author       Josephus Zhou
// @match        https://pan.baidu.com/s/*
// @match        https://pan.baidu.com/share/*
// @match        https://wenku.baidu.com/view/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/385287/BaiduAutoJump.user.js
// @updateURL https://update.greasyfork.org/scripts/385287/BaiduAutoJump.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let originalUrl = window.location.href
    let jumpUrl

    let reg = /https\:\/\/pan\.baidu\.com\/*/
    if (reg.test(originalUrl)) {
        //  百度网盘自动跳转：1 -> 2
        // https://pan.baidu.com/s/1xxx or https://pan.baidu.com/share/init?surl=xxx
        // https://pan.baiduwp.com/s/1xxx
        let panReg = /https\:\/\/pan\.baidu\.com\/share\/init\?surl=(.*)/
        if (panReg.test(originalUrl)) {
            // 带密码解析后跳转
            let regResult = originalUrl.match(panReg)
            jumpUrl = "https://pan.baiduwp.com/s/1" + regResult[1]
        } else {
            // 无密码直接跳转
            jumpUrl = originalUrl.replace("baidu.com", "baiduwp.com")
        }
        window.location.replace(jumpUrl)
    } else {
        //  百度文库自动跳转：1 -> 2
        // https://wenku.baidu.com/view/690c624d10a6f524cdbf853e?page=home
        // https://wenku.baiduvvv.com/view/690c624d10a6f524cdbf853e?page=home
        let wenkuReg = /https\:\/\/wenku\.baidu\.com\/view\/(.+)/
        if (wenkuReg.test(originalUrl)) {
            // 不自动跳转，生成一个浮动按钮
            jumpUrl = originalUrl.replace("baidu.com", "baiduvvv.com")
            //let floatingButton = '<div style="display:block; background:red; bottom:100px; right:200px; position:fixed; z-index:9999; font-size:20px; height:40px; width:100px; line-height:40px; text-align:center; border-radius:10px; -moz-border-radius:10px;"><a href="' + jumpUrl + '" style="color:white;text-decoration:none;" target="_blank">免费下载</a></div>'
            //document.body.innerHTML += floatingButton
            window.onload = function() {
                let parentTag = document.getElementsByClassName("toolbar-core-btns-wrap")[0]
                let removeTag = document.getElementsByClassName("toolbar-core-btns-value-text")[0]
                parentTag.removeChild(removeTag)
                let outputButton = '<div id="output-div" style="display:inline-block;line-height:40px;min-width:130px;box-sizing:border-box;background-color:#53b5ef;text-align:center;cursor:pointer;padding:7px 0px 0px 0px;"><a href="' + jumpUrl + '" style="color:#fff;font-size:18px;text-decoration:none;" target="_blank">导出下载</a></div>'
                let parser = new DOMParser();
                let outputButtonDoc = parser.parseFromString(outputButton, "text/html");
                let outputButtonTag = outputButtonDoc.querySelector("#output-div")
                let firstTag = parentTag.getElementsByTagName("div")[0]
                parentTag.insertBefore(outputButtonTag, firstTag)
            }
        }
    }
})();