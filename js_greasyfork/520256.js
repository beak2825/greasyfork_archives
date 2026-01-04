// ==UserScript==
// @name         Куратор  ы by Bruce_Banner
// @namespace    https://forum.blackrussia.online
// @version      2.2
// @description  Не читай.
// @author       Bruce_Wayne
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/

// @grant        none
// @license 	 MIT// @collaborator Quenk269
// @icon https://i.postimg.cc/BnxX1pLF/depositphotos-70360381-stock-illustration-illustration-of-scary-red-clown.webp
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/520256/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%20%20%D1%8B%20by%20Bruce_Banner.user.js
// @updateURL https://update.greasyfork.org/scripts/520256/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%20%20%D1%8B%20by%20Bruce_Banner.meta.js
// ==/UserScript==
(function () {
  'use strict';

const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const TEX_PREFIX = 13;
const CLOSE_PREFIX = 7;
const WAITING_PREFIX = 14;
const SPECIAL_PREFIX = 8; // prefix that will be set when thread seng to sa
const buttons = [

    {
		  title: '-----> Раздел:Жалобы на игроков  <------'
    },
    {
	  title: '| На рассмотрение |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9XDYXsM4/razdelitelnaya-liniya-animatsionnaya-kartinka-0098.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=Yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][font=Georgia][COLOR=lavender]Ваша жалоба взята на рассмотрение, пожалуйста не создавайте дубликатов. Ожидайте ответа.<br>"+

           "[url=https://postimages.org/][img]https://i.postimg.cc/9XDYXsM4/razdelitelnaya-liniya-animatsionnaya-kartinka-0098.gif[/img][/url]<br>"+

           '[B][CENTER][COLOR=yellow][ICODE]На рассмотрение[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: PIN_PREFIX,

	  status: false,

	},
    {

	  title: '| Передать ГА |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9XDYXsM4/razdelitelnaya-liniya-animatsionnaya-kartinka-0098.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=lime][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша жалоба переадресована [color=red]Главному Администратору.[COLOR=lavender] Ожидайте ответа в данной теме, копии создавать не нужно.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/9XDYXsM4/razdelitelnaya-liniya-animatsionnaya-kartinka-0098.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=red][ICODE]Передано ГA[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: GA_PREFIX,

	  status: true,
        },
    {
         title: '| Передать СА|',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9XDYXsM4/razdelitelnaya-liniya-animatsionnaya-kartinka-0098.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=lime][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша жалоба была передана [color=red]специальному администратору.[color=lavender] Ожидайте ответа.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/9XDYXsM4/razdelitelnaya-liniya-animatsionnaya-kartinka-0098.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: UNACCEPT_PREFIX,

	  status: true,
	},

    {

	  title: 'Не по форме',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9XDYXsM4/razdelitelnaya-liniya-animatsionnaya-kartinka-0098.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша жалоба составлена не по форме, пожалуйста ознакомьтесь с правилами подачи жалоб.<br><br>"+

		"[CENTER][B][COLOR=RED]| [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/'][Color=lavender]Правила подачи жалоб[/URL] [COLOR=RED]|<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/9XDYXsM4/razdelitelnaya-liniya-animatsionnaya-kartinka-0098.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: CLOSE_PREFIX,

	  status: false,

    },
{
  title: '| Нету тайм коды |',
  content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9XDYXsM4/razdelitelnaya-liniya-animatsionnaya-kartinka-0098.gif[/img][/url]<br>' +
    "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    "[B][CENTER][COLOR=lavender]Ваша видео запись длится более 3 минут, создайте аналогичную жалобу, в которой присутствуют тайм-коды.[/COLOR][/CENTER][/B]<br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/9XDYXsM4/razdelitelnaya-liniya-animatsionnaya-kartinka-0098.gif[/img][/url]<br>" +
    '[B][CENTER][COLOR=red][ICODE]Закрыто[/ICODE][/COLOR][/CENTER][/B]',
  prefix: CLOSE_PREFIX,
  status: false,
},

    {
    title: '|Соц-сети|',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9XDYXsM4/razdelitelnaya-liniya-animatsionnaya-kartinka-0098.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Доказательства с соц-сети не принимаются,  загрузите доказательства в видео/фото хостинге. <br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/9XDYXsM4/razdelitelnaya-liniya-animatsionnaya-kartinka-0098.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: CLOSE_PREFIX,

	  status: false,

	},
    {
       title: '| Угрозы к адм|',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9XDYXsM4/razdelitelnaya-liniya-animatsionnaya-kartinka-0098.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.54 | [color=lavender] Запрещено неуважительное обращение, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [color=red] | Mute 120 мин[/Spoiler]<br>"+

		"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/9XDYXsM4/razdelitelnaya-liniya-animatsionnaya-kartinka-0098.gif[/img][/url]<br>"+

		'[CENTER][B][B][COLOR=green][URL=https://postimages.org/][IMG width="115px"]https://i.postimg.cc/RCsPJL0B/Picsart-23-07-13-20-49-24-880.png[/IMG][/URL][/COLOR][/B][/B][/CENTER]',

	  prefix: ACCEPT_PREFIX,

	  status: false,

    },
    {

	  title: '| Нету док-во |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9XDYXsM4/razdelitelnaya-liniya-animatsionnaya-kartinka-0098.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Вы не предоставили какие либо доказательства, прикрепите доказательства загруженные на фото/видео хостинг.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/9XDYXsM4/razdelitelnaya-liniya-animatsionnaya-kartinka-0098.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: CLOSE_PREFIX,

	  status: false,

    },
    {



  title: '| ФРАКЦ-ТС |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9XDYXsM4/razdelitelnaya-liniya-animatsionnaya-kartinka-0098.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.11. | [color=lavender]  Запрещено использование рабочего или фракционного транспорта в личных целях | [color=red] Jail 30 минут [/Spoiler]<br>"+

		"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/9XDYXsM4/razdelitelnaya-liniya-animatsionnaya-kartinka-0098.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: ACCEPT_PREFIX,

	  status: false,

   },

    {

title: '|Фейк|',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9XDYXsM4/razdelitelnaya-liniya-animatsionnaya-kartinka-0098.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender][font=georgia] Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]4.10| [color=lavender]Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [color=red]| Устное замечание + смена игрового никнейма / PermBan Пример: подменять букву i на L и так далее, по аналогии.[/Spoiler]<br>"+

		"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.[/font]<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/9XDYXsM4/razdelitelnaya-liniya-animatsionnaya-kartinka-0098.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: ACCEPT_PREFIX,

	  status: false,
    },
    {

title: '| Арест в аукционе или казино |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9XDYXsM4/razdelitelnaya-liniya-animatsionnaya-kartinka-0098.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.50 | [color=lavender]  Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий [color=red] | Ban 7 - 15 дней + увольнение из организации [/Spoiler]<br>"+

		"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/9XDYXsM4/razdelitelnaya-liniya-animatsionnaya-kartinka-0098.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: ACCEPT_PREFIX,

	  status: false,
    },
    {
        title: '| Оск адм |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9XDYXsM4/razdelitelnaya-liniya-animatsionnaya-kartinka-0098.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.54 | [color=lavender]  Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации  [color=red] | Mute 180 минут  [/Spoiler]<br>"+

		"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/9XDYXsM4/razdelitelnaya-liniya-animatsionnaya-kartinka-0098.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: ACCEPT_PREFIX,

	  status: false,
    },
    {
        title: '|Одобрить рп биографию|',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9XDYXsM4/razdelitelnaya-liniya-animatsionnaya-kartinka-0098.giff[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша RolePlay - биография[color=green] одобрено. <br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/9XDYXsM4/razdelitelnaya-liniya-animatsionnaya-kartinka-0098.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: ACCEPT_PREFIX,

	  status: false,
    },
    {

title: '| Будет наказан |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/9XDYXsM4/razdelitelnaya-liniya-animatsionnaya-kartinka-0098.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender] Рассмотрев вашу жалобу игрок получит соответствующие наказание в течение 24 часов. <br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/9XDYXsM4/razdelitelnaya-liniya-animatsionnaya-kartinka-0098.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: ACCEPT_PREFIX,

	  status: false,

    },

    {

        title: '| Транслит  |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]3.20 | [color=lavender]  Запрещено использование транслита в любом из чатов | Mute 30 минут [/Spoiler]<br>"+

		"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: ACCEPT_PREFIX,

	  status: false,

    title: '| Транслит  |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]3.20 | [color=lavender]  Запрещено использование транслита в любом из чатов | Mute 30 минут [/Spoiler]<br>"+

		"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: ACCEPT_PREFIX,

	  status: false,

    },

    {

	  title: '| Нет нарушений |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Со стороны игрока не найдены какие либо нарушения, пожалуйста ознакомьтесь с правилами проекта..<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: CLOSE_PREFIX,

	  status: false,

	},

    {

	  title: '| От 3 лица |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Жалоба составлена от 3-го лица, мы не можем ее рассмотреть.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: CLOSE_PREFIX,

	  status: false,

	},

    {
        title: '| Чит софт сборка и тд|',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.22| [color=lavender] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [color=red] | Ban 15/30 /permaban[/Spoiler]<br>"+

		"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: ACCEPT_PREFIX,

	  status: false,
    },
    {
  title: '| Перенаправлено лидеру |',

  content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +
    "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток, уважаемый {{ user.name }}[/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    "[B][CENTER][COLOR=lavender] Для решения данного вопроса обратитесь в раздел жалоб старшего состава.<br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>" +
    '[B][CENTER][COLOR=red][ICODE]Перенаправлено[/ICODE][/COLOR][/CENTER][/B]',

  prefix: CLOSE_PREFIX,

  status: false,
},

    {


	  title: '| Недостаточно док-во |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender] Предоставленных доказательств недостаточно для принятие решения, если у вас имеются дополнительные доказательства прикрепите.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: CLOSE_PREFIX,

	  status: false,

	},

    {

	  title: '| Дубликат |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Вам уже был дан ответ в прошлой жалобе, пожалуйста перестаньте делать дубликаты, иначе ваш Форумный аккаунт будет заблокирован.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: CLOSE_PREFIX,

	  status: false,

	},

	{

	  title: '| Нету /time |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]В предоставленных доказательств отсутствует время (/time) , не подлежит рассмотрению.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=green][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: CLOSE_PREFIX,

	  status: false,

	},

{
  title: '| Нужен фрапс |',
  content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +
    "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    "[B][CENTER][COLOR=lavender]В данной ситуации обязательно должен быть фрапс (видео фиксация) всех моментов, в противном случае жалоба будет отказано.[/COLOR][/CENTER][/B]<br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>" +
    '[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
  prefix: CLOSE_PREFIX,
  status: false,
},

    {

  title: '| Неполный фрапс |',

  content:

'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

"[B][CENTER][COLOR=lavender]К сожалению, видеозапись неполная, и мы вынуждены отказать.<br>"+

"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',

  prefix: CLOSE_PREFIX,

  status: false,

},
    {
        title: '| Нету условия сделки  |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]В видеозаписи нет условии сделки, к сожелению мы вынуждены отказать..<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: CLOSE_PREFIX,

	  status: false,

	},

	{

	  title: '| Не работают док-во |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваши доказательства не рабочие или же битая ссылка, пожалуйста загрузите на видео/фото хостинге.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: CLOSE_PREFIX,

	  status: false,

	},

	{

	  title: '| Дока-во отредактированы |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender] Представленные доказательства были отредактированные или в плохом качестве, пожалуйста прикрепите оригинал.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: CLOSE_PREFIX,

	  status: false,

	},

	{

	  title: '| Прошло 72 часа |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]С момента совершения нарушения прошло 72 часа, не подлежит рассмотрению.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: CLOSE_PREFIX,

	  status: false,

	},

	{

	  title: '| На рассмотрение |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша жалоба взята на рассмотрение, пожалуйста не создавайте дубликатов. Ожидайте ответа.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрение[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: PIN_PREFIX,

	  status: true,

	},
    {
        title: '| Передать КП |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша жалоба была передана [COLOR=yellow] командам проекта. [COLOR=lavender] Ожидайте ответа.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=yellow][ICODE]Передано КП[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: COMMAND_PREFIX,

	  status: true,

    },
    {
    title: '| Передать СА|',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша жалоба была передана [COLOR=red] специальному администратору. [color=lavender] Ожидайте ответа.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=red][ICODE]Передано СА[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: SPECIAL_PREFIX,

	  status: true,
    },
    {

	  title: '| Передать ГА |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша жалоба была передана Главному Администратору, ожидайте ответа.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=red][ICODE]Передано ГА[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: GA_PREFIX,

	  status: true,

	},

	{

	  title: '| Передать Тех |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша жалоба была передана Техническому специалисту сервера. Ожидайте ответа.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=blue][ICODE]Передано Тех[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: TEX_PREFIX,

	  status: true,

	},

	{

	  title: '| DB |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.13 | [color=lavender] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [color=red] | Jail 60 минут. [/Spoiler]<br>"+

		"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: ACCEPT_PREFIX,

	  status: false,

	},

	{
        title: '| nrp Крыша |',

  content:

'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.01 | [color=lavender]Запрещено поведение, нарушающее нормы процессов Role Play режима игры [color=red]| Jail 30 минут[/Spoiler]<br>"+

"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+

"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

  prefix: ACCEPT_PREFIX,

  status: false,

},
{
  title: '| Уход от рп |',

  content:

'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.02 | [color=lavender]Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [color=red] | Jail 30 минут / Warn [/Spoiler]<br>"+

"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+

"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

  prefix: ACCEPT_PREFIX,

  status: false,

},
{
  title: '|  RP отыгровка в свою сторону|',

  content:

'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.06 | [color=lavender]Запрещены любые Role Play отыгровки в свою сторону или пользу [COLOR=RED]| Jail 30 минут [/Spoiler]<br>"+

"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+

"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

  prefix: ACCEPT_PREFIX,

  status: false,

},
{
  title: '|  Амаральные действия|',

  content:

'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.08 | [color=lavender]Запрещена любая форма аморальных действий сексуального характера в сторону игроков [COLOR=RED]| Jail 30 минут / warn [/Spoiler]<br>"+

"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+

"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

  prefix: ACCEPT_PREFIX,

  status: false,

},

{

  title: '| Обман через /do |',

  content:

'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.10  [color=lavender] Запрещено в любой форме обманывать в /do, даже если это в дальнейшем негативно скажется на Вашем игровом персонаже [color=red]| Jail 30 минут / Warn.[/Spoiler]<br>"+

"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+

"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

  prefix: ACCEPT_PREFIX,

  status: false,
},
    {

	  title: '| RK |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.14 | [color=lavender] Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти [color=red] | Jail 30 минут. [/Spoiler]<br>"+

		"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: ACCEPT_PREFIX,

	  status: false,

	},

	{

	  title: '| TK |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.15 | [color=lavender] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины.[color=red]  | Jail 60 минут / Warn (за два и более убийства)[/Spoiler]<br>"+

		"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: ACCEPT_PREFIX,

	  status: false,

	},
    {
  title: '| Помеха блогеру |',
  content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +
    "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.04 | [color=lavender] Запрещены любые действия, способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы.[color=red]  | Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/Spoiler]<br>" +
    "[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>" +
    '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
  prefix: ACCEPT_PREFIX,
  status: false
},

{
  title: '| Таран дальнобойщиков |',
  content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +
    "[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
    "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.04 | [color=lavender] Запрещены любые действия, способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы.[color=red]  | Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/Spoiler]<br>" +
    "[CENTER][COLOR=lavender] Пример: таран дальнобойщиков, инкассаторов под разными предлогами.<br>" +
    "[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>" +
    '[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
  prefix: ACCEPT_PREFIX,
  status: false
},

	{

	  title: '| SK |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.16 | [color=lavender] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них.[color=red]  | Jail 60 минут / Warn (за два и более убийства)[/Spoiler]<br>"+

		"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: ACCEPT_PREFIX,

	  status: false,

	},

	{

	  title: '| MG |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.18  [color=lavender] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе.[color=red]  | Mute 30 минут.[/Spoiler]<br>"+

		"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: ACCEPT_PREFIX,

	  status: false,

	},

   {

	  title: '| DM |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.19 | [color=lavender] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины.[color=red]  | Jail 60 минут[/Spoiler]<br>"+

		"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: ACCEPT_PREFIX,

	  status: false,

	},

	{

	  title: '| Mass DM |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.20 | [color=lavender] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более.[color=red]  | Warn / Бан 7-15 дней.[/Spoiler]<br>"+

		"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: ACCEPT_PREFIX,

	  status: false,

	},

	{

	  title: '| ЕПП  |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.47 | [color=lavender] Запрещено ездить по полям на легковые машины и мотоциклах. [color=red]  | Jail 30 минут[/Spoiler]<br>"+

		"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: ACCEPT_PREFIX,

	  status: false,

	},

    {

	  title: '| ЕПП ФУРА |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.47 | [color=lavender] Запрещено ездить по полям на грузовом транспорте (работа дальнобойщика) [color=red]  | Jail 60 минут[/Spoiler]<br>"+

		"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: ACCEPT_PREFIX,

	  status: false,

	},

	{

	  title: '| CAPS |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]3.02 | [color=lavender] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [color=red]  | Mute 30 минут[/Spoiler]<br>"+

		"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: ACCEPT_PREFIX,

	  status: false,

	},

	{

	  title: '| OSK |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]3.03 | [color=lavender] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены[color=red]  | Mute 30 минут[/Spoiler]<br>"+

		"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: ACCEPT_PREFIX,

	  status: false,

	},

	{

	  title: '| OSK/UPOM |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]3.04 | [color=lavender] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC)  [color=red]  | Mute 120 минут / Ban 7-15 дней.[/Spoiler]<br>"+

		"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: ACCEPT_PREFIX,

	  status: false,

	},

	{

	  title: '| FLOOD |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]3.05 | [color=lavender] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока[color=red]  | Mute 30 минут[/Spoiler]<br>"+

		"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: ACCEPT_PREFIX,

	  status: false,

	},

	{

	  title: '| Sliv chat |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]3.08 | [color=lavender] Запрещены любые формы «слива» посредством использования глобальных чатов[color=red]  | Permban[/Spoiler]<br>"+

		"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: ACCEPT_PREFIX,

	  status: false,

	},

	{

	  title: '| Угрозы наказаниями |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]3.09 | [color=lavender] Запрещены любые угрозы о наказании игрока со стороны администрации [color=red]  | Mute 30 минут[/Spoiler]<br>"+

		"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: ACCEPT_PREFIX,

	  status: false,

	},

	{

	  title: '| Выдача за адм |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]3.10 | [color=lavender] Запрещена выдача себя за администратора, если таковым не являетесь[color=red]  | Ban 15-30 + ЧС администрации.[/Spoiler]<br>"+

		"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: ACCEPT_PREFIX,

	  status: false,

	},
    {


title: '| Оск проекта |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.40 | [color=lavender]  Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе  [color=red] | | Mute 300 минут / Ban 30 дней [/Spoiler]<br>"+

		"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: ACCEPT_PREFIX,

	  status: false,
    },


	{

	  title: '| Заблуждение (команды) |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]3.11 | [color=lavender] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами[color=red]  | Ban 15-30 / Permban[/Spoiler]<br>"+

		"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: ACCEPT_PREFIX,

	  status: false,

	},

	{

	  title: '| Музыка в Войс |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]3.14 | [color=lavender] Запрещено включать музыку в Voice Chat[color=red]  | Mute 60 минут [/Spoiler]<br>"+

		"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: ACCEPT_PREFIX,

	  status: false,

	},

	{

	  title: '| Политика |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]3.18 | [color=lavender] Запрещено политическое и религиозное пропагандирование[color=red]  | Mute 120 минут / Ban 10 дней. [/Spoiler]<br>"+

		"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: ACCEPT_PREFIX,

	  status: false,

	},

	{

	  title: '| Промокоды |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]3.21 | [color=lavender] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [color=red]  | Ban 30 дней.[/Spoiler]<br>"+

		"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: ACCEPT_PREFIX,

	  status: false,

	},

	{

	  title: '| Объявления в госс |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]3.22 | [color=lavender] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [color=red]  | Mute 30 минут[/Spoiler]<br>"+

		"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: ACCEPT_PREFIX,

	  status: false,

	},

	{

	  title: '| Сбив анимки|',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.55 | [color=lavender] Запрещается багоюз связанный с анимацией в любых проявлениях. [color=red]  | Jail 60-120 минут[/Spoiler]<br>"+

		"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: ACCEPT_PREFIX,

	  status: false,

	},

	{

	  title: '| Арест в аукцион |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.50 | [color=lavender] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона [color=red]  | Ban 7-15 дней + увольнения из фракции[/Spoiler]<br>"+

		"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: ACCEPT_PREFIX,

	  status: false,

	},

	{

	  title: '| ООС угрозы |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.37 | [color=lavender] Запрещены OOC угрозы, в том числе и завуалированные [color=red]  | Ban 15-30 дней / Permban [/Spoiler]<br>"+

		"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: ACCEPT_PREFIX,

	  status: false,

	},

	{

	  title: '| Перенос конфликта |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.36 | [color=lavender] Запрещено переносить конфликты из IC в OOC, и наоборот [color=red]  | Warn / Ban 15-30 дней [/Spoiler]<br>"+

		"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: ACCEPT_PREFIX,

	  status: false,

	},

	{

	  title: '| Реклама |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.31 | [color=lavender] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное  [color=red]  | Permban[/Spoiler]<br>"+

		"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: ACCEPT_PREFIX,

	  status: false,

	},

	{

	  title: '| Обход системы |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.21 | [color=lavender] Запрещено пытаться обходить игровую систему или использовать любые баги сервера [color=red]  | Ban 15-30 дней / Permban[/Spoiler]<br>"+

		"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: ACCEPT_PREFIX,

	  status: false,

	},

	{

	  title: '| Слив склада |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.09 | [color=lavender] Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [COLOR=red]| Ban 15 - 30 дней / PermBan/Spoiler]<br>"+

		"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: ACCEPT_PREFIX,

	  status: false,

	},

	{

	  title: '| Амаральные действия |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.08 | [color=lavender] Запрещена любая форма аморальных действий сексуального характера в сторону игроков [color=red]  | Jail 30 минут / Warn[/Spoiler]<br>"+

		"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: ACCEPT_PREFIX,

	  status: false,

	},

	{

	  title: '| NonRP обман |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=aqua]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]2.05 | [color=red] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики[color=red]  | Permban[/Spoiler]<br>"+

		"[CENTER][COLOR=aqua] Наказания будет выдано в течение 24 часов.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=aqua][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: ACCEPT_PREFIX,

	  status: false,

	},

	{

	  title: '| NonRP edit |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]*  [color=lavender] Запрещено редактирование объявлений, не соответствующих ПРО[color=red]  | Mute 30 минут[/Spoiler]<br>"+

		"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: ACCEPT_PREFIX,

	  status: false,

	},

	{

	  title: '| NonRP эфир |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]* | [color=lavender] Запрещено проведение эфиров, не соответствующих Role Play правилам и логике[color=red]  | Mute 30 минут[/Spoiler]<br>"+

		"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: ACCEPT_PREFIX,

	  status: false,

	},

	{

	  title: '| NonRP розыск |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]6.02 | [color=lavender] Запрещено выдавать розыск без Role Play причины[color=red]  | [color=red] Warn[/Spoiler]<br>"+

		"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: ACCEPT_PREFIX,

	  status: false,

	},

	{

	  title: '| NonRP арест |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказания.[Spoiler][color=red]*  | [color=lavender] Запрещено оказывать задержание без Role Play отыгровки[color=red]  | Warn[/Spoiler]<br>"+

		"[CENTER][COLOR=lavender] Наказания будет выдано в течение 24 часов.<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: ACCEPT_PREFIX,

	  status: false,

    },
    {
        title: '-----> Раздел: РП биографии <------'

           },
    {

        title: '|РП биография одобрена|',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша [COLOR=RED]RolePlay [COLOR=Lavender] - биография одобрено. <br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=LIME][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: ACCEPT_PREFIX,

	  status: true,
    },
    {

        title: '|РП биография не полная |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]В вашей [COLOR=RED]RolePlay [COLOR=Lavender] - биографии недостаточно информации. Даю вам 24 часа на ее дополнение. <br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=YELLOW][ICODE]На рассмотрение[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: PIN_PREFIX,

	  status: true,
    },
    {
        title: '|Рп биография от 3 лица|',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша биография написана от 3-го лица. <br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: UNACCEPT_PREFIX,

	  status: false,
    },
    {
        title: '|Недост-инфо в рп биографии|',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=lavender]Ваша биография отказана, причиной тому послужило: [color=red] недостаточно информации. <br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>"+

		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',

	  prefix: UNACCEPT_PREFIX,

	  status: false,
    },
    {
        title: '| Рп биография не по форме |',

	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>' +

		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+

		"[B][CENTER][COLOR=AQUA]Ваша РП биография составлена не по форме, пожалуйста ознакомьтесь с правилами подачи рп биографии .<br><br>"+

		"[CENTER][B][COLOR=red]| [URL='https://forum.blackrussia.online/threads/perm-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D1%84%D0%BE%D1%80%D0%BC%D0%B0-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.5631378/'][Color=red] Правила подачи рп биографии[/URL] [COLOR=red]|<br>"+

		"[url=https://postimages.org/][img]https://i.postimg.cc/BbnSv1j1/image2-3-1-1-1-10.gif[/img][/url]<br>",

	  prefix: UNACCEPT_PREFIX,

	  status: false,
    }


];
$(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Восстанавливаем фон из localStorage, если он существует
    const savedBackground = localStorage.getItem('backgroundImage');
    if (savedBackground) {
        $('body').css('background-image', `url(${savedBackground})`); // Устанавливаем сохраненный фон
        $('body').css('background-size', 'cover'); // Устанавливаем размер фона
    }

    // Добавление кнопок при загрузке страницы
    addButton('Меню', 'selectAnswer');
    addButton('Одобрить', 'accepted');
    addButton('Отказать', 'unaccept');
    addButton('На рассмотрение', 'pin');
    addButton('Закрыть', 'CLOSE_PREFIX');
    addButton('Изменить фон', 'changeBackground'); // Добавлена кнопка для изменения фона
    addButton('by B.Wayne', 'exit', true); // Изменение здесь для анимации текста

    // Поиск информации о теме
    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#GA_PREFIX').click(() => editThreadData(GA_PREFIX, true));
    $('button#WAITING_PREFIX').click(() => editThreadData(WAITING_PREFIX, true));
    $('button#TEX_PREFIX').click(() => editThreadData(TEX_PREFIX, true));
    $('button#SPECIAL_PREFIX').click(() => editThreadData(SPECIAL_PREFIX, true));
    $('button#CLOSE_PREFIX').click(() => editThreadData(CLOSE_PREFIX, false));
    $('button#RESHENO_PREFIX').click(() => editThreadData(RESHENO_PREFIX, false));

    $(`button#selectAnswer`).click(() => {
        XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
        buttons.forEach((btn, id) => {
            if (id > 0) {
                $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
            } else {
                $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
            }
        });
    });

    // Обработчик для изменения фона
    $('button#changeBackground').click(() => {
        const url = prompt('Введите URL для нового фона:'); // Запрашиваем URL
        if (url) {
            $('body').css('background-image', `url(${url})`); // Устанавливаем новый фон
            $('body').css('background-size', 'cover'); // Устанавливаем размер фона
            localStorage.setItem('backgroundImage', url); // Сохраняем URL в localStorage
        }
    });

    // Синхронизация фона между вкладками
    window.addEventListener('storage', (event) => {
        if (event.key === 'backgroundImage' && event.newValue) {
            $('body').css('background-image', `url(${event.newValue})`);
            $('body').css('background-size', 'cover');
        }
    });

    // Снег
    createSnowEffect();

    // Анимация кнопок
    const css = `
    <style>
        button {
    position: relative;
    transition: background-color 0.3s, transform 0.3s;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    overflow: hidden;
}
.button:hover {
    background-color: #0056b3;
    transform: scale(1.05);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}
.button::before,
.button::after,
.button .snowflake1,
.button .snowflake2 {
    content: '❄️'; /* Снежинка */
    position: absolute;
    font-size: 8px; /* Еще меньше для более мелких снежинок */
    color: #fff; /* Белый цвет */
    opacity: 0.4; /* Уменьшенная прозрачность */
    pointer-events: none;
    animation: snowFall 5s linear infinite;
}
.button::before {
    top: -20px;
    left: 20%;
    animation: snowFall 4s linear infinite, moveLeftToRight 3s linear infinite;
}
.button::after {
    top: -30px;
    left: 50%;
    animation: snowFall 3s linear infinite, moveRightToLeft 4s linear infinite;
}
.button .snowflake1 {
    top: -40px;
    left: 70%;
    font-size: 10px; /* Немного больше, чтобы была разнообразие */
    animation: snowFall 5s linear infinite, moveBottomLeftToRight 4s linear infinite;
}
.button .snowflake2 {
    top: -10px;
    left: 30%;
    font-size: 9px; /* Размер снежинки уменьшен */
    animation: snowFall 3s linear infinite, moveBottomRightToLeft 3s linear infinite;
}
@keyframes snowFall {
    0% {
        top: -20px;
        opacity: 0.4; /* Прозрачность уменьшена */
        transform: translate(-50%, rotate(0deg));
    }
    50% {
        opacity: 0.6; /* Прозрачность на полпути */
    }
    100% {
        top: 100%;
        opacity: 0;
        transform: translate(-50%, rotate(360deg));
    }
}
@keyframes moveLeftToRight {
    0% { left: 20%; }
    50% { left: 40%; }
    100% { left: 20%; }
}
@keyframes moveRightToLeft {
    0% { left: 50%; }
    50% { left: 60%; }
    100% { left: 50%; }
}
@keyframes moveBottomLeftToRight {
    0% { left: 70%; }
    50% { left: 50%; }
    100% { left: 70%; }
}
@keyframes moveBottomRightToLeft {
    0% { left: 30%; }
    50% { left: 10%; }
    100% { left: 30%; }
}
    </style>`;
    $('head').append(css);
});

// Функция добавления кнопки
function addButton(name, id, animated = false) {
    $('.button--icon--reply').before(
        `<button type="button" class="button rippleButton ${animated ? 'animated-button' : ''}" id="${id}" style="margin: 3px;">
            <span class="text">${name}</span>
        </button>`
    );
}

// Эффект снега
function createSnowEffect() {
    const snowContainer = $('<div id="snowContainer"></div>').appendTo('body');
    setInterval(() => {
        const snowflake = $('<div class="snowflake">❄️</div>');
        const size = Math.random() * 5 + 5; // Размер снежинки (меньше)
        const startLeft = Math.random() * 100; // Начальная позиция
        const endLeft = startLeft + Math.random() * 10 - 5; // Конечная позиция
        snowflake.css({
            left: `${startLeft}vw`,
            fontSize: `${size}px`,
            color: '#ffffff', // Белый цвет
            opacity: Math.random() * 0.8 + 0.2, // Прозрачность
            animationDuration: `${Math.random() * 4 + 4}s`, // Скорость падения
        });
        snowContainer.append(snowflake);
        snowflake.one('animationend', () => snowflake.remove());
    }, 300); // Интервал появления снежинок
}

// CSS для снежинок
const snowflakeCSS = `
<style>
    .snowflake {
        position: fixed;
        top: -10px;
        left: 0;
        z-index: 9999;
        font-size: 1em;
        pointer-events: none;
        animation: snowflake 8s linear infinite;
    }
    @keyframes snowflake {
        0% { transform: translateY(-10px); opacity: 1; }
        100% { transform: translateY(110vh) rotate(360deg); opacity: 0.5; }
    }
</style>`;
$('head').append(snowflakeCSS);


// Функция анимации текста
function animateText() {
    const button = $('#exit .text');
    button.css('animation', 'textGlowFade 1.5s infinite alternate');
    let toggle = true;

    setInterval(() => {
        button.text(toggle ? 'by B.Wayne' : 'by B.Wayne');
        toggle = !toggle;
    }, 1500);
}

// Разметка кнопок
function buttonsMarkup(buttons) {
    return `<div class="select_answer">${buttons
        .map(
            (btn, i) =>
                `<button id="answers-${i}" class="button--primary button rippleButton" style="margin:5px">
                <span class="button-text">${btn.title}</span></button>`
        )
        .join('')}</div>`;
}

// Функция вставки содержимого
function pasteContent(id, data = {}, send = false) {
    const template = Handlebars.compile(buttons[id].content);
    if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

    $('span.fr-placeholder').empty();
    $('div.fr-element.fr-view p').append(template(data));
    $('a.overlay-titleCloser').trigger('click');

    if (send) {
        editThreadData(buttons[id].prefix, buttons[id].status);
        $('.button--icon.button--icon--reply.rippleButton').trigger('click');
    }
}

// Получение данных о теме
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

// Функция редактирования данных темы
function editThreadData(prefix, pin = false) {
    const threadTitle = $('.p-title-value')[0].lastChild.textContent;

    fetch(`${document.URL}edit`, {
        method: 'POST',
        body: getFormData({
            prefix_id: prefix,
            title: threadTitle,
            sticky: pin ? 1 : 0,
            _xfToken: XF.config.csrf,
            _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
            _xfWithData: 1,
            _xfResponseType: 'json',
        }),
    }).then(() => location.reload());
}

// Функция получения данных формы
function getFormData(data) {
    const formData = new FormData();
    Object.entries(data).forEach(i => formData.append(i[0], i[1]));
    return formData;
}

// CSS для кнопок и прозрачного фона
const css = `
<style>
.button {
    transition: background-color 0.3s, transform 0.3s;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}
.button:hover {
    background-color: #0056b3;
    transform: scale(1.05);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}
.rippleButton {
    position: relative;
    overflow: hidden;
}
.rippleButton:after {
    content: '';
    position: absolute;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 0.6s linear;
}
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
.animated-button .text {
    animation: textGlowFade 1.5s infinite alternate;
}
@keyframes textGlowFade {
    0% {
        color: #ffffff;
        text-shadow: 0 0 25px #ffffff, 0 0 35px #ffffff, 0 0 50px #ffffff;
    }
    100% {
        color: transparent;
        text-shadow: none;
    }
}
/* Полностью прозрачные фоны */
.block-container,
.node-body,
.node--depth2:nth-child(even) .node-body,
.p-nav,
.block-footer,
.block-filterBar,
.input,
.fr-box.fr-basic,
.inputGroup.inputGroup--joined .inputGroup-text,
.block-minorHeader.uix_threadListSeparator,
.structItem:nth-child(even),
.p-sectionLinks,
.p-header,
.p-nav-list .p-navEl.is-selected,
.p-staffBar,
.message-responseRow,
.memberH1eader-main,
.p-footer-copyrightRow,
.p-footer-inner,
.pageNav-jump,
.pageNav-page,
body .uix_searchBar .uix_searchBarInner .uix_searchForm,
.bbCodeBlock,
.bbCodeBlock .bbCodeBlock-title,
.bbCodeBlock .bbCodeBlock-expandLink {
    background: rgba(0, 0, 0, 0) !important;
    transition: background 0.3s;
}
.block--messages.block .message,
.js-quickReply.block .message,
.block--messages .block-row,
.js-quickReply .block-row,
.uix_extendedFooter,
.message-cell.message-cell--user,
.message-cell.message-cell--action,
.fr-box.fr-basic,
.blockStatus {
    background: rgba(0, 0, 0, 0) !important;
}
.block--messages.block .message:hover,
.js-quickReply.block .message:hover,
.block--messages .block-row:hover,
.js-quickReply .block-row:hover,
.uix_extendedFooter:hover,
.message-cell.message-cell--user:hover,
.message-cell.message-cell--action:hover {
    background: rgb(58 56 56 / 96%) !important;
}
</style>
`;

$('head').append(css); // Добавление стилей в head
})();