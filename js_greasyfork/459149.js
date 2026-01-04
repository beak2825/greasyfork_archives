// ==UserScript==
// @name TW Auto Farm Assistant
// @author ismail.yankayis
// @version 2.0.1
// @grant Public
// @description auto farm script for tribalwars.
// @include        http*://*.tribalwars.net/*screen=am_farm*
// @include        https*://*.klanlar.org/*screen=am_farm*
// @namespace https://greasyfork.org/users/1019070
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459149/TW%20Auto%20Farm%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/459149/TW%20Auto%20Farm%20Assistant.meta.js
// ==/UserScript==

var botProtect = $('body').data('bot-protect');
if (document.URL.indexOf('screen=am_farm') == -1)
    console.log('Você deve executar o script no assistente de farm!');
else if (botProtect !== undefined) {
    alert('Alerta Captcha!');
}
else {
    var // menu = $('#am_widget_Farm a.farm_icon_a'),
        menu = '#plunder_list a.farm_icon_a',
        menu_a = '#plunder_list a.farm_icon_a',
        menu_b = '#plunder_list a.farm_icon_b',
        attackInterval = 300,
        minhaVar = "",
        changeVillage = true,
        changeVillageInterval = 360000,
        refreshPage = false,
        refreshPageInterval = 25000,
        lootAssistantPageSize = 100,
        minUnitNumber = 6,
        boxCaptcha = $("#bot_check");

    var randomTime = function (superior, inferior) {
        var numPosibilidades = superior - inferior,
            aleat = Math.random() * numPosibilidades;

        return Math.round(parseInt(inferior) + aleat);
    };

    if (attackInterval === "random") {
        attackInterval = randomTime(5000, 10000);
    }
    if (refreshPageInterval === "random") {
        refreshPageInterval = randomTime(700000, 800000);
    }

    $('img').each(function () {
        var tempStr = $(this).attr('src');
        if (tempStr.indexOf('attack') != -1)
            $(this).addClass('tooltip');
    });

    if (refreshPage === true) {
        setInterval(function () {
            window.location.reload();
        }, refreshPageInterval);
    }


    if (changeVillageInterval !== false) {
        if (changeVillageInterval === true)
            if ($('#light').text() >= 1)
                changeVillageInterval = randomTime(100000, 150000);
            else
                changeVillageInterval = randomTime(3000, 5000);
        else
            changeVillageInterval = parseInt(changeVillageInterval) + parseInt(randomTime(500, 1000));
    }

    showAllBarbs();
    if (parseInt($('#light').text()) < parseInt($('#heavy').text())) {
        menu = menu_b;
    }
    console.log("menu: ", menu);
}

startFarming();

if (changeVillage === true) {
    var altVillage = setInterval(function () {
        $('.arrowRight, .groupRight').click();

        clearInterval(altVillage);
    }, changeVillageInterval);
}


var checkCaptcha = setInterval(function () {
    if (boxCaptcha.length) {
        alert('Captcha found!');
        clearInterval(checkCaptcha);
        clearInterval(altVillage);
    }
}, 100);

function startFarming() {
    var count = 1;
    for (i = 0; i < lootAssistantPageSize; i++) {
        if(checkWall(10)) {
            $(menu).eq(i).each(function () {
                var intervalOfNexAttack = attackInterval * count;
                setTimeout(function (minhaVar) {
                    if (menu === menu_a && $('#light').text() >= minUnitNumber) {
                        $(minhaVar).click();
                    } else if (menu === menu_b && $('#heavy').text() >= minUnitNumber) {
                        $(minhaVar).click();
                    }
                }, intervalOfNexAttack, this);
                ++count;
            });
        }
    }
}

function checkWall(maxWallLv) {
    return parseInt($('#plunder_list tr:not(:first)').eq(i + 1).find('td').eq(6).text()) < maxWallLv || isNaN($('#plunder_list tr:not(:first)').eq(i + 1).find('td').eq(6).text()) == true;
}

function showAllBarbs() {
    if (game_data.screen == 'am_farm') {
        function modify_table(data) {
            var result = $('<div>').html(data).contents();
            var rows = result.find('#plunder_list tr:not(:first-child)');
            $('#plunder_list').append(rows);
        }

        $('.paged-nav-item:not(:first-child)').each(function () {
            $.ajax({
                url: $(this).attr('href'), type: "get", async: false, success: function (data) {
                    modify_table(data);
                }, error: function () {
                    UI.ErrorMessage('An error occurred while downloading data. Refresh the page to try again', 5000);
                    throw new Error('interrupted script');
                }
            });
            $(this).remove();
        });
        window.scrollTo(0, 0);
    } else {
        UI.InfoMessage('The script should be used from the farm assistant view.', 2000, 'error');
    }
    lootAssistantPageSize = document.querySelectorAll("#plunder_list a.farm_icon_a").length;
    console.log("lootAssistantPageSize: ", lootAssistantPageSize);
}