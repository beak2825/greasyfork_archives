// ==UserScript==
// @name         Скрипт форума для рук Purple
// @namespace    https://forum.blackrussia.online
// @version      1.6
// @description  Для форума.
// @author       Emiliano Jimenez
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license 	 MIT
// @collaborator jimenez
// @icon https://icons.iconarchive.com/icons/3xhumed/mega-games-pack-05/128/BMW-M3-Challenge-1-icon.png
// @downloadURL https://update.greasyfork.org/scripts/453307/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%D0%B4%D0%BB%D1%8F%20%D1%80%D1%83%D0%BA%20Purple.user.js
// @updateURL https://update.greasyfork.org/scripts/453307/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%D0%B4%D0%BB%D1%8F%20%D1%80%D1%83%D0%BA%20Purple.meta.js
// ==/UserScript==

(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread solved
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const buttons = [
	{
	  title: 'ОБЖ: Рассмотрение',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Ваше обжалование взято на рассмотрение. Ожидайте ответа в данной теме. Не создавайте повторные темы в противном случае Вы можете получить блокировку форумного аккаунта.[/B][/FONT][/SIZE]<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
"[CENTER][COLOR=rgb(250, 197, 28)]На рассмотрении[/COLOR]. [/B][/FONT][/SIZE][/CENTER]<br><br><br>" +
"[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Заместитель Главного Администратора.[/B][/FONT][/SIZE][/RIGHT]<br>"+
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]- [COLOR=rgb(255, 0, 0)]Alexandr Sudarkin[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
    },
     {
	  title: 'ОБЖ: Не по форме',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Обжалование составлено не по форме или же не соответствует правилам подачи. Ознакомится - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/']Кликабельно[/URL].<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
"[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR]. [/B][/FONT][/SIZE][/CENTER]<br><br><br>" +
"[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Заместитель Главного Администратора.[/B][/FONT][/SIZE][/RIGHT]<br>"+
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]- [COLOR=rgb(255, 0, 0)]Alexandr Sudarkin[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
    },
	 {
	  title: 'ОБЖ: Отказано',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]В обжаловании отказано.<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
"[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR]. [/B][/FONT][/SIZE][/CENTER]<br><br><br>" +
"[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Заместитель Главного Администратора.[/B][/FONT][/SIZE][/RIGHT]<br>"+
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]- [COLOR=rgb(255, 0, 0)]Alexandr Sudarkin[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
    },
	{
	  title: 'ОБЖ: Одобрено, полностью',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Ваше обжалование одобрено, ваше наказание будет полностью снято.<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
"[CENTER][COLOR=rgb(65, 168, 95)]Одобрено[/COLOR]. [/B][/FONT][/SIZE][/CENTER]<br><br><br>" +
"[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Заместитель Главного Администратора.[/B][/FONT][/SIZE][/RIGHT]<br>"+
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]- [COLOR=rgb(255, 0, 0)]Alexandr Sudarkin[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
    },
	{
	  title: 'ОБЖ: Одобрено, частично',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Ваше обжалование было рассмотрено и принято решение о сокращении вашего наказания.<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
"[CENTER][COLOR=rgb(65, 168, 95)]Одобрено[/COLOR]. [/B][/FONT][/SIZE][/CENTER]<br><br><br>" +
"[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Заместитель Главного Администратора.[/B][/FONT][/SIZE][/RIGHT]<br>"+
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]- [COLOR=rgb(255, 0, 0)]Alexandr Sudarkin[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
	},
    {
      title: '<÷÷÷÷÷÷÷÷÷÷÷÷÷÷÷÷÷÷÷÷÷÷÷÷÷÷÷÷÷÷÷>',
      content:
        'И зачем ты сюда нажал? Это разделитель!',
        status: true,
    },
    {
      title: 'ЖБ: Рассмотрение',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Ваша жалоба взята на рассмотрение. Ожидайте ответа в данной теме. Не создавайте повторные темы в противном случае Вы можете получить блокировку форумного аккаунта.[/B][/FONT][/SIZE]<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
"[CENTER][COLOR=rgb(250, 197, 28)]На рассмотрении[/COLOR]. [/B][/FONT][/SIZE][/CENTER]<br><br><br>" +
"[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Заместитель Главного Администратора.[/B][/FONT][/SIZE][/RIGHT]<br>"+
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]- [COLOR=rgb(255, 0, 0)]Alexandr Sudarkin[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
    },
    {
      title: 'ЖБ: Не по форме',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Жалоба составлена не по форме или же не соответствует правилам подачи. Ознакомится - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-администрацию.3429349/']Кликабельно[/URL].<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
"[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR]. [/B][/FONT][/SIZE][/CENTER]<br><br><br>" +
"[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Заместитель Главного Администратора.[/B][/FONT][/SIZE][/RIGHT]<br>"+
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]- [COLOR=rgb(255, 0, 0)]Alexandr Sudarkin[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
    },
    {
      title: 'ЖБ: Ссылку на тему',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Прикрепите ссылку на тему о которой вы ведёте речь и подайте жалобу повторно.<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
"[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR]. [/B][/FONT][/SIZE][/CENTER]<br><br><br>" +
"[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Заместитель Главного Администратора.[/B][/FONT][/SIZE][/RIGHT]<br>"+
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]- [COLOR=rgb(255, 0, 0)]Alexandr Sudarkin[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
    },
    {
      title: 'ЖБ: Оффтоп',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Убедительная просьба ознакомиться с назначением данного раздела и в будущем не создавать темы имеющие подобное содеражание.<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
"[CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR]. [/B][/FONT][/SIZE][/CENTER]<br><br><br>" +
"[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Заместитель Главного Администратора.[/B][/FONT][/SIZE][/RIGHT]<br>"+
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]- [COLOR=rgb(255, 0, 0)]Alexandr Sudarkin[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
    },
    {
      title: 'ЖБ: Цвет текста',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Цвет текста сливается с классической темой форума из-за чего в прочтении возникают трудности. Исправьте данную проблему и подайте жалобу повторно.<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
"[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR]. [/B][/FONT][/SIZE][/CENTER]<br><br><br>" +
"[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Заместитель Главного Администратора.[/B][/FONT][/SIZE][/RIGHT]<br>"+
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]- [COLOR=rgb(255, 0, 0)]Alexandr Sudarkin[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
    },
    {
      title: 'ЖБ: Никнеймы/Статусы',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]С недавних времён в разделе жалоб нашего сервера вы больше не сможете менять форумные никнеймы и статусы. Если вы хотите это сделать, то можете оставить данную просьбу под форумным аккаунтом ГА/ЗГА любого из серверов.<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
"[CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR]. [/B][/FONT][/SIZE][/CENTER]<br><br><br>" +
"[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Заместитель Главного Администратора.[/B][/FONT][/SIZE][/RIGHT]<br>"+
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]- [COLOR=rgb(255, 0, 0)]Alexandr Sudarkin[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
    },
    {
      title: 'ЖБ: Прошло 48ч',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]С момента выдачи наказания прошло более 48-ми часов.<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
