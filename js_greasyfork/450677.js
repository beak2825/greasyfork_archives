// ==UserScript==
// @name         上传专题
// @namespace    C_Zero.chaoxing.edit
// @version      1.22.0.25
// @description  批量上传专题(自用)
// @author       C_Zero
// @match        *://mooc1.chaoxing.com/edit/chapters/*
// @match        *://mooc1.chaoxing.com/mooc-ans/edit/chapters/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/450677/%E4%B8%8A%E4%BC%A0%E4%B8%93%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/450677/%E4%B8%8A%E4%BC%A0%E4%B8%93%E9%A2%98.meta.js
// ==/UserScript==
/**
 * 选择文件
 */
function choosefile() {
	index = 0;
	fileList = document.getElementById('up_files').files;
	reader = new FileReader();
	eachFile();
}
let index = 0;
/**
 * 文件路径集合
 */
let fileList = null;
/**
 * 读取文件
 */
let reader = null;
/**
 * 定时间隔
 */
let up_sec = 3000
/**
 * 遍历文件
 */
function eachFile(){
	// 1.选中要匹配的子目录——————根据文件名，匹配对应的章节
	let li_num = parseInt(fileList[index].name.match(/_([0-9]{2})\.txt/)[1]);
	let recordindex = $('tr[data-recordindex]');
	// 模拟点击，切换章节
	$(recordindex[li_num]).click();
	setTimeout(()=>{
		// 2.读取文件内容
		reader.readAsText(fileList[index], "UTF-8");
		reader.onload = function (e) {
			// 拆分文件字段
			let con = e.target.result.split('\r\n');
			let str = '';
			for	(var j = 0; j < con.length; j++){
				str += `<p>${con[j]}</p>`;
			}
			// 3.替换网页内容
			$('#ueditor_0').contents().find("body").html(str);
			// 4.保存(模拟点击)
			//document.getElementById("ext-gen1186").click();
			document.getElementsByClassName("ans-SAVE-btn")[0].click();
			// 下一个
			index++;
			if(index < fileList.length){
				setTimeout(eachFile, up_sec);
			}
		}
	}, up_sec);
}
(function () {
    'use strict';
	setTimeout(() => {
		// 隐藏操作章节的按钮
		$('table.x-table-layout').css('display','none');
		// 添加一个【选择文件】的按钮
		$('<input type="file" name="file" multiple="multiple" id="up_files" accept="text/plain"/>')
		.change(choosefile)
		.prependTo($('#chaptercmds'));
    }, up_sec);
})();