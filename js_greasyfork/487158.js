// ==UserScript==
// @license      MIT
// @name         QQ音乐分享链接净化
// @namespace    NoTrackForQQMusic
// @version      0.2.5
// @description  QQ音乐分享链接无用参数过多，还自动唤起app！这怎么能忍，净化它！（0.2.5更新：新增参数移除：encrypt_uin）
// @author       淫乱
// @match        http*://*.y.qq.com/v8/playsong.html?*
// @match        http*://*.y.qq.com/n2/m/share/*
// @match        http*://*.y.qq.com/n2/m/musiclite/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=y.qq.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487158/QQ%E9%9F%B3%E4%B9%90%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/487158/QQ%E9%9F%B3%E4%B9%90%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 清理Url参数列表。此步已调用自定义函数清除参数
    const clearUrl = removeURLParameters(['ADTAG', 'appshare', 'appversion', 'channelId', 'hosteuin', 'platform', '_wv', 'type', 'appsongtype', 'app_type', 'media_mid', 'source', 'songtype', 'encrypt_uin']);

    // 定义 finalUrl，最终跳转Url。
    var finalUrl;

    // 获取URL查询字符串中的'openinqqmusic'参数值
    let openinqqmusic = (new URLSearchParams(window.location.search.toLowerCase())).get('openinqqmusic');

    // 获取当前 URL 中的查询参数
    const urlParams = new URLSearchParams(window.location.search);

    // 检查'openinqqmusic'值是否为1
    if (openinqqmusic == "1") {
        // 构建新的URL，将'openinqqmusic'参数值改为0
        finalUrl = clearUrl.replace(/openinqqmusic=1/, "openinqqmusic=0");
    }
    // 检查是否有'ADTAG'。如有说明没去除过参数，需要跳转。
    else if (urlParams.has('ADTAG')) {
        finalUrl = clearUrl;
    }

    // 重定向到修改后的URL，加判断避免重复跳转。
    if (finalUrl != null) {
        window.location.href = finalUrl;
    }
})();

// 移除URL参数的函数
function removeURLParameters(paramsToRemove) {

    // 定义三个变量：修改过的Url、当前Url和当前Url的无参Url
    var modifiedUrl;
    const currentUrl = window.location.href;
    const urlWithoutParams = currentUrl.split('?')[0]; // 获取问号前的部分

    // 移除指定的参数
    const modifiedParams = new URLSearchParams(window.location.search);
    paramsToRemove.forEach(param => modifiedParams.delete(param));

    // 让QQ音乐简洁版分享链接定向回QQ音乐
    if (urlWithoutParams === "https://i.y.qq.com/n2/m/musiclite/playsong/index.html") {

        // 构建QQ音乐版本的URL
        modifiedUrl = `https://i.y.qq.com/v8/playsong.html?${modifiedParams.toString()}`;
    }

    // QQ音乐的处理
    else {
        // 构建无参数的URL
        modifiedUrl = `${urlWithoutParams}?${modifiedParams.toString()}`;
    }
    // 返回最终处理好的Url
    return modifiedUrl;
}