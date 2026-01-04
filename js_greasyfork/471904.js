// ==UserScript== 
 // @name KRASNODAR <|> Скрипт для Кураторов Форума 
 // @namespace https://forum.blackrussia.online/ 
 // @version 1.1.6
 // @description Бездельничество Luv 
 // @author Thomas Luv 
 // @match https://forum.blackrussia.online/threads/* 
 // @include https://forum.blackrussia.online/threads/ 
 // @grant none 
 // @license MIT 
 // @icon https://img.icons8.com/nolan/452/beezy.png 
// @downloadURL https://update.greasyfork.org/scripts/471904/KRASNODAR%20%3C%7C%3E%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/471904/KRASNODAR%20%3C%7C%3E%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0.meta.js
 // ==/UserScript==   
document.querySelector("div.formButtonGroup-primary").style.display="flex"; 
document.querySelector("div.formButtonGroup-primary").style.flexWrap="wrap"; 
document.querySelector("button.button--primary.button.button--icon.button--icon--reply.rippleButton").style.background="#000"; 
document.querySelector("button.button--primary.button.button--icon.button--icon--reply.rippleButton").style.borderRadius="25px";
  (function () {
    'use strict';
  const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
  const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
  const PIN_PREFIX = 2; // Prefix that will be set when thread pins
  const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
  const WATCHED_PREFIX = 9;
  const CLOSE_PREFIX = 7; // Prefix that will be set when thread closes.
  const TEX_PREFIX = 13;
  const GA_PREFIX = 12;
  const V_PREFIX = 1;
  const buttons = [
        {
        title: 'Свое сообщение',
        content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваше сообщение[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
        },
         {
          title: '<<<<<<<<<<<<<<<<<<<<<<<<<<< Докозательства >>>>>>>>>>>>>>>>>>>>>>>>>>',
        },
        {
          title: 'На рассмотрение',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша жалоба взята на рассмотрение. Ожидайте ответа.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: PIN_PREFIX,
          status: false,
        },
        {
          title: 'Недостаточно доко-в.',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Недостаточно докозательств для корректного рассмотрения вашей жалобы.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Док-ва в плохом качестве',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Докозательства предоставлены в очень плохом качесте  - следовательно, дальнейшему рассмотрению не подлежит.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Док-ва отсутствуют',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отсутствуют доказательства - следовательно, дальнейшему рассмотрению не подлежит. Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Не работает док-во',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваши доказательства не рабочие или же ссылка указана неккоректно - следовательно, дальнейшему рассмотрению не подлежит.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Док-ва отредак',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Доказательства были подвергнуты редактированию - следовательно, дальнейшему рассмотрению не подлежит.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Доква обрываются',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша видеозапись обрывается - следовательно, дальнейшему рассмотрению не подлежит. Загрузите полную видеозапись на видео-хостинг YouTube.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Док-ва в соц. сетях',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Доказательства в социальных сетях и т.д. не принимаются - следовательно, дальнейшему рассмотрению не подлежит. Загрузите доказательства на фото-видео хостинги YouTube,Imgur, Yapx и так далее.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Нужен фрапс',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]В данной ситуации обязательнодолжен быть фрапс(видео фиксация)всех моментов - следовательно, дальнейшему рассмотрению не подлежит.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Неполный фрапс',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Видео фиксация не полная либо же условия сделки обговарены неполностью - следовательно, дальнейшему рассмотрению не подлежит.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Нету /time',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]На доказательствах отсутствуют дата и время - следовательно, дальнейшему рассмотрению не подлежит.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Нет таймкодов',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша жалоба отказана, т.к в ней нету таймкодов - следовательно, дальнейшему рассмотрению не подлежит. Если видео длится больше 3-ех минут - Вы должны указать таймкоды нарушений.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Нет условий сделки',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]В предоставленных доказательствах отсутствуют условия сделки - следовательно, дальнейшему рассмотрению не подлежит.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Нарушений нет',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Нарушений со стороны игрока не было замечено.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Не по форме',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша жалоба составлена не по форме - следовательно, дальнейшему рассмотрению не подлежит.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'От 3-его лица',
        content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша жалоба подана от 3-его лица - следовательно, дальнейшему рассмотрению не подлежит.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
        prefix: UNACCEPT_PREFIX,
        status: false,
        },
        {
          title: 'Прошло более 3-ех дней',
        content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша жалоба подана позже 72 часов после нарушения - следовательно, дальнейшему рассмотрению не подлежит.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
        prefix: UNACCEPT_PREFIX,
        status: false,
        },
        {
          title: '2 и более игрока',
        content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]В вашей жалобе указаны 2 и более игрока - следовательно, дальнейшему рассмотрению не подлежит. Создайте 2 отдельные жалобы на них.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
        prefix: UNACCEPT_PREFIX,
        status: false,
        },
        {
          title: 'Уже был ответ',
        content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша жалоба была отказана, т.к ранее вам уже был дан ответ в предыдущих темах.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
        prefix: UNACCEPT_PREFIX,
        status: false,
        },
        {
          title: 'Уже был наказан',
        content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша жалоба была отказана по причине того, что данный игрок уже получил наказание за данное нарушение.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
        prefix: UNACCEPT_PREFIX,
        status: false,
        },
        {
          title: '<<<<<<<<<<<<<<<<<<<<<<<<<<< Наказания в чатах >>>>>>>>>>>>>>>>>>>>>>>>>>',
        },
        {
          title: 'Транслит',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]3.01. Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке | Устное замечание / Mute 30 минут[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: ACCEPT_PREFIX, 
          status: false,
        },
        {
          title: 'CapsLock',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]3.02. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате | Mute 30 минут[/ICODE][/FONT][/SIZE][/CENTER]<br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'OOC Оск',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]3.03. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены | Mute 30 минут[/ICODE][/FONT][/SIZE][/CENTER]<br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: ACCEPT_PREFIX, 
          status: false,
        },
        {
          title: 'Упом род',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | Mute 120 минут / Ban 7 - 15 дней[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br> [CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Flood',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]3.05. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | Mute 30 минут[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Злоуп. Симвл',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]3.06. Запрещено злоупотребление знаков препинания и прочих символов | Mute 30 минут[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Оскорбление',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]3.07. Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата | Mute 30 минут[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Неуваж к адм',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]2.54. Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации | Mute 180 минут[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Слив Глобал чата',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]3.08. Запрещены любые формы «слива» посредством использования глобальных чатов | PermBan[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Угрозы',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]3.09. Запрещены любые угрозы о наказании игрока со стороны администрации | Mute 30 минут[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'OOC Угрозы',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]2.37. Запрещены OOC угрозы, в том числе и завуалированные | Mute 120 минут / Ban 7 дней[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Выдача за адм',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]3.10. Запрещена выдача себя за администратора, если таковым не являетесь | Ban 7 - 15  ЧС администрации[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br> [CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Ввод в забл',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]3.11. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами | Ban 15 - 30 дней / PermBan[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br> [CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Объявление на тер. ГОСС',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]3.22. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) | Mute 30 минут[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br> [CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'MAT в vip-чат',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]3.23. Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате | Mute 30 минут[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Оск проекта',
        content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]2.40. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
        },
        {
          title: 'Конфликт IC/OOC',
        content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]2.35. На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате | Mute 120 минут / Ban 7 дней[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
        },
        {
          title: 'Перенос конфликтов IC/OOC',
        content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]2.36. Запрещено переносить конфликты из IC в OOC и наоборот | Warn[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
        },
        {
          title: '<<<<<<<<<<<<<<<<<<<<<<<<<<< Наказания за рекламу >>>>>>>>>>>>>>>>>>>>>>>>>>',
        },
        {
          title: 'Реклама промо',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. | Ban 30 дней[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Системный промо',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный промокод является системный и был создан разработчиками.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Реклама Voice',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]3.17. Запрещена реклама в Voice Chat не связанная с игровым процессом | Ban 7 - 15 дней[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Реклама',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]2.31. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное | Ban 7 дней / PermBan[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
          title: '<<<<<<<<<<<<<<<<<<<<<<<<<<< Наказания за NonRP >>>>>>>>>>>>>>>>>>>>>>>>>>',
        },
        {
          title: 'NonRP обман',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]2.05. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | PermBan[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'NonRP поведение',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]2.01. Запрещено поведение, нарушающее нормы процессов Role Play режима игры | Jail 30 минут[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'NonRP вождение',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]2.03. Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере | Jail 30 минут[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'NonRP Акс',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]2.52. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров  JAIL 30 минут[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Нарушение П/Р/О',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]4.01. Запрещено редактирование объявлений, не соответствующих ПРО | Mute 30 минут[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Замена объяв.',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]4.04. Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком | Ban 7 дней  ЧС организации[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
          title: '<<<<<<<<<<<<<<<<<<<<<<<<<<< Наказания ГОСС фракций >>>>>>>>>>>>>>>>>>>>>>>>>>',
        },
        {
          title: 'Одиночный патруль',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]1.11. Всем силовым структурам запрещен одиночный патруль или конвоирование, минимум 2 сотрудника | Jail 30 минут[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Армия DM вне ТТ',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]2.02. Наносить урон игрокам, которые находятся вне территории воинской части, запрещено | DM / Jail 60 минут / Warn[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'УМВД DM на ТТ',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]6.01. Запрещено наносить урон игрокам без Role Play причины на территории УМВД | DM / Jail 60 минут / Warn[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'УМВД ГИБДД ФСБ NonRP поведение',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]6.03. Запрещено nRP поведение | Warn[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'УМВД NonRP розыск',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]6.02. Запрещено выдавать розыск без Role Play причины | Warn[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'ГИБДД DM на ТТ',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]7.01. Запрещено наносить урон игрокам без Role Play причины на территории ГИБДД | DM / Jail 60 минут / Warn[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'ГИБДД NonRP розыск штраф',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]7.02. Запрещено выдавать розыск, штраф без Role Play причины | Warn[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'В/У в погоне',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]7.04. Запрещено отбирать водительские права во время погони за нарушителем | Warn[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'ФСБ DM на ТТ',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]8.01. Запрещено наносить урон игрокам без Role Play причины на территории ФСБ | DM / Jail 60 минут / Warn[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'ФСБ NonRP розыск',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]8.02. Запрещено выдавать розыск без Role Play причины | Warn[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'ФСИН DM на ТТ',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]9.01. Запрещено наносить урон игрокам без Role Play причины на территории ФСИН | DM / Jail 60 минут / Warn[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
          title: '<<<<<<<<<<<<<<<<<<<<<<<<<<< Наказание ОПГ групировок >>>>>>>>>>>>>>>>>>>>>>>>>>',
        },
        {
          title: 'Провокация ГОСС',
        content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]2. Запрещено провоцировать сотрудников государственных организаций | Jail 30 минут[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
        },
        {
          title: 'Провокация ОПГ',
        content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]3. Запрещено провоцировать сотрудников криминальных организаций возле или на территории вражеской группировки | Jail 30 минут[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
        },
        {
          title: 'DM на ТТ ОПГ ',
        content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]4. Запрещено без причины наносить урон игрокам на территории ОПГ | Jail 60 минут[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
        },
        {
          title: 'Уход от погони',
        content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]8. Запрещено уходить от погони со стороны правоохранительных органов путем заезда на территорию своей банды для того чтобы скрыться или получить численное преимущество | Jail 30 минут[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
        },
        {
          title: '<<<<<<<<<<<<<<<<<<<<<<<<<<< Передать >>>>>>>>>>>>>>>>>>>>>>>>>>',
        },
        {
          title: 'Главному администратору',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша жалоба была передана на рассмотрение Главному администратору Thomas_Flatcher. Ожидайте ответа.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: GA_PREFIX,
          status: false,
        },
        {
          title: 'Техническому Специалисту',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша жалоба была передана на рассмотрение Техническому специалисту Stanley_Sinclair. Ожидайте ответа.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: TEX_PREFIX,
          status: false,
        },
        {
          title: 'В жб на адм',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Обратитесь в раздел жалоб на администрацию.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'В жб на лидеров',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Обратитесь в раздел жалоб на лидеров.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'В жб на хелперов',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Обратитесь в раздел жалоб на агентов поддержки.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'В обжалование',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Обратитесь в раздел обжалований наказаний.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'В жб на сотрудников',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Обратитесь в раздел жалоб на сотрудников.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: '<<<<<<<<<<<<<<<<<<<<<<<<<<< Прочее >>>>>>>>>>>>>>>>>>>>>>>>>>',
        },
        {
          title:'Уход от RP',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]2.02. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | Jail 30 минут / Warn[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Аморал',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]2.08. Запрещена любая форма аморальных действий сексуального характера в сторону игроков | Jail 30 минут / Warn[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Слив склада',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]2.09. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле | Ban 15 - 30 дней / PermBan[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Слив фамы',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Повышая игрока до должности заместителя в семье вы берете полную ответственность за его действия. Нарушений со стороны игрока нет.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Затягивание RP',
        content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]2.12. Запрещено целенаправленное затягивание Role Play процесса | Jail 30 минут[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
        },
        {
          title: 'DB',
        content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]2.13. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | Jail 60 минут[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
        },
        {
          title: 'RK',
        content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]2.14. Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти | Jail 30 минут[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
        },
        {
          title: 'TK',
        content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]2.15. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | Jail 60 минут / Warn (за два и более убийства)[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
        },
        {
          title: 'SK',
        content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]2.16. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них | Jail 60 минут / Warn (за два и более убийства)[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
        },
        {
          title: 'PG',
        content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]2.17. Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь | Jail 30 минут[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
        },
        {
          title: 'MG',
        content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]2.18. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | Mute 30 минут[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
        },
        {
          title: 'DM',
        content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | Jail 60 минут[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
        },
        {
          title: 'MASS DM',
        content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более | Warn / Ban 3 - 7 дней[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
        },
        {
          title: 'BAGOUSE',
        content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]2.21. Запрещено пытаться обходить игровую систему или использовать любые баги сервера | Ban 15 - 30 дней / PermBan (по согласованию с ГА, ЗГА, руководством тех. специалистов)[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
        },
        {
          title: 'BAGOUSE ANIM',
        content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]2.55. Запрещается багоюз связанный с анимацией в любых проявлениях. | Jail 60 / 120 минут[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
        },
        {
          title: 'Невозврат долга',
        content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]2.57. Запрещается брать в долг игровые ценности и не возвращать их. | Ban 30 дней / permban[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
        },
        {
          title: 'Фейк',
        content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Данный игрок будет наказан по следующему пункту правил:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]4.10. Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию | Устное замечание  смена игрового никнейма / PermBan[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
        prefix: ACCEPT_PREFIX,
        status: false,
        },
        {
          title: '<<<<<<<<<<<<<<<<<<<<<<<<<<< Role Play Биографии >>>>>>>>>>>>>>>>>>>>>>>>>>',
        },
        {
          title: 'Одобрена',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша Role Play Биография была одобрена.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Мало информации',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша Role Play Биография была отказана по причине:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]В вашей Role Play Биографии слишком мало информации. Добавте больше информации в новой Role Play Биографии.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Заголовок не по форме',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша Role Play Биография была отказана по причине:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]В вашей Role Play Биографии неправильно оформлен заголовок. Ознакомьтесь с правилами подачи Role Play Биографий в этом разделе.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Не по форме',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша Role Play Биография была отказана по причине:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]В вашей Role Play Биография составлена не по форме. Ознакомьтесь с правилами подачи Role Play Биографий в этом разделе. [/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Неграмотная',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша Role Play Биография была отказана по причине:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]В вашей Role Play Биографии допущены многочисленные грамматические ошибки. Ознакомьтесь с правилами подачи Role Play Биографий в этом разделе. [/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'От 3-его лица',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша Role Play Биография была отказана по причине:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша Role Play Биография оформлена от 3-его лица. Ознакомьтесь с правилами подачи Role Play Биографий в этом разделе. [/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Уже одобрена',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша Role Play Биография была отказана по причине:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша Role Play Биография была одобрена ранее. [/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Героизм',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша Role Play Биография была отказана по причине:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]В вашаей Role Play Биографии присутствует героизм. Ознакомьтесь с правилами подачи Role Play Биографий в этом разделе. [/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Копипаст',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша Role Play Биография была отказана по причине:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша Role Play Биография была полностью или частично скопирована у другого человека. Ознакомьтесь с правилами подачи Role Play Биографий в этом разделе. [/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'NonRP NickName',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша Role Play Биография была отказана по причине:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]У вас NonRP NickName. Ознакомьтесь с правилами подачи Role Play Биографий в этом разделе. [/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'NickName на англ.',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша Role Play Биография была отказана по причине:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]В вашей Role Play Биографии имя указано не на русском языке. Ознакомьтесь с правилами подачи Role Play Биографий в этом разделе.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Дата рожд. с годом',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша Role Play Биография была отказана по причине:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]В вашей Role Play Биографии дата рождения несовпадает с возрастом. Ознакомьтесь с правилами подачи Role Play Биографий в этом разделе.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Семья не полностью',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша Role Play Биография была отказана по причине:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]В вашей Role Play Биографии семья расписана не полностью. Ознакомьтесь с правилами подачи Role Play Биографий в этом разделе.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Дата рожд. не полностью',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша Role Play Биография была отказана по причине:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]В вашей Role Play Биографии дата рождения расписана не полностью. Ознакомьтесь с правилами подачи Role Play Биографий в этом разделе.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Не соотвествие',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша Role Play Биография была отказана по причине:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]В вашей Role Play Биографии информация не соотвествует описанию. Ознакомьтесь с правилами подачи Role Play Биографий в этом разделе.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Разноцветный текст',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша Role Play Биография была отказана по причине:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]В вашей Role Play Биографии имеется слишком резкая цветовая палитра. Ознакомьтесь с правилами подачи Role Play Биографий в этом разделе.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'На доработку',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша Role Play Биография была передана на доработку.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]В вашей Role Play Биографии мало информации. У вас есть 24 часа что бы исправить вашу Role Play Биографию.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Отказ после доработки',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша Role Play Биография была отказана по причине:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]После доработки в  вашей Role Play Биографии по прежнему мало информации. Ознакомьтесь с правилами подачи Role Play Биографий в этом разделе.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: '<<<<<<<<<<<<<<<<<<<<<<<<<<< Role Play Ситуации >>>>>>>>>>>>>>>>>>>>>>>>>>',
        },
        {
          title: 'Одобрена',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша Role Play Ситуации была одобрена.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Не по форме',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша Role Play Ситуация была отказана по причине:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша Role Play Ситуации составлена не по форме. Ознакомьтесь с правилами подачи Role Play Ситуаций в этом разделе.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'NickName на англ.',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша Role Play Ситуация была отказана по причине:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Все ники в  Role Play Ситуации должны быть написаны на русском языке. Ознакомьтесь с правилами подачи Role Play Ситуаций в этом разделе.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Неграмотно',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша Role Play Ситуация была отказана по причине:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]В вашей Role Play Ситуации допущено множесто ошибок или она оформлена неграмотно. Ознакомьтесь с правилами подачи Role Play Ситуаций в этом разделе.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Копипаст',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша Role Play Ситуация была отказана по причине:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша Role Play Ситуация скопированачастично или полностью у другогго человека. Ознакомьтесь с правилами подачи Role Play Ситуаций в этом разделе.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Заголовок не по форме',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша Role Play Ситуация была отказана по причине:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]В вашей Role Play Ситуации заголовок составлен не по форме. Ознакомьтесь с правилами подачи Role Play Ситуаций в этом разделе.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Разноцветный текст',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша Role Play Ситуация была отказана по причине:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]В вашей Role Play Ситуации имеется слишком резкая цветовая палитра. Ознакомьтесь с правилами подачи Role Play Ситуаций в этом разделе.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'В соц. сетях',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша Role Play Ситуация была отказана по причине:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Любые материалы  социальных сетях и т.д. не принимаются. Загрузите материалы на фото-видео хостинги YouTube,Imgur, Yapx и так далее.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'На доработку',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша Role Play Ситуация была передана на доработку[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]В вашей Role Play Ситуации мало информации, у вас есть 24 часа что бы доработать Role Play Ситуацию.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
        },
        {
          title: 'Отказ после доработки',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша Role Play Ситуация была отказана по причине:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]После доработки в вашей Role Play Ситуации по прежнему мало информации. Ознакомьтесь с правилами подачи Role Play Ситуаций в этом разделе.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: '<<<<<<<<<<<<<<<<<<<<<<<<<<< Role Play Организация >>>>>>>>>>>>>>>>>>>>>>>>>>',
        },
        {
          title: 'Одобрена',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша  Неофициальная Role Play Организация была одобрена[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Одобрено, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: ACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Не по форме',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша  Неофициальная Role Play Организация была отказана по причине:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша Неофициальная Role Play Организация составлена не по форме. Ознакомьтесь с правилами подачи Неофициальных Role Play Организаций в этом разделе. [/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'NickName на англ.',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша  Неофициальная Role Play Организация была отказана по причине:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Все имена в Неофицициальной Role Play Организации должны быть указаны на русском языке. Ознакомьтесь с правилами подачи Неофициальных Role Play Организаций в этом разделе.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Неграмотная',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша  Неофициальная Role Play Организация была отказана по причине:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]В вашей Неофициальной Role Play Организации допущено множество ошибок или она составлена неграмотно. Ознакомьтесь с правилами подачи Неофициальных Role Play Организаций в этом разделе.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },{
          title: 'Копипаст',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша  Неофициальная Role Play Организация была отказана по причине:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша  Неофициальная Role Play Организация была частично или полностью скопирована у другого человека. Ознакомьтесь с правилами подачи Неофициальных Role Play Организаций в этом разделе.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Заголовок не по форме',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша  Неофициальная Role Play Организация была отказана по причине:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]В вашей Неофициальной Role Play Организации заголовок составлен не по форме. Ознакомьтесь с правилами подачи Неофициальных Role Play Организаций в этом разделе.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'Разноцветный текст',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша  Неофициальная Role Play Организация была отказана по причине:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]В вашей Неофициальной Role Play Организации имеется слишком резкая цветовая палитра. Ознакомьтесь с правилами подачи Неофициальных Role Play Организаций в этом разделе.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'В соц. сетях',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша  Неофициальная Role Play Организация была отказана по причине:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Любые материалы  социальных сетях и т.д. не принимаются - следовательно, дальнейшему рассмотрению не подлежит. Загрузите материалы на фото-видео хостинги YouTube,Imgur, Yapx и так далее.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        {
          title: 'На доработку',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша  Неофициальная Role Play Организация была отправлена на доработку.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]В вашей Неофициальной Role Play Организации мало информации. У вас есть 24 часа для того, чтобы дополнить вашу Role Play Организацию. [/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
        },
        {
          title: 'Отказ после доработки',
          content: "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 255, 255)][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Ваша  Неофициальная Role Play Организация была отказана по причине:[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]После доработки в вашей Неофициальной Role Play Организации по прежнему мало информации. Ознакомьтесь с правилами подачи Неофициальных Role Play Организаций в этом разделе.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new][ICODE]Отказано, закрыто.[/ICODE][/FONT][/SIZE][/CENTER]<br><br>[CENTER][SIZE=4][FONT=courier new]Приятной игры на Black Russia Krasnodar[/FONT][/SIZE][/CENTER]",
          prefix: UNACCEPT_PREFIX,
          status: false,
        },
        ];


      $(document).ready(() => {
      // Загрузка скрипта для обработки шаблонов
      $("body").append("<script src='https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js'></script>");
  
      // Добавление кнопок при загрузке страницы
      addConsiderButton("Рассмотрение", "pin");
      addAppliedButton ("Одобрено ✅", "accept");
      addDeclinedButton("Отказано ⛔", "unaccept");
      addClosedButton("Закрыто 🚫", "Zakrito");
      addLiner();
      addTechButton("Теху 💻", "Texy");
      addGaButton("Главному Администратору 👑", "Ga");
      addLiner()
      addAnswersButton("Ответы 💥", "selectAnswer");
  
      // Поиск информации о теме
      const threadData = getThreadData();
  
      $("button#pin").click(() => editThreadData(PIN_PREFIX, true));
      $("button#unaccept").click(() => editThreadData(UNACCEPT_PREFIX, false));
      $("button#accepted").click(() => editThreadData(ACCEPT_PREFIX, false));
      $("button#Texy").click(() => editThreadData(TEX_PREFIX, false));
      $("button#Ga").click(() => editThreadData(GA_PREFIX, true));
      $("button#Zakrito").click(() => editThreadData(CLOSE_PREFIX, false));
  
      $(`button#selectAnswer`).click(() => {
    XF.alert(buttonsMarkup(buttons), null, "ВЫБЕРИТЕ ОТВЕТ");
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

    function addConsiderButton(name, id) {
      $(".button--icon--reply").before(
        `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 5px; margin-right: 5px; margin-bottom: 5px; background-color: #ff9800; color: #fff; text-shadow: 0px 1px 2px #000; flex-grow:1">${name}</button>`
      )
    }

    function addDeclinedButton(name, id) {
      $(".button--icon--reply").before(
        `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 5px; margin-right: 5px; margin-bottom: 5px; background-color: #d32f2f; color: #fff; text-shadow: 0px 1px 2px #000; flex-grow:1">${name}</button>`
      )
    }

    function addAppliedButton(name, id) {
      $(".button--icon--reply").before(
        `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 5px; margin-right: 5px; margin-bottom: 5px; background-color: #4caf50; color: #fff; text-shadow: 0px 1px 2px #000; flex-grow:1">${name}</button>`
      )
    }

    function addTechButton(name, id) {
      $(".button--icon--reply").before(
        `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 5px; margin-right: 5px; margin-bottom: 5px; background-color: #0d47a1; color: #fff; text-shadow: 0px 1px 2px #000; flex-grow:1">${name}</button>`
      )
    }

    function addGaButton(name, id) {
      $(".button--icon--reply").before(
        `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 5px; margin-right: 5px; margin-bottom: 5px; background-color: #d32f2f; color: #fff; text-shadow: 0px 1px 2px #000; flex-grow:1">${name}</button>`
      )
    }

    function addClosedButton(name, id) {
      $(".button--icon--reply").before(
        `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 5px; margin-right: 5px; margin-bottom: 5px; background-color: #d32f2f; color: #fff; text-shadow: 0px 1px 2px #000; flex-grow:1">${name}</button>`
      )
    }

    function addAnswersButton(name, id) {
      $(".button--icon--reply").before(
        `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 25px; margin-right: 25px; margin-bottom: 5px; background-color: #db2309; color: #fff; text-shadow: 0px 1px 2px #000; flex-grow:1">${name}</button>`
      )
    }

    function addLiner() {
      $(".button--icon--reply").before(
        `<button type="button" class="button--primary button rippleButton" style="flex-basis:100%; height:0"></button>`
      )
    }
  
    function buttonsMarkup(buttons) {
      return `<div class="select_answer">${buttons
    .map(
    (btn, i) =>
      `<button id="answers-${i}" class="button--primary button ` +
      `rippleButton" style="margin:5px"><span class="button-text">${btn.title}</span></button>`
    )
    .join("")}</div>`;
    }
  
    function pasteContent(id, data = {}, send = false) {
      const template = Handlebars.compile(buttons[id].content);
      if ($(".fr-element.fr-view p").text() === "") $(".fr-element.fr-view p").empty();
  
      $("span.fr-placeholder").empty();
      $("div.fr-element.fr-view p").append(template(data));
      $("a.overlay-titleCloser").trigger("click");
  
      if (send == true) {
        editThreadData(buttons[id].prefix, buttons[id].status);
        $(".button--icon.button--icon--reply.rippleButton").trigger("click");
      }
    }
  
    function getThreadData() {
      const authorID = $("a.username")[0].attributes["data-user-id"].nodeValue;
      const authorName = $("a.username").html();
      const hours = new Date().getHours();
      return {
        user: {
          id: authorID,
          name: authorName,
          mention: `[USER=${authorID}]${authorName}[/USER]`,
        },
        greeting: () =>
          4 < hours && hours <= 11 ?
          "Доброе утро" :
          11 < hours && hours <= 15 ?
          "Добрый день" :
          15 < hours && hours <= 21 ?
          "Добрый вечер" :
          "Доброй ночи",
      };
    }
  
      function editThreadData(prefix, pin = false) {
  // Получаем заголовок темы, так как он необходим при запросе
    const threadTitle = $(".p-title-value")[0].lastChild.textContent;
  
    if(pin == false){
      fetch(`${document.URL}edit`, {
        method: "POST",
        body: getFormData({
        prefix_id: prefix,
        title: threadTitle,
        _xfToken: XF.config.csrf,
        _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
        _xfWithData: 1,
        _xfResponseType: "json",
        }),
      }).then(() => location.reload());
    } else  {
      fetch(`${document.URL}edit`, {
        method: "POST",
        body: getFormData({
        prefix_id: prefix,
        title: threadTitle,
        pin: 1,
        _xfToken: XF.config.csrf,
        _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
        _xfWithData: 1,
        _xfResponseType: "json",
        }),
      }).then(() => location.reload());
    }
  
  
  
  
  if(pin == false){
      fetch(`${document.URL}edit`, {
        method: "POST",
        body: getFormData({
        prefix_id: prefix,
        title: threadTitle,
        _xfToken: XF.config.csrf,
        _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
        _xfWithData: 1,
        _xfResponseType: "json",
        }),
      }).then(() => location.reload());
    } else  {
      fetch(`${document.URL}edit`, {
        method: "POST",
        body: getFormData({
        prefix_id: prefix,
        title: threadTitle,
        pin: 1,
        _xfToken: XF.config.csrf,
        _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
        _xfWithData: 1,
        _xfResponseType: "json",
        }),
      }).then(() => location.reload());
        }
  
  
  function moveThread(prefix, type) {
  // Получаем заголовок темы, так как он необходим при запросе
  const threadTitle = $(".p-title-value")[0].lastChild.textContent;
  
  fetch(`${document.URL}move`, {
    method: "POST",
    body: getFormData({
    prefix_id: prefix,
    title: threadTitle,
    target_node_id: type,
    redirect_type: "none",
    notify_watchers: 1,
    starter_alert: 1,
    starter_alert_reason: "",
    _xfToken: XF.config.csrf,
    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
    _xfWithData: 1,
    _xfResponseType: "json",
    }),
  }).then(() => location.reload());
  }

  function getFormData(data) {
    const formData = new FormData();
    Object.entries(data).forEach(i => formData.append(i[0], i[1]));
    return formData;
    }
      }
  })();
