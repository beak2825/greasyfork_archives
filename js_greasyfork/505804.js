// ==UserScript==
// @name         Script для кураторов форума 
// @namespace    https://forum.blackrussia.online
// @version      1.1
// @description  По вопросам обратная связь в Вк: https://vk.com/pherzq
// @author       Ferz Sheldon
// @match        https://forum.blackrussia.online/*
// @icon         https://forum.blackrussia.online/
// @license      ferz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505804/Script%20%D0%B4%D0%BB%D1%8F%20%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/505804/Script%20%D0%B4%D0%BB%D1%8F%20%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const CLOSE_PREFIX = 7; // Prefix that will be set when thread closes.
const WATCHED_PREFIX = 9;
const TEX_PREFIX = 13;
const buttons = [
         {
 		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                        Раздел жалобы на игроков           ⠀    ⠀   ᅠ ᅠ     ᅠ ᅠ ',
         dpstyle: 'oswald: 3px;     color: white; background: #181513; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #d4ad72; width: 96%',
},
    {
	  title: 'Не найдено в логах',
	  content:
		"[CENTER][COLOR=[size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Данное высказывание не найдено в системе логирования.<br><br>"+
		'[CENTER][color=#f56464]Закрыто[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
      },
      {
        title: 'Игроку будет выдано наказание',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>"+
		"[CENTER]Игроку будет выдано соответствующее наказание.<br><br>"+
		'[B][CENTER][color=#72bd6c]Одобрено[/CENTER]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
      },
          {
    title: 'На рассмотрение',
    content:
    "[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
    "[CENTER]Ваша жалоба взята на рассмотрение, не создавайте дубликатов и ожидайте ответа  от администрации.<br><br>"+
    '[CENTER][color=#f0d841]На рассмотрении[/CENTER]',
    prefix: PIN_PREFIX,
    status: true,
          },
{
 		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                     Отказанные жалобы на игроков   ᅠᅠ ᅠᅠ          ⠀        ⠀  ⠀',
  dpstyle: 'oswald: 3px;     color: white; background: #181513; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #d4ad72; width: 96%',
   },
    {
	  title: 'Не по форме',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Вашa жалобa составленa не по форме, пожалуйста, ознакомьтесь с правилами подачи жалоб.<br><br>"+
		'[CENTER][color=#f56464]Закрыто[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Заголовок не по форме',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Заголовок Вашей жалобы составлен не по форме, пожалуйста, ознакомьтесь с правилами подачи жалоб.<br><br>"+
		'[CENTER][color=#f56464]Закрыто[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Не по теме',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER] Ваше обращение выходит из рамки темы этого раздела. Убедительно просим ознакомиться с назначением данного раздела.<br><br>"+
		'[CENTER][color=#f56464]Закрыто[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Нет нарушений',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Со стороны игрока нет нарушений.<br><br>"+
		'[CENTER][color=#f56464]Закрыто[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
	  title: 'Дубликат',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Вам был дан ответ в прошлой жалобе. При последующем создании копии данной темы - форумный аккаунт будет заблокирован.<br><br>"+
		'[CENTER][color=#f56464]Закрыто[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
    },
  {
    title: 'Ник с ошибками',
    content:
    "[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
    "[CENTER]Ваш никнейм, либо никнейм игрока написан с ошибками.<br><br>"+
    '[CENTER][color=#f56464]Закрыто[/color][/CENTER]',
    prefix: CLOSE_PREFIX,
    status: false,
	},
    {
	  title: 'Уже был наказан',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Нарушитель уже был наказан ранее.<br><br>"+
		'[CENTER][color=#f56464]Закрыто[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
        title: 'Неадекватное поведение',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]В жалобе присутствует неадекватное поведение. Убедительно просим ознакомиться с правилами подачи жалоб.<br><br>"+
		'[CENTER][color=#f56464]Закрыто[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: '2 и более игрока',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Запрещено писать жалобу на 2-х и более игроков.<br>"+
    "[CENTER]Составьте одну жалобу на одного игрока, а другую жалобу на другого игрока.<br><br>"+
		'[CENTER][color=#f56464]Закрыто[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
    },
  {
    title: 'Займ через трейд',
    content:
    "[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
    "[CENTER]Займ может быть осуществлен только через зачисление игровых ценностей на банковский счет.<br><br>"+
    '[CENTER][color=#f56464]Закрыто[/color][/CENTER]',
    prefix: CLOSE_PREFIX,
    status: false,
           },
    {
	  title: 'Доква обрываются',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Доказательства были оборваны, отправьте ещё раз жалобу, но с полной записью.<br><br>"+
		'[CENTER][color=#f56464]Закрыто[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
 },
     {
	  title: 'Нету док-ва',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Отсутствуют доказательства на нарушение игрока, прикрепите их, загрузив на фото/видео хостинг.<br><br>"+
		'[CENTER][color=#f56464]Закрыто[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
        title: 'От 3 лица',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Жалоба составлена от 3-го лица, рассмотрению не подлежит.<br><br>"+
		'[CENTER][color=#f56464]Закрыто[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
  {
	  title: 'Недостаточно док-в',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Недостаточно доказательств на нарушение для принятия решения.<br><br>"+
		'[CENTER][color=#f56464]Закрыто[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Нету условий сделки',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]В ваших доказательствах отсутствуют условия сделки, соответственно рассмотрению не подлежит.<br><br>"+
		'[CENTER][color=#f56464]Закрыто[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
     {
	  title: 'Доква отредакт.',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Доказательства были подвергнуты редактированию - следовательно, рассмотрению не подлежит. <br><br>"+
		'[CENTER][color=#f56464]Закрыто[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
     {
	  title: 'Доква в соц-сети',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Вашa жалобa отказана, так как доказательства, загруженные в соцсети не принимаются. Загрузите док-ва в фото/видео хостинги как YouTube, Imgur, Япикс.<br><br>"+
		'[CENTER][color=#f56464]Закрыто[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Идентичная на рассмотрении',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Идентичная жалоба на данного игрока уже находится на рассмотрении.<br><br>"+
		'[CENTER][color=#f56464]Закрыто[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'Нужен фрапс',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]В данной ситуации нужна видеофиксация.<br><br>"+
		'[CENTER][color=#f56464]Закрыто[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Не работают док-ва',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Ваши доказательства не рабочие или же битая ссылка, пожалуйста, загрузите на видео/фото хостинг.<br><br>"+
		'[CENTER][color=#f56464]Закрыто[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
    },
  {
    title: 'Доступ закрыт',
    content:
    "[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
    "[CENTER]Доступ к доказательствам закрыт.<br><br>"+
    '[CENTER][color=#f56464]Закрыто[/color][/CENTER]',
    prefix: CLOSE_PREFIX,
    status: false,
	},
    {
	  title: 'Возрастные ограничения',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]На доказательства установлены возрастные ограничения, пожалуйста, загрузите видеофиксацию без ограничений. <br><br>"+
		'[CENTER][color=#f56464]Закрыто[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Нету Таймкодов',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Видеофиксация нарушения длится 3-х и более минут, вам следует указать таймкоды.<br><br>"+
		'[CENTER][color=#f56464]Закрыто[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Нету /time',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]На предоставленных доказательствах отсутствует /time, не подлежит рассмотрению.<br><br>"+
		'[CENTER][color=#f56464]Закрыто[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
  {
    title: 'Не видно /time',
    content:
    "[CENTER][SIZE=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
    "[CENTER]На предоставленны доказательствах не видна дата, либо время нарушения.<br><br>"+
    '[CENTER][COLOR=#f56464]Закрыто[/CENTER]',
    prefix: CLOSE_PREFIX,
    status: false,
  },
  {
	  title: 'Не полный фрапс',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Видеофиксация обрывается, загрузите полную видеофиксацию нарушения на видео/фото хостинг, создав новую жалобу.<br><br>"+
		'[CENTER][color=#f56464]Закрыто[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
 {
	  title: 'Прошло 3 дня',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Вы своевременно не оформили жалобу на игрока, с момента совершения нарушения прошло более 72 часов.<br><br>"+
		'[CENTER][color=#f56464]Закрыто[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
      title: 'не показал владельца и уведомл.(семья)',
      content:
      "[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
      "[CENTER]На видеофиксации нарушения Вы должны показать, что являетесь владельцем семьи, а также установленный доступ на склад в уведомлениях семьи.<br><br>"+
      '[CENTER][color=#f56464]Закрыто[/color][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
  {
            title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                Наказания за убийства ᅠᅠ ᅠ          ⠀        ⠀    ⠀ ',
    dpstyle: 'oswald: 3px;     color: #d4ad72; background: #181513; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #d4ad72; width: 96%',
          },
    {
	  title: 'DM',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][color=red]2.19[color=white] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины.[color=red]  | Jail 60 минут<br><br>"+
    "[CENTER][COLOR=red]Примечание:[COLOR=white] разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.<br>"+
		"[CENTER][COLOR=red]Примечание:[COLOR=white] нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.<br><br>"+
		'[B][CENTER][color=#72bd6c]Одобрено[/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Mass DM',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][color=red]2.20[color=white] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более.[color=red]  | Warn / Бан 3-7 дней.<br><br>"+
		'[B][CENTER][color=#72bd6c]Одобрено[/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
        title: 'DB',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][color=red]2.13[color=white] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [color=red] | Jail 60 минут.<br><br>"+
		'[B][CENTER][color=#72bd6c]Одобрено[/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'RK',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][color=red]2.14[color=white] Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти [color=red] | Jail 30 минут.<br><br>"+
		'[B][CENTER][color=#72bd6c]Одобрено[/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'TK',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][color=red]2.15[color=white] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины.[color=red]  | Jail 60 минут / Warn (за два и более убийства)<br><br>"+
		'[B][CENTER][color=#72bd6c]Одобрено[/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'SK',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][color=red]2.16[color=white] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них.[color=red]  | Jail 60 минут / Warn (за два и более убийства)<br><br>"+
		'[B][CENTER][color=#72bd6c]Одобрено[/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
            title: 'PG',
            content:
    "[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][color=red]2.17[color=white] Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь [color=red]  | Jail 30 минут<br><br>"+
		'[B][CENTER][color=#72bd6c]Одобрено[/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Помеха ИП',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][color=red]2.04[color=white] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. [color=red] | Ban 10 дней / Обнуление аккаунта (при повторном нарушении)<br><br>"+
		"[CENTER][COLOR=red]Пример:[COLOR=white] таран дальнобойщиков, инкассаторов под разными предлогами.<br><br>"+
		'[B][CENTER][color=#72bd6c]Одобрено[/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
            title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                 Наказания в чатах(ГКФ/ЗГКФ)               ᅠ⠀            ᅠᅠ',
      dpstyle: 'oswald: 3px;     color: #d4ad72; background: #181513; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #d4ad72; width: 96%',
          },
{
	  title: 'MG',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][color=red]2.18[color=white] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе.[color=red]  | Mute 30 минут.<br><br>"+
    "[CENTER][COLOR=red]Примечание:[COLOR=white] использование смайлов в виде символов «))», «=D» запрещено в IC чате.<br>"+
    "[CENTER][COLOR=red]Примечание:[COLOR=white] телефонное общение также является IC чатом.<br>"+
    "[CENTER][COLOR=red]Исключение:[COLOR=white] за написанный однократно вопросительный «?» или восклицательный «!» знак в IC чате, наказание не выдается.<br><br>"+
		'[B][CENTER][color=#72bd6c]Одобрено[/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
},
    {
	  title: 'КАПС',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][color=red]3.02[color=white] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [color=red]  | Mute 30 минут<br><br>"+
		'[B][CENTER][color=#72bd6c]Одобрено[/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'ОСК',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][color=red]3.03[color=white] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены[color=red]  | Mute 30 минут<br><br>"+
		'[B][CENTER][color=#72bd6c]Одобрено[/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},{
	  title: 'Оск/Упом род',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][color=red]3.04[color=white] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC)  [color=red]  | Mute 120 минут / Ban 7-15 дней.<br><br>"+
    "[CENTER][COLOR=red]Примечание:[COLOR=white] термины «MQ», «rnq» расценивается, как упоминание родных.<br>"+
    "[CENTER][COLOR=red]Исключение:[COLOR=white] если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.<br><br>"+
		'[B][CENTER][color=#72bd6c]Одобрено[/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Оск род в Войс',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][color=red]3.15[color=white] Запрещено оскорблять игроков или родных в Voice Chat[color=red]  | Mute 120 минут / Ban 7 - 15 дней <br><br>"+
		'[B][CENTER][color=#72bd6c]Одобрено[/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Флуд',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][color=red]3.05[color=white] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока[color=red]  | Mute 30 минут<br><br>"+
		'[B][CENTER][color=#72bd6c]Одобрено[/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Угрозы наказаниями',
	  content:
		"[CENTER][size=4] {{ greeting }} уважаемый(-ая), {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][color=red]3.09[color=white] Запрещены любые угрозы о наказании игрока со стороны администрации [color=red]  | Mute 30 минут<br><br>"+
		'[B][CENTER][color=#72bd6c]Одобрено[/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Оскорбление адм',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][color=red]2.54[color=white] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации[color=red]  | Mute 180 минут<br><br>"+
    "[CENTER][COLOR=red]Пример:[COLOR=white] оформление жалобы в игре с текстом: Быстро починил меня, Админы вы задрали уже когда работать будете меня тут ДБшат я 3 жалобы уже подал!!!!!!!!, МОЗГИ ВКЛЮЧИТЕ Я УВОЛЮ ВАС ЩА и т.д. и т.п., а также при взаимодействии с другими игроками.<br>"+
    "[CENTER][COLOR=red]Пример:[COLOR=white] оскорбление администрации в любой чат, включая репорт подлежит наказанию в виде блокировки доступа к использованию всех видов чатов -[COLOR=red Mute 180 минут.<br><br>"+
		'[B][CENTER][[color=#72bd6c]Одобрено[/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Выдача за адм',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][color=red]3.10[color=white] Запрещена выдача себя за администратора, если таковым не являетесь[color=red]  | Ban 7-15 + ЧС администрации.<br><br>"+
		'[B][CENTER][color=#72bd6c]Одобрено[/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Заблуждение (команды) |',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][color=red]3.11[color=white] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами[color=red]  | Ban 15-30 / Permban<br><br>"+
    "[CENTER][COLOR=red]Примечание:[COLOR=white] /me чтобы поднять кошелек введите /pay 228 5000. Для продажи автомобиля введите /sellmycar id 2828 (счёт в банке) цена.<br><br>"+
		'[B][CENTER][color=#72bd6c]Одобрено[/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Музыка в Войс |',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][color=red]3.14[color=white] Запрещено включать музыку в Voice Chat[color=red]  | Mute 60 минут<br><br>"+
		'[B][CENTER][color=#72bd6c]Одобрено[/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Полит./Религиоз. пропаганда |',
	  content:
		"[CENTER][COLOR=lavender][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/size][/COLOR][/CENTER][/B]<br><br>"+
		"[CENTER][COLOR=lavender]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][color=red]3.18[color=lavender] Запрещено политическое и религиозное пропагандирование[color=red]  | Mute 120 минут / Ban 10 дней.<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Транслит |',
	  content:
		"[CENTER][COLOR=lavender][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/size][/COLOR][/CENTER][/B]<br><br>"+
		"[CENTER][COLOR=lavender]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][color=red]3.20[color=lavender] Запрещено использование транслита в любом из чатов[color=red]  | Mute 30 минут<br><br>"+
    "[CENTER][COLOR=red]Пример:[COLOR=lavender] «Privet», «Kak dela», «Narmalna».<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Общение на других яз. |',
	  content:
		"[CENTER][COLOR=lavender][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/size][/COLOR][/CENTER][/B]<br><br>"+
		"[CENTER][COLOR=lavender]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][color=red]3.01[color=lavender] Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке [color=red]  | Устное замечание / Mute 30 минут<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Объявления в госс |',
	  content:
		"[CENTER][COLOR=lavender][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/size][/COLOR][/CENTER][/B]<br><br>"+
		"[CENTER][COLOR=lavender]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][color=red]3.22[color=lavender] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [color=red]  | Mute 30 минут<br><br>"+
    "[CENTER][COLOR=red]Пример:[COLOR=lavender] в помещении центральной больницы писать в чат: Продам эксклюзивную шапку дешево!!!<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
{
	  title: '| ООС угрозы |',
	  content:
		"[CENTER][COLOR=lavender][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/size][/COLOR][/CENTER][/B]<br><br>"+
		"[CENTER][COLOR=lavender]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][color=red]2.37[color=lavender] Запрещены OOC угрозы, в том числе и завуалированные [color=red]  | Mute 120 минут / Ban 7 дней<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Перенос конфликта |',
	  content:
		"[CENTER][COLOR=lavender][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/size][/COLOR][/CENTER][/B]<br><br>"+
		"[CENTER][COLOR=lavender]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][color=red]2.36[color=lavender] Запрещено переносить конфликты из IC в OOC, и наоборот [color=red]  | Warn<br><br>"+
    "[CENTER][COLOR=red]Примечание:[COLOR=lavender] все межфракционные конфликты решаются главными следящими администраторами.<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Редакт в личных цел. |',
	  content:
		"[CENTER][COLOR=lavender][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/size][/COLOR][/CENTER][/B]<br><br>"+
		"[CENTER][COLOR=lavender]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][color=lavender] Запрещено редактировать поданные объявления в личных целях, заменяя текст объявления на несоответствующий отправленному игроком[color=red]  | Ban 7 дней + ЧС организации<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Злоуп. символами |',
	  content:
		"[CENTER][COLOR=lavender][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/size][/COLOR][/CENTER][/B]<br><br>"+
		"[CENTER][COLOR=lavender]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][color=red]3.07[color=lavender] Запрещено злоупотребление знаков препинания и прочих символов[COLOR=red] | Mute 30 минут<br><br>"+
    "[CENTER][COLOR=red]Пример:[COLOR=lavender] «???????», «!!!!!!!», «Дааааааааааааааааааааааа» и так далее.<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
{
	  title: '| Nick_Name оск |',
	  content:
		"[CENTER][COLOR=lavender][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/size][/COLOR][/CENTER][/B]<br><br>"+
		"[CENTER][COLOR=lavender]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][color=red]4.09[color=lavender] Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные)[color=red]  | Устное замечание + смена игрового никнейма / PermBan<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
            title: 'мат в назв. фам/биз',
            content:
    "[CENTER][COLOR=lavender][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/size][/COLOR][/CENTER][/B]<br><br>"+
		"[CENTER][COLOR=lavender]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][color=red]2.53[color=lavender] Запрещено устанавливать названия для внутриигровых ценностей с использованием нецензурной лексики, оскорблений, слов политической или религиозной наклонности.[color=red]  | Ban 1 день / При повторном нарушении обнуление бизнеса<br><br>"+
    "[CENTER][COLOR=red]Примечание:[COLOR=lavender] названия семей, бизнесов, компаний и т.д.<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Шум в войс |',
	  content:
		"[CENTER][COLOR=lavender][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/size][/COLOR][/CENTER][/B]<br><br>"+
		"[CENTER][COLOR=lavender]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][color=red]3.16[color=lavender]  Запрещено создавать посторонние шумы или звуки[color=red]  | Mute 30 минут<br><br>"+
    "[CENTER][COLOR=red]Примечание:[COLOR=lavender] Посторонние звуки на фоне речи, мешающие взаимодействию игроков посредством голосового чата. Сильное искажение звука, исходящее из микрофона плохого качества. Намеренно портить игру другим игрокам (кричать, перебивать)<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: '| Изменение голоса |',
	  content:
		"[CENTER][COLOR=lavender][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/size][/COLOR][/CENTER][/B]<br><br>"+
		"[CENTER][COLOR=lavender]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][color=red]3.19[color=lavender]  Запрещено использование любого софта для изменения голоса[color=red]  | Mute 60 минут<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Мат в вип чат  |',
	  content:
		"[CENTER][COLOR=lavender][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/size][/COLOR][/CENTER][/B]<br><br>"+
		"[CENTER][COLOR=lavender]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][color=red]3.23[color=lavender]  Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате[color=red]  | Mute 30 минут<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Оск секс характера |',
	  content:
		"[CENTER][COLOR=lavender][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/size][/COLOR][/CENTER][/B]<br><br>"+
		"[CENTER][COLOR=lavender]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][color=red]3.07[color=lavender] Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата | Mute 30 минут<br><br>"+
    "[CENTER][COLOR=red]Примечание:[COLOR=lavender] «дырка», «шмара», «ведро», «мадагаскарский присосконог», «свиноногий бандикут», «скорострел» и так далее.<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},

    {
            title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ        Ошибка раздела   ᅠᅠ ᅠᅠ          ⠀                        ',
      dpstyle: 'oswald: 3px;     color: #d4ad72; background: #181513; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #d4ad72; width: 96%',
           },
    {
	  title: 'В ЖБ на АДМ',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Вы ошиблись разделом, обратитесь в раздел жалоб на администрацию. <br><br>"+
		'[CENTER][color=#f56464]Закрыто[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'В ЖБ на ЛД',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Вы ошиблись разделом, обратитесь в раздел жалоб на лидеров. <br><br>"+
		'[CENTER][color=#f56464]Закрыто[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    	{
	  title: 'В ЖБ на хелперов',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Вы ошиблись разделом, обратитесь в раздел жалоб на агентов поддержки. <br><br>"+
		'[CENTER][color=#f56464]Закрыто[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'В ЖБ на сотрудников',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Вы ошиблись разделом, обратитесь в раздел жалоб на сотрудников данной организации. <br><br>"+
		'[CENTER][color=#f56464]Закрыто[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'В ОБЖ',
	  content:
    "[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Вы ошиблись разделом, обратитесь в раздел обжалование. <br><br>"+
		'[CENTER][color=#f56464]Закрыто[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
            title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ            Перенаправление   ᅠᅠ ᅠᅠ          ⠀      ⠀',
      dpstyle: 'oswald: 3px;     color: #d4ad72; background: #181513; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #d4ad72; width: 96%',
           },
    {
	  title: 'Передать Га',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Ваша жалоба была передана [color=red]Главному Администратору[color=white] на рассмотрение.<br><br>"+
		'[CENTER][color=#f0d841]На рассмотрении.[/CENTER]',
	  prefix: GA_PREFIX,
	  status: true,
	},
    	{
	  title: 'Передать Теху',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Ваша жалоба была передана[color=orange] Техническому специалисту[color=white] на рассмотрение.<br><br>"+
		'[CENTER][color=#f0d841]На рассмотрении.[/CENTER]',
	  prefix: TEX_PREFIX,
	  status: true,
	},
    {
	  title: 'Передать ГКФ/ЗГКФ',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Ваша жалоба была передана[color=blue] Главному куратору/Заместителю Главного куратора Форума[color=white] на рассмотрение.<br><br>"+
		'[CENTER][color=#f0d841]На рассмотрении.[/CENTER]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
    {
    title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ            NonRP   ᅠᅠ ᅠᅠ          ⠀     ⠀',
      dpstyle: 'oswald: 3px;     color: #d4ad72; background: #181513; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #d4ad72; width: 96%',
           },
    {
	  title: 'NonRP обман',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][color=red]2.05[color=white] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики[color=red]  | Permban<br><br>"+
    "[CENTER][color=red]Примечание:[color=white] после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.<br>"+
    "[CENTER][COLOR=red]Примечание:[color=white] разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).<br><br>"+
		'[B][CENTER][color=#72bd6c]Одобрено[/color][/CENTER]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    	{
	  title: 'Обман на долг',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][color=red]2.57[color=white] Запрещается брать в долг игровые ценности и не возвращать их | Ban 30 дней / permban[color=red]<br>"+
    "[CENTER][COLOR=red]Примечание:[color=white] займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется;<br>"+
    "[CENTER][COLOR=red]Примечание:[color=white] при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда;<br>"+
    "[CENTER][COLOR=red]Примечание:[color=white] жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами.<br><br>"+
		'[B][CENTER][color=#72bd6c]Одобрено[/color][/CENTER]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
{
	  title: 'NRP поведение',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][color=red]2.01[color=white] Запрещено поведение, нарушающее нормы процессов Role Play режима игры [color=red] | Jail 30 минут.<br><br>"+
    "[CENTER][COLOR=red]Примечание:[color=white] ездить на крышах транспортных средств, бегать или ходить по столам в казино, целенаправленная провокация сотрудников правоохранительных органов с целью развлечения, целенаправленная помеха в проведении различных собеседований и так далее.<br><br>"+
		'[B][CENTER][color=#72bd6c]Одобрено[/color][/CENTER]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
{
	  title: 'NonRP edit',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER]Запрещено редактирование объявлений, не соответствующих ПРО[color=red]  | Mute 30 минут<br>"+
		'[B][CENTER][color=#72bd6c]Одобрено[/color][/CENTER]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'NonRP эфир',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER]Запрещено проведение эфиров, не соответствующих Role Play правилам и логике[color=red]  | Mute 30 минут<br><br>"+
		'[B][CENTER][color=#72bd6c]Одобрено[/color][/CENTER]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'NonRP В/ч',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER]Запрещено нападать на военную часть нарушая Role Play [color=red]  | Warn (для ОПГ) / Jail 30 минут (для Гражданских)<br><br>"+
		'[B][CENTER][color=#72bd6c]Одобрено[/color][/CENTER]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Уход от РП',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][color=red]2.02[color=white] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами[color=red] | Jail 30 минут / Warn <br><br>"+
    "[CENTER][COLOR=red]Примечание:[color=white] уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания или ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснуться Вашего персонажа. Уходить в интерьер или зеленую зону во время перестрелки с целью избежать смерти или уйти от Role Play процесса и так далее.<br><br>"+
		'[B][CENTER][color=#72bd6c]Одобрено[/color][/CENTER]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
     {
	  title: 'NonRP АКС',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][color=red]2.52[color=white] Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера.[color=red]  | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут<br><br>"+
		'[B][CENTER][color=#72bd6c]Одобрено[/color][/CENTER]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
     },
  {
    title: 'nRP drive',
    content:
    "[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
    "[CENTER]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][COLOR=red]2.46. [COLOR=white]Запрещено ездить по полям на любом транспорте[COLOR=red] | Jail 30 минут<br>"+
    "[CENTER][COLOR=red]Исключение:[COLOR=white] разрешено передвижение на кроссовых мотоциклах и внедорожниках.<br><]br>"+
    '[B][CENTER][color=#72bd6c]Одобрено[/color][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
  },
  {
    title: 'nRP drive(Фура/Инкас)',
    content:
    "[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [CENTER]<br>"+
    "[CENTER]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][COLOR=red]2.47.[color=white] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора)[color=red] | Jail 60 минут<br><br>"+
    '[B][CENTER][color=#72bd6c]Одобрено[/color][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
	},
    {
       title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                   Наказания за рекламу   ᅠᅠ ᅠᅠ          ⠀            ⠀',
      dpstyle: 'oswald: 3px;     color: #d4ad72; background: #181513; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #d4ad72; width: 96%',
          },
     {
            title: 'реклама voice',
            content:
    "[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][color=red]3.17[color=white] Запрещена реклама в Voice Chat не связанная с игровым процессом   [color=red] | Ban 7 - 15 дней/<br><br>"+
		'[B][CENTER][color=#72bd6c]Одобрено[/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
            title: 'Реклама промо',
            content:
    "[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][color=red]3.21[color=white] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах.  [color=red] | Ban 30 дней <br><br>"+
    "[CENTER][COLOR=red]Примечание:[color=white] чаты семейные, строительных компаний, транспортных компаний, фракционные чаты, IC, OOC, VIP и так далее.<br>"+
    "[CENTER][COLOR=red]Исключение:[color=white] промокоды, предоставленные разработчиками, а также распространяемые через официальные ресурсы проекта.<br>"+
    "[CENTER][COLOR=red]Пример:[color=white] если игрок упомянет промокод, распространяемый через официальную публичную страницу ВКонтакте либо через официальный Discord в любом из чатов, наказание ему не выдается.<br><br>"+
		'[B][CENTER][color=#72bd6c]Одобрено[/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
            title: 'Системный промо(отказ)',
            content:
    "[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Данный промокод является системным или был выпущен разработчиками.<br><br>"+
		'[B][CENTER][color=#f56464]Закрыто[/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: '| Реклама |',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][color=red]2.31[color=white] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное  [color=red] | Ban 7 дней / PermBan<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#72bd6c]Одобрено[/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
            title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ           Прочее   ᅠᅠ ᅠᅠ          ⠀     ⠀',
      dpstyle: 'oswald: 3px;     color: #d4ad72; background: #181513; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #d4ad72; width: 96%',
           },
    {
	  title: 'Обход системы',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][color=red]2.21[color=white] Запрещено пытаться обходить игровую систему или использовать любые баги сервера [color=red]  | Ban 15-30 дней / Permban (по согласованию с ГА, ЗГА, руководством тех. специалистов)<br><br>"+
    "[CENTER][COLOR=red]Примечание:[color=white] под игровой системой подразумеваются функции и возможности, которые реализованы в игре для взаимодействия между игроками, а также взаимодействия игроков с функциями, у которых есть свое конкретное предназначение.<br>"+
    "[CENTER][COLOR=red]Пример:[color=white] аптечка предназначена для пополнения уровня здоровья, доступна всем игрокам по фиксированной цене в любом магазине. Но она не предназначена для перепродажи по завышенной цене для передачи виртуальной валюты между игроками; Аксессуары предназначены для украшения внешнего вида персонажа, не предназначены для передачи виртуальной валюты между игроками; Банк и личные счета предназначены для передачи денежных средств между игроками; Транспортное средство предназначено для передвижения игроков, не предназначено для передачи денег тем или иным способом, включая обмен с завышенными доплатами.<br><br>"+
		'[B][CENTER][COLOR=#72bd6c]Одобрено[/CENTER]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Слив склада',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][color=red]2.09[color=white] Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [color=red]  | Ban 15-30 дней / Permban<br><br>"+
		'[B][CENTER][COLOR=#72bd6c]Одобрено[/CENTER]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Аморальные действия',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][color=red]2.08[color=white] Запрещена любая форма аморальных действий сексуального характера в сторону игроков [color=red]  | Jail 30 минут / Warn<br><br>"+
    "[CENTER][COLOR=red]Исключение:[color=white] обоюдное согласие обеих сторон.<br><br>"+
		'[B][CENTER][COLOR=#72bd6c]Одобрено[/CENTER]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Читы/Сборка',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][color=red]2.22[color=white] Запрещено хранить / использовать / распространять стороннее программное обеспечение, сборки или любые другие средства, позволяющие получить преимущество над другими игроками[color=red] | Ban 15 - 30 дней / PermBan<br><br>"+
    "[CENTER][color=red]Примечание:[color=white] запрещено внесение любых изменений в оригинальные файлы игры.<br>"+
    "[CENTER][color=red]Исключение:[color=white] разрешено изменение шрифта, его размера и длины чата (кол-во строк).<br>"+
    "[CENTER][color=red]Исключение:[color=white] блокировка за включенный счетчик FPS не выдается.<br><br>"+
		'[B][CENTER][COLOR=#72bd6c]Одобрено[/CENTER]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Арест в казино/аукцион',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER][COLOR=lavender]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][color=red]2.50[color=lavender] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий [color=red]  | Ban 7 - 15 дней + увольнение из организации<br><br>"+
		'[B][CENTER][COLOR=#72bd6c]Одобрено[/CENTER]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'ФЕЙК',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER][COLOR=lavender]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][color=red]4.10[color=white] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию. Пример: подменять букву i на L и так далее, по аналогии. [color=red]  | Устное замечание + смена игрового никнейма / PermBan<br><br>"+
    "[CENTER][color=red]Пример:[color=white] подменять букву i на L и так далее, по аналогии.<br>"+
		'[B][CENTER][COLOR=#72bd6c]Одобрено[/CENTER]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Багоюз аним',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Игрок будет наказан в соответствии с регламентом по следующему пункту:<br>"+
    "[CENTER][color=red]2.55[color=lavender]  Запрещается багоюз связанный с анимацией в любых проявлениях.[color=red] | Jail 60 / 120 минут<br><br>"+
    "[CENTER][COLOR=red]Пример:[color=white] если игрок, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде [color=red]Jail на 120 минут[color=lavender]. Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками.<br>"+
    "[CENTER][COLOR=red]Пример:[color=white] если игрок использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде [color=red]Jail на 60 минут[color=lavender].<br>"+
		'[B][CENTER][COLOR=#72bd6c]Одобрено[/CENTER]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ               RolePlay биографии  ᅠᅠ ᅠᅠ          ⠀           ⠀',
      dpstyle: 'oswald: 3px;     color: #d4ad72; background: #181513; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #d4ad72; width: 96%',
    },
	{
	  title: 'Одобрено',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		'[CENTER]Ваша RolePlay биография одобрена.',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
 	{
	  title: 'Отказано',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Ваша RolePlay биография отказана. Внимательно прочтите правила создания РП биографий, закрепленые в данном разделе.<br><br>"+
		'[CENTER][color=#f56464]Закрыто[/CENTER]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 	{
	  title: 'Не по форме',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Ваша RolePlay биография составлена не по форме. Внимательно прочтите правила создания РП биографий, закрепленые в данном разделе.<br><br>"+
		'[CENTER][color=#f56464]Закрыто[/CENTER]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
  	{
	  title: 'Заголовок не по форме',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Заголовок вашей RolePlay биографии составлен не по форме. Внимательно прочтите правила создания РП биографий, закрепленые в данном разделе.<br><br>"+
		'[CENTER][color=#f56464]Закрыто[/CENTER]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
  	{
	  title: 'Недостаточно инфы',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Ваша RolePlay биография отказана, так как в ней недостаточно информации.<br><br>"+
		'[CENTER][color=#f56464]Закрыто[/CENTER]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 	{
    title: 'Граммат. ошибки',
    content:
    "[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
    "[CENTER]Ваша RolePlay биография отказана, так как в ней допущены грамматические ошибки.<br><br>"+
    '[CENTER][color=#f56464]Закрыто[/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
	  title: 'Не дополнил',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Ваша RolePlay - биография отказана, так как Вы ее не дополнили. Внимательно прочтите правила создания РП биографий, закрепленые в данном разделе.<br><br>"+
		'[CENTER][color=#f56464]Закрыто[/CENTER]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
  	{
	  title: 'От 3-его лица',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Ваша RolePlay - биография отказана, так как она написана от 3-его лица. Внимательно прочтите правила создания РП биографий, закрепленые в данном разделе.<br><br>"+
		'[CENTER][color=#f56464]Закрыто[/CENTER]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Уже одобрена',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Ваша RolePlay - биография отказана, так как она уже была одобрена.<br><br>"+
		'[CENTER][color=#f56464]Закрыто[/CENTER]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Супергерой',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Ваша RolePlay - биография отказана, так как Вы приписали суперспособности своему персонажу.<br><br>"+
		'[CENTER][color=#f56464]Закрыто[/CENTER]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 	{
	  title: 'Копипаст',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Ваша RolePlay - биография украдена / скопирована. Внимательно прочитайте правила создания RolePlay - биографий, закрепленные в данном разделе. <br><br>"+
		'[CENTER][color=#f56464]Закрыто[/CENTER]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 	{
	  title: 'нонрп ник',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]У Вас NonRP NickName. Внимательно прочитайте правила создания RP - биографий, закрепленные в данном разделе. <br><br>"+
		'[CENTER][color=#f56464]Закрыто[/CENTER]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 	{
	  title: 'ник англ',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Ваш NickName должен быть написан на русском языке, как в заголовке, так и в самой теме. Внимательно прочитайте правила создания RP - биографий, закрепленные в данном разделе. <br><br>"+
		'[CENTER][color=#f56464]Закрыто[/CENTER]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Несовпадение возраста и даты',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Дата рождения и возраст Вашего персонажа не совпадают. Внимательно прочитайте правила создания RolePlay - биографий, закрепленные в данном разделе. <br><br>"+
		'[CENTER][color=#f56464]Закрыто[/CENTER]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Семья не полн.',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]В пункте «Семья» недостаточно информации. Внимательно прочитайте правила создания RolePlay - биографий, закрепленные в данном разделе. <br><br>"+
		'[CENTER][color=#f56464]Закрыто[/CENTER]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 	{
	  title: 'Дата рождения не полнос.',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]Ваша дата рождения расписана не полностью. Внимательно прочитайте правила создания RolePlay - биографий, закрепленные в данном разделе. <br><br>"+
		'[CENTER][color=#f56464]Закрыто[/CENTER]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 {
	  title: 'На доработку',
	  content:
		"[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
		"[CENTER]В вашей RolePlay - биографии недостаточно информации. Даю вам 24 часа на ее дополнение / исправление, иначе RolePlay биография будет отказана.<br><br>"+
		'[CENTER][color=#f0d841]На доработке[/CENTER]',
	  prefix: PIN_PREFIX,
	  status: true,
 },
  {
    title: 'Мало инфы в детство',
    content:
    "[CENTER][SIZE=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
    "[CENTER]В пункте «Детство» недостаточно информации.<br><br>"+
    '[CENTER][color=#f56464]Закрыто[/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
    title: 'Мало инфы в юность и взросл. жизнь',
    content:
    "[CENTER][SIZE=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
    "[CENTER]В пункте «Юность и взрослая жизнь» недостаточно информации.<br><br>"+
    '[CENTER][color=#f56464]Закрыто[/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
    title: 'Мало инфы в наст. время',
    content:
    "[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
    "[CENTER]В пункте «Настоящее время» недостаточно информации.<br><br>"+
    '[CENTER][color=#f56464]Закрыто[/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
    title: 'Моложе 18 лет',
    content:
    "[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
    "[CENTER]Ваш игровой персонаж не должен быть моложе 18 лет.<br><br>"+
    '[CENTER][color=#f56464]Закрыто[/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
  },
  {
    title: 'Нету такого города',
    content:
    "[CENTER][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/CENTER]<br><br>"+
    "[CENTER]На игровой карте отсутствует город, который указан в пункте «Место текущего проживания».<br><br>"+
    '[CENTER][color=#f56464]Закрыто[/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
   },
    {
        title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ              RolePlay ситуации  ᅠᅠ ᅠᅠ          ⠀        ⠀',
      dpstyle: 'oswald: 3px;     color: #d4ad72; background: #181513; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #d4ad72; width: 96%',
    },
    	{
	  title: '| Одобрено |',
	  content:
		"[B][CENTER][COLOR=lavender][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/size][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay - ситуация одобрена.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
  	{
	  title: '| Не туда |',
	  content:
		"[B][CENTER][COLOR=lavender][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/size][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - ситуация отказана т.к вы не туда попали. <br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    	{
	  title: '| БАНК СЧЕТ И ТП... |',
	  content:
		"[B][CENTER][COLOR=lavender][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/size][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - ситуация отказана. Оформите ее без добавлений от себя, по типу (Банк счет...) и тд...<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     	{
	  title: '| не по форме |',
	  content:
		"[B][CENTER][COLOR=lavender][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/size][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - ситуация отказана т.к она составлена не по форме. <br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
       	{
	  title: '| отказ |',
	  content:
		"[B][CENTER][COLOR=lavender][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/size][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - ситуация отказана. <br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
  {
	  title: '| На доработке |',
	  content:
		"[B][CENTER][COLOR=lavender][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/size][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]В вашей RolePlay - ситуации недостаточно информации. Даю вам 24 часа на ее дополнение/ исправление, иначе РП ситуация будет отказана.  <br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=yellow][ICODE]На доработке[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
  	{
	  title: '| Неграмотно |',
	  content:
		"[B][CENTER][COLOR=lavender][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/size][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay - ситуация отказана т.к она оформлена неграмотно. <br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 	{
	  title: '| Копипаст |',
	  content:
		"[B][CENTER][COLOR=lavender][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/size][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - ситуация отказана т.к вы ее скопировали у другого человека. Внимательно прочитайте правила создания RP - ситуаций, закрепленные в данном разделе. <br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
  	{
	  title: '| Не дополнил |',
	  content:
		"[B][CENTER][COLOR=lavender][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/size][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay - ситуация отказана т.к вы ее не дополнили. Внимательно прочтите правила создания РП ситуаций, закрепленые в данном разделе.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Супергерой |',
	  content:
		"[B][CENTER][COLOR=lavender][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/size][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - ситуация отказана т.к вы приписали суперспособности своему персонажу. Внимательно прочитайте правила создания RP - ситуаций, закрепленные в данном разделе. <br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 	{
	  title: '| Заголовок не по форме |',
	  content:
		"[B][CENTER][COLOR=lavender][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/size][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Заголовок вашей RolePlay ситуации составлен не по форме. Внимательно прочтите правила создания РП ситуаций, закрепленые в данном разделе.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                       RolePlay организации  ᅠᅠ ᅠᅠ          ⠀        ⠀    ',
      dpstyle: 'oswald: 3px;     color: #d4ad72; background: #181513; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #d4ad72; width: 96%',
    },
    {
	  title: '| Одобрено |',
	  content:
		"[B][CENTER][COLOR=lavender][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/size][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay - организация одобрена.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
  	{
	  title: '| Ошибка раздела |',
	  content:
		"[B][CENTER][COLOR=lavender][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/size][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - организация отказана, так как Вы ошиблись разделом. <br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   	{
	  title: '| не по форме |',
	  content:
		"[B][CENTER][COLOR=lavender][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/size][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - организация отказана т.к она составлена не по форме. <br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: '| На доработке |',
	  content:
		"[B][CENTER][COLOR=lavender][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/size][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]В вашей RolePlay - организации недостаточно информации. Даю вам 24 часа на ее дополнение/ исправление, иначе РП организация  будет отказана.  <br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=yellow][ICODE]На доработке[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
 	{
	  title: '| ник англ |',
	  content:
		"[B][CENTER][COLOR=lavender][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/size][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - организация отказана т.к ваш все никнеймы должны быть написаны на русском языке. Внимательно прочитайте правила создания RP - организаций, закрепленные в данном разделе. <br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
  	{
	  title: '| Неграмотно |',
	  content:
		"[B][CENTER][COLOR=lavender][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/size][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay - организация отказана т.к она оформлена неграмотно. <br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 	{
	  title: '| Копипаст |',
	  content:
		"[B][CENTER][COLOR=lavender][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/size][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - организация отказана т.к вы ее скопировали у другого человека. Внимательно прочитайте правила создания RP - организаций, закрепленные в данном разделе. <br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 	{
	  title: '| Не дополнил |',
	  content:
		"[B][CENTER][COLOR=lavender][size=4] {{ greeting }}, уважаемый(-ая) {{ user.mention }} [/size][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay - организация отказана т.к вы ее не дополнили. Внимательно прочтите правила создания РП организаций, закрепленые в данном разделе.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
     },
];

 $(document).ready(() => {
     // Загрузка скрипта для обработки шаблонов
     $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

     // Добавление кнопок при загрузке страницы
     addButton('Ответы', 'selectAnswer');

     // Поиск информации о теме
     const threadData = getThreadData();

     $('button#pin').click(() => editThreadData(PIN_PREFIX, false));
     $('button#Ga').click(() => editThreadData(GA_PREFIX, false));
     $('button#Spec').click(() => editThreadData(SPECY_PREFIX, false));
     $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, false));
     $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
     $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
     $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));

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
       `<button type="button" class="button rippleButton" id="${id}" style="border-radius: 13px; background: #232529; margin-right: 6px; border: 2px solid #232529;">${name}</button>`,
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
         11 < hours && hours <= 18 ?
         'Добрый день' :
         18 < hours && hours <= 21 ?
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