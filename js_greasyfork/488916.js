// ==UserScript==
// @name         BLACK RUSSIA YAROSLAVL || Скрипт Кураторов администрации/ГС/ЗГС
// @namespace    https://forum.blackrussia.online/
// @version      1.1.13
// @description  Создан для Кураторов форума сервера YAROSLAVL
// @author       Windy_Vinchi
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon https://img.icons8.com/nolan/452/beezy.png
// @downloadURL https://update.greasyfork.org/scripts/488916/BLACK%20RUSSIA%20YAROSLAVL%20%7C%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D0%B8%D0%93%D0%A1%D0%97%D0%93%D0%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/488916/BLACK%20RUSSIA%20YAROSLAVL%20%7C%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D0%B8%D0%93%D0%A1%D0%97%D0%93%D0%A1.meta.js
// ==/UserScript==
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
       title: '_______________________________________ღ Жалобы на администрацию ღ_______________________________________ ',
    },
    {
      title: 'Запрошу доказ.',
      content:
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(204, 204, 204)]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(0, 203, 252)]{{ user.mention }}[/COLOR][COLOR=rgb(204, 204, 204)].[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]Запрошу доказательства у администратора.[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]Ожидайте ответ в данной теме, не нужно создавать ее копии.[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][FONT=courier new][COLOR=rgb(251, 160, 38)]На рассмотрении...[/COLOR][/FONT][/CENTER]",
      prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: 'На рассмотрении.',
      content:
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(204, 204, 204)]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(0, 203, 252)]{{ user.mention }}[/COLOR][COLOR=rgb(204, 204, 204)].[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]Ваша жалоба взята на рассмотрение.[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]Ожидайте ответ в данной теме, и не нужно создавайте ее копии.[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][FONT=courier new][COLOR=rgb(251, 160, 38)]На рассмотрении...[/COLOR][/FONT][/CENTER]",
      prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: 'Не по форме',
      content:
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(204, 204, 204)]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(0, 203, 252)]{{ user.mention }}[/COLOR][COLOR=rgb(204, 204, 204)].[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]Жалоба была составлена не по форме.[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]Прочтите правила подачи жалоб - [URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-администрацию.3429349/']*Нажмите*[/URL][/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 0, 0)]Отказано,[/COLOR] [COLOR=rgb(204, 204, 204)]Закрыто.[/SIZE][/FONT][/CENTER]",
        prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Беседа',
      content:
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(204, 204, 204)]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(0, 203, 252)]{{ user.mention }}[/COLOR][COLOR=rgb(204, 204, 204)].[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]Ваша жалоба была одобрена, с администратором будет проведена беседа.[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]Наказание будет снято в ближайшее время, если оно еще не снято.[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]Спасибо за содействие![/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=rgb(0, 255, 0)][FONT=courier new]Одобрено,[/COLOR] [COLOR=rgb(204, 204, 204)]Закрыто.[/COLOR][/FONT][/SIZE][/CENTER]",
        prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Верное наказание',
      content:
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(204, 204, 204)]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(0, 203, 252)]{{ user.mention }}[/COLOR][COLOR=rgb(204, 204, 204)].[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]Проверив доказательства Администратора, [/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]было принято решение что наказание было выдано верно![/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 0, 0)]Отказано,[/COLOR] [COLOR=rgb(204, 204, 204)]Закрыто.[/SIZE][/FONT][/CENTER]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Не администратор',
      content:
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(204, 204, 204)]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(0, 203, 252)]{{ user.mention }}[/COLOR][COLOR=rgb(204, 204, 204)].[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]Данный игрок не является администратором.[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][FONT=courier new][COLOR=rgb(255, 0, 0)][SIZE=4]Закрыто.[/SIZE][/COLOR][/FONT][/CENTER]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Нет /time',
      content:
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(204, 204, 204)]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(0, 203, 252)]{{ user.mention }}[/COLOR][COLOR=rgb(204, 204, 204)].[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]На ваших доказательствах отсутствует /time,[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]а соответственно, жалоба рассмотрению не подлежит.[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 0, 0)]Отказано,[/COLOR] [COLOR=rgb(204, 204, 204)]Закрыто.[/SIZE][/FONT][/CENTER]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'От 3-го лица',
      content:
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(204, 204, 204)]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(0, 203, 252)]{{ user.mention }}[/COLOR][COLOR=rgb(204, 204, 204)].[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]Жалоба составлена от 3-го лица,[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]жалобы подобного формата рассмотрению не подлежат.[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 0, 0)]Отказано,[/COLOR] [COLOR=rgb(204, 204, 204)]Закрыто.[/SIZE][/FONT][/CENTER]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Нужен фрапс',
      content:
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(204, 204, 204)]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(0, 203, 252)]{{ user.mention }}[/COLOR][COLOR=rgb(204, 204, 204)].[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]В данной ситуации обязательно должен быть фрапс(видеофиксация) всех моментов.[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]Без него ваша жалоба будет отказана.[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 0, 0)]Отказано,[/COLOR] [COLOR=rgb(204, 204, 204)]Закрыто.[/SIZE][/FONT][/CENTER]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Фрапс обрезан',
      content:
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(204, 204, 204)]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(0, 203, 252)]{{ user.mention }}[/COLOR][COLOR=rgb(204, 204, 204)].[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]Ваш фрапс обрезан. Вынести вердикт по данному отрывку невозможно.[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]Если у вас есть полный фрапс, пересоздайте тему, прикрепив его.[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 0, 0)]Отказано,[/COLOR] [COLOR=rgb(204, 204, 204)]Закрыто.[/SIZE][/FONT][/CENTER]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Док-ва отредактированы',
      content:
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(204, 204, 204)]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(0, 203, 252)]{{ user.mention }}[/COLOR][COLOR=rgb(204, 204, 204)].[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]Предоставленные доказательства отредактированы.[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]Подобные жалобы рассмотрению не подлежат.[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 0, 0)]Отказано,[/COLOR] [COLOR=rgb(204, 204, 204)]Закрыто.[/SIZE][/FONT][/CENTER]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Док-ва в плохом качестве',
      content:
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(204, 204, 204)]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(0, 203, 252)]{{ user.mention }}[/COLOR][COLOR=rgb(204, 204, 204)].[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]Доказательства были предоставлены в плохом качестве,[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]пожалуйста прикрепите более качественные фото/видео.[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 0, 0)]Отказано,[/COLOR] [COLOR=rgb(204, 204, 204)]Закрыто.[/SIZE][/FONT][/CENTER]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Прошло более 48 часов',
      content:
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(204, 204, 204)]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(0, 203, 252)]{{ user.mention }}[/COLOR][COLOR=rgb(204, 204, 204)].[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]С момента выдачи наказания прошло более 48-ми часов,[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]жалоба рассмотрению не подлежит.[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 0, 0)]Отказано,[/COLOR] [COLOR=rgb(204, 204, 204)]Закрыто.[/SIZE][/FONT][/CENTER]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Нет док-в',
      content:
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(204, 204, 204)]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(0, 203, 252)]{{ user.mention }}[/COLOR][COLOR=rgb(204, 204, 204)].[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]В вашей жалобе отсутствют доказательства.[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]Прикрепите доказательсва в хорошем качестве на разрешенных платформах.(Yapx/Imgur/YouTube/ImgBB)[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 0, 0)]Отказано,[/COLOR] [COLOR=rgb(204, 204, 204)]Закрыто.[/SIZE][/FONT][/CENTER]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Недостаточно док-в.',
      content:
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(204, 204, 204)]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(0, 203, 252)]{{ user.mention }}[/COLOR][COLOR=rgb(204, 204, 204)].[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]Приложеных вами доказательств не достаточно для рассмотрения жалобы.[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]Пожалуйста приложите полную версию доказательств в новой жалобе.[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 0, 0)]Отказано,[/COLOR] [COLOR=rgb(204, 204, 204)]Закрыто.[/SIZE][/FONT][/CENTER]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Не рабочие док-ва',
      content:
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(204, 204, 204)]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(0, 203, 252)]{{ user.mention }}[/COLOR][COLOR=rgb(204, 204, 204)].[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]Предоставленные вами доказательства нерабочие.[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]Создайте новую тему, прикрепив рабочую ссылку на док-ва.[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 0, 0)]Отказано,[/COLOR] [COLOR=rgb(204, 204, 204)]Закрыто.[/SIZE][/FONT][/CENTER]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Окно бана',
      content:
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(204, 204, 204)]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(0, 203, 252)]{{ user.mention }}[/COLOR][COLOR=rgb(204, 204, 204)].[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]Зайдите в игру и сделайте скрин окна с баном после чего, заново напишите жалобу.[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 0, 0)]Отказано,[/COLOR] [COLOR=rgb(204, 204, 204)]Закрыто.[/SIZE][/FONT][/CENTER]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Дублирование',
      content:
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(204, 204, 204)]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(0, 203, 252)]{{ user.mention }}[/COLOR][COLOR=rgb(204, 204, 204)].[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]Ответ был дан в предыдущей жалобе.[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]Не создавайте дубликаты жалоб, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 0, 0)]Отказано,[/COLOR] [COLOR=rgb(204, 204, 204)]Закрыто.[/SIZE][/FONT][/CENTER]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Нарушений нет',
      content:
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(204, 204, 204)]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(0, 203, 252)]{{ user.mention }}[/COLOR][COLOR=rgb(204, 204, 204)].[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]Исходя из ваших доказательств, нарушение со стороны администрации отсутствует.[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 0, 0)]Отказано,[/COLOR] [COLOR=rgb(204, 204, 204)]Закрыто.[/SIZE][/FONT][/CENTER]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Ответный ДМ',
      content:
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(204, 204, 204)]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(0, 203, 252)]{{ user.mention }}[/COLOR][COLOR=rgb(204, 204, 204)].[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]Проверив доказательства Администратора, [/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]было принято решение что наказание было выдано верно![/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]Если у вас есть док-вы что это был ответный ДМ[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]Создайте жалобу заново, прикрепив их.[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 0, 0)]Отказано,[/COLOR] [COLOR=rgb(204, 204, 204)]Закрыто.[/SIZE][/FONT][/CENTER]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'В обжалование',
      content:
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(204, 204, 204)]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(0, 203, 252)]{{ user.mention }}[/COLOR][COLOR=rgb(204, 204, 204)].[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]Если вы согласны с наказанием, пишите в раздел обжалований.[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 0, 0)]Отказано,[/COLOR] [COLOR=rgb(204, 204, 204)]Закрыто.[/SIZE][/FONT][/CENTER]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: '_____________________________________________ღ ЖБ на ЛД ღ_____________________________________________ ',
     },
    {
      title: 'На рассмотрении',
      content:
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(204, 204, 204)]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(0, 203, 252)]{{ user.mention }}[/COLOR][COLOR=rgb(204, 204, 204)].[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(209, 213, 216)][FONT=courier new][SIZE=4]Ваша жалоба взята на рассмотрение, ожидайте ответа в данной теме.[/SIZE][/FONT][/CENTER]<br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][FONT=courier new][COLOR=rgb(251, 160, 38)]На рассмотрении...[/COLOR][/FONT][/CENTER]",
      prefix: PIN_PREFIX,
      status: true,
     },
      {
      title: 'Нет нарушений',
      content:
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(204, 204, 204)]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(0, 203, 252)]{{ user.mention }}[/COLOR][COLOR=rgb(204, 204, 204)].[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(209, 213, 216)][FONT=courier new][SIZE=4]Внимательно ознакомившись с вашей жалобой, я выношу вердикт:[/SIZE][/FONT][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(209, 213, 216)][FONT=courier new][SIZE=4]Нарушений со стороны лидера нет![/SIZE][/FONT][/CENTER]<br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 0, 0)]Отказано,[/COLOR] [COLOR=rgb(204, 204, 204)]Закрыто.[/SIZE][/FONT][/CENTER]",
      prefix: CLOSE_PREFIX,
      status: true,
     },
     {
      title: 'Одобрено',
      content:
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(204, 204, 204)]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(0, 203, 252)]{{ user.mention }}[/COLOR][COLOR=rgb(204, 204, 204)].[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(209, 213, 216)][FONT=courier new][SIZE=4]Внимательно ознакомившись с вашей жалобой, я выношу вердикт:[/SIZE][/FONT][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(209, 213, 216)][FONT=courier new][SIZE=4]Ваша жалоба одобрена, лидер получит соответствующее наказание.[/SIZE][/FONT][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(209, 213, 216)][FONT=courier new][SIZE=4]Спасибо за информацию![/SIZE][/FONT][/CENTER]<br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=rgb(0, 255, 0)][FONT=courier new]Одобрено,[/COLOR] [COLOR=rgb(204, 204, 204)]Закрыто.[/COLOR][/FONT][/SIZE][/CENTER]",
      prefix: ACCEPT_PREFIX,
      status: false,
     },
     {
      title: 'Проведу беседу',
      content:
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(204, 204, 204)]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(0, 203, 252)]{{ user.mention }}[/COLOR][COLOR=rgb(204, 204, 204)].[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(209, 213, 216)][FONT=courier new][SIZE=4]Внимательно ознакомившись с вашей жалобой, я выношу вердикт:[/SIZE][/FONT][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(209, 213, 216)][FONT=courier new][SIZE=4]Ваша жалоба одобрена, с лидером будет проведена беседа.[/SIZE][/FONT][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(209, 213, 216)][FONT=courier new][SIZE=4]Спасибо за информацию![/SIZE][/FONT][/CENTER]<br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=rgb(0, 255, 0)][FONT=courier new]Одобрено,[/COLOR] [COLOR=rgb(204, 204, 204)]Закрыто.[/COLOR][/FONT][/SIZE][/CENTER]",
      prefix: ACCEPT_PREFIX,
      status: false,
     },
     {
      title: 'Проинформирую',
      content:
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(204, 204, 204)]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(0, 203, 252)]{{ user.mention }}[/COLOR][COLOR=rgb(204, 204, 204)].[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(209, 213, 216)][FONT=courier new][SIZE=4]Лидер будет проинформирован![/SIZE][/FONT][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(209, 213, 216)][FONT=courier new][SIZE=4]Благодарим за обращение.[/SIZE][/FONT][/CENTER]<br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][SIZE=4][COLOR=rgb(0, 255, 0)][FONT=courier new]Одобрено,[/COLOR] [COLOR=rgb(204, 204, 204)]Закрыто.[/COLOR][/FONT][/SIZE][/CENTER]",
      prefix: ACCEPT_PREFIX,
      status: false,
     },
     {
      title: 'Не ЛД',
      content:
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(204, 204, 204)]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(0, 203, 252)]{{ user.mention }}[/COLOR][COLOR=rgb(204, 204, 204)].[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(209, 213, 216)][FONT=courier new][SIZE=4]Данный игрок не является лидером.[/SIZE][/FONT][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(209, 213, 216)][FONT=courier new][SIZE=4]Обратитесь в раздел жалоб на сотрудников.[/SIZE][/FONT][/CENTER]<br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][FONT=courier new][COLOR=rgb(255, 0, 0)][SIZE=4]Закрыто![/SIZE][/COLOR][/FONT][/CENTER]",
      prefix: CLOSE_PREFIX,
      status: true,
     },
     {
      title: 'Больше не ЛД',
      content:
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(204, 204, 204)]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(0, 203, 252)]{{ user.mention }}[/COLOR][COLOR=rgb(204, 204, 204)].[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(209, 213, 216)][FONT=courier new][SIZE=4]Данный игрок больше не является лидером.[/SIZE][/FONT][/CENTER]<br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][FONT=courier new][COLOR=rgb(255, 0, 0)][SIZE=4]Закрыто![/SIZE][/COLOR][/FONT][/CENTER]",
        prefix: CLOSE_PREFIX,
      status: true,
     },
     {
      title: 'Не по форме',
      content:
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(204, 204, 204)]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(0, 203, 252)]{{ user.mention }}[/COLOR][COLOR=rgb(204, 204, 204)].[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(209, 213, 216)][FONT=courier new][SIZE=4]Ваша жалоба составлена не по форме.[/SIZE][/FONT][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(209, 213, 216)][FONT=courier new][SIZE=4]Ознакомиться с формой подачи жалоб, вы можете тут: [URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-лидеров.3429391/']*Нажмите*[/URL][/SIZE][/FONT][/CENTER]<br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 0, 0)]Отказано,[/COLOR] [COLOR=rgb(204, 204, 204)]Закрыто.[/SIZE][/FONT][/CENTER]",
      prefix: CLOSE_PREFIX,
      status: true,
     },
     {
      title: '_____________________________________________ღ передачи ღ_____________________________________________ ',
     },
    {
      title: 'Тех. спецу',
      content:
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(204, 204, 204)]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(0, 203, 252)]{{ user.mention }}[/COLOR][COLOR=rgb(204, 204, 204)].[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]Ваша жалоба была передана Техническому специалисту.[/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]Ожидайте итогов в этой теме, и не сохдавайте ее копий.[/URL][/COLOR][/FONT][/CENTER]<br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][FONT=courier new][COLOR=rgb(255, 0, 0)][SIZE=4]На рассмотрении...[/SIZE][/COLOR][/FONT][/CENTER]",
       prefix: TEX_PREFIX,
      status: true,
     },
     {
      title: 'Передача ГА',
      content:
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(204, 204, 204)]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(0, 203, 252)]{{ user.mention }}[/COLOR][COLOR=rgb(204, 204, 204)].[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]Ваша жалоба передана на рассмотрение.[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]Ожидайте ответ в данной теме, и не создавайте ее копий.[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][FONT=courier new][COLOR=rgb(251, 160, 38)]На рассмотрении...[/COLOR][/FONT][/CENTER]",
      prefix: GA_PREFIX,
      status: false,
    },
     {
      title: '_____________________________________________ღ отказы ღ_____________________________________________ ',
     },
    {
      title: 'Отсутствуют/недостаточно док-в',
      content:
       "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(204, 204, 204)]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(0, 203, 252)]{{ user.mention }}[/COLOR][COLOR=rgb(204, 204, 204)].[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
       "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
       "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]В вашей жалобе не достаточно доказательств, [/COLOR][/FONT][/SIZE][/CENTER]<br>" +
       "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]или они отсутствуют вовсе.[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
       "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
       "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 0, 0)]Отказано,[/COLOR] [COLOR=rgb(204, 204, 204)]Закрыто.[/SIZE][/FONT][/CENTER]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Не тот раздел',
      content:
       "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(204, 204, 204)]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(0, 203, 252)]{{ user.mention }}[/COLOR][COLOR=rgb(204, 204, 204)].[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
       "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
       "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]Вы попали не в тот раздел.[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
       "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]Отправьте жалобу в нужный, и ожидайте ответ там.[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
       "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
       "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 0, 0)]Отказано,[/COLOR] [COLOR=rgb(204, 204, 204)]Закрыто.[/SIZE][/FONT][/CENTER]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Нет time',
      content:
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(204, 204, 204)]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(0, 203, 252)]{{ user.mention }}[/COLOR][COLOR=rgb(204, 204, 204)].[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]В ваших доказательствах отсутствует /time[/COLOR][/FONT][/SIZE]<br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 0, 0)]Отказано,[/COLOR] [COLOR=rgb(204, 204, 204)]Закрыто.[/SIZE][/FONT][/CENTER]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Док-ва отредакт',
      content:
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(204, 204, 204)]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(0, 203, 252)]{{ user.mention }}[/COLOR][COLOR=rgb(204, 204, 204)].[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]Ваши доказательства были отредактированы.[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]Пожалуйста загрузите полную версию доказательств в новую тему в данном разделе.[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 0, 0)]Отказано,[/COLOR] [COLOR=rgb(204, 204, 204)]Закрыто.[/SIZE][/FONT][/CENTER]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title : 'прошло 3 дня' ,
      content:
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(204, 204, 204)]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(0, 203, 252)]{{ user.mention }}[/COLOR][COLOR=rgb(204, 204, 204)].[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]C момента получения наказания прошло больше 3-х дней.[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 0, 0)]Отказано,[/COLOR] [COLOR=rgb(204, 204, 204)]Закрыто.[/SIZE][/FONT][/CENTER]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title : 'уже был ответ' ,
     content:
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(204, 204, 204)]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(0, 203, 252)]{{ user.mention }}[/COLOR][COLOR=rgb(204, 204, 204)].[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]Ответ на данную жалобу был дан ранее.[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]Просьба не создавать дубликатов жалобы,[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]Иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 0, 0)]Отказано,[/COLOR] [COLOR=rgb(204, 204, 204)]Закрыто.[/SIZE][/FONT][/CENTER]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title : 'Не по теме' ,
      content:
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(204, 204, 204)]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(0, 203, 252)]{{ user.mention }}[/COLOR][COLOR=rgb(204, 204, 204)].[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][SIZE=4][FONT=courier new][COLOR=rgb(204, 204, 204)]Ваше обращение не соответствует теме жалоб.[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
        "[CENTER][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/CENTER]<br>" +
        "[CENTER][FONT=courier new][SIZE=4][COLOR=rgb(255, 0, 0)]Отказано,[/COLOR] [COLOR=rgb(204, 204, 204)]Закрыто.[/SIZE][/FONT][/CENTER]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
   ];


  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton('Закрыто', 'close');
    addButton('На рассмотрение', 'pin');
    addButton('Одобрено', 'accepted');
    addButton('Отказано', 'unaccept');
    addButton('Рассмотрено', 'wached');
    addButton('Ответы', 'selectAnswer');

    // Поиск информации о теме
    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#Texy').click(() => editThreadData(TEX_PREFIX, false));
    $('button#close').click(() => editThreadData(CLOSE_PREFIX, false));
    $('button#wached').click(() => editThreadData(WATCHED_PREFIX, false));

    $(`button#selectAnswer`).click(() => {
      XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
      buttons.forEach((btn, id) => {
        if (id > 0) {
          $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
        }
        else {
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

    if (send == true) {
      editThreadData(buttons[id].prefix, buttons[id].status);
      $('.button--icon.button--icon--reply.rippleButton').trigger('click');
    }
  }

  function getThreadData() {
    const authorName = $('a.username').html();
    const hours = new Date().getHours();
    return {
      user: {
        name: authorName,
        mention: `${authorName}`,
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
    } else  {
        fetch(`${document.URL}edit`, {
          method: 'POST',
          body: getFormData({
            prefix_id: prefix,
            title: threadTitle,
            pin: 1,
            _xfToken: XF.config.csrf,
            _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
            _xfWithData: 1,
            _xfResponseType: 'json',
          }),
        }).then(() => location.reload());
    }




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
    } else  {
        fetch(`${document.URL}edit`, {
          method: 'POST',
          body: getFormData({
            prefix_id: prefix,
            title: threadTitle,
            pin: 1,
            _xfToken: XF.config.csrf,
            _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
            _xfWithData: 1,
            _xfResponseType: 'json',
          }),
        }).then(() => location.reload());
           }


function moveThread(prefix, type) {
// Получаем заголовок темы, так как он необходим при запросе
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
    }
})();