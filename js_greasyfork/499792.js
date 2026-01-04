// ==UserScript==
// @name         Скрипт для КФ Краснодар | by Kasenov
// @namespace    https://forum.blackrussia.online/
// @version      1.0.0
// @description  Не есть желтый снег!
// @author       Tilek Kasenov
// @match        https://forum.blackrussia.online/threads/9093955/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=blackrussia.online
// @grant        none
// @license 	 MIT
// @collaborator none
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/499792/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%20%D0%9A%D1%80%D0%B0%D1%81%D0%BD%D0%BE%D0%B4%D0%B0%D1%80%20%7C%20by%20Kasenov.user.js
// @updateURL https://update.greasyfork.org/scripts/499792/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%20%D0%9A%D1%80%D0%B0%D1%81%D0%BD%D0%BE%D0%B4%D0%B0%D1%80%20%7C%20by%20Kasenov.meta.js
// ==/UserScript==

(function() {
    'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const CLOSE_PREFIX = 7; // Prefix that will be set when thread closes.
const WATCHED_PREFIX = 9;
const TEX_PREFIX = 13;
const buttons = [

    {
        title:' ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ Доказательстваㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ',
    },
    {
        title:'На рассмотрение',
        content:"[center][font=trebuchet ms][color=rgb(255, 0, 0)][size=4] Приветствую.[/size][/color]<br><br>"+
        "Ваша жалоба взята на рассмотрение. Ожидайте вердикта. <br><br>"+
        "[FONT=trebuchet ms][SIZE=4][COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/CENTER][/SIZE][/FONT]",
        prefix: PIN_PREFIX,
        status: true
    },
    {
        title:'Не достат док-ств',
        content:"[center][font=trebuchet ms][color=rgb(255, 0, 0)][size=4] Приветствую.[/size][/color]<br><br>"+
        "В вашей теме недостаточно доказательств для дальнейшего рассмотрение жалобы.<br<br>"+
        "[COLOR=rgb(255, 0, 0)][FONT=trebuchet ms][SIZE=4]Отказано. Закрыто[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4][COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/CENTER][/SIZE][/FONT]",
        prefix: UNACCEPT_PREFIX,
        status: false
    },
    {
        title:'Докв нет',
        content:"[center][font=trebuchet ms][color=rgb(255, 0, 0)][size=4] Приветствую.[/size][/color]<br><br>"+
        "В вашей теме отсутствуют доказательства-соответственно дальнейшему рассмотрению не подлежит.[/font]<br><br>"+
        "[COLOR=rgb(255, 0, 0)][FONT=trebuchet ms][SIZE=4]Отказано. Закрыто[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4][COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/CENTER][/SIZE][/FONT]",
        prefix: UNACCEPT_PREFIX,
        status: false
    },
    {
        title:'Докв редакт',
        content:"[center][font=trebuchet ms][color=rgb(255, 0, 0)][size=4] Приветствую.[/size][/color]<br><br>"+
        "В вашей теме доказательства были подвергнуты редактировнию - соответственно дальнейшему рассмотрению не подлежит. [/font]<br>,br>"+
        "[COLOR=rgb(255, 0, 0)][FONT=trebuchet ms][SIZE=4]Отказано. Закрыто[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4][COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/CENTER][/SIZE][/FONT]",
        prefix: UNACCEPT_PREFIX,
        status: false
    },
    {
        title:'Нет /time',
        content:"[center][font=trebuchet ms][color=rgb(255, 0, 0)][size=4] Приветствую.[/size][/color]<br><br>"+
        "В доказательствах отсутствуют дата и время (/time) - соответственно дальнейшему рассмотрению не подлежит.[/font]<br><br>"+
        "[COLOR=rgb(255, 0, 0)][FONT=trebuchet ms][SIZE=4]Отказано. Закрыто[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4][COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/CENTER][/SIZE][/FONT]",
        prefix: UNACCEPT_PREFIX,
        status: false
    },
    {
        title:'Не по форме',
        content:"[center][font=trebuchet ms][color=rgb(255, 0, 0)][size=4] Приветствую.[/size][/color]<br><br>"+
        "Ваша жалоба была написана не по форме. Ознакомьтесь с правилами подачи жалоб на игроков.[/font]<br><br>"+
        "[COLOR=rgb(255, 0, 0)][FONT=trebuchet ms][SIZE=4]Отказано. Закрыто[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]SIZE=4][COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/CENTER][/SIZE][/FONT]",
        prefix: UNACCEPT_PREFIX,
        status: false
    },
    {
        title:'Доква в соц сетях',
        content:"[center][font=trebuchet ms][color=rgb(255, 0, 0)][size=4] Приветствую.[/size][/color]<br><br>"+
        "Доказательства в социальных сетях и т.д. не принимаются - следовательно, дальнейшему рассмотрению не подлежит. Загрузите доказательства на фото-видео хостинги YouTube,Imgur, Yapx и так далее.[/font]<br><br>"+
        "[COLOR=rgb(255, 0, 0)][FONT=trebuchet ms][SIZE=4]Отказано. Закрыто[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4][COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/CENTER][/SIZE][/FONT]",
        prefix: UNACCEPT_PREFIX,
        status: false
    },
    {
        title:'От 3-его лица',
        content:"[center][font=trebuchet ms][color=rgb(255, 0, 0)][size=4] Приветствую.[/size][/color]<br><br>"+
        "Жалоба была подана от 3-его лица - соответственно дальнейшему рассмотрению не подлежит.[/font]<br><br>"+
        "[COLOR=rgb(255, 0, 0)][FONT=trebuchet ms][SIZE=4]Отказано. Закрыто[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4][COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/CENTER][/SIZE][/FONT]",
        prefix: UNACCEPT_PREFIX,
        status: false
    },
    {
        title:'Прошло 72 часа',
        content:"[center][font=trebuchet ms][color=rgb(255, 0, 0)][size=4] Приветствую.[/size][/color]<br><br>"+
        " С момента нарушении уже прошло 72 часа - соответственно жалоба дальнейшему рассмотрению не подлежит.[/font]<br><br>"+
        "[COLOR=rgb(255, 0, 0)][FONT=trebuchet ms][SIZE=4]Отказано. Закрыто[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4][COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/CENTER][/SIZE][/FONT]",
        prefix: UNACCEPT_PREFIX,
        status: false
    },
    {
        title:'Не можем подтвердить',
        content:"[center][font=trebuchet ms][color=rgb(255, 0, 0)][size=4] Приветствую.[/size][/color]<br><br>"+
        "Из-за частых попыток подделать доказательства, нарушение требует повторной проверки со стороны администрации, в данный момент администрация не может подтвердить данное нарушение.[/font]<br><br>"+
        "[COLOR=rgb(255, 0, 0)][FONT=trebuchet ms][SIZE=4]Отказано. Закрыто[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4][COLOR=btn=document.createElement('BUTTON')rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/CENTER][/SIZE][/FONT]",
        prefix: UNACCEPT_PREFIX,
        status: false
    },
    {
        title:'Доква не рабочие',
        content:"[center][font=trebuchet ms][color=rgb(255, 0, 0)][size=4] Приветствую.[/size][/color]<br><br>"+
        "В вашей жалобе доказательства не рабочие или ссылка неправильная - соответственно рассмотрению не подлежит. [/font]<br><br>"+
        "[COLOR=rgb(255, 0, 0)][FONT=trebuchet ms][SIZE=4]Отказано. Закрыто[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4][COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/CENTER][/SIZE][/FONT]",
        prefix: UNACCEPT_PREFIX,
        status: false
    },
    {
        title:' ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ Нарушение в чатахㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ',
    },
    {
        title:'Оск',
        content:"[center][font=trebuchet ms][color=rgb(255, 0, 0)][size=4] Приветствую.[/font][/size][/color]<br><br>"+
        "[FONT=trebuchet ms]Игрок получит наказание по следующему пункту правил:<br><br>"+
        "[COLOR=rgb(255, 0, 0)]3.03. [/COLOR]Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены[COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4][COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/CENTER][/SIZE][/FONT]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title:'Упом/Оск род',
        content:"[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок получит наказание по следующему пункту правил:<br><br>"+
        "[COLOR=rgb(255, 0, 0)]3.04. [/COLOR]Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC)[COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 7 - 15 дней[/COLOR]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4][COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title:'CapsLock',
        content: "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок получит наказание по следующему пункту правил:<br><br>"+
        "[COLOR=rgb(255, 0, 0)]3.02. [/COLOR]Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате[COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4][COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title:'flood',
        content: "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок получит наказание по следующему пункту правил:<br><br>"+
        "[COLOR=rgb(255, 0, 0)]3.05. [/COLOR]Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока[COLOR=rgb(255, 0, 0)]| Mute 30 минут<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4][COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        predix: ACCEPT_PREFIX,
        status: false
    },
    {
        title:'Мат в Вип чат',
        content:        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок получит наказание по следующему пункту правил:<br><br>"+
        "[COLOR=rgb(255, 0, 0)]3.23. [/COLOR]Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате[COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4][COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title:'Транслит',
        content:"[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок получит наказание по следу№щему пункту правил:<br><br>"+
        "[COLOR=rgb(255, 0, 0)]3.20. [/COLOR]Запрещено использование транслита в любом из чатов[COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4][COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title:'Упом промо',
        content:"[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок получит наказание по следующему пункту правил:<br><br>"+
        "[COLOR=rgb(255, 0, 0)]3.21. [/COLOR]Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах[COLOR=rgb(255, 0, 0)]| Ban 30 дней[/COLOR]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4][COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title:'Объяв на госс тер',
        content:"[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок получит наказание по следующему пункту правил:<br><br>"+
        "[COLOR=rgb(255, 0, 0)]3.22. [/COLOR]Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC)[COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4][COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title:'Реклама соц сеть',
        content:"[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок будет наказан по следующему пункту:<br><br>"+
        "[COLOR=rgb(255, 0, 0)]2.31. [/COLOR]Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное[COLOR=rgb(255, 0, 0)]| Ban 7 дней / PermBan[/COLOR]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4][COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title:'Оск проекта',
        content: "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок будет наказан по следующему пункту:<br><br>"+
        "[COLOR=rgb(255, 0, 0)]2.40. [/COLOR]Запрещены OOC угрозы, в том числе и завуалированные[COLOR=rgb(255, 0, 0)]| Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/COLOR]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4][COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title:'Оск адм',
        content:"[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок будет наказан по следующему пункту:<br><br>"+
        "[COLOR=rgb(255, 0, 0)]2.54. [/COLOR]Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации[COLOR=rgb(255, 0, 0)]| Mute 180 минут[/COLOR]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4][COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title:'Разговор не на рус',
        content:"[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок будет наказан по следующему пункту:<br><br>"+
        "[COLOR=rgb(255, 0, 0)]3.01. [/COLOR]Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке[COLOR=rgb(255, 0, 0)]| Устное замечание / Mute 30 минут[/COLOR]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4][COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title:' ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ Наказание за NonRPㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ㅤ ',
    },
    {
        title:'NonRP обман',
        content:"[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок будет наказан по следующему пункту:<br><br>"+
        "[COLOR=rgb(255, 0, 0)]2.05. [/COLOR]Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики[COLOR=rgb(255, 0, 0)]| Permban[/COLOR]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4][COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },

];

$(document).ready(() => {
   $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
    addButton('Одобрено', 'accepted');
	addButton('Отказано', 'unaccept');
	addButton('На рассмотрение', 'pin');
    addButton('Передать ГА', 'mainAdmin');
    addButton('Тех.Спецу', 'techspec');
	addButton('ПАНЕЛЬ ОТВЕТОВ', 'selectAnswer');
    	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#techspec').click(() => editThreadData(TEX_PREFIX, true));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#mainAdmin').click(() => editThreadData(GA_PREFIX, true));

	$(`button#selectAnswer`).click(() => {
		XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
		buttons.forEach((btn, id) => {
			if(id > 1) {
				$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
			} else {
				$(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
			}
		});
	});
});

function addButton(name, id) {
$('.button--icon--reply').before(
  `<button type="button" class="button rippleButton" id="${id}" style="margin: 3px;">${name}</button>`,
);
}

function buttonsMarkup(buttons) {
return `<div class="select_answer">${buttons
  .map(
	(btn, i) =>
	  `<button id="answers-${i}" class="button--primary button ` +
	  `rippleButton" style="margin:5px"><span class="button-text">${btn.title}</span></button>`,
  )
  .join('')}</div>`;
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
	4 < hours && hours <= 11
	  ? 'Доброе утро'
	  : 11 < hours && hours <= 15
	  ? 'Добрый день'
	  : 15 < hours && hours <= 21
	  ? 'Добрый вечер'
	  : 'Доброй ночи',
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
