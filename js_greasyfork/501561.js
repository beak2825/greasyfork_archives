
// ==UserScript==
// @name         B站复制不附带后缀
// @namespace    http://tampermonkey.net/
// @version      2024-07-23
// @description  del postfix after copy in bilibili
// @author       Villiam
// @match        *://*.bilibili.com/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501561/B%E7%AB%99%E5%A4%8D%E5%88%B6%E4%B8%8D%E9%99%84%E5%B8%A6%E5%90%8E%E7%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/501561/B%E7%AB%99%E5%A4%8D%E5%88%B6%E4%B8%8D%E9%99%84%E5%B8%A6%E5%90%8E%E7%BC%80.meta.js
// ==/UserScript==


(function() {
    'use strict';
    // Your code here...
    const arctile = document.querySelector('.article-content')
    arctile.addEventListener('copy', realizeCopy, {capture: true })
    function realizeCopy(e) {
        // clipboardData 对象是为通过编辑菜单、快捷菜单和快捷键执行的编辑操作所保留的，也就是你复制或者剪切内容
        const v_clipboardData = e.clipboardData || window.clipboardData;
        // 如果 未复制或者未剪切，直接 return
        if(!v_clipboardData) return ;
        // Selection 对象 表示用户选择的文本范围或光标的当前位置。
        // 声明一个变量接收 -- 用户输入的剪切或者复制的文本转化为字符串
        let text = window.getSelection().toString();
        if(text){
            // 如果文本存在，首先取消默认行为
            // 通过调用 clipboardData 对象的 setData(format,data) 方法，设置相关文本
            // format 一个 DOMString 类型 表示要添加到 drag object 的拖动数据的类型
            // data 一个 DOMString 表示要添加到 drag object 的数据
            v_clipboardData.setData('text/plain', text)
            e.preventDefault();
            e.stopPropagation()
        }
    }

})();