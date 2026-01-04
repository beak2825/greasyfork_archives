// ==UserScript==
// @name         木杉·自用
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  本脚本支持去除 腾讯视频、爱奇艺、X主页的非内嵌水印，支持去除 csdn 右侧小广告，樱花动漫(yinghuacd.com)全部广告
// @author       木杉qq1515585503
// @match        https://v.qq.com/*
// @match        https://blog.csdn.net/*
// @match        https://www.iqiyi.com/*
// @match        http://www.yinghuacd.com/*
// @match        https://wxnan.gitee.io/x_home_page/*
// @grant        授权非商业使用，未经允许，禁止复制粘贴相关源码
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/435859/%E6%9C%A8%E6%9D%89%C2%B7%E8%87%AA%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/435859/%E6%9C%A8%E6%9D%89%C2%B7%E8%87%AA%E7%94%A8.meta.js
// ==/UserScript==

(function() {
    var check = setInterval(function () {
        var tencent = document.getElementsByClassName("txp_waterMark_pic")[0]
        if (tencent != null) {
            tencent.remove()
            return
        }
        var csdn = document.getElementsByClassName("csdn-common-logo-advert")[0]
        if (csdn != null) {
            csdn.remove()
            return
        }
        var iqy = document.getElementsByClassName("iqp-logo-box")[0]
        if (iqy != null) {
            iqy.remove()
            return
        }
        var x = document.getElementsByClassName("logo")[0]
        if (x != null) {
            x.remove()
            return
        }
        var yinghua = document.getElementById("HMRichBox")
        var yhleft = document.getElementById("HMcoupletDivleft")
        var yhright = document.getElementById("HMcoupletDivright")
        if (yinghua && yhleft && yhright) {
            yinghua.remove()
            yhleft.remove()
            yhright.remove()
            return
        }

    },1000)

})();