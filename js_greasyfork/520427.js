// ==UserScript==
// @name         BLACK | Скрипт для форума by C. Stoyn
// @namespace    https://forum.blackrussia.online
// @version      1.1
// @description  Специально для Черной России BLACK RUSSIA | BLACK
// @author       C. Stoyn
// @match        https://forum.blackrussia.online/*
// @icon         https://forum.blackrussia.online/
// @grant        none
// @license      MIT
// @collaborator C. Stoyn
// @icon    https://icons.iconarchive.com/icons/google/noto-emoji-food-drink/256/32382-hamburger-icon.png
// @downloadURL https://update.greasyfork.org/scripts/520427/BLACK%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20by%20C%20Stoyn.user.js
// @updateURL https://update.greasyfork.org/scripts/520427/BLACK%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20by%20C%20Stoyn.meta.js
// ==/UserScript==

(function() {
    'use strict';
    'esversion 6';

    const V_PREFIX = 1; // Префикс "Важно"
    const PIN_PREFIX = 2; // Префикс "На рассмотрении"
    const UNACCEPT_PREFIX = 4; // Префикс "Отказано"
    const RELEASE_PREFIX = 5; // Префикс "Реализовано"
    const DECIDED_PREFIX = 6; // Префикс "Решено"
    const CLOSE_PREFIX = 7; // Префикс "Закрыто"
    const ACCEPT_PREFIX = 8; // Префикс "Одобрено"
    const WATCHED_PREFIX = 9; // Префикс "Рассмотрено"
    const COMMAND_PREFIX = 10; // Префикс "Команде Проекта"
    const SPEC_PREFIX = 11; // Префикс "Специальному администратору"
    const GA_PREFIX = 12; // Префикс "ГА"
    const TEX_PREFIX = 13; // Префикс "Техническому специалисту"
    const EXPECTATION_PREFIX = 14; // Префикс "Ожидание"
    //const EXPECTATION_PREFIX = 15; // Префикс "Проверенно контролем качества"

    // http://x-lines.ru/letters/i/cyrillicgothic/1066/2BA94F/20/1/4nxpbfgou5ejdwfy4nk7b8qoua.png #Одобрено
    // http://x-lines.ru/letters/i/cyrillicgothic/1066/ffff00/20/1/4nq7brby4nopbrgow8ekdwrh4nxpbesowdejmwr74ncpbgy.png #На рассмотрении
    // http://x-lines.ru/letters/i/cyrillicgothic/1066/d32f2f/20/1/rdej7wfn4nppbrgo19ejbwr74nxy.png #Отказано
    // http://x-lines.ru/letters/i/cyrillicgothic/1066/0d47a1/20/1/4ntpbfqowzej5wra4nu7bfqow8ejiwr64nqpbe3y4no7b86o1zekpwra4nepbg6oudekdwfn4nto.png #Теху

    const buttons = [
        {
            title: '-----------------------------------------------------------------------Заявления-----------------------------------------------------------------------',
        },
        {
            title: 'Доп.баллы',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]1. NickName: [/I][/SIZE][COLOR=rgb(255, 0, 0)][SIZE=4][I]NickName[/I][/SIZE][/COLOR][/FONT][/COLOR]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]2. Уровень админ-прав: [/I][/SIZE][COLOR=rgb(255, 0, 0)][SIZE=4][I]LVL[/I][/SIZE][/COLOR][/FONT][/COLOR]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]3. Должность: [/I][/SIZE][COLOR=rgb(255, 0, 0)][SIZE=4][I]Должность[/I][/SIZE][/COLOR][/FONT][/COLOR]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]4. За какой день подается отчёт: [/I][/SIZE][COLOR=rgb(255, 0, 0)][SIZE=4][I]01.01.2025[/I][/SIZE][/COLOR][/FONT][/COLOR]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]5. Какая работа была проделана: [/I][/SIZE][COLOR=rgb(255, 0, 0)][SIZE=4][I]Job[/I][/SIZE][/COLOR][/FONT][/COLOR]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]6. Скриншоты проделанной работы: [/I][/SIZE][/FONT][/COLOR]<br>" +
                "[SPOILER]" +
                "[IMG]https://vk.com/sticker/1-72143-256b[/IMG]<br>" +
                "[SIZE=4][LEFT]Ссылка[/LEFT][/SIZE]<br>" +
                "[IMG]https://vk.com/sticker/1-80824-256b[/IMG]<br>" +
                "[/SPOILER]" +
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]",
        },
        {
            title: 'Пропуск собрания',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]1. Никнейм: [/I][/SIZE][COLOR=rgb(255, 0, 0)][SIZE=4][I]NickName[/I][/SIZE][/COLOR][/FONT][/COLOR]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]2. Уровень администрирования: [/I][/SIZE][COLOR=rgb(255, 0, 0)][SIZE=4][I]LVL[/I][/SIZE][/COLOR][/FONT][/COLOR]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]3. Занимая должность: [/I][/SIZE][COLOR=rgb(255, 0, 0)][SIZE=4][I]Должность[/I][/SIZE][/COLOR][/FONT][/COLOR]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]4. Дата собрания, на который нужен отгул:[/I][/SIZE][COLOR=rgb(255, 0, 0)][SIZE=4][I]01.01.2025[/I][/SIZE][/COLOR][/FONT][/COLOR]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]5. Причина отсутствия: [/I][/SIZE][/FONT][/COLOR]<br>" +
                "[SPOILER]" +
                "[IMG]https://vk.com/sticker/1-80822-256b[/IMG]<br>" +
                "[COLOR=rgb(255, 0, 0)][CENTER][SIZE=4][I]Причина[/I][/SIZE][/CENTER][/COLOR]<br>" +
                "[IMG]https://vk.com/sticker/1-80791-256b[/IMG]<br>" +
                "[/SPOILER]" +
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]",
        },
        {
            title: 'Повышение',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]1. Ваш Никнейм: [/I][/SIZE][COLOR=rgb(255, 0, 0)][SIZE=4][I]NickName[/I][/SIZE][/COLOR][/FONT][/COLOR]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]2. Ваша должность: [/I][/SIZE][COLOR=rgb(255, 0, 0)][SIZE=4][I]Должность[/I][/SIZE][/COLOR][/FONT][/COLOR]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]3. Количество ответов на жалобы: [/I][/SIZE][COLOR=rgb(255, 0, 0)][SIZE=4][I]жалоб[/I][/SIZE][/COLOR][/FONT][/COLOR]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]4. Сколько дней на своём уровне: [/I][/SIZE][COLOR=rgb(255, 0, 0)][SIZE=4][I]дней[/I][/SIZE][/COLOR][/FONT][/COLOR]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]5. Скриншот /astats: [/I][/SIZE][/FONT][/COLOR]<br>" +
                "[SPOILER]" +
                "[IMG]https://vk.com/sticker/1-80804-256b[/IMG]<br>" +
                "Ссылка<br>" +
                "[IMG]https://vk.com/sticker/1-80829-256b[/IMG]<br>" +
                "[/SPOILER]" +
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]",
        },
        {
            title: 'Взаимодействие',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]1. Ваш Ник: [/I][/SIZE][COLOR=rgb(255, 0, 0)][SIZE=4][I]NickName[/I][/SIZE][/COLOR][/FONT][/COLOR]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]2. Ник игрока: [/I][/SIZE][COLOR=rgb(255, 0, 0)][SIZE=4][I]NickName[/I][/SIZE][/COLOR][/FONT][/COLOR]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]3. Какая материальная операция: [/I][/SIZE][COLOR=rgb(255, 0, 0)][SIZE=4][I]покупка[/I][/SIZE][/COLOR][/FONT][/COLOR]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]4. Примерная дата когда давали долг: [/I][/SIZE][/FONT][/COLOR]<br>" +
                "[SPOILER]" +
                "[IMG]https://vk.com/sticker/1-80819-256b[/IMG]<br>" +
                "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]01.01.2025[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[IMG]https://vk.com/sticker/1-80789-256b[/IMG]<br>" +
                "[/SPOILER]" +
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]",
        },
        {
            title: 'Снятие выга',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]1. Никнейм администратора: [/I][/SIZE][COLOR=rgb(255, 0, 0)][SIZE=4][I]NickName[/I][/SIZE][/COLOR][/FONT][/COLOR]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]2. Что нужно снять: [/I][/SIZE][COLOR=rgb(255, 0, 0)][SIZE=4][I]Выговор[/I][/SIZE][/COLOR][/FONT][/COLOR]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]3. Причина получения: [/I][/SIZE][/FONT][/COLOR]<br>" +
                "[SPOILER]" +
                "[IMG]https://vk.com/sticker/1-80830-256b[/IMG]<br>" +
                "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Причина[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[IMG][/IMG]<br>" +
                "[IMG]https://vk.com/sticker/1-73090-256b[/IMG]<br>" +
                "[/SPOILER]" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]4. Дата получения наказания: [/I][/SIZE][COLOR=rgb(255, 0, 0)][SIZE=4][I]01.01.2024[/I][/SIZE][/COLOR][/FONT][/COLOR]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]5. Кем было выдано наказание: [/I][/SIZE][COLOR=rgb(255, 0, 0)][SIZE=4][I]NickName[/I][/SIZE][/COLOR][/FONT][/COLOR]<br>" +
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]",
        },
        {
            title: 'Неактив',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]1. Никнейм администратора: [/I][/SIZE][COLOR=rgb(255, 0, 0)][SIZE=4][I]NickName[/I][/SIZE][/COLOR][/FONT][/COLOR]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]2. Уровень администратора: [/I][/SIZE][COLOR=rgb(255, 0, 0)][SIZE=4][I]LVL[/I][/SIZE][/COLOR][/FONT][/COLOR]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]3. Должность: [/I][/SIZE][COLOR=rgb(255, 0, 0)][SIZE=4][I]Должность[/I][/SIZE][/COLOR][/FONT][/COLOR]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]4. Срок неактива: [/I][/SIZE][COLOR=rgb(255, 0, 0)][SIZE=4][I]дней (01.01.2025, 02.01.2025, 03.01.2025)[/I][/SIZE][/COLOR][/FONT][/COLOR]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]5. Причина неактива: [/I][/SIZE][/FONT][/COLOR]<br>" +
                "[SPOILER]" +
                "[IMG]https://vk.com/sticker/1-80819-256b[/IMG]<br>" +
                "[COLOR=rgb(255, 0, 0)][CENTER][SIZE=4][I]Причина[/I][/LEFT][/SIZE][/CENTER][/COLOR]<br>" +
                "[IMG]https://vk.com/sticker/1-80815-256b[/IMG]<br>" +
                "[/SPOILER]" +
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]",
        },
        {
            title: '-----------------------------------------------------------------------Одобрения-----------------------------------------------------------------------',
        },
        {
            title: 'NRP Поведение',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]2.01. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещено поведение, нарушающее нормы процессов Role Play режима игры[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Jail 30 минут[/FONT][/COLOR][/SIZE]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]ездить на крышах транспортных средств, бегать или ходить по столам в казино, целенаправленная провокация сотрудников правоохранительных органов с целью развлечения, целенаправленная помеха в проведении различных собеседований и так далее.[/FONT][/COLOR][/SIZE]<br>" +
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
                "[CENTER][I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I][/CENTER]<br>" +
                "[CENTER][COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Уход от RP',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]2.02. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Jail 30 минут / Warn[/FONT][/COLOR][/SIZE]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания или ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснуться Вашего персонажа. Уходить в интерьер или зеленую зону во время перестрелки с целью избежать смерти или уйти от Role Play процесса и так далее.[/FONT][/COLOR][/SIZE]<br>" +
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'NRP Drive',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]2.03. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Jail 30 минут[/FONT][/COLOR][/SIZE]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]езда на скутере по горам, езда на любом транспортном средстве по встречным полосам, нарушая все правила дорожного движения без какой-либо причины, намеренное создание аварийных ситуаций на дорогах и так далее.[/FONT][/COLOR][/SIZE]<br>" +
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Помеха работе',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]2.04. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы.[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/FONT][/COLOR][/SIZE]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]таран дальнобойщиков, инкассаторов под разными предлогами.[/FONT][/COLOR][/SIZE]<br>" +
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'NRP обман',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]2.05. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | PermBan[/FONT][/COLOR][/SIZE]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.[/FONT][/COLOR][/SIZE]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).[/FONT][/COLOR][/SIZE]<br>" +
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Аморальные действия',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]2.08. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещена любая форма аморальных действий сексуального характера в сторону игроков[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Jail 30 минут / Warn[/FONT][/COLOR][/SIZE]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Исключение: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]обоюдное согласие обеих сторон.[/FONT][/COLOR][/SIZE]<br>" +
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Слив склада',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]2.09. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещено сливать склад фракции / семьи путем взятия большого количества ресурсов или превышая допустимый лимит, установленный лидером[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Ban 15 - 30 дней / PermBan[/FONT][/COLOR][/SIZE]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]в описании семьи должны быть указаны условия взаимодействия со складом. Если лидер семьи предоставил неограниченный доступ к складу и забыл снять его, администрация не несет ответственности за возможные последствия. Жалобы по данному пункту правил принимаются только от лидера семьи.[/FONT][/COLOR][/SIZE]<br>"+
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]исключение всех или части игроков из состава семьи без ведома лидера также считается сливом.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'DB',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]2.13. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Jail 60 минут[/FONT][/COLOR][/SIZE]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Исключение: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]разрешается на территории проведения мероприятия по захвату упавшего семейного контейнера.[/FONT][/COLOR][/SIZE]<br>" +
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'TK',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]2.15. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Jail 60 минут / Warn (за два и более убийства)[/FONT][/COLOR][/SIZE]<br>" +
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'SK',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]2.16. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Jail 60 минут / Warn (за два и более убийства)[/FONT][/COLOR][/SIZE]<br>" +
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'PG',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]2.17. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Jail 30 минут[/FONT][/COLOR][/SIZE]<br>" +
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'MG',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]2.18. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Mute 30 минут[/FONT][/COLOR][/SIZE]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]использование смайлов в виде символов «))», «=D» запрещено в IC чате.[/FONT][/COLOR][/SIZE]<br>"+
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]телефонное общение также является IC чатом.[/FONT][/COLOR][/SIZE]<br>"+
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Исключение: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]за написанный однократно вопросительный «?» или восклицательный «!» знак в IC чате, наказание не выдается.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'DM',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]2.19. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Jail 60 минут[/FONT][/COLOR][/SIZE]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/FONT][/COLOR][/SIZE]<br>"+
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Mass DM',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]2.20. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Warn / Ban 3 - 7 дней[/FONT][/COLOR][/SIZE]<br>" +
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Багоюз',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]2.21. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещено пытаться обходить игровую систему или использовать любые баги сервера[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Ban 15 - 30 дней / PermBan (по согласованию с ГА, ЗГА, руководством тех. специалистов)[/FONT][/COLOR][/SIZE]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]под игровой системой подразумеваются функции и возможности, которые реализованы в игре для взаимодействия между игроками, а также взаимодействия игроков с функциями, у которых есть свое конкретное предназначение.[/FONT][/COLOR][/SIZE]<br>"+
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]аптечка предназначена для пополнения уровня здоровья, доступна всем игрокам по фиксированной цене в любом магазине. Но она не предназначена для перепродажи по завышенной цене для передачи виртуальной валюты между игроками;<br>Аксессуары предназначены для украшения внешнего вида персонажа, не предназначены для передачи виртуальной валюты между игроками;<br>Банк и личные счета предназначены для передачи денежных средств между игроками;<br>Транспортное средство предназначено для передвижения игроков, не предназначено для передачи денег тем или иным способом, включая обмен с завышенными доплатами.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Читы',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]2.22. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Ban 15 - 30 дней / PermBan[/FONT][/COLOR][/SIZE]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]запрещено внесение любых изменений в оригинальные файлы игры[/FONT][/COLOR][/SIZE]<br>"+
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]разрешено изменение шрифта, его размера и длины чата (кол-во строк).[/FONT][/COLOR][/SIZE]<br>"+
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Исключение: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]блокировка за включенный счетчик FPS не выдается.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Реклама',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]2.31. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Ban 7 дней / PermBan[/FONT][/COLOR][/SIZE]<br>" +
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Оск религии/нации',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]2.35. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Mute 120 минут / Ban 7 дней[/FONT][/COLOR][/SIZE]<br>" +
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'ООС Угрозы',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]2.37. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещены OOC угрозы, в том числе и завуалированные[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Mute 120 минут / Ban 7 дней[/FONT][/COLOR][/SIZE]<br>" +
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Оск Проекта',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]2.40. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/FONT][/COLOR][/SIZE]<br>" +
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'ЕПП',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]2.46. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещено ездить по полям на любом транспорте[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Jail 30 минут[/FONT][/COLOR][/SIZE]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Исключение: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]разрешено передвижение на кроссовых мотоциклах и внедорожниках.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'ЕПП Фура',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]2.47. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора)[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Jail 60 минут[/FONT][/COLOR][/SIZE]<br>" +
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Оск адм',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]2.54. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Mute 180 минут[/FONT][/COLOR][/SIZE]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]оформление жалобы в игре с текстом: \"Быстро починил меня\", \"Админы вы задрали уже когда работать будете меня тут ДБшат я 3 жалобы уже подал!!!!!!!!\", \"МОЗГИ ВКЛЮЧИТЕ Я УВОЛЮ ВАС ЩА\" и т.д. и т.п., а также при взаимодействии с другими игроками.[/FONT][/COLOR][/SIZE]<br>"+
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]оскорбление администрации в любой чат, включая репорт подлежит наказанию в виде блокировки доступа к использованию всех видов чатов -[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] Mute 180 минут[/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua].[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Багоюз аним',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]2.55. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещается багоюз связанный с анимацией в любых проявлениях.[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Jail 60 / 120 минут[/FONT][/COLOR][/SIZE]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]если игрок, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или перестрелки на мероприятии с семейными контейнерами, последует наказание в виде [COLOR=rgb(255, 0, 0)][FONT=book antiqua]Jail на 120 минут[/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]. Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками.[/FONT][/COLOR][/SIZE]<br>"+
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]если игрок использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] Jail на 60 минут[/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua].[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Язык',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]3.01. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Устное замечание / Mute 30 минут[/FONT][/COLOR][/SIZE]<br>" +
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Caps',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]3.02. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Mute 30 минут[/FONT][/COLOR][/SIZE]<br>" +
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'ООС Оск',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]3.03. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Mute 30 минут[/FONT][/COLOR][/SIZE]<br>" +
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Упом Родни',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]3.04. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC)[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Mute 120 минут / Ban 7 - 15 дней[/FONT][/COLOR][/SIZE]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]термины \"MQ\", \"rnq\" расценивается, как упоминание родных.[/FONT][/COLOR][/SIZE]<br>"+
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Исключение: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Flood',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]3.05. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Mute 30 минут[/FONT][/COLOR][/SIZE]<br>" +
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Злоуп знаком',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]3.06. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещено злоупотребление знаков препинания и прочих символов[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Mute 30 минут[/FONT][/COLOR][/SIZE]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]«???????», «!!!!!!!», «Дааааааааааааааааааааааа» и так далее.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Оск секс характ',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]3.07. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Mute 30 минут[/FONT][/COLOR][/SIZE]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]«дырка», «шмара», «ведро», «мадагаскарский присосконог», «свиноногий бандикут», «скорострел» и так далее.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Слив',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]3.08. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещены любые формы «слива» посредством использования глобальных чатов[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | PermBan[/FONT][/COLOR][/SIZE]<br>" +
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Выдача себя за Адм',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]3.10. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещена выдача себя за администратора, если таковым не являетесь[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Ban 7 - 15 + ЧС администрации[/FONT][/COLOR][/SIZE]<br>" +
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Введение в заблуждение',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]3.11. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Ban 15 - 30 дней / PermBan[/FONT][/COLOR][/SIZE]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]/me чтобы поднять кошелек введите /pay 228 5000. Для продажи автомобиля введите /sellmycar id 2828 (счёт в банке) цена.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Музыка в Voice',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]3.14. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещено включать музыку в Voice Chat[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Mute 60 минут[/FONT][/COLOR][/SIZE]<br>" +
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Оск в Voice',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]3.15. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещено оскорблять игроков или родных в Voice Chat[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Mute 120 минут / Ban 7 - 15 дней[/FONT][/COLOR][/SIZE]<br>" +
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Шум в Voice',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]3.16. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещено создавать посторонние шумы или звуки[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Mute 30 минут[/FONT][/COLOR][/SIZE]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]Посторонние звуки на фоне речи, мешающие взаимодействию игроков посредством голосового чата. Сильное искажение звука, исходящее из микрофона плохого качества. Намеренно портить игру другим игрокам (кричать, перебивать)[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Реклама в Voice',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]3.17. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещена реклама в Voice Chat не связанная с игровым процессом[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Ban 7 - 15 дней[/FONT][/COLOR][/SIZE]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]реклама Discord серверов, групп, сообществ, ютуб каналов и т.д.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Полит Пропаганда',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]3.18. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Mute 120 минут / Ban 10 дней[/FONT][/COLOR][/SIZE]<br>" +
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Транслит',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]3.20. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещено использование транслита в любом из чатов[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Mute 30 минут[/FONT][/COLOR][/SIZE]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]«Privet», «Kak dela», «Narmalna».[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Реклама промо',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]3.21. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах.[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Ban 30 дней[/FONT][/COLOR][/SIZE]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]чаты семейные, строительных компаний, транспортных компаний, фракционные чаты, IC, OOC, VIP и так далее.[/FONT][/COLOR][/SIZE]<br>"+
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Исключение: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]промокоды, предоставленные разработчиками, а также распространяемые через официальные ресурсы проекта.[/FONT][/COLOR][/SIZE]<br>"+
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]если игрок упомянет промокод, распространяемый через официальную публичную страницу ВКонтакте либо через официальный Discord в любом из чатов, наказание ему не выдается.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Объявы в гос',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]3.22. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC)[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Mute 30 минут[/FONT][/COLOR][/SIZE]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]в помещении центральной больницы писать в чат: \"Продам эксклюзивную шапку дешево!!!\"[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Мат в Vip',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]3.23. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Mute 30 минут[/FONT][/COLOR][/SIZE]<br>" +
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Оск ник',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]4.09. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные)[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Устное замечание + смена игрового никнейма / PermBan[/FONT][/COLOR][/SIZE]<br>" +
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Фейк акк',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]4.10. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Устное замечание + смена игрового никнейма / PermBan[/FONT][/COLOR][/SIZE]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]подменять букву i на L и так далее, по аналогии.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Гос каз/раб',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]1.13. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещено находиться в форме внутри казино, участвовать в битве за контейнеры, участвовать в захвате семейного контейнера, находится на Б/У рынке с целью покупки / продажи авто, а также устраиваться на сторонние работы в форме фракции[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Jail 30 минут[/FONT][/COLOR][/SIZE]<br>" +
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'DM ВЧ',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]2.02. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Наносить урон игрокам, которые находятся вне территории воинской части, запрещено[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Jail 60 минут / Warn[/FONT][/COLOR][/SIZE]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]предупреждение (Warn) выдается только в случае Mass DM.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'НПРО',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]4.01. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещено редактирование объявлений, не соответствующих ПРО[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Mute 30 минут[/FONT][/COLOR][/SIZE]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]игрок отправил одно слово, а редактор вставил полноценное объявление.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'НПРЭ',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]4.02. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещено проведение эфиров, не соответствующих Role Play правилам и логике[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Mute 30 минут[/FONT][/COLOR][/SIZE]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]игрок отправил одно слово, а редактор вставил полноценное объявление.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Редакт в лц',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]4.04. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Ban 7 дней + ЧС организации[/FONT][/COLOR][/SIZE]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]игрок отправил одно слово, а редактор вставил полноценное объявление.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'DM Полиц',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]6.01. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещено наносить урон игрокам без Role Play причины на территории УМВД/ГИБДД/ФСБ/ФСИН[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Jail 60 минут / Warn[/FONT][/COLOR][/SIZE]<br>" +
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Розыск без причины',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]6.02. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещено выдавать розыск без Role Play причины[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Warn[/FONT][/COLOR][/SIZE]<br>" +
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'NRP Коп',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]6.03. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] Запрещено nRP поведение[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Warn[/FONT][/COLOR][/SIZE]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]поведение, не соответствующее сотруднику УМВД/ГИБДД/ФСБ.[/FONT][/COLOR][/SIZE]<br>"+
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] открытие огня по игрокам без причины, расстрел машин без причины, нарушение ПДД без причины, сотрудник на служебном транспорте кричит о наборе в свою семью на спавне.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'NRP ВЧ',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]2. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] За нарушение правил нападения на Войсковую Часть выдаётся предупреждение[/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua] | Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/FONT][/COLOR][/SIZE]<br>" +
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#00ff00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: '-----------------------------------------------------------------------Одобрения-----------------------------------------------------------------------',
        },
        {
            title: 'Тех спецу',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба была передана [/SIZE][COLOR=rgb(255, 0, 0)][SIZE=4]Техническому специалисту[/SIZE][/COLOR][SIZE=4] сервера, ожидайте ответа в данной теме.[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#ffff00][I][B][FONT=georgia][SIZE=4]На рассмотрении![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: TEX_PREFIX,
            status: true,
        },
        {
            title: 'На рассмотрение',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба была передана [/SIZE][COLOR=rgb(255, 0, 0)][SIZE=4]на рассмотрение[/SIZE][/COLOR][SIZE=4], ожидайте ответа в данной теме.[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#ffff00][I][B][FONT=georgia][SIZE=4]На рассмотрении![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: 'КП',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба была передана [/SIZE][COLOR=rgb(255, 0, 0)][SIZE=4]Команде проекта[/SIZE][/COLOR][SIZE=4], ожидайте ответа в данной теме.[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#ffff00][I][B][FONT=georgia][SIZE=4]На рассмотрении![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: COMMAND_PREFIX,
            status: true,
        },
        {
            title: 'Спецу',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба была передана [/SIZE][COLOR=rgb(255, 0, 0)][SIZE=4]Специальному администратору[/SIZE][/COLOR][SIZE=4], ожидайте ответа в данной теме.[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#ffff00][I][B][FONT=georgia][SIZE=4]На рассмотрении![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: SPEC_PREFIX,
            status: true,
        },
        {
            title: 'ГА',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба была передана [/SIZE][COLOR=rgb(255, 0, 0)][SIZE=4]Главному администратору[/SIZE][/COLOR][SIZE=4] сервера, ожидайте ответа в данной теме.[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#ffff00][I][B][FONT=georgia][SIZE=4]На рассмотрении![/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: GA_PREFIX,
            status: true,
        },
        {
            title: 'В жб на тех',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Вы ошиблись разделом, обратитесь в раздел жалоб на [/SIZE][COLOR=rgb(255, 0, 0)][SIZE=4]технических специалистов [/SIZE][/COLOR][/FONT][/COLOR][/I][FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)][I][B][I]- [/I][/B][I][URL='https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9610-black.1191/']*Нажмите сюда*[/URL][/I][/I][/COLOR][/SIZE][/FONT]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#ff0000][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'В жб на адм',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Вы ошиблись разделом, обратитесь в раздел жалоб на [/SIZE][COLOR=rgb(255, 0, 0)][SIZE=4]администарцию [/SIZE][/COLOR][/FONT][/COLOR][/I][FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)][I][B][I]- [/I][/B][I][URL='https://forum.blackrussia.online/forums/Жалобы-на-администрацию.468/']*Нажмите сюда*[/URL][/I][/I][/COLOR][/SIZE][/FONT]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#ff0000][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'В жб на ап',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Вы ошиблись разделом, обратитесь в раздел жалоб на [/SIZE][COLOR=rgb(255, 0, 0)][SIZE=4]агентов поддержки [/SIZE][/COLOR][/FONT][/COLOR][/I][FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)][I][B][I]- [/I][/B][I][URL='https://forum.blackrussia.online/threads/black-Жалобы-на-Агентов-Поддержки-Для-Игроков.4847458/']*Нажмите сюда*[/URL][/I][/I][/COLOR][/SIZE][/FONT]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#ff0000][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'В жб на лд',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Вы ошиблись разделом, обратитесь в раздел жалоб на [/SIZE][COLOR=rgb(255, 0, 0)][SIZE=4]лидеров [/SIZE][/COLOR][/FONT][/COLOR][/I][FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)][I][B][I]- [/I][/B][I][URL='https://forum.blackrussia.online/forums/Жалобы-на-лидеров.469/']*Нажмите сюда*[/URL][/I][/I][/COLOR][/SIZE][/FONT]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#ff0000][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'В жб на сотрудников',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Вы ошиблись разделом, обратитесь в раздел жалоб на [/SIZE][COLOR=rgb(255, 0, 0)][SIZE=4]сотрудников [/SIZE][COLOR=rgb(209, 213, 216)][SIZE=4]в разделе вашей организации.[/SIZE][/COLOR][/COLOR][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#ff0000][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'в обж',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Вы ошиблись разделом, обратитесь в раздел [/SIZE][COLOR=rgb(255, 0, 0)][SIZE=4]обжалований наказаний [/SIZE][/COLOR][/FONT][/COLOR][/I][FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)][I][B][I]- [/I][/B][I][URL='https://forum.blackrussia.online/forums/Обжалование-наказаний.471/']*Нажмите сюда*[/URL][/I][/I][/COLOR][/SIZE][/FONT]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#ff0000][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'в тех раздел',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Вы ошиблись разделом, обратитесь в [/SIZE][COLOR=rgb(255, 0, 0)][SIZE=4]технический раздел [/SIZE][/COLOR][/FONT][/COLOR][/I][FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)][I][B][I]- [/I][/B][I][URL='https://forum.blackrussia.online/forums/Технический-раздел-black.488/']*Нажмите сюда*[/URL][/I][/I][/COLOR][/SIZE][/FONT]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#ff0000][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: '-----------------------------------------------------------------------Отказы-----------------------------------------------------------------------',
        },
        {
            title: 'Жб на 2+',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нельзя писать одну жалобу на двух и белее игроков [/SIZE][COLOR=rgb(255, 0, 0)][SIZE=4](на каждого игрока отдельная жалоба)[/SIZE][/COLOR][/FONT][/COLOR][/I][FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)][I][B][I].[/I][/B][/I][/COLOR][/SIZE][/FONT]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#ff0000][I][B][FONT=georgia][SIZE=4]Закрыто[/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Недостаточно док-вы',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Недостаточно доказательств для корректного рассмотрения вашей жалобы.[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#ff0000][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Отсутствуют док-ва',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Отсутствуют доказательства - следовательно, рассмотрению не подлежит. Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#ff0000][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Жб от 3-го лица',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба отказана т.к написана от 3-го лица.[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#ff0000][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Док-ва не открывается',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваши доказательства не открываются. Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее еще раз и сделайте новую жалобу.[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#ff0000][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Док-ва обрываются',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша видеозапись обрывается. Загрузите полную видеозапись на видео-хостинг YouTube.[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#ff0000][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Док-ва отредакт',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Доказательства были подвергнуты редактированию - следовательно, рассмотрению не подлежит.[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#ff0000][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Док-ва в соц.сетях',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Доказательства в социальных сетях и т.д. не принимаются. Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#ff0000][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Док-ва в плохом качестве',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваши доказательства в плохом качестве. Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#ff0000][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Нарушений нет',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушений со стороны игрока не было замечено.[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Внимательно изучите общие правила серверов - [URL='https://forum.blackrussia.online/threads/Общие-правила-серверов.312571/']*Нажмите сюда*[/URL][/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#ff0000][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Нет условий сделки',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]На доказательствах отсутствуют условия сделки - следовательно, рассмотрению не подлежит.[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#ff0000][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Нет time',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]На доказательствах отсутствуют дата и время [/SIZE][COLOR=rgb(255, 0, 0)][SIZE=4]/time[/SIZE][/COLOR][SIZE=4] - следовательно, рассмотрению не подлежит.[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#ff0000][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Нет таймкодов',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба отказана, т.к. в ней нет таймкодов. Если видео длится больше 3-ех минут - Вы должны указать таймкоды нарушений.[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#ff0000][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Прошло 3 дня',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба отказана, т.к. с момента нарушения прошло более 72-ух часов.[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#ff0000][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'уже был ответ',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба отказана, т.к. ранее уже был дан ответ.[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#ff0000][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'игрок уже наказан',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба отказана, т.к нарушитель уже был наказан.[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#ff0000][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'не тот ник в жб',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Никнейм нарушителя не соответствует никнейму в форме подачи жалобы.[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#ff0000][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Нет доступа',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваши доказательства не доступны к просмотру. Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#ff0000][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Не по форме',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба составлена не по форме. Внимательно прочитайте правила подачи жалоб на игроков, закрепленные в этом разделе.[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#ff0000][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Название не по форме',
            content:
                "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>" +
                "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255, 0, 0)]{{ user.mention }}[/COLOR].[/I][/SIZE][/FONT][/COLOR]<br>" +
                "[CENTER][/CENTER]" +
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Заголовок вашей жалобы составлен не по форме. Внимательно прочитайте правила подачи жалоб на игроков, закрепленные в этом разделе.[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=book antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/FONT][/COLOR][/SIZE]<br>"+
                "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG]<br>"+
                "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA .[/SIZE][/FONT][/COLOR][/I]<br>" +
                "[COLOR=#ff0000][I][B][FONT=georgia][SIZE=4]Отказано[/SIZE][/FONT][/B][/I][/COLOR][/CENTER]",
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
    ];

    $(document).ready(() => {
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

        addButton('На рассмотрение', 'pin');
        addButton('Одобрить', 'accepted');
        addButton('Отказать', 'unaccept');
        addButton('Закрыть', 'closed');
        addButton('Меню', 'selectAnswer');

        const threadData = getThreadData();

        $('button#v').click(() => editThreadData(V_PREFIX, true));
        $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
        $('button#release').click(() => editThreadData(RELEASE_PREFIX, false));
        $('button#decided').click(() => editThreadData(DECIDED_PREFIX, false));
        $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
        $('button#closed').click(() => editThreadData(CLOSE_PREFIX, false));
        $('button#accept').click(() => editThreadData(ACCEPT_PREFIX, false));
        $('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
        $('button#command').click(() => editThreadData(COMMAND_PREFIX, true));
        $('button#spec').click(() => editThreadData(SPEC_PREFIX, true));
        $('button#ga').click(() => editThreadData(GA_PREFIX, true));
        $('button#tex').click(() => editThreadData(TEX_PREFIX, true));
        $('button#expectation').click(() => editThreadData(EXPECTATION_PREFIX, false));

        //discussion_open 1 = Закрыта/0 = Открыта
        //sticky 1 = Закреп/0 = Откреп

        $(`button#selectAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
            buttons.forEach((btn, id) => {
                if(id > 6) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
                }
            });
        });
        //https://i.postimg.cc/RFXt9x9G/img1-akspic-ru-voda-gora-gidroresursy-rastenie-oblako-4096x2340.jpg
        $('.p-header').before(
            `<div class="p-staffBar" data-xf-init="sticky-header">
                <div class="pageContent">
                    <div class="p-staffBar-inner hScroller" data-xf-init="h-scroller">
                        <div class="hScroller-scroll is-calculated" style="margin-bottom: -47px;">
                            <a href="https://forum.blackrussia.online/forums/Жалобы-на-игроков.470/" class="p-staffBar-link">Жалобы на игроков</a>
                            <a href="https://forum.blackrussia.online/forums/Админ-раздел.450/" class="p-staffBar-link">Админ-раздел</a>
                            <a href="https://forum.blackrussia.online/forums/Сервер-№10-black.449/" class="p-staffBar-link">BLACK</a>
                        </div>
                        <i class="hScroller-action hScroller-action--end" aria-hidden="true"></i>
                        <i class="hScroller-action hScroller-action--start" aria-hidden="true"></i>
                    </div>
                </div>
            </div>`
        );

        $('.p-body').before(
            `<script src="https://app.embed.im/snow.js" defer></script>
            
            <style>
                .p-body {
                    background-image: url(https://i.postimg.cc/YqFJ35Zn/i.webp);
                    background-repeat: no-repeat;
                    background-position: center center;
                    background-attachment: fixed;
                    background-size: cover;
                }

                .block-container {
                    border-radius: 20px;
                    box-shadow: 0 0 0 1px hsl(186, 100%, 100%, 1);
                    background-color: hsl(211, 100%, 0%, 0.5);
                }

                .p-staffBar {
                    background-color: hsl(211, 100%, 0%, 0.5);
                    border-bottom: 1px solid #ffffff;
                }

                .p-header {
                    background-color: hsl(211, 100%, 0%, 0.75);
                }

                .p-pageWrapper .p-navSticky.is-sticky .p-nav {
                    background-color: hsl(211, 100%, 0%, 0.5);
                    border-bottom: 1px solid #ffffff;
                }

                .p-nav {
                    background-color: hsl(211, 100%, 0%, 0.5);
                    border-bottom: 1px solid #ffffff;
                }

                .p-sectionLinks {
                    background-color: hsl(211, 100%, 0%, 0.5);
                    color: hsl(186, 75%, 90%);
                    border-bottom: 1px solid #ffffff;
                }

                .p-pageWrapper .p-navSticky.is-sticky .p-sectionLinks {
                    background-color: hsl(211, 100%, 8%, 0.5);
                    border-bottom: 1px solid #ffffff;
                }   

                .memberHeader-main {
                    border-radius: 20px;
                    background-color: hsl(211, 100%, 8%, 0.5);
                }

                html {
                    background-color: hsl(211, 100%, 8%, 0.75);
                }

                .p-nav-list .p-navEl.is-selected {
                    color: #89ddd9;
                }

                .badge.badge--highlighted, .badgeContainer.badgeContainer--highlighted:after {
                    background: #89ddd9;
                }

                .block-tabHeader .tabs-tab.is-active, .block-tabHeader .tabs>input:checked+.tabs-tab--radio {
                    color: #89ddd9;
                    border-color: #89ddd9;
                }

                .button.button--link, button.button a.button.button--link {
                    background-color: hsl(211, 100%, 5%, 0.68);
                }

                .block--messages.block .message, .js-quickReply.block .message, .block--messages .block-row, .js-quickReply .block-row {
                    box-shadow: 0 0 0 1px hsl(186, 100%, 100%, 1);
                    background-color: hsl(211, 100%, 0%, 0.5);
                }

                .message-cell.message-cell--user, .message-cell.message-cell--action {
                    background-color: hsl(211, 100%, 0%, 0.5);
                }

                .input {
                    background-color: hsl(211, 100%, 5%, 0.68);
                }

                .message-responseRow {
                    background-color: hsl(211, 100%, 5%, 0.68);
                }

                .avatar img:not(.cropImage) {
                    border-radius: 100%;
                }

                .blockStatus {
                    background-color: hsl(211, 100%, 5%, 0.68);
                }
                    
                .fr-box.fr-basic {
                    background-color: hsl(211, 100%, 5%, 0.68);
                }



                

                .memberHeader-main {
                    background: rgba(0, 0, 0, 0.90);
                }

                .block--messages.block .message, .js-quickReply.block .message, .block--messages .block-row, .js-quickReply .block-row {
                    background: rgba(0, 0, 0, 0.90);
                }

                .message-cell.message-cell--user, .message-cell.message-cell--action {
                    background: rgba(0, 0, 0, 0.0);
                }

                .block--messages .block-container, .js-quickReply .block-container {
                    box-shadow: 0px 0px 10px 5px rgba(255, 255, 255, 1);
                }

                .button.button--primary {
                    border-radius: 30px;
                }

            </style>`,
        );
    });

    function addButton(name, id) {
        $('.button--icon--reply').before(
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 30px; margin-right: 7px;">${name}</button>`,
        );
    }

    function buttonsMarkup(buttons) {
        return `<div class="select_answer">${buttons.map((btn, i) =>
            `<button id="answers-${i}" class="button--primary button ` +
            `rippleButton" style="margin:5px"><span class="button-text">${btn.title}</span></button>`,
        ).join('')}</div>`;
    }

    function pasteContent(id, data = {}, send = false) {
        const template = Handlebars.compile(buttons[id].content);
        if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();
    
        $('span.fr-placeholder').empty();
        $('div.fr-element.fr-view p').append(template(data));
        $('a.overlay-titleCloser').trigger('click');
    
        if(send == true){
            editThreadData(buttons[id].prefix, buttons[id].status);
            $('.button--icon.button--icon--reply.rippleButton').trigger('click');
        }
    }

    function getThreadData() {
        const authorID = $('a.username')[0].attributes['data-user-id'].nodeValue;
        const authorName = $('a.username').html();
        const hours = new Date().getHours();
        return {
            user: {
                id: authorID,
                name: authorName,
                mention: `[USER=${authorID}]${authorName}[/USER]`,
            },
            greeting: () =>
                5 < hours && hours <= 10 ?
                'Доброе утро' :
                10 < hours && hours <= 16 ?
                'Добрый день' :
                16 < hours && hours <= 23 ?
                'Добрый вечер' :
                'Доброй ночи',
        };
    }

    function editThreadData(prefix, pin = false) {
        // Получаем заголовок темы, так как он необходим при запросе
        const threadTitle = $('.p-title-value')[0].lastChild.textContent;

        if(pin == false){
            fetch(`${document.URL}edit`, {
                method: 'POST',
                body: getFormData({
                    prefix_id: prefix,
                    title: threadTitle,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: 'json',
                }),
            }).then(() => location.reload());
        }
        if(pin == true){
            fetch(`${document.URL}edit`, {
                method: 'POST',
                body: getFormData({
                    prefix_id: prefix,
                    title: threadTitle,
                    sticky: 1,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: 'json',
                }),
            }).then(() => location.reload());
        }
    }

    function getFormData(data) {
        const formData = new FormData();
        Object.entries(data).forEach(i => formData.append(i[0], i[1]));
        return formData;
    }

})();