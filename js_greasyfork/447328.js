// ==UserScript==
// @name        网页表格保存助手
// @version     1.01
// @author      delfino
// @description 将网页中的表格（Table）保存为Excel（xlsx）文件
// @namespace    http://tampermonkey.net/
// @match       *://*/*
// @require      https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js
// @grant       GM_registerMenuCommand
// @grant       unsafeWindow

// @downloadURL https://update.greasyfork.org/scripts/447328/%E7%BD%91%E9%A1%B5%E8%A1%A8%E6%A0%BC%E4%BF%9D%E5%AD%98%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/447328/%E7%BD%91%E9%A1%B5%E8%A1%A8%E6%A0%BC%E4%BF%9D%E5%AD%98%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function(){
	function getTableParent(node){
		while ( node = node.parentNode!==null && node !== null && node.tagName !== 'TABLE' );
		return node;
	}

	function add_btn_download(tbl,index){
        tbl.style.border = "1px solid red";
        var btn = document.createElement('button');
        btn.innerHTML = "保存表格";
        btn.title = "将此表格的数据保存为Xlsx文件";
        btn.classList.add("style_btn_download");
		btn.onclick = function() {
            save_xlsx(index)
		};
		tbl.parentNode.insertBefore(btn,tbl);
	}

    GM_registerMenuCommand('显示保存按钮', () => {
        document.querySelectorAll('table').forEach(function(tbl,index){
            add_btn_download(tbl,index);
        });
    });
    function save_xlsx(index) {
        const el_table = document.querySelectorAll("table")[index];
        const workbook  = XLSX.utils.book_new();
        const worksheet = XLSX.utils.table_to_sheet(el_table, {raw:true});
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        return XLSX.writeFile(workbook, '保存的表格数据.xlsx');
    }

    var style = document.createElement('style');
    style.innerHTML = `
        .style_btn_download {opacity: 0.5;margin-bottom:2px;padding:2px;border:1px solid #d4eaa9;background-color:#d4eaa9;border-radius:2px;}
        .style_btn_download:hover {opacity: 1;}`;
    document.head.appendChild(style);
}());