// ==UserScript==
// @name         Тех Специалисты (Логирование) by T.Repach
// @namespace    https://forum.blackrussia.online/
// @version      0.9
// @description  Скрипт для технических специалистов
// @author       Tokyo_Repach
// @match         https://forum.blackrussia.online/threads/*
// @include       https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon https://img.icons8.com/nolan/452/beezy.png
// @downloadURL https://update.greasyfork.org/scripts/546578/%D0%A2%D0%B5%D1%85%20%D0%A1%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D1%8B%20%28%D0%9B%D0%BE%D0%B3%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%29%20by%20TRepach.user.js
// @updateURL https://update.greasyfork.org/scripts/546578/%D0%A2%D0%B5%D1%85%20%D0%A1%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D1%8B%20%28%D0%9B%D0%BE%D0%B3%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%29%20by%20TRepach.meta.js
// ==/UserScript==

(function () {
	'use strict';
	const UNACCEPT_PREFIX = 4; // префикс отказано
	const PIN_PREFIX = 2; //  префикс закрепить
	const COMMAND_PREFIX = 10; // команде проекта
	const CLOSE_PREFIX = 7; // префикс закрыто
	const DECIDED_PREFIX = 6; // префикс решено
	const TECHADM_PREFIX = 13 // теху администратору
	const WATCHED_PREFIX = 9; // рассмотрено
	const WAIT_PREFIX = 14; // ожидание (для переноса в баг-трекер)
	const NO_PREFIX = 0;
	const buttons = [
     {
		title: 'Приветствие',
		content:
	 '[COLOR=rgb(0, 255, 127)][FONT=Arial][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
	 '[CENTER]Тут должен быть ваш текст[/CENTER]',
	},
	{
 title: 'Рассписываем',
 content:
 '[SIZE=4][FONT=Verdana][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
 '[CENTER]Получили блокировку за нарушение [COLOR=rgb(65, 168, 95)]пункта правил[/COLOR]:<br><br>' +
 '[SPOILER="пункт "]<br>'+
 '[/SPOILER]<br><br>'+
 'А именно из-за данных действий:[/CENTER]<br><br>' +
 '[TABLE][TR][TD][CENTER][/CENTER][/TD][TD][CENTER][/CENTER][/TD][/TR][TR][TD][CENTER][/CENTER][/TD][TD][CENTER][/CENTER][/TD][/TR][/TABLE]<br><br>[CENTER]'+
 'Передано Куратору для окончательного вердикта.<br><br>' +

 '[COLOR=rgb(255, 255, 0)]Тема закреплена и находится на рассмотрении[/COLOR][/CENTER][/FONT][/SIZE]',
 prefix: TECHADM_PREFIX,
 status: true,
 },
	{
        title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ⠀ᅠ ᅠ ᅠᅠДля специалистов в направлении логирования  ᅠᅠ ⠀ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	},
            {
            title: 'На рассмотрении',
            content:
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/size]<br><br>" +
             "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px] Ваша тема взята на рассмотрение. Ответ поступит в ближайшее время. Пожалуйста, ожидайте.[/size][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][size=15px][COLOR=rgb(255, 152, 0)][ICODE]На рассмотрении...[/ICODE][/size][/CENTER][/COLOR]',
            prefix: PIN_PREFIX,
            status: true,
          },
           {
            title: 'Ожидайте вердикта руководства',
            content:
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px] Ваша тема закреплена и ожидает выноса вердикта со стороны руководства технических специалистов. Пожалуйста, ожидайте.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 152, 0)][ICODE]На рассмотрении...[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: PIN_PREFIX,
            status: true,
          },
          {
            title: 'Дублированное обращение',
            content:
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Эта тема является копией вашей предыдущей темы. Пожалуйста, не создавайте похожие или одинаковые темы, иначе [COLOR=rgb(255, 255, 255)] Ваш аккаунт на форуме может быть заблокирован.[/COLOR][/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Форма подачи жб на тех',
            content:
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Пожалуйста, заполните форму, создав новую тему. Заголовок темы должен содержать никнейм технического специалиста и отражать основную суть обращения.<br>Пример:<br> Lev_Kalashnikov | Махинации<br>Форма заполнения темы:<code><br>01. Ваш игровой никнейм:<br>02. Игровой никнейм технического специалиста:<br>03. Сервер, на котором Вы играете:<br>04. Описание ситуации (описать максимально подробно и раскрыто):<br>05. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>06. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):</code>[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Отказано[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Правила раздела жалоб на тех',
            content:
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Пожалуйста, убедительная просьба, ознакомиться с назначением данного раздела в котором Вы создали тему, так как Ваш запрос не относится к жалобам на технических специалистов.<br>Что принимается в данном разделе:<br>Жалобы на технических специалистов, оформленные по форме подачи и не нарушающие правила подачи:<br><br>[FONT=verdana][SIZE=15px][COLOR=rgb(226, 80, 65)][U]Правила подачи жалобы на технических специалистов[/U][/COLOR][/SIZE][/FONT][/CENTER]<br>[QUOTE][FONT=verdana][SIZE=15px][COLOR=rgb(226, 80, 65)]01.[/COLOR] Ваш игровой никнейм:[FONT=verdana][SIZE=15px][COLOR=rgb(226, 80, 65)]<br>02.[/COLOR] Игровой никнейм технического специалиста:[COLOR=rgb(226, 80, 65)]<br>03.[/COLOR] Сервер, на котором Вы играете:[COLOR=rgb(226, 80, 65)]<br>04.[/COLOR] Описание ситуации (описать максимально подробно и раскрыто):[COLOR=rgb(226, 80, 65)]<br>05.[/COLOR] Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):[COLOR=rgb(226, 80, 65)]<br>06.[/COLOR] Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/SIZE][/FONT][/SIZE][/QUOTE]<br><br>[FONT=verdana][SIZE=15][FONT=verdana][SIZE=15px][COLOR=rgb(226, 80, 65)]Примечание:[/COLOR] все оставленные заявки обращения в данный раздел обязательно должны быть составлены по шаблону предоставленному немного выше.<br>В ином случае, заявки обращения в данный раздел составленные не по форме — будут отклоняться.<br>Касательно названия заголовка темы — четких правил нет, но, желательно чтобы оно содержало лишь никнейм и сервер технического специалиста.<br>Заранее, настоятельно рекомендуем ознакомиться [U][B][URL='https://wh10919.web1.maze-host.ru/index.php?forums/Информация-для-игроков.13/']с данным разделом[/URL][/B][/U].[/SIZE][/FONT][/SIZE][/FONT]<br><br>[CENTER][FONT=verdana][SIZE=15px][COLOR=rgb(226, 80, 65)][U]Какие жалобы не проверяются?[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[FONT=verdana][SIZE=15px][COLOR=rgb(226, 80, 65)]—[/COLOR] Если в содержании темы присутствует оффтоп/оскорбления.<br>[SIZE=15px][COLOR=rgb(226, 80, 65)]—[/COLOR] Если в заголовке темы отсутствует никнейм технического специалиста.<br>[COLOR=rgb(226, 80, 65)]—[/COLOR] С момента выдачи наказания прошло более 7 дней.[/SIZE][/FONT][/COLOR]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Отказано[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Срок подачи жалоб',
            content:
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]С момента вынесения наказания техническим специалистом [COLOR=rgb(255, 255, 255)] прошло более 14 дней.[/COLOR]<br>В настоящее время изменить меру наказания невозможно. Однако Вы можете попробовать написать заявление на обжалование через определенный период времени.<br><br>Обращаем Ваше внимание, что некоторые наказания не подлежат обжалованию или амнистии. Детальнее ознакомиться с критериями можно здесь: [URL='https://wh10919.web1.maze-host.ru/index.php?threads/Правила-обжалования-нарушения-при-выдаче-наказания-от-технического-специалиста.280/']нажмите[/URL]([/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Вам в технический раздел',
            content:
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Ваша тема не связана с жалобами на работу технических специалистов. Пожалуйста, обратитесь с этим вопросом в технический раздел Вашего сервера.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Отказано[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Обжалованию не подлежит',
            content:
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Блокировка Вашего аккаунта является серьёзным нарушением правил сервера.<br>Вы были заблокированы за серьезное нарушение. Мы не можем уменьшить срок блокировки, аннулировать ее или применить амнистию.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Отказано[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Срок блокировки будет снижен',
            content:
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Проверив Вашу историю наказаний, принято решение сократить срок блокировки аккаунта.<br>Пожалуйста, в следующий раз будьте внимательнее, второй раз мы не идем навстречу.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Аккаунт будет разблокирован',
            content:
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Жалоба передана руководству технических специалистов. На основании выноса вердикта — Ваш аккаунт может быть разблокирован. <br>Пожалуйста, ожидайте ответа в данной теме. Копии темы создавать не нужно.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 152, 0)][ICODE]На рассмотрении...[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: PIN_PREFIX,
            status: true,
          },
          {
            title: 'Нет окна блокировки',
            content:
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
             "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Пожалуйста, прикрепите скриншот окна блокировки. [/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Пожалуйста, создайте новую тему и прикрепите снимок экрана с заблокированного окна, используя фото-хостинги [URL='https://yapx.ru/']yapx.ru[/URL], [URL='https://imgur.com/']imgur.com[/URL], [URL='https://www.youtube.com/']youtube.com[/URL] или [URL='https://imgbb.com']ImgBB.com[/URL] (все кликабетильно).[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: PIN_PREFIX,
            status: true,
          },
          {
            title: 'Имущество не может быть восстановлено',
            content:
             "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Пожалуйста, убедительная просьба, ознакомьтесь с правилами восстановлений: [URL='https://wh10919.web1.maze-host.ru/index.php?threads/В-каких-случаях-мы-не-восстанавливаем-игровое-имущество.288/unread']нажмите[/URL]. Вы создали тему, которая не относится к технической проблеме.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Отказано[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'По проблемам с донатом не использовать ',
            content:
             "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Если Вы не получили зачисление BLACK COINS, скорее всего, произошла ошибка при вводе данных. Чтобы проверить, были ли зачислены BLACK COINS, введите в игре команду: [COLOR=rgb(255, 255, 255)]/donat.[/COLOR][/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][B]Пожалуйста, будьте внимательны при совершении покупок.[/B][/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Если Вы уверены, что ошибка невозможна и с момента оплаты прошло не более 14 дней, обязательно обратитесь в службу поддержки для решения проблемы. Вы можете связаться с нами через виджет обратной связи на сайте или через мессенджеры:VK: [URL=' vk.com/br_tech']нажмите[/URL], Telegram: [URL='t.me/br_techBot']нажмите[/URL][/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: DECIDED_PREFIX,
            status: false,
          },
          {
            title: 'Имущество будет восстановлено',
            content:
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Ваше игровое имущество/денежные средства будут восстановлены в течение двух недель. Убедительная просьба, не менять никнейм до момента восстановления.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
             "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Для активации восстановления используйте команды: [COLOR=rgb(255, 255, 255)] /roulette, /recovery.[/COLOR][/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(127, 255, 0)][ICODE]Решено[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: DECIDED_PREFIX,
            status: false,
          },
          {
            title: 'Переустановите игру Не использовать',
            content:
             "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Возможно, в файлы вашей игры были внесены изменения или дополнения.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Рекомендуется полностью удалить лаунчер и связанные файлы, а затем установить игру заново с официального сайта: [URL='https://blackrussia.online']нажмите[/URL][/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(127, 255, 0)][ICODE]Рассмотрено[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: DECIDED_PREFIX,
            status: false,
          },
          {
            title: 'Не относится к жалобам на тех',
            content:
             "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Ваше обращение не относится к жалобам на технических специалистов. Пожалуйста ознакомьтесь с правилами данного раздела: [URL='https://wh10919.web1.maze-host.ru/index.php?forums/Информация-для-игроков.13/']нажмите[/URL].[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Отказано[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Игрок будет заблокирован',
            content:
             "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]После проверки доказательств и системы логирования выношу вердикт: [COLOR=rgb(255, 255, 255)][FONT=Arial]игрок будет заблокирован.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: DECIDED_PREFIX,
            status: false,
          },
          {
            title: 'Игрок не будет заблокирован',
            content:
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]После проверки доказательств и системы логирования выношу вердикт:[COLOR=rgb(255, 255, 255)] недостаточно доказательств для блокировки игрока.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
	  title: 'Команде проекта',
	  content:
		'[CENTER]{{ greeting }}, уважаемый игрок![B][/B][/CENTER]<br><br>' +
		"[CENTER]Ваша тема закреплена и находится на рассмотрении. Пожалуйста, ожидайте выноса вердикта команды проекта.<br><br>" +
		'[CENTER]Создавать новые темы с данной проблемой — не нужно, ожидайте ответа в данной теме. Если проблема решится - Вы всегда можете уведомить нас о ее решении.[/CENTER]',
	},
{
	  title: 'Передано на тестирование',
	  content:
		'[CENTER]{{ greeting }}, уважаемый игрок![B][/B][/CENTER]<br><br>' +
		"[CENTER]Благодарим за уведомление о недоработке. Ваша тема  находится в процессе тестирования.<br><br>" +
		'[CENTER] [color=orange]На рассмотрении.[/CENTER]',
	},

];

 	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('На рассмотрении', 'pin', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 173, 51, 0.5);');
	addButton('Команде проекта', 'teamProject', 'border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(255, 240, 110, 0.5);');
    addButton('Техническому специалисту', 'techspec', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(17, 92, 208, 0.5);');
	addButton('Рассмотрено', 'watched', 'border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(110, 192, 113, 0.5)');
	addButton('Решено', 'decided', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(110, 192, 113, 0.5);');
    addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(220, 89, 89, 0.5);');
	addButton('Закрыто', 'closed', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(220, 89, 89, 0.5);');
  addButton('Ответы', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$(`button#ff`).click(() => pasteContent(8, threadData, true));
	$(`button#prr`).click(() => pasteContent(2, threadData, true));
	$(`button#zhb`).click(() => pasteContent(21, threadData, true));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
	$('button#decided').click(() => editThreadData(DECIDED_PREFIX, false));
	$('button#closed').click(() => editThreadData(CLOSE_PREFIX, false));
	$('button#closed_complaint').click(() => editThreadData(CLOSE_PREFIX, false, false));
	$('button#techspec').click(() => editThreadData(TECHADM_PREFIX, true));

	$(`button#selectAnswer`).click(() => {
	XF.alert(buttonsMarkup(buttons), null, 'ВЫБЕРИТЕ ОТВЕТ');
	buttons.forEach((btn, id) => {
	if (id > 1) {
	$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
	}
	else {
	$(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
	}
	});
	});
	});

    function addButton(name, id, style) {
         $('.button--icon--reply').before(
	`<button type="button" class="button--primary button rippleButton" id="${id}" style="${style}">${name}</button>`,
	);
	}
	function addAnswers() {
		$('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 5px; margin-top: 10px; border-radius: 13px;">ОТВЕТЫ</button>`,
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

	if (send == true) {
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
	4 < hours && hours <= 11 ?
	'Доброе утро' :
	11 < hours && hours <= 15 ?
	'Добрый день' :
	15 < hours && hours <= 21 ?
	'Добрый вечер' :
	'Доброй ночи',
	};
	}

	function editThreadData(prefix, pin = false, may_lens = true) {
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
				discussion_open: 1,
				sticky: 1,
				_xfToken: XF.config.csrf,
				_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
				_xfWithData: 1,
				_xfResponseType: 'json',
			  }),
			}).then(() => location.reload());
		}
		if(may_lens === true) {
			if(prefix == UNACCEPT_PREFIX || prefix == WATCHED_PREFIX || prefix == CLOSE_PREFIX || prefix == DECIDED_PREFIX) {
				moveThread(prefix, 230); }

			if(prefix == WAIT_PREFIX) {
				moveThread(prefix, 917);
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