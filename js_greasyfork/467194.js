// ==UserScript==
// @name         正方教务系统辅助
// @namespace    蓝焰淬火制作
// @version      0.4
// @description  用来辅助教务系统各项操作，目前更新功能为：1、过程性评价辅助点击一键满分。需要其他脚本请留言适配或可添加作者微信：shuiyuanbiaozhu。
// @author       蓝焰淬火
// @license MIT
// @match        https://*/jwglxt/xspjgl/kcgcpj_cxKcgcpjxxIndex.html*
// @match        https://*/jwglxt/xspjgl/xspj_cxXspjIndex.html*
// @icon         http://www.zfsoft.com/img/zf.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467194/%E6%AD%A3%E6%96%B9%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/467194/%E6%AD%A3%E6%96%B9%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let div = document.createElement('div');
    div.style="position:absolute;top:20px;left:20px";
    if(window.location.pathname.split('/')[3]=="kcgcpj_cxKcgcpjxxIndex.html"){
        div.innerHTML='<button id="button-manfen1" style="margin-right:10px;">一键满分</button>';
    }else if(window.location.pathname.split('/')[3]=="xspj_cxXspjIndex.html"){
        let html = "";
        for(let i =1 ;i<= 12;i++){
            html+='<button id="button-manfen2" style="margin-right:10px;">'+i+'</button>';
        }
        div.innerHTML =html+'<text id="button-manfen2" style="margin-right:10px;">因不能完全满分，请选择第几条9分</text>';
    }

    div.onclick=function(event){
        clickbutton(event.target.id,event.target.innerText)
    };
    document.body.append(div);

    // Your code here...
})();
function clickbutton(event,innerText){
    if(event=="button-manfen1"){
        var muitableviewcell=document.querySelector('li.mui-table-view-cell');
        muitableviewcell.click();
        setTimeout( function(){
            var muiscroll=document.querySelectorAll('.dp.mui-clearfix');
            for (let item of muiscroll) {
                var blockdiv=item.querySelector('div');
                blockdiv.click();
            }
            document.querySelector('#submit').click()
            var setIntervalId = setInterval(function() {
                var modalcontent=document.querySelector('.modal-content');
                if(modalcontent){
                    modalcontent.querySelector('button').click();
                    clearInterval(setIntervalId);
                }
            }, 500);
        }, 1000 );
    }else if(event=="button-manfen2"){
        var muitableviewcell=document.querySelectorAll('.form-group');
        for (let i =0 ; i< muitableviewcell.length;i++) {
            var blockdiv=muitableviewcell[i].querySelector('.radio-pjf');
            blockdiv.click();
            if(i==innerText-1){
                blockdiv=muitableviewcell[i].querySelector('.input-xspj-2 .radio-pjf');
                blockdiv.click();
            }
        }
        setTimeout( function(){
            simulateMouseClick(document.getElementById("btn_xspj_tj"));
        }, 500);
    }

};
function simulateMouseClick(targetNode) {
    function triggerMouseEvent(targetNode, eventType) {
        var clickEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent(eventType, true, true);
        targetNode.dispatchEvent(clickEvent);
    }
    ["mouseover", "mousedown", "mouseup", "click"].forEach(function(eventType) {
        triggerMouseEvent(targetNode, eventType);
    });
};