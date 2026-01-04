// // ==UserScript==
// @name         Скрипт для Данилы Пятака[КФ]
// @namespace    https://forum.blackrussia.online/index.php?forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9632-krasnodar.1461/
// @version      1.2
// @description  Краснодар вперед
// @author       Danila_Pyatak
// @match        https://forum.blackrussia.online/*
// @icon         https://forum.blackrussia.online/
// @grant        none
// @license 	 MIT
// @collaborator none
// @icon         https://klike.net/uploads/posts/2023-05/1685074399_3-18.jpg
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/474911/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%94%D0%B0%D0%BD%D0%B8%D0%BB%D1%8B%20%D0%9F%D1%8F%D1%82%D0%B0%D0%BA%D0%B0%5B%D0%9A%D0%A4%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/474911/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%94%D0%B0%D0%BD%D0%B8%D0%BB%D1%8B%20%D0%9F%D1%8F%D1%82%D0%B0%D0%BA%D0%B0%5B%D0%9A%D0%A4%5D.meta.js
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
             title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ЖАЛОБЫ НА ИГРОКОВ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'На рассмотрении',
      content:
        '[CENTER][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4] Ваша жалоба взята на рассмотрение.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Пожалуйста, ожидайте вердикт в данной теме и не создавайте дубликаты..[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(255, 140, 0)][FONT=georgia][SIZE=4]На рассмотрении.[/COLOR][/SIZE][/FONT][/CENTER]' ,
       prefix: PINN_PREFIX,
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
      title: 'Док-ва не работают',
      content:
        '[CENTER][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Прикрепленные Вами доказательства не работают, следовательно, жалоба рассмотрению не подлежит. [/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Проверьте корректность ссылки, и создайте новую тему.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Отказано.[/COLOR][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Не по форме',
      content:
        '[CENTER][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Ваша жалоба составлена не по форме, следовательно, рассмотрению не подлежит.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]С формой и правилами подачи жалоб на игроков Вы можете ознакомиться в специальной теме, закрепленной в данном разделе.[/CENTER][/FONT][/SIZE]<br>' +
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
      title: 'Наруш нет',
      content:
        '[CENTER][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Нарушения со стороны игрока отсутствуют.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Закрыто.[/COLOR][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'От 3 лица',
      content:
        '[CENTER][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Жалоба составлена от третьего лица, следовательно, рассмотрению не подлежит..[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Не создавайте дубликаты данной темы, иначе Ваш ФА может быть заблокирован.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Отказано.[/COLOR][/SIZE][/FONT][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
     {
      title: 'Прошло 72 часа',
      content:
        '[CENTER][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]С момента нарушения со стороын прошло более 72-х часов(3-х дней), следовательно, жалоба рассмотрению не подлежит.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Не создавайте дубликаты данной темы, иначе Ваш ФА может быть заблокирован.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Отказано.[/COLOR][/SIZE][/FONT][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
      {
      title: 'Нет time',
      content:
        '[CENTER][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]С момента нарушения со стороны игрока прошло более 72-х часов(3-х дней), следовательно, жалоба рассмотрению не подлежит.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Не создавайте дубликаты данной темы, иначе Ваш ФА может быть заблокирован.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Отказано.[/COLOR][/SIZE][/FONT][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
      {
      title: 'Нет таймкодов',
      content:
        '[CENTER][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]В вашей жалобе отсутствуют тайм-коды, следовательно, тема рассмотрению не подлежит.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Не создавайте дубликаты данной темы, иначе Ваш ФА может быть заблокирован.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Отказано.[/COLOR][/SIZE][/FONT][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
             title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Игровые чаты ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
              title: 'Общ не на русск',
      content:
        '[CENTER][SIZE=4][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Игрок будет наказан по следующему пункту правил:[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][I][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.01.[/SIZE][/COLOR][SIZE=4] Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке | [/I][/FONT][COLOR=rgb(255, 0, 0)][FONT=georgia][I]Устное замечание / Mute 30 минут.[/I][/CENTER][/FONT][/COLOR][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(124, 252, 0)][FONT=georgia][SIZE=4]Одобрено.[/COLOR][/SIZE][/FONT][/CENTER]' ,
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: 'Капс',
      content:
        '[CENTER][SIZE=4][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Игрок будет наказан по следующему пункту правил:[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][I][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.02.[/SIZE][/COLOR][SIZE=4] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате. | [/I][/FONT][COLOR=rgb(255, 0, 0)][FONT=georgia][I]Mute 30 минут.[/I][/CENTER][/FONT][/COLOR][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(124, 252, 0)][FONT=georgia][SIZE=4]Одобрено.[/COLOR][/SIZE][/FONT][/CENTER]' ,
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },    
   {
              title: 'Оск',
      content:
        '[CENTER][SIZE=4][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Игрок будет наказан по следующему пункту правил:[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][I][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.03.[/SIZE][/COLOR][SIZE=4]Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены. | [/I][/FONT][COLOR=rgb(255, 0, 0)][FONT=georgia][I]Mute 30 минут.[/I][/CENTER][/FONT][/COLOR][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(124, 252, 0)][FONT=georgia][SIZE=4]Одобрено.[/COLOR][/SIZE][/FONT][/CENTER]' ,
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },    
{
              title: 'Оск(OOC)',
      content:
        '[CENTER][SIZE=4][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Игрок будет наказан по следующему пункту правил:[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][I][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.03.[/SIZE][/COLOR][SIZE=4]Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены. | [/I][/FONT][COLOR=rgb(255, 0, 0)][FONT=georgia][I]Mute 30 минут.[/I][/CENTER][/FONT][/COLOR][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(124, 252, 0)][FONT=georgia][SIZE=4]Одобрено.[/COLOR][/SIZE][/FONT][/CENTER]' ,
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
{
              title: 'Упом/оск родни',
      content:
        '[CENTER][SIZE=4][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Игрок будет наказан по следующему пункту правил:[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][I][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.04.[/SIZE][/COLOR][SIZE=4]Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC). | [/I][/FONT][COLOR=rgb(255, 0, 0)][FONT=georgia][I]Mute 30 минут.[/I][/CENTER][/FONT][/COLOR][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(124, 252, 0)][FONT=georgia][SIZE=4]Одобрено.[/COLOR][/SIZE][/FONT][/CENTER]' ,
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
{
              title: 'Флуд',
      content:
        '[CENTER][SIZE=4][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Игрок будет наказан по следующему пункту правил:[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][I][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.05.[/SIZE][/COLOR][SIZE=4]Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока. | [/I][/FONT][COLOR=rgb(255, 0, 0)][FONT=georgia][I]Mute 30 минут.[/I][/CENTER][/FONT][/COLOR][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(124, 252, 0)][FONT=georgia][SIZE=4]Одобрено.[/COLOR][/SIZE][/FONT][/CENTER]' ,
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
{
              title: 'Злоуп симв',
      content:
        '[CENTER][SIZE=4][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Игрок будет наказан по следующему пункту правил:[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][I][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.06.[/SIZE][/COLOR][SIZE=4]Запрещено злоупотребление знаков препинания и прочих символов(«???????», «!!!!!!!», «Дааааааааааааааааааааааа» и так далее). | [/I][/FONT][COLOR=rgb(255, 0, 0)][FONT=georgia][I]Mute 30 минут.[/I][/CENTER][/FONT][/COLOR][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(124, 252, 0)][FONT=georgia][SIZE=4]Одобрено.[/COLOR][/SIZE][/FONT][/CENTER]' ,
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
{
              title: 'Оск секс.хар',
      content:
        '[CENTER][SIZE=4][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Игрок будет наказан по следующему пункту правил:[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][I][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.07.[/SIZE][/COLOR][SIZE=4]Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата(«дырка», «шмара», «ведро», «мадагаскарский присосконог», «свиноногий бандикут», «скорострел» и так далее.)). | [/I][/FONT][COLOR=rgb(255, 0, 0)][FONT=georgia][I]Mute 30 минут.[/I][/CENTER][/FONT][/COLOR][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(124, 252, 0)][FONT=georgia][SIZE=4]Одобрено.[/COLOR][/SIZE][/FONT][/CENTER]' ,
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: 'Слив глоб чат',
      content:
        '[CENTER][SIZE=4][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Игрок будет наказан по следующему пункту правил:[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][I][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.08.[/SIZE][/COLOR][SIZE=4].Запрещены любые формы «слива» посредством использования глобальных чатов. | [/I][/FONT][COLOR=rgb(255, 0, 0)][FONT=georgia][I]PermBan.[/I][/CENTER][/FONT][/COLOR][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(124, 252, 0)][FONT=georgia][SIZE=4]Одобрено.[/COLOR][/SIZE][/FONT][/CENTER]' ,
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: 'Угрозы нак с адм',
      content:
        '[CENTER][SIZE=4][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Игрок будет наказан по следующему пункту правил:[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][I][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.09.[/SIZE][/COLOR][SIZE=4].Запрещены любые угрозы о наказании игрока со стороны администрации. | [/I][/FONT][COLOR=rgb(255, 0, 0)][FONT=georgia][I]Mute 30 минут.[/I][/CENTER][/FONT][/COLOR][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(124, 252, 0)][FONT=georgia][SIZE=4]Одобрено.[/COLOR][/SIZE][/FONT][/CENTER]' ,
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: 'Выдача себя за адм',
      content:
        '[CENTER][SIZE=4][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Игрок будет наказан по следующему пункту правил:[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][I][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.10.[/SIZE][/COLOR][SIZE=4]Запрещена выдача себя за администратора, если таковым не являетесь. | [/I][/FONT][COLOR=rgb(255, 0, 0)][FONT=georgia][I]Ban 7 - 15 + ЧС администрации.[/I][/CENTER][/FONT][/COLOR][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(124, 252, 0)][FONT=georgia][SIZE=4]Одобрено.[/COLOR][/SIZE][/FONT][/CENTER]' ,
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: 'Ввод в забл',
      content:
        '[CENTER][SIZE=4][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Игрок будет наказан по следующему пункту правил:[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][I][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.11.[/SIZE][/COLOR][SIZE=4]Запрещено введение игроков проекта в заблуждение путем злоупотребления командами. | [/I][/FONT][COLOR=rgb(255, 0, 0)][FONT=georgia][I]Ban 15 - 30 дней / PermBan.[/I][/CENTER][/FONT][/COLOR][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(124, 252, 0)][FONT=georgia][SIZE=4]Одобрено.[/COLOR][/SIZE][/FONT][/CENTER]' ,
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: 'Музыка в войс',
      content:
        '[CENTER][SIZE=4][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Игрок будет наказан по следующему пункту правил:[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][I][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.14.[/SIZE][/COLOR][SIZE=4]Запрещено включать музыку в Voice Chat. | [/I][/FONT][COLOR=rgb(255, 0, 0)][FONT=georgia][I]Mute 60 минут.[/I][/CENTER][/FONT][/COLOR][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(124, 252, 0)][FONT=georgia][SIZE=4]Одобрено.[/COLOR][/SIZE][/FONT][/CENTER]' ,
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: 'Оск в войс',
      content:
        '[CENTER][SIZE=4][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Игрок будет наказан по следующему пункту правил:[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][I][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.15.[/SIZE][/COLOR][SIZE=4]Запрещено оскорблять игроков или родных в Voice Chat. | [/I][/FONT][COLOR=rgb(255, 0, 0)][FONT=georgia][I]Mute 120 минут / Ban 7 - 15 дней.[/I][/CENTER][/FONT][/COLOR][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(124, 252, 0)][FONT=georgia][SIZE=4]Одобрено.[/COLOR][/SIZE][/FONT][/CENTER]' ,
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: 'Пост звуки войс',
      content:
        '[CENTER][SIZE=4][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Игрок будет наказан по следующему пункту правил:[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][I][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.16.[/SIZE][/COLOR][SIZE=4]Запрещено создавать посторонние шумы или звуки. | [/I][/FONT][COLOR=rgb(255, 0, 0)][FONT=georgia][I]Mute 30 минут.[/I][/CENTER][/FONT][/COLOR][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(124, 252, 0)][FONT=georgia][SIZE=4]Одобрено.[/COLOR][/SIZE][/FONT][/CENTER]' ,
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: 'Реклама войс',
      content:
        '[CENTER][SIZE=4][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Игрок будет наказан по следующему пункту правил:[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][I][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.17.[/SIZE][/COLOR][SIZE=4]Запрещена реклама в Voice Chat не связанная с игровым процессом(реклама Discord серверов, групп, сообществ, ютуб каналов и т.д.). | [/I][/FONT][COLOR=rgb(255, 0, 0)][FONT=georgia][I]Ban 7 - 15 дней.[/I][/CENTER][/FONT][/COLOR][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(124, 252, 0)][FONT=georgia][SIZE=4]Одобрено.[/COLOR][/SIZE][/FONT][/CENTER]' ,
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: 'Политика',
      content:
        '[CENTER][SIZE=4][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Игрок будет наказан по следующему пункту правил:[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][I][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.18.[/SIZE][/COLOR][SIZE=4]Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов. | [/I][/FONT][COLOR=rgb(255, 0, 0)][FONT=georgia][I]Mute 120 минут / Ban 10 дней.[/I][/CENTER][/FONT][/COLOR][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(124, 252, 0)][FONT=georgia][SIZE=4]Одобрено.[/COLOR][/SIZE][/FONT][/CENTER]' ,
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: 'Изменение голоса',
      content:
        '[CENTER][SIZE=4][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Игрок будет наказан по следующему пункту правил:[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][I][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.19.[/SIZE][/COLOR][SIZE=4]Запрещено использование любого софта для изменения голоса. | [/I][/FONT][COLOR=rgb(255, 0, 0)][FONT=georgia][I]Mute 60 минут.[/I][/CENTER][/FONT][/COLOR][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(124, 252, 0)][FONT=georgia][SIZE=4]Одобрено.[/COLOR][/SIZE][/FONT][/CENTER]' ,
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: 'Транслит',
      content:
        '[CENTER][SIZE=4][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Игрок будет наказан по следующему пункту правил:[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][I][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.20.[/SIZE][/COLOR][SIZE=4]Запрещено использование транслита в любом из чатов(«Privet», «Kak dela», «Narmalna»). | [/I][/FONT][COLOR=rgb(255, 0, 0)][FONT=georgia][I]Mute 30 минут.[/I][/CENTER][/FONT][/COLOR][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(124, 252, 0)][FONT=georgia][SIZE=4]Одобрено.[/COLOR][/SIZE][/FONT][/CENTER]' ,
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: 'Реклама промо',
      content:
        '[CENTER][SIZE=4][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Игрок будет наказан по следующему пункту правил:[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][I][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.21.[/SIZE][/COLOR][SIZE=4]Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. | [/I][/FONT][COLOR=rgb(255, 0, 0)][FONT=georgia][I]Ban 30 дней.[/I][/CENTER][/FONT][/COLOR][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(124, 252, 0)][FONT=georgia][SIZE=4]Одобрено.[/COLOR][/SIZE][/FONT][/CENTER]' ,
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: 'Объявы на тт госс',
      content:
        '[CENTER][SIZE=4][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Игрок будет наказан по следующему пункту правил:[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][I][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.22.[/SIZE][/COLOR][SIZE=4]Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC). | [/I][/FONT][COLOR=rgb(255, 0, 0)][FONT=georgia][I]Mute 30 минут.[/I][/CENTER][/FONT][/COLOR][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(124, 252, 0)][FONT=georgia][SIZE=4]Одобрено.[/COLOR][/SIZE][/FONT][/CENTER]' ,
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: 'Мат в Vip',
      content:
        '[CENTER][SIZE=4][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Игрок будет наказан по следующему пункту правил:[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][I][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.23.[/SIZE][/COLOR][SIZE=4]Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате. | [/I][/FONT][COLOR=rgb(255, 0, 0)][FONT=georgia][I]Mute 30 минут.[/I][/CENTER][/FONT][/COLOR][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(124, 252, 0)][FONT=georgia][SIZE=4]Одобрено.[/COLOR][/SIZE][/FONT][/CENTER]' ,
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
             title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила Role Play процесса ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
              title: '',
      content:
        '[CENTER][SIZE=4][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Игрок будет наказан по следующему пункту правил:[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][I][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.00.[/SIZE][/COLOR][SIZE=4]текст | [/I][/FONT][COLOR=rgb(255, 0, 0)][FONT=georgia][I]Mute 30 минут.[/I][/CENTER][/FONT][/COLOR][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(124, 252, 0)][FONT=georgia][SIZE=4]Одобрено.[/COLOR][/SIZE][/FONT][/CENTER]' ,
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
{
              title: '',
      content:
        '[CENTER][SIZE=4][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Игрок будет наказан по следующему пункту правил:[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][I][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.00.[/SIZE][/COLOR][SIZE=4]текст | [/I][/FONT][COLOR=rgb(255, 0, 0)][FONT=georgia][I]Mute 30 минут.[/I][/CENTER][/FONT][/COLOR][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(124, 252, 0)][FONT=georgia][SIZE=4]Одобрено.[/COLOR][/SIZE][/FONT][/CENTER]' ,
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: '',
      content:
        '[CENTER][SIZE=4][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Игрок будет наказан по следующему пункту правил:[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][I][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.00.[/SIZE][/COLOR][SIZE=4]текст | [/I][/FONT][COLOR=rgb(255, 0, 0)][FONT=georgia][I]Mute 30 минут.[/I][/CENTER][/FONT][/COLOR][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(124, 252, 0)][FONT=georgia][SIZE=4]Одобрено.[/COLOR][/SIZE][/FONT][/CENTER]' ,
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: '',
      content:
        '[CENTER][SIZE=4][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Игрок будет наказан по следующему пункту правил:[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][I][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.00.[/SIZE][/COLOR][SIZE=4]текст | [/I][/FONT][COLOR=rgb(255, 0, 0)][FONT=georgia][I]Mute 30 минут.[/I][/CENTER][/FONT][/COLOR][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(124, 252, 0)][FONT=georgia][SIZE=4]Одобрено.[/COLOR][/SIZE][/FONT][/CENTER]' ,
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: '',
      content:
        '[CENTER][SIZE=4][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Игрок будет наказан по следующему пункту правил:[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][I][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.00.[/SIZE][/COLOR][SIZE=4]текст | [/I][/FONT][COLOR=rgb(255, 0, 0)][FONT=georgia][I]Mute 30 минут.[/I][/CENTER][/FONT][/COLOR][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(124, 252, 0)][FONT=georgia][SIZE=4]Одобрено.[/COLOR][/SIZE][/FONT][/CENTER]' ,
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: '',
      content:
        '[CENTER][SIZE=4][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Игрок будет наказан по следующему пункту правил:[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][I][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.00.[/SIZE][/COLOR][SIZE=4]текст | [/I][/FONT][COLOR=rgb(255, 0, 0)][FONT=georgia][I]Mute 30 минут.[/I][/CENTER][/FONT][/COLOR][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(124, 252, 0)][FONT=georgia][SIZE=4]Одобрено.[/COLOR][/SIZE][/FONT][/CENTER]' ,
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: '',
      content:
        '[CENTER][SIZE=4][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Игрок будет наказан по следующему пункту правил:[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][I][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.00.[/SIZE][/COLOR][SIZE=4]текст | [/I][/FONT][COLOR=rgb(255, 0, 0)][FONT=georgia][I]Mute 30 минут.[/I][/CENTER][/FONT][/COLOR][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(124, 252, 0)][FONT=georgia][SIZE=4]Одобрено.[/COLOR][/SIZE][/FONT][/CENTER]' ,
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: '',
      content:
        '[CENTER][SIZE=4][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Игрок будет наказан по следующему пункту правил:[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][I][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.00.[/SIZE][/COLOR][SIZE=4]текст | [/I][/FONT][COLOR=rgb(255, 0, 0)][FONT=georgia][I]Mute 30 минут.[/I][/CENTER][/FONT][/COLOR][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(124, 252, 0)][FONT=georgia][SIZE=4]Одобрено.[/COLOR][/SIZE][/FONT][/CENTER]' ,
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: '',
      content:
        '[CENTER][SIZE=4][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Игрок будет наказан по следующему пункту правил:[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][I][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.00.[/SIZE][/COLOR][SIZE=4]текст | [/I][/FONT][COLOR=rgb(255, 0, 0)][FONT=georgia][I]Mute 30 минут.[/I][/CENTER][/FONT][/COLOR][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(124, 252, 0)][FONT=georgia][SIZE=4]Одобрено.[/COLOR][/SIZE][/FONT][/CENTER]' ,
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: '',
      content:
        '[CENTER][SIZE=4][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Игрок будет наказан по следующему пункту правил:[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][I][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.00.[/SIZE][/COLOR][SIZE=4]текст | [/I][/FONT][COLOR=rgb(255, 0, 0)][FONT=georgia][I]Mute 30 минут.[/I][/CENTER][/FONT][/COLOR][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(124, 252, 0)][FONT=georgia][SIZE=4]Одобрено.[/COLOR][/SIZE][/FONT][/CENTER]' ,
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: '',
      content:
        '[CENTER][SIZE=4][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Игрок будет наказан по следующему пункту правил:[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][I][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.00.[/SIZE][/COLOR][SIZE=4]текст | [/I][/FONT][COLOR=rgb(255, 0, 0)][FONT=georgia][I]Mute 30 минут.[/I][/CENTER][/FONT][/COLOR][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(124, 252, 0)][FONT=georgia][SIZE=4]Одобрено.[/COLOR][/SIZE][/FONT][/CENTER]' ,
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: '',
      content:
        '[CENTER][SIZE=4][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Игрок будет наказан по следующему пункту правил:[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][I][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.00.[/SIZE][/COLOR][SIZE=4]текст | [/I][/FONT][COLOR=rgb(255, 0, 0)][FONT=georgia][I]Mute 30 минут.[/I][/CENTER][/FONT][/COLOR][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(124, 252, 0)][FONT=georgia][SIZE=4]Одобрено.[/COLOR][/SIZE][/FONT][/CENTER]' ,
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: '',
      content:
        '[CENTER][SIZE=4][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Игрок будет наказан по следующему пункту правил:[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][I][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.00.[/SIZE][/COLOR][SIZE=4]текст | [/I][/FONT][COLOR=rgb(255, 0, 0)][FONT=georgia][I]Mute 30 минут.[/I][/CENTER][/FONT][/COLOR][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(124, 252, 0)][FONT=georgia][SIZE=4]Одобрено.[/COLOR][/SIZE][/FONT][/CENTER]' ,
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: '',
      content:
        '[CENTER][SIZE=4][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Игрок будет наказан по следующему пункту правил:[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][I][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.00.[/SIZE][/COLOR][SIZE=4]текст | [/I][/FONT][COLOR=rgb(255, 0, 0)][FONT=georgia][I]Mute 30 минут.[/I][/CENTER][/FONT][/COLOR][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(124, 252, 0)][FONT=georgia][SIZE=4]Одобрено.[/COLOR][/SIZE][/FONT][/CENTER]' ,
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: '',
      content:
        '[CENTER][SIZE=4][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Игрок будет наказан по следующему пункту правил:[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][I][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.00.[/SIZE][/COLOR][SIZE=4]текст | [/I][/FONT][COLOR=rgb(255, 0, 0)][FONT=georgia][I]Mute 30 минут.[/I][/CENTER][/FONT][/COLOR][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(124, 252, 0)][FONT=georgia][SIZE=4]Одобрено.[/COLOR][/SIZE][/FONT][/CENTER]' ,
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: '',
      content:
        '[CENTER][SIZE=4][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Игрок будет наказан по следующему пункту правил:[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][I][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.00.[/SIZE][/COLOR][SIZE=4]текст | [/I][/FONT][COLOR=rgb(255, 0, 0)][FONT=georgia][I]Mute 30 минут.[/I][/CENTER][/FONT][/COLOR][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(124, 252, 0)][FONT=georgia][SIZE=4]Одобрено.[/COLOR][/SIZE][/FONT][/CENTER]' ,
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: '',
      content:
        '[CENTER][SIZE=4][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Игрок будет наказан по следующему пункту правил:[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][I][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.00.[/SIZE][/COLOR][SIZE=4]текст | [/I][/FONT][COLOR=rgb(255, 0, 0)][FONT=georgia][I]Mute 30 минут.[/I][/CENTER][/FONT][/COLOR][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(124, 252, 0)][FONT=georgia][SIZE=4]Одобрено.[/COLOR][/SIZE][/FONT][/CENTER]' ,
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: '',
      content:
        '[CENTER][SIZE=4][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Игрок будет наказан по следующему пункту правил:[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][I][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.00.[/SIZE][/COLOR][SIZE=4]текст | [/I][/FONT][COLOR=rgb(255, 0, 0)][FONT=georgia][I]Mute 30 минут.[/I][/CENTER][/FONT][/COLOR][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(124, 252, 0)][FONT=georgia][SIZE=4]Одобрено.[/COLOR][/SIZE][/FONT][/CENTER]' ,
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: '',
      content:
        '[CENTER][SIZE=4][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][FONT=georgia][SIZE=4]Игрок будет наказан по следующему пункту правил:[/CENTER][/FONT][/SIZE]<br>' +
        '[CENTER][I][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]2.00.[/SIZE][/COLOR][SIZE=4]текст | [/I][/FONT][COLOR=rgb(255, 0, 0)][FONT=georgia][I]Mute 30 минут.[/I][/CENTER][/FONT][/COLOR][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(124, 252, 0)][FONT=georgia][SIZE=4]Одобрено.[/COLOR][/SIZE][/FONT][/CENTER]' ,
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
