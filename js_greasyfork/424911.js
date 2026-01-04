// ==UserScript==
// @name         四网视频去水印-VIP蓝光视频解析
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  本脚本支持去除 腾讯视频 爱奇艺 优酷 奈菲影视 视频平台的非内嵌水印，并且支持解析视频网站VIP蓝光视频
// @author       www.yutoustu.gitee.io
// @match        https://v.qq.com/*
// @match        https://v.youku.com/*
// @match        https://www.iqiyi.com/*
// @match        https://www.bilibili.com/*
// @match        https://v.hdbl.net/*
// @match        https://www.nfmovies.com/*
// @grant        授权非商业使用，未经允许，禁止复制粘贴相关源码
// @downloadURL https://update.greasyfork.org/scripts/424911/%E5%9B%9B%E7%BD%91%E8%A7%86%E9%A2%91%E5%8E%BB%E6%B0%B4%E5%8D%B0-VIP%E8%93%9D%E5%85%89%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/424911/%E5%9B%9B%E7%BD%91%E8%A7%86%E9%A2%91%E5%8E%BB%E6%B0%B4%E5%8D%B0-VIP%E8%93%9D%E5%85%89%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    var div = document.createElement("a")
    div.innerHTML = "点击解析蓝光视频"
    div.style.cssText="color: white;\n" +
        "    text-decoration: none;\n" +
        "    width: 150px;\n" +
        "    height: 40px;\n" +
        "    line-height: 40px;\n" +
        "    text-align: center;\n" +
        "    background-color: coral;\n" +
        "    position: fixed;\n" +
        "    top: 50%;\n" +
        "    z-index:99999;\n" +
        "    left: 0px;\n" +
        "    cursor: pointer;"
    div.setAttribute("href","https://v.hdbl.net/?url="+location.href)
    document.body.appendChild(div)
    var url = location.href;


    var check = setInterval(function () {
        var ele = document.getElementsByClassName("txp_waterMark_pic")[0]
        if (ele != null){
            console.log(ele)
            ele.remove()
            return
        }
        ele =document.getElementsByClassName("logo-new")[0]
        if (ele != null){
            console.log(ele)
            ele.remove()
            return
        }
        ele =document.getElementsByClassName("iqp-logo-box")[0]
        if (ele != null){
            console.log(ele)
            ele.remove()
            return
        }
        ele =document.getElementsByClassName("dplayer-logo")[0]
        if (ele != null){
            console.log(ele)
            ele.remove()
            return
        }
        ele =document.getElementsByClassName("el-button el-button--primary")[0]
        if (ele != null){
            div.remove()
            console.log(ele)
            var input = document.getElementById("url")
            input.value = url.substring('https://v.hdbl.net/?url='.length,url.length)

            return
        }

    },1000)

    })();