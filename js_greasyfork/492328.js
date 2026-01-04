// ==UserScript==
// @name         IDscript_DropBox
// @namespace    https://moscowm2.amocrm.ru/
// @version      0.7
// @description  try to take over the world
// @author       olqwertyeg
// @license      MIT
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @match        https://moscowm2.amocrm.ru/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/492328/IDscript_DropBox.user.js
// @updateURL https://update.greasyfork.org/scripts/492328/IDscript_DropBox.meta.js
// ==/UserScript==

// jshint esversion: 10
// jshint unused: true

//ключ берем с сайта https://www.dropbox.com/developers/apps/info/cgir2a28v7q2s32
let db_api_key = 'sl.BzoMWJS2Ll5ggckQ_aYDNz9byzBF8mCF2AnRKZNMQl7yKu_mFI57ONHMfzAkKWGbxrkqYBAwRSmwPLORIJ6ckEwMzRCSu_LmNC7aRWHrtTiHN8q8AQeb42nPhNr-AwHTu0Yqq4bXQ3WY' //сюда вставляем ключ

let id_dbox_btn = document.createElement('div');
try{id_dbox_btn.innerHTML = "<div><button type=\"button\" class=\"button-input button-cancel\" tabindex=\"\" id=\"id_create_dropbox_link\"><span class=\"button-input-inner\"><span class=\"button-input-inner__text\">Создать ссылку</span></span></button><a href=\"https://www.dropbox.com/home/Apps/amoLeads/"+AMOCRM.data.card_page.id+"\" target=\"_blank\" class=\"button-input button-input_blue\" tabindex=\"\" id=\"id_open_dropbox_link\"><span class=\"button-input-inner\"><span class=\"button-input-inner__text\">Открыть DB</span></span></button></div>"}catch{}
try{document.querySelector('.card-entity-form__fields .linked-forms__group-wrapper').appendChild(id_dbox_btn)}catch{}
let id_rend_for_db = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
        if (APP.data.current_entity === "leads") {
			try{id_dbox_btn.innerHTML = "<div><button type=\"button\" class=\"button-input button-cancel\" tabindex=\"\" id=\"id_create_dropbox_link\"><span class=\"button-input-inner\"><span class=\"button-input-inner__text\">Создать ссылку</span></span></button><a href=\"https://www.dropbox.com/home/Apps/amoLeads/"+AMOCRM.data.card_page.id+"\" target=\"_blank\" class=\"button-input button-input_blue\" tabindex=\"\" id=\"id_open_dropbox_link\"><span class=\"button-input-inner\"><span class=\"button-input-inner__text\">Открыть DB</span></span></button></div>"}catch{}
            try{document.querySelector('.card-entity-form__fields .linked-forms__group-wrapper').appendChild(id_dbox_btn)}catch{}
			try{
				id_create_dropbox_link.onclick = function () {
					fetch('https://api.dropboxapi.com/2/files/create_folder_v2', {
						method: 'post',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': 'Bearer '+db_api_key
						},
						body: JSON.stringify({
							autorename: false,
							path: '/'+AMOCRM.data.card_page.id
						})
					})
					document.querySelector('[data-id="366375"]').querySelector("input").value = 'https://www.dropbox.com/home/Apps/amoLeads/'+AMOCRM.data.card_page.id
					document.querySelector('[data-id="366375"]').querySelector("input").dispatchEvent(new Event('input', { bubbles: true }));
					document.querySelector("#save_and_close_contacts_link").click()
					window.open('https://www.dropbox.com/home/Apps/amoLeads/'+AMOCRM.data.card_page.id, '_blank');
				}
			}catch{}
        }
	})})
	id_rend_for_db.observe(document.body, {
		childList: true
	})