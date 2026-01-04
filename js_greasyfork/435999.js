// ==UserScript==
// @name         nhentai.net search
// @namespace    http://tampermonkey.net/
// @version      1.9.2
// @description  nhentai custom tags filter.
// @author       You
// @license      MIT
// @match        https://nhentai.net/search/*
// @match        https://nhentai.net/parody/*
// @match        https://nhentai.net/character/*
// @match        https://nhentai.net/tag/*
// @match        https://nhentai.net/artist/*
// @match        https://nhentai.net/group/*
// @match        https://nhentai.net/language/*
// @match        https://nhentai.net/category/*
// @match        https://nhentai.net/
// load jQuery
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/435999/nhentainet%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/435999/nhentainet%20search.meta.js
// ==/UserScript==

var mainContainer = null;
var searchBox = null;
var enableLeftRight = false;
var btnNextLoad = null;
var categoryGalleryCount = null;
var currentPageCount = null;
var searchWords = [];
var unsearchWords = [];
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
/* チェックボックスエリアやダイアログ */
.divCommonHigh {
    overflow: auto;
    max-height: 92vh;
    background-color: #444444;
    border-radius: 0.5rem;
    padding: 0.5rem 0.25rem;
}
/* フィルタチェックボックス */
.divChkFilt {
    position: fixed;
    top: 5rem;
    left: 1rem;
    max-width: 17rem;
}
/* NGチェックボックス */
.divChkHide {
    position: fixed;
    top: 5rem;
    right: 1rem;
	max-width: 17rem;
}
.btnNextLoadBottom {
    width: 60%;
    height: 3rem;
    border-radius: 0.25rem;
}
.chkGroup {
    text-align: left;
    padding-left: 0.3rem;
}
.chkGroup .lblChk { display: inline-block; }
.chkGroup .chkTagFilt + .lblChk,
.chkGroup .chkTagHide + .lblChk {
    color: #d9d9d9;
}
.chkGroup .chkTagFilt:checked + .lblChk,
.chkGroup .chkTagHide:checked + .lblChk { color: red; }
.pagination {
    margin-top: 0;
    margin-bottom: 0;
}
.viewCount { background-color: #444444; }
#content.loading { background-color: #7b7b7b; }

/* Galleryのタグ部分 */
.tags {
    position: absolute;
    top: -1rem;
    right: 101%;
    list-style: none;
    padding-left: 0.5rem;
    opacity: 0.0;
}
.gallery:hover .tags {
    z-index: 11;
	opacity: 1;
}
.tags li {
    color: #ffffff;
    background-color: #6a6a6a;
}
.tags li:nth-child(even) {
    background-color: #919191;
}

/* オプション */
.divChkOption {
	position: fixed;
    inset: 0;
    top: 5rem;
    margin: 0 auto;
    width: 60vw;
    z-index: 100;
}
.divChkOption.close { display: none; }
.btnOptionClose {
	position: fixed;
    width: 5rem;
    height: 2rem;
    top: 5.5rem;
    right: 45rem;
}
.divChkOption table,
.divSearchOption table{
	margin: 0 auto;
}
.divChkOption table td,
.divSearchOption table td {
	border-bottom: 1px solid #aaaaaa;
}
/* インポート・エクスポート */
.txtSettingJson {
	width: 100%;
    height: 10rem;
}
.flex-space-between {
	display: flex;
    align-items: center;
    justify-content: space-between;
}

/* 検索補助 */
.divSearchOption {
	position: fixed;
    inset: 0;
    top: 5rem;
    margin: 0 auto;
    width: 50rem;
    z-index: 100;
}
.divSearchOption.close { display: none; }
.shadow { display: none; }
.shadow.open {
	display: block;
    width: 100vw;
    height: 100vh;
    background-color: gray;
    position: fixed;
    top: 50px;
    left: 50vw;
    transform: translate(-50%, 0);
    z-index: 99;
    opacity: 0.8;
}
.divSearchTable {
	margin-top: 2rem;
    display: flex;
	align-items: flex-start;
}

/* 汎用 */
a { cursor: pointer; }
.hide { display:none; }
.alignLeft { text-align: left; }
.alignRight { text-align: right; }
[type=checkbox], [type=radio] {
	transform: scale(1.5);
}
</style>
`

$(function(){
	// outputTags();
	$("head").append($(styleTagStr));

	// ページネーションがあれば左右キー移動を有効にする
	if ($(".pagination").length) {
		enableLeftRight = true;
	}

	// .galleryがあるところだけやる
	if ($(".gallery").length) {
		mainContainer = $(".index-container").last();
		searchBox = $("form.search input[type=search]");

		// 現在のページを取得
		currentPageCount = parseInt($(".page.current").first().text());
		// 上部にもページネーションを追加
		mainContainer.before($("#open_point.pagination.ilist").clone());

		// 今のカテゴリページの全カウントを取得
		categoryGalleryCount = $(".count").first().text().replaceAll(/,|\(|\)/g, "");
		// console.log(categoryGalleryCount);

		// ----------表示領域を追加----------
		mainContainer.before(`<div class='divCommonHigh divChkFilt'>
        <button class='btnClear'>全解除</button>
        <button class='btnDefaultFilt'>デフォルト</button>
        </div>`);
		//     console.log("datasForEach");
		// ----------表示領域を追加ここまで----------

		// ----------非表示領域を追加----------
		mainContainer.after(`<div class='divCommonHigh divChkHide'>
        <button class='btnClear'>全解除</button>
        <!--<button class='btnDeleteHidden'>非表示削除</button>-->
        <button class='btnDefaultHide'>デフォルト</button>
        </div>`);
		//     console.log("datasForEach");
		// ----------非表示領域を追加ここまで----------

		// ----------オプションダイアログ----------
		mainContainer.after(`<div class="divCommonHigh divChkOption close">
		<div class="alignRight"><button class="btnOptionClose">閉じる</button></div>
		</div>`);
		$(document).on("click", `.divChkOption .btnOptionClose`, function() {$(this).closest(".divCommonHigh").addClass("close")});
		$(`.menu.right`).append($(`<li><a href="javascript:void(0)" class="lnkOption">ViewOption</a></li>`));
		$(`.lnkOption`).on("click", function() {
			if ($(`.divChkOption`).hasClass("close")) $(`.divChkOption`).removeClass("close");
			else $(`.divChkOption`).addClass("close");
		});
		// ----------オプションダイアログここまで----------

		// ----------検索補助----------
		mainContainer.after(`<div class="divCommonHigh divSearchOption close">
		<div class="alignRight"><button class="btnOptionClose" type="button">閉じる</button></div>
		</div>`);
		$(document).on("click", `.divSearchOption .btnOptionClose`, function() {
			$(this).closest(".divCommonHigh").addClass("close");
			$(".shadow").removeClass("open");
		});
		$(`.divSearchOption .btnOptionClose`).on("click", function() { $(".chkSearch, .chkUnsearch").prop("checked", false);});
		searchBox.on("focus", function() {
			$(".divSearchOption").removeClass("close");
			$(".shadow").addClass("open");
			parseSearchWords();
			visibleSyncSearchCheckbox();
		});
		mainContainer.after(`<div class="shadow"></div>`);
		$(document).on("click", ".shadow", function() {
			$(".divSearchOption .btnOptionClose").click();
		});
		// alert("abc");
		// searchBox.on("blur", function() {
		// 	$(".divSearchOption").addClass("close");
		// });
		// ----------検索補助ここまで----------

		// カウント部
		$("nav ul.menu").first().append("<li class='desktop viewCount'>xxxx</li>");

		// ページネーションがあれば次ページロードボタン追加
		if ($(".pagination").length) {
			$(`.menu.right`).prepend($(`<li><a href="javascript:void(0)" class="lnkNextLoad">次ページ読込</a></li>`));
			btnNextLoad = $(`<button class='btnNextLoad btnNextLoadBottom'>次ページロード</button>`);
			// $(".pagination").before(btnNextLoad);
		}

		// 初期処理
		loadStrage();
		let initFunc = function() {
			// console.log(`loadTagList Finished`);

			// カウントの降順
			let rList = tagList.sort((a, b) => b.count - a.count);
			rList.unshift(
				{ tagId: '33173', name: 'manga', count: null },
				{ tagId: '33172', name: 'doujinshi', count: null },
				{ tagId: '23237', name: 'tankoubon', count: null },
				{ tagId: '10988', name: 'anthology', count: null },
				{ tagId: '6346', name: 'japanese', count: null },
			);

			// ----------表示タグ----------
			let divChkFilt = $(".divChkFilt");
			rList.forEach(obj => {
				if ($(`#chkFilt${obj.tagId}`).length) return;
				let count = obj.count ? `(${obj.count})` : "";
				divChkFilt.append(`<div class="chkGroup">
                <input type='checkbox' class='chkTagFilt ${obj.tagId} chkSaveTarget' id='chkFilt${obj.tagId}' value='${obj.tagId}' data-name='${obj.name}'>
                <label class='lblChk' for='chkFilt${obj.tagId}'>${obj.name}<span class='count'>${count}</span></label>
                </div>`);
			});
			// ----------非表示タグ----------
			let divChkHide = $(".divChkHide");
			rList.forEach(obj => {
				if ($(`#chkHide${obj.tagId}`).length) return;
				let count = obj.count ? `(${obj.count})` : "";
				divChkHide.append(`<div class="chkGroup">
                <input type='checkbox' class='chkTagHide ${obj.tagId} chkSaveTarget' id='chkHide${obj.tagId}' value='${obj.tagId}' data-name='${obj.name}'>
                <label class='lblChk' for='chkHide${obj.tagId}'>${obj.name}<span class='count'>${count}</span></label>
                </div>`);
			});
			// // チェックボックスのカウントを変更
			// tagList.forEach(function (obj) {
			// 	let chk = $(`.chkTagHide.${obj.tagId}, .chkTagFilt.${obj.tagId}`);
			// 	let targetEl = chk.closest(".chkGroup").find(".count");
			// 	if (obj.count) targetEl.text(`(${obj.count})`);
			// });

			// オプションダイアログの中身生成
			let table = $(`<table><tr>
			<td>隠す<br>表示<br>タグ</td>
			<td>初期値<br>表示<br>タグ</td>
			<td>タグ名<td>カウント</td>
			<td>隠す<br>非表示<br>タグ</td>
			<td>初期値<br>非表示<br>タグ</td>
			</tr></table>`);
			rList.forEach(function (obj) {
				// console.log(`tag = ${obj.tagId}, name = ${obj.name} count = ${obj.count}`);
				table.append(`<tr>
				<td><input type="checkbox" class="chkUnvisibleFilt chkSaveTargetOption" id="chkUnvisibleFilt${obj.tagId}" data-target="#chkFilt${obj.tagId}" value='${obj.tagId}'></td>
				<td><input type="checkbox" class="chkDefaultUnvisibleFilt chkSaveTargetOption" id="chkDefaultUnvisibleFilt${obj.tagId}" data-target="#chkFilt${obj.tagId}" value='${obj.tagId}'></td>
				<td>${obj.name}</td>
				<td>${obj.count || "undefined"}</td>
				<td><input type="checkbox" class="chkUnvisibleHide chkSaveTargetOption" id="chkUnvisibleHide${obj.tagId}" data-target="#chkHide${obj.tagId}" value='${obj.tagId}'></td>
				<td><input type="checkbox" class="chkDefaultUnvisibleHide chkSaveTargetOption" id="chkDefaultUnvisibleHide${obj.tagId}" data-target="#chkHide${obj.tagId}" value='${obj.tagId}'></td>
				</tr>`);
			});
			$(`.divChkOption`).append(table);

			// エクスポートとインポート
			$(`.divChkOption`).append(`
			<div>
			<textarea class="txtSettingJson"></textarea>
			<div class="flex-space-between"><button class="btnExport">ExportJson</button><button class="btnImport">ImportJson</button></div>
			</div>
			`);

			// 検索補助ダイアログの中身生成
			let divSearchTable = $(`<div class="divSearchTable"></div>`);
			let searchTable = $(`<table><tr>
			<td>検索</td>
			<td>タグ名</td>
			<td>カウント</td>
			</tr></table>`);
			rList.forEach(function (obj) {
				// console.log(`tag = ${obj.tagId}, name = ${obj.name} count = ${obj.count}`);
				searchTable.append(`<tr>
				<td><input type="checkbox" class="chkSearch" id="chkSearch${obj.tagId}" data-word="${obj.name}" value='${obj.tagId}'></td>
				<td>${obj.name}</td>
				<td>${obj.count || "undefined"}</td>
				<!--<td><input type="checkbox" class="chkUnsearch" id="chkUnsearch${obj.tagId}" data-word="${obj.name}" value='${obj.tagId}'></td>-->
				</tr>`);
			});
			divSearchTable.append(searchTable);

			let unsearchTable = $(`<table><tr>
			<td>タグ名</td>
			<td>カウント</td>
			<td>除外</td>
			</tr></table>`);
			rList.forEach(function (obj) {
				// console.log(`tag = ${obj.tagId}, name = ${obj.name} count = ${obj.count}`);
				unsearchTable.append(`<tr>
				<!--<td><input type="checkbox" class="chkSearch" id="chkSearch${obj.tagId}" data-word="${obj.name}" value='${obj.tagId}'></td>-->
				<td>${obj.name}</td>
				<td>${obj.count || "undefined"}</td>
				<td><input type="checkbox" class="chkUnsearch" id="chkUnsearch${obj.tagId}" data-word="${obj.name}" value='${obj.tagId}'></td>
				</tr>`);
			});
			divSearchTable.append(unsearchTable);
			$(`.divSearchOption`).append(divSearchTable);

			// 初期処理
			initChk();
			visibleSync();
			defaultCheckSync();
			showGallery();

			let observer = new MutationObserver(function() {
				showGallery();
			});
			let observeTargetElem = mainContainer[0];
			let oConfig = {
				childList: true
			};
			observer.observe(observeTargetElem, oConfig);
		};
		loadTagList(function() {
			initFunc();
		});

		// オプションチェックイベント タグ非表示
		$(document).on("change", `.chkUnvisibleFilt, .chkUnvisibleHide`, function() {
			visibleSync($(this));
			saveStrage();
		});
		// オプションチェックイベント デフォルトタグ
		$(document).on("change", `.chkDefaultUnvisibleFilt, .chkDefaultUnvisibleHide`, function() {
			saveStrage();
		});
		$(document).on("click", `.btnExport`, function() {
			let loadData = localStorage.getItem('saveData');
			try {
				let parseObj = JSON.parse(loadData);
				$(`.txtSettingJson`).val(JSON.stringify(parseObj, null, 2));
			} catch {
				$(`.txtSettingJson`).val(loadData);
			}
		});
		$(document).on("click", `.btnImport`, function() {
			// ストレージへ保存
			let val = $(`.txtSettingJson`).val();
			try {
				JSON.parse(val);
				localStorage.setItem('saveData', val);
			} catch {}
		});
		// 検索チェックイベント
		$(document).on("change", `.chkSearch`, function() {
			let $el = $(this);
			let word = $el.data("word");
			if ($el.prop("checked")) {
				searchWords.push(word);
			} else {
				let idx = searchWords.indexOf(word);
				if (idx != -1) {
					searchWords.splice(idx, 1);
				}
			}
			syncToSearchBox();
		});
		$(document).on("change", `.chkUnsearch`, function() {
			let $el = $(this);
			let word = $el.data("word");
			if ($el.prop("checked")) {
				unsearchWords.push(word);
			} else {
				let idx = unsearchWords.indexOf(word);
				if (idx != -1) {
					unsearchWords.splice(idx, 1);
				}
			}
			syncToSearchBox();
		});

		// チェックボックスイベント
		$(document).on("change", ".chkTagFilt, .chkTagHide", () => {
			// console.log("checkboxOnChange");
			showGallery();
			saveStrage();
			$(".lnkNextLoad").focus();
		});

		// 全解除ボタン
		$(document).on("click", ".btnClear", function() {
			$(this).closest(".divCommonHigh").find(":checked").prop("checked", false);
			showGallery();
			saveStrage();
		});

		// 次ページ読込ボタン
		$(document).on("click", ".btnNextLoad, .lnkNextLoad", ()=> {
			loadGallery();
		});

		// デフォルトに戻す（フィルター）
		$(document).on("click", `.btnDefaultFilt`, () => {
			defaultCheckSync($(`.chkDefaultUnvisibleFilt`));
			showGallery();
			saveStrage();
		});

		// デフォルトに戻す（非表示フィルター）
		$(document).on("click", `.btnDefaultHide`, () => {
			defaultCheckSync($(`.chkDefaultUnvisibleHide`));
			showGallery();
			saveStrage();
		});
	}
});

