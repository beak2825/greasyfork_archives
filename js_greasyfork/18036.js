// ==UserScript==
// @name        WeiboPhotoUrlBatchGet
// @name:zh-CN  微博相册图片地址批量获取工具
// @namespace   http://www.mapaler.com/
// @description BatchGetWeiboPhotoURL
// @description:zh-CN 批量获取微博相册图片地址
// @include     *://weibo.com/*home*
// @include     *://weibo.com/*friends*
// @include     *://weibo.com/*mygroups*
// @include     *://www.weibo.com/*home*
// @include     *://www.weibo.com/*friends*
// @include     *://www.weibo.com/*mygroups*
// @include     *://photo.weibo.com/*albums/detail/album_id/*
// @include     *://photo.weibo.com/*talbum/index*
// @include     *://photo.weibo.com/*photos*
// @version     2.1.5
// @grant       none
// @copyright   2016+, Mapaler <mapaler@163.com>
// @icon        https://photo.weibo.com/favicon.ico
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/18036/%E5%BE%AE%E5%8D%9A%E7%9B%B8%E5%86%8C%E5%9B%BE%E7%89%87%E5%9C%B0%E5%9D%80%E6%89%B9%E9%87%8F%E8%8E%B7%E5%8F%96%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/18036/%E5%BE%AE%E5%8D%9A%E7%9B%B8%E5%86%8C%E5%9B%BE%E7%89%87%E5%9C%B0%E5%9D%80%E6%89%B9%E9%87%8F%E8%8E%B7%E5%8F%96%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
	var scriptVersion = "LocalDebug"; //本程序的版本
	var scriptName = "WeiboPhotoUrlBatchGet"; //本程序的名称
	if (typeof(GM_info)!="undefined")
	{
		scriptVersion = GM_info.script.version.trim();
		if (GM_info.script.name_i18n)
		{
			var i18n = (navigator.language||navigator.userLanguage).replace("-","_"); //获取浏览器语言
			scriptName = GM_info.script.name_i18n[i18n]; //支持Tampermonkey
		}
		else
		{
			scriptName = GM_info.script.localizedName || //支持Greasemonkey 油猴子 3.x
						GM_info.script.name; //支持Violentmonkey 暴力猴
		}
	}

	const imgCountInPage = 30; //新浪允许的每页最多获取图片张数
	var imgs = { //储存整个页面的图像
		img:[],
		count:0
	};
	var imgObj = function()
	{
		this.host = "";
		this.pid = "";
		this.extention = "";
		//this.width = 0,
		//this.height = 0,
		//this.large = "",	mw690: "",	mw600: "",	bmiddle: "",	small: "",	square: "",	sq612: "",	orj480: "",	smsq612all: "",	thumb300: "",	thumb180: "",	thumb150: "",
	}
	imgObj.prototype.addFormUrl = function (url)
	{
		let regSrc = /(https?:\/\/[^\/]+)\/.+\/([\d\w]+)\.([\d\w]+)/ig;
		let result = regSrc.exec(url);
		if (result)
		{
			this.host = result[1];
			this.pid = result[2];
			this.extention = result[3];
		}
		return this;
	};
	imgObj.prototype.add = function (host, pid, extention)
	{
		if (extention == undefined) extention = "jpg";
		this.host = host;
		this.pid = pid;
		this.extention = extention;
		return this;
	};
	imgObj.prototype.get = function (size = "large")
	{
		let src = this.host + "/" + size + "/" + this.pid + "." + this.extention;
		return src;
	};

	//仿GM_xmlhttpRequest函数v1.3
	if (typeof(GM_xmlhttpRequest) == "undefined") {
		var GM_xmlhttpRequest = function(GM_param) {

			var xhr = new XMLHttpRequest(); //创建XMLHttpRequest对象
			xhr.open(GM_param.method, GM_param.url, true);
			if (GM_param.responseType) xhr.responseType = GM_param.responseType;
			if (GM_param.overrideMimeType) xhr.overrideMimeType(GM_param.overrideMimeType);
			xhr.onreadystatechange = function() //设置回调函数
				{
					if (xhr.readyState === xhr.DONE) {
						if (xhr.status === 200 && GM_param.onload)
							GM_param.onload(xhr);
						if (xhr.status !== 200 && GM_param.onerror)
							GM_param.onerror(xhr);
					}
				}

			for (var header in GM_param.headers) {
				xhr.setRequestHeader(header, GM_param.headers[header]);
			}

			xhr.send(GM_param.data ? GM_param.data : null);
		}
	}
	//仿GM_getValue函数v1.0
	if (typeof(GM_getValue) == "undefined") {
		var GM_getValue = function(name, type) {
			var value = localStorage.getItem(name);
			if (value == undefined) return value;
			if ((/^(?:true|false)$/i.test(value) && type == undefined) || type == "boolean") {
				if (/^true$/i.test(value))
					return true;
				else if (/^false$/i.test(value))
					return false;
				else
					return Boolean(value);
			} else if ((/^\-?[\d\.]+$/i.test(value) && type == undefined) || type == "number")
				return Number(value);
			else
				return value;
		}
	}
	//仿GM_setValue函数v1.0
	if (typeof(GM_setValue) == "undefined") {
		var GM_setValue = function(name, value) {
			localStorage.setItem(name, value);
		}
	}


	var win = document.body.appendChild(document.createElement('div'));
	win.id = "WeiboPhotoUrlBatchGet"
	win.className = "WPUBG_win"
	win.style.display = "none";

	var style = win.appendChild(document.createElement("style"));
	style.type = "text/css";
	style.appendChild(document.createTextNode(`
.WPUBG_win {
	box-shadow:0 0 10px #333;
	position:fixed;
	top:0;
	right:0;
	z-index:1000000;
	font-family:arial,sans-serif;
	padding:5px;
	margin:0;
	border-radius: 0 0 0 5px;
	background:#F5F8FA
}
.WPUBG_box {
	width:250px
}
.WPUBG_tra {
	width:100%;
	height:180px
}
.WPUBG_cls {
	width:40px;
	box-shadow:0 0 2px #333;
	position:absolute;
	top:0;
	left:-40px;
	line-height:25px;
	padding:0;
	margin:0;
	border-radius:0;
	border:none;
	background:#515151;
	z-index:99999;
	text-align:center;
	color:#aaa;
	cursor:pointer
}
.WPUBG_ipt {
	width:100px
}
.WPUBG_rate {
	float:right
}
.WPUBG_info {
	max-height: 200px;
	overflow: auto;
}
`));

	var box = win.appendChild(document.createElement('div'));
	box.className = "WPUBG_box";
	//程序标题
	var title = box.appendChild(document.createElement('h3'));
	title.className = "WPUBG_title";
	title.appendChild(document.createTextNode(scriptName + " v" + scriptVersion));
	//链接输出文本框
	var linkOuTxt = box.appendChild(document.createElement('textarea'));
	linkOuTxt.className = "WPUBG_tra";
	linkOuTxt.readOnly = true;
	linkOuTxt.wrap = "off";
	linkOuTxt.placeholder = "获取数据中...";
	//尺寸标签
	var lbl = box.appendChild(document.createElement('label'));
	lbl.className = "WPUBG_lbl";
	lbl.appendChild(document.createTextNode("Size:"));
	lbl.title = `常见尺寸：
large(原图)
bmiddle
small
mw690
mw600
square
sq612
orj360
orj480
smsq612all
thumb300
thumb180
thumb150`;
	//尺寸输入框
	var ipt = box.appendChild(document.createElement('input'));
	ipt.className = "WPUBG_ipt";
	ipt.type = "text";
	ipt.placeholder = "large";
	ipt.name = "WPUBG_size";
	ipt.title = lbl.title;
	ipt.value = GM_getValue("WPUBG_size");
	ipt.onblur = function ()
	{
		GM_setValue("WPUBG_size", this.value);
		reCreatList();
	}
	ipt.onkeydown = function (event)
	{
		if (event.keyCode == 13)
		{
			this.onblur();
		}
	}

	//显示比率的文字
	var rate = box.appendChild(document.createElement('span'));
	rate.className = "WPUBG_rate";
	rate.refresh = function()
	{
		this.innerHTML = imgs.img.length + "/" + imgs.count;
	}
	//显示说明文字
	var infoDiv = box.appendChild(document.createElement('div'));
	infoDiv.className = "WPUBG_info";
