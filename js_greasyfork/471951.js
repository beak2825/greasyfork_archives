// ==UserScript==
// @name         Список игроков на странице передачи
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Список игроков на странице передачи :)
// @author       Яшка
// @match        https://www.heroeswm.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heroeswm.ru
// @include      https://www.heroeswm.ru/*
// @include      https://www.lordswm.com/*
// @grant        none
// @license      Яшка
// @downloadURL https://update.greasyfork.org/scripts/471951/%D0%A1%D0%BF%D0%B8%D1%81%D0%BE%D0%BA%20%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2%20%D0%BD%D0%B0%20%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D0%B5%20%D0%BF%D0%B5%D1%80%D0%B5%D0%B4%D0%B0%D1%87%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/471951/%D0%A1%D0%BF%D0%B8%D1%81%D0%BE%D0%BA%20%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2%20%D0%BD%D0%B0%20%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D0%B5%20%D0%BF%D0%B5%D1%80%D0%B5%D0%B4%D0%B0%D1%87%D0%B8.meta.js
// ==/UserScript==
const USER_TABLE_ID = 'hwm_helper_saveBlacksmith_user_table';
const NICK_CREATE_ID = 'hwm_helper_saveBlacksmith_nick_create';
const DESCRIPTION_CREATE_ID = 'hwm_helper_saveBlacksmith_description_create';
const SAVE_CREATE_ID = 'hwm_helper_saveBlacksmith_save_create_btn';
const USER_STORE_ID = 'hwm_helper_saveBlacksmith_user_store';
const SELECT_USER_ID = 'hwm_helper_saveBlacksmith_save_create_btn';
// || https://www.lordswm.com/art_transfer.php?*
const lordsUrl = 'https://www.lordswm.com';
const hwmUrl = 'https://www.heroeswm.ru';