function parseSearchWords() {
	let searchStr = searchBox.val();

	// 解析できる形式に整形
	let formatedSearchStr = "";
	let inQt = false;
	for (let i = 0; i < searchStr.length; i++) {
		let c = searchStr.charAt(i);
		if (c == `"`) {
			inQt = !inQt;
		} else if (!inQt && c == ` `) {
			formatedSearchStr += `|`;
		} else {
			formatedSearchStr += c;
		}
	}

	searchWords = [];
	unsearchWords = [];

	let searchAry = formatedSearchStr.split(`|`).filter(e => e);
	searchAry.forEach((val, idx) => {
		let pushVal = val;
		// マイナス検索かどうか
		let isMinus = pushVal.charAt(0) === "-";
		if (isMinus) pushVal = pushVal.slice(1);

		// 検索ワードとして追加
		if (isMinus) unsearchWords.push(pushVal);
		else searchWords.push(pushVal);
	})

	// searchWordsなどからチェックボックスに反映
	searchWords.forEach((val, idx) => {
		let tagId =  tagList.find(e => e.name == val).tagId;
		$(`#chkSearch${tagId}`).prop("checked", true);
	});
	unsearchWords.forEach((val, idx) => {
		let tagId =  tagList.find(e => e.name == val).tagId;
		$(`#chkUnsearch${tagId}`).prop("checked", true);
	});
}

