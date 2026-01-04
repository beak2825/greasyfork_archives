// ==UserScript==
// @name         SaveSearchCriteriaForX
// @namespace    https://github.com/fCznoUrJ1cvINs4/
// @version      0.1
// @description  X検索 キーワードを登録して検索を簡単に
// @author       fCznoUrJ1cvINs4
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @license      MIT
// @grant        GM_addElement
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @require      https://code.jquery.com/jquery-3.7.1.slim.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/keymaster/1.6.1/keymaster.min.js
// @downloadURL https://update.greasyfork.org/scripts/547535/SaveSearchCriteriaForX.user.js
// @updateURL https://update.greasyfork.org/scripts/547535/SaveSearchCriteriaForX.meta.js
// ==/UserScript==

/*jshint esversion: 11 */
(($, undefined)=>{
	$(()=>{
		console.log("Start SaveSearchCriteriaForX");
		
		const localStorageKey = 'SaveSearchCriteriaForX-LocalStorageKey';		// loaclStorage Key
		
		// メッセージと表題
		const Resources = {
			Messages: {
				
			},
			Captions: {
				DialogTitle: { standard:"Search criteria",ja:"検索条件" },
				AddKeywordButton: { standard:"Add search criteria",ja:"キーワード追加" },
				CloseDialogButton: { standard:"Close",ja:"閉じる" },
				GmMenu: { standard:"Open",ja:"検索条件を開く" },
			}
		};
		const GetMessage = (key)=> key ?Resources.Messages[key][navigator.language] ?? Resources.Messages[key].standard ?? "Not Defined" : "";
		const GetCaption = (key)=> key ? Resources.Captions[key][navigator.language] ?? Resources.Captions[key].standard ?? "Not Defined" : "";
		
		// ダイアログ
		const dialog = GM_addElement(
			document.body,
			"dialog",
			{
				id: "SaveSearchCriteriaForX-Dialog",
				title: GetCaption("DialogTitle")		// DialogTitle: { standard:"Menu",ja:"検索条件保存メニュー" },
			}
		);
		
		// コンテナ
		const container = GM_addElement(
			dialog,
			"div",
			{
				style: "max-height:70vh;display:grid;grid-template-columns:1fr;grid-template-rows:1fr auto 1fr;border:solid 2px silver;"
			}
		);
		
		// コントロール
		const controlBox = GM_addElement(
			container,
			"div",
			{
				style: "grid-row: 1;"
			}
		);
		
		GM_addElement(
			controlBox,
			"input",
			{
				id: "SaveSearchCriteriaForX-AddKeywordText",
				type: "text",
				style: "margin: .5rem;border:solid 1px silver;"
			}
		);
		GM_addElement(
			controlBox,
			"input",
			{
				id: "SaveSearchCriteriaForX-AddKeywordButton",
				type: "button",
				style: "margin: .5rem;border:solid 1px silver;padding:0 .5rem;",
				value: GetCaption("AddKeywordButton")		// AddKeywordButton: { standard:"Add criteria",ja:"キーワード追加" },
			}
		);
		
		// リンク表示エリア
		const linkBox = GM_addElement(
			container,
			"div",
			{
				id: "SaveSearchCriteriaForX-LinkContainer",
				style: "grid-row: 2;overflow:auto;padding:2rem 1rem;"
			}
		);
		
		const AddSearchLink = (keyword) => {
			if(keyword) {
				// リンクと削除ボタンをdivに入れて追加
				const div = GM_addElement(
					linkBox,
					"div",
					{style: "padding:4px;"}
				);
				GM_addElement(
					div,
					"a",
					{
						href: `https://x.com/search?q=${keyword}&f=live`,
						textContent: keyword,
						style: "margin:0 8px;"
					}
				);
				GM_addElement(
					div,
					"input",
					{
						type: "button",
						value: "x",
						style: "border:solid 1px silver;padding:0 .5rem;",
						searchx_delete: keyword
					}
				);
			}
		};
		
		const jsonStr = localStorage.getItem(localStorageKey) ?? "";
		let keywords = [];
		if(jsonStr) keywords = JSON.parse(jsonStr);
		for (let i=0; i<=keywords.length; i++) AddSearchLink(keywords[i]);
		
		// OKボタン表示エリア
		const footerBox = GM_addElement(
			container,
			"div",
			{
				style: "grid-row: 3;"
			}
		);
		GM_addElement(
			footerBox,
			"input",
			{
				id: "SaveSearchCriteriaForX-CloseDialog",
				type: "button",
				style: "margin: .5rem;float:right;",
				value: GetCaption("CloseDialogButton")		// CloseDialogButton: { standard:"Close",ja:"閉じる" },
			}
		);
		
		//
		// 追加検索ダイアログを開く (+本体のスクロールを無効化)
		const OpenSaveSearchCriteriaForXDialog = ()=> {
			$("#SaveSearchCriteriaForX-Dialog").get(0).showModal();
			document.documentElement.style.overflow = "hidden";
		};
		
		//
		// 追加検索ダイアログを閉じる (+本体のスクロールを有効化)
		const CloseSaveSearchCriteriaForXDialog = () => $("#SaveSearchCriteriaForX-Dialog").get(0).close();
		$("#SaveSearchCriteriaForX-Dialog").on("close",()=>document.documentElement.style.overflow = "auto");
		
		$("#SaveSearchCriteriaForX-AddKeywordButton").on("click",()=>{
			const keyword = $("#SaveSearchCriteriaForX-AddKeywordText").val();
			if(keyword && keywords.findIndex(x=>x==keyword)==-1) {
				keywords.push(keyword);
				AddSearchLink(keyword);
				localStorage.setItem(localStorageKey, JSON.stringify(keywords));
				$("#SaveSearchCriteriaForX-AddKeywordText").val("");
			}
			return false;
		});
		$("#SaveSearchCriteriaForX-Dialog").on("click",'input[searchx_delete]',(evt) => {
			const $targ = $(evt.target);
			keywords = keywords.filter(x=>x!=$targ.attr("searchx_delete"));
			localStorage.setItem(localStorageKey, JSON.stringify(keywords));
			$($targ.parent()).remove();
			return false;florat
		});
		$("#SaveSearchCriteriaForX-CloseDialog").on("click",()=>{
			CloseSaveSearchCriteriaForXDialog();
			return false;
		});
		
		// ダイアログ表示 1 GMメニュー
		GM_registerMenuCommand(
			GetCaption(),			// GmMenu: { standard:"Open",ja:"検索条件を開く" },
			()=>OpenSaveSearchCriteriaForXDialog());

		// ダイアログ表示 2 Ctrl + Enter
		key('ctrl+enter',()=>OpenSaveSearchCriteriaForXDialog());
		
		// ダイアログ表示 3 Ctrl + Xアイコンをクリック
		$("#react-root").on("click",'a[aria-label="X"]',(evt)=>{
			if(evt.ctrlKey) {
				OpenSaveSearchCriteriaForXDialog();
				return false;
			}
		});
		
		// ダイアログ表示 4 Xアイコンを右クリック
		$("#react-root").on("contextmenu",'a[aria-label="X"]',()=>{
			OpenSaveSearchCriteriaForXDialog();
			return false;
		});
		
        console.log("SaveSearchCriteriaForX Ready");
	});
})(window.jQuery.noConflict(true));