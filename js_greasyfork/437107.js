// ==UserScript==
// @name         TypingTube バックアップ一覧表示
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  IndexedDBに保存されているタイピングデータをtableに表示します。
// @author       Toshi
// @match        https://typing-tube.net/my/movies/create
// @icon         https://www.google.com/s2/favicons?domain=typing-tube.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437107/TypingTube%20%E3%83%90%E3%83%83%E3%82%AF%E3%82%A2%E3%83%83%E3%83%97%E4%B8%80%E8%A6%A7%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/437107/TypingTube%20%E3%83%90%E3%83%83%E3%82%AF%E3%82%A2%E3%83%83%E3%83%97%E4%B8%80%E8%A6%A7%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==
let db;
let indexedDB = window.indexedDB || window.mozIndexedDB || window.msIndexedDB;


//譜面データのバックアップDBを開く
const openRequest = indexedDB.open("TypingTubeBackUpDb", 1.0);



/**
 * TypingTubeBackUpDbが開けた
 */
openRequest.onsuccess = function(event) {

	db = event.target.result;
	const transaction = db.transaction(["TypingTubeBackUpStore"], "readwrite");
	const store = transaction.objectStore("TypingTubeBackUpStore");
	const request = store.getAll(); // バックアップデータを全取得


	// バックアップデータの全取得が完了
	request.onsuccess = function (event) {

		if (event.target.result === undefined) {
			// キーが存在しない場合の処理
			return;

		} else {
			// 取得成功

			//取得したバックアップデータから表を作成。
			createBackUpList(event.target.result);

		}

	}
}

/**
 * 新規作成ボタンの下にバックアップされているタイピングデータの表を作成します。
 *
 * @ param backUpList {Object} IndexedDBに保存されている全てのタイピングデータ
 * @ type backUpTable {String} 追加するテーブルタグの文字列
 */

const createBackUpList = backUpList => {

let backUpTable = ` <i class="fas fa-check-square"></i><i class="fas fa-trash-alt" style="visibility: hidden;"></i>
                    <table class="table table-sm text-center table-hover" style="margin-bottom:5rem;background:rgb(0 0 0 / 50%);">
                     <thead class="font-weight-bold">
                       <tr class="m-0">
                          <td class="backup-checkbox">☑</td>
                          <td>譜面ID</td>
                          <td>バックアップ日</td>
                          <td>タイトル名</td>
                          <td>ライン数</td>
                       </tr>
                     </thead>`;


    // IndexedDBから取得したバックアップデータから表を作成
	for(let i=backUpList.length-1 ; i>-1 ; i--){
		const HREF = (isNaN(+backUpList[i].BackUpKey) ? `/movie/edit?videoid=` : `/movie/edit/`) + backUpList[i].BackUpKey;
		backUpTable +=
			`<tr data-href="${HREF}">
                       <td class="backup-checkbox"><input type="checkbox" name="${backUpList[i].BackUpKey}"></td>
                       <td class="backup-link">${(isNaN(+backUpList[i].BackUpKey) ? '新規' : backUpList[i].BackUpKey)}</td>
                       <td class="backup-link">${backUpList[i].Date}</td>
                       <td class="backup-link">${backUpList[i].Title}</td>
                       <td class="backup-link">${backUpList[i].TypingData.length}ライン</td>
                     </tr>`;

	}

	backUpTable += `</table>`;

	//'[action="/movie/from_youtube"]'は緑の新規作成ボタン
　　//緑の新規作成ボタンの下に表を追加。
	document.querySelector(`[action="/movie/from_youtube"]`).insertAdjacentHTML('afterend', backUpTable);



	// 追加した表の項目をクリックするとその譜面の編集画面に飛ぶクリックイベントを追加する。
	const DATA_HREF_SELECTOR = document.getElementsByClassName("backup-link");
	for(let i=0;i<DATA_HREF_SELECTOR.length;i++){
		DATA_HREF_SELECTOR[i].addEventListener('click', event => {
			window.location = event.target.parentElement.getAttribute('data-href');
		});
	}

	// チェックボックス周りのイベント追加。
	const BACKUP_CHECKBOX_SELECTOR = document.getElementsByClassName("backup-checkbox");

	for(let i=1;i<BACKUP_CHECKBOX_SELECTOR.length;i++){

		// チェックボックス周りにチェックボックスの当たり判定を追加する。
		BACKUP_CHECKBOX_SELECTOR[i].addEventListener('click', event => {
			const CHECKBOX = event.target.firstElementChild;

			if(CHECKBOX != null){
				CHECKBOX.checked ? CHECKBOX.checked = false : CHECKBOX.checked = true;
				VISIBILITY_TRASH_BUTTON();
			}
		});

		// チェック入りボックスの数を確認しゴミ箱アイコンを表示。
		BACKUP_CHECKBOX_SELECTOR[i].firstElementChild.addEventListener('change', event => {
			const CHECKBOX = event.target;
			VISIBILITY_TRASH_BUTTON();
		});

	}

	// ゴミ箱のバックアップデータ削除イベント。
	const TRASH_BUTTON = document.getElementsByClassName("fa-trash-alt")[0];
	TRASH_BUTTON.addEventListener('click' , event => {
		const ALL_CHECKEDBOX_SELECTOR = document.querySelectorAll(".backup-checkbox input:checked");
		const COMFIRM = confirm(`選択されている ${ALL_CHECKEDBOX_SELECTOR.length}件 のバックアップを削除します。\nよろしければ OK を選択してください。`);

		if(COMFIRM){
			DELETE_BACKUP_DATA( ALL_CHECKEDBOX_SELECTOR[0] );
		}

	});


	// すべての項目にチェックマークを付ける。
	const CHECK_BUTTON = document.getElementsByClassName("fa-check-square")[0];
	CHECK_BUTTON.addEventListener('click' , event => {
		const ALL_CHECKBOX_SELECTOR = document.querySelectorAll(".backup-checkbox");
		const ALL_CHECKEDBOX_SELECTOR = document.querySelectorAll(".backup-checkbox input:checked");

		if( (ALL_CHECKBOX_SELECTOR.length -1) != ALL_CHECKEDBOX_SELECTOR.length){
			for(let i=1; i<ALL_CHECKBOX_SELECTOR.length; i++){
				ALL_CHECKBOX_SELECTOR[i].firstElementChild.checked = true;
			}
		}else{
			for(let i=1; i<ALL_CHECKBOX_SELECTOR.length; i++){
				ALL_CHECKBOX_SELECTOR[i].firstElementChild.checked = false;
			}
		}
		VISIBILITY_TRASH_BUTTON();
	});

}


