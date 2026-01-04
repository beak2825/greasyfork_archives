// ==UserScript==
// @name   KF_script
// @name:ru  Кураторы форума GREEN
// @description  Suggestions for improving the script write here
// @description:ru Топчикс
// @autor GA
// @version 1.0.0
// @namespace https://forum.blessrussia.online/
// @match        https://forum.blessrussia.online/*
// @include      https://forum.blessrussia.online/
// @grant        none
// @license   MIT
// @supportURL  | Oliver Cromwell
// @icon https://i.postimg.cc/ZKwZvbfd/Developer.png
// @downloadURL https://update.greasyfork.org/scripts/543612/KF_script.user.js
// @updateURL https://update.greasyfork.org/scripts/543612/KF_script.meta.js
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
const OTKAZBIO_PREFIX = 4;
const ODOBRENOBIO_PREFIX = 8;
const NARASSMOTRENIIBIO_PREFIX = 2;
const OTKAZRP_PREFIX = 4;
const ODOBRENORP_PREFIX = 8;
const NARASSMOTRENIIRP_PREFIX = 2;
const OTKAZORG_PREFIX = 4;
const ODOBRENOORG_PREFIX = 8;
const NARASSMOTRENIIORG_PREFIX = 2;
const buttons = [
    {
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ ᅠᅠПрочие ответы на жалобы   ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid gold;  width: 96%; border-radius: 15px;',
},
  {
        title: 'Взять на рассмотрение',
        content:
  '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Georgia]Ваша жалоба взята [Color=rgb(255, 155 ,0)]на рассмотрении.[/color] <br> Ожидайте, пожалуйста, ответа от администрации и не нужно создавать копии этой темы.[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
        prefix: PINN_PREFIX,
        status: true,
      },
  {
        title: 'Спец. администрации',
        content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Ваша жалоба была принята и передана на дальнейшее рассмотрение - [COLOR=red]Специальной администрации[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Ожидайте ответа и не нужно создавать копии этой темы.[/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
        prefix: SPECY_PREFIX,
        status: true,
},
{
        title: 'Глав. админу',
        content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Ваша жалоба была принята и передана на дальнейшее рассмотрение - [COLOR=lime]Главному администратору[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Ожидайте ответа и не нужно создавать копии этой темы.[/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
        prefix: GA_PREFIX,
        status: true,
},
    {
        title: 'Передано теху',
        content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Ваша жалоба была принята и передана на дальнейшее рассмотрение - [COLOR=orange]Техническому специалисту[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Ожидайте ответа и не нужно создавать копии этой темы.[/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
        prefix: TEXY_PREFIX,
        status: true,
    },
  {
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ ᅠᅠОтказанные жалобы на игроков   ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #FF0000;  width: 96%; border-radius: 15px;',
},
{
        title: 'Нарушение этических норм в жалобе',
        content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Ваша жалоба содержит элементы неуважения к игроку, в связи с чем она не будет рассмотрена.[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=red]Отказано[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
        prefix: CLOSE_PREFIX,
        status: false,
},
     {
      title: 'Не по форме',
      content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Ваша жалоба составлена [COLOR=red]не по форме[/color].[/size][/font][/CENTER]<br>' +
    '[CENTER][SPOILER=Форма подачи жалобы][CENTER][size=15px][font=Georgia][COLOR=gold]1.[/color] Ваш Nick_Name:[/size][/font][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=gold]2.[/color] Nick_Name игрока:[/size][/font][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=gold]3.[/color] Суть жалобы:[/size][/font][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=gold]4.[/color] Доказательства:[/SPOILER][/size][/font][/CENTER]' +
    '[CENTER][size=15px][font=Georgia][COLOR=red]Отказано[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
     {
      title: 'Прошло 3-е суток',
      content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Жалоба не подлежит рассмотрению, если с момента возможного нарушения со стороны игрока прошло более [COLOR=red]72[/COLOR] часов[/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=red]Отказано[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Фотохостинги',
      content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Для подтверждения ваших слов, все доказательства должны быть загружены на официальные платформы, такие как Yapx, Imgur или YouTube. Использование других источников может привести к недоразумениям или невозможности проверки предоставленных материалов.[/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=red]Отказано[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Видео обрывается',
      content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Ваше [COLOR=gold]видеодоказательство[/COLOR] обрывается. Рекомендуем использовать видеохостинг [COLOR=red]YouTube[/COLOR], который загружает видео без ограничений по продолжительности. Это обеспечит стабильную доступность вашего доказательства и облегчит процесс [COLOR=gold]рассмотрения[/COLOR] вашей жалобы.[/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=red]Отказано[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
     {
      title: 'Потребуется фрапс',
      content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Для применения наказания к игроку необходимо предоставить видеозапись данного инцидента.[/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=red]Отказано[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
	  title: 'Дублирование темы',
	  content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Ответ уже был дан в подобной теме. Пожалуйста, прекратите создавать идентичные или похожие темы - иначе Ваш форумный аккаунт может быть заблокирован.<br><br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=red]Отказано[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
	  prefix: CLOSE_PREFIX,
      status: false,
     },
    {
	  title: 'Нет доказательств',
	  content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Без предоставления доказательств (включая скриншоты или видеоматериалы) решение проблемы невозможно. В случае, если у вас есть необходимые доказательства, пожалуйста, создайте новую тему, прикрепив файлы с фото-хостинга, таких как yapx.ru или imgur.com, и предоставьте их для дальнейшего рассмотрения.<br><br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=red]Отказано[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
 prefix: CLOSE_PREFIX,
      status: false,
      },
      {
      title: '24h',
      content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]К сожалению, [COLOR=gold]прошло 24 часа[/COLOR] с момента получения вашей видеозаписи, но таймкоды нарушений так и не были [COLOR=gold]добавлены.[/COLOR] В связи с этим, жалоба [COLOR=red]закрыта.[/COLOR][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=red]Отказано[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
     },
    {
      title: 'Недостаточно доказательств',
      content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Предоставленные вами доказательства недостаточны для вынесения наказания данному игроку. Пожалуйста, предоставьте дополнительные материалы, которые могут подтвердить факт нарушения.[/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=red]Отказано[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
     },
     {
      title: 'Не работают док-ва',
      content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Доказательства, предоставленные вами, нерабочие. Пожалуйста, загрузите рабочие материалы или укажите корректные ссылки.[/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=red]Отказано[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
       {
      title: 'Плохое качество',
      content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Качество предоставленных вами доказательств недостаточно для полноценного рассмотрения жалобы. В связи с этим, мы не можем принять их для дальнейшей обработки[/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=red]Отказано[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
     {
      title: 'Нет /time',
      content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]На предоставленных вами доказательствах отсутствует необходимая метка времени [COLOR=gold](/time)[/COLOR], что делает их неполными и неподтвержденными для дальнейшего рассмотрения.[/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=red]Отказано[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
     {
      title: 'От 3-го лица',
      content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Жалобы, написанные от имени [COLOR=gold]третьих лиц[/COLOR], не подлежат рассмотрению. Пожалуйста, подайте жалобу от собственного имени.[/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=red]Отказано[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
      {
      title: 'Нету условий сделки',
      content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]В предоставленных доказательствах не указаны [COLOR=gold]условия сделки[/COLOR], что является обязательным.[/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=red]Отказано[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
     },
      {
      title: 'Таймкоды',
      content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Видеозапись слишком длинная [COLOR=gold](более 3 минут).[/COLOR] У вас есть [COLOR=gold]24 часа,[/COLOR] чтобы предоставить таймкоды нарушений. В противном случае жалоба будет [COLOR=red]закрыта.[/COLOR][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=orange]На рассмотрение.[/FONT][/COLOR][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
      prefix: PINN_PREFIX,
      status: true,
           },
     {
      title: 'Нарушения отсутствуют',
      content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]На основании представленных доказательств [COLOR=gold]нарушений[/COLOR] со стороны игрока [COLOR=gold]не установлено.[/COLOR][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=red]Отказано[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
     {
      title: 'Жалобу на сотрудника',
      content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Обратитесь в раздел [COLOR=gold]жалоб[/COLOR] на сотрудников для дальнейшего [COLOR=gold]рассмотрения.[/COLOR][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=red]Отказано[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
     {
        title: 'Разделом ошиблись',
        content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Извините, но вы ошиблись [COLOR=gold]разделом.[/COLOR] Этот раздел предназначен для подачи жалоб на [COLOR=gold]игроков.[/COLOR][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=red]Отказано[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
        title: 'Ошиблись сервером',
        content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]К сожалению, ваша жалоба была подана не в тот [COLOR=gold]раздел.[/COLOR] Данный раздел принадлежит другому серверу.[/SIZE][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=red]Отказано[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
        prefix: CLOSE_PREFIX,
        status: false,
},
      {
      title: 'Долг через трейд',
      content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Займ может быть осуществлен исключительно через зачисление игровых ценностей на [COLOR=gold]банковский счет.[/COLOR] На предоставленных вами доказательствах займ был проведен через обмен с другим игроком, что является [COLOR=gold]нарушением правил.[/COLOR][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=red]Отказано[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
      {
      title: 'Доступ к складу 3 лицу',
      content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Вы самостоятельно доверили и выдали [COLOR=gold]права игроку,[/COLOR] предоставив ему возможность получения [COLOR=gold]денежных средств[/COLOR] со склада.[/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=red]Отказано[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
     {
      title: 'Слив фамы замом',
      content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]В настоящее время [COLOR=gold]не существует[/COLOR] ни одного правила, которое регулирует подобные ситуации. [COLOR=gold]Вы самостоятельно[/COLOR] назначили этого человека на должность заместителя. Рекомендуем более тщательно подходить к выбору кандидатов на эту [COLOR=gold]роль.[/COLOR] [/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=red]Отказано[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
      {
      title: 'Кража патронов с склада фамы',
      content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Нарушений со стороны игрока [COLOR=gold]не выявлено.[/COLOR] Игрок оплатил установленную сумму за разрешение на  [COLOR=gold]определенное количество[/COLOR] патронов, которое Вы ему выдали.[/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=red]Отказано[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Для ГКФ',
      content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Жалоба была передана [COLOR=rgb(0, 255, 255)]Главному куратору форума[/COLOR].[/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=orange]На рассмотрение.[/FONT][/COLOR][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
      prefix: PINN_PREFIX,
      status: true,
    },
    {
	  title: 'Дубликат',
	  content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Ответ на данный вопрос уже был дан в аналогичной теме. Пожалуйста, воздержитесь от создания идентичных или схожих тем, так как это может привести к блокировке вашего аккаунта на форуме.<br><br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=red]Отказано[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
	    prefix: CLOSE_PREFIX,
      status: false,
    },
    {
	  title: 'Доква отредактирована',
	  content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Ваши доказательства признаны подделанными или отредактированными. На этом основании жалоба отклонена<br><br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=red]Отказано[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
	    prefix: CLOSE_PREFIX,
      status: false,
    },

  {
  title: ' Правила поведения в рамках RolePlay ',
  dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #22FF22; width: 96%; border-radius: 15px;',
},
  {
  title: 'NonRP обман',
  content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Рассмотрев ваши доказательства, выношу вердикт - игрок будет наказан по пункту правил [/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][SPOILER=Пункт правил][COLOR=gold] 2.05. [/COLOR] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [COLOR=red] | Ban 5-30 дней / PermBan [/COLOR]<br>' +
    '[COLOR=red] Примечание [/COLOR]: администрация сервера [U]не несет[/U] ответственность за аккаунты игроков, а также содержащиеся на них или утерянные материальные игровые ценности в случае взлома, обмана, невнимательности и так далее.[/SPOILER][/FONT][/CENTER]' +
    '[CENTER][size=15px][font=Georgia][COLOR=lime]Одобрено[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
  prefix: RESHENO_PREFIX,
  status: false,
},
 {
      title: 'DM',
      content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Рассмотрев ваши доказательства, выношу вердикт - игрок будет наказан по пункту правил [/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][SPOILER=Пункт правил][COLOR=gold]2.19.[/COLOR] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины[COLOR=red] | Jail 60 минут[/COLOR]<br><br> [COLOR=red] Примечание: [/COLOR]разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.<br> [COLOR=red] Примечание: [/COLOR]нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/SIZE][/FONT][/CENTER][/SPOILER]' +
    '[CENTER][size=15px][font=Georgia][COLOR=lime]Одобрено[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
},
{
      title: 'DB',
      content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Рассмотрев ваши доказательства, выношу вердикт - игрок будет наказан по пункту правил [/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][SPOILER=Пункт правил][COLOR=gold]2.13.[/color] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [COLOR=red] | Jail 30 минут[/COLOR][/SPOILER][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=lime]Одобрено[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
},
{
      title: 'TK',
      content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Рассмотрев ваши доказательства, выношу вердикт - игрок будет наказан по пункту правил [/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][SPOILER=Пункт правил][COLOR=gold]2.15.[/color] Запрещено TK (Team Kill) — убийство или нанесение урона члену своей или союзной фракции/организации без наличия веской и обоснованной IC (внутриигровой) причины.[COLOR=red]  | Jail 60 минут / Warn (за два и более убийства)[/COLOR][/SPOILER][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=lime]Одобрено[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
},
{
      title: 'SK',
      content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Рассмотрев ваши доказательства, выношу вердикт - игрок будет наказан по пункту правил [/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][SPOILER=Пункт правил][COLOR=gold]2.16.[/color] Запрещен SK [COLOR=gold](Spawn Kill)[/color] — убийство или нанесение урона на титульной территории любой фракции или организации, а также в зоне появления игрока, включая выход из закрытых интерьеров. Такое поведение нарушает честность игры, создавая несправедливые условия для игроков, которые не могут защититься сразу после респауна. [COLOR=red] | Jail 60 минут / Warn (за два и более убийства) [/COLOR][/SPOILER][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=lime]Одобрено[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
},
{
      title: 'MG',
      content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Рассмотрев ваши доказательства, выношу вердикт - игрок будет наказан по пункту правил [/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][SPOILER=Пункт правил][COLOR=gold]2.18.[/color] Запрещен MG [COLOR=gold](MetaGaming)[/color] — использование информации, полученной вне игры (ООС), для действий или решений внутри игрового процесса (IC), которую ваш персонаж не мог бы узнать в рамках своей роли или ситуации в игре. [COLOR=red] | Mute 10-30 минут[/COLOR][/SPOILER][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=lime]Одобрено[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },
       {
      title: 'Mass DM',
      content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Рассмотрев ваши доказательства, выношу вердикт - игрок будет наказан по пункту правил [/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][SPOILER=Пункт правил][COLOR=gold]2.20.[/color] Запрещен Mass DM [COLOR=gold](Mass DeathMatch)[/color] — убийство или нанесение урона трем и более игрокам без веской IC причины, при этом действия игрока должны иметь логическое объяснение в рамках сюжета и персонажа. [COLOR=red] | Warn / Ban 3 - 30 дней[/COLOR][/SPOILER][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=lime]Одобрено[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
  title: 'NRP поведение',
  content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Рассмотрев ваши доказательства, выношу вердикт - игрок будет наказан по пункту правил [/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][SPOILER=Пункт правил][COLOR=gold]2.01.[/color] Запрещено поведение, нарушающее нормы [COLOR=gold]Role Play[/color] процесса — любые действия, мешающие нормальному протеканию ролевого процесса, включая неадекватное поведение, отступление от ситуации или слишком грубое нарушение правил ролевого взаимодействия, что нарушает атмосферу игры и усложняет взаимодействие с другими игроками. [COLOR=red] | Jail 30 минут [/COLOR][/SPOILER][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=lime]Одобрено[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
  prefix: RESHENO_PREFIX,
  status: false,
},
    {
      title: 'Помеха игр. процессу',
      content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Рассмотрев ваши доказательства, выношу вердикт - игрок будет наказан по пункту правил [/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][SPOILER=Пункт правил][COLOR=gold]2.04.[/color] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. [COLOR=red] | Ban 10 дней / Jail 10-30 минут [/COLOR][/SPOILER][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=lime]Одобрено[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Аморал. действия',
      content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Рассмотрев ваши доказательства, выношу вердикт - игрок будет наказан по пункту правил [/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][SPOILER=Пункт правил][COLOR=gold]2.08.[/color] Запрещена любая форма аморальных действий сексуального характера в сторону игроков [COLOR=red] | Jail 30 минут / Warn / Ban 10-30 дней [/COLOR][/SPOILER][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=lime]Одобрено[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Уход от RP',
      content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Рассмотрев ваши доказательства, выношу вердикт - игрок будет наказан по пункту правил [/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][SPOILER=Пункт правил][COLOR=gold]2.02.[/color] Запрещено целенаправленно уходить от[COLOR=gold] Role Play[/color] процесса различными способами — действия, которые мешают нормальному ролевому взаимодействию или препятствуют его продолжению. [COLOR=RED] | Jail 30 минут / Warn / Ban 1-30 дней [/COLOR][/SPOILER][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=lime]Одобрено[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
        prefix: RESHENO_PREFIX,
        status: false,
    },
     {
      title: 'Слив склада',
      content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Рассмотрев ваши доказательства, выношу вердикт - игрок будет наказан по пункту правил [/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][SPOILER=Пункт правил][COLOR=gold] 2.09. [/color] Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [COLOR=RED]| Ban 15 - 30 дней / PermBan[/COLOR][/SPOILER][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=lime]Одобрено[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },
     {
      title: 'Обман в /do',
      content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Рассмотрев ваши доказательства, выношу вердикт - игрок будет наказан по пункту правил [/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][SPOILER=Пункт правил][COLOR=gold]2.10.[/color] Запрещено в любой форме обманывать в /do, даже если это в дальнейшем негативно скажется на Вашем игровом персонаже [COLOR=RED]| Jail 30 минут / Warn[/COLOR][/SPOILER][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=lime]Одобрено[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },
     {
      title: 'ППИВ',
      content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Рассмотрев ваши доказательства, выношу вердикт - игрок будет наказан по пункту правил [/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][SPOILER=Пункт правил][COLOR=gold]2.28.[/color] Запрещенo покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги [COLOR=RED] | PermBan с обнулением аккаунта + ЧС проекта[/COLOR][/SPOILER][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=lime]Одобрено[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Обход системы',
      content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Рассмотрев ваши доказательства, выношу вердикт - игрок будет наказан по пункту правил [/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][SPOILER=Пункт правил][COLOR=gold]2.21.[/color] Запрещено пытаться обходить игровую систему или использовать любые баги сервера [COLOR=RED] | Ban 15 - 30 дней / PermBan (по согласованию с ГА, ЗГА, руководством тех. специалистов)[/COLOR][/SPOILER][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=lime]Одобрено[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Стороннее ПО',
      content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Рассмотрев ваши доказательства, выношу вердикт - игрок будет наказан по пункту правил [/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][SPOILER=Пункт правил][COLOR=gold]2.22.[/color] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [COLOR=RED] | Ban 15 - 30 дней / PermBan[/COLOR][/SPOILER][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=lime]Одобрено[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Сокрытие багов',
      content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Рассмотрев ваши доказательства, выношу вердикт - игрок будет наказан по пункту правил [/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][SPOILER=Пункт правил][COLOR=gold]2.23.[/color] Запрещено скрывать от администрации баги системы, а также распространять их игрокам [COLOR=RED] | Ban 15 - 30 дней / PermBan[/COLOR][/SPOILER][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=lime]Одобрено[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },
     {
      title: 'Уязвимость правил',
      content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Рассмотрев ваши доказательства, выношу вердикт - игрок будет наказан по пункту правил [/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][SPOILER=Пункт правил][COLOR=gold]2.33.[/color] Запрещено пользоваться уязвимостью правил [COLOR=RED] | На усмотрение руководства руководящей администрации сервера / проекта [/COLOR][/SPOILER][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=lime]Одобрено[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },
     {
      title: 'Вред ресурсам проекта',
      content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Рассмотрев ваши доказательства, выношу вердикт - игрок будет наказан по пункту правил [/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][SPOILER=Пункт правил][COLOR=gold]2.26.[/color] Запрещенo намеренно наносить вред ресурсам проекта [COLOR=gold](игровые серверы, форум, официальные Discord-серверы и так далее)[/color] [COLOR=RED] | PermBan + ЧС проекта[/COLOR][/SPOILER][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=lime]Одобрено[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

    {
      title: 'Сокрытие нарушителей',
      content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Рассмотрев ваши доказательства, выношу вердикт - игрок будет наказан по пункту правил [/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][SPOILER=Пункт правил][COLOR=gold]2.24.[/color] Запрещено скрывать от администрации нарушителей или злоумышленников [COLOR=RED] | Ban 15 - 30 дней / PermBan + ЧС проекта[/COLOR][/SPOILER][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=lime]Одобрено[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },
     {
      title: 'Вред репутации проекта',
      content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Рассмотрев ваши доказательства, выношу вердикт - игрок будет наказан по пункту правил [/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][SPOILER=Пункт правил][COLOR=gold]2.25.[/color] Запрещены попытки или действия, которые могут навредить репутации проекта [COLOR=RED] | PermBan + ЧС проекта[/COLOR][/SPOILER][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=lime]Одобрено[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },

     {
      title: 'Ущерб экономике',
      content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Рассмотрев ваши доказательства, выношу вердикт - игрок будет наказан по пункту правил [/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][SPOILER=Пункт правил][COLOR=gold]2.30.[/color] Запрещенo пытаться нанести ущерб экономике сервера [COLOR=RED] | Ban 15 - 30 дней / PermBan[/COLOR][/SPOILER][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=lime]Одобрено[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Реклама',
      content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Рассмотрев ваши доказательства, выношу вердикт - игрок будет наказан по пункту правил [/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][SPOILER=Пункт правил][COLOR=gold]2.31.[/color] Запрещенo рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное [COLOR=RED] | Mute 10-180 минут / Ban 7 дней / PermBan[/COLOR][/SPOILER][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=lime]Одобрено[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },
 {
      title: 'Обман адм.',
      content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Рассмотрев ваши доказательства, выношу вердикт - игрок будет наказан по пункту правил [/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][SPOILER=Пункт правил][COLOR=gold]2.32.[/color] Запрещенo введение в заблуждение, обман администрации на всех ресурсах проекта [COLOR=RED] | Ban 7 - 15 дней[/COLOR][/SPOILER][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=lime]Одобрено[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },
     {
      title: 'Уход от наказания',
      content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Рассмотрев ваши доказательства, выношу вердикт - игрок будет наказан по пункту правил [/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][SPOILER=Пункт правил][COLOR=gold]2.34.[/color] Запрещенo уход от наказания [COLOR=RED] | Ban 15 - 30 дней (суммируется к общему наказанию дополнительно)[/COLOR][/SPOILER][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=lime]Одобрено[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Продажа/покупка репутации',
      content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Рассмотрев ваши доказательства, выношу вердикт - игрок будет наказан по пункту правил [/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][SPOILER=Пункт правил][COLOR=gold]2.44.[/color] Запрещена продажа или покупка репутации семьи любыми способами, скрытие нарушителей, читеров лидером семьи. [COLOR=RED] | Обнуление рейтинга семьи / Обнуление игрового аккаунта лидера семьи[/COLOR][/SPOILER][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=lime]Одобрено[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Арест на аукционе',
      content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Рассмотрев ваши доказательства, выношу вердикт - игрок будет наказан по пункту правил [/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][SPOILER=Пункт правил][COLOR=gold]2.45.[/color] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий [COLOR=RED] | Ban 7 - 15 дней + увольнение из организации[/COLOR][/SPOILER][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=lime]Одобрено[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'NRP аксессуар',
      content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Рассмотрев ваши доказательства, выношу вердикт - игрок будет наказан по пункту правил [/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][SPOILER=Пункт правил][COLOR=gold]2.47.[/color] Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. [COLOR=RED] | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/COLOR][/SPOILER][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=lime]Одобрено[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },
     {
      title: 'Багоюз анимации',
      content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Рассмотрев ваши доказательства, выношу вердикт - игрок будет наказан по пункту правил [/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][SPOILER=Пункт правил][COLOR=gold]2.55.[/color] Запрещается багоюз связанный с анимацией в любых проявлениях. [COLOR=RED] | Jail 60 / 120 минут[/COLOR][/SPOILER][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=lime]Одобрено[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },
     {
      title: 'Невозврат долга',
      content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Рассмотрев ваши доказательства, выношу вердикт - игрок будет наказан по пункту правил [/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][SPOILER=Пункт правил][COLOR=gold]2.57.[/color] Запрещается брать в долг игровые ценности и не возвращать их. [COLOR=red] | Ban 30 дней / Permban=[/COLOR][/SPOILER][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][COLOR=lime]Одобрено[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ ᅠᅠЭтика общения в игровом чатеᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
      dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #00FFFF; width: 96%; border-radius: 15px;',
	},
 {
        title: 'Упоминание родных',
        content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Рассмотрев ваши доказательства, выношу вердикт - игрок будет наказан по пункту правил [/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][SPOILER=Пункт правил][CENTER][COLOR=gold]3.04.[/color] Запрещено оскорблять и упоминать родных, независимо от чата  (IC или OOC)[COLOR=red] | Mute 120 минут / Ban 7 - 15 дней[/COLOR][/SPOILER][/CENTER]' +
    '[CENTER][size=15px][font=Georgia][COLOR=lime]Одобрено[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
        prefix: RESHENO_PREFIX,
        status: false,
},
{
        title: 'Политика / провокация',
        content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Рассмотрев ваши доказательства, выношу вердикт - игрок будет наказан по пункту правил, который указан ниже. [/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][SPOILER=Пункт правил][CENTER][COLOR=gold]3.18.[/color] Запрещены любые формы политического и религиозного пропагандирования, а также провокационные действия, направленные на создание конфликтов между игроками, коллективный флуд или нарушение порядка в любых чатах. [COLOR=red] | Mute 120 минут / Ban 10 дней[/COLOR][/SPOILER][/CENTER]' +
    '[CENTER][size=15px][font=Georgia][COLOR=lime]Одобрено[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
        prefix: RESHENO_PREFIX,
        status: false,
},
{
        title: 'Межнац. и религ. конфликт',
        content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Рассмотрев ваши доказательства, выношу вердикт - игрок будет наказан по пункту правил, который указан ниже. [/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][SPOILER=Пункт правил][COLOR=gold]2.35.[/color] На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате [COLOR=red] | Mute 120 минут / Ban 7 дней[/COLOR][/SPOILER][/CENTER]' +
    '[CENTER][size=15px][font=Georgia][COLOR=lime]Одобрено[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
        prefix: RESHENO_PREFIX,
        status: false,
},
{
        title: 'Перенос конфликта',
        content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Рассмотрев ваши доказательства, выношу вердикт - игрок будет наказан по пункту правил, который указан ниже. [/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][SPOILER=Пункт правил][COLOR=gold]2.36.[/color] Запрещено переносить конфликты из IC в OOC и наоборот [COLOR=red] | Warn[/COLOR][/SPOILER][/CENTER]' +
    '[CENTER][size=15px][font=Georgia][COLOR=lime]Одобрено[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
        prefix: RESHENO_PREFIX,
        status: false,
},
{
        title: 'OOC угрозы',
        content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Рассмотрев ваши доказательства, выношу вердикт - игрок будет наказан по пункту правил, который указан ниже. [/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][SPOILER=Пункт правил][COLOR=gold]2.37.[/color] Запрещено OOC угрозы, в том числе и завуалированные [COLOR=red] | Mute 120 минут / Ban 7 дней[/COLOR][/SPOILER][/CENTER]' +
    '[CENTER][size=15px][font=Georgia][COLOR=lime]Одобрено[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
        prefix: RESHENO_PREFIX,
        status: false,
},
     {
        title: 'Оск. администрации',
        content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Рассмотрев ваши доказательства, выношу вердикт - игрок будет наказан по пункту правил, который указан ниже. [/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][SPOILER=Пункт правил][COLOR=gold]2.54.[/color] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [COLOR=red] | Mute 180 минут[/COLOR][/SPOILER][/CENTER]' +
    '[CENTER][size=15px][font=Georgia][COLOR=lime]Одобрено[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
        prefix: RESHENO_PREFIX,
        status: false,
    },
   {
        title: 'Оскорбление в OOC',
        content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Рассмотрев ваши доказательства, выношу вердикт - игрок будет наказан по пункту правил, который указан ниже. [/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][SPOILER=Пункт правил][COLOR=gold]3.03.[/color] Запрещено  Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [COLOR=red] | Mute 30 минут[/COLOR][/SPOILER][/CENTER]' +
    '[CENTER][size=15px][font=Georgia][COLOR=lime]Одобрено[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
        prefix: RESHENO_PREFIX,
        status: false,
    },
    {
        title: 'Flood',
        content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Рассмотрев ваши доказательства, выношу вердикт - игрок будет наказан по пункту правил, который указан ниже. [/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][SPOILER=Пункт правил][COLOR=gold]3.05.[/color] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [COLOR=red] | Mute 30 минут[/COLOR][/SPOILER][/CENTER]' +
    '[CENTER][size=15px][font=Georgia][COLOR=lime]Одобрено[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
        prefix: RESHENO_PREFIX,
        status: false,
    },
    {
        title: 'Выдача себя за администратора.',
        content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Рассмотрев ваши доказательства, выношу вердикт - игрок будет наказан по пункту правил, который указан ниже. [/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][SPOILER=Пункт правил][COLOR=gold]3.09.[/color] Запрещена выдача себя за администратора, если таковым не являетесь [COLOR=red] |  Ban 7 - 15 дней + ОЧС администрации [/COLOR][/SPOILER][/CENTER]' +
    '[CENTER][size=15px][font=Georgia][COLOR=lime]Одобрено[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
        prefix: RESHENO_PREFIX,
        status: false,
    },
     {
        title: 'Ввод в забл',
        content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Рассмотрев ваши доказательства, выношу вердикт - игрок будет наказан по пункту правил, который указан ниже. [/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][SPOILER=Пункт правил][COLOR=gold]3.10.[/color] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [COLOR=red] |  Ban 15 - 30 дней / PermBan[/COLOR][/SPOILER][/CENTER]' +
    '[CENTER][size=15px][font=Georgia][COLOR=lime]Одобрено[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
        prefix: RESHENO_PREFIX,
        status: false,
    },
    {
        title: 'Транслит и оффтоп в репорт',
        content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Рассмотрев ваши доказательства, выношу вердикт - игрок будет наказан по пункту правил, который указан ниже. [/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][SPOILER=Пункт правил][COLOR=gold]3.11.[/color] Запрещено подавать репорт написанный транслитом, с сообщением не по теме (Offtop), с включенным Caps Lock и повторять обращение (если ответ был уже дан ранее) [COLOR=red] |  Report Mute 30 минут[/COLOR][/SPOILER][/CENTER]' +
    '[CENTER][size=15px][font=Georgia][COLOR=lime]Одобрено[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
        prefix: RESHENO_PREFIX,
        status: false,
    },
    {
        title: 'Музыка в Voice',
        content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Рассмотрев ваши доказательства, выношу вердикт - игрок будет наказан по пункту правил, который указан ниже. [/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][SPOILER=Пункт правил][COLOR=gold]3.13.[/color] Запрещено включать музыку в Voice Chat [COLOR=red] | Mute 60 минут[/COLOR][/SPOILER][/CENTER]' +
    '[CENTER][size=15px][font=Georgia][COLOR=lime]Одобрено[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
        prefix: RESHENO_PREFIX,
        status: false,
    },
    {
        title: 'Шумы в voice',
        content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Рассмотрев ваши доказательства, выношу вердикт - игрок будет наказан по пункту правил, который указан ниже. [/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][SPOILER=Пункт правил][COLOR=gold]3.14.[/color] Запрещено создавать посторонние шумы или звуки [COLOR=red] | Mute 30 минут[/COLOR][/SPOILER][/CENTER]' +
    '[CENTER][size=15px][font=Georgia][COLOR=lime]Одобрено[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
        prefix: RESHENO_PREFIX,
        status: false,
    },
    {
        title: 'Смена голоса в voice',
        content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Рассмотрев ваши доказательства, выношу вердикт - игрок будет наказан по пункту правил, который указан ниже. [/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][SPOILER=Пункт правил][COLOR=gold]3.17.[/color] Запрещено использование любого софта для изменения голоса [COLOR=red] | Mute 60 минут[/COLOR][/SPOILER][/CENTER]' +
    '[CENTER][size=15px][font=Georgia][COLOR=lime]Одобрено[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
        prefix: RESHENO_PREFIX,
        status: false,
    },
    {
        title: 'Транслит',
        content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Рассмотрев ваши доказательства, выношу вердикт - игрок будет наказан по пункту правил, который указан ниже. [/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][SPOILER=Пункт правил][COLOR=gold]3.18.[/color] Запрещено использование транслита в любом из чатов  [COLOR=red] | Mute 10-180 минут[/COLOR][/SPOILER][/CENTER]' +
    '[CENTER][size=15px][font=Georgia][COLOR=lime]Одобрено[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
        prefix: RESHENO_PREFIX,
        status: false,
    },
    {
        title: 'Мат в VIP чат',
        content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Рассмотрев ваши доказательства, выношу вердикт - игрок будет наказан по пункту правил, который указан ниже. [/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia][SPOILER=Пункт правил][COLOR=gold]3.23.[/color] Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате [COLOR=red] | Mute 30 минут[/COLOR][/SPOILER][/CENTER]' +
    '[CENTER][size=15px][font=Georgia][COLOR=lime]Одобрено[/COLOR], [COLOR=red]закрыто[/COLOR].[/FONT][/SIZE][/CENTER]<br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
        prefix: RESHENO_PREFIX,
        status: false,
    },
      {
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ ᅠᅠRolePlay Биографииᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
      dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid orange; width: 96%; border-radius: 15px;',
	},
      {
        title: 'Одобрено в биографии',
        content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Выношу вердик по вашей биографии - [color=lime]Одобрено[/color].[/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
        prefix: RESHENO_PREFIX,
        status: false,
    },
        {
        title: 'Отказано в биографии',
        content:
    '[CENTER][size=15px][font=Georgia]{{ greeting }}, уважаемый [COLOR=rgb(247, 218, 100)] {{ user.name }}[/color].[/size][/font][/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Выношу вердик по вашей биографии - [color=red]Отказано[/color].[/CENTER]<br><br>' +
    '[CENTER][size=15px][font=Georgia]Приятной игры на сервере [COLOR=lime]Green![/color][/size][/font][/CENTER]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
];

 $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

 // Добавление кнопок при загрузке страницы
        addButton('Одобрить', 'odobrenobio');
        addButton('Отказать', 'otkazrp');
        addButton('На рассмотрение', 'pinn');
        addButton('Рассмотрено', 'watched');
        addButton('Закрыть', 'closed');
        addButton('Выбрать ответ', 'selectAnswer');

    // Поиск информации о теме
    const threadData = getThreadData();

        $('button#pin').click(() => editThreadData(PINN_PREFIX, true));
        $('button#accepted').click(() => editThreadData(ODOBRENOBIO_PREFIX, false));
        $(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true));
        $(`button#watched`).click(() => editThreadData(WATCHED_PREFIX, false));
        $(`button#unaccept`).click(() => editThreadData(OTKAZRP_PREFIX, false));
        $(`button#mainAdmin`).click(() => editThreadData(GA_PREFIX, true));
        $(`button#specialAdmin`).click(() => editThreadData(SPECIAL_PREFIX, true));
        $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));

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
      `<button type="button" class="button rippleButton" id="${id}" style="border-radius: 12px; margin-right: 5px; border: 2px solid #00FF00;">${name}</button>`,
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
    } else  {
        fetch(`${document.URL}edit`, {
          method: 'POST',
          body: getFormData({
            prefix_id: prefix,
            title: threadTitle,
            pin: 1,
                              sticky: 1,
            _xfToken: XF.config.csrf,
            _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
            _xfWithData: 1,
            _xfResponseType: 'json',
          }),
        }).then(() => location.reload());
    }

function moveThread(prefix, type) {
// Получаем заголовок темы, так как он необходим при запросе
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
    }
})();