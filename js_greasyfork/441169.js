// ==UserScript==
// @name         CUR FORUM
// @namespace    https://forum.blackrussia.online
// @version      2.3
// @description  Always remember who you are!
// @author       kalamandi
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license    MIT
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @downloadURL https://update.greasyfork.org/scripts/441169/CUR%20FORUM.user.js
// @updateURL https://update.greasyfork.org/scripts/441169/CUR%20FORUM.meta.js
// ==/UserScript==

(function () {
  'use strict';
const UNACCEPT_PREFIX = 4;
const ACCEPT_PREFIX = 8;
const RESHENO_PREFIX = 6;
const PIN_PREFIX = 2;
const GA_PREFIX = 12;
const COMMAND_PREFIX = 10;
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SPECY_PREFIX = 11;
const TEXY_PREFIX = 13;
    const OTKAZBIO_PREFIX = 4;
const ODOBRENOBIO_PREFIX = 8;
const NARASSMOTRENIIBIO_PREFIX = 2;
const OTKAZRP_PREFIX = 4;
const ODOBRENORP_PREFIX = 8;
const NARASSMOTRENIIRP_PREFIX = 2;
const OTKAZORG_PREFIX = 4;
const ODOBRENOORG_PREFIX = 8;
const NARASSMOTRENIIORG_PREFIX = 2;
const buttons = [
     {
      title: 'Приветствие',
      content: '[CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER][/CENTER]',
    },
     {
      title: 'Отказано, закрыто',
      content: '[CENTER][COLOR=rgb(255, 0, 0)][B]Отказано, закрыто.[/B][/COLOR][/CENTER]',
    },
    {
      title: 'Одобрено, закрыто',
      content: '[CENTER][COLOR=rgb(91, 255, 98)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER]',
    },
    {
      title: 'На рассмотрении...',
      content: '[CENTER][B][COLOR=rgb(255, 107, 0)]На рассмотрении.[/COLOR][/B][/CENTER]',
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
        title: 'Нонрп поведение',
        content: '[CENTER]{{ greeting }}, уважаемый (-ая) {{ user.mention }}![/CENTER]<br/>[CENTER]Внимательно изучив Ваши доказательвта, готов вынести вердикт. Нарушитель будет наказан по следующему пункту правил:[/CENTER]<br/>[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.01[/COLOR] Запрещено поведение, нарушающее нормы процессов Role Play режима игры[COLOR=rgb(255, 0, 0)] | Jail 30 минут [/COLOR][/QUOTE][/CENTER]<br/>[CENTER][COLOR=rgb(91, 255, 98)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'Угрозы о наказании',
        content: '[CENTER]{{ greeting }}, уважаемый (-ая) {{ user.mention }}![/CENTER]<br/>[CENTER]Внимательно изучив Ваши доказательвта, готов вынести вердикт. Нарушитель будет наказан по следующему пункту правил:[/CENTER]<br/>[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.09[/COLOR] Запрещены любые угрозы о наказании игрока со стороны администрации[COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br/>[CENTER][COLOR=rgb(91, 255, 98)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'Угрозы OOC',
        content: '[CENTER]{{ greeting }}, уважаемый (-ая) {{ user.mention }}![/CENTER]<br/>[CENTER]Внимательно изучив Ваши доказательвта, готов вынести вердикт. Нарушитель будет наказан по следующему пункту правил:[/CENTER]<br/>[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.37[/COLOR] Запрещены OOC угрозы, в том числе и завуалированные[COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan[/COLOR][/QUOTE][/CENTER]<br/>[CENTER][COLOR=rgb(91, 255, 98)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'Сторонне ПО',
        content: '[CENTER]{{ greeting }}, уважаемый (-ая) {{ user.mention }}![/CENTER]<br/>[CENTER]Внимательно изучив Ваши доказательвта, готов вынести вердикт. Нарушитель будет наказан по следующему пункту правил:[/CENTER]<br/>[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.22[/COLOR] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками[COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan Одобрено, закрыто[/COLOR][/QUOTE][/CENTER]<br/>[CENTER][COLOR=rgb(91, 255, 98)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'СК',
        content: '[CENTER]{{ greeting }}, уважаемый (-ая) {{ user.mention }}![/CENTER]<br/>[CENTER]Внимательно изучив Ваши доказательвта, готов вынести вердикт. Нарушитель будет наказан по следующему пункту правил:[/CENTER]<br/>[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.16[/COLOR] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них[COLOR=rgb(255, 0, 0)] | Jail 30 минут / Warn (за два и более убийства).[/COLOR][/QUOTE][/CENTER]<br/>[CENTER][COLOR=rgb(91, 255, 98)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'ТК',
        content: '[CENTER]{{ greeting }}, уважаемый (-ая) {{ user.mention }}![/CENTER]<br/>[CENTER]Внимательно изучив Ваши доказательвта, готов вынести вердикт. Нарушитель будет наказан по следующему пункту правил:[/CENTER]<br/>[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.15[/COLOR] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины[COLOR=rgb(255, 0, 0)] | Jail 30 минут / Warn (за два и более убийства)[/COLOR][/QUOTE][/CENTER]<br/>[CENTER][COLOR=rgb(91, 255, 98)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'ПГ',
        content: '[CENTER]{{ greeting }}, уважаемый (-ая) {{ user.mention }}![/CENTER]<br/>[CENTER]Внимательно изучив Ваши доказательвта, готов вынести вердикт. Нарушитель будет наказан по следующему пункту правил:[/CENTER]<br/>[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.17[/COLOR] Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь[COLOR=rgb(255, 0, 0)] | Jail 30 минут[/COLOR][/QUOTE][/CENTER]<br/>[CENTER][COLOR=rgb(91, 255, 98)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'РК',
        content: '[CENTER]{{ greeting }}, уважаемый (-ая) {{ user.mention }}![/CENTER]<br/>[CENTER]Внимательно изучив Ваши доказательвта, готов вынести вердикт. Нарушитель будет наказан по следующему пункту правил:[/CENTER]<br/>[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.14[/COLOR] Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти[COLOR=rgb(255, 0, 0)] | Jail 30 минут[/COLOR][/QUOTE][/CENTER]<br/>[CENTER][COLOR=rgb(91, 255, 98)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'ДМ',
        content: '[CENTER]{{ greeting }}, уважаемый (-ая) {{ user.mention }}![/CENTER]<br/>[CENTER]Внимательно изучив Ваши доказательвта, готов вынести вердикт. Нарушитель будет наказан по следующему пункту правил:[/CENTER]<br/>[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.19[/COLOR] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины[COLOR=rgb(255, 0, 0)] | Jail 60 минут.[/COLOR][/QUOTE][/CENTER]<br/>[CENTER][COLOR=rgb(91, 255, 98)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'ДБ',
        content: '[CENTER]{{ greeting }}, уважаемый (-ая) {{ user.mention }}![/CENTER]<br/>[CENTER]Внимательно изучив Ваши доказательвта, готов вынести вердикт. Нарушитель будет наказан по следующему пункту правил:[/CENTER]<br/>[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.13[/COLOR] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта[COLOR=rgb(255, 0, 0)] | Jail 30 минут.[/COLOR][/QUOTE][/CENTER]<br/>[CENTER][COLOR=rgb(91, 255, 98)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'NonRP Обман',
        content: '[CENTER]{{ greeting }}, уважаемый (-ая) {{ user.mention }}![/CENTER]<br/>[CENTER]Внимательно изучив Ваши доказательвта, готов вынести вердикт. Нарушитель будет наказан по следующему пункту правил:[/CENTER]<br/>[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.05[/COLOR] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики[COLOR=rgb(255, 0, 0)] | PermBan.[/COLOR][/QUOTE][/CENTER]<br/>[CENTER][COLOR=rgb(91, 255, 98)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'Масс ДМ',
        content: '[CENTER]{{ greeting }}, уважаемый (-ая) {{ user.mention }}![/CENTER]<br/>[CENTER]Внимательно изучив Ваши доказательвта, готов вынести вердикт. Нарушитель будет наказан по следующему пункту правил:[/CENTER]<br/>[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.20[/COLOR] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины более трем игрокам[COLOR=rgb(255, 0, 0)] | Warn / Ban 7 - 15 дней.[/COLOR][/QUOTE][/CENTER]<br/>[CENTER][COLOR=rgb(91, 255, 98)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'Оск/Упом родни',
        content: '[CENTER]{{ greeting }}, уважаемый (-ая) {{ user.mention }}![/CENTER]<br/>[CENTER]Внимательно изучив Ваши доказательвта, готов вынести вердикт. Нарушитель будет наказан по следующему пункту правил:[/CENTER]<br/>[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.04[/COLOR] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC)[COLOR=rgb(255, 0, 0)] | Mute 120 минут / Ban 7 - 15 дней.[/COLOR][/QUOTE][/CENTER]<br/>[CENTER][COLOR=rgb(91, 255, 98)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'Оскорбление',
        content: '[CENTER]{{ greeting }}, уважаемый (-ая) {{ user.mention }}![/CENTER]<br/>[CENTER]Внимательно изучив Ваши доказательвта, готов вынести вердикт. Нарушитель будет наказан по следующему пункту правил:[/CENTER]<br/>[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.07[/COLOR] Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата[COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br/>[CENTER][COLOR=rgb(91, 255, 98)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'MG',
        content: '[CENTER]{{ greeting }}, уважаемый (-ая) {{ user.mention }}![/CENTER]<br/>[CENTER]Внимательно изучив Ваши доказательвта, готов вынести вердикт. Нарушитель будет наказан по следующему пункту правил:[/CENTER]<br/>[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.18[/COLOR] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе[COLOR=rgb(255, 0, 0)] | Mute 30 минут.[/COLOR][/QUOTE][/CENTER]<br/>[CENTER][COLOR=rgb(91, 255, 98)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'Злоуп знаками',
        content: '[CENTER]{{ greeting }}, уважаемый (-ая) {{ user.mention }}![/CENTER]<br/>[CENTER]Внимательно изучив Ваши доказательвта, готов вынести вердикт. Нарушитель будет наказан по следующему пункту правил:[/CENTER]<br/>[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.06[/COLOR] Запрещено злоупотребление знаков препинания и прочих символов[COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br/>[CENTER][COLOR=rgb(91, 255, 98)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'Капс',
        content: '[CENTER]{{ greeting }}, уважаемый (-ая) {{ user.mention }}![/CENTER]<br/>[CENTER]Внимательно изучив Ваши доказательвта, готов вынести вердикт. Нарушитель будет наказан по следующему пункту правил:[/CENTER]<br/>[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.02[/COLOR] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате[COLOR=rgb(255, 0, 0)] | Mute 30 минут.[/COLOR][/QUOTE][/CENTER]<br/>[CENTER][COLOR=rgb(91, 255, 98)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'Флуд',
        content: '[CENTER]{{ greeting }}, уважаемый (-ая) {{ user.mention }}![/CENTER]<br/>[CENTER]Внимательно изучив Ваши доказательвта, готов вынести вердикт. Нарушитель будет наказан по следующему пункту правил:[/CENTER]<br/>[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.05[/COLOR] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока[COLOR=rgb(255, 0, 0)] | Mute 30 минут.[/COLOR][/QUOTE][/CENTER]<br/>[CENTER][COLOR=rgb(91, 255, 98)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'Неув обр. к адм',
        content: '[CENTER]{{ greeting }}, уважаемый (-ая) {{ user.mention }}![/CENTER]<br/>[CENTER]Внимательно изучив Ваши доказательвта, готов вынести вердикт. Нарушитель будет наказан по следующему пункту правил:[/CENTER]<br/>[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.54[/COLOR] Запрещено неуважительное обращение, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации[COLOR=rgb(255, 0, 0)] | Mute 120 минут[/COLOR][/QUOTE][/CENTER]<br/>[CENTER][COLOR=rgb(91, 255, 98)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'Ввод в заблуждение',
        content: '[CENTER]{{ greeting }}, уважаемый (-ая) {{ user.mention }}![/CENTER]<br/>[CENTER]Внимательно изучив Ваши доказательвта, готов вынести вердикт. Нарушитель будет наказан по следующему пункту правил:[/CENTER]<br/>[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.11[/COLOR] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами[COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan[/COLOR][/QUOTE][/CENTER]<br/>[CENTER][COLOR=rgb(91, 255, 98)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'Уход от РП',
        content: '[CENTER]{{ greeting }}, уважаемый (-ая) {{ user.mention }}![/CENTER]<br/>[CENTER]Внимательно изучив Ваши доказательвта, готов вынести вердикт. Нарушитель будет наказан по следующему пункту правил:[/CENTER]<br/>[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.02[/COLOR] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами[COLOR=rgb(255, 0, 0)] | Jail 30 минут / Warn[/COLOR][/QUOTE][/CENTER]<br/>[CENTER][COLOR=rgb(91, 255, 98)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'Уход от наказания',
        content: '[CENTER]{{ greeting }}, уважаемый (-ая) {{ user.mention }}![/CENTER]<br/>[CENTER]Внимательно изучив Ваши доказательвта, готов вынести вердикт. Нарушитель будет наказан по следующему пункту правил:[/CENTER]<br/>[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.34[/COLOR] Запрещен уход от наказания[COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней (суммируется к общему наказанию дополнительно)[/COLOR][/QUOTE][/CENTER]<br/>[CENTER][COLOR=rgb(91, 255, 98)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'Аморал действия',
        content: '[CENTER]{{ greeting }}, уважаемый (-ая) {{ user.mention }}![/CENTER]<br/>[CENTER]Внимательно изучив Ваши доказательвта, готов вынести вердикт. Нарушитель будет наказан по следующему пункту правил:[/CENTER]<br/>[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.08[/COLOR] Запрещена любая форма аморальных действий сексуального характера в сторону игроков[COLOR=rgb(255, 0, 0)] | Jail 30 минут / Warn[/COLOR][/QUOTE][/CENTER]<br/>[CENTER][COLOR=rgb(91, 255, 98)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'Слив ГТРК',
        content: '[CENTER]{{ greeting }}, уважаемый (-ая) {{ user.mention }}![/CENTER]<br/>[CENTER]Внимательно изучив Ваши доказательвта, готов вынести вердикт. Нарушитель будет наказан по следующему пункту правил:[/CENTER]<br/>[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.08[/COLOR] Запрещены любые формы «слива» посредством использования глобальных чатов[COLOR=rgb(255, 0, 0)] | PermBan[/COLOR][/QUOTE][/CENTER]<br/>[CENTER][COLOR=rgb(91, 255, 98)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'Слив склада',
        content: '[CENTER]{{ greeting }}, уважаемый (-ая) {{ user.mention }}![/CENTER]<br/>[CENTER]Внимательно изучив Ваши доказательвта, готов вынести вердикт. Нарушитель будет наказан по следующему пункту правил:[/CENTER]<br/>[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.08[/COLOR] Запрещены любые формы «слива» посредством использования глобальных чатов[COLOR=rgb(255, 0, 0)] | PermBan[/COLOR][/QUOTE][/CENTER]<br/>[CENTER][COLOR=rgb(91, 255, 98)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'Оск проекта',
        content: '[CENTER]{{ greeting }}, уважаемый (-ая) {{ user.mention }}![/CENTER]<br/>[CENTER]Внимательно изучив Ваши доказательвта, готов вынести вердикт. Нарушитель будет наказан по следующему пункту правил:[/CENTER]<br/>[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.40[/COLOR] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе[COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan [/COLOR][/QUOTE][/CENTER]<br/>[CENTER][COLOR=rgb(91, 255, 98)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'Нонрп коп',
        content: '[CENTER]{{ greeting }}, уважаемый (-ая) {{ user.mention }}![/CENTER]<br/>[CENTER]Внимательно изучив Ваши доказательвта, готов вынести вердикт. Нарушитель получит наказание в виде Warn\'a[/CENTER]<br/>[CENTER][COLOR=rgb(91, 255, 98)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'Оск адм',
        content: '[CENTER]{{ greeting }}, уважаемый (-ая) {{ user.mention }}![/CENTER]<br/>[CENTER]Внимательно изучив Ваши доказательвта, готов вынести вердикт. Нарушитель будет наказан по следующему пункту правил:[/CENTER]<br/>[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.32[/COLOR] Запрещено введение в заблуждение, обман, оскорбление, неконструктивная критика администрации на всех ресурсах проекта[COLOR=rgb(255, 0, 0)] | Ban 7 - 30 дней / PermBan[/COLOR][/QUOTE][/CENTER]<br/>[CENTER][COLOR=rgb(91, 255, 98)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'Выдача себя за адм',
        content: '[CENTER]{{ greeting }}, уважаемый (-ая) {{ user.mention }}![/CENTER]<br/>[CENTER]Внимательно изучив Ваши доказательвта, готов вынести вердикт. Нарушитель будет наказан по следующему пункту правил:[/CENTER]<br/>[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]3.10[/COLOR] Запрещена выдача себя за администратора, если таковым не являетесь[COLOR=rgb(255, 0, 0)] | Ban 15 - 30 + ЧС администрации[/COLOR][/QUOTE][/CENTER]<br/>[CENTER][COLOR=rgb(91, 255, 98)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
	  title: 'Нарушений не найдено',
	  content: `[CENTER]{{ greeting }}, дорогой {{ user.mention }}.
<br/>Не заметил нарушений со стороны данного игрока.
<br/>[B][COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/COLOR][/B][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Недостаточно доказательств',
      content: `[CENTER]{{ greeting }}, дорогой {{ user.mention }}.
<br/>Недостаточно доказательств на нарушение от данного игрока.
<br/>Доказательства должны быть предоставлены в хорошем качестве и с полным процессом сделки или нарушения от какого-либо игрока.
<br/>[B][COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/COLOR][/B][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Дублирование темы',
      content: `[CENTER]{{ greeting }}, дорогой {{ user.mention }}.
<br/>Ответ уже был дан в похожей теме.
<br/>[B][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/B][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'В жалобы на адм',
      content: `[CENTER]{{ greeting }}, дорогой {{ user.mention }}.
<br/>Вы ошиблись разделом, Вам необходимо создать тему в разделе «Жалобы на администрацию».
<br/>[B][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/B][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'В обжалования',
      content: `[CENTER]{{ greeting }}, дорогой {{ user.mention }}.
Вы ошиблись разделом, Вам необходимо создать тему в разделе «Обжалования наказаний».
[B][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/B][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Форма темы',
      content: `[CENTER]{{ greeting }}, дорогой {{ user.mention }}.
<br/>Ваша тема составлена не по форме.
<br/>Убедительная просьба ознакомиться с правилами подачи жалоб, они закреплены в данном разделе.
<br/>[B][COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/COLOR][/B][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Укажите таймкоды',
	  content: `[CENTER]{{ greeting }}, дорогой {{ user.mention }}.
<br/>Пожалуйста, укажите таймкоды на ваших видеодоказательствах.
<br/>[B][COLOR=rgb(255, 107, 0)]На рассмотрении.[/COLOR][/B][/CENTER]`,
      prefix: PIN_PREFIX,
	  status: false,
	},
    {
      title: 'Жалоба на рассмотрении',
      content: `[CENTER]{{ greeting }}, дорогой {{ user.mention }}.
<br/>Ваша тема взята на рассмотрение, пожалуйста, ожидайте вердикта и не создавайте дубликаты.[/CENTER]`,
      prefix: PIN_PREFIX,
	  status: false,
    },
    {
      title: 'Тех. спецу',
      content: `[CENTER]{{ greeting }}, дорогой {{ user.mention }}.
<br/>Ваша жалоба передана на рассмотрение [B][COLOR=rgb(255, 69, 0)]Техническому специалисту[/COLOR][/B][COLOR=null].
<br/>Ожидайте вердикта.[/COLOR][/CENTER]`,
      prefix: TEXY_PREFIX,
	  status: false,
    },
      {
      title: 'Заголовок не по форме',
      content: `[CENTER]{{ greeting }}, дорогой {{ user.mention }}.
<br/>Заголовок Вашей темы составлен не по форме.
<br/>Убедительная просьба ознакомиться с правилами подачи жалоб, они закреплены в данном разделе.
<br/>[B][COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/COLOR][/B][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
      {
      title: 'Более 72 часов',
      content: `[CENTER]{{ greeting }}, дорогой {{ user.mention }}.
<br/>Максимальное время подачи жалобы с момента нарушения - 72 часа.
<br/>[B][COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/COLOR][/B][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нету условий сделки',
      content: `[CENTER]{{ greeting }}, дорогой {{ user.mention }}.
<br/>На Вашей видеозаписи нет условий сделки.
<br/>[B][COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/COLOR][/B][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нету /time',
      content: `[CENTER]{{ greeting }}, дорогой {{ user.mention }}.
<br/>На Ваших доказательствах отсутствует /time
<br/>[B][COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/COLOR][/B][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нужен фарпс',
      content: `[CENTER]{{ greeting }}, дорогой {{ user.mention }}.
<br/>В данном случае нужна видеофиксация.
<br/>[B][COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/COLOR][/B][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неполный фрапс',
      content: `[CENTER]{{ greeting }}, дорогой {{ user.mention }}.
<br/>Видео запись обрывается. Загрузите полную видеозапись на видеохостинг YouTube.com.
<br/>[B][COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/COLOR][/B][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Не работают доква',
      content: `[CENTER]{{ greeting }}, дорогой {{ user.mention }}.
<br/>Доказательства не работают.
<br/>[B][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/B][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Доква отредактированы',
      content: `[CENTER]{{ greeting }}, дорогой {{ user.mention }}.
<br/>Ваши доказательства отредактированы, что строго воспрещается правилами подачи жалоб.
<br/>[B][COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/COLOR][/B][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'От 3-го лица',
      content: `[CENTER]{{ greeting }}, дорогой {{ user.mention }}.
<br/>Жалобы от 3-их лиц не рассматриваются.
<br/>[B][COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/COLOR][/B][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Ответный ДМ',
      content: `[CENTER]{{ greeting }}, дорогой {{ user.mention }}.
<br/>В случае ответного ДМ нужен видеозапись. Пересоздайте тему и прикрепите видеозапись.
<br/>[B][COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/COLOR][/B][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
      {
      title: 'био одобрено',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Green]Одобрено.[/I][/CENTER][/color][/FONT]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'био на дороботке',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Вам даётся 24 часа на дополнение вашей РП биографии[/CENTER]",
      prefix: PIN_PREFIX,
    },
    {
      title: 'био отказ',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить какое-либо нарушение из [URL='https://forum.blackrussia.online/index.php?threads/magenta-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D1%84%D0%BE%D1%80%D0%BC%D0%B0-role-play-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.1210047/']Правила создания и форма Role-Play биографии[/URL].[/CENTER][/FONT]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'РП ситуация одобрено',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП ситуация получает статус: [Color=Green]Одобрено.[/I][/CENTER][/color][/FONT]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'РП ситуация на дороботке',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Вам даётся 24 часа на дополнение вашей РП ситуации[/CENTER]",
      prefix: PIN_PREFIX,
	  status: false,
    },
    {
      title: 'РП ситуация отказ',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП ситуация получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить какое-либо нарушение из [URL='https://forum.blackrussia.online/index.php?threads/magenta-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-role-play-%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B9.1210123/']Правила Role-Play ситуаций[/URL][/CENTER][/FONT]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Неофициальная Орг одобрено',
      content:
		`[CENTER]{{ greeting }}, уважаемый игрок.
Ваша РП организация получает статус: [COLOR=rgb(91, 255, 98)][B]Одобрено.[/B][/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неофициальная Орг на дороботке',
      content:
		`[CENTER][FONT=arial]{{ greeting }}, уважаемый игрок.[/FONT]
Вам даётся 24 часа на дополнение Вашей Неофициальной RP Организации.[/CENTER]`,
      prefix: PIN_PREFIX,
	  status: false,
    },
    {
      title: 'Неофициальная Орг отказ',
      content: `[I][/I]
[CENTER]{{ greeting }}, уважаемый игрок.
Ваша РП ситуация получает статус: [COLOR=rgb(255, 0, 0)][B]Отказано.[/B][/COLOR]
Причиной отказа могло послужить какое-либо нарушение из [URL='https://forum.blackrussia.online/index.php?threads/%D0%A4%D0%BE%D1%80%D0%BC%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D0%BE%D1%81%D0%BD%D0%BE%D0%B2%D0%BD%D1%8B%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%9D%D0%B5%D0%BE%D1%84%D0%B8%D1%86%D0%B8%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%B9-rp-%D0%BE%D1%80%D0%B3%D0%B0%D0%BD%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8.285957/']Правила создания неофициальной RolePlay организации[/URL].[/CENTER]`,
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
      {
      title: 'Неофициальная Орг запроси активности',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
          "[CENTER][B][I][FONT=georgia]Ваша неофициальная РП организация может быть закрыта по пункту правил: Неактив в топике организации более недели, он закрывается. Прекрипите отчёт о активности организации в виде скриншотов. Через 24 часа если отчёта не будет или он будет некорректный организация будет закрыта.[/CENTER]",
              prefix: PIN_PREFIX,
	  status: false,
    },
    {
      title: 'Неофициальная Орг закрытие активности',
      content:
		'[CENTER][FONT=arial]{{ greeting }}, уважаемый игрок.[/FONT][B][FONT=arial]Активность не была предоставлена. Организация закрыта.[/FONT][/B][/CENTER]',
        prefix: PIN_PREFIX,
        status: false,
    },


  ];

  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton('На рассмотрение', 'pin');
    addButton('КП', 'teamProject');
    addButton('Одобрено', 'accepted');
    addButton('Отказано', 'unaccept');
    addButton('Тех. Специалисту', 'Texy');
    addButton('Решено', 'Resheno');
    addButton('Закрыто', 'Zakrito');
    addButton('Ответы', 'selectAnswer');

    // Поиск информации о теме
    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#Texy').click(() => editThreadData(TEXY_PREFIX, false));
    $('button#Resheno').click(() => editThreadData(RESHENO_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));

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
} else {
fetch(`${document.URL}edit`, {
method: 'POST',
body: getFormData({
prefix_id: prefix,
title: threadTitle,
pin: 1,
_xfToken: XF.config.csrf,
_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
_xfWithData: 1,
_xfResponseType: 'json',
}),
}).then(() => location.reload());
}
if(prefix == ACCEPT_PREFIX) {
moveThread(prefix,685);
}
if(prefix == PIN_PREFIX) {
moveThread(prefix,690);
}
if(prefix == UNACCEPT_PREFIX) {
moveThread(prefix,691);
}

  function editThreadData(prefix, pin = false) {

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