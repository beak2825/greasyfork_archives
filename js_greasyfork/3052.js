// ==UserScript==
// @name        太平洋电脑网头像上传助手
// @author      greasepig
// @description 可上传GIF动态图片
// @version     1.0.1
// @namespace   https://greasyfork.org/users/2620-greasepig
// @include     http://my.pconline.com.cn/setting/face.jsp
// @grant       GM_xmlhttpRequest
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/3052/%E5%A4%AA%E5%B9%B3%E6%B4%8B%E7%94%B5%E8%84%91%E7%BD%91%E5%A4%B4%E5%83%8F%E4%B8%8A%E4%BC%A0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/3052/%E5%A4%AA%E5%B9%B3%E6%B4%8B%E7%94%B5%E8%84%91%E7%BD%91%E5%A4%B4%E5%83%8F%E4%B8%8A%E4%BC%A0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

function _xmlhttpRequest(details) {
	function setupEvent(xhr, url, eventName, callback) {
		xhr[eventName] = function () {
			var isComplete = xhr.readyState == 4;
			var responseState = {
				responseText: xhr.responseText,
				readyState: xhr.readyState,
				responseHeaders: isComplete ? xhr.getAllResponseHeaders() : "",
				status: isComplete ? xhr.status : 0,
				statusText: isComplete ? xhr.statusText : "",
				finalUrl: isComplete ? url : ""
			};
			callback(responseState);
		};
	}

	var xhr = new XMLHttpRequest();
	var eventNames = ["onload", "onerror", "onreadystatechange"];
	for (var i = 0; i < eventNames.length; i++ ) {
		var eventName = eventNames[i];
		if (eventName in details) {
			setupEvent(xhr, details.url, eventName, details[eventName]);
		}
	}
	if (details.upload) {
		for (var eventName in details.upload) {
			xhr.upload[eventName] = details.upload[eventName];
		}
	}

	xhr.open(details.method, details.url);

	if (details.overrideMimeType) {
		xhr.overrideMimeType(details.overrideMimeType);
	}
	if (details.headers) {
		for (var header in details.headers) {
			xhr.setRequestHeader(header, details.headers[header]);
		}
	}
	xhr.send(details.data ? details.data : null);
}

if (navigator.userAgent.indexOf('Firefox') == -1) 
	GM_xmlhttpRequest = _xmlhttpRequest;

function $(id) {
	return document.getElementById(id);
}

function getCookie(name){
	var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	if (arr = document.cookie.match(reg)) return unescape(arr[2]);
	else return null;
}

var session_id = getCookie('common_session_id');
var uploadUrl = 'http://upc.pconline.com.cn/upload_head_stream_flash.jsp?action=upload&application=usercenter&common_session_id=' + session_id;
var commitUrl = 'http://upc.pconline.com.cn/upload_head_stream_flash.jsp?action=commit&application=usercenter&common_session_id=' + session_id;

var out = document.createElement('div');
out.innerHTML = '<style>#discuz-avatar {width:650px; padding:20px 0px; border:1px solid #CCC; background-color: white; text-align:center;}#discuz-avatar td {padding:15px 10px; vertical-align: top; text-align: center;}#discuz-avatar td span {display:block; padding:10px 0;}.img_div {display:table-cell; vertical-align: middle; border: 1px solid #CCC; cursor: pointer; background: url("http://bcs.duapp.com/user-img/discuz-avatar/bg.png");}#avatar_150x150 {width:150px; height:150px;}#avatar_120x120 {width:120px; height:120px;}#avatar_100x100 {width:100px; height:100px;}#avatar_70x70 {width:70px; height:70px;}#avatar_50x50 {width:50px; height:50px;}#avatar_20x20 {width:20px; height:20px;}#img_150x150 {max-width: 150px; max-height: 150px;}#img_120x120 {max-width: 120px; max-height: 120px;}#img_100x100 {max-width: 100px; max-height: 100px;}#img_70x70 {max-width: 70px; max-height: 70px;}#img_50x50 {max-width: 50px; max-height: 50px;}#img_20x20 {max-width: 20px; max-height: 20px;}#submit {width:60px;}#status {display:none; width:40px; height:40px; margin:0px auto;}#status.loading {background: url(http://bcs.duapp.com/user-img/discuz-avatar/loading.gif) no-repeat center;}#status.success {background: url(http://bcs.duapp.com/user-img/discuz-avatar/success.png) no-repeat center;}#status.error {background: url(http://bcs.duapp.com/user-img/discuz-avatar/error.png) no-repeat center;}#progress {padding: 5px;}</style><div id="discuz-avatar"><a href="https://greasyfork.org/users/2620-greasepig"><h3>{ 太平洋电脑网头像上传助手 }</h3></a><table><tr><td><div id="avatar_150x150" class="img_div"><img id="img_150x150" src="http://bcs.duapp.com/user-img/discuz-avatar/add_image.png"></div><span>150x150</span></td><td><div id="avatar_120x120" class="img_div"><img id="img_120x120" src="http://bcs.duapp.com/user-img/discuz-avatar/add_image.png"></div><span>120x120</span></td><td><div id="avatar_100x100" class="img_div"><img id="img_100x100" src="http://bcs.duapp.com/user-img/discuz-avatar/add_image.png"></div><span>100x100</span></td><td><div id="avatar_70x70" class="img_div"><img id="img_70x70" src="http://bcs.duapp.com/user-img/discuz-avatar/add_image.png"></div><span>70x70</span></td><td><div id="avatar_50x50" class="img_div"><img id="img_50x50" src="http://bcs.duapp.com/user-img/discuz-avatar/add_image.png"></div><span>50x50</span></td><td><div id="avatar_20x20" class="img_div"><img id="img_20x20" src="http://bcs.duapp.com/user-img/discuz-avatar/add_image.png"></div><span>20x20</span></td></tr></table><div id="status"></div><div id="progress"></div><input id="submit" type="button" value="提交" disabled="disabled"></div>';
var formDiv = $('formDiv');
formDiv.insertBefore(out, formDiv.firstChild);

