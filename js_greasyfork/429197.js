// ==UserScript==
// @name         全网视频去水印-VIP视频解析
// @namespace    http://tampermonkey.net/
// @version      0.5.2
// @description  本脚本支持去除 腾讯视频 爱奇艺 优酷 西瓜 PPTV 视频平台的非内嵌水印，并且支持解析视频网站VIP蓝光视频
// @author       晚枫QQ237832960
// @license      Creative Commons
// @match        https://v.qq.com/*
// @match        https://v.youku.com/*
// @match        https://www.iqiyi.com/*
// @match        https://www.bilibili.com/*
// @match        https://www.ixigua.com/*
// @match        http://v.pptv.com/*
// @match        https://www.mgtv.com/*
// @match        https://svip.bljiex.cc/*
// @grant        授权非商业使用，未经允许，禁止复制粘贴相关源码
// @downloadURL https://update.greasyfork.org/scripts/429197/%E5%85%A8%E7%BD%91%E8%A7%86%E9%A2%91%E5%8E%BB%E6%B0%B4%E5%8D%B0-VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/429197/%E5%85%A8%E7%BD%91%E8%A7%86%E9%A2%91%E5%8E%BB%E6%B0%B4%E5%8D%B0-VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // z-index:1 防止全屏下显示按钮，

    var div = document.createElement("a")
    div.innerHTML = "点击解析视频"
    div.style.cssText="color: white;\n" +
        "    text-decoration: none;\n" +
        "    width: 150px;\n" +
        "    height: 40px;\n" +
        "    line-height: 40px;\n" +
        "    text-align: center;\n" +
        "    background: transparent;\n" +
        "    border: 1px solid #d2691e;\n" +
        "    font-family: Microsoft soft;\n" +
        "    border-radius: 3px;\n" +
        "    color:#ff7f50;\n" +
        "    position: fixed;\n" +
        "    top: 50%;\n" +
        "    z-index:999;\n" +
        "    left: 0px;\n" +
        "    cursor: pointer;"
    div.setAttribute("href","https://svip.bljiex.cc/?v="+location.href,"target","_blank")
    div.setAttribute("target","_blank")
    document.body.appendChild(div)
    var url = location.href;


    var check = setInterval(function () {
        var ele = document.getElementsByClassName("txp_waterMark_pic")[0]
        if (ele != null){
            console.log("TX       :"+ ele)
            console.log(ele)
            ele.remove()
            return
        }
        ele =document.getElementsByClassName("kui-watermark-logo-layer")[0]
        if (ele != null){
            console.log("YK       :"+ ele)
            console.log(ele)
            ele.remove()
            return
        }
        ele =document.getElementsByClassName("iqp-logo-box")[0]
        if (ele != null){
            console.log("IQ       :"+ ele)
            console.log(ele)
            ele.remove()
            return
        }
        ele =document.getElementsByClassName("common-xgplayer__Logo")[0]
        if (ele != null){
            console.log("XG       :"+ ele)
            console.log(ele)
            ele.remove()
            return
        }
        ele =document.getElementById("p-mark")
        if (ele != null){
            console.log("PP       :"+ ele)
            console.log(ele)
            ele.remove()
            return
        }

        ele =document.getElementsByClassName("el-button el-button--primary")[0]
        if (ele != null){
            div.remove()
            console.log(ele)
            var input = document.getElementById("url")
            input.value = url.substring('https://svip.bljiex.cc/?v='.length,url.length)
            return
        }

    },1000)

    })();