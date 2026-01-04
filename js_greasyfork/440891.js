// ==UserScript==
// @name         短视频真实地址获取
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  本脚本支持抖音快手及西瓜电影电视剧无水印地址获取跳转
// @author       晚枫QQ237832960
// @license      Creative Commons
// @match        *://*.kuaishou.com/*
// @match        *://*.douyin.com/*
// @match        *://*.ixigua.com/*
// @grant        授权非商业使用，未经允许，禁止复制粘贴相关源码
// @downloadURL https://update.greasyfork.org/scripts/440891/%E7%9F%AD%E8%A7%86%E9%A2%91%E7%9C%9F%E5%AE%9E%E5%9C%B0%E5%9D%80%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/440891/%E7%9F%AD%E8%A7%86%E9%A2%91%E7%9C%9F%E5%AE%9E%E5%9C%B0%E5%9D%80%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var check = setInterval(function () {
        var url
        var urlReg = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/;
        //alert (urlReg.exec(location.href)[0])
        let KS = /^([\w\-])+\.(kuaishou).com\/*/;
        console.log(KS)
        let KSVol = KS.test(urlReg.exec(location.href)[0]);
        if(KSVol != false){
            var ele= document.getElementsByClassName("player-video")[0]
            if (ele != null){
                console.log('ele ;         '+ele.src)
                url = ele.src
                console.log('url ;         '+url)
            }
        }
        let DY = /^([\w\-])+\.(douyin).com\/*/;
        let DYVol = DY.test(urlReg.exec(location.href)[0]);
        if(DYVol != false){
            ele = document.getElementsByTagName("source")[0]
            if (ele != null){
                console.log('ele ;         '+ele.src)
                url = ele.src
                console.log('url ;         '+url.src)
            }
        }
        let XG = /^([\w\-])+\.(ixigua).com\/*/;
        let XGVol = XG.test(urlReg.exec(location.href)[0]);
        if(XGVol != false){
            ele = document.getElementsByTagName("video")[0]
            if (ele != null){
                console.log('ele ;         '+ele.src)
                url = ele.src
                console.log('url ;         '+url.src)
            }
        }
        if (url!= null){
            var div = document.createElement("a")
            div.innerHTML ="解析视频"
            div.style.cssText="color: black;\n" +
                "    text-decoration: none;\n" +
                "    text-align:center;\n" +
                "    width: 100px;\n" +
                "    height: 40px;\n" +
                "    line-height: 40px;\n" +
                "    text-align: center;\n" +
                "    background: transparent;\n" +
                "    position: fixed;\n" +
                "    top: 30%;\n" +
                "    border: 1px solid #d2691e;\n" +
                "    color:#ff7f50;\n" +
                "    z-index:999;\n" +
                "    left: 10px;\n" +
                "    font-family: Microsoft soft;\n" +
                "    border-radius: 3px;\n" +
                "    cursor: pointer;"
            div.setAttribute("href",url,"target","_blank")
            div.setAttribute("target","_blank")
            document.body.appendChild(div)
        }
    },2000)

    })();