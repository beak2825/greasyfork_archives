// ==UserScript==
// @name         nhentai.net page
// @namespace    http://tampermonkey.net/
// @version      1.1.3
// @description  nhentai custom page utility.
// @author       You
// @license      MIT
// @match        https://nhentai.net/g/*
// load jQuery
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/440763/nhentainet%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/440763/nhentainet%20page.meta.js
// ==/UserScript==

(function() {
	'use strict';
})();

var mainContainer = null;
var enableLeftRight = false;
var btnNextLoad = null;
var categoryGalleryCount = null;
var currentPageCount = null;
let baseImgUrlList = [];
let styleTagStr = `
<style id="exStyle">
/* ナビゲーションバーを追従 */
nav {
    position: fixed;
    top: 0px;
    width: 100%;
    z-index: 11;
}
/* コンテンツ部をナビゲーションバーの高さ分下げる */
#content {
    margin-top: 70px;
}

/* ボタンのデザイン */
.btnReplaceImg {
    background-color: #01a120;
}
.btnReplaceImg:hover {
    background-color: #01a120;
    opacity:0.65;
}
.btnOrgImgList {
    background-color: #af8100;
}
.btnOrgImgList:hover {
    background-color: #af8100;
    opacity:0.65;
}

/* 画像リスト */
.list-img {
    width: 100%;
    max-width: 65vh;
}
</style>
`

$(function(){
	$("head").append($(styleTagStr));

	// // 画像を loading="lazy" にする
	// $(".gallerythumb img").each(function(idx, el) {
	// 	$(el).attr("loading", "lazy");
	// });

	// オリジナル画像にサムネイルを置き換える
	let btnReplaceImg = $(`<button id="btnReplaceImg" class="btn btnReplaceImg btnCustom">オリジナル画像に置換</button>`);
	$(".buttons").append(btnReplaceImg);

	// URL置き換えボタン
	$("#btnReplaceImg").on("click", function() {
		let cnt = 0;
		$(".gallerythumb img").each(function(idx, el) {
			let $el = $(el);
			let url = baseImgUrlList[cnt];
			$el.attr("src", url);
			$el.data("src", url);
			cnt++;
		});
		$("img:not(.gallerythumb > img)").remove();

		console.log("succeed replace img.");
		$(this).text("置換完了");
		$(this).prop("disabled", true);
	});

	let container = $(`<div class="container areaBaseImgList"></div>`);
	$("#thumbnail-container").before(container);

	// 元画像リスト作成処理
	let createListFunc = function() {
		baseImgUrlList.forEach((e) => {
			container.append(`<img class="list-img" src="${e}" data-src="" onerror="" alt="画像" loading="lazy"><hr>`);
		});
		container.find(`hr:last-child`).remove();
		btnOrgImgList.text("表示完了");
		btnOrgImgList.prop("disabled", true);
	};

	// 元画像リンク作成
	$.ajax({
		url: $(".gallerythumb").first().attr("href")
	}).done(function(data) {
		// console.log(data);
		// 画像の変更
		let orgImageUrl = $(data).find("#image-container img").attr("src");
		let baseUrl = orgImageUrl.substring(0, orgImageUrl.lastIndexOf("/") + 1); // ファイル名より前
		let baseFileName = orgImageUrl.slice(orgImageUrl.lastIndexOf("/") + 1); // ファイル名
		let baseExt = baseFileName.slice(baseFileName.lastIndexOf("."));
		let baseFileNameWithoutExt = baseFileName.replace(baseExt, "")
		let cnt = 1;
		$(".gallerythumb").each(function(idx, el) {
			let url = `${baseUrl}${cnt++}${baseExt}`;
			baseImgUrlList.push(url);
		});
		$("#cover").append(`<div>${baseImgUrlList[0]}</div>`).append(`<div>maxPage: ${$(".gallerythumb").length}</div>`);
		console.log(baseImgUrlList);

		// createListFunc();
	});

	let btnOrgImgList = $(`<button id="btnOrgImgList" class="btn btnOrgImgList btnCustom">元画像リスト表示</button>`);
	$(".buttons").append(btnOrgImgList);

	// 元画像リスト表示
	$("#btnOrgImgList").on("click", function() {
		createListFunc();
	});
	// $(`.chkBaseImgListVisible`).on("change", function() {
	// 	let checked = $(this).prop("checked");
	// 	if (checked) $(`.areaBaseImgList`).removeClass("hide");
	// 	else         $(`.areaBaseImgList`).addClass("hide");
	// });
});