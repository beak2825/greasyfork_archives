// ==UserScript==
// @name         nyahentai.com search
// @namespace    http://tampermonkey.net/
// @version      1.5.1
// @description  nyahentai custom tags filter.
// @author       You
// @license      MIT
// @match        https://ja.nyahentai.com/*
/* load jQuery */
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/435998/nyahentaicom%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/435998/nyahentaicom%20search.meta.js
// ==/UserScript==

(function() {
    'use strict';
})();

var mainContainer = null;
var enableLeftRight = false;
var btnNextLoad = null;
var categoryGalleryCount = null;
var currentPageCount = null;
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
.divChk {
    overflow: auto;
    max-height: 92vh;
    background-color: #444444;
    border-radius: 0.5rem;
    padding: 0.5rem 0.25rem;
}
.divChkFilt {
    position: fixed;
    top: 5rem;
    left: 1rem;
    max-width: 17rem;
}
.divChkHide {
    position: fixed;
    top: 5rem;
    right: 1rem;
	max-width: 17rem;
}
.btnNextLoadBottom {
    width: 100%;
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
.hide { display:none; }

a { cursor: pointer; }
.alignLeft { text-align: left; }
.alignRight { text-align: right; }
.divChkOption {
    position: fixed;
    inset: 0;
    top: 5rem;
    margin: 0 auto;
    width: 50rem;
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
.divChkOption table {
    margin: 0 auto;
}
.divChkOption table td {
    border-bottom: 1px solid #aaaaaa;
}
/* ギャラリーリンク */
.nhentaiLink {
    display: block;
    width: 2rem;
    height: 2rem;
    position: absolute;
    z-index: 1;
    background-color: gray;
    overflow: hidden;
    border-radius: 0.5rem;
    opacity: 0.6;
    line-height: 2rem;
    font-weight: bold;
}
.nhentaiLink:hover {
    opacity: 1;
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
</style>
`

$(function(){
    // outputTags();

	// nhentaiへのリンクを作成
	if ($("#cover").length) {
		let btn = $("#download").clone();
		btn.attr("id", "nhentaiLink");
		btn.text("nhentai.netで見る");
		btn.attr("href", replaceToNhentai(location.href));
		$(".buttons").append(btn);
	}

	// ページネーションがあれば左右キー移動を有効にする
	if ($(".pagination").length) {
		enableLeftRight = true;
	}

    // ソート部があるところだけギャラリーやる
    if ($("div.sort").length && $(".gallery").length) {

        $("head").append($(styleTagStr));
        mainContainer = $(".index-container");
        // 上部にもページネーションを追加
        mainContainer.before($("#open_point.pagination.ilist").clone());

        // 今のカテゴリページの全カウントを取得
        categoryGalleryCount = $(".count").first().text().replaceAll(/,|\(|\)/g, "");
        // console.log(categoryGalleryCount);

        // 現在のページを取得
        currentPageCount = parseInt($(".page.current a").first().text());

        // ----------表示領域を追加----------
        mainContainer.before(`<div class='divChk divChkFilt'>
        <button class='btnClear'>全解除</button>
        <button class='btnDefaultFilt'>デフォルト</button>
        </div>`);
        //     console.log("datasForEach");
        // ----------表示領域を追加ここまで----------

        // ----------非表示領域を追加----------
        mainContainer.after(`<div class='divChk divChkHide'>
        <button class='btnClear'>全解除</button>
        <!--<button class='btnDeleteHidden'>非表示削除</button>-->
        <button class='btnDefaultHide'>デフォルト</button>
        </div>`);
        //     console.log("datasForEach");
        // ----------非表示領域を追加ここまで----------

		// ----------オプションダイアログ----------
		mainContainer.after(`<div class="divChk divChkOption close">
		<div class="alignRight"><button class="btnOptionClose">閉じる</button></div>
		</div>`);
		$(`.btnOptionClose`).on("click", () => $(`.divChkOption`).addClass("close"));
		$(`.menu.right`).append($(`<li><a href="javascript:void(0)" class="lnkOption">ViewOption</a></li>`));
		$(`.lnkOption`).on("click", function() {
			if ($(`.divChkOption`).hasClass("close")) $(`.divChkOption`).removeClass("close");
			else $(`.divChkOption`).addClass("close");
		});
		// ----------オプションダイアログここまで----------

        // カウント部
        $("nav ul.menu").first().append("<li class='desktop viewCount'>xxxx</li>");

		// ページネーションがあれば次ページロードボタン追加
		if ($(".pagination").length) {
			$(`.menu.right`).prepend($(`<li><a href="javascript:void(0)" class="lnkNextLoad">次ページ読込</a></li>`));
			btnNextLoad = $(`<button class='btnNextLoad btnNextLoadBottom'>次ページロード</button>`);
			mainContainer.append(btnNextLoad);
		}

		// nhentaiへのリンクを追加
		addNhentaiLinkToGallery($(`.gallery`));

        // 初期処理
		loadStrage();
		loadTagList(function() {
			// console.log(`loadTagList Finished`);

			// カウントの降順
			let rList = tagList.sort((a, b) => b.count - a.count);
			rList.unshift(
				{ tagId: '33173', name: '漫画', count: null },
				{ tagId: '33172', name: '同人誌', count: null },
				{ tagId: '23237', name: '単行本', count: null },
				{ tagId: '10988', name: 'アンソロジー', count: null },
				{ tagId: '6346', name: '日本語', count: null },
			);

			// ----------表示タグ----------
			let divChkFilt = $(".divChkFilt");
			rList.forEach(el => {
				if ($(`#chkFilt${el.tagId}`).length) return;
				let count = el.count ? `(${formatCount(el.count)})` : "";
				divChkFilt.append(`<div class="chkGroup">
                <input type='checkbox' class='chkTagFilt ${el.tagId} chkSaveTarget' id='chkFilt${el.tagId}' value='${el.tagId}' data-name='${el.name}'>
                <label class='lblChk' for='chkFilt${el.tagId}'>${el.name}<span class='count'>${count}</span></label>
                </div>`);
			});
			// ----------非表示タグ----------
			let divChkHide = $(".divChkHide");
			rList.forEach(el => {
				if ($(`#chkHide${el.tagId}`).length) return;
				let count = el.count ? `(${formatCount(el.count)})` : "";
				divChkHide.append(`<div class="chkGroup">
                <input type='checkbox' class='chkTagHide ${el.tagId} chkSaveTarget' id='chkHide${el.tagId}' value='${el.tagId}' data-name='${el.name}'>
                <label class='lblChk' for='chkHide${el.tagId}'>${el.name}<span class='count'>${count}</span></label>
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
				<td><input type="checkbox" class="chkUnvisibleFilt chkSaveTargetOption" id="chkUnvisibleFilt${obj.tagId}" data-target="#chkFilt${obj.tagId}"></td>
				<td><input type="checkbox" class="chkDefaultUnvisibleFilt chkSaveTargetOption" id="chkDefaultUnvisibleFilt${obj.tagId}" data-target="#chkFilt${obj.tagId}"></td>
				<td>${obj.name}</td>
				<td>${obj.count || "undefined"}</td>
				<td><input type="checkbox" class="chkUnvisibleHide chkSaveTargetOption" id="chkUnvisibleHide${obj.tagId}" data-target="#chkHide${obj.tagId}"></td>
				<td><input type="checkbox" class="chkDefaultUnvisibleHide chkSaveTargetOption" id="chkDefaultUnvisibleHide${obj.tagId}" data-target="#chkHide${obj.tagId}"></td>
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

			// 初期処理
			initChk();
			visibleSync();
			defaultCheckSync();
			showGallery();
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
			$(`.txtSettingJson`).val(loadData);
		});
		$(document).on("click", `.btnImport`, function() {
			// ストレージへ保存
			let val = $(`.txtSettingJson`).val();
			try {
				JSON.parse(val);
				localStorage.setItem('saveData', val);
			} catch {}
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
            $(this).closest(".divChk").find(":checked").prop("checked", false);
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

		// $(document).on("click", `.caption::before`, () => {
		// 	console.log("aaa");
		// });

        // // スクロール時
        // $(window).on('scroll', function () {
        //     // 最下部のときに自動読み込み
        //     if (isBottom()) {
        //         loadGallery();
        //     }
        // });
    }
});

function isBottom() {
    var doch = $(document).innerHeight(); //ページ全体の高さ
    var winh = $(window).innerHeight(); //ウィンドウの高さ
    var bottom = doch - winh; //ページ全体の高さ - ウィンドウの高さ = ページの最下部位置
    //一番下までスクロールした時
    if (bottom <= $(window).scrollTop()) {
        return true;
    }
    return false;
}

// 数値のフォーマット
function formatCount(num) {
	let roundNum = Math.round(num / 100);
	let strRoundNum = String(roundNum);
	return `${strRoundNum.slice(0, -1)}.${strRoundNum.slice(-1)}K`
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
        let el = $(element);
        let galleryTags = el.data("tags").split(" ");
//         console.log(galleryTags);

        // フィルタータグのすべて満たしているかつ、非表示タグのすべてを回避すれば表示
        let visibleEl = filtTags.every((tag) => galleryTags.includes(tag)) && !hideTags.some((tag) => galleryTags.includes(tag));
        if (visibleEl) {
            showCount++;
            el.removeClass("hide");
        }
        else {
            hideCount++;
            el.addClass("hide");
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
var maxAjaxCount = 40;
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

    let loadHref = $(".next").find("a").attr("href");
    // Get next page gallery.
    ajaxCount++;
    $("#content").addClass("loading");

    $.ajax({
        url: loadHref.substring(0, loadHref.lastIndexOf("/") + 1) + loadNextPage++
    }).done((data) => {
        var galleryData = $(data).find(".gallery");
        // console.log(galleryData.html());
        // 取得したギャラリーデータが前のページと全く同じなら読み込まない
        if (beforeLoadGalleryData && beforeLoadGalleryData == galleryData.html()) {
            $(".btnNextLoad").prop("disabled", true);
            return;
        }
		// nhentaiへのリンクを追加
		addNhentaiLinkToGallery(galleryData);
        beforeLoadGalleryData = galleryData.html();
        // 要素を追加
        btnNextLoad.before(galleryData);
        showGallery();
        if ($(".chkAutoRemoveHideElement:checked").length != 0) {
            deleteHideGellery();
        }
    }).fail(() => {
        if (!failAlert) {
            failAlert = true;
            // alert("ajax fail");
        }
        $(".btnNextLoad").prop("disabled", true);
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

// function deleteHideGellery() {
//     $(".gallery").each((idx, element) => {
//         if ($(element).is(':hidden')) {
//             $(element).remove();
//         }
//     });
// }

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

// ターゲットにnhentaiのリンクを追加
function addNhentaiLinkToGallery($galleries) {
	$galleries.each(function(idx, el) {
		let $el = $(el);
		let baseLnk = $el.find(`a.cover`);
		let lnk = $el.find(`.nhentaiLink`);
		if (!lnk.length) {
			lnk = $(`<a class="nhentaiLink" href="${replaceToNhentai(baseLnk[0].href)}" target="_blank">nh</a>`);
			$el.prepend(lnk);
		}
	});
}

// URL置き換え
function replaceToNhentai(url) {
	let parser = new URL(url);
	parser.host = "nhentai.net";
	return parser.href;
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

	let key = getUrlKey();
	setting.checkedDatas = setting.checkedDatas || {};
	if (tagIdList.length) {
		setting.checkedDatas[key] = tagIdList;
	} else {
		delete setting.checkedDatas[key];
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
			let txt = el.text();
			let obj = {
				tagId: el.attr("class").split(" ")[1].slice(4),
				name: txt.slice(0, txt.indexOf('(')).trim(),
				count: parseInt(txt.slice(txt.indexOf('(')).replace(/(\(|\)|,)/g, ""))
			}
			tagList.push(obj);
		});
		$(data2).find("#tag-container .tag").each(function(idx, element) {
			let el = $(element);
			let txt = el.text();
			let obj = {
				tagId: el.attr("class").split(" ")[1].slice(4),
				name: txt.slice(0, txt.indexOf('(')).trim(),
				count: parseInt(txt.slice(txt.indexOf('(')).replace(/(\(|\)|,)/g, ""))
			}
			tagList.push(obj);
		});
		// console.log(tagList);
		if (finishedFunc) finishedFunc();
	};

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
		url: "/tags/popular/page/2"
	}).done(function(dd) {
		data2 = dd;
		if (data && data2) doneProc();
	}).fail(function(dd) {
		console.error(`load count data fail.`);
		// console.log(data);
	});
}

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
				if($(document.activeElement).attr("type") == "search") break;

				$a = $("a.next, .next a").first();
				console.log($a.attr("href"));
                if ($a.length)
                    location.href = $a.attr("href");
                break;
            case "ArrowLeft": // Key[←]
				// ページネーションがない場合は無効
				if (!enableLeftRight) break;
				// テキスト欄にフォーカスがある場合は無効
				if($(document.activeElement).attr("type") == "search") break;

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
                if (mainContainer) {
                    loadGallery();
                    return false;
                }
                break;
        }
    });
});