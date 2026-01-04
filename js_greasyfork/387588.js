// ==UserScript==
// @name         Zbieractwo
// @description  lala
// @version      0.1
// @author       FancyDevs
// @include      https://*/game.php?village=*&screen=place&mode=*
// @namespace    https://fancydevsgeneral.github.io/
// @icon         https://vignette.wikia.nocookie.net/nonsensopedia/images/8/8d/Worek.png/revision/latest?cb=20130716095617
// @downloadURL https://update.greasyfork.org/scripts/387588/Zbieractwo.user.js
// @updateURL https://update.greasyfork.org/scripts/387588/Zbieractwo.meta.js
// ==/UserScript==



function scavenge() {

    //checking correct page
    const doc = document;
    if (window.frames.length > 0 && window.main != null) doc = window.main.document;

    //if (window.location.href.indexOf('screen=place&mode=scavenge') < 0) {
    //     window.location.assign(game_data.link_base_pure + "place&mode=scavenge");
    // }
    var lackadaisicalLooters = document.getElementsByClassName("title")[0].innerHTML;
    var humbleHaulers = document.getElementsByClassName("title")[1].innerHTML;
    var cleverCollectors = document.getElementsByClassName("title")[2].innerHTML;
    var greatGatherers = document.getElementsByClassName("title")[3].innerHTML;
    var scavengeInfo = JSON.parse($('html').find('script:contains("ScavengeScreen")').html().match(/\{.*\:\{.*\:.*\}\}/g)[0]);
    var duration_factor = scavengeInfo[1].duration_factor;
    var duration_exponent = scavengeInfo[1].duration_exponent;
    var duration_initial_seconds = scavengeInfo[1].duration_initial_seconds;
    //var loot_factor = scavengeInfo[1].loot_factor




    function setScavTime() {
        //check if duration is preset already
        if ("ScavengeTime" in sessionStorage) {
            hours = parseInt(sessionStorage.getItem("ScavengeTime"));

        } else {
            hours = 24;
        }
        sessionStorage.setItem("ScavengeTime", hours);


    }
    setScavTime();


    if ($('button').length == 0) {
        //create interface and button
        haulCategory = 0;
        sessionStorage.setItem("haulCategory", haulCategory);
        button = document.createElement("button");
        button.classList.add("btn-confirm-yes");
        button.innerHTML = "Adjust scavenge time";
        button.style.visibility = 'hidden';
        body = document.getElementById("scavenge_screen");
        body.prepend(button);

        scavDiv = document.createElement('div');
        //check if archer world or not, depending on outcome make table with or without archers
        if ($('.units-entry-all[data-unit=archer]').text() != "") {
            htmlString = '<div  class = center1 ID= scavTable >\
<table class="center1" width="30%" style="border: 7px solid rgba(121,0,0,0.71); border-image-slice: 7 7 7 7; border-image-source: url(https://dsen.innogamescdn.com/asset/cf2959e7/graphic/border/frame-gold-red.png);">\
<tbody>\
<tr>\
<th style="text-align:center" colspan="8">Wybierz jednostki na zbieractwo</th>\
</tr>\
<tr>\
<th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="spear"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_spear.png" title="Spear fighter" alt="" class=""></a></th>\
<th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="sword"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_sword.png" title="Swordsman" alt="" class=""></a></th>\
<th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="axe"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_axe.png" title="Axeman" alt="" class=""></a></th>\
<th style="text-align:center" width="35"><a href="#" cl ass="unit_link" data-unit="archer"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_archer.png" title="Archer" alt="" class=""></a></th>\
<th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="light"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_light.png" title="Light cavalry" alt="" class=""></a></th>\
<th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="marcher"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_marcher.png" title="Mounted Archer" alt="" class=""></a></th>\
<th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="heavy"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_heavy.png" title="Heavy cavalry" alt="" class=""></a></th>\
<th style="text-align:center" nowrap>Czas docelowy</th>\
</tr>\
<tr>\
<td align="center"><input type="checkbox" ID="spear" name="spear" checked = "checked" ></td>\
<td align="center"><input type="checkbox" ID="sword" name="sword" checked = "checked" ></td>\
<td align="center"><input type="checkbox" ID="axe" name="axe" checked = "checked" ></td>\
<td align="center"><input type="checkbox" ID="archer" name="archer" checked = "checked" ></td>\
<td align="center"><input type="checkbox" ID="light" name="light" checked = "checked" ></td>\
<td align="center"><input type="checkbox" ID="marcher" name="marcher" checked = "checked" ></td>\
<td align="center"><input type="checkbox" ID="heavy" name="heavy" checked = "checked" ></td>\
<td ID="runtime" align="center"><input type="text" ID="hours" name="hours" size="4" maxlength="2" align=left > hours</td>\
</tbody>\
</table>\
</br>\
</div>\
';
        } else {
            htmlString = '<div  class = center1 ID= scavTable>\
<table class="center1" width="30%" style="border: 7px solid rgba(121,0,0,0.71); border-image-slice: 7 7 7 7; border-image-source: url(https://dsen.innogamescdn.com/asset/cf2959e7/graphic/border/frame-gold-red.png);">\
<tbody>\
<tr>\
<th style="text-align:center" colspan="6">Wybierz jednostki na zbieractwo</th>\
</tr>\
<tr>\
<th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="spear"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_spear.png" title="Spear fighter" alt="" class=""></a></th>\
<th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="sword"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_sword.png" title="Swordsman" alt="" class=""></a></th>\
<th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="axe"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_axe.png" title="Axeman" alt="" class=""></a></th>\
<th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="light"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_light.png" title="Light cavalry" alt="" class=""></a></th>\
<th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="heavy"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_heavy.png" title="Heavy cavalry" alt="" class=""></a></th>\
<th style="text-align:center" nowrap>Czas docelowy</th>\
</tr>\
<tr>\
<td align="center"><input type="checkbox" ID="spear" name="spear"></td>\
<td align="center"><input type="checkbox" ID="sword" name="sword" ></td>\
<td align="center"><input type="checkbox" ID="axe" name="axe" ></td>\
<td align="center"><input type="checkbox" ID="light" name="light" ></td>\
<td align="center"><input type="checkbox" ID="heavy" name="heavy" ></td>\
<td ID="runtime" align="center"><input type="text" ID="hours" name="hours" size="4" maxlength="2" align=left > hours</td>\
</tbody>\
</table>\
</br>\
</div>\
';
        }
        scavDiv.innerHTML = htmlString;
        scavenge_screen.after(scavDiv.firstChild);
        document.getElementById("hours").value = hours;
        document.getElementById("hours").addEventListener("change", function () {
            hours = parseInt(document.getElementById("hours").value);
            sessionStorage.setItem("ScavengeTime", hours);
            haulCategory=0;
            sessionStorage.setItem("haulCategory", haulCategory);
            calculateHauls();
            clear();
            setScavTime();
            scavenge();
            document.getElementById("hours").focus();
        });
    }

    if ($(".scavengeTable")[0]) {
        document.getElementById("hours").value = hours;
    }

    checkboxValues = JSON.parse(localStorage.getItem('checkboxValues')) || {}, $checkboxes = $("#scavTable :checkbox");
    $checkboxes.on("change", function () {
        $checkboxes.each(function () {
            checkboxValues[this.id] = this.checked;
        });
        localStorage.setItem("checkboxValues", JSON.stringify(checkboxValues));
        calculateHauls();
        haulCategory = 0;
        sessionStorage.setItem("haulCategory", haulCategory);
        scavenge();
    });

    $.each(checkboxValues, function (key, value) {
        $("#" + key).prop('checked', value);
    });


    if ($(".scavengeTable").length) {
        spears = $('.units-entry-all[data-unit=spear]').text().match(/\((\d+)\)/)[1];
        swords = $('.units-entry-all[data-unit=sword]').text().match(/\((\d+)\)/)[1];
        axes = $('.units-entry-all[data-unit=axe]').text().match(/\((\d+)\)/)[1];
        lightC = $('.units-entry-all[data-unit=light]').text().match(/\((\d+)\)/)[1];
        heavyC = $('.units-entry-all[data-unit=heavy]').text().match(/\((\d+)\)/)[1];
        if ($('.units-entry-all[data-unit=archer]').text() != "") {
            archer = $('.units-entry-all[data-unit=archer]').text().match(/\((\d+)\)/)[1]
        } else archer = 0;

        if ($('.units-entry-all[data-unit=marcher]').text() != "") {
            marcher = $('.units-entry-all[data-unit=marcher]').text().match(/\((\d+)\)/)[1]
        } else marcher = 0;
        checkboxStatus();
    }
    else {
        spears = $('.units-entry-all[data-unit=spear]').text().match(/\((\d+)\)/)[1];
        swords = $('.units-entry-all[data-unit=sword]').text().match(/\((\d+)\)/)[1];
        axes = $('.units-entry-all[data-unit=axe]').text().match(/\((\d+)\)/)[1];
        lightC = $('.units-entry-all[data-unit=light]').text().match(/\((\d+)\)/)[1];
        heavyC = $('.units-entry-all[data-unit=heavy]').text().match(/\((\d+)\)/)[1];
        if ($('.units-entry-all[data-unit=archer]').text() != "") {
            archer = $('.units-entry-all[data-unit=archer]').text().match(/\((\d+)\)/)[1]
        } else archer = 0;

        if ($('.units-entry-all[data-unit=marcher]').text() != "") {
            marcher = $('.units-entry-all[data-unit=marcher]').text().match(/\((\d+)\)/)[1]
        } else marcher = 0;
    }

    function checkboxStatus() {
        if (document.getElementById("spear").checked == false) {
            spears = 0;
            haulcategory = 0;
        }
        if (document.getElementById("sword").checked == false) {
            swords = 0;
            haulcategory = 0;
        }
        if (document.getElementById("axe").checked == false) {
            axes = 0;
            haulcategory = 0;
        }
        if (document.getElementById("light").checked == false) {
            lightC = 0;
            haulcategory = 0;
        }
        if (document.getElementById("heavy").checked == false) {
            heavyC = 0;
            haulcategory = 0;
        }
        if ($('.units-entry-all[data-unit=archer]').text() != "") {
            if (document.getElementById("archer").checked == false) {
                archer = 0;
                haulcategory = 0;
            }
        }
        if ($('.units-entry-all[data-unit=marcher]').text() != "") {
            if (document.getElementById("marcher").checked == false) {
                marcher = 0;
                haulcategory = 0;
            }
        }

    }


    function calculateHauls() {

        checkboxStatus();

        totalLoot = spears * 25 + swords * 15 + axes * 10 + lightC * 80 + heavyC * 50 + archer * 10 + marcher * 50;
        totalSpSwLoot = spears * 25 + swords * 15;
        possibleLoot = spears * 25 + swords * 15 + axes * 10 + lightC * 80 + heavyC * 50 + archer * 10 + marcher * 50;
        spearRatio = spears / (spears * 25 + swords * 15);
        swordRatio = swords / (spears * 25 + swords * 15);

        time = hours * 3600;
        haul = ((time / duration_factor - duration_initial_seconds) ** (1 / (duration_exponent)) / 100) ** (1 / 2);
        haul1 = haul / 0.1;
        haul2 = haul / 0.25;
        haul3 = haul / 0.5;
        haul4 = haul / 0.75;
        totalHaul = haul1 + haul2 + haul3 + haul4;

    }
    calculateHauls();

    if ("haulCategory" in sessionStorage) {
        haulCategory = sessionStorage.getItem("haulCategory");
    } else {
        haulCategory = 0;
        sessionStorage.setItem("haulCategory", haulCategory);
    }


    if (totalLoot > totalHaul) {
        if (totalSpSwLoot > totalHaul) {
            if (haulCategory == 0) {
                haulCategory = 1;
                sessionStorage.setItem("haulCategory", haulCategory);
            }
        } else {
            if (haulCategory == 0) {
                haulCategory = 2;
                sessionStorage.setItem("haulCategory", haulCategory);
            }
        }
    } else {
        if (haulCategory == 0) {
            haulCategory = 3;
            sessionStorage.setItem("haulCategory", haulCategory);
        }
    }

    if (haulCategory == 1) {
        scavengeOptions = {};
        scavengeOptions[greatGatherers] = [
            {
                type: 'spear',
                count: (haul4 * spearRatio)
            },
            {
                type: 'sword',
                count: (haul4 * swordRatio)
            },
            {
                type: 'axe',
                count: 0
            },
            {
                type: 'archer',
                count: 0
            },
            {
                type: 'light',
                count: 0
            },
            {
                type: 'marcher',
                count: 0
            },
            {
                type: 'heavy',
                count: 0
            },
        ];
        scavengeOptions[cleverCollectors] = [
            {
                type: 'spear',
                count: (haul3 * spearRatio)
            },
            {
                type: 'sword',
                count: (haul3 * swordRatio)
            },
            {
                type: 'axe',
                count: 0
            },
            {
                type: 'archer',
                count: 0
            },
            {
                type: 'light',
                count: 0
            },
            {
                type: 'marcher',
                count: 0
            },
            {
                type: 'heavy',
                count: 0
            },
        ];
        scavengeOptions[humbleHaulers] = [
            {
                type: 'spear',
                count: (haul2 * spearRatio)
            },
            {
                type: 'sword',
                count: (haul2 * swordRatio)
            },
            {
                type: 'axe',
                count: 0
            },
            {
                type: 'archer',
                count: 0
            },
            {
                type: 'light',
                count: 0
            },
            {
                type: 'marcher',
                count: 0
            },
            {
                type: 'heavy',
                count: 0
            },
        ];
        scavengeOptions[lackadaisicalLooters] = [
            {
                type: 'spear',
                count: (haul1 * spearRatio)
            },
            {
                type: 'sword',
                count: (haul1 * swordRatio)
            },
            {
                type: 'axe',
                count: 0
            },
            {
                type: 'archer',
                count: 0
            },
            {
                type: 'light',
                count: 0
            },
            {
                type: 'marcher',
                count: 0
            },
            {
                type: 'heavy',
                count: 0
            },
        ];

    } else {
        if (haulCategory == 2) {
            scavengeOptions = {};
            scavengeOptions[greatGatherers] = [
                {
                    type: 'spear',
                    count: (haul4 * (spears / possibleLoot))
                },
                {
                    type: 'sword',
                    count: (haul4 * (swords / possibleLoot))
                },
                {
                    type: 'axe',
                    count: (haul4 * (axes / possibleLoot))
                },
                {
                    type: 'light',
                    count: (haul4 * (lightC / possibleLoot))
                },
                {
                    type: 'heavy',
                    count: (haul4 * (heavyC / possibleLoot))
                },
                {
                    type: 'archer',
                    count: (haul4 * (archer / possibleLoot))
                },
                {
                    type: 'marcher',
                    count: (haul4 * (marcher / possibleLoot))
                },
            ];
            scavengeOptions[cleverCollectors] = [
                {
                    type: 'spear',
                    count: (haul3 * (spears / possibleLoot))
                },
                {
                    type: 'sword',
                    count: (haul3 * (swords / possibleLoot))
                },
                {
                    type: 'axe',
                    count: (haul3 * (axes / possibleLoot))
                },
                {
                    type: 'light',
                    count: (haul3 * (lightC / possibleLoot))
                },
                {
                    type: 'heavy',
                    count: (haul3 * (heavyC / possibleLoot))
                },
                {
                    type: 'archer',
                    count: (haul3 * (archer / possibleLoot))
                },
                {
                    type: 'marcher',
                    count: (haul3 * (marcher / possibleLoot))
                },
            ];
            scavengeOptions[humbleHaulers] = [
                {
                    type: 'spear',
                    count: (haul2 * (spears / possibleLoot))
                },
                {
                    type: 'sword',
                    count: (haul2 * (swords / possibleLoot))
                },
                {
                    type: 'axe',
                    count: (haul2 * (axes / possibleLoot))
                },
                {
                    type: 'light',
                    count: (haul2 * (lightC / possibleLoot))
                },
                {
                    type: 'heavy',
                    count: (haul2 * (heavyC / possibleLoot))
                },
                {
                    type: 'archer',
                    count: (haul2 * (archer / possibleLoot))
                },
                {
                    type: 'marcher',
                    count: (haul2 * (marcher / possibleLoot))
                },
            ];
            scavengeOptions[lackadaisicalLooters] = [
                {
                    type: 'spear',
                    count: (haul1 * (spears / possibleLoot))
                },
                {
                    type: 'sword',
                    count: (haul1 * (swords / possibleLoot))
                },
                {
                    type: 'axe',
                    count: (haul1 * (axes / possibleLoot))
                },
                {
                    type: 'light',
                    count: (haul1 * (lightC / possibleLoot))
                },
                {
                    type: 'heavy',
                    count: (haul1 * (heavyC / possibleLoot))
                },
                {
                    type: 'archer',
                    count: (haul1 * (archer / possibleLoot))
                },
                {
                    type: 'marcher',
                    count: (haul1 * (marcher / possibleLoot))
                },
            ];
        } else {
            if (haulCategory == 3) {
                scavengeOptions = {};
                scavengeOptions[greatGatherers] = [
                    {
                        type: 'spear',
                        count: ((totalLoot / totalHaul * haul4) * (spears / possibleLoot))
                    },
                    {
                        type: 'sword',
                        count: ((totalLoot / totalHaul * haul4) * (swords / possibleLoot))
                    },
                    {
                        type: 'axe',
                        count: ((totalLoot / totalHaul * haul4) * (axes / possibleLoot))
                    },
                    {
                        type: 'light',
                        count: ((totalLoot / totalHaul * haul4) * (lightC / possibleLoot))
                    },
                    {
                        type: 'heavy',
                        count: ((totalLoot / totalHaul * haul4) * (heavyC / possibleLoot))
                    },
                    {
                        type: 'archer',
                        count: ((totalLoot / totalHaul * haul4) * (archer / possibleLoot))
                    },
                    {
                        type: 'marcher',
                        count: ((totalLoot / totalHaul * haul4) * (marcher / possibleLoot))
                    },
                ];
                scavengeOptions[cleverCollectors] = [
                    {
                        type: 'spear',
                        count: ((totalLoot / (totalHaul - haul4) * haul3) * (spears / possibleLoot))
                    },
                    {
                        type: 'sword',
                        count: ((totalLoot / (totalHaul - haul4) * haul3) * (swords / possibleLoot))
                    },
                    {
                        type: 'axe',
                        count: ((totalLoot / (totalHaul - haul4) * haul3) * (axes / possibleLoot))
                    },
                    {
                        type: 'light',
                        count: ((totalLoot / (totalHaul - haul4) * haul3) * (lightC / possibleLoot))
                    },
                    {
                        type: 'heavy',
                        count: ((totalLoot / (totalHaul - haul4) * haul3) * (heavyC / possibleLoot))
                    },
                    {
                        type: 'archer',
                        count: ((totalLoot / (totalHaul - haul4) * haul3) * (archer / possibleLoot))
                    },
                    {
                        type: 'marcher',
                        count: ((totalLoot / (totalHaul - haul4) * haul3) * (marcher / possibleLoot))
                    },
                ];
                scavengeOptions[humbleHaulers] = [
                    {
                        type: 'spear',
                        count: ((totalLoot / (totalHaul - haul4 - haul3) * haul2) * (spears / possibleLoot))
                    },
                    {
                        type: 'sword',
                        count: ((totalLoot / (totalHaul - haul4 - haul3) * haul2) * (swords / possibleLoot))
                    },
                    {
                        type: 'axe',
                        count: ((totalLoot / (totalHaul - haul4 - haul3) * haul2) * (axes / possibleLoot))
                    },
                    {
                        type: 'light',
                        count: ((totalLoot / (totalHaul - haul4 - haul3) * haul2) * (lightC / possibleLoot))
                    },
                    {
                        type: 'heavy',
                        count: ((totalLoot / (totalHaul - haul4 - haul3) * haul2) * (heavyC / possibleLoot))
                    },
                    {
                        type: 'archer',
                        count: ((totalLoot / (totalHaul - haul4 - haul3) * haul2) * (archer / possibleLoot))
                    },
                    {
                        type: 'marcher',
                        count: ((totalLoot / (totalHaul - haul4 - haul3) * haul2) * (marcher / possibleLoot))
                    },
                ];
                scavengeOptions[lackadaisicalLooters] = [
                    {
                        type: 'spear',
                        count: (totalLoot * (spears / possibleLoot))
                    },
                    {
                        type: 'sword',
                        count: (totalLoot * (swords / possibleLoot))
                    },
                    {
                        type: 'axe',
                        count: (totalLoot * (axes / possibleLoot))
                    },
                    {
                        type: 'light',
                        count: (totalLoot * (lightC / possibleLoot))
                    },
                    {
                        type: 'heavy',
                        count: (totalLoot * (heavyC / possibleLoot))
                    },
                    {
                        type: 'archer',
                        count: (totalLoot * (archer / possibleLoot))
                    },
                    {
                        type: 'marcher',
                        count: (totalLoot * (marcher / possibleLoot))
                    },
                ];
            }
        }
    }

    run();

    function run() {
        let btn = null;
        for (const option in scavengeOptions) {
            btn = findNextButton(option);

            if (btn) {
                fillInTroops(option, getAvailableUnits(), btn);
                break;
            }
        }
    }

    function clear() {
        let btn = null;
        for (const option in scavengeOptions) {
            btn = findNextButton(option);
            if (btn) {
                emptyTroops(option);
                break;
            }
        }
    }

    function fillInTroops(option, availableUnits, button) {
        scavengeOptions[option].forEach(units => {
            const type = units.type;
            const count = units.count;
            let requiredCapacity = availableUnits[type] < count ? availableUnits[type] : count;

            $(`input.unitsInput[name='${type}']`).val(requiredCapacity).trigger("change");
            $(button).focus();
        });
    }

    function emptyTroops(option) {
        scavengeOptions[option].forEach(units => {
            const type = units.type;
            $(`input.unitsInput[name='${type}']`).val("").trigger("change");
        });
    }

    function findNextButton(option) {
        startButtonName=document.getElementsByClassName("btn btn-default free_send_button")[0].innerHTML;
        let btn = $(`.scavenge-option:contains("${option}")`).find('a:contains('+startButtonName+')');
        if (btn.length > 0 && !$(btn).hasClass('btn-disabled')) return btn;
    }


    function getAvailableUnits() {
        let availableUnits = {};

        $('.units-entry-all').each((i, e) => {
            const unitName = $(e).attr("data-unit");
            const count = $(e).text().replace(/[()]/, '');
            availableUnits[unitName] = parseInt(count);
        });
        return availableUnits;
    }


}

