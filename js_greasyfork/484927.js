// ==UserScript==
// @name         hr-admin tools
// @namespace    https://forum.hr-rp.ru/
// @version      1.6.
// @description  HR-Tools - скрипт предназначенный для модерации форума forum.hr-rp.ru. Сделано Takumi_Saito - vk.com/williamwolves.
// @author       Skalnikov
// @match        https://forum.hr-rp.ru/threads/*
// @include      https://forum.hr-rp.ru/threads/
// @grant        none
// @license      MIT
// @downloadURL
// @downloadURL https://update.greasyfork.org/scripts/484927/hr-admin%20tools.user.js
// @updateURL https://update.greasyfork.org/scripts/484927/hr-admin%20tools.meta.js
// ==/UserScript==

(function () {
	'use strict';
	const UNACCEPT_PREFIX = 5; // префикс отказано
	const ACCEPT_PREFIX = 4; // префикс одобрено
	const PIN_PREFIX = 6; //  префикс закрепить
	const COMMAND_PREFIX = 10; // команде проекта
	const CLOSE_PREFIX = 14; // префикс закрыто
	const DECIDED_PREFIX = 2; // префикс решено
	const WATCHED_PREFIX = 7; // рассмотрено
	const TEX_PREFIX = 13; //  техническому специалисту
	const NO_PREFIX = 0;
  const INFO_PREFIX = 3;
	const buttons = [
	{
		title: 'Приветствие',
	    dpstyle: 'oswald: 3px;     color: #fff; background: #50c878; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCNp78jD/I99yZHQ.png[/img][/url][/CENTER]<br>' +
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Здесь вставьте Ваш текст[/CENTER][/FONT][/SIZE]',
	},
	{
        title: ' ᅠᅠ.... Обычные темы регламента ....      ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #7851A9; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',
	},
         {
            title: 'На рассмотрении',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCNp78jD/I99yZHQ.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER]{{ greeting }}, уважаемый {{ user.name }}.[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба взята на рассмотрение, ожидайте ответа в данной теме.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[I][CENTER][SIZE=1][COLOR=rgb(255, 140, 0)]На рассмотрение...[/SIZE][/CENTER][/COLOR]',
            prefix: PIN_PREFIX,
            status: true,
          },
          {
            title: 'Оск род',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCNp78jD/I99yZHQ.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER]{{ greeting }}, уважаемый {{ user.name }}.[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено оскорбление родных вне зависимости от чата (IC или OOC) [/COLOR][COLOR=rgb(255, 0, 0)]| Ban 2 дня[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[LIST]<br><br>' +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] термин «MQ» расценивается, как упоминание родных.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br><br>" +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Harsh Russia[/B][/COLOR] [/SIZE][/I]<br>" ,
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Оск игрока',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCNp78jD/I99yZHQ.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER]{{ greeting }}, уважаемый {{ user.name }}.[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Любые формы оскорблений, издевательств, расизма, дискриминации[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 10 минут[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Harsh Russia[/B][/COLOR] [/SIZE][/I]",
            prefix: ACCEPT_PREFIX,
            status: false,
          },
{
            title: 'выдача за адм',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCNp78jD/I99yZHQ.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER]{{ greeting }}, уважаемый {{ user.name }}.[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещена выдача себя за администратора, если таковым не являетесь[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] |   Ban 1 день [/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Harsh Russia[/B][/COLOR] [/SIZE][/I]",
            prefix: ACCEPT_PREFIX,
            status: false,
          },
{
            title: 'Оск адм',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCNp78jD/I99yZHQ.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER]{{ greeting }}, уважаемый {{ user.name }}.[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][CENTER]Нарушитель буден наказан по следующему пункту общих правил серверов:[/CENTER][/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua]Запрещено оскорбление администрации на всех ресурсах проекта[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]| Mute 30 - 60 минут[/FONT][/SIZE][/COLOR][/CENTER]<br><br>" +
              '[LIST]<br><br>' +
              "[*][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]Пример: [/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua]оскорбление администрации в репорт, обвинение администраторов без доказательств и т.д.[/FONT][/SIZE][/COLOR]<br><br>" +
              "[/LIST]<br><br>" +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Harsh Russia[/B][/COLOR] [/SIZE][/I]",
            prefix: ACCEPT_PREFIX,
            status: false,
          },

          {
        title: ' ᅠᅠ....  Наказания за Рекламу  ....      ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #7851A9; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',
      	},
          {
            title: 'Реклама',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCNp78jD/I99yZHQ.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER]{{ greeting }}, уважаемый {{ user.name }}.[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Ban 5 дней[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Harsh Russia[/B][/COLOR] [/SIZE][/I]",
            prefix: ACCEPT_PREFIX,
            status: false,
          },
           {
        title: '         ᅠᅠ                                    ..... Наказание  за  NonRp  игры ....                  ' ,
        dpstyle: 'oswald: 3px;     color: #fff; background: #7851A9; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',
	},
    {
            title: 'Nrp Обман',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCNp78jD/I99yZHQ.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER]{{ greeting }}, уважаемый {{ user.name }}.[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Ban 30 дней[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[LIST]<br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[*][LEFT][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br>" +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Harsh Russia[/B][/COLOR] [/SIZE][/I]",
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Nrp организация',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCNp78jD/I99yZHQ.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER]{{ greeting }}, уважаемый {{ user.name }}.[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено нарушение, Role Play режима со стороны сотрудника организации[/COLOR][COLOR=rgb(255, 0, 0)]| Warn[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Harsh Russia[/B][/COLOR] [/SIZE][/I]<br>" ,
            prefix: ACCEPT_PREFIX,
            status: false,
          },

           {
        title: ' ᅠᅠ.... Перенаправление в другой раздел ....      ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #7851A9; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',
	},
	 {
            title: 'Техническому Менеджеру',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCNp78jD/I99yZHQ.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER]{{ greeting }}, уважаемый {{ user.name }}.[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба переадресована [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 102, 0)][I][FONT=times new roman][SIZE=4]Техническому Менеджеру[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[I][CENTER][SIZE=1][COLOR=rgb(255, 140, 0)]На рассмотрение...[/SIZE][/CENTER][/COLOR]',
            prefix: PIN_PREFIX,
            status: true,
          },
          {
            title: 'В жб на адм',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCNp78jD/I99yZHQ.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER]{{ greeting }}, уважаемый {{ user.name }}.[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Вы ошиблись разделом, обратитесь в раздел жалоб на администрацию.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Harsh Russia[/B][/COLOR] [/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'В тех раздел',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCNp78jD/I99yZHQ.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER]{{ greeting }}, уважаемый {{ user.name }}.[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Вы ошиблись разделом, обратитесь в [URL='https://forum.hr-rp.ru/forums/texnicheskij-razdel.3/']технический раздел[/URL].[/I][/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Harsh Russia[/B][/COLOR] [/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'В жб на лидеров',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCNp78jD/I99yZHQ.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER]{{ greeting }}, уважаемый {{ user.name }}.[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Вы ошиблись разделом, обратитесь в раздел жалоб на лидеров.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Harsh Russia[/B][/COLOR] [/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'В жб на сотрудников орг',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCNp78jD/I99yZHQ.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER]{{ greeting }}, уважаемый {{ user.name }}.[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Вы ошиблись разделом, обратитесь в жалобы на сотрудников фракции[/I][/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Harsh Russia[/B][/COLOR] [/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },

           {
        title: ' ᅠᅠ....  Доказательства в жалобах ....      ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #7851A9; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',
	},
    {
            title: 'Универсальный ответ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCNp78jD/I99yZHQ.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER]{{ greeting }}, уважаемый {{ user.name }}.[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Свой текст. [/SIZE][/FONT][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Harsh Russia[/B][/COLOR] [/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Недостаточно док-в',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCNp78jD/I99yZHQ.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER]{{ greeting }}, уважаемый {{ user.name }}.[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Недостаточно доказательств для корректного рассмотрения вашей жалобы.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Harsh Russia[/B][/COLOR] [/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Отсутствуют док-ва',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCNp78jD/I99yZHQ.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER]{{ greeting }}, уважаемый {{ user.name }}.[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Отсутствуют доказательства - следовательно, рассмотрению не подлежит. Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Harsh Russia[/B][/COLOR] [/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Не работает док-ва',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCNp78jD/I99yZHQ.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER]{{ greeting }}, уважаемый {{ user.name }}.[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Ваши доказательства не рабочие или же битая ссылка.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Harsh Russia[/B][/COLOR] [/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Док-ва обрываются',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCNp78jD/I99yZHQ.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER]{{ greeting }}, уважаемый {{ user.name }}.[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Ваша видеозапись обрывается. Загрузите полную видеозапись на видео-хостинг YouTube.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Harsh Russia[/B][/COLOR] [/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Док-ва отредакт',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCNp78jD/I99yZHQ.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER]{{ greeting }}, уважаемый {{ user.name }}.[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Доказательства были подвергнуты редактированию - следовательно, рассмотрению не подлежит.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Harsh Russia[/B][/COLOR] [/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Нужен фрапс',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCNp78jD/I99yZHQ.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER]{{ greeting }}, уважаемый {{ user.name }}.[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]В данной ситуации обязательно должен быть фрапс(видео фиксация)всех моментов.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Harsh Russia[/B][/COLOR] [/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Док-ва в соц. сетях',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCNp78jD/I99yZHQ.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER]{{ greeting }}, уважаемый {{ user.name }}.[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4] Доказательства в соц. сетях не принимаются. Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Harsh Russia[/B][/COLOR] [/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Неполный фрапс',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCNp78jD/I99yZHQ.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER]{{ greeting }}, уважаемый {{ user.name }}.[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Видео фиксация не полная либо же нет условий сделки.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Harsh Russia[/B][/COLOR] [/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Нету time',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCNp78jD/I99yZHQ.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER]{{ greeting }}, уважаемый {{ user.name }}.[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]На доказательствах отсутствуют дата и время[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Harsh Russia[/B][/COLOR] [/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Нет условий сделки',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCNp78jD/I99yZHQ.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER]{{ greeting }}, уважаемый {{ user.name }}.[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]В предоставленных доказательствах отсутствуют условия сделки.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Harsh Russia[/B][/COLOR] [/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Нарушений нет',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCNp78jD/I99yZHQ.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER]{{ greeting }}, уважаемый {{ user.name }}.[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушений со стороны игрока не было замечено. [/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Harsh Russia[/B][/COLOR] [/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },

           {
        title: ' ᅠᅠ.... Прочие пункты правиал....      ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #7851A9; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',
	},
          {
            title: 'Заголовок неправильный',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCNp78jD/I99yZHQ.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER]{{ greeting }}, уважаемый {{ user.name }}.[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Ваш заголовок составлен не по форме. Внимательно прочтите правила создания темы, прикрепленные в этом разделе.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Harsh Russia[/B][/COLOR] [/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: '2 и более игрока',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCNp78jD/I99yZHQ.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER]{{ greeting }}, уважаемый {{ user.name }}.[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Ваша жалоба отказана по причине: нельзя писать одну жалобу на двух и белее игроков ( на каждого игрока отдельная жалоба)[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Harsh Russia[/B][/COLOR] [/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Не по форме',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCNp78jD/I99yZHQ.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER]{{ greeting }}, уважаемый {{ user.name }}.[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Ваша жалоба составлена не по форме. Внимательно прочитайте правила подачи жалоб на игроков, закрепленные в этом разделе.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Harsh Russia[/B][/COLOR] [/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Уже наказан',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCNp78jD/I99yZHQ.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER]{{ greeting }}, уважаемый {{ user.name }}.[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Данный нарушитель уже был наказан ранее.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Harsh Russia[/B][/COLOR] [/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Уже был дан ответ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCNp78jD/I99yZHQ.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER]{{ greeting }}, уважаемый {{ user.name }}.[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Вам уже был дан ответ в прошлых жалобах[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Harsh Russia[/B][/COLOR] [/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Прошло 3 дня',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCNp78jD/I99yZHQ.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER]{{ greeting }}, уважаемый {{ user.name }}.[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]С моменты нарушения прошло более 72-х часов[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Harsh Russia[/B][/COLOR] [/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'От 3 лица',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCNp78jD/I99yZHQ.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER]{{ greeting }}, уважаемый {{ user.name }}.[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Ваша жалоба написана от 3-его лица. Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Harsh Russia[/B][/COLOR] [/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Заголовок неправильный',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCNp78jD/I99yZHQ.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER]{{ greeting }}, уважаемый {{ user.name }}.[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Ваш заголовок составлен не по форме. Внимательно прочтите правила создания темы, прикрепленные в этом разделе.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Harsh Russia[/B][/COLOR] [/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'обж отказ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCNp78jD/I99yZHQ.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER]{{ greeting }}, уважаемый {{ user.name }}.[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Пересмотрев Ваши прошлые деяния, в данной ситуации обжалование не возможно![/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Harsh Russia[/B][/COLOR] [/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'обж одобрено',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCNp78jD/I99yZHQ.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER]{{ greeting }}, уважаемый {{ user.name }}.[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Пересмотрев Ваши прошлые деяния, в обжалование Вам одобрено![/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Harsh Russia[/B][/COLOR] [/SIZE][/I]",
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'offtop',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCNp78jD/I99yZHQ.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER]{{ greeting }}, уважаемый {{ user.name }}.[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Тема создана в не подходящем разделе.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Harsh Russia[/B][/COLOR] [/SIZE][/I]",
            prefix: ACCEPT_PREFIX,
            status: false,
          },
        {
            title: ' ᅠᅠ.... Для ГСов/ЗГСов ....      ',
            dpstyle: 'oswald: 3px;     color: #fff; background: #7851A9; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',
      },
          {
            title: 'Заявки рассмотрены',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCNp78jD/I99yZHQ.png[/img][/url]<br>' +
            '[I]{{ greeting }}, рассмотрев Ваши заявления, могу вынести вердикт:<br><br>' +
            '[FONT=verdana][COLOR=rgb(97, 189, 109)][SIZE=4]Одобренные[/SIZE][/COLOR][SIZE=1]:[/SIZE][/FONT]<br><br>' +
            '[FONT=times new roman][SIZE=3]№ заявки Name_Surname[/SIZE][/FONT][/I]<br><br>' +
            '[FONT=verdana][SIZE=4][I][COLOR=rgb(226, 80, 65)]Отказанные[/COLOR][/I][/SIZE][/FONT]:<br><br>' +
            '[I][FONT=times new roman][SIZE=3]№ заявки Name_Surname - причина[/SIZE][/FONT][/I]<br><br>' +
            '[FONT=book antiqua][B][I][B]Одобренным кандидатам, отпишу в личные сообщения в ВКонтакте[/B][/I][/B][/FONT][FONT=georgia][B][I].[/I][/B][/FONT]<br><br>' +
            '[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Harsh Russia[/CENTER][/B][/COLOR][/SIZE][/I]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Заявки открыты',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/cCNp78jD/I99yZHQ.png[/img][/url]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER]{{ greeting }}, уважаемые игроки![/CENTER][/I][/SIZE][/FONT][/COLOR]<br>' +
            '[CENTER][I][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Заявления на пост лидера фракции открыты! Заявки будут рассмотрены в течение 72-х часов.[/SIZE][/FONT][/FONT][/COLOR][/I][/CENTER]' +
            '[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Harsh Russia[/CENTER][/B][/COLOR][/SIZE][/I]',
            status: false,
          },

	];

	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
    addButton('Отклонено', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5);')
    addButton('Одобрено', 'accepted', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5);')
	  addButton('Закрыто', 'closed', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(138, 43, 226, 0.5);');
    addButton('Важно', 'decided', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5);');
    addButton('Рассмотрено', 'watched', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(135, 206, 250, 0.5);');
    addButton('Информация', 'informated', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 255, 0, 0.5);');
    addButton('Рассмотрение', 'pin', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(210, 149, 27, 0.5);');
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
  $('button#informated').click(() => editThreadData(INFO_PREFIX, false));

	$(`button#selectAnswer`).click(() => {
	XF.alert(buttonsMarkup(buttons), null, 'ВЫБЕРИТЕ ОТВЕТ');
	buttons.forEach((btn, id) => {
	if (id > 1) {
	$(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
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
		$('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 7px; margin-left: 5px; margin-top: 0px; border-radius: 5px;">ОТВЕТЫ</button>`,
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

