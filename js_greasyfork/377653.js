// ==UserScript==
// @name         Vider un village d'après RC
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Permet de vider un village d'après un RC
// @author       LotusConfort
// @match        https://*/game.php?village=*&screen=report&mode=*&group_id=*&view=*
// @match        https://*/game.php?screen=place&target=*&value=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377653/Vider%20un%20village%20d%27apr%C3%A8s%20RC.user.js
// @updateURL https://update.greasyfork.org/scripts/377653/Vider%20un%20village%20d%27apr%C3%A8s%20RC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = window.location.href;
    var ndd = window.location.hostname;

    var value = getUrlParameter('value');

    if (!value) {
        console.log("Vous êtes sur la page du RC");
        var $ressourceSpy = $('#attack_spy_resources');
        var ressWood = parseInt($ressourceSpy.find('.nowrap').eq(0).text().trim().replace('.',''));
        var ressClay = parseInt($ressourceSpy.find('.nowrap').eq(1).text().trim().replace('.', ''));
        var ressIron = parseInt($ressourceSpy.find('.nowrap').eq(2).text().trim().replace('.', ''));
        var total = ressWood + ressClay + ressIron;
        if (isNaN(total)) {
            total = 0
        };
        $ressourceSpy.find('.nowrap:eq(2)').after('<br><span style="padding:5px">total : ' + total + '</span>');

        console.log("Bois : " + ressWood + " Argile : " + ressClay + " Fer : " + ressIron);
        console.log("Total = " + total);


        var $villageDef = $('#attack_info_def');
        var idDef = $villageDef.find('span').data("id");
        console.log("ID du village def : " + idDef);

        var $lienRC = $('.report_ReportAttack');
        $lienRC.find('hr:last').before('<br><a href="https://' + ndd + '/game.php?screen=place&target=' + idDef + '&value=' + total + '" target="_blank">» Vider le village</a>');
    } else {
        console.log("Le total de ressources sur le village visé est de : " +value);

        var unitsCapacity = {
            'spear': 25,
            'sword': 15,
            'archer': 10,
            'axe': 10,
            'light': 80,
            'heavy': 50,
            'marcher': 50,
            'knight': 100
        }
        var $tabUNits = $('#command-data-form').find('table:first');
        var tablong = $tabUNits.find('input').length;
        if (tablong == 10){
            var lightC = $tabUNits.find('input').eq(4).data("all-count");
        } else {
            var lightC = $tabUNits.find('input').eq(5).data("all-count");
        }



        var requiredCapacityLightC = Math.round(value / unitsCapacity.light);
        if (requiredCapacityLightC > lightC){requiredCapacityLightC = lightC}else if(requiredCapacityLightC == 0){requiredCapacityLightC = 1};
        var spy = $tabUNits.find('input').eq(4).data("all-count");
        var requiredCapacitySpy = 1; //#endregion
        if (requiredCapacitySpy > spy){requiredCapacitySpy = 0};

        $(`input.unitsInput[name='spy']`).val(requiredCapacitySpy);
        $(`input.unitsInput[name='light']`).val(requiredCapacityLightC);
    }



    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

})();