function syncToSearchBox() {
	let searchStr = "";
	searchWords.forEach(word => {
		let addWord = "";
		if (word.indexOf(" ") != -1) {
			addWord = `"${word}"`
		} else {
			addWord = word;
		}
		searchStr += `${addWord} `;
	});
	unsearchWords.forEach(word => {
		let addWord = "";
		if (word.indexOf(" ") != -1) {
			addWord = `"${word}"`
		} else {
			addWord = word;
		}
		searchStr += `-${addWord} `;
	});

	$("form.search input[type='search']").val(searchStr.trim());
}

function visibleSyncSearchCheckbox() {
	// 一旦、非表示クラスを全部削除
	$(".divSearchTable tr").removeClass("hide");
	$(`.divChkFilt .chkGroup.hide input[type="checkbox"]`).each(function(idx, el) {
		let val = el.value;
		$(`#chkSearch${val}`).closest("tr").addClass("hide");
	});
	$(`.divChkHide .chkGroup.hide input[type="checkbox"]`).each(function(idx, el) {
		let val = el.value;
		$(`#chkUnsearch${val}`).closest("tr").addClass("hide");
	});
}

// ------------------------------
// 作品表示・非表示切り替え
// ------------------------------
function showGallery(container = null) {
	//     console.log("=====showGallery=====");
	if (!container)
		container = mainContainer;

	let filtTags = $(".chkTagFilt:checked").map((_, chk) => $(chk).val()).get();
	let hideTags = $(".chkTagHide:checked").map((_, chk) => $(chk).val()).get();
	//     console.log(`filtTags = ${JSON.stringify(filtTags)}`);
	//     console.log(`hideTags = ${JSON.stringify(hideTags)}`);

	let showCount = 0;
	let hideCount = 0;
	container.find(".gallery").each((_, element) => {
		let $el = $(element);
		let galleryTags = $el.data("tags").split(" ");
		//         console.log(galleryTags);

		// フィルタータグのすべて満たしているかつ、非表示タグのすべてを回避すれば表示
		let visibleEl = filtTags.every((tag) => galleryTags.includes(tag)) && !hideTags.some((tag) => galleryTags.includes(tag));
		if (visibleEl) {
			showCount++;
			$el.removeClass("hide");
		}
		else {
			hideCount++;
			$el.addClass("hide");
		}

		let tagsEl = $el.find(".tags");
		if (!tagsEl.length) {
			$el.append(`<ul class="tags"></ul>`);
			tagEl = $el.find(".tags");
			galleryTags.forEach((val, idx) => {
				// console.log(`tag = ${obj.tagId}, name = ${obj.name} count = ${obj.count}`);
				let findTag = tagList.find(e => e.tagId == val);
				// タグリストにあれば追加
				if (findTag)
					tagEl.append(`<li>${findTag.name}</li>`)
			});
		}
	});

	// let scrollTop = $(window).scrollTop();
	// console.log(`scrollTop: ${$(window).scrollTop()}`);

	// $(window).scrollTop(scrollTop);
	// console.log(`scrollTop: ${$(window).scrollTop()}`);

	let galleryCount = getGalleryCount();
	$(".viewCount").text(`Show: ${showCount}/${galleryCount}, Hidden: ${hideCount}/${galleryCount}`);
	// console.log(`galleryCount: ${galleryCount}, showCount: ${showCount}, hideCount: ${hideCount}`);
}

