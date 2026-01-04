// ==UserScript==
// @name         bookstack搜索窗口居中之保护颈椎
// @namespace    https://greasyfork.org/zh-CN/scripts/451509-bookstack搜索窗口居中之保护颈椎
// @version      0.2
// @license      MIT
// @description  这搜索框看一眼，颈椎都有点不好使了
// @author       beibeibeibei
// @match        *www.bookstack.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451509/bookstack%E6%90%9C%E7%B4%A2%E7%AA%97%E5%8F%A3%E5%B1%85%E4%B8%AD%E4%B9%8B%E4%BF%9D%E6%8A%A4%E9%A2%88%E6%A4%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/451509/bookstack%E6%90%9C%E7%B4%A2%E7%AA%97%E5%8F%A3%E5%B1%85%E4%B8%AD%E4%B9%8B%E4%BF%9D%E6%8A%A4%E9%A2%88%E6%A4%8E.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function insertAfter(newElement, targetElement){
        var parent = targetElement.parentNode;
        if (parent.lastChild == targetElement) {
            parent.appendChild(newElement);
        }
        else {
            parent.insertBefore(newElement, targetElement.nextSibling);
        }
    }

    document.querySelector("body > div.m-manual.manual-mode-view.manual-reader > div.container-fluid.manual-body > div.manual-left");
    /* position: fixed; */
    /* width: 40%; */
    /* margin-left: 30%; */
    /* margin-top: 1%; */
    /* border: 1px solid brown; */

    document.querySelector("body > div.m-manual.manual-mode-view.manual-reader > div.container-fluid.manual-body > div.manual-left > div.article-search");
    //放在manual-left下面，紧挨着article-search
    // <div class="article-search">
    //     <button type="button" class="btn btn-default searchcenter-BHJZ" style="width: 93%;margin-left: 3.5%;color: tomato;">
    //         <span>搜索窗口居中</span>
    //     </button>
    // </div>
    // padding: 1px;
    document.querySelector("body > div.m-manual.manual-mode-view.manual-reader > div.container-fluid.manual-body > div.manual-left > div.article-menu");
    // width: 100%;
    // top: 90px;
    document.querySelector("body > div.m-manual.manual-mode-view.manual-reader > div.container-fluid.manual-body > div.manual-left > div.article-search > div.pull-right");
    //hidden

    var PARENT = document.querySelector("body > div.m-manual.manual-mode-view.manual-reader > div.container-fluid.manual-body > div.manual-left");
    var asearch = document.querySelector("body > div.m-manual.manual-mode-view.manual-reader > div.container-fluid.manual-body > div.manual-left > div.article-search");
    var asearch2 = document.createElement("div");
    var amenu = document.querySelector("body > div.m-manual.manual-mode-view.manual-reader > div.container-fluid.manual-body > div.manual-left > div.article-menu");
    var littlebtn = document.querySelector("div.article-search > div.pull-right");
    asearch2.className = "article-search";
    var btn = document.createElement("button");
    btn.className = "btn btn-default searchcenter-BHJZ";
    btn.style = "width: 93%;margin-left: 3.5%;color: tomato;";
    var span = document.createElement("span");
    span.textContent = "搜索窗口居中";
    btn.appendChild(span);
    asearch2.appendChild(btn);
    insertAfter(asearch2,asearch);

    asearch2.style.padding = "1px";
    amenu.style.top = "90px";
    amenu.style.width = "100%";

    var PARENT_FLOAT = false;
    btn.addEventListener('click', function(){
    if (!PARENT_FLOAT){
        PARENT_FLOAT = true;
        PARENT.style = "position: fixed;width: 40%;margin-left: 30%;margin-top: 1%;border: 1px solid brown;";
        littlebtn.hidden = true;
    }else{
        PARENT_FLOAT = false;
        PARENT.style = null;
        littlebtn.hidden = false;
    }
});
})();
