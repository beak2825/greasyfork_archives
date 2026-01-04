// ==UserScript==
// @name         Список игроков в лабиринте и в пустоши для кланового чата
// @namespace    https://greasyfork.org/en/users/1261878-twice2750
// @version      2.4
// @description  Добавляет список игроков в лабиринте и в пустоши для кланового чата
// @license      MIT
// @match        https://www.fantasyland.ru/cgi/ch_who.php
// @match        https://www.fantasyland.ru/cgi/no_combat.php
// @grant        GM_addValueChangeListener
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/489561/%D0%A1%D0%BF%D0%B8%D1%81%D0%BE%D0%BA%20%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2%20%D0%B2%20%D0%BB%D0%B0%D0%B1%D0%B8%D1%80%D0%B8%D0%BD%D1%82%D0%B5%20%D0%B8%20%D0%B2%20%D0%BF%D1%83%D1%81%D1%82%D0%BE%D1%88%D0%B8%20%D0%B4%D0%BB%D1%8F%20%D0%BA%D0%BB%D0%B0%D0%BD%D0%BE%D0%B2%D0%BE%D0%B3%D0%BE%20%D1%87%D0%B0%D1%82%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/489561/%D0%A1%D0%BF%D0%B8%D1%81%D0%BE%D0%BA%20%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2%20%D0%B2%20%D0%BB%D0%B0%D0%B1%D0%B8%D1%80%D0%B8%D0%BD%D1%82%D0%B5%20%D0%B8%20%D0%B2%20%D0%BF%D1%83%D1%81%D1%82%D0%BE%D1%88%D0%B8%20%D0%B4%D0%BB%D1%8F%20%D0%BA%D0%BB%D0%B0%D0%BD%D0%BE%D0%B2%D0%BE%D0%B3%D0%BE%20%D1%87%D0%B0%D1%82%D0%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция поиска элементов на странице
    var cashGELoc = [];
    function $Loc(elem) {
        var fel = cashGELoc[elem];
        if (!fel) {
            fel = document.getElementById(elem);
            cashGELoc[elem] = fel;
        }
        return fel;
    }

    // Функция очистки списка игроков
    var nListLoc = [];
    function NewListLoc() {
        nListLoc.length = 0;
        $Loc('listLoc').style.display = 'block';
    }

    // Функция добавления персонажа в список игроков
    var swLoc = [];
    function wcLoc(login,id,lvl,tagss,col,clan1,zap1,clan2,zap2,clan3,zap3,clan4,zap4,mob,sex,statuss,hp,hpmax,dealer,mod) {
        var swLoc = [];
        swLoc.length = 0;
        var hpmsg = "Персонаж свободен (" + hp + "/" + hpmax + ")"; statuspic = "ch_free.gif";
        switch (statuss) {
            case 1: hpmsg = "Персонаж дерется"; statuspic = "ch_combat.gif"; break;
            case 2: hpmsg = "Персонаж торгует"; statuspic = "ch_trade.gif"; break;
            case 4: hpmsg = "Персонаж занят";   statuspic = "ch_busy.gif"; break;
            case 6: hpmsg = "Персонаж говорит"; statuspic = "ch_talk.gif"; break;
        }

        swLoc.push("<IMG width='11' height='11' title='");
        swLoc.push(hpmsg);
        swLoc.push("'");

        if ( statuss == 1 ) {
            swLoc.push(" class='cp' onClick=\"javascript: parent.openCombat('");
            swLoc.push(login);
            swLoc.push("');\" ");
        }

        swLoc.push(" src=\"/images/status/");
        swLoc.push(statuspic);
        swLoc.push("\">");

        swLoc.push(" <IMG width='11' height='11' title=\"Приватное сообщение\" class='cp' onClick=\"parent.privateAdress('");
        swLoc.push(login);
        swLoc.push("');\" src=\"/images/miscellaneous/e_private.gif\" onmouseover=\"this.src = '/images/miscellaneous/e_private_s.gif';\" onmouseout=\"this.src = '/images/miscellaneous/e_private.gif';\">");

        if(dealer > 0) {
            swLoc.push(" <IMG width='15' height='15' src='/images/clans/dealer_chat.gif' class='cp' onClick=\"window.open('/additional_services.php')\">");
        }

        function findclan(clan, zap, razd, swLoc) {
            if (clan <= 0)
              return;

            var ci = 0;
            for ( var i=0; i<ids.length; i++ ) {
              if ( ids[i] == clan ) { ci = i; break; }
            }

            swLoc.push(razd);
            swLoc.push("<IMG width='15' height='15' src='/images/clans/");
            swLoc.push(imgs[ci]);
            swLoc.push("'");

            if ( g[ci] == 1 ) {
              swLoc.push(" class='cp' onClick='woc(");
              swLoc.push(ci);
              swLoc.push(");' title='");
              swLoc.push(cnames[ci]); swLoc.push(" ("); swLoc.push(zap); swLoc.push("'>");
            }
            else {
              swLoc.push(" title='гильдия ");
              swLoc.push(cnames[ci]); swLoc.push(" ("); swLoc.push(zap); swLoc.push("'>");
            }
        }

        swLoc.push(" [Lvl:");
        swLoc.push(lvl);
        swLoc.push("]");

        findclan(clan1, zap1, "", swLoc);
        findclan(clan2, zap2, " ", swLoc);
        findclan(clan3, zap3, " ", swLoc);
        findclan(clan4, zap4, " ", swLoc);

        switch (tagss) {
            case 2: t1 = "<b>"; t2 = "</b>"; break;
            case 3: t1 = "<i>"; t2 = "</i>"; break;
            case 4: t1 = "<b><i>"; t2 = "</b></i>"; break;
            default: t1 = ""; t2 = "";
        }

        swLoc.push("<FONT color='");
        swLoc.push(col);
        swLoc.push("' class='cp' onclick=\"parent.Adress('");
        swLoc.push(login);
        swLoc.push("');\">");
        swLoc.push(t1);
        swLoc.push("<span name='nick'>");
        swLoc.push(login);
        swLoc.push("</span>");
        swLoc.push(t2);
        swLoc.push("</FONT>");
        swLoc.push(" <IMG width='11' height='11' title='Информация' class='cp' onClick=\"parent.openInfo('");
        swLoc.push(login);
        swLoc.push("');\"");
        swLoc.push("src=\"/images/miscellaneous/info_");
        swLoc.push(sex);
        swLoc.push(".gif\">");

        if ( mod == 1 ) {
            swLoc.push(" <IMG width='11' height='11' title='Контроль' class='cp' onClick=\"parent.openControls('");
            swLoc.push(login);
            swLoc.push("');\" src=\"/images/miscellaneous/e_ctrl.gif\" onmouseover=\"this.src = '/images/miscellaneous/e_ctrl_s.gif';\" onmouseout=\"this.src = '/images/miscellaneous/e_ctrl.gif';\">");
        }

        var o = new Array(login, lvl, clan1, clan2, swLoc.join(''));
        nListLoc.push( o );
    }

    // Функция сортировки и отображения списка игроков на странице
    var ListLocEnabled = GM_getValue("ListLocEnabled", false);
    function SortAndShowLoc() {

        // Сортируем список игроков также, как это сделано в клановом чате
        nListLoc.sort(top.chat.chwho.lastSortFunc);

        // Добавляем список игроков на страницу, если он был ранее включен
        if($Loc("listLoc").style.display === "block") {

            let sLoc = [];

            // Добавляем соответсвующую надпись, если персонаж находится в лабиринте или в пустоши, или находился там перед боем
            if (top.loc && top.loc.no_combat && top.loc.no_combat.Point) {
                GM_setValue('CurrentLocTitle', 'В пустоши:');
            } else if (top.loc && top.loc.no_combat && top.loc.no_combat.pickUp) {
                GM_setValue('CurrentLocTitle', 'В лабиринте:');
            } else if (top.loc && top.loc.no_combat) {
                GM_setValue('CurrentLocTitle', '');
            }
            if (ListLocEnabled) {
                let Title = GM_getValue('CurrentLocTitle', '');
                if (Title != '') sLoc.push(Title);
            }

            // Добавляем список игроков на страницу
            for(var i = 0; i < nListLoc.length; i++) {
              sLoc.push(nListLoc[i][4]);
            }
            sLoc.push('<br>');
            $Loc('listLoc').innerHTML = sLoc.join('<br>');
        }
    }

    // Функция изменения и выполнения кода из результатов запроса
    function updateLoc(commands) {

        let replacements = [
            { pattern: /NewList/gm, replacement: "NewListLoc" },
            { pattern: /^wc/gm, replacement: "wcLoc" },
            { pattern: /FirstShow/gm, replacement: "SortAndShowLoc" }
        ];

        for (let replacement of replacements) {
            commands = commands.replaceAll(replacement.pattern, replacement.replacement);
        }
        eval(commands);
    }

    // Функция переодически обновляющая список игроков
    var reloadTimerLoc;
    function ChRefLoc() {

        // Отображаем список игроков, только если персонаж находится в лабиринте или в пустоши, или находился там перед боем
        if (top.loc && top.loc.no_combat && (top.loc.no_combat.pickUp || top.loc.no_combat.Point)) {
            ListLocEnabled = true;
        }
        else if (top.loc && top.loc.no_combat) {
            ListLocEnabled = false;
        }
        GM_setValue("ListLocEnabled", ListLocEnabled);

        // Скрываем список игроков, если открыт общит чат или список локаций
        if (ListLocEnabled && $Loc("UserList").style.display != "none" &&
           top.chat && top.chat.chout && top.chat.chout.cur_channel && top.chat.chout.cur_channel != 0) {
            DoRequest('ch_ref.php', updateLoc);
        }
        else {
            $Loc('listLoc').style.display = 'none';
        }

        clearTimeout(reloadTimerLoc);
        reloadTimerLoc = window.setTimeout(ChRefLoc, 30000);
    }

    // Функция отслеживания перемещения персонажа между локациями
    function waitForlocation() {

        if (!(top.chat.chwho.curPlace && top.chat.chwho.curLoc)) {
            setTimeout(waitForlocation, 10);
            return;
        }

        GM_setValue('curPlace,curLoc', [top.chat.chwho.curPlace, top.chat.chwho.curLoc]);
    }

    // Добавляем список игроков на страницу и изменяем действие задействованных кнопок
    if (window.location.href === "https://www.fantasyland.ru/cgi/ch_who.php") {
            window.addEventListener('load', function () {

            // Добавляем список игроков на страницу
            var listLoc = document.createElement('div');
            listLoc.id = 'listLoc';
            listLoc.style = 'white-space: nowrap;';
            var target = document.querySelector('div#list');
            target.parentNode.insertBefore(listLoc, target);
            ChRefLoc();

            // Выводим функцию обновления списка игроков на страницу для использования другими скриптами
            document.ChRefLoc = ChRefLoc;

            // Обновляем список игроков после перехода персонажа в другую локацию
            GM_addValueChangeListener("curPlace,curLoc", ChRefLoc);

            // Находим кнопки переключения чатов
            var chats = parent.chch.document.querySelector('#moo');
            if (chats) {
                // Добавляем действие при нажатии на кнопки
                chats.addEventListener('click', function onclick(event) {
                    ChRefLoc();
                });
            }

            // Находим кнопки "А-я", "Lvl", "Гильдия"
            var filters = document.querySelectorAll('button[onclick^="SortList"]');
            filters.forEach( button => {
                // Добавляем действие при нажатии на кнопки
                button.addEventListener('click', function onclick(event) {
                   SortAndShowLoc();
                });
            });

            // Находим кнопку "Клан"
            var buttonbyClan = document.querySelector('button[onclick="CheckClanChat();"]');
            if (buttonbyClan) {
                // Изменяем действие при нажатии на кнопку
                buttonbyClan.onclick = null;
                buttonbyClan.addEventListener('click', function onclick(event) {
                    SortList(byClan, byClanInv, 2);
                    SortAndShowLoc();
                });
            }

            // Находим кнопки "Обновить" и "Игроки"
            var buttonsPlayerList = document.querySelectorAll('button[onclick="PlayerList();"]');
            buttonsPlayerList.forEach( buttonPlayerList => {
                // Добавляем действие при нажатии на кнопки
                buttonPlayerList.addEventListener('click', function onclick(event) {
                   ChRefLoc();
                });
            });
        });
    }

    // Отслеживаем переход персонажа в другую локацию
    else if (window.location.href === "https://www.fantasyland.ru/cgi/no_combat.php") {
        window.addEventListener('load', waitForlocation);
    }
})();