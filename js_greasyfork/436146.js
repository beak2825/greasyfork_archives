// ==UserScript==
// @name         【晋江文学城】文章收藏页面展开/收起全部收藏类别
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  此脚本控制界面隐藏行
// @author       QAQ
// @match        http://my.jjwxc.net/backend/favorite.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436146/%E3%80%90%E6%99%8B%E6%B1%9F%E6%96%87%E5%AD%A6%E5%9F%8E%E3%80%91%E6%96%87%E7%AB%A0%E6%94%B6%E8%97%8F%E9%A1%B5%E9%9D%A2%E5%B1%95%E5%BC%80%E6%94%B6%E8%B5%B7%E5%85%A8%E9%83%A8%E6%94%B6%E8%97%8F%E7%B1%BB%E5%88%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/436146/%E3%80%90%E6%99%8B%E6%B1%9F%E6%96%87%E5%AD%A6%E5%9F%8E%E3%80%91%E6%96%87%E7%AB%A0%E6%94%B6%E8%97%8F%E9%A1%B5%E9%9D%A2%E5%B1%95%E5%BC%80%E6%94%B6%E8%B5%B7%E5%85%A8%E9%83%A8%E6%94%B6%E8%97%8F%E7%B1%BB%E5%88%AB.meta.js
// ==/UserScript==

// 展开/收起全部收藏类别
function clickExpan(){
    var btns = document.querySelectorAll('a[id^="open"]');
    if(!btns){
        return;
    }
    for(var i = 0; i < btns.length; i++){
        var btnOpen = btns[i];
        btnOpen.click();
    }
}

// 添加展开/收起按钮
function addButton(){
    var button = document.createElement('button');
    button.addEventListener('click', clickExpan);
    button.textContent='一键展开/收起';
    button.style.cssText ="position: fixed;z-index: 999999;display: flex;top: 35%; right: 20px;";
    document.getElementsByTagName('body')[0].appendChild(button);
}

(function() {
    addButton();
})();
