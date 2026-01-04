// ==UserScript==
// @name         Скрипт для КФ/ЗГСФ/ГСФ || Blue
// @namespace    http://tampermonkey.net/
// @version      2.22.1
// @description  Скрипт для КФ/ЗГСФ/ГСФ
// @author       Dmitry_Floyver
// @match https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://i.postimg.cc/13kkNtx3/12.jpg
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/516070/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%D0%97%D0%93%D0%A1%D0%A4%D0%93%D0%A1%D0%A4%20%7C%7C%20Blue.user.js
// @updateURL https://update.greasyfork.org/scripts/516070/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%D0%97%D0%93%D0%A1%D0%A4%D0%93%D0%A1%D0%A4%20%7C%7C%20Blue.meta.js
// ==/UserScript==
(function () {
  'use strict';
const UNACCСEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCСEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PINN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SPECY_PREFIX = 11;
const TEXY_PREFIX = 13;
const OJIDANIE_PREFIX = 14;
const OTKAZBIO_PREFIX = 4;
const ODOBRENOBIO_PREFIX = 8;
const NARASSMOTRENIIBIO_PREFIX = 2;
const REALIZOVANO_PREFIX = 5;
const VAJNO_PREFIX = 1;
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
title: ' >╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Для ЗГСФ и ГСФ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴<-)-)-)-|'
},
{    
 
title: '| Одобрено |',
	  content:
                    "[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
                    "[HEADING=3][CENTER][COLOR=rgb(255, 255, 255)][SIZE=4]Ваша жалоба [/SIZE][/COLOR][COLOR=#1E90FF][SIZE=4]одобрена,[/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4] игрок будет наказан. [/SIZE][/COLOR][/CENTER][/HEADING]",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{   
title: '| Обмен bc на ив и наоборот|',
	  content:
                    "[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
                    "[HEADING=3][CENTER][COLOR=rgb(255, 255, 255)][SIZE=4]Ваша жалоба [/SIZE][/COLOR][COLOR=rgb(30, 144, 255)][SIZE=4]одобрена. [/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4]Вы и игрок будете наказаны за [/SIZE][/COLOR][COLOR=rgb(30, 144, 255)][SIZE=4]Обмен ИВ на BC[/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4] и [/SIZE][/COLOR][COLOR=rgb(30, 144, 255)][SIZE=4]Обмен BC на ИВ.[/SIZE][/COLOR][/CENTER][/HEADING]",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{   
title: '| Не можем выдать наказание |',
	  content:
                "[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
                "[HEADING=3][CENTER][COLOR=rgb(255, 255, 255)][SIZE=4]На данный момент, мы не можем выдать наказание по данному пункту правил по жалобе, составленной на форуме. [/SIZE][/COLOR][/CENTER][/HEADING]"+
                "[HEADING=3][CENTER][COLOR=rgb(30, 144, 255)][SIZE=5]Закрыто.[/SIZE][/COLOR][/CENTER][/HEADING]",
     prefix: CLOSE_PREFIX,
	  status: false,
},
{
                 	  title: ' >╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Передача на рассмотрение╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴<-)-)-)-|'
},
{
	  title: '| На рассмотрение |',
	  content:
                "[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
                "[HEADING=3][CENTER]Ваша жалоба – [COLOR=rgb(30, 144, 255)]на рассмотрении. [/COLOR]Не дублируйте тему и ожидайте ответ.[/CENTER][/HEADING]",
        prefix: PINN_PREFIX,
	  status: true,
},
{
	  title: '| Тех. спецу |',
	  content:
                "[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
                "[HEADING=3][CENTER]Ваша жалоба [COLOR=rgb(30, 144, 255)]техническому специалисту. [/COLOR]Не дублируйте тему и ожидайте ответ.[/CENTER][/HEADING]",
        prefix: TEXY_PREFIX,
	  status: true,
},
{
	  title: '|(-(-(--(->╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отказ жалобы╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴<-)--)-)-)-|'
},
{
 
title: '| Нарушений не найдено |',
	  content:
                "[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
                "[HEADING=3][CENTER]Ваша жалоба – [COLOR=rgb(30, 144, 255)]отказана. [/COLOR][COLOR=rgb(255, 255, 255)]Нарушений со стороны игрока не выявлено.[/COLOR][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Возврат средств |',
	  content:
                "[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
                "[HEADING=2][CENTER][SIZE=4]Возврат средств возможен только при инициативе самого обманщика. Если у него будет желание получить разблокировку аккаунта, он свяжется с Вами и в конечном итоге вы должны будете сойтись в компенсации. После, составляется обжалование от лица обманщика, предварительно Вы пишите ему на Форумном Аккаунте условия компенсации.[/SIZE][/CENTER][/HEADING]"+
                "[HEADING=2][CENTER][COLOR=rgb(30, 144, 255)][SIZE=5]Закрыто.[/SIZE][/COLOR][/CENTER][/HEADING]"+
                "[HEADING=2][CENTER][/CENTER][/HEADING]",
                  prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: '| Недостаточно док-в |',
	  content:
                "[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
                "[HEADING=2][CENTER][SIZE=4]Ваша жалоба – [COLOR=rgb(30, 144, 255)]отказана.[/COLOR] Доказательств на нарушение со стороны игрока – недостаточно.[/SIZE][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Док-ва не работают |',
	  content:
                "[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
                "[HEADING=2][CENTER][SIZE=4]Ваша жалоба – [COLOR=rgb(30, 144, 255)]отказана.[/COLOR] Предоставленные доказательства не работают.[/SIZE][/CENTER][/HEADING]",
      prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: '| Отсутствуют док-ва |',
	  content:
                "[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
                "[HEADING=2][CENTER][SIZE=4]Ваша жалоба – [COLOR=rgb(30, 144, 255)]отказана.[/COLOR] Доказательства на нарушение отсутствуют.[/SIZE][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва отредактированы |',
	  content:
                "[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
                "[HEADING=2][CENTER][SIZE=4]Ваша жалоба – [COLOR=rgb(30, 144, 255)]отказана.[/COLOR] Было выявлено редактирование доказательств.[/SIZE][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Док-ва в вертикальном формате |',
	  content:
                "[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
                "[HEADING=2][CENTER][SIZE=4]Ваша жалоба – [COLOR=rgb(30, 144, 255)]отказана.[/COLOR] Доказательства в вертикальном формате не подлежат рассмотрению.[/SIZE][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Док-ва плохого качества |',
	  content:
                "[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
                "[HEADING=2][CENTER][SIZE=4]Ваша жалоба – [COLOR=rgb(30, 144, 255)]отказана.[/COLOR] Ваши доказательства предоставлены в плохом качестве.[/SIZE][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Доступ к док-вам ограничен(закрыт) |',
	  content:
                "[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
                "[HEADING=2][CENTER][SIZE=4]Ваша жалоба – [COLOR=rgb(30, 144, 255)]отказана.[/COLOR] Доступ к предоставленным доказательствам ограничен. Необходимо настроить их для общего доступа.[/SIZE][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва соц. сеть |',
	  content:
                "[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
                "[HEADING=2][CENTER][SIZE=4]Ваша жалоба – [COLOR=rgb(30, 144, 255)]отказана.[/COLOR] Доказательства загруженные в соц. сетях, не подлежат рассмотрению. Для загрузки фото можно воспользоваться: Imgur, Япикс, Postimages. Для видео: YouTube, RuTube, ВК Видео.[/SIZE][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Ник нарушителя не совпадает с док-вами |',
	  content:
                "[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
                "[HEADING=2][CENTER][SIZE=4]Ваша жалоба – [COLOR=rgb(30, 144, 255)]отказана.[/COLOR] Никнейм нарушителя не совпадает с доказательствами.[/SIZE][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Жалоба от 3-го лица (Никнейм подавшего не совпадает)|',
	  content:
                "[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
                "[HEADING=2][CENTER][SIZE=4]Ваша жалоба – [COLOR=rgb(30, 144, 255)]отказана.[/COLOR] Ваш никнейм не совпадает с доказательствами.[/SIZE][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Не относится к Жалобам на игроков (Добавить в какой раздел игроку обратиться) |',
	  content:
                "[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
                "[HEADING=2][CENTER][SIZE=4]Ваша жалоба – [COLOR=rgb(30, 144, 255)]отказана.[/COLOR] Ваша жалоба не относится к этому разделу.[/SIZE][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Ошиблись сервером|',
	  content:
                "[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
                "[HEADING=2][CENTER][SIZE=4]Ваша жалоба – [COLOR=rgb(30, 144, 255)]отказана.[/COLOR] Вы ошиблись сервером.[/SIZE][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Дублирование темы |',
	  content:
                "[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
                "[HEADING=2][CENTER][SIZE=4]Ваша жалоба – [COLOR=rgb(30, 144, 255)]отказана.[/COLOR] Ранее вы уже получили корректный ответ, просьба не дублировать темы, иначе Вам может быть выдана блокировка ФА.[/SIZE][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
 
title: '| Данный вид сделки, не является нонрп обманом |',
	  content:
                "[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
                "[HEADING=2][CENTER][SIZE=4]Ваша жалоба – [COLOR=rgb(30, 144, 255)]отказана.[/COLOR] Данный вид сделки не является NRP обманом.[/SIZE][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Условия сделки отсутствуют |',
	  content:
                "[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
                "[HEADING=3][CENTER][COLOR=rgb(255, 255, 255)][SIZE=4]Ваша жалоба – [/SIZE][/COLOR][COLOR=rgb(30, 144, 255)][SIZE=4]отказана. [/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4]При совершении обмена не были оговорены условия сделки.[/SIZE][/COLOR][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Условия сделки некорректны |',
	  content:
                  "[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
                  "[HEADING=3][CENTER][COLOR=rgb(255, 255, 255)][SIZE=4]Ваша жалоба – [/SIZE][/COLOR][COLOR=rgb(30, 144, 255)][SIZE=4]отказана. [/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4]Ваши условия сделки некорректны. Ознакомиться с тем, как правильно оформить условия сделки, можно здесь – [/SIZE][/COLOR][URL='https://vk.com/wall-195144430_26829']Кликабельно.[/URL][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Долг (нет срока займа) |',
	  content:
                "[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
                "[HEADING=3][CENTER][COLOR=rgb(255, 255, 255)][SIZE=4]Ваша жалоба – [/SIZE][/COLOR][COLOR=rgb(30, 144, 255)][SIZE=4]отказана. [/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4]В условиях долга не был оговорен срок займа.[/SIZE][/COLOR][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| 10 дней после срока долга|',
	  content:
                "[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
                "[HEADING=3][CENTER][COLOR=rgb(255, 255, 255)][SIZE=4]Ваша жалоба – [/SIZE][/COLOR][COLOR=rgb(30, 144, 255)][SIZE=4]отказана. [/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4]Прошло более 10-ти дней с истечения срока возврата долга.[/SIZE][/COLOR][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Слив склада семьи (Что требуется показать игроку) |',
	  content:
"[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
"[HEADING=3][CENTER][COLOR=rgb(255, 255, 255)][SIZE=4]Ваша жалоба – [/SIZE][/COLOR][COLOR=rgb(30, 144, 255)][SIZE=4]отказана. [/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4]Создайте новое обращение, учтя следующие моменты:[/SIZE][/COLOR][/CENTER][/HEADING]"+
"[QUOTE]"+

"[LIST]"+
"[*][SIZE=4][B][CENTER][B]Уточните, являетесь ли Вы [COLOR=rgb(30, 144, 255)]лидером семьи[/COLOR][/B][/CENTER][/B][/SIZE]"+
"[*][SIZE=4][B][CENTER][B]Уточните, являлся ли игроком [COLOR=rgb(30, 144, 255)]заместителем[/COLOR] до слива[/B][/CENTER][/B][/SIZE]"+
"[*][SIZE=4][B][CENTER][B]Покажите логи семьи с [COLOR=rgb(30, 144, 255)]нарушением игрока[/COLOR][/B][/CENTER][/B][/SIZE]"+
"[/LIST]"+
"[/QUOTE]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Слив семьи (Заместителем) |',
	  content:
                "[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
                "[HEADING=3][CENTER][COLOR=rgb(255, 255, 255)][SIZE=4]Ваша жалоба – [/SIZE][/COLOR][COLOR=rgb(30, 144, 255)][SIZE=4]отказана. [/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4]Администрация не несет ответственности при сливе семьи игроком.[/SIZE][/COLOR][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Заголовок не по форме |',
	  content:
                "[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
                "[HEADING=3][CENTER][COLOR=rgb(255, 255, 255)][SIZE=4]Ваша жалоба – [/SIZE][/COLOR][COLOR=rgb(30, 144, 255)][SIZE=4]отказана. [/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4]Заголовок Вашей жалобы составлен не по форме.[/SIZE][/COLOR][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Жалоба не по форме |',
	  content:
                "[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
                "[HEADING=3][CENTER][COLOR=rgb(255, 255, 255)][SIZE=4]Ваша жалоба – [/SIZE][/COLOR][COLOR=rgb(30, 144, 255)][SIZE=4]отказана. [/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4]Ваша жалоба составлена не по форме.[/SIZE][/COLOR][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нет /time |',
	  content:
                "[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
                "[HEADING=3][CENTER][COLOR=rgb(255, 255, 255)][SIZE=4]Ваша жалоба – [/SIZE][/COLOR][COLOR=rgb(30, 144, 255)][SIZE=4]отказана. [/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4]На доказательствах отсутствует /time.[/SIZE][/COLOR][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нет Time-кодов|',
	  content:
"[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
"[HEADING=3][CENTER][COLOR=rgb(255, 255, 255)][SIZE=4]Ваша жалоба [/SIZE][/COLOR][COLOR=rgb(30, 144, 255)][SIZE=4]отказана. [/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4]Для видеодоказательств длительностью более 3-ёх минут, необходимы тайм-коды.[/SIZE][/COLOR][/CENTER][/HEADING]"+
"[CENTER][COLOR=rgb(255, 255, 255)][SIZE=4]Пример тайм-кодов:[/SIZE][/COLOR]"+
"[url=https://postimg.cc/CBr3S6fq][img]https://i.postimg.cc/PJdTbgX2/2025-08-31-114810.png[/img][/url][/CENTER]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '|Time коды не по форме|',
	  content:
"[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
"[HEADING=3][CENTER][COLOR=rgb(255, 255, 255)][SIZE=4]Ваша жалоба [/SIZE][/COLOR][COLOR=rgb(30, 144, 255)][SIZE=4]отказана. [/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4]Тайм-коды составлены не по форме.[/SIZE][/COLOR][/CENTER][/HEADING]"+
"[CENTER][COLOR=rgb(255, 255, 255)][SIZE=4]Пример тайм-кодов:[/SIZE][/COLOR]"+
"[url=https://postimg.cc/CBr3S6fq][img]https://i.postimg.cc/PJdTbgX2/2025-08-31-114810.png[/img][/url][/CENTER]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Более 72-х часов |',
	  content:
                "[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
                "[HEADING=3][CENTER][COLOR=rgb(255, 255, 255)][SIZE=4]Ваша жалоба – [/SIZE][/COLOR][COLOR=rgb(30, 144, 255)][SIZE=4]отказана. [/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4]Прошло более 72-ух часов с момента нарушения игрока.[/SIZE][/COLOR][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нужен фрапс |',
	  content:
                "[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
                "[HEADING=3][CENTER][COLOR=rgb(255, 255, 255)][SIZE=4]Ваша жалоба – [/SIZE][/COLOR][COLOR=rgb(30, 144, 255)][SIZE=4]отказана. [/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4]Для фиксирования данного нарушения необходимо видео.[/SIZE][/COLOR][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Фрапс обрывается |',
	  content:
                "[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
                "[HEADING=3][CENTER][COLOR=rgb(255, 255, 255)][SIZE=4]Ваша жалоба – [/SIZE][/COLOR][COLOR=rgb(30, 144, 255)][SIZE=4]отказана. [/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4]Ваши доказательства обрываются.[/SIZE][/COLOR][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Оскорбление в IC |',
	  content:
                "[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
                "[HEADING=3][CENTER][COLOR=rgb(255, 255, 255)][SIZE=4]Ваша жалоба – [/SIZE][/COLOR][COLOR=rgb(30, 144, 255)][SIZE=4]отказана. [/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4]Оскорбления в IC(РП) чате – ненаказуемы.[/SIZE][/COLOR][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Неадекватное поведение в жалобе |',
	  content:
                "[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
                "[HEADING=3][CENTER][COLOR=rgb(255, 255, 255)][SIZE=4]Ваша жалоба – [/SIZE][/COLOR][COLOR=rgb(30, 144, 255)][SIZE=4]отказана. [/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4]В жалобе присутствует неадекватное поведение, такие жалобы не подлежат рассмотрению.[/SIZE][/COLOR][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
title: '| Оск в названии док-в |',
	  content:
                "[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
                "[HEADING=3][CENTER][COLOR=rgb(255, 255, 255)][SIZE=4]Ваша жалоба – [/SIZE][/COLOR][COLOR=rgb(30, 144, 255)][SIZE=4]отказана. [/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4]В названии доказательств присутствуют оскорбления.[/SIZE][/COLOR][/CENTER][/HEADING]",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '|(-(-(-(-(->╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴RolePlay Биографии╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴<-)-)-)-)-)-|'
},
{
        	  title: '| Биография одобрена |',
	  content:
"[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
"[HEADING=3][CENTER][COLOR=rgb(255, 255, 255)][SIZE=4]Ваша РП биография – [/SIZE][/COLOR][SIZE=4][COLOR=rgb(30, 144, 255)]одобрена.[/COLOR][/SIZE][/CENTER][/HEADING]",
    prefix: ACCСEPT_PREFIX,
	  status: false,
},
  {
    	  title: '| Биография не по форме |',
	  content:
                "[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
                "[HEADING=3][CENTER][COLOR=rgb(255, 255, 255)][SIZE=4]Ваша РП Биография – [/SIZE][/COLOR][COLOR=rgb(30, 144, 255)][SIZE=4]отказана. [/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4]Она составлена не по форме.[/SIZE][/COLOR][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
          	  title: '| Отсутствует фото персонажа |',
	  content:
                "[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
                "[HEADING=3][CENTER][COLOR=rgb(255, 255, 255)][SIZE=4]Ваша РП Биография – [/SIZE][/COLOR][COLOR=rgb(30, 144, 255)][SIZE=4]отказана. [/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4]В биографии отсутствует фото персонажа.[/SIZE][/COLOR][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
          	  title: '| Недостаточно RP информации |',
	  content:
                "[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
                "[HEADING=3][CENTER][COLOR=rgb(255, 255, 255)][SIZE=4]Ваша РП Биография – [/SIZE][/COLOR][COLOR=rgb(30, 144, 255)][SIZE=4]отказана. [/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4]Распишите больше жизненных этапов в соответствии с возрастом персонажа.[/SIZE][/COLOR][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Биография скопирована |',
	  content:
                "[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
                "[HEADING=3][CENTER][COLOR=rgb(255, 255, 255)][SIZE=4]Ваша РП Биография – [/SIZE][/COLOR][COLOR=rgb(30, 144, 255)][SIZE=4]отказана. [/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4]Она была скопирована.[/SIZE][/COLOR][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Заголовок биографии не по форме |',
	  content:
                "[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
                "[HEADING=3][CENTER][COLOR=rgb(255, 255, 255)][SIZE=4]Ваша РП Биография – [/SIZE][/COLOR][COLOR=rgb(30, 144, 255)][SIZE=4]отказана. [/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4]Заголовок составлен не по форме.[/SIZE][/COLOR][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Повествование в биографии от 3-го лица |',
	  content:
                "[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
                "[HEADING=3][CENTER][COLOR=rgb(255, 255, 255)][SIZE=4]Ваша РП Биография – [/SIZE][/COLOR][COLOR=rgb(30, 144, 255)][SIZE=4]отказана. [/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4]Повествование должно вестись исключительно от 1-го лица.[/SIZE][/COLOR][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
title: '| Большое количество грамматических ошибок |',
	  content:
                "[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
                "[HEADING=3][CENTER][COLOR=rgb(255, 255, 255)][SIZE=4]Ваша РП Биография – [/SIZE][/COLOR][COLOR=rgb(30, 144, 255)][SIZE=4]отказана. [/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4]Было обнаружено большое количество грамматических ошибок.[/SIZE][/COLOR][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
title: '| NRP Никнейм |',
	  content:
                "[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
                "[HEADING=3][CENTER][COLOR=rgb(255, 255, 255)][SIZE=4]Ваша РП Биография – [/SIZE][/COLOR][COLOR=rgb(30, 144, 255)][SIZE=4]отказана. [/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4]Ваше игровое имя не соответствует критериям RP никнейма. Имя и Фамилия должны быть указаны с заглавных букв в формате Имя Фамилия.[/SIZE][/COLOR][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
title: '| Биография на дополнении |',
	  content:
                "[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
                "[HEADING=3][CENTER][COLOR=rgb(255, 255, 255)][SIZE=4]Ваша РП Биография – [/SIZE][/COLOR][COLOR=rgb(30, 144, 255)][SIZE=4]на дополнении. [/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4]Вам дается 24 часа для ее дополнения.[/SIZE][/COLOR][/CENTER][/HEADING]",
        prefix: PINN_PREFIX,
	  status: true,
},
  {
title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴РП ситуации╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
title: '| РП ситуация одобрено |',
	  content:
"[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
"[HEADING=3][CENTER][COLOR=rgb(255, 255, 255)][SIZE=4]Ваша РП ситуация – [/SIZE][/COLOR][SIZE=4][COLOR=rgb(30, 144, 255)]одобрена.[/COLOR][/SIZE][/CENTER][/HEADING]",
    prefix: ACCСEPT_PREFIX,
	  status: false,
},
  {
 
 title: '| РП ситуация отказ. |',
	  content:
"[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
"[HEADING=3][CENTER][COLOR=rgb(255, 255, 255)][SIZE=4]Ваша РП ситуация – [/SIZE][/COLOR][SIZE=4][COLOR=rgb(30, 144, 255)]отказана.[/COLOR][/SIZE][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
 
title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Неофициал. орг.╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
title: '| Неофициальная Орг. Одобрено|',
	  content:
                "[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
                "[HEADING=3][CENTER][COLOR=rgb(255, 255, 255)][SIZE=4]Ваша Неофициальная организация – [/SIZE][/COLOR][COLOR=rgb(30, 144, 255)][SIZE=4]одобрена. [/SIZE][/COLOR][COLOR=rgb(255, 255, 255)][SIZE=4]Не забывайте, еженедельно Вы должны описывать деятельность организации, иначе тема будет закрыта.[/SIZE][/COLOR][/CENTER][/HEADING]",
    prefix: ACCСEPT_PREFIX,
	  status: false,
},
  {
 
title: '| Неофициальная Орг. Отказ |',
	  content:
"[HEADING=2][CENTER][SIZE=5][COLOR=rgb(255, 255, 255)]Здравствуйте, [/COLOR]{{ user.name }}[/SIZE][/CENTER][/HEADING]"+
"[HEADING=3][CENTER][COLOR=rgb(255, 255, 255)][SIZE=4]Ваша Неофициальная организация – [/SIZE][/COLOR][SIZE=4][COLOR=rgb(30, 144, 255)]отказана.[/COLOR][/SIZE][/CENTER][/HEADING]",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
},
 
];
 
$(document).ready(() => { 
 // Загрузка скрипта для обработки шаблонов 
 $(`body`).append(`<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`); 
 
 // Добавление кнопок при загрузке страницы 
 addButton(`Выбор автоматических ответов`, `selectAnswer`); 
 // Поиск информации о теме 
 const threadData = getThreadData(); 
 
 $(`button#pin`).click(() => editThreadData(PIN_PREFIX, true)); 
 $(`button#accepted`).click(() => editThreadData(ACCEPT_PREFIX, false)); 
 $(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true)); 
 $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false)); 
 $(`button#watched`).click(() => editThreadData(WATCHED_PREFIX, false)); 
$(`button#closed`).click(() => editThreadData(CLOSE_PREFIX, false)); 
 $(`button#specialAdmin`).click(() => editThreadData(SPECIAL_PREFIX, true)); 
$(`button#mainAdmin`).click(() => editThreadData(GA_PREFIX, true)); 
$(`button#techspec`).click(() => editThreadData( TECH_PREFIX , true)); 
 
 
 $(`button#selectAnswer`).click(() => { 
 XF.alert(buttonsMarkup(buttons), null, `Выберите ответ:`); 
 buttons.forEach((btn, id) => { 
 if (id > 0) { 
 $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true)); 
 } else { 
 $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false)); 
 } 
 }); 
 }); 
 }); 
 
 function addButton(name, id) { 
 $(`.button--icon--reply`).before( 
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
 .join(``)}</div>`; 
 } 
 
 function pasteContent(id, data = {}, send = false) { 
 const template = Handlebars.compile(buttons[id].content); 
 if ($(`.fr-element.fr-view p`).text() === ``) $(`.fr-element.fr-view p`).empty(); 
 
 $(`span.fr-placeholder`).empty(); 
 $(`div.fr-element.fr-view p`).append(template(data)); 
 $(`a.overlay-titleCloser`).trigger(`click`); 
 
 if (send == true) { 
 editThreadData(buttons[id].prefix, buttons[id].status); 
 $(`.button--icon.button--icon--reply.rippleButton`).trigger(`click`); 
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
 const threadTitle = $(`.p-title-value`)[0].lastChild.textContent; 
 
 if (pin == false) { 
 fetch(`${document.URL}edit`, { 
 method: `POST`, 
 body: getFormData({ 
 prefix_id: prefix, 
 title: threadTitle, 
 _xfToken: XF.config.csrf, 
 _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1], 
 _xfWithData: 1, 
 _xfResponseType: `json`, 
 }), 
 }).then(() => location.reload()); 
 } 
 if (pin == true) { 
 fetch(`${document.URL}edit`, { 
 method: `POST`, 
 body: getFormData({ 
 prefix_id: prefix, 
 title: threadTitle, 
 sticky: 1, 
 _xfToken: XF.config.csrf, 
 _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1], 
 _xfWithData: 1, 
 _xfResponseType: `json`, 
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