function getGalleryCount(container = null) {
	if (!container) container = mainContainer;
	return container.find(".gallery").length;
}

// 次ページロード
var loadNextPage = 0;
var failAlert = false;
var ajaxCount = 0;
var maxAjaxCount = 4;
var beforeLoadGalleryData = null;
function loadGallery() {
	//     console.log(`ajaxCount=${ajaxCount}`);

	if (!$(".pagination").length) return;

	// 次に読むページが未定義なら定義する
	loadNextPage = loadNextPage || currentPageCount + 1;

	// 現在のページが最後のページと思われるページを超えたらロードしない
	if (categoryGalleryCount && loadNextPage > Math.ceil(categoryGalleryCount / 25)) {
		return;
	}

	let loadHref = $("a.next").attr("href");
	// Get next page gallery.
	ajaxCount++;
	$("#content").addClass("loading");

	// https://nhentai.net/tag/lolicon/?page=2
	let url = `${loadHref.substring(0, loadHref.lastIndexOf("/") + 1)}?page=${loadNextPage++}`
	console.log(url);
	$.ajax({
		url: url
	}).done((data) => {
		var galleryData = $(data).find(".gallery");
		// console.log(galleryData.html());
		// 取得したギャラリーデータが前のページと全く同じなら読み込まない
		if (beforeLoadGalleryData && beforeLoadGalleryData == galleryData.html()) {
			$(".btnNextLoad").prop("disabled", true);
			return;
		}
		beforeLoadGalleryData = galleryData.html();

		// 取得したgalleryたちはimgのsrcが設定されていないので手動で設定
		galleryData.each((_, el) => {
			let $el = $(el);
			let $img = $el.find("img");
			let srcData =  $img.data("src");
			$img.attr("src", srcData);
		});

		// 要素を追加
		mainContainer.append(galleryData);
		// showGallery();
		if ($(".chkAutoRemoveHideElement:checked").length != 0) {
			deleteHideGellery();
		}
	}).fail(() => {
		if (!failAlert) {
			failAlert = true;
			// alert("ajax fail");
		}
		// $(".btnNextLoad").prop("disabled", true);
	}).always(() => {
		ajaxCount--
		if (ajaxCount <= 0) {
			$("#content").removeClass("loading");
			ajaxCount = 0;
		}
	});

	// 次ページ読み込み
	if (ajaxCount < maxAjaxCount && !failAlert) {
		loadGallery();
	}
}

