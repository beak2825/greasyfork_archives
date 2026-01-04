// ==UserScript==
// @name        抖音主页跳转到热点宝页面
// @namespace   https://gitee.com/wang-yifan0905
// @match       *://*.douyin.com/user/*
// @grant       none
// @version     1.3
// @author      伍陆柒
// @license     MIT
// @description 2023/2/20 下午12:21:54
// @downloadURL https://update.greasyfork.org/scripts/460342/%E6%8A%96%E9%9F%B3%E4%B8%BB%E9%A1%B5%E8%B7%B3%E8%BD%AC%E5%88%B0%E7%83%AD%E7%82%B9%E5%AE%9D%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/460342/%E6%8A%96%E9%9F%B3%E4%B8%BB%E9%A1%B5%E8%B7%B3%E8%BD%AC%E5%88%B0%E7%83%AD%E7%82%B9%E5%AE%9D%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==
"use strict";

 (function () {
            var btnList = document.querySelector("._7gdyuNUv")
            var btnLink = document.createElement("button")
            btnLink.innerHTML = "热点宝"
            btnLink.classList.add("B10aL8VQ", "s6mStVxD", "vMQD6aai");
            btnList.insertBefore(btnLink, btnList.firstChild);
            var nowHref = window.location.href
            var match = nowHref.match(/user\/(.+)\??/);
            if (match && match[1]) {
                var userId = match[1].replace(/\?.*/, '');
                btnLink.addEventListener("click", () => {
                    window.open(
                        `https://douhot.douyin.com/creator/detail?active_tab=creator_video&creator_id=${userId}`
                    )
                })
                console.log(userId); // 输出：MS4wLjABAAAAzC_011r__0_gaDBjc-uHI2EKEEZuzDv7Lyfb0Vdg7zU
            } else {
                alert("userId信息获取失败")
            }

        })()