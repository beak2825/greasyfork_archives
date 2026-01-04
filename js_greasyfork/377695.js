// ==UserScript==
// @name         Fake Script
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Fake Script pour GT
// @author       You
// @match        https://*/game.php?village=*&screen=place
// @match        https://*/game.php?village=*&screen=place&mode=command
// @match        https://*/game.php?screen=place&village=*
// @match        https://*/game.php?village=*&screen=place&try=confirm

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377695/Fake%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/377695/Fake%20Script.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var url = window.location.hostname;
    var lang = url.slice(-2);
    if (lang == "et") lang = "en";

    var coordsTextarea = [];
    var coordsVillage = JSON.parse(localStorage.getItem("Coords"));
    var longCoord = 0;
    if (coordsVillage) {
        longCoord = coordsVillage.length;
    }
    var i = 0;

    console.table(coordsVillage);

    var units = {
        'spy': 0,
        'ram': 0,
        'catapult': 0,
        'light': 0,
        'heavy': 0,
        'axe': 0,
        'spear': 0,
    }
    var unitsPop = {
        'spy': 2,
        'ram': 5,
        'catapult': 8,
        'light': 4,
        'heavy': 6,
        'marcher': 5,
        'axe': 1,
        'spear': 1,
        'archer': 1,
        'knight': 10,
        'snob': 100,
    }


    var $menu = $('.modemenu');
    var config = 0;
    $menu.find('tr').after('<tr><td id="go_fake" style="min-width: 80px"><a href="#">Fakes (A)</a></td><td id="reset_fake" style="min-width: 80px"><a href="#">Reset Coords</a></td><td id="configuration_fake" style="min-width: 80px"><a href="#">Options Fakes</a></td></tr>');
    var $compteurPillage = $('#content_value');
    var $tabUNits = $('#command-data-form').find('table:first');
    $tabUNits.find("td[valign='top']:last").after('<td valign="top"><table class="vis" width="100%"><tbody><tr><th>Pop utilisée</th></tr><tr><td class="nowrap">TEST</td></tr><tr></tbody></table></td>');
    $(document).keydown(function (e) {
        switch (e.which) {
            case 65: // touche A
                if (i == 0) {
                    $compteurPillage.find('h3:first').after('<span id="compteur_village" style="font-size : 1.5em; color : blue">Village ' + sessionStorage.indexPillage + ' / ' + longCoord + '</span>');
                    i = 1;
                } else {
                    i = 1;
                    $('#compteur_village').remove();
                    $compteurPillage.find('h3:first').after('<span id="compteur_village" style="font-size : 1.5em; color : blue">Village ' + sessionStorage.indexPillage + ' / ' + longCoord + '</span>');
                };
                console.log("Index de village pillé numero: ", sessionStorage.indexPillage);
                console.log("Coordonné du village : ", coordsVillage[sessionStorage.indexPillage - 1])
                goFake();
                $('#target_attack').focus();
                break;
            default :
                break;
        }
    });

    $('#configuration_fake').click(function () {
        configurationFake();
    });
    $('#go_fake').click(function () {
        if (i == 0) {
            $compteurPillage.find('h3:first').after('<span id="compteur_village" style="font-size : 1.5em; color : blue">Village ' + sessionStorage.indexPillage + ' / ' + longCoord + '</span>');
            i = 1;
        } else {
            i = 1;
            $('#compteur_village').remove();
            $compteurPillage.find('h3:first').after('<span id="compteur_village" style="font-size : 1.5em; color : blue">Village ' + sessionStorage.indexPillage + ' / ' + longCoord + '</span>');
        };
        console.log("Index de village pillé numero: ", sessionStorage.indexPillage);
        console.log("Coordonné du village : ", coordsVillage[sessionStorage.indexPillage - 1])
        goFake();
        $('#target_attack').focus();
    });
    $('#reset_fake').click(function () {
        resetFake();
    });

    function resetFake() {
        sessionStorage.indexPillage = 1;
        window.location.reload();
    }

    function goFake() {
        if (longCoord == 0) {
            alert("Il faut configurer les coordonnés des villages !");
        } else {
            if (typeof (sessionStorage.indexPillage) == "undefined") {
                console.log("undefined");
            } else if (sessionStorage.indexPillage == longCoord) {
                $(`input.unitsInput[name='spy']`).val(localStorage.unitspy);
                $(`input.unitsInput[name='ram']`).val(localStorage.unitram);
                $(`input.unitsInput[name='catapult']`).val(localStorage.unitcatapult);
                $(`input.unitsInput[name='light']`).val(localStorage.unitlight);
                $(`input.unitsInput[name='heavy']`).val(localStorage.unitheavy);
                $(`input.unitsInput[name='axe']`).val(localStorage.unitaxe);
                $(`input.unitsInput[name='spear']`).val(localStorage.unitspear);
                $(`input.unitsInput[name='sword']`).val(0);
                $(`input.unitsInput[name='archer']`).val(0);
                $(`input.unitsInput[name='marcher']`).val(0);
                $(`input.unitsInput[name='knight']`).val(0);
                $(`input.unitsInput[name='snob']`).val(0);
                $('#place_target > input').val(coordsVillage[sessionStorage.indexPillage - 1]);
                sessionStorage.indexPillage = 1;
            } else {
                $(`input.unitsInput[name='spy']`).val(localStorage.unitspy);
                $(`input.unitsInput[name='ram']`).val(localStorage.unitram);
                $(`input.unitsInput[name='catapult']`).val(localStorage.unitcatapult);
                $(`input.unitsInput[name='light']`).val(localStorage.unitlight);
                $(`input.unitsInput[name='heavy']`).val(localStorage.unitheavy);
                $(`input.unitsInput[name='axe']`).val(localStorage.unitaxe);
                $(`input.unitsInput[name='spear']`).val(localStorage.unitspear);
                $(`input.unitsInput[name='sword']`).val(0);
                $(`input.unitsInput[name='archer']`).val(0);
                $(`input.unitsInput[name='marcher']`).val(0);
                $(`input.unitsInput[name='knight']`).val(0);
                $(`input.unitsInput[name='snob']`).val(0);
                $('#place_target > input').val(coordsVillage[sessionStorage.indexPillage - 1]);
                sessionStorage.indexPillage++;
            }

        }
    }


    function configurationFake() {
        if (config == 0) {
            $menu.after('<div id="config_fakes"><br><h3>Configuration de l\'attaque</h3><div><textarea id="coords" name="coords" rows = "5" cols = "33" placeholder="Insérer les coords des villages à attaquer">' + coordsVillage + '</textarea></div><div style="float:left"><img src="https://ds' + lang + '.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_spy.png" title="Spy" style="margin-right: 5px" ><input id="spy" type="number" placeholder="Scouts" value="' + localStorage.unitspy + '" style="width:75px; margin-right: 5px"></div><div style="float:left"><img src="https://ds' + lang + '.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_ram.png" title="Ram" style="margin-right: 5px" ><input id="ram" type="number" placeholder="Béliers"  value="' + localStorage.unitram + '" style="width:75px; margin-right: 5px"></div><div style="float:left"><img src="https://ds' + lang + '.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_catapult.png" title="Catapult" style="margin-right: 5px"><input id="catapult" type="number" placeholder="Catapultes"  value="' + localStorage.unitcatapult + '" style="width:75px; margin-right: 5px"></div><div style="float:left"><img src="https://ds' + lang + '.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_light.png" title="Lights" style="margin-right: 5px" ><input id="light" type="number" placeholder="Légers"  value="' + localStorage.unitlight + '"style="width:75px; margin-right: 5px"></div><div style="float:left"><img src="https://ds' + lang + '.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_heavy.png" title="Heavy" style="margin-right: 5px" ><input id="heavy" type="number" placeholder="Lourds"  value="' + localStorage.unitheavy + '"style="width:75px; margin-right: 5px"></div><div style="float:left"><img src="https://ds' + lang + '.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_axe.png" title="Axeman" style="margin-right: 5px" ><input id="axe" type="number" placeholder="Bucherons"  value="' + localStorage.unitaxe + '"style="width:75px; margin-right: 5px"></div><div style="float:left"><img src="https://ds' + lang + '.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_spear.png" title="Spear fighter" style="margin-right: 5px"><input id="spear" type="number" placeholder="Lanciers"  value="' + localStorage.unitspear + '" style="width:75px; margin-right: 5px"></div><div style="float:left"><a id="ok" href="#" class="btn btn-target-action">Configurer</a></div></div><br>');
            config++;
        } else {
            $('#config_fakes').remove();
            config = 0;
        }

        $('#ok').click(function () {
            //alert('La configuration a bien été prise en compte');
            coordsTextarea = exportCoords();
            localStorage.setItem('Coords', JSON.stringify(coordsTextarea));

            units.spy = $('#spy').val();
            units.ram = $('#ram').val();
            units.catapult = $('#catapult').val();
            units.light = $('#light').val();
            units.heavy = $('#heavy').val();
            units.axe = $('#axe').val();
            units.spear = $('#spear').val();
            localStorage.unitspy = units.spy;
            localStorage.unitram = units.ram;
            localStorage.unitcatapult = units.catapult;
            localStorage.unitlight = units.light;
            localStorage.unitheavy = units.heavy;
            localStorage.unitaxe = units.axe;
            localStorage.unitspear = units.spear;
            sessionStorage.indexPillage = 0;
            resetFake();
        })

        function exportCoords() {
            var lines = $('#coords').val().split(/\n| |,/);
            var coords = []
            for (var i = 0; i < lines.length; i++) {
                coords.push($.trim(lines[i]));
            }
            return coords;
        }

    }

})();