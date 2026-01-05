// ==UserScript==
// @name        ABPVN Custom CSS
// @description Tùy chỉnh CSS trang web theo ý bạn
// @namespace   ABPVN
// @author 		Hoàng Rio
// @include     *
// @icon 		https://www.webanh.tk/full/aBINKD.png
// @version     1.3.1
// @grant       none
// @run-at      document-end
// @exclude     http://abpvn.com/*
// @exclude     http://sinhvienit.net/*
// @exclude		*.js
// @exclude		*.txt
// @exclude		*.css
// @exclude		*.cs
// @exclude		*.cpp
// @exclude		*.py
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/11990/ABPVN%20Custom%20CSS.user.js
// @updateURL https://update.greasyfork.org/scripts/11990/ABPVN%20Custom%20CSS.meta.js
// ==/UserScript==
var html='<div id="abpvn-custom-css" style="display: none;">';
	html+='<div style="z-index: 999; background: rgba(0, 0, 0, 0.57) none repeat scroll 0% 0%; position: fixed; top: 0px; left: 0px; height: 100%; width: 100%;"></div>';
	html+='<div style="position: fixed; top: 30%; left: 30%; width: auto; height: auto; text-align: left; background: rgba(0, 128, 0, 0.69) none repeat scroll 0% 0%; padding: 10px; z-index: 1000;  font-size: 15px; font-family: Tahoma; color: White; border-radius: 15px;" id="custom-css">';
	html+='<h3 style="text-align: center; padding: 0px; height: 10px; margin-top: -10px;">Thêm quy tắc CSS mới</h3>';
	html+='<label for="type" style="color: white;">Thiết lập cho</label><br>';
	html+='<select id="type" name="type" style="padding: 5px; color: black;">';
	html+='<option value="hostname">Tên miền hiện tại</option>';
	html+='<option value="url">Đường dẫn hiện tại</option>';
	html+='</select><br>';
	html+='<label for="url" style="color: white;">Địa chỉ thiết lập</label><br>';
	html+='<input size="50" disabled style="padding: 5px; color: black; background: white;" name="url" id="url"><br>';
	html+='<label for="css" style="color: white;">Thông tin css</label><br>';
	html+='<textarea style="width: 569px; height: 142px; background: white none repeat scroll 0% 0%; border-radius: 10px; font-family: Courier new; color: rgb(0, 48, 255);" id="css" name="css"></textarea><br>';
	html+='<div style="margin-left: 40%; position: abusolute;"><button id="btn-save" style="width: 50px;padding: 3px; font-size: 15px; color: white; background: blue; border-radius: 15px;">Lưu</button><button id="btn-cancel" style="width: 50px;padding: 3px; font-size: 15px; color: white; background: red;border-radius: 15px;">Hủy</button></div>';
	html+='</div>';
	html+='</div>';
var add_html='<div id="btn-add" style="position: fixed; top: 0; left: 0; padding: 5px; font-weight: 800; color: white; border-radius: 50%; cursor: pointer;background: rgba(0, 255, 48, 0.53) none repeat scroll 0% 0%; z-index: 99999;" title="Thêm quy tắc css mới">+</div>';
function create(htmlStr) {
    var frag = document.createDocumentFragment(),
        temp = document.createElement('div');
    temp.innerHTML = htmlStr;
    while (temp.firstChild) {
        frag.appendChild(temp.firstChild);
    }
    return frag;
}

function ApplyStyle(){
	css_hostname=localStorage.getItem('hostname:'+location.hostname)===null?'':localStorage.getItem('hostname:'+location.hostname);
	css_url=localStorage.getItem('url:'+location.href)===null?'':localStorage.getItem('url:'+location.href);
	document.getElementById('css').value=css_hostname;
	css=css_hostname+css_url;
	if(css!==''){
		style=document.createElement('style');
		style.type = 'text/css';
		if (style.styleSheet){
		  style.styleSheet.cssText = css;
		} else {
		  style.appendChild(document.createTextNode(css));
		}
		document.body.insertBefore(style, document.body.childNodes[0]);
	}
}
var setting={};
setting.show=function(){
	var dom=document.getElementById('abpvn-custom-css');
	dom.style.display='block';
	type=document.getElementById('type').value;
	url=document.getElementById('url');
	switch(type){
		case 'hostname':
			url.disabled=true;
			url.value=location.hostname;
			css_hostname=localStorage.getItem('hostname:'+location.hostname)===null?'':localStorage.getItem('hostname:'+location.hostname);
			document.getElementById('css').value=css_hostname;
			break;
		default:
			url.disabled=true;
			url.value=location.href;
			css_url=localStorage.getItem('url:'+location.href)==null?'':localStorage.getItem('url:'+location.href);
			document.getElementById('css').value=css_url;
			break;
	}
}
setting.hide=function(){
	var dom=document.getElementById('abpvn-custom-css');
	dom.style.display='none';
}
setting.save=function(){
	key=document.getElementById('url').value;
	type=document.getElementById('type').value;
	value=document.getElementById('css').value;
	localStorage.setItem(type+':'+key,value);
	if(document.body.childNodes[0].nodeName=='STYLE') document.body.removeChild(document.body.childNodes[0]);
	ApplyStyle();
	setting.hide();
}
setting.switchtype=function(){
	type=document.getElementById('type').value;
	url=document.getElementById('url');
	switch(type){
		case 'hostname':
			url.disabled=true;
			url.value=location.hostname;
			css_hostname=localStorage.getItem('hostname:'+location.hostname)===null?'':localStorage.getItem('hostname:'+location.hostname);
			document.getElementById('css').value=css_hostname;
			break;
		default:
			url.disabled=true;
			url.value=location.href;
			css_url=localStorage.getItem('url:'+location.href)==null?'':localStorage.getItem('url:'+location.href);
			document.getElementById('css').value=css_url;
			break;
	}
}
function init(){
	var button=create(add_html);
	var fragment = create(html);
	// You can use native DOM methods to insert the fragment:
	document.body.insertBefore(fragment, document.body.childNodes[0]);
	document.body.insertBefore(button, document.body.childNodes[0]);
	document.getElementById('btn-add').addEventListener('click',setting.show,true);
	document.getElementById('btn-cancel').addEventListener('click',setting.hide,true);
	document.getElementById('btn-save').addEventListener('click',setting.save,true);
	document.getElementById('type').addEventListener('change',setting.switchtype,true);
	url=document.getElementById('url').value=location.hostname;
	ApplyStyle();
}
init();