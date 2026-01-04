// ==UserScript==
// @name         Tambov | Скрипт для Кураторов Форума
// @namespace    https://forum.blackrussia.online/
// @version      1.4
// @description  Скрипт для ответов на форуме | Black Russia Tambov
// @author       Alexandr_Gazarov 
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon https://img.icons8.com/nolan/452/beezy.png
// @downloadURL https://update.greasyfork.org/scripts/492224/Tambov%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/492224/Tambov%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0.meta.js
// ==/UserScript==
 
(function () {
	'use strict';
	const UNACCEPT_PREFIX = 4; // префикс отказано
	const ACCEPT_PREFIX = 8; // префикс одобрено
	const PIN_PREFIX = 2; //  префикс закрепить
	const COMMAND_PREFIX = 10; // команде проекта
	const CLOSE_PREFIX = 7; // префикс закрыто
	const DECIDED_PREFIX = 6; // префикс решено
	const WATCHED_PREFIX = 9; // рассмотрено
	const TEX_PREFIX = 13; //  техническому специалисту
	const NO_PREFIX = 0;
	const buttons = [
	    {
        title: ' ᅠᅠ.... Перенаправление ...      ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #7851A9; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',
	},
         {
            title: 'Главному администратору',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }} нашего сервера TAMBOV  [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба на игрока, мною была рассмотрена и направляется [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 140, 0)][I][FONT=times new roman][SIZE=4]На рассмотрение[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Передаю вашу жалобу  [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Главному администратору[/SIZE][/FONT][/COLOR] сервера.[/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Просьба не создавать идентичных тем, во избежание их последующего отказа.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=6]Данную тему я закрываю.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Приятной игры на нашем сервере[/COLOR][COLOR=rgb(209, 175, 133)] TAMBOV[/COLOR]' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]С уважением[/COLOR][COLOR=rgb(97, 189, 109)] Куратор форума [/COLOR]',
          }, 
            {
            title: 'Техническому Специалисту',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }} нашего сервера Tambov [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба на игрока, мною была рассмотрена и направляется [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 140, 0)][I][FONT=times new roman][SIZE=4]На рассмотрение[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Передаю вашу жалобу  [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 102, 0)][I][FONT=times new roman][SIZE=4]Техническому Специалисту[/SIZE][/FONT][/COLOR] сервера.[/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Просьба не создавать идентичных тем, во избежание их последующего отказа.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
             "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=6]Данную тему я закрываю.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Приятной игры на нашем сервере[/COLOR][COLOR=rgb(209, 175, 133)] Tambov[/COLOR]' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]С уважением[/COLOR][COLOR=rgb(97, 189, 109)] Куратор форума [/COLOR]',
          }, 
           {
            title: 'ГКФ/ЗГКФ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }} нашего сервера Tambov[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба на игрока, мною была рассмотрена и направляется [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 140, 0)][I][FONT=times new roman][SIZE=4]На рассмотрение[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Передаю вашу жалобу  [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 102, 0)][I][FONT=times new roman][SIZE=4]Главному куратору форума[/SIZE][/FONT][/COLOR] и не посредственно его Заместителю.[/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Просьба не создавать идентичных тем, во избежание их последующего отказа.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=6]Данную тему я закрываю.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Приятной игры на нашем сервере[/COLOR][COLOR=rgb(209, 175, 133)] Tambov[/COLOR]' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]С уважением[/COLOR][COLOR=rgb(97, 189, 109)] Куратор форума [/COLOR]',
          }, 
           {
        title: ' ᅠᅠ.... Пункт правил 2.0. Правила Role Play процесса....      ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #7851A9; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',
     	},
           {
            title: 'Nrp Поведение',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }} нашего сервера Tambov  [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба на игрока, мною была рассмотрена и получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(50, 205, 50)][I][FONT=times new roman][SIZE=4]Одобрено[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.01.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено поведение, нарушающее нормы процессов Role Play режима игры[/COLOR][COLOR=rgb(255, 0, 0)]| Jail 30 минут[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[LIST]<br><br>' +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4] Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] ездить на крышах транспортных средств, бегать или ходить по столам в казино, целенаправленная провокация сотрудников правоохранительных органов с целью развлечения, целенаправленная помеха в проведении различных собеседований и так далее.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br><br>" +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=5]Наказание будет выдано в течении суток, благодарим за обращение.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
             "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=6]Данную тему я закрываю.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Приятной игры на нашем сервере[/COLOR][COLOR=rgb(209, 175, 133)] TAMBOV[/COLOR]' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]С уважением[/COLOR][COLOR=rgb(97, 189, 109)] Куратор форума [/COLOR]',
          },
           {
            title: 'Уход от Rp процесса',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }} нашего сервера TAMBOV  [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба на игрока, мною была рассмотрена и получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(50, 205, 50)][I][FONT=times new roman][SIZE=4]Одобрено[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.02.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено целенаправленно уходить от Role Play процесса всеразличными способами.[/COLOR][COLOR=rgb(255, 0, 0)]| Jail 30 минут / Warn[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[LIST]<br><br>' +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4] Пример:[/COLOR][COLOR=rgb(209, 213, 216)] уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания / ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснуться Вашего персонажа и так далее.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br><br>" +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=5]Наказание будет выдано в течении суток, благодарим за обращение.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
             "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=6]Данную тему я закрываю.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Приятной игры на нашем сервере[/COLOR][COLOR=rgb(209, 175, 133)] TAMBOV [/COLOR]' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]С уважением[/COLOR][COLOR=rgb(97, 189, 109)] Куратор форума [/COLOR]',
          },
          {
            title: 'Nrp Drive',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }} нашего сервера TAMBOV  [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба на игрока, мною была рассмотрена и получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(50, 205, 50)][I][FONT=times new roman][SIZE=4]Одобрено[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.03.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта.[/COLOR][COLOR=rgb(255, 0, 0)]| Jail 30 минут[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
             '[LIST]<br><br>' +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4] Примечание:[/COLOR][COLOR=rgb(209, 213, 216)]езда на скутере по горам, езда на любом транспортном средстве по встречным полосам, нарушая все правила дорожного движения без какой-либо причины, намеренное создание аварийных ситуаций на дорогах и так далее.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br><br>" +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=5]Наказание будет выдано в течении суток, благодарим за обращение.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
             "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=6]Данную тему я закрываю.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Приятной игры на нашем сервере[/COLOR][COLOR=rgb(209, 175, 133)] TAMBOV[/COLOR]' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]С уважением[/COLOR][COLOR=rgb(97, 189, 109)] Куратор форума [/COLOR]',
          },
           {
            title: 'Помеха Rp процессу',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }} нашего сервера TAMBOV  [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба на игрока, мною была рассмотрена и получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(50, 205, 50)][I][FONT=times new roman][SIZE=4]Одобрено[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.04.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы.[/COLOR][COLOR=rgb(255, 0, 0)]| Ban 10 дней / Обнуление(при повторном нарушении)[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[LIST]<br><br>' +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4] Пример:[/COLOR][COLOR=rgb(209, 213, 216)] таран дальнобойщиков, инкассаторов под разными предлогами.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br><br>" +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=5]Наказание будет выдано в течении суток, благодарим за обращение.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
             "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=6]Данную тему я закрываю.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Приятной игры на нашем сервере[/COLOR][COLOR=rgb(209, 175, 133)] TAMBOV[/COLOR]' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]С уважением[/COLOR][COLOR=rgb(97, 189, 109)] Куратор форума [/COLOR]',
          },
           {
            title: 'Nrp обман',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }} нашего сервера TAMBOV  [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба на игрока, мною была рассмотрена и получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(50, 205, 50)][I][FONT=times new roman][SIZE=4]Одобрено[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.05.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики. [/COLOR][COLOR=rgb(255, 0, 0)]| PermBan[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
             '[LIST]<br><br>' +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4] Примечание:[/COLOR][COLOR=rgb(209, 213, 216)]после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4] Примечание:[/COLOR][COLOR=rgb(209, 213, 216)]разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br><br>" +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=5]Наказание будет выдано в течении суток, благодарим за обращение.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
             "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=6]Данную тему я закрываю.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Приятной игры на нашем сервере[/COLOR][COLOR=rgb(209, 175, 133)] TAMBOV[/COLOR]' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]С уважением[/COLOR][COLOR=rgb(97, 189, 109)] Куратор форума [/COLOR]',
          },
           {
            title: 'Аморал действия',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }} нашего сервера TAMBOV [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба на игрока, мною была рассмотрена и получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(50, 205, 50)][I][FONT=times new roman][SIZE=4]Одобрено[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.08.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещена любая форма аморальных действий сексуального характера в сторону игроков[/COLOR][COLOR=rgb(255, 0, 0)]| Jail 30 минут / Warn[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
             '[LIST]<br><br>' +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4] Исключение:[/COLOR][COLOR=rgb(209, 213, 216)]обоюдное согласие обеих сторон.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br><br>" +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=5]Наказание будет выдано в течении суток, благодарим за обращение.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
             "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=6]Данную тему я закрываю.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Приятной игры на нашем сервере[/COLOR][COLOR=rgb(209, 175, 133)] TAMBOV[/COLOR]' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]С уважением[/COLOR][COLOR=rgb(97, 189, 109)] Куратор форума [/COLOR]',
          },
          {
            title: 'Слив склада фамы/организации',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }} нашего сервера TAMBOV  [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба на игрока, мною была рассмотрена и получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(50, 205, 50)][I][FONT=times new roman][SIZE=4]Одобрено[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.09.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле[/COLOR][COLOR=rgb(255, 0, 0)]|  Ban 15 - 30 дней / PermBan[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=5]Наказание будет выдано в течении суток, благодарим за обращение.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=6]Данную тему я закрываю.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Приятной игры на нашем сервере[/COLOR][COLOR=rgb(209, 175, 133)] TAMBOV[/COLOR]' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]С уважением[/COLOR][COLOR=rgb(97, 189, 109)] Куратор форума [/COLOR]',
          },
           {
            title: 'DB (DriveBy)',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }} нашего сервера Tambov [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба на игрока, мною была рассмотрена и получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(50, 205, 50)][I][FONT=times new roman][SIZE=4]Одобрено[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.13.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта[/COLOR][COLOR=rgb(255, 0, 0)]| Jail 30 минут [/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
             '[LIST]<br><br>' +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4] Исключение:[/COLOR][COLOR=rgb(209, 213, 216)]разрешается на территории проведения мероприятия по захвату упавшего семейного контейнера.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br><br>" +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=5]Наказание будет выдано в течении суток, благодарим за обращение.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
             "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=6]Данную тему я закрываю.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Приятной игры на нашем сервере[/COLOR][COLOR=rgb(209, 175, 133)] Tambov[/COLOR]' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]С уважением[/COLOR][COLOR=rgb(97, 189, 109)] Куратор форума [/COLOR]',
          },
          {
            title: ' RK (Revenge Kill)',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }} нашего сервера Tambov [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба на игрока, мною была рассмотрена и получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(50, 205, 50)][I][FONT=times new roman][SIZE=4]Одобрено[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.14.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти [/COLOR][COLOR=rgb(255, 0, 0)]|  Jail 30 минут[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=5]Наказание будет выдано в течении суток, благодарим за обращение.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=6]Данную тему я закрываю.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Приятной игры на нашем сервере[/COLOR][COLOR=rgb(209, 175, 133)] Tambov[/COLOR]' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]С уважением[/COLOR][COLOR=rgb(97, 189, 109)] Куратор форума [/COLOR]',
          },
          {
            title: ' TK (Team Kill)',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }} нашего сервера Tambov [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба на игрока, мною была рассмотрена и получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(50, 205, 50)][I][FONT=times new roman][SIZE=4]Одобрено[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.15.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [/COLOR][COLOR=rgb(255, 0, 0)]|  Jail 60 минут / Warn (за два и более убийства)[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=5]Наказание будет выдано в течении суток, благодарим за обращение.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=6]Данную тему я закрываю.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Приятной игры на нашем сервере[/COLOR][COLOR=rgb(209, 175, 133)] Tambov[/COLOR]' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]С уважением[/COLOR][COLOR=rgb(97, 189, 109)] Куратор форума [/COLOR]',
          },
          {
            title: ' SK (Spawn Kill)',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }} нашего сервера Tambov [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба на игрока, мною была рассмотрена и получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(50, 205, 50)][I][FONT=times new roman][SIZE=4]Одобрено[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.16.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [/COLOR][COLOR=rgb(255, 0, 0)]|  Jail 60 минут / Warn (за два и более убийства)[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=5]Наказание будет выдано в течении суток, благодарим за обращение.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=6]Данную тему я закрываю.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Приятной игры на нашем сервере[/COLOR][COLOR=rgb(209, 175, 133)] Tambov[/COLOR]' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]С уважением[/COLOR][COLOR=rgb(97, 189, 109)] Куратор форума [/COLOR]',
          },
           {
            title: ' PG (PowerGaming)',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }} нашего сервера Tambov [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба на игрока, мною была рассмотрена и получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(50, 205, 50)][I][FONT=times new roman][SIZE=4]Одобрено[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.17.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь [/COLOR][COLOR=rgb(255, 0, 0)]|  Jail 30 минут [/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=5]Наказание будет выдано в течении суток, благодарим за обращение.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=6]Данную тему я закрываю.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Приятной игры на нашем сервере[/COLOR][COLOR=rgb(209, 175, 133)] Tambov[/COLOR]' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]С уважением[/COLOR][COLOR=rgb(97, 189, 109)] Куратор форума [/COLOR]',
          },
          {
            title: 'MG (MetaGaming)',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name } нашего сервера Tambov [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба на игрока, мною была рассмотрена и получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(50, 205, 50)][I][FONT=times new roman][SIZE=4]Одобрено[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.18.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [/COLOR][COLOR=rgb(255, 0, 0)]|Mute 30 минут[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
             '[LIST]<br><br>' +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4] Примечание:[/COLOR][COLOR=rgb(209, 213, 216)]использование смайлов в виде символов «))», «=D» запрещено в IC чате.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4] Примечание:[/COLOR][COLOR=rgb(209, 213, 216)]телефонное общение также является IC чатом.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4] Исключение:[/COLOR][COLOR=rgb(209, 213, 216)]за написанный однократно вопросительный «?» или восклицательный «!» знак в IC чате, наказание не выдается.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br><br>" +
             "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=5]Наказание будет выдано в течении суток, благодарим за обращение.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
             "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=6]Данную тему я закрываю.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Приятной игры на нашем сервере[/COLOR][COLOR=rgb(209, 175, 133)] Tambov[/COLOR]' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]С уважением[/COLOR][COLOR=rgb(97, 189, 109)] Куратор форума [/COLOR]',
          },
          {
            title: 'DM (DeathMatch))',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }} нашего сервера Tambov [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба на игрока, мною была рассмотрена и получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(50, 205, 50)][I][FONT=times new roman][SIZE=4]Одобрено[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.19.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины[/COLOR][COLOR=rgb(255, 0, 0)]|Jail 60 минут[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
             '[LIST]<br><br>' +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4] Примечание:[/COLOR][COLOR=rgb(209, 213, 216)]разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4] Примечание:[/COLOR][COLOR=rgb(209, 213, 216)]нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br><br>" +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=5]Наказание будет выдано в течении суток, благодарим за обращение.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
             "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=6]Данную тему я закрываю.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Приятной игры на нашем сервере[/COLOR][COLOR=rgb(209, 175, 133)] Tambov[/COLOR]' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]С уважением[/COLOR][COLOR=rgb(97, 189, 109)] Куратор форума [/COLOR]',
          },
           {
            title: ' Mass DM (Mass DeathMatch))',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }} нашего сервера Tambov [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба на игрока, мною была рассмотрена и получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(50, 205, 50)][I][FONT=times new roman][SIZE=4]Одобрено[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.20.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [/COLOR][COLOR=rgb(255, 0, 0)]|  Warn / Ban 3 - 7 дней [/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=5]Наказание будет выдано в течении суток, благодарим за обращение.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=6]Данную тему я закрываю.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Приятной игры на нашем сервере[/COLOR][COLOR=rgb(209, 175, 133)] Tambov[/COLOR]' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]С уважением[/COLOR][COLOR=rgb(97, 189, 109)] Куратор форума [/COLOR]',
          },
           {
            title: 'ППИВ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }} нашего сервера Tambov [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба на игрока, мною была рассмотрена и получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(50, 205, 50)][I][FONT=times new roman][SIZE=4]Одобрено[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.28.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги[/COLOR][COLOR=rgb(255, 0, 0)]|PermBan с обнулением аккаунта + ЧС проекта[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
             '[LIST]<br><br>' +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4] Примечание:[/COLOR][COLOR=rgb(209, 213, 216)]любые попытки покупки/продажи, попытки поинтересоваться о ней у другого игрока и прочее - наказуемы[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4] Примечание:[/COLOR][COLOR=rgb(209, 213, 216)]также запрещен обмен доната на игровые ценности и наоборот;[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4] Пример:[/COLOR][COLOR=rgb(209, 213, 216)]пополнение донат счет любого игрока взамен на игровые ценности;[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4] Исключение:[/COLOR][COLOR=rgb(209, 213, 216)] официальная покупка через сайт.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br><br>" +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=5]Наказание будет выдано в течении суток, благодарим за обращение.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
             "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=6]Данную тему я закрываю.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Приятной игры на нашем сервере[/COLOR][COLOR=rgb(209, 175, 133)] Tambov[/COLOR]' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]С уважением[/COLOR][COLOR=rgb(97, 189, 109)] Куратор форума [/COLOR]',
          },
          {
            title: 'Реклама Проектов, ютуб каналов',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }} нашего сервера Tambov [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба на игрока, мною была рассмотрена и получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(50, 205, 50)][I][FONT=times new roman][SIZE=4]Одобрено[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.31.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное [/COLOR][COLOR=rgb(255, 0, 0)]|  Ban 7 дней / PermBan [/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
           "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=5]Наказание будет выдано в течении суток, благодарим за обращение.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
           "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=6]Данную тему я закрываю.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Приятной игры на нашем сервере[/COLOR][COLOR=rgb(209, 175, 133)] Tambov[/COLOR]' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]С уважением[/COLOR][COLOR=rgb(97, 189, 109)] Куратор форума [/COLOR]',
          },
           {
            title: 'Конфликты на почве религии',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }} нашего сервера Tambov[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба на игрока, мною была рассмотрена и получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(50, 205, 50)][I][FONT=times new roman][SIZE=4]Одобрено[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.35.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате  [/COLOR][COLOR=rgb(255, 0, 0)]|  Mute 120 минут / Ban 7 дней [/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=5]Наказание будет выдано в течении суток, благодарим за обращение.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=6]Данную тему я закрываю.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Приятной игры на нашем сервере[/COLOR][COLOR=rgb(209, 175, 133)] Tambov[/COLOR]' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]С уважением[/COLOR][COLOR=rgb(97, 189, 109)] Куратор форума [/COLOR]',
          },
          {
            title: 'ППВ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }} нашего сервера Tambov [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба на игрока, мною была рассмотрена и получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(50, 205, 50)][I][FONT=times new roman][SIZE=4]Одобрено[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.41.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Передача своего личного игрового аккаунта третьим лицам [/COLOR][COLOR=rgb(255, 0, 0)]| PermBan [/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=5]Наказание будет выдано в течении суток, благодарим за обращение.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=6]Данную тему я закрываю.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Приятной игры на нашем сервере[/COLOR][COLOR=rgb(209, 175, 133)] Tambov[/COLOR]' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]С уважением[/COLOR][COLOR=rgb(97, 189, 109)] Куратор форума [/COLOR]',
          },
          {
            title: 'ЕПП',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }} нашего сервера Tambov [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба на игрока, мною была рассмотрена и получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(50, 205, 50)][I][FONT=times new roman][SIZE=4]Одобрено[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.46.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено ездить по полям на любом транспорте[/COLOR][COLOR=rgb(255, 0, 0)]| Jail 30 минут [/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
             '[LIST]<br><br>' +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4] Исключение:[/COLOR][COLOR=rgb(209, 213, 216)]разрешено передвижение на кроссовых мотоциклах и внедорожниках.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br><br>" +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=5]Наказание будет выдано в течении суток, благодарим за обращение.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
             "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=6]Данную тему я закрываю.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Приятной игры на нашем сервере[/COLOR][COLOR=rgb(209, 175, 133)] Tambov[/COLOR]' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]С уважением[/COLOR][COLOR=rgb(97, 189, 109)] Куратор форума [/COLOR]',
          },
          {
            title: 'ЕПП фура или инко',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }} нашего сервера Tambov [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба на игрока, мною была рассмотрена и получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(50, 205, 50)][I][FONT=times new roman][SIZE=4]Одобрено[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.47.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора)[/COLOR][COLOR=rgb(255, 0, 0)]| Jail 60 минут [/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=5]Наказание будет выдано в течении суток, благодарим за обращение.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" + "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=6]Данную тему я закрываю.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Приятной игры на нашем сервере[/COLOR][COLOR=rgb(209, 175, 133)] Tambov[/COLOR]' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]С уважением[/COLOR][COLOR=rgb(97, 189, 109)] Куратор форума [/COLOR]',
          },
           {
            title: 'Багоюз аним',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }} нашего сервера Tambov [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба на игрока, мною была рассмотрена и получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(50, 205, 50)][I][FONT=times new roman][SIZE=4]Одобрено[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.55.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещается багоюз связанный с анимацией в любых проявлениях. [/COLOR][COLOR=rgb(255, 0, 0)]|  Jail 60 / 120 минут [/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
             '[LIST]<br><br>' +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4] Пример:[/COLOR][COLOR=rgb(209, 213, 216)]если игрок, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде Jail на 120 минут. Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4] Пример:[/COLOR][COLOR=rgb(209, 213, 216)]если игрок использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде Jail на 60 минут.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br><br>" +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=5]Наказание будет выдано в течении суток, благодарим за обращение.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
             "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=6]Данную тему я закрываю.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Приятной игры на нашем сервере[/COLOR][COLOR=rgb(209, 175, 133)] Tambov[/COLOR]' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]С уважением[/COLOR][COLOR=rgb(97, 189, 109)] Куратор форума [/COLOR]',
          },
           {
            title: 'Долг',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }} нашего сервера Tambov [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба на игрока, мною была рассмотрена и получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(50, 205, 50)][I][FONT=times new roman][SIZE=4]Одобрено[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.57.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещается брать в долг игровые ценности и не возвращать их. [/COLOR][COLOR=rgb(255, 0, 0)]|  Ban 30 дней / permban [/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
             '[LIST]<br><br>' +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4] Примечание:[/COLOR][COLOR=rgb(209, 213, 216)]займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется;[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4] Примечание:[/COLOR][COLOR=rgb(209, 213, 216)]при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда;[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4] Примечание:[/COLOR][COLOR=rgb(209, 213, 216)]жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br><br>" +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=5]Наказание будет выдано в течении суток, благодарим за обращение.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
             "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=6]Данную тему я закрываю.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Приятной игры на нашем сервере[/COLOR][COLOR=rgb(209, 175, 133)] Tambov[/COLOR]' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]С уважением[/COLOR][COLOR=rgb(97, 189, 109)] Куратор форума [/COLOR]',
          },
          {
            title: 'CapsLock',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }} нашего сервера Tambov [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба на игрока, мною была рассмотрена и получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(50, 205, 50)][I][FONT=times new roman][SIZE=4]Одобрено[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]3.02.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате[/COLOR][COLOR=rgb(255, 0, 0)]| Mute 30 минут [/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=5]Наказание будет выдано в течении суток, благодарим за обращение.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
             "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=6]Данную тему я закрываю.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Приятной игры на нашем сервере[/COLOR][COLOR=rgb(209, 175, 133)] Tambov/COLOR]' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]С уважением[/COLOR][COLOR=rgb(97, 189, 109)] Куратор форума [/COLOR]',
          },
          {
        title: ' ᅠᅠ.... Пункт правил 3.0. Игровые чаты...      ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #7851A9; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',
     	},
           {
            title: 'Оскорбление',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }} нашего сервера Tambov [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба на игрока, мною была рассмотрена и получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(50, 205, 50)][I][FONT=times new roman][SIZE=4]Одобрено[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]3.03.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены[/COLOR][COLOR=rgb(255, 0, 0)]| Mute 30 минут [/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=5]Наказание будет выдано в течении суток, благодарим за обращение.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
             "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=6]Данную тему я закрываю.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Приятной игры на нашем сервере[/COLOR][COLOR=rgb(209, 175, 133)] Tambov[/COLOR]' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]С уважением[/COLOR][COLOR=rgb(97, 189, 109)] Куратор форума [/COLOR]',
          },
          {
            title: 'Упом/оск родни',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }} нашего сервера Tambov [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба на игрока, мною была рассмотрена и получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(50, 205, 50)][I][FONT=times new roman][SIZE=4]Одобрено[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]3.04.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [/COLOR][COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 7 - 15 дней [/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
             '[LIST]<br><br>' +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4] Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] термины MQ, rnq расценивается, как упоминание родных.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4] Исключение:[/COLOR][COLOR=rgb(209, 213, 216)] если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br><br>" +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=5]Наказание будет выдано в течении суток, благодарим за обращение.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
             "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=6]Данную тему я закрываю.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Приятной игры на нашем сервере[/COLOR][COLOR=rgb(209, 175, 133)] Tambov[/COLOR]' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]С уважением[/COLOR][COLOR=rgb(97, 189, 109)] Куратор форума [/COLOR]',
          },
           {
            title: 'Религия',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }} нашего сервера Tambov [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба на игрока, мною была рассмотрена и получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(50, 205, 50)][I][FONT=times new roman][SIZE=4]Одобрено[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]3.18.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов[/COLOR][COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 10 дней [/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=5]Наказание будет выдано в течении суток, благодарим за обращение.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=6]Данную тему я закрываю.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Приятной игры на нашем сервере[/COLOR][COLOR=rgb(209, 175, 133)] Tambov[/COLOR]' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]С уважением[/COLOR][COLOR=rgb(97, 189, 109)] Куратор форума [/COLOR]',
          },
          {
        title: ' ᅠᅠ... Отказ жалобы ...     ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #7851A9; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',
     	},
          {
            title: 'Жалоба от 3-его лица',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }} нашего сервера Tambov [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба на игрока, мною была рассмотрена и получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(139, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Причиной тому послужило - Жалоба написана в 3-тье лице.Перед созданием новой жалобы рекомендую ознакомиться с правилами подачи жалоб на игрока по ссылке - [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/'][COLOR=rgb(209, 175, 133)]Правила подачи жалобы на игрока[/COLOR][/URL][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
             "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=6]Данную тему я закрываю.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Приятной игры на нашем сервере[/COLOR][COLOR=rgb(209, 175, 133)] Tambov[/COLOR]' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]С уважением[/COLOR][COLOR=rgb(97, 189, 109)] Куратор форума [/COLOR]',
          },
          {
            title: '72 часа с момента нарушения',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }} нашего сервера Tambov [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба на игрока, мною была рассмотрена и получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(139, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Причиной тому послужило - Жалоба написана после истечения срока доказательств, более 72х часов. Перед созданием новой жалобы рекомендую ознакомиться с правилами подачи жалоб на игрока по ссылке - [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/'][COLOR=rgb(209, 175, 133)]Правила подачи жалобы на игрока[/COLOR][/URL][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
             "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=6]Данную тему я закрываю.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Приятной игры на нашем сервере[/COLOR][COLOR=rgb(209, 175, 133)] Tambov[/COLOR]' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]С уважением[/COLOR][COLOR=rgb(97, 189, 109)] Куратор форума [/COLOR]',
          },
          {
            title: 'Отсутствие /time',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }} нашего сервера Tambov [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба на игрока, мною была рассмотрена и получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(139, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Причиной тому послужило - Доказательства сделаны без /time. Перед созданием новой жалобы рекомендую ознакомиться с правилами подачи жалоб на игрока по ссылке - [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/'][COLOR=rgb(209, 175, 133)]Правила подачи жалобы на игрока[/COLOR][/URL][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
             "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=6]Данную тему я закрываю.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Приятной игры на нашем сервере[/COLOR][COLOR=rgb(209, 175, 133)] Tambov[/COLOR]' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]С уважением[/COLOR][COLOR=rgb(97, 189, 109)] Куратор форума [/COLOR]',
          },
          {
            title: 'Доказательства в соц.сетях',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }} нашего сервера Tambov [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба на игрока, мною была рассмотрена и получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(139, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Причиной тому послужило - Доказательства были загружены в соц.сети. Перед созданием новой жалобы рекомендую ознакомиться с правилами подачи жалоб на игрока по ссылке - [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/'][COLOR=rgb(209, 175, 133)]Правила подачи жалобы на игрока[/COLOR][/URL][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=6]Данную тему я закрываю.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Приятной игры на нашем сервере[/COLOR][COLOR=rgb(209, 175, 133)] Tambov[/COLOR]' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]С уважением[/COLOR][COLOR=rgb(97, 189, 109)] Куратор форума [/COLOR]',
          },
          {
            title: 'Редактирование доказательств',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }} нашего сервера Tambov [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба на игрока, мною была рассмотрена и получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(139, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Причиной тому послужило - Доказательства были подвергнуты обработке. Перед созданием новой жалобы рекомендую ознакомиться с правилами подачи жалоб на игрока по ссылке - [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/'][COLOR=rgb(209, 175, 133)]Правила подачи жалобы на игрока[/COLOR][/URL][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=6]Данную тему я закрываю.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Приятной игры на нашем сервере[/COLOR][COLOR=rgb(209, 175, 133)] Tambov[/COLOR]' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]С уважением[/COLOR][COLOR=rgb(97, 189, 109)] Куратор форума [/COLOR]',
          },
           {
            title: 'Отсутствие тайм кода в доказательствах',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }} нашего сервера Tambov [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба на игрока, мною была рассмотрена и получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(139, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Причиной тому послужило - Доказательства, более трех минут не имеют тайм кода. Перед созданием новой жалобы рекомендую ознакомиться с правилами подачи жалоб на игрока по ссылке - [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/'][COLOR=rgb(209, 175, 133)]Правила подачи жалобы на игрока[/COLOR][/URL][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=6]Данную тему я закрываю.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Приятной игры на нашем сервере[/COLOR][COLOR=rgb(209, 175, 133)] Tambov[/COLOR]' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]С уважением[/COLOR][COLOR=rgb(97, 189, 109)] Куратор форума [/COLOR]',
          },
          {
        title: ' ᅠᅠ....  Role Play Биография  ....      ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #7851A9; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',
	   },
           {
            title: 'Отказано',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }} нашего сервера Tambov [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Биография, мною была рассмотрена и получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Причиной тому послужило - нарушение правил подачи Role Play Биографии, а именно [COLOR=rgb(139, 0, 0)][/COLOR]. Вам стоит исправить ошибки и отправить вашу биографию заново. Перед написанием новой биографии рекомендую ознакомиться с правилами подачи по ссылке - [/FONT][URL='https://forum.blackrussia.online/threads/tambov-Правила-создания-roleplay-биографии.7889593/'][FONT=courier new][COLOR=rgb(209, 175, 133)]Правила подачи RP Биографии[/COLOR][/FONT][/URL][FONT=courier new]<br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=6]Данную тему я закрываю.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Приятной игры на нашем сервере[/COLOR][COLOR=rgb(209, 175, 133)] [/COLOR]' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]С уважением[/COLOR][COLOR=rgb(97, 189, 109)] Куратор форума [/COLOR]',
          },
           {
            title: 'Одобрено',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }} нашего сервера Tambov [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Биография, мною была рассмотрена и получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(50, 205, 50)][I][FONT=times new roman][SIZE=4]Одобрено[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=6]Данную тему я закрываю.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Приятной игры на нашем сервере[/COLOR][COLOR=rgb(209, 175, 133)] Tambov[/COLOR]' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]С уважением[/COLOR][COLOR=rgb(97, 189, 109)] Куратор форума [/COLOR]',
          },
          {
            title: 'Копипаст',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }} нашего сервера TAMBOV [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Биография, мною была рассмотрена и получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Причиной тому послужило - то что вы скопировали RolePlay Биографию у другого игрока. Перед написанием новой биографии рекомендую ознакомиться с правилами подачи по ссылке - [/FONT][URL='https://forum.blackrussia.online/threads/tambov-Правила-создания-roleplay-биографии.7889593/'][FONT=courier new][COLOR=rgb(209, 175, 133)]Правила подачи RP Биографии[/COLOR][/FONT][/URL][FONT=courier new]<br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=6]Данную тему я закрываю.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Приятной игры на нашем сервере[/COLOR][COLOR=rgb(209, 175, 133)] TAMBOV[/COLOR]' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]С уважением[/COLOR][COLOR=rgb(97, 189, 109)] Куратор форума [/COLOR]',
          },
           {
            title: 'Заголовок не по форме',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }} нашего сервера TAMBOV [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Биография, мною была рассмотрена и получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Причиной тому послужило - Заголовок RolePlay Биографии написан не по форме. Перед написанием новой биографии рекомендую ознакомиться с правилами подачи по ссылке - [/FONT][URL='https://forum.blackrussia.online/threads/tambov-Правила-написания-roleplay-ситуации.7889654/'][FONT=courier new][COLOR=rgb(209, 175, 133)]Правила подачи RP Биографии[/COLOR][/FONT][/URL][FONT=courier new]<br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=6]Данную тему я закрываю.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Приятной игры на нашем сервере[/COLOR][COLOR=rgb(209, 175, 133)] TAMBOV[/COLOR]' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]С уважением[/COLOR][COLOR=rgb(97, 189, 109)] Куратор форума [/COLOR]',
           },
            {
            title  : 'Неграмотная' ,
dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }} нашего сервера TAMBOV [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Биография, мною была рассмотрена и получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
"[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Причиной тому послужило - биография отказана т.к она оформлена неграмотно. Перед написанием новой биографии рекомендую ознакомиться с правилами подачи по ссылке [/FONT]  [URL='https://forum.blackrussia.online/threads/tambov-Правила-создания-roleplay-биографии.7889593'][FONT=courier new][COLOR=rgb(209, 175, 133)]Правила подачи RP Биографии[/COLOR][/FONT][/URL][FONT=courier new]<br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=6]Данную тему я закрываю.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Приятной игры на нашем сервере[/COLOR][COLOR=rgb(209, 175, 133)] TAMBOV[/COLOR]' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]С уважением[/COLOR][COLOR=rgb(97, 189, 109)] Куратор форума [/COLOR]'
             },
              {
          title : 'дата рождения не полностью.',
dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
conte
:'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }} нашего сервера TAMBOV [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
"[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Биография, мною была рассмотрена и получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
"[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Причиной тому послужило послужило - ваша дата рождения расписана не полностью .Перед написанием новой биографии рекомендую ознакомиться с правилами подачи по ссылке - [/FONT [URL='https://forum.blackrussia.online/threads/tambov-Правила-создания-roleplay-биографии.7889593'][FONT=courier new][COLOR=rgb(209, 175, 133)]Правила подачи RP Биографии[/COLOR][/FONT][/URL][FONT=courier new]<br>" +
"[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=6]Данную тему я закрываю.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Приятной игры на нашем сервере[/COLOR][COLOR=rgb(209, 175, 133)] TAMBOV[/COLOR]' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]С уважением[/COLOR][COLOR=rgb(97, 189, 109)] Куратор форума [/COLOR]'            
             },
              {
            title : 'дата рождения не совпадает с возрастом' ,
dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }} нашего сервера TAMBOV [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Биография, мною была рассмотрена и получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
"[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Причиной тому послужило послужило - дата рождения не совпадает с возрастом . Перед написанием новой биографии рекомендую ознакомиться с правилами подачи по ссылке - [/FONT [URL='https://forum.blackrussia.online/threads/tambov-Правила-создания-roleplay-биографии.7889593'][FONT=courier new][COLOR=rgb(209, 175, 133)]Правила подачи RP Биографии[/COLOR][/FONT][/URL][FONT=courier new]<br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=6]Данную тему я закрываю.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Приятной игры на нашем сервере[/COLOR][COLOR=rgb(209, 175, 133)] TAMBOV[/COLOR]' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]С уважением[/COLOR][COLOR=rgb(97, 189, 109)] Куратор форума [/COLOR]'   
            },
              {
      title : 'написана от 3-его лица.' ,
dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
 content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }} нашего сервера TAMBOV [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
 "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Биография, мною была рассмотрена и получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
"[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Причиной тому послужило послужило - написана от 3-его лица. . Перед написанием новой биографии рекомендую ознакомиться с правилами подачи по ссылке - [/FONT [URL='https://forum.blackrussia.online/threads/tambov-Правила-создания-roleplay-биографии.7889593'][FONT=courier new][COLOR=rgb(209, 175, 133)]Правила подачи RP Биографии[/COLOR][/FONT][/URL][FONT=courier new]<br>" +
"[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=6]Данную тему я закрываю.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Приятной игры на нашем сервере[/COLOR][COLOR=rgb(209, 175, 133)] TAMBOV[/COLOR]' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]С уважением[/COLOR][COLOR=rgb(97, 189, 109)] Куратор форума [/COLOR]' 
            },
              {

            title : 'Не по форме' , 
dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }} нашего сервера TAMBOV [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
"[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Биография, мною была рассмотрена и получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
"[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Причиной тому послужило послужило -составлена не по форме . Перед написанием новой биографии рекомендую ознакомиться с правилами подачи по ссылке - [/FONT [URL='https://forum.blackrussia.online/threads/tambov-Правила-создания-roleplay-биографии.7889593'][FONT=courier new][COLOR=rgb(209, 175, 133)]Правила подачи RP Биографии[/COLOR][/FONT][/URL][FONT=courier new]<br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=6]Данную тему я закрываю.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Приятной игры на нашем сервере[/COLOR][COLOR=rgb(209, 175, 133)] TAMBOV[/COLOR]' +
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]С уважением[/COLOR][COLOR=rgb(97, 189, 109)] Куратор форума [/COLOR]'      
              },
                 {
        title: 'Недостаточно РП информации',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }} нашего сервера TAMBOV [/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
"[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Биография, мною была рассмотрена и получает статус [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
"[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]ППричина отказа: Недостаточно РП информации.  Перед написанием новой биографии рекомендую ознакомиться с правилами подачи по ссылке - [/FONT [URL='https://forum.blackrussia.online/threads/tambov-Правила-создания-roleplay-биографии.7889593'][FONT=courier new][COLOR=rgb(209, 175, 133)]Правила подачи RP Биографии[/COLOR][/FONT][/URL][FONT=courier new]<br>" +
"[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=6]Данную тему я закрываю.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d0pnfVgs/vGgCZhi.png[/img][/url][/CENTER]<br>' +
'[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Приятной игры на нашем сервере[/COLOR][COLOR=rgb(209, 175, 133)] TAMBOV[/COLOR]' +
'[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]С уважением[/COLOR][COLOR=rgb(97, 189, 109)] Куратор форума [/COLOR]'      
                 }
 
                   
                   ];
	
	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
	// Добавление кнопок при загрузке страницы
	addButton('На рассмотрении', 'pin', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(203, 40, 33, 0.5);');
    addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5);')
    addButton('Одобрено', 'accepted', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5);')
	addButton('Закрыто', 'closed', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(138, 43, 226, 0.5);');
	addAnswers();
	
	// Поиск информации о теме
	const threadData = getThreadData();
 
	$(`button#ff`).click(() => pasteContent(8, threadData, true));
	$(`button#prr`).click(() => pasteContent(2, threadData, true));
	$(`button#zhb`).click(() => pasteContent(21, threadData, true));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
	$('button#decided').click(() => editThreadData(DECIDED_PREFIX, false));
	$('button#closed').click(() => editThreadData(CLOSE_PREFIX, false));
	$('button#closed_complaint').click(() => editThreadData(CLOSE_PREFIX, false, false));
	$('button#techspec').click(() => editThreadData(TEX_PREFIX, true));
 
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
 
    function addButton(name, id, style) {
         $('.button--icon--reply').before(
	`<button type="button" class="button--primary button rippleButton" id="${id}" style="${style}">${name}</button>`,
	);
	}
	function addAnswers() {
		$('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 5px; margin-top: 10px; border-radius: 13px;">ОТВЕТЫ</button>`,
	);
	}
 
	function buttonsMarkup(buttons) {
	return `<div class="select_answer">${buttons
	.map(
	(btn, i) =>
	`<button id="answers-${i}" class="button--primary button ` +
	`rippleButton" style="margin:4px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`,
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