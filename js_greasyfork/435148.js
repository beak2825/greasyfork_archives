// ==UserScript==
// @name         ctfshow 小侧边栏
// @namespace    https://coutcin-xw.github.io/
// @version      0.1.2
// @description  ctfshow 小侧边栏 用来迅速跳转
// @author       CoutCin
// @match        https://ctf.show/challenges
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @icon         https://www.google.com/s2/favicons?domain=ctf.show
// @grant        unsafeWindow
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/435148/ctfshow%20%E5%B0%8F%E4%BE%A7%E8%BE%B9%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/435148/ctfshow%20%E5%B0%8F%E4%BE%A7%E8%BE%B9%E6%A0%8F.meta.js
// ==/UserScript==
var $ = unsafeWindow.jQuery;
var nav=[];
(function () {
    'use strict';
    $(window).load(function () {
        var btn = `<div class="sides-nav" style="background-color: #fff;display:inline-block; position:fixed;right:3rem;top:5rem;overflow-y: scroll;max-height: 80vh;min-width: 5rem;" >
        <button id="btn-click">刷新</button>
        <ul style=" margin: none;margin: 0; padding: 0; ">
        <a style="display:block;text-decoration: none;color: #000;padding: 0.25rem 1rem 0.25rem 1rem;" href="">请刷新</a>
        </ul>
    </div>`;
        $('body').append(btn);
        console.log("test");
        $("#btn-click").click(function () { test(); });
    });
})();
function test() {
    nav=[];
    $(".category-header").each(function (i) {
        // console.log($(this).children("h3").text()+i);
        nav[i]={
            name :$(this).children("h3").text()
        }
        $(this).children("h3").attr("id","nav-t-"+i);
    })
    $(".sides-nav").children("ul").html("");
    for(var i=0;i<nav.length;i++){
        var tempstr=`
            <a style="display:block;text-decoration: none;color: #000;padding: 0.25rem 1rem 0.25rem 1rem;" href="#nav-t-${i}">${nav[i].name}</a>
        `;
        $(".sides-nav").children("ul").append(tempstr);
        
    }
    //  console.log(nav);
}