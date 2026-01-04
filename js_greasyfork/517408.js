// ==UserScript==
// @name         Кураторы форума | CHEREPOVETS 
// @namespace    http://tampermonkey.net/
// @version      5.3
// @description  По вопросам / предложениям в VK - https://vk.com/id796529644
// @author       Persona_Capone
// @match        https://forum.blackrussia.online/threads/*
// @grant        none
// @license 	 MIT
// @icon https://i.postimg.cc/DzbvmTvL/9-Eami-DTFgkw.jpg
// @downloadURL https://update.greasyfork.org/scripts/517408/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%20CHEREPOVETS.user.js
// @updateURL https://update.greasyfork.org/scripts/517408/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%20CHEREPOVETS.meta.js
// ==/UserScript==

(function() {
    'use strict';
const UNACCEPT_PREFIX = 4;
const ACCEPT_PREFIX = 8;
const RASSMOTENO_PREFIX = 9;
const PIN_PREFIX = 2;
const GA_PREFIX = 12;
const COMMAND_PREFIX = 10;
const DECIDED_PREFIX = 6;
const WAIT_PREFIX = 14;
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SPECY_PREFIX = 11;
const TEX_PREFIX = 13;
const buttons = [
    {
      title: 'Своя причина отказа',
      content:
		'[B][CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/8zQwxdFG/JJc-FPK4-C8l-OF3-VM42-Vmf-NUVN6f-VXtt-Wt-Tkbp-Hz4-RDvd-TPou-Ll-94-Efn-TXJOGisdjd-Fhkyo-Eh7m-YNN-3-Uj-ZWs-Du.webp[/IMG][/URL][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано.[/color]<br>Причина отказа: [напиши причину][/FONT]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL][/B][/CENTER]" +
        '[B][CENTER][SIZE=4][FONT=arial]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR]<br><br>[SIZE=2][COLOR=#FFFFFF][RIGHT]С уважением, Администрация сервера.[/RIGHT][/COLOR][/SIZE][/SIZE][/FONT][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀Общее⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀',
    },
    {
            title: 'На рассмотрение',
      content:
		'[B][CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/8zQwxdFG/JJc-FPK4-C8l-OF3-VM42-Vmf-NUVN6f-VXtt-Wt-Tkbp-Hz4-RDvd-TPou-Ll-94-Efn-TXJOGisdjd-Fhkyo-Eh7m-YNN-3-Uj-ZWs-Du.webp[/IMG][/URL][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша тема принята на рассмотрение.<br>Просим не создавать дубликатов и ожидать ответ от администрации. [/color][/FONT]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL][/B][/CENTER]" +
        '[B][CENTER][SIZE=4][FONT=arial]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR]<br><br>[SIZE=2][COLOR=#FFFFFF][RIGHT]С уважением, Администрация сервера.[/RIGHT][/COLOR][/SIZE][/SIZE][/FONT][/CENTER][/B]',
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: 'Отказано | Оффтоп',
      content:
		'[B][CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/8zQwxdFG/JJc-FPK4-C8l-OF3-VM42-Vmf-NUVN6f-VXtt-Wt-Tkbp-Hz4-RDvd-TPou-Ll-94-Efn-TXJOGisdjd-Fhkyo-Eh7m-YNN-3-Uj-ZWs-Du.webp[/IMG][/URL][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваше обращение никак не относится к сути данного раздела.[/color][/FONT]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL][/B][/CENTER]" +
        '[B][CENTER][SIZE=4][FONT=arial]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR]<br><br>[SIZE=2][COLOR=#FFFFFF][RIGHT]С уважением, Администрация сервера.[/RIGHT][/COLOR][/SIZE][/SIZE][/FONT][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀RP биографии⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀',
    },
    {
      title: 'Одобрено',
      content:
		'[B][CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/8zQwxdFG/JJc-FPK4-C8l-OF3-VM42-Vmf-NUVN6f-VXtt-Wt-Tkbp-Hz4-RDvd-TPou-Ll-94-Efn-TXJOGisdjd-Fhkyo-Eh7m-YNN-3-Uj-ZWs-Du.webp[/IMG][/URL][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][B]' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#00FF00]Одобрено. [/color][/FONT]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL][/B][/CENTER]" +
        '[B][CENTER][SIZE=4][FONT=arial]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR]<br><br>[SIZE=2][COLOR=#FFFFFF][RIGHT]С уважением, Администрация сервера.[/RIGHT][/COLOR][/SIZE][/SIZE][/FONT][/CENTER][/B]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'На доработку',
      content:
		'[B][CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/8zQwxdFG/JJc-FPK4-C8l-OF3-VM42-Vmf-NUVN6f-VXtt-Wt-Tkbp-Hz4-RDvd-TPou-Ll-94-Efn-TXJOGisdjd-Fhkyo-Eh7m-YNN-3-Uj-ZWs-Du.webp[/IMG][/URL][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Вам даётся 24 часа на дополнение Вашей RP биографии, в противном случае она получит статус: [COLOR=#FF0000]Отказано.[/color][/FONT]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL][/B][/CENTER]" +
        '[B][CENTER][SIZE=4][FONT=arial]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR]<br><br>[SIZE=2][COLOR=#FFFFFF][RIGHT]С уважением, Администрация сервера.[/RIGHT][/COLOR][/SIZE][/SIZE][/FONT][/CENTER][/B]',
      prefix: PIN_PREFIX,
	  status: 123,
    },
    {
      title: 'Отказано | Не дополнил',
      content:
		'[B][CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/8zQwxdFG/JJc-FPK4-C8l-OF3-VM42-Vmf-NUVN6f-VXtt-Wt-Tkbp-Hz4-RDvd-TPou-Ll-94-Efn-TXJOGisdjd-Fhkyo-Eh7m-YNN-3-Uj-ZWs-Du.webp[/IMG][/URL][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано.[/color]<br>Причина отказа: Не дополнили биографию в течение 24-х часов.[/FONT]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL][/B][/CENTER]" +
        '[B][CENTER][SIZE=4][FONT=arial]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR]<br><br>[SIZE=2][COLOR=#FFFFFF][RIGHT]С уважением, Администрация сервера.[/RIGHT][/COLOR][/SIZE][/SIZE][/FONT][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Отказано | Плагиат',
      content:
		'[B][CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/8zQwxdFG/JJc-FPK4-C8l-OF3-VM42-Vmf-NUVN6f-VXtt-Wt-Tkbp-Hz4-RDvd-TPou-Ll-94-Efn-TXJOGisdjd-Fhkyo-Eh7m-YNN-3-Uj-ZWs-Du.webp[/IMG][/URL][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано.[/color]<br>Причина отказа: Биография скопирована.[/CENTER]<br>[LIST][COLOR=RED]Примечание:[/COLOR] [URL=https://forum.blackrussia.online/threads/cherepovets-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-rp-%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.11941093/#:~:text=%D0%97%D0%B0%D0%BF%D1%80%D0%B5%D1%89%D0%B5%D0%BD%D0%BE%20%D0%BF%D0%BE%D0%BB%D0%BD%D0%BE%D0%B5%20%D0%B8%20%D1%87%D0%B0%D1%81%D1%82%D0%B8%D1%87%D0%BD%D0%BE%D0%B5%20%D0%BA%D0%BE%D0%BF%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9%20%D0%B8%D0%B7%20%D0%B4%D0%B0%D0%BD%D0%BD%D0%BE%D0%B3%D0%BE%20%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB%D0%B0%20%D0%B8%D0%BB%D0%B8%20%D0%B8%D0%B7%20%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB%D0%BE%D0%B2%20RP%20%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9%20%D0%B4%D1%80%D1%83%D0%B3%D0%B8%D1%85%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.]Запрещено полное и частичное копирование биографий из данного раздела или из разделов RP биографий других серверов.[/URL][/LIST][/FONT]<br>[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL][/B][/CENTER]" +
        '[B][CENTER][SIZE=4][FONT=arial]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR]<br><br>[SIZE=2][COLOR=#FFFFFF][RIGHT]С уважением, Администрация сервера.[/RIGHT][/COLOR][/SIZE][/SIZE][/FONT][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Отказано | Недостаточно информации',
      content:
		'[B][CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/8zQwxdFG/JJc-FPK4-C8l-OF3-VM42-Vmf-NUVN6f-VXtt-Wt-Tkbp-Hz4-RDvd-TPou-Ll-94-Efn-TXJOGisdjd-Fhkyo-Eh7m-YNN-3-Uj-ZWs-Du.webp[/IMG][/URL][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано.[/color]<br>Причина отказа: Недостаточно RP информации.[/FONT]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL][/B][/CENTER]" +
        '[B][CENTER][SIZE=4][FONT=arial]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR]<br><br>[SIZE=2][COLOR=#FFFFFF][RIGHT]С уважением, Администрация сервера.[/RIGHT][/COLOR][/SIZE][/SIZE][/FONT][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
    {
      title: 'Отказано | Не по форме',
      content:
		'[B][CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/8zQwxdFG/JJc-FPK4-C8l-OF3-VM42-Vmf-NUVN6f-VXtt-Wt-Tkbp-Hz4-RDvd-TPou-Ll-94-Efn-TXJOGisdjd-Fhkyo-Eh7m-YNN-3-Uj-ZWs-Du.webp[/IMG][/URL][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано.[/color]<br>Причина отказа: Биография составлена не по форме.<br>[SPOILER=Нажми, чтобы ознакомиться с формой составления RP биографий][/CENTER]Имя Фамилия:<br>Пол:<br>Национальность:<br>Возраст [18+]:<br>Дата и место рождения:<br>Семья:<br>Место текущего проживания:<br>Описание внешности:<br>Особенности характера:<br>Детство:<br>Юность и взрослая жизнь:<br>Настоящее время:<br>Хобби:[/SPOILER][/FONT]<br>[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL][/B][/CENTER]" +
        '[B][CENTER][SIZE=4][FONT=arial]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR]<br><br>[SIZE=2][COLOR=#FFFFFF][RIGHT]С уважением, Администрация сервера.[/RIGHT][/COLOR][/SIZE][/SIZE][/FONT][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
     },
    {
      title: 'Отказано | Не от первого лица',
      content:
		'[B][CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/8zQwxdFG/JJc-FPK4-C8l-OF3-VM42-Vmf-NUVN6f-VXtt-Wt-Tkbp-Hz4-RDvd-TPou-Ll-94-Efn-TXJOGisdjd-Fhkyo-Eh7m-YNN-3-Uj-ZWs-Du.webp[/IMG][/URL][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано.[/color]<br>Причина отказа: Написание биографии от 3-го лица.[/CENTER]<br>[LIST][COLOR=RED]Примечание:[/COLOR] [URL=https://forum.blackrussia.online/threads/cherepovets-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-rp-%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.11941093/#:~:text=%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D1%8F%20%D0%B4%D0%BE%D0%BB%D0%B6%D0%BD%D0%B0%20%D0%B1%D1%8B%D1%82%D1%8C%20%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B0%20%D0%BE%D1%82%20%D0%BF%D0%B5%D1%80%D0%B2%D0%BE%D0%B3%D0%BE%20%D0%BB%D0%B8%D1%86%D0%B0%20%D0%BF%D0%B5%D1%80%D1%81%D0%BE%D0%BD%D0%B0%D0%B6%D0%B0.]Биография должна быть написана от первого лица персонажа.[/URL][/LIST][/FONT]<br>[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL][/B][/CENTER]" +
        '[B][CENTER][SIZE=4][FONT=arial]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR]<br><br>[SIZE=2][COLOR=#FFFFFF][RIGHT]С уважением, Администрация сервера.[/RIGHT][/COLOR][/SIZE][/SIZE][/FONT][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Отказано | nRP никнейм',
      content:
		'[B][CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/8zQwxdFG/JJc-FPK4-C8l-OF3-VM42-Vmf-NUVN6f-VXtt-Wt-Tkbp-Hz4-RDvd-TPou-Ll-94-Efn-TXJOGisdjd-Fhkyo-Eh7m-YNN-3-Uj-ZWs-Du.webp[/IMG][/URL][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано.[/color]<br>Причина отказа: NonRP никнейм.[/CENTER]<br>[LIST][COLOR=RED]Примечание:[/COLOR] Запрещено создание Role Play биографии, если у Вас NonRolePlay никнейм.[/LIST][/FONT]<br>[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL][/B][/CENTER]" +
        '[B][CENTER][SIZE=4][FONT=arial]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR]<br><br>[SIZE=2][COLOR=#FFFFFF][RIGHT]С уважением, Администрация сервера.[/RIGHT][/COLOR][/SIZE][/SIZE][/FONT][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Отказано | Заголовок не по форме',
      content:
		'[B][CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/8zQwxdFG/JJc-FPK4-C8l-OF3-VM42-Vmf-NUVN6f-VXtt-Wt-Tkbp-Hz4-RDvd-TPou-Ll-94-Efn-TXJOGisdjd-Fhkyo-Eh7m-YNN-3-Uj-ZWs-Du.webp[/IMG][/URL][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано.[/color]<br>Причина отказа: Заголовок биографии написан не по форме.[/CENTER]<br>[LIST][COLOR=RED]Примечание:[/COLOR] [URL=https://forum.blackrussia.online/threads/cherepovets-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-rp-%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.11941093/#:~:text=%D0%97%D0%B0%D0%B3%D0%BE%D0%BB%D0%BE%D0%B2%D0%BE%D0%BA%20%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%B2%D0%B0%D0%B5%D0%BC%D0%BE%D0%B9%20%D1%82%D0%B5%D0%BC%D1%8B%20%D0%B4%D0%BE%D0%BB%D0%B6%D0%B5%D0%BD%20%D0%B1%D1%8B%D1%82%D1%8C%20%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%20%D1%81%D1%82%D1%80%D0%BE%D0%B3%D0%BE%20%D0%BF%D0%BE%20%D0%B4%D0%B0%D0%BD%D0%BD%D0%BE%D0%B9%20%D1%84%D0%BE%D1%80%D0%BC%D0%B5%3A%20%22RolePlay%20%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D1%8F%20%D0%B3%D1%80%D0%B0%D0%B6%D0%B4%D0%B0%D0%BD%D0%B8%D0%BD%D0%B0%20%D0%98%D0%BC%D1%8F%20%D0%A4%D0%B0%D0%BC%D0%B8%D0%BB%D0%B8%D1%8F.%22]Заголовок создаваемой темы должен быть написан строго по данной форме: “RolePlay биография гражданина Имя Фамилия.“[/URL][/LIST][/FONT]<br>[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL][/CENTER]" +
        '[B][CENTER][SIZE=4][FONT=arial]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR]<br><br>[SIZE=2][COLOR=#FFFFFF][RIGHT]С уважением, Администрация сервера.[/RIGHT][/COLOR][/SIZE][/SIZE][/FONT][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Отказано | Возраст не совпадает с датой',
      content:
		'[B][CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/8zQwxdFG/JJc-FPK4-C8l-OF3-VM42-Vmf-NUVN6f-VXtt-Wt-Tkbp-Hz4-RDvd-TPou-Ll-94-Efn-TXJOGisdjd-Fhkyo-Eh7m-YNN-3-Uj-ZWs-Du.webp[/IMG][/URL][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано.[/color]<br>Причина отказа: Возраст не совпадает с датой рождения.[/FONT]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL][/B][/CENTER]" +
        '[B][CENTER][SIZE=4][FONT=arial]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR]<br><br>[SIZE=2][COLOR=#FFFFFF][RIGHT]С уважением, Администрация сервера.[/RIGHT][/COLOR][/SIZE][/SIZE][/FONT][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Отказано | Указана не полная дата',
      content:
		'[B][CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/8zQwxdFG/JJc-FPK4-C8l-OF3-VM42-Vmf-NUVN6f-VXtt-Wt-Tkbp-Hz4-RDvd-TPou-Ll-94-Efn-TXJOGisdjd-Fhkyo-Eh7m-YNN-3-Uj-ZWs-Du.webp[/IMG][/URL][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано.[/color]<br>Причина отказа: Указана неполная дата рождения.<br>Необходимо указать её в полном формате: ДД.ММ.ГГГГ.[/FONT]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL][/B][/CENTER]" +
        '[B][CENTER][SIZE=4][FONT=arial]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR]<br><br>[SIZE=2][COLOR=#FFFFFF][RIGHT]С уважением, Администрация сервера.[/RIGHT][/COLOR][/SIZE][/SIZE][/FONT][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
       },
    {
title: 'Отказано | Возраст младше 18',
      content:
		'[B][CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/8zQwxdFG/JJc-FPK4-C8l-OF3-VM42-Vmf-NUVN6f-VXtt-Wt-Tkbp-Hz4-RDvd-TPou-Ll-94-Efn-TXJOGisdjd-Fhkyo-Eh7m-YNN-3-Uj-ZWs-Du.webp[/IMG][/URL][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано.[/color]<br>Причина отказа: Возраст персонажа менее 18 лет.[/FONT]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL][/B][/CENTER]" +
        '[B][CENTER][SIZE=4][FONT=arial]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR]<br><br>[SIZE=2][COLOR=#FFFFFF][RIGHT]С уважением, Администрация сервера.[/RIGHT][/COLOR][/SIZE][/SIZE][/FONT][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Отказано | Грамматические ошибки',
      content:
		'[B][CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/8zQwxdFG/JJc-FPK4-C8l-OF3-VM42-Vmf-NUVN6f-VXtt-Wt-Tkbp-Hz4-RDvd-TPou-Ll-94-Efn-TXJOGisdjd-Fhkyo-Eh7m-YNN-3-Uj-ZWs-Du.webp[/IMG][/URL][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано.[/color]<br>Причина отказа: Грамматические ошибки.[/FONT]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL][/B][/CENTER]" +
        '[B][CENTER][SIZE=4][FONT=arial]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR]<br><br>[SIZE=2][COLOR=#FFFFFF][RIGHT]С уважением, Администрация сервера.[/RIGHT][/COLOR][/SIZE][/SIZE][/FONT][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Отказано | Не все заполнено',
      content:
		'[B][CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/8zQwxdFG/JJc-FPK4-C8l-OF3-VM42-Vmf-NUVN6f-VXtt-Wt-Tkbp-Hz4-RDvd-TPou-Ll-94-Efn-TXJOGisdjd-Fhkyo-Eh7m-YNN-3-Uj-ZWs-Du.webp[/IMG][/URL][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано.[/color]<br>Причина отказа: Не полное заполнение предоставленной формы.[/FONT]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL][/B][/CENTER]" +
        '[B][CENTER][SIZE=4][FONT=arial]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR]<br><br>[SIZE=2][COLOR=#FFFFFF][RIGHT]С уважением, Администрация сервера.[/RIGHT][/COLOR][/SIZE][/SIZE][/FONT][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Отказано | Нейросеть',
      content:
		'[B][CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/8zQwxdFG/JJc-FPK4-C8l-OF3-VM42-Vmf-NUVN6f-VXtt-Wt-Tkbp-Hz4-RDvd-TPou-Ll-94-Efn-TXJOGisdjd-Fhkyo-Eh7m-YNN-3-Uj-ZWs-Du.webp[/IMG][/URL][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано.[/color]<br>Причина отказа: Биография составлена с помощью нейросети.[/CENTER]<br>[LIST][COLOR=RED]Примечание:[/COLOR] [URL=https://forum.blackrussia.online/threads/cherepovets-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-rp-%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.11941093/#:~:text=%D0%97%D0%B0%D0%BF%D1%80%D0%B5%D1%89%D0%B5%D0%BD%D0%BE%20%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D1%8C%D1%81%D1%8F%20%D0%BD%D0%B5%D0%B9%D1%80%D0%BE%D1%81%D0%B5%D1%82%D1%8C%D1%8E%20%D0%B4%D0%BB%D1%8F%20%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F%20RP%20%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.]Запрещено пользоваться нейросетью для создания RP биографии.[/URL][/LIST][/FONT]<br>[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL][/CENTER]" +
        '[B][CENTER][SIZE=4][FONT=arial]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR]<br><br>[SIZE=2][COLOR=#FFFFFF][RIGHT]С уважением, Администрация сервера.[/RIGHT][/COLOR][/SIZE][/SIZE][/FONT][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Отказано | Изображение из себя героя',
      content:
		'[B][CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/8zQwxdFG/JJc-FPK4-C8l-OF3-VM42-Vmf-NUVN6f-VXtt-Wt-Tkbp-Hz4-RDvd-TPou-Ll-94-Efn-TXJOGisdjd-Fhkyo-Eh7m-YNN-3-Uj-ZWs-Du.webp[/IMG][/URL][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография получает статус: [COLOR=#FF0000]Отказано.[/color]<br>Причина отказа: Приписывание своему персонажу супер-способностей.[/CENTER]<br>[LIST][COLOR=RED]Примечание: [/COLOR][URL=https://forum.blackrussia.online/threads/cherepovets-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-rp-%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.11941093/#:~:text=%D0%97%D0%B0%D0%BF%D1%80%D0%B5%D1%89%D0%B5%D0%BD%D0%BE%20%D0%BF%D1%80%D0%B8%D0%BF%D0%B8%D1%81%D1%8B%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20%D1%81%D0%B2%D0%BE%D0%B5%D0%BC%D1%83%20%D0%BF%D0%B5%D1%80%D1%81%D0%BE%D0%BD%D0%B0%D0%B6%D1%83%20%D1%81%D1%83%D0%BF%D0%B5%D1%80%2D%D1%81%D0%BF%D0%BE%D1%81%D0%BE%D0%B1%D0%BD%D0%BE%D1%81%D1%82%D0%B5%D0%B9.]Запрещено приписывание своему персонажу супер-способностей.[/URL] [/LIST][/FONT]<br>[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL][/B][/CENTER]" +
        '[B][CENTER][SIZE=4][FONT=arial]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR]<br><br>[SIZE=2][COLOR=#FFFFFF][RIGHT]С уважением, Администрация сервера.[/RIGHT][/COLOR][/SIZE][/SIZE][/FONT][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Отказано | Уже находится на рассмотрении',
      content:
		'[B][CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/8zQwxdFG/JJc-FPK4-C8l-OF3-VM42-Vmf-NUVN6f-VXtt-Wt-Tkbp-Hz4-RDvd-TPou-Ll-94-Efn-TXJOGisdjd-Fhkyo-Eh7m-YNN-3-Uj-ZWs-Du.webp[/IMG][/URL][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP биография уже находится на рассмотрении, дополните её в предыдущей теме[/COLOR].[/FONT]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL][/B][/CENTER]" +
        '[B][CENTER][SIZE=4][FONT=arial]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR]<br><br>[SIZE=2][COLOR=#FFFFFF][RIGHT]С уважением, Администрация сервера.[/RIGHT][/COLOR][/SIZE][/SIZE][/FONT][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
     },
    {
     title: '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀RP ситуации⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀',
    },
    {
title: 'Одобрено',
      content:
		'[B][CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/8zQwxdFG/JJc-FPK4-C8l-OF3-VM42-Vmf-NUVN6f-VXtt-Wt-Tkbp-Hz4-RDvd-TPou-Ll-94-Efn-TXJOGisdjd-Fhkyo-Eh7m-YNN-3-Uj-ZWs-Du.webp[/IMG][/URL][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP ситуация получает статус: [COLOR=#00FF00]Одобрено.[/color][/FONT]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL][/B][/CENTER]" +
        '[B][CENTER][SIZE=4][FONT=arial]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR]<br><br>[SIZE=2][COLOR=#FFFFFF][RIGHT]С уважением, Администрация сервера.[/RIGHT][/COLOR][/SIZE][/SIZE][/FONT][/CENTER][/B]]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Отказано | Нарушение правил',
      content:
		'[B][CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/8zQwxdFG/JJc-FPK4-C8l-OF3-VM42-Vmf-NUVN6f-VXtt-Wt-Tkbp-Hz4-RDvd-TPou-Ll-94-Efn-TXJOGisdjd-Fhkyo-Eh7m-YNN-3-Uj-ZWs-Du.webp[/IMG][/URL][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP ситуация получает статус: [COLOR=#FF0000]Отказано.[/color]<br>Причина отказа: Нарушение правил создания RP ситуаций.[/FONT]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL][/B][/CENTER]" +
        '[B][CENTER][SIZE=4][FONT=arial]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR]<br><br>[SIZE=2][COLOR=#FFFFFF][RIGHT]С уважением, Администрация сервера.[/RIGHT][/COLOR][/SIZE][/SIZE][/FONT][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'На доработку',
      content:
		'[B][CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/8zQwxdFG/JJc-FPK4-C8l-OF3-VM42-Vmf-NUVN6f-VXtt-Wt-Tkbp-Hz4-RDvd-TPou-Ll-94-Efn-TXJOGisdjd-Fhkyo-Eh7m-YNN-3-Uj-ZWs-Du.webp[/IMG][/URL][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Вам даётся 24 часа на дополнение Вашей RP ситуации, в противном случае она получит статус: [COLOR=#FF0000]Отказано.[/color][/FONT]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL][/B][/CENTER]" +
        '[B][CENTER][SIZE=4][FONT=arial]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR]<br><br>[SIZE=2][COLOR=#FFFFFF][RIGHT]С уважением, Администрация сервера.[/RIGHT][/COLOR][/SIZE][/SIZE][/FONT][/CENTER][/B]',
      prefix: PIN_PREFIX,
	  status: 123,
    },
    {
      title: 'Отказано | Не дополнил',
      content:
		'[B][CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/8zQwxdFG/JJc-FPK4-C8l-OF3-VM42-Vmf-NUVN6f-VXtt-Wt-Tkbp-Hz4-RDvd-TPou-Ll-94-Efn-TXJOGisdjd-Fhkyo-Eh7m-YNN-3-Uj-ZWs-Du.webp[/IMG][/URL][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша RP ситуация получает статус: [COLOR=#FF0000]Отказано.[/color]<br>Причина отказа: Не дополнили RP ситуацию в течение 24-х часов.[/FONT]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL][/B][/CENTER]" +
        '[B][CENTER][SIZE=4][FONT=arial]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR]<br><br>[SIZE=2][COLOR=#FFFFFF][RIGHT]С уважением, Администрация сервера.[/RIGHT][/COLOR][/SIZE][/SIZE][/FONT][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
     },
    {
     title: '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀Нефициальные RP организации⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀',
    },
    {
      title: 'Одобрено',
      content:
		'[B][CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/8zQwxdFG/JJc-FPK4-C8l-OF3-VM42-Vmf-NUVN6f-VXtt-Wt-Tkbp-Hz4-RDvd-TPou-Ll-94-Efn-TXJOGisdjd-Fhkyo-Eh7m-YNN-3-Uj-ZWs-Du.webp[/IMG][/URL][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша неофициальная RP организация получает статус: [COLOR=#00FF00]Одобрено.[/color][/FONT]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL][/B][/CENTER]" +
        '[B][CENTER][SIZE=4][FONT=arial]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR]<br><br>[SIZE=2][COLOR=#FFFFFF][RIGHT]С уважением, Администрация сервера.[/RIGHT][/COLOR][/SIZE][/SIZE][/FONT][/CENTER][/B]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Отказано | Нарушение правил',
      content:
		'[B][CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/8zQwxdFG/JJc-FPK4-C8l-OF3-VM42-Vmf-NUVN6f-VXtt-Wt-Tkbp-Hz4-RDvd-TPou-Ll-94-Efn-TXJOGisdjd-Fhkyo-Eh7m-YNN-3-Uj-ZWs-Du.webp[/IMG][/URL][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/B]' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша неофициальная RP организация получает статус: [COLOR=#FF0000]Отказано.[/color]<br>Причина отказа: Нарушение правил создания неофициальных RP организаций.[/FONT]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL][/B][/CENTER]" +
        '[B][CENTER][SIZE=4][FONT=arial]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR]<br><br>[SIZE=2][COLOR=#FFFFFF][RIGHT]С уважением, Администрация сервера.[/RIGHT][/COLOR][/SIZE][/SIZE][/FONT][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'На доработку',
      content:
		'[B][CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/8zQwxdFG/JJc-FPK4-C8l-OF3-VM42-Vmf-NUVN6f-VXtt-Wt-Tkbp-Hz4-RDvd-TPou-Ll-94-Efn-TXJOGisdjd-Fhkyo-Eh7m-YNN-3-Uj-ZWs-Du.webp[/IMG][/URL][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/B]' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Вам даётся 24 часа на дополнение Вашей неофициальной RP организации, в противном случае она получит статус: [COLOR=#FF0000]Отказано.[/color][/FONT]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL][/B][/CENTER]" +
        '[B][CENTER][SIZE=4][FONT=arial]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR]<br><br>[SIZE=2][COLOR=#FFFFFF][RIGHT]С уважением, Администрация сервера.[/RIGHT][/COLOR][/SIZE][/SIZE][/FONT][/CENTER][/B]',
      prefix: PIN_PREFIX,
	  status: 123,
    },
    {
      title: 'Отказано | Не дополнил',
      content:
		'[B][CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/8zQwxdFG/JJc-FPK4-C8l-OF3-VM42-Vmf-NUVN6f-VXtt-Wt-Tkbp-Hz4-RDvd-TPou-Ll-94-Efn-TXJOGisdjd-Fhkyo-Eh7m-YNN-3-Uj-ZWs-Du.webp[/IMG][/URL][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша неофициальная RP организация получает статус: [COLOR=#FF0000]Отказано.[/color]<br>Причина отказа: Не дополнили неофициальную организацию в течение 24-х часов.[/FONT]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL][/B][/CENTER]" +
        '[B][CENTER][SIZE=4][FONT=arial]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR]<br><br>[SIZE=2][COLOR=#FFFFFF][RIGHT]С уважением, Администрация сервера.[/RIGHT][/COLOR][/SIZE][/SIZE][/FONT][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Отказано | Заголовок не по форме',
      content:
		'[B][CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/8zQwxdFG/JJc-FPK4-C8l-OF3-VM42-Vmf-NUVN6f-VXtt-Wt-Tkbp-Hz4-RDvd-TPou-Ll-94-Efn-TXJOGisdjd-Fhkyo-Eh7m-YNN-3-Uj-ZWs-Du.webp[/IMG][/URL][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Ваша неофициальная RP организация получает статус: [COLOR=#FF0000]Отказано.[/color]<br>Причина отказа: Заголовок написан не по форме.<br>[LIST][COLOR=RED]Примечание:[/COLOR] Название темы должно быть по форме “Название организации” | Дата создания.[/LIST][/FONT]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL][/CENTER]" +
        '[B][CENTER][SIZE=4][FONT=arial]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR]<br><br>[SIZE=2][COLOR=#FFFFFF][RIGHT]С уважением, Администрация сервера.[/RIGHT][/COLOR][/SIZE][/SIZE][/FONT][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
      },
    {
     title: '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀В другой раздел⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀',  
    },
    {
title: 'Перенесу тему',
      content:
		'[B][CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/8zQwxdFG/JJc-FPK4-C8l-OF3-VM42-Vmf-NUVN6f-VXtt-Wt-Tkbp-Hz4-RDvd-TPou-Ll-94-Efn-TXJOGisdjd-Fhkyo-Eh7m-YNN-3-Uj-ZWs-Du.webp[/IMG][/URL][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Вы ошиблись разделом, переношу Вашу тему в нужный раздел.<br>Ожидайте ответа в данной теме, копии создавать не нужно.[/color][/FONT]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL][/B][/CENTER]" +
        '[B][CENTER][SIZE=4][FONT=arial]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR]<br><br>[SIZE=2][COLOR=#FFFFFF][RIGHT]С уважением, Администрация сервера.[/RIGHT][/COLOR][/SIZE][/SIZE][/FONT][/CENTER][/B]',
    },
    {
      title: 'В жалобы на администрацию',
      content:
		'[B][CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/8zQwxdFG/JJc-FPK4-C8l-OF3-VM42-Vmf-NUVN6f-VXtt-Wt-Tkbp-Hz4-RDvd-TPou-Ll-94-Efn-TXJOGisdjd-Fhkyo-Eh7m-YNN-3-Uj-ZWs-Du.webp[/IMG][/URL][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на администрацию: [URL=https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.3965/]кликабельно[/URL].[/color][/FONT]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL][/B][/CENTER]" +
        '[B][CENTER][SIZE=4][FONT=arial]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR]<br><br>[SIZE=2][COLOR=#FFFFFF][RIGHT]С уважением, Администрация сервера.[/RIGHT][/COLOR][/SIZE][/SIZE][/FONT][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'В жалобы на лидеров',
      content:
		'[B][CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/8zQwxdFG/JJc-FPK4-C8l-OF3-VM42-Vmf-NUVN6f-VXtt-Wt-Tkbp-Hz4-RDvd-TPou-Ll-94-Efn-TXJOGisdjd-Fhkyo-Eh7m-YNN-3-Uj-ZWs-Du.webp[/IMG][/URL][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на лидеров – [URL=https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.3966/]кликабельно[/URL].[/color][/FONT]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL][/B][/CENTER]" +
        '[B][CENTER][SIZE=4][FONT=arial]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR]<br><br>[SIZE=2][COLOR=#FFFFFF][RIGHT]С уважением, Администрация сервера.[/RIGHT][/COLOR][/SIZE][/SIZE][/FONT][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'В жалобы на игроков',
      content:
		'[B][CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/8zQwxdFG/JJc-FPK4-C8l-OF3-VM42-Vmf-NUVN6f-VXtt-Wt-Tkbp-Hz4-RDvd-TPou-Ll-94-Efn-TXJOGisdjd-Fhkyo-Eh7m-YNN-3-Uj-ZWs-Du.webp[/IMG][/URL][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на игроков – [URL=https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3967/]кликабельно[/URL].[/color][/FONT]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL][/B][/CENTER]" +
        '[B][CENTER][SIZE=4][FONT=arial]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR]<br><br>[SIZE=2][COLOR=#FFFFFF][RIGHT]С уважением, Администрация сервера.[/RIGHT][/COLOR][/SIZE][/SIZE][/FONT][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'В обжалование наказаний',
      content:
		'[B][CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/8zQwxdFG/JJc-FPK4-C8l-OF3-VM42-Vmf-NUVN6f-VXtt-Wt-Tkbp-Hz4-RDvd-TPou-Ll-94-Efn-TXJOGisdjd-Fhkyo-Eh7m-YNN-3-Uj-ZWs-Du.webp[/IMG][/URL][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Вы ошиблись разделом.<br>Обратитесь в раздел обжалований наказаний – [URL=https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.3968/]кликабельно[/URL].[/color][/FONT]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL][/B][/CENTER]" +
        '[B][CENTER][SIZE=4][FONT=arial]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR]<br><br>[SIZE=2][COLOR=#FFFFFF][RIGHT]С уважением, Администрация сервера.[/RIGHT][/COLOR][/SIZE][/SIZE][/FONT][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'В жалобы на тех. специалистов',
      content:
		'[B][CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/8zQwxdFG/JJc-FPK4-C8l-OF3-VM42-Vmf-NUVN6f-VXtt-Wt-Tkbp-Hz4-RDvd-TPou-Ll-94-Efn-TXJOGisdjd-Fhkyo-Eh7m-YNN-3-Uj-ZWs-Du.webp[/IMG][/URL][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на технических специалистов – [URL=https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/]кликабельно[/URL].[/color][/FONT]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL][/B][/CENTER]" +
        '[B][CENTER][SIZE=4][FONT=arial]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR]<br><br>[SIZE=2][COLOR=#FFFFFF][RIGHT]С уважением, Администрация сервера.[/RIGHT][/COLOR][/SIZE][/SIZE][/FONT][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'В тех. раздел',
      content:
		'[B][CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/8zQwxdFG/JJc-FPK4-C8l-OF3-VM42-Vmf-NUVN6f-VXtt-Wt-Tkbp-Hz4-RDvd-TPou-Ll-94-Efn-TXJOGisdjd-Fhkyo-Eh7m-YNN-3-Uj-ZWs-Du.webp[/IMG][/URL][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Вы ошиблись разделом.<br>Обратитесь в технический раздел – [URL=https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB.22/]кликабельно[/URL].[/color][/FONT]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL][/B][/CENTER]" +
        '[B][CENTER][SIZE=4][FONT=arial]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR]<br><br>[SIZE=2][COLOR=#FFFFFF][RIGHT]С уважением, Администрация сервера.[/RIGHT][/COLOR][/SIZE][/SIZE][/FONT][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'В жалобы на сотрудников',
      content:
		'[B][CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/8zQwxdFG/JJc-FPK4-C8l-OF3-VM42-Vmf-NUVN6f-VXtt-Wt-Tkbp-Hz4-RDvd-TPou-Ll-94-Efn-TXJOGisdjd-Fhkyo-Eh7m-YNN-3-Uj-ZWs-Du.webp[/IMG][/URL][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на сотрудников данной организации.[/color][/FONT]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL][/B][/CENTER]" +
        '[B][CENTER][SIZE=4][FONT=arial]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR]<br><br>[SIZE=2][COLOR=#FFFFFF][RIGHT]С уважением, Администрация сервера.[/RIGHT][/COLOR][/SIZE][/SIZE][/FONT][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'В жалобы на агентов поддержки',
      content:
		'[B][CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/8zQwxdFG/JJc-FPK4-C8l-OF3-VM42-Vmf-NUVN6f-VXtt-Wt-Tkbp-Hz4-RDvd-TPou-Ll-94-Efn-TXJOGisdjd-Fhkyo-Eh7m-YNN-3-Uj-ZWs-Du.webp[/IMG][/URL][SIZE=4][FONT=arial][COLOR=#0099ff]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/B]' +
        "[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL]<br>[B][FONT=arial][COLOR=#FFFFFF][SIZE=4]Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на Агентов поддержки.[/color][/FONT]<br>[URL=https://postimages.org/][IMG]https://i.postimg.cc/MG3WsdCG/100-20250812193458-1.png[/IMG][/URL][/B][/CENTER]" +
        '[B][CENTER][SIZE=4][FONT=arial]Приятной игры на сервере [COLOR=#0099FF]CHEREPOVETS.[/COLOR]<br><br>[SIZE=2][COLOR=#FFFFFF][RIGHT]С уважением, Администрация сервера.[/RIGHT][/COLOR][/SIZE][/SIZE][/FONT][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },


];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
    addButton('Ответы', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => pasteContent(2, threadData, true));
	$('button#Ga').click(() => pasteContent(8, threadData, true));
	$('button#Rasmotreno').click(() => editThreadData(RASSMOTENO_PREFIX, false));
	$('button#Close').click(() => editThreadData(CLOSE_PREFIX, false));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));


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

function addButton(name, id) {
$('.button--icon--reply').before(
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 0px 0px; border-color: teal; border-style: dashed solid; margin-right: 7px; margin-bottom: 10px; background: teal; text-decoration-style: wavy;">${name}</button>`,
);
}

function buttonsMarkup(buttons) {
return `<div class="select_answer">${buttons
  .map(
	(btn, i) =>
	  `<button id="answers-${i}" class="button--primary button ` +
	  `rippleButton" style="border-radius: 0px; margin-right: 10px; margin-bottom: 10px"><span class="button-text">${btn.title}</span></button>`,
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
            discussion_open: 0,
			sticky: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}
	if(pin == 123){
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