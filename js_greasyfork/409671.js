// ==UserScript==
// @name			众里寻她千百度
// @version			5.40
// @author			风风轮舞
// @namespace		https://space.bilibili.com/379335206
// @match			https://www.baidu.com/
// @match			https://www.baidu.com/?bs_nt=1
// @match			https://www.baidu.com/?tn=*
// @description		百度首页深度美化
// @supportURL		https://jq.qq.com/?_wv=1027&k=IMqY916N
// @icon			https://loktindyi.lacus.site/img/Tri.8f789b4f.png
// @run-at			document-idle
// @grant			GM_addStyle
// @grant			GM_setValue
// @grant			GM_getValue
// @grant			GM_deleteValue
// @grant			GM_xmlhttpRequest
// @grant			GM_registerMenuCommand
// @note			5.36 抛弃jQuery
// @note			5.40 归来 适配 优化
// @downloadURL https://update.greasyfork.org/scripts/409671/%E4%BC%97%E9%87%8C%E5%AF%BB%E5%A5%B9%E5%8D%83%E7%99%BE%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/409671/%E4%BC%97%E9%87%8C%E5%AF%BB%E5%A5%B9%E5%8D%83%E7%99%BE%E5%BA%A6.meta.js
// ==/UserScript==

function tri_ready(fn) {
	if (document.readyState !== 'loading') {
		fn();
	} else {
		document.addEventListener('DOMContentLoaded', fn);
	}
}
tri_ready(() => {
	document.body.style.opacity = "0"
	console.time("星凰·众里寻她千百度\n\t本次耗时");
	const TRI_UPDATE_NOTICE = [`<strong>右边缘双击</strong>可打开配置`, 8];
	const IMAGES = [
		"http://g.hiphotos.baidu.com/zhidao/pic/item/8644ebf81a4c510f973523a36b59252dd52aa592.jpg",
		"//www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png",
		"https://loktindyi.lacus.site/img/Tri.8f789b4f.png",
		"https://img.tujidu.com/image/5f8d99dfba42a.jpg"
	];
	const SEASON_LOGO = [
		"https://i0.hdslb.com/bfs/vc/c1e19150b5d1e413958d45e0e62f012e3ee200af.png",
		"https://i0.hdslb.com/bfs/feed-admin/10641bbc5189591221c00958f3458f33798c7caa.png",
		"https://i0.hdslb.com/bfs/archive/9e5f278027ae7f1e1933b6e4002870361da6c20b.png",
		"https://i0.hdslb.com/bfs/archive/f7099702f9903c279197ae3948ced7e1b64eefc0.png"
	];
	const API = [
		"https://api.bilibili.com/x/web-show/page/header?resource_id=142",
		"https://member.bilibili.com/x2/creative/h5/calendar/event?ts=0",
		"https://www.bing.com/HPImageArchive.aspx?format=js&n=1"
	];
	const her = {
		engageSet: true,
		drawIptStyle: false,			//搜索框
		hideSearchBtn: false,			//搜索按钮
		vzin: false,					//维新
		pageTiltle: "众里寻她千百度",	  //标题
		topLeft: false,					//左上角推广
		userList: false,				//右上角用户
		hotNews: false,					//新闻
		inputLenTillTop: 90,			//搜索框位置
		inputFontSize: 20,				//字体大小
		pageBackgroundImg: IMAGES[3],	//背景图片地址
		pageBackgroundImgBing: false,	//必应背景图
		pageBackgroundImgNight: true,	//夜间护眼
		backgroundEndlessNight: false,	//永夜
		replaceLogo: 0,					//logo
		season: 3,						//季节
		cusLogoUrl: "",					//自定义logourl
		tipDeLogo: "",					//logo提示语
		targetDeLogo: false,			//跳转方式
		logoLinksTo: "",				//链接到
		thmColor: [						//fc fo
			"#222c",
			"#4e6ef2"
		]
	};
	const lingvo = {
		set: "配置",
		update: "用户配置升级完成",
		say: "world.say\n\t",
		welcome: "众里寻她千百度：\n\t欢迎来到这个星球。",
		save: "记忆装填中...",
		vzin: "维新开始工作。",
		bing: "壁纸与微软必应同步：\n\t",
		night: "昼夜更替已切换至夜间。",
		endlessNight: "夜间模式保持开启。",
		watchNight: "昼夜更替正在等待夜间降临：19:00-7:00",
		season: "logo同步哔哩哔哩四季：\n\t",
		bili: "logo与哔哩哔哩同步：\n\t",
		custome: "自定义logo：\n\t"
	};
	const you = "USER_CONFIG", me = "ct";
	const TRI_HTML = `
		<input type="button" class="tri-dis btn">
		<div id="tri-fds" class="ts" oninput="document.getElementById('tri-styles').innerHTML=document.getElementById('tri-ell').innerText">
		<input type="button" class="save-btn b-a btn" title="保存" value="保存">
			<fieldset>
				<legend class="fdt">众里寻她千百度</legend>
				<br><br>
				<hr>
				<label>
					<input id="vsearch" type="checkbox"> 搜索框优化 &nbsp
				</label>
				<label title="">
					<input id="vset" type="checkbox"> 在菜单展示[配置] &nbsp
				</label>
				<label title="控制台输出更多信息">
					<input id="vzin" type="checkbox"> 维新
				</label>
				<br>
				网页标题 <input id="pagetitle" type="text" class="fs-ipt" placeholder="垃圾百度，毁我青春">
				<br>
				<label title="移除左上角推广">
					<input id="topleft" type="checkbox"> 移除左上角推广
				</label>
				<label title="移除右上角">
					<input id="vuser" type="checkbox"> 移除右上角用户
				</label>
				<br>
				<label title="移除偶现的新闻">
					<input id="vnews" type="checkbox"> 移除资讯热榜
				</label>
				<label>
					<input id="vbtn" type="checkbox"> 移除搜索按钮 &nbsp&nbsp&nbsp&nbsp
				</label>
				<br>
				搜索框位置 <input id="ipos" type="number" class="fs-ipt ipnum" oninput="document.getElementById('iptlen').innerText=this.value" min="-200" max="300" defaultvalue="90" placeholder="90">
				字体大小 <input id="ipfz" type="number" class="fs-ipt ipnum" min="5" max="50" defaultvalue="18" placeholder="18">
				<br>
				<div title="背景">
					<span style="font-size:large;color:var(--thm-fo)">背景</span>
					<br>
					<label>
						<input id="bgimg-bing" type="checkbox" onchange="document.getElementById('bgimg').disabled=this.checked"> 与微软必应同步
					</label>
					<label title="19:00-次日7:00使用黑色背景图">
						<input id="bgimg-night" type="checkbox"> 昼夜更替
					</label>
					<label title="使用黑色背景图">
						<input id="bg-endless-night" oninput="document.getElementById('bgimg-night').disabled=this.checked;document.getElementById('bgimg').disabled=this.checked" type="checkbox"> 永夜
					</label>
					<br>
					或者 <input id="bgimg" style="width:70%" type="text" class="fs-ipt" placeholder="https...xxx.png/jpg" oninput="document.getElementById('sbgimg').innerText=this.value==''?'':'background-image: url('+this.value+')'" autocomplete="off">
				</div>
				<div title="关于LOGO...">
					<span style="font-size:large;color:var(--thm-fo)">Logo</span>
					<br>
					替换为
					<select id="vlogo" onchange="document.getElementById('cuslgurl').style.display=document.getElementById('op666').selected?'block':'none'">
						<option value="0">不替换</option>
						<option value="-3" style="color:#4e6ef2">常态·百度</option>
						<option value="-2" style="color:#000a">隐藏式</option>
						<option value="-1">移除</option>
						<option value="1" style="color:#9ECE60">哔哩哔哩四季</option>
						<option value="233" style="color:#fa7298">与哔哩哔哩同步</option>
						<option value="666" id="op666">自定义</option>
					</select>
					<input id="cuslgurl" type="text" class="fs-ipt cus-lg" style="display:none" placeholder="https...xxx.png" autocomplete="off">
				</div>
				并在鼠标停留logo上时提示 <input id="lgtip" type="text" class="fs-ipt" style="width:30%" placeholder="哔哩哔哩">
				<br>
				<div title="跳转方式">
					点击logo后从
					<label title="当前页面">
						<input id="lgtars" type="radio" name="target_de_logo"> 当前页
					</label>
					<label title="新标签页">
						<input id="lgtar" type="radio" name="target_de_logo"> 新标签页
					</label>
				</div>
				打开这个页面 <input id="lglinksto" type="text" class="fs-ipt" style="width:50%" placeholder="https://www.bilibili.com" autocomplete="off">
				<br>
				<div title="色彩设定">
					<span style="font-size:large;color:var(--thm-fo)">配置主题色</span>（哔哩粉：#FA7298）
					<br>
					字体 <input type="text" class="thmcolor fs-ipt" oninput="document.getElementsByClassName('scolor')[0].innerText=this.value" autocomplete="off">
					<br>
					主题 <input type="text" class="thmcolor fs-ipt" oninput="document.getElementsByClassName('scolor')[1].innerText=this.value" autocomplete="off">
				</div>
			</fieldset>
		</div>
		<span id="tri-ell" style="display:none"></span>
		<style id="tri-styles" type="text/css"></style>`;
	const TRI_CSS_TEXT = {
		sei: `
		html {
			overflow: hidden
		}

		#head_wrapper .ipt_rec,
		#head_wrapper .soutu-btn {
			display: none
		}

		#head_wrapper #kw,
		#head_wrapper #kw:focus {
			background-image: linear-gradient(-45deg, transparent 8px, var(--tri-bg) 0, var(--tri-bg) calc(100% - 8px), transparent 0);
			color: var(--thm-fc) !important
		}

		#head_wrapper #form .bdsug-new {
			position: absolute;
			left: 7%;
			top: 55px !important;
			background-image: linear-gradient(-45deg, transparent 8px, #fffc 0, #fffc calc(100% - 8px), transparent 0);
			background-color: transparent;
			border-radius: 0;
			border: none !important;
			position: absolute;
			top: 55px
		}

		#head_wrapper .s_btn,
		#head_wrapper .s_btn:hover {
			background-color: transparent
		}

		#head_wrapper .s_btn,
		#head_wrapper .s_btn_wr {
			width: 104px;
			height: 40px;
		}

		#head_wrapper .s_btn_wr {
			background-image: linear-gradient(-45deg, transparent 8px, var(--thm-fo) 0);
		}

		#head_wrapper .s_btn {
			position: absolute;
			top: -2px;
			border-radius: 0;
		}

		.bdsug-s,
		.bdsug-s b {
			color: var(--thm-fo) !important;
			font-size: large !important
		}

		#head_wrapper #form .bdsug-new ul {
			border-top: none;
		}

		#head_wrapper .soutu-env-nomac #form #kw {
			width: 618px !important;
			padding-right: 16px !important;
			border: none;
			border-radius: 0;
			background-color: transparent;
			text-align: center
		}`,
		seu: `
		#head_wrapper .soutu-env-nomac #form #kw,
		#head_wrapper #form #kw {
			width: 522px !important;
			border-radius: 10px;
		}

		#head_wrapper .s_btn,
		#head_wrapper .s_btn:hover {
			background-color: var(--thm-fo)
		}`,
		others: `
		#s_popup_advert {
			display: none
		}

		#bottom_layer {
			display: none
		}

		#s_side_wrapper {
			display: none
		}

		#head_wrapper #kw {
			font-size: calc(var(--ipt-fz) * 1px)
		}

		#head .head_wrapper {
			top: calc(var(--ipt-len) * 1px)
		}

		#s_top_wrap {
			display: none
		}

		#blind-box {
			display: none !important
		}

		body {
			background-size: cover;
			background-attachment: fixed
		}

		#headwrapper #form .bdsug-new user_list {
			border-top-color: transparent
		}

		.s-weather-wrapper:hover .show-city-name,
		.s-weather-wrapper:hover .show-icon-temp,
		.s-top-right .s-top-right-text:hover,
		.s-top-left .mnav:hover .s-bri,
		.s-top-left a:hover,
		.s-top-left .s-top-more .s-top-more-content>a:hover .s-top-more-title,
		.s-top-right .s-top-username .user-name:hover,
		.s-hotsearch-wrapper .s-hotsearch-title .hot-refresh:hover,
		.c-link:hover,
		.s-top-userset-menu a:hover,
		.bdsug-s,
		.bdsug-s b {
			color: var(--thm-fo) !important
		}

		.s-top-right .s-top-username .s-top-img-wrapper,
		#head_wrapper #kw:focus,
		#head_wrapper #form #kw.new-ipt-focus,
		#head_wrapper #form .bdsug-new {
			border-color: var(--thm-fo) !important
		}

		.s-weather-wrapper .s-mod-weather .weather-mod .show-pollution .show-polution-name,
		.c-btn-primary {
			background-color: var(--thm-fo)
		}`,
		tris: `
		:root {
			--tri-bg: #fffd
		}

		@keyframes appear {
			from {
				visibility: hidden;
				opacity: 0
			}

			to {
				visibility: visible;
				opacity: 1
			}
		}

		@keyframes fullfadeout {
			from {
				visibility: visible;
				opacity: 1
			}

			to {
				visibility: hidden;
				opacity: 0
			}
		}

		@keyframes fadeout {
			from {
				opacity: 0.85
			}

			to {
				opacity: 0
			}
		}

		@keyframes tminus {
			from {
				width: 0
			}

			to {
				width: 320px
			}
		}

		#tri-fds input[type=checkbox],
		#tri-fds input[type=radio] {
			position: relative;
			height: 0
		}

		#tri-fds input[type=checkbox]::before,
		#tri-fds input[type=radio]::before {
			content: "";
			width: 12px;
			height: 12px;
			position: absolute;
			left: 0;
			top: -12px;
			border: 1px solid var(--thm-fo);
			border-radius: 50%;
		}

		#tri-fds input[type=checkbox]:checked::before,
		#tri-fds input[type=radio]:checked::before {
			background-color: var(--thm-fo);
		}

		#tri-fds input[type=checkbox]:disabled::before,
		#tri-fds input[type=radio]:disabled::before {
			background-color: grey;
			border: none;
		}

		#tri-fds input[type=text]:disabled {
			border-bottom-color: grey
		}

		::-webkit-scrollbar {
			width: 7px
		}

		::-webkit-scrollbar-thumb {
			background-color: #0004;
			border-radius: 3px
		}

		.trisay {
			user-select: none;
			overflow: hidden;
			min-width: 60px;
			background-image: linear-gradient(-45deg, transparent 5px, var(--tri-bg) 0, var(--tri-bg) calc(100% - 5px), transparent 0);
			opacity: 0.85;
			width: 320px;
			height: auto;
			font-size: 16px;
			min-height: 30px;
			line-height: 30px;
			text-align: center;
			position: fixed;
			top: 60%;
			left: 40%;
			z-index: 998
		}

		.trisay strong {
			color: var(--thm-fo);
		}

		.trisay span {
			font-size: smaller
		}

		.trisay hr {
			height: 5px;
			border: none;
			background-image: linear-gradient(-45deg, transparent 4px, var(--thm-fo) 0);
			animation: tminus var(--hr-time) linear forwards;
			z-index: 999
		}

		.fadeout {
			animation: fadeout 0.5s forwards
		}

		.ts {
			display: none;
			opacity: 0
		}

		.in {
			animation: appear 0.8s forwards
		}

		.out {
			animation: fullfadeout 0.8s forwards
		}

		.fs-ipt {
			padding-left: 5px;
			background-color: transparent;
			border: none;
			border-bottom: 1px solid var(--thm-fo);
			outline: none;
			height: 18px;
			z-index: 997
		}

		#vlogo {
			border: none;
			background-color: transparent;
			height: 16px;
			font-size: 12px;
			outline: none
		}

		.cus-lg {
			position: absolute;
			right: 5%;
			top: 52.5%;
			width: 36%
		}

		.ipnum {
			width: 12%
		}

		.btn {
			outline: none;
			border: none
		}

		.b-a {
			background-image: linear-gradient(-45deg, transparent 6px, var(--thm-fo) 0, var(--thm-fo) calc(100% - 6px), transparent 0);
			background-color: transparent;
			color: white
		}

		.tri-dis {
			position: absolute;
			top: 0;
			right: -2px;
			width: 7px;
			height: 100%;
			background-color: transparent;
			background-image: linear-gradient(to left, var(--thm-fo), transparent);
			opacity: 0
		}

		.tri-dis:hover {
			animation: appear 0.1s linear forwards
		}

		.save-btn {
			font-size: large;
			position: fixed;
			right: 6%;
			width: 80px;
			height: 40px;
			z-index: 998
		}

		#joinus {
			position: absolute;
			bottom: 0;
			left: 0;
			width: 46px;
			height: 40px
		}

		.fdt {
			color: var(--thm-fo);
			font-size: 23px;
			position: absolute;
			top: 3%;
			left: 3%;
		}

		#tri-fds {
			overflow: auto;
			position: fixed;
			top: 7%;
			right: 5%;
			border-color: #0000;
			padding: 15px;
			font-size: 14px;
			line-height: 200%;
			height: 600px;
			color: #222;
			width: 300px;
			border-radius: 10px;
			background-image: linear-gradient(-45deg, transparent 10px, var(--tri-bg) 0, var(--tri-bg) calc(100% - 10px), transparent 0);
			text-align: left;
			user-select: none;
			z-index: 996
		}

		#tri-fds hr {
			height: 1px;
			border: none;
			background-color: var(--thm-fo);
			z-index: 997
		}

		.trilato {
			padding: 10px;
			background-image: linear-gradient(-45deg, transparent 10px, #fff3 0, #fff3 calc(100% - 10px), transparent 0);
			position: absolute;
			width: calc(100% - 50px);
			height: 10%;
			cursor: pointer;
			color: var(--thm-fo)
		}

		.trilato span {
			position: absolute;
			right: 10px
		}

		.trilato img {
			position: absolute;
			bottom: 5px;
			left: 5px;
			width: 36px;
		}`,
		night: `
		:root {
			--tri-bg: #fffa
		}

		body {
			background-color: #222;
			background-image: none !important
		}

		#head_wrapper #kw,
		.s-top-userset-menu,
		.soutu-hover-tip,
		#head_wrapper #form .bdsug-new,
		#s-top-left .s-top-more,
		.weather-setting-content {
			background-color: #222 !important;
			color: #ccc !important
		}
		.c-color-text {
			color: #9e9e9e;
		}

		.soutu-btn {
			background-color: transparent !important
		}

		#head_wrapper #form .bdsug-new ul {
			border-top-color: #ccc;
		}

		.c-link,
		.c-color-t,
		.s-top-userset-menu a,
		#head_wrapper #form .bdsug-new ul li,
		#head_wrapper #form .bdsug-new ul li b {
			color: #ccc
		}`
	};
	const $ = (selector) => {
		switch (selector[0]) {
			case '#':
				return document.getElementById(selector.slice(1))
			case '.':
				return document.getElementsByClassName(selector.slice(1))
			default:
				return document.getElementsByTagName(selector)
		}
	};
	const world = {
		draw: GM_addStyle,
		rise: GM_setValue,
		take: GM_getValue,
		execute: GM_deleteValue,
		require: GM_xmlhttpRequest,
		set: GM_registerMenuCommand,
		wait: (t, f) => {
			setTimeout(f, t * 1000)
		},
		repeat: {
			engage: (t, f) => {
				return setInterval(f, t * 1000)
			},
			execute: (f) => {
				clearInterval(f)
			}
		},
		log: (l) => {
			console.log(`%c TriLingvo %c\n ${l}`, 'color:#fff;background-color:#fa7298;border-radius:8px', '');
		},
		say: (msg, t) => {
			t = isNaN(t) ? 3 : t;
			if ($('.trisay')[0]) document.body.removeChild($('.trisay')[0])
			world.draw(`:root{--hr-time: ${t}s`);
			let m = document.createElement('div');
			let n = document.createElement('hr');
			m.className = "trisay";
			m.innerHTML = msg.replace(/\n/g, '<br>');
			document.body.appendChild(m);
			m.appendChild(n);
			if (yourData.vzin) world.log(lingvo.say + msg);
			world.wait(t, () => {
				m.className += " fadeout";
				world.wait(1, () => {
					document.body.removeChild(m)
				});
			});
		},
		show: () => {
			$('#tri-fds').className = $('#tri-fds').className != 'in' ? 'in' : 'out';
		},
		update: () => {
			// world.say(TRI_UPDATE_NOTICE[0], TRI_UPDATE_NOTICE[1]);
			if (TRI_UPDATE_NOTICE[0] != yourData.triSay) {
				world.say(TRI_UPDATE_NOTICE[0], TRI_UPDATE_NOTICE[1]);
				yourData.triSay = TRI_UPDATE_NOTICE[0]
			};
			Object.keys(her).forEach(part => {
				if (typeof yourData[part] == "undefined") yourData[part] = her[part]
			});

			world.rise(you, yourData);
			if (yourData.vzin) world.log(lingvo.update)
		},
		savl: (s) => {
			let e = {
				search: $('#vsearch'),
				btn: $('#vbtn'),
				vzin: $('#vzin'),
				vset: $('#vset'),
				pagetitle: $('#pagetitle'),
				topleft: $('#topleft'),
				user: $('#vuser'),
				news: $('#vnews'),
				ipos: $('#ipos'),
				ipfz: $('#ipfz'),
				bgimg: $('#bgimg'),
				bgimgbing: $('#bgimg-bing'),
				bgimgnight: $('#bgimg-night'),
				bgendlessnight: $('#bg-endless-night'),
				logo: $('#vlogo'),
				cuslgurl: $('#cuslgurl'),
				lgtip: $('#lgtip'),
				lgtar: $('#lgtar'),
				lglinksto: $('#lglinksto'),
				thmcolor: [$('.thmcolor')[0], $('.thmcolor')[1]]
				//Ne triSay
			};
			if (s) {	// load
				e.search.checked = s.drawIptStyle;
				e.btn.checked = s.hideSearchBtn;
				e.vzin.checked = s.vzin;
				e.vset.checked = s.engageSet;
				if (s.pageTiltle) e.pagetitle.value = s.pageTiltle;
				e.topleft.checked = s.topLeft;
				e.user.checked = s.userList;
				e.news.checked = s.hotNews;
				e.ipos.value = s.inputLenTillTop;
				e.ipfz.value = s.inputFontSize;
				e.bgimg.value = s.pageBackgroundImg;
				e.bgimg.disabled = s.pageBackgroundImgBing;
				e.bgimgbing.checked = s.pageBackgroundImgBing;
				e.bgimgnight.checked = s.pageBackgroundImgNight;
				e.bgendlessnight.checked = s.backgroundEndlessNight;
				e.bgimgnight.disabled = s.backgroundEndlessNight;
				e.logo.value = s.replaceLogo;
				e.cuslgurl.value = s.cusLogoUrl;
				e.lgtip.value = s.tipDeLogo;
				s.targetDeLogo ? e.lgtar.checked = true : $('#lgtars').checked = true;
				e.lglinksto.value = s.logoLinksTo;
				[e.thmcolor[0].value, e.thmcolor[1].value] = s.thmColor;
				if (s.replaceLogo == 666) e.cuslgurl.style.display = 'block'
			} else {	// save
				return {
					drawIptStyle: e.search.checked,
					hideSearchBtn: e.btn.checked,
					vzin: e.vzin.checked,
					engageSet: e.vset.checked,
					pageTiltle: e.pagetitle.value,
					topLeft: e.topleft.checked,
					userList: e.user.checked,
					hotNews: e.news.checked,
					inputLenTillTop: e.ipos.value,
					inputFontSize: e.ipfz.value,
					pageBackgroundImg: e.bgimg.value,
					pageBackgroundImgBing: e.bgimgbing.checked,
					pageBackgroundImgNight: e.bgimgnight.checked,
					backgroundEndlessNight: e.bgendlessnight.checked,
					replaceLogo: Number(e.logo.value),
					season: yourData.season,
					cusLogoUrl: e.cuslgurl.value,
					tipDeLogo: e.lgtip.value,
					targetDeLogo: e.lgtar.checked,
					logoLinksTo: e.lglinksto.value,
					thmColor: e.thmcolor.map(el => el.value)
				}
			}
		},
		watch: (e, a, f) => {
			e.addEventListener(a, f)
		},
		cover: () => {
			world.draw(TRI_CSS_TEXT.night);
			if (yourData.drawIptStyle) world.draw('#head_wrapper #form .bdsug-new li,#head_wrapper #form .bdsug-new li b {color: #222 !important}');
			if (yourData.vzin) world.log(yourData.backgroundEndlessNight ? lingvo.endlessNight : lingvo.night)
		}
	};
	let ct = document.createElement('div');
	ct.innerHTML = TRI_HTML;
	document.body.appendChild(ct);
	let yourData = world.take(you, her);
	if (yourData.vzin) world.log(lingvo.vzin);
	world.update();
	world.log(lingvo.welcome);
	let timeHour = new Date().getHours(), nightArea = [19, 7];
	let engageNightCover = Boolean(yourData.pageBackgroundImgNight && (timeHour >= nightArea[0] || timeHour <= nightArea[1]))
	let pageBackgroundImg = engageNightCover || yourData.pageBackgroundImgBing || !yourData.pageBackgroundImg.length ? '' : 'background-image: url(' + yourData.pageBackgroundImg + ')';
	world.draw(TRI_CSS_TEXT.others);
	world.draw(TRI_CSS_TEXT.tris);
	if (yourData.pageTiltle.length) document.title = yourData.pageTiltle;
	if (engageNightCover || yourData.backgroundEndlessNight) {
		world.cover();
	} else {
		if (yourData.pageBackgroundImgBing) {
			world.require({
				method: "GET",
				url: API[2],
				onload: (b) => {
					let c = JSON.parse(b.responseText).images[0]
					let bing = 'https://www.bing.com' + c.url;
					world.draw(`body{background-image:url( ${bing} )}`);
					if (yourData.vzin) world.log(lingvo.bing + c.copyright + '\n\t' + bing)
				}
			});
		};
		if (yourData.pageBackgroundImgNight) {
			if (yourData.vzin) world.log(lingvo.watchNight)
			let night = world.repeat.engage(10, () => {
				timeHour = new Date().getHours();
				if (timeHour >= nightArea[0] || timeHour <= nightArea[1]) {
					world.cover();
					world.repeat.execute(night)
				}
			})
		};
	};
	yourData.drawIptStyle ? world.draw(TRI_CSS_TEXT.sei) : world.draw(TRI_CSS_TEXT.seu);
	yourData.hideSearchBtn ? world.draw(`#head_wrapper .s_btn_wr {display: none}`) : world.draw(`#head_wrapper .s_form{width:667px}#head_wrapper .s_btn_wr,#head_wrapper .s_btn {opacity: 1}`);
	if (yourData.topLeft) world.draw(`#s-top-left{display: none}`);
	if (yourData.userList) {
		world.draw(`.s-top-right{display: none}`)
	}
	// else {world.draw(`.s-top-right .s-top-login-btn{display: none}`)}
	if (yourData.hotNews) world.draw(`.s-hotsearch-wrapper,#m,#s_wrap {display: none}`);
	let ipa = 0
	let a = world.repeat.engage(0.01, () => {
		document.body.style.opacity = ipa.toString()
		if (parseInt(ipa) == 1) {
			world.repeat.execute(a)
			return
		}
		ipa += 0.02
	})

	//elogo
	let lgs = yourData.replaceLogo;
	if (lgs) {
		let elogo = $("#s_lg_img");
		switch (lgs) {
			case -3:
				elogo.src = IMAGES[1];
				break;
			case -2:
				elogo.style.opacity = "0";
				break;
			case -1:
				elogo.style.display = "none"; //移除
				break;
			case 1:
			case 233:
				elogo.src = SEASON_LOGO[yourData.season];
				world.require({
					method: "GET",
					url: API[0],
					onload: (r) => {
						let bili = JSON.parse(r.responseText).data.litpic.replace("http:", "https:");
						if (SEASON_LOGO.includes(bili)) {
							yourData.season = SEASON_LOGO.indexOf(bili);
							world.rise(you, yourData);
						};
						if (lgs === 1) {
							elogo.src = SEASON_LOGO[yourData.season];
							if (yourData.vzin) world.log(lingvo.season + SEASON_LOGO[yourData.season]);
						} else {
							elogo.src = bili;
							if (yourData.vzin) world.log(lingvo.bili + bili);
						};
					}
				});
				break;
			case 666:
				if (yourData.cusLogoUrl.length) elogo.src = yourData.cusLogoUrl;
				if (yourData.vzin) world.log(lingvo.custome + (yourData.cusLogoUrl.length ? yourData.cusLogoUrl : "地址为空"))
				break;
		};
	}
	if (~lgs) {	//-1 移除 无需替换
		let mp = $("area")[0];
		if (yourData.logoLinksTo.length) mp.href = yourData.logoLinksTo;
		mp.target = yourData.targetDeLogo ? "_blank" : "_self";
		if (yourData.tipDeLogo.length) mp.title = yourData.tipDeLogo
	}
	try {
		$('#tri-ell').innerHTML = `
			body {<span id="sbgimg"> ${pageBackgroundImg} </span>}
			:root{
				--ipt-len: <span id="iptlen"> ${yourData.inputLenTillTop} </span>;
				--ipt-fz: <span id="iptfz"> ${yourData.inputFontSize} </span>;
				--thm-fc: <span class="scolor"> ${yourData.thmColor[0]} </span>;
				--thm-fo: <span class="scolor"> ${yourData.thmColor[1]} </span>
			}
		`;
		$('#tri-styles').innerHTML = `
			body { ${pageBackgroundImg} }
			:root{
				--ipt-len: ${yourData.inputLenTillTop} ;
				--ipt-fz: ${yourData.inputFontSize} ;
				--thm-fc: ${yourData.thmColor[0]} ;
				--thm-fo: ${yourData.thmColor[1]}
			}
		`;
		world.watch($('#ipfz'), 'input', () => {
			let ip = $('#ipfz').value, kw = $('#kw');
			if (kw.value.match(/^(字体大小\d+px)?$/)) kw.value = `字体大小${ip}px`;
			$('#iptfz').innerText = ip
		});
		world.watch($('#ipfz'), 'focusout', () => {
			if ($('#kw').value.match(/^字体大小\d+px$/)) $('#kw').value = ""
		});
		world.watch($('.save-btn')[0], 'click', () => {
			world.say(lingvo.save, 0.8);
			world.rise(you, world.savl(0));
			world.wait(1.2, () => {
				window.location.reload()
			})
		});
		world.watch($('.tri-dis')[0], 'dblclick', world.show);
		$('#kw').autofocus = true;
		world.savl(yourData);
		world.execute(me);
	} catch (e) {
		console.log(e)
	};
	if (yourData.engageSet) world.set(lingvo.set, () => {
		world.show();
		world.draw('.tri-dis {animation: appear 1s 8}');
		world.say('双击右边缘提示区域可打开或关闭配置', 2)
	});
	if (yourData.vzin) {
		console.dir(world.savl(0));
		console.timeEnd("星凰·众里寻她千百度\n\t本次耗时")
	}
})