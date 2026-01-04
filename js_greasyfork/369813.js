// ==UserScript==
// @name         mebook网站自动复制验证码并跳转
// @namespace    http://mebook.cc/
// @version      1.1
// @description  自动复制并跳转网页
// @author       Aaron nicolana
// @match        http://mebook.cc/download.php?id=*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @require      https://cdn.bootcss.com/clipboard.js/2.0.1/clipboard.min.js
// @downloadURL https://update.greasyfork.org/scripts/369813/mebook%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6%E9%AA%8C%E8%AF%81%E7%A0%81%E5%B9%B6%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/369813/mebook%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6%E9%AA%8C%E8%AF%81%E7%A0%81%E5%B9%B6%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

$(document).ready(function(){
    var url = $('a:eq(1)').attr('href');
    var text = $(".desc:first p:eq(5)").text();
    var n = text.search('百度网盘密码：');
    var checkCode = text.substr(n + 7, 4);
    //window.copy(checkCode);
    var clipboard = new ClipboardJS('div', {
        text:function(){
            return checkCode;
        }
    });
    clipboard.on('success', function(e){
        console.log('Action:', e);
        window.location.href = url;
    });
    clipboard.on('error', function(e){
        console.log('Action:',e);
    });
})