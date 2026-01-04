// ==UserScript==
// @name        Скрипт для Кураторов Форума по БИО by Jes_Malfoy || Purple
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Скрипт для Кураторов Форума по БИО 06 PURPLE
// @author       Jes_Malfoy
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://i.postimg.cc/yxnTbvdQ/zastavki-gas-kvas-com-2ynk-p-zastavki-blek-rasha-9.jpg
// @grant        none
// @license    MIT
// @downloadURL
// @downloadURL https://update.greasyfork.org/scripts/532627/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%D0%BF%D0%BE%20%D0%91%D0%98%D0%9E%20by%20Jes_Malfoy%20%7C%7C%20Purple.user.js
// @updateURL https://update.greasyfork.org/scripts/532627/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%D0%BF%D0%BE%20%D0%91%D0%98%D0%9E%20by%20Jes_Malfoy%20%7C%7C%20Purple.meta.js
// ==/UserScript==

(function () {
	'use strict';
	const UNACCСEPT_PREFIX = 4; // префикс отказано
	const ACCСEPT_PREFIX = 8; // префикс одобрено
	const PINN_PREFIX = 2; //  префикс закрепить
	const SPECADM_PREFIX = 11; // специальному администратору
	const GA_PREFIX = 12; // главному адамнистратору
    const CLOSE_PREFIX = 7;
    const TEXY_PREFIX = 13;
    const REALIZOVANO_PREFIX = 5;
    const VAJNO_PREFIX = 1;
    const OJIDANIE_PREFIX = 14;
const OTKAZBIO_PREFIX = 4;
const ODOBRENOBIO_PREFIX = 8;
const NARASSMOTRENIIBIO_PREFIX = 2;
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
                        	  title: '| Приветствие |',
	  content:
	       "[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        "[B][CENTER][COLOR=white][FONT=courier new] Текст <br><br>"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]PURPLE[/COLOR].<br><br>",
},
{
	  title: '| На рассмотрении |',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=yellow]на рассмотрении[/COLOR],<br><br>"+
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Ожидайте ответа в данной теме. Не создавайте повторные темы в противном случае Вы можете получить блокировку форумного аккаунта.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]PURPLE[/COLOR].<br><br>",
		 prefix: NARASSMOTRENIIRP_PREFIX,
	  status: false,
},
{
	  title: '| Передать ГА|',
	  content:
	    	"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>'+
                "[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=yellow]передана на рассмотрение Главному Администратору[/COLOR],<br><br>"+
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=courier new]Ожидайте ответа в данной теме. Не создавайте повторные темы в противном случае Вы можете получить блокировку форумного аккаунта.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]PURPLE[/COLOR].<br><br>",
		 prefix: GA_PREFIX,
	  status: false,
},

{
	  title: '|╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴В другой раздел╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴|',
},
{
	  title: '| В жб на адм |',
	  content:
	        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в раздел «Жалобы на администрацию». <br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]PURPLE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Тех спецу |',
	  content:
	        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба была передана [COLOR=yellow]на рассмотрение[/COLOR] [COLOR=orange]Техническому Специалисту[/COLOR].<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]PURPLE[/COLOR].<br><br>",
     prefix: TEXY_PREFIX,
	  status: false,
},
{
	  title: '| В жб на лд |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в раздел «Жалобы на лидеров». <br><br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]PURPLE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| В обжалования |',
	  content:
	   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в раздел «Обжалование наказаний». <br><br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]PURPLE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| В тех раздел |',
	  content:
	   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в технический раздел. <br><br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]PURPLE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| В жб на теха |',
	  content:
	   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в раздел «Жалобы на технических специалистов». <br><br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]PURPLE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| В ЖБ Орг |',
	  content:
	   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в раздел Жалобы на сотрудников организации. <br><br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]PURPLE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},

  {
    	  title: '|╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴RolePlay Биографии╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴|'
},
{
        	  title: '| Био одобрена |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#00FF00]Одобрено[/COLOR]<br><br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]PURPLE[/COLOR].<br><br>",
    prefix: ACCСEPT_PREFIX,
	  status: false,
},
  {
    	  title: '| Био отказ (Форма) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило нарушение формы подачи RP биографии. <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]PURPLE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
    	  title: '| Био отказ (Уже одобрена) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new]Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило то, что Ваша предыдущая Биография уже получила статус Одобрено.  <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]PURPLE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
          	  title: '| Био отказ (Мало инфы) |',
	  content:
	   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR] <br><br>"+