// オプションのタグ非表示を反映
function visibleSync(baseElement) {
	let baseEl = baseElement || $(`.chkUnvisibleFilt, .chkUnvisibleHide`);
	baseEl.each(function(idx, element) {
		let el = $(element);
		if (el.prop("checked")){
			$(el.data("target")).closest(".chkGroup").addClass("hide");
			// console.log("checked");
		}
		else {
			$(el.data("target")).closest(".chkGroup").removeClass("hide");
			// console.log("unchecked");
		}
	});
}

// オプションのデフォルトタグを反映
function defaultCheckSync(baseElement) {
	let baseEl = $(`.chkDefaultUnvisibleFilt, .chkDefaultUnvisibleHide`);
	baseEl = baseElement || baseEl;
	baseEl.each(function(idx, element) {
		let el = $(element);
		if (el.prop("checked")){
			$(el.data("target")).prop("checked", true);
		}
	});
}

// ------------------------
// -----セーブ＆ロード-----
// ------------------------
var setting = {
	checkedDatas: {},
	optionDatas: null,
}
function saveStrage() {
	//     console.log("saveStrage");
	// 保存する形式に変換
	let tagIdList = $(".chkSaveTarget:checked").map((_, el) => $(el).attr("id")).get();
	let optionIdList = $(".chkSaveTargetOption:checked").map((_, el) => $(el).attr("id")).get();

	// 特定のページでは保存しない
	let regex = /\/(artist|group|character|parody)\//;
	if (!regex.test(location.href)) {
		let key = getUrlKey();
		setting.checkedDatas = setting.checkedDatas || {};
		if (tagIdList.length) {
			setting.checkedDatas[key] = tagIdList;
		} else {
			delete setting.checkedDatas[key];
		}
	}

	if (optionIdList.length) {
		setting.optionDatas = optionIdList;
	}
	else {
		setting.optionDatas = null;
	}
	let saveData = JSON.stringify(setting);
	// console.log(saveData);
	// ストレージへ保存
	localStorage.setItem('saveData', saveData);
}

