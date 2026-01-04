// ==UserScript==
// @name         iGate - Đồng bộ hồ sơ
// @namespace    https://motcua.tphcm.gov.vn
// @version      2025-08-20.1
// @description  Đồng bộ hồ sơ iGate
// @author       KhoaLam
// @match        https://ssodvcmc.hochiminhcity.gov.vn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.vn
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/544815/iGate%20-%20%C4%90%E1%BB%93ng%20b%E1%BB%99%20h%E1%BB%93%20s%C6%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/544815/iGate%20-%20%C4%90%E1%BB%93ng%20b%E1%BB%99%20h%E1%BB%93%20s%C6%A1.meta.js
// ==/UserScript==

const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1377909862356353094/vLMXjlL2sgWBl1XxvYjHcHkS1AubxrcY-_VonFB_W2vAPtaoFDs0HuLghHirC-E0y4uW";
const DEV_ID = "179420922812432384";
const API_URL = "https://apigatewaydvcmc.hochiminhcity.gov.vn";
const GSHEET_WEB_APP = "https://script.google.com/macros/s/AKfycbzQ1SYb-UBZd2OZ2kQ69hODQFLjoZOkNa-y5QmtiYfar6mLgkrNWBcYKcZzw3rE3l6Oqw/exec";
const GSHEET_FORM = "https://script.google.com/macros/s/AKfycbzQ1SYb-UBZd2OZ2kQ69hODQFLjoZOkNa-y5QmtiYfar6mLgkrNWBcYKcZzw3rE3l6Oqw/exec";
// const HEADERS = {
// 	"content-type": "application/json",
// 	"authorization": "bearer " + localStorage.getItem("userToken").toString()
// };



let wait = ms => new Promise(resolve => setTimeout(resolve, ms));

function log(msg) {
	// add timestamp to message, format "[HH:MM:SS] msg"
	var now = new Date();
	var timestamp = "[" + now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0') + ":" + now.getSeconds().toString().padStart(2, '0') + "] ";
	logStep.innerText = timestamp + msg;
}

let logBox, logBoxVisible = true, txtOutput, txtInput, logStep, logStep2, acceptDeleteCheckbox, fetchDetailLabel;
let printButton, toggleButton, mapProcessButton, mapAgencyButton, mapFeeButton, getAccountButton, syncDossierButton, testButton, runOnceButton;
let stateSyncing = false;

