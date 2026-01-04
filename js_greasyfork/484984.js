// ==UserScript==
// @name            カクヨムの明朝体は細すぎる！（Windows環境用）
// @version         1.0.0
// @license         MIT License
// @description     カクヨムの小説の本文が明朝体で表示するように指定されている場合、フォントにNoto Serif Japanese（源ノ明朝）を使用するようにします。
// @match           http://kakuyomu.jp/*
// @match           https://kakuyomu.jp/*
// @namespace       https://greasyfork.org/users/1160382
// @downloadURL https://update.greasyfork.org/scripts/484984/%E3%82%AB%E3%82%AF%E3%83%A8%E3%83%A0%E3%81%AE%E6%98%8E%E6%9C%9D%E4%BD%93%E3%81%AF%E7%B4%B0%E3%81%99%E3%81%8E%E3%82%8B%EF%BC%81%EF%BC%88Windows%E7%92%B0%E5%A2%83%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/484984/%E3%82%AB%E3%82%AF%E3%83%A8%E3%83%A0%E3%81%AE%E6%98%8E%E6%9C%9D%E4%BD%93%E3%81%AF%E7%B4%B0%E3%81%99%E3%81%8E%E3%82%8B%EF%BC%81%EF%BC%88Windows%E7%92%B0%E5%A2%83%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

/* 小説本文のページでのみ動作するように */
if (document.getElementById("page-works-episodes-episode") != null) {

	/* Google FontsからNoto Serif Japaneseを読み込む */
	var elemHead = document.getElementsByTagName('head').item(0);
	elemHead.insertAdjacentHTML(`beforeend`, `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@200;300;400;500;600;700;900&display=swap" rel="stylesheet">`);

	/* 本文部分のfont-familyに游明朝の記述がある場合、Noto Serif Japanese（源ノ明朝）の記述を追加 */
	var elemEpisodeBodys = document.getElementsByClassName('widget-episodeBody');
	var len = elemEpisodeBodys.length;
	for (var i = 0; i < len; i++) {
		var aElemEpisodeBody = elemEpisodeBodys[i];
		var styleFontFamily = window.getComputedStyle(aElemEpisodeBody).fontFamily;
		if (styleFontFamily.indexOf(`"游明朝"`) > -1) {
			styleFontFamily = styleFontFamily.replace(`"游明朝"`, `"Source Han Serif JP", "Noto Serif CJK JP", "Noto Serif JP", "游明朝", YuMincho`);
		} else if (styleFontFamily.indexOf(`'游明朝'`) > -1) {
			styleFontFamily = styleFontFamily.replace(`'游明朝'`, `"Source Han Serif JP", "Noto Serif CJK JP", "Noto Serif JP", '游明朝', YuMincho`);
		} else {
			styleFontFamily = styleFontFamily.replace(`游明朝`, `"Source Han Serif JP", "Noto Serif CJK JP", "Noto Serif JP", 游明朝, YuMincho`);
		}
		aElemEpisodeBody.style.fontFamily = styleFontFamily;
	}

	/* ゴシックと明朝の切り替えをした場合、再読み込みする */
	document.getElementsByName("font_family").forEach(
		r => r.addEventListener("change" ,
			e => location.reload()
		)
	);

	/* 組み方向の切り替えをした場合、下記のコードが原因で「ビューワー設定」のデザインが壊れるため再読み込みする */
	document.getElementsByName("writing_direction").forEach(
		r => r.addEventListener("change" ,
			e => location.reload()
		)
	);

	/* 一部の項目を変更するとページが再読み込みされる旨の記述を「ビューワー設定」に追加 */
	var pageReloadTextHTML = `<span style="font-size:11.5px;color:red;">※変更するとページが再読み込みされます。</span>`;
	var elemFontHfour = document.getElementsByTagName('h4').item(4);
	elemFontHfour.insertAdjacentHTML(`afterend`, pageReloadTextHTML);
	var elemFontHfive = document.getElementsByTagName('h4').item(5);
	elemFontHfive.insertAdjacentHTML(`afterend`, pageReloadTextHTML);

	/* 上記のコードが原因で「ビューワー設定」のデザインが壊れるため調整 */
	var elemBody = document.getElementsByTagName('body').item(0);
	var elemDisplaySetting = document.getElementById('displaySetting');
	if (elemBody.classList.contains("writingDirection-vertical")) {
		elemFontHfour.style.marginLeft = 0;
		elemFontHfive.style.marginLeft = 0;
		var elemUiModalWindow = document.getElementsByClassName('ui-modal-window').item(0);
		elemUiModalWindow.style.maxHeight = '530px';
		var elemWidgetDisplaySetting = document.getElementsByClassName('widget-displaySetting').item(0);
		elemWidgetDisplaySetting.style.width = '212px';
		elemDisplaySetting.style.width = '212px';
		var elemFontHtwo = document.getElementsByTagName('h4').item(2);
		elemFontHtwo.style.marginLeft = '25px';
		var elemFontHthree = document.getElementsByTagName('h4').item(3);
		elemFontHthree.style.marginLeft = '25px';
	} else {
		elemFontHfour.style.marginBottom = 0;
		elemFontHfive.style.marginBottom = 0;
		elemDisplaySetting.style.height = '344px';
	}
}