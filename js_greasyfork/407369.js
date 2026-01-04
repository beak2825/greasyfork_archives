// ==UserScript==
// @name         轻小说文库下载
// @namespace    wenku8Haoa
// @version      2.2.6
// @description  生成分卷和全本ePub文档、ePub文档插图拖放、部分小说的在线阅读
// @author       HaoaW
// @match        *://www.wenku8.net/*
// @match        *://www.wenku8.cc/*
// @connect      wenku8.com
// @connect      777743.xyz
// @require      https://cdn.jsdelivr.net/npm/opencc-js@1.0.5/dist/umd/full.js
// @require      https://cdn.jsdelivr.net/npm/jszip@2.6.1/dist/jszip.js
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.js
// @icon         https://www.wenku8.net/favicon.ico
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/407369/%E8%BD%BB%E5%B0%8F%E8%AF%B4%E6%96%87%E5%BA%93%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/407369/%E8%BD%BB%E5%B0%8F%E8%AF%B4%E6%96%87%E5%BA%93%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
	'use strict';
	let hrefUrl = new URL(window.location.href);
	const ePubEidterCfgUID = "24A08AE1-E132-458C-9E1D-6C998F16A666";
	const ImgLocationFile = "ImgLocation";
	const xmlIllegalCharacters = /[\x00-\x08\x0B\x0C\x0E-\x1F]/g;
	function OpenCCConver() {
		let OpenCCInfo = {
			OpenCCCookieKey: "OpenCCwenku8",//存放设置的cookie的key
			OpenCCCookie: null,//存放设置的cookie的值
			translateButtonId: translateButtonId,//GB_BIG5转换元素ID
			GB_BIG5_Simplized: Simplized,//GB_BIG5转换方法
			GB_BIG5_Traditionalized: Traditionalized,//GB_BIG5转换方法
			currentEncoding: currentEncoding,// 1: 繁體中文, 2: 简体中文
			targetEncodingCookie: targetEncodingCookie,//GB_BIG5翻译目标
			translateBody: translateBody,//翻译元素方法
			setCookie: setCookie,//设置cookie
			getCookie: getCookie,//读cookie
			CookieDays: 7,//cookie天数
			OpenCCEle: null,//开关元素
			OpenCCEleClick: () => {
				//关闭
				if (OpenCCInfo.OpenCCCookie) {
					OpenCCInfo.setCookie(OpenCCInfo.OpenCCCookieKey, "", OpenCCInfo.CookieDays);
					location.reload();
				}
				//开启
				else {
					OpenCCInfo.setCookie(OpenCCInfo.targetEncodingCookie, "2", OpenCCInfo.CookieDays);
					OpenCCInfo.setCookie(OpenCCInfo.OpenCCCookieKey, "1", OpenCCInfo.CookieDays);
					location.reload();
				}
			},//开关元素点击事件
			start: () => {
				OpenCCInfo.OpenCCEle = document.createElement("a");
				OpenCCInfo.OpenCCEle.href = "javascript:void(0);"
				OpenCCInfo.OpenCCEle.innerHTML = "開啟(OpenCC)";
				OpenCCInfo.OpenCCEle.addEventListener("click", OpenCCInfo.OpenCCEleClick);
				//如果有设置就替换GB_BIG5的转换
				if (OpenCCInfo.OpenCCCookie) {
					OpenCCInfo.OpenCCEle.innerHTML = "关闭(OpenCC)";

					Traditionalized = OpenCC.Converter({ from: "cn", to: "tw" });
					Simplized = OpenCC.Converter({ from: "tw", to: "cn" });

					if ("1" == OpenCCInfo.OpenCCCookie) {
						targetEncoding = OpenCCInfo.OpenCCCookie;
						translateBody();
					}
				}
				//添加开关元素
				let tranBtn = document.querySelector(`#${OpenCCInfo.translateButtonId}`);
				if (tranBtn) {
					tranBtn.parentElement.appendChild(document.createTextNode("  "));
					tranBtn.parentElement.appendChild(OpenCCInfo.OpenCCEle);
				}
			},//
		};
		OpenCCInfo.OpenCCCookie = OpenCCInfo.getCookie(OpenCCInfo.OpenCCCookieKey);
		return OpenCCInfo.start;
	};//使用OpenCCC进行简转繁
	OpenCCConver()();
	function AppApi() {
		let AppApiInfo = {
			VolumeMap: new Map(),
			appApiDomain: "app.wenku8.com",//app接口域名
			appApiPath: "/android.php",//app接口路径
			appApiUA:"Android",//app接口似乎添加了UA检测，使用浏览器UA响应异常
			appApiLangDis: true,//禁用app接口请求繁体内容。由页面自行转换。
			appApiLang: (info) => {
				if (AppApiInfo.appApiLangDis) {
					return "0";
				}
				//0 simplified Chinese;1 traditional Chinese
				let rst = "0";
				if ("1" == info.targetEncoding) {
					rst = "1";
				}
				else if ("2" == info.targetEncoding) {
					rst = "0";
				}
				return rst;
			},//语言选择
			appApiGetEncrypted: (body) => {
				return `appver=1.0&timetoken=${Number(new Date())}&request=${btoa(body)}`;
			},//编码请求内容
			appApiListLoad: (xhr) => {
				xhr.start = true;
				xhr.bookInfo.refreshProgress(xhr.bookInfo,`下载app章节目录;`);
				let lang = AppApiInfo.appApiLang(xhr.bookInfo);
				let body = `action=book&do=list&aid=${xhr.bookInfo.aid}&t=${lang}`;
				body = AppApiInfo.appApiGetEncrypted(body);
				GM_xmlhttpRequest({
					method: 'POST',
					url: xhr.url,
					headers: {
						"content-type": "application/x-www-form-urlencoded;charset=utf-8",
						"User-Agent": AppApiInfo.appApiUA
					},
					data: body,
					onload: function (response) {
						if (response.status == 200) {
							xhr.done = true;
							let rspRaw = response.responseText;
							//格式化xml内容
							let domParser = new DOMParser();
							let rspXml = domParser.parseFromString(rspRaw.replaceAll(xmlIllegalCharacters, ''), "application/xml");
							AppApiInfo.appApiList = rspXml;
							//继续下载在等待章节列表的分卷
							for (let x of AppApiInfo.appApiListWait) {
								AppApiInfo.appApiLoadVolume(x);
							}
						} else {
							//重新下载
							xhr.XHRRetryFun(xhr, `app章节目录下载失败，重新下载;`);
						}
					},
					onerror: () => {
						//重新下载
						xhr.XHRRetryFun(xhr, `app章节目录下载失败，重新下载;`);
					}
				});
			},//下载章节列表，全本下载只下载一次
			appApiList: null,//章节列表docum，XML
			appApiListStart: false,//章节列表已开始下载
			appApiListWait: [],//等待章节列表的xhr
			appApiDoList: (xhr) => {
				if (!AppApiInfo.appApiListStart) {
					AppApiInfo.appApiListStart = true;
					//下载章节列表
					let dlink = `http://${AppApiInfo.appApiDomain}${AppApiInfo.appApiPath}`;
					let lXhr = { start: false, done: false, url: dlink, loadFun: AppApiInfo.appApiListLoad, VolumeIndex: xhr.VolumeIndex, bookInfo: xhr.bookInfo };
					lXhr.bookInfo.XHRAdd(lXhr);
				}
				AppApiInfo.appApiListWait.push(xhr);
			},//下载章节列表，处理等待队列
			appApiLoadVolume: (xhr) => {
				//如果没有章节列表就去下载
				if (!AppApiInfo.appApiList) {
					AppApiInfo.appApiDoList(xhr);
					return;
				}

				let vol;
				for (vol of AppApiInfo.appApiList.getElementsByTagName("volume")) {
					if (xhr.data.vid == vol.getAttribute("vid")) {
						break;
					}
				}
				//找不到分卷，停止
				if (!vol) {
					xhr.bookInfo.refreshProgress(xhr.bookInfo,`<span style="color:fuchsia;">app章节目录未找到分卷${xhr.data.vid}，无法生成ePub;</span>`);
					xhr.done = false;
					xhr.bookInfo.XHRFail = true;
					return;
				}
				let chArr = [];
				//添加章节下载，完成失败的分卷下载；pack.php
				for (let ch of vol.children) {
					let cid = ch.getAttribute("cid");
					let cName = ch.textContent;
					//let xhr = { start: false, done: false, url: dlink, loadFun: bInfo.loadVolume, VolumeIndex: VolumeIndex, data: { vid: vid, vcssText: vcssText }, bookInfo: bInfo };
					let dlink = `http://${AppApiInfo.appApiDomain}${AppApiInfo.appApiPath}`;
					let cXhr = { start: false, done: false, url: dlink, loadFun: AppApiInfo.appApiLoadChapter, dealVolume: xhr.dealVolume, VolumeIndex: xhr.VolumeIndex, data: { cName: cName, vid: xhr.data.vid, vcssText: xhr.data.vcssText, Text: xhr.data.Text, isAppApi: true, cid: cid }, bookInfo: xhr.bookInfo };
					cXhr.bookInfo.XHRAdd(cXhr);

					chArr.push({ cid: cid, cName: cName, content :null});
				}
				AppApiInfo.VolumeMap.set(xhr.data.vid, chArr);

				xhr.done = true;
				xhr.bookInfo.buildEpub(xhr.bookInfo);
			},//下载分卷，app接口只能下载章节
			appApiLoadChapter: (xhr) => {
				xhr.start = true;
				let lang = AppApiInfo.appApiLang(xhr.bookInfo);
				let body = `action=book&do=text&aid=${xhr.bookInfo.aid}&cid=${xhr.data.cid}&t=${lang}`;
				body = AppApiInfo.appApiGetEncrypted(body);
				let msg = `${xhr.data.cName} 下载失败，重新下载;`;
				GM_xmlhttpRequest({
					method: 'POST',
					url: xhr.url,
					headers: {
						"content-type": "application/x-www-form-urlencoded;charset=utf-8",
						"User-Agent": AppApiInfo.appApiUA
					},
					data: body,
					onload: function (response) {
						if (response.status == 200) {
							let rspRaw = response.responseText;
							let chArr = AppApiInfo.VolumeMap.get(xhr.data.vid);
							let ch = chArr.find(f => f.cid == xhr.data.cid);
							ch.content = rspRaw;

							xhr.done = true;

							let vid = xhr.data.vid;
							//分卷的章节都下载完成了
							if (xhr.bookInfo.XHRDone(vid)) {
								let VolumeText = '';
								//处理格式，拼接章节
								for (let c of chArr) {
									if (!c.content) { continue; }
									let cName = c.cName;
									let cid = c.cid;
									//章节名
									c.content = c.content.replace(cName, `<div class="chaptertitle"><a name="${cid}">${cName}</a></div><div class="chaptercontent">`);
									//换行
									c.content = c.content.replace(/\r\n/g, "<br />\r\n");
									//替换插图
									if (-1 < c.content.indexOf('<!--image-->http')) {
										c.content = c.content.replaceAll(/<!--image-->(http[\w:/\.?@#&=%]+)<!--image-->/g, (m, p1) => `<div class="divimage" title="${p1}"></div>`);
									}
									c.content += `</div>`;

									VolumeText += c.content;
								}
								//处理分卷文本
								xhr.dealVolume(xhr, VolumeText);
							}

						} else {
							//重新下载
							xhr.XHRRetryFun(xhr, msg);
						}
					},
					onerror: () => {
						//重新下载
						xhr.XHRRetryFun(xhr, msg);
					}
				});
			},//下载章节，全部完成后拼成分卷格式
		};
		return AppApiInfo.appApiLoadVolume;
	};//用app接口下载分卷、章节
	function LoadVolume() {
		let LoadVolumeInfo = {
			imgDomain:'img.wenku8.com',
			appApiLoadVolume: AppApi(),//调用app接口下载文档
			loadVolume: (xhr) => {
				let navToc = xhr.bookInfo.nav_toc[xhr.VolumeIndex];
				let msg = `${navToc.volumeName} 下载失败，重新下载;`;
				xhr.start = true;
				GM_xmlhttpRequest({
					method: 'GET',
					url: xhr.url,
					onload: function (response) {
						if (response.status == 200) {
							xhr.done = true;
							LoadVolumeInfo.dealVolume(xhr, response.responseText);
						}
						//部分小说会404，用app接口
						else if (404 == response.status) {
							xhr.dealVolume = LoadVolumeInfo.dealVolume;
							LoadVolumeInfo.appApiLoadVolume(xhr);
						}
						else {
							//重新下载
							xhr.XHRRetryFun(xhr, msg);
						}
					},
					onerror: () => {
						//重新下载
						xhr.XHRRetryFun(xhr, msg);
					}
				});
			},//分卷下载
			ImagesFix: "Img",//图片文件、ID前缀
			SpanFix: "Txt",//文字ID前缀
			hasAddDescXHR: false,//简介请求标记，每ePub请求一次
			loadDesc: (xhr) => {
				xhr.start = true;
				let msg = `内容简介下载失败，重新下载;`;
				fetch(xhr.url).then(rsp => {
					if (rsp.ok && rsp.status==200) {
						return rsp.arrayBuffer();
					} else {
						xhr.XHRRetryFun(xhr, msg);
						return;
					}
				}).then(buffer => {
					if (buffer) {

						let decoder = new TextDecoder("gbk");
						let text = decoder.decode(buffer);
						//下载分卷文本，转换为html
						let domParser = new DOMParser();
						let rspHtml = domParser.parseFromString(text, "text/html");
						let descSpanEle = rspHtml.evaluate("//span[@class='hottext' and contains(text(),'内容简介：') ]/following-sibling::span", rspHtml, null, XPathResult.ANY_TYPE, null).iterateNext();
						if (descSpanEle) {
							xhr.bookInfo.description = descSpanEle.innerText;
						}
						xhr.done = true;
						xhr.bookInfo.buildEpub(xhr.bookInfo);
					}
				});
			},//内容简介下载
			loadImg: (xhr) => {
				xhr.start = true;
				let msg = `${xhr.images.idName} 下载失败，重新下载;`;
				GM_xmlhttpRequest({
					method: 'GET',
					url: xhr.url,
					responseType: "arraybuffer",
					onload: function (response) {
						if (response.status == 200) {
							xhr.images.content = response.response;
							if (xhr.images.coverImgChk && (!xhr.bookInfo.Images.find(i => i.coverImg))) {
								xhr.images.Blob = new Blob([xhr.images.content], { type: "image/jpeg" });
								xhr.images.ObjectURL = URL.createObjectURL(xhr.images.Blob);
								let imgEle = new Image();
								imgEle.onload = () => {
									//高比宽大于1就能做封面
									xhr.images.coverImg = (imgEle.naturalHeight / imgEle.naturalWidth > 1);
									xhr.done = true;
									xhr.bookInfo.buildEpub(xhr.bookInfo);
								};
								imgEle.src = xhr.images.ObjectURL;
							}
							else {
								xhr.done = true;
								xhr.bookInfo.buildEpub(xhr.bookInfo);
							}
						} else {
							//重新下载
							xhr.XHRRetryFun(xhr, msg);
						}
					},
					onerror: () => {
						//重新下载
						xhr.XHRRetryFun(xhr, msg);
					}
				});
			},//图片下载
			dealVolume: (xhr, txt) => {
				let chapterIndex = 0;
				let ImagesIndex = 0;
				let TextIndex = 0;
				let Text = xhr.data.Text;
				let navToc = Text.navToc;

				//https://developer.mozilla.org/zh-CN/docs/Web/Guide/Parsing_and_serializing_XML
				//下载分卷文本，转换为html
				let domParser = new DOMParser();
				let rspHtml = domParser.parseFromString(
					`<html>
<head>
	<meta charset="utf-8"/>
	<title>${xhr.data.vcssText}</title>
	<link href="../Styles/default.css" rel="stylesheet" type="text/css"/>
</head>
<body><div class="volumetitle"><h2>${xhr.data.vcssText}</h2></div><br /></body>
</html>`.replaceAll(xmlIllegalCharacters, '')
				, "text/html");
				rspHtml.body.innerHTML += txt;

				//调用简转繁
				if (currentEncoding != targetEncoding) {
					translateBody(rspHtml.body);
				}

				//HTML DOM 中的 HTMLCollection 是即时更新的（live）；当其所包含的文档结构发生改变时，它会自动更新。
				//因此，最好是创建副本（例如，使用 Array.from）后再迭代这个数组以添加、移动或删除 DOM 节点。
				let removeChild = [];
				//处理章节、插图 和 contentdp
				let bodyChildArr = Array.from(rspHtml.body.children);
				for (let i = 0; i < bodyChildArr.length; i++) {
					let child = bodyChildArr[i];
					if ("UL" == child.tagName && "contentdp" == child.id) {
						removeChild.push(child);
					}
					//章节
					else if ("DIV" == child.tagName && "chaptertitle" == child.className) {
						chapterIndex++;
						//章节h3、分卷h2、书名h1（没有做）
						//<div class="chaptertitle"><div id="chapter_1" name="xxx"><h3>第一章</h3></div></div>
						let cTitle = child.innerText;
						if (child.firstChild.hasAttribute("name")) {
							child.firstChild.remove("name");
						}
						//let aName = child.firstChild.getAttribute("name");
						let divEle = document.createElement("div");
						divEle.id = `chapter_${chapterIndex}`;
						//divEle.setAttribute("name", aName);
						divEle.innerHTML = `<h3>${cTitle}</h3>`;
						child.innerHTML = divEle.outerHTML;
						if (navToc) {
							//添加章节导航
							navToc.chapterArr.push({
								chapterName: cTitle
								, chapterID: divEle.id
								, chapterHref: `${navToc.volumeHref}#${divEle.id}`
							});
						}
						//章节名接受拖放
						let txtSpan = rspHtml.createElement("span");
						txtSpan.id = `${LoadVolumeInfo.SpanFix}_${divEle.id}`;
						txtSpan.className = "txtDropEnable";
						txtSpan.setAttribute("ondragover", "return false");
						child.parentElement.insertBefore(txtSpan, child);
						txtSpan.appendChild(child);
					}
					//内容
					else if ("DIV" == child.tagName && "chaptercontent" == child.className) {
						let chapterChildArr = Array.from(child.childNodes);
						for (let j = 0; j < chapterChildArr.length; j++) {
							let contentChild = chapterChildArr[j];
							//文字
							if (Node.TEXT_NODE == contentChild.nodeType && contentChild.textContent != '\n') {
								TextIndex++;
								let txtSpan = rspHtml.createElement("span");
								txtSpan.id = `${LoadVolumeInfo.SpanFix}_${xhr.VolumeIndex}_${TextIndex}`;
								txtSpan.className = "txtDropEnable";
								txtSpan.setAttribute("ondragover", "return false");
								child.insertBefore(txtSpan, contentChild);
								txtSpan.appendChild(contentChild);
							}
							//插图
							else if ("DIV" == contentChild.tagName && "divimage" == contentChild.className) {//插图
								//取得插图下载地址
								let imgASrc = contentChild.getAttribute("title");
								let imgUrl = new URL(imgASrc);
								let imgPath = `Images${imgUrl.pathname}`;
								let imgURL = new URL(imgASrc);
								let pathNameArr = imgURL.pathname.split('/');
								let imgIdName = pathNameArr[pathNameArr.length - 1];
								//在html中加入img标签
								let imgEle = document.createElement("img");
								imgEle.setAttribute("loading", "lazy");
								imgEle.setAttribute("src", `../${imgPath}`);
								contentChild.innerHTML = imgEle.outerHTML;
								//记录图片信息作为epub资源
								ImagesIndex++;
								let ImagesID = `${LoadVolumeInfo.ImagesFix}_${xhr.VolumeIndex}_${ImagesIndex}`;
								let images = { path: `${imgPath}`, content: null, id: ImagesID, idName: imgIdName, TextId: Text.id };
								//封面候补 第一卷的前两张图，高/宽 > 1
								if (0 == xhr.VolumeIndex && 3 > ImagesIndex) {
									images.coverImgChk = true;
								}
								xhr.bookInfo.Images.push(images);
								//添加图片下载xhr请求
								let xhrImg = { start: false, done: false, url: imgASrc, loadFun: LoadVolumeInfo.loadImg, images: images, bookInfo: xhr.bookInfo };

								xhr.bookInfo.XHRAdd(xhrImg);
							}
						}
					}
				}
				removeChild.forEach(c => rspHtml.body.removeChild(c));


				Text.content = rspHtml.body.innerHTML;

				//没有图片则添加书籍缩略图
				if (xhr.bookInfo.Images.length==0)
				{
					let pathArry = location.pathname.replace('novel','image').split('/');
					pathArry.pop();
					let ImagesID = `${pathArry.findLast(e => e)}s`;
					pathArry.push(`${ImagesID}.jpg`);
					let imgASrc = `https://${LoadVolumeInfo.imgDomain}${pathArry.join('/')}`;
					let imgUrl = new URL(imgASrc);
					let imgPath = `Images${imgUrl.pathname}`;

					let images = { path: `${imgPath}`, content: null, id: ImagesID, idName: ImagesID, TextId: "", smallCover:true };
					xhr.bookInfo.Images.push(images);
					//添加图片下载xhr请求
					let xhrImg = { start: false, done: false, url: imgASrc, loadFun: LoadVolumeInfo.loadImg, images: images, bookInfo: xhr.bookInfo };

					xhr.bookInfo.XHRAdd(xhrImg);
				}

				//下载简介
				if(!LoadVolumeInfo.hasAddDescXHR)
				{
					LoadVolumeInfo.hasAddDescXHR = true;
					let xhrDesc = { start: false, done: false, url: `/book/${xhr.bookInfo.aid}.htm`, loadFun: LoadVolumeInfo.loadDesc, bookInfo: xhr.bookInfo };
					xhr.bookInfo.XHRAdd(xhrDesc);
				}

				//生成epub，还有资源未下载则只更新生成进度
				xhr.bookInfo.buildEpub(xhr.bookInfo);
			},
		};
		return LoadVolumeInfo.loadVolume;
	};//下载分卷内容及插图
	function EPubEidter() {
		let EPubEidterInfo = {
			novelTable: null,
			ePubEidterCfg: {
				UID: ePubEidterCfgUID,
				aid: article_id,
				pathname: hrefUrl.pathname,
				ImgLocation: []
			},//插图位置配置
			ePubEidtImgRegExp: [/img/i, /插图/i, /插圖/i, /\.jpg/i, /\.png/i],//推测插图位置的正则
			ePubEidtLink: [],
			ePubEidt: false,
			ePubEidtDone: false,
			ePubEidterHtml: ePubEidterHtml,//编辑器html代码
			ePubEidter: null,
			ePubEidterLastVolumeUL: null,
			ePubEidterInit: (info) => {
				//隐藏目录
				let downloadEleArr = document.querySelectorAll(".DownloadAll");
				for (let f of downloadEleArr) {
					f.style.pointerEvents = "none";
				}
				EPubEidterInfo.novelTable = document.body.getElementsByTagName("table")[0];
				EPubEidterInfo.novelTable.style.display = "none";

				//加载编辑器、样式
				let linkEle = document.createElement("link");
				linkEle.type = "text/css";
				linkEle.rel = "stylesheet";
				linkEle.href = "/themes/wenku8/style.css";
				document.head.appendChild(linkEle);
				EPubEidterInfo.ePubEidtLink.push(linkEle);

				let divEle = document.createElement("div");
				divEle.id = "ePubEidter";
				divEle.style.display = "none";
				linkEle.onload = () => {
					//显示编辑器
					divEle.style.display = "";
				};
				divEle.innerHTML = EPubEidterInfo.ePubEidterHtml;
				EPubEidterInfo.ePubEidter = divEle;

				EPubEidterInfo.novelTable.parentElement.insertBefore(divEle, info.novelTable);
				document.getElementById("EidterBuildBtn").addEventListener("click", EPubEidterInfo.ePubEidterDoneFun(info));
				document.getElementById("EidterImportBtn").addEventListener("click", EPubEidterInfo.ePubEidterImportCfgFun(info));
				document.getElementById("VolumeImg").addEventListener("drop", EPubEidterInfo.ePubEidterImgDelDropFun(info));

				//加载配置内容
				let cfgAreaEle = document.getElementById("CfgArea");
				EPubEidterInfo.ePubEidterCfg.ImgLocation = info.ImgLocation;
				cfgAreaEle.value = JSON.stringify(EPubEidterInfo.ePubEidterCfg, null, "  ");

				//加载分卷列表
				let liEleFirst = null;
				let VolumeULEle = document.getElementById("VolumeUL");
				VolumeULEle.innerHTML = "";
				for (let i = 0; i < info.Text.length; i++) {
					let text = info.Text[i];
					let liEle = document.createElement("li");
					VolumeULEle.appendChild(liEle);
					let aEle = document.createElement("a");
					liEle.appendChild(aEle);
					aEle.href = "javascript:void(0);";
					aEle.id = text.id;
					aEle.innerText = text.volumeName;
					liEle.addEventListener("click", EPubEidterInfo.ePubEidterVolumeULFun(info, text));
					if (!liEleFirst) {
						liEleFirst = liEle;
					}
				}

				//加载第一卷
				if (liEleFirst) {
					liEleFirst.click();
				}
			},//编辑器初始化
			ePubEidterDestroyer: () => {
				EPubEidterInfo.ePubEidter.parentElement.removeChild(EPubEidterInfo.ePubEidter);
				EPubEidterInfo.ePubEidtLink.forEach(f => f.parentElement.removeChild(f));
				EPubEidterInfo.novelTable = document.body.getElementsByTagName("table")[0];
				EPubEidterInfo.novelTable.style.display = "";
				EPubEidterInfo = null;
				let downloadEleArr = document.querySelectorAll(".DownloadAll");
				for (let f of downloadEleArr) {
					f.style.pointerEvents = "auto";
				}
			},//编辑器销毁
			ePubEidterDoneFun: (info) => {
				return (ev) => {
					ev.currentTarget.disabled = true;
					//生成ePub
					info.ePubEidtDone = true;
					info.buildEpub(info);

					//发送配置
					let sendArticleEle = document.getElementById('SendArticle');
					if (sendArticleEle.checked && 0 < info.ImgLocation.length) {
						let cfgObj = Object.assign({}, EPubEidterInfo.ePubEidterCfg);
						//压缩位置
						let imgLocJson = JSON.stringify(info.ImgLocation);
						let zip = new JSZip();
						zip.file(ImgLocationFile, imgLocJson, {
							compression: "DEFLATE",
							compressionOptions: {
								level: 9
							}
						});
						let imgLocBase64 = zip.generate({ type: "base64", mimeType: "application/zip" });
						cfgObj.ImgLocation = null;
						cfgObj.ImgLocationBase64 = imgLocBase64;

						let cfgJson = JSON.stringify(cfgObj);

						let vidSet = new Set();
						let vName = [];
						for (let loc of info.ImgLocation) {
							if (!vidSet.has(loc.vid)) {
								vidSet.add(loc.vid);
								let nToc = info.nav_toc.find(f => loc.vid == f.vid);
								if (nToc) {
									vName.push(nToc.volumeName);
								}
							}
						}

						let pcontent = `包含分卷列表：${vName}
[code]${cfgJson}[/code]`;

						let map = new Map();
						map.set("ptitle", "ePub插图位置");
						map.set("pcontent", pcontent);
						let url = `/modules/article/reviews.php?aid=${info.aid}`;
						//发送配置
						EPubEidterInfo.ePubEidterSend(info, url, map);
					}
					let ePubEditerClose = document.getElementById('ePubEditerClose');
					ev.currentTarget.disabled = false;
					if (ePubEditerClose.checked) {
						EPubEidterInfo.ePubEidterDestroyer();
					}
				};
			},//点击生成ePub事件
			ePubEidterImportCfgFun: (info) => {
				return (ev) => {
					ev.currentTarget.disabled = true;
					let cfgAreaEle = document.getElementById("CfgArea");
					let impCfg;
					try { impCfg = JSON.parse(cfgAreaEle.value); } catch { }
					if (impCfg
						&& impCfg.UID == EPubEidterInfo.ePubEidterCfg.UID
						&& impCfg.aid == EPubEidterInfo.ePubEidterCfg.aid
						&& impCfg.ImgLocation
						&& 0 < impCfg.ImgLocation.length
					) {
						for (let iCfg of impCfg.ImgLocation) {
							if (info.ImgLocation.find(i =>
								i.spanID == iCfg.spanID
								&& i.vid == iCfg.vid
								&& i.imgID == iCfg.imgID)
							) {
								continue;
							}
							else if (!info.Text.find(f => f.vid == iCfg.vid)) {
								continue;
							}
							else {
								info.ImgLocation.push(iCfg);
							}
						}
					}
					EPubEidterInfo.ePubEidterCfg.ImgLocation = info.ImgLocation;
					cfgAreaEle.value = JSON.stringify(EPubEidterInfo.ePubEidterCfg, null, "  ");
					if (EPubEidterInfo.ePubEidterLastVolumeUL) {
						EPubEidterInfo.ePubEidterLastVolumeUL.click();
					}
					ev.currentTarget.disabled = false;
				};
			},//点击导入配置事件
			ePubEidterVolumeULFun: (info, text) => {
				return (ev) => {
					//最后点击的章节列表，导入配置后刷新
					if (EPubEidterInfo.ePubEidterLastVolumeUL) {
						EPubEidterInfo.ePubEidterLastVolumeUL.firstElementChild.style.color = "";
					}
					EPubEidterInfo.ePubEidterLastVolumeUL = ev.currentTarget;
					EPubEidterInfo.ePubEidterLastVolumeUL.firstElementChild.style.color = "fuchsia";

					//加载文本内容
					let VolumeTextEle = document.getElementById("VolumeText");
					VolumeTextEle.style.display = "none";
					VolumeTextEle.innerHTML = text.content;

					//加载图片列表
					let imgEleMap = new Map();
					let VolumeImgEle = document.getElementById("VolumeImg");
					VolumeImgEle.innerHTML = "";
					let volumeImgs = info.Images.filter(i => i.TextId == text.id);
					for (let image of volumeImgs) {
						if (!image.ObjectURL) {
							image.Blob = new Blob([image.content], { type: "image/jpeg" });
							image.ObjectURL = URL.createObjectURL(image.Blob);
						}
						let imgDivEle = document.createElement("div");
						imgDivEle.style.float = "left";
						imgDivEle.style.textAlign = "center";
						imgDivEle.style.height = "155px";
						imgDivEle.style.overflow = "hidden";
						imgDivEle.style.margin = "0 2px";
						VolumeImgEle.appendChild(imgDivEle);
						let imgEle = document.createElement("img");
						imgEle.setAttribute("imgID", image.idName);
						imgEle.setAttribute("loading", "lazy");
						imgEle.src = image.ObjectURL;
						imgEle.height = 127;
						//加载用
						imgEleMap.set(image.idName, imgEle);
						imgDivEle.appendChild(imgEle);
						imgDivEle.appendChild(document.createElement("br"));
						let imgTextEle = new Text(image.id)
						imgDivEle.appendChild(imgTextEle);

						//<div style="float: left; text-align: center; height: 155px; overflow: hidden; margin: 0 2px;">
						//	<img id="Img_160408" src="./160408.jpg" border="0" height="127"><br>
						//</div>
					}

					//推测插图处置
					let ImgULEle = document.getElementById("ImgUL");
					ImgULEle.innerHTML = "";
					//加载已拖放的图片
					let vLocation = info.ImgLocation.filter(i => text.vid == i.vid);
					//拖放处理绑定
					let dropEleArr = document.querySelectorAll(".txtDropEnable");
					for (let dropEle of dropEleArr) {
						dropEle.addEventListener("drop", EPubEidterInfo.ePubEidterImgDropFun(info, text));

						//加载已拖放的图片
						let locArr;
						let dImgEle;
						if (vLocation && (locArr = vLocation.filter(j => j.spanID == dropEle.id))) {
							for (let loc of locArr) {
								if (dImgEle = imgEleMap.get(loc.imgID)) {
									let divimage = document.createElement("div");
									divimage.className = "divimageM";
									divimage.innerHTML = dImgEle.outerHTML;
									dropEle.parentNode.insertBefore(divimage, dropEle);
									//添加拖放开始事件，用于删除拖放的标签
									let dropImg = divimage.firstChild;
									dropImg.id = `${loc.spanID}_${loc.imgID}`;
									dropImg.addEventListener("dragstart", EPubEidterInfo.ePubEidterImgDelStartFun(info, loc));
								}
							}
						}
						//章节名不测试
						if (!dropEle.firstElementChild || "chaptertitle" != dropEle.firstElementChild.className) {
							//匹配插图正则
							for (let reg of EPubEidterInfo.ePubEidtImgRegExp) {
								if (reg.test(dropEle.innerText)) {
									let liEle = document.createElement("li");
									ImgULEle.appendChild(liEle);
									let aEle = document.createElement("a");
									liEle.appendChild(aEle);
									aEle.href = "javascript:void(0);";
									aEle.setAttribute("SpanID", dropEle.id);
									aEle.innerText = dropEle.innerText.replace(/\s/g, '').substring(0, 12);
									liEle.addEventListener("click", EPubEidterInfo.ePubEidterImgULFun(info, dropEle));
									dropEle.style.color = "fuchsia";//fontWeight = "bold";
									break;
								}
							}
						}
					}

					//加载章节列表
					let ChapterULEle = document.getElementById("ChapterUL");
					ChapterULEle.innerHTML = "";
					let toc = info.nav_toc.find(i => i.volumeID == text.id);
					for (let chapter of toc.chapterArr) {

						let liEle = document.createElement("li");
						ChapterULEle.appendChild(liEle);
						let aEle = document.createElement("a");
						liEle.appendChild(aEle);
						aEle.href = "javascript:void(0);";
						aEle.setAttribute("chapterID", chapter.chapterID);
						aEle.innerText = chapter.chapterName;
						liEle.addEventListener("click", EPubEidterInfo.ePubEidterChapterULFun(info, chapter));
					}

					VolumeTextEle.style.display = "";
					//滚动到分卷开始
					VolumeTextEle.scroll({ top: 0 });
					VolumeImgEle.scroll({ top: 0 });
				};
			},//点击分卷事件
			ePubEidterImgDropFun: (info, text) => {
				return (ev) => {
					const data = ev.dataTransfer.getData("text/html");
					let divimage = document.createElement("div");
					divimage.className = "divimageM";
					divimage.innerHTML = data;
					let dropImg = divimage.firstChild;
					let imgLocation = { "vid": text.vid, "spanID": ev.currentTarget.id, "imgID": dropImg.getAttribute("imgID") };

					if (info.ImgLocation.find(i =>
						i.spanID == imgLocation.spanID
						&& i.vid == imgLocation.vid
						&& i.imgID == imgLocation.imgID)
					) {
						alert("此位置已存在相同的图片");
					}
					else {
						ev.currentTarget.parentNode.insertBefore(divimage, ev.currentTarget);
						info.ImgLocation.push(imgLocation);
						//添加拖放开始事件，用于删除拖放的标签
						dropImg.id = `${imgLocation.spanID}_${imgLocation.imgID}`;
						dropImg.addEventListener("dragstart", EPubEidterInfo.ePubEidterImgDelStartFun(info, imgLocation));

						EPubEidterInfo.ePubEidterCfg.ImgLocation = info.ImgLocation;
						let cfgAreaEle = document.getElementById("CfgArea");
						cfgAreaEle.value = JSON.stringify(EPubEidterInfo.ePubEidterCfg, null, "  ");
						//JSON.parse(cfgAreaEle.value);
					}
				}
			},//插图拖放完成事件
			ePubEidterChapterULFun: (info, chapter) => {
				return (ev) => {
					let VolumeTextEle = document.getElementById("VolumeText");
					let target = document.getElementById(chapter.chapterID);
					VolumeTextEle.scroll({
						top: target.offsetTop,
						behavior: 'smooth'
					});
					//(document.getElementById(chapter.chapterID)).scrollIntoView();
				}
			},//点击章节事件
			ePubEidterImgULFun: (info, dropEle) => {
				return (ev) => {
					let VolumeTextEle = document.getElementById("VolumeText");
					VolumeTextEle.scroll({
						top: dropEle.offsetTop - 130,
						behavior: 'smooth'
					});
				}
			},//点击推测插图位置事件
			ePubEidterSend: (info, url, map) => {
				let iframeEle = document.createElement("iframe");
				iframeEle.style.display = 'none';
				document.body.appendChild(iframeEle);
				let iBodyEle = iframeEle.contentWindow.document.body;
				let iDocument = iframeEle.contentWindow.document;

				let formEle = iDocument.createElement("form");
				formEle.acceptCharset = "gbk";
				formEle.method = "POST";
				formEle.action = url;
				iBodyEle.appendChild(formEle);
				for (let [mk, mv] of map) {
					let inputEle = iDocument.createElement("input");
					inputEle.type = "text";
					inputEle.name = mk;
					inputEle.value = mv;
					formEle.appendChild(inputEle);
				}
				let subEle = iDocument.createElement("input");
				subEle.type = "submit";
				subEle.name = "submit";
				subEle.value = "submit";
				formEle.appendChild(subEle);
				subEle.click();
			},//发送Post请求，无需转gbk
			ePubEidterImgDelDropFun: (info) => {
				return (ev) => {
					let vid = ev.dataTransfer.getData("vid");
					let spanID = ev.dataTransfer.getData("spanID");
					let imgID = ev.dataTransfer.getData("imgID");
					let fromID = ev.dataTransfer.getData("fromID");
					let fromEle = document.getElementById(fromID);
					if (fromEle && "divimageM" == fromEle.parentElement.className) {
						info.ImgLocation =
							info.ImgLocation.filter(i => !(i.spanID == spanID && i.vid == vid && i.imgID == imgID));

						EPubEidterInfo.ePubEidterCfg.ImgLocation = info.ImgLocation;
						let cfgAreaEle = document.getElementById("CfgArea");
						cfgAreaEle.value = JSON.stringify(EPubEidterInfo.ePubEidterCfg, null, "  ");

						fromEle.parentElement.parentElement.removeChild(fromEle.parentElement);
					}
				}
			},//插图拖放完成事件
			ePubEidterImgDelStartFun: (info, imgLocation) => {
				return (ev) => {
					ev.dataTransfer.setData("vid", imgLocation.vid);
					ev.dataTransfer.setData("spanID", imgLocation.spanID);
					ev.dataTransfer.setData("imgID", imgLocation.imgID);
					ev.dataTransfer.setData("fromID", ev.srcElement.id);
				}
			},//插图拖放开始事件
		};
		return [EPubEidterInfo.ePubEidterInit, EPubEidterInfo.ePubEidterCfg];
	};//epub编辑器，拖动调整插图位置
	function XHRDownloader() {
		let XHRDownloaderInfo = {

			XHRLimitArr: [],//需要限速请求的XHR数组
			XHRDelay: 60 * 1000 / 100,//限制每60秒100个请求
			XHRIntervalID: null,//限速请求发送计时器
			XHRLoad: (xhr) => {
				if (xhr.url.endsWith(`/android.php`)) {
					if (null === XHRDownloaderInfo.XHRIntervalID) {
						XHRDownloaderInfo.XHRIntervalID = setInterval(XHRDownloaderInfo.XHRLimitLoad, XHRDownloaderInfo.XHRDelay);
					}
					XHRDownloaderInfo.XHRLimitArr.push(xhr);
				} else {
					xhr.loadFun(xhr);
				}
			},//指定请求不能立即发送，需要限速
			XHRLimitLoad: () => {
				let xhr = XHRDownloaderInfo.XHRLimitArr.shift();
				if (xhr) {
					xhr.loadFun(xhr);
				}
			},//定时发送限速请求

			XHRFail: false,//下载失败，不生成ePub
			XHRRetry: 3,//xhr重试次数
			XHRRetryFun: (xhr, msg) => {
				//下载失败，不重试，不会生成ePub
				if (XHRDownloaderInfo.XHRFail) { return; }
				if (
					(!xhr.XHRRetryCount)
					|| 0 == XHRDownloaderInfo.XHRRetry
					|| xhr.XHRRetryCount < XHRDownloaderInfo.XHRRetry
				) {
					xhr.XHRRetryCount = (xhr.XHRRetryCount ?? 0) + 1;
					//xhr.loadFun(xhr);
					XHRDownloaderInfo.XHRLoad(xhr);
					xhr.bookInfo.refreshProgress(xhr.bookInfo,msg);
				}
				else {
					XHRDownloaderInfo.XHRFail = true;
					xhr.bookInfo.refreshProgress(xhr.bookInfo, `<span style="color:fuchsia;">超出最大重试次数,下载失败，无法生成ePub;</span>`);
				}
			},//xhr重试
			XHRArr: [],//下载请求；[{start:false,done:false,url:,loadFun:,data:,bookInfo:bInfo}]
			XHRAdd: (xhr) => {
				xhr.XHRRetryFun = xhr.XHRRetryFun ?? XHRDownloaderInfo.XHRRetryFun;
				XHRDownloaderInfo.XHRArr.push(xhr);
				//xhr.loadFun(xhr);
				XHRDownloaderInfo.XHRLoad(xhr);
			},
			XHRDone: (vid) => {
				let arr = XHRDownloaderInfo.XHRArr;
				//如果所有的下载都完成了，清除限速计时器
				if (arr.every(e => e.done)) {
					clearInterval(XHRDownloaderInfo.XHRIntervalID);
				}

				if (vid) {
					arr = arr.filter(f => f.data && f.data.vid && vid == f.data.vid);
				}
				return arr.every(e => e.done);
			},
		};
		return [XHRDownloaderInfo.XHRAdd, XHRDownloaderInfo.XHRDone ];
	};//XHR下载、重试
	function Builder() {
		let BuilderInfo = {
			mimetype: 'application/epub+zip',//epub mimetype 文件内容
			container_xml: container_xml,//epub container.xml 文件内容
			nav_xhtml: {
				content: nav_xhtml_content
				, path: `Text/nav.xhtml`
				, id: `nav_xhtml_id`
			},//epub nav.xhtml 文件模板
			defaultCSS: {
				content: defaultCSS_content
				, id: "default_css_id"
				, path: "Styles/default.css"
			},//epub default.css 样式文件
			contentDocument: null,
			manifest: null,
			spine: null,
			manifestItemAdd: (id, href, mediaType) => {
				let doc = BuilderInfo.contentDocument
				let manifest = BuilderInfo.manifest;
				if (!manifest) {
					manifest = doc.createElement("manifest");
					doc.firstChild.appendChild(manifest);
					BuilderInfo.manifest = manifest;
				}
				let item = doc.createElement("item");
				if ('undefined' != typeof (id)) {
					item.setAttribute("id", id);
				}
				if ('undefined' != typeof (href)) {
					item.setAttribute("href", href);
				}
				if ('undefined' != typeof (mediaType)) {
					item.setAttribute("media-type", mediaType);
				}
				manifest.appendChild(item);
				return item;
			},
			spineItemAdd: (idref) => {
				let doc = BuilderInfo.contentDocument
				let spine = BuilderInfo.spine;
				if (!spine) {
					spine = doc.createElement("spine");
					doc.firstChild.appendChild(spine);
					BuilderInfo.spine = spine;
				}

				let itemref = doc.createElement("itemref");
				if ('undefined' != typeof (idref)) {
					itemref.setAttribute("idref", idref);
				}
				spine.appendChild(itemref);
				return itemref;
			},
			manifestSpineItemAdd: (id, href, mediaType) => {
				let item = BuilderInfo.manifestItemAdd(id, href, mediaType);
				let itemref = BuilderInfo.spineItemAdd(id);

				return [item, itemref];
			},
			buildEpub: (info) => {
				if (info.XHRDone()) {
					if (info.ePubEidt && (!info.ePubEidtDone)) {
						info.refreshProgress(info,`开始编辑ePub;`);
						info.ePubEidterInit(info);
						return;
					}

					info.refreshProgress(info, `开始生成ePub;`);
					let zip = new JSZip();
					//epub固定内容
					zip.file("mimetype", BuilderInfo.mimetype);
					zip.file("META-INF/container.xml", BuilderInfo.container_xml);

					let content_opf = `<?xml version="1.0" encoding="utf-8"?><package></package>`;
					let paraser = new DOMParser()
					BuilderInfo.contentDocument = paraser.parseFromString(content_opf,'text/xml')

					//保存插图位置
					if (info.ePubEidterCfg && info.ePubEidterCfg.ImgLocation && 0 < info.ePubEidterCfg.ImgLocation.length) {
						let cfgJson = JSON.stringify(info.ePubEidterCfg, null, "  ");
						zip.file("OEBPS/Other/ePubEidterCfg.json", cfgJson);
					}

					//保存css
					{
						BuilderInfo.manifestItemAdd(BuilderInfo.defaultCSS.id, BuilderInfo.defaultCSS.path, "text/css");
						//保存css
						zip.file(`OEBPS/${BuilderInfo.defaultCSS.path}`, BuilderInfo.defaultCSS.content);
					}

					//生成并保存nav.xhtml
					//<ol><li><a href="Volume_0.xhtml">第一卷</a><ol><li><a href="Volume_0.xhtml#chapter_1">第一章</a></li></ol></li></ol>
					{
						//生成nav.xhtml
						let domParser = new DOMParser();
						let navXhtmlDoc = domParser.parseFromString(BuilderInfo.nav_xhtml.content.replaceAll(xmlIllegalCharacters, ''), "application/xhtml+xml");
						let tocEle = navXhtmlDoc.getElementById("toc");
						let bOlEle = navXhtmlDoc.createElement("ol");
						for (let t of info.nav_toc) {
							//分卷
							let vAEle = navXhtmlDoc.createElement("a");
							vAEle.href = t.volumeHref;
							vAEle.innerText = t.volumeName;
							let vLiEle = navXhtmlDoc.createElement("li");
							vLiEle.appendChild(vAEle);
							if (t.chapterArr && 0 < t.chapterArr.length) {
								//分卷的章节
								let vOlEle = navXhtmlDoc.createElement("ol");
								for (let c of t.chapterArr) {
									let cAEle = navXhtmlDoc.createElement("a");
									cAEle.href = c.chapterHref;
									cAEle.innerText = c.chapterName;
									let cLiEle = navXhtmlDoc.createElement("li");
									cLiEle.appendChild(cAEle);
									vOlEle.appendChild(cLiEle);
								}
								vLiEle.appendChild(vOlEle);
							}
							bOlEle.appendChild(vLiEle);
						}
						tocEle.appendChild(bOlEle);
						let nav_xhtml = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>

${navXhtmlDoc.firstChild.outerHTML}`;

						//保存nav.xhtml信息到content.opf
						//manifest节点

						let [item, itemref] = BuilderInfo.manifestSpineItemAdd(
							BuilderInfo.nav_xhtml.id, BuilderInfo.nav_xhtml.path, "application/xhtml+xml"
						);
						item.setAttribute("properties", "nav");
						itemref.setAttribute("linear", "no");
						//保存nav.xhtml
						zip.file(`OEBPS/${BuilderInfo.nav_xhtml.path}`, nav_xhtml);
					}

					//保存分卷内容
					for (let t of info.Text) {
						BuilderInfo.manifestSpineItemAdd(t.id, t.path, "application/xhtml+xml");

						//转换html为xhtml
						let domParser = new DOMParser();
						let rspHtml = domParser.parseFromString(
							`<html>
<head>
	<meta charset="utf-8"/>
	<title>${t.volumeName}</title>
	<link href="../Styles/default.css" rel="stylesheet" type="text/css"/>
</head>
<body></body>
</html>`.replaceAll(xmlIllegalCharacters, '')
							, "text/html");
						rspHtml.body.innerHTML = t.content;

						//添加插图并去除拖放标签
						let vLocation = info.ImgLocation.filter(i => t.vid == i.vid);
						let volumeImgs = info.Images.filter(i => i.TextId == t.id);
						let dropEleArr = rspHtml.querySelectorAll(".txtDropEnable");
						for (let dropEle of dropEleArr) {
							//加载已拖放的图片
							let locArr;
							let dImg;
							if (vLocation
								&& (locArr = vLocation.filter(j => j.spanID == dropEle.id))
							) {
								for (let loc of locArr) {
									if (dImg = volumeImgs.find(j => j.idName == loc.imgID)) {
										let divimage = rspHtml.createElement("div");
										divimage.className = "divimage";

										let imgEle = rspHtml.createElement("img");
										imgEle.setAttribute("loading", "lazy");
										imgEle.setAttribute("src", `../${dImg.path}`);
										divimage.innerHTML = imgEle.outerHTML;

										dropEle.parentNode.insertBefore(divimage, dropEle);

									}
								}
							}
							//去除文字span
							dropEle.parentNode.insertBefore(dropEle.firstChild, dropEle);
							dropEle.parentNode.removeChild(dropEle);
						}

						//转换html为xhtml
						let xmlSerializer = new XMLSerializer();
						let rspXml = xmlSerializer.serializeToString(rspHtml);
						let rspXHtml = domParser.parseFromString(rspXml.replaceAll(xmlIllegalCharacters, ''), "application/xhtml+xml");
						rspXHtml.firstChild.setAttribute("xmlns:epub", "http://www.idpf.org/2007/ops");
						//保存章节内容，作为epub资源
						let tContent = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>

${rspXHtml.firstChild.outerHTML}`;

						zip.file(`OEBPS/${t.path}`, tContent);
					}
					//保存图片
					for (let t of info.Images) {
						//media-type暂固定jpeg
						BuilderInfo.manifestItemAdd(t.id, t.path, "image/jpeg");
						zip.file(`OEBPS/${t.path}`, t.content, { binary: true });
					}

					//生成书籍信息
					let coverMeta = '';
					if (info.Images.length > 0) {
						let coverImg = info.Images.find(i => i.coverImg);
						if (!coverImg) {
							coverImg = info.Images.find(i => i.coverImgChk);
						}
						if (!coverImg) {
							coverImg = info.Images.find(i => i.smallCover);
						}
						if (coverImg) {
							coverMeta = `<meta name="cover" content="${coverImg.id}" />`;
						}
					}

					let uuid = self.crypto.randomUUID();
					//CCYY-MM-DDThh:mm:ssZ
					let createTime = new Date().toISOString();
					createTime = `${createTime.split(".")[0]}Z`;
					//<?xml version="1.0" encoding="utf-8"?>
					content_opf = `<?xml version="1.0" encoding="utf-8"?>
<package version="3.0" unique-identifier="BookId" xmlns="http://www.idpf.org/2007/opf">
	<metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
		<dc:language>zh-CN</dc:language>
		<dc:title>${info.title}</dc:title>
		<meta property="dcterms:modified">${createTime}</meta>
		<dc:identifier id="BookId">urn:uuid:${uuid}</dc:identifier>
		<dc:creator>${info.creator}</dc:creator>
		<dc:description>${info.description}</dc:description>
		<!--第一张插图做封面-->
		${coverMeta}
	</metadata>
	${BuilderInfo.manifest.outerHTML}
	${BuilderInfo.spine.outerHTML}
</package>`;
					zip.file("OEBPS/content.opf", content_opf);
					//书名.开始卷-结束卷.epub
					let epubName = `${info.title}.${info.nav_toc[0].volumeName}`;
					if (1 < info.nav_toc.length) {
						epubName = epubName + '-' + info.nav_toc[info.nav_toc.length - 1].volumeName;
					}
					saveAs(zip.generate({ type: "blob", mimeType: "application/epub+zip" }), `${epubName}.epub`);
					info.refreshProgress(info, `ePub生成完成,文件名：${epubName}.epub；`);
				}
				else {
					info.refreshProgress(info);
				}
			},//生成epub，如果XHRArr已经都完成了
		};
		return BuilderInfo.buildEpub;
	};//epub生成
	function RefreshLog() {
		let LogInfo = {
			progressEle: null,//进度、日志 元素；{txt:,img:,err:}
			refreshProgress: (info,err) => {
				if (!LogInfo.progressEle) {
					//epub生成进度，下载文本进度：7/7；下载图片进度：77/77；日志：开始生成ePub;ePub生成完成;
					LogInfo.progressEle = {};
					LogInfo.progressEle.txt = document.createElement("span");
					LogInfo.progressEle.img = document.createElement("span");
					LogInfo.progressEle.err = document.createElement("span");
					let logDiv = document.createElement('div');
					logDiv.appendChild(document.createTextNode("epub生成进度，下载文本进度："));
					logDiv.appendChild(LogInfo.progressEle.txt);
					logDiv.appendChild(document.createTextNode("；下载图片进度："));
					logDiv.appendChild(LogInfo.progressEle.img);
					logDiv.appendChild(document.createTextNode("；日志："));
					logDiv.appendChild(LogInfo.progressEle.err);
					document.body.insertBefore(logDiv, document.getElementById('title'));
				}
				//日志
				if (err) { LogInfo.progressEle.err.innerHTML = err + LogInfo.progressEle.err.innerHTML; }
				//文本进度
				let txtProgress = info.Text.filter((value) => { return value.content; }).length;
				LogInfo.progressEle.txt.innerText = `${txtProgress}/${info.Text.length}`;
				//图片进度，文本下载完成后才能得到图片总数
				if (txtProgress == info.Text.length) {
					let imgProgress = info.Images.filter((value) => { return value.content; }).length;
					LogInfo.progressEle.img.innerText = `${imgProgress}/${info.Images.length}`;
				}
			},//显示进度日志
		};
		return LogInfo.refreshProgress;
	};
	function EpubBuilder() {
		let bInfo = {
			XHRAdd: null,
			XHRDone: null,
			ePubEidterInit: null,
			ePubEidterCfg: null,
			buildEpub: Builder(),
			loadVolume: LoadVolume(),//下载章节方法
			refreshProgress: RefreshLog(),
			start: (e) => {
				[bInfo.XHRAdd, bInfo.XHRDone] = XHRDownloader();
				let ePubEidt = e.target.getAttribute("ePubEidt");
				if (ePubEidt && "true" == ePubEidt) {
					bInfo.ePubEidt = true;
					[bInfo.ePubEidterInit, bInfo.ePubEidterCfg] = EPubEidter();
				}

				//全本分卷
				let vcssEle = null;
				let DownloadAll = e.target.getAttribute("DownloadAll");
				if (DownloadAll && "true" == DownloadAll) {
					//全本下载
					vcssEle = document.querySelectorAll(".vcss");
				}
				else {
					vcssEle = [e.target.parentElement];
				}
				for (let VolumeIndex = 0; VolumeIndex < vcssEle.length; VolumeIndex++) {

					let vcss = vcssEle[VolumeIndex];
					//分卷ID
					let vid = vcss.getAttribute("vid");
					//pack.php下载整卷，每个章节不带卷名，用分卷的第一个章节做分卷vid
					let vid1 = vcss.parentElement.nextElementSibling.getElementsByTagName('a')[0].getAttribute('href').split('.')[0];
					//let vid = vcss.getAttribute("vid");
					let vcssText = vcss.childNodes[0].textContent;
					let navToc = bInfo.nav_toc[VolumeIndex] = {
						volumeName: vcssText
						, vid: vid
						, volumeID: `${bInfo.VolumeFix}_${VolumeIndex}`
						, volumeHref: `${bInfo.VolumeFix}_${VolumeIndex}.xhtml`
						, chapterArr: []
					};
					let Text = {
						path: `Text/${navToc.volumeHref}`
						, content: ""
						, id: navToc.volumeID
						, vid: vid
						, volumeName: vcssText
					};
					Text.navToc = navToc;
					bInfo.Text[VolumeIndex] = Text;
					//分卷下载链接
					let dlink = `https://${bInfo.dlDomain}/pack.php?aid=${bInfo.aid}&vid=${vid1}`;
					let xhr = { start: false, done: false, url: dlink, loadFun: bInfo.loadVolume, VolumeIndex: VolumeIndex, data: { vid: vid, vcssText: vcssText, Text: Text }, bookInfo: bInfo };
					bInfo.XHRAdd(xhr);
				}

				//加载从评论读取的配置
				if (bInfo.ImgLocationCfgRef && 0 < bInfo.ImgLocationCfgRef.length) {
					for (let cfgRef of bInfo.ImgLocationCfgRef) {
						if (ePubEidterCfgUID == cfgRef.UID
							&& bInfo.aid == cfgRef.aid
							&& cfgRef.ImgLocation
							&& 0 < cfgRef.ImgLocation.length
						) {
							for (let loc of cfgRef.ImgLocation) {
								//插图位置记录{vid:,spanID:,imgID:}
								if (loc.vid && loc.spanID && loc.imgID
									&& bInfo.Text.find(f => f.vid == loc.vid)
								) {
									if (!bInfo.ImgLocation.find(f =>
										f.vid == loc.vid
										&& f.spanID == loc.spanID
										&& f.imgID == loc.imgID
									)) {
										bInfo.ImgLocation.push(loc);
									}
								}
							}
						}
					}
				}
				if (bInfo.ePubEidterCfg && bInfo.ImgLocation && 0 < bInfo.ImgLocation.length) {
					bInfo.ePubEidterCfg.ImgLocation = bInfo.ImgLocation;
				}

				bInfo.buildEpub(bInfo);
			},//入口，开始下载文件并生成epub；

			nav_toc: [],//导航菜单,第一层分卷，第二层章节{volumeName：,volumeID:,volumeHref:,chapterArr:[{chapterName:,chapterID:,chapterHref:}]}
			Text: [],//下载后生成的XHTML；{path:`Text/${volumeHref}`,content:}
			Images: [],//下载的图片；{path:`Images/${url.pathname}`,content:}

			VolumeFix: "Volume",//分卷文件、ID前缀
			dlDomain: "dl.wenku8.com",
			ImgLocationCfgRef: ImgLocationCfgRef,//读取到的配置
			ImgLocation: [],//插图位置记录{vid:,spanID:,imgID:}
			targetEncoding: targetEncoding,// 1: 繁體中文, 2: 简体中文
			aid: article_id,//本书编号 article_id
			title: document.getElementById("title").childNodes[0].textContent, //标题
			creator: document.getElementById('info').innerText,//作者
			description: "",//内容简介
			bookUrl: self.location.href,

		};
		return bInfo;
	};//epub生成;使用addEventListener绑定start；

    //目录或内容页面会声明章节变量。
    if ('undefined' == typeof chapter_id || undefined === chapter_id) { }
    else {
        //本书编号 article_id
        //目录页面章节id定义为 '0'
		if ('0' == chapter_id) {//在章节名之后添加下载链接
			//书名
			let titleEle = document.querySelector("#title");
			let aname = titleEle.innerText;
			//targetEncoding 1: 繁體中文, 2: 简体中文
			let charsetDL = 'utf-8';
			let charsetDLAll = 'utf8';
			if ('1' == targetEncoding) {
				charsetDL = 'big5';
				charsetDLAll = 'big5';
			}

			//添加全本下载链接
			{
				let DLink = `https://dl.wenku8.com/down.php?type=${charsetDLAll}&id=${article_id}&fname=${aname}`;
				let aEle = document.createElement("a");
				aEle.href = DLink;
				aEle.innerText = ` 全本文本下载(${charsetDLAll})`;
				titleEle.appendChild(aEle);

				//添加 ePub下载(全本)
				let aEleEpub = document.createElement("a");
				aEleEpub.className = "DownloadAll";
				aEleEpub.setAttribute("DownloadAll", "true");
				aEleEpub.innerText = " ePub下载(全本)";
				aEleEpub.href = "javascript:void(0);";
				titleEle.append(aEleEpub);
				aEleEpub.addEventListener("click", (e) => EpubBuilder().start(e));

				let allaEpubEleEdt = document.createElement("a");
				allaEpubEleEdt.className = "DownloadAll";
				allaEpubEleEdt.setAttribute("ePubEidt", "true");
				allaEpubEleEdt.setAttribute("DownloadAll", "true");
				allaEpubEleEdt.innerText = " (调整插图)";
				allaEpubEleEdt.href = "javascript:void(0);";
				titleEle.append(allaEpubEleEdt);
				allaEpubEleEdt.addEventListener("click", (e) => EpubBuilder().start(e));
			}

			//添加分卷下载链接
			let vcssArry = document.querySelectorAll(".vcss");
			for (let vcss of vcssArry)
			{
				let vname = vcss.innerText;
				let vid = vcss.getAttribute("vid");
				
				let dlink = `https://dl.wenku8.com/packtxt.php?aid=${article_id}&vid=${vid}&aname=${aname}&vname=${vname}&charset=${charsetDL}`;
				let aEle = document.createElement("a");
				aEle.href = dlink;
				aEle.innerText = `  文本下载(${charsetDL})`;
				vcss.appendChild(aEle);

				//添加 ePub下载(分卷)
				let aEleEpub = document.createElement("a");
				aEleEpub.href = "javascript:void(0);";
				aEleEpub.innerText = " ePub下载(本卷)";
				vcss.append(aEleEpub);
				aEleEpub.addEventListener("click", (e) => EpubBuilder().start(e));

				let aEleEpubEdt = document.createElement("a");
				aEleEpubEdt.href = "javascript:void(0);";
				aEleEpubEdt.innerText = " (调整插图)";
				aEleEpubEdt.setAttribute("ePubEidt", "true");
				vcss.append(aEleEpubEdt);
				aEleEpubEdt.addEventListener("click", (e) => EpubBuilder().start(e));
			}
		}
		else {
			//如果第一个子元素为 内容是'null'的span则判定为版权限制
			let contentMain = document.querySelector('#contentmain');
			if ("SPAN" == contentMain.firstElementChild.tagName
				&& contentMain.firstElementChild.innerText.trim() == 'null') {
				let content = document.getElementById("content");
				let appApi = {
					appApiDomain: "app.wenku8.com",//app接口域名
					appApiPath: "/android.php",//app接口路径
					appApiUA: "Android",//app接口似乎添加了UA检测，使用浏览器UA响应异常
					targetEncoding: targetEncoding,
					appApiLangDis: true,//禁用app接口请求繁体内容。由页面自行转换。
					appApiLang: () => {
						if (appApi.appApiLangDis) {
							return "0";
						}
						//0 simplified Chinese;1 traditional Chinese
						let rst = "0";
						if ("1" == appApi.targetEncoding) {
							rst = "1";
						}
						else if ("2" == appApi.targetEncoding) {
							rst = "0";
						}
						return rst;
					},//语言选择
					appApiGetEncrypted: (body) => {
						return `appver=1.0&timetoken=${Number(new Date())}&request=${btoa(body)}`;
					},//编码请求内容
					appApiLoadChapter: (xhr) => {
						xhr.start = true;
						let lang = appApi.appApiLang(xhr.bookInfo);
						let body = `action=book&do=text&aid=${xhr.bookInfo.aid}&cid=${xhr.data.cid}&t=${lang}`;
						body = appApi.appApiGetEncrypted(body);
						let msg = `${xhr.data.cName} 下载失败，重新下载;`;
						GM_xmlhttpRequest({
							method: 'POST',
							url: xhr.url,
							headers: {
								"content-type": "application/x-www-form-urlencoded;charset=utf-8",
								"User-Agent": appApi.appApiUA
							},
							data: body,
							onload: function (response) {
								if (response.status == 200) {
									let rspRaw = response.responseText;
									rspRaw = rspRaw.replace(/ {2}\S+.*/, "");
									//换行
									rspRaw = rspRaw.replace(/\r\n/g, "<br />\r\n");
									//替换插图
									if (-1 < rspRaw.indexOf('<!--image-->http')) {
										rspRaw = rspRaw.replaceAll(/<!--image-->(http[\w:/\.?@#&=%]+)<!--image-->/g, (m, p1) => `<div class="divimage"><a href="${p1}" target="_blank"><img src="${p1}" border="0" class="imagecontent"></a></div>`);
									}
									rspRaw += `</div>`;
									content.innerHTML = rspRaw;
									appApi.translateBody(content);
									xhr.done = true;
								} else {
									//重新下载
									xhr.XHRRetryFun(xhr, msg);
								}
							},
							onerror: () => {
								//重新下载
								xhr.XHRRetryFun(xhr, msg);
							}
						});
					},//下载章节，全部完成后拼成分卷格式
					XHRAdd: null,
					refreshProgress: (info, err) => {
						if (err) { content.innerHTML = err + content.innerHTML; }
					},
					translateBody: translateBody,
				};
				let bookInfo = { aid: article_id, refreshProgress: appApi.refreshProgress };
				[bookInfo.XHRAdd] = XHRDownloader();
				let dlink = `http://${appApi.appApiDomain}${appApi.appApiPath}`;
				let xhr = { start: false, done: false, url: dlink, loadFun: appApi.appApiLoadChapter, data: { cid: chapter_id }, bookInfo: bookInfo };
				xhr.bookInfo.XHRAdd(xhr);
				content.innerHTML = '正在下载，请稍候...';
			}
		}
    }

	//评论页面
	let articleReg = /\/modules\/article\//;
	if (articleReg.test(window.location.href)) {
		let rid = hrefUrl.searchParams.get('rid');
		let page = hrefUrl.searchParams.get('page');
		let codeEleArr = document.querySelectorAll(".jieqiCode");
		let yidSet = new Set();
		for (let code of codeEleArr) {
			let yidDivEle = code.parentElement.parentElement;
			let yid;
			for (let aEle of yidDivEle.getElementsByTagName('a')) {
				yid = aEle.getAttribute("name");
				if (yid) { break; }
			}
			if (rid && yid) {
				let codeJson = code.innerText.replace(/\s/g,'');
				let locCfg 
				try {
					locCfg = JSON.parse(codeJson);
				}
				catch (e) {
					console.log(e);
					continue;
				}
				if (locCfg
					&& ePubEidterCfgUID == locCfg.UID
					&& locCfg.aid
					&& locCfg.pathname
					&& (locCfg.ImgLocationBase64 ||(locCfg.ImgLocation && 0 < locCfg.ImgLocation.length))
					&& (!yidSet.has(yid))
				) {
					yidSet.add(yid);
					let titleDivEle = yidDivEle.firstElementChild;
					let epubRefEle = document.createElement('a');
					epubRefEle.innerText = '[使用配置生成ePub]';
					epubRefEle.style.color = "fuchsia";
					epubRefEle.href = `${locCfg.pathname}?rid=${rid}&page=${page ? page : "1"}&yid=${yid}&CfgRef=1`;
					titleDivEle.insertBefore(epubRefEle, titleDivEle.firstElementChild);
				}
			}
		}
	}

	//读取到的配置
	let ImgLocationCfgRef = [];
	///modules/article/reviewshow.php?rid=270583
	if ("1" == hrefUrl.searchParams.get('CfgRef')) {
		const ridCfg = hrefUrl.searchParams.get('rid');
		const pageCfg = hrefUrl.searchParams.get('page');
		const yidCfg = hrefUrl.searchParams.get('yid');
		if (ridCfg && yidCfg) {
			let articleUrl = `${hrefUrl.origin}/modules/article/reviewshow.php?rid=${ridCfg}&page=${pageCfg}`;
			GM_xmlhttpRequest({
				method: 'GET',
				url: articleUrl,
				onload: function (response) {
					if (response.status == 200) {
						let domParser = new DOMParser();
						let rspHtml = domParser.parseFromString(response.responseText.replaceAll(xmlIllegalCharacters, ''), "text/html");
						let codeEleArr = rspHtml.querySelectorAll(".jieqiCode");
						for (let code of codeEleArr) {
							let yidDivEle = code.parentElement.parentElement;
							let yid;
							for (let aEle of yidDivEle.getElementsByTagName('a')) {
								yid = aEle.getAttribute("name");
								if (yid) { break; }
							}
							if (yid && yidCfg == yid) {
								let codeJson = code.innerText.replace(/\s/g, '');
								let locCfg
								try {
									locCfg = JSON.parse(codeJson);
								}
								catch (e) {
									console.log(e);
									continue;
								}
								//解压
								if (locCfg.ImgLocationBase64) {
									let zip = new JSZip();
									let textDec = new TextDecoder();
									zip.load(locCfg.ImgLocationBase64, { base64: true });
									let fileArry = zip.file(ImgLocationFile)._data.getContent();
									let imgLocJson = textDec.decode(fileArry);
									let ImgLocation = JSON.parse(imgLocJson);
									locCfg.ImgLocation = ImgLocation;
								}
								if (locCfg
									&& ePubEidterCfgUID == locCfg.UID
									&& locCfg.aid
									&& locCfg.pathname
									&& locCfg.ImgLocation
									&& 0 < locCfg.ImgLocation.length
								) {
									ImgLocationCfgRef.push(locCfg);
								}
							}
						}
					}
					else {
						console.log(articleUrl);
						console.log("配置下载失败");
					}
				},
				onerror: () => {
					console.log(articleUrl);
					console.log("配置下载失败");
				}
			});
		}
	}

	const defaultCSS_content = `
nav#landmarks {
    display:none;
}

nav#page-list {
    display:none;
}

ol {
    list-style-type: none;
}

.volumetitle ,
.chaptertitle {
    text-align: center;
}

`;
	const nav_xhtml_content = `
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en" xml:lang="en">
<head>
	<title>ePub NAV</title>
	<meta charset="utf-8"/>
	<link href="../Styles/default.css" rel="stylesheet" type="text/css"/>
</head>
<body epub:type="frontmatter">
	<nav epub:type="toc" id="toc" role="doc-toc">
		<h2><a href= "#toc">目录</a></h2>
	</nav>
</body>
</html>`;
	const container_xml = `<?xml version="1.0" ?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
<rootfiles>
	<rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml" />
</rootfiles>
</container>`;
	const ePubEidterHtml = `
<div class="main" style="width: 1200px;">
	<!--左 章节-->
	<div id="left">
		<div class="block" style="min-height: 230px;">
			<div class="blocktitle">
				<span class="txt">操作设置</span>
				<span class="txtr"></span>
			</div>
			<div class="blockcontent">
				<div style="padding-left:10px">
					<ul class="ulrow">
						<li>
							<label for="SendArticle">将配置发送到书评：</label>
							<input type="checkbox" id="SendArticle" />
						</li>
						<li>
							<label for="ePubEditerClose">生成后自动关闭：</label>
							<input type="checkbox" id="ePubEditerClose" checked="true" />
						</li>
						<li>配置内容：</li>
						<li>
							<textarea id="CfgArea" class="textarea"></textarea>
						</li>
						<li><input type="button" id="EidterImportBtn" class="button" value="导入配置" /></li>
						<li><input type="button" id="EidterBuildBtn" class="button" value="生成ePub" /></li>
					</ul>
					<div class="cb"></div>
				</div>
			</div>
		</div>
		<div class="block" style="min-height: 230px;">
			<div class="blocktitle">
				<span class="txt">分卷</span>
				<span class="txtr"></span>
			</div>
			<div class="blockcontent">
				<div style="padding-left:10px">
					<ul id="VolumeUL" class="ulrow">

					</ul>
					<div class="cb"></div>
				</div>
			</div>
		</div>
	</div>
	<!--左 章节-->
	<div id="left">
		<div class="block" style="min-height: 230px;">
			<div class="blocktitle">
				<span class="txt">推测插图位置</span>
				<span class="txtr"></span>
			</div>
			<div class="blockcontent">
				<div style="padding-left:10px">
					<ul id="ImgUL" class="ulrow">

					</ul>
					<div class="cb"></div>
				</div>
			</div>
		</div>
		<div class="block" style="min-height: 230px;">
			<div class="blocktitle">
				<span class="txt">章节</span>
				<span class="txtr"></span>
			</div>
			<div class="blockcontent">
				<div style="padding-left:10px">
					<ul id="ChapterUL" class="ulrow">

					</ul>
					<div class="cb"></div>
				</div>
			</div>
		</div>
	</div>
	<!--右 内容-->
	<div id="centerm">
		<!--内容-->
		<div id="content">
			<table class="grid" width="100%" align="center">
				<tbody>
					<tr>
						<td width="4%" align="center"><span style="font-size:16px;">分<br>卷<br>插<br>图</span></td>
						<td>
							<div ondragover="return false" id="VolumeImg" style="height:155px;overflow:auto">

							</div>
						</td>
					</tr>
				</tbody>
			</table>
			<table class="grid" width="100%" align="center">
				<caption>分卷内容</caption>
				<tbody>
					<tr>
						<td>
							<div id="VolumeText" style="height:500px;overflow: hidden scroll ;max-width: 900px;">
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>

</div>
`;
    // Your code here...
})();