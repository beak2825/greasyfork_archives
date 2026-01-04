// ==UserScript==
// @name         Жалобы/Обжалования
// @namespace    https://forum.blackrussia.online
// @version      7.7
// @description  by Chip Opperskiy
// @author       Chip Opperskiy
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://cdn.icon-icons.com/icons2/2000/PNG/64/angry_pissed_scream_icon_123397.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481615/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/481615/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F.meta.js
// ==/UserScript==
 
(async function () {
    `use strict`;
    const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
    const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
    const PIN_PREFIX = 2; // Prefix that will be set when thread pins
    const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
    const WATCHED_PREFIX = 9;
    const CLOSE_PREFIX = 7;
    const SPECIAL_PREFIX = 11;
    const GA_PREFIX = 12;
     const TECH_PREFIX = 13;
    const data = await getThreadData(),
        greeting = data.greeting,
        user = data.user;
    const buttons = [
        
{
            title: `Приветствие`,
            content:
                `[CENTER][B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>` +
`[COLOR=rgb(0, 255, 255)][SIZE=4][FONT=book antiqua][ICODE]Приветствую, уважаемый(ая) ${user.mention}[/ICODE][/FONT][/SIZE][/COLOR]<br><br>`+
            
                `[CENTER][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua]                                 [/CENTER][/FONT][/SIZE]<br><br>`+
            
                 `[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua] Приятной игры и времяпровождение  на сервере «AQUA»[/COLOR][/FONT][/SIZE]<br><br>`+
`[B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]`,
        },
        {
        title: '----------  Жалоба на адм  ------------------------------------------------------------------------------------------------------------------------',
        },
         {
 
            title: `Нету нарушение`,
            content:
`[CENTER][B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>` +
`[COLOR=rgb(0, 255, 255)][SIZE=4][FONT=book antiqua][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }}.[/ICODE][/FONT][/SIZE][/COLOR]<br><br>`+
 
`[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua]Нарушений со стороны администратора - не имеется![/FONT][/SIZE][/COLOR]<br><br>`+
`[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]Закрыто.[/COLOR][SIZE=4][FONT=book antiqua] <br><br>`+
 
`[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua] Приятной игры и времяпровождение  на сервере «AQUA»[/COLOR]<br><br>`+
`[B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
	},
{
        title: ` 48 часов `,
        content: `[CENTER][B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>` +
`[COLOR=rgb(0, 255, 255)][SIZE=4][FONT=book antiqua][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }}.[/ICODE][/FONT][/SIZE][/COLOR]<br><br>`+
    
       "[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua] С момента выдачи наказание прошло более 48-ми часов, жалоба не подлежит рассмотрению.<br><br>"+
        `[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]Закрыто.[/FONT][SIZE=4][FONT=book antiqua] <br><br>`+
 
`[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua] Приятной игры и времяпровождение  на сервере «AQUA»[/COLOR]<br><br>`+
`[B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
     {
	  title: `ЖБ от 3 лица`,
	  content:
		`[CENTER][B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>` +
`[COLOR=rgb(0, 255, 255)][SIZE=4][FONT=book antiqua][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }}.[/ICODE][/FONT][/SIZE][/COLOR]<br><br>`+
    
		"[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua][CENTER]Жалоба создана от третьего лица.[/CENTER]<br><br>" +
		`[CENTER]Жалоба не подлежит рассмотрению.<br><br>`+
         
 `[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua] Приятной игры и времяпровождение  на сервере «AQUA»[/COLOR]<br><br>`+
`[B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: `Отправить на рассмотрение`,
	  content:
		`[CENTER][B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>` +
`[COLOR=rgb(0, 255, 255)][SIZE=4][FONT=book antiqua][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }}.[/ICODE][/FONT][/SIZE][/COLOR]<br><br>`+
    
		"[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua][CENTER]Ваша жалоба взята на рассмотрение. Ожидайте, пожалуйста, ответа от администрации и не нужно создавать копии этой темы.[/CENTER]<br><br>" +
		`[COLOR=rgb(255, 255, 0)][ICODE]На рассмотрении.[/ICODE][/CENTER]<br><br>`+
         
`[CENTER][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua] Приятной игры и времяпровождение  на сервере «AQUA»[/COLOR]<br><br>`+
`[B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]`,
	     prefix: PIN_PREFIX,
	     status: true,
	       },
           {
            title: `Недостаточно док-вы`,
            content:
`[CENTER][B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>` +
`[COLOR=rgb(0, 255, 255)][SIZE=4][FONT=book antiqua][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }}.[/ICODE][/FONT][/SIZE][/COLOR]<br><br>`+
               
                `[CENTER][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua] Недостаточно доказательств, которые потверждают нарушение администратора.<br>`+
`[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]Закрыто.[/FONT][SIZE=4][FONT=book antiqua] <br><br>`+
 
`[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua]Приятной игры и времяпровождение  на сервере «AQUA»[/COLOR]<br><br>`+
`[B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]`,
 
            prefix: UNACCEPT_PREFIX,
            status: false,
           },
           {
            title: `Нету док-вы`,
            content: `[CENTER][B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>` +
`[COLOR=rgb(0, 255, 255)][SIZE=4][FONT=book antiqua][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }}.[/ICODE][/FONT][/SIZE][/COLOR]<br><br>`+
               
            `[CENTER] [COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua]Пожалуйста, прикрепите доказательства к жалобе, которые подтверждают нарушение администратора.<br>`+
`[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]Закрыто.[/FONT][SIZE=4][FONT=book antiqua] <br><br>`+
 
`[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua] Приятной игры и времяпровождение  на сервере «AQUA»[/COLOR]<br><br>`+
`[B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status:false,
           },
           {
            title: `Правила раздела`,
            content:`[CENTER][B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>` +
`[COLOR=rgb(0, 255, 255)][SIZE=4][FONT=book antiqua][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }}.[/ICODE][/FONT][/SIZE][/COLOR]<br><br>`+
               
            `[CENTER][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua]Пожалуйста, убедительная просьба, ознакомится с назначением данного раздела в котором Вы создали тему, так как ваш запрос никоим образом не относится к предназначению данного раздела.[/CENTER]`+
		    `[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]Закрыто.[/FONT][SIZE=4][FONT=book antiqua] <br><br>`+
 
`[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua] Приятной игры и времяпровождение  на сервере «AQUA»[/COLOR]<br><br>`+
`[B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status:false,
           },
            {
            title: `Окно бана`,
            content: `[CENTER][B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>` +
`[COLOR=rgb(0, 255, 255)][SIZE=4][FONT=book antiqua][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }}.[/ICODE][/FONT][/SIZE][/COLOR]<br><br>`+
               
            `[CENTER][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua]Зайдите в игру и сделайте скрин окна с баном после чего, заново напишите жалобу.<br>`+
                `[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]Закрыто.[/FONT][SIZE=4][FONT=book antiqua] <br><br>`+
            `[SIZE=5][FONT=georgia]Пример: [URL='https://yapx.ru/v/PnPvS'](Кликабельно)[/URL][/FONT][/SIZE]<br><br>`+
 
`[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua] Приятной игры и времяпровождение  на сервере «AQUA»[/COLOR]<br><br>`+
`[B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status:false,
        },
        {
	  title: `наказание будет снято`,
	  content:
`[CENTER][B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>` +
`[COLOR=rgb(0, 255, 255)][SIZE=4][FONT=book antiqua][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }}.[/ICODE][/FONT][/SIZE][/COLOR]<br><br>`+
            
               		"[CENTER][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua]Ваша жалоба была [COLOR=rgb(0, 255, 0)]одобрена [/COLOR]и будет проведена беседа с администратором. Ваше наказание будет [COLOR=rgb(0, 255, 0)]снято[/COLOR].[/CENTER]<br>" +
 
`[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua] Приятной игры и времяпровождение  на сервере «AQUA»[/COLOR]<br><br>`+
`[B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]`,
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
{
	  title: `Наказание адм`,
	  content:
`[CENTER][B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>` +
`[COLOR=rgb(0, 255, 255)][SIZE=4][FONT=book antiqua][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }}.[/ICODE][/FONT][/SIZE][/COLOR]<br><br>`+
    
               		"[CENTER][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua]Ваша жалоба была [COLOR=rgb(0, 255, 0)]одобрена [/COLOR]. Администратор получит наказание.<br>" +
    
                 `[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua] Приятной игры и времяпровождение  на сервере «AQUA»[/COLOR]<br><br>`+
`[B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]`,
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	    {
	  title: `Беседа`,
	  content:
`[CENTER][B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>` +
`[COLOR=rgb(0, 255, 255)][SIZE=4][FONT=book antiqua][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }}.[/ICODE][/FONT][/SIZE][/COLOR]<br><br>`+
    
               		"[CENTER][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua]Ваша жалоба была [COLOR=rgb(0, 255, 0)] одобрена [/COLOR] и будет проведена беседа с администратором.<br>" +
    
                 `[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua] Приятной игры и времяпровождение  на сервере «AQUA»[/COLOR]<br><br>`+
`[B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]`,
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
{
	  title: `Админ прав`,
	  content:
`[CENTER][B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>` +
`[COLOR=rgb(0, 255, 255)][SIZE=4][FONT=book antiqua][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }}.[/ICODE][/FONT][/SIZE][/COLOR]<br><br>`+
    
               		"[CENTER][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua]Проверив доказательства администратора, было принято решение, что наказание выдано верно.[/CENTER]<br><br>" +
		`[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]Закрыто.[/FONT][SIZE=4][FONT=book antiqua] <br><br>`+
 
`[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua] Приятной игры и времяпровождение  на сервере «AQUA»[/COLOR]<br><br>`+
`[B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
{
	  title: `адм будет снят`,
	  content:
`[CENTER][B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>` +
`[COLOR=rgb(0, 255, 255)][SIZE=4][FONT=book antiqua][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }}.[/ICODE][/FONT][/SIZE][/COLOR]<br><br>`+
    
               		"[CENTER][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua]Ваша жалоба была [COLOR=rgb(0, 255, 0)]одобрена[/COLOR], администратор будет [COLOR=rgb(255, 0, 0)]снят[/COLOR].<br>" +
 
`[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua] Приятной игры и времяпровождение  на сервере «AQUA»[/COLOR]<br><br>`+
`[B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]`,
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
{
	  title: `Жалоба не по форме`,
	  content:
`[CENTER][B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>` +
`[COLOR=rgb(0, 255, 255)][SIZE=4][FONT=book antiqua][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }}.[/ICODE][/FONT][/SIZE][/COLOR]<br><br>`+
    
               		"[CENTER][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua]Жалоба составлена не по форме. Внимательно прочитайте правила составления жалобы. <br><br>" +
		`[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]Закрыто.[/FONT][SIZE=4][FONT=book antiqua] <br><br>`+
 
`[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua]Приятной игры и времяпровождение  на сервере «AQUA»[/COLOR]<br><br>`+
`[B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
{
            title: `В раздел обж`,
     content:
`[CENTER][B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>` +
`[COLOR=rgb(0, 255, 255)][SIZE=4][FONT=book antiqua][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }}.[/ICODE][/FONT][/SIZE][/COLOR]<br><br>`+
    
                           `[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua][CENTER]Пожалуйста обратитесь в раздел - [URL='https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.845/']Обжалование (кликабельно)[/URL]<br>`+
            		`[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]Закрыто.[/FONT][SIZE=4][FONT=book antiqua] <br><br>`+
 
`[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua] Приятной игры и времяпровождение  на сервере «AQUA»[/COLOR]<br><br>`+
`[B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
 
 
 
 
 
 
        {
        title: '----------  обж и жб ------------------------------------------------------------------------------------------------------------------------',
        },
{
        title: `Опра в соц.сети`,
     content:
`[CENTER][B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>` +
`[COLOR=rgb(0, 255, 255)][SIZE=4][FONT=book antiqua][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }}.[/ICODE][/FONT][/SIZE][/COLOR]<br><br>`+
    
                       "[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua]Пожалуйста внимательно прочитайте тему «[URL=`https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.193316/`]Правила подачи жалоб на администрацию[/URL][SIZE=5][B]»<br><br>"+
        "[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua]И обратите своё внимание, на данный пункт правил —[/B][/SIZE][/FONT][/SIZE][SIZE=4][FONT=georgia][QUOTE]3.6. Прикрепление доказательств обязательно.Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/QUOTE][/FONT][QUOTE][/quote][/SIZE][QUOTE][/QUOTE]"+
        `[SIZE=4][FONT=georgia]Отказано,[S] [/S][/FONT][COLOR=rgb(255, 0, 0)][FONT=georgia][S]закрыто[/S][/FONT][/COLOR][FONT=georgia][S].[/S][/FONT][/SIZE]<br><br>`+
 
    `[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua] Приятной игры и времяпровождение  на сервере «AQUA»[/COLOR]<br><br>`+
    `[B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]`,
 
        prefix: UNACCEPT_PREFIX,
        status: false,
 
    },
{
	  title: `Передано спец.адм`,
	  content:
`[CENTER][B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>` +
`[COLOR=rgb(0, 255, 255)][SIZE=4][FONT=book antiqua][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }}.[/ICODE][/FONT][/SIZE][/COLOR]<br><br>`+
    
		"[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua][CENTER]Ваше обжалование передано специальной администрации.[/CENTER]<br>" +
		"[CENTER][COLOR=rgb(255, 255, 0)][ICODE]На рассмотрении.[/ICODE][/COLOR]<br>" +
    
    `[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua] Приятной игры и времяпровождение  на сервере «AQUA»[/COLOR]<br><br>`+
    `[B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]`,
    prefix: SPECIAL_PREFIX,
	  status: true,
	},
{
	  title: `Передано ГА`,
	  content:
`[CENTER][B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>` +
`[COLOR=rgb(0, 255, 255)][SIZE=4][FONT=book antiqua][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }}.[/ICODE][/FONT][/SIZE][/COLOR]<br><br>`+
    
		"[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua][CENTER]Ваша жалоба/обжалование передана/передано Главному Администратору  <br><br>"+
        "[CENTER][COLOR=rgb(255, 255, 0)][ICODE]На рассмотрении.[/ICODE][/COLOR]<br>" +
    
    `[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua] Приятной игры и времяпровождение  на сервере «AQUA»[/COLOR]<br><br>`+
    `[B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]`,
	  prefix: GA_PREFIX,
	  status: true,
	},
 {
            title: `Дубль`,
     content:
`[CENTER][B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>` +
`[COLOR=rgb(0, 255, 255)][SIZE=4][FONT=book antiqua][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }}.[/ICODE][/FONT][/SIZE][/COLOR]<br><br>`+
    
            `[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua][CENTER]Вам уже был дан ответ, просьба прекратить дублировать темы, иначе вам будет выдана блокировка ФА.[/CENTER]<br>` +
		    `[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR]<br>` +
     
    `[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua] Приятной игры и времяпровождение  на сервере «AQUA»[/COLOR]<br><br>`+
    `[B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]`,
 
            prefix: CLOSE_PREFIX,
            status:false,
        },
{
            title: `Доква отредактированы`,
            content:`[CENTER][B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>` +
`[COLOR=rgb(0, 255, 255)][SIZE=4][FONT=book antiqua][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }}.[/ICODE][/FONT][/SIZE][/COLOR]<br><br>`+
    
 
            `[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua][CENTER]Для рассмотрения жалобы вам необходимо предоставить полные доказательства без каких-либо признаков редактирования.[/CENTER]<br>` +
		    `[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR]<br>` +
    
    `[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua] Приятной игры и времяпровождение  на сервере «AQUA»[/COLOR]<br><br>`+
    `[B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]`,
 
            prefix: CLOSE_PREFIX,
            status:false,
        },
{
            title: `Нерабочая ссылка`,
            content:`[CENTER][B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>` +
`[COLOR=rgb(0, 255, 255)][SIZE=4][FONT=book antiqua][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }}.[/ICODE][/FONT][/SIZE][/COLOR]<br><br>`+
    
 
            `[CENTER][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua]Вы предоставили нерабочую ссылку.[/CENTER]<br>` +
		     `[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR]<br>` +
    
    `[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua] Приятной игры и времяпровождение  на сервере «AQUA»[/COLOR]<br><br>`+
    `[B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]`,
            prefix: CLOSE_PREFIX,
            status:false,
        },
   {
            title: `Не тот сервер`,
            content:`[CENTER][B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>` +
`[COLOR=rgb(0, 255, 255)][SIZE=4][FONT=book antiqua][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }}.[/ICODE][/FONT][/SIZE][/COLOR]<br><br>`+
    
 
            `[CENTER][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua]Вам необходимо оставить обращение в соответствующем разделе для вашего сервера.[/CENTER]<br>` +
		     `[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR]<br>` +
    
    `[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua] Приятной игры и времяпровождение  на сервере «AQUA»[/COLOR]<br><br>`+
    `[B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]`,
            prefix: CLOSE_PREFIX,
            status:false,
        },
{
	  title: `бан айпи`,
	  content:
`[CENTER][B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>` +
`[COLOR=rgb(0, 255, 255)][SIZE=4][FONT=book antiqua][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }}.[/ICODE][/FONT][/SIZE][/COLOR]<br><br>`+
    
		"[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua][CENTER]Попробуйте перезагрузить роутер или телефон  <br><br>"+
        `Проблема должна пропасть. <br><br>`+
    
    `[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua] Приятной игры и времяпровождение  на сервере «AQUA»[/COLOR]<br><br>`+
    `[B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: true,
	},
{
	  title: `Технический специалист`,
	  content:
`[CENTER][B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>` +
`[COLOR=rgb(0, 255, 255)][SIZE=4][FONT=book antiqua][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }}.[/ICODE][/FONT][/SIZE][/COLOR]<br><br>`+
    
		"[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua][CENTER]Данный администратор является или являлся техническим специалистом, поэтому вам необходимо обратиться в раздел жалоб на технических специалистов.[/CENTER]<br>" +
		`[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR]<br>` +
    
    `[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua] Приятной игры и времяпровождение  на сервере «AQUA»[/COLOR]<br><br>`+
    `[B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
{
	  title: `Технический раздел`,
	  content:
`[CENTER][B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>` +
`[COLOR=rgb(0, 255, 255)][SIZE=4][FONT=book antiqua][ICODE]Доброго времени суток, уважаемый(-ая) {{ user.name }}.[/ICODE][/FONT][/SIZE][/COLOR]<br><br>`+
    
		"[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua][CENTER]В вашем случае необходимо обратиться в технический раздел.[/CENTER]<br>" +
	`[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR]<br>` +
    
    `[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua] Приятной игры и времяпровождение  на сервере «AQUA»[/COLOR]<br><br>`+
    `[B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]`,
 
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
 
 
{
        title: '---------- обжалования  ------------------------------------------------------------------------------------------------------------------------',
        },
{
	  title: `В обжаловании отказано`,
	  content:
`[CENTER][B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>` +
`[COLOR=rgb(0, 255, 255)][SIZE=4][FONT=book antiqua][ICODE]Приветствую, уважаемый(ая) ${user.mention}[/ICODE][/FONT][/SIZE][/COLOR]<br><br>`+
    
		"[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua][CENTER]К сожалению, на данный момент вам отказано в обжаловании.[/CENTER]<br>" +
`[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR]<br>` +
    
    `[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua] Приятной игры и времяпровождение  на сервере «AQUA»[/COLOR]<br><br>`+
    `[B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]`,
    prefix: CLOSE_PREFIX,
	  status: false,
	},
{
	  title: `Наказание будет снято`,
	  content:
`[CENTER][B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>` +
`[COLOR=rgb(0, 255, 255)][SIZE=4][FONT=book antiqua][ICODE]Приветствую, уважаемый(ая) ${user.mention}[/ICODE][/FONT][/SIZE][/COLOR]<br><br>`+
    
		"[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua][CENTER]Наказание будет снято, впредь не совершайте подобных ошибок.[/CENTER]<br>" +
		`[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR]<br>` +
    
    `[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua] Приятной игры и времяпровождение  на сервере «AQUA»[/COLOR]<br><br>`+
    `[B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
{
	  title: `Наказание будет смягчено`,
	  content:
`[CENTER][B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>` +
`[COLOR=rgb(0, 255, 255)][SIZE=4][FONT=book antiqua][ICODE]Приветствую, уважаемый(ая) ${user.mention}[/ICODE][/FONT][/SIZE][/COLOR]<br><br>`+
    
		"[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua][CENTER]Ваше наказание будет смягчено, впредь не совершайте подобных ошибок.[/CENTER]<br>" +
`[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR]<br>` +
    
    `[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua] Приятной игры и времяпровождение  на сервере «AQUA»[/COLOR]<br><br>`+
    `[B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]`,
    prefix: CLOSE_PREFIX,
	  status: false,
	},
{
	  title: `Наказание не подлежит обжалованию`,
	  content:
`[CENTER][B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>` +
`[COLOR=rgb(0, 255, 255)][SIZE=4][FONT=book antiqua][ICODE]Приветствую, уважаемый(ая) ${user.mention}[/ICODE][/FONT][/SIZE][/COLOR]<br><br>`+
    
		"[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua][CENTER]Подобные наказания, как в вашем случае, в соответствии с правилами не подлежат обжалованию.[/CENTER]<br>" +
`[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR]<br>` +
    
    `[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua] Приятной игры и времяпровождение  на сервере «AQUA»[/COLOR]<br><br>`+
    `[B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]`,	
    prefix: CLOSE_PREFIX,
	  status: false,
	},
{
	  title: `Обжалование нонрп обман`,
	  content:
`[CENTER][B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>` +
`[COLOR=rgb(0, 255, 255)][SIZE=4][FONT=book antiqua][ICODE]Приветствую, уважаемый(ая) ${user.mention}[/ICODE][/FONT][/SIZE][/COLOR]<br><br>`+
    
		"[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua][CENTER]На вашем аккаунте находится имущество, полученное нечестным путем. Замена наказания возможна лишь в том случае, если вы свяжетесь с игроком с предложением о возврате, он оставит сообщение с согласием у вас в профиле на форуме и будет совершена сделка по возврату имущества.[/CENTER]<br>" +
`[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR]<br>` +
    
    `[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua] Приятной игры и времяпровождение  на сервере «AQUA»[/COLOR]<br><br>`+
    `[B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]`,	
    prefix: CLOSE_PREFIX,
	  status: false,
	},
{
	  title: `На рассмотрении`,
	  content:
`[CENTER][B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>` +
`[COLOR=rgb(0, 255, 255)][SIZE=4][FONT=book antiqua][ICODE]Приветствую, уважаемый(ая) ${user.mention}[/ICODE][/FONT][/SIZE][/COLOR]<br><br>`+
    
		"[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua][CENTER]Ваше обжалование взято на рассмотрение, просьба не дублировать данную тему.[/CENTER]<br>" +
		`[CENTER][COLOR=rgb(255, 255, 0)][ICODE]На рассмотрении.[/ICODE][/COLOR]<br>` +
    
    `[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua] Приятной игры и времяпровождение  на сервере «AQUA»[/COLOR]<br><br>`+
    `[B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]`,
	  prefix: PIN_PREFIX,
	  status: true,
	},
{
	  title: `Отправить в ЖБ на адм`,
	  content:
`[CENTER][B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>` +
`[COLOR=rgb(0, 255, 255)][SIZE=4][FONT=book antiqua][ICODE]Приветствую, уважаемый(ая) ${user.mention}[/ICODE][/FONT][/SIZE][/COLOR]<br><br>`+
    
		"[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua][CENTER]Если вы не согласны с выданным наказанием, то вам необходимо обратиться в раздел жалоб на администрацию.[/CENTER]<br>" +
		`[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR]<br>` +
    
    `[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua] Приятной игры и времяпровождение  на сервере «AQUA»[/COLOR]<br><br>`+
    `[B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
{
            title: `Не по теме/бред`,
            content:
`[CENTER][B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>` +
`[COLOR=rgb(0, 255, 255)][SIZE=4][FONT=book antiqua][ICODE]Приветствую, уважаемый(ая) ${user.mention}[/ICODE][/FONT][/SIZE][/COLOR]<br><br>`+
    
            `[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua][CENTER]Содержание вашей темы не соответствует назначению данного раздела.[/CENTER]<br>` +
		    `[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR]<br>` +
    
    `[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua] Приятной игры и времяпровождение  на сервере «AQUA»[/COLOR]<br><br>`+
    `[B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]`,
            prefix: CLOSE_PREFIX,
            status:false,
        },
{
	  title: `Нет окна бана`,
	  content:
`[CENTER][B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>` +
`[COLOR=rgb(0, 255, 255)][SIZE=4][FONT=book antiqua][ICODE]Приветствую, уважаемый(ая) ${user.mention}[/ICODE][/FONT][/SIZE][/COLOR]<br><br>`+
    
		"[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua][CENTER]В качестве доказательства блокировки аккаунта предоставляется окно при входе в игру.[/CENTER]<br>" +
`[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR]<br>` +
    
    `[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua] Приятной игры и времяпровождение  на сервере «AQUA»[/COLOR]<br><br>`+
    `[B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]`,
    prefix: CLOSE_PREFIX,
	  status: false,
	},
{
	  title: `Обжалование не по форме`,
	  content:
`[CENTER][B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>` +
`[COLOR=rgb(0, 255, 255)][SIZE=4][FONT=book antiqua][ICODE]Приветствую, уважаемый(ая) ${user.mention}[/ICODE][/FONT][/SIZE][/COLOR]<br><br>`+
    
		"[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua][CENTER]Ваше обжалование создано с нарушнием правил подачи. Ознакомиться с правилами можно в закрепленной теме.[/CENTER]<br>" +
		`[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR]<br>` +
    
    `[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua] Приятной игры и времяпровождение  на сервере «AQUA»[/COLOR]<br><br>`+
    `[B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
{
	  title: `NRP обман одобрено`,
	  content:
`[CENTER][B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>` +
`[COLOR=rgb(0, 255, 255)][SIZE=4][FONT=book antiqua][ICODE]Приветствую, уважаемый(ая) ${user.mention}[/ICODE][/FONT][/SIZE][/COLOR]<br><br>`+
    
		"[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua][CENTER]Ваш аккаунт разблокирован, вы должны совершить сделку с игроком в течение 48-ми часов и приложить ссылку на фрапс в данную жалобу. Если вы этого не сделаете, аккаунт вновь будет заблокирован без возможности обжалования.[/CENTER]<br>" +
		`[CENTER][COLOR=rgb(255, 255, 0)][ICODE]На рассмотрении.[/ICODE][/COLOR]<br>`+
    
    `[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua] Приятной игры и времяпровождение  на сервере «AQUA»[/COLOR]<br><br>`+
    `[B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]`,
	  prefix: PIN_PREFIX,
	  status: true,
	},
{
            title: `Отказ ост мало`,
            content:
`[CENTER][B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>` +
`[COLOR=rgb(0, 255, 255)][SIZE=4][FONT=book antiqua][ICODE]Приветствую, уважаемый(ая) ${user.mention}[/ICODE][/FONT][/SIZE][/COLOR]<br><br>`+
    
            `[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua][CENTER]До окончания действия блокировки вашего аккаунта осталось слишком мало времени, подобные случаи не обжалуются.[/CENTER]<br>` +
`[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR]<br>` +
    
    `[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua] Приятной игры и времяпровождение  на сервере «AQUA»[/COLOR]<br><br>`+
    `[B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]`,        
    prefix: CLOSE_PREFIX,
            status:false,
        },
{
            title: `Отсутствует ссылка на ЧС`,
            content:
`[CENTER][B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B]<br>` +
`[COLOR=rgb(0, 255, 255)][SIZE=4][FONT=book antiqua][ICODE]Приветствую, уважаемый(ая) ${user.mention}[/ICODE][/FONT][/SIZE][/COLOR]<br><br>`+
    
            `[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua][CENTER]В вашем обжаловании отсутствует ссылка на сообщение на форуме с информацией о вашем занесении в ЧС.[/CENTER]<br>` +
`[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR]<br>` +
    
    `[COLOR=rgb(255, 255, 255)][SIZE=4][FONT=book antiqua] Приятной игры и времяпровождение  на сервере «AQUA»[/COLOR]<br><br>`+
    `[B][URL='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9pYmIuY28vNTFnUllDcg=='][IMG]https://i.ibb.co/grLRvQS/image.png[/IMG][/URL][/B][/CENTER]`, 
    prefix: CLOSE_PREFIX,
            status:false,
        },
 
	];
 
$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
	// Добавление кнопок при загрузке страницы
	addButton('Меню', 'selectAnswer');
	addButton('Одобрить', 'accepted');
	addButton('Отказать', 'unaccept');
       addButton('Закрыть', 'close');
 
	// Поиск информации о теме
	const threadData = getThreadData();
 
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#close').click(() => editThreadData(CLOSE_PREFIX, false));
 
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