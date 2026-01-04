// ==UserScript==
// @name         純美蘋果園舊頁面重新導向
// @name:zh-CN   纯美苹果园旧页面重定向
// @namespace    http://tampermonkey.net/
// @description  將過時的登入畫面與伺服器網址重導向為新的頁面
// @description:zh-CN  将过时的登录画面与服务器网址重导向为新的页面
// @version      1.0.3
// @author       Max
// @icon         https://www.goddessfantasy.net/favicon.gif
// @match        https://goddessfantasy.net/*
// @match        http://45.79.87.129/*
// @license      MPL2.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533697/%E7%B4%94%E7%BE%8E%E8%98%8B%E6%9E%9C%E5%9C%92%E8%88%8A%E9%A0%81%E9%9D%A2%E9%87%8D%E6%96%B0%E5%B0%8E%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/533697/%E7%B4%94%E7%BE%8E%E8%98%8B%E6%9E%9C%E5%9C%92%E8%88%8A%E9%A0%81%E9%9D%A2%E9%87%8D%E6%96%B0%E5%B0%8E%E5%90%91.meta.js
// ==/UserScript==

class Redirector {
    constructor() {
        this.oldLogInUrl = 'https://goddessfantasy.net/';
        this.newHomeUrl = 'https://www.goddessfantasy.net/bbs/index.php';
        this.oldServerUrl = 'http://45.79.87.129/';
        this.newServerUrl = 'https://www.goddessfantasy.net/';
        this.init();
    }

    init() {
        const currentUrl = window.location.href;

        if (currentUrl === this.oldLogInUrl) {
            window.location.replace(this.newHomeUrl);
        }else if (currentUrl.includes(this.oldServerUrl)) {
            const newUrl = currentUrl.replace(this.oldServerUrl, this.newServerUrl);
            window.location.replace(newUrl);
        }
    }
}

new Redirector();