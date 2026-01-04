// ==UserScript==
// @name          || Скрипт для ЗГС/ГС сервера by V.Norkin.
// @namespace    https://forum.blackrussia.online
// @version      1.5
// @description  По вопросам(ВК): https://vk.com/qnorkin
// @author       Victor Norkin
// @match        https://forum.blackrussia.online/threads/*
// @grant        none
// @license 	 MIT
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/485325/%7C%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%97%D0%93%D0%A1%D0%93%D0%A1%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0%20by%20VNorkin.user.js
// @updateURL https://update.greasyfork.org/scripts/485325/%7C%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%97%D0%93%D0%A1%D0%93%D0%A1%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0%20by%20VNorkin.meta.js
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
          '[I][SIZE=2][COLOR=rgb(255, 255, 255)][/COLOR][COLOR=rgb(255, 0, 0)][B][/B][/COLOR]',
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
  '[I][SIZE=2][COLOR=rgb(255, 255, 255)][/COLOR][COLOR=rgb(255, 0, 0)][B][/B][/COLOR]',
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
		'[Color=Lime][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]' +
        '[I][SIZE=2][COLOR=rgb(255, 255, 255)][/COLOR][COLOR=rgb(255, 0, 0)][B][/B][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
        title:'Будет проведена беседа с заместителем',
        content:
       '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Ваша жалоба была одобрена, с заместителем проведена беседа! Спасибо за информацию.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Lime][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]' +
        '[I][SIZE=2][COLOR=rgb(255, 255, 255)][/COLOR][COLOR=rgb(255, 0, 0)][B][/B][/COLOR]',
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
        '[I][SIZE=2][COLOR=rgb(255, 255, 255)][/COLOR][COLOR=rgb(255, 0, 0)][B][/B][/COLOR]',
        prefix:UNACCСEPT_PREFIX,
        status: false,
    },
    {
        title:'Срок написания жалобы составляет два дня',
        content:
       '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]3.1. Срок написания жалобы составляет два дня (48 часов) с момента совершенного нарушения со стороны лидера сервера.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Закрыто.[/color][/SIZE][/CENTER][/B]' +
         '[I][SIZE=2][COLOR=rgb(255, 255, 255)][/COLOR][COLOR=rgb(255, 0, 0)][B][/B][/COLOR]',
        prefix:CLOSE_PREFIX,
        status: false,
    },
     {
        title:'Жалоба от 3-го лица',
        content:
       '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]3.3. Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации).[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Закрыто.[/color][/SIZE][/CENTER][/B]' +
           "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 100, 0)][B][SIZE=1]\ [/SIZE][/B][/COLOR]",
        prefix:CLOSE_PREFIX,
        status: false,
    },
     {
         title:'Отсутствуют доказательства',
        content:
       '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]В вашей жалобе отсутсвуют доказательства о нарушении лидера/заместителя[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Закрыто.[/color][/SIZE][/CENTER][/B]' +
             '[I][SIZE=2][COLOR=rgb(255, 255, 255)][/COLOR][COLOR=rgb(255, 0, 0)][B][/B][/COLOR]',
        prefix:CLOSE_PREFIX,
        status: false,
    },
    {
        title:'Проверив доказательства от лидера выговор были выданы верно',
        content:
       '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Проверив опровержение лидера, выговор вам был выдан верно.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Отказано, закрыто.[/color][/SIZE][/CENTER][/B]' +
        '[I][SIZE=2][COLOR=rgb(255, 255, 255)][/COLOR][COLOR=rgb(255, 0, 0)][B][/B][/COLOR]',
        prefix:UNACCСEPT_PREFIX,
        status: false,
    },
    {
        title:'Проверив доказательства от заместителя выговор были выданы верно',
        content:
       '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Проверив опровержение заместителя, выговор вам был выдан верно.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Отказано, закрыто.[/color][/SIZE][/CENTER][/B]' +
        '[I][SIZE=2][COLOR=rgb(255, 255, 255)][/COLOR][COLOR=rgb(255, 0, 0)][B][/B][/COLOR]',
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
		'[Color=Lime][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]' +
         '[I][SIZE=2][COLOR=rgb(255, 255, 255)][/COLOR][COLOR=rgb(255, 0, 0)][B][/B][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Запрещено выдавать лицензии без Role PLay отыгровок (отказано)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете проинструктированы по данному пункту правил: 3.01. Запрещена выдача лицензий без Role Play отыгровок.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Отказано, закрыто.[/color][/SIZE][/CENTER][/B]' +
         '[I][SIZE=2][COLOR=rgb(255, 255, 255)][/COLOR][COLOR=rgb(255, 0, 0)][B][/B][/COLOR]',
      prefix:UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Запрещено оказывать услуги адвоката без Role PLay отыгровок (одобрено)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете проинструктированы по данному пункту правил: 3.02. Запрещено оказание услуг адвоката без Role Play отыгровок.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Lime][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]' +
        '[I][SIZE=2][COLOR=rgb(255, 255, 255)][/COLOR][COLOR=rgb(255, 0, 0)][B][/B][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
      {
      title: 'Запрещено оказывать услуги адвоката без Role PLay отыгровок (отказано)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете проинструктированы по данному пункту правил: 3.02. Запрещено оказание услуг адвоката без Role Play отыгровок.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Отказано, закрыто.[/color][/SIZE][/CENTER][/B]' +
          '[I][SIZE=2][COLOR=rgb(255, 255, 255)][/COLOR][COLOR=rgb(255, 0, 0)][B][/B][/COLOR]',
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
		'[Color=Lime][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]' +
         '[I][SIZE=2][COLOR=rgb(255, 255, 255)][/COLOR][COLOR=rgb(255, 0, 0)][B][/B][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Запрещено наносить урон игрокам без Role Play причины на территории ФСБ (отказано)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете наказаны по данному пункту правил: 8.01. Запрещено наносить урон игрокам без Role Play причины на территории ФСБ | DM / Jail 60 минут / Warn.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Отказано, закрыто.[/color][/SIZE][/CENTER][/B]' +
         '[I][SIZE=2][COLOR=rgb(255, 255, 255)][/COLOR][COLOR=rgb(255, 0, 0)][B][/B][/COLOR]',
      prefix:UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Запрещено выдавать розыск без Role Play причины (одобрено)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете наказаны по данному пункту правил: 8.02. Запрещено выдавать розыск без Role Play причины | Jail 30 минут.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Lime][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]' +
        '[I][SIZE=2][COLOR=rgb(255, 255, 255)][/COLOR][COLOR=rgb(255, 0, 0)][B][/B][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Запрещено выдавать розыск без Role Play причины (отказано)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете наказаны по данному пункту правил: 8.02. Запрещено выдавать розыск без Role Play причины | Jail 30 минут.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Отказано, закрыто.[/color][/SIZE][/CENTER][/B]' +
         '[I][SIZE=2][COLOR=rgb(255, 255, 255)][/COLOR][COLOR=rgb(255, 0, 0)][B][/B][/COLOR]',
      prefix:UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Запрещено оказывать задержание без Role Play отыгровки (одобрено)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете наказаны по данному пункту правил: 8.03. Запрещено оказывать задержание без Role Play отыгровки | Warn[/color][/SIZE][/CENTER][/B]' +
		'[Color=Lime][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]' +
        '[I][SIZE=2][COLOR=rgb(255, 255, 255)][/COLOR][COLOR=rgb(255, 0, 0)][B][/B][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Запрещено оказывать задержание без Role Play отыгровки (отказано)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете наказаны по данному пункту правил: 8.03. Запрещено оказывать задержание без Role Play отыгровки | Warn[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Отказано, закрыто.[/color][/SIZE][/CENTER][/B]' +
        '[I][SIZE=2][COLOR=rgb(255, 255, 255)][/COLOR][COLOR=rgb(255, 0, 0)][B][/B][/COLOR]',
      prefix:UNACCСEPT_PREFIX,
      status: false,
    },
     {
      title: 'Запрещено использовать маскировку в личных целях (одобрено)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете проинструктированы по данному пункту правил: 8.04. Запрещено использовать маскировку в личных целях[/color][/SIZE][/CENTER][/B]' +
		'[Color=Lime][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]' +
         '[I][SIZE=2][COLOR=rgb(255, 255, 255)][/COLOR][COLOR=rgb(255, 0, 0)][B][/B][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Запрещено использовать маскировку в личных целях (отказано)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете проинструктированы по данному пункту правил: 8.04. Запрещено использовать маскировку в личных целях[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Отказано, закрыто.[/color][/SIZE][/CENTER][/B]' +
        '[I][SIZE=2][COLOR=rgb(255, 255, 255)][/COLOR][COLOR=rgb(255, 0, 0)][B][/B][/COLOR]',
      prefix:UNACCСEPT_PREFIX,
      status: false,
    },
     {
      title: 'Запрещено безосновательное увольнение сотрудников силовых структур (одобрено)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете проинструктированы по данному пункту правил: 8.05. Запрещено безосновательное увольнение сотрудников силовых структур (УМВД, Армия, ГИБДД)[/color][/SIZE][/CENTER][/B]' +
		'[Color=Lime][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]' +
         '[I][SIZE=2][COLOR=rgb(255, 255, 255)][/COLOR][COLOR=rgb(255, 0, 0)][B][/B][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
      {
      title: 'Запрещено безосновательное увольнение сотрудников силовых структур (отказано)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете проинструктированы по данному пункту правил: 8.05. Запрещено безосновательное увольнение сотрудников силовых структур (УМВД, Армия, ГИБДД)[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Отказано, закрыто.[/color][/SIZE][/CENTER][/B]' +
          '[I][SIZE=2][COLOR=rgb(255, 255, 255)][/COLOR][COLOR=rgb(255, 0, 0)][B][/B][/COLOR]',
      prefix:UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Запрещено проводить обыск игрока без Role Play отыгровки. (одобрено)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете проинструктированы по данному пункту правил: 8.06. Запрещено проводить обыск игрока без Role Play отыгровки.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Примечание: запрещено несоответствующее поведение по аналогии с пунктом 6.04.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Lime][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]' +
        '[I][SIZE=2][COLOR=rgb(255, 255, 255)][/COLOR][COLOR=rgb(255, 0, 0)][B][/B][/COLOR]',
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
        '[I][SIZE=2][COLOR=rgb(255, 255, 255)][/COLOR][COLOR=rgb(255, 0, 0)][B][/B][/COLOR]',
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
		'[Color=Lime][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]' +
         '[I][SIZE=2][COLOR=rgb(255, 255, 255)][/COLOR][COLOR=rgb(255, 0, 0)][B][/B][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Запрещено наносить урон игрокам без Role Play причины на территории ГИБДД (отказано)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете наказаны по данному пункту правил: 7.01. Запрещено наносить урон игрокам без Role Play причины на территории ГИБДД | DM / Jail 60 минут / Warn[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Отказано, закрыто.[/color][/SIZE][/CENTER][/B]' +
        '[I][SIZE=2][COLOR=rgb(255, 255, 255)][/COLOR][COLOR=rgb(255, 0, 0)][B][/B][/COLOR]',
      prefix:UNACCСEPT_PREFIX,
      status: false,
    },
     {
      title: 'Запрещено выдавать розыск, штраф без Role Play причины (одобрено)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете наказаны по данному пункту правил: 7.02. Запрещено выдавать розыск, штраф без Role Play причины | Jail 30 минут[/color][/SIZE][/CENTER][/B]' +
		'[Color=Lime][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]' +
         '[I][SIZE=2][COLOR=rgb(255, 255, 255)][/COLOR][COLOR=rgb(255, 0, 0)][B][/B][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Запрещено выдавать розыск, штраф без Role Play причины (отказано)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете наказаны по данному пункту правил: 7.02. Запрещено выдавать розыск, штраф без Role Play причины | Jail 30 минут[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Отказано, закрыто.[/color][/SIZE][/CENTER][/B]' +
        '[I][SIZE=2][COLOR=rgb(255, 255, 255)][/COLOR][COLOR=rgb(255, 0, 0)][B][/B][/COLOR]',
      prefix:UNACCСEPT_PREFIX,
      status: false,
    },
        {
      title: 'Запрещено оказывать задержание без Role Play отыгровки (одобрено)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете наказаны по данному пункту правил: 7.03. Запрещено оказывать задержание без Role Play отыгровки | Warn[/color][/SIZE][/CENTER][/B]' +
		'[Color=Lime][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]' +
            '[I][SIZE=2][COLOR=rgb(255, 255, 255)][/COLOR][COLOR=rgb(255, 0, 0)][B][/B][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Запрещено оказывать задержание без Role Play отыгровки (отказано)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете наказаны по данному пункту правил: 7.03. Запрещено оказывать задержание без Role Play отыгровки | Warn[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Отказано, закрыто.[/color][/SIZE][/CENTER][/B]' +
        '[I][SIZE=2][COLOR=rgb(255, 255, 255)][/COLOR][COLOR=rgb(255, 0, 0)][B][/B][/COLOR]',
      prefix:UNACCСEPT_PREFIX,
      status: false,
    },
     {
      title: 'Запрещено останавливать и осматривать транспортное средство без RР. (одобрено)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете проинструктированы по данному пункту правил: 7.04. Запрещено останавливать и осматривать транспортное средство без Role Play отыгровки.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Lime][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]' +
         '[I][SIZE=2][COLOR=rgb(255, 255, 255)][/COLOR][COLOR=rgb(255, 0, 0)][B][/B][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Запрещено останавливать и осматривать транспортное средство без RР (отказано)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете проинструктированы по данному пункту правил: 7.04. Запрещено останавливать и осматривать транспортное средство без Role Play отыгровки.[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Отказано, закрыто.[/color][/SIZE][/CENTER][/B]' +
        '[I][SIZE=2][COLOR=rgb(255, 255, 255)][/COLOR][COLOR=rgb(255, 0, 0)][B][/B][/COLOR]',
      prefix:UNACCСEPT_PREFIX,
      status: false,
    },
      {
      title: 'Запрещено отбирать водительские права во время погони за нарушителем (одобрено)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете наказаны по данному пункту правил: 7.05. Запрещено отбирать водительские права во время погони за нарушителем | Warn[/color][/SIZE][/CENTER][/B]' +
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Примечание: запрещено несоответствующее поведение по аналогии с пунктом 6.04.[/color][/SIZE][/CENTER][/B]' +
        '[Color=Lime][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]' +
          '[I][SIZE=2][COLOR=rgb(255, 255, 255)][/COLOR][COLOR=rgb(255, 0, 0)][B][/B][/COLOR]',
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
        '[I][SIZE=2][COLOR=rgb(255, 255, 255)][/COLOR][COLOR=rgb(255, 0, 0)][B][/B][/COLOR]',
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
		'[Color=Lime][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]' +
         '[I][SIZE=2][COLOR=rgb(255, 255, 255)][/COLOR][COLOR=rgb(255, 0, 0)][B][/B][/COLOR]',
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
		'[Color=Lime][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
 {
      title: 'Запрещено оказывать задержание без Role Play отыгровки (одобрено)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете наказаны по данному пункту правил: 6.03. Запрещено оказывать задержание без Role Play отыгровки | Warn[/color][/SIZE][/CENTER][/B]' +
		'[Color=Lime][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Запрещено оказывать задержание без Role Play отыгровки (отказано)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете наказаны по данному пункту правил: 6.03. Запрещено оказывать задержание без Role Play отыгровки | Warn[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Отказано, закрыто.[/color][/SIZE][/CENTER][/B]' +
        '[I][SIZE=2][COLOR=rgb(255, 255, 255)][/COLOR][COLOR=rgb(255, 0, 0)][B][/B][/COLOR]',
      prefix:UNACCСEPT_PREFIX,
      status: false,
    },
       {
      title: 'Запрещено nRP поведение (одобрено)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете наказаны по данному пункту правил: 6.04. Запрещено nRP поведение | Warn[/color][/SIZE][/CENTER][/B]' +
		'[Color=Lime][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]' +
           '[I][SIZE=2][COLOR=rgb(255, 255, 255)][/COLOR][COLOR=rgb(255, 0, 0)][B][/B][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Запрещено nRP поведение (отказано)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Так же вы будете наказаны по данному пункту правил: 6.04. Запрещено nRP поведение | Warn[/color][/SIZE][/CENTER][/B]' +
		'[Color=Red][SIZE=4][FONT=Georgia][CENTER][B]Отказано, закрыто.[/color][/SIZE][/CENTER][/B]' +
        '[I][SIZE=2][COLOR=rgb(255, 255, 255)][/COLOR][COLOR=rgb(255, 0, 0)][B][/B][/COLOR]',
      prefix:UNACCСEPT_PREFIX,
      status: false,
    },

     {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отчетность Лидеров ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
       {
      title: 'Норма (одобрено)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый лидер.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Игровой норматив был выполнен,данные занесены в таблицу. [Color=Red] |[Color=purple] Было выполнено: [Color=lime] Норма[/color][/SIZE][/CENTER][/B]' +
		'[Color=Lime][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]' +
           '[I][SIZE=2][COLOR=rgb(255, 255, 255)][/COLOR][COLOR=rgb(255, 0, 0)][B][/B][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
       {
      title: 'Перенорма (одобрено)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый лидер.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Игровой норматив был выполнен,данные занесены в таблицу. [Color=Red] |[Color=purple] Было выполнено: [Color=aqua] Перенорма[/color][/SIZE][/CENTER][/B]' +
		'[Color=Lime][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]' +
           '[I][SIZE=2][COLOR=rgb(255, 255, 255)][/COLOR][COLOR=rgb(255, 0, 0)][B][/B][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
       {
      title: 'Натяг (одобрено)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый лидер.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Игровой норматив был выполнен,данные занесены в таблицу. [Color=Red] |[Color=purple] Было выполнено: [Color=yellow] Натянутая норма. [/color][/SIZE][/CENTER][/B]' +
		'[Color=Lime][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]' +
           '[I][SIZE=2][COLOR=rgb(255, 255, 255)][/COLOR][COLOR=rgb(255, 0, 0)][B][/B][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
       {
      title: 'Натяг более 3х раз. (одобрено)',
      content:
		'[Color=White][SIZE=4][FONT=Georgia][CENTER][B]{{ greeting }}, уважаемый лидер.[/color][/SIZE][/CENTER][/B]' +
        '[Color=White][SIZE=4][FONT=Georgia][CENTER][B]Игровой норматив был выполнен,данные занесены в таблицу. [Color=Red] |[Color=purple] Было выполнено: [Color=red] Натянутая норма. +Выговор за более 3х - Натянутых норматива подрят. [/color][/SIZE][/CENTER][/B]' +
		'[Color=Lime][SIZE=4][FONT=Georgia][CENTER][B]Одобрено, закрыто.[/color][/SIZE][/CENTER][/B]' +
           '[I][SIZE=2][COLOR=rgb(255, 255, 255)][/COLOR][COLOR=rgb(255, 0, 0)][B][/B][/COLOR]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
   	addButton('Одобрено', 'accepted');
    addButton('Отказано', 'unaccept');
    addButton('📒 ШАБЛОНЧИКИ 📒', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(UNACCEPT_PREFIX, false));

	$(`button#selectAnswer`).click(() => {
		XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
		buttons.forEach((btn, id) => {
			if(id > 1) {
				$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
			} else {
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

	if(send == false){
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
	}
	if(pin == true){
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