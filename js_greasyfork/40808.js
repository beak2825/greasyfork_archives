// ==UserScript==
// @name         巴哈姆特哈啦區顯示發文者在線狀態
// @namespace    巴哈姆特哈啦區顯示發文者在線狀態
// @description  顯示巴哈姆特哈啦區文章列表中發文者的在線狀態
// @author       johnny860726
// @match        *forum.gamer.com.tw/*
// @version      20180418
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/40808/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%93%88%E5%95%A6%E5%8D%80%E9%A1%AF%E7%A4%BA%E7%99%BC%E6%96%87%E8%80%85%E5%9C%A8%E7%B7%9A%E7%8B%80%E6%85%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/40808/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%93%88%E5%95%A6%E5%8D%80%E9%A1%AF%E7%A4%BA%E7%99%BC%E6%96%87%E8%80%85%E5%9C%A8%E7%B7%9A%E7%8B%80%E6%85%8B.meta.js
// ==/UserScript==

// 哈啦區發文者在線狀態
try{
    var elems = document.getElementsByClassName("c-post__header__author");
    var ids = "", i;
    for(i=0; i<elems.length; i++){
        ids += elems[i].getElementsByClassName("userid")[0].innerText.toLowerCase()+',';
        var node = document.createElement("span");
        node.id = "BMW_" + i;
        elems[i].appendChild(node);
    }
    var sc = document.createElement("script");
    sc.src = "https://im.gamer.com.tw/bmw/jsIson.php?u=" + ids;
    document.getElementsByClassName("c-post__header__author")[0].appendChild(sc);
}catch (err){
}