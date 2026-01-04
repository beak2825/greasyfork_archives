// ==UserScript==
// @name         Скрипт для КФ/ЗГСФ/ГСФ || Blue
// @namespace    http://tampermonkey.net/
// @version      2.01
// @description  Скрипт для КФ/ЗГСФ/ГСФ
// @author       Dmitry_Floyver
// @match https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://i.postimg.cc/13kkNtx3/12.jpg
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/516040/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%D0%97%D0%93%D0%A1%D0%A4%D0%93%D0%A1%D0%A4%20%7C%7C%20Blue.user.js
// @updateURL https://update.greasyfork.org/scripts/516040/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%D0%97%D0%93%D0%A1%D0%A4%D0%93%D0%A1%D0%A4%20%7C%7C%20Blue.meta.js
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
title: ' >╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Для ЗГСФ и ГСФ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴<-)-)-)-|'
},
{    
 
title: '| Одобрено |',
	  content:
                 "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]" +
                 "[HEADING=2][CENTER][B][COLOR=lavender] {{ greeting }}, уважаемый {{ user.name }} [/COLOR][/B][/CENTER][/HEADING]"+
                 "[HEADING=3][CENTER][B][COLOR=lavender][SIZE=5]Ваша жалоба [COLOR=rgb(138, 43, 226)]одобрена[/COLOR], игрок будет наказан. [/SIZE][/COLOR][/B][/CENTER][/HEADING]"+
                 "[CENTER][B][COLOR=lavender][URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/COLOR]"+
                 "[B][SIZE=5][COLOR=lavender]Приятного времяпровождения на BLACK RUSSIA || BLUE[/COLOR].[/SIZE][/B][/B][/CENTER]",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{   
title: '| Обмен bc на ив и наоборот|',
	  content:
                  "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
                  "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый {{ user.name }} [/COLOR][/B][/CENTER][/HEADING][QUOTE]"+
                  "[HEADING=2][CENTER][COLOR=rgb(255, 255, 255)][SIZE=4]Игрок будет [/SIZE][/COLOR][COLOR=rgb(138, 43, 226)][SIZE=4]заблокирован[/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4] за обмен игровой валюты на BC.  Так же Ваш аккаунт будет заблокирован по пункту 2.28 (Обмен Игровой валюты на донат).[/SIZE][/COLOR][/CENTER][/HEADING][/QUOTE]"+
                  "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL]"+
                  "[HEADING=2][CENTER][SIZE=5]Приятного времяпровождения на Black Russia![/SIZE][/CENTER][/HEADING]",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{   
title: '| Не можем выдать наказание |',
	  content:
            "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
                 "[HEADING=2][CENTER][B][SIZE=5][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый {{ user.name }}[/COLOR][/SIZE][/B][/CENTER][/HEADING]"+
"[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] [SIZE=4]Ваша жалоба[/SIZE][/COLOR][COLOR=rgb(138, 43, 226)][SIZE=4] отказана[/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4], так как в данный момент [/SIZE][/COLOR][COLOR=rgb(138, 43, 226)][SIZE=4][I]мы не можем выдать наказание по данному пункту правил через жалобу, оставленную на форуме.[/I][/SIZE] [/COLOR][/B][/CENTER][/HEADING]"+
"[CENTER][URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
"[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
                 	  title: ' >╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Передача на рассмотрение╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴<-)-)-)-|'
},
{
	  title: '| На рассмотрение |',
	  content:
                 "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
                 "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
                 "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваша жалоба взята[/COLOR][COLOR=rgb(138, 43, 226)] на рассмотрение[/COLOR]                                                                                            [COLOR=rgb(255, 255, 255)]. Просьба не дублировать обращение, ожидайте ответа.[/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
                 "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
                 "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
        prefix: PINN_PREFIX,
	  status: true,
},
{
	  title: '| Тех. спецу |',
	  content:
                 "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
                 "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
                 "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваше обращение взято[/COLOR][COLOR=#8A2BE2] на рассмотрение тех. специалисту[/COLOR][COLOR=rgb(255, 255, 255)]. Просьба не дублировать обращение, ожидайте ответа.[/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
                 "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
                 "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
        prefix: TEXY_PREFIX,
	  status: true,
},
{
	  title: '|(-(-(--(->╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отказ жалобы╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴<-)--)-)-)-|'
},
{

title: '| Нарушений не найдено |',
	  content:
                 "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
                 "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
                 "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваше обращение - [I][COLOR=#8A2BE2]отказано[/I][/COLOR][COLOR=#FFFFFF], так как нарушений со стороны игрока - не выявлено.[/COLOR][COLOR=rgb(255, 255, 255)][/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
                 "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
                 "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Возврат средств |',
	  content:
                 "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
                 "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
                 "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваше обращение - [I][COLOR=#8A2BE2]отказано[/I][/COLOR][COLOR=#FFFFFF], так как нарушений со стороны игрока - не выявлено.[/COLOR][COLOR=rgb(255, 255, 255)][/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
                 "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
                 "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
	  status: false,
},
{
	  title: '| Недостаточно док-в |',
	  content:
                "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
                "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
                "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваше обращение - [I][COLOR=#8A2BE2]отказано[/I][/COLOR][COLOR=#FFFFFF], так как доказательств на нарушение недостаточно.[/COLOR][COLOR=rgb(255, 255, 255)][/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
                "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
                "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Док-ва не работают |',
	  content:
      "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
      "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваше обращение - [I][COLOR=#8A2BE2]отказано[/I][/COLOR][COLOR=#FFFFFF], так как доказательства на нарушение не работают.[/COLOR][COLOR=rgb(255, 255, 255)][/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
      "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Отсутствуют док-ва |',
	  content:
      "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
      "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваше обращение - [I][COLOR=#8A2BE2]отказано[/I][/COLOR][COLOR=#FFFFFF], так как отсутствуют доказательства.[/COLOR][COLOR=rgb(255, 255, 255)][/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
      "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва отредактированы |',
	  content:
      "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
      "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваше обращение - [I][COLOR=#8A2BE2]отказано[/I][/COLOR][COLOR=#FFFFFF], так как было выявлено редактирование доказательств.[/COLOR][COLOR=rgb(255, 255, 255)][/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
      "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Док-ва в вертикальном формате |',
	  content:
      "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
      "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваше обращение - [I][COLOR=#8A2BE2]отказано[/I][/COLOR][COLOR=#FFFFFF], так как доказательства в предоставленном формате не подлежат рассмотрению.[/COLOR][COLOR=rgb(255, 255, 255)][/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
      "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Док-ва плохого качества |',
	  content:
      "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
      "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваше обращение - [I][COLOR=#8A2BE2]отказано[/I][/COLOR][COLOR=#FFFFFF], так как доказательства плохого качества. Попробуйте дождаться полной загрузки видеоролика на видео-хостинге.[/COLOR][COLOR=rgb(255, 255, 255)][/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
      "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Ник нарушаемого не совпадает с док-вами |',
	  content:
      "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
      "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваше обращение - [I][COLOR=#8A2BE2]отказано[/I][/COLOR][COLOR=#FFFFFF], так как никнейм нарушителя не совпадает с никнеймом на фрапсе.[/COLOR][COLOR=rgb(255, 255, 255)][/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
      "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Не относится к Жалобам на игроков |',
	  content:
                 "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
                 "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
                 "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваше обращение [I][COLOR=#8A2BE2]отказано[/I][/COLOR][COLOR=#FFFFFF], так как оно относится к нашему разделу.[/COLOR][COLOR=rgb(255, 255, 255)].[/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
                 "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
                 "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Дублирование темы |',
	  content:
      "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
      "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваше обращение - [I][COLOR=#8A2BE2]отказано[/I][/COLOR][COLOR=#FFFFFF], так как тема продублирована, если вы продолжите ее дублировать, то вам может быть выдана блокировка ФА.[/COLOR][COLOR=rgb(255, 255, 255)][/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
      "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Тема не относится к разделу |',
	  content:
      "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
      "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваше обращение [I][COLOR=#8A2BE2]отказано[/I][/COLOR][COLOR=#FFFFFF], так как оно относится к разделу жалоб на игроков.[/COLOR][COLOR=rgb(255, 255, 255)].[/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
      "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Недостаточно док-в (DM) |',
	  content:
      "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
      "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваше обращение [I][COLOR=#8A2BE2]отказано[/I][/COLOR][COLOR=#FFFFFF], так как по данным доказательствам нельзя изучить полную ситуацию.[/COLOR][COLOR=rgb(255, 255, 255)].[/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
      "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
 
title: '| Данный вид сделки, не является нонрп обманом |',
	  content:
      "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
      "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваше обращение [I][COLOR=#8A2BE2]отказано[/I][/COLOR][COLOR=#FFFFFF], так как данный вид сделки не является NRP Обманом.[/COLOR][COLOR=rgb(255, 255, 255)].[/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
      "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Слив склада семьи (Что требуется показать игроку) |',
	  content:
      "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
      "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваше обращение [I][COLOR=#8A2BE2]отказано[/I][/COLOR][COLOR=#FFFFFF], так как оно составлено не по правилам. Предоставьте Фрапс следующим образом: [LIST][*]Предоставьте Фрапс следующим образом:[*]На фрапсе должен быть прописан /time.[*]Должны быть показаны семейные логи где четко видно нарушение (Выделить строки с нарушением(-и) игрока(-ов).[*]В сути жалобы уточнить являетесь ли Вы лидером семьи.[/LIST].[/COLOR][COLOR=rgb(255, 255, 255)].[/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
      "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Слив семьи (Заместителем) |',
	  content:
      "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
      "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваше обращение [I][COLOR=#8A2BE2]отказано[/I][/COLOR][COLOR=#FFFFFF], так как администрация не несет ответственности за потери при сливе семьи ее заместителем.[/COLOR][COLOR=rgb(255, 255, 255)].[/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
      "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Не по форме |',
	  content:
      "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
      "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваше обращение [I][COLOR=#8A2BE2]отказано[/I][/COLOR][COLOR=#FFFFFF], так как жалоба составлена не по форме, ознакомьтесь с правилами подачи в закрепленном сообщении раздела.[/COLOR][COLOR=rgb(255, 255, 255)].[/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
      "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Заголовок не по форме |',
	  content:
      "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
      "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваше обращение [I][COLOR=#8A2BE2]отказано[/I][/COLOR][COLOR=#FFFFFF], так как заголовок жалобы не по форме, ознакомьтесь с правилами подачи в закрепленном сообщении раздела.[/COLOR][COLOR=rgb(255, 255, 255)].[/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
      "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нет /time |',
	  content:
      "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
      "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваше обращение [I][COLOR=#8A2BE2]отказано[/I][/COLOR][COLOR=#FFFFFF], так как на доказательствах отсутствует /time.[/COLOR][COLOR=rgb(255, 255, 255)].[/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
      "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нет time кодов|',
	  content:
      "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
      "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваше обращение [I][COLOR=#8A2BE2]отказано[/I][/COLOR][COLOR=#FFFFFF], так как при видеодоказательстве длительностью более 3-ех минут нужны тайм-коды.[/COLOR][COLOR=rgb(255, 255, 255)].[/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
      "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '|Time коды не по форме|',
	  content:
      "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
      "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваше обращение [I][COLOR=#8A2BE2]отказано[/I][/COLOR][COLOR=#FFFFFF], так как тайм-коды не по форме.[/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
      "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Более 72-х часов |',
	  content:
      "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
      "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваше обращение [I][COLOR=#8A2BE2]отказано[/I][/COLOR][COLOR=#FFFFFF] так как прошло более 72-ух часов с момента нарушения игрока.[/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
      "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва соц сеть |',
	  content:
      "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
      "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваше обращение [I][COLOR=#8A2BE2]отказано[/I][/COLOR][COLOR=#FFFFFF], доказательства загруженные в соц. сетях, не подлежат рассмотрению. Для загрузки фото можно воспользоваться: Imgur, Япикс, Postimages. Для видео: YouTube [/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
      "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Условия сделки |',
	  content:
      "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
      "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваше обращение [I][COLOR=#8A2BE2]отказано[/I][/COLOR][COLOR=#FFFFFF], так как условия сделки отсутствуют.[/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
      "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нужен фрапс |',
	  content:
      "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
      "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваше обращение [I][COLOR=#8A2BE2]отказано[/I][/COLOR][COLOR=#FFFFFF], так как при фиксации данного нарушения необходим фрапс.[/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
      "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
    	  title: '| Промотка чата |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/X7NHmW8Y/image.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша обращение [COLOR=#FF0000]отказано[/COLOR], так как нужен фрапс + промотка чата. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=blue]BLUE[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/yNNSJpc8/2022-12-09-15-49-54.gif[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Фрапс обрывается |',
	  content:
      "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
      "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваше обращение [I][COLOR=#8A2BE2]отказано[/I][/COLOR][COLOR=#FFFFFF], так как фрапс обрывается.[/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
      "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва не открываются |',
	  content:
      "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
      "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваше обращение [I][COLOR=#8A2BE2]отказано[/I][/COLOR][COLOR=#FFFFFF], так как док-ва не открываются.[/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
      "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Жалоба от 3-го лицо (Никнейм подавшего не совпадает)|',
	  content:
      "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
      "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваше обращение [I][COLOR=#8A2BE2]отказано[/I][/COLOR][COLOR=#FFFFFF], так как Ваш никнейм не совпадает с доказательствами[/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
      "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Ошиблись сервером|',
	  content:
      "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
      "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваше обращение [I][COLOR=#8A2BE2]отказано[/I][/COLOR][COLOR=#FFFFFF], так как Вы ошиблись сервером.[/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
      "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Долг не через банк|',
	  content:
      "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
      "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваше обращение [I][COLOR=#8A2BE2]отказано[/I][/COLOR][COLOR=#FFFFFF], так как долг должен передаваться через банк.[/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
      "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| 10 дней после срока долга|',
	  content:
      "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
      "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваше обращение [I][COLOR=#8A2BE2]отказано[/I][/COLOR][COLOR=#FFFFFF], так как прошло более 10 дней после срока долга.[/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
      "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Оскорбление в IC |',
	  content:
      "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
      "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваше обращение [I][COLOR=#8A2BE2]отказано[/I][/COLOR][COLOR=#FFFFFF], так как оскорбление в IC (RolePlay) чате не наказуемо.[/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
      "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Условия сделки (Нету суммы дп) |',
	  content:
      "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
      "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваше обращение [I][COLOR=#8A2BE2]отказано[/I][/COLOR][COLOR=#FFFFFF], так как в условиях сделки отсутствует сумма доплаты.[/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
      "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Долг (нету срока займа) |',
	  content:
      "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
      "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваше обращение [I][COLOR=#8A2BE2]отказано[/I][/COLOR][COLOR=#FFFFFF], так как в условиях займа не указан срок возрата.[/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
      "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Оск в жалобе |',
	  content:
      "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
      "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваше обращение [I][COLOR=#8A2BE2]отказано[/I][/COLOR][COLOR=#FFFFFF], так как в жалобе присутствуют оскорбления.[/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
      "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Оск в названии док-в |',
	  content:
      "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
      "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваше обращение [I][COLOR=#8A2BE2]отказано[/I][/COLOR][COLOR=#FFFFFF], так как в названии доказательств присутствуют оскорбления.[/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
      "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '|(-(-(-(-(->╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴RolePlay Биографии╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴<-)-)-)-)-)-|'
},
{
        	  title: '| Био одобрена |',
	  content:
      "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
      "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваша биография [I][COLOR=#8A2BE2]одобрена[/I][/COLOR][COLOR=#FFFFFF].[/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
      "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
    prefix: ACCСEPT_PREFIX,
	  status: false,
},
  {
    	  title: '| Био отказ (Форма) |',
	  content:
      "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
      "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваша биография [I][COLOR=#8A2BE2]отказана[/I][/COLOR][COLOR=#FFFFFF], так как нарушены правила написания RP Биографии.[/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
      "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
          	  title: '| Био отказ (Мало инфы) |',
	  content:
      "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
      "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваша биография [I][COLOR=#8A2BE2]отказана[/I][/COLOR][COLOR=#FFFFFF], так как недостаточно RolePlay информации о Вашем персонаже.[/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
      "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Скопирована) |',
	  content:
      "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
      "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваша биография [I][COLOR=#8A2BE2]отказана[/I][/COLOR][COLOR=#FFFFFF], так как она скопирована.[/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
      "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Заголовок) |',
	  content:
      "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
      "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваша биография [I][COLOR=#8A2BE2]отказана[/I][/COLOR][COLOR=#FFFFFF], так как заголовок не по форме.[/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
      "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (3-е лицо) |',
	  content:
      "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
      "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваша биография [I][COLOR=#8A2BE2]отказана[/I][/COLOR][COLOR=#FFFFFF], так как повествование в ней ведеться от 3-го лица.[/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
      "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Возраст не совпал) |',
	  content:
      "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
      "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваша биография [I][COLOR=#8A2BE2]отказана[/I][/COLOR][COLOR=#FFFFFF], так как возраст не совпал с указанной датой рождения.[/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
      "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Возраст мал) |',
	  content:
      "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
      "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваша биография [I][COLOR=#8A2BE2]отказана[/I][/COLOR][COLOR=#FFFFFF], так как возраст не соответствует минимальному.[/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
      "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
title: '| Био отказ (Возраст велик) |',
	  content:
      "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
      "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваша биография [I][COLOR=#8A2BE2]отказана[/I][/COLOR][COLOR=#FFFFFF], так как указанный возраст превышает максимальный.[/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
      "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
title: '| Био отказ (Ошибки) |',
	  content:
      "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
      "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваша биография [I][COLOR=#8A2BE2]отказана[/I][/COLOR][COLOR=#FFFFFF], так как обнаружено много ошибок.[/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
      "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
title: '| Био отказ (Нонрп ник) |',
	  content:
      "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
      "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваша биография [I][COLOR=#8A2BE2]отказана[/I][/COLOR][COLOR=#FFFFFF], так как Ваш никнейм не соответствует критериям RP никнейма.[/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
      "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
title: '| Био на дополнение |',
	  content:
      "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
      "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваша биография [I][COLOR=#8A2BE2]на дополнении[/I][/COLOR][COLOR=#FFFFFF], Вам дается 24 часа для дополнения информации в Вашей биографии.[/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
      "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
        prefix: PINN_PREFIX,
	  status: true,
},
  {
title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴РП ситуации╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
title: '| РП ситуация одобрено |',
	  content:
      "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
      "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваша РП Ситуация - [I][COLOR=#8A2BE2]одобрена[/I][/COLOR][COLOR=#FFFFFF].[/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
      "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
    prefix: ACCСEPT_PREFIX,
	  status: false,
},
  {
 
 title: '| РП ситуация отказ. |',
	  content:
      "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
      "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваша РП ситуация - [I][COLOR=#8A2BE2]отказана[/I][/COLOR][COLOR=#FFFFFF].[/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
      "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
 
title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Неофициал. орг.╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
title: '| Неофициальная Орг. Одобрено|',
	  content:
      "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
      "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваша Неофициальная РП Организация - [I][COLOR=#8A2BE2]одобрена[/I][/COLOR][COLOR=#FFFFFF].[/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
      "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
    prefix: ACCСEPT_PREFIX,
	  status: false,
},
  {
 
title: '| Неофициальная Орг. Отказ |',
	  content:
      "[CENTER][URL='https://postimages.org/'][IMG]https://i.postimg.cc/X7NHmW8Y/image.gif[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER][B][COLOR=rgb(255, 255, 255)] {{ greeting }}, уважаемый [B]{{ user.name }}[/B][/COLOR][/B][/CENTER][/HEADING]"+
      "[HEADING=2][CENTER][B][SIZE=4][COLOR=rgb(255, 255, 255)] Ваша Неофициальная РП Организация - [I][COLOR=#8A2BE2]отказана[/I][/COLOR][COLOR=#FFFFFF].[/COLOR][/SIZE][/B][/CENTER][/HEADING][CENTER]"+
      "[URL='https://postimg.cc/XpswHptJ'][IMG]https://i.postimg.cc/T36CPb9r/image-1.png[/IMG][/URL][/CENTER]"+
      "[HEADING=2][CENTER]Приятного времяпровождения на Black Russia![/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
},
 
];
 
$(document).ready(() => { 
 // Загрузка скрипта для обработки шаблонов 
 $(`body`).append(`<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`); 
 
 // Добавление кнопок при загрузке страницы 
 addButton(`Выбор автоматических ответов`, `selectAnswer`); 
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