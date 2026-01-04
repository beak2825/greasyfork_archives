// ==UserScript==
// @name         ! КФ SPB Botir !
// @namespace    https://forum.blackrussia.online
// @version      1.2.8
// @description  Для Куратора Форума, жалоб на игроков
// @author       Botir_Soliev    https://vk.com/botsol
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license 	 MIT
// @collaborator Botir_Soliev
// @icon https://sun9-42.userapi.com/impg/BJPz3U2wxU_zxhC5PnLg7de2KhrdnAiv7I96kg/RzbuT5qDnus.jpg?size=1000x1000&quality=95&sign=ed102d00b84c285332482312769e9bad&type=album
// @downloadURL https://update.greasyfork.org/scripts/521317/%21%20%D0%9A%D0%A4%20SPB%20Botir%20%21.user.js
// @updateURL https://update.greasyfork.org/scripts/521317/%21%20%D0%9A%D0%A4%20SPB%20Botir%20%21.meta.js
// ==/UserScript==

(function () {
  'use strict';
const UNACCEPT_PREFIX = 4;    // Отказано
const ACCEPT_PREFIX = 8;      // Одобрено
const RESHENO_PREFIX = 6;     // Решено
const PIN_PREFIX = 2;         // На рассмотрение
const GA_PREFIX = 12;         // Главному Администратору
const COMMAND_PREFIX = 10;    // Команде проекта
const WATCHED_PREFIX = 9;     // Рассмотрено
const CLOSE_PREFIX = 7;       // Закрыто
const SPECIAL_PREFIX = 11;    // Спец.Администратору
const TECH_PREFIX = 13;       //Тех.Специалисту
const labelsilver = 14;       //Ожидание
const delet = 0;             //Удаление
const buttons = [

    {
	  title: '| Приветствие |',
      dpstyle: 'oswald: 3px;     color: #fff; background: #50c878; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] [/CENTER][/COLOR][/B]",
	},
    {
	  title: '| ПЕРЕДАНО КУРАТОРУ |',
      dpstyle: 'oswald: 3px;     color: #fff; background: #800080; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Жалоба передана Куратору Администрации, пожалуйста ожидайте ответа.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#EEEE00][ICODE]Передано Руководству[/ICODE][/COLOR][/FONT][/CENTER][/B]',
     prefix: labelsilver,
	 status: false,
         },
                {
	  title: '| ГЛАВНОМУ.КУРАТОРУ.ФОРУМА |',
          dpstyle: 'oswald: 3px;     color: #fff; background: #D2691E; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Жалоба передана Главному Куратору Форума, пожалуйста ожидайте ответа.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#EEEE00][ICODE]Передано Главному Куратору Форума[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
                {
	  title: '| ТЕХ.СПЕЦУ |',
             dpstyle: 'oswald: 3px;     color: #fff; background: #0000FF; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Передаю вашу жалобу Техническому Специалисту.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#EEEE00][ICODE]На рассмотрении...[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: TECH_PREFIX,
	  status: true,
        },
                    {
	  title: '| ПЕРЕДАНО.ЗГКФ |',
                     dpstyle: 'oswald: 3px;     color: #fff; background: #52AB26; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Жалоба передана Заместителю Главного Куратора Форума, пожалуйста ожидайте ответа.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#EEEE00][ICODE]Передано Заместителю Главного Куратора Форума.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
        {
	  title: '| ПЕРЕДАНО.ГА |',
                     dpstyle: 'oswald: 3px;     color: #fff; background: #FF0000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была передана Главному Администратору, ожидайте ответа.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#EEEE00][ICODE]Передано Главному Администратору[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: GA_PREFIX,
	  status: true,
	},
        {
	  title: '| ДУБЛИКАТ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Вам уже был дан ответ в прошлой жалобе, пожалуйста перестаньте делать дубликаты, иначе ваш Форумный аккаунт будет заблокирован.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    	{
	  title: '| РАССМОТРЕНИИ.СВОЙ.ТЕКСТ |',
      dpstyle: 'oswald: 3px;     color: #fff; background: #4169E1; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
      content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] СВОЙ ТЕКСТ СЮДА <br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#EEEE00][ICODE]На рассмотрении...[/ICODE][/COLOR][/FONT][/CENTER][/B]',
     prefix: PIN_PREFIX,
	 status: true,
	},
	    	{
	  title: '| ОТКАЗАНО.СВОЙ.ТЕКСТ |',
      dpstyle: 'oswald: 3px;     color: #fff; background: #4169E1; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
      content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] СВОЙ ТЕКСТ СЮДА <br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	 prefix: UNACCEPT_PREFIX,
	 status: false,
	},
	{
	  title: '| ЗАКРЫТО.СВОЙ.ТЕКСТ |',
      dpstyle: 'oswald: 3px;     color: #fff; background: #4169E1; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
      content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] СВОЙ ТЕКСТ СЮДА <br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	 prefix: CLOSE_PREFIX,
     status: false,
	},
    {
	  title: '--------------------------------------------------------------------ПЕРЕНОС ЖАЛОБ----------------------------------------------------------------------',
	   dpstyle: 'oswald: 3px;     color: #FFFFFF; background: #FF4500; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #0000FF',
	},
	        	{
	  title: '| На рассмотрение |',
         dpstyle: 'oswald: 3px;     color: #fff; background: #DAA520; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба взята на рассмотрение, пожалуйста не создавайте дубликатов. Ожидайте ответа.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#EEEE00][ICODE]На рассмотрении...[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
    	{
	  title: '| ОБЖАЛОВАНИЕ |',
      dpstyle: 'oswald: 3px;     color: #fff; background: #4169E1; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
      content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Вы ошиблись разделом, обратитесь в раздел обжалований наказаний - [/I][URL='https://forum.blackrussia.online/forums/Обжалование-наказаний.1125/']*Нажмите сюда*[/URL]<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	        prefix: CLOSE_PREFIX,
	        status: false,
           },
    	{
	  title: '| ЖБ.НА.АДМИНОВ |',
      dpstyle: 'oswald: 3px;     color: #fff; background: #4169E1; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
      content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Вы ошиблись разделом, обратитесь в раздел жалоб на администрацию - [/I][URL='https://forum.blackrussia.online/forums/Жалобы-на-администрацию.1122/']*Нажмите сюда*[/URL]<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	        prefix: CLOSE_PREFIX,
	        status: false,
           },
    	{
	  title: '| ЖБ.НА.ЛИДЕРОВ |',
      dpstyle: 'oswald: 3px;     color: #fff; background: #4169E1; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
      content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Вы ошиблись разделом, обратитесь в раздел жалоб на лидеров - [/I][URL='https://forum.blackrussia.online/forums/Жалобы-на-лидеров.1123/']*Нажмите сюда*[/URL]<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	        prefix: CLOSE_PREFIX,
	        status: false,
           },
    	{
	  title: '| ЖБ.НА.ТЕХА |',
      dpstyle: 'oswald: 3px;     color: #fff; background: #4169E1; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
      content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Вы ошиблись разделом, обратитесь в раздел жалоб на технических специалистов - [/I][URL='https://forum.blackrussia.online/forums/Сервер-№24-spb.1205/']*Нажмите сюда*[/URL]<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	        prefix: CLOSE_PREFIX,
	        status: false,
           },
    	{
	  title: '| ЖБ.НА.ХЕЛПЕРОВ |',
      dpstyle: 'oswald: 3px;     color: #fff; background: #4169E1; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
      content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Вы ошиблись разделом, обратитесь в раздел жалоб на хелперов - [/I][URL='https://forum.blackrussia.online/threads/spb-Жалобы-на-Агентов-Поддержки.9148232/unread']*Нажмите сюда*[/URL]<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	        prefix: CLOSE_PREFIX,
	        status: false,
           },
    	{
	  title: '| ЖБ.НА.СОТРУДНИКОВ |',
      dpstyle: 'oswald: 3px;     color: #fff; background: #4169E1; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
      content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Вы ошиблись разделом, обратитесь в раздел жалоб на сотрудников в разделе вашей организации.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	        prefix: CLOSE_PREFIX,
	        status: false,
           },
    {
	  title: '-----------------------------------------------------------------------ЖАЛОБЫ-----------------------------------------------------------------------',
	   dpstyle: 'oswald: 3px;     color: #FFFFFF; background: #FF4500; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #0000FF',
	},
        	{
	  title: '| НЕ ЛОГИРУЕТЬСЯ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] По данным доказательствам нельзя выдать наказание игроку. Все нарушения должны быть подтверждены через определенные ресурсы, а не только по предоставленным доказательствам.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| ЖБ.НА.ДВОИХ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Нельзя писать одну жалобу на двух и белее игроков (на каждого игрока отдельная жалоба).<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| НЕТ.УСЛОВИЯ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]На доказательствах отсутствуют условия сделки - следовательно, рассмотрению не подлежит.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| ОТКАЗ.ДОЛГ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба не подлежит рассмотрению. жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами. Также игровой долг может быть осуществлен ТОЛЬКО через банковский счет.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    	{
	  title: '| ВИРТ.НА.ДОНАТ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Обмен автокейса, покупка доп слота на машину в семью и тд на виртуальную валюту запрещен, соответственно никакого нарушения со стороны игрока нет.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    	{
	  title: '| НЕТ НАРУШЕНИЙ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Исходя из выше приложенных доказательств, нарушения со стороны игрока - не имеется!<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
            {
	  title: '| НЕ ПО ФОРМЕ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба составлена не по форме, пожалуйста ознакомьтесь с правилами подачи жалоб.<br><br>"+
		"[CENTER][B][COLOR=RED]| [URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-игроков.1884531/'][Color=lavender]Правила подачи жалоб[/URL] [COLOR=RED]|<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| НЕТ ДОК-ВО |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Вы не предоставили какие либо доказательства, прикрепите доказательства загруженные на фото/видео хостинг.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| НЕТ НАРУШЕНИЙ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Со стороны игрока не найдены какие либо нарушения, пожалуйста ознакомьтесь с правилами проекта..<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Недостаточно док-во |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Предоставленных доказательств недостаточно для принятие решения, если у вас имеются дополнительные доказательства прикрепите.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
        title: '| ДОКИ в СОЦ.СЕТИ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Доказательства из социальных сетей не принимаются, вам нужно загрузить доказательств на видео/фото хостинги.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
        title: '| Нет тайм-кодов |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Если видеодоказательство длится более 3 минут, Вы должны указать тайм-коды нарушений.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| НЕТУ /time |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]В предоставленных доказательств отсутствует время (/time), не подлежит рассмотрению.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| НУЖЕН ФРАПС |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]В данной ситуации обязательно должен быть фрапс (видео фиксация) всех моментов, в противном случае жалоба будет отказана.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| НЕПОЛНЫЙ ФРАПС/УСЛОВИЯ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Видео запись не полная либо же нет условии сделки, к сожелению мы вынуждены отказать..<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| НЕ РАБОТАЮТ ДОК-ВО |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваши доказательства не рабочие или же битая ссылка, пожалуйста загрузите на видео/фото хостинге.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| ДОКА-ВО ОТРЕДАК.КАЧЕСТВО ПЛОХОЕ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Представленные доказательства были отредактированные или в плохом качестве, пожалуйста прикрепите оригинал.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
        title: '| ОШИБЛИСЬ РАЗДЕЛОМ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Вы ошиблись разделом/сервером, переподайте жалобу в нужный раздел.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| ПРОШЛО 72 ЧАСА |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]С момента совершения нарушения прошло 72 часа, не подлежит рассмотрению.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
        title: '| НЕТ ДОК-В |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]В вашей жалобе отсутствуют доказательства для её рассмотрения. Пожалуйста прикрепите доказательства в хорошем качестве на разрешенных платформах. (Yapix/Imgur/Youtube/Disk)<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: '| От 3 лица |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Жалоба составлена от 3-го лица, следовательно не подлежит рассмотрению.<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
        title: '| НЕДОСТАТОЧНО ДОК-ВА |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Недостаточно доказательств на нарушение от данного игрока.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
        {
	  title: '| НЕПОЛНЫЙ ФРАПС |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваши доказательства обрываются.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: '| Не рабочие док-ва |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Предоставленные доказательства не рабочие, пожалуйста загрузите доказательства на фото/видео хостинге.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: '| СЛИВ.СЕМЬИ.ОТКАЗ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Предоставленных доказательств недостаточно для принятие решения, если у вас имеются дополнительные доказательства прикрепите.<br>"+
	"[B][CENTER][COLOR=lavender] Примечание: в описании семьи должны быть указаны условия взаимодействия со складом. Если лидер семьи предоставил неограниченный доступ к складу и забыл снять его, администрация не несет ответственности за возможные последствия. Жалобы по данному пункту правил принимаются только от лидера семьи.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
         title: '----------------------------------------------------------------------------ЧАТ----------------------------------------------------------------------------',
	   dpstyle: 'oswald: 3px;     color: #FFFFFF; background: #FF4500; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #0000FF',
	},
    {
	  title: '| ЖБ.ОДОБРЕНА |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена.<br>"+
        "[color=red][color=lavender] Игроку будет выдано наказание в течение [color=#00FA9A] одного часа.<br>"+
		"[CENTER][COLOR=lavender] <br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
        {
	  title: '| ЯЗЫК |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]3.01 | [color=lavender] Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке [color=red]  | Устное замечание / Mute 30 минут<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| КАПС |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]3.02 | [color=lavender] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [color=red]  | Mute 30 минут<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| ОСК.ИГРОКОВ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]3.03 | [color=lavender] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены[color=red]  | Mute 30 минут<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| ОСК/УПОМ РОДНИ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]3.04 | [color=lavender] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC)  [color=red]  | Mute 120 минут / Ban 7-15 дней.<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| ФЛУД |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]3.05 | [color=lavender] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока[color=red]  | Mute 30 минут<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    	{
	  title: '| СЕКС.ХАРАКТЕР |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]3.07 | [color=lavender] Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата[color=red]  | Mute 30 минут<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| СЛИВ.СМИ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]3.08 | [color=lavender] Запрещены любые формы «слива» посредством использования глобальных чатов[color=red]  | Permban<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Угрозы наказаниями |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]3.09 | [color=lavender] Запрещены любые угрозы о наказании игрока со стороны администрации [color=red]  | Mute 30 минут<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| ВЫДАЧА ЗА АДМ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]3.10 | [color=lavender] Запрещена выдача себя за администратора, если таковым не являетесь[color=red]  | Ban 15-30 + ЧС администрации.<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Заблуждение (команды) |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]3.11 | [color=lavender] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами[color=red]  | Ban 15-30 / Permban<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| ПОЛИТИКА |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]3.18 | [color=lavender] Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов[color=red]  | Mute 120 минут / Ban 10 дней. <br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| ТРАНСЛИТ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]3.20 | [color=lavender] Запрещено использование транслита в любом из чатов[color=red]  | Mute 30 минут<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| ПРОМОКОДЫ |',
	  content:

		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]3.21 | [color=lavender] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах [color=red]  | Ban 30 дней.<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
            	{
	  title: '| ОСК.VOICE |',
	  content:

		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]3.15 | [color=lavender] Запрещено оскорблять игроков или родных в Voice Chat [color=red]  | Mute 120 минут / Ban 7 - 15 дней.<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
            	{
	  title: '| ШУМ.VOICE |',
	  content:

		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]3.16 | [color=lavender] Запрещено создавать посторонние шумы или звуки [color=red]  | Mute 30 минут.<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
        	{
	  title: '| МУЗ.VOICE |',
	  content:

		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]3.14 | [color=lavender] Запрещено включать музыку в Voice Chat [color=red]  | Mute 60 минут.<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
            	{
	  title: '| РЕКЛАМА.VOICE |',
	  content:

		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]3.17 | [color=lavender] Запрещена реклама в Voice Chat не связанная с игровым процессом [color=red]  | Ban 7 - 15 дней.<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
                	{
	  title: '| СОФТ.VOICE |',
	  content:

		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]3.19 | [color=lavender] Запрещено использование любого софта для изменения голоса [color=red]  | Mute 60 минут.<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    	{
	  title: '| ЗЛОУП.ЗНАКИ |',
	  content:

		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]3.06 | [color=lavender] Запрещено злоупотребление знаков препинания и прочих символов [color=red]  | Mute 30 минут.<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| ТОРГ В ГОСС |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]3.22 | [color=lavender] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [color=red]  | Mute 30 минут<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    	{
	  title: '| ОФФТОП.РЕП |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]3.12 | [color=lavender] Запрещено подавать репорт написанный транслитом, с сообщением не по теме (Offtop), с включенным Caps Lock и повторять обращение (если ответ был уже дан ранее) [color=red]  | Report Mute 30 минут.<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    	{
	  title: '| МАТ.РЕПОРТ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]3.13 | [color=lavender] Запрещено подавать репорт с использованием нецензурной брани [color=red]  | Report Mute 30 минут.<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    	{
	  title: '| МАТ.VIP |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]3.23 | [color=lavender] Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате [color=red]  | Mute 30 минут.<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| БАГОЮЗ.АНИМ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]2.55 | [color=lavender] Запрещается багоюз связанный с анимацией в любых проявлениях. [color=red]  | Jail 60-120 минут<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| ООС угрозы |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]2.37 | [color=lavender] Запрещены OOC угрозы, в том числе и завуалированные [color=red] | Mute 120 минут / Ban 7 дней <br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Перенос конфликта |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]2.36 | [color=lavender] Запрещено переносить конфликты из IC в OOC, и наоборот [color=red]  | Warn / Ban 15-30 дней <br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Реклама |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]2.31 | [color=lavender] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное  [color=red] | Ban 7 дней / PermBan <br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	    	{
	  title: '| НЕНАВИСТЬ.НАЦИИ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]2.35 | [color=lavender] На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате [color=red] | Mute 120 минут / Ban 7 дней <br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    	    	{
	  title: '| ОСК.АДМИНА |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]2.54 | [color=lavender] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [color=red]  | Mute 180 минут <br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    	{
	  title: '| ПРОВОКАЦИЯ.ГОСС |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]* | [color=lavender] Запрещено провоцировать сотрудников государственных организаций [color=red] | Jail 30 минут <br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
        	{
	  title: '| ПРОВОКАЦИЯ.ОПГ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]* | [color=lavender] Запрещено провоцировать сотрудников криминальных организаций возле или на территории вражеской группировки [color=red] | Jail 30 минут <br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
        {
	  title: '| ОСК.ПРОЕКТА |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]2.40 | [color=lavender] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [color=red] | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором) <br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    	{
         title: '---------------------------------------------------------------------РП процесс---------------------------------------------------------------------',
	   dpstyle: 'oswald: 3px;     color: #FFFFFF; background: #FF4500; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #0000FF',
	},
    {
	  title: '| NRP ПОВЕДЕНИЕ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]2.01 | [color=lavender] Запрещено поведение, нарушающее нормы процессов Role Play режима игры [color=red] | Jail 30 минут.<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	    {
	  title: '| nRP Drive |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]2.03 | [color=lavender] Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [color=red] | Jail 30 минут.<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| DB |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]2.13 | [color=lavender] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [color=red] | Jail 60 минут.<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| RK |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]2.14 | [color=lavender] Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти [color=red] | Jail 30 минут.<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| TK |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]2.15 | [color=lavender] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины.[color=red]  | Jail 60 минут / Warn (за два и более убийства)<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| SK |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]2.16 | [color=lavender] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них.[color=red]  | Jail 60 минут / Warn (за два и более убийства)<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
		{
	  title: '| PG |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]2.17 | [color=lavender] Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь [color=red] | Jail 30 минут <br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| MG |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]2.18  [color=lavender] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе.[color=red]  | Mute 30 минут.<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: '| DM |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]2.19 | [color=lavender] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины.[color=red]  | Jail 60 минут<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Mass DM |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]2.20 | [color=lavender] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более.[color=red]  | Warn / Бан 7-15 дней.<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| ЕПП  |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]2.46 | [color=lavender] Запрещено ездить по полям на любом транспорте [color=red]  | Jail 30 минут<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| ЕПП ФУРА/ИНКО |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]2.47 | [color=lavender] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [color=red]  | Jail 60 минут<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    	  {
	  title: '---------------------------------------------------------------------Role-Play BIO---------------------------------------------------------------------',
	   dpstyle: 'oswald: 3px;     color: #FFFFFF; background: #FF4500; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #0000FF',
	},
            {
	  title: '| ОДОБРЕНО |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Рассмотрев вашу Role-Play биографию я готов вынести вердикт.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	            {
	  title: '| НЕ ПО ФОРМЕ СО ССЫЛКОЙ НА ПРАВИЛА |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша Role-Play биография написана не по форме, пожалуйста ознакомьтесь с правилами написания Role-Play биографий .<br><br>"+
		"[CENTER][B][COLOR=RED]| [URL='https://forum.blackrussia.online/threads/spb-Правила-составления-РП-Биографии.1873455/'][Color=lavender]Правила составления Role-Play Биографии[/URL] [COLOR=RED]|<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
                {
	  title: '| НА ДОРАБОТКУ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] В вашей Role-Play - биографии недостаточно информации. Даю вам 24 часа на ее дополнение/исправление, иначе Role-Play биография будет отказана.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#EEEE00][ICODE]На рассмотрении...[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: PIN_PREFIX,
	  status: false,
	},
        {
	  title: '| ОТКАЗ.НЕ.ДОПОЛНИЛИ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша Role-Play - биография отказана т.к. вы её не дополнили.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
        {
	  title: '| ОТКАЗ.nRP.NICK |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша Role-Play - биография отказана т.к у вас NonRP NickName.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
        {
	  title: '| ОТКАЗ.НЕТ.18.ЛЕТ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша Role-Play - биография отказана т.к. персонажу нет 18 лет.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
        {
	  title: '| ОТКАЗ.ЕСТЬ.ОДОБРЕНАЯ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша Role-Play - биография отказана т.к запрещено создавать более одной Role-Play Биографии на один Nick.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
        {
	  title: '| ГОРОД.НЕСУЩЕСТВУЕТ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша Role-Play - биография отказана т.к. на проекте нет данного города/поселка.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
        {
	  title: '| МАЛО.ИНФЫ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша Role-Play - биография отказана т.к в пункте *Детство* и *Юность и Взрослая* жизнь мало информации.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
        {
	  title: '| МАЛО.ИНФЫ.ЮНОСТЬ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша Role-Play - биография отказана т.к в пункте Юность и Взрослая жизнь мало информации.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
        {
	  title: '| МАЛО.ИНФЫ.ДЕТСТВО |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша Role-Play - биография отказана т.к в пункте Детство мало информации.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
        {
	  title: '| ОТКАЗ.КОПИЯ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша Role-Play биография скопирована.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
        {
	  title: '| ОТКАЗ.ЗАГОЛОВОК |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] У вашей Role-Play биографии не верный заголовок.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
    	'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
            {
	  title: '| ОТКАЗ.ОТ 1-ЛИЦО |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay биография написана от 1-го лица.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
                {
	  title: '| ОТКАЗ.ОШИБКИ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] В вашей Role-Play биографии присутствуют грамматические либо пунктуационные ошибки.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
		  {
    title: '«««««««««««««««««««««««««««««««««««« Передача тем на рассмотрение »»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»',
    dpstyle: 'oswald: 3px;     color: #fff; background: #FF0000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	},
    	{
 title: '------------------------------------------------------------RolePlay ОРГАНИЗАЦИИ-------------------------------------------------------------',
	  dpstyle: 'oswald: 3px;     color: #FFFFFF; background: #FF4500; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #0000FF',
	},
        {
	  title: '| ОДОБРЕНО |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Рассмотрев вашу Role-Play ситуации я готов вынести вердикт.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
        {
	  title: '| НЕ ПО ФОРМЕ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша Role-Play ситуации написана не по форме.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
            {
	  title: '| ОТКАЗ.СКОПИРОВАНА |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша Role-Play ситуации скопирована.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| ОТКАЗ.ОШИБКИ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша Role-Play ситуации присутствуют грамматические либо пунктуационные ошибки.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
        {
	  title: '| НА.ДОПОЛНЕНИЕ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша Role-Play ситуации нарушает правила. У вас есть 24 часа на исправление своей Role-Play ситуации.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
            {
	  title: '| ОТКАЗ.ЗАГОЛОВОК |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша Role-Play ситуации не верный заголовок.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
            {
	  title: '| ОТКАЗ.НЕТ.СМЫСЛА |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша Неофициальная Role Play организация отказана т.к в ней нет имеющего смысла.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
            {
	  title: '| НЕТ.СТАРТ.СОСТАВА.3+.ЧЕЛОВЕК |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша Неофициальная RolePlay организация отказана т.к у вас нет стартового состава от 3ёх+ человек.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
 title: '---------------------------------------------------------------------Игровой АКК---------------------------------------------------------------------',
	   dpstyle: 'oswald: 3px;     color: #FFFFFF; background: #FF4500; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #0000FF',
	},
        {
	  title: '| ПОМЕХА.ИГР.ПРОЦЕССУ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]2.04 | [color=lavender] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. [color=red] | Ban 10 дней / Обнуление аккаунта (при повторном нарушении)<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Обход системы |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]2.21 | [color=lavender] Запрещено пытаться обходить игровую систему или использовать любые баги сервера [color=red] | Ban 15-30 дней / Permban<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Слив склада |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]2.09 | [color=lavender] Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [color=red]  | Ban 15-30 дней / Permban<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Амаральные действия |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]2.08 | [color=lavender] Запрещена любая форма аморальных действий сексуального характера в сторону игроков [color=red]  | Jail 30 минут / Warn<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| NonRP обман |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]2.05 | [color=lavender] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [color=red]  | Permban<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    	{
	  title: '| НЕТ.УСЛОВИЯ.СДЕЛКИ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[color=red] [color=lavender] Отсутствует условия сделки. [color=red] <br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Читы |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]2.22 | [color=lavender] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками[color=red] | Ban 15 - 30 дней / PermBan <br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Замена объявы |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]*  [color=lavender] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком[color=red]  | Ban 7 дней + ЧС организации <br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| NonRP edit |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]*  [color=lavender] Запрещено редактирование объявлений, не соответствующих ПРО[color=red]  | Mute 30 минут<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| NonRP эфир |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]* | [color=lavender] Запрещено проведение эфиров, не соответствующих Role Play правилам и логике[color=red]  | Mute 30 минут<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| NonRP розыск |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]* | [color=lavender] Запрещено выдавать розыск без Role Play причины[color=red]  | Warn / Jail 30 минут <br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| NonRP арест |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]*  | [color=lavender] Запрещено оказывать задержание без Role Play отыгровки[color=red]  | Warn<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| NonRP коп |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]*  | [color=lavender] Запрещено nRP поведение[color=red]  | Warn<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Арест в казино/аукцион |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]2.50 [color=lavender] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий [color=red]  | Ban 7 - 15 дней + увольнение из организации<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| NonRP охранник |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]*  | [color=lavender] Охраннику казино запрещено выгонять игрока без причины[color=red]  | Увольнение с должности | Jail 30 минут<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Выдача за адм |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]3.10 | [color=lavender] Запрещена выдача себя за администратора, если таковым не являетесь[color=red]  | Ban 7 - 15 + ЧС администрации<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Nick_Name оск |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red] 4.09 | [color=lavender] Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные)[color=red]  | Устное замечание + смена игрового никнейма / PermBan<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| УХОД.ОТ.RP |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red] 2.02 | [color=lavender] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [color=red]  | Jail 30 минут / Warn<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    	{
	  title: '| СЛИВ.СМИ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]3.08 | [color=lavender] Запрещены любые формы «слива» посредством использования глобальных чатов [color=red]  | PermBan<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
        {
	  title: '| УХОД.ОТ.НАКАЗАНИЕ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red] 2.34 | [color=lavender] Запрещен уход от наказания [color=red]  | Ban 15 - 30 дней (суммируется к общему наказанию дополнительно)<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
			{
	  title: '| УЯЗВИМОСТЬ.ПРАВИЛ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]2.33 | [color=lavender] Запрещено пользоваться уязвимостью правил [color=red]  | Ban 15 дней <br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
		{
	  title: '| Арест в аукцион |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]2.50 | [color=lavender] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона [color=red]  | Ban 7-15 дней + увольнения из фракции<br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
		{
	  title: '| ДОЛГ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]2.57 | [color=lavender] Запрещается брать в долг игровые ценности и не возвращать их. [color=red] | Ban 30 дней / permban <br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    		{
	  title: '| ФЕЙК.NICK |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]4.10 | [color=lavender] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [color=red] | Устное замечание + смена игрового никнейма / PermBan <br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    	{
 title: '------------------------------------------------------------------------ГОСС/ОПГ------------------------------------------------------------------------',
	   dpstyle: 'oswald: 3px;     color: #FFFFFF; background: #FF4500; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #0000FF',
	},
       	{
	  title: '| nRP.В/Ч |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]2 | [color=lavender] За нарушение правил нападения на Войсковую Часть выдаётся предупреждение [color=red] | Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ) <br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
        		{
	  title: '| ГОСС.РАБОТА |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]1.07 | [color=lavender] Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции [color=red] | Jail 30 минут <br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
        		{
	  title: '| Т/С.в.лич.целях |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]1.08 | [color=lavender] Запрещено использование фракционного транспорта в личных целях [color=red] | Jail 30 минут <br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
            		{
	  title: '| ОДИН.ПАТРУЛЬ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]1.11 | [color=lavender] Всем силовым структурам запрещен одиночный патруль или конвоирование, минимум 2 сотрудника [color=red] | Jail 30 минут <br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
                		{
	  title: '| ГОСС.КАЗИНО.Б/У |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]1.11 | [color=lavender] 1.13. Запрещено находиться в форме внутри казино, участвовать в битве за контейнеры, участвовать в захвате семейного контейнера, находится на Б/У рынке с целью покупки / продажи авто, а также устраиваться на сторонние работы в форме фракции [color=red] | Jail 30 минут <br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
                		{
	  title: '| РОЗЫСК.БЕЗПРИЧИН |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]6.02 | [color=lavender] Запрещено выдавать розыск без Role Play причины [color=red] | Warn <br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
                    		{
	  title: '| nRP.КОП |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]6.03 | [color=lavender] Запрещено nRP поведение [color=red] | Warn <br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
                        		{
	  title: '| ШТРАФ.БЕЗ.ПРИЧИНЫ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]7.02 | [color=lavender] Запрещено выдавать розыск, штраф без Role Play причины [color=red] | Warn <br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
      {
	  title: '| ОТБИРАТЬ.В/У.в.ПОГОНИ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]7.04 | [color=lavender] Запрещено отбирать водительские права во время погони за нарушителем [color=red] | Warn <br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
          {
	  title: '| УРОН.НА.ТТ.ФСИН |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.<br>"+
        "[color=red]9.01 | [color=lavender] Запрещено наносить урон игрокам без Role Play причины на территории ФСИН [color=red] | DM / Jail 60 минут / Warn <br>"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
        {
	  title: '----╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ Раздел Жалоб на лидера (АРС) ----╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
	},
    {
        title: '| Запрос док-в |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Запрошу доказательства у лидера, пожалуйста не создавайте дубликатов. Ожидайте ответа.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#EEEE00][ICODE]На рассмотрении...[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
    {
        title: '| Переслать сообщения в ВК (ЗГС) |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Даю вам 24 часа, на то чтобы переслать сообщения в ВКонтакте. - https://vk.com/id250006978, в противном случае жалоба будет отказана!<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#EEEE00][ICODE]На рассмотрении...[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
	{
	  title: '| Нужен фрапс |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]В данной ситуации обязательно должен быть фрапс (видео фиксация) всех моментов, в противном случае жалоба будет отказана.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: '| Док-во отредактировано |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Представленные доказательства были отредактированные или в плохом качестве.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: '| Прошло более 48 часов |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Прошло более 48-ми часов, жалоба не подлежит рассмотрению.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: '| Нет к теме |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваше сообщение никоим образом не относится к предназначению данного раздела.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: '| Проинструктировать Лидера |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Благодарим за ваше обращение! Лидер будет проинструктирован.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Беседа с лидером |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] С лидером будет проведена беседа, просим прощения за предоставленные неудобства.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Строгая беседа с лидером |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] С лидером будет проведена строгая беседа, просим прощения за предоставленные неудобства.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Лидер будет наказан |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] С лидером будет проведена строгая беседа, также он получит наказание. Просим прощения за предоставленные неудобства.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Нет нарушений |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Исходя из выше приложенных доказательств, нарушения со стороны лидера - не имеется!<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Наказание верное |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Проверив доказательства лидера, было принято решение, что наказание выдано верно.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: '| Наказание по ошибке |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] В следствие беседы с лидером, было выяснено, наказание было выдано по ошибке.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Лидер Снят/ПСЖ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Игрок был снят/ушел с поста лидера.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
          title: '| Лидер Снят|',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Лидер будет снят с поста.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
            title: '| Не является лидером |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Игрок не является лидером данной организации.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: '| Передано ЗГА ГОСС & ОПГ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Жалоба передана Заместителю Главного Администратора по направление ОПГ и ГОСС, пожалуйста ожидайте ответа.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Передано ЗГА ГОСС / ОПГ[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: GA_PREFIX,
	  status: true,
	},
	{
	  title: '| Соц. сети |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Доказательства из социальных сетей не принимаются, вам нужно загрузить доказательств на видео/фото хостинги.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
         title: '----╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Заместитель (ЖАЛОБЫ НА ЛД/ЗАМА)╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴-----',
	},
   {
       title: '| Запрос док-в |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Запрошу доказательства у заместителя, пожалуйста не создавайте дубликатов. Ожидайте ответа.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#EEEE00][ICODE]На рассмотрении...[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: '| Беседа с заместителем |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] С заместителем будет проведена беседа, просим прощения за предоставленные неудобства.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Проинструктировать Заместителя |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Благодарим за ваше обращение! Заместитель будет проинструктирован.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: '| Строгая беседа с заместителем |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] С заместителем будет проведена строгая беседа, просим прощения за предоставленные неудобства.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: '| Заместитель будет наказан |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] С заместителем будет проведена строгая беседа, так же он получит наказание. Просим прощения за предоставленные неудобства.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Нет нарушений |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Исходя из выше приложенных доказательств, нарушения со стороны заместителя - не имеется!<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Наказание верное |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Проверив доказательства заместителя, было принято решение, что наказание выдано верно.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
   {
	  title: '| Наказание по ошибке | Беседа |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] В следствие беседы с заместителем, было выяснено, наказание было выдано по ошибке, с ним будет проведена беседа.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено [/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
             title: '| Не является замом |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Игрок не является заместителем данной организации.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Закрыто[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
        title: '| Заместитель Снят |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Заместитель будет снят с поста.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: '| Заместитель Снят/ПСЖ |',
	  content:
		"[B][CENTER][FONT=georgia][COLOR=#ff0000][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Игрок был снят/ушел с поста заместителя.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Закрыто[/ICODE][/COLOR][/FONT][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
        },
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        {
            title: '---------------------------------------------------------------> Раздел Жалоб <---------------------------------------------------------------',
        },
        {
            title: 'Приветствие',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.[/FONT][/CENTER]<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "[CENTER][FONT=Verdana] текст [/FONT][/CENTER]",
        },
        {
            title: 'На рассмотрение',
            content:
            "[CENTER][FONT=Verdana][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Ваша жалоба взята на рассмотрение.<br>"+
            "Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=orange]На рассмотрении.[/COLOR][/FONT][/CENTER]',
            prefix: PIN_PREFIX,
            status: true,
        },
        {

            title: 'Запрошу док-ву',
            content:
            "[CENTER][FONT=Verdana][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Запрошу доказательства у администратора.<br>"+
            "Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=orange]На рассмотрении.[/COLOR][/FONT][/CENTER]',
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: 'Не по форме',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Ваша жалоба составлена не по форме, ознакомьтесь с правилами подачи жалоб : [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.2639611/']*Кликабельно*[/URL]<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Не является адм',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Данный игрок не является администратором.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=RED]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Нет /time',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "В предоставленных доказательствах отсутствует /time, жалоба не подлежит рассмотрению.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'От 3 лица',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Жалоба составлена от 3-го лица, жалобы подобного формата рассмотрению не подлежат.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Нужен фрапс',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}..<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "В данной ситуации обязательно должен быть фрапс(видеофиксация) всех моментов, в противном случае жалоба будет отказана.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Неполный фрапс',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Фрапс обрезан, вынести вердикт с данной нарезки невозможно.<br>"+
            "Если у вас есть полный фрапс,то создайте новую тему,прикрепив его.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Док-ва отредактированы',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Представленные доказательства выше были отредактирован, подобные жалобы рассмотрению не подлежат.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Плохое качество докв',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Доказательства были предоставлены в плохом качестве, пожалуйста прикрепите более качественные фото/видео.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Прошло более 48 часов',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "С момента выдачи наказания прошло более 48-ми часов, жалоба не подлежит рассмотрению.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Нет доков',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "В вашей жалобе отсутствуют доказательства для рассмотра. <br>"+
            "Прикрепите доказательсва в хорошем качестве на разрешенных платформах.(Yapx/Imgur/YouTube/ImgBB)<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Не рабочие док-ва',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Предоставленные вами доказательства нерабочие, создайте новую тему, прикрепив рабочую ссылку на док-ва.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Окно бана',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Зайдите в игру и сделайте скрин окна с баном после чего, заново напишите жалобу.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто., Закрыто[/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Дублирование',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Ответ вам уже был дан в предыдущей теме. Напоминаю, за дублирование тем ваш форумный аккаунт может быть заблокирован.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Отказано[/COLOR], Закрыто., Закрыто[/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Выдано неверно',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Ваша жалоба была рассмотрена и одобрена, с администратором будет проведена профилактическая беседа.<br>"+
            "Ваше наказание будет снято в течении 24-х часов, если оно еще не снято.<br>"+
            "Приносим извинения за предоставленные неудобства.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=#00FA9A]Одобрено[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
           title: 'Админ не прав',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Ваша жалоба была рассмотрена и одобрена, с администратором будет проведена профилактическая беседа.<br>"+
            "Приносим извинения за предоставленные неудобства.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=#00FA9A]Одобрено[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Нет нарушений',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Исходя из приложенных выше доказательств - нарушения со стороны администратора отсутствуют.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Наказание верное',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Администратор предоставил доказательства.<br>"+
            "Наказание выдано верно.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=RED]Закрыто.[/COLOR][/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Админ Снят/ПСЖ',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Администратор был снят/ушел с поста администратора.<br>"+
            "Спасибо за обращение.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=#00FA9A]Рассмотрено[/COLOR][/FONT][/CENTER]',
            prefix: WATCHED_PREFIX,
            status: false,
        },
        {
            title: 'Передано ГА',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Жалоба передана Главному Администратору, пожалуйста ожидайте ответа.<br>"+
            "Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Передано Главному Администратору[/COLOR][/FONT][/CENTER]',
            prefix: GA_PREFIX,
            status: true,
        },
        {
            title: 'Передано ЗГА ГОСС & ОПГ',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            " Жалоба передана Заместителю Главного Администратора по направлению ОПГ и ГОСС.<br>"+
            "Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Передано ЗГА ГОСС&ОПГ[/COLOR][/FONT][/CENTER]',
            prefix: GA_PREFIX,
            status: true,
        },
        {
            title: 'Спецу',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Ваша жалоба передана Специальному Администратору.<br>"+
            "Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Передано Специальному Администратору.[/COLOR][/FONT][/CENTER]',
            prefix: SPECIAL_PREFIX,
            status: true,
        },
        {
            title: 'Соц. сети',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Доказательства из соц сетей не принимаются, вам нужно загрузить доказательств на видео/фото хостинге.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'В ЖБ на теха',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Вам было выдано наказания Техническим специалистом, вы можете написать жалобу здесь : [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/']*Нажмите сюда*[/URL]<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'В обжалование',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Если вы согласны с выданным наказанием, то напишите в раздел Обжалование.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
          title: 'Ошибся разделом.',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Вы ошиблись сервером или разделом, переподайте жалобу в нужный раздел..<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
           title: 'АЙПИ.',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Вы попали на IP адрес злостного нарушителя, любыми способами смените его.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: '---------------------------------------------------------------> Раздел Обжалование <---------------------------------------------------------------',
        },
        {
            title: 'Не по форме',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Ваше обжалование составлено не по форме.<br>"+
            "Форма подачи:<br>"+
            "1. Ваш Nick_Name:<br>"+
            "2. Nick_Name администратора:<br>"+
            "3. Дата выдачи/получения наказания:<br>"+
            "4. Суть заявки:<br>"+
            "5. Доказательство:<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[CENTER][FONT=Verdana][COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Обжалованию не подлежит',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Данное нарушение не подлежит обжалованию, в обжаловании отказано.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Не готовы снизить',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Администрация сервера не готова снизить вам наказание.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'ОБЖ на рассмотрении',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Ваше обжалование взято на рассмотрение.<br>"+
            "Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=orange]На рассмотрение[/COLOR][/FONT][/CENTER]',
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: 'Уже есть мин. наказание',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Вам было выдано минимальное наказание, обжалованию не подлежит.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=RED]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Обжалование одобрено',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Обжалование одобрено, ваше наказание будет снято/снижено в течение 24-ех часов.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=#00FA9A]Одобрено[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Передано ГА обж',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Обжалование передано Главному Администратору.<br>"+
            "Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=orange]На рассмотрение[/COLOR][/FONT][/CENTER]',
            prefix: GA_PREFIX,
            status: true,
        },
        {
            title: 'Соц. сети ОБЖ',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            " Доказательства из соц сетей не принимаются, вам нужно загрузить доказательств на видео/фото хостинге.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'В жб на админов',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Если вы не согласны с выданным наказанием, то напишите жалобу в раздел Жалобы на Администрацию.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
         {
            title: 'НонРп обманы',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            " Для того чтобы снизить или снять данное наказание вам нужно связаться с игроком для возврата имущества, а после снова создать обжалование.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Отказано[/COLOR], Закрыто.[/FONT][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
         {
            title: 'НонРпОБМАН 24Ч',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            " Даю вам 24 часа на возврат имущества, компенсации обманутой стороне, предоставьте видеофиксацию в данную тему.<br>"+
             "Не пытайтесь обмануть администрацию, ваш аккаунт отслеживается.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=orange]На рассмотрении.[/COLOR][/FONT][/CENTER]',
            prefix: PIN_PREFIX,
            status: false,
        },
        {
            title: 'НОНРПОБМАН ВЕРНУЛ',
            content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.name }}.<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Аккаунт остается разблокированным, не нарушайте больше правила проекта.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=#00FA9A]Рассмотрено[/COLOR][/FONT][/CENTER]',
            prefix: WATCHED_PREFIX,
            status: false,
        },
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила рп процесса ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'нрп поведение',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.01. Запрещено поведение, нарушающее нормы процессов Role Play режима игры [Color=#00FF00]| Jail 30 минут[/color].  [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'уход от рп',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.02. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [Color=#00FF00]| Jail 30 минут / Warn[/color]. [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'нрп драйв',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.03. Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [Color=#00FF00]| Jail 30 минут[/color]. [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'нрп развод',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.05. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [Color=#00FF00]| PermBan[/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'рп в свою сторону/пользу',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.06. Запрещены любые Role Play отыгровки в свою сторону или пользу [Color=#00FF00]| Jail 30 минут[/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'аморал действия',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.08. Запрещена любая форма аморальных действий сексуального характера в сторону игроков [Color=#00FF00]| Jail 30 минут / Warn[/color]. [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'слив склада',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.09. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [Color=#FFFF00]| Ban 15 - 30 дней / PermBan[/color]. [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'затягивание рп',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.12. Запрещено целенаправленное затягивание Role Play процесса [Color=#00FF00] | Jail 30 минут[/color]. [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'ДБ',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.13. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [Color=#00FF00] | Jail 60 минут[/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'РК',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.14. Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти [Color=#00FF00] | Jail 30 минут[/color]. [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'ТК',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.15. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [Color=#00FF00] | Jail 60 минут / Warn (за два и более убийства)[/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'СК',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.16. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [Color=#00FF00] | Jail 60 минут / Warn (за два и более убийства)[/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'ПГ',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.17. Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь [Color=#00FF00] | Jail 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'МГ',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.18. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'ДМ',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=#00FF00] | Jail 60 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'масс ДМ',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [Color=#00FF00] | Warn / Ban 3 - 7 дней [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'богоюз',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.21. Запрещено пытаться обходить игровую систему или использовать любые баги сервера [Color=#00FF00] | Ban 15 - 30 дней / PermBan [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'сторонее по',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00] | Ban 15 - 30 дней / PermBan [/color]  [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'реклама',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.31. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное [Color=#00FF00] | Ban 7 дней / PermBan [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'уход от наказания',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.34. Запрещен уход от наказания [Color=#00FF00] | Ban 15 - 30 дней (суммируется к общему наказанию дополнительно) [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'OОC угрозы',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.37. Запрещены OOC угрозы, в том числе и завуалированные [Color=#00FF00] | Mute 120 минут / Ban 7 дней [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'злоуп наказаниями',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.39. Злоупотребление нарушениями правил сервера [Color=#00FF00] | Ban 7 - 30 дней [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'оск проекта',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.40. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [Color=#00FF00] | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором) [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'продажа промо',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.43. Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций [Color=#00FF00] |  Mute 120 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'ЕПП фура',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.47. Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [Color=#00FF00] |  Jail 60 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'арест в инте',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.50. Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий [Color=#00FF00] |  Ban 7 - 15 дней + увольнение из организации [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'нрп аксесуар',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.52. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. [Color=#00FF00] | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут [/color]  [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'оск адм',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.54. Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [Color=#00FF00] | Mute 180 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'баг с аним',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.55. Запрещается багоюз связанный с анимацией в любых проявлениях. [Color=#00FF00] | Jail 60 / 120 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴казик/ночной клуб╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'принятие за деньги',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.01. Владельцу и менеджерам казино и ночного клуба запрещено принимать работников за денежные средства на должность охранника, крупье или механика [Color=#00FF00] | Ban 3 - 5 дней. [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'налог за должность',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.02. Владельцу и менеджерам казино и ночного клуба запрещено взимать у работников налоги в виде денежных средств за должность в казино [Color=#00FF00] | Ban 3 - 5 дней. [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'ставка больше чем просят',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.04. Крупье запрещено делать ставку выше, чем просят игроки [Color=#00FF00] | Увольнение с должности. [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Чат ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'разговор не на русском',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.01. Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке [Color=#00FF00] | Устное замечание / Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'капс',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.02. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'оск в OOC',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.03. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'оск/упом род',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [Color=#00FF00] | Mute 120 минут / Ban 7 - 15 дней [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'флуд',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.05. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'злоуп символами',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.06. Запрещено злоупотребление знаков препинания и прочих символов [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'оск 18+',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.07. Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'слив',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.08. Запрещены любые формы «слива» посредством использования глобальных чатов [Color=#00FF00] | PermBan [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'угроза наказанием со стороны адм',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.09. Запрещены любые угрозы о наказании игрока со стороны администрации [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'выдача себя за адм',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.10. Запрещена выдача себя за администратора, если таковым не являетесь [Color=#00FF00] | Ban 7 - 15 + ЧС администрации[/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'ввод в заблуждение',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.11. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [Color=#00FF00] | Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'оффтоп в реп',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.12. Запрещено подавать репорт написанный транслитом, с сообщением не по теме (Offtop), с включенным Caps Lock и повторять обращение (если ответ был уже дан ранее) [Color=#00FF00] | Report Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'нецензурная брань в реп',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.13. Запрещено подавать репорт с использованием нецензурной брани [Color=#00FF00] | Report Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'музыка',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.14. Запрещено включать музыку в Voice Chat [Color=#00FF00] | Mute 60 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'оск/упом род в воис',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.15. Запрещено оскорблять игроков или родных в Voice Chat [Color=#00FF00]| | Mute 120 минут / Ban 7 - 15 дней [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'шумы в воис',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.16. Запрещено создавать посторонние шумы или звуки [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'реклама в воис',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.17. Запрещена реклама в Voice Chat не связанная с игровым процессом [Color=#00FF00] | Ban 7 - 15 дней [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'полит/религ пропоганда',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.18. Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов [Color=#00FF00] | Mute 120 минут / Ban 10 дней [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'изменение голоса софтом',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.19. Запрещено использование любого софта для изменения голоса [Color=#00FF00] | Mute 60 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'транслит',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.20. Запрещено использование транслита в любом из чатов [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'реклама промо',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [Color=#00FF00] | Ban 30 дней [/color]  [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'обьява в гос орг',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.22. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'мат в vip',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.23. Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ники ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'нрп ник',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>4.06. Никнейм игрового аккаунта должен быть в формате Имя_Фамилия на английском языке [Color=#00FF00] | Устное замечание + смена игрового никнейма [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'оск ник',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>4.09. Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) [Color=#00FF00] | Устное замечание + смена игрового никнейма / PermBan [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'фейк',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>4.10. Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [Color=#00FF00] | Устное замечание + смена игрового никнейма / PermBan [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴правила гос ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'работа в форме',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>1.07. Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции [Color=#00FF00] | Jail 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'т/с в личн целях',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>1.08. Запрещено использование фракционного транспорта в личных целях [Color=#00FF00] | Jail 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'патруль в одинучку',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>1.11. Всем силовым структурам запрещен одиночный патруль или конвоирование, минимум 2 сотрудника [Color=#00FF00] | Jail 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'прогул рд',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>1.13. Запрещено находиться в форме внутри казино, участвовать в битве за контейнеры, участвовать в захвате семейного контейнера, находится на Б/У рынке с целью покупки / продажи авто, а также устраиваться на сторонние работы в форме фракции [Color=#00FF00] | Jail 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'урон вне теры военки (армия)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.02. Наносить урон игрокам, которые находятся вне территории воинской части, запрещено [Color=#00FF00] | DM / Jail 60 минут / Warn [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'Не по ПРО (СМИ)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>4.01. Запрещено редактирование объявлений, не соответствующих ПРО | [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'Не по ППЭ (СМИ)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>4.02. Запрещено проведение эфиров, не соответствующих Role Play правилам и логике [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'замена текста обьявки (СМИ)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br>4.04. Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [Color=#00FF00] | Ban 7 дней + ЧС организации [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'Урон без рп причины (УМВД/ГИБДД/ФСБ/ФСИН)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br> Запрещено наносить урон игрокам без Role Play причины на территории УМВД/ГИБДД/ФСБ/ФСИН [Color=#00FF00] | DM / Jail 60 минут / Warn [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'розыск без причины (УМВД/ФСБ/ГИБДД)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br> 7.02. Запрещено выдавать розыск, штраф без Role Play причины [Color=#00FF00] | Warn [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'нрп поведение (УМВД/ГИБДД/ФСБ)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br> Запрещено nRP поведение [Color=#00FF00] |  Warn [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'отбор вод прав при погоне (ГИБДД)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br> 7.05. Запрещено отбирать водительские права во время погони за нарушителем [Color=#00FF00] |  Warn [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴правила опг ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'провокация гос',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br> 2. Запрещено провоцировать сотрудников государственных организаций [Color=#00FF00] |  Jail 30 минут [/color][/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'провокация опг на их тере',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br> 3. Запрещено провоцировать сотрудников криминальных организаций возле или на территории вражеской группировки [Color=#00FF00] |  Jail 30 минут [/color][/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'урон без причины на тере',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br> 4. Запрещено без причины наносить урон игрокам на территории ОПГ [Color=#00FF00] |  Jail 60 минут [/color][/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'дуэли',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br> 5. Запрещено устраивать дуэли где-либо, а также на территории ОПГ [Color=#00FF00] |  Jail 30 минут [/color][/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'перестрелки в людных местах',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br> 6. Запрещено устраивать перестрелки с другими ОПГ в людных местах [Color=#00FF00] |  Jail 60 минут [/color][/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'реклама в /f',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br> 7. Запрещена любая реклама (семей, транспортных и строительных компаний и т.д.), предложения о купле, продаже, обмене чего-либо в чате организации [Color=#00FF00] |  Mute 30 минут [/color][/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'cкрыться от копа на базе',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br> 8. Запрещено уходить от погони со стороны правоохранительных органов путем заезда на территорию своей банды для того чтобы скрыться или получить численное преимущество [Color=#00FF00] |  Jail 30 минут [/color][/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'нон рп вч',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br> За нарушение правил нападения на Войсковую Часть выдаётся предупреждение [Color=#00FF00] | Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ) [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'находится на тере бв лишний',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок будет наказан по пункту правил:<br> 1.06. На территории проведения бизвара может находиться только сторона атаки и сторона защиты [Color=#00FF00] | Jail 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'нон рп ограбление/похищение(джаил)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок получит наказание в виде деморгана за нарушение правил ограблений/похищений [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'нон рп ограбление/похищение(варн)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок получит наказание в виде предупреждения за нарушение правил ограблений/похищений [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'нон рп ограбление/похищение(бан)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок получит наказание в виде блокировки аккаунта за нарушение правил ограблений/похищений [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴отказ жб ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'нарушений не найдено',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Нарушений со стороны данного игрока не было найдено. [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'мало докв',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Недостаточно доказательств на нарушение от данного игрока. [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'нет условий сделки',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]В ваших доказательствах отсутствуют условия сделки [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'нужен фрапс',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]В таких случаях нужен фрапс. [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'нужен фрапс + промотка чата',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]В таких случаях нужен фрапс + промотка чата. [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'нужна промотка чата',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]В таких случаях нужна промотка чата. [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: '3-е лицо',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации). [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'не подтвердил условия сделки',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Игрок не подтвердил условия вашей сделки. [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'не доказал что владелец фамы',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Нет доказательств того, что вы являетесь владельцем семьи. [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'не указал тайм-коды',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Тайм-коды не были указаны за 24 часа, соответственно жалоба получает статус - [Color=#DC143C]Отказано.[/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'ответный дм',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]На видео видно как вы первые начали стрельбу, он лишь начал обороняться (тоесть ответный ДМ). <br> Вы будете наказаны по пункту правил:<br>2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=#00FF00] | Jail 60 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'долг ток через банк',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][Color=#E0FFFF][FONT=courier new]Займ может быть осуществлен только через зачисление игровых ценностей на банковский счет. [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#E0FFFF][FONT=courier new]А так же вы будете наказаны по пункту правил: <br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Рассмотрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
 ////////////////////////////////////////////////////////////////////////////////////////////////////////////

     {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Поооооооооооооооооооон ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'На рассмотрении(жб)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваша жалоба взята на рассмотрение. <br> Не нужно создавать копии этой жалобы, ожидайте ответа в этой теме.[/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER]<br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FFFF][ICODE]Ожидайте ответа. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
        prefix: PIN_PREFIX,
      status: true,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴передам ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'для гкф',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваша жалоба была передана на рассмотрение  [COLOR=#1E90FF]Главному Куратору Форума.[/COLOR] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER]<br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FFFF][ICODE]Ожидайте ответа. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: 'для куратора',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваша жалоба была передана на рассмотрение [Color=#9365B8]Куратору Администрации.[/COLOR] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FFFF][ICODE]Ожидайте ответа. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: 'для зга',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваша жалоба была передана на рассмотрение [Color=#FFFF00]Заместителю Главного Администратора.[/COLOR] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FFFF][ICODE]Ожидайте ответа. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: 'для теха',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваша жалоба была передана на рассмотрение [Color=#FF4500]техническому специалисту.[/COLOR] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FFFF][ICODE]Ожидайте ответа. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: TECH_PREFIX,
	  status: 123,
    },
    {
      title: 'для га',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваша жалоба была передана на рассмотрение [Color=#DC143C]Главному Администратору.[/COLOR] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FFFF][ICODE]Ожидайте ответа. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: GA_PREFIX,
	  status: true,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила рп процесса ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'нрп поведение',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>2.01. Запрещено поведение, нарушающее нормы процессов Role Play режима игры [Color=#00FF00]| Jail 30 минут[/color]. <br> [Color=#FF0000][SPOILER=Примечание]ездить на крышах транспортных средств, бегать или ходить по столам в казино, целенаправленная провокация сотрудников правоохранительных органов с целью развлечения, целенаправленная помеха в проведении различных собеседований и так далее.[/SPOILER][/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'уход от рп',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>2.02. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [Color=#00FF00]| Jail 30 минут / Warn[/color]. <br> [Color=#FF0000][SPOILER=Примечание]уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания или ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснуться Вашего персонажа. Уходить в интерьер или зеленую зону во время перестрелки с целью избежать смерти или уйти от Role Play процесса и так далее.[/SPOILER][/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нрп драйв',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>2.03. Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [Color=#00FF00]| Jail 30 минут[/color]. <br> [Color=#FF0000][SPOILER=Примечание]езда на скутере по горам, езда на любом транспортном средстве по встречным полосам, нарушая все правила дорожного движения без какой-либо причины, намеренное создание аварийных ситуаций на дорогах и так далее.[/SPOILER][/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'помеха работягам',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>2.04. Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. [Color=#00FF00]| Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/color]. <br> [Color=#00FF00][SPOILER=Пример]таран дальнобойщиков, инкассаторов под разными предлогами. [/SPOILER][/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нрп развод',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>2.05. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [Color=#00FF00]| PermBan[/color] <br> [Color=#FF0000][SPOILER=Примечание]после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.[/SPOILER][/color] <br> [Color=#FF0000][SPOILER=Примечание]разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).[/SPOILER][/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'рп в свою сторону/пользу',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>2.06. Запрещены любые Role Play отыгровки в свою сторону или пользу [Color=#00FF00]| Jail 30 минут[/color] <br> [Color=#FF0000][SPOILER=Примечание]при остановке Вашего транспортного средства правоохранительными органами у Вас очень резко и неожиданно заболевает сердце, ломаются руки, блокируются двери машины или окна и так далее.[/SPOILER][/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'аморал действия',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>2.08. Запрещена любая форма аморальных действий сексуального характера в сторону игроков [Color=#00FF00]| Jail 30 минут / Warn[/color]. <br> [Color=#FFFF00][SPOILER=Исключение]обоюдное согласие обеих сторон.[/SPOILER][/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'слив склада',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>2.09. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color]. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'затягивание рп',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>2.12. Запрещено целенаправленное затягивание Role Play процесса [Color=#00FF00] | Jail 30 минут[/color]. <br> [Color=#FF0000][SPOILER=Примечание]/me начал доставать документы [1/100], начал доставать документы [2/100] и тому подобное.[/SPOILER][/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ДБ',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>2.13. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [Color=#00FF00] | Jail 60 минут[/color] <br> [Color=#FFFF00][SPOILER=Исключение]разрешается на территории проведения мероприятия по захвату упавшего семейного контейнера.[/SPOILER][/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'РК',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>2.14. Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти [Color=#00FF00] | Jail 30 минут[/color]. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ТК',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>2.15. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [Color=#00FF00] | Jail 60 минут / Warn (за два и более убийства)[/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'СК',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>2.16. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [Color=#00FF00] | Jail 60 минут / Warn (за два и более убийства)[/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ПГ',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>2.17. Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь [Color=#00FF00] | Jail 30 минут [/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'МГ',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>2.18. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [Color=#00FF00] | Mute 30 минут [/color] <br> [Color=#FF0000][SPOILER=Примечание]использование смайлов в виде символов «))», «=D» запрещено в IC чате.[/SPOILER][/color] <br> [Color=#FF0000][SPOILER=Примечание]телефонное общение также является IC чатом.[/SPOILER][/color] <br> [Color=#FFFF00][SPOILER=Исключение]за написанный однократно вопросительный «?» или восклицательный «!» знак в IC чате, наказание не выдается.[/SPOILER][/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ДМ',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=#00FF00] | Jail 60 минут [/color] <br> [Color=#FF0000][SPOILER=Примечание]разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/SPOILER][/color] <br> [Color=#FF0000][SPOILER=Примечание]нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/SPOILER][/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'масс ДМ',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [Color=#00FF00] | Warn / Ban 3 - 7 дней [/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'богоюз',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>2.21. Запрещено пытаться обходить игровую систему или использовать любые баги сервера [Color=#00FF00] | Ban 15 - 30 дней / PermBan [/color] <br> [Color=#FF0000][SPOILER=Примечание]под игровой системой подразумеваются функции и возможности, которые реализованы в игре для взаимодействия между игроками, а также взаимодействия игроков с функциями, у которых есть свое конкретное предназначение.[/SPOILER][/color] <br> [Color=#00FF00][SPOILER=Пример]аптечка предназначена для пополнения уровня здоровья, доступна всем игрокам по фиксированной цене в любом магазине. Но она не предназначена для перепродажи по завышенной цене с целью передачи виртуальной валюты между игроками; <br> Аксессуары предназначены для украшения внешнего вида персонажа, не предназначены для передачи виртуальной валюты между игроками; <br> Банк и личные счета предназначены для передачи денежных средств между игроками; <br> Транспортное средство предназначено для передвижения игроков, не предназначено для передачи денег тем или иным способом, включая обмен с завышенными доплатами.[/SPOILER][/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'сторонее по',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00] | Ban 15 - 30 дней / PermBan [/color] <br> [Color=#FF0000][SPOILER=Примечание]запрещено внесение любых изменений в оригинальные файлы игры.[/SPOILER][/color] <br> [Color=#FFFF00][SPOILER=Исключение]разрешено изменение шрифта, его размера и длины чата (кол-во строк).[/SPOILER][/color] <br> [Color=#FFFF00][SPOILER=Исключение]блокировка за включенный счетчик FPS не выдается.[/SPOILER][/color]  [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'реклама',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>2.31. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное [Color=#00FF00] | Ban 7 дней / PermBan [/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'уход от наказания',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>2.34. Запрещен уход от наказания [Color=#00FF00] | Ban 15 - 30 дней (суммируется к общему наказанию дополнительно) [/color] [Color=#FF0000][SPOILER=Примечание]зная, что в данный момент игроку может быть выдано наказание за какое-либо нарушение, изменение никнейма или передача своего имущества на другие аккаунты и тому подобное.[/SPOILER][/color] [Color=#FF0000][SPOILER=Примечание]выход игрока из игры не является уходом от наказания.[/SPOILER][/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'OОC угрозы',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>2.37. Запрещены OOC угрозы, в том числе и завуалированные [Color=#00FF00] | Mute 120 минут / Ban 7 дней [/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'злоуп наказаниями',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>2.39. Злоупотребление нарушениями правил сервера [Color=#00FF00] | Ban 7 - 30 дней [/color] [Color=#FF0000][SPOILER=Примечание]неоднократное (от шести и более) нарушение правил сервера, которые были совершены за прошедшие 7 дней.[/SPOILER][/color] [Color=#FF0000][SPOILER=Примечание]наказания выданные за нарушения правил текстовых чатов, помеху (kick) в учет не идут.[/SPOILER][/color] <br> [Color=#00FF00][SPOILER=Пример]было получено пять наказаний за DM, шестое будет злоупотреблением. Если было получено одно наказание за упоминание родных, два наказания за DB и два наказания за DM, следующее будет считаться злоупотреблением.[/SPOILER][/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оск проекта',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>2.40. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [Color=#00FF00] | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором) [/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'продажа промо',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>2.43. Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций [Color=#00FF00] |  Mute 120 минут [/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ЕПП фура',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>2.47. Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [Color=#00FF00] |  Jail 60 минут [/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'арест в инте',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>2.50. Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий [Color=#00FF00] |  Ban 7 - 15 дней + увольнение из организации [/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нрп аксесуар',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>2.52. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. [Color=#00FF00] | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут [/color] <br> [Color=#00FF00][SPOILER=Пример]слишком большие аксессуары на голове персонажа, имитация гитарой половых органов и тому подобное.[/SPOILER][/color]  [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оск адм',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>2.54. Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [Color=#00FF00] | Mute 180 минут [/color] <br> [Color=#00FF00][SPOILER=Пример]оформление жалобы в игре с текстом: Быстро починил меня, Админы вы задрали уже когда работать будете меня тут ДБшат я 3 жалобы уже подал!!!!!!!!, МОЗГИ ВКЛЮЧИТЕ Я УВОЛЮ ВАС ЩА и т.д. и т.п., а также при взаимодействии с другими игроками.[/SPOILER][/color] <br> [Color=#00FF00][SPOILER=Пример]оскорбление администрации в любой чат, включая репорт подлежит наказанию в виде блокировки доступа к использованию всех видов чатов - [Color=#FF0000] | Mute 180 минут [/color][/SPOILER][/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'баг с аним',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>2.55. Запрещается багоюз связанный с анимацией в любых проявлениях. [Color=#00FF00] | Jail 60 / 120 минут [/color] <br> [Color=#00FF00][SPOILER=Пример]если игрок, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде [Color=#FF0000] Jail на 120 минут. [/color] Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками.[/SPOILER][/color] <br> [Color=#00FF00][SPOILER=Пример]если игрок использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде [Color=#FF0000] Jail на 60 минут. [/color][/SPOILER][/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴казик/ночной клуб╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'принятие за деньги',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>2.01. Владельцу и менеджерам казино и ночного клуба запрещено принимать работников за денежные средства на должность охранника, крупье или механика [Color=#00FF00] | Ban 3 - 5 дней. [/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'налог за должность',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>2.02. Владельцу и менеджерам казино и ночного клуба запрещено взимать у работников налоги в виде денежных средств за должность в казино [Color=#00FF00] | Ban 3 - 5 дней. [/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ставка больше чем просят',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>2.04. Крупье запрещено делать ставку выше, чем просят игроки [Color=#00FF00] | Увольнение с должности. [/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Чат ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'разговор не на русском',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>3.01. Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке [Color=#00FF00] | Устное замечание / Mute 30 минут [/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'капс',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>3.02. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оск в OOC',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>3.03. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оск/упом род',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [Color=#00FF00] | Mute 120 минут / Ban 7 - 15 дней [/color] <br> [Color=#FF0000][SPOILER=Примечание]термины (MQ), (rnq) расценивается, как упоминание родных.[/SPOILER][/color] <br> [Color=#FFFF00][SPOILER=Исключение]если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/SPOILER][/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'флуд',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>3.05. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'злоуп символами',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>3.06. Запрещено злоупотребление знаков препинания и прочих символов [Color=#00FF00] | Mute 30 минут [/color] <br> [Color=#00FF00][SPOILER=Пример]«???????», «!!!!!!!», «Дааааааааааааааааааааааа» и так далее.[/SPOILER][/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оск 18+',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>3.07. Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата [Color=#00FF00] | Mute 30 минут [/color] <br> [Color=#FF0000][SPOILER=Примечание]«дырка», «шмара», «ведро», «мадагаскарский присосконог», «свиноногий бандикут», «скорострел» и так далее.[/SPOILER][/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'слив',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>3.08. Запрещены любые формы «слива» посредством использования глобальных чатов [Color=#00FF00] | PermBan [/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'угроза наказанием со стороны адм',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>3.09. Запрещены любые угрозы о наказании игрока со стороны администрации [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'выдача себя за адм',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>3.10. Запрещена выдача себя за администратора, если таковым не являетесь [Color=#00FF00] | Ban 7 - 15 + ЧС администрации[/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ввод в заблуждение',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>3.11. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [Color=#00FF00] | Ban 15 - 30 дней / PermBan[/color] <br> [Color=#FF0000][SPOILER=Примечание]/me чтобы поднять кошелек введите /pay 228 5000. Для продажи автомобиля введите /sellmycar id 2828 (счёт в банке) цена.[/SPOILER][/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оффтоп в реп',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>3.12. Запрещено подавать репорт написанный транслитом, с сообщением не по теме (Offtop), с включенным Caps Lock и повторять обращение (если ответ был уже дан ранее) [Color=#00FF00] | Report Mute 30 минут [/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нецензурная брань в реп',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>3.13. Запрещено подавать репорт с использованием нецензурной брани [Color=#00FF00] | Report Mute 30 минут [/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'музыка',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>3.14. Запрещено включать музыку в Voice Chat [Color=#00FF00] | Mute 60 минут [/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оск/упом род в воис',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>3.15. Запрещено оскорблять игроков или родных в Voice Chat [Color=#00FF00]| | Mute 120 минут / Ban 7 - 15 дней [/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'шумы в воис',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>3.16. Запрещено создавать посторонние шумы или звуки [Color=#00FF00] | Mute 30 минут [/color] <br> [Color=#FF0000][SPOILER=Примечание]Посторонние звуки на фоне речи, мешающие взаимодействию игроков посредством голосового чата. Сильное искажение звука, исходящее из микрофона плохого качества. Намеренно портить игру другим игрокам (кричать, перебивать)[/SPOILER][/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'реклама в воис',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>3.17. Запрещена реклама в Voice Chat не связанная с игровым процессом [Color=#00FF00] | Ban 7 - 15 дней [/color] <br> [Color=#00FF00][SPOILER=Пример]реклама Discord серверов, групп, сообществ, ютуб каналов и т.д.[/SPOILER][/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'полит/религ пропоганда',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>3.18. Запрещено политическое и религиозное пропагандирование [Color=#00FF00] | Mute 120 минут / Ban 10 дней [/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'изменение голоса софтом',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>3.19. Запрещено использование любого софта для изменения голоса [Color=#00FF00] | Mute 60 минут [/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'транслит',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>3.20. Запрещено использование транслита в любом из чатов [Color=#00FF00] | Mute 30 минут [/color] <br> [Color=#00FF00][SPOILER=Пример]«Privet», «Kak dela», «Narmalna».[/SPOILER][/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'реклама промо',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [Color=#00FF00] | Ban 30 дней [/color] <br> [Color=#FF0000][SPOILER=Примечание]чаты семейные, строительных компаний, транспортных компаний, фракционные чаты, IC, OOC, VIP и так далее.[/SPOILER][/color] <br> [Color=#FFFF00][SPOILER=Исключение]промокоды, предоставленные разработчиками, а также распространяемые через официальные ресурсы проекта.[/SPOILER][/color] <br> [Color=#00FF00][SPOILER=Пример]если игрок упомянет промокод, распространяемый через официальную публичную страницу ВКонтакте либо через официальный Discord в любом из чатов, наказание ему не выдается.[/SPOILER][/color]  [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'обьява в гос орг',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>3.22. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [Color=#00FF00] | Mute 30 минут [/color] <br> [Color=#00FF00][SPOILER=Пример]в помещении центральной больницы писать в чат: «Продам эксклюзивную шапку дешево»[/SPOILER][/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'мат в vip',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>3.23. Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ники ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'нрп ник',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>4.06. Никнейм игрового аккаунта должен быть в формате Имя_Фамилия на английском языке [Color=#00FF00] | Устное замечание + смена игрового никнейма [/color] <br> [Color=#00FF00][SPOILER=Пример]John_Scatman — это правильный Role Play игровой никнейм, в котором не содержится ошибок.[/SPOILER][/color] <br> [Color=#00FF00][SPOILER=Пример]_scatman_John — это неправильный Role Play игровой никнейм, в котором содержатся определенные ошибки.[/SPOILER][/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оск ник',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>4.09. Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) [Color=#00FF00] | Устное замечание + смена игрового никнейма / PermBan [/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'фейк',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>4.10. Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [Color=#00FF00] | Устное замечание + смена игрового никнейма / PermBan [/color] <br> [Color=#00FF00][SPOILER=Пример]подменять букву i на L и так далее, по аналогии.[/SPOILER][/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴правила форума ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'неадекват',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил пользования форумом:<br>2.02. Запрещено неадекватное поведение в любой возможной форме, от оскорблений простых пользователей, до оскорбления администрации или других членов команды проекта. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'травля пользователя',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил пользования форумом:<br>2.03. Запрещена массовая травля, то есть агрессивное преследование одного из пользователей данного форума. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'провокация, розжик конфликта',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил пользования форумом:<br>2.04. Запрещены латентные, то есть скрытные (завуалированные), саркастические сообщения/действия, созданные в целях оскорбления того или иного лица, либо для его провокации и дальнейшего розжига конфликта. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'реклама',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил пользования форумом:<br>2.05. Запрещена совершенно любая реклама любого направления. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: '18+',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил пользования форумом:<br>2.06. Запрещено размещение любого возрастного контента, которые несут в себе интимный, либо насильственный характер, также фотографии содержащие в себе шок-контент, на примере расчленения и тому подобного. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'флуд, оффтоп',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил пользования форумом:<br>2.07. Запрещено флудить, оффтопить во всех разделах которые имеют строгое назначение. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'религия/политика',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил пользования форумом:<br>2.09. Запрещены споры на тему религии/политики. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'помеха развитию проекта',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил пользования форумом:<br>2.14. Запрещены деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'попрошайничество',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил пользования форумом:<br>2.16. Запрещено вымогательство или попрошайничество во всех возможных проявлениях. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'злоуп капсом/транслитом',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил пользования форумом:<br>2.17. Запрещено злоупотребление Caps Lock`ом или транслитом. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'дубликат тем',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил пользования форумом:<br>2.18. Запрещена публикация дублирующихся тем. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'бесмысленый/оск ник фа',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF7][SIZE=5]Игрок будет наказан по пункту правил пользования форумом:<br>3.02. Запрещено регистрировать аккаунты с бессмысленными никнеймами и содержащие нецензурные выражения. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'похож ник фа на адм',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил пользования форумом:<br>3.03. Запрещено регистрировать аккаунты с никнеймами похожими на никнеймы администрации. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴правила гос ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'работа в форме',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>1.07. Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции [Color=#00FF00] | Jail 30 минут [/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'т/с в личн целях',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>1.08. Запрещено использование фракционного транспорта в личных целях [Color=#00FF00] | Jail 30 минут [/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'патруль в одинучку',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>1.11. Всем силовым структурам запрещен одиночный патруль или конвоирование, минимум 2 сотрудника [Color=#00FF00] | Jail 30 минут [/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'прогул рд',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>1.13. Запрещено находиться в форме внутри казино, участвовать в битве за контейнеры, участвовать в захвате семейного контейнера, находится на Б/У рынке с целью покупки / продажи авто, а также устраиваться на сторонние работы в форме фракции [Color=#00FF00] | Jail 30 минут [/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'урон вне теры военки (армия)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>2.02. Наносить урон игрокам, которые находятся вне территории воинской части, запрещено [Color=#00FF00] | DM / Jail 60 минут / Warn [/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'лицензия без рп (право)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>3.01. Запрещена выдача лицензий без Role Play отыгровок; [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'адвокат без рп (право)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>3.02. Запрещено оказание услуг адвоката без Role Play отыгровок. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Не по ПРО (СМИ)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>4.01. Запрещено редактирование объявлений, не соответствующих ПРО | [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Не по ППЭ (СМИ)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>4.02. Запрещено проведение эфиров, не соответствующих Role Play правилам и логике [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'замена текста обьявки (СМИ)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>4.04. Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [Color=#00FF00] | Ban 7 дней + ЧС организации [/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оружие в форме (цб)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br>5.01. Запрещено использование оружия в рабочей форме.; [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Урон без рп причины (УМВД/ГИБДД/ФСБ/ФСИН)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br> Запрещено наносить урон игрокам без Role Play причины на территории УМВД/ГИБДД/ФСБ/ФСИН [Color=#00FF00] | DM / Jail 60 минут / Warn [/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'розыск без причины (УМВД/ФСБ/ГИБДД)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br> 7.02. Запрещено выдавать розыск, штраф без Role Play причины [Color=#00FF00] | Warn [/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нрп коп (УМВД/ГИБДД/ФСБ)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br> Запрещено nRP поведение [Color=#00FF00] |  Warn [/color] [Color=#FF0000][SPOILER=Примечание]поведение, не соответствующее сотруднику УМВД/ГИБДД/ФСБ.[/SPOILER][/color] <br> [Color=#00FF00][SPOILER=Пример]- открытие огня по игрокам без причины <br> - расстрел машин без причины <br> - нарушение ПДД без причины <br> - сотрудник на служебном транспорте кричит о наборе в свою семью на спавне[/SPOILER][/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER]<br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'отбор вод прав при погоне (ГИБДД)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br> 7.05. Запрещено отбирать водительские права во время погони за нарушителем [Color=#00FF00] |  Warn [/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'остановка и осмотр т/с без рп (ГИБДД)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br> 7.04. Запрещено останавливать и осматривать транспортное средство без Role Play отыгровки; [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'маскировка в лич целях (ФСБ)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br> 8.04. Запрещено использовать маскировку в личных целях; [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'обыск без рп (ФСБ)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br> 8.06. Запрещено проводить обыск игрока без Role Play отыгровки. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴правила опг ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'провокация гос',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br> 2. Запрещено провоцировать сотрудников государственных организаций [Color=#00FF00] |  Jail 30 минут [/color][/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'провокация опг на их тере',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br> 3. Запрещено провоцировать сотрудников криминальных организаций возле или на территории вражеской группировки [Color=#00FF00] |  Jail 30 минут [/color][/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'урон без причины на тере',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br> 4. Запрещено без причины наносить урон игрокам на территории ОПГ [Color=#00FF00] |  Jail 60 минут [/color][/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'дуэли',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br> 5. Запрещено устраивать дуэли где-либо, а также на территории ОПГ [Color=#00FF00] |  Jail 30 минут [/color][/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'перестрелки в людных местах',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br> 6. Запрещено устраивать перестрелки с другими ОПГ в людных местах [Color=#00FF00] |  Jail 60 минут [/color][/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'реклама в /f',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br> 7. Запрещена любая реклама (семей, транспортных и строительных компаний и т.д.), предложения о купле, продаже, обмене чего-либо в чате организации [Color=#00FF00] |  Mute 30 минут [/color][/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'cкрыться от копа на базе',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br> 8. Запрещено уходить от погони со стороны правоохранительных органов путем заезда на территорию своей банды для того чтобы скрыться или получить численное преимущество [Color=#00FF00] |  Jail 30 минут [/color][/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нон рп вч',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br> За нарушение правил нападения на Войсковую Часть выдаётся предупреждение [Color=#00FF00] | Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ) [/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'находится на тере бв лишний',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок будет наказан по пункту правил:<br> 1.06. На территории проведения бизвара может находиться только сторона атаки и сторона защиты [Color=#00FF00] | Jail 30 минут [/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нон рп ограбление/похищение(джаил)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок получит наказание в виде деморгана за нарушение правил ограблений/похищений [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нон рп ограбление/похищение(варн)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок получит наказание в виде предупреждения за нарушение правил ограблений/похищений [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нон рп ограбление/похищение(бан)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок получит наказание в виде блокировки аккаунта за нарушение правил ограблений/похищений [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FF00][ICODE]Одобрено. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴другой раздел ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'в жб на адм',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на администрацию - [URL='https://forum.blackrussia.online/forums/Жалобы-на-администрацию.2829/']*Тык*[/URL]. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на лд',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на лидеров - [URL='https://forum.blackrussia.online/forums/Жалобы-на-лидеров.2830/']*Тык*[/URL]. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в обжалования',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Вы ошиблись разделом.<br>Обратитесь в раздел обжалований наказаний - [URL='https://forum.blackrussia.online/forums/Обжалование-наказаний.2832/']*Тык*[/URL]. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в тех раздел',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Вы ошиблись разделом.<br>Обратитесь в технический раздел - [URL='https://forum.blackrussia.online/index.php?forums/Технический-раздел.22/']*Тык*[/URL]. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на теха',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на технических специалистов[URL='https://forum.blackrussia.online/index.php?forums/Жалобы-на-технических-специалистов.490/']*Тык*[/URL]. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на сотрудников орги',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на сотрудников данной организации. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на ап',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на Агентов поддержки - [URL='https://forum.blackrussia.online/forums/Раздел-для-хелперов-сервера.2840/']*Тык*[/URL]. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴отказ жб ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'нарушений не найдено',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Нарушений со стороны данного игрока не было найдено. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'мало докв',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Недостаточно доказательств на нарушение от данного игрока. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'дубликат',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Дублироване темы.<br>Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не по форме',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/']с правилами подачи жалоб на игроков[/URL]. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нет тайма',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]На ваших доказательствах отсутствует /time. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'укажите таймкоды',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваше видеодоказательство длится более 3-х минут, поэтому укажите тайм-коды в течении 24-х часов.<br>В противном случае жалоба будет отказана. <br> [COLOR=#FFFF00][SPOILER=Тайм-коды это]Определённый отрезок времени из видеозаписи, в котором произошли ключевые моменты. <br> Пример: <br> 0:37 - Условия сделки. <br> 0:50 - Сам обмен. <br> 1:50 - Конец обмена. <br>2:03 - Сабвуфера нет. <br>2:06 - /time. [/SPOILER][/COLOR] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FFFF00][ICODE]На рассмотрении. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: 123,
    },
    {
      title: 'более 72 часов',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения со стороны игрока сервера. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'соц сеть',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur). [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нет условий сделки',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]В ваших доказательствах отсутствуют условия сделки [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нужен фрапс',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]В таких случаях нужен фрапс. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нужен фрапс + промотка чата',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]В таких случаях нужен фрапс + промотка чата. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нужна промотка чата',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]В таких случаях нужна промотка чата. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'фрапс обрывается',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваш фрапс обрывается, загрузите полный фрапс на ютуб. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не работают доки',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Доказательства не работают. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нет докв',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]В вашей жалобе отсутствуют доказательства. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'доква отредактированы',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваши доказательства отредактированы. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: '3-е лицо',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации). [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не тот сервер',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Вы ошиблись сервером.<br> Обратитесь в раздел жалоб на игроков вашего сервера. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не написал ник',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игровой ник автора жалобы, ник игрока, на которого подается жалоба, должны быть указаны в соответствии с правилами подачи жалоб, даже если эта информация присутствует на доказательствах или в тексте жалобы. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не подтвердил условия сделки',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок не подтвердил условия вашей сделки. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'закрыт доступ к гугл диску',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]К гугл диску закрыт доступ, пожалуйста откройте доступ, либо загрузите доказательства на фотохостинг(YouTube, Япикс, imgur). <br> [SPOILER=Скрин][url=https://postimages.org/][img]https://i.postimg.cc/FRpfsF2k/image.png[/img][/url][/SPOILER] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'закрыт доступ к яндекс диску',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]К яндекс диску закрыт доступ, пожалуйста откройте доступ, либо загрузите доказательства на фотохостинг(YouTube, Япикс, imgur). <br> [SPOILER=Скрин][url=https://postimages.org/][img]https://i.postimg.cc/7YvGNcwR/image.png[/img][/url][/SPOILER] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не доказал что владелец фамы',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Нет доказательств того, что вы являетесь владельцем семьи. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не указал тайм-коды',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Тайм-коды не были указаны за 24 часа, соответственно жалоба получает статус - [Color=#DC143C]Отказано.[/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ответный дм',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]На видео видно как вы первые начали стрельбу, он лишь начал обороняться (тоесть ответный ДМ). <br> Вы будете наказаны по пункту правил:<br>2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=#00FF00] | Jail 60 минут [/color] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'уже на рассмотрении',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Жалоба такого же содержания уже находится на рассмотрении.<br> Ожидайте ответа в прошлой жалобе и не нужно дублировать ее. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'долг ток через банк',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Займ может быть осуществлен только через зачисление игровых ценностей на банковский счет. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'чел выгнал игроков из семьи',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Нет ни единого правила по которому игрок может быть наказан за исключение участников из семьи, даже в больших количествах.<br>Вы сами выдали ему высокую должность, советую внимательнее назначать на данную должность людей. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'замены текста сми нет',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Нарушений со стороны игрока нет, все объявления редактировались по просьбе игроков [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },


 ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
     {
      title: 'свой ответ',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5] . [/COLOR][/FONT][/CENTER]<br><br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
    },
    {
      title: 'хзхз',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴на рассмотрении ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'На рассмотрении(жб)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваша жалоба взята на рассмотрение. <br> Не нужно создавать копии этой жалобы, ожидайте ответа в этой теме.[/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER]<br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FFFF][ICODE]Ожидайте ответа. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
        prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: 'На рассмотрении(обжалование)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваше обжалование взято на рассмотрение. <br> Не нужно создавать копии этого обжалования, ожидайте ответа в этой теме.[/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER]<br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FFFF][ICODE]Ожидайте ответа. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
        prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: 'ссылку на жб',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Прикрепите ссылку на данную жалобу в течении 24 часов.[/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER]<br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FFFF00][ICODE]На рассмотрении. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
        prefix: PIN_PREFIX,
      status: 123,
    },
    {
      title: 'ссылку на вк',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Прикрепите ссылку на вашу страницу в ВК.[/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER]<br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FFFF00][ICODE]На рассмотрении. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
        prefix: PIN_PREFIX,
      status: 123,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴доки╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'запрошу доки',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Запрошу доказательства у администратора. <br> Ожидайте, пожалуйста, ответа от администрации и не нужно создавать копии этой темы. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER]<br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FFFF][ICODE]Ожидайте ответа. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: 'выдано верно',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Проверив доказательства администратора, было принято решение, что наказание было выдано верно. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER]<br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'выдано не верно',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5] В следствие беседы с администратором, было выяснено, что наказание было выдано по ошибке. <br> Ваше наказание будет снято. [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FFFF00][ICODE]Приятной игры и времяпровождения. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴жб на адм ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'не по форме',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-администрацию.3429349/']*Тык*[/URL] [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Нет /time',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]В предоставленных доказательствах отсутствует /time. [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Нет /myreports',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]В предоставленных доказательствах отсутствует /myreports. [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'От 3 лица',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Жалобы написанные от 3-его лица не подлежат рассмотрению. [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Нужен фрапс',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]В данной ситуации обязательно должен быть фрапс (видео фиксация) всех моментов. [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Фрапс обрывается',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваш фрапс обрывается, загрузите полный фрапс на ютуб. [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Дока-во отредактированы',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Представленные доказательства были отредактированны, пожалуйста прикрепите оригинал. [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Прошло более 48 часов',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]С момента выдачи наказания прошло более 48-ми часов, жалоба не подлежит рассмотрению. [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'нет строки выдачи наказания',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]На ваших доказательствах отсутствует строка с выдачей наказания. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'нет окна бана',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]На ваших доказательствах отсутствует окно блокировки аккаунта. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'нет докв',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]В вашей жалобе отсутствуют доказательства. [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'не работают доки',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Предоставленные доказательства не рабочие. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'дубликат',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Дублирование темы.<br>Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'будет проинструктирован',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Благодарим за ваше обращение! Администратор будет проинструктирован. [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FFFF00][ICODE]Приятной игры и времяпровождения. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'проведу беседу',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваша жалоба была одобрена и будет проведена беседа с администратором. [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FFFF00][ICODE]Приятной игры и времяпровождения. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'проведу строгую беседу',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваша жалоба была одобрена и будет проведена строгая беседа с администратором. [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FFFF00][ICODE]Приятной игры и времяпровождения. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Адм будет наказан',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваша жалоба была одобрена и администратор получит наказание. [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FFFF00][ICODE]Приятной игры и времяпровождения. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нет нарушений',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Исходя из выше приложенных доказательств, нарушения со стороны администратора - не имеется! [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'адм снят/псж',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Администратор был снят/ушел с поста администратора. [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
	{
	  title: 'ошиблись сервером',
	  content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Вы ошиблись сервером. <br>Обратитесь в раздел жалоб на администрацию вашего сервера.[/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
    },
	{
	  title: 'нет ссылки на жб',
	  content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Нет ссылки на данную жалобу.[/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
    },
	{
	  title: 'не написал ник',
	  content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игровой ник автора жалобы, ник администратора, на которого подается жалоба, дата выдачи наказания должны быть указаны в соответствии с правилами подачи жалоб, даже если эта информация присутствует на доказательствах или в тексте жалобы.[/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
    },
	{
	  title: 'перезагрузи роутер',
	  content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Перезагрузите роутер.[/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴передам(жб) ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'для зга гос/опг',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваша жалоба была передана на рассмотрение Заместителю Главного Администратора по направлению ГОС и ОПГ. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FFFF][ICODE]Ожидайте ответа. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: 'для зга',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваша жалоба была передана на рассмотрение Заместителю Главного Администратора. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FFFF][ICODE]Ожидайте ответа. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: 'для га',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваша жалоба была передана на рассмотрение Главному Администратору. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FFFF][ICODE]Ожидайте ответа. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: 'для сакаро',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваша жалоба была передана на рассмотрение [Color=#1E90FF]Руководителю Модерации Дискорда.[/COLOR] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FFFF][ICODE]Ожидайте ответа. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: 'для спец адм',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваша жалоба была передана на рассмотрение Специальной Администрации. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FFFF][ICODE]Ожидайте ответа. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: SPECIAL_PREFIX,
	  status: true,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴другой раздел ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'в жб на адм',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Если вы не согласны с выданным наказанием, то обратитесь в раздел Жалоб на Администрацию - [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.2829/']*Тык*[/URL] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на игроков',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Данный игрок не является администратором.<br>Обратитесь в раздел Жалоб на игроков - [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2831/']*Тык*[/URL]. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на лд',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Данный игрок является лидером.<br>Обратитесь в раздел Жалоб на лидеров - [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.2830/']*Тык*[/URL]. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'в обжалования',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Внимательно ознакомившись с вашей жалобой, было решено, что вам нужно обраться в раздел Обжалований наказаний - [URL='https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.2832/']*Тык*[/URL] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'в тех раздел',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Вы ошиблись разделом.<br>Обратитесь в Технический раздел - [URL='https://forum.blackrussia.online/index.php?forums/Технический-раздел.22/']*Тык*[/URL]. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на теха',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Вам было выдано наказания Техническим специалистом, вы можете написать жалобу/обжалование здесь - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/']*Тык*[/URL] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴передам(обжалование) ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'для га',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваше обжалование было передано на рассмотрение Главному Администратору. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FFFF][ICODE]Ожидайте ответа. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: 'для сакаро',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваше обжалование было передано на рассмотрение [Color=#1E90FF]Руководителю Модерации Дискорда.[/COLOR] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FFFF][ICODE]Ожидайте ответа. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: 'для спец адм',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваше обжалование было передано на рассмотрение Специальной Администрации. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FFFF][ICODE]Ожидайте ответа. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: SPECIAL_PREFIX,
	  status: true,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴обжалования ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'не по форме',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваше обжалование составлено не по форме.<br>Убедительная просьба ознакомиться с правилами подачи заявки на обжалование наказания - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/']*Тык*[/URL] [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'не подлежит обжалованию',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Данное нарушения не подлежит обжалованию, администрация не может снизить вам его. [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Не готовы снизить',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Администрация сервера не готова снизить вам наказания, пожалуйста не создавайте дубликаты, создание дубликатов карается блокировкой форумного аккаунта. [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'обж отказ',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]В обжаловании отказано.[/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'нет докв',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]В вашем обжаловании отсутствуют доказательства. [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'уже был обжалован',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваше наказание уже было обжаловано, повторного обжалования не будет. [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'соц сеть',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur). [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
	{
	  title: 'ошиблись сервером',
	  content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Вы ошиблись сервером. <br>Подайте обжалование в разделе вашего сервера.[/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'снижу на 30 дн',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваше наказание будет снижено до 30 дней блокировки аккаунта. [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'снижу на 15 дн',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваше наказание будет снижено до 15 дней блокировки аккаунта. [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'снижу на 7 дн',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваше наказание будет снижено до 7 дней блокировки аккаунта. [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'наказание будет снято',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваше наказание будет полностью снято. [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FFFF00][ICODE]Приятной игры и времяпровождения. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'чсc снят',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Вы вынесены из черного списка сервера. [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FFFF00][ICODE]Приятной игры и времяпровождения. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: '24 часа смена ника',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Вам дается 24 часа что бы сменить NickName, после смены обязательно прикрепите скриншот с /time. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FFFF00][ICODE]На рассмотрении. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: 123,
    },
    {
      title: 'НРП развод',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Разблокировка игрового аккаунта будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено. Игрок которого вы обманули должен написать обжалование, после того как вы всё согласуете. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'НРП развод(24 часа на возврат имущества)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок разблокирован на 24 часа, когда вам вернут имущество обязательно отпишите в эту тему. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FFFF00][ICODE]На рассмотрении. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: 123,
    },
    {
      title: 'НРП развод(пишет с другого акка)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Вы обманули данного игрока и сейчас пишите обжалование с подставной перепиской. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'НРП развод(пострадавший пишет обж)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок которого вы обманули должен сам написать обжалование. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'НРП развод(нет переписки)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Нет скриншота договора о возврате имущества. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
/////////////////////////////////////////////////////////////////////////

];

//  const tasks = [
//      {
//        title: 'В архив',
//        prefix: 0,
//        move: 1639,
//      },
//      {
//        title: 'В одобренные био',
//        prefix: OKAY_PREFIX,
//        move: 1661,
//      },
//      {
//        title: 'Био на доработку',
//        prefix: WAIT_PREFIX,
//        move: 1662,
//      },
//     {
//        title: 'В отказанные био',
//        prefix: FAIL_PREFIX,
//        move: 1663,
//      },
//      {
//        title: 'В одобренные ситуации',
//        prefix: OKAY_PREFIX,
//       status: false,
//        move: 1658,
//      },
//      {
//        title: 'Ситуацию на доработку',
//        prefix: WAIT_PREFIX,
//        status: false,
//        move: 1659,
//     },
//      {
//        title: 'В отказанные ситуации',
//        prefix: FAIL_PREFIX,
//        status: false,
//        move: 1660,
//      },
//      {
//       title: 'В одобренные организации',
//        prefix: OKAY_PREFIX,
//       status: false,
//       move: 1651,
//    },
//      {
//        title: 'Организацию на доработку',
//        prefix: WAIT_PREFIX,
//        status: false,
//        move: 1652,
//      },
//      {
//        title: 'В отказанные организации',
//        prefix: FAIL_PREFIX,
//        status: false,
//        move: 1653,
//      },

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('На рассмотрение', 'pin', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(238, 238, 0, 2.5);');
    addButton('Одобрено', 'accepted', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 250, 154, 2.5);');
    addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 2.5);');
    addButton('Меню', 'selectAnswer' , 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 0, 255, 2.5);');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true));
	$(`button#techspec`).click(() => editThreadData( TECH_PREFIX , true));
	$(`button#watched`).click(() => editThreadData(WATCHED_PREFIX, false));
	$(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
	$(`button#mainAdmin`).click(() => editThreadData(GA_PREFIX, true));
	$(`button#specialAdmin`).click(() => editThreadData(SPECIAL_PREFIX, true));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$(`button#selectAnswer`).click(() => {
    $(`button#labelsilver`).click(() => editThreadData(labelsilver, false));
    $(`button#UNACCEPT_PREFIX`).click(() => editThreadData(UNACCEPT_PREFIX, false));

	XF.alert(buttonsMarkup(buttons), null, 'ОТВЕТЫ');
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

    function addButton(name, id, style) {
         $('.button--icon--reply').before(
	`<button type="button" class="button--primary button rippleButton" id="${id}" style="${style}">${name}</button>`,
	);
	}
	function addAnswers() {
		$('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 5px; margin-top: 10px; border-radius: 13px;">ОТВЕТЫ</button>`,
	);
	}

	function buttonsMarkup(buttons) {
	return `<div class="select_answer">${buttons
	.map(
	(btn, i) =>
	`<button id="answers-${i}" class="button--primary button ` +
	`rippleButton" style="margin:4px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`,
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
	6 < hours && hours <= 12
	  ? 'Доброе утро, уважаемый(ая)'
	  : 12 < hours && hours <= 17
	  ? 'Добрый день, уважаемый(ая)'
	  : 17 < hours && hours <= 6
	  ? 'Добрый вечер, уважаемый(ая)'
	  : 'Добрый вечер, уважаемый(ая)',
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