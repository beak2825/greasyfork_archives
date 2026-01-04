// ==UserScript==
// @name         B站查單詞
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  新增查詢單詞按鈕
// @author       You
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430870/B%E7%AB%99%E6%9F%A5%E5%96%AE%E8%A9%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/430870/B%E7%AB%99%E6%9F%A5%E5%96%AE%E8%A9%9E.meta.js
// ==/UserScript==
//等待函數  沒用到  
function delay(n){
    return new Promise(function(resolve){
        setTimeout(resolve,n*1000);
    });
}


//點選筆記  讓筆記打開  下面才能找到按鈕要插入位置的div的id
window.addEventListener('click', function(){
let c=document.querySelector("#arc_toolbar_report > div.rigth-btn > div:nth-child(2) > div");
    c.click();




//原本只想要有這段  但會找不到東西 所以才有上面的判斷
document.querySelector("#arc_toolbar_report > div.rigth-btn > div:nth-child(2) > div").addEventListener('click',function(){
console.log("ggg");
//B站新增cambrige dictionary單字查詢按鈕
document.querySelector("#app > div.resizable-component.bili-note.active-note > div.editor-innter.ql-container.ql-snow > div.ql-editor").id="note";

var oContent =document.getElementById('note');
oContent.onmouseup = function(){
//alert(selectText());
};

function selectText(){
if(document.Selection){
//ie瀏覽器
return document.selection.createRange().text;
}else{
//標準瀏覽器
return window.getSelection().toString();
}
}





//按鈕創建與樣式

let r=document.createElement("button");
r.innerHTML="<div class=\"sc-wtfuxu laWUUI\">查单词</div>";
r.style.fontSize="13px";
r.style.backgroundColor="#FF8C00";
r.style.textAlign="center";
r.style.color="white";
r.style.margin="-7px 6px";
r.style.padding="5px";
r.style.borderRadius="5px";
r.style.cursor="pointer";
r.style.border="1px outset white";
r.style.position="absolute";
r.style.left="183px";

//丟在筆記旁邊

document.querySelector("#app > div.resizable-component.bili-note.active-note > div.note-drag-bar.drag-el > div.status-bar > div > span").append(r);


r.addEventListener('click',function(){
let url="https://dictionary.cambridge.org/zht/%E8%A9%9E%E5%85%B8/%E8%8B%B1%E8%AA%9E-%E6%BC%A2%E8%AA%9E-%E7%B9%81%E9%AB%94/"+selectText();
window.open(url);console.log("查詢"+selectText())});
});
})