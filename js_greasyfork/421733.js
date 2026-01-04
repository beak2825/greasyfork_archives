// ==UserScript==
// @name         解除复制劫持
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       cool、wen
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421733/%E8%A7%A3%E9%99%A4%E5%A4%8D%E5%88%B6%E5%8A%AB%E6%8C%81.user.js
// @updateURL https://update.greasyfork.org/scripts/421733/%E8%A7%A3%E9%99%A4%E5%A4%8D%E5%88%B6%E5%8A%AB%E6%8C%81.meta.js
// ==/UserScript==

// 借鉴代码 ：https://www.cnblogs.com/colima/p/8479310.html
// 如若侵权，请联系删除

(function() {
  document.addEventListener('copy',(e)=>{
    e.preventDefault();
    e.stopPropagation();
    console.info('触发复制事件');
    /**
      返回一个Selection对象，表示用户选择的文本范围或光标的当前位置
      Selection.getRangeAt返回一个包含当前选区内容的区域对象
    */
    let text = window.getSelection().toString();
    // console.info('text ： ' + window.getSelection().toString());
    let node = document.createElement('div');
    // console.info('node ： ' + node.innerHTML);
    // cloneContents方法把内容复制到一个DocumentFragment对象
    node.appendChild(window.getSelection().getRangeAt(0).cloneContents());
    /**
       ClipboardEvent.clipboardData 属性保存了一个 DataTransfer 对象，这个对象可用于：
       描述哪些数据可以由 cut 和 copy 事件处理器放入剪切板，通常通过调用 setData(format, data) 方法；
       获取由 paste 事件处理器拷贝进剪切板的数据，通常通过调用 getData(format) 方法
    */
    if(e.clipboardData){
      e.clipboardData.setData("text/html", node.innerHTML);
      e.clipboardData.setData("text/plain",text);
    }else if(window.clipboardData){
      return window.clipboardData.setData("text", text);
    }
  })
}());