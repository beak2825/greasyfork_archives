// ==UserScript==
// @name              去视频广告
// @version           1.0.3
// @description       去国内视频片头广告
// @match             *://*/*

// @require           https://cdn.jsdelivr.net/npm/jquery-tamper@1.0.1/jquery.min.js
// @grant             unsafeWindow
// @grant             GM_openInTab
// @grant             GM.openInTab
// @grant             GM_getValue
// @grant             GM.getValue
// @grant             GM_setValue
// @grant             GM.setValue
// @grant             GM_xmlhttpRequest
// @grant             GM.xmlHttpRequest
// @grant             GM_registerMenuCommand
// @license           GPL License
// @charset		      UTF-8
// @namespace https://greasyfork.org/users/13363
// @downloadURL https://update.greasyfork.org/scripts/440311/%E5%8E%BB%E8%A7%86%E9%A2%91%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/440311/%E5%8E%BB%E8%A7%86%E9%A2%91%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function() {
        var closeBtn = document.querySelector('.cupid-pause-max-close-btn');
        if (closeBtn) {
            closeBtn.click();
        }
    }, 100);
})();


(function () {
	'use strict';
	var $ = $ || window.$;

	//如果本地值不能满足需求，可自定义添加接口到此处
	//注意数据格式
	//category=1:全网VIP解析内嵌页播放
	//category=2:全网VIP解析新建页面播放
	var customizeInterfaceList=[
	];

	//视频vip解析收集自脚本：
	//https://greasyfork.org/zh-CN/scripts/390952
	//https://greasyfork.org/zh-CN/scripts/398195

	//默认值，当网络请求出现错误时使用此值
	var originalInterfaceList = [
	];
	var playerNodes = [
	];

	let newOriginalInterfaceList = originalInterfaceList;
	try{
		newOriginalInterfaceList = customizeInterfaceList.concat(originalInterfaceList);
	}catch(e){
		console.log("自定义解析接口错误，注意数据格式....");
	}

	/**
	 * 共有方法
	 */
	function commonFunction(){
		this.GMgetValue = function (name, value) { //得到存在本地的数据
			if (typeof GM_getValue === "function") {
				return GM_getValue(name, value);
			} else {
				return GM.getValue(name, value);
			}
		};
		this.GMsetValue = function(name, value){
			if (typeof GM_setValue === "function") {
				return GM_setValue(name, value);
			} else {
				return GM.setValue(name, value);
			}
		};
		this.GMaddStyle = function(css){
			var myStyle = document.createElement('style');
			myStyle.textContent = css;
			var doc = document.head || document.documentElement;
			doc.appendChild(myStyle);
		};
		this.GMopenInTab = function(url, open_in_background){
			if (typeof GM_openInTab === "function") {
				GM_openInTab(url, open_in_background);
			} else {
				GM.openInTab(url, open_in_background);
			}
		};
		this.addScript = function(url){
			var s = document.createElement('script');
			s.setAttribute('src',url);
			document.body.appendChild(s);
		};
		this.randomNumber = function(){
			return Math.ceil(Math.random()*100000000);
		};
		this.request = function(mothed, url, param){
			return new Promise(function(resolve, reject){
				GM_xmlhttpRequest({
					url: url,
					method: mothed,
					data:param,
					onload: function(response) {
						var status = response.status;
						var playurl = "";
						if(status==200||status=='200'){
							var responseText = response.responseText;
							resolve({"result":"success", "data":responseText});
						}else{
							reject({"result":"error", "data":null});
						}
					}
				});
			})
		};
	}
	//全局统一变量
	const commonFunctionObject = new commonFunction();

	/**
	 * 超级解析助手
	 * @param {Object} originalInterfaceList
	 * @param {Object} playerNodes
	 */
	function superVideoHelper(originalInterfaceList, playerNodes){
		this.originalInterfaceList = originalInterfaceList;
		this.node = "";
		this.elementId = Math.ceil(Math.random()*100000000);
		for(var i in playerNodes) { //获得窗口ID
			if (playerNodes[i].url == window.location.host) {
				this.node = playerNodes[i].node;
				break;
			}
		}
		this.isRun = function(){ //判断是否运行
			var urls = ["iqiyi.com","v.qq.com","youku.com", "le.com","tudou.com","mgtv.com","sohu.com", "acfun.cn","bilibili.com","baofeng.com","pptv.com"];
			for(var i=0; i<urls.length;i++){
				if((window.location.host!=="bilibili.com" && window.location.host.indexOf(urls[i])!=-1)
					|| (window.location.host==="bilibili.com" && window.location.href.indexOf("bangumi/play")!=-1)){
					return true;
				}
			}
			return false;
		};
		this.innerParse = function(url) { //内嵌解析
			$("#iframe-player").attr("src", url);
		};
		this.addHtmlElements = function(){
			var vipVideoImageBase64 =`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAC9klEQVRoQ+2ZPWgVQRDH/7/CWqOIYOFHFbRSjJhGMGDpByoIago70cqvUtQgdipWFqawMWghGIidhcHKQAJqEURBRfED1CCCjc3IPu4em31775J7d3m8cAtX3O7szP7nPzszx6EeH/T4+VUD6DaDTQbMbE+3D7MY+8Ckkw8BPFuMki7KDtUAuuh9Z3oZMtBljxY2X9eBwq4raWPNQEmOLKxm+TBgZqsknQ1dAVzNco+ZhWsm6ZakHZLC1mQyrZ5OX2RvzMxnSa8lzQJ/YwLzGDCze5JOeoI/gbVtAMxJ6vPW7wKnkr4qbEuaxccDcGWBsfNV0mjMmSGAg5LGA6XbgFehITPbLel5MN84ZAUAUjMPgWO+zZY7YGbvJW0OvRoB8EjSEW9+BhhIvOvCp0wGfPPbgZfpRAzATUnn56GEmJyLd39cBNxeF99FADTa42BskuQef4wDh9oB2CXpRbDpMPA4nTOz05LuBDLrgW+dAACGIkxfkHTDm/8DrMwEkBxgOskkqdwEcMAD4GLf3YF0PACOe+uFGMgA4Bj4EAAbAGbcXLQOmNklSdeCTRuBT2bWL+lNsLYfeFIRgH2SJgJ7GwCXYjMBrJb0K9jUiHEzG5F02VubA9b4skXvQMiAmW2VdFSSn24/As0kk1mJzeyppL3ewaaBnWY2K2mLNz8S5ueCAMLwz3q/DZxreweSe3BC0v1Ai7tkYXrsB96WwMBCAfQBv3MBJCD+SVrhaXaZ54z3PgUMhpYrZKCF7bbNnJk5BhwT6fghyW8thoGxigE4my6tXwemQlt5AGI1oamDSIFLmCuURiW5BOGPL8C7drGV206b2XdJ6yJKxoDhmPKCIeS61ZZClncxFgLAtcyxrnEwRmknDFQFIFYTWnJ/CVmoGgYSj7Z81OR86Lg7sOgPmnY6s0IpN4TyYrDb6zWAmoEOPVCHUIcO7Hh7/YemYxcWU7AMf3BkNGDF/FP9rkwGqjddkoWWv5Ql6V1yNXUdWHKXBwZ7noH/dP+HQNqheToAAAAASUVORK5CYII=`;
			var tvImageBase64=`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACvUlEQVRoQ+2ZPYwNURTHf/9Gp/ARCpFYoVDZRCMqGgrRKCgoyCZE46MgaNiCRLIhu4WPDaIgkWwhEZHQ0IqPIFGI+AgJsQ0FKnHkbs5s5o2Z9+atmX33JXOb9+Z+nPv/n/+9Z+65I/q8qM/x0xDotYKNAlEpYGa7gC3A/F4DK5j/C3Bb0s2kfXoJmdky4H2kwLOwBiR9CJVpAieBE31CYFhSwNuWwMPIyKxP4SlFYIOkKEiYWQD/oCHQqyXVKJD2vJldB5aUUCOEubuSJswsRIzPksbzxpnZOmAjcEHS12yfyhRwIN2E2mHgI3DFQW2SdD/jkEXAM3fKdHTJ9KluE5vZCLAm46UkxKWjVlAgEFgIPPb+NyTtzIA7Bpz2uiFJV2tToED+EN6mCEjKPRyaWXj1b/fxqyW9DP/NbC7wHFgOTEpaXDBHdQrkeKcMgc3AHR87KumgEwi/57z+qKQzURJwsAnRb8AA8BMISqwCvgMLJP2JmcAQcNkBHgF+AOf9eUTS4aLIVlkUmukecAXm+HoPHn/jCgwCv4IikiajJuAkjgOnMkDHJB1o916JQgEnsBR4AcxzwL+BQUmv+oKAkxgF9jvgi5L2tQPvY2oNo0kidE3S7hJgVgBjvolD6HxXYkx9BBIP1Zk71LoHOnmvivaGQBVe/B8bM1UgnCRjKuljfKmkPibwWSy5BEJGdC9m1ClsayU9Cs8t53dPF3dETuKWpK0Jxn8SEDML+e7KCki03OMAVdwxfZL0No2tluv1dlGjAse0mGgI5Hk0OgX86j0cqMIVfC7mnMqp22Mv3b5TngBPJYXvAW1LqSVkZpeAPZ2MVdw+IWlbJ5tlCVgnQ3W0F13TdB2FzOwscKgOkG1sjkva22nOUgoEI74PivZAp3m6bX9dZv0Ho6UJdItgtvo3BGbL00XzNAr0WoG/02m4QKQE53EAAAAASUVORK5CYII=`;
			var category_1_html = "";
			var category_2_html = "";
			this.originalInterfaceList.forEach((item, index) => {
				if (item.category === "1") {
					category_1_html += "<li title='"+item.name+"' data-index='"+index+"'>" + item.name + "</li>";
				}
				if (item.category === "2") {
					category_2_html += "<li title='"+item.name+"' data-index='"+index+"'>" + item.name + "</li>";
				}
			});

			//获得自定义位置
			var left = 0;
			var top = 100;
			var Position = commonFunctionObject.GMgetValue("Position_" + window.location.host);
			if(!!Position){
				left = Position.left;
				top = Position.top;
			}
			var cssMould = `#vip_movie_box`+this.elementId+` {cursor:pointer; position:fixed; top:` + top + `px; left:` + left + `px; width:0px; z-index:2147483647; font-size:16px; text-align:left;}
							#vip_movie_box`+this.elementId+` .item_text {}
							#vip_movie_box`+this.elementId+` .item_text .img_box{width:26px; height:35px;line-height:35px;text-align:center;background-color:#E5212E;}
							#vip_movie_box`+this.elementId+` .item_text .img_box >img {width:20px; display:inline-block; vertical-align:middle;}
							#vip_movie_box`+this.elementId+` .vip_mod_box_action {display:none; position:absolute; left:26px; top:0; text-align:center; background-color:#272930; border:1px solid gray;}
							#vip_movie_box`+this.elementId+` .vip_mod_box_action li{border-radius:2px; font-size:12px; color:#DCDCDC; text-align:center; width:60px; line-height:21px; float:left; border:1px solid gray; padding:0 4px; margin:4px 2px;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;-o-text-overflow:ellipsis;}
							#vip_movie_box`+this.elementId+` .vip_mod_box_action li:hover{color:#E5212E; border:1px solid #E5212E;}

							#vip_movie_box`+this.elementId+` li.selected{color:#E5212E; border:1px solid #E5212E;}


							#vip_movie_box`+this.elementId+` .selected_text {margin-top:5px;}
							#vip_movie_box`+this.elementId+` .selected_text .img_box{width:26px; height:35px;line-height:35px;text-align:center;background-color:#E5212E;}
							#vip_movie_box`+this.elementId+` .selected_text .img_box >img {width:20px; height:20px;display:inline-block; vertical-align:middle;}
							#vip_movie_box`+this.elementId+` .vip_mod_box_selected {display:none;position:absolute; left:26px; top:0; text-align:center; background-color:#F5F6CE; border:1px solid gray;}
							#vip_movie_box`+this.elementId+` .vip_mod_box_selected ul{overflow-y: auto;}
							#vip_movie_box`+this.elementId+` .vip_mod_box_selected li{border-radius:2px; font-size:12px; color:#393AE6; text-align:center; width:95px; line-height:27px; float:left; border:1px dashed gray; padding:0 4px; margin:4px 2px;display:block;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;}
							#vip_movie_box`+this.elementId+` .vip_mod_box_selected li:hover{color:#E5212E; border:1px solid #E5212E;}

							#vip_movie_box`+this.elementId+` .default-scrollbar-55678::-webkit-scrollbar{width:5px; height:1px;}
							#vip_movie_box`+this.elementId+` .default-scrollbar-55678::-webkit-scrollbar-thumb{box-shadow:inset 0 0 5px rgba(0, 0, 0, 0.2); background:#A8A8A8;}
							#vip_movie_box`+this.elementId+` .default-scrollbar-55678::-webkit-scrollbar-track{box-shadow:inset 0 0 5px rgba(0, 0, 0, 0.2); background:#F1F1F1;}
							`
			commonFunctionObject.GMaddStyle(cssMould);


		};
		this.mouseEvent = function(){
			$(".item_text").on("mouseover", () => {
				$(".vip_mod_box_action").show();
			});
			$(".item_text").on("mouseout", () => {
				$(".vip_mod_box_action").hide();
			});
			$(".selected_text").on("mouseover", () => {
				$(".vip_mod_box_selected").show();
			});
			$(".selected_text").on("mouseout", () => {
				$(".vip_mod_box_selected").hide();
			});
			$(".vip_mod_box_action li").each((liIndex, item) => {
				item.addEventListener("click", () => {
					var videoPlayer = $("<div id='iframe-play-div' style='width:100%;height:100%;z-index:1000;'><iframe id='iframe-player' frameborder='0' allowfullscreen='true' width='100%' height='100%'></iframe></div>");
					var index = parseInt($(item).attr("data-index"));
					var category = this.originalInterfaceList[index].category;
					var url = this.originalInterfaceList[index].url + window.location.href;
					if (category==="1") { //内嵌播放....
						if (document.getElementById("iframe-player") == null) {
							var player = $(this.node);
							player.empty();
							player.append(videoPlayer);
						}
						this.innerParse(url);  //把播放链接加入到自定义的div
					}
					if (category==="2"){  //弹窗播放....
						commonFunctionObject.GMopenInTab(url, false);
					}
					//把点击过的标红
					$(".vip_mod_box_action li").removeClass("selected");
					$(item).addClass("selected");
				});
			});
			//右键移动位置
			var movie_box = $("#vip_movie_box"+this.elementId);
			movie_box.mousedown(function(e) {
				if (e.which == 3) {
					e.preventDefault()
					movie_box.css("cursor", "move");
					var positionDiv = $(this).offset();
					var distenceX = e.pageX - positionDiv.left;
					var distenceY = e.pageY - positionDiv.top;

					$(document).mousemove(function(e) {
						var x = e.pageX - distenceX;
						var y = e.pageY - distenceY;
						var windowWidth = $(window).width();
						var windowHeight = $(window).height();

						if (x < 0) {
							x = 0;
						} else if (x >  windowWidth- movie_box.outerWidth(true) - 100) {
							x = windowWidth - movie_box.outerWidth(true) - 100;
						}

						if (y < 0) {
							y = 0;
						} else if (y > windowHeight - movie_box.outerHeight(true)) {
							y = windowHeight - movie_box.outerHeight(true);
						}

						movie_box.css("left", x);
						movie_box.css("top", y);
						commonFunctionObject.GMsetValue("Position_" + window.location.host,{ "left":x, "top":y});
					});
					$(document).mouseup(function() {
						$(document).off('mousemove');
						movie_box.css("cursor", "pointer");
					});
					$(document).contextmenu(function(e) {
						e.preventDefault();
					})
				}
			});
			//点击视频播放界面
			$("#img_box_6667897iio").on("click", function(){
				commonFunctionObject.GMopenInTab();
			});
		};

		//视频广告过滤相关代码借鉴自其它脚本，该部分代码版权归原作者所有！在此感谢
		//借鉴脚本作者：sign
		//地址：https://greasyfork.org/zh-CN/scripts/406849
		//修改：优化了该段代码的逻辑，使可读性更高
		this.videAdemove = function(){
			switch (window.location.host) {
				case 'www.iqiyi.com':
					try{
						unsafeWindow.rate = 0;
						unsafeWindow.Date.now = () => {
							return new unsafeWindow.Date().getTime() + (unsafeWindow.rate += 1000);
						}
						setInterval(() => {
							unsafeWindow.rate = 0;
						}, 600000);
					}catch(e){}
					setInterval(() => {
						try{
							if (document.getElementsByClassName("cupid-public-time")[0] != null) {
								$(".skippable-after").css("display", "block");
								document.getElementsByClassName("skippable-after")[0].click();
							}
							$(".qy-player-vippay-popup").css("display", "none");
							$(".black-screen").css("display", "none");
						}catch(e){}
					}, 500);

					break
				case 'v.qq.com':
					setInterval(() => { //视频广告加速
						try{
							$(".txp_ad").find("txpdiv").find("video")[0].currentTime = 1000;
							$(".txp_ad").find("txpdiv").find("video")[1].currentTime = 1000;
						}catch(e){}
					}, 1000)
					setInterval(() => {
						try{
							var txp_btn_volume = $(".txp_btn_volume");
							if (txp_btn_volume.attr("data-status") === "mute") {
								$(".txp_popup_volume").css("display", "block");
								txp_btn_volume.click();
								$(".txp_popup_volume").css("display", "none");
							}
							//$("txpdiv[data-role='hd-ad-adapter-adlayer']").attr("class", "txp_none");
							$(".mod_vip_popup").css("display", "none");
							$(".tvip_layer").css("display", "none");
							$("#mask_layer").css("display", "none");
						}catch(e){}
					}, 500);

					break
				case 'v.youku.com':
					try{
						window.onload = function () {
							if (!document.querySelectorAll('video')[0]) {
								setInterval(() => {
									document.querySelectorAll('video')[1].playbackRate = 16;
								}, 100)
							}
						}
					}catch(e){}
					setInterval(() => {
						try{
							var H5 = $(".h5-ext-layer").find("div")
							if(H5.length != 0){
								$(".h5-ext-layer div").remove();
								var control_btn_play = $(".control-left-grid .control-play-icon");
								if (control_btn_play.attr("data-tip") === "播放") {
									$(".h5player-dashboard").css("display", "block");
									control_btn_play.click();
									$(".h5player-dashboard").css("display", "none");
								}
							}
							$(".information-tips").css("display", "none");
						}catch(e){}
					}, 500);

					break
				case 'www.mgtv.com':

					break
				case 'tv.sohu.com':
					setInterval(() => {
						try{
							$(".x-video-adv").css("display", "none");
							$(".x-player-mask").css("display", "none");
							$("#player_vipTips").css("display", "none");
						}catch(e){}
					}, 500);

					break
				case 'www.bilibili.com':

					break
			}
		};
		this.start = function(){
			if(this.isRun()){
				let delayTimeMs = 0;
				if(window.location.host.indexOf("www.bilibili.com")!=-1){//如果是哔哩哔哩，则需要延迟加载
					delayTimeMs = 2000;
				}
				setTimeout(()=>{
					this.addHtmlElements();
					this.mouseEvent();
					this.videAdemove();
				}, delayTimeMs);
			}
		};
	};

	//最后统一调用
	try{
		(new superVideoHelper(newOriginalInterfaceList, playerNodes)).start();
	}catch(e){
		console.log("全网VIP解析：error："+e);
	}

})();