// ==UserScript==
// @name         BLACK RUSSIA GROZNY || Скрипт для ГС/ЗГС ГОСС.
// @namespace    https://forum.blackrussia.online
// @version      0.1
// @description  Специально для BlackRussia || GROZNY by A.Logvinov
// @author       Alexey_Logvinov
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license      MIT
// @collaborator QuenkM
// @icon data:image/jpeg;base64,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
// @downloadURL https://update.greasyfork.org/scripts/458492/BLACK%20RUSSIA%20GROZNY%20%7C%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20%D0%93%D0%9E%D0%A1%D0%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/458492/BLACK%20RUSSIA%20GROZNY%20%7C%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20%D0%93%D0%9E%D0%A1%D0%A1.meta.js
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
      title: 'На рассмотрение',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба взята на рассмотрение, пожалуйста не создавайте дубликатов. Ожидайте ответа.<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрение[/ICODE][/COLOR][/CENTER][/B]' +
          "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 100, 0)][B][SIZE=1]GROZNY [/SIZE][/B][/COLOR]",
      prefix: NARASSMOTRENIIRP_PREFIX,
	  status: true,
         },
    {
          title: '╴╴╴╴╴╴╴╴Заявление на пост лидера╴╴╴╴╴╴╴╴',
        content:
        '[CENTER][B]Доброго времени суток, каждый из игроков подходящий по критериям ниже имеет право оставить это заявление, и побороться за лидерство. Помните главное, данный пост это серьезный шаг, делая его Вы соглашаетесь со всеми критериями, а так же понимаете то что должны будете отдавать игре много времени, для поддержания стабильной работы вашей организации. Только после понимания того на что вы идете, пишите это заявление и просим вас не тратить наше время на то, чтобы проверить бессмысленные заявления!' +
'[COLOR=rgb(255, 0, 0)][SIZE=4]Критерии для подачи заявления на пост лидера:[/SIZE][/COLOR]' +
'[COLOR=rgb(255, 255, 0)]1) [/COLOR][I]Игровой уровень не менее 8-ого.[/I]' +
'[COLOR=rgb(255, 255, 0)]2) [/COLOR][I]Не иметь действующих наказаний. Минимальный суточный онлайн 3 часа.[/I]' +
'[COLOR=rgb(255, 255, 0)]3)[/COLOR] [I]Реальный возраст от 15 лет (Без исключений).[/I]' +
'[COLOR=rgb(255, 255, 0)]4)[/COLOR] [I]Знание правил Role-Play и правила отыгровок RP.[/I]' +
'[COLOR=rgb(255, 255, 0)]5) [/COLOR][I]Открытый профиль в "VK", дабы была возможность добавлять в беседы.[/I][/B]' +
'                                                 ' +
'[COLOR=rgb(255, 0, 0)][B][SIZE=4]Примечание:[/SIZE][/B][/COLOR] [I]Если вы не выполнили/не подходите по вышеперечисленным критериям, следящая администрация[B][COLOR=rgb(255, 0, 0)] имеет право вам отказать[/COLOR][/B] в заявление на пост «Лидера».' +
'                                                 ' +
'[B][SIZE=4][COLOR=rgb(255, 0, 0)]Форма подачи заявления:[/COLOR][/SIZE]' +
'                                                 ' +
'                                                 ' +
'[COLOR=rgb(0, 255, 0)][SIZE=4]IС информация:[/SIZE][/COLOR]' +
'1) Ваш ник:' +
'2) Ваш игровой уровень:' +
'3) Ваша статистика (/stats):' +
'4) Скриншот лицензий (/lic):' +
"5) Скриншот истории смены игровых NickName'ов (/history):" +
'6) Ваша RolePlay биография [Одобренная]:' +
'                                                                          ' +
'                                                                          ' +
'[COLOR=rgb(0, 255, 0)][SIZE=4]ООС информация:[/SIZE][/COLOR]' +
'1) Ваше реальное имя и фамилия:' +
'2) Ваш возраст:' +
'3) Страна город/страна проживания:' +
'4) Часовой пояс (указать в часах от мск):' +
'5) Ваш средний суточный онлайн:' +
'6) Расскажите о себе (чем увлекаетесь, занимаетесь в свободное время):' +
'7) Почему именно вы должны занять данный пост, и администрация должна выбрать именно вас?:' +
'8) Имеется ли опыт на посту лидера:' +
'9) Как вы оцените свою грамотность по 10 бальной шкале?' +
'10) Представьте ситуацию - У вас завязался сильный конфликт с лидером другой организации, ваши действия и рассуждения в данной ситуации? Как Вы будете решать эту ситуацию?:' +
'11) Вы сможете удерживать members 30+ стабильно?:' +
'12) Ваш логин в Discord:' +
'13) Ссылка на Вашу страничку VK:[/B] [/I]' +
'                                                 ' +
'[COLOR=rgb(255, 0, 0)][SIZE=4][B]Примечание:[/B][/SIZE][/COLOR][I][COLOR=rgb(255, 0, 0)][SIZE=4] [/SIZE][/COLOR]' +
'[COLOR=rgb(255, 255, 0)][B]1. [/B][/COLOR][COLOR=rgb(220, 20, 60)]В анкетах всегда поощряется полное описание всего! Меньше воды, больше интересной информации дабы мы могли представить Вас как личность! Заявки(анкеты), это тоже один из важнейших этапов прохождения на пост лидерства, отнеситесь к этому очень серьезно! [/COLOR]' +
'                                                 ' +
'[B][COLOR=rgb(255, 255, 0)]2.[/COLOR] [/B][COLOR=rgb(220, 20, 60)]Чьи анкеты по мнению администрации не несут в себе достаточной информации, могут быть отклонены или удалены без объяснения причины!3. Все скриншоты должны быть с /time.4. Скриншоты должны быть сделаны после открытия заявок на пост лидера фракции.5. Ваша страница в ВК не должна быть "Фейком".6. Нельзя занимать места в заявках. За нарушение этого, Ваше сообщение будет удалено.[/COLOR][/I]' +
'                                                 ' +
'[COLOR=rgb(255, 0, 0)][B][SIZE=4]ВАЖНО: [/SIZE][/B][/COLOR][I][COLOR=rgb(220, 20, 60)] Обман администрации даже в анкетах, несет за собой нарушение правил проекта, а именно "2.34. Запрещен обман администрации",Если, у Вас есть уверенность в том, что Вам действительно нужен данный пост - Вы можете подавать заявку. Если Вы не уверены, что сможете отстоять хотя бы 15дней, не стоит совершать данный поступок.Помните, что при уходе с данного поста, при этом не отстояв срок в 15 дней, Вы получить блокировку аккаунта на 15 дней. [/COLOR][/I]' +
'                                                 ' +
'[B][COLOR=rgb(255, 0, 0)][SIZE=5]До обзвона подготовить улучшения, которые озвучивать нужно на обзвоне, в заявке их писать не нужно.[/SIZE][/COLOR][/B]' +
'                                                 ' +
'                                                 ' +
  "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 100, 0)][B][SIZE=1]GROZNY [/SIZE][/B][/COLOR]",
  prefix: NARASSMOTRENIIRP_PREFIX,
       status: true,
	 },
    {
 title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Одобрение жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Будет проведена беседа с лидером',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Ваша жалоба была одобрена, с лидером проведена беседа! Спасибо за информацию.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Green][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]' +
          "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 100, 0)][B][SIZE=1]GROZNY [/SIZE][/B][/COLOR]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
        title:'Будет проведена беседа с заместителем',
        content:
       '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Ваша жалоба была одобрена, с заместителем проведена беседа! Спасибо за информацию.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Green][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]' +
          "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 100, 0)][B][SIZE=1]GROZNY [/SIZE][/B][/COLOR]",
        prefix:ACCСEPT_PREFIX,
        status: false,
        },
    {

     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отказ жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
        title:'Отсутствует /time',
        content:
       '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]На доказательствах отсуствует /time.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Отказано, закрыто.[/color][/SIZE][/CENTER][/B]' +
          "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 100, 0)][B][SIZE=1]GROZNY [/SIZE][/B][/COLOR]",
        prefix:UNACCСEPT_PREFIX,
        status: false,
    },
    {
        title:'Срок написания жалобы составляет два дня',
        content:
       '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]3.1. Срок написания жалобы составляет два дня (48 часов) с момента совершенного нарушения со стороны лидера сервера.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Закрыто.[/color][/SIZE][/CENTER][/B]' +
           "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 100, 0)][B][SIZE=1]GROZNY [/SIZE][/B][/COLOR]",
        prefix:CLOSE_PREFIX,
        status: false,
    },
     {
        title:'Жалоба от 3-го лица',
        content:
       '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]3.3. Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации).[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Закрыто.[/color][/SIZE][/CENTER][/B]' +
           "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 100, 0)][B][SIZE=1]GROZNY [/SIZE][/B][/COLOR]",
        prefix:CLOSE_PREFIX,
        status: false,
    },
     {
         title:'Отсутствуют доказательства',
        content:
       '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]В вашей жалобе отсутсвуют доказательства о нарушении лидера/заместителя[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Закрыто.[/color][/SIZE][/CENTER][/B]' +
               "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 100, 0)][B][SIZE=1]GROZNY [/SIZE][/B][/COLOR]",
        prefix:CLOSE_PREFIX,
        status: false,
    },
    {
        title:'Проверив доказательства от лидера выговор были выданы верно',
        content:
       '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Проверив опровержение лидера, выговор вам был выдан верно.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Отказано, закрыто.[/color][/SIZE][/CENTER][/B]' +
          "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 100, 0)][B][SIZE=1]GROZNY [/SIZE][/B][/COLOR]",
        prefix:UNACCСEPT_PREFIX,
        status: false,
    },
    {
        title:'Проверив доказательства от заместителя выговор были выданы верно',
        content:
       '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Проверив опровержение заместителя, выговор вам был выдан верно.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Отказано, закрыто.[/color][/SIZE][/CENTER][/B]' +
          "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 100, 0)][B][SIZE=1]GROZNY [/SIZE][/B][/COLOR]",
        prefix:UNACCСEPT_PREFIX,
        status: false,
     },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила Гос.Структур╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правительство╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
     {
      title: 'Запрещено выдавать лицензии без Role PLay отыгровок (одобрено)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете проинструктированы по данному пункту правил: 3.01. Запрещена выдача лицензий без Role Play отыгровок.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Green][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]' +
           "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 100, 0)][B][SIZE=1]GROZNY [/SIZE][/B][/COLOR]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Запрещено выдавать лицензии без Role PLay отыгровок (отказано)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете проинструктированы по данному пункту правил: 3.01. Запрещена выдача лицензий без Role Play отыгровок.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Отказано, закрыто.[/color][/SIZE][/CENTER][/B]' +
           "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 100, 0)][B][SIZE=1]GROZNY [/SIZE][/B][/COLOR]",
      prefix:UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Запрещено оказывать услуги адвоката без Role PLay отыгровок (одобрено)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете проинструктированы по данному пункту правил: 3.02. Запрещено оказание услуг адвоката без Role Play отыгровок.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Green][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]' +
          "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 100, 0)][B][SIZE=1]GROZNY [/SIZE][/B][/COLOR]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
      {
      title: 'Запрещено оказывать услуги адвоката без Role PLay отыгровок (отказано)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете проинструктированы по данному пункту правил: 3.02. Запрещено оказание услуг адвоката без Role Play отыгровок.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Отказано, закрыто.[/color][/SIZE][/CENTER][/B]' +
            "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 100, 0)][B][SIZE=1]GROZNY [/SIZE][/B][/COLOR]",
       prefix:UNACCСEPT_PREFIX,
      status: false,
      },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴УФСБ (ФСБ)╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
     {
      title: 'Запрещено наносить урон игрокам без Role Play причины на территории ФСБ (одобрено)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете наказаны по данному пункту правил: 8.01. Запрещено наносить урон игрокам без Role Play причины на территории ФСБ | DM / Jail 60 минут / Warn.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Green][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]' +
           "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 100, 0)][B][SIZE=1]GROZNY [/SIZE][/B][/COLOR]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Запрещено наносить урон игрокам без Role Play причины на территории ФСБ (отказано)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете наказаны по данному пункту правил: 8.01. Запрещено наносить урон игрокам без Role Play причины на территории ФСБ | DM / Jail 60 минут / Warn.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Отказано, закрыто.[/color][/SIZE][/CENTER][/B]' +
           "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 100, 0)][B][SIZE=1]GROZNY [/SIZE][/B][/COLOR]",
      prefix:UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Запрещено выдавать розыск без Role Play причины (одобрено)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете наказаны по данному пункту правил: 8.02. Запрещено выдавать розыск без Role Play причины | Jail 30 минут.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Green][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]' +
          "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 100, 0)][B][SIZE=1]GROZNY [/SIZE][/B][/COLOR]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Запрещено выдавать розыск без Role Play причины (отказано)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете наказаны по данному пункту правил: 8.02. Запрещено выдавать розыск без Role Play причины | Jail 30 минут.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Отказано, закрыто.[/color][/SIZE][/CENTER][/B]' +
           "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 100, 0)][B][SIZE=1]GROZNY [/SIZE][/B][/COLOR]",
      prefix:UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Запрещено оказывать задержание без Role Play отыгровки (одобрено)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете наказаны по данному пункту правил: 8.03. Запрещено оказывать задержание без Role Play отыгровки | Warn[/color][/SIZE][/CENTER][/B]' +
		'[Color=Green][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]' +
          "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 100, 0)][B][SIZE=1]GROZNY [/SIZE][/B][/COLOR]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Запрещено оказывать задержание без Role Play отыгровки (отказано)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете наказаны по данному пункту правил: 8.03. Запрещено оказывать задержание без Role Play отыгровки | Warn[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Отказано, закрыто.[/color][/SIZE][/CENTER][/B]' +
          "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 100, 0)][B][SIZE=1]GROZNY [/SIZE][/B][/COLOR]",
      prefix:UNACCСEPT_PREFIX,
      status: false,
    },
     {
      title: 'Запрещено использовать маскировку в личных целях (одобрено)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете проинструктированы по данному пункту правил: 8.04. Запрещено использовать маскировку в личных целях[/color][/SIZE][/CENTER][/B]' +
		'[Color=Green][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]' +
           "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 100, 0)][B][SIZE=1]GROZNY [/SIZE][/B][/COLOR]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Запрещено использовать маскировку в личных целях (отказано)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете проинструктированы по данному пункту правил: 8.04. Запрещено использовать маскировку в личных целях[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Отказано, закрыто.[/color][/SIZE][/CENTER][/B]' +
          "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 100, 0)][B][SIZE=1]GROZNY [/SIZE][/B][/COLOR]",
      prefix:UNACCСEPT_PREFIX,
      status: false,
    },
     {
      title: 'Запрещено безосновательное увольнение сотрудников силовых структур (одобрено)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете проинструктированы по данному пункту правил: 8.05. Запрещено безосновательное увольнение сотрудников силовых структур (УМВД, Армия, ГИБДД)[/color][/SIZE][/CENTER][/B]' +
		'[Color=Green][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]' +
           "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 100, 0)][B][SIZE=1]GROZNY [/SIZE][/B][/COLOR]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
      {
      title: 'Запрещено безосновательное увольнение сотрудников силовых структур (отказано)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете проинструктированы по данному пункту правил: 8.05. Запрещено безосновательное увольнение сотрудников силовых структур (УМВД, Армия, ГИБДД)[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Отказано, закрыто.[/color][/SIZE][/CENTER][/B]' +
            "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 100, 0)][B][SIZE=1]GROZNY [/SIZE][/B][/COLOR]",
      prefix:UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Запрещено проводить обыск игрока без Role Play отыгровки. (одобрено)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете проинструктированы по данному пункту правил: 8.06. Запрещено проводить обыск игрока без Role Play отыгровки.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Примечание: запрещено несоответствующее поведение по аналогии с пунктом 6.04.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Green][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]' +
          "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 100, 0)][B][SIZE=1]GROZNY [/SIZE][/B][/COLOR]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Запрещено проводить обыск игрока без Role Play отыгровки. (отказано)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете проинструктированы по данному пункту правил: 8.06. Запрещено проводить обыск игрока без Role Play отыгровки.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Примечание: запрещено несоответствующее поведение по аналогии с пунктом 6.04.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Отказано, закрыто.[/color][/SIZE][/CENTER][/B]' +
          "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 100, 0)][B][SIZE=1]GROZNY [/SIZE][/B][/COLOR]",
      prefix:UNACCСEPT_PREFIX,
      status: false,
    },
     {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ГИБДД ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
     {
      title: 'Запрещено наносить урон игрокам без Role Play причины на территории ГИБДД (одобрено)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете наказаны по данному пункту правил: 7.01. Запрещено наносить урон игрокам без Role Play причины на территории ГИБДД | DM / Jail 60 минут / Warn[/color][/SIZE][/CENTER][/B]' +
		'[Color=Green][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]' +
           "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 100, 0)][B][SIZE=1]GROZNY [/SIZE][/B][/COLOR]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Запрещено наносить урон игрокам без Role Play причины на территории ГИБДД (отказано)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете наказаны по данному пункту правил: 7.01. Запрещено наносить урон игрокам без Role Play причины на территории ГИБДД | DM / Jail 60 минут / Warn[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Отказано, закрыто.[/color][/SIZE][/CENTER][/B]' +
          "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 100, 0)][B][SIZE=1]GROZNY [/SIZE][/B][/COLOR]",
      prefix:UNACCСEPT_PREFIX,
      status: false,
    },
     {
      title: 'Запрещено выдавать розыск, штраф без Role Play причины (одобрено)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете наказаны по данному пункту правил: 7.02. Запрещено выдавать розыск, штраф без Role Play причины | Jail 30 минут[/color][/SIZE][/CENTER][/B]' +
		'[Color=Green][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]' +
           "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 100, 0)][B][SIZE=1]GROZNY [/SIZE][/B][/COLOR]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Запрещено выдавать розыск, штраф без Role Play причины (отказано)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете наказаны по данному пункту правил: 7.02. Запрещено выдавать розыск, штраф без Role Play причины | Jail 30 минут[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Отказано, закрыто.[/color][/SIZE][/CENTER][/B]' +
          "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 100, 0)][B][SIZE=1]GROZNY [/SIZE][/B][/COLOR]",
      prefix:UNACCСEPT_PREFIX,
      status: false,
    },
        {
      title: 'Запрещено оказывать задержание без Role Play отыгровки (одобрено)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете наказаны по данному пункту правил: 7.03. Запрещено оказывать задержание без Role Play отыгровки | Warn[/color][/SIZE][/CENTER][/B]' +
		'[Color=Green][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]' +
              "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 100, 0)][B][SIZE=1]GROZNY [/SIZE][/B][/COLOR]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Запрещено оказывать задержание без Role Play отыгровки (отказано)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете наказаны по данному пункту правил: 7.03. Запрещено оказывать задержание без Role Play отыгровки | Warn[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Отказано, закрыто.[/color][/SIZE][/CENTER][/B]' +
          "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 100, 0)][B][SIZE=1]GROZNY [/SIZE][/B][/COLOR]",
      prefix:UNACCСEPT_PREFIX,
      status: false,
    },
     {
      title: 'Запрещено останавливать и осматривать транспортное средство без RР. (одобрено)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете проинструктированы по данному пункту правил: 7.04. Запрещено останавливать и осматривать транспортное средство без Role Play отыгровки.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Green][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]' +
           "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 100, 0)][B][SIZE=1]GROZNY [/SIZE][/B][/COLOR]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Запрещено останавливать и осматривать транспортное средство без RР (отказано)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете проинструктированы по данному пункту правил: 7.04. Запрещено останавливать и осматривать транспортное средство без Role Play отыгровки.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Отказано, закрыто.[/color][/SIZE][/CENTER][/B]' +
          "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 100, 0)][B][SIZE=1]GROZNY [/SIZE][/B][/COLOR]",
      prefix:UNACCСEPT_PREFIX,
      status: false,
    },
      {
      title: 'Запрещено отбирать водительские права во время погони за нарушителем (одобрено)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете наказаны по данному пункту правил: 7.05. Запрещено отбирать водительские права во время погони за нарушителем | Warn[/color][/SIZE][/CENTER][/B]' +
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Примечание: запрещено несоответствующее поведение по аналогии с пунктом 6.04.[/color][/SIZE][/CENTER][/B]' +
        '[Color=Green][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]' +
            "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 100, 0)][B][SIZE=1]GROZNY [/SIZE][/B][/COLOR]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Запрещено отбирать водительские права во время погони за нарушителем (отказано)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете наказаны по данному пункту правил: 7.05. Запрещено отбирать водительские права во время погони за нарушителем | Warn[/color][/SIZE][/CENTER][/B]' +
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Примечание: запрещено несоответствующее поведение по аналогии с пунктом 6.04.[/color][/SIZE][/CENTER][/B]' +
        '[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Отказано, закрыто.[/color][/SIZE][/CENTER][/B]' +
          "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 100, 0)][B][SIZE=1]GROZNY [/SIZE][/B][/COLOR]",
      prefix:UNACCСEPT_PREFIX,
      status: false,
    },
     {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴УМВД ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
     {
      title: 'Запрещено наносить урон игрокам без Role Play причины на территории УМВД (одобрено)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете наказаны по данному пункту правил: 6.01. Запрещено наносить урон игрокам без Role Play причины на территории УМВД | DM / Jail 60 минут / Warn[/color][/SIZE][/CENTER][/B]' +
		'[Color=Green][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]' +
           "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 100, 0)][B][SIZE=1]GROZNY [/SIZE][/B][/COLOR]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Запрещено наносить урон игрокам без Role Play причины на территории УМВД (отказано)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете наказаны по данному пункту правил: 6.01. Запрещено наносить урон игрокам без Role Play причины на территории УМВД | DM / Jail 60 минут / Warn[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Отказано, закрыто.[/color][/SIZE][/CENTER][/B]',
      prefix:UNACCСEPT_PREFIX,
      status: false,
    },
      {
      title: 'Запрещено выдавать розыск без Role Play причины (одобрено)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете наказаны по данному пункту правил: 6.02. Запрещено выдавать розыск без Role Play причины | Jail 30 минут[/color][/SIZE][/CENTER][/B]' +
		'[Color=Green][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Запрещено выдавать розыск без Role Play причины (отказано)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете наказаны по данному пункту правил: 6.02. Запрещено выдавать розыск без Role Play причины | Jail 30 минут[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Отказано, закрыто.[/color][/SIZE][/CENTER][/B]',
      prefix:UNACCСEPT_PREFIX,
      status: false,
    },
   {
      title: 'Запрещено оказывать задержание без Role Play отыгровки (одобрено)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете наказаны по данному пункту правил: 6.03. Запрещено оказывать задержание без Role Play отыгровки | Warn[/color][/SIZE][/CENTER][/B]' +
		'[Color=Green][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Запрещено оказывать задержание без Role Play отыгровки (отказано)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете наказаны по данному пункту правил: 6.03. Запрещено оказывать задержание без Role Play отыгровки | Warn[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Отказано, закрыто.[/color][/SIZE][/CENTER][/B]' +
          "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 100, 0)][B][SIZE=1]GROZNY [/SIZE][/B][/COLOR]",
      prefix:UNACCСEPT_PREFIX,
      status: false,
    },
       {
      title: 'Запрещено nRP поведение (одобрено)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете наказаны по данному пункту правил: 6.04. Запрещено nRP поведение | Warn[/color][/SIZE][/CENTER][/B]' +
		'[Color=Green][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]' +
             "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 100, 0)][B][SIZE=1]GROZNY [/SIZE][/B][/COLOR]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Запрещено nRP поведение (отказано)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете наказаны по данному пункту правил: 6.04. Запрещено nRP поведение | Warn[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Отказано, закрыто.[/color][/SIZE][/CENTER][/B]' +
          "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 100, 0)][B][SIZE=1]GROZNY [/SIZE][/B][/COLOR]",
      prefix:UNACCСEPT_PREFIX,
      status: false,
    },
  ];

  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton('На рассмотрение', 'pin');
    addButton('Одобрено', 'accepted');
    addButton('Отказано', 'unaccept');
    addButton('Закрыто', 'Zakrito');
    addButton('Click me (ответы)', 'selectAnswer');

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
