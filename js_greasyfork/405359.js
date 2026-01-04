// ==UserScript==
// @name            切换百度谷歌搜索结果
// @name            BaiduGoogleResultSwitcher
// @namespace       https://github.com/NiaoBlush/BaiduGoogleSwitcher
// @version         1.0
// @description     在百度中点击按钮以使用相同关键词在google搜索。在google中点击按钮以使用相同关键词在百度中搜索。
// @author          NiaoBlush
// @license         MIT
// @grant           none
// @include         https://www.google.com/search?*
// @include         https://www.baidu.com/s?*
// @downloadURL https://update.greasyfork.org/scripts/405359/%E5%88%87%E6%8D%A2%E7%99%BE%E5%BA%A6%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/405359/%E5%88%87%E6%8D%A2%E7%99%BE%E5%BA%A6%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const switcherBtnId = "baidu-google-switcher-btn-id";
    const site = getCurrentSite();

    let parent;
    let btnText;
    let logoUrl;
    if (site === "baidu") {
        parent = document.getElementsByClassName("s_tab_inner")[0];
        btnText = "Google一下";
        logoUrl = "https://www.google.com/favicon.ico";
    } else if (site === "google") {
        parent = document.getElementsByTagName("g-header-menu")[1].parentElement;
        btnText = "百度一下";
        logoUrl = "https://www.baidu.com/favicon.ico";
    }

    createButton(parent, btnText, logoUrl);

    /**
     * 创建按钮并插入
     * @param parent 父元素
     * @param btnText 按钮文本
     * @param logoUrl 图标url
     */
    function createButton(parent, btnText, logoUrl) {
        const imgSize = 16;

        let className = parent.lastElementChild.className;
        let button = document.createElement("a");
        button.className = className;
        button.id = switcherBtnId;
        button.style.width = "100px"
        button.style.cursor = "pointer";
        button.onclick = () => redirect();

        let img = document.createElement("img");
        img.src = logoUrl;
        img.style.height = `${imgSize}px`;
        img.style.width = `${imgSize}px`;

        let text = document.createElement("span");
        text.innerText = btnText;

        if (logoUrl) {
            button.appendChild(img);
        }
        button.appendChild(text);
        parent.appendChild(button);
    }

    /**
     * 获取当前网站
     * @returns {string} baidu | google
     */
    function getCurrentSite() {
        if (location.hostname.indexOf("baidu") > -1) {
            return "baidu";
        } else if (location.hostname.indexOf("google") > -1) {
            return "google";
        } else {
            return "unknown host";
        }
    }

    /**
     * 获取当前关键字
     * @returns {string} 关键字
     */
    function getKeyword() {
        const urlParams = new URLSearchParams(window.location.search);
        let keyword = "";
        if (site === "baidu") {
            keyword = urlParams.get("wd");
        } else if (site === "google") {
            keyword = urlParams.get("q");
        }
        return keyword;
    }

    /**
     * 重定向
     */
    function redirect() {
        document.getElementById(switcherBtnId).innerText = "redirecting";
        const urlParams = new URLSearchParams(window.location.search);
        let url = "";
        if (site === "google") {
            url = `https://www.baidu.com/s?wd=${getKeyword()}`;
        } else if (site === "baidu") {
            url = `https://www.google.com/search?q=${getKeyword()}`;
        }
        if (url) {
            location.href = url;
        }
    }

})();
