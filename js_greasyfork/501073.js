// ==UserScript==
// @name         BLACK | Скрипт для руководства by Myrphyy
// @namespace    https://forum.blackrussia.online
// @version      7.7.8
// @description  Скрипт для упрощения работы Руководства BLACK.
// @author       Jony_Myrphyy
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://icons.iconarchive.com/icons/google/noto-emoji-food-drink/256/32382-hamburger-icon.png
// @grant        none
// @license 	 none
// @downloadURL https://update.greasyfork.org/scripts/501073/BLACK%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20by%20Myrphyy.user.js
// @updateURL https://update.greasyfork.org/scripts/501073/BLACK%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20by%20Myrphyy.meta.js
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
            title: '-----------------------------------------------------------------> Раздел Жалоб <------------------------------------------------------------------',
        },
        {
            title: 'Приветствие',
            content:
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.[/FONT][/CENTER]<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "[CENTER][FONT=georgia] текст [/FONT][/CENTER]",
        },
        {
            title: 'На рассмотрение',
            content:
            "[CENTER][FONT=tahoma]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
             "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Запросил доказательства у администратора.<br>"+
            "Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]На рассмотрении.[/COLOR][/FONT][/CENTER]',
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: 'Не по форме',
            content:
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Ваша жалоба составлена не по форме, ознакомьтесь с правилами подачи жалоб : [URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-администрацию.3429349/']*Кликабельно*[/URL]<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Не является адм',
            content:
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Данный игрок не является администратором.<br>"+
            "[url=https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png][img]https://i.postimg.cc/9M1c86Sz/56-B2-BBA3-346-E-44-FA-AE09-CBBB182617-AB.png[/img][/url]<br>"+
            '[COLOR=RED]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Нет /time',
            content:
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
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
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
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
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
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
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}..<br><br>"+
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
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
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
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
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
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
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
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
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
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "В вашей жалобе отсутствуют доказательства для рассмотра. <br>"+
            "Прикрепите доказательсва в хорошем качестве на разрешенных платформах.(Yapx/Imgur/YouTube/ImgBB)<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {

            title: `Недостаточно док-вы`,
            content:
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
             "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            `[CENTER] Недостаточно доказательств, которые потверждают нарушение администратора.<br>`+
             "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            ` [CENTER][color=red] Отказано[/color],закрыто.[/CENTER][/FONT]<br><br>`,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Не рабочие док-ва',
            content:
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
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
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
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
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Ответ вам уже был дан в предыдущей теме. Напоминаю, за дублирование тем ваш форумный аккаунт может быть заблокирован.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Админ Снят/ПСЖ',
            content:
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
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
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
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
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Администратор предоставил доказательства.<br>"+
            "Наказание выдано верно.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=RED]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Таймкоды',
            content:
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Укажите таймкоды на видеозаписи.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=RED]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Правила раздела',
            content:
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Пожалуйста, убедительная просьба, ознакомится с назначением данного раздела в котором Вы создали тему, так как ваш запрос никоим образом не относится к предназначению данного раздела. <br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=RED]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'В жалобы на игроков',
            content:
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Ошиблись разделом, обратитесь в жалобы на игроков. <br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=RED]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
         },
        {
            title: 'Ban ip',
            content:
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Попробуйте сменить wi-fi соединение или же сменить ip адрес. Подключите VPN для точной обработки ip адресов, окно бана будет убрано. <br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=RED]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,

        },
        {
            title: '--------------------------------------------------------------->Одобрение жалобы<---------------------------------------------------------------'
        },
        {
            title: 'Проинструкировать',
            content:
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Благодарим за ваше обращение! Администратор будет проинструктирован.<br>"+
            "Приносим извинения за предоставленные неудобства.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=#00FA9A]Одобрено[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Беседа с адм',
            content:
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Ваша жалоба была рассмотрена и одобрена, с администратором будет проведена строгая профилактическая беседа.<br>"+
            "Приносим извинения за предоставленные неудобства.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=#00FA9A]Одобрено[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Выговор',
            content:
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
             `[CENTER] Администратор получит выговор.<br>`+
            `[CENTER] Благодарим за ваше обращение<br>`+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=#00FA9A]Одобрено[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Наказание по ошибке',
            content:
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
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
            title: '----------------------------------------------------------------->Передать жалобу<-----------------------------------------------------------------'
        },
        {
            title: 'Передано ГА',
            content:
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Жалоба передана Главному Администратору - @Alina_Svidskaya .<br>"+
            "Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Передано Главному Администратору[/COLOR][/FONT][/CENTER]',
            prefix: GA_PREFIX,
            status: true,
        },
        {
            title: 'Передано ЗГА',
            content:
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Ваша жалоба передана Заместителям Главного Администратора —  @DJony Myrphyy ♡  и @Harry Hoi ♡ <br><br>"+
            "Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Передано Заместителям Главного Администратора[/COLOR][/FONT][/CENTER]',
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: 'Спецам',
            content:
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Ваша жалоба передана Специальной Администрации.<br>"+
            "Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Передано Специальной Администрации.[/COLOR][/FONT][/CENTER]',
            prefix: SPECIAL_PREFIX,
            status: true,
        },
        {
            title: 'В ЖБ на теха',
            content:
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Вам было выдано наказания Техническим специалистом, вы можете написать жалобу здесь : [URL='https://forum.blackrussia.online/forums/Сервер-№10-black.1191/']*Нажмите сюда*[/URL]<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'В обжалование',
            content:
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Если вы согласны с выданным наказанием, то напишите в раздел Обжалование.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Ошибка сервером',
            content:
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.[/FONT][/CENTER]<br><br>"+
            "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url][/CENTER]<br>"+
            "[CENTER][FONT=georgia] Ошиблись сервером, переношу на нужный. [/FONT][/CENTER]",
         },
        {
            title: '---------------------------------------------------------------> Раздел для проверки форума  <------------------------------------------',
        },
        {
            title: `Неактивы одобрены`,
            content: `[center][size=5][font=georgia][color=yellow]Все выше:[/color][color=rgb(0, 255, 0)]Одобрено[/color]<br><br>`+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            `[color=red]Примечание:[/color] Удачного отдыха от игры на сервере [color=black]BLACK[/color]<br>` +
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятного отдыха, коллеги! [/COLOR][/FONT][/SIZE][/CENTER]`,
         },
        {
            title: `Доп. баллы проверены`,
            content: `[center][font=georgia][size=5][color=rgb(124, 252, 0)]Дополнительные баллы успешно проверены.[/size]<br><br>`+
           "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
           "[size=4][color=red]Примичание:[/color] Баллы успешно выданы в  «[URL= `https://docs.google.com/spreadsheets/d/1hi2rJvV1Xy9Lfdne0NWKTHaL_cp6MblKulHfNk0sPUY/edit#gid=1664586781`][color=red]Таблицу администрации[/color][/URL]»<br><br>",
          },
        {
            title: `Одобрение покупки/продажи`,
            content: `[center][size=4][font=georgia][color=yellow]Все выше:[/color][color=rgb(0, 255, 0)] Одобрено[/color]<br><br>`+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            `[color=red]Примечание:[/color] Продавать/Покупать аксессуары, Т/С и т.п разрашается после 23:00 по МСК!.<br><br>`,
        },
        {
           title: `Выговоры одобрены`,
           content: `[center][size=5][font=georgia][color=yellow]Все выше:[/color][color=rgb(0, 255, 0)]Одобрено[/color]<br><br>`+
           "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
           `[color=red]Примечание:[/color] На отказанное ответил! [color=black]BLACK[/color]<br>`,
        },
        {
            title: '---------------------------------------------------------------> Раздел Обжалование <---------------------------------------------------------------',
        },
        {
            title: 'Не по форме',
            content:
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Ваше обжалование составлено не по форме, пожалуйста ознакомьтесь с правилами подачи обжалований : [URL='https://forum.blackrussia.online/threads/Правила-подачи-заявки-на-обжалование-наказания.1158744/']*Нажмите сюда*[/URL]<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[CENTER][FONT=georgia][COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Обжалованию не подлежит',
            content:
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
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
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
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
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
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
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
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
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
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
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Обжалование передано Главному Администратору .<br>"+
            "Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=orange]На рассмотрение[/COLOR][/FONT][/CENTER]',
            prefix: GA_PREFIX,
            status: true,
        },
        {
            title: 'Соц. сети ОБЖ',
            content:
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
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
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
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
        addButton('Меню', 'selectAnswer');
        addButton('На рассмотрение', 'pin');
        addButton('Одобрить', 'accepted');
        addButton('Отказать', 'unaccept');
        addButton('Рассмотрено', 'watched');
        addButton('Закрыть', 'closed');
        addButton('КП', 'teamProject');
        addButton ('Спецу', 'specialAdmin');
        addButton ('ГА', 'mainAdmin');


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