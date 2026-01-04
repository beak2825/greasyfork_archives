// ==UserScript==
// @name         arxiv or ar5iv translate tool that does not change the format翻译后不改变原文格式的插件 
// @namespace    http://tampermonkey.net/
// @version      2024-09-10
// @description  本插件的目的是在arxiv.org或把arxiv的html页面中的arxiv改成ar5iv就可以进行排版，不翻译公式，点击edge浏览器或者谷歌浏览器自带的翻译就可以进行全文翻译且公式格式不混乱，我是李守聪，在做文生视频方向，经常看论文所以搞了个插件以避免格式混乱的翻译，我还在承接app、小程序、网站开发，可以联系我：+86-18315852058或者+86-19854198980
// @author       李守聪https://www.shunwoit.com
// @match        https://arxiv.org/*
// @match        https://ar5iv.labs.arxiv.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/507772/arxiv%20or%20ar5iv%20translate%20tool%20that%20does%20not%20change%20the%20format%E7%BF%BB%E8%AF%91%E5%90%8E%E4%B8%8D%E6%94%B9%E5%8F%98%E5%8E%9F%E6%96%87%E6%A0%BC%E5%BC%8F%E7%9A%84%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/507772/arxiv%20or%20ar5iv%20translate%20tool%20that%20does%20not%20change%20the%20format%E7%BF%BB%E8%AF%91%E5%90%8E%E4%B8%8D%E6%94%B9%E5%8F%98%E5%8E%9F%E6%96%87%E6%A0%BC%E5%BC%8F%E7%9A%84%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

// 获取所有class为ltx_Math和ltx_equationgroup的元素
var mathElems = document.querySelectorAll('.ltx_Math, .ltx_equationgroup, .ltx_equation, .ltx_figure, .ltx_table');

// 遍历所有元素
for (var i = 0; i < mathElems.length; i++) {
  // 给元素添加translate属性
  mathElems[i].setAttribute('translate', 'no');

  // 获取元素内部所有标签
  var tags = mathElems[i].getElementsByTagName('*');

  // 遍历所有标签
  for (var j = 0; j < tags.length; j++) {
    // 给标签添加translate属性
    tags[j].setAttribute('translate', 'no');
  }
}

    // 获取所有class既是ltx_caption又是ltx_centering的元素
var elems = document.querySelectorAll('.ltx_caption.ltx_centering');

// 遍历所有元素
for (let i = 0; i < elems.length; i++) {
  // 给元素添加属性，例如添加translate属性
  elems[i].setAttribute('translate', 'no');
}
})();