// ==UserScript==
// @name         Userscript1111
// @namespace    test222
// @version      0.4
// @description  油猴脚本测试
// @author       dante
// @match        file:///C:/Users/Neusoft/Desktop/%E6%96%B0%E5%BB%BA%E6%96%87%E6%9C%AC%E6%96%87%E6%A1%A3.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481350/Userscript1111.user.js
// @updateURL https://update.greasyfork.org/scripts/481350/Userscript1111.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
$(document).ready(function() {
$('body').prepend('<input type="button" value="button" id="button">');
$("#button").on("click", function(){
  Object.keys(values).forEach(function(key){
    $("#" + key).val(values[key]);
  });
});
});
     var values = {
  text1:"文本框内容",
  //  select1:"选项1",   可能存在选择不到的问题，可以选择使用option的值来辅助
   select1: 2,
   textarea1: "多行输入",
};
})();