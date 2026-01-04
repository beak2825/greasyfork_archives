// ==UserScript==
// @name BLACK RUSSIA ® VOLGOGRAD Скрипт для руководства сервера
// @namespace https://forum.blackrussia.online
// @version 1.2
// @description 👿
// @author Yan_Nike
// @match https://forum.blackrussia.online/threads/*
// @include https://forum.blackrussia.online/threads/
// @grant none
// @license MIT
// @copyright 2024,
// @icon https://forum.blackrussia.online/account/avatar
// @downloadURL https://update.greasyfork.org/scripts/489670/BLACK%20RUSSIA%20%C2%AE%20VOLGOGRAD%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/489670/BLACK%20RUSSIA%20%C2%AE%20VOLGOGRAD%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0.meta.js
// ==/UserScript==
 
(function () {
'esversion 6' ;
const FAIL_PREFIX = 4;
const OKAY_PREFIX = 8;
const WAIT_PREFIX = 2;
const TECH_PREFIX = 13;
const WATCH_PREFIX = 9;
const CLOSE_PREFIX = 7;
const GA_PREFIX = 12;
const SA_PREFIX = 11;
const CP_PREFIX = 10;
const buttons = [
   {
    title: '«««««««««««««««««««««««««««««««««««« Передача тем на рассмотрение »»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»',
    dpstyle: 'oswald: 3px;     color: #fff; background: #FF0000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	},
    {
	     title: 'Свой ответ',
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255,69,0, 0.5); font-family: UtromPressKachat',
	     content:
		'[SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HLCxtrbh/IMG-20240312-021513-365.png[/img][/url][/CENTER]<br>' +
		"[B][CENTER][COLOR=lavender] Пожалуйста ожидайте ответа..<br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/TYzYRKN3/IMG-20240312-021509-877.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/JnGsd9dy/350kb-2.gif[/img][/url]<br>' ,
	     prefix:  WAIT_PREFIX,
	     status: true,
	  },
    {
	     title: 'Передано ГА',
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	     content:
		'[SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HLCxtrbh/IMG-20240312-021513-365.png[/img][/url][/CENTER]<br>' +
		"[B][CENTER][COLOR=lavender] Жалоба передана Главному Администратору - @Timofei_Oleinik, пожалуйста ожидайте ответа..<br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/TYzYRKN3/IMG-20240312-021509-877.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/prMJr3Tf/350kb.gif[/img][/url]<br>' ,
	     prefix: GA_PREFIX,
	     status: true,
	  },
     {
	    title: 'Передано ЗГА',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	    content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HLCxtrbh/IMG-20240312-021513-365.png[/img][/url][/CENTER]<br>' +
      '[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender] Жалоба передана Заместителю Главного Администратора, @Satana Tenside. | @Yan_Nike, пожалуйста ожидайте ответа...<br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/TYzYRKN3/IMG-20240312-021509-877.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/MH5gMFqD/350kb-3.gif[/img][/url]<br>' ,
	    prefix: WAIT_PREFIX,
	    status: true,
	  },
     {
	    title: 'Передано Спецу',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 255, 0, 0.5); font-family: UtromPressKachat',
	    content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HLCxtrbh/IMG-20240312-021513-365.png[/img][/url][/CENTER]<br>' +
        '[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender] Жалоба передана Специальному Администратору, пожалуйста ожидайте ответа..<br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/TYzYRKN3/IMG-20240312-021509-877.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/ZKcynF35/standard.gif[/img][/url]<br>' ,
	     prefix: SA_PREFIX,
	     status: true,
      },
{
          title: 'На рассмотрении',
          dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 255, 0, 0.5); font-family: UtromPressKachat',
	      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HLCxtrbh/IMG-20240312-021513-365.png[/img][/url][/CENTER]<br>' +
        '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[B][CENTER][COLOR=lavender]Ваша жалоба взята на рассмотрение, не создавайте дубликатов и ожидайте ответа от администрации.<br><br>"+
        '[CENTER][img width=695px]https://i.postimg.cc/TYzYRKN3/IMG-20240312-021509-877.png[/img]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/44vrPJQB/350kb-5.gif[/img][/url]<br>' ,
	     prefix:  WAIT_PREFIX,
	     status: true,
      },
	  {
        title: 'В ожидании ссылки на жб',
          dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 255, 0, 0.5); font-family: UtromPressKachat',
	    content:
		'[SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HLCxtrbh/IMG-20240312-021513-365.png[/img][/url][/CENTER]<br>' +
		"[B][CENTER][COLOR=lavender]Укажите ссылку на данную жалобу, даю вам на это 24 часа.<br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/TYzYRKN3/IMG-20240312-021509-877.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/44vrPJQB/350kb-5.gif[/img][/url]<br>' ,
	     prefix:  WAIT_PREFIX,
	     status: true,
     },
        {
    title: '««««««««««««««««««««««««««««««««««««««««««««« Жалоба одобрена »»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»',
    dpstyle: 'oswald: 3px;     color: #fff; background: #FF0000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
 	 },
	 {
	    title: '| Беседа с админом |',
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	    content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HLCxtrbh/IMG-20240312-021513-365.png[/img][/url][/CENTER]<br>' +
		'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
		"[B][CENTER][COLOR=lavender] Ваша жалоба была одобрена, к данному администратору будут приняты меры.<br>"+
        "[B][CENTER][COLOR=lavender] Приносим свои извинения за данную ситуацию.<br>"+
	 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/TYzYRKN3/IMG-20240312-021509-877.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/y6c5SWvG/350kb-1.gif[/img][/url]<br>' ,
	    prefix: OKAY_PREFIX,
	    status: false,
       },
	   {
         title: 'Наказание будет снято',
           dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	     content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HLCxtrbh/IMG-20240312-021513-365.png[/img][/url][/CENTER]<br>' +
		"[B][CENTER][COLOR=lavender] Наказание будет снято если оно еще присутствует.<br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/TYzYRKN3/IMG-20240312-021509-877.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/y6c5SWvG/350kb-1.gif[/img][/url]<br>' ,
	     prefix: OKAY_PREFIX ,
	     status: false,
      },
    {
    title: '««««««««««««««««««««««««««««««««««««««««««««««« Отказ жалобы »»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»',
    dpstyle: 'oswald: 3px;     color: #fff; background: #FF0000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
	},
      {
	    title: '| Не помог с тс |',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	    content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HLCxtrbh/IMG-20240312-021513-365.png[/img][/url][/CENTER]<br>' +
		"[B][CENTER][COLOR=lavender] Вы могли воспользоваться общественным транспортом, такси или попутными машинами для того, чтобы добраться до нужного вам пункта назначения.<br>"+
		"[B][CENTER][COLOR=lavender] Нарушения со стороны администратора не имеется.<br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/TYzYRKN3/IMG-20240312-021509-877.png[/img][/url]<br>' +
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HxRgWKW7/350kb.gif[/img][/url]<br>' ,
	     prefix: CLOSE_PREFIX,
	     status: false,
       },
    {
         title: ':Жалоба на теха',
       dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
         content:
	 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HLCxtrbh/IMG-20240312-021513-365.png[/img][/url][/CENTER]<br>' +
		 '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
       "[B][CENTER][COLOR=lavender]Наказание выдано техническим специалистом.<br>Обратитесь в [URL='https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9639-volgograd.1757/']*Жалобы на технических специалистов*[/URL].[/CENTER]<br>" +
	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/TYzYRKN3/IMG-20240312-021509-877.png[/img][/url]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HxRgWKW7/350kb.gif[/img][/url]<br>' ,
      prefix: CLOSE_PREFIX,
	  status: false,
    	    },
    {
        title: 'Не по форме',
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	    content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HLCxtrbh/IMG-20240312-021513-365.png[/img][/url][/CENTER]<br>' +
		 '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
		"[B][CENTER][COLOR=lavender]Ваша жалоба составлена не по форме, пожалуйста ознакомьтесь с правилами подачи жалоб : [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.3429349/']*Ознакомтесь тут*[/URL]<br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/TYzYRKN3/IMG-20240312-021509-877.png[/img][/url]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HxRgWKW7/350kb.gif[/img][/url]<br>' ,
	     prefix: CLOSE_PREFIX,
	     status: false,
     },
    {
         title: 'Не рабочие док-ва',
          dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	     content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HLCxtrbh/IMG-20240312-021513-365.png[/img][/url][/CENTER]<br>' +
		'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
		"[B][CENTER][COLOR=lavender] Предоставленные доказательства не рабочие либо же битая ссылка, пожалуйста загрузите доказательства на фото/видео хостинге.<br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/TYzYRKN3/IMG-20240312-021509-877.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HxRgWKW7/350kb.gif[/img][/url]<br>' ,
         prefix: CLOSE_PREFIX,
	     status: false,
      },
     {
        title: 'От 3 лица',
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	    content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HLCxtrbh/IMG-20240312-021513-365.png[/img][/url][/CENTER]<br>' +
		 '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
		"[B][CENTER][COLOR=lavender]Жалоба составлена от 3-го лица, мы не можем ее рассмотреть.<br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/TYzYRKN3/IMG-20240312-021509-877.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HxRgWKW7/350kb.gif[/img][/url]<br>' ,
	    prefix: CLOSE_PREFIX,
	    status: false,
      },
     {
	    title: 'Нет док-в',
          dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	    content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HLCxtrbh/IMG-20240312-021513-365.png[/img][/url][/CENTER]<br>' +
		'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[B][CENTER][COLOR=lavender]В вашей жалобе отсутствуют доказательства для рассмотра.<br>"+
		"[B][CENTER][COLOR=lavender]Пожалуйста,прикрепите доказательства в хорошем качестве на разрешенных платформах. (Yapix/Imgur/Youtube/Disk)<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/TYzYRKN3/IMG-20240312-021509-877.png[/img][/url]<br>' +
	  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HxRgWKW7/350kb.gif[/img][/url]<br>' ,
	    prefix: CLOSE_PREFIX,
	    status: false,
      },
    {
	    title: 'Соц. сети',
          dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	    content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HLCxtrbh/IMG-20240312-021513-365.png[/img][/url][/CENTER]<br>' +
		 '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
		"[B][CENTER][COLOR=lavender] Доказательства из соц сетей не принимаются, вам нужно загрузить доказательств на видео/фото хостинге.<br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/TYzYRKN3/IMG-20240312-021509-877.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HxRgWKW7/350kb.gif[/img][/url]<br>' ,
         prefix: CLOSE_PREFIX,
	     status: false,
      },
     {
         title: 'Дока-ва отредактированы',
          dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HLCxtrbh/IMG-20240312-021513-365.png[/img][/url][/CENTER]<br>' +
		'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
		"[B][CENTER][COLOR=lavender] Представленные доказательства были отредактированные или в плохом качестве, пожалуйста прикрепите оригинал.<br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/TYzYRKN3/IMG-20240312-021509-877.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HxRgWKW7/350kb.gif[/img][/url]<br>' ,
	     prefix: CLOSE_PREFIX,
	     status: false,
      },
    {
	    title: 'Окно бана',
          dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	    content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HLCxtrbh/IMG-20240312-021513-365.png[/img][/url][/CENTER]<br>' +
		'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
		"[B][CENTER][COLOR=lavender] Зайдите в игру и сделайте скрин окна с баном после чего, заново напишите жалобу.<br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/TYzYRKN3/IMG-20240312-021509-877.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HxRgWKW7/350kb.gif[/img][/url]<br>' ,
	     prefix: CLOSE_PREFIX,
	     status: false,
      },
     {
	    title: 'Дублирование',
          dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	    content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HLCxtrbh/IMG-20240312-021513-365.png[/img][/url][/CENTER]<br>' +
		'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
		"[B][CENTER][COLOR=lavender] Ответ был дан в прошлой жалобе, если будете и дальше дублировать темы, я вынужден буду заблокировать ваш форумный аккаунт<br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/TYzYRKN3/IMG-20240312-021509-877.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HxRgWKW7/350kb.gif[/img][/url]<br>' ,
	     prefix: CLOSE_PREFIX,
	     status: false,
      },
    {
	    title: 'Наказание верное',
          dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	    content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HLCxtrbh/IMG-20240312-021513-365.png[/img][/url][/CENTER]<br>' +
		'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
		"[B][CENTER][COLOR=lavender] Проверив доказательства администратора, было принято решение, что наказание выдано верно.<br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/TYzYRKN3/IMG-20240312-021509-877.png[/img][/url]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HxRgWKW7/350kb.gif[/img][/url]<br>' ,
	    prefix: CLOSE_PREFIX,
	    status: false,
      },
    {
	    title: 'Наказание верное ДМ',
          dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	    content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HLCxtrbh/IMG-20240312-021513-365.png[/img][/url][/CENTER]<br>' +
		'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
		"[B][CENTER][COLOR=lavender] Проверив доказательства администратора, было принято решение, что наказание выдано верно.<br>"+
        "[B][CENTER][COLOR=lavender] Если у вас есть видеодоказательства об ответном ДМе,то напишите повторную жалобу прикрепив доказательства <br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/TYzYRKN3/IMG-20240312-021509-877.png[/img][/url]<br>' +
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HxRgWKW7/350kb.gif[/img][/url]<br>' ,
	     prefix: CLOSE_PREFIX,
	     status: false,
       },
     {
	    title: 'В Тех раздел',
           dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	    content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HLCxtrbh/IMG-20240312-021513-365.png[/img][/url][/CENTER]<br>' +
        '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[B][CENTER][COLOR=lavender] Пожалуйста составьте свою жалобу в Технический раздел сервера : [URL='https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-volgograd.1758/']*Нажмите сюда*[/URL]<br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/TYzYRKN3/IMG-20240312-021509-877.png[/img][/url]<br>' +
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HxRgWKW7/350kb.gif[/img][/url]<br>' ,
	     prefix: CLOSE_PREFIX,
	     status: false,
       },
       {
	     title: 'Нет нарушений',
           dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	     content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HLCxtrbh/IMG-20240312-021513-365.png[/img][/url][/CENTER]<br>' +
        '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[B][CENTER][COLOR=lavender] Исходя из вашых приложенных доказательств, нарушения со стороны администратора - не имееться!<br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/TYzYRKN3/IMG-20240312-021509-877.png[/img][/url]<br>' +
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HxRgWKW7/350kb.gif[/img][/url]<br>' ,
	     prefix: CLOSE_PREFIX,
	     status: false,
      },
      {
        title: 'Прошло более 48 часов',
          dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	    content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HLCxtrbh/IMG-20240312-021513-365.png[/img][/url][/CENTER]<br>' +
        '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[B][CENTER][COLOR=lavender] С момента выдачи наказания прошло более 48-ми часов, жалоба не подлежит рассмотрению. Дублирование жалоб наказуемо.<br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/TYzYRKN3/IMG-20240312-021509-877.png[/img][/url]<br>' +
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HxRgWKW7/350kb.gif[/img][/url]<br>' ,
	     prefix: CLOSE_PREFIX,
	     status: false,
	},
     {
    title: '============================================= Обжалование наказаний =============================================================',
    dpstyle: 'oswald: 3px;     color: #111; background: #0B610B; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #0B610B',
   },
      {
	  title: 'Главному Администратору',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 69, 0 ,0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(50,205,50)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HLCxtrbh/IMG-20240312-021513-365.png[/img][/url]<br>"+
        "[CENTER]Ваше обжалование передано [COLOR=rgb(255, 255, 0)]на рассмотрение[/COLOR] [COLOR=rgb(255, 0, 0)]Главному Администратору @Timofei_Oleinik.[/CENTER][/COLOR]<br>" +
        "[CENTER]Убедительная просьба [COLOR=rgb(46,139,87)]не создавать копий данной темы.[/COLOR][/CENTER]<br>" +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/TYzYRKN3/IMG-20240312-021509-877.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/63xNf6ys/350kb.gif[/img][/url]<br>' ,
	  prefix: GA_PREFIX,
	  status: true,
	},
     {
	  title: 'Руководителю ДС',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
        "[CENTER]Ваше обжалование передано [COLOR=rgb(255, 255, 0)]на рассмотрение[/COLOR] [COLOR=rgb(255, 0, 0)]Руководителю Модерации Discord Серверов.[/CENTER][/COLOR]<br>" +
        "[CENTER]Убедительная просьба [COLOR=rgb(255, 0, 0)]не создавать копий данной темы.[/COLOR][/CENTER]<br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/t441J37y/8-F693790-9-CE5-49-A7-8-CA5-EA907-AA35690.gif[/img][/url]<br>"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/8cFHWs8Q/standard-8.gif[/img][/url]<br>" +
		'[CENTER][COLOR=rgb(255, 0, 0)]Ожидайте ответа.[/COLOR][/CENTER]',
	  prefix: WAIT_PREFIX,
	  status: true,
	},
     {
	  title: 'Док-ва на возврат имущ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(85,107,47)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HLCxtrbh/IMG-20240312-021513-365.png[/img][/url]<br>"+
        "[CENTER]Ваше обжалование находится [COLOR=rgb(255,165,0)]на рассмотрении[/COLOR].[/CENTER]<br>" +
        "[CENTER][COLOR=rgb(220,20,60)]У вас есть 24 часа чтобы прикрепить доказательство о передаче обманутому игроку Деньги/Имущество на которое вы обманули игрока.[/COLOR][/CENTER]<br>" +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/TYzYRKN3/IMG-20240312-021509-877.png[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/R0ybcgpN/350kb-1.gif[/img][/url]' ,
	  prefix: WAIT_PREFIX,
	  status: true,
	},
     {
	  title: 'NickName',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(46,139,87)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HLCxtrbh/IMG-20240312-021513-365.png[/img][/url]<br>"+
        "[CENTER][COLOR=rgb(184,134,11)]Аккаунт будет разблокирован на 24 часа для смены никнейма.[/CENTER][/COLOR]<br>" +
        "[CENTER]Ваша задача [COLOR=rgb(255,69,0)] отписать в данной теме Ваш новый NickName.[/COLOR][/CENTER]<br>" +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/TYzYRKN3/IMG-20240312-021509-877.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/MH7RpmFc/350kb-2.gif[/img][/url]<br>' ,
	  prefix: WAIT_PREFIX,
	  status: true,
	},
     {
	  title: 'Одобрено',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(34,139,34)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HLCxtrbh/IMG-20240312-021513-365.png[/img][/url]<br>"+
        "[CENTER]Ваше обжалование [COLOR=rgb(0,100,0)]одобрено.[/CENTER][/COLOR]<br>" +
        "[CENTER] Ваше наказание будет[COLOR=rgb(255, 0, 0)] Снижено|Снято.[/COLOR][/CENTER]<br>" +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/TYzYRKN3/IMG-20240312-021509-877.png[/img][/url]<br> '+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/P5QjQpBm/350kb-3.gif[/img][/url]<br>' ,
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'Несогласен',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HLCxtrbh/IMG-20240312-021513-365.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба получает статус [COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR]<br>" +
        "[CENTER]Если вы не согласны с выданным наказанием, то напишите жалобу в раздел[COLOR=rgb(139, 0, 0)] [URL=https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1784/]'Жалобы на Администрацию'. [/URL][/COLOR][/CENTER]<br>" +
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/TYzYRKN3/IMG-20240312-021509-877.pngf[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/28VKDZNn/standard.gif[/img][/url]' ,
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Отказано',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HLCxtrbh/IMG-20240312-021513-365.png[/img][/url]<br>"+
        "[CENTER]Ваше обжалование получает статус [COLOR=rgb(255, 0, 0)]Отказано.[/CENTER][/COLOR]<br>" +
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/TYzYRKN3/IMG-20240312-021509-877.png[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/28VKDZNn/standard.gif[/img][/url]' ,
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Мы не готовы',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255,69,0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(34,139,34)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HLCxtrbh/IMG-20240312-021513-365.png[/img][/url]<br>"+
        "[CENTER][COLOR=rgb(0,206,209)]Администрация сервера не готова пойти вам на встречу и снизить вам наказание.[/CENTER][/COLOR]<br>" +
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/TYzYRKN3/IMG-20240312-021509-877.png[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/28VKDZNn/standard.gif[/img][/url]' ,
	  prefix: FAIL_PREFIX,
	  status: false,
},
    {
	  title: 'Обжалование nrp обмана отказано',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255,0,0, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER][COLOR=rgb(139,0,0)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HLCxtrbh/IMG-20240312-021513-365.png[/img][/url]<br>"+
        "[CENTER]Данное наказание можно обжаловать только при условии выдачи компенсации пострадавшей стороне. [COLOR=rgb(107,142,35)] Для этого вы должны связаться с обманутой стороной, обсудить условия.​[/CENTER][/COLOR]<br>" +
       "[CENTER]Примечание: обманутый игрок должен написать обжалование сам, прикрепив ваши условия договора.[COLOR=rgb(0,128,0)] Обжалование принимается только в том случае, если у обманутой стороны на форумном аккаунте имеется жалоба, по которой вы были забанены.​[/CENTER][/COLOR]<br>" +
       "[CENTER][COLOR=rgb(0,206,209)]Любые попытки обмана администрации, караются блокировкой форумного аккаунта и блокировкой игрового аккаунта без права на обжалование.[/CENTER][/COLOR]<br>" +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/TYzYRKN3/IMG-20240312-021509-877.pngf[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/28VKDZNn/standard.gif[/img][/url]' ,
	  prefix: FAIL_PREFIX,
	  status: false,
    },
 ];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
 
// addButton('На рассмотрение', 'pin');
// addButton('Тех. спецу', 'tech');
	addButton('На рассмотрении', 'pin', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255,165,0, 0.5);');
    addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5);')
    addButton('Одобрено', 'accepted', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5);')
	addAnswers();
 
	// Поиск информации о теме
	const threadData = getThreadData();
 
 $('button#pin').click(() => editThreadData(WAIT_PREFIX, true));
 $('button#tech').click(() => editThreadData(TECH_PREFIX, true));
 $('button#accepted').click(() => editThreadData(OKAY_PREFIX, false));
 $('button#watch').click(() => editThreadData(WATCH_PREFIX, false));
 $('button#close').click(() => editThreadData(CLOSE_PREFIX, false));
 $('button#unaccept').click(() => editThreadData(FAIL_PREFIX, false));
 
	$(`button#selectAnswer`).click(() => {
	XF.alert(buttonsMarkup(buttons), null, 'ОТВЕТЫ😇');
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
	  ? 'Доброе утро'
	  : 12 < hours && hours <= 17
	  ? 'Добрый день'
	  : 17 < hours && hours <= 6
	  ? 'Добрый вечер'
	  : 'Добрый вечер',
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