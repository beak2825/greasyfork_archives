// ==UserScript==
// @name         Технические Специалисты (Форум и логирования )
// @namespace    https://wh10919.web1.maze-host.ru/index.php
// @version      0.7
// @description  Скрипт для технических специалистов
// @author       Dozza_Skyxrockedz
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon https://img.icons8.com/nolan/452/beezy.png
// @downloadURL https://update.greasyfork.org/scripts/518266/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B5%20%D0%A1%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D1%8B%20%28%D0%A4%D0%BE%D1%80%D1%83%D0%BC%20%D0%B8%20%D0%BB%D0%BE%D0%B3%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F%20%29.user.js
// @updateURL https://update.greasyfork.org/scripts/518266/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B5%20%D0%A1%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D1%8B%20%28%D0%A4%D0%BE%D1%80%D1%83%D0%BC%20%D0%B8%20%D0%BB%D0%BE%D0%B3%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F%20%29.meta.js
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
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ         ᅠ⠀⠀ ⠀⠀ᅠ ᅠᅠДля специалистов в направлении Форум  ᅠᅠ ᅠᅠ⠀⠀⠀ ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
    	  },
    	  {
            title: 'Форма подачи',
            content:
           "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Пожалуйста, заполните форму, создав новую тему:[/CENTER] <code> <br>01. Ваш игровой никнейм:<br>02. Сервер, на котором Вы играете:<br>03. Суть Вашей возникшей проблемы (описать максимально подробно и раскрыто): <br>04. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>05. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно)</code>[/SIZE][/FONT][/COLOR]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Отказано[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Правила технического раздела',
            content:
           "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Пожалуйста, убедительная просьба, ознакомиться с назначением данного раздела в котором Вы создали тему, так как Ваш запрос не относится к технической проблеме.<br>Что принимается в тех разделе:<br>Если возникли технические проблемы, которые так или иначе связаны с игровым модом<br>Форма заполнения:<br>[QUOTE]<br>[FONT=verdana][SIZE=15px][COLOR=rgb(226, 80, 65)]01.[/COLOR] Ваш игровой никнейм:<br>[COLOR=rgb(226, 80, 65)]02.[/COLOR] Сервер, на котором Вы играете:<br>[COLOR=rgb(226, 80, 65)]03.[/COLOR] Суть возникшей проблемы (описать максимально подробно и раскрыто):<br>[COLOR=rgb(226, 80, 65)]04.[/COLOR] Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>[COLOR=rgb(226, 80, 65)]05.[/COLOR] Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/SIZE][/FONT][/QUOTE]<br>[/CENTER]<br><br>[CENTER][FONT=verdana][SIZE=15px][COLOR=rgb(226, 80, 65)][U]Если возникли технические проблемы, которые так или иначе связаны с вылетами из игры и любыми другими проблемами клиента[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[QUOTE]<br>[FONT=verdana][SIZE=15px][COLOR=rgb(226, 80, 65)]01. [/COLOR]Ваш игровой ник:<br>[COLOR=rgb(226, 80, 65)]02. [/COLOR]Сервер:<br>[COLOR=rgb(226, 80, 65)]03.[/COLOR] Тип проблемы: Обрыв соединения | Проблема с ReCAPTCHA | Краш игры (закрытие игры) | Другое [Выбрать один вариант ответа]<br>[COLOR=rgb(226, 80, 65)]04. [/COLOR]Действия, которые привели к этому (при вылетах, по возможности предоставлять место сбоя):<br>[COLOR=rgb(226, 80, 65)]05.[/COLOR] Как часто данная проблема:<br>[COLOR=rgb(226, 80, 65)]06.[/COLOR] Полное название мобильного телефона:<br>[COLOR=rgb(226, 80, 65)]07.[/COLOR] Версия Android:<br>[COLOR=rgb(226, 80, 65)]08. [/COLOR]Дата и время (по МСК):<br>[COLOR=rgb(226, 80, 65)]09. [/COLOR]Связь с Вами по Telegram/VK:[/QUOTE][/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Отказано[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Не относится к тех. разделу',
            content:
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Ваше обращение не относится к техничекому разделу.<br> Пожалуйста ознакомьтесь с правилами данного раздела: [URL='https://forum.blackrussia.online/forums/%D0%98%D0%BD%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%86%D0%B8%D1%8F-%D0%B4%D0%BB%D1%8F-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.231/']нажмите[/URL].[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Отказано[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Оффтоп',
            content:
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Ваше обращение содержит контент, который нарушает правила пользования форумом. Пожалуйста, прекратите создавать подобные обращения, иначе Ваш форумный аккаунт может быть наделен статусом временной или постоянной блокировки.<br>Ознакомиться с правилами пользования форумом Вы можете здесь: [URL='https://wh10919.web1.maze-host.ru/index.php?threads/Общие-правила-нахождения-на-форуме.250/']нажмите[/URL].[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Проблема решилась',
            content:
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Благодарим Вас за поддержание обратной связи! Мы искренне рады за то, что Ваша проблема была решена и мы смогли помочь Вам.<br>Если Вы вновь столкнетесь с той или иной проблемой или же недоработкой — обязательно обращайтесь в технический раздел. Приятной игры![/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(127, 255, 0)][ICODE]Решено[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: DECIDED_PREFIX,
            status: false,
          },
          {
            title: 'Отвязка привязок',
            content:
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Удалить установленные на аккаунт привязки не представляется возможным. В том случае, если на Ваш игровой аккаунт были установлены привязки взломщиком — он будет перманентно заблокирован с причиной «Чужая привязка». В данном случае дальнейшая разблокировка игрового аккаунта невозможна во избежание повторных случаев взлома — наша команда не может быть уверена в том, что злоумышленник не воспользуется установленной им привязкой в своих целях.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Передано направлению логирования',
            content:
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Ваша тема закреплена и передана <u>техническому специалисту по логированию</u> для дальнейшего вердикта,ожидайте ответ в данной теме. Создавать новые темы с данной проблемой — не нужно. [/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 152, 0)][ICODE]На рассмотрении...[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: TECHADM_PREFIX,
            status: true,
          },
          {
            title: 'Запрос доп. информации',
            content:
           "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Для дальнейшего рассмотрения темы, предоставьте:<br><BR>[QUOTE][SIZE=5][FONT=Arial]1. Скриншоты или видео, подтверждающие факт владения этим имуществом.<BR>2. Все детали пропажи: дата, время, после каких действий имущество пропало.<BR>3. Информация о том, как вы изначально получили это имущество:<BR>дата покупки<br>способ приобретения (у игрока, в магазине или через донат;<br>фрапс покупки (если есть);<br>никнейм игрока, у которого было приобретено имущество, если покупка была сделана не в магазине.[/QUOTE] [/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 152, 0)][ICODE]На рассмотрении...[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: PIN_PREFIX,
            status: true,
          },
          {
            title: 'Проблемы с загрузкой форума',
            content:
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Если вы столкнулись с проблемой загрузки страниц форума, пожалуйста, выполните следующие действия:<br><br>• Откройте Настройки.<br>• Найдите во вкладке Приложения свой браузер, через который вы пользуетесь нашим сайтом форума.<br>• Нажмите на браузер, после чего внизу выберите Очистить -> Очистить Кэш.<br><br>После следуйте данным инструкциям:<br>• Перейдите в настройки браузера.<br>• Выберите Конфиденциальность и безопасность -> Очистить историю.<br>• В основных и дополнительных настройках поставьте галочку в пункте Файлы cookie и данные сайтов.<br>После этого нажмите Удалить данные.<br><br>Ниже прилагаем видео-инструкции описанного процесса для разных браузеров:<br>Для браузера CHROME: https://youtu.be/FaGp2rRru9s<br>Для браузера OPERA: https://youtube.com/shorts/eJOxkc3Br6A?feature=share [/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Вам в жб на специалистов',
            content:
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Вы получили наказание от технического специалиста Вашего сервера.<br>Вам следует обратиться в раздел «Жалобы на технических специалистов» — в случае, если Вы не согласны с наказанием.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Ссылка на раздел, где можно оформить жалобу на технического специалиста: [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/']нажмите[/URL][/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Отказано[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Передано команде проекта',
            content:
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Ваша тема закреплена и находится на рассмотрении у команды проекта. Пожалуйста, ожидайте выноса вердикта разработчиков. Создавать новые темы с данной проблемой — не нужно.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 152, 0)][ICODE]На рассмотрении...[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: COMMAND_PREFIX,
            status: true,
          },
          {
            title: 'Проблема известна команде проекта',
            content:
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Команде проекта уже известно о данной проблеме, она обязательно будет рассмотрена и исправлена. Спасибо за Ваше обращение![/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Не начислили рейтинг за груз',
            content:
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Наша система построена следующим образом:<br>Рейтинг зависит от поломки автомобиля чем серьёзнее поломка, тем меньше будет засчитан рейтинг.<br>Поломка учитывается вся за время рейса с грузом, в независимости от того если Вы почините Ваш автомобиль, поломка до, будет учтена.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Не является багом',
            content:
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Проблема, с которой Вы столкнулись, не является недоработкой/ошибкой сервера.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Передача тестерам',
            content:
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Ваша тема передана на тестирование.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]',
            prefix: PIN_PREFIX,
            status: true,
          },
          {
            title: 'Пропали вещи с аукциона',
            content:
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Если вы выставили свои вещи на аукцион, а по истечении времени действия лота их никто не купил — воспользуйтесь командой [COLOR=rgb(251, 160, 38)]/reward[/COLOR]<br> В случае отсутствии вещей там — приложите видеофиксацию с использованием команды /time в данном обращении.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 152, 0)][ICODE]На рассмотрении...[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: PIN_PREFIX,
            status: true,
          },
          {
            title: 'Если не работают ссылки',
            content:
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]По техническим причинам данное действие невозможно, пожалуйста воспользуйтесь копированием ссылки от сюда:<br>[img]https://i.ibb.co/SX77Fgw/photo-2022-08-20-16-31-57.jpg[/img]<br>Если данный способ не помогает, то используйте сервис сокращения ссылок https://clck.ru<br> Либо попробуйте вот так:<br>1) загрузка скриншота биографии на фотохостинг<br>2) в описание прикрепить ссылку с форума<br>3) скопировать пост с фотохостинга<br><br>2 способ:<br>Сократите ссылки для Ваших скриншотов и RP биографии, сделать можно тут goo.su  также Iformation замените на русский текст, просмотрите еще текст полностью и постарайтесь уменьшить такие знаки как !<br>goo.su[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Сервер не отвечает',
            content:
           "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Если у Вас встречаются такие проблемы, как «Сервер не отвечает», не отображаются сервера в лаунчере, не удаётся выполнить вход на сайт/форум, попробуйте совершить следующие действия:<br>1) менить IP-адрес любыми средствами<br>2) Переключиться на Wi-Fi/мобильный интернет или на любую доступную сеть<br>3) Использование VPN <br>4) Перезагрузка роутера<br><br>Если методы выше не помогли, то переходим к следующим шагам:<br>1) Устанавливаем приложение «1.1.1.1: Faster & Safer Internet» Ссылка: https://clck.ru/ZP6Av и переходим в него.<br>2)Соглашаемся со всей политикой приложения.<br>3) Нажимаем на ползунок и ждем, когда текст изменится на «Подключено». <br>4) Проверяем: Отображаются ли серверы? Удается ли выполнить вход в игру? Работают ли другие источники (сайт, форум)?[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Включение продемонстрировано на видео: https://youtu.be/Wft0j69b9dk[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Вам в раздел государственных орг',
            content:
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Ваша тема не относится к техническому разделу, пожалуйста оставьте ваше заявление в соответствующем разделе [COLOR=rgb(255, 255, 255)]государственных организаций вашего сервера.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Вам в раздел криминальных орг',
            content:
           "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Ваша тема не относится к техническому разделу, пожалуйста оставьте ваше заявление в соответствующем разделе [COLOR=rgb(255, 255, 255)]криминальных организаций вашего сервера.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Вам в жб на адм',
            content:
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Вы получили наказание, которое выдал не технический специалист. Обратитесь в раздел жалобы на администрацию Вашего сервера. <br>Форма для подачи жалобы: [URL='https://wh10919.web1.maze-host.ru/index.php?threads/Правила-подачи-жалоб-на-администрацию.223/']нажмите[/URL] [/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Вам в жб на игроков',
            content:
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Данная тема не относится к техническому разделу. Данное действие было совершено игроком и нарушает правила сервера, пожалуйста обратитесь в «Жалобы на игроков» Вашего сервера.<br>Форма подачи жалобы: [URL='https://wh10919.web1.maze-host.ru/index.php?threads/Правила-подачи-жалоб-на-игроков.225/']нажмите[/URL] [/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Вам в жб на лидеров',
            content:
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Данная тема не относится к техническому разделу.<br>Данные действия были совершены лидером и нарушают регламент сервера, пожалуйста обратитесь в «Жалобы на лидеров» Вашего сервера.<br>Форма подачи жалобы: [URL='https://wh10919.web1.maze-host.ru/index.php?threads/Правила-подачи-жалоб-на-лидеров.224/']нажмите[/URL][/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Вам в обжалования(адм)',
            content:
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Вы получили наказание от администратора своего сервера. Для его снижения/обжалования обратитесь в раздел <<Обжалования>> вашего сервера.<br>Форма подачи темы: [URL='https://wh10919.web1.maze-host.ru/index.php?threads/Правила-подачи-заявки-на-обжалование-наказания.226/']нажмите[/URL][/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Кикнули за ПО',
            content:
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Уважаемый игрок, если вы были отключены от сервера Античитом<br><br>[COLOR=rgb(255, 0, 0)]Пример[/COLOR]:<br><br> [IMG]https://i.ibb.co/FXXrcVS/image.png[/IMG],<br>пожалуйста, обратите внимания на значения PacketLoss и Ping.<br><br>PacketLoss - минимальное значение 0.000000, максимальное 1.000000. При показателе, выше нуля, это означает, что у вас происходит задержка/потеря передаваемых пакетов информации на сервер. Это означает, что ваш интернет не передает достаточное количество данных из вашего устройства на наш сервер, в следствие чего система отключает вас от игрового процесса.<br><br>Ping - Чем меньше значение в данном пункте, тем быстрее передаются данные на сервер, и наоборот. Если значение выше 100, вы можете наблюдать отставания в игровом процессе из-за нестабильности интернет-соединения.<br><br>Если вы не заметили проблем в данных пунктах, скорее всего - у вас произошел скачек пинга при выполнении действия в игре, в таком случае, античит также отключает игрока из-за подозрения в использовании посторонних программ.<br><br>Решение данной проблемы: постарайтесь стабилизировать ваше интернет-соединение, при необходимости - сообщите о проблемах своему провайдеру (поставщику услуг интернета).[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Нет фото/видеофиксации',
            content:
             "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Без доказательств (в частности скриншоты или видео) – решить проблему не получится. Если доказательства найдутся - создайте новую тему, приложив доказательства с фото-хостинга: [URL='https://yapx.ru/']yapx.ru[/URL],[URL='https://imgur.com/']imgur.com[/URL],[URL='https://www.youtube.com/']youtube.com[/URL],[URL='https://imgbb.com']ImgBB.com[/URL](все кликабельно).[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Баг будет исправлен',
            content:
             "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Данная недоработка будет проверена и исправлена. Спасибо, ценим Ваш вклад в развите проекта.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(127, 255, 0)][ICODE]Рассмотрено[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: WATCHED_PREFIX,
            status: false,
          },
          {
            title: 'Ознакомьтесь с правилами восстановления',
            content:
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Пожалуйста, убедительная просьба, ознакомьтесь с правилами восстановлений: [URL='https://wh10919.web1.maze-host.ru/index.php?threads/Правила-восстановления-игровых-ценностей.289/']нажмите[/URL].<br>Вы создали тему, которая не относится к технической проблеме.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Отказано[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'По крашам/вылетам',
            content:
             "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Ваш запрос о вылетах был получен. Данные о вылетах отправляются разработчикам автоматически, поэтому дублирование их в техническом разделе не требуется.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Если возникли проблемы с подключением к игре, то в ближайшее время они будут решены. [/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Отказано[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Не выпустило из ФСИН',
            content:
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Скоро будете выпущены,ожидайте.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Хочу занять должность',
            content:
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Команда технических специалистов не решает назначение на какую-либо должность, которая присутствует на проекте.<br>Для этого существуют заявления в главном разделе Вашего игрового сервера, где Вы можете ознакомиться с открытыми должностями и формами подач.<br>Приятной игры и желаем удачи в карьерной лестнице![/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Отказано[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'По предложениям по улучшению Не использовать',
            content:
             "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Ваша тема не относится к технической проблеме, если вы хотите предложить изменения в игровом моде - обратитесь в раздел <br> [URL='https://forum.blackrussia.online/index.php?categories/Предложения-по-улучшению.656/']Предложения по улучшению → нажмите сюда[/URL][/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'Нужны все детали для прошивки',
            content:
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Для активации какой либо прошивки необходимо поставить все детали данного типа SPORT SPORT+ и т.п.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: 'По проблемам с донатом',
            content:
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Если не были зачислены BLACK COINS — вероятнее всего, была допущена ошибка при вводе реквизитов. К нашему сожалению, из-за большого количества попыток обмана, мы перестали рассматривать подобные обращения. Для проверки зачисления BLACK COINS необходимо ввести в игре команду: /donat.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Вам необходимо быть внимательными при осуществлении покупок.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Если Вы считаете, что ошибки быть не может и с момента оплаты не прошло более 14 дней — в обязательном порядке обратитесь в службу поддержки для дальнейшего решения: На сайте через виджет обратной связи или посредством месенджеров: ВКонтакте: vk.com/br_tech, Telegram: t.me/br_techBot[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: DECIDED_PREFIX,
            status: false,
          },
          {
            title: 'Исчезла статистика аккаунта',
            content:
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Аккаунт не может пропасть или аннулироваться просто так. Даже если Вы меняете ник, используете кнопки «починить игру» или «сброс настроек» - Ваш аккаунт не удаляется. Система работает иначе.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Проверьте ввод своих данных: пароль, никнейм и сервер. Зачастую игроки просто забывают ввести актуальные данные и считают, что их аккаунт был удален. Будьте внимательны![/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Как ввести никнейм (на случай, если сменили в игре, но не поменяли в клиенте): https://youtu.be/c8rhVwkoFaU [/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(127, 255, 0)][ICODE]Рассмотрено[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
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
	addAnswers();
 
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