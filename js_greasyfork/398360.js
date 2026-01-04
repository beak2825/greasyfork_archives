// ==UserScript==
// @name         Trello - 修改列表宽度
// @namespace    pg_trello_js
// @homepageurl  null
// @version      0.1.1
// @description  修改trello列表宽度
// @description:zh-CN 修改trello列表宽度
// @author       panguan
// @match        http*://*trello.com/b/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398360/Trello%20-%20%E4%BF%AE%E6%94%B9%E5%88%97%E8%A1%A8%E5%AE%BD%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/398360/Trello%20-%20%E4%BF%AE%E6%94%B9%E5%88%97%E8%A1%A8%E5%AE%BD%E5%BA%A6.meta.js
// ==/UserScript==

window.onload = function () {
    var i=0,j=0,n=0,m=0,c=0;
    var ds = document.getElementsByTagName('div');
    //获取tag名称为div的html元素们
    for(j=ds.length;i<j;i++)
        //遍历tag名称为div的html元素们
    {
        var lw = document.getElementsByClassName("js-list list-wrapper");
        //获取class为js-list list-wrapper的div元素们
        for(m=lw.length;n<m;n++)
            //遍历class为js-list list-wrapper的div元素们
        {
            lw[c].style.width="220px";
            //每个列表对应一个数组项
            c++;
        }
    }
     alert(ds[i].innerHTML)
}
