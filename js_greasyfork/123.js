// ==UserScript==
// @name	Tieba Fix for Opera
// @namespace	http://gera2ld.blog.163.com/
// @author	Gerald <gera2ld@163.com>
// @icon	http://s.gravatar.com/avatar/a0ad718d86d21262ccd6ff271ece08a3?s=80
// @version	1.3.1
// @description	Opera贴吧修复 - Gerald倾情打造
// @homepage	http://userscripts.org/scripts/show/153687
// @include	http://tieba.baidu.com/*
// @exclude	http://tieba.baidu.com/tb/*
// @require	https://greasyfork.org/scripts/144/code.user.js
// @downloadURL https://update.greasyfork.org/scripts/123/Tieba%20Fix%20for%20Opera.user.js
// @updateURL https://update.greasyfork.org/scripts/123/Tieba%20Fix%20for%20Opera.meta.js
// ==/UserScript==

// 修复光标
function initCursorFix(editor) {
	UE.browser.opera=null;
	UE.browser.ie=true;
	UE.browser.ie9above=true;
}
// 修复粘贴功能
function initPasteFix() {
	$('<div id=baidu_pastebin>').appendTo(document.body);
}
// 修复上传图片错误
function initImageUpdateFix() {
	var loadingURL='http://tb2.bdstatic.com/tb/static-postor/images/loading_33e098e1.gif';
	unsafeWindow._.Module.use('common/component/image_uploader_manager',{},function(b){
		utils.hook(b.__proto__,'_startImageUploader',{after:function(){
			var i=$('<input type=file style="opacity:0">'),m=null;
			this._options.container.html(i);
			if(!('uploadImage' in utils)) m='请先安装贴吧图化脚本（http://userscripts.org/scripts/show/156579）才能上传本地图片！';
			else if(!utils.uploadImage) m='图片上传功能初始化失败，请在图化按钮中重试！';
			if(m) i.click(function(e){e.preventDefault();alert(m);});
			else i.change(function(e){
				var r=new FileReader(),i=document.createElement('img');
				i.src=loadingURL;test_editor.selection._bakRange.insertNode(i);
				r.onload=function(){utils.uploadImage(this.result,i);};
				r.readAsDataURL(e.target.files[0]);
			});
		}});
	});
}

if(unsafeWindow.PosterContext&&unsafeWindow.PosterContext.isPostAllowed()) {
	utils.wait(unsafeWindow,'test_editor',initCursorFix);	// 修复光标
	initPasteFix();		// 修复粘贴功能
	initImageUpdateFix();		// 修复上传图片错误
}
