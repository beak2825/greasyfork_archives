// ==UserScript==
// @name         贴吧屏蔽包打听
// @namespace    qtqz
// @version      0.2
// @description  屏蔽包打听难看的头像和没用的长篇大论，但保留它存在过的痕迹
// @author       qtqz
// @match        https://tieba.baidu.com/p/*
// @icon         https://tieba.baidu.com/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486584/%E8%B4%B4%E5%90%A7%E5%B1%8F%E8%94%BD%E5%8C%85%E6%89%93%E5%90%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/486584/%E8%B4%B4%E5%90%A7%E5%B1%8F%E8%94%BD%E5%8C%85%E6%89%93%E5%90%AC.meta.js
// ==/UserScript==

//2024/1/14

(function () {
    'use strict';

        var node = document.createElement("style");
        node.appendChild(document.createTextNode(`
        img[username='贴吧包打听'] {
            display: none;
}
    `));
        var heads = document.getElementsByTagName("head");
        if (heads.length > 0) {
            heads[0].appendChild(node);
        } else {
            document.documentElement.appendChild(node);
        }
    setTimeout(()=>{
        $("img[username='贴吧包打听']").parents(".d_author").next().children(".p_content").empty()//[0].style.display='none'
    },100)
})();