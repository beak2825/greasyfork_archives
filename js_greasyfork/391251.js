// ==UserScript==
// @name         Units counter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @match        https://*.plemiona.pl/*screen=place&mode=units*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391251/Units%20counter.user.js
// @updateURL https://update.greasyfork.org/scripts/391251/Units%20counter.meta.js
// ==/UserScript==

(function() {
    setupCss();
    generateUI();
    $( document ).ready(function() {
        var unitTable = countUnits();
        fillSummary(unitTable);
    });

})();

function countUnits(){
    var unitTable = {
        spear: 0,
        sword: 0,
        axe: 0,
        archer: 0,
        spy: 0,
        light: 0,
        marcher: 0,
        heavy:0,
        ram: 0,
        catapult: 0,
        knight: 0,
        snob: 0,
        militia: 0
    };
    var workTable = $("#units_home")[0];
    var headCells = workTable.rows[0].cells;
    var valuesCells = workTable.rows[1].cells;
    for(var i=0;i<headCells.length;i++){
        if(headCells[i].childElementCount > 0){
            var dataUnitAttr = headCells[i].children[0].attributes["data-unit"];
            if(dataUnitAttr != undefined){
                unitTable[dataUnitAttr.value] += parseInt(valuesCells[i].innerText);
            }
        }
    }
    workTable = $("#units_transit")[0];
    if(workTable != undefined){
        headCells = workTable.rows[0].cells;
        for(var y=1;y<workTable.rows.length;y++){
            valuesCells = workTable.rows[y].cells;
            for(var x=0;x<headCells.length;x++){
                if(headCells[x].childElementCount > 0){
                    dataUnitAttr = headCells[x].children[0].attributes["data-unit"];
                    if(dataUnitAttr != undefined){
                        unitTable[dataUnitAttr.value] += parseInt(valuesCells[x].innerText);
                    }
                }
            }
        }
    }
    return unitTable;
}

function fillSummary(table){
    var summaryTable = $("#custom_summary table")[0];
    var headCells = summaryTable.rows[0].cells;
    var valuesCells = summaryTable.rows[1].cells;
    for(var i=0;i<headCells.length;i++){
        if(headCells[i].childElementCount > 0){
            var dataUnitAttr = headCells[i].children[0].attributes["data-unit"];
            if(dataUnitAttr != undefined){
                valuesCells[i].innerText = table[dataUnitAttr.value];
                if(table[dataUnitAttr.value]>0){
                    valuesCells[i].classList.remove("hidden");
                }
            }
        }
    }
}

function setupCss(){
    document.head.innerHTML += "\
<style>\n\
#custom_summary{\n\
    padding:10px;\n\
}\n\
#custom_summary th{\n\
    padding: 2px 3px;\n\
}\n\
#custom_summary td{\n\
    padding: 2px 3px;\n\
}\n\
#custom_summary table{\n\
    border-spacing: 2px;\n\
    -webkit-border-horizontal-spacing: 2px;\n\
    -webkit-border-vertical-spacing: 2px;\n\
    border-collapse: separate;\n\
    empty-cells: show !important;\n\
}\n\
</style>"
}

function generateUI(){
    var newRow = $("table.main")[0].insertRow(0);
    var cell = newRow.insertCell(0);
    cell.id = "custom_summary";
    cell.innerHTML = '\
<h3>Podsumowanie wojsk</h3>\
<form action="/game.php?village=44176&amp;screen=place&amp;mode=units&amp;action=command_other&amp;display=units" method="post">\
<table class="vis" width="100%">\
    <tr>\
        <th></th>\
        <th width="320">Podsumowanie</th>\
        <th><img src="https://dspl.innogamescdn.com/asset/6f680fef/graphic/rechts.png" class=""></th>\
        <th style="text-align:center" width="70"><a href="#" class="unit_link" data-unit="spear"><img src="https://dspl.innogamescdn.com/asset/6f680fef/graphic/unit/unit_spear.png" title="Pikinier" alt="" class=""></a></th>\
        <th style="text-align:center" width="70"><a href="#" class="unit_link" data-unit="sword"><img src="https://dspl.innogamescdn.com/asset/6f680fef/graphic/unit/unit_sword.png" title="Miecznik" alt="" class=""></a></th>\
        <th style="text-align:center" width="70"><a href="#" class="unit_link" data-unit="axe"><img src="https://dspl.innogamescdn.com/asset/6f680fef/graphic/unit/unit_axe.png" title="Topornik" alt="" class=""></a></th>\
        <th style="text-align:center" width="70"><a href="#" class="unit_link" data-unit="archer"><img src="https://dspl.innogamescdn.com/asset/6f680fef/graphic/unit/unit_archer.png" title="Łucznik" alt="" class=""></a></th>\
        <th style="text-align:center" width="70"><a href="#" class="unit_link" data-unit="spy"><img src="https://dspl.innogamescdn.com/asset/6f680fef/graphic/unit/unit_spy.png" title="Zwiadowca" alt="" class=""></a></th>\
        <th style="text-align:center" width="70"><a href="#" class="unit_link" data-unit="light"><img src="https://dspl.innogamescdn.com/asset/6f680fef/graphic/unit/unit_light.png" title="Lekki kawalerzysta" alt="" class=""></a></th>\
        <th style="text-align:center" width="70"><a href="#" class="unit_link" data-unit="marcher"><img src="https://dspl.innogamescdn.com/asset/6f680fef/graphic/unit/unit_marcher.png" title="Łucznik na koniu" alt="" class=""></a></th>\
        <th style="text-align:center" width="70"><a href="#" class="unit_link" data-unit="heavy"><img src="https://dspl.innogamescdn.com/asset/6f680fef/graphic/unit/unit_heavy.png" title="Ciężki kawalerzysta" alt="" class=""></a></th>\
        <th style="text-align:center" width="70"><a href="#" class="unit_link" data-unit="ram"><img src="https://dspl.innogamescdn.com/asset/6f680fef/graphic/unit/unit_ram.png" title="Taran" alt="" class=""></a></th>\
        <th style="text-align:center" width="70"><a href="#" class="unit_link" data-unit="catapult"><img src="https://dspl.innogamescdn.com/asset/6f680fef/graphic/unit/unit_catapult.png" title="Katapulta" alt="" class=""></a></th>\
        <th style="text-align:center" width="70"><a href="#" class="unit_link" data-unit="knight"><img src="https://dspl.innogamescdn.com/asset/6f680fef/graphic/unit/unit_knight.png" title="Rycerz" alt="" class=""></a></th>\
        <th style="text-align:center" width="70"><a href="#" class="unit_link" data-unit="snob"><img src="https://dspl.innogamescdn.com/asset/6f680fef/graphic/unit/unit_snob.png" title="Szlachcic" alt="" class=""></a></th>\
        <th style="text-align:center" width="70"><a href="#" class="unit_link" data-unit="militia"><img src="https://dspl.innogamescdn.com/asset/6f680fef/graphic/unit/unit_militia.png" title="Chłop" alt="" class=""></a></th>\
    </tr>\
    <tr>\
        <td></td>\
        <td>Wszystkie:</td>\
        <td class="center">-</td>\
        <td style="text-align:center" class="unit-item unit-item-spear hidden">0</td>\
        <td style="text-align:center" class="unit-item unit-item-sword hidden">0</td>\
        <td style="text-align:center" class="unit-item unit-item-axe hidden">0</td>\
        <td style="text-align:center" class="unit-item unit-item-archer hidden">0</td>\
        <td style="text-align:center" class="unit-item unit-item-spy hidden">0</td>\
        <td style="text-align:center" class="unit-item unit-item-light hidden">0</td>\
        <td style="text-align:center" class="unit-item unit-item-marcher hidden">0</td>\
        <td style="text-align:center" class="unit-item unit-item-heavy hidden">0</td>\
        <td style="text-align:center" class="unit-item unit-item-ram hidden">0</td>\
        <td style="text-align:center" class="unit-item unit-item-catapult hidden">0</td>\
        <td style="text-align:center" class="unit-item unit-item-knight hidden">0</td>\
        <td style="text-align:center" class="unit-item unit-item-snob hidden">0</td>\
        <td style="text-align:center" class="unit-item unit-item-militia hidden">0</td>\
    </tr>\
    <tr>\
        <th colspan="100%" height="10px"></th>\
</table>\
<input type="hidden" name="h" value="4026ad7d">\
</form>'
}