"[CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR]. [/B][/FONT][/SIZE][/CENTER]<br><br><br>" +
"[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Заместитель Главного Администратора.[/B][/FONT][/SIZE][/RIGHT]<br>"+
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]- [COLOR=rgb(255, 0, 0)]Alexandr Sudarkin[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
    },
    {
      title: 'ЖБ: Снятие наказания | Беседа',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Ваша жалоба одобрена, наказание будет снято. С Администратором будет проведена беседа.<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
"[CENTER][COLOR=rgb(65, 168, 95)]Одобрено[/COLOR]. [/B][/FONT][/SIZE][/CENTER]<br><br><br>" +
"[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Заместитель Главного Администратора.[/B][/FONT][/SIZE][/RIGHT]<br>"+
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]- [COLOR=rgb(255, 0, 0)]Alexandr Sudarkin[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
    },
    {
      title: 'ЖБ: Снятие наказания | Меры',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Ваша жалоба одобрена, наказание будет снято. В отношении администратора будут приняты соответствующие меры.<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
"[CENTER][COLOR=rgb(65, 168, 95)]Одобрено[/COLOR]. [/B][/FONT][/SIZE][/CENTER]<br><br><br>" +
"[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Заместитель Главного Администратора.[/B][/FONT][/SIZE][/RIGHT]<br>"+
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]- [COLOR=rgb(255, 0, 0)]Alexandr Sudarkin[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
    },
    {
      title: 'ЖБ: Выдано по жалобе',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Наказание было выдано по жалобе написанной с форума. Жалоба рассмотрена верно.<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Ссылка на жалобу - *клик*.<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Ссылка на док-ва прикреплённые к жалобе - *клик*.<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
"[CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR]. [/B][/FONT][/SIZE][/CENTER]<br><br><br>" +
"[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Заместитель Главного Администратора.[/B][/FONT][/SIZE][/RIGHT]<br>"+
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]- [COLOR=rgb(255, 0, 0)]Alexandr Sudarkin[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
    },
    {
      title: 'ЖБ: Выдано верно',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Наказание выдано верно.<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
"[CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR]. [/B][/FONT][/SIZE][/CENTER]<br><br><br>" +
"[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Заместитель Главного Администратора.[/B][/FONT][/SIZE][/RIGHT]<br>"+
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]- [COLOR=rgb(255, 0, 0)]Alexandr Sudarkin[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
    },
     {
      title: '<÷÷÷÷÷÷÷÷÷÷÷÷÷÷÷÷÷÷÷÷÷÷÷÷÷÷÷÷÷÷÷>',
      content:
        'И зачем ты сюда нажал? Это разделитель!',
        status: true,
    },
    {
	  title: 'Свой ответ',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B] НАПИСАТЬ [/B][/FONT][/SIZE]<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br><br><br>" +
"[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Заместитель Главного Администратора.[/B][/FONT][/SIZE][/RIGHT]<br>"+
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]- [COLOR=rgb(255, 0, 0)]Alexandr Sudarkin[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
    },
    {
      title: 'Жалобы на тех.спеца',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B][SIZE=3][FONT=trebuchet ms][B]Вы получили наказание от Технического Специалиста нашего сервера, обратитесь в соответствующий раздел. Раздел - [URL='https://forum.blackrussia.online/index.php?forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%966-purple.1187/']Кликабельно[/URL].<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
"[CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR]. [/B][/FONT][/SIZE][/CENTER] <br><br><br>" +
"[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Заместитель Главного Администратора.[/B][/FONT][/SIZE][/RIGHT]<br>"+
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]- [COLOR=rgb(255, 0, 0)]Alexandr Sudarkin[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
    },
];

$(document).ready(() => {
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

// Добавление кнопок при загрузке страницы
    addButton('Рассмотрено🧐', 'watched');
    addButton('Одобрено✅', 'accepted');
	addButton('Закрыто⛔', 'closed');
    addButton('Отказано🚫', 'unaccept');
    addButton('На рассмотрении🤔', 'pin');
    addButton('Ответы💥', 'selectAnswer');


// Поиск информации о теме
    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#closed').click(() => editThreadData(CLOSE_PREFIX, false));
    $('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));

    $(`button#selectAnswer`).click(() => {
        XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
        buttons.forEach((btn, id) => {
            if(id > 0) {
                $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
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
