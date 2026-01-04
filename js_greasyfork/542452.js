// ==UserScript==
// @name         KRASNODAR | Скрипт для КФ
// @namespace   https://forum-limerussia.hgweb.ru/index.php
// @version      1.8
// @description  flatcherство
// @author       flatcher
// @match       https://forum-limerussia.hgweb.ru/index.php*
// @icon        https://forum-limerussia.hgweb.ru/index.php
// @grant        none
// @license 	 MIT
// @collaborator none
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/542452/KRASNODAR%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/542452/KRASNODAR%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4.meta.js
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
      title: '<3'
    },
    {
      title: '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀Жалобы на игроков⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀'
    },
    {
	  title: 'НА РАССМОТРЕНИЕ',
	  content:
		"[CENTER][FONT=trebuchet ms][COLOR=rgb(255, 0, 0)][SIZE=4]Приветствую[/SIZE][/COLOR]<br><br>"+
		"[SIZE=4]Тема поставлена на рассмотрение. [COLOR=rgb(255, 0, 0)]Ожидайте вердикта[/COLOR][/SIZE][/FONT]<br><br>"+
        "Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/CENTER]",
	  prefix: PIN_PREFIX,
	  status: true
	},
    {
      title: 'НЕТ ДОКВ',
      content:
        "[CENTER][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms][SIZE=4]Приветствую[/FONT][/COLOR]<br><br>"+
        "В теме отсутствуют доказательства<br><br>"+
        "[COLOR=rgb(255, 0, 0)][FONT=trebuchet ms][SIZE=4]Отказано. Закрыто[/FONT][/COLOR]<br><br>"+
        "Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/CENTER]",
      prefix: UNACCEPT_PREFIX,
      status: false
    },
    {
      title: 'ДОК В ПЛОХ КАЧ',
      content:
        "[CENTER][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms][SIZE=4]Приветствую[/FONT][/COLOR]<br><br>"+
        "Доказательства, приложенные вами, находятся в плохом качестве, в связи с чем мы не можем их рассмотреть<br><br>"+
        "[COLOR=rgb(255, 0, 0)][FONT=trebuchet ms][SIZE=4]Отказано. Закрыто[/FONT][/COLOR]<br><br>"+
        "Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/CENTER]",
      prefix: UNACCEPT_PREFIX,
      status: false
    },
    {
        title: 'ОТ 3 ЛИЦ',
        content:
        "[CENTER][FONT=trebuchet ms][COLOR=rgb(255, 0, 0)]Приветствую[/COLOR]<br><br>"+
        "Жалобы от 3-х лиц не принимаются<br><br>"+
        "[COLOR=rgb(255, 0, 0)]Отказано. Закрыто [/COLOR][/FONT]<br><br>"+
        "Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/CENTER]",
        prefix: UNACCEPT_PREFIX,
        status: false
    },
    {
        title: 'НЕПОФОРМЕ',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Ваша тема не соответствует формату подачи жалоб. Ознакомьтесь с правилами подачи жалоб и обратитесь повторно<br>"+
        "Правила подачи жалоб - [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/']*ссылка*[/URL][/FONT]<br><br>"+
        "[COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Отказано. Закрыто[/FONT][/COLOR][/SIZE]<br><br>"+
        "Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/CENTER]",
        prefix: UNACCEPT_PREFIX,
        status: false
    },
    {
        title: 'НЕТДОКВЛОГ',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Из-за частых попыток подделать доказательства, нарушение требует повторной проверки со стороны администрации, в данный момент администрация не может подтвердить данное нарушение.<br>"+
        "[COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Отказано. Закрыто[/FONT][/COLOR][/SIZE]<br><br>"+
        "Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/CENTER]",
        prefix: UNACCEPT_PREFIX,
        status: false
    },
    {
        title: 'ДОКВА РЕДАК',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Ваши доказательства были подвержены редактированию, в связи с чем жалоба не подлежит рассмотрению<br><br>"+
        "[COLOR=rgb(255, 0, 0)]Отказано. Закрыто[/COLOR]<br><br>"+
        "Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: UNACCEPT_PREFIX,
        status: false
    },
    {
        title: 'ДОК В СОЦ СЕТ',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Запрещено выкладывать доказательства в социальные сети<br>"+
        "Обратитесь повторно, загрузив доказательства на хостинг<br><br>"+
        "[COLOR=rgb(255, 0, 0)]Отказано. Закрыто[/COLOR]<br><br>"+
        "Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: UNACCEPT_PREFIX,
        status: false
    },
    {
        title: 'НЕТ TIME',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]На ваших доказательствах отсутствует /time, в связи с чем жалоба не подлежит рассмотрению<br><br>"+
        "[COLOR=rgb(255, 0, 0)]Отказано. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: UNACCEPT_PREFIX,
        status: false
    },
    {
        title: 'НЕТ ТАЙМ КОД',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]В вашей жалобе отсутствуют тайм коды, в связи с чем жалоба не подлежит рассмотрению<br><br>"+
        "[COLOR=rgb(255, 0, 0)]Отказано. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: UNACCEPT_PREFIX,
        status: false
    },
    {
        title: 'НЕ ДОСТАТ ДОКВ',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]В вашей теме не достаточно доказательств для выдачи наказания и рассмотрения жалобы <br><br>"+
        "[COLOR=rgb(255, 0, 0)]Отказано. Закрыто[/COLOR]<br><br>"+
        "Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]<br><br>",
        prefix: UNACCEPT_PREFIX,
        status: false
    },
    {
        title: 'НЕ РАБ ДОКВ',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Доказательства указанные вами не работают, в связи с чем жалоба не подлежит рассмотрению<br><br>"+
        "[COLOR=rgb(255, 0, 0)]Отказано. Закрыто[/COLOR]<br><br>"+
        "Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: UNACCEPT_PREFIX,
        status: false
    },
    {
        title: 'ПРОШЛО 72 ЧАСА',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]С момента нарушения игрока прошло более 72-х часов, в связи с чем жалоба не подлежит рассмотрению<br><br>"+
        "[COLOR=rgb(255, 0, 0)]Отказано. Закрыто[/COLOR]<br><br>"+
        "Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]<br><br>",
        prefix: UNACCEPT_PREFIX,
        status: false
    },
    {
        title: 'УЖЕ НАКАЗАН',
        content:
        "[CENTER][FONT=trebuchet ms][COLOR=rgb(255, 0, 0)][SIZE=4]Приветствую.[/SIZE][/COLOR][/FONT]<br><br>"+
        "Игрок уже был наказан. Благодарим за предоставленную информацию.<br><br>"+
        "[FONT=trebuchet ms][SIZE=4][COLOR=rgb(255, 0, 0)]Отказано. Закрыто[/COLOR]<br><br>"+
        "Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: UNACCEPT_PREFIX,
        status: false
    },
    {
        title: 'ТЕХУ',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Ваша тема передана техническому специалисту на рассмотрение<br><br>"+
        "[COLOR=rgb(255, 0, 0)]Ожидайте вердикта[/COLOR]<br><br>"+
        "Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: TEX_PREFIX,
        status: true
    },
    {
        title: 'NRP ПОВЕД',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок будет наказан по следующему пункту:<br><br>"+
        "[QUOTE][COLOR=rgb(255, 0, 0)]2.01. [/COLOR]Запрещено поведение, нарушающее нормы процессов Role Play режима игры [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][/QUOTE]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'УХОД ОТ RP',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок будет наказан по следующему пункту:<br><br>"+
        "[QUOTE][COLOR=rgb(255, 0, 0)]2.02. [/COLOR]Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [COLOR=rgb(255, 0, 0)]|  Jail 30 минут / Warn[/COLOR][/QUOTE]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'NRP ЕЗДА',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок будет наказан по следующему пункту:<br><br>"+
        "[QUOTE][COLOR=rgb(255, 0, 0)]2.03. [/COLOR]Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере[COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][/QUOTE]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'НРП ВЧ',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок будет наказан по следующему пункту:<br><br>"+
        "[QUOTE][SIZE=4][COLOR=rgb(255, 0, 0)]2. [/COLOR]За нарушение правил нападения на Войсковую Часть выдаётся предупреждение[COLOR=rgb(255, 0, 0)] | Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/COLOR][/SIZE][/QUOTE]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'ПОМЕХА ИП',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок будет наказан по следующему пункту:<br><br>"+
        "[QUOTE][SIZE=4][COLOR=rgb(255, 0, 0)]2.04. [/COLOR]Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы.[COLOR=rgb(255, 0, 0)] | Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/COLOR][/SIZE][/QUOTE]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'NRP ОБМАН',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок будет наказан по следующему пункту:<br><br>"+
        "[QUOTE][COLOR=rgb(255, 0, 0)]2.05. [/COLOR]Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики[COLOR=rgb(255, 0, 0)]| Permban[/COLOR][/QUOTE]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'АМОРАЛ ДЕЙСТВ',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок будет наказан по следующему пункту:<br><br>"+
        "[QUOTE][COLOR=rgb(255, 0, 0)]2.08. [/COLOR]Запрещена любая форма аморальных действий сексуального характера в сторону игроков[COLOR=rgb(255, 0, 0)]| Jail 30 минут / Warn[/COLOR][/QUOTE]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'СЛИВ СКЛАДА',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок будет наказан по следующему пункту:<br><br>"+
        "[QUOTE][COLOR=rgb(255, 0, 0)]2.09. [/COLOR]Запрещено сливать склад фракции / семьи путем взятия большого количества ресурсов или превышая допустимый лимит, установленный лидером[COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan[/COLOR][/QUOTE]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'СЛИВ СКЛАДА ЗАПРОС ФРАПСА',
        content:
        "[CENTER][FONT=trebuchet ms][COLOR=rgb(255, 0, 0)][SIZE=4]Приветствую.[/SIZE][/COLOR]<br><br>"+
        "[SIZE=4]Прикрепите видеозапись, в которой будут следующие пункты:<br>"+
        "1) Открытие кнопки *управление семьей*, где видно, что вы являетесь лидером.<br>"+
        "2) Указано ли было в описании семьи сколько можно брать патронов (fm > Объявление семьи).<br>"+
        "3) Логи семьи где игрок взял патроны.<br>"+
        "4) Повторный /time.<br>"+
        "У вас 24 часа.<br><br>"+
        "[FONT=trebuchet ms][COLOR=rgb(255, 0, 0)][SIZE=4]На рассмотрении.[/SIZE][/COLOR][/FONT][/SIZE][/FONT][/CENTER]",
        prefix: PIN_PREFIX,
        status: true
    },
    {
        title: 'ОБМАН В /DO',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок будет наказан по следующему пункту:<br><br>"+
        "[QUOTE][COLOR=rgb(255, 0, 0)]2.09. [/COLOR]Запрещено в любой форме обманывать в /do, даже если это в дальнейшем негативно скажется на Вашем игровом персонаже[COLOR=rgb(255, 0, 0)]| Jail 30 минут / Warn[/COLOR][/QUOTE]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'ИСП Т/С ФРАК В ЛИЧ ЦЕЛ',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок будет наказан по следующему пункту:<br><br>"+
        "[QUOTE][COLOR=rgb(255, 0, 0)]2.11. [/COLOR]Запрещено использование рабочего или фракционного транспорта в личных целях [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][/QUOTE]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'DB',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок будет наказан по следующему пункту:<br><br>"+
        "[QUOTE][COLOR=rgb(255, 0, 0)]2.13. [/COLOR]Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта[COLOR=rgb(255, 0, 0)]| Jail 60 минут[/COLOR][/QUOTE]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'TK',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок будет наказан по следующему пункту:<br><br>"+
        "[QUOTE][COLOR=rgb(255, 0, 0)]2.15. [/COLOR]Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины[COLOR=rgb(255, 0, 0)]| Jail 60 минут / Warn (за два и более убийства)[/COLOR][/QUOTE]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'SK',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок будет наказан по следующему пункту:<br><br>"+
        "[QUOTE][COLOR=rgb(255, 0, 0)]2.16. [/COLOR]Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них[COLOR=rgb(255, 0, 0)]| Jail 60 минут / Warn (за два и более убийства)[/COLOR][/QUOTE]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'MG',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок будет наказан по следующему пункту:<br><br>"+
        "[QUOTE][COLOR=rgb(255, 0, 0)]2.18. [/COLOR]Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе[COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][/QUOTE]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'DM',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок будет наказан по следующему пункту:<br><br>"+
        "[QUOTE][COLOR=rgb(255, 0, 0)]2.19. [/COLOR]Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины[COLOR=rgb(255, 0, 0)]| Jail 60 минут[/COLOR][/QUOTE]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'MASS DM',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок будет наказан по следующему пункту:<br><br>"+
        "[QUOTE][COLOR=rgb(255, 0, 0)]2.20. [/COLOR]Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более[COLOR=rgb(255, 0, 0)]| Warn / Ban 3 - 7 дней[/COLOR][/QUOTE]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'СТОРОН ПО',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок будет наказан по следующему пункту:<br><br>"+
        "[QUOTE][COLOR=rgb(255, 0, 0)]2.22. [/COLOR]Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками[COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней / PermBan[/COLOR][/QUOTE]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'РЕКЛАМА',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок будет наказан по следующему пункту:<br><br>"+
        "[QUOTE][COLOR=rgb(255, 0, 0)]2.31. [/COLOR]Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное[COLOR=rgb(255, 0, 0)]| Ban 7 дней / PermBan[/COLOR][/QUOTE]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'ФЕЙК',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок будет наказан по следующему пункту:<br><br>"+
        "[QUOTE][COLOR=rgb(255, 0, 0)]4.10. [/COLOR]Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию[COLOR=rgb(255, 0, 0)]| Устное замечание + смена игрового никнейма / PermBan[/COLOR][/QUOTE]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'IC OOC КОНФЛ',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок будет наказан по следующему пункту:<br><br>"+
        "[QUOTE][COLOR=rgb(255, 0, 0)]2.35. [/COLOR]На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате[COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 7 дней[/COLOR][/QUOTE]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'OOC УГРОЗЫ',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок будет наказан по следующему пункту:<br><br>"+
        "[QUOTE][COLOR=rgb(255, 0, 0)]2.37. [/COLOR]Запрещены OOC-угрозы, в том числе и завуалированные, а также угрозы наказанием со стороны администрации[COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 7 - 15 дней.[/COLOR][/QUOTE]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'ОСК ПРОЕКТА',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок будет наказан по следующему пункту:<br><br>"+
        "[QUOTE][COLOR=rgb(255, 0, 0)]2.40. [/COLOR]Запрещены OOC угрозы, в том числе и завуалированные[COLOR=rgb(255, 0, 0)]| Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/COLOR][/QUOTE]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'ПРОДАЖА ПРОМО',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок будет наказан по следующему пункту:<br><br>"+
        "[QUOTE][COLOR=rgb(255, 0, 0)]2.43. [/COLOR]Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций[COLOR=rgb(255, 0, 0)]| Mute 120 минут[/COLOR][/QUOTE]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'ЕПП',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок будет наказан по следующему пункту:<br><br>"+
        "[QUOTE][COLOR=rgb(255, 0, 0)]2.46. [/COLOR]Запрещено ездить по полям на любом транспорте[COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][/QUOTE]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'ЕПП ФУР / ИНК',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок будет наказан по следующему пункту:<br><br>"+
        "[QUOTE][COLOR=rgb(255, 0, 0)]2.47. [/COLOR]Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора)[COLOR=rgb(255, 0, 0)]| Jail 60 минут[/COLOR][/QUOTE]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'АРЕСТ В ИНТЕР',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок будет наказан по следующему пункту:<br><br>"+
        "[QUOTE][COLOR=rgb(255, 0, 0)]2.50. [/COLOR]Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий[COLOR=rgb(255, 0, 0)]| Ban 7 - 15 дней + увольнение из организации[/COLOR][/QUOTE]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'NRP АКС',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок будет наказан по следующему пункту:<br><br>"+
        "[QUOTE][COLOR=rgb(255, 0, 0)]2.52. [/COLOR]Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера[COLOR=rgb(255, 0, 0)]| При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + Jail 30 минут[/COLOR][/QUOTE]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'ОСК АДМ',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок будет наказан по следующему пункту:<br><br>"+
        "[QUOTE][COLOR=rgb(255, 0, 0)]2.54. [/COLOR]Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации[COLOR=rgb(255, 0, 0)]| Mute 180 минут[/COLOR][/QUOTE]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'БАГОЮЗ АНИМ',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок будет наказан по следующему пункту:<br><br>"+
        "[QUOTE][COLOR=rgb(255, 0, 0)]2.55. [/COLOR]Запрещается багоюз связанный с анимацией в любых проявлениях[COLOR=rgb(255, 0, 0)]| Jail 60 / 120 минут[/COLOR][/QUOTE]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'НЕВОЗВРАТ ДОЛГ',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "Игрок будет наказан по следующему пункту:<br><br>"+
        "[QUOTE][COLOR=rgb(255, 0, 0)]2.57.[/COLOR] Запрещается брать в долг игровые ценности и не возвращать их.[COLOR=rgb(255, 0, 0)] | Ban 30 дней / permban[/COLOR][/QUOTE]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'КАПС',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок будет наказан по следующему пункту:<br><br>"+
        "[QUOTE][COLOR=rgb(255, 0, 0)]3.02. [/COLOR]Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате[COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][/QUOTE]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'ОСКОРБ',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок будет наказан по следующему пункту:<br><br>"+
        "[QUOTE][COLOR=rgb(255, 0, 0)]3.03. [/COLOR]Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены[COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][/QUOTE]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'ОСК / УПОМ РОД',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок будет наказан по следующему пункту:<br><br>"+
        "[QUOTE][COLOR=rgb(255, 0, 0)]3.04. [/COLOR]Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC)[COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 7 - 15 дней[/COLOR][/QUOTE]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'FLOOD',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок будет наказан по следующему пункту:<br><br>"+
        "[QUOTE][COLOR=rgb(255, 0, 0)]3.05. [/COLOR]Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока[COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][/QUOTE]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'ЗЛОУП СИМВ',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок будет наказан по следующему пункту:<br><br>"+
        "[QUOTE][COLOR=rgb(255, 0, 0)]3.06. [/COLOR]Запрещено злоупотребление знаков препинания и прочих символов[COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][/QUOTE]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'СЛИВ ГЛ ЧАТ',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок будет наказан по следующему пункту:<br><br>"+
        "[QUOTE][COLOR=rgb(255, 0, 0)]3.08. [/COLOR]Запрещены любые формы «слива» посредством использования глобальных чатов |[COLOR=rgb(255, 0, 0)]| PermBan[/COLOR][/QUOTE]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'ВЫД ЗА АДМ',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок будет наказан по следующему пункту:<br><br>"+
        "[QUOTE][COLOR=rgb(255, 0, 0)]3.10. [/COLOR]Запрещена выдача себя за администратора, если таковым не являетесь[COLOR=rgb(255, 0, 0)]| Ban 7 - 15[/COLOR][/QUOTE]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'ВВОД В ЗАБЛ КМД',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок будет наказан по следующему пункту:<br><br>"+
        "[QUOTE][COLOR=rgb(255, 0, 0)]3.11. [/COLOR]Запрещено введение игроков проекта в заблуждение путем злоупотребления командами[COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней / PermBan[/COLOR][/QUOTE]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'ПОЛ ПРОПАГАН / ПРИЗЫВ К ФЛУДУ',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок будет наказан по следующему пункту:<br><br>"+
        "[QUOTE][COLOR=rgb(255, 0, 0)]3.18. [/COLOR]Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов[COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 10 дней[/COLOR][/QUOTE]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'ТРАНСЛИТ',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок будет наказан по следующему пункту:<br><br>"+
        "[QUOTE][COLOR=rgb(255, 0, 0)]3.20. [/COLOR]Запрещено использование транслита в любом из чатов[COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][/QUOTE]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'УПОМ ПРОМО',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок будет наказан по следующему пункту:<br><br>"+
        "[QUOTE][COLOR=rgb(255, 0, 0)]3.21. [/COLOR]Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах[COLOR=rgb(255, 0, 0)]| Ban 30 дней[/COLOR][/QUOTE]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'ОБЪЯВ НА ТЕР ГОС',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок будет наказан по следующему пункту:<br><br>"+
        "[QUOTE][COLOR=rgb(255, 0, 0)]3.22. [/COLOR]Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC)[COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][/QUOTE]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'МАТ В VIP',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Игрок будет наказан по следующему пункту:<br><br>"+
        "[QUOTE][COLOR=rgb(255, 0, 0)]3.23. [/COLOR]Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате[COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][/QUOTE]<br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ROLEPLAY БИОГРАФИИ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀'
    },
    {
        title: 'БИО ОДОБРЕН',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Ваша RolePlay биография была проверена и одобрена<br><br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR]<br><br>"+
        "Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'БИО НЕ ПО ФОРМ',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Ваша RolePlay биография была проверена и отказана<br>"+
        "Причиной тому стало не соответствие биографии и формы подачи<br>"+
        "Создайте новую RolePlay биографию руководствуясь правилами подачи - [URL='https://forum.blackrussia.online/index.php?threads/krasnodar-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3131343/']*ссылка*[/URL]<br><br>"+
        "[COLOR=rgb(255, 0, 0)]Отказано. Закрыто[/COLOR]<br><br>"+
        "Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: UNACCEPT_PREFIX,
        status: false
    },
    {
        title: 'ЗАГОЛ БИО НЕ ПО ФОРМ',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Ваша RolePlay биография была проверена и отказана<br>"+
        "Причиной тому стало не соответствие заголовка биографии и формы подачи<br>"+
        "Создайте новую RolePlay биографию руководствуясь правилами подачи - [URL='https://forum.blackrussia.online/index.php?threads/krasnodar-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3131343/']*ссылка*[/URL]<br><br>"+
        "[COLOR=rgb(255, 0, 0)]Отказано. Закрыто[/COLOR]<br><br>"+
        "Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: UNACCEPT_PREFIX,
        status: false
    },
    {
        title: 'БИО ОТ 3 ЛИЦ',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Ваша RolePlay биография была проверена и отказана<br>"+
        "Причиной тому стало ведение биографии от 3-го лица<br>"+
        "Создайте новую RolePlay биографию руководствуясь правилами подачи - [URL='https://forum.blackrussia.online/index.php?threads/krasnodar-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3131343/']*ссылка*[/URL]<br><br>"+
        "[COLOR=rgb(255, 0, 0)]Отказано. Закрыто[/COLOR]<br><br>"+
        "Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: UNACCEPT_PREFIX,
        status: false
    },
    {
        title: 'БИО ГРАМ ОШИБ',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Ваша RolePlay биография была проверена и отказана<br>"+
        "Причиной тому стало большое количество грамматических ошибок<br>"+
        "Создайте новую RolePlay биографию руководствуясь правилами подачи - [URL='https://forum.blackrussia.online/index.php?threads/krasnodar-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3131343/']*ссылка*[/URL]<br><br>"+
        "[COLOR=rgb(255, 0, 0)]Отказано. Закрыто[/COLOR]<br><br>"+
        "Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: UNACCEPT_PREFIX,
        status: false
    },
    {
        title: 'БИО МАЛО ИНФ \ НА ДОР',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Ваша RolePlay биография была проверена и отправлена на доработку<br>"+
        "Причиной тому стало маленькое количество информации. У вас есть [COLOR=rgb(255, 0, 0)]24 часа[/COLOR] на дополнение<br><br>"+
        "[COLOR=rgb(255, 0, 0)]На рассмотрении[/COLOR]<br><br>"+
        "Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: PIN_PREFIX,
        status: true
    },
    {
        title: 'БИО ОТКАЗ ПОСЛЕ ДОР',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR]<br><br>"+
        "[FONT=trebuchet ms]Ваша RolePlay биография была проверена и отказана<br>"+
        "В биографии по прежнему мало информации<br><br>"+
        "[COLOR=rgb(255, 0, 0)]Отказано. Закрыто[/COLOR][/FONT][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: UNACCEPT_PREFIX,
        status: false
    },
    {
        title: 'БИО КОПИПАСТ',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Ваша RolePlay биография была проверена и отказана<br>"+
        "Причиной тому стало полное / частичное копирование другой биографии<br>"+
        "Создайте новую RolePlay биографию руководствуясь правилами подачи - [URL='https://forum.blackrussia.online/index.php?threads/krasnodar-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3131343/']*ссылка*[/URL]<br><br>"+
        "[COLOR=rgb(255, 0, 0)]Отказано. Закрыто[/COLOR]<br><br>"+
        "Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: UNACCEPT_PREFIX,
        status: false
    },
    {
        title: 'БИО <18 ИЛИ >65 ЛЕТ',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Ваша RolePlay биография была проверена и отказана.<br>"+
        "Причиной тому стал возраст персонажа, который, исходя из правил, не может быть меньше 18-ти и больше 65-ти.<br>"+
        "Создайте новую RolePlay биографию руководствуясь правилами подачи - [URL='https://forum.blackrussia.online/index.php?threads/krasnodar-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3131343/']*ссылка*[/URL]<br><br>"+
        "[COLOR=rgb(255, 0, 0)]Отказано. Закрыто[/COLOR]<br><br>"+
        "Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: UNACCEPT_PREFIX,
        status: false
    },
    {
        title: 'БИО НРП НИК',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Ваша RolePlay биография была проверена и отказана.<br>"+
        "Причиной тому стал ваш ник, который не соответствует нормам.<br>"+
        "Создайте новую RolePlay биографию руководствуясь правилами подачи - [URL='https://forum.blackrussia.online/index.php?threads/krasnodar-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3131343/']*ссылка*[/URL]<br><br>"+
        "[COLOR=rgb(255, 0, 0)]Отказано. Закрыто[/COLOR]<br><br>"+
        "Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: UNACCEPT_PREFIX,
        status: false
    },
    {
        title: 'ДАТ РОЖД / ВОЗР РАЗН',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Ваша RolePlay биография была проверена и отказана<br>"+
        "Причиной тому стало не соответствие даты рождения и возраста<br>"+
        "Создайте новую RolePlay биографию руководствуясь правилами подачи - [URL='https://forum.blackrussia.online/index.php?threads/krasnodar-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3131343/']*ссылка*[/URL]<br><br>"+
        "[COLOR=rgb(255, 0, 0)]Отказано. Закрыто[/COLOR]<br><br>"+
        "Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: UNACCEPT_PREFIX,
        status: false
    },
    {
        title: 'ФОРМ НЕ ЗАПОЛН',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Ваша RolePlay биография была проверена и отказана<br>"+
        "Причиной тому стало не заполнение формы подачи<br>"+
        "Создайте новую RolePlay биографию руководствуясь правилами подачи - [URL='https://forum.blackrussia.online/index.php?threads/krasnodar-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3131343/']*ссылка*[/URL]<br><br>"+
        "[COLOR=rgb(255, 0, 0)]Отказано. Закрыто[/COLOR]<br><br>"+
        "Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: UNACCEPT_PREFIX,
        status: false
    },
    {
        title: '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀РП СИТУАЦИИ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀',
    },
    {
        title: 'СИТ ОДОБРЕН',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Ваша RolePlay ситуация была проверена и одобрена<br><br>"+
        "[COLOR=rgb(255, 0, 0)]Одобрено. Закрыто[/COLOR]<br><br>"+
        "Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false
    },
    {
        title: 'СИТ НЕ ПО ФОРМ',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Ваша RolePlay ситуация была проверена и отказана<br>"+
        "Причиной тому стало не соответствие ситуации и формы подачи<br>"+
        "Создайте новую RolePlay ситуацию руководствуясь правилами подачи - [URL='https://forum.blackrussia.online/index.php?threads/krasnodar-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B8.3137988/']*ссылка*[/URL]<br><br>"+
        "[COLOR=rgb(255, 0, 0)]Отказано. Закрыто[/COLOR]<br><br>"+
        "Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: UNACCEPT_PREFIX,
        status: false
    },
    {
        title: 'СИТ БЕЗ СМЫСЛ',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Ваша RolePlay ситуация была проверена и отказана<br>"+
        "Причиной тому стало отсутствие смысловой нагрузки<br>"+
        "Создайте новую RolePlay ситуацию руководствуясь правилами подачи - [URL='https://forum.blackrussia.online/index.php?threads/krasnodar-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B8.3137988/']*ссылка*[/URL]<br><br>"+
        "[COLOR=rgb(255, 0, 0)]Отказано. Закрыто[/COLOR]<br>"+
        "Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: UNACCEPT_PREFIX,
        status: false
    },
    {
        title: 'СИТ ГРАМ ОШИБ',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Ваша RolePlay ситуация была проверена и отказана<br>"+
        "Причиной тому стало большое количество грамматических ошибок<br>"+
        "Создайте новую RolePlay ситуацию руководствуясь правилами подачи - [URL='https://forum.blackrussia.online/index.php?threads/krasnodar-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B8.3137988/']*ссылка*[/URL]<br><br>"+
        "[COLOR=rgb(255, 0, 0)]Отказано. Закрыто[/COLOR]<br><br>"+
        "Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: UNACCEPT_PREFIX,
        status: false
    },
    {
        title: 'СИТ МАЛО ИНФ',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Ваша RolePlay ситуация была проверена и отправлена на доработку<br>"+
        "Причиной тому стало маленькое количество информации. У вас есть [COLOR=rgb(255, 0, 0)]24 часа[/COLOR] на дополнение<br><br>"+
        "[COLOR=rgb(255, 0, 0)]На рассмотрении[/COLOR]<br><br>"+
        "Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        pefix: PIN_PREFIX,
        status: true
    },
    {
        title: 'СИТ ОТКАЗ ПОСЛЕ ДОР',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Ваша RolePlay ситуации была проверена и отказана<br>"+
        "В ситуации по прежнему мало информации<br><br>"+
        "[COLOR=rgb(255, 0, 0)]Отказано. Закрыто[/COLOR]<br>"+
        "Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: UNACCEPT_PREFIX,
        status: false
    },
    {
        title: 'СИТ КОПИПАСТ',
        content:
        "[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Приветствую[/FONT][/COLOR][/SIZE]<br><br>"+
        "[FONT=trebuchet ms][SIZE=4]Ваша RolePlay ситуация была проверена и отказана<br>"+
        "Причиной тому стало полное / частичное копирование другой ситуации<br>"+
        "Создайте новую RolePlay ситуацию руководствуясь правилами подачи - [URL='https://forum.blackrussia.online/index.php?threads/krasnodar-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B8.3137988/']*ссылка*[/URL]<br><br>"+
        "[COLOR=rgb(255, 0, 0)]Отказано. Закрыто[/COLOR]<br><br>"+
        "Приятной игры на просторах [COLOR=rgb(0, 0, 0)]BLACK [/COLOR][COLOR=rgb(255, 0, 0)]RUSSIA [/COLOR][COLOR=rgb(255, 255, 255)]KRASNODAR[/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: UNACCEPT_PREFIX,
        status: false
    },

];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
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