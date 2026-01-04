// ==UserScript==
// @name       Для ЗГА/ГА
// @namespace    https://forum.blackrussia.online
// @version      20.8
// @description  Скрипт для ЗГА/ГА
// @author       Vova Stoyn by Penethrator
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license 	 MIT
// @collaborator Quenk269
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @downloadURL https://update.greasyfork.org/scripts/482550/%D0%94%D0%BB%D1%8F%20%D0%97%D0%93%D0%90%D0%93%D0%90.user.js
// @updateURL https://update.greasyfork.org/scripts/482550/%D0%94%D0%BB%D1%8F%20%D0%97%D0%93%D0%90%D0%93%D0%90.meta.js
// ==/UserScript==
 
(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7; // Prefix that will be set when thread closes.
const SA_PREFIX = 11;
const GA_PREFIX = 12;
const V_PREFIX = 1;
const buttons = [
    {
      title: 'Сам сказку расскажу',
      content:     
        "[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
	"[B][CENTER][COLOR=lavender] [/CENTER][/COLOR][/B]",
    },
    {
      title: 'Научись писать',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=georgia][I][COLOR=rgb(209, 213, 216)]Ваша жалоба составлена не по форме.[/COLOR]<br><br>" +
        "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила составления жалобы/обжаования[/COLOR][/I][/FONT][/SIZE]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
             title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Передача жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
              title: 'Передано Манькрафтеру',
      content:       
        "[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]Ваша жалоба переадресована [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Главному Администратору[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/I][/COLOR]<br>" +
        "[FONT=times new roman][SIZE=4][I][COLOR=rgb(209, 213, 216)]Ожидайте ответа в данной теме, копии создавать не нужно.[/COLOR][/I][/SIZE][/FONT][/CENTER]<br>" +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/WzS9J9zf/giphy-2.gif[/img][/url]',
      prefix: GA_PREFIX,
      status: true,
    },
    {
              title: 'Передано Ростику и богдану',
      content:        
        "[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]Ваша жалоба переадресована [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Специальному Администратору[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/I][/COLOR]<br><br>" +
        "[FONT=times new roman][SIZE=4][I][COLOR=rgb(209, 213, 216)]Ожидайте ответа в данной теме, копии создавать не нужно.[/COLOR][/I][/SIZE][/FONT][/CENTER]<br>" +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/WzS9J9zf/giphy-2.gif[/img][/url]',
      prefix: SA_PREFIX,
      status: true,
    },
    {
                      title: 'Передано нашим создателям',
      content:        
        "[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]Ваша жалоба переадресована [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Команде Проекта[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/I][/COLOR]<br><br>" +
        "[FONT=times new roman][SIZE=4][I][COLOR=rgb(209, 213, 216)]Ожидайте ответа в данной теме, копии создавать не нужно.[/COLOR][/I][/SIZE][/FONT][/CENTER]<br>" +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/WzS9J9zf/giphy-2.gif[/img][/url]',
      prefix: SA_PREFIX,
      status: true,
    },
    {
             title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Фарм сообщений ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Отказано',
      content:       
        "[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Администрация не готова сократить или снять вам наказание.[/FONT][/SIZE]<br>" +
        "[SIZE=4][FONT=times new roman]В обжаловании отказано.[/FONT][/SIZE][/I][/COLOR]<br><br>" +
        "[FONT=times new roman][COLOR=#d1d5d8][SIZE=4][I]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/COLOR][/FONT]<br><br>" +
         '[FONT=georgia][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Не обжалуется эже бля',
      content:        
        "[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[COLOR=#ff0000][SIZE=4][I][FONT=times new roman][COLOR=rgb(209, 213, 216)]Данное нарушение обжалованию не подлежит.[/COLOR][/FONT][/I][/SIZE][/COLOR]<br>" +
        "[FONT=times new roman][COLOR=#d1d5d8][SIZE=4][I]Внимательно прочитайте правила подачи обжалования, закреплённые в данном разделе.<br>" +
        "В обжаловании отказано.<br><br>" +
        "Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/COLOR][/FONT]<br><br>" +
         '[FONT=georgia][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Научись писать обж',
      content:      
        "[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Обжалование составлено не по форме.[/FONT][/SIZE]<br>" +
        "[SIZE=4][FONT=times new roman]Внимательно прочитайте правила составления обжалований - [/FONT][/SIZE][/I][/COLOR][SIZE=4][FONT=times new roman][URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.1158794/']*Нажмите сюда*[/URL].[/FONT][/SIZE]<br><br>" +
        '[FONT=georgia][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Обжалование передано манькрафтеру',
      content:        
        "[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4]Ваше обжалование переадресовано[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4] Главному Администратору[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/I][/COLOR]<br>" +
        '[FONT=times new roman][SIZE=4][I][COLOR=rgb(209, 213, 216)]Ожидайте ответа в данной теме, копии создавать не нужно.[/COLOR][/I][/SIZE][/FONT][/CENTER]<br>' +
         '[CENTER][COLOR=rgb(250, 197, 28)]На рассмотрении[/COLOR].[/FONT][/SIZE][/CENTER]',
      prefix: GA_PREFIX,
      status: true,
    },
    {
      title: 'Ну ладно одобрю',
      content:        
        "[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Ваше наказание будет снято / снижено в ближайшее время.[/FONT][/SIZE]<br>" +
        "[FONT=times new roman][COLOR=#d1d5d8][SIZE=4][I]Пожалуйста, впредь не повторяйте ошибок, которые могут привести к таким последствиям, а также внимательно изучите общие правила серверов - [/I][URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL].[/SIZE][/COLOR][/FONT]<br><br>" +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Обжалование одобрено.[/FONT][/SIZE]<br><br>" +
          '[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR][/FONT][/I][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Лан на 30 дней',
      content:        
        "[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Ваше наказание будет снижено до бана на 30 дней в ближайшее время.[/FONT][/SIZE]<br>" +
        "[FONT=times new roman][COLOR=#d1d5d8][SIZE=4][I]Пожалуйста, впредь не повторяйте ошибок, которые могут привести к таким последствиям, а также внимательно изучите общие правила серверов - [/I][URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL].[/SIZE][/COLOR][/FONT]<br><br>" +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Обжалование одобрено.[/FONT][/SIZE]<br><br>" +
          '[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR][/FONT][/I][/COLOR][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Лан на 15 дней',
      content:       
        "[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Ваше наказание будет снижено до бана на 15 дней в ближайшее время.[/FONT][/SIZE]<br>" +
        "[FONT=times new roman][COLOR=#d1d5d8][SIZE=4][I]Пожалуйста, впредь не повторяйте ошибок, которые могут привести к таким последствиям, а также внимательно изучите общие правила серверов - [/I][URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL].[/SIZE][/COLOR][/FONT]<br><br>" +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Обжалование одобрено.[/FONT][/SIZE]<br><br>" +
         '[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR][/FONT][/I][/COLOR][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Лан на 7 дней',
      content:       
        "[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Ваше наказание будет снижено до бана на 7 дней в ближайшее время.[/FONT][/SIZE]<br>" +
        "[FONT=times new roman][COLOR=#d1d5d8][SIZE=4][I]Пожалуйста, впредь не повторяйте ошибок, которые могут привести к таким последствиям, а также внимательно изучите общие правила серверов - [/I][URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL].[/SIZE][/COLOR][/FONT]<br><br>" +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Обжалование одобрено.[/FONT][/SIZE]<br><br>" +
          '[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR][/FONT][/I][/COLOR][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Лан на 120 мута',
      content:       
        "[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Ваше наказание будет снижено до мута в 120 минут в ближайшее время.[/FONT][/SIZE]<br>" +
        "[FONT=times new roman][COLOR=#d1d5d8][SIZE=4][I]Пожалуйста, впредь не повторяйте ошибок, которые могут привести к таким последствиям, а также внимательно изучите общие правила серверов - [/I][URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL].[/SIZE][/COLOR][/FONT]<br><br>" +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Обжалование одобрено.[/FONT][/SIZE]<br><br>" +
          '[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR][/FONT][/I][/COLOR][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
	  title: ' Твое наказание мин.гений ',
	  content:              
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Вам было выдано минимальное наказание, обжалованию не подлежит.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		  '[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR][/FONT][/I][/COLOR][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
      title: 'Научись писать обж',
      content:     
        "[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Обжалование составлено не по форме.[/FONT][/SIZE]<br>" +
        "[SIZE=4][FONT=times new roman]Внимательно прочитайте правила составления обжалований, которые закреплены в этом разделе.[/FONT][/SIZE]<br><br>" +
          '[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR][/FONT][/I][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Уже я смотрел на твое обж',
      content:      
        "[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[COLOR=#d1d5d8][SIZE=4][I][FONT=times new roman]Ранее вам уже было одобрено обжалование и ваше наказание было снижено - повторного обжалования не будет.[/FONT]<br>" +
        "[FONT=times new roman]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/FONT][/I][/SIZE][/COLOR]<br><br>" +
          '[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR][/FONT][/I][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'В жалобы на тюбиков',
      content:        
        "[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Если вы не согласны с решением администратора, обратитесь в раздел жалоб на администрацию.[/FONT][/SIZE]<br><br>" +
          '[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR][/FONT][/I][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'На рассмотрение обж ',
      content:        
        "[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Ваше обжалование взято на рассмотрение.[/FONT][/SIZE]<br>" +
        '[SIZE=4][FONT=times new roman]Создавать копии не нужно, ожидайте ответа в данной теме.[/FONT][/SIZE]<br>' +
         '[B][CENTER][COLOR=yellow][ICODE]На рассмотрение[/ICODE][/COLOR][/CENTER][/B]',
      prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: 'Просрочка ЖБ лол',
      content:      
        "[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[COLOR=#d1d5d8][SIZE=4][I]В вашем случае нужно было сразу реагировать на выданное наказание и обращаться в раздел жалоб на администрацию, в настоящий момент срок написания жалобы прошел.[/I][/SIZE][/COLOR]<br>" +
        "[SIZE=4][COLOR=#d1d5d8][I]Если вы все же согласны с решением администратора - составьте новую тему, предварительно прочитав правила подачи обжалований, закреплённые в данном разделе.[/I][/COLOR][/SIZE]<br>" +
        "[COLOR=#d1d5d8][SIZE=4][I]Просьба не создавать копии данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/COLOR][/FONT]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][SIZE=4][I][FONT=times new roman]Закрыто.[/FONT][/I][/SIZE][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'NonRP обман бан',
      content:       
        "[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[COLOR=rgb(209, 213, 216)]Обжалование в вашу пользу должен писать игрок, которого вы обманули.[/COLOR]<br>" +
        "[COLOR=rgb(209, 213, 216)]В доказательствах должны иметься: окно блокировки вашего аккаунта, переписка с обманутым игроком, где вы решили на какую компенсацию он согласен и ваше сообщение, в котором вы признаете совершенную ошибку и впредь обязуетесь не повторять ее.[/COLOR]<br>" +
        "[COLOR=rgb(209, 213, 216)]После всего этого главная администрация рассмотрит обжалование, но это не гарантирует того, что вас обжалуют.[/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][SIZE=4][I][FONT=times new roman]Закрыто.[/FONT][/I][/SIZE][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Использование ПО',
      content:
        "[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Ваш игровой акаунт был заблокирован навсегда за использование стороннего ПО.[/FONT][/SIZE]<br>" +
        "[SIZE=4][FONT=times new roman]В обжаловании отказано.[/FONT][/SIZE][/I][/COLOR]<br><br>" +
        "[FONT=times new roman][COLOR=#d1d5d8][SIZE=4][I]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/COLOR][/FONT]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][SIZE=4][I][FONT=times new roman]Закрыто.[/FONT][/I][/SIZE][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Окно твоего несчаться',
      content:
        "[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Прикрепите в доказательства скриншот окна блокировки, которое появляется сразу после входа в игру.<br>' +
        'Приятной игры на BLACK RUSSIA на сервере CHILLI.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[COLOR=rgb(255, 0, 0)][SIZE=4][I][FONT=times new roman]Закрыто.[/FONT][/I][/SIZE][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    }
];
 
 
$(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
 
    // Добавление кнопок при загрузке страницы
    addButton('Закрыто и за пивом', 'close');
    addButton('Посмотрим', 'pin');
    addButton('Богдан Ростик', 'Bogdan Rostik');
    addButton('Манькрафтеру', 'Манькрафтеру');
    addButton('Нашим создателям', 'teamProject');
    addButton('Решенить и дрочить', 'Resheno');
    addButton('ББ админу', 'accepted');
    addButton('Отказать нахуй', 'unaccept');
    addButton('Что бы спиздануть', 'selectAnswer');
    
 
 
    // Поиск информации о теме
    const threadData = getThreadData();
 
 
    $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
    $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#close').click(() => editThreadData(CLOSE_PREFIX, false));
    $(`button#mainAdmin`).click(() => editThreadData(GA_PREFIX, true));
 
 
    $(`button#selectAnswer`).click(() => {
        XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
        buttons.forEach((btn, id) => {
            if(id > 0) {
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
    12 < hours && hours <= 18
      ? 'Доброго времени суток'
      : 18 < hours && hours <= 21
      ? 'Доброго времени суток'
      : 21 < hours && hours <= 4
      ? 'Доброго времени суток'
      : 'Доброго времени суток',
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