function initPopup() {
	logBox = document.createElement('div');
	logBox.id = 'logBox';
	logBox.style.position = 'fixed';
	logBox.style.top = '10px';
	logBox.style.left = '10px';
	logBox.style.width = '520px';
	logBox.style.background = 'rgba(0,0,0,0.85)';
	logBox.style.padding = '10px';
	logBox.style.zIndex = 9999;
	logBox.style.borderRadius = '8px';
	logBox.style.color = '#fff';
	logBox.style.fontFamily = 'monospace';
	logBox.style.transition = "left 0.3s ease";
	logBox.innerHTML = '<b>Log</b><br>';

	toggleButton = document.createElement("button");
	toggleButton.textContent = "✖";
	toggleButton.style.position = "absolute";
	toggleButton.style.top = "4px";
	toggleButton.style.right = "4px";
	toggleButton.style.width = "24px";
	toggleButton.style.height = "24px";
	toggleButton.style.border = "none";
	toggleButton.style.borderRadius = "4px";
	toggleButton.style.background = "#444";
	toggleButton.style.color = "#fff";
	toggleButton.style.fontSize = "12px";
	toggleButton.style.cursor = "pointer";
	toggleButton.title = "Toggle Log Panel";

	toggleButton.addEventListener("click", () => {
		logBoxVisible = !logBoxVisible;
		if (logBoxVisible) {
			logBox.style.left = "10px";
			toggleButton.textContent = "✖";
		} else {
			const hiddenLeft = "-" + (logBox.offsetWidth - 30) + "px";
			logBox.style.left = hiddenLeft;
			toggleButton.textContent = "▶";
		}
	});

	txtOutput = document.createElement('textarea');
	txtOutput.id = 'logArea';
	txtOutput.style.width = '500px';
	txtOutput.style.height = '160px';
	txtOutput.style.resize = 'none';
	txtOutput.style.border = 'none';
	txtOutput.style.padding = '8px';
	txtOutput.style.borderRadius = '6px';
	txtOutput.style.boxSizing = 'border-box';
	txtOutput.style.fontSize = '12px';
	txtOutput.style.fontFamily = 'monospace';
	txtOutput.style.marginTop = "8px";
	txtOutput.style.color = "#000";

	logStep = document.createElement('p');
	logStep.id = 'logStep';
	logStep.style.color = '#fff';
	logStep.style.fontFamily = 'monospace';
	logStep.style.fontSize = '12px';
	logStep.style.margin = '0';
	logStep.style.padding = '0';

	logStep2 = document.createElement('p');
	logStep2.id = 'logStep2';
	logStep2.style.color = '#999';
	logStep2.style.fontFamily = 'monospace';
	logStep2.style.fontSize = '12px';
	logStep2.style.margin = '0';
	logStep2.style.padding = '0';

	printButton = document.createElement("button");
	printButton.textContent = "Print";
	printButton.style.marginTop = "8px";
	printButton.style.padding = "6px 12px";
	printButton.style.border = "none";
	printButton.style.borderRadius = "4px";
	printButton.style.background = "#1e90ff";
	printButton.style.color = "#fff";
	printButton.style.cursor = "pointer";
	printButton.style.fontFamily = "monospace";
	printButton.style.fontSize = "12px";

	mapAgencyButton = document.createElement("button");
	mapAgencyButton.textContent = "Map Agency";
	mapAgencyButton.style.display = "inline-block";
	mapAgencyButton.style.marginTop = "8px";
	mapAgencyButton.style.padding = "6px 12px";
	mapAgencyButton.style.border = "none";
	mapAgencyButton.style.borderRadius = "4px";
	mapAgencyButton.style.background = "#1e90ff";
	mapAgencyButton.style.color = "#fff";
	mapAgencyButton.style.cursor = "pointer";
	mapAgencyButton.style.fontFamily = "monospace";
	mapAgencyButton.style.fontSize = "12px";

	mapProcessButton = document.createElement("button");
	mapProcessButton.textContent = "Map Process";
	mapProcessButton.style.display = "inline-block";
	mapProcessButton.style.marginTop = "8px";
	mapProcessButton.style.marginLeft = "8px";
	mapProcessButton.style.padding = "6px 12px";
	mapProcessButton.style.border = "none";
	mapProcessButton.style.borderRadius = "4px";
	mapProcessButton.style.background = "#1e90ff";
	mapProcessButton.style.color = "#fff";
	mapProcessButton.style.cursor = "pointer";
	mapProcessButton.style.fontFamily = "monospace";
	mapProcessButton.style.fontSize = "12px";

	mapFeeButton = document.createElement("button");
	mapFeeButton.textContent = "Map Fee";
	mapFeeButton.style.display = "inline-block";
	mapFeeButton.style.marginTop = "8px";
	mapFeeButton.style.marginLeft = "8px";
	mapFeeButton.style.padding = "6px 12px";
	mapFeeButton.style.border = "none";
	mapFeeButton.style.borderRadius = "4px";
	mapFeeButton.style.background = "#1e9000";
	mapFeeButton.style.color = "#fff";
	mapFeeButton.style.cursor = "pointer";
	mapFeeButton.style.fontFamily = "monospace";
	mapFeeButton.style.fontSize = "12px";

	txtInput = document.createElement("textarea");
	txtInput.id = "txtInput";
	txtInput.placeholder = "Enter procedure code...";
	txtInput.style.width = '500px';
	txtInput.style.height = '160px';
	txtInput.style.resize = 'none';
	txtInput.style.border = 'none';
	txtInput.style.padding = '8px';
	txtInput.style.borderRadius = '6px';
	txtInput.style.boxSizing = 'border-box';
	txtInput.style.fontSize = '12px';
	txtInput.style.fontFamily = 'monospace';
	txtInput.style.marginTop = "8px";
	txtInput.style.color = "#000";

	runOnceButton = document.createElement("button");
	runOnceButton.textContent = "Run Once";
	runOnceButton.style.display = "block";
	runOnceButton.style.marginTop = "8px";
	runOnceButton.style.padding = "6px 12px";
	runOnceButton.style.border = "none";
	runOnceButton.style.borderRadius = "4px";
	runOnceButton.style.background = "#1e90ff";
	runOnceButton.style.color = "#fff";
	runOnceButton.style.cursor = "pointer";
	runOnceButton.style.fontFamily = "monospace";
	runOnceButton.style.fontSize = "12px";

	getAccountButton = document.createElement("button");
	getAccountButton.textContent = "Get Dossier";
	getAccountButton.style.display = "inline-block";
	getAccountButton.style.marginTop = "8px";
	getAccountButton.style.marginLeft = "8px";
	getAccountButton.style.padding = "6px 12px";
	getAccountButton.style.border = "none";
	getAccountButton.style.borderRadius = "4px";
	getAccountButton.style.background = "#ff8c00";
	getAccountButton.style.color = "#fff";
	getAccountButton.style.cursor = "pointer";
	getAccountButton.style.fontFamily = "monospace";
	getAccountButton.style.fontSize = "12px";

	syncDossierButton = document.createElement("button");
	syncDossierButton.textContent = "Sync Dossier";
	syncDossierButton.style.display = "inline-block";
	syncDossierButton.style.marginTop = "8px";
	syncDossierButton.style.padding = "6px 12px";
	syncDossierButton.style.border = "none";
	syncDossierButton.style.borderRadius = "4px";
	syncDossierButton.style.background = "#32cd32";
	syncDossierButton.style.color = "#fff";
	syncDossierButton.style.cursor = "pointer";
	syncDossierButton.style.fontFamily = "monospace";
	syncDossierButton.style.fontSize = "12px";

	testButton = document.createElement("button");
	testButton.textContent = "Test";
	testButton.style.display = "inline-block";
	testButton.style.marginTop = "8px";
	testButton.style.marginLeft = "8px";
	testButton.style.padding = "6px 12px";
	testButton.style.border = "none";
	testButton.style.borderRadius = "4px";
	testButton.style.background = "#8a2be2";
	testButton.style.color = "#fff";
	testButton.style.cursor = "pointer";
	testButton.style.fontFamily = "monospace";
	testButton.style.fontSize = "12px";

	acceptDeleteCheckbox = document.createElement("input");
	acceptDeleteCheckbox.type = "checkbox";
	acceptDeleteCheckbox.id = "acceptDeleteCheckbox";
	acceptDeleteCheckbox.checked = false;
	let acceptDeleteLabel = document.createElement("label");
	acceptDeleteLabel.htmlFor = "acceptDeleteCheckbox";
	acceptDeleteLabel.textContent = "Delete";
	acceptDeleteLabel.style.marginLeft = "4px";
	acceptDeleteLabel.style.color = "#fff";
	acceptDeleteLabel.style.fontFamily = "monospace";
	acceptDeleteLabel.style.fontSize = "12px";
	acceptDeleteLabel.style.display = "inline-block";
	acceptDeleteLabel.style.verticalAlign = "middle";
	acceptDeleteCheckbox.style.display = "inline-block";
	acceptDeleteCheckbox.style.verticalAlign = "middle";
	acceptDeleteCheckbox.style.marginLeft = "8px";


	txtInput.value = localStorage.getItem('extTextareaInput') || '';
	txtOutput.value = localStorage.getItem('extTextareaOutput') || '';

	bindTextareaToLocalStorage(txtInput, 'extTextareaInput');
	bindTextareaToLocalStorage(txtOutput, 'extTextareaOutput');

	logBox.appendChild(logStep);
	logBox.appendChild(logStep2);

	// logBox.appendChild(testButton);
	logBox.appendChild(syncDossierButton);
	// logBox.appendChild(getAccountButton);
	// logBox.appendChild(acceptDeleteCheckbox);
	// logBox.appendChild(acceptDeleteLabel);

	logBox.appendChild(txtInput);

	logBox.appendChild(txtOutput);

	logBox.appendChild(toggleButton);

	document.body.appendChild(logBox);
}

