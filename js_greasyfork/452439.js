// ==UserScript==
// @name         除外ワード機能を追加
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  ワードを除外したい
// @author       You
// @match        https://shiwehi.com/tools/wordsearch/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shiwehi.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452439/%E9%99%A4%E5%A4%96%E3%83%AF%E3%83%BC%E3%83%89%E6%A9%9F%E8%83%BD%E3%82%92%E8%BF%BD%E5%8A%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/452439/%E9%99%A4%E5%A4%96%E3%83%AF%E3%83%BC%E3%83%89%E6%A9%9F%E8%83%BD%E3%82%92%E8%BF%BD%E5%8A%A0.meta.js
// ==/UserScript==

/////////////////////////////////////////////////////////////////////////////////////////////////
/**
*@note 要素の変更を監視 ここから ---
*/

//検索結果が表示されたら実行
var observer = new MutationObserver(function(){
	if(!document.getElementById("result-list").children.length){return;}
	document.getElementById("filter-list-copy").value = `除外処理中…`
	getAllIndexeddbData()
});


/** 監視対象の要素オブジェクト */
//検索結果のワードが表示される要素
const elem = document.getElementById("result")


/** 監視時のオプション */
const config = {
	childList: true,//「子ノード（テキストノードも含む）」の変化
	subtree: true
}


/** 要素の変化監視をスタート */
observer.observe(elem, config);

/**
*@note 要素の変更を監視 ここまで ---
*/
/////////////////////////////////////////////////////////////////////////////////////////////////






/////////////////////////////////////////////////////////////////////////////////////////////////
/**
*@note IndexedDB 関連 ここから ---
*/


let db;
let indexedDB = window.indexedDB || window.mozIndexedDB || window.msIndexedDB;
let OptionDatabaseObject = {}
const STORE_NAME = "filterDB";
const STORE_KEYPATH = ["filterList","filterWord"];

//filterDBにアクセス
(function accessIndexedDB(){
	const OPEN_REQUEST = indexedDB.open(STORE_NAME, 1.0);

	//データベースストア新規作成。(初回アクセス時)
	OPEN_REQUEST.onupgradeneeded = function(event) {
		// データベースのバージョンに変更があった場合(初めての場合もここを通ります。)
		db = event.target.result;
		const CREATE_filterList = db.createObjectStore("filterList", { keyPath:STORE_KEYPATH[0]});
		const CREATE_Word = db.createObjectStore("filterWord", { keyPath:STORE_KEYPATH[1]});
	}

	//データベースストアアクセス成功時。
	OPEN_REQUEST.onsuccess = function(event) {
		db = event.target.result;
	}
})();


//filterDBに除外検索ワードを保存
function putOptionSaveData(keyPath,Data){
	const SEND_DATA = {[STORE_KEYPATH[keyPath]] : Data};
	const OPEN_REQ = window.indexedDB.open(STORE_NAME);

	OPEN_REQ.onsuccess = function(event){
		var db = event.target.result;
		var trans = db.transaction(STORE_KEYPATH[keyPath], 'readwrite');
		var store = trans.objectStore(STORE_KEYPATH[keyPath]);
		var putReq = store.put(SEND_DATA);
	}
}

