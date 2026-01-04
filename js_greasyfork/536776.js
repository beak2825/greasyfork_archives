// ==UserScript==
// @name         自定义网页打印时间
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      2025-05-21
// @description  本脚本提供自定义网页打印时间页眉的能力
// @author       yuxia
// @match        http://www.anlu.gov.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536776/%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BD%91%E9%A1%B5%E6%89%93%E5%8D%B0%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/536776/%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BD%91%E9%A1%B5%E6%89%93%E5%8D%B0%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

   document.getElementById("js_contentBox").style.height = 'auto'
    function injectPrintCss(datetimestr) {
    const style = document.createElement('style');
    style.innerHTML = `
        @media print{
            body { margin: 0 !important; } /* 去除 body 的页边距 */
            html, body {zoom: 80%;}
            .p-main-form {display:none;}
            #hideprint{display:none;}
            @page {
                size:a4 portrait;
                font-size:10px;
                margin-top:2cm;
                margin-bottom:2cm;
                @top-left {
                     content: \"打印日期：`+ datetimestr+ `\";
                }
               @top-center{
                   content:\"`+ document.title + `\";
               }
               @bottom-left{
                 content:\"原文网址：`+window.location.href+`\";
               }
               @bottom-right{
                 content: "第 " counter(page) " 页 / 共 " counter(pages) " 页";
               }
           }
      }'`;
    document.head.appendChild(style);
}

function injectFloatFrame(){
    const frame = document.createElement('div')
    frame.style = `position:fixed;width:25%;height:auto;
                    top:70%;left:70%;border:solid black;
                    cursor:pointer;z-index:9999;box-shadow: 0 0 20px rgba(225, 225, 225, 0.5);
                    background: white;
                    `
    frame.setAttribute("id","hideprint")
    frame.innerHTML = `
        <div id="datetime" style="margin:10px">
            <div style="width:90%;margin:10px auto;">
                <div style="display:inline;">日期：</div>
                <input id="date" name="date" type="date" style="width:50%" />
            </div>
            <div style="width:90%;margin:10px auto">
                <div style="display:inline;">时间：</div>
                <input id="time" name="time" type="time"style="width:50%"/>
            </div>
            <div style="width:40%;margin:auto;text-align:center;border:solid black" id="startprint">
                开始打印
            </div>
        </div>
    `
    document.body.appendChild(frame)


    let print_node = document.querySelector("#startprint")
    print_node.addEventListener("click", (event)=>{
        let time_node = document.querySelector("#time")
        let date_node = document.querySelector("#date")

        let time = time_node.value
        let date = date_node.value

        if (time === '' || date === ''){
            alert("请设置时间和日期")
            return
        }
        date = date.replaceAll('-','/')
        injectPrintCss(date + ' ' + time)
        window.print()

    })

}

injectFloatFrame()
})();