//	infoDiv.appendChild(document.createTextNode(`若未能获取所有图片，按F12在控制台(Console)中查看状态。`));

	var cls = win.appendChild(document.createElement('div'));
	cls.className = "WPUBG_cls";
	cls.innerHTML = '关闭';//关闭
	cls.onclick = function (){win.style.display = "none";}

	var insertPlace = document.body;
	if (document.location.host == "photo.weibo.com")
	{
		var album = typeof($GLOBAL_DETAIL) != "undefined"; //无 $GLOBAL_DETAIL 则不是专辑
		insertPlace = document.querySelector(".m_share_like") || document.querySelector(".m_user_album");
		var btnGetAll = document.createElement('button');
		btnGetAll.className = "M_btn_h";
		btnGetAll.innerHTML = "获取本专辑全部图片地址";
		btnGetAll.onclick = function () { win.style.display = "block";getAll(album); }
		insertPlace.insertBefore(btnGetAll, insertPlace.firstChild);
	} else
	{
		insertPlace = document.querySelector("#plc_top");
		var btnGetUp = insertPlace.appendChild(document.createElement('button'));
		btnGetUp.className = "W_btn_a";
		btnGetUp.innerHTML = "获得上传的图地址";
		btnGetUp.style.cssFloat = "left";
		btnGetUp.onclick = function () { win.style.display = "block";getUp(); }
	}

	function getUp()
	{
		var pics = document.querySelectorAll(".drag_pic_list .pic");
		for (var pi = 0; pi < pics.length; pi++)
		{
			var pdiv = pics[pi].getElementsByTagName("div")[0];
			var img = new imgObj;
			imgs.img.push(img.addFormUrl(pdiv.style.backgroundImage))
			linkOuTxt.value += img.get() + "\n";
		}
	}
	function getAll(isAlbum)
	{
		if (imgs.img.length > 0)
			reCreatList();  //重新生成列表，不重复获取
		else
		{
			var type = (isAlbum && $GLOBAL_DETAIL.type == 3) ? 3 : 1 ; //当type为3时（访问他人相册），无法一次性获取所有图像，只能每次30个。
			infoDiv.innerHTML = "";
			GM_xmlhttpRequest({
				method: "GET",
				url: "//photo.weibo.com/photos/get_all?uid=" + $CONFIG.owner_uid + (isAlbum?"&album_id=" + $GLOBAL_DETAIL.album_info.album_id:"") + "&count=1&type=" + type + "&__rnd=" + new Date().getTime(),
				onload: function(response) {
					dellFirstJSON(response, $CONFIG.owner_uid, (isAlbum?$GLOBAL_DETAIL.album_info.album_id:isAlbum), type)
				}
			});
		}
	}

	function dellFirstJSON(response, uid, aid, type)
	{
		var info = JSON.parse(response.response);
		imgs.count = info.data.total; //添加图片总数

		//当前进度
		rate.refresh();
		if (imgs.count<1){alert("图片总数为0，可能没有图片。");return;}

		if(type == 3)
		{
			for(let pi=1, len=Math.ceil(imgs.count/imgCountInPage); pi<=len; pi++)
			{
				GM_xmlhttpRequest({
					method: "GET",
					url: "//photo.weibo.com/photos/get_all?uid=" + uid + (aid?"&album_id=" + aid:"") + "&count=" + imgCountInPage + "&page=" + pi + "&type=" + type + "&__rnd=" + new Date().getTime(),
					onload: function(response) {
						let _pi = pi;
						dellAllJSON(response, _pi);
					}
				});
			}
		}else
		{
			GM_xmlhttpRequest({
				method: "GET",
				url: "//photo.weibo.com/photos/get_all?uid=" + uid + (aid?"&album_id=" + aid:"") + "&count=" + info.data.total + "&type=" + type + "&__rnd=" + new Date().getTime(),
				onload: function(response) {
					dellAllJSON(response);
				}
			});
		}
	}

	function dellAllJSON(response, pageIndex)
	{
		let info = JSON.parse(response.response);
		let plist = info.data.photo_list;
		if(pageIndex && plist.length < imgCountInPage && plist.length < imgs.count)
		{
			let maxPage = Math.ceil(imgs.count / imgCountInPage); //总共应该多少页
			let lastPageCount = imgs.count % imgCountInPage; //最后一页应该多少张
			let str = `第${pageIndex}页，仅获取到${plist.length}/${imgCountInPage}个数据`;
			if (pageIndex == maxPage && plist.length < lastPageCount)
			{
				str = `第${pageIndex}页（最后一页），仅获取到${plist.length}/${lastPageCount}个数据`
			}
			infoDiv.innerHTML += str + "<br>";
			console.log(str,info);
		}
		for (var pi = plist.length - 1; pi >= 0; pi--)
		{
			let img = new imgObj;
			let regFn = /([\d\w]+)\.([\d\w]+)/ig;
			let resultFn = regFn.exec(plist[pi].pic_name);
			img.add(plist[pi].pic_host, plist[pi].pic_pid, resultFn[2]);
			imgs.img.push(img);
		}
		reCreatList();
	}

	function reCreatList(size) //重新生成列表
	{
		let sizeSetting = GM_getValue("WPUBG_size");
		if (size == undefined && sizeSetting != undefined && typeof(sizeSetting) == "string" && sizeSetting.length>0)
			size = sizeSetting;
		else
			size = "large";

		//用了ES5的map，将当前所有图像生成链接写入
		let links = imgs.img.map(function (img) {return img.get(size);});
		linkOuTxt.value = links.join("\n");

		//当前进度
		rate.refresh();
	}
})();