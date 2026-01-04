// ==UserScript==
// @name         Скрипт для Старшего Состава
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  Скрипт для СС, по вопросам писать в вк @michael.angels
// @author       Michael_Angels
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://sun9-71.userapi.com/impg/7sgrrs9v2DIiL3bTkazptxwcZPvTk2S0TrkIrA/0VY1VtVbnLI.jpg?size=800x800&quality=95&sign=ddbced0d17dbc4ee9af16d4a4b8e5ff3&c_uniq_tag=DLwZAfslyk7f9PkQiKMty22uG3P8iPp05Qx7XD95J5o&type=album
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/485894/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%A1%D1%82%D0%B0%D1%80%D1%88%D0%B5%D0%B3%D0%BE%20%D0%A1%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/485894/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%A1%D1%82%D0%B0%D1%80%D1%88%D0%B5%D0%B3%D0%BE%20%D0%A1%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%B0.meta.js
// ==/UserScript==

(function () {
	'use strict';
	const buttons = [

     {
	  title: '>>>> Одобрено у Армии, ГИБДД, УМВД, ФСИН, ФСб <<<<',
        dpstyle: 'oswald: 3px; border-radius:  20px; color: #fff; background: #2969B0; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
},
    {
	  title: '| Рядовой |',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый сотрудник.[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка для постановления на должность [COLOR=#2C82C9] Рядового [/COLOR] получает статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре подходите к нашему зданию и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
   status: false,
    },
{
	  title: '| Ефрейтор |',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый {{ user.mention }}[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка для повышения на должность [COLOR=#2C82C9] Ефрейтора [/COLOR] получает статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре подходите к нашему зданию и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[B][CENTER][SIZE=4][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
   status: false,
},
{
	  title: '| Сержант |',
     dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый {{ user.mention }}[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка для повышения на должность[COLOR=#2C82C9] Сержанта [/COLOR] получает статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре подходите к нашему зданию и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[B][CENTER][SIZE=4][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
   status: false,
},
    {
	  title: '| Старшина |',
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый {{ user.mention }}[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка для повышения на должность [COLOR=#2C82C9] Старшины [/COLOR] получает статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре подходите к нашему зданию и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
   status: false,
},
    {
	  title: '| Прапорщик |',
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый сотрудник.[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка для повышения на должность [COLOR=#2C82C9] Прапорщика [/COLOR] получает статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре подходите к нашему зданию и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
   status: false,
    },
     {
	  title: '| Лейтенант |',
          dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый сотрудник.[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка для повышения на должность [COLOR=ORANGE] Лейтенанта [/COLOR] получает статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре подходите к нашему зданию и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
   status: false,
    },
     {
	  title: '| Капитан |',
          dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый сотрудник.[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка для повышения на должность [COLOR=#2C82C9] Капитана [/COLOR] получает статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре подходите к нашему зданию и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
   status: false,
    },
    {
      title: '>>> Восстановление у Армии, ГИБДД, УМВД, ФСИН, ФСБ <<<',
        dpstyle: 'oswald: 3px; border-radius:  20px; color: #fff; background: #2969B0; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
    },
        {
            title: '| Рядовой |',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
                       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, бывший сотрудник нашей фракции.[/COLOR][/CENTER][/SIZE][/FONT][/B]<br><br>"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление на восстановление во фракцию получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander] Вы будете поставлены на титул[/COLOR][COLOR=#2C82C9] Рядового. [/COLOR][/B][/CENTER][/FONT][/SIZE]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре, подходите к нашему зданию и позвоните нам.[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
   status: false,
        },
         {
            title: '| Ефрейтор |',
              dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
                       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, бывший сотрудник нашей фракции.[/COLOR][/CENTER][/SIZE][/FONT][/B]<br><br>"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление на восстановление во фракцию получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander] Вы будете поставлены на титул[/COLOR][COLOR=#2C82C9] Ефрейтора [/COLOR][/B][/CENTER][/FONT][/SIZE]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре, подходите к нашему зданию и позвоните нам.[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
   status: false,
        },
                 {
            title: '| Сержант |',
                      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
                       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, бывший сотрудник нашей фракции.[/COLOR][/CENTER][/SIZE][/FONT][/B]<br><br>"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление на восстановление во фракцию получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander] Вы будете поставлены на титул[/COLOR][COLOR=#2C82C9] Сержанта [/COLOR][/B][/CENTER][/FONT][/SIZE]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре, подходите к нашему зданию и позвоните нам.[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
   status: false,
        },
          {
            title: '| Старшина |',
               dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
                       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, бывший сотрудник нашей фракции.[/COLOR][/CENTER][/SIZE][/FONT][/B]<br><br>"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление на восстановление во фракцию получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander] Вы будете поставлены на титул[/COLOR][COLOR=#2C82C9] Старшины [/COLOR][/B][/CENTER][/FONT][/SIZE]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре, подходите к нашему зданию и позвоните нам.[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
   status: false,
        },
             {
            title: '| Прапорщик |',
                  dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
                       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, бывший сотрудник нашей фракции.[/COLOR][/CENTER][/SIZE][/FONT][/B]<br><br>"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление на восстановление во фракцию получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander] Вы будете поставлены на титул[/COLOR][COLOR=#2C82C9] Прапорщика [/COLOR][/B][/CENTER][/FONT][/SIZE]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре, подходите к нашему зданию и позвоните нам.[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
   status: false,
        },
                   {
            title: '| Лейтенант |',
                        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
                       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, бывший сотрудник нашей фракции.[/COLOR][/CENTER][/SIZE][/FONT][/B]<br><br>"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление на восстановление во фракцию получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander] Вы будете поставлены на титул[/COLOR][COLOR=#2C82C9] Лейтенанта [/COLOR][/B][/CENTER][/FONT][/SIZE]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре, подходите к нашему зданию и позвоните нам.[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
   status: false,
        },
         {
            title: '| Капитан |',
              dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
                       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, бывший сотрудник нашей фракции.[/COLOR][/CENTER][/SIZE][/FONT][/B]<br><br>"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление на восстановление во фракцию получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander] Вы будете поставлены на титул[/COLOR][COLOR=#2C82C9] Капитана [/COLOR][/B][/CENTER][/FONT][/SIZE]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре, подходите к нашему зданию и позвоните нам.[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
   status: false,
        },
    {
	  title: '>>>>>>>>>>>>>>> Одобрено Пра-во <<<<<<<<<<<<<<<<',
        dpstyle: 'oswald: 3px; border-radius:  20px; color: #fff; background: green; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
},
{
	  title: '| Водитель |',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый сотрудник.[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка для постановления на должность [COLOR=#61BD6D] Водителя [/COLOR] получает статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре подходите к зданию правительства и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
   status: false,
    },
    {
	  title: '| Охранник |',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый сотрудник.[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка для повышения на должность [COLOR=#61BD6D] Охранника [/COLOR] статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре подходите к зданию правительства и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
   status: false,
    },
    {
	  title: '| Начальник охрнны |',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый сотрудник.[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка для повышения на должность [COLOR=#61BD6D] Начальника Охранны [/COLOR] статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре подходите к зданию правительства и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
   status: false,
    },
    {
	  title: '| Секретарь |',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый сотрудник.[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка для повышения на должность [COLOR=#61BD6D] Секретаря [/COLOR] статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре подходите к зданию правительства и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
   status: false,
    },
    {
	  title: '| Советник |',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый сотрудник.[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка для повышения на должность [COLOR=#61BD6D] Советника [/COLOR] статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре подходите к зданию правительства и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
   status: false,
    },
    {
	  title: '| Лицензер |',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый сотрудник.[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка для повышения на должность [COLOR=#61BD6D] Лицензера [/COLOR] статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре подходите к зданию правительства и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
   status: false,
    },
    {
	  title: '| Адвокат |',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый сотрудник.[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка для повышения на должность [COLOR=#61BD6D] Адвоката [/COLOR] статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре подходите к зданию правительства и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
   status: false,
    },
     {
            title: '>>>>>>>>>>>> Восстановление Пра-во <<<<<<<<<<<<',
            dpstyle: 'oswald: 3px; border-radius:  20px; color: #fff; background: green; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
        },
         {
            title: '| Водитель |',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
                       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, бывший сотрудник нашей фракции.[/COLOR][/CENTER][/SIZE][/FONT][/B]<br><br>"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление на восстановление во фракцию получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander] Вы будете поставлены на титул[/COLOR][COLOR=#61BD6D] Водителя [/COLOR][/B][/CENTER][/FONT][/SIZE]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре, подходите к зданию Правительства и позвоните нам.[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
   status: false,
        },
              {
            title: '| Охранник |',
                  dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
                       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, бывший сотрудник нашей фракции.[/COLOR][/CENTER][/SIZE][/FONT][/B]<br><br>"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление на восстановление во фракцию получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander] Вы будете поставлены на титул[/COLOR][COLOR=#61BD6D] Охранника [/COLOR][/B][/CENTER][/FONT][/SIZE]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре, подходите к зданию Правительства и позвоните нам.[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
   status: false,
        },
              {
            title: '| Начальник Охранны |',
                  dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
                       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, бывший сотрудник нашей фракции.[/COLOR][/CENTER][/SIZE][/FONT][/B]<br><br>"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление на восстановление во фракцию получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander] Вы будете поставлены на титул[/COLOR][COLOR=#61BD6D] Начальника Охранны [/COLOR][/B][/CENTER][/FONT][/SIZE]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре, подходите к зданию Правительства и позвоните нам.[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
   status: false,
        },
              {
            title: '| Секретарь |',
                  dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
                       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, бывший сотрудник нашей фракции.[/COLOR][/CENTER][/SIZE][/FONT][/B]<br><br>"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление на восстановление во фракцию получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander] Вы будете поставлены на титул[/COLOR][COLOR=#61BD6D] Секретаря [/COLOR][/B][/CENTER][/FONT][/SIZE]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре, подходите к зданию Правительства и позвоните нам.[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
   status: false,
        },
              {
            title: '| Советник |',
            content:
                       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, бывший сотрудник нашей фракции.[/COLOR][/CENTER][/SIZE][/FONT][/B]<br><br>"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление на восстановление во фракцию получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander] Вы будете поставлены на титул[/COLOR][COLOR=#61BD6D] Советника [/COLOR][/B][/CENTER][/FONT][/SIZE]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре, подходите к зданию Правительства и позвоните нам.[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
   status: false,
        },
              {
            title: '| Лицензер |',
                  dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
                       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, бывший сотрудник нашей фракции.[/COLOR][/CENTER][/SIZE][/FONT][/B]<br><br>"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление на восстановление во фракцию получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander] Вы будете поставлены на титул[/COLOR][COLOR=#61BD6D] Лицензера [/COLOR][/B][/CENTER][/FONT][/SIZE]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре, подходите к зданию Правительства и позвоните нам.[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
   status: false,
        },
              {
            title: '| Адвокат |',
                  dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
                       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, бывший сотрудник нашей фракции.[/COLOR][/CENTER][/SIZE][/FONT][/B]<br><br>"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление на восстановление во фракцию получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander] Вы будете поставлены на титул[/COLOR][COLOR=#61BD6D] Адвоката [/COLOR][/B][/CENTER][/FONT][/SIZE]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре, подходите к зданию Правительства и позвоните нам.[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
   status: false,
        },
{
	  	 title: '>>>>>>>>>>>>>>>>>> Одобрено ЦБ <<<<<<<<<<<<<<<<<<',
    dpstyle: 'oswald: 3px; border-radius:  20px; color: #fff; background: #EB6B56; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
},
     {
	  title: '| Интерн |',
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый сотрудник.[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка для постановления на должность [COLOR=#D14841] Интерна [/COLOR] получает статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре подходите к зданию больницы г. Арзаамас или г. Лыткарино и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
   status: false,
    },
    {
	  title: '| Парамедик |',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый сотрудник.[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка для повышения на должность [COLOR=#D14841] Парамедика [/COLOR] получает статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре подходите к зданию больницы г. Арзамаса или г. Лыткарино и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
   status: false,
    },
        {
	  title: '| Фельдшер |',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый сотрудник.[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка для повышения на должность [COLOR=#D14841] Фельдшера [/COLOR]получает статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре подходите к зданию больницы г. Арзамаса или г. Лыткарино и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
   status: false,
    },
            {
	  title: '| Нарколог |',
                dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый сотрудник.[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка для повышения на должность [COLOR=#D14841] Нарколог [/COLOR]получает статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре подходите к зданию больницы г. Арзамаса или г. Лыткарино и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
   status: false,
    },
            {
	  title: '| Педиатр |',
                dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый сотрудник.[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка для повышения на должность [COLOR=#D14841] Педиатра [/COLOR]получает статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре подходите к зданию больницы г. Арзамаса или г. Лыткарино и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
   status: false,
    },
            {
	  title: '| Терапевт |',
                dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый сотрудник.[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка для повышения на должность [COLOR=#D14841] Терапевта [/COLOR]получает статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре подходите к зданию больницы г. Арзамаса или г. Лыткарино и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
   status: false,
    },
            {
	  title: '| Травмотолог |',
                dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый сотрудник.[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка для повышения на должность [COLOR=#D14841] Травмотолога [/COLOR]получает статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре подходите к зданию больницы г. Арзамаса или г. Лыткарино и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
   status: false,
    },
     {
            title: '>>>>>>>>>>>>>>> Восстановление ЦБ <<<<<<<<<<<<<<<',
           dpstyle: 'oswald: 3px; border-radius:  20px; color: #fff; background: #EB6B56; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
        },
              {
            title: '| Интерн |',
                  dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
                       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, бывший сотрудник нашей фракции.[/COLOR][/CENTER][/SIZE][/FONT][/B]<br><br>"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление на восстановление во фракцию получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander] Вы будете поставлены на титул[/COLOR][COLOR=#D14841] Интерна [/COLOR][/B][/CENTER][/FONT][/SIZE]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре, подходите к зданию больницы г. Арзамас или г. Лыткарино и позвоните нам.[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
   status: false,
        },
                  {
            title: '| Парамедик |',
                      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
                       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, бывший сотрудник нашей фракции.[/COLOR][/CENTER][/SIZE][/FONT][/B]<br><br>"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление на восстановление во фракцию получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander] Вы будете поставлены на титул[/COLOR][COLOR=#D14841] Парамедика [/COLOR][/B][/CENTER][/FONT][/SIZE]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре, подходите к зданию больницы г. Арзамас или г. Лыткарино и позвоните нам.[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
   status: false,
        },
                  {
            title: '| Фельдшер |',
                      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
                       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, бывший сотрудник нашей фракции.[/COLOR][/CENTER][/SIZE][/FONT][/B]<br><br>"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление на восстановление во фракцию получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander] Вы будете поставлены на титул[/COLOR][COLOR=#D14841] Фельдешра [/COLOR][/B][/CENTER][/FONT][/SIZE]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре, подходите к зданию больницы г. Арзамас или г. Лыткарино и позвоните нам.[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
   status: false,
        },
                  {
            title: '| Нарколог |',
                      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
                       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, бывший сотрудник нашей фракции.[/COLOR][/CENTER][/SIZE][/FONT][/B]<br><br>"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление на восстановление во фракцию получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander] Вы будете поставлены на титул[/COLOR][COLOR=#D14841] Нарколога [/COLOR][/B][/CENTER][/FONT][/SIZE]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре, подходите к зданию больницы г. Арзамас или г. Лыткарино и позвоните нам.[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
   status: false,
        },
                   {
            title: '| Педиатр |',
                       dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
                       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, бывший сотрудник нашей фракции.[/COLOR][/CENTER][/SIZE][/FONT][/B]<br><br>"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление на восстановление во фракцию получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander] Вы будете поставлены на титул[/COLOR][COLOR=#D14841] Педиатра [/COLOR][/B][/CENTER][/FONT][/SIZE]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре, подходите к зданию больницы г. Арзамас или г. Лыткарино и позвоните нам.[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
   status: false,
        },
                  {
            title: '| Терапевт |',
                      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
                       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, бывший сотрудник нашей фракции.[/COLOR][/CENTER][/SIZE][/FONT][/B]<br><br>"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление на восстановление во фракцию получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander] Вы будете поставлены на титул[/COLOR][COLOR=#14841] Терапевта [/COLOR][/B][/CENTER][/FONT][/SIZE]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре, подходите к зданию больницы г. Арзамас или г. Лыткарино и позвоните нам.[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
   status: false,
        },
                  {
            title: '| Травмотолог |',
                      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
                       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, бывший сотрудник нашей фракции.[/COLOR][/CENTER][/SIZE][/FONT][/B]<br><br>"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление на восстановление во фракцию получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander] Вы будете поставлены на титул[/COLOR][COLOR=#D14841] Травмотолога [/COLOR][/B][/CENTER][/FONT][/SIZE]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре, подходите к зданию больницы г. Арзамас или г. Лыткарино и позвоните нам.[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
   status: false,
        },
{
	  title: '>>>>>>>>>>>>>>> Одобрено СМИ <<<<<<<<<<<<<<<',
    dpstyle: 'oswald: 3px; border-radius:  20px; color: #fff; background: orange; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
},
 {
	  title: '| Практикант |',
     dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый сотрудник.[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка для постановления на должность [COLOR=ORANGE] Прктиканта [/COLOR] получает статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре подходите к зданию СМИ и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
   status: false,
    },
         {
	  title: '| Фотограф |',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый сотрудник.[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка для повышения на должность [COLOR=ORANGE] Фотографа [/COLOR] получает статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре подходите к зданию СМИ и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
   status: false,
    },
                 {
	  title: '| Журналист |',
                     dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый сотрудник.[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка для повышения на должность [COLOR=ORANGE] Журналиста [/COLOR] получает статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре подходите к зданию СМИ и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
   status: false,
    },
                 {
	  title: '| Корреспондент |',
                     dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый сотрудник.[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка для повышения на должность [COLOR=ORANGE] Корреспондента [/COLOR] получает статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре подходите к зданию СМИ и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
   status: false,
    },
                    {
	  title: '| Ведущий |',
                        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый сотрудник.[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка для повышения на должность [COLOR=ORANGE] Ведущего [/COLOR] получает статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре подходите к зданию СМИ и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
   status: false,
    },
                  {
	  title: '| Редактор |',
                      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый сотрудник.[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка для повышения на должность [COLOR=ORANGE] Редактора [/COLOR] получает статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре подходите к зданию СМИ и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
   status: false,
    },
                    {
	  title: '| Маркетолог |',
                        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый сотрудник.[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка для повышения на должность [COLOR=ORANGE] Маркетолога [/COLOR] получает статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре подходите к зданию СМИ и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
   status: false,
    },
    {
            title: '>>>>>>>>>>>>>>> Восстановление СМИ <<<<<<<<<<<<<<<',
            dpstyle: 'oswald: 3px; border-radius:  20px; color: #fff; background: orange; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
        },
                  {
            title: '| Практикант |',
                      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
                       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, бывший сотрудник нашей фракции.[/COLOR][/CENTER][/SIZE][/FONT][/B]<br><br>"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление на восстановление во фракцию получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander] Вы будете поставлены на титул[/COLOR][COLOR=ORANGE] Практиканта [/COLOR][/B][/CENTER][/FONT][/SIZE]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре, подходите к зданию СМИ и позвоните нам.[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
   status: false,
        },
                {
            title: '| Фотограф |',
                    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
                       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, бывший сотрудник нашей фракции.[/COLOR][/CENTER][/SIZE][/FONT][/B]<br><br>"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление на восстановление во фракцию получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander] Вы будете поставлены на титул[/COLOR][COLOR=ORANGE] Фотографа [/COLOR][/B][/CENTER][/FONT][/SIZE]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре, подходите к зданию СМИ и позвоните нам.[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
   status: false,
        },
                {
            title: '| Журналист |',
                    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
                       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, бывший сотрудник нашей фракции.[/COLOR][/CENTER][/SIZE][/FONT][/B]<br><br>"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление на восстановление во фракцию получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander] Вы будете поставлены на титул[/COLOR][COLOR=ORANGE] Журналиста [/COLOR][/B][/CENTER][/FONT][/SIZE]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре, подходите к зданию СМИ и позвоните нам.[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
   status: false,
        },
                {
            title: '| Корреспондент |',
                    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
                       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, бывший сотрудник нашей фракции.[/COLOR][/CENTER][/SIZE][/FONT][/B]<br><br>"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление на восстановление во фракцию получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander] Вы будете поставлены на титул[/COLOR][COLOR=ORANGE] Корреспондента [/COLOR][/B][/CENTER][/FONT][/SIZE]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре, подходите к зданию СМИ и позвоните нам.[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
   status: false,
        },
                {
            title: '| Ведущий |',
                    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
                       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, бывший сотрудник нашей фракции.[/COLOR][/CENTER][/SIZE][/FONT][/B]<br><br>"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление на восстановление во фракцию получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander] Вы будете поставлены на титул[/COLOR][COLOR=ORANGE] Ведущего [/COLOR][/B][/CENTER][/FONT][/SIZE]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре, подходите к зданию СМИ и позвоните нам.[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
   status: false,
        },
                {
            title: '| Редактор |',
                    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
                       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, бывший сотрудник нашей фракции.[/COLOR][/CENTER][/SIZE][/FONT][/B]<br><br>"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление на восстановление во фракцию получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander] Вы будете поставлены на титул[/COLOR][COLOR=ORANGE] Редактора [/COLOR][/B][/CENTER][/FONT][/SIZE]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре, подходите к зданию СМИ и позвоните нам.[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
   status: false,
        },
                {
            title: '| Маркетолог |',
                    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
                       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, бывший сотрудник нашей фракции.[/COLOR][/CENTER][/SIZE][/FONT][/B]<br><br>"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление на восстановление во фракцию получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander] Вы будете поставлены на титул[/COLOR][COLOR=ORANGE] Маркетолога [/COLOR][/B][/CENTER][/FONT][/SIZE]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре, подходите к зданию СМИ и позвоните нам.[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
   status: false,
        },
{
	  title: '>>>>>>>>>>>>>>> Одобрено А-ОПГ <<<<<<<<<<<<<<<',
    dpstyle: 'oswald: 3px; border-radius:  20px; color: #fff; background: #1ABC9C; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
},
            {
	  title: '| Молодой |',
                dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
                "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый преступник.[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка для постановления на должность [COLOR=#41A85F] Молодого [/COLOR] получает статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре подходите к зданию ОПГ в г. Арзамас и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
   status: false,
    },
                    {
	  title: '| Борзый |',
                        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
                "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый преступник.[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка для повышения на должность [COLOR=#41A85F] Борзого [/COLOR] получает статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре подходите к зданию ОПГ в г. Арзамас и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
   status: false,
    },
                            {
	  title: '| Фраер |',
                                dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
                "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый преступник.[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка для повышения на должность [COLOR=#41A85F] Фраера [/COLOR] получает статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре подходите к зданию ОПГ в г. Арзамас и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
   status: false,
    },
                            {
	  title: '| Барыга |',
                                dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
                "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый преступник.[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка для повышения на должность [COLOR=#41A85F] Барыги [/COLOR] получает статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре подходите к зданию ОПГ в г. Арзамас и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
   status: false,
    },
                            {
	  title: '| Блатной |',
                                dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
                "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый преступник.[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка для повышения на должность [COLOR=#41A85F] Блатного [/COLOR] получает статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре подходите к зданию ОПГ в г. Арзамас и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
   status: false,
    },
                            {
	  title: '| Свояк |',
                                dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
                "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый преступник.[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка для повышения на должность [COLOR=#41A85F] Свояка [/COLOR] получает статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре подходите к зданию ОПГ в г. Арзамас и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
   status: false,
    },
                           {
	  title: '| Браток |',
                               dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
                "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый преступник.[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка для повышения на должность [COLOR=#41A85F] Братка [/COLOR] получает статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре подходите к зданию ОПГ в г. Арзамас и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
   status: false,
    },
     {
            title: '>>>>>>>>>>>>>> Восстановление А-ОПГ <<<<<<<<<<<<<<<',
         dpstyle: 'oswald: 3px; border-radius:  20px; color: #fff; background: #1ABC9C; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
        },
                {
            title: '| Молодой |',
                    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
                       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, бывший сотрудник нашей фракции.[/COLOR][/CENTER][/SIZE][/FONT][/B]<br><br>"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление на восстановление во фракцию получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander] Вы будете поставлены на титул[/COLOR][COLOR=#41A85F] Молодого [/COLOR][/B][/CENTER][/FONT][/SIZE]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре, подходите к зданию ОПГ в г. Арзамас и позвоните нам.[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
   status: false,
        },
               {
            title: '| Борзый |',
                   dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
                       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, бывший сотрудник нашей фракции.[/COLOR][/CENTER][/SIZE][/FONT][/B]<br><br>"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление на восстановление во фракцию получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander] Вы будете поставлены на титул[/COLOR][COLOR=#41A85F] Борзого [/COLOR][/B][/CENTER][/FONT][/SIZE]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре, подходите к зданию ОПГ в г. Арзамас и позвоните нам.[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
   status: false,
        },
               {
            title: '| Фраер |',
                   dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
                       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, бывший сотрудник нашей фракции.[/COLOR][/CENTER][/SIZE][/FONT][/B]<br><br>"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление на восстановление во фракцию получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander] Вы будете поставлены на титул[/COLOR][COLOR=#41A85F] Фраера [/COLOR][/B][/CENTER][/FONT][/SIZE]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре, подходите к зданию ОПГ в г. Арзамас и позвоните нам.[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
   status: false,
        },
               {
            title: '| Барыга |',
                   dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
                       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, бывший сотрудник нашей фракции.[/COLOR][/CENTER][/SIZE][/FONT][/B]<br><br>"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление на восстановление во фракцию получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander] Вы будете поставлены на титул[/COLOR][COLOR=#41A85F] Барыги [/COLOR][/B][/CENTER][/FONT][/SIZE]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре, подходите к зданию ОПГ в г. Арзамас и позвоните нам.[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
   status: false,
        },
               {
            title: '| Блатной |',
                   dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
                       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, бывший сотрудник нашей фракции.[/COLOR][/CENTER][/SIZE][/FONT][/B]<br><br>"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление на восстановление во фракцию получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander] Вы будете поставлены на титул[/COLOR][COLOR=#41A85F] Блатного [/COLOR][/B][/CENTER][/FONT][/SIZE]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре, подходите к зданию ОПГ в г. Арзамас и позвоните нам.[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
   status: false,
        },
               {
            title: '| Свояк |',
                   dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
                       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, бывший сотрудник нашей фракции.[/COLOR][/CENTER][/SIZE][/FONT][/B]<br><br>"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление на восстановление во фракцию получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander] Вы будете поставлены на титул[/COLOR][COLOR=#41A85F] Свояка [/COLOR][/B][/CENTER][/FONT][/SIZE]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре, подходите к зданию ОПГ в г. Арзамас и позвоните нам.[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
   status: false,
        },
              {
            title: '| Браток |',
                  dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
                       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, бывший сотрудник нашей фракции.[/COLOR][/CENTER][/SIZE][/FONT][/B]<br><br>"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление на восстановление во фракцию получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander] Вы будете поставлены на титул[/COLOR][COLOR=#41A85F] Братка [/COLOR][/B][/CENTER][/FONT][/SIZE]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре, подходите к зданию ОПГ в г. Арзамас и позвоните нам.[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
   status: false,
        },
         {
    	  title: '>>>>>>>>>>>>>>> Одобрено Б-ОПГ <<<<<<<<<<<<<<<',
            dpstyle: 'oswald: 3px; border-radius:  20px; color: #fff; background: blue; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
},
            {
	  title: '| Молодой |',
                dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый преступник.[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка для постановления на должность [COLOR=#2969B0] Молодого [/COLOR] получает статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре подходите к зданию ОПГ в пгт. Батырево и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
   status: false,
    },
                    {
	  title: '| Борзый |',
                        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый преступник.[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка для повышения на должность [COLOR=#2969B0] Борзого [/COLOR] получает статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре подходите к зданию ОПГ в пгт. Батырево и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
   status: false,
                    },
                            {
	  title: '| Фраер |',
                                dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый преступник.[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка для повышения на должность [COLOR=#2969B0] Фраера [/COLOR] получает статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре подходите к зданию ОПГ в пгт. Батырево и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
   status: false,
                    },
                            {
	  title: '| Барыга |',
                                dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый преступник.[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка для повышения на должность [COLOR=#2969B0] Барыги [/COLOR] получает статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре подходите к зданию ОПГ в пгт. Батырево и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
   status: false,
                    },
                            {
	  title: '| Блатной |',
                                dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый преступник.[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка для повышения на должность [COLOR=#2969B0] Блатного [/COLOR] получает статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре подходите к зданию ОПГ в пгт. Батырево и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
   status: false,
                    },
                            {
	  title: '| Свояк |',
                                dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый преступник.[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка для повышения на должность [COLOR=#2969B0] Свояка [/COLOR] получает статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре подходите к зданию ОПГ в пгт. Батырево и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
   status: false,
                    },
                            {
	  title: '| Браток |',
                                dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый преступник.[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка для повышения на должность [COLOR=#2969B0] Братка [/COLOR] получает статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре подходите к зданию ОПГ в пгт. Батырево и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
   status: false,
                    },
                     {
                            title: '>>>>>>>>>>>>>>> Восстановление Б-ОПГ <<<<<<<<<<<<<<<',
                          dpstyle: 'oswald: 3px; border-radius:  20px; color: #fff; background: blue; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
                        },
                                 {
            title: '| Молодой |',
                                     dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
                       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, бывший сотрудник нашей фракции.[/COLOR][/CENTER][/SIZE][/FONT][/B]<br><br>"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление на восстановление во фракцию получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander] Вы будете поставлены на титул[/COLOR][COLOR=#2969B0] Молодого [/COLOR][/B][/CENTER][/FONT][/SIZE]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре, подходите к зданию ОПГ в пгт. Батырево и позвоните нам.[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
   status: false,
        },
               {
            title: '| Борзый |',
                   dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
                       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, бывший сотрудник нашей фракции.[/COLOR][/CENTER][/SIZE][/FONT][/B]<br><br>"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление на восстановление во фракцию получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander] Вы будете поставлены на титул[/COLOR][COLOR=#2969B0] Борзого [/COLOR][/B][/CENTER][/FONT][/SIZE]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре, подходите к зданию ОПГ в пгт. Батырево и позвоните нам.[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
   status: false,
        },
               {
            title: '| Фраер |',
                   dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
                       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, бывший сотрудник нашей фракции.[/COLOR][/CENTER][/SIZE][/FONT][/B]<br><br>"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление на восстановление во фракцию получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander] Вы будете поставлены на титул[/COLOR][COLOR=#2969B0] Фраера [/COLOR][/B][/CENTER][/FONT][/SIZE]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре, подходите к зданию ОПГ в пгт Батырево и позвоните нам.[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
   status: false,
        },
               {
            title: '| Барыга |',
                   dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
                       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, бывший сотрудник нашей фракции.[/COLOR][/CENTER][/SIZE][/FONT][/B]<br><br>"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление на восстановление во фракцию получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander] Вы будете поставлены на титул[/COLOR][COLOR=#2969B0] Барыги [/COLOR][/B][/CENTER][/FONT][/SIZE]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре, подходите к зданию ОПГ в пгт. Батырево и позвоните нам.[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
   status: false,
        },
               {
            title: '| Блатной |',
                   dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
                       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, бывший сотрудник нашей фракции.[/COLOR][/CENTER][/SIZE][/FONT][/B]<br><br>"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление на восстановление во фракцию получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander] Вы будете поставлены на титул[/COLOR][COLOR=#2969B0] Блатного [/COLOR][/B][/CENTER][/FONT][/SIZE]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре, подходите к зданию ОПГ в пгт. Батырево и позвоните нам.[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
   status: false,
        },
               {
            title: '| Свояк |',
                   dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
                       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, бывший сотрудник нашей фракции.[/COLOR][/CENTER][/SIZE][/FONT][/B]<br><br>"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление на восстановление во фракцию получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander] Вы будете поставлены на титул[/COLOR][COLOR=#2969B0] Свояка [/COLOR][/B][/CENTER][/FONT][/SIZE]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре, подходите к зданию ОПГ в пгт. Батырево и позвоните нам.[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
   status: false,
        },
              {
            title: '| Браток |',
                  dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
                       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, бывший сотрудник нашей фракции.[/COLOR][/CENTER][/SIZE][/FONT][/B]<br><br>"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление на восстановление во фракцию получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander] Вы будете поставлены на титул[/COLOR][COLOR=#2969B0] Братка [/COLOR][/B][/CENTER][/FONT][/SIZE]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре, подходите к зданию ОПГ в пгт. Батырево и позвоните нам.[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
   status: false,
        },
  {
    	  title: '>>>>>>>>>>>>>>> Одобрено Л-ОПГ <<<<<<<<<<<<<<<',
      dpstyle: 'oswald: 3px; border-radius:  20px; color: #fff; background: #FAC51C; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
      },
            {
	  title: '| Молодой |',
                dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый преступник.[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка для постановления на должность [COLOR=YELLOW] Молодого [/COLOR] получает статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре подходите к зданию ОПГ в г. Лыткарино и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
   status: false,
    },
          {
	  title: '| Борзый |',
              dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый преступник.[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка для повышения на должность [COLOR=YELLOW] Борзого [/COLOR] получает статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре подходите к зданию ОПГ в г. Лыткарино и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
   status: false,
    },
                {
	  title: '| Фраер |',
                    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый преступник.[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка для повышения на должность [COLOR=YELLOW] Фраера [/COLOR] получает статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре подходите к зданию ОПГ в г. Лыткарино и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
   status: false,
    },
                {
	  title: '| Барыга |',
                    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый преступник.[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка для повышения на должность [COLOR=YELLOW] Барыги [/COLOR] получает статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре подходите к зданию ОПГ в г. Лыткарино и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
   status: false,
    },
                {
	  title: '| Блатной |',
                    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый преступник.[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка для повышения на должность [COLOR=YELLOW] Блатного [/COLOR] получает статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре подходите к зданию ОПГ в г. Лыткарино и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
   status: false,
    },
                {
	  title: '| Свояк |',
                    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый преступник.[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка для повышения на должность [COLOR=YELLOW] Свояка [/COLOR] получает статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре подходите к зданию ОПГ в г. Лыткарино и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
   status: false,
    },
                {
	  title: '| Браток |',
                    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	 content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый преступник.[/COLOR][/CENTER][/B]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша заявка для повышения на должность [COLOR=YELLOW] Братка [/COLOR] получает статус [COLOR=GREEN]одобрено[/COLOR][/SIZE][/FONT]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре подходите к зданию ОПГ в г. Лыткарино и позвоните нам[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]",
   status: false,
    },
     {
            title: '>>>>>>>>>>>>>> Восстановление Л-ОПГ <<<<<<<<<<<<<<<',
         dpstyle: 'oswald: 3px; border-radius:  20px; color: #fff; background: #FAC51C; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
        },
             {
            title: '| Молодой |',
                 dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
                       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, бывший сотрудник нашей фракции.[/COLOR][/CENTER][/SIZE][/FONT][/B]<br><br>"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление на восстановление во фракцию получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander] Вы будете поставлены на титул[/COLOR][COLOR=YELLOW] Молодого [/COLOR][/B][/CENTER][/FONT][/SIZE]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре, подходите к зданию ОПГ в г. Лыткарино и позвоните нам.[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
   status: false,
        },
               {
            title: '| Борзый |',
                   dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
                       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, бывший сотрудник нашей фракции.[/COLOR][/CENTER][/SIZE][/FONT][/B]<br><br>"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление на восстановление во фракцию получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander] Вы будете поставлены на титул[/COLOR][COLOR=YELLOW] Борзого [/COLOR][/B][/CENTER][/FONT][/SIZE]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре, подходите к зданию ОПГ в г. Лыткарино и позвоните нам.[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
   status: false,
        },
               {
            title: '| Фраер |',
                   dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
                       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, бывший сотрудник нашей фракции.[/COLOR][/CENTER][/SIZE][/FONT][/B]<br><br>"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление на восстановление во фракцию получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander] Вы будете поставлены на титул[/COLOR][COLOR=YELLOW] Фраера [/COLOR][/B][/CENTER][/FONT][/SIZE]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре, подходите к зданию ОПГ в г. Лыткарино и позвоните нам.[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
   status: false,
        },
               {
            title: '| Барыга |',
                   dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
                       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, бывший сотрудник нашей фракции.[/COLOR][/CENTER][/SIZE][/FONT][/B]<br><br>"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление на восстановление во фракцию получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander] Вы будете поставлены на титул[/COLOR][COLOR=YELLOW] Барыги [/COLOR][/B][/CENTER][/FONT][/SIZE]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре, подходите к зданию ОПГ в г. Лыткарино и позвоните нам.[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
   status: false,
        },
               {
            title: '| Блатной |',
                   dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
                       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, бывший сотрудник нашей фракции.[/COLOR][/CENTER][/SIZE][/FONT][/B]<br><br>"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление на восстановление во фракцию получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander] Вы будете поставлены на титул[/COLOR][COLOR=YELLOW] Блатного [/COLOR][/B][/CENTER][/FONT][/SIZE]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре, подходите к зданию ОПГ в г. Лыткарино и позвоните нам.[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
   status: false,
        },
               {
            title: '| Свояк |',
                   dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
                       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, бывший сотрудник нашей фракции.[/COLOR][/CENTER][/SIZE][/FONT][/B]<br><br>"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление на восстановление во фракцию получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander] Вы будете поставлены на титул[/COLOR][COLOR=YELLOW] Свояка [/COLOR][/B][/CENTER][/FONT][/SIZE]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре, подходите к зданию ОПГ в г. Лыткарино и позвоните нам.[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
   status: false,
        },
              {
            title: '| Браток |',
                  dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
                       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]'+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, бывший сотрудник нашей фракции.[/COLOR][/CENTER][/SIZE][/FONT][/B]<br><br>"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваше заявление на восстановление во фракцию получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]"+
  "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander] Вы будете поставлены на титул[/COLOR][COLOR=YELLOW] Братка [/COLOR][/B][/CENTER][/FONT][/SIZE]"+
    "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=WHITE]Когда будете в игре, подходите к зданию ОПГ в г. Лыткарино и позвоните нам.[/FONT][/B][/CENTER][/COLOR]" +
                "[SIZE=4][B][CENTER][COLOR=white][FONT=times new roman] Чтобы узнать есть ли мы в игре напишите команду /leaders. [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua] [/FONT][/COLOR][/SIZE][/CENTER][/B]"+
         "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
   status: false,
        },
        {
            title: '>>>>>>>>>>>>>>>>>>>> Отказы <<<<<<<<<<<<<<<<<<<<',
            dpstyle: 'oswald: 3px; border-radius:  20px; color: #fff; background: red; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
        },
{
	  title: '| Не по форме |',
     dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
    content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый представитель.[/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как она составлена не по форме. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR]<br><br>",
	  status: false,
},
{
	  title: '| Нет /time |',
     dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый представитель. [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как на ваших доказательствах отсутствует /time. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR]<br><br>",
	  status: false,
},
        {
      title: 'Отсутствуют док-ва',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][COLOR=YELLOW][CENTER][ICODE]{{ greeting }}, уважаемый представитель. [/ICODE].[/CENTER][/I][/COLOR][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][COLOR=YELLOW][SIZE=4]Отсутствуют доказательства - следовательно, рассмотрению не подлежит. Загрузите доказательства на фото-видео хостинги[/COLOR][COLOR=RED]YouTube,[/COLOR][COLOR=GREEN] Imgur,[/COLOR][COLOR=PURPLE] Yapx[/COLOR][COLOR=YELLOW] и так далее.[/COLOR][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>" +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
	  status: false,
},
        {
	  title: '| Неадекватная жалоба |',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]Доброго времени суток, уважаемый представитель. [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] В данном виде ваша жалоба не будет рассмотрена администрацией сервера. Составьте жалобу адекватно, создав новую тему. При повторных попытках дублирования данной темы Вы получите блокировку форумного аккаунта. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR]<br><br>",
	  status: false,
    },
        {
	  title: '| Док-ва не открываются |',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый представитель. [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как ваши доказательства не открываются. [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR]<br><br>",
	  status: false,
},
              {
	  title: '| Проделанная работа |',
                   dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый представитель. [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как у вас не хватает проделанной работы. [/B][/SIZE][/CENTER][/FONT] <br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR]<br><br>",
	  status: false,
},
                    {
	  title: '| Система повышения |',
                         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	  content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=#2c82c9]{{greeting}}, уважаемый представитель. [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR][/B][/SIZE][/CENTER][/FONT] <br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender] Просим вас ознакомиться с системой повышения указанной а форуме и подать заявку с правильными отчётами. [/B][/CENTER][/FONT][/SIZE][/COLOR]<br><br>"+
                "[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR]<br><br>",
	  status: false,
},
 {
            title: '>>>>>>>>>> Жалобы на сотрудников/Обжалование <<<<<<<<<<',
         dpstyle: 'oswald: 3px; border-radius:  20px; color: #fff; background: red; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
           },
        {
            title: '| Выговор |',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander]{{greeting}},уважаемый подопечный.[/B][/CENTER][/FONT][/SIZE][/COLOR]<br><br>"+
                        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander]Ваша жалоба на сотрудника получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/B][/CENTER][/FONT][/SIZE]<br><br>"+
                       "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander]Сотрудник получит наказание в виде [COLOR=#E25041]Выговора.[/B][/CENTER][/FONT][/SIZE][/COLOR]<br><br>"+
                        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander]Спасибо за отправленную жалобу и приносим извинения за неудобства.[/B][/CENTER][/FONT][/SIZE][/COLOR]<br><br>"+
                        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=GREEN][ICODE]Одобрено[/ICODE][/B][/CENTER][/FONT][/SIZE][/COLOR]<br><br>",
            status: false,
        },
          {
            title: '| Пред |',
               dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            "[B][CENTER][FONT=times new roman][SIZE=3][COLOR=lavander]{{greeting}},уважаемый подопечный.[/B][/CENTER][/FONT][/SIZE][/COLOR]<br><br>"+
                        "[B][CENTER][FONT=times new roman][SIZE=3][COLOR=lavander]Ваша жалоба на сотрудника получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/B][/CENTER][/FONT][/SIZE]<br><br>"+
                       "[B][CENTER][FONT=times new roman][SIZE=3][COLOR=lavander]Сотрудник получит наказание в виде [COLOR=YELLOW]Предупреждения.[/B][/CENTER][/FONT][/SIZE][/COLOR]<br><br>"+
                        "[B][CENTER][FONT=times new roman][SIZE=3][COLOR=lavander]Спасибо за отправленную жалобу и приносим извинения за неудобства.[/B][/CENTER][/FONT][/SIZE][/COLOR]<br><br>"+
                        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=GREEN][ICODE]Одобрено[/ICODE][/B][/CENTER][/FONT][/SIZE][/COLOR]<br><br>",
            status: false
        },
        {
            title: '| Устный пред |',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander]{{greeting}},уважаемый подопечный.[/B][/CENTER][/FONT][/SIZE][/COLOR]<br><br>"+
                        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander]Ваша жалоба на сотрудника получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/B][/CENTER][/FONT][/SIZE]<br><br>"+
                       "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander]С сотрудником будет проведена беседа и он получает наказание в виде [COLOR=#9365B8]Устного предупреждения.[/COLOR][COLOR=lavander] Если ситуация повторится, то сотруднику будет выдано [COLOR=YELLOW] Предупреждение [/COLOR] [/B][/CENTER][/FONT][/SIZE][/COLOR]<br><br>"+
                        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander]Спасибо за отправленную жалобу и приносим извинения за неудобства.[/B][/CENTER][/FONT][/SIZE][/COLOR]<br><br>"+
                        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=GREEN][ICODE]Одобрено[/ICODE][/B][/CENTER][/FONT][/SIZE][/COLOR]<br><br>",
            status: false,
        },
          {
            title: '| Нарушений нет |',
               dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander]{{greeting}},уважаемый подопечный.[/B][/CENTER][/FONT][/SIZE][/COLOR]<br><br>"+
                        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander]Ваша жалоба на сотрудника получает статус [COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/B][/CENTER][/FONT][/SIZE]<br><br>"+
                       "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander]В вашей жалобе не было найдено нарушений от струдника.[/B][/CENTER][/FONT][/SIZE][/COLOR]<br><br>"+
                        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander]Если вы считаете иначе, то объяснитесвою точку зрения.[/B][/CENTER][/FONT][/SIZE][/COLOR]<br><br>"+
                        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED][ICODE]Отказано[/ICODE][/B][/CENTER][/FONT][/SIZE][/COLOR]<br><br>",
            status: false,
        },
           {
            title: '| Ошиблись фракцией |',
                dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander]{{greeting}},уважаемый подопечный.[/B][/CENTER][/FONT][/SIZE][/COLOR]<br><br>"+
                        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander]Вы ошиблись фракцией куда нужно писать жалобу.[/COLOR][/B][/CENTER][/FONT][/SIZE]<br><br>"+
                       "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander]Напишите её в подходящий радел той фракции, в которой состоит сотрудник.[/B][/CENTER][/FONT][/SIZE][/COLOR]<br><br>"+
                        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED][ICODE]Отказано[/ICODE][/B][/CENTER][/FONT][/SIZE][/COLOR]<br><br>",
            status: false,
        },
           {
            title: '| Наказание снято |',
                dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander]{{greeting}},уважаемый сотрудник.[/B][/CENTER][/FONT][/SIZE][/COLOR]<br><br>"+
                        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander]Ваше обжалование было рассмотренно и получает статус [COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/B][/CENTER][/FONT][/SIZE]<br><br>"+
                       "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander]Наказание будет снято.[/B][/CENTER][/FONT][/SIZE][/COLOR]<br><br>"+
                        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander]Постарайтесь не нарушать.[/B][/CENTER][/FONT][/SIZE][/COLOR]<br><br>"+
                        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=GREEN][ICODE]Одобрено[/ICODE][/B][/CENTER][/FONT][/SIZE][/COLOR]<br><br>",
            status: false,
        },
           {
            title: '| Наказание не снято |',
                dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander]{{greeting}},уважаемый сотрудник.[/B][/CENTER][/FONT][/SIZE][/COLOR]<br><br>"+
                        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander]Ваше обжалование было рассмотренно и получает статус [COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/B][/CENTER][/FONT][/SIZE]<br><br>"+
                       "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander]Наказание остается.[/B][/CENTER][/FONT][/SIZE][/COLOR]<br><br>"+
                        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavander]Вы не выполнили условия для снятия наказание.[/B][/CENTER][/FONT][/SIZE][/COLOR]<br><br>"+
                        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED][ICODE]Отказано[/ICODE][/B][/CENTER][/FONT][/SIZE][/COLOR]<br><br>",
            status: false,
        },

    ];

	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
 	addButton('߷ Ответы ߷', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PINN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, false));
    $('button#Texy').click(() => editThreadData(TEXY_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
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
	      `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 20px 10px; border-color: #fff; border-style: dashed solid; margin-right: 7px; margin-bottom: 10px; background: #FAC51C; text-decoration-style: wavy;">${name}</button>`
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
	})();// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
//version        0.0.1
// @description  try to take over the world!
// @author       You
// @match        https://vk.com/im?peers=c59
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vk.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();