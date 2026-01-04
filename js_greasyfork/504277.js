// ==UserScript==
// @name         Скрипт для техов
// @namespace    https://forum.blackrussia.online/
// @version      1.6
// @description  Скрипт для технических специалистов
// @author       William_Darkness
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon         https://ibb.co/wK7G14s
// @downloadURL
// @downloadURL https://update.greasyfork.org/scripts/504277/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%82%D0%B5%D1%85%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/504277/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%82%D0%B5%D1%85%D0%BE%D0%B2.meta.js
// ==/UserScript==

(function () {
	'use strict';
	const UNACCEPT_PREFIX = 4; // префикс отказано
	const PIN_PREFIX = 2; //  префикс закрепить
	const COMMAND_PREFIX = 10; // команде проекта
	const CLOSE_PREFIX = 7; // префикс закрыто
	const DECIDED_PREFIX = 6; // префикс решено
	const TECHADM_PREFIX = 13 // теху администратору
	const WATCHED_PREFIX = 9; // рассмотрено
	const WAIT_PREFIX = 14; // ожидание (для переноса в баг-трекер)
	const NO_PREFIX = 0;
	const buttons = [
{
  "title": "ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ⠀ᅠ ᅠ ᅠᅠДля специалистов в области логирования  ᅠᅠ ⠀ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ",
  "dpstyle": "oswald: 3px; color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317",
},
{
title: 'Приветствие',
		content:
	 '[COLOR=rgb(0, 255, 127)][FONT=Arial][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
	 '[CENTER]текст[/CENTER]',
	},
{
  "title": "На рассмотрении",
  "content":
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
    "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
    '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px] Ваша тема в настоящее время находится на рассмотрении. Мы ценим ваше терпение и приложим все усилия, чтобы предоставить вам ответ в ближайшее время. Пожалуйста, ожидайте.[/size][/FONT][/COLOR][/CENTER]<br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
    '[CENTER][size=15px][COLOR=rgb(255, 152, 0)][ICODE]В процессе рассмотрения...[/ICODE][/COLOR][/size][/CENTER]',
	prefix: TECHADM_PREFIX,
	status: true,
},
{
  "title": "Ошиблись в разделе",
  "content":
    '[SIZE=4][FONT=Verdana][CENTER]Добрый день, уважаемый(ая) [B]{{ user.mention }}[/B]![/CENTER]<br><br>' +
    '[CENTER] Мы заметили, что ваше обращение было размещено в разделе, не соответствующем его содержанию. Для более эффективного рассмотрения вашего запроса, мы перенесем вашу тему в правильный раздел. Благодарим вас за понимание и терпение.[/CENTER][/FONT][/SIZE]',
},
{
  "title": "Взлом/Махинации",
  "content":
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
    '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]Уважаемый(ая) [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px],[/SIZE][/FONT][/COLOR][/CENTER]<br><br>' +
    '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]В результате проверки системы безопасности было обнаружено, что ваш аккаунт мог быть подвергнут несанкционированному доступу. В связи с этим, для вашей безопасности, я временно заблокировал ваш игровой аккаунт.[/SIZE][/FONT][/COLOR][/CENTER]<br>' +
    '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Также сообщаем, что игрок, который получил несанкционированный доступ к вашему аккаунту, будет заблокирован за нарушение правил.[/SIZE][/FONT][/COLOR][/CENTER]<br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
    '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/COLOR][/SIZE][/CENTER]',
	prefix: PIN_PREFIX,
	status: true,
},
{
  "title": "Ожидание решения от руководства",
  "content":
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
    '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]Уважаемый(ая) [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px],[/SIZE][/FONT][/COLOR][/CENTER]<br><br>' +
    '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px] Ваша заявка в данный момент находится на рассмотрении у руководства технических специалистов. Мы понимаем важность вашей темы и приложим все усилия для скорейшего принятия решения. Пожалуйста, немного подождите, пока мы работаем над вашим запросом.[/SIZE][/FONT][/COLOR][/CENTER]<br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
    '[CENTER][SIZE=15px][COLOR=rgb(255, 152, 0)][ICODE]Ваш запрос в процессе рассмотрения...[/ICODE][/COLOR][/SIZE][/CENTER]',
	prefix: PIN_PREFIX,
	status: true,
},
           {
  "title": "Форма подачи жб на тех",
  "content":
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
    '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]Уважаемый(ая) [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px],[/SIZE][/FONT][/COLOR][/CENTER]<br><br>' +
    '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px] Мы заметили, что ваше обращение не совсем соответствует установленным правилам подачи жалоб на технических специалистов. Для того чтобы ваше обращение было рассмотрено должным образом, пожалуйста, создайте новую тему, следуя приведенной ниже форме. Заголовок вашей темы должен содержать никнейм технического специалиста и кратко отражать суть вашего обращения.<br><br>' +
    'Пример заголовка:<br> Lev_Kalashnikov | Махинации<br><br>' +
    'Форма для заполнения темы:<code><br>' +
    '01. Ваш игровой никнейм:<br>' +
    '02. Игровой никнейм технического специалиста:<br>' +
    '03. Сервер, на котором вы играете:<br>' +
    '04. Подробное описание ситуации:<br>' +
    '05. Скриншоты, если они имеются:<br>' +
    '06. Дата и время произошедшей проблемы:</code>[/SIZE][/FONT][/COLOR][/CENTER]<br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
    '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Отказано[/ICODE][/COLOR][/SIZE][/CENTER]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
          {
    "title": "Правила раздела жалоб на технических специалистов",
    "content": "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>" +
    "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый(ая) [COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]</COLOR></FONT></CENTER]<br><br>" +
    "[COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Просим Вас внимательно ознакомиться с назначением данного раздела, так как Ваш запрос не относится к жалобам на технических специалистов.<br>" +
    "В данном разделе рассматриваются только жалобы на технических специалистов, которые оформлены по установленной форме и соответствуют правилам подачи.<br><br>" +
    "[FONT=verdana][SIZE=15px][COLOR=rgb(226, 80, 65)][U]Правила подачи жалобы на технических специалистов[/U][/COLOR][/SIZE][/FONT][/COLOR]</SIZE></FONT></CENTER]<br>" +
    "[QUOTE][FONT=verdana][SIZE=15px][COLOR=rgb(226, 80, 65)]01.[/COLOR] Ваш игровой никнейм:<br>" +
    "[COLOR=rgb(226, 80, 65)]02.[/COLOR] Игровой никнейм технического специалиста:<br>" +
    "[COLOR=rgb(226, 80, 65)]03.[/COLOR] Сервер, на котором Вы играете:<br>" +
    "[COLOR=rgb(226, 80, 65)]04.[/COLOR] Описание ситуации (пожалуйста, опишите максимально подробно):<br>" +
    "[COLOR=rgb(226, 80, 65)]05.[/COLOR] Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>" +
    "[COLOR=rgb(226, 80, 65)]06.[/COLOR] Дата и время произошедшей технической проблемы (укажите максимально точно):[/SIZE][/FONT][/QUOTE]<br><br>" +
    "[FONT=verdana][SIZE=15px][COLOR=rgb(226, 80, 65)]Примечание:[/COLOR] Все обращения в данный раздел должны быть составлены по приведенному выше шаблону. В противном случае, заявки будут отклонены. Что касается заголовка темы, строгих требований нет, но желательно, чтобы он содержал никнейм и сервер технического специалиста. Мы настоятельно рекомендуем ознакомиться с [U][B][URL='https://forum.blackrussia.online/index.php?forums/faq.231/']данным разделом[/URL][/B][/U] заранее.[/SIZE][/FONT]<br><br>" +
    "[CENTER][FONT=verdana][SIZE=15px][COLOR=rgb(226, 80, 65)][U]Какие жалобы не проверяются?[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>" +
    "[FONT=verdana][SIZE=15px][COLOR=rgb(226, 80, 65)]— Если в содержании темы присутствует оффтоп или оскорбления.<br>" +
    "— Если в заголовке темы отсутствует никнейм технического специалиста.<br>" +
    "— Если с момента выдачи наказания прошло более 14 дней.[/SIZE][/FONT]</COLOR><br>" +
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>" +
    "[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Отказано[/ICODE][/COLOR][/SIZE][/CENTER]",
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
    "title": "Срок подачи жалоб",
    "content": "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>" +
    "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]Уважаемый(ая) [COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR], добрый день![/CENTER][/SIZE][/COLOR][/FONT][/CENTER]<br><br>" +
    "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]К сожалению, с момента вынесения наказания техническим специалистом прошло более 14 дней. В связи с этим, в текущий момент изменить меру наказания не представляется возможным. Тем не менее, Вы можете подать заявление на обжалование через определенный период времени.<br><br>" +
    "Обращаем Ваше внимание, что некоторые наказания не подлежат обжалованию или амнистии. Для получения более детальной информации о критериях обжалования, пожалуйста, ознакомиться вы можете здесь [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F-%D0%BD%D0%B0%D1%80%D1%83%D1%88%D0%B5%D0%BD%D0%B8%D1%8F-%D0%BF%D1%80%D0%B8-%D0%B2%D1%8B%D0%B4%D0%B0%D1%87%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F-%D0%BE%D1%82-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%BE%D0%B3%D0%BE-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%B0.7552345/']этой ссылке[/URL].[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>" +
    "[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/COLOR][/SIZE][/CENTER]",
    prefix: CLOSE_PREFIX,
    status: false,
},
         {
    "title": "Жб в тех раздел",
    "content": "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>" +
    "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]Добрый день, уважаемый(ая) [COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE][/COLOR][/FONT][/CENTER]<br><br>" +
    "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Ваш запрос не относится к разделу жалоб на технических специалистов. Пожалуйста, обратитесь в соответствующий технический раздел на вашем сервере. Мы уверены, что там вам смогут предоставить необходимую помощь и поддержку.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>" +
    "[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Отказано[/ICODE][/COLOR][/SIZE][/CENTER]",
	prefix: UNACCEPT_PREFIX,
	status: false,
},

          {
    "title": "Обжалованию не подлежит",
    "content": "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>" +
    "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]Здравствуйте, уважаемый(ая) [COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE][/COLOR][/FONT][/CENTER]<br><br>" +
    "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Мы понимаем, что блокировка вашего аккаунта может вызвать разочарование. Однако, в данном случае, блокировка была вынесена за серьезное нарушение правил нашего сервера. Мы, к сожалению, не имеем возможности изменить срок блокировки, аннулировать её или применить амнистию.<br><br>Благодарим вас за понимание и надеемся на ваше уважение к установленным правилам.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>" +
    "[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Отказано[/ICODE][/COLOR][/SIZE][/CENTER]",
	prefix: UNACCEPT_PREFIX,
	status: false,
},
          {
    title: 'Срок блокировки будет снижен',
    content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
    '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый(ая) [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>' +
    '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]После проверки вашей истории нарушений мы решили сократить срок блокировки вашего аккаунта. Пожалуйста, в следующий раз соблюдайте правила нашего проекта, чтобы избежать подобных ситуаций. Мы надеемся, что вы получите удовольствие от игры и будете внимательно относиться к политике проекта.[/SIZE][/FONT][/COLOR][/CENTER]<br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
    '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
          {
    title: 'Аккаунт будет разблокирован',
    content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
    '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый(ая) [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>' +
    '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Ваша жалоба была передана на рассмотрение руководству технических специалистов. В результате их анализа ваш аккаунт может быть разблокирован. Пожалуйста, ожидайте дальнейших указаний в этой теме. Создавать дополнительные темы по этому вопросу не требуется.[/SIZE][/FONT][/COLOR][/CENTER]<br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
    '[CENTER][SIZE=15px][COLOR=rgb(255, 152, 0)][ICODE]На рассмотрении...[/ICODE][/SIZE][/CENTER][/COLOR]',
    prefix: PIN_PREFIX,
    status: true,
},
          {
    title: 'Необходим скриншот окна блокировки',
    content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
    '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый(ая) [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>' +
    '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Для дальнейшего рассмотрения вашего запроса нам потребуется скриншот окна блокировки. Пожалуйста, создайте новую тему и прикрепите снимок экрана, используя один из следующих фото-хостингов: [URL=\'https://yapx.ru/\']yapx.ru[/URL], [URL=\'https://imgur.com/\']imgur.com[/URL], [URL=\'https://www.youtube.com/\']youtube.com[/URL] или [URL=\'https://imgbb.com\']ImgBB.com[/URL]. Все ссылки кликабельны.[/SIZE][/FONT][/COLOR][/CENTER]<br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
    '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
    prefix: CLOSE_PREFIX,
    status: false,
},
       {
    title: 'Имущество не может быть восстановлено',
    content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]{{ greeting }}, уважаемый(ая) [COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/SIZE][/FONT][/COLOR][/CENTER]<br><br>' +
        '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Благодарим вас за обращение. К сожалению, ваш запрос на восстановление имущества не может быть удовлетворен. Пожалуйста, ознакомьтесь с правилами восстановлений - [URL=\'https://forum.blackrussia.online/index.php?threads/в-каких-случаях-мы-не-восстанавливаем-игровое-имущество.25277/\']"Нажмите"[/URL], чтобы понять, в каких случаях восстановление невозможно. Мы обращаем ваше внимание, что ваша заявка не относится к техническим проблемам, а потому не может быть рассмотрена в текущем контексте.[/SIZE][/FONT][/COLOR][/CENTER]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
        '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/SIZE][/CENTER][/COLOR]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
    {
     title: 'По проблемам с донатом',
     content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
     "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
     "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Если не были зачислены BLACK COINS — вероятнее всего, была допущена ошибка при вводе реквизитов. К нашему сожалению, из-за большого количества попыток обмана, мы перестали рассматривать подобные обращения. Для проверки зачисления BLACK COINS необходимо ввести в игре команду:[COLOR=rgb(255, 255, 255)] /donat.[/COLOR][/SIZE][/FONT][/COLOR][/CENTER]<br>" +
     "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Вам необходимо быть внимательными при осуществлении покупок.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
     "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Если Вы считаете, что ошибки быть не может и с момента оплаты не прошло более 14 дней — в обязательном порядке обратитесь в службу поддержки для дальнейшего решения: На сайте через виджет обратной связи или посредством месенджеров: ВКонтакте: [URL=\'vk.com/br_tech\']нажмите здесь[/URL], Telegram: [URL=\'t.me/br_techBot\']нажмите здесь[/URL][/SIZE][/FONT][/COLOR][/CENTER]<br>" +
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
     '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
    prefix: CLOSE_PREFIX,
    status: false,
          },

{
    title: 'Имущество будет восстановлено',
    content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
    '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]{{ greeting }}, уважаемый(ая) [COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/SIZE][/FONT][/COLOR][/CENTER]<br><br>' +
    '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Мы рады сообщить вам, что ваше игровое имущество и денежные средства будут восстановлены в течение двух недель. Пожалуйста, до завершения процесса восстановления старайтесь не менять свой никнейм, чтобы избежать возможных проблем.[/SIZE][/FONT][/COLOR][/CENTER]<br>' +
    '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Для активации восстановления используйте команды: [COLOR=rgb(255, 255, 255)]/roulette и /recovery.[/COLOR][/SIZE][/FONT][/COLOR][/CENTER]<br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
    '[CENTER][SIZE=15px][COLOR=rgb(127, 255, 0)][ICODE]Решено[/ICODE][/COLOR][/SIZE][/CENTER]',
      prefix: DECIDED_PREFIX,
      status: false,
},
        {
    title: 'Переустановите игру',
    content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
    '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]{{ greeting }}, уважаемый(ая) [COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/SIZE][/FONT][/COLOR][/CENTER]<br><br>' +
    '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Для устранения возникших проблем с игрой рекомендуется переустановить её. Это поможет вернуть игру в рабочее состояние и устранить возможные сбои.[/SIZE][/FONT][/COLOR][/CENTER]<br>' +
    '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Пожалуйста, выполните следующие действия: полностью удалите лаунчер и все связанные с ним файлы, затем скачайте и установите игру заново с официального сайта: [URL=\'https://blackrussia.online\']нажмите здесь[/URL].[/SIZE][/FONT][/COLOR][/CENTER]<br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
    '[CENTER][SIZE=15px][COLOR=rgb(127, 255, 0)][ICODE]Рассмотрено[/ICODE][/COLOR][/SIZE][/CENTER]',
      prefix: WATCHED_PREFIX,
      status: false,
},
{
    title: 'Не относится к жалобам на техподдержку',
    content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
    '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]{{ greeting }}, уважаемый(ая) [COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/SIZE][/FONT][/COLOR][/CENTER]<br><br>' +
    '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Благодарим вас за ваше обращение. К сожалению, ваша тема не относится к жалобам на технических специалистов. Чтобы правильно направить ваше обращение, пожалуйста, ознакомьтесь с правилами данного раздела: [URL=\'https://forum.blackrussia.online/forums/Информация-для-игроков.231/\']нажмите здесь[/URL].[/SIZE][/FONT][/COLOR][/CENTER]<br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
    '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Отказано[/ICODE][/COLOR][/SIZE][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
    title: 'Игрок будет заблокирован',
    content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
    '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый(ая) [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>' +
    '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Благодарим Вас за обратную связь.[/SIZE][/FONT][/COLOR][/CENTER]<br>' +
    '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]После тщательного рассмотрения вашей жалобы и проверки представленных доказательств, мы приняли решение о блокировке аккаунта игрока, на которого была подана жалоба. Это решение соответствует нашей политике и правилам игры.[/SIZE][/FONT][/COLOR][/CENTER]<br>' +
    '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Для создания положительной и уважительной игровой атмосферы призываем каждого из вас проявлять сознательность и уважение к правилам. Вместе мы строим прекрасное и дружелюбное сообщество, которое уважает всех и каждого.[/SIZE][/FONT][/COLOR][/CENTER]<br>' +
    '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]С учетом всего сказанного, давайте будем бдительны и помнить, что соблюдение правил - это залог успешной и приятной игры для всех.[/SIZE][/FONT][/COLOR][/CENTER]<br>' +
    '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Мы стараемся активно отслеживать те или иные нарушения общих правил или же лицензионного соглашения.[/SIZE][/FONT][/COLOR][/CENTER]<br>' +
    '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Помните, что ваше поведение в игре оказывает влияние на ее общую атмосферу и удовлетворение всех игроков.[/SIZE][/FONT][/COLOR][/CENTER]<br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
    '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
    prefix: CLOSE_PREFIX,
    status: false,
},
          {
    title: 'Игрок не будет заблокирован',
    content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
    "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый(ая) [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
    "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]По результатам тщательной проверки предоставленных доказательств и системы логирования, пришёл к выводу, что в данном случае недостаточно оснований для блокировки игрока.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
    '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
    prefix: CLOSE_PREFIX,
    status: false,
},

          {
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ         ᅠ⠀⠀ ⠀⠀ᅠ ᅠᅠДля специалистов в направлении Форум  ᅠᅠ ᅠᅠ⠀⠀⠀ ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
    	  },
           {
    title: 'Форма подачи',
    content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
    "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый(ая) [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
    "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Для более оперативного рассмотрения Вашего вопроса, пожалуйста, заполните следующую форму, создав новую тему:[/CENTER]<code> <br>01. Ваш игровой никнейм:<br>02. Сервер, на котором Вы играете:<br>03. Подробное описание возникшей проблемы:<br>04. При наличии, приложите скриншоты, которые могут помочь в решении проблемы:<br>05. Дата и время возникновения проблемы (укажите максимально точные данные)</code>[/SIZE][/FONT][/COLOR]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
    '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Отказано[/ICODE][/SIZE][/CENTER][/COLOR]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
          {
    title: 'Правила технического раздела',
    content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
    "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый(ая) [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
    "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Обращаем Ваше внимание на то, что Ваш запрос был размещён в разделе, предназначенном для технических вопросов. Пожалуйста, ознакомьтесь с правилами данного раздела, чтобы убедиться, что Ваш запрос соответствует его назначению.<br>В технический раздел принимаются следующие запросы:<br>Если у Вас возникли технические проблемы, связанные с игровым модом:<br>Форма для заполнения:<br>[QUOTE]<br>[FONT=verdana][SIZE=15px][COLOR=rgb(226, 80, 65)]01.[/COLOR] Ваш игровой никнейм:<br>[COLOR=rgb(226, 80, 65)]02.[/COLOR] Сервер, на котором Вы играете:<br>[COLOR=rgb(226, 80, 65)]03.[/COLOR] Подробное описание проблемы (укажите все детали):<br>[COLOR=rgb(226, 80, 65)]04.[/COLOR] Скриншоты, которые могут помочь в решении проблемы (если имеются):<br>[COLOR=rgb(226, 80, 65)]05.[/COLOR] Дата и время возникновения проблемы (укажите максимально точные данные):[/SIZE][/FONT][/QUOTE]<br>[/CENTER]<br><br>[CENTER][FONT=verdana][SIZE=15px][COLOR=rgb(226, 80, 65)][U]Если Ваш запрос касается вылетов из игры или других проблем с клиентом[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[QUOTE]<br>[FONT=verdana][SIZE=15px][COLOR=rgb(226, 80, 65)]01. [/COLOR]Ваш игровой ник:<br>[COLOR=rgb(226, 80, 65)]02. [/COLOR]Сервер:<br>[COLOR=rgb(226, 80, 65)]03.[/COLOR] Тип проблемы: Обрыв соединения | Проблема с ReCAPTCHA | Краш игры (закрытие игры) | Другое [Выберите подходящий вариант]<br>[COLOR=rgb(226, 80, 65)]04.[/COLOR] Действия, которые привели к проблеме (если возможно, укажите место сбоя при вылетах):<br>[COLOR=rgb(226, 80, 65)]05.[/COLOR] Частота возникновения проблемы:<br>[COLOR=rgb(226, 80, 65)]06.[/COLOR] Полное название мобильного телефона:<br>[COLOR=rgb(226, 80, 65)]07.[/COLOR] Версия Android:<br>[COLOR=rgb(226, 80, 65)]08.[/COLOR] Дата и время (по МСК):<br>[COLOR=rgb(226, 80, 65)]09.[/COLOR] Способ связи с Вами (Telegram/VK):[/QUOTE][/SIZE][/FONT][/COLOR][/CENTER]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
    '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Отказано[/ICODE][/SIZE][/CENTER][/COLOR]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
 {
    title: 'Не относится к техническому разделу',
    content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
    "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый(ая) [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
    "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Ваше обращение не относится к техническому разделу. Пожалуйста, ознакомьтесь с правилами данного раздела, чтобы убедиться, что ваш запрос был размещён в соответствующем месте. Для этого перейдите по следующей ссылке: [URL='https://forum.blackrussia.online/forums/Информация-для-игроков.231/']Правила раздела[/URL].[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
    '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Отказано[/ICODE][/SIZE][/CENTER][/COLOR]',
    prefix: UNACCEPT_PREFIX,
    status: false,
},
{
	title: 'Законопослушность',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]К сожалению, администрация, технические специалисты и другие должностные лица BLACK RUSSIA не могут повлиять на законопослушность вашего аккаунта.<br>Повысить законопослушность можно тремя способами:<BR><BR>1. Каждый PayDay (00 минут каждого часа) вам начисляется одно очко законопослушности(Если только у вас нету PLATINUM VIP-статуса), если за прошедший час вы отыграли не менее 20 минут.<br>2. Приобрести законопослушность в /donate.<BR>3.На работе "Электрика"(доступна с 12 Игрового Уровня), для этого нужно починить 5 фонарей и тогда вам дадут 5 законопослушности.<br><br>[/CENTER]'+
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
         {
    title: 'Оффтоп',
    content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
    "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый(ая) [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
    "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Ваше сообщение не соответствует теме данного раздела форума. Пожалуйста, убедитесь, что ваши сообщения соответствуют обсуждаемой теме, чтобы избежать возможных неудобств. Мы рекомендуем ознакомиться с правилами форума для более точного понимания допустимого контента. Для этого перейдите по следующей ссылке: [URL='https://forum.blackrussia.online/threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BD%D0%B0%D1%85%D0%BE%D0%B6%D0%B4%D0%B5%D0%BD%D0%B8%D1%8F-%D0%BD%D0%B0-%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B5.304564/']правила форума[/URL].[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
    '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
    prefix: CLOSE_PREFIX,
    status: false,
},
          {
    title: 'Проблема решена',
    content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
    "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый(ая) [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
    "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Благодарим Вас за обратную связь! Мы рады узнать, что Ваша проблема была успешно решена. Если у Вас возникнут новые вопросы или проблемы, пожалуйста, не стесняйтесь обращаться в технический раздел. Желаем Вам приятной игры![/SIZE][/FONT][/COLOR][/CENTER]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
    '[CENTER][SIZE=15px][COLOR=rgb(127, 255, 0)][ICODE]Решено[/ICODE][/SIZE][/CENTER][/COLOR]',
    prefix: DECIDED_PREFIX,
    status: false,
},
         {
    title: 'Отвязка привязок',
    content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
    "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый(ая) [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
    "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]К сожалению, в настоящее время удаление привязок, установленных на аккаунте, невозможно. Если привязка была установлена злоумышленником, аккаунт будет перманентно заблокирован с указанием причины «Чужая привязка». В таких случаях дальнейшая разблокировка аккаунта невозможна, чтобы предотвратить возможные повторные взломы. Мы понимаем, что это может быть неудобно, и приносим свои извинения за любые неудобства, которые это может вызвать. Спасибо за понимание.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
    '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
    prefix: CLOSE_PREFIX,
    status: false,
},
{
    title: 'Передано направлению логирования',
    content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
    "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый(ая) [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
    "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Ваша тема была успешно закреплена и передана <u>техническому специалисту по логированию</u> для дальнейшего рассмотрения. Пожалуйста, ожидайте ответ в данной теме. Мы просим вас не создавать новые темы по данному вопросу, так как это может замедлить процесс обработки. Благодарим за ваше терпение и понимание.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
    '[CENTER][SIZE=15px][COLOR=rgb(255, 152, 0)][ICODE]На рассмотрении...[/ICODE][/SIZE][/CENTER][/COLOR]',
    prefix: TECHADM_PREFIX,
    status: true,
},
{
  "title": "Восстановление доступа к аккаунту",
  "color": "",
  "content":
  '[SIZE=4][FONT=Verdana][CENTER]Здравствуйте, уважаемый(ая) [B]{{ user.mention }}[/B]![/CENTER]<br><br>' +
  "[CENTER]Если ваш аккаунт защищен и [U]привязан к странице во ВКонтакте[/U], вы можете восстановить пароль или пин-код, обратившись в официальное сообщество проекта по следующему адресу: [URL='https://vk.com/blackrussia.online']https://vk.com/blackrussia.online[/URL]. Также вы можете воспользоваться телеграм-ботом: [URL='https://t.me/br_helper_bot']https://t.me/br_helper_bot[/URL]. Напишите «Начать» в личные сообщения группы или бота и следуйте инструкциям для восстановления доступа.<br><br>" +
  "[CENTER][FONT=Verdana]Более подробную информацию можно найти в этой теме: [URL='https://forum.blackrussia.online/index.php?threads/lime-Защита-игрового-аккаунта.1201253/']Защита игрового аккаунта[/URL].[/FONT][/CENTER]<br><br>" +
  "[CENTER]Если ваш аккаунт привязан к электронной почте, вы можете сбросить пароль или пин-код, выбрав опцию «Восстановить пароль» на сервере после подключения. Вам будет отправлено письмо с одноразовым кодом восстановления.<br><br>" +
  "[CENTER]В случае, если ваш аккаунт не был защищен, к сожалению, его восстановление невозможно. Мы настоятельно рекомендуем обеспечить безопасность вашего аккаунта, чтобы избежать подобных ситуаций в будущем.<br><br>" +
  "[CENTER]Мы понимаем, что восстановление доступа может занять некоторое время, и надеемся, что вы успешно решите этот вопрос. Если у вас возникнут дополнительные вопросы или потребуется помощь, пожалуйста, не стесняйтесь обращаться в наш технический раздел.<br>" +
  '[I][COLOR=rgb(127, 255, 0)]Рассмотрено[/COLOR][/I][/CENTER][/FONT][/SIZE]',
	prefix: WATCHED_PREFIX,
	status: false,
},

          {
  "title": "Запрос про имущ ",
  "content":
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]Уважаемый(ая) [COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR],[/CENTER][/SIZE][/FONT][/COLOR]<br><br>" +
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Для более детального рассмотрения вашего обращения, пожалуйста, предоставьте следующую информацию:<br><br>" +
  "[QUOTE][SIZE=5][FONT=Arial]1. Скриншоты или видео, подтверждающие ваше владение указанным имуществом.<br>2. Подробности о пропаже: дата, время и действия, предшествовавшие пропаже.<br>3. Информация о том, как вы первоначально приобрели это имущество:<br>   - Дата покупки<br>   - Способ приобретения (у игрока, в магазине или через донат)<br>   - Доказательства покупки (если имеются)<br>   - Никнейм игрока, у которого было приобретено имущество, если покупка была сделана не в магазине.[/FONT][/SIZE][/QUOTE][/SIZE][/FONT][/COLOR]</CENTER><br>" +
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
  '[CENTER][SIZE=15px][COLOR=rgb(255, 152, 0)][ICODE]На рассмотрении...[/ICODE][/COLOR][/SIZE][/CENTER]',
            prefix: PIN_PREFIX,
            status: true,
},
{
  "title": "Запрос доп инфы про акк",
  "content":
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]Уважаемый(ая) [COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR],[/CENTER][/SIZE][/FONT][/COLOR]<br><br>" +
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Для более детального рассмотрения вашего обращения, пожалуйста, предоставьте следующую информацию:<br><br>" +
  "[QUOTE][SIZE=5][FONT=Arial]1.Ваш Nick_Name:.<br>2. Подробности о пропаже: дата, время и действия, предшествовавшие пропаже.<br>3.Пробовали ли вы восстановиться через привязки, если таковы они у вас имеются?:<br>4. Меняли ли вы Nick_Name?:[/FONT][/SIZE][/QUOTE][/SIZE][/FONT][/COLOR]</CENTER><br>" +
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
  '[CENTER][SIZE=15px][COLOR=rgb(255, 152, 0)][ICODE]На рассмотрении...[/ICODE][/COLOR][/SIZE][/CENTER]',
            prefix: PIN_PREFIX,
            status: true,
},
          {
  "title": "Проблемы с загрузкой форума",
  "content":
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]Уважаемый(ая) [COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR],[/CENTER][/SIZE][/FONT][/COLOR]<br><br>" +
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Мы сожалеем, что вы столкнулись с проблемами при загрузке страниц форума. Чтобы помочь вам решить эту проблему, пожалуйста, выполните следующие шаги:<br><br>" +
  "1. Откройте настройки вашего браузера.<br>" +
  "2. Найдите раздел «Приложения» и выберите свой браузер.<br>" +
  "3. Нажмите на браузер, затем выберите опцию «Очистить» и нажмите «Очистить кэш».<br><br>" +
  "После этого выполните следующие действия для очистки истории и файлов cookie:<br>" +
  "1. Перейдите в настройки браузера.<br>" +
  "2. Выберите «Конфиденциальность и безопасность», затем «Очистить историю».<br>" +
  "3. В основных и дополнительных настройках установите галочки в пунктах «Файлы cookie» и «Данные сайтов».<br>" +
  "4. Нажмите «Удалить данные».<br><br>" +
  "Для вашего удобства, вот видео-инструкции по выполнению этих шагов в разных браузерах:<br>" +
  "• Для браузера Chrome: [https://youtu.be/FaGp2rRru9s](https://youtu.be/FaGp2rRru9s)<br>" +
  "• Для браузера Opera: [https://youtube.com/shorts/eJOxkc3Br6A?feature=share](https://youtube.com/shorts/eJOxkc3Br6A?feature=share)<br><br>" +
  "Если проблема сохраняется, пожалуйста, дайте нам знать, и мы будем рады помочь вам дополнительно.[/SIZE][/FONT][/COLOR]</CENTER><br>" +
  '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/COLOR][/SIZE][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
},
          {
  "title": "Вам в жб на тех спец.",
  "content":
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]Уважаемый(ая) [COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR],[/CENTER][/SIZE][/FONT][/COLOR]<br><br>" +
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Ваше обращение было рассмотрено, и в соответствии с решением технического специалиста вашего сервера было принято решение о наказании.<br><br>" +
  "Если вы считаете, что это решение было ошибочным или хотите подать жалобу на действия технического специалиста на сервере, где вы играете, пожалуйста, обратитесь в раздел «Жалобы на технических специалистов». Там вы сможете оформить свою жалобу и предоставить дополнительную информацию.<br><br>" +
  "Ссылка на раздел для подачи жалобы: [URL='https://forum.blackrussia.online/index.php?forums/Жалобы-на-технических-специалистов.490/']нажмите здесь[/URL].[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
  '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Отказано[/ICODE][/COLOR][/SIZE][/CENTER]',
  "prefix": UNACCEPT_PREFIX,
  "status": false,
},
          {
  "title": "Передано КП",
  "content":
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]Уважаемый(ая) [COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR],[/CENTER][/SIZE][/FONT][/COLOR]<br><br>" +
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Ваша тема была успешно закреплена и в данный момент находится на рассмотрении у команды проекта. Мы тщательно изучим ваш вопрос и сообщим вам о принятом решении. Пожалуйста, воздержитесь от создания новых тем по этому вопросу, чтобы избежать дублирования информации и ускорить процесс рассмотрения.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
  '[CENTER][SIZE=15px][COLOR=rgb(255, 152, 0)][ICODE]На рассмотрении...[/ICODE][/SIZE][/CENTER]',
            prefix: COMMAND_PREFIX,
            status: true,
},
          {
  "title": "Известно КП",
  "content":
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]Уважаемый(ая) [COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR],[/CENTER][/SIZE][/FONT][/COLOR]<br><br>" +
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Благодарим вас за то, что сообщили нам о возникшей проблеме. Мы уже осведомлены о данной проблеме, и наша команда активно работает над этой проблемой. Ваше обращение было передано в соответствующий отдел, и мы обязательно проинформируем вас о результатах, как только они будут известны. Благодарим за терпение и понимание.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
  '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/COLOR][/SIZE][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
},
          {
  "title": "Не начислили рейтинг за груз",
  "content":
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]Уважаемый(ая) [COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR],[/CENTER][/SIZE][/FONT][/COLOR]<br><br>" +
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Благодарим вас за ваше обращение. Позвольте разъяснить, как начисляется рейтинг за перевозку груза в нашей системе.<br><br>" +
  "Рейтинг рассчитывается с учетом состояния вашего автомобиля на протяжении всего рейса с грузом. Если ваш автомобиль получает поломку, это может повлиять на итоговый рейтинг, даже если поломка была устранена до завершения рейса. Чем серьезнее поломка, тем меньше рейтинг может быть начислен. Это сделано для более точного учета условий, в которых выполняется рейс.<br><br>" +
  "Если у вас остались вопросы или возникли дополнительные проблемы, пожалуйста, дайте нам знать. Мы всегда рады помочь и разобраться в ситуации.</SIZE][/FONT][/COLOR][/CENTER]<br>" +
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
  '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/COLOR][/SIZE][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
},
          {
  "title": "Проблема не является багом",
  "content":
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]Уважаемый(ая) [COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR],[/CENTER][/SIZE][/FONT][/COLOR]<br><br>" +
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Благодарим вас за обращение. После тщательного рассмотрения вашей проблемы мы пришли к выводу, что проблема, с которой Вы столкнулись, не является недоработкой/ошибкой сервера<br><br>" +
  "Если у вас есть дополнительные вопросы или если вы столкнетесь с другими трудностями, пожалуйста, не стесняйтесь обращаться к нам. Мы всегда готовы помочь и предоставить необходимую поддержку.<br><br>" +
  "Спасибо за понимание и терпение.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
  '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/COLOR][/SIZE][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false,
},
          {
  "title": "Тестерам",
  "color": "",
  "content":
  '[SIZE=4][FONT=Verdana][CENTER]Добрый день, уважаемый(ая) [B]{{ user.mention }}[/B]![/CENTER]<br><br>' +
  "[CENTER]Благодарим вас за ваше обращение. Мы рады сообщить вам, что ваша тема была передана на тестирование специалистам. Мы тщательно изучим предоставленную информацию и постараемся решить ваш вопрос в кратчайшие сроки.[/CENTER][/FONT][/SIZE]",
	prefix: WAIT_PREFIX,
	status: false,
},
          {
            title: 'Пропали вещи с аукциона',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Если вы выставили свои вещи на аукцион, а по истечении времени действия лота их никто не купил — воспользуйтесь командой [COLOR=rgb(251, 160, 38)]/reward[/COLOR]<br> В случае отсутствии вещей там — приложите видеофиксацию с использованием команды /time в данном обращении.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 152, 0)][ICODE]На рассмотрении...[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: PIN_PREFIX,
            status: true,
          },
          {
    "title": "Если не работают ссылки",
    "content":
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>" +
    "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый(ая) [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
    "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]К сожалению, по техническим причинам в данный момент данное действие невозможно. Мы предлагаем воспользоваться следующим решением:<br>[img]https://i.ibb.co/SX77Fgw/photo-2022-08-20-16-31-57.jpg[/img]<br>Если этот метод не помогает, вы можете использовать сервис сокращения ссылок по следующему адресу: https://clck.ru.<br>В качестве альтернативы, вы можете выполнить следующие шаги:<br>1) Загрузите скриншот биографии на фотохостинг.<br>2) В описание добавьте ссылку с форума.<br>3) Скопируйте пост с фотохостинга.<br><br>Еще один способ:<br>Сократите ссылки для ваших скриншотов и RP биографии, используя сервис goo.su. Пожалуйста, замените текст на русский язык, внимательно проверьте текст и постарайтесь уменьшить количество восклицательных знаков (!).<br>goo.su[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>" +
    "[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/COLOR][/SIZE][/CENTER]",
            prefix: CLOSE_PREFIX,
            status: false,
},
          {
    "title": "Сервер не отвечает",
    "content":
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>" +
    "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый(ая) [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
    "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Если вы столкнулись с проблемой «Сервер не отвечает», сервера не отображаются в лаунчере, или возникают трудности с входом на сайт/форум, пожалуйста, попробуйте выполнить следующие шаги:<br>1) Измените IP-адрес с помощью доступных средств.<br>2) Переключитесь на Wi-Fi, мобильный интернет или другую доступную сеть.<br>3) Используйте VPN.<br>4) Перезагрузите роутер.<br><br>Если указанные шаги не привели к решению проблемы, пожалуйста, выполните следующие дополнительные действия:<br>1) Установите приложение «1.1.1.1: Faster & Safer Internet» по следующей ссылке: https://clck.ru/ZP6Av и откройте его.<br>2) Ознакомьтесь с политикой приложения и согласитесь с ней.<br>3) Активируйте приложение, нажав на ползунок, и дождитесь изменения текста на «Подключено».<br>4) Проверьте: Отображаются ли сервера? Удается ли войти в игру? Работают ли другие ресурсы (сайт, форум)?[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
    "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Подробности включения приложения показаны в видео: https://youtu.be/Wft0j69b9dk[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>" +
    "[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/COLOR][/SIZE][/CENTER]",
            prefix: CLOSE_PREFIX,
            status: false,
},
         {
  title: 'Вам в раздел государственных орг',
  content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
    "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
    "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]К сожалению, ваша тема была размещена в неправильном разделе. Пожалуйста, подайте ваше заявление в раздел [COLOR=rgb(255, 255, 255)]государственных организаций вашего сервера. Мы понимаем, что это может быть неудобно, и благодарим вас за понимание.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
    '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
},
{
  title: 'Вам в раздел криминальных орг',
  content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
    "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
    "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]К сожалению, ваша тема была размещена в неправильном разделе. Пожалуйста, подайте ваше заявление в раздел [COLOR=rgb(255, 255, 255)]криминальных организаций вашего сервера. Мы понимаем, что это может быть ошибкой, и благодарим вас за понимание.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
    '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
  prefix: CLOSE_PREFIX,
  status: false,
},
{
  title: 'Вам в жб на адм',
  content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
    "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый(ая) [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
    "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Вам было назначено наказание, которое вынесено не техническим специалистом. Пожалуйста, обратитесь в раздел жалоб на администрацию вашего сервера для разъяснений. <br>Форма для подачи жалобы доступна поссылке [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-администрацию.3429349/']нажмите тут[/URL]. [/SIZE][/FONT][/COLOR][/CENTER]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
    '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
  prefix: CLOSE_PREFIX,
  status: false,
},
{
  title: 'Вам в жб на игровоков',
  content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
    '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый(ая) [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>' +
    '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Благодарим вас за ваше обращение. Пожалуйста, обратите внимание, что данная тема не относится к техническому разделу. Поскольку указанное действие было совершено игроком и нарушает правила сервера, вам следует обратиться в раздел «Жалобы на игроков» на вашем сервере.<br>Форма подачи жалобы доступна по следующей ссылке: [URL=\'https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/\']нажмите здесь[/URL] [/SIZE][/FONT][/COLOR][/CENTER]<br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
    '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
  prefix: CLOSE_PREFIX,
  status: false,
},
{
  title: 'Вам в жб на лидеров',
  content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
    '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый(ая) [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>' +
    '[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Благодарим вас за ваше обращение. Пожалуйста, обратите внимание, что данная тема не относится к техническому разделу. Поскольку указанные действия были совершены лидером и нарушают регламент сервера, мы рекомендуем вам обратиться в раздел «Жалобы на лидеров» на вашем сервере.<br>Форма подачи жалобы доступна по следующей ссылке: [URL=\'https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.3429391/\']нажмите здесь[/URL] [/SIZE][/FONT][/COLOR][/CENTER]<br>' +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
    '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
  prefix: CLOSE_PREFIX,
  status: false,
},
         {
  title: 'Вам в обжалования (адм)',
  content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
    "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
    "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Мы понимаем, что вы получили наказание от администратора вашего сервера. Для того чтобы снизить или обжаловать это наказание, пожалуйста, обратитесь в раздел «Обжалования» вашего сервера. Мы ценим вашу активность и стремление к справедливости. Для подачи заявки вы можете воспользоваться следующей формой: [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/']нажмите здесь[/URL].[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
    '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
  prefix: CLOSE_PREFIX,
  status: false,
},
         {
  title: 'Кикнули за ПО',
  content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
    "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
    "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Мы понимаем, что вы были отключены от сервера Античитом. Это может происходить по нескольким причинам, и мы хотели бы помочь вам разобраться в ситуации.<br><br>" +
    "[COLOR=rgb(255, 0, 0)]Пример:[/COLOR]<br><br> [IMG]https://i.ibb.co/FXXrcVS/image.png[/IMG]<br><br>" +
    "Пожалуйста, обратите внимание на значения PacketLoss и Ping в этом примере.<br><br>" +
    "PacketLoss - минимальное значение 0.000000, максимальное 1.000000. Если показатель больше нуля, это может указывать на задержку или потерю передаваемых пакетов, что может приводить к отключению от сервера. Постарайтесь улучшить ваше интернет-соединение, чтобы избежать таких проблем.<br><br>" +
    "Ping - чем меньше значение, тем лучше, так как это означает более быструю передачу данных. Значение выше 100 может свидетельствовать о нестабильности соединения. Если вы видите высокий пинг, это может повлиять на стабильность игрового процесса.<br><br>" +
    "Если проблемы с соединением отсутствуют, возможно, имело место временное повышение пинга, что также может привести к отключению античитом. Мы рекомендуем вам попытаться стабилизировать ваше соединение и, если потребуется, обратиться к вашему интернет-провайдеру за помощью.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
    '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
  prefix: CLOSE_PREFIX,
  status: false,
},
          {
  title: 'Нет фото/видеофиксации',
  content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
    "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
    "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]К сожалению, для рассмотрения вашей заявки нам необходимо иметь подтверждающие доказательства, такие как скриншоты или видео. Если у вас есть такие материалы, пожалуйста, создайте новую тему и приложите их. Вы можете использовать для этого следующие фото-хостинги: [URL='https://yapx.ru/']Yapx.ru[/URL], [URL='https://imgur.com/']Imgur.com[/URL], [URL='https://www.youtube.com/']YouTube.com[/URL], [URL='https://imgbb.com']ImgBB.com[/URL].[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
    '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
  prefix: CLOSE_PREFIX,
  status: false,
},
          {
    title: 'Баг будет исправлен',
    content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
    "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
    "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Благодарим Вас за Ваше замечание. Мы внимательно рассмотрим указанную проблему и постараемся её исправить. Ваш вклад в развитие нашего проекта очень ценен.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
    '[CENTER][SIZE=15px][COLOR=rgb(127, 255, 0)][ICODE]Рассмотрено[/ICODE][/SIZE][/CENTER][/COLOR]',
    prefix: WATCHED_PREFIX,
    status: false,
},
          {
            title: 'Ознакомьтесь с правилами восстановления',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Благодарим Вас за обращение. Пожалуйста, ознакомьтесь с правилами восстановления по следующей [URL='https://forum.blackrussia.online/index.php?threads/В-каких-случаях-мы-не-восстанавливаем-игровое-имущество.25277/']ссылке[/URL]. Ваша тема не соответствует критериям для восстановления, описанным в правилах. Мы ценим Ваше понимание и готовы помочь в других вопросах.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Отказано[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
  "title": "По крашам/вылетам",
  "content": "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>" +
             "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый(ая) [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR][/CENTER][/SIZE]<br><br>" +
             "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Благодарим вас за предоставленную информацию о вылетах. Мы хотим сообщить вам, что данные о вылетах передаются непосредственно разработчикам автоматически. Поэтому повторное их отправление в технический раздел не требуется.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
             "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]В случае возникновения проблем с подключением к игре, мы приложим все усилия для их скорейшего решения. Мы ценим ваше терпение и понимание.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
             '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Отказано[/ICODE][/SIZE][/CENTER][/COLOR]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
          {
  "title": "Не выпустило из ФСИН",
  "content": "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>" +
             "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый(ая) [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR][/CENTER][/SIZE]<br><br>" +
             "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Ваш запрос на выпуск из ФСИН был принят. Мы просим вас немного подождать, и вскоре ваша ситуация будет решена. Мы благодарны за ваше терпение и понимание.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
             '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
	prefix: CLOSE_PREFIX,
	status: false,
},
          {
  "title": "Хочу занять должность",
  "content": "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>" +
             "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый(ая) [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR][/CENTER][/SIZE]<br><br>" +
             "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Благодарим вас за интерес к занятию должности в нашем проекте. Однако, вопросы назначения на должности не решаются технической командой. Пожалуйста, обратитесь в главный раздел вашего игрового сервера, где вы найдете информацию о доступных должностях и формах подачи заявлений. Желаем вам удачи в карьере и приятной игры![/SIZE][/FONT][/COLOR][/CENTER]<br>" +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
             '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Отказано[/ICODE][/SIZE][/CENTER][/COLOR]',
	prefix: CLOSE_PREFIX,
	status: false,
},
          {
  "title": "По предложениям по улучшению",
  "content": "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>" +
             "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый(ая) [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR][/CENTER][/SIZE]<br><br>" +
             "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Благодарим вас за ваше предложение по улучшению. Поскольку данный запрос не относится к технической поддержке, мы рекомендуем вам обратиться в раздел [URL='https://forum.blackrussia.online/index.php?categories/Предложения-по-улучшению.656/']Предложения по улучшению → нажмите сюда[/URL], где вы сможете предложить свои идеи и рекомендации. Мы ценим ваш вклад и желаем вам приятной игры![/SIZE][/FONT][/COLOR][/CENTER]<br>" +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
             '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
	prefix: CLOSE_PREFIX,
	status: false,
},
  {
  "title": "Необходимы все детали для прошивки",
  "content":
  "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>" +
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый(ая) [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Для активации прошивки необходимо приобрести все детали соответствующего типа (например, SPORT, SPORT+ и т.д.). Ваше понимание в этом вопросе будут очень ценны.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
  '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
	prefix: CLOSE_PREFIX,
	status: false,
},
  {
  "title": "По вопросам доната",
  "content":
  "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>" +
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый(ая) [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Если ваши BLACK COINS не были зачислены, возможно, произошла ошибка при вводе реквизитов. К сожалению, из-за большого количества попыток мошенничества, мы не можем рассматривать такие обращения. Для проверки зачисления BLACK COINS, пожалуйста, введите в игре команду: /donat.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Просим вас внимательно проверять реквизиты при осуществлении покупок.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Если вы уверены, что ошибка не произошла и с момента оплаты прошло менее 14 дней, пожалуйста, обратитесь в нашу службу поддержки для дальнейшего рассмотрения вашего случая. Вы можете связаться с нами через виджет обратной связи на сайте или посредством мессенджеров: ВКонтакте: vk.com/br_tech, Telegram: t.me/br_techBot[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
  '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
  "prefix": "DECIDED_PREFIX",
  "status": false
},
          {
  "title": "Исчезла статистика аккаунта",
  "content":
  "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>" +
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]Уважаемый(ая) {{ user.name }}, добрый день![/CENTER][/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Ваш аккаунт не может исчезнуть или быть аннулирован без причины. Даже если вы меняете ник, используете опции «починить игру» или «сброс настроек», ваш аккаунт останется активным. Система функционирует иначе.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Пожалуйста, убедитесь, что вы вводите правильные данные: пароль, никнейм и сервер. Часто бывает, что игроки просто забывают актуальные данные и ошибочно думают, что их аккаунт был удален. Обратите внимание на это![/SIZE][/FONT][/COLOR][/CENTER]<br>" +
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Если вы сменили никнейм в игре, но не обновили его в клиенте, пожалуйста, ознакомьтесь с инструкцией по изменению никнейма: [URL=https://youtu.be/c8rhVwkoFaU]видео-инструкция[/URL].[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
  "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>" +
  "[CENTER][SIZE=15px][COLOR=rgb(127, 255, 0)][ICODE]Рассмотрено[/ICODE][/COLOR][/SIZE][/CENTER][/COLOR]",
            prefix: CLOSE_PREFIX,
            status: false,
 },

{
	"title": "Привязку Изменить/Привязать",
	"content": "[SIZE=4][FONT=Trebuchet MS][CENTER]Здравствуйте, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>" +
"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>" +
	"[CENTER]Мы внимательно рассмотрели ваш запрос относительно изменения привязок.<br>К сожалению, команда технических специалистов, администрация и другие уполномоченные лица не занимаются изменением привязок или дополнительной безопасности аккаунта.<br>" +
	"[CENTER][I][COLOR=rgb(255, 255, 255)]Ваш запрос был рассмотрен.[/COLOR][/I].[/CENTER][/FONT][/SIZE]<br><br>" +
"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]",
	"prefix": WATCHED_PREFIX,
	"status": false
},


];

	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('На рассмотрении', 'pin', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 173, 51, 0.5);');
	addButton('Команде проекта', 'teamProject', 'border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(255, 240, 110, 0.5);');
    addButton('Техническому специалисту', 'techspec', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(17, 92, 208, 0.5);');
	addButton('Рассмотрено', 'watched', 'border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(110, 192, 113, 0.5)');
	addButton('Решено', 'decided', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(110, 192, 113, 0.5);');
    addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(220, 89, 89, 0.5);');
	addButton('Закрыто', 'closed', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(220, 89, 89, 0.5);');
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
	$('button#techspec').click(() => editThreadData(TECHADM_PREFIX, true));

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
	4 < hours && hours <= 11 ?
	'Доброе утро' :
	11 < hours && hours <= 15 ?
	'Добрый день' :
	15 < hours && hours <= 21 ?
	'Добрый вечер' :
	'Доброй ночи',
	};
	}

	function editThreadData(prefix, pin = false, may_lens = true) {
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
		if(may_lens === true) {
			if(prefix == UNACCEPT_PREFIX || prefix == WATCHED_PREFIX || prefix == CLOSE_PREFIX || prefix == DECIDED_PREFIX) {
				moveThread(prefix, 230); }

			if(prefix == WAIT_PREFIX) {
				moveThread(prefix, 917);
			}
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