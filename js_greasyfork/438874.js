// ==UserScript==
// @name         🔥百度主页伪装成谷歌🔥
// @namespace    com.zhaolei
// @version      1.0
// @description  🐶把百度搜索伪装成谷歌搜索
// @author       赵磊
// @match        https://www.baidu.com/
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/438874/%F0%9F%94%A5%E7%99%BE%E5%BA%A6%E4%B8%BB%E9%A1%B5%E4%BC%AA%E8%A3%85%E6%88%90%E8%B0%B7%E6%AD%8C%F0%9F%94%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/438874/%F0%9F%94%A5%E7%99%BE%E5%BA%A6%E4%B8%BB%E9%A1%B5%E4%BC%AA%E8%A3%85%E6%88%90%E8%B0%B7%E6%AD%8C%F0%9F%94%A5.meta.js
// ==/UserScript==

(function() {
    var explorer = window.navigator.userAgent;
    'use strict';
    // 移除元素方法
    function removeElementsById(ids) {
        for (const e of ids) {
            if (typeof e == 'string') {
                document.getElementById(e).remove();
            }
        }
    }
    function changeBaidu(className) {
        let resultCount = document.getElementsByClassName(className)[0]
        resultCount.innerText = resultCount.innerText.replace(/^百度/, '谷歌')
    }
    let needToRemoveElementIds = [];
    // 修改搜索框文本
    let searchButton = document.getElementById('su')
    searchButton.setAttribute('value', '谷歌一下')
    // 更改图片
    let img = document.getElementById("s_lg_img");
    // 换源
    img.setAttribute('src', 'https://logos-world.net/wp-content/uploads/2020/09/Google-Logo.png');
    // 设置宽高
    img.setAttribute('width', '272');
    img.setAttribute('height', '150');
    // 修改输入内容后页面的图标
    let inpImg = document.getElementsByClassName('index-logo-src')[0]
    // 换源
    inpImg.setAttribute('src', 'https://logos-world.net/wp-content/uploads/2020/09/Google-Logo.png');
    // 设置宽高
    inpImg.setAttribute('title', '谷歌一下')
    // 需要移除的元素id
    if (explorer.indexOf("Chrome") >= 0) {
        needToRemoveElementIds.push('s_mp', 's-top-left', 'bottom_layer', 'lm-new', 's_main')
    } else if (explorer.indexOf("Firefox") >= 0) {
        needToRemoveElementIds.push('s-top-left', 'bottom_layer', 's-hotsearch-wrapper', 's_side_wrapper', 's_main');
    }
    // 修改标签标题
    document.title = 'Google';
    removeElementsById(needToRemoveElementIds);
})();