class Dossier {
	constructor(json) {
		Object.assign(this, json);
	}
	async syncDossier() {
		const url = API_URL + '/bdtc/nps-dossier/--test-sync';
		let success = true;
		// Post updated = false
		const postData = {
			"configId": "653aa89b0c0dd4389a8d1dae",
			"type": 1,
			"dossier": {
				"id": this.id,
				"code": this.code,
				"nationCode": "undefined",
				"updated": false,
				"procedureNationCodeSync": true
			}
		};
		const res = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + (localStorage.getItem("tokenDongBoDVCQG") || "")
			},
			body: JSON.stringify(postData)
		});
		if (res.status !== 200) {
			console.error("👾❌Dossier::syncDossier::", res.status, res.statusText);
			await sendDiscord("❌Dossier::syncDossier::" + res.status + " " + res.statusText, true);
			return null;
		}
		const result = await res.text();
		if (result && result === "OK") {
			console.log("👾✅Dossier::syncDossier::updated_false", result);
		}
		else {
			success = false;
			console.error("👾❌Dossier::syncDossier::updated_false", result);
		}

		// Post updated = true
		const postData2 = {
			"configId": "653aa89b0c0dd4389a8d1dae",
			"type": 1,
			"dossier": {
				"id": this.id,
				"code": this.code,
				"nationCode": "undefined",
				"updated": true,
				"procedureNationCodeSync": true
			}
		};
		const res2 = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + (localStorage.getItem("tokenDongBoDVCQG") || "")
			},
			body: JSON.stringify(postData2)
		});
		if (res2.status !== 200) {
			console.error("👾❌Dossier::syncDossier::", res2.status, res2.statusText);
			await sendDiscord("❌Dossier::syncDossier::" + res2.status + " " + res2.statusText, true);
			return null;
		}
		const result2 = await res2.text();
		if (result2 && result2 === "OK") {
			console.log("👾✅Dossier::syncDossier::updated_true", result2);
		}
		else {
			success = false;
			console.error("👾❌Dossier::syncDossier::updated_true", result2);
		}
		return {
			status: success,
			hasFee: this.dossierFee,
			paidDate: this.paymentRequestData && this.paymentRequestData.paidDate ? this.paymentRequestData.paidDate : "",
			msg: success ? "Đồng bộ hồ sơ thành công" : "Đồng bộ hồ sơ thất bại: " + result2
		};
	}

	async getDossierFee() {
		this.dossierFee = false;
		try {
			// GET https://apigatewaydvcmc.hochiminhcity.gov.vn/pa/dossier-fee/--by-dossiers?dossier-ids=689feb966a8e336496b4f894&required=
			const url = API_URL + '/pa/dossier-fee/--by-dossiers?dossier-ids=' + this.id + '&required=';
			const res = await fetch(url, {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + (localStorage.getItem("tokenDongBoDVCQG") || "")
				}
			});
			if (res.status !== 200) {
				console.error("👾❌Dossier::getDossierFee::", res.status, res.statusText);
				await sendDiscord("❌Dossier::getDossierFee::" + res.status + " " + res.statusText, true);
				return null;
			}
			const json = await res.json();
			if (json && json.length > 0) {
				// [
				//     {
				//         "id": "689feb966a8e336496b4f896",
				//         "procost": {
				//             "id": "685f4b09c9772642e70d181c",
				//             "type": {
				//                 "id": "631ee60a289989198cc323e3",
				//                 "type": 111,
				//                 "name": [
				//                     {
				//                         "languageId": 228,
				//                         "name": "Phí chứng thực"
				//                     },
				//                     {
				//                         "languageId": 46,
				//                         "name": ""
				//                     }
				//                 ],
				//                 "quantityEditable": 0
				//             },
				//             "description": [
				//                 {
				//                     "languageId": 228,
				//                     "name": "Lệ phí : 10.000 đồng/trường hợp (trường hợp được tính là một hoặc nhiều chữ ký trong một giấy tờ, văn bản)"
				//                 }
				//             ]
				//         },
				//         "amount": 10000.0,
				//         "quantity": 1,
				//         "paid": 10000.0,
				//         "required": 1,
				//         "dossier": {
				//             "id": "689feb966a8e336496b4f894"
				//         }
				//     }
				// ]
				this.dossierFee = true;
			}
		} catch (e) {
			console.error("👾❌Dossier::getDossierFee::", e);
		}
	}
	/*
async deleteDossierFee() {
	// DELETE https://apigatewaydvcmc.hochiminhcity.gov.vn/pa/dossier-fee/685495086145a54664cb95c5
	for (const fee of this.dossierFee) {
		const url = API_URL + '/pa/dossier-fee/' + fee.id;
		const res = await fetch(url, {
			method: 'DELETE',
			headers: HEADERS
		});
		if (res.status !== 200) {
			console.error("👾❌Dossier::deleteDossierFee::", res.status, res.statusText);
			await sendDiscord("❌Dossier::deleteDossierFee::" + res.status + " " + res.statusText, true);
			return null;
		}
		const json = await res.json();
		if (json && json.affectedRows > 0) {
			console.log("👾✅Dossier::deleteDossierFee::", json);
		} else {
			console.error("👾❌Dossier::deleteDossierFee::", json);
			await sendDiscord("❌Dossier::deleteDossierFee::" + JSON.stringify(json), true);
			return null;
		}
	}
	return {
		status: true,
		msg: "Xóa phí hồ sơ thành công"
	};
}
async getDetail() {
	// GET https://apigatewaydvcmc.hochiminhcity.gov.vn/pa/dossier/685495086145a54664cb95c3/--online
	const url = API_URL + '/pa/dossier/' + this.id + '/--online';
	const res = await fetch(url, { headers: HEADERS });
	if (res.status !== 200) {
		console.error("👾❌Dossier::getDetail::", res.status, res.statusText);
		await sendDiscord("❌Dossier::getDetail::" + res.status + " " + res.statusText, true);
		return null;
	}
	const json = await res.json();
	if (json && json.id) {
		Object.assign(this, json);
	}
}
async deleteForm() {
	// "id": "685495086145a54664cb95c3",
	// "dossierFormFile": [
	// 	{
	// 		"id": "685495086145a54664cb95c4",
	// 		"procedureFormId": "6854938ab6213e6c0a298d4f",
	// 		"formName": "CĂN CƯỚC",
	// 		"procedureForm": {
	// 			"id": "6854938ab6213e6c0a298d4f",
	// 			"name": "CĂN CƯỚC"
	// 		},
	// 		"requirement": {
	// 			"typeId": "623462c0f2e2ad4ed5787167",
	// 			"typeName": "Bản     sao    (Scan/Chụp ảnh Bản sao có chứng thực hoặc Bản sao kèm bản chính để đối chiếu)",
	// 			"quantity": 2
	// 		},
	// 		"file": [
	// 			{
	// 				"id": "685494794822f255e5632d54",
	// 				"filename": "BAN SAO CCCD.pdf",
	// 				"size": 67627,
	// 				"uuid": "e28f8332-4922-401c-9e2a-7ab38f76cf06",
	// 				"additionalFlag": 0,
	// 				"updateCount": 0,
	// 				"downloadURL": ""
	// 			}
	// 		],
	// 		"authentication": {
	// 			"type": {
	// 				"id": 2,
	// 				"name": "Chứng thực giấy"
	// 			},
	// 			"pageNumber": 1,
	// 			"translate": "",
	// 			"copiesAmount": 1
	// 		},
	// 		"case": "682d3da03a897e378c810504"
	// 	}
	// ]
	// DELETE https://apigatewaydvcmc.hochiminhcity.gov.vn/pa/dossier-form-file/685495086145a54664cb95c4/?dossier-id=685495086145a54664cb95c3
	// DELETE https://apigatewaydvcmc.hochiminhcity.gov.vn/fi/file/685494794822f255e5632d54

	for (const form of this.dossierFormFile) {
		for (const file of form.file) {
			const fileUrl = API_URL + '/fi/file/' + file.id;
			const fileRes = await fetch(fileUrl, {
				method: 'DELETE',
				headers: HEADERS
			});
			if (fileRes.status !== 200) {
				console.error("👾❌Dossier::deleteForm::file::", fileRes.status, fileRes.statusText);
				await sendDiscord("❌Dossier::deleteForm::file::" + fileRes.status + " " + fileRes.statusText, true);
				return null;
			}
			const fileJson = await fileRes.json();
			if (fileJson && fileJson.affectedRows > 0) {
				console.log("👾✅Dossier::deleteForm::file::", fileJson);
			} else {
				console.error("👾❌Dossier::deleteForm::file::", fileJson);
				await sendDiscord("❌Dossier::deleteForm::file::" + JSON.stringify(fileJson), true);
				return null;
			}
		}
		const url = API_URL + '/pa/dossier-form-file/' + form.id + '/?dossier-id=' + this.id;
		const res = await fetch(url, {
			method: 'DELETE',
			headers: HEADERS
		});
		if (res.status !== 200) {
			console.error("👾❌Dossier::deleteForm::", res.status, res.statusText);
			await sendDiscord("❌Dossier::deleteForm::" + res.status + " " + res.statusText, true);
			return null;
		}
		const json = await res.json();
		if (json && json.affectedRows > 0) {
			console.log("👾✅Dossier::deleteForm::", json);
		} else {
			console.error("👾❌Dossier::deleteForm::", json);
			await sendDiscord("❌Dossier::deleteForm::" + JSON.stringify(json), true);
			return null;
		}
	}
}
async delete() {
	// DELETE https://apigatewaydvcmc.hochiminhcity.gov.vn/pa/dossier/6853da767bf8654b81c4a740/?is-canceled=0
	// {"affectedRows":1}
	const url = API_URL + '/pa/dossier/' + this.id + '/?is-canceled=0';
	const res = await fetch(url, {
		method: 'DELETE',
		headers: HEADERS
	});
	if (res.status !== 200) {
		console.error("👾❌Dossier::delete::", res.status, res.statusText);
		await sendDiscord("❌Dossier::delete::" + res.status + " " + res.statusText, true);
		return null;
	}
	const json = await res.json();
	if (json && json.affectedRows > 0) {
		console.log("👾✅Dossier::delete::", json);
		return {
			status: true,
			msg: "Xóa hồ sơ thành công"
		};
	}
}
async fullDelete() {

	// Xóa hồ sơ
	const deleteResult = await this.delete();
	if (deleteResult === null) {
		return null;
	}
	console.log("👾✅Dossier::fullDelete::delete::", deleteResult);

	// Xóa phí hồ sơ
	if (this.dossierFee && this.dossierFee.length > 0) {
		const feeDeleteResult = await this.deleteDossierFee();
		if (feeDeleteResult === null) {
			return null;
		}
		console.log("👾✅Dossier::fullDelete::deleteDossierFee::", feeDeleteResult);
	}

	// Xóa biểu mẫu hồ sơ
	if (this.dossierFormFile && this.dossierFormFile.length > 0) {
		await this.deleteForm();
		console.log("👾✅Dossier::fullDelete::deleteForm::");
	}



	console.log("👾✅Dossier::fullDelete::delete::", deleteResult);
	return deleteResult;
}*/
}

