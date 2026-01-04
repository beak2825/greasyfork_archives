// ==UserScript==
// @name         Black Russia | BLUE - Скрипт для Кураторов Форума
// @namespace    https://forum.blackrussia.online
// @version      3.1
// @description  Скрипт для Кураторов Форума
// @author       Bruno Walker
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license 	 MIT
// @collaborator none
// @icon   https://phonoteka.org/uploads/posts/2023-02/1675403979_phonoteka-org-p-blek-rasha-oboi-vkontakte-6.jpg
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/472352/Black%20Russia%20%7C%20BLUE%20-%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/472352/Black%20Russia%20%7C%20BLUE%20-%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0.meta.js
// ==/UserScript==

(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RASSMOTRENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to Chief Administrator
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to Project Team
const WATCHED_PREFIX = 9;  // Prefix that will be set when thread reviewed by
const CLOSE_PREFIX = 7; // Prefix that will be set when thread closed
const TEX_PREFIX = 13; // Prefix that will be set when thread send to Technical Specialist
const SPEC_PREFIX = 11; // Prefix that will be set when thread send to Special Administrator
const buttons = [
    {
      title: '----------  Передать жалобу  -----------------------------------------------------------------------------------------------------------------------',
    },
     {
	  title: `Отправить на рассмотрение`,
	  content:
		"[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>" +
		"[B][CENTER]Ваша жалоба взята на рассмотрение.[/CENTER][/B]<br>" +
        "[B][CENTER]Ожидайте, пожалуйста, ответа от администрации и не нужно создавать копии этой темы.[/CENTER][/B]<br><br>" +
        '[B][CENTER][COLOR=yellow][ICODE]На рассмотрении.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
	     prefix: PIN_PREFIX,
	     status: true,
	},
     {
      title: 'ГА',
      content:
	"[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ваша жалоба передана на рассмотрение Главному Администратору сервера.[/CENTER][/B]<br>" +
		'[B][CENTER]Не нужно создавать копии данной темы.[/CENTER][/B]<br>' +
		"[B][CENTER]В противном случае Вам будет выдана блокировка ФА.[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: GA_PREFIX,
	  status: true,
    },
	 {
      title: 'Теху',
      content:
	"[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ваша жалоба передана на рассмотрение Техническому Специалисту сервера.[/CENTER][/B]<br>" +
		'[B][CENTER]Не нужно создавать копии данной темы.[/CENTER][/B]<br>' +
		"[B][CENTER]В противном случае Вам будет выдана блокировка ФА.[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: TEX_PREFIX,
	  status: false,
    },
	 {
      title: 'Команде Проекта',
      content:
	"[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ваша жалоба передана на рассмотрение Команде Проекта.[/CENTER][/B]<br>" +
		'[B][CENTER]Не нужно создавать копии данной темы.[/CENTER][/B]<br>' +
		"[B][CENTER]В противном случае Вам будет выдана блокировка ФА.[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: COMMAND_PREFIX,
	  status: true,
	},
  	 {
      title: 'Спец Адм',
      content:
	"[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ваша жалоба передана на рассмотрение Специальному Администратору или же его Заместителю.[/CENTER][/B]<br>" +
		'[B][CENTER]Не нужно создавать копии данной темы.[/CENTER][/B]<br>' +
		"[B][CENTER]В противном случае Вам будет выдана блокировка ФА.[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: SPEC_PREFIX,
	  status: true,
	},
     {
	  title: '----------  Перенаправить  ---------------------------------------------------------------------------------------------------------------------------',
	},
     {
      title: 'Жалобы на Адм',
	  content:
	    "[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Вы ошиблись разделом, подайте жалобу в раздел Жалобы на Администрацию.[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
     {
      title: 'Жалобы на Агентов Поддержки',
	  content:
	    "[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Вы ошиблись разделом, подайте жалобу в раздел Жалобы на Агентов Поддержки.[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	 {
      title: 'Жалобы на Лд',
	  content:
	    "[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Вы ошиблись разделом, подайте жалобу в раздел Жалобы на Лидеров.[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
     {
      title: 'Жалобы на С-ГОСС',
	  content:
	    "[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Вы ошиблись разделом, подайте жалобу в раздел Жалобы на сотрудников Государственных организаций.[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
     {
      title: 'Жалобы на С-ОПГ',
	  content:
	    "[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Вы ошиблись разделом, подайте жалобу в раздел Жалобы на сотрудников Криминальных организаций.[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	 {
      title: 'РП Биографии',
	  content:
	    "[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Вы ошиблись разделом, напишите эту тему в раздел РП Биографии.[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	 {
      title: 'РП Ситуации',
	  content:
	    "[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Вы ошиблись разделом, напишите эту тему в раздел РП Ситуации.[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
     {
      title: 'РП Организации',
      content:
        "[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Вы ошиблись разделом, напишите эту тему в раздел Неофициальные РП Организации.[/CENTER][/B]<br><br>" +
        '[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
      prefix: CLOSE_PREFIX,
      status: false,
    },
     {
      title: 'Обжалование',
	  content:
	    "[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Вы ошиблись разделом, подайте жалобу в Обжалование Наказаний.[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	 {
      title: 'Ошиблись сервером',
	  content:
	    "[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Вы ошиблись сервером, подайте жалобу в правильный на эту тему раздел вашего сервера.[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
     {
	  title: '----------  ЖБ на игроков  ----------------------------------------------------------------------------------------------------------------------------',
	},
     {
      title: 'Игрок будет наказан',
	  content:
	    "[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Игрок будет наказан.[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
     {
      title: 'Долг',
	  content:
	    "[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Передача денег игроку должна происходить через банковскую систему.[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
     {
      title: 'Нет условий сделки',
	  content:
	    "[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]На ваших доказательствах отсувствуют условия сделки.[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
     {
      title: 'Не совпадает NickName',
	  content:
	    "[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]В вашей жалобе NickName нарушителя не совпадает как на доказательствах.[/CENTER][/B]<br>" +
        "[B][CENTER]Пожалуйста ознакомтесь с формой подачи.[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
     {
      title: 'Отсутствует /time',
	  content:
	    "[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]В вашей жалобе отсутствует /time.[/CENTER][/B]<br>" +
        "[B][CENTER]Пожалуйста ознакомтесь с правилами подачи.[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
      title: 'Нету time кодов',
	  content:
	    "[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]В вашей жалобе отсуствуют тайм коды.[/CENTER][/B]<br>" +
        "[B][CENTER]Укажите тайм коды и создайте новую жалобу.[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
      title: 'От третьего лица',
	  content:
	    "[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации).[/CENTER][/B]<br>" +
        "[B][CENTER]Пожалуйста ознакомтесь с правилами подачи.[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
      title: 'Более 3 дней',
	  content:
	    "[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения со стороны игрока сервера.[/CENTER][/B]<br>" +
        "[B][CENTER]Пожалуйста ознакомтесь с правилами подачи.[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
      title: 'Не по форме',
	  content:
	    "[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ваша жалоба состоит не по форме.[/CENTER][/B]<br>" +
        "[B][CENTER]Пожалуйста ознакомтесь с формой подачи.[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
      title: 'Нет доказательств',
	  content:
	    "[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>" +
		"[B][CENTER]Вы не предоставили доказательств на нарушение данного игрока.[/CENTER][/B]<br>" +
        "[B][CENTER]Просьба написать новую жалобу и предоставить доказательства в виде скриншота/фрапса.[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
      title: 'Нет доступа к доказательствам',
	  content:
	    "[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>" +
		"[B][CENTER]К Вашим доказательствам нет доступа.[/CENTER][/B]<br>"+
        "[B][CENTER]Просьба написать новую жалобу и предоставить доступ к просмотру доказательств.[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
      title: 'Нарушений не найдено',
	  content:
	    "[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Нарушений со стороны игрока не найдено.[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
      title: 'Док-ва через соц. сети',
	  content:
	    "[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Доказательства в социальных сетях и т.д. не принимаются, загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.[/CENTER][/B]<br>" +
        "[B][CENTER]Пожалуйста ознакомтесь с правилами подачи.[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
      title: 'Недостаточно докв',
	  content:
	    "[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Недостаточно доказательств на нарушение от данного игрока.[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
      title: 'Дублирование темы',
	  content:
	    "[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ранее вам уже был дан корректный ответ на подобную жалобу, просьба не создавать дубликаты этой темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
      title: 'Нужен фрапс',
	  content:
	    "[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]В таких случаях нужна видеофиксация нарушения.[/CENTER][/B]<br>" +
        "[B][CENTER]Пожалуйста ознакомтесь с правилами подачи.[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
        title: 'Док-ва отредактированы ',
	  content:
	    "[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Доказательства были подвергнуты редактированию - следовательно, рассмотрению не подлежит.[/CENTER][/B]<br>" +
        "[B][CENTER]Пожалуйста ознакомтесь с правилами подачи.[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
     {
	  title: '----------  РП Биографии  -----------------------------------------------------------------------------------------------------------------------------',
	},
    {
      title: 'Одобрено',
      content:
		"[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Биография получает статус:<br><br>" +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,

      prefix: ACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Отказано',
      content:
		"[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Биография получает статус:<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
		"[B][CENTER]Причиной могло послужить любое нарушение правил подачи РП Биографии.<br>" +
        "[B][CENTER]Пожалуйста ознакомтесь с правилами подачи.<br><br>" +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'На доработке',
      content:
	            "[CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		        "[B][CENTER]В вашей РП Биографии мало информации.<br>" +
		        '[B][CENTER]У вас есть 24 часа на исправление.<br>' +
                "[B][CENTER]Внимательно прочтите текст, и добавьте все необходимое.<br>" +
		        "[B][CENTER]В противном случае РП Биография будет отказана.<br><br>" +
		        '[B][CENTER][COLOR=yellow][ICODE]На рассмотрении.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: PIN_PREFIX,
	  status: null,
    },
     {
      title: 'Возраст не совпадает',
      content:
		"[CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Биография получает статус:[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
		"[B][CENTER]Год рождения и возраст не совпадают.<br><br>" +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Возраст не подходит',
      content:
		"[CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Биография получает статус:[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
		"[B][CENTER]Минимальный возраст в РП Биографии - 18 лет, максимальный - 65 лет.<br><br>" +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Не по форме',
      content:
		"[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Биография получает статус:[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
		"[B][CENTER]Причиной послужило написание РП Биографии не по форме.[/CENTER][/B]<br>" +
        "[B][CENTER]Пожалуйста ознакомтесь с формой подачи.[/CENTER][/B]<br><br>" +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Не по форме заговолок',
      content:
		"[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Биография получает статус:[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
		"[B][CENTER]Причиной послужило написание заговолка РП Биографии не по форме.[/CENTER][/B]<br>" +
        "[B][CENTER]Пожалуйста ознакомтесь с формой подачи.[/CENTER][/B]<br><br>" +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Ошибка в заголовке',
      content:
		"[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Биография получает статус:[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
		"[B][CENTER]В вашем заголовке ошибка, создайте новую РП Биографию без ошибок.[/CENTER][/B]<br>" +
        "[B][CENTER]Пожалуйста ознакомтесь с формой подачи.[/CENTER][/B]<br><br>" +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'От 3-го лица',
      content:
		"[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Биография получает статус:[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
		"[B][CENTER]Причиной послужило написание РП Биографии от 3-го лица.[/CENTER][/B]<br>" +
        "[B][CENTER]Пожалуйста ознакомтесь с правилами подачи.[/CENTER][/B]<br><br>" +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Украдена',
      content:
		"[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Биография получает статус:[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
		"[B][CENTER]Причиной послужило что РП Биография украдена.[/CENTER][/B]<br><br>" +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Супергерой',
      content:
		"[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Биография получает статус:[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
		"[B][CENTER]Причиной послужило приписание суперспособности своему персонажу / темы.[/CENTER][/B]<br><br>" +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Дублирование',
      content:
		"[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Биография получает статус:[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
		"[B][CENTER]Причиной послужило дублирование РП Биографии.[/CENTER][/B]<br><br>" +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Ошибки в словах',
      content:
		"[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Биография получает статус:[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
		"[B][CENTER]Причиной послужило написание РП Биографии с грамматическими / орфографическими ошибками.[/CENTER][/B]<br>" +
        "[B][CENTER]Пожалуйста ознакомтесь с правилами подачи.[/CENTER][/B]<br><br>" +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },

	 {
      title: '2 Био на 1 Акк',
      content:
		"[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Биография получает статус:[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
		"[B][CENTER]Причиной послужило написание второй Биографии на один игровой аккаунт, что же запрещено правилами написаний РП Биографий.[/CENTER][/B]<br>" +
        "[B][CENTER]Пожалуйста ознакомтесь с правилами подачи.[/CENTER][/B]<br><br>" +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Мало текста',
      content:
		"[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Биография получает статус:[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
		"[B][CENTER]Причиной послужило то, что Вы написали мало текста в своей РП Биографии.[/CENTER][/B]<br><br>" +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
	  title: '----------  РП Ситуации  -------------------------------------------------------------------------------------------------------------------------------',
	},
	 {
      title: 'Одобрено',
      content:
		"[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Ситуация получает статус:[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Отказано',
      content:
		"[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Ситуация получает статус:[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
		"[B][CENTER]Причиной могло послужить любое нарушение Правил Написания РП Ситуации.<br><br>" +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'На доработке',
      content:
	            "[CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		        "[B][CENTER]В вашей РП Ситуации мало информации.<br>" +
		        '[B][CENTER]У вас есть 24 часа на исправление.<br>' +
                "[B][CENTER]Внимательно прочтите текст, и добавьте все необходимое.<br>" +
		        "[B][CENTER]В противном случае РП Ситуация будет отказана.<br><br>" +
		        '[B][CENTER][COLOR=yellow][ICODE]На рассмотрении.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: PIN_PREFIX,
	  status: null,
    },
     {
      title: 'Не по форме',
      content:
		"[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Ситуация получает статус:[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
		"[B][CENTER]Причиной послужило написание РП Ситуации не по форме.<br>" +
        "[B][CENTER]Пожалуйста ознакомтесь с формой подачи.<br><br>" +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Копипаст',
      content:
		"[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Ситуация получает статус:[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
		"[B][CENTER]Причиной послужило копирование текста / темы.<br><br>" +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Дублирование',
      content:
		"[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Ситуация получает статус:[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
		"[B][CENTER]Причиной послужило дублирование темы.<br><br>" +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: '----------  РП организации  --------------------------------------------------------------------------------------------------------------------------',
	},
	 {
      title: 'Одобрено',
      content:
		"[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Организация получает статус:[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Отказано',
      content:
		"[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Организация получает статус:[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
		"[B][CENTER]Причиной могло послужить любое нарушение правил написания РП организации.[/CENTER][/B]<br>" +
        "[B][CENTER]Пожалуйста ознакомтесь с правилами подачи.[/CENTER][/B]<br><br>" +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'На доработке',
      content:
	            "[CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		        "[B][CENTER]В вашей РП Организации мало информации.[/CENTER][/B]<br>" +
		        '[B][CENTER]У вас есть 24 часа на исправление.[/CENTER][/B]<br>' +
                "[B][CENTER]Внимательно прочтите текст, и добавьте все необходимое.[/CENTER][/B]<br>" +
		        "[B][CENTER]В противном случае РП организация будет отказана.<br><br>" +
		        '[B][CENTER][COLOR=yellow][ICODE]На рассмотрении.[/ICODE][/COLOR][/CENTER][/B]<br><br>'+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: PIN_PREFIX,
	  status: null,
    },
     {
      title: 'Не по форме',
      content:
		"[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Оганизация получает статус:[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
		"[B][CENTER]Причиной послужило написание РП организации не по форме.[/CENTER][/B]<br>" +
        "[B][CENTER]Пожалуйста ознакомтесь с формой подачи.[/CENTER][/B]<br><br>" +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Не по форме Заговолок',
      content:
		"[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Организация получает статус:[/CENTER][/B]<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]<br><br>' +
		"[B][CENTER]Причиной послужило написание заговолка РП организации не по форме.[/CENTER][/B]<br>" +
        "[B][CENTER]Пожалуйста ознакомтесь с формой подачи.[/CENTER][/B]<br><br>" +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «BLUE» [/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
  ];

$(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $(`body`).append(`<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`);

        // Добавление кнопок при загрузке страницы
         addButton(`Меню скрипта`, `selectAnswer`);
        // Поиск информации о теме
        const threadData = getThreadData();

        $(`button#pin`).click(() => editThreadData(PIN_PREFIX, true));
        $(`button#accepted`).click(() => editThreadData(ACCEPT_PREFIX, false));
        $(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true));
        $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
        $(`button#watched`).click(() => editThreadData(WATCHED_PREFIX, false));
$(`button#closed`).click(() => editThreadData(CLOSE_PREFIX, false));
         $(`button#specialAdmin`).click(() => editThreadData(SPECIAL_PREFIX, true));
$(`button#mainAdmin`).click(() => editThreadData(GA_PREFIX, true));
$(`button#techspec`).click(() => editThreadData( TECH_PREFIX , true));


        $(`button#selectAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, `Выберите ответ:`);
            buttons.forEach((btn, id) => {
                if (id > 0) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
                }
            });
        });
    });

    function addButton(name, id) {
        $(`.button--icon--reply`).before(
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
            .join(``)}</div>`;
    }

    function pasteContent(id, data = {}, send = false) {
        const template = Handlebars.compile(buttons[id].content);
        if ($(`.fr-element.fr-view p`).text() === ``) $(`.fr-element.fr-view p`).empty();

        $(`span.fr-placeholder`).empty();
        $(`div.fr-element.fr-view p`).append(template(data));
        $(`a.overlay-titleCloser`).trigger(`click`);

        if (send == true) {
            editThreadData(buttons[id].prefix, buttons[id].status);
            $(`.button--icon.button--icon--reply.rippleButton`).trigger(`click`);
        }
    }

    async function getThreadData() {
        const authorID = $(`a.username`)[0].attributes[`data-user-id`].nodeValue;
        const authorName = $(`a.username`).html();
        const hours = new Date().getHours();
        const greeting = 4 < hours && hours <= 11
            ? `Здравствуйте`
            : 11 < hours && hours <= 15
                ? `Здравствуйте`
                : 15 < hours && hours <= 21
                    ? `Здравствуйте`
                    : `Здравствуйте`

        return {
            user: {
                id: authorID,
                name: authorName,
                mention: `[USER=${authorID}]${authorName}[/USER]`,
            },
            greeting: greeting
        };
    }

    function editThreadData(prefix, pin = false) {
        // Получаем заголовок темы, так как он необходим при запросе
        const threadTitle = $(`.p-title-value`)[0].lastChild.textContent;

        if (pin == false) {
            fetch(`${document.URL}edit`, {
                method: `POST`,
                body: getFormData({
                    prefix_id: prefix,
                    title: threadTitle,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: `json`,
                }),
            }).then(() => location.reload());
        }
        if (pin == true) {
            fetch(`${document.URL}edit`, {
                method: `POST`,
                body: getFormData({
                    prefix_id: prefix,
                    title: threadTitle,
                    sticky: 1,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: `json`,
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