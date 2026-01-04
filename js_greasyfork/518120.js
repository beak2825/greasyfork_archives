// ==UserScript==
// @name         ! Технические
// @namespace    https://forum.blackrussia.online/
// @version      0.0.1
// @description  Botiv_Soliev   vk.com/id250006978
// @author       Botir_Soliev
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        none
// @license      MIT
// @icon https://sun9-42.userapi.com/impg/BJPz3U2wxU_zxhC5PnLg7de2KhrdnAiv7I96kg/RzbuT5qDnus.jpg?size=1000x1000&quality=95&sign=ed102d00b84c285332482312769e9bad&type=album
// @downloadURL https://update.greasyfork.org/scripts/518120/%21%20%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/518120/%21%20%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B5.meta.js
// ==/UserScript==

(function () {
	'use strict';
	const UNACCEPT_PREFIX = 4; // префикс отказано
	const PIN_PREFIX = 2; //  префикс закрепить
	const COMMAND_PREFIX = 10; // команде проекта
	const CLOSE_PREFIX = 7; // префикс закрыто
	const DECIDED_PREFIX = 6; // префикс решено
	const TECHADM_PREFIX = 13 // теху администратору
	const WATCHED_PREFIX = 9; // рассмотрено
	const WAIT_PREFIX = 14; // ожидание (для переноса в баг-трекер)
	const NO_PREFIX = 0;
	const buttons = [
     {
		title: 'Приветствие',
             dpstyle: 'oswald: 3px;     color: #fff; background: #0000FF; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/size]<br><br>" +
             "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px] ТЕКСТ [/size][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>',

          },
             {
		title: 'ЗАБЫЛ.НИК',
             dpstyle: 'oswald: 3px;     color: #fff; background: #0000FF; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/size]<br><br>" +
             "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Ваш текущий игровой ник: СЮДАНИК <br>Спасибо за ваше обращение.[/size][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>'+
            '[CENTER][SIZE=15px][COLOR=rgb(127, 255, 0)][ICODE]Решено[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: DECIDED_PREFIX,
            status: true,
          },
        {
            title: 'ЗАБЫЛ ПАРОЛЬ',
             dpstyle: 'oswald: 3px;     color: #fff; background: #0000FF; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Мы не имеем возможности знать ваши игровые пароли.<br>Попробуйте восстановить пароль через установленные привязки.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Отказано[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
                {
           title: `РОСПИСЬ`,
             dpstyle: 'oswald: 3px;     color: #fff; background: #0000FF; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	  content:
           '[center] [img]https://minecraft-inside.ru/uploads/ac/17/f4/521239.png[/img]'
          },
                        {
           title: `РОСПИСЬ АНИМ`,
             dpstyle: 'oswald: 3px;     color: #fff; background: #0000FF; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	  content:
           '[center] [img]https://share.creavite.co/6754814101dbfe495dee43c5.gif[/img]'
          },
                {
            title: 'ЗАПРОС.ПРИВЯЗОК', //
             dpstyle: 'oswald: 3px;     color: #fff; background: #0000FF; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]1. Укажите ваш Telegram ID, если ваш игровой аккаунт был привязан к Telegram. Узнать его можно здесь: https://t.me/getmyid_bot<br>2. Укажите ваш оригинальный ID страницы ВКонтакте, которая привязана к аккаунту (взять его можно через данный сайт - https://regvk.com/ )<br>3. Укажите почту, которая привязана к аккаунту</code>[/SIZE][/FONT][/COLOR]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>',
            prefix: TECHADM_PREFIX,
            status: true,
          },
        {
            title: `ПОКУПКА/ПРОДАЖА.ИВ.БОТ`,
             dpstyle: 'oswald: 3px;     color: #fff; background: #0000FF; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]При проверке системы логирования, было выявлено нарушение с вашей стороны в виде покупки игровой валюты. На ваш счёт поступила игровая валюта от бота, любые переводы от ботов приравниваются к покупке игровой валюты. Бот - программа для заработка игровой валюты различными способами и дальнейших переводов на аккаунты. Крайне рекомендуем ознакомиться с пунктом 2.28 регламента серверов:<br>2.28. Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги [COLOR=rgb(255, 0, 0)][FONT=Arial]| PermBan с обнулением аккаунта + ЧС проекта<br><br>Примечание: любые попытки покупки/продажи, попытки поинтересоваться о ней у другого игрока и прочее - наказуемы.<br>Примечание: также запрещен обмен доната на игровые ценности и наоборот;<br>Пример: пополнение донат счет любого игрока взамен на игровые ценности;<br>Исключение: официальная покупка через сайт.</code>[/SIZE][/FONT][/COLOR]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>',
            prefix: TECHADM_PREFIX,
            status: true,
          },
             {
	     	title: 'ПОКУПКА/ПРОДАЖА.ИВ',
             dpstyle: 'oswald: 3px;     color: #fff; background: #0000FF; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	  content:
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]{{ greeting }} {{ user.name }}.<br><br>[COLOR=rgb(255, 0, 0)]Покупка/Продажи игровой валюты[/COLOR] - это процесс, в момент которого происходит обмен внутриигровой валюты на реальные деньги через сторонние сайты.<br><br>Обмен подобного рода запрещены общими правилами проекта и наказываются согласно пункту 2.28.[/size][/FONT][/COLOR]<br>",
            prefix: TECHADM_PREFIX,
            status: true,
          },
                  {
            title: 'ЧУЖИЕ.ПРИВЯЗКИ',
             dpstyle: 'oswald: 3px;     color: #fff; background: #0000FF; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]К сожалению, обнаружена чужая привязка к вашему аккаунту, что может представлять угрозу для безопасности данных. В данной ситуации нам, к сожалению, не удастся разблокировать ваш аккаунт. Для обеспечения безопасности рекомендуется создать новый аккаунт и принять все возможные меры по защите данных. Наша команда технических специалистов настоятельно рекомендует вам установить дополнительные меры безопасности, такие как двухфакторную аутентификацию, сложные пароли и регулярное обновление паролей. Пожалуйста, будьте внимательны при создании нового аккаунта и храните данные доступа в надежном месте. Мы приносим извинения за возможные неудобства, связанные с этой ситуацией, и стараемся обеспечить безопасность всех наших пользователей[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][size=15px][COLOR=rgb(255, 152, 0)][ICODE]На рассмотрении...[/ICODE][/size][/CENTER][/COLOR]',
            prefix: PIN_PREFIX,
            status: true,
          },
                          {
            title: 'ЧУЖИЕ.ПРИВЯЗКИ.ЗАКРЫТЬ',
             dpstyle: 'oswald: 3px;     color: #fff; background: #0000FF; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	  content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]К сожалению, обнаружена чужая привязка к вашему аккаунту, что может представлять угрозу для безопасности данных. В данной ситуации нам, к сожалению, не удастся разблокировать ваш аккаунт. Для обеспечения безопасности рекомендуется создать новый аккаунт и принять все возможные меры по защите данных. Наша команда технических специалистов настоятельно рекомендует вам установить дополнительные меры безопасности, такие как двухфакторную аутентификацию, сложные пароли и регулярное обновление паролей. Пожалуйста, будьте внимательны при создании нового аккаунта и храните данные доступа в надежном месте. Мы приносим извинения за возможные неудобства, связанные с этой ситуацией, и стараемся обеспечить безопасность всех наших пользователей[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][size=15px][COLOR=rgb(255, 152, 0)][ICODE]На рассмотрении...[/ICODE][/size][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
          },

	{
        title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ⠀ᅠ ᅠ ᅠᅠДля специалистов в направлении логирования  ᅠᅠ ⠀ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	},

                   {
            title: '| логисту |',
               dpstyle: 'oswald: 3px;     color: #fff; background: #0d47a1; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Ваша тема закреплена и передана <u>Техническому Специалисту по Логированию</u> для дальнейшего вердикта,ожидайте ответ в данной теме.<br>Создавать новые темы с данной проблемой — не нужно.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(0, 0, 255)][ICODE]Передано Техническому Специалисту по Логированию[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: TECHADM_PREFIX,
            status: true,
          },
            {
            title: 'ВЗЯЛ.ТЕМУ',
             dpstyle: 'oswald: 3px;     color: #000; background: #00FFFF; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/size]<br><br>" +
             "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Ваша тема взята на рассмотрение.<br>Пожалуйста не создавайте дубликатов.<br>Ответ поступит в ближайшее время.[/size][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][size=15px][COLOR=rgb(255, 152, 0)][ICODE]На рассмотрении...[/ICODE][/size][/CENTER][/COLOR]',
            prefix: TECHADM_PREFIX,
            status: true,
          },
           {
            title: 'ПЕРЕДАНО.КТС/ЗКТС',
               dpstyle: 'oswald: 3px;     color: #000; background: #FFD700; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px] Ваша тема закреплена и ожидает выноса вердикта со стороны руководства технических специалистов. Пожалуйста, ожидайте.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 152, 0)][ICODE]На рассмотрении...[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: PIN_PREFIX,
            status: true,
          },
          {
            title: 'ДУБЛИКАТ',
              dpstyle: 'oswald: 3px;     color: #000; background: #DC143C; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Эта тема является копией вашей предыдущей темы. Пожалуйста, не создавайте похожие или одинаковые темы, иначе [COLOR=rgb(255, 0, 0)] Ваш аккаунт на форуме может быть заблокирован.[/COLOR][/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'НЕ.ПО.ФОРМЕ',
              dpstyle: 'oswald: 3px;     color: #fff; background: #DC143C; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Пожалуйста, заполните форму, создав новую тему. Заголовок темы должен содержать никнейм технического специалиста и отражать основную суть обращения.<br>Пример:<br> Lev_Kalashnikov | Махинации<br>Форма заполнения темы:<code><br>01. Ваш игровой никнейм:<br>02. Игровой никнейм технического специалиста:<br>03. Сервер, на котором Вы играете:<br>04. Описание ситуации (описать максимально подробно и раскрыто):<br>05. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>06. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):</code>[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Отказано[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
                  {
            title: 'НЕ.ПО.ТЕМЕ',
                      dpstyle: 'oswald: 3px;     color: #fff; background: #DC143C; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Ваше обращение не относится к жалобам на технических специалистов. Пожалуйста ознакомьтесь с правилами данного раздела: [URL='https://forum.blackrussia.online/forums/Информация-для-игроков.231/']нажмите[/URL].[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Отказано[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Правила раздела жалоб на тех',
              dpstyle: 'oswald: 3px;     color: #fff; background: #DC143C; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Пожалуйста, убедительная просьба, ознакомиться с назначением данного раздела в котором Вы создали тему, так как Ваш запрос не относится к жалобам на технических специалистов.<br>Что принимается в данном разделе:<br>Жалобы на технических специалистов, оформленные по форме подачи и не нарушающие правила подачи:<br><br>[FONT=verdana][SIZE=15px][COLOR=rgb(226, 80, 65)][U]Правила подачи жалобы на технических специалистов[/U][/COLOR][/SIZE][/FONT][/CENTER]<br>[QUOTE][FONT=verdana][SIZE=15px][COLOR=rgb(226, 80, 65)]01.[/COLOR] Ваш игровой никнейм:[FONT=verdana][SIZE=15px][COLOR=rgb(226, 80, 65)]<br>02.[/COLOR] Игровой никнейм технического специалиста:[COLOR=rgb(226, 80, 65)]<br>03.[/COLOR] Сервер, на котором Вы играете:[COLOR=rgb(226, 80, 65)]<br>04.[/COLOR] Описание ситуации (описать максимально подробно и раскрыто):[COLOR=rgb(226, 80, 65)]<br>05.[/COLOR] Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):[COLOR=rgb(226, 80, 65)]<br>06.[/COLOR] Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/SIZE][/FONT][/SIZE][/QUOTE]<br><br>[FONT=verdana][SIZE=15][FONT=verdana][SIZE=15px][COLOR=rgb(226, 80, 65)]Примечание:[/COLOR] все оставленные заявки обращения в данный раздел обязательно должны быть составлены по шаблону предоставленному немного выше.<br>В ином случае, заявки обращения в данный раздел составленные не по форме — будут отклоняться.<br>Касательно названия заголовка темы — четких правил нет, но, желательно чтобы оно содержало лишь никнейм и сервер технического специалиста.<br>Заранее, настоятельно рекомендуем ознакомиться [U][B][URL='https://forum.blackrussia.online/index.php?forums/faq.231/']с данным разделом[/URL][/B][/U].[/SIZE][/FONT][/SIZE][/FONT]<br><br>[CENTER][FONT=verdana][SIZE=15px][COLOR=rgb(226, 80, 65)][U]Какие жалобы не проверяются?[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[FONT=verdana][SIZE=15px][COLOR=rgb(226, 80, 65)]—[/COLOR] Если в содержании темы присутствует оффтоп/оскорбления.<br>[SIZE=15px][COLOR=rgb(226, 80, 65)]—[/COLOR] Если в заголовке темы отсутствует никнейм технического специалиста.<br>[COLOR=rgb(226, 80, 65)]—[/COLOR] С момента выдачи наказания прошло более 7 дней.[/SIZE][/FONT][/COLOR]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Отказано[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'ПРОШЛО.14.ДНЕЙ',
              dpstyle: 'oswald: 3px;     color: #fff; background: #DC143C; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]С момента вынесения наказания техническим специалистом [COLOR=rgb(255, 255, 255)] прошло более 14 дней.[/COLOR]<br>В настоящее время изменить меру наказания невозможно. Однако Вы можете попробовать написать заявление на обжалование через определенный период времени.<br><br>Обращаем Ваше внимание, что некоторые наказания не подлежат обжалованию или амнистии. Детальнее ознакомиться с критериями можно здесь: [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F-%D0%BD%D0%B0%D1%80%D1%83%D1%88%D0%B5%D0%BD%D0%B8%D1%8F-%D0%BF%D1%80%D0%B8-%D0%B2%D1%8B%D0%B4%D0%B0%D1%87%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F-%D0%BE%D1%82-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%BE%D0%B3%D0%BE-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%B0.7552345/']нажмите[/URL]([/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'ВАМ.В.ТЕХ.РАЗДЕЛ',
              dpstyle: 'oswald: 3px;     color: #fff; background: #DC143C; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Ваша тема не связана с жалобами на работу технических специалистов. Пожалуйста, обратитесь с этим вопросом в технический раздел Вашего сервера.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Отказано[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
                  {
            title: 'БУДЕТ.БАН',
                      dpstyle: 'oswald: 3px;     color: #fff; background: #008000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]После проверки доказательств и системы логирования выношу вердикт: [COLOR=rgb(255, 255, 255)][FONT=Arial]игрок будет заблокирован.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(127, 255, 0)][ICODE]Решено[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: DECIDED_PREFIX,
            status: false,
          },
          {
            title: 'Обжалованию не подлежит',
              dpstyle: 'oswald: 3px;     color: #fff; background: #DC143C; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Блокировка Вашего аккаунта является серьёзным нарушением правил сервера.<br>Вы были заблокированы за серьезное нарушение. Мы не можем уменьшить срок блокировки, аннулировать ее или применить амнистию.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Отказано[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Срок блокировки будет снижен',
              dpstyle: 'oswald: 3px;     color: #fff; background: #DC143C; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Проверив Вашу историю наказаний, принято решение сократить срок блокировки аккаунта.<br>Пожалуйста, в следующий раз будьте внимательнее, второй раз мы не идем навстречу.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'НЕТ.ОКНА.БЛОКИРОВКИ',
              dpstyle: 'oswald: 3px;     color: #fff; background: #DC143C; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
             "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Пожалуйста, прикрепите скриншот окна блокировки. [/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Пожалуйста, создайте новую тему и прикрепите снимок экрана с заблокированного окна, используя фото-хостинги [URL='https://yapx.ru/']yapx.ru[/URL], [URL='https://imgur.com/']imgur.com[/URL], [URL='https://www.youtube.com/']youtube.com[/URL] или [URL='https://imgbb.com']ImgBB.com[/URL] (все кликабетильно).[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Имущество не может быть восстановлено',
              dpstyle: 'oswald: 3px;     color: #fff; background: #DC143C; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Пожалуйста, убедительная просьба, ознакомьтесь с правилами восстановлений: [URL='https://forum.blackrussia.online/index.php?threads/В-каких-случаях-мы-не-восстанавливаем-игровое-имущество.25277/']нажмите[/URL]. Вы создали тему, которая не относится к технической проблеме.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Отказано[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'ПО.ПРОБЛЕМАМ.С.ДОНАТОМ',
              dpstyle: 'oswald: 3px;     color: #fff; background: #DC143C; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Если Вы не получили зачисление BLACK COINS, скорее всего, произошла ошибка при вводе данных. Чтобы проверить, были ли зачислены BLACK COINS, введите в игре команду: [COLOR=rgb(255, 255, 255)]/donat.[/COLOR][/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][B]Пожалуйста, будьте внимательны при совершении покупок.[/B][/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Если Вы уверены, что ошибка невозможна и с момента оплаты прошло не более 14 дней, обязательно обратитесь в службу поддержки для решения проблемы. Вы можете связаться с нами через виджет обратной связи на сайте или через мессенджеры:VK: [URL=' vk.com/br_tech']нажмите[/URL], Telegram: [URL='t.me/br_techBot']нажмите[/URL][/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: DECIDED_PREFIX,
            status: false,
          },
                  {
            title: 'НЕ.БУДЕТ.БАНА',
                      dpstyle: 'oswald: 3px;     color: #fff; background: #DC143C; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]После проверки доказательств и системы логирования выношу вердикт:[COLOR=rgb(255, 255, 255)] недостаточно доказательств для блокировки игрока.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'ИМУЩЕСТВО.БУДЕТ.ВОССТАНОВЛЕНО',
              dpstyle: 'oswald: 3px;     color: #fff; background: #008000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Ваше игровое имущество/денежные средства будут восстановлены в течение двух недель. Убедительная просьба, не менять никнейм до момента восстановления.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
             "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Для активации восстановления используйте команды: [COLOR=rgb(255, 255, 255)] /roulette, /recovery.[/COLOR][/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(127, 255, 0)][ICODE]Решено[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: DECIDED_PREFIX,
            status: false,
          },
          {
            title: 'ПЕРЕУСТАНОВИТЕ.ИГРУ',
              dpstyle: 'oswald: 3px;     color: #fff; background: #008000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Возможно, в файлы вашей игры были внесены изменения или дополнения.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Рекомендуется полностью удалить лаунчер и связанные файлы, а затем установить игру заново с официального сайта: [URL='https://blackrussia.online']нажмите[/URL][/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(127, 255, 0)][ICODE]Рассмотрено[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: DECIDED_PREFIX,
            status: false,
          },
          {
            title: 'СЛИВ.СКЛАДА.ФАМЫ',
              dpstyle: 'oswald: 3px;     color: #000; background: #FFD700; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Не нуждается в техническом вмешательстве.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][size=15px][COLOR=rgb(255, 152, 0)][ICODE]передано Администрации Сервера.[/ICODE][/size][/CENTER][/COLOR]',
            prefix: PIN_PREFIX,
            status: true,
          },
          {
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ         ᅠ⠀⠀ ⠀⠀ᅠ ᅠᅠДля специалистов в направлении Форум  ᅠᅠ ᅠᅠ⠀⠀⠀ ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
    	  },
                  {
            title: 'ОТВЕТ НЕ ПОСТУПИЛ/РЕШЕНО',
              dpstyle: 'oswald: 3px;     color: #000; background: #FFD700; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Мы не дождались от Вас обратной связи! Так понимаем, что Ваша проблема была решена.<br><br>Если Вы вновь столкнетесь с той или иной проблемой или же недоработкой — обязательно обращайтесь в технический раздел. Приятной игры![/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][size=15px][COLOR=rgb(127, 255, 0)][ICODE]Решено.[/ICODE][/size][/CENTER][/COLOR]',
            prefix: DECIDED_PREFIX,
            status: true,
          },
    	  {
            title: 'ФОРМА.ПОДАЧИ',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Пожалуйста, заполните форму, создав новую тему:[/CENTER] <code> <br>01. Ваш игровой никнейм:<br>02. Сервер, на котором Вы играете:<br>03. Суть Вашей возникшей проблемы (описать максимально подробно и раскрыто): <br>04. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>05. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно)</code>[/SIZE][/FONT][/COLOR]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Отказано[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Правила технического раздела',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Пожалуйста, убедительная просьба, ознакомиться с назначением данного раздела в котором Вы создали тему, так как Ваш запрос не относится к технической проблеме.<br>Что принимается в тех разделе:<br>Если возникли технические проблемы, которые так или иначе связаны с игровым модом<br>Форма заполнения:<br>[QUOTE]<br>[FONT=verdana][SIZE=15px][COLOR=rgb(226, 80, 65)]01.[/COLOR] Ваш игровой никнейм:<br>[COLOR=rgb(226, 80, 65)]02.[/COLOR] Сервер, на котором Вы играете:<br>[COLOR=rgb(226, 80, 65)]03.[/COLOR] Суть возникшей проблемы (описать максимально подробно и раскрыто):<br>[COLOR=rgb(226, 80, 65)]04.[/COLOR] Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>[COLOR=rgb(226, 80, 65)]05.[/COLOR] Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/SIZE][/FONT][/QUOTE]<br>[/CENTER]<br><br>[CENTER][FONT=verdana][SIZE=15px][COLOR=rgb(226, 80, 65)][U]Если возникли технические проблемы, которые так или иначе связаны с вылетами из игры и любыми другими проблемами клиента[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[QUOTE]<br>[FONT=verdana][SIZE=15px][COLOR=rgb(226, 80, 65)]01. [/COLOR]Ваш игровой ник:<br>[COLOR=rgb(226, 80, 65)]02. [/COLOR]Сервер:<br>[COLOR=rgb(226, 80, 65)]03.[/COLOR] Тип проблемы: Обрыв соединения | Проблема с ReCAPTCHA | Краш игры (закрытие игры) | Другое [Выбрать один вариант ответа]<br>[COLOR=rgb(226, 80, 65)]04. [/COLOR]Действия, которые привели к этому (при вылетах, по возможности предоставлять место сбоя):<br>[COLOR=rgb(226, 80, 65)]05.[/COLOR] Как часто данная проблема:<br>[COLOR=rgb(226, 80, 65)]06.[/COLOR] Полное название мобильного телефона:<br>[COLOR=rgb(226, 80, 65)]07.[/COLOR] Версия Android:<br>[COLOR=rgb(226, 80, 65)]08. [/COLOR]Дата и время (по МСК):<br>[COLOR=rgb(226, 80, 65)]09. [/COLOR]Связь с Вами по Telegram/VK:[/QUOTE][/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Отказано[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Не относится к тех. разделу',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Ваше обращение не относится к техничекому разделу.<br> Пожалуйста ознакомьтесь с правилами данного раздела: [URL='https://forum.blackrussia.online/forums/Информация-для-игроков.231/']нажмите[/URL].[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Отказано[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Оффтоп',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Ваше обращение содержит контент, который нарушает правила пользования форумом. Пожалуйста, прекратите создавать подобные обращения, иначе Ваш форумный аккаунт может быть наделен статусом временной или постоянной блокировки.<br>Ознакомиться с правилами пользования форумом Вы можете здесь: [URL='https://forum.blackrussia.online/threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BD%D0%B0%D1%85%D0%BE%D0%B6%D0%B4%D0%B5%D0%BD%D0%B8%D1%8F-%D0%BD%D0%B0-%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B5.304564/']нажмите[/URL].[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Проблема решилась',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Благодарим Вас за поддержание обратной связи! Мы искренне рады за то, что Ваша проблема была решена и мы смогли помочь Вам.<br>Если Вы вновь столкнетесь с той или иной проблемой или же недоработкой — обязательно обращайтесь в технический раздел. Приятной игры![/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(127, 255, 0)][ICODE]Решено[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: DECIDED_PREFIX,
            status: false,
          },
          {
            title: 'Отвязка привязок',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Удалить установленные на аккаунт привязки не представляется возможным. В том случае, если на Ваш игровой аккаунт были установлены привязки взломщиком — он будет перманентно заблокирован с причиной «Чужая привязка». В данном случае дальнейшая разблокировка игрового аккаунта невозможна во избежание повторных случаев взлома — наша команда не может быть уверена в том, что злоумышленник не воспользуется установленной им привязкой в своих целях.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Передано направлению логирования',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Ваша тема закреплена и передана <u>техническому специалисту по логированию</u> для дальнейшего вердикта,ожидайте ответ в данной теме. Создавать новые темы с данной проблемой — не нужно. [/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 152, 0)][ICODE]На рассмотрении...[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: TECHADM_PREFIX,
            status: true,
          },
          {
            title: 'Запрос доп. информации',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Для дальнейшего рассмотрения темы, предоставьте:<br><BR>[QUOTE][SIZE=5][FONT=Arial]1. Скриншоты или видео, подтверждающие факт владения этим имуществом.<BR>2. Все детали пропажи: дата, время, после каких действий имущество пропало.<BR>3. Информация о том, как вы изначально получили это имущество:<BR>дата покупки<br>способ приобретения (у игрока, в магазине или через донат;<br>фрапс покупки (если есть);<br>никнейм игрока, у которого было приобретено имущество, если покупка была сделана не в магазине.[/QUOTE] [/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 152, 0)][ICODE]На рассмотрении...[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: PIN_PREFIX,
            status: true,
          },
          {
            title: 'Проблемы с загрузкой форума',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Если вы столкнулись с проблемой загрузки страниц форума, пожалуйста, выполните следующие действия:<br><br>• Откройте Настройки.<br>• Найдите во вкладке Приложения свой браузер, через который вы пользуетесь нашим сайтом форума.<br>• Нажмите на браузер, после чего внизу выберите Очистить -> Очистить Кэш.<br><br>После следуйте данным инструкциям:<br>• Перейдите в настройки браузера.<br>• Выберите Конфиденциальность и безопасность -> Очистить историю.<br>• В основных и дополнительных настройках поставьте галочку в пункте Файлы cookie и данные сайтов.<br>После этого нажмите Удалить данные.<br><br>Ниже прилагаем видео-инструкции описанного процесса для разных браузеров:<br>Для браузера CHROME: https://youtu.be/FaGp2rRru9s<br>Для браузера OPERA: https://youtube.com/shorts/eJOxkc3Br6A?feature=share [/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Вам в жб на специалистов',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Вы получили наказание от технического специалиста Вашего сервера.<br>Вам следует обратиться в раздел «Жалобы на технических специалистов» — в случае, если Вы не согласны с наказанием.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Ссылка на раздел, где можно оформить жалобу на технического специалиста: [URL='https://forum.blackrussia.online/index.php?forums/Жалобы-на-технических-специалистов.490/']нажмите[/URL][/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Отказано[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Передано команде проекта',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Ваша тема закреплена и находится на рассмотрении у команды проекта. Пожалуйста, ожидайте выноса вердикта разработчиков. Создавать новые темы с данной проблемой — не нужно.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 152, 0)][ICODE]На рассмотрении...[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: COMMAND_PREFIX,
            status: true,
          },
          {
            title: 'Проблема известна КП',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Команде проекта уже известно о данной проблеме, она обязательно будет рассмотрена и исправлена. Спасибо за Ваше обращение![/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
                  {
            title: 'Нужны все детали для прошивки',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Для активации какой либо прошивки необходимо поставить все детали данного типа SPORT SPORT+ и т.п.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Не начислили рейтинг за груз',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Наша система построена следующим образом:<br>Рейтинг зависит от поломки автомобиля чем серьёзнее поломка, тем меньше будет засчитан рейтинг.<br>Поломка учитывается вся за время рейса с грузом, в независимости от того если Вы почините Ваш автомобиль, поломка до, будет учтена.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Не является багом',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Проблема, с которой Вы столкнулись, не является недоработкой/ошибкой сервера.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Передача тестерам',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Ваша тема передана на тестирование.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]',
            prefix: PIN_PREFIX,
            status: true,
          },
          {
            title: 'Пропали вещи с аукциона',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Если вы выставили свои вещи на аукцион, а по истечении времени действия лота их никто не купил — воспользуйтесь командой [COLOR=rgb(251, 160, 38)]/reward[/COLOR]<br> В случае отсутствии вещей там — приложите видеофиксацию с использованием команды /time в данном обращении.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 152, 0)][ICODE]На рассмотрении...[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: PIN_PREFIX,
            status: true,
          },
          {
            title: 'Если не работают ссылки',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]По техническим причинам данное действие невозможно, пожалуйста воспользуйтесь копированием ссылки от сюда:<br>[img]https://i.ibb.co/SX77Fgw/photo-2022-08-20-16-31-57.jpg[/img]<br>Если данный способ не помогает, то используйте сервис сокращения ссылок https://clck.ru<br> Либо попробуйте вот так:<br>1) загрузка скриншота биографии на фотохостинг<br>2) в описание прикрепить ссылку с форума<br>3) скопировать пост с фотохостинга<br><br>2 способ:<br>Сократите ссылки для Ваших скриншотов и RP биографии, сделать можно тут goo.su  также Iformation замените на русский текст, просмотрите еще текст полностью и постарайтесь уменьшить такие знаки как !<br>goo.su[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Сервер не отвечает',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Если у Вас встречаются такие проблемы, как «Сервер не отвечает», не отображаются сервера в лаунчере, не удаётся выполнить вход на сайт/форум, попробуйте совершить следующие действия:<br>1) менить IP-адрес любыми средствами<br>2) Переключиться на Wi-Fi/мобильный интернет или на любую доступную сеть<br>3) Использование VPN <br>4) Перезагрузка роутера<br><br>Если методы выше не помогли, то переходим к следующим шагам:<br>1) Устанавливаем приложение «1.1.1.1: Faster & Safer Internet» Ссылка: https://clck.ru/ZP6Av и переходим в него.<br>2)Соглашаемся со всей политикой приложения.<br>3) Нажимаем на ползунок и ждем, когда текст изменится на «Подключено». <br>4) Проверяем: Отображаются ли серверы? Удается ли выполнить вход в игру? Работают ли другие источники (сайт, форум)?[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Включение продемонстрировано на видео: https://youtu.be/Wft0j69b9dk[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
    	{
	  title: '| ЖБ.НА.АДМИНОВ |',
      dpstyle: 'oswald: 3px;     color: #fff; background: #4169E1; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
      content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Вы получили наказание, которое выдал не технический специалист. Обратитесь в раздел жалобы на администрацию - [URL='https://forum.blackrussia.online/forums/Жалобы-на-администрацию.1122/']*Нажмите сюда*[/URL]<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	        prefix: CLOSE_PREFIX,
	        status: false,
           },
          {
            title: 'Вам в жб на игроков',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Данная тема не относится к техническому разделу. Данное действие было совершено игроком и нарушает правила сервера, пожалуйста обратитесь в «Жалобы на игроков» Вашего сервера.<br>Форма подачи жалобы: [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/']нажмите[/URL] [/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Вам в жб на лидеров',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Данная тема не относится к техническому разделу.<br>Данные действия были совершены лидером и нарушают регламент сервера, пожалуйста обратитесь в «Жалобы на лидеров» Вашего сервера.<br>Форма подачи жалобы: [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.3429391/']нажмите[/URL][/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
    	{
	  title: '| ОБЖАЛОВАНИЕ |',
      dpstyle: 'oswald: 3px;     color: #fff; background: #4169E1; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
      content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Вы получили наказание от администратора своего сервера. Для его снижения/обжалования обратитесь в раздел Обжалования - [URL='https://forum.blackrussia.online/forums/Обжалование-наказаний.1125/']*Нажмите сюда*[/URL]<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	        prefix: CLOSE_PREFIX,
	        status: false,
           },
          {
            title: 'Кикнули за ПО',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Уважаемый игрок, если вы были отключены от сервера Античитом<br><br>[COLOR=rgb(255, 0, 0)]Пример[/COLOR]:<br><br> [IMG]https://i.ibb.co/FXXrcVS/image.png[/IMG],<br>пожалуйста, обратите внимания на значения PacketLoss и Ping.<br><br>PacketLoss - минимальное значение 0.000000, максимальное 1.000000. При показателе, выше нуля, это означает, что у вас происходит задержка/потеря передаваемых пакетов информации на сервер. Это означает, что ваш интернет не передает достаточное количество данных из вашего устройства на наш сервер, в следствие чего система отключает вас от игрового процесса.<br><br>Ping - Чем меньше значение в данном пункте, тем быстрее передаются данные на сервер, и наоборот. Если значение выше 100, вы можете наблюдать отставания в игровом процессе из-за нестабильности интернет-соединения.<br><br>Если вы не заметили проблем в данных пунктах, скорее всего - у вас произошел скачек пинга при выполнении действия в игре, в таком случае, античит также отключает игрока из-за подозрения в использовании посторонних программ.<br><br>Решение данной проблемы: постарайтесь стабилизировать ваше интернет-соединение, при необходимости - сообщите о проблемах своему провайдеру (поставщику услуг интернета).[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Нет фото/видеофиксации',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Без доказательств (в частности скриншоты или видео) – решить проблему не получится. Если доказательства найдутся - создайте новую тему, приложив доказательства с фото-хостинга: [URL='https://yapx.ru/']yapx.ru[/URL],[URL='https://imgur.com/']imgur.com[/URL],[URL='https://www.youtube.com/']youtube.com[/URL],[URL='https://imgbb.com']ImgBB.com[/URL](все кликабельно).[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Баг будет исправлен',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Данная недоработка будет проверена и исправлена. Спасибо, ценим Ваш вклад в развите проекта.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(127, 255, 0)][ICODE]Рассмотрено[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: WATCHED_PREFIX,
            status: false,
          },
                  {
            title: 'По предложениям по улучшению',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Ваша тема не относится к технической проблеме, если вы хотите предложить изменения в игровом моде - обратитесь в раздел <br> [URL='https://forum.blackrussia.online/index.php?categories/Предложения-по-улучшению.656/']Предложения по улучшению → нажмите сюда[/URL][/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Ознакомьтесь с правилами восстановления',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Пожалуйста, убедительная просьба, ознакомьтесь с правилами восстановлений: [URL='https://forum.blackrussia.online/index.php?threads/В-каких-случаях-мы-не-восстанавливаем-игровое-имущество.25277/']нажмите[/URL].<br>Вы создали тему, которая не относится к технической проблеме.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Отказано[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'По крашам/вылетам',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Ваш запрос о вылетах был получен. Данные о вылетах отправляются разработчикам автоматически, поэтому дублирование их в техническом разделе не требуется.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Если возникли проблемы с подключением к игре, то в ближайшее время они будут решены. [/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Отказано[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Не выпустило из ФСИН',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Скоро будете выпущены,ожидайте.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Хочу занять должность',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Команда технических специалистов не решает назначение на какую-либо должность, которая присутствует на проекте.<br>Для этого существуют заявления в главном разделе Вашего игрового сервера, где Вы можете ознакомиться с открытыми должностями и формами подач.<br>Приятной игры и желаем удачи в карьерной лестнице![/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Отказано[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'По проблемам с донатом',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Если не были зачислены BLACK COINS — вероятнее всего, была допущена ошибка при вводе реквизитов. К нашему сожалению, из-за большого количества попыток обмана, мы перестали рассматривать подобные обращения. Для проверки зачисления BLACK COINS необходимо ввести в игре команду: /donat.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Вам необходимо быть внимательными при осуществлении покупок.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Если Вы считаете, что ошибки быть не может и с момента оплаты не прошло более 14 дней — в обязательном порядке обратитесь в службу поддержки для дальнейшего решения: На сайте через виджет обратной связи или посредством месенджеров: ВКонтакте: vk.com/br_tech, Telegram: t.me/br_techBot[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: DECIDED_PREFIX,
            status: false,
          },
          {
            title: 'Исчезла статистика аккаунта',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Аккаунт не может пропасть или аннулироваться просто так. Даже если Вы меняете ник, используете кнопки «починить игру» или «сброс настроек» - Ваш аккаунт не удаляется. Система работает иначе.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Проверьте ввод своих данных: пароль, никнейм и сервер. Зачастую игроки просто забывают ввести актуальные данные и считают, что их аккаунт был удален. Будьте внимательны![/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Как ввести никнейм (на случай, если сменили в игре, но не поменяли в клиенте): https://youtu.be/c8rhVwkoFaU [/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(127, 255, 0)][ICODE]Рассмотрено[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
    {
	  title: '-----------------------------------------------------------------------ЖАЛОБЫ-----------------------------------------------------------------------',
	   dpstyle: 'oswald: 3px;     color: #FFFFFF; background: #FF4500; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #0000FF',
	},
        	{
	  title: '| НЕ ЛОГИРУЕТЬСЯ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]По данным доказательствам нельзя выдать наказание игроку. Все нарушения должны быть подтверждены через определенные ресурсы, а не только по предоставленным доказательствам.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| НЕТ.УСЛОВИЯ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]На доказательствах отсутствуют условия сделки - следовательно, рассмотрению не подлежит.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| ОТКАЗ.ДОЛГ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба не подлежит рассмотрению. жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами. Также игровой долг может быть осуществлен ТОЛЬКО через банковский счет.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    	{
	  title: '| ВИРТ.НА.ДОНАТ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Обмен автокейса, покупка доп слота на машину в семью и тд на виртуальную валюту запрещен, соответственно никакого нарушения со стороны игрока нет.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    	{
	  title: '| НЕТ НАРУШЕНИЙ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Исходя из выше приложенных доказательств, нарушения со стороны игрока - не имеется!<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
            {
	  title: '| НЕ ПО ФОРМЕ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба составлена не по форме, пожалуйста ознакомьтесь с правилами подачи жалоб.<br><br>"+
		"[CENTER][B][COLOR=RED]| [URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-игроков.1884531/'][Color=lavender]Правила подачи жалоб[/URL] [COLOR=RED]|<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| НЕТ ДОК-ВО |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Вы не предоставили какие либо доказательства, прикрепите доказательства загруженные на фото/видео хостинг.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| НЕТ НАРУШЕНИЙ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Со стороны игрока не найдены какие либо нарушения, пожалуйста ознакомьтесь с правилами проекта..<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Недостаточно док-во |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Предоставленных доказательств недостаточно для принятие решения, если у вас имеются дополнительные доказательства прикрепите.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
        title: '| ДОКИ в СОЦ.СЕТИ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Доказательства из социальных сетей не принимаются, вам нужно загрузить доказательств на видео/фото хостинги.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
        title: '| Нет тайм-кодов |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Если видеодоказательство длится более 3 минут, Вы должны указать тайм-коды нарушений.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| НЕТУ /time |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]В предоставленных доказательств отсутствует время (/time), не подлежит рассмотрению.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| НУЖЕН ФРАПС |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]В данной ситуации обязательно должен быть фрапс (видео фиксация) всех моментов, в противном случае жалоба будет отказана.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| НЕПОЛНЫЙ ФРАПС/УСЛОВИЯ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Видео запись не полная либо же нет условии сделки, к сожелению мы вынуждены отказать..<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| НЕ РАБОТАЮТ ДОК-ВО |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваши доказательства не рабочие или же битая ссылка, пожалуйста загрузите на видео/фото хостинге.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| ДОКА-ВО ОТРЕДАК.КАЧЕСТВО ПЛОХОЕ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Представленные доказательства были отредактированные или в плохом качестве, пожалуйста прикрепите оригинал.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
        title: '| ОШИБЛИСЬ РАЗДЕЛОМ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Вы ошиблись разделом/сервером, переподайте жалобу в нужный раздел.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| ПРОШЛО 72 ЧАСА |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]С момента совершения нарушения прошло 72 часа, не подлежит рассмотрению.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
        title: '| НЕТ ДОК-В |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]В вашей жалобе отсутствуют доказательства для её рассмотрения. Пожалуйста прикрепите доказательства в хорошем качестве на разрешенных платформах. (Yapix/Imgur/Youtube/Disk)<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: '| От 3 лица |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Жалоба составлена от 3-го лица, следовательно не подлежит рассмотрению.<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
        title: '| НЕДОСТАТОЧНО ДОК-ВА |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Недостаточно доказательств на нарушение от данного игрока.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
        {
	  title: '| НЕПОЛНЫЙ ФРАПС |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваши доказательства обрываются.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: '| Не рабочие док-ва |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Предоставленные доказательства не рабочие, пожалуйста загрузите доказательства на фото/видео хостинге.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: '| СЛИВ.СЕМЬИ.ОТКАЗ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Предоставленных доказательств недостаточно для принятие решения, если у вас имеются дополнительные доказательства прикрепите.<br>"+
	"[B][CENTER][COLOR=lavender] Примечание: в описании семьи должны быть указаны условия взаимодействия со складом. Если лидер семьи предоставил неограниченный доступ к складу и забыл снять его, администрация не несет ответственности за возможные последствия. Жалобы по данному пункту правил принимаются только от лидера семьи.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
            {
	  title: '-----------------------------------------------------------------------Tech Admin-----------------------------------------------------------------------',
	   dpstyle: 'oswald: 3px;     color: #FFFFFF; background: #FF4500; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #0000FF',
	},
        {
	title: 'Законопослушность',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]К сожалению, администрация, технические специалисты и другие должностные лица BLACK RUSSIA не могут повлиять на законопослушность вашего аккаунта.<br>Повысить законопослушность можно тремя способами:<BR><BR>1. Каждый PayDay (00 минут каждого часа) вам начисляется одно очко законопослушности(Если только у вас нету PLATINUM VIP-статуса), если за прошедший час вы отыграли не менее 20 минут.<br>2. Приобрести законопослушность в /donate.<BR>3.На работе "Электрика"(доступна с 12 Игрового Уровня), для этого нужно починить 5 фонарей и тогда вам дадут 5 законопослушности.<br><br>[/CENTER]'+
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
        {
	title: 'Вам в Технический раздел',
	color: 'oswald: 3px; color: #FF69B4; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Ваша тема не как не относится к жалобам на технических специалистов, обратитесь с данной темой в <u>технический раздел вашего сервера</u> - [URL='https://forum.blackrussia.online/index.php?forums/Технический-раздел.22/']клик[/URL]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Нет окна блокировки',
	color: 'oswald: 3px; color: #FF69B4; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Без окна о блокировке тема не подлежит рассмотрению - создайте новую тему, приложив окно блокировки с фото-хостинга<br>[URL='https://yapx.ru/']yapx.ru[/URL],<br>[URL='https://imgur.com/']imgur.com[/URL],<br>[URL='https://www.youtube.com/']youtube.com[/URL],<br>[URL='https://imgbb.com']ImgBB.com[/URL]<br>(все кликабетильно).<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'ДУБЛИРОВАНИЕ',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER][COLOR=rgb(209, 213, 216)]Эта тема является копией вашей предыдущей темы. Пожалуйста, не создавайте похожие или одинаковые темы, иначе [COLOR=rgb(255, 255, 255)] Ваш аккаунт на форуме может быть заблокирован.[/COLOR]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Будете разблокированы',
	color: 'oswald: 3px; color: #FF69B4; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]После дополнительной перепроверки было выявлена ошибка, ваш аккаунт будет разблокирован в течение 24-х часов.<br>[/CENTER]<br>'+
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: PIN_PREFIX,
	status: true,
},
{
	title: 'ПРАВИЛА РАЗДЕЛА',
	color: 'oswald: 3px; color: #FF69B4; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Пожалуйста, убедительная просьба, ознакомиться с назначением данного раздела в котором Вы создали тему, так как Ваш запрос не относится к жалобам на технических специалистов.<br>Что принимается в данном разделе:<br>Жалобы на технических специалистов, оформленные по форме подачи и не нарушающие правила подачи:<br> [FONT=verdana][SIZE=7][COLOR=rgb(226, 80, 65)][U]Правила подачи жалобы на технических специалистов[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[QUOTE][FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]01.[/COLOR] Ваш игровой никнейм:[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]<br>02.[/COLOR] Игровой никнейм технического специалиста:[COLOR=rgb(226, 80, 65)]<br>03.[/COLOR] Сервер, на котором Вы играете:[COLOR=rgb(226, 80, 65)]<br>04.[/COLOR] Описание ситуации (описать максимально подробно и раскрыто):[COLOR=rgb(226, 80, 65)]<br>05.[/COLOR] Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):[COLOR=rgb(226, 80, 65)]<br>06.[/COLOR] Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/SIZE][/FONT][/SIZE][/QUOTE]<br><br>[FONT=verdana][SIZE=4][FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]Примечание:[/COLOR] все оставленные заявки обращения в данный раздел обязательно должны быть составлены по шаблону предоставленному немного выше.<br>В ином случае, заявки обращения в данный раздел составленные не по форме — будут отклоняться.<br>Касательно названия заголовка темы — четких правил нет, но, желательно чтобы оно содержало лишь никнейм и сервер технического специалиста.<br>Заранее, настоятельно рекомендуем ознакомиться [U][B][URL='https://forum.blackrussia.online/index.php?forums/faq.231/']с данным разделом[/URL][/B][/U][/SIZE][/FONT][/SIZE][/FONT]<br>[CENTER][FONT=verdana][SIZE=7][COLOR=rgb(226, 80, 65)][U]Какие жалобы не проверяются?[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]—[/COLOR] Если в содержании темы присутствует оффтоп/оскорбления.<br>[SIZE=4][COLOR=rgb(226, 80, 65)]—[/COLOR] Если в заголовке темы отсутствует никнейм технического специалиста.<br>[COLOR=rgb(226, 80, 65)]—[/COLOR] С момента выдачи наказания прошло более 7 дней.[/SIZE][/SIZE][/FONT]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Срок подачи жб',
	color: 'oswald: 3px; color: #FF69B4; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]С момента вынесения наказания техническим специалистом [COLOR=rgb(255, 255, 255)] прошло более 14 дней.[/COLOR]<br>В настоящее время изменить меру наказания невозможно. Однако Вы можете попробовать написать заявление на обжалование через определенный период времени.<br><br>Обращаем Ваше внимание, что некоторые наказания не подлежат обжалованию или амнистии. Детальнее ознакомиться с критериями можно здесь: [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F-%D0%BD%D0%B0%D1%80%D1%83%D1%88%D0%B5%D0%BD%D0%B8%D1%8F-%D0%BF%D1%80%D0%B8-%D0%B2%D1%8B%D0%B4%D0%B0%D1%87%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F-%D0%BE%D1%82-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%BE%D0%B3%D0%BE-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%B0.7552345/']нажмите[/URL]([/SIZE][/FONT][/COLOR][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Восст.доступа к аккаунту',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Если Вы обезопасили Ваш аккаунт и [U]привязали его к странице во ВКонтакте[/U], то сбросить пароль или пин-код Вы всегда сможете обратившись в официальное сообщество проекта - https://vk.com/blackrussia.online.<br> Либо в телеграмм бот - https://t.me/br_helper_bot.<br> Напишите «Начать» в личные сообщения группы/бота, затем выберите нужные Вам функции.<br><br>" +
	"[CENTER][FONT=Verdana]Подробнее в данной теме - [URL='https://forum.blackrussia.online/index.php?threads/lime-Защита-игрового-аккаунта.1201253/']клик[/URL][/center]<br><br>" +
	"[CENTER]Если Вы обезопасили Ваш аккаунт и [U]привязали его к почте[/U], то сбросить пароль или пин-код Вы всегда сможете при вводе пароля на сервере. После подключения к серверу нажмите на кнопку «Войти в аккаунт», затем выберите кнопку «Восстановить пароль», после чего на Вашу почту будет отправлено письмо с одноразовым кодом восстановления.<br><br>" +
	"[CENTER]Если Вы [U]не обезопасили свой аккаунт - его невозможно вернуть[/U] Игрок самостоятельно несет отвественность за безопаность своего аккаунта.<br><br>" +
	'[CENTER]К сожалению, иногда решение подобных вопросов требует много времени. Надеемся, что Вы сможете восстановить доступ к аккаунту!<br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[center][COLOR=rgb(127, 255, 0)]Рассмотрено[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: WATCHED_PREFIX,
	status: false,
},
{
	title: 'Правила восстановления',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Пожалуйста, убедительная просьба, ознакомьтесь с правилами восстановлений - [URL='https://forum.blackrussia.online/index.php?threads/В-каких-случаях-мы-не-восстанавливаем-игровое-имущество.25277/']клик[/URL]<br> Вы создали тему, которая не относится к технической проблеме.[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
    title: 'Донат',
	color: '',
    content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
    '[CENTER]Система построена таким образом, что деньги не спишутся, пока наша платформа не уведомит платежную систему о зачислении BLACK COINS. Для проверки зачисления BLACK COINS необходимо ввести в игре команду: /donat.<br>' +
    '[CENTER]В остальных же случаях, если не были зачислены BLACK COINS — вероятнее всего, была допущена ошибка при вводе реквизитов. <br>В данном случае мы не восстанавливаем денежные средства согласно нашей политике оферты - "[URL="https://blackrussia.online/oferta.php"]клик[/URL] <br>' +
    '[CENTER]Если Вы считаете, что ошибки быть не может и с момента оплаты не прошло более 24-х часов, то в обязательном порядке обратитесь в данное сообщество для дальнейшего решения: https://vk.com/br_tech.<br>' +
    '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][I]Решено[/I][/CENTER][/FONT][/SIZE]',
    prefix: DECIDED_PREFIX,
    status: false,
},
{
	title: 'Имущество восстановлено',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Ваше игровое имущество/денежные средства будут восстановлены в течение двух недель. <br>Убедительная просьба, <b><u>не менять никнейм до момента восстановления</u></b>.<br>" +
	'[CENTER]Для активации восстановления используйте команды:[COLOR=rgb(255, 213, 51)]/roulette[/COLOR], [COLOR=rgb(255, 213, 51)]/recovery[/COLOR][/CENTER]<br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(127, 255, 0)]Решено[/COLOR][/CENTER][/FONT][/SIZE]',
	status: false,
	prefix: DECIDED_PREFIX,
},
{
	title: 'НЕ ОТНОСИТСЯ',
	color: 'oswald: 3px; color: #FF69B4; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Ваше обращение не относится к жалобам на технических специалистов.<br> Пожалуйста ознакомьтесь с праивилами данного раздела: [URL='https://forum.blackrussia.online/forums/Информация-для-игроков.231/']клик[/URL] <br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Игрок будет заблокирован(Жб игроков)',
	color: 'oswald: 3px; color: #FF69B4; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER][SIZE=4][FONT=Verdana]После проверки доказательств и системы логирования вердикт:<br><br>[COLOR=rgb(65, 168, 95)][FONT=verdana]Игрок будет заблокирован[/COLOR][/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER][SIZE=4][FONT=Verdana][I][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/CENTER]",
},
{
	title: 'Игрок не будет заблокирован(Жб игроков)',
	color: 'oswald: 3px; color: #FF69B4; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER][SIZE=4][FONT=Verdana]После проверки доказательств и системы логирования вердикт:<br><br>[COLOR=rgb(255, 0, 0)]Доказательств недостаточно для блокировки игрока[/COLOR][/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER][SIZE=4][FONT=Verdana][I][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/CENTER]",
},
            {
	  title: '-----------------------------------------------------------------------Tech Форму-----------------------------------------------------------------------',
	   dpstyle: 'oswald: 3px;     color: #FFFFFF; background: #FF4500; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #0000FF',
	},
{
	title: 'ЖБ на ТЕХОВ',
	color: 'oswald: 3px; color: #FF69B4; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Вы получили наказание от технического специалиста Вашего сервера.<br>Вам следует обратиться в раздел «Жалобы на технических специалистов» — в случае, если Вы не согласны с наказанием.<br><br>' +
	"[CENTER]Ссылка на раздел, где можно оформить жалобу на технического специалиста - [URL='https://forum.blackrussia.online/index.php?forums/Жалобы-на-технических-специалистов.490/']клик[/URL] <br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Нет скринов/видео',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Без доказательств (в частности скриншоты или видео) – решить проблему не получится. Если доказательства найдутся - создайте новую тему, приложив доказательства с фото-хостинга<br>[URL='https://yapx.ru/']yapx.ru[/URL],<br>[URL='https://imgur.com/']imgur.com[/URL],<br>[URL='https://www.youtube.com/']youtube.com[/URL],<br>[URL='https://imgbb.com']ImgBB.com[/URL]<br>(все кликабельно).<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'ПРАВИЛА РАЗДЕЛА',
	color: 'oswald: 3px; color: #FF69B4; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Пожалуйста, убедительная просьба, ознакомиться с назначением данного раздела в котором Вы создали тему, так как Ваш запрос не относится к технической проблеме.<br>Что принимается в тех разделе:<br>Если возникли технические проблемы, которые так или иначе связаны с игровым модом<br>Форма заполнения:<br>[QUOTE]<br>[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]01.[/COLOR] Ваш игровой никнейм:<br>[COLOR=rgb(226, 80, 65)]02.[/COLOR] Сервер, на котором Вы играете:<br>[COLOR=rgb(226, 80, 65)]03.[/COLOR] Суть возникшей проблемы (описать максимально подробно и раскрыто):<br>[COLOR=rgb(226, 80, 65)]04.[/COLOR] Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>[COLOR=rgb(226, 80, 65)]05.[/COLOR] Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/SIZE][/FONT][/QUOTE]<br>[/CENTER]<br><br>[CENTER][FONT=verdana][SIZE=7][COLOR=rgb(226, 80, 65)][U]Если возникли технические проблемы, которые так или иначе связаны с вылетами из игры и любыми другими проблемами клиента[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[QUOTE]<br>[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]01. [/COLOR]Ваш игровой ник:<br>[COLOR=rgb(226, 80, 65)]02. [/COLOR]Сервер:<br>[COLOR=rgb(226, 80, 65)]03.[/COLOR] Тип проблемы: Обрыв соединения | Проблема с ReCAPTCHA | Краш игры (закрытие игры) | Другое [Выбрать один вариант ответа]<br>[COLOR=rgb(226, 80, 65)]04. [/COLOR]Действия, которые привели к этому (при вылетах, по возможности предоставлять место сбоя):<br>[COLOR=rgb(226, 80, 65)]05.[/COLOR] Как часто данная проблема:<br>[COLOR=rgb(226, 80, 65)]06.[/COLOR] Полное название мобильного телефона:<br>[COLOR=rgb(226, 80, 65)]07.[/COLOR] Версия Android:<br>[COLOR=rgb(226, 80, 65)]08. [/COLOR]Дата и время (по МСК):<br>[COLOR=rgb(226, 80, 65)]09. [/COLOR]Связь с Вами по Telegram/VK:[/SIZE][/FONT][/QUOTE]" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},

{
	title: "Проблемы с Кешом",
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[center]Если вы столкнулись с проблемой загрузки страниц форума, пожалуйста, выполните следующие действия:<br><br>• Откройте "Настройки".<br>• Найдите во вкладке "Приложения" свой браузер, через который вы пользуетесь нашим сайтом форума.<br>• Нажмите на браузер, после чего внизу выберите "Очистить" -> "Очистить Кэш".<br><br>После следуйте данным инструкциям:<br>• Перейдите в настройки браузера.<br>• Выберите "Конфиденциальность и безопасность" -> "Очистить историю".<br>• В основных и дополнительных настройках поставьте галочку в пункте "Файлы cookie и данные сайтов".<br>После этого нажмите "Удалить данные".<br><br>Ниже прилагаем видео-инструкции описанного процесса для разных браузеров:<br>Для браузера CHROME: https://youtu.be/FaGp2rRru9s<br>Для браузера OPERA: https://youtube.com/shorts/eJOxkc3Br6A?feature=share'+
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Для ошибок во время ОБТ на IOS',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Если вы нашли какую-либо ошибку во время Открытого Бэта Тестирования на IOS то сделайте следующие действия.<br><br>1. Отправьте пожалуйста найденную недоработку в данную форму - [URL="https://forms.gle/4adcNvKisfKF59Fi8"]клик[/URL]<br>2. Передайте данную форму своим друзьям, для ускорения процесса по сбору багов для их исправления.<br><br>Спасибо за ваш вклад в развитие игры!<br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: "Баг со штрафами",
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[center]У вас произошла ошибка со штрафами, для её исправления вам нужно совершить проезд на красный свет, переехать через сплошную и оплатить все штрафы в банке.<br>Тогда данный баг пропадет, Команде Проекта известно о данной недоработке и активно ведется иправление.<br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Известно КП',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Команде проекта уже известно о данной проблеме, она обязательно будет рассмотрена и исправлена. Спасибо за Ваше обращение!<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'пропали все темы из раздела Жалобы',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Раздел "Жалобы" переведен в приватный режим, а именно:<br>Тему созданную пользователем пожет видеть <b>он сам</b> и <b>Администрация сервера</b>.<br>Ознакомиться с формой подачи тем в тот или иной раздел можно по данной ссылке: [URL="https://forum.blackrussia.online/index.php?forums/Правила-подачи-жалоб.202/"]клик[/URL]<br>Приятного времяпрепровождения на нашем форуме<br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Не является багом',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Проблема с которой вы столкнулись не является багом, ошибкой сервера.<br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},

{
	title: 'Слетел аккаунт',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Аккаунт не может пропасть или аннулироваться просто так. Даже если Вы меняете ник, используете кнопки «починить игру» или «сброс настроек» - Ваш аккаунт не удаляется. Система работает иначе.<br><br>" +
	"[CENTER]Проверьте ввод своих данных: пароль, никнейм и сервер. Зачастую игроки просто забывают ввести актуальные данные и считают, что их аккаунт был удален. Будьте внимательны!" +
	'[CENTER]Как ввести никнейм (на случай, если сменили в игре, но не поменяли в клиенте): https://youtu.be/c8rhVwkoFaU [/CENTER] <br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][I]Рассмотрено[/I][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Будет исправленно',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Данная недоработка будет проверена и исправлена.<br> Спасибо, ценим Ваш вклад в развите проекта.<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][I]Рассмотрено[/I][/CENTER][/FONT][/SIZE]',
	prefix: WATCHED_PREFIX,
	status: false,
},
{
	title: 'Правила восстановления',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Пожалуйста, убедительная просьба, ознакомьтесь с правилами восстановлений - [URL='https://forum.blackrussia.online/index.php?threads/В-каких-случаях-мы-не-восстанавливаем-игровое-имущество.25277/']клик[/URL]<br>Вы создали тему, которая не относится к технической проблеме.[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/CENTER]/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
// {
// 	title: 'Баг ФСИН(не выпустило)',
// 	content:
// 	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
// 	'[CENTER]Скоро будете выпущены,ожидайте.[/CENTER][/FONT][/SIZE]',
// 	prefix: CLOSE_PREFIX,
// 	status: false,
// },
{
	title: 'Улучшения для серверов',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Ваша тема не относится к технической проблеме, если вы хотите предложить изменения в игровом моде - обратитесь в раздел <br> [URL="https://forum.blackrussia.online/index.php?categories/Предложения-по-улучшению.656/"] Предложения по улучшению → нажмите сюда[/URL]<br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/CENTER][/FONT][/SIZE]' ,
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Вам нужны все прошивки',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER] Для активации какой либо прошивки необходимо поставить все детали данного типа "SPORT" "SPORT+" и т.п.<br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'ТЕСТЕРАМ',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Ваша тема передана на тестирование.[/CENTER][/FONT][/SIZE]" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>',
	prefix: WAIT_PREFIX,
	status: false,
},
{
	title: 'Ответ от ТЕСТЕРОВ',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Ответ от тестерского отдела дан выше.<br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Пропали вещи с аукциона',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Если вы выставили свои вещи на аукцион а их никто не купил, то воспользуйтесь командой [COLOR=rgb(251, 160, 38)]/reward[/COLOR]<br> В случае отсутствии вещей там, приложите скриншоты с + /time в новой теме<br>'+
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Если не работают ссылки',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]По техническим причинам данное действие невозможно, пожалуйста воспользуйтесь копированием ссылки от сюда:<br>[img]https://i.ibb.co/SX77Fgw/photo-2022-08-20-16-31-57.jpg[/img]<br>Если данный способ не помогает, то используйте сервис сокращения ссылок https://clck.ru<br> Либо попробуйте вот так:<br>1) загрузка скриншота биографии на фотохостинг<br>2) в описание прикрепить ссылку с форума<br>3) скопировать пост с фотохостинга<br><br>2 способ:<br>Сократите ссылки для Ваших скриншотов и RP биографии, сделать можно тут goo.su  также Iformation замените на русский текст, просмотрите еще текст полностью и постарайтесь уменьшить такие знаки как !?<br>goo.su[/CENTER]<br>"+
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
        	{
		title: 'Взято на рассмотрение',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Ваша тема взята на рассмотрение, ожидайте ответ в ближайшее время<br>Часто рассмотрение темы может занять определенное время.<br>[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении[/COLOR][/CENTER][/FONT][/SIZE]',
		prefix: PIN_PREFIX,
		status: true,
	},
	{
		title: 'Ожидайте вердикта руководства',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша тема закреплена и ожидает вердикта <u>моего руководства.</u>.<br>" +
		'[CENTER]<u>Создавать подобные темы не нужно</u>.<br>[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении[/COLOR][/CENTER][/FONT][/SIZE]',
		prefix: PIN_PREFIX,
		status: true,
	},
	{
		title: 'Дублированное обращение',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема является <u>дубликатом вашей предыдущей темы</u>.<br>Пожалуйста, <u><b>прекратите создавать идентичные или похожие темы - иначе Ваш форумный аккаунт может быть заблокирован</b></u>.<br><br>" +
		'[CENTER][I][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Аккаунт будет разблокирован',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Ваша жалоба переадресована моему руководству.<br>По выносу вердикта ваш аккаунт может быть разблокирован.<br>Ожидайте ответа в данной теме, копии создавать не нужно.<br>[/CENTER]<br>'+
		'[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении[/COLOR][/CENTER][/FONT][/SIZE]',
		prefix: PIN_PREFIX,
		status: true,
	},
	{
		title: 'Форма подачи жб на тех.',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Пожалуйста, заполните форму, создав новую тему: Название темы с NickName технического специалиста<br>Пример:<br> Lev_Kalashnikov | махинации<br>Форма заполнения темы:<br>[code]01. Ваш игровой никнейм:<br>02. Игровой никнейм технического специалиста:<br>03. Сервер, на котором Вы играете:<br>04. Описание ситуации (описать максимально подробно и раскрыто):<br>05. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>06. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/code]<br>" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Отказано[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Правила раздела жалоб на тех.',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Пожалуйста, убедительная просьба, ознакомиться с назначением данного раздела в котором Вы создали тему, так как Ваш запрос не относится к жалобам на технических специалистов.<br>Что принимается в данном разделе:<br>Жалобы на технических специалистов, оформленные по форме подачи и не нарушающие правила подачи:<br> [FONT=verdana][SIZE=7][COLOR=rgb(226, 80, 65)][U]Правила подачи жалобы на технических специалистов[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[QUOTE][FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]01.[/COLOR] Ваш игровой никнейм:[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]<br>02.[/COLOR] Игровой никнейм технического специалиста:[COLOR=rgb(226, 80, 65)]<br>03.[/COLOR] Сервер, на котором Вы играете:[COLOR=rgb(226, 80, 65)]<br>04.[/COLOR] Описание ситуации (описать максимально подробно и раскрыто):[COLOR=rgb(226, 80, 65)]<br>05.[/COLOR] Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):[COLOR=rgb(226, 80, 65)]<br>06.[/COLOR] Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/SIZE][/FONT][/SIZE][/QUOTE]<br><br>[FONT=verdana][SIZE=4][FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]Примечание:[/COLOR] все оставленные заявки обращения в данный раздел обязательно должны быть составлены по шаблону предоставленному немного выше.<br>В ином случае, заявки обращения в данный раздел составленные не по форме — будут отклоняться.<br>Касательно названия заголовка темы — четких правил нет, но, желательно чтобы оно содержало лишь никнейм и сервер технического специалиста.<br>Заранее, настоятельно рекомендуем ознакомиться [U][B][URL='https://forum.blackrussia.online/index.php?forums/faq.231/']с данным разделом[/URL][/B][/U].[/SIZE][/FONT][/SIZE][/FONT]<br>[CENTER][FONT=verdana][SIZE=7][COLOR=rgb(226, 80, 65)][U]Какие жалобы не проверяются?[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]—[/COLOR] Если в содержании темы присутствует оффтоп/оскорбления.<br>[SIZE=4][COLOR=rgb(226, 80, 65)]—[/COLOR] Если в заголовке темы отсутствует никнейм технического специалиста.<br>[COLOR=rgb(226, 80, 65)]—[/COLOR] С момента выдачи наказания прошло более 7 дней.[/SIZE][/SIZE][/FONT]<br>" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Отказано[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Срок подачи жалоб',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]С момента выдачи наказания от технического специалиста прошло более 7-ми дней.<br>Пересмотр/изменение меры наказания новозможно, вы можете попробывать написать обжалование через N-ый промежуток времени.<br><br>Обращаем ваше внимание на то, что некоторые наказания не подлежат не обжалованию,амнистии.[/center]<br><br>'+
		'[CENTER][I][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Нужны доказательства на отс. трансфера',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER] Доказать отсутствие трансфера можно доказать одним способом.<br>Вы должны взять 2 устройства, зайти на аккаунты и сделать фотографию окон блокировки на двух устройствах.<br><br><u>Важно, чтобы в кадр попало 2 устройства и окна блокировки.</u><br>Ожидаю вашего ответа. [/CENTER]<br><br>'+
		'[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении[/COLOR][/CENTER][/FONT][/SIZE]',
		prefix: PIN_PREFIX,
		status: true,
	},
	{
		title: 'Вам в технический раздел',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша тема не как не относится к жалобам на технических специалистов, обратитесь с данной темой в <u>технический раздел вашего сервера</u> - [URL='https://forum.blackrussia.online/index.php?forums/Технический-раздел.22/']клик[/URL]<br><br>" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Отказано[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Обжалованию не подлежит',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Блокировка вашего аккаунта содержит серьёзное нарушение правил сервера.<br>Вы получили блокировку за серьезное нарушение, мы не в силах снизить срок вашего наказания/обнулить/амнистировать вас.<br>" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Срок блокировки будет снижен',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Проверив вашу историю наказаний, было принято решение о снижении срока блокировки аккаунта.<br>Будьте аккуратнее в следующие разы, ведь на встречу пойти мы врятли сможем.<br>" +
		'[CENTER][CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR].[/CENTER][/FONT][/SIZE]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Как восстановить доступ к аккаунту',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Если Вы обезопасили Ваш аккаунт и [U]привязали его к странице во ВКонтакте[/U], то сбросить пароль или пин-код Вы всегда сможете обратившись в официальное сообщество проекта - https://vk.com/blackrussia.online.<br> Либо в телеграмм бот - https://t.me/br_helper_bot.<br> Напишите «Начать» в личные сообщения группы/бота, затем выберите нужные Вам функции.<br><br>" +
		"[CENTER][FONT=Veranda]Подробнее в данной теме - [URL='https://forum.blackrussia.online/index.php?threads/lime-Защита-игрового-аккаунта.1201253/']клик[/URL][/center]<br><br>" +
		"[CENTER]Если Вы обезопасили Ваш аккаунт и [U]привязали его к почте[/U], то сбросить пароль или пин-код Вы всегда сможете при вводе пароля на сервере. После подключения к серверу нажмите на кнопку «Войти в аккаунт», затем выберите кнопку «Восстановить пароль», после чего на Вашу почту будет отправлено письмо с одноразовым кодом восстановления.<br><br>" +
		"[CENTER]Если Вы [U]не обезопасили свой аккаунт - его невозможно вернуть[/U]. Игрок самостоятельно несет отвественность за безопаность своего аккаунта.<br><br>" +
		'[CENTER]К сожалению, иногда решение подобных вопросов требует много времени. Надеемся, что Вы сможете восстановить доступ к аккаунту!<br>' +
		'[I][COLOR=rgb(127, 255, 0)]Рассмотрено[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: WATCHED_PREFIX,
		status: false,
	},
	{
		title: 'Нет окна блокировки',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Без окна о блокировке тема не подлежит рассмотрению - создайте новую тему, приложив окно блокировки с фото-хостинга<br>[URL='https://yapx.ru/']yapx.ru[/URL],<br>[URL='https://imgur.com/']imgur.com[/URL],<br>[URL='https://www.youtube.com/']youtube.com[/URL],<br>[URL='https://imgbb.com']ImgBB.com[/URL]<br>(все кликабетильно).<br>" +
		'[CENTER][CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR].[/CENTER][/FONT][/SIZE]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Имущество не может быть восстановлено',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Пожалуйста, убедительная просьба, ознакомьтесь с правилами восстановлений - [URL='https://forum.blackrussia.online/index.php?threads/В-каких-случаях-мы-не-восстанавливаем-игровое-имущество.25277/']клик[/URL].<br> Вы создали тему, которая не относится к технической проблеме.[/CENTER]<br><br>" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Отказано[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
        title: 'По проблемам с донатом',
        content:
        '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
        '[CENTER]Если не были зачислены BLACK COINS — вероятнее всего, была допущена ошибка при вводе реквизитов. К нашему сожалению, из-за большого количества попыток обмана, мы перестали рассматривать подобные обращения. Для проверки зачисления BLACK COINS необходимо ввести в игре команду: /donat.<br><br>' +
        '[CENTER][I]Вам необходимо быть внимательными при осуществлении покупок.[/I]<br>' +
        '[CENTER]Если Вы считаете, что ошибки быть не может и с момента оплаты не прошло более 14 дней — в обязательном порядке обратитесь в службу поддержки для дальнейшего решения: На сайте через виджет обратной связи или посредством месенджеров: ВКонтакте: vk.com/br_tech, Telegram: t.me/br_techBot<br><br>' +
        '[CENTER][COLOR=rgb(255,0,0)]Закрыто[/COLOR].[/CENTER][/FONT][/SIZE]',
      prefix: DECIDED_PREFIX,
      status: false,
	},
	{
		title: 'Имущество будет восстановлено',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваше игровое имущество/денежные средства будут восстановлены в течение двух недель. <br>Убедительная просьба, <b><u>не менять никнейм до момента восстановления</u></b>.<br>" +
		'[CENTER]Для активации восстановления используйте команды:[COLOR=rgb(255, 213, 51)]/roulette[/COLOR], [COLOR=rgb(255, 213, 51)]/recovery[/COLOR].[/CENTER]<br>' +
		'[CENTER][COLOR=rgb(127, 255, 0)]Решено[/COLOR].[/CENTER][/FONT][/SIZE]',
		status: false,
		prefix: DECIDED_PREFIX,
	},
	{
		title: 'Переустановите игру',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Возможно в файлах вашей игры присутствуют постороннее оборудование(дополнения/изменения).<br>" +
		"[CENTER]Рекомендуется удалить полностью лаунчер и связанные с ним файлы и установить игру заново с официального сайта - [URL='https://blackrussia.online']Клик[/URL].<br>" +
		'[CENTER][I][COLOR=rgb(127, 255, 0)]Рассмотрено[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: DECIDED_PREFIX,
		status: false,
	},
	{
		title: 'Не относится к жалобам на тех.',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваше обращение не относится к жалобам на технических специалистов.<br> Пожалуйста ознакомьтесь с правилами данного раздела: [URL='https://forum.blackrussia.online/forums/Информация-для-игроков.231/']клик[/URL] <br>" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Отказано[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Игрок будет заблокирован',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER][SIZE=4][FONT=Veranda]После проверки доказательств и системы логирования вердикт:<br><br>[COLOR=rgb(65, 168, 95)][FONT=verdana]Игрок будет заблокирован[/COLOR][/CENTER]<br><br>" +
		"[CENTER][SIZE=4][FONT=Veranda][I][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/I].[/FONT][/CENTER]",
	},
	{
		title: 'Игрок не будет заблокирован',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER][SIZE=4][FONT=Veranda]После проверки доказательств и системы логирования вердикт:<br><br>[COLOR=rgb(255, 0, 0)]Доказательств недостаточно для блокировки игрока[/COLOR].[/CENTER]<br><br>" +
		"[CENTER][SIZE=4][FONT=Veranda][I][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/I].[/FONT][/CENTER]",
	},
	{
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ         ᅠ⠀⠀ ⠀⠀ᅠ ᅠᅠДля специалистов в направлении Форум  ᅠᅠ ᅠᅠ⠀⠀⠀ ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	},
	{
		title: 'Форма подачи',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Пожалуйста, заполните форму, создав новую тему: <br>[CODE]01. Ваш игровой никнейм:<br>02. Сервер, на котором Вы играете:<br>03. Суть Вашей возникшей проблемы (описать максимально подробно и раскрыто): <br>04. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>05. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/CODE]<br><br>" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Отказано[/COLOR][/CENTER][/I].[/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Правила технического раздела',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Пожалуйста, убедительная просьба, ознакомиться с назначением данного раздела в котором Вы создали тему, так как Ваш запрос не относится к технической проблеме.<br>Что принимается в тех разделе:<br>Если возникли технические проблемы, которые так или иначе связаны с игровым модом<br>Форма заполнения:<br>[QUOTE]<br>[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]01.[/COLOR] Ваш игровой никнейм:<br>[COLOR=rgb(226, 80, 65)]02.[/COLOR] Сервер, на котором Вы играете:<br>[COLOR=rgb(226, 80, 65)]03.[/COLOR] Суть возникшей проблемы (описать максимально подробно и раскрыто):<br>[COLOR=rgb(226, 80, 65)]04.[/COLOR] Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>[COLOR=rgb(226, 80, 65)]05.[/COLOR] Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/SIZE][/FONT][/QUOTE]<br>[/CENTER]<br><br>[CENTER][FONT=verdana][SIZE=7][COLOR=rgb(226, 80, 65)][U]Если возникли технические проблемы, которые так или иначе связаны с вылетами из игры и любыми другими проблемами клиента[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[QUOTE]<br>[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]01. [/COLOR]Ваш игровой ник:<br>[COLOR=rgb(226, 80, 65)]02. [/COLOR]Сервер:<br>[COLOR=rgb(226, 80, 65)]03.[/COLOR] Тип проблемы: Обрыв соединения | Проблема с ReCAPTCHA | Краш игры (закрытие игры) | Другое [Выбрать один вариант ответа]<br>[COLOR=rgb(226, 80, 65)]04. [/COLOR]Действия, которые привели к этому (при вылетах, по возможности предоставлять место сбоя):<br>[COLOR=rgb(226, 80, 65)]05.[/COLOR] Как часто данная проблема:<br>[COLOR=rgb(226, 80, 65)]06.[/COLOR] Полное название мобильного телефона:<br>[COLOR=rgb(226, 80, 65)]07.[/COLOR] Версия Android:<br>[COLOR=rgb(226, 80, 65)]08. [/COLOR]Дата и время (по МСК):<br>[COLOR=rgb(226, 80, 65)]09. [/COLOR]Связь с Вами по Telegram/VK:[/SIZE][/FONT][/QUOTE]" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Отказано[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
    {
		title: 'Не относится к тех. разделу',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваше обращение не относится к техничекому разделу.<br> Пожалуйста ознакомьтесь с правилами данного раздела: [URL='https://forum.blackrussia.online/forums/Информация-для-игроков.231/']клик[/URL] <br>" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Отказано[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
    {
		title: 'Оффтоп',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваше обращение содержит контент, который нарушает правила пользования форумом. Пожалуйста, прекратите создавать подобные обращения, иначе Ваш форумный аккаунт может быть наделен статусом временной или постоянной блокировки.<br>Ознакомиться с правилами пользования форумом Вы можете здесь: [URL='https://forum.blackrussia.online/threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BD%D0%B0%D1%85%D0%BE%D0%B6%D0%B4%D0%B5%D0%BD%D0%B8%D1%8F-%D0%BD%D0%B0-%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B5.304564/']клик[/URL] <br>" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
    {
		title: 'Проблема решилась',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Благодарим Вас за поддержание обратной связи! Мы искренне рады за то, что Ваша проблема была решена и мы смогли помочь Вам.<br>Если Вы вновь столкнетесь с той или иной проблемой или же недоработкой — обязательно обращайтесь в технический раздел. Приятной игры!<br><br>" +
		'[CENTER][I][COLOR=rgb(0,255,0)]Решено[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: DECIDED_PREFIX,
		status: false,
	},
    {
		title: 'Отвязка привязок',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Удалить установленные на аккаунт привязки не представляется возможным. В том случае, если на Ваш игровой аккаунт были установлены привязки взломщиком — он будет перманентно заблокирован с причиной «Чужая привязка». В данном случае дальнейшая разблокировка игрового аккаунта невозможна во избежание повторных случаев взлома — наша команда не может быть уверена в том, что злоумышленник не воспользуется установленной им привязкой в своих целях. <br><br>" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Передано направлению логирования',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша тема закреплена и передана <u>Техническому специалисту по логированию</u> для дальнейшего вердикта,ожидайте ответ в данной теме.<br><br>" +
		'[CENTER]Создавать новые темы с данной проблемой — не нужно.[/CENTER][/FONT][/SIZE]',
		prefix: TECHADM_PREFIX,
		status: true,
	},
	{
		title: 'Запрос доп. информации',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER] Для дальнейшего рассмотрения темы, предоставьте:<br><BR>[QUOTE][SIZE=5][FONT=Veranda]1. Скриншоты или видео, подтверждающие факт владения этим имуществом.<BR>2. Все детали пропажи: дата, время, после каких действий имущество пропало.<BR>3. Информация о том, как вы изначально получили это имущество:<BR>дата покупки<br>способ приобретения (у игрока, в магазине или через донат;<br>фрапс покупки (если есть);<br>никнейм игрока, у которого было приобретено имущество, если покупка была сделана не в магазине.[/QUOTE]<BR>[/CENTER]'+
		'[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении[/COLOR][/CENTER][/FONT][/SIZE]',
		prefix: PIN_PREFIX,
		status: true,
	},
	{
        title: "Проблемы с загрузкой форума",
        content:
        '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
        '[center]Если вы столкнулись с проблемой загрузки страниц форума, пожалуйста, выполните следующие действия:<br><br>• Откройте "Настройки".<br>• Найдите во вкладке "Приложения" свой браузер, через который вы пользуетесь нашим сайтом форума.<br>• Нажмите на браузер, после чего внизу выберите "Очистить" -> "Очистить Кэш".<br><br>После следуйте данным инструкциям:<br>• Перейдите в настройки браузера.<br>• Выберите "Конфиденциальность и безопасность" -> "Очистить историю".<br>• В основных и дополнительных настройках поставьте галочку в пункте "Файлы cookie и данные сайтов".<br>После этого нажмите "Удалить данные".<br><br>Ниже прилагаем видео-инструкции описанного процесса для разных браузеров:<br>Для браузера CHROME: https://youtu.be/FaGp2rRru9s<br>Для браузера OPERA: https://youtube.com/shorts/eJOxkc3Br6A?feature=share'+
        '[CENTER][I][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
        prefix: CLOSE_PREFIX,
        status: false,
	},
	{
		title: 'Отказ в изменении законопослушности',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]К сожалению, администрация, технические специалисты и другие должностные лица на BLACK RUSSIA не могут повлиять на Вашу законопослушность.<br>Вы можете повысить свою законопослушность двумя способами:<BR><BR>1. Каждый PayDay (00 минут каждого часа) вам начисляется одно очко законопослушности(Если только у вас нету PLATINUM VIP-статуса), если за прошедший час вы отыграли не менее 20 минут.<br>2. Приобрести законопослушность в /donate.<BR>[/CENTER]'+
		'[CENTER][I][COLOR=rgb(255,0,0)]Отказано[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
        title: "Ошибка с отсутствием штрафов",
        content:
        '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
        '[center]У Вас произошла ошибка со штрафами. Чтобы ошибка была исключена — Вам необходимо совершить проезд на красный свет или переехать через сплошную, получить за это штраф и оплатить все штрафы в банке.<br>Команде Проекта известно о данной недоработке и активно ведется иправление.<br><br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
	{
		title: 'Вам в жб на специалистов',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Вы получили наказание от технического специалиста Вашего сервера.<br>Вам следует обратиться в раздел «Жалобы на технических специалистов» — в случае, если Вы не согласны с наказанием.<br><br>' +
		"[CENTER]Ссылка на раздел, где можно оформить жалобу на технического специалиста - [URL='https://forum.blackrussia.online/index.php?forums/Жалобы-на-технических-специалистов.490/']клик[/URL] <br><br>" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Отказано[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Передано команде проекта',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша тема закреплена и находится на рассмотрении у команды проекта. Пожалуйста, ожидайте выноса вердикта разработчиков."+
		"[CENTER]Создавать новые темы с данной проблемой — не нужно, ожидайте ответа в данной теме. Если проблема решится - Вы всегда можете оставить своё сообщение в этой теме.<br>",
		prefix: COMMAND_PREFIX,
		status: true,
	},
	{
		title: 'Проблема известна команде проекта',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Команде проекта уже известно о данной проблеме, она обязательно будет рассмотрена и исправлена. Спасибо за Ваше обращение!<br><br>" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Форма для ошибок во время ОБТ на IOS',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Если вы нашли какую-либо ошибку во время Открытого Бэта Тестирования на IOS то сделайте следующие действия.<br><br>1. Отправьте пожалуйста найденную недоработку в данную форму - [URL='https://forms.gle/4adcNvKisfKF59Fi8']клик[/URL]<br>2. Передайте данную форму своим друзьям, для ускорения процесса по сбору багов для их исправления.<br><br>Спасибо за ваш вклад в развитие игры!<br>[CENTER][I][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]",
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Приватный режим',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Раздел 'Жалобы' переведен в приватный режим.<br>Тему, созданную тем или иным пользователем, может видеть лишь <b>он сам</b> и <b>Администрация сервера</b>.<br>Ознакомиться с формой подачи тем в тот или иной раздел можно в данной теме: [URL='https://forum.blackrussia.online/index.php?forums/Правила-подачи-жалоб.202/']Клик[/URL]<br>Приятного времяпрепровождения на нашем форуме<br>[CENTER][I][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]",
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Не начислили рейтинг за груз',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Наша система построена следующим образом:<br>Рейтинг зависит от поломки автомобиля чем серьёзнее поломка, тем меньше будет засчитан рейтинг.<br>Поломка учитывается вся за время рейса с грузом, в независимости от того если Вы почините Ваш автомобиль, поломка до, будет учтена.<br>[CENTER][I][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
        prefix: CLOSE_PREFIX,
	},
 	{
		title: 'Не является багом',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Проблема, с которой Вы столкнулись, не является багом/ошибкой сервера.<br><br>[CENTER][I][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Передача тестерам',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша тема передана на тестирование.[/CENTER][/FONT][/SIZE]",
		  prefix: WAIT_PREFIX,
		  status: false,
	},
	{
		title: 'Пропали вещи с аукциона',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Если вы выставили свои вещи на аукцион, а по истечении времени действия лота их никто не купил — воспользуйтесь командой [COLOR=rgb(251, 160, 38)]/reward[/COLOR]<br> В случае отсутствии вещей там — приложите видеофиксацию с использованием команды /time в данном обращении<br>[CENTER][I][COLOR=rgb(255,255,0)]На рассмотрении[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: PIN_PREFIX,
		status: false,
	},
	{
		title: 'Если не работают ссылки',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]По техническим причинам данное действие невозможно, пожалуйста воспользуйтесь копированием ссылки от сюда:<br>[img]https://i.ibb.co/SX77Fgw/photo-2022-08-20-16-31-57.jpg[/img]<br>Если данный способ не помогает, то используйте сервис сокращения ссылок https://clck.ru<br> Либо попробуйте вот так:<br>1) загрузка скриншота биографии на фотохостинг<br>2) в описание прикрепить ссылку с форума<br>3) скопировать пост с фотохостинга<br><br>2 способ:<br>Сократите ссылки для Ваших скриншотов и RP биографии, сделать можно тут goo.su  также Iformation замените на русский текст, просмотрите еще текст полностью и постарайтесь уменьшить такие знаки как !?<br>goo.su[/CENTER]<br>"+
		'[CENTER][I][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Вам в раздел государственных орг.',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Ваша тема не относится к техническому разделу, пожалуйста оставьте ваше заявление в соответствующем разделе Государственных Организаций вашего сервера.[/CENTER]<br><br>'+
		'[CENTER][I][COLOR=rgb(255, 0, 0)]Отказано[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Вам в раздел криминальных орг.',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Ваша тема не относится к техническому разделу, пожалуйста оставьте ваше заявление в соответствующем разделе Криминальных Организаций вашего сервера [/CENTER]'+
		'[CENTER][I][COLOR=rgb(255,0,0)]Отказано[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Вам в жб на адм.',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Вы получили наказание которое не относится к технической части, оно относится к Административной части.<br> Обратитесь в раздел Жалобы на администрацию вашего сервера.<br>Форма для подачи жалобы - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-администрацию.3429349/']Клик[/URL]<br>" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
		title: 'Вам в жб на игроков',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема не относится к техническому разделу.<br>Данное действие было совершено игроком и нарушает правила сервера, пожалуйста обратитесь в <br>'Жалобы на игроков'<br>Вашего сервера.<br>Форма подачи жалобы - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/']Клик[/URL]" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
		title: 'Вам в жб на лидеров',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема не относится к техническому разделу.<br>Данные действия были совершены лидером и нарушают регламент сервера, пожалуйста обратитесь в <br>'Жалобы на лидеров'<br>Вашего сервера.<br>Форма подачи жалобы - [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.3429391/']Клик[/URL]" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
		title: 'Вам в обжалования',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Вы получили наказание от администратора своего сервера.<br> Для его снижения/обжалования обратитесь в раздел<br><<Обжалования>> вашего сервера.<br>Форма подачи темы - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/']Клик[/URL]" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
		title: 'Сервер не отвечает',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Если у Вас встречаются такие проблемы, как «Сервер не отвечает», не отображаются сервера в лаунчере, не удаётся выполнить вход на сайт/форум, попробуйте совершить следующие действия: <br><br>" +
		"[LEFT]• Сменить IP-адрес любыми средствами; <br>" +
		"[LEFT]• Переключиться на Wi-Fi/мобильный интернет или на любую доступную сеть; <br>"+
		"[LEFT]• Использование VPN; <br>"+
		"[LEFT]• Перезагрузка роутера.<br><br>" +

		"[CENTER]Если методы выше не помогли, то переходим к следующим шагам: <br><br>" +

		'[LEFT]1. Устанавливаем приложение «1.1.1.1: Faster & Safer Internet» Ссылка: https://clck.ru/ZP6Av и переходим в него.<br>'+
		'[LEFT]2. Соглашаемся со всей политикой приложения.<br>'+
		'[LEFT]3. Нажимаем на ползунок и ждем, когда текст изменится на «Подключено».<br>'+
		'[LEFT]4. Проверяем: Отображаются ли серверы? Удается ли выполнить вход в игру? Работают ли другие источники (сайт, форум)? <br>' +

		"[CENTER]📹 Включение продемонстрировано на видео: https://youtu.be/Wft0j69b9dk<br>[CENTER][I][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]",
		prefix: CLOSE_PREFIX,
		status: false,
	},
    {
        title: 'Кикнули за ПО',
        content:
        '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
        '[CENTER]Уважаемый игрок, если вы были отключены от сервера Античитом<br><br>[COLOR=rgb(255, 0, 0)]Пример[/COLOR]:<br><br> [IMG]https://i.ibb.co/FXXrcVS/image.png[/IMG],<br>пожалуйста, обратите внимания на значения PacketLoss и Ping.<br><br>PacketLoss - минимальное значение 0.000000, максимальное 1.000000. При показателе, выше нуля, это означает, что у вас происходит задержка/потеря передаваемых пакетов информации на сервер. Это означает, что ваш интернет не передает достаточное количество данных из вашего устройства на наш сервер, в следствие чего система отключает вас от игрового процесса.<br><br>Ping - Чем меньше значение в данном пункте, тем быстрее передаются данные на сервер, и наоборот. Если значение выше 100, вы можете наблюдать отставания в игровом процессе из-за нестабильности интернет-соединения.<br><br>Если вы не заметили проблем в данных пунктах, скорее всего - у вас произошел скачек пинга при выполнении действия в игре, в таком случае, античит также отключает игрока из-за подозрения в использовании посторонних программ.<br><br>Решение данной проблемы: постарайтесь стабилизировать ваше интернет-соединение, при необходимости - сообщите о проблемах своему провайдеру (поставщику услуг интернета).<br>[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
        prefix: CLOSE_PREFIX,
        status: false,
	},
	{
        title: 'По проблемам с донатом',
        content:
        '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
        '[CENTER]Если не были зачислены BLACK COINS — вероятнее всего, была допущена ошибка при вводе реквизитов. К нашему сожалению, из-за большого количества попыток обмана, мы перестали рассматривать подобные обращения. Для проверки зачисления BLACK COINS необходимо ввести в игре команду: /donat.<br><br>' +
        '[CENTER][I]Вам необходимо быть внимательными при осуществлении покупок.[/I]<br>' +
        '[CENTER]Если Вы считаете, что ошибки быть не может и с момента оплаты не прошло более 14 дней — в обязательном порядке обратитесь в службу поддержки для дальнейшего решения: На сайте через виджет обратной связи или посредством месенджеров: ВКонтакте: vk.com/br_tech, Telegram: t.me/br_techBot<br><br>' +
        '[CENTER][COLOR=rgb(255,0,0)]Закрыто[/COLOR].[/CENTER][/FONT][/SIZE]',
      prefix: DECIDED_PREFIX,
      status: false,
	},
	{
		title: 'Исчезла статистика аккаунта',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Аккаунт не может пропасть или аннулироваться просто так. Даже если Вы меняете ник, используете кнопки «починить игру» или «сброс настроек» - Ваш аккаунт не удаляется. Система работает иначе.<br><br>" +
		"[CENTER]Проверьте ввод своих данных: пароль, никнейм и сервер. Зачастую игроки просто забывают ввести актуальные данные и считают, что их аккаунт был удален. Будьте внимательны!" +
		'[CENTER]Как ввести никнейм (на случай, если сменили в игре, но не поменяли в клиенте): https://youtu.be/c8rhVwkoFaU [/CENTER] <br><br>' +
		'[CENTER][I]Рассмотрено[/I].[/CENTER][/FONT][/SIZE]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
		title: 'Нет фото/видеофиксации',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Без доказательств (в частности скриншоты или видео) – решить проблему не получится. Если доказательства найдутся - создайте новую тему, приложив доказательства с фото-хостинга<br>[URL='https://yapx.ru/']yapx.ru[/URL],<br>[URL='https://imgur.com/']imgur.com[/URL],<br>[URL='https://www.youtube.com/']youtube.com[/URL],<br>[URL='https://imgbb.com']ImgBB.com[/URL]<br>(все кликабельно).<br>" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Баг будет исправлен',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная недоработка будет проверена и исправлена.<br> Спасибо, ценим Ваш вклад в развите проекта.<br>" +
		'[CENTER][I]Рассмотрено[/I].[/CENTER][/FONT][/SIZE]',
		prefix: WATCHED_PREFIX,
		status: false,
	},
	{
		title: 'Ознакомьтесь с правилами восстановления',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Пожалуйста, убедительная просьба, ознакомьтесь с правилами восстановлений - [URL='https://forum.blackrussia.online/index.php?threads/В-каких-случаях-мы-не-восстанавливаем-игровое-имущество.25277/']клик[/URL].<br>Вы создали тему, которая не относится к технической проблеме.[/CENTER]<br><br>" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Отказано[/COLOR][/CENTER][/I].[/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'По крашам/вылетам',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]В том случае, если Вы вылетели из игры во время игрового процесса (произошел краш), в обязательном порядке необходимо обратиться в данную тему в любом техническом разделе [img]https://i.ibb.co/sPhBGjx/NVIDIA-Share-1-Tde-EHim0u.png[/img][/CENTER]<br>" +
		"[CENTER][CODE]01. Ваш игровой никнейм: <br> 02. Сервер: <br> 03. Тип проблемы: Обрыв соединения | Проблема с ReCAPTCHA | Краш игры (закрытие игры) | Другое [Выбрать один вариант ответа] <br> 04. Действия, которые привели к этому (при вылетах, по возможности предоставлять место сбоя): <br> 05. Как часто данная проблема: <br> 06. Полное название мобильного телефона: <br> 07. Версия Android: <br> 08. Дата и время (по МСК): <br> 09. Связь с Вами по Telegram/VK:[/CODE]<br><br>" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Отказано[/COLOR][/CENTER][/I].[/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Не выпустило из ФСИН',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Скоро будете выпущены,ожидайте.[/CENTER][/FONT][/SIZE]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Хочу занять должность',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Команда технических специалистов не решает назначение на какую-либо должность, которая присутствует на проекте.<br>Для этого существуют заявления в главном разделе Вашего игрового сервера, где Вы можете ознакомиться с открытыми должностями и формами подач.<br>Приятной игры и желаем удачи в карьерной лестнице!<br><br>" +
		'[CENTER][I][COLOR=rgb(255,0,0)]Отказано[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'По предложениям по улучшению',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Ваша тема не относится к технической проблеме, если вы хотите предложить изменения в игровом моде - обратитесь в раздел <br> [URL="https://forum.blackrussia.online/index.php?categories/Предложения-по-улучшению.656/"] Предложения по улучшению → нажмите сюда[/URL].<br>[CENTER][I][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]' ,
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Нужны все детали для прошивки',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER] Для активации какой либо прошивки необходимо поставить все детали данного типа "SPORT" "SPORT+" и т.п.<br>[CENTER][I][COLOR=rgb(255,0,0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: CLOSE_PREFIX,
		status: false,
	},

];

	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('Теху', 'techspec', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 0, 255, 2.5);');
	addButton('На рассмотрении', 'pin', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(238, 238, 0, 2.5);');
	addButton('Решено', 'decided', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 250, 154, 2.5);');
    addButton('Расс', 'watched', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 250, 154, 2.5);');
    addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 2.5);');
	addButton('Закрыто', 'closed', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 2.5);');
    addButton('Меню', 'selectAnswer' , 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 0, 255, 2.5);');
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
	$('button#techspec').click(() => editThreadData(TECHADM_PREFIX, true));

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
		$('.button--icon--reply').after(`</button>`,
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

	function editThreadData(prefix, pin = false, may_lens = true) {
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
				discussion_open: 1,
				sticky: 1,
				_xfToken: XF.config.csrf,
				_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
				_xfWithData: 1,
				_xfResponseType: 'json',
			  }),
			}).then(() => location.reload());
		}
		if(may_lens === true) {
			if(prefix == UNACCEPT_PREFIX || prefix == WATCHED_PREFIX || prefix == CLOSE_PREFIX || prefix == DECIDED_PREFIX) {
				moveThread(prefix, 230); }

			if(prefix == WAIT_PREFIX) {
				moveThread(prefix, 917);
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