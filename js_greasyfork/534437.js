// ==UserScript==
// @name         Скрипт для кураторов форума и ГС
// @namespace    https://forum.blackrussia.online
// @version      1.1
// @description  ???
// @author       Raf Simons
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @license      none
// @icon         https://i.postimg.cc/YqrNXDMv/1120b3454f429f3e9ffc94fb4f4becad.jpg
// @downloadURL https://update.greasyfork.org/scripts/534437/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%D0%B8%20%D0%93%D0%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/534437/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%D0%B8%20%D0%93%D0%A1.meta.js
// ==/UserScript==
// Автор исходника: Kumiho
// Исходник: https://greasyfork.org/ru/scripts/522186-arkhangelsk-%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82-%D0%B4%D0%BB%D1%8F-%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2-%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0/code
    (function () {
	'use strict';
	const PIN_PREFIX = 2; //  префикс закрепить
	const COMMAND_PREFIX = 10; // команде проекта
	const CLOSE_PREFIX = 7; // префикс закрыто
	const DECIDED_PREFIX = 6; // префикс решено
	const TECHADM_PREFIX = 13 // тех администратору
	const WATCHED_PREFIX = 9; // рассмотрено
	const WAIT_PREFIX = 14; // ожидание
    const ACCEPT_PREFIX = 8; // префикс одобрено
    const UNACCEPT_PREFIX = 4; // префикс отказано
    const GA_PREFIX = 12; // передать га
    const VAJNO_PREFIX = 1; // передать гкф
    const NO_PREFIX = 0;
	const buttons = [
     {
      title: "Приветствие",
      color: "black",
      content:
      "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
      "текст",
     },
{
     title: "На рассмотрение",
     color: "black",
     content:
     "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
     "Ваша жалоба взята на рассмотрение, не создавайте дубликатов и ожидайте ответа от администрации.[/SIZE][/CENTER]",
     prefix: 2,
     status: false,
},
{
    title: "Не по форме",
    color: "black",
    content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
    "Ваша жалоба составлена не по форме.<br>Ознакомьтесь с формой подачи жалоб: [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/']нажмите[/URL]<br><br>" +
    "[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
    prefix: 7,
    statis: false,
},
     {
	  title: '|-(--(--(->------ Причины отказов ------<)--)--)-|',
      color: 'oswald: 3px; color: red; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFFF00',
	},
{
    title: "| Нет в логах |",
    color: "black",
    content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
    "В системе логирования нарушений не найдено.<br><br>" +
    "[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
    prefix: 7,
    status: false,
},
{
    title: "| Нет нарушений |",
    color: "black",
    content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
    "Нет нарушений со стороны игрока.<br><br>" +
    "[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
    prefix: 7,
    status: false,
},
{
    title: "| От 3-го лица |",
    color: "black",
    content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
    "Жалобы, созданные от третьего, лица рассмотрению не подлежат.<br><br>" +
    "[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
    prefix: 7,
    status: false,
},
{
    title: "| Нет доказательств |",
    color: "black",
    content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
    "В жалобе отсутствуют доказательства.<br><br>" +
    "[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
    prefix: 7,
    status: false,
},
{
    title: "| Недостаточно док-в |",
    color: "black",
    content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
    "Недостаточно доказательств для выдачи наказания.<br><br>" +
    "[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
    prefix: 7,
    stafus: false,
},
{
    title: "| Док-ва отредактированы |",
    color: "black",
    content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
    "Доказательства были подвергнуты редактированию. Жалоба расмотрению не подлежит.<br><br>" +
    "[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
    prefix: 7,
    status: false,
},
{
    title: "| Док-ва в соц. сетях |",
    color: "black",
    content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
    "Жалоба отказана, поскольку доказательства, загруженные в соц. сетях рассмотрению не подлежат.<br><br>" +
    "[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
    prefix: 7,
    status: false,
},
{
    title: "| Док-ва не работают |",
    color: "black",
    content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
    "Ваши доказательства не открываются.<br><br>" +
    "[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
     prefix: 7,
     status: false,
},
{
    title: "| Нет /time |",
    color: "black",
    content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
    "На доказательствах отсутствует время (/time).<br><br>" +
    "[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
    prefix: 7,
    status: false,
},
{
    title: "| Нужен фрапс |",
    color: "black",
    content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
    "В данном случае доказательства должны быть в форме видео.<br><br>" +
    "[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
    prefix: 7,
    status: false,
},
{
    title: "| Неполный фрапс |",
    color: "black",
    content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
    "Доказательства неполные или обрываются.<br><br>" +
    "[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
    prefix: 7,
    status: false,
},
{
    title: "| Нет условий сделки |",
    color: "black",
    content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
    "На доказательствах отсутствуют условия сделки.<br><br>" +
    "[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
     prefix: 7,
    status: false,
},
{
    title: "| Нет тайм-кодов |",
    color: "black",
    content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
    "Если видео длится более 3-х минут, необходимо указать тайм-коды.<br><br>" +
    "[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
    prefix: 7,
    status: false,
},
{
    title: "| Прошло 72 часа |",
    color: "black",
    content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
    "С момента совершения нарушения от игрока прошло более 72 часа.<br><br>" +
    "[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
    prefix: 7,
    status: false,
},
      {
	  title: '|-(--(--(->-------- RP Нарушения --------<-)--)--)-|',
      color: 'oswald: 3px; color: green; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFFF00',
	},
   {
	  title: "| DM |",
      color: 'oswald: 3px; color: red; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFFF00',
	  content:
      "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
	  "Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание:<br><br>[color=red]2.19[/color] | [color=lavender] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины.[/color][color=red]  | Jail 60 минут[/color]<br><br>"+
      "[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
      prefix: 8,
	  status: false,
	},
	{
	  title: "| DB |",
      color: "black",
	  content:
      "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
	  "Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание:<br><br>[color=red]2.13[/color] | [color=lavender] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта[/color] [color=red] | Jail 60 минут.[/color]<br><br>"+
      "[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
      prefix: 8,
	  status: false,
	},
	{
	  title: "| Mass DM |",
      color: "black",
	  content:
      "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
	  "Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание:<br><br>[color=red]2.20[/color] | [color=lavender] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более.[/color][color=red]  | Warn / Бан 7-15 дней.[/color]<br><br>"+
      "[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
	  prefix: 8,
	  status: false,
	},
	{
	  title: "| Сбив анимки |",
      color: "black",
	  content:
      "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
	  "Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание:<br><br>[color=red]2.55[/color] | [color=lavender] Запрещается багоюз, связанный с анимацией в любых проявлениях.[/color] [color=red]  | Jail 120 минут[/color]<br><br>"+
      "[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
	  prefix: 8,
	  status: false,
	},
	{
	  title: "| Слив склада |",
      color: "black",
	  content:
      "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
	  "Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание:<br><br>[color=red]2.21[/color] | [color=lavender] 2.09. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле[/color] [color=red]  | Ban 15-30 дней / Permban[/color]<br><br>"+
      "[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
	  prefix: 8,
	  status: false,
	},
	{
	  title: "| Аморальные действия |",
      color: "black",
	  content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
	"Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание:<br><br>[color=red]2.08[/color] | [color=lavender] Запрещена любая форма аморальных действий сексуального характера в сторону игроков[/color] [color=red]  | Jail 30 минут / Warn[/color]<br><br>"+
    "[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
	  prefix: 8,
	  status: false,
	},
    {
      title: "| Обход системы |",
      color: "black",
      content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
    "Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание:<br><br>[color=red]2.21[/color] | [color=lavender] Запрещено пытаться обходить игровую систему или использовать любые баги сервера[/color] [color=red] | Ban 15-30 дней / Permban[/color]<br><br>"+
    "[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
      prefix: 8,
      status: false,
    },
	{
	  title: "| Стороннее ПО |",
      color: "black",
	  content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
	"Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание:<br><br>[color=red]2.05[/color] | [color=lavender] Запрещено хранить / использовать / распространять стороннее программное обеспечение, сборки или любые другие средства, позволяющие получить преимущество над другими игроками[/color][color=red] | Ban 15 - 30 дней / PermBan[/color]<br><br>"+
    "[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
	  prefix: 8,
	  status: false,
	},
	{
	  title: "| Редактирование в личных целях |",
      color: "black",
	  content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
	"Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание:<br><br>[color=red]*  [color=lavender] Запрещено редактировать поданные объявления в личных целях, заменяя текст объявления на несоответствующий отправленному игроком[/color][color=red]  | Ban 7 дней + ЧС организации[/color]<br><br>"+
    "[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
	  prefix: 8,
	  status: false,
	},
    {
	  title: "| Убийство при задержании |",
      color: "black",
	  content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
	"Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание:<br><br> | [color=lavender] Запрещено целенаправленно убивать преступника во время задержания без весомой Role Play причины.[/color]  [color=red]  | Warn[/color]<br><br>"+
    "[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
	  prefix: 8,
	  status: false,
	},
  {
	  title: '|-(--(--(->------- Чат Нарушения -------<-)--)--)-|',
      color: 'oswald: 3px; color: pink; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFFF00',
	},
    {
	  title: "| КАПС |",
      color: "black",
	  content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
	"Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание:<br><br>[color=red]3.02[/color] | [color=lavender] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате[/color] [color=red]  | Mute 30 минут[/color]<br><br>"+
    "[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
	  prefix: 8,
	  status: false,
	},
     {
	  title: "| MG |",
      color: "black",
	  content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
	"Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание:<br><br>[color=red]2.18[/color]  [color=lavender] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе.[/color][color=red]  | Mute 30 минут.[/color]<br><br>"+
    "[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
	  prefix: 8,
	  status: false,
	},
	{
	  title: "| Оск в /n |",
      color: "black",
	  content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
	"Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание:<br><br>[color=red]3.03[/color] | [color=lavender] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены[/color][color=red]  | Mute 30 минут[/color]<br><br>"+
    "[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
	  prefix: 8,
	  status: false,
	},
	{
	  title: "| Оск/Упом родни |",
      color: 'oswald: 3px; color: red; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFFF00',
	  content:
    "[CENTER][SIZE=14px][I][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
	"Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание:<br><br>[color=red]3.04[/color] | [color=lavender] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC)[/color]  [color=red]  | Mute 120 минут / Ban 7-15 дней[/color]<br><br>"+
    "[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/I][/CENTER][/SIZE]",
	  prefix: 8,
	  status: false,
	},
	{
	  title: '| Мат в /v |',
      color: "black",
      content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
	"Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание:<br><br>[color=red]3.23[/color] | [color=lavender] Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате[/color][color=red]  | Mute 30 минут[/color]<br><br>"+
    "[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
	  prefix: 8,
	  status: false,
	},
    {
	  title: '| Слив чата |',
      color: "black",
	  content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
	"Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание:<br><br>[color=red]3.08[/color] | [color=lavender] Запрещены любые формы «слива» посредством использования глобальных чатов[/color][color=red]  | Permban[/color]<br><br>"+
    "[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
	  prefix: 8,
	  status: false,
	},
	{
	  title: '| Оск адм |',
      color: "black",
	  content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
    "Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание:<br><br>[color=red]2.54[/color] | [color=lavender]   Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации[/color]   [color=red]  | Mute 180 минут[/color]<br><br>"+
     "[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
	  prefix: 8,
	  status: false,
	},
	{
	  title: '| Политика/Религия |',
      color: "black",
	  content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
	"Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание:<br><br>[color=red]3.18[/color] | [color=lavender] Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов[/color][color=red]  | Mute 120 минут / Ban 10 дней[/color]<br><br>"+
    "[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
	  prefix: 8,
	  status: false,
	},
	{
	  title: '| Промокоды |',
      color: "black",
	  content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
    "Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание:<br><br>[color=red]3.21[/color] | [color=lavender] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах[/color] [color=red]  | Ban 30 дней[/color]<br><br>"+
    "[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
	  prefix: 8,
	  status: false,
	},
{
	  title: '| ООС угрозы |',
      color: "black",
	  content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
	"Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание:<br><br>[color=red]2.37[/color] | [color=lavender] Запрещены OOC угрозы, в том числе и завуалированные[/color] [color=red]  | Ban 15-30 дней / Permban[/color]<br><br>"+
    "[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
	  prefix: 8,
	  status: false,
	},
	{
	  title: '| Реклама |',
      color: "black",
	  content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
	"Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание:<br><br>[color=red]2.31[/color] | [color=lavender] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное[/color]  [color=red] | Ban 7 дней / PermBan[/color]<br><br>"+
    "[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
	  prefix: 8,
	  status: false,
	},
     {
	  title: '|-(--(--)->------ NonRP нарушения ------<-)--)--)-|',
      color: 'oswald: 3px; color: lightblue; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFFF00',
	},
      {
	  title: '| NonRP поведение |',
      color: "black",
	  content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
	"Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание:<br><br>[color=red]2.13[/color] | [color=lavender] Запрещено поведение, нарушающее нормы процессов Role Play режима игры[/color] [color=red] | Jail 30 минут[/color]<br><br>"+
    "[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
	  prefix: 8,
	  status: false,
	},
{
	  title: '| NonRP обман |',
      color: "color: red; background: black",
	  content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
	"Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание:<br><br>[color=red]2.05[/color] | [color=lavender] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики[/color][color=red]  | Permban[/color]<br><br>"+
    "[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
	  prefix: 8,
	  status: false,
	},
{
	  title: '| NonRP edit |',
      color: "black",
	  content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
	"Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание:[color=red]*[/color]  [color=lavender] Запрещено редактирование объявлений, не соответствующих ПРО[/color][color=red]  | Mute 30 минут[/color]<br><br>"+
    "[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
	  prefix: 8,
	  status: false,
	},
	{
      title: '| NonRP розыск |',
      color: "black",
	  content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
	"Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание:<br><br>[color=red]*[/color] | [color=lavender] Запрещено выдавать розыск без Role Play причины[/color][color=red]  | Warn / Jail 30 минут[/color]<br><br>"+
    "[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
	  prefix: 8,
	  status: false,
	},
    	{
	  title: '| NonRP В/ч |',
      color: "black",
	  content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
	"Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание:<br><br>[color=red]*[/color] | [color=lavender] Запрещено нападать на военную часть нарушая Role Play[/color] [color=red]  | Warn (для ОПГ) / Jail 30 минут (для Гражданских)[/color]<br><br>"+
    "[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
	  prefix: 8,
	  status: false,
	},
    	{
	  title: '| Оск. никнейм |',
      color: "black",
	  content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
	"Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание:<br><br>[color=red]*[/color]  | [color=lavender] Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные)[/color][color=red]  | Устное замечание + смена игрового никнейма / PermBan[/color]<br><br>"+
    "[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
	  prefix: 8,
	  status: false,
	},
    	{
	  title: '| Фейк |',
      color: "black",
	  content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
	"Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание:<br><br>[color=red] 4.10[/color] | [color=lavender] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию. Пример: подменять букву i на L и так далее, по аналогии[/color] [color=red]  | PermBan[/color]<br><br>"+
    "[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
	  prefix: 8,
	  status: false,
	},
     {
	  title: '|-(--(--(->------ Передача жалоб ------<-)--)--)-|',
      color: 'oswald: 3px; color: mediumpurple; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFFF00',
	},
     {
	  title: '| Передать ГКФ |',
      color: "black",
	  content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
    "Ваша жалоба была передана [COLOR=rgb(255, 182, 193)]Главному Куратору Форума[/COLOR].<br><br>"+
    "[COLOR=rgb(255, 182, 193)]На рассмотрении[/COLOR].[/CENTER][/SIZE]",
	  prefix: 2,
	  status: true,
	},
    {
	  title: '| Техническому специалисту |',
      color: 'oswald: 3px; color: white; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFFF00',
	  content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
	"Ваша жалоба была передана нашему любимому [Color=pink]Техническому специалисту.[/CENTER][/SIZE]",
	  prefix: 13,
	  status: true,
	},
    {
	  title: '| Передать ГА |',
      color: 'oswald: 3px; color: white; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFFF00',
	  content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
	"Ваша жалоба была передана [COLOR=rgb(255, 182, 193)]Главному Администратору.[/COLOR]<br><br>"+
	"[COLOR=rgb(255, 182, 193)]На рассмотрении[/COLOR].[/CENTER][/SIZE]",
  prefix: 12,
	  status: true,
	},
    {
	  title: '|-(--(--(->------- В другой раздел -------<-)--)--)-|',
      color: 'oswald: 3px; color: azure; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFFF00',
	},
    {
     title: 'На администрацию',
     color: 'oswald: 3px; color: #FF0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #ffffff',
     content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
    "Вы ошиблись разделом. Обратитесь в раздел жалоб на администрацию.<br>Форма для подачи жалобы: [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-администрацию.3429349/']нажмите[/URL]<br><br>" +
    "[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
      prefix: 7,
      status: false,
    },
    {
     title: 'В обжалования',
     color: 'oswald: 3px; color: #FF0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #ffffff',
     content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
    "Вы ошиблись разделом. Обратитесь в раздел «Обжалование наказаний».<br>Форма для подачи обжалования: [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-администрацию.3429349/']нажмите[/URL]<br><br>" +
    "[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
      prefix: 7,
      status: false,
    },
	{
	  title: 'В жалобы на сотрудников',
      color: "black",
	  content:
    "[CENTER][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
	"Вы ошиблись разделом, обратитесь в раздел жалоб на сотрудников данной организации.<br><br>"+
    "[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/CENTER][/SIZE]",
	  prefix: 8,
	  status: false,
	},
        {
	  title: '|-(--(--(->------ Жалобы на лидеров ------<-)--)--)-|',
      color: 'oswald: 3px; color: mediumpurple; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFFF00',
        },
        {
            title: "Одобрено",
            color: "black",
            content:
            "[CENTER][I][FONT=Times New Roman][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
            "К лидеру будут приняты необходимые меры.<br>Благодарим за обращение.<br><br>"+
            "[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/I][/FONT][/CENTER][/SIZE]",
        },
        {
            title: "Отказано",
            color: "black",
            content:
            "[CENTER][I][FONT=Times New Roman][SIZE=14px][COLOR=rgb(255, 182, 193)]Здравствуйте, уважаемый[/COLOR] {{ user.mention }}.<br><br>" +
            "Нарушений от лидера не обнаружено.<br><br>"+
            "[COLOR=rgb(255, 182, 193)]Закрыто[/COLOR].[/I][/FONT][/CENTER][/SIZE]",
        },
];
    	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницs
	addButton('Одобрено', 'accept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(110, 192, 113, 0.5);');
	addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(220, 89, 89, 0.5);');
	addAnswers();

	// Поиск информации о теме
	const threadData = getThreadData();

	$(`button#ff`).click(() => pasteContent(8, threadData, true));
	$(`button#prr`).click(() => pasteContent(2, threadData, true));
	$(`button#zhb`).click(() => pasteContent(21, threadData, true));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
	$('button#decided').click(() => editThreadData(DECIDED_PREFIX, false));
	$('button#closed').click(() => editThreadData(CLOSE_PREFIX, false));
	$('button#closed_complaint').click(() => editThreadData(CLOSE_PREFIX, false, false));
    $('button#accept').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#techspec').click(() => editThreadData(TECHADM_PREFIX, true));
    $('button#ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#vajno').click(() => editThreadData(VAJNO_PREFIX, true));

	$(`button#selectAnswer`).click(() => {
	XF.alert(buttonsMarkup(buttons), null, '¿¿¿');
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

   function addButton(name, id, hex = "grey") {
		$('.button--icon--reply').before(
		`<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 13px; margin-right: 5px; background-color: ${hex}">${name}</button>`,
		);
	}
	function addAnswers() {
		$('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; background: mediumpurple; color: lavender; margin-left: 10px; margin-top: 10px; border-radius: 13px;">Шаблончики</button>`,
	);
	}

	function buttonsMarkup(buttons) {
		return `<div class="select_answer">${buttons
		  .map(
			(btn, i) =>
			  `<button id="answers-${i}" class="button--primary button ` +
			  `rippleButton" style="border-radius: 25px; margin:5px; background-color: ${btn.color || "grey"}"><span class="button-text">${btn.title}</span></button>`,
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


         function editThreadData(prefix, pin = false, kumiho = true) {
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

const bgButtons = document.querySelector(".pageContent");
const buttonConfig = (text, href) => {
  const button = document.createElement("button");
  button.textContent = text;
  button.classList.add("bgButton");
  button.addEventListener("click", () => {
    window.location.href = href;
  });
  return button;
};

    const Button2 = buttonConfig("ОПС", "https://forum.blackrussia.online/threads/Общие-правила-серверов.312571/");

    bgButtons.append(Button2);


(function () {
    'use strict';

    function createAnimatedSnow() {

        const snowflakes = [];

        function setupCanvas() {
            const canvas = document.createElement('canvas');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            canvas.id = 'snow-flakes';
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.pointerEvents = 'none';
            canvas.style.zIndex = '99999';
            canvas.style.filter = 'blur(2px)';
            document.body.appendChild(canvas);

            return canvas.getContext('2d');
        }

        function createSnowflake(x, y) {
            const size = Math.random() * 2 + 1;
            const speedY = Math.random() * 1 + 1;
            const speedX = (Math.random() - 0.5) * 2;

            return { x, y, size, speedY, speedX };
        }

        function drawSnowflake(ctx, snowflake) {
            ctx.beginPath();
            ctx.arc(snowflake.x, snowflake.y, snowflake.size, 0, Math.PI * 2);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.closePath();
        }

        function updateSnowflakes(ctx) {
            for (let i = 0; i < snowflakes.length; i++) {
                const snowflake = snowflakes[i];

                snowflake.y += snowflake.speedY;
                snowflake.x += snowflake.speedX;

                if (snowflake.y > window.innerHeight || snowflake.x > window.innerWidth) {
                    snowflakes[i] = createSnowflake(Math.random() * window.innerWidth, Math.random() * -window.innerHeight);
                }

                drawSnowflake(ctx, snowflake);
            }
        }

        function animateSnow() {
            const ctx = setupCanvas();

            for (let i = 0; i < 500; i++) {
                snowflakes.push(createSnowflake(Math.random() * window.innerWidth, Math.random() * window.innerHeight));
            }

            function animate() {
                ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
                updateSnowflakes(ctx);
                requestAnimationFrame(animate);
            }

            animate();
        }

        animateSnow();

    }

    function removeAnimatedSnow() {
        const snowCanvas = document.querySelector('#snow-flakes');
        document.body.removeChild(snowCanvas);
    }

    const uixLogo = document.querySelector('a.uix_logo img');
    uixLogo.src = 'https://i.postimg.cc/JzQPT4Wc/blackrussia.png';
    uixLogo.srcset = 'https://i.postimg.cc/JzQPT4Wc/blackrussia.png';

    const messageCellUser = document.querySelectorAll('.message-cell--user');
    messageCellUser.forEach(function (cell) {
        cell.style.background = '#29586c88';
    });

    const messageCellMain = document.querySelectorAll('.message-cell--main');
    messageCellMain.forEach(function (cell) {
        cell.style.background = '#15293788';
    });

    const scrollbarStyle = document.createElement('style');
    scrollbarStyle.id = 'style-scrollbar';
    scrollbarStyle.textContent = `
    `;
    document.head.appendChild(scrollbarStyle);

    const pageHeader = document.querySelector('.pageContent');
    const switchStyleBlock = document.createElement('label');
    switchStyleBlock.className = 'switch';
    switchStyleBlock.innerHTML = `
            <input type="checkbox" id="styleToggleCheck">
            <span class="slider round" style="padding-right: 20px;">
            <span class="addingText" style="display: block; width: max-content; margin: 5px; margin-left: 42px; margin-top: 2px;">Snow</span>
            </span>
        `;
    pageHeader.appendChild(switchStyleBlock);

    const styleToggleCheck = document.getElementById('styleToggleCheck');
    if (localStorage.getItem('snowEnabled') === 'true') {
        styleToggleCheck.checked = true;
        createAnimatedSnow();
    }
    styleToggleCheck.addEventListener('change', function () {
        if (styleToggleCheck.checked) {
            createAnimatedSnow();
            localStorage.setItem('snowEnabled', 'true');
        } else {
            removeAnimatedSnow();
            localStorage.setItem('snowEnabled', 'false');
        }
    });

    const sliderStyle = document.createElement('style');
    sliderStyle.id = 'slider-style';
    sliderStyle.textContent = `
    .switch {
        position: relative;
        display: inline-block;
        width: 40px;
        height: 20px;
        padding-left: 20px;
        margin: 0 30px 0 auto;
    }
    .switch input { display: none; }
    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: 1px solid #34aaeb;
        background-color: #212428;
        transition: all .4s ease;
    }
    .slider:hover{
        background-color: #29686d;
    }
    .slider:before {
        position: absolute;
        content: "";
        height: 14px;
        width: 14px;
        left: 2px;
        bottom: 2px;
        background-color: #32a0a8;
        box-shadow: 0 0 5px #000000;
        transition: all .4s ease;
    }
    input:checked + .slider {
        background-color: #212428;
    }
    input:checked + .slider:hover {
        background-color: #29686d;
    }
    input:focus + .slider {
        box-shadow: 0 0 5px #222222;
        background-color: #444444;
    }
    input:checked + .slider:before {
        transform: translateX(19px);
    }
    .slider.round {
        border-radius: 34px;
    }
    .slider.round:before {
        border-radius: 50%;
    }
`;
    document.head.appendChild(sliderStyle);
})();