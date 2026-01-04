// ==UserScript==
// @name         ! КФ SPB Botir_Soliev !
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
// @downloadURL https://update.greasyfork.org/scripts/501942/%21%20%D0%9A%D0%A4%20SPB%20Botir_Soliev%20%21.user.js
// @updateURL https://update.greasyfork.org/scripts/501942/%21%20%D0%9A%D0%A4%20SPB%20Botir_Soliev%20%21.meta.js
// ==/UserScript==

(function () {
  'use strict';
const VA_PREFIX = 1;          // Важно
const UNACCEPT_PREFIX = 4;    // Отказано
const ACCEPT_PREFIX = 8;      // Одобрено
const RESHENO_PREFIX = 6;     // Решено
const PIN_PREFIX = 2;         // На рассмотрение
const RAS_PREFIX = 2;         // На расс
const GA_PREFIX = 12;         // Главному Администратору
const COMMAND_PREFIX = 10;    // Команде проекта
const WATCHED_PREFIX = 9;     // Реализовано
const CLOSE_PREFIX = 7;       // Закрыто
const SPECIAL_PREFIX = 11;    // Спец.Администратору
const TECH_PREFIX = 13;       //Тех.Специалисту
const labelsilver = 14;       //Ожидание
const delet = 0;             //Удаление
const buttons = [
        {
        	},
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

	addButton('Расс', 'RAS_PREFIX', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 255, 2.5);');
    addButton('Важно', 'VA_PREFIX', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 255, 2.5);');
	addButton('На рассмотрение', 'pin', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(238, 238, 0, 2.5);');
    addButton('Одобрено', 'accepted', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 250, 154, 2.5);');
    addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 2.5);');
    addButton('Меню', 'selectAnswer' , 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 0, 255, 2.5);');

	// Поиск информации о теме
	const threadData = getThreadData();

    $(`button#RAS_PREFIX`).click(() => editThreadData(RAS_PREFIX, false));
    $(`button#VA_PREFIX`).click(() => editThreadData(VA_PREFIX, false));
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