/**
 * チェックボックスが一つ以上入っていればゴミ箱アイコンを表示する。
 * @type {DOM} - ゴミ箱アイコンの要素
 */

const VISIBILITY_TRASH_BUTTON = () => {
	const ALL_CHECKEDBOX_SELECTOR = document.querySelectorAll(".backup-checkbox input:checked");

	if(ALL_CHECKEDBOX_SELECTOR.length >= 1){
		document.getElementsByClassName("fa-trash-alt")[0].style.visibility = 'visible';
	}else{
		document.getElementsByClassName("fa-trash-alt")[0].style.visibility = 'hidden';
	}
}

/**
 * チェックボックスが一つ以上入っているバックアップデータを削除する。
 */

const DELETE_BACKUP_DATA = deleteRow => {

	const transaction = db.transaction(["TypingTubeBackUpStore"], "readwrite");
	const store = transaction.objectStore("TypingTubeBackUpStore");
	const request = store.delete(deleteRow.name); // 選択されているバックアップデータを削除。


	// バックアップデータの全取得が完了
	request.onsuccess = function (event) {
		deleteRow.closest('tr').remove()
		const ALL_CHECKEDBOX_SELECTOR = document.querySelectorAll(".backup-checkbox input:checked");
		if(ALL_CHECKEDBOX_SELECTOR.length){
			DELETE_BACKUP_DATA( ALL_CHECKEDBOX_SELECTOR[0] )
		}else{
			document.getElementsByClassName("fa-trash-alt")[0].style.visibility = 'hidden';
		}
	}
}
document.querySelector(`[action="/movie/from_youtube"]`).insertAdjacentHTML('afterend',
	`<style>
       td [type="checkbox"] {
         position: relative;
         top: 1.5px;
       }
       .backup-checkbox {
         border-right: 1px solid rgba(255,255,255,.125);
       }
       .backup-link {
         cursor:pointer;
       }
       .fa-trash-alt, .fa-check-square {
         padding: 0 10px 6px 6px;
         font-size: 1.2rem;
         cursor:pointer;
       }
     </style>`);
