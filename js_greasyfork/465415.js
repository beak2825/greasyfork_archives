// ==UserScript==
// @name         中国裁判文书网
// @namespace    http://tampermonkey.net/
// @version      2023.05.03
// @description  复制文书标题
// @author       塞北的雪
// @match        https://wenshu.court.gov.cn/website/wenshu/*/index.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=court.gov.cn
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465415/%E4%B8%AD%E5%9B%BD%E8%A3%81%E5%88%A4%E6%96%87%E4%B9%A6%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/465415/%E4%B8%AD%E5%9B%BD%E8%A3%81%E5%88%A4%E6%96%87%E4%B9%A6%E7%BD%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function getContent(obj)
    {
        return document.getElementsByClassName(obj)[0].innerText.trim();
    }
    var div_cp_title=document.createElement('div');div_cp_title.setAttribute("class","fl date");
    var btn_cp_title = document.createElement('button');btn_cp_title.innerHTML = '复制标题';div_cp_title.appendChild(btn_cp_title);

    var div_cp_content=document.createElement('div');div_cp_content.setAttribute("class","fl date");
    var btn_cp_content = document.createElement('button');btn_cp_content.innerHTML = '复制内容';div_cp_content.appendChild(btn_cp_content);

    var hbox=document.getElementsByClassName('header_box')[0]
    hbox.appendChild(div_cp_title);
    hbox.appendChild(div_cp_content);

    btn_cp_title.addEventListener('click', function(){
        var content = getContent('PDF_title');
        console.log(content);
        GM_setClipboard(content);
        alert('标题已复制！');
    });
    btn_cp_content.addEventListener('click', function(){
        var content = getContent('PDF_pox');
        console.log(content);
        GM_setClipboard(content);
        alert('内容已复制！');
    });

})();