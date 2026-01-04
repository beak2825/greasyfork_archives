// // ==UserScript==
// @name         Скрипт для Данилы Пятака
// @namespace    https://forum.blackrussia.online/index.php?forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9632-krasnodar.1461/
// @version      3.1
// @description  Краснодар вперед
// @author       Danila_Pyatak
// @match        https://forum.blackrussia.online/*
// @icon         https://forum.blackrussia.online/
// @grant        none
// @license 	 MIT
// @collaborator none
// @icon         https://klike.net/uploads/posts/2023-05/1685074399_3-18.jpg
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/467297/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%94%D0%B0%D0%BD%D0%B8%D0%BB%D1%8B%20%D0%9F%D1%8F%D1%82%D0%B0%D0%BA%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/467297/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%94%D0%B0%D0%BD%D0%B8%D0%BB%D1%8B%20%D0%9F%D1%8F%D1%82%D0%B0%D0%BA%D0%B0.meta.js
// ==/UserScript==
 
 ( function () {
    `use strict`;
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
    const buttons = [
        
    {
      title: 'Приветствие',
      content:
         '[CENTER][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>',
    },
    {
             title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Жалоба на рассмотрении ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'На рассмотрении',
      content:
        '[CENTER][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4] Ваша жалоба взята на рассмотрение.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Пожалуйста, ожидайте вердикт в данной теме.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(255, 140, 0)][FONT=georgia][SIZE=4]На рассмотрении.[/COLOR][/SIZE][/FONT][/CENTER]' ,
       prefix: PINN_PREFIX,
	   status: true,
   },
    {
      title: 'Запрошу док-ва',
      content:
        '[CENTER][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4] Запрошу доказательства у лидера.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Пожалуйста, ожидайте вердикт в данной теме.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(255, 140, 0)][SIZE=4][FONT=georgia]На рассмотрении.[/FONT][/SIZE][/COLOR][/CENTER]' ,
       prefix: PINN_PREFIX,
	   status: true,
    },
    {
             title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Жалоба одобрена ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Док-ва предоставлены',
      content:
        '[CENTER][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Лидер предоставил доказательства, наказание выдано верно.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Внимательно прочтите общие правила серверов, и впредь, не нарушайте.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Закрыто.[/COLOR][/SIZE][/FONT][/CENTER]' ,
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Наказание по ошибке',
      content:
         '[CENTER][SIZE=4][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
         '[CENTER][FONT=georgia][SIZE=4]Лидер допустил ошибку при выдаче наказания.[/CENTER][/FONT][/SIZE]<br>' +
         '[CENTER][FONT=georgia][SIZE=4]Наказание будет снято в течение 2-ух часов.[/CENTER][/FONT][/SIZE]<br>' +
         '[CENTER][FONT=georgia][SIZE=4]Приносим извинения за предоставленные неудобства.[/CENTER][/FONT][/SIZE]<br>' +
         '[CENTER][COLOR=rgb(124, 252, 0)][FONT=georgia][SIZE=4]Одобрено.[/COLOR][/SIZE][/FONT][/CENTER]' ,
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: 'Будет проведена беседа',
      content:
        '[CENTER][SIZE=4][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]С лидером будет проведена профилактическая беседа во избежание подобных ситуаций.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Спасибо за информацию.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(124, 252, 0)][FONT=georgia][SIZE=4]Одобрено.[/COLOR][/SIZE][/FONT][/CENTER]' ,
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
             title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Передача жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
              title: 'Передано ГА',
      content:
        '[CENTER][SIZE=4][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Ваша жалоба передана [COLOR=rgb(255, 0, 0)]Главному администратору.[/COLOR][/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Ожидайте ответа в данной теме, и не создавайте копии.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(255, 140, 0)][FONT=georgia][SIZE=4]На рассмотрении.[/COLOR][/SIZE][/FONT][/CENTER]'  ,
 
      prefix: GA_PREFIX,
      status: true,
    },
    {
              title: 'Передано ЗГА',
      content:
        '[CENTER][SIZE=4][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Ваша жалоба передана [COLOR=rgb(255, 0, 0)]Заместителю главного администратора.[/COLOR][/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Ожидайте ответа в данной теме, и не создавайте копии.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(255, 140, 0)][FONT=georgia][SIZE=4]На рассмотрении.[/COLOR][/SIZE][/FONT][/CENTER]' ,
 
      prefix: PINN_PREFIX,
	  status: true,
    },
    {
                      title: 'Передано КП',
      content:
       '[CENTER][SIZE=4][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/SIZE][/FONT]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Ваша жалоба передана [COLOR=rgb(255, 0, 0)]Специальной администрации.[/COLOR][/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Ожидайте ответа в данной теме, и не создавайте копии.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(255, 140, 0)][FONT=georgia][SIZE=4]На рассмотрении.[/COLOR][/SIZE][/FONT][/CENTER]' ,
      prefix: SPECY_PREFIX,
	  status: true,
    },
    {
             title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отказ жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Не по теме',
      content:
         '[CENTER][SIZE=4][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
         '[CENTER][FONT=georgia][SIZE=4]Ваше сообщение никоим образом не относится к предназначению данного раздела.[/CENTER][/FONT][/SIZE]<br>' +
         '[CENTER][FONT=georgia][SIZE=4]Убедительная просьба не создавать дубликаты данной темы, иначе ваш ФА может быть заблокирован.[/CENTER][/FONT][/SIZE]<br>' +
         '[CENTER][FONT=georgia][SIZE=4]С правилами и формой подачи жалобы можете ознакомиться в специальной теме, закрепленной в данном разделе.[/CENTER][/FONT][/SIZE]<br>' +
         '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Отказано.[/COLOR][/SIZE][/FONT][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
              title: 'Ответ был дан ранее',
      content:
        '[CENTER][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]В созданных Вами темах ранее был дан корректный ответ.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Убедительная просьба не создавать подобных тем, иначе Ваш ФА может быть заблокирован.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Отказано.[/COLOR][/SIZE][/FONT][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
              title: 'В тех.раздел',
      content:
        '[CENTER][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Для получения ответа на Ваше обращение/жалобу, обратитесь в технический раздел.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Не создавайте дубликаты данной темы, иначе Ваш ФА может быть заблокирован.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Закрыто.[/COLOR][/SIZE][/FONT][/CENTER]' ,
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Недостаточно док-в',
      content:
        '[CENTER][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Недостаточно доказательств для корректного рассмотрения вашего обращения.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Не создавайте дубликаты данной темы, иначе Ваш ФА может быть заблокирован.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Отказано.[/COLOR][/SIZE][/FONT][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нужен фрапс',
      content:
        '[CENTER][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Недостаточно доказательств для корректного рассмотрения жалобы. В данном случае требуются видео - доказательства(фрапс).[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Не создавайте дубликаты данной темы, иначе Ваш ФА может быть заблокирован.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Отказано.[/COLOR][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Док-ва отред.',
      content:
        '[CENTER][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Ваши доказательства были подвергнуты изменениям (редактированию), прикрепите оригинальные файлы.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Убедительная просьба не создавать подобных тем, иначе Ваш ФА может быть заблокирован.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Отказано.[/COLOR][/SIZE][/FONT][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Отсутствуют док-ва',
      content:
        '[CENTER][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]В Вашей жалобе отсутствуют доказательства - следовательно, тема рассмотрению не подлежит.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx,Yandex диск,Google диск и т.д.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Отказано.[/COLOR][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'В обжалования',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Обратитесь в раздел обжалований наказаний.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Прошло 48 часов',
      content:
        '[CENTER][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]С момента выдачи наказания прошло более 48-и часов.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Тема рассмотрению не подлежит.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Закрыто.[/COLOR][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Не по форме',
      content:
        '[CENTER][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Ваша жалоба составлена не по форме, следовательно, рассмотрению не подлежит.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]С формой и правилами подачи жалоб на лидеров Вы можете ознакомиться в специальной теме, закрепленной в данном разделе.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Отказано.[/COLOR][/SIZE][/FONT][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Док-ва в соц. сетях',
      content:
       '[CENTER][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Доказательства в социальных сетях не принимаются, следовательно, тема рассмотрению не подлежит.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx,Yandex диск,Google диск и т.д.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Отказано.[/COLOR][/SIZE][/FONT][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Админ прав',
      content:
        '[CENTER][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Нарушения со стороны лидера отсутствуют.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Закрыто.[/COLOR][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Выдано верно',
      content:
        '[CENTER][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Наказание выдано верно.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Если Вы желаете снизить/снять наказание - обратитесь в раздел обжалований нашего сервера.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Отказано.[/COLOR][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
             title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Обжалования ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Обжалование отказано',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=georgia]Администрация не готова сократить или снять вам наказание.[/FONT][/SIZE]<br>" +
        "[SIZE=4][FONT=georgia]В обжаловании отказано.[/FONT][/SIZE][/I][/COLOR]<br><br>" +
        "[FONT=georgia][COLOR=#d1d5d8][SIZE=4][I]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/COLOR][/FONT]<br><br>" +
        '[FONT=georgia][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Обжалование не подлежит',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=#ff0000][SIZE=4][I][FONT=georgia][COLOR=rgb(209, 213, 216)]Данное нарушение обжалованию не подлежит.[/COLOR][/FONT][/I][/SIZE][/COLOR]<br>" +
        "[FONT=georgia][COLOR=#d1d5d8][SIZE=4][I]Внимательно прочитайте правила подачи обжалования, закреплённые в данном разделе.<br>" +
        "В обжаловании отказано.<br><br>" +
        "Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/COLOR][/FONT]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][SIZE=4][I][FONT=times new roman]Закрыто.[/FONT][/I][/SIZE][/COLOR][/CENTER]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Обжалование не по форме',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=georgia]Обжалование составлено не по форме.[/FONT][/SIZE]<br>" +
        "[SIZE=4][FONT=georgia]Внимательно прочитайте правила составления обжалований - [/FONT][/SIZE][/I][/COLOR][SIZE=4][FONT=times new roman][URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.1158794/']*Нажмите сюда*[/URL].[/FONT][/SIZE]<br><br>" +
        '[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR][/FONT][/I][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Обжалование передано ГА',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/I][/SIZE][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][FONT=georgia][SIZE=4]Ваше обжалование переадресовано[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4] Главному Администратору[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/I][/COLOR]<br>" +
        '[FONT=georgia][SIZE=4][I][COLOR=rgb(209, 213, 216)]Ожидайте ответа в данной теме, копии создавать не нужно.[/COLOR][/I][/SIZE][/FONT][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(250, 197, 28)]На рассмотрении[/COLOR].[/FONT][/SIZE][/CENTER]',
      prefix: GA_PREFIX,
      status: true,
    },
    {
      title: 'Обжалование одобрено',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Ваше наказание будет снято / снижено в ближайшее время.[/FONT][/SIZE]<br>" +
        "[FONT=georgia][COLOR=#d1d5d8][SIZE=4][I]Пожалуйста, впредь не повторяйте ошибок, которые могут привести к таким последствиям, а также внимательно изучите общие правила серверов - [/I][URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL].[/SIZE][/COLOR][/FONT]<br><br>" +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=georgia]Обжалование одобрено.[/FONT][/SIZE]<br><br>" +
        '[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR][/FONT][/I][/COLOR][/CENTER]',
	      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Снижено до 30 дней',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=georgia]Ваше наказание будет снижено до бана на 30 дней в ближайшее время.[/FONT][/SIZE]<br>" +
        "[FONT=georgia][COLOR=#d1d5d8][SIZE=4][I]Пожалуйста, впредь не повторяйте ошибок, которые могут привести к таким последствиям, а также внимательно изучите общие правила серверов - [/I][URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL].[/SIZE][/COLOR][/FONT]<br><br>" +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=georgia]Обжалование одобрено.[/FONT][/SIZE]<br><br>" +
        '[FONT=georgia][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR][/FONT][/I][/COLOR][/CENTER]',
	      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Снижено до 15 дней',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=georgia]Ваше наказание будет снижено до бана на 15 дней в ближайшее время.[/FONT][/SIZE]<br>" +
        "[FONT=georgia][COLOR=#d1d5d8][SIZE=4][I]Пожалуйста, впредь не повторяйте ошибок, которые могут привести к таким последствиям, а также внимательно изучите общие правила серверов - [/I][URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL].[/SIZE][/COLOR][/FONT]<br><br>" +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=georgia]Обжалование одобрено.[/FONT][/SIZE]<br><br>" +
        '[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR][/FONT][/I][/COLOR][/CENTER]',
	      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Снижено до 7 дней',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=georgia]Ваше наказание будет снижено до бана на 7 дней в ближайшее время.[/FONT][/SIZE]<br>" +
        "[FONT=georgia][COLOR=#d1d5d8][SIZE=4][I]Пожалуйста, впредь не повторяйте ошибок, которые могут привести к таким последствиям, а также внимательно изучите общие правила серверов - [/I][URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL].[/SIZE][/COLOR][/FONT]<br><br>" +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=georgia]Обжалование одобрено.[/FONT][/SIZE]<br><br>" +
        '[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR][/FONT][/I][/COLOR][/CENTER]',
	      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Снижено до 120 мута',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=georgia]Ваше наказание будет снижено до мута в 120 минут в ближайшее время.[/FONT][/SIZE]<br>" +
        "[FONT=georgia][COLOR=#d1d5d8][SIZE=4][I]Пожалуйста, впредь не повторяйте ошибок, которые могут привести к таким последствиям, а также внимательно изучите общие правила серверов - [/I][URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL].[/SIZE][/COLOR][/FONT]<br><br>" +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=georgia]Обжалование одобрено.[/FONT][/SIZE]<br><br>" +
        '[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR][/FONT][/I][/COLOR][/CENTER]',
	      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
	  title: ' Уже есть мин. наказания ',
	  content:
                '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Вам было выдано минимальное наказание, обжалованию не подлежит.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
      title: 'Обжалование не по форме',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=georgia]Обжалование составлено не по форме.[/FONT][/SIZE]<br>" +
        "[SIZE=4][FONT=georgia]Внимательно прочитайте правила составления обжалований, которые закреплены в этом разделе.[/FONT][/SIZE]<br><br>" +
        '[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR][/FONT][/I][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Уже обжалован',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=#d1d5d8][SIZE=4][I][FONT=georgia]Ранее вам уже было одобрено обжалование и ваше наказание было снижено - повторного обжалования не будет.[/FONT]<br>" +
        "[FONT=georgia]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/FONT][/I][/SIZE][/COLOR]<br><br>" +
        '[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR][/FONT][/I][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'В жалобы на администратора',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=georgia] Если вы не согласны с решением администратора, обратитесь в раздел жалоб на администрацию.[/FONT][/SIZE]<br><br>" +
        '[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR][/FONT][/I][/COLOR][/CENTER',
        prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Обжалование на рассмотрении',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=georgia]Ваше обжалование взято на рассмотрение.[/FONT][/SIZE]<br>" +
        '[SIZE=4][FONT=georgia]Создавать копии не нужно, ожидайте ответа в данной теме.[/FONT][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(250, 197, 28)]На рассмотрении[/COLOR].[/FONT][/SIZE][/CENTER]',
      prefix: PINN_PREFIX,
	  status: true,
    },
    {
      title: 'Просрочка ЖБ',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR]<br><br>' +
        "[COLOR=#d1d5d8][SIZE=4][I]В вашем случае нужно было сразу реагировать на выданное наказание и обращаться в раздел жалоб на администрацию, в настоящий момент срок написания жалобы прошел.[/I][/SIZE][/COLOR]<br>" +
        "[SIZE=4][COLOR=#d1d5d8][I]Если вы все же согласны с решением администратора - составьте новую тему, предварительно прочитав правила подачи обжалований, закреплённые в данном разделе.[/I][/COLOR][/SIZE]<br>" +
        "[COLOR=#d1d5d8][SIZE=4][I]Просьба не создавать копии данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/COLOR][/FONT]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][SIZE=4][I][FONT=times new roman]Закрыто.[/FONT][/I][/SIZE][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'NonRP обман',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)]Обжалование в вашу пользу должен писать игрок, которого вы обманули.[/COLOR]<br>" +
        "[COLOR=rgb(209, 213, 216)]В доказательствах должны иметься: окно блокировки вашего аккаунта, переписка с обманутым игроком, где вы решили на какую компенсацию он согласен и ваше сообщение, в котором вы признаете совершенную ошибку и впредь обязуетесь не повторять ее.[/COLOR]<br>" +
        "[COLOR=rgb(209, 213, 216)]После всего этого главная администрация рассмотрит обжалование, но это не гарантирует того, что вас обжалуют.[/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'NonRP обман 2',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
       'https://i.yapx.cc/QqZnC.jpg' +
      '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
      "[I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Ваша задача написать мне в личные сообщения ВКонтакте для определения времени, в которое мы сможем провести операцию по возвращению нажитого, нечестным путем, имущества обманутой стороне.[/SIZE][/FONT][/COLOR][/I]<br>" +
      "[FONT=georgia][COLOR=#d1d5d8][SIZE=4][I]Написать должны обе стороны.[/I][/SIZE][/COLOR][/FONT]<br>" +
      '[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]По-прежнему на рассмотрении.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: PINN_PREFIX,
	  status: true,
    },
    {
      title: 'VK',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
      '[CENTER][FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
      "[COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4][I]Напишите мне в личные сообщения - [/I][/SIZE][/FONT]*ВКонтакте*[/SIZE][/FONT][/URL][FONT=times new roman][SIZE=4][I].<br><br>" +
      'По-прежнему на рассмотрении.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: PINN_PREFIX,
	  status: true,
    },
    {
      title: 'Использование ПО',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/COLOR][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=georgia]Ваш игровой акаунт был заблокирован навсегда за использование стороннего ПО.[/FONT][/SIZE]<br>" +
        "[SIZE=4][FONT=georgia]В обжаловании отказано.[/FONT][/SIZE][/I][/COLOR]<br><br>" +
        "[FONT=georgia][COLOR=#d1d5d8][SIZE=4][I]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/COLOR][/FONT]<br><br>" +
        '[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Окно бана',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][FONT=times new roman][SIZE=4][I][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
        '[COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4][I]Прикрепите в доказательства скриншот окна блокировки, которое появляется сразу после входа в игру.<br>' +
        'Приятной игры на BLACK RUSSIA на сервере Purple.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    }
];
  
  
  
 
$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
	// Добавление кнопок при загрузке страницы
    addButton('Одобрено', 'accepted');
	addButton('Отказано', 'unaccept');
	addButton('На рассмотрение', 'pin');
    addButton('Передать ГА', 'mainAdmin');
    addButton('Тех.Спецу', 'techspec');
	addButton('ПАНЕЛЬ ОТВЕТОВ', 'selectAnswer');
 
	// Поиск информации о теме
	const threadData = getThreadData();
 
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#techspec').click(() => editThreadData(TEX_PREFIX, true));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#mainAdmin').click(() => editThreadData(GA_PREFIX, true));
 
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