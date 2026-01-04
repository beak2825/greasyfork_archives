// ==UserScript==
// @name        楽曲利用 入力等補助
// @description JASRAC、NexToneの検索結果へ自動で飛ぶ / JASRACの楽曲情報ページへ直リンク / JASRACの検索ページへ、NexToneで検索を行うボタンを設置 / JASRAC、NexToneの検索結果から楽曲情報をコピー / ニコニコ生放送の楽曲使用欄、VirtualCastの楽曲利用申請フォームへTSVで一括入力
// @namespace   https://greasyfork.org/users/137
// @version     0.7.0
// @match       https://www2.jasrac.or.jp/eJwid/main?trxID=F00100*
// @match       https://www2.jasrac.or.jp/eJwid/main?trxID=A00401-3*
// @match       https://www2.jasrac.or.jp/eJwid/main?trxID=F20101&WORKS_CD=*
// @match       https://search.nex-tone.co.jp/terms?*&title=*
// @match       https://search.nex-tone.co.jp/terms?*&code=*
// @match       https://search.nex-tone.co.jp/list?*
// @match       https://live.nicovideo.jp/create
// @match       https://live.nicovideo.jp/create?*
// @match       https://live.nicovideo.jp/edit/*
// @match       https://virtualcast.jp/contact
// @match       https://virtualcast.jp/contact/?*
// @match       https://virtualcast.jp/contact?*
// @match       https://virtualcast.jp/*/contact/*
// @require     https://cdn.jsdelivr.net/npm/papaparse@5.5.3/papaparse.js
// @license     MPL-2.0
// @contributionURL https://github.com/sponsors/esperecyan
// @compatible  Edge Firefoxを推奨 / Firefox is recommended
// @compatible  Firefox
// @compatible  Opera Firefoxを推奨 / Firefox is recommended
// @compatible  Chrome Firefoxを推奨 / Firefox is recommended
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM.deleteValue
// @grant       GM.registerMenuCommand
// @author      100の人 (エスパー・イーシア)
// @homepageURL https://greasyfork.org/scripts/461369
// @downloadURL https://update.greasyfork.org/scripts/461369/%E6%A5%BD%E6%9B%B2%E5%88%A9%E7%94%A8%20%E5%85%A5%E5%8A%9B%E7%AD%89%E8%A3%9C%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/461369/%E6%A5%BD%E6%9B%B2%E5%88%A9%E7%94%A8%20%E5%85%A5%E5%8A%9B%E7%AD%89%E8%A3%9C%E5%8A%A9.meta.js
// ==/UserScript==

/*global Papa */

'use strict';

async function fetchNonUTF8Document(url)
{
	const response = await fetch(url, { credentials: 'same-origin' });
	return new DOMParser().parseFromString(
		new TextDecoder(/charset=([^;]+)/.exec(response.headers.get('content-type'))[1].trim())
			.decode(await response.arrayBuffer()),
		'text/html',
	);
}

