// ==UserScript==
// @name         Heroeswm - Roulette Hunter v2.2.2
// @author       JUSTteen15
// @namespace    JUSTteen15
// @version      2.2.2
// @description  Крутой балдеж для рулетки (версия от 2023.08.03)

// @include     /^https{0,1}:\/\/((www|qrator)\.heroeswm\.ru|178\.248\.235\.15)\/(inforoul|pl_info)\.php.*/

// @icon         https://dcdn.heroeswm.ru/avatars/2210/nc-55/2210892.jpg
// @encoding 	 utf-8

// @grant        GM.setValue
// @grant        GM.getValue

// @downloadURL https://update.greasyfork.org/scripts/27124/Heroeswm%20-%20Roulette%20Hunter%20v222.user.js
// @updateURL https://update.greasyfork.org/scripts/27124/Heroeswm%20-%20Roulette%20Hunter%20v222.meta.js
// ==/UserScript==
if (/inforoul/.test(location.href)) {
    var abcElements = document.querySelectorAll('.wbwhite');

    // Set their ids
    for (var i = 0; i < abcElements.length; i++) {
        abcElements[i].id = 'abc-' + i;
    }

    var url = document.URL;
    var rouletteId = parseInt(url.substring(url.lastIndexOf('=') + 1));

    var parent = document.createElement('div');
    var locationUrl = 'http://' + location.hostname + '/inforoul.php?id=';

    parent.innerHTML = '<br/><tr><div style="display: flex;justify-content: center;"><button id="back" type="button"><<</button>&ensp;<button id="reload" type="button">Обновить</button>&ensp;<button id="next" type="button">>></button></div></tr>';
    document.getElementById("abc-1").appendChild(parent);

    let roulleteRows = document.querySelectorAll("body > center > table:nth-child(2) > tbody > tr > td > table > tbody tr");

    var infoText = '';
    var totalWinSum = parseInt(0);

    (async () => {
        let playerJson = await GM.getValue('players');

        if (playerJson !== undefined && playerJson !== null) {
            let playerArray = JSON.parse(playerJson);

            playerArray.forEach(function(entry) {
                for (let i = 0; i < roulleteRows.length; i++) {
                    let player = {};

                    player.url = document.querySelector('body > center > table:nth-child(2) > tbody > tr > td > table > tbody > tr:nth-child(' + i + ') > td:nth-child(2) > a');

                    if (player.url !== undefined && player.url !== null) {
                        player.name = player.url.text;

                        if (entry == player.name) {
                            var betValue = document.querySelector('body > center > table:nth-child(2) > tbody > tr > td > table > tbody > tr:nth-child(' + i + ') > td:nth-child(1) > b');
                            if (betValue !== undefined && betValue !== null) {
                                player.bet = betValue.innerText.replace(/<([^ >]+)[^>]*>.*?<\/\1>|<[^\/]+\/>/ig, "");
                            }

                            var straight = document.querySelector('body > center > table:nth-child(2) > tbody > tr > td > table > tbody > tr:nth-child(' + i + ') > td:nth-child(3)');
                            if (straight !== undefined && straight !== null) {
                                player.straight = straight.textContent;
                            }

                            var resultValue = document.querySelector('body > center > table:nth-child(2) > tbody > tr > td > table > tbody > tr:nth-child(' + i + ') > td:nth-child(4)')
                            if (resultValue !== undefined && resultValue !== null) {
                                player.result = resultValue.innerText.replace(/<([^ >]+)[^>]*>.*?<\/\1>|<[^\/]+\/>/ig, "");
                            }

                            totalWinSum = parseInt(player.result.replace(',', '')) + parseInt(totalWinSum);

                            infoText += '<tr>' +
                                '<td class="wbwhite" align="right">' + player.bet +
                                '</td>' +

                                '<td class="wbwhite"><a style="text-decoration:none;" href="' + player.url.href + '">' + player.name + '</a>' +
                                '</td>' +

                                '<td class="wbwhite">' + player.straight + '</td>' +

                                '<td class="wbwhite">' + player.result + '</td>' +
                                '</tr>'
                        }
                    }
                }
            })
        }

        var additionalContainer = document.createElement('div');
        additionalContainer.innerHTML = '<br/>' +
            '<table align="center" cellpadding="4" class="wbwhite" style="min-width:600px;">' +
            '<tr>' +
            '<td class="wbwhite" colspan="4">' +
            '<div align="center"><b>Ваш список</b></div><br>' +
            '</td>' +
            '</tr>' +

            '<tr>' +
            '<td class="wbwhite" colspan="4"><center>Все ставки:</center>' +
            '</td>' +
            '</tr>' +

            '<tr>' +
            '<td class="wblight" width="120" align="right"><b>Ставка</b></td>' +
            '<td class="wblight" width="150" align="center"><b>Игрок</b></td>' +
            '<td class="wblight" width="150" align="center"><b>Поле</b></td>' +
            '<td class="wblight" width="120"><b>Выигрыш</b></td>' +
            '</tr>' +

            infoText +

            '<tr>' +
            '<td class="wb2" align="right">' +
            '<td class="wb2" align="center" colspan="2"><b>Всего</b>' +
            '</td>' +

            '<td class="wb2">' +
            '<table border="0" cellspacing="0" cellpadding="0">' +
            '<tr>' +
            '<td><img width="24" height="24" src="https://dcdn2.heroeswm.ru/i/r/gold.png?v=3.23de65" border="0" title="Золото" alt="" class="rs"></td>' +
            '<td>' + totalWinSum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td>' +
            '</tr>' +
            '</table>' +
            '</td>' +
            '</tr>' +

            '</table>' +
            '<br/>';
        document.getElementById("abc-1").appendChild(additionalContainer);
    })();

    document.getElementById('reload').onclick = function() {
        location.reload();
    }

    document.getElementById('back').onclick = function() {
        window.location = locationUrl + (rouletteId - 1);
    }

    document.getElementById('next').onclick = function() {
        window.location = locationUrl + (rouletteId + 1);
    }
} else {
    var personalInfoView = document.querySelector('body > center > table:nth-child(2) > tbody > tr > td > table:nth-child(1) > tbody > tr:nth-child(1) > td:nth-child(1) > table > tbody > tr > td:nth-child(2) > table > tbody > tr');
    var usernameLabel = document.querySelector('body > center > table:nth-child(2) > tbody > tr > td > table:nth-child(1) > tbody > tr:nth-child(1) > td:nth-child(1) > table > tbody > tr > td:nth-child(1) > b');

    var username = usernameLabel.textContent.replace(/ *\[[^\]]*]/, '').trim();

    var buttonParent = document.createElement('td');

    var userExistInDb = false;

    (async () => {
        let playerJson = await GM.getValue('players');
        var playerArray = new Array();

        if (playerJson !== undefined && playerJson !== null) {
            playerArray = JSON.parse(playerJson);

            playerArray.forEach(function(entry) {
                if (entry == username) {
                    userExistInDb = true;
                    return
                }
            })
        }

        if (userExistInDb) {
            buttonParent.innerHTML = '<div id="roulleteAction" style="cursor: pointer;width: 33px;"><div id="buttonText">(R-)</div></div>';
        } else {
            buttonParent.innerHTML = '<div id="roulleteAction" style="cursor: pointer;width: 33px;"><div id="buttonText">(R+)</div></div>';
        }

        personalInfoView.insertBefore(buttonParent, personalInfoView.firstChild);

        document.getElementById('roulleteAction').onclick = function() {
            if (userExistInDb) {
                playerArray = playerArray.filter(e => e !== username);

                document.getElementById('roulleteAction').textContent = "(R+)";

                userExistInDb = false;
            } else {
                playerArray.push(username);

                playerArray = Array.from(new Set(playerArray));

                document.getElementById('roulleteAction').textContent = "(R-)";

                userExistInDb = true;
            }

            GM.setValue("players", JSON.stringify(playerArray));
        }

    })();
}