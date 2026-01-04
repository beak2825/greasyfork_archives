// ==UserScript==
// @name         КФ & ГС/ЗГС | CHEREPOVETS 
// @namespace    http://tampermonkey.net/
// @version      6.28
// @description  По вопросам ВК - https://vk.com/id796529644, туда же и по предложениям на улучшение скрипта)
// @author       Persona_Capone | Артур Рахимов 
// @match        https://forum.blackrussia.online/threads/*
// @grant        none
// @license 	 MIT
// @icon https://i.postimg.cc/fTMZhPhr/1540128479-8567007.gif
// @downloadURL https://update.greasyfork.org/scripts/515489/%D0%9A%D0%A4%20%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20%7C%20CHEREPOVETS.user.js
// @updateURL https://update.greasyfork.org/scripts/515489/%D0%9A%D0%A4%20%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20%7C%20CHEREPOVETS.meta.js
// ==/UserScript==

(function() {
    'use strict';
const UNACCEPT_PREFIX = 4;
const ACCEPT_PREFIX = 8;
const RASSMOTENO_PREFIX = 9;
const PIN_PREFIX = 2;
const GA_PREFIX = 12;
const COMMAND_PREFIX = 10;
const RESHENO_PREFIX = 6;
const WAIT_PREFIX = 14;
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SPECY_PREFIX = 11;
const TEX_PREFIX = 13;
const buttons = [
     {
      title: 'Свой ответ',
      content:
        '[CENTER][FONT=arial][COLOR=#0099FF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT] <br><br>' +
        "[COLOR=WHITE][FONT=arial] ТЕКСТ [/FONT][/COLOR][COLOR=WHITE][/COLOR][/CENTER] <br><br>" +
        '[CENTER][FONT=arial][SIZE=4][color=#ff0000]Закрыто.[/color][/SIZE][/FONT][/CENTER]',
},
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Надоооооооо тааааааааааак ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'На рассмотрение',
      content:
          '[CENTER][FONT=arial][COLOR=#0099FF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT] <br><br>' +
        "[COLOR=WHITE][FONT=arial]Ваша жалоба взята на рассмотрение.<br>Ожидайте ответа в данной теме. Пожалуйста, не создавайте копии этой темы, иначе это может привести к блокировке Вашего форумного аккаунта.[/FONT][/COLOR][/CENTER] <br><br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#F37934]На рассмотрении.[/SIZE][/FONT][/COLOR][/B][/CENTER]',
      prefix: PIN_PREFIX,
   status: true,
},
    {
      title: 'Ошибся разделом (перенесу)',
      content:
        '[CENTER][FONT=arial][COLOR=#0099FF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT] <br><br>' +
        "[COLOR=WHITE][FONT=arial]Вы ошиблись разделом. Переношу Вашу тему в нужный раздел.<br>Ожидайте ответа в этой теме, копии создавать не нужно.[/FONT][/COLOR][/CENTER] <br><br>" +
        '[CENTER][B][FONT=arial][SIZE=4][color=WHITE]Ожидайте ответа.[/color][/SIZE][/FONT][/CENTER]',      
},
    {
      title: 'Ошибся сервером (перенесу)',
      content:
          '[CENTER][FONT=arial][COLOR=#0099FF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT] <br><br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][COLOR=WHITE][FONT=arial]Вы ошиблись сервером. Переношу Вашу тему в нужный раздел. Ожидайте вынесения вердикта от администрации Вашего сервера.[/FONT][/COLOR][/CENTER] <br>" +
        '[CENTER][FONT=arial][SIZE=4][color=WHITE]Ожидайте ответа.[/color][/SIZE][/FONT][/CENTER]',      
},
    {
      title: 'Одобрено',
      content:
        '[CENTER][FONT=arial][COLOR=#0099FF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT] <br><br>' +
        "[COLOR=WHITE][FONT=arial]Игрок будет наказан. Благодарим за обращение.[/FONT][/COLOR][COLOR=WHITE][/COLOR][/CENTER] <br><br>" +
                '[CENTER][FONT=times new roman][SIZE=5][SIZE=4][FONT=arial][color=#00ff00]Одобрено.[/COLOR]<br><br>[RIGHT]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR][/RIGHT][/FONT][/SIZE][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Одобрено | Игроки будут наказаны',
      content:
        '[CENTER][FONT=arial][COLOR=#0099FF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT] <br><br>' +
        "[COLOR=WHITE][FONT=arial]Игроки будут наказаны. Благодарим за обращение.[/FONT][/COLOR][COLOR=WHITE][/COLOR][/CENTER] <br><br>" +
                '[CENTER][FONT=times new roman][SIZE=5][SIZE=4][FONT=arial][color=#00ff00]Одобрено.[/COLOR]<br><br>[RIGHT]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR][/RIGHT][/FONT][/SIZE][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Игрок будет наказан | Найдено ст. ПО',
      content:
        '[CENTER][FONT=arial][COLOR=#0099FF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT] <br><br>' +
        "[COLOR=WHITE][FONT=arial]На Ваших доказательствах обнаружено стороннее ПО с Вашей стороны, Вы и игрок будете наказаны.[/FONT][/COLOR][COLOR=WHITE][/COLOR][/CENTER] <br><br>" +
                        '[CENTER][FONT=times new roman][SIZE=5][SIZE=4][FONT=arial][color=#00ff00] Рассмотрено.[/COLOR]<br><br>[RIGHT]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR][/RIGHT][/FONT][/SIZE][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴передам ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
},
    {
      title: 'Специальной администрации',
      content:
        '[CENTER][FONT=arial][COLOR=#0099FF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT] <br><br>' +
        "[COLOR=WHITE][FONT=arial]Ваша жалоба передана Специальной администрации.<br>Ожидайте ответа в данной теме, не нужно создавать копии этой темы.[/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=arial][SIZE=4]Передано [color=#ff0000]Специальной Администрации.[/color][/SIZE][/FONT][/CENTER]',
      prefix: SPECY_PREFIX,
   status: true,
},
    {
      title: 'Главному администратору',
      content:
        '[CENTER][FONT=arial][COLOR=#0099FF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT] <br><br>' +
        "[COLOR=WHITE][FONT=arial]Ваша жалоба передана Главному Администратору.<br>Ожидайте ответа в данной теме, не нужно создавать копии этой темы.[/FONT][/CENTER]<br><br>" +
        '[CENTER][FONT=arial][SIZE=4]Передано [color=#ff0000]Главному Администратору.[/color][/SIZE][/FONT][/CENTER]',
      prefix: GA_PREFIX,
   status: true,
},
    {
      title: 'Заместителю ГА',
      content:
          '[CENTER][FONT=arial][COLOR=#0099FF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT] <br><br>' +
        "[COLOR=WHITE][FONT=arial]Ваша жалоба передана Заместителю Главного Администратора.<br>Ожидайте ответа в данной теме, не нужно создавать копии этой темы.[/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=arial][SIZE=4]Передано [color=#DC143C]Заместителю ГА.[/color][/SIZE][/FONT][/CENTER]',
      prefix: GA_PREFIX,
   status: true,
},
    {
      title: 'Куратору Администрации',
      content:
          '[CENTER][FONT=arial][COLOR=#0099FF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT] <br><br>' +
        "[COLOR=WHITE][FONT=arial]Ваша жалоба передана Куратору Администрации.<br>Ожидайте ответа в данной теме, не нужно создавать копии этой темы.[/FONT][/CENTER]<br><br>" +
        '[CENTER][FONT=arial][SIZE=4]Передано [color=#800080]Куратору Администрации.[/color][/SIZE][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
   status: true,
},
    {
      title: 'Тех. Специалисту',
      content:
          '[CENTER][FONT=arial][COLOR=#0099FF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT] <br><br>' +
        "[COLOR=WHITE][FONT=arial]Ваша жалоба передана Техническому Специалисту.<br>Ожидайте ответа в данной теме, не нужно создавать копии этой темы.[/FONT][/CENTER]<br><br>" +
        '[CENTER][FONT=arial][SIZE=4]Передано [color=#ff4500]Тех. Специалисту.[/color][/SIZE][/FONT][/CENTER]',
      prefix: TEX_PREFIX,
   status: 123,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила RP процесса ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
},
    {
      title: 'nRP поведение | 2.01',
      content:
          '[CENTER][FONT=arial][COLOR=#0099FF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT] <br><br>' +
        "[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]2.01. [/COLOR]Запрещено поведение, нарушающее нормы процессов Role Play режима игры [COLOR=RED]| Jail 30 минут[/COLOR]<br>[LIST][COLOR=RED]Примечание:[/COLOR] ездить на крышах транспортных средств, бегать или ходить по столам в казино, целенаправленная провокация сотрудников правоохранительных органов с целью развлечения, целенаправленная помеха в проведении различных собеседований и так далее.[/LIST][/FONT][/COLOR][CENTER][/CENTER] <br><br>" +
                '[CENTER][FONT=times new roman][SIZE=5][SIZE=4][FONT=arial][color=#00ff00]Одобрено.[/COLOR]<br><br>[RIGHT]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR][/RIGHT][/FONT][/SIZE][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Уход от RP | 2.02',
      content:
          '[CENTER][FONT=arial][COLOR=#0099FF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT] <br><br>' +
        "[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]2.02. [/COLOR]Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [COLOR=RED]| Jail 30 минут / Warn[/COLOR]<br>[LIST][COLOR=RED]Примечание:[/COLOR] уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания или ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснуться Вашего персонажа. Уходить в интерьер или зеленую зону во время перестрелки с целью избежать смерти или уйти от Role Play процесса и так далее.[/LIST][/FONT][/COLOR][CENTER][/CENTER] <br><br>" +
                        '[CENTER][FONT=times new roman][SIZE=5][SIZE=4][FONT=arial][color=#00ff00]Одобрено.[/COLOR]<br><br>[RIGHT]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR][/RIGHT][/FONT][/SIZE][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'nRP drive | 2.03',
      content:
        '[CENTER][FONT=arial][COLOR=#0099FF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT] <br><br>' +
        "[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]2.03. [/COLOR]Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [COLOR=RED]| Jail 30 минут[/COLOR]<br>[LIST][COLOR=RED]Примечание:[/COLOR] нарушением считаются такие действия, как езда на скутере по горам, намеренное создание аварийных ситуаций при передвижении. Передвижение по полям на любом транспорте, за исключением кроссовых мотоциклов и внедорожников.[/LIST][/FONT][/COLOR][CENTER][/CENTER] <br><br>" +
                        '[CENTER][FONT=times new roman][SIZE=5][SIZE=4][FONT=arial][color=#00ff00]Одобрено.[/COLOR]<br><br>[RIGHT]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR][/RIGHT][/FONT][/SIZE][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Помеха игр. процессу | 2.04',
      content:
          '[CENTER][FONT=arial][COLOR=#0099FF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT] <br><br>' +
        "[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]2.04. [/COLOR]Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы.  [COLOR=RED]| Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/COLOR]<br>[LIST][COLOR=RED]Пример:[/COLOR] таран дальнобойщиков, инкассаторов под разными предлогами.[/LIST][/FONT][/COLOR][CENTER][/CENTER] <br><br>" +
                        '[CENTER][FONT=times new roman][SIZE=5][SIZE=4][FONT=arial][color=#00ff00]Одобрено.[/COLOR]<br><br>[RIGHT]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR][/RIGHT][/FONT][/SIZE][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'nRP обман | 2.05',
      content:
        '[CENTER][FONT=arial][COLOR=#0099FF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT] <br><br>' +
        "[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]2.05. [/COLOR]Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [COLOR=RED]| PermBan[/COLOR]<br>[LIST][COLOR=RED]Примечание:[/COLOR] после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.[/LIST]<br>[LIST][COLOR=RED]Примечание:[/COLOR] разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).[/LIST][/FONT][/COLOR][CENTER][/CENTER] <br><br>" +
                        '[CENTER][FONT=times new roman][SIZE=5][SIZE=4][FONT=arial][color=#00ff00]Одобрено.[/COLOR]<br><br>[RIGHT]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR][/RIGHT][/FONT][/SIZE][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'аморальные действия | 2.08',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL]<br>[B][COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]2.08. [/COLOR]Запрещена любая форма аморальных действий сексуального характера в сторону игроков [COLOR=RED]| Jail 30 минут / Warn[/COLOR]<br>[LIST][COLOR=RED]Исключение:[/COLOR] обоюдное согласие обеих сторон.[/LIST][/FONT][/COLOR][CENTER][/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Слив склада | 2.09',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL]<br>[B][COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]2.09. [/COLOR]Запрещено сливать склад фракции / семьи путем взятия большого количества ресурсов или превышая допустимый лимит, установленный лидером [COLOR=RED]| Ban 15 - 30 дней / PermBan[/COLOR]<br>[LIST][COLOR=RED]Примечание:[/COLOR] в описании семьи должны быть указаны условия взаимодействия со складом. Если лидер семьи предоставил неограниченный доступ к складу и забыл снять его, администрация не несет ответственности за возможные последствия. Жалобы по данному пункту правил принимаются только от лидера семьи.[/LIST]<br>[LIST][COLOR=RED]Примечание:[/COLOR] исключение всех или части игроков из состава семьи без ведома лидера также считается сливом.[/LIST][/FONT][/COLOR][CENTER][/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Т/С фракции в лич. целях | 2.11',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL]<br>[B][COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]2.11. [/COLOR]Запрещено использование рабочего или фракционного транспорта в личных целях [COLOR=RED]| Jail 30 минут[/FONT][/COLOR].[/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'DB | 2.13',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL]<br>[B][COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]2.13. [/COLOR]Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [COLOR=RED]| Jail 60 минут[/COLOR]<br>[LIST][COLOR=RED]Исключение:[/COLOR] разрешается на территории проведения мероприятия по захвату упавшего семейного контейнера.[/LIST][/FONT][/COLOR][CENTER][/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'TK | 2.15',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL]<br>[B][COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]2.15. [/COLOR]Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [COLOR=RED]| Jail 60 минут / Warn (за два и более убийства)[/FONT][/COLOR].[/B][COLOR=WHITE]<br>[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'SK | 2.16',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL]<br>[B][COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]2.16. [/COLOR]Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [COLOR=RED]| Jail 60 минут / Warn (за два и более убийства)[/FONT][/COLOR].[/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'MG | 2.18',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL]<br>[B][COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]2.18. [/COLOR]Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [COLOR=RED]| Mute 30 минут[/COLOR]<br>[LIST][COLOR=RED]Примечание:[/COLOR] использование смайлов в виде символов «))», «=D» запрещено в IC чате.[/LIST]<br>[LIST][COLOR=RED]Примечание:[/COLOR] телефонное общение также является IC чатом.[/LIST]<br>[LIST][COLOR=RED]Исключение:[/COLOR] за написанный однократно вопросительный «?» или восклицательный «!» знак в IC чате, наказание не выдается.[/LIST][/FONT][/COLOR][CENTER][/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'DM | 2.19',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL]<br>[B][COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]2.19. [/COLOR]Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [COLOR=RED]| Jail 60 минут[/COLOR]<br>[LIST][COLOR=RED]Примечание:[/COLOR] разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/LIST]<br>[LIST][COLOR=RED]Примечание:[/COLOR] нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/LIST][/FONT][/COLOR][CENTER][/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Mass DM | 2.20',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL]<br>[B][COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]2.20. [/COLOR]Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [COLOR=RED]| Warn / Ban 3 - 7 дней[/FONT][/COLOR].[/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Обход системы / Багаюз | 2.21',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL]<br>[B][COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]2.21. [/COLOR]Запрещено пытаться обходить игровую систему или использовать любые баги сервера [COLOR=RED]| Ban 15 - 30 дней / PermBan (по согласованию с ГА, ЗГА, руководством тех. специалистов)[/COLOR]<br>[LIST][COLOR=RED]Примечание:[/COLOR] под игровой системой подразумеваются функции и возможности, которые реализованы в игре для взаимодействия между игроками, а также взаимодействия игроков с функциями, у которых есть свое конкретное предназначение.[/LIST]<br>[LIST][COLOR=RED]Пример:[/COLOR] аптечка предназначена для пополнения уровня здоровья, доступна всем игрокам по фиксированной цене в любом магазине. Но она не предназначена для перепродажи по завышенной цене для передачи виртуальной валюты между игроками;<br>Аксессуары предназначены для украшения внешнего вида персонажа, не предназначены для передачи виртуальной валюты между игроками;<br>Банк и личные счета предназначены для передачи денежных средств между игроками;<br>Транспортное средство предназначено для передвижения игроков, не предназначено для передачи денег тем или иным способом, включая обмен с завышенными доплатами.[/LIST][/FONT][/COLOR][CENTER][/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Постороннее ПО | 2.22',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]2.22. [/COLOR]Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [COLOR=RED]| Ban 15 - 30 дней / PermBan[/COLOR]<br>[LIST][COLOR=RED]Примечание:[/COLOR] запрещено внесение любых изменений в оригинальные файлы игры.[/LIST]<br>[LIST][COLOR=RED]Исключение:[/COLOR] разрешено изменение шрифта, его размера и длины чата (кол-во строк).[/LIST]<br>[LIST][COLOR=RED]Исключение:[/COLOR] блокировка за включенный счетчик FPS не выдается.[/LIST][/FONT][/COLOR][CENTER][/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Реклама | 2.31',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL]<br>[B][COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]2.31. [/COLOR]Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube-каналы и тому подобное [COLOR=RED]| Ban 7 дней / PermBan[/COLOR]<br>[LIST][COLOR=RED]Примечание:[/COLOR] если игрок не использует глобальный чат, чтобы дать свои контактные данные для связи, это не будет являться рекламой.[/LIST][/FONT][/COLOR][CENTER][/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Уязвимость правил | 2.33',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]2.33. [/COLOR]Запрещено пользоваться уязвимостью правил [COLOR=RED]| Ban 15 - 30 дней / PermBan[/COLOR]<br>[LIST][COLOR=RED]Примечание:[/COLOR] игрок объясняет свою невиновность тем, что какой-либо пункт правил недостаточно расписан, но вина очевидна. Либо его действия формально не нарушают конкретного пункта, но всё же наносят ущерб другим игрокам или игровой системе.[/LIST]<br>[LIST][COLOR=RED]Пример:[/COLOR] игрок сознательно берёт долг через трейд, не планируя его возвращать, считая, что по правилам это не считается долгом и наказания не будет.[/LIST][/FONT][/COLOR][CENTER][/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Розжиг межнац. конфликта(-ов) | 2.35',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]2.35. [/COLOR]На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате [COLOR=RED]| Mute 120 минут / Ban 7 дней[/FONT][/COLOR].[/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'OOC угрозы / Угрозы наказанием от адм | 2.37',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]2.37. [/COLOR]Запрещены OOC-угрозы, в том числе и завуалированные, а также угрозы наказанием со стороны администрации [COLOR=RED]| Mute 120 минут / Ban 7 - 15 дней.[/COLOR]<br>[LIST][COLOR=RED]Примечание:[/COLOR] блокировка аккаунта выдаётся в случае, если есть прямые угрозы жизни, здоровью игрока или его близким. По решению главного администратора может быть выдана перманентная блокировка.[/LIST][/FONT][/COLOR][CENTER][/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Оск. проекта | 2.40',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]2.40. [/COLOR]Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [COLOR=RED]| Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/FONT][/COLOR].[/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Продажа промо | 2.43',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]2.43. [/COLOR]Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций [COLOR=RED]| Mute 120 минут[/FONT][/COLOR].[/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'ЕПП фура | 2.47',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]2.47. [/COLOR]Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [COLOR=RED]| Jail 60 минут[/FONT][/COLOR].[/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Арест в интерьере | 2.50',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]2.50. [/COLOR]Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий [COLOR=RED]| Ban 7 - 15 дней + увольнение из организации[/FONT][/COLOR].[/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'nRP аксессуар | 2.52',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]2.52. [/COLOR]Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. [COLOR=RED]| При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/COLOR]<br>[LIST][COLOR=RED]Пример:[/COLOR] слишком большие аксессуары на голове персонажа, имитация гитарой половых органов и тому подобное.[/LIST][/FONT][/COLOR][CENTER][/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Оск. Администрации | 2.54',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]2.54. [/COLOR]Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [COLOR=RED]| Mute 180 минут[/COLOR]<br>[LIST][COLOR=RED]Пример:[/COLOR] оформление жалобы в игре с текстом: «Быстро починил меня», «Админы вы задрали уже когда работать будете меня тут ДБшат я 3 жалобы уже подал!!!!!!!!», «МОЗГИ ВКЛЮЧИТЕ Я УВОЛЮ ВАС ЩА» и т.д. и т.п., а также при взаимодействии с другими игроками.[/LIST]<br>[LIST][COLOR=RED]Пример:[/COLOR] оскорбление администрации в любой чат, включая репорт подлежит наказанию в виде блокировки доступа к использованию всех видов чатов - Mute 180 минут.[/LIST][/FONT][/COLOR][CENTER][/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Баг с аним | 2.55',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]2.55.[/COLOR]Запрещается багоюз связанный с анимацией в любых проявлениях.  [COLOR=RED]| Jail 120 минут[/COLOR]<br>[LIST][COLOR=RED]Примечание:[/COLOR] наказание применяется в случаях, когда, используя ошибку, игрок получает преимущество перед другими игроками.[/LIST]<br>[LIST][COLOR=RED]Пример:[/COLOR] если игрок, используя баг, убирает ограничение на использование оружия в зелёной зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес, перестрелки на мероприятии с семейными контейнерами или на мероприятии от администрации.[/LIST]<br>[LIST][COLOR=RED]Исключение:[/COLOR] разрешается использование сбива темпа стрельбы в войне за бизнес при согласии обеих сторон и с уведомлением следящего администратора в соответствующей беседе.[/LIST][/FONT][/COLOR][CENTER][/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Не возрат долга | 2.57',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]2.57.[/COLOR]Запрещается брать в долг игровые ценности и не возвращать их.  [COLOR=RED]| Ban 30 дней / PermBan[/COLOR]<br>[LIST][COLOR=RED]Примечание:[/COLOR] займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется;[/LIST]<br>[LIST][COLOR=RED]Примечание:[/COLOR] при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда;[/LIST]<br>[LIST][COLOR=RED]Примечание:[/COLOR] жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами.[/LIST][/FONT][/COLOR][CENTER][/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,  
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Игровые чаты ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
},
    {
      title: 'CapsLock | 3.02',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]3.02. [/COLOR]Запрещено использование верхнего регистра (Caps Lock) при написании любого текста в любом чате [COLOR=RED]| Mute 30 минут.[/COLOR][/FONT][/COLOR]<br>[LIST][COLOR=RED]Пример:[/COLOR] «ПрОдАм», «куплю МАШИНУ».[/LIST][CENTER][/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,

},
    {
      title: 'Оскорбление в OOC | 3.03',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]3.03. [/COLOR]Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [COLOR=RED]| Mute 30 минут[/FONT][/COLOR].[/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,

},
    {
      title: 'Оск/упом родных | 3.04',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]3.04. [/COLOR]Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [COLOR=RED]| Mute 120 минут / Ban 7 - 15 дней[/COLOR]<br>[LIST][COLOR=RED]Примечание:[/COLOR] термины «MQ», «rnq» расценивается, как упоминание родных.[/LIST]<br>[LIST][COLOR=RED]Исключение:[/COLOR] если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/LIST][/FONT][/COLOR][CENTER][/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,

},
    {
      title: 'Flood | 3.05',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]3.05. [/COLOR]Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [COLOR=RED]| Mute 30 минут[/FONT][/COLOR].[/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,

},
    {
      title: 'Злоуп. символами | 3.06',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]3.06. [/COLOR]Запрещено злоупотребление знаков препинания и прочих символов [COLOR=RED]| Mute 30 минут[/COLOR][/COLOR]<br>[LIST][COLOR=RED]Пример:[/COLOR] «???????», «!!!!!!!», «Дааааааааааааааааааааааа» и так далее.[/LIST][/FONT][/COLOR][CENTER][/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,

},
    {
      title: 'Слив | 3.08',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]3.08. [/COLOR]Запрещены любые формы «слива» посредством использования глобальных чатов  [COLOR=RED]| PermBan[/FONT][/COLOR].[/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Выдача себя за адм | 3.10',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]3.10. [/COLOR]Запрещена выдача себя за администратора, если таковым не являетесь [COLOR=RED]| Ban 7 - 15 дней[/FONT][/COLOR].[/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Ввод в заблуждение | 3.11',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]3.11. [/COLOR]Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [COLOR=RED]| Ban 15 - 30 дней / PermBan[/COLOR]<br>[LIST][COLOR=RED]Примечание:[/COLOR] /me чтобы поднять кошелек введите /pay 228 5000. Для продажи автомобиля введите /sellmycar id 2828 (счёт в банке) цена.[/LIST][/FONT][/COLOR][CENTER][/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Оффтоп/капс/мат в репорт | 3.12',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:<br>[COLOR=RED]3.12. [/COLOR]Запрещено подавать репорт, написанный транслитом, с сообщением не по теме (Offtop), с включённым Caps Lock, с использованием нецензурной брани, и повторять обращение (если ответ уже был дан ранее)  [COLOR=RED]| Report Mute 30 минут[/FONT][/COLOR].[/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Музыка в Voice | 3.14',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]3.14. [/COLOR]Запрещено включать музыку в Voice Chat [COLOR=RED]| Mute 60 минут[/FONT][/COLOR].[/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Шум в Voice | 3.16',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]3.16. [/COLOR]Запрещено создавать посторонние шумы или звуки [COLOR=RED]| Mute 30 минут[/COLOR]<br>[LIST][COLOR=RED]Примечание:[/COLOR] Посторонние звуки на фоне речи, мешающие взаимодействию игроков посредством голосового чата. Сильное искажение звука, исходящее из микрофона плохого качества. Намеренно портить игру другим игрокам (кричать, перебивать)[/LIST][/FONT][/COLOR][CENTER][/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Политика | 3.18',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]3.18. [/COLOR]Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов [COLOR=RED]| Mute 120 минут / Ban 10 дней[/FONT][/COLOR].[/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Транслит | 3.20',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]3.20. [/COLOR]Запрещено использование транслита в любом из чатов [COLOR=RED]| Mute 30 минут[/COLOR]<br>[LIST][COLOR=RED]Пример:[/COLOR] «Privet», «Kak dela», «Narmalna».[/LIST][/FONT][/COLOR][CENTER][/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Реклама промо | 3.21',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]3.21. [/COLOR]Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [COLOR=RED]| Ban 30 дней[/COLOR]<br>[LIST][COLOR=RED]Примечание:[/COLOR] чаты семейные, строительных компаний, транспортных компаний, фракционные чаты, IC, OOC, VIP и так далее.[/LIST]<br>[LIST][COLOR=RED]Исключение:[/COLOR] промокоды, предоставленные разработчиками, а также распространяемые через официальные ресурсы проекта.[/LIST][COLOR=RED]Пример:[/COLOR] если игрок упомянет промокод, распространяемый через официальную публичную страницу ВКонтакте либо через официальный Discord в любом из чатов, наказание ему не выдается.[/LIST][/FONT][/COLOR][CENTER][/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER]" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Объявления на ТТ ГОСС | 3.22',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]3.22. [/COLOR]Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC)  [COLOR=RED]| Mute 30 минут[/COLOR]<br>[LIST][COLOR=RED]Пример:[/COLOR] в помещении центральной больницы писать в чат: «Продам эксклюзивную шапку дешево!!!»[/LIST][/FONT][/COLOR][CENTER][/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Мат в VIP чате | 3.23',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]3.23. [/COLOR]Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате [COLOR=RED]| Mute 30 минут[/FONT][/COLOR].[/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
    },
    { 
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ники ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
},
    {
      title: 'Оск. nick_name | 4.09',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]4.09. [/COLOR]Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) [COLOR=RED]| Устное замечание + смена игрового никнейма / PermBan[/FONT][/COLOR].[/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Fake nick_name | 4.10',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]4.10. [/COLOR]Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [COLOR=RED]| Устное замечание + смена игрового никнейма / PermBan<br>[LIST][COLOR=RED]Пример:[/COLOR] подменять букву i на L и так далее, по аналогии.[/FONT][/COLOR][CENTER][/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
      },
    {
title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴правила госс ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
},
    {
      title: 'Работа в форме ГОС | 1.07',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]1.07. [/COLOR]Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции  [COLOR=RED]| Jail 30 минут[/FONT][/COLOR].[/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Т/С фракции в лич. целях | 1.08',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]1.08. [/COLOR]Запрещено использование фракционного транспорта в личных целях  [COLOR=RED]| Jail 30 минут[/FONT][/COLOR].[/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Одиночный патруль | 1.11',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]1.11. [/COLOR]Всем силовым структурам запрещен одиночный патруль или конвоирование, минимум 2 сотрудника [COLOR=RED]| Jail 30 минут[/FONT][/COLOR].[/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Казино/БУ в форме ГОС | 1.13',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]1.13. [/COLOR]Запрещено находиться в форме внутри казино, участвовать в битве за контейнеры, участвовать в захвате семейного контейнера, находится на Б/У рынке с целью покупки / продажи авто, а также устраиваться на сторонние работы в форме фракции [COLOR=RED]| Jail 30 минут[/FONT][/COLOR].[/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Урон вне теры (МО) | 2.02',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]2.02. [/COLOR]Наносить урон игрокам, которые находятся вне территории воинской части, запрещено  [COLOR=RED]| DM / Jail 60 минут / Warn [/FONT][/COLOR].[/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Не по ПРО (СМИ) | 4.01',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]4.01. [/COLOR]Запрещено редактирование объявлений, не соответствующих ПРО [COLOR=RED]| Mute 30 минут[/FONT][/COLOR].[/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Не по ППЭ (СМИ) | 4.02',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]4.02. [/COLOR]Запрещено проведение эфиров, не соответствующих Role Play правилам и логике [COLOR=RED]| Mute 30 минут[/FONT][/COLOR].[/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Замена текста СМИ | 4.04',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]4.04. [/COLOR]Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [COLOR=RED]| Ban 7 дней + ЧС организации[/FONT][/COLOR].[/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Урон без RP причины (УМВД/ГИБДД/ФСБ/ФСИН)',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[/COLOR]Запрещено наносить урон игрокам без Role Play причины на территории УМВД/ГИБДД/ФСБ/ФСИН [COLOR=RED]| DM / Jail 60 минут / Warn[/FONT][/COLOR].[/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Розыск / штраф без причины | 7.02',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:<br>[COLOR=RED]7.02. [/COLOR]Запрещено выдавать розыск, штраф без Role Play причины [COLOR=RED]| Warn[/FONT][/COLOR].[/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'nRP коп | 6.03',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]6.03. [/COLOR]Запрещено nRP поведение [COLOR=RED]| Warn[/COLOR]<br>[LIST][COLOR=RED]Примечание:[/COLOR] поведение, не соответствующее сотруднику УМВД/ГИБДД/ФСБ.[/LIST][LIST][COLOR=RED]Пример:[/COLOR]] открытие огня по игрокам без причины, расстрел машин без причины, нарушение ПДД без причины, сотрудник на служебном транспорте кричит о наборе в свою семью на спавне.[/LIST][/FONT][/COLOR][CENTER][/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
    },
    {
title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴правила опг ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
},
    {
      title: 'Провокация ГОС | 2',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]2. [/COLOR]Запрещено провоцировать сотрудников государственных организаций [COLOR=RED]| Jail 30 минут[/FONT][/COLOR].[/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Провокация ОПГ на их тере | 3',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]3. [/COLOR]Запрещено провоцировать сотрудников криминальных организаций возле или на территории вражеской группировки [COLOR=RED]| Jail 30 минут[/FONT][/COLOR].[/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Урон без причины на тере | 4',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]4. [/COLOR]Запрещено без причины наносить урон игрокам на территории ОПГ [COLOR=RED]| Jail 60 минут[/FONT][/COLOR].[/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Дуэли | 5',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]5. [/COLOR]Запрещено устраивать дуэли где-либо, а также на территории ОПГ [COLOR=RED]| Jail 30 минут[/FONT][/COLOR].[/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Перестрелки в людных местах | 6',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]6. [/COLOR]Запрещено устраивать перестрелки с другими ОПГ в людных местах [COLOR=RED]| Jail 60 минут[/FONT][/COLOR].[/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'реклама в /f | 7',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]7. [/COLOR]Запрещена любая реклама (семей, транспортных и строительных компаний и т.д.), предложения о купле, продаже, обмене чего-либо в чате организации [COLOR=RED]| Mute 30 минут[/FONT][/COLOR].[/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'cкрыться от копа на базе | 8',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]8. [/COLOR]Запрещено уходить от погони со стороны правоохранительных органов путем заезда на территорию своей банды для того чтобы скрыться или получить численное преимущество [COLOR=RED]| Jail 30 минут[/FONT][/COLOR].[/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'NRP В/Ч',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>За нарушение правил нападения на Войсковую Часть выдаётся предупреждение [COLOR=RED]| Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/FONT][/COLOR].[/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Находится на тере бв лишний | 1.06',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок будет наказан по пункту правил:[/CENTER]<br>[COLOR=RED]1.06. [/COLOR]На территории проведения бизвара может находиться только сторона атаки и сторона защиты [COLOR=RED]| Jail 30 минут[/FONT][/COLOR].[/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'NRP ограбление/похищение - Jail',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок получит наказание в виде деморгана за нарушение правил ограблений/похищений.[/FONT][/COLOR].[/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'NRP ограбление/похищение - Warn',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок получит наказание в виде предупреждения за нарушение правил ограблений/похищений.[/FONT][/COLOR].[/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
      title: 'NonRP ограбление/похищение - Ban',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок получит наказание в виде блокировки аккаунта за нарушение правил ограблений/похищений.[/FONT][/COLOR].[/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Одобрено, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false, 
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴другой раздел ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'В ЖБ на сотрудников',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на сотрудников данной организации.[/FONT][/COLOR][/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#ff0000]Закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: CLOSE_PREFIX,
   status: false,
    },
    {
      title: 'В ЖБ на АП',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на Агентов поддержки.[/FONT][/COLOR][/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#ff0000]Закрыто.[/color][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
   status: false,
      },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отказ ЖБ ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
},
    {
      title: 'Нарушений не найдено',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Нарушений со стороны данного игрока не было найдено. [/FONT][/COLOR][/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#ff0000]Отказано, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: UNACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Недостаточно доказательств',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Недостаточно доказательств на нарушение от данного игрока.[/FONT][/COLOR][/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#ff0000]Отказано, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: UNACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Дубликат (копия темы)',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Дублирование темы.<br>Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован. [/FONT][/COLOR][/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][B][COLOR=RED][FONT=arial]Отказано, закрыто.[/FONT][/COLOR][/B][/CENTER]',
      prefix: UNACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Не по форме',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Ваша жалоба не соответствует установленной форме подачи и не может быть рассмотрена.<br>Рекомендуем ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/']правилами подачи жалоб на игроков[/URL] и при необходимости подать жалобу повторно, соблюдая требования.[/FONT][/COLOR][/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#ff0000]Отказано, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: UNACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Отсутствует /time',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]На ваших доказательствах отсутствует /time.[/FONT][/COLOR][/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#ff0000]Отказано, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: UNACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Не указаны тайм-коды',
      content:
  '[CENTER][FONT=arial][COLOR=#0099FF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT] <br><br>' +
        "[COLOR=WHITE][FONT=arial]Если видеодоказательство длится более 3 минут, Вы должны указать тайм-коды нарушений. В Вашем случае они не указаны. Подайте новую жалобу с указанными тайм-кодами.[/FONT][/COLOR][COLOR=WHITE][/COLOR][/CENTER] <br><br>" +
        '[CENTER][FONT=arial][SIZE=4][color=#ff0000]Отказано, закрыто.[/color][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Более 72 часов',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения со стороны игрока сервера.[/FONT][/COLOR][/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#ff0000]Отказано, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: UNACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Социальные сети',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/FONT][/COLOR][/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#ff0000]Отказано, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: UNACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Нету условий сделки',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]В ваших доказательствах отсутствуют условия сделки. [/FONT][/COLOR][/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#ff0000]Отказано, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: UNACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Нужен фрапс',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]В данной ситуации обязательно должен быть фрапс (видео фиксация) всех моментов.[/FONT][/COLOR][/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#ff0000]Отказано, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: UNACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Нужен фрапс + промотка чата',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]В данной ситуации обязательно должен быть фрапс (видео фиксация) всех моментов, а также промотка чата.[/FONT][/COLOR][/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#ff0000]Отказано, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: UNACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Фрапс обрываеться',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Ваш фрапс обрывается, загрузите полный фрапс на YouTube.[/FONT][/COLOR][/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#ff0000]Отказано, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: UNACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Доказательства не работают',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Ваши доказательства не работают. Жалоба не подлежит рассмотрению.[/FONT][/COLOR][/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#ff0000]Отказано, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: UNACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Нету доказательств',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]В вашей жалобе отсутствуют доказательства. Если у вас есть доказательства, то подайте новую жалобу с доказательствами.[/FONT][/COLOR][/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#ff0000]Отказано, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: UNACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Доки отредактированы',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Ваши доказательства отредактированны. Жалоба не подлежит рассмотрению.[/FONT][/COLOR][/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#ff0000]Отказано, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: UNACCEPT_PREFIX,
   status: false,
},
    {
      title: 'От 3-его лица',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации).[/FONT][/COLOR][/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#ff0000]Отказано, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: UNACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Не написал ник',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игровой ник автора жалобы, ник игрока, на которого подается жалоба, должны быть указаны в соответствии с правилами подачи жалоб, даже если эта информация присутствует на доказательствах или в тексте жалобы.[/FONT][/COLOR][/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#ff0000]Отказано, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: UNACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Не подтвердил условия',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Игрок не подтвердил условия вашей сделки.[/FONT][/COLOR][/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#ff0000]Отказано, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: UNACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Закрыт доступ к Гугл диску',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]К гугл диску закрыт доступ, пожалуйста откройте доступ, либо загрузите доказательства на фото/видео хостинг (YouTube, Япикс, imgur).[/FONT][/COLOR][/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#ff0000]Отказано, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: UNACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Закрыт доступ к Яндекс диску',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]К яндекс диску закрыт доступ, пожалуйста откройте доступ, либо загрузите доказательства на фото/видео хостинг (YouTube, Япикс, imgur).[/FONT][/COLOR][/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#ff0000]Отказано, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: UNACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Не доказал что владелец фамы',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Нет доказательств того, что Вы являетесь владельцем семьи. Жалобы по данному пункту правил принимаются только от лидера семьи.[/FONT][/COLOR][/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#ff0000]Отказано, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: UNACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Ответный DM',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]На вашем фрапсе видно как вы первые начали стрельбу, он лишь начал обороняться (тоесть ответный ДМ). <br> Вы будете наказаны по пункту правил:<br>[COLOR=#FF0000]2.19.[/COLOR] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=#FF0000] | Jail 60 минут[/color].[/FONT][/COLOR][/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#00ff00]Рассмотрено, закрыто.[/color][/SIZE][/FONT][/CENTER]',
      prefix: RASSMOTENO_PREFIX,
   status: false,
},
    {
      title: 'Уже на рассмотрении',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Жалоба такого же содержания уже находится на рассмотрении.<br> Ожидайте ответа в прошлой жалобе и не нужно дублировать ее.[/FONT][/COLOR][/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#ff0000]Отказано, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: UNACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Долг ток через банк',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Займ может быть осуществлен только через зачисление игровых ценностей на банковский счет.[/FONT][/COLOR][/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][B][COLOR=RED][FONT=arial]Отказано, закрыто.[/FONT][/COLOR][/B][/CENTER]',
      prefix: UNACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Замены текста СМИ нет',
      content:
  '[CENTER][FONT=arial][URL=https://postimages.org/][IMG]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/IMG][/URL]<br>[B][COLOR=WHITE]{{ greeting }}[/COLOR],[COLOR=RED] уважаемый {{ user.name }}[/COLOR][/FONT][/B] <br>' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][B]<br>[COLOR=WHITE][FONT=arial]Нарушений со стороны игрока нет, все объявления редактировались по просьбе игроков[/FONT][/COLOR].[/B][COLOR=WHITE]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/IMG][/URL][/COLOR][/CENTER] <br>" +
        '[B][CENTER][FONT=arial][SIZE=4][color=#ff0000]Отказано, закрыто.[/color][/SIZE][/FONT][/B][/CENTER]',
      prefix: UNACCEPT_PREFIX,
   status: false,
    },


];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
    addButton('ЖБ на игроков', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => pasteContent(2, threadData, true));
	$('button#Ga').click(() => pasteContent(8, threadData, true));
	$('button#specy').click(() => pasteContent(11, threadData, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
        $('button#Resheno').click(() => editThreadData(RESHENO_PREFIX, false));
	$('button#Texy').click(() => pasteContent(7, threadData, true));
	$('button#Rasmotreno').click(() => editThreadData(RASSMOTENO_PREFIX, false));
	$('button#Close').click(() => editThreadData(CLOSE_PREFIX, false));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));


$(`button#selectAnswer`).click(() => {
XF.alert(buttonsMarkup(buttons), null, 'ВЫБЕРИТЕ ОТВЕТ');
buttons.forEach((btn, id) => {
if (id > 1) {
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
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 0px 0px; border-color: teal; border-style: dashed solid; margin-right: 7px; margin-bottom: 10px; background: teal; text-decoration-style: wavy;">${name}</button>`,
);
}

function buttonsMarkup(buttons) {
return `<div class="select_answer">${buttons
  .map(
	(btn, i) =>
	  `<button id="answers-${i}" class="button--primary button ` +
	  `rippleButton" style="margin: 5px; margin-right: 10px; margin-bottom: 10px"><span class="button-text">${btn.title}</span></button>`,
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
            discussion_open: 0,
			sticky: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}
	if(pin == 123){
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
            discussion_open: 1,
			sticky: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
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
 
 




(function() {
    'use strict';
const UNACCEPT_PREFIX = 4;
const ACCEPT_PREFIX = 8;
const RASSMOTENO_PREFIX = 9;
const PIN_PREFIX = 2;
const GA_PREFIX = 12;
const COMMAND_PREFIX = 10;
const RESHENO_PREFIX = 6;
const WAIT_PREFIX = 14;
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SPECY_PREFIX = 11;
const TEX_PREFIX = 13;
const buttons = [
    {
title: 'Свой ответ',
      content:
        '[CENTER][FONT=arial][B][COLOR=#0099FF][SIZE=4]{{ greeting }}, уважаемый {{ user.mention}}.[/COLOR][/SIZE][/FONT][/B][/CENTER] <br><br>' +
        "[COLOR=WHITE][FONT=arial] ТЕКСТ [/FONT][/COLOR][COLOR=WHITE][/COLOR]<br><br>" +
        '[B][FONT=arial][SIZE=4][color=#FF0000]Закрыто.[/color][/SIZE][/FONT][/B]',
},
    {
title: 'Заявки рассмотрены – Закрыты',

      content:

        '[CENTER][FONT=arial][B][COLOR=#0099FF][SIZE=4]{{ greeting }}, уважаемые игроки![/COLOR][/SIZE][/FONT][/B][/CENTER] <br><br>' +
        "[hr][/hr]<br>[COLOR=WHITE]Ваши заявки на должность лидера были рассмотрены<br><br>[COLOR=GREEN][FONT=arial][B]Список допущенных к обзвону:[/B][/COLOR]<br>Nickname<br>Nickname<br>Nickname<br><br>[COLOR=RED][B]Список отказанных заявок:[/B][/COLOR]<br>Nickname – Причина<br><br>Время и дату обзвона сообщим в группе кандидатов на пост Лидера.<br>Обзвон будет проходить в официальном дискорд канале сервера [URL=https://discord.gg/YU2QQ6YhRr]BLACK RUSSIA | CHEREPOVETS[/URL].<br>Перед началом обзвона обязательно поставить префикс: [К/LD/”тег организации“]<br>[LIST][COLOR=RED]Примечание:[/COLOR] Администрация проекта не в коем случае не запрашивает пароли от аккаунтов, а также все обзвоны на должность проходят в официальных дискордах где можно удостовериться в личности администратора и включить демонстрацию экрана.[/LIST]<br>[LIST][COLOR=RED]Примечание:[/COLOR] В случае несогласия с вердиктом по Вашей заявке рекомендуем обратиться в личные сообщения к Главному следящему или его заместителю — в зависимости от того, кем было принято решение. Если после обсуждения отказа Вы всё же останетесь при своём мнении, следует направить обращение в соответствующий раздел [URL=https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.3965/]жалоб на администрацию[/URL].[/LIST][/FONT]<br>[HR][/HR]<br>[COLOR=#0066FF][B]Контактные данные руководства направления:[/B][/COLOR]<br><br>[COLOR=RED][B]Главный Следящий[/B][/COLOR] – [URL=ссылка на ВК]Nick_Name[/URL]<br>[COLOR=CRIMSON][B]Заместитель Главного Следящего[/B][/COLOR] – [URL=ссылка на ВК]Nick_Name[/URL]<br><br>❗ Никнеймы руководства направления кликабельны, при нажатии на никнейм Вас направит на их страницу в ВКонтакте.<br><br>Заявки [COLOR=#00FF00][U]рассмотрены[/U][/COLOR].[/COLOR]<br><br>" +
        '[B][FONT=arial][SIZE=4][color=#FF0000]Закрыто.[/color][/SIZE][/FONT][/B]',

},

    {
title: 'Заявки взяты на рассмотрение',
      content:
        '[CENTER][FONT=arial][B][COLOR=#0099FF][SIZE=4]{{ greeting }}, уважаемые игроки![/COLOR][/SIZE][/FONT][/B][/CENTER] <br><br>' +
        "[COLOR=WHITE][FONT=arial]Ваши заявления взяты на рассмотрение.<br>Процесс рассмотрения может занять несколько часов. В отдельных случаях он может продлиться до суток и более — всё зависит от текущих обстоятельств.<br><br>Просим Вас запастись терпением. Как только заявки будут рассмотрены, мы незамедлительно огласим итоги в данной теме.<br><br>Благодарим Вас за понимание.[/FONT][/COLOR][COLOR=WHITE][/COLOR]<br><br>" +
        '[B][FONT=arial][SIZE=4][color=rgb(251, 160, 38)]На рассмотрении.[/color][/SIZE][/FONT][/B]',
      prefix: PIN_PREFIX,
   status: true,
},
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ Жалобы на лидеров ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
},
    {
      title: 'На рассмотрение',
      content:
        '[CENTER][FONT=arial][B][COLOR=#0099FF][SIZE=4]{{ greeting }}, уважаемый {{ user.mention}}.[/COLOR][/SIZE][/FONT][/B][/CENTER] <br><br>' +
        "[COLOR=WHITE][FONT=arial]Ваша жалоба принята [COLOR=#FFFF00][U]на рассмотрение[/U].[/COLOR]<br>Ожидайте ответа в данной теме. Пожалуйста, не создавайте копии этой темы, иначе это может привести к блокировке Вашего форумного аккаунта.[/FONT][/COLOR][COLOR=WHITE][/COLOR]<br><br>" +
        '[B][FONT=arial][SIZE=4][color=rgb(251, 160, 38)]На рассмотрении.[/color][/SIZE][/FONT][/B]',
      prefix: PIN_PREFIX,
   status: true,
        },
    {
      title: 'Запрошу доказательства',
      content:
        '[CENTER][FONT=arial][B][COLOR=#0099FF][SIZE=4]{{ greeting }}, уважаемый {{ user.mention}}.[/COLOR][/SIZE][/FONT][/B][/CENTER] <br><br>' +
        "[COLOR=WHITE][FONT=arial]Запросил доказательства у лидера.<br>Ожидайте ответа в данной теме. Пожалуйста, не создавайте копии этой темы, иначе это может привести к блокировке Вашего форумного аккаунта.[/FONT][/COLOR][COLOR=WHITE][/COLOR]<br><br>" +
        '[B][FONT=arial][SIZE=4][color=rgb(251, 160, 38)]На рассмотрении.[/color][/SIZE][/FONT][/B]',
      prefix: PIN_PREFIX,
   status: true,
},
    {
     title: 'Наказание выдано верно',
      content:
        '[CENTER][FONT=arial][B][COLOR=#0099FF][SIZE=4]{{ greeting }}, уважаемый {{ user.mention}}.[/COLOR][/SIZE][/FONT][/B][/CENTER] <br><br>' +
        "[COLOR=WHITE][FONT=arial]Лидер предоставил доказательства, наказание было выдано верно.<br>Нарушений со стороны лидера - не выявлено.[/FONT][/COLOR][COLOR=WHITE][/COLOR]<br><br>" +
        '[B][FONT=arial][SIZE=4][color=#FF0000]В жалобе отказано. Закрыто.[/color][/SIZE][/FONT][/B]',
      prefix: UNACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Увольнение произведено верно',
      content:
        '[CENTER][FONT=arial][B][COLOR=#0099FF][SIZE=4]{{ greeting }}, уважаемый {{ user.mention}}.[/COLOR][/SIZE][/FONT][/B][/CENTER] <br><br>' +
        "[COLOR=WHITE][FONT=arial]Лидер предоставил доказательства, увольнение было произведено верно.<br>Нарушений со стороны лидера - не выявлено.[/FONT][/COLOR][COLOR=WHITE][/COLOR]<br><br>" +
        '[B][FONT=arial][SIZE=4][color=#FF0000]В жалобе отказано. Закрыто.[/color][/SIZE][/FONT][/B]',
      prefix: UNACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Увольнение не верно - востоновят',
      content:
        '[CENTER][FONT=arial][B][COLOR=#0099FF][SIZE=4]{{ greeting }}, уважаемый {{ user.mention}}.[/COLOR][/SIZE][/FONT][/B][/CENTER] <br><br>' +
        "[COLOR=WHITE][FONT=arial]Вы будете восстановлены во фракцию, так как увольнение было произведено неверно. Приносим извинения за возникшие неудобства, с лидером будет проведена работа по поводу ошибки в увольнении.<br><br>Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR][/FONT][/COLOR][COLOR=WHITE][/COLOR]<br><br>" +
        '[B][FONT=arial][SIZE=4]Спасибо за обращение. Закрыто.[/color][/SIZE][/FONT][/B]',
      prefix: RESHENO_PREFIX,
   status: false,
},
    {
     title: 'Проведу беседу с лидером',
      content:
        '[CENTER][FONT=arial][B][COLOR=#0099FF][SIZE=4]{{ greeting }}, уважаемый {{ user.mention}}.[/COLOR][/SIZE][/FONT][/B][/CENTER] <br><br>' +
        "[COLOR=WHITE][FONT=arial]Ваша жалоба была одобрена. С лидером будет проведена беседа. <br><br>Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR][/FONT][/COLOR][COLOR=WHITE][/COLOR]<br><br>" +
        '[B][FONT=arial][SIZE=4]Спасибо за обращение. Закрыто.[/color][/SIZE][/FONT][/B]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {
   title: 'Меры были приняты | наказание',
      content:
        '[CENTER][FONT=arial][B][COLOR=#0099FF][SIZE=4]{{ greeting }}, уважаемый {{ user.mention}}.[/COLOR][/SIZE][/FONT][/B][/CENTER] <br><br>' +
        "[COLOR=WHITE][FONT=arial]Лидер понесет наказание, все необходимые меры были приняты.<br><br>Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR][/FONT][/COLOR][COLOR=WHITE][/COLOR]<br><br>" +
        '[B][FONT=arial][SIZE=4]Спасибо за обращение. Закрыто.[/SIZE][/FONT][/B]',
      prefix: CLOSE_PREFIX,
   status: false,
},
    {
     title: 'Необходимая работа будет проведена',
      content:
        '[CENTER][FONT=arial][B][COLOR=#0099FF][SIZE=4]{{ greeting }}, уважаемый {{ user.mention}}.[/COLOR][/SIZE][/FONT][/B][/CENTER] <br><br>' +
        "[COLOR=WHITE][FONT=arial]Необходимая работа будет проведена.<br><br>Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR][/FONT][/COLOR][COLOR=WHITE][/COLOR]<br><br>" +
        '[B][FONT=arial][SIZE=4]Спасибо за обращение. Закрыто.[/SIZE][/FONT][/B]',
      prefix: CLOSE_PREFIX,
   status: false,
},
    {
      title: 'Лидер будет проинструктирован',
      content:
        '[CENTER][FONT=arial][B][COLOR=#0099FF][SIZE=4]{{ greeting }}, уважаемый {{ user.mention}}.[/COLOR][/SIZE][/FONT][/B][/CENTER] <br><br>' +
        "[COLOR=WHITE][FONT=arial]Лидер будет проинструктирован по ситуации в ближайшее время.<br><br>Приятной игры на сервере [color=#0099ff]CHEREPOVETS.[/COLOR][/FONT][/COLOR][COLOR=WHITE][/COLOR]<br><br>" +
        '[B][FONT=arial][SIZE=4]Спасибо за обращение. Закрыто.[/SIZE][/FONT][/B]',
      prefix: CLOSE_PREFIX,
   status: false,
},
    {
     title: 'Лидер будет снят',
      content:
        '[CENTER][FONT=arial][B][COLOR=#0099FF][SIZE=4]{{ greeting }}, уважаемый {{ user.mention}}.[/COLOR][/SIZE][/FONT][/B][/CENTER] <br><br>' +
        "[COLOR=WHITE][FONT=arial]Лидер будет снят с должности в ближайшее время.<br><br>Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR][/FONT][/COLOR][COLOR=WHITE][/COLOR]<br><br>" +
        '[B][FONT=arial][SIZE=4]Спасибо за обращение. Закрыто.[/SIZE][/FONT][/B]',
      prefix: CLOSE_PREFIX,
   status: false,
},
    {
      title: 'Больше не является лидером',
      content:
        '[CENTER][FONT=arial][B][COLOR=#0099FF][SIZE=4]{{ greeting }}, уважаемый {{ user.mention}}.[/COLOR][/SIZE][/FONT][/B][/CENTER] <br><br>' +
        "[COLOR=WHITE][FONT=arial]Данный игрок больше не является лидером. В связи с этим, жалоба - отклонена.[/FONT][/COLOR][COLOR=WHITE][/COLOR]<br><br>" +
        '[B][FONT=arial][SIZE=4][color=#FF0000]В жалобе отказано. Закрыто.[/color][/SIZE][/FONT][/B]',
      prefix: CLOSE_PREFIX,
   status: false,
},
    {
     title: 'Не является лидером',
      content:
        '[CENTER][FONT=arial][B][COLOR=#0099ff][SIZE=4]{{ greeting }}, уважаемый {{ user.mention}}.[/COLOR][/SIZE][/FONT][/B][/CENTER] <br><br>' +
        "[COLOR=WHITE][FONT=arial]Данный игрок не является лидером. В связи с этим, жалоба - отклонена.[/FONT][/COLOR][COLOR=WHITE][/COLOR]<br><br>" +
        '[B][FONT=arial][SIZE=4][color=#FF0000]В жалобе отказано. Закрыто.[/color][/SIZE][/FONT][/B]',
      prefix: CLOSE_PREFIX,
   status: false,
},
    {
     title: 'Нарушений не имеется',
      content:
        '[CENTER][FONT=arial][B][COLOR=rgb(251, 160, 38)][SIZE=5][U]{{ greeting }}, уважаемый игрок![/U][/COLOR][/SIZE][/FONT][/B][/CENTER] <br><br>' +
        "[COLOR=WHITE][FONT=arial]Исходя из выше приложенных доказательств, нарушений со стороны лидера — не имеется.[/FONT][/COLOR][COLOR=WHITE][/COLOR]<br><br>" +
        '[B][FONT=arial][SIZE=4][color=#FF0000]В жалобе отказано. Закрыто.[/color][/SIZE][/FONT][/B]',
      prefix: CLOSE_PREFIX,
   status: false,
},
    {
title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ Жалобы на заместителей ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
},
    {
       title: 'Запрошу доказательства',
      content:
        '[CENTER][FONT=arial][B][COLOR=#0099ff][SIZE=4]{{ greeting }}, уважаемый {{ user.mention}}.[/COLOR][/SIZE][/FONT][/B][/CENTER] <br><br>' +
        "[COLOR=WHITE][FONT=arial]Запросил доказательства у заместителя лидера.<br>Ожидайте ответа в данной теме. Пожалуйста, не создавайте копии этой темы, иначе это может привести к блокировке Вашего форумного аккаунта.[/FONT][/COLOR][COLOR=WHITE][/COLOR]<br><br>" +
        '[B][FONT=arial][SIZE=4][color=rgb(251, 160, 38)]На рассмотрении.[/color][/SIZE][/FONT][/B]',
      prefix: PIN_PREFIX,
   status: true,
},
    {
      title: 'Наказание выдано верно',
      content:
        '[CENTER][FONT=arial][B][COLOR=#0099ff][SIZE=4]{{ greeting }}, уважаемый {{ user.mention}}.[/COLOR][/SIZE][/FONT][/B][/CENTER] <br><br>' +
        "[COLOR=WHITE][FONT=arial]Заместитель лидера предоставил доказательства, наказание было выдано верно.<br>Нарушений со стороны заместителя лидера - не выявлено.[/FONT][/COLOR][COLOR=WHITE][/COLOR]<br><br>" +
        '[B][FONT=arial][SIZE=4][color=#FF0000]В жалобе отказано. Закрыто.[/color][/SIZE][/FONT][/B]',
      prefix: UNACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Увольнение произведено верно',
      content:
        '[CENTER][FONT=arial][B][COLOR=#0099ff][SIZE=4]{{ greeting }}, уважаемый {{ user.mention}}.[/COLOR][/SIZE][/FONT][/B][/CENTER] <br><br>' +
        "[COLOR=WHITE][FONT=arial]Заместитель лидера предоставил доказательства, увольнение было произведено верно.<br>Нарушений со стороны заместителя лидера - не выявлено.[/FONT][/COLOR][COLOR=WHITE][/COLOR]<br><br>" +
        '[B][FONT=arial][SIZE=4][color=#FF0000]В жалобе отказано. Закрыто.[/color][/SIZE][/FONT][/B]',
      prefix: UNACCEPT_PREFIX,
   status: false,
},
    {
      title: 'Беседа с заместителем лидера',
      content:
        '[CENTER][FONT=arial][B][COLOR=#0099ff][SIZE=4]{{ greeting }}, уважаемый {{ user.mention}}.[/COLOR][/SIZE][/FONT][/B][/CENTER] <br><br>' +
        "[COLOR=WHITE][FONT=arial]Ваша жалоба была одобрена. С заместителем лидера будет проведена беседа.<br><br>Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR][/FONT][/COLOR][COLOR=WHITE][/COLOR]<br><br>" +
        '[B][FONT=arial][SIZE=4]Спасибо за обращение. Закрыто.[/SIZE][/FONT][/B]',
      prefix: ACCEPT_PREFIX,
   status: false,
},
    {     
      title: 'Заместитель лидера будет снят',
      content:
        '[CENTER][FONT=arial][B][COLOR=#0099FF][SIZE=4]{{ greeting }}, уважаемый {{ user.mention}}.[/COLOR][/SIZE][/FONT][/B][/CENTER] <br><br>' +
        "[COLOR=WHITE][FONT=arial]Заместитель лидера будет снят с должности в ближайшее время.<br><br>Приятной игры на сервере [color=#0099ff]CHEREPOVETS.[/COLOR][/FONT][/COLOR][COLOR=WHITE][/COLOR]<br><br>" +
        '[B][FONT=arial][SIZE=4]Спасибо за обращение. Закрыто.[/SIZE][/FONT][/B]',
      prefix: CLOSE_PREFIX,
   status: false,
},
    {
     title: 'Меры были приняты | наказание',
      content:
        '[CENTER][FONT=arial][B][COLOR=#0099FF][SIZE=4]{{ greeting }}, уважаемый {{ user.mention}}.[/COLOR][/SIZE][/FONT][/B][/CENTER] <br><br>' +
        "[COLOR=WHITE][FONT=arial]Заместитель лидера понесет наказание, все необходимые меры были приняты.<br><br>Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR][/FONT][/COLOR][COLOR=WHITE][/COLOR]<br><br>" +
        '[B][FONT=arial][SIZE=4]Спасибо за обращение. Закрыто.[/SIZE][/FONT][/B]',
      prefix: CLOSE_PREFIX,
   status: false,
},
    {
     title: 'Работа будет проведена',
      content:
        '[CENTER][FONT=arial][B][COLOR=#0099FF][SIZE=4]{{ greeting }}, уважаемый {{ user.mention}}.[/COLOR][/SIZE][/FONT][/B][/CENTER] <br><br>' +
        "[COLOR=WHITE][FONT=arial]Необходимая работа будет проведена.<br><br>Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR][/FONT][/COLOR][COLOR=WHITE][/COLOR]<br><br>" +
        '[B][FONT=arial][SIZE=4]Спасибо за обращение. Закрыто.[/SIZE][/FONT][/B]',
      prefix: CLOSE_PREFIX,
   status: false,
},
    {
      
      title: 'Зам. лидера будет проинструктирован',
      content:
        '[CENTER][FONT=arial][B][COLOR=#0099FF][SIZE=4]{{ greeting }}, уважаемый {{ user.mention}}.[/COLOR][/SIZE][/FONT][/B][/CENTER] <br><br>' +
        "[COLOR=WHITE][FONT=arial]Заместитель лидера будет проинструктирован по ситуации в ближайшее время. <br>Приятной игры на сервере [color=#0099ff]CHEREPOVETS.[/COLOR][/FONT][/COLOR][COLOR=WHITE][/COLOR]<br><br>" +
        '[B][FONT=arial][SIZE=4]Спасибо за обращение. Закрыто.[/SIZE][/FONT][/B]',
   prefix: CLOSE_PREFIX,
   status: false,
},
    {
     title: 'Нарушений не имеется',
      content:
        '[CENTER][FONT=arial][B][COLOR=#0099ff][SIZE=4]{{ greeting }}, уважаемый {{ user.mention}}.[/COLOR][/SIZE][/FONT][/B][/CENTER] <br><br>' +
        "[COLOR=WHITE][FONT=arial]Исходя из выше приложенных доказательств, нарушений со стороны заместителя — не имеется. [/FONT][/COLOR][COLOR=WHITE][/COLOR]<br><br>" +
        '[B][FONT=arial][SIZE=4][color=#FF0000]В жалобе отказано. Закрыто.[/color][/SIZE][/FONT][/B]',
      prefix: CLOSE_PREFIX,
   status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ Дополнительно ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
},
    {
      title: 'Более 48-ми часов',
      content:
        '[CENTER][FONT=arial][B][COLOR=#0099ff][SIZE=4]{{ greeting }}, уважаемый {{ user.mention}}.[/COLOR][/SIZE][/FONT][/B][/CENTER] <br><br>' +
        "[COLOR=WHITE][FONT=arial]Срок написания жалобы составляет два дня (48 часов) с момента совершенного нарушения со стороны лидера сервера.[/FONT][/COLOR][COLOR=WHITE][/COLOR]<br><br>" +
        '[B][FONT=arial][SIZE=4][color=#FF0000]В жалобе отказано. Закрыто.[/color][/SIZE][/FONT][/B]',
      prefix: CLOSE_PREFIX,
   status: false,
},
    {
      title: 'Отсутствие доказательств',
      content:
        '[CENTER][FONT=arial][B][COLOR=#0099ff][SIZE=4]{{ greeting }}, уважаемый {{ user.mention}}.[/COLOR][/SIZE][/FONT][/B][/CENTER] <br><br>' +
        "[COLOR=WHITE][FONT=arial]Ваша жалоба не содержит доказательств. Если у Вас есть дополнительные материалы, пожалуйста, подайте новую жалобу с доказательствами.[/FONT][/COLOR][COLOR=WHITE][/COLOR]<br><br>" +
        '[B][FONT=arial][SIZE=4][color=#FF0000]В жалобе отказано. Закрыто.[/color][/SIZE][/FONT][/B]',
      prefix: CLOSE_PREFIX,
   status: false,
},
    {
     title: 'Не по форме',
      content:
        '[CENTER][FONT=arial][B][COLOR=#0099ff][SIZE=4]{{ greeting }}, уважаемый {{ user.mention}}.[/COLOR][/SIZE][/FONT][/B][/CENTER] <br><br>' +
        "[COLOR=WHITE][FONT=arial]Ваша жалоба не соответствует установленной форме подачи и не может быть рассмотрена.Рекомендуем ознакомиться с [URL=https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.3966/]правилами подачи жалоб на лидеров[/URL] и при необходимости подать жалобу повторно, соблюдая требования.<br><br>[B][CODE]1. Ваш Nick_Name:<br>2. Nick_Name лидера:<br>3. Суть жалобы (описать максимально подробно и раскрыто):<br>4. Доказательство:[/CODE][/B][/FONT][/COLOR][COLOR=WHITE][/COLOR]<br><br>" +
        '[B][FONT=arial][SIZE=4][color=#FF0000]В жалобе отказано. Закрыто.[/color][/SIZE][/FONT][/B]',
      prefix: CLOSE_PREFIX,
   status: false,
},
    {
      title: 'В жалобы на сотрудников',
      content:
        '[CENTER][FONT=arial][B][COLOR=#0099ff][SIZE=4]{{ greeting }}, уважаемый {{ user.mention}}.[/COLOR][/SIZE][/FONT][/B][/CENTER] <br><br>' +
        "[COLOR=WHITE][FONT=arial]Вы ошиблись разделом.<br>Вам в раздел жалоб на сотрудников Вашей организации.[/FONT][/COLOR][COLOR=WHITE][/COLOR]<br><br>" +
        '[B][FONT=arial][SIZE=4][color=#FF0000]Перенаправлено в другой раздел. Закрыто.[/color][/SIZE][/FONT][/B]',
      prefix: CLOSE_PREFIX,
   status: false,
},
    {
    title: 'Недостаточно доказательств',
      content:
        '[CENTER][FONT=arial][B][COLOR=#0099ff][SIZE=4]{{ greeting }}, уважаемый {{ user.mention}}.[/COLOR][/SIZE][/FONT][/B][/CENTER] <br><br>' +
        "[COLOR=WHITE][FONT=arial]В Вашей жалобе недостаточно доказательств для корректного рассмотрения Вашего обращения.[/FONT][/COLOR][COLOR=WHITE][/COLOR]<br><br>" +
        '[B][FONT=arial][SIZE=4][color=#FF0000]В жалобе отказано. Закрыто.[/color][/SIZE][/FONT][/B]',
      prefix: CLOSE_PREFIX,
   status: false,
},
    {
      title: 'Оффтоп',
      content:
        '[CENTER][FONT=arial][B][COLOR=#0099ff][SIZE=4]{{ greeting }}, уважаемый {{ user.mention}}.[/COLOR][/SIZE][/FONT][/B][/CENTER] <br><br>' +
        "[COLOR=WHITE][FONT=arial]Пожалуйста, убедительная просьба, ознакомится с назначением данного раздела в котором Вы создали тему, так как Ваш запрос никоим образом не относится к предназначению данного раздела. [/FONT][/COLOR][COLOR=WHITE][/COLOR]<br><br>" +
        '[B][FONT=arial][SIZE=4][color=#FF0000]Закрыто.[/color][/SIZE][/FONT][/B]',
      prefix: CLOSE_PREFIX,
   status: false,
},
    {
    title: 'Отсутствует /time',
      content:
        '[CENTER][FONT=arial][B][COLOR=#0099ff][SIZE=4]{{ greeting }}, уважаемый {{ user.mention}}.[/COLOR][/SIZE][/FONT][/B][/CENTER] <br><br>' +
        "[COLOR=WHITE][FONT=arial]В Ваших доказательствах отсутствует /time. Жалоба рассмотрению — не подлежит.[/FONT][/COLOR][COLOR=WHITE][/COLOR]<br><br>" +
        '[B][FONT=arial][SIZE=4][color=#FF0000]В жалобе отказано. Закрыто.[/color][/SIZE][/FONT][/B]',
      prefix: CLOSE_PREFIX,
   status: false,
},
    {    
      title: '3-е лицо',
      content:
        '[CENTER][FONT=arial][B][COLOR=#0099ff][SIZE=4]{{ greeting }}, уважаемый {{ user.mention}}.[/COLOR][/SIZE][/FONT][/B][/CENTER] <br><br>' +
        "[COLOR=WHITE][FONT=arial]Ваша жалоба составлена от 3-его лица. Подобные жалобы не принимаются.[/FONT][/COLOR][COLOR=WHITE][/COLOR]<br><br>" +
        '[B][FONT=arial][SIZE=4][color=#FF0000]В жалобе отказано. Закрыто.[/color][/SIZE][/FONT][/B]',
   prefix: CLOSE_PREFIX,
   status: false,
},
    {
     title: 'Нужен фрапс',
      content:
        '[CENTER][FONT=arial][B][COLOR=#0099FF][SIZE=4]{{ greeting }}, уважаемый {{ user.mention}}.[/COLOR][/SIZE][/FONT][/B][/CENTER] <br><br>' +
        "[COLOR=WHITE][FONT=arial]Недостаточно доказательств для корректного рассмотрения Вашей жалобы. В данном случае требуются видео-доказательства (фрапс).[/FONT][/COLOR][COLOR=WHITE][/COLOR]<br><br>" +
        '[B][FONT=arial][SIZE=4][color=#FF0000]В жалобе отказано. Закрыто.[/color][/SIZE][/FONT][/B]',
      prefix: CLOSE_PREFIX,
   status: false,
    


},


];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
    addButton('Для ГС/ЗГС', 'selectAnswer1');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => pasteContent(2, threadData, true));
	$('button#Ga').click(() => pasteContent(8, threadData, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
        $('button#Resheno').click(() => editThreadData(RESHENO_PREFIX, false));
	$('button#Texy').click(() => pasteContent(7, threadData, true));
	$('button#Rasmotreno').click(() => editThreadData(RASSMOTENO_PREFIX, false));
	$('button#Close').click(() => editThreadData(CLOSE_PREFIX, false));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));


$(`button#selectAnswer1`).click(() => {
XF.alert(buttonsMarkup(buttons), null, 'ВЫБЕРИТЕ ОТВЕТ');
buttons.forEach((btn, id) => {
if (id > 1) {
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
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 0px 0px; border-color: teal; border-style: dashed solid; margin-right: 7px; margin-bottom: 10px; background: teal; text-decoration-style: wavy;">${name}</button>`,
);
}

function buttonsMarkup(buttons) {
return `<div class="select_answer">${buttons
  .map(
	(btn, i) =>
	  `<button id="answers-${i}" class="button--primary button ` +
	  `rippleButton" style="border-radius: 10px; margin-right: 10px; margin-bottom: 10px"><span class="button-text">${btn.title}</span></button>`,
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
            discussion_open: 0,
			sticky: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}
	if(pin == 123){
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
            discussion_open: 1,
			sticky: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
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
 