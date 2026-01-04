// ==UserScript==
// @name         my script
// @namespace    http://tampermonkey.net/
// @version      2.8
// @description  Скрипт для Руководства сервера
// @author       caprio
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://klike.net/uploads/posts/2021-12/1638345168_12.jpg
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/473365/my%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/473365/my%20script.meta.js
// ==/UserScript==
 
(function () {
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
         '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR].[/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B] Текст [/B][/FONT][/SIZE]<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]"
         },
    {
             title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Обжалования ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
        	  title: 'Одобрено, полностью',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Ваше обжалование одобрено, ваше наказание будет полностью снято.<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
"[CENTER][COLOR=rgb(65, 168, 95)]Одобрено[/COLOR], закрыто. [/FONT][/SIZE][/CENTER]<br>" +
'[RIGHT][COLOR=FFFFFF][SIZE=3][FONT=trebuchet ms][B]С уважением Администрация сервера [COLOR=rgb(139, 0, 255)] Purple.[/B][/FONT][/SIZE][/RIGHT]',
          prefix: ACCСEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Одобрено, частично',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Ваше обжалование было рассмотрено и принято решение о сокращении вашего наказания.<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
"[CENTER][COLOR=rgb(65, 168, 95)]Одобрено[/COLOR], закрыто. [/FONT][/SIZE][/CENTER]<br>" +
'[RIGHT][SIZE=3][FONT=trebuchet ms][COLOR=lavender]С уважением Администрация сервера [COLOR=rgb(139, 0, 255)]Purple.[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
	       prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'На рассмотрение',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Ваше обжалование взято на рассмотрение. <br>Ожидайте ответа в данной теме. Не создавайте повторные темы в противном случае Вы можете получить блокировку форумного аккаунта.[/B][/FONT][/SIZE]<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
"[CENTER][COLOR=rgb(250, 197, 28)]На рассмотрении[/COLOR]. [/FONT][/SIZE][/CENTER]<br>" +
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Администрация сервера [COLOR=rgb(139, 0, 255)]Purple.[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
       prefix: PINN_PREFIX,
      status: true,
    },,
	{
                                            	  title: 'Обращение в VK',
	  content:
         '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B] Просьба отписать мне в Лс VK для дальнейшего рассмотрения темы [URL='https://vk.com/77oleinik77']Вконтакте[/URL]. [/B][/FONT][/SIZE]<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
    "[CENTER][COLOR=rgb(250, 197, 28)]На рассмотрении[/COLOR]. [/FONT][/SIZE][/CENTER]<br>" +
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Администрация сервера [COLOR=rgb(139, 0, 255)]Purple.[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
       prefix: PINN_PREFIX,
      status: true,
         },
    {
                                                	  title: 'NonRP Обман',
	  content:
         '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B] Аккаунт будет разблокирован на 24 часа, у Вас есть время, чтобы возместить ущерб и предоставить доказательства.  [/B][/FONT][/SIZE]<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(250, 197, 28)]На рассмотрении[/COLOR]. [/FONT][/SIZE][/CENTER]<br>" +
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Администрация сервера [COLOR=rgb(139, 0, 255)]Purple.[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
              prefix: PINN_PREFIX,
      status: true
    },
    {
        	  title: 'Отказано',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]В обжаловании отказано.<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
"[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], закрыто. [/FONT][/SIZE][/CENTER]<br>" +
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Администрация сервере [COLOR=rgb(139, 0, 255)]Purple.[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
         prefix: CLOSE_PREFIX,
      status: false,
    },
	{
    	  title: 'Не подлежит',
	  content:
         '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B] Ваше наказание Обжалованию не подлежит,прочтите внимательнее правила подачи Обжалования. <br>Не создавайте повторные темы в противном случае Вы можете получить блокировку форумного аккаунта.[/B][/FONT][/SIZE]<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
"[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], Закрыто. [/FONT][/SIZE][/CENTER]<br>" +
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Администрация сервера [COLOR=rgb(139, 0, 255)]Purple.[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
	      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
        	  title: 'Главному Администратору',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Ваше обжалование передано [COLOR=rgb(255, 0, 0)]Главноу Администратору @Den_Medvedev . <br>[COLOR=rgb(255, 255, 255)]Ожидайте ответа в данной теме. Не создавайте повторные темы в противном случае Вы можете получить блокировку форумного аккаунта.[/B][/FONT][/SIZE]<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
"[CENTER][COLOR=rgb(255, 0, 0)]Главному Администратору. [/color][/FONT][/SIZE][/CENTER]<br>" +
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Администрация сервера [COLOR=rgb(139, 0, 255)]Purple.[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
       prefix: GA_PREFIX,
      status: true,
    },
    {
                	  title: 'Специальному Администратору',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Ваше обжалование передано [COLOR=rgb(255, 0, 0)]Специальному Администратору @Sander_Cligan . <br>[COLOR=rgb(255, 255, 255)]Ожидайте ответа в данной теме. Не создавайте повторные темы в противном случае Вы можете получить блокировку форумного аккаунта.[/B][/FONT][/SIZE]<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
"[CENTER][COLOR=rgb(255, 0, 0)]Специальному Администратору[/COLOR]. [/FONT][/SIZE][/CENTER]<br>" +
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Администрация сервера [COLOR=rgb(139, 0, 255)]Purple.[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
       prefix: SPECY_PREFIX,
      status: true,
    },
    {
        	  title: 'Руководителю Модераторов',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Ваше обжалование передано [COLOR=rgb(128, 166, 255)]Руковдителю Модераторов @sakaro . <br>[COLOR=rgb(255, 255, 255)]Ожидайте ответа в данной теме. Не создавайте повторные темы в противном случае Вы можете получить блокировку форумного аккаунта.[/B][/FONT][/SIZE]<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
"[CENTER][COLOR=rgb(128, 166, 255)][/COLOR]Руководителю Модераторов. [/FONT][/SIZE][/CENTER]<br>" +
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Администрация сервера [COLOR=rgb(139, 0, 255)]Purple.[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
       prefix: PINN_PREFIX,
      status: true,
    },
	{
	  title: 'Не по форме',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Обжалование составлено не по форме или же не соответствует правилам подачи. Ознакомится с ними можно тут - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-заявки-на-обжалование-наказания.1158730/']Кликабельно[/URL].<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
"[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], Закрыто. [/FONT][/SIZE][/CENTER]<br>" +
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Админимстрация сервера [COLOR=rgb(139, 0, 255)]Purple.[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
         prefix: CLOSE_PREFIX,
      status: false,
    },
	{
 
 
                                                        	  title: 'Ответ дан ранее',
	  content:
         '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Вам уже ранее был дан корректный ответ, за создание дубликатов этой темы ваш форумный аккаунт может быть заблокирован.[/B][/FONT][/SIZE]<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], Закрыто. [/FONT][/SIZE][/CENTER]<br>" +
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Администрация сервера [COLOR=rgb(139, 0, 255)]Purple.[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
	      prefix: CLOSE_PREFIX,
      status: false,
    },
 {
 
    title: 'Уже обжалован',
	  content:
         '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B] Ранее вам уже было одобрено обжалование и ваше наказание было снижено - повторного обжалования не будет. <br>Не создавайте повторные темы в противном случае Вы можете получить блокировку форумного аккаунта.  [/B][/FONT][/SIZE]<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
"[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], Закрыто. [/FONT][/SIZE][/CENTER]<br>" +
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Администрация сервера [COLOR=rgb(139, 0, 255)]Purple.[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
	      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
                                                    	  title: 'Док-ва отред',
	  content:
         '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Ваши доказательства были подвергнуты изменениям (редактированию), прикрепите оригинальные файлы. [/B][/FONT][/SIZE]<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], Закрыто. [/FONT][/SIZE][/CENTER]<br>" +
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Администрация сервера [COLOR=rgb(139, 0, 255)]Purple.[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
	      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
                                                	  title: 'Отсутвуют док-ва',
	  content:
         '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Отсутствуют доказательства - следовательно, обжалование рассмотрению не подлежит. [/B][/FONT][/SIZE]<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], Закрыто. [/FONT][/SIZE][/CENTER]<br>" +
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Администрация сервера [COLOR=rgb(139, 0, 255)]Purple.[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
	      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
        	  title: 'Уже есть мин.наказание',
	  content:
         '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B] У Вас уже есть минимальное наказание. <br>Не создавайте повторные темы в противном случае Вы можете получить блокировку форумного аккаунта. [/B][/FONT][/SIZE]<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
"[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], Закрыто. [/FONT][/SIZE][/CENTER]<br>" +
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Администрация сервера [COLOR=rgb(139, 0, 255)]Purple.[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
	      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
                                                            	  title: 'Док-ва в соц.сетях',
	  content:
         '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Доказательства в социальных сетях (VK,Instagram,FaceBook) не принимаются, загрузите доказательства на фохостинг (Imgur,Yapix,Youtube). [/B][/FONT][/SIZE]<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], Закрыто. [/FONT][/SIZE][/CENTER]<br>" +
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Администрация сервера [COLOR=rgb(139, 0, 255)]Purple.[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
	      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
                                                    	  title: 'Недостаточно док-ев',
	  content:
         '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Недостаточно доказательств для корректного рассмотрения вашего обращения. [/B][/FONT][/SIZE]<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], Закрыто. [/FONT][/SIZE][/CENTER]<br>" +
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Администрация сервера [COLOR=rgb(139, 0, 255)]Purple.[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
	      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
                	  title: 'В жб на администрацию',
	  content:
         '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B] Если вы не согласны с решением администратора, обратитесь в раздел жалоб на администрацию. [/B][/FONT][/SIZE]<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
"[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], Закрыто. [/FONT][/SIZE][/CENTER]<br>" +
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Администрация сервера [COLOR=rgb(139, 0, 255)]Purple.[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
	      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
                        	  title: 'В жб на Тех.Спеца',
	  content:
         '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B] Если вы не согласны с решением Технического специалиста, обратитесь в раздел жалоб на Технических Специалистов. [/B][/FONT][/SIZE]<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
"[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], Закрыто. [/FONT][/SIZE][/CENTER]<br>" +
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Администрация сервера [COLOR=rgb(139, 0, 255)]Purple.[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
	      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
                     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Жалоба одобрена ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
        	  title: 'На рассмотрение',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Ваша жалоба взята на рассмотрение. Ожидайте ответа в данной теме. Не создавайте повторные темы в противном случае Вы можете получить блокировку форумного аккаунта.[/B][/FONT][/SIZE]<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
"[CENTER][COLOR=rgb(250, 197, 28)]На рассмотрении[/COLOR]. [/FONT][/SIZE][/CENTER]<br>" +
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Администрация сервера [COLOR=rgb(139, 0, 255)]Purple.[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
	       prefix: PINN_PREFIX,
      status: true,
    },
	{
                        	  title: 'Беседа с адм',
	  content:
         '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Ваша жалоба одобрена с Администратором будет проведена беседа.. [/B][/FONT][/SIZE]<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
 "[CENTER][COLOR=rgb(65, 168, 95)]Одобрено[/COLOR], закрыто. [/FONT][/SIZE][/CENTER]<br>" +
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Администрация сервера [COLOR=rgb(139, 0, 255)]Purple.[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
	     prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
                                	  title: 'Наказание адм',
	  content:
         '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Ваша жалоба одобрена в сторону Администратора будут применины меры.[/B][/FONT][/SIZE]<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
         "[CENTER][COLOR=rgb(65, 168, 95)]Одобрено[/COLOR], закрыто. [/FONT][/SIZE][/CENTER]<br>" +
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Администрация сервера [COLOR=rgb(139, 0, 255)]Purple.[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
	     prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
                                	  title: 'Админ ошибся',
	  content:
         '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Администратор допустил ошибку,приносим свои извинения. [/B][/FONT][/SIZE]<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
         "[CENTER][COLOR=rgb(65, 168, 95)]Одобрено[/COLOR], закрыто. [/FONT][/SIZE][/CENTER]<br>" +
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Администрация сервера [COLOR=rgb(139, 0, 255)]Purple.[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
	     prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
                             title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Передача жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
        title: 'Глвному Администратору',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Ваша жалоба передана [COLOR=rgb(255, 0, 0)]Главноу Администратору @Den_Medvedev . <br>[COLOR=rgb(255, 255, 255)]Ожидайте ответа в данной теме. Не создавайте повторные темы в противном случае Вы можете получить блокировку форумного аккаунта.[/B][/FONT][/SIZE]<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
"[CENTER][COLOR=rgb(255, 0, 0)]Главному Администратору[/COLOR]. [/FONT][/SIZE][/CENTER]<br>" +
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Администрация сервера [COLOR=rgb(139, 0, 255)]Purple.[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
       prefix: GA_PREFIX,
      status: true,
    },
    {
                	  title: 'Специальному Администратору',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Ваша жалоба передана [COLOR=rgb(255, 0, 0)]Специальному Администратору @Sander_Kligan . <br>[COLOR=rgb(255, 255, 255)]Ожидайте ответа в данной теме. Не создавайте повторные темы в противном случае Вы можете получить блокировку форумного аккаунта.[/B][/FONT][/SIZE]<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
"[CENTER][COLOR=rgb(255, 0, 0)]Специальному Администратору[/COLOR]. [/FONT][/SIZE][/CENTER]<br>" +
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Администрация сервера [COLOR=rgb(139, 0, 255)]Purple.[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
       prefix: SPECY_PREFIX,
      status: true,
    },
    {
        	  title: 'Руководителю Модераторов',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Ваша жалоба передана [COLOR=rgb(128, 166, 255)]Руковдителю Модераторов @sakaro . <br>[COLOR=rgb(255, 255, 255)]Ожидайте ответа в данной теме. Не создавайте повторные темы в противном случае Вы можете получить блокировку форумного аккаунта.[/B][/FONT][/SIZE]<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
"[CENTER][COLOR=rgb(128, 166, 255)][/COLOR]Руководителю Модераторов. [/FONT][/SIZE][/CENTER]<br>" +
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Администрация сервера [COLOR=rgb(139, 0, 255)]Purple.[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
       prefix: PINN_PREFIX,
      status: true,
    },
	{
             title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отказ жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
                                                	  title: 'Нет time',
	  content:
         '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]В ваших доказательствах отсутствует /time.[/B][/FONT][/SIZE]<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], Закрыто. [/FONT][/SIZE][/CENTER]<br>" +
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Администрация сервера [COLOR=rgb(139, 0, 255)]Purple.[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
	      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
                                        	  title: 'Не по теме',
	  content:
         '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Ваше сообщение никоим образом не относится к предназначению данного раздела.[/B][/FONT][/SIZE]<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], Закрыто. [/FONT][/SIZE][/CENTER]<br>" +
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Администрация сервера [COLOR=rgb(139, 0, 255)]Purple.[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
	      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
                                                	  title: 'Ответ дан ранее',
	  content:
         '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Вам уже ранее был дан корректный ответ, за создание дубликатов этой темы ваш форумный аккаунт может быть заблокирован.[/B][/FONT][/SIZE]<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], Закрыто. [/FONT][/SIZE][/CENTER]<br>" +
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Администрация сервера [COLOR=rgb(139, 0, 255)]Purple.[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
	      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
                                                	  title: 'Жалобу на Теха',
	  content:
         '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Обратитесь в раздел жалоб на Технических специалистов. [/B][/FONT][/SIZE]<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], Закрыто. [/FONT][/SIZE][/CENTER]<br>" +
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Администрация сервера [COLOR=rgb(139, 0, 255)]Purple.[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
	      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
                                                	  title: 'Недостаточно док-ев',
	  content:
         '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Недостаточно доказательств для корректного рассмотрения вашего обращения. [/B][/FONT][/SIZE]<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], Закрыто. [/FONT][/SIZE][/CENTER]<br>" +
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Администрация сервера [COLOR=rgb(139, 0, 255)]Purple.[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
	      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
                                                	  title: 'Нужен фрапс',
	  content:
         '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Недостаточно доказательств для корректного рассмотрения жалобы. В данном случае требуются видео - доказательства. [/B][/FONT][/SIZE]<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], Закрыто. [/FONT][/SIZE][/CENTER]<br>" +
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Администрация сервера [COLOR=rgb(139, 0, 255)]Purple.[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
	      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
                                                	  title: 'Док-ва отред',
	  content:
         '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Ваши доказательства были подвергнуты изменениям (редактированию), прикрепите оригинальные файлы. [/B][/FONT][/SIZE]<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], Закрыто. [/FONT][/SIZE][/CENTER]<br>" +
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Администрация сервера [COLOR=rgb(139, 0, 255)]Purple.[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
	      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
                                                	  title: 'Отсутвуют док-ва',
	  content:
         '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Отсутствуют доказательства - следовательно, жалоба рассмотрению не подлежит. [/B][/FONT][/SIZE]<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], Закрыто. [/FONT][/SIZE][/CENTER]<br>" +
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Администрация сервера [COLOR=rgb(139, 0, 255)]Purple.[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
	      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
                                                	  title: 'В Обжалования',
	  content:
         '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Обратитесь в раздел обжалований наказаний. [/B][/FONT][/SIZE]<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], Закрыто. [/FONT][/SIZE][/CENTER]<br>" +
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Администрация сервера [COLOR=rgb(139, 0, 255)]Purple.[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
	      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
                                                	  title: 'Прошло 48 часов',
	  content:
         '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Срок написания жалобы - 48 часов с момента выдачи наказания. [/B][/FONT][/SIZE]<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], Закрыто. [/FONT][/SIZE][/CENTER]<br>" +
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Администрация сервера [COLOR=rgb(139, 0, 255)]Purple.[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
	      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
                                                	  title: 'Не по форме',
	  content:
         '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Ваша жалоба составлена не по форме, или же не соответствует правилам подачи. Ознакомится с ними можно тут - [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.3429349/Правила-подачи-заявки-на-администрацию.1158730/']Кликабельно[/URL] [/B][/FONT][/SIZE]<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], Закрыто. [/FONT][/SIZE][/CENTER]<br>" +
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Администрация сервера [COLOR=rgb(139, 0, 255)]Purple.[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
	      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
                                                        	  title: 'Док-ва в соц.сетях',
	  content:
         '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Доказательства в социальных сетях (VK,Instagram,FaceBook) не принимаются, загрузите доказательства на фохостинг (Imgur,Yapix,Youtube). [/B][/FONT][/SIZE]<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], Закрыто. [/FONT][/SIZE][/CENTER]<br>" +
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Администрация сервера [COLOR=rgb(139, 0, 255)]Purple.[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
	      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
                                                                	  title: 'Админ прав',
	  content:
         '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
"[CENTER][B]Приветствую уважаемый(- ая) [COLOR=rgb(243, 121, 52)]{{ user.mention }}[/COLOR]. [/CENTER]<br>" +
"[CENTER] [IMG]https://i.yapx.ru/GFL6g.png[/IMG][/B][/FONT][/SIZE][/CENTER]<br>" +
"[SIZE=3][FONT=trebuchet ms][B]Нарушений со стороны администратора нет. [/B][/FONT][/SIZE]<br>" +
"[CENTER][SIZE=3][FONT=trebuchet ms][B][IMG]https://i.yapx.ru/GFL6g.png[/IMG][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], Закрыто. [/FONT][/SIZE][/CENTER]<br>" +
'[RIGHT][SIZE=3][FONT=trebuchet ms][B]С уважением Администрация сервера [COLOR=rgb(139, 0, 255)]Purple.[/COLOR][/B][/FONT][/SIZE][/RIGHT]',
	      prefix: CLOSE_PREFIX,
      status: false,
    },
];
 
 
 
 $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
    // Добавление кнопок при загрузке страницы
    addButton('На рассмотрение💫', 'pin');
    addButton('Важно💥', 'Vajno');
    addButton('Команде Проекта💥', 'teamProject');
    addButton('ГА', 'Ga');
    addButton('Спецу💥', 'Spec');
    addButton('Одобрено✅', 'accepted');
    addButton('Отказано⛔', 'unaccept');
    addButton('Теху', 'Texy');
    addButton('Решено✅', 'Resheno');
    addButton('Закрыто⛔', 'Zakrito');
    addButton('Реализовано💫', 'Realizovano');
    addButton('Рассмотрено✅', 'Rassmotreno');
    addButton('Ожидание', 'Ojidanie');
    addButton('Без префикса⛔', 'Prefiks');
    addButton('Проверено контролем качества', 'Kachestvo');
    addButton('Ответ💥', 'selectAnswer');
 
    // Поиск информации о теме
    const threadData = getThreadData();
 
    $('button#pin').click(() => editThreadData(PINN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, false));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, false));
    $('button#Texy').click(() => editThreadData(TEXY_PREFIX, false));
    $('button#Resheno').click(() => editThreadData(RESHENO_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
    $('button#Realizovano').click(() => editThreadData(REALIZOVANO_PREFIX, false));
    $('button#Vajno').click(() => editThreadData(VAJNO_PREFIX, false));
    $('button#Rassmotreno').click(() => editThreadData(RASSMOTRENO_PREFIX, false));
    $('button#Ojidanie').click(() => editThreadData(OJIDANIE_PREFIX, false));
    $('button#Prefiks').click(() => editThreadData(PREFIKS, false));
    $('button#Kachestvo').click(() => editThreadData(KACHESTVO, false));
 
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