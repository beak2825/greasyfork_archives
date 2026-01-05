// ==UserScript==
// @name        test
// @namespace   123
// @include     https://www.baidu.com/
// @version     1
// @grant       none
// @description 实时获取页面输入框内容
// @downloadURL https://update.greasyfork.org/scripts/28178/test.user.js
// @updateURL https://update.greasyfork.org/scripts/28178/test.meta.js
// ==/UserScript==




//实时去判断款号  
$('#kw').on('input propertychange', function () {
  //alert('ok');
  var res = $(this).val();
  var arr = '粤BLL021,粤BLL022,粤BLL023,粤BLL024,粤BLL025';
  if (arr.indexOf(res) > -1) {
    alert('Cts中包含Text字符串');
  }
});
