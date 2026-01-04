// ==UserScript==
// @name         douban_pc_directory_export_mdfile
// @namespace    jarzhen@163.com
// @version      0.2
// @description  使用[豆瓣]电脑版查看目录时，点击绿字目录一行下载名为[书名.md]的文件，该文件内容为带有缩进层级和选项框的目录，便于标记书籍已读。
// @author       jiazhen
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @match        https://book.douban.com/subject/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439520/douban_pc_directory_export_mdfile.user.js
// @updateURL https://update.greasyfork.org/scripts/439520/douban_pc_directory_export_mdfile.meta.js
// ==/UserScript==
(function() {
    'use strict';
	function prepare(){
		var title_list = [];
		var book = $("#wrapper > h1 > span").html();
		var idReg =new RegExp(/\d+/);
		var id = idReg.exec(window.location.href)[0];
		var arr = $("#dir_"+id+"_full").html().replaceAll(/\n^ +/gm,"").split("<br>");
		for(var j = 0; j < arr.length; j++) {
			if(arr[j].startsWith("· · · · · ·")){
				continue;
			}
			var title = {};
			var patt=/\./g;
			if(patt.test(arr[j])){
				title.retract = arr[j].match(/\./g).length;
			}else{
				title.retract = 0;
			}
			title.name = arr[j];
			title_list.push(title);
		}
		console.log(title_list);
		var md_text = "";
		title_list.forEach((item,index,array)=>{
			md_text+="  ".repeat(item.retract)+"- [ ] "+item.name;
			md_text+="\r\n";
			//写入文件
			
		});
		download(book+".md",md_text);
	}

	function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
    //绑定绿字"目录"点击事件
    $("#content > div > div.article > div.related_info > h2").on("click", prepare);
})();