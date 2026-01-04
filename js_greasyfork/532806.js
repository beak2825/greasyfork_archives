// ==UserScript==
// @name         Для крутышей с 15 / By K. Stoyn
// @namespace    https://forum.blackrussia.online
// @version      1.01
// @description  Жб/Обж / K. Stoyn
// @author       Kalibr Stoyn
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license 	 MIT
// @collaborator Lolipop
// @icon https://i.postimg.cc/RFfHm5Rx/0532197ea360922823bf39153ef7562f.jpg
// @downloadURL https://update.greasyfork.org/scripts/532806/%D0%94%D0%BB%D1%8F%20%D0%BA%D1%80%D1%83%D1%82%D1%8B%D1%88%D0%B5%D0%B9%20%D1%81%2015%20%20By%20K%20Stoyn.user.js
// @updateURL https://update.greasyfork.org/scripts/532806/%D0%94%D0%BB%D1%8F%20%D0%BA%D1%80%D1%83%D1%82%D1%8B%D1%88%D0%B5%D0%B9%20%D1%81%2015%20%20By%20K%20Stoyn.meta.js
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
  const TRANSFER_PREFIX_TR49 = 20; // перенос в тех раздел
  const TRANSFER_PREFIX_OBJ49 = 21; // перенос обжалования
  const TRANSFER_PREFIX_ADM49 = 22; // перенос в жб адм
  const TRANSFER_PREFIX_PLAYER49 = 23; // перенос в жб игроков
  const TRANSFER_PREFIX_LD49 = 24; // перенос в жб игроков
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
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба взята на рассмотрение. Пожалуйста, не создавайте дубликатов. Ожидайте ответа.<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрение.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: 'Обж на рассмотрение ',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваше обжалование взято на рассмотрение. Пожалуйста, не создавайте дубликатов. Ожидайте ответа.<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрение.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: 'Жб ГА',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба передана Главному Администратору. Пожалуйста, не создавайте дубликатов. Ожидайте ответа.<br>"+
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: GA_PREFIX,
	  status: true,
	},
    {
	  title: 'Ошибка жб ГА (для зга)',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваше наказание уже снято, приношу извинения за свою ошибку. <br> Ваша жалоба передана Главному Администратору. Пожалуйста, не создавайте дубликатов. Ожидайте ответа.<br>"+
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: GA_PREFIX,
	  status: true,
	},
    {
	  title: 'Обж ГА',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваше обжалование передано Главному Администратору. Пожалуйста, не создавайте дубликатов. Ожидайте ответа.<br>"+
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: GA_PREFIX,
	  status: true,
	},
    {
	  title: 'Жб спецам',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба передана Специальной Администрации. Пожалуйста, не создавайте дубликатов. Ожидайте ответа.<br>"+
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: SPEC_PREFIX,
	  status: true,
	},
    {
	  title: 'Обж спецам',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваше обжалование передано Специальной Администрации. Пожалуйста, не создавайте дубликатов. Ожидайте ответа.<br>"+
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: SPEC_PREFIX,
	  status: true,
    },
    {
	  title: 'Ошибка жб Спец',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваше наказание уже снято, приношу извинения за свою ошибку. <br> Ваша жалоба передана Главному Администратору. Пожалуйста, не создавайте дубликатов. Ожидайте ответа.<br>"+
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении.[/ICODE][/COLOR][/CENTER][/B]',
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
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба составлена не по форме, пожалуйста ознакомьтесь с правилами подачи жалоб.<br> [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.3429349/']*Нажмите сюда*[/URL]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Обж не по форме',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваше обжалование составлено не по форме. Пожалуйста, ознакомьтесь с правилами подачи обжалований.<br> [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.3429398/']*Нажмите сюда*[/URL]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Ответ дм (нужен фрапс)',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ознакомьтесь с содержимым регламента 2.19 общих правил серверов и обратите внимание на 1 примечание.<br>"+
        "[B][CENTER][SPOILER][COLOR=red]2.19. [COLOR=lavender]Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [COLOR=red| Jail 60 минут<br>"+
        "[B][CENTER][COLOR=red]Примечание:[COLOR=lavender] разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.<br>"+
        "[B][CENTER][COLOR=red]Примечание:[COLOR=lavender] нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/SPOILER]<br>"+
        "[B][CENTER][COLOR=lavender]Предоставьте Фрапс и наказание будет снято.<br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Нету /time',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]В предоставленных доказательств отсутствует время (/time) , не подлежит рассмотрению.<br>Приятной игры<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Прошло 48ч',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] С момента выдачи наказания прошло более 48-ми часов, жалоба не подлежит рассмотрению..<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Окно бана',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Прикрепите в доказательства скриншот окна блокировки, которое появляется сразу после входа в игру.<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Нет докв',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]В вашей жалобе отсутствуют доказательства. Загрузите их на imgur, yapix, google photo или любой другой фото / видео хостинг.<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Недостаточно докв',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]В вашей теме недостаточно доказательств для вынесения решения.<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Не работают док-ва',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваши доказательства не рабочие или же битая ссылка, пожалуйста загрузите свои доказательства на YouTube, Yapix, Imgur или любой другой фото/видео хостинг.<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Док-ва отредактированы',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Представленные доказательства были отредактированы, обрезаны или в плохом качестве, пожалуйста прикрепите оригинал.<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Соц сети',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Доказательства предоставленные в соц. сетях по типу Twiter, Instagram, VKonakte, Telegram не принимаются<br>Загрузите свои доказательства на YouTube, Yapix, Imgur или любой другой фото/видео хостинг.<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'от 3 лица',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Жалоба составлена от 3-го лица, мы не можем ее рассмотреть. <br> Жалобу должен составлять владелец владелец аккаунта/игрок который принимал участие в ситуации.br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Нарушений не найдено',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Со стороны администратора не найдены какие либо нарушение, пожалуйста ознакомьтесь с правилами проекта.<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Нет бана',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br>"+
		"[B][CENTER][COLOR=lavender]Ваш аккаунт не находится в блокировке.<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Дубликат',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Вам уже был дан ответ в прошлой теме, пожалуйста перестаньте делать дубликаты, иначе ваш форумный аккаунт будет заблокирован.<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Дубликат на рассмотр',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша подобная тема уже взята на рассмотрение, просьба не создавать дубликаты и ожидать ответы в прошлой теме.<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Не понятно',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Суть вашего обращения не совсем понятна. Просьба уточнить в следующей теме вы признаете свою вину и хотите сократить срок наказания или вы категорически не согласны и хотите, что бы бан сняли, так как вы ничего не нарушали.<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Оффтоп',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваше обращение не относится к данному разделу.<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Неадекват',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]В вашей жалобе присутствет неадекватное поведение или неуважение к администрации<br>"+
        "[B][CENTER][COLOR=lavender]Ознакомьтесь с правилами подачи обжалования и напишите его повторно. <br> [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.3429398/']*Нажмите сюда*[/URL]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Наказание верное',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Проверив доказательства администратора, было принято решение, что наказание выдано верно.<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Разделить жб',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Составьте жалобы на каждого из администраторов отдельно.<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Не сменил ник',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Наказание будет выдано снова, так как вы не изменили имя.<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Обжалование отказ',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Сожалеем, но руководство сервера приняло решение не уменьшать вам назначенное наказание.<br>"+
        "[B][CENTER][COLOR=lavender]Просим вас в будущем соблюдать правила проекта, чтобы избежать подобных ситуаций. <br> В случае несогласия с вынесенным наказанием, вы можете обратиться в раздел `Жалобы на администрацию`.<br>"+
        "[B][CENTER][COLOR=lavender]Создание дубликатов данной темы может привести к ограничениям вашего форумного аккаунта.<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Обжалование отказ (взломан)',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]К сожалению аккаунт разблокировке не подлежит, т.к на нем были совершенны грубые нарушения.<br>"+
        "[B][CENTER][COLOR=lavender]Напомню, что владелец аккаунта несет полную ответственность за него.<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Обжалованию не подлежит',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Данное нарушение не подлежит обжалованию.<br>"+
        "[B][CENTER][COLOR=lavender]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.<br>"+
        "[B][CENTER][COLOR=lavender]Внимательно ознакомьтесь с правилами подачи обжалований <br>"+
        "[B][CENTER][COLOR=lavender][URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.3429398/']*Нажмите сюда*[/URL]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
{
        title: 'ОТКАЗ жб, верные наказания',
        dpstyle: 'oswald: 3px; color: #FF0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.12),0 2px 2px 0 rgba(0,0,0,0.14),0 1px 3px 0 rgba(0,0,0,0.2); border: 3px solid #FF0000; width: 96%',
    },
    {
	  title: 'ДМ',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] На доказательствах администратора отчётливо видно как вы наносите урон игроку.<br>нарушений со стороны администратора нет. Наказание выдано верно.<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Оск род',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] На доказательствах администратора отчетливо видно как вы оскорбляете родню.<br> Наказание выдано верно и снято не будет. Нарушений со стороны администратора нет.<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'упом род',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] На доказательствах администратора отчетливо видно как вы упоминаете родню в негативном ключе.<br> Наказание выдано верно и снято не будет. Нарушений со стороны администратора нет.<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'нон рп обман',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] На вас была оформлена жалоба на форуме. После её проверки выяснилось, что вы раннее обманули игрока: после чего жалоба была одобрена и вам было выдано ваше наказание.<br> Наказание выдано верно и снято не будет. Нарушений со стороны администратора нет.<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Фейк ник',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] вы позаимствовали ник, который раннее уже существовал на сервере и чуть-чуть его изменили, дабы вас пропустила система. Это запрещено.<br> Наказание выдано верно и снято не будет. Нарушений со стороны администратора нет.<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Фейк ник админа',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] вы позаимствовали ник администратора нашего сервера и чуть-чуть его изменили, дабы вас пропустила система. Это запрещено.<br> Наказание выдано верно и снято не будет. Нарушений со стороны администратора нет.<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'капс лок',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] На доказательствах администратора отчетливо видно как вы используете верхний ригистр при написании текста. Написание 2 или более больших букв в одном слове будет считаться нарушением рнгламента. <br> Исключением будет: аббравиатура, название тк. семей и ск.<br> Наказание выдано верно и снято не будет. Нарушений со стороны администратора нет.<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
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
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]В следствие беседы с администратором, было выяснено, наказание было выдано по ошибке. <br>"+
        "[B][CENTER][COLOR=lavender]С администратором будет проведена необходимая работа. Накзание будет снято<br>"+
		'[B][CENTER][COLOR=GREEN][ICODE]Одобрено. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Адм снят',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Администратор снят / ушёл ПСЖ.<br>"+
        "[B][CENTER][COLOR=lavender]Наказание будет снято.<br>"+
		'[B][CENTER][COLOR=green][ICODE]Одобрено. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Беседа с адм',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]С администратором будет проведена необходимая работа.<br>"+
		'[B][CENTER][COLOR=GREEN][ICODE]Одобрено. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Чс снят',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваш черный список был снят. Ждём вас снова на должностях нашего сервера.<br>"+
        "[B][CENTER][COLOR=lavender]Впредь больше не нарушайте, а так же ознакомьтесь с правилами проекта <br> [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL]<br>"+
		'[B][CENTER][COLOR=green][ICODE]Одобрено. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Ник изменен',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Впредь больше не ставьте таких ников, в следующий раз обжалование будет отказано.<br>"+
        "[B][CENTER][COLOR=lavender]Впредь больше не нарушайте, а так же ознакомьтесь с правилами проекта <br> [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL]<br>"+
		'[B][CENTER][COLOR=green][ICODE]Одобрено. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Бан снят (беседа игроков)',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша блокировка в беседе игроков была снята.<br>"+
        "[B][CENTER][COLOR=lavender]Обратитесь к модерации беседы для того, что бы вас туда добавили.<br>"+
		'[B][CENTER][COLOR=green][ICODE]Одобрено. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Наказание снято',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Наказание с вашего аккаунта полностью снято<br>"+
        "[B][CENTER][COLOR=lavender]Впредь больше не нарушайте, а так же ознакомьтесь с правилами проекта <br> [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL]<br>"+
		'[B][CENTER][COLOR=green][ICODE]Одобрено. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Снижено до мута 120',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Наказание будет снижено до блокировки игрового чата на 120 минут<br>"+
        "[B][CENTER][COLOR=lavender]Впредь больше не нарушайте, а так же ознакомьтесь с правилами проекта <br> [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL]<br>"+
		'[B][CENTER][COLOR=green][ICODE]Одобрено. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Снижено до бан Х',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Наказание будет снижено до блокировки аккаунта на X дней<br>"+
        "[B][CENTER][COLOR=lavender]Впредь больше не нарушайте, а так же ознакомьтесь с правилами проекта <br> [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL]<br>"+
		'[B][CENTER][COLOR=green][ICODE]Одобрено. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Снижено до бан 30',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Наказание будет снижено до блокировки аккаунта на 30 дней<br>"+
        "[B][CENTER][COLOR=lavender]Впредь больше не нарушайте, а так же ознакомьтесь с правилами проекта <br> [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL]<br>"+
		'[B][CENTER][COLOR=green][ICODE]Одобрено. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Снижено до бан 15',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Наказание будет снижено до блокировки аккаунта на 15 дней<br>"+
        "[B][CENTER][COLOR=lavender]Впредь больше не нарушайте, а так же ознакомьтесь с правилами проекта <br> [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL]<br>"+
		'[B][CENTER][COLOR=green][ICODE]Одобрено. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Снижено до бан 7',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Наказание будет снижено до блокировки аккаунта на 7 дней<br>"+
        "[B][CENTER][COLOR=lavender]Впредь больше не нарушайте, а так же ознакомьтесь с правилами проекта <br> [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL]<br>"+
		'[B][CENTER][COLOR=green][ICODE]Одобрено. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
        title: 'НЕ ТУДА',
        dpstyle: 'oswald: 3px; color: #9966FF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.12),0 2px 2px 0 rgba(0,0,0,0.14),0 1px 3px 0 rgba(0,0,0,0.2); border: 3px solid #9966FF; width: 96%',
    },
    {
      title: 'перемещение в жб на игроков',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Вы ошиблись разделом, перемущаю вашу тему в раздел жалоб на игроков. <br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: TRANSFER_PREFIX_PLAYER49,
	  status: open,
	},
    {
     title: 'перемещение в жб на лд',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Вы ошиблись разделом, переношу в раздел жалоб на лидеров. <br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: TRANSFER_PREFIX_LD49,
	  status: open,
	},
    {
     title: 'В жб на сотрудников',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Вы ошиблись разделом, обратитесь в раздел жалоб на сотрудников фракции.<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
     title: 'перемещение В жб на адм',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Вы ошиблись разделом, пеерношу в раздел жалоб на администрацию. <br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: TRANSFER_PREFIX_ADM49,
	  status: open,
	},
    {
     title: 'перемещение В обжалования',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Вы ошиблись разделом, пеерношу в раздел обжалований наказаний. <br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: TRANSFER_PREFIX_OBJ49,
	  status: open,
	},
    {
	  title: 'В тех поддержку',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Решением проблем такого типа администрация не занимается. Вам следует обратится в техническую поддержку и ждать обратной связи.[/COLOR]<br>"+
        "[B][CENTER][url=https://vk.com/br_tech]*Вконтакте*[/url] [url=https://t.me/br_techBot]*Телеграм*[/url][/B][/CENTER]"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Перенос жб тех',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Вы ошиблись разделом. Ваше наказание вам было выдано техническим специалистом, поэтому я переношу вашу тему в раздел жалоб на технических специалистов.<br>"+
        "[B][CENTER]Ожидайте ответа в этой теме от технического специалиста, дубликаты этой темы создавать [COLOR=RED]не нужно<br>[/B][/CENTER]"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=YELLOW][ICODE]На рассмотрении.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: TRANSFER_PREFIX_TR49,
	  status: open,
	},
    {
     title: 'Ошибся сервером',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Вы ошиблись сервером, переношу вашу тему в нужный раздел. <br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>",
     prefix: WAIT_PREFIX,
	},
    {
        title: 'ДРУГОЕ',
        dpstyle: 'oswald: 3px; color: #99FFFF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.12),0 2px 2px 0 rgba(0,0,0,0.14),0 1px 3px 0 rgba(0,0,0,0.2); border: 3px solid #99FFFF; width: 96%',
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
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Для обжалования вашего наказания вам необходимо договориться с обманутой стороной о возврате имущества.<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Нрп обман (договоритесь от 3л)',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Для обжалования вашего наказания вам необходимо договориться с обманутой стороной о возврате имущества, после чего обманутый игрок должен написать обжалование с аккаунта на котором писал жалобы после которой вы получили бан. <br>"+
        "[B][CENTER][COLOR=lavender]В доказательства требуется предоставить вашу с ним перкписку в соц сети, на которой будут видны условия сделки, а так же окно бана.<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Нрп обман (ник и вк)',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Заполните пожалуйста форму ниже<br>"+
        "[B][CENTER][COLOR=lavender]Ваш Nick_Name: <br> Ссылка на ваше ВК: <br> NickName игрока: <br> Ссылка на ВК игрока: <br>"+
		'[B][CENTER][COLOR=yellow][ICODE]Открыто. На рассмотрении.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: 'Нрп обман (разбан 24ч)',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Аккаунт разблокирован на 24ч для передачи имущества игроку<br>"+
        "[B][CENTER][COLOR=lavender]Передача какого-либо имущества кому-либо другому будет расчитываться как трансфер и аккаунты будут заблокированы<br>"+
		'[B][CENTER][COLOR=yellow][ICODE]Открыто. На рассмотрении.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: 'Нрп обман (ущерб возмещен)',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваш аккаунт разблокирован, так как ущерб был возмещен.<br>"+
        "[B][CENTER][COLOR=lavender]Впредь больше не нарушайте, а так же ознакомьтесь с правилами проекта <br> [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL]<br>"+
		'[B][CENTER][COLOR=green][ICODE]Одобрено. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Нрп обман (ущерб возмещен 3л)',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Наказание с игрока полностью снято.<br>"+
		'[B][CENTER][COLOR=green][ICODE]Одобрено. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Нрп обман (не вернул)',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Наказание будет выдано снова, так как вы не возместили ущерб обманутой стороне.<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Нрп обман (не вернул 3л)',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Наказание будет выдано снова, так как игрок не вернул ущерб обманутой стороне.<br>"+
		'[B][CENTER][COLOR=green][ICODE]Одобрено. Закрыто.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Ник (разбан 24ч)',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваш аккаунт разблокирован на 24ч для смены никнейма. После изменения отпишите в данную тему.<br>"+
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении.<br>Приятной игры на сервере GOLD!![/ICODE][/COLOR][/CENTER][/B]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: 'Прикрепите Вк',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Прикрепите ссылку на вашу страницу ВК<br>"+
		'[B][CENTER][COLOR=yellow][ICODE]Открыто. На рассмотрении.[/ICODE][/COLOR][/CENTER][/B]',
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
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX_TR49, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX_OBJ49, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX_ADM49, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX_PLAYER49, false));
 $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX_LD49, false));

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
if(prefix == TRANSFER_PREFIX_TR49) {
				moveThread(prefix, 1196); // в жб на техов
			}
if(prefix == TRANSFER_PREFIX_OBJ49) {
				moveThread(prefix, 683); //  в обж
			}
if(prefix == TRANSFER_PREFIX_ADM49) {
				moveThread(prefix, 680); //  в жб на адм
			}
if(prefix == TRANSFER_PREFIX_LD49) {
				moveThread(prefix, 681); //  в жб на лд
			}
if(prefix == TRANSFER_PREFIX_PLAYER49) {
				moveThread(prefix, 682); // в жб на игроков
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