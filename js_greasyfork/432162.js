// ==UserScript==
// @name         RepairHelper
// @version      0.1
// @description  ololo
// @author       achepta
// @include     /^https{0,1}:\/\/((www|qrator)\.heroeswm\.ru|178\.248\.235\.15)\/(inventory|pl_info).+/
// @grant       unsafeWindow
// @grant    GM_xmlhttpRequest
// @grant    GM_log
// @run-at document-end
// @namespace https://greasyfork.org/users/449752
// @downloadURL https://update.greasyfork.org/scripts/432162/RepairHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/432162/RepairHelper.meta.js
// ==/UserScript==

(function (window, undefined) {
	let w;
	if (typeof unsafeWindow !== undefined) {
		w = unsafeWindow;
	} else {
		w = window;
	}
	if (w.self !== w.top) {
		return;
	}
	unsafeWindow.getArtInfo = getArtInfo
	unsafeWindow.purgeArt = purgeArt

	let my_sign = get("my_sign", null)
	if (my_sign == null) {
		alert("Set sign")
	}

	let nickname;
	if (location.href.includes("pl_info")) {
		let target = document.querySelectorAll("td[align=right]")[1].parentElement;
		nickname = document.body.innerText.match(/([А-Яа-яёЁa-zA-Z0-9_* ()-]+)  \[\d{1,3}]/)[1]
		console.log("nickname", nickname, "stored nickname", get('fav_smith_name'))
		target.insertAdjacentHTML('afterend', `<tr><td id="smith-target" colspan="2" style="text-align: center;"></td></tr>`)
		if (get('fav_smith_name') !== nickname) {
			smith1()
		} else if (!get('fav_smith_percent', null)) {
			smith2()
		} else {
			smith3()
		}
	}

	function smith1() {
		$('smith-target').innerHTML = `  <span id="smith-1" style="cursor: pointer; text-decoration: underline">Любимый кузнец?</span>`
		$('smith-1').addEventListener('click', e => {
			set('fav_smith_name', nickname)
			smith2()
		})
	}

	function smith2() {
		$('smith-target').innerHTML = `  <span>%<input id="smith-percent" type="text" style="width: 30px"><button id="smith-2">OK</button></span>`
		$('smith-2').addEventListener('click', e => {
			processSmith2()
		})
		$('smith-percent').addEventListener('keyup', e => {
			if (e.key === 'Enter' || e.keyCode === 13) {
				processSmith2()
			}
		})
	}

	function processSmith2() {
		let inputValue = $('smith-percent').value - 0
		if (!isNaN(inputValue) && inputValue !== 0) {
			set("fav_smith_percent", inputValue)
			smith3()
		}
	}

	function smith3() {
		$('smith-target').innerHTML = `  <span style=" text-decoration: underline; position: relative">Любимый кузнец ${get('fav_smith_percent', '')}%</span> <img id="smith-3" style="cursor: pointer;" src="https://webstockreview.net/images250_/how-to-edit-png-images.png" height="16" alt="" title="Edit">`
		$('smith-3').addEventListener('click', e => {
			smith2()
		})
	}

	if (location.href.includes("inventory")) {
		setInterval(main, 100)
	}

	function main() {
		nickname = get("fav_smith_name", null)
		if (nickname) {
			Array.from(document.getElementsByClassName(" inventory_item_div inventory_item2 ")).forEach((art, index) => {
				let id = art.id.match(/\d{1,3}/)
				let artInfo = arts[parseInt(id)]
				if (artInfo.durability1 === 0 && artInfo.transfer_ok === 1) {
					if (!art.querySelector(`#repair_${index}`)) {
						art.insertAdjacentHTML("beforeend", `
							<div class="inventory_item_nadet_button inv_item_select inv_item_select_return_small" id="repair_${index}" inv_idx="15" no_menu="1" style="display: block !important;">
								<img no_menu="1" class="inv_100mwmh inv_item_select_img show_hint" onclick="getArtInfo('${artInfo.art_id}', '${artInfo.id}');event.preventDefault();" hint="В ремонт!" src="https://dcdn.heroeswm.ru/i/inv_im/btn_blacksmith.png" hwm_hint_added="1">
							</div>
						`)
					}
				}
				if ((artInfo.durability1 === 0 && artInfo.transfer_ok !== 1 || artInfo.durability1 === 0 && artInfo.durability2 < 51) && artInfo['drop_type'] != 2) {
					if (!art.querySelector(`#purge_${index}`)) {
						art.insertAdjacentHTML("beforeend", `
							<div class="inventory_item_nadet_button inv_item_select inv_item_select_return_small" id="purge_${index}" inv_idx="15" no_menu="1" style="display: block !important; left: 0em; top: 3em;">
								<img no_menu="1" class="inv_100mwmh inv_item_select_img show_hint" onclick="purgeArt('${artInfo.id}');event.preventDefault();" hint="В ремонт!" src="https://dcdn.heroeswm.ru/i/inv_im/btn_art_remove.png" hwm_hint_added="1">
							</div>
						`)
					}
				}
			})
		}
	}

	function purgeArt(artId) {
		fetch(`/inventory.php?sell=${artId}&sign=${my_sign}`)
			.then(res => location.reload())

	}


	function getArtInfo(link, artId) {
		if (get('fav_smith_percent', null) != null) {
			fetch("/art_info.php?id=" + link)
				.then(res => res.text())
				.then(data => {
					sendToRepair(getSendArray(getRepairFormData(findRepairPrice(data), artId)))
				})
		} else {
			alert("Нужно указать ставку кузнеца")
		}
	}

	function sendToRepair(repairFormData) {
		let http = new XMLHttpRequest;
		http.open('POST', '/art_transfer.php', !0)
		http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
		http.setRequestHeader('Content-Type', 'text/plain; charset=windows-1251')
		http.send(repairFormData);
		http.onload = () => {
			setTimeout(() => {
				location.reload()
			}, 3000)
		}
	}

	function findRepairPrice(doc) {
		return Array.from(new DOMParser()
			.parseFromString(doc.toString(), "text/html")
			.querySelectorAll('[src*="gold.png"]')).slice(-1)[0]
			.parentNode
			.nextSibling
			.innerText
			.replaceAll(",", "") - 0
	}

	function getRepairFormData(repairPrice, artId) {
		let formData = new FormData()
		formData.append('id', artId)
		formData.append('art_id', artId)
		formData.append('sendtype', "5")
		formData.append('dtime', "0")
		formData.append('bcount', "0")
		formData.append('rep_price', Math.ceil(repairPrice * get('fav_smith_percent', 0) / 100 + 1).toString())
		formData.append('sign', unsafeWindow.sign)
		formData.append('nick', nickname)
		const data = [...formData.entries()];
		let str = data
			.map(x => `${x[0]}=${x[1]}`)
			.join('&')
		return str
	}

	function $(id) {
		return document.querySelector(`#${id}`);
	}

	function get(key, def) {
		let result = JSON.parse(localStorage[key] === undefined ? null : localStorage[key]);
		return result == null ? def : result;

	}

	function set(key, val) {
		localStorage[key] = JSON.stringify(val);
	}

	let DMap = {
		1027: 129,
		8225: 135,
		1046: 198,
		8222: 132,
		1047: 199,
		1168: 165,
		1048: 200,
		1113: 154,
		1049: 201,
		1045: 197,
		1050: 202,
		1028: 170,
		160: 160,
		1040: 192,
		1051: 203,
		164: 164,
		166: 166,
		167: 167,
		169: 169,
		171: 171,
		172: 172,
		173: 173,
		174: 174,
		1053: 205,
		176: 176,
		177: 177,
		1114: 156,
		181: 181,
		182: 182,
		183: 183,
		8221: 148,
		187: 187,
		1029: 189,
		1056: 208,
		1057: 209,
		1058: 210,
		8364: 136,
		1112: 188,
		1115: 158,
		1059: 211,
		1060: 212,
		1030: 178,
		1061: 213,
		1062: 214,
		1063: 215,
		1116: 157,
		1064: 216,
		1065: 217,
		1031: 175,
		1066: 218,
		1067: 219,
		1068: 220,
		1069: 221,
		1070: 222,
		1032: 163,
		8226: 149,
		1071: 223,
		1072: 224,
		8482: 153,
		1073: 225,
		8240: 137,
		1118: 162,
		1074: 226,
		1110: 179,
		8230: 133,
		1075: 227,
		1033: 138,
		1076: 228,
		1077: 229,
		8211: 150,
		1078: 230,
		1119: 159,
		1079: 231,
		1042: 194,
		1080: 232,
		1034: 140,
		1025: 168,
		1081: 233,
		1082: 234,
		8212: 151,
		1083: 235,
		1169: 180,
		1084: 236,
		1052: 204,
		1085: 237,
		1035: 142,
		1086: 238,
		1087: 239,
		1088: 240,
		1089: 241,
		1090: 242,
		1036: 141,
		1041: 193,
		1091: 243,
		1092: 244,
		8224: 134,
		1093: 245,
		8470: 185,
		1094: 246,
		1054: 206,
		1095: 247,
		1096: 248,
		8249: 139,
		1097: 249,
		1098: 250,
		1044: 196,
		1099: 251,
		1111: 191,
		1055: 207,
		1100: 252,
		1038: 161,
		8220: 147,
		1101: 253,
		8250: 155,
		1102: 254,
		8216: 145,
		1103: 255,
		1043: 195,
		1105: 184,
		1039: 143,
		1026: 128,
		1106: 144,
		8218: 130,
		1107: 131,
		8217: 146,
		1108: 186,
		1109: 190
	};
	for (let j = 0; j < 128; j++) {
		DMap[j] = j;
	}

	function UnicodeToWin1251(t) {
		for (var e = [], r = 0; r < t.length; r++) {
			var n = t.charCodeAt(r);
			if (!(n in DMap)) throw'e';
			e.push(String.fromCharCode(DMap[n]))
		}
		return e.join('')
	}

	function getSendArray(body) {
		let converted_str = UnicodeToWin1251(body)
		let	send_arr = new Uint8Array(converted_str.length)
		for (let x = 0; x < converted_str.length; ++x) {
			send_arr[x] = converted_str.charCodeAt(x);
		}
		return send_arr
	}
})(window);