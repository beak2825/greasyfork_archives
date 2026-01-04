// ==UserScript==
// @name         Fast builds swap
// @namespace    nexterot
// @version      2.0.7
// @description  Быстрая смена билдов (навыки + армия + арты)
// @author       nexterot
// @match        https://*.heroeswm.ru/home.php*
// @match        https://*.lordswm.com/home.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heroeswm.ru
// @grant        GM.xmlHttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @license      none
// @homepage     https://greasyfork.org/ru/scripts/501602-fast-builds-swap
// @downloadURL https://update.greasyfork.org/scripts/501602/Fast%20builds%20swap.user.js
// @updateURL https://update.greasyfork.org/scripts/501602/Fast%20builds%20swap.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    let CookieName = 'fast_builds_swap';

    let r = 1;
    let rs = 101;
    let nekr = 2;
    let nps = 102;
    let mag = 3;
    let mr = 103;
    let elf = 4;
    let ez = 104;
    let barb = 5;
    let vk = 105;
    let vsh = 205;
    let te = 6;
    let teu = 106;
    let kd = 7;
    let dt = 107;
    let gn = 8;
    let go = 108;
    let sv = 9;
    let svy = 109;
    let far = 10;

    var sign;
    let default_builds = [
        {"id": "de1d1209-03fd-4269-b0ff-23f18be1bbc3", "title": "АП", "faction_id": kd, "perks_id": 7, "army_id": 1, "arts_id": 7},
        {"id": "c0378464-1cc5-488c-a110-c3b628249e17", "title": "ГВ", "faction_id": kd, "perks_id": 4, "army_id": 2, "arts_id": 1},
        {"id": "c0378464-1cc5-488c-a110-c3b628249e18", "title": "ГС", "faction_id": dt, "perks_id": 1, "army_id": 1, "arts_id": 6},
        {"id": "c0378464-1cc5-488c-a110-c3b628249e19", "title": "Сурв", "faction_id": dt, "perks_id": 1, "army_id": 1, "arts_id": 5},
    ];

    var edit_mode = false;
    var selected_id;
    var buildsObject;

    if ((sign = GM_getValue("my_sign", null)) == null) {
        let res = getPage(`${window.location.origin}/shop.php`);
        GM_setValue("my_sign", sign = res.match(/sign=\"([a-z0-9]+)\"/)[1]);
        console.log('set my_sign to ', sign);
    }

    window.onload = function(){
        var parent = document.querySelector("#set_mobile_max_width > div.home_column.home_left_landscape_mobile.home_main_pers_block > div.home_container_block.home_pers_block.home_left_landscape_mobile > div > div.home_inside_margins.home_pers_column > div:nth-child(1)")
            ?? document.querySelector("body > center > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td:nth-child(1) > table > tbody > tr > td > center > a:nth-child(3)");
        if (parent == null) {
            console.log('Fast builds swap: no parent container found');
            return;
        }
        var div = document.createElement('div');
        div.style = "display: flex;flex-wrap: wrap;justify-content: center;";
        div.style.gap = "5px";
        div = parent.insertAdjacentElement(`afterend`, div);

        var editDiv = document.createElement('div');
        editDiv.style = "display: none;";
        editDiv = div.insertAdjacentElement(`afterend`, editDiv);

        buildsObject = JSON.parse(GM_getValue(CookieName, `{}`));
            //console.log(buildsObject);
        let first_save = buildsObject.builds == null;
        if (buildsObject.builds == null) {
            buildsObject.builds = default_builds;
        }

        for (var i = 0; i < buildsObject.builds.length; i++) {
            var build = buildsObject.builds[i];
            addSet(
                i,
                build.id,
                div,
                "",
                build.title,
                build.faction_id,
                build.arts_id,
                build.perks_id,
                build.army_id,
            );
        }
        if (first_save) {
            GM_setValue(CookieName, JSON.stringify(buildsObject));
        }

        addEditButton(div, editDiv);

    }();
    function addSet(i, id, parent, factionTitle, title, factionId, inventoryId, buildId, setId) {
        let skillwheelUrl = `${window.location.origin}/skillwheel.php?setuserperk=1&prace=${factionId}&buildid=${buildId}`;
        let factionUrl = `${window.location.origin}/castle.php?change_clr_to=${factionId}&back_to_home=1&sign=${sign}`;
        let imgUrl = `https://dcdn.heroeswm.ru/i/f/r${factionId}.png?v=1.1`;
        if (i > 0 && i % 6 == 0) {
            parent.insertAdjacentHTML(`beforeend`, `<div style="flex-basis: 100%;"></div>`);
        }
        parent.insertAdjacentHTML(`beforeend`, `<a href="" onclick="return false;"><div id="change_class_${id}" hint="${factionTitle}" hwm_hint_added="1"><img src="${imgUrl}" alt="${factionTitle}" title="${factionTitle}" border="0"><font size="2">${title}</font></div></a>`);
        var elem = document.querySelector(`#change_class_${id}`);
        elem.onclick = async function(){
            if (edit_mode) {
                selected_id = id;
                setEditForm(title, factionId, buildId, setId, inventoryId);
            } else {
                getPage(factionUrl);
                getPage(`${window.location.origin}/inventory.php?all_on=${inventoryId}&rand=541812.5054737852`);
                getPage(skillwheelUrl);
                await postRequest(`${window.location.origin}/army_apply.php`, `action=load_set&sign=${sign}&set_id=${setId}`);
                window.location.reload();
            }
        };
    }
    function saveSet(id, title, factionid, inventoryId, buildId, setId) {
        var found = false;
        for (var i = 0; i < buildsObject.builds.length; i++) {
            var build = buildsObject.builds[i];
            if (build.id == id) {
                build.title = title;
                build.faction_id = factionid;
                build.arts_id = inventoryId;
                build.perks_id = buildId;
                build.army_id = setId;
                found = true;
                break;
            }
        }
        if (!found) {
            buildsObject.builds.push({"id": id, "title": title, "faction_id": factionid, "perks_id": buildId, "army_id": setId, "arts_id": inventoryId});
        }
        GM_setValue(CookieName, JSON.stringify(buildsObject));
        window.location.reload();
    }
    function deleteSet(id) {
          //console.log('before', buildsObject);
        for (var i = 0; i < buildsObject.builds.length; i++) {
            if (buildsObject.builds[i].id == id) {
                    //console.log('found id', id);
                buildsObject.builds.splice(i, 1);
                break;
            }
        }
          //console.log('after', buildsObject);
        GM_setValue(CookieName, JSON.stringify(buildsObject));
        window.location.reload();
    }
    function addEditButton(parent, editDiv) {
        let buttonHTML = `<a href="" onclick="return false;"><img id="edit_builds" src="https://dcdn.heroeswm.ru/i/b_edit.png" border="0" alt="edit_builds" title="Редактировать" style="width: 20px; height: 20px;"></a>`;
        parent.insertAdjacentHTML(`beforeend`, buttonHTML);

        let editRowTitleHTML = `<input type="text" id="edit_name" placeholder="Название" maxlength="5" style="width:100px;">`;
        let editRowFactionHTML = `
      <select id="edit_faction_id">
        <option selected value="1">Рыц</option>
        <option value="101">РС</option>
        <option value="2">Некр</option>
        <option value="102">НПС</option>
        <option value="3">Маг</option>
        <option value="103">МР</option>
        <option value="4">СЭ</option>
        <option value="104">ЭЗ</option>
        <option value="5">Вар</option>
        <option value="105">ВК</option>
        <option value="205">ВШ</option>
        <option value="6">ТЭ</option>
        <option value="106">ТЭУ</option>
        <option value="7">КД</option>
        <option value="107">ДТ</option>
        <option value="8">ГН</option>
        <option value="108">ГО</option>
        <option value="9">СВ</option>
        <option value="109">СВЯ</option>
        <option value="10">Фара</option>
      </select>`;
        let editRowBuildIdHTML = `<br><label for="edit_build_id">   ID набора навыков:</label> <input type="number" id="edit_build_id" value="1" min="1" max="20" style="width: 50px;">`;
        let editRowArmySetIdHTML = `<br><label for="edit_army_id">ID набора армии:</label> <input type="number" id="edit_army_id" value="1" min="1" max="7" style="width: 50px;">`;
        let editRowArtsSetIdHTML = `<br><label for="edit_art_id">ID набора артов:</label> <input type="number" id="edit_art_id" value="1" min="1" max="10" style="width: 50px; margin-bottom: 10px;">`;
        let saveButtonHTML = `<br><input type="button" id="edit_save" value="Обновить">`;
        let deleteButtonHTML = `<input type="button" id="edit_delete" value="Удалить">`;
        let newButtonHTML = `<input type="button" id="edit_new" value="Создать">`;
        let resultHTML = editRowFactionHTML + editRowTitleHTML + editRowBuildIdHTML + editRowArmySetIdHTML + editRowArtsSetIdHTML + saveButtonHTML + deleteButtonHTML + newButtonHTML;
        editDiv.insertAdjacentHTML(`beforeend`, resultHTML);
        let saveButton = document.querySelector(`#edit_save`);
        saveButton.disabled = true;
        saveButton.onclick = function(){
            edit_mode = false;
            editDiv.style = 'display: none;';
            saveSet(
                selected_id,
                document.querySelector(`#edit_name`).value,
                document.querySelector(`#edit_faction_id`).value,
                document.querySelector(`#edit_art_id`).value,
                document.querySelector(`#edit_build_id`).value,
                document.querySelector(`#edit_army_id`).value,
            );
        };

        let editBuilds = document.querySelector(`#edit_builds`);
        editBuilds.onclick = function(){
            if (!edit_mode) {
                edit_mode = true;
                editDiv.style = 'display: block; margin-top: 20px;';
            } else {
                edit_mode = false;
                editDiv.style = 'display: none;';
            }
        };

        let newBuilds = document.querySelector(`#edit_new`);
        newBuilds.onclick = function(){
            saveSet(
                crypto.randomUUID(),
                document.querySelector(`#edit_name`).value,
                document.querySelector(`#edit_faction_id`).value,
                document.querySelector(`#edit_art_id`).value,
                document.querySelector(`#edit_build_id`).value,
                document.querySelector(`#edit_army_id`).value,
            );
        };

        let delButton = document.querySelector(`#edit_delete`);
        delButton.disabled = true;
        delButton.onclick = function(){
            deleteSet(
                selected_id,
            );
        };
    }
    function setEditForm(title, factionId, buildId, setId, inventoryId) {
        document.querySelector(`#edit_name`).value = title;
        document.querySelector(`#edit_faction_id`).value = factionId;
        document.querySelector(`#edit_build_id`).value = buildId;
        document.querySelector(`#edit_army_id`).value = setId;
        document.querySelector(`#edit_art_id`).value = inventoryId;
        document.querySelector(`#edit_save`).disabled = false;
        document.querySelector(`#edit_delete`).disabled = false;
    }
    function getPage(aURL) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', aURL, false);
        xhr.overrideMimeType('text/html; charset=windows-1251');
        xhr.send();
        if (xhr.status != 200) {
            console.log(`getPage error ${xhr.status}: ${xhr.statusText}`);
            return null;
        }
        return ( xhr.responseText );
    }
    function postRequest(url, data) {
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({ method: "POST", url: url, headers: { "Content-Type": "application/x-www-form-urlencoded" }, data: data,
                               onload: function(response) { resolve(response); },
                               onerror: function(error) { reject(error); }
                              });
        });
    }
})();