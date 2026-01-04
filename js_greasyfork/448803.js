// ==UserScript==
// @name         BingSearchHelper
// @namespace    leawind
// @version      1.8
// @description  Automatically add options when searching by bing
// @author       leawind
// @license MIT
// @include      *://*
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/448803/BingSearchHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/448803/BingSearchHelper.meta.js
// ==/UserScript==

(function () {
	"use strict";
	if (!/^cn.bing.com$/.exec(location.host)) return; // Only work in cn.bing.com
	console.log("BingSearchHelper loaded successfully");

	// CONSTANTS
	const ID = "kBk78DkeNReVLVXs"; // for identification purposes
	const ID_URL = `${ID}-url`; //
	const ID_Q_SPLITER = ` -${ID}`; // To separate keywords and advanced search suffixes.

	const RGX = {
		bing_search: /^https?:\/\/((www)|(cn))\.bing\.com\/search\?.*/, // Determine if this is a search page
		question_suffix: new RegExp(`\\s*${ID_Q_SPLITER}.*$`), // find all advanced searching suffixes that added by me
	};

	let options;
	let locator = new URL(location.href),
		params = locator.searchParams;
	let intervalFuncId = NaN;

	// 从 LocalStorage 中读取配置信息
	try {
		options = JSON.parse(localStorage[ID]);
	} catch (err) {
		options = {
			sites_exclude: [],
			advs_params: [],
			consts: {
				// The following domains are only for testing purposes, absolutely nothing else.
				sites: {
					unexpected: [
						"zhidao.baidu.com",
						"jingyan.baidu.com",
						"baijiahao.baidu.com",
						"pconline.com.cn",
						".120ask.com",
						".suning.com",
						".toutiao.com",
						"163.com",
						"game.163.com",
						"play.163.com",
						"mc.163.com",
						".dadagame.net",
						"99box.com",
						"mn.qq.com",
						"new.qq.com",
					],
					EBP: [
						".jd.com",
						".1688.com",
						"tb.alicdn.com",
						".taobao.com",
						"kaola.com",
					],
					softDownload: [
						"downxia.com",
						"onlinedown.net",
						"xitongzhijia.net",
						"downza.cn",
						".zol.com.cn",
						"pcsoft.com.cn",
						".crsky.com",
						".yehes.com",
						".pw88.com",
						".pc6.com",
						"soft.so.com",
						"121xia.com",
						"pc.qq.com",
						".pcsoft.com.cn",
						"winwin7.com",
						"mydown.yesky.com",
						".ddooo.com",
						"duote.com",
						".pcsoft.com.cn",
						".eyunsou.com",
						"baoku.360.cn",
						"soft.360.cn",
						".xiaozhuzy.top",
					],
					gameDownload: [
						"down.gamersky.com",
						"down.ali213.net",
						"mydown.yesky.com",
						".3dmgame.com",
						".yxdown.com",
						"pc.52pk.com",
						".wegame.com.cn",
						"www.gmz88.com",
						".962.net",
						"www.mydown.com",
					],
				},
			},
		};
		{
			// Please forgive me if I forget to delete this block when publish this script.
			for (let i of options.consts.sites.unexpected)
				options.sites_exclude.push(i);
			for (let i of options.consts.sites.EBP)
				options.sites_exclude.push(i);
			for (let i of options.consts.sites.softDownload)
				options.sites_exclude.push(i);
		}
	}

	// 搜索页面
	if (RGX.bing_search.exec(location.href)) {
		if (isUrlGoodSearch(location.href)) {
			intervalFuncId = window.setInterval(checkInputValue, 10);
		} else {
			params.set(ID_URL, "");
			let q = params.get("q");
			q += generateAdvancedSearchSuffix(options);
			params.set("q", q);
			console.log(locator);
			console.error("Relocating...");
			location.href = locator.href;
		}
	}

	// 设置页面
	// https://cn.bing.com/account/
	if (/^https?:\/\/cn.bing.com\/account.*/.exec(location.href)) {
		window.addEventListener("load", () => {
			// Inject HTML
			let me_sidenav = document.getElementById("me_sidenav");
			let profileSet = document.getElementById("profileSet");
			let ele_ta_se;
			let ele_ta_ap;

			const saveOptions = () => {
				options.sites_exclude = ele_ta_se.value
					? ele_ta_se.value.trim().split("\n")
					: [];
				options.advs_params = ele_ta_ap.value
					? ele_ta_ap.value.trim().split("\n")
					: [];
				localStorage[ID] = JSON.stringify(options);
			};

			{
				// 左侧目录
				let ele_a = document.createElement("a");
				ele_a.innerHTML = "LEAWIND's Bing Search Helper";
				ele_a.href = "#bing-search-helper-by-leawind";
				me_sidenav.appendChild(ele_a);
			}
			{
				// Section
				let ele_section = document.createElement("div");
				let pfsChildren = profileSet.children;
				profileSet.insertBefore(
					ele_section,
					pfsChildren[pfsChildren.length - 2]
				);

				ele_section.id = "bing-search-helper-by-leawind";
				ele_section.setAttribute("class", "me_section  me_cbst");
				ele_section.innerHTML = `<div class="me_section_title"><div class="me_section_title_ls" id="homepage-section-title" tabindex="-1"><h2 class="">LEAWIND's BingSearchHelper</h2></div></div>`;
				{
					let ele_content = document.createElement("div");
					ele_section.appendChild(ele_content);

					ele_content.className = "me_sectioncontent";
					ele_content.innerHTML = `
<div class="me_subsection_row row no-margins clearfix">
	<div class="me_subsection row no-margins clearfix" id="settings_safesearch">
		<div class="col-md-4 col-xs-12 no-margins me_subsection_l">
			<h3>排除网站</h3>
		</div>
		<div class="col-md-8 col-xs-12 no-margins me_subsection_r">
			你可以将不希望出现在搜索结果中的网站输入在下方的文本域中。
			<br>
			每行一个域名。
			<br>
			可以在行末添加注释，以 // 开头
			<textarea id="sites-exclude" style="margin-top:0.6em;font-family:fira, consolas;font-size:1.5em;line-height:1.2em;display:block;max-width:100%;min-width:100%;min-height:1.2em;resize:none;"></textarea>
		</div>
	</div>
	<hr>
	<div class="me_subsection row no-margins clearfix" id="settings_safesearch">
		<div class="col-md-4 col-xs-12 no-margins me_subsection_l">
			<h3>自定义高级搜索语法</h3>
		</div>
		<div class="col-md-8 col-xs-12 no-margins me_subsection_r">
			每行一条选项，将被加在搜索内容末尾，每条选项将以空格分隔
			<br>
			可以在行末添加注释，以 // 开头
			
			<textarea id="advs-param" style="margin-top:0.6em;font-family:fira, consolas;font-size:1.5em;line-height:1.2em;display:block;max-width:100%;min-width:100%;min-height:1.2em;resize:none;"></textarea>
			具体语法请参考
				<a href="https://help.bing.microsoft.com/#apex/bing/zh-CHS/10001/-1">高级搜索关键字</a>
			和
				<a href="https://help.bing.microsoft.com/#apex/bing/zh-CHS/10002/-1">高级搜索选项</a>
			。
		</div>
	</div>
	<hr>
	<div class="me_subsection row no-margins clearfix" id="settings_safesearch">
		<div class="col-md-4 col-xs-12 no-margins me_subsection_l">
			<h3>其他</h3>
		</div>
		<div class="col-md-8 col-xs-12 no-margins me_subsection_r">
			在文本域中所作的修改会自动实时保存。
			<button class="btn blue" style="cursor: pointer;" onclick="if(confirm('确定要将脚本 BingSearchHelper 的配置恢复到默认值吗？此操作不可撤销.')){localStorage.${ID} = undefined; location.reload();}">恢复到默认值</button>
		</div>
	</div>
	<hr>
	<div class="me_subsection row no-margins clearfix" id="settings_safesearch">
		<div class="col-md-4 col-xs-12 no-margins me_subsection_l">
			<h3>Author's email</h3>
		</div>
		<div class="col-md-8 col-xs-12 no-margins me_subsection_r">
			<a>leawind@yeah.net</a>
		</div>
	</div>
</div>
					`;
					{
						// 排除网站
						ele_ta_se = document.getElementById("sites-exclude");
						let ih = "";
						for (let se of options.sites_exclude) ih += se + "\n";
						ele_ta_se.value = ih;
						ele_ta_se.style.height =
							(options.sites_exclude.length + 1.5) * 1.2 + "em";
						ele_ta_se.oninput = (e) => {
							e.target.style.height =
								(e.target.value.split("\n").length + 0.5) *
									1.2 +
								"em";
							saveOptions();
						};
					}
					{
						// 高级搜索语法参数
						ele_ta_ap = document.getElementById("advs-param");
						let ih = "";
						for (let ap of options.advs_params) ih += ap + "\n";
						ele_ta_ap.value = ih;

						ele_ta_ap.style.height =
							(options.advs_params.length + 1.5) * 1.2 + "em";
						ele_ta_ap.oninput = (e) => {
							e.target.style.height =
								(e.target.value.split("\n").length + 0.5) *
									1.2 +
								"em";
							saveOptions();
						};
					}
				}
			}
		});
	}

	// 清除奇怪的元素
	{
		window.setInterval(() => {
			let sa_ul = document.getElementById("sa_ul");
			if (sa_ul === null) return;
			for (let li of sa_ul.children) {
				let qs = li.getAttribute("query");
				if (qs && qs.search(ID) !== -1) li.remove();
			}

			let xclx = document.querySelector(".b_ans.b_top.b_topborder");
			if (xclx !== null) xclx.remove();
		}, 500);

		window.addEventListener("load", () => {
			let xclx = document.querySelector(".b_ans.b_top.b_topborder");
			if (xclx !== null) xclx.remove();
		});
	}

	function isUrlGoodSearch(url) {
		return (
			RGX.bing_search.exec(url) &&
			new URL(url).searchParams.get(ID_URL) === ""
		);
	}

	function checkInputValue() {
		let ele_input = document.getElementById("sb_form_q");
		if (ele_input != null)
			ele_input.value = ele_input.value.replace(RGX.question_suffix, "");
	}

	function generateAdvancedSearchSuffix(opt) {
		let s = ID_Q_SPLITER;
		for (let site of opt.sites_exclude)
			s += ` -site:${site.replace(/(^\s+)|(\s+\/\/.*$)/, "")}`;
		for (let p of opt.advs_params)
			s += " " + p.replace(/(^\s+)|(\s+\/\/.*$)/, "");
		return s;
	}
})();