function loadStrage() {
	//     console.log("loadStrage");
	try {
		// ストレージからデータ読み込み
		let loadData = localStorage.getItem('saveData');
		// console.log(loadData);
		setting = JSON.parse(loadData);
	} catch (e) {}
	// console.log(setting);
}

// ロードしたデータからチェックボックスの状態を復元
function initChk() {
	let key = getUrlKey();
	let tagIdList = setting.checkedDatas[key];
	// console.log(tagIdList.length);
	// 取得したデータからチェックを復元
	if (tagIdList) {
		tagIdList.forEach(val => {
			$(`#${val}`).prop("checked", true);
		});
	}

	if (setting.optionDatas) {
		setting.optionDatas.forEach(val => {
			$(`#${val}`).prop("checked", true);
		});
	}
}

function getUrlKey() {
	let parser = new URL(location.href);
	// 空白は削除するためフィルタをかける
	let pathAry = parser.pathname.split("/").filter(e => e);
	// console.log(`${pathAry[0]}/${pathAry[1]}`);
	return `${pathAry[0]}/${pathAry[1]}`;
}

// --------------------
// タグ情報取得
// --------------------
let tagList = [];
function loadTagList(finishedFunc) {
	let data = null;
	let data2 = null;
	let doneProc = function() {
		// タグリストを取得
		$(data).find("#tag-container .tag").each(function(idx, element) {
			let el = $(element);
			let obj = {
				tagId: el.attr("class").split(" ")[1].slice(4),
				name: el.find(`.name`).text(),
				count: el.find(`.count`).text()
			}
			tagList.push(obj);
		});
		$(data2).find("#tag-container .tag").each(function(idx, element) {
			let el = $(element);
			let obj = {
				tagId: el.attr("class").split(" ")[1].slice(4),
				name: el.find(`.name`).text(),
				count: el.find(`.count`).text()
			}
			tagList.push(obj);
		});
		// console.log(tagList);
		if (finishedFunc) finishedFunc();
	};

	if (!tagList.length) {
		$.ajax({
			url: "/tags/popular"
		}).done(function(dd) {
			data = dd;
			if (data && data2) doneProc();
		}).fail(function(dd) {
			console.error(`load count data fail.`);
			// console.log(data);
		});
		$.ajax({
			url: "/tags/popular?page=2"
		}).done(function(dd) {
			data2 = dd;
			if (data && data2) doneProc();
		}).fail(function(dd) {
			console.error(`load count data fail.`);
			// console.log(data);
		});
	} else {
		if (finishedFunc) finishedFunc();
	}
}

