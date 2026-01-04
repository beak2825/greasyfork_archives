// ==UserScript==
// @name         农大 THEOL 在线教育平台自动登录
// @namespace    Jia.ys
// @version      1.0
// @description  自动登录【THEOL 在线教育平台】，跳过每次都要点击的 ┑(￣Д ￣)┍ 的登录按钮
// @author       Tosh
// @include      http://jx.cau.edu.cn/meol/index.do
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/418831/%E5%86%9C%E5%A4%A7%20THEOL%20%E5%9C%A8%E7%BA%BF%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/418831/%E5%86%9C%E5%A4%A7%20THEOL%20%E5%9C%A8%E7%BA%BF%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
     setTimeout(function(){
        javascript: (function () {
            var link = document.getElementById('loginbtn');
            window.location.href = link.href;
        })()
    },600);
})();

// Hello my friend, this is my contact information, welcome to advise
// Blog:    https://www.cnblogs.com/rsmx/
// GitHub:  https://github.com/JiaYunSong
// Date:    2020-12-19 17:29