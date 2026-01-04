// ==UserScript==
// @license MIT
// @name         DemagShop_Partlist
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用于Demagshop零件清单复制
// @author       Bruce
// @match        https://designer.demagcranes.com/demag/?s-action=ecomm&s-par-ref=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=demagcranes.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/518157/DemagShop_Partlist.user.js
// @updateURL https://update.greasyfork.org/scripts/518157/DemagShop_Partlist.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var myVar
	myVar = setInterval(add_button, 1000);
	function add_button(){
		//找到要添加节点的父节点(head-title)
		var head_title = document.getElementsByClassName("v-csslayout v-layout v-widget s-configurator-parameterlayout v-csslayout-s-configurator-parameterlayout v-has-width")[0];
		if (head_title){
            if (head_title.innerText == "Technical description"){
                if (head_title.parentNode.getElementsByTagName("td")[1].getAttribute("aria-selected")=="true"){
                    //console.log("yes");
                    let detail_wrap = document.getElementsByClassName("v-tabsheet v-widget v-has-width s-auto-adjustable-tab v-tabsheet-s-auto-adjustable-tab")[0];
                    let head_line = detail_wrap.getElementsByTagName("div")[0]
                    //添加一个按钮
                    let exist_Copy_btn = document.getElementById("Copy_btn");
                    if (!exist_Copy_btn){
                        var Copy_btn = document.createElement("button");
                        //Copy_btn.className = "ant-btn ant-btn-default header-close-btn";
                        Copy_btn.innerHTML = "复 制";
                        Copy_btn.id = "Copy_btn";
                        //添加onclick事件,和事件执行的函数
                        Copy_btn.onclick = function Copy_fun(){
                            let detail_table = detail_wrap.getElementsByTagName("table")[1];
                            detail_table.id="tableid";//给表格增加一个id属性
                            tableToExcel('tableid');
                        }
                        //把节点添加到head-title当中
                        head_line.appendChild(Copy_btn);
                    }
                }else{
                    //console.log("no");
                    let exist_Copy_btn = document.getElementById("Copy_btn");
                    if (exist_Copy_btn){
                        exist_Copy_btn.remove();
                    }
                }
            }
		}
	}
    var tableToExcel = (function() {
        var uri = 'data:application/vnd.ms-excel;base64,',
            template = '<html><head><meta charset="UTF-8"></head><body><table>{table}</table></body></html>',
            base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) },
            format = function(s, c) {
                return s.replace(/{(\w+)}/g,
                                 function(m, p) { return c[p]; }) }
        return function(table, name) {
            if (!table.nodeType) table = document.getElementById(table)
            var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}
            window.location.href = uri + base64(format(template, ctx))
        }
    })()
})();