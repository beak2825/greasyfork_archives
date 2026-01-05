// ==UserScript==
// @name         Picture Auto-Resize on Chrome
// @name:zh-cn    图片在Chrome中自动缩放
// @namespace    https://greasyfork.org/users/2646
// @version      0.8
// @description  Auto-Resize on Chrome Picture Preview Tab
// @description:zh-cn  让大图在Chrome窗体内自动调整到适合的缩放大小，一览图片全貌（不会影响图片保存）
// @author       2016+, CLE
// @include      *://*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16403/Picture%20Auto-Resize%20on%20Chrome.user.js
// @updateURL https://update.greasyfork.org/scripts/16403/Picture%20Auto-Resize%20on%20Chrome.meta.js
// ==/UserScript==

if( ! document.contentType.match(/^image\//i) ) return;

var img = document.getElementsByTagName("img")[0];

var imginfo = document.createElement("div");
imginfo.setAttribute("style", "position:fixed; right:10px; top:5px; z-index:10086; color:#FFF; font-size: 26px; opacity:0.5; text-shadow: 0px 0px 5px #000; padding: 1px; text-align: right;");
document.body.appendChild(imginfo);

var imgfsize = -1; var tfs = "unknow";

function refinfo(){
	var infohtml;
	if(navigator.language=="zh-CN"){
		infohtml = '图片宽：'+ img.width + ' / ' + img.naturalWidth + 
			'<br/>图片高：' + img.height + ' / ' + img.naturalHeight;
		infohtml += '<br/>文件类型：' + document.contentType;
		if(imgfsize > 0) infohtml += '<br/>文件大小：' + tfs;
	}else{
		infohtml = 'Width: '+ img.width + ' / ' + img.naturalWidth + 
			'<br/>Height: ' + img.height + ' / ' + img.naturalHeight;
		infohtml += '<br/>File Type: ' + document.contentType;
		if(imgfsize > 0) infohtml += '<br/>File Size: ' + tfs;
	}

	imginfo.innerHTML = infohtml;
}

var xhr = new XMLHttpRequest();
xhr.open("HEAD", document.location.href, true);
xhr.onreadystatechange = function(){
	if ( xhr.readyState == 4 ) {
		if ( xhr.status == 200 ) {
			imgfsize = Number( xhr.getResponseHeader("Content-Length") );

			if(imgfsize > 0){
				if(imgfsize < 1024)
					tfs = imgfsize + " bytes";
				else if( imgfsize <=1024000 )
					tfs = (imgfsize/1024).toFixed(2) + " KB";
				else if( imgfsize >1024000 )
					tfs = (imgfsize/1024/1024).toFixed(2) + " MB";
				refinfo();
			}

		}
	}
};
xhr.send();



function defsize(){
	img.height = img.naturalHeight;
	img.width = img.naturalWidth;
	refinfo();
}

function autoresize() {
	if ( img.naturalHeight > window.innerHeight || img.naturalWidth > window.innerWidth ) {
		var hb = 0; var zb = 0; var rat = 0;

		if(img.naturalWidth > window.innerWidth) hb = img.naturalWidth / window.innerWidth;
		if(img.naturalHeight > window.innerHeight) zb = img.naturalHeight / window.innerHeight;

		if(hb !== 0 && zb !== 0){
			if(hb >= zb) rat = hb; else rat = zb;
		} else if (hb !==0) {
			rat = hb;
		} else if (zb !==0) {
			rat = zb;
		}

		if (rat !==0 ){
			img.width = img.naturalWidth / rat;
			img.height = img.naturalHeight / rat;
		}
	}
	refinfo();
}

autoresize();
window.onresize = autoresize;


var defm = false;
window.onkeydown = function(event){
	switch(event.keyCode) {
		case 13: //enter
			if(defm){
				window.onresize = autoresize;
				autoresize();
			}else{
				window.onresize = null;
				defsize();
			}
			defm = !defm;
			break;
		case 27: //escape
			window.close();
			break;
		case 16: //shift
			if(imginfo.style.display=="none")
				imginfo.style.display = "block";
			else
				imginfo.style.display = "none";
			break;
	}
};