var o4 = $("#scavenge_screen > div.scavenge-screen-main-widget > div.options-container > div:nth-child(4) > div.status-specific > div > div.action-container > a.btn.btn-default").hasClass("unlock-button");
var o3 = $("#scavenge_screen > div.scavenge-screen-main-widget > div.options-container > div:nth-child(3) > div.status-specific > div > div.action-container > a.btn.btn-default").hasClass("unlock-button");
var o2 = $("#scavenge_screen > div.scavenge-screen-main-widget > div.options-container > div:nth-child(2) > div.status-specific > div > div.action-container > a.btn.btn-default").hasClass("unlock-button");
var o1 = $("#scavenge_screen > div.scavenge-screen-main-widget > div.options-container > div:nth-child(1) > div.status-specific > div > div.action-container > a.btn.btn-default").hasClass("unlock-button");

if(!o4 || !o3 || !o2 || !o1){
    scavenge();
};

//$("#main_layout > tbody > tr.shadedBG").append ( `
$("#scavTable").prepend ( `
<html>
<style>
.button {
background-color: #4CAF50; /* Green */
border: none;
color: white;
padding: 16px 32px;
text-align: center;
text-decoration: none;
display: inline-block;
font-size: 16px;
margin: 4px 2px;
-webkit-transition-duration: 0.4s; /* Safari */
transition-duration: 0.4s;
cursor: pointer;
}

.button1 {
background-color: white;
color: black;
border: 2px solid #4CAF50;
}

.button1:hover {
background-color: #4CAF50;
color: white;
}

.button2 {
background-color: white;
color: black;
border: 2px solid #008CBA;
}

.button2:hover {
background-color: #008CBA;
color: white;
}

.button3 {
background-color: white;
color: black;
border: 2px solid #f44336;
}

.button3:hover {
background-color: #f44336;
color: white;
}

.button4 {
background-color: white;
color: black;
border: 2px solid #e7e7e7;
}

.button4:hover {background-color: #e7e7e7;}

.button5 {
background-color: white;
color: black;
border: 2px solid #555555;
}

.button5:hover {
background-color: #555555;
color: white;
}

.center1 {
margin: auto;
width: 50%;
border: 3px solid green;
padding: 10px;
}


.can-toggle {
position: relative;
}
.can-toggle *, .can-toggle *:before, .can-toggle *:after {
box-sizing: border-box;
}
.can-toggle input[type="checkbox"] {
opacity: 0;
position: absolute;
top: 0;
left: 0;
}
.can-toggle input[type="checkbox"][disabled] ~ label {
pointer-events: none;
}
.can-toggle input[type="checkbox"][disabled] ~ label .can-toggle__switch {
opacity: 0.4;
}
.can-toggle input[type="checkbox"]:checked ~ label .can-toggle__switch:before {
content: attr(data-unchecked);
left: 0;
}
.can-toggle input[type="checkbox"]:checked ~ label .can-toggle__switch:after {
content: attr(data-checked);
}
.can-toggle label {
-webkit-user-select: none;
-moz-user-select: none;
-ms-user-select: none;
user-select: none;
position: relative;
display: flex;
align-items: center;
}
.can-toggle label .can-toggle__label-text {
flex: 1;
padding-left: 32px;
}
.can-toggle label .can-toggle__switch {
position: relative;
}
.can-toggle label .can-toggle__switch:before {
content: attr(data-checked);
position: absolute;
top: 0;
text-transform: uppercase;
text-align: center;
}
.can-toggle label .can-toggle__switch:after {
content: attr(data-unchecked);
position: absolute;
z-index: 5;
text-transform: uppercase;
text-align: center;
background: white;
-webkit-transform: translate3d(0, 0, 0);
transform: translate3d(0, 0, 0);
}
.can-toggle input[type="checkbox"][disabled] ~ label {
color: rgba(119, 119, 119, 0.5);
}
.can-toggle input[type="checkbox"]:focus ~ label .can-toggle__switch, .can-toggle input[type="checkbox"]:hover ~ label .can-toggle__switch {
background-color: #777;
}
.can-toggle input[type="checkbox"]:focus ~ label .can-toggle__switch:after, .can-toggle input[type="checkbox"]:hover ~ label .can-toggle__switch:after {
color: #5e5e5e;
}
.can-toggle input[type="checkbox"]:hover ~ label {
color: #6a6a6a;
}
.can-toggle input[type="checkbox"]:checked ~ label:hover {
color: #55bc49;
}
.can-toggle input[type="checkbox"]:checked ~ label .can-toggle__switch {
background-color: #70c767;
}
.can-toggle input[type="checkbox"]:checked ~ label .can-toggle__switch:after {
color: #4fb743;
}
.can-toggle input[type="checkbox"]:checked:focus ~ label .can-toggle__switch, .can-toggle input[type="checkbox"]:checked:hover ~ label .can-toggle__switch {
background-color: #5fc054;
}
.can-toggle input[type="checkbox"]:checked:focus ~ label .can-toggle__switch:after, .can-toggle input[type="checkbox"]:checked:hover ~ label .can-toggle__switch:after {
color: #47a43d;
}
.can-toggle label .can-toggle__label-text {
flex: 1;
}
.can-toggle label .can-toggle__switch {
transition: background-color 0.3s cubic-bezier(0, 1, 0.5, 1);
background: #848484;
}
.can-toggle label .can-toggle__switch:before {
color: rgba(255, 255, 255, 0.5);
}
.can-toggle label .can-toggle__switch:after {
transition: -webkit-transform 0.3s cubic-bezier(0, 1, 0.5, 1);
transition: transform 0.3s cubic-bezier(0, 1, 0.5, 1);
transition: transform 0.3s cubic-bezier(0, 1, 0.5, 1), -webkit-transform 0.3s cubic-bezier(0, 1, 0.5, 1);
color: #777;
}
.can-toggle input[type="checkbox"]:focus ~ label .can-toggle__switch:after, .can-toggle input[type="checkbox"]:hover ~ label .can-toggle__switch:after {
box-shadow: 0 3px 3px rgba(0, 0, 0, 0.4);
}
.can-toggle input[type="checkbox"]:checked ~ label .can-toggle__switch:after {
-webkit-transform: translate3d(65px, 0, 0);
transform: translate3d(65px, 0, 0);
}
.can-toggle input[type="checkbox"]:checked:focus ~ label .can-toggle__switch:after, .can-toggle input[type="checkbox"]:checked:hover ~ label .can-toggle__switch:after {
box-shadow: 0 3px 3px rgba(0, 0, 0, 0.4);
}
.can-toggle label {
font-size: 14px;
}
.can-toggle label .can-toggle__switch {
height: 36px;
flex: 0 0 134px;
border-radius: 4px;
}
.can-toggle label .can-toggle__switch:before {
left: 67px;
font-size: 12px;
line-height: 36px;
width: 67px;
padding: 0 12px;
}
.can-toggle label .can-toggle__switch:after {
top: 2px;
left: 2px;
border-radius: 2px;
width: 65px;
line-height: 32px;
font-size: 12px;
}
.can-toggle label .can-toggle__switch:hover:after {
box-shadow: 0 3px 3px rgba(0, 0, 0, 0.4);
}
.can-toggle.can-toggle--size-small input[type="checkbox"]:focus ~ label .can-toggle__switch:after, .can-toggle.can-toggle--size-small input[type="checkbox"]:hover ~ label .can-toggle__switch:after {
box-shadow: 0 2px 2px rgba(0, 0, 0, 0.4);
}
.can-toggle.can-toggle--size-small input[type="checkbox"]:checked ~ label .can-toggle__switch:after {
-webkit-transform: translate3d(44px, 0, 0);
transform: translate3d(44px, 0, 0);
}
.can-toggle.can-toggle--size-small input[type="checkbox"]:checked:focus ~ label .can-toggle__switch:after, .can-toggle.can-toggle--size-small input[type="checkbox"]:checked:hover ~ label .can-toggle__switch:after {
box-shadow: 0 2px 2px rgba(0, 0, 0, 0.4);
}
.can-toggle.can-toggle--size-small label {
font-size: 13px;
}
.can-toggle.can-toggle--size-small label .can-toggle__switch {
height: 28px;
flex: 0 0 90px;
border-radius: 2px;
}
.can-toggle.can-toggle--size-small label .can-toggle__switch:before {
left: 45px;
font-size: 10px;
line-height: 28px;
width: 45px;
padding: 0 12px;
}
.can-toggle.can-toggle--size-small label .can-toggle__switch:after {
top: 1px;
left: 1px;
border-radius: 1px;
width: 44px;
line-height: 26px;
font-size: 10px;
}
.can-toggle.can-toggle--size-small label .can-toggle__switch:hover:after {
box-shadow: 0 2px 2px rgba(0, 0, 0, 0.4);
}
.can-toggle.can-toggle--size-large input[type="checkbox"]:focus ~ label .can-toggle__switch:after, .can-toggle.can-toggle--size-large input[type="checkbox"]:hover ~ label .can-toggle__switch:after {
box-shadow: 0 4px 4px rgba(0, 0, 0, 0.4);
}
.can-toggle.can-toggle--size-large input[type="checkbox"]:checked ~ label .can-toggle__switch:after {
-webkit-transform: translate3d(78px, 0, 0);
transform: translate3d(78px, 0, 0);
}
.can-toggle.can-toggle--size-large input[type="checkbox"]:checked:focus ~ label .can-toggle__switch:after, .can-toggle.can-toggle--size-large input[type="checkbox"]:checked:hover ~ label .can-toggle__switch:after {
box-shadow: 0 4px 4px rgba(0, 0, 0, 0.4);
}
.can-toggle.can-toggle--size-large label {
font-size: 14px;
}
.can-toggle.can-toggle--size-large label .can-toggle__switch {
height: 50px;
flex: 0 0 160px;
border-radius: 4px;
}
.can-toggle.can-toggle--size-large label .can-toggle__switch:before {
left: 80px;
font-size: 14px;
line-height: 50px;
width: 80px;
padding: 0 12px;
}
.can-toggle.can-toggle--size-large label .can-toggle__switch:after {
top: 2px;
left: 2px;
border-radius: 2px;
width: 78px;
line-height: 46px;
font-size: 14px;
}
.can-toggle.can-toggle--size-large label .can-toggle__switch:hover:after {
box-shadow: 0 4px 4px rgba(0, 0, 0, 0.4);
}
.can-toggle.demo-rebrand-1 input[type="checkbox"][disabled] ~ label {
color: rgba(181, 62, 116, 0.5);
}
.can-toggle.demo-rebrand-1 input[type="checkbox"]:focus ~ label .can-toggle__switch, .can-toggle.demo-rebrand-1 input[type="checkbox"]:hover ~ label .can-toggle__switch {
background-color: #b53e74;
}
.can-toggle.demo-rebrand-1 input[type="checkbox"]:focus ~ label .can-toggle__switch:after, .can-toggle.demo-rebrand-1 input[type="checkbox"]:hover ~ label .can-toggle__switch:after {
color: #8f315c;
}
.can-toggle.demo-rebrand-1 input[type="checkbox"]:hover ~ label {
color: #a23768;
}
.can-toggle.demo-rebrand-1 input[type="checkbox"]:checked ~ label:hover {
color: #39916a;
}
.can-toggle.demo-rebrand-1 input[type="checkbox"]:checked ~ label .can-toggle__switch {
background-color: #44ae7f;
}
.can-toggle.demo-rebrand-1 input[type="checkbox"]:checked ~ label .can-toggle__switch:after {
color: #368a65;
}
.can-toggle.demo-rebrand-1 input[type="checkbox"]:checked:focus ~ label .can-toggle__switch, .can-toggle.demo-rebrand-1 input[type="checkbox"]:checked:hover ~ label .can-toggle__switch {
background-color: #3d9c72;
}
.can-toggle.demo-rebrand-1 input[type="checkbox"]:checked:focus ~ label .can-toggle__switch:after, .can-toggle.demo-rebrand-1 input[type="checkbox"]:checked:hover ~ label .can-toggle__switch:after {
color: #2f7757;
}
.can-toggle.demo-rebrand-1 label .can-toggle__label-text {
flex: 1;
}
.can-toggle.demo-rebrand-1 label .can-toggle__switch {
transition: background-color 0.3s ease-in-out;
background: #c14b81;
}
.can-toggle.demo-rebrand-1 label .can-toggle__switch:before {
color: rgba(255, 255, 255, 0.6);
}
.can-toggle.demo-rebrand-1 label .can-toggle__switch:after {
transition: -webkit-transform 0.3s ease-in-out;
transition: transform 0.3s ease-in-out;
transition: transform 0.3s ease-in-out, -webkit-transform 0.3s ease-in-out;
color: #b53e74;
}
.can-toggle.demo-rebrand-2 input[type="checkbox"][disabled] ~ label {
color: rgba(68, 68, 68, 0.5);
}
.can-toggle.demo-rebrand-2 input[type="checkbox"]:focus ~ label .can-toggle__switch, .can-toggle.demo-rebrand-2 input[type="checkbox"]:hover ~ label .can-toggle__switch {
background-color: #444;
}
.can-toggle.demo-rebrand-2 input[type="checkbox"]:focus ~ label .can-toggle__switch:after, .can-toggle.demo-rebrand-2 input[type="checkbox"]:hover ~ label .can-toggle__switch:after {
color: #2b2b2b;
}
.can-toggle.demo-rebrand-2 input[type="checkbox"]:hover ~ label {
color: #373737;
}
.can-toggle.demo-rebrand-2 input[type="checkbox"]:checked ~ label:hover {
color: #62b125;
}
.can-toggle.demo-rebrand-2 input[type="checkbox"]:checked ~ label .can-toggle__switch {
background-color: #75d32d;
}
.can-toggle.demo-rebrand-2 input[type="checkbox"]:checked ~ label .can-toggle__switch:after {
color: #5da924;
}
.can-toggle.demo-rebrand-2 input[type="checkbox"]:checked:focus ~ label .can-toggle__switch, .can-toggle.demo-rebrand-2 input[type="checkbox"]:checked:hover ~ label .can-toggle__switch {
background-color: #69be28;
}
.can-toggle.demo-rebrand-2 input[type="checkbox"]:checked:focus ~ label .can-toggle__switch:after, .can-toggle.demo-rebrand-2 input[type="checkbox"]:checked:hover ~ label .can-toggle__switch:after {
color: #52941f;
}
.can-toggle.demo-rebrand-2 label .can-toggle__label-text {
flex: 1;
}
.can-toggle.demo-rebrand-2 label .can-toggle__switch {
transition: background-color 0.3s cubic-bezier(0.86, 0, 0.07, 1);
background: #515151;
}
.can-toggle.demo-rebrand-2 label .can-toggle__switch:before {
color: rgba(255, 255, 255, 0.7);
}
.can-toggle.demo-rebrand-2 label .can-toggle__switch:after {
transition: -webkit-transform 0.3s cubic-bezier(0.86, 0, 0.07, 1);
transition: transform 0.3s cubic-bezier(0.86, 0, 0.07, 1);
transition: transform 0.3s cubic-bezier(0.86, 0, 0.07, 1), -webkit-transform 0.3s cubic-bezier(0.86, 0, 0.07, 1);
color: #444;
}
.can-toggle.demo-rebrand-2 input[type="checkbox"]:focus ~ label .can-toggle__switch:after, .can-toggle.demo-rebrand-2 input[type="checkbox"]:hover ~ label .can-toggle__switch:after {
box-shadow: 0 4px 4px rgba(0, 0, 0, 0.4);
}
.can-toggle.demo-rebrand-2 input[type="checkbox"]:checked ~ label .can-toggle__switch:after {
-webkit-transform: translate3d(58px, 0, 0);
transform: translate3d(58px, 0, 0);
}
.can-toggle.demo-rebrand-2 input[type="checkbox"]:checked:focus ~ label .can-toggle__switch:after, .can-toggle.demo-rebrand-2 input[type="checkbox"]:checked:hover ~ label .can-toggle__switch:after {
box-shadow: 0 4px 4px rgba(0, 0, 0, 0.4);
}
.can-toggle.demo-rebrand-2 label {
font-size: 13px;
}
.can-toggle.demo-rebrand-2 label .can-toggle__switch {
height: 60px;
flex: 0 0 120px;
border-radius: 60px;
}
.can-toggle.demo-rebrand-2 label .can-toggle__switch:before {
left: 60px;
font-size: 13px;
line-height: 60px;
width: 60px;
padding: 0 12px;
}
.can-toggle.demo-rebrand-2 label .can-toggle__switch:after {
top: 2px;
left: 2px;
border-radius: 30px;
width: 58px;
line-height: 56px;
font-size: 13px;
}
.can-toggle.demo-rebrand-2 label .can-toggle__switch:hover:after {
box-shadow: 0 4px 4px rgba(0, 0, 0, 0.4);
}

</style>
<div class="center" width="100%">
<h2>Asystent zbieractwa</h2>
<p>Naciśnij przycisk aby wysłać wojsko na zbieractwo</p>
<div class="can-toggle can-toggle--size-large">
<input id="c" type="checkbox">
<label for="c">
<div class="can-toggle__switch" data-checked="Auto" data-unchecked="Off"></div>
<button class="button button1" id="greenbutton">Roześlij</button>
<button class="button button2" id="delbutton">Zeruj</button>
</div>
<br>
</html>

` );

