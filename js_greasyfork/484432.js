// ==UserScript==
// @name         UFA | Скрипт для Руководства by Worobei (Remastered)
// @namespace    https://greasyfork.org/ru/users/1032828-crystalby
// @version      1.112
// @description  Скрипт для упрощения работы ГА/ЗГА/Кураторов администрации.
// @author       Debi_Worobei
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @grant        none
// @license 	 none
// @downloadURL https://update.greasyfork.org/scripts/484432/UFA%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20by%20Worobei%20%28Remastered%29.user.js
// @updateURL https://update.greasyfork.org/scripts/484432/UFA%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20by%20Worobei%20%28Remastered%29.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const UNACCEPT_PREFIX = 4; // Префикс "Отказано"
    const ACCEPT_PREFIX = 8; // Префикс "Одобрено"
    const RESHENO_PREFIX = 6; // Префикс "Решено"
    const PIN_PREFIX = 2; // Префикс "На рассмотрении"
    const GA_PREFIX = 12; // Префикс "Главному Администратору"
    const COMMAND_PREFIX = 10; // Префикс "Команде Проекта"
    const WATCHED_PREFIX = 9; // Префикс "Рассмотрено"
    const CLOSE_PREFIX = 7; // Префикс "Закрыто"
    const SPECIAL_PREFIX = 11; // Префикс "Специальному Администратору"
    const buttons = [
        {
            title: '---------------------------------------------------------------> Раздел Жалоб by Worobei <---------------------------------------------------------------',
        },
        {
            title: 'Приветствие',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Текст [SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=yellow][ICODE]Текст[/ICODE][/COLOR][/CENTER][/B]',
        },
        {
            title: 'Запросил доки',
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]У администратора были запрошены доказательства о выданном наказании. Ожидайте ответа[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении[/ICODE][/COLOR][/CENTER][/B]',
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: 'На рассмотр',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваша жалоба взята на рассмотрение, пожалуйста не создавайте дубликатов. Ожидайте ответа.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении[/ICODE][/COLOR][/CENTER][/B]',
            prefix: PIN_PREFIX,
            status: true,
        },
         {
            title: '---------------------------------------------------------------> ЖБ одобрена by Worobei <---------------------------------------------------------------',
        },
        {
            title: 'Беседа с адм и снять наказание',
            content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваша жалоба была одобрена и будет проведена работа с администратором по данной жалобе. Ваше наказание будет снято в ближайшее время, если оно еще не снято.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=green][ICODE]Одобрено, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCEPT_PREFIX,
	  status: true,
        },
        {
            title: 'Беседа с адм и наказание снимать не надо',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваша жалоба была одобрена и будет проведена беседа с администратором.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=green][ICODE]Одобрено, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Снят',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваша жалоба была одобрена и администратор будет снят с поста.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=green][ICODE]Одобрено, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: ACCEPT_PREFIX,
            status: false,
        },
         {
            title: '---------------------------------------------------------------> ЖБ отказана by Worobei <---------------------------------------------------------------',
        },
        {
            title: 'Не по форме',
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваша жалоба составлена не по форме. С формой создания темы можно ознакомиться тут:[SIZE=4]<br>"+
        "[B][CENTER][FONT=times new roman][COLOR=lavender] 1. Ваш Nick_Name [SIZE=4]<br>"+
        "[B][CENTER][FONT=times new roman][COLOR=lavender] 2.Nick_Name администратора<br>"+
        "[B][CENTER][FONT=times new roman][COLOR=lavender] 3.Дата выдачи/получения наказания:<br>"+
        "[B][CENTER][FONT=times new roman][COLOR=lavender] 4.Суть жалобы:[SIZE=4]<br>"+
        "[B][CENTER][FONT=times new roman][COLOR=lavender] 5.Доказательство: <br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Не является адм',
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Данный игрок не является администратором.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Нет /time',
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]В вашей жалобе отсутствует /time.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'От 3 лица',
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]3.3. Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации).[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Нужен фрапс',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]В данной ситуации обязательно должен быть фрапс(видеофиксация) всех моментов, в противном случае жалоба будет отказана.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Нужен /notif',
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Зайдите в игру и сделайте фотографию выданного варна с помощью команды /notif c командой /time.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Неполный фрапс',
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Фрапс обрезан, вынести вердикт с данной нарезки невозможно.Если у вас есть полный фрапс,то создайте новую тему,прикрепив его.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Док-ва отредактированы',
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]3.7. Доказательства должны быть в первоначальном виде. Ваши же докозательства отредактированы, жалоба не подлежит рассмотрению.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Плохое качество докв',
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Доказательства были предоставлены в плохом качестве, пожалуйста прикрепите более качественные фото/видео.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Прошло более 48 часов',
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]3.1. Срок написания жалобы составляет два дня (48 часов) с момента совершенного нарушения со стороны администратора сервера. Прошло больше 48 часов, жалоба не подлежит рассмотрению.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Нет доков',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]В вашей жалобе отсутсвуют доказательства о нарушении администратора[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Не рабочие док-ва',
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Предоставленные вами доказательства нерабочие, создайте новую тему, прикрепив рабочую ссылку на док-ва.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Окно бана',
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Зайдите в игру и сделайте скрин окна с баном после чего, заново напишите жалобу.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Дублирование ( ответ не был дан)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Дублирование темы, ожидайте ответа в подобной жалобе. [SIZE=4]<br>"+
        "[B][CENTER][COLOR=lavender] В случае продолжения дублирования тем, ваш форумный аккаунт будет заблокирован на 3 и более дней. <br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Дублирование ( ответ был дан)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Дублирование темы,  ответ был дан в подобной жалобе. <br>"+
        "[B][CENTER][COLOR=lavender] В случае продолжения дублирования тем, ваш форумный аккаунт будет заблокирован на 3 и более дней.[SIZE=4] <br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Нет нарушений',
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Исходя из приложенных выше доказательств - нарушения со стороны администратора отсутствуют.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Наказание верное',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Администратор, выдавший наказание предоставил опровержение на ваше нарушение. Наказание выданное вам, было выдано верно.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Админ Снят/ПСЖ',
            content:
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Администратор, выдавший наказание был снят/ушел с поста администратора. Наказание выданное вам будет снято.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: WATCHED_PREFIX,
            status: false,
        },

        {
            title: 'Соц. сети',
            content:
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender] Доказательства из соц сетей не принимаются, вам нужно загрузить доказательств на видео/фото хостинге.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'В обжалование',
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Вам в раздел для обжалования наказаний.[SIZE=4] <br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: '---------------------------------------------------------------> Раздел Обжалований by Worobei <---------------------------------------------------------------',
        },
         {
            title: 'Не по форме',
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваше обжалование составлено не по форме, пожалуйста ознакомьтесь с правилами подачи обжалований : [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.2639626/']*Нажмите сюда*[/URL][SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Обжалованию не подлежит',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Данное нарушение не подлежит обжалованию. В обжаловании отказано [SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Не готовы снизить',
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Администрация сервера не готова снизить вам наказание. [SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'ОБЖ на рассмотрении',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваше обжалование взято на рассмотрение. Не нужно создавать копии этой темы. [SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: 'Обжалование одобрено',
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваше наказание будет смягчено, впредь не совершайте подобных ошибок. <br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Соц. сети ОБЖ',
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Доказательства из соц сетей не принимаются, вам нужно загрузить доказательств на видео/фото хостинге. [SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'В жб на админов',
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Если вы не согласны с выданным наказанием, то вам в раздел Жалобы на администрацию. [SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
         {
            title: 'Возвращает имущку',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Аккаунт будет разблокирован на 24 часа, в течении этого времени, вы должны вернуть имущество игроку по договоренности , и прикрепить видеофиксацию сделки в данную тему.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: PIN_PREFIX,
            status: true,
        },
         {
      title: 'Смена Ника',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваш аккаунт будет разблокирован на 24 часа для смены NickName.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении.[/ICODE][/COLOR][/CENTER][/B]',
              prefix: PIN_PREFIX,
            status: true,
         },
        {
      title: 'Обжаловать нрп обман',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=verdana][SIZE=4][COLOR=lavender]Если вы хотите хотите обжаловать наказание за НонРП обман вы должны сами связаться с человеком, которого обманули.<br>"+
        "[B][CENTER][FONT=verdana][SIZE=4][COLOR=lavender]После чего он должен написать на вас обжалование прикрепив доказательства договора о возврате имущества, ссылку на жалобу которую писал на вас, скриншот окна блокировки обманувшего, ссылки на ВК обеих сторон.<br>"+
        "[B][CENTER][FONT=verdana][SIZE=4][COLOR=lavender]По другому вы никак не сможете обжаловать наказание за НонРП обман.<br>"+
        "[B][CENTER][FONT=verdana][SIZE=4][COLOR=lavender]Возврат производиться без моральной компенсации.<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: CLOSE_PREFIX,
            status: false,
         },
         {
      title: 'Согласен возместить ущерб',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Если вы согласны возместить ущерб, свяжитесь с обманутой стороной любым способом чтобы вернуть украденное, после прикрепите доказательства в данную тему.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении.[/ICODE][/COLOR][/CENTER][/B]',
              prefix: PIN_PREFIX,
            status: true,
         },
         {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Передачи жалобы или обжалования by Worobei ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
      {
            title: 'В ЖБ на теха',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender] Вам было выдано наказание Техническим специалистом, вы можете написать жалобу здесь : [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/']*Нажмите сюда*[/URL][SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
      title: 'Передано Специальному администратору ЖБ',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=red][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>'+
		'[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваша жалоба была передана Специальному администратору сервера. Ожидайте ответа.[SIZE=4]<br>'+
		'[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>',
            prefix: SPECIAL_PREFIX,
            status: true,
        },
        {
      title: 'Передано Специальному администратору ОБЖ',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=red][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>'+
		'[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваше обжалование было передано Специальному администратору сервера. Ожидайте ответа.[SIZE=4]<br>'+
		'[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>',
            prefix: SPECIAL_PREFIX,
            status: true,
        },
        {
      title: 'Передано ГА ЖБ',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=red][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>'+
		'[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваша жалоба была передана Главному администратору сервера. Ожидайте ответа.[SIZE=4]<br>'+
		'[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>',
            prefix: GA_PREFIX,
            status: true,
        },
         {
      title: 'Передано ГА ОБЖ',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=red][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>'+
		'[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваше обжалование было передана Главному администратору сервера. Ожидайте ответа.[SIZE=4]<br>'+
		'[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>',
            prefix: GA_PREFIX,
            status: true,
        },
        {
      title: 'Вам в жалобы на игроков',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Вам в жалобы на игроков.[SIZE=4] <br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
          prefix: UNACCEPT_PREFIX,
          status: false,
        }
    ];

    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

        // Добавление кнопок при загрузке страницы
        addButton('Меню', 'selectAnswer');
        addButton('Одобрить', 'accepted');
        addButton('Отказать', 'unaccept');
        addButton('На рассмотрение', 'pin');
        addButton('Рассмотрено', 'watched');
        addButton('Закрыть', 'closed');
        addButton('КП', 'teamProject');
        addButton ('Спецу', 'specialAdmin');
        addButton ('ГА', 'mainAdmin');


        // Поиск информации о теме
        const threadData = getThreadData();

        $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
        $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
        $(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true));
        $(`button#watched`).click(() => editThreadData(WATCHED_PREFIX, false));
        $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
        $(`button#mainAdmin`).click(() => editThreadData(GA_PREFIX, true));

        $(`button#specialAdmin`).click(() => editThreadData(SPECIAL_PREFIX, true));

        $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));

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
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 30px; margin-right: 7px;">${name}</button>`,
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