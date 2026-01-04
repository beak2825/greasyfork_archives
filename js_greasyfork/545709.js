// ==UserScript==
// @name         LIPETSK || Скрипт для руководства
// @namespace   https://greasyfork.org/ru/users/1439493-leo-bauer
// @version      1.6
// @description  Скрипт для упрощения работы ГА/ЗГА/Кураторов администрации.
// @author       Leo_Bauer <3
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon https://play-lh.googleusercontent.com/AGgIfbXvo031xyP9i4JmDd4pz-PCH4tgKJl8zZ2YQ5xFYCao5uX2QNaHaYX7zb8WRjk
// @grant        none
// @license 	 none
// @downloadURL https://update.greasyfork.org/scripts/545709/LIPETSK%20%7C%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/545709/LIPETSK%20%7C%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0.meta.js
// ==/UserScript==

(function () {
  'use strict';
    const UNACCEPT_PREFIX = 4;
    const ACCEPT_PREFIX = 8;
    const CLOSE_PREFIX = 7;
    const RESHENO_PREFIX = 6;
    const PIN_PREFIX = 2;
    const GA_PREFIX = 12;
    const COMMAND_PREFIX = 10;
    const WATCHED_PREFIX = 9;
    const SA_PREFIX = 11;


    const START_DECOR = `<div style="text-align: center"><span style="font-family: 'Courier New'">`
const END_DECOR = `</span></div>`
    const buttons = [
        {
                                        	  title: '| Приветствие(Свой ответ) |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Текст <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]'

               },
        {
            title: '---------------------------------------------------------------> На рассмотреннии <---------------------------------------------------------------',
    },
    {
            title: '| На рассмотрение |',
            content:
            "[CENTER][FONT=Verdana][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Запросил доказательства у администратора.<br>"+
            "Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=orange]На рассмотрении.[/COLOR][/FONT][/CENTER]',
             prefix: PIN_PREFIX,
             prefix: CLOSE_PREFIX,
             status: false,
    },
    {
      title: '| На рассмотрении(жб) |',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFFFF][SIZE=5]Ваша жалоба взята на рассмотрение. <br> Не нужно создавать копии этой жалобы, ожидайте ответа в этой теме.[/COLOR][/FONT][/CENTER]<br><br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Ожидайте ответа.[/COLOR][/FONT][/CENTER]',
          prefix: PIN_PREFIX,
          status: false,
    },
    {
      title: '| На рассмотрении(обжалование) |',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFFFF][SIZE=5]Ваше обжалование взято на рассмотрение. <br> Не нужно создавать копии этого обжалования, ожидайте ответа в этой теме.[/COLOR][/FONT][/CENTER]<br><br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Ожидайте ответа.[/COLOR][/FONT][/CENTER]',
          prefix: PIN_PREFIX,
          status: false,
    },
    {
      title: '| ссылку на жб |',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFFFF][SIZE=5]Прикрепите ссылку на данную жалобу в течении 24 часов.[/COLOR][/FONT][/CENTER]<br><br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]На рассмотрении[/COLOR][/FONT][/CENTER]',
          prefix: PIN_PREFIX,
          status: false,
    },
    {
      title: '| ссылку на вк |',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFFFF][SIZE=5]Прикрепите ссылку на вашу страницу в ВК.[/COLOR][/FONT][/CENTER]<br><br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]На рассмотрении[/COLOR][/FONT][/CENTER]',
          prefix: PIN_PREFIX,
          status: false,
    },
        {
                                                	  title: '| Рассмотрение в VK |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/59LwGqfX/In-Shot-20230723-125050272.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=WHITE]Дальнейшее рассмотрение жалобы будет в ЛС ВКонтакте.<br>Просьба отписать мне в Личные сообщения VK для дальнейшего рассмотрения темы [URL='https://vk.com/karasik_alo']Вконтакте[/URL]. <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=White]С уважением [/COLOR][COLOR=RED]Администрация Lipetsk.[/COLOR]<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               }
        ,{
            title: '---------------------------------------------------------------> Раздел Жалоб <---------------------------------------------------------------',
        },
        {
            title: '| Не по форме |',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Ваша жалоба составлена не по форме, ознакомьтесь с правилами подачи жалоб : [URL='https://forum.blackrussia.online/forums/Правила-подачи-жалоб.202//']*Нажмите сюда*[/URL]<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
             prefix: CLOSE_PREFIX,
             status: false,
        },
        {
            title: '| Не является адм |',
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
            title: '| Нет /time |',
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
            title: '| От 3 лица |',
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
            title: '| Нужен фрапс |',
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
            title: '| Неполный фрапс |',
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
            title: '| Док-ва отредактированы |',
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
            title: '| Плохое качество докв |',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Доказательства были предоставлены в плохом качестве, пожалуйста прикрепите более качественные фото/видео.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: '| Прошло более 48 часов |',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "С момента выдачи наказания прошло более 48-ми часов, жалоба не подлежит рассмотрению.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: '| Нет доков |',
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
            title: '| Не рабочие док-ва |',
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
            title: '| Окно бана |',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Зайдите в игру и сделайте скрин окна с баном после чего, заново напишите жалобу.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто., Закрыто[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: '| Дублирование |',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Ответ вам уже был дан в предыдущей теме. Напоминаю, за дублирование тем ваш форумный аккаунт может быть заблокирован.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Отказано[/COLOR], Закрыто., Закрыто[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: '| Беседа с адм |',
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
            title: '| Нет нарушений |',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Исходя из приложенных выше доказательств - нарушения со стороны администратора отсутствуют.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: '| Наказание верное |',
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
            title: '| Админ Снят/ПСЖ |',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Администратор был снят/ушел с поста администратора.<br>"+
            "Спасибо за обращение.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=#00FA9A]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: '| Соц. сети |',
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
            title: '| В обжалование |',
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
          title : '| Фейковые доказательства |',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=rgb(255, 69, 0)][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Доказательства являются подделанными, Форумный аккаунт будет заблокирован.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[I][CENTER][SIZE=1][COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/SIZE][/CENTER][/COLOR]',
          prefix: CLOSE_PREFIX,
          status: false,
        },
        {
          title : '| Наказание по ошибке (Одобрено) |',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=rgb(255, 69, 0)][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Вследствие беседы с администратором было выяснено, что наказание было выдано по ошибке, вы будете разблокированы в течение нескольких часов.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[I][CENTER][SIZE=1][COLOR=rgb(255, 0, 0)]Одобрено, закрыто.[/SIZE][/CENTER][/COLOR]',
          prefix: ACCEPT_PREFIX,
          status: false,
         },
       {
              title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴передам(жб) ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
        },
        {
            title: '| Передано ГА |',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Жалоба передана Главному Администратору, пожалуйста ожидайте ответа.<br>"+
            "Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Передано Главному Администратору[/COLOR][/FONT][/CENTER]',
             prefix: GA_PREFIX,
            status: false,
        },
        {
             title: '| Передано ЗГА |',
             content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFFFF][SIZE=5]Ваша жалоба была передана на рассмотрение Заместителю Главного Администратора. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Ожидайте его ответа.[/COLOR][/FONT][/CENTER]',
         prefix: PIN_PREFIX,
         status: false,
        },
        {
            title: '| Передано ЗГА ГОСС & ОПГ |',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            " Жалоба передана Заместителю Главного Администратора по направлению ОПГ и ГОСС.<br>"+
            "Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Передано ЗГА ГОСС&ОПГ[/COLOR][/FONT][/CENTER]',
            prefix: PIN_PREFIX,
            status: false,
        },
        {
            title: '| Специальному администратору |',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Ваша жалоба передана Специальному Администратору.<br>"+
            "Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Передано Специальному Администратору.[/COLOR][/FONT][/CENTER]',
            prefix: SA_PREFIX,
         status: false,
         },
         {
            title: '| Передано РМ |',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Ваша жалоба передана Руководителю модерации Discord.<br>"+
            "Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Жалоба передана Руководителю модерации Discord.[/COLOR][/FONT][/CENTER]',
            prefix: PIN_PREFIX,
         status: true,
         },
         {
           title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴другой раздел ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: '| в жб на адм |',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Если вы не согласны с выданным наказанием, то обратитесь в раздел Жалоб на Администрацию - [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.2989/']*Тык*[/URL] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
         prefix: CLOSE_PREFIX,
         status: false,
    },
    {
      title: '| в жб на игроков |',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFFFF][SIZE=5]Данный игрок не является администратором.<br>Обратитесь в раздел Жалоб на игроков - [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2991/']*Тык*[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
         prefix: CLOSE_PREFIX,
         status: false,
    },
    {
      title: '| в жб на лд |',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFFFF][SIZE=5]Данный игрок является лидером.<br>Обратитесь в раздел Жалоб на лидеров - [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.2990/']*Тык*[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
         prefix: CLOSE_PREFIX,
         status: false,
    },
    {
      title: '| в обжалования |',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFFFF][SIZE=5]Внимательно ознакомившись с вашей жалобой, было решено, что вам нужно обраться в раздел Обжалований наказаний - [URL='https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.2992/']*Тык*[/URL] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
         prefix: CLOSE_PREFIX,
         status: false,
    },
    {
      title: '| в тех раздел |',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFFFF][SIZE=5]Вы ошиблись разделом.<br>Обратитесь в Технический раздел - [URL='https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-lipetsk.2971/']*Тык*[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
         prefix: CLOSE_PREFIX,
         status: false,
    },
    {
      title: '| в жб на теха |',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFFFF]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFFFF][SIZE=5]Вам было выдано наказания Техническим специалистом, вы можете написать жалобу/обжалование здесь - [URL='https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9670-lipetsk.2970/']*Тык*[/URL] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
         prefix: CLOSE_PREFIX,
         status: false,
    },
    {
            title: '---------------------------------------------------------------> Раздел Обжалование <---------------------------------------------------------------',
        },
        {
            title: '| Не по форме |',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Ваше обжалование составлено не по форме, пожалуйста ознакомьтесь с правилами подачи обжалований : [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.2639626/']*Нажмите сюда*[/URL]<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[CENTER][FONT=Verdana][COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
         prefix: CLOSE_PREFIX,
         status: false,
        },
        {
            title: '| Обжалованию не подлежит |',
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
            title: '| Не готовы снизить |',
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
            title: '| ОБЖ на рассмотрении |',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Ваше обжалование взято на рассмотрение.<br>"+
            "Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=orange]На рассмотрение[/COLOR][/FONT][/CENTER]',
           prefix: PIN_PREFIX,
         status: false,
        },
        {
            title: '| Уже есть мин. наказание |',
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
            title: '| Обжалование одобрено |',
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
            title: '| Передано ГА обж |',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Обжалование передано Главному Администратору.<br>"+
            "Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=orange]На рассмотрение[/COLOR][/FONT][/CENTER]',
         prefix: GA_PREFIX,
         status: false,
        },
        {
            title: '| Соц. сети ОБЖ |',
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
            title: '| В жб на админов |',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Если вы не согласны с выданным наказанием, то напишите жалобу в раздел Жалобы на Администрацию.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
         prefix: CLOSE_PREFIX,
         status: false,
        },
         {
          title : '| Обжалование на рассмотрение |',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=rgb(255, 69, 0)][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваше обжалование взято «На рассмотрение».[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
          '[I][CENTER][SIZE=1][COLOR=rgb(255, 140, 0)]Ожидайте ответа...[/SIZE][/CENTER][/COLOR]',
          prefix: PIN_PREFIX,
          status: false,
         },
         {
          title : '| Срок снижен до 30 дней |',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=rgb(255, 69, 0)][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Срок блокировки аккаунта будет снижен до 30 дней,с момента разблокировки аккаунта, не повторяйте подобных действий.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[I][CENTER][SIZE=1][COLOR=rgb(255, 0, 0)]Одобрено, закрыто.[/SIZE][/CENTER][/COLOR]',
          prefix: ACCEPT_PREFIX,
          status: false,
         },
         {
          title : '| Срок снижен до 15 дней |',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=rgb(255, 69, 0)][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Срок блокировки аккаунта будет снижен до 15 дней,с момента разблокировки аккаунта, не повторяйте подобных действий.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[I][CENTER][SIZE=1][COLOR=rgb(255, 0, 0)]Одобрено, закрыто.[/SIZE][/CENTER][/COLOR]',
          prefix: ACCEPT_PREFIX,
          status: false,
         },
         {
          title : '| Срок снижен до 7 дней |',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=rgb(255, 69, 0)][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Срок блокировки аккаунта будет снижен до 7 дней,с момента разблокировки аккаунта, не повторяйте подобных действий.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[I][CENTER][SIZE=1][COLOR=rgb(255, 0, 0)]Одобрено, закрыто.[/SIZE][/CENTER][/COLOR]',
          prefix: ACCEPT_PREFIX,
          status: false,
         },
         {
          title : '| Срок снижен до 3 дней |',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=rgb(255, 69, 0)][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Срок блокировки аккаунта будет снижен до 3 дней,с момента разблокировки аккаунта, не повторяйте подобных действий.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[I][CENTER][SIZE=1][COLOR=rgb(255, 0, 0)]Одобрено, закрыто.[/SIZE][/CENTER][/COLOR]',
          prefix: ACCEPT_PREFIX,
          status: false,
         },
         {
          title : '| ОБЖ Одобрено |',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=rgb(255, 69, 0)][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваше обжалование «Одобрено».[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[I][CENTER][SIZE=1][COLOR=rgb(255, 0, 0)]Одобрено, закрыто.[/SIZE][/CENTER][/COLOR]',
          prefix: ACCEPT_PREFIX,
          status: false,
         },
         {
          title : '| ОБЖ Отказано |',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
         '[CENTER][COLOR=rgb(255, 69, 0)][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваше обжалование «Отказано».[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[I][CENTER][SIZE=1][COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/SIZE][/CENTER][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false,
         },
         {
          title : '| ОБЖ не по форме |',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=rgb(255, 69, 0)][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба составлена не по форме. Ознакомьтесь с правилами подачи обжалования - [/I][URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.3429398/']*Нажмите сюда*[/URL][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[I][CENTER][SIZE=1][COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/SIZE][/CENTER][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false,
         },
         {
            title: '| Нон рп обман (пострадавший) |',
            content:
            "[SIZE=4][CENTER][FONT=Georgia]Доброго времени суток<br>"+
            "Игроку даётся на возврат имущества 24 часа , фрапс возврата прикрепите сообщением ниже . <br>"+
            "Желаем приятной игры и не попадайтесь на мошенников. <br>"+
            '[COLOR=GREEN]Рассмотрено[/COLOR], Открыто для дальнейших разбирательств.[/FONT][/CENTER]',
            prefix: WATCHED_PREFIX,
            status: false,
        },
         {
          title :  '| Обжалованию не подлежит |',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=rgb(255, 69, 0)][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Данное наказание, которое вам выдано - обжалованию «Не подлежит».[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[I][CENTER][SIZE=1][COLOR=rgb(255, 0, 0)]Отказано, закрыто.[/SIZE][/CENTER][/COLOR]',
          prefix: CLOSE_PREFIX,
          status: false,
         },
         {
          title : '| В ЖБ на АДМ |',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=rgb(255, 69, 0)][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Если не согласны с выданным наказанием от администрации, то обратитесь в раздел «Жалобы на администрацию».[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[I][CENTER][SIZE=1][COLOR=rgb(255, 0, 0)]Закрыто.[/SIZE][/CENTER][/COLOR]',
          prefix: CLOSE_PREFIX,
          status: false,
         },
         {
          title : '| Недостаточно док-в в «ОБЖ» |',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=rgb(255, 69, 0)][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Недостаточно доказательств, чтобы корректно рассмотреть данное обжалование.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[I][CENTER][SIZE=1][COLOR=rgb(255, 0, 0)]Отказано, Закрыто.[/SIZE][/CENTER][/COLOR]',
          prefix: CLOSE_PREFIX,
          status: false,
         },
         {
                                                	  title: '| Смена NikName((РАЗБАН 24Ч) |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Ваш аккаунт будет разблокирован на 24 часа для смены NikName.<br>После смены NikName Вы должны будете закрепить в данной теме доказательства. <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением администрация Lipetsk.[/COLOR]<br>",
      prefix: PIN_PREFIX,
      status: true,
    },
         {
                                                        	  title: '| Ошиблись сервером |',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED]Вы ошиблись сервером, напишите обжалование наказания на форуме Вашего сервера. <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением администрация Lipetsk.[/COLOR]<br>",
        	      prefix: CLOSE_PREFIX,
      status: false
               },
    ];

    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

        // Добавление кнопок при загрузке страницы
        addButton('Одобрить', 'accepted');
        addButton('Отказать', 'unaccept');
        addButton('На рассмотрение', 'pin');
        addButton('Рассмотрено', 'watched');
        addButton('Закрыть', 'Close');
        addButton('КП', 'teamProject');
        addButton ('Спецу', 'specialAdmin');
        addButton ('ГА', 'mainAdmin');
        addButton('Меню скрипта', 'selectAnswer');

        // Поиск информации о теме
        const threadData = getThreadData();

        $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
        $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
        $(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true));
        $(`button#watched`).click(() => editThreadData(WATCHED_PREFIX, false));
        $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
        $(`button#mainAdmin`).click(() => editThreadData(GA_PREFIX, true));
        $(`button#specialAdmin`).click(() => editThreadData(SA_PREFIX, true));
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