// ==UserScript==
// @name         Наворкал
// @namespace    https://forum.blackrussia.online
// @version      1.31
// @description  Специально для BlackRussia || PINK by S.Screamz
// @author       Sincerity_Screamz
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @collaborator QuenkM
// @icon https://icons.iconarchive.com/icons/google/noto-emoji-people-bodyparts/256/11960-victory-hand-light-skin-tone-icon.png
// @downloadURL https://update.greasyfork.org/scripts/492012/%D0%9D%D0%B0%D0%B2%D0%BE%D1%80%D0%BA%D0%B0%D0%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/492012/%D0%9D%D0%B0%D0%B2%D0%BE%D1%80%D0%BA%D0%B0%D0%BB.meta.js
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
            title: 'Не тот сервер ',
            content:
            "[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый {{ user.mention }}.[/FONT][/CENTER]<br><br>"+
            "[CENTER] [I] [SIZE=4][FONT=times new roman]Вы ошиблись сервером, переношу вашу жалобу на нужный сервер для дальнейшего рассмотрения. <br><br>"+
            "[CENTER][FONT=times new roman][I] [SIZE=4] [COLOR=YELLOW]Передано. [/FONT][/CENTER]",
        },
        {
            title: 'На рассмотрение с док-во',
            content:
            "[CENTER] [COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый {{ user.mention }}.<br><br>"+
            "Запрошу доказательства у [COLOR=RED]Администратора.<br>"+
            "[COLOR=WHITE]Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br><br>"+

            '[COLOR=orange][FONT=times new roman]На рассмотрении...[/COLOR][/CENTER]',
            prefix: PIN_PREFIX,
            status: true,
        },
        {
        },
        {
            title: 'На рассмотрение без док-во',
            content:
            "[CENTER] [COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый  {{ user.mention }}.<br><br>"+

            "[COLOR=WHITE]Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br><br>"+

            '[COLOR=orange][FONT=times new roman]На рассмотрении...[/COLOR][/CENTER]',
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: 'Не по форме',
            content:
            "[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый  {{ user.mention }}.<br><br>"+
            "Ваша жалоба составлена не по форме, ознакомьтесь с правилами подачи жалоб : [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.193334/']*Кликабельно*[/URL]<br><br>"+

            '[COLOR=RED][I] [SIZE=4][FONT=times new roman]Отказано[/COLOR], [COLOR=RED][I] [SIZE=5][FONT=times new roman] Закрыто.[/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Не является адм',
            content:
            "[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый  {{ user.mention }}.<br><br>"+

            "Данный игрок не является [COLOR=RED]Администратором.<br><br>"+

            '[COLOR=RED][I] [SIZE=4][FONT=times new roman]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Игрок подал жб',
            content:
            "[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый  {{ user.mention }}.<br><br>"+

            "Игрок подал на Вас жалобу, по которой Вы и были заблокированы, наказание выдано верно.<br><br>"+

            '[COLOR=RED][I] [SIZE=4][FONT=times new roman]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Нет /time',
            content:
            "[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый  {{ user.mention }}.<br><br>"+

            "В предоставленных доказательствах отсутствует /time, жалоба не подлежит рассмотрению.<br><br>"+

            '[COLOR=RED][I] [SIZE=4][FONT=times new roman]Отказано[/COLOR], [COLOR=RED]Закрыто.[/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'От 3 лица',
            content:
            "[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый  {{ user.mention }}.<br><br>"+

            "Жалоба составлена от 3-го лица, жалобы подобного формата рассмотрению не подлежат.<br><br>"+

            '[COLOR=RED][I] [SIZE=4][FONT=times new roman]Отказано[/COLOR], [COLOR=RED]Закрыто.[/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Нужен фрапс',
            content:
            "[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый  {{ user.mention }}..<br><br>"+

            "В данной ситуации обязательно должен быть фрапс(видеофиксация) всех моментов, в противном случае жалоба будет [COLOR=RED]Отказана.<br><br>"+

            '[COLOR=RED][I] [SIZE=4][FONT=times new roman]Отказано[/COLOR] [COLOR=WHITE]/[COLOR=WHITE]/ [COLOR=RED]Закрыто.[/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Неполный фрапс',
            content:
            "[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый  {{ user.mention }}.<br><br>"+

            "Фрапс обрезан, вынести вердикт с данной нарезки невозможно.<br>"+
            "Если у вас есть полный фрапс,то создайте новую тему,прикрепив его.<br><br>"+

            '[COLOR=red][I] [SIZE=4][FONT=times new roman]Отказано[/COLOR] [COLOR=WHITE]/[COLOR=WHITE]/ [COLOR=RED]Закрыто.[/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Док-ва отредактированы',
            content:
            "[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый  {{ user.mention }}.<br><br>"+

            "Представленные доказательства выше были отредактирован, подобные жалобы рассмотрению не подлежат.<br><br>"+

            '[COLOR=red][I] [SIZE=4][FONT=times new roman]Отказано[/COLOR] [COLOR=WHITE]/[COLOR=WHITE]/ [COLOR=RED]Закрыто.[/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Плохое качество док-в',
            content:
            "[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый  {{ user.mention }}.<br><br>"+

            "Доказательства были предоставлены в плохом качестве, пожалуйста прикрепите более качественные фото/видео.<br><br>"+

            '[COLOR=RED][I] [SIZE=4][FONT=times new roman]Отказано[/COLOR] [COLOR=WHITE]/[COLOR=WHITE]/ [COLOR=RED]Закрыто.[/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Прошло более 48 часов',
            content:
              "[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый  {{ user.mention }}.<br><br>"+
        "[CENTER][I] [SIZE=4][FONT=times new roman]С момента выдачи наказания прошло более 48-ми часов.<br>"+
        "Обратитесь в раздел Обжалование наказаний. [/FONT]<br><br>"+
       '[COLOR=RED][I] [SIZE=4][FONT=times new roman]Отказано[/COLOR] [COLOR=WHITE]/[COLOR=WHITE]/ [COLOR=RED]Закрыто.[/FONT][/CENTER]',
        prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Нет доков',
            content:
            "[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый {{ user.mention }}.<br><br>"+

            "В вашей жалобе отсутствуют доказательства для рассмотра. <br>"+
            "Прикрепите доказательсва в хорошем качестве на разрешенных платформах.(Yapx/Imgur/YouTube/ImgBB)<br><br>"+

            '[COLOR=RED][I] [SIZE=4][FONT=times new roman]Отказано[/COLOR] [COLOR=WHITE]/[COLOR=WHITE]/ [COLOR=RED]Закрыто.[/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Не рабочие док-ва',
            content:
            "[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый  {{ user.mention }}.<br><br>"+

            "Предоставленные вами доказательства нерабочие, создайте новую тему, прикрепив рабочую ссылку на док-ва.<br><br>"+

            '[COLOR=RED][I] [SIZE=4][FONT=times new roman]Отказано[/COLOR] [COLOR=WHITE]/[COLOR=WHITE]/ [COLOR=RED]Закрыто.[/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Окно бана',
            content:
            "[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый  {{ user.mention }}.<br><br>"+

            "Зайдите в игру и сделайте скрин окна с баном после чего, заново напишите жалобу.<br><br>"+

            '[COLOR=RED][I] [SIZE=4][FONT=times new roman]Отказано[/COLOR] [COLOR=WHITE]/[COLOR=WHITE]/ [COLOR=RED]Закрыто.[/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Дублирование',
            content:
            "[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый  {{ user.mention }}.<br><br>"+

            "Ответ вам уже был дан в предыдущей теме. Напоминаю, за дублирование тем ваш форумный аккаунт может быть заблокирован.<br><br>"+

            '[COLOR=red][I] [SIZE=4][FONT=times new roman]Отказано[/COLOR] [COLOR=WHITE]/[COLOR=WHITE]/ [COLOR=RED]Закрыто.[/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Беседа с адм',
            content:
            "[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый  {{ user.mention }}.<br><br>"+

            "Ваша жалоба была рассмотрена и одобрена, с [COLOR=RED]Администратором[COLOR=WHITE] будет проведена профилактическая беседа.<br>"+
            "Ваше наказание будет снято в ближайшее время, если оно еще не снято.<br>"+
            "Приносим извинения за предоставленные неудобства.<br><br>"+

           '[COLOR=#40ff00]Одобрено.[/FONT][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Нет нарушений',
            content:
            "[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый  {{ user.mention }}.<br><br>"+

            "Исходя из приложенных выше доказательств - нарушения со стороны Администратора отсутствуют.<br><br>"+

            '[COLOR=red][I] [SIZE=4][FONT=times new roman]Отказано[/COLOR] [COLOR=WHITE]/[COLOR=WHITE]/ [COLOR=RED]Закрыто.[/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Наказание верное',
            content:
            "[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый  {{ user.mention }}.<br><br>"+

            "[COLOR=RED]Администратор [COLOR=WHITE]предоставил доказательства.<br><br>"+
            "Наказание выдано верно.<br><br>"+

            '[COLOR=RED]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Админ Снят/ПСЖ',
            content:
            "[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый  {{ user.mention }}.<br><br>"+

            "Администратор был снят/ушел с поста [COLOR=RED]Администратора.<br><br>"+
            "[COLOR=WHITE]Спасибо за обращение.<br><br>"+

            '[COLOR=grean ]Рассмотрено[/COLOR][/FONT][/CENTER]',
            prefix: WATCHED_PREFIX,
            status: false,
        },
        {
            title: 'Передано ГА',
            content:
            "[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый  {{ user.mention }}.<br><br>"+

            "Жалоба передана Главному Администратору, пожалуйста ожидайте ответа.<br>"+
            "Ожидайте ответа в данной теме, не нужно создавать копии этой темы.[/FONT]<br><br>"+
            '[COLOR=WHITE] [FONT=times new roman][I]Передано [COLOR=RED][I]Главному Администратору. [/COLOR][/CENTER]',
            prefix: GA_PREFIX,
            status: true,
        },
        {
            title: 'Передано ЗГА ',
            content:
            "[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый  {{ user.mention }}.<br><br>"+

            " Жалоба передана [COLOR=RED][I]Заместителю Главного Администратора.<br>"+
            "[COLOR=WHITE]Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br><br>"+

            '[COLOR=WHITE][I]Передано [COLOR=RED][I]Заместителю Главного Администратора. [/COLOR][/FONT][/CENTER]',
            prefix: PIN_PREFIX,
            status: true,
},
        {
            title: 'Передано ЗГА/ГА ',
            content:
            "[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый  {{ user.mention }}.<br><br>"+

            " Жалоба передана [COLOR=WHITE][I]Главному Администратору/Заместителю Главного Администратора.<br>"+
            "[COLOR=WHITE]Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br><br>"+

            '[COLOR=WHITE][I]Передано [COLOR=RED][I]Главному Администратору/Заместителю Главного Администратора. [/COLOR][/FONT][/CENTER]',
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: 'Спецу',
            content:
            "[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый  {{ user.mention }}.<br><br>"+

            "Ваша жалоба передана [COLOR=RED]Специальному Администратору.<br>"+
            "[COLOR=WHITE]Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br><br>"+

            '[COLOR=WHITE][I][COLOR=RED]Передано Специальному Администратору.[/COLOR][/FONT][/CENTER]',
            prefix: SPECIAL_PREFIX,
            status: true,
        },
        {
            title: 'Соц. сети',
            content:
            "[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый {{ user.mention }}.<br><br>"+

            "Доказательства из соц сетей не принимаются, вам нужно загрузить доказательств на видео/фото хостинге.<br><br>"+

            '[COLOR=red][I] [SIZE=4][FONT=times new roman]Отказано[/COLOR] [COLOR=WHITE]/[COLOR=WHITE]/ [COLOR=RED]Закрыто.[/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'В ЖБ на теха',
            content:
            "[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый  {{ user.mention }}.<br><br>"+

            "[SIZE=4][FONT=times new roman] Вам было выдано наказания [COLOR=orange] Техническим специалистом[COLOR=#FFFFFF], [COLOR=WHITE]вы можете написать жалобу здесь : [URL='https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%968-pink.1189/']*Нажмите сюда*[/URL]<br><br>"+

            '[COLOR=red][I] [SIZE=4][FONT=times new roman]Отказано.[/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'В обжалование',
            content:
            "[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый  {{ user.mention }}.<br><br>"+

            "Если вы согласны с выданным наказанием, то напишите в раздел Обжалование.<br><br>"+

            '[COLOR=red][I] [SIZE=4][FONT=times new roman]Отказано[/COLOR] [COLOR=WHITE]/[COLOR=WHITE]/ [COLOR=RED]Закрыто.[/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
         },
    {
      title: 'Название темы',
      content: "[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый  {{ user.mention }}.<br><br>"+
        "[CENTER][I] [SIZE=4][FONT=times new roman]Название темы не по форме. ( [COLOR=rgb(255, 255, 0)]Nick_Name администратора[/COLOR] |[COLOR=rgb(255, 255, 0)] Нарушение [/COLOR]).[/FONT]<br><br>"+

		'[COLOR=red][I] [SIZE=4][FONT=times new roman]Отказано[/COLOR] [COLOR=WHITE]/[COLOR=WHITE]/ [COLOR=RED]Закрыто.[/FONT][/CENTER]',
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {


   title: '---------------------------------------------------------------> Наказаний адм <---------------------------------------------------------------',
   },
    {
        title: 'Жалоба одобрена',
      content: '[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый {{ user.mention }}![/CENTER]<br><br>' +
        "[CENTER][I] [SIZE=4][FONT=times new roman]Администратор допустил ошибку, с ним будет проведена соответствующая работа. Наказание будет снято в ближайшее время. Приносим извинения за доставленные неудобства.<br>" +
        '[COLOR=#40ff00]Одобрено.[/FONT][/CENTER]',
    prefix: ACCEPT_PREFIX,
        status: false,

  },
        {
            title: 'Работа с адм',
            content:
            "[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый {{ user.mention }}.<br><br>"+

            "Ваша жалоба была рассмотрена и одобрена, с [COLOR=RED]Администратором[COLOR=WHITE] будет проведена профилактическая работа.<br>"+
            "Ваше наказание будет снято в ближайшее время, если оно еще не снято.<br>"+
            "Приносим извинения за предоставленные неудобства.<br><br>"+

           '[COLOR=#40ff00]Одобрено.[/FONT][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
  },
        {
            title: 'Работа с адм',
            content:
            "[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый  {{ user.mention }}.<br><br>"+

            "Ваша жалоба была рассмотрена и одобрена, с [COLOR=RED]Администратором[COLOR=WHITE] будет проведена профилактическая работа.<br>"+
            "Ваше наказание будет снято в ближайшее время, если оно еще не снято.<br>"+
            "Приносим извинения за предоставленные неудобства.<br><br>"+

           '[COLOR=#40ff00]Одобрено.[/FONT][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,

        title: '---------------------------------------------------------------> Раздел Обжалование <---------------------------------------------------------------',
        },
        {
            title: 'Не по форме',
            content:
            "[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый  {{ user.mention }}.<br><br>"+

            "Ваше обжалование составлено не по форме, пожалуйста ознакомьтесь с правилами подачи обжалований: [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.2639626/']*Нажмите сюда*[/URL]<br><br>"+

            '[COLOR=RED][I] [SIZE=4][FONT=times new roman]Отказано[/COLOR] [COLOR=WHITE]/[COLOR=WHITE]/ [COLOR=RED]Закрыто.[/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Обжалованию не подлежит',
            content:
            "[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый  {{ user.mention }}.<br><br>"+

            "Данное нарушение не подлежит обжалованию, в обжаловании отказано.<br><br>"+

            '[COLOR=RED][I] [SIZE=4][FONT=times new roman]Отказано[/COLOR] [COLOR=WHITE]/[COLOR=WHITE]/ [COLOR=RED]Закрыто.[/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Не готовы снизить',
            content:
            "[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый  {{ user.mention }}.<br><br>"+

            "[COLOR=RED]Администрация [COLOR=WHITE]сервера не готова снизить вам наказание.<br><br>"+

            '[COLOR=RED][I] [SIZE=4][FONT=times new roman]Отказано[/COLOR] [COLOR=WHITE]/[COLOR=WHITE]/ [COLOR=RED]Закрыто.[/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'ОБЖ на рассмотрении',
            content:
            "[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый  {{ user.mention }}.<br><br>"+

            "Ваше обжалование взято на рассмотрение.<br>"+
            "Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br><br>"+

            '[COLOR=orange]На рассмотрение...[/COLOR][/FONT][/CENTER]',
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: 'Отказ обж',
            content:
            "[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый  {{ user.mention }}.<br><br>"+

            "В обжаловании отказано.<br><br>"+

           '[COLOR=red][I] [SIZE=4][FONT=times new roman] [COLOR=RED]Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Обжалование одобрено',
            content:
            "[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый  {{ user.mention }}.<br><br>"+

            "Обжалование одобрено, ваше наказание будет снято/снижено в течение 24-ех часов.<br><br>"+

            '[COLOR=#40ff00][I][FONT=times new roman]Одобрено[/COLOR], [COLOR=RED][I][FONT=times new roman]Закрыто.[/FONT][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Передано ГА обж',
            content:
            "[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый {{ user.mention }}.<br><br>"+

            "Обжалование передано [COLOR=RED]Главному Администратору.<br><br>"+"[COLOR=WHITE]Ожидайте ответа в данной теме, не нужно создавать копии этой темы.[/FONT]<br><br>"+


           '[COLOR=orange][FONT=times new roman]Передано.[/COLOR][/CENTER]',
            prefix: GA_PREFIX,
            status: true,
        },
        {
            title: 'Соц. сети ОБЖ',
            content:
            "[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый {{ user.mention }}.<br><br>"+

            " Доказательства из соц сетей не принимаются, вам нужно загрузить доказательств на видео/фото хостинге.<br><br>"+

            '[COLOR=red][I] [SIZE=4][FONT=times new roman]Отказано[/COLOR] [COLOR=WHITE]/[COLOR=WHITE]/ [COLOR=RED]Закрыто.[/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'В жб на админов',
            content:
            "[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый {{ user.mention }}.<br><br>"+

            "Если вы не согласны с выданным наказанием, то напишите жалобу в раздел Жалобы на [COLOR=RED]Администрацию.<br><br>"+

            '[COLOR=red][I] [SIZE=4][FONT=times new roman]Отказано[/COLOR] [COLOR=WHITE]/[COLOR=WHITE]/ [COLOR=RED]Закрыто.[/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,

      },
        {

	  title: 'ошиблись сервером',
	  content:
		"[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый  {{ user.mention }}.<br><br>"+

        "[I][FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Вы ошиблись сервером. <br>Вам нужно подать обжалование на тот сервер на котором вы получили наказание.[/FONT][/COLOR][CENTER]<br>" +

        '[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
    },
        {

	  title: 'Нужно было думать о действий',
	  content:
		"[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый  {{ user.mention }}.<br><br>"+

        "[I][FONT=times new roman][COLOR=#FFFFFF][SIZE=4]В обжаловании отказано.[/FONT][/COLOR][CENTER]" +
        "Нужно было думать о последствиях своих действий.<br><br>"+

        '[COLOR=red][I] [SIZE=4][FONT=times new roman]Отказано[/COLOR] [COLOR=WHITE]/[COLOR=WHITE]/ [COLOR=RED]Закрыто.[/FONT][/CENTER]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
   {

      title: 'Разблокировка аккаунта возможна 24ч',
	  content:
		"[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый  {{ user.mention }}.<br><br>"+

        "[I][FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Разблокировка аккаунта возможна, только при условии, что вы нашли человека которого обманули и он дал согласие на возврат вещей, чего я здесь не вижу.[/FONT][/COLOR][CENTER] <br><br>" +

        '[COLOR=red][I] [SIZE=4][FONT=times new roman]Отказано[/COLOR] [COLOR=WHITE]/[COLOR=WHITE]/ [COLOR=RED]Закрыто.[/FONT][/CENTER]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
     },
        {

      title: 'Отсутствует ссылка на VK',
	  content:
		"[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый  {{ user.mention }}.<br><br>"+

        "[I][FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Отсутствует ссылка на ваш VK.[/FONT][/COLOR][CENTER] " +

        "[I][FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Прикрепите ссылку на свой [COLOR=#3e38fd]Вконтакте[COLOR=#FFFFFF] и пересоздайте тему. [/FONT][/COLOR][CENTER] <br>" +

        '[COLOR=red][I] [SIZE=4][FONT=times new roman]Отказано[/COLOR] [COLOR=WHITE]/[COLOR=WHITE]/ [COLOR=RED]Закрыто.[/FONT][/CENTER]',
	  prefix: UNACCEPT_PREFIX,
            status: false,
     },
        {
            title: 'Нет доков',
            content:
            "[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый {{ user.mention }}.<br><br>"+

            "В вашей обжаловании  отсутствуют доказательства для рассмотра. <br>"+
            "Прикрепите доказательсва в хорошем качестве на разрешенных платформах.(Yapx/Imgur/YouTube/ImgBB)<br><br>"+

            '[COLOR=RED][I] [SIZE=4][FONT=times new roman]Отказано[/COLOR] [COLOR=WHITE]/[COLOR=WHITE]/ [COLOR=RED]Закрыто.[/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
  },
        {
            title: 'Связаться с жертвой обмана ',
            content:
            "[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый {{ user.mention }}.<br><br>"+

            "Аккаунт игрока будет разблокирован на 24 часа. <br>"+
            "За это время должен связаться с жертвой обмана и вернуть ему украденное имущество.<br>"+

            '[COLOR=RED][I] [SIZE=4][FONT=times new roman]Отказано[/COLOR] [COLOR=WHITE]/[COLOR=WHITE]/ [COLOR=RED]Закрыто.[/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
},
        {
 },
                         {
       title: 'Аккаунт разблокирован 24ч вернуть',
	  content:
		"[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый {{ user.mention }}.<br><br>"+
        "[I][FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Ваш аккаунт разблокирован.[/FONT][/COLOR][CENTER]" +
        "[I][FONT=times new roman][COLOR=#FFFFFF][SIZE=4]У вас есть 24 часа, чтобы вернуть имущество игроку, если вы этого не сделайте ваш аккаунт будет заблокирован без права обжалования.[/FONT][/COLOR][CENTER] <br>" +

        "[I][FONT=times new roman][COLOR=#FFFFFF][SIZE=4]Доказательства присылать сюда в данную тему. [/FONT][/COLOR][CENTER] <br>"+

        '[COLOR=orange][FONT=times new roman]На рассмотрении... [/COLOR][/CENTER]',
            prefix: PIN_PREFIX,
            status: false,

     title: '---------------------------------------------------------------> ПРОЧЕЕ <---------------------------------------------------------------',
        },

        {
},
        {
            title: 'Недост Для корректоного рассмотрения жб',
            content:
            "[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый {{ user.mention }}.<br><br>"+

             "Недостаточно доказательств для корректного рассмотрения жалобы.<br><br>"+

            '[COLOR=red][I] [SIZE=4][FONT=times new roman] [COLOR=RED]Отказано.[/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,

},
        {
            title: 'Ответственность за действ на акк',
            content:
            "[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый {{ user.mention }}.<br><br>"+

            "Ответственность за действия на аккаунте несёт исключительно владелец этого аккаунта. В обжаловании отказано.<br><br>"+

            '[COLOR=red][I] [SIZE=4][FONT=times new roman] [COLOR=RED]Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
},
        {
            title: 'обманутая сторона напишет обж',
            content:
            "[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый {{ user.mention }}.<br><br>"+

            "Пусть обманутая сторона напишет данное обжалование <br>"+
            "со своего форумного аккаунта для рассмотрения NonRP обмана. <br><br>"+


            '[COLOR=red][I] [SIZE=4][FONT=times new roman] [COLOR=RED]Закрыто.[/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
},
        {
            title: 'восст акка',
            content:
            "[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый {{ user.mention }}.<br><br>"+

            "Укажите список привязок на аккаунте, а именно Вк,тг,почта, а так же укажите примерную дату регистрации аккаунта, страну и город, в котором регистрировался аккаунт. У вас есть 24 часа на ответ. <br>"+
          '[COLOR=orange][FONT=times new roman]На рассмотрении... [/COLOR][/CENTER]',
            prefix: PIN_PREFIX,
            status: true,
},
        {
            title: 'более 48 + отказ обж',
            content:
            "[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый {{ user.mention }}.<br><br>"+

             "Срок написания жалобы 48 часов, обжалованию данное нарушение так же не подлежит.<br><br>"+

            '[COLOR=red][I] [SIZE=4][FONT=times new roman] [COLOR=RED]Отказано.[/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
},
        {
            title: 'Под блок ip',
            content:
            "[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый {{ user.mention }}.<br><br>"+

             "Вы попали под заблокированный ip, перезагрузите Ваш роутер/мобильный интернет, и повторно зайдите в игру.<br><br>"+

            '[COLOR=red][I] [SIZE=4][FONT=times new roman] [COLOR=RED]Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,

},
        {
            title: 'Ник',
            content:
            "[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый {{ user.mention }}.<br><br>"+

             "Аккаунт будет разблокирован на 24 часа для смены никнейма, в случае, если никнейм не будет сменён- аккаунт будет заблокирован без права на обжалование. <br><br>"+

           '[COLOR=orange][FONT=times new roman]На рассмотрении...[/COLOR][/CENTER]',

            prefix: PIN_PREFIX,
            status: true,
 },
        {
            title: 'Косяк кф по жб',
            content:
            "[CENTER][COLOR=RED][I] [SIZE=4][FONT=times new roman]{{ greeting }}[COLOR=WHITE], уважаемый  {{ user.mention }}.<br><br>"+

            "Жалоба будет перерассмотрена в ближайшее время. С администратором будет проведена соответствующая работа, приносим извинения за доставленные неудобства.<br><br>"+

            '[COLOR=#40ff00]Одобрено.[/FONT][/CENTER]',
            prefix: ACCEPT_PREFIX,
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

