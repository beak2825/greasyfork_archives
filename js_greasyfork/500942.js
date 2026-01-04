// ==UserScript==
// @name         Script для форума | by lorenzikk
// @namespace    https://forum.blackrussia.online
// @version      3.2
// @description  Для упрощения работы кураторам форумных разделов
// @author       t.me/lorenzikk
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        t.me/lorenzikk
// @license      arefuer
// @collaborator t.me/lorenzikk
// @icon         https://i.yapx.ru/ViO6c.png
// @downloadURL https://update.greasyfork.org/scripts/500942/Script%20%D0%B4%D0%BB%D1%8F%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%20by%20lorenzikk.user.js
// @updateURL https://update.greasyfork.org/scripts/500942/Script%20%D0%B4%D0%BB%D1%8F%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%20by%20lorenzikk.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const messageCellUser = document.querySelectorAll('.message-cell--user');
    messageCellUser.forEach(function (cell) {
        cell.style.background = '#29586c88';
    });

    const messageCellMain = document.querySelectorAll('.message-cell--main');
    messageCellMain.forEach(function (cell) {
        cell.style.background = '#15293788';
    });

    const scrollbarStyle = document.createElement('style');
    scrollbarStyle.id = 'style-scrollbar';
    scrollbarStyle.textContent = `
    /* Стили для полосы прокрутки */
    ::-webkit-scrollbar {
        width: 16px;
    }

    /* Дорожка (track) */
    ::-webkit-scrollbar-track {
        background-color: #C0C0C0;
    }

    /* Стиль полосы прокрутки */
    ::-webkit-scrollbar-thumb {
        background-color: #FF0000;
        border-radius: 0px;
        transition-duration: .3s;
    }

    /* Стиль полосы прокрутки при наведении */
    ::-webkit-scrollbar-thumb:hover {
        background-color: #FFFF00;
        transition-duration: .3s;
    }
    `;
    document.head.appendChild(scrollbarStyle);

    const sliderStyle = document.createElement('style');
    sliderStyle.id = 'slider-style';
    sliderStyle.textContent = `
    .switch {
        position: relative;
        display: inline-block;
        width: 40px;
        height: 20px;
        padding-left: 20px;
        margin: 0 30px 0 auto;
    }
    .switch input { display: none; }
    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: 1px solid #34aaeb;
        background-color: #212428;
        transition: all .4s ease;
    }
    .slider:hover{
        background-color: #29686d;
    }
    .slider:before {
        position: absolute;
        content: "";
        height: 14px;
        width: 14px;
        left: 2px;
        bottom: 2px;
        background-color: #32a0a8;
        box-shadow: 0 0 5px #000000;
        transition: all .4s ease;
    }
    input:checked + .slider {
        background-color: #212428;
    }
    input:checked + .slider:hover {
        background-color: #29686d;
    }
    input:focus + .slider {
        box-shadow: 0 0 5px #222222;
        background-color: #444444;
    }
    input:checked + .slider:before {
        transform: translateX(19px);
    }
    .slider.round {
        border-radius: 34px;
    }
    .slider.round:before {
        border-radius: 50%;
    }`;
    document.head.appendChild(sliderStyle);

    const UNACCСEPT_PREFIX = 4; // Prefix that will be set when thread closes
    const ACCСEPT_PREFIX = 8; // Prefix that will be set when thread accepted
    const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
    const PINN_PREFIX = 2; // Prefix that will be set when thread pins
    const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
    const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
    const WATCHED_PREFIX = 9;
    const CLOSE_PREFIX = 7;
    const SPECY_PREFIX = 11;
    const TEXY_PREFIX = 13;
    const OJIDANIE_PREFIX = 14;
    const OTKAZBIOG_PREFIX = 4;
    const ODOBRENOBIO_PREFIX = 8;
    const REALIZOVANO_PREFIX = 5;
    const VAJNO_PREFIX = 1;
    const RASSMOTRENO_PREFIX = 9;
    const NOTKAZRPА_PREFIX = 4;
    const ODOBRENORP_PREFIX = 8;
    const NARASSMOTRENIIRP_PREFIX = 2;
    const buttons = [
      {
        title: 'Свой ответ',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Текст[/CENTER][/SIZE][/B]' +
        '[COLOR=LawnGreen][B]Рассмотрено.[/COLOR][/B]<br>' +
        '[COLOR=rgb(255,0,0)][B]Закрыто.[/COLOR][/B]<unbr><unbr<unbr>' ,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #008080; font-family: JetBrains Mono',
        },
      {
        title: 'Рассмотрение',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Ваша тема взята на рассмотрение, ожидайте ответ в ближайшее время<br>Часто рассмотрение темы может занять определенное время.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 165, 0)][B]На рассмотрении[/COLOR].[/B]<unbr><unbr<unbr>' ,
            prefix: PINN_PREFIX,
            status: true,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF8C00; font-family: JetBrains Mono',
        },
         {
        title: 'Дублирование',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Подобная жалоба имеется на рассмотрении.<br><u><b>Просьба не создавать идентичные или похожие темы - иначе Ваш форумный аккаунт может быть заблокирован[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
        {
            title: '|-(--(->------ Одобренные жалобы (общие) ------<-)--)-|',
            style: 'width: 97%; border: 3px solid #000000; background: #008000; box-shadow: 0px 0px 5px #fff',
        },
          {
        title: 'НРП поведение',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по пункту правил: [Color=Red]2.01[/COLOR]. Запрещено поведение, нарушающее нормы процессов Role Play режима игры [Color=Red]| Jail 30 минут [/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
        },
       {
        title: 'Уход от РП',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил:[Color=Red]2.02[/COLOR]. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [Color=Red]| Jail 30 минут / Warn.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
        },
         {
        title: 'NonRP вождение',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.03[/color]. Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [Color=Red]| Jail 30 минут.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
        },
        {
        title: 'NonRP обман',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.05[/color]. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [Color=Red]| PermBan.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
        },
        {
        title: 'Аморал действия',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.08[/color]. Запрещена любая форма аморальных действий сексуального характера в сторону игроков [Color=Red]| Jail 30 минут / Warn[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
        },
        {
        title: 'Слив склада',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.09[/color]. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле. [Color=Red]| Ban 15 - 30 дней / PermBan.[/color]<br>[Color=Red]Примечание:[/color] в описании семьи должны быть указаны условия взаимодействия со складом. Если лидер семьи предоставил неограниченный доступ к складу и забыл снять его, администрация не несет ответственности за возможные последствия. Жалобы по данному пункту правил принимаются только от лидера семьи.<br>[Color=Red]Примечание:[/color] исключение всех или части игроков из состава семьи без ведома лидера также считается сливом.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
        },
        {
        title: 'DB',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.13[/color]. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [Color=Red]| Jail 60 минут.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
        },
        {
        title: 'RK',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.14[/color]. Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти [Color=Red]| Jail 30 минут.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
        },
      {
        title: 'ТК',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.15[/color]. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [Color=Red]| Jail 60 минут / Warn.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
        },
        {
        title: 'CK',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.16[/color]. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [Color=Red]| Jail 60 минут / Warn.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
        },
      {
        title: 'PG',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.17[/color]. Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь [Color=Red]| Jail 30 минут.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
        },
      {
        title: 'DM',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.19[/color]. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=Red]| Jail 60 минут.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
        },
       {
        title: 'Mass ДМ',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.20[/color]. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [Color=Red]| Warn / Ban 3 - 7 дней.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
        },
      {
        title: 'Сторонне ПО',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по пункту правил: [Color=Red]2.22[/color]. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=Red]|  Ban 15 - 30 дней / PermBan.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
        },
      {
        title: 'Реклама сторонних ресурсов',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.31[/color]. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное [Color=Red]| Ban 7 дней / PermBan.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
        },
      {
        title: 'Ввод в заблуждение адм',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.32[/color]. Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта [Color=Red]| Ban 7 - 15 дней.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
        },
      {
        title: 'Уяз.правил',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.33[/color]. Запрещено пользоваться уязвимостью правил [Color=Red]| Ban 15 дней.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
        },
      {
        title: 'Уход от наказания',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.34[/color]. Запрещен уход от наказания [Color=Red]| Ban 15 - 30 дней[/color]([Color=Orange]суммируется к общему наказанию дополнительно.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
        },
      {
        title: 'IC и OCC угрозы',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.35[/color]. На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате [Color=Red]| Mute 120 минут / Ban 7 дней.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
        },
      {
        title: 'Спасатель ЭКО',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.04[/color]. Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. [Color=Red]| Ban 10 дней / Обнуление аккаунта (при повторном нарушении).[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
        },
      {
        title: 'IC конфликты в OOC',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.36[/color]. Запрещено переносить конфликты из IC в OOC и наоборот [Color=Red]| Warn.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
        },
      {
        title: 'Угрозы OOC',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по пункту правил: [Color=Red]2.37[/color]. Запрещены OOC угрозы, в том числе и завуалированные [Color=Red]| Mute 120 минут / Ban 7 дней.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
        },
      {
        title: 'Злоуп наказаниями',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по пункту правил: [Color=Red]2.39[/color]. Злоупотребление нарушениями правил сервера [Color=Red]| Ban 7 - 30 дней.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
        },
      {
        title: 'Оск проекта',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.40[/color]. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [Color=Red]| Mute 300 минут / Ban 30 дней[/color] ([Color=Cyan]Ban выдается по согласованию с главным администратором.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
        },
      {
        title: 'Продажа промо',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.43[/color]. Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций [Color=Red]| Mute 120 минут.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
        },
      {
        title: 'ЕПП Фура',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.47[/color]. Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [Color=Red]| Jail 60 минут.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
        },
      {
        title: 'Покупка фам.репы',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.48[/color]. Продажа или покупка репутации семьи любыми способами, скрытие нарушителей, читеров лидером семьи. [Color=Red]| Обнуление рейтинга семьи / Обнуление игрового аккаунта лидера семьи.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
        },
      {
        title: 'Помеха РП процессу',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.51[/color]. Запрещено вмешательство в Role Play процесс с целью помехи и препятствования дальнейшего развития Role Play процесса [Color=Red]| Jail 30 минут.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
        },
       {
        title: 'Нонрп акс',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.52[/color]. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. [Color=Red]| При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
        },
      {
        title: 'Баг аним',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.55[/color]. Запрещается багоюз связанный с анимацией в любых проявлениях. [Color=Red]| Jail 60 / 120 минут .[/color][/CENTER][/SIZE][/B]<br>' +
                '[CENTER][SIZE=4][B][Color=RED]Пример[/color]: если Нарушитель, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде [Color=Red]Jail на 120 минут[/color][/CENTER][/SIZE][/B]<br>' +
                '[CENTER][SIZE=4][B][Color=RED]Пример[/color]: если Нарушитель использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде [Color=Red]Jail на 60 минут[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
        },
        {
            title: '|-(--(->------ Игровые чаты ------<-)--)-|',
            style: 'width: 97%; border: 3px solid #000000; background: #87CEFA; box-shadow: 0px 0px 5px #fff',
        },
      {
        title: 'Оскорбление/неуважение к администрации',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.54[/color]. Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [Color=Red]| Mute 180 минут.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Рассмотрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: RASSMOTRENO_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
      },
       {
        title: 'MG',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.18[/color]. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [Color=Red]| Mute 30 минут.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
       },
      {
        title: 'Транслит',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.01[/color]. Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке [Color=Red]| Устное замечание / Mute 30 минут.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Рассмотрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: RASSMOTRENO_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
      },
      {
        title: 'Капс',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.02[/color]. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [Color=Red]| Mute 30 минут.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Рассмотрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: RASSMOTRENO_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
      },
      {
        title: 'Оск в ООС',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.03[/color]. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [Color=Red]| Mute 30 минут.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Рассмотрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: RASSMOTRENO_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
      },
      {
        title: 'Оск/Упом родни',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил:[Color=Red] 3.04. |[/color] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [Color=Red]| Mute 120 минут / Ban 7 - 15 дней.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Рассмотрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: RASSMOTRENO_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
      },
      {
        title: 'Флуд',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.05[/color]. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [Color=Red]| Mute 30 минут.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Рассмотрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: RASSMOTRENO_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
      },
      {
        title: 'Злоуп знаками',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.06[/color]. Запрещено злоупотребление знаков препинания и прочих символов [Color=Red]| Mute 30 минут.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Рассмотрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: RASSMOTRENO_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
      },
      {
        title: 'Оскорбление сексуального ракатера',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.07[/color]. Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата [Color=Red]| Mute 30 минут.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Рассмотрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: RASSMOTRENO_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
      },
      {
        title: 'Редактирование в л/ц',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]4.04[/color]. Запрещено редактировать поданные объявления в личных целях заменяя текст обьявления на несоответствующий отправленному игроком [Color=Red]| Ban 7 дней + Чс Организации.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Рассмотрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: RASSMOTRENO_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
      },
      {
        title: 'Слив СМИ',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]4.04[/color]. Запрещено редактировать поданные объявления в личных целях заменяя текст обьявления на несоответствующий отправленному игроком [Color=Red]| Ban 7 дней + Чс Организации.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Рассмотрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: RASSMOTRENO_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
      },
      {
        title: 'Угрозы о наказании со стороны адм',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по пункту правил: [Color=Red]3.09[/color]. Запрещены любые угрозы о наказании игрока со стороны администрации [Color=Red]| Mute 30 минут.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Рассмотрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: RASSMOTRENO_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
      },
      {
        title: 'Выдача себя за адм',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.10[/color]. Запрещена выдача себя за администратора, если таковым не являетесь [Color=Red]| Ban 7 - 15 + ЧС администрации.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Рассмотрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: RASSMOTRENO_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
      },
      {
        title: 'Ввод в заблуждение',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил [Color=Red]3.11[/color]. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [Color=Red]| Ban 15 - 30 дней / PermBan.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Рассмотрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: RASSMOTRENO_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
      },
      {
        title: 'Репорт: Капс/Оффтоп/Транслит',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.12[/color]. Запрещено подавать репорт написанный транслитом, с сообщением не по теме (Offtop), с включенным Caps Lock и повторять обращение (если ответ был уже дан ранее) [Color=Red]| Report Mute 30 минут.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Рассмотрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: RASSMOTRENO_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
      },
      {
        title: 'Музыка в voice',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.14[/color]. Запрещено включать музыку в Voice Chat [Color=Red]| Mute 60 минут.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Рассмотрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: RASSMOTRENO_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
      },
      {
        title: 'Оск/Упом род в voice',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.15[/color]. Запрещено оскорблять игроков или родных в Voice Chat [Color=Red]| Mute 120 минут / Ban 7 - 15 дней.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Рассмотрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: RASSMOTRENO_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
      },
      {
        title: 'Шум в voice',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.16[/color]. Запрещено создавать посторонние шумы или звуки [Color=Red]| Mute 30 минут.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Рассмотрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: RASSMOTRENO_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
      },
      {
        title: 'Реклама в voice',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.17[/color]. Запрещена реклама в Voice Chat не связанная с игровым процессом [Color=Red]| Ban 7 - 15 дней.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Рассмотрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: RASSMOTRENO_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
      },
      {
        title: 'Религиозное и политическая пропаганда',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.18[/color]. Запрещено политическое и религиозное пропагандирование [Color=Red]| Mute 120 минут / Ban 10 дней.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Рассмотрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: RASSMOTRENO_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
      },
      {
        title: 'Реклама промо',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.21[/color]. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [Color=Red]| Ban 30 дней.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Рассмотрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: RASSMOTRENO_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
      },
      {
        title: 'Торговля на тт госс',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.22[/color]. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [Color=Red]| Mute 30 минут.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Рассмотрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: RASSMOTRENO_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
      },
        {
            title: 'Положение об игровых аккаунтах',
            style: 'width: 97%; border: 3px solid #000000; background: #6A5ACD; box-shadow: 0px 0px 5px #fff',
        },
{
            title: 'Долги',
            content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.57[/color]. Запрещается брать в долг игровые ценности и не возвращать их. [Color=Red]| Ban 30 дней / permban.[/color][/CENTER][/SIZE][/B]<br>' +
                '[CENTER][SIZE=4][B][Color=RED]Примечание[/color]: займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется;[/CENTER][/SIZE][/B]<br>' +
                '[CENTER][SIZE=4][B][Color=RED]Примечание[/color]: при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда;[/CENTER][/SIZE][/B]<br>' +
                '[CENTER][SIZE=4][B][Color=RED]Примечание[/color]: жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
        },
 {
        title: 'Мультиаккаунт',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]4.04[/color]. Разрешается зарегистрировать максимально только три игровых аккаунта на сервере [Color=Red]| PermBan.[/color][/CENTER][/SIZE][/B]<br>' +
               '[CENTER][SIZE=4][B][Color=RED]Примечание[/color]: блокировке подлежат все аккаунты созданные после третьего твинка.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
      },
      {
        title: 'Фейк',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]4.10[/color]. Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [Color=Red]| Устное замечание + смена игрового никнейма / PermBan.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
      },
      {
            title: 'Продажа ИВ',
            content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.28[/color]. Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги. [Color=Red]| PermBan с обнулением аккаунта + ЧС проекта.[/color][/CENTER][/SIZE][/B]<br>' +
                '[CENTER][SIZE=4][B][Color=RED]Примечание[/color]: любые попытки покупки/продажи, попытки поинтересоваться о ней у другого игрока и прочее - наказуемы.[/CENTER][/SIZE][/B]' +
                '[CENTER][SIZE=4][B][Color=RED]Примечание[/color]: также запрещен обмен доната на игровые ценности и наоборот;[/CENTER][/SIZE][/B]' +
                '[CENTER][SIZE=4][B][Color=RED]Пример[/color]: пополнение донат счет любого игрока взамен на игровые ценности;[/CENTER][/SIZE][/B]' +
                '[CENTER][SIZE=4][B][Color=RED]Исключение[/color]: официальная покупка через сайт.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
        },
        {
            title: '|-(--(->------ Правила государственных организаций ------<-)--)-|',
            style: 'width: 97%; border: 3px solid #000000; background: #5F9EA0; box-shadow: 0px 0px 5px #fff',
        },
      {
        title: 'Прогул Р/Д',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по пунтку правил: [Color=Red]1.07[/color]. Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции [Color=Red]| Jail 30 минут.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
      },
      {
        title: 'Казино/БУ',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по пунтку правил: [Color=Red]1.13[/color]. Запрещено находиться в форме внутри казино, участвовать в битве за контейнеры, участвовать в захвате семейного контейнера, находится на Б/У рынке с целью покупки / продажи авто, а также устраиваться на сторонние работы в форме фракции [Color=Red]| Jail 30 минут.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
      },
      {
        title: 'Исп. фрак т/с в личных целях',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по пунтку правил: [Color=Red]1.08[/color]. Запрещено использование фракционного транспорта в личных целях [Color=Red]| Jail 30 минут.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
      },
      {
        title: 'ДМ/Масс дм от МО',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по пунтку правил: [Color=Red]2.02[/color]. Наносить урон игрокам, которые находятся вне территории воинской части, запрещено [Color=Red]| Jail 30 минут / Warn.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
      },
      {
        title: 'Н/П/Р/О (Объявы)',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по пунтку правил: [Color=Red]4.01[/color]. Запрещено редактирование объявлений, не соответствующих ПРО [Color=Red]| Mute 30 минут.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
      },
      {
        title: 'Н/П/П/Э (Эфиры)',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по пунтку правил: [Color=Red]4.02[/color]. Запрещено проведение эфиров, не соответствующих Role Play правилам и логике [Color=Red]| Mute 30 минут.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
      },
      {
        title: 'Задержание в интерьере',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.50[/color]. Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий  [Color=Red]| Ban 7 - 15 дней + увольнение из организации.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
      },
      {
        title: 'ДМ/Масс от УМВД',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по пунтку правил: [Color=Red]6.01[/color]. Запрещено наносить урон игрокам без Role Play причины на территории УМВД [Color=Red]| Jail 30 минут / Warn.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
      },
      {
        title: 'Розыск без причины(УМВД)',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по пунтку правил: [Color=Red]6.02[/color]. Запрещено выдавать розыск без Role Play причины [Color=Red]| Warn.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
      },
      {
        title: 'Задержание без РП(Нонрп коп)(УМВД)',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по пунтку правил: [Color=Red]6.03[/color]. Запрещено оказывать задержание без Role Play отыгровки [Color=Red]| Warn.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
      },
      {
        title: 'Нонрп поведение(УМВД)',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по пунтку правил: [Color=Red]6.04[/color]. Запрещено nRP поведение [Color=Red]| Warn.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
      },
      {
        title: 'ДМ/Масс от ГИБДД',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по пунтку правил: [Color=Red]7.01[/color]. Запрещено наносить урон игрокам без Role Play причины на территории ГИБДД [Color=Red]| Jail 30 минут / Warn.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
      },
      {
        title: 'Штраф без RP (ГИБДД)',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по пунтку правил: [Color=Red]7.02[/color]. Запрещено выдавать розыск, штраф без Role Play причины [Color=Red]| Warn.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
      },
      {
        title: 'Розыск без причины (ГИБДД)',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по пунтку правил: [Color=Red]6.02[/color]. Запрещено выдавать розыск без Role Play причины [Color=Red]| Warn.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
      },
      {
        title: 'Задержание без РП (Нонрп коп) (ГИБДД)',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по пунтку правил: [Color=Red]7.03[/color]. Запрещено оказывать задержание без Role Play отыгровки [Color=Red]| Warn.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
      },
      {
        title: 'Забирание В/У во время погони(ГИБДД)',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по пунтку правил: [Color=Red]7.05[/color]. Запрещено отбирать водительские права во время погони за нарушителем [Color=Red]| Warn.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
      },
      {
        title: 'ДМ/Масс от ФСБ',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по пунтку правил: [Color=Red]8.01[/color]. Запрещено наносить урон игрокам без Role Play причины на территории ФСБ [Color=Red]| Jail 30 минут / Warn.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
      },
      {
        title: 'Розыск без причины (ФСБ)',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по пунтку правил: [Color=Red]8.02[/color]. Запрещено выдавать розыск без Role Play причины [Color=Red]| Warn.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
      },
      {
        title: 'Задержание без РП (Нонрп коп) (УФСБ)',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по пунтку правил: [Color=Red]8.03[/color]. Запрещено оказывать задержание без Role Play отыгровки [Color=Red]| Warn.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
      },
      {
        title: 'Урон на территории ФСИН без причины',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по пунтку правил: [Color=Red]9.01[/color]. Запрещено наносить урон игрокам без Role Play причины на территории ФСИН [Color=Red]| Jail 30 минут / Warn.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
      },
        {
            title: '|-(--(->------ Правила криминальных организаций ------<-)--)-|',
            style: 'width: 97%; border: 3px solid #000000; background: #000080; box-shadow: 0px 0px 5px #fff',
        },
      {
        title: 'Нарушение правил В/Ч',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по пунтку правил: За нарушение правил нападения на [Color=Orange]Войсковую Часть[/color] выдаётся предупреждение [Color=Red]| Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ).[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
      },
      {
        title: 'Нападение на В/Ч через стену',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан по пунтку правил: Нападение на [Color=Orange]военную часть[/color] разрешено только через блокпост КПП с последовательностью взлома [Color=Red]| Warn NonRP В/Ч.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
      },
      {
        title: 'Похищение/Ограбления нарушение правил',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушитель будет наказан за Нонрп Ограбление\Похищениее в соответствии с [URL=https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BE%D0%B3%D1%80%D0%B0%D0%B1%D0%BB%D0%B5%D0%BD%D0%B8%D0%B9-%D0%B8-%D0%BF%D0%BE%D1%85%D0%B8%D1%89%D0%B5%D0%BD%D0%B8%D0%B9.29/]правилами похищений и ограблений.[/URL][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
      },
        {
            title: '|-(--(->------ Отказанные жалобы ------<-)--)-|',
            style: 'width: 97%; border: 3px solid #000000; background: #FF0000; box-shadow: 0px 0px 5px #fff',
        },
            {
        title: 'Нет доказательств',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]В вашей жалобе отсутствуют доказательства.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: UNACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'Неадекватная жалоба',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]В Вашей жалобе содержатся неадекватные высказывание и/или неадекватное отношение к игрокам проекта и/или политические и религиозные высказывания.[/color][/CENTER][/SIZE][/B]<br>' +
        '[CENTER][SIZE=4][B]По крайней мере Ваши действия и слова нарушают правила данной площадки, а так же провила подачи жалоб.[/color][/CENTER][/SIZE][/B]<br>' +
                '[CENTER][SIZE=4][B]К нашему большому сожалению, но увы, мы не можем продолжить рассмотрение Вашей жалобы.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: UNACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'Нарушений не найдено',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Нарушений со стороны данного игрока не было найдено.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: UNACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'Сборка на док-вах',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Вы используете не оригинальные файлы игры (сборку), поэтому ваша жалоба не подлежит рассмотрению.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: UNACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'Недостаточно доказательств',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Недостаточно доказательств на нарушение от данного игрока.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: UNACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'Недостаточно док-в слив склада',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]В таких случаях нужно включить видеозапись и показать, что вы являетесь лидером, какие ограничения на взятие патронов, а также сам слив от игрока.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: UNACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'В жалобы на админов',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Вы ошиблись разделом. Обратитесь в раздел [Color=Red]Жалобы на администрацию[/color].[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: UNACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'В обжалования',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Вы ошиблись разделом. Обратитесь в раздел [Color=Red]Обжалование наказаний[/color].[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: UNACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'Форма подачи',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Ваша жалоба составлена не по форме. Убедительная просьба ознакомиться с [URL=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/]правилами подачи жалоб на игроков[/URL].[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: UNACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'Нету /time',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]На ваших доказательствах отсутствует /time.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: UNACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'Доступ закрыт (Google Disk)',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Доступ к вашим доказательствам закрыт. [url=https://postimages.org/][img]https://i.postimg.cc/8C2PPQdd/150.png[/img][/url].[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: UNACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'Доступ закрыт (Imgur)',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Доступ к вашим доказательствам закрыт.<br>[IMG]https://i.postimg.cc/pLxYY81H/151.png[/IMG][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: UNACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'Заголовок не по форме',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Заголовок вашей жалобы составлен не по форме. Убедительная просьба ознакомиться [Color=Red]с правилами подачи жалоб на игроков[/color].[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: UNACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'Более 72 часов',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]С момента нарушения прошло более 72 часов.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: UNACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'Док-ва через запрет соц. сети',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur)..[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: UNACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'Нет условий сделки',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]На данных доказательствах нет условий сделки между игроками.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'Нет /time',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]На доказательствах отсутствует /time.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'Нужен фрапс',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]В таких случаях нужен фрапс.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'Сомнения в подлинности доказательств',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]У администрации появились сомнения в подлинности доказательств, которые Вы предоставили в данной жалобе!.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'Нужен фрапс + промотка чата',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]В таких случаях нужен фрапс + промотка чата.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'Нужна промотка чата',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]В таких случаях нужна промотка чата.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'Неполный фрапс',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Фрапс обрывается. Загрузите полный фрапс на YouTube.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: UNACCСEPT_PREFIX,
            status: false,
                        style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'Не работают док-ва',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Предоставленные доказательства не работают.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'Доказательства отредактированы',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]На Ваших доказательствах видно, что они отредактированы.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'От 3-го лица',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Жалобы от 3-их лиц не принимаются.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'Ошиблись разделом',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Вы ошиблись разделом/сервером, перепадайте вашу жалобу в нужный раздел/сервер.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'Обратитесь в жб на сотруд',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Вы ошиблись разделом, переподайте свою жалобу в раздел жалоб на сотрудников организации.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'Док-ва не рабочие',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Ваши доказательства не рабочие/обрезанные, перезалейте их правильно и без обрезаний.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'Фотохостинги',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Доказательства должны быть загружены на Yapx/Imgur/YouTube.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'Неправильно указанный ник',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Вы неправильно указали свой никнейм/никнейм игрока.<br>Пожалуйста, перепроверьте правильность написания никнейма и создайте ещё одну тему.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'Оффтоп',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Ваше сообщение выходит за рамки темы этого раздела. Убедительно просим ознакомиться с назначением данного раздел.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'Долги',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Недостаточно доказательств на нарушение от данного игрока. Долги должны выдаваться через банковский счёт.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'Нужны TIMECODE',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]При видеозаписе длинее трёх минут нужны тайм-коды.<br>ХХ:ХХ - Начало (Условия и т.д.)<br>ХХ:ХХ момент сделки (обен и т.д.)<br>ХХ:ХХ - Момент обмана (Когда вас обмануи).[/CENTER][/SIZE][/B]<br>' +
        '[CENTER][SIZE=4][B][Color=RED]Примечание[/color]:заместо ХХ:ХХ пишите ваше время.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: UNACCСEPT_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'Нет в логах',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Проверив логи нарушений не обнаружено.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Закрыто.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
       {
        title: 'Нельзя проверить через логи',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Данное нарушение нельзя проверить с помощью логов.<br>В данной ситуации нужен фрапс.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Закрыто.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: CLOSE_PREFIX,
            status: false,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
        {
            title: '|-(--(->------ Передача жалоб ------<-)--)-|',
            style: 'width: 97%; border: 3px solid #000000; background: #FF8C00; box-shadow: 0px 0px 5px #fff',
        },
       {
            title: 'ГКФ/ЗГКФ',
            content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Ваша тема передана на рассмотрение Главному куратору форума/Заместителю главного куратора форума.<br>Часто рассмотрение темы может занять определенное время.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 165, 0)][B]На рассмотрении[/COLOR].[/B]<unbr><unbr<unbr>' ,
            prefix: PINN_PREFIX,
            status: true,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF8C00; font-family: JetBrains Mono',
        },
        {
            title: 'Техническому специалисту',
            content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Ваша тема передана на рассмотрение техническому специалисту.<br>Часто рассмотрение темы может занять определенное время.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 165, 0)][B]На рассмотрении[/COLOR].[/B]<unbr><unbr<unbr>' ,
            prefix: TEXY_PREFIX,
            status: true,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF8C00; font-family: JetBrains Mono',
        },
        {
            title: 'Передано ГА',
            content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Ваша жалоба была передана на рассмотрение [Color=Red]Главному Администратору[/color] - @Rage_Exett<br>Часто рассмотрение темы может занять определенное время.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 165, 0)][B]На рассмотрении[/COLOR].[/B]<unbr><unbr<unbr>' ,
            prefix: GA_PREFIX,
            status: true,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF8C00; font-family: JetBrains Mono',
        },
        {
            title: 'Спец.администратору',
            content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Ваша жалоба была передана на рассмотрение [Color=Red]Специальной администрации[/color]<br>Часто рассмотрение темы может занять определенное время.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 165, 0)][B]На рассмотрении[/COLOR].[/B]<unbr><unbr<unbr>' ,
            prefix: SPECY_PREFIX,
            status: true,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF8C00; font-family: JetBrains Mono',
        },
        {
            title: '|-(--(->------ RolePlay биографии ------<-)--)-|',
            style: 'width: 97%; border: 3px solid #000000; background: #808080; box-shadow: 0px 0px 5px #fff',
        },
      {
        title: 'Одобрена',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Ваша RolePlay биография получает статус - [Color=LawnGreen]Одобрено.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ODOBRENOBIO_PREFIX,
            status: true,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
        },
      {
        title: 'На доработку (Ошибки)',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Ваша RolePlay биография на доработке, пожалуйста исправьте ошибки в своей биографии.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 165, 0)][B]На рассмотрении.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: PINN_PREFIX,
            status: true,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF8C00; font-family: JetBrains Mono',
        },
      {
        title: 'Биография не по форме',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Ваша РП биография составлена не по форме.<br>Форма подачи:<br>[CODE]1. Имя Фамилия:<br>2. Пол:<br>3. Национальность:<br>4. Возраст:<br>5. Дата и место рождения:<br>6. Семья:<br>7. Место текущего проживания:<br>8. Описание внешности:<br>9. Особенности характера:<br>10. ( От сюда требуется расписать каждый из пунктов ) Детство:<br>11. Юность и взрослая жизнь:<br>12. Настоящее время:<br>13. Хобби:[/CODE].[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ODOBRENOBIO_PREFIX,
            prefix: OTKAZBIOG_PREFIX,
            status: false,
            transfer: true,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'Уже есть одна на доработке',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]У вас уже имеется RolePlay биография на рассмотрении, работайте там.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ODOBRENOBIO_PREFIX,
            prefix: OTKAZBIOG_PREFIX,
            status: false,
            transfer: true,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'Место рождения',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]У вас не совпадает место рожденмя..[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ODOBRENOBIO_PREFIX,
            prefix: OTKAZBIOG_PREFIX,
            status: false,
            transfer: true,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'Копипаст',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Ваша RolePlay биография скопирована/украдена.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ODOBRENOBIO_PREFIX,
            prefix: OTKAZBIOG_PREFIX,
            status: false,
            transfer: true,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'От 3 лица',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Ваша RolePlay биография от 3-го лица.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ODOBRENOBIO_PREFIX,
            prefix: OTKAZBIOG_PREFIX,
            status: false,
            transfer: true,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'Нет места рождения',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]В вашей RolePlay биографии нет  места рождения.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ODOBRENOBIO_PREFIX,
            prefix: OTKAZBIOG_PREFIX,
            status: false,
            transfer: true,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'Ошибки',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Ваша RolePlay биография имеет большое количество ошибок.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ODOBRENOBIO_PREFIX,
            prefix: OTKAZBIOG_PREFIX,
            status: false,
            transfer: true,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'Ошибка в возрасте/дате',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]В вашей RolePlay биографии не совпадает возраст/дата рождения.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ODOBRENOBIO_PREFIX,
            prefix: OTKAZBIOG_PREFIX,
            status: false,
            transfer: true,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'Нет города',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]В вашей RolePlay биографии указан город которого нет на игровой карте.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ODOBRENOBIO_PREFIX,
            prefix: OTKAZBIOG_PREFIX,
            status: false,
            transfer: true,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'Нет даты рождения',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]В вашей RolePlay биографии нет даты рождения.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ODOBRENOBIO_PREFIX,
            prefix: OTKAZBIOG_PREFIX,
            status: false,
            transfer: true,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'Нет 18',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]В вашей RolePlay биографии возраст менее 18 лет.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ODOBRENOBIO_PREFIX,
            prefix: OTKAZBIOG_PREFIX,
            status: false,
            transfer: true,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'Мало инфы',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]В вашей RolePlay биографии мало информации.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ODOBRENOBIO_PREFIX,
            prefix: OTKAZBIOG_PREFIX,
            status: false,
            transfer: true,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'Заголовок',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]В вашей RolePlay биографии неправильно указан заголовок<br>Заголовок должен быть в формате "RolePlay биография гражданина Лёши Лорензо".[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ODOBRENOBIO_PREFIX,
            prefix: OTKAZBIOG_PREFIX,
            status: false,
            transfer: true,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'Есть одобренная',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]У вас уже имеется одобренная RolePlay биография.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ODOBRENOBIO_PREFIX,
            prefix: OTKAZBIOG_PREFIX,
            status: false,
            transfer: true,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'Разные ники',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]В вашей RolePlay биографии указаны разные НикНеймы.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ODOBRENOBIO_PREFIX,
            prefix: OTKAZBIOG_PREFIX,
            status: false,
            transfer: true,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'Мало инфы в Детстве',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Мало информации в пункте "Детство".[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ODOBRENOBIO_PREFIX,
            prefix: OTKAZBIOG_PREFIX,
            status: false,
            transfer: true,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'Мало инфы в Юность и взрослая жизнь',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Мало информации в пункте "Юность и взрослая жизнь".[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ODOBRENOBIO_PREFIX,
            prefix: OTKAZBIOG_PREFIX,
            status: false,
            transfer: true,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'Мало инфы в Настоящем времени',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Мало информации в пункте "Настоящее время".[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ODOBRENOBIO_PREFIX,
            prefix: OTKAZBIOG_PREFIX,
            status: false,
            transfer: true,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'Неправильный Ник',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]В пункте "Имя Фамилия" неправильно указан ник.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ODOBRENOBIO_PREFIX,
            prefix: OTKAZBIOG_PREFIX,
            status: false,
            transfer: true,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
      {
        title: 'Некорректная дата рождения',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]В вашей RolePlay биографии указана некорректная дата рождения.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ODOBRENOBIO_PREFIX,
            prefix: OTKAZBIOG_PREFIX,
            status: false,
            transfer: true,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
        {
            title: 'RP ситуации',
            style: 'width: 97%; border: 3px solid #000000; background: #800080; box-shadow: 0px 0px 5px #fff',
        },
      {
        title: 'Одобрена',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Ваша RolePlay ситуация получает статус - [Color=LawnGreen]Одобрено.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ODOBRENORP_PREFIX,
            status: false,
            rptransfer: true,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
        },
      {
        title: 'На рассмотрение',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Ваша RolePlay ситуация взята [Color=Orange]на рассмортение.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 165, 0)][B]На рассмотрении[/COLOR].[/B]<unbr><unbr<unbr>' ,
            prefix: NARASSMOTRENIIRP_PREFIX,
            status: false,
            rptransfer: true,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF8C00; font-family: JetBrains Mono',
        },
      {
        title: 'Отказана',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Ваша RolePlay биография получает статус - [Color=Red]Отказано.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: NOTKAZRPА_PREFIX,
            status: false,
            rptransfer: true,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
  {
            title: 'RP Организации',
            style: 'width: 97%; border: 3px solid #000000; background: #808000; box-shadow: 0px 0px 5px #fff',
        },
      {
        title: 'Одобрено',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Ваша RolePlay организация получает статус - [Color=rgb(124, 252, 0)]Одобрено.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(124, 252, 0)][B]Одобрено.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: ACCСEPT_PREFIX,
            status: false,
            rptransfer: true,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #008000; font-family: JetBrains Mono',
        },
      {
        title: 'На доработку',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Ваша RolePlay организация отправлена на доработку.[/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 165, 0)][B]На рассмотрении.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: PINN_PREFIX,
            status: false,
            rptransfer: true,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF8C00; font-family: JetBrains Mono',
        },
      {
        title: 'Отказана',
        content:
        '[CENTER][SIZE=4][COLOR=rgb(247, 218, 100)][B]Доброго времени суток уважаемый игрок.[/B][/COLOR]<br><br>' +
        '[CENTER][SIZE=4][B]Ваша RolePlay организация получает статус - [Color=Red]Отказано.[/color][/CENTER][/SIZE][/B]<br>' +
        '[COLOR=rgb(255, 0, 0)][B]Отказано.[/COLOR][/B]<unbr><unbr<unbr>' ,
            prefix: UNACCСEPT_PREFIX,
            status: false,
            rptransfer: true,
            style: 'border-radius: 25px; border: 2px solid #000000; background: #FF0000; font-family: JetBrains Mono',
        },
    ];

    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

        // Добавление кнопок при загрузке страницы
        addButton('На рассмотрении', 'pin', 'background: #FF8C00; border: 2px solid #000000; border-radius: 8px; font-family: JetBrains Mono');
        addButton('Рассмотрено', 'Rassmotreno', 'background: #32CD32; border: 2px solid #000000; border-radius: 8px; font-family: JetBrains Mono');
        addButton('Важно', 'Vajno', 'background: #8B0000; border: 2px solid #000000; border-radius: 8px; font-family: JetBrains Mono');
        addButton('Команде Проекта', 'teamProject', 'background: #000080; border: 2px solid #000000; border-radius: 8px; font-family: JetBrains Mono');
        addButton('ГА', 'Ga', 'background: #FF0000; border: 2px solid #000000; border-radius: 8px; font-family: JetBrains Mono');
        addButton('Спецу', 'Spec', 'background: #FF0000; border: 2px solid #000000; border-radius: 8px; font-family: JetBrains Mono');
        addButton('Одобрено', 'accepted', 'background: #32CD32; border: 2px solid #000000; border-radius: 8px; font-family: JetBrains Mono');
        addButton('Отказано', 'unaccept', 'background: #FF0000; border: 2px solid #000000; border-radius: 8px; font-family: JetBrains Mono');
        addButton('Теху', 'Texy', 'background: #FFA500; border: 2px solid #000000; border-radius: 8px; font-family: JetBrains Mono');
        addButton('Закрыто', 'Zakrito', 'background: #FF0000; border: 2px solid #000000; border-radius: 8px; font-family: JetBrains Mono');
        addButton('Ожидание', 'Ojidanie', 'background: #444444ff; border: 2px solid #000000; border-radius: 8px; font-family: JetBrains Mono');
        addAnswers();

        // Поиск информации о теме
        const threadData = getThreadData();

        $('button#pin').click(() => editThreadData(PINN_PREFIX, true, false));
        $('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, false, false));
        $('button#Ga').click(() => editThreadData(GA_PREFIX, true, false));
        $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true, false));
        $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true, false));
        $('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, false, false));
        $('button#Texy').click(() => editThreadData(TEXY_PREFIX, false, false));
        $('button#Resheno').click(() => editThreadData(RESHENO_PREFIX, false, false));
        $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false, false));
        $('button#Realizovano').click(() => editThreadData(REALIZOVANO_PREFIX, false, false));
        $('button#Vajno').click(() => editThreadData(VAJNO_PREFIX, false, false));
        $('button#Rassmotreno').click(() => editThreadData(RASSMOTRENO_PREFIX, false, false));
        $('button#Ojidanie').click(() => editThreadData(OJIDANIE_PREFIX, false, false));

        $(`button#selectAnswer`).click(() => {
         XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
         buttons.forEach((btn, id) => {
         if (id > 0) {
         $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
        }
        else {
             $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
          }
         });
          });

        $(`button#Info`).click(() => {
            XF.alert(infoAlert(), null, 'Информация:');
        });

        $(`button#Help`).click(() => {
            XF.alert(helpAlert(), null, 'Памятка по работе с форумом:');
        });
    });

    function addButton(name, id, style) {
        $('.button--icon--reply').before(
            `<button type="button" class="button rippleButton" id="${id}" style="margin: 3px; ${style}">${name}</button>`,
        );
    }
    function addAnswers() {
        $('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 5px; margin-left: 5px; border: 2px solid; border-radius: 25px; background: #800000; padding: 3px 3px 3px 3px; font-family: JetBrains Mono; border-color: #000000;">Ответы</button>`,
        );
    }

    function buttonsMarkup(buttons) {
        return `<div class="select_answer" style="display:flex; flex-direction:row; flex-wrap:wrap">${buttons
            .map(
                (btn, i) =>
                    `<button id="answers-${i}" class="button--primary button ` +
                    `rippleButton" style="margin:5px; ${btn.style}"><span class="button-text">${btn.title}</span></button>`,
            )
            .join('')}</div>`;
    }

    function infoAlert() {
        return `<div class="bug_tracker" style="display:flex; flex-direction:column; flex-wrap:wrap">` +
            `<span class="button-text" style="margin-bottom: 20px; text-align: center; font-size: 16px; font-weight: 500; background: #34aaeb; padding: 5px; border-radius: 15px"></span>` +
            `<button class="button--primary button rippleButton" style="margin-bottom: 20px; border-radius: 15px; background: #008209; flex-grow: 1;"><a href="https://t.me/arefuer" target="_blank"  class="button-text">Telegram arefuer</a></button>` +
            `<button class="button--primary button rippleButton" style="margin-bottom: 20px; border-radius: 15px; background: #008209; flex-grow: 1;"><a href="https://t.me/solukky" target="_blank" class="button-text">Telegram lukky(бывший)</a></button>` +
            `<button class="button--primary button rippleButton" style="margin-bottom: 20px; border-radius: 15px; background: #008209; flex-grow: 1;"><a href="https://greasyfork.org/ru/users/1088949-arefuer" target="_blank" class="button-text">greasyfork</a></button>` +
            `<span class="button-text" style="margin: 0 auto 0; text-align: center; font-size: 16px; font-weight: 500; background: #34aaeb; padding: 10px; border-radius: 25px">by R.Kalashnikov & S.Sinclair</span></div>`;
    }

    function helpAlert() {
        return `<div class="help_menu" style="display:flex; flex-direction:column; flex-wrap:wrap">` +
            `<span class="button-text" style="margin-bottom: 10px; text-align: left; font-size: 14px; font-weight: 500; background: #008209; padding: 10px; border-radius: 20px">Форма для подачи жалобы на игроков.<br>1. Ваш Nick_Name: текст<br>2. Nick_Name игрока: текст<br>3. Суть жалобы: текст<br>4. Доказательство: текст/ссылка</span>` +
            `<span class="button-text" style="margin-bottom: 10px; text-align: left; font-size: 14px; font-weight: 500; background: #008209; padding: 10px; border-radius: 20px">2. На доработке</span>` +
            `<span class="button-text" style="margin-bottom: 10px; text-align: left; font-size: 14px; font-weight: 500; background: #008209; padding: 10px; border-radius: 20px">3. На доработке</span>` +
            `<span class="button-text" style="margin-bottom: 10px; text-align: left; font-size: 14px; font-weight: 500; background: #008209; padding: 10px; border-radius: 20px">4. На доработке</span>` +
            `<span class="button-text" style="margin-bottom: 10px; text-align: left; font-size: 14px; font-weight: 500; background: #008209; padding: 10px; border-radius: 20px">5. На доработке</span>`;
    }

    function pasteContent(id, data = {}, send = false) {
        const template = Handlebars.compile(buttons[id].content);
        if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

        $('span.fr-placeholder').empty();
        $('div.fr-element.fr-view p').append(template(data));
        $('a.overlay-titleCloser').trigger('click');

        if (send == true) {
            editThreadData(buttons[id].prefix, buttons[id].status, buttons[id].transfer, buttons[id].rptransfer);
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
                6 < hours && hours <= 11 ?
                    'Доброе утро' :
                    12 < hours && hours <= 17 ?
                        'Добрый день' :
                        18 < hours && hours <= 23 ?
                            'Добрый вечер' :
                            0 < hours && hours <= 5 ?
                                'Доброй ночи' :
                                'Доброй ночи',
        };
    }

    function editThreadData(prefix, pin = false, transfer = false, rptransfer = false) {
        // Получаем заголовок темы, так как он необходим при запросе
        const threadTitle = $('.p-title-value')[0].lastChild.textContent;

        if (pin == false) {
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
        if (pin == true) {
            fetch(`${document.URL}edit`, {
                method: 'POST',
                body: getFormData({
                    prefix_id: prefix,
                    title: threadTitle,
                    discussion_open: 0,
                    sticky: 1,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: 'json',
                }),
            }).then(() => location.reload());
        }
        if (transfer === true) {
            if (prefix == ODOBRENOBIO_PREFIX) {
                moveThread(prefix, 1535);
            }
            if (prefix == OTKAZBIOG_PREFIX) {
                moveThread(prefix, 1537);
            }
        }
        if (rptransfer === true){
            if (prefix == ODOBRENORP_PREFIX) {
                moveThread(prefix, 1532);
            }
            if (prefix == NOTKAZRPА_PREFIX) {
                moveThread(prefix, 1534);
            }
            if (prefix == NARASSMOTRENIIRP_PREFIX) {
                moveThread(prefix, 1533);
            }
        }
    }


    function moveThread(prefix, type) {
        // Перемещение темы
        const threadTitle = $('.p-title-value')[0].lastChild.textContent;

        fetch(`${document.URL}move`, {
          method: 'POST',
          body: getFormData({
            prefix_id: prefix,
            title: threadTitle,
            target_node_id: type,
            redirect_type: 'none',
            notify_watchers: 1,
            starter_alert: 1,
            starter_alert_reason: "",
            _xfToken: XF.config.csrf,
            _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
            _xfWithData: 1,
            _xfResponseType: 'json',
          }),
        }).then(() => location.reload());
        }

        function getFormData(data) {
            const formData = new FormData();
            Object.entries(data).forEach(i => formData.append(i[0], i[1]));
            return formData;
          }

})();