// ==UserScript==
// @name         Luogu Search AnyWhere Refit
// @namespace    https://greasyfork.org/zh-CN/scripts/479147
// @version      0.4.0
// @description  Search AnyWhere in Luogu!
// @author       tiger2005 & d0j1a_1701 & accomplishment
// @match        https://www.luogu.com.cn/*
// @grant        GM.xmlHttpRequest
// @connect      lgbbs.oiso.cf
// @icon         https://cdn.luogu.com.cn/upload/usericon/3.png
// @license      MIT
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/479147/Luogu%20Search%20AnyWhere%20Refit.user.js
// @updateURL https://update.greasyfork.org/scripts/479147/Luogu%20Search%20AnyWhere%20Refit.meta.js
// ==/UserScript==

(function ($, undefined) {
	"use strict";
	$(function () {
		Date.prototype.pattern = function (format) {
			var date = {
				"y+": this.getYear (),
				"M+": this.getMonth () + 1,
				"d+": this.getDate (),
				"h+": this.getHours (),
				"m+": this.getMinutes (),
				"s+": this.getSeconds (),
				"q+": Math.floor ((this.getMonth () + 3) / 3),
				"S+": this.getMilliseconds (),
			};
			if (/(y+)/i.test (format)) {
				format = format.replace (
					RegExp.$1,
					(this.getFullYear () + "").substr (4 - RegExp.$1.length)
				);
			}
			for (var k in date) {
				if (new RegExp ("(" + k + ")").test (format)) {
					format = format.replace (
						RegExp.$1,
						RegExp.$1.length == 1
							? date [k]
							: ("00" + date [k]).substr (("" + date [k]).length)
					);
				}
			}
			return format;
		};
		var settings = localStorage.getItem ("lsaw_settings");
		if (settings == undefined || settings == "undefined") settings = {};
		else settings = JSON.parse (settings);
		var majorSettings = [
			["lsawUserDisplay", true],
			["lsawProblemDisplay", true],
			["lsawOfficialListDisplay", false],
			["lsawSelectListDisplay", false],
			["lsawDiscussDisplay", true],
			["lsawProblemDisplayNumber", 50],
			["lsawListDisplayNumber", 50],
		];
		for (var i = 0; i < majorSettings.length; i++) {
			var key = majorSettings [i][0],
				val = majorSettings [i][1];
			if (settings [key] == undefined || typeof settings [key] != typeof val)
				settings [key] = val;
		}
		localStorage.setItem ("lsaw_settings", JSON.stringify (settings));
		//console.log (document.getElementsByTagName ('head')[0].innerHTML = document.getElementsByTagName ('head')[0].innerHTML.replace ('default-src \'unsafe-inline\' luogu.com.cn *.luogu.com.cn luogu.org *.luogu.org *.cnzz.com luoguprivate.oss-cn-hangzhou.aliyuncs.com luogu.oss-cn-hangzhou.aliyuncs.com wss: blob:; img-src * data:; font-src * data:; frame-src https://player.bilibili.com https://www.bilibili.com','default-src \'unsafe-inline\' luogu.com.cn *.luogu.com.cn luogu.org *.luogu.org *.cnzz.com luoguprivate.oss-cn-hangzhou.aliyuncs.com luogu.oss-cn-hangzhou.aliyuncs.com lgbbs.oiso.cf wss: blob:; img-src * data:; font-src * data:; frame-src https://player.bilibili.com https://www.bilibili.com'));
		let discuss_link = document.querySelectorAll ("a");
		for (let link of discuss_link) {
			if (link.href.indexOf ("/discuss/show?postid") == -1) continue;
			let d_id_l = link.href.match (/[0-9]/g);
			let d_id = "";
			for (let x of d_id_l) d_id += x;
			GM.xmlHttpRequest ({
				method: "get",
				url: `https://lgbbs.oiso.cf/show.php?url=https://www.luogu.com.cn/discuss/${d_id}`,
				onload: function (res) {
					if (res.status != 200) {
						return;
					}
					console.info (
						`[LSA-X] Successfully saved discuss: https://www.luogu.com.cn/discuss/${d_id}`
					);
				},
			});
		}
		$("body").append (`
        <style>
            .searchAnywhere {
                position: fixed;
                top: 0px;
                left: 0px;
                height: 100%;
                width: 100%;
                background-color: rgba (0, 0, 0, 0.8);
                z-index: 999;
                transition: 0.2s;
                color: white;
            }
            .searchAnywhereMain {
                height: min (600px, 100% - 10px);
                width: min (750px, 100% - 10px);
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate (-50%, -50%);
                display: flex;
                flex-direction: column;
            }
            .inputArea {
                display: block;
                width: 100%;
                height: 48px;
                color: #aaa;
                position: relative;
                transition: 0.2s;
                margin-bottom: 10px;
            }
            .inputArea > input {
                border-radius: 5px;
                border: 2px solid #aaa;
                height: 48px;
                width: 100%;
                font-size: 18px;
                color: #aaa;
                padding: 14px 24px;
                outline: 0;
                background: transparent;
                box-sizing: border-box;
            }
            .inputArea.onHover > input, .inputArea.onFocus > input {
                border: 2px solid white;
            }
            .inputArea.onHover, .inputArea.onFocus, .inputArea.withContent {
                color: white !important;
            }
            .inputArea.onHover > input, .inputArea.onFocus > input, .inputArea.withContent > input {
                color: white !important;
            }
            .inputArea.withIconLeft > input {
                padding-left: 42px;
            }
            .inputArea.withIconRight > input {
                padding-right: 42px;
            }
            .inputArea > div.iconLeft {
                height: 48px;
                width: 48px;
                position: absolute;
                display: grid;
                place-items: center;
                top: 0px;
                left: 0px;
            }
            .inputArea > div.iconRight {
                height: 48px;
                width: 48px;
                position: absolute;
                display: grid;
                place-items: center;
                top: 0px;
                right: 0px;
            }
            .inputArea > div.iconLeft > svg {
                width: 20px !important;
                height: 20px !important;
            }
            .inputArea > div.iconRight > svg {
                width: 20px !important;
                height: 20px !important;
            }

            .inputAreaSmall {
                display: block;
                width: 100%;
                height: 30px;
                color: #aaa;
                position: relative;
                transition: 0.2s;
            }
            .inputAreaSmall > input {
                border-radius: 5px;
                border: 2px solid #aaa;
                height: 30px;
                width: 100%;
                font-size: 18px;
                color: #aaa;
                padding: 5px 10px;
                outline: 0;
                background: transparent;
                box-sizing: border-box;
            }
            .inputAreaSmall.onHover > input, .inputAreaSmall.onFocus > input {
                border: 2px solid white;
            }
            .inputAreaSmall.onHover, .inputAreaSmall.onFocus, .inputAreaSmall.withContent {
                color: white !important;
            }
            .inputAreaSmall.onHover > input, .inputAreaSmall.onFocus > input, .inputAreaSmall.withContent > input {
                color: white !important;
            }

            .userPurple {
                color: #cf5bff;
                font-weight: bold;
            }
            .userRed {
                color: #e74c3c;
                font-weight: bold;
            }
            .userOrange {
                color: #e67e22;
                font-weight: bold;
            }
            .userYellow {
                color: #d9a71d;
                font-weight: bold;
            }
            .userGreen {
                color: #5eb95e;
                font-weight: bold;
            }
            .userGray {
                color: #aaa;
                font-weight: bold;
            }
            .userCheater {
                color: #d3961c;
                font-weight: bold;
            }
            .userBlue {
                color: #07a2f1;
                font-weight: bold;
            }
            .userGold {
                color: #f1c40f;
                font-weight: bold;
            }
            .badgePurple {
                background-color: #cf5bff;
            }
            .badgeRed {
                background-color: #e74c3c;
            }
            .badgeOrange {
                background-color: #e67e22;
            }
            .badgeYellow {
                background-color: #d9a71d;
            }
            .badgeGreen {
                background-color: #5eb95e;
            }
            .badgeGray {
                background-color: #999;
            }
            .badgeCheater {
                background-color: #d3961c;
            }
            .badgeBlue {
                background-color: #07a2f1;
            }
            .badgeBlack {
                background-color: #0e1d69;
            }
            .badgeGold {
                background-color: #f1c40f;
            }
            .searchAnywhereContent {
                color: white;
                flex: 1;
                scrollbar-width: none;
                -ms-overflow-style: none;
                overflow-x: hidden;
                overflow-y: auto;
            }
            .searchAnywhereContent::-webkit-scrollbar { width: 0 !important; }
            .searchUserCard {
                background: #444;
                border-radius: 10px;
                display: flex;
                flex-direction: column;
                cursor: pointer;
                color: white;
                padding: 10px;
                line-height: 1;
                margin-bottom: 10px;
                border: 2px solid #888;
                box-sizing: border-box;
            }
            .searchCard.light {
                border: 2px solid white;
            }
            .searchUserCard > div {
                width: 100%;
            }
            .searchUserCardBody {
                display: flex;
                flex-direction: row;
            }
            .searchUserCardImg {
                height: 36px;
                width: 36px;
                border-radius: 50%;
                margin-right: 10px;
            }
            .searchUserCardInfo > span:first-child {
                font-size: 14px;
                margin-bottom: 3px;
                display: inline-block;
                color: #bbb;
            }
            .searchUserCardInfo > span:last-child {
                font-size: 20px;
            }
            .searchUserCardMedia {
                display: flex;
                flex-direction: row;
            }
            .searchUserCardMedia > div {
                margin-top: 5px;
                flex: 1;
                display: inline-block;
                height: 23px;
                verticle-align: center;
            }
            .searchUserCardMedia > div > div {
                padding: 4px;
                position: relative;
                display: inline-block;
                background: #777;
                margin-right: 15px;
            }
            .searchUserCardMedia > div > div:after {
                width: 10px;
                height: 100%;
                content: "";
                border: 5px;
                position: absolute;
                top: 0px;
                left: 100%;
                clip-path: polygon (0 0,100% 50%,0 100%);
                background-color: inherit;
            }
            .userBadgeInfo {
                font-size: 14px;
                padding: 2px 5px;
                border-radius: 5px;
                color: white;
                font-weight: bold;
                margin: 0px 3px;
                display: inline-block;
            }
            .searchProblemCard {
                background: #444;
                border-radius: 10px;
                display: flex;
                flex-direction: column;
                cursor: pointer;
                color: white;
                padding: 10px;
                line-height: 1;
                margin-bottom: 10px;
                border: 2px solid #888;
                box-sizing: border-box;
            }
            .searchProblemCard > div {
                width: 100%;
                display: flex;
                flex-direction: row;
            }
            .searchProblemCard > div:last-child {
                margin-top: 5px;
            }
            .searchProblemCardTag {
                margin-right: 12px;
                display: inline-flex;
                flex-direction: row;
                line-height: 24px;
                height: 24px;
                overflow: hidden;
            }
            .searchProblemCardTag > div {
                padding: 2px;
                position: relative;
                display: inline-block;
                margin-right: 5px;
            }
            .searchListCardTag {
                margin-right: 12px;
                display: inline-flex;
                flex-direction: row;
                line-height: 24px;
                height: 24px;
                overflow: hidden;
            }
            .searchListCardTag > div {
                padding: 2px;
                position: relative;
                display: inline-block;
                margin-right: 5px;
            }
            .searchListCardTag svg, .searchProblemCardTag svg {
                height: 20px !important;
                width: 20px !important;
            }
            .problemTagInfo {
                font-size: 16px;
                padding: 4px 7px;
                border-radius: 5px;
                color: white;
                display: inline-block;
            }
            .searchProblemCardBody > div:first-child {
                margin-right: 5px;
            }

            .searchListCard {
                background: #444;
                border-radius: 10px;
                display: flex;
                flex-direction: column;
                cursor: pointer;
                color: white;
                padding: 10px;
                line-height: 1;
                margin-bottom: 10px;
                border: 2px solid #888;
                box-sizing: border-box;
                position: relative;
            }
            .searchListCard > div {
                width: 100%;
                display: flex;
                flex-direction: row;
            }
            .searchListCardBody > div:first-child {
                margin-right: 5px;
            }
            .searchListCardBody {
                margin-bottom: 5px;
            }

            .searchAnywhereSettings {
                position: fixed;
                top: 0px;
                left: 0px;
                height: 100%;
                width: 100%;
                background-color: rgba (0, 0, 0, 0.8);
                z-index: 1000;
                transition: 0.2s;
                color: white;
            }
            .searchAnywhereSettingsMain {
                height: min (300px, 100% - 10px);
                width: min (450px, 100% - 10px);
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate (-50%, -50%);
                display: flex;
                flex-direction: column;
            }
            .searchAnywhereSettingsContent {
                flex: 1;
                scrollbar-width: none;
                -ms-overflow-style: none;
                overflow-x: hidden;
                overflow-y: auto;
            }
            .searchAnywhereSettingsBag {
                margin-bottom: 8px;
                user-select: none;
                font-size: 20px;
                position: relative;
                line-height: 30px;
            }
            .searchAnywhereClicky {
                position: relative;
                height: 30px;
                width: 30px;
            }
            .searchAnywhereClicky div {
                 transition: 0.2s;
                 position: absolute;
                 top: 0px;
                 left: 0px;
                 cursor: pointer;
            }
            .searchAnywhereClicky div svg {
                height: 30px;
                width: 30px;
            }
            .searchAnywhereClicky [flag=false] .falseBlock {
                opacity: 1;
            }
            .searchAnywhereClicky [flag=true] .falseBlock {
                opacity: 0;
            }
            .searchAnywhereClicky [flag=true] .trueBlock {
                opacity: 1;
            }
            .searchAnywhereClicky [flag=false] .trueBlock {
                opacity: 0;
            }
            .searchAnywhereSettingsContent::-webkit-scrollbar { width: 0 !important; }
            .searchAnywhereCloseSettings {
                display: inline-grid;
                place-items: center;
                width: 32px;
                height: 32px;
                cursor: pointer;
                border-radius: 50%;
                background: white;
            }
            .searchAnywhereCloseSettings:hover {
                background: #aaa;
            }
            .searchCard.light, .searchCard {
                color: white !important;
            }
            .searchAnywhereContent > div > div > a:hover {
                color: #83c4ef;
            }
        </style>
        <div class='searchAnywhere' style="opacity: 0; display: none;">
            <div class='searchAnywhereMain'>
                <div class='inputArea withIconLeft withIconRight searchAnywhereMainInput'>
                    <input spellcheck="false" placeholder="Search AnyWhere"/>
                    <div class="iconLeft"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-search fa-w-24"><path data-v-1ad550c8=""data-v-303bbf52="" fill="currentColor" d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z" class=""></path></svg></div>
                    <div class="iconRight"><svg style="cursor: pointer" class="searchAnywhereSettingsLink" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" aria-hidden="true" role="img"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path fill="currentColor" d="M495.9 166.6C499.2 175.2 496.4 184.9 489.6 191.2L446.3 230.6C447.4 238.9 448 247.4 448 256C448 264.6 447.4 273.1 446.3 281.4L489.6 320.8C496.4 327.1 499.2 336.8 495.9 345.4C491.5 357.3 486.2 368.8 480.2 379.7L475.5 387.8C468.9 398.8 461.5 409.2 453.4 419.1C447.4 426.2 437.7 428.7 428.9 425.9L373.2 408.1C359.8 418.4 344.1 427 329.2 433.6L316.7 490.7C314.7 499.7 307.7 506.1 298.5 508.5C284.7 510.8 270.5 512 255.1 512C241.5 512 227.3 510.8 213.5 508.5C204.3 506.1 197.3 499.7 195.3 490.7L182.8 433.6C167 427 152.2 418.4 138.8 408.1L83.14 425.9C74.3 428.7 64.55 426.2 58.63 419.1C50.52 409.2 43.12 398.8 36.52 387.8L31.84 379.7C25.77 368.8 20.49 357.3 16.06 345.4C12.82 336.8 15.55 327.1 22.41 320.8L65.67 281.4C64.57 273.1 64 264.6 64 256C64 247.4 64.57 238.9 65.67 230.6L22.41 191.2C15.55 184.9 12.82 175.3 16.06 166.6C20.49 154.7 25.78 143.2 31.84 132.3L36.51 124.2C43.12 113.2 50.52 102.8 58.63 92.95C64.55 85.8 74.3 83.32 83.14 86.14L138.8 103.9C152.2 93.56 167 84.96 182.8 78.43L195.3 21.33C197.3 12.25 204.3 5.04 213.5 3.51C227.3 1.201 241.5 0 256 0C270.5 0 284.7 1.201 298.5 3.51C307.7 5.04 314.7 12.25 316.7 21.33L329.2 78.43C344.1 84.96 359.8 93.56 373.2 103.9L428.9 86.14C437.7 83.32 447.4 85.8 453.4 92.95C461.5 102.8 468.9 113.2 475.5 124.2L480.2 132.3C486.2 143.2 491.5 154.7 495.9 166.6V166.6zM256 336C300.2 336 336 300.2 336 255.1C336 211.8 300.2 175.1 256 175.1C211.8 175.1 176 211.8 176 255.1C176 300.2 211.8 336 256 336z"/></svg></div>
                </div>
                <div class='searchAnywhereContent'>
                </div>
            </div>
        </div>
        <div class='searchAnywhereSettings' style="opacity: 0; display: none;">
            <div class='searchAnywhereSettingsMain'>
                <div class="searchAnywhereSettingsContent">
                    <div>
                        <div class="searchAnywhereSettingsBag" for="lsawUserDisplay">
                            显示用户
                            <div style="float: right" class="searchAnywhereClicky" flag="${settings.lsawUserDisplay}">
                                <div class="falseBlock">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path fill="currentColor" d="M384 32C419.3 32 448 60.65 448 96V416C448 451.3 419.3 480 384 480H64C28.65 480 0 451.3 0 416V96C0 60.65 28.65 32 64 32H384zM384 80H64C55.16 80 48 87.16 48 96V416C48 424.8 55.16 432 64 432H384C392.8 432 400 424.8 400 416V96C400 87.16 392.8 80 384 80z"/></svg>
                                </div>
                                <div class="trueBlock">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path fill="currentColor" d="M384 32C419.3 32 448 60.65 448 96V416C448 451.3 419.3 480 384 480H64C28.65 480 0 451.3 0 416V96C0 60.65 28.65 32 64 32H384zM339.8 211.8C350.7 200.9 350.7 183.1 339.8 172.2C328.9 161.3 311.1 161.3 300.2 172.2L192 280.4L147.8 236.2C136.9 225.3 119.1 225.3 108.2 236.2C97.27 247.1 97.27 264.9 108.2 275.8L172.2 339.8C183.1 350.7 200.9 350.7 211.8 339.8L339.8 211.8z"/></svg>
                                </div>
                            </div>
                        </div>
                        <div class="searchAnywhereSettingsBag" for="lsawProblemDisplay">
                            显示题目
                            <div style="float: right" class="searchAnywhereClicky" flag="${settings.lsawProblemDisplay}">
                                <div class="falseBlock">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path fill="currentColor" d="M384 32C419.3 32 448 60.65 448 96V416C448 451.3 419.3 480 384 480H64C28.65 480 0 451.3 0 416V96C0 60.65 28.65 32 64 32H384zM384 80H64C55.16 80 48 87.16 48 96V416C48 424.8 55.16 432 64 432H384C392.8 432 400 424.8 400 416V96C400 87.16 392.8 80 384 80z"/></svg>
                                </div>
                                <div class="trueBlock">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path fill="currentColor" d="M384 32C419.3 32 448 60.65 448 96V416C448 451.3 419.3 480 384 480H64C28.65 480 0 451.3 0 416V96C0 60.65 28.65 32 64 32H384zM339.8 211.8C350.7 200.9 350.7 183.1 339.8 172.2C328.9 161.3 311.1 161.3 300.2 172.2L192 280.4L147.8 236.2C136.9 225.3 119.1 225.3 108.2 236.2C97.27 247.1 97.27 264.9 108.2 275.8L172.2 339.8C183.1 350.7 200.9 350.7 211.8 339.8L339.8 211.8z"/></svg>
                                </div>
                            </div>
                        </div>
                        <div class="searchAnywhereSettingsBag" for="lsawOfficialListDisplay">
                            显示官方题单
                            <div style="float: right" class="searchAnywhereClicky" flag="${settings.lsawOfficialListDisplay}">
                                <div class="falseBlock">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path fill="currentColor" d="M384 32C419.3 32 448 60.65 448 96V416C448 451.3 419.3 480 384 480H64C28.65 480 0 451.3 0 416V96C0 60.65 28.65 32 64 32H384zM384 80H64C55.16 80 48 87.16 48 96V416C48 424.8 55.16 432 64 432H384C392.8 432 400 424.8 400 416V96C400 87.16 392.8 80 384 80z"/></svg>
                                </div>
                                <div class="trueBlock">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path fill="currentColor" d="M384 32C419.3 32 448 60.65 448 96V416C448 451.3 419.3 480 384 480H64C28.65 480 0 451.3 0 416V96C0 60.65 28.65 32 64 32H384zM339.8 211.8C350.7 200.9 350.7 183.1 339.8 172.2C328.9 161.3 311.1 161.3 300.2 172.2L192 280.4L147.8 236.2C136.9 225.3 119.1 225.3 108.2 236.2C97.27 247.1 97.27 264.9 108.2 275.8L172.2 339.8C183.1 350.7 200.9 350.7 211.8 339.8L339.8 211.8z"/></svg>
                                </div>
                            </div>
                        </div>
                        <div class="searchAnywhereSettingsBag" for="lsawSelectListDisplay">
                            显示用户题单
                            <div style="float: right" class="searchAnywhereClicky" flag="${settings.lsawSelectListDisplay}">
                                <div class="falseBlock">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path fill="currentColor" d="M384 32C419.3 32 448 60.65 448 96V416C448 451.3 419.3 480 384 480H64C28.65 480 0 451.3 0 416V96C0 60.65 28.65 32 64 32H384zM384 80H64C55.16 80 48 87.16 48 96V416C48 424.8 55.16 432 64 432H384C392.8 432 400 424.8 400 416V96C400 87.16 392.8 80 384 80z"/></svg>
                                </div>
                                <div class="trueBlock">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path fill="currentColor" d="M384 32C419.3 32 448 60.65 448 96V416C448 451.3 419.3 480 384 480H64C28.65 480 0 451.3 0 416V96C0 60.65 28.65 32 64 32H384zM339.8 211.8C350.7 200.9 350.7 183.1 339.8 172.2C328.9 161.3 311.1 161.3 300.2 172.2L192 280.4L147.8 236.2C136.9 225.3 119.1 225.3 108.2 236.2C97.27 247.1 97.27 264.9 108.2 275.8L172.2 339.8C183.1 350.7 200.9 350.7 211.8 339.8L339.8 211.8z"/></svg>
                                </div>
                            </div>
                        </div>
                        <div class="searchAnywhereSettingsBag" for="lsawDiscussDisplay">
                            显示讨论
                            <div style="float: right" class="searchAnywhereClicky" flag="${settings.lsawDiscussDisplay}">
                                <div class="falseBlock">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path fill="currentColor" d="M384 32C419.3 32 448 60.65 448 96V416C448 451.3 419.3 480 384 480H64C28.65 480 0 451.3 0 416V96C0 60.65 28.65 32 64 32H384zM384 80H64C55.16 80 48 87.16 48 96V416C48 424.8 55.16 432 64 432H384C392.8 432 400 424.8 400 416V96C400 87.16 392.8 80 384 80z"/></svg>
                                </div>
                                <div class="trueBlock">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path fill="currentColor" d="M384 32C419.3 32 448 60.65 448 96V416C448 451.3 419.3 480 384 480H64C28.65 480 0 451.3 0 416V96C0 60.65 28.65 32 64 32H384zM339.8 211.8C350.7 200.9 350.7 183.1 339.8 172.2C328.9 161.3 311.1 161.3 300.2 172.2L192 280.4L147.8 236.2C136.9 225.3 119.1 225.3 108.2 236.2C97.27 247.1 97.27 264.9 108.2 275.8L172.2 339.8C183.1 350.7 200.9 350.7 211.8 339.8L339.8 211.8z"/></svg>
                                </div>
                            </div>
                        </div>
                        <div class="searchAnywhereSettingsBag" for="lsawProblemDisplayNumber">
                            题目展示数量
                            <div style="float: right; width: 150px">
                                <div class="inputAreaSmall withContent">
                                    <input type="number" min="1" max="50" value="${settings.lsawProblemDisplayNumber}" class="withContent"/>
                                </div>
                            </div>
                        </div>
                        <div class="searchAnywhereSettingsBag" for="lsawListDisplayNumber">
                            题单展示数量
                            <div style="float: right; width: 150px">
                                <div class="inputAreaSmall withContent">
                                    <input type="number" min="1" max="50" value="${settings.lsawListDisplayNumber}" class="withContent"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style="margin-top: 10px; text-align: center; width: 100%;">
                    <div class="searchAnywhereCloseSettings">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" class="icon svg-inline--fa fa-times fa-w-11" data-v-303bbf52=""style="transform: scale (1.2); width: 16px; height: 16px; color: rgb (231, 76, 60);"><path data-v-1b44b3e6="" fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" class=""></path></svg>
                    </div>
                </div>
            </div>
        </div>
    `);
		$(".inputArea > input").focus (function () {
			$(this).parent ().addClass ("onFocus");
		});
		$(".inputArea > input").blur (function () {
			$(this).parent ().removeClass ("onFocus");
			if ($(this).val ().length != 0) $(this).parent ().addClass ("withContent");
			else $(this).parent ().removeClass ("withContent");
		});
		$(".inputArea").mouseenter (function () {
			$(this).addClass ("onHover");
		});
		$(".inputArea").mouseleave (function () {
			$(this).removeClass ("onHover");
		});
		$(".inputAreaSmall > input").focus (function () {
			$(this).parent ().addClass ("onFocus");
		});
		$(".inputAreaSmall > input").blur (function () {
			$(this).parent ().removeClass ("onFocus");
			if ($(this).val ().length != 0) $(this).parent ().addClass ("withContent");
			else $(this).parent ().removeClass ("withContent");
		});
		$(".inputAreaSmall").mouseenter (function () {
			$(this).addClass ("onHover");
		});
		$(".inputAreaSmall").mouseleave (function () {
			$(this).removeClass ("onHover");
		});
		$(".searchAnywhereClicky").click (function () {
			var a = $(this).attr ("flag");
			if (a == "false") {
				a = true;
				$(this).attr ("flag", a);
			} else {
				a = false;
				$(this).attr ("flag", a);
			}
			var settingsName = $(this).parent ().attr ("for");
			settings [settingsName] = a;
			localStorage.setItem ("lsaw_settings", JSON.stringify (settings));
		});
		$(".inputAreaSmall input").change (function () {
			var a = Number ($(this).val ());
			var settingsName = $(this).parent ().parent ().parent ().attr ("for");
			settings [settingsName] = a;
			localStorage.setItem ("lsaw_settings", JSON.stringify (settings));
		});
		$(".searchAnywhereCloseSettings").click (function () {
			$(".searchAnywhereSettings").css ("opacity", "0");
			setTimeout (() => {
				$(".searchAnywhereSettings").css ("display", "none");
			}, 200);
		});
		$(".searchAnywhereSettingsLink").click (function () {
			$(".searchAnywhereSettings").css ("display", "block");
			setTimeout (() => {
				$(".searchAnywhereSettings").css ("opacity", "1");
			}, 20);
		});

		const getColorFromPercent = (x, opa) => {
			let r = 0,
				g = 0,
				b = 0;
			let rr = 231,
				gg = 76,
				bb = 60;
			let rrr = 82,
				ggg = 196,
				bbb = 26;
			//if (x < 0.5){
			//  r = 255;
			//  g = one * x;
			// }
			//else {
			//  r = 255 - ((x - 0.5) * one);
			//  g = 255;
			// }
			r = rr + (rrr - rr) * x;
			g = gg + (ggg - gg) * x;
			b = bb + (bbb - bb) * x;
			r += (60 - r) * (1 - opa);
			g += (60 - g) * (1 - opa);
			b += (60 - b) * (1 - opa);
			r = Math.floor (r);
			g = Math.floor (g);
			b = Math.floor (b);
			return `rgb (${r}, ${g}, ${b})`;
		};

		const problemColors = [
			"Gray",
			"Red",
			"Orange",
			"Yellow",
			"Green",
			"Blue",
			"Purple",
			"Black",
		];
		const problemNames = [
			"暂无评定",
			"入门",
			"普及 -",
			"普及 / 提高 -",
			"普及 +/ 提高",
			"提高 +/ 省选 -",
			"省选 / NOI-",
			"NOI/NOI+/CTSC",
		];
		var searchTimeout = null;
		var currentHoverCard = undefined;
		const changeHoverCard = (x, scroll = true, align = false) => {
			$(".searchCard.light").removeClass ("light");
			if (x != undefined && scroll)
				$(".searchAnywhereMainInput > input").blur ();
			if (x != undefined) {
				x.addClass ("light").focus (align);
				if (scroll) {
					var heg = x [0].offsetTop;
					var prr = x.parent ().parent ();
					var scr = prr.scrollTop ();
					var r = heg - x.outerHeight () + 5,
						l = r - prr.outerHeight () + x.outerHeight () + 10;
					scr = Math.max (l, Math.min (r, scr));
					prr.scrollTop (scr);
				}
			}
			if (scroll) {
				//remove mouse event
				$(".searchCard").unbind ("mouseenter").unbind ("mouseleave");
				$(document).mousemove (() => {
					$(document).unbind ("mousemove");
					$(".searchCard")
						.unbind ("mouseenter")
						.unbind ("mouseleave")
						.hover (
							function () {
								changeHoverCard ($(this), false);
							},
							function () {
								changeHoverCard (undefined, false);
							}
						);
				});
			}
			currentHoverCard = x;
		};
		const searchInfo = () => {
			searchTimeout = null;
			var info = $(".inputArea > input").val ();
			info = $.trim (info);
			if (info == "") {
				$(".searchAnywhereContent").html ("");
				return;
			}
			//$(".searchAnywhereContent").html (`<div><div style='text-align: center; margin-bottom: 10px; width: 100%; font-size: 20px;'> 加载中……</div></div>`);
			$(".searchAnywhereContent > div")
				.unbind ("click")
				.click ((event) => {
					event.stopPropagation ();
				});
			var probLinkHtml = "";
			var userHtml = "";
			var problemHtml = "";
			var officialHtml = "";
			var selectHtml = "";
			var discussHtml = "";
			var networkError = false;
			var lastHtml = "";
			var refreshContent = function () {
				let Html = "";
				if (networkError)
					Html = `<div><div style='text-align: center; margin-bottom: 10px; width: 100%; font-size: 20px;'> 网络错误 </div></div>`;
				else if (
					probLinkHtml == "" &&
					userHtml == "" &&
					problemHtml == "" &&
					officialHtml == "" &&
					selectHtml == "" &&
					discussHtml == ""
				)
					Html = `<div><div style='text-align: center; margin-bottom: 10px; width: 100%; font-size: 20px;'> 未搜索到相关内容 </div></div>`;
				else {
					changeHoverCard (undefined, false);
					Html =
						`<div>` +
						probLinkHtml +
						userHtml +
						discussHtml +
						problemHtml +
						officialHtml +
						selectHtml +
						`</div>`;
					$(".searchAnywhereContent > div")
						.unbind ("click")
						.click ((event) => {
							event.stopPropagation ();
						});
					$(".searchCard")
						.unbind ("mouseenter")
						.unbind ("mouseleave")
						.hover (
							function () {
								changeHoverCard ($(this), false);
							},
							function () {
								changeHoverCard (undefined, false);
							}
						);
				}
				if (Html != lastHtml) {
					$(".searchAnywhereContent").html (Html);
					lastHtml = Html;
				}
			};
			var refreshInterval = setInterval (refreshContent, 250);
			const getProblemStatus = (x, y) => {
				if (!x && !y)
					return `<svg xmlns="http://www.w3.org/2000/svg"viewBox="0 0 448 512"class="icon svg-inline--fa fa-minus fa-w-14"data-v-303bbf52="" style="width: 16px; height: 16px; color: #aaa"><path data-v-1b44b3e6=""fill="currentColor"d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"class=""></path></svg>`;
				if (!y)
					return `<svg xmlns="http://www.w3.org/2000/svg"viewBox="0 0 352 512"class="icon svg-inline--fa fa-times fa-w-11"data-v-303bbf52="" style="transform: scale (1.2); width: 16px; height: 16px; color: rgb (231, 76, 60);"><path data-v-1b44b3e6=""fill="currentColor"d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"class=""></path></svg>`;
				return `<svg xmlns="http://www.w3.org/2000/svg"viewBox="0 0 512 512"class="icon svg-inline--fa fa-check fa-w-16"data-v-303bbf52="" style="width: 16px; height: 16px; color: rgb (82, 196, 26);"><path data-v-1b44b3e6=""fill="currentColor"d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"class=""></path></svg>`;
			};
			const getCCFLevel = (x) => {
				if (x == null || x < 3) return "";
				var color = "";
				if (x <= 5) color = "#5eb95e";
				else if (x <= 7) color = "#07a2f1";
				else color = "#f1c40f";
				return `<svg xmlns="http://www.w3.org/2000/svg"width="20"height="20"viewBox="0 0 16 16"style="margin: 0px 3px;"fill="${color}"style="margin-bottom: -3px;"><path d="M16 8C16 6.84375 15.25 5.84375 14.1875 5.4375C14.6562 4.4375 14.4688 3.1875 13.6562 2.34375C12.8125 1.53125 11.5625 1.34375 10.5625 1.8125C10.1562 0.75 9.15625 0 8 0C6.8125 0 5.8125 0.75 5.40625 1.8125C4.40625 1.34375 3.15625 1.53125 2.34375 2.34375C1.5 3.1875 1.3125 4.4375 1.78125 5.4375C0.71875 5.84375 0 6.84375 0 8C0 9.1875 0.71875 10.1875 1.78125 10.5938C1.3125 11.5938 1.5 12.8438 2.34375 13.6562C3.15625 14.5 4.40625 14.6875 5.40625 14.2188C5.8125 15.2812 6.8125 16 8 16C9.15625 16 10.1562 15.2812 10.5625 14.2188C11.5938 14.6875 12.8125 14.5 13.6562 13.6562C14.4688 12.8438 14.6562 11.5938 14.1875 10.5938C15.25 10.1875 16 9.1875 16 8ZM11.4688 6.625L7.375 10.6875C7.21875 10.8438 7 10.8125 6.875 10.6875L4.5 8.3125C4.375 8.1875 4.375 7.96875 4.5 7.8125L5.3125 7C5.46875 6.875 5.6875 6.875 5.8125 7.03125L7.125 8.34375L10.1562 5.34375C10.3125 5.1875 10.5312 5.1875 10.6562 5.34375L11.4688 6.15625C11.5938 6.28125 11.5938 6.5 11.4688 6.625Z"></path></svg>`;
			};
			function formatProblemLink (problem) {
				const luoguRegex = /^[PUPTB]\d+$/;
				const codeforcesRegex = /^CF\d+[A-Z]+$/i;
				const atcoderRegex = /^(abc|arc|agc|ahc)\d+[\w_]+$/i;

				if (luoguRegex.test (problem)) {
					return `https://www.luogu.com.cn/problem/${problem}`;
				} else if (codeforcesRegex.test (problem)) {
					const formattedProblem = problem.toUpperCase ();
					return `https://www.luogu.com.cn/problem/${formattedProblem}`;
				} else if (atcoderRegex.test (problem)) {
					const formattedProblem = problem.replace (
						/^(abc|arc|agc|ahc)(\d+)(_*)([\w_]+)$/i,
						"AT_$1$2_$4"
					);
					return `https://www.luogu.com.cn/problem/${formattedProblem}`;
				}

				return null;
			}
			const formatRes = formatProblemLink (info);
			if (formatRes) {
				probLinkHtml = `
                        <a class="searchCard searchProblemCard" href='${formatRes}'>
                            <span > 快速打开：${info}</span>
                        </a>`;
				refreshContent ();
			}
			if (settings.lsawUserDisplay != false)
				$.ajax ({
					url: `/api/user/search?keyword=${info}`,
					type: "GET",
					success: function (json) {
						json = json.users;
						if (json.length != 0 && json [0] != null) {
							userHtml = `
                        <div style='text-align: left; margin-bottom: 10px; width: 100%; font-size: 18px; font-weight: bold'> 用户 </div>
                    `;
							json.forEach ((item) => {
								if (item == null) return;
								if (item.color == "Cheater") item.badge = "作弊者";
								userHtml += `
                            <a class="searchCard searchUserCard" href='https://www.luogu.com.cn/user/${
															item.uid
														}'>
                            <div class="searchUserCardBody">
                                <div class="searchUserCardImg" style="background: url (https://cdn.luogu.com.cn/upload/usericon/${
																	item.uid
																}.png); background-size: 36px 36px;"></div>
                                <div class="searchUserCardInfo"><span>UID ${
																	item.uid
																}</span><br/><div style='display: flex; flex-direction: row'><span class="user${
									item.color
								}"style="line-height: 20px">${item.name}</span>${getCCFLevel (
									item.ccfLevel
								)}${
									item.badge != null && item.badge != ""
										? `<div class='userBadgeInfo badge${item.color}'>${item.badge}</div>`
										: ""
								}</div></div>
                            </div>
                        </a>`;
							});
						}
					},
					error: () => {
						networkError = true;
					},
				});
			if (settings.lsawProblemDisplay != false) {
				$.ajax ({
					url: `/problem/list`,
					type: "GET",
					headers: { "x-luogu-type": "content-only" },
					data: {
						keyword: info,
						page: 1,
						type: "P|B|CF|SP|AT|UVA",
					},
					success: function (json) {
						if (json.code != 200) {
							return;
						}
						json = json.currentData.problems;
						if (json.count != 0) {
							problemHtml = `
                        <div style='text-align: left; margin-bottom: 10px; width: 100%; font-size: 18px; font-weight: bold'> 题目 < a href="/problem/list?keyword=${info}&page=1&type=P%7CB%7CCF%7CSP%7CAT%7CUVA" style="cursor: pointer; float: right; font-weight: normal !important" class="searchShowProblems"> 查看所有 ${json.count} 道题目 </a></div>
                    `;
							for (
								var i = 0;
								i < json.result.length && i < settings.lsawProblemDisplayNumber;
								i++
							) {
								let item = json.result [i];
								problemHtml += `
                         <a class="searchCard searchProblemCard" href='/problem/${
														item.pid
													}'>
                            <div class="searchProblemCardBody">
                                <div>${getProblemStatus (
																	item.submitted,
																	item.accepted
																)}</div>
                                <div>${item.title}</div>
                            </div>
                            <div>
                                <div class='searchProblemCardTag'><div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-book fa-w-14"><path data-v-639bc19b=""fill="currentColor"d="M448 360V24c0-13.3-10.7-24-24-24H96C43 0 0 43 0 96v320c0 53 43 96 96 96h328c13.3 0 24-10.7 24-24v-16c0-7.5-3.5-14.3-8.9-18.7-4.2-15.4-4.2-59.3 0-74.7 5.4-4.3 8.9-11.1 8.9-18.6zM128 134c0-3.3 2.7-6 6-6h212c3.3 0 6 2.7 6 6v20c0 3.3-2.7 6-6 6H134c-3.3 0-6-2.7-6-6v-20zm0 64c0-3.3 2.7-6 6-6h212c3.3 0 6 2.7 6 6v20c0 3.3-2.7 6-6 6H134c-3.3 0-6-2.7-6-6v-20zm253.4 250H96c-17.7 0-32-14.3-32-32 0-17.6 14.4-32 32-32h285.4c-1.9 17.1-1.9 46.9 0 64z"class=""></path></svg></div>${
																	item.pid
																}</div>
                                <div class='searchProblemCardTag'><div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 544 512" class="svg-inline--fa fa-chart-pie fa-w-17"><path data-v-639bc19b=""fill="currentColor"d="M527.79 288H290.5l158.03 158.03c6.04 6.04 15.98 6.53 22.19.68 38.7-36.46 65.32-85.61 73.13-140.86 1.34-9.46-6.51-17.85-16.06-17.85zm-15.83-64.8C503.72 103.74 408.26 8.28 288.8.04 279.68-.59 272 7.1 272 16.24V240h223.77c9.14 0 16.82-7.68 16.19-16.8zM224 288V50.71c0-9.55-8.39-17.4-17.84-16.06C86.99 51.49-4.1 155.6.14 280.37 4.5 408.51 114.83 513.59 243.03 511.98c50.4-.63 96.97-16.87 135.26-44.03 7.9-5.6 8.42-17.23 1.57-24.08L224 288z"class=""></path></svg></div>${
																	item.totalSubmit
																}</div>
                                <div class='searchProblemCardTag'><div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="icon svg-inline--fa fa-check fa-w-16" data-v-303bbf52=""style="width: 16px; height: 16px; color: rgb (82, 196, 26);"><path data-v-1b44b3e6="" fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" class=""></path></svg></div>${
																	item.totalAccepted
																}</div>
                                <div style='flex: 1; text-align: right'>
                                    <div class="problemTagInfo badge${
																			problemColors [item.difficulty]
																		}">${problemNames [item.difficulty]}</div>
                                </div>
                            </div>
                        </a>
                        `;
							}
						}
					},
					error: () => {
						networkError = true;
					},
				});
			}
			if (settings.lsawOfficialListDisplay != false)
				$.ajax ({
					url: `/training/list`,
					type: "GET",
					data: {
						keyword: info,
						page: 1,
						type: "official",
					},
					headers: { "x-luogu-type": "content-only" },
					success: (json) => {
						if (json.code != 200) {
							return;
						}
						json = json.currentData;
						if (json.trainings.result.length != 0) {
							officialHtml = `<div style='text-align: left; margin-bottom: 10px; width: 100%; font-size: 18px; font-weight: bold'> 官方题单 < a href="/training/list?keyword=${info}&page=1&type=official"style="cursor: pointer; float: right; font-weight: normal !important"class="searchShowProblems"> 查看所有 ${json.trainings.count} 份题单 </a></div>`;
							for (
								var i = 0;
								i < json.trainings.result.length &&
								i < settings.lsawListDisplayNumber;
								i++
							) {
								var item = json.trainings.result [i];
								var acs = json.acceptedCounts [item.id];
								if (acs == undefined) acs = 0;
								officialHtml += `
                         <a class="searchCard searchListCard" href='/training/${
														item.id
													}' style="background: ${getColorFromPercent (
									acs /item.problemCount,
									0.4
								)} !important">
                            <div class="searchListCardProgress" style="height: 5px; position: absolute; top: -1px; left: 0px; overflow: hidden; border-top-left-radius: 5px; border-top-right-radius: 5px">
                                <div style="width: ${
																	(acs /item.problemCount) * 100
																}%; background: ${getColorFromPercent (
									acs /item.problemCount,
									1
								)}; height: 5px; content: ""></div>
                                <div style="flex: 1"></div>
                            </div>
                            <div class="searchListCardBody">
                                <div>#${item.id}</div>
                                <div>${item.title}</div>
                            </div>
                            <div>
                                <div class='searchListCardTag'><div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-book fa-w-14"><path data-v-639bc19b=""fill="currentColor"d="M448 360V24c0-13.3-10.7-24-24-24H96C43 0 0 43 0 96v320c0 53 43 96 96 96h328c13.3 0 24-10.7 24-24v-16c0-7.5-3.5-14.3-8.9-18.7-4.2-15.4-4.2-59.3 0-74.7 5.4-4.3 8.9-11.1 8.9-18.6zM128 134c0-3.3 2.7-6 6-6h212c3.3 0 6 2.7 6 6v20c0 3.3-2.7 6-6 6H134c-3.3 0-6-2.7-6-6v-20zm0 64c0-3.3 2.7-6 6-6h212c3.3 0 6 2.7 6 6v20c0 3.3-2.7 6-6 6H134c-3.3 0-6-2.7-6-6v-20zm253.4 250H96c-17.7 0-32-14.3-32-32 0-17.6 14.4-32 32-32h285.4c-1.9 17.1-1.9 46.9 0 64z"class=""></path></svg></div>${acs} / ${
									item.problemCount
								}</div>
                                <div class='searchListCardTag'><div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path fill="#f1c40f" d="M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.954 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.954 316.9 17.97L381.2 150.3z"/></svg></div>${
																	item.markCount
																}</div>
                            </div>
                        </a>
                        `;
							}
						}
					},
					error: () => {
						networkError = true;
					},
				});
			if (settings.lsawSelectListDisplay != false)
				$.ajax ({
					url: `/training/list`,
					type: "GET",
					data: {
						keyword: info,
						page: 1,
						type: "select",
					},
					headers: { "x-luogu-type": "content-only" },
					success: (json) => {
						if (json.code != 200) {
							return;
						}
						json = json.currentData;
						if (json.trainings.result.length != 0) {
							selectHtml = `<div style='text-align: left; margin-bottom: 10px; width: 100%; font-size: 18px; font-weight: bold'> 用户题单 < a href="/training/list?keyword=${info}&page=1&type=select"style="cursor: pointer; float: right; font-weight: normal !important"class="searchShowProblems"> 查看所有 ${json.trainings.count} 份题单 </a></div>`;
							for (
								var i = 0;
								i < json.trainings.result.length &&
								i < settings.lsawListDisplayNumber;
								i++
							) {
								var item = json.trainings.result [i];
								if (item.provider.color == "Cheater")
									item.provider.badge = "作弊者";
								selectHtml += `
                         <a class="searchCard searchListCard" href='/training/${
														item.id
													}'>
                            <div class="searchListCardBody">
                                <div>#${item.id}</div>
                                <div>${item.title}</div>
                            </div>
                            <div>
                                <div class='searchListCardTag'><div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-book fa-w-14"><path data-v-639bc19b=""fill="currentColor"d="M448 360V24c0-13.3-10.7-24-24-24H96C43 0 0 43 0 96v320c0 53 43 96 96 96h328c13.3 0 24-10.7 24-24v-16c0-7.5-3.5-14.3-8.9-18.7-4.2-15.4-4.2-59.3 0-74.7 5.4-4.3 8.9-11.1 8.9-18.6zM128 134c0-3.3 2.7-6 6-6h212c3.3 0 6 2.7 6 6v20c0 3.3-2.7 6-6 6H134c-3.3 0-6-2.7-6-6v-20zm0 64c0-3.3 2.7-6 6-6h212c3.3 0 6 2.7 6 6v20c0 3.3-2.7 6-6 6H134c-3.3 0-6-2.7-6-6v-20zm253.4 250H96c-17.7 0-32-14.3-32-32 0-17.6 14.4-32 32-32h285.4c-1.9 17.1-1.9 46.9 0 64z"class=""></path></svg></div>${
																	item.problemCount
																}</div>
                                <div class='searchListCardTag'><div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path fill="currentColor" d="M256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512zM232 256C232 264 236 271.5 242.7 275.1L338.7 339.1C349.7 347.3 364.6 344.3 371.1 333.3C379.3 322.3 376.3 307.4 365.3 300L280 243.2V120C280 106.7 269.3 96 255.1 96C242.7 96 231.1 106.7 231.1 120L232 256z"/></svg></div>${new Date (
																	item.createTime * 1000
																).pattern ("yyyy/MM/dd")}</div>
                                <div class='searchListCardTag'><div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path fill="#f1c40f" d="M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.954 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.954 316.9 17.97L381.2 150.3z"/></svg></div>${
																	item.markCount
																}</div>
                                <div style='flex: 1; text-align: right'>
                                    <object style='display: inline-block'><a href="/user/${
																			item.provider.uid
																		}">
                                        <div style='display: flex; flex-direction: row'>
                                            <span class="user${
																							item.provider.color
																						}"style="line-height: 20px">${
									item.provider.name
								}</span>
                                            ${getCCFLevel (
																							item.provider.ccfLevel
																						)}
                                            ${
																							item.provider.badge != null &&
																							item.provider.badge != ""
																								? `<div class='userBadgeInfo badge${item.provider.color}'>${item.provider.badge}</div>`
																								: ""
																						}
                                        </div>
                                    </a></object>
                                </div>
                            </div>
                        </a>
                        `;
							}
						}
					},
					error: () => {
						networkError = true;
					},
				});
			if (settings.lsawDiscussDisplay != false) {
				GM.xmlHttpRequest ({
					method: "get",
					url: `https://lgbbs.oiso.cf/search.php?s=${info}`,
					headers: {
						"Content-Type": "text/html",
					},
					onload: function (res) {
						if (res.status != 200) {
							return;
						}
						let parser = new DOMParser ();
						let htmlDoc = parser.parseFromString (res.responseText, "text/html");
						let discuss_a = htmlDoc.querySelectorAll (".am-u-md-6 > a");
						let first = true;
						for (let a of discuss_a) {
							if (a.href == null) continue;
							let d_id_l = a.href.match (/[0-9]/g);
							let d_id = "";
							for (let x of d_id_l) d_id += x;
							$.ajax ({
								url: `/discuss/${d_id}`,
								type: "GET",
								headers: { "x-luogu-type": "content-only" },
								success: (html) => {
									if (html.code == 404) return;
									let dom = parser.parseFromString (html, "text/html");
									let user_a = dom.querySelector (".am-comment-meta > a");
									let username = user_a.innerHTML;
									$.ajax ({
										url: `/api/user/search?keyword=${username}`,
										type: "GET",
										success: function (json) {
											if (first == true) {
												discussHtml = `<div style='text-align: left; margin-bottom: 10px; width: 100%; font-size: 18px; font-weight: bold'> 讨论 < a href="https://lgbbs.oiso.cf/search.php?s=${info}"style="cursor: pointer; float: right; font-weight: normal !important"class="searchShowProblems"> 查看所有 ${discuss_a.length} 个保存的讨论 </a></div>`;
												first = false;
											}
											json = json.users;
											if (json.length != 0 && json [0] != null) {
												json.forEach ((item) => {
													if (item == null) return;
													if (item.color == "Cheater") item.badge = "作弊者";
													//console.info (`Discus:${username}:${a.innerHTML}`)
													discussHtml += `<a class="searchCard searchListCard" href='/discuss/${d_id}'>
                            <div class="searchListCardBody">
                                <div>${a.innerHTML}</div>
                                <div style='flex: 1; text-align: right'>
                                    <object style='display: inline-block'>
                                        <div style='display: flex; flex-direction: row'>
                                            <div style='display: flex; flex-direction: row'><span class="user${
																							item.color
																						}"style="line-height: 20px">${username}</span>${getCCFLevel (
														item.ccfLevel
													)}${
														item.badge != null && item.badge != ""
															? `<div class='userBadgeInfo badge${item.color}'>${item.badge}</div>`
															: ""
													}</div>
                                        </div>
                                    </object>
                                </div>
                            </div></a>`;
												});
											}
										},
									});
								},
							});
						}
					},
					onerror: function (res) {},
				});
			}
		};
		$(".searchAnywhereMainInput > input")
			.unbind ("input propertychange")
			.on ("input propertychange", function () {
				if (searchTimeout != null) clearTimeout (searchTimeout);
				searchTimeout = setTimeout (searchInfo, 500);
			});
		let searchAnywhereOpen = false;
		let inject_interval = setInterval (function () {
			if ($(".search-wrap").length == 0) return;
			let en = $(".user-nav .search-wrap").next ();
			$(".user-nav .search-wrap").remove ();
			en.css ("margin-left", "10px");
			en.unbind ("click").click (function () {
				if (!searchAnywhereOpen) {
					$(".searchAnywhere").css ("display", "block");
					setTimeout (() => {
						$(".searchAnywhere").css ("opacity", "1");
						$(".searchAnywhereMainInput > input").focus ();
					}, 20);
				} else {
					$(".searchAnywhere").css ("opacity", "0");
					setTimeout (() => {
						$(".searchAnywhere").css ("display", "none");
					}, 200);
				}
				searchAnywhereOpen = !searchAnywhereOpen;
			});
			clearInterval (inject_interval);
		}, 500);
		$(".searchAnywhere")
			.unbind ("click")
			.click (() => {
				$(".searchAnywhere").css ("opacity", "0");
				setTimeout (() => {
					$(".searchAnywhere").css ("display", "none");
				}, 200);
				searchAnywhereOpen = false;
			});
		$(".searchAnywhereMainInput")
			.unbind ("click")
			.click ((event) => {
				event.stopPropagation ();
			});
		$(document).keydown (function (event) {
			if (event.keyCode == 186 && (event.ctrlKey || event.metaKey)) {
				if (!searchAnywhereOpen) {
					$(".searchAnywhere").css ("display", "block");
					setTimeout (() => {
						$(".searchAnywhere").css ("opacity", "1");
						$(".searchAnywhereMainInput > input").focus ();
					}, 20);
				} else {
					$(".searchAnywhere").css ("opacity", "0");
					setTimeout (() => {
						$(".searchAnywhere").css ("display", "none");
					}, 200);
				}
				searchAnywhereOpen = !searchAnywhereOpen;
				event.preventDefault ();
			}
			if (searchAnywhereOpen) {
				if (event.keyCode == 38) {
					// Up
					if (currentHoverCard == undefined) {
						var lis = $(".searchCard");
						if (lis.length == 0) $(".searchAnywhereMainInput > input").focus ();
						else {
							currentHoverCard = lis.eq (lis.length - 1);
							changeHoverCard (currentHoverCard);
						}
					} else {
						currentHoverCard = currentHoverCard.prev ();
						while (1) {
							if (
								currentHoverCard.length == 0 ||
								currentHoverCard.hasClass ("searchCard")
							)
								break;
							currentHoverCard = currentHoverCard.prev ();
						}
						if (currentHoverCard.length == 0) {
							$(".searchAnywhereMainInput > input").focus ();
							currentHoverCard = undefined;
						}
						changeHoverCard (currentHoverCard);
					}
					event.preventDefault ();
				} else if (event.keyCode == 40) {
					// Down
					if (currentHoverCard == undefined) {
						var _lis = $(".searchCard");
						if (_lis.length == 0) $(".searchAnywhereMainInput > input").focus ();
						else {
							currentHoverCard = _lis.eq (0);
							changeHoverCard (currentHoverCard);
						}
					} else {
						currentHoverCard = currentHoverCard.next ();
						while (1) {
							if (
								currentHoverCard.length == 0 ||
								currentHoverCard.hasClass ("searchCard")
							)
								break;
							currentHoverCard = currentHoverCard.next ();
						}
						if (currentHoverCard.length == 0) {
							$(".searchAnywhereMainInput > input").focus ();
							currentHoverCard = undefined;
						}
						changeHoverCard (currentHoverCard);
					}
					event.preventDefault ();
				} else if (event.keyCode == 13) {
					// Enter
					if (currentHoverCard != undefined)
						window.open (currentHoverCard.attr ("href"), "_blank");
					event.preventDefault ();
				} else if (event.keyCode == 9) event.preventDefault ();
				else $(".searchAnywhereMainInput > input").focus ();
			}
		});
	});
})(window.jQuery.noConflict (true));