class DossierList extends Array {
	constructor(...items) {
		super(...items.map(item => item instanceof Dossier ? item : new Dossier(item)));
	}
	async searchCode(code) {
		try {
			const url = API_URL + '/pa/dossier/search?page=0&size=10&applicant-organization=&spec=slice&identity-number=&applicant-name=&applicant-owner-name=&sector-id=&procedure-id=&nation-id=&province-id=&district-id=&ward-id=&address=&address1=&task-status-id=&dossier-status=&apply-method-id=&accepted-from=&accepted-to=&appointment-from=&appointment-to=&result-returned-from=&result-returned-to=&noidungyeucaugiaiquyet=&approvalstatus=&receipt-code=&ancestor-agency-id=000000000191c4e1bd300029&remind-id=&vnpost-status-return-code=&receiving-kind-id=&applied-from=&applied-to=&taxCode=&resPerson=&isAgencySearch=true&code-match=' + code + '&nation-code-match=';
			const res = await fetch(url, {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + (localStorage.getItem("tokenDongBoDVCQG") || "")
				},
			});
			if (res.status !== 200) {
				console.error("👾❌DossierList::searchCode::", res.status, res.statusText);
				return null;
			}
			const json = await res.json();
			if (json && json.content) {
				if (json.content.length === 0) {
					return {
						status: false,
						msg: "Không tìm thấy hồ sơ"
					};
				}
				else if (json.content.length > 1) {
					return {
						status: false,
						msg: "Tìm thấy " + json.content.length + " hồ sơ"
					};
				}
				else {
					let dossier = new Dossier(json.content[0]);
					// await dossier.getDetail();
					await dossier.getDossierFee();
					let syncResult = await dossier.syncDossier();
					this.push(dossier);
					console.log("👾✅DossierList::searchCode::", dossier);
					return syncResult;
				}


			}
		} catch (err) {
			console.error("👾❌DossierList::searchCode::", err);
			return {
				status: false,
				msg: "Lỗi kết nối",
				dossiers: []
			};
		}
	}
}
const MAX_RETRY = 60;
async function init() {
	console.log('🎨Init');
	initPopup();

	// getAccountButton.addEventListener("click", async () => {
	// 	let startTime = new Date();
	// 	let inputValues = txtInput.value.trim().split(new RegExp(String.fromCharCode(10), 'gm'));
	// 	let countRetry = 0;
	// 	let searchFound = true;
	// 	for (let i = 0; i < inputValues.length; i++) {
	// 		searchFound = true;
	// 		let row = inputValues[i].split(String.fromCharCode(9));
	// 		let searchCode = row[0] ? row[0].trim() : "";
	// 		let searchCodeResult = row[1] ? row[1].trim() : "";
	// 		if (searchCodeResult === "✅") {
	// 			log("✅[" + searchCode + "] Đã xử lý");
	// 			continue;
	// 		}
	// 		logStep2.innerText = "Đang xử lý: " + (i + 1) + "/" + inputValues.length + " - " + searchCode;
	// 		console.log("👾🔢Processing input:", i + 1, "/", inputValues.length, " - ", inputValues[i]);
	// 		console.log("👾🔢Input code");
	// 		document.querySelector('input#mat-input-0').dispatchEvent(new Event('focus'));
	// 		document.querySelector('input#mat-input-0').value = searchCode;
	// 		document.querySelector('input#mat-input-0').dispatchEvent(new Event('input'));
	// 		await wait(500);
	// 		console.log("👾🔢Click Search");
	// 		document.querySelector('.searchBtn').click();
	// 		await wait(1000);
	// 		countRetry = 0;
	// 		while (true) {
	// 			let dossierCode = document.querySelector('.searchtbl .mat-column-code a');
	// 			if (dossierCode && dossierCode.innerText.split(String.fromCharCode(10))[0] === searchCode) {
	// 				console.log("👾✅Found search results");
	// 				break;
	// 			}
	// 			if (document.querySelector('.content app-list-search > .ng-star-inserted:last-child') && document.querySelector('.content app-list-search > .ng-star-inserted:last-child').innerText === "Không có kết quả tìm kiếm") {
	// 				console.error("👾❌No search results found:", searchCode);
	// 				searchFound = false;
	// 				break;
	// 			}
	// 			console.log("👾🔄Waiting search results...");
	// 			countRetry++;
	// 			if (countRetry >= MAX_RETRY) {
	// 				break;
	// 			}
	// 			await wait(1000);
	// 		}
	// 		if (countRetry >= MAX_RETRY) {
	// 			log("❌[" + searchCode + "] Max retry reached");
	// 			inputValues[i] = searchCode + String.fromCharCode(9) + "❌";
	// 			txtInput.value = inputValues.join(String.fromCharCode(10));
	// 			continue;
	// 		}
	// 		if (searchFound === false) {
	// 			console.error("👾❌Not found search results:", searchCode);
	// 			log("❌[" + searchCode + "] Not found");
	// 			inputValues[i] = searchCode + String.fromCharCode(9) + "❌";
	// 			txtInput.value = inputValues.join(String.fromCharCode(10));
	// 			continue;
	// 		}
	// 		console.log("👾🔢Click three dots");
	// 		document.querySelector('.searchtbl .mat-column-action button.mat-menu-trigger').click();
	// 		await wait(500);
	// 		countRetry = 0;
	// 		while (true) {
	// 			if (document.querySelectorAll('.cdk-overlay-container .mat-menu-content button.menuAction').length > 0) {
	// 				console.log("👾✅Found context menu");
	// 				break;
	// 			}
	// 			console.log("👾🔄Waiting context menu...");
	// 			countRetry++;
	// 			if (countRetry >= MAX_RETRY) {
	// 				break;
	// 			}
	// 			await wait(1000);
	// 		}
	// 		if (countRetry >= MAX_RETRY) {
	// 			console.error("👾❌Max retry reached for waiting context menu:", searchCode)
	// 			log("❌[" + searchCode + "] Max retry reached");
	// 			inputValues[i] = searchCode + String.fromCharCode(9) + "❌";
	// 			txtInput.value = inputValues.join(String.fromCharCode(10));
	// 			continue;
	// 		}
	// 		const buttons = document.querySelectorAll('.cdk-overlay-container .mat-menu-content button.menuAction');
	// 		for (let j = 0; j < buttons.length; j++) {
	// 			if (buttons[j].querySelector('span').innerText.trim() === "Xóa") {
	// 				console.log("👾🔢Click Delete button");
	// 				buttons[j].click();
	// 				await wait(500);
	// 				break;
	// 			}
	// 			console.log("👾🔄Check context menu", buttons[j].querySelector('span').innerText.trim());
	// 		}
	// 		countRetry = 0;
	// 		while (true) {
	// 			if (document.querySelector('.cdk-overlay-container app-delete-dossier')) {
	// 				console.log("👾✅Found delete popup");
	// 				break;
	// 			}
	// 			console.log("👾🔄Waiting delete popup...");
	// 			countRetry++;
	// 			if (countRetry >= MAX_RETRY) {
	// 				break;
	// 			}
	// 			await wait(1000);
	// 		}
	// 		if (countRetry >= MAX_RETRY) {
	// 			console.error("👾❌Max retry reached for waiting delete popup:", searchCode)
	// 			log("❌[" + searchCode + "] Max retry reached");
	// 			inputValues[i] = searchCode + String.fromCharCode(9) + "❌";
	// 			txtInput.value = inputValues.join(String.fromCharCode(10));
	// 			continue;
	// 		}
	// 		console.log("👾🔢Fill delete input");
	// 		document.querySelector('.cdk-overlay-container app-delete-dossier input.mat-input-element').dispatchEvent(new Event('focus'));
	// 		document.querySelector('.cdk-overlay-container app-delete-dossier input.mat-input-element').value = 'Xóa HS test';
	// 		document.querySelector('.cdk-overlay-container app-delete-dossier input.mat-input-element').dispatchEvent(new Event('input'));
	// 		await wait(500);
	// 		console.log("👾🔢Click delete checkbox");
	// 		document.querySelector('.cdk-overlay-container app-delete-dossier input.mat-checkbox-input').click();
	// 		await wait(500);
	// 		console.log("👾🔢Click delete confirm button");
	// 		document.querySelector('.cdk-overlay-container app-delete-dossier button.applyBtn ').click();
	// 		await wait(1000);
	// 		countRetry = 0;
	// 		while (true) {
	// 			if (!document.querySelector('.searchtbl')) {
	// 				console.log("👾✅Result disappeared");
	// 				break;
	// 			}
	// 			console.log("👾🔄Waiting reset result...");
	// 			countRetry++;
	// 			if (countRetry >= MAX_RETRY) {
	// 				break;
	// 			}
	// 			await wait(1000);
	// 		}
	// 		if (countRetry >= MAX_RETRY) {
	// 			console.error("👾❌Max retry reached for waiting reset result:", searchCode)
	// 			log("❌[" + searchCode + "] Max retry reached");
	// 			inputValues[i] = searchCode + String.fromCharCode(9) + "❌";
	// 			txtInput.value = inputValues.join(String.fromCharCode(10));
	// 			continue;
	// 		}
	// 		txtOutput.value += searchCode + String.fromCharCode(9) + "x" + String.fromCharCode(10);
	// 		inputValues[i] = searchCode + String.fromCharCode(9) + "✅";
	// 		txtInput.value = inputValues.join(String.fromCharCode(10));
	// 	}
	// 	let endTime = new Date();
	// 	let duration = Math.floor((endTime - startTime) / 1000);
	// 	let logText = "✅Hoàn thành xóa " + inputValues.length + " hồ sơ trong " + duration + " giây.";
	// 	log(logText);
	// 	logStep2.innerText = logText;
	// 	await sendDiscord(logText + String.fromCharCode(10) + "```" + txtInput.value + "```", true);
	// });

	syncDossierButton.addEventListener("click", async () => {
		if (stateSyncing === false) {
			stateSyncing = true;
			syncDossierButton.textContent = "Running...";
			syncDossierButton.style.background = "#C22121";
		}
		else {
			stateSyncing = false;
			syncDossierButton.textContent = "Start sync";
			syncDossierButton.style.background = "#32cd32";
		}

		while (true) {
			try {
				if (stateSyncing === false) {
					break;
				}
				await checkToken();
				let fetchResult = await startAutoFetchInput();
				if (fetchResult === false) {
					log("👾❌Không thể tự động lấy dữ liệu từ Google Sheet");
					logStep2.innerText = "Không thể tự động lấy dữ liệu từ Google Sheet";
				}
				let startTime = new Date();
				let inputValues = txtInput.value.trim().split(new RegExp(String.fromCharCode(10), 'gm'));
				let resultData = {};
				let searchFound = true;
				if (inputValues.length === 0 || (inputValues.length === 1 && inputValues[0].trim() === "")) {
					searchFound = false;
				}
				else {
					for (let i = 0; i < inputValues.length; i++) {
						if (inputValues[i].trim() === "") {
							log("👾❌Dòng trống tại vị trí " + (i + 1) + ", bỏ qua");
							console.log("👾🔢Skip blank line", i + 1);
							continue;
						}
						let row = inputValues[i].split(String.fromCharCode(9));
						let searchCode = row[0] ? row[0].trim() : "";
						let searchCodeResult = row[1] ? row[1].trim() : "";
						if (searchCodeResult === "✅") {
							log("✅[" + searchCode + "] Đã xử lý");
							console.log("👾🔢Already processed:", i + 1, "/", inputValues.length, " - ", inputValues[i]);
							continue;
						}
						logStep2.innerText = "Đang xử lý: " + (i + 1) + "/" + inputValues.length + " - " + searchCode;
						console.log("👾🔢Processing input:", i + 1, "/", inputValues.length, " - ", inputValues[i]);
						const dossierList = new DossierList();
						let searchResult = await dossierList.searchCode(searchCode);
						if (!searchResult) {
							log("❌[" + searchCode + "] Lỗi kết nối");
							console.error("👾❌Search error: Connection failed", searchCode);
							searchFound = false;
							break;
						}
						if (searchResult && searchResult.status === true) {
							txtOutput.value += searchCode + String.fromCharCode(9) + "x" + String.fromCharCode(10);
							inputValues[i] = searchCode + String.fromCharCode(9) + "✅";
							txtInput.value = inputValues.join(String.fromCharCode(10));
							resultData = {
								code: searchCode,
								hasFee: searchResult.hasFee || false,
								paidDate: searchResult.paidDate || "",
								status: true,
							};
						}
						else {
							log("❌[" + searchCode + "] Không tìm thấy hồ sơ");
							console.error("👾❌Search error: Not found", searchCode, searchResult.msg);
							inputValues[i] = searchCode + String.fromCharCode(9) + "❌";
							txtInput.value = inputValues.join(String.fromCharCode(10));
							resultData = {
								code: searchCode,
								hasFee: searchResult.hasFee || false,
								paidDate: searchResult.paidDate || "",
								status: false,
							};

						}
						console.log("👾🔢Posting data to Google Sheet...");
						const postResult = await GSheetSubmit(GSHEET_FORM, resultData);
						if (postResult && postResult.ok) {
							console.log("👾✅GSheetSubmit::", postResult);
							log("👾✅Cập nhật Google Sheet thành công");
						}
						else {
							console.log("👾❌GSheetSubmit::", postResult);
							log("👾❌Không thể cập nhật Google Sheet");
						}
					}
				}
				if (searchFound === false) {
					log("👾❌Không tìm thấy hồ sơ nào để đồng bộ");
				}
				else {
					let endTime = new Date();
					let duration = Math.floor((endTime - startTime) / 1000);
					let logText = "✅Hoàn thành đồng bộ " + inputValues.length + " hồ sơ trong " + duration + " giây.";
					log(logText);
				}
				console.log("👾⏳ Waiting for 20 seconds...");
				await wait(20000);
			}
			catch (e) {
				console.error("👾❌Error occurred:", e);
			}
		}
	});
}

