// ==UserScript==
// @name            临时更改谷歌搜索结果中英文
// @name            Google Result Language Switcher
// @namespace       https://github.com/NiaoBlush/GoogleResultLanguageSwitcher
// @version         1.1
// @description     将google结果切换为中文结果, 不改变Google界面语言
// @author          NiaoBlush
// @license         MIT
// @grant           none
// @include         https://www.google.com/search?*
// @downloadURL https://update.greasyfork.org/scripts/405195/%E4%B8%B4%E6%97%B6%E6%9B%B4%E6%94%B9%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E4%B8%AD%E8%8B%B1%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/405195/%E4%B8%B4%E6%97%B6%E6%9B%B4%E6%94%B9%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E4%B8%AD%E8%8B%B1%E6%96%87.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const urlParams = new URLSearchParams(window.location.search);
    const currentLang = urlParams.get("lr") || "en";
    const btnId = "btn-language-switcher";

    let parent = document.getElementById("hdtb-tls").parentElement;
    let className = parent.lastElementChild.className;

    let button = document.createElement("a");
    button.innerHTML = currentLang === 'en' ? "<font color=#5f6368>简体中文结果</font>" : "<font color=#5f6368>结果不限语言</font>";
    button.className = className;
    button.id = btnId;
    button.onclick = () => reload();

    parent.appendChild(button);

    /**
     * 重载页面
     */
    function reload() {
        document.getElementById(btnId).innerHTML = "<font color=#5f6368>正在重新加载</font>";
        if (currentLang === 'lang_zh-CN') {
            urlParams.delete("lr");
        } else {
            urlParams.append("lr", "lang_zh-CN")
        }
        const newUrl = `${location.origin}${location.pathname}?${urlParams.toString()}`;
        location.href = newUrl;
    }

})();


