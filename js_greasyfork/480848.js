// ==UserScript==
// @name         Скрипт by Karina_Raskolnikova
// @namespace    https://forum.blackrussia.online
// @version      4.7
// @description  Для упрощённой работы Кураторов Форума Black Russia и рассмотрения жалоб на игроков.
// @author       Karina Raskolnikova
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license 	 MIT
// @collaborator none
// @icon   https://icons.iconarchive.com/icons/aha-soft/iron-man/48/Ironman-Mask-3-Old-icon.png
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/480848/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20by%20Karina_Raskolnikova.user.js
// @updateURL https://update.greasyfork.org/scripts/480848/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20by%20Karina_Raskolnikova.meta.js
// ==/UserScript==
 
(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RASSMOTRENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to Chief Administrator
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to Project Team
const WATCHED_PREFIX = 9;  // Prefix that will be set when thread reviewed by
const CLOSE_PREFIX = 7; // Prefix that will be set when thread closed
const TEXY_PREFIX = 13; // Prefix that will be set when thread send to Technical Specialist
const SPEC_PREFIX = 11; // Prefix that will be set when thread send to Special Administrator
const buttons = [
	{
	   title: '|(-(-(-(-(->╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Передать жалобу╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴<-)-)-)-)-)-|'
	},
    {
      title: 'Одобрено',
	  content:
	    '[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
		"[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]Игрок будет наказан. Благодарим за Ваше обращение! [/COLOR][/FONT][/CENTER]<br><br>" +
		'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qvQHQb4j/online-video-cutter-com.gif[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
{
	  title: `На рассмотрении`,
	  content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
		 "[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]Ваша жалоба взята на рассмотрение. Ожидайте, пожалуйста, ответа от администрации.[/COLOR][/FONT][/CENTER]<br><br>" +
	         '[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sxjpYcty/image.gif[/img][/url]<br>',
	     prefix: PIN_PREFIX,
	     status: true,
	       },
{
      title: 'Теху',
      content:
	'[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
		"[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]Ваша жалоба передана на рассмотрение Техническому Специалисту сервера.[/COLOR][/FONT][/CENTER]<br>" +
		'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tTC3PD0b/image.gif[/img][/url]<br>',
	  prefix: TEXY_PREFIX,
	  status: true,
    },
 {
      title: 'Логи',
	  content:
	     '[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
		"[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]На данный момент мы не можем выдать наказание по данному пункту правил через жалобу, оставленную на форуме.[/COLOR][/FONT][/CENTER]<br><br>" +
		'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
{
        title: 'Уже наказан',
	  content:
	   '[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
	"[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]Данный игрок уже получил наказание по этому пункту.[/COLOR][/FONT][/CENTER]<br><br>" +
	'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
	 {
	  title: '|(-(-(--(->╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Перенаправить╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴<-)--)-)-)-|'
	},
	{
      title: 'Жалобы на Адм',
	  content:
	    '[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
		'[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]Вы ошиблись разделом. Подайте жалобу в раздел "Жалобы На Администрацию".[/COLOR][/FONT][/CENTER]<br><br>' +
		'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
      title: 'Жалобы на Лд',
	  content:
	    '[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
		'[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]Вы ошиблись разделом. Подайте жалобу в раздел "Жалобы На Лидеров".[/COLOR][/FONT][/CENTER]<br><br>' +
		'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
      title: 'Жалобы на С-ГОС',
	  content:
	    '[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
		 '[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]Вы ошиблись разделом. Подайте жалобу в раздел "Жалобы На Сотрудников гос. организаций".[/COLOR][/FONT][/CENTER]<br><br>' +
		'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
      {
      title: 'Не тот сервер',
	  content:
	 '[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
         "[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]Вы ошиблись сервером. Обратитесь в раздел жалоб на игроков Вашего сервера.[/COLOR][/FONT][/CENTER]<br><br>" +
	'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
      title: 'Обжалование',
	  content:
	'[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        '[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]Вы ошиблись разделом. Подайте жалобу в раздел "Обжалование Наказаний".[/COLOR][/FONT][/CENTER]<br><br>' +
	'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
   {
      title: 'Тех.раздел',
	  content:
	 '[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
         "[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]Вы ошиблись разделом. Обратитесь в технический раздел нужного сервера.[/COLOR][/FONT][/CENTER]<br><br>" +
	'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: CLOSE_PREFIX,
	  status: false,
},
{
	 title: '|(-(-(-(-(->╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отказ жалобы╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴<-)-)-)-)-)-|'
},
{
      title: 'Нет доказательств',
	  content:
	    '[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
		"[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]Данная жалоба не подлежит рассмотрению из-за отсутствия каких-либо доказательств.[/COLOR][/FONT][/CENTER]<br><br>" +
		'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
  {
      title: 'Отсутствует /time',
	  content:
	    '[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
		"[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]На доказательствах отсутствует /time.[/COLOR][/FONT][/CENTER]<br><br>" +
		'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
{
      title: 'Не по форме жалоба',
	  content:
	   '[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I]<br><br>' +
	"[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]Ваша жалоба составлена не по форме. Рекомендую ознакомиться с правилами подачи темы.[/COLOR][/FONT][/CENTER]<br><br>" +
	'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
  {
      title: 'Отсутствуют условия сделки',
	  content:
	'[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]В предоставленных доказательствах отсутствуют условия сделки.[/COLOR][/FONT][/CENTER]<br><br>" +
	'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 {
      title: 'Отсутствуют тайм-коды',
	  content:
	     '[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
		"[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]Ваша видеозапись длится более 3-х минут, поэтому необходимо указать тайм-коды.[/COLOR][/FONT][/CENTER]<br><br>" +
		'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Нарушений не найдено',
	  content:
	   '[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
	 "[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]Нарушений со стороны данного игрока не было найдено.[/COLOR][/FONT][/CENTER]<br><br>" +
         '[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Док-ва через соц. сети',
	  content:
	   '[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
           "[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]Доказательства в социальных сетях и т.д. не принимаются. Загрузите доказательства на фото-видео хостинги: YouTube, Imgur, Yapx и т.п.[/COLOR][/FONT][/CENTER]<br><br>" +
	'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Недостаточно док-в',
	  content:
       '[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]Недостаточно доказательств для корректного рассмотрения Вашей жалобы.[/COLOR][/FONT][/CENTER]<br><br>" +
      '[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Нужен фрапс',
	  content:
	     '[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
		"[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]В подобных случаях необходима видеофиксация нарушения.[/COLOR][/FONT][/CENTER]<br><br>" +
		'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
{
      title: 'Неполный фрапс',
	  content:
	    '[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
	 "[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]Фрапс обрывается. Просьба прикрепить полную видеофиксацию нарушения.[/COLOR][/FONT][/CENTER]<br><br>" +
	'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
{
      title: 'Фрапс на дм',
	  content:
	   '[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I]<br><br>' +
	"[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]По данным доказательствам нельзя изучить полную ситуацию, следовательно, наказание не может быть выдано.[/COLOR][/FONT][/CENTER]<br><br>" +
	'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
        title: 'Док-ва отредактированы ',
	  content:
	   '[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
	"[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]Предоставленные доказательства были отредактированы, поэтому жалоба не подлежит рассмотрению.[/COLOR][/FONT][/CENTER]<br><br>" +
	'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
   {
      title: 'Не работают док-ва',
	  content:
	'[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
	"[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]Ваши доказательства не открываются. Просьба повторно подать жалобу, прикрепив другую ссылку.[/COLOR][/FONT][/CENTER]<br><br>" +
	'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	}, 
          {
      title: 'От третьего лица',
	  content:
	'[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
	"[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]Жалобы от третьего лица не принимаются (жалоба должна быть подана участником ситуации).[/COLOR][/FONT][/CENTER]<br><br>" +
	'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Более 3 дней',
	  content:
	    '[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
	"[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]С момента нарушения прошло более 72-ух часов, поэтому жалоба не подлежит рассмотрению.[/COLOR][/FONT][/CENTER]<br><br>" +
	'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
       {
      title: 'Дублирование темы',
	  content:
	'[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
	"[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]Ранее Вам уже был дан корректный ответ на подобную жалобу. Просьба не создавать дубликаты этой темы, иначе Ваш форумный аккаунт может быть заблокирован.[/COLOR][/FONT][/CENTER]<br><br>" +
	'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
{
      title: 'Автокейс',
	  content:
	'[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
	"[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]К Вашему сведению, покупка/продажа автокейса не является NonRp обманом, так как Вы совершаете подобного рода сделки на свой страх и риск.[/COLOR][/FONT][/CENTER]<br><br>" +
	'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	}, 
{
      title: 'Тайм-коды не по форме',
	  content:
	'[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
	"[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]Тайм-коды указаны не по форме. Прошу Вас повторно написать жалобу, указав тайм-коды таким образом: 00:12 - условия сделки, 00:13 - /time и т.д.[/COLOR][/FONT][/CENTER]<br><br>" +
        '[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	}, 
{
      title: 'Недостаточно тайм-кодов',
	  content:
	'[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
	"[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]В Вашей жалобе недостаточно тайм-кодов.[/COLOR][/FONT][/CENTER]<br><br>" +
	'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
         }, 
  {
      title: 'Заголовок не по форме',
	  content:
	     '[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
		"[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]Заголовок Вашей жалобы составлен неправильно. Правильная форма заголовка: Суть жалобы || Nick_Name.[/COLOR][/FONT][/CENTER]<br><br>" +
		'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 {
      title: 'Ники не совпадают',
	  content:
	'[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
	"[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]Ник игрока-нарушителя не совпадает с ником, указанным Вами в жалобе.[/COLOR][/FONT][/CENTER]<br><br>" +
	'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	}, 
{
      title: 'Реклама соц.сети',
	  content:
	'[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
	"[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]Разглашение своей соц.сети НЕ является нарушением.[/COLOR][/FONT][/CENTER]<br><br>" +
	'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	}, 
{
      title: 'Оск в IC',
	  content:
	'[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
	"[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]В регламенте не предусмотрено наказание за оскорбления в IC чате.[/COLOR][/FONT][/CENTER]<br><br>" +
	'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	}, 

{
      title: 'Долг не через банк',
	  content:
	'[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
	"[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]В подобных ситуациях денежные средства должны передаваться на банковский счёт игрока.[/COLOR][/FONT][/CENTER]<br><br>" +
	'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
         }, 
 {
        title: 'Док-ва в плохом качестве',
	  content:
	   '[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
	"[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]Прошу повторно написать жалобу, прикрепив доказательства в более хорошем качестве.[/COLOR][/FONT][/CENTER]<br><br>" +
	'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
        title: 'Не указана сумма сделки',
	  content:
	   '[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
	"[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]В условиях сделки отсутствует сумма доплаты, поэтому жалоба не подлежит рассмотрению.[/COLOR][/FONT][/CENTER]<br><br>" +
	'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
        title: 'Слив склада семьи',
	  content:
	   '[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
	"[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]Прошу предоставить фрапс следующим образом: пропишите /time, откройте меню семьи и покажите логи, выделив моменты нарушений игрока (просто нажав на строки).Также ответьте на вопрос: являетесь ли Вы лидером семьи? Примечание: в описании семьи должны быть указаны условия взаимодействия со складом.[/COLOR][/FONT][/CENTER]<br><br>" +
	'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
        title: 'Не nrp обман',
	  content:
	   '[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
	"[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]Данный вид сделки не является nonRP обманом.[/COLOR][/FONT][/CENTER]<br><br>" +
	'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
        title: 'Слив семьи',
	  content:
	   '[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
	"[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]Слив семьи никак не относится к правилам проекта: то есть если лидер семьи выдал игроку роль заместителя, то только он за это и отвечает.[/COLOR][/FONT][/CENTER]<br><br>" +
	'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
        title: 'Обмен ИВ на BC и наоборот',
	  content:
	   '[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
	"[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]Игрок будет заблокирован за обмен игровой валюты на BC.[/COLOR][/FONT][/CENTER]<br><br>" +
        '[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]Также Ваш аккаунт будет заблокирован согласно пункту 2.28 (Обмен игровой валюты на донат).[/COLOR][/FONT][/CENTER]<br><br>' +
	'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	 title: '|(-(-(-(-(->╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴RolePlay Биографии╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴<-)-)-)-)-)-|'
	},
{
      title: 'Био одобрена',
	  content:
	    '[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
		"[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]Ваша биография получает статус Одобрено! Приятной игры на нашем сервере.[/COLOR][/FONT][/CENTER]<br><br>" +
		'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qvQHQb4j/online-video-cutter-com.gif[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
{
      title: 'Био не по форме',
	  content:
	'[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
	"[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]Ваша биография составлена не по форме. Прошу ознакомиться с правилами подачи темы. [/COLOR][/FONT][/CENTER]<br><br>" +
	'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
         }, 
{
      title: 'Мало инф-ии',
	  content:
	'[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
	"[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]Для Вашего возраста информации в биографии недостаточно. Прошу Вас ознакомиться с правилами подачи темы.[/COLOR][/FONT][/CENTER]<br><br>" +
	'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
         }, 
{
      title: 'Копипаст',
	  content:
	'[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
	"[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]Данная биография была скопирована у другого игрока.[/COLOR][/FONT][/CENTER]<br><br>" +
	'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
         }, 
{
      title: 'Возраст не совпадает',
	  content:
	'[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
	"[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]Указанный Вами возраст не совпадает с датой рождения.[/COLOR][/FONT][/CENTER]<br><br>" +
	'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
         }, 
{
      title: 'Нет 18',
	  content:
	'[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
	"[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]Минимальный возраст для написания биографии - 18 лет. [/COLOR][/FONT][/CENTER]<br><br>" +
	'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
         }, 
{
      title: 'Био заголовок',
	  content:
	'[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
	"[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]Заголовок темы составлен не по форме. Просьба ознакомиться с правилами подачи RP биографий.[/COLOR][/FONT][/CENTER]<br><br>" +
	'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
         },
{
      title: 'Ошибки',
	  content:
	'[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
	"[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]В тексте допущено большое количество грамматических ошибок. Прошу заново создать тему, исправив все неточности.[/COLOR][/FONT][/CENTER]<br><br>" +
	'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
         }, 
{
      title: '3-е лицо',
	  content:
	'[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
	"[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]Повествование в биографии должно вестись от 1-ого лица в соответствии с правилами подачи темы.[/COLOR][/FONT][/CENTER]<br><br>" +
	'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
         },  
{
        title: '2 био на 1 акк',
	  content:
	   '[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
	"[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]Запрещено создавать несколько РП биографии на одном форумном аккаунте.[/COLOR][/FONT][/CENTER]<br><br>" +
	'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
        title: 'nRP ник',
	  content:
	   '[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
	"[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]RP биография не может быть одобрена на nonRP имя. Просьба сменить ник в игре и заново создать тему.[/COLOR][/FONT][/CENTER]<br><br>" +
	'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
        title: 'Возраст 66+',
	  content:
	   '[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
	"[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]Максимальный возраст для написания биографии - 65 лет.[/COLOR][/FONT][/CENTER]<br><br>" +
	'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴РП ситуации╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',

	},
{
      title: 'Рп ситуация одобрена',
	  content:
	    '[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
		"[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]Ваша RP ситуация получает статус Одобрено! Приятной игры на нашем сервере.[/COLOR][/FONT][/CENTER]<br><br>" +
		'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qvQHQb4j/online-video-cutter-com.gif[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
{
      title: 'Оффтоп',
	  content:
	'[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
	"[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]Ваше сообщение не относится к теме раздела. Прошу не оффтопить. [/COLOR][/FONT][/CENTER]<br><br>" +
	'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Hn3XLyvx/image.gif[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
         }, 
{
	title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Неофициальные RP организации ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
	}, 
{
      title: 'Неофициальная орг. одобрена',
	  content:
	    '[CENTER][I][SIZE=4][FONT=arial][COLOR=#00BFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
		"[I][FONT=times new roman][COLOR=#1E90FF][SIZE=5]Ваша неофициальная RP организация получает статус Одобрено! Приятной игры на нашем сервере.[/COLOR][/FONT][/CENTER]<br><br>" +
		'[I][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qvQHQb4j/online-video-cutter-com.gif[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: true,
	},
     ];
 
$(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $(`body`).append(`<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`);
 
        // Добавление кнопок при загрузке страницы
         addButton(`Выбор автоматических ответов`, `selectAnswer`);
        // Поиск информации о теме
        const threadData = getThreadData();
 
        $(`button#pin`).click(() => editThreadData(PIN_PREFIX, true));
        $(`button#accepted`).click(() => editThreadData(ACCEPT_PREFIX, false));
        $(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true));
        $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
        $(`button#watched`).click(() => editThreadData(WATCHED_PREFIX, false));
$(`button#closed`).click(() => editThreadData(CLOSE_PREFIX, false));
         $(`button#specialAdmin`).click(() => editThreadData(SPECIAL_PREFIX, true));
$(`button#mainAdmin`).click(() => editThreadData(GA_PREFIX, true));
$(`button#techspec`).click(() => editThreadData( TECH_PREFIX , true));
 
 
        $(`button#selectAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, `Выберите ответ:`);
            buttons.forEach((btn, id) => {
                if (id > 0) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
                }
            });
        });
    });
 
    function addButton(name, id) {
        $(`.button--icon--reply`).before(
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
            .join(``)}</div>`;
    }
 
    function pasteContent(id, data = {}, send = false) {
        const template = Handlebars.compile(buttons[id].content);
        if ($(`.fr-element.fr-view p`).text() === ``) $(`.fr-element.fr-view p`).empty();
 
        $(`span.fr-placeholder`).empty();
        $(`div.fr-element.fr-view p`).append(template(data));
        $(`a.overlay-titleCloser`).trigger(`click`);
 
        if (send == true) {
            editThreadData(buttons[id].prefix, buttons[id].status);
            $(`.button--icon.button--icon--reply.rippleButton`).trigger(`click`);
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
        const threadTitle = $(`.p-title-value`)[0].lastChild.textContent;
 
        if (pin == false) {
            fetch(`${document.URL}edit`, {
                method: `POST`,
                body: getFormData({
                    prefix_id: prefix,
                    title: threadTitle,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: `json`,
                }),
            }).then(() => location.reload());
        }
        if (pin == true) {
            fetch(`${document.URL}edit`, {
                method: `POST`,
                body: getFormData({
                    prefix_id: prefix,
                    title: threadTitle,
                    sticky: 1,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: `json`,
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