async function startAutoFetchInput() {
	const url = GSHEET_WEB_APP;
	try {
		const res = await fetch(url);
		const arr = await res.json();
		if (Array.isArray(arr)) {
			txtInput.value = arr.join('\n');
			return true;
		}
	} catch (err) {
		console.error("AutoFetchInput error:", err);
	}
	return false;
}

async function GSheetSubmit(url, json) {
	console.log("👾GSheetSubmit::json::", json);

	let formData = Object.keys(json)
		.map((key) => {
			function encode(val) {
				return encodeURIComponent(
					val.toString().replace(new RegExp(String.fromCharCode(13), "gm"), String.fromCharCode(10)).replace(new RegExp(String.fromCharCode(9), "gm"), " ").replace(new RegExp(String.fromCharCode(160), "gm"), " ")
				)
					.replace(/'/g, "'")
					.replace(/"/g, '"');
			}
			return encode(key) + "=" + encode(json[key]);
		})
		.join("&");

	const fetchPromise = fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
		},
		body: formData
	});

	let result = null;
	try {
		result = await Promise.race([
			fetchPromise,
			new Promise(resolve => setTimeout(() => resolve(null), 3000))
		]);
	} catch (err) {
		console.error("👾❌GSheetSubmit error:", err);
	}

	return result;
}

