// ==UserScript==
// begin
// name     tiktok
// url      https://www.tiktok.com/foryou?is_copy_url=1&is_from_webapp=v1
// end
// @name         tiktok下载器
// @namespace    http://tampermonkey.net/
// @version      1.37.3
// @description  下载抖音APP端禁止下载的视频、下载抖音无水印视频、提取抖音直播推流地址、免登录使用大部分功能、屏蔽不必要的弹窗,适用于拥有或可安装脚本管理器的电脑或移动端浏览器,如:PC端Chrome、Edge、华为浏览器等,移动端Kiwi、Yandex、Nightly、Iceraven等
// @author       那年那兔那些事
// @license      MIT License
// @include      *://*.douyin.com/*
// @include      *://*.iesdouyin.com/*
// @require      https://greasyfork.org/scripts/415581-jquery%E5%BA%93/code/jquery%E5%BA%93.js?version=866373
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_info
// @connect      *
// @icon         https://lf1-cdn-tos.bytegoofy.com/goofy/ies/douyin_web/public/favicon.ico

// @downloadURL https://update.greasyfork.org/scripts/454634/tiktok%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/454634/tiktok%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
	//样式
	GM_addStyle(".downloaderRootCss-0{--downloader-color-bg:#fff;--downloader-color-text:#000;--downloader-color-border:#f1f2f5}.downloaderRootCss-1{--downloader-color-bg:var(--color-page-bg);--downloader-color-text:var(--color-text-0-hover);--downloader-color-border:var(--color-navigation-bg)}#downloaderSettingPage-page{background:var(--downloader-color-bg);border-radius:20px;font-size:14px;color:var(--downloader-color-text);border:3px solid var(--downloader-color-border);z-index:999}#downloaderSettingPage-box{width:calc(100% - 40px);height:calc(100% - 40px);margin:20px}#downloaderSettingPage-head{width:100%;height:30px;margin-bottom:20px;text-align:center;font-size:20px}#downloaderSettingPage-body{width:100%;height:calc(100% - 100px);overflow:auto}#downloaderSettingPage-foot{width:100%;height:30px;margin-top:20px}#downloaderSettingPage-head .head-logoImg {background: var(--logo-small-url);width: 26px;height: 26px;display: inline-block;vertical-align: middle;margin-right: 5px;background-size: 23px}#downloaderSettingPage-head .head-logoText {display: inline-block;vertical-align: middle}.downloaderSettingPage-select{width:100%;background:var(--downloader-color-bg);color:var(--downloader-color-text);border-color:var(--downloader-color-text)}.downloaderSettingPage-btn{margin-right:12px;padding:0 10px;cursor:pointer;border:thin solid var(--downloader-color-text);border-radius:10px;display:inline-block}#downloaderSettingBtn{align-items:center;background-color:var(--color-bg-1);border-radius:18px;bottom:0;box-shadow:var(--shadow-2);cursor:pointer;display:flex;font-size:0;height:36px;justify-content:center;margin-bottom:8px;width:36px}.downloaderSettingBtn-set:hover{fill:var(--color-text-1)}.downloaderBtn-list:hover{fill-opacity:1}");

	//常量
	const video_vid = "https://www.douyin.com/aweme/v1/play/?video_id={vid}&ratio={ratio}&line=0";
	const video_data = "https://www.douyin.com/web/api/v2/aweme/iteminfo/?item_ids={id}";
	const btn_class = "downloaderBtn";
	const liveBtn_class = "downloaderliveBtn";

	var addDownloadButton = ()=>{
	    var siddenav = '<div class="zhe_nav bounceInUp animated" id="zhe_nav"><a title="批量小管家-微博采集器" data-cat="gogob" class="aside-menu menu-line menu-main" >一键<br>下载</a></div>';
	    var siddecss = ".zhe_nav{position:fixed;right:50px;z-index:9999999!important;top:350px;width:80px;height:80px;-webkit-filter:url(#goo);filter:url(#goo);-ms-user-select:none;-moz-user-select:none;-webkit-user-select:none;user-select:none;opacity:.75}.zhe_nav a:hover{text-decoration: none;}.zhe_nav.no-filter{-webkit-filter:none;filter:none}.zhe_nav .menu-main{padding-top:0!important;display: flex;justify-content: center;align-items:center;}.zhe_nav .aside-menu{position:absolute;width:70px;height:70px;-webkit-border-radius:50%;border-radius:50%;background:#f34444;left:0;top:0;right:0;bottom:0;margin:auto;text-align:center;line-height:70px;color:#fff;font-size:20px;z-index:1;cursor:move}.zhe_nav .menu-item{position:absolute;width:60px;height:60px;background-color:#ff7676;left:0;top:0;right:0;bottom:0;margin:auto;line-height:60px;text-align:center;-webkit-border-radius:50%;border-radius:50%;text-decoration:none;color:#fff;-webkit-transition:background .5s,-webkit-transform .6s;transition:background .5s,-webkit-transform .6s;-moz-transition:transform .6s,background .5s,-moz-transform .6s;transition:transform .6s,background .5s;transition:transform .6s,background .5s,-webkit-transform .6s,-moz-transform .6s;font-size:14px;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}.zhe_nav .menu-item:hover,.zhe_nav .menu-main:hover{background:#a9c734}.zhe_nav .menu-line{line-height:20px;padding-top:10px}.zhe_nav:hover{opacity:1}.zhe_nav:hover .aside-menu{-webkit-animation:jello 1s;-moz-animation:jello 1s;animation:jello 1s}.zhe_nav:hover .menu-first{-webkit-transform:translate3d(0,-135%,0);-moz-transform:translate3d(0,-135%,0);transform:translate3d(0,-135%,0)}.zhe_nav:hover .menu-second{-webkit-transform:translate3d(-120%,-70%,0);-moz-transform:translate3d(-120%,-70%,0);transform:translate3d(-120%,-70%,0)}.zhe_nav:hover .menu-third{-webkit-transform:translate3d(-120%,70%,0);-moz-transform:translate3d(-120%,70%,0);transform:translate3d(-120%,70%,0)}.zhe_nav:hover .menu-fourth{-webkit-transform:translate3d(0,135%,0);-moz-transform:translate3d(0,135%,0);transform:translate3d(0,135%,0)}.zhe_nav:hover .menu-fifth{-webkit-transform:translate3d(120%,70%,0);-moz-transform:translate3d(120%,70%,0);transform:translate3d(120%,70%,0)}.zhe_nav:hover .menu-sixth{-webkit-transform:translate3d(120%,-70%,0);-moz-transform:translate3d(120%,-70%,0);transform:translate3d(120%,-70%,0)}@-webkit-keyframes jello{from,11.1%,to{-webkit-transform:none;transform:none}22.2%{-webkit-transform:skewX(-12.5deg) skewY(-12.5deg);transform:skewX(-12.5deg) skewY(-12.5deg)}33.3%{-webkit-transform:skewX(6.25deg) skewY(6.25deg);transform:skewX(6.25deg) skewY(6.25deg)}44.4%{-webkit-transform:skewX(-3.125deg) skewY(-3.125deg);transform:skewX(-3.125deg) skewY(-3.125deg)}55.5%{-webkit-transform:skewX(1.5625deg) skewY(1.5625deg);transform:skewX(1.5625deg) skewY(1.5625deg)}66.6%{-webkit-transform:skewX(-.78125deg) skewY(-.78125deg);transform:skewX(-.78125deg) skewY(-.78125deg)}77.7%{-webkit-transform:skewX(0.390625deg) skewY(0.390625deg);transform:skewX(0.390625deg) skewY(0.390625deg)}88.8%{-webkit-transform:skewX(-.1953125deg) skewY(-.1953125deg);transform:skewX(-.1953125deg) skewY(-.1953125deg)}}@-moz-keyframes jello{from,11.1%,to{-moz-transform:none;transform:none}22.2%{-moz-transform:skewX(-12.5deg) skewY(-12.5deg);transform:skewX(-12.5deg) skewY(-12.5deg)}33.3%{-moz-transform:skewX(6.25deg) skewY(6.25deg);transform:skewX(6.25deg) skewY(6.25deg)}44.4%{-moz-transform:skewX(-3.125deg) skewY(-3.125deg);transform:skewX(-3.125deg) skewY(-3.125deg)}55.5%{-moz-transform:skewX(1.5625deg) skewY(1.5625deg);transform:skewX(1.5625deg) skewY(1.5625deg)}66.6%{-moz-transform:skewX(-.78125deg) skewY(-.78125deg);transform:skewX(-.78125deg) skewY(-.78125deg)}77.7%{-moz-transform:skewX(0.390625deg) skewY(0.390625deg);transform:skewX(0.390625deg) skewY(0.390625deg)}88.8%{-moz-transform:skewX(-.1953125deg) skewY(-.1953125deg);transform:skewX(-.1953125deg) skewY(-.1953125deg)}}@keyframes jello{from,11.1%,to{-webkit-transform:none;-moz-transform:none;transform:none}22.2%{-webkit-transform:skewX(-12.5deg) skewY(-12.5deg);-moz-transform:skewX(-12.5deg) skewY(-12.5deg);transform:skewX(-12.5deg) skewY(-12.5deg)}33.3%{-webkit-transform:skewX(6.25deg) skewY(6.25deg);-moz-transform:skewX(6.25deg) skewY(6.25deg);transform:skewX(6.25deg) skewY(6.25deg)}44.4%{-webkit-transform:skewX(-3.125deg) skewY(-3.125deg);-moz-transform:skewX(-3.125deg) skewY(-3.125deg);transform:skewX(-3.125deg) skewY(-3.125deg)}55.5%{-webkit-transform:skewX(1.5625deg) skewY(1.5625deg);-moz-transform:skewX(1.5625deg) skewY(1.5625deg);transform:skewX(1.5625deg) skewY(1.5625deg)}66.6%{-webkit-transform:skewX(-.78125deg) skewY(-.78125deg);-moz-transform:skewX(-.78125deg) skewY(-.78125deg);transform:skewX(-.78125deg) skewY(-.78125deg)}77.7%{-webkit-transform:skewX(0.390625deg) skewY(0.390625deg);-moz-transform:skewX(0.390625deg) skewY(0.390625deg);transform:skewX(0.390625deg) skewY(0.390625deg)}88.8%{-webkit-transform:skewX(-.1953125deg) skewY(-.1953125deg);-moz-transform:skewX(-.1953125deg) skewY(-.1953125deg);transform:skewX(-.1953125deg) skewY(-.1953125deg)}}.animated{-webkit-animation-duration:1s;-moz-animation-duration:1s;animation-duration:1s;-webkit-animation-fill-mode:both;-moz-animation-fill-mode:both;animation-fill-mode:both}@-webkit-keyframes bounceInUp{from,60%,75%,90%,to{-webkit-animation-timing-function:cubic-bezier(0.215,.61,.355,1);animation-timing-function:cubic-bezier(0.215,.61,.355,1)}from{opacity:0;-webkit-transform:translate3d(0,800px,0);transform:translate3d(0,800px,0)}60%{opacity:1;-webkit-transform:translate3d(0,-20px,0);transform:translate3d(0,-20px,0)}75%{-webkit-transform:translate3d(0,10px,0);transform:translate3d(0,10px,0)}90%{-webkit-transform:translate3d(0,-5px,0);transform:translate3d(0,-5px,0)}to{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}@-moz-keyframes bounceInUp{from,60%,75%,90%,to{-moz-animation-timing-function:cubic-bezier(0.215,.61,.355,1);animation-timing-function:cubic-bezier(0.215,.61,.355,1)}from{opacity:0;-moz-transform:translate3d(0,800px,0);transform:translate3d(0,800px,0)}60%{opacity:1;-moz-transform:translate3d(0,-20px,0);transform:translate3d(0,-20px,0)}75%{-moz-transform:translate3d(0,10px,0);transform:translate3d(0,10px,0)}90%{-moz-transform:translate3d(0,-5px,0);transform:translate3d(0,-5px,0)}to{-moz-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}@keyframes bounceInUp{from,60%,75%,90%,to{-webkit-animation-timing-function:cubic-bezier(0.215,.61,.355,1);-moz-animation-timing-function:cubic-bezier(0.215,.61,.355,1);animation-timing-function:cubic-bezier(0.215,.61,.355,1)}from{opacity:0;-webkit-transform:translate3d(0,800px,0);-moz-transform:translate3d(0,800px,0);transform:translate3d(0,800px,0)}60%{opacity:1;-webkit-transform:translate3d(0,-20px,0);-moz-transform:translate3d(0,-20px,0);transform:translate3d(0,-20px,0)}75%{-webkit-transform:translate3d(0,10px,0);-moz-transform:translate3d(0,10px,0);transform:translate3d(0,10px,0)}90%{-webkit-transform:translate3d(0,-5px,0);-moz-transform:translate3d(0,-5px,0);transform:translate3d(0,-5px,0)}to{-webkit-transform:translate3d(0,0,0);-moz-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}.bounceInUp{-webkit-animation-name:bounceInUp;-moz-animation-name:bounceInUp;animation-name:bounceInUp;-webkit-animation-delay:1s;-moz-animation-delay:1s;animation-delay:1s}@media screen and (max-width:640px){.zhe_nav{display:none!important}}@media screen and (min-width:641px) and (max-width:1367px){.zhe_nav{top:120px}}";
	    $("body").append(siddenav);
	    $('<style>').html(siddecss).appendTo($('head'));
	    var drags = {
	        down: false,
	        x: 0,
	        y: 0,
	        winWid: 0,
	        winHei: 0,
	        clientX: 0,
	        clientY: 0
	    },
	    adsideNav = $("#zhe_nav")[0],
	    getCss = function(a, e) {
	        return a.currentStyle ? a.currentStyle[e] : document.defaultView.getComputedStyle(a, !1)[e]
	    };

	    $('body').on('click', '[data-cat=gogob]', function() {
	      if(drags.down)return false;
	      if (location.href.indexOf("/user/") >= 0) {
		        $("ul li>a").each(function(idx, elem){
		        	if($(elem).hasClass("svm_download_item")){
		        		return true;
		        	}
		        	
		        	$(elem).addClass("svm_download_item");
	  				var href = $(elem).attr("href")||"", vid;
	  				if(href.indexOf("/video/") != 0){
	  					return true;
	  				}
	  				try{
	  					vid = /\d+/.exec(href)[0];
	  					if(vid.length < 15){
	  						return true;
	  					}
	  				}catch(err){
	  					return true;
	  				}
	  				console.log("==getvid=="+vid)
	  				getDyVideoUrl(vid, function(item){
	  					var downloadurl = item.video.play_addr.url_list[0].replace("playwm", "play");
	  					var title = item.desc;
	  					GM_download({
							url: downloadurl,
							name: title+".mp4",
							saveAs: true,
							onerror: function() {
								console.log("download error");
							}
						});
	  				})
	  			})
	      }else{
	        alert("请进入短视频页面后点击下载！");
	      }
	    });

	    $("#zhe_nav").on("mousedown", function(a) {
	            drags.clientX = a.clientX, drags.clientY = a.clientY, drags.x = getCss(this, "right"), drags.y = getCss(this, "top"), drags.winHei = $(window).height(), drags.winWid = $(window).width(), $(document).on("mousemove", function(a) {
	            if (drags.winWid > 640 && (a.clientX < 120 || a.clientX > drags.winWid - 50))
	                return !1;
	            if (a.clientY < 180 || a.clientY > drags.winHei - 120)
	                return !1;
	            var e = a.clientX - drags.clientX,
	                t = a.clientY - drags.clientY;
	            adsideNav.style.top = parseInt(drags.y) + t + "px";
	            adsideNav.style.right = parseInt(drags.x) - e + "px";
	            drags.down = true;
	        })
	    }).on("mouseup", function(e) {
	        $(document).off("mousemove");
	        setTimeout(function(){
	      drags.down = false;
	        }, 1);
	    });
	 }
	function getDyVideoUrl(vid, callback){
		$.get("https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/",{item_ids:vid}, function(ret){
			callback(ret.item_list[0]);
		});
	}
  	var downloadUserPage = function() {
        $(document).keydown(function(event){
	        var e = event || window.event || arguments.callee.caller.arguments[0]; 
			if (e.keyCode == 88) {  
	            $("[data-cat=gogob],.downloaderBtn,.downloaderliveBtn").click();
	        }
	     });
  		if (location.href.indexOf("/user/")>0){
  			addDownloadButton();
  		}
  	}
	//具体实现
	var tools = {
		checkUA: function() {
			var UAstr = "pc";
			if (/Android|webOS|iPhone|iPod|BlackBerry|HarmonyOS/i.test(navigator.userAgent)) {
				UAstr = "mobile";
			}
			return UAstr;
		},
		identifySite: function(type) {
			var Url = window.location.href;
			var UAstr = this.checkUA();
			var res = false;
			//区分UA
			if (UAstr === "mobile" && Url.search("/share/video/") !== -1) {
				res = ["appshare", "share"];
			} else if (UAstr === "pc" && Url.search("douyin.com") !== -1) {
				if (location.pathname === "/") {
					res = ["recommend", "video"];
				} else if (Url.search("/discover") !== -1) {
					res = ["home", "video"];
				} else if (Url.search("/follow") !== -1) {
					res = ["follow", "video"];
				} else if (Url.search("/hot") !== -1) {
					res = ["hot", "video"];
				} else if (Url.search("/channel") !== -1) {
					res = ["channel", "video"];
				} else if (Url.search("/video") !== -1) {
					res = ["detail", "video"];
				} else if (Url.search("/vsdetail") !== -1) {
					res = ["vsdetail", "video"];
				} else if (Url.search("/search") !== -1) {
					res = ["search", "video"];
				}else if (Url.search("/user") !== -1) {
					res = ["user", "video"];
				}
			}
			//不区分UA
			if (Url.search("live.douyin.com") !== -1) {
				if (location.pathname === "/") {
					res = ["livehome", "live"];
				} else {
					res = ["livedetail", "live"];
				}
			}
			if (type === "type") {
				return res[1];
			} else {
				return res[0];
			}
		},
		getData: function(target) {
			if (currentPage === "detail") {
				let res = document.querySelector("#RENDER_DATA");
				res = JSON.parse(decodeURIComponent(res.innerText));
				let temp = null;
				for (let i in res) {
					try {
						temp = res[i].aweme.detail;
					} catch (e) {
						temp = null;
					}
					if (temp) {
						break;
					}
				}
				if (!temp) {
					return false;
				}
				res = temp;
				let data = {
					"url": res.video.bitRateList[0].playApi,
					"id": res.awemeId,
					"name": res.desc,
					"author": res.authorInfo.nickname
				};
				data.url = data.url.replace(/^((http|https):)?\/\//, "https://");
				target.setAttribute("download-data", JSON.stringify(data));
				return null;
			}
			if (currentPage === "vsdetail") {
				let videoEle = document.querySelector("video");
				let nameEle = document.querySelector(".HzHqxWVm");
				let authorEle = document.querySelector(".ngajnKEz");
				if (videoEle && nameEle && authorEle) {
					let data = {
						"url": videoEle.src ? videoEle.src : videoEle.firstChild.src,
						"id": /\/\d{10,}/.exec(location.href)[0].replace("/", ""),
						"name": nameEle.innerText.replaceAll("\n", " "),
						"author": authorEle.innerText
					};
					data.url = data.url.replace(/^((http|https):)?\/\//, "https://");
					target.setAttribute("download-data", JSON.stringify(data));
				}
				return null;
			}
			var id = target.getAttribute("download-id").trim();
			if (!id) {
				console.log("下载按钮缺失视频id");
				tools.errorPause(false);
				return false;
			}
			var ajaxUrl = video_data.replace("{id}", id);
			if (/iesdouyin.com/i.test(location.hostname)) {
				ajaxUrl = ajaxUrl.replace("douyin.com", "iesdouyin.com");
			}
			$.ajax({
				url: ajaxUrl,
				type: "GET",
				dataType: "JSON",
				async: false,
				success: function(response) {
					try {
						if (typeof response === "string") {
							response = JSON.parse(response);
						}
						JSON.stringify(response); //防止jsonRes不是JSON格式
					} catch (e) {
						console.log("video data获取失败,video ID:" + id);
						tools.errorPause(false);
						return false;
					}
					response = response.item_list[0];
					let data = {
						"vid": response.video.vid,
						"id": response.aweme_id,
						"name": response.desc,
						"author": response.author.nickname
					};
					target.setAttribute("download-data", JSON.stringify(data));
					tools.errorPause(true);
				},
				error: function() {
					console.log("video data获取失败,video ID:" + id);
					tools.errorPause(false);
				}
			});
		},
		parseData: function(data) {
			data = data ? JSON.parse(data) : {};
			console.log(data);
			var url;
			if (data.vid) {
				var ratio = set.get("videoQuality");
				ratio = (ratio === "default") ? "1080p" : ratio;
				url = video_vid.replace("{vid}", data.vid).replace("{ratio}", ratio);
				if (/iesdouyin.com/i.test(location.hostname)) {
					url = url.replace("douyin.com", "iesdouyin.com");
				}
			} else if (data.url) {
				url = data.url;
			}
			var id = data.id;
			var name = data.name;
			var author = data.author;
			var fileName = "抖音视频下载";
			switch (set.get("fileName")) {
				case "id":
					fileName = id ? id : fileName;
					break;
				case "videoName":
					fileName = name ? name : fileName;
					break;
				case "whole":
				default:
					fileName = (name && author) ? (name + "@" + author) : fileName;
					break;
			}
			fileName = fileName + ".mp4";
			return {
				"url": url,
				"name": fileName
			};
		},
		downloadVideo: function(data) {
			data = this.parseData(data);
			if (set.get("download") === "auto") {
				GM_download({
					url: data.url,
					name: data.name,
					saveAs: true,
					onerror: function() {
						console.log("GM_download 错误");
					}
				});
			} else {
				open(data.url);
			}
		},
		toClipboard: function(data, msg) {
			var exportBox = document.createElement("input");
			exportBox.value = data;
			document.body.appendChild(exportBox);
			exportBox.select();
			document.execCommand('copy');
			exportBox.remove();
			if (msg !== false) {
				msg = msg ? msg : "已导出到剪贴板";
				alert(msg);
			}
			console.log(data);
		},
		encodeShort: function(url) {
			if (!url) {
				console.log("tools.encodeShort(url)参数缺失");
				return false;
			}
			var shortInterFace = "xnz.pub/apis.php?url="; //短链接口
			var shortUrl;
			var protocol = /http|https/i.test(location.protocol) ? location.protocol : "https:";
			shortInterFace = protocol + "//" + shortInterFace.replace(/^((http|https):)?\/\//, "");
			$.ajax({
				type: "get",
				url: shortInterFace + url,
				async: false, //必须同步执行
				error: function(xhr) {
					alert("短链接口错误!\n" + "错误代码:" + xhr.status + "\n错误提示:" + xhr.statusText +
						"\n请联系开发者更换短链接口");
					shortUrl = false;
				},
				success: function(res) {
					res = (typeof res === "string")?JSON.parse(res):res;//防止get到的数据不是json格式
					shortUrl = "https://xnz.pub/" + res.result.shorten;
				}
			})
			return shortUrl;
		},
		errorPause: function(state) {
			if (!state) {
				errorNum += 1;
				if (errorNum >= 3) {
					clearInterval(Timer);
					console.log("连续十次出错，程序停止");
				}
			}
		},
		hotKey:function(){
			$("body").keyup((evt)=>{
				if(evt.shiftKey){
					if(/68|100/.test(evt.keyCode)){
						if(/detail|recommend|follow/.test(currentPage)){
							$(`.${btn_class}`)[0].click();
						}else{
							alert("当前快捷键仅支持详情页、推荐页和关注页");
						}
					}else if(/83|115/.test(evt.keyCode)){
							$("#downloaderSettingBtn").click();
					}
				}
			})
		},
		jqReady:function(){
			if (typeof jQuery !== "function") {
				let msg =
					"jQuery加载失败，抖音视频下载器无法正常启动。\n可能的原因:\n(1)网络波动，请刷新网页重新加载脚本或稍后再试；\n(2)浏览器不支持脚本内调用jQuery，请使用主流浏览器与脚本管理器。";
				console.log(msg);
				alert(msg);
				return false;
			}else{
				return true;
			}
		}
	}

	var createBtn = {
		change: function() {
			$(`.${btn_class}`).each((i,btn)=>{
				if (!$(btn).attr("download-data")) {
					tools.getData(btn);
				}
			})
		},
		download: function(target) {
			var data = $(target).attr("download-data");
			data?tools.downloadVideo(data):alert("正在解析视频地址，请稍后\n若长时间获取不到地址，请刷新页面或在脚本设置中刷新下载按钮");
		},
		share: function() {
			var btnBox = document.getElementsByClassName("content-wrap")[0];
			var downloadBtn = document.getElementsByClassName(btn_class)[0];
			if (!btnBox || downloadBtn) {
				return false;
			}
			downloadBtn = btnBox.firstChild.cloneNode(true);
			var videoURL = document.getElementsByTagName("video")[0].src.replace("playwm", "play");
			var videoID = location.href;
			videoID = videoID.slice(videoID.search("video/") + 6);
			videoID = videoID.split("/")[0];
			downloadBtn.classList.add(btn_class);
			downloadBtn.setAttribute("download-id", videoID)
			downloadBtn.style.marginLeft = "10px";
			downloadBtn.children[0].src =
				"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAANBSURBVFhHzZlBb9MwFMfjqkXTpDaThiaQNqHduXBju/ENEGhc+BTsg7BPwYUKzrtxo7vxCRAHJiHQhpZOmqYtqvn/necsa5w0cUKbn+TZcZvk3+dn+/lNBQ2YTqd7WuvnQaAOgkDvoN6WjwR9ij8TFq17pxsbw7Hp9qC20PPzq+1+//Y9mnsoa3jEFerHKAMUF5coZ0kz2IX4sVLqaDQa8QdUprLQjMAXuG2Gest8UJ8/KLi3nuBKQqMo+ogKFlQh6qHpbA4tzWcdheHo0PSU0JPaCa0IkT+TK+N/bYkk9lkvo2h6w3fJtZNCi8pEgSXVA1z6DnMtlAr2i1zBKTQRGXxF8xalaJL8F4rE5oQmkybmcC9dpDCL4/6Tzc11Lm0pOR+FSE4czsxViCQ9aPgh7ZR7QuHUXH4eoSzFJ0v4KytNSjr0Gb/sCDqK48FT6wKpRTHD36Hi2tYRFFzAbDAGY9Gm1nz1+q203Hz+9EFaddFnsOozWtVYVKzJCdQx1MxaVYae0c/KJ5ALamLwE/QuLi4pMrccdIg1umZPqVnpHrt61BVjXg49TfvQ9HUTxLrqwAptMypqG+yQekdhN9LSUZlFy9EifJardMHvOl5C/Rdw/3u9LerzwiY/EELNkbYS9M2sf9Z5cfa7889ZjOYWqmyQ7EUVsU0sCRgoTWhRJgV+mS5PyoQ0FEmYE5hgZ1InELue9PnjEtSCSAOzLCbMS47E8+mYPE3Xz3mq/hCc+5Wd9Tz1dTDMoybjmkngLOmab7js3J5vj8/GonIu+YLSoaMIteixPePboQ8Q8h/ig0guu8CQSTRp3wkVq1J9F4JoariX6ctlSmQFWFq+yQEn9XfM9P3kMiG1qAUugPhU36DpvVs1gO/ciuP+m+TyjpxQugB8g19kSmeZYk2ui7PcJh2y5IQS+gZvQJNil7G+cr38XTvtaJHMHnNAzEftms72wcTRA7qcy5KWUqEWSZ7ZlE+LqXGzHE7CMMz55DzOoZ+HOfbEFfSxdDVxBw4zIiJ9TCtWEUkqWTSLpMxhXZNdsWsut94iS3OSIIw0Edo1yoSbS9kwu6gtNAuzLJLA4JEbxfUPMQbm5l81J0UTZTFB8A/hCTrXIQH9kwAAAABJRU5ErkJggg==";
			downloadBtn.children[1].innerHTML = "下载";
			var downloadBtnEvent = {
				clickFn: createBtn.download,
				longPress: function() {
					set.create();
				}
			}
			var waitTimer = -1;
			downloadBtn.addEventListener("touchstart", function() {
				waitTimer = setTimeout(function() {
					waitTimer = -1;
					downloadBtnEvent.longPress();
				}, 500);
			})
			downloadBtn.addEventListener("touchend", function() {
				if (waitTimer !== -1) {
					clearTimeout(waitTimer);
					waitTimer = -1;
					downloadBtnEvent.clickFn(this);
				}
			})
			btnBox.appendChild(downloadBtn);
		},
		list: function(BtnList, id) {
			id = id.trim();
			if (BtnList.getElementsByClassName(btn_class)[0] || BtnList.getElementsByClassName(
					liveBtn_class)[0]) {
				return false;
			}
			var timeBox = BtnList.children[1];
			var newBtn = document.createElement("span");
			newBtn.innerHTML =
				`<svg class='${btn_class}-list' xmlns='http://www.w3.org/2000/svg' version='1.1' style='width:32px;height:32px; cursor: pointer;margin-left:5px;' fill='var(--color-text-1)' fill-opacity='0.4'><path d='M12 7h8v8h-8z M8 15L24 15 16 24z M5 24h22v2h-22z M5 20h2v4h-2z M25 20h2v4h-2z' /></svg>`;
			var newBtn0 = newBtn.children[0];
			if (timeBox === undefined) {
				newBtn.classList.add(liveBtn_class);
				newBtn.onclick = function() {
					alert("当前项为直播间，暂时无法在列表中提取真实推流地址。请先进入直播间再提取地址");
				}
				BtnList.appendChild(newBtn);
			} else {
				newBtn.classList.add(btn_class);
				newBtn.setAttribute("download-id", id)
				newBtn.onclick = function() {
					createBtn.download(this);
				};
				BtnList.insertBefore(newBtn, timeBox);
			}
		},
		swiper: function(BtnList, id) { //.newBtnDownload
			var newBtnBox = BtnList.getElementsByClassName(btn_class)[0];
			if (!newBtnBox) {
				let newBtn = BtnList.children[1].cloneNode(true);
				let pathEle = newBtn.children[0].children[0].children[0].cloneNode(true);
				newBtn.children[0].children[0].innerHTML = "";
				newBtn.children[0].children[0].appendChild(pathEle);
				newBtn.children[0].children[0].children[0].setAttribute("d",
					"M14 9h8v8h-8z M10 17L26 17 18 26z M7 26h22v2h-22z M7 22h2v4h-2z M27 22h2v4h-2z");
				newBtn.children[1].innerHTML = "下载";
				newBtnBox = document.createElement("div");
				newBtnBox.classList.add(btn_class);
				newBtnBox.setAttribute("download-id", id);
				newBtnBox.onclick = function() {
					createBtn.download(this);
				};
				newBtnBox.appendChild(newBtn);
				BtnList.appendChild(newBtnBox);
			} else if (newBtnBox.getAttribute("download-id") !== id) {
				console.log("下载按钮视频id与网页不匹配，正在刷新按钮");
				newBtnBox.removeAttribute("download-data");
			}
		},
		video: function(BtnList, id, isVS) { //isVS:是否综艺详情页
			var cloneNum = 2,
				textClass = "Uehud9DZ";
			if (isVS === true) {
				cloneNum = 0;
				textClass = "";
			}
			if (!document.getElementsByClassName(btn_class)[0]) {
				let newBtn = null;
				if (isVS === true) {
					newBtn = BtnList.children[0].cloneNode(true);
				} else {
					newBtn = BtnList.children[2].cloneNode(true);
					newBtn.children[1].setAttribute("class", "Uehud9DZ");
				}
				newBtn.classList.add(btn_class);
				newBtn.setAttribute("download-id", id);
				newBtn.children[0].children[0].setAttribute("d",
					"M12 7h8v8h-8z M8 15L24 15 16 24z M5 24h22v2h-22z M5 20h2v4h-2z M25 20h2v4h-2z");
				newBtn.children[1].innerHTML = "下载";
				newBtn.onclick = function() {
					createBtn.download(this);
				};
				BtnList.appendChild(newBtn);
			} else {
				let btn = document.getElementsByClassName(btn_class)[0];
				if (btn.getAttribute("download-id") !== id) {
					console.log("下载按钮视频id与网页不匹配，正在刷新按钮");
					btn.remove();
					location.reload(true);
				}
			}
		},
		live: {
			create: function(name, id, logo, event, attribute) {
				var btn = document.createElement("button");
				btn.setAttribute("class", "vtmmwltk fagGqGzK mBGB33Vg VPz4-306");
				btn.style.margin = "0 0 0 8px";
				btn.innerHTML = logo + "<span>" + name + "</span>";
				btn.id = id;
				for (let i in event) {
					btn.addEventListener(i, event[i]);
				}
				for (let i in attribute) {
					btn.setAttribute(i, attribute[i]);
				}
				return btn;
			},
			undisturb: function() {
				var list = {
					"searchBar": {
						"class": "BJUkFEKo",
						"extraEvent": function(state) {
							var liveCategory = document.getElementsByClassName("xWQs9nlt KpjwjEYL")[
								0];
							if (!liveCategory) {
								console.log("直播分类模块丢失");
								return false;
							}
							if (state === "on") {
								liveCategory.style.top = "0";
							} else {
								liveCategory.style.top = "";
							}
						}
					},
					"liveCategory": {
						"class": "l0I0l5H4",
						"extraEvent": null
					},
					"relativeLive": {
						"class": "_3zMWm4HT",
						"extraEvent": null
					},
					"buttomMessage": {
						"class": "HPcNXBOf",
						"extraEvent": null
					},
					"chatWindow": {
						"class": "ojIOhXDJ",
						"extraEvent": function(state) {
							var livePlayer = document.getElementsByClassName("Jf1GlewW")[0];
							if (!livePlayer) {
								console.log("找不到直播播放器");
								return false;
							}
							if (state === "on") {
								livePlayer.style.margin = "auto";
							} else {
								livePlayer.style.margin = "";
							}
						}
					},
					"edgeTool": {
						"class": "ohjo+Xk3",
						"extraEvent": null
					},
				};
				var event = {
					"click": function() {
						var state = this.getAttribute("state-data");
						if (state === "off") {
							state = "on";
							this.setAttribute("class", "vtmmwltk fagGqGzK IuAQYIaJ rgdB9Lb0");
						} else {
							state = "off";
							this.setAttribute("class", "vtmmwltk fagGqGzK mBGB33Vg rgdB9Lb0");
						}
						var setData = set.get("hideList"),
							target, extraEvent;
						for (let i in setData) {
							target = false;
							extraEvent = false;
							if (setData[i] && list[i]) {
								target = document.getElementsByClassName(list[i].class)[0];
								extraEvent = list[i].extraEvent;
								if (target) {
									if (state === "on") {
										target.style.display = "none";
									} else {
										target.style.display = "";
									}
								}
								if (typeof extraEvent === "function") {
									extraEvent(state);
								}
							}
						}
						this.setAttribute("state-data", state);
						localStorage.setItem("undisturbWatch", state);
						console.log("沉浸式观看:" + state);
					}
				}
				var attribute = {
					"state-data": "off",
					"title": "沉浸式观看模式:屏蔽不必要的窗口从而提高观看体验。按钮红色亮起表示未启动，非红色表示已启动"
				}
				var btn = this.create("沉浸观看", "undisturbWatchBtn", "", event, attribute);
				btn.setAttribute("class", "vtmmwltk fagGqGzK mBGB33Vg rgdB9Lb0");
				return btn;
			},
			download: function() {
				var logo =
					"<svg width='14' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg' class='_5AZvPWVz'><path fill-rule='evenodd' clip-rule='evenodd' d='M5 1L10 1L10 7L12 7L8 11L8 12L13 12L13 9L14 9L14 13L1 13L1 9L2 9L2 12L7 12L7 11L3 7L5 7z' fill='#2F3035'></path></svg>";
				var event = {
					"click": function() {
						var data = document.getElementById("RENDER_DATA").innerText;
						data = JSON.parse(decodeURIComponent(data));
						data = data.initialState.roomStore.roomInfo.room.stream_url;
						switch (set.get("download")) {
							case "m3u8":
								data = data.hls_pull_url_map["FULL_HD1"];
								break;
							case "flv":
								data = data.flv_pull_url["FULL_HD1"];
								break;
							default:
								data = data.hls_pull_url;
								break;
						}
						if (data && typeof data === "string") {
							tools.toClipboard(data, "抖音真实推流地址已导出到剪贴板");
						}
					}
				}
				var attribute = {
					"title": "点击提取抖音直播真实推流地址"
				}
				var btn = this.create("提取地址", "newBtnDownload", logo, event, attribute);
				return btn;
			},
			share: function() {
				let box = document.querySelector("._2ZWxpgKz");
				if (box && !/分享/i.test(box.innerText)) {
					let btn = box.children[0].cloneNode(true);
					btn.innerText = btn.innerText.replace("举报", "分享");
					btn.onclick = function() {
						let shareUrl = location.href;
						shareUrl = set.get("shareUrl") !== "short" ? shareUrl : tools.encodeShort(
							shareUrl);
						tools.toClipboard(shareUrl);
					}
					box.appendChild(btn);
				}
			}
		},
		set: function() {
			if ($("#downloaderSettingBtn")[0]) {
				return false;
			}
			//s2O1MLsL:video;ohjo+Xk3:live;nxsdxGGH:search
			var boxClassArray = ["s2O1MLsL", "ohjo+Xk3", "nxsdxGGH"],
				box;
			for (let i in boxClassArray) {
				box = $(`.${boxClassArray[i]}`)[0];
				if (box) {
					break;
				}
			}
			if (!box) {
				return false;
			}
			var btn = document.createElement("div");
			btn.id = "downloaderSettingBtn";
			btn.innerHTML =
				`<svg class='downloaderSettingBtn-set' width='32' height='32' fill='var(--color-text-3)' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 36 36'><path fill-rule='evenodd' clip-rule='evenodd' d='M18.051782472841584,8.307068007308498 C12.516707606894524,8.307068007308498 8.029759537538956,12.794016076664168 8.029759537538956,18.329090942611256 C8.029759537538956,23.864165808558244 12.516707606894524,28.35111387791388 18.051782472841584,28.35111387791388 C23.586857338788583,28.35111387791388 28.073805408144114,23.864165808558244 28.073805408144114,18.329090942611256 C28.073805408144114,12.794016076664168 23.586857338788583,8.307068007308498 18.051782472841584,8.307068007308498 zM23.834408338773077,17.61746801229386 C22.83386098228989,18.76833881723545 21.278909714978113,19.148974338102818 19.914276208100574,18.711105577684705 L14.95773975158758,24.41098459125365 C14.429539010673908,25.017794841911893 13.510359392347201,25.079854981183725 12.903549141689044,24.552343797372888 S12.232610080449827,23.104963438132547 12.760121264260935,22.49815318747435 L17.723553291803697,16.792068159978093 C17.10777879880622,15.50604416284459 17.27051427511903,13.92075238300005 18.266234731880896,12.776087591985577 C19.208859291710244,11.690035154728026 20.647275408611392,11.292850263388228 21.953986118835438,11.621769001528975 L20.054945857116607,13.836626416431487 L20.676236806938302,15.643955583448678 L22.55321124136052,16.00873129094669 L24.457078402800576,13.788357419219931 C24.97286711586004,15.03921400409958 24.78323891252938,16.527278232418247 23.834408338773077,17.61746801229386 z'></path></svg>`;
			btn.onclick = function() {
				if (document.getElementById("downloaderSettingPage-page")) {
					set.close();
				} else {
					set.create()
				}
			}
			box.insertBefore(btn,box.firstElementChild);
		},
		link: function() {
			$(".toq1W3Ji").each((i,shareBox)=>{
				if (shareBox && shareBox.name !== "newShareBox") {
					var tokenBtn = shareBox.children[1];
					var linkBtn = tokenBtn.cloneNode(true);
					var shortLink = shareBox.firstChild.innerText;
					shortLink =
						/(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/g.exec(shortLink)[0];
					linkBtn.setAttribute("data-shortLink", shortLink);
					linkBtn.onclick = function() {
						tools.toClipboard(this.getAttribute("data-shortLink"),"短链已复制到剪贴板");
					}
					linkBtn.innerText = "短链";
					linkBtn.id = "shortLinkShareBtn";
					linkBtn.style.marginLeft = "1px";
					tokenBtn.innerText = "口令";
					var btnWidth = Math.ceil(getComputedStyle(tokenBtn).minWidth.replace("px", ""));
					var textWidth = Math.floor(getComputedStyle(shareBox.firstChild).width.replace("px",""));
					shareBox.firstChild.style.width = (textWidth - btnWidth - 1) + "px";
					shareBox.lastChild.style.borderRadius = "0px";
					shareBox.appendChild(linkBtn);
					shareBox.name = "newShareBox";
				}
			})
		}
	};

	var init = {
		page: function() {
			Page = currentPage;
			console.log("当前页判断为" + Page + "页");
			if (Timer !== -1) {
				clearInterval(Timer);
				console.log("已释放上一定时器(ID:" + Timer + ")");
				Timer = -1;
			}
		},
		main: function() {
			this.page();
			set.init();
			createBtn.set();
			this.edge();
			main.judge();
		},
		clickFn: function() {
			loginPopupFlag = "wait";
			console.log("用户登录中...");
		},
		login: function() {
			var ClassArray = ["SSV0NEur", "tk3nuzSi", "wlsrobSg", "OPE8io-h", "ib4UcBI5",
				"q6zgm94p k-vFWw3W FDOWibym scan__button",
				"q6zgm94p k-vFWw3W FDOWibym video-comment-high__contain__btn"
			]; //视频顶栏（button）、推荐页评论区（span ib4UcBI5）、直播间弹幕（span OPE8io-h）
			var BtnArray = [];
			var LoginBtnArray, LoginBtn;
			for (let i = 0; i < ClassArray.length; i++) {
				LoginBtnArray = document.getElementsByClassName(ClassArray[i]);
				if (LoginBtnArray[0]) {
					BtnArray.push(ClassArray[i]);
				}
			}
			for (let i = 0; i < BtnArray.length; i++) {
				LoginBtn = document.getElementsByClassName(BtnArray[i]);
				for (let j = 0; j < LoginBtn.length; j++) {
					if (LoginBtn[j] && LoginBtn[j].name !== "newLoginBtn") {
						LoginBtn[j].addEventListener("click", init.clickFn);
						LoginBtn[j].name = "newLoginBtn";
					}
				}
			}
			//以防万一所有button都加上新事件
			var allBtn = document.getElementsByTagName("button");
			for (let i = 0; i < allBtn.length; i++) {
				if (allBtn[i].innerText.search("登录") !== -1) {
					allBtn[i].addEventListener("click", init.clickFn);
					allBtn[i].name = "newLoginBtn";
				}
			}
		},
		edge: function() {
			var ClassArray = ["fb2dec3549d317f2d5116f185d19bea8-scss",
				"_8344e6bcc8551f4c88c21183a102908e-scss"
			];
			var EdgeBar;
			for (let i = 0; i < ClassArray.length; i++) {
				EdgeBar = document.getElementsByClassName(ClassArray[i])[0];
				if (EdgeBar) {
					break;
				}
			}
			if (EdgeBar && EdgeBar.childElementCount !== 0) {
				for (let i = 0; i < EdgeBar.childElementCount; i++) {
					var EdgeOpt = EdgeBar.children[i];
					if (EdgeOpt.name !== "Displaying") {
						if (EdgeOpt.childElementCount > 0 && EdgeOpt.children[0].href
							.search("200204") === -1) {
							EdgeOpt.style.display = "flex";
						}
						EdgeOpt.name = "Displaying";
					}
				}
				console.log("显示" + currentPage + "页侧栏所有选项");
			}
		},
		live: function(flag) {
			if (!flag) {
				var state = localStorage.getItem("undisturbWatch");
				let btn = document.getElementById("undisturbWatchBtn");
				if (state === null || state === undefined) {
					state = btn.getAttribute("state-data");
					localStorage.setItem("undisturbWatch", state);
				}
				if (state !== btn.getAttribute("state-data")) {
					btn.click();
				}
				return null;
			}
			if (set.get("undisturbWatch") === "auto") {
				let btn = document.getElementById("undisturbWatchBtn");
				if (btn) {
					btn.click();
				} else {
					console.log("沉浸式观看按钮丢失，自动进入沉浸式观看模式失败");
				}
			}
		}
	};

	var main = {
		others: function() {
			init.main();
		},
		appshare: function() {
			init.main();
			Timer = setInterval(function() {
				createBtn.share();
				createBtn.change();
			}, 200);
			console.log("抖音视频下载器(" + Page + "页)启动,定时器(id:" + Timer + ")开启");
		},
		home: function() {
			init.main();
			Timer = setInterval(function() {
				var a = document.querySelectorAll(".aKgCOHgk");
				if (a.length !== 0) {
					for (let i = 0; i < a.length; i++) {
						let id = a[i].parentElement.querySelector("a");
						if (id) {
							id = id.href;
							id = id.slice(id.search("video/") + 6).split("/")[0].split("?")[0];
						} else {
							id = "";
						}
						createBtn.list(a[i], id);
					}
				}
				createBtn.change();
			}, 500);
			console.log("抖音视频下载器(" + Page + "页)启动,定时器(id:" + Timer + ")开启");
		},
		recommend: function() {
			init.main();
			var BtnList, newBtnBox, presentObj, videoURL, btnObj;
			Timer = setInterval(function() {
				//document.querySelector('div[data-e2e="video-play-more"]')
				BtnList = document.getElementsByClassName("se14DHcz");
				if (BtnList.length > 0) {
					presentObj = document.getElementsByClassName(
						"swiper-slide swiper-slide-active")[0];
					var videoID = presentObj.getElementsByClassName(
						"xgplayer-icon content-wrapper")[0].href;
					videoID = videoID.split("video/")[1].split("/")[0].split("?")[0];
					createBtn.swiper(BtnList[0], videoID);
					createBtn.change();
				}
				createBtn.link();
			}, 200);
			console.log("抖音视频下载器(" + Page + "页)启动,定时器(id:" + Timer + ")开启");
		},
		follow: function() {
			this.recommend();
		},
		hot: function() {
			this.home();
		},
		channel: function() {
			this.home();
		},
		detail: function() {
			init.main();
			Timer = setInterval(function() {
				var BtnList = document.getElementsByClassName("a30pLzw4")[0];
				BtnList = BtnList.children[0];
				var id = location.href;
				id = id.slice(id.search("video/") + 6);
				id = id.split("/")[0].split("?")[0];
				if (BtnList && BtnList.children[2] && id) {
					createBtn.video(BtnList, id);
				}
				createBtn.change();
				createBtn.link();
			}, 200);
			console.log("抖音视频下载器(" + Page + "页)启动,定时器(id:" + Timer + ")开启");
		},
		vsdetail: function() {
			init.main();
			Timer = setInterval(function() {
				var BtnList = document.getElementsByClassName("XHB4XbHj")[0];
				if (BtnList) {
					BtnList = BtnList.children[0];
				}
				var id = location.href;
				id = id.slice(id.search("vsdetail/") + 9);
				id = id.split("/")[0].split("?")[0];
				if (BtnList && BtnList.children[0] && id) {
					createBtn.video(BtnList, id, true);
				}
				createBtn.change();
				createBtn.link();
			}, 200);
			console.log("抖音视频下载器(" + Page + "页)启动,定时器(id:" + Timer + ")开启");
		},
		search: function() {
			init.main();
			Timer = setInterval(function() {
				var a = document.querySelectorAll("._2NJWgK5p");
				if (a.length !== 0) {
					for (let i = 0; i < a.length; i++) {
						let id = a[i].parentElement.querySelector("a");
						if (id) {
							id = id.href;
							id = id.slice(id.search("video/") + 6).split("/")[0].split("?")[0];
						} else {
							id = "";
						}
						createBtn.list(a[i], id);
					}
				}
				createBtn.change();
			}, 500);
			console.log("抖音视频下载器(" + Page + "页)启动,定时器(id:" + Timer + ")开启");
		},
		user:function(){
			init.main();
		},
		livehome: function() {
			init.main();
		},
		livedetail: function() {
			init.main();
			var flag = true;
			Timer = setInterval(function() {
				var beforeBtn = document.getElementsByClassName("VPz4-306")[0];
				if (beforeBtn) {
					if (!document.getElementById("undisturbWatchBtn")) {
						var undisturbWatchBtn = createBtn.live.undisturb();
						beforeBtn.parentElement.insertBefore(undisturbWatchBtn, beforeBtn);
						init.live(flag);
						flag = false;
					}
					if (!document.getElementById("newBtnDownload")) {
						var downloadBtn = createBtn.live.download();
						beforeBtn.parentElement.insertBefore(downloadBtn, beforeBtn);
					}
				}
				createBtn.live.share();
			}, 200);
			console.log("抖音视频下载器(" + Page + "页)启动,定时器(id:" + Timer + ")开启");
		},
		match: function() {
			switch (currentPage) {
				case "others":
					this.others();
					break;
				case "appshare":
					this.appshare();
					break;
				case "home":
					this.home();
					break;
				case "recommend":
					this.recommend();
					break;
				case "follow":
					this.follow();
					break;
				case "hot":
					this.hot();
					break;
				case "channel":
					this.channel();
					break;
				case "detail":
					this.detail();
					break;
				case "vsdetail":
					this.vsdetail();
					break;
				case "search":
					this.search();
					break;
				case "user":
					this.user();
					break;
				case "livehome":
					this.livehome();
					break;
				case "livedetail":
					this.livedetail();
					break;
				default:
					console.log("当前页无匹配功能,启动默认功能(others页)");
					this.others();
			}
		},
		popup: function() {
			//普通弹窗，直接无脑屏蔽
			var ClassArray = ["login-guide-container", "athena-survey-widget",
				"athena-survey-widget  ltr desktop-normal theme-flgd   "
			];
			var HideNum = 0;
			var PopObj;
			for (let i = 0; i < ClassArray.length; i++) {
				PopObj = document.getElementsByClassName(ClassArray[i])[0];
				if (PopObj && PopObj.style.display !== "none") {
					PopObj.style.display = "none";
					HideNum += 1;
				}
			}
			//登录弹窗，不能无脑屏蔽，需要考虑情况		
			try {
				PopObj = document.getElementById("login-pannel").parentElement.parentElement;
			} catch (e) {
				PopObj = false;
			}
			if (loginPopupFlag === true) {
				if (PopObj && PopObj.style.display !== "none") {
					PopObj.style.display = "none";
					HideNum += 1;
				}
			} else {
				if (PopObj && PopObj.style.display === "none") {
					PopObj.style.display = "";
				}
				if (!PopObj && loginPopupFlag === "wait") {
					loginPopupFlag = true;
					console.log("用户取消登录或登录成功");
				}
			}
			//控制台输出相关信息
			if (HideNum > 0) {
				console.log(currentPage + "页检测到" + HideNum + "个非必要弹窗,已隐藏!");
			}
		},
		jump: function() {
			var currentUA = tools.checkUA();
			if (pastUA !== currentUA) {
				pastUA = currentUA;
				if (currentUA === "pc") {
					var currentHost = location.hostname;
					var currentPath = location.pathname;
					var newUrl = "";
					if (currentHost.search("douyin.com") !== -1) {
						if (currentPath.search("/share/video/") !== -1) {
							newUrl = "https://www.douyin.com" + currentPath.replace("/share", "");
						} else if (currentPath === "/home") {
							newUrl = "https://www.douyin.com";
						}
					}
					if (newUrl !== "") {
						var Res = confirm("点击确认跳转PC版页面");
						if (Res) {
							location.href = newUrl;
						} else {
							console.log("用户取消跳转PC版页面");
						}
					}
				}
			}
		},
		judge: function() {
			if (!/video|live/i.test(tools.identifySite("type")) || currentPage === "follow") {
				loginPopupFlag = false;
				return false;
			}
			if (loginTimer !== -1) {
				clearInterval(loginTimer);
				loginTimer = -1;
			}
			switch (set.get("loginPopup")) {
				case "hide":
					loginPopupFlag = true;
					break;
				case "display":
					loginPopupFlag = false;
					break;
				default:
					loginPopupFlag = true;
					loginTimer = setInterval(function() {
						init.login();
					}, 500);
					break;
			}
		}
	}

	var set = {
		baseData: {
			"video": {
				"fileName": "whole",
				"diyFileName": "",
				"download": "auto",
				"loginPopup": "display",
				"fetchType": "1",
				"videoQuality": "default"
			},
			"live": {
				"undisturbWatch": "manual",
				"hideList": {
					"searchBar": true,
					"liveCategory": true,
					"relativeLive": true,
					"buttomMessage": true,
					"chatWindow": false,
					"edgeTool": false
				},
				"loginPopup": "display",
				"download": "default",
				"shareUrl": "short",
				"fetchType": "1"
			}
		},
		baseOpt: {
			"video": {
				data: [{
					"name": "当前版本",
					"type": "text",
					"key": "version",
					"value": "v1.37.3"
				}, {
					"name": "视频文件名",
					"type": "choice",
					"key": "fileName",
					"value": [{
						"name": "完整(默认)",
						"key": "whole",
						"description": "文件自动重命名为：视频名@作者名.mp4"
					}, {
						"name": "仅视频名",
						"key": "videoName",
						"description": "文件自动重命名为：视频名.mp4"
					}, {
						"name": "视频ID",
						"key": "id",
						"description": "视频ID为视频详情页地址后缀那一串数字。文件自动重命名为：视频ID.mp4"
					}]
				}, {
					"name": "视频下载",
					"type": "choice",
					"key": "download",
					"value": [{
						"name": "自动下载",
						"key": "auto",
						"description": "脚本调用下载程序，并自动重命名"
					}, {
						"name": "手动下载",
						"key": "manual",
						"description": "需手动下载视频，且手动下载模式下，将关闭自动重命名。下载时需手动更改文件名"
					}]
				}, {
					"name": "视频质量",
					"type": "choice",
					"key": "videoQuality",
					"value": [{
						"name": "默认",
						"key": "default",
						"description": "自动获取视频下载地址，但视频分辨率可能不是最高分辨率"
					}, {
						"name": "1080p",
						"key": "1080p",
						"description": "获取1080p视频。如果没有发现该清晰度视频，自动往下延顺"
					}, {
						"name": "720p",
						"key": "720p",
						"description": "获取720p视频。如果没有发现该清晰度视频，自动往下延顺"
					}, {
						"name": "540p",
						"key": "540p",
						"description": "获取540p视频。如果没有发现该清晰度视频，自动往下延顺"
					}]
				}, {
					"name": "登录弹窗",
					"type": "choice",
					"key": "loginPopup",
					"value": [{
						"name": "自动管理",
						"key": "auto",
						"description": "自动识别场景，根据不同场合选择是否屏蔽登录弹窗"
					}, {
						"name": "直接屏蔽",
						"key": "hide",
						"description": "遇到登录弹窗，直接屏蔽"
					}, {
						"name": "不屏蔽",
						"key": "display",
						"description": "遇到登录弹窗，不进行任何操作"
					}]
				}, {
					"name": "刷新按钮",
					"type": "text",
					"key": "refreshDownload",
					"value": "<a style=\"text-decoration:none;\" href=\"javascript:alert('当前页不可用');\">点击重载链接</a>"
				}, {
					"name": "批量导出",
					"type": "text",
					"key": "massiveExport",
					"value": "<a style=\"text-decoration:none;\" href=\"javascript:alert('当前页不可用');\">点击导出地址</a>"
				}, {
					"name": "反馈建议",
					"type": "text",
					"key": "feedback",
					"value": "<a style='text-decoration:none;' href='https://greasyfork.org/zh-CN/scripts/431344/feedback' target='_blank'>点击前往反馈</a>"
				}, {
					"name": "更新日志",
					"type": "text",
					"key": "updateLog",
					"value": "<a style='text-decoration:none;' href='https://github.com/IcedWatermelonJuice/Douyin-Video-Downloader#更新日志' target='_blank'>点击前往查看</a>"
				}]
			},
			"live": {
				data: [{
					"name": "当前版本",
					"type": "text",
					"key": "version",
					"value": "v1.37.3"
				}, {
					"name": "沉浸观看",
					"type": "choice",
					"key": "undisturbWatch",
					"value": [{
						"name": "自动启动",
						"key": "auto",
						"description": "进入直播间后自动进入沉浸式观看模式，屏蔽不必要的内容"
					}, {
						"name": "手动启动",
						"key": "manual",
						"description": "需手动点击沉浸式观看按钮，从而屏蔽不必要的内容"
					}]
				}, {
					"name": "屏蔽列表",
					"type": "check",
					"key": "hideList",
					"value": [{
						"name": "顶部搜索",
						"key": "searchBar",
						"description": "位于页面顶部的抖音LOGO、搜索栏、登录图标等"
					}, {
						"name": "直播分类",
						"key": "liveCategory",
						"description": "位于页面顶部的直播分类导航栏"
					}, {
						"name": "相关直播",
						"key": "relativeLive",
						"description": "位于页面底部的相关直播模块"
					}, {
						"name": "底部信息",
						"key": "buttomMessage",
						"description": "位于页面底部的网站信息、相关链接等"
					}, {
						"name": "聊天窗口",
						"key": "chatWindow",
						"description": "位于直播窗口边上的聊天窗口。隐藏聊天窗口不影响直播窗口正常播放弹幕"
					}, {
						"name": "侧边工具",
						"key": "edgeTool",
						"description": "位于页面右下角的工具栏（包括脚本设置入口）"
					}]
				}, {
					"name": "登录弹窗",
					"type": "choice",
					"key": "loginPopup",
					"value": [{
						"name": "自动管理",
						"key": "auto",
						"description": "自动识别场景，根据不同场合选择是否屏蔽登录弹窗"
					}, {
						"name": "直接屏蔽",
						"key": "hide",
						"description": "遇到登录弹窗，直接屏蔽"
					}, {
						"name": "不屏蔽",
						"key": "display",
						"description": "遇到登录弹窗，不进行任何操作"
					}]
				}, {
					"name": "提取地址",
					"type": "choice",
					"key": "download",
					"value": [{
						"name": "默认地址",
						"key": "default",
						"description": "提取当前直播间画面采用的推流地址。一般情况下，抖音直播推流都为m3u8，少部分为flv。flv延迟一般比m3u8低一点点"
					}, {
						"name": "m3u8地址",
						"key": "m3u8",
						"description": "提取m3u8格式直播原画画质的推流地址。m3u8格式视频下载麻烦（需要专门下载器，如idm），播放方便（支持m3u8的播放器非常多），播放延迟稍高"
					}, {
						"name": "flv地址",
						"key": "flv",
						"description": "提取flv格式直播原画画质的推流地址。flv格式视频下载容易（可通过浏览器直接下载），播放比较麻烦（flv播放器比较少），播放延迟几乎为0"
					}]
				}, {
					"name": "分享链接",
					"type": "choice",
					"key": "shareUrl",
					"value": [{
						"name": "原链接",
						"key": "default",
						"description": "直接将直播间地址（长链接）导出到剪贴板"
					}, {
						"name": "短链接",
						"key": "short",
						"description": "将直播间地址通过第三方接口转为短链接再导出"
					}]
				}, {
					"name": "反馈建议",
					"type": "text",
					"key": "feedback",
					"value": "<a style='text-decoration:none;' href='https://greasyfork.org/zh-CN/scripts/431344/feedback' target='_blank'>点击前往反馈</a>"
				}, {
					"name": "更新日志",
					"type": "text",
					"key": "updateLog",
					"value": "<a style='text-decoration:none;' href='https://github.com/IcedWatermelonJuice/Douyin-Video-Downloader#更新日志' target='_blank'>点击前往查看</a>"
				}]
			}
		},
		data: {},
		opt: {},
		rootClass: "downloaderRootCss-0",
		get: function(key) {
			if (key) {
				return this.data[key];
			} else {
				return this.data;
			}
		},
		edit: function(key, value) {
			this.data[key] = value;
			console.log(key + ":" + value);
		},
		save: function(data) {
			data = JSON.stringify(data);
			try {
				JSON.parse(data); //确保data是JSON字符串
			} catch (e) {
				return false;
			}
			localStorage.setItem("downloaderSettingData", data);
		},
		init: function(type) {
			if (!type) {
				type = tools.identifySite("type");
			}
			switch (type) {
				case "share":
					this.data = $.extend(true, {}, this.baseData.video);
					this.opt = $.extend(true, {}, this.baseOpt.video);
					break;
				case "video":
					this.rootClass = "downloaderRootCss-1";
					this.data = $.extend(true, {}, this.baseData.video);
					this.opt = $.extend(true, {}, this.baseOpt.video);
					break;
				case "live":
					this.rootClass = "downloaderRootCss-1";
					this.data = $.extend(true, {}, this.baseData.live);
					this.opt = $.extend(true, {}, this.baseOpt.live);
					break;
				default:
					this.data = null;
					this.opt = null;
					break;
			}
			if (!this.data || !this.opt) {
				return false;
			}
			var localData = localStorage.getItem("downloaderSettingData");
			var newData;
			if (localData) {
				localData = JSON.parse(localData);
				this.data = $.extend(true, {}, set.get(), localData);
			} else {
				this.save(this.data);
			}
		},
		reset: function() {
			var backupData;
			if (/livehome|livedetail/i.test(currentPage)) {
				backupData = $.extend(true, {}, set.baseData.live);
			} else {
				backupData = $.extend(true, {}, set.baseData.video);
			}
			set.data = $.extend(true, {}, backupData);
			set.close();
			set.create();
		},
		apply: function() {
			var opts = document.getElementsByClassName("downloaderSettingPage-opt");
			var obj, key, value;
			for (let i = 0; i < opts.length; i++) {
				if (opts[i].getAttribute("opt-type") === "choice") {
					obj = opts[i].getElementsByTagName("select")[0];
					key = obj.parentElement.getAttribute("opt-key");
					value = false;
					for (let i = 0; i < obj.childElementCount; i++) {
						if (obj.value === obj.children[i].value) {
							value = obj.children[i].getAttribute("choice-key");
							break;
						}
					}
					if (key && value) {
						set.edit(key, value);
					}
				} else if (opts[i].getAttribute("opt-type") === "check") {
					obj = opts[i].getElementsByTagName("form")[0];
					key = obj.parentElement.getAttribute("opt-key");
					obj = obj.getElementsByTagName("input");
					value = set.get(key);
					for (let i = 0; i < obj.length; i++) {
						value[obj[i].value] = obj[i].checked;
					}
					if (key && value) {
						set.edit(key, value);
					}
				}
			}
			set.save(set.get());
			var msg = "是否立即刷新下载按钮以应用设置？";
			if (confirm(msg)) {
				set.extraEventList.refresh(true);
			}
		},
		close: function() {
			document.getElementById("downloaderSettingPage-page").remove();
		},
		create: function() {
			if (!this.data || !this.opt) {
				return false;
			}
			var page = document.createElement("div");
			var box = document.createElement("div");
			page.id = "downloaderSettingPage-page";
			box.id = "downloaderSettingPage-box";
			var bodyWidth = document.body.clientWidth;
			var bodyHeight = document.body.clientHeight;
			var pageWidth = bodyWidth - 40;
			var pageHeight = bodyHeight - 40;
			pageWidth = 360 < pageWidth ? 360 : pageWidth;
			pageHeight = 360 < pageHeight ? 360 : pageHeight;
			var pageLeft = (bodyWidth - pageWidth) / 2;
			var pageTop = (bodyHeight - pageHeight) / 2;
			page.classList.add(set.rootClass);
			page.style = "width:" + pageWidth + "px;height:" + pageHeight + "px;position:fixed;left:" +
				pageLeft + "px;top:" + pageTop + "px;";
			box.appendChild(set.createHead());
			box.appendChild(set.createBody());
			box.appendChild(set.createFoot());
			page.appendChild(box);
			this.addEvent(page);
			document.body.appendChild(page);
		},
		createHead: function() {
			var head = document.createElement("div");
			head.id = "downloaderSettingPage-head";
			head.innerHTML = `<div class="head-logoImg" onclick=function close(){$("#downloaderSettingPage-btn-close").click()}></div><div class="head-logoText">抖音视频下载器脚本设置</div>`;
			return head;
		},
		createBody: function() {
			var body = document.createElement("div");
			body.id = "downloaderSettingPage-body";
			var data = this.opt.data;
			for (let i in data) {
				body.appendChild(this.createOpt(data[i]));
			}
			var msg = document.createElement("div");
			msg.innerHTML =
				"更多功能，请关注后续版本！<br>欢迎大家在“<a href='https://greasyfork.org/zh-CN/scripts/431344' target='_blank' style='color:red;text-decoration:none'>油叉</a>”或“<a href='https://github.com/IcedWatermelonJuice/Douyin-Video-Downloader' target='_blank' style='color:red;text-decoration:none'>gayhub</a>”上反馈建议。";
			msg.style = "color:red;";
			body.appendChild(msg);
			return body;
		},
		createFoot: function() {
			var foot = document.createElement("div");
			foot.id = "downloaderSettingPage-foot";
			foot.appendChild(this.createBtn("reset"));
			foot.appendChild(this.createBtn("apply"));
			foot.appendChild(this.createBtn("close"));
			return foot;
		},
		createOpt: function(data) {
			var opt = document.createElement("div");
			var title = document.createElement("div");
			var content = document.createElement("div");
			var aTemp;
			opt.setAttribute("class", "downloaderSettingPage-opt");
			opt.setAttribute("opt-type", data.type);
			title.style = "width:100px;margin:0 8px 8px 0;display:inline-block";
			title.innerText = data.name;
			content.style = "width:100px;margin:0 0 8px 0;display:inline-block;";
			if (data.type === "text") {
				content.setAttribute("opt-key", data.key);
				content.innerHTML = data.value;
				aTemp = content.getElementsByTagName("a");
				for (let i = 0; i < aTemp.length; i++) {
					aTemp[i].style.color = "var(--downloader-color-text)";
				}
			} else if (data.type === "choice") {
				content.setAttribute("opt-key", data.key);
				var choice = data.value;
				var choiceValue = set.get(data.key);
				var choiceHtml = "<select class='downloaderSettingPage-select'>";
				for (let i in choice) {
					choiceHtml += "<option choice-key='" + choice[i].key + "'";
					if (choiceValue === choice[i].key) {
						choiceHtml += " selected='selected'";
					}
					choiceHtml += " title='" + choice[i].description + "'>" + choice[i].name +
						"</option>";
				}
				choiceHtml += "</select>";
				content.innerHTML = choiceHtml;
			} else if (data.type === "check") {
				content.style.width = "calc(100% - 120px)";
				content.style.display = "inline-flex";
				content.setAttribute("opt-key", data.key);
				var check = data.value;
				var checkValue = set.get(data.key);
				var checkHtml =
					"<form style='width: 100%;color: var(--downloader-color-text);'>";
				for (let i in check) {
					checkHtml += "<div style='display:inline-block;margin-right:5px;' title='" + check[i]
						.description + "'><input type='checkbox' value='" + check[i].key + "'";
					if (checkValue[check[i].key]) {
						checkHtml += " checked='checked'";
					}
					checkHtml += "><span>" + check[i].name + "</span></div>";
				}
				checkHtml += "</form>";
				content.innerHTML = checkHtml;
			} else {
				return null;
			}
			opt.appendChild(title);
			opt.appendChild(content);
			return opt;
		},
		createBtn: function(type) {
			var text, fn, btn;
			switch (type) {
				case "reset":
					text = "重置数据";
					fn = set.reset;
					break;
				case "apply":
					text = "保存并应用";
					fn = set.apply;
					break;
				case "close":
					text = "关闭设置";
					fn = set.close;
					break;
				default:
					break;
			}
			if (text && fn) {
				btn = document.createElement("span");
				btn.id = "downloaderSettingPage-btn-" + type;
				btn.setAttribute("class", "downloaderSettingPage-btn");
				var box = document.createElement("div");
				box.innerText = text;
				box.onclick = fn;
				btn.appendChild(box);
			}
			return btn;
		},
		addEvent: function(page) {
			//导出
			var exportBtn = page.querySelectorAll("div[opt-key=massiveExport]")[0];
			if (exportBtn) {
				exportBtn = exportBtn.getElementsByTagName("a")[0];
				exportBtn.href = "javascript:void(0)";
				exportBtn.addEventListener("click", function() {
					set.extraEventList.export();
				})
			}
			//刷新
			var refreshBtn = page.querySelectorAll("div[opt-key=refreshDownload]")[0];
			if (refreshBtn) {
				refreshBtn = refreshBtn.getElementsByTagName("a")[0];
				refreshBtn.href = "javascript:void(0)";
				refreshBtn.addEventListener("click", function() {
					set.extraEventList.refresh();
				})
			}
			//质量
			var qualityBtn = page.querySelectorAll("div[opt-key=videoQuality]")[0];
			if (qualityBtn && currentPage === "detail") {
				qualityBtn.removeAttribute("opt-key");
				qualityBtn.innerHTML = "默认最高质量";
				qualityBtn.style =
					"width: 100px;margin: 0px 0px 8px;display: inline-block;border: 1px solid var(--downloader-color-text);padding-left: 4px;cursor: pointer";
				qualityBtn.parentElement.setAttribute("opt-type", "text");
				qualityBtn.addEventListener("click", function() {
					alert("默认获取最高分辨率视频，不可更改");
				})
			} else if (qualityBtn && currentPage === "vsdetail") {
				qualityBtn.removeAttribute("opt-key");
				qualityBtn.innerHTML = "默认分辨率";
				qualityBtn.style =
					"width: 100px;margin: 0px 0px 8px;display: inline-block;border: 1px solid var(--downloader-color-text);padding-left: 4px;cursor: pointer";
				qualityBtn.parentElement.setAttribute("opt-type", "text");
				qualityBtn.addEventListener("click", function() {
					alert("请通过官方播放器调整视频分辨率");
				})
			}
		},
		extraEventList: {
			export: function() {
				let exportData = "";
				let allDownloadBtn = document.getElementsByClassName(btn_class);
				for (let i = 0; i < allDownloadBtn.length; i++) {
					let data = allDownloadBtn[i].getAttribute("download-data");
					if (data) {
						data = tools.parseData(data);
						data = data.url;
						data = (i + 1) !== allDownloadBtn.length ? (data + ",") : data;
						exportData += data;
					}
				}
				tools.toClipboard(exportData, "视频地址已批量导出到剪贴板");
			},
			refresh: function(noAlert) {
				if (!noAlert) {
					alert("刷新下载按钮需要一定的时间，点击确定开始重载链接");
				}
				var downloadBtn = document.querySelectorAll("." + btn_class);
				for (let i = 0; i < downloadBtn.length; i++) {
					downloadBtn[i].remove();
				}
			}
		}
	}

	var Timer = -1;
	var loginTimer = -1;
	var Page = "others";
	var currentPage = "others";
	var pastUA = "";
	var loginPopupFlag = false;
	var errorNum = 0;
	if(!tools.jqReady()){
		return false;
	}
	tools.hotKey();
	var checkTimer = setInterval(function() {
		currentPage = tools.identifySite();
		main.jump();
		main.popup();
		if (Page !== currentPage) {
			if (Page !== "others") {
				console.log("页面切换(上一页为" + Page + "页)");
			}
			main.match();
		}
	}, 200);
	console.log("抖音视频下载器(URL监听与弹窗检测)启动,定时器(id:" + checkTimer + ")开启");
	downloadUserPage();
})();