// ==UserScript==
// @name         Bless RED | Скрипт для Руководства
// @namespace    https://forum.blessrussia.online
// @version      1.0
// @description  Скрипт для упрощения работы ГА/ЗГА/Кураторов администрации.
// @author       Tommy_Hellatrigger Связь > https://vk.com/Andreya_NeTegai
// @match        https://forum.blessrussia.online/index.php*
// @include      https://forum.blessrussia.online/index.php
// @icon         https://forum.blessrussia.online/data/avatars/o/12/12286.jpg?1754996324
// @grant        none
// @license 	 none
// @downloadURL https://update.greasyfork.org/scripts/545948/Bless%20RED%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/545948/Bless%20RED%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0.meta.js
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
            title: '---------------------------------------------------------------> Раздел Жалоб <---------------------------------------------------------------',
        },
        {
            title: 'Приветствие',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.[/FONT][/CENTER]<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "[CENTER][FONT=Verdana] текст [/FONT][/CENTER]",
        },
        {
            title: 'На рассмотрение',
            content:
            "[CENTER][FONT=Verdana][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Запросил доказательства у администратора.<br>"+
            "Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=orange]На рассмотрении.[/COLOR][/FONT][/CENTER]',
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: 'Не по форме',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Ваша жалоба составлена не по форме, ознакомьтесь с правилами подачи жалоб : [URL='https://forum.blessrussia.online/index.php?threads/11/']*Кликабельно*[/URL]<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Не является адм',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Данный игрок не является администратором.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=RED]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Нет /time',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "В предоставленных доказательствах отсутствует /time, жалоба не подлежит рассмотрению.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Соц. сети',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Доказательства из соц сетей не принимаются, вам нужно загрузить доказательств на видео/фото хостинге.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'От 3 лица',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Жалоба составлена от 3-го лица, жалобы подобного формата рассмотрению не подлежат.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Нужен фрапс',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}..<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "В данной ситуации обязательно должен быть фрапс(видеофиксация) всех моментов, в противном случае жалоба будет отказана.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Неполный фрапс',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Фрапс обрезан, вынести вердикт с данной нарезки невозможно.<br>"+
            "Если у вас есть полный фрапс,то создайте новую тему,прикрепив его.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Док-ва отредактированы',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Представленные доказательства выше были отредактирован, подобные жалобы рассмотрению не подлежат.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Плохое качество докв',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Доказательства были предоставлены в плохом качестве, пожалуйста прикрепите более качественные фото/видео.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Прошло более 48 часов',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "С момента выдачи наказания прошло более 48-ми часов, жалоба не подлежит рассмотрению.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Нет доков',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "В вашей жалобе отсутствуют доказательства для рассмотра. <br>"+
            "Прикрепите доказательсва в хорошем качестве на разрешенных платформах.(Yapx/Imgur/YouTube/ImgBB)<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Не рабочие док-ва',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Предоставленные вами доказательства нерабочие, создайте новую тему, прикрепив рабочую ссылку на док-ва.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Окно бана',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Зайдите в игру и сделайте скрин окна с баном после чего, заново напишите жалобу.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто., Закрыто[/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Дублирование',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Ответ вам уже был дан в предыдущей теме. Напоминаю, за дублирование тем ваш форумный аккаунт может быть заблокирован.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Отказано[/COLOR], Закрыто., Закрыто[/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Админ Снят/ПСЖ',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Администратор был снят/ушел с поста администратора.<br>"+
            "Спасибо за обращение.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=#00FA9A]Рассмотрено[/COLOR][/FONT][/CENTER]',
            prefix: WATCHED_PREFIX,
            status: false,
        },
        {
            title: 'Нет нарушений',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Исходя из приложенных выше доказательств - нарушения со стороны администратора отсутствуют.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Наказание верное',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Администратор предоставил доказательства.<br>"+
            "Наказание выдано верно.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=RED]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: '--------------------------------------------------------------->Одобрение жалобы<---------------------------------------------------------------'
        },
        {
            title: 'Проконструкировать',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Благодарим за ваше обращение! Администратор будет проинструктирован.<br>"+
            "Ваше наказание будет снято в ближайшее время, если оно еще не снято.<br>"+
            "Приносим извинения за предоставленные неудобства.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=#00FA9A]Одобрено[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Беседа с адм',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Ваша жалоба была рассмотрена и одобрена, с администратором будет проведена профилактическая беседа.<br>"+
            "Ваше наказание будет снято в ближайшее время, если оно еще не снято.<br>"+
            "Приносим извинения за предоставленные неудобства.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=#00FA9A]Одобрено[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Адм будет наказан',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Ваша жалоба была рассмотрена и одобрена, Администратор будет наказан.<br>"+
            "Ваше наказание будет снято в ближайшее время, если оно еще не снято.<br>"+
            "Приносим извинения за предоставленные неудобства.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=#00FA9A]Одобрено[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Наказание по ошибке',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "В следствие беседы с администратором, было выяснено, наказание было выдано по ошибке.<br>"+
            "Ваше наказание будет снято в ближайшее время, если оно еще не снято.<br>"+
            "Приносим извинения за предоставленные неудобства.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=#00FA9A]Одобрено[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: '--------------------------------------------------------------->Передать жалобу<---------------------------------------------------------------'
        },
        {
            title: 'Передано ГА',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Жалоба передана Главному Администратору - @Lelush Elegant 𓆩♡𓆪 .<br>"+
            "Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Передано Главному Администратору[/COLOR][/FONT][/CENTER]',
            prefix: GA_PREFIX,
            status: true,
        },
        {
            title: 'Передано Осн.ЗГА',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            " Жалоба передана Основному Заместителю Главного Администратора - @Cosmos_Ssewen 𓆩♡𓆪 .<br>"+
            "Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Передано ОЗГА[/COLOR][/FONT][/CENTER]',
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: 'Передано ЗГА ГОСС & ОПГ',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            " Жалоба передана Заместителю Главного Администратора по направлению ОПГ и ГОСС - @ɢᴇɴᴇʀᴀʟ ʟᴀᴠʀᴏᴡ † .<br>"+
            "Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Передано ЗГА ГОСС&ОПГ[/COLOR][/FONT][/CENTER]',
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: 'Спецу',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Ваша жалоба передана Специальному Администратору.<br>"+
            "Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Передано Специальному Администратору.[/COLOR][/FONT][/CENTER]',
            prefix: SPECIAL_PREFIX,
            status: true,
        },
        {
            title: 'В обжалование',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Если вы согласны с выданным наказанием, то напишите в раздел Обжалование.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: '---------------------------------------------------------------> Раздел Обжалование <---------------------------------------------------------------',
        },
        {
            title: 'Не по форме',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Ваше обжалование составлено не по форме, пожалуйста ознакомьтесь с правилами подачи обжалований : [URL='https://forum.blessrussia.online/index.php?threads/13/']*Нажмите сюда*[/URL]<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[CENTER][FONT=Verdana][COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Обжалованию не подлежит',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Данное нарушение не подлежит обжалованию, в обжаловании отказано.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Не готовы снизить',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Администрация сервера не готова снизить вам наказание.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'ОБЖ на рассмотрении',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Ваше обжалование взято на рассмотрение.<br>"+
            "Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=orange]На рассмотрение[/COLOR][/FONT][/CENTER]',
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: 'Уже есть мин. наказание',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Вам было выдано минимальное наказание, обжалованию не подлежит.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Обжалование одобрено',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Обжалование одобрено, ваше наказание будет снято/снижено в течение 24-ех часов.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=#00FA9A]Одобрено[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Передано ГА обж',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Обжалование передано Главному Администратору.<br>"+
            "Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=orange]На рассмотрение[/COLOR][/FONT][/CENTER]',
            prefix: GA_PREFIX,
            status: true,
        },
        {
            title: 'Соц. сети ОБЖ',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            " Доказательства из соц сетей не принимаются, вам нужно загрузить доказательств на видео/фото хостинге.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'В жб на админов',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Если вы не согласны с выданным наказанием, то напишите жалобу в раздел Жалобы на Администрацию.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        }
    ];
 
    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
        // Добавление кнопок при загрузке страницы
        addButton('Ответы🗞', 'selectAnswer');
        addButton('На рассмотрение⚠️', 'pin');
        addButton('Одобрить✅️', 'accepted');
        addButton('Отказать❌️', 'unaccept');
        addButton('Рассмотрено✳️', 'watched');
        addButton('Закрыть🚫', 'closed');
        addButton('КП🔱', 'teamProject');
        addButton ('Спецу☠️', 'specialAdmin');
        addButton ('ГА♻️', 'mainAdmin');
 
 
        // Поиск информации о теме
        const threadData = getThreadData();
 
        $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
        $(`button#closed`).click(() => editThreadData(CLOSE_PREFIX, false));
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