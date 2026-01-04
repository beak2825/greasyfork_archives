// ==UserScript==
// @name         makhac| Скрипт для ГС/ЗГС opg/goss cortezz
// @namespace    https://forum.blackrussia.online
// @version      1.2020777
// @description   https://vk.com/trukidss
// @author       rich cortezz
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://forum.blackrussia.online/threads/
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468650/makhac%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20opggoss%20cortezz.user.js
// @updateURL https://update.greasyfork.org/scripts/468650/makhac%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20opggoss%20cortezz.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const CLOSE_PREFIX = 7; // Prefix that will be set when thread closes.
const WATCHED_PREFIX = 9;
const buttons = [
    { title: 'Приветствие',
      content:
        '[SIZE=4][COLOR=rgb(178, 22, 54)][I][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/I][/COLOR][/SIZE]',
      },
    {
	  title: '|💗 _________Раздел Жалобы на лидеров_________ 💗|',
      },
    {
	  title: '| 🔪_________Рассмотрения_________🔪 |',
      },
    {
	  title: '|🚬 На рассмотрение 🚬|',
	  content:
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vB8yMYnX/9f2b06d764b68e438665c4e63130a371-1.png[/img][/url][/CENTER]' +
		"[FONT=TIMES NEW ROMAN][B][CENTER][COLOR=lavender]Ваша жалоба взята на рассмотрение, не создавайте дубликатов и ожидайте ответа от администрации.<br><br>"+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7Zm89vd2/b6faf30224d1ac7a7fb9eb4922637cc8.png[/img][/url][/CENTER]' +
		'[B][CENTER][COLOR=yellow]На рассмотрении[/COLOR][/CENTER][/B]'+
	"[COLOR=lavender]С уважением ЗГС ГОСС [/COLOR][URL='https://vk.com/trukidss'][COLOR=lavender]Rich Cortezz[/COLOR][/URL][/FONT][/CENTER]<br> ", 
	  prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: '| 🔪🚬Запрос докв от ЛД🚬🔪 |',
	  content:
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vB8yMYnX/9f2b06d764b68e438665c4e63130a371-1.png[/img][/url][/CENTER]' +
		"[FONT=TIMES NEW ROMAN][B][CENTER][COLOR=lavender]Запрошу доказательства у лидера, не создавайте дубликатов и ожидайте ответа от администрации.<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7Zm89vd2/b6faf30224d1ac7a7fb9eb4922637cc8.png[/img][/url][/CENTER]' +
		'[B][CENTER][COLOR=yellow]На рассмотрении[/COLOR][/CENTER][/B]'+
			"[COLOR=lavender]С уважением ЗГС ГОСС [/COLOR][URL='https://vk.com/trukidss'][COLOR=lavender]Rich Cortezz[/COLOR][/URL][/FONT][/CENTER]<br>" , 
	  prefix: PIN_PREFIX,
	  status: true,
	},
      {
	  title: '| ❌_________ОТКАЗЫ_________ ❌|',
	},
    {
	  title: '|❌ Не по форме ❌|',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vB8yMYnX/9f2b06d764b68e438665c4e63130a371-1.png[/img][/url][/CENTER]' +
		"[FONT=TIMES NEW ROMAN][B][CENTER][COLOR=lavender] Вашa жалобa составленa не по форме, пожалуйста ознакомьтесь с правилами подачи жалоб.<br><br>"+
		"[CENTER][B] [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-лидеров.1426115/'][Color=lavender]Правила подачи жалоб[/URL] <br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7Zm89vd2/b6faf30224d1ac7a7fb9eb4922637cc8.png[/img][/url][/CENTER]' +
		'[B][CENTER][COLOR=RED]Отказано[/COLOR][/CENTER][/B]'+
			"[COLOR=lavender]С уважением ЗГС ГОСС [/COLOR][URL='https://vk.com/trukidss'][COLOR=lavender]Rich Cortezz[/COLOR][/URL][/FONT][/CENTER]<br>" , 
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| ❌Заголовок не по форме |❌',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vB8yMYnX/9f2b06d764b68e438665c4e63130a371-1.png[/img][/url][/CENTER]' +
		"[FONT=TIMES NEW ROMAN][B][CENTER][COLOR=lavender]Заголовок у Вашей жалобы составлен не по форме, пожалуйста ознакомьтесь с правилами подачи жалоб.<br><br>"+
		"[CENTER][B] [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-лидеров.1426115/'][Color=lavender]Правила подачи жалоб[/URL] <br>"+
	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7Zm89vd2/b6faf30224d1ac7a7fb9eb4922637cc8.png[/img][/url][/CENTER]' +
		'[B][CENTER][COLOR=RED]Отказано[/COLOR][/CENTER][/B]'+
			"[COLOR=lavender]С уважением ЗГС ГОСС [/COLOR][URL='https://vk.com/trukidss'][COLOR=lavender]Rich Cortezz[/COLOR][/URL][/FONT][/CENTER]<br>" , 
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '🔪 Верно выдал 🔪',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vB8yMYnX/9f2b06d764b68e438665c4e63130a371-1.png[/img][/url][/CENTER]' +
		"[FONT=TIMES NEW ROMAN][B][CENTER][COLOR=lavender]Проверив доказательства у лидера, наказание было выдано [COLOR=green][ICODE]ВЕРНО.[/ICODE]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7Zm89vd2/b6faf30224d1ac7a7fb9eb4922637cc8.png[/img][/url][/CENTER]' +
		'[B][CENTER][COLOR=red]Закрыто[/COLOR][/CENTER][/B]'+
			"[COLOR=lavender]С уважением ЗГС ГОСС [/COLOR][URL='https://vk.com/trukidss'][COLOR=lavender]Rich Cortezz[/COLOR][/URL][/FONT][/CENTER]<br>" , 
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: '🔪не туда попали 🔪',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vB8yMYnX/9f2b06d764b68e438665c4e63130a371-1.png[/img][/url][/CENTER]' +
		"[FONT=TIMES NEW ROMAN][B][CENTER][COLOR=lavender] Вашa жалобa отказана, так как вы ошиблись разделом.<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7Zm89vd2/b6faf30224d1ac7a7fb9eb4922637cc8.png[/img][/url][/CENTER]' +
		'[B][CENTER][COLOR=RED]Отказано[/COLOR][/CENTER][/B]'+
			"[COLOR=lavender]С уважением ЗГС ГОСС [/COLOR][URL='https://vk.com/trukidss'][COLOR=lavender]Rich Cortezz[/COLOR][/URL][/FONT][/CENTER]<br>" , 
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '💀 Нет нарушений 💀',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vB8yMYnX/9f2b06d764b68e438665c4e63130a371-1.png[/img][/url][/CENTER]' +
		"[FONT=TIMES NEW ROMAN][B][CENTER][COLOR=lavender]Со стороны лидера нету нарушения.<br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7Zm89vd2/b6faf30224d1ac7a7fb9eb4922637cc8.png[/img][/url][/CENTER]' +
		'[B][CENTER][COLOR=RED]Отказано[/COLOR][/CENTER][/B]'+
			"[COLOR=lavender]С уважением ЗГС ГОСС [/COLOR][URL='https://vk.com/trukidss'][COLOR=lavender]Rich Cortezz[/COLOR][/URL][/FONT][/CENTER]<br>" , 
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: '💀 Уже был ответ 💀',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vB8yMYnX/9f2b06d764b68e438665c4e63130a371-1.png[/img][/url][/CENTER]' +
		"[FONT=TIMES NEW ROMAN][B][CENTER][COLOR=lavender]Вам был дан ответ в прошлой жалобе.<br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7Zm89vd2/b6faf30224d1ac7a7fb9eb4922637cc8.png[/img][/url][/CENTER]' +
		'[B][CENTER][COLOR=red]Отказано.[/COLOR][/CENTER][/B]'+
			"[COLOR=lavender]С уважением ЗГС ГОСС [/COLOR][URL='https://vk.com/trukidss'][COLOR=lavender]Rich Cortezz[/COLOR][/URL][/FONT][/CENTER]<br>" , 
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '🇺🇸Уже был наказан 🚬',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vB8yMYnX/9f2b06d764b68e438665c4e63130a371-1.png[/img][/url][/CENTER]' +
		"[FONT=TIMES NEW ROMAN][B][CENTER][COLOR=white]Ваша жалоба отказана, т.к лидер уже был наказан ранее.<br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7Zm89vd2/b6faf30224d1ac7a7fb9eb4922637cc8.png[/img][/url][/CENTER]' +
		'[B][CENTER][COLOR=red]Закрыто.[/COLOR][/CENTER][/B]'+
			"[COLOR=lavender]С уважением ЗГС ГОСС [/COLOR][URL='https://vk.com/trukidss'][COLOR=lavender]Rich Cortezz[/COLOR][/URL][/FONT][/CENTER]<br>" , 
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: '🔪 Был снят 🔪',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vB8yMYnX/9f2b06d764b68e438665c4e63130a371-1.png[/img][/url][/CENTER]' +
		"[FONT=TIMES NEW ROMAN][B][CENTER][COLOR=lavender]Данный лидер был cнят со своего поста.<br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7Zm89vd2/b6faf30224d1ac7a7fb9eb4922637cc8.png[/img][/url][/CENTER]' +
		'[B][CENTER][COLOR=red]Закрыто.[/COLOR][/CENTER][/B]'+
			"[COLOR=lavender]С уважением ЗГС ГОСС [/COLOR][URL='https://vk.com/trukidss'][COLOR=lavender]Rich Cortezz[/COLOR][/URL][/FONT][/CENTER]<br>" , 
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
 
        title: '🔪 Не ЛД 🔪',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vB8yMYnX/9f2b06d764b68e438665c4e63130a371-1.png[/img][/url][/CENTER]' +
		"[FONT=TIMES NEW ROMAN][B][CENTER][COLOR=lavender]Данный человек не является лидером.<br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7Zm89vd2/b6faf30224d1ac7a7fb9eb4922637cc8.png[/img][/url][/CENTER]' +
		'[B][CENTER][COLOR=red]Закрыто.[/COLOR][/CENTER][/B]'+
			"[COLOR=lavender]С уважением ЗГС ГОСС [/COLOR][URL='https://vk.com/trukidss'][COLOR=lavender]Rich Cortezz[/COLOR][/URL][/FONT][/CENTER]<br>" , 
	  prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
	  title: '|🌠 _________Доказательства_________ 🌠|',
      },
    {
	  title: '🔪 Прошло 48 часов 🔪',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vB8yMYnX/9f2b06d764b68e438665c4e63130a371-1.png[/img][/url][/CENTER]' +
		"[FONT=TIMES NEW ROMAN][B][CENTER][COLOR=lavender]С момента совершения нарушения прошло [COLOR=red][ICODE]48 часов[/ICODE][/COLOR], не подлежит рассмотрению.<br>"+
		"[B][COLOR=lavender]Советуем вам зараннее кидать жалобы, приятной вам игры!<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7Zm89vd2/b6faf30224d1ac7a7fb9eb4922637cc8.png[/img][/url][/CENTER]' +
		'[B][CENTER][COLOR=red]Закрыто[/COLOR][/CENTER][/B]'+
			"[COLOR=lavender]С уважением ЗГС ГОСС [/COLOR][URL='https://vk.com/trukidss'][COLOR=lavender]Rich Cortezz[/COLOR][/URL][/FONT][/CENTER]<br>" , 
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: '🌠 Доква обрываются 🌠',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vB8yMYnX/9f2b06d764b68e438665c4e63130a371-1.png[/img][/url][/CENTER]' +
		"[FONT=TIMES NEW ROMAN][B][CENTER][COLOR=lavender] Доказательства были оборваны, отправьте ещё раз жалобу, но с полной записью, а если вы не до конца записывали фрапс (видео-фиксацию), увы ваша жалоба [COLOR=RED][ICODE] Oтказана.[/ICODE][/COLOR]<br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7Zm89vd2/b6faf30224d1ac7a7fb9eb4922637cc8.png[/img][/url][/CENTER]' +
		'[B][CENTER][COLOR=red]Отказано[/COLOR][/CENTER][/B]'+
			"[COLOR=lavender]С уважением ЗГС ГОСС [/COLOR][URL='https://vk.com/trukidss'][COLOR=lavender]Rich Cortezz[/COLOR][/URL][/FONT][/CENTER]<br>" , 
	  prefix: UNACCEPT_PREFIX,
	  status: false,
 },
     {
	  title: '🌠 Нету док-ва 🌠',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vB8yMYnX/9f2b06d764b68e438665c4e63130a371-1.png[/img][/url][/CENTER]' +
		"[FONT=TIMES NEW ROMAN][B][CENTER][COLOR=lavender]Вы не предоставили доказательства, прикрепите доказательства загруженные на фото/видео хостинг.<br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7Zm89vd2/b6faf30224d1ac7a7fb9eb4922637cc8.png[/img][/url][/CENTER]' +
		'[B][CENTER][COLOR=RED]Отказано[/COLOR][/CENTER][/B]'+
			"[COLOR=lavender]С уважением ЗГС ГОСС [/COLOR][URL='https://vk.com/trukidss'][COLOR=lavender]Rich Cortezz[/COLOR][/URL][/FONT][/CENTER]<br>" , 
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
        title: '🌠 От 3 лица 🌠',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vB8yMYnX/9f2b06d764b68e438665c4e63130a371-1.png[/img][/url][/CENTER]' +
		"[FONT=TIMES NEW ROMAN][B][CENTER][COLOR=lavender] Жалоба составлена от 3-го лица, мы не можем ее рассмотреть.<br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7Zm89vd2/b6faf30224d1ac7a7fb9eb4922637cc8.png[/img][/url][/CENTER]' +
		'[B][CENTER][COLOR=RED]Отказано[/COLOR][/CENTER][/B]'+
			"[COLOR=lavender]С уважением ЗГС ГОСС [/COLOR][URL='https://vk.com/trukidss'][COLOR=lavender]Rich Cortezz[/COLOR][/URL][/FONT][/CENTER]<br>" , 
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
  {
	  title: '🌠 Недостаточно докв 🌠',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vB8yMYnX/9f2b06d764b68e438665c4e63130a371-1.png[/img][/url][/CENTER]' +
		"[FONT=TIMES NEW ROMAN][B][CENTER][COLOR=lavender] Предоставленные доказательства недостаточно для принятия решения или не корректны, если у вас имеют дополнительные доказательства прикрепите.<br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7Zm89vd2/b6faf30224d1ac7a7fb9eb4922637cc8.png[/img][/url][/CENTER]' +
		'[B][CENTER][COLOR=red]Отказано[/COLOR][/CENTER][/B]'+
			"[COLOR=lavender]С уважением ЗГС ГОСС [/COLOR][URL='https://vk.com/trukidss'][COLOR=lavender]Rich Cortezz[/COLOR][/URL][/FONT][/CENTER]<br>" , 
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '🌠Доква отредакт. 🌠',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vB8yMYnX/9f2b06d764b68e438665c4e63130a371-1.png[/img][/url][/CENTER]' +
		"[FONT=TIMES NEW ROMAN][B][CENTER][COLOR=lavender] Доказательства были подвергнуты редактированию - следовательно, рассмотрению не подлежит. <br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7Zm89vd2/b6faf30224d1ac7a7fb9eb4922637cc8.png[/img][/url][/CENTER]' +
		'[B][CENTER][COLOR=red]Отказано[/COLOR][/CENTER][/B]'+
			"[COLOR=lavender]С уважениемЗГС ГОСС [/COLOR][URL='https://vk.com/trukidss'][COLOR=lavender]Rich Cortezz[/COLOR][/URL][/FONT][/CENTER]<br>" , 
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: '🌠Доква в соц-сети 🌠',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vB8yMYnX/9f2b06d764b68e438665c4e63130a371-1.png[/img][/url][/CENTER]' +
		"[FONT=TIMES NEW ROMAN][B][CENTER][COLOR=lavender] Вашa жалобa отказана т.к доказательства загруженные в соцсети не принимаются. Загрузите док-ва в фото/видео хостинги как YouTube, Imgur, Япикс. <br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7Zm89vd2/b6faf30224d1ac7a7fb9eb4922637cc8.png[/img][/url][/CENTER]' +
		'[B][CENTER][COLOR=RED]Отказано[/COLOR][/CENTER][/B]'+
			"[COLOR=lavender]С уважением ЗГС ГОСС [/COLOR][URL='https://vk.com/trukidss'][COLOR=lavender]Rich Cortezz[/COLOR][/URL][/FONT][/CENTER]<br>" , 
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '🌠 Не работает док-во 🌠',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vB8yMYnX/9f2b06d764b68e438665c4e63130a371-1.png[/img][/url][/CENTER]' +
		"[FONT=TIMES NEW ROMAN][B][CENTER][COLOR=lavender]Ваши доказательства не рабочие или же битая ссылка, пожалуйста загрузите на видео/фото хостинге.<br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7Zm89vd2/b6faf30224d1ac7a7fb9eb4922637cc8.png[/img][/url][/CENTER]' +
		'[B][CENTER][COLOR=red]Отказано[/COLOR][/CENTER][/B]'+
			"[COLOR=lavender]С уважением ЗГС ГОСС [/COLOR][URL='https://vk.com/trukidss'][COLOR=lavender]Rich Cortezz[/COLOR][/URL][/FONT][/CENTER]<br>" , 
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '🌠Нету /time 🌠',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vB8yMYnX/9f2b06d764b68e438665c4e63130a371-1.png[/img][/url][/CENTER]' +
		"[FONT=TIMES NEW ROMAN][B][CENTER][COLOR=lavender]В предоставленных доказательств отсутствует время (/time), не подлежит рассмотрению.<br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7Zm89vd2/b6faf30224d1ac7a7fb9eb4922637cc8.png[/img][/url][/CENTER]' +
		'[B][CENTER][COLOR=RED]Отказано[/COLOR][/CENTER][/B]'+
			"[COLOR=lavender]С уважением ЗГС ГОСС [/COLOR][URL='https://vk.com/trukidss'][COLOR=lavender]Rich Cortezz[/COLOR][/URL][/FONT][/CENTER]<br>" , 
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '✅_________Одобрено_________ |',
      },
    {
    title: ' ✅Беседа/пред✅'  , 
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vB8yMYnX/9f2b06d764b68e438665c4e63130a371-1.png[/img][/url][/CENTER]' +
		"[FONT=TIMES NEW ROMAN][B][CENTER][COLOR=lavender]Ваша жалоба была одобрена, с лидером будет проведена беседа.<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7Zm89vd2/b6faf30224d1ac7a7fb9eb4922637cc8.png[/img][/url][/CENTER]' +
		'[B][CENTER][COLOR=#00FA9A]Одобрено[/COLOR][/CENTER][/B]'+
			"[COLOR=lavender]С уважением ЗГС ГОСС [/COLOR][URL='https://vk.com/trukidss'][COLOR=lavender]Rich Cortezz[/COLOR][/URL][/FONT][/CENTER]<br>" , 
	  prefix: ACCEPT_PREFIX,
	  status: false
	},
   {
	  title: '✅ Выг |✅,', 
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vB8yMYnX/9f2b06d764b68e438665c4e63130a371-1.png[/img][/url][/CENTER]' +
		"[FONT=TIMES NEW ROMAN][B][CENTER][COLOR=lavender]Ваша жалоба была одобрена, лидер получит соответствующее наказание.<br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7Zm89vd2/b6faf30224d1ac7a7fb9eb4922637cc8.png[/img][/url][/CENTER]' +
		'[B][CENTER][COLOR=#00FA9A]Одобрено[/COLOR][/CENTER][/B]'+
			"[COLOR=lavender]С уважением ЗГС ГОСС [/COLOR][URL='https://vk.com/trukidss'][COLOR=lavender]Rich Cortezz[/COLOR][/URL][/FONT][/CENTER]<br>" , 
	  prefix: ACCEPT_PREFIX,
	  status: false
   },
    {
	  title: '✅ Снят |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vB8yMYnX/9f2b06d764b68e438665c4e63130a371-1.png[/img][/url][/CENTER]' +
		"[FONT=TIMES NEW ROMAN][B][CENTER][COLOR=lavender]Ваша жалоба была одобрена, лидер будет снят со своего поста.<br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7Zm89vd2/b6faf30224d1ac7a7fb9eb4922637cc8.png[/img][/url][/CENTER]' +
		'[B][CENTER][COLOR=#00FA9A]Одобрено[/COLOR][/CENTER][/B]'+
			"[COLOR=lavender]С уважением ЗГС ГОСС [/COLOR][URL='https://vk.com/trukidss'][COLOR=lavender]Rich Cortezz[/COLOR][/URL][/FONT][/CENTER]<br>" , 
	  prefix: ACCEPT_PREFIX,
	  status: false
    },
    {
	  title: '|✅ Темы,✅|',
        content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vB8yMYnX/9f2b06d764b68e438665c4e63130a371-1.png[/img][/url][/CENTER]' +
		"[FONT=TIMES NEW ROMAN][B][CENTER][COLOR=lavender]Ваша жалоба была одобрена, с лидером будет проведена беседа, [COLOR=GREEN] темы будут отредактированы.<br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7Zm89vd2/b6faf30224d1ac7a7fb9eb4922637cc8.png[/img][/url][/CENTER]' +
		'[B][CENTER][COLOR=#00FA9A]Одобрено[/COLOR][/CENTER][/B]'+
			"[COLOR=lavender]С уважением ЗГС ГОСС [/COLOR][URL='https://vk.com/trukidss'][COLOR=lavender]Rich Cortezz[/COLOR][/URL][/FONT][/CENTER]<br>" , 
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '✅ Удалить тему |',
	  content:
	  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vB8yMYnX/9f2b06d764b68e438665c4e63130a371-1.png[/img][/url][/CENTER]' +
		"[FONT=TIMES NEW ROMAN][B][CENTER][COLOR=lavender]Тема будет удалена.<br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7Zm89vd2/b6faf30224d1ac7a7fb9eb4922637cc8.png[/img][/url][/CENTER]' +
		'[B][CENTER][COLOR=#00FA9A]Закрыто[/COLOR][/CENTER][/B]'+
			"[COLOR=lavender]С уважением ЗГС ГОСС [/COLOR][URL='https://vk.com/trukidss'][COLOR=lavender]Rich Cortezz[/COLOR][/URL][/FONT][/CENTER]<br>" , 
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
{
            title: `Открытия заявок лытка`,
            content:
            
             `[CENTER][SIZE=5][FONT=times new roman][COLOR=lavender] Доброго времени суток, каждый из игроков подходящий по критериям ниже имеет право оставить это заявление, и побороться за лидерство. Помните главное, данный пост это серьезный шаг, делая его Вы соглашаетесь со всеми критериями, а так же понимаете то что должны будете отдавать игре много времени, для поддержания стабильной работы вашей организации. Только после понимания того на что вы идете, пишите это заявление и просим вас не тратить  наше время на то, чтобы проверить бессмысленные заявления! [/COLOR]<br><br>`+
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7Zm89vd2/b6faf30224d1ac7a7fb9eb4922637cc8.png[/img][/url][/CENTER]' +
          `[CENTER][SIZE=5][FONT=times new roman]Критерии для подачи заявления:<br><br>`+
        `Игровой уровень не менее 6-го. <br>`+
          `  Не иметь действующих наказаний. <br>`+
           ` Минимальный суточный онлайн +4 часа. <br>`+
           ` Реальный возраст от 15 лет. <br>`+
           ` Знание правил Role-Play и правила отыгровки RP. <br>`+
           ` Открытый профиль в "VK", дабы была возможность добавлять в беседы. <br><br>`+
 
         ` [COLOR=aquamarine] Примечание:[/COLOR] Если вы не выполнили/не подходите по вышеперечисленным критериям, следящая администрация имеет право вам отказать в заявление на пост «Лидера».<br>`+
 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7Zm89vd2/b6faf30224d1ac7a7fb9eb4922637cc8.png[/img][/url][/CENTER]' +
         `   [COLOR=aquamarine] [CENTER] Форма подачи заявления:[/FONT][/SIZE].<br><br>`+
 
            `[SIZE=6][FONT=times new roman][COLOR=aquamarine] IС информация:[/COLOR] [/FONT][/SIZE].<br>`+
            `[SIZE=5][FONT=times new roman][COLOR=lavender]1)Ваш NickName:.<br>`+
            `2)Ссылка на Role Play биографию:.<br>`+
            `3)Почему именно вы должны занять пост лидера :.<br>`+
            `4) Охарактеризуйте роль лидера :<br>`+
            `5) Какое значение имеет организация/какие функции выполняет:<br>`+
            `6) Имеется ли опыт в данной организации:<br>`+
            `7) Были ли вы лидером любой другой организации: <br><br>`+
 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7Zm89vd2/b6faf30224d1ac7a7fb9eb4922637cc8.png[/img][/url][/CENTER]' +
            `[SIZE=6][FONT=times new roman][COLOR=aquamarine] ООС информация: [/COLOR][/FONT][/SIZE].<br>`+
            `[SIZE=5][FONT=times new roman][COLOR=lavender]1)Ваше реальное имя и фамилия:<br>`+
            `2)Ваш возраст:<br>`+
           `3)Часовой пояс (указать в часах от мск):<br>`+
           `4)Ваш средний суточный онлайн:<br>`+
           `5) Имелись ли Баны/Варны( если да , то за что) : <br> `+
            `6)Расскажите о себе (чем увлекаетесь, занимаетесь в свободное время):<br>`+
          `7)Скриншот статистики с /time : <br> `+
            
            
            `12)Ваш логин в Discord:<br>`+
            `13)Ссылка на Вашу страничку VK:<br><br>`+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vB8yMYnX/9f2b06d764b68e438665c4e63130a371-1.png[/img][/url][/CENTER]' +
            `[COLOR=aquamarine] Примечание:[/COLOR]<br><br>`+
          `  1.[COLOR=lavender] В анкетах всегда поощряется полное описание всего! Меньше воды, больше интересной информации дабы мы могли представить Вас как личность! Заявки(анкеты), это тоже один из важнейших этапов прохождения на пост лидерства, отнеситесь к этому очень серьезно!<br>`+
`2. Чьи анкеты по мнению администрации не несут в себе достаточной информации, могут быть отклонены или удалены без объяснения причины!<br>`+
`3. Все скриншоты должны быть с /time.<br>`+
`4. Скриншоты должны быть сделаны после открытия заявок на пост лидера фракции.<br>`+

 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7Zm89vd2/b6faf30224d1ac7a7fb9eb4922637cc8.png[/img][/url][/CENTER]' +
`Обман администрации даже в анкетах, несет за собой нарушение правил проекта, а именно "2.34. Запрещен обман администрации",<br>`+
`Если, у Вас есть уверенность в том, что Вам действительно нужен данный пост - Вы можете подавать заявку. Если Вы не уверены, что сможете отстоять хотя бы 7 дней, не стоит совершать данный поступок.<br><br>`+
 
`Помните, что при уходе с данного поста, при этом не отстояв срок в 15 дней, Вы получить блокировку аккаунта на 15 дней.[/FONT][/SIZE][/CENTER]<br><br>`+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7Zm89vd2/b6faf30224d1ac7a7fb9eb4922637cc8.png[/img][/url][/CENTER]' +
`[FONT=georgia] [COLOR=aquamarine] Примечание: [/COLOR] После одобрение, с вами свяжится Старшая Администрация. Вам будет необходимо добавить представителя старшей администрации в друзья, после вас добавят в специальную беседу.<br>`+
  `Никто из состава администрации не будет просить у вас все различные пароли, пин-коды, информация о привязках и так далее. Не ведитесь на обманы!`,
 
        },
        {
            title: `Открытия заявок батка`,
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/76pB3KZT/download-13.png[/img][/url][/CENTER]' +
             `[CENTER][SIZE=5][FONT=times new roman][COLOR=lavender] Доброго времени суток, каждый из игроков подходящий по критериям ниже имеет право оставить это заявление, и побороться за лидерство. Помните главное, данный пост это серьезный шаг, делая его Вы соглашаетесь со всеми критериями, а так же понимаете то что должны будете отдавать игре много времени, для поддержания стабильной работы вашей организации. Только после понимания того на что вы идете, пишите это заявление и просим вас не тратить  наше время на то, чтобы проверить бессмысленные заявления! [/COLOR]<br><br>`+
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7Zm89vd2/b6faf30224d1ac7a7fb9eb4922637cc8.png[/img][/url][/CENTER]' +
          `[CENTER][SIZE=5][FONT=times new roman]Критерии для подачи заявления:<br><br>`+
        `Игровой уровень не менее 10-го. <br>`+
          `  Не иметь действующих наказаний. <br>`+
           ` Минимальный суточный онлайн +4 часа. <br>`+
           ` Реальный возраст от 15 лет (Исключение даются в крайних случаях). <br>`+
           ` Знание правил Role-Play и правила отыгровки RP. <br>`+
           ` Открытый профиль в "VK", дабы была возможность добавлять в беседы. <br><br>`+
 
         ` [COLOR=aquamarine] Примечание:[/COLOR] Если вы не выполнили/не подходите по вышеперечисленным критериям, следящая администрация имеет право вам отказать в заявление на пост «Лидера».<br>`+
 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7Zm89vd2/b6faf30224d1ac7a7fb9eb4922637cc8.png[/img][/url][/CENTER]' +
         `   [COLOR=aquamarine] [CENTER] Форма подачи заявления:[/FONT][/SIZE].<br><br>`+
 
            `[SIZE=6][FONT=times new roman][COLOR=aquamarine] IС информация:[/COLOR] [/FONT][/SIZE].<br>`+
            `[SIZE=5][FONT=times new roman][COLOR=lavender]1)Ваш NickName:.<br>`+
            `2)Ваш игровой уровень:.<br>`+
            `3)Ваша статистика (/stats):.<br>`+
            `4)Скриншот лицензий (/lic):<br>`+
            `5)Скриншот истории смены игровых NickName'ов (/history):<br>`+
            `6)Ваша RolePlay биография [Одобренная]:[/FONT][/SIZE].<br><br>`+
 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7Zm89vd2/b6faf30224d1ac7a7fb9eb4922637cc8.png[/img][/url][/CENTER]' +
            `[SIZE=6][FONT=times new roman][COLOR=aquamarine] ООС информация: [/COLOR][/FONT][/SIZE].<br>`+
            `[SIZE=5][FONT=times new roman][COLOR=lavender]1)Ваше реальное имя и фамилия:<br>`+
            `2)Ваш возраст:<br>`+
            `3)Страна город/страна проживания:<br>`+
           `4)Часовой пояс (указать в часах от мск):<br>`+
           `5)Ваш средний суточный онлайн:<br>`+
            `6)Расскажите о себе (чем увлекаетесь, занимаетесь в свободное время):<br>`+
            `7)Почему именно вы должны занять данный пост, и администрация должна выбрать именно вас?:<br>`+
            `8)Имеется ли опыт на посту лидера:<br>`+
            `9)Эксклюзивные, оригинальные предложения по улучшению/изменениям во фракции:<br>`+
            `10)Представьте ситуацию - У вас завязался сильный конфликт с лидером другой организации, ваши действия и рассуждения в данной ситуации? Как Вы будете решать эту ситуацию?:<br>`+
            `11)Вы сможете удерживать members 10+ стабильно?:<br>`+
            `12)Ваш логин в Discord:<br>`+
            `13)Ссылка на Вашу страничку VK:<br><br>`+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vB8yMYnX/9f2b06d764b68e438665c4e63130a371-1.png[/img][/url][/CENTER]' +
            `[COLOR=aquamarine] Примечание:[/COLOR]<br><br>`+
          `  1.[COLOR=lavender] В анкетах всегда поощряется полное описание всего! Меньше воды, больше интересной информации дабы мы могли представить Вас как личность! Заявки(анкеты), это тоже один из важнейших этапов прохождения на пост лидерства, отнеситесь к этому очень серьезно!<br>`+
`2. Чьи анкеты по мнению администрации не несут в себе достаточной информации, могут быть отклонены или удалены без объяснения причины!<br>`+
`3. Все скриншоты должны быть с /time.<br>`+
`4. Скриншоты должны быть сделаны после открытия заявок на пост лидера фракции.<br>`+
`5. Ваша страница в ВК не должна быть "Фейком".<br>`+
`6. Нельзя занимать места в заявках. За нарушение этого, Ваше сообщение будет удалено.<br>`+
 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7Zm89vd2/b6faf30224d1ac7a7fb9eb4922637cc8.png[/img][/url][/CENTER]' +
`Обман администрации даже в анкетах, несет за собой нарушение правил проекта, а именно "2.34. Запрещен обман администрации",<br>`+
`Если, у Вас есть уверенность в том, что Вам действительно нужен данный пост - Вы можете подавать заявку. Если Вы не уверены, что сможете отстоять хотя бы 7 дней, не стоит совершать данный поступок.<br><br>`+
 
`Помните, что при уходе с данного поста, при этом не отстояв срок в 15 дней, Вы получить блокировку аккаунта на 15 дней.[/FONT][/SIZE][/CENTER]<br><br>`+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7Zm89vd2/b6faf30224d1ac7a7fb9eb4922637cc8.png[/img][/url][/CENTER]' +
`[FONT=georgia] [COLOR=aquamarine] Примечание: [/COLOR] После одобрение, с вами свяжится Старшая Администрация. Вам будет необходимо добавить представителя старшей администрации в друзья, после вас добавят в специальную беседу.<br>`+
  `Никто из состава администрации не будет просить у вас все различные пароли, пин-коды, информация о привязках и так далее. Не ведитесь на обманы!`,
 
        },
        {
            title: `Открытия заявок арз`,
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9fDtLySP/download-12.png[/img][/url][/CENTER]' +
             `[CENTER][SIZE=5][FONT=times new roman][COLOR=lavender] Доброго времени суток, каждый из игроков подходящий по критериям ниже имеет право оставить это заявление, и побороться за лидерство. Помните главное, данный пост это серьезный шаг, делая его Вы соглашаетесь со всеми критериями, а так же понимаете то что должны будете отдавать игре много времени, для поддержания стабильной работы вашей организации. Только после понимания того на что вы идете, пишите это заявление и просим вас не тратить  наше время на то, чтобы проверить бессмысленные заявления! [/COLOR]<br><br>`+
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7Zm89vd2/b6faf30224d1ac7a7fb9eb4922637cc8.png[/img][/url][/CENTER]' +
          `[CENTER][SIZE=5][FONT=times new roman]Критерии для подачи заявления:<br><br>`+
        `Игровой уровень не менее 10-го. <br>`+
          `  Не иметь действующих наказаний. <br>`+
           ` Минимальный суточный онлайн +4 часа. <br>`+
           ` Реальный возраст от 15 лет (Исключение даются в крайних случаях). <br>`+
           ` Знание правил Role-Play и правила отыгровки RP. <br>`+
           ` Открытый профиль в "VK", дабы была возможность добавлять в беседы. <br><br>`+
 
         ` [COLOR=aquamarine] Примечание:[/COLOR] Если вы не выполнили/не подходите по вышеперечисленным критериям, следящая администрация имеет право вам отказать в заявление на пост «Лидера».<br>`+
 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7Zm89vd2/b6faf30224d1ac7a7fb9eb4922637cc8.png[/img][/url][/CENTER]' +
         `   [COLOR=aquamarine] [CENTER] Форма подачи заявления:[/FONT][/SIZE].<br><br>`+
 
            `[SIZE=6][FONT=times new roman][COLOR=aquamarine] IС информация:[/COLOR] [/FONT][/SIZE].<br>`+
            `[SIZE=5][FONT=times new roman][COLOR=lavender]1)Ваш NickName:.<br>`+
            `2)Ваш игровой уровень:.<br>`+
            `3)Ваша статистика (/stats):.<br>`+
            `4)Скриншот лицензий (/lic):<br>`+
            `5)Скриншот истории смены игровых NickName'ов (/history):<br>`+
            `6)Ваша RolePlay биография [Одобренная]:[/FONT][/SIZE].<br><br>`+
 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7Zm89vd2/b6faf30224d1ac7a7fb9eb4922637cc8.png[/img][/url][/CENTER]' +
            `[SIZE=6][FONT=times new roman][COLOR=aquamarine] ООС информация: [/COLOR][/FONT][/SIZE].<br>`+
            `[SIZE=5][FONT=times new roman][COLOR=lavender]1)Ваше реальное имя и фамилия:<br>`+
            `2)Ваш возраст:<br>`+
            `3)Страна город/страна проживания:<br>`+
           `4)Часовой пояс (указать в часах от мск):<br>`+
           `5)Ваш средний суточный онлайн:<br>`+
            `6)Расскажите о себе (чем увлекаетесь, занимаетесь в свободное время):<br>`+
            `7)Почему именно вы должны занять данный пост, и администрация должна выбрать именно вас?:<br>`+
            `8)Имеется ли опыт на посту лидера:<br>`+
            `9)Эксклюзивные, оригинальные предложения по улучшению/изменениям во фракции:<br>`+
            `10)Представьте ситуацию - У вас завязался сильный конфликт с лидером другой организации, ваши действия и рассуждения в данной ситуации? Как Вы будете решать эту ситуацию?:<br>`+
            `11)Вы сможете удерживать members 10+ стабильно?:<br>`+
            `12)Ваш логин в Discord:<br>`+
            `13)Ссылка на Вашу страничку VK:<br><br>`+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vB8yMYnX/9f2b06d764b68e438665c4e63130a371-1.png[/img][/url][/CENTER]' +
            `[COLOR=aquamarine] Примечание:[/COLOR]<br><br>`+
          `  1.[COLOR=lavender] В анкетах всегда поощряется полное описание всего! Меньше воды, больше интересной информации дабы мы могли представить Вас как личность! Заявки(анкеты), это тоже один из важнейших этапов прохождения на пост лидерства, отнеситесь к этому очень серьезно!<br>`+
`2. Чьи анкеты по мнению администрации не несут в себе достаточной информации, могут быть отклонены или удалены без объяснения причины!<br>`+
`3. Все скриншоты должны быть с /time.<br>`+
`4. Скриншоты должны быть сделаны после открытия заявок на пост лидера фракции.<br>`+
`5. Ваша страница в ВК не должна быть "Фейком".<br>`+
`6. Нельзя занимать места в заявках. За нарушение этого, Ваше сообщение будет удалено.<br>`+
 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7Zm89vd2/b6faf30224d1ac7a7fb9eb4922637cc8.png[/img][/url][/CENTER]' +
`Обман администрации даже в анкетах, несет за собой нарушение правил проекта, а именно "2.34. Запрещен обман администрации",<br>`+
`Если, у Вас есть уверенность в том, что Вам действительно нужен данный пост - Вы можете подавать заявку. Если Вы не уверены, что сможете отстоять хотя бы 7 дней, не стоит совершать данный поступок.<br><br>`+
 
`Помните, что при уходе с данного поста, при этом не отстояв срок в 15 дней, Вы получить блокировку аккаунта на 15 дней.[/FONT][/SIZE][/CENTER]<br><br>`+
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7Zm89vd2/b6faf30224d1ac7a7fb9eb4922637cc8.png[/img][/url][/CENTER]' +
`[FONT=georgia] [COLOR=aquamarine] Примечание: [/COLOR] После одобрение, с вами свяжится Старшая Администрация. Вам будет необходимо добавить представителя старшей администрации в друзья, после вас добавят в специальную беседу.<br>`+
  `Никто из состава администрации не будет просить у вас все различные пароли, пин-коды, информация о привязках и так далее. Не ведитесь на обманы!`,
 
        },
 

 


        ];
    $(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
	// Добавление кнопок при загрузке страницы
    
		addButton('ОТВЕТЫЫЫЫ', 'selectAnswer');
 
	// Поиск информации о теме
	const threadData = getThreadData();
 
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(UNACCEPT_PREFIX, false));
 
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
	   ?'Доброе утро'
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
}
})();