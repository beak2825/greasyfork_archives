// ==UserScript==
// @name         iVX改装
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  帮助你优化iVX的界面
// @author       You
// @match        https://editor.ivx.cn/*
// @require      http://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.3.1.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ivx.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523715/iVX%E6%94%B9%E8%A3%85.user.js
// @updateURL https://update.greasyfork.org/scripts/523715/iVX%E6%94%B9%E8%A3%85.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // 修改LOGO -----------------------------------------------------------------------------------------------------
    window.onload=function(){
        // 工作台页面替换LOGO
        document.querySelector("#ivx-editor > div.nav-bar > div.nav-bar-top.f--hlc > div.wrap-fl.f--hlc > div").setAttribute("style","background:url(web-logo.svg?e51dc50bb8825cbd417d2bb725e5d7c4) no-repeat 0")
        document.querySelector("#ivx-editor > div.nav-bar > div.nav-bar-top.f--hlc > div.wrap-fl.f--hlc > div").innerHTML = '<p style="color:#ffa800;font-size:18px;font-weight:bold;">编辑器</p>'
//隐藏帮助
document.querySelector('.help-service').style.display = 'none';
        //隐藏右上角用户中心
        document.querySelector('.nav-user.f--hlc').style.display = 'none';



    };









    // 保存时自动点击确定 -----------------------------------------------------------------------------------------------------
    $(window).keydown(function(e) {
	console.log(e);
	if (e.keyCode == 83 && e.ctrlKey) {
		e.preventDefault();
        setTimeout(function(){
        $(".btn-confirm").trigger("click");
        },400);
	}





});

})();