async function getToken(username, password) {
	const url = 'https://ssodvcmc.hochiminhcity.gov.vn/auth/realms/digo/protocol/openid-connect/token';
	const res = await fetch(url, {
		method: 'POST',
		headers: {
			'User-Agent': 'Mozilla/5.0',
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			'grant_type': 'password',
			'username': username,
			'password': password,
			'client_id': 'web-onegate'
		})
	});
	if (!res.ok) {
		console.error("👾❌Failed to get token:", res.status, res.statusText);
		return null;
	}
	const data = await res.json();
	if (data && data.access_token) {
		localStorage.setItem("tokenDongBoDVCQG", data.access_token);
		console.log("👾✅Token saved to localStorage");
		return data.access_token;
	} else {
		console.error("👾❌No access token found in response");
		return null;
	}
}
async function validateToken() {
	const url = API_URL + '/hu/user/686098b581603d7cded2594c';
	const res = await fetch(url, {
		method: 'GET',
		headers: {
			'Authorization': 'Bearer ' + (localStorage.getItem("tokenDongBoDVCQG") || "")
		}
	});
	if (!res.ok) {
		console.error("👾❌Failed to check token:", res.status, res.statusText);
		return false;
	}
	else {
		console.log("👾✅Token check request sent successfully");
		return true;
	}
}
async function checkToken() {
	const checkTokenResult = await validateToken();
	if (checkTokenResult === false) {
		log("👾❌Token không hợp lệ, vui lòng lấy token mới");
		let username = localStorage.getItem("usernameDongBoDVCQG");
		if (!username) {
			username = prompt("Nhập tên đăng nhập:", "");
			if (!username) {
				alert("Tên đăng nhập không được để trống");
				return;
			}
		}
		localStorage.setItem("usernameDongBoDVCQG", username);
		let password = localStorage.getItem("passwordDongBoDVCQG");
		if (!password) {
			password = prompt("Nhập mật khẩu:", "");
			if (!password) {
				alert("Mật khẩu không được để trống");
				return;
			}
		}
		localStorage.setItem("passwordDongBoDVCQG", password);
		log("👾🔢Đang lấy token...");
		await getToken(username, password);
		log("👾✅Lấy token thành công");
	} else {
		log("👾✅Token còn hợp lệ");
	}
}

