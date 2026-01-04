// ==UserScript==
// @name         企耳增强-上传列名自动配对
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  企耳部分功能增强
// @author       Haiiro
// @license      Private Use Only
// @match        https://3.yunerp.vip:8203/*/import/confirm?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yunerp.vip

// @downloadURL https://update.greasyfork.org/scripts/475090/%E4%BC%81%E8%80%B3%E5%A2%9E%E5%BC%BA-%E4%B8%8A%E4%BC%A0%E5%88%97%E5%90%8D%E8%87%AA%E5%8A%A8%E9%85%8D%E5%AF%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/475090/%E4%BC%81%E8%80%B3%E5%A2%9E%E5%BC%BA-%E4%B8%8A%E4%BC%A0%E5%88%97%E5%90%8D%E8%87%AA%E5%8A%A8%E9%85%8D%E5%AF%B9.meta.js
// ==/UserScript==

function 配对(){
	$("[class='layui-inline']>label").each(function(i,e){
		let t= $("[class='layui-inline']>label:eq("+i+")").text().replace("*","").trim()
		let b=0
		for(let j = 0; j　< $("select:eq("+i+")>option").length; j++) {
			if ($("select:eq("+i+")>option:eq("+j+")").text().trim()==t){
				$("select:eq("+i+")>option:eq("+j+")").prop("selected",true);
				b=1
				break
			}
		}
		if(b==0){
			$("select:eq("+i+")>option:eq(0)").prop("selected",true);
		}
	})
}
function 插入组件(){
	$("[class='layui-input-block']>button:eq(0)").before("<button id='tidy' class='layui-btn layui-btn-primary layui-border-purple' >自动配对</button>")
	$("#tidy").on("click",配对)
}
$("[class='layui-input-block']").css({"margin-left":"0"})
插入组件()
