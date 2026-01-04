// ==UserScript==
// @name    CHITA SCRIPT
// @namespace    https://forum.blackrussia.online
// @version      1.20
// @description  CHITA SCRIPT // by Kevin Ryzhov
// @author       Kseniya_Frog
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license 	 MIT
// @collaborator Lolipop
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @downloadURL https://update.greasyfork.org/scripts/544397/CHITA%20SCRIPT.user.js
// @updateURL https://update.greasyfork.org/scripts/544397/CHITA%20SCRIPT.meta.js
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
const SPEC_PREFIX = 11;
const VAJNO_PREFIX = 1;
const WAIT_PREFIX = 14;
const buttons = [
    {
        title: ' —---> Для ЖБ/ОБЖ by K.Frog <---— ',
        dpstyle: 'oswald: 3px; color: #CCFFFF; background: #333333; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #CCFFFF; width: 46%',
    },
    {
	  title: 'Закрыть',
      content:
      '',
	  prefix: CLOSE_PREFIX,
	  status: false,
      dpstyle: 'oswald: 3px; color: #FF0033; background: #333333; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #FF0033; width: 46%',
	},
    {
        title: 'НА РАССМОТРЕНИИ',
        dpstyle: 'oswald: 3px; color: #FFFF99; background: #333333; box-shadow: 0 0 2px 0 rgba(0,0,0,0.12),0 2px 2px 0 rgba(0,0,0,0.14),0 1px 3px 0 rgba(0,0,0,0.2); border: 3px solid #FFFF99; width: 96%',
    },
    {
	  title: 'Жб на рассмотрение ',
	  content:
		"Приветствую, на рассмотрении..<br>"
		,
	  prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: 'Обж на рассмотрение ',
	  content:
		"Приветствую, на рассмотрении..<br>"
		,
	  prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: 'Жб ГА',
	  content:
		"Приветствую, передано Главному Администратору.<br>"
		,
	  prefix: GA_PREFIX,
	  status: true,
	},
    {
	  title: 'НЕАКТУАЛЬНО',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваше наказание уже снято, приношу извинения за свою ошибку. <br> Ваша жалоба передана Главному Администратору, пожалуйста не создавайте дубликатов. Ожидайте ответа.<br>"+
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: GA_PREFIX,
	  status: true,
	},
    {
	  title: 'Обж ГА',
	  content:
		"Приветствую, передано Главному Администратору.<br>"
		,
	  prefix: GA_PREFIX,
	  status: true,
	},
    {
	  title: 'Жб спецам',
	  content:
		"Приветствую, передано Специальной Администррации.<br>"
		,
	  prefix: SPEC_PREFIX,
	  status: true,
	},
    {
	  title: 'Обж спецам',
	  content:
		"Приветствую, передано Специальной Администррации.<br>"
		,
	  prefix: SPEC_PREFIX,
	  status: true,
    },
    {
	  title: 'НЕАКТУАЛЬНО',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваше наказание уже снято, приношу извинения за свою ошибку. <br> Ваша жалоба передана Главному Администратору, пожалуйста не создавайте дубликатов. Ожидайте ответа.<br>"+
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: GA_PREFIX,
	  status: true,
	},
    {
        title: 'ОТКАЗАНО',
        dpstyle: 'oswald: 3px; color: #FF0000; background: #333333; box-shadow: 0 0 2px 0 rgba(0,0,0,0.12),0 2px 2px 0 rgba(0,0,0,0.14),0 1px 3px 0 rgba(0,0,0,0.2); border: 3px solid #FF0000; width: 96%',
    },
    {
	  title: 'Жб не по форме',
        content:
		"Приветствую.<br>"+
		"Ваша жалоба составлена не по форме.<br>"+
        "Закрыто.",
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Обж не по форме',
	  content:
		"Приветствую.<br>"+
		"Ваше обжалование составлено не по форме.<br>"+
        "Закрыто.",
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'НЕАКТУАЛЬНО',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ознакомьтесь с содержимым регламента 2.19 общих правил серверов и обратите внимание на 1 примечание.<br>"+
        "[B][CENTER][SPOILER][COLOR=red]2.19. [COLOR=lavender]Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [COLOR=red| Jail 60 минут<br>"+
        "[B][CENTER][COLOR=red]Примечание:[COLOR=lavender] разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.<br>"+
        "[B][CENTER][COLOR=red]Примечание:[COLOR=lavender] нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/SPOILER]<br>"+
        "[B][CENTER][COLOR=lavender]Предоставьте Фрапс и наказание будет снято.<br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Нету /time',
	  content:
		"Приветствую.<br>"+
		"Отсутствует /time, рассмотрению не подлежит.<br>"+
        "Закрыто.",
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Прошло 48ч',
	  content:
		"Приветствую.<br>"+
		"С момента выдачи наказания прошло более 48-ми часов, жалоба не подлежит рассмотрению.<br>"+
        "Закрыто.",
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Окно бана',
	  content:
	    "Приветствую.<br>"+
		"Прикрепите в доказательства скриншот окна блокировки, которое появляется сразу после входа в игру.<br>"+
        "Закрыто.",
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Нет докв',
	  content:
		"Приветствую.<br>"+
		"В вашей жалобе отсутствуют доказательства. Загрузите их на imgur, yapix, google photo или любой другой фото / видео хостинг.<br>"+
        "Закрыто.",
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Недостаточно докв',
	  content:
		"Приветствую.<br>"+
		"В вашей теме недостаточно доказательств для вынесения решения.<br>"+
        "Закрыто.",
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Не работают док-ва',
	  content:
		"Приветствую.<br>"+
		"Ваши доказательства не рабочие или же битая ссылка, пожалуйста загрузите свои доказательства на YouTube, Yapix, Imgur или любой другой фото/видео хостинг.<br>"+
        "Закрыто.",
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Док-ва отредактированы',
	  content:
		"Приветствую.<br>"+
		"Представленные доказательства были отредактированы, обрезаны или в плохом качестве, пожалуйста прикрепите оригинал.<br>"+
        "Закрыто.",
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Соц сети',
	  content:
		"Приветствую.<br>"+
		"Доказательства предоставленные в соц. сетях по типу Twiter, Instagram, VKonakte, Telegram не принимаются<br>"+
        "Закрыто.",
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'от 3 лица',
	  content:
		"Приветствую.<br>"+
		"Жалоба составлена от 3-го лица, мы не можем ее рассмотреть.<br>"+
        "Закрыто.",
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Нарушений не найдено',
	  content:
		"Приветствую.<br>"+
		"Со стороны администратора не найдены какие либо нарушение, пожалуйста ознакомьтесь с правилами проекта.<br>"+
        "Закрыто.",
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'НЕАКТУАЛЬНО',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br>"+
		"[B][CENTER][COLOR=lavender]Ваш аккаунт не находится в блокировке.<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано. Закрыто[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Дубликат',
	  content:
		"Приветствую.<br>"+
		"Вам уже был дан ответ в прошлой теме, пожалуйста перестаньте делать дубликаты, иначе ваш форумный аккаунт будет заблокирован.<br>"+
        "Закрыто.",
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Дубликат на рассмотр',
	  content:
		"Приветствую.<br>"+
		"Ваша подобная тема уже взята на рассмотрение, просьба не создавать дубликаты и ожидать ответы в прошлой теме.<br>"+
        "Закрыто.",
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Не понятно',
	  content:
		"Приветствую.<br>"+
		"Суть вашего обращения не совсем понятна. Просьба уточнить в следующей теме вы признаете свою вину и хотите сократить срок наказания или вы не категорически не согласны и хотите, что бы бан сняли, так как вы ничего не нарушали.<br>"+
        "Закрыто.",
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Оффтоп',
	  content:
		"Приветствую.<br>"+
		"Ваше обращение не относится к данному разделу.<br>"+
        "Закрыто.",
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'НЕАКТУАЛЬНО',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]В вашей жалобе присутствет неадекватное поведение или неуважение к администрации<br>"+
        "[B][CENTER][COLOR=lavender]Ознакомьтесь с правилами подачи обжалования и напишите его повторно. <br> [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.3429398/']*Нажмите сюда*[/URL]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано. Закрыто[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Наказание верное',
	  content:
		"Приветствую.<br>"+
		"Проверив доказательства администратора, было принято решение, что наказание выдано верно.<br>"+
        "Закрыто.",
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'НЕАКТУАЛЬНО',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Составьте жалобы на каждого из администраторов отдельно.<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано. Закрыто[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Не сменил ник',
	  content:
		"Приветствую.<br>"+
		"Наказание будет выдано снова, так как вы не изменили имя.<br>"+
        "Закрыто.",
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Обжалование отказ',
	  content:
		"Приветствую, в обжаловании отказано.<br>"
        ,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'НЕАКТУАЛЬНО',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]К сожалению аккаунт разблокировке не подлежит, т.к на нем были совершенны грубые нарушения.<br>"+
        "[B][CENTER][COLOR=lavender]Напомню, что владелец аккаунта несет полную ответственность за него.<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано. Закрыто[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Обжалованию не подлежит',
	  content:
		"Приветствую, ваше наказание не подлежит обжалованию.<br>"
        ,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
        title: 'ОДОБРЕНО',
        dpstyle: 'oswald: 3px; color: #00FF99; background: #333333; box-shadow: 0 0 2px 0 rgba(0,0,0,0.12),0 2px 2px 0 rgba(0,0,0,0.14),0 1px 3px 0 rgba(0,0,0,0.2); border: 3px solid #00FF99; width: 96%',
    },
    {
	  title: 'Наказание по ошибке',
	  content:
		"Приветствую.<br>"+
		"Наказание будет снято.<br>"+
        "Закрыто.",
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'НЕАКТУАЛЬНО',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Администратор снят / ушёл ПСЖ.<br>"+
        "[B][CENTER][COLOR=lavender]Наказание будет снято.<br>"+
		'[B][CENTER][COLOR=green][ICODE]Одобрено. Закрыто[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Беседа с адм',
	  content:
		"Приветствую.<br>"+
		"С администратором будет проведена профилактическая беседа.<br>"+
        "Закрыто.",
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'НЕАКТУАЛЬНО',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваш черный список был снят. Ждём вас снова на должностях нашего сервера.<br>"+
        "[B][CENTER][COLOR=lavender]Впредь больше не нарушайте, а так же ознакомьтесь с правилами проекта <br> [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL]<br>"+
		'[B][CENTER][COLOR=green][ICODE]Одобрено. Закрыто[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Ник изменен',
	  content:
		"Приветствую.<br>"+
		"Ник изменен.<br>"+
        "Закрыто.",
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'НЕАКТУАЛЬНО',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша блокировка в беседе игроков была снята.<br>"+
        "[B][CENTER][COLOR=lavender]Обратитесь к модерации беседы для того, что бы вас туда добавили.<br>"+
		'[B][CENTER][COLOR=green][ICODE]Одобрено. Закрыто[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Наказание снято',
	  content:
		"Приветствую.<br>"+
		"Наказание с вашего аккаунта полностью снято.<br>"+
        "Закрыто.",
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'НЕАКТУАЛЬНО',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Наказание будет снижено до блокировки игрового чата на 120 минут<br>"+
        "[B][CENTER][COLOR=lavender]Впредь больше не нарушайте, а так же ознакомьтесь с правилами проекта <br> [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL]<br>"+
		'[B][CENTER][COLOR=green][ICODE]Одобрено. Закрыто[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'НЕАКТУАЛЬНО',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Наказание будет снижено до блокировки аккаунта на X дней<br>"+
        "[B][CENTER][COLOR=lavender]Впредь больше не нарушайте, а так же ознакомьтесь с правилами проекта <br> [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL]<br>"+
		'[B][CENTER][COLOR=green][ICODE]Одобрено. Закрыто[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'НЕАКТУАЛЬНО',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Наказание будет снижено до блокировки аккаунта на 30 дней<br>"+
        "[B][CENTER][COLOR=lavender]Впредь больше не нарушайте, а так же ознакомьтесь с правилами проекта <br> [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL]<br>"+
		'[B][CENTER][COLOR=green][ICODE]Одобрено. Закрыто[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'НЕАКТУАЛЬНО',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Наказание будет снижено до блокировки аккаунта на 15 дней<br>"+
        "[B][CENTER][COLOR=lavender]Впредь больше не нарушайте, а так же ознакомьтесь с правилами проекта <br> [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL]<br>"+
		'[B][CENTER][COLOR=green][ICODE]Одобрено. Закрыто[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'НЕАКТУАЛЬНО',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Наказание будет снижено до блокировки аккаунта на 7 дней<br>"+
        "[B][CENTER][COLOR=lavender]Впредь больше не нарушайте, а так же ознакомьтесь с правилами проекта <br> [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL]<br>"+
		'[B][CENTER][COLOR=green][ICODE]Одобрено. Закрыто[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
        title: ' —---> НЕ ТУДА <---— ',
        dpstyle: 'oswald: 3px; color: #9966FF; background: #333333; box-shadow: 0 0 2px 0 rgba(0,0,0,0.12),0 2px 2px 0 rgba(0,0,0,0.14),0 1px 3px 0 rgba(0,0,0,0.2); border: 3px solid #9966FF; width: 96%',
    },
    {
      title: 'В жб на игроков',
	  content:
		"Приветствую.<br>"+
		"Обратитесь в раздел жалобы на игроков.<br>"+
        "Закрыто.",
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
     title: 'В жб на лд',
	  content:
		"Приветствую.<br>"+
		"Обратитесь в раздел жалобы на лидеров.<br>"+
        "Закрыто.",
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
     title: 'В жб на сотрудников',
	  content:
		"Приветствую.<br>"+
		"Обратитесь в раздел жалобы на сотрудников.<br>"+
        "Закрыто.",
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
     title: 'В жб на адм',
	  content:
		"Приветствую.<br>"+
		"Обратитесь в раздел жалобы на администрацию.<br>"+
        "Закрыто.",
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
     title: 'В обжалования',
	  content:
		"Приветствую.<br>"+
		"Обратитесь в раздел обжалования наказаний.<br>"+
        "Закрыто.",
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'В жб на техов',
	  content:
		"Приветствую.<br>"+
		"Обратитесь в раздел жалобы на тех специалистов.<br>"+
        "Закрыто.",
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'В тех раздел',
	  content:
		"Приветствую.<br>"+
		"Обратитесь в тех раздел своего сервера.<br>"+
        "Закрыто.",
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'НЕАКТУАЛЬНО',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Решением проблем такого типа администрация не занимается. Вам следует обратится в техническую поддержку и ждать обратной связи.[/COLOR]<br>"+
        "[B][CENTER][url=https://vk.com/br_tech]*Вконтакте*[/url] [url=https://t.me/br_techBot]*Телеграм*[/url][/B][/CENTER]"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано. Закрыто[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'НЕАКТУАЛЬНО',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Вы ошиблись разделом. Ваше наказание вам было выдано техническим специалистом, поэтому я переношу вашу тему в раздел жалоб на технических специалистов.<br>"+
        "[B][CENTER]Ожидайте ответа в этой теме от технического специалиста, дубликаты этой темы создавать [COLOR=RED]не нужно<br>[/B][/CENTER]"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=YELLOW][ICODE]На рассмотрении[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
    {
     title: 'Ошибся сервером',
	  content:
		"Приветствую.<br>"+
		"Вы ошиблись сервером.<br>"+
        "Закрыто.",
     prefix: WAIT_PREFIX,
	},
    {
     title: 'НЕАКТУАЛЬНО',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Вы ошиблись разделом, переношу вашу тему в нужный раздел <br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>",
     prefix: WAIT_PREFIX,
	},
    {
        title: 'ДРУГОЕ',
        dpstyle: 'oswald: 3px; color: #99FFFF; background: #333333; box-shadow: 0 0 2px 0 rgba(0,0,0,0.12),0 2px 2px 0 rgba(0,0,0,0.14),0 1px 3px 0 rgba(0,0,0,0.2); border: 3px solid #99FFFF; width: 96%',
    },
    {
	  title: 'Приветствие',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Текст<br>",
	},
    {
	  title: 'Нрп обман (договоритесь)',
	  content:
		"Приветствую.<br>"+
		"Если вы хотите хотите обжаловать наказание за НонРП обман, Вы должны сами связаться с человеком, которого обманули.<br>"+
        "После чего он должен написать на вас обжалование, прикрепив доказательства договора о возврате имущества, ссылку на жалобу, которую писал на вас, скриншот окна блокировки обманувшего, ссылки на ВК обеих сторон.<br>"+
        "Возврат производится без моральной компенсации.<br>"+
        "Закрыто.",
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'НЕАКТУАЛЬНО',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Для обжалования вашего наказания вам необходимо договориться с обманутой стороной о возврате имущества, после чего обманутый игрок должен написать обжалование с аккаунта на котором писал жалобы после которой вы получили бан. <br>"+
        "[B][CENTER][COLOR=lavender]В доказательства требуется предоставить вашу с ним перкписку в соц сети, на которой будут видны условия сделки, а так же окно бана.<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано. Закрыто[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'НЕАКТУАЛЬНО',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Заполните пожалуйста форму ниже<br>"+
        "[B][CENTER][COLOR=lavender]Ваш Nick_Name: <br> Ссылка на ваше ВК: <br> NickName игрока: <br> Ссылка на ВК игрока: <br>"+
		'[B][CENTER][COLOR=yellow][ICODE]Открыто. На рассмотрении[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: 'Нрп обман (разбан 24ч)',
	  content:
		"Приветствую.<br>"+
		"Аккаунт разблокирован на 24ч для передачи имущества игроку."
       ,
	  prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: 'Нрп обман (ущерб возмещен)',
	  content:
		"Приветствую.<br>"+
		"Аккаунт разблокирован, так как ущерб был возмещен.<br>"+
        "Закрыто.",
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'НЕАКТУАЛЬНО',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Наказание с игрока полностью снято.<br>"+
		'[B][CENTER][COLOR=green][ICODE]Одобрено. Закрыто[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'НЕАКТУАЛЬНО',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Наказание будет выдано снова, так как вы не возместили ущерб обманутой стороне.<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано. Закрыто[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'НЕАКТУАЛЬНО',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Наказание будет выдано снова, так как игрок не вернул ущерб обманутой стороне.<br>"+
		'[B][CENTER][COLOR=green][ICODE]Одобрено. Закрыто[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Ник (разбан 24ч)',
	  content:
		"Приветствую.<br>"+
		"Ваш аккаунт будет разблокирован на 24 часа для смены никнейма. Если вы его не смените, то ваш аккаунт будет заблокирован без амнистии. Вы можете сменить данный никнейм через /mm. После смены отпишите в данную тему с приложенными доказательствами."
        ,
	  prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: 'Прикрепите Вк',
	  content:
		"Приветствую.<br>"+
		"У вас есть 24 часа дабы прикрепить вашу ссылку на ВК"
        ,
	  prefix: PIN_PREFIX,
	  status: true,
	},

];
$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('Меню', 'selectAnswer');
	addButton('Одобрить', 'accepted');
	addButton('Отказать', 'unaccept');


	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));

	$(`button#selectAnswer`).click(() => {
		XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
		buttons.forEach((btn, id) => {
			if(id > 0) {
				$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
			} else {
				$(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
			}
		});
	});
});

function addButton(name, id) {
     $('.button--icon--reply').before(
       `<button type="button" class="button rippleButton" id="${id}" style="border-radius: 99999px; margin-right: 5px; border: 2px solid #00CC99;">${name}</button>`,
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