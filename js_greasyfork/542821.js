// ==UserScript==
// @name         Скрипт для КФ рп
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  Скрипт для КФ РП там
// @author       Konstantin_Solodkov
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://i.postimg.cc/Fztj6SLp/image.jpg
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/542821/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%20%D1%80%D0%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/542821/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%20%D1%80%D0%BF.meta.js
// ==/UserScript==
(function() {
    'use strict';
	const UNACCСEPT_PREFIX = 4; // префикс отказано
	const ACCСEPT_PREFIX = 8; // префикс одобрено
	const PINN_PREFIX = 2; //  префикс закрепить на рассмотрении
	const SPECADM_PREFIX = 11; // специальному администратору
	const GA_PREFIX = 12; // главному администратору
    const CLOSE_PREFIX = 7;
    const TEXY_PREFIX = 13;
    const REALIZOVANO_PREFIX = 5;
    const VAJNO_PREFIX = 1;
    const OJIDANIE_PREFIX = 14;
    const Zacrito_Prefix = 15;
const buttons = [
{
 title: 'приветствие',
content:
"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
'[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender] текст [/COLOR][/SIZE][/FONT][/CENTER][/B]',
},
{
	  title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Рп биографии ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
	},
{
      title: 'на рассмотрении',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Ваша [COLOR=#00bfff]RolePlay Биография[/color] на рассмотрении...[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>" +
		 "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br><br>"+
              "[CENTER][img]https://i.postimg.cc/S2yFSD5t/uix-logo-cust.png[/img][/CENTER]",
      prefix: PINN_PREFIX,
	  status: false,
    },
     {
      title: 'Одобрено',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Ваша [COLOR=#00bfff]RolePlay Биография[/color] получает статус[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>" +
		 "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Отказано',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [FONT=georgia] [B][CENTER]Ваша [COLOR=#00bfff]RolePlay Биография[/color] получает статус<br><br>" +
 "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
	 "[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
     title: 'Возраст не совпадает',
      content:
		'[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>' +
        "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Ваша [COLOR=#00bfff]RolePlay Биография[/color] получает статус: [Color=#ff0000]Отказано.[/color][/SIZE][/FONT][/CENTER][/B]<br>"+
       "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][color=#ff0000]Причина[/color]: [color=#ff0000]Возраст не совпадает с датой рождения[/color].[/SIZE][/FONT][/CENTER][/B]<br><br>"+
     "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
	 "[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Фамилия или имя в названии отличаются',
      content:
		'[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>' +
        "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Ваша [COLOR=#00bfff]RolePlay Биография[/color] получает статус: [Color=#ff0000]Отказано.[/color][/SIZE][/FONT][/CENTER][/B]<br>"+
"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][color=#ff0000]Причина[/color]: В названии вашей [COLOR=#00bfff]RolePlay Биографии[/color] и в пункте [Color=#ff0000]1 различаются имя/фамилия[/color].[/SIZE][/FONT][/CENTER][/B]<br><br>"+
 "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
	 "[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
{
      title: 'био отказ(18 лет)',
      content:
        '[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>' +
        "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Ваша [COLOR=#00bfff]RolePlay Биография[/color] получает статус: [Color=#ff0000]Отказано.[/color][/SIZE][/FONT][/CENTER][/B]<br>"+
 "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][Color=#ff0000]Причина отказа[/color]: минимальный возраст для составления [Color=#ff0000]биографии: 18 лет[/color].[/CENTER][/SIZE][/FONT][/B]<br><br>"+
"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
	 "[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
    prefix: UNACCСEPT_PREFIX,
    status: false,
},
     {
      title: 'Не по форме',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Ваша [COLOR=#00bfff]RolePlay Биография[/color] получает статус: Отказано, так как составлено [color=#ff0000]не по форме[/color].[/CENTER][/SIZE][/FONT][/B]<br><br>" +
		 "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
	 "[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
	  prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'От 2-го или 3-го лица',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Ваша [COLOR=#00bfff]RolePlay Биография[/color] получает статус: [color=#ff0000]Отказано[/color][/CENTER][/SIZE][/FONT][/B]<br>" +
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][color=#ff0000]Причиной[/color] послужило написание [COLOR=#00bfff]RolePlay Биографии[/color] [COLOR=#ff0000]от 2-го или 3-го лица[/color].[/CENTER][/SIZE][/FONT][/B]<br><BR>"+
		 "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
	 "[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
	  prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Копипаст',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Ваша [COLOR=#00bfff]RolePlay Биография[/color] получает статус: [color=#ff0000]Отказано[/color].[/CENTER][/SIZE][/FONT][/B]<br>"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][color=#ff0000]Причиной[/color] послужило [color=#ff0000]копирование текста[/color].[/CENTER][/SIZE][/FONT][/B]<br><br>"+
		 "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
	 "[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
	  prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Дублирование',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Ваша [COLOR=#00bfff]RolePlay Биография[/color] получает статус: [color=#ff0000]Отказано[/color].[/CENTER][/SIZE][/FONT][/B]<br>" +
		"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][color=#ff0000]Причиной[/color] послужило дублирование [COLOR=#00bfff]RolePlay Биографии[/color].[/CENTER][/SIZE][/FONT][/B]<br><br>"+
 "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
	 "[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
	  prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Ошибки в словах',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Ваша [COLOR=#00bfff]RolePlay Биография[/color] получает статус: [color=#ff0000]Отказано[/color].[/CENTER][/SIZE][/FONT][/B]<br>" +
"[B][FONT=georgia][SIZE=4][COLOR=lavender][CENTER][color=#ff0000]Причиной[/color] послужило написание [COLOR=#00bfff]RolePlay Биографии[/color] [color=#ff0000]с грамматическими / орфографическими ошибками[/color].[/CENTER][/SIZE][/FONT][/B]<br><br>"+
 "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
	 "[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
	  prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Заговолок',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Ваша [COLOR=#00bfff]RolePlay Биография[/color] получает статус: [color=#ff0000]Отказано[/color].[/CENTER][/SIZE][/FONT][/B]<br>" +
	"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][color=#ff0000]Причиной[/color] послужило написание [color=#ff0000]заговолка[/color] [COLOR=#00bfff]RolePlay Биографии[/color] [color=#ff0000]не по форме[/color].[/CENTER][/SIZE][/FONT][/B]<br><br>" +
 "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
	 "[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
		prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Нету имени родных',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Ваша [COLOR=#00bfff]RolePlay Биография[/color] получает статус: [color=#ff0000]Отказано[/color].[/CENTER][/SIZE][/FONT][/B]<br>" +
		"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][color=#ff0000]Причиной[/color] послужило то, что вы [color=#ff0000]не написали имя родителей и тд[/color].[/CENTER][/SIZE][/FONT][/B]<br><br>" +
 "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
	 "[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
	  prefix: UNACCСEPT_PREFIX,
	  status: false,
    },

	 {
      title: 'Мало текста',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Ваша [COLOR=#00bfff]RolePlay Биография[/color] получает статус: [color=#ff0000]Отказано[/color].[/CENTER][/SIZE][/FONT][/B]<br>"+
"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][color=#ff0000]Причиной[/color] послужило то, что Вы написали мало текста в своей РП Биографии.[/CENTER][/SIZE][/FONT][/B]<br><br>" +
 "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
	 "[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
		prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
{
      title: 'ООС Информация',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Ваша [COLOR=#00bfff]RolePlay Биография[/color] получает статус: [color=#ff0000]Отказано[/color].[/CENTER][/SIZE][/FONT][/B]<br>"+
"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][color=#ff0000]Причиной[/color] послужило то, что Вы написали информацию из реального мира.[/CENTER][/SIZE][/FONT][/B]<br><br>" +
 "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
	 "[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
		prefix: UNACCСEPT_PREFIX,
	  status: false,
    },

	 {
	  title: '-----  РП Ситуации  -------------------------------------------------------------------------------------------------------------------------------------',
	},
{
      title: 'на рассмотрении',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Ваша [COLOR=#00bfff]RolePlay Ситуация[/color] на рассмотрении...[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>" +
		 "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br><br>"+
              "[CENTER][img]https://i.postimg.cc/S2yFSD5t/uix-logo-cust.png[/img][/CENTER]",
      prefix: PINN_PREFIX,
	  status: false,
    },
	 {
      title: 'Одобрено',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Ваша [COLOR=#00bfff]RolePlay Ситуация[/color] получает статус:[/CENTER][/SIZE][/FONT][/B]<br>" +
 "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Отказано',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Ваша [COLOR=#00bfff]RolePlay Ситуация[/color] получает статус: [color=#ff0000]Отказано[/color].[/CENTER][/SIZE][/FONT][/B]<br>" +
		"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][color=#ff0000]Причиной[/color] могло послужить любое [color=#ff0000]нарушение Правил Написания[/color] [COLOR=#00bfff]RolePlay Ситуации[/color].[/CENTER][/SIZE][/FONT][/B]<br><br>"+
 "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
	 "[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Дублирование',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Ваша [COLOR=#00bfff]RolePlay Ситуация[/color] получает статус: [color=#ff0000]Отказано[/color].[/CENTER][/SIZE][/FONT][/B]<br>" +
		"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][color=#ff0000]Причиной[/color] послужило [color=#ff0000]дублирование темы[/color].[/CENTER][/SIZE][/FONT][/B]<br><br>" +
 "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
	 "[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
	 {
	  title: '-----  РП Организации  -------------------------------------------------------------------------------------------------------------------------------',
	},
{
      title: 'на рассмотрении',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Ваша [COLOR=#00bfff]RolePlay Организация[/color] на рассмотрении...[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>" +
		 "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br><br>"+
              "[CENTER][img]https://i.postimg.cc/S2yFSD5t/uix-logo-cust.png[/img][/CENTER]",
      prefix: PINN_PREFIX,
	  status: false,
    },
	 {
      title: 'Одобрено',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Ваша [COLOR=#00bfff]Неофициальная RolePlay Организация[/color] получает статус:[/SIZE][/FONT][/CENTER][/B]<br>" +
  "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Отказано',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Ваша [COLOR=#00bfff]Неофициальная RolePlay Организация[/color] получает статус: [color=#ff0000]Отказано[/color].[/CENTER][/SIZE][/FONT][/B]<br>" +
"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][COLOR=#ff0000]Причиной[/color] могло послужить любое [color=#ff0000]нарушение Правил Подачи Заявления[/color] на [COLOR=#00bfff]Неофициальную RolePlay Организацию[/color].[/CENTER][/SIZE][/FONT][/B]<br><br>" +
 "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
	 "[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
];

    $(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('🍺 На рассмотрении 🍺', 'pin');
	addButton('🍺 Отказано 🍺', 'unaccept');
	addButton('🍺 Одобрено 🍺', 'accepted');
	addButton('🍺 Теху 🍺', 'Texy');
    addButton('🍺 Закрыто 🍺', 'Zakrito');
    addButton('🍺 Ожидание 🍺', 'Ojidanie');
 	addButton('🍺 Ответы 🍺', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PINN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, false));
    $('button#Texy').click(() => editThreadData(TEXY_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(UNACCСEPT_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(UNACCСEPT_PREFIX, false));
    $('button#Realizovano').click(() => editThreadData(REALIZOVANO_PREFIX, false));
    $('button#Vajno').click(() => editThreadData(VAJNO_PREFIX, false));
    $('button#Rassmotreno').click(() => editThreadData(RASSMOTRENO_PREFIX, false));
    $('button#Ojidanie').click(() => editThreadData(OJIDANIE_PREFIX, false));
    $('button#Prefiks').click(() => editThreadData(PREFIKS, false));



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

	if (pin == false) {
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
	if (pin == true) {
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
(function() {
    'use strict';
    // Your code here...
})();