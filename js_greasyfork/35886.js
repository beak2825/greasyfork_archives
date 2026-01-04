// ==UserScript==

// @description  自动打开FT中文站的英文页面。FT中文的页面有双语，也只有歪果忍写的文章有英文页面，但双语页面被隐藏了，按钮消失，手动操作麻烦。
// @description  遂想试试搞个自动工具,嗯,通过几个小时解决一个几秒钟就可以解决的问题.
// @description  不会编程，弱鸡一只。第一次为了这个功能，而学习了下JS（编程）基础，也只看了几页书而已，尝试过程还算顺利。
// @description  估计没人会上这个FT中文站吧。。。我真是蛋疼。

// @name         FTChinese URL Replacement
// @namespace    https://greasyfork.org/en/users/161530-nnns
// @version      0.3.3

// @author       NNNS
// @match        http://www.ftchinese.com/story/*
// @exclude      http://www.ftchinese.com/story/*/en*
             //上一行：避免无限循环执行此脚本
// @exclude      http://www.ftchinese.com/story/*/ce*
                  //上一行：双语页面不执行
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35886/FTChinese%20URL%20Replacement.user.js
// @updateURL https://update.greasyfork.org/scripts/35886/FTChinese%20URL%20Replacement.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var oldURL = window.location.href;  //获取页面的url
    var slicedURL = oldURL.slice(0, 40);   //删掉数字后面的字符
    var newURL = slicedURL.padEnd(43, "/en");  //加上后缀
    //window.open(newURL,"newbee");   //打开新窗口
    window.location.href= newURL; //在本窗口打开新网址
})();