// ==UserScript==
// @name         Webgame - Infiltrace
// @version      2024-2-11
// @description  Infiltrace, modifikace
// @author       yS
// @match        *://*.webgame.cz/wg/index.php?p=rozvedka&s=viewspye*
// @match        *://webgame.cz/wg/index.php?p=rozvedka&s=viewspye*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=webgame.cz
// @grant        none
// @namespace https://greasyfork.org/users/1005892
// @downloadURL https://update.greasyfork.org/scripts/457657/Webgame%20-%20Infiltrace.user.js
// @updateURL https://update.greasyfork.org/scripts/457657/Webgame%20-%20Infiltrace.meta.js
// ==/UserScript==

const DATA_SEPARATOR = "<br>";


modifyTable();





function modifyTable() {
    let table_summary = document.getElementById("spy-message-summary");
    let info_type = getInfoType(table_summary);
    if (info_type == null) {
        console.log("Nezměněný typ infiltrace");
        return;
    }

    let table_detail = document.getElementById("spy-message-detail");

    let prestiz = getPrestiz(table_summary);
    let header_row = table_detail.children[0].children[0];
    let data_row = table_detail.children[0].children[1];

    addColumnInfo(header_row, data_row, prestiz, info_type);
    if (info_type == 0) { // vlada
        addArmyData(data_row);
    }
}

function getInfoType(table_summary) {
    let text = table_summary.querySelector(".r").innerText;
    text = text.split("infiltrovat");
    if (text.length < 1) {
        return null;
    }

    text = text[1].split("\n");
    if (text.length < 1) {
        return null;
    }

    text = text[0].trim();

    if (text == "vládu") {
        return 0;
    }

    if (text == "generální štáb") {
        return 1;
    }

    return null;
}

function getPrestiz(table_summary) {
    let column = table_summary.rows[0].children[1];
    let index = 12;
    let prestiz, text;
    let pruchodu = 50;
    do {
        pruchodu--;
        text = column.childNodes[index++];
        if (text.nodeName != '#text') {
            continue;
        }
        prestiz = parseInt(text.textContent);
    } while ((isNaN(prestiz) || prestiz < 40000) && pruchodu > 0);
    return prestiz;
}

function addHeaderColumn(row, column_name) {
    let header = document.createElement("th");
    header.innerHTML = column_name;
    header.colSpan = 2;
    row.appendChild(header);
}

function createColumn(class_name_1, class_name_2, text) {
    let column = document.createElement("td");
    column.innerHTML = text;
    column.classList.add(class_name_1);
    column.classList.add(class_name_2);
    return column;
}

function addColumnInfo(header_row, data_row, prestiz, info_type) {
    addHeaderColumn(header_row, "Přehled");

    let left_column_content = "";
    let right_column_content = "";

    let format = new Intl.NumberFormat();

    // ARMADA ZACATEK
    let army_data = data_row.children[1].innerHTML.split(DATA_SEPARATOR);
    let prestiz_per_unit = [1, 5, 3.5, 3.5, 2.7];
    let army_prestiz = 0;
    let mechy_podil = 0;
    for (let i = 0; i < 5; i++) {
        army_prestiz = army_prestiz + parseInt(army_data[i]) * prestiz_per_unit[i];
        if (i == 4) {
            mechy_podil = parseInt(army_data[i]) * prestiz_per_unit[i];
        }
    }
    left_column_content = left_column_content + "Armáda prestiž" + DATA_SEPARATOR + "Podíl prestiže" + DATA_SEPARATOR + DATA_SEPARATOR;
    right_column_content = right_column_content + format.format(Math.round(army_prestiz)) + DATA_SEPARATOR + (Math.round(army_prestiz / prestiz * 1000) / 10) + "%" + DATA_SEPARATOR + DATA_SEPARATOR;
    // ARMADA KONEC

    // MECHY % ZACATEK
    left_column_content = left_column_content + "Mechy %" + DATA_SEPARATOR + DATA_SEPARATOR;
    right_column_content = right_column_content + Math.round(mechy_podil / army_prestiz * 1000) / 10 + "%" + DATA_SEPARATOR + DATA_SEPARATOR;
    // MECHY % KONEC

    if (info_type == 0) {
        let uzemi_data = processUzemiInfo(data_row, army_data, left_column_content, right_column_content, format, prestiz);
        left_column_content = uzemi_data[0];
        right_column_content = uzemi_data[1];
        let uzemi_prestiz = uzemi_data[2];
        let uzemi = uzemi_data[3];

        let techy_data = processTechy(data_row, left_column_content, right_column_content, format, prestiz);
        left_column_content = techy_data[0];
        right_column_content = techy_data[1];
        let technologie_count = techy_data[2];
        let ukrast_na_operaci = techy_data[3];

        // MRTVA PRESTIZ ZACATEK
        let mrtva_prestiz = 0;
        mrtva_prestiz = prestiz - army_prestiz - uzemi_prestiz - technologie_count;
        left_column_content = left_column_content + "Mrtvá prestiž" + DATA_SEPARATOR + "Procent" + DATA_SEPARATOR + DATA_SEPARATOR;
        right_column_content = right_column_content + format.format(Math.round(mrtva_prestiz)) + DATA_SEPARATOR + (Math.round(mrtva_prestiz / prestiz * 1000) / 10) + "%" + DATA_SEPARATOR + DATA_SEPARATOR;

        let rozvedka_prestiz = (uzemi + 2000) / 4 * 15;
        left_column_content = left_column_content + "Na R kartičku" + DATA_SEPARATOR + DATA_SEPARATOR;
        right_column_content = right_column_content + format.format(Math.round(rozvedka_prestiz)) + DATA_SEPARATOR + DATA_SEPARATOR;
        // MRTVA PRESTIZ KONEC

        // KRADEZ TECHU ZACATEK
        left_column_content = left_column_content + "Techy krádež" + DATA_SEPARATOR;
        right_column_content = right_column_content + format.format(Math.floor(ukrast_na_operaci)) + DATA_SEPARATOR;
        // KRADEZ TECHU KONEC
    }



    let column = createColumn("rname", "l", left_column_content);
    data_row.appendChild(column);
    column = createColumn("rdata", "r", right_column_content);
    data_row.appendChild(column);
}

