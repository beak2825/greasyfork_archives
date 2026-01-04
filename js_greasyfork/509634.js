// ==UserScript==
// @name         【自用】MAC表优化
// @namespace    binger.cc
// @version      1.0
// @description  适用于 TY-301 路由器
// @author       Ervoconite
// @license      MIT
// @match        http://192.168.1.2/nm_lan.htm
// @icon         https://img.icons8.com/dusk/64/wifi-router.png
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/509634/%E3%80%90%E8%87%AA%E7%94%A8%E3%80%91MAC%E8%A1%A8%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/509634/%E3%80%90%E8%87%AA%E7%94%A8%E3%80%91MAC%E8%A1%A8%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==




// 刷掉表单负载
if (GM_getValue('submited', false)) {
	GM_setValue('submited', false);
	location.href = location.href;
}

const names = GM_getValue('names', {});

const macPattern = /([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/;
const ipPattern = /(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}/;


GM_addStyle(`
	#maclist_table td {
		font-family: consolas !important;
		padding: 0 20px !important;
	}
	#maclist_table input.names {
		border: none;
		outline: none;
		height: 25px;
		color: gray;
	}
	#maclist_table input.names:focus {
		background: lightpink;
	}

	#addForm tr {
		display: block;
	}
	#addForm tr:nth-child(1) {
		height: 40px;
	}
	#addForm tr:nth-last-child(1) {
		display: table-row;
	}
	td.table_title1_td {
		height: 40px;
		line-height: 1;
	}

	#autotext {
		font-size: 16px;
		padding: 10px;
		margin: 20px 0;
		border-radius: 10px;
		outline: none;
		border: 1px solid black;
		width: 400px;
	}
`)

/** main */
setTimeout(() => {

	console.clear();
	console.log(names);

	let table = document.getElementById('maclist_table');
	let lines = Array.from(table.querySelectorAll('tr'));
	let addform = document.querySelector('td.content_td_content > table:nth-child(5)');
	addform.id = 'addForm';
	table.querySelector('tr:nth-child(1)').innerHTML += '<th>备注</th>'

	let addMacInput = document.getElementById('Chaddr');
	let addIpInput = document.getElementById('ReservedAddresses');


	for (let i = 0; i < lines.length; i++) {
		if (!lines[i].querySelector('input[type=checkbox]')) {
			// console.log(
			lines.splice(i, 1)
			// );
			i--;
		}
	}

	for (let i = 0; i < lines.length; i++) {
		let mac = lines[i].children[0];
		let ip = lines[i].children[1];
		let cktd = lines[i].children[2];
		// console.log(mac.innerText, ip.innerText)

		mac.innerText = mac.innerText.toUpperCase();

		mac.style.paddingLeft = ip.style.paddingLeft = null;
		cktd.lastChild.style.marginLeft = null;

		let name_td = document.createElement('td');
		name_td.innerHTML = '<input type="text" class="names"/>';
		lines[i].appendChild(name_td);

		let name = name_td.firstElementChild;
		name.value = names[mac.innerText] || '';
		name.addEventListener('change', (e) => {
			let name = e.target;
			let mac = name.parentNode.parentNode.firstElementChild;
			console.info("更新：", mac.innerText, "➡️", name.value || '<<空值>>')
			names[mac.innerText] = name.value;
			GM_setValue('names', names);
		})
	}

	let addformtbody = addform.lastElementChild;

	let comment_tr = document.createElement('tr');
	comment_tr.innerHTML = '备注：<input type="text" id="add_comment" class="input_text1" />';
	addformtbody.insertBefore(comment_tr, addformtbody.children[4]);
	let comment = document.getElementById('add_comment');

	let autotext_tr = document.createElement('tr');
	autotext_tr.innerHTML = '自动识别：<input type="text" id="autotext" placeholder="MAC  IP  备注" />';
	addformtbody.insertBefore(autotext_tr, addformtbody.children[5]);
	let autotext = document.getElementById('autotext');

	autotext.addEventListener('input', (e) => {
		let txt = e.target.value;
		let mac_match = txt.match(macPattern);
		if (mac_match) { addMacInput.value = mac_match[0].replaceAll('-', ':').toUpperCase(); }
		let ip_match = txt.match(ipPattern);
		if (ip_match) { addIpInput.value = ip_match[0]; }
		let comment_match = txt.match(/^\S+\s+\S+\s+(\S+)/);
		if (comment_match) { comment.value = comment_match[1]; }
	})

	let addbtn = document.getElementById('savebindipmac')
	addbtn.removeAttribute('onclick')
	addbtn.onclick = addReservedIP_refact;

	let delbtn = document.getElementById('deletebindipmac')
	delbtn.removeAttribute('onclick')
	delbtn.onclick = removeReservedIP_refact;


	console.log("OK!");
}, 150);




// ###########################################

/**
 * 添加新的IP绑定
 * @returns none
 */
function addReservedIP_refact() {
	let docForm = widget.getNewSubmitForm("nm_lan.htm");
	const Chaddr = document.getElementById('Chaddr'); // todo
	const add_comment = document.getElementById('add_comment'); // todo
	const ReservedAddresses = document.getElementById('ReservedAddresses'); // todo
	if (document.getElementById('cfgForm')) {
		if (ReservedAddresses.value != '') {
			if (valid.isValidIpAddress(ReservedAddresses.value) == false) {
				alert("地址 " + ReservedAddresses.value + "是无效的IP地址.");
				ReservedAddresses.value = ""; ReservedAddresses.focus(); return false;
			}
		} else {
			alert('请输入IP地址'); ReservedAddresses.focus(); return false;
		}
		if (Chaddr.value != '') {
			if (valid.isValidMacAddress(Chaddr.value) == false) {
				alert('MAC地址“' + Chaddr.value + '” 是无效的。 例如：00:11:22:AA:BB:CC');
				Chaddr.value = ""; Chaddr.focus(); return false;
			}
		} else {
			alert('请输入MAC地址');
			Chaddr.focus();
			return false;
		}
	}
	docForm.appendChild(widget.createNewElem('a', 'add'));
	docForm.appendChild(widget.createNewElem('x', "Device.DHCPv4.Server.Pool.1.StaticAddress.1."));
	docForm.appendChild(widget.createNewElem('Enable', "1"));
	docForm.appendChild(widget.createNewElem('Chaddr', Chaddr.value));
	docForm.appendChild(widget.createNewElem('Yiaddr', ReservedAddresses.value));
	document.body.appendChild(docForm);

	// +++++++++++++++++++++++++++++++++++++
	names[Chaddr.value] = add_comment.value;
	GM_setValue('names', names);
	GM_setValue('submited', true);
	// +++++++++++++++++++++++++++++++++++++

	docForm.submit();
}



/**
 * 删除选中的绑定
 * @returns nope
 */
function removeReservedIP_refact() {
	let checkboxs = document.getElementsByName("select_td");
	let flag = 0, count = 0, j = 0;
	let docForm = widget.getNewSubmitForm("nm_lan.htm");
	docForm.appendChild(widget.createNewElem('a', 'del'));
	for (let i = 0; i < checkboxs.length; i++) {
		if (checkboxs[i].checked == true) {
			count = 0;
			for (j = 0; j < datas.ipAndmaclist.length; j++) {
				if (count == i) break; count++;
			}
			if (j < datas.ipAndmaclist.length) {
				docForm.appendChild(widget.createNewElem('x', datas.ipAndmaclist[j].fullPath));
				flag++;
			}
		}
	}
	if (flag == 0) { alert('请选择需要删除的预留地址条目'); return; }
	document.body.appendChild(docForm);

	// +++++++++++++++++++++++++++++++++++++
	for (let i = 0; i < checkboxs.length; i++) {
		let elm = checkboxs[i]
		if (elm.checked == true) {
			let mac = elm.parentNode.parentNode.firstElementChild
			let macAddrM = mac.innerText.match(macPattern);
			let macAddr = macAddrM ? macAddrM[0] : null;
			// console.log(elm, mac, macAddr)
			delete names[macAddr];
		}
	}
	GM_setValue('names', names);
	GM_setValue('submited', true);
	// +++++++++++++++++++++++++++++++++++++

	docForm.submit();
}

