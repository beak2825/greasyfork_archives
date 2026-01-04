// ==UserScript==
// @name         比亚迪汽车参数表差异显示助手
// @namespace    cn.kyle.tools.scripts
// @version      0.5.2
// @description  比亚迪官网汽车参数辅助工具，可以调整列的宽度，可以对比配置，高亮显示差异部分。
// @author       kyle tang
// @match        https://*.bydauto.com.cn/pc/carDetail/config*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/485926/%E6%AF%94%E4%BA%9A%E8%BF%AA%E6%B1%BD%E8%BD%A6%E5%8F%82%E6%95%B0%E8%A1%A8%E5%B7%AE%E5%BC%82%E6%98%BE%E7%A4%BA%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/485926/%E6%AF%94%E4%BA%9A%E8%BF%AA%E6%B1%BD%E8%BD%A6%E5%8F%82%E6%95%B0%E8%A1%A8%E5%B7%AE%E5%BC%82%E6%98%BE%E7%A4%BA%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Your code here...
    window.resizeWin = function (){
        var defaultWidth="calc(8vw)";
        var headCount=4; //默认值4行，后边会自动检测重新赋值。
        //调整宽度
        for (let div of document.querySelectorAll(".value")) {
            div.style="width: "+defaultWidth+";"
        }

        //
        let headtable = document.querySelector(".config_head");
        //headtable.style.position="fixed";
        const dataV = document.querySelector(".value").getAttributeNames()[0];
        let newDiv = document.createElement("div");
        newDiv.setAttribute("class","table_td");
        newDiv.setAttribute(dataV,"");
        let colsCnt = headtable.firstChild.lastChild.childElementCount;
        let innerHTML='<div '+dataV+' class="lable">勾选对比(<input class="chbOnlyDiff" name="chbOnlyDiff" type="checkbox" >仅差异</input>'+
            '<input class="chbDisplayAll" name="chbDisplayAll" type="checkbox" >全</input>)</div>';
        for (let i=1;i<colsCnt;i++){
            innerHTML += '<div '+dataV+' class="value" style="width: calc(8vw);"><input class="chbCmpItems" name="chbCmpItems_'+i+'" val='+i+' type="checkbox" /></div>';
        }
        newDiv.innerHTML=innerHTML;
        headtable.firstChild.appendChild(newDiv);
        headCount=headtable.firstChild.childElementCount;

        //更新显示
        function update(chbItem, isFirstCol){

            //如果不是第一列，则根据选择状态设置是否隐藏
            if (!isFirstCol){
                //获取点击check的索引值
                let clickIdx = chbItem.getAttribute("val");
                if (chbItem.checked){
                    for (let tr of document.querySelectorAll(".table_td")) {
                        tr.children.item(clickIdx).style.color='BLACK';
                    }
                }else{
                    let row=0;
                    for (let tr of document.querySelectorAll(".table_td")) {
                        row++;
                        if (row<headCount){
                            continue;
                        }
                        tr.children.item(clickIdx).style.color='WHITE';
                    }
                }
            }

            //根据勾选的信息，确定第一个位置
            let firstIdx = -1;
            let chbEs = document.querySelectorAll(".chbCmpItems");
            for (let chbItem0 of chbEs) {
                if (chbItem0.checked){
                    firstIdx=parseInt(chbItem0.getAttribute("val"));
                    break;
                }
            }

            if (firstIdx==-1){
                //alert("至少要选择两个");
                //chbItem.checked=true;
                return;
            }

            let chbOnlyDiff = document.querySelector(".chbOnlyDiff");
            let bCheckdOnlyDiff = chbOnlyDiff.checked;

            //重新比较差异，差异高亮
            let row=0;
            for (let tr of document.querySelectorAll(".table_td")) {
                let cnt = tr.children.length;
                let bDiff = false;
                row++;

                if (row<headCount){
                    continue;
                }

                //查找行是否存在差异
                for (let idx=firstIdx+1;idx<cnt;idx++){
                    if (!chbEs.item(idx-1).checked) {
                        continue;
                    }
                    if (tr.children.item(idx).innerText != tr.children.item(firstIdx).innerText){
                        bDiff=true;
                        break;
                    }
                }
                //恢复默认
                for (let idx=0;idx<cnt;idx++){
                    tr.children.item(idx).style.backgroundColor='WHITE';
                    tr.children.item(idx).style.display="";
                }
                //整行高亮
                if (bDiff){
                    for (let idx=0;idx<cnt;idx++){
                        if (idx==0 || chbEs.item(idx-1).checked){
                            tr.children.item(idx).style.backgroundColor='YELLOW';
                        }
                    }
                }else{
                    for (let idx=0;idx<cnt;idx++){
                        if (bCheckdOnlyDiff){
                            tr.children.item(idx).style.display="none";
                        }else{
                            tr.children.item(idx).style.display="";
                        }
                    }
                }
            }

        }

        //绑定事件, 仅差异
        let chbOnlyDiff = document.querySelector(".chbOnlyDiff");
        chbOnlyDiff.addEventListener("change", () => {
            update(chbOnlyDiff,true);
        });

        //绑定事件, 全
        let chbDisplayAll = document.querySelectorAll(".chbDisplayAll")[0];
        chbDisplayAll.addEventListener("change", () => {
            //
            let config_table = document.querySelector(".config_table");
            if (chbDisplayAll.checked){
                config_table.style.height="unset";
                config_table.style.position="absolute";
                //config_table.style.top="0.46154rem"
                //config_table.style.paddingTop="0.60rem";
            }else{
                config_table.style.height="100vh";
                config_table.style.position="fixed";
                //config_table.style.top="unset";
                //config_table.style.paddingTop=".46154rem";
            }

            let config_head = document.querySelector(".config_head");
            if (chbDisplayAll.checked){
                config_head.style.position="fixed";
                config_head.style.top=".46154rem";
            }else{
                config_head.style.position="sticky"
                config_head.style.top="0";
            }

            let config_content = document.querySelector(".config_content");
            if (chbDisplayAll.checked){
                config_content.style.paddingTop="0.60rem";
            }else{
                config_content.style.paddingTop="unset";
            }
        });

        //绑定事件, 选择
        let chbE = document.querySelectorAll(".chbCmpItems");
        for (let chbItem of chbE) {
            chbItem.checked=true;
            chbItem.addEventListener("change", () => {
                update(chbItem,false);
            });
        };

        //差异高亮
        for (let tr of document.querySelectorAll(".table_td")) {
            let cnt = tr.children.length;
            let bDiff = false;
            //查找行是否存在差异
            for (let idx=2;idx<cnt;idx++){
                if (tr.children.item(idx).innerText != tr.children.item(1).innerText){
                    bDiff=true;
                    break;
                }
            }
            //整行高亮
            if (bDiff){
                for (let idx=0;idx<cnt;idx++){
                    tr.children.item(idx).style.backgroundColor='YELLOW';
                }
            }
        }
    }

    window.onload=function(){
        setTimeout("window.resizeWin();", 2000 )
    }

})();