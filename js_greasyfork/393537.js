// ==UserScript==
// @name         FLOJ UserName Mapper
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  想看到编号下的真实姓名？这个将会满足你！
// @author       iotang
// @match        https://floj.tech/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/393537/FLOJ%20UserName%20Mapper.user.js
// @updateURL https://update.greasyfork.org/scripts/393537/FLOJ%20UserName%20Mapper.meta.js
// ==/UserScript==

(function () {

	"use strict";

	let gmMapperName = "mapper-sdlfjqwoihfin9q248fbh93v";
	let defaultMapper = {
		"2020cj_101": "star_magic_young",
		"2020cj_102": "shuixirui",
		"2020cj_103": "czf",
		"2020cj_104": "iotang",
		"2020cj_105": "Shiina Mashiro",
		"2020cj_106": "<a style=\"color: black; text-shadow: 0 0 1em orange, 0 0 0.3em orange; \">I</a><a style=\"color: red; text-shadow: 0 0 1em orange, 0 0 0.3em orange; \">tst</a>",
		"2020cj_107": "Winlere",
		"2020cj_108": "a1b3c7d9",
		"2020cj_109": "test12345",
		"2020cj_110": "dsl2002",
		"2020cj_111": "<a style=\"color: black; text-shadow: 0 0 1em orange, 0 0 0.3em orange; \">newbie</a><a style=\"color: red; text-shadow: 0 0 1em orange, 0 0 0.3em orange; \">314159</a>",
		"2020cj_112": "Geralt Gao",
		"2020cj_113": "zhoushuyu",
		"2020cj_120": "newbiechd",
		"2020cdqz_101": "Owen",
		"2020hsefz_101": "zjc",
		"2020hsefz_118": "Dilute",
		"2020nfls_101": "xy",
		"2020hzez_104": "supy",
		"2020hzez_106": "Isonan",
		"2020hzez_110": "memset0",
		"2020hzez_117": "Gnar",
		"2020hzez_120": "LJC00118",
	};

	function resetMapper() {
		GM_setValue(gmMapperName, defaultMapper);
	}

	function getMapper() {
		let temp = GM_getValue(gmMapperName);
		if (temp === undefined) {
			GM_setValue(gmMapperName, defaultMapper);
			temp = GM_getValue(gmMapperName);
		}
		return temp;
	}

	function getHashie(who) {
		let temp = getMapper();
		if (temp[who] === undefined) {
			return "<a style=\"opacity: 0.5; color: inherit;\">" + who + "</a>";
		}
		return temp[who];
	}

	function setHashie(who, val) {
		let temp = getMapper();
		temp[who] = val;
		GM_setValue(gmMapperName, temp);
	}

	function updateMapper(force) {
		let temp = getMapper();
		for (let i in defaultMapper) {
			if (force || temp[i] === undefined) temp[i] = defaultMapper[i];
		}
		GM_setValue(gmMapperName, temp);
	}

	function cleanUp() {
		let users = document.getElementsByClassName("uoj-username");
		let honor = document.getElementsByClassName("uoj-honor");
		for (let i of users) {
			i.innerHTML = getHashie(i.innerHTML);
		}
		for (let i of honor) {
			i.innerHTML = getHashie(i.innerHTML);
		}
	}

	function getInput(coef) {
		while (true) {
			let val = prompt("输入" + coef + "（留空表示跳过）");
			if (val === null) return null;
			if (val.length <= 0) return "";

			let hint = coef + " " + val + ": ";

			let col = prompt("输入" + coef + "的颜色\n" + hint);
			if (col === null) return null;
			if (col.length <= 0) col = "inherit";
			else hint = hint + " 颜色 " + col + "; ";

			let shadowcol = prompt("输入" + coef + "的阴影颜色\n" + hint);
			if (shadowcol === null) return null;
			if (shadowcol.length <= 0) shadowcol = undefined;
			else hint = hint + " 阴影 " + shadowcol + "; ";

			let fontsize = prompt("输入" + coef + "的字号（以 em（推荐）, px, pt 结尾）\n" + hint);
			if (fontsize === null) return null;
			if (fontsize.length <= 0) fontsize = undefined;
			else hint = hint + " 字号 " + fontsize + "; ";

			let fonts = prompt("输入" + coef + "的字体（serif，sans-serif，cursive，fantasy，monospace 等）\n" + hint);
			if (fonts === null) return null;
			if (fonts.length <= 0) fonts = undefined;
			else hint = hint + " 字体 " + fonts + "; ";

			if (confirm(hint + "\n这样好吗？")) {
				let bas = "<a style=\"";
				if (col !== undefined) bas = bas + "color: " + col + "; ";
				if (shadowcol !== undefined) bas = bas + "text-shadow: 0 0 2em " + shadowcol + ", 0 0 1em " + shadowcol + ", 0 0 0.7em " + shadowcol + ", 0 0 0.3em " + shadowcol + "; ";
				if (fontsize !== undefined) bas = bas + "font-size: " + fontsize + "; ";
				if (fonts !== undefined) bas = bas + "font-family: " + fonts + "; ";
				bas = bas + "\">" + val + "</a>";
				return bas;
			}
		}
	}

	function comfirmHashie() {
		let who = prompt("输入源 ID");
		if (who === null || who.length <= 0) return;

		let pref = getInput("前缀");
		if (pref === null) return;
		let basm = getInput("主名");
		if (basm === null) return;
		let suff = getInput("后缀");
		if (suff === null) return;
		let bas = pref + basm + suff;

		setHashie(who, bas);
		alert("这将在下次刷新后起效。");
	}

	function confirmUpdateMapper() {
		let types = confirm("从数据库中更新还没有的配置。如果点击“是”，已有的设置也会被默认设置替代。");
		if (confirm("真的要这样吗？这不能被撤销！")) updateMapper(types);
	}

	let uojContent = document.getElementsByClassName("uoj-content")[0];

	let buttonHashie = document.createElement("button");
	buttonHashie.style = "background: rgb(212,255,212); border: none;";
	buttonHashie.name = "hashieUser";
	buttonHashie.id = "hashieUser";
	buttonHashie.innerHTML = "添加规则";
	buttonHashie.onclick = function () {
		comfirmHashie();
	};

	let buttonUpdate = document.createElement("button");
	buttonUpdate.style = "background: rgb(255,212,212); border: none;";
	buttonUpdate.name = "mapperUpdate";
	buttonUpdate.id = "mapperUpdate";
	buttonUpdate.innerHTML = "重置";
	buttonUpdate.onclick = function () {
		confirmUpdateMapper();
	};

	uojContent.appendChild(buttonHashie);
	uojContent.appendChild(buttonUpdate);

	cleanUp();

})();