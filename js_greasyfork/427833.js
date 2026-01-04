// ==UserScript==
// @name         公众号快捷编辑自动回复test
// @namespace    http://tampermonkey.net/test
// @version      1.0.0
// @description  公众号web管理页面，快捷编辑自动回复内容
// @author       Chensx
// @match        https://mp.weixin.qq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427833/%E5%85%AC%E4%BC%97%E5%8F%B7%E5%BF%AB%E6%8D%B7%E7%BC%96%E8%BE%91%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8Dtest.user.js
// @updateURL https://update.greasyfork.org/scripts/427833/%E5%85%AC%E4%BC%97%E5%8F%B7%E5%BF%AB%E6%8D%B7%E7%BC%96%E8%BE%91%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8Dtest.meta.js
// ==/UserScript==

(function() {
    'use strict'

    // 获取token
    let token = getUrlParam('token');

    // 定义自动回复关键字
    // let arrKeys = ['上学', '百度'];
    let arrKeys = ['百度'];
    let editUrl = `/advanced/autoreply?t=ivr/keywords&action=searchreply&query={key}&token=${token}&lang=zh_CN`;
    let menuHtml = `
        <li class="weui-desktop-sub-menu__item" title="{key}" style="line-height: 23px;">
            <a class="weui-desktop-menu__link js_nav_item " data-new="0" data-id="10006" href="${editUrl}">
                <span class="weui-desktop-menu__link__inner">
                    <span class="weui-desktop-menu__name">{key}</span>
                </span>
            </a>
        </li>
    `;

    // 菜单【自动回复】
    let ulAutoReply = document.querySelector('.weui-desktop-menu_create > .weui-desktop-sub-menu');
    // console.log(ulAutoReply);
    if (!ulAutoReply) {
        console.warn('找不到菜单【自动回复】，脚本退出！');
    }
    // 插入子菜单
    for (let i = 0; i < arrKeys.length; i++) {
        let key = arrKeys[i];
        let menu = menuHtml.replace(/{key}/gm, key);

        console.log(menuHtml, menu);

        let li = document.createElement('li');
        ulAutoReply.insertBefore(li, ulAutoReply.childNodes[3]);
        li.outerHTML = menu;
    }

    /** ************** 公共函数 ************** **/
    // 获取url中的参数
    function getUrlParam(name) {
        let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'); // 构造一个含有目标参数的正则表达式对象
        let r = window.location.search.substr(1).match(reg); // 匹配目标参数
        if (r != null) return unescape(r[2]);
        return null; // 返回参数值
    }
})()