(async function main() {

switch (location.host) {
	case 'www2.jasrac.or.jp':
	case 'search.nex-tone.co.jp': {
		// 検索結果へ自動で飛ぶ・JASRAC、NexToneの楽曲情報ページへ直リンク

		const searchParams = new URL(location).searchParams;
		let title = searchParams.get('title');
		if (location.href.startsWith('https://search.nex-tone.co.jp/terms')) {
			if (title) {
				await GM.setValue('nextone-title', title);
			} else {
				const code = searchParams.get('code');
				if (code) {
					await GM.setValue('nextone-code', code);
				}
			}
			document.getElementsByName('accept')[0].click();
			return;
		}
		if (!title && location.host === 'search.nex-tone.co.jp') {
			title = await GM.getValue('nextone-title');
			await GM.deleteValue('nextone-title');
		}
		if (title) {
			let name;
			switch (location.host) {
				case 'www2.jasrac.or.jp':
					name = 'IN_WORKS_TITLE_NAME1';
					break;
				case 'search.nex-tone.co.jp':
					name = 'detail-condition-container:conditionTitle1';
					break;
			}
			/** @type {HTMLInputElement} */
			const input = document.getElementsByName(name)[0];
			input.value = title;
			if (location.host === 'search.nex-tone.co.jp') {
				document.getElementsByName('search')[0].click();
				return;
			}
			input.form.submit();
			return;
		}

		if (location.href.startsWith('https://www2.jasrac.or.jp/eJwid/main?trxID=F20101&WORKS_CD=')) {
			// JASRACの楽曲情報ページ
			if (document.getElementsByClassName('emergency')[0]?.textContent
				!== 'システムエラーが発生しました。（エラー番号021）') {
				return;
			}

			await fetch(
				'https://www2.jasrac.or.jp/eJwid/main?trxID=F00100',
				{ method: 'POST', credentials: 'same-origin' },
			);
			document.documentElement.replaceWith((await fetchNonUTF8Document(location)).documentElement);
			return;
		}

		if (location.host === 'search.nex-tone.co.jp') {
			const input = document.getElementsByName('detail-condition-container:conditionPieceCd')[0];
			if (input.value) {
				// 検索フォームのコード欄への入力が行われていれば
				const detail = document.querySelector('[href$="-detailLink"]');
				if (detail) {
					location.replace(detail);
				}
			} else {
				const code = await GM.getValue('nextone-code');
				if (code) {
					// 楽曲情報への直リンク処理の途中なら
					await GM.deleteValue('nextone-code');
					document.getElementsByName('detail-condition-container:conditionPieceCd')[0].value = code;
					document.getElementsByName('search')[0].click();
					return;
				}
			}
		}

		// JASRACの検索ページへ、NexToneで検索を行うボタンを設置

		if (location.host === 'www2.jasrac.or.jp') {
			document.head.insertAdjacentHTML('beforeend', `<style>
				.btn.search[name="search-on-nextone"] {
					background-color: #F08300;
					border-color: #FFC000;
					border-radius: 60px;
				}
			</style>`);

			/** @type {HTMLButtonElement} */
			const searchButton = document.getElementsByName('CMD_SEARCH')[0];
			const nextoneSearchButton = searchButton.cloneNode(true);
			nextoneSearchButton.type = 'button';
			nextoneSearchButton.name = 'search-on-nextone';
			nextoneSearchButton.textContent = 'NexToneで検索';
			searchButton.after(nextoneSearchButton);
			nextoneSearchButton.addEventListener('click', function () {
				location.assign('https://search.nex-tone.co.jp/terms?'
					+ new URLSearchParams({ title: document.getElementsByName('IN_WORKS_TITLE_NAME1')[0].value }));
			});
		}

		// 情報のコピー

		const codeCells = document.querySelectorAll('[data-role="result-code"], .piece-table-col-piece-cd');
		if (codeCells.length === 0) {
			return;
		}

		for (const cell of codeCells) {
			cell.insertAdjacentHTML('afterbegin', '<button name="copy-song-data-as-tsv">コピー</button>');
		}
		codeCells[0].closest('tbody').addEventListener('click', async function (event) {
			if (event.target.name !== 'copy-song-data-as-tsv') {
				return;
			}

			/** @type {HTMLTableRowElement} */
			const row = event.target.closest('tr');

			const data = [ ];
			switch (location.host) {
				case 'www2.jasrac.or.jp': {
					if ((await fetchNonUTF8Document(row.querySelector('[href*="main?trxID=F20101&WORKS_CD="]').href))
						.querySelector('#tab-00-07 .consent .txt p').textContent
								!== 'この利用分野は、JASRACが著作権を管理しています。') {
						alert('JASRACはこの楽曲の「配信分野」の著作権を管理していません。');
					}
					data.push([
						row.querySelector('[data-role="result-code"] span').textContent,
						row.querySelector('[data-role="result-title"] span').textContent,
						row.querySelector('[data-role="result-author"] span').textContent,
						row.querySelector('[data-role="result-artist"] span').textContent,
					]);
					break;
				}
				case 'search.nex-tone.co.jp': {
					const cells = row.children;
					if (!cells[9].getElementsByClassName('subright-manage')[0]) {
						alert('NexToneはこの楽曲の「配信分野」の著作権を管理していません。');
					}
					data.push([
						cells[0].getElementsByClassName('result-piece-cd-value')[0].textContent,
						cells[1].getElementsByClassName('result-value')[0].textContent,
						cells[2].getElementsByClassName('result-value')[0].textContent,
						cells[3].getElementsByClassName('result-value')[0].textContent,
					]);
					break;
				}
			}

			navigator.clipboard.writeText(Papa.unparse(data, { delimiter: '\t' }));
		});
		break;
	}
	case 'live.nicovideo.jp':
	case 'virtualcast.jp': {
		/** @type {HTMLDialogElement} */
		let dialog;
		GM.registerMenuCommand('楽曲利用 一括入力', function () {
			if (!dialog) {
				document.body.insertAdjacentHTML('beforeend', `<dialog>
					<form method="dialog">
						<p><label>
							ここに楽曲入力用TSVを貼り付け
							<textarea name="bgm-data-table" placeholder="162-5346-9	恋はきっと急上昇☆	のぼる↑	のぼる↑
N01001250	HappyCoaster	emon（Tes.）&#x0009;
"></textarea>
						</label>
						<button value="cancel" formnovalidate="">キャンセル</button> <button value="ok">OK</button>
					</form>
				</dialog>`);
				dialog = document.body.lastElementChild;

				/** @type {string[][]} */
				let bgmData;
				dialog.getElementsByTagName('form')[0]['bgm-data-table'].addEventListener('input', function (event) {
					if (event.target.name !== 'bgm-data-table' || event.target.value === '') {
						return;
					}

					/** @type {HTMLTextAreaElement} */
					const bgmDataTable = event.target;

					const { data, errors } = Papa.parse(
						bgmDataTable.value,
						{ transform: value => value.trim() },
					);
					if (errors.length > 0) {
						bgmDataTable.setCustomValidity('エラーが発生しました:\n'
							+ errors.map(error => `${error.type} / ${error.code} / ${error.message}`
								+ (error.row ? ` (${error.row}行目)`: '')));
						return;
					}

					bgmDataTable.setCustomValidity('');
					bgmData = data;
				});


				dialog.addEventListener('close', async function (event) {
					if (event.target.returnValue !== 'ok') {
						return;
					}

					const HEADER = [ 'code', 'title', 'composer', 'artist', 'lyricist' ];
					/** @type {Object.<string, string>[]} */
					const songs = bgmData.map(fields => {
						const song = { };
						for (let i = 0; i < fields.length; i++) {
							song[HEADER[i]] = fields[i];
						}
						return song;
					});

					switch (location.host) {
						case 'live.nicovideo.jp': {
							const form = document.getElementsByClassName('ga-ns-register-form')[0];
							const addingInputsButton = form.getElementsByTagName('button')[0];

							const list = form.getElementsByTagName('ul')[0];
							const listItems = list.children;
							for (let i = 0; i < songs.length; i++) {
								if (!listItems[i]) {
									addingInputsButton.click();
									await new Promise(function (resolve) {
										new MutationObserver(function (mutations, observer) {
											observer.disconnect();
											resolve();
										}).observe(list, { childList: true });
									});
								}

								for (const name in songs[i]) {
									const input = listItems[i].querySelector(`[class*=${CSS.escape(name)}]`);
									if (!input) {
										continue;
									}
									input.value = songs[i][name];
									input.dispatchEvent(new Event('input', { bubbles: true }));
								}
							}
							break;
						}
						case 'virtualcast.jp': {
							const dl = document.getElementsByClassName('active')[0];
							const addingInputsButton = dl.querySelector('.bgm-buttons > input:nth-of-type(2)');

							for (let i = 0; i < songs.length; i++) {
								if (!dl.querySelector(`[name=${CSS.escape('title' + i)}]`)) {
									addingInputsButton.click();
									await new Promise(function (resolve) {
										new MutationObserver(function (mutations, observer) {
											observer.disconnect();
											resolve();
										}).observe(dl, { childList: true });
									});
								}

								for (let name in songs[i]) {
									let value = songs[i][name];

									if (name === 'code') {
										if (value.startsWith('N')) {
											name = 'nexTone';
										} else {
											name = 'jasrac';
											value = value.replaceAll('-', '');
										}
									}

									const input = dl.querySelector(`[name=${CSS.escape(name + i)}]`);
									input.value = value;
									input.dispatchEvent(new Event('input'));
								}
							}
							break;
						}
					}
				});
			}

			dialog.showModal();
		});




		document.head.insertAdjacentHTML('beforeend', `<style>
			[name="bgm-data-table"] {
				width: 100%;
			}

			[name="bgm-data-table"]:invalid {
				outline: solid crimson;
			}
		</style>`);
		break;
	}
}

})();
