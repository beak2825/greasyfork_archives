// ==UserScript==
// @name         漫画柜漫画列表筛选标记工具
// @namespace    https://greasyfork.org/zh-CN/scripts/460270-%E6%BC%AB%E7%94%BB%E6%9F%9C%E6%BC%AB%E7%94%BB%E5%88%97%E8%A1%A8%E7%AD%9B%E9%80%89%E6%A0%87%E8%AE%B0%E5%B7%A5%E5%85%B7
// @icon 		https://www.mhgui.com/favicon.ico
// @version      0.0.9
// @description  标记一下哪些是看过的，哪些是不想看的。
// @author       shawn
// @license MIT
// @match        *://*.manhuagui.com/*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/460270/%E6%BC%AB%E7%94%BB%E6%9F%9C%E6%BC%AB%E7%94%BB%E5%88%97%E8%A1%A8%E7%AD%9B%E9%80%89%E6%A0%87%E8%AE%B0%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/460270/%E6%BC%AB%E7%94%BB%E6%9F%9C%E6%BC%AB%E7%94%BB%E5%88%97%E8%A1%A8%E7%AD%9B%E9%80%89%E6%A0%87%E8%AE%B0%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let downloaded_listName = 'downloaded-list';
    let blocked_listName = 'blocked-list';

    function addButtons(button_container, href, title, i, isDownloaded, isBlocked, styleTarget) {
        let buttonName = "btn_down_" + i
        let btn_down = document.createElement('input');
        btn_down.setAttribute('type', 'button');
        btn_down.setAttribute('id', buttonName);
        btn_down.setAttribute('value', isDownloaded ? 'UnMark' : 'Mark');
        btn_down.setAttribute('class', 'super normal button');
        button_container.appendChild(btn_down);
        // onclick 传递 href
        document.getElementById(buttonName).onclick = function () {
            let strlist = GM_getValue(downloaded_listName, "")
            let isDownloaded = strlist.split(';').indexOf(href) >= 0
            console.log(buttonName + " onclick isDownloaded = " + isDownloaded)
            document.getElementById(buttonName).value = GM_getValue(downloaded_listName, '').split(';').indexOf(href) >= 0 ? 'UnMark' : 'Mark';
            if (isDownloaded) {
                GM_setValue(downloaded_listName, strlist.replace(';' + href, ''));
                styleTarget.style = ""
            } else {
                GM_setValue(downloaded_listName, strlist + ';' + href);
                styleTarget.style = "background: greenyellow;"
            }
            // 去重
            let strlist2 = [...new Set(GM_getValue(downloaded_listName, "").split(';'))].filter(function (item, index, array) {
                return item != "";
            }).join(';');
            GM_setValue(downloaded_listName, strlist2);
            document.getElementById(buttonName).value = GM_getValue(downloaded_listName, '').split(';').indexOf(href) >= 0 ? 'UnMark' : 'Mark';
        }


        let buttonBlockName = "btn_block_" + i
        let btn_block = document.createElement('input');
        btn_block.setAttribute('type', 'button');
        btn_block.setAttribute('id', buttonBlockName);
        btn_block.setAttribute('value', isBlocked ? 'UnBlock' : 'Block');
        btn_block.setAttribute('class', 'super normal button');
        button_container.appendChild(btn_block);
        // onclick 传递 href
        document.getElementById(buttonBlockName).onclick = function () {
            let strlist = GM_getValue(blocked_listName, "")
            let isBlocked = strlist.split(';').indexOf(href) >= 0
            if (isBlocked) {
                GM_setValue(blocked_listName, strlist.replace(';' + href, ''));
                styleTarget.style = ""
            } else {
                GM_setValue(blocked_listName, strlist + ';' + href);
                styleTarget.style = "background: orangered;"
            }
            // 去重
            let strlist2 = [...new Set(GM_getValue(blocked_listName, "").split(';'))].filter(function (item, index, array) {
                return item != "";
            }).join(';');
            document.getElementById(buttonBlockName).value = GM_getValue(blocked_listName, '').split(';').indexOf(href) >= 0 ? 'UnBlock' : 'Block';
        }

        // 添加一个按钮,复制title到剪贴板
        let buttonCopyName = "btn_copy_" + i
        let btn_copy = document.createElement('input');
        btn_copy.setAttribute('type', 'button');
        btn_copy.setAttribute('id', buttonCopyName);
        btn_copy.setAttribute('value', 'Copy');
        btn_copy.setAttribute('class', 'super normal button');
        button_container.appendChild(btn_copy);
        document.getElementById(buttonCopyName).onclick = function () {
            GM_setClipboard(title);
        }
    }

    // delete all
    //GM_deleteValue('red-list');console.log('list:' + GM_getValue('red-list', 'empty'));return;

    let path = location.pathname
    let downloaded_list = GM_getValue(downloaded_listName, "").split(';');
    let blocked_list = GM_getValue(blocked_listName, "").split(';');

    if (path.startsWith('/list/')) {
        // 帖子详情页
        let ul = document.getElementById('contList');
        // 添加导出按钮
        let expbuttonName = "btn_exp"
        let button_container = document.getElementsByClassName('book-list')[0];
        let btn_down = document.createElement('input');
        btn_down.setAttribute('type', 'button');
        btn_down.setAttribute('id', expbuttonName);
        btn_down.setAttribute('value', '导出下载列表');
        btn_down.setAttribute('class', 'super normal button');
        button_container.insertBefore(btn_down, ul);
        // onclick 传递 href
        document.getElementById(expbuttonName).onclick = function () {
            let str1 = GM_getValue(downloaded_listName, "")
            let str2 = GM_getValue(blocked_listName, "")
            // 配置字符串
            let stringData = str1 + "||^^||" + str2
            // dada 表示要转换的字符串数据，type 表示要转换的数据格式
            const blob = new Blob([stringData], {
                type: "text/plain;charset=utf-8"
            })
            // 根据 blob生成 url链接
            const objectURL = URL.createObjectURL(blob)
            // 创建一个 a 标签Tag
            const aTag = document.createElement('a')
            // 设置文件的下载地址
            aTag.href = objectURL
            // 设置保存后的文件名称 + 日期时间
            aTag.download = "漫画柜筛选列表" + new Date().toLocaleDateString() + "_" + new Date().toLocaleTimeString() + ".txt"
            // 给 a 标签添加点击事件
            aTag.click()
            // 释放一个之前已经存在的、通过调用 URL.createObjectURL() 创建的 URL 对象。
            // 当你结束使用某个 URL 对象之后，应该通过调用这个方法来让浏览器知道不用在内存中继续保留对这个文件的引用了。
            URL.revokeObjectURL(objectURL)
        }


        // 添加导入按钮
        let impbuttonName = "btn_imp"
        let btn_imp = document.createElement('input');
        btn_imp.setAttribute('type', 'button');
        btn_imp.setAttribute('id', impbuttonName);
        btn_imp.setAttribute('value', '导入下载列表');
        btn_imp.setAttribute('class', 'super normal button');
        button_container.insertBefore(btn_imp, ul);
        document.getElementById(impbuttonName).onclick = function () {
            // 弹出一个输入框，输入之前导出的配置字符串
            let stringData = prompt("请复制之前导出的文件内容到此", "")
            let list = stringData.split("||^^||")
            if (list.length != 2) {
                alert("导入失败，数据格式不正确")
                return
            }
            let downloaded_list = list[0].split(";")
            // 去重
            downloaded_list = [...new Set(downloaded_list)]
            let blocked_list = list[1].split(";")
            blocked_list = [...new Set(blocked_list)]
            GM_setValue(downloaded_listName, downloaded_list.join(";"))
            GM_setValue(blocked_listName, blocked_list.join(";"))
            alert("导入成功，请刷新页面")
        }



        // 取出所有的li
        let lis = ul.getElementsByTagName('li');
        let len = lis.length;
        for (let i = 0; i < len; i++) {
            let href = lis[i].getElementsByClassName('bcover')[0].getAttribute('href');
            let title = lis[i].getElementsByClassName('bcover')[0].getAttribute('title');
            // 取出 class 为 updateon 的 span 的内容，里面内容为“更新于：2023-02-19<em>8.7 </em>”
            let updateon = lis[i].getElementsByClassName('updateon')[0]
            let datestr = updateon.innerHTML;
            // 获取评分
            let score = parseFloat(updateon.getElementsByTagName('em')[0].innerHTML)
            score = parseFloat(score)
            // 正则匹配出 datestr 中格式为 2019-10-20 的日期
            let date = datestr.match(/\d{4}-\d{2}-\d{2}/)[0]
            // 根据评分和日期判断是否需要屏蔽
            // 日期不超过 1 个月的
            let date1 = new Date(date)
            let date2 = new Date()
            let days = (date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24)

            let isDownloaded = downloaded_list.indexOf(href) >= 0
            let isBlocked = blocked_list.indexOf(href) >= 0

            let styleTarget = lis[i]

            if (isDownloaded) {
                styleTarget.style = "background: greenyellow;border: 2px solid greenyellow;margin-right: 24px;"
            } else if (isBlocked) {
                styleTarget.style = "background: orangered;border: 2px solid orangered;margin-right: 24px;"
            } else if (days < 30) {
                // 最近有更新，可能是未完结，标记为黄色外框
                styleTarget.style = "border: 2px solid yellow;margin-right: 24px;"
            } else if (score < 6) {
                // 评分低于 6，标记为红色外框
                styleTarget.style = "border: 2px solid red;margin-right: 24px;"
            } else if (score > 9) {
                // 高分，标记为绿色外框
                styleTarget.style = "border: 2px solid #8eefdf;margin-right: 24px;"
            }
            else {
                styleTarget.style = "border: 2px solid #35ff0000;margin-right: 24px;"
            }
            let button_container = styleTarget.getElementsByClassName('updateon')[0];
            addButtons(button_container, href, title, i, isDownloaded, isBlocked, styleTarget)
        }
    }
    else if (path.startsWith('/comic/')) {
        // 详情页
        let button_container = document.getElementsByClassName('book-btn')[0];
        let as = document.getElementsByClassName('crumb')[0].getElementsByTagName('a');
        let title = as[as.length - 1].innerHTML
        let href = as[as.length - 1].getAttribute('href')
        let isDownloaded = downloaded_list.indexOf(href) >= 0
        let isBlocked = blocked_list.indexOf(href) >= 0
        let styleTarget = document.getElementsByClassName('book-cont')[0]
        console.log(isDownloaded, isBlocked)
        if (isDownloaded) {
            styleTarget.style = "background: greenyellow;"
        } else if (isBlocked) {
            styleTarget.style = "background: orangered;"
        }
        addButtons(button_container, href, title, 0, isDownloaded, isBlocked, styleTarget)
    }
})();