"[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило - Недостаточно количество RolePlay информации о вашем персонаже.<br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]PURPLE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Скопирована) |',
	  content:
	   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
"[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило - Биография скопирована <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]PURPLE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Заголовок) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
"[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило - Неправильное написание заголовка биографии. <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]PURPLE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (1-ое лицо) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
"[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило - Написание Биографии от 1-го лица.  <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]PURPLE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Возраст не совпал) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR] <br><br>"+
"[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило - Возраст не совпадает с датой рождения.<br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]PURPLE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Возраст) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR] <br><br>"+
"[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило - Возраст слишком мал.<br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]PURPLE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Смысл несостык) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
                 "[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило присутствие смысловых несостыковок в вашей RP биографии. <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]PURPLE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Имя не анг) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white] [FONT=courier new]Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило нарушение пункта правил - NickName должен быть указан на английском языка, как в заголовке, так и в самой теме.<br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]PURPLE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (ООС инфа) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR][/B][/CENTER]<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило написание информации из реального мира (OOC).<br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]PURPLE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Реалист) |',
	  content:
	      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужила нереалистичность Вашей биографии (OOC). <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]PURPLE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Несовп возраст) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new]Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужила разница между возрастом указанным в Информации и в самой Биографии. <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]PURPLE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},

  {
                	  title: '| Био отказ (Несовпад мест рожд) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужила разница между местом рождения в Информации и в самой Биографии. <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]PURPLE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},

  {
                	  title: '| Био отказ (Несовпад образов) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white] [FONT=courier new]Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужила разница в образовании указанном в Информации и в Биографии. <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]PURPLE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Ошибки) |',
	  content:
	    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>" +
		"[B][CENTER][COLOR=red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=white][FONT=courier new] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Причиной отказа послужило большое количество ошибок. <br>"+
                "[B][CENTER][COLOR=white][FONT=courier new]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]PURPLE[/COLOR].<br><br>",
     prefix: UNACCСEPT_PREFIX,
      status: false,
},

];

	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('На рассмотрение', 'pin');
	addButton('Отказано⛔', 'unaccept');
	addButton('Одобрено✅', 'accepted');
	addButton('Ответы💥', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PINN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, false));


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

	if (pin == false) {
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
	if (pin == true) {
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
// Функция для создания элемента с подсчетом
function createCountElement(className, count, text) {
  // Создаем новый элемент для отображения количества
  var countElement = document.createElement('div');
  // Устанавливаем класс для нового элемента
  countElement.className = 'count-element';
  // Записываем количество в новый элемент
  countElement.textContent = text + ': ' + count;
  // Применяем стили к новому элементу
  countElement.style.fontFamily = 'Arial';
  countElement.style.fontSize = '16px';
  countElement.style.color = 'red';

  return countElement;
}

// Функция для подсчета элементов и отображения их количества
function countElements() {
  // Получаем все элементы с классом 'structItem structItem--thread is-prefix14'
  var elements1 = document.querySelectorAll('.structItem.structItem--thread.is-prefix14');
  // Получаем все элементы с классом 'structItem structItem--thread is-prefix2'
  var elements2 = document.querySelectorAll('.structItem.structItem--thread.is-prefix2');

  // Подсчитываем количество найденных элементов
  var count1 = elements1.length;
  var count2 = elements2.length;

  // Находим элемент с классом 'filterBar'
  var filterBar = document.querySelector('.filterBar');

  // Проверяем, существует ли элемент 'filterBar'
  if (filterBar) {
    // Добавляем новый элемент перед элементом 'filterBar'
    filterBar.insertAdjacentElement('beforebegin', createCountElement('.structItem.structItem--thread.is-prefix14', count1, 'ТЕМЫ НА ОЖИДАНИИ'));
    filterBar.insertAdjacentElement('beforebegin', createCountElement('.structItem.structItem--thread.is-prefix2', count2, 'ТЕМЫ НА РАССМОТРЕНИИ'));
  } else {
    console.log('Элемент с классом "filterBar" не найден.');
  }
}

// Вызываем функцию при загрузке страницы
window.onload = function() {
  countElements();
};
	})();