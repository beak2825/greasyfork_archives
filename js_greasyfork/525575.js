// ==UserScript==
// @name         ClanSpamRecruit
// @namespace    nexterot
// @version      1.0.4
// @license      none
// @description  Спам вербовочной рассылкой
// @author       nexterot
// @match        https://www.heroeswm.ru/clan_info.php?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heroeswm.ru
// @grant        none
// @homepage     https://greasyfork.org/ru/scripts/525575-clanspamrecruit
// @downloadURL https://update.greasyfork.org/scripts/525575/ClanSpamRecruit.user.js
// @updateURL https://update.greasyfork.org/scripts/525575/ClanSpamRecruit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //
    //
    //
    const ignoreOffice = true // игнорировать кнопочников?
    const delayInSeconds = 51 // задержка между сообщениями
    const theme = `Приглашение в БК` // тема письма
    const msg = `
Привет!

Приглашаю в БК #73 Орден Джедаев!

О нас:
- Склад на 380 мест, забит акционкой, крафтом для дефов и не только, арты для прохождения ГИ, актуальные раро сеты в крафте(Некромант-ученик, Маг-Ученик)
- Три клановых стата на постоянной основе без перебоев
- Сурвилурги для комфортной прокачки ГС в избытке
- Помощь в прокачке кузницы
- Активные каналы в дискорде и телеграме для коммуникации
- Рассылки по ивентам с советами и примерами от топовых ивентеров ГВД для вашего комфорта
- Ставка кузнецам на складе от 102% до 105%
- Дополнительное награждение лучших в клане
- Активно собираем несколько имперских сетов на склад и уже начали их крафтить

От вас:
Стучать ивенты, подробности на страничке клана, космических результатов не требуется, но и совсем спать тоже нельзя
    `
    //
    //
    //
    var skipUntilPlayerId = null; // id игрока, до которого скипнуть всех по порядку (включительно)

    var shouldStop = false;
    var errMsg = null;
    var reg_last_online = /В последний раз была? [0-9]{2}:[0-9]{2} ([0-9]{2}-[0-9]{2}-[0-9]{2})/g;
    window.onload = function(){
        var buttonTr = document.querySelector("body > center > table > tbody > tr > td > table > tbody > tr > td > table:nth-child(1) > tbody > tr:nth-child(1)");
        if (buttonTr == null) {
            buttonTr = document.querySelector("#android_container > table > tbody > tr > td:nth-child(1) > table:nth-child(1) > tbody > tr:nth-child(1)");
        }
        buttonTr.innerHTML += '<td width="90" class="wblight" align="right"><span id="show_players_statistics" style="cursor: pointer; text-decoration: underline">Проспамить</span></td>';
        var table = document.querySelector("body > center > table > tbody > tr > td > table > tbody > tr > td > table:nth-child(1)");
        if (table == null) {
            table = document.querySelector("#android_container > table > tbody > tr > td > table:nth-child(1)");
        }
        for (var i = 1, row; row = table.rows[i]; i++) {
            for (var j = 0, col; col = row.cells[j]; j++) {
                if (col.colSpan >= 2){
                    col.colSpan = table.rows[0].cells.length;
                }
            }
        }
        $('show_players_statistics').addEventListener('click', e => {
            showStats(table);
        });
    };
    function showStats(table)
    {
        if (confirm("Вы уверены что хотите проспамить этот клан?") !== true)
        {
            return
        }
        var cell = $("stats_cell");
        if (cell == null)
        {
            var statsRow = table.insertRow(2);
            cell = statsRow.insertCell();
            cell.colSpan = table.rows[1].cells.length;
            cell.id = "stats_cell";
            var resultWindow = document.createElement('span');
            resultWindow.id = 'result';
            cell.appendChild(resultWindow);

            var reg = /pl_info\.php\?id=([0-9]+)/g;
            var tab = document.querySelector("body > center > table > tbody > tr > td > table > tbody > tr > td > table:nth-child(3)");
            if (tab == null) {
                tab = document.querySelector("#android_container > table > tbody > tr > td > table:nth-child(3)");
            }
            var playerIds = new Set(Array.from(tab.innerHTML.matchAll(reg)).map(x => x[1]));
            document.body.innerHTML += `<iframe name="dummyframe" id="dummyframe" style="display: none;"></iframe>`;

            var iframe = document.querySelector('#dummyframe');
            iframe.addEventListener('load', async e => {
                const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                var responseText = iframeDocument.body.innerHTML;
                var regexpErr = /Сообщение может быть отправлено через (\d+) секунд/g
                var match = Array.from(responseText.matchAll(regexpErr), x => x[0]);
                if (match.length > 0) {
                    errMsg = match;
                    shouldStop = true;
                }
                else if (responseText.includes("занес вас в черный список")) {
                    errMsg = "занес вас в черный список";
                }
                else
                {
                    errMsg = null;
                }
                if (errMsg) {
                    console.log('err ' + errMsg);
                }
            });

            var officeBlock = document.querySelector("body > center > table > tbody > tr > td > table > tbody > tr > td > table:nth-child(1) > tbody > tr:nth-child(2)")
            ?? document.querySelector("#android_container > table > tbody > tr > td > table:nth-child(1) > tbody > tr:nth-child(2)");

            var excludeIds = new Set(Array.from(officeBlock.innerHTML.matchAll(reg)).map(x => x[1]));
                console.log("excludeIds: ", excludeIds);
            if (ignoreOffice) {
                playerIds = playerIds.difference(excludeIds);
            }

            //run(["6516136", "6516136"]); ///////////////////////////////////
            run([...playerIds]);
        }
    }
    async function run(arr) {
        var resultWindow = $("result");
        if (skipUntilPlayerId) {
            resultWindow.innerHTML += `Пропускаем всех по id=${skipUntilPlayerId}<br>`;
        }
        for (var i = 0; i < arr.length; i++) {
            if (errMsg) {
                resultWindow.innerHTML += `<b>Ошибка! ${errMsg}</b><br><br>`;
                errMsg = null;
            }
            if (shouldStop) {
                resultWindow.innerHTML += `Рассылка остановлена<br><br>`;
                shouldStop = false;
                return;
            }

            var id = arr[i];

            if (skipUntilPlayerId) {
                resultWindow.innerHTML += `Пропускаем id=${id}<br>`;
                console.log('skip ' + id);
                if (id == String(skipUntilPlayerId)) {
                    skipUntilPlayerId = null;
                }
                continue;
            }

            var link = `https://www.heroeswm.ru/sms-create.php?mailto_id=${id}`
            var page = getPage(link)
            var formStartIndex = page.indexOf('<form')
            var formEndIndex = page.indexOf('</form')
            var formHTML = page.substring(formStartIndex, formEndIndex + 7)

            const container = document.createElement('div');
            container.innerHTML = formHTML;

            var form = document.body.appendChild(container.firstElementChild);
            form.target = "dummyframe";

            var inputSubject = form.querySelector("[name='subject']");
            inputSubject.value = theme;
            inputSubject.setAttribute("value", theme);

            var textArea = form.querySelector("textarea");
            textArea.innerHTML = msg;

            form.submit();

            resultWindow.innerHTML += `${i+1}. ${new Date().toLocaleTimeString()} Отправляем сообщение игроку id=${id}, ждём кулдаун...<br>`;

            await sleep(delayInSeconds * 1000);

            document.body.removeChild(form);
        }

        resultWindow.innerHTML += `Спамка окончена!<br>`;
    }
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    function $(id, where = document) {
        return where.querySelector(`#${id}`);
    }
    function getPage(aURL) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', aURL, false);
        xhr.overrideMimeType('text/html; charset=windows-1251');
        xhr.send();
        if (xhr.status != 200) {
            console.log(`getPage error ${xhr.status}: ${xhr.statusText}`);
            return null;
        }
        return ( xhr.responseText );
    }
})();