// ↓これはクロスサイトリスクリプティング対策でポリシーにより呼び出せなかった
// let nyaaTagList = [];
// function loadNyaaTagList(finishedFunc) {
// 	let data = null;
// 	let data2 = null;
// 	let doneProc = function() {
// 		// タグリストを取得
// 		$(data).find("#tag-container .tag").each(function(idx, element) {
// 			let el = $(element);
// 			let txt = el.text();
// 			let obj = {
// 				tagId: el.attr("class").split(" ")[1].slice(4),
// 				name: txt.slice(0, txt.indexOf('(')).trim(),
// 				count: parseInt(txt.slice(txt.indexOf('(')).replace(/(\(|\)|,)/g, ""))
// 			}
// 			nyaaTagList.push(obj);
// 		});
// 		$(data2).find("#tag-container .tag").each(function(idx, element) {
// 			let el = $(element);
// 			let txt = el.text();
// 			let obj = {
// 				tagId: el.attr("class").split(" ")[1].slice(4),
// 				name: txt.slice(0, txt.indexOf('(')).trim(),
// 				count: parseInt(txt.slice(txt.indexOf('(')).replace(/(\(|\)|,)/g, ""))
// 			}
// 			nyaaTagList.push(obj);
// 		});
// 		// console.log(nyaaTagList);
// 		if (finishedFunc) finishedFunc();
// 	};

