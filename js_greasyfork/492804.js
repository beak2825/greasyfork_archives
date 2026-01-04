// ==UserScript==
// @name   qiwi.gg卡片宽高修改
// @match  https://qiwi.gg/folder/*
// @grant    GM_addStyle
// @run-at   document-End
// @description 卡片太短文件名显示不全&A大发的流放之路汉化补丁有绿色加粗提示
// @version 0.1
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @namespace https://greasyfork.org/users/302232
// @downloadURL https://update.greasyfork.org/scripts/492804/qiwigg%E5%8D%A1%E7%89%87%E5%AE%BD%E9%AB%98%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/492804/qiwigg%E5%8D%A1%E7%89%87%E5%AE%BD%E9%AB%98%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==
/*- The @grant directive is needed to work around a design change
    introduced in GM 1.0.   It restores the sandbox.
*/
/* globals jQuery， $， waitForKeyElements */

GM_addStyle ( `
    .page_SubFolder__HvGOF {
    height: 120.8px;
    width: 520.8px;
    }
` );
GM_addStyle ( `
    .page_SecondContainer__auGtW {
    margin-left: 50px;
    margin-right: 50px;
    max-width: 90000px;
    }
` );


var regex = new RegExp('.*双切.*');

const aList = document.querySelectorAll('a[class*="page_SubFolder"]');
var link = "";
aList.forEach(a => {
    var childs = a.children;
    if(regex.test(childs[1].innerText))
    {
        childs[1].style.color = 'green';
        childs[1].style.fontWeight = 700;
        link = a.href;
        console.log(link);
    }
});
if(link != "")
{
    var $input = $('<a target="_blank" aria-label="Download file" class="page_SubFolder__HvGOF" style="float: right;width: 140px;height: 40px;bottom: 220px;right: 20px;"><p class="page_Paragraph__onYpD" style="color: green;font-weight: 550;font-size:20px;padding-top: 8px;padding-bottom: 8px;padding-left: 16px;padding-right: 16px;">复制<br>密码<br>下载</p></a>');
    $input.appendTo($("body"));
}

$input.click(function (e) {
   e.preventDefault();
   var copyText = 'amsco'

   document.addEventListener('copy', function(e) {
      e.clipboardData.setData('text/plain', copyText);
      e.preventDefault();
   }, true);

   document.execCommand('copy');

    let a= document.createElement('a');
    a.target= '_blank';
    a.href= link;
    a.click();
 });