function bindTextareaToLocalStorage(textarea, storageKey) {
	// Save to localStorage on input
	textarea.addEventListener('input', () => {
		localStorage.setItem(storageKey, textarea.value);
	});

	// Save to localStorage when value is set by script
	const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(textarea), 'value');
	Object.defineProperty(textarea, 'value', {
		get() {
			return descriptor.get.call(this);
		},
		set(val) {
			descriptor.set.call(this, val);
			localStorage.setItem(storageKey, val);
		}
	});
}

function checkInclude(str, include = []) {
	for (const inc of include) {
		if (str.indexOf(inc) >= 0) {
			return true;
		}
	}
	return false;
}
function checkProcessed(str, process = []) {
	for (const proc of process) {
		if (str === proc.code) {
			console.log("👾💫checkProcessed::", str, proc.code, proc.success);
			if (proc.success === 1) {
				return true;
			}
			else {
				return false;
			}
		}
	}
	return false;
}
function checkExclude(str, except = []) {
	for (const exc of except) {
		if (str.indexOf(exc) >= 0) {
			return false;
		}
	}
	return true;
}

function removeAccent(str) {
	return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').replace(/[-,]/g, '').replace(/\s{2,}/g, ' ').toLowerCase().trim();
}
function replaceWord(str, replacer) {
	for (let i = 0; i < replacer.length; i++) {
		str = str.replace(new RegExp(replacer[i][0], "gi"), replacer[i][1]);
	}
	return str;
}


async function sendDiscord(message, tag = false) {
	const url = DISCORD_WEBHOOK_URL;
	const payload = {
		content: message + (tag === true ? ' <@' + DEV_ID + '>' : "")
	};

	try {
		const res = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(payload)
		});

		if (!res.ok) {
			console.error("👾❌ Discord message failed:", res.status, res.statusText);
		}
	} catch (err) {
		console.error("👾❌ Discord message failed:", err);
	}
}

if (document.URL.indexOf("ssodvcmc.hochiminhcity.gov.vn") > 0) {
	init();
} else if (document.URL.indexOf("cdpn.io") < 0 && document.URL.indexOf("vscode") < 0) {

}
