// ==UserScript==
// @name         花瓣搜索功能增强
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  对华为花瓣搜索进行功能增强
// @author       tutu辣么可爱
// @match        https://petalsearch.com/search*
// @icon         https://search-static-dra.dbankcdn.com/pc/v1/favicon.ico
// @grant        GM_addStyle
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/438418/%E8%8A%B1%E7%93%A3%E6%90%9C%E7%B4%A2%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/438418/%E8%8A%B1%E7%93%A3%E6%90%9C%E7%B4%A2%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
	const localItemKey = "gemXL-scriptSettingData";

	function addSettingMenu(){
		var menu=$(".el-dropdown-menu");
		if(menu&&!menu.querySelector("#gemXL-scriptSettings")){
			var item=menu.firstElementChild.cloneNode(false);
			item.id="gemXL-scriptSettings";
			item.innerHTML="<span>脚本设置</span>";
			item.onclick=function(){
				alert("open menu");
			}
			menu.appendChild(item);
		}
	}
	function initSetData(setData) {
		var localData = localStorage.getItem(localItemKey);
		try {
			localData = JSON.parse(localData);
		} catch (e) {
			localData = {};
		}
		localData = typeof localData === "object" ? localData : {};
		return {
			...setData,
			...localData
		};
	}

	function saveSetData(setData) {
		localStorage.setItem(localItemKey, JSON.stringify(setData));
	}

	function addNewCss() {
		var maxWidth = 1039; //container的宽度-240再取整
		var itemWidth = (maxWidth - 20) / setData.listNum;
		var container_css = ".card-container{display:grid;grid-template-columns:repeat(" + setData.listNum + "," + itemWidth +
			"px);grid-template-rows:auto;grid-gap: 20px}";
		var item_css =
			".resut-card-extra{min-height:150px;padding:15px 20px;margin:0!important;overflow:auto;border:1px rgba(0,0,0,0.05) solid;border-radius:5px;background-image: linear-gradient(180deg,rgba(255,255,255,.3),rgba(255,255,255,0))}.resut-card-extra:hover{border-color:rgba(0,0,0,0.3)}";
		var ad_css = ".rating-web{display:none}";
		var navigation_css = ".s-pagination{max-width:" + maxWidth + "px!important}";
		var finnal_css = container_css + item_css + ad_css + navigation_css;
		GM_addStyle(finnal_css);
		var resultContainer=$(".card-container");
		for(let i=0;i<resultContainer.childElementCount;i++){
			let temp=resultContainer.children[i];
			if(/div/i.test(temp.tagName)&&!temp.classList.contains("resut-card-extra")){
				temp.classList.add("resut-card-extra");
			}
		}
	}

	function changeResultNum() {
		var ps = /ps=([0-9]{1,})/i.exec(location.search);
		if (!RegExp(setData.resultNum).test(ps)) {
			var url = location.href;
			location.href = url.replace("&" + ps, "").replace(ps + "&", "") + "&ps=" + setData.resultNum;
		}
	}
	var setData = {
		listNum: 2, //列数
		resultNum: 20
	};
	setData = initSetData(setData);
	addNewCss();
	//changeResultNum();
	//window.onload=function(){addSettingMenu()};
})();
