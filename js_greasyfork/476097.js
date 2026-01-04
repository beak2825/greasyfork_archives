// ==UserScript==
// @name         Жалобы на админов CHILLI
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Скрипт только для Влада
// @author       Santa_Aelpee
// @match        https://forum.blackrussia.online/threads/*
// @icon         
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/476097/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B%20%D0%BD%D0%B0%20%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%BE%D0%B2%20CHILLI.user.js
// @updateURL https://update.greasyfork.org/scripts/476097/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B%20%D0%BD%D0%B0%20%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%BE%D0%B2%20CHILLI.meta.js
// ==/UserScript==

(function() {
    'use strict';
const UNACCСEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCСEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PINN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SPECY_PREFIX = 11;
const TEXY_PREFIX = 13;
const OJIDANIE_PREFIX = 14;
const OTKAZBIO_PREFIX = 4;
const ODOBRENOBIO_PREFIX = 8;
const NARASSMOTRENIIBIO_PREFIX = 2;
const REALIZOVANO_PREFIX = 5;
const VAJNO_PREFIX = 1;
const PREFIKS = 0;
const KACHESTVO = 15;
const RASSMOTRENO_PREFIX = 9;
const OTKAZRP_PREFIX = 4;
const ODOBRENORP_PREFIX = 8;
const NARASSMOTRENIIRP_PREFIX = 2;
const OTKAZORG_PREFIX = 4;
const ODOBRENOORG_PREFIX = 8;
const NARASSMOTRENIIORG_PREFIX = 2;
const buttons = [
     {
      title: 'Приветствие',
      content:
         '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]',
     },
     {
      title: 'На рассмотрении...',
      content:
               '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
               '[Color=#ffff00][CENTER][ICODE]На рассмотрении...[/ICODE][/CENTER][/color]' + '[CENTER]  [/CENTER]<br>' +
               '[B][CENTER]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR]',
      prefix: PINN_PREFIX,
	  status: true,
    },
    {
      title: 'Не по теме',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Ваше сообщение никоим образом не относится к предназначению данного раздела. [/CENTER] <br>" +
	    "[CENTER][COLOR=RED][B]Отказано, закрыто.[/B][/COLOR][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры на сервере CHILLI.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Не по форме',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Ваша жалоба составлена не п форме. Внимательно прочитайте правила составления жалоб - https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.3429349/ [/COLOR][/CENTER] <br>" +
        "[CENTER][COLOR=RED][B]Отказано, закрыто.[/B][/COLOR][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры на сервере CHILLI.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: 'Нет /time',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]В предоставленных доказательств отсутствует время (/time), не подлежит рассмотрению..[/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=RED][B]Отказано, закрыто.[/B][/COLOR][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры на сервере CHILLI.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'От 3-го лица',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Жалоба составлена от 3-го лица, мы не можем ее рассмотреть.[/COLOR][/CENTER] <br>" +
        "[CENTER][COLOR=RED][B]Отказано, закрыто.[/B][/COLOR][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры на сервере CHILLI.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Доки не открываются',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Предоставленные доказательства не рабочие либо же битая ссылка, пожалуйста загрузите доказательства на фото/видео хостинге.[/COLOR][/CENTER] <br>" +
	    "[CENTER][COLOR=RED][B]Отказано, закрыто.[/B][/COLOR][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры на сервере CHILLI.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нужен фрапс',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]В данной ситуации обязательно должен быть фрапс (видео фиксация) всех моментов, в противном случае жалоба будет отказано.[/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=RED][B]Отказано, закрыто.[/B][/COLOR][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры на сервере CHILLI.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Фрапс обрывается',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Ваш фрапс обрывается, пожалуйста, загрузите его на видеохостинг YouTube[/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=RED][B]Отказано, закрыто.[/B][/COLOR][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры на сервере CHILLI.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Дока-во отредактированы',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Представленные доказательства были отредактированные или в плохом качестве, пожалуйста прикрепите оригинал.[/COLOR][/CENTER] <br>" +
        "[CENTER][COLOR=RED][B]Отказано, закрыто.[/B][/COLOR][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры на сервере CHILLI.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Прошло более 48 часов',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]С момента выдачи наказания прошло более 48-ми часов, жалоба не подлежит рассмотрению.[/COLOR][/CENTER] <br>" +
	    "[CENTER][COLOR=RED][B]Отказано, закрыто.[/B][/COLOR][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры на сервере CHILLI.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Отсутствуют докозательства',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Ваша жалоба, так как доказательств на нарушение от данного администратора отсутствуют.[/COLOR][/CENTER] <br>" +
	    "[CENTER][COLOR=RED][B]Отказано, закрыто.[/B][/COLOR][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры на сервере CHILLI.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Не рабочие док-ва',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Предоставленные доказательства не рабочие либо же битая ссылка, пожалуйста загрузите доказательства на фото/видео хостинге.[/COLOR][/CENTER] <br>" +
	    "[CENTER][COLOR=RED][B]Отказано, закрыто.[/B][/COLOR][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры на сервере CHILLI.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Окно бана',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Зайдите в игру и сделайте скрин окна с баном после чего, заново напишите жалобу.[/COLOR][/CENTER] <br>" +
	    "[CENTER][COLOR=RED][B]Отказано, закрыто.[/B][/COLOR][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры на сервере CHILLI.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Бан по ip',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Смените wi-fi соединение или же ip адрес на тот с которого вы играли раньше, дело именно в нем.<br>"+
        "Перезагрузите ваш роутер или используйте VPN. [/COLOR][/CENTER] <br>" +
		 "[CENTER][COLOR=RED][B]Отказано, закрыто.[/B][/COLOR][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры на сервере CHILLI.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Дублирование',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Напоминаю, за дублирование тем ваш форумный аккаунт может быть заблокирован.[/COLOR][/CENTER] <br>" +
		 "[CENTER][COLOR=RED][B]Отказано, закрыто.[/B][/COLOR][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры на сервере CHILLI.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неверный вердикт, беседа',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Администратор будет проинструктирован по поводу проверок жалоб.[/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры на сервере CHILLI.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неверный вердикт, наказание',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Администратор получит наказание за халатное рассмотрение жалоб. [/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры на сервере CHILLI.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Строгая беседа с админом',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Ваша жалоба была одобрена и будет проведена строгая беседа с администратором. [/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры на сервере CHILLI.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Админ будет наказан',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Ваша жалоба была одобрена и администратор получит наказание.[/COLOR][/FONT][/CENTER] <br>" +
    	"[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры на сервере CHILLI.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нет нарушений',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Исходя из выше приложенных доказательств, нарушения со стороны администратора - не имееться! [/COLOR][/CENTER] <br>" +
	    "[CENTER][COLOR=RED][B]Отказано, закрыто.[/B][/COLOR][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры на сервере CHILLI.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нужна ссылка на жалобу',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Нужна ссылка на жалобу, пожалуйста предоставьте ссылку на данную жалобу. [/COLOR][/CENTER] <br>" +
		'[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры на сервере CHILLI.[/B][/COLOR][/CENTER] ',
      prefix: PINN_PREFIX,
    },
    {
      title: 'Нужен /myreports',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]В ваших доказательств отсутствует /myreports. Без данной команды жалоба не будет рассмотрена. [/COLOR][/CENTER] <br>" +
	    "[CENTER][COLOR=RED][B]Отказано, закрыто.[/B][/COLOR][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры на сервере CHILLI.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Наказание верное',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Проверив доказательства администратора, было принято решение, что наказание выдано верно. [/COLOR][/CENTER] <br>" +
		 "[CENTER][COLOR=RED][B]Отказано, закрыто.[/B][/COLOR][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры на сервере CHILLI.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Наказание по ошибке',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3] В следствие беседы с администратором, было выяснено, наказание было выдано по ошибке. [/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры на сервере CHILLI.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Админ Снят/ПСЖ',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Администратор был снят/ушел с поста администратора. [/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры на сервере CHILLI.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Рук МД',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Ваша жалоба передана Руководителю модерации Discord [/COLOR][/CENTER] <br>" +
		'[Color=#FFA500][CENTER]На рассмотрении...[/CENTER][/color]',
      prefix: PINN_PREFIX,
	  status: false,
    },
    {
      title: 'Передано Спецу и Заму Спеца',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Жалоба передана Специальному Администратору, а так же его Заместителям - @Sander_Kligan / @Clarence Crown / @Dmitry Dmitrich / @Myron_Capone, пожалуйста ожидайте ответа. [/COLOR][/CENTER] <br>" +
		'[Color=#FFA500][CENTER]На рассмотрении...[/CENTER][/color]',
      prefix: PINN_PREFIX,
	  status: false,
    },
    {
      title: 'Отказ (Соц Сети)',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Ваши доказательства размещенны в социальных сетях, загрузите их на фото-хостинги, такие как Imgur или PostIMG, или видео-хостинги, такие как Yandex, Google или YouTube, а также на другие доступные сервисы..[/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=RED][B]Отказано, закрыто.[/B][/COLOR][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры на сервере CHILLI.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: '| В Тех раздел |',
	  content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
		"[COLOR=rgb(255, 255, 255)][B][SIZE=3]Пожалуйста составьте свою жалобу в Технический раздел сервера : [URL= https://forum.blackrussia.online/index.php?forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-chilli.1007/]*Нажмите сюда*[/URL]<br>"+
		"[CENTER][COLOR=RED][B]Отказано, закрыто.[/B][/COLOR][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры на сервере CHILLI.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
  {
	  title: '| В ЖБ на теха |',
	  content:
		'[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
		"[COLOR=rgb(255, 255, 255)][B][SIZE=3]Вам было выдано наказания Техническим специалистом, вы можете написать жалобу здесь : [URL= https://forum.blackrussia.online/index.php?forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9621-chilli.1202/]*Нажмите сюда*[/URL]<br>"+
		"[CENTER][COLOR=RED][B]Отказано, закрыто.[/B][/COLOR][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры на сервере CHILLI.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
{
      title: 'В обжалования',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Обратитесь в раздел обжалований наказаний.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[CENTER][COLOR=RED][B]Отказано, закрыто.[/B][/COLOR][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры на сервере CHILLI.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
  ];

  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton('На рассмотрение', 'pin');
    addButton('КП', 'teamProject');
    addButton('Га', 'Ga');
    addButton('Спецу', 'Spec');
    addButton('Ответы', 'selectAnswer');

    // Поиск информации о теме
    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(PINN_PREFIX, true));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));

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