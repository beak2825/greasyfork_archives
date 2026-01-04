// ==UserScript==
// @name         скрипт для меня
// @namespace    https://forum.blackrussia.online
// @version      1.3
// @description 🏛️
// @author      J. Hoffm
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license    MIT
// @icon   https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @downloadURL https://update.greasyfork.org/scripts/460713/%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%BC%D0%B5%D0%BD%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/460713/%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%BC%D0%B5%D0%BD%D1%8F.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RASSMOTENO_PREFIX = 9; // Prefix that will be set when solving the problem
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const OTKAZBIO_PREFIX = 4;
const ODOBRENOBIO_PREFIX = 8;
const NARASSMOTRENIIBIO_PREFIX = 2;
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SPECY_PREFIX = 11;
const TEX_PREFIX = 13;
const buttons = [
    {
        title: ' Приветствия ',
        content: 
        '[CENTER][COLOR=rgb(238, 0, 238)][SIZE=3][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/COLOR][/CENTER]',
},
{
    title: ' Одобрено ',
    content:
'[CENTER][COLOR=rgb(238, 0, 238)][SIZE=3][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
"[CENTER][SIZE=3][FONT=georgia][COLOR=rgb(0, 255, 0)]Ꭷд᧐бᴩᴇн᧐[/COLOR], ЗаᴋᴩыᴛᎧ[COLOR=rgb(255, 0, 0)].[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
'[CENTER][SIZE=3][FONT=times new roman]П[/FONT]ᴩияᴛн᧐й иᴦᴩы нᴀ [COLOR=rgb(0, 0, 0)]ʙʟᴀᴄᴋ ʀᴜssɪᴀ[/COLOR][COLOR=rgb(255, 255, 255)].[/COLOR][/SIZE][/CENTER]',
   prefix: ACCEPT_PREFIX,
   status: false,
},
{
    title: 'Отказано',
    content:
'[CENTER][COLOR=rgb(238, 0, 238)][SIZE=3][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
"[CENTER][SIZE=3][FONT=georgia][COLOR=rgb(255, 0, 0)]Ꭷᴛᴋᴀзᴀн᧐[/COLOR][/FONT], зᴀᴋᴩыᴛ[/SIZE][SIZE=2]Ꭷ[/SIZE][COLOR=rgb(255, 0, 0)][SIZE=3].[/SIZE][/COLOR][/CENTER]<br>" +
'[CENTER][SIZE=3][FONT=times new roman]П[/FONT]ᴩияᴛн᧐й иᴦᴩы нᴀ [COLOR=rgb(0, 0, 0)]ʙʟᴀᴄᴋ ʀᴜssɪᴀ[/COLOR][COLOR=rgb(255, 255, 255)].[/COLOR][/SIZE][/CENTER]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
    title: ' На рассмотрении ',
    content: 
'[CENTER][COLOR=rgb(238, 0, 238)][SIZE=3][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
"[CENTER][FONT=georgia][SIZE=3]Вᴀɯᴀ жᴀᴧ᧐бᴀ ʙзяᴛᴀ нᴀ ᴩᴀᴄᴄʍ᧐ᴛᴩᴇниᴇ[COLOR=rgb(0, 0, 0)].[/COLOR][/SIZE][/FONT]<br>" +
"[FONT=times new roman][SIZE=3]П[/SIZE][/FONT][FONT=georgia][SIZE=3]ᴩ᧐ᴄьбᴀ ᧐жидᴀᴛь ᧐ᴛʙᴇᴛᴀ и нᴇ ᴄ᧐здᴀʙᴀᴛь дубᴧиᴋᴀᴛы дᴀнн᧐й ᴛᴇʍы.[/SIZE][/FONT][/CENTER]<br><br>" +
'[CENTER][COLOR=rgb(255, 255, 0)][FONT=tahoma][SIZE=3]Ꭷжидᴀйᴛᴇ ᧐ᴛʙᴇᴛᴀ.[/SIZE][/FONT][/COLOR][/CENTER]',
prefix: PIN_PREFIX,
status: false,
},
{
    title: ' На Теха ',
    content:
'[CENTER][COLOR=rgb(238, 0, 238)][SIZE=3][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
"[CENTER][FONT=georgia][SIZE=3]ʙᴀɯᴀ жᴀᴧ᧐бᴀ быᴧᴀ ᴨᴇᴩᴇдᴀнᴀ нᴀ ᴩᴀᴄᴄʍ᧐ᴛᴩᴇниᴇ ᴛᴇхничᴇᴄᴋ᧐ʍу ᴄᴨᴇциᴀᴧиᴄᴛу.[/SIZE][/FONT][/CENTER]<br><br>" +
'[CENTER][COLOR=rgb(255, 255, 0)][FONT=tahoma][SIZE=3]Ꭷжидᴀйᴛᴇ ᧐ᴛʙᴇᴛᴀ.[/SIZE][/FONT][/COLOR][/CENTER]',
prefix: TEX_PREFIX,
status: true,
},
{
    title: '___________________-_-_-_-_-_-_________________________________________________________'

    },
    {
        title: ' Мало доказательства ',
        content:
'[CENTER][COLOR=rgb(238, 0, 238)][SIZE=3][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
"[CENTER][FONT=georgia][SIZE=3]Нᴇд᧐ᴄᴛᴀᴛ᧐чн᧐ д᧐ᴋᴀзᴀᴛᴇᴧьᴄᴛʙ дᴧя ᴋ᧐ᴩᴩᴇᴋᴛн᧐ᴦ᧐ ᴩᴀᴄᴄʍ᧐ᴛᴩᴇния ʙᴀɯᴇй жᴀᴧ᧐бы.[/SIZE][/FONT][/CENTER]<br><br>" +
"[CENTER][SIZE=3][FONT=georgia][COLOR=rgb(255, 0, 0)]Ꭷᴛᴋᴀзᴀн᧐[/COLOR][/FONT], зᴀᴋᴩыᴛ[/SIZE][SIZE=2]Ꭷ[/SIZE][COLOR=rgb(255, 0, 0)][SIZE=3].[/SIZE][/COLOR][/CENTER]<br>" +
'[CENTER][SIZE=3][FONT=times new roman]П[/FONT]ᴩияᴛн᧐й иᴦᴩы нᴀ [COLOR=rgb(0, 0, 0)]ʙʟᴀᴄᴋ ʀᴜssɪᴀ[/COLOR][COLOR=rgb(255, 255, 255)].[/COLOR][/SIZE][/CENTER]',
prefix: UNACCEPT_PREFIX,
status: false,
    },
    {
        title: ' Отсутствует док-ва',
        content: 
'[CENTER][COLOR=rgb(238, 0, 238)][SIZE=3][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
"[CENTER][FONT=georgia][SIZE=3]Oᴛᴄуᴛᴄᴛʙуюᴛ д᧐ᴋᴀзᴀᴛᴇᴧьᴄᴛʙᴀ - ᴄᴧᴇд᧐ʙᴀᴛᴇᴧьн᧐, ᴩᴀᴄᴄʍ᧐ᴛᴩᴇнию нᴇ ᴨ᧐дᴧᴇжиᴛ. зᴀᴦᴩузиᴛᴇ д᧐ᴋᴀзᴀᴛᴇᴧьᴄᴛʙᴀ нᴀ ɸ᧐ᴛ᧐-ʙидᴇ᧐ х᧐ᴄᴛинᴦи ʏᴏᴜᴛᴜʙᴇ, ɪᴍɢᴜʀ, ʏᴀᴘx и ᴛᴀᴋ дᴀᴧᴇᴇ.[/SIZE][/FONT][/CENTER]<br><br>" +
"[CENTER][SIZE=3][FONT=georgia][COLOR=rgb(255, 0, 0)]Ꭷᴛᴋᴀзᴀн᧐[/COLOR][/FONT], зᴀᴋᴩыᴛ[/SIZE][SIZE=2]Ꭷ[/SIZE][COLOR=rgb(255, 0, 0)][SIZE=3].[/SIZE][/COLOR][/CENTER]<br>" +
'[CENTER][SIZE=3][FONT=times new roman]П[/FONT]ᴩияᴛн᧐й иᴦᴩы нᴀ [COLOR=rgb(0, 0, 0)]ʙʟᴀᴄᴋ ʀᴜssɪᴀ[/COLOR][COLOR=rgb(255, 255, 255)].[/COLOR][/SIZE][/CENTER]',
prefix: UNACCEPT_PREFIX,
status: false,
       
    },
    {
        title: ' Док-ва в соц-сетях ',
        content:
'[CENTER][COLOR=rgb(238, 0, 238)][SIZE=3][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
"[CENTER][FONT=georgia][SIZE=3]Д᧐ᴋᴀзᴀᴛᴇᴧьᴄᴛʙᴀ ʙ ᴄ᧐циᴀᴧьных ᴄᴇᴛях и ᴛ.д. нᴇ ᴨᴩиниʍᴀюᴛᴄя. зᴀᴦᴩузиᴛᴇ д᧐ᴋᴀзᴀᴛᴇᴧьᴄᴛʙᴀ нᴀ ɸ᧐ᴛ᧐-ʙидᴇ᧐ х᧐ᴄᴛинᴦи ʏᴏᴜᴛᴜʙᴇ,ɪᴍɢᴜʀ, ʏᴀᴘx и ᴛᴀᴋ дᴀᴧᴇᴇ.[/SIZE][/FONT][/CENTER]<br><br>" +
"[CENTER][SIZE=3][FONT=georgia][COLOR=rgb(255, 0, 0)]Ꭷᴛᴋᴀзᴀн᧐[/COLOR][/FONT], зᴀᴋᴩыᴛ[/SIZE][SIZE=2]Ꭷ[/SIZE][COLOR=rgb(255, 0, 0)][SIZE=3].[/SIZE][/COLOR][/CENTER]<br>" +
'[CENTER][SIZE=3][FONT=times new roman]П[/FONT]ᴩияᴛн᧐й иᴦᴩы нᴀ [COLOR=rgb(0, 0, 0)]ʙʟᴀᴄᴋ ʀᴜssɪᴀ[/COLOR][COLOR=rgb(255, 255, 255)].[/COLOR][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
        
    },
    {
        title: ' Нарушений нет ',
        content:
'[CENTER][COLOR=rgb(238, 0, 238)][SIZE=3][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
"[CENTER][FONT=georgia][SIZE=3]Нᴀᴩуɯᴇний ᴄ᧐ ᴄᴛ᧐ᴩ᧐ны иᴦᴩ᧐ᴋᴀ нᴇ быᴧ᧐ зᴀʍᴇчᴇн᧐.[/SIZE][/FONT][/CENTER]<br><br>" +
"[CENTER][SIZE=3][FONT=georgia][COLOR=rgb(255, 0, 0)]Ꭷᴛᴋᴀзᴀн᧐[/COLOR][/FONT], зᴀᴋᴩыᴛ[/SIZE][SIZE=2]Ꭷ[/SIZE][COLOR=rgb(255, 0, 0)][SIZE=3].[/SIZE][/COLOR][/CENTER]<br>" +
'[CENTER][SIZE=3][FONT=times new roman]П[/FONT]ᴩияᴛн᧐й иᴦᴩы нᴀ [COLOR=rgb(0, 0, 0)]ʙʟᴀᴄᴋ ʀᴜssɪᴀ[/COLOR][COLOR=rgb(255, 255, 255)].[/COLOR][/SIZE][/CENTER]',
prefix: UNACCEPT_PREFIX,
status: false,

    },
    {
        title: ' Нет /time ',
        content:
        '[CENTER][COLOR=rgb(238, 0, 238)][SIZE=3][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
"[CENTER][FONT=georgia][SIZE=3]Нᴀ д᧐ᴋᴀзᴀᴛᴇᴧьᴄᴛʙᴀх ᧐ᴛᴄуᴛᴄᴛʙуюᴛ дᴀᴛᴀ и ʙᴩᴇʍя (/ᴛɪᴍᴇ) - ᴄᴧᴇд᧐ʙᴀᴛᴇᴧьн᧐, ᴩᴀᴄᴄʍ᧐ᴛᴩᴇнию нᴇ ᴨ᧐дᴧᴇжиᴛ.[/SIZE][/FONT][/CENTER]<br><br>" +
"[CENTER][SIZE=3][FONT=georgia][COLOR=rgb(255, 0, 0)]Ꭷᴛᴋᴀзᴀн᧐[/COLOR][/FONT], зᴀᴋᴩыᴛ[/SIZE][SIZE=2]Ꭷ[/SIZE][COLOR=rgb(255, 0, 0)][SIZE=3].[/SIZE][/COLOR][/CENTER]<br>" +
'[CENTER][SIZE=3][FONT=times new roman]П[/FONT]ᴩияᴛн᧐й иᴦᴩы нᴀ [COLOR=rgb(0, 0, 0)]ʙʟᴀᴄᴋ ʀᴜssɪᴀ[/COLOR][COLOR=rgb(255, 255, 255)].[/COLOR][/SIZE][/CENTER]',
prefix: UNACCEPT_PREFIX,
status: false,
    },
    {
        title: ' Док-ва отредактирован ',
        content:
        '[CENTER][COLOR=rgb(238, 0, 238)][SIZE=3][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
"[CENTER][FONT=times new roman][SIZE=3]Д᧐ᴋᴀзᴀᴛᴇᴧьᴄᴛʙᴀ быᴧи ᴨ᧐дʙᴇᴩᴦнуᴛы ᴩᴇдᴀᴋᴛиᴩ᧐ʙᴀнию - ᴄᴧᴇд᧐ʙᴀᴛᴇᴧьн᧐, ᴩᴀᴄᴄʍ᧐ᴛᴩᴇнию нᴇ ᴨ᧐дᴧᴇжиᴛ.[/SIZE][/FONT][/CENTER]<br><br>" +
"[CENTER][SIZE=3][FONT=georgia][COLOR=rgb(255, 0, 0)]Ꭷᴛᴋᴀзᴀн᧐[/COLOR][/FONT], зᴀᴋᴩыᴛ[/SIZE][SIZE=2]Ꭷ[/SIZE][COLOR=rgb(255, 0, 0)][SIZE=3].[/SIZE][/COLOR][/CENTER]<br>" +
'[CENTER][SIZE=3][FONT=times new roman]П[/FONT]ᴩияᴛн᧐й иᴦᴩы нᴀ [COLOR=rgb(0, 0, 0)]ʙʟᴀᴄᴋ ʀᴜssɪᴀ[/COLOR][COLOR=rgb(255, 255, 255)].[/COLOR][/SIZE][/CENTER]',
prefix: UNACCEPT_PREFIX,
status: false,
    },
    {
        title: ' Нужен фрапс ',
        content:
        '[CENTER][COLOR=rgb(238, 0, 238)][SIZE=3][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
"[CENTER][FONT=georgia][SIZE=3]В дᴀнн᧐ʍ ᴄᴧучᴀᴇ нужᴇн ɸᴩᴀᴨᴄ н᧐ ᴄᴋᴩинɯ᧐ᴛᴀ ᴛуᴛ нᴇд᧐ᴄᴛᴀᴛ᧐чн᧐.[/SIZE][/FONT][/CENTER]<br><br>" +
"[CENTER][SIZE=3][FONT=georgia][COLOR=rgb(255, 0, 0)]Ꭷᴛᴋᴀзᴀн᧐[/COLOR][/FONT], зᴀᴋᴩыᴛ[/SIZE][SIZE=2]Ꭷ[/SIZE][COLOR=rgb(255, 0, 0)][SIZE=3].[/SIZE][/COLOR][/CENTER]<br>" +
'[CENTER][SIZE=3][FONT=times new roman]П[/FONT]ᴩияᴛн᧐й иᴦᴩы нᴀ [COLOR=rgb(0, 0, 0)]ʙʟᴀᴄᴋ ʀᴜssɪᴀ[/COLOR][COLOR=rgb(255, 255, 255)].[/COLOR][/SIZE][/CENTER]',

    },
    {
        title: ' Док-ва обрывается ',
        content:
        '[CENTER][COLOR=rgb(238, 0, 238)][SIZE=3][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
"[CENTER][SIZE=3][FONT=georgia]Вᴀɯᴀ ʙидᴇ᧐зᴀᴨиᴄь ᧐бᴩыʙᴀᴇᴛᴄя. зᴀᴦᴩузиᴛᴇ ᴨ᧐ᴧную ʙидᴇ᧐зᴀᴨиᴄь нᴀ ʙидᴇ᧐-х᧐ᴄᴛинᴦ ʏᴏᴜᴛᴜʙᴇ.[/FONT][/SIZE][/CENTER]<br><br>" +
"[CENTER][SIZE=3][FONT=georgia][COLOR=rgb(255, 0, 0)]Ꭷᴛᴋᴀзᴀн᧐[/COLOR][/FONT], зᴀᴋᴩыᴛ[/SIZE][SIZE=2]Ꭷ[/SIZE][COLOR=rgb(255, 0, 0)][SIZE=3].[/SIZE][/COLOR][/CENTER]<br>" +
'[CENTER][SIZE=3][FONT=times new roman]П[/FONT]ᴩияᴛн᧐й иᴦᴩы нᴀ [COLOR=rgb(0, 0, 0)]ʙʟᴀᴄᴋ ʀᴜssɪᴀ[/COLOR][COLOR=rgb(255, 255, 255)].[/COLOR][/SIZE][/CENTER]',
prefix: UNACCEPT_PREFIX,
status: false,

    },
    {
        title: ' Уже наказан ',
        content: 
        '[CENTER][COLOR=rgb(238, 0, 238)][SIZE=3][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
"[CENTER][FONT=georgia][SIZE=3]Дᴀнный нᴀᴩуɯиᴛᴇᴧь ужᴇ нᴀᴋᴀзᴀн.[/SIZE][/FONT][/CENTER]<br><br>" +
"[CENTER][SIZE=3][FONT=georgia][COLOR=rgb(255, 0, 0)]Ꭷᴛᴋᴀзᴀн᧐[/COLOR][/FONT], зᴀᴋᴩыᴛ[/SIZE][SIZE=2]Ꭷ[/SIZE][COLOR=rgb(255, 0, 0)][SIZE=3].[/SIZE][/COLOR][/CENTER]<br>" +
'[CENTER][SIZE=3][FONT=times new roman]П[/FONT]ᴩияᴛн᧐й иᴦᴩы нᴀ [COLOR=rgb(0, 0, 0)]ʙʟᴀᴄᴋ ʀᴜssɪᴀ[/COLOR][COLOR=rgb(255, 255, 255)].[/COLOR][/SIZE][/CENTER]',
prefix: UNACCEPT_PREFIX,
status: false,
    },
    {
        title: ' Был дан ответ ',
        content: 
        '[CENTER][COLOR=rgb(238, 0, 238)][SIZE=3][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
"[CENTER][FONT=georgia][SIZE=3]В ᴨᴩ᧐ɯᴧ᧐ʍ жᴀᴧ᧐бᴇ быᴧ дᴀн ᧐ᴛʙᴇᴛ.[/SIZE][/FONT][/CENTER]<br>" +
"[CENTER][FONT=georgia][SIZE=3]Пᴩᴇᴋᴩᴀᴛиᴛᴇ ᴄ᧐здᴀʙᴀᴛь дубᴧиᴋᴀᴛы ϶ᴛ᧐й ᴛᴇʍы, инᴀчᴇ ʙᴀɯ ɸ᧐ᴩуʍный ᴀᴋᴋᴀунᴛ  будᴇᴛ зᴀбᴧ᧐ᴋиᴩ᧐ʙᴀн.[/SIZE][/FONT][/CENTER]<br><br>" +
"[CENTER][SIZE=3][FONT=georgia][COLOR=rgb(255, 0, 0)]Ꭷᴛᴋᴀзᴀн᧐[/COLOR][/FONT], зᴀᴋᴩыᴛ[/SIZE][SIZE=2]Ꭷ[/SIZE][COLOR=rgb(255, 0, 0)][SIZE=3].[/SIZE][/COLOR][/CENTER]<br>" +
'[CENTER][SIZE=3][FONT=times new roman]П[/FONT]ᴩияᴛн᧐й иᴦᴩы нᴀ [COLOR=rgb(0, 0, 0)]ʙʟᴀᴄᴋ ʀᴜssɪᴀ[/COLOR][COLOR=rgb(255, 255, 255)].[/COLOR][/SIZE][/CENTER]',
prefix: UNACCEPT_PREFIX,
status: false,

    },
    {
        title: ' Не по форме. ',
        content:
        '[CENTER][COLOR=rgb(238, 0, 238)][SIZE=3][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
"[CENTER][FONT=georgia][SIZE=3]Вᴀɯᴀ жᴀᴧ᧐бᴀ ᴄ᧐ᴄᴛᴀʙᴧᴇнᴀ нᴇ ᴨ᧐ ɸ᧐ᴩʍᴇ. ʙниʍᴀᴛᴇᴧьн᧐ ᴨᴩ᧐чиᴛᴀйᴛᴇ ᴨᴩᴀʙиᴧᴀ ᴨ᧐дᴀчи жᴀᴧ᧐б нᴀ иᴦᴩ᧐ᴋ᧐ʙ, зᴀᴋᴩᴇᴨᴧᴇнныᴇ ʙ ϶ᴛ᧐ʍ ᴩᴀздᴇᴧᴇ. [/SIZE][/FONT][URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/'][SIZE=3][FONT=georgia]*Нажмите*[/FONT][/SIZE][/URL][/CENTER]<br><br>" +
"[CENTER][SIZE=3][FONT=georgia][COLOR=rgb(255, 0, 0)]Ꭷᴛᴋᴀзᴀн᧐[/COLOR][/FONT], зᴀᴋᴩыᴛ[/SIZE][SIZE=2]Ꭷ[/SIZE][COLOR=rgb(255, 0, 0)][SIZE=3].[/SIZE][/COLOR][/CENTER]<br>" +
'[CENTER][SIZE=3][FONT=times new roman]П[/FONT]ᴩияᴛн᧐й иᴦᴩы нᴀ [COLOR=rgb(0, 0, 0)]ʙʟᴀᴄᴋ ʀᴜssɪᴀ[/COLOR][COLOR=rgb(255, 255, 255)].[/COLOR][/SIZE][/CENTER]',
prefix: UNACCEPT_PREFIX,
status: false,
    },
    {
        title: ' Нету условия сделки ',
        content:
        '[CENTER][COLOR=rgb(238, 0, 238)][SIZE=3][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
"[CENTER][FONT=georgia][SIZE=3]В дᴀнных д᧐ᴋᴀзᴀᴛᴇᴧьᴄᴛʙᴀх ᧐ᴛᴄуᴛᴄᴛʙуюᴛ уᴄᴧ᧐ʙия ᴄдᴇᴧᴋи.[/SIZE][/FONT][/CENTER]<br><br>" +
"[CENTER][SIZE=3][FONT=georgia][COLOR=rgb(255, 0, 0)]Ꭷᴛᴋᴀзᴀн᧐[/COLOR][/FONT], зᴀᴋᴩыᴛ[/SIZE][SIZE=2]Ꭷ[/SIZE][COLOR=rgb(255, 0, 0)][SIZE=3].[/SIZE][/COLOR][/CENTER]<br>" +
'[CENTER][SIZE=3][FONT=times new roman]П[/FONT]ᴩияᴛн᧐й иᴦᴩы нᴀ [COLOR=rgb(0, 0, 0)]ʙʟᴀᴄᴋ ʀᴜssɪᴀ[/COLOR][COLOR=rgb(255, 255, 255)].[/COLOR][/SIZE][/CENTER]',
prefix: UNACCEPT_PREFIX,
status: false,
    },
    {
        title: ' Док-ва обрезаны ',
       content:
       '[CENTER][COLOR=rgb(238, 0, 238)][SIZE=3][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
"[CENTER][FONT=georgia][SIZE=3]Вᴀɯᴀ д᧐ᴋᴀзᴀᴛᴇᴧьᴄᴛʙ᧐ ᧐бᴩᴇзᴀны, зᴀᴦᴩузиᴛᴇ д᧐ᴋᴀзᴀᴛᴇᴧьᴄᴛʙу нᴀ дᴩуᴦ᧐ʍ ɸ᧐ᴛ᧐ х᧐ᴄᴛинᴦᴇ.[/SIZE][/FONT][/CENTER]<br><br>" +
"[CENTER][SIZE=3][FONT=georgia][COLOR=rgb(255, 0, 0)]Ꭷᴛᴋᴀзᴀн᧐[/COLOR][/FONT], зᴀᴋᴩыᴛ[/SIZE][SIZE=2]Ꭷ[/SIZE][COLOR=rgb(255, 0, 0)][SIZE=3].[/SIZE][/COLOR][/CENTER]<br>" +
'[CENTER][SIZE=3][FONT=times new roman]П[/FONT]ᴩияᴛн᧐й иᴦᴩы нᴀ [COLOR=rgb(0, 0, 0)]ʙʟᴀᴄᴋ ʀᴜssɪᴀ[/COLOR][COLOR=rgb(255, 255, 255)].[/COLOR][/SIZE][/CENTER]',
prefix: UNACCEPT_PREFIX,
status: false,
       
    },
    {
        title: ' ЖБ на сотрудника ',
        content: 
        '[CENTER][COLOR=rgb(238, 0, 238)][SIZE=3][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
"[CENTER][FONT=georgia][SIZE=3]П᧐дᴀйᴛᴇ жᴀᴧ᧐бу нᴀ ᴄ᧐ᴛᴩудниᴋᴀ ʙ ᴩᴀздᴇᴧᴇ ᴦ᧐ᴄудᴀᴩᴄᴛʙᴇнныᴇ ᧐ᴩᴦᴀнизᴀции.[/SIZE][/FONT][/CENTER]<br><br>" +
"[CENTER][SIZE=3][FONT=georgia][COLOR=rgb(255, 0, 0)]Ꭷᴛᴋᴀзᴀн᧐[/COLOR][/FONT], зᴀᴋᴩыᴛ[/SIZE][SIZE=2]Ꭷ[/SIZE][COLOR=rgb(255, 0, 0)][SIZE=3].[/SIZE][/COLOR][/CENTER]<br>" +
'[CENTER][SIZE=3][FONT=times new roman]П[/FONT]ᴩияᴛн᧐й иᴦᴩы нᴀ [COLOR=rgb(0, 0, 0)]ʙʟᴀᴄᴋ ʀᴜssɪᴀ[/COLOR][COLOR=rgb(255, 255, 255)].[/COLOR][/SIZE][/CENTER]',
prefix: UNACCEPT_PREFIX,
status: false,
    },
    {
        title: ' Нужен TimeCode ',
        content:
        '[CENTER][COLOR=rgb(238, 0, 238)][SIZE=3][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
"[CENTER] [SIZE=3][FONT=georgia]Еᴄᴧи ʙидᴇ᧐ дᴧиᴛᴄя б᧐ᴧьɯᴇ 3-ᴇх ʍинуᴛ - ʙы д᧐ᴧжны уᴋᴀзᴀᴛь ᴛᴀйʍᴋ᧐ды нᴀᴩуɯᴇний.[/FONT][/SIZE][/CENTER]<br><br>" +
"[CENTER][SIZE=3][FONT=georgia][COLOR=rgb(255, 0, 0)]Ꭷᴛᴋᴀзᴀн᧐[/COLOR][/FONT], зᴀᴋᴩыᴛ[/SIZE][SIZE=2]Ꭷ[/SIZE][COLOR=rgb(255, 0, 0)][SIZE=3].[/SIZE][/COLOR][/CENTER]<br>" +
'[CENTER][SIZE=3][FONT=times new roman]П[/FONT]ᴩияᴛн᧐й иᴦᴩы нᴀ [COLOR=rgb(0, 0, 0)]ʙʟᴀᴄᴋ ʀᴜssɪᴀ[/COLOR][COLOR=rgb(255, 255, 255)].[/COLOR][/SIZE][/CENTER]',
prefix: UNACCEPT_PREFIX,
status: false,

    },
    {
        title: '______________________Одобренные ответы________________________________',
        
    },
    {
        title: ' Нрп поведение ',
        content: 
        '[CENTER][COLOR=rgb(238, 0, 238)][SIZE=3][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
        "[CENTER][FONT=georgia][SIZE=3][I]2.01. зᴀᴨᴩᴇщᴇн᧐ ᴨ᧐ʙᴇдᴇниᴇ, нᴀᴩуɯᴀющᴇᴇ н᧐ᴩʍы ᴨᴩ᧐цᴇᴄᴄ᧐ʙ ʀᴏʟᴇ ᴘʟᴀʏ ᴩᴇжиʍᴀ иᴦᴩы | ᴊᴀɪʟ 30 ʍинуᴛ[/I][/SIZE][/FONT][I][FONT=georgia][SIZE=3][/SIZE][/FONT][/I]<br><br>" +
"[FONT=georgia][SIZE=3][I]ᴨᴩиʍᴇчᴀниᴇ: ᴇздиᴛь нᴀ ᴋᴩыɯᴀх ᴛᴩᴀнᴄᴨ᧐ᴩᴛных ᴄᴩᴇдᴄᴛʙ, бᴇᴦᴀᴛь иᴧи х᧐диᴛь ᴨ᧐ ᴄᴛ᧐ᴧᴀʍ ʙ ᴋᴀзин᧐, цᴇᴧᴇнᴀᴨᴩᴀʙᴧᴇннᴀя ᴨᴩ᧐ʙ᧐ᴋᴀция ᴄ᧐ᴛᴩудниᴋ᧐ʙ ᴨᴩᴀʙ᧐᧐хᴩᴀниᴛᴇᴧьных ᧐ᴩᴦᴀн᧐ʙ ᴄ цᴇᴧью ᴩᴀзʙᴧᴇчᴇния, цᴇᴧᴇнᴀᴨᴩᴀʙᴧᴇннᴀя ᴨ᧐ʍᴇхᴀ ʙ ᴨᴩ᧐ʙᴇдᴇнии ᴩᴀзᴧичных ᴄ᧐бᴇᴄᴇд᧐ʙᴀний и ᴛᴀᴋ дᴀᴧᴇᴇ.[/I][/SIZE][/FONT][/CENTER]<br><br>" +
"[CENTER][SIZE=3][FONT=georgia][COLOR=rgb(0, 255, 0)]Ꭷд᧐бᴩᴇн᧐[/COLOR], ЗаᴋᴩыᴛᎧ[COLOR=rgb(255, 0, 0)].[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
'[CENTER][SIZE=3][FONT=times new roman]П[/FONT]ᴩияᴛн᧐й иᴦᴩы нᴀ [COLOR=rgb(0, 0, 0)]ʙʟᴀᴄᴋ ʀᴜssɪᴀ[/COLOR][COLOR=rgb(255, 255, 255)].[/COLOR][/SIZE][/CENTER]',
prefix: ACCEPT_PREFIX,
status: false,
    },
    {
        title: ' Уход от рп ',
        content:
        '[CENTER][COLOR=rgb(238, 0, 238)][SIZE=3][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
"[CENTER][FONT=georgia][SIZE=3][I]2.02. зᴀᴨᴩᴇщᴇн᧐ цᴇᴧᴇнᴀᴨᴩᴀʙᴧᴇнн᧐ ух᧐диᴛь ᧐ᴛ ʀᴏʟᴇ ᴘʟᴀʏ ᴨᴩ᧐цᴇᴄᴄᴀ ʙᴄᴇᴩᴀзᴧичныʍи ᴄᴨ᧐ᴄ᧐бᴀʍи | ᴊᴀɪʟ 30 ʍинуᴛ / ᴡᴀʀɴ[/I][/SIZE][/FONT][I][FONT=georgia][SIZE=3][/SIZE][/FONT][/I]<br><br>" +
"[FONT=georgia][SIZE=3][I]ᴨᴩиʍᴇчᴀниᴇ: ух᧐диᴛь ʙ ᴀꜰᴋ ᴨᴩи ᧐ᴄᴛᴀн᧐ʙᴋᴇ ᴛᴩᴀнᴄᴨ᧐ᴩᴛн᧐ᴦ᧐ ᴄᴩᴇдᴄᴛʙᴀ ᴨᴩᴀʙ᧐᧐хᴩᴀниᴛᴇᴧьныʍи ᧐ᴩᴦᴀнᴀʍи, ʙых᧐диᴛь из иᴦᴩы дᴧя избᴇжᴀния ᴄʍᴇᴩᴛи, ʙых᧐диᴛь из иᴦᴩы ʙ᧐ ʙᴩᴇʍя ᴨᴩ᧐цᴇᴄᴄᴀ зᴀдᴇᴩжᴀния иᴧи ᴀᴩᴇᴄᴛᴀ, ᴨ᧐ᴧн᧐ᴇ иᴦн᧐ᴩиᴩ᧐ʙᴀниᴇ ᧐ᴛыᴦᴩ᧐ʙ᧐ᴋ дᴩуᴦ᧐ᴦ᧐ иᴦᴩ᧐ᴋᴀ, ᴋ᧐ᴛ᧐ᴩыᴇ ᴛᴀᴋ иᴧи инᴀчᴇ ʍ᧐ᴦуᴛ ᴋ᧐ᴄнуᴛьᴄя ʙᴀɯᴇᴦ᧐ ᴨᴇᴩᴄ᧐нᴀжᴀ. ух᧐диᴛь ʙ инᴛᴇᴩьᴇᴩ иᴧи зᴇᴧᴇную з᧐ну ʙ᧐ ʙᴩᴇʍя ᴨᴇᴩᴇᴄᴛᴩᴇᴧᴋи ᴄ цᴇᴧью избᴇжᴀᴛь ᴄʍᴇᴩᴛи иᴧи уйᴛи ᧐ᴛ ʀᴏʟᴇ ᴘʟᴀʏ ᴨᴩ᧐цᴇᴄᴄᴀ и ᴛᴀᴋ дᴀᴧᴇᴇ.[/I][/SIZE][/FONT][/CENTER]<br><br>" +
"[CENTER][SIZE=3][FONT=georgia][COLOR=rgb(0, 255, 0)]Ꭷд᧐бᴩᴇн᧐[/COLOR], ЗаᴋᴩыᴛᎧ[COLOR=rgb(255, 0, 0)].[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
'[CENTER][SIZE=3][I][FONT=georgia]Пᴩияᴛн᧐й иᴦᴩы нᴀ ʙʟᴀᴄᴋ ʀᴜssɪᴀ.[/FONT][/I][/SIZE][/CENTER]',
prefix: ACCEPT_PREFIX,
status: false,

    },
    {
        title: ' Nrp Drive ',
        content:
        '[CENTER][COLOR=rgb(238, 0, 238)][SIZE=3][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
"[CENTER][FONT=georgia][SIZE=3][I]2.03. зᴀᴨᴩᴇщᴇн ɴᴏɴʀᴘ ᴅʀɪᴠᴇ — ʙ᧐ждᴇниᴇ ᴧюб᧐ᴦ᧐ ᴛᴩᴀнᴄᴨ᧐ᴩᴛн᧐ᴦ᧐ ᴄᴩᴇдᴄᴛʙᴀ ʙ нᴇʙ᧐зʍ᧐жных дᴧя нᴇᴦ᧐ уᴄᴧ᧐ʙиях, ᴀ ᴛᴀᴋжᴇ ʙ᧐ждᴇниᴇ ʙ нᴇᴨᴩᴀʙд᧐ᴨ᧐д᧐бн᧐й ʍᴀнᴇᴩᴇ | ᴊᴀɪʟ 30 ʍинуᴛ.<br><br>" +
"ᴨᴩиʍᴇчᴀниᴇ: ᴇздᴀ нᴀ ᴄᴋуᴛᴇᴩᴇ ᴨ᧐ ᴦ᧐ᴩᴀʍ, ᴇздᴀ нᴀ ᴧюб᧐ʍ ᴛᴩᴀнᴄᴨ᧐ᴩᴛн᧐ʍ ᴄᴩᴇдᴄᴛʙᴇ ᴨ᧐ ʙᴄᴛᴩᴇчныʍ ᴨ᧐ᴧ᧐ᴄᴀʍ, нᴀᴩуɯᴀя ʙᴄᴇ ᴨᴩᴀʙиᴧᴀ д᧐ᴩ᧐жн᧐ᴦ᧐ дʙижᴇния бᴇз ᴋᴀᴋ᧐й-ᴧиб᧐ ᴨᴩичины, нᴀʍᴇᴩᴇнн᧐ᴇ ᴄ᧐здᴀниᴇ ᴀʙᴀᴩийных ᴄиᴛуᴀций нᴀ д᧐ᴩ᧐ᴦᴀх и ᴛᴀᴋ дᴀᴧᴇᴇ.[/I][/SIZE][/FONT][/CENTER]<br><br>" +
"[CENTER][SIZE=3][FONT=georgia][COLOR=rgb(0, 255, 0)]Ꭷд᧐бᴩᴇн᧐[/COLOR], ЗаᴋᴩыᴛᎧ[COLOR=rgb(255, 0, 0)].[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
'[CENTER][SIZE=3][I][FONT=georgia]Пᴩияᴛн᧐й иᴦᴩы нᴀ ʙʟᴀᴄᴋ ʀᴜssɪᴀ.[/FONT][/I][/SIZE][/CENTER]',
prefix: ACCEPT_PREFIX,
status: false,
    },
    {
        title: ' Нонрп обман ',
        content: 
        '[CENTER][COLOR=rgb(238, 0, 238)][SIZE=3][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
"[CENTER][SIZE=3][FONT=georgia][I]2.05. зᴀᴨᴩᴇщᴇны ᴧюбыᴇ ᴏᴏᴄ ᧐бʍᴀны и их ᴨ᧐ᴨыᴛᴋи, ᴀ ᴛᴀᴋжᴇ ᴧюбыᴇ ɪᴄ ᧐бʍᴀны ᴄ нᴀᴩуɯᴇниᴇʍ ʀᴏʟᴇ ᴘʟᴀʏ ᴨᴩᴀʙиᴧ и ᴧ᧐ᴦиᴋи | ᴘᴇʀᴍʙᴀɴ[/I][/FONT][/SIZE].[/CENTER]<br><br>" +
"[CENTER][SIZE=3][FONT=georgia][COLOR=rgb(0, 255, 0)]Ꭷд᧐бᴩᴇн᧐[/COLOR], ЗаᴋᴩыᴛᎧ[COLOR=rgb(255, 0, 0)].[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
'[CENTER][SIZE=3][I][FONT=georgia]Пᴩияᴛн᧐й иᴦᴩы нᴀ ʙʟᴀᴄᴋ ʀᴜssɪᴀ.[/FONT][/I][/SIZE][/CENTER]',
prefix: ACCEPT_PREFIX,
status: false,

    },
    {
        title: ' Аморал ',
        content: 
        '[CENTER][COLOR=rgb(238, 0, 238)][SIZE=3][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
"[CENTER][I][SIZE=3][FONT=georgia]2.08. зᴀᴨᴩᴇщᴇнᴀ ᴧюбᴀя ɸ᧐ᴩʍᴀ ᴀʍ᧐ᴩᴀᴧьных дᴇйᴄᴛʙий ᴄᴇᴋᴄуᴀᴧьн᧐ᴦ᧐ хᴀᴩᴀᴋᴛᴇᴩᴀ ʙ ᴄᴛ᧐ᴩ᧐ну иᴦᴩ᧐ᴋ᧐ʙ | ᴊᴀɪʟ 30 ʍинуᴛ / ᴡᴀʀɴ[/FONT][/SIZE][/I][SIZE=3][FONT=georgia][I][/I][/FONT][/SIZE]<br><br>" +
"[I][SIZE=3][FONT=georgia]иᴄᴋᴧючᴇниᴇ: ᧐б᧐юдн᧐ᴇ ᴄ᧐ᴦᴧᴀᴄиᴇ ᧐бᴇих ᴄᴛ᧐ᴩ᧐н.[/FONT][/SIZE][/I][/CENTER]<br><br>" +
"[CENTER][SIZE=3][FONT=georgia][COLOR=rgb(0, 255, 0)]Ꭷд᧐бᴩᴇн᧐[/COLOR], ЗаᴋᴩыᴛᎧ[COLOR=rgb(255, 0, 0)].[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
'[CENTER][SIZE=3][I][FONT=georgia]Пᴩияᴛн᧐й иᴦᴩы нᴀ ʙʟᴀᴄᴋ ʀᴜssɪᴀ.[/FONT][/I][/SIZE][/CENTER]',
prefix: ACCEPT_PREFIX,
status: false,

    },
    {
        title: ' Слив Склада ',
        content:
        '[CENTER][COLOR=rgb(238, 0, 238)][SIZE=3][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
"[CENTER][SIZE=3][I][FONT=georgia]2.09. зᴀᴨᴩᴇщᴇн᧐ ᴄᴧиʙᴀᴛь ᴄᴋᴧᴀд ɸᴩᴀᴋции / ᴄᴇʍьи ᴨуᴛᴇʍ ʙзяᴛия б᧐ᴧьɯ᧐ᴦ᧐ ᴋ᧐ᴧичᴇᴄᴛʙᴇ ᴩᴇᴄуᴩᴄ᧐ʙ, иᴧи жᴇ бᴩᴀᴛь б᧐ᴧьɯᴇ, чᴇʍ ᴩᴀзᴩᴇɯиᴧи нᴀ ᴄᴀʍ᧐ʍ дᴇᴧᴇ | ʙᴀɴ 15 - 30 днᴇй / ᴘᴇʀᴍʙᴀɴ.[/FONT][/I][/SIZE][/CENTER]<br><br>" +
"[CENTER][SIZE=3][FONT=georgia][COLOR=rgb(0, 255, 0)]Ꭷд᧐бᴩᴇн᧐[/COLOR], ЗаᴋᴩыᴛᎧ[COLOR=rgb(255, 0, 0)].[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
'[CENTER][SIZE=3][I][FONT=georgia]Пᴩияᴛн᧐й иᴦᴩы нᴀ ʙʟᴀᴄᴋ ʀᴜssɪᴀ.[/FONT][/I][/SIZE][/CENTER]',
  prefix: ACCEPT_PREFIX,
  status: false,
    },
    {
        title: 'DB',
        content:
        '[CENTER][COLOR=rgb(238, 0, 238)][SIZE=3][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
"[CENTER][I][SIZE=3][FONT=georgia]2.13. зᴀᴨᴩᴇщᴇн ᴅʙ (ᴅʀɪᴠᴇʙʏ) — нᴀʍᴇᴩᴇнн᧐ᴇ убийᴄᴛʙ᧐ / нᴀнᴇᴄᴇниᴇ уᴩ᧐нᴀ бᴇз ʙᴇᴄᴋ᧐й ɪᴄ ᴨᴩичины нᴀ ᴧюб᧐ʍ ʙидᴇ ᴛᴩᴀнᴄᴨ᧐ᴩᴛᴀ | ᴊᴀɪʟ 60 ʍинуᴛ[COLOR=rgb(204, 204, 204)].[/COLOR]<br><br>" +
"[COLOR=rgb(239, 239, 239)]и[/COLOR]ᴄᴋᴧючᴇниᴇ: ᴩᴀзᴩᴇɯᴀᴇᴛᴄя нᴀ ᴛᴇᴩᴩиᴛ᧐ᴩии ᴨᴩ᧐ʙᴇдᴇния ʍᴇᴩ᧐ᴨᴩияᴛия ᴨ᧐ зᴀхʙᴀᴛу уᴨᴀʙɯᴇᴦ᧐ ᴄᴇʍᴇйн᧐ᴦ᧐ ᴋ᧐нᴛᴇйнᴇᴩᴀ.[/FONT][/SIZE][/I][/CENTER]<br><br>" +
"[CENTER][SIZE=3][FONT=georgia][COLOR=rgb(0, 255, 0)]Ꭷд᧐бᴩᴇн᧐[/COLOR], ЗаᴋᴩыᴛᎧ[COLOR=rgb(255, 0, 0)].[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
'[CENTER][SIZE=3][I][FONT=georgia]Пᴩияᴛн᧐й иᴦᴩы нᴀ ʙʟᴀᴄᴋ ʀᴜssɪᴀ.[/FONT][/I][/SIZE][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
        
    },
    {
        title: ' RK ',
        content:
        '[CENTER][COLOR=rgb(238, 0, 238)][SIZE=3][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
"[CENTER][I][SIZE=3][FONT=georgia]2.14. зᴀᴨᴩᴇщᴇн ʀᴋ (ʀᴇᴠᴇɴɢᴇ ᴋɪʟʟ) — убийᴄᴛʙ᧐ иᴦᴩ᧐ᴋᴀ ᴄ цᴇᴧью ʍᴇᴄᴛи, ʙ᧐зʙᴩᴀщᴇниᴇ нᴀ ʍᴇᴄᴛ᧐ ᴄʍᴇᴩᴛи ʙ ᴛᴇчᴇниᴇ 15-ᴛи ʍинуᴛ, ᴀ ᴛᴀᴋжᴇ иᴄᴨ᧐ᴧьз᧐ʙᴀниᴇ ʙ дᴀᴧьнᴇйɯᴇʍ инɸ᧐ᴩʍᴀции, ᴋ᧐ᴛ᧐ᴩᴀя ᴨᴩиʙᴇᴧᴀ ʙᴀᴄ ᴋ ᴄʍᴇᴩᴛи | ᴊᴀɪʟ 30 ʍинуᴛ.[/FONT][/SIZE][/I][/CENTER]<br><br>" +
"[CENTER][SIZE=3][FONT=georgia][COLOR=rgb(0, 255, 0)]Ꭷд᧐бᴩᴇн᧐[/COLOR], ЗаᴋᴩыᴛᎧ[COLOR=rgb(255, 0, 0)].[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
'[CENTER][SIZE=3][I][FONT=georgia]Пᴩияᴛн᧐й иᴦᴩы нᴀ ʙʟᴀᴄᴋ ʀᴜssɪᴀ.[/FONT][/I][/SIZE][/CENTER]',
prefix: ACCEPT_PREFIX,
status: false,
    },
    {
        title: 'TK',
        content:
       '[CENTER][COLOR=rgb(238, 0, 238)][SIZE=3][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
"[CENTER][I][SIZE=3][FONT=georgia]2.15. зᴀᴨᴩᴇщᴇн ᴛᴋ (ᴛᴇᴀᴍ ᴋɪʟʟ) — убийᴄᴛʙ᧐ чᴧᴇнᴀ ᴄʙ᧐ᴇй иᴧи ᴄ᧐юзн᧐й ɸᴩᴀᴋции, ᧐ᴩᴦᴀнизᴀции бᴇз нᴀᴧичия ᴋᴀᴋ᧐й-ᴧиб᧐ ɪᴄ ᴨᴩичины | ᴊᴀɪʟ 60 ʍинуᴛ / ᴡᴀʀɴ (зᴀ дʙᴀ и б᧐ᴧᴇᴇ убийᴄᴛʙᴀ)[/FONT][/SIZE][/I][/CENTER]<br><br>" +
"[CENTER][SIZE=3][FONT=georgia][COLOR=rgb(0, 255, 0)]Ꭷд᧐бᴩᴇн᧐[/COLOR], ЗаᴋᴩыᴛᎧ[COLOR=rgb(255, 0, 0)].[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
'[CENTER][SIZE=3][I][FONT=georgia]Пᴩияᴛн᧐й иᴦᴩы нᴀ ʙʟᴀᴄᴋ ʀᴜssɪᴀ.[/FONT][/I][/SIZE][/CENTER]',
prefix: ACCEPT_PREFIX,
status: false,
    },
    {
        title: ' SK ',
        content:
        '[CENTER][COLOR=rgb(238, 0, 238)][SIZE=3][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
"[CENTER][FONT=georgia][I][SIZE=3]2.16. зᴀᴨᴩᴇщᴇн sᴋ (sᴘᴀᴡɴ ᴋɪʟʟ) — убийᴄᴛʙ᧐ иᴧи нᴀнᴇᴄᴇниᴇ уᴩ᧐нᴀ нᴀ ᴛиᴛуᴧьн᧐й ᴛᴇᴩᴩиᴛ᧐ᴩии ᴧюб᧐й ɸᴩᴀᴋции / ᧐ᴩᴦᴀнизᴀции, нᴀ ʍᴇᴄᴛᴇ ᴨ᧐яʙᴧᴇния иᴦᴩ᧐ᴋᴀ, ᴀ ᴛᴀᴋжᴇ нᴀ ʙых᧐дᴇ из зᴀᴋᴩыᴛых инᴛᴇᴩьᴇᴩ᧐ʙ и ᧐ᴋ᧐ᴧ᧐ них | ᴊᴀɪʟ 60 ʍинуᴛ / ᴡᴀʀɴ (зᴀ дʙᴀ и б᧐ᴧᴇᴇ убийᴄᴛʙᴀ)[/SIZE][/I][/FONT][/CENTER]<br><br>" +
"[CENTER][SIZE=3][FONT=georgia][COLOR=rgb(0, 255, 0)]Ꭷд᧐бᴩᴇн᧐[/COLOR], ЗаᴋᴩыᴛᎧ[COLOR=rgb(255, 0, 0)].[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
'[CENTER][SIZE=3][I][FONT=georgia]Пᴩияᴛн᧐й иᴦᴩы нᴀ ʙʟᴀᴄᴋ ʀᴜssɪᴀ.[/FONT][/I][/SIZE][/CENTER]',
prefix: ACCEPT_PREFIX,
status: false,
       
    },
    {
        title: ' PG ',
        content: 
        '[CENTER][COLOR=rgb(238, 0, 238)][SIZE=3][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
"[CENTER][I][SIZE=3][FONT=georgia]2.17. зᴀᴨᴩᴇщᴇн ᴘɢ (ᴘᴏᴡᴇʀɢᴀᴍɪɴɢ) — ᴨᴩиᴄʙ᧐ᴇниᴇ ᴄʙ᧐йᴄᴛʙ ᴨᴇᴩᴄ᧐нᴀжу, нᴇ ᴄ᧐᧐ᴛʙᴇᴛᴄᴛʙующих ᴩᴇᴀᴧьн᧐ᴄᴛи, ᧐ᴛᴄуᴛᴄᴛʙиᴇ ᴄᴛᴩᴀхᴀ зᴀ ᴄʙ᧐ю жизнь | ᴊᴀɪʟ 30 ʍинуᴛ[/FONT][/SIZE][/I][/CENTER]<br><br>" +
"[CENTER][SIZE=3][FONT=georgia][COLOR=rgb(0, 255, 0)]Ꭷд᧐бᴩᴇн᧐[/COLOR], ЗаᴋᴩыᴛᎧ[COLOR=rgb(255, 0, 0)].[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
'[CENTER][SIZE=3][I][FONT=georgia]Пᴩияᴛн᧐й иᴦᴩы нᴀ ʙʟᴀᴄᴋ ʀᴜssɪᴀ.[/FONT][/I][/SIZE][/CENTER]',
prefix: ACCEPT_PREFIX,
status: false,
    },
    {
        title: ' MG ',
        content:
        '[CENTER][COLOR=rgb(238, 0, 238)][SIZE=3][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
"[CENTER][I][SIZE=3][FONT=georgia]2.18. зᴀᴨᴩᴇщᴇн ᴍɢ (ᴍᴇᴛᴀɢᴀᴍɪɴɢ) — иᴄᴨ᧐ᴧьз᧐ʙᴀниᴇ ᧐᧐ᴄ инɸ᧐ᴩʍᴀции, ᴋ᧐ᴛ᧐ᴩую ʙᴀɯ ᴨᴇᴩᴄ᧐нᴀж ниᴋᴀᴋ нᴇ ʍ᧐ᴦ ᴨ᧐ᴧучиᴛь ʙ ɪᴄ ᴨᴩ᧐цᴇᴄᴄᴇ | ᴍᴜᴛᴇ 30 ʍинуᴛ[/FONT][/SIZE][/I][SIZE=3][FONT=georgia][I]<br><br>" +
"ᴨᴩиʍᴇчᴀниᴇ: иᴄᴨ᧐ᴧьз᧐ʙᴀниᴇ ᴄʍᴀйᴧ᧐ʙ ʙ ʙидᴇ ᴄиʍʙ᧐ᴧ᧐ʙ «))», «=ᴅ» зᴀᴨᴩᴇщᴇн᧐ ʙ ɪᴄ чᴀᴛᴇ.ᴨᴩиʍᴇчᴀниᴇ: ᴛᴇᴧᴇɸ᧐нн᧐ᴇ ᧐бщᴇниᴇ ᴛᴀᴋжᴇ яʙᴧяᴇᴛᴄя ɪᴄ чᴀᴛ᧐ʍ.[/I][/FONT][/SIZE][I][SIZE=3][FONT=georgia]иᴄᴋᴧючᴇниᴇ: зᴀ нᴀᴨиᴄᴀнный ᧐дн᧐ᴋᴩᴀᴛн᧐ ʙ᧐ᴨᴩ᧐ᴄиᴛᴇᴧьный «?» иᴧи ʙ᧐ᴄᴋᴧицᴀᴛᴇᴧьный «!» знᴀᴋ ʙ ɪᴄ чᴀᴛᴇ, нᴀᴋᴀзᴀниᴇ нᴇ ʙыдᴀᴇᴛᴄя.[/FONT][/SIZE][/I][/CENTER]<br><br>" +
"[CENTER][SIZE=3][FONT=georgia][COLOR=rgb(0, 255, 0)]Ꭷд᧐бᴩᴇн᧐[/COLOR], ЗаᴋᴩыᴛᎧ[COLOR=rgb(255, 0, 0)].[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
'[CENTER][SIZE=3][I][FONT=georgia]Пᴩияᴛн᧐й иᴦᴩы нᴀ ʙʟᴀᴄᴋ ʀᴜssɪᴀ.[/FONT][/I][/SIZE][/CENTER]',
prefix: ACCEPT_PREFIX,
status: false,
    },
    {
        title: ' DM ',
        content:
        '[CENTER][COLOR=rgb(238, 0, 238)][SIZE=3][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +

"[CENTER][SIZE=3][I][FONT=georgia]2.19. зᴀᴨᴩᴇщᴇн ᴅᴍ (ᴅᴇᴀᴛʜᴍᴀᴛᴄʜ) — убийᴄᴛʙ᧐ иᴧи нᴀнᴇᴄᴇниᴇ уᴩ᧐нᴀ бᴇз ʙᴇᴄᴋ᧐й ɪᴄ ᴨᴩичины | ᴊᴀɪʟ 60 ʍинуᴛ.[/FONT][/I][/SIZE][/CENTER]<br><br>" +
"[CENTER][SIZE=3][FONT=georgia][COLOR=rgb(0, 255, 0)]Ꭷд᧐бᴩᴇн᧐[/COLOR], ЗаᴋᴩыᴛᎧ[COLOR=rgb(255, 0, 0)].[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
'[CENTER][SIZE=3][I][FONT=georgia]Пᴩияᴛн᧐й иᴦᴩы нᴀ ʙʟᴀᴄᴋ ʀᴜssɪᴀ.[/FONT][/I][/SIZE][/CENTER]',
prefix: ACCEPT_PREFIX,
status: false,
    },
    {
        title: ' Масс дм ',
        content:
        '[CENTER][COLOR=rgb(238, 0, 238)][SIZE=3][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
"[CENTER][I][SIZE=3][FONT=georgia]2.20. зᴀᴨᴩᴇщᴇн ᴍᴀss ᴅᴍ (ᴍᴀss ᴅᴇᴀᴛʜᴍᴀᴛᴄʜ) — убийᴄᴛʙ᧐ иᴧи нᴀнᴇᴄᴇниᴇ уᴩ᧐нᴀ бᴇз ʙᴇᴄᴋ᧐й ɪᴄ ᴨᴩичины ᴛᴩᴇʍ иᴦᴩ᧐ᴋᴀʍ и б᧐ᴧᴇᴇ | ᴡᴀʀɴ / ʙᴀɴ 3 - 7 днᴇй.[/FONT][/SIZE][/I][/CENTER]<br><br>" +
"[CENTER][SIZE=3][FONT=georgia][COLOR=rgb(0, 255, 0)]Ꭷд᧐бᴩᴇн᧐[/COLOR], ЗаᴋᴩыᴛᎧ[COLOR=rgb(255, 0, 0)].[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
'[CENTER][SIZE=3][I][FONT=georgia]Пᴩияᴛн᧐й иᴦᴩы нᴀ ʙʟᴀᴄᴋ ʀᴜssɪᴀ.[/FONT][/I][/SIZE][/CENTER]',
prefix: ACCEPT_PREFIX,
status: false,
    },
    {
        title: 'Обход системы',
        content:
        '[CENTER][COLOR=rgb(238, 0, 238)][SIZE=3][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
"[CENTER][I][SIZE=3][FONT=georgia]2.21. зᴀᴨᴩᴇщᴇн᧐ ᴨыᴛᴀᴛьᴄя ᧐бх᧐диᴛь иᴦᴩ᧐ʙую ᴄиᴄᴛᴇʍу иᴧи иᴄᴨ᧐ᴧьз᧐ʙᴀᴛь ᴧюбыᴇ бᴀᴦи ᴄᴇᴩʙᴇᴩᴀ | ʙᴀɴ 15 - 30 днᴇй / ᴘᴇʀᴍʙᴀɴ (ᴨ᧐ ᴄ᧐ᴦᴧᴀᴄ᧐ʙᴀнию ᴄ ᴦᴀ, зᴦᴀ, ᴩуᴋ᧐ʙ᧐дᴄᴛʙ᧐ʍ ᴛᴇх. ᴄᴨᴇциᴀᴧиᴄᴛ᧐ʙ)[/FONT][/SIZE][/I][/CENTER]<br><br>" +
"[CENTER][SIZE=3][FONT=georgia][COLOR=rgb(0, 255, 0)]Ꭷд᧐бᴩᴇн᧐[/COLOR], ЗаᴋᴩыᴛᎧ[COLOR=rgb(255, 0, 0)].[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
'[CENTER][SIZE=3][I][FONT=georgia]Пᴩияᴛн᧐й иᴦᴩы нᴀ ʙʟᴀᴄᴋ ʀᴜssɪᴀ.[/FONT][/I][/SIZE][/CENTER]',
prefix: ACCEPT_PREFIX,
status: false,
    },
    {
        title: 'Чит/сборка/софт',
        content:
        '[CENTER][COLOR=rgb(238, 0, 238)][SIZE=3][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
"[CENTER][I][SIZE=3][FONT=georgia]2.22. зᴀᴨᴩᴇщᴇн᧐ хᴩᴀниᴛь / иᴄᴨ᧐ᴧьз᧐ʙᴀᴛь / ᴩᴀᴄᴨᴩ᧐ᴄᴛᴩᴀняᴛь ᴄᴛ᧐ᴩ᧐ннᴇᴇ ᴨᴩ᧐ᴦᴩᴀʍʍн᧐ᴇ ᧐бᴇᴄᴨᴇчᴇниᴇ иᴧи ᴧюбыᴇ дᴩуᴦиᴇ ᴄᴩᴇдᴄᴛʙᴀ, ᴨ᧐зʙ᧐ᴧяющиᴇ ᴨ᧐ᴧучиᴛь ᴨᴩᴇиʍущᴇᴄᴛʙ᧐ нᴀд дᴩуᴦиʍи иᴦᴩ᧐ᴋᴀʍи | ʙᴀɴ 15 - 30 днᴇй / ᴘᴇʀᴍʙᴀɴ[/FONT][/SIZE][/I][/CENTER]<br><br>" +
"[CENTER][SIZE=3][FONT=georgia][COLOR=rgb(0, 255, 0)]Ꭷд᧐бᴩᴇн᧐[/COLOR], ЗаᴋᴩыᴛᎧ[COLOR=rgb(255, 0, 0)].[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
'[CENTER][SIZE=3][I][FONT=georgia]Пᴩияᴛн᧐й иᴦᴩы нᴀ ʙʟᴀᴄᴋ ʀᴜssɪᴀ.[/FONT][/I][/SIZE][/CENTER]',
prefix: ACCEPT_PREFIX,
status: false,
    },
    {
        title: ' Реклама ',
        content:
        '[CENTER][COLOR=rgb(238, 0, 238)][SIZE=3][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
"[CENTER][I][SIZE=3][FONT=georgia]2.31. зᴀᴨᴩᴇщᴇн᧐ ᴩᴇᴋᴧᴀʍиᴩ᧐ʙᴀᴛь нᴀ ᴄᴇᴩʙᴇᴩᴀх ᴧюбыᴇ ᴨᴩ᧐ᴇᴋᴛы, ᴄᴇᴩʙᴇᴩы, ᴄᴀйᴛы, ᴄᴛ᧐ᴩ᧐нниᴇ ᴅɪsᴄᴏʀᴅ-ᴄᴇᴩʙᴇᴩы, ʏᴏᴜᴛᴜʙᴇ ᴋᴀнᴀᴧы и ᴛ᧐ʍу ᴨ᧐д᧐бн᧐ᴇ | ʙᴀɴ 7 днᴇй / ᴘᴇʀᴍʙᴀɴ.[/FONT][/SIZE][/I][/CENTER]<br><br>" +
"[CENTER][SIZE=3][FONT=georgia][COLOR=rgb(0, 255, 0)]Ꭷд᧐бᴩᴇн᧐[/COLOR], ЗаᴋᴩыᴛᎧ[COLOR=rgb(255, 0, 0)].[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
'[CENTER][SIZE=3][I][FONT=georgia]Пᴩияᴛн᧐й иᴦᴩы нᴀ ʙʟᴀᴄᴋ ʀᴜssɪᴀ.[/FONT][/I][/SIZE][/CENTER]',
prefix: ACCEPT_PREFIX,
status: false,
    },
    {
        title: ' Уход от наказании ',
        content:
        '[CENTER][COLOR=rgb(238, 0, 238)][SIZE=3][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +

"[CENTER][I][SIZE=3][FONT=georgia]2.34. зᴀᴨᴩᴇщᴇн ух᧐д ᧐ᴛ нᴀᴋᴀзᴀния | ʙᴀɴ 15 - 30 днᴇй (ᴄуʍʍиᴩуᴇᴛᴄя ᴋ ᧐бщᴇʍу нᴀᴋᴀзᴀнию д᧐ᴨ᧐ᴧниᴛᴇᴧьн᧐)[/FONT][/SIZE][/I][/CENTER]<br><br>" +
"[CENTER][SIZE=3][FONT=georgia][COLOR=rgb(0, 255, 0)]Ꭷд᧐бᴩᴇн᧐[/COLOR], ЗаᴋᴩыᴛᎧ[COLOR=rgb(255, 0, 0)].[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
'[CENTER][SIZE=3][I][FONT=georgia]Пᴩияᴛн᧐й иᴦᴩы нᴀ ʙʟᴀᴄᴋ ʀᴜssɪᴀ.[/FONT][/I][/SIZE][/CENTER]',
prefix: ACCEPT_PREFIX,
status: false,
    },
    {
        title: ' Неув обращение к адм ',
        content: 
        '[CENTER][COLOR=rgb(238, 0, 238)][SIZE=3][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +

"[CENTER][I][SIZE=3][FONT=georgia]2.54. зᴀᴨᴩᴇщᴇн᧐ нᴇуʙᴀжиᴛᴇᴧьн᧐ᴇ ᧐бᴩᴀщᴇниᴇ, ᧐ᴄᴋ᧐ᴩбᴧᴇниᴇ, нᴇᴀдᴇᴋʙᴀᴛн᧐ᴇ ᴨ᧐ʙᴇдᴇниᴇ, уᴦᴩ᧐зы ʙ ᴧюб᧐ʍ их ᴨᴩ᧐яʙᴧᴇнии ᴨ᧐ ᧐ᴛн᧐ɯᴇнию ᴋ ᴀдʍиниᴄᴛᴩᴀции | ᴍᴜᴛᴇ 180 ʍинуᴛ[/FONT][/SIZE][/I][/CENTER]<br><br>" +
"[CENTER][SIZE=3][FONT=georgia][COLOR=rgb(0, 255, 0)]Ꭷд᧐бᴩᴇн᧐[/COLOR], ЗаᴋᴩыᴛᎧ[COLOR=rgb(255, 0, 0)].[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
'[CENTER][SIZE=3][I][FONT=georgia]Пᴩияᴛн᧐й иᴦᴩы нᴀ ʙʟᴀᴄᴋ ʀᴜssɪᴀ.[/FONT][/I][/SIZE][/CENTER]',
prefix: ACCEPT_PREFIX,
status: false,
    },
    {
        title: ' Баг аним ',
        content:
        '[CENTER][COLOR=rgb(238, 0, 238)][SIZE=3][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +

"[CENTER][I][SIZE=3][FONT=georgia]2.55. зᴀᴨᴩᴇщᴀᴇᴛᴄя бᴀᴦ᧐юз ᴄʙязᴀнный ᴄ ᴀниʍᴀциᴇй ʙ ᴧюбых ᴨᴩ᧐яʙᴧᴇниях. | ᴊᴀɪʟ 60 / 120 ʍинуᴛ[/FONT][/SIZE][/I][/CENTER]<br><br>" +
"[CENTER][SIZE=3][FONT=georgia][COLOR=rgb(0, 255, 0)]Ꭷд᧐бᴩᴇн᧐[/COLOR], ЗаᴋᴩыᴛᎧ[COLOR=rgb(255, 0, 0)].[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
'[CENTER][SIZE=3][I][FONT=georgia]Пᴩияᴛн᧐й иᴦᴩы нᴀ ʙʟᴀᴄᴋ ʀᴜssɪᴀ.[/FONT][/I][/SIZE][/CENTER]',
prefix: ACCEPT_PREFIX,
status: false,
    },
    {
        title: '_____________________________Игровые чаты_______________________________',
        
    },
    {
        title: 'CapsLock',
        content:
        '[CENTER][COLOR=rgb(238, 0, 238)][SIZE=3][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
"[CENTER][I][SIZE=3][FONT=georgia]3.02. зᴀᴨᴩᴇщᴇн᧐ иᴄᴨ᧐ᴧьз᧐ʙᴀниᴇ ʙᴇᴩхнᴇᴦ᧐ ᴩᴇᴦиᴄᴛᴩᴀ (ᴄᴀᴘsʟᴏᴄᴋ) ᴨᴩи нᴀᴨиᴄᴀнии ᴧюб᧐ᴦ᧐ ᴛᴇᴋᴄᴛᴀ ʙ ᴧюб᧐ʍ чᴀᴛᴇ | ᴍᴜᴛᴇ 30 ʍинуᴛ[/FONT][/SIZE][/I][/CENTER]<br><br>" +
"[CENTER][SIZE=3][FONT=georgia][COLOR=rgb(0, 255, 0)]Ꭷд᧐бᴩᴇн᧐[/COLOR], ЗаᴋᴩыᴛᎧ[COLOR=rgb(255, 0, 0)].[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
'[CENTER][SIZE=3][I][FONT=georgia]Пᴩияᴛн᧐й иᴦᴩы нᴀ ʙʟᴀᴄᴋ ʀᴜssɪᴀ.[/FONT][/I][/SIZE][/CENTER]',
prefix: ACCEPT_PREFIX,
status: false,
    },
    {
       title: ' Упом род ',
       content:
      '[CENTER][COLOR=rgb(238, 0, 238)][SIZE=3][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
       "[CENTER][FONT=georgia][I][SIZE=3]3.04. зᴀᴨᴩᴇщᴇн᧐ ᧐ᴄᴋ᧐ᴩбᴧᴇниᴇ иᴧи ᴋ᧐ᴄʙᴇнн᧐ᴇ уᴨ᧐ʍинᴀниᴇ ᴩ᧐дных ʙнᴇ зᴀʙиᴄиʍ᧐ᴄᴛи ᧐ᴛ чᴀᴛᴀ (ɪᴄ иᴧи ᴏᴏᴄ) | ᴍᴜᴛᴇ 120 ʍинуᴛ / ʙᴀɴ 7 - 15 днᴇй[/SIZE][/I][/FONT][/CENTER]<br><br>" +
       "[CENTER][SIZE=3][FONT=georgia][COLOR=rgb(0, 255, 0)]Ꭷд᧐бᴩᴇн᧐[/COLOR], ЗаᴋᴩыᴛᎧ[COLOR=rgb(255, 0, 0)].[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
       '[CENTER][SIZE=3][I][FONT=georgia]Пᴩияᴛн᧐й иᴦᴩы нᴀ ʙʟᴀᴄᴋ ʀᴜssɪᴀ.[/FONT][/I][/SIZE][/CENTER]',
       prefix: ACCEPT_PREFIX,
       status: false,
    },
    {
        title: ' Флуд ',
        content:
        '[CENTER][COLOR=rgb(238, 0, 238)][SIZE=3][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
"[CENTER][I][SIZE=3][FONT=georgia]3.05. зᴀᴨᴩᴇщᴇн ɸᴧуд — 3 и б᧐ᴧᴇᴇ ᴨ᧐ʙᴛ᧐ᴩяющихᴄя ᴄ᧐᧐бщᴇний ᧐ᴛ ᧐дн᧐ᴦ᧐ и ᴛ᧐ᴦ᧐ жᴇ иᴦᴩ᧐ᴋᴀ | ᴍᴜᴛᴇ 30 ʍинуᴛ[/FONT][/SIZE][/I][/CENTER]<br><br>" +
"[CENTER][SIZE=3][FONT=georgia][COLOR=rgb(0, 255, 0)]Ꭷд᧐бᴩᴇн᧐[/COLOR], ЗаᴋᴩыᴛᎧ[COLOR=rgb(255, 0, 0)].[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
'[CENTER][SIZE=3][I][FONT=georgia]Пᴩияᴛн᧐й иᴦᴩы нᴀ ʙʟᴀᴄᴋ ʀᴜssɪᴀ.[/FONT][/I][/SIZE][/CENTER]',
prefix: ACCEPT_PREFIX,
status: false,
    },
    {
        title: ' Злоуп знаками ',
        content:
        '[CENTER][COLOR=rgb(238, 0, 238)][SIZE=3][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
"[CENTER][I][SIZE=3][FONT=georgia]3.06. зᴀᴨᴩᴇщᴇн᧐ зᴧ᧐уᴨ᧐ᴛᴩᴇбᴧᴇниᴇ знᴀᴋ᧐ʙ ᴨᴩᴇᴨинᴀния и ᴨᴩ᧐чих ᴄиʍʙ᧐ᴧ᧐ʙ | ᴍᴜᴛᴇ 30 ʍинуᴛ[/FONT][/SIZE][/I][/CENTER]<br><br>" +
"[CENTER][SIZE=3][FONT=georgia][COLOR=rgb(0, 255, 0)]Ꭷд᧐бᴩᴇн᧐[/COLOR], ЗаᴋᴩыᴛᎧ[COLOR=rgb(255, 0, 0)].[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
'[CENTER][SIZE=3][I][FONT=georgia]Пᴩияᴛн᧐й иᴦᴩы нᴀ ʙʟᴀᴄᴋ ʀᴜssɪᴀ.[/FONT][/I][/SIZE][/CENTER]',
prefix: ACCEPT_PREFIX,
status: false,
    },
    {
        title: ' Выдача себя за адм ',
        content:
        '[CENTER][COLOR=rgb(238, 0, 238)][SIZE=3][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
"[CENTER][I][SIZE=3][FONT=georgia]3.10. зᴀᴨᴩᴇщᴇнᴀ ʙыдᴀчᴀ ᴄᴇбя зᴀ ᴀдʍиниᴄᴛᴩᴀᴛ᧐ᴩᴀ, ᴇᴄᴧи ᴛᴀᴋ᧐ʙыʍ нᴇ яʙᴧяᴇᴛᴇᴄь | ʙᴀɴ 7 - 15   чᴄ ᴀдʍиниᴄᴛᴩᴀции[/FONT][/SIZE][/I][/CENTER]<br><br>" +
"[CENTER][SIZE=3][FONT=georgia][COLOR=rgb(0, 255, 0)]Ꭷд᧐бᴩᴇн᧐[/COLOR], ЗаᴋᴩыᴛᎧ[COLOR=rgb(255, 0, 0)].[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
'[CENTER][SIZE=3][I][FONT=georgia]Пᴩияᴛн᧐й иᴦᴩы нᴀ ʙʟᴀᴄᴋ ʀᴜssɪᴀ.[/FONT][/I][/SIZE][/CENTER]',
prefix: ACCEPT_PREFIX,
status: false,
    },
    {
        title: ' Слив ',
        content:
        '[CENTER][COLOR=rgb(238, 0, 238)][SIZE=3][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
"[CENTER][I][SIZE=3][FONT=georgia]3.08. зᴀᴨᴩᴇщᴇны ᴧюбыᴇ ɸ᧐ᴩʍы «ᴄᴧиʙᴀ» ᴨ᧐ᴄᴩᴇдᴄᴛʙ᧐ʍ иᴄᴨ᧐ᴧьз᧐ʙᴀния ᴦᴧ᧐бᴀᴧьных чᴀᴛ᧐ʙ | ᴘᴇʀᴍʙᴀɴ[/FONT][/SIZE][/I][/CENTER]<br><br>" +
"[CENTER][SIZE=3][FONT=georgia][COLOR=rgb(0, 255, 0)]Ꭷд᧐бᴩᴇн᧐[/COLOR], ЗаᴋᴩыᴛᎧ[COLOR=rgb(255, 0, 0)].[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
'[CENTER][SIZE=3][I][FONT=georgia]Пᴩияᴛн᧐й иᴦᴩы нᴀ ʙʟᴀᴄᴋ ʀᴜssɪᴀ.[/FONT][/I][/SIZE][/CENTER]',
prefix: ACCEPT_PREFIX,
status: false,
    },
    {
        title: ' Ввод заблуждение ',
        content:
        '[CENTER][COLOR=rgb(238, 0, 238)][SIZE=3][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +

"[CENTER][I][SIZE=3][FONT=georgia]3.11. зᴀᴨᴩᴇщᴇн᧐ ʙʙᴇдᴇниᴇ иᴦᴩ᧐ᴋ᧐ʙ ᴨᴩ᧐ᴇᴋᴛᴀ ʙ зᴀбᴧуждᴇниᴇ ᴨуᴛᴇʍ зᴧ᧐уᴨ᧐ᴛᴩᴇбᴧᴇния ᴋ᧐ʍᴀндᴀʍи | ʙᴀɴ 15 - 30 днᴇй / ᴘᴇʀᴍʙᴀɴ[/FONT][/SIZE][/I][/CENTER]<br><br>" +
"[CENTER][SIZE=3][FONT=georgia][COLOR=rgb(0, 255, 0)]Ꭷд᧐бᴩᴇн᧐[/COLOR], ЗаᴋᴩыᴛᎧ[COLOR=rgb(255, 0, 0)].[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
'[CENTER][SIZE=3][I][FONT=georgia]Пᴩияᴛн᧐й иᴦᴩы нᴀ ʙʟᴀᴄᴋ ʀᴜssɪᴀ.[/FONT][/I][/SIZE][/CENTER]',
prefix: ACCEPT_PREFIX,
status: false,
    },
    {
        title: ' Транслит ',
        content:
        '[CENTER][COLOR=rgb(238, 0, 238)][SIZE=3][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +

"[CENTER][I][SIZE=3][FONT=georgia]3.20. зᴀᴨᴩᴇщᴇн᧐ иᴄᴨ᧐ᴧьз᧐ʙᴀниᴇ ᴛᴩᴀнᴄᴧиᴛᴀ ʙ ᴧюб᧐ʍ из чᴀᴛ᧐ʙ | ᴍᴜᴛᴇ 30 ʍинуᴛ[/FONT][/SIZE][/I][/CENTER]<br><br>" +
"[CENTER][SIZE=3][FONT=georgia][COLOR=rgb(0, 255, 0)]Ꭷд᧐бᴩᴇн᧐[/COLOR], ЗаᴋᴩыᴛᎧ[COLOR=rgb(255, 0, 0)].[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
'[CENTER][SIZE=3][I][FONT=georgia]Пᴩияᴛн᧐й иᴦᴩы нᴀ ʙʟᴀᴄᴋ ʀᴜssɪᴀ.[/FONT][/I][/SIZE][/CENTER]',
prefix: ACCEPT_PREFIX,
status: false,
    },
{
    title: ' Реклама промо',
    content:
    '[CENTER][COLOR=rgb(238, 0, 238)][SIZE=3][FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +

"[CENTER][I][SIZE=3][FONT=georgia]3.21. зᴀᴨᴩᴇщᴀᴇᴛᴄя ᴩᴇᴋᴧᴀʍᴀ ᴨᴩ᧐ʍ᧐ᴋ᧐д᧐ʙ ʙ иᴦᴩᴇ, ᴀ ᴛᴀᴋжᴇ их уᴨ᧐ʍинᴀниᴇ ʙ ᴧюб᧐ʍ ʙидᴇ ʙ᧐ ʙᴄᴇх чᴀᴛᴀх. | ʙᴀɴ 30 днᴇй[/FONT][/SIZE][/I][/CENTER]<br><br>" +
"[CENTER][SIZE=3][FONT=georgia][COLOR=rgb(0, 255, 0)]Ꭷд᧐бᴩᴇн᧐[/COLOR], ЗаᴋᴩыᴛᎧ[COLOR=rgb(255, 0, 0)].[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
'[CENTER][SIZE=3][I][FONT=georgia]Пᴩияᴛн᧐й иᴦᴩы нᴀ ʙʟᴀᴄᴋ ʀᴜssɪᴀ.[/FONT][/I][/SIZE][/CENTER]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
    title: '____________________________Раздел биографии.___________________________',
    
},
{
    title: ' Отказано ',
    content: 
    '[CENTER][FONT=georgia][I][COLOR=rgb(255, 0, 255)][SIZE=3]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/COLOR][/I][/FONT][/CENTER]<br><br>' +
"[CENTER][SIZE=3][I][FONT=georgia]Вᴀɯᴀ ʀᴏʟᴇ ᴘʟᴀʏ би᧐ᴦᴩᴀɸия [COLOR=rgb(255, 0, 0)]᧐ᴛᴋᴀзᴀн᧐[/COLOR].[/FONT]<br><br>" +
"[FONT=georgia]Вниʍᴀᴛᴇᴧьн᧐ ᴨᴩ᧐чиᴛᴀйᴛᴇ ᴨᴩᴀʙиᴧᴀ ᴄ᧐здᴀния ʀᴘ - би᧐ᴦᴩᴀɸий зᴀᴋᴩᴇᴨᴧᴇнныᴇ ʙ дᴀнн᧐ʍ ᴩᴀздᴇᴧᴇ.[/FONT][/I][/SIZE][/CENTER]<br><br>" +
'[CENTER][I][SIZE=3][FONT=times new roman]Пᴩияᴛн᧐й иᴦᴩы нᴀ нᴀɯᴇʍ ᴄᴇᴩʙᴇᴩᴇ.[/FONT][/SIZE][/I][/CENTER]',
prefix: OTKAZBIO_PREFIX,
status: false,
    
},
{
    title: ' Одобрено',
    content:
    '[CENTER][FONT=georgia][I][COLOR=rgb(255, 0, 255)][SIZE=3]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/COLOR][/I][/FONT][/CENTER]<br><br>' +
    "[CENTER][SIZE=3][FONT=georgia][I]Bᴀɯᴀ ᴩᴨ би᧐ᴦᴩᴀɸия ᴨ᧐ᴧучᴀᴇᴛ ᴄᴛᴀᴛуᴄ: [COLOR=rgb(0, 255, 0)]᧐д᧐бᴩᴇн᧐[/COLOR].[/I][/FONT][/SIZE][/CENTER]<br><br>" +
    '[CENTER][I][SIZE=3][FONT=times new roman]Пᴩияᴛн᧐й иᴦᴩы нᴀ нᴀɯᴇʍ ᴄᴇᴩʙᴇᴩᴇ.[/FONT][/SIZE][/I][/CENTER]',
    prefix: ODOBRENOBIO_PREFIX,
    status: false,
},
{
    title: 'Заголовок не по форме ',
    content:
    '[CENTER][FONT=georgia][I][COLOR=rgb(255, 0, 255)][SIZE=3]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/COLOR][/I][/FONT][/CENTER]<br><br>' +
    "[CENTER][SIZE=3][I][FONT=georgia]Вᴀɯᴀ ᴩᴨ би᧐ᴦᴩᴀɸия ᴨ᧐ᴧучᴀᴇᴛ ᴄᴛᴀᴛуᴄ: ᧐ᴛᴋᴀзᴀн᧐.[/FONT][FONT=georgia]ᴨᴩичин᧐й ᧐ᴛᴋᴀзᴀ ᴨ᧐ᴄᴧужиᴧ᧐ - зᴀᴦ᧐ᴧ᧐ʙ᧐ᴋ ᴄ᧐здᴀʙᴀᴇʍ᧐й ᴛᴇʍы д᧐ᴧжᴇн быᴛь нᴀᴨиᴄᴀн ᴄᴛᴩ᧐ᴦ᧐ ᴨ᧐ дᴀнн᧐й ɸ᧐ᴩʍᴇ: “ ʀᴏʟᴇᴘʟᴀʏ би᧐ᴦᴩᴀɸия ᴦᴩᴀждᴀнинᴀ иʍя ɸᴀʍиᴧия. “[/FONT][/I][/SIZE][/CENTER]<br><br>" +
    '[CENTER][I][SIZE=3][FONT=times new roman]Пᴩияᴛн᧐й иᴦᴩы нᴀ нᴀɯᴇʍ ᴄᴇᴩʙᴇᴩᴇ.[/FONT][/SIZE][/I][/CENTER]',
prefix: OTKAZBIO_PREFIX,
status: false,
    
},
{
    title: 'не по форме ',
    content: 
    '[CENTER][FONT=georgia][I][COLOR=rgb(255, 0, 255)][SIZE=3]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/COLOR][/I][/FONT][/CENTER]<br><br>' +
    "[CENTER][SIZE=3][I][FONT=georgia]Вᴀɯᴀ ᴩᴨ би᧐ᴦᴩᴀɸия [COLOR=rgb(255, 0, 0)]᧐ᴛᴋᴀзᴀн᧐[/COLOR].[/FONT][/I][/SIZE]<br>" +

"[I][SIZE=3][FONT=georgia]ᴨᴩичинᴀ: ʙᴀɯᴀ ᴩᴨ би᧐ᴦᴩᴀɸия ᴄ᧐ᴄᴛᴀʙᴧᴇн᧐ нᴇ ᴨ᧐ ɸ᧐ᴩʍᴇ.[/FONT][/SIZE][/I][FONT=georgia][I][SIZE=3][/SIZE][/I][/FONT][/CENTER]<br><br>" +
'[CENTER][I][SIZE=3][FONT=times new roman]Пᴩияᴛн᧐й иᴦᴩы нᴀ нᴀɯᴇʍ ᴄᴇᴩʙᴇᴩᴇ.[/FONT][/SIZE][/I][/CENTER]',
prefix: OTKAZBIO_PREFIX,
status: false,
},
{
    title: 'Заголовка имя англ ',
    content:
    '[CENTER][FONT=georgia][I][COLOR=rgb(255, 0, 255)][SIZE=3]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/COLOR][/I][/FONT][/CENTER]<br><br>' +
    "[CENTER][I][SIZE=3][FONT=georgia]Вᴀɯᴀ ʀᴘ би᧐ᴦᴩᴀɸия ᴨ᧐ᴧучᴀᴇᴛ ᴄᴛᴀᴛуᴄ: [COLOR=rgb(255, 0, 0)]᧐ᴛᴋᴀзaно.[/COLOR]<br>" +


"Иʍя ʙᴀɯᴇᴦ᧐ ᴨᴇᴩᴄ᧐нᴀжᴀ ʙ зᴀᴦ᧐ᴧ᧐ʙᴋᴇ д᧐ᴧжᴇн быᴛь нᴀᴨиᴄᴀн ᴩуᴄᴄᴋиʍи буᴋʙᴀʍи.[/FONT][/SIZE][/I][/CENTER]<br><br>" +
'[CENTER][I][SIZE=3][FONT=times new roman]Пᴩияᴛн᧐й иᴦᴩы нᴀ нᴀɯᴇʍ ᴄᴇᴩʙᴇᴩᴇ.[/FONT][/SIZE][/I][/CENTER]',
prefix: OTKAZBIO_PREFIX,
status: false,

},
{
    title: ' 3-го лиц',
    content:
    '[CENTER][FONT=georgia][I][COLOR=rgb(255, 0, 255)][SIZE=3]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/COLOR][/I][/FONT][/CENTER]<br><br>' +
    "[CENTER][I][SIZE=3][FONT=georgia]Вᴀɯᴀ ᴩᴨ би᧐ᴦᴩᴀɸия ᴨ᧐ᴧучᴀᴇᴛ ᴄᴛᴀᴛуᴄ: [COLOR=rgb(255, 0, 0)]᧐ᴛᴋᴀзᴀн᧐.[/COLOR]<br>" +


"Пᴩичин᧐й ᧐ᴛᴋᴀзᴀ ᴨ᧐ᴄᴧужиᴧ᧐ - би᧐ᴦᴩᴀɸия д᧐ᴧжнᴀ быᴛь нᴀᴨиᴄᴀнᴀ ᧐ᴛ ᴨᴇᴩʙ᧐ᴦ᧐ ᴧицᴀ ᴨᴇᴩᴄ᧐нᴀжᴀ.[/FONT][/SIZE][/I][/CENTER]<br><br>" +
'[CENTER][I][SIZE=3][FONT=times new roman]Пᴩияᴛн᧐й иᴦᴩы нᴀ нᴀɯᴇʍ ᴄᴇᴩʙᴇᴩᴇ.[/FONT][/SIZE][/I][/CENTER]',
prefix: OTKAZBIO_PREFIX,
status: false,
},
{
    title: 'Копипаст ',
    content:
    '[CENTER][FONT=georgia][I][COLOR=rgb(255, 0, 255)][SIZE=3]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/COLOR][/I][/FONT][/CENTER]<br><br>' +
    "[CENTER][I][SIZE=3][FONT=georgia]Вᴀɯᴀ ᴩᴨ би᧐ᴦᴩᴀɸия ᴨ᧐ᴧучᴀᴇᴛ ᴄᴛᴀᴛуᴄ: [/FONT][/SIZE][/I][COLOR=rgb(255, 0, 0)][I][SIZE=3][FONT=georgia]᧐ᴛᴋᴀзᴀн᧐.[/FONT][/SIZE][/I][/COLOR]<br>" +


"[I][SIZE=3][FONT=georgia]Пᴩичин᧐й ᧐ᴛᴋᴀзᴀ ᴨ᧐ᴄᴧужиᴧ᧐ - зᴀᴨᴩᴇщᴇн᧐ ᴨ᧐ᴧн᧐ᴇ и чᴀᴄᴛичн᧐ᴇ ᴋ᧐ᴨиᴩ᧐ʙᴀниᴇ би᧐ᴦᴩᴀɸий из дᴀнн᧐ᴦ᧐ ᴩᴀздᴇᴧᴀ иᴧи из ᴩᴀздᴇᴧ᧐ʙ ʀᴘ би᧐ᴦᴩᴀɸий дᴩуᴦих ᴄᴇᴩʙᴇᴩ᧐ʙ.[/FONT][/SIZE][/I][/CENTER]<br><br>" +
'[CENTER][I][SIZE=3][FONT=times new roman]Пᴩияᴛн᧐й иᴦᴩы нᴀ нᴀɯᴇʍ ᴄᴇᴩʙᴇᴩᴇ.[/FONT][/SIZE][/I][/CENTER]',
prefix: OTKAZBIO_PREFIX,
status: false,
},
{
    title: 'Возраст не совпадает',
    content:
    '[CENTER][FONT=georgia][I][COLOR=rgb(255, 0, 255)][SIZE=3]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/COLOR][/I][/FONT][/CENTER]<br><br>' +
    "[CENTER][SIZE=3][FONT=georgia][I]Вᴀɯᴀ ʀᴏʟᴇ ᴘʟᴀʏ би᧐ᴦᴩᴀɸия [COLOR=rgb(255, 0, 0)]᧐ᴛᴋᴀзᴀн᧐.[/COLOR][/I][/FONT][/SIZE][I][SIZE=3][FONT=georgia][/FONT][/SIZE][/I]<br>" +

"[SIZE=3][FONT=georgia][I][COLOR=rgb(255, 255, 255)]Г᧐д ᴩ᧐ждᴇниᴇ нᴇ ᴄ᧐ʙᴨᴀдᴀᴇᴛ ᴄ ʙ᧐зᴩᴀᴄᴛ᧐ʍ.[/COLOR][/I][/FONT][/SIZE][/CENTER]<br><br>" +
'[CENTER][I][SIZE=3][FONT=times new roman]Пᴩияᴛн᧐й иᴦᴩы нᴀ нᴀɯᴇʍ ᴄᴇᴩʙᴇᴩᴇ.[/FONT][/SIZE][/I][/CENTER]',
prefix: OTKAZBIO_PREFIX,
status: false,
},

   
    



    


   
    
    
    ];
 
$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
	// Добавление кнопок при загрузке страницы
    addButton('🍁На рассмотрение 🍁', 'pin');
    addButton('🪙КП', 'teamProject');
    addButton('🔴Га', 'Ga');
    addButton('👤Спецу', 'Spec');
    addButton('☘️Одобрено', 'accepted');
    addButton('❌Отказано', 'unaccept');
    addButton('👤Тех. Специалисту', 'Texy');
    addButton('🏛️Рассмотрено', 'Rasmotreno');
    addButton('❗Закрыто','Close');
    addButton('🤍Вердикты', 'selectAnswer');
 
 
	// Поиск информации о теме
	const threadData = getThreadData();
 
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#Ga').click(() => editThreadData(GA_PREFIX, true));
	$('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#Texy').click(() => editThreadData(TEX_PREFIX, true));
	$('button#Rasmotreno').click(() => editThreadData(RASSMOTENO_PREFIX, false));
	$('button#Close').click(() => editThreadData(CLOSE_PREFIX, false));
 
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