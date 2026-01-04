// ==UserScript==
// @name         过滤无效共享文件夹信息
// @namespace    invalid
// @include      *://majesty.hr-mp.com/*
// @version      1.0
// @description  针对共享到的人才文件夹，只保留OD信息，其他信息全部过滤掉
// @author       Leevege
// @match        https://greasyfork.org/en
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422929/%E8%BF%87%E6%BB%A4%E6%97%A0%E6%95%88%E5%85%B1%E4%BA%AB%E6%96%87%E4%BB%B6%E5%A4%B9%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/422929/%E8%BF%87%E6%BB%A4%E6%97%A0%E6%95%88%E5%85%B1%E4%BA%AB%E6%96%87%E4%BB%B6%E5%A4%B9%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

//(function() {
    'use strict';
    //window.addEventListener('load', function() {
    // your code here
function init(){
    console.log("过滤插件已加载！");
    var allElement = document.getElementsByTagName("div")
    var found;
    for (var i = 275; i < allElement.length; i++) {
        if(allElement[i].textContent.match("共享到的"))
        {
            found = allElement[i];
            break;
        }
    }
    var found2 = found.parentElement.parentElement.parentElement;
    var deleteBase = found2.querySelector("div:nth-child(2)");
    var deleteList = deleteBase.querySelector(":nth-child(1)").querySelector(":nth-child(1)");
    var inner = document.createElement('span');
    function removeElement(){
        for (var i = 0; i < deleteList.childElementCount; i++){
            if(!deleteList.children[i].textContent.match("OD"))
            {deleteList.children[i].remove();}
        }
    }
    //var button = `<button onclick="removeElement()">过滤OD</button>`;
    //inner.innerHTML = button;
    //found.append(inner);
    for(var re=0; re<10;re++){
        removeElement();
    }
}
    setTimeout(init, 3000);
    //}, false);
//})();