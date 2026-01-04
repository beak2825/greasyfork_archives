// ==UserScript==
// @name     Жб/Обж by C.Arankay
// @namespace    https://forum.blackrussia.online
// @version      1.21
// @description  Жб/Обж // by Clifford Arankay
// @author       Kseniya_Frog
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license 	 MIT
// @collaborator Lolipop
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @downloadURL https://update.greasyfork.org/scripts/524062/%D0%96%D0%B1%D0%9E%D0%B1%D0%B6%20by%20CArankay.user.js
// @updateURL https://update.greasyfork.org/scripts/524062/%D0%96%D0%B1%D0%9E%D0%B1%D0%B6%20by%20CArankay.meta.js
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
		'[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>'+
		'[B]Ваша жалоба взята на рассмотрение, пожалуйста не создавайте дубликатов. Ожидайте ответа.[/B]<br><br>'+
		'[B]На рассмотрении.[/B]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: 'Обж на рассмотрение ',
	  content:
		'[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>'+
		"[B]Ваше обжалование взято на рассмотрение, пожалуйста не создавайте дубликатов. Ожидайте ответа.<br><br>"+
		'[B]На рассмотрении.[/B]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: 'Жб ГА',
	  content:
		'[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>'+
		"[B]Ваша жалоба передана Главному Администратору, пожалуйста не создавайте дубликатов.<br> Ожидайте ответа.<br><br>"+
		'[B]На рассмотрении.[/B]',
	  prefix: GA_PREFIX,
	  status: true,
	},
    {
	  title: 'Ошибка жб ГА',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Ваше наказание уже снято, приношу извинения за свою ошибку. <br> Ваша жалоба передана Главному Администратору, пожалуйста не создавайте дубликатов.<br> Ожидайте ответа.<br><br>"+
		'[B]На рассмотрении.[/B]',
	  prefix: GA_PREFIX,
	  status: true,
	},
    {
	  title: 'Обж ГА',
	  content:
		'[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>'+
		"[B]Ваше обжалование передано Главному Администратору, пожалуйста не создавайте дубликатов.<br> Ожидайте ответа.<br><br>"+
		'[B]На рассмотрении.[/B]',
	  prefix: GA_PREFIX,
	  status: true,
	},
    {
	  title: 'Жб спецам',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Ваша жалоба передана Специальной Администрации, пожалуйста не создавайте дубликатов.<br> Ожидайте ответа.<br><br>"+
		'[B]На рассмотрении.[/B]',
	  prefix: SPEC_PREFIX,
	  status: true,
	},
    {
	  title: 'Обж спецам',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Ваше обжалование передано Специальной Администрации, пожалуйста не создавайте дубликатов.<br> Ожидайте ответа.<br><br>"+
		'[B]На рассмотрении.[/B]',
	  prefix: SPEC_PREFIX,
	  status: true,
    },
    {
	  title: 'Ошибка жб Спец',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Ваше наказание уже снято, приношу извинения за свою ошибку. <br> Ваша жалоба передана Специальной Администрации, пожалуйста не создавайте дубликатов.<br> Ожидайте ответа.<br><br>"+
		'[B]На рассмотрении.[/B]',
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
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Ваша жалоба составлена не по форме, пожалуйста ознакомьтесь с правилами подачи жалоб - [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.3429349/']*Нажмите сюда*[/URL]<br><br>"+
		'[B]Отказано. Закрыто.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Обж не по форме',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Ваше обжалование составлено не по форме, пожалуйста ознакомьтесь с правилами подачи обжалований - [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.3429398/']*Нажмите сюда*[/URL]<br><br>"+
		'[B]Отказано. Закрыто.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Ответ дм (нужен фрапс)',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Ознакомьтесь с содержимым регламента 2.19 общих правил серверов и обратите внимание на 1 примечание:<br>"+
        "[B][SPOILER][COLOR=red]2.19. [COLOR=lavender]Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [COLOR=red] Jail 60 минут<br>"+
        "[B][COLOR=red]Примечание:[COLOR=lavender] разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.<br>"+
        "[B][COLOR=red]Примечание:[COLOR=lavender] нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/SPOILER]"+
        "[B][COLOR=white]Предоставьте Фрапс и наказание будет снято.<br><br>"+
		'[B]Закрыто.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Нету /time',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]В предоставленных доказательств отсутствует время (/time) , не подлежит рассмотрению.<br>Приятной игры.<br><br>"+
		'[B]Отказано. Закрыто.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Прошло 48ч',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B] С момента выдачи наказания прошло более 48-ми часов, жалоба не подлежит рассмотрению..<br><br>"+
		'[B]Отказано. Закрыто.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Окно бана',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Прикрепите в доказательства скриншот окна блокировки, которое появляется сразу после входа в игру.<br><br>"+
		'[B]Отказано. Закрыто.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Нет докв',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]В вашей жалобе отсутствуют доказательства. Загрузите их на imgur, yapix, google photo или любой другой фото / видео хостинг.<br><br>"+
		'[B]Отказано. Закрыто.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Недостаточно докв',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]В вашей теме недостаточно доказательств для вынесения решения.<br><br>"+
		'[B]Отказано. Закрыто.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Не работают док-ва',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Ваши доказательства не рабочие или же битая ссылка, пожалуйста загрузите свои доказательства на YouTube, Yapix, Imgur или любой другой фото/видео хостинг.<br><br>"+
		'[B]Отказано. Закрыто.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Док-ва отредактированы',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Представленные доказательства были отредактированы, обрезаны или в плохом качестве, пожалуйста прикрепите оригинал.<br><br>"+
		'[B]Отказано. Закрыто.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Соц сети',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Доказательства предоставленные в соц. сетях по типу Twiter, Instagram, VKonakte, Telegram не принимаются<br>Загрузите свои доказательства на YouTube, Yapix, Imgur или любой другой фото/видео хостинг.<br><br>"+
		'[B]Отказано. Закрыто.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'от 3 лица',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Жалоба составлена от 3-го лица, мы не можем ее рассмотреть. <br> Жалобу должен составлять владелец владелец аккаунта/игрок который принимал участие в ситуации.<br><br>"+
		'[B]Отказано. Закрыто.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Нарушений не найдено',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }[/B]<br><br>"+
		"[B]Со стороны администратора не найдены какие либо нарушение, пожалуйста ознакомьтесь с правилами проекта.<br><br>"+
		'[B]Отказано. Закрыто.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Нет бана',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Ваш аккаунт не находится в блокировке.<br><br>"+
		'[B]Отказано. Закрыто.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Дубликат',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Вам уже был дан ответ в прошлой теме, пожалуйста перестаньте делать дубликаты, иначе ваш форумный аккаунт будет заблокирован.<br><br>"+
		'[B]Отказано. Закрыто.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Дубликат на рассмотр',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Ваша подобная тема уже взята на рассмотрение, просьба не создавать дубликаты и ожидать ответы в прошлой теме.<br><br>"+
		'[B]Отказано. Закрыто.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Не понятно',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Суть вашего обращения не совсем понятна. Просьба уточнить в следующей теме вы признаете свою вину и хотите сократить срок наказания или вы не категорически не согласны и хотите, что бы бан сняли, так как вы ничего не нарушали.<br><br>"+
		'[B].Отказано. Закрыто.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Оффтоп',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Ваше обращение не относится к данному разделу.<br><br>"+
		'[B]Отказано. Закрыто.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Неадекват',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]В вашей жалобе присутствет неадекватное поведение или неуважение к администрации<br><br>"+
        "[B]Ознакомьтесь с правилами подачи обжалования и напишите его повторно.[/B]",
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Наказание верное',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Проверив доказательства администратора, было принято решение, что наказание выдано верно.<br><br>"+
		'[B]Отказано. Закрыто.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Разделить жб',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Составьте жалобы на каждого из администраторов отдельно.<br><br>"+
		'[B]Отказано. Закрыто.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Не сменил ник',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Наказание будет выдано снова, так как вы не изменили имя.<br><br>"+
		'[B]Отказано. Закрыто.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Обжалование отказ',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Сожалеем, но руководство сервера приняло решение не уменьшать вам назначенное наказание.<br><br>"+
        "[B]Создание дубликатов данной темы может привести к ограничениям вашего форумного аккаунта.<br>"+
		'[B]В Обжаловании Отказано.<br><br> Закрыто.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Обжалование отказ (взломан)',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]К сожалению аккаунт разблокировке не подлежит, т.к на нем были совершенны грубые нарушения.<br><br>"+
        "[B]Напомню, что владелец аккаунта несет полную ответственность за него.<br><br>"+
		'[B]Отказано. Закрыто.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Обжалованию не подлежит',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Данное нарушение не подлежит обжалованию.<br><br>"+
        "[B]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.<br>"+
        "[B]Внимательно ознакомьтесь с правилами подачи обжалований - [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.3429398/']*Нажмите сюда*[/URL]<br><br>"+
		'[B]Отказано. Закрыто.[/B]',
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
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]В следствие беседы с администратором, было выяснено, наказание было выдано по ошибке.<br><br>"+
        "[B]С администратором будет проведена необходимая работа. Наказание будет снято.<br><br>"+
		'[B]Одобрено. Закрыто.[/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Адм снят',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Администратор снят / ушёл ПСЖ.<br><br>"+
        "[B]Наказание будет снято(если было выдано). <br><br>"+
		'[B]Одобрено. Закрыто.[/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Беседа с адм',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]С администратором будет проведена необходимая работа.<br><br>"+
		'[B]Одобрено. Закрыто.[/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Чс снят',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Ваш черный список был снят. Ждём вас снова на должностях нашего сервера.<br>"+
        "[B]Впредь больше не нарушайте, а так же ознакомьтесь с правилами проекта - [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL]<br><br>"+
		'[B]Одобрено. Закрыто.[/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Ник изменен',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Впредь больше не ставьте таких ников, в следующий раз обжалование будет отказано.<br><br>"+
        "[B]Впредь больше не нарушайте, а так же ознакомьтесь с правилами проекта - [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL]<br><br>"+
		'[B]Одобрено. Закрыто.[/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Бан снят (беседа игроков)',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }} [/B]<br><br>"+
		"[B]Ваша блокировка в беседе игроков была снята.<br><br>"+
        "[B]Обратитесь к модерации беседы для того, что бы вас туда добавили.<br><br>"+
		'[B]Одобрено. Закрыто.[/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Наказание снято',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Наказание с вашего аккаунта полностью снято<br>"+
        "[B]Впредь больше не нарушайте, а так же ознакомьтесь с правилами проекта - [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL]<br><br>"+
		'[B]Одобрено. Закрыто.[/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Снижено до мута 120',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Наказание будет снижено до блокировки игрового чата на 120 минут<br><br>"+
        "[B]Впредь больше не нарушайте, а так же ознакомьтесь с правилами проекта - [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL]<br><br>"+
		'[B]Одобрено. Закрыто.[/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Снижено до бан Х',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Наказание будет снижено до блокировки аккаунта на X дней<br><br>"+
        "[B]Впредь больше не нарушайте, а так же ознакомьтесь с правилами проекта - [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL]<br><br>"+
		'[B]Одобрено. Закрыто.[/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Снижено до бан 30',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }} [/B]<br><br>"+
		"[B]Наказание будет снижено до блокировки аккаунта на 30 дней<br><br>"+
        "[B]Впредь больше не нарушайте, а так же ознакомьтесь с правилами проекта - [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL]<br><br>"+
		'[B]Одобрено. Закрыто.[/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Снижено до бан 15',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Наказание будет снижено до блокировки аккаунта на 15 дней<br><br>"+
        "[B]Впредь больше не нарушайте, а так же ознакомьтесь с правилами проекта - [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL]<br><br>"+
		'[B]Одобрено. Закрыто.[/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Снижено до бан 7',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Наказание будет снижено до блокировки аккаунта на 7 дней<br><br>"+
        "[B]Впредь больше не нарушайте, а так же ознакомьтесь с правилами проекта - [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL]<br><br>"+
		'[B]Одобрено. Закрыто.[/B]',
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
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Вы ошиблись разделом, обратитесь в раздел жалоб на игроков. <br><br>"+
		'[B]Отказано. Закрыто.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
     title: 'В жб на лд',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Вы ошиблись разделом, обратитесь в раздел жалоб на лидеров. <br><br>"+
		'[B]Закрыто.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
     title: 'В жб на сотрудников',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Вы ошиблись разделом, обратитесь в раздел жалоб на сотрудников фракции.<br><br>"+
		'[B]Закрыто.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
     title: 'В жб на адм',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Вы ошиблись разделом, обратитесь в раздел жалоб на администрацию.<br><br>"+
		'[B]Закрыто.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
     title: 'В обжалования',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Вы ошиблись разделом, обратитесь в раздел обжалований наказаний. <br><br>"+
		'[B]Закрыто.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'В жб на техов',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Наказание было выдано Техническим специалистом, вы можете написать жалобу здесь: [URL= https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/]*Нажмите сюда*[/URL]<br><br>"+
		'[B]Отказано. Закрыто.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'В тех раздел',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Вы ошиблись разделом. Оставьте свою жалобу в техническом разделе сервера: [URL= https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB.22/]*Нажмите сюда*[/URL]<br><br>"+
		'[B]Отказано. Закрыто.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'В тех поддержку',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Решением проблем такого типа администрация не занимается. Вам следует обратится в техническую поддержку и ждать обратной связи.<br><br>"+
        "[B][url=https://vk.com/br_tech]*Вконтакте*[/url] [url=https://t.me/br_techBot]*Телеграм*[/url][/B]"+
		'[B]Закрыто.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Перенос жб тех',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Вы ошиблись разделом. Ваше наказание вам было выдано техническим специалистом, поэтому я переношу вашу тему в раздел жалоб на технических специалистов.<br><br>"+
        "[B]Ожидайте ответа в этой теме от технического специалиста, дубликаты этой темы создавать [COLOR=RED]не нужно![/B]<br><br>"+
		'[B]На рассмотрении.[/B]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
    {
     title: 'Ошибся сервером',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Вы ошиблись сервером, переношу вашу тему в нужный раздел. <br><br>"+
        '[B]Ожидайте ответа.[/B]',
     prefix: WAIT_PREFIX,
	},
    {
     title: 'Ошибся разделом',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Вы ошиблись разделом, переношу вашу тему в нужный раздел <br><br>"+
	    '[B]Ожидайте ответа.[/B]',
     prefix: WAIT_PREFIX,
	},
    {
        title: 'ДРУГОЕ',
        dpstyle: 'oswald: 3px; color: #99FFFF; background: #333333; box-shadow: 0 0 2px 0 rgba(0,0,0,0.12),0 2px 2px 0 rgba(0,0,0,0.14),0 1px 3px 0 rgba(0,0,0,0.2); border: 3px solid #99FFFF; width: 96%',
    },
    {
	  title: 'Приветствие',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Текст<br>",
	},
    {
	  title: 'Нрп обман (договоритесь)',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Для обжалования вашего наказания вам необходимо договориться с обманутой стороной о возврате имущества.<br><br>"+
		'[B]Отказано. Закрыто.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Нрп обман (договоритесь от 3л)',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Для обжалования вашего наказания вам необходимо договориться с обманутой стороной о возврате имущества, после чего обманутый игрок должен написать обжалование с аккаунта на котором писал жалобы после которой вы получили бан. <br><br>"+
        "[B]В доказательства требуется предоставить вашу с ним перкписку в соц сети, на которой будут видны условия сделки, а так же окно бана.<br><br>"+
		'[B]Отказано. Закрыто.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Нрп обман (ник и вк)',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Заполните пожалуйста форму ниже<br><br>"+
        "[B]Ваш Nick_Name: <br> Ссылка на ваше ВК: <br> NickName игрока: <br> Ссылка на ВК игрока: <br><br>"+
		'[B]Открыто, ожидаю вашего ответа в данной теме. <br><br>'+
        '[B]На расмотрении.[/B]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: 'Нрп обман (разбан 24ч)',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Аккаунт разблокирован на 24ч для передачи имущества игроку<br><br>"+
        "[B]Передача какого-либо имущества кому-либо другому будет расчитываться как трансфер и аккаунты будут заблокированы<br><br>"+
        '[B]Открыто, ожидаю вашего ответа в данной теме. <br><br>'+
        '[B]На расмотрении.[/B]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: 'Нрп обман (ущерб возмещен)',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Ваш аккаунт разблокирован, так как ущерб был возмещен. <br><br>"+
        "[B]Впредь больше не нарушайте, а так же ознакомьтесь с правилами проекта - [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL]<br><br>"+
		'[B]Одобрено. Закрыто.[/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Нрп обман (ущерб возмещен 3л)',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Наказание с игрока полностью снято.<br><br>"+
		'[B]Одобрено. Закрыто.[/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Нрп обман (не вернул)',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }} [/B]<br><br>"+
		"[B]Наказание будет выдано снова, так как вы не возместили ущерб обманутой стороне.<br><br>"+
		'[B]Отказано. Закрыто.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Нрп обман (не вернул 3л)',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Наказание будет выдано снова, так как игрок не вернул ущерб обманутой стороне.<br><br>"+
		'[B]Одобрено. Закрыто.[/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Ник (разбан 24ч)',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Ваш аккаунт разблокирован на 24ч для смены никнейма. После изменения отпишите в данную тему.<br><br>"+
		'[B]Открыто, ожидаю вашего ответа в данной теме. <br><br>'+
        '[B]На расмотрении.[/B]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: 'Прикрепите Вк',
	  content:
		"[B]Доброго времени суток уважаемый {{ user.name }}[/B]<br><br>"+
		"[B]Прикрепите ссылку на вашу страницу ВК<br><br>"+
		'[B]Открыто, ожидаю вашего ответа в данной теме. <br><br>'+
        '[B]На расмотрении.[/B]',
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