// 	$.ajax({
//         url: "https://ja.nyahentai.com/tags/popular"
//     }).done(function(dd) {
// 		data = dd;
// 		if (data && data2) doneProc();
//     }).fail(function(dd) {
//         console.error(`load count data fail.`);
// 		// console.log(data);
//     });
// 	$.ajax({
// 		url: "https://ja.nyahentai.com/tags/popular/page/2"
// 	}).done(function(dd) {
// 		data2 = dd;
// 		if (data && data2) doneProc();
// 	}).fail(function(dd) {
// 		console.error(`load count data fail.`);
// 		// console.log(data);
// 	});
// }

// ----------
// 方向キー
// ----------
$(function() {
	$(document).keyup((e) => {
		let lnk = null;
		let $a = null;
		switch(e.key){
			case "ArrowRight": // Key[→]
				// ページネーションがない場合は無効
				if (!enableLeftRight) break;
				// テキスト欄にフォーカスがある場合は無効
				if(isInputTypeFocus()) break;

				$a = $("a.next, .next a").first();
				console.log($a.attr("href"));
				if ($a.length)
					location.href = $a.attr("href");
				break;
			case "ArrowLeft": // Key[←]
				// ページネーションがない場合は無効
				if (!enableLeftRight) break;
				// テキスト欄にフォーカスがある場合は無効
				if(isInputTypeFocus()) break;

				$a = $("a.previous, .previous a").first();
				console.log($a.attr("href"));
				if ($a.length)
					location.href = $a.attr("href");
				break;
				//             case " ": // Space
				//                 loadGallery();
				//                 break;
		}
	});

	$(document).keydown((e) => {
	    switch(e.key){
	        case " ": // Space
				// テキスト欄にフォーカスがある場合は無効
				if(isInputTypeFocus()) break;

	            if (mainContainer) {
	                loadGallery();
	                return false;
	            }
	            break;
	    }
	});
});

function isInputTypeFocus() {
	if(document.activeElement) {
		if($(document.activeElement).attr("type") == "search") return true;
		if($(document.activeElement).attr("type") == "text") return true;
		if($(document.activeElement)[0].tagName.toLowerCase() == "textarea") return true;
	}
	return false;
}