if (localStorage.getItem("attempts") === null) {
    localStorage.setItem("attempts", "0");
} else {
    var vil = parseInt(game_data.player.villages);
    var attempts = Number(localStorage.getItem("attempts"));
    localStorage.setItem("attempts", ++attempts);

    document.title = "Wysłano " + attempts + "/" + vil;
};

$("#delbutton").click(function() {
    localStorage.setItem("attempts", parseInt(0));
});

$("#greenbutton").click(function() {
    function scavenge() {

        //checking correct page
        const doc = document;
        if (window.frames.length > 0 && window.main != null) doc = window.main.document;

        if (window.location.href.indexOf('screen=place&mode=scavenge') < 0) {
            window.location.assign(game_data.link_base_pure + "place&mode=scavenge");
        }
        var lackadaisicalLooters = document.getElementsByClassName("title")[0].innerHTML;
        var humbleHaulers = document.getElementsByClassName("title")[1].innerHTML;
        var cleverCollectors = document.getElementsByClassName("title")[2].innerHTML;
        var greatGatherers = document.getElementsByClassName("title")[3].innerHTML;
        var scavengeInfo = JSON.parse($('html').find('script:contains("ScavengeScreen")').html().match(/\{.*\:\{.*\:.*\}\}/g)[0]);
        var duration_factor = scavengeInfo[1].duration_factor;
        var duration_exponent = scavengeInfo[1].duration_exponent;
        var duration_initial_seconds = scavengeInfo[1].duration_initial_seconds;
        //var loot_factor = scavengeInfo[1].loot_factor




        function setScavTime() {
            //check if duration is preset already
            if ("ScavengeTime" in sessionStorage) {
                hours = parseInt(sessionStorage.getItem("ScavengeTime"));

            } else {
                hours = 24;
            }
            sessionStorage.setItem("ScavengeTime", hours);


        }
        setScavTime();


        if ($('button').length == 0) {
            //create interface and button
            haulCategory = 0;
            sessionStorage.setItem("haulCategory", haulCategory);
            button = document.createElement("button");
            button.classList.add("btn-confirm-yes");
            button.innerHTML = "Adjust scavenge time";
            button.style.visibility = 'hidden';
            body = document.getElementById("scavenge_screen");
            body.prepend(button);

            scavDiv = document.createElement('div');
            //check if archer world or not, depending on outcome make table with or without archers
            if ($('.units-entry-all[data-unit=archer]').text() != "") {
                htmlString = '<div  class = center ID= scavTable >\
<table class="center" width="30%" style="border: 7px solid rgba(121,0,0,0.71); border-image-slice: 7 7 7 7; border-image-source: url(https://dsen.innogamescdn.com/asset/cf2959e7/graphic/border/frame-gold-red.png);">\
<tbody>\
<tr>\
<th style="text-align:center" colspan="8">Wybierz jednostki na zbieractwo</th>\
</tr>\
<tr>\
<th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="spear"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_spear.png" title="Spear fighter" alt="" class=""></a></th>\
<th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="sword"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_sword.png" title="Swordsman" alt="" class=""></a></th>\
<th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="axe"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_axe.png" title="Axeman" alt="" class=""></a></th>\
<th style="text-align:center" width="35"><a href="#" cl ass="unit_link" data-unit="archer"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_archer.png" title="Archer" alt="" class=""></a></th>\
<th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="light"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_light.png" title="Light cavalry" alt="" class=""></a></th>\
<th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="marcher"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_marcher.png" title="Mounted Archer" alt="" class=""></a></th>\
<th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="heavy"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_heavy.png" title="Heavy cavalry" alt="" class=""></a></th>\
<th style="text-align:center" nowrap>Czas docelowy</th>\
</tr>\
<tr>\
<td align="center"><input type="checkbox" ID="spear" name="spear" checked = "checked" ></td>\
<td align="center"><input type="checkbox" ID="sword" name="sword" checked = "checked" ></td>\
<td align="center"><input type="checkbox" ID="axe" name="axe" checked = "checked" ></td>\
<td align="center"><input type="checkbox" ID="archer" name="archer" checked = "checked" ></td>\
<td align="center"><input type="checkbox" ID="light" name="light" checked = "checked" ></td>\
<td align="center"><input type="checkbox" ID="marcher" name="marcher" checked = "checked" ></td>\
<td align="center"><input type="checkbox" ID="heavy" name="heavy" checked = "checked" ></td>\
<td ID="runtime" align="center"><input type="text" ID="hours" name="hours" size="4" maxlength="2" align=left > hours</td>\
</tbody>\
</table>\
</br>\
</div>\
';
            } else {
                htmlString = '<div  class = center ID= scavTable>\
<table class="center" width="30%" style="border: 7px solid rgba(121,0,0,0.71); border-image-slice: 7 7 7 7; border-image-source: url(https://dsen.innogamescdn.com/asset/cf2959e7/graphic/border/frame-gold-red.png);">\
<tbody>\
<tr>\
<th style="text-align:center" colspan="6">Wybierz jednostki na zbieractwo</th>\
</tr>\
<tr>\
<th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="spear"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_spear.png" title="Spear fighter" alt="" class=""></a></th>\
<th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="sword"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_sword.png" title="Swordsman" alt="" class=""></a></th>\
<th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="axe"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_axe.png" title="Axeman" alt="" class=""></a></th>\
<th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="light"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_light.png" title="Light cavalry" alt="" class=""></a></th>\
<th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="heavy"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_heavy.png" title="Heavy cavalry" alt="" class=""></a></th>\
<th style="text-align:center" nowrap>Czas docelowy</th>\
</tr>\
<tr>\
<td align="center"><input type="checkbox" ID="spear" name="spear"></td>\
<td align="center"><input type="checkbox" ID="sword" name="sword" ></td>\
<td align="center"><input type="checkbox" ID="axe" name="axe" ></td>\
<td align="center"><input type="checkbox" ID="light" name="light" ></td>\
<td align="center"><input type="checkbox" ID="heavy" name="heavy" ></td>\
<td ID="runtime" align="center"><input type="text" ID="hours" name="hours" size="4" maxlength="2" align=left > hours</td>\
</tbody>\
</table>\
</br>\
</div>\
';
            }
            scavDiv.innerHTML = htmlString;
            scavenge_screen.prepend(scavDiv.firstChild);
            document.getElementById("hours").value = hours;
            document.getElementById("hours").addEventListener("change", function () {
                hours = parseInt(document.getElementById("hours").value);
                sessionStorage.setItem("ScavengeTime", hours);
                haulCategory=0;
                sessionStorage.setItem("haulCategory", haulCategory);
                calculateHauls();
                clear();
                setScavTime();
                scavenge();
                document.getElementById("hours").focus();
            });
        }

        if ($(".scavengeTable")[0]) {
            document.getElementById("hours").value = hours;
        }

        checkboxValues = JSON.parse(localStorage.getItem('checkboxValues')) || {}, $checkboxes = $("#scavTable :checkbox");
        $checkboxes.on("change", function () {
            $checkboxes.each(function () {
                checkboxValues[this.id] = this.checked;
            });
            localStorage.setItem("checkboxValues", JSON.stringify(checkboxValues));
            calculateHauls();
            haulCategory = 0;
            sessionStorage.setItem("haulCategory", haulCategory);
            scavenge();
        });

        $.each(checkboxValues, function (key, value) {
            $("#" + key).prop('checked', value);
        });


        if ($(".scavengeTable").length) {
            spears = $('.units-entry-all[data-unit=spear]').text().match(/\((\d+)\)/)[1];
            swords = $('.units-entry-all[data-unit=sword]').text().match(/\((\d+)\)/)[1];
            axes = $('.units-entry-all[data-unit=axe]').text().match(/\((\d+)\)/)[1];
            lightC = $('.units-entry-all[data-unit=light]').text().match(/\((\d+)\)/)[1];
            heavyC = $('.units-entry-all[data-unit=heavy]').text().match(/\((\d+)\)/)[1];
            if ($('.units-entry-all[data-unit=archer]').text() != "") {
                archer = $('.units-entry-all[data-unit=archer]').text().match(/\((\d+)\)/)[1]
            } else archer = 0;

            if ($('.units-entry-all[data-unit=marcher]').text() != "") {
                marcher = $('.units-entry-all[data-unit=marcher]').text().match(/\((\d+)\)/)[1]
            } else marcher = 0;
            checkboxStatus();
        }
        else {
            spears = $('.units-entry-all[data-unit=spear]').text().match(/\((\d+)\)/)[1];
            swords = $('.units-entry-all[data-unit=sword]').text().match(/\((\d+)\)/)[1];
            axes = $('.units-entry-all[data-unit=axe]').text().match(/\((\d+)\)/)[1];
            lightC = $('.units-entry-all[data-unit=light]').text().match(/\((\d+)\)/)[1];
            heavyC = $('.units-entry-all[data-unit=heavy]').text().match(/\((\d+)\)/)[1];
            if ($('.units-entry-all[data-unit=archer]').text() != "") {
                archer = $('.units-entry-all[data-unit=archer]').text().match(/\((\d+)\)/)[1]
            } else archer = 0;

            if ($('.units-entry-all[data-unit=marcher]').text() != "") {
                marcher = $('.units-entry-all[data-unit=marcher]').text().match(/\((\d+)\)/)[1]
            } else marcher = 0;
        }

        function checkboxStatus() {
            if (document.getElementById("spear").checked == false) {
                spears = 0;
                haulcategory = 0;
            }
            if (document.getElementById("sword").checked == false) {
                swords = 0;
                haulcategory = 0;
            }
            if (document.getElementById("axe").checked == false) {
                axes = 0;
                haulcategory = 0;
            }
            if (document.getElementById("light").checked == false) {
                lightC = 0;
                haulcategory = 0;
            }
            if (document.getElementById("heavy").checked == false) {
                heavyC = 0;
                haulcategory = 0;
            }
            if ($('.units-entry-all[data-unit=archer]').text() != "") {
                if (document.getElementById("archer").checked == false) {
                    archer = 0;
                    haulcategory = 0;
                }
            }
            if ($('.units-entry-all[data-unit=marcher]').text() != "") {
                if (document.getElementById("marcher").checked == false) {
                    marcher = 0;
                    haulcategory = 0;
                }
            }

        }


        function calculateHauls() {

            checkboxStatus();

            totalLoot = spears * 25 + swords * 15 + axes * 10 + lightC * 80 + heavyC * 50 + archer * 10 + marcher * 50;
            totalSpSwLoot = spears * 25 + swords * 15;
            possibleLoot = spears * 25 + swords * 15 + axes * 10 + lightC * 80 + heavyC * 50 + archer * 10 + marcher * 50;
            spearRatio = spears / (spears * 25 + swords * 15);
            swordRatio = swords / (spears * 25 + swords * 15);

            time = hours * 3600;
            haul = ((time / duration_factor - duration_initial_seconds) ** (1 / (duration_exponent)) / 100) ** (1 / 2);
            haul1 = haul / 0.1;
            haul2 = haul / 0.25;
            haul3 = haul / 0.5;
            haul4 = haul / 0.75;
            totalHaul = haul1 + haul2 + haul3 + haul4;

        }
        calculateHauls();

        if ("haulCategory" in sessionStorage) {
            haulCategory = sessionStorage.getItem("haulCategory");
        } else {
            haulCategory = 0;
            sessionStorage.setItem("haulCategory", haulCategory);
        }


        if (totalLoot > totalHaul) {
            if (totalSpSwLoot > totalHaul) {
                if (haulCategory == 0) {
                    haulCategory = 1;
                    sessionStorage.setItem("haulCategory", haulCategory);
                }
            } else {
                if (haulCategory == 0) {
                    haulCategory = 2;
                    sessionStorage.setItem("haulCategory", haulCategory);
                }
            }
        } else {
            if (haulCategory == 0) {
                haulCategory = 3;
                sessionStorage.setItem("haulCategory", haulCategory);
            }
        }

        if (haulCategory == 1) {
            scavengeOptions = {};
            scavengeOptions[greatGatherers] = [
                {
                    type: 'spear',
                    count: (haul4 * spearRatio)
                },
                {
                    type: 'sword',
                    count: (haul4 * swordRatio)
                },
                {
                    type: 'axe',
                    count: 0
                },
                {
                    type: 'archer',
                    count: 0
                },
                {
                    type: 'light',
                    count: 0
                },
                {
                    type: 'marcher',
                    count: 0
                },
                {
                    type: 'heavy',
                    count: 0
                },
            ];
            scavengeOptions[cleverCollectors] = [
                {
                    type: 'spear',
                    count: (haul3 * spearRatio)
                },
                {
                    type: 'sword',
                    count: (haul3 * swordRatio)
                },
                {
                    type: 'axe',
                    count: 0
                },
                {
                    type: 'archer',
                    count: 0
                },
                {
                    type: 'light',
                    count: 0
                },
                {
                    type: 'marcher',
                    count: 0
                },
                {
                    type: 'heavy',
                    count: 0
                },
            ];
            scavengeOptions[humbleHaulers] = [
                {
                    type: 'spear',
                    count: (haul2 * spearRatio)
                },
                {
                    type: 'sword',
                    count: (haul2 * swordRatio)
                },
                {
                    type: 'axe',
                    count: 0
                },
                {
                    type: 'archer',
                    count: 0
                },
                {
                    type: 'light',
                    count: 0
                },
                {
                    type: 'marcher',
                    count: 0
                },
                {
                    type: 'heavy',
                    count: 0
                },
            ];
            scavengeOptions[lackadaisicalLooters] = [
                {
                    type: 'spear',
                    count: (haul1 * spearRatio)
                },
                {
                    type: 'sword',
                    count: (haul1 * swordRatio)
                },
                {
                    type: 'axe',
                    count: 0
                },
                {
                    type: 'archer',
                    count: 0
                },
                {
                    type: 'light',
                    count: 0
                },
                {
                    type: 'marcher',
                    count: 0
                },
                {
                    type: 'heavy',
                    count: 0
                },
            ];

        } else {
            if (haulCategory == 2) {
                scavengeOptions = {};
                scavengeOptions[greatGatherers] = [
                    {
                        type: 'spear',
                        count: (haul4 * (spears / possibleLoot))
                    },
                    {
                        type: 'sword',
                        count: (haul4 * (swords / possibleLoot))
                    },
                    {
                        type: 'axe',
                        count: (haul4 * (axes / possibleLoot))
                    },
                    {
                        type: 'light',
                        count: (haul4 * (lightC / possibleLoot))
                    },
                    {
                        type: 'heavy',
                        count: (haul4 * (heavyC / possibleLoot))
                    },
                    {
                        type: 'archer',
                        count: (haul4 * (archer / possibleLoot))
                    },
                    {
                        type: 'marcher',
                        count: (haul4 * (marcher / possibleLoot))
                    },
                ];
                scavengeOptions[cleverCollectors] = [
                    {
                        type: 'spear',
                        count: (haul3 * (spears / possibleLoot))
                    },
                    {
                        type: 'sword',
                        count: (haul3 * (swords / possibleLoot))
                    },
                    {
                        type: 'axe',
                        count: (haul3 * (axes / possibleLoot))
                    },
                    {
                        type: 'light',
                        count: (haul3 * (lightC / possibleLoot))
                    },
                    {
                        type: 'heavy',
                        count: (haul3 * (heavyC / possibleLoot))
                    },
                    {
                        type: 'archer',
                        count: (haul3 * (archer / possibleLoot))
                    },
                    {
                        type: 'marcher',
                        count: (haul3 * (marcher / possibleLoot))
                    },
                ];
                scavengeOptions[humbleHaulers] = [
                    {
                        type: 'spear',
                        count: (haul2 * (spears / possibleLoot))
                    },
                    {
                        type: 'sword',
                        count: (haul2 * (swords / possibleLoot))
                    },
                    {
                        type: 'axe',
                        count: (haul2 * (axes / possibleLoot))
                    },
                    {
                        type: 'light',
                        count: (haul2 * (lightC / possibleLoot))
                    },
                    {
                        type: 'heavy',
                        count: (haul2 * (heavyC / possibleLoot))
                    },
                    {
                        type: 'archer',
                        count: (haul2 * (archer / possibleLoot))
                    },
                    {
                        type: 'marcher',
                        count: (haul2 * (marcher / possibleLoot))
                    },
                ];
                scavengeOptions[lackadaisicalLooters] = [
                    {
                        type: 'spear',
                        count: (haul1 * (spears / possibleLoot))
                    },
                    {
                        type: 'sword',
                        count: (haul1 * (swords / possibleLoot))
                    },
                    {
                        type: 'axe',
                        count: (haul1 * (axes / possibleLoot))
                    },
                    {
                        type: 'light',
                        count: (haul1 * (lightC / possibleLoot))
                    },
                    {
                        type: 'heavy',
                        count: (haul1 * (heavyC / possibleLoot))
                    },
                    {
                        type: 'archer',
                        count: (haul1 * (archer / possibleLoot))
                    },
                    {
                        type: 'marcher',
                        count: (haul1 * (marcher / possibleLoot))
                    },
                ];
            } else {
                if (haulCategory == 3) {
                    scavengeOptions = {};
                    scavengeOptions[greatGatherers] = [
                        {
                            type: 'spear',
                            count: ((totalLoot / totalHaul * haul4) * (spears / possibleLoot))
                        },
                        {
                            type: 'sword',
                            count: ((totalLoot / totalHaul * haul4) * (swords / possibleLoot))
                        },
                        {
                            type: 'axe',
                            count: ((totalLoot / totalHaul * haul4) * (axes / possibleLoot))
                        },
                        {
                            type: 'light',
                            count: ((totalLoot / totalHaul * haul4) * (lightC / possibleLoot))
                        },
                        {
                            type: 'heavy',
                            count: ((totalLoot / totalHaul * haul4) * (heavyC / possibleLoot))
                        },
                        {
                            type: 'archer',
                            count: ((totalLoot / totalHaul * haul4) * (archer / possibleLoot))
                        },
                        {
                            type: 'marcher',
                            count: ((totalLoot / totalHaul * haul4) * (marcher / possibleLoot))
                        },
                    ];
                    scavengeOptions[cleverCollectors] = [
                        {
                            type: 'spear',
                            count: ((totalLoot / (totalHaul - haul4) * haul3) * (spears / possibleLoot))
                        },
                        {
                            type: 'sword',
                            count: ((totalLoot / (totalHaul - haul4) * haul3) * (swords / possibleLoot))
                        },
                        {
                            type: 'axe',
                            count: ((totalLoot / (totalHaul - haul4) * haul3) * (axes / possibleLoot))
                        },
                        {
                            type: 'light',
                            count: ((totalLoot / (totalHaul - haul4) * haul3) * (lightC / possibleLoot))
                        },
                        {
                            type: 'heavy',
                            count: ((totalLoot / (totalHaul - haul4) * haul3) * (heavyC / possibleLoot))
                        },
                        {
                            type: 'archer',
                            count: ((totalLoot / (totalHaul - haul4) * haul3) * (archer / possibleLoot))
                        },
                        {
                            type: 'marcher',
                            count: ((totalLoot / (totalHaul - haul4) * haul3) * (marcher / possibleLoot))
                        },
                    ];
                    scavengeOptions[humbleHaulers] = [
                        {
                            type: 'spear',
                            count: ((totalLoot / (totalHaul - haul4 - haul3) * haul2) * (spears / possibleLoot))
                        },
                        {
                            type: 'sword',
                            count: ((totalLoot / (totalHaul - haul4 - haul3) * haul2) * (swords / possibleLoot))
                        },
                        {
                            type: 'axe',
                            count: ((totalLoot / (totalHaul - haul4 - haul3) * haul2) * (axes / possibleLoot))
                        },
                        {
                            type: 'light',
                            count: ((totalLoot / (totalHaul - haul4 - haul3) * haul2) * (lightC / possibleLoot))
                        },
                        {
                            type: 'heavy',
                            count: ((totalLoot / (totalHaul - haul4 - haul3) * haul2) * (heavyC / possibleLoot))
                        },
                        {
                            type: 'archer',
                            count: ((totalLoot / (totalHaul - haul4 - haul3) * haul2) * (archer / possibleLoot))
                        },
                        {
                            type: 'marcher',
                            count: ((totalLoot / (totalHaul - haul4 - haul3) * haul2) * (marcher / possibleLoot))
                        },
                    ];
                    scavengeOptions[lackadaisicalLooters] = [
                        {
                            type: 'spear',
                            count: (totalLoot * (spears / possibleLoot))
                        },
                        {
                            type: 'sword',
                            count: (totalLoot * (swords / possibleLoot))
                        },
                        {
                            type: 'axe',
                            count: (totalLoot * (axes / possibleLoot))
                        },
                        {
                            type: 'light',
                            count: (totalLoot * (lightC / possibleLoot))
                        },
                        {
                            type: 'heavy',
                            count: (totalLoot * (heavyC / possibleLoot))
                        },
                        {
                            type: 'archer',
                            count: (totalLoot * (archer / possibleLoot))
                        },
                        {
                            type: 'marcher',
                            count: (totalLoot * (marcher / possibleLoot))
                        },
                    ];
                }
            }
        }

        run();

        function run() {
            let btn = null;
            for (const option in scavengeOptions) {
                btn = findNextButton(option);

                if (btn) {
                    fillInTroops(option, getAvailableUnits(), btn);
                    break;
                }
            }
        }

        function clear() {
            let btn = null;
            for (const option in scavengeOptions) {
                btn = findNextButton(option);
                if (btn) {
                    emptyTroops(option);
                    break;
                }
            }
        }

        function fillInTroops(option, availableUnits, button) {
            scavengeOptions[option].forEach(units => {
                const type = units.type;
                const count = units.count;
                let requiredCapacity = availableUnits[type] < count ? availableUnits[type] : count;

                $(`input.unitsInput[name='${type}']`).val(requiredCapacity).trigger("change");
                $(button).focus();
            });
        }

        function emptyTroops(option) {
            scavengeOptions[option].forEach(units => {
                const type = units.type;
                $(`input.unitsInput[name='${type}']`).val("").trigger("change");
            });
        }

        function findNextButton(option) {
            startButtonName=document.getElementsByClassName("btn btn-default free_send_button")[0].innerHTML;
            let btn = $(`.scavenge-option:contains("${option}")`).find('a:contains('+startButtonName+')');
            if (btn.length > 0 && !$(btn).hasClass('btn-disabled')) return btn;
        }


        function getAvailableUnits() {
            let availableUnits = {};

            $('.units-entry-all').each((i, e) => {
                const unitName = $(e).attr("data-unit");
                const count = $(e).text().replace(/[()]/, '');
                availableUnits[unitName] = parseInt(count);
            });
            return availableUnits;
        }


    }

    scavenge();

    //var pkt = parseInt(document.querySelector('#rank_points').textContent.split('.').join("")) < 1000
    var zagroda = parseInt(document.querySelector('#pop_current_label').textContent) > 0
    var poj = parseInt(document.querySelector('#scavenge_screen > div.scavenge-screen-main-widget > div.candidate-squad-container > table > tbody > tr:nth-child(2) > td.carry-max').innerText);
    var odb4 = $("#scavenge_screen > div.scavenge-screen-main-widget > div.options-container > div:nth-child(4) > div.status-specific > div > div.action-container > a.btn.btn-default").hasClass("unlock-button");
    var odb3 = $("#scavenge_screen > div.scavenge-screen-main-widget > div.options-container > div:nth-child(3) > div.status-specific > div > div.action-container > a.btn.btn-default").hasClass("unlock-button");
    var odb2 = $("#scavenge_screen > div.scavenge-screen-main-widget > div.options-container > div:nth-child(2) > div.status-specific > div > div.action-container > a.btn.btn-default").hasClass("unlock-button");
    var odb1 = $("#scavenge_screen > div.scavenge-screen-main-widget > div.options-container > div:nth-child(1) > div.status-specific > div > div.action-container > a.btn.btn-default").hasClass("unlock-button");
    var blok4 = $("#scavenge_screen > div.scavenge-screen-main-widget > div.options-container > div:nth-child(4) > div.status-specific > div > div.action-container > a.btn.btn-default").hasClass("btn-disabled");
    var blok3 = $("#scavenge_screen > div.scavenge-screen-main-widget > div.options-container > div:nth-child(3) > div.status-specific > div > div.action-container > a.btn.btn-default").hasClass("btn-disabled");
    var blok2 = $("#scavenge_screen > div.scavenge-screen-main-widget > div.options-container > div:nth-child(2) > div.status-specific > div > div.action-container > a.btn.btn-default").hasClass("btn-disabled");
    var blok1 = $("#scavenge_screen > div.scavenge-screen-main-widget > div.options-container > div:nth-child(1) > div.status-specific > div > div.action-container > a.btn.btn-default").hasClass("btn-disabled");
    var start4 = $("#scavenge_screen > div.scavenge-screen-main-widget > div.options-container > div:nth-child(4) > div.status-specific > div > div.action-container > a.btn.btn-default").hasClass("free_send_button");
    var start3 = $("#scavenge_screen > div.scavenge-screen-main-widget > div.options-container > div:nth-child(3) > div.status-specific > div > div.action-container > a.btn.btn-default").hasClass("free_send_button");
    var start2 = $("#scavenge_screen > div.scavenge-screen-main-widget > div.options-container > div:nth-child(2) > div.status-specific > div > div.action-container > a.btn.btn-default").hasClass("free_send_button");
    var start1 = $("#scavenge_screen > div.scavenge-screen-main-widget > div.options-container > div:nth-child(1) > div.status-specific > div > div.action-container > a.btn.btn-default").hasClass("free_send_button");
    var unl4 = $("#scavenge_screen > div.scavenge-screen-main-widget > div.options-container > div:nth-child(4) > div.status-specific > div > div.unlock-countdown > span.unlock-countdown-text").hasClass("unlock-countdown-text");
    var unl3 = $("#scavenge_screen > div.scavenge-screen-main-widget > div.options-container > div:nth-child(3) > div.status-specific > div > div.unlock-countdown > span.unlock-countdown-text").hasClass("unlock-countdown-text");
    var unl2 = $("#scavenge_screen > div.scavenge-screen-main-widget > div.options-container > div:nth-child(2) > div.status-specific > div > div.unlock-countdown > span.unlock-countdown-text").hasClass("unlock-countdown-text");
    var unl1 = $("#scavenge_screen > div.scavenge-screen-main-widget > div.options-container > div:nth-child(1) > div.status-specific > div > div.unlock-countdown > span.unlock-countdown-text").hasClass("unlock-countdown-text");

    if(zagroda && poj > 0 && start4){
        document.querySelector('#scavenge_screen > div.scavenge-screen-main-widget > div.options-container > div:nth-child(4) > div.status-specific > div > div.action-container > a.btn.btn-default.free_send_button').click();
        scavenge();
    };
    if(zagroda && poj > 0 && start3 && (blok4 || odb4 || unl4)){
        document.querySelector('#scavenge_screen > div.scavenge-screen-main-widget > div.options-container > div:nth-child(3) > div.status-specific > div > div.action-container > a.btn.btn-default.free_send_button').click();
        scavenge();
    };

    if(zagroda && poj > 0 && start2 && (blok3 || odb3 || unl3) && ((blok4 || odb4) || unl4)){
        document.querySelector('#scavenge_screen > div.scavenge-screen-main-widget > div.options-container > div:nth-child(2) > div.status-specific > div > div.action-container > a.btn.btn-default.free_send_button').click();
        scavenge();
    };

    if(zagroda && poj > 0 && start1 && ((blok2 || odb2) || unl2) && ((blok3 || odb3) || unl3) && ((blok4 || odb4) || unl4)){
        document.querySelector('#scavenge_screen > div.scavenge-screen-main-widget > div.options-container > div:nth-child(1) > div.status-specific > div > div.action-container > a.btn.btn-default.free_send_button').click();
        scavenge();
    };

});

