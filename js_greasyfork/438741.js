// ==UserScript==
// @name         Жалобы на игроков
// @namespace    https://forum.blackrussia.online
// @version      19.62.111
// @description  try to take over the world!
// @author       William
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license    MIT
// @collaborator William
// @icon https://icons.iconarchive.com/icons/aha-soft/iron-man/48/Ironman-Mask-3-Old-icon.png
// @downloadURL https://update.greasyfork.org/scripts/438741/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B%20%D0%BD%D0%B0%20%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/438741/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B%20%D0%BD%D0%B0%20%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.meta.js
// ==/UserScript==


(function () {
  'use strict';
  const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
  const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
  const PIN_PREFIX = 2; // Prefix that will be set when thread pins
  const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
  const WATCHED_PREFIX = 9;
  const CLOSE_PREFIX = 7;
  const SPECADM_PREFIX = 11;
  const DECIDED_PREFIX = 6;
  const MAINADM_PREFIX = 12;
  const TECHADM_PREFIX = 13
  const buttons = [{
      title: 'Приветствие',
      content: '[FONT=georgia]Здравствуйте.<br><br>' + 'Ваша жалоба на указанного игрока была рассмотрена администрацией сервера.<br><br>Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
    },

    {
      title: 'ДМ',
      content: '[FONT=georgia]Здравствуйте.<br><br>' +
        "Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(97, 189, 109)][U]принята[/U][/COLOR] администрацией сервера.<br>В ближайшее время, игрок будет наказан согласно пункту [COLOR=rgb(255, 34, 0)]2.19[/COLOR] правил серверов - Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | [COLOR=rgb(255, 34, 0)]Jail 60 минут[/COLOR]<br><br>" +
        'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
   prefix: ACCEPT_PREFIX,
   status: false,
    },
    {
      title: 'ДБ',
      content: '[FONT=georgia]Здравствуйте.<br><br>' +
        "[FONT=georgia]Ваша жалоба на указанного игрока была рассмотрена и [/FONT][COLOR=rgb(97, 189, 109)][FONT=georgia][U]принята[/U][/FONT][/COLOR][FONT=georgia] администрацией сервера.<br>В ближайшее время, игрок будет наказан согласно пункту [COLOR=rgb(255, 34, 0)]2.13[/COLOR] правил серверов -  Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | [COLOR=rgb(255, 36, 0)]Jail 30 минут[/COLOR][/FONT]<br><br>" +
        'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
      title: 'Упом/оск родных',
      content: '[FONT=georgia]Здравствуйте.<br><br>' +
        "[FONT=georgia]Ваша жалоба на указанного игрока была рассмотрена и [/FONT][COLOR=rgb(97, 189, 109)][FONT=georgia][U]принята[/U][/FONT][/COLOR][FONT=georgia] администрацией сервера.<br>В ближайшее время, игрок будет наказан согласно пункту [COLOR=#ff2200]3.04[/COLOR] правил серверов - Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | [COLOR=rgb(255, 36, 0)]Mute 120 минут / Ban 7 - 15 дней.<br>Примечание[/COLOR]: термин MQ» расценивается, как упоминание родных.<br>[COLOR=rgb(0, 0, 0)]Исключение[/COLOR]: если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/FONT]<br><br>" +
        'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
      title: 'Оскорбления',
      content: '[FONT=georgia]Здравствуйте.<br><br>' +
        "[FONT=georgia]Ваша жалоба на указанного игрока была рассмотрена и [/FONT][COLOR=rgb(97, 189, 109)][FONT=georgia][U]принята[/U][/FONT][/COLOR][FONT=georgia] администрацией сервера.<br>В ближайшее время, игрок будет наказан согласно пункту [COLOR=#ff2200]3.03[/COLOR] правил серверов - Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в [COLOR=rgb(0, 0, 0)]OOC чате[/COLOR] запрещены | [COLOR=rgb(255, 36, 0)]Mute 30 минут[/COLOR][/FONT]<br><br>" +
        'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
      title: 'Выдача себя за адм',
      content: '[FONT=georgia]Здравствуйте.<br><br>' +
        "[FONT=georgia]Ваша жалоба на указанного игрока была рассмотрена и [/FONT][COLOR=rgb(97, 189, 109)][FONT=georgia][U]принята[/U][/FONT][/COLOR][FONT=georgia] администрацией сервера.<br>В ближайшее время, игрок будет наказан согласно пункту [COLOR=#ff2200]3.10[/COLOR] правил серверов - Запрещена выдача себя за администратора, если таковым не являетесь | [COLOR=rgb(255, 36, 0)]Ban 15 - 30 + ЧС администрации[/COLOR][/FONT]<br><br>" +
        'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
        {
      title: 'Угрозы наказаниями со стор. адм',
      content: '[FONT=georgia]Здравствуйте.<br><br>' +
        "[FONT=georgia]Ваша жалоба на указанного игрока была рассмотрена и [/FONT][COLOR=rgb(97, 189, 109)][FONT=georgia][U]принята[/U][/FONT][/COLOR][FONT=georgia] администрацией сервера.<br>В ближайшее время, игрок будет наказан согласно пункту [COLOR=#ff2200]3.09[/COLOR] правил серверов - Запрещены любые угрозы о наказании игрока со стороны администрации | [COLOR=rgb(255, 36, 0)]Mute 30 минут[/COLOR][/FONT]<br><br>" +
        'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
            {
      title: 'ОСК/Ввод в забл адм',
      content: '[FONT=georgia]Здравствуйте.<br><br>' +
        "[FONT=georgia]Ваша жалоба на указанного игрока была рассмотрена и [/FONT][COLOR=rgb(97, 189, 109)][FONT=georgia][U]принята[/U][/FONT][/COLOR][FONT=georgia] администрацией сервера.<br>В ближайшее время, игрок будет наказан согласно пункту [COLOR=#ff2200]2.32[/COLOR] правил серверов - Запрещено введение в заблуждение, обман, оскорбление, неконструктивная критика администрации на всех ресурсах проекта | [COLOR=rgb(255, 36, 0)]Ban 7 - 30 дней / PermBan[/COLOR]<br>[COLOR=rgb(0, 0, 0)]Пример[/COLOR]: подделка доказательств, искажение информации в свою пользу, оскорбление администрации в репорт, обвинение администраторов без доказательств и т.д.[/FONT]<br><br>" +
        'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
            {
      title: 'Аморальные действ.',
      content: '[FONT=georgia]Здравствуйте.<br><br>' +
        "[FONT=georgia]Ваша жалоба на указанного игрока была рассмотрена и [/FONT][COLOR=rgb(97, 189, 109)][FONT=georgia][U]принята[/U][/FONT][/COLOR][FONT=georgia] администрацией сервера.<br>В ближайшее время, игрок будет наказан согласно пункту [COLOR=#ff2200]2.08[/COLOR] правил серверов - Запрещена любая форма аморальных действий сексуального характера в сторону игроков | [COLOR=rgb(255, 36, 0)]Jail 30 минут / Warn[/COLOR][/FONT]<br><br>" +
        'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
            {
      title: 'Капс',
      content: '[FONT=georgia]Здравствуйте.<br><br>' +
        "[FONT=georgia]Ваша жалоба на указанного игрока была рассмотрена и [/FONT][COLOR=rgb(97, 189, 109)][FONT=georgia][U]принята[/U][/FONT][/COLOR][FONT=georgia] администрацией сервера.<br>В ближайшее время, игрок будет наказан согласно пункту [COLOR=#ff2200]3.02[/COLOR] правил серверов - Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате | [COLOR=rgb(255, 36, 0)]Mute 30 минут[/COLOR][/FONT]<br><br>" +
        'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
            {
      title: 'Неув отн к адм',
      content: '[FONT=georgia]Здравствуйте.<br><br>' +
        "[FONT=georgia]Ваша жалоба на указанного игрока была рассмотрена и [/FONT][COLOR=rgb(97, 189, 109)][FONT=georgia][U]принята[/U][/FONT][/COLOR][FONT=georgia] администрацией сервера.<br>В ближайшее время, игрок будет наказан согласно пункту [COLOR=#ff2200]2. 54[/COLOR] правил серверов - Запрещено неуважительное обращение, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации | [COLOR=rgb(255, 36, 0)]Mute 120 минут[/COLOR][/FONT]<br><br>" +
        'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
            {
      title: 'Масс ДМ',
      content: '[FONT=georgia]Здравствуйте.<br><br>' +
        "[FONT=georgia]Ваша жалоба на указанного игрока была рассмотрена и [/FONT][COLOR=rgb(97, 189, 109)][FONT=georgia][U]принята[/U][/FONT][/COLOR][FONT=georgia] администрацией сервера.<br>В ближайшее время, игрок будет наказан согласно пункту [COLOR=#ff2200]2.20[/COLOR] правил серверов - Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более | [COLOR=rgb(255, 36, 0)]Warn / Ban 7 - 15 дней[/COLOR][/FONT]<br><br>" +
        'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
            {
      title: 'Оск проекта',
      content: '[FONT=georgia]Здравствуйте.<br><br>' +
        "[FONT=georgia]Ваша жалоба на указанного игрока была рассмотрена и [/FONT][COLOR=rgb(97, 189, 109)][FONT=georgia][U]принята[/U][/FONT][/COLOR][FONT=georgia] администрацией сервера.<br>В ближайшее время, игрок будет наказан согласно пункту [COLOR=#ff2200]2.40[/COLOR] правил серверов - Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе | [COLOR=rgb(255, 36, 0)]Ban 15 - 30 дней / PermBan[/COLOR][/FONT]<br><br>" +
        'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
      title: 'Упом. промо',
      content: '[FONT=georgia]Здравствуйте.<br>' +
        "[FONT=georgia]Ваша жалоба на указанного игрока была рассмотрена и [/FONT][COLOR=rgb(97, 189, 109)][FONT=georgia][U]принята[/U][/FONT][/COLOR][FONT=georgia] администрацией сервера.<br>В ближайшее время, игрок будет наказан согласно пункту [COLOR=#ff2200]3.21[/COLOR] правил серверов - Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. | [COLOR=rgb(255, 36, 0)]Ban 30 дней[/COLOR][/FONT]<br><br>" +
        'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },    
    {
      title: 'NonRP акс',
      content: '[FONT=georgia]Здравствуйте.<br>' +
        "[FONT=georgia]Ваша жалоба на указанного игрока была рассмотрена и [/FONT][COLOR=rgb(97, 189, 109)][FONT=georgia][U]принята[/U][/FONT][/COLOR][FONT=georgia] администрацией сервера.<br>В ближайшее время, игрок будет наказан согласно пункту [COLOR=#ff2200]2.52[/COLOR] правил серверов - Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. | [COLOR=rgb(255, 36, 0)]При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/COLOR][/FONT]<br><br>" +
        'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
        {
      title: 'Выдача розыска без Role Play причин',
      content: '[FONT=georgia]Здравствуйте.<br>' +
        "[FONT=georgia]Ваша жалоба на указанного игрока была рассмотрена и [/FONT][COLOR=rgb(97, 189, 109)][FONT=georgia][U]принята[/U][/FONT][/COLOR][FONT=georgia] администрацией сервера.<br>В ближайшее время, игрок будет наказан согласно пункту [COLOR=#ff2200]6.02[/COLOR] правил серверов - Запрещено выдавать розыск без Role Play причины | [COLOR=rgb(255, 36, 0)]Jail 30 минут[/COLOR][/FONT]<br><br>" +
        'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
        {
      title: 'Задержание без рп(нонрп коп)',
      content: '[FONT=georgia]Здравствуйте.<br>' +
        "[FONT=georgia]Ваша жалоба на указанного игрока была рассмотрена и [/FONT][COLOR=rgb(97, 189, 109)][FONT=georgia][U]принята[/U][/FONT][/COLOR][FONT=georgia] администрацией сервера.<br>В ближайшее время, игрок будет наказан согласно пункту [COLOR=#ff2200]6.03/7.03.8.03[/COLOR] правил серверов -  Запрещено оказывать задержание без Role Play отыгровки | [COLOR=rgb(255, 36, 0)]Warn[/COLOR][/FONT]<br><br>" +
        'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
        {
      title: 'Фейки',
      content: '[FONT=georgia]Здравствуйте.<br>' +
        "[FONT=georgia]Ваша жалоба на указанного игрока была рассмотрена и [/FONT][COLOR=rgb(97, 189, 109)][FONT=georgia][U]принята[/U][/FONT][/COLOR][FONT=georgia] администрацией сервера.<br>В ближайшее время, игрок будет наказан согласно пункту [COLOR=#ff2200]4.10[/COLOR] правил серверов - Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию | [COLOR=rgb(255, 36, 0)]Устное замечание + смена игрового никнейма / PermBan[/COLOR][/FONT]<br><br>" +
        'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
        {
      title: 'Слив ГТРК',
      content: '[FONT=georgia]Здравствуйте.<br>' +
        "[FONT=georgia]Ваша жалоба на указанного игрока была рассмотрена и [/FONT][COLOR=rgb(97, 189, 109)][FONT=georgia][U]принята[/U][/FONT][/COLOR][FONT=georgia] администрацией сервера.<br>В ближайшее время, игрок будет наказан согласно пункту [COLOR=#ff2200]3.08[/COLOR] правил серверов - Запрещены любые формы «слива» посредством использования глобальных чатов | [COLOR=rgb(255, 36, 0)]PermBan[/COLOR][/FONT]<br><br>" +
        'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
        {
      title: 'Нарушение ПРО',
      content: '[FONT=georgia]Здравствуйте.<br>' +
        "[FONT=georgia]Ваша жалоба на указанного игрока была рассмотрена и [/FONT][COLOR=rgb(97, 189, 109)][FONT=georgia][U]принята[/U][/FONT][/COLOR][FONT=georgia] администрацией сервера.<br>В ближайшее время, игрок будет наказан согласно пункту [COLOR=#ff2200]4.01[/COLOR] правил серверов - Запрещено редактирование объявлений, не соответствующих ПРО | [COLOR=rgb(255, 36, 0)]Mute 30 минут[/COLOR][/FONT]<br><br>" +
        'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
        {
      title: 'Нарушение ППЭ',
      content: '[FONT=georgia]Здравствуйте.<br>' +
        "[FONT=georgia]Ваша жалоба на указанного игрока была рассмотрена и [/FONT][COLOR=rgb(97, 189, 109)][FONT=georgia][U]принята[/U][/FONT][/COLOR][FONT=georgia] администрацией сервера.<br>В ближайшее время, игрок будет наказан согласно пункту [COLOR=#ff2200]4.02[/COLOR] правил серверов - Запрещено проведение эфиров, не соответствующих Role Play правилам и логике | [COLOR=rgb(255, 34, 0)]Mute 30 минут[/COLOR][/FONT]<br><br>" +
        'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
        {
      title: 'Уход от РП',
      content: '[FONT=georgia]Здравствуйте.<br>' +
        "[FONT=georgia]Ваша жалоба на указанного игрока была рассмотрена и [/FONT][COLOR=rgb(97, 189, 109)][FONT=georgia][U]принята[/U][/FONT][/COLOR][FONT=georgia] администрацией сервера.<br>В ближайшее время, игрок будет наказан согласно пункту [COLOR=#ff2200]2.02[/COLOR] правил серверов - Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | [COLOR=rgb(255, 35, 0)]Jail 30 минут / Warn[/COLOR]<br>[COLOR=rgb(0, 0, 0)]Примечание[/COLOR]: например, уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания / ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснутся Вашего персонажа и так далее.[/FONT]<br><br>" +
        'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
    prefix: ACCEPT_PREFIX,
    status: false,
    }, 
    {
      title: 'На рассмотрении',
      content: '[FONT=georgia]Здравствуйте.<br><br>' +
        "[CENTER][FONT=georgia][SIZE=5][B][COLOR=rgb(31, 206, 203)]Ваша жалоба находится на рассмотрении. Просьба не создавать жалобы с подобными содержаниями, ожидайте ответа в данной теме.[/COLOR]<br>[COLOR=rgb(31, 206, 203)]Благодарим за обращение.[/COLOR][/B][/SIZE][/FONT][/CENTER]<br><br>" +
        'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
   prefix: PIN_PREFIX,
   status: true,
    },
                           {
      title: 'NonRP поведение',
      content: '[FONT=georgia]Здравствуйте.<br><br>' +
        "[FONT=georgia]Ваша жалоба на указанного игрока была рассмотрена и [/FONT][COLOR=rgb(97, 189, 109)][FONT=georgia][U]принята[/U][/FONT][/COLOR][FONT=georgia] администрацией сервера.<br>В ближайшее время, игрок будет наказан согласно пункту [COLOR=rgb(255, 34, 0)]2.01[/COLOR] правил серверов - Запрещено поведение, нарушающее нормы процессов Role Play режима игры | [COLOR=rgb(255, 36, 0)]Jail 30 минут[/COLOR][/FONT]<br><br>" +
        'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
   prefix: ACCEPT_PREFIX,
   status: false,
    },
    {
      title: 'Техническому специалисту',
      content: '[FONT=georgia]Здравствуйте.<br><br>' +
        "[CENTER][B][FONT=times new roman][SIZE=5]Ваша жалоба на рассмотрении Технического специалиста.<be>Ожидайте ответа.[/SIZE][/FONT][/B][/CENTER]<br>Благодарим за обращение.[/SIZE][/FONT][/B][/CENTER]<br><br>" +
        'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
   prefix: TECHADM_PREFIX,
   status: true, 
   },
            {
      title: 'Идите в технический раздел',
      content: '[FONT=georgia]Здравствуйте.<br><br>' +
        "Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(184, 49, 47)][B][U]отклонена[/U][/B][/COLOR] администрацией сервера.<br>Причина отклонения жалобы на игрока: Вам нужно обратиться в технический раздел. [URL]https://forum.blackrussia.online/index.php?forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-gold.660/[/URL]<br><br>" +
        'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
    prefix: UNACCEPT_PREFIX,
         status: false,
            },
                            {
          title: 'Идите в жб на техов',
          content: '[FONT=georgia]Здравствуйте.<br><br>' +
            "Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(184, 49, 47)][B][U]отклонена[/U][/B][/COLOR] администрацией сервера.<br>Причина отклонения жалобы на игрока: Вам нужно обратиться в жалобы на технических специалистов. [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/']https://forum.blackrussia.online/index.php?forums/Жалобы-на-технических-специалистов.490/[/URL]<br><br>" +
            'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
        prefix: UNACCEPT_PREFIX,
             status: false,
                },
                                           {
      title: 'Жалобы от 3-его лица',
      content: '[FONT=georgia]Здравствуйте.<br><br>' +
        "Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(184, 49, 47)][B][U]отклонена[/U][/B][/COLOR] администрацией сервера.<br>Причина отклонения жалобы на игрока: Жалоба составлена от 3-его лица.<br>Пункт правила подачи жалоб:  [COLOR=rgb(255, 36, 0)]3.3. [/COLOR]Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации).<br><br>" +
        'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
    prefix: UNACCEPT_PREFIX,
         status: false,
            },
                                        {
      title: 'Присутвуют редактирования/Нет таймкодов',
      content: '[FONT=georgia]Здравствуйте.<br><br>' +
        "Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(184, 49, 47)][B][U]отклонена[/U][/B][/COLOR] администрацией сервера.<br>Причина отклонения жалобы на игрока: Жалоба составлена от 3-его лица.<br>Пункт правила подачи жалоб:  [COLOR=#ff2400]3.7. [/COLOR][COLOR=rgb(255, 255, 255)]Доказательства должны быть в первоначальном виде.[/COLOR]<br>[COLOR=#ff2400]Примечание: [COLOR=rgb(255, 255, 255)]видеодоказательства, которые были отредактированы и на которых присутствует посторонняя музыка, неадекватная речь, нецензурные слова или выражения, могут быть не рассмотрены в качестве доказательств. Если видеодоказательство длится более 3 минут, Вы должны указать тайм-коды нарушений.[/COLOR][/COLOR]<br><br>" +
        'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
    prefix: UNACCEPT_PREFIX,
         status: false,
            },
                        {
      title: 'Некорректный заголовок',
      content: '[FONT=georgia]Здравствуйте.<br><br>' +
        "Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(184, 49, 47)][B][U]отклонена[/U][/B][/COLOR] администрацией сервера.<br>Причина отклонения жалобы на игрока: Некорректный заголовок.<br>Пункт правила подачи жалоб:[COLOR=rgb(255, 36, 0)] 1.2.[/COLOR] В названии темы необходимо указать никнейм игрока, на которого подается жалоба, и суть жалобы: «Nick_Name | Суть жалобы».<br>[COLOR=rgb(255, 36, 0)]Пример:[/COLOR] «Bruce_Banner | nRP Drive».<br><br>" +
        'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
    prefix: UNACCEPT_PREFIX,
         status: false,
            },
                                    {
      title: 'Обрезанные скриншоты',
      content: '[FONT=georgia]Здравствуйте.<br><br>' +
        "Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(184, 49, 47)][B][U]отклонена[/U][/B][/COLOR] администрацией сервера.<br>Причина отклонения жалобы на игрока: На ваших доказательствах присутвуют редактивания (обрезанные скриншотыи т.д)<br><br>" +
        'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
    prefix: UNACCEPT_PREFIX,
         status: false,
            },
                        {
      title: 'Не по форме',
      content: '[FONT=georgia]Здравствуйте.<br><br>' +
        "Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(184, 49, 47)][B][U]отклонена[/U][/B][/COLOR] администрацией сервера.<br>Причина отклонения жалобы на игрока: Жалоба составленная вами, составлена не по форме подачи. С формой подачи жалобы на игроков вы можете ознакомиться тут -> [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.559810/']https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.559810/[/URL]<br><br>" +
        'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
    prefix: UNACCEPT_PREFIX,
         status: false,
            },

                        {
      title: 'Нет /time',
      content: '[FONT=georgia]Здравствуйте.<br><br>' +
        "Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(184, 49, 47)][B][U]отклонена[/U][/B][/COLOR] администрацией сервера.<br>Причина отклонения жалобы на игрока: На доказательствах, предоставленных вами отсутствует (/time)<br>Пункт правила подачи жалоб:  [COLOR=#ff2400]3.2. [COLOR=rgb(255, 255, 255)]Если на жалобе отсутствует /time, она может быть отклонена.[/COLOR][/COLOR]<br><br>" +
        'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
    prefix: UNACCEPT_PREFIX,
         status: false,
            },
                                    {
      title: 'Прошло более 72 часов',
      content: '[FONT=georgia]Здравствуйте.<br><br>' +
        "Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(184, 49, 47)][B][U]отклонена[/U][/B][/COLOR] администрацией сервера.<br>Причина отклонения жалобы на игрока: С монета нарушения прошло более 72 часов.<br>Пункт правила подачи жалоб:  [COLOR=#ff2400]3.1. [COLOR=rgb(255, 255, 255)]Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения со стороны игрока сервера.[/COLOR][/COLOR]<br><br>" +
        'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
    prefix: CLOSE_PREFIX,
         status: false,
            },

                    {
      title: 'Ошиблись разделом',
      content: '[FONT=georgia]Здравствуйте.<br><br>' +
        "Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(184, 49, 47)][B][U]отклонена[/U][/B][/COLOR] администрацией сервера.<br>Причина отклонения жалобы на игрока: Вы написали в разделе «Жалобы на игроков» сервера «GOLD». Вы ошиблись разделом.<br><br>" +
        'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },

        {
      title: 'В обжалование',
      content: '[FONT=georgia]Здравствуйте.<br><br>' +
        "Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(184, 49, 47)][B][U]отклонена[/U][/B][/COLOR] администрацией сервера.<br>Причина отклонения жалобы на игрока: Вы должны обратиться в раздел «Обжалование наказаний» по ссылке: [URL]https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.683/[/URL]<br><br>" +
        'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
   prefix: UNACCEPT_PREFIX,
   status: false,
    },
        {
      title: 'Доква с соц сетей не принимаются',
      content: '[FONT=georgia]Здравствуйте.<br><br>' +
        "Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(184, 49, 47)][B][U]отклонена[/U][/B][/COLOR] администрацией сервера.<br>Причина отклонения жалобы на игрока: Доказательства были загружены на социальные сети.<br>Пункт правила подачи жалоб:<br>[COLOR=rgb(255, 36, 0)]3.6[/COLOR]. Прикрепление доказательств обязательно.<br>[COLOR=rgb(255, 36, 0)]Примечание:[/COLOR] загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).<br>Загрузите доказательства на фото/видеохостинг и создайте новую тему.<br><br>" +
        'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
   prefix: UNACCEPT_PREFIX,
   status: false,
    },
    {
      title: 'Отсутвие доказательств',
      content: '[FONT=georgia]Здравствуйте.<br><br>' +
        "Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(184, 49, 47)][B][U]отклонена[/U][/B][/COLOR] администрацией сервера.<br>Причина отклонения жалобы на игрока: Вы не предоставили доказательства нарушения от игрока.<br>Пункт правила подачи жалоб:<br>[COLOR=rgb(255, 36, 0)]3.6[/COLOR]. Прикрепление доказательств обязательно.<br><br>" +
        'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
    prefix: CLOSE_PREFIX,
   status: false,
    },
    {
      title: 'Недостаточно докв',
      content: '[FONT=georgia]Здравствуйте.<br><br>' +
        "Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(184, 49, 47)][B][U]отклонена[/U][/B][/COLOR] администрацией сервера.<br>Причина отклонения жалобы на игрока: Недостаточность доказательств, предоставленных вами.<br><br>" +
        'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
   prefix: UNACCEPT_PREFIX,
   status: false,
    },

{
      title: 'Ссылка не работает',
      content: '[FONT=georgia]Здравствуйте.<br><br>' +
        "Ваша жалоба на указанного игрока была рассмотрена и [COLOR=rgb(184, 49, 47)][B][U]отклонена[/U][/B][/COLOR] администрацией сервера.<br>Причина отклонения жалобы на игрока: Ссылка которую вы предоставили не открывается, не работает или вовсе ограничен доступ к просмотру. Из-за чего просмотреть доказательства нарушения мы не можем.<br><br>" +
        'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
        {
      title: 'NonRP обман',
      content: '[FONT=georgia]Здравствуйте.<br><br>' +
        "[FONT=georgia]Ваша жалоба на указанного игрока была рассмотрена и [/FONT][COLOR=rgb(97, 189, 109)][FONT=georgia][U]принята[/U][/FONT][/COLOR][FONT=georgia] администрацией сервера.<br>В ближайшее время, игрок будет наказан согласно пункту [COLOR=rgb(255, 34, 0)]2.05[/COLOR] правил серверов - Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | [COLOR=rgb(255, 36, 0)]PermBan[/COLOR][/FONT]<br><br>" +
        'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
      title: 'MG',
      content: '[FONT=georgia]Здравствуйте.<br><br>' +
        "[FONT=georgia]Ваша жалоба на указанного игрока была рассмотрена и [/FONT][COLOR=rgb(97, 189, 109)][FONT=georgia][U]принята[/U][/FONT][/COLOR][FONT=georgia] администрацией сервера.<br>В ближайшее время, игрок будет наказан согласно пункту [COLOR=rgb(255, 34, 0)]2.18[/COLOR] правил серверов - Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | [COLOR=rgb(255, 36, 0)]Mute 30 минут.<br>Примечание[/COLOR]: использование смайлов в виде символов «))», «=D» запрещено в IC чате.<br>[COLOR=rgb(255, 36, 0)]Примечание[/COLOR]: телефонное общение также является IC чатом.[/FONT]<br><br>" +
        'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
        {
      title: 'Флуд',
      content: '[FONT=georgia]Здравствуйте.<br><br>' +
        "[FONT=georgia]Ваша жалоба на указанного игрока была рассмотрена и [/FONT][COLOR=rgb(97, 189, 109)][FONT=georgia][U]принята[/U][/FONT][/COLOR][FONT=georgia] администрацией сервера.<br>В ближайшее время, игрок будет наказан согласно пункту [COLOR=#ff2200]3.05[/COLOR] правил серверов - Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | [COLOR=rgb(255, 36, 0)]Mute 30 минут[/COLOR][/FONT]<br><br>" +
        'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
   prefix: ACCEPT_PREFIX,
   status: false,
    },
        {
      title: 'Передано ЗГА',
      content: '[FONT=georgia]Здравствуйте.<br><br>' +
        "[CENTER][B][FONT=times new roman][SIZE=5]Ваша жалоба передана Заместителю Главного Администратора, ожидайте его ответа.[/SIZE]<br><br>[SIZE=4]Иногда решение/рассмотрение подобных жалоб требует больше времени чем 2 дня. Настоятельно рекомендуем вам не создавать темы с подобным содержанием. Ответ будет дан в данной теме, как только это будет возможно.[/SIZE][/FONT][/B][/CENTER]<br><br>" +
        'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
   prefix: PIN_PREFIX,
   status: true,
    },
        {
      title: 'Главному Администратору',
      content: '[FONT=georgia]Здравствуйте.<br><br>' +
        "[CENTER][B][SIZE=5][FONT=georgia]Ваша жалоба передана Главному Администратору, ожидайте его ответа.[/FONT][/SIZE]<br><br>[SIZE=4][FONT=georgia]Иногда решение/рассмотрение подобных жалоб требует больше времени чем 2 дня. Настоятельно рекомендуем вам не создавать темы с подобным содержанием. Ответ будет дан в данной теме, как только это будет возможно.[/FONT][/SIZE][/B][/CENTER]<br><br>" +
        'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
   prefix: MAINADM_PREFIX,
   status: true,
    },
        {
      title: 'Специальному Администратору',
      content: '[FONT=georgia]Здравствуйте.<br><br>' +
        "[CENTER][B][SIZE=5][FONT=georgia]Ваша жалоба передана Специальному Администратору, ожидайте его ответа.[/FONT][/SIZE]<br><br>[SIZE=4][FONT=georgia]Иногда решение/рассмотрение подобных жалоб требует больше времени чем 2 дня. Настоятельно рекомендуем вам не создавать темы с подобным содержанием. Ответ будет дан в данной теме, как только это будет возможно.[/FONT][/SIZE][/B][/CENTER]<br><br>" +
        'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
   prefix: SPECADM_PREFIX,
   status: true,
    },
            {
      title: 'Команде проекта',
      content: '[FONT=georgia]Здравствуйте.<br><br>' +
        "[CENTER][B][SIZE=5][FONT=georgia]Ваша жалоба передана Команде Проекта, ожидайте ответа.[/FONT][/SIZE]<br><br>[SIZE=4][FONT=georgia]Иногда решение/рассмотрение подобных жалоб требует больше времени чем 2 дня. Настоятельно рекомендуем вам не создавать темы с подобным содержанием. Ответ будет дан в данной теме, как только это будет возможно.[/FONT][/SIZE][/B][/CENTER]<br><br>" +
        'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
   prefix: COMMAND_PREFIX,
   status: true,
    },
    {
      title: 'Правила раздела',
      content: '[FONT=georgia]Здравствуйте.<br><br>' +
        "[CENTER][B][I]Созданная  вами тема никоим образом не относится к теме данного раздела. [/CENTER]<br><br>" +
        'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
    prefix: CLOSE_PREFIX,
    status: false,
    },
    {
      title: 'Дублирование темы',
      content: '[FONT=georgia]Здравствуйте.<br><br>' +
        "[CENTER][B][I]Дублирование темы. Напоминаем, при 3 дублированиях – форумный аккаунт будет заблокирован.<br><br>" +
        'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
   prefix: CLOSE_PREFIX,
   status: false,
    },
    {
      title: 'Недостаточно доказательств',
      content: '[FONT=georgia]Здравствуйте.<br><br>' +
        "[CENTER][B][I]Недостаточно доказательств на нарушение от данного Администратора.<br><br>" +
        'Благодарим вас за обращение. Приятной игры на сервере[COLOR=rgb(255, 215, 0)] GOLD[/COLOR][/FONT]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
  ];

$(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton('На рассмотрение', 'pin');
addButton('КП', 'teamProject');
addButton('Отказано', 'unaccept');
addButton('Рассмотрено', 'watched');
addButton('Решено', 'decided');
addButton('Одобрено', 'accepted');
addButton('Закрыто', 'closed');
addButton('Специальному Администратору', 'specadm');
addButton('Главному Администратору', 'mainadm');
addButton('Техническому спецалисту', 'techspec');
addButton('Ответы', 'selectAnswer');

    // Поиск информации о теме
    const threadData = getThreadData();

$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
$('button#specadm').click(() => editThreadData(SPECADM_PREFIX, true));
$('button#mainadm').click(() => editThreadData(MAINADM_PREFIX, true));
$('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
$('button#decided').click(() => editThreadData(DECIDED_PREFIX, false));
$('button#closed').click(() => editThreadData(CLOSE_PREFIX, false));
$('button#techspec').click(() => editThreadData(TECHADM_PREFIX, true));

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

    if (send == true) {
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
        4 < hours && hours <= 11 ?
        'Доброе утро' :
        11 < hours && hours <= 15 ?
        'Добрый день' :
        15 < hours && hours <= 21 ?
        'Добрый вечер' :
        'Доброй ночи',
    };
  }

  function editThreadData(prefix, pin = false) {
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
