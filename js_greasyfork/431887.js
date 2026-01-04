// ==UserScript==
// @name        office 365 cloud disc batch download / office 365 云盘批量下载
// @namespace    http://tampermonkey.net/
// @version      0.32
// @description  office 365 云盘批量下载自带的批量下载大于60G以上文件总是失败,在右下角新增了全部下载按钮,食用方法,配合下载工具,并且切换为无需弹框确认的模式, todo 选择部分的来重新下载
// @author       friday_club
// @match        https://*.sharepoint.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431887/office%20365%20cloud%20disc%20batch%20download%20%20office%20365%20%E4%BA%91%E7%9B%98%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/431887/office%20365%20cloud%20disc%20batch%20download%20%20office%20365%20%E4%BA%91%E7%9B%98%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const interval = 100;
    const sleep = (time = 1000) => new Promise((resolve) => setTimeout(resolve, time));
    const oneByOneRun = (list, project, wait = 1000) => {
        list.reduce((future, e, idx, arr) => {
            return future.then(() => {
                return new Promise(async (resolve) => {
                    await project(e, idx, arr);
                    await sleep(wait);
                    resolve();
                })
            })
        }, Promise.resolve())
    };

    const createBtn = ()=>{
        var btn=document.createElement("BUTTON");
        var t=document.createTextNode("一键全部下载");
        btn.appendChild(t);
        // document.getElementsByClassName("ms-OverflowSet ms-CommandBar-primaryCommand")[0].appendChild(btn)
        btn.style.cssText = `position: absolute;
    bottom: 30px;
    right: 30px;
    height: 60px;
    border: 1px solid rgb(221, 221, 221);
    z-index: 100000;
    background-color: #0078D4;
    color: white;
    cursor: pointer;`;

         document.body.appendChild(btn)
         document.body.style.cssText = document.body.style.cssText + "position: relative;"
        return btn
    }

    const run= async ()=>{
         console.log(">>>>>>>>>>>> 365 cloud disc batch download run >>>>>>>>>>>> ")
         createBtn().addEventListener('click',async ()=>{
            const checkList = Array.from(document.querySelectorAll(".ms-DetailsRow-cell.ms-DetailsRow-cellCheck"));
             //     Array.from(document.getElementsByClassName("ms-SelectionZone")[0].firstElementChild.children)
         //   .map(v=>{return v.firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstElementChild});

            const downloadBtn = document.getElementsByClassName("ms-Button ms-Button--commandBar ms-CommandBarItem-link")[0].firstChild;

             for await (const checkbox of checkList) {
                 checkbox.click();
                await sleep(interval);
                downloadBtn.click();
                await sleep(interval);
                checkbox.click();
                await sleep(interval);
             }
        })
    }

    window.document.addEventListener('DOMContentLoaded', run);

})();