// ==UserScript==
// @name         数美视频
// @namespace    wjddd
// @version      1.1
// @description  跳转指定页数
// @author       lichang
// @match        http://manager.4399tech.com/v2/app/upload/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445412/%E6%95%B0%E7%BE%8E%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/445412/%E6%95%B0%E7%BE%8E%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==


let Container = document.createElement('div');
Container.id = "sp-ac-container";
Container.style.position="fixed"
Container.style.left="465px"
Container.style.top="10px"
Container.style['z-index']="999999"
Container.innerHTML =`<input type="text" class="search" placeholder="页数" id="neirong">

`
let Container1 = document.createElement('div');
Container1.id = "sp-ab-container";
Container1.style.position="fixed"
Container1.style.left="690px"
Container1.style.top="10px"
Container1.style['z-index']="999999"
Container1.innerHTML =`<input type="button" value="跳转" id="haha">
`
document.body.appendChild(Container);
document.body.appendChild(Container1);
let btn=document.getElementById('haha'),
    textArea=document.getElementById('neirong');

btn.onclick=function(){
if(textArea.value){
    var x = textArea.value;
    textArea.value="";//清空输入框
    window.open("http://manager.4399tech.com/v2/app/upload/hykb.html?search_type=1&audit_status=-2&convert_status=&app=hykb&id=&uid=&uuid=&md5=&id2=&risk_type=-1&sm_status=0&p="+x,'_self');//网址
}else{
    alert("你尚未输入信息,请重新输入")
}
}