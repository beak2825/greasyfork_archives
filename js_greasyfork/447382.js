// ==UserScript==
// @name         Тех скрипт
// @namespace    https://forum.blackrussia.online
// @version      1.3.9
// @description  Для борьбы с техническими шоколадками
// @author       BLACK RUSSIA
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license 	 MIT
// @collaborator Basis of Antonio Carrizo and consultant Rosenfeld
// @icon https://icons.iconarchive.com/icons/thesquid.ink/free-flat-sample/128/support-icon.png
// @copyright 2022, BLACK RUSSIA (https://vk.com/blackrussia.online)
// @downloadURL https://update.greasyfork.org/scripts/447382/%D0%A2%D0%B5%D1%85%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/447382/%D0%A2%D0%B5%D1%85%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82.meta.js
// ==/UserScript==
(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 6; // Prefix that will be set when thread solved
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const TECHADM_PREFIX = 13;
const buttons = [
	{
	  title: 'Приветствие',
	  content:
		'[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
        '[CENTER][/CENTER]'
	},
    {
	  title: 'Тех спецу',
	  content:
		'[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
        '[CENTER]Тема передана на рассмотрение техническому специалисту по направлению «логирования»<br><br>Ожидайте ответ. Новых тем создавать не нужно.​[/CENTER]'
	},
    		{
	  title: 'Повышение в орг/инвайт',
	  content:
		'[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
        "[CENTER]Команда технических специалистов не трудоустраивает, не повышает в организациях. Для это созданы специальные разделы на форуме вашего сервера.<br>Вы можете выбрать сервер, на котором вы играете, организацию в которою хотите вступить или повыситься и нажать на название организации чтобы перейти в нужный вам раздел.<br>Желаем удачи в развитии по карьерной лестнице в организациях.<br><br>[B][SIZE=5]Государственные организации:[/SIZE][/B]<br><br>Сервер №1 | RED<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.66/']• Правительство.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%91.68/']• ФСБ.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%93%D0%98%D0%91%D0%94%D0%94.69/']• ГИБДД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A3%D0%9C%D0%92%D0%94.70/']• УМВД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%BC%D0%B8%D1%8F.67/']• Армия[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%91%D0%BE%D0%BB%D1%8C%D0%BD%D0%B8%D1%86%D0%B0.71/']• Больница[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A1%D0%9C%D0%98.72/']• СМИ[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%98%D0%9D.741/']• ФСИН.[/URL]<br><br>Сервер №2 | GREEN<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.102/']• Правительство.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%91.103/']• ФСБ.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%93%D0%98%D0%91%D0%94%D0%94.106/']• ГИБДД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A3%D0%9C%D0%92%D0%94.107/']• УМВД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%BC%D0%B8%D1%8F.165/']• Армия[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%91%D0%BE%D0%BB%D1%8C%D0%BD%D0%B8%D1%86%D0%B0.108/']• Больница[/URL]<br>• СМИ<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%98%D0%9D.742/']• ФСИН.[/URL]<br><br>Сервер №3 | BLUE<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.141/']• Правительство.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%91.142/']• ФСБ.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%93%D0%98%D0%91%D0%94%D0%94.143/']• ГИБДД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A3%D0%9C%D0%92%D0%94.144/']• УМВД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%BC%D0%B8%D1%8F.145/']• Армия[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%91%D0%BE%D0%BB%D1%8C%D0%BD%D0%B8%D1%86%D0%B0.146/']• Больница[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A1%D0%9C%D0%98.147/']• СМИ[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%98%D0%9D.743/']• ФСИН.[/URL]<br><br>Сервер №4 | YELLOW<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.179/']• Правительство.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%91.180/']• ФСБ.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%93%D0%98%D0%91%D0%94%D0%94.181/']• ГИБДД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A3%D0%9C%D0%92%D0%94.182/']• УМВД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%BC%D0%B8%D1%8F.183/']• Армия[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%91%D0%BE%D0%BB%D1%8C%D0%BD%D0%B8%D1%86%D0%B0.184/']• Больница[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A1%D0%9C%D0%98.185/']• СМИ[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%98%D0%9D.744/']• ФСИН.[/URL]<br><br>Сервер №5 | ORANGE<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.258/']• Правительство.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%91.259/']• ФСБ.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%93%D0%98%D0%91%D0%94%D0%94.260/']• ГИБДД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A3%D0%9C%D0%92%D0%94.261/']• УМВД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%BC%D0%B8%D1%8F.262/']• Армия[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%91%D0%BE%D0%BB%D1%8C%D0%BD%D0%B8%D1%86%D0%B0.263/']• Больница[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A1%D0%9C%D0%98.264/']• СМИ[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%98%D0%9D.745/']• ФСИН.[/URL]<br><br>Сервер №6 | PURPLE<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.297/']• Правительство.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%91.298/']• ФСБ.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%93%D0%98%D0%91%D0%94%D0%94.299/']• ГИБДД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A3%D0%9C%D0%92%D0%94.300/']• УМВД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%BC%D0%B8%D1%8F.301/']• Армия[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%91%D0%BE%D0%BB%D1%8C%D0%BD%D0%B8%D1%86%D0%B0.302/']• Больница[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A1%D0%9C%D0%98.303/']• СМИ[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%98%D0%9D.746/']• ФСИН.[/URL]<br><br>Сервер №7 | LIME<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.337/']• Правительство.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%91.338/']• ФСБ.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%93%D0%98%D0%91%D0%94%D0%94.339/']• ГИБДД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A3%D0%9C%D0%92%D0%94.340/']• УМВД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%BC%D0%B8%D1%8F.341/']• Армия[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%91%D0%BE%D0%BB%D1%8C%D0%BD%D0%B8%D1%86%D0%B0.342/']• Больница[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A1%D0%9C%D0%98.343/']• СМИ[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%98%D0%9D.747/']• ФСИН.[/URL]<br><br>Сервер №8 | PINK<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.379/']• Правительство.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%91.380/']• ФСБ.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%93%D0%98%D0%91%D0%94%D0%94.381/']• ГИБДД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A3%D0%9C%D0%92%D0%94.382/']• УМВД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%BC%D0%B8%D1%8F.383/']• Армия[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%91%D0%BE%D0%BB%D1%8C%D0%BD%D0%B8%D1%86%D0%B0.384/']• Больница[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A1%D0%9C%D0%98.385/']• СМИ[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%98%D0%9D.748/']• ФСИН.[/URL]<br><br>Сервер №9 | CHERRY<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.420/']• Правительство.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%91.421/']• ФСБ.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%93%D0%98%D0%91%D0%94%D0%94.422/']• ГИБДД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A3%D0%9C%D0%92%D0%94.423/']• УМВД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%BC%D0%B8%D1%8F.424/']• Армия[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%91%D0%BE%D0%BB%D1%8C%D0%BD%D0%B8%D1%86%D0%B0.425/']• Больница[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A1%D0%9C%D0%98.426/']• СМИ[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%98%D0%9D.749/']• ФСИН.[/URL]<br><br>Сервер №10 | BLACK<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.452/']• Правительство.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%91.453/']• ФСБ.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%93%D0%98%D0%91%D0%94%D0%94.454/']• ГИБДД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A3%D0%9C%D0%92%D0%94.455/']• УМВД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%BC%D0%B8%D1%8F.456/']• Армия[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%91%D0%BE%D0%BB%D1%8C%D0%BD%D0%B8%D1%86%D0%B0.457/']• Больница[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A1%D0%9C%D0%98.458/']• СМИ[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%98%D0%9D.750/']• ФСИН.[/URL]<br><br>Сервер №11 | INDIGO<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.504/']• Правительство.[/URL]<br>•[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%91.505/'] ФСБ.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%93%D0%98%D0%91%D0%94%D0%94.506/']• ГИБДД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A3%D0%9C%D0%92%D0%94.507/']• УМВД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%BC%D0%B8%D1%8F.508/']• Армия[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%91%D0%BE%D0%BB%D1%8C%D0%BD%D0%B8%D1%86%D0%B0.509/']• Больница[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A1%D0%9C%D0%98.510/']• СМИ[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%98%D0%9D.751/']• ФСИН.[/URL]<br><br>Сервер №12 | WHITE<br><br>• Правительство.<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.544/']• ФСБ.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.545/']• ГИБДД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.546/']• УМВД[/URL].<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.547/']• Армия[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.548/']• Больница[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.549/']• СМИ[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%98%D0%9D.752/']• ФСИН.[/URL]<br><br>Сервер №13 | MAGENTA<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.584/']• Правительство.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.585/']• ФСБ.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.586/']• ГИБДД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.587/']• УМВД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.588/']• Армия[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.589/']• Больница[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.590/']• СМИ[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%98%D0%9D.753/']• ФСИН.[/URL]<br><br>Сервер №14 | CRIMSON<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.625/']• Правительство.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.626/']• ФСБ.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.627/']• ГИБДД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.628/']• УМВД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.629/']• Армия[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.630/']• Больница[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.631/']• СМИ[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%98%D0%9D.754/']• ФСИН[/URL].<br><br>Сервер №15 | GOLD<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.664/']• Правительство.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.665/']• ФСБ.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.666/']• ГИБДД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.667/']• УМВД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.668/']• Армия[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.669/']• Больница[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.670/']• СМИ[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%98%D0%9D.755/']• ФСИН.[/URL]<br><br>Сервер №16 | AZURE<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.705/']• Правительство.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.706/']• ФСБ.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.707/']• ГИБДД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.708/']• УМВД[/URL].<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.709/']• Армия[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.710/']• Больница[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.711/']• СМИ[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%98%D0%9D.756/']• ФСИН.[/URL]<br><br>Сервер №17 | PLATINUM<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.769/']• Правительство.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%91.770/']• ФСБ.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%91.771/']• ГИБДД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%91.772/']• УМВД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%91.773/']• Армия[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%91.774/']• Больница[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%91.775/']• СМИ[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%98%D0%9D.776/']• ФСИН.[/URL]<br><br>Сервер №18 | AQUA<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.828/']• Правительство.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.829/']• ФСБ.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%93%D0%98%D0%91%D0%94%D0%94.830/']• ГИБДД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%93%D0%98%D0%91%D0%94%D0%94.831/']• УМВД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%93%D0%98%D0%91%D0%94%D0%94.832/']• Армия[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%93%D0%98%D0%91%D0%94%D0%94.833/']• Больница[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%93%D0%98%D0%91%D0%94%D0%94.834/']• СМИ[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%98%D0%9D.835/']• ФСИН.[/URL]<br><br>Сервер №19 | GRAY<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.869/']• Правительство.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%91.870/']• ФСБ.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%91.871/']• ГИБДД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%91.872/']• УМВД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%91.873/']• Армия[/URL]<br>•[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%91.874/'] Больница[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%91.875/']• СМИ[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%98%D0%9D.876/']• ФСИН.[/URL]<br><br>Сервер №20 | ICE<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.938/']• Правительство.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.939/']• ФСБ.[/URL]<br>•[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.940/'] ГИБДД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.941/']• УМВД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.942/']• Армия[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.943/']• Больница[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.944/']• СМИ<[/URL]br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%98%D0%9D.945/']• ФСИН.[/URL]<br><br>Сервер №21 | CHILLI<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.978/']• Правительство.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.979/']• ФСБ.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.980/']• ГИБДД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.981/']• УМВД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.982/']• Армия[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.983/']• Больница[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.984/']• СМИ[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%98%D0%9D.985/']• ФСИН.[/URL]<br><br>Сервер №22 | CHOCO<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.1020/']• Правительство.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.1021/']• ФСБ.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.1022/']• ГИБДД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.1023/']• УМВД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.1024/']• Армия[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.1025/']• Больница[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.1026/']• СМИ[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%98%D0%9D.1027/']• ФСИН.[/URL]<br><br>Сервер №23 | MOSCOW<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.1066/']• Правительство.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.1067/']• ФСБ.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.1068/']• ГИБДД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.1069/']• УМВД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.1070/']• Армия[/URL]<br[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.1071/']>• Больница[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.1072/']• СМИ[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%98%D0%9D.1073/']• ФСИН.[/URL]<br><br>Сервер №24 | SPB<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.1108/']• Правительство.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.1109/']• ФСБ.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.1110/']• ГИБДД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A3%D0%9C%D0%92%D0%94.1111/']• УМВД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A3%D0%9C%D0%92%D0%94.1112/']• Армия[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A3%D0%9C%D0%92%D0%94.1113/']• Больница[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A3%D0%9C%D0%92%D0%94.1114/']• СМИ[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%98%D0%9D.1115/']• ФСИН.[/URL]<br><br>Сервер №25 | UFA<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.1151/']• Правительство.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.1152/']• ФСБ.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.1153/']• ГИБДД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.1154/']• УМВД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.1155/']• Армия[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.1156/']• Больница[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.1157/']• СМИ[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%98%D0%9D.1158/']• ФСИН.[/URL]<br><br>Сервер №26 | SOCHI<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.1218/']• Правительство.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.1219/']• ФСБ.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.1220/']• ГИБДД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A3%D0%9C%D0%92%D0%94.1221/']• УМВД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A3%D0%9C%D0%92%D0%94.1222/']• Армия[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A3%D0%9C%D0%92%D0%94.1223/']• Больница[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A3%D0%9C%D0%92%D0%94.1224/']• СМИ[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%98%D0%9D.1225/']• ФСИН.[/URL]<br><br>Сервер №27 | KAZAN<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.1260/']• Правительство.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.1261/']• ФСБ.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.1262/']• ГИБДД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.1263/']• УМВД.[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.1264/']• Армия[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.1265/']• Больница[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.1266/']• СМИ[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%A4%D0%A1%D0%98%D0%9D.1267/']• ФСИН.[/URL]<br><br><br>[B][SIZE=5]Криминальные организации:[/SIZE][/B]<br><br>Сервер №1 | RED<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.74/']• Арзамасская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%91%D0%B0%D1%82%D1%8B%D1%80%D0%B5%D0%B2%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.75/']• Батыревская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%91%D0%B0%D1%82%D1%8B%D1%80%D0%B5%D0%B2%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.76/']• Лыткаринская ОПГ.[/URL]<br><br>Сервер №2 | GREEN<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.110/']• Арзамасская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.111/']• Батыревская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.112/']• Лыткаринская ОПГ.[/URL]<br><br>Сервер №3 | BLUE<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.148/']• Арзамасская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.149/']• Батыревская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.150/']• Лыткаринская ОПГ.[/URL]<br><br>Сервер №4 | YELLOW<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.186/']• Арзамасская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.187/']• Батыревская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.188/']• Лыткаринская ОПГ.[/URL]<br><br>Сервер №5 | ORANGE<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.267/']• Арзамасская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.268/']• Батыревская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.269/']• Лыткаринская ОПГ.[/URL]<br><br>Сервер №6 | PURPLE<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.304/']• Арзамасская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.305/']• Батыревская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.306/']• Лыткаринская ОПГ.[/URL]<br><br>Сервер №7 | LIME<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.344/']• Арзамасская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.345/']• Батыревская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.346/']• Лыткаринская ОПГ.[/URL]<br><br>Сервер №8 | PINK<br><br>•[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.386/'] Арзамасская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.387/']• Батыревская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.388/']• Лыткаринская ОПГ.[/URL]<br><br>Сервер №9 | CHERRY<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.427/']• Арзамасская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.428/']• Батыревская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.429/']• Лыткаринская ОПГ.[/URL]<br><br>Сервер №10 | BLACK<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.460/']• Арзамасская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.461/']• Батыревская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.462/']• Лыткаринская ОПГ.[/URL]<br><br>Сервер №11 | INDIGO<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.511/']• Арзамасская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.512/']• Батыревская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.513/']• Лыткаринская ОПГ.[/URL]<br><br>Сервер №12 | WHITE<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.550/']• Арзамасская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.551/']• Батыревская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.552/']• Лыткаринская ОПГ.[/URL]<br><br>Сервер №13 | MAGENTA<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.591/']• Арзамасская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.592/']• Батыревская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.593/']• Лыткаринская ОПГ.[/URL]<br><br>Сервер №14 | CRIMSON<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.632/']• Арзамасская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.633/']• Батыревская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.634/']• Лыткаринская ОПГ.[/URL]<br><br>Сервер №15 | GOLD<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.672/']• Арзамасская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.673/']• Батыревская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.674/']• Лыткаринская ОПГ.[/URL]<br><br>Сервер №16 | AZURE<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.672/']• Арзамасская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.673/']• Батыревская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.674/']• Лыткаринская ОПГ.[/URL]<br><br>Сервер №17 | PLATINUM<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.777/']• Арзамасская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.778/']• Батыревская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.779/']• Лыткаринская ОПГ.[/URL]<br><br>Сервер №18 | AQUA<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.836/']• Арзамасская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.837/']• Батыревская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.838/']• Лыткаринская ОПГ.[/URL]<br><br>Сервер №19 | GRAY<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.877/']• Арзамасская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.878/']• Батыревская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.879/']• Лыткаринская ОПГ.[/URL]<br><br>Сервер №20 | ICE<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.946/']• Арзамасская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.947/']• Батыревская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.948/']• Лыткаринская ОПГ.[/URL]<br><br>Сервер №21 | CHILLI<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.986/']• Арзамасская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.987/']• Батыревская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.988/']• Лыткаринская ОПГ.[/URL]<br><br>Сервер №22 | CHOCO<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.1028/']• Арзамасская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.1029/']• Батыревская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.1030/']• Лыткаринская ОПГ.[/URL]<br><br>Сервер №23 | MOSCOW<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.1074/']• Арзамасская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.1075/']• Батыревская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.1076/']• Лыткаринская ОПГ.[/URL]<br><br>Сервер №24 | SPB<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.1116/']• Арзамасская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.1117/']• Батыревская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.1118/']• Лыткаринская ОПГ.[/URL]<br><br>Сервер №25 | UFA<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.1159/']• Арзамасская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.1160/']• Батыревская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.1161/']• Лыткаринская ОПГ.[/URL]<br><br>Сервер №26 | SOCHI<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.1226/']• Арзамасская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.1227/']• Батыревская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.1228/']• Лыткаринская ОПГ.[/URL]<br><br>Сервер №27 | KAZAN<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.1268/']• Арзамасская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.1269/']• Батыревская ОПГ.[/URL]<br><br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%90%D1%80%D0%B7%D0%B0%D0%BC%D0%B0%D1%81%D1%81%D0%BA%D0%B0%D1%8F-%D0%9E%D0%9F%D0%93.1270/']• Лыткаринская ОПГ.[/URL]<br><br>[/CENTER][RIGHT]Закрыто.[/RIGHT] "
	},
    {
	  title: 'Ошибочная блокировка',
	  content:
		'[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
        '[CENTER]Наказание, выданное вам выдано ошибочно. С аккаунта были сняты ограничения. просим прощения за данный инцедент.[/CENTER]<br><br>[RIGHT]Решено. Закрыто.[/RIGHT]'
	},
{
	  title: 'Багоюз/скин',
	  content:
		'[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
        '[CENTER]Ваш аккаунт был заблокирован за багоюз/использование багов со скином.<br>Данный скин можно получить только из промокода, на время. По истечению времени, скин должен удалиться автоматически, но так как этого не произошло вы решили воспользоваться недоработкой игры и получить выгоду с этого.<br><br>В данный момент мы предлагаем вам добровольно удалить данный скин с инвентаря под видеофиксацию. Если вы согласны на данные условия, отпишите в теме ответным сообщением.<br><br>Ожидаю вашего ответа.[/CENTER]'
	},
	{
	  title: 'В ОБЖ наказаний',
	  content:
		'[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
		"Если вы хотите срок вашего наказания вам следует обратиться в раздел «Обжалование наказаний» сервера, на котором вы играете.<br>Перед созданием темы следует заполнить форму подачи обжалования:<br><br>[CODE]1. Ваш Nick_Name:<br>2. Nick_Name администратора:<br>3. Дата выдачи/получения наказания:<br>4. Суть заявки:<br>5. Доказательство:[/CODE]<br><br>Помните, каждое обжалование рассматривается индивидуально, никто не дает гарантий одобрения и снижения/снятия наказания.<br><br>" +
        '[RIGHT]Закрыто.[/RIGHT]',
prefix: CLOSE_PREFIX,
        status: false,
	},
    		{
	  title: 'ЖБ на АДМ',
	  content:
		'[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
        '[CENTER]Вы получили наказание от администрации сервера.<br>Вам следует обратиться в раздел «Жалобы на администрацию» сервера, на котором вы играете.<br>Перед созданием темы следует заполнить форму подачи жалоб.<br><br>[ICODE]1. Ваш Nick_Name:<br>2. Nick_Name администратора:<br>3. Дата выдачи/получения наказания:<br>4. Суть жалобы:<br>5. Доказательство:[/ICODE]<br><br>Жалоба будет рассмотрена руководством сервера, в последствии чего будет вынесен вердикт.<br><br>[RIGHT]Закрыто.[/RIGHT]'
	},
	{
    title: 'потеря имущества зл-ками',
    content:
    '[CENTER][B]{{ greeting }}![/B][/CENTER]<br><br>' +
    '[CENTER]К сожалению, вероятнее всего, Ваш аккаунт был взломан злоумышленниками и поэтому мы никоем образом не сможем восстановить потерянное имущество. <br><br>' +
        '[CENTER]Впредь позаботьтесь о безопасности своего аккаунта. Приятной игры! <br><br>' +
        '[CENTER][I]Отказано[/I]. :( [/CENTER]',
  prefix: UNACCEPT_PREFIX,
  status: false,
  },
{
title: 'Актуально?',
content: '[CENTER][B]{{ greeting }}![/B][/CENTER]<br><br>' +
"[CENTER]Ваше обращение актуально?",
    prefix: PIN_PREFIX,
  status: true,
},
		{
	  title: 'Доква у куратора/передано',
	  content:
		'[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Жалоба передана Куратору технических специалистов.[/CENTER]<br><br>" +
        '[CENTER]Ожидайте ответа.<br><br>На рассмотрении[/CENTER]',
prefix: PIN_PREFIX,
        status: true,
	},

	{
	  title: 'Правила раздела',
	  content:
		'[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Пожалуйста, убедительная просьба, ознакомиться с назначением данного раздела в котором Вы создали тему, так как Ваша тема никоим образом не относится к  разделу жалоб на технических специалистов.[/CENTER]<br><br>" +
        '[CENTER]Отказано, закрыто.[/CENTER]',
prefix: UNACCEPT_PREFIX,
        status: false,
	},
{
	  title: 'Жалобы сервера',
	  content:
		'[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +

    "[LEFT]Обратитесь в раздел «Жалобы» Вашего сервера:<br><br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.54/'][B]Сервер №1 | Red[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.98/'][B]Сервер №2 | Green[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.138/'][B]Сервер №3 | Blue[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.174/'][B]Сервер №4 | Yellow[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.251/'][B]Сервер №5 | Orange[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.291/'][B]Сервер №6 | Purple[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.331/'][B]Сервер №7 | Lime[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.373/'][B]Сервер №8 | Pink[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.414/'][B]Сервер №9 | Cherry[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.467/'][B]Сервер №10 | Black[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.498/'][B]Сервер №11 | Indigo[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.654/'][B]Сервер №12 | White[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.655/'][B]Сервер №13 | Magenta[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/Жалобы.619/'][B]Сервер №14 | Crimson[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.700/'][B]Сервер №15 | Gold[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.720/'][B]Сервер №16 | Azure[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.763/'][B]Сервер №17 | Platinum[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.822/'] [B] Сервер №18 | Aqua[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.863/'][B]Сервер №19 | Gray[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.932/'] [B]Сервер №20 | Ice [/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.972/'] [B]Сервер №21 | Chilli [/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/Сервер-№22-choco.1009/'] [B]Сервер №22 | Choco [/B] → нажмите сюда[/URL]<br><br>" +
        '[CENTER]Отказано, закрыто.[/CENTER]',
        prefix: UNACCEPT_PREFIX,
        status: false,
	},
		{
	  title: 'ЖБ игроки',
	  content:
		'[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
        '[CENTER]Создайте тему в разделе «жалобы на игроков» сервера, на котором вы играете.<br><br>Перед созданием темы нужно заполнить форму подачи жалоб на игроков:<br><br>[CODE]1. Ваш Nick_Name:<br>2. Nick_Name игрока:<br>3. Суть жалобы:<br>4. Доказательство:[/CODE]<br><br>Срок подачи жалоб на игроков - 72 часа.[/CENTER]<br><br>[RIGHT]Закрыто.[/RIGHT]'
	},

	{
	  title: 'Краш/вылет',
	  content:
		'[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
		"[CENTER]В том случае, если Вы вылетели из игры во время игрового процесса (произошел краш), в обязательном порядке необходимо обратиться в данную тему - [URL='https://forum.blackrussia.online/index.php?threads/%D0%92%D1%8B%D0%BB%D0%B5%D1%82%D1%8B-%D0%BE%D1%82%D1%81%D0%BE%D0%B5%D0%B4%D0%B8%D0%BD%D0%B5%D0%BD%D0%B8%D1%8F-recaptcha-%E2%80%94-%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D1%8F%D0%B9%D1%82%D0%B5-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D1%83-%D0%B2-%D1%8D%D1%82%D0%BE%D0%B9-%D1%82%D0%B5%D0%BC%D0%B5.461493/']Тема для сообщения об отсоединениях, вылетах и т.д[/URL] [/CENTER]<br>" +
		"[CENTER][CODE]01. Ваш игровой никнейм: <br> 02. Сервер: <br> 03. Тип проблемы: Обрыв соединения | Проблема с ReCAPTCHA | Краш игры (закрытие игры) | Другое [Выбрать один вариант ответа] <br> 04. Действия, которые привели к этому (при вылетах, по возможности предоставлять место сбоя): <br> 05. Как часто данная проблема: <br> 06. Полное название мобильного телефона: <br> 07. Версия Android: <br> 08. Дата и время (по МСК): <br> 09. Связь с Вами по Telegram/VK:[/CODE]<br><br>" +
		'[CENTER]Решено, заполните данную форму в теме, указанной выше.[/CENTER]',
		prefix: ACCEPT_PREFIX,
		status: false,
	},
	{
	  title: 'Дублирование темы',
	  content:
		'[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ответ уже был дан в подобной теме. Пожалуйста, прекратите создавать идентичные или похожие темы - иначе Ваш форумный аккаунт может быть заблокирован.<br><br>" +
		'[CENTER]Отказано, закрыто.[/CENTER]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
	  title: 'Сервер не отвечает',
	  content:
	    '[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
	    "[CENTER]Если у Вас встречаются такие проблемы, как «Сервер не отвечает», не отображаются сервера в лаунчере, не удаётся выполнить вход на сайт/форум, попробуйте совершить следующие действия: <br><br>" +
	    "[LEFT]• Сменить IP-адрес любыми средствами; <br>" +
   "[LEFT]• Переключиться на Wi-Fi/мобильный интернет или на любую доступную сеть; <br>"+
    "[LEFT]• Использование VPN; <br>"+
    "[LEFT]• Перезагрузка роутера.<br><br>" +

"[CENTER]Если методы выше не помогли, то переходим к следующим шагам: <br><br>" +

  '[LEFT]1. Устанавливаем приложение «1.1.1.1: Faster & Safer Internet» Ссылка: https://clck.ru/ZP6Av и переходим в него.<br>'+
  '[LEFT]2. Соглашаемся со всей политикой приложения.<br>'+
  '[LEFT]3. Нажимаем на ползунок и ждем, когда текст изменится на «Подключено».<br>'+
  '[LEFT]4. Проверяем: Отображаются ли серверы? Удается ли выполнить вход в игру? Работают ли другие источники (сайт, форум)? <br><br>' +

  "[CENTER]📹 Включение продемонстрировано на видео: https://youtu.be/Wft0j69b9dk <br><br>" +
	    '[CENTER]Рассмотрено.[/CENTER]',
	    prefix: WATCHED_PREFIX,
	    status: false,
	},
	{
	  title: 'Форма темы',
	  content:
		'[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Пожалуйста, заполните форму, создав новую тему: <br>[CODE]01. Ваш игровой никнейм:<br>02. Игровой никнейм технического специалиста:<br>03. Сервер, на котором Вы играете:<br>04. Описание ситуации (описать максимально подробно и раскрыто):<br>05. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>06. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/CODE]<br><br>" +
		'[CENTER]Отказано, закрыто.[/CENTER]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
		{
	  title: 'Форма темы на тех раздел',
	  content:
		'[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
        '[CENTER]Создайте новую тему заполнив данную форму:<br>[CODE]01. Ваш игровой никнейм:<br>02. Сервер, на котором Вы играете:<br>03. Суть возникшей проблемы (описать максимально подробно и раскрыто):<br>04. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>05. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/CODE][/CENTER]<br><br>[RIGHT]Отказано, закрыто.[/RIGHT]'
	},

{
	  title: 'Восстановление аккаунта',
	  content:
		'[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
		"[CENTER][B][SIZE=4]Если вы обезопасили свой игровой аккаунт одной из привязок к EMAIL/VKontakte восстановить пароль можно следующим способом:<br>1. При входе на сервер под кнопкой «Вход по отпечатку пальца» нажмите на «Восстановить пароль». (См. Ниже)[/SIZE][/B]<br>[IMG]https://i.yapx.ru/SGPq4.jpg[/IMG]<br>[B][SIZE=4]2. После нажатия на кнопку вы перейдете к следующей стадии восстановления, вам нужно ввести код из почты EMAIL.[/SIZE][/B]<br>[COLOR=rgb(209, 72, 65)][SIZE=4][B]ВАЖНО: [/B][/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4][B]Если в папке «Неотсортированные» нет письма, посмотрите в папке «СПАМ». (См. Ниже)[/B][/SIZE][/COLOR]<br>[IMG]https://i.yapx.ru/SGPq5.jpg[/IMG][IMG]https://i.yapx.ru/SGPq3.png[/IMG]<br>[IMG]https://i.yapx.ru/QXZke.png[/IMG]<br>[B][SIZE=4]Второй способ восстановления аккаунта с помощью бота [COLOR=rgb(251, 160, 38)]ВКонтакте[/COLOR]: [COLOR=rgb(0, 0, 0)][URL]https://vk.me/blackrussia.online[/URL][/COLOR]<br>Выберите нужный вам сервер, никнейм, на котором вы хотите произвести восстановление. Далее выберите пункт «Сбросить пароль».[/SIZE][/B]<br>[IMG]https://i.yapx.ru/QXZke.png[/IMG]<br>[B][SIZE=4]Если привязок небыло, увы, но восстановить доступ не получится. Игрок самостоятельно несет ответственность за свой игровой аккаунт.😕[/SIZE][/B]<br>[IMG]https://i.yapx.ru/QXZke.png[/IMG]<br><br>" +
        '[CENTER][B][SIZE=4]Надеемся, что вы сможете вернуть доступ к аккаунту. [/SIZE][SIZE=5][COLOR=rgb(97, 189, 109)]Рассмотрено.[/COLOR][/SIZE][/B][/CENTER]',
        prefix: WATCHED_PREFIX,
        status: false,
	},
{
	  title: 'Слетел аккаунт',
	  content:
        '[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
        "[CENTER]Аккаунт не может пропасть или аннулироваться просто так. Даже если Вы меняете ник, используете кнопки «починить игру» или «сброс настроек» - Ваш аккаунт не удаляется. Система работает иначе.<br><br>" +
        "[CENTER]Проверьте ввод своих данных: пароль, никнейм и сервер. Зачастую игроки просто забывают ввести актуальные данные и считают, что их аккаунт был удален. Будьте внимательны! Рассмотрено.<br><br>" +
        '[CENTER]Как ввести никнейм (на случай, если сменили в игре, но не поменяли в клиенте): https://youtu.be/c8rhVwkoFaU[/CENTER]',
        prefix: WATCHED_PREFIX,
        status: false,
	},
    {
	  title: 'Проблема будет исправлена',
	  content:
		'[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная недоработка будет проверена и исправлена. Спасибо, ценим Ваш вклад.<br><br>" +
		'[CENTER]Рассмотрено.[/CENTER]',
		prefix: WATCHED_PREFIX,
		status: false,
	},
	{
	  title: 'Известно о проблеме',
	  content:
		'[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Команде проекта уже известно о данной проблеме, она обязательно будет рассмотрена и исправлена. Спасибо за Ваше обращение!<br><br>" +
		'[CENTER]Закрыто.[/CENTER]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
  {
	  title: 'Передано на тестирование',
	  content:
		'[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Благодарим за уведомление о недоработке. Ваша тема  находится в процессе тестирования.<br><br>" +
		'[CENTER]На рассмотрении.[/CENTER]',

 status: false,
	},
	{
	  title: 'Команде проекта',
	  content:
		'[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша тема закреплена и находится на рассмотрении. Пожалуйста, ожидайте выноса вердикта команды проекта.<br><br>" +
		'[CENTER]Создавать новые темы с данной проблемой — не нужно, ожидайте ответа в данной теме. Если проблема решится - Вы всегда можете уведомить нас о ее решении.[/CENTER]',
		prefix: COMMAND_PREFIX,

	},
	{
	  title: 'Логировщику/тестеру',
	  content:
	    '[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
	    "[CENTER]Ваша тема закреплена и находится на проверке и выявление недоработки. Пожалуйста, ожидайте ответа в данной теме.<br><br>" +
	    '[CENTER]Создавать новые темы с данной проблемой — не нужно.[/CENTER]',
	    prefix: TECHADM_PREFIX,
	},
	{
	  title: 'Компенсация',
	  content:
		'[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваше игровое имущество/денежные средства будут восстановлены в течение месяца. Убедительная просьба, не менять никнейм до момента восстановления.<br><br>" +
        '[CENTER]Для активации восстановления используйте команды: /roulette, /recovery.[/CENTER]<br><br>' +
		'[CENTER]Решено.[/CENTER]',
		prefix: ACCEPT_PREFIX,
		status: false,
	},
		{
	  title: 'Сброс прoписки',
	  content:
		'[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Прописка будет сброшена в течение месяца. Убедительная просьба, не менять никнейм до момента сброса.<br><br>" +
		'[CENTER]Решено.[/CENTER]',
		prefix: ACCEPT_PREFIX,
		status: false,
	},

	{
	  title: 'Нет доказательств',
	  content:
		'[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Без доказательств (в частности скриншоты или видео) – решить проблему не получится. Если доказательства найдутся - создайте новую тему, приложив доказательства с фото-хостинга yapx.ru или imgur.com<br><br>" +
		'[CENTER]Отказано, закрыто.[/CENTER]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
    	{
	  title: 'Правила восстановления',
	  content:
		'[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Пожалуйста, убедительная просьба, ознакомьтесь с правилами восстановлений: https://clck.ru/NeHEQ. Вы создали тему, которая никоим образом не относится к технической проблеме. Имущество не будет восстановлено.[/CENTER]<br><br>" +
		'[CENTER]Отказано, закрыто.[/CENTER]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
    {
	  title: 'Донат',
	  content:
		'[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Система построена таким образом, что деньги не спишутся, пока наша платформа не уведомит платежную систему о зачислении BLACK COINS. Для проверки зачисления BLACK COINS необходимо ввести в игре команду: /donat.<br><br>' +
        '[CENTER]В остальных же случаях, если не были зачислены BLACK COINS — вероятнее всего, была допущена ошибка при вводе реквизитов. К нашему сожалению, из-за большого количества попыток обмана, мы перестали рассматривать подобные жалобы. Вам необходимо быть внимательными при осуществлении покупок. <br><br>' +
        '[CENTER]Если Вы считаете, что ошибки быть не может и с момента оплаты не прошло более 7 дней, то в обязательном порядке обратитесь в данное сообщество для дальнейшего решения: https://vk.com/br_tech.<br><br>' +

        '[CENTER]Решено.[/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
	  title: 'Хочу стать администратором',
	  content:
		'[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Команда технических специалистов не решает назначение на какую-либо должность, которая присутствует на проекте. Для этого существуют заявления в главном разделе Вашего игрового сервера, где Вы можете ознакомиться с открытыми должностями и формами подач. Приятной игры и желаем удачи в карьерной лестнице!😉<br><br>" +
		'[CENTER]Закрыто.[/CENTER]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
    {
	  title: 'Жалобы на технического специалиста',
	  content:
		'[CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Вы получили наказание от технического специалиста Вашего сервера. Вам следует обратиться в раздел «Жалобы на технических специалистов» — в случае, если Вы не согласны с наказанием.<br><br>' +
        '[CENTER]Ссылка на раздел, где можно оформить жалобу на технического специалиста: https://clck.ru/ThmZA <br><br>' +
        '[CENTER]Закрыто.[/CENTER]',
        prefix: CLOSE_PREFIX,
        status: false,
	},
];

$(document).ready(() => {
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

// Добавление кнопок при загрузке страницы
addButton('На рассмотрении', 'pin');
addButton('КП', 'teamProject');
addButton('Отказано', 'unaccept');
addButton('Рассмотрено', 'watched');
addButton('Решено', 'accepted');
addButton('Закрыто', 'closed');
addButton('Тех. Специалисту', 'techspec');
addButton('Ответы', 'selectAnswer');




// Поиск информации о теме
const threadData = getThreadData();

$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
$('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
$('button#closed').click(() => editThreadData(CLOSE_PREFIX, false));
$('button#techspec').click(() =>
   editThreadData(TECHADM_PREFIX, true))

$(`button#selectAnswer`).click(() => {
  XF.alert(buttonsMarkup(buttons), null, 'Добавьте ответ:');
  buttons.forEach((btn, id) => {
	$(`button#answers-${id}`).click(() => pasteContent(id, threadData));
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

function pasteContent(id, data = {}) {
const template = Handlebars.compile(buttons[id].content);
if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

$('span.fr-placeholder').empty();
$('div.fr-element.fr-view p').append(template(data));
$('a.overlay-titleCloser').trigger('click');
}

// Приветствие и время суток
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
	  : 11 < hours && hours <= 17
	  ? 'Добрый день'
	  : 17 < hours && hours <= 23
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
            discussion_open: 1,
			sticky: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}
	if(prefix == UNACCEPT_PREFIX || prefix == ACCEPT_PREFIX || prefix == CLOSE_PREFIX || prefix == WATCHED_PREFIX) {
		moveThread(prefix, 230);

    }

}

function moveThread(prefix, type) {
// Перемещение темы в раздел окончательных ответов
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