/**
 * @param data_row
 * @param army_data
 * @param left_column_content
 * @param right_column_content
 * @param format
 * @param prestiz
 *
 * @return array [left_column_content, right_column_content, uzemi_prestiz, uzemi]
 */
function processUzemiInfo(data_row, army_data, left_column_content, right_column_content, format, prestiz) {
    let budovy_data = data_row.children[3].innerHTML.split(DATA_SEPARATOR);
    let uzemi = parseInt(army_data[9]);
    let uzemi_prestiz = uzemi * 15;
    uzemi_prestiz = uzemi_prestiz + (uzemi - parseInt(budovy_data[11]) - parseInt(budovy_data[12])) * 5; // budovy
    uzemi_prestiz = uzemi_prestiz + parseInt(budovy_data[12]) * 2; // ruiny

    left_column_content = left_column_content + "Území" + DATA_SEPARATOR + "Procent" + DATA_SEPARATOR + DATA_SEPARATOR;
    right_column_content = right_column_content + format.format(uzemi_prestiz) + DATA_SEPARATOR + (Math.round(uzemi_prestiz / prestiz * 1000) / 10) + "%" + DATA_SEPARATOR + DATA_SEPARATOR;

    return [left_column_content, right_column_content, uzemi_prestiz, uzemi];
}

/**
 * @param data_row
 * @param left_column_content
 * @param right_column_content
 * @param format
 * @param prestiz
 *
 * @return array [left_column_content, right_column_content, technologie_count, ukrast_na_operaci]
 */
function processTechy(data_row, left_column_content, right_column_content, format, prestiz) {
    let technologie_data = data_row.children[5].innerHTML.split(DATA_SEPARATOR);
    let technologie_count = 0;
    let pokryto_techu = 2 * parseInt(technologie_data[10]);
    let ukrast_na_operaci = 0;
    for (let i = 0; i < technologie_data.length; i++) {
        let technologie = parseInt(technologie_data[i]);
        technologie_count = technologie_count + technologie;
        if (technologie > pokryto_techu) {
            ukrast_na_operaci = ukrast_na_operaci + (technologie - pokryto_techu) * 0.05 + pokryto_techu * 0.002;
        } else {
            ukrast_na_operaci = ukrast_na_operaci + technologie * 0.002;
        }
    }
    left_column_content = left_column_content + "Technologie" + DATA_SEPARATOR + "Procent" + DATA_SEPARATOR + DATA_SEPARATOR;
    right_column_content = right_column_content + format.format(technologie_count) + DATA_SEPARATOR + (Math.round(technologie_count / prestiz * 1000) / 10) + "%" + DATA_SEPARATOR + DATA_SEPARATOR;

    return [left_column_content, right_column_content, technologie_count, ukrast_na_operaci];
}

function addArmyData(data_row) {
    let format = new Intl.NumberFormat();

    // ARMADA ZACATEK
    let army_data = data_row.children[1].innerHTML.split(DATA_SEPARATOR);
    let utok_per_unit = [1, 6, 6, 0, 2];
    let obrana_per_unit = [1, 4, 0, 6, 3];
    let utok_total = 0,
        obrana_total = 0;

    for (let i = 0; i < 5; i++) {
        utok_total = utok_total + parseInt(army_data[i]) * utok_per_unit[i];
        obrana_total = obrana_total + parseInt(army_data[i]) * obrana_per_unit[i];
    }
    // ARMADA KONEC

    data_row.children[0].innerHTML += DATA_SEPARATOR + DATA_SEPARATOR + "<b>Armáda</b>" + DATA_SEPARATOR + "U základ" + DATA_SEPARATOR + "O základ";
    data_row.children[1].innerHTML += DATA_SEPARATOR + DATA_SEPARATOR + DATA_SEPARATOR + format.format(utok_total) + DATA_SEPARATOR + format.format(obrana_total);
}