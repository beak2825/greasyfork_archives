    // ==UserScript==
    // @name         sdp诊断鹰眼ID获取工具
    // @namespace    http://tampermonkey.net/
    // @version      1.5
    // @description  该脚本用于在淘宝商详页面获取诊断鹰眼ID，用于服务决策诊断
    // @author       You
    // @match        https://detail.wapa.tmall.com/*
    // @match        https://detail.tmall.com/*
    // @match        https://detail.m.tmall.com/*
    // @match        https://buy.tmall.com/order/confirm_order*
    // @icon         https://www.google.com/s2/favicons?sz=64&domain=taobao.org
    // @grant        GM_setValue
    // @grant        GM_getValue
    // @grant        GM_registerMenuCommand
    // @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458309/sdp%E8%AF%8A%E6%96%AD%E9%B9%B0%E7%9C%BCID%E8%8E%B7%E5%8F%96%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/458309/sdp%E8%AF%8A%E6%96%AD%E9%B9%B0%E7%9C%BCID%E8%8E%B7%E5%8F%96%E5%B7%A5%E5%85%B7.meta.js
    // ==/UserScript==

    (function () {
        'use strict';
        let eagleeye_traceid;

        // 过滤鹰眼ID
        function filterEagleId() {
            console.log("sdp诊断鹰眼ID获取工具")
            let req = new XMLHttpRequest();
            console.log(document.location.href)
            req.open('GET', document.location.href, false);
            req.send(null);
            let headers = req.getAllResponseHeaders().toLowerCase();
            console.log(headers)
            // 由于返回的是用\r\n来进行分割的字符串，需要做转换
            let arr = headers.trim().split(/[\r\n]+/);
            let headerMap = {};
            arr.forEach(function (line) {
                let parts = line.split(': ')
                let header = parts.shift()
                let value = parts.join(': ')
                headerMap[header] = value
            })
            eagleeye_traceid = headerMap['eagleeye-traceid'];
            console.log('本次请求的鹰眼ID为: ', eagleeye_traceid);
        }

        function jump(url){
            window.location.href=url
        }

        function parseItemId(url) {
            url = url.split("?")
            url = url[1]
            let parts = url.split("&")
            console.log('parts: ', parts)
            for (let i in parts) {
                i = parseInt(i)
                let part = parts[i]
                if (part.indexOf("=") != -1) {
                    let entry = part.split("=")
                    if (entry[0].indexOf("id") != -1) {
                        return entry[1]
                    }
                }
            }
        }

        // 每一次点击鼠标，都会触发一次过滤操作
        // document.body.addEventListener('click', filterEagleId);

        // 获取本次请求的鹰眼ID
        if (document.location.href.indexOf("detail.tmall.com/item.htm") != -1) {
            console.log("商品详情o页面")
            let url = document.location.href
            let new_url = url.replace("item.htm", "item_o.htm")
            jump(new_url)
        }

        // 获取本次请求的鹰眼ID
        if (document.location.href.indexOf("detail.tmall.com/item_o.htm") != -1) {
            console.log("商品详情页面")
            let btn=document.createElement("button");
            btn.innerHTML="点击获取鹰眼ID";
            btn.className="btn btn-primary"
            btn.style = "background-color: rgb(255, 0, 0); color: rgb(255, 255, 255); height: 25px; line-height: 20px;"
            btn.onclick=function(){
                let url = document.location.href
                let itemId = parseItemId(url)
                console.log('本次请求itemId: ', itemId);
                // let new_url = url.replace("detail.", "detail.wapa.")
                let new_url = "https://detail.wapa.tmall.com/item.htm?id=" + itemId
                jump(new_url)
            }

            console.log(document.querySelector(".sn-quick-menu"));
            document.querySelector(".sn-quick-menu").append(btn);
        }

        // 判断是不是商详的wapa页面
        if (document.location.href.indexOf("detail.wapa") != -1) {
            console.log("商详的wapa页面")
            filterEagleId()
            let div = document.createElement("div");
            div.innerHTML="本次请求的鹰眼ID为: " + eagleeye_traceid;
            div.className="hintBanner"
            div.style = "color: rgb(255, 255, 255);"
            div.onclick=function(){
                filterEagleId()
             
            }
            // #id .class
            window.alert('本次请求的鹰眼ID为: ' + eagleeye_traceid);
            document.querySelector("#app").append(div);
        }

        if (document.location.href.indexOf("detail.m") != -1) {
            console.log("商详的.m页面")
            let url = document.location.href
            filterEagleId()
            let div = document.createElement("div");
            div.innerHTML="本次请求的鹰眼ID为: " + eagleeye_traceid;
            div.className="hintBanner"
            div.style = "color: rgb(255, 255, 255);"
            div.onclick=function(){
                filterEagleId()
                // window.alert('本次请求的鹰眼ID为: ' + eagleeye_traceid);
            }
            console.log(document.querySelector("#app"))

            document.querySelector("#app").parentElement.append(div);
            let new_url = url.replace("detail.m", "detail.wapa")
            jump(new_url)
        }

    //     if (document.location.href.indexOf("confirm_order") != -1) {
    //         console.log("提交订单页面")
    //         let btn=document.createElement("button");
    //         btn.innerHTML="获取本次请求的鹰眼ID";
    //         btn.className="btn btn-primary"
    //         btn.style = "background-color: rgb(255, 0, 0); color: rgb(255, 255, 255); height: 25px; line-height: 20px;"
    //         btn.onclick=function(){
    //             //filterEagleId()
    //             //window.alert('本次请求的鹰眼ID为: ' + eagleeye_traceid);
    //             location.reload();
    //         }
    //         document.querySelector(".feedback__pic-bug").parentElement.append(btn);
    //     }

    })();








