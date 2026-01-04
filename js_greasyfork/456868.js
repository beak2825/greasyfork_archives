// ==UserScript==
// @name         抖音快手视频下载
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  发现网页果然是开放的技术，抖音视频在网页版随手一个F12就能下载，就随手做了这个脚本，随手分享一下，不知道能活多久。然后我又做了快手版本。用于抖音/快手网页版。
// @author       Fyratree
// @match        https://www.douyin.com/*
// @match        https://www.kuaishou.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM.registerMenuCommand
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/456868/%E6%8A%96%E9%9F%B3%E5%BF%AB%E6%89%8B%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/456868/%E6%8A%96%E9%9F%B3%E5%BF%AB%E6%89%8B%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function download () {
        if (window.location.host == 'www.douyin.com') { //抖音
            let element //当前视频元素
            let elements = document.querySelectorAll('xg-video-container.xg-video-container video') //全部符合条件的视频元素
            if (elements.length < 1 /* 0 */) return //一个视频元素也没有
            else if (elements.length <= 2 /* 1 or 2 */) element = elements[0] //有一个或两个时（此时你用滚轮无法回到上一个视频），第一个应该是当前视频元素
            else /* 3 or 3+ */ element = elements[1] //有三个时（此时你用滚轮可以回到上一个视频），第二个应该是当前视频元素
            window.open(element.lastChild.src) //视频元素下面的最后一个子元素应该是一个source元素，src属性就是视频直链。打开视频直链以后可以播放和下载
        } else if (window.location.host == 'www.kuaishou.com') { //快手
            let element //当前视频元素
            let elements = document.querySelectorAll('div.kwai-player-container-video video') //全部符合条件的视频元素
            if (elements.length < 1 /* 0 */) return //一个视频元素也没有
            else if (elements.length <= 2 /* 1 or 2 */) element = elements[0] //有一个或两个时（此时你用滚轮无法回到上一个视频），第一个应该是当前视频元素
            else /* 3 or 3+ */ element = elements[1] //有三个时（此时你用滚轮可以回到上一个视频），第二个应该是当前视频元素
            window.open(element.src) //视频元素的src属性就是视频直链。打开视频直链以后可以播放和下载
        }
    }

    /*以下代码参考了Picviewer CE+的代码*/
    var _GM_registerMenuCommand //脚本管理器菜单命令注册
    if (typeof GM_registerMenuCommand!='undefined') { //脚本管理器有GM_registerMenuCommand
        _GM_registerMenuCommand=GM_registerMenuCommand;
    } else if (typeof GM!='undefined' && typeof GM.registerMenuCommand!='undefined') { //脚本管理器有GM.registerMenuCommand
        _GM_registerMenuCommand=GM.registerMenuCommand;
    } else { //脚本管理器什么也没有
        _GM_registerMenuCommand=(s,f)=>{};
        console.log('[抖音快手视频下载]当前脚本管理器不支持菜单命令，无法下载视频。')
    }
    /*感谢Picviewer CE+的作者大佬们，写的脚本随便一段代码都可以帮助我这样的小白*/

    _GM_registerMenuCommand('下载或打开当前视频直链', download) //注册菜单命令
})();