//filterDBの除外検索ワードを全部取得
function getAllIndexeddbData() {
    //トランザクション
    var transaction = db.transaction(STORE_KEYPATH, 'readonly');
    //オブジェクトストアにアクセスします。
    var listObjectStore = transaction.objectStore(STORE_KEYPATH[0]);
    var wordObjectStore = transaction.objectStore(STORE_KEYPATH[1]);
    //全件取得
    var listRequest = listObjectStore.getAllKeys()
	var wordRequest = wordObjectStore.getAllKeys()
    //取得が成功した場合の関数宣言
	listRequest.onsuccess = function(event) {
		//除外ワード一覧{オブジェクト}
		filterItem = event.target.result;


		//特定のワードを除外した配列を作成
		//createFilterList(result)
	};

	wordRequest.onsuccess = function(event) {
		//除外ワード一覧{オブジェクト}
		 const result = event.target.result;
		const wordLength = document.getElementById("result-list").firstChild.textContent.length
		filterItem = filterItem.concat( result.filter((el) => el.length == wordLength) )

		createFilterList(result)
	};
}
/**
*@note IndexedDB 関連 ここまで ---
*/
/////////////////////////////////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////////////////////////////////////
/**
*@note 特定のワードを除外する処理 ここから ---
*/
let array = []
let filterItem = []
let filterResult = ""
function createFilterList(result){

	//謎解き単語検索βの検索結果ワード一覧
	const RESULT_LIST = document.getElementById("result-list").children

	//検索結果ワード一覧の配列を生成
	array = []
	for(let i=0;i<RESULT_LIST.length;i++){
		array.push(RESULT_LIST[i].textContent)
	}

	filterResult = []
	//特定のワードを除外
	for(let i=0;i<filterItem.length;i++){
		const FILTER_ARRAY = array.filter((el) => !el.includes(filterItem[i]))
		const FILTER_DIFF = array.length - FILTER_ARRAY.length
		if(FILTER_DIFF){
			filterResult.push({name : filterItem[i],diff:FILTER_DIFF})
		}
		array = FILTER_ARRAY
	}

	filterResult.sort((a,b) => b.diff - a.diff)

	//コピーボタンを有効化
	document.getElementById("filter-list-copy").value = `${RESULT_LIST.length}件 → ${array.length}件 ワード一覧をコピー`
	document.getElementById("filter-list-copy").disabled = false
	document.getElementById("add-filter-word").disabled = false

	document.getElementById("filter-output-area").value = array.join("\n")
}





/**
*@note 特定のワードを除外する処理 ここまで ---
*/
/////////////////////////////////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////////////////////////////////////
/**
*@note 要素追加 ここから ---
*/

document.getElementById("search-box").insertAdjacentHTML("afterend",`
<input placeholder="除外ワードを入力してEnter" id="filter-box">
<textarea id="filter-output-area" value="" style="display:none;"></textarea>
<input type="button" id="filter-list" value="除外リスト">
<input type="button" id="filter-list-copy" value="コピー" disabled>
<input type="button" id="add-filter-word" value="検索結果を除外リストに追加" disabled>
`)

/**
*@note 要素追加 ここまで ---
*/
/////////////////////////////////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////////////////////////////////////
/**
*@note 要素にイベント追加 ここから ---
*/

document.getElementById("filter-box").addEventListener("change", e => {
	if(e.target.value){
		if(e.target.value.match(" ")){
			const list = e.target.value.split(" ")
			for(let i=0;i<list.length;i++){
				putOptionSaveData(0,list[i])
			}
			alert(`${list.join("\n")}を含むワードを除外リストに追加しました。`)
		}else{
			putOptionSaveData(0,e.target.value)
			alert(`「${e.target.value}」を含むワードを除外リストに追加しました。`)
		}
		e.target.value = ""
	}
})

document.getElementById("filter-list").addEventListener("click", e => {
	alert("除外リストは 「F12 > Applicationタブ > IndexedDB > filterDB - https://shiwehi.com > filterDB」　を見てね")
})

document.getElementById("filter-list-copy").addEventListener("click", e => {
	navigator.clipboard.writeText(document.getElementById("filter-output-area").value);
	let FILTER_RESULT = ""
	for(let i=0;i<filterResult.length;i++){
		filterResult[i]
		FILTER_RESULT += `${filterResult[i].name} : ${filterResult[i].diff}件　除外\n`
	}
	alert(`${FILTER_RESULT}\nが含まれるワードを除外\nコピー完了`)
})

document.getElementById("add-filter-word").addEventListener("click", e => {
	for(let i=0;i<array.length;i++){
		putOptionSaveData(1,array[i])
	}
	alert(`${array.length}件のワードを除外リストに追加しました。`)
})
/**
*@note 要素にイベント追加 ここまで ---
*/
/////////////////////////////////////////////////////////////////////////////////////////////////
