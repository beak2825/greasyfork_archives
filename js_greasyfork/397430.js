// ==UserScript==
// @name         e-food.hu Weekly Nutrition Table
// @namespace    com.frzsombor.userscripts.efoodnutritiontable
// @version      0.2
// @description  Calculates total protein, carb, fat and calories per day for an order
// @author       frzsombor
// @match        *.e-food.hu/rendeles/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/397430/e-foodhu%20Weekly%20Nutrition%20Table.user.js
// @updateURL https://update.greasyfork.org/scripts/397430/e-foodhu%20Weekly%20Nutrition%20Table.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
    'use strict';

    var $ = jQuery;

    var apiUrls = {
        'foodinfo': 'https://www.e-food.hu/getosszetevok/?k=%code%&d=%date%&l=hu'
    };

    var dates = [];
    var orders = [];
    var nutritions;
    var $nutritionTable;
    var $bwInput;
    var nutritionsByFood = {};
    var activeConnections = 0;

    initialize();

    function initialize() {
        for (var i = 1; i <= 6; i++) {
            var dayInfo = $('.fooddayname[data-weekday="' + i + '"]').html();
            var date = dayInfo.match(/(\d{4}\.\d{2}\.\d{2})/gmi)[0].replace(/\./g, "-");
            dates.push(date);
        }

        nutritions = initNutritionObject();
        $nutritionTable = initNutritionTable();

        var $tableWrapper = $('<div style="margin: 10px 40px;"></div>');
        $tableWrapper.append($nutritionTable);
        $('.cityfoodcontent').after($tableWrapper);

        initCartHook();
        updateOrders();

        console.log('e-food.hu Nutrition Table initialized!');
    }

    function initCartHook() {
        var hook = ' cartHook(key); ';
        var kosarmuveletHooked = kosarmuvelet.toString();
        kosarmuveletHooked = kosarmuveletHooked.replace('$key.val(jsondata[key]);','$key.val(jsondata[key]);' + hook);
        kosarmuveletHooked = kosarmuveletHooked.replace('for(key in jsondata)','for(var key in jsondata)'); //bugfix
        eval('var key; kosarmuvelet = ' + kosarmuveletHooked);
    }

    function cartHook(id) {
        console.log('Cart updated!');
        updateOrders();
    }

    function updateOrders() {
        orders = [];
        var newFoodSelected = false;

        var $foodInCart = $('.azetlapon').filter(function() {
            return parseInt($(this).val(), 10) > 0;
        });

        $foodInCart.each(function(){
            var foodData = getFoodDataFromId($(this).attr('id'));
            var foodId = foodData.code + '-' + foodData.date;
            var food = {
                code: foodData.code,
                date: foodData.date,
                count: parseInt($(this).val())
            };

            orders.push(food);

            if (typeof nutritionsByFood[foodId] === 'undefined') {
                newFoodSelected = true;
                getFoodNutritions(food.code, food.date);
            }
        });

        if (!newFoodSelected) {
            updateNutritionSummary();
            updateNutritionTable();
        }
        else {
            setLoading(true);
        }
    }

    function getFoodDataFromId(id) {
        var foodId = id.replace('darab_', '');
        var foodKey = foodId.split(/-(.+)/)[0];
        var foodDate = foodId.replace(foodKey + '-', '');

        return {
            code: foodKey,
            date: foodDate
        };
    }

    function getFoodNutritions(code, date) {
        var foodId = code + '-' + date;
        var url = apiUrls.foodinfo
            .replace('%code%', code)
            .replace('%date%', date)
        ;

        activeConnections++;

        $.ajax(url)
            .done(function(data, textStatus, jqXHR) {
                activeConnections--;

                nutritionsByFood[foodId] = parseNutritions(data);

                if (activeConnections < 1) {
                    //all ajax calls finished
                    activeConnections = 0;
                    updateNutritionSummary();
                    updateNutritionTable();
                    setLoading(false);
                }
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                activeConnections--;
                console.log(errorThrown);
            })
        ;
    }

    function parseNutritions(data) {
        var dataArray = $.parseHTML(data);
        var $table = $(dataArray[2]).find('.tapanyagtable');

        return {
            'calories'      : parseInt($table.find('tr:nth-child(2)').find('td:nth-child(2)').text() || 0),
            'fat'           : parseFloat($table.find('tr:nth-child(3)').find('td:nth-child(2)').text() || 0),
            'fat-saturated' : parseFloat($table.find('tr:nth-child(4)').find('td:nth-child(2)').text() || 0),
            'carb'          : parseFloat($table.find('tr:nth-child(5)').find('td:nth-child(2)').text() || 0),
            'carb-sugar'    : parseFloat($table.find('tr:nth-child(6)').find('td:nth-child(2)').text() || 0),
            'protein'       : parseFloat($table.find('tr:nth-child(7)').find('td:nth-child(2)').text() || 0),
            'sodium'        : parseFloat($table.find('tr:nth-child(8)').find('td:nth-child(2)').text() || 0)
        };
    }

    function updateNutritionSummary() {
        nutritions = initNutritionObject();

        for (var i = 0; i < dates.length; i++) {
            var date = dates[i];

            for (var j = 0; j < orders.length; j++) {
                var order = orders[j];

                if (order.date === date) {
                    var foodId = order.code + '-' + order.date;
                    var foodNutritions = nutritionsByFood[foodId];
                    nutritions[date]['calories']      += (foodNutritions['calories'] * order.count);
                    nutritions[date]['fat']           += (foodNutritions['fat'] * order.count);
                    nutritions[date]['fat-saturated'] += (foodNutritions['fat-saturated'] * order.count);
                    nutritions[date]['carb']          += (foodNutritions['carb'] * order.count);
                    nutritions[date]['carb-sugar']    += (foodNutritions['carb-sugar'] * order.count);
                    nutritions[date]['protein']       += (foodNutritions['protein'] * order.count);
                    nutritions[date]['sodium']        += (foodNutritions['sodium'] * order.count);
                }
            }
        }

        for (var s = 0; s < dates.length; s++) {
            nutritions['summary']['calories']      += nutritions[dates[s]]['calories'];
            nutritions['summary']['fat']           += nutritions[dates[s]]['fat'];
            nutritions['summary']['fat-saturated'] += nutritions[dates[s]]['fat-saturated'];
            nutritions['summary']['carb']          += nutritions[dates[s]]['carb'];
            nutritions['summary']['carb-sugar']    += nutritions[dates[s]]['carb-sugar'];
            nutritions['summary']['protein']       += nutritions[dates[s]]['protein'];
            nutritions['summary']['sodium']        += nutritions[dates[s]]['sodium'];
        }

        console.log(nutritions);
    }

    function updateNutritionTable() {
        var bodyWeight = null;
        if ($bwInput.val() !== '' && !isNaN(parseInt($bwInput.val())) && parseInt($bwInput.val()) > 10) {
            bodyWeight = parseInt($bwInput.val());
        }

        for (var i = 0; i < dates.length; i++) {
            var date = dates[i];
            $nutritionTable.find('.calories')     .find('td.' + date).html(nutritions[date]['calories'] + ' kcal');
            $nutritionTable.find('.fat')          .find('td.' + date).html(nutritions[date]['fat'].toFixed(1) + 'g');
            $nutritionTable.find('.fat-saturated').find('td.' + date).html(nutritions[date]['fat-saturated'].toFixed(1) + 'g');
            $nutritionTable.find('.carb')         .find('td.' + date).html(nutritions[date]['carb'].toFixed(1) + 'g');
            $nutritionTable.find('.carb-sugar')   .find('td.' + date).html(nutritions[date]['carb-sugar'].toFixed(1) + 'g');
            $nutritionTable.find('.protein')      .find('td.' + date).html(nutritions[date]['protein'].toFixed(1) + 'g');
            $nutritionTable.find('.sodium')       .find('td.' + date).html(nutritions[date]['sodium'].toFixed(1) + 'g');

            if (bodyWeight) {
                var plusDailyCalories = parseInt($nutritionTable.find('.bwkg-calories input').val()) || 0;
                var plusDailyFat = parseInt($nutritionTable.find('.bwkg-fat input').val()) || 0;
                var plusDailyCarb = parseInt($nutritionTable.find('.bwkg-carb input').val()) || 0;
                var plusDailyProtein = parseInt($nutritionTable.find('.bwkg-protein input').val()) || 0;
                $nutritionTable.find('.bwkg-calories').find('td.' + date).html(((plusDailyCalories + nutritions[date]['calories'])/bodyWeight).toFixed(1) + ' kcal/tskg');
                $nutritionTable.find('.bwkg-fat')     .find('td.' + date).html(((plusDailyFat + nutritions[date]['fat'])/bodyWeight).toFixed(1) + 'g/tskg');
                $nutritionTable.find('.bwkg-carb')    .find('td.' + date).html(((plusDailyCarb + nutritions[date]['carb'])/bodyWeight).toFixed(1) + 'g/tskg');
                $nutritionTable.find('.bwkg-protein') .find('td.' + date).html(((plusDailyProtein + nutritions[date]['protein'])/bodyWeight).toFixed(1) + 'g/tskg');
            }
            else {
                $nutritionTable.find('.bwkg-calories').find('td.' + date).html('');
                $nutritionTable.find('.bwkg-fat')     .find('td.' + date).html('');
                $nutritionTable.find('.bwkg-carb')    .find('td.' + date).html('');
                $nutritionTable.find('.bwkg-protein') .find('td.' + date).html('');
            }
        }

        for (var s = 0; s < dates.length; s++) {
            $nutritionTable.find('.calories')     .find('td.summary').html(nutritions['summary']['calories'] + ' kcal');
            $nutritionTable.find('.fat')          .find('td.summary').html(nutritions['summary']['fat'].toFixed(1) + 'g');
            $nutritionTable.find('.fat-saturated').find('td.summary').html(nutritions['summary']['fat-saturated'].toFixed(1) + 'g');
            $nutritionTable.find('.carb')         .find('td.summary').html(nutritions['summary']['carb'].toFixed(1) + 'g');
            $nutritionTable.find('.carb-sugar')   .find('td.summary').html(nutritions['summary']['carb-sugar'].toFixed(1) + 'g');
            $nutritionTable.find('.protein')      .find('td.summary').html(nutritions['summary']['protein'].toFixed(1) + 'g');
            $nutritionTable.find('.sodium')       .find('td.summary').html(nutritions['summary']['sodium'].toFixed(1) + 'g');
        }
    }

    function initNutritionTable() {
        var $table = $('<table class="nutrition-table"></table>');

        $table.append(
            '<thead>' +
            '    <tr>' +
            '        <th style="text-align:left;">Átlagos tápérték</th>' +
            '        <th style="text-align:right;">hétfő</th>' +
            '        <th style="text-align:right;">kedd</th>' +
            '        <th style="text-align:right;">szerda</th>' +
            '        <th style="text-align:right;">csütörtök</th>' +
            '        <th style="text-align:right;">péntek</th>' +
            '        <th style="text-align:right;">szombat</th>' +
            '        <th style="text-align:right;">összesen</th>' +
            '    </tr>' +
            '</thead>'
        );

        $table.append(
            '<tbody>' +
            '   <tr class="calories">' +
            '       <td style="text-align:left;">Energia</td>' +
            '   </tr>' +
            '   <tr class="fat">' +
            '       <td style="text-align:left;">Zsír</td>' +
            '   </tr>' +
            '   <tr class="fat-saturated">' +
            '       <td style="text-align:left;"> &nbsp;- amelyből telített zsírsav</td>' +
            '   </tr>' +
            '   <tr class="carb">' +
            '       <td style="text-align:left;">Szénhidrát</td>' +
            '   </tr>' +
            '   <tr class="carb-sugar">' +
            '       <td style="text-align:left;">&nbsp;- amelyből cukrok</td>' +
            '   </tr>' +
            '   <tr class="protein">' +
            '       <td style="text-align:left;">Fehérje</td>' +
            '   </tr>' +
            '   <tr class="sodium">' +
            '       <td style="text-align:left;">Só</td>' +
            '   </tr>' +
            '   <tr class="">' +
            '       <td>&nbsp;</td>' +
            '   </tr>' +
            '   <tr class="">' +
            '       <td style="text-align:left;">' +
            '           <input class="bodyweight" placeholder="testsúly" style="display:inline-block;width:80px;"> kg' +
            '       </td>' +
            '   </tr>' +
            '   <tr class="bwkg-calories">' +
            '       <td style="text-align:left;">Energia (+ <input style="display:inline-block;width:50px;"> / nap)</td>' +
            '   </tr>' +
            '   <tr class="bwkg-fat">' +
            '       <td style="text-align:left;">Zsír (+ <input style="display:inline-block;width:50px;"> / nap)</td>' +
            '   </tr>' +
            '   <tr class="bwkg-carb">' +
            '       <td style="text-align:left;">Szénhidrát (+ <input style="display:inline-block;width:50px;"> / nap)</td>' +
            '   </tr>' +
            '   <tr class="bwkg-protein">' +
            '       <td style="text-align:left;">Fehérje (+ <input style="display:inline-block;width:50px;"> / nap)</td>' +
            '   </tr>' +
            '</tbody>'
        );

        $table.find('tbody tr').each(function(){
            for (var i = 0; i < dates.length; i++) {
                $(this).append('<td class="' + dates[i] + '" style="text-align:right;"></td>');
            }
            $(this).append('<td class="summary" style="text-align:right;"></td>');
        });

        $bwInput = $table.find('input.bodyweight');
        $table.on('change keydown keyup', function(){
            updateNutritionTable();
        });

        return $table;
    }

    function initNutritionObject() {
        var ret = {};
        var initObj = {
            'calories'      : 0,
            'fat'           : 0.0,
            'fat-saturated' : 0.0,
            'carb'          : 0.0,
            'carb-sugar'    : 0.0,
            'protein'       : 0.0,
            'sodium'        : 0.0
        };

        for (var i = 0; i < dates.length; i++) {
            ret[dates[i]] = Object.assign({}, initObj);
        }

        ret['summary'] = Object.assign({}, initObj);

        return ret;
    }

    function setLoading(set) {
        //
    }
}, false);
