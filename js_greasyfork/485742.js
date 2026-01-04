// ==UserScript==
// @name        Bilibili大航海列表点击跳转
// @namespace   https://space.bilibili.com/35192025
// @version     0.2.1
// @supportURL  https://space.bilibili.com/35192025
// @grant       none
// @author      铂屑
// @license     MIT
// @include     /https?:\/\/live\.bilibili\.com\/(blanc\/)?\d+\??.*/
// @icon        https://www.google.com/s2/favicons?domain=bilibili.com
// @description 为Bilibili直播间的大航海列表添加点击跳转功能
// @require     https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/485742/Bilibili%E5%A4%A7%E8%88%AA%E6%B5%B7%E5%88%97%E8%A1%A8%E7%82%B9%E5%87%BB%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/485742/Bilibili%E5%A4%A7%E8%88%AA%E6%B5%B7%E5%88%97%E8%A1%A8%E7%82%B9%E5%87%BB%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    async function addEventToGuardList() {
        while ($('#rank-list-ctnr-box .rank-list-cntr .rank-list-box .list div[role="listitem"]').length == 0) {
            // console.warn(`找不到大航海元素，退出。`)
            return
        }

        let userList = $('#rank-list-ctnr-box .rank-list-cntr .rank-list-box .list div[role="listitem"]')
        // console.log(userList)
        userList.map(function (num) {
            let userInfo = $(this).children('webcomponent-userinfo').first()
            let userInfoJson = JSON.parse(userInfo?.attr('userinfo'))
            let uid = userInfoJson.uinfo.uid   // 获取uid
            // console.log(uid)
            let unameDom = document.querySelectorAll('#rank-list-ctnr-box .rank-list-cntr .rank-list-box .list div[role="listitem"] webcomponent-userinfo')[num].shadowRoot?.querySelector('span.uname')
            // console.log(unameDom)
    
            // 操作内部元素
            unameDom?.addEventListener('click', function () {
                window.open('https://space.bilibili.com/' + uid);
            });
            return this
        })
    }
    while ($('#rank-list-ctnr-box .tab-content ').length == 0) {
        // console.warn(`找不到排行，等待3秒。`)
        await new Promise((res,) => setTimeout(res, 3000)) // wait 3 seconds
    }
    try {
        var eventflag = true;
        var listBox = document.querySelector("#rank-list-ctnr-box .tab-content");
        //以下代码为监控整个Body元素的变化
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        if (MutationObserver) {
            var MutationObserverConfig = {
                childList: true,
                subtree: true,
            };
            var observer = new MutationObserver(async function (mutations) {
                await addEventToGuardList();
            });
            observer.observe(listBox, MutationObserverConfig);
        }
        else if (listBox?.addEventListener) {
            listBox.addEventListener("DOMSubtreeModified", async function (evt) {
                await addEventToGuardList();
            }, false);
        }else {
            await addEventToGuardList();
        }
    } catch (error) {
        console.log(error)
    }
})().catch(console.warn);