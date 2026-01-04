// ==UserScript==
// @name         ЗГС/ГС
// @namespace   https://forum.blackrussia.online
// @version      0.1
// @description  ZGS/GS
// @author       Dmitriy_Bysaga
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://forum.blackrussia.online/threads/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/507238/%D0%97%D0%93%D0%A1%D0%93%D0%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/507238/%D0%97%D0%93%D0%A1%D0%93%D0%A1.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
    const UNACCEPT_PREFIX = 4; // Префикс "Отказано"
    const ACCEPT_PREFIX = 8; // Префикс "Одобрено"
    const PIN_PREFIX = 2; // Префикс "На рассмотрении"
    const GA_PREFIX = 12; // Префикс "Главному Администратору"
    const WATCHED_PREFIX = 9; // Префикс "Рассмотрено"
    const CLOSE_PREFIX = 7; // Префикс "Закрыто"
    const buttons = [
    {
    title: `------------------------------------------------------>>>>>   Жалобы  на лидеров    <<<<<------------------------------------------------------`,
 },
    {
      title: `Одобрено,
    content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
      '[I][B][CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][I][B]<br>` +
    "[I][B][color=#D1D5D8][FONT=georgia][CENTER]Работа с лидером по жалобе проведена[/CENTER][I][B]<br>" +
    "[B][I][color=#00FF00][FONT=georgia][CENTER] [ICODE]Одобрено, закрыто.[/ICODE][I] [/CENTER][/color][/FONT][B]<br><br>"+
          "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=crimson][/COLOR]",
    Status: false,
},
           {
      title: `Тема будет подкорректирована`,
    content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
    `[I][CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][B]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][I][B]<br>` +
    "[I][B][Color=#D1D5D8][FONT=georgia][CENTER] Тема будет подкорректирована [/CENTER][I][B]<br>" +
    "[I][B][color=#00FF00][FONT=georgia][CENTER] [ICODE]Рассмотрено, закрыто.[/ICODE] [/CENTER][/color][/FONT][I][B]<br><br>"+
                 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=crimson][/COLOR]",
    prefix: WATCHED_PREFIX,
    Status: false,
},
            {
      title: `Спасибо за инфу`,
    content:
   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
    `[I][CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][B]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][I][B]<br>` +
    "[I][B][Color=#E0E0E0][FONT=georgia][CENTER] Благодарим вас за предоставленную информацию. [/CENTER][I][B]<br>" +
    "[I][B][color=#00FF00][FONT=georgia][CENTER] [ICODE]Рассмотрено, закрыто.[/ICODE] [/CENTER][/color][/FONT][I][B]<br><br>"+
                  "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=crimson][/COLOR]",
    prefix: WATCHED_PREFIX,
    Status: false,
},
 
 {
    title: `--------------------------------------------------------->>>>>    На рассмотрение   <<<<<--------------------------------------------------------`,
},
{
    title: `На рассмотрение`,
    content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
`[I][CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][B]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][I][B]<br>` +
    "[I][B][color=#D1D5D8][FONT=georgia][SIZE=4][CENTER] Ваша жалоба взята [color=orange] на рассмотрение [/color], не создавайте копии темы [/color][/CENTER][/FONT][I][B]<br><br>"+
      "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=crimson][/COLOR]",
    prefix: PIN_PREFIX,
    status: false,
},
        {
    title: `Запросил доказательства`,
    content:
   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
`[I][CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][B]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][I][B]<br>` +
    "[I][B][color=#D1D5D8][FONT=georgia][SIZE=4][CENTER] Запросил доказательства у лидера. Просьба не создавать подобных тем. [/color][/CENTER][/FONT][I][B]<br>"+
     "[I][B][color=orange][FONT=georgia][CENTER] [ICODE]На рассмотрении.[/ICODE] [/CENTER][/color][/FONT][I][B]<br><br>"+
              "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=crimson][/COLOR]",
    prefix: PIN_PREFIX,
    status: false,
},
{
    title: `--------------------------------------------------------------->>>>>   Отказано   <<<<<---------------------------------------------------------------`,
},
{
    title: `Не по форме`,
    content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
`[I][CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][B]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][I][B]<br>` +
    "[I][B][color=#D1D5D8][FONT=georgia][SIZE=4][CENTER] Ваша жалоба составлена не по форме. Ознакомиться с формой для подачи жалоб можно тут: [URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-лидеров.1814875/']Правила подачи жалоб на лидеров. [/URL][/color][/CENTER][/FONT][I][B]<br>" +
    "[I][B][color=red][FONT=georgia][CENTER] [ICODE]Отказано, закрыто.[/ICODE] [/CENTER][/color][/FONT]<br><br>"+
      "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=crimson][/COLOR]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
        {
    title: `Через соц сети`,
    content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
`[I][CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][B]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][I][B]<br>` +
    "[I][B][color=#D1D5D8][FONT=georgia][SIZE=4][CENTER] Загрузка доказательств в соц. сети (ВКонтакте, instagram и тд) запрещена. [/color][/CENTER][/FONT][I][B]<br>" +
    "[I][B][color=red][FONT=georgia][CENTER] [ICODE]Отказано, закрыто.[/ICODE] [/CENTER][/color][/FONT][I][B]<br><br>"+
              "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=crimson][/COLOR]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
            {
    title: `Доква отредактированы`,
    content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
`[I][CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][B]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][I][B]<br>` +
    "[I][B][color=#D1D5D8][FONT=georgia][SIZE=4][CENTER] Ваши доказательства отредоктированы. [/color][/CENTER][/FONT][I][B]<br>" +
    "[I][B][color=red][FONT=georgia][CENTER] [ICODE]Отказано, закрыто.[/ICODE] [/CENTER][/color][/FONT][I][B]<br><br>"+
                  "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=crimson][/COLOR]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: `Нарушений со стороны лидера нет`,
    content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
`[I][CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][B]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][I][B]<br>` +
    "[I][B][color=#D1D5D8][FONT=georgia][SIZE=4][CENTER] Нарушений со стороны лидера нет. [/color][/CENTER][/FONT][I][B]<br>" +
    "[I][B][color=red][FONT=georgia][CENTER] [ICODE]Отказано, закрыто.[/ICODE] [/CENTER][/color][/FONT][I][B]<br><br>"+
      "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=crimson][/COLOR]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: `В жалобы на игроков`,
    content:
   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
`[I][CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][B]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][I][B]<br>` +
    "[I][B][color=#D1D5D8][FONT=georgia][SIZE=4][CENTER] Вы ошиблись разделом. Обратитесь в раздел: [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1167/'] Жалобы на игроков. [/URL][/color][/CENTER][/FONT][I][B]<br>" +
    "[I][B][color=red][FONT=georgia][CENTER] [ICODE]Отказано, закрыто.[/ICODE] [/CENTER][/color][/FONT][I][B]<br><br>"+
              "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=crimson][/COLOR]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
         {
    title: `В жалобы на адм`,
    content:
   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
`[I][CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][B]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][I][B]<br>` +
    "[I][B][color=#D1D5D8][FONT=georgia][SIZE=4][CENTER] Вы ошиблись разделом. Обратитесь в раздел: [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1165/'] Жалобы на администрацию.[/URL][/color][/CENTER][/FONT][I][B]<br>" +
    "[I][B][color=red][FONT=georgia][CENTER] [ICODE]Отказано, закрыто.[/ICODE] [/CENTER][/color][/FONT][I][B]<br><br>"+
               "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=crimson][/COLOR]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
         {
    title: `В обжалование наказаний`,
    content:
   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
`[I][CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][B]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][I][B]<br>` +
    "[I][B][color=#D1D5D8][FONT=georgia][SIZE=4][CENTER] Вы ошиблись разделом. Обратитесь в раздел: [URL='https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.1168/'] Обжалование наказаний. [/URL][/color][/CENTER][/FONT][I][B]<br>" +
    "[I][B][color=red][FONT=georgia][CENTER] [ICODE]Отказано,закрыто.[/ICODE] [/CENTER][/color][/FONT][I][B]<br><br>"+
   "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=crimson][/COLOR]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
        {
    title: `В жалобы на Ст. состав`,
    content:
   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
`[I][CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][B]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][I][B]<br>` +
    "[color=#D1D5D8][FONT=georgia][SIZE=4][CENTER] Обратитесь в жалобы на сотродников или в жалобы на старший состав [/color][/CENTER][/FONT][I][B]<br>" +
    "[color=red][FONT=georgia][CENTER] [ICODE]Отказано, закрыто.[/ICODE] [/CENTER][/color][/FONT][I][B]<br><br>"+
              "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=crimson][/COLOR]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: `Повторная жалоба`,
    content:
   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
`[I][CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][B]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][I][B]<br>` +
    "[I][B][color=#D1D5D8][FONT=georgia][SIZE=4][CENTER] Прекратите создавать копии жалобы, иначе ваш форумный аккаунт будет заблокирован [/color][/CENTER][/FONT][I][B]<br>" +
    "[I][B][color=red][FONT=georgia][CENTER] [ICODE]Отказано, закрыто.[/ICODE] [/CENTER][/color][/FONT][I][B]<br><br>"+
                     "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=crimson][/COLOR]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
                   {
    title: `Более 48 часов`,
    content:
   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
`[I][CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][B]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][I][B]<br>` +
    "[I][B][color=#D1D5D8][FONT=georgia][SIZE=4][CENTER] С момента выдачи наказания прошло более 48-и часов. [/color][/CENTER][/FONT][I][B]<br>" +
    "[I][B][color=red][FONT=georgia][CENTER] [ICODE]Отказано, закрыто.[/ICODE] [/CENTER][/color][/FONT][I][B]<br><br>"+
                         "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=crimson][/COLOR]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
              {
    title: `Не работают доква`,
    content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
`[I][CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][B]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][I][B]<br>` +
    "[I][B][color=#D1D5D8][FONT=georgia][SIZE=4][CENTER] Ваши доказательства не рабочие или же в закрытом доступе. [/color][/CENTER][/FONT][I][B]<br>" +
    "[I][B][color=red][FONT=georgia][CENTER][ICODE]Отказано, закрыто.[/ICODE] [/CENTER][/color][/FONT][I][B]<br><br>"+
                    "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=crimson][/COLOR]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
              {
    title: `Нет /time`,
    content:
   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
`[I][CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][B]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][I][B]<br>` +
    "[I][B][color=#D1D5D8][FONT=georgia][SIZE=4][CENTER] На предоставленных доказательствах нет /time. [/color][/CENTER][/FONT][I][B]<br>" +
    "[I][B][color=red][FONT=georgia][CENTER][ICODE]Отказано, закрыто. [/ICODE][/CENTER][/color][/FONT][I][B]<br><br>"+
                    "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=crimson][/COLOR]",
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: `От 3-го лица`,
    content:
   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
`[I][CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][B]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][I][B]<br>` +
    "[I][B][color=#D1D5D8][FONT=georgia][SIZE=4][CENTER] Ваша жалоба написана от 3-го лица. [/color][/CENTER][/FONT][I][B]<br>" +
    "[I][B][color=red][FONT=georgia][CENTER] [ICODE]Отказано, закрыто.[/ICODE] [/CENTER][/color][/FONT][I][B]<br><br>"+
                            "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=crimson][/COLOR]",
     prefix: UNACCEPT_PREFIX,
     status: false,
},
                    {
    title: `Нет докв`,
    content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2yyZ1f9J/1.png[/img][/url][CENTER]'+
`[I][CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][B]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][I][B]<br>` +
    "[I][B][color=#D1D5D8][FONT=georgia][SIZE=4][CENTER] В вашей жалобе нету доказательств. [/color][/CENTER][/FONT][I][B]<br>" +
    "[I][B][color=red][FONT=georgia][CENTER] [ICODE]Отказано, закрыто.[/ICODE] [/CENTER][/color][/FONT][I][B]<br><br>"+
                          "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=crimson][/COLOR]",
     prefix: UNACCEPT_PREFIX,
     status: false,
},
 
 {
    title: `------------------------------------------------>>>>>   Ответы на заявки на ЛД ОПГ  <<<<<--------------------------------------------------`,
        },
        {
title: '| ЛД БАТ |',
	  content:
    `[I][CENTER][COLOR=#CADB1A][FONT=georgia][SIZE=4][B]Добрый день, уважаемые игроки. Пришло время подвести итоги!.[/I][/SIZE][/FONT][/COLOR][I][B]<br>` +
     "[I][B][color=#EFEFEB][FONT=georgia][CENTER] В данном сообщении вы узнаете список одобренных и отказанных игроков на должность Лидера Криминальной организации [/COLOR][COLOR=#4347CB] *Батыревская ОПГ*[/COLOR].[color=#EFEFEB] В случае если вы не согласны с решением то обратитесь в раздел «[/COLOR][color=#E3403B]Жалобы на Администрацию[/COLOR]».[/CENTER][I][B]<br>" +
    "[I][B][FONT=georgia][CENTER][color=#FFFFFF][ICODE]Список[/ICODE][/COLOR][color=#00FF00][ICODE]одобренных:[/ICODE][I][B][FONT=georgia][CENTER]"+
 "[I][B][color=#EFEFEB][FONT=georgia][CENTER] -------- [/CENTER][I][B][/COLOR]" +
     "[I][B][FONT=georgia][CENTER][color=#FFFFFF][ICODE]Список[/ICODE][/COLOR][color=RED][ICODE]отказанных:[/ICODE][I][B][FONT=georgia][CENTER]"+
     "[I][B][color=#EFEFEB][FONT=georgia][CENTER] -------- [/CENTER][I][B][/COLOR]<br>" +
    "[I][B][color=#DA7810][FONT=georgia][CENTER] Примечание:[/CENTER][I][B][/COLOR]" +
       "[I][B][color=#EFEFEB][FONT=georgia][CENTER]Все обзвоны производятся в официальном дискорде сервера UFA - https://discord.gg/6DS4wye8Fu  Не попадайтесь на Fake обзвоны, если вам пишут посторонние люди которые представляются главным следящим/заместителем то смело блокируйте, снизу будет контакты руководства которые с вами свяжутся.[/CENTER][I][B][/COLOR]<br>" +
     "[I][B][color=#EFEFEB][FONT=georgia][CENTER]Контакты руководства: Главный следящий: Dmitriy_Bysaga - https://vk.com/bisagadmitro Зам. Главного следящего: Arthur_Toropov - https://vk.com/arturchikuwu [/COLOR][/CENTER][/COLOR]<br>" ,
    },
             {
title: '| ЛД АРЗ |',
	  content:
    `[I][CENTER][COLOR=#CADB1A][FONT=georgia][SIZE=4][B]Добрый день, уважаемые игроки. Пришло время подвести итоги!.[/I][/SIZE][/FONT][/COLOR][I][B]<br>` +
     "[I][B][color=#EFEFEB][FONT=georgia][CENTER] В данном сообщении вы узнаете список одобренных и отказанных игроков на должность Лидера Криминальной организации [/COLOR][COLOR=#0F7E07] *Арзамасская ОПГ*[/COLOR].[color=#EFEFEB] В случае если вы не согласны с решением то обратитесь в раздел «[/COLOR][color=#E3403B]Жалобы на Администрацию[/COLOR]».[/CENTER][I][B]<br>" +
    "[I][B][FONT=georgia][CENTER][color=#FFFFFF][ICODE]Список[/ICODE][/COLOR][color=#00FF00][ICODE]одобренных:[/ICODE][I][B][FONT=georgia][CENTER]"+
 "[I][B][color=#EFEFEB][FONT=georgia][CENTER] -------- [/CENTER][I][B][/COLOR]" +
     "[I][B][FONT=georgia][CENTER][color=#FFFFFF][ICODE]Список[/ICODE][/COLOR][color=RED][ICODE]отказанных:[/ICODE][I][B][FONT=georgia][CENTER]"+
     "[I][B][color=#EFEFEB][FONT=georgia][CENTER] -------- [/CENTER][I][B][/COLOR]<br>" +
    "[I][B][color=#DA7810][FONT=georgia][CENTER] Примечание:[/CENTER][I][B][/COLOR]" +
        "[I][B][color=#EFEFEB][FONT=georgia][CENTER]Все обзвоны производятся в официальном дискорде сервера UFA - https://discord.gg/6DS4wye8Fu  Не попадайтесь на Fake обзвоны, если вам пишут посторонние люди которые представляются главным следящим/заместителем то смело блокируйте, снизу будет контакты руководства которые с вами свяжутся.[/CENTER][I][B][/COLOR]<br>" +
     "[I][B][color=#EFEFEB][FONT=georgia][CENTER]Контакты руководства: Главный следящий: Dmitriy_Bysaga - https://vk.com/bisagadmitro Зам. Главного следящего: Arthur_Toropov - https://vk.com/arturchikuwu [/COLOR][/CENTER][/COLOR]<br>" ,
    },
             {
title: '| ЛД ЛЫТ |',
	  content:
    `[I][B][CENTER][COLOR=#CADB1A][FONT=georgia][SIZE=4][B]Добрый день, уважаемые игроки. Пришло время подвести итоги!.[/I][/B][/SIZE][/FONT][/COLOR]<br>` +
     "[I][B][color=#EFEFEB][FONT=georgia][CENTER] В данном сообщении вы узнаете список одобренных и отказанных игроков на должность Лидера Криминальной организации [/COLOR][COLOR=#E7F202] *Лыткаринская ОПГ*[/COLOR].[color=#EFEFEB] В случае если вы не согласны с решением то обратитесь в раздел «[/COLOR][color=#E3403B]Жалобы на Администрацию[/COLOR]».[/CENTER][I][B]<br>" +
    "[I][B][FONT=georgia][CENTER][color=#FFFFFF][ICODE]Список[/ICODE][/COLOR][color=#00FF00][ICODE]одобренных:[/ICODE][I][B][FONT=georgia][CENTER]"+
 "[I][B][color=#EFEFEB][FONT=georgia][CENTER] -------- [/CENTER][I][B][/COLOR]" +
     "[I][B][FONT=georgia][CENTER][color=#FFFFFF][ICODE]Список[/ICODE][/COLOR][color=RED][ICODE]отказанных:[/ICODE][I][B][FONT=georgia][CENTER]"+
     "[I][B][color=#EFEFEB][FONT=georgia][CENTER] -------- [/CENTER][I][B][/COLOR]<br>" +
    "[I][B][color=#DA7810][FONT=georgia][CENTER] Примечание:[/CENTER][I][B][/COLOR]" +
     "[I][B][color=#EFEFEB][FONT=georgia][CENTER]Все обзвоны производятся в официальном дискорде сервера UFA - https://discord.gg/6DS4wye8Fu  Не попадайтесь на Fake обзвоны, если вам пишут посторонние люди которые представляются главным следящим/заместителем то смело блокируйте, снизу будет контакты руководства которые с вами свяжутся.[/CENTER][I][B][/COLOR]<br>" +
     "[I][B][color=#EFEFEB][FONT=georgia][CENTER]Контакты руководства: Главный следящий: Dmitriy_Bysaga - https://vk.com/bisagadmitro Зам. Главного следящего: Arthur_Toropov - https://vk.com/arturchikuwu [/COLOR][/CENTER][/COLOR]<br>" ,
    },
    ];
 
    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
        // Добавление кнопок при загрузке страницы
        addButton('Одобрить', 'accepted');
        addButton('Отказать', 'unaccept');
        addButton('На рассмотрение', 'pin');
        addButton('Рассмотрено', 'watched');
        addButton('ГА', 'mainAdmin');
        addButton('Меню', 'selectAnswer');
 
        // Поиск информации о теме
        const threadData = getThreadData();
 
        $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
        $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
        $(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true));
        $(`button#watched`).click(() => editThreadData(WATCHED_PREFIX, false));
        $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
        $(`button#mainAdmin`).click(() => editThreadData(GA_PREFIX, true));
 
        $(`button#specialAdmin`).click(() => editThreadData(SPECIAL_PREFIX, true));
 
        $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
 
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
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 30px; margin-right: 7px;">${name}</button>`,
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