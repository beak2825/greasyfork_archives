// ==UserScript==
// @name         Скрипт сделан специально для кураторов форума сервера AZURE
// @namespace    https://forum.blackrussia.online/
// @version      1.1
// @description  По всем вопросам: https://vk.com/rkhelou
// @author       Petr_Toretto
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon http://postimg.su/r95DwRnI
// @downloadURL https://update.greasyfork.org/scripts/526183/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D1%81%D0%B4%D0%B5%D0%BB%D0%B0%D0%BD%20%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%20%D0%B4%D0%BB%D1%8F%20%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0%20AZURE.user.js
// @updateURL https://update.greasyfork.org/scripts/526183/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D1%81%D0%B4%D0%B5%D0%BB%D0%B0%D0%BD%20%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%20%D0%B4%D0%BB%D1%8F%20%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0%20AZURE.meta.js
// ==/UserScript==

(function () {
	'use strict';
	const DORABOTKA_PREFIX = 3; // доработка
	const UNACCEPT_PREFIX = 4; // префикс отказано
	const ACCEPT_PREFIX = 8; // префикс одобрено
	const PIN_PREFIX = 2; //  префикс закрепить
    const PI_PREFIX = 9; //  префикс рассмотрено
	const NO_PREFIX = 0;
	const buttons = [
          {
          title: '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Предложения по улучшению - @rkhelou ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
          dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
          {
          title: '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Основное ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
          dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
           {
             title: 'Передать ГКФ/ЗГКФ',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
             '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
             '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
             "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay биография передана на рассмотрение [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ГКФ/ЗГКФ.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Просьба не создавать новые биографии, иначе ваш форумный аккаунт будет заблокирован. [/SIZE][/FONT][/CENTER][/I][/COLOR]<br><br>" +
             '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]",
             prefix: DORABOTKA_PREFIX,
             status: false,
          },
          {
            title: 'Заголовок',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Заголовок Вашей RolePlay не по форме.<br>Пожалуйста, ознакомьтесь с темой [URL='https://forum.blackrussia.online/threads/Правила-составления-rp-биографии.13425782/']Правила создания RolePlay биографии[/url] .<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Не по форме',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Биография написана не по форме.<br>Пожалуйста, ознакомьтесь с темой [URL='https://forum.blackrussia.online/threads/Правила-составления-rp-биографии.13425782/']Правила создания RolePlay биографии[/url] .<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
        {
            title: 'Не по форме + заголовок',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Биография написана не по форме + Заголовок не по форме.<br>Пожалуйста, ознакомьтесь с темой [URL='https://forum.blackrussia.online/threads/Правила-составления-rp-биографии.13425782/']Правила создания RolePlay биографии[/url] .<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Скопирована',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Биография полностью/частично скопирована у другого человека.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
        {
            title: 'Маленький обьем',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Биография имеет обьем меньше 200 слов. <br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
         {
            title: 'Включение в биографию факторы, позволяющие нарушать правила сервера',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В вашу RolePlay Биографию включены факторы, позволяющие нарушать правила сервера. <br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
            {
            title: 'Биография о существующих людях',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В вашей RolePlay Биографие написано о существующем человеке. <br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
                   {
            title: 'Без иных материалов',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В вашей RolePlay Биографие нету фотографий или/и иных материалов, относящиеся к истории вашего персонажа. <br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
                    {
            title: 'Шрифт и размер не правильные',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Шрифт Role Play биографии должен быть Times New Roman либо Verdana, минимальный размер — 15.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
        {
            title: 'Много грамматических ошибок',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Биография написана неграмматно, пересмотрите её и исправьте грамматические ошибки.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[LIST]<br>" +
            "[*][LEFT][FONT=georgia][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Грамматическая ошибка - это ошибка в структуре языковой единицы: в структуре слова, словосочетания или предложения; это нарушение какой-либо грамматической нормы - словообразовательной, морфологической, синтаксической.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
            "[/LIST]<br>" +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
                  {
            title: 'Проблемы со знаками препинаний',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
                      "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Биография написана неграмматно, пересмотрите её и исправьте пунктуационная ошибка.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[*][LEFT][FONT=georgia][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Пунктуационная ошибка - это неиспользование пишущим необходимого знака препинания или его употребление там, где он не требуется, а также необоснованная замена одного знака препинания другим.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
            "[/LIST]<br>" +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            "[I][CENTER][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'На доработку',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Биография взята на доработку.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]У вас есть 24 часа, чтобы дополнить свою RP Биографию.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[I][CENTER][SIZE=3][COLOR=rgb(255, 140, 0)][ICODE]На рассмотрении...[/ICODE][/SIZE][/CENTER][/COLOR]<br><br>' +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: DORABOTKA_PREFIX,
            status: true,
          },
          {
            title: 'Не доработали',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Вы никак не доработали свою RolePlay Биографию.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
          title: '~~~~~~~~~~~~~~~~~~~~~~~~~~⠀Недостаточно информации⠀~~~~~~~~~~~~~~~~~~~~~~~~~~',
          dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
          {
            title: 'В пункте детство недостаточно инфы',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            '[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В пункте "Детство" недостаточно информации.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>' +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            '[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'В пункте настоящее время недостаточно инфы',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            '[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В пункте "Настоящее время" недостаточно информации.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>' +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            '[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'В пункте итоги недостаточно инфы',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            '[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В пункте "Итоги" недостаточно информации.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>' +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            '[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'В пункте Детство и Настоящее время недостаточно инфы',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            '[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В пункте "Детство" и "Настоящее время" недостаточно информации.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>' +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            '[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'В пункте Настоящее время и Итоги недостаточно инфы',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            '[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В пункте "Настоящее время" и "Итоги" недостаточно информации.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>' +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            '[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'В пункте Детство и Итоги недостаточно инфы',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            '[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В пункте "Детство" и "Итоги" недостаточно информации.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>' +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            '[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Во всех пунктах недостаточно инфы Детство, Настоящее время и Итоги',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            '[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Во всех пунктах недостаточно информации "Детство", "Настоящее время" и "Итоги".<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>' +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            '[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
          title: '~~~~~~~~~~~~~~~~~~~~~~~~~~⠀Нету логики⠀~~~~~~~~~~~~~~~~~~~~~~~~~~',
          dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
          {
            title: 'В пункте Детство нет логики',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            '[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Обратите внимание, в пункте "Детство" нет логики.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>' +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            '[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'В пункте Настоящее время нет логики',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            '[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Обратите внимание, в пункте "Настоящее время" нет логики.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>' +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            '[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'В пункте Итоги нет логики',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            '[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Обратите внимание, в пункте "Итоги" нет логики.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>' +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            '[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
          title: '~~~~~~~~~~~~~~~~~~~~~~~~~~ Ошибки в пункте Имя и Фамилия~~~~~~~~~~~~~~~~~~~~~~~',
          dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
          {
            title: 'NonRP никнейм',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]У вас NonRP никнейм в заголовке биографии.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Имя или/и Фамилия в заголовке и в пункте Имя и Фамилия отличается',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В заголовке вашей биографии и пункте *Имя и Фамилия* имена или/и фамилия отличается отличаются.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Имя и Фамилия и какой то другой пункт не совпадают',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В пункте Имя и Фамилия и в каком то другом пункте RolePlay биографии разная информация.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'У персонажа и его родственников разные фамилии',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]У вашего персонажа отличается фамилии от остальных родственников, если он её менял, то вы должны расписать это со всеми подробностями.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
          title: '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Ошибки в пункте Пол~~~~~~~~~~~~~~~~~~~~~~~',
          dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
         {
            title: 'Пол не совпадает с Именем или/и Фамилией',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В вашей RolePlay Биографии Пол не совпадает с Именем или/и Фамилией вашего персонажа.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Пункт Пол и какой то другой пункт не совпадают',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В вашей RolePlay Биографии в пункте Пол и в каком то другом пункте RolePlay биографии разная информация.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
        {
            title: 'Не  правильный пол',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В вашей RolePlay Биографии в пункте Пол написан Пол отличающийся от правил написания RolePlay биографий. Пожалуйста, ознакомьтесь с темой [URL='https://forum.blackrussia.online/threads/Правила-составления-rp-биографии.13425782/'] Правила создания RolePlay биографии [/url].<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
        {
          title: '~~~~~~~~~~~~~~~~~~~~~~~~~~Ошибки в пункте Возраст~~~~~~~~~~~~~~~~~~~~~~~~',
          dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
          {
            title: 'Пункт Возраст и какой то другой пункт не совпадают',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В вашей RolePlay Биографии в пункте Возраст и в каком то другом пункте RolePlay биографии разная информация.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
        {
            title: 'Нет 18',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay - биография отказана т.к. вам только исполнилось 18 лет и вас забрать в армию не смогут ( максимум через дней 4 ). Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/.-Правила-создания-roleplay-биографии.5829805/']*Нажмите сюда*[/URL]<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
          title: '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~⠀Ошибки в пункте Национальность⠀~~~~~~~~~~~~~~~~~~~~~~~~~~~',
          dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
          {
            title: 'Пункт Национальность и какой то другой пункт не совпадают',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В вашей RolePlay Биографии в пункте Национальность и в каком то другом пункте RolePlay биографии разная информация.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
        {
            title: 'Не существующая национальность',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В пункте Национальность написана не существующая национальность.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
          title: '~~~~~~~~~~~~~~~~~~~~~~~~~~~~⠀Ошибки в пункте Образование⠀~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
          dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
          {
            title: 'Не учился и нет причины не учебы',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваш персонаж обязан отучится в школе, если он ни где не учился, то обыграйте это в своей биографии.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
         {
            title: 'Пункт Образование и какой то другой пункт не совпадают',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В вашей RolePlay Биографии в пункте Образование и в каком то другом пункте RolePlay биографии разная информация.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
 {
          title: '~~~~~~~~~~~~~~~~~~~~~~~~~~ Ошибки в пункте Описание Внешности ~~~~~~~~~~~~~~~~~~~~~~~~~~',
          dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
             {
            title: 'Пункт Описание Внешности и какой то другой пункт не совпадают',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В вашей RolePlay Биографии в пункте Описание Внешности и в каком то другом пункте RolePlay биографии разная информация.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
             {
            title: 'Не реальное описание внешности',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В пункте Описание Внешности написана Внешность, которая не может существовать в Реальной Жизне.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
          title: '~~~~~~~~~~~~~~~~~~~~~ Ошибки в пункте Характера⠀~~~~~~~~~~~~~~~~~~~~~~~~',
          dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
          {
            title: 'Пункт Характера и какой то другой пункт не совпадают',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В вашей RolePlay Биографии в пункте Характер и в каком то другом пункте RolePlay биографии разная информация.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
          title: '~~~~~~~~~~~~~~~~~~~~~~~~~~⠀Ошибки в пункте Детсво⠀~~~~~~~~~~~~~~~~~~~~~~~~~~',
          dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
          {
            title: 'Детство с рождения',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Пункт Детство должен описываться с момента рождения вашего персонажа.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },

        {
            title: 'Нету информации когда пошел в 1 класс',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В пункте Детство напишите, когда ваш персонаж пошел в 1 класс.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
        {
            title: 'Мало информации про учебу, экзамены',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В пункте Детство опишите более подробно процесс обучения, сдачи экзаменов.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
        {
            title: 'В пункте Детство нету армии или мало информации',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В пункте Детство нету армии или мало информаци или не написано, почему Ваш персонаж не пошел в армию.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
          title: '~~~~~~~~~~~~~~~~~~~~~~~~~~⠀Ошибки в пункте Настоящее время⠀~~~~~~~~~~~~~~~~~~~~~~~~~~',
          dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
          {
            title: 'Не то время',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В пункте Настоящее время написано о будущем либо о прошлом, в данном пункте описывается настоящее время.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
          title: '~~~~~~~~~~~~~~~~~~~~~~~~~~⠀Ошибки в пункте Итоги⠀~~~~~~~~~~~~~~~~~~~~~~~~~~',
          dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
          {
            title: 'В Итоги написано о жизни',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В пункте Итоги написано о жизни персонажа, там должны быть только Итоги жизни, а не сама жизнь.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
          title: '~~~~~~~~~~~~~~~~~~~~~~~~~~⠀Остальные причины для отказов⠀~~~~~~~~~~~~~~~~~~~~~~~~~~',
          dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
          {
            title: 'Копия своей старой одобренной био',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay биография частично/полностью схожа с вашей прошлой одобренной биографией.<br>Если вы поменяли никнейм, то вам нужно придумать новую биографию.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'От 3-го лица',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Биография написана от 3-его лица.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Супергерой',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваш персонаж не может иметь сверхспособности.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Лучший во всем',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Запрещено создавать персонажа, который является лучшим во всём..<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Комментарии от себя',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Не нужно добавлять комментарии от себя, не по форме.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Дубликат',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Не нужно дублировать свою биографию.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
        {
            title: 'Скапировано',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay - биография отказана т.к. она скопирована. Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/.-Правила-создания-roleplay-биографии.5829805/']*Нажмите сюда*[/URL]<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'На другом языке',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER].[img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img].[/CENTER]<br>' +
            '[CENTER].[img]https://i.postimg.cc/pTsqT1nM/NiuhPJK.png[/img].[/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Часть или вся РП Биография написана не на Русском Языке.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4][ICODE]Отказано.[/ICODE][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER].[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img].[/CENTER]<br>' +
            "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(0, 128, 255)][B] AZURE[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
           },

	];

	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
           addButton('Отказ РП Биографии', 'otkaz', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5);');
	addAnswers();

	// Поиск информации о теме
	const threadData = getThreadData();

	$(`button#ff`).click(() => pasteContent(8, threadData, true));
	$(`button#prr`).click(() => pasteContent(2, threadData, true));
	$(`button#zhb`).click(() => pasteContent(21, threadData, true));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
	$('button#decided').click(() => editThreadData(DECIDED_PREFIX, false));
 	$('button#closed').click(() => editThreadData(CLOSE_PREFIX, false));
	$('button#closed_complaint').click(() => editThreadData(CLOSE_PREFIX, false, false));
	$('button#techspec').click(() => editThreadData(TEX_PREFIX, true));
 $('button#otkaz').click(() => editThreadData(UNACCEPT_PREFIX, true));
	$(`button#selectAnswer`).click(() => {
	XF.alert(buttonsMarkup(buttons), null, 'ВЫБЕРИТЕ ОТВЕТ');
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
		$('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 5px; margin-top: 10px; border-radius: 13px;">БИОГРАФИИ</button>`,
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
	11 < hours && hours <= 17 ?
	'Добрый день' :
	17 < hours && hours <= 21 ?
	'Добрый вечер' :
	'Доброй ночи',
	};

	}
          function editThreadData(prefix, pin = false)
          {
          // Получаем заголовок темы, так как он необходим при запросе
            const threadTitle = $('.p-title-value')[0].lastChild.textContent;

            if(pin == false)
            {
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
            if(pin == true)
            {
              fetch(`${document.URL}edit`,
              {
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
          if(prefix == ACCEPT_PREFIX)
          {
             moveThread(prefix, 730);
          }
          if(prefix == UNACCEPT_PREFIX)
          {
             moveThread(prefix, 732);
          }
          if(prefix == DORABOTKA_PREFIX)
          {
             moveThread(prefix, 731);
             editThreadData(PIN_PREFIX, true);
          }
}
          function moveThread(prefix, type) {
// Перемещение темы
const threadTitle = $('.p-title-value')[0].lastChild.textContent;

fetch(`${document.URL}move`, {
  method: 'POST',
  body: getFormData({
	prefix_id: prefix,
	title: threadTitle,
	target_node_id: type,
	redirect_type: 'none',
	notify_watchers: 1,
	starter_alert: 1,
	starter_alert_reason: "",
	_xfToken: XF.config.csrf,
	_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
	_xfWithData: 1,
	_xfResponseType: 'json',
  }),
}).then(() => location.reload());
}

          function getFormData(data) {
            const formData = new FormData();
            Object.entries(data).forEach(i => formData.append(i[0], i[1]));
            return formData;
            }
          })();

(function () {
	'use strict';
	const OTKAZANO_PREFIX = 4; // префикс отказано
	const ODOBRENO_PREFIX = 8; // префикс одобрено
	const ZAKREP_PREFIX = 2; //  префикс закрепить
        const TEX_PREFIX = 13; //  техническому специалисту
        const GA_PREFIX = 12; //  главному администратору
        const ZAKRITO_PREFIX = 7; // префикс закрыто
	const NO_PREFIX = 0;
	const buttons = [
          {
          title: '~~~~~~~~~ Предложения по улучшению - @rkhelou ~~~~~~~~~',
          dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },

          {
          title: '~~~~~~~~~~~~~~~~~~~~⠀Основное⠀~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
          dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
          {
             title: 'На рассмотрении',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 216, 213)][SIZE=4][FONT=times new roman][B]Ваша жалоба взята на рассмотрение.<br>" +
             'Ожидайте, пожалуйста, ответа от администрации и не нужно создавать копии этой темы.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ZAKREP_PREFIX,
             status: true,
           },
           {
             title: 'Жалоба не по форме',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/B][/FONT][/SIZE][/COLOR][FONT=times new roman][/FONT]<br><br>' +
             "[COLOR=rgb(209, 216, 213)][FONT=times new roman][SIZE=4][B]Ваша жалоба составлена не по форме.[/B][/SIZE][/FONT][/COLOR][FONT=times new roman][/FONT]<br><br>" +
             '[COLOR=rgb(209, 216, 213)][FONT=times new roman][SIZE=4][B]Форма подачи:[/B][/SIZE][/FONT][/COLOR][/CENTER]<br><br>' +
             "[QUOTE]" +
             '[CENTER][B][COLOR=rgb(209, 216, 213)][SIZE=4][FONT=times new roman]1. Ваш Nick_Name:[/FONT][/SIZE][/COLOR][/B]<br>' +
             "[COLOR=rgb(209, 216, 213)][SIZE=4][FONT=times new roman][B]2. Nick_Name игрока:<br>" +
             '3. Суть жалобы:[/B][/FONT][/SIZE][/COLOR]<br>' +
             "[B][COLOR=rgb(209, 216, 213)][SIZE=4][FONT=times new roman]4. Доказательство:[/FONT][/SIZE][/COLOR][/B][/CENTER]" +
             '[/QUOTE]' +
             "[CENTER]<br><br>" +
             '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4] Отказано, закрыто. [/FONT][/SIZE][/COLOR][/CENTER]',
             prefix: OTKAZANO_PREFIX,
             status: false,
           },
        {
             title: 'Жалоба не по форме + Заголовок',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/B][/FONT][/SIZE][/COLOR][FONT=times new roman][/FONT]<br><br>' +
             "[COLOR=rgb(209, 216, 213)][FONT=times new roman][SIZE=4][B]Ваша жалоба составлена не по форме а так же и заголовок.[/B][/SIZE][/FONT][/COLOR][FONT=times new roman][/FONT]<br><br>" +
             '[COLOR=rgb(209, 216, 213)][FONT=times new roman][SIZE=4][B]Форма подачи в нутреней темы:[/B][/SIZE][/FONT][/COLOR][/CENTER]<br><br>' +
             "[QUOTE]" +
             '[CENTER][B][COLOR=rgb(209, 216, 213)][SIZE=4][FONT=times new roman]1. Ваш Nick_Name:[/FONT][/SIZE][/COLOR][/B]<br>' +
             "[COLOR=rgb(209, 216, 213)][SIZE=4][FONT=times new roman][B]2. Nick_Name игрока:<br>" +
             '3. Суть жалобы:[/B][/FONT][/SIZE][/COLOR]<br>' +
             "[B][COLOR=rgb(209, 216, 213)][SIZE=4][FONT=times new roman]4. Доказательство:[/FONT][/SIZE][/COLOR][/B][/CENTER]" +
             '[/QUOTE]' +
             "[CENTER]<br><br>" +
            '[COLOR=rgb(209, 216, 213)][FONT=times new roman][SIZE=4][B]Форма подачи заголовка: Nick_Name || Суть жалобы \\\ Пример: Petr_Toretto || NonRP ВЧ[/B][/SIZE][/FONT][/COLOR][/CENTER]<br><br>' +
             '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4] Отказано, закрыто. [/FONT][/SIZE][/COLOR][/CENTER]',
             prefix: OTKAZANO_PREFIX,
             status: false,
           },
           {
             title: 'Заголовок не по форме',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 216, 213)][SIZE=4][FONT=times new roman][B]Заголовок вашей жалобы составлен не по форме.<br>" +
             'Советую ознакомиться с правилами подачи жалоб на игроков.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4] Отказано, закрыто. [/FONT][/SIZE][/COLOR][/CENTER]',
             prefix: OTKAZANO_PREFIX,
             status: false,
           },
           {
             title: 'Нарушений не найдено',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 216, 213)][SIZE=4][FONT=times new roman][B]Нарушений со стороны игрока не обнаружено.[/B][/FONT][/SIZE][/COLOR]<br><br>" +
             '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4] Отказано, закрыто. [/FONT][/SIZE][/COLOR][/CENTER]',
             prefix: OTKAZANO_PREFIX,
             status: false,
           },
           {
             title: 'Прошло более 72 часов',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 216, 213)][SIZE=4][FONT=times new roman][B]Прошло более 3-х суток часов с момента нарушения.<br>" +
             'Соответственно, жалоба рассмотрению не подлежит.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][ICODE] Отказано, закрыто. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]',
             prefix: OTKAZANO_PREFIX,
             status: false,
           },
           {
             title: 'Нету /time',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 216, 213)][SIZE=4][FONT=times new roman][B]Просмотрев ваши доказательства, не обнаружил в них /time.<br>" +
             'Соответственно, жалоба рассмотрению не подлежит.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4] Отказано, закрыто. [/FONT][/SIZE][/COLOR][/CENTER]',
             prefix: OTKAZANO_PREFIX,
             status: false,
           },
          {
          title: '~~~~~~~~~~~~~~~~~~~~⠀RP Процесс⠀~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
          dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
          {
             title: 'DM (DeathMatch)',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]2.19[/COLOR]. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=Red]| Jail 60 минут[/B][/COLOR][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Mass DM (Mass DeathMatch)',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]2.20[/COLOR]. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [Color=Red]| Warn / Ban 3 - 7 дней[/B][/COLOR][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'DB (DriveBy)',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]2.13[/COLOR]. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [Color=Red]| Jail 60 минут[/B][/COLOR][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           
           {
             title: 'MG (OOC информация в IC)',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]2.18[/COLOR]. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [Color=Red]| Mute 30 минут[/B][/COLOR][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'SK (SpawnKill)',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]2.16[/COLOR]. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [Color=Red]| Jail 60 минут / Warn[/B][/COLOR][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'TK (TeamKill)',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]2.15[/COLOR]. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [Color=Red]| Jail 60 минут / Warn[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           
           {
             title: 'NonRP поведение',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]2.01[/COLOR]. Запрещено поведение, нарушающее нормы процессов Role Play режима игры [Color=Red]| Jail 30 минут[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'NonRP вождение',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]2.46[/COLOR]. Запрещено ездить по полям на любом транспорте (Исключение: кроссовые мотоциклы и внедорожники) [Color=Red]| Jail 30 минут[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'NonRP вождение (Дальнобойщик/инкассация)',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]2.47[/COLOR]. Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора)  [Color=Red]| Jail 60 минут[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Помеха рп процессу (Ban/Обнуление)',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]2.04[/COLOR]. Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы [Color=Red]| Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           
           {
             title: 'Уход от RolePlay',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]2.02[/COLOR]. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [Color=Red]| Jail 30 минут / Warn[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'NonRP Обман / IC Обман ',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]2.05[/COLOR]. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [Color=Red]| PermBan[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Стороннее ПО',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]2.22[/COLOR]. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=Red]| Ban 15 - 30 дней / PermBan[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Реклама сторонних ресурсов',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]2.31[/COLOR]. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное [Color=Red]| Ban 7 дней / PermBan[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Слив склада фракции/семьи',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]2.09[/COLOR]. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [Color=Red]| Ban 15 - 30 дней / PermBan[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Обман в /do',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]2.10[/COLOR]. Запрещено в любой форме обманывать в /do, даже если это в дальнейшем негативно скажется на Вашем игровом персонаже [Color=Red]| Jail 30 минут / Warn[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Затягивание RP процесса',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]2.12[/COLOR]. Запрещено целенаправленное затягивание Role Play процесса [Color=Red]| Jail 30 минут[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Невозврат долга',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]2.57[/COLOR]. Запрещается брать в долг игровые ценности и не возвращать их [Color=Red]| Ban 30 дней / PermBan[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Обход системы / Багоюз',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]2.21[/COLOR]. Запрещено пытаться обходить игровую систему или использовать любые баги сервера [Color=Red]| Ban 15 - 30 дней / PermBan[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Скрывание багов / распространение игрокам',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]2.23[/COLOR]. Запрещено скрывать от администрации баги системы, а также распространять их игрокам [Color=Red]| Ban 15 - 30 дней / PermBan[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Покрывательство нарушителей',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]2.24[/COLOR]. Запрещено скрывать от администрации нарушителей или злоумышленников [Color=Red]| Ban 15 - 30 дней / PermBan + ЧС проекта[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Попытка / вред репутации проекта',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]2.25[/COLOR]. Запрещены попытки или действия, которые могут навредить репутации проекта [Color=Red]| PermBan + ЧС проекта[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Реклама',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]2.31[/COLOR]. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное [Color=Red]| Ban 7 дней / PermBan[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Обман администрации',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]2.32[/COLOR]. Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта [Color=Red]| Ban 7 - 15 дней[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Использование уязвимости правил',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]2.33[/COLOR]. Запрещено пользоваться уязвимостью правил [Color=Red]| Ban 15-30 дней / PermBan[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
          
           
           {
             title: 'Конфликты',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]2.35[/COLOR]. На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате [Color=Red]| Mute 120 минут / Ban 7 дней[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'OOC угрозы',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]2.37[/COLOR]. Запрещены OOC угрозы, в том числе и завуалированные [Color=Red]| Mute 120 минут / Ban 7 дней[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Распространение личной инфы',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]2.38[/COLOR]. Запрещено распространять личную информацию игроков и их родственников [Color=Red]| Ban 15 - 30 дней / PermBan[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Злоупотребление нарушениями',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]2.39[/COLOR]. Злоупотребление нарушениями правил сервера [Color=Red]| Ban 7 - 30 дней[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Критика / призыв покинуть проект',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]2.40[/COLOR]. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [Color=Red]| Mute 300 минут / Ban 30 дней[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Продажа промокодов',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]2.43[/COLOR]. Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций [Color=Red]| Mute 120 минут[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Покупка / Продажа ИВ',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]2.28[/COLOR]. Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги [Color=Red]| PermBan с обнулением аккаунта + ЧС проекта[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
        {
             title: 'Передача своего акка',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]4.03[/COLOR]. Запрещена Передача своего личного игрового аккаунта третьим лицам [Color=Red]| PermBan [/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
        {
             title: 'Ник',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]4.06[/COLOR]. Никнейм игрового аккаунта должен быть в формате "Имя_Фамилия" на английском языке [Color=Red]| Устное замечание + смена игрового никнейма [/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Попытка ущерба экономике',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]2.30[/COLOR]. Запрещено пытаться нанести ущерб экономике сервера [Color=Red]| Ban 15 - 30 дней / PermBan[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Задержание в интерьере, казино, аукционе',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]2.50[/COLOR]. Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий [Color=Red]| Ban 7 - 15 дней + увольнение из организации[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'NonRP аксессуар',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]2.52[/COLOR]. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера [Color=Red]| При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Мат в названии',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]2.53[/COLOR]. Запрещено устанавливать названия для внутриигровых ценностей с использованием нецензурной лексики, оскорблений, слов политической или религиозной наклонности [Color=Red]| Ban 1 день / При повторном нарушении обнуление бизнеса[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Оскорбление администрации',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]2.54[/COLOR]. Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [Color=Red]| Mute 180 минут[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Багоюз анимаций',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]2.55[/COLOR]. Запрещается багоюз связанный с анимацией в любых проявлениях [Color=Red]| Jail 60 / 120 минут[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Аморальные действия',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]2.08[/COLOR]. Запрещена любая форма аморальных действий сексуального характера в сторону игроков (Исключение: обоюдное согласие обеих сторон). [Color=Red]| Jail 30 минут / Warn[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
        {
             title: 'Слив склада',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]2.09[/COLOR]. Запрещено сливать склад фракции / семьи путем взятия большого количества ресурсов или превышая допустимый лимит, установленный лидером . [Color=Red]| Ban 15 - 30 дней / PermBann[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
          title: '~~~~~~~~~~~~~~~~~~~~⠀⠀Игровые чаты⠀~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
          dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
           
           {
             title: 'CapsLock',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]3.02[/COLOR]. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [Color=Red]| Mute 30 минут[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Оскорбления/издевательства и т.п',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]3.03[/COLOR]. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [Color=Red]| Mute 30 минут[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Упоминание/оск родных',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]3.04[/COLOR]. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [Color=Red]| Mute 120 минут / Ban 7 - 15 дней[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Флуд',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]3.05[/COLOR]. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [Color=Red]| Mute 30 минут[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Злоупотребление символами',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]3.06[/COLOR]. Запрещено злоупотребление знаков препинания и прочих символов [Color=Red]| Mute 30 минут[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           
           {
             title: 'Слив глобального чата',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]3.08[/COLOR]. Запрещены любые формы «слива» посредством использования глобальных чатов [Color=Red]| PermBan[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },

        {
             title: 'Выдача себя за адм',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]3.10[/COLOR]. Запрещена выдача себя за администратора, если таковым не являетесь [Color=Red]| Ban 7 - 15 + ЧС администрации[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Ввод в заблуждение',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]3.11[/COLOR]. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [Color=Red]| Ban 15 - 30 дней / PermBan[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Музыка в Voice',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]3.14[/COLOR]. Запрещено включать музыку в Voice Chat [Color=Red]| Mute 60 минут[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           
           {
             title: 'Посторонние звуки в Voice',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]3.16[/COLOR]. Запрещено создавать посторонние шумы или звуки [Color=Red]| Mute 30 минут[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           
           {
             title: 'Политическая/религиозная пропаганда',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]3.18[/COLOR]. Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов [Color=Red]| Mute 120 минут / Ban 10 дней[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Изменение голоса',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]3.19[/COLOR]. Запрещено использование любого софта для изменения голоса [Color=Red]| Mute 60 минут[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Транслит',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]3.20[/COLOR]. Запрещено использование транслита в любом из чатов [Color=Red]| Mute 30 минут[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Реклама промокода',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]3.21[/COLOR]. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах [Color=Red]| Ban 30 дней[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Объявления на тт ГОСС',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]3.22[/COLOR]. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [Color=Red]| Mute 30 минут[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Мат в VIP chat',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]3.23[/COLOR]. Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чат [Color=Red]| Mute 30 минут[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
         {
             title: 'провокация в VIP chat',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]3.23[/COLOR].  Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов [Color=Red]| | Mute 120 минут / Ban 10 дней[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
         {
             title: 'оск адм',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]3.23[/COLOR].  2.54. Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [Color=Red]| | Mute 180 минут[/COLOR][/B][/FONT][/SIZE]<br><br>' +
            '[Color=Red]3.23[/COLOR]. Пример: оформление жалобы в игре с текстом: "Быстро починил меня", "Админы вы задрали уже когда работать будете меня тут ДБшат я 3 жалобы уже подал!!!!!!!!", "МОЗГИ ВКЛЮЧИТЕ Я УВОЛЮ ВАС ЩА" и т.д. и т.п., а также при взаимодействии с другими игроками. [/B][/FONT][/SIZE]<br><br>' +
             '[Color=Red]3.23[/COLOR]. Пример: оскорбление администрации в любой чат, включая репорт подлежит наказанию в виде блокировки доступа к использованию всех видов чатов - [Color=Red]| | Mute 180 минут[/COLOR] [/B][/FONT][/SIZE]<br><br>' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
          title: ' ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~⠀Положение об игр. акках ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
          dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
          {
             title: 'Маты/оски в никнейме',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]4.09[/COLOR]. Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) [Color=Red]| Устное замечание + смена игрового никнейма / PermBan[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Фейк',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]4.10[/COLOR]. Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [Color=Red]| Устное замечание + смена игрового никнейма / PermBan[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
          title: '~~~~~~~~~~~~~~~~~~~⠀Правила ГОСС⠀~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
          dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
          {
             title: 'NonRP Edit',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]4.01[/COLOR]. Запрещено редактирование объявлений, не соответствующих ПРО [Color=Red]| Mute 30 минут[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'NonRP Эфир',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]4.02[/COLOR]. Запрещено проведение эфиров, не соответствующих Role Play правилам и логике [Color=Red]| Mute 30 минут[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Замена объявлений',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]4.04[/COLOR]. Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [Color=Red]| Ban 7 дней + ЧС организации[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Слив СМИ',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]3.08[/COLOR]. Запрещены любые формы «слива» посредством использования глобальных чатов [Color=Red]| PermBan[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Одиночный патруль',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]1.11[/COLOR]. Всем силовым структурам запрещен одиночный патруль или конвоирование, минимум 2 сотрудника [Color=Red]| Jail 30 минут[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Фракционный транспорт в личных целях',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]1.08[/COLOR]. Запрещено использование фракционного транспорта в личных целях [Color=Red]| Jail 30 минут[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Работа в форме',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]1.07[/COLOR]. Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции [Color=Red]| Jail 30 минут[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Казино/БУ в форме',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]1.13[/COLOR]. Запрещено находиться в форме внутри казино, участвовать в битве за контейнеры, участвовать в захвате семейного контейнера, находится на Б/У рынке с целью покупки / продажи авто, а также устраиваться на сторонние работы в форме фракции [Color=Red]| Jail 30 минут[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Розыск без причины',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]6.02[/COLOR]. Запрещено выдавать розыск без Role Play причины [Color=Red]| Warn[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Штраф без причины',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]7.02[/COLOR]. Запрещено выдавать розыск, штраф без Role Play причины [Color=Red]| Warn[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Задержание участника БВ перед началом БВ',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]1.14[/COLOR]. Сотрудникам правоохранительных органов запрещается задерживать состав участников войны за бизнес за 10 минут непосредственно до начала самого бизвара (Исключение: в случае, если состав участников войны за бизнес первый начал совершать действия, которые нарушают закон.) [Color=Red]| Jail 30 минут[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'DM на территории ГИБДД',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]7.01[/COLOR]. Запрещено наносить урон игрокам без Role Play причины на территории ГИБДД [Color=Red]| DM / Jail 60 минут / Warn[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'DM на территории УМВД',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]7.01[/COLOR]. Запрещено наносить урон игрокам без Role Play причины на территории УМВД [Color=Red]| DM / Jail 60 минут / Warn[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'DM на территории МО',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]2.02[/COLOR]. Запрещено наносить урон игрокам без Role Play причины на территории ГИБДД [Color=Red]| DM / Jail 60 минут / Warn[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'DM на территории ФСБ',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]7.01[/COLOR]. Запрещено наносить урон игрокам без Role Play причины на территории ФСБ [Color=Red]| DM / Jail 60 минут / Warn[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'DM на территории ФСИН',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]7.01[/COLOR]. Запрещено наносить урон игрокам без Role Play причины на территории ФСИН [Color=Red]| DM / Jail 60 минут / Warn[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Отбирание в/у во время погони',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]7.04[/COLOR]. Запрещено отбирать водительские права во время погони за нарушителем [Color=Red]| Warn[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'NonRP поведение УМВД',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]6.03[/COLOR]. Запрещено nRP поведение (поведение, не соответствующее сотруднику УМВД) [Color=Red]| Warn[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
        {
             title: 'NonRP коп',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]6.03[/COLOR]. Запрещено nRP поведение (поведение, не соответствующее сотруднику УМВД) [Color=Red]| Warn[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
          title: '~~~~~~~~~~~~~~~~~~~~~~~~~~⠀Правила ОПГ⠀~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
          dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
          {
             title: 'Провокации сотрудников ГОСС',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]2[/COLOR]. Запрещено провоцировать сотрудников государственных организаций [Color=Red]| Jail 30 минут[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Провокации сотрудников других ОПГ',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]3[/COLOR]. Запрещено провоцировать сотрудников криминальных организаций возле или на территории вражеской группировки [Color=Red]| Jail 30 минут[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'DM на территории ОПГ',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]4[/COLOR]. Запрещено без причины наносить урон игрокам на территории ОПГ [Color=Red]| Jail 60 минут[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Дуэли (не во время БВ)',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]5[/COLOR]. Запрещено устраивать дуэли где-либо, а также на территории ОПГ (Исключение: территория проведения войны за бизнес, когда мероприятие не проходит.) [Color=Red]| Jail 30 минут[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Перестрелки с другими ОПГ в людных местах',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]6[/COLOR]. Запрещено устраивать перестрелки с другими ОПГ в людных местах [Color=Red]| Jail 60 минут[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Реклама, рынок в рации',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]7[/COLOR]. Запрещена любая реклама (семей, транспортных и строительных компаний и т.д.), предложения о купле, продаже, обмене чего-либо в чате организации [Color=Red]| Mute 30 минут[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Скрывательство от погони на тт ОПГ',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]8[/COLOR]. Запрещено уходить от погони со стороны правоохранительных органов путем заезда на территорию своей банды для того чтобы скрыться или получить численное преимущество [Color=Red]| Jail 30 минут[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'NonRP в/ч',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]2[/COLOR]. За нарушение правил нападения на Войсковую Часть выдаётся предупреждение [Color=Red]| Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
          {
          title: '~~~~~~~~~~~~~~~~~~~~~~~~~~~~⠀Правила Казино/Клуба⠀~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~⠀⠀⠀⠀⠀⠀⠀⠀⠀',
          dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
          {
             title: 'Принятие за деньги',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]2.01[/COLOR]. Владельцу и менеджерам казино и ночного клуба запрещено принимать работников за денежные средства на должность охранника, крупье или механика [Color=Red]| Ban 3 - 5 дней[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
           {
             title: 'Взимание денег за должность',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR]<br><br>' +
             'Игрок будет наказан по пункту правил:<br><br>' +
             "[QUOTE]" +
             '[Color=Red]2.02[/COLOR]. Владельцу и менеджерам казино и ночного клуба запрещено взимать у работников налоги в виде денежных средств за должность в казино [Color=Red]| Ban 3 - 5 дней[/COLOR][/B][/FONT][/SIZE]' +
             "[/QUOTE]<br><br>" +
             '[CENTER][COLOR=rgb(61, 235, 52)][FONT=times new roman][SIZE=4][ICODE] Одобрено. [/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br><br>' +
             "[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(209, 216, 213)][B]Приятной игры на [/B][/COLOR][COLOR=rgb(0, 128, 255)][B]AZURE[/B][/COLOR][COLOR=rgb(209, 216, 213)][B].[/B][/SIZE][/FONT][/CENTER][/COLOR]",
             prefix: ODOBRENO_PREFIX,
             status: false,
           },
          {
          title: '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~⠀Причины для отказов⠀~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
          dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
          {
             title: 'Нужен фрапс',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 216, 213)][SIZE=4][FONT=times new roman][B]В данных ситуациях требуется видеофиксация.<br>" +
             'Жалоба рассмотрению не подлежит.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4] Отказано, закрыто. [/FONT][/SIZE][/COLOR][/CENTER]',
             prefix: OTKAZANO_PREFIX,
             status: false,
           },
           {
             title: 'Нужен фрапс + промотка чата',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 216, 213)][SIZE=4][FONT=times new roman][B]В данных ситуациях требуется видеофиксация и промотка чата.<br>" +
             'Жалоба рассмотрению не подлежит.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4] Отказано, закрыто. [/FONT][/SIZE][/COLOR][/CENTER]',
             prefix: OTKAZANO_PREFIX,
             status: false,
           },
           {
             title: 'Нужна промотка чата',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 216, 213)][SIZE=4][FONT=times new roman][B]В данных ситуациях требуется проматывать чат.<br>" +
             'Жалоба рассмотрению не подлежит.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4] Отказано, закрыто. [/FONT][/SIZE][/COLOR][/CENTER]',
             prefix: OTKAZANO_PREFIX,
             status: false,
           },
          {
             title: 'Нужны тайм-коды',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 216, 213)][SIZE=4][FONT=times new roman][B]Укажите тайм-коды в 3 пункте.<br>" +
             'Жалоба рассмотрению не подлежит.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4] Отказано, закрыто. [/FONT][/SIZE][/COLOR][/CENTER]',
             prefix: OTKAZANO_PREFIX,
             status: false,
           },
          {
             title: 'Нерабочие док-ва',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 216, 213)][SIZE=4][FONT=times new roman][B]Ваши доказательства нерабочие.<br>" +
             'Соответственно, жалоба рассмотрению не подлежит.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4] Отказано, закрыто. [/FONT][/SIZE][/COLOR][/CENTER]',
             prefix: OTKAZANO_PREFIX,
             status: false,
           },
           {
             title: 'Док-ва подделаны/отредактированы',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 216, 213)][SIZE=4][FONT=times new roman][B]Ваши доказательства подделаны/отредактированы.<br>" +
             'Соответственно, жалоба рассмотрению не подлежит.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4] Отказано, закрыто. [/FONT][/SIZE][/COLOR][/CENTER]',
             prefix: OTKAZANO_PREFIX,
             status: false,
           },
           {
             title: 'Дублирование жалобы',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 216, 213)][SIZE=4][FONT=times new roman][B]Вам был дан ответ в прошлой теме.<br>" +
             'Пожалуйста, не создавайте дубликаты данной жалобы, иначе ваш форумный аккаунт будет заблокирован.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4] Отказано, закрыто. [/FONT][/SIZE][/COLOR][/CENTER]',
             prefix: OTKAZANO_PREFIX,
             status: false,
           },
           {
             title: 'Нету условий сделки',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 216, 213)][SIZE=4][FONT=times new roman][B]Вы не обсудили условия сделки/Неправельно написали условие сделки.<br>" +
             'Соответственно, жалоба рассмотрению не подлежит.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4] Отказано, закрыто. [/FONT][/SIZE][/COLOR][/CENTER]',
             prefix: OTKAZANO_PREFIX,
             status: false,
           },
           {
             title: 'Недостаточно док-в',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 216, 213)][SIZE=4][FONT=times new roman][B]Недостаточно доказательств.<br>" +
             'Соответственно, жалоба рассмотрению не подлежит.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4] Отказано, закрыто. [/FONT][/SIZE][/COLOR][/CENTER]',
             prefix: OTKAZANO_PREFIX,
             status: false,
           },
        {
             title: 'размытые/плохое качество док-в',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 216, 213)][SIZE=4][FONT=times new roman][B] В вашей жалобе размытые доказательство или плохое качество. Просим вас сделать другие доказательства.<br>" +
             'Соответственно, жалоба рассмотрению не подлежит.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4] Отказано, закрыто. [/FONT][/SIZE][/COLOR][/CENTER]',
             prefix: OTKAZANO_PREFIX,
             status: false,
           },
           {
             title: 'Док-ва не загружены на хостинги',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
              "[COLOR=rgb(209, 216, 213)][SIZE=4][FONT=times new roman][B]Доказательства не загружены на фотохостинг.<br>" +
             "[COLOR=rgb(209, 216, 213)][SIZE=4][FONT=times new roman][B]Доказательства должны быть загружены на Imgur, Yapix, ibb,YouTube.<br>" +
             'Жалоба рассмотрению не подлежит.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4] Отказано, закрыто. [/FONT][/SIZE][/COLOR][/CENTER]',
             prefix: OTKAZANO_PREFIX,
             status: false,
           },
           {
             title: 'Жалоба от 3-го лица',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 216, 213)][SIZE=4][FONT=times new roman][B]Жалоба написана от 3-го лица, соответственно рассмотрению не подлежит.[/B][/FONT][/SIZE][/COLOR]<br><br>" +
             '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4] Отказано, закрыто. [/FONT][/SIZE][/COLOR][/CENTER]',
             prefix: OTKAZANO_PREFIX,
             status: false,
           },
           {
             title: 'Игрок уже наказан',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 216, 213)][SIZE=4][FONT=times new roman][B]Игрок уже получил наказание.[/B][/FONT][/SIZE][/COLOR]<br><br>" +
             '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4] Отказано, закрыто. [/FONT][/SIZE][/COLOR][/CENTER]',
             prefix: OTKAZANO_PREFIX,
             status: false,
           },
           {
          title: '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~⠀Передача⠀~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
          dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
          {
             title: 'Передать теху',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 216, 213)][SIZE=4][FONT=times new roman][B]Ваша жалоба передана на рассмотрение \"Техническому Специалисту\".<br><br>" +
             'Ожидайте ответа в данной теме, не создавайте копии.[/B][/FONT][/SIZE][/COLOR]',
             prefix: TEX_PREFIX,
             status: true,
           },
          {
             title: 'Передать куратору адм',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 216, 213)][SIZE=4][FONT=times new roman][B]Ваша жалоба передана на рассмотрение \"Куратору Администрации\".<br><br>" +
             'Ожидайте ответа в данной теме, не создавайте копии.[/B][/FONT][/SIZE][/COLOR]',
             prefix: GA_PREFIX,
             status: true,
           },
          {
             title: 'Передать куратору техов',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 216, 213)][SIZE=4][FONT=times new roman][B]Ваша жалоба передана на рассмотрение \"Куратору тех. специалистов\".<br><br>" +
             'Ожидайте ответа в данной теме, не создавайте копии.[/B][/FONT][/SIZE][/COLOR]',
             prefix: GA_PREFIX,
             status: true,
           },
          {
             title: 'Передать ЗГА',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 216, 213)][SIZE=4][FONT=times new roman][B]Ваша жалоба передана на рассмотрение \"Заместителю Главного Администратора\".<br><br>" +
             'Ожидайте ответа в данной теме, не создавайте копии.[/B][/FONT][/SIZE][/COLOR]',
             prefix: ZAKREP_PREFIX,
             status: true,
           },
           {
             title: 'Передать ГА',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 216, 213)][SIZE=4][FONT=times new roman][B]Ваша жалоба передана на рассмотрение \"Главному Администратору\".<br><br>" +
             'Ожидайте ответа в данной теме, не создавайте копии.[/B][/FONT][/SIZE][/COLOR]',
             prefix: GA_PREFIX,
             status: true,
           },
           {
          title: '~~~~~~~~~~~~~~~~~~~~~~~~~~~~⠀Перенаправление в другие разделы⠀~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
          dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
          {
             title: 'В жалобы на администрацию',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 216, 213)][SIZE=4][FONT=times new roman][B]Вы ошиблись разделом, вам стоит обратиться в раздел [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.721/']Жалобы на администрацию.[/COLOR].<br><br>" +
             '[COLOR=rgb(255, 0, 0)]Закрыто.[/B][/FONT][/SIZE][/COLOR]',
             prefix: ZAKRITO_PREFIX,
             status: false,
           },
           {
             title: 'В жалобы на лидеров',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 216, 213)][SIZE=4][FONT=times new roman][B]Вы ошиблись разделом, вам стоит обратиться в раздел [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.722/']Жалобы на лидеров.[/COLOR].<br><br>" +
             '[COLOR=rgb(255, 0, 0)]Закрыто.[/B][/FONT][/SIZE][/COLOR]',
             prefix: ZAKRITO_PREFIX,
             status: false,
           },
           {
             title: 'В жалобы на сотрудников',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 216, 213)][SIZE=4][FONT=times new roman][B]Вы ошиблись разделом, вам стоит обратиться в Жалобы на сотрудников[/COLOR].<br><br>" +
             '[COLOR=rgb(255, 0, 0)]Закрыто.[/B][/FONT][/SIZE][/COLOR]',
             prefix: ZAKRITO_PREFIX,
             status: false,
           },
           {
             title: 'В обжалования наказаний',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 216, 213)][SIZE=4][FONT=times new roman][B]Вы ошиблись разделом, вам стоит обратиться в раздел [URL='https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.724/']Обжалование наказаний.[/COLOR].<br><br>" +
             '[COLOR=rgb(255, 0, 0)]Закрыто.[/B][/FONT][/SIZE][/COLOR]',
             prefix: ZAKRITO_PREFIX,
             status: false,
           },
           {
             title: 'В технический раздел',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][B]{{ greeting }}, уважаемый {{ user.mention }}.[/B][/FONT][/SIZE][/COLOR]<br><br>' +
             "[COLOR=rgb(209, 216, 213)][SIZE=4][FONT=times new roman][B]Вы ошиблись разделом, вам стоит обратиться в [URL='https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-azure.701/']Технический раздел.[/COLOR].<br><br>" +
             '[COLOR=rgb(255, 0, 0)]Закрыто.[/B][/FONT][/SIZE][/COLOR]',
             prefix: ZAKRITO_PREFIX,
             status: false,
           },
	];

	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
        addButton('На рассмотрении', 'pin', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255,173,51, 0.5);');
        addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5);')
        addButton('Одобрено', 'accepted', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5);')
	addButton('Закрыто', 'closed', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5);');
	addReports();

	// Поиск информации о теме
	const threadData = getThreadData();

	$(`button#ff`).click(() => pasteContent(8, threadData, true));
	$(`button#prr`).click(() => pasteContent(2, threadData, true));
	$(`button#zhb`).click(() => pasteContent(21, threadData, true));
        $('button#accepted').click(() => editThreadData(ODOBRENO_PREFIX, false));
	$('button#unaccept').click(() => editThreadData(OTKAZANO_PREFIX, false));
	$('button#pin').click(() => editThreadData(ZAKREP_PREFIX, true));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
	$('button#decided').click(() => editThreadData(DECIDED_PREFIX, false));
	$('button#closed').click(() => editThreadData(ZAKRITO_PREFIX, false));
	$('button#closed_complaint').click(() => editThreadData(CLOSED_PREFIX, false, false));
	$('button#techspec').click(() => editThreadData(TEX_PREFIX, true));

	$(`button#selectReport`).click(() => {
	XF.alert(buttonsMarkup(buttons), null, 'ВЫБЕРИТЕ ОТВЕТ');
	buttons.forEach((btn, id) => {
	if (id > 1) {
	$(`button#reports-${id}`).click(() => pasteContent(id, threadData, true));
	}
	else {
	$(`button#reports-${id}`).click(() => pasteContent(id, threadData, false));
	}
	});
	});
	});

    function addButton(name, id, style) {
         $('.button--icon--reply').before(
	`<button type="button" class="button--primary button rippleButton" id="${id}" style="${style}">${name}</button>`,
	);
	}
	function addReports() {
		$('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectReport" style="oswald: 3px; margin-left: 5px; margin-top: 10px; border-radius: 13px;">ЖАЛОБЫ</button>`,
	);
	}

	function buttonsMarkup(buttons) {
	return `<div class="select_answer">${buttons
	.map(
	(btn, i) =>
	`<button id="reports-${i}" class="button--primary button ` +
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
	11 < hours && hours <= 17 ?
	'Добрый день' :
	17 < hours && hours <= 21 ?
	'Добрый вечер' :
	'Доброй ночи',
	};

	}
          function editThreadData(prefix, pin = false)
          {
          // Получаем заголовок темы, так как он необходим при запросе
            const threadTitle = $('.p-title-value')[0].lastChild.textContent;

            if(pin == false)
            {
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
            if(pin == true)
            {
              fetch(`${document.URL}edit`,
              {
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
const bgButtons = document.querySelector(".pageContent");

const buttonConfig = (text, href) => {
    const button = document.createElement("button");

    button.style.color = "#FFFFFF";
    button.style.backgroundColor = "#212529";
    button.style.borderColor = "#6c757d";
    button.style.borderRadius = "13px";
    button.style.borderStyle = "solid";
    button.style.borderWidth = "1px";
    button.style.padding = "0.5rem 1rem";
    button.style.fontSize = "1rem";
    button.style.cursor = "pointer";
    button.style.transition = "background-color 0.3s ease";
    button.textContent = text;
    button.classList.add("bgButton");
    button.addEventListener("mouseover", () => {
        button.style.backgroundColor = "#343a40";
    });
    button.addEventListener("mouseout", () => {
        button.style.backgroundColor = "#212529";
    });
    button.addEventListener("click", () => {
        window.location.href = href;
    });
    return button;
};


const Button16 = buttonConfig("Жалобы", 'https://forum.blackrussia.online/forums/Жалобы-на-игроков.723/');
const Button17 = buttonConfig("РП биографии", 'https://forum.blackrussia.online/forums/РП-биографии.729/');

bgButtons.append(Button16); // Жалобы
bgButtons.append(Button17); // РП биографии

const scrollCSS = `
    @media (max-width: 768px) {
        .pageContent {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            white-space: nowrap;
        }
        .pageContent > button {
            display: inline-block;
            white-space: normal;
        }
    }
`;
document.head.insertAdjacentHTML("beforeend", `<style>${scrollCSS}</style>`);