setInterval(zegarek,((Math.random() * (1100 - 300 + 1)) + 300));
function zegarek(){
    $("#greenbutton").click();
}

setInterval(odblokowanie,1000);
function odblokowanie(){

    var wood = parseInt($("#wood").text());
    var stone = parseInt($("#stone").text());
    var iron = parseInt($("#iron").text());

    var odb4 = $("#scavenge_screen > div.scavenge-screen-main-widget > div.options-container > div:nth-child(4) > div.status-specific > div > div.action-container > a.btn.btn-default").hasClass("unlock-button");
    var odb3 = $("#scavenge_screen > div.scavenge-screen-main-widget > div.options-container > div:nth-child(3) > div.status-specific > div > div.action-container > a.btn.btn-default").hasClass("unlock-button");
    var odb2 = $("#scavenge_screen > div.scavenge-screen-main-widget > div.options-container > div:nth-child(2) > div.status-specific > div > div.action-container > a.btn.btn-default").hasClass("unlock-button");
    var odb1 = $("#scavenge_screen > div.scavenge-screen-main-widget > div.options-container > div:nth-child(1) > div.status-specific > div > div.action-container > a.btn.btn-default").hasClass("unlock-button");
    var unl4 = $("#scavenge_screen > div.scavenge-screen-main-widget > div.options-container > div:nth-child(4) > div.status-specific > div > div.unlock-countdown > span.unlock-countdown-text").hasClass("unlock-countdown-text");
    var unl3 = $("#scavenge_screen > div.scavenge-screen-main-widget > div.options-container > div:nth-child(3) > div.status-specific > div > div.unlock-countdown > span.unlock-countdown-text").hasClass("unlock-countdown-text");
    var unl2 = $("#scavenge_screen > div.scavenge-screen-main-widget > div.options-container > div:nth-child(2) > div.status-specific > div > div.unlock-countdown > span.unlock-countdown-text").hasClass("unlock-countdown-text");
    var unl1 = $("#scavenge_screen > div.scavenge-screen-main-widget > div.options-container > div:nth-child(1) > div.status-specific > div > div.unlock-countdown > span.unlock-countdown-text").hasClass("unlock-countdown-text");

    if(odb1 && odb2 && odb3 && odb4){
        $("#scavenge_screen > div > div.options-container > div:nth-child(1) > div.status-specific > div > div.action-container > a").click();
        $("#popup_box_unlock-option-1 > div > div > a").click();
    };
    if(!odb1 && !unl1 && odb2 && odb3 && odb4){
        $("#scavenge_screen > div > div.options-container > div:nth-child(2) > div.status-specific > div > div.action-container > a").click();
        $("#popup_box_unlock-option-2 > div > div > a").click();
    };
    if(!odb1 && !unl1 && !odb2 && !unl2 && odb3 && odb4 && (wood > 1000 && stone > 1200 && iron > 1000)){
        $("#scavenge_screen > div > div.options-container > div:nth-child(3) > div.status-specific > div > div.action-container > a").click();
        $("#popup_box_unlock-option-3 > div > div > a").click();
    };
    if(!odb1 && !unl1 && !odb2 && !unl2 && !odb3 && !unl3 && odb4 && (wood > 10000 && stone > 10000 && iron > 10000)){
        $("#scavenge_screen > div > div.options-container > div:nth-child(4) > div.status-specific > div > div.action-container > a").click();
        $("#popup_box_unlock-option-4 > div > div > a").click();
    };

    setInterval(odblokowanienext,Math.floor(Math.random() * (7000 - 3000 + 1)) + 3000);
    function odblokowanienext(){
        var a = $("#village_switch_right > span").length;
        if (a > 0){
            $("#village_switch_right > span").click();
        } else {
            function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }

            async function demo() {
                await sleep(16000);
                window.location.reload(true);
            }

            demo();

        };
    };

setInterval(fastnext,Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000);
    function fastnext(){
    var blok4 = $("#scavenge_screen > div.scavenge-screen-main-widget > div.options-container > div:nth-child(4) > div.status-specific > div > div.action-container > a.btn.btn-default").hasClass("btn-disabled");
    var blok3 = $("#scavenge_screen > div.scavenge-screen-main-widget > div.options-container > div:nth-child(3) > div.status-specific > div > div.action-container > a.btn.btn-default").hasClass("btn-disabled");
    var blok2 = $("#scavenge_screen > div.scavenge-screen-main-widget > div.options-container > div:nth-child(2) > div.status-specific > div > div.action-container > a.btn.btn-default").hasClass("btn-disabled");
    var blok1 = $("#scavenge_screen > div.scavenge-screen-main-widget > div.options-container > div:nth-child(1) > div.status-specific > div > div.action-container > a.btn.btn-default").hasClass("btn-disabled");
        if(blok1 && blok2 && blok3 && blok4){
        var a = $("#village_switch_right > span").length;
        if (a > 0){
            $("#village_switch_right > span").click();
        }
        };
    };
};

//scavenge();