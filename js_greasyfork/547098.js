// ==UserScript==
// @name         scripts for Куратор Форума Server 28 by Normin
// @namespace    https://forum.blackrussia.online
// @version      1.0
// @description  скрипт для Кураторов Форума Black Russia.
// @author       Bogban Normin
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @collaborator none
// @icon https://i.pinimg.com/originals/1e/39/8d/1e398dff8591edf96ada1b487441ab4b.gif
// @downloadURL https://update.greasyfork.org/scripts/547288/scripts%20for%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20Server%2028%20by%20Normin.user.js
// @updateURL https://update.greasyfork.org/scripts/547288/scripts%20for%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20Server%2028%20by%20Normin.meta.js
// ==/UserScript==

(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7; // Prefix that will be set when thread closes.
const TEX_PREFIX = 13;
const GA_PREFIX = 12;
const V_PREFIX = 1;
const buttons = [
    {
      title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - жалобы - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
  {
      title: 'на рассмотрении',
      content:
       '[FONT=Verdana]Приветствую.<br><br>'+
      'На рассмотрении.<br><br>'+
            '[HR][/HR]<br><br>'+
               '[center]Приятной игры на [COLOR=rgb(147, 112, 216)]Samara.[/COLOR]<br><br><br>',
      status: false,
      prefix: PIN_PREFIX,
    },
 {
      title: 'блокировка оск родных',
      content:
      '[FONT=Verdana]Приветствую.<br><br>'+
    'Игроку будет выдано наказание, по причине <br><br>'+
   '[COLOR=rgb(255, 17, 17)]3.04.[/COLOR] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [COLOR=rgb(255, 17, 17)]| Mute 120 минут / Ban 7 - 15 дней.[/COLOR] <br><br>'+
 'Закрыто.<br><br>'+
            '[HR][/HR]<br><br>'+
               '[center]Приятной игры на [COLOR=rgb(147, 112, 216)]Samara.[/COLOR]<br><br><br>',
      status: false,
      prefix: ACCEPT_PREFIX,
    },
    {
      title: 'DM',
      content:
         '[FONT=Verdana]Приветствую.<br><br>'+
          '[SIZE=4][FONT=verdana][COLOR=rgb(255, 255, 255)]Игроку будет выдано наказание, по причине <br><br>'+
        '[FONT=verdana][COLOR=rgb(255, 17, 17)]2.19.[/COLOR][COLOR=rgb(255, 255, 255)] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [/COLOR][COLOR=rgb(255, 17, 17)]| [COLOR=rgb(255, 17, 17)]Jail 60 минут.[/COLOR] [/COLOR][/COLOR] <br><br>'+
   '[FONT=verdana][COLOR=rgb(255, 17, 17)]Примечание: [/COLOR]разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил. <br>'+
'[COLOR=rgb(255, 17, 17)][FONT=verdana]Примечание:[/FONT][/COLOR][FONT=verdana] нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/FONT][/FONT]<br><br>'+
        'Закрыто.<br><br>'+
            '[HR][/HR]<br><br>'+
               '[center]Приятной игры на [COLOR=rgb(147, 112, 216)]Samara.[/COLOR]<br><br><br>',
        status: false,
          prefix: ACCEPT_PREFIX,
    },

     {
      title: 'тайм - коды',
      content:
          '[FONT=Verdana]Приветствую.<br><br>'+
 '[FONT=verdana]В вашей жалобе нет таймкодов.<br><br>'+
'Напишите тайм - коды в течение 24-х часов.[/FONT]<br><br>'+
            '[HR][/HR]<br><br>'+
               '[center]Приятной игры на [COLOR=rgb(147, 112, 216)]Samara.[/COLOR]<br><br><br>',
         status: false,
        prefix: PIN_PREFIX,
    },
     {
      title: 'читы',
      content:
          '[FONT=Verdana]Приветствую.<br><br>'+
    'Игроку будет выдано наказание, по причине <br><br>'+
  '[COLOR=rgb(255, 17, 17)]2.22.[/COLOR][COLOR=rgb(255, 255, 255)] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [/COLOR][COLOR=rgb(255, 17, 17)]| Ban 15 - 30 / Permban.[/COLOR] <br><br>'+
'[COLOR=rgb(255, 17, 17)]Примечание:[/COLOR] запрещено внесение любых изменений в оригинальные файлы игры.<br>'+
'[COLOR=rgb(255, 17, 17)]Исключения: [/COLOR] разрешено изменение шрифта, его размера и длины чата (кол-во строк).<br>'+
'[COLOR=rgb(255, 17, 17)]Исключения: [/COLOR] блокировка за включенный счетчик FPS не выдается.<br><br>'+
 '[FONT=verdana][COLOR=rgb(255, 255, 255)]Закрыто.[/FONT] <br><br>'+
            '[HR][/HR]<br><br>'+
               '[center]Приятной игры на [COLOR=rgb(147, 112, 216)]Samara.[/COLOR]<br><br><br>',
      status: false,
      prefix: ACCEPT_PREFIX,
    },
        {
      title: 'nRP обман',
      content:
             '[FONT=Verdana]Приветствую.<br><br>'+
             '[FONT=verdana]Игроку будет выдано наказание, по причине <br><br>'+
            '[FONT=verdana][COLOR=rgb(255, 17, 17)]2.05.[/COLOR][COLOR=rgb(255, 255, 255)]  Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [/COLOR][COLOR=rgb(255, 17, 17)]| Permban.[/color] <br><br>'+
'[COLOR=rgb(255, 17, 17)][FONT=verdana]Примечание:[/FONT][/COLOR] после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.<br>'+
'[COLOR=rgb(255, 17, 17)][FONT=verdana]Примечание:[/FONT][/COLOR] разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).<br><br>'+
                 'Закрыто.<br><br>'+
            '[HR][/HR]<br><br>'+
               '[center]Приятной игры на [COLOR=rgb(147, 112, 216)]Samara.[/COLOR]<br><br><br>',
      status: false,
      prefix: ACCEPT_PREFIX,
    },
      {
      title: 'caps',
      content:
           '[FONT=Verdana]Приветствую.<br><br>'+
       '[FONT=Verdana]Игроку будет выдано наказание, по причине<br><br>'+
      '[COLOR=rgb(255, 17, 17)]3.02.[/color] Запрещено использование верхнего регистра (Caps Lock) при написании любого текста в любом чате[COLOR=rgb(255, 17, 17)] | Mute 30 минут.[/color]<br><br>' +
     '[COLOR=rgb(255, 17, 17)]Прмер:[/color] "ПрОдАм", "куплю МАШИНУ".<br><br>'+
          'Закрыто.<br><br>'+
            '[HR][/HR]<br><br>'+
               '[center]Приятной игры на [COLOR=rgb(147, 112, 216)]Samara.[/COLOR]<br><br><br>',
      status: false,
      prefix: ACCEPT_PREFIX,
    },
       {
      title: 'выдача адм',
      content:
            '[FONT=Verdana]Приветствую.<br><br>'+
       '[FONT=Verdana]Игроку будет выдано наказание, по причине<br><br>'+
      '[COLOR=rgb(255, 17, 17)]3.10.[/color] Запрещена выдача себя за администратора, если таковым не являетесь[COLOR=rgb(255, 17, 17)] | Ban 7 - 15 + ЧС администрации[/color]<br><br>' +
       'Закрыто.<br><br>'+
            '[HR][/HR]<br><br>'+
               '[center]Приятной игры на [COLOR=rgb(147, 112, 216)]Samara.[/COLOR]<br><br><br>',
      status: false,
      prefix: ACCEPT_PREFIX,
    },
       {
      title: 'mass DM',
      content:
            '[FONT=Verdana]Приветствую.<br><br>'+
       '[FONT=Verdana]Игроку будет выдано наказание, по причине<br><br>'+
      '[COLOR=rgb(255, 17, 17)]2.20.[/color] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более[COLOR=rgb(255, 17, 17)] | Warn / Ban 3 - 7 дней [/color]<br><br>' +
        'Закрыто.<br><br>'+
            '[HR][/HR]<br><br>'+
               '[center]Приятной игры на [COLOR=rgb(147, 112, 216)]Samara.[/COLOR]<br><br><br>',
      status: false,
      prefix: ACCEPT_PREFIX,
    },
     {
      title: 'аморал',
      content:
          '[FONT=Verdana]Приветствую.<br><br>'+
       '[FONT=Verdana]Игроку будет выдано наказание, по причине<br><br>'+
      '[COLOR=rgb(255, 17, 17)] 2.08.[/color] Запрещена любая форма аморальных действий сексуального характера в сторону игроков[COLOR=rgb(255, 17, 17)] | Jail 30 минут / Warn[/color]<br><br>' +
        '[COLOR=rgb(255, 17, 17)] Исключение:[/color] обоюдное согласие обеих сторон.<br><br>'+
        'Закрыто.<br><br>'+
            '[HR][/HR]<br><br>'+
               '[center]Приятной игры на [COLOR=rgb(147, 112, 216)]Samara.[/COLOR]<br><br><br>',
      status: false,
      prefix: ACCEPT_PREFIX,
    },
         {
      title: 'DB',
      content:
              '[FONT=Verdana]Приветствую.<br><br>'+
       '[FONT=Verdana]Игроку будет выдано наказание, по причине<br><br>'+
      '[COLOR=rgb(255, 17, 17)]2.13. [/color] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта[COLOR=rgb(255, 17, 17)] | Jail 60 минут [/color]<br><br>' +
             'Закрыто.<br><br>'+
            '[HR][/HR]<br><br>'+
               '[center]Приятной игры на [COLOR=rgb(147, 112, 216)]Samara.[/COLOR]<br><br><br>',
      status: false,
      prefix: ACCEPT_PREFIX,
    },
        {
      title: 'TK',
      content:
             '[FONT=Verdana]Приветствую.<br><br>'+
       '[FONT=Verdana]Игроку будет выдано наказание, по причине<br><br>'+
      '[COLOR=rgb(255, 17, 17)]2.15. [/color]Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины[COLOR=rgb(255, 17, 17)] | Jail 60 минут / Warn ( за дав и более убийств ) [/color]<br><br>' +
           'Закрыто.<br><br>'+
            '[HR][/HR]<br><br>'+
               '[center]Приятной игры на [COLOR=rgb(147, 112, 216)]Samara.[/COLOR]<br><br><br>',
      status: false,
      prefix: ACCEPT_PREFIX,
    },
        {
      title: 'MG',
      content:
             '[FONT=Verdana]Приветствую.<br><br>'+
            '[FONT=Verdana]Игроку будет выдано наказание, по причине<br><br>'+
              '[COLOR=rgb(255, 17, 17)]2.18.[/color] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе[COLOR=rgb(255, 17, 17)] | Mute 30 минут [/color]<br><br>'+
  '[COLOR=rgb(255, 17, 17)]Примечание:[/color] использование смайлов в виде символов «))», «=D» запрещено в IC чате.<br>'+
  '[COLOR=rgb(255, 17, 17)]Примечание:[/color] телефонное общение также является IC чатом.<br>'+
  '[COLOR=rgb(255, 17, 17)]Исключение:[/color] за написанный однократно вопросительный «?» или восклицательный «!» знак в IC чате, наказание не выдается.<br><br>'+
          'Закрыто.<br><br>'+
            '[HR][/HR]<br><br>'+
               '[center]Приятной игры на [COLOR=rgb(147, 112, 216)]Samara.[/COLOR]<br><br><br>',
      status: false,
      prefix: ACCEPT_PREFIX,
    },
          {
      title: 'SK',
      content:
             '[FONT=Verdana]Приветствую.<br><br>'+
            '[FONT=Verdana]Игроку будет выдано наказание, по причине<br><br>'+
   '[COLOR=rgb(255, 17, 17)]2.16.[/color] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [COLOR=rgb(255, 17, 17)]| Jail 60 минут / Warn (за два и более убийства).[/color]<br><br>'+
             'Закрыто.<br><br>'+
            '[HR][/HR]<br><br>'+
               '[center]Приятной игры на [COLOR=rgb(147, 112, 216)]Samara.[/COLOR]<br><br><br>',
      status: false,
      prefix: ACCEPT_PREFIX,
    },
    {
        title: 'помеха игровому процессу',
        content:
        '[font=verdana] Приветствую.<br><br>'+
            'Игроку будет выдано наказание, по причине<br><br>'+
        '[COLOR=rgb(255, 17, 17)]2.04. [/color]Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы.[COLOR=rgb(255, 17, 17)] | Ban 10 дней / Обнуление аккаунта (при повторном нарушении). [/color] <br><br>'+
'[COLOR=rgb(255, 17, 17)]Пример:[/color] таран дальнобойщиков, инкассаторов под разными предлогами.<br><br>'+
       'Закрыто.<br><br>'+
            '[HR][/HR]<br><br>'+
               '[center]Приятной игры на [COLOR=rgb(147, 112, 216)]Samara.[/COLOR]<br><br><br>',
          status: false,
      prefix: ACCEPT_PREFIX,
    },
       {
        title: 'слив склада',
        content:
        '[font=verdana] Приветствую.<br><br>'+
            'Игроку будет выдано наказание, по причине<br><br>'+
        '[COLOR=rgb(255, 17, 17)]2.09.[/color] Запрещено сливать склад фракции / семьи путем взятия большого количества ресурсов или превышая допустимый лимит, установленный лидером[COLOR=rgb(255, 17, 17)] | Ban 15 - 30 дней / PermBan.[/color]<br><br>'+
'[COLOR=rgb(255, 17, 17)]Примечание:[/color] в описании семьи должны быть указаны условия взаимодействия со складом. Если лидер семьи предоставил неограниченный доступ к складу и забыл снять его, администрация не несет ответственности за возможные последствия. Жалобы по данному пункту правил принимаются только от лидера семьи.<br>'+
'[COLOR=rgb(255, 17, 17)]Примечание:[/color] исключение всех или части игроков из состава семьи без ведома лидера также считается сливом.<br><br>'+
          'Закрыто.<br><br>'+
            '[HR][/HR]<br><br>'+
               '[center]Приятной игры на [COLOR=rgb(147, 112, 216)]Samara.[/COLOR]<br><br><br>',
          status: false,
      prefix: ACCEPT_PREFIX,
    },
        {
      title: 'nRP поведение',
      content:
             '[FONT=Verdana]Приветствую.<br><br>'+
            '[FONT=Verdana]Игроку будет выдано наказание, по причине<br><br>'+
            '[COLOR=rgb(255, 17, 17)] 2.01.[/color] Запрещено поведение, нарушающее нормы процессов Role Play режима игры [COLOR=rgb(255, 17, 17)]| Jail 30 минут.[/color] <br><br>'+
 '[COLOR=rgb(255, 17, 17)] Примечание:[/color] ездить на крышах транспортных средств, бегать или ходить по столам в казино, целенаправленная провокация сотрудников правоохранительных органов с целью развлечения, целенаправленная помеха в проведении различных собеседований и так далее.<br><br>'+
           'Закрыто.<br><br>'+
            '[HR][/HR]<br><br>'+
               '[center]Приятной игры на [COLOR=rgb(147, 112, 216)]Samara.[/COLOR]<br><br><br>',
      status: false,
      prefix: ACCEPT_PREFIX,
    },
      {
      title: 'nRP drive',
      content:
             '[FONT=Verdana]Приветствую.<br><br>'+
            '[FONT=Verdana]Игроку будет выдано наказание, по причине<br><br>'+
    '[COLOR=rgb(255, 17, 17)] 2.03. [/color]Запрещён NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [COLOR=rgb(255, 17, 17)] | Jail 30 минут.[/color]<br><br>'+
 '[COLOR=rgb(255, 17, 17)]Примечание: [/color]нарушением считаются такие действия, как езда на скутере по горам, намеренное создание аварийных ситуаций при передвижении. Передвижение по полям на любом транспорте, за исключением кроссовых мотоциклов и внедорожников.<br><br>'+
         'Закрыто.<br><br>'+
            '[HR][/HR]<br><br>'+
               '[center]Приятной игры на [COLOR=rgb(147, 112, 216)]Samara.[/COLOR]<br><br><br>',
      prefix: ACCEPT_PREFIX,
          status: false,
    },
             {
      title:'- - - - - - - - - - - - - - - - - - - - - - - - - - - - - отказ жалоб - - - - - - - - - - - - - - - - - - - - - - - - - - - - -'
             },
                    {
      title: 'отказ | ответ ранее',
      content:
     '[FONT=Verdana]Приветствую.<br><br>'+
        'Ответ был дан ранее.<br><br>'+
   'Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.<br><br>'+
       'Закрыто.<br><br>'+
            '[HR][/HR]<br><br>'+
               '[center]Приятной игры на [COLOR=rgb(147, 112, 216)]Samara.[/COLOR]<br><br><br>',
    prefix:UNACCEPT_PREFIX ,
	  status: false,
    },
                {
      title: 'отказ | не по форме',
      content:
     '[FONT=Verdana]Приветствую.<br><br>'+
        'Ваша жалоба составлена не по форме.<br><br>'+
    'Ниже указана форма, на подачу жалобы.<br><br>'+
                    '[hr][/hr]<br><br>'+
                    '[center]1. Ваш Nick Name : <br>'+
                    '2. Nick Name игрока : <br>'+
                    '3. Суть жалобы : <br>'+
                    '4. Доказательства : [/center]<br><br>'+
                    '[hr][/hr]<br><br>'+
       'Закрыто.<br><br>'+
            '[HR][/HR]<br><br>'+
               '[center]Приятной игры на [COLOR=rgb(147, 112, 216)]Samara.[/COLOR]<br><br><br>',
    prefix:UNACCEPT_PREFIX ,
	  status: false,
    },
                {
      title: 'отказ | условия',
      content:
     '[FONT=Verdana]Приветствую.<br><br>'+
        'На вашем доказательстве, отсутствует условия сделки.<br><br>'+
    'Внимательно ознакомьтесь с правилами совершение сделки.<br><br>'+
       'Закрыто.<br><br>'+
            '[HR][/HR]<br><br>'+
               '[center]Приятной игры на [COLOR=rgb(147, 112, 216)]Samara.[/COLOR]<br><br><br>',
    prefix:UNACCEPT_PREFIX ,
	  status: false,
    },
            {
      title: 'отказ | time',
      content:
     '[FONT=Verdana]Приветствую.<br><br>'+
        'При детальном рассмотрении вашей жалобы, мы не обнаружили /time.<br><br>'+
    'Внимательно ознакомьтесь с правилами написания жалоб.<br><br>'+
       'Закрыто.<br><br>'+
            '[HR][/HR]<br><br>'+
               '[center]Приятной игры на [COLOR=rgb(147, 112, 216)]Samara.[/COLOR]<br><br><br>',
    prefix:UNACCEPT_PREFIX ,
	  status: false,
    },
                {
      title: 'отказ | недостаточно док - ва ( скрин )',
      content:
     '[FONT=Verdana]Приветствую.<br><br>'+
        'Для корректного рассмотрении вашей жалобы, нужна видеофиксация.<br><br>'+
    'Внимательно ознакомьтесь с правилами написания жалоб.<br><br>'+
       'Закрыто.<br><br>'+
            '[HR][/HR]<br><br>'+
               '[center]Приятной игры на [COLOR=rgb(147, 112, 216)]Samara.[/COLOR]<br><br><br>',
    prefix:UNACCEPT_PREFIX ,
	  status: false,
    },
            {
      title: 'отказ | заголовок',
      content:
     '[FONT=Verdana]Приветствую.<br><br>'+
        'Ваша жалоба не может быть рассмотрена, так как в заголовке содержат оскорбительные высказывания, либо заголовок составлен не по форме.<br><br>'+
    'Внимательно ознакомьтесь с правилами написания жалоб, и их заголовка.<br><br>'+
       'Закрыто.<br><br>'+
            '[HR][/HR]<br><br>'+
               '[center]Приятной игры на [COLOR=rgb(147, 112, 216)]Samara.[/COLOR]<br><br><br>',
    prefix:UNACCEPT_PREFIX ,
	  status: false,
    },
        {
      title: 'отказ | ответный дм',
      content:
     '[FONT=Verdana]Приветствую.<br><br>'+
        'При детальном рассмотрении вашей видеофиксации, первым огонь открыли именно Вы в сторону игрока.<br><br>'+
    'Действия других игроков в данном случае, является ответной стрельбой и самообороной, а не нарушением правил.<br><br>'+
       'Закрыто.<br><br>'+
            '[HR][/HR]<br><br>'+
               '[center]Приятной игры на [COLOR=rgb(147, 112, 216)]Samara.[/COLOR]<br><br><br>',
	  status: false,
          prefix: UNACCEPT_PREFIX,
    },
    {
      title: 'отказ | не тот сервер',
      content:
     '[FONT=Verdana]Приветствую.<br><br>'+
        'Вы ошиблись сервером.<br><br>'+
    'Подайте жалобу, на соответствующем сервере.<br><br>'+
       'Закрыто.<br><br>'+
            '[HR][/HR]<br><br>'+
               '[center]Приятной игры на [COLOR=rgb(147, 112, 216)]Samara.[/COLOR]<br><br><br>',
	  status: false,
          prefix: UNACCEPT_PREFIX,
    },
     {
      title: 'отказ | рассинхрон',
      content:
     '[FONT=Verdana]Приветствую.<br><br>'+
        '[FONT=verdana]Мы детально изучили вашу жалобу, а так же доказательства.<br><br>'+
    ' В вашем случае, возможен рассинхрон.<br><br>'+
         '[FONT=verdana]Закрыто.<br><br>'+
            '[HR][/HR]<br><br>'+
               '[center]Приятной игры на [COLOR=rgb(147, 112, 216)]Samara.[/COLOR]<br><br><br>',
	  status: false,
          prefix: UNACCEPT_PREFIX,
    },
    {
      title: 'отказ | не работают док - ва',
      content:
     '[FONT=Verdana]Приветствую.<br><br>'+
        '[FONT=verdana]В вашей жалобе, не работают доказательства.<br><br>'+
    ' Попробуйте загрузить их на другой фотохостинг, либо загрузите их еще раз.<br><br>'+
       'Закрыто.<br><br>'+
            '[HR][/HR]<br><br>'+
               '[center]Приятной игры на [COLOR=rgb(147, 112, 216)]Samara.[/COLOR]<br><br><br>',
	  status: false,
          prefix: UNACCEPT_PREFIX,
    },
     {
      title: 'отказ | недостаточно док - ва',
      content:
      '[FONT=Verdana]Приветствую.<br><br>'+
 '[FONT=verdana]Недостаточно доказательств для корректного рассмотрения вашей жалобы.<br><br>'+
     '[FONT=verdana] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.<br><br>'+
       '[FONT=verdana]Закрыто.<br><br>'+
            '[HR][/HR]<br><br>'+
               '[center]Приятной игры на [COLOR=rgb(147, 112, 216)]Samara.[/COLOR]<br><br><br>',
        status: false,
          prefix: UNACCEPT_PREFIX,
    },
        {
      title: 'отказ | нет док - ва',
      content:
           '[FONT=Verdana]Приветствую.<br><br>'+
 '[FONT=verdana]Отсутствуют доказательства - следовательно, рассмотрению не подлежит. Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.<br><br>'+
'[FONT=verdana]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.<br><br>'+
          '[FONT=verdana]Закрыто.<br><br>'+
            '[HR][/HR]<br><br>'+
               '[center]Приятной игры на [COLOR=rgb(147, 112, 216)]Samara.[/COLOR]<br><br><br>',
        status: false,
          prefix: UNACCEPT_PREFIX,
    },
      {
title:'отказ | док - ва в соц. сетях',
        content:
          '[font=verdana]Приветствую.<br><br>'+
        'Доказательства, предоставленные в социальных сетях, не рассматриваем.<br>'+
        'Просьба загрузить доказательства на любой фотохостинг.<br><br>'+
         'Закрыто.<br><br>'+
            '[HR][/HR]<br><br>'+
               '[center]Приятной игры на [COLOR=rgb(147, 112, 216)]Samara.[/COLOR]<br><br><br>',
           status: false,
          prefix: UNACCEPT_PREFIX,
    },
        {
title:'отказ | 72 часа',
        content:
         '[FONT=Verdana]Приветствую.<br><br>'+
         '[font=verdana]С момента нарушения, прошло более 72 часов.<br><br>'+
          'Закрыто.<br><br>'+
            '[HR][/HR]<br><br>'+
               '[center]Приятной игры на [COLOR=rgb(147, 112, 216)]Samara.[/COLOR]<br><br><br>',
           status: false,
          prefix: UNACCEPT_PREFIX,
    },
     {
      title: 'отказ | нарушений не замечено',
      content:
      '[FONT=Verdana]Приветствую.<br><br>'+
'Нарушений не замечено.<br><br>'+
              'Закрыто. <br><br>'+
           '[HR][/HR]<br><br>'+
               '[center]Приятной игры на [COLOR=rgb(147, 112, 216)]Samara.[/COLOR]<br><br><br>',
      status: false,
      prefix: UNACCEPT_PREFIX,
    },
    {
        title:'- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  Переадресация жалоб - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  ',
    } ,
    {
title:'Передано ГА',
        content:
        '[font=verdana]Приветствую.<br><br>'+
        'Ваша жалоба переадресована, Главному Администратору.<br><br>'+
        '[HR][/HR]<br><br>'+
               '[center]Приятной игры на [COLOR=rgb(147, 112, 216)]Samara.[/COLOR]<br><br>',
                status: false,
        prefix: GA_PREFIX,
    },
    {
title:'передано ТС',
        content:
           '[font=verdana]Приветствую.<br><br>'+
        'Ваша жалоба переадресована, Техническому специалисту.<br><br>'+
         '[HR][/HR]<br><br>'+
               '[center]Приятной игры на [COLOR=rgb(147, 112, 216)]Samara.[/COLOR]<br><br>',
           status: false,
          prefix: TEX_PREFIX,
    },
    {
title:'передано ГКФ',
        content:
            '[font=verdana]Приветствую.<br><br>'+
        'Ваша жалоба переадресована, Главному Куратору за Форумом.<br><br>'+
         '[HR][/HR]<br><br>'+
               '[center]Приятной игры на [COLOR=rgb(147, 112, 216)]Samara.[/COLOR]<br><br>',
           status: false,
          prefix: PIN_PREFIX,
    },
    {
title:'жалоба на адм',
        content:
         '[font=verdana]Приветствую.<br><br>'+
         'Обратитесь в раздел жалоб на Администрацию.[U]https://forum.blackrussia.online/forums/Жалобы-на-администрацию.1318/[/U] <br><br>'+
  '[HR][/HR]<br><br>'+
               '[center]Приятной игры на [COLOR=rgb(147, 112, 216)]Samara.[/COLOR]<br><br>',
           status: false,
          prefix: CLOSE_PREFIX,
    },
      {
title:'жалоба на сотрудников',
        content:
        '[font=verdana]Приветствую.<br><br>'+
        'Обратитесь в раздел жалоб на сотрудников данной организации.<br><br>'+
        'Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.<br><br>'+
          '[HR][/HR]<br><br>'+
               '[center]Приятной игры на [COLOR=rgb(147, 112, 216)]Samara.[/COLOR]<br><br>',
           status: false,
          prefix: CLOSE_PREFIX,
    },
    {
        title: 'жалоба на лидеров',
        content:
          '[font=verdana]Приветствую.<br><br>'+
        'Обратитесь в раздел жалоб на Лидеров.[U]https://forum.blackrussia.online/forums/Жалобы-на-лидеров.1319/[/U]<br><br>'+
  '[HR][/HR]<br><br>'+
               '[center]Приятной игры на [COLOR=rgb(147, 112, 216)]Samara.[/COLOR]<br><br>',
         status: false,
          prefix: CLOSE_PREFIX,
    },
    {
        title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - RolePlay Биографии - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  ',
    },
      {
        title: 'одобрено',
        content:
            '[font=verdana]Приветствую.<br><br>'+
          '[font=verdana]Ваша RolePlay Биография, была детально проверена. <br><br>'+
         'И получает статус Одобрено.<br><br>'+
            '[HR][/HR]<br><br>'+
               '[center]Приятной игры на [COLOR=rgb(147, 112, 216)]Samara.[/COLOR]<br><br>',
         status: false,
          prefix: ACCEPT_PREFIX,
    },
         {
        title: 'отказ | копипаст',
        content:
               '[font=verdana]Приветствую.<br><br>'+
          '[font=verdana]Ваша RolePlay Биография, была детально проверена. <br><br>'+
         'И получает статус Отказано, так как она скопирована.<br><br>'+
             'Внимательно изучите правила написание RolePlay Биографии, в данном разделе<br><br>'+
              '[HR][/HR]<br><br>'+
               '[center]Приятной игры на [COLOR=rgb(147, 112, 216)]Samara.[/COLOR]<br><br>',
         status: false,
          prefix: UNACCEPT_PREFIX,
    },
          {
        title: 'отказ | 3 лицо',
        content:
               '[font=verdana]Приветствую.<br><br>'+
          '[font=verdana]Ваша RolePlay Биография, была детально проверена. <br><br>'+
         'И получает статус Отказано, так как она написана от 3 - его лица.<br><br>'+
             'Внимательно изучите правила написание RolePlay Биографии, в данном разделе.<br><br>'+
               '[HR][/HR]<br><br>'+
               '[center]Приятной игры на [COLOR=rgb(147, 112, 216)]Samara.[/COLOR]<br><br>',
         status: false,
          prefix:UNACCEPT_PREFIX,
    },
            {
        title: 'отказ | заголовок',
        content:
                  '[font=verdana]Приветствую.<br><br>'+
          '[font=verdana] Ваша RolePlay Биография, была детально проверена. <br><br>'+
         'И получает статус Отказано, так как заголовок составлен не по форме.<br><br>'+
             'Внимательно изучите правила написание RolePlay Биографии, в данном разделе.<br><br>'+
             '[HR][/HR]<br><br>'+
               '[center]Приятной игры на [COLOR=rgb(147, 112, 216)]Samara.[/COLOR]<br><br>',
         status: false,
          prefix:UNACCEPT_PREFIX,
    },
             {
        title: 'отказ | мало информации',
        content:
                   '[font=verdana]Приветствую.<br><br>'+
          '[font=verdana] Ваша RolePlay Биография, была детально проверена. <br><br>'+
         'И получает статус Отказано, так как в ней мало информации, в таких разделах как: -.  <br><br>'+
                 'У вас имеется 24 часа, для дополнения.<br><br>'+
              '[HR][/HR]<br><br>'+
               '[center]Приятной игры на [COLOR=rgb(147, 112, 216)]Samara.[/COLOR]<br><br>',
         status: true,
          prefix: PIN_PREFIX,
    },
             {
        title: 'отказ | не по форме',
        content:
                   '[font=verdana]Приветствую.<br><br>'+
          '[font=verdana] Ваша RolePlay Биография, была детально проверена. <br><br>'+
         'И получает статус Отказано, так как она составлена не по форме.<br><br>'+
             'Внимательно изучите правила написание RolePlay Биографии, в данном разделе.<br><br>'+
          '[HR][/HR]<br><br>'+
               '[center]Приятной игры на [COLOR=rgb(147, 112, 216)]Samara.[/COLOR]<br><br>',
         status: false,
          prefix: UNACCEPT_PREFIX,
    },
             {
        title: 'отказ | неграмотно',
        content:
                   '[font=verdana]Приветствую.<br><br>'+
          '[font=verdana] Ваша RolePlay Биография, была детально проверена. <br><br>'+
         'И получает статус Отказано, так как в ней имеются граматические ошибки, у вас имеется 24 часа, для исправление.<br><br>'+
                 '[HR][/HR]<br><br>'+
               '[center]Приятной игры на [COLOR=rgb(147, 112, 216)]Samara.[/COLOR]<br><br>',
         status: true,
          prefix: PIN_PREFIX,
    },
  ];
$(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');


    // Добавление кнопок при загрузке страницы
    addButton('вердикты', 'selectAnswer');

    // Поиск информации о теме
    const threadData = getThreadData();


    $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
    $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#close').click(() => editThreadData(CLOSE_PREFIX, false));


    $(`button#selectAnswer`).click(() => {
        XF.alert(buttonsMarkup(buttons), null, 'Выберите вердикт');
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
    12 < hours && hours <= 18
      ? 'Доброе утро'
      : 18 < hours && hours <= 21
      ? 'Добрый день'
      : 21 < hours && hours <= 4
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