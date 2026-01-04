// ==UserScript==
// @name           Hide GL updates
// @author         _Vesbat_
// @namespace      _Vesbat_
// @description    Позволяет скрыть существ для обмена на странице Гильдии Лидеров
// @version        0.07
// @include        https://www.heroeswm.ru/leader_army_exchange.php*
// @include        https://www.lordswm.com/leader_army_exchange.php*
// @grant          GM_deleteValue
// @grant          GM_getValue
// @grant          GM_setValue
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/532546/Hide%20GL%20updates.user.js
// @updateURL https://update.greasyfork.org/scripts/532546/Hide%20GL%20updates.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function isCellAvailableForExchange(cell){
        const elements = cell.getElementsByTagName('*');
        var result = false;
        var id = "";
        var isFirstRow = false;

        if (cell.textContent === "Суммарное лидерство" || cell.textContent === "Total leadership"){
            isFirstRow = true;
        }

        for (let i = 0; i < elements.length; i++) {
            const el = elements[i];
            if (el.value){
                id = id + el.value;
            }
            if (el.value && (el.value.includes("Обменять") || el.value.includes("Exchange"))) {
                result = true;
                break;
            }
        }

        return {
            result: result,
            id: id,
            isFirstRow: isFirstRow
        }
    }

    function isRowAvailableForExchange(row){
        console.log("!!! START")
        var result = false;
        var isFirstRow = false;
        var id = "";
        var cells = row.querySelectorAll('td');
        for (let i = 0; i < cells.length; i++){
            const cell = cells[i];
            id = id + cell.textContent
            const res = isCellAvailableForExchange(cell);
            if (res.result) {
                result = true
                id = id + res.id
            }
            isFirstRow = isFirstRow || res.isFirstRow
        }
        return {
            result: result,
            id: id,
            isFirstRow: isFirstRow
        }
    }

    function addUpdateForHideList(updateId){
        const rowsForHideOld = GM_getValue("rows_for_hide")
        rowsForHideOld.push(updateId);
        GM_setValue("rows_for_hide", rowsForHideOld);
    }

    var rowsForHideRaw = GM_getValue("rows_for_hide");

    if (rowsForHideRaw === undefined){
        console.log("rowsForHideRaw is undefined");
        GM_setValue("rows_for_hide", []);
        rowsForHideRaw = [];
    }

    var rows = document.querySelectorAll('table tr');
    var isBeforeFirstRow = true;
    rows.forEach(function(row) {
        const rowAvailableForExchange = isRowAvailableForExchange(row)
        const id = rowAvailableForExchange.id

        if (rowsForHideRaw.includes(id)){
            row.style.display = 'none';
        } else if (rowAvailableForExchange.result){
            row.innerHTML += `<td class=wb align=center width=50 id="${id}"><img width="20" height="20" src="https://photo.heroeswm.ru/photo-catalog/0001802/997-4317920ft.png" title = "Hide" style="vertical-align: middle; cursor: pointer;"></td>`;
            const textElement = document.getElementById(id);
            textElement.addEventListener('click', function() {
                addUpdateForHideList(id);
                row.style.display = 'none';
            });

        } else if (rowAvailableForExchange.isFirstRow) {
            isBeforeFirstRow = false;
            row.innerHTML += `<td class=wb align=center width=50 height=24 id="unhide_all_updates"><img width="24" height="16" src="https://photo.heroeswm.ru/photo-catalog/0001802/998-9acec89bt.png" title="Unhide all" style="vertical-align: middle; cursor: pointer"></td>`;
            const textElement = document.getElementById("unhide_all_updates");
            textElement.addEventListener('click', function() {
                GM_deleteValue("rows_for_hide");
                window.location.reload();
            });
            if (rowsForHideRaw.length>0) {
                textElement.style.display = 'visible';
            }
            else{
                textElement.style.display = 'none';
            }
        } else if (isBeforeFirstRow == false) {
            row.innerHTML += '<td class=wb align=center width=50></td>';
        }
    });


})();