// ==UserScript==
// @name        Discuz论坛头像上传助手
// @author      枫谷剑仙
// @description 突破图片尺寸、GIF帧数限制，无损上传
// @version     2.1.0
// @namespace   http://www.mapaler.com/
// @include     */home.php?mod=spacecp&ac=avatar*
// @icon	    https://gitee.com/Discuz/DiscuzX/raw/master/upload/uc_server/images/noavatar_small.gif
// @grant       unsafeWindow
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/11969/Discuz%E8%AE%BA%E5%9D%9B%E5%A4%B4%E5%83%8F%E4%B8%8A%E4%BC%A0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/11969/Discuz%E8%AE%BA%E5%9D%9B%E5%A4%B4%E5%83%8F%E4%B8%8A%E4%BC%A0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function(){
	'use strict';

const _window = globalThis.unsafeWindow ?? globalThis.window;
const avatarform = document.querySelector("#avatarform") ||
					document.querySelector("form[action^=home]"); //以前没有HTML5的老版本，没有#avatarform
if (!avatarform) {
	console.error("未检测到 Discuz! X 原版头像上传位点，头像上传助手退出。");
	return;
}

let noGM_xmlhttpRequest = Boolean(globalThis.GM_xmlhttpRequest || globalThis.GM_info);
//仿GM_xmlhttpRequest函数v1.4
if (noGM_xmlhttpRequest) {
	noGM_xmlhttpRequest = true;
	globalThis.GM_xmlhttpRequest = function(GM_param) {
		const xhr = new XMLHttpRequest(); //创建XMLHttpRequest对象
		xhr.open(GM_param.method, GM_param.url, true);
		if (GM_param.responseType) xhr.responseType = GM_param.responseType;
		if (GM_param.overrideMimeType) xhr.overrideMimeType(GM_param.overrideMimeType);
		xhr.onreadystatechange = function(e) //设置回调函数
			{
				const _xhr = e.target;
				if (_xhr.readyState === _xhr.DONE) { //请求完成时
					if (_xhr.status === 200 && GM_param.onload) //正确加载时
					{
						GM_param.onload(_xhr);
					}
					if (_xhr.status !== 200 && GM_param.onerror) //发生错误时
					{
						GM_param.onerror(_xhr);
					}
				}
			};
		if (GM_param.onprogress)
			xhr.upload.onprogress = function(e){GM_param.onprogress(e.target)};
		//添加header
		for (let header in GM_param.headers) {
			xhr.setRequestHeader(header, GM_param.headers[header]);
		}
		//发送数据
		xhr.send(GM_param.data ? GM_param.data : null);
	};
}

const avatarsDefine = [
	{name:'大头像',code:'big',maxWidth:200,maxHeight:250,blob:null},
	{name:'中头像',code:'middle',maxWidth:120,maxHeight:120,blob:null},
	{name:'小头像',code:'small',maxWidth:48,maxHeight:48,blob:null},
];

// HTML5版本才会有的几个提交按钮
const ipt_avatarArr = [
	avatarform.querySelector('[name="avatar1"]'),
	avatarform.querySelector('[name="avatar2"]'),
	avatarform.querySelector('[name="avatar3"]'),
];
const ipt_Filedata = avatarform.querySelector('[name="Filedata"]');
const ipt_confirm = avatarform.querySelector('[name="confirm"]');
// Flash版本的Flash
const swf_mycamera = avatarform.querySelector('[name="mycamera"]');

const html5mode = Boolean(ipt_confirm); //HTML5模式还是Flash
if (!html5mode && !swf_mycamera) {
	console.error("未检测到 HTML5 模式与 Flash 模式，头像上传助手退出。");
	return;
}

let data = _window.data;
const swfUrl = new URL(data ? data.at(data.indexOf('src')+1) : swf_mycamera?.src, location);
const maxSize = parseInt(swfUrl?.searchParams?.get('uploadSize') || 2 ** 11, 10) * 2 ** 10 ;

let styleCss = `.discuz-avatar{
	border: 1px solid #ccc;
	padding: 5px 15px;
	width:auto;
	width: 450px;
	box-sizing: border-box;
}
.discuz-avatar h3{
	text-align:center;
}
.pic-type-list {
	display: flex;
	gap: 15px;
}
.pic-type-div{
	vertical-align:top;
}
.pic-type-div:last-of-type{
	margin-right: unset;
}
.pic-div{
	border: 1px solid #ccc;
	cursor: pointer;
	position: relative;
	display: table-cell;
	text-align:center;
	vertical-align: middle;
	background: #fff;
	background-image: 
		linear-gradient(45deg, #eee 25%, transparent 26%, transparent 74%, #eee 75%),
		linear-gradient(45deg, #eee 25%, transparent 26%, transparent 74%, #eee 75%);
	background-position: 0 0, 10px 10px;
	background-size: 20px 20px;
}
.pic-type-div .pic-div{
	width: var(--width);
	height: var(--height);
}
.pic-type-div .pic-img{
	max-width: var(--width);
	max-height: var(--height);
}
.pic-tag::before {
	content: var(--name);
}
.pic-tag::after {
	content: var(--width-text) "×" var(--height-text);
}

.choose-file{
	display: none;
}
.pic-div.nopic::before{
	content:"➕";
	font-size: 2em;
}
.pic-tag{
	text-align:center;
	display: flex;
	flex-direction: column;
}
.submit-bar{
	text-align:center;
}
/*Flash AJAX状态使用*/
.status-bar{
	font-size:2em;
	background-repeat: no-repeat;
	background-position: center;
	margin:0px auto;
	display:none;
	text-align: center;
}
.status-bar[data-status]{
	display:block;
}
@keyframes loading-animate{
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(3600deg);
	}
}
.status-bar[data-status="loading"]::before {
	display: inline-block;
	border: 4px SteelBlue dotted;
	border-radius: 50%;
	content:"";
	width: 1em;
	height: 1em;
	animation: loading-animate 50s infinite linear;
}
.status-bar[data-status="success"]::before {
	content:"✔️";
}
.status-bar[data-status="error"]::before {
	content:"❌";
}
.progress-bar{
	padding: 5px;
	text-align: center;
}
`;
styleCss += avatarsDefine.map(({name, code, maxWidth, maxHeight})=>`.pic-type-${code} {
	--width: ${maxWidth}px;
	--height: ${maxHeight}px;
	--width-text: "${maxWidth}";
	--height-text: "${maxHeight}";
	--name: "${name}";
}`).join('\n');


const fragment = document.createDocumentFragment();

const ctlDiv = fragment.appendChild(document.createElement('div'));
ctlDiv.className = 'discuz-avatar';
const style = ctlDiv.appendChild(document.createElement('style'));
style.innerHTML = styleCss;
const caption = ctlDiv.appendChild(document.createElement('h3'));
caption.appendChild(document.createTextNode(globalThis.GM_info ?`${GM_info?.script?.name} ${GM_info.script?.version}`:'无脚本扩展，直接执行脚本'));
caption.appendChild(document.createElement('br'));
caption.appendChild(document.createTextNode(`${html5mode?'HTML5':'Flash'}模式`));
const picTable = ctlDiv.appendChild(document.createElement('ul'));
picTable.className = 'pic-type-list';
const picImgs = [];
avatarsDefine.forEach((obj,idx)=>{
	const picTypeDiv = picTable.appendChild(document.createElement('li'));
	picTypeDiv.className = 'pic-type-div pic-type-' + obj.code;
	const picDiv = picTypeDiv.appendChild(document.createElement('div'));
	picDiv.className = 'pic-div nopic';

	const pic = new Image();
	picDiv.appendChild(pic);
	pic.className = 'pic-img img-' + obj.code;
	pic.onload = function(){
		if (this.naturalWidth > obj.maxWidth) {
			progressDiv.pushInfo(`${obj.name}宽度大于 ${obj.maxWidth}px，可能可能上传失败！`);
		}
		if (this.naturalHeight > obj.maxHeight) {
			progressDiv.pushInfo(`${obj.name}高度大于 ${obj.maxHeight}px，可能可能上传失败！`);
		}
	}
	picImgs.push(pic);

	const file = picDiv.appendChild(document.createElement('input'));
	file.type = "file";
	file.accept="image/*";
	file.className = "choose-file";
	picDiv.onclick = function(){
		file.click();
	}

	file.onchange = function(e){
		const file = e.target.files[0];
		const imageType = /image\/.*/i;
		progressDiv.newInfo('');
		if (!imageType.test(file.type)) {
			progressDiv.pushInfo(`${file.name} 不是有效的图像文件！`);
			pic.src = '';
			picDiv.classList.add('nopic');
			return;
		}
		if (file.size > maxSize) {
			progressDiv.pushInfo(`${obj.name} ${file.name} 文件大小超出 ${maxSize/2 ** 10}MiB，可能上传失败！`);
		}
		picDiv.classList.remove('nopic');
		if (pic.src.length>0)
			URL.revokeObjectURL(pic.src);
		pic.src = URL.createObjectURL(file);
		obj.blob = file;
	}

	const tagDiv = picTypeDiv.appendChild(document.createElement('div'));
	tagDiv.className = 'pic-tag';

});

const statusDiv = ctlDiv.appendChild(document.createElement('div'));
statusDiv.className = 'status-bar';
const progressDiv = ctlDiv.appendChild(document.createElement('div'));
progressDiv.className = 'progress-bar';
progressDiv.newInfo = function(text){
	if (typeof text === "string") {
		this.textContent = text;
	} else if (text instanceof Node) {
		this.innerHTML = '';
		this.append(text);
	}
}
progressDiv.pushInfo = function(text){
		this.append(document.createElement("br"), text);
}
const submitDiv = ctlDiv.appendChild(document.createElement('div'));
submitDiv.className = 'submit-bar';
const submit = submitDiv.appendChild(document.createElement('button'));
submit.className = 'submit-btn';
submit.innerHTML = '📤提交';
submit.onclick = function(){
	if (!avatarsDefine.every(obj=>obj.blob))
	{
		progressDiv.newInfo(`还未添加 ${avatarsDefine.filter(obj=>!obj.blob).map(obj=>obj.name).join('、')} 图像`);
		return;
	}
	submit.disabled = true;

	const fileDataArr = [];
	function readBlobs(blobArr,type,callback)
	{
		if (blobArr.length<1)
		{
			callback(fileDataArr);
			return;
		}
		const file = blobArr.shift();
		const fileReader = new FileReader();
		fileReader.onload = function (e) {
			fileDataArr.push(e.target.result);
			readBlobs(blobArr, type, callback);
		}
		if (type == 'base64')
			fileReader.readAsDataURL(file);
		else //if (type == 'arrayBuffer')
			fileReader.readAsArrayBuffer(file);
	}
	readBlobs(avatarsDefine.map(obj=>obj.blob), html5mode ? 'base64':'arrayBuffer', (html5mode ? sumbitAvatarsHTML5 : sumbitAvatarsFlash));
}
ctlDiv.appendChild(document.createElement('hr'));
const tipsDiv = ctlDiv.appendChild(document.createElement('div'));
tipsDiv.className = 'tips-bar';
let quote = null,code = null;

if (!html5mode)
{
	console.log(new URL(_parseBasePath(swfUrl)).host,location.host,noGM_xmlhttpRequest)
	if (noGM_xmlhttpRequest && new URL(_parseBasePath(swfUrl)).host != location.host)
	{
		quote = submitDiv.appendChild(document.createElement('div'));
		quote.className = 'quote';
		quote.appendChild(document.createTextNode('该站点 UCenter 跨域，目前为直接执行模式无法处理 Flash 跨域问题。请使用脚本扩展，或使用 DZX3.4 的 HTML5 模式。'));
	}

	quote = tipsDiv.appendChild(document.createElement('div'));
	quote.className = 'quote';
	quote.appendChild(document.createTextNode('若上传100%后显示'));
	code = quote.appendChild(document.createElement('div'));
	code.className = 'blockcode';
	code.appendChild(document.createTextNode('<?xml version="1.0" ?><root><face success="0"/></root>'));
	quote.appendChild(document.createTextNode('可能是图像像素超出服务器后台限制，或格式不被 PHP 支持。'));

	quote = tipsDiv.appendChild(document.createElement('div'));
	quote.className = 'quote';
	quote.appendChild(document.createTextNode('若上传显示'));
	code = quote.appendChild(document.createElement('div'));
	code.className = 'blockcode';
	code.appendChild(document.createTextNode('Access denied for agent changed'));
	quote.appendChild(document.createTextNode('可能是你的活动状态失效了需要刷新，或者是 Discuz 和 UCenter 通信没配好，请直接联系网站管理员。'));
	
}

quote = tipsDiv.appendChild(document.createElement('div'));
quote.className = 'quote';
quote.appendChild(document.createTextNode('PHP 7.1 才支持 WebP 格式，若 WebP 上传失败可能是服务器后端 PHP 检查图片格式时失败。想上传动画可以用 APNG 或 GIF。'));

//将UI插入
avatarform.parentNode.appendChild(fragment);

//HTML5模式提交
function sumbitAvatarsHTML5(base64Arr)
{
	progressDiv.newInfo('已提交，HTML5 模式成功状态请直接参考上方编辑器');
	const dataArr = base64Arr.map(str=>str.substr(str.indexOf(",") + 1)); //拿到3个头像的Base64字符串
	dataArr.forEach((str,idx)=>{
		ipt_avatarArr[idx].value = str;
	});
	ipt_Filedata.value = '';
	if (ipt_confirm) ipt_confirm.value = '';

	avatarform.action = swfUrl.toString().replace('images/camera.swf?inajax=1', 'index.php?m=user&a=rectavatar&base64=yes'); //来自官方代码： static/avatar/avatar.js?EMK，你敢信？官方代码居然就是字符串替换
	avatarform.target='rectframe';
	avatarform.submit();
	submit.disabled = false;
}
//Flash模式提交
function sumbitAvatarsFlash(arrayBufferArr)
{
	statusDiv.setAttribute('data-status','loading');
	const dataArr = arrayBufferArr.map(bytes=>{
		const uint8Array = new Uint8Array(bytes);
		const numArray = Array.from(uint8Array);
		const strArray = numArray.map(bit=>`${bit<16?0:''}${bit.toString(16)}`);
		return strArray.join('').toUpperCase();
	});
	const sp = swfUrl.searchParams;
	const loc1 = _parseBasePath(swfUrl);
	const apiUrl = new URL(`${loc1}index.php`);
	apiUrl.protocol = location.protocol; //解决http和https混合内容的问题
	const asp = apiUrl.searchParams;
	asp.set('m','user');
	asp.set('inajax',1);
	asp.set('a','rectavatar');
	asp.set('appid',sp.get('appid'));
	asp.set('input',sp.get('input'));
	asp.set('agent',sp.get('agent'));
	asp.set('avatartype',sp.get('avatartype'));
	const post = new URLSearchParams();
	dataArr.forEach((str,idx)=>{
		post.set(`avatar${idx+1}`,str)
	});
	post.set('urlReaderTS',Date.now());
	
	GM_xmlhttpRequest({
		method: "POST",
		url: apiUrl,
		data: post.toString(),
		headers: {"Content-Type": "application/x-www-form-urlencoded"},
		onload: onloadHandler,
		onerror: onerrorHandler,
		onprogress: uploadOnprogressHandler
	});
}

//Flash模式的传统方法
function _parseBasePath(arg1)
{
	let loc1 = arg1.searchParams.get('ucapi');
	if (loc1.length > 0 && !(loc1.substring((loc1.length - 1)) == "/")) 
	{
		loc1 = loc1 + "/";
	}
	if (loc1.length > 0 && !new RegExp("^https?://", "i").test(loc1)) 
	{
		loc1 = "http://" + loc1;
	}
	return loc1;
}

function onloadHandler(response) {
	progressDiv.newInfo("100%");
	const xml = response.responseXML;
	console.log(xml)
	if (xml) {
		const success = xml.querySelector('face');
		if (success != null && success.getAttribute("success") == 1) {
			statusDiv.setAttribute('data-status','success');
		} else {
			statusDiv.setAttribute('data-status','error');
			const message = xml.querySelector('message');
			if (message)
				progressDiv.newInfo(message.getAttribute('type') + ': ' + message.getAttribute('value'));
			else
				progressDiv.newInfo(response.responseText);
		}
	} else {
		statusDiv.setAttribute('data-status','error');
		progressDiv.newInfo('error: no responseXML');
	}
	onloadendHandler();
}

function onerrorHandler(e) {
	statusDiv.setAttribute('data-status','error');
	onloadendHandler();
}

function onloadendHandler(e) {
	submit.disabled = false;
}

function uploadOnprogressHandler(e) {
	if (e.lengthComputable) {
		progressDiv.newInfo((e.loaded / e.total).toLocaleString(undefined,{style:'percent'}));
	}
}
})();