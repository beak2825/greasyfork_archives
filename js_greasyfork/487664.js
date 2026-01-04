// ==UserScript==
// @name         微信读书网页版功能综合
// @version      0.3.1
// @namespace    http://tampermonkey.net/
// @description  书籍内容字体修改为苍耳今楷，修改标题等字体，更改背景颜色，更改字体颜色，增减页面宽度，上划隐藏头部侧栏，PC自动滚动，代码复制与图片下载
// @contributor  Li_MIxdown;hubzy;xvusrmqj;LossJ;JackieZheng;das2m;harmonyLife
// @author       SimonDW
// @match        https://weread.qq.com/web/reader/*
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @require      http://cdn.staticfile.org/jquery/1.8.3/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @icon         https://weread.qq.com/favicon.ico
// @grant        GM_log
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_download
// @grant        GM_setClipboard
// @grant        GM_notification
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487664/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E7%BD%91%E9%A1%B5%E7%89%88%E5%8A%9F%E8%83%BD%E7%BB%BC%E5%90%88.user.js
// @updateURL https://update.greasyfork.org/scripts/487664/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E7%BD%91%E9%A1%B5%E7%89%88%E5%8A%9F%E8%83%BD%E7%BB%BC%E5%90%88.meta.js
// ==/UserScript==

function page_scroll() {
 var element = document.getElementsByClassName('vertical-read')[0];
    element.scrollTop = 0; // 不管他在哪里，都让他先回到最上面
    // 设置定时器，时间即为滚动速度
    function main() {
        if(element.scrollTop + element.clientHeight > $('.reader-chapter-content').height() + 200) {
         $(".nextChapter").click();
        }else {
            element.scrollTop += element.clientHeight;
        }
    }
    // 定义ID 300代表300毫秒滚动一次
   var interval = setInterval(main, 30000)
}
$(window).on('load', function() {
   page_scroll()
});
