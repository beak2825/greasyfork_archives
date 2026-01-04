// ==UserScript==
// @name         ###########################自用网页增强工具
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自用
// @author       baideye.com
// @match        *://*.uviewui.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=uviewui.com
// @grant        none
// @require      https://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460790/%E8%87%AA%E7%94%A8%E7%BD%91%E9%A1%B5%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/460790/%E8%87%AA%E7%94%A8%E7%BD%91%E9%A1%B5%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

// 创建最外层盒子box和目录toc
$("#app").prepend("<div id='box'><div id='toc'></div></div>");
$("#box").css({
    "display": "flex",
    "flex-direction": "column",
    "position": "fixed",
    "left": "0",
    "top":"20%",
    "z-index": "9999999",
    "background": "#fff",
    "border": "1px solid #dee1ed",
    "padding": "10px",
    "font-size": "16px",
    "width":"145px",
});
$("#toc").css({
    "display": "flex",
    "flex-direction":" column",
})
// h3
creatToc()
$("#box").append("<div id='reset'>刷新</div>");
$("#reset").css({
    "margin": "20px auto 10px",
    "background": "#2a955f",
    "color": "#fff",
    "padding": "5px 30px",
    "border-radius": "5px",
})

$("#reset").bind('click', function() {
    $("#toc").empty() ;
    creatToc()
})

function creatToc(){
    // 创建目录
    let h3Arr = document.querySelectorAll("h3");
    for(let value of h3Arr){
        $("#toc").append("<a id='h3' class='text' href=' "+ value.querySelector("a").href +"  '>"+value.innerText+"</a>");
    }
    // 添加css
    $(".text").css({
        "color": "#555",
        "margin-top": "15px",
        "font-weight": "normal",
    });
}
// $(window).bind('hashchange', function() {
//     location.reload();
// });


