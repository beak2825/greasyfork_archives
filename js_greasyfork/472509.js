// ==UserScript==
// @name         MATRP 14 | Скрипт для Администрации
// @namespace    https://https://forum.matrp.ru
// @version      1.1
// @description  Скрипт для Администрации 14го сервера
// @author       Emiliano Jimenez | Владимир Авдеев
// @match        https://forum.matrp.ru/index.php?threads/*
// @include      https://forum.matrp.ru/index.php?threads/
// @grant        none
// @license 	 MIT
// @collaborator jimenez
// @icon https://icons.iconarchive.com/icons/thesquid.ink/free-flat-sample/128/support-icon.png
// @downloadURL https://update.greasyfork.org/scripts/472509/MATRP%2014%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%90%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/472509/MATRP%2014%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%90%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D0%B8.meta.js
// ==/UserScript==

(function () {
  'use strict';
const buttons = [
	{
	  title: '----- | Свой ответ | -----',
      content:
'[CENTER][B][SIZE=4][FONT=book antiqua][IMG]https://i.yapx.ru/WVYAv.jpg[/IMG][/FONT][/SIZE][/B]<br>' +
"[SIZE=4][FONT=book antiqua][B][IMG]https://i.yapx.ru/WVYLq.png[/IMG]<br><br>" +
"Ваштекст<br><br>" +
"[IMG]https://i.yapx.ru/WVYLq.png[/IMG][/B][/FONT][/SIZE]<br><br>" +
"[SIZE=5][FONT=book antiqua][B]Полезные ссылки сервера:[/B][/FONT][/SIZE]<br><br>" +
"[SIZE=4][FONT=book antiqua][B]Официальная беседа игроков [COLOR=rgb(26, 188, 156)]сервера [/COLOR]ВКонтакте: [/B][/FONT][/SIZE][URL='https://vk.me/join/YaHVfONzNPQ6gtWDz9N1v6iBeQ3h1wcKgrI='][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br>" +
"Официальный Discord канал [COLOR=rgb(26, 188, 156)]сервера[/COLOR]: [/B][/FONT][/SIZE][URL='https://discord.gg/5cxxYn86hB'][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br>" +
"Официальная группа ВКонтакте [COLOR=rgb(26, 188, 156)]сервера[/COLOR]: [/B][/FONT][/SIZE][URL='https://vk.com/matrp_srv14'][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br>" +
"Информация о управляющей Администрации [COLOR=rgb(26, 188, 156)]сервера[/COLOR]: [/B][/FONT][/SIZE][URL='https://docs.google.com/spreadsheets/d/1OxAMj7FGQItNli_sSj15JR_M4chrZsdMquaXW8k68y0/edit?usp=sharing'][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br><br>" +
"[IMG]https://i.yapx.ru/WVYLq.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br><br>" +
'[RIGHT][B][SIZE=4][FONT=book antiqua]С уважением [COLOR=rgb(26, 188, 156)]Администрация 14-го сервера[/COLOR].[/FONT][/SIZE][/B][/RIGHT]',
        status: false,
    },
    {
      title: '---------------------------------------------------------------------------| Ответы на жалобы |---------------------------------------------------------------------------',
	},
    {
      title: 'Жалоба не по правилам',
      content:
'[CENTER][B][SIZE=4][FONT=book antiqua][IMG]https://i.yapx.ru/WVYAv.jpg[/IMG][/FONT][/SIZE][/B]<br>' +
"[SIZE=4][FONT=book antiqua][B][IMG]https://i.yapx.ru/WVYLq.png[/IMG]<br><br>" +
"[CENTER][B]Приветствую, уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"Важа жалоба составлена не по форме или же не соответствует правилам подачи. Ознакомьтесь с правила подачи жалоб а после соблюдая все правила отправьте жалобу повторно. Правила подачи - [URL='https://forum.matrp.ru/index.php?threads/Правила-подачи-жалобы.66297/']Кликабельно[/URL].<br>" +
"[COLOR=rgb(255, 0, 0)]Отказано[/COLOR], рассмотрено.<br><br>" +
"[IMG]https://i.yapx.ru/WVYLq.png[/IMG][/B][/FONT][/SIZE]<br><br>" +
"[SIZE=5][FONT=book antiqua][B]Полезные ссылки сервера:[/B][/FONT][/SIZE]<br><br>" +
"[SIZE=4][FONT=book antiqua][B]Официальная беседа игроков [COLOR=rgb(26, 188, 156)]сервера [/COLOR]ВКонтакте: [/B][/FONT][/SIZE][URL='https://vk.me/join/YaHVfONzNPQ6gtWDz9N1v6iBeQ3h1wcKgrI='][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br>" +
"Официальный Discord канал [COLOR=rgb(26, 188, 156)]сервера[/COLOR]: [/B][/FONT][/SIZE][URL='https://discord.gg/5cxxYn86hB'][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br>" +
"Официальная группа ВКонтакте [COLOR=rgb(26, 188, 156)]сервера[/COLOR]: [/B][/FONT][/SIZE][URL='https://vk.com/matrp_srv14'][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br>" +
"Информация о управляющей Администрации [COLOR=rgb(26, 188, 156)]сервера[/COLOR]: [/B][/FONT][/SIZE][URL='https://docs.google.com/spreadsheets/d/1OxAMj7FGQItNli_sSj15JR_M4chrZsdMquaXW8k68y0/edit?usp=sharing'][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br><br>" +
"[IMG]https://i.yapx.ru/WVYLq.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br><br>" +
'[RIGHT][B][SIZE=4][FONT=book antiqua]С уважением [COLOR=rgb(26, 188, 156)]Администрация 14-го сервера[/COLOR].[/FONT][/SIZE][/B][/RIGHT]',
	},
    {
      title: 'Не достаточно доказательств',
      content:
'[CENTER][B][SIZE=4][FONT=book antiqua][IMG]https://i.yapx.ru/WVYAv.jpg[/IMG][/FONT][/SIZE][/B]<br>' +
"[SIZE=4][FONT=book antiqua][B][IMG]https://i.yapx.ru/WVYLq.png[/IMG]<br><br>" +
"[CENTER][B]Приветствую, уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"Ваших доказательств не достаточно для выдачи наказания игроку.<br>" +
"[COLOR=rgb(255, 0, 0)]Отказано[/COLOR], рассмотрено.<br><br>" +
"[IMG]https://i.yapx.ru/WVYLq.png[/IMG][/B][/FONT][/SIZE]<br><br>" +
"[SIZE=5][FONT=book antiqua][B]Полезные ссылки сервера:[/B][/FONT][/SIZE]<br><br>" +
"[SIZE=4][FONT=book antiqua][B]Официальная беседа игроков [COLOR=rgb(26, 188, 156)]сервера [/COLOR]ВКонтакте: [/B][/FONT][/SIZE][URL='https://vk.me/join/YaHVfONzNPQ6gtWDz9N1v6iBeQ3h1wcKgrI='][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br>" +
"Официальный Discord канал [COLOR=rgb(26, 188, 156)]сервера[/COLOR]: [/B][/FONT][/SIZE][URL='https://discord.gg/5cxxYn86hB'][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br>" +
"Официальная группа ВКонтакте [COLOR=rgb(26, 188, 156)]сервера[/COLOR]: [/B][/FONT][/SIZE][URL='https://vk.com/matrp_srv14'][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br>" +
"Информация о управляющей Администрации [COLOR=rgb(26, 188, 156)]сервера[/COLOR]: [/B][/FONT][/SIZE][URL='https://docs.google.com/spreadsheets/d/1OxAMj7FGQItNli_sSj15JR_M4chrZsdMquaXW8k68y0/edit?usp=sharing'][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br><br>" +
"[IMG]https://i.yapx.ru/WVYLq.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br><br>" +
'[RIGHT][B][SIZE=4][FONT=book antiqua]С уважением [COLOR=rgb(26, 188, 156)]Администрация 14-го сервера[/COLOR].[/FONT][/SIZE][/B][/RIGHT]',
	},
    {
      title: 'Одобрено',
      content:
'[CENTER][B][SIZE=4][FONT=book antiqua][IMG]https://i.yapx.ru/WVYAv.jpg[/IMG][/FONT][/SIZE][/B]<br>' +
"[SIZE=4][FONT=book antiqua][B][IMG]https://i.yapx.ru/WVYLq.png[/IMG]<br><br>" +
"[CENTER][B]Приветствую, уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"Ваша жалоба принята, игрок будет наказан.<br>" +
"[COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], рассмотрено.<br><br>" +
"[IMG]https://i.yapx.ru/WVYLq.png[/IMG][/B][/FONT][/SIZE]<br><br>" +
"[SIZE=5][FONT=book antiqua][B]Полезные ссылки сервера:[/B][/FONT][/SIZE]<br><br>" +
"[SIZE=4][FONT=book antiqua][B]Официальная беседа игроков [COLOR=rgb(26, 188, 156)]сервера [/COLOR]ВКонтакте: [/B][/FONT][/SIZE][URL='https://vk.me/join/YaHVfONzNPQ6gtWDz9N1v6iBeQ3h1wcKgrI='][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br>" +
"Официальный Discord канал [COLOR=rgb(26, 188, 156)]сервера[/COLOR]: [/B][/FONT][/SIZE][URL='https://discord.gg/5cxxYn86hB'][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br>" +
"Официальная группа ВКонтакте [COLOR=rgb(26, 188, 156)]сервера[/COLOR]: [/B][/FONT][/SIZE][URL='https://vk.com/matrp_srv14'][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br>" +
"Информация о управляющей Администрации [COLOR=rgb(26, 188, 156)]сервера[/COLOR]: [/B][/FONT][/SIZE][URL='https://docs.google.com/spreadsheets/d/1OxAMj7FGQItNli_sSj15JR_M4chrZsdMquaXW8k68y0/edit?usp=sharing'][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br><br>" +
"[IMG]https://i.yapx.ru/WVYLq.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br><br>" +
'[RIGHT][B][SIZE=4][FONT=book antiqua]С уважением [COLOR=rgb(26, 188, 156)]Администрация 14-го сервера[/COLOR].[/FONT][/SIZE][/B][/RIGHT]',
	},
    {
      title: 'На рассмотрение',
      content:
'[CENTER][B][SIZE=4][FONT=book antiqua][IMG]https://i.yapx.ru/WVYAv.jpg[/IMG][/FONT][/SIZE][/B]<br>' +
"[SIZE=4][FONT=book antiqua][B][IMG]https://i.yapx.ru/WVYLq.png[/IMG]<br><br>" +
"[CENTER][B]Приветствую, уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"Ваша тема передана на рассмотрение, ожидайте ответа Администратора. Не создавайте дубликаты данной темы!<br>" +
"[COLOR=rgb(250, 197, 28)]На рассмотрении[/COLOR].<br><br>" +
"[IMG]https://i.yapx.ru/WVYLq.png[/IMG][/B][/FONT][/SIZE]<br><br>" +
"[SIZE=5][FONT=book antiqua][B]Полезные ссылки сервера:[/B][/FONT][/SIZE]<br><br>" +
"[SIZE=4][FONT=book antiqua][B]Официальная беседа игроков [COLOR=rgb(26, 188, 156)]сервера [/COLOR]ВКонтакте: [/B][/FONT][/SIZE][URL='https://vk.me/join/YaHVfONzNPQ6gtWDz9N1v6iBeQ3h1wcKgrI='][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br>" +
"Официальный Discord канал [COLOR=rgb(26, 188, 156)]сервера[/COLOR]: [/B][/FONT][/SIZE][URL='https://discord.gg/5cxxYn86hB'][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br>" +
"Официальная группа ВКонтакте [COLOR=rgb(26, 188, 156)]сервера[/COLOR]: [/B][/FONT][/SIZE][URL='https://vk.com/matrp_srv14'][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br>" +
"Информация о управляющей Администрации [COLOR=rgb(26, 188, 156)]сервера[/COLOR]: [/B][/FONT][/SIZE][URL='https://docs.google.com/spreadsheets/d/1OxAMj7FGQItNli_sSj15JR_M4chrZsdMquaXW8k68y0/edit?usp=sharing'][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br><br>" +
"[IMG]https://i.yapx.ru/WVYLq.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br><br>" +
'[RIGHT][B][SIZE=4][FONT=book antiqua]С уважением [COLOR=rgb(26, 188, 156)]Администрация 14-го сервера[/COLOR].[/FONT][/SIZE][/B][/RIGHT]',
	},
    {
      title: 'Доки не доступны',
      content:
'[CENTER][B][SIZE=4][FONT=book antiqua][IMG]https://i.yapx.ru/WVYAv.jpg[/IMG][/FONT][/SIZE][/B]<br>' +
"[SIZE=4][FONT=book antiqua][B][IMG]https://i.yapx.ru/WVYLq.png[/IMG]<br><br>" +
"[CENTER][B]Приветствую, уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"Ваши доказательства не доступны, загрузите их в открытый доступ, после чего отправьте жалобу повторно.<br>" +
"[COLOR=rgb(255, 0, 0)]Отказано[/COLOR], рассмотрено.<br><br>" +
"[IMG]https://i.yapx.ru/WVYLq.png[/IMG][/B][/FONT][/SIZE]<br><br>" +
"[SIZE=5][FONT=book antiqua][B]Полезные ссылки сервера:[/B][/FONT][/SIZE]<br><br>" +
"[SIZE=4][FONT=book antiqua][B]Официальная беседа игроков [COLOR=rgb(26, 188, 156)]сервера [/COLOR]ВКонтакте: [/B][/FONT][/SIZE][URL='https://vk.me/join/YaHVfONzNPQ6gtWDz9N1v6iBeQ3h1wcKgrI='][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br>" +
"Официальный Discord канал [COLOR=rgb(26, 188, 156)]сервера[/COLOR]: [/B][/FONT][/SIZE][URL='https://discord.gg/5cxxYn86hB'][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br>" +
"Официальная группа ВКонтакте [COLOR=rgb(26, 188, 156)]сервера[/COLOR]: [/B][/FONT][/SIZE][URL='https://vk.com/matrp_srv14'][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br>" +
"Информация о управляющей Администрации [COLOR=rgb(26, 188, 156)]сервера[/COLOR]: [/B][/FONT][/SIZE][URL='https://docs.google.com/spreadsheets/d/1OxAMj7FGQItNli_sSj15JR_M4chrZsdMquaXW8k68y0/edit?usp=sharing'][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br><br>" +
"[IMG]https://i.yapx.ru/WVYLq.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br><br>" +
'[RIGHT][B][SIZE=4][FONT=book antiqua]С уважением [COLOR=rgb(26, 188, 156)]Администрация 14-го сервера[/COLOR].[/FONT][/SIZE][/B][/RIGHT]',
    },
    {
      title: 'Доки в плохом качестве',
      content:
'[CENTER][B][SIZE=4][FONT=book antiqua][IMG]https://i.yapx.ru/WVYAv.jpg[/IMG][/FONT][/SIZE][/B]<br>' +
"[SIZE=4][FONT=book antiqua][B][IMG]https://i.yapx.ru/WVYLq.png[/IMG]<br><br>" +
"[CENTER][B]Приветствую, уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"Ваши доказательства в низком качестве, рассмотреть на них что либо не возможно. Предоставьте доказательства в хорошем качестве, в новой жалобе.<br>" +
"[COLOR=rgb(255, 0, 0)]Отказано[/COLOR], рассмотрено.<br><br>" +
"[IMG]https://i.yapx.ru/WVYLq.png[/IMG][/B][/FONT][/SIZE]<br><br>" +
"[SIZE=5][FONT=book antiqua][B]Полезные ссылки сервера:[/B][/FONT][/SIZE]<br><br>" +
"[SIZE=4][FONT=book antiqua][B]Официальная беседа игроков [COLOR=rgb(26, 188, 156)]сервера [/COLOR]ВКонтакте: [/B][/FONT][/SIZE][URL='https://vk.me/join/YaHVfONzNPQ6gtWDz9N1v6iBeQ3h1wcKgrI='][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br>" +
"Официальный Discord канал [COLOR=rgb(26, 188, 156)]сервера[/COLOR]: [/B][/FONT][/SIZE][URL='https://discord.gg/5cxxYn86hB'][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br>" +
"Официальная группа ВКонтакте [COLOR=rgb(26, 188, 156)]сервера[/COLOR]: [/B][/FONT][/SIZE][URL='https://vk.com/matrp_srv14'][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br>" +
"Информация о управляющей Администрации [COLOR=rgb(26, 188, 156)]сервера[/COLOR]: [/B][/FONT][/SIZE][URL='https://docs.google.com/spreadsheets/d/1OxAMj7FGQItNli_sSj15JR_M4chrZsdMquaXW8k68y0/edit?usp=sharing'][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br><br>" +
"[IMG]https://i.yapx.ru/WVYLq.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br><br>" +
'[RIGHT][B][SIZE=4][FONT=book antiqua]С уважением [COLOR=rgb(26, 188, 156)]Администрация 14-го сервера[/COLOR].[/FONT][/SIZE][/B][/RIGHT]',
	},
    {
      title: '---------------------------------------------------------------------------| РП Биографии |---------------------------------------------------------------------------',
	},
     {
      title: 'Не верный заголовок',
      content:
'[CENTER][B][SIZE=4][FONT=book antiqua][IMG]https://i.yapx.ru/WVYAv.jpg[/IMG][/FONT][/SIZE][/B]<br>' +
"[SIZE=4][FONT=book antiqua][B][IMG]https://i.yapx.ru/WVYLq.png[/IMG]<br><br>" +
"[CENTER][B]Приветствую, уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"Заголовок Вашей РП биографии не соответствует правилам. Рекомендуем Вам посмотреть правила подачи, и отправить заявку повторно. Правила - [URL='https://forum.matrp.ru/index.php?threads/Правила-подачи-РП-Биографии.359768/']Кликабельно[/URL].<br>" +
"[COLOR=rgb(255, 0, 0)]Отказано[/COLOR], рассмотрено.<br><br>" +
"[IMG]https://i.yapx.ru/WVYLq.png[/IMG][/B][/FONT][/SIZE]<br><br>" +
"[SIZE=5][FONT=book antiqua][B]Полезные ссылки сервера:[/B][/FONT][/SIZE]<br><br>" +
"[SIZE=4][FONT=book antiqua][B]Официальная беседа игроков [COLOR=rgb(26, 188, 156)]сервера [/COLOR]ВКонтакте: [/B][/FONT][/SIZE][URL='https://vk.me/join/YaHVfONzNPQ6gtWDz9N1v6iBeQ3h1wcKgrI='][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br>" +
"Официальный Discord канал [COLOR=rgb(26, 188, 156)]сервера[/COLOR]: [/B][/FONT][/SIZE][URL='https://discord.gg/5cxxYn86hB'][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br>" +
"Официальная группа ВКонтакте [COLOR=rgb(26, 188, 156)]сервера[/COLOR]: [/B][/FONT][/SIZE][URL='https://vk.com/matrp_srv14'][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br>" +
"Информация о управляющей Администрации [COLOR=rgb(26, 188, 156)]сервера[/COLOR]: [/B][/FONT][/SIZE][URL='https://docs.google.com/spreadsheets/d/1OxAMj7FGQItNli_sSj15JR_M4chrZsdMquaXW8k68y0/edit?usp=sharing'][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br><br>" +
"[IMG]https://i.yapx.ru/WVYLq.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br><br>" +
'[RIGHT][B][SIZE=4][FONT=book antiqua]С уважением [COLOR=rgb(26, 188, 156)]Администрация 14-го сервера[/COLOR].[/FONT][/SIZE][/B][/RIGHT]',
	},
    {
      title: 'РП биография не по коду',
      content:
'[CENTER][B][SIZE=4][FONT=book antiqua][IMG]https://i.yapx.ru/WVYAv.jpg[/IMG][/FONT][/SIZE][/B]<br>' +
"[SIZE=4][FONT=book antiqua][B][IMG]https://i.yapx.ru/WVYLq.png[/IMG]<br><br>" +
"[CENTER][B]Приветствую, уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"Ваша РП биография написана не форме, код подачи Вы можете посмотреть в правилах подачи. Рекомендуем Вам посмотреть правила подачи, и отправить заявку повторно. Правила - [URL='https://forum.matrp.ru/index.php?threads/Правила-подачи-РП-Биографии.359768/']Кликабельно[/URL].<br>" +
"[COLOR=rgb(255, 0, 0)]Отказано[/COLOR], рассмотрено.<br><br>" +
"[IMG]https://i.yapx.ru/WVYLq.png[/IMG][/B][/FONT][/SIZE]<br><br>" +
"[SIZE=5][FONT=book antiqua][B]Полезные ссылки сервера:[/B][/FONT][/SIZE]<br><br>" +
"[SIZE=4][FONT=book antiqua][B]Официальная беседа игроков [COLOR=rgb(26, 188, 156)]сервера [/COLOR]ВКонтакте: [/B][/FONT][/SIZE][URL='https://vk.me/join/YaHVfONzNPQ6gtWDz9N1v6iBeQ3h1wcKgrI='][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br>" +
"Официальный Discord канал [COLOR=rgb(26, 188, 156)]сервера[/COLOR]: [/B][/FONT][/SIZE][URL='https://discord.gg/5cxxYn86hB'][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br>" +
"Официальная группа ВКонтакте [COLOR=rgb(26, 188, 156)]сервера[/COLOR]: [/B][/FONT][/SIZE][URL='https://vk.com/matrp_srv14'][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br>" +
"Информация о управляющей Администрации [COLOR=rgb(26, 188, 156)]сервера[/COLOR]: [/B][/FONT][/SIZE][URL='https://docs.google.com/spreadsheets/d/1OxAMj7FGQItNli_sSj15JR_M4chrZsdMquaXW8k68y0/edit?usp=sharing'][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br><br>" +
"[IMG]https://i.yapx.ru/WVYLq.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br><br>" +
'[RIGHT][B][SIZE=4][FONT=book antiqua]С уважением [COLOR=rgb(26, 188, 156)]Администрация 14-го сервера[/COLOR].[/FONT][/SIZE][/B][/RIGHT]',
	},
    {
      title: 'Мало текста',
      content:
'[CENTER][B][SIZE=4][FONT=book antiqua][IMG]https://i.yapx.ru/WVYAv.jpg[/IMG][/FONT][/SIZE][/B]<br>' +
"[SIZE=4][FONT=book antiqua][B][IMG]https://i.yapx.ru/WVYLq.png[/IMG]<br><br>" +
"[CENTER][B]Приветствую, уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"Ваша РП биография содержит очень мало информации, напишите её повторно подумав и дополнив содержание РП биографии.<br>" +
"[COLOR=rgb(255, 0, 0)]Отказано[/COLOR], рассмотрено.<br><br>" +
"[IMG]https://i.yapx.ru/WVYLq.png[/IMG][/B][/FONT][/SIZE]<br><br>" +
"[SIZE=5][FONT=book antiqua][B]Полезные ссылки сервера:[/B][/FONT][/SIZE]<br><br>" +
"[SIZE=4][FONT=book antiqua][B]Официальная беседа игроков [COLOR=rgb(26, 188, 156)]сервера [/COLOR]ВКонтакте: [/B][/FONT][/SIZE][URL='https://vk.me/join/YaHVfONzNPQ6gtWDz9N1v6iBeQ3h1wcKgrI='][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br>" +
"Официальный Discord канал [COLOR=rgb(26, 188, 156)]сервера[/COLOR]: [/B][/FONT][/SIZE][URL='https://discord.gg/5cxxYn86hB'][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br>" +
"Официальная группа ВКонтакте [COLOR=rgb(26, 188, 156)]сервера[/COLOR]: [/B][/FONT][/SIZE][URL='https://vk.com/matrp_srv14'][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br>" +
"Информация о управляющей Администрации [COLOR=rgb(26, 188, 156)]сервера[/COLOR]: [/B][/FONT][/SIZE][URL='https://docs.google.com/spreadsheets/d/1OxAMj7FGQItNli_sSj15JR_M4chrZsdMquaXW8k68y0/edit?usp=sharing'][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br><br>" +
"[IMG]https://i.yapx.ru/WVYLq.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br><br>" +
'[RIGHT][B][SIZE=4][FONT=book antiqua]С уважением [COLOR=rgb(26, 188, 156)]Администрация 14-го сервера[/COLOR].[/FONT][/SIZE][/B][/RIGHT]',
	},
    {
      title: 'Одобрено',
      content:
'[CENTER][B][SIZE=4][FONT=book antiqua][IMG]https://i.yapx.ru/WVYAv.jpg[/IMG][/FONT][/SIZE][/B]<br>' +
"[SIZE=4][FONT=book antiqua][B][IMG]https://i.yapx.ru/WVYLq.png[/IMG]<br><br>" +
"[CENTER][B]Приветствую, уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"Ваша РП биография проверена и одобрена. Приятной игры.<br>" +
"[COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], рассмотрено.<br><br>" +
"[IMG]https://i.yapx.ru/WVYLq.png[/IMG][/B][/FONT][/SIZE]<br><br>" +
"[SIZE=5][FONT=book antiqua][B]Полезные ссылки сервера:[/B][/FONT][/SIZE]<br><br>" +
"[SIZE=4][FONT=book antiqua][B]Официальная беседа игроков [COLOR=rgb(26, 188, 156)]сервера [/COLOR]ВКонтакте: [/B][/FONT][/SIZE][URL='https://vk.me/join/YaHVfONzNPQ6gtWDz9N1v6iBeQ3h1wcKgrI='][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br>" +
"Официальный Discord канал [COLOR=rgb(26, 188, 156)]сервера[/COLOR]: [/B][/FONT][/SIZE][URL='https://discord.gg/5cxxYn86hB'][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br>" +
"Официальная группа ВКонтакте [COLOR=rgb(26, 188, 156)]сервера[/COLOR]: [/B][/FONT][/SIZE][URL='https://vk.com/matrp_srv14'][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br>" +
"Информация о управляющей Администрации [COLOR=rgb(26, 188, 156)]сервера[/COLOR]: [/B][/FONT][/SIZE][URL='https://docs.google.com/spreadsheets/d/1OxAMj7FGQItNli_sSj15JR_M4chrZsdMquaXW8k68y0/edit?usp=sharing'][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br><br>" +
"[IMG]https://i.yapx.ru/WVYLq.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br><br>" +
'[RIGHT][B][SIZE=4][FONT=book antiqua]С уважением [COLOR=rgb(26, 188, 156)]Администрация 14-го сервера[/COLOR].[/FONT][/SIZE][/B][/RIGHT]',
	},
    {
      title: '---------------------------------------------------------------------------| Игровой рынок |---------------------------------------------------------------------------',
	},
     {
      title: 'Не по правилам',
      content:
'[CENTER][B][SIZE=4][FONT=book antiqua][IMG]https://i.yapx.ru/WVYAv.jpg[/IMG][/FONT][/SIZE][/B]<br>' +
"[SIZE=4][FONT=book antiqua][B][IMG]https://i.yapx.ru/WVYLq.png[/IMG]<br><br>" +
"[CENTER][B]Приветствую, уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"Ваша тема оформлена не по правилам. Ознакомьтесь с правилами подачи, и оформите тему снова. Правила подачи - [URL='https://forum.matrp.ru/index.php?threads/МАТРЕШКА-rp-14-Правила-оформления-объявления.360615/']Кликабельно[/URL].<br>" +
"[COLOR=rgb(255, 0, 0)]Отказано[/COLOR], рассмотрено.<br><br>" +
"[IMG]https://i.yapx.ru/WVYLq.png[/IMG][/B][/FONT][/SIZE]<br><br>" +
"[SIZE=5][FONT=book antiqua][B]Полезные ссылки сервера:[/B][/FONT][/SIZE]<br><br>" +
"[SIZE=4][FONT=book antiqua][B]Официальная беседа игроков [COLOR=rgb(26, 188, 156)]сервера [/COLOR]ВКонтакте: [/B][/FONT][/SIZE][URL='https://vk.me/join/YaHVfONzNPQ6gtWDz9N1v6iBeQ3h1wcKgrI='][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br>" +
"Официальный Discord канал [COLOR=rgb(26, 188, 156)]сервера[/COLOR]: [/B][/FONT][/SIZE][URL='https://discord.gg/5cxxYn86hB'][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br>" +
"Официальная группа ВКонтакте [COLOR=rgb(26, 188, 156)]сервера[/COLOR]: [/B][/FONT][/SIZE][URL='https://vk.com/matrp_srv14'][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br>" +
"Информация о управляющей Администрации [COLOR=rgb(26, 188, 156)]сервера[/COLOR]: [/B][/FONT][/SIZE][URL='https://docs.google.com/spreadsheets/d/1OxAMj7FGQItNli_sSj15JR_M4chrZsdMquaXW8k68y0/edit?usp=sharing'][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br><br>" +
"[IMG]https://i.yapx.ru/WVYLq.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br><br>" +
'[RIGHT][B][SIZE=4][FONT=book antiqua]С уважением [COLOR=rgb(26, 188, 156)]Администрация 14-го сервера[/COLOR].[/FONT][/SIZE][/B][/RIGHT]',
	},
    {
      title: 'Одобрено',
      content:
'[CENTER][B][SIZE=4][FONT=book antiqua][IMG]https://i.yapx.ru/WVYAv.jpg[/IMG][/FONT][/SIZE][/B]<br>' +
"[SIZE=4][FONT=book antiqua][B][IMG]https://i.yapx.ru/WVYLq.png[/IMG]<br><br>" +
"[CENTER][B]Приветствую, уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"Ваша тема одобрена. Удачной продажи!<br>" +
"[COLOR=rgb(255, 0, 0)]Закрыто[/COLOR], рассмотрено.<br><br>" +
"[IMG]https://i.yapx.ru/WVYLq.png[/IMG][/B][/FONT][/SIZE]<br><br>" +
"[SIZE=5][FONT=book antiqua][B]Полезные ссылки сервера:[/B][/FONT][/SIZE]<br><br>" +
"[SIZE=4][FONT=book antiqua][B]Официальная беседа игроков [COLOR=rgb(26, 188, 156)]сервера [/COLOR]ВКонтакте: [/B][/FONT][/SIZE][URL='https://vk.me/join/YaHVfONzNPQ6gtWDz9N1v6iBeQ3h1wcKgrI='][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br>" +
"Официальный Discord канал [COLOR=rgb(26, 188, 156)]сервера[/COLOR]: [/B][/FONT][/SIZE][URL='https://discord.gg/5cxxYn86hB'][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br>" +
"Официальная группа ВКонтакте [COLOR=rgb(26, 188, 156)]сервера[/COLOR]: [/B][/FONT][/SIZE][URL='https://vk.com/matrp_srv14'][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br>" +
"Информация о управляющей Администрации [COLOR=rgb(26, 188, 156)]сервера[/COLOR]: [/B][/FONT][/SIZE][URL='https://docs.google.com/spreadsheets/d/1OxAMj7FGQItNli_sSj15JR_M4chrZsdMquaXW8k68y0/edit?usp=sharing'][SIZE=4][FONT=book antiqua][B]Кликабельно[/B][/FONT][/SIZE][/URL][SIZE=4][FONT=book antiqua][B].<br><br>" +
"[IMG]https://i.yapx.ru/WVYLq.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br><br>" +
'[RIGHT][B][SIZE=4][FONT=book antiqua]С уважением [COLOR=rgb(26, 188, 156)]Администрация 14-го сервера[/COLOR].[/FONT][/SIZE][/B][/RIGHT]',
    },
];

$(document).ready(() => {
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

// Добавление кнопок при загрузке страницы
    addButton('💥 | - Открыть кнопки - | 💥', 'selectAnswer');


// Поиск информации о теме
const threadData = getThreadData();

$(`button#selectAnswer`).click(() => {
  XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ(будет отправлено после нажатия):');
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