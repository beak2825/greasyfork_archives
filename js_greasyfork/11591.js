// ==UserScript==
// @name         SGWG Population
// @namespace    ui
// @version      0.3
// @author       Ondřej Jodas
// @match        http://sgwg.net/planety.php
// @match        http://stargate-dm.cz/planety.php
// @grant        none
// @description  Rozmisteni populace
// @downloadURL https://update.greasyfork.org/scripts/11591/SGWG%20Population.user.js
// @updateURL https://update.greasyfork.org/scripts/11591/SGWG%20Population.meta.js
// ==/UserScript==

$.widget('ui.population', {
    _create: function(){
        var self = this,
            element = self.element,
            maxPopulation = self.options.maxPopulation

        self._fillData();
        $('#rozdelit').click(function(){
            self._allocators();
        });
    },

    _fillData : function() {
        var self = this,
            element = self.element,
            listTr = element.find('tr');

        var lastTrAllTd = $(listTr.last()).find('td');
        self._freePopulation = parseFloat(lastTrAllTd[1].textContent.replace(/ /g, "").replace(",", "."));

        self._totalPlanet = listTr.length-2;

        self._populationToPlanet = Math.round(self._freePopulation*10/self._totalPlanet)/10;

        var insertToTd = lastTrAllTd.last();

        insertToTd.html($('<button>', {
            id: 'rozdelit',
            text: 'Rovnoměrně rozmístit'
        }));
    },

    _allocators: function() {
        var self = this,
            element = self.element,
            tmpAllocate = [];
        tmpAllocate['fromPlanet'] = [];
        tmpAllocate['toPlanet'] = [];
        tmpAllocate['errorPlanet'] = [];

        $.each($(element.find('tr')), function (number, actualTr){
            if (number != 0 && number <= self._totalPlanet) {
                var tds = $(actualTr).find('td');
                var population = parseFloat(tds[1].textContent.replace(/ /g, "").replace(",", "."));
                if (population-self._populationToPlanet < 0) {
                    var count = Math.round((population-self._populationToPlanet)*10)/10*-1;
                    var maxPop = parseFloat(tds[2].textContent.replace(/ /g, "").replace(",", "."));
                    tmpAllocate['toPlanet'][tmpAllocate['toPlanet'].length] = {
                        id: parseInt($(tds[0]).find('a').attr('href').replace("planety_detaily.php?id=", "")),
                        count: count
                    }
                    if (count > maxPop) {
                        tmpAllocate['errorPlanet'][tmpAllocate['errorPlanet'].length] = {
                            name: tds[0].textContent,
                            count: count-maxPop
                        }
                    }
                } else {
                    tmpAllocate['fromPlanet'][tmpAllocate['fromPlanet'].length] = {
                        id: parseInt($(tds[0]).find('a').attr('href').replace("planety_detaily.php?id=", "")),
                        count: Math.round((population-self._populationToPlanet)*10)/10
                    }
                }
            }
        });
        if (tmpAllocate['errorPlanet'].length > 0 ) {
            var errorPlanet = "Na nasledujicich planetach neni dostatek mista\n";
            $.each(tmpAllocate['errorPlanet'], function(key, value){
                errorPlanet = errorPlanet + value.name+" chybi "+ value.count + " mista\n";
            });
            alert(errorPlanet);
        } else {
            $.each(tmpAllocate['toPlanet'], function(toKey, toValue) {
                var missPop = toValue.count;
                $.each(tmpAllocate['fromPlanet'], function(fromKey, fromValue) {
                    if (fromValue.count > 0 && missPop > 0) {
                        if (fromValue.count > (missPop + 1)) {
                            var move = missPop;
                            tmpAllocate['fromPlanet'][fromKey].count = tmpAllocate['fromPlanet'][fromKey].count - move;
                        } else {
                            var move = fromValue.count;
                            tmpAllocate['fromPlanet'][fromKey].count = 0;
                        }
                        missPop = missPop-move;
                        var data = {
                            zobraz: 3,
                            antihack: self.options.antihack,
                            z_pl: fromValue.id,
                            na_pl: toValue.id,
                            p_lidi: move
                        };
                        //http://sgwg.net/planety-ajax.php?zobraz=3&z_pl=652&na_pl=652&p_lidi=&antihack=5158415
                        $.ajax({
                            type: "GET",
                            url: "planety-ajax.php",
                            data: data
                        });
                    }
                });
            });
        }
    }
});

$(function(){
    $('button').click(function() {
        var checkExist = setInterval(function () {
            if ($('#statistika_ajax').find('.full').length) {
                var antihack = $( "input[name='antihack']" ).val();
                $('#statistika_ajax').find('.full').population({antihack: antihack});
                clearInterval(checkExist);
            }
        }, 100);
    });
});