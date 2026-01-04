// ==UserScript==
// @name         Clan Warehouse Management UI Tweaks
// @namespace    nexterot
// @homepage     https://greasyfork.org/ru/scripts/490126-clan-warehouse-management-ui-tweaks
// @version      2.1.4
// @license      none
// @description  Маленькие улучшения интерфейса клан склада
// @author       nexterot
// @match        https://www.heroeswm.ru/sklad_info.php?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heroeswm.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490126/Clan%20Warehouse%20Management%20UI%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/490126/Clan%20Warehouse%20Management%20UI%20Tweaks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var LOGGING_ENABLED = 0;

    const ColorHighlightRow = '#eeeeee';
    const ColorArtBroken = '#aaeeee';
    const ColorSetBroken = '#eceda8';

    var artsInfo = {};
    artsInfo['Меч холода'] = [350, 57];
    artsInfo['Меч солнца'] = [350, 57];
    artsInfo['Посох солнца'] = [350, 57];
    artsInfo['Кинжал солнца'] = [280, 42];
    artsInfo['Щит холода'] = [250, 51];
    artsInfo['Лук солнца'] = [240, 48];
    artsInfo['Плащ солнца'] = [260, 44];
    artsInfo['Шлем солнца'] = [210, 43];
    artsInfo['Шлем ветра'] = [210, 43];
    artsInfo['Доспех солнца'] = [240, 48];
    artsInfo['Амулет холода'] = [280, 45];
    artsInfo['Клевер фортуны'] = [300, 43];
    artsInfo['Сапоги солнца'] = [220, 47];
    artsInfo['Сапоги ветра'] = [220, 47];
    artsInfo['Кольцо солнца'] = [215, 35];
    artsInfo['Кольцо холода'] = [225, 33];
    artsInfo['Доспех ветра'] = [240, 48];
    artsInfo['Зеркало перемен'] = [640, 29];
    artsInfo['2 кольца солнца'] = [430, 35];
    artsInfo['2 кольца холода'] = [450, 33];

    setTimeout(main, 300);

    function main() {
        var disableButton = document.querySelector("body > center > table > tbody > tr > td > table:nth-child(1) > tbody > tr:nth-child(1) > td:nth-child(3)")
        if (disableButton == null) {
            disableButton = document.querySelector("#android_container > table:nth-child(1) > tbody > tr:nth-child(1) > td:nth-child(3)");
        }
        if (disableButton && disableButton.innerHTML.includes('online.gif')) {
            disableButton.innerHTML = '^^';
        }

        var editModeButton = document.querySelector("body > center > table > tbody > tr > td > table:nth-child(1) > tbody > tr:nth-child(1) > td:nth-child(4) > a > img");
        if (editModeButton == null) {
            editModeButton = document.querySelector("#android_container > table:nth-child(1) > tbody > tr:nth-child(1) > td:nth-child(4) > a > img");
        }
        if (editModeButton && editModeButton.style) {
            editModeButton.style.height
                = editModeButton.style.width
                = '20px';
        }

        if (get('cat') == '5') {
            var table = getTable();
            if (table == null) return;

            var rowbyArt = {};

            var makeSetsButton = document.querySelector("body > center > table > tbody > tr > td > table:nth-child(5) > tbody > tr > td > table > tbody > tr:nth-child(7) > td > input[type=submit]")
            ?? document.querySelector("#android_container > table:nth-child(5) > tbody > tr > td > table > tbody > tr:nth-child(9) > td > input[type=submit]");

            for (var i = 1; i < table.rows.length; i++) {
                var row = table.rows[i];
                if (i % 2 == 0) {
                    row.style.background = ColorHighlightRow;
                }

                if (row.innerHTML.includes('Сделать комплектом')) {
                    for (let [key, list] of Object.entries(rowbyArt)) {
                        if (list.length >= 2) {
                            var autoBuildButton = row.cells[0].appendChild(document.createElement('input'));
                            autoBuildButton.id = "auto_build";
                            autoBuildButton.type="button"
                            autoBuildButton.value="Автосборка";
                            autoBuildButton.addEventListener("click", e => {
                                var row1 = list[0];
                                var row2 = list[1];
                                var input1 = row1.querySelector("input");
                                input1.click();
                                var input2 = row2.querySelector("input");
                                input2.click();

                                row.firstChild.firstChild.click();
                            });
                            break;
                            //console.log(key, row1, row2);
                        }
                    }
                    continue;
                }

                var columnId = 2;
                var isSet = false;
                if (row.innerHTML.includes('Разобрать')) {
                    columnId = 1;
                    isSet = true;
                }

                var art_description = row.cells[columnId];
                if (art_description == null) {
                    log('no art_description');
                    continue;
                }

                var maxBattles = row.cells[columnId+1];
                if (maxBattles == null) {
                    log('no maxBattles');
                    continue;
                }

                var artName;
                var m = art_description.innerHTML.match(/'(.+)'/);
                if (m) {
                    artName = m[1];
                } else if (art_description.innerHTML.includes('sun_ring')) {
                    artName = '2 кольца солнца';
                } else if (art_description.innerHTML.includes('coldring_n')) {
                    artName = '2 кольца холода';
                } else {
                    log(art_description.innerHTML);
                    continue;
                }

                if (isSet) {
                    if (artsInfo[artName][1] && art_description.innerHTML.includes(`Прочность: 0/${artsInfo[artName][1]}`)) {
                        row.style.background = ColorArtBroken;
                    }
                    else if (art_description.innerHTML.includes('Прочность: 0/')) {
                        row.style.background = ColorSetBroken;
                    }
                }

                var elemToInsert = art_description;

                var rowSet = art_description.querySelector("td:nth-child(2) > table > tbody > tr");
                if (rowSet) {
                    var newCell = rowSet.insertCell(-1);
                    elemToInsert = newCell;
                }

                var ppb = row.cells[columnId+2];
                if (ppb == null) {
                    log('no price per battle');
                    continue;
                }
                var ppbInput = ppb.querySelector("input[type=text]");

                var accessLevel = row.cells[columnId+3];
                if (accessLevel == null) {
                    log('no accessLevel');
                    continue;
                }
                var accessLevelInput = accessLevel.querySelector("select");

                var do_not_repair = row.cells[columnId+4];
                if (do_not_repair == null) {
                    log('no do_not_repair');
                }
                var doNotRepairInput = do_not_repair.querySelector("select");


                var hasCheckBox = row.innerHTML.includes('type="checkbox"')
                if (hasCheckBox) {
                    var key = `${art_description.innerHTML}_${ppbInput.value}_${accessLevelInput.value}_${doNotRepairInput.value}`;
                    console.log(key);
                    if (!rowbyArt[key]) {
                        rowbyArt[key] = [];
                    }
                    rowbyArt[key].push(row);
                }

                var artInfo = artsInfo[artName];
                var autoCompleteButton = document.createElement('a');
                autoCompleteButton.innerHTML = artInfo ? 'АКЦ' : 'КБО';
                autoCompleteButton.style.fontWeight = "bold";
                autoCompleteButton.style.fontSize = "15px";
                autoCompleteButton.href = "javascript:void(0)";
                autoCompleteButton.addEventListener("click", autoComplete(ppbInput, accessLevelInput, doNotRepairInput, artInfo));
                var br = document.createElement('b');
                br.innerHTML = " ";
                elemToInsert.appendChild(br);
                elemToInsert.appendChild(autoCompleteButton);

                if (!row.innerHTML.includes('rep_limit')) {
                    continue;
                }

                var regexp_art_description = /' \[(\d+)\/(\d+)\]/
                var res = art_description.innerHTML.match(regexp_art_description);
                if (res && res[1] == '0') {
                    var num = res[2];
                    var regexp_do_not_repair = / selected="">0\/(\d+)<\/option>/;
                    res = do_not_repair.innerHTML.match(regexp_do_not_repair);
                    if (res) {
                        if (num == res[1]) {
                            row.style.background = ColorArtBroken;
                        }
                    }
                }
            }
        }
    }
    function autoComplete(ppbInput, accessLevelInput, doNotRepairInput, arr) {
        return function(event) {
            if (arr)
            {
                ppbInput.value = arr[0];
                if (arr[1] && doNotRepairInput) {
                    doNotRepairInput.value = arr[1];
                }
                accessLevelInput.value = '1';
            }
            else
            {
                ppbInput.value = 1;
                accessLevelInput.value = '8';
            }
        };
    }
    function get(name) {
        if(name = (new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search)) {
            return decodeURIComponent(name[1]);
        }
    }
    function getTable() {
        var table = document.querySelector("#android_container > table:nth-child(5) > tbody > tr > td > table");
        if (table != null) {
            return table;
        }
        table = document.querySelector("body > center > table > tbody > tr > td > table:nth-child(5) > tbody > tr > td > table");
        if (table != null) {
            return table;
        }
        console.log('Clan Warehouse Management UI Tweaks: unsupported platform');
        return null;
    }
    function log(obj) {
        if (LOGGING_ENABLED) {
            console.log(obj);
        }
    }
})();