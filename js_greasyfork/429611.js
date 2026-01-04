// ==UserScript==
// @name         ウマ娘イベントチェッカー Util
// @namespace    http://tampermonkey.net/
// @version      0.13.0
// @description  ウマ娘イベントチェッカーの汎用Utilです。見た目をわかりやすくします。
// @author       kawaidainf
// @match        https://gamewith.jp/uma-musume/article/show/259587
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
/* load jQuery */
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/429611/%E3%82%A6%E3%83%9E%E5%A8%98%E3%82%A4%E3%83%99%E3%83%B3%E3%83%88%E3%83%81%E3%82%A7%E3%83%83%E3%82%AB%E3%83%BC%20Util.user.js
// @updateURL https://update.greasyfork.org/scripts/429611/%E3%82%A6%E3%83%9E%E5%A8%98%E3%82%A4%E3%83%99%E3%83%B3%E3%83%88%E3%83%81%E3%82%A7%E3%83%83%E3%82%AB%E3%83%BC%20Util.meta.js
// ==/UserScript==

(function() {
    'use strict';
})();

const expandEventNameList = [
    "追加の自主トレ",
    "新年の抱負",
    "夏合宿（2年目）にて",
	"夏合宿(2年目)にて",
	"夏合宿(3年目)終了",
    "初詣",
    "お大事に！",
    "無茶は厳禁！",
    "レース勝利！(1着)",
    "レース入着(2~5着)",
    "レース敗北(6着以下)",
    // キャラによっては↑の名前じゃないレースイベントがある
    "レース勝利！",
    "レース入着",
    "レース敗北"
];

var styleTagStr = `
<!--
スピード #0c9ef4
スタミナ #ee7460
パワー #f1a73e
根性 #ea6f9d
賢さ #4eae6d
-->
<style>
#SearchResultList.w-search-event-list>li table ._event-name {
    font-size: 1rem !important;
    margin-bottom: 0 !important;
    padding-bottom: 0 !important;
}
#SearchResultList.w-search-event-list>li table ._event-name.target {
    font-size: 13px !important;
    color: #aaaaaa !important;
}
#SearchResultList.w-search-event-list>li table.normalTable {
    margin: 0.5rem 0 0 !important;
}
#SearchResultList.w-search-event-list>li table tr th {
    padding-top: 1px;
    padding-bottom: 1px;
}
#SearchResultList.w-search-event-list>li table.exTable {
    overflow: hidden;
    display: inline-block;
}
#SearchResultList.w-search-event-list>li table.exTable tbody {
    width: 100%;
    display: table;
}
#SearchResultList.w-search-event-list>li table.exTable.open {
    height: unset;
}
#SearchResultList.w-search-event-list>li table.exTable.close {
    height: 1.6em;
}

/* スクロールボタン */
.divBtnScrollEvent {
    position: fixed;
    right: 10vw;
    bottom: 10vw;
    /* background-color: red; */
    overflow: visible;
    display: inline-block;
    z-index: 1100;
}
.btnScrollEvent {
    background-color: #c5c1c1;
    color: #ffffff;
    border-radius: 2rem;
    display: inline-block;
    width: 3rem;
    height: 3rem;
    font-weight: bold;
    font-size: 1.5rem;
    text-align: center;
    line-height: 3rem;
    margin: 0.25rem;
    cursor: pointer;
	opacity: 60%;
}
.btnScrollEvent:hover {
    opacity: 100%;
}
.btnScrollEvent.top {

}
.btnScrollEvent.bottom {

}

/*.sidecharListDialog {
    position: fixed;
    top: 3.5rem;
    right: 0rem;
    width: 20rem;
    height: 90%;
    background-color: #e2e2e2;
    border-radius: 1rem;
    transition: all 250ms 0s ease;
}
.sidecharListDialog.close {
    right: -17rem;
}
.sidecharListDialog .btnDialogToggle {
    border-radius: 1rem;
    background-color: white;
    font-size: 0.75rem;
    display: inline-block;
    padding: 0.1rem 0.25rem;
    margin-left: 0.25rem;
    margin-top: 0.25rem;
}*/
</style>
`;

