// ==UserScript==
// @name         Скрипт для КФ GOLD
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  Скрипт для КФ
// @author       Konstantin_Solodkov
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://i.postimg.cc/Fztj6SLp/image.jpg
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/491425/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%20GOLD.user.js
// @updateURL https://update.greasyfork.org/scripts/491425/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%20GOLD.meta.js
// ==/UserScript==

(function() {
    'use strict';
'use strict';
	const UNACCСEPT_PREFIX = 4; // префикс отказано
	const ACCСEPT_PREFIX = 8; // префикс одобрено
	const PINN_PREFIX = 2; //  префикс закрепить
	const SPECADM_PREFIX = 11; // специальному администратору
	const GA_PREFIX = 12; // главному администратору
    const CLOSE_PREFIX = 7;
    const TEXY_PREFIX = 13;
    const REALIZOVANO_PREFIX = 5;
    const VAJNO_PREFIX = 1;
    const OJIDANIE_PREFIX = 14;
    const Zacrito_Prefix = 15;
const buttons = [
{
    title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Передачи жалоб ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'На рассмотрении',
      content:
          "[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Ваша [color=#ff0000]жалоба[/color] взята на [COLOR=#ffff00]рассмотрение[/color], ожидайте ответа и не создавайте [COLOR=#ff0000]тем-дубликатов[/color].[/SIZE][/FONT] <br><br>"+
                 "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]На рассмотрении[/COLOR][/SIZE][/FONT]<br><br>"+
"[img]https://i.postimg.cc/S2yFSD5t/uix-logo-cust.png[/img]",
      prefix: PINN_PREFIX,
      status: true,
	},
{
      title: 'На рассмотрении RP',
      content:
          "[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Ваша RolePlay Биография взята на [COLOR=#ffff00]рассмотрение[/color], ожидайте ответа и не создавайте [COLOR=#ff0000]тем-дубликатов[/color].[/SIZE][/FONT] <br><br>"+
                 "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]На рассмотрении[/COLOR][/SIZE][/FONT]<br><br>"+
"[img]https://i.postimg.cc/S2yFSD5t/uix-logo-cust.png[/img]",
      prefix: PINN_PREFIX,
      status: true,
        },
    {
       title: 'ГКФ',
      content:
	"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		"[I][B][CENTER][FONT=georgia][SIZE=4]Ваша жалоба передана на рассмотрение Главному Куратору Форума.[/SIZE][/FONT]<br>" +
		'[I][B][CENTER][FONT=georgia][SIZE=4]Не нужно создавать копии данной темы.[/SIZE][/FONT]<br>' +
		"[I][B][CENTER][FONT=georgia][SIZE=4]В противном случае Вам будет выдана блокировка ФА.[/SIZE][/FONT]<br><br>"+
          "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>"+
      "[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]На рассмотрении[/COLOR][/SIZE][/FONT]<br><br>"+
               "[CENTER][img]https://i.postimg.cc/S2yFSD5t/uix-logo-cust.png[/img][/CENTER]",
	  prefix: PINN_PREFIX,
	  status: true,
	},
{
      title: 'ГА',
      content:
	"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		"[I][B][CENTER][FONT=georgia][SIZE=4]Ваша жалоба передана на рассмотрение Главному Администратору сервера.[/SIZE][/FONT]<br>" +
		'[I][B][CENTER][FONT=georgia][SIZE=4]Не нужно создавать копии данной темы.[/SIZE][/FONT]<br>' +
		"[I][B][CENTER][FONT=georgia][SIZE=4]В противном случае Вам будет выдана блокировка ФА.[/SIZE][/FONT]<br><br>" +
	      "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>"+
      "[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ff0000]Передано Главному Администратору[/COLOR][/SIZE][/FONT]<br><br>"+
               "[CENTER][img]https://i.postimg.cc/S2yFSD5t/uix-logo-cust.png[/img][/CENTER]",
       prefix: GA_PREFIX,
	  status: true,
    },
	{
      title: 'Теху',
      content:
	"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		"[I][B][CENTER][FONT=georgia][SIZE=4]Ваша [color=#ff0000]жалоба[/color] передана на [color=#ffff00]рассмотрение[/color] [COLOR=#FF4500]Техническому Специалисту сервера[/color].[/SIZE][/FONT]<br>" +
		'[I][B][CENTER][FONT=georgia][SIZE=4]Не нужно создавать копии данной темы.[/SIZE][/FONT]<br>' +
		"[I][B][CENTER][FONT=georgia][SIZE=4]В противном случае Вам будет выдана блокировка ФА.[/SIZE][/FONT]<br><br>" +
		"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]<br>"+
      "[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#FF4500]Передано Техническому Специалисту[/COLOR][/SIZE][/FONT]<br><br>"+
               "[CENTER][img]https://i.postimg.cc/S2yFSD5t/uix-logo-cust.png[/img][/CENTER]",
	  prefix: TEXY_PREFIX,
	  status: false,
    },
 {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Передача жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'В жалобы на тех.спецов',
      content:
		  "[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Обратитесь в раздел [COLOR=#ff0000]жалоб[/color] на [COLOR=#FF4500]Технических Специалистов[/color].[/COLOR][/SIZE][/FONT] <br><br>"+
           "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
     "[B][CENTER][FONT=georgia][SIZE=4][COLOR=#ff0000]Закрыто[/COLOR][/SIZE][/FONT]<br><br>"+
       "[CENTER][img]https://i.postimg.cc/Qd01LfWc/closed-closed-sign.gif[/img][/CENTER]",
      prefix: CLOSE_PREFIX,
      status: false,
    },
        {
      title: 'В жалобы на игроков',
      content:
	  "[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Обратитесь в раздел [color=#ff0000]жалоб[/color] на [COLOR=#FFD700]игроков[/color].[/COLOR][/SIZE][/FONT] <br><br>"+
            "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
    "[B][CENTER][FONT=georgia][SIZE=4][COLOR=#ff0000]Закрыто[/COLOR][/SIZE][/FONT]<br><br>"+
      "[CENTER][img]https://i.postimg.cc/Qd01LfWc/closed-closed-sign.gif[/img][/CENTER]",
      prefix: CLOSE_PREFIX,
      status: false,
             },
        {
      title: 'В жалобы на адм',
      content:
	  "[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Обратитесь в раздел [color=#ff0000]жалоб на Aдминистрацию[/color].[/COLOR][/SIZE][/FONT] <br><br>"+
              "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
  "[B][CENTER][FONT=georgia][SIZE=4][COLOR=#ff0000]Закрыто[/COLOR][/SIZE][/FONT]<br><br>"+
      "[CENTER][img]https://i.postimg.cc/Qd01LfWc/closed-closed-sign.gif[/img][/CENTER]",
      prefix: CLOSE_PREFIX,
      status: false,
},
{
	 title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Одобрить жалобу(Игрока) ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
	},
    {
   title: 'Одобрено',
   content:
  "[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
 "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][COLOR=#ff0000]Нарушитель[/COLOR] будет [COLOR=#ff0000]наказан[/COLOR].[/SIZE][/FONT]<br><br>"+
 "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
     prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'DM',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][COLOR=#ff0000]Нарушитель[/COLOR] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]пункту общих правил[/color].[/SIZE][/FONT]<br>" +
		' [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]2.19[COLOR=#ff0000]Запрещен[/COLOR] [COLOR=#00bfff]DM (DeathMatch)[/COLOR] — [COLOR=#ff0000]убийство или нанесение урона[/COLOR] без веской [COLOR=#00bfff]IC[/COLOR] причины [COLOR=#ff0000]| Jail 60 минут[/SIZE][/FONT]<br><br>' +
 "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'DB',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender] [COLOR=#ff0000]Нарушитель[/COLOR] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]пункту общих правил[/color].[/SIZE][/FONT]<br>" +
		'[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]2.13 [COLOR=#ff0000]Запрещен[/COLOR] [COLOR=#00bfff]DB (DriveBy)[/COLOR] — [COLOR=#ff0000]намеренное убийство / нанесение урона[/COLOR] без веской [COLOR=#00bfff]IC[/COLOR] причины на любом виде транспорта [COLOR=#ff0000] | Jail 60 минут [/SIZE][/FONT]<br><br>' +
		"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'SK',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+

        " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][COLOR=#ff0000]Нарушитель[/COLOR] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]пункту общих правил[/color].[/SIZE][/FONT]<br>"+
		' [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]2.16[COLOR=#ff0000]Запрещен[/COLOR] [color=#00bfff]SK (Spawn Kill)[/color] — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления [COLOR=#FFD700]игрока[/color], а также на выходе из закрытых интерьеров и около них [COLOR=#ff0000]| Jail 60 минут / Warn [/COLOR] (за два и более убийства)[/SIZE][/FONT]<br><br>'+
		"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'PG',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][COLOR=#ff0000]Нарушитель[/COLOR] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]пункту общих правил[/color].[/SIZE][/FONT]"+
		' [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]2.17[COLOR=#ff0000]Запрещен[/COLOR] PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь | Jail 30 минут [/SIZE][/FONT]<br><br>'+
 "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'RK',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender] [COLOR=#ff0000]Нарушитель[/COLOR] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]пункту общих правил[/color].[/SIZE][/FONT]"+
		' [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]2.14[COLOR=#ff0000]Запрещен[/COLOR] [COLOR=#00bfff]RK (Revenge Kill)[/color] — [color=#ff0000]убийство[/color] [COLOR=#FFD700]игрока[/color] с целью [COLOR=#ff0000]мести[/color], возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти  [COLOR=#ff0000]| Jail 30 минут[/SIZE][/FONT]<br><br>'+
		 "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ТК',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender] [COLOR=#ff0000]Нарушитель[/COLOR] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]пункту общих правил[/color][/SIZE][/FONT]."+
		'[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]2.15[COLOR=#ff0000]Запрещен[/COLOR] [COLOR=#00bfff]TK (Team Kill)[/color] — [color=#ff0000]убийство члена своей или союзной фракции[/color], организации без наличия какой-либо [COLOR=#00bfff]IC[/COLOR] причины [COLOR=#ff0000]| Jail 60 минут / Warn[/COLOR] (за два и более убийства)[/SIZE][/FONT]<br><br>'+
		"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
 "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
{
      title: 'Мат в VIP чат',
      content:
		'[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>' +
        "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender] [COLOR=#FFD700]Игрок[/color] будет [COLOR=#ff0000]наказан[/COLOR] по данному [COLOR=#FF4500]пункту правил[/color]:<br>"+
"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]3.23[COLOR=#ff0000]Запрещено[/COLOR] использование нецензурных слов, в том числе завуалированных и литературных в VIP чате [Color=#ff0000]| Mute 30 минут[/CENTER][/SIZE][/FONT]<br>" +
 "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'MG',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender] [COLOR=#ff0000]Нарушитель[/COLOR] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]пункту общих правил[/color]."+
		' [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]2.18 [COLOR=#ff0000]Запрещен[/COLOR] [COLOR=#00bfff]MG (MetaGaming)[/COLOR] — использование [COLOR=#00bfff]ООС[/COLOR] информации, которую Ваш персонаж никак не мог получить в [COLOR=#00bfff]IC[/COLOR] процессе[COLOR=#ff0000] | Mute 30 минут[/COLOR]<br><br>'+
 "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Caps',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender] [COLOR=#ff0000]Нарушитель[/COLOR] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]пункту общих правил[/color]."+
		' [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]3.02 [COLOR=#ff0000]Запрещено[/color] использование верхнего регистра (CapsLock) при написании любого текста в любом чате[COLOR=#ff0000] | Mute 30 минут[/COLOR]<br><br>'+
	"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Flood',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender] [COLOR=#ff0000]Нарушитель[/COLOR] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]пункту общих правил[/color]."+
		' [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]3.05[COLOR=#ff0000]Запрещен[/color] флуд — 3 и более повторяющихся сообщений от одного и того же [COLOR=#FFD700]игрока[/color] [COLOR=#ff0000]| Mute 30 минут[/COLOR]<br><br>'+
		"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Оск',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender] [COLOR=#ff0000]Нарушитель[/COLOR] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]пункту общих правил[/color]."+
		' [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]3.03 Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в [COLOR=#00bfff]OOC[/COLOR] чате [COLOR=#ff0000]запрещены[/color][COLOR=#ff0000] | Mute 30 минут[/COLOR][/SIZE][/FONT]<br><br>'+
		"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
   "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Упом родни',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender] [COLOR=#ff0000]Нарушитель[/COLOR] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]пункту общих правил[/color]. <br>" +
		'[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender] 3.04. [COLOR=#ff0000]Запрещено[/color] оскорбление или косвенное упоминание родных вне зависимости от чата [COLOR=#00bfff](IC или OOC)[/color] [COLOR=#ff0000]| Mute 120 минут / Ban 7 - 15 дней.[/COLOR][/SIZE][/FONT]<br><br>' +
		"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Транслит',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender] [COLOR=#ff0000]Нарушитель[/COLOR] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]пункту общих правил[/color]. <br>"+
       "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]3.20. [COLOR=#ff0000]Запрещено[/color] использование транслита в любом из чатов [COLOR=#ff0000]| Mute 30 минут.[/COLOR]<br>Пример: «Privet», «Kak dela», «Narmalna».[/SIZE][/FONT]<br><br>" +
		"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Объявы на территории ГОСС',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender] [COLOR=#ff0000]Нарушитель[/COLOR] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]пункту общих правил[/color]. <br>"+
"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]3.22. [COLOR=#ff0000]Запрещено[/color] публиковать любые объявления в помещениях государственных организаций вне зависимости от чата [COLOR=#00bfff](IC или OOC)[/color][COLOR=#ff0000] | Mute 30 минут.[/COLOR]<br>Пример: в помещении центральной больницы писать в чат: «Продам эксклюзивную шапку дешево!!!»[/SIZE][/FONT]<br><br>" +
		"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Угрозы наказанием со стороны Адм',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender] [COLOR=#ff0000]Нарушитель[/COLOR] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]пункту общих правил[/color]. <br>"+
       "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]3.09. [color=#ff0000]Запрещены[/color] любые [color=#ff0000]угрозы о наказании[/color] [COLOR=#FFD700]игрока[/color] со стороны [color=#ff0000]Aдминистрации | Mute 30 минут.[/COLOR][/SIZE][/FONT]<br><br>" +
		"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
 "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'OOC угрозы',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
 " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender] [COLOR=#ff0000]Нарушитель[/COLOR] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]пункту общих правил[/color]. [/SIZE][/FONT]<br>"+
  "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender] 2.37. [COLOR=#ff0000]Запрещены[/color] [COLOR=#00bfff]OOC[/COLOR] [COLOR=#ff0000]угрозы[/color], в том числе и [COLOR=#ff0000]завуалированные | Mute 120 минут / Ban 7 дней[/COLOR][/SIZE][/FONT]<br><br>" +
	"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Помеха РП',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender] [COLOR=#ff0000]Нарушитель[/COLOR] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]пункту общих правил[/color]. <br>"+
    "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]2.51. [COLOR=#ff0000]Запрещено[/color] вмешательство в [COLOR=#00bfff]Role Play процесс[/color] с целью помехи и препятствования дальнейшего развития [COLOR=#00bfff]Role Play процесса[/color][COLOR=#ff0000] | Jail 30 минут.[/COLOR]<br>Пример: вмешательство в Role Play процесс при задержании [COLOR=#FFD700]игрока[/color] сотрудниками ГИБДД, вмешательство в проведение тренировки или мероприятия какой-либо фракции и тому подобные ситуации.[/SIZE][/FONT]<br><br>" +
	"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'NonRP аксессуар',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender] [COLOR=#ff0000]Нарушитель[/COLOR] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]пункту общих правил[/color]. <br>"+
"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]2.52 [COLOR=#ff0000]Запрещено[/color] располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут.<br>Пример: слишком большие аксессуары на голове персонажа, имитация гитарой половых органов и тому подобное.[/SIZE][/FONT]<br><br>" +
		"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'NonRP поведение',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender] [COLOR=#ff0000]Нарушитель[/COLOR] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]пункту общих правил[/color]. <br>"+
"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]2.01 [COLOR=#ff0000]Запрещено[/color] поведение, нарушающее нормы процессов [COLOR=#00bfff]Role Play режима[/color] игры[COLOR=#ff0000] | Jail 30 минут.[/COLOR][/SIZE][/FONT]<br><br>" +
	"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'NRP drive',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender] [COLOR=#ff0000]Нарушитель[/COLOR] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]пункту общих правил[/color].<br>"+
"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]2.03. [COLOR=#ff0000]Запрещен[/color] NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [COLOR=#ff0000]| Jail 30 минут.[/COLOR][/SIZE][/FONT]<br><br>" +
              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },{
      title: 'ознакомление с правилом долга',
      content:
        '[Color=MediumPurple][FONT=TIMES NEW ROMAN][CENTER][I]{{greeting}} , уважаемый {{ user.name }}.[/color][/CENTER]<br>' +
        "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender] [COLOR=#008000]Ознакомьтесь[/COLOR][/CENTER]"+
            "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender] [Color=#ffff00]Примечание:[/color] займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется; [/SIZE][/FONT]<br>" +
            "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender] [Color=#ffff00]Примечание:[/color] при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда; [/SIZE][/FONT]<br>" +
            "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender] [Color=#ffff00]Примечание:[/color] жалоба на [COLOR=#FFD700]игрока[/color], который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами.[/CENTER][/SIZE][/FONT]<br><br>" +
       "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
 "[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
	  title: 'NRP drive фура/инко',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender] [COLOR=#ff0000]Нарушитель[/COLOR] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]пункту общих правил[/color].<br>"+
"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]2.47. [COLOR=#ff0000]Запрещено[/COLOR] ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [COLOR=#ff0000]| Jail 60 минут.[/COLOR][/SIZE][/FONT]<br><br>" +
	"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ДОЛГ',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender] [COLOR=#ff0000]Нарушитель[/COLOR] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]пункту общих правил[/color]: <br>"+
"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]2.57. Запрещается брать в долг игровые ценности и не возвращать их. [COLOR=#ff0000]| Ban 30 дней / permban [/COLOR][/SIZE][/FONT]<br><br>"+
"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Постороннее ПО/Изм. Файлов игры',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender] [COLOR=#ff0000]Нарушитель[/COLOR] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]пункту общих правил[/color].<br>"+
"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]2.22. [COLOR=#ff0000]Запрещено[/COLOR] хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими [COLOR=#FFD700]игроками[/color][COLOR=#ff0000] |  Ban 15 - 30 дней / PermBan.[/COLOR][/SIZE][/FONT]<br><br>" +
"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
    title: 'NRP обман',
      content:
       "[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
       " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender] [COLOR=#ff0000]Нарушитель[/COLOR] буден [COLOR=#ff0000]наказан[/COLOR] по следующему [COLOR=#FF4500]пункту общих правил[/color] серверов:<br><br>" +
       '[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender] 2.05. [COLOR=#ff0000]Запрещены[/COLOR] любые [COLOR=#00bfff]OOC[/COLOR] [COLOR=#ff0000]обманы и их попытки[/COLOR], а также любые [COLOR=#00bfff]IC[/COLOR] [COLOR=#ff0000]обманы[/COLOR] с нарушением [COLOR=#00bfff]Role Play[/COLOR] правил и логики [COLOR=#ff0000]| PermBan[/COLOR]<br>' +
       "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][COLOR=#ffff00]Примечание[/COLOR]: после [COLOR=#00bfff]IC[/COLOR] договоренности получить денежные средства и сразу же выйти из игры с целью [COLOR=#ff0000]обмана игрока[/COLOR], или же, договорившись через [COLOR=#00bfff]OOC чат (/n)[/COLOR], точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.[/SIZE][/FONT]<br>" +
       '[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender] [COLOR=#ffff00]Примечание[/COLOR]: [COLOR=#ff0000]разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено [/COLOR](по решению обманутой стороны).[/SIZE][/FONT]<br><br>' +
"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
	{
      title: 'Слив склада',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][COLOR=#ff0000]Нарушитель[/COLOR] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]пункту общих правил[/color]. <br>"+
"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]2.09. [COLOR=#ff0000]Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов[/COLOR], или же [COLOR=#ff0000]брать больше[/COLOR], чем разрешили на самом деле [COLOR=#ff0000]| Ban 15 - 30 дней / PermBan[/COLOR][/SIZE][/FONT]<br><br>" +
	"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: '2.34 Запрещен уход от наказания',
	  content:
'[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>' +
'[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender] [COLOR=#FFD700]Игроку[/color] будет выдано наказание по [COLOR=#FF4500]пункту правил[/color]: [/COLOR]<br><br>' +
'[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender] 2.34 [COLOR=#ffff00]Запрещен[/color] уход от наказания [COLOR=#ffff00]| Ban 15 - 30 дней (суммируется к общему наказанию дополнительно)[/COLOR][/SIZE][/FONT]<br><br>' +
"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
       prefix: ACCСEPT_PREFIX,
       status: false,
    },
    {
      title: 'Масс ДМ',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][COLOR=#ff0000]Нарушитель[/COLOR] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]пункту общих правил[/color]. <br>"+
"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской [COLOR=#00bfff]IC[/COLOR] причины более трем [COLOR=#FFD700]игрокам[/color] [COLOR=#ff0000]| Warn / Ban 3 - 7 дней.[/COLOR][/SIZE][/FONT]<br><br>" +
"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Реклама промо',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][COLOR=#ff0000]Нарушитель[/COLOR] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]пункту общих правил[/color].<br>"+
"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [COLOR=#ff0000]| Ban 30 дней.[/COLOR][/SIZE][/FONT]<br><br>" +
"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Продажа промо',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][COLOR=#ff0000]Нарушитель[/COLOR] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]пункту общих правил[/color].<br>"+
"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]2.43. Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно [COLOR=#FFD700]игрокам[/color] в целях промоакций [COLOR=#ff0000]| Mute 120 минут.[/COLOR][/SIZE][/FONT]<br><br>" +
	"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неув обр. к Адм',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][COLOR=#ff0000]Нарушитель[/COLOR] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]пункту общих правил[/color].<br>"+
"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]2.54. [COLOR=#ff0000]Запрещено[/COLOR] неуважительное обращение, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [COLOR=#ff0000]| Mute 180 минут[/COLOR][/SIZE][/FONT]<br><br>" +
"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
	  status: false,
    },
    {
	  title: 'Обман адм',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][COLOR=#ff0000]Нарушитель[/COLOR] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]пункту общих правил[/color].<br>"+
"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]2.32. [COLOR=#ff0000]Запрещено[/COLOR] введение в заблуждение, обман администрации на всех ресурсах проекта [COLOR=#ff0000]| Ban 7 - 15 дней / PermBan[/COLOR][/SIZE][/FONT]<br><br>" +
		"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Выдача себя за адм',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][COLOR=#ff0000]Нарушитель[/COLOR] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]пункту общих правил[/color].<br>"+
"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]3.10. Запрещена выдача себя за администратора, если таковым не являетесь[COLOR=#ff0000] | Ban 15 - 30 + ЧС администрации[/COLOR][/SIZE][/FONT]<br><br>" +
"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Оск. Проекта',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][COLOR=#ff0000]Нарушитель[/COLOR] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]пункту общих правил[/color].<br>"+
"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]2.40.  Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [COLOR=#ff0000]|Mute 300 минут / Ban 30 дней[/COLOR] (Ban выдается по согласованию с главным администратором)[/SIZE][/FONT]<br><br>" +
"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Призыв покинуть проект',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][COLOR=#ff0000]Нарушитель[/COLOR] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]пункту общих правил[/color].<br>"+
"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]2.40.  Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [COLOR=#ff0000]|Mute 300 минут / Ban 30 дней [/COLOR](Ban выдается по согласованию с главным администратором).[/SIZE][/FONT]<br><br>" +
"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Сбив аним',
      content:
        "[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [FONT=georgia] [B][CENTER][COLOR=#ff0000]Нарушитель[/COLOR] буден [COLOR=#ff0000]наказан[/COLOR] по следующему [COLOR=#FF4500]пункту общих правил[/color] серверов:[/SIZE][/FONT]<br><br>" +
        '[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]2.55. Запрещается багоюз связанный с анимацией в любых проявлениях. [COLOR=#ff0000]| Jail 60 / 120 минут[/COLOR][/SIZE][/FONT]<br><br>' +
        "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][color=#ffff00]Пример[/color]: если [COLOR=#FFD700]игрок[/color], используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде Jail на 120 минут. Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими [COLOR=#FFD700]игроками[/color].[/SIZE][/FONT]<br><br>" +
        '[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][color=#ffff00]Пример[/color]: если [COLOR=#FFD700]игрок[/color] использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других [COLOR=#FFD700]игроков[/color], а также не получает преимущество перед другими [COLOR=#FFD700]игроками[/color], последует наказание в виде Jail на 60 минут.[/SIZE][/FONT]<br><br>' +
 "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
	{
	  title: 'Ввод в заблуждение',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [FONT=georgia] [B][CENTER][COLOR=#ff0000]Нарушитель[/COLOR] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]пункту общих правил[/color].<br>"+
"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]2.32. [COLOR=#ff0000]Запрещено[/COLOR] введение в заблуждение, обман администрации на всех ресурсах проекта[COLOR=#ff0000] | Ban 7 - 15 дней[/COLOR][/SIZE][/FONT]<br><br>" +
"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Уход от РП',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [FONT=georgia] [B][CENTER][COLOR=#ff0000]Нарушитель[/COLOR] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]пункту общих правил[/color].<br>"+
"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]2.02 [COLOR=#ff0000]Запрещено[/COLOR] целенаправленно уходить от [COLOR=#00bfff]Role Play процесса[/color] всеразличными способами [COLOR=#ff0000]| Jail 30 минут / Warn[/COLOR][/SIZE][/FONT]<br>" +
		'[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Примечание: например, уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания / ареста, полное игнорирование отыгровок другого [COLOR=#FFD700]игрока[/color], которые так или иначе могут коснутся Вашего персонажа и так далее[/SIZE][/FONT]<br><br>' +
		"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Политика',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [FONT=georgia] [B][CENTER][COLOR=#ff0000]Нарушитель[/COLOR] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]пункту общих правил[/color].<br>"+
"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]3.18. [COLOR=#ff0000]Запрещено[/COLOR] политическое и религиозное пропагандирование [COLOR=#ff0000]| Mute 120 минут / Ban 10 дней[/COLOR]<br><br>" +
 "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
{
	  title: '  ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Игровые Аккаунты ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴  ',
	},
	{
      title: 'Мультиаккаунт',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][COLOR=#ff0000]Нарушитель[/COLOR] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]пункту общих правил[/color] 4.04.[/COLOR][/SIZE][/FONT]<br>" +
	'[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][COLOR=#008000]Разрешается[/color] зарегистрировать максимально только [COLOR=#ff0000]три игровых аккаунта на сервере | PermBan[/COLOR][/SIZE][/FONT]<br><br>'+
	"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
	 "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
	{
      title: 'ППВ',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][COLOR=#ff0000]Нарушитель[/COLOR] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]пункту общих правил[/color].[/COLOR][/SIZE][/FONT]<br>" +
		' [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]4.03 [COLOR=#ff0000]Запрещена[/color] совершенно любая передача игровых аккаунтов третьим лицам | PermBan[/COLOR][/SIZE][/FONT]<br><br>' +
	"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
	 "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
	{
      title: 'ППиВ',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][COLOR=#ff0000]Нарушитель[/color] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#ffff00]пункту общих правил[/COLOR].[/COLOR][/SIZE][/FONT]<br>" +
		' [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]2.42 [COLOR=#ff0000]Попытка продажи любого игрового имущества[/color] или [COLOR=#ff0000]игрового аккаунта[/color] за [COLOR=#228b22]реальные деньги[/COLOR] |[COLOR=#ff0000] PermBan[/color].[/COLOR][/SIZE][/FONT]<br><br>' +
		"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
 "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
	{
      title: 'Трансфер',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][COLOR=#ff0000]Нарушитель[/color] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]пункту общих правил[/color].[/COLOR][/SIZE][/FONT]<br>" +
		' [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]4.05[COLOR=#ff0000]Запрещено[/COLOR] передавать любые игровые ценности между игровыми аккаунтами, а также в целях удержания имущества | Ban 15 - 30 дней / PermBan[/COLOR][/SIZE][/FONT]<br><br>' +
 "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
 "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
  prefix: ACCСEPT_PREFIX,
	  status: false,
    },
	{
      title: 'Оск ник',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][COLOR=#ff0000]Нарушитель[/COLOR] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]пункту общих правил[/color] .[/COLOR][/SIZE][/FONT]<br>" +
		' [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]4.09[COLOR=#ff0000]Запрещено[/COLOR] использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) | Устное замечание + смена игрового никнейма / PermBan[/COLOR][/SIZE][/FONT]<br><br>' +
	"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
	 "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
	{
      title: 'Фэйк',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][COLOR=#ff0000]Нарушитель[/COLOR] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]пункту общих правил[/color].[/COLOR][/SIZE][/FONT]<br>" +
		' [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]4.10[COLOR=#ff0000]Запрещено[/COLOR] создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию |[COLOR=#ff0000] Устное замечание + смена игрового никнейма / PermBan[/COLOR][/COLOR][/SIZE][/FONT]<br><br>' +
	"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
	 "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
	{
      title: 'Копирование промо',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Нарушитель будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]пункту общих правил[/color] 4.15.[/COLOR][/SIZE][/FONT]<br>" +
		' [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][COLOR=#ff0000]Запрещено[/COLOR] создавать промокод, идентичный промокоду блогера проекта, а также любой промокод, который не относится к рефералу и имеет возможность пассивного заработка.[/COLOR][/SIZE][/FONT]<br>' +
		"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][color=#ff0000]Наказание[/color]: перманентная блокировка аккаунта или обнуление имущества, заработанного с помощью промокода, а также самого промокода.[/COLOR][/SIZE][/FONT]<br><br>" +
	"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
	 "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила ГОСС ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
     {
      title: 'НРП Розыск/Штраф',
      content:
		  "[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][COLOR=#ff0000]Нарушитель[/COLOR] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]Пункту Правил[/color] ГОСС.[/COLOR][/SIZE][/FONT] <br><br>"+
          '[I][B][CENTER][FONT=georgia][SIZE=4]7.02. [COLOR=#ff0000]Запрещено[/COLOR] выдавать розыск, штраф без [COLOR=#00bfff]Role Play причины[/color] [COLOR=#ff0000]| Warn [/COLOR][/SIZE][/FONT]<br><br>' +
        "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
        "[B][CENTER][FONT=georgia][SIZE=4][COLOR=#008000]Одобрено[/COLOR][/SIZE][/FONT]<br><br>",
      prefix: ACCСEPT_PREFIX,
      status: false,
         },
     {
      title: 'Правоохран. ограны на территории Bizwar за 10 мин до начала',
      content:
		 "[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][COLOR=#ff0000]Нарушитель[/COLOR] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]Пункту Правил[/color] ГОСС.[/SIZE][/FONT]<br>" +
		"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]1.14. Сотрудникам правоохранительных органов [COLOR=#ff0000]запрещается[/COLOR] задерживать состав участников войны за бизнес за 10 минут непосредственно до начала самого бизвара.[COLOR=#ff0000] | Jail 30 минут [/COLOR][/SIZE][/FONT]<br>" +
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Исключение: в случае, если состав участников войны за бизнес первый начал совершать действия, которые нарушают закон.[/SIZE][/FONT]<br><br>" +
	"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
	 "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
      prefix: ACCСEPT_PREFIX,
      status: false,
      },
       {
      title: 'Подработка в РФ',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][COLOR=#ff0000]Нарушитель[/COLOR] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]Пункту Правил[/color] ГОСС.[/SIZE][/FONT]<br>" +
		'[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]1.07. Всем сотрудникам государственных организаций [COLOR=#ff0000]запрещено[/COLOR] выполнять работы где-либо в форме, принадлежащей своей фракции [COLOR=#ff0000]| Jail 30 минут[/SIZE][/FONT] <br><br>' +
		"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
 '[B][CENTER][FONT=georgia][SIZE=4][COLOR=#008000]  Одобрено [/COLOR][/FONT] [/CENTER]',
	  prefix: ACCСEPT_PREFIX,
	  status: false,
    },
       {
      title: 'Нарушение ПРО',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=#ff0000]Нарушитель[/COLOR] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]Пункту Правил[/color] ГОСС.[/SIZE][/FONT]<br>" +
		'[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]4.01. [COLOR=#ff0000]Запрещено[/COLOR] редактирование объявлений, не соответствующих ПРО [COLOR=#ff0000]| Mute 30 минут [/SIZE][/FONT]<br><br>' +
	"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
	  prefix: ACCСEPT_PREFIX,
	  status: false,
    },
       {
      title: 'НРП эфир ',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		" [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][COLOR=#ff0000]Нарушитель[/COLOR] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]Пункту Правил[/color] ГОСС.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
		'[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]4.02. [COLOR=#ff0000]Запрещено[/COLOR] проведение эфиров, не соответствующих [COLOR=#00bfff]Role Play правилам и логике[/color][COLOR=#ff0000] | Mute 30 минут [/SIZE][/FONT]<br><br>' +
		"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
	  prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Редакт  в лц',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		" [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][COLOR=#ff0000]Нарушитель[/COLOR] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]Пункту Правил[/color] ГОСС 4.04.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
		'[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender] 4.04. [COLOR=#ff0000]Запрещено[/COLOR] редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком[COLOR=#ff0000] | Ban 7 дней[/COLOR] + ЧС организации[/SIZE][/FONT] <br><br>' +
 "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
	  prefix: ACCСEPT_PREFIX,
	  status: false,
    },
{
       title: ' Слив СМИ',
	  content:
'[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>' +
'[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender] [COLOR=#FFD700]Игроку[/color] будет [COLOR=#ff0000]выдано наказание[/color] по [COLOR=#FF4500]Пункту Правил[/color]: [/SIZE][/FONT]<br><br>' +
'[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender] 3.08. [COLOR=#ff0000]Запрещены[/COLOR] любые формы «слива» посредством использования глобальных чатов [COLOR=#ff0000]| PermBan[/COLOR][/SIZE][/FONT][/CENTER]<br><br>' +
"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+

              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
   prefix:ACCСEPT_PREFIX,
   status:false,
    },
   {
      title: 'НРП поведение',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		" [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][COLOR=#ff0000]Нарушитель[/COLOR] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]Пункту Правил[/color] ГОСС.[/SIZE][/FONT]<br>" +
		'[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender] 6.03. [COLOR=#ff0000]Запрещено[/COLOR] nRP поведение[COLOR=#ff0000] | Warn[/SIZE][/FONT] <br><br>' +
	"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+

              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
	  prefix: ACCСEPT_PREFIX,
	  status: false,
    },

	{
      title: 'Исп Т/С фракции в лич целях',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		" [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][COLOR=#ff0000]Нарушитель[/COLOR] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]Пункту Правил[/color] ГОСС .[/SIZE][/FONT]<br>" +
        ' [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]1.08 [COLOR=#ff0000]Запрещено[/COLOR] использование фракционного транспорта в личных целях [COLOR=#ff0000]| Jail 30 минут.[/SIZE][/FONT]<br><br>' +
 "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+

              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
	  prefix: ACCСEPT_PREFIX,
	  status: false,
    },
	{
      title: 'Одиночный патруль',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		" [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][COLOR=#ff0000]Нарушитель[/COLOR] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]Пункту Правил[/color] ГОСС 1.11.[/SIZE][/FONT]<br>" +
		' [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender] Всем силовым структурам [COLOR=#ff0000]запрещен[/COLOR] одиночный патруль или конвоирование, минимум 2 сотрудника [COLOR=#ff0000]| Jail 30 минут.[/SIZE][/FONT]<br><br>' +
	"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
	  prefix: ACCСEPT_PREFIX,
	  status: false,
    },
	{
      title: 'БУ/Казино/Конты/Вышки в РФ',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
" [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][COLOR=#ff0000]Нарушитель[/COLOR] будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]Пункту Правил[/color] ГОСС 1.13.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
		' [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][COLOR=#ff0000]Запрещено[/COLOR] находиться в форме внутри казино, участвовать в битве за контейнеры, участвовать в захвате семейного контейнера, находится на Б/У рынке с целью покупки / продажи авто, а также устраиваться на сторонние работы в форме фракции[COLOR=#ff0000] | Jail 30 минут[/COLOR][/SIZE][/FONT][/CENTER] <br><br>' +
	"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
	  prefix: ACCСEPT_PREFIX,
	  status: false,
    },
	{
	  title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила ОПГ ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
	},
	{
      title: 'Nrp ВЧ',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		" [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Нарушитель будет [COLOR=#ff0000]наказан[/COLOR] по [COLOR=#FF4500]Пункту Правил[/color] ОПГ 2.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
		'. [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]За нарушение правил нападения на Войсковую Часть выдаётся предупреждение [COLOR=#ff0000][COLOR=#ff0000] | Jail 30 минут[/COLOR] (NonRP нападение) / Warn (Для сотрудников ОПГ) [/COLOR][/SIZE][/FONT][/CENTER]<br><br>' +
	"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
             "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
	  prefix: ACCСEPT_PREFIX,
	  status: false,
    },
{
	  title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отказать жалобу(Игрока) ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
	},
	{
      title: 'За /try нету наказания',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]За игру в /try нету наказаний от Администрации. Это уже ваше дело и [COLOR=#FFD700]игрока[/color], если отдавать [COLOR=#228b22]деньги[/color] или [COLOR=#ff0000]нет[/color].[/SIZE][/FONT]<br><br>" +
	"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
	"[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
	prefix: CLOSE_PREFIX,
	  status: false,
    },
{
      title: 'Неполный фрапс',
      content:
        '[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>' +
        "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Фрапс [COLOR=#ff0000]обрывается[/COLOR]. Загрузите [COLOR=#ff0000]полный фрапс на ютуб[/COLOR].[/SIZE][/FONT]" +
 "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
"[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
	{
      title: 'РП отыгрывать не нужно',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		" [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Сотрудники правоохранительных органов не должны отыгрывать РП, за них это делает система.[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>" +
		"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
 "[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Жалоба от 3 лица',
	  content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		" [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][color=#ff0000]Жалоба[/color] должна быть написана от 1 лица[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>" +
		"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Ознакомиться с правилами подачи жалоб на [COLOR=#FFD700]игроков[/color] можно [/COLOR][URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/'][Color=#ff0000][U]*тут*[/U][/color][/URL].[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>" +
		"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
 "[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
	prefix: CLOSE_PREFIX,
	  status: false,
    },
	{
	  title: 'Нету доказательств',
	  content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		" [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]В Вашей жалобе отсуствуют доказательства. Просьба написать новую жалобу и прикрепить к ней доказательства о нарушении [COLOR=#FFD700]игрока[/color][/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>" +
		"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]  Ознакомиться с правилами подачи жалоб на [COLOR=#FFD700]игроков[/color] можно [/COLOR][URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/'][Color=#ff0000][U]*тут*[/U][/color][/URL].[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>" +
	"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
 "[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Нет доступа к доказательствам',
	  content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		" [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]К Вашим доказательствам нету доступа. Просьба написать новую жалобу и предоставить доступ к просмотру доказательств[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>" +
	"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
 "[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Неадекватная жалоба',
	  content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		" [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Составьте жалобу в адекватной форме - без призераний, оскорблений и тд.[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>" +
		"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]  Ознакомиться с правилами подачи жалоб на [COLOR=#FFD700]игроков[/color] можно [/COLOR][URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/'][Color=#ff0000][U]*тут*[/U][/color][/URL].[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>" +
		"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
 "[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
	{
	title: 'Нету условий сделки',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]В данных доказательствах отсутствуют условия сделки[/SIZE][/FONT]<br><br>" +
        "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]  Ознакомиться с правилами подачи жалоб на [COLOR=#FFD700]игроков[/color] можно [/COLOR][URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/'][Color=#ff0000][U]*тут*[/U][/color][/URL].[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
 "[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Укажите таймкоды',
	  content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		" [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Укажите тайм коды нарушений [COLOR=#FFD700]игрока[/color] и создайте новую жалобу[/SIZE][/FONT]<br><br>" +
		"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]  Ознакомиться с правилами подачи жалоб на [COLOR=#FFD700]игроков[/color] можно [/COLOR][URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/'][Color=#ff0000][U]*тут*[/U][/color][/URL].[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>" +
		"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
 "[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
{
      title: 'Более 72 часов',
      content:
        '[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>' +
        "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]С момента получения наказания прошло более [color=#00FFFF]72 часов[/color].[/SIZE][/FONT][/CENTER][/B]" +
        "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]  Ознакомиться с правилами подачи [color=#ff0000]жалоб[/color] на [COLOR=#FFD700]игроков[/color] можно [/COLOR][URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/'][Color=#ff0000][U]*тут*[/U][/color][/URL].[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>" +
"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
 "[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
	{
	  title: 'Нарушений не найдено',
	  content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		" [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][color=#ff0000]Нарушений[/color] со стороны данного [COLOR=#FFD700]игрока[/color] [color=#ff0000]не было найдено[/color].[/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
	"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
	 "[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
	{
      title: 'Дублирование',
      content:
       "[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Ранее вам уже был дан корректный ответ на подобную жалобу, просьба не создавать дубликаты этой темы, иначе ваш форумный аккаунт может быть заблокирован[/SIZE][/FONT]<br><br>" +
        "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]  Ознакомиться с правилами подачи жалоб на [COLOR=#FFD700]игроков[/color] можно [/COLOR][URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/'][Color=#ff0000][U]*тут*[/U][/color][/URL].[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>" +
      "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
   "[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Форма темы',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Ваша жалоба составлена не по форме[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
		"[B][FONT=georgia][SIZE=4][COLOR=lavender][CENTER] Ознакомиться с правилами подачи жалоб на [COLOR=#FFD700]игроков[/color] можно [/COLOR][URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/'][Color=#ff0000][U]*тут*[/U][/color][/URL].[/SIZE][/FONT][/CENTER][/B]<br><br>" +
		"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
 "[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Нужна видеофиксация',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]В таких случаях нужна видеофиксация нарушения.[/SIZE][/FONT][/CENTER]<br><br>" +
        "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]  Ознакомиться с правилами подачи жалоб на [COLOR=#FFD700]игроков[/color] можно [/COLOR][URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/'][Color=#ff0000][U]*тут*[/U][/color][/URL].[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>" +
	"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
	 "[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Нету /time',
	  content:
        "[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		" [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]На ваших доказательствах [color=#ff0000]отсутствует /time[/color][/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
		"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender] Ознакомиться с правилами подачи жалоб на [COLOR=#FFD700]игроков[/color] можно [/COLOR][URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/'][Color=#ff0000][U]*тут*[/U][/color][/URL].[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>" +
	"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
	 "[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Доква в соц сетях',
      content:
        "[B][CENTER][FONT=georgia][COLOR=MediumPurple]{{greeting}},уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Доказательства в социальных сетях и т.д. не принимаются, загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее[/COLOR][/SIZE][/FONT]<br>" +
        '[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован[/COLOR][/SIZE][/FONT][/CENTER]<br><br>' +
        "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]  Ознакомиться с правилами подачи жалоб на игроков можно [/COLOR][URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/'][Color=#ff0000][U]*тут*[/U][/color][/URL].[/COLOR][/SIZE][/FONT]<br><br>" +
   "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
   "[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
	{
	  title: 'Доква отредактированы',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Ваши доказательства отредактированы, создайте жалобу с первоначальными доказательствами[/COLOR][/SIZE][/FONT]<br><br>" +
	"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
	 "[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
	{
      title: 'Недостаточно доказательств',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][color=#ff0000]Недостаточно доказательств[/color] на нарушение от данного игрока[/COLOR][/SIZE][/FONT]<br>" +
		'[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][color=#ff0000]Доказательства[/color] должны быть предоставлены в хорошем качестве и [COLOR=#ff0000]с полным процессом сделки или нарушения от какого-либо игрока[/color].[/SIZE][/FONT]<br><br>' +
	"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
	 "[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
 {
	  title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Рп биографии ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
	},
     {
      title: 'Одобрено',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Ваша [COLOR=#00bfff]RolePlay Биография[/color] получает статус[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>" +
		 "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Отказано',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        " [FONT=georgia] [B][CENTER]Ваша [COLOR=#00bfff]RolePlay Биография[/color] получает статус<br><br>" +
 "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
	 "[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
     title: 'Возраст не совпадает',
      content:
		'[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>' +
        "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Ваша [COLOR=#00bfff]RolePlay Биография[/color] получает статус: [Color=#ff0000]Отказано.[/color][/SIZE][/FONT][/CENTER][/B]<br>"+
       "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][color=#ff0000]Причина[/color]: [color=#ff0000]Возраст не совпадает с датой рождения[/color].[/SIZE][/FONT][/CENTER][/B]<br><br>"+
     "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
	 "[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Фамилия или имя в названии отличаются',
      content:
		'[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>' +
        "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Ваша [COLOR=#00bfff]RolePlay Биография[/color] получает статус: [Color=#ff0000]Отказано.[/color][/SIZE][/FONT][/CENTER][/B]<br>"+
"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][color=#ff0000]Причина[/color]: В названии вашей [COLOR=#00bfff]RolePlay Биографии[/color] и в пункте [Color=#ff0000]1 различаются имя/фамилия[/color].[/SIZE][/FONT][/CENTER][/B]<br><br>"+
 "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
	 "[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
{
      title: 'био отказ(18 лет)',
      content:
        '[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>' +
        "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Ваша [COLOR=#00bfff]RolePlay Биография[/color] получает статус: [Color=#ff0000]Отказано.[/color][/SIZE][/FONT][/CENTER][/B]<br>"+
 "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][Color=#ff0000]Причина отказа[/color]: минимальный возраст для составления [Color=#ff0000]биографии: 18 лет[/color].[/CENTER][/SIZE][/FONT][/B]<br><br>"+
"[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
	 "[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
    prefix: UNACCСEPT_PREFIX,
    status: false,
},
     {
      title: 'Не по форме',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Ваша [COLOR=#00bfff]RolePlay Биография[/color] получает статус: Отказано, так как составлено [color=#ff0000]не по форме[/color].[/CENTER][/SIZE][/FONT][/B]<br><br>" +
		 "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
	 "[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
	  prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'От 2-го или 3-го лица',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Ваша [COLOR=#00bfff]RolePlay Биография[/color] получает статус: [color=#ff0000]Отказано[/color][/CENTER][/SIZE][/FONT][/B]<br>" +
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][color=#ff0000]Причиной[/color] послужило написание [COLOR=#00bfff]RolePlay Биографии[/color] [COLOR=#]от 2-го или 3-го лица[/color].[/CENTER][/SIZE][/FONT][/B]<br><BR>"+
		 "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
	 "[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
	  prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Копипаст',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Ваша [COLOR=#00bfff]RolePlay Биография[/color] получает статус: [color=#ff0000]Отказано[/color].[/CENTER][/SIZE][/FONT][/B]<br>"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][color=#ff0000]Причиной[/color] послужило [color=#ff0000]копирование текста[/color].[/CENTER][/SIZE][/FONT][/B]<br><br>"+
		 "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
	 "[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
	  prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Дублирование',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Ваша [COLOR=#00bfff]RolePlay Биография[/color] получает статус: [color=#ff0000]Отказано[/color].[/CENTER][/SIZE][/FONT][/B]<br>" +
		"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][color=#ff0000]Причиной[/color] послужило дублирование [COLOR=#00bfff]RolePlay Биографии[/color].[/CENTER][/SIZE][/FONT][/B]<br><br>"+
 "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
	 "[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
	  prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Ошибки в словах',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Ваша [COLOR=#00bfff]RolePlay Биография[/color] получает статус: [color=#ff0000]Отказано[/color].[/CENTER][/SIZE][/FONT][/B]<br>" +
"[B][FONT=georgia][SIZE=4][COLOR=lavender][CENTER][color=#ff0000]Причиной[/color] послужило написание [COLOR=#00bfff]RolePlay Биографии[/color] [color=#ff0000]с грамматическими / орфографическими ошибками[/color].[/CENTER][/SIZE][/FONT][/B]<br><br>"+
 "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
	 "[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
	  prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Заговолок',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Ваша [COLOR=#00bfff]RolePlay Биография[/color] получает статус: [color=#ff0000]Отказано[/color].[/CENTER][/SIZE][/FONT][/B]<br>" +
	"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][color=#ff0000]Причиной[/color] послужило написание [color=#ff0000]заговолка[/color] [COLOR=#00bfff]RolePlay Биографии[/color] [color=#ff0000]не по форме[/color].[/CENTER][/SIZE][/FONT][/B]<br><br>" +
 "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
	 "[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
		prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Нету имени родных',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Ваша [COLOR=#00bfff]RolePlay Биография[/color] получает статус: [color=#ff0000]Отказано[/color].[/CENTER][/SIZE][/FONT][/B]<br>" +
		"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][color=#ff0000]Причиной[/color] послужило то, что вы [color=#ff0000]не написали имя родителей и тд[/color].[/CENTER][/SIZE][/FONT][/B]<br><br>" +
 "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
	 "[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
	  prefix: UNACCСEPT_PREFIX,
	  status: false,
    },

	 {
      title: 'Мало текста',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Ваша [COLOR=#00bfff]RolePlay Биография[/color] получает статус: [color=#ff0000]Отказано[/color].[/CENTER][/SIZE][/FONT][/B]<br>"+
"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][color=#ff0000]Причиной[/color] послужило то, что Вы написали мало текста в своей РП Биографии.[/CENTER][/SIZE][/FONT][/B]<br><br>" +
 "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
	 "[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
		prefix: UNACCСEPT_PREFIX,
	  status: false,
    },

	 {
	  title: '-----  РП Ситуации  -------------------------------------------------------------------------------------------------------------------------------------',
	},
	 {
      title: 'Одобрено',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Ваша [COLOR=#00bfff]RolePlay Ситуация[/color] получает статус:[/CENTER][/SIZE][/FONT][/B]<br>" +
 "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Отказано',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Ваша [COLOR=#00bfff]RolePlay Ситуация[/color] получает статус: [color=#ff0000]Отказано[/color].[/CENTER][/SIZE][/FONT][/B]<br>" +
		"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][color=#ff0000]Причиной[/color] могло послужить любое [color=#ff0000]нарушение Правил Написания[/color] [COLOR=#00bfff]RolePlay Ситуации[/color].[/CENTER][/SIZE][/FONT][/B]<br><br>"+
 "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
	 "[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Дублирование',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Ваша [COLOR=#00bfff]RolePlay Ситуация[/color] получает статус: [color=#ff0000]Отказано[/color].[/CENTER][/SIZE][/FONT][/B]<br>" +
		"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][color=#ff0000]Причиной[/color] послужило [color=#ff0000]дублирование темы[/color].[/CENTER][/SIZE][/FONT][/B]<br><br>" +
 "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
	 "[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
	 {
	  title: '-----  РП Организации  -------------------------------------------------------------------------------------------------------------------------------',
	},
	 {
      title: 'Одобрено',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Ваша [COLOR=#00bfff]Неофициальная RolePlay Организация[/color] получает статус:[/SIZE][/FONT][/CENTER][/B]<br>" +
  "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
              "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Отказано',
      content:
		"[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Ваша [COLOR=#00bfff]Неофициальная RolePlay Организация[/color] получает статус: [color=#ff0000]Отказано[/color].[/CENTER][/SIZE][/FONT][/B]<br>" +
"[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender][COLOR=#ff0000]Причиной[/color] могло послужить любое [color=#ff0000]нарушение Правил Подачи Заявления[/color] на [COLOR=#00bfff]Неофициальную RolePlay Организацию[/color].[/CENTER][/SIZE][/FONT][/B]<br><br>" +
 "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]"+
	 "[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
];

    $(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('🍺 На рассмотрении 🍺', 'pin');
	addButton('🍺 Отказано 🍺', 'unaccept');
	addButton('🍺 Одобрено 🍺', 'accepted');
	addButton('🍺 Теху 🍺', 'Texy');
    addButton('🍺 Закрыто 🍺', 'Zakrito');
    addButton('🍺 Ожидание 🍺', 'Ojidanie');
 	addButton('🍺 Ответы 🍺', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PINN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, false));
    $('button#Texy').click(() => editThreadData(TEXY_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(UNACCСEPT_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(UNACCСEPT_PREFIX, false));
    $('button#Realizovano').click(() => editThreadData(REALIZOVANO_PREFIX, false));
    $('button#Vajno').click(() => editThreadData(VAJNO_PREFIX, false));
    $('button#Rassmotreno').click(() => editThreadData(RASSMOTRENO_PREFIX, false));
    $('button#Ojidanie').click(() => editThreadData(OJIDANIE_PREFIX, false));
    $('button#Prefiks').click(() => editThreadData(PREFIKS, false));



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
	})();
(function() {
    'use strict';

    // Your code here...
})();