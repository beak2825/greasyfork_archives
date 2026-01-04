// ==UserScript==
// @name         Для приматоков с 49 / By K. Stoyn
// @namespace    https://forum.blackrussia.online
// @version      1.02
// @description  Жб/Обж / K. Stoyn
// @author       Kalibr Stoyn
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license 	 MIT
// @collaborator Lolipop
// @icon https://i.postimg.cc/qv84b5RR/68a2c7ce9ff4a0564fc872ff64208953.jpg
// @downloadURL https://update.greasyfork.org/scripts/525576/%D0%94%D0%BB%D1%8F%20%D0%BF%D1%80%D0%B8%D0%BC%D0%B0%D1%82%D0%BE%D0%BA%D0%BE%D0%B2%20%D1%81%2049%20%20By%20K%20Stoyn.user.js
// @updateURL https://update.greasyfork.org/scripts/525576/%D0%94%D0%BB%D1%8F%20%D0%BF%D1%80%D0%B8%D0%BC%D0%B0%D1%82%D0%BE%D0%BA%D0%BE%D0%B2%20%D1%81%2049%20%20By%20K%20Stoyn.meta.js
// ==/UserScript==

(function () {
  'use strict';
const UNACCEPT_PREFIX = 4;
const ACCEPT_PREFIX = 8;
const RESHENO_PREFIX = 6;
const PIN_PREFIX = 2;
const GA_PREFIX = 12;
const COMMAND_PREFIX = 10;
const WATCHED_PREFIX = 9;
const TEX_PREFIX = 13;
const CLOSE_PREFIX = 7;
const SPEC_PREFIX = 11;
const VAJNO_PREFIX = 1;
const WAIT_PREFIX = 14;
const buttons = [
    {
        title: ' —---> Для ЖБ/ОБЖ by K.Stoyn <---— ',
        dpstyle: 'oswald: 3px; color: #ff0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 3px solid #ff0000; width: 96%',
    },
    {
	  title: 'Закрыть',
      content:
      '',
	  prefix: CLOSE_PREFIX,
	  status: false,
       dpstyle: 'oswald: 3px; color: #ff0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 3px solid #ff0000; width: 96%',
    },
    {
        title: 'НА РАССМОТРЕНИИ',
        dpstyle: 'oswald: 3px; color: #FF6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.12),0 2px 2px 0 rgba(0,0,0,0.14),0 1px 3px 0 rgba(0,0,0,0.2); border: 3px solid #FF6600; width: 96%',
    },
    {
	  title: 'Жб на рассмотрение ',
	content:
		'[CENTER][FONT=courier new][IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>' +
		"[B][CENTER][COLOR=#a000a0][ICODE]Здравствуйте, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба взята на рассмотрение.<br> Пожалуйста, не создавайте дубликатов. <br>Ожидайте ответа...<br><br>"+
		"[IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#ff9800][ICODE]На рассмотрение.[/ICODE][/COLOR][/CENTER][/FONT][/B]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: 'Жб ГА',
	  content:
		"[B][CENTER][FONT=courier new][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба передана Главному Администратору. <br>Пожалуйста, не создавайте дубликатов. <br>Ожидайте ответа...<br>"+
		'[B][CENTER][COLOR=#ff9800][ICODE]На рассмотрении.[/ICODE][/COLOR][/CENTER][/FONT][/B]',
	  prefix: GA_PREFIX,
	  status: true,
	},
    {
	  title: 'Ошибка жб ГА (для зга)',
	  content:
		"[B][CENTER][FONT=courier new][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваше наказание уже снято, приношу извинения за свою ошибку. <br>Ваша жалоба передана Главному Администратору. Пожалуйста, не создавайте дубликатов. Ожидайте ответа.<br>"+
		'[B][CENTER][COLOR=#ff9800][ICODE]На рассмотрении.[/ICODE][/COLOR][/CENTER][/FONT][/B]',
	  prefix: GA_PREFIX,
	  status: true,
	},
    {
	  title: 'Жб спецам',
	  content:
		"[B][CENTER][FONT=courier new][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба передана Специальной Администрации. Пожалуйста, не создавайте дубликатов. Ожидайте ответа.<br>"+
		'[B][CENTER][COLOR=#ff9800][ICODE]На рассмотрении.[/ICODE][/COLOR][/CENTER][/FONT][/B]',
	  prefix: SPEC_PREFIX,
	  status: true,
	},
    {
	  title: 'Ошибка жб Спец',
	  content:
		"[B][CENTER][FONT=courier new][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваше наказание уже снято, приношу извинения за свою ошибку. <br> Ваша жалоба передана Главному Администратору. Пожалуйста, не создавайте дубликатов. Ожидайте ответа.<br>"+
		'[B][CENTER][COLOR=#ff9800][ICODE]На рассмотрении.[/ICODE][/COLOR][/CENTER][/FONT][/B]',
	  prefix: GA_PREFIX,
	  status: true,
	},
    {
        title: 'ОТКАЗАНО',
        dpstyle: 'oswald: 3px; color: #FF0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.12),0 2px 2px 0 rgba(0,0,0,0.14),0 1px 3px 0 rgba(0,0,0,0.2); border: 3px solid #FF0000; width: 96%',
    },
    {
	  title: 'Жб не по форме',
        content:
		'[CENTER][FONT=courier new][IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>' +
		"[B][CENTER][COLOR=#a000a0][ICODE]Здравствуйте, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба составлена не по форме, пожалуйста ознакомьтесь с [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.3429349/']правилами подачи жалоб[/URL].<br>"+
		"[IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано. Закрыто[/ICODE][/COLOR][/CENTER][/FONT][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Нету /time',
	  content:
		'[CENTER][FONT=courier new][IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>' +
		"[B][CENTER][COLOR=#a000a0][ICODE]Здравствуйте, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]В предоставленных доказательств отсутствует время (/time), <br>следовательно не подлежит рассмотрению.<br>Приятной игры<br>"+
		"[IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано. Закрыто[/ICODE][/COLOR][/CENTER][/FONT][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Прошло 48ч',
	  content:
		'[CENTER][FONT=courier new][IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>' +
		"[B][CENTER][COLOR=#a000a0][ICODE]Здравствуйте, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] С момента выдачи наказания прошло более 48-ми часов, жалоба не подлежит рассмотрению.<br>"+
		"[IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано. Закрыто[/ICODE][/COLOR][/CENTER][/FONT][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Окно бана',
	  content:
		'[CENTER][FONT=courier new][IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>' +
		"[B][CENTER][COLOR=#a000a0][ICODE]Здравствуйте, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Прикрепите в доказательства скриншот окна блокировки, <br>которое появляется сразу после входа в игру.<br>"+
		"[IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано. Закрыто[/ICODE][/COLOR][/CENTER][/FONT][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Нет док-ов',
	  content:
		'[CENTER][FONT=courier new][IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>' +
		"[B][CENTER][COLOR=#a000a0][ICODE]Здравствуйте, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]В вашей жалобе отсутствуют доказательства. <br>Загрузите их на imgur, yapix, google photo или любой другой фото / видео хостинг.<br>"+
		"[IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано. Закрыто[/ICODE][/COLOR][/CENTER][/FONT][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Недостаточно док-ов',
	  content:
		'[CENTER][FONT=courier new][IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>' +
		"[B][CENTER][COLOR=#a000a0][ICODE]Здравствуйте, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]В вашей теме недостаточно доказательств для вынесения решения.<br>"+
		"[IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано. Закрыто[/ICODE][/COLOR][/CENTER][/FONT][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Не работают док-ва',
	  content:
		'[CENTER][FONT=courier new][IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>' +
		"[B][CENTER][COLOR=#a000a0][ICODE]Здравствуйте, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваши доказательства не рабочие или же битая ссылка, <br>пожалуйста загрузите свои доказательства на YouTube, Yapix, Imgur или любой другой фото/видео хостинг.<br>"+
		"[IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано. Закрыто[/ICODE][/COLOR][/CENTER][/FONT][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Док-ва отредактированы',
	  content:
		'[CENTER][FONT=courier new][IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>' +
		"[B][CENTER][COLOR=#a000a0][ICODE]Здравствуйте, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Представленные доказательства были отредактированы, <br>обрезаны или в плохом качестве, пожалуйста прикрепите оригинал.<br>"+
		"[IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано. Закрыто[/ICODE][/COLOR][/CENTER][/FONT][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Соц сети',
	  content:
		'[CENTER][FONT=courier new][IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>' +
		"[B][CENTER][COLOR=#a000a0][ICODE]Здравствуйте, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Доказательства предоставленные в соц. сетях по типу Twiter, Instagram, VKonakte, Telegram не принимаются<br>Загрузите свои доказательства на YouTube, Yapix, Imgur или любой другой фото/видео хостинг.<br>"+
		"[IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано. Закрыто[/ICODE][/COLOR][/CENTER][/FONT][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'от 3 лица',
	  content:
		'[CENTER][FONT=courier new][IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>' +
		"[B][CENTER][COLOR=#a000a0][ICODE]Здравствуйте, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Жалоба составлена от 3-го лица, мы не можем ее рассмотреть. <br>Жалобу должен составлять владелец владелец аккаунта/игрок который принимал участие в ситуации.br>"+
		"[IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано. Закрыто[/ICODE][/COLOR][/CENTER][/FONT][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Нарушений не найдено',
	  content:
		'[CENTER][FONT=courier new][IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>' +
		"[B][CENTER][COLOR=#a000a0][ICODE]Здравствуйте, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Со стороны администратора не найдены какие либо нарушение, <br>пожалуйста ознакомьтесь с правилами проекта.<br>"+
		"[IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано. Закрыто[/ICODE][/COLOR][/CENTER][/FONT][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Нет бана',
	  content:
		'[CENTER][FONT=courier new][IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>' +
		"[B][CENTER][COLOR=#a000a0][ICODE]Здравствуйте, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br>"+
		"[B][CENTER][COLOR=lavender]Ваш аккаунт не находится в блокировке.<br><br>"+
		"[IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано. Закрыто[/ICODE][/COLOR][/CENTER][/FONT][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Дубликат',
	  content:
		'[CENTER][FONT=courier new][IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>' +
		"[B][CENTER][COLOR=#a000a0][ICODE]Здравствуйте, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Вам уже был дан ответ в прошлой теме, <br>пожалуйста перестаньте делать дубликаты, <br>иначе ваш форумный аккаунт будет заблокирован.<br>"+
		"[IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано. Закрыто[/ICODE][/COLOR][/CENTER][/FONT][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Не понятно',
	  content:
		"[B][CENTER][FONT=courier new][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Суть вашего обращения не совсем понятна. Просьба уточнить в следующей теме вы признаете свою вину и хотите сократить срок наказания или вы категорически не согласны и хотите, что бы бан сняли, так как вы ничего не нарушали.<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано. Закрыто[/ICODE][/COLOR][/CENTER][/FONT][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Оффтоп',
	  content:
		"[B][CENTER][FONT=courier new][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваше обращение не относится к данному разделу.<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано. Закрыто[/ICODE][/COLOR][/CENTER][/FONT][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Неадекват',
	  content:
		"[B][CENTER][FONT=courier new][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]В вашей жалобе присутствет неадекватное поведение или неуважение к администрации<br>"+
        "[B][CENTER][COLOR=lavender]Ознакомьтесь с правилами подачи обжалования и напишите его повторно. <br> [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.3429398/']*Нажмите сюда*[/URL]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано. Закрыто[/ICODE][/COLOR][/CENTER][/FONT][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Наказание верное',
	  content:
		"[B][CENTER][FONT=courier new][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Проверив доказательства администратора, было принято решение, что наказание выдано верно.<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано. Закрыто[/ICODE][/COLOR][/CENTER][/FONT][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Разделить жб',
	  content:
		"[B][CENTER][FONT=courier new][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Составьте жалобы на каждого из администраторов отдельно.<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано. Закрыто[/ICODE][/COLOR][/CENTER][/FONT][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
        title: 'ОДОБРЕНО',
        dpstyle: 'oswald: 3px; color: #00FF00; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.12),0 2px 2px 0 rgba(0,0,0,0.14),0 1px 3px 0 rgba(0,0,0,0.2); border: 3px solid #00FF00; width: 96%',
    },
    {
	  title: 'Наказание по ошибке',
	  content:
		"[B][CENTER][FONT=courier new][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]В следствие беседы с администратором, было выяснено, наказание было выдано по ошибке. <br>"+
        "[B][CENTER][COLOR=lavender]С администратором будет проведена необходимая работа. Накзание будет снято<br>"+
		'[B][CENTER][COLOR=GREEN][ICODE]Одобрено. Закрыто.<br>Приятной игры на сервере KHABAROVSK![/ICODE][/COLOR][/CENTER][/FONT][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Беседа с адм',
	  content:
		"[B][CENTER][FONT=courier new][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]С администратором будет проведена необходимая работа.<br>"+
		'[B][CENTER][COLOR=GREEN][ICODE]Одобрено. Закрыто.<br>Приятной игры на сервере KHABAROVSK![/ICODE][/COLOR][/CENTER][/FONT][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Наказание снято',
	  content:
		"[B][CENTER][FONT=courier new][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Наказание с вашего аккаунта полностью снято<br>"+
        "[B][CENTER][COLOR=lavender]Впредь больше не нарушайте, а так же ознакомьтесь с правилами проекта <br> [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL]<br>"+
		'[B][CENTER][COLOR=green][ICODE]Одобрено. Закрыто.<br>Приятной игры на сервере KHABAROVSK![/ICODE][/COLOR][/CENTER][/FONT][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
        title: 'НЕ ТУДА',
        dpstyle: 'oswald: 3px; color: #9966FF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.12),0 2px 2px 0 rgba(0,0,0,0.14),0 1px 3px 0 rgba(0,0,0,0.2); border: 3px solid #9966FF; width: 96%',
    },
    {
      title: 'В жб на игроков',
	  content:
		'[CENTER][FONT=courier new][IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>' +
		"[B][CENTER][COLOR=#a000a0][ICODE]Здравствуйте, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Вы ошиблись разделом, обратитесь в раздел жалоб на игроков <br>"+
		"[IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано. Закрыто[/ICODE][/COLOR][/CENTER][/FONT][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
     title: 'В жб на лд',
	  content:
		'[CENTER][FONT=courier new][IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>' +
		"[B][CENTER][COLOR=#a000a0][ICODE]Здравствуйте, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Вы ошиблись разделом, обратитесь в раздел жалоб на лидеров <br>"+
		"[IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано.<br>Приятной игры на сервере KHABAROVSK![/ICODE][/COLOR][/CENTER][/FONT][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
     title: 'В жб на сотрудников',
	  content:
		'[CENTER][FONT=courier new][IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>' +
		"[B][CENTER][COLOR=#a000a0][ICODE]Здравствуйте, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Вы ошиблись разделом, обратитесь в раздел жалоб на сотрудников фракции.<br>"+
		"[IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано.<br>Приятной игры на сервере KHABAROVSK![/ICODE][/COLOR][/CENTER][/FONT][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
     title: 'В жб на адм',
	  content:
		'[CENTER][FONT=courier new][IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>' +
		"[B][CENTER][COLOR=#a000a0][ICODE]Здравствуйте, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Вы ошиблись разделом, обратитесь в раздел жалоб на администрацию<br>"+
		"[IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано.<br>Приятной игры на сервере KHABAROVSK![/ICODE][/COLOR][/CENTER][/FONT][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
     title: 'В обжалования',
	  content:
		'[CENTER][FONT=courier new][IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>' +
		"[B][CENTER][COLOR=#a000a0][ICODE]Здравствуйте, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Вы ошиблись разделом, обратитесь в раздел обжалований наказаний <br>"+
		"[IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано.<br>Приятной игры на сервере KHABAROVSK![/ICODE][/COLOR][/CENTER][/FONT][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'В жб на техов',
	  content:
		'[CENTER][FONT=courier new][IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>' +
		"[B][CENTER][COLOR=#a000a0][ICODE]Здравствуйте, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Наказание было выдано Техническим специалистом, вы можете написать жалобу здесь: [URL= https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/]*Нажмите сюда*[/URL]<br>"+
		"[IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано. Закрыто[/ICODE][/COLOR][/CENTER][/FONT][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'В тех раздел',
	  content:
		'[CENTER][FONT=courier new][IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>' +
		"[B][CENTER][COLOR=#a000a0][ICODE]Здравствуйте, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Вы ошиблись разделом. Оставьте свою жалобу в техническом разделе сервера [URL= https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB.22/]*Нажмите сюда*[/URL]<br>"+
		"[IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано. Закрыто[/ICODE][/COLOR][/CENTER][/FONT][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'В тех поддержку',
	  content:
		'[CENTER][FONT=courier new][IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>' +
		"[B][CENTER][COLOR=#a000a0][ICODE]Здравствуйте, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Решением проблем такого типа администрация не занимается. Вам следует обратится в техническую поддержку и ждать обратной связи.[/COLOR]<br>"+
        "[B][CENTER][url=https://vk.com/br_tech]*Вконтакте*[/url] [url=https://t.me/br_techBot]*Телеграм*[/url][/B][/CENTER]"+
		"[IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано. Закрыто[/ICODE][/COLOR][/CENTER][/FONT][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Перенос жб тех',
	  content:
		'[CENTER][FONT=courier new][IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>' +
		"[B][CENTER][COLOR=#a000a0][ICODE]Здравствуйте, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Вы ошиблись разделом. Ваше наказание вам было выдано техническим специалистом, поэтому я переношу вашу тему в раздел жалоб на технических специалистов.<br>"+
        "[B][CENTER]Ожидайте ответа в этой теме от технического специалиста, дубликаты этой темы создавать [COLOR=RED]не нужно<br>[/B][/CENTER]"+
		"[IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>"+
		'[B][CENTER][COLOR=YELLOW][ICODE]На рассмотрении.<br>Приятной игры на сервере KHABAROVSK![/ICODE][/COLOR][/CENTER][/FONT][/B]',
	  prefix: TEX_PREFIX,
	  status: open,
	},
    {
     title: 'Ошибся сервером',
	  content:
		'[CENTER][FONT=courier new][IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>' +
		"[B][CENTER][COLOR=#a000a0][ICODE]Здравствуйте, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Вы ошиблись сервером, переношу вашу тему в нужный раздел. <br>"+
		"[IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>[/FONT]",
     prefix: WAIT_PREFIX,
	},
    {
     title: 'Ошибся разделом',
	  content:
		'[CENTER][FONT=courier new][IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>' +
		"[B][CENTER][COLOR=#a000a0][ICODE]Здравствуйте, уважаемый(-ая) {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Вы ошиблись разделом, переношу вашу тему в нужный раздел. <br>[/FONT]"+
		"[IMG]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/IMG]<br>",
     prefix: WAIT_PREFIX,
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