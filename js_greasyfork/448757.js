// ==UserScript==
// @name         选择内容一键跳转翻译
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  选择内容,右键菜单找到油猴脚本,翻译
// @author       YueLi
// @match        *://*/*
// @license MIT
// @run-at context-menu

// @downloadURL https://update.greasyfork.org/scripts/448757/%E9%80%89%E6%8B%A9%E5%86%85%E5%AE%B9%E4%B8%80%E9%94%AE%E8%B7%B3%E8%BD%AC%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/448757/%E9%80%89%E6%8B%A9%E5%86%85%E5%AE%B9%E4%B8%80%E9%94%AE%E8%B7%B3%E8%BD%AC%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function() {

    // 获取当前选择的内容
    function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
    }

    // volcengine 字节的火山引擎
    const volcengine_api = "https://translate.volcengine.com/translate?category=&home_language=zh&source_language=ja&target_language=zh&text=";

    // 谷歌翻译
    const google_api = "https://translate.google.cn/?hl=en&sl=en&tl=zh-CN&op=translate&text="

    //百度翻译
    const baidu_api = "https://fanyi.baidu.com/translate?aldtype=16047&keyfrom=baidu&smartresult=dict&lang=auto2zh#en/zh/"

    window.location.href = volcengine_api + getSelectionText();
})();