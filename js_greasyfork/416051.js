// ==UserScript==
// @name         chinahrt自动播放插件-改
// @include      http://web.chinahrt.com
// @include      https://web.chinahrt.com
// @version      1.0
// @description  自动播放教学视频，并移除失去焦点自动暂停的功能,请将web.chinahrt.com与videoadmin.chinahrt.com.cn，videoadmin.chinahrt.com站点设置FLASH信任
// @author       bakerbunker
// @match        http://videoadmin.chinahrt.com.cn/videoPlay/play*
// @match        http://videoadmin.chinahrt.com/videoPlay/play*
// @match        https://videoadmin.chinahrt.com.cn/videoPlay/play*
// @match        https://videoadmin.chinahrt.com/videoPlay/play*
// @grant        none
// @namespace https://greasyfork.org/users/309510
// @downloadURL https://update.greasyfork.org/scripts/416051/chinahrt%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E6%8F%92%E4%BB%B6-%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/416051/chinahrt%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E6%8F%92%E4%BB%B6-%E6%94%B9.meta.js
// ==/UserScript==
$(document).ready(function () {
    setTimeout(() => {
        console.clear();
        setInterval(() => {
            if (!CKobject.getObjectById('ckplayer_video').getStatus().play) {
                console.log("视频未在播放中，即将自动开始播放");
                // setTimeout(() => {
                if(document.getElementsByClassName('optModeA')[0]){
                    document.getElementsByClassName('optModeA')[0].click();
                }
                CKobject.getObjectById('ckplayer_video').playOrPause();
                window.onfocus = function () { console.log('原始事件已被替换') };
                window.onblur = function () { console.log('原始事件已被替换') };
                // }, 5000);
            }
        }, 7000);
    }, 5000);
})