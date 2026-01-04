// ==UserScript==
// @name         通威半自动化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!666
// @author       You
// @match        http://tnc.tongwei.com/*
// @icon         https://www.google.com/s2/favicons?domain=qpanpan.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_download
// @license      binghuo
// @downloadURL https://update.greasyfork.org/scripts/464167/%E9%80%9A%E5%A8%81%E5%8D%8A%E8%87%AA%E5%8A%A8%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/464167/%E9%80%9A%E5%A8%81%E5%8D%8A%E8%87%AA%E5%8A%A8%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function initSetting() {
        var setting;
        if (!GM_getValue('priate_script_xmly_data')) {
            GM_setValue('priate_script_xmly_data', {
                left: 20,
                top: 100,
                piaoshujv:''
            })
        }
        setting = GM_getValue('priate_script_xmly_data')
        GM_setValue('priate_script_xmly_data', setting)
    }
    //初始化脚本设置
    initSetting()
    var priate_script_div = document.createElement("div")
    priate_script_div.innerHTML = `
<div id="priate_script_div">
<div>
<b style='font-size:30px; margin: 0 0'>半自动化</b>
<button id="caozuoxinxi">获取操作票信息</button>
<button id="caozuoxinxixieru">写入信息</button>
</div>
</div>
`
        GM_addStyle(`
#priate_script_div{
font-size : 15px;
position: fixed;
background-color: rgba(240, 223, 175, 0.9);
color : #660000;
text-align : center;
padding: 10px;
z-index :1433858005 ;//2147483647  设置悬浮，值越大越在前面
border-radius : 20px;  //圆角边框
border:2px solid black;  //边框
}

`);
    document.querySelector("#contentForm > h2").appendChild(priate_script_div) //商城页面添加
    var setting = GM_getValue('priate_script_xmly_data')
    document.getElementById("priate_script_div").style.left = (setting.left || 20) + "px";
    document.getElementById("priate_script_div").style.top = (setting.top || 100) + "px";
    //操作票信息录入
    document.querySelector("#caozuoxinxixieru").onclick = function () {
        var set = GM_getValue('priate_script_xmly_data')
        let aa = set.piaoshujv
        let aas = aa.split("yyds")
        console.log(aas.length)
        console.log(aas)
        for (let index = 0; index < aas.length-1; index++) {
            //点击添加信息框
            document.querySelector("#fileUpload > a.btn-style.projectApplyBtn.btn-new-build").click()
        }
        for (let i = 0; i < aas.length-1; i++) {
            let b = 1 + i
            // document.querySelector("#item_table > tbody > tr:nth-child(" + b + ") > td:nth-child(2) > input").value = aas[i]
            var zhi=document.querySelector("#item_table > tbody > tr:nth-child(" + b + ") > td:nth-child(2) > input")
            const evt = new Event('input');
            zhi.value = aas[i]
            zhi.dispatchEvent(evt);
        }


    }
    document.querySelector("#caozuoxinxi").onclick = function () {

        //获取操作票信息
        let a = ""
        //获取有多少个信息个数
        let geshu = document.querySelector("#item_table > tbody").children.length
        for (let i = 0; i < geshu; i++) {
            let b = 1 + i
            a += document.querySelector("#item_table > tbody > tr:nth-child(" + b + ") > td:nth-child(2)").innerText +
                "yyds"
            //打印各信息判断是否有误
            console.log(b+document.querySelector("#item_table > tbody > tr:nth-child(" + b + ") > td:nth-child(2)").innerText)
        }
        console.log(a)
        alert(a)
        var set = GM_getValue('priate_script_xmly_data')
        GM_setValue('priate_script_xmly_data', {
            left:set.left,
            top: set.top,
            piaoshujv:a
        })
        //  alert(set.piaoshujv)

    }



    function dragFunc(id) {
        var Drag = document.getElementById(id);
        var setting = GM_getValue('priate_script_xmly_data')
        Drag.onmousedown = function (event) {
            var ev = event || window.event;
            event.stopPropagation();
            var disX = ev.clientX - Drag.offsetLeft;
            var disY = ev.clientY - Drag.offsetTop;
            document.onmousemove = function (event) {
                var ev = event || window.event;
                setting.left = ev.clientX - disX
                Drag.style.left = setting.left + "px";
                setting.top = ev.clientY - disY
                Drag.style.top = setting.top + "px";
                Drag.style.cursor = "move";
                GM_setValue('priate_script_xmly_data', setting)
            };
        };
        Drag.onmouseup = function () {
            document.onmousemove = null;
            this.style.cursor = "default";
        };
     };
    dragFunc("priate_script_div");
})();