var btnSubmit = $('submit');
var statusIcon = $('status');
var uploadProgress = $('progress');
var avatars = {
	'150x150': {img: $('img_150x150'), queryStr: '&width=150&height=150', binStr: null, uploaded: false},
	'120x120': {img: $('img_120x120'), queryStr: '&width=120&height=120', binStr: null, uploaded: false},
	'100x100': {img: $('img_100x100'), queryStr: '&width=100&height=100', binStr: null, uploaded: false},
	'70x70': {img: $('img_70x70'), queryStr: '&width=70&height=70', binStr: null, uploaded: false},
	'50x50': {img: $('img_50x50'), queryStr: '&width=50&height=50', binStr: null, uploaded: false},
	'20x20': {img: $('img_20x20'), queryStr: '&width=20&height=20', binStr: null, uploaded: false}
};
var uploadNow = '';

function readFile (onloadFunc) {
	var reader = new FileReader();
	reader.onload = onloadFunc;
	return reader;
}

function showImage(size, file){
	readFile(function(e){
		avatars[size].img.src = e.target.result;
	}).readAsDataURL(file);
}

function getImageBinArray(size, file){
	readFile(function(e){
		avatars[size].binStr = new Uint8Array(e.target.result);
		avatars[size].uploaded = false;
		btnSubmit.removeAttribute('disabled');
	}).readAsArrayBuffer(file);
}

function handleFile(size, file){
	var imageType = /image\/.*/;
	if (!file.type.match(imageType)) {
		alert('不是有效的图像文件！');
		return;
	}
	if (file.size > 1048576) {
		alert('文件大小必须在1M(1048576字节)以内!');
		return;
	}
	getImageBinArray(size, file);
	showImage(size, file);
}

function bindOpenFile(size) {
	var handleBox = $('avatar_' + size);
	handleBox.addEventListener('click', function(e){
		var file = document.createElement('input');
		file.type = 'file';
		file.accept = 'image/*';
		file.addEventListener('change', function(e){
			handleFile(size, e.target.files[0]);
		});
		file.click();
	}, false);
}

function onUploadHandler(response) {
	uploadProgress.textContent = '正在上传 ' + uploadNow + ': 100%';
	if (response.status == 200 && response.responseText.indexOf('"retCode":0') >= 0) {
		avatars[uploadNow].uploaded = true;
		startUpload();
	} else {
		onerrorHandler(response);
	}
}

function onerrorHandler(e) {
	uploadProgress.textContent = e.statusText;
	statusIcon.className = 'error';
	onloadendHandler();
}

function onloadendHandler() {
	btnSubmit.removeAttribute('disabled');
}

function uploadOnprogressHandler(e) {
	if (e.lengthComputable) {
		uploadProgress.textContent = '正在上传 ' + uploadNow + ': ' + Math.round(100 * e.loaded / e.total) + '%';
	}
}

function onCommitHandler(response) {
	if (response.status == 200 && response.responseText.indexOf('"retCode":0') >= 0) {
		uploadProgress.textContent = '完成';
		statusIcon.className = 'success';
		// onloadendHandler();
	} else {
		onerrorHandler(response);
	}
}

function uploadCommit() {
	uploadProgress.textContent = '正在设置头像';
	GM_xmlhttpRequest({
		method: 'GET',
		url: commitUrl,
		onload: onCommitHandler,
		onerror: onerrorHandler
	});
}

function uploadAvatar(size) {
	uploadNow = size;
	uploadProgress.textContent = '正在上传 ' + size;
	GM_xmlhttpRequest({
		method: 'POST',
		url: uploadUrl + avatars[size].queryStr,
		data: avatars[size].binStr,
		headers: {'Content-Type': 'application/octet-stream'},
		onload: onUploadHandler,
		onerror: onerrorHandler,
		upload: {onprogress: uploadOnprogressHandler}
	});
}

function startUpload() {
	var size;
	for (size in avatars) {
		if (avatars[size].binStr != null && avatars[size].uploaded == false)
			return uploadAvatar(size);
	}
	uploadCommit();
}

function upload() {
	btnSubmit.setAttribute('disabled', 'disabled');
	statusIcon.style.display = 'block';
	statusIcon.className = 'loading';
	startUpload();
}

for (var size in avatars) {
	bindOpenFile(size);
}
btnSubmit.addEventListener('click', upload);
