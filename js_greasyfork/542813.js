// ==UserScript==
// @name         ClinicalTrialsGovCheckHelper
// @namespace    https://github.com/fCznoUrJ1cvINs4/
// @version      0.1
// @description  ClinicalTrials.govで臨床試験情報の更新をチェックを手助けします
// @author       fCznoUrJ1cvINs4
// @match        https://clinicaltrials.gov/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=clinicaltrials.gov
// @license      MIT
// @grant        GM_addElement
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/keymaster/1.6.1/keymaster.min.js
// @downloadURL https://update.greasyfork.org/scripts/542813/ClinicalTrialsGovCheckHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/542813/ClinicalTrialsGovCheckHelper.meta.js
// ==/UserScript==

/*jshint esversion: 11 */
(($, undefined) => {
	$(() => {
		console.log("ClinicalTrialsGovCheckHelper Initializing...");
		const localStorageKey = "ClinicalTrialsGovCheckHelper-LocalStorageKey"; // loaclStorage Key

		// ダイアログ
		const dialog = GM_addElement(document.body, "dialog", {
			id: "ClinicalTrialsGovCheckHelper-Dialog",
			style: "height:70vh;width:95vw;",
		});

		// コンテナ
		const container = GM_addElement(dialog, "div", {
			style: "height:100%;display:grid;grid-template-columns:auto 1fr;grid-template-rows:1fr auto auto;",
		});

		// テキスト入力欄(ダイアログ左側 1行目)
		GM_addElement(container, "textarea", {
			id: "ClinicalTrialsGovCheckHelper-NctId",
			style: "grid-row:0;grid-column:1;",
			textContent: localStorage.getItem(localStorageKey) ?? "",
		});
		// 一覧作成ボタン(ダイアログ左側 2行目)
		GM_addElement(container, "button", {
			id: "ClinicalTrialsGovCheckHelper-CreateGridButton",
			class: "usa-button usa-button--outline",
			style: "grid-row:2;grid-column:1;margin:.2rem 0;",
			textContent: "一覧作成",
		});
		// 閉じるボタン(ダイアログ左側 3行目)
		GM_addElement(container, "button", {
			id: "ClinicalTrialsGovCheckHelper-CloseDialog",
			class: "usa-button usa-button--outline",
			style: "grid-row:3;grid-column:1;margin:.2rem 0;",
			textContent: "閉じる",
		});

		// 結果Tableコンテナ (ダイアログ右側)
		const resultContainer = GM_addElement(container, "div", {
			id: "ClinicalTrialsGovCheckHelper-ResultContainer",
			style: "grid-column:2;grid-row:1/4;margin:0 .5rem;overflow:auto;",
		});

		// 結果Table
		const table = GM_addElement(resultContainer, "table", {
			id: "ClinicalTrialsGovCheckHelper-Table",
			style: "border-collapse: separate;text-indent: initial;border-spacing:2px;min-width: 100%;",
		});
		const tableHeader = GM_addElement(table, "tr");
		GM_addElement(tableHeader, "th", { style: "border: 1px solid black;text-align:center;", textContent: "LastUpdate" });
		GM_addElement(tableHeader, "th", { style: "border: 1px solid black;text-align:center;", textContent: "NctID" });
		GM_addElement(tableHeader, "th", { style: "border: 1px solid black;text-align:center;", textContent: "Note" });
		GM_addElement(tableHeader, "th", { style: "border: 1px solid black;text-align:center;", textContent: "Title" });
		GM_addElement(tableHeader, "th", { style: "border: 1px solid black;text-align:center;", textContent: "Phases" });
		GM_addElement(tableHeader, "th", { style: "border: 1px solid black;text-align:center;", textContent: "Status" });
		GM_addElement(tableHeader, "th", { style: "border: 1px solid black;text-align:center;", textContent: "FirstSubmitData" });
		GM_addElement(tableHeader, "th", { style: "border: 1px solid black;text-align:center;", textContent: "StartDate" });
		GM_addElement(tableHeader, "th", { style: "border: 1px solid black;text-align:center;", textContent: "PrimaryCompletionDate" });
		GM_addElement(tableHeader, "th", { style: "border: 1px solid black;text-align:center;", textContent: "CompletionDate" });
		GM_addElement(tableHeader, "th", { style: "border: 1px solid black;text-align:center;", textContent: "ResultsFirstSubmitDate" });

		//
		// 一覧作成ダイアログを開く (+本体のスクロールを無効化)
		const OpenClinicalTrialsGovCheckHelperDialog = () => {
			$("#ClinicalTrialsGovCheckHelper-Dialog").get(0).showModal();
			document.documentElement.style.overflow = "hidden";
		};

		//
		// 一覧作成ダイアログを閉じる (+本体のスクロールを有効化)
		const CloseClinicalTrialsGovCheckHelperDialog = () => $("#ClinicalTrialsGovCheckHelper-Dialog").get(0).close();
		$("#ClinicalTrialsGovCheckHelper-Dialog").on("close", () => (document.documentElement.style.overflow = "auto"));

		// データを取得する
		function GetTrialData(NctId, Note) {
			return new Promise((resolve, reject) => {
				$.ajax({
					type: "GET",
					url: `https://clinicaltrials.gov/api/v2/studies/${NctId}`,
					data: { markupFormat: "legacy" },
					dataType: "json",
				})
					.done((data, status, jqXHR) => {
						console.log(`ajax done ${status}`);
						if (data) {
							data.note = Note;
							resolve(data);
						}
						reject();
					})
					.fail((jqXHR, textStatus, errorThrown) => {
						console.log(`ajax fail ${textStatus}`);
						reject(`ajax fail ${textStatus}`);
					});
			});
		}

		// 一覧作成ボタン
		$("#ClinicalTrialsGovCheckHelper-CreateGridButton").on("click", () => {
			const NctIdList = $("#ClinicalTrialsGovCheckHelper-NctId").val();
			localStorage.setItem(localStorageKey, NctIdList); // ローカルストレージに保存

			$("#ClinicalTrialsGovCheckHelper-Table tr:gt(0)").remove(); // データリセット

			const TaskList = [];
			NctIdList.split("\n")
				.filter((v) => v.trim() != "")
				.forEach((v) => {
					const nctId = v.trim().split("/")[0];
					const note = v.trim().split("/")[1] ?? "";
					TaskList.push(
						new Promise((resolve, reject) => {
							$.ajax({
								type: "GET",
								url: `https://clinicaltrials.gov/api/v2/studies/${nctId}`,
								data: { markupFormat: "legacy" },
								dataType: "json",
							})
								.done((data, status, jqXHR) => {
									console.log(`ajax done ${status}`);
									if (data) {
										data.note = note;
										resolve(data);
									}
									reject();
								})
								.fail((jqXHR, textStatus, errorThrown) => {
									console.log(`ajax fail ${textStatus}`);
									reject(`ajax fail ${textStatus}`);
								});
						})
					);
				});
			Promise.all(TaskList).then((DataList) => {
				DataList.sort((d1, d2) => (d1.protocolSection.statusModule.lastUpdateSubmitDate < d2.protocolSection.statusModule.lastUpdateSubmitDate ? 1 : -1)).forEach((data) => {
					if (data) {
						const tableRow = GM_addElement(table, "tr");
						const p = data.protocolSection;
						const d = p.designModule;
						const i = p.identificationModule;
						const s = p.statusModule;
						GM_addElement(tableRow, "td", { style: "border: 1px solid black;text-align:center;white-space: pre;padding: .3rem 1rem;", textContent: s.lastUpdateSubmitDate ?? "" });
						GM_addElement(GM_addElement(tableRow, "td", { style: "border: 1px solid black;text-align:center;white-space: pre;padding: .3rem 1rem;" }), "a", { href: `/study/${i.nctId ?? ""}`, textContent: i.nctId ?? "" });
						GM_addElement(tableRow, "td", { style: "border: 1px solid black;text-align:center;white-space: pre;padding: .3rem 1rem;", textContent: data.note ?? "" });
						GM_addElement(tableRow, "td", { style: "border: 1px solid black;text-align:left;white-space: pre;padding: .3rem 1rem;", textContent: i.briefTitle ?? "" });
						GM_addElement(tableRow, "td", { style: "border: 1px solid black;text-align:center;white-space: pre;padding: .3rem 1rem;", textContent: d.phases.join("/") ?? "" });
						GM_addElement(tableRow, "td", { style: "border: 1px solid black;text-align:center;white-space: pre;padding: .3rem 1rem;", textContent: s.overallStatus ?? "" });
						GM_addElement(tableRow, "td", { style: "border: 1px solid black;text-align:center;white-space: pre;padding: .3rem 1rem;", textContent: s.studyFirstSubmitDate ?? "" });
						GM_addElement(tableRow, "td", { style: "border: 1px solid black;text-align:center;white-space: pre;padding: .3rem 1rem;", textContent: `${s.startDateStruct.date ?? ""}\n(${s.startDateStruct.type ?? "-"})` });
						GM_addElement(tableRow, "td", {
							style: "border: 1px solid black;text-align:center;white-space: pre;padding: .3rem 1rem;",
							textContent: `${s.primaryCompletionDateStruct.date ?? ""}\n(${s.primaryCompletionDateStruct.type ?? "-"})`,
						});
						GM_addElement(tableRow, "td", {
							style: "border: 1px solid black;text-align:center;white-space: pre;padding: .3rem 1rem;",
							textContent: `${s.completionDateStruct.date ?? ""}\n(${s.completionDateStruct.type ?? "-"})`,
						});
						GM_addElement(tableRow, "td", { style: "border: 1px solid black;text-align:center;white-space: pre;padding: .3rem 1rem;", textContent: s.resultsFirstSubmitDate ?? "" });
					}
				});
			});
		});

		// 閉じるボタン
		$("#ClinicalTrialsGovCheckHelper-CloseDialog").on("click", () => {
			CloseClinicalTrialsGovCheckHelperDialog();
			return false;
		});

		// ダイアログ表示 1 GMメニュー
		GM_registerMenuCommand("一覧作成ダイアログを開く", () => OpenClinicalTrialsGovCheckHelperDialog());

		// ダイアログ表示 2 Ctrl + Enter
		key("ctrl+enter", () => OpenClinicalTrialsGovCheckHelperDialog());

		// ダイアログ表示 3 Ctrl + ホームバナー(リンク先が"/"の"a"要素)をクリック
		$(document).on("click", 'a[href="/"]', (evt) => {
			if (evt.ctrlKey) {
				OpenClinicalTrialsGovCheckHelperDialog();
				return false;
			}
		});

		// ダイアログ表示 ホームバナー(リンク先が"/"の"a"要素)を右クリック
		$(document).on("contextmenu", 'a[href="/"]', (evt) => {
			OpenClinicalTrialsGovCheckHelperDialog();
			return false;
		});

		console.log("ClinicalTrialsGovCheckHelper Ready");
	});
})(window.jQuery.noConflict(true));