(function () {
    'use strict';
    if (window.location.href.split('https://www.heroeswm.ru/art_transfer.php?id').length > 1) {
        createUserTable(document.getElementsByClassName('wb')[0])
    }

    if (window.location.href.split('https://www.heroeswm.ru/el_transfer.php').length > 1) {
        createUserTable(document.getElementsByClassName('wb')[0])
    }
    if (window.location.href.split('https://www.heroeswm.ru/transfer.php').length > 1) {
        createUserTable(document.getElementsByTagName('center')[0])
    }

    function createUserTable(table) {
        let br = document.createElement("br");

        let userTable = document.createElement("table");
        userTable.setAttribute('width', '600')
        userTable.setAttribute('cellpadding', '4')
        userTable.setAttribute('align', 'center')

        let userTbody = document.createElement("tbody");

        userTable.classList.add('wb')
        userTable.classList.add('wbwhite')
        userTable.id = USER_TABLE_ID
        table.after(br)
        br.after(userTable);

        createUserTableHead(userTable)
        userTable.appendChild(userTbody)

        createUserTableBody(userTbody)

        createUserTableActions(userTbody)
        //userTable.appendChild(userTbody)
    }

    function createUserTableHead(table) {
        let userThead = document.createElement("thead");
        let userTr = document.createElement("tr");
        userTr.setAttribute('style', 'border: 1px solid;');

        let userNameB = document.createElement("b");
        userNameB.textContent = 'Ник';
        let userNameTd = document.createElement("td");
        userNameTd.attributes.colspan = 2;
        userNameTd.setAttribute('colspan', '2');
        userNameTd.appendChild(userNameB);

        let descriptionB = document.createElement("b");
        descriptionB.textContent = 'Описание';
        let descriptionTd = document.createElement("td");
        descriptionTd.attributes.colspan = 2;
        descriptionTd.setAttribute('colspan', '2');
        descriptionTd.appendChild(descriptionB);


        let saveB = document.createElement("b");
        saveB.textContent = 'Действие';
        let saveTd = document.createElement("td");
        saveTd.attributes.colspan = 2;
        saveTd.setAttribute('colspan', '2');
        saveTd.appendChild(saveB);

        table.appendChild(userThead);
        userThead.appendChild(userTr);
        userTr.appendChild(userNameTd);
        userTr.appendChild(descriptionTd);
        userTr.appendChild(saveTd);

        return true;
    }

    function createUserTableBody(table) {
        let storeString = localStorage.getItem(USER_STORE_ID)
        if (!storeString) {
            return false
        }
        let store = JSON.parse(storeString)
        for (const storeItem of store) {
            createUserTrBody(table, storeItem.nick, storeItem.description)
        }
    }

    function createUserTrBody(table, nick, description) {

        let actionsTr = document.createElement("tr");
        actionsTr.setAttribute('style', 'border: 1px solid;');

        let inputName = document.createElement("b");
        inputName.textContent = nick;
        inputName.setAttribute('colspan', '2');
        inputName.setAttribute('align', 'right');
        let nameTd = document.createElement("td");
        nameTd.setAttribute('colspan', '2');
        nameTd.appendChild(inputName);


        let inputDescription = document.createElement("b");
        inputDescription.textContent = description;
        inputDescription.setAttribute('colspan', '2');
        inputDescription.setAttribute('align', 'right');
        let descriptionTd = document.createElement("td");
        descriptionTd.setAttribute('colspan', '2');
        descriptionTd.appendChild(inputDescription);

        let btnTd = document.createElement("td");
        btnTd.setAttribute('colspan', '2');

        let btnSelect = document.createElement("input");
        btnSelect.type = 'button';
        btnSelect.value = 'Ввести';
        btnSelect.key = nick;
        btnSelect.onclick = () => selectUser(nick);
        btnSelect.setAttribute('colspan', '2');
        btnSelect.setAttribute('colspan', '2');
        btnSelect.setAttribute('style', 'margin-right:4px');

        let btnDelete = document.createElement("input");
        btnDelete.type = 'button';
        btnDelete.value = 'Удалить';
        btnDelete.key = nick;
        btnDelete.onclick = () => deleteUser(nick);
        btnDelete.setAttribute('colspan', '2');
        btnDelete.setAttribute('align', 'right');
        btnDelete.setAttribute('style', 'margin-right:4px');


        btnTd.appendChild(btnSelect);
        btnTd.appendChild(btnDelete);

        table.appendChild(actionsTr);
        actionsTr.appendChild(nameTd);
        actionsTr.appendChild(descriptionTd);
        actionsTr.appendChild(btnTd);

        return true;

    }

    function createUserTableActions(table) {
        let actionsTr = document.createElement("tr");
        actionsTr.setAttribute('style', 'border: 1px solid;');

        let inputName = document.createElement("input");
        inputName.placeholder = 'Ник';
        inputName.setAttribute('colspan', '2');
        inputName.setAttribute('align', 'right');
        inputName.id = NICK_CREATE_ID;
        let nameTd = document.createElement("td");
        nameTd.setAttribute('colspan', '2');
        nameTd.appendChild(inputName);


        let inputDescription = document.createElement("input");
        inputDescription.placeholder = 'Описание';
        inputDescription.setAttribute('colspan', '2');
        inputDescription.setAttribute('align', 'right');
        inputDescription.id = DESCRIPTION_CREATE_ID;
        let descriptionTd = document.createElement("td");
        descriptionTd.setAttribute('colspan', '2');
        descriptionTd.appendChild(inputDescription);


        let btnSave = document.createElement("input");
        btnSave.type = 'button';
        btnSave.value = 'Добавить';
        btnSave.id = SAVE_CREATE_ID;
        btnSave.onclick = () => saveNewUser();
        btnSave.setAttribute('colspan', '2');
        btnSave.setAttribute('align', 'right');
        let btnTd = document.createElement("td");
        btnTd.setAttribute('colspan', '2');
        btnTd.appendChild(btnSave);

        table.appendChild(actionsTr);
        actionsTr.appendChild(nameTd);
        actionsTr.appendChild(descriptionTd);
        actionsTr.appendChild(btnTd);

        return true;
    }

    function saveNewUser() {
        let nick = document.getElementById(NICK_CREATE_ID).value;
        let description = document.getElementById(DESCRIPTION_CREATE_ID).value;
        if (!nick || !description) {
            alert('Не все поля заполнены');
            return false;
        }

        let store = [];
        let storeString = localStorage.getItem(USER_STORE_ID);
        if (storeString) {
            store = JSON.parse(storeString)
        }
        store.push({
            nick,
            description
        })
        localStorage.setItem(USER_STORE_ID, JSON.stringify(store));
        document.getElementById(USER_TABLE_ID).remove()
        createUserTable()
    }

    function selectUser(nick) {
        document.getElementsByName('nick')[0].value = nick
    }

    function deleteUser(nick) {
        let store = JSON.parse(localStorage.getItem(USER_STORE_ID));
        let storeFiltered = store.filter((obj) => {
            return obj.nick !== nick;
        });

        localStorage.setItem(USER_STORE_ID, JSON.stringify(storeFiltered));
        document.getElementById(USER_TABLE_ID).remove()
        createUserTable()
    }
})();