$(function(){
    $("head").append($(styleTagStr));
	$("body").append(`
	<div class="divBtnScrollEvent">
	<button class="btnScrollEvent top">↑</button>
	<button class="btnScrollEvent bottom">↓</button>
	</div>
	`);

// 	// サイドキャラクターリストを追加
// 	setTimeout(() => {
// 		let sideCharaListDialog = $(`
//         <div class="sidecharListDialog">
//         <span class="btnDialogToggle">toggle</span>
//         <ol class="sideCharactorSelectList"></ol>
//         </div>`);
// 		$("body").append(sideCharaListDialog);
// 		$(".btnDialogToggle").on("click", function() {
// 			if (sideCharaListDialog.hasClass("close"))
// 				sideCharaListDialog.removeClass("close");
// 			else sideCharaListDialog.addClass("close");
// 		});
// 		let cnt = 0;
// 		console.log($(`#CharaSelectList li`).length);
// 		$(`#CharaSelectList li`).each((i, el) => {
// 			console.log(`each ${++cnt}`);
// 			let self = $(el);
// 			$(`.sideCharactorSelectList`).append(self.clone());
// 		});

// 		$(`.sideCharactorSelectList`).attr("id", "CharaSelectList");
// 	}, 500);

	// 保存データをロード
	loadStrage();

	// // キャラカードクリック時初期化
	// $(document).on("click", "._card", function() {
	// 	init();
	// 	saveStrage();
	// });

	// 監視処理初期化
	let observer = new MutationObserver(function() {
		// console.log(`change DOM`);
		if (init())
			saveStrage();
	});

	// イベントリスト監視スタート
	observer.observe($(`ol.w-search-event-list`)[0], {
		attributes: false,
		childList: true,
		charactorData: true,
		subtree: false,
	});

	// 遅延させる処理
    setTimeout(function() {
		// 育成キャラ選択リストを1ページにする
		appendCharactorToFirstPage();

		// 初期カード選択を行う
		let targetEl = $(setting.lastActiveCardSelector);
		if (targetEl[0] && setting.lastActiveCardSelector)
			targetEl.click();
		else
			$("._card").first().click();
    }, 500);

    // 折りたたみ対象クリック時
    $(document).on("click", ".exExpand", function() {
        let self = $(this);
        let table = self.closest("table");

        if (isOpenTable(table))
            closeTable(table); // 閉じる処理
        else
            openTable(table); // 開く処理
	});

	// scrollイベント
	$(`.btnScrollEvent.top`).on("click", function() {
		let top = $(`h3._header`).offset().top;
		scrollTo(0, top);
	});
	$(`.btnScrollEvent.bottom`).on("click", function() {
		let target = $(`.normalTable`).last();
		let bottom = target.offset().top + target.height();
		let clientHeight = document.documentElement.clientHeight;
		scrollTo(0, bottom - clientHeight + 10);
	});
});

// キャラカードクリック時にイベントのデザイン変更
var cnt = 0;
function init() {
	if (!$(`ol.w-search-event-list table`).length ||
		$(`.normalTable`).length) {
		// console.log(`return init proc`);
		return false;
	}
	// console.log(`init proc ${++cnt}`);
    $("._event-name").each((_, element) => {
        let el = $(element);

        let th = el.closest("th");
        let table = th.closest("table");

        let eventName = el.text().trim();
        if (expandEventNameList.some((e) => e == eventName)) {
            el.addClass("target");

            // 折りたたみ
            th.addClass("exExpand");

            table.addClass("exTable");
            closeTable(table);

            // 折りたたみイベントの順序を下に変更
            let li = table.closest("li");
            li.remove();
            $("ol.w-search-event-list").append(li);
        }
        else {
            table.addClass("normalTable");
        }
    });

	return true;
}

function isOpenTable(table) {
    return table.hasClass("open");
}

function openTable(table) {
    table.removeClass("close");
    table.addClass("open");
}

function closeTable(table) {
    table.removeClass("open");
    table.addClass("close");
}

function appendCharactorToFirstPage() {
	let liAry = [];
	$(`#CharaSelectListWrap li`).each((idx, el) => {
		liAry.push($(el).clone());
	});
	let $ol = $(`#CharaSelectListWrap ol:nth-child(1)`);
	$ol.empty();
	liAry.forEach($el => {
		$ol.append($el);
	});
}

// --------------------
// セーブ＆ロード
// --------------------
var setting = {
	lastActiveCardSelector: null,
};
function saveStrage() {
    // console.log("saveStrage");
	// ._right ._card[data-name="ダイワスカーレット"][data-rarity="パワSSR"]
	let targetCard = $("._card.is-active");
	// なにも選ばれていないときは空とする
	if (!targetCard.length) {
		setting.lastActiveCardSelector = null;
	}
	// 保存対象あり
	else {
		let cardName = targetCard.data("name");
		let cardRarity = targetCard.data("rarity");
		let targetCardAreaClass = targetCard.closest("._left, ._right").attr("class");
		// console.log(`${cardName}, ${cardRarity}`);
		if (!cardName) return;

		// 左（育成ウマ娘）か右（サポート）かも指定する
		let targetSelector = `.${targetCardAreaClass} ._card[data-name="${cardName}"]`;
		if (cardRarity)
			targetSelector = `${targetSelector}[data-rarity="${cardRarity}"]`;

		setting.lastActiveCardSelector = targetSelector;
	}

	let saveData = JSON.stringify(setting);
	// console.log(saveData);
	GM_setValue("saveData", saveData);
}

function loadStrage() {
//     console.log("loadStrage");
	let loadData = GM_getValue("saveData");
	// console.log(loadData);
	if (!loadData) return;

	setting = JSON.parse(loadData);
	// console.log(setting);
}