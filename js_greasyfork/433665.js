// ==UserScript==
// @name         网易邮箱广告屏蔽
// @namespace    http://tampermonkey.net/
// @version      2021121210070451
// @description  屏蔽网易邮箱的邮箱推荐、顶部导航的网易严选，应用中心，左侧导航的办公模板广告，支持163\126邮箱
// @author       qixiuqx
// @match        https://mail.163.com/*
// @match        https://mail.126.com/*
// @match        https://mail.yeah.net/*
// @match        https://yeah.net/*
// @match        https://hw.mail.163.com/*
// @match        https://hw.mail.126.com/*
// @icon         https://mail.163.com/favicon.ico
// @grant        none
// @resource     elementCSS  https://at.alicdn.com/t/font_2872618_ru3rtyzdxlp.css?spm=a313x.7781069.1998910419.39&file=font_2872618_ru3rtyzdxlp.css
// @downloadURL https://update.greasyfork.org/scripts/433665/%E7%BD%91%E6%98%93%E9%82%AE%E7%AE%B1%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/433665/%E7%BD%91%E6%98%93%E9%82%AE%E7%AE%B1%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function () {
	"use strict";
	// 默认全部屏蔽，之后的数据保存到本地
	let userSettingsArr = [];
	let arr = JSON.parse(localStorage.getItem("adUserSettingsArr")) || []; //默认屏蔽所有的广告，
	arr.length > 0
		? (userSettingsArr = arr)
		: (userSettingsArr = [true, true, true, true, true]);

	// 页面加载完成，加载屏蔽
	window.onload = function () {
		// 界面中的设置按钮
		userSettings();
		// 隐藏登录页广告
		homeAdEl();
		// 页面广告元素隐藏
		pageAdEl();
		// 导航
		navItemEl();
	};

	/**
	 *添加head  的link样式以引入字体图标
	 */
	function addHeadLink() {
		let head = document.querySelector("head");
		let headEl = document.createElement("link");
		headEl.rel = "stylesheet";
		headEl.href =
			"https://at.alicdn.com/t/font_2872618_ru3rtyzdxlp.css?spm=a313x.7781069.1998910419.39&file=font_2872618_ru3rtyzdxlp.css";
		head.appendChild(headEl);
		let styleEl = addElStyle();
		head.appendChild(styleEl);
	}

	/**
	 *
	 * 添加css样式方法，脚本的所有css 都将在这里定义
	 * @returns style 标签
	 */
	function addElStyle() {
		let style = document.createElement("style");
		style.type = "text/css";
		style.innerHTML = `

    /* 设置按钮 */
    #ad_user_settings {
      position: fixed;
				right: 270px;
				top: 10px;
				z-index: 999;
				width: 30px;
				height: 30px;
				font-size: 30px;
				text-align: center;
				line-height: 30px;
        color: #1c1919;
        cursor: pointer;
    }
    /* 设置盒子 */
    .ad_user_setting_box {
      display:none;
      position: absolute;
      top: 100%;
      right: -150%;
      width: max-content;
      /* height: max-content; */
      background-color: #fff;
      border: 1px solid #d2d2d2;
      border-radius: 5px;
      font-size: 14px;
      text-align-last: left;
    }
    /* 设置盒子 在鼠标经过设置按钮的时候显示  离开的时候隐藏 */
    #ad_user_settings:hover .ad_user_setting_box {
      display: block;
    }
    .ad_user_setting_box:hover {
      display: block;
    }


    /* 设置item */
    .user_settings_box_item {
      padding: 0 10px;
      color: #444;
      width: max-content;
      height: max-content;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .user_settings_box_item label {
      margin-left: 5px;
    }
    .user_settings_box_tip{
      padding: 0 10px;
      font-size:12px;
      color: 999;
    }
    `;

		return style;
	}

	/**
     设置按钮
	 */
	function userSettings() {
		//引入字体图标
		addHeadLink();
		let body = document.querySelector("body");
		let userSettingsEl = document.createElement("div");
		userSettingsEl.id = "ad_user_settings";
		userSettingsEl.title = "网易邮箱广告屏蔽设置";
		userSettingsEl.classList = "iconfont icon-setting-fill";
		body.appendChild(userSettingsEl);
		userSettingsBox(userSettingsEl);
	}

	/**
	 * 设置盒子
	 */
	function userSettingsBox(fatherEl) {
		let settingBox = document.createElement("div");
		settingBox.classList = "ad_user_setting_box";
		fatherEl.appendChild(settingBox);
		userSettingsBoxItem(settingBox);
	}

	/**
	 * 设置的项目
	 */
	function userSettingsBoxItem(fatherEl) {
		fatherEl.innerHTML = `
		    <div class="user_settings_box_item">
		    <input type="checkbox" name="" id="yanxuan" class="user_select_ipt_checkbox" />
		    <label for="yanxuan">屏蔽 网易严选</label>
		    </div>
		    <div class="user_settings_box_item">
		      <input type="checkbox" name="" id="applicationCenter" class="user_select_ipt_checkbox"/>
		      <label for="applicationCenter">屏蔽 应用中心</label>
		    </div>
		    <div class="user_settings_box_item">
		      <input type="checkbox" name="" id="addressBook" class="user_select_ipt_checkbox"/>
		      <label for="addressBook">屏蔽 通讯录</label>
		    </div>
		    <div class="user_settings_box_item">
		      <input type="checkbox" name="" id="VipEmail" class="user_select_ipt_checkbox"/>
		      <label for="VipEmail">屏蔽 开通会员邮箱</label>
		    </div>
		    <div class="user_settings_box_item">
		      <input type="checkbox" name="" id="OfficeModel" class="user_select_ipt_checkbox"/>
		      <label for="OfficeModel">屏蔽 办公文档模板</label>
		    </div>
		    <div class='user_settings_box_tip'>Tip:设置完记得刷新页面</div>
		    `;

		checkUserSetting();
	}

	/**
	 * 为所有的checkbox 绑定事件
	 */
	function checkUserSetting() {
		let checkboxArr = document.querySelectorAll(".user_select_ipt_checkbox");
		initCheckedStatus(checkboxArr);
		checkboxArr.forEach((item, i) => {
			item.onchange = function () {
				userSettingsArr[i] = checkboxArr[i].checked;
				localStorage.setItem(
					"adUserSettingsArr",
					JSON.stringify(userSettingsArr)
				);
			};
		});
	}

	/**
	 * 初始化默认全部屏蔽
	 */
	function initCheckedStatus(el) {
		el.forEach((item, i) => {
			el[i].checked = userSettingsArr[i];
		});
		localStorage.setItem("adUserSettingsArr", JSON.stringify(userSettingsArr));
	}

	let homeAdEl = function () {
		let homeAd = document.querySelector("#theme")
		let mainAppAd = document.querySelector(".mailApp")
		let loginBox = document.querySelector("#loginBlock")
		if (homeAd) {
			homeAd.parentNode.removeChild(homeAd)
		}
		if (mainAppAd) {
			mainAppAd.parentNode.removeChild(mainAppAd)
		}
		if (loginBox) {
			if (window.location.href.match(/yeah.net/)) {
				loginBox.style.left = "-50%"
				loginBox.style.transform = "translateX(-50%)"
				return
			} else {
				loginBox.style.left = "50%"
				loginBox.style.transform = "translateX(-50%)"
			}

		}

	}


	/**
	 * 隐藏页面中的广告
	 */
	let pageAdEl = function () {
		let bottomAd = document.querySelector(".gWel-bottom");
		let adElWrap = document.querySelector(".gWel-recommend");
		let vipEl = document.querySelector("#_mail_component_128_128");
		//底部广告
		if (adElWrap) {
			bottomAd.removeChild(adElWrap);
		}
		//顶部vip广告
		if (vipEl && userSettingsArr[3]) {
			vipEl.style.display = "none";
		}
		//左侧办公模板广告
		let tree = document.querySelector(".nui-tree");
		let treeEl = document.querySelectorAll(".nui-tree-item-text");
		for (let i = treeEl.length - 1; i > 0; i--) {
			if (treeEl[i].outerText === "办公模板" && userSettingsArr[4]) {
				tree.removeChild(tree.children[i]);
			}
		}
	};

	/**
	 * 顶部导航移除广告
	 */
	let navItemEl = function () {
		let navWrap = document.querySelector(".js-component-tab");
		if (navWrap) {
			let navItemArr = navWrap.querySelectorAll("li");
			if (navItemArr.length > 0) {
				for (let i = 0; i < navItemArr.length; i++) {
					//网易严选
					if (navItemArr[i].title === "网易严选" && userSettingsArr[0]) {
						navWrap.removeChild(navItemArr[i]);
					}
					//应用中心
					if (navItemArr[i].title === "应用中心" && userSettingsArr[1]) {
						navWrap.removeChild(navItemArr[i]);
					}
					//通讯录
					if (navItemArr[i].title === "通讯录" && userSettingsArr[2]) {
						navWrap.removeChild(navItemArr[i]);
					}
				}
			}
		}
	};
})();
