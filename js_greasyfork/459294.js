// ==UserScript==
// @name         超级简历页面简化
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  给我与我憨憨女朋友一起使用，还有你们这些单身狗！超级简历页面简化，页面修改前：简历过多时，查看不方便，并且简历名称过长时，会不显示，不方便查找简历！
// @author       HuYiBao
// @match        https://www.wondercv.com/cvs
// @icon         https://files.wondercv.com/PC/cvs/myresume_red.png
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.slim.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @grant        GM_download
// @grant        GM_info
// @grant    	 GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459294/%E8%B6%85%E7%BA%A7%E7%AE%80%E5%8E%86%E9%A1%B5%E9%9D%A2%E7%AE%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/459294/%E8%B6%85%E7%BA%A7%E7%AE%80%E5%8E%86%E9%A1%B5%E9%9D%A2%E7%AE%80%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let Container = document.createElement('div');
    Container.id = "sp-ac-container";
    Container.style.position="fixed"
    Container.style.left="10px"
    Container.style.top="60px"
    Container.style['z-index']="999999"
    Container.innerHTML =`<button id="myBtnX" style="position:absolute; left:30px; top:20px;background-color: #ffb741;color: white;width: 27px;height: 76px;padding:3px;">
  整理定位
</button>
`

    document.body.appendChild(Container);

    $('#myBtnX').click(function(){

        // 内部的this指的是原生对象

        // 使用jquery对象用 $(this)
        $(".content").remove();
        $('.no-online-cv-box').remove();
        $('.menu-box-wrapper').remove();
        $(".sidebar").css('width', '100%');
        $(".cv-item-wrapper").css('width', '100%');
        $(".cv-item-title").css("max-width", "none");
        $('.tab-content').css("height", "932px");

    })

    setTimeout(function(){
        $('#myBtnX').click();
    },1500);

    // Your code here...
})();