// ==UserScript==
// @name         四网视频去水印
// @namespace    http://tampermonkey.net/
// @version      0.7.1
// @description  本脚本支持去除 腾讯视频 爱奇艺 优酷 奈菲影视 视频平台的非内嵌水印
// @author       www.yutoustu.gitee.io
// @match        https://v.qq.com/*
// @match        https://v.youku.com/*
// @match        https://www.iqiyi.com/*
// @match        https://www.bilibili.com/*
// @match        https://v.hdbl.net/*
// @match        https://www.nfmovies.com/*
// @grant        授权非商业使用，未经允许，禁止复制粘贴相关源码
// @downloadURL https://update.greasyfork.org/scripts/427840/%E5%9B%9B%E7%BD%91%E8%A7%86%E9%A2%91%E5%8E%BB%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/427840/%E5%9B%9B%E7%BD%91%E8%A7%86%E9%A2%91%E5%8E%BB%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

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
            console.log(ele)
            ele.remove()
            return
        }

    },1000)

    })();