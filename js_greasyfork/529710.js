// ==UserScript==
// @name          КФ ЖБ  |  IZHEVSK
// @namespace      http://tampermonkey.net/
// @version      1.9.7
// @description  Бета скрипт
// @author       Yutaev S.
// @match        https://forum.blackrussia.online/threads/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/529710/%D0%9A%D0%A4%20%D0%96%D0%91%20%20%7C%20%20IZHEVSK.user.js
// @updateURL https://update.greasyfork.org/scripts/529710/%D0%9A%D0%A4%20%D0%96%D0%91%20%20%7C%20%20IZHEVSK.meta.js
// ==/UserScript==


(function() {
    'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RASSMOTENO_PREFIX = 9; // Prefix that will be set when solving the problem
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SPECY_PREFIX = 11;
const TEX_PREFIX = 13;
const buttons = [
     {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Передать жалобу╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
      {
      title: ' Главному администратору',
      content:
		'[CENTER][SIZE=4][FONT=georgia][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        "[FONT=georgia][SIZE=4] Ваша жалоба была передана на рассмотрение Главному Администратору. FONT][/CENTER] <br>" +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=georgia][COLOR=#00BFFF][SIZE=4]Ожидайте ответа.[/COLOR][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: true,
    },
      {
      title: 'Специальному администратору',
      content:
		'[CENTER][SIZE=4][FONT=georgia][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        "[FONT=georgia][SIZE=4]Ваша жалоба была передана на рассмотрение Техническому Специалисту.[/FONT][/CENTER] <br>" +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=georgia][COLOR=#00BFFF][SIZE=4]Ожидайте его ответа.[/COLOR][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: true,
    },
      {
      title: 'Техническому специалисту',
      content:
		'[CENTER][SIZE=4][FONT=georgia][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        "[FONT=georgia][SIZE=4]Ваша жалоба была передана на рассмотрение Техническому Специалисту.[/FONT][/CENTER] <br>" +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=georgia][COLOR=#00BFFF][SIZE=4]Ожидайте его ответа.[/COLOR][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: 'На рассмотрении',
      content:
		'[CENTER][SIZE=4][FONT=georgia][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        "[FONT=georgia][SIZE=4] Ваша жалоба взята на рассмотрение. [/FONT][/CENTER] <br>" +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=georgia][COLOR=#00BFFF][SIZE=4] Не нужно создавать копии данной темы. <br>В противном случае Вам будет выдана блокировка ФА. COLOR][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: true,
    },
   {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Перенаправить в раздел ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
{
      title: 'Жалобы на Лидера',
      content:
		'[CENTER][I][SIZE=4][FONT=georgia][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFFFF][SIZE=4] Данный игрок является лидером.< br>Обратитесь в раздел Жалоб на лидеров- [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.3766/']*Нажмите*[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title:'Жалобы на Технического Спецаилиста',
      content:
		'[CENTER][I][SIZE=4][FONT=georgia][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFFFF][SIZE=4] Данный игрок является Техническим Специалистом.< br>Вам было выдано наказания Техническим специалистом, вы можете написать жалобу/обжалование здесь [URL='https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9685-izhevsk.3746/']*Нажмите*[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },

{
      title: 'Обжалование наказаний',
      content:
		'[CENTER][I][SIZE=4][FONT=georgia][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFFFF][SIZE=4] Внимательно ознакомившись с вашей жалобой, было решено, что вам нужно обраться в раздел Обжалований наказаний [URL='https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.3768/']*Нажмите*[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
{
      title: 'Ошиблись сервером',
      content:
		'[CENTER][I][SIZE=4][FONT=georgia][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5 Вы ошиблись сервером .<br> Найдите в списке серверов нужный вам сервер.- *[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
{
      title: 'Жалобы на Администрацию',
      content:
		'[CENTER][I][SIZE=4][FONT=georgia][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFFFF][SIZE=4] Данный игрок администратором.< br>Обратитесь в раздел Жалоб на администрацию- [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.3765/']*Нажмите*[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title:'Технический раздел IZHEVSK',
      content:
		'[CENTER][I][SIZE=4][FONT=georgia][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFFFF][SIZE=4] Оставьте заявление в Техническом Разделе< br>Так же ознакомтесь с правилами подачи [URL='https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-izhevsk.3747/']*Нажмите*[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отказать жалобу ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
{
      title: 'не по форме',
      content:
		'[CENTER][B][SIZE=4][FONT=georgia][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE]<br><br>' +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        "[FONT=georgia][SIZE=4]Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться с правилами подачи жалоб на игроков - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.193395 /']*Тык*[/URL] [/FONT][CENTER] <br>" +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        '[CENTER][B][FONT=georgia][COLOR=#00BFFF][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
{
      title: 'Недостаточно док-в',
      content:
		'[CENTER][B][SIZE=4][FONT=georgia][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE]<br><br>' +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        "[FONT=georgia][SIZE=4] Недостаточно доказательств на нарушение от данного игрока.<br>Доказательства должны быть предоставлены в хорошем качестве и с полным процессом сделки или нарушения от какого-либо игрока. [/URL] [/FONT][CENTER] <br>" +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        '[CENTER][B][FONT=georgia][COLOR=#00BFFF][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
{
      title: 'Ответ уже дан в прошл.',
      content:
'[CENTER][B][SIZE=4][FONT=georgia][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE]<br><br>' +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        "[FONT=georgia][SIZE=4] Ответ был дан в прошлой жалобе. [/URL] [/FONT][CENTER] <br>" +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        '[CENTER][B][FONT=georgia][COLOR=#00BFFF][SIZE=4] Закрыто. Оказано.  [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
{
      title: 'Нет тайм-кодов.',
      content:
'[CENTER][B][SIZE=4][FONT=georgia][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE]<br><br>' +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        "[FONT=georgia][SIZE=4] Ваша жалоба отказана, так как в ней отсутствуют тайм-коды[/URL] [/FONT][CENTER] <br>" +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        '[CENTER][B][FONT=georgia][COLOR=#00BFFF][SIZE=4] Закрыто. Оказано.  [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
{
      title: 'Более 72 часов',
      content:
'[CENTER][B][SIZE=4][FONT=georgia][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE]<br><br>' +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        "[FONT=georgia][SIZE=4] С момента получения наказания прошло более 72 часов. [/URL] [/FONT][CENTER] <br>" +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        '[CENTER][B][FONT=georgia][COLOR=#00BFFF][SIZE=4] Закрыто. Оказано.  [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
{
      title: 'Нет условий сделки',
      content:
'[CENTER][B][SIZE=4][FONT=georgia][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE]<br><br>' +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        "[FONT=georgia][SIZE=4] В данных доказательствах отсутствуют условия сделки. [/URL] [/FONT][CENTER] <br>" +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        '[CENTER][B][FONT=georgia][COLOR=#00BFFF][SIZE=4] Закрыто. Оказано.  [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
{
      title: 'Видео-фиксация',
      content:
'[CENTER][B][SIZE=4][FONT=georgia][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE]<br><br>' +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        "[FONT=georgia][SIZE=4] В таких случаях нужна видеофиксация.  [/URL] [/FONT][CENTER] <br>" +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        '[CENTER][B][FONT=georgia][COLOR=#00BFFF][SIZE=4] Закрыто. Оказано.  [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
{
      title: 'Неполный фрапс',
      content:
'[CENTER][B][SIZE=4][FONT=georgia][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE]<br><br>' +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        "[FONT=georgia][SIZE=4] Предоставленное видео обрывается.<br>Загрузите полные видеодоказательства на разрешенные соц. сети. [/URL] [/FONT][CENTER] <br>" +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        '[CENTER][B][FONT=georgia][COLOR=#00BFFF][SIZE=4] Закрыто. Оказано.  [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
{
      title: 'Нет док-в',
      content:
'[CENTER][B][SIZE=4][FONT=georgia][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE]<br><br>' +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        "[FONT=georgia][SIZE=4]  В данной жалобе отсутствуют доказательства.[/URL] [/FONT][CENTER] <br>" +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        '[CENTER][B][FONT=georgia][COLOR=#00BFFF][SIZE=4] Закрыто. Оказано.  [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
{
      title: 'Док-ва не рабочие',
      content:
'[CENTER][B][SIZE=4][FONT=georgia][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE]<br><br>' +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        "[FONT=georgia][SIZE=4]  Ваши доказательства не рабочие или битая ссылка, пожалуйста, загрузите доказательства на фото/видео хостинге.  [/URL] [/FONT][CENTER] <br>" +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        '[CENTER][B][FONT=georgia][COLOR=#00BFFF][SIZE=4] Закрыто. Оказано.  [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },


{
      title: 'Док-ва отредактированы',
      content:
'[CENTER][B][SIZE=4][FONT=georgia][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE]<br><br>' +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        "[FONT=georgia][SIZE=4]  Ваши доказательства отредактированы. [/URL] [/FONT][CENTER] <br>" +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        '[CENTER][B][FONT=georgia][COLOR=#00BFFF][SIZE=4] Закрыто. Оказано.  [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
{
      title: 'От 3-го лица',
      content:
'[CENTER][B][SIZE=4][FONT=georgia][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE]<br><br>' +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        "[FONT=georgia][SIZE=4]  Жалобы от 3-их лиц не рассматриваются. [/URL] [/FONT][CENTER] <br>" +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        '[CENTER][B][FONT=georgia][COLOR=#00BFFF][SIZE=4] Закрыто. Оказано.  [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
{
      title: 'Обрываются ' ,
      content:
'[CENTER][B][SIZE=4][FONT=georgia][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE]<br><br>' +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        "[FONT=georgia][SIZE=4] Ваша видеозапись обрывается. Загрузите полную видеозапись на видео-хостинг YouTube. [/URL] [/FONT][CENTER] <br>" +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        '[CENTER][B][FONT=georgia][COLOR=#00BFFF][SIZE=4] Закрыто. Оказано.  [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
{
      title: ' Док-ва с соц. ',
      content:
'[CENTER][B][SIZE=4][FONT=georgia][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE]<br><br>' +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        "[FONT=georgia][SIZE=4] Доказательства в социальных сетях и т.д. не принимаются. <br>Загрузите доказательства на фото-видео хостинги YouTube,Imgur, Yapx и так далее. [/URL] [/FONT][CENTER] <br>" +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        '[CENTER][B][FONT=georgia][COLOR=#00BFFF][SIZE=4] Закрыто. Оказано.  [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
{
      title: ' Был наказан',
      content:
'[CENTER][B][SIZE=4][FONT=georgia][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE]<br><br>' +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        "[FONT=georgia][SIZE=4] ] Ваша жалоба отказана <br>Нарушитель уже был наказан ранее. [/URL] [/FONT][CENTER] <br>" +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        '[CENTER][B][FONT=georgia][COLOR=#00BFFF][SIZE=4] Закрыто. Оказано.  [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
   {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Одобрить жалобу ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
{
      title: 'DM',
      content:
		'[CENTER][SIZE=4][FONT=georgia][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        "[FONT=georgia][SIZE=4] Игрок будет наказан по данному пункту правил: <br> 2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | Jail 60 минут<br>  [/FONT][CENTER] <br>Примечание: разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил. <br>Примечание: нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие." +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=georgia][COLOR=#00BFFF][SIZE=4]Приятной игры на сервере[/COLOR] [COLOR=cyan]YELLOW.[/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },

{
      title: 'NonRP поведение',
      content:
		'[CENTER][SIZE=4][FONT=georgia][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        "[FONT=georgia][SIZE=4] Игрок будет наказан по данному пункту правил: <br>Запрещено поведение, нарушающее нормы процессов Role Play режима игры<br>Jail 30 минут" +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=georgia][COLOR=#00BFFF][SIZE=4]Приятной игры на сервере[/COLOR] [COLOR=cyan]YELLOW.[/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
{
      title: 'NonRP обман',
      content:
		'[CENTER][SIZE=4][FONT=georgia][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        "[FONT=georgia][SIZE=4] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики<br>PermBan" +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=georgia][COLOR=#00BFFF][SIZE=4]Приятной игры на сервере[/COLOR] [COLOR=cyan]YELLOW.[/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
{
      title: 'Реклама сторон. ресурсов',
      content:
		'[CENTER][SIZE=4][FONT=georgia][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        "[FONT=georgia][SIZE=4] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное [Color=#FF0000] <br>| Ban 7 дней / PermBan" +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=georgia][COLOR=#00BFFF][SIZE=4]Приятной игры на сервере[/COLOR] [COLOR=cyan]YELLOW.[/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },

{
      title: 'Оск. адм',
      content:
		'[CENTER][SIZE=4][FONT=georgia][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        "[FONT=georgia][SIZE=4] Запрещено введение в заблуждение, обман, оскорбление, неконструктивная критика администрации на всех ресурсах проекта | Ban 7 - 15 дней / PermBan" +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=georgia][COLOR=#00BFFF][SIZE=4]Приятной игры на сервере[/COLOR] [COLOR=cyan]YELLOW.[/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
{
      title: 'CapsLock',
      content:
		'[CENTER][SIZE=4][FONT=georgia][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        "[FONT=georgia][SIZE=4] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [Color=#FF0000]| Mute 30 минут." +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=georgia][COLOR=#00BFFF][SIZE=4]Приятной игры на сервере[/COLOR] [COLOR=cyan]YELLOW.[/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
{
      title: 'Мат в VIP чат',
      content:
		'[CENTER][SIZE=4][FONT=georgia][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        "[FONT=georgia][SIZE=4] Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате  [Color=#FF0000]| Mute 30 минут. " +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=georgia][COLOR=#00BFFF][SIZE=4]Приятной игры на сервере[/COLOR] [COLOR=cyan]YELLOW.[/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
{
      title: 'Выдача себя за адм ',
      content:
		'[CENTER][SIZE=4][FONT=georgia][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        "[FONT=georgia][SIZE=4] Запрещена выдача себя за администратора, если таковым не являетесь [Color=#FF0000]| Ban 7 - 15 + ЧС администрации" +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=georgia][COLOR=#00BFFF][SIZE=4]Приятной игры на сервере[/COLOR] [COLOR=cyan]YELLOW.[/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
{
      title: 'Рекл. промо ',
      content:
		'[CENTER][SIZE=4][FONT=georgia][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        "[FONT=georgia][SIZE=4] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [Color=#FF0000]| Ban 30 дней." +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=georgia][COLOR=#00BFFF][SIZE=4]Приятной игры на сервере[/COLOR] [COLOR=cyan]YELLOW.[/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
{
      title: 'Политика ',
      content:
		'[CENTER][SIZE=4][FONT=georgia][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        "[FONT=georgia][SIZE=4] Запрещено политическое и религиозное пропагандирование [Color=#FF0000]| Mute 120 минут / Ban 10 дней. " +
'[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=georgia][COLOR=#00BFFF][SIZE=4]Приятной игры на сервере[/COLOR] [COLOR=cyan]YELLOW.[/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },



  ];

  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton('На рассмотрение 🍁', 'pin');
    addButton('КП 🐯', 'teamProject');
    addButton('Га 🐰', 'Ga');
    addButton('Спецу 🦁', 'Spec');
    addButton('Одобрено ✅', 'accepted');
    addButton('Отказано ❌', 'unaccept');
    addButton('Тех. Специалисту 🐣', 'Texy');
    addButton('Рассмотрено 👍', 'Rasmotreno');
    addButton('Закрыто 🏚', 'Close');
    addButton('Выбрать ответ для Жалоб', 'selectAnswer');



	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#Ga').click(() => editThreadData(GA_PREFIX, true));
	$('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#Texy').click(() => editThreadData(TEX_PREFIX, true));
	$('button#Rasmotreno').click(() => editThreadData(RASSMOTENO_PREFIX, false));
	$('button#Close').click(() => editThreadData(CLOSE_PREFIX, false));

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
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 0px 20px; border-color: green; border-style: dashed solid; margin-right: 7px; margin-bottom: 10px; background: green; text-decoration-style: wavy;">${name}</button>`,
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

function getFormData(data) {
	const formData = new FormData();
	Object.entries(data).forEach(i => formData.append(i[0], i[1]));
	return formData;
  }
})();