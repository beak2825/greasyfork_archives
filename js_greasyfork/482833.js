// ==UserScript==
// @name      Github releases mirror
// @version      2.5.0
// @author       X.I.U
// @description  github releases高速下载按钮
// @description:en  High-speed download of Release
// @match        *://github.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAACEUExURUxpcRgWFhsYGBgWFhcWFh8WFhoYGBgWFiUlJRcVFRkWFhgVFRgWFhgVFRsWFhgWFigeHhkWFv////////////r6+h4eHv///xcVFfLx8SMhIUNCQpSTk/r6+jY0NCknJ97e3ru7u+fn51BOTsPCwqGgoISDg6empmpoaK2srNDQ0FhXV3eXcCcAAAAXdFJOUwCBIZXMGP70BuRH2Ze/LpIMUunHkpQR34sfygAAAVpJREFUOMt1U+magjAMDAVb5BDU3W25b9T1/d9vaYpQKDs/rF9nSNJkArDA9ezQZ8wPbc8FE6eAiQUsOO1o19JolFibKCdHGHC0IJezOMD5snx/yE+KOYYr42fPSufSZyazqDoseTPw4lGJNOu6LBXVUPBG3lqYAOv/5ZwnNUfUifzBt8gkgfgINmjxOpgqUA147QWNaocLniqq3QsSVbQHNp45N/BAwoYQz9oUJEiE4GMGfoBSMj5gjeWRIMMqleD/CAzUHFqTLyjOA5zjNnwa4UCEZ2YK3khEcBXHjVBtEFeIZ6+NxYbPqWp1DLKV42t6Ujn2ydyiPi9nX0TTNAkVVZ/gozsl6FbrktkwaVvL2TRK0C8Ca7Hck7f5OBT6FFbLATkL2ugV0tm0RLM9fedDvhWstl8Wp9AFDjFX7yOY/lJrv8AkYuz7fuP8dv9izCYH+x3/LBnj9fYPBTpJDNzX+7cAAAAASUVORK5CYII=
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @grant        window.onurlchange
// @sandbox      JavaScript
// @license      GPL-3.0 License
// @run-at       document-end
// @namespace    https://greasyfork.org/scripts/412245
// @supportURL   https://github.com/XIU2/UserScript
// @homepageURL  https://github.com/XIU2/UserScript
// @downloadURL https://update.greasyfork.org/scripts/482833/Github%20releases%20mirror.user.js
// @updateURL https://update.greasyfork.org/scripts/482833/Github%20releases%20mirror.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var backColor = '#ffffff', fontColor = '#888888';
    const download_url = [
        ['https://dl.moapp.me/https://github.com', 'motrix镜像', '项目地址:&#10;https://motrix.app/']
    ], style = ['padding:0 6px; margin-right: -1px; border-radius: 2px; background-color: var(--XIU2-back-Color); border-color: rgba(27, 31, 35, 0.1); font-size: 11px; color: var(--XIU2-font-Color);'];
    const mirror_num = 3 //镜像个数
    // Tampermonkey v4.11 版本添加的 onurlchange 事件 grant，可以监控 pjax 等网页的 URL 变化
    if (window.onurlchange === undefined) addUrlChangeEvent();

    var check_show = function(){
        if (location.pathname.indexOf('releases') > -1) {
            addRelease();
        }
    };
    window.addEventListener('urlchange', check_show);

    // Github Git Clone/SSH、Release、Download ZIP 改版为动态加载文件列表，因此需要监控网页元素变化
    const observer = new MutationObserver(check_show);
    observer.observe(document, { childList: true, subtree: true });

    // download_url 随机 n 个加速源
    function get_New_download_url() {
        if (download_url.length < mirror_num) return download_url;
        let shuffled = download_url.slice(0), i = download_url.length, min = i - mirror_num, temp, index;
        while (i-- > min) {index = Math.floor((i + 1) * Math.random()); temp = shuffled[index]; shuffled[index] = shuffled[i]; shuffled[i] = temp;}
        return shuffled.slice(min); // 随机洗牌 download_url 数组并取前 n 个
    }

    // Release
    function addRelease() {
        let html = document.querySelectorAll('.Box-footer'); if (html.length == 0 || location.pathname.indexOf('/releases') == -1) return
        let divDisplay = 'margin-left: -90px;', new_download_url = get_New_download_url();
        if (document.documentElement.clientWidth > 755) {divDisplay = 'margin-top: -3px;margin-left: 8px;display: inherit;';}; // 调整小屏幕时的样式
        for (const current of html) {
            if (current.querySelector('.XIU2-RS')) continue
            current.querySelectorAll('li.Box-row a').forEach(function (_this) {
                let href = _this.href.split(location.host),
                    url = '', _html = `<div class="XIU2-RS" style="${divDisplay}">`;

                for (let i=0;i<new_download_url.length;i++) {
                    if (new_download_url[i][3] !== undefined && url.indexOf('/archive/') !== -1) {
                        url = new_download_url[i][3] + href[1]
                    } else {
                        url = new_download_url[i][0] + href[1]
                    }
                    if (location.host !== 'github.com') url = url.replace(location.host,'github.com')
                    _html += `<a style="${style[0]}" class="btn" href="${url}" title="${new_download_url[i][2]}" rel="noreferrer noopener nofollow">${new_download_url[i][1]}</a>`;
                }
                _this.parentElement.nextElementSibling.insertAdjacentHTML('beforeend', _html + '</div>');
            });
        }
    }


    // 自定义 urlchange 事件（用来监听 URL 变化），针对非 Tampermonkey 油猴管理器
    function addUrlChangeEvent() {
        history.pushState = ( f => function pushState(){
            var ret = f.apply(this, arguments);
            window.dispatchEvent(new Event('pushstate'));
            window.dispatchEvent(new Event('urlchange'));
            return ret;
        })(history.pushState);

        history.replaceState = ( f => function replaceState(){
            var ret = f.apply(this, arguments);
            window.dispatchEvent(new Event('replacestate'));
            window.dispatchEvent(new Event('urlchange'));
            return ret;
        })(history.replaceState);

        window.addEventListener('popstate',()=>{ // 点击浏览器的前进/后退按钮时触发 urlchange 事件
            window.dispatchEvent(new Event('urlchange'))
        });
    }
})();
