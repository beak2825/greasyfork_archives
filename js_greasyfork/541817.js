// ==UserScript==
// @name         BLACK | Скрипт (Серый) Z.litvinenko
// @namespace    https://forum.blackrussia.online
// @version      1.2
// @description  Для Zloy Litvinenko - BLACK RUSSIA | BLACK
// @author       Z.Litvinenko
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon         https://i.postimg.cc/155KR8J6/Bvo-W9m-Or-F-0.jpgg
// @downloadURL https://update.greasyfork.org/scripts/541817/BLACK%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%28%D0%A1%D0%B5%D1%80%D1%8B%D0%B9%29%20Zlitvinenko.user.js
// @updateURL https://update.greasyfork.org/scripts/541817/BLACK%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%28%D0%A1%D0%B5%D1%80%D1%8B%D0%B9%29%20Zlitvinenko.meta.js
// ==/UserScript==

(function () {
  'use strict';
'esversion 6' ;
   const UNACCEPT_PREFIX = 4; // Префикс "Отказано"
const ACCEPT_PREFIX = 8; // Префикс "Одобрено"
const PIN_PREFIX = 2; // Префикс "На рассмотрении"
const COMMAND_PREFIX = 10; // Префикс "Команде Проекта"
const WATCHED_PREFIX = 9; // Префикс "Рассмотрено"
const CLOSE_PREFIX = 7; // Префикс "Закрыто"
const TEX_PREFIX = 13; // Префикс "Техническому специалисту"
const GA_PREFIX = 12; // Префикс "ГА"
const V_PREFIX = 1; // Префикс "Важно"
const WAIT_PREFIX = 14; // Префикс "Ожидание"
const buttons = [
      {
      title: '------------------------------------------------------| Ответы на жалобы игроков |------------------------------------------------------',
      content:
          '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
      },
    {
      title: '| помеха рп процессу |',
      content:
     "[CENTER][IMG width=695px]https://i.postimg.cc/rmsxzwCZ/118-20250527190338.png[/IMG]" +
     "[CENTER][FONT=Times New Roman][SIZE=4][COLOR=rgb(210, 210, 210)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT]" +
     "[CENTER][HR][/HR]" +
     "[CENTER][FONT=Times New Roman][SIZE=4][I]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/I][/FONT][/SIZE][/CENTER]" +
     "[CENTER][HR][/HR]" +
     "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]2.04.[/I][/COLOR][I]Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы.[COLOR=rgb(210, 210, 210)] | Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/I][/FONT][/COLOR][/SIZE][/CENTER]" +
     "[CENTER][HR][/HR]" +
     "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]Пример:[/I][/COLOR][I] Таран дальнобойщиков, инкассаторов под разными предлогами.[/I][/FONT][/SIZE][/CENTER]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/jjFQHf5Y/114-20250527185910.png[/IMG]" +
     "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]Одобрено, закрыто.[/I][/FONT][/COLOR][/SIZE][/CENTER]",
        prefix: ACCEPT_PREFIX,
       status: false,
     },
    {
      title: '|☑ DM ☑|',
      content:
     "[CENTER][IMG width=695px]https://i.postimg.cc/rmsxzwCZ/118-20250527190338.png[/IMG]" +
     "[CENTER][FONT=Times New Roman][SIZE=4][COLOR=rgb(210, 210, 210)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT]" +
     "[CENTER][HR][/HR]" +
     "[CENTER][FONT=Times New Roman][SIZE=4][I]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/I][/FONT][/SIZE][/CENTER]" +
     "[CENTER][HR][/HR]" +
     "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]2.19.[/I][/COLOR][I]Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины[COLOR=rgb(210, 210, 210)] | Jail 60 минут[/I][/FONT][/COLOR][/SIZE][/CENTER]" +
     "[CENTER][HR][/HR]" +
     "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]Примечание:[/I][/COLOR][I] Разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/I][/FONT][/SIZE][/CENTER]" +
     "[CENTER][HR][/HR]" +
     "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]Примечание:[/I][/COLOR][I] Нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/I][/FONT][/SIZE][/CENTER]" +
     "[CENTER][IMG width=695px]https://i.postimg.cc/jjFQHf5Y/114-20250527185910.png[/IMG]" +
     "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4]Одобрено, закрыто.[/FONT][/COLOR][/SIZE][/CENTER]",
        prefix: ACCEPT_PREFIX,
       status: false,
       },
       {
        title: '|☑ DB ☑|',
      content:
    "[CENTER][IMG width=695px]https://i.postimg.cc/rmsxzwCZ/118-20250527190338.png[/IMG]" +
    "[CENTER][FONT=Times New Roman][SIZE=4][COLOR=rgb(210, 210, 210)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Times New Roman][SIZE=4][I]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]2.13.[/I][/COLOR][I]Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта[COLOR=rgb(210, 210, 210)] | Jail 60 минут[/I][/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]Исключение:[/I][/COLOR][I] Разрешается на территории проведения мероприятия по захвату упавшего семейного контейнера.[/I][/FONT][/SIZE][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/jjFQHf5Y/114-20250527185910.png[/IMG]" +
    "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]Одобрено, закрыто.[/I][/FONT][/COLOR][/SIZE][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|☑ Mass DM ☑|',
      content:
    "[CENTER][IMG width=695px]https://i.postimg.cc/rmsxzwCZ/118-20250527190338.png[/IMG]" +
    "[CENTER][FONT=Times New Roman][SIZE=4][COLOR=rgb(210, 210, 210)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Times New Roman][SIZE=4][I]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]2.20.[/I][/COLOR][I]Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более[COLOR=rgb(210, 210, 210)] | Warn / Ban 3 - 7 дней[/I][/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/jjFQHf5Y/114-20250527185910.png[/IMG]" +
    "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]Одобрено, закрыто.[/I][/FONT][/COLOR][/SIZE][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|☑ TK ☑|',
      content:
    "[CENTER][IMG width=695px]https://i.postimg.cc/rmsxzwCZ/118-20250527190338.png[/IMG]" +
    "[CENTER][FONT=Times New Roman][SIZE=4][COLOR=rgb(210, 210, 210)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Times New Roman][SIZE=4][I]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/I][/FONT][/SIZE][/CENTER]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]2.15.[/I][/COLOR][I]Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины[COLOR=rgb(210, 210, 210)] | Jail 60 минут / Warn (за два и более убийства)[/I][/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/jjFQHf5Y/114-20250527185910.png[/IMG]" +
    "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]Одобрено, закрыто.[/I][/FONT][/COLOR][/SIZE][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|☑ SK ☑|',
      content:
    "[CENTER][IMG width=695px]https://i.postimg.cc/rmsxzwCZ/118-20250527190338.png[/IMG]" +
    "[CENTER][FONT=Times New Roman][SIZE=4][COLOR=rgb(210, 210, 210)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Times New Roman][SIZE=4][I]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/I][/FONT][/SIZE][/CENTER]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]2.16.[/I][/COLOR][I]Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них[COLOR=rgb(210, 210, 210)] | Jail 60 минут / Warn (за два и более убийства)[/I][/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/jjFQHf5Y/114-20250527185910.png[/IMG]" +
    "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]Одобрено, закрыто.[/I][/FONT][/COLOR][/SIZE][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|☑ Nrp поведение ☑|',
      content:
    "[CENTER][IMG width=695px]https://i.postimg.cc/rmsxzwCZ/118-20250527190338.png[/IMG]" +
    "[CENTER][FONT=Times New Roman][SIZE=4][COLOR=rgb(210, 210, 210)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Times New Roman][SIZE=4][I]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/I][/FONT][/SIZE][/CENTER]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]2.01.[/I][/COLOR][I]Запрещено поведение, нарушающее нормы процессов Role Play режима игры[COLOR=rgb(210, 210, 210)] | Jail 30 минут[/I][/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]Примечание:[/I][/COLOR][I] Ездить на крышах транспортных средств, бегать или ходить по столам в казино, целенаправленная провокация сотрудников правоохранительных органов с целью развлечения, целенаправленная помеха в проведении различных собеседований и так далее.[/I][/FONT][/SIZE][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/jjFQHf5Y/114-20250527185910.png[/IMG]" +
    "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]Одобрено, закрыто.[/I][/FONT][/COLOR][/SIZE][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|☑ Одиночный патруль ☑|',
      content:
    "[CENTER][IMG width=695px]https://i.postimg.cc/rmsxzwCZ/118-20250527190338.png[/IMG]" +
    "[CENTER][FONT=Times New Roman][SIZE=4][COLOR=rgb(210, 210, 210)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Times New Roman][SIZE=4][I]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/I][/FONT][/SIZE][/CENTER]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]1.11.[/I][/COLOR][I]Всем силовым структурам запрещен одиночный патруль или конвоирование, минимум 2 сотрудника[COLOR=rgb(210, 210, 210)] | Jail 30 минут[/I][/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/jjFQHf5Y/114-20250527185910.png[/IMG]" +
    "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]Одобрено, закрыто.[/I][/FONT][/COLOR][/SIZE][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|☑ Раб в форме госс ☑|',
      content:
    "[CENTER][IMG width=695px]https://i.postimg.cc/rmsxzwCZ/118-20250527190338.png[/IMG]" +
    "[CENTER][FONT=Times New Roman][SIZE=4][COLOR=rgb(210, 210, 210)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Times New Roman][SIZE=4][I]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/I][/FONT][/SIZE][/CENTER]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]1.07.[/I][/COLOR][I]Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции[COLOR=rgb(210, 210, 210)] | Jail 30 минут[/I][/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/jjFQHf5Y/114-20250527185910.png[/IMG]" +
    "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]Одобрено, закрыто.[/I][/FONT][/COLOR][/SIZE][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|☑ Уход от RP ☑|',
      content:
    "[CENTER][IMG width=695px]https://i.postimg.cc/rmsxzwCZ/118-20250527190338.png[/IMG]" +
    "[CENTER][FONT=Times New Roman][SIZE=4][COLOR=rgb(210, 210, 210)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Times New Roman][SIZE=4][I]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/I][/FONT][/SIZE][/CENTER]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]2.02.[/I][/COLOR][I]Запрещено целенаправленно уходить от Role Play процесса всеразличными способами[COLOR=rgb(210, 210, 210)] | Jail 30 минут / Warn[/I][/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]Примечание:[/I][/COLOR][I] Уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания или ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснуться Вашего персонажа. Уходить в интерьер или зеленую зону во время перестрелки с целью избежать смерти или уйти от Role Play процесса и так далее.[/I][/FONT][/SIZE][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/jjFQHf5Y/114-20250527185910.png[/IMG]" +
    "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]Одобрено, закрыто.[/I][/FONT][/COLOR][/SIZE][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|☑ NRP drive ☑|',
      content:
    "[CENTER][IMG width=695px]https://i.postimg.cc/rmsxzwCZ/118-20250527190338.png[/IMG]" +
    "[CENTER][FONT=Times New Roman][SIZE=4][COLOR=rgb(210, 210, 210)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Times New Roman][SIZE=4][I]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/I][/FONT][/SIZE][/CENTER]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]2.03.[/I][/COLOR][I]Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере[COLOR=rgb(210, 210, 210)] | Jail 30 минут[/I][/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]Примечание:[/I][/COLOR][I] Нарушением считаются такие действия, как езда на скутере по горам, намеренное создание аварийных ситуаций при передвижении. Передвижение по полям на любом транспорте, за исключением кроссовых мотоциклов и внедорожников.[/I][/FONT][/SIZE][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/jjFQHf5Y/114-20250527185910.png[/IMG]" +
    "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]Одобрено, закрыто.[/I][/FONT][/COLOR][/SIZE][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|☑ fdrive ☑|',
      content:
    "[CENTER][IMG width=695px]https://i.postimg.cc/rmsxzwCZ/118-20250527190338.png[/IMG]" +
    "[CENTER][FONT=Times New Roman][SIZE=4][COLOR=rgb(210, 210, 210)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Times New Roman][SIZE=4][I]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/I][/FONT][/SIZE][/CENTER]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]2.47.[/I][/COLOR][I]Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора)[COLOR=rgb(210, 210, 210)] | Jail 60 минут[/I][/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/jjFQHf5Y/114-20250527185910.png[/IMG]" +
    "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]Одобрено, закрыто.[/I][/FONT][/COLOR][/SIZE][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
        title: '|☑ Аморал+ ☑|',
      content:
    "[CENTER][IMG width=695px]https://i.postimg.cc/rmsxzwCZ/118-20250527190338.png[/IMG]" +
    "[CENTER][FONT=Times New Roman][SIZE=4][COLOR=rgb(210, 210, 210)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Times New Roman][SIZE=4][I]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/I][/FONT][/SIZE][/CENTER]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]2.08.[/I][/COLOR][I]Запрещена любая форма аморальных действий сексуального характера в сторону игроков[COLOR=rgb(210, 210, 210)] | Jail 30 минут[/I][/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]Исключение:[/I][/COLOR][I] Обоюдное согласие обеих сторон.[/I][/FONT][/SIZE][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/jjFQHf5Y/114-20250527185910.png[/IMG]" +
    "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]Одобрено, закрыто.[/I][/FONT][/COLOR][/SIZE][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|☑ Багоюз ☑|',
      content:
    "[CENTER][IMG width=695px]https://i.postimg.cc/rmsxzwCZ/118-20250527190338.png[/IMG]" +
    "[CENTER][FONT=Times New Roman][SIZE=4][COLOR=rgb(210, 210, 210)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Times New Roman][SIZE=4][I]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/I][/FONT][/SIZE][/CENTER]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]2.21.[/I][/COLOR][I]Запрещено пытаться обходить игровую систему или использовать любые баги сервера[COLOR=rgb(210, 210, 210)] | Ban 15 - 30 дней / PermBan[/I][/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]Примечание:[/I][/COLOR][I] Под игровой системой подразумеваются функции и возможности, которые реализованы в игре для взаимодействия между игроками, а также взаимодействия игроков с функциями, у которых есть свое конкретное предназначение.[/I][/FONT][/SIZE][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/jjFQHf5Y/114-20250527185910.png[/IMG]" +
    "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]Одобрено, закрыто.[/I][/FONT][/COLOR][/SIZE][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|☑ Багоюз Аним ☑|',
      content:
    "[CENTER][IMG width=695px]https://i.postimg.cc/rmsxzwCZ/118-20250527190338.png[/IMG]" +
    "[CENTER][FONT=Times New Roman][SIZE=4][COLOR=rgb(210, 210, 210)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Times New Roman][SIZE=4][I]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта: [/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]2.55.[/I][/COLOR][I]Запрещается багоюз связанный с анимацией в любых проявлениях.[COLOR=rgb(210, 210, 210)] | Jail 120 минут[/I][/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]Примечание:[/I][/COLOR][I] Наказание применяется в случаях, когда, используя ошибку, игрок получает преимущество перед другими игроками.[/I][/FONT][/SIZE][/CENTER]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]Пример:[/I][/COLOR][I] Если игрок, используя баг, убирает ограничение на использование оружия в зелёной зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес, перестрелки на мероприятии с семейными контейнерами или на мероприятии от администрации.[/I][/FONT][/SIZE][/CENTER]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]Исключение:[/I][/COLOR][I] Разрешается использование сбива темпа стрельбы в войне за бизнес при согласии обеих сторон и с уведомлением следящего администратора в соответствующей беседе.[/I][/FONT][/SIZE][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/jjFQHf5Y/114-20250527185910.png[/IMG]" +
    "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]Одобрено, закрыто.[/I][/FONT][/COLOR][/SIZE][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|☑ Nrp Аксессуар ☑|',
      content:
    "[CENTER][IMG width=695px]https://i.postimg.cc/rmsxzwCZ/118-20250527190338.png[/IMG]" +
    "[CENTER][FONT=Times New Roman][SIZE=4][COLOR=rgb(210, 210, 210)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Times New Roman][SIZE=4][I]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/I][/FONT][/SIZE][/CENTER]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]2.52.[/I][/COLOR][I]Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера[COLOR=rgb(210, 210, 210)] | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/I][/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]Пример:[/I][/COLOR][I] Слишком большие аксессуары на голове персонажа, имитация гитарой половых органов и тому подобное.[/I][/FONT][/SIZE][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/jjFQHf5Y/114-20250527185910.png[/IMG]" +
    "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]Одобрено, закрыто.[/I][/FONT][/COLOR][/SIZE][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|☑ Т/С орг в лич целях ☑|',
      content:
    "[CENTER][IMG width=695px]https://i.postimg.cc/rmsxzwCZ/118-20250527190338.png[/IMG]" +
    "[CENTER][FONT=Times New Roman][SIZE=4][COLOR=rgb(210, 210, 210)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Times New Roman][SIZE=4][I]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/I][/FONT][/SIZE][/CENTER]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]1.08.[/I][/COLOR][I]Запрещено использование рабочего или фракционного транспорта в личных целях[COLOR=rgb(210, 210, 210)] | Jail 30 минут[/I][/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/jjFQHf5Y/114-20250527185910.png[/IMG]" +
    "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]Одобрено, закрыто.[/I][/FONT][/COLOR][/SIZE][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|☑ Nrp коп ☑|',
      content:
    "[CENTER][IMG width=695px]https://i.postimg.cc/rmsxzwCZ/118-20250527190338.png[/IMG]" +
    "[CENTER][FONT=Times New Roman][SIZE=4][COLOR=rgb(210, 210, 210)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Times New Roman][SIZE=4][I]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/I][/FONT][/SIZE][/CENTER]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]6.03.[/I][/COLOR][I]Запрещено поведение не подражающее полицейскому[COLOR=rgb(210, 210, 210)] | Warn[/I][/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/jjFQHf5Y/114-20250527185910.png[/IMG]" +
    "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]Одобрено, закрыто.[/I][/FONT][/COLOR][/SIZE][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|☑ Розыск без причины ☑|',
      content:
    "[CENTER][IMG width=695px]https://i.postimg.cc/rmsxzwCZ/118-20250527190338.png[/IMG]" +
    "[CENTER][FONT=Times New Roman][SIZE=4][COLOR=rgb(210, 210, 210)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Times New Roman][SIZE=4][I]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/I][/FONT][/SIZE][/CENTER]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]6.02.[/I][/COLOR][I]Запрещено выдавать розыск без Role Play причины.[COLOR=rgb(210, 210, 210)] | Warn[/I][/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/jjFQHf5Y/114-20250527185910.png[/IMG]" +
    "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]Одобрено, закрыто.[/I][/FONT][/COLOR][/SIZE][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|☑ Nrp ВЧ ☑|',
      content:
    "[CENTER][IMG width=695px]https://i.postimg.cc/rmsxzwCZ/118-20250527190338.png[/IMG]" +
    "[CENTER][FONT=Times New Roman][SIZE=4][COLOR=rgb(210, 210, 210)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Times New Roman][SIZE=4][I]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/I][/FONT][/SIZE][/CENTER]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]2.[/I][/COLOR][I]За нарушение правил нападения на Войсковую Часть выдаётся предупреждение[COLOR=rgb(210, 210, 210)] | Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/I][/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/jjFQHf5Y/114-20250527185910.png[/IMG]" +
    "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]Одобрено, закрыто.[/I][/FONT][/COLOR][/SIZE][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|☑ Гос в каз/раб ☑|',
      content:
    "[CENTER][IMG width=695px]https://i.postimg.cc/rmsxzwCZ/118-20250527190338.png[/IMG]" +
    "[CENTER][FONT=Times New Roman][SIZE=4][COLOR=rgb(210, 210, 210)][I]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/I][/COLOR][/SIZE][/FONT]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Times New Roman][SIZE=4][I]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/I][/FONT][/SIZE][/CENTER]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]1.13.[/I][/COLOR][I]Запрещено работать или находится в казино/платных контейнерах в форме Гос[COLOR=rgb(210, 210, 210)] | Jail 30 минут[/I][/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/jjFQHf5Y/114-20250527185910.png[/IMG]" +
    "[CENTER][FONT=Times New Roman][COLOR=rgb(210, 210, 210)][SIZE=4][I]Одобрено, закрыто.[/I][/FONT][/COLOR][/SIZE][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '-----------------------------------------------------| Ответы для ГКФ/ЗГКФ |-----------------------------------------------------',
        content:
          '[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
    },
    {
        title: '| долг |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/COLOR][/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][FONT=georgia][QUOTE][COLOR=rgb(255, 0, 0)][SIZE=4]2.57.[/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Запрещается брать в долг игровые ценности и не возвращать их.[/COLOR][COLOR=rgb(255, 0, 0)] | Ban 30 Дней / Permban[/QUOTE][/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется;[/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда;[/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами.[/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| Оск религии/нации |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/COLOR][/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][FONT=georgia][QUOTE][COLOR=rgb(255, 0, 0)][SIZE=4]2.35.[/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате[/COLOR][COLOR=rgb(255, 0, 0)] | Mute 120 минут / Ban 7 дней[/QUOTE][/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
     },
     {
        title: '| Мат в Vip chat |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/COLOR][/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][FONT=georgia][QUOTE][COLOR=rgb(255, 0, 0)][SIZE=4]3.23.[/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате[/COLOR][COLOR=rgb(255, 0, 0)] | Mute 30 минут[/QUOTE][/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
        title: '| 3.04 Упом Родни |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]По результатам рассмотрения вашей жалобы зафиксировано нарушение игроком пункта[/COLOR][COLOR=rgb(255, 0, 0)] 3.04[/COLOR][COLOR=rgb(192, 192, 192)] общих правил проекта. За указанное нарушение к игроку будет применена мера пресечения в виде блокировки игрового чата (Mute) на [/COLOR][COLOR=rgb(255, 0, 0)]120 минут.[/COLOR][/I][/SIZE][/FONT][/CENTER]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] термины «MQ», «rnq» расценивается как упоминание родных.[/COLOR][/SIZE][/FONT][/CENTER]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] если упоминание и оскорбление родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/COLOR][/SIZE][/FONT][/CENTER]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| 3.04 7 дней |',
      content:
   "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
   "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
   "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]По результатам проверки жалобы установлено нарушение правил. В соответствии с пунктом [/COLOR][COLOR=rgb(255, 0, 0)]3.04[/COLOR][COLOR=rgb(192, 192, 192)] общих правил серверов нарушителю назначена блокировка аккаунта на [/COLOR][COLOR=rgb(255, 0, 0)]7 дней[/COLOR].[COLOR=rgb(192, 192, 192)] В случае повторных нарушений могут быть применены более строгие меры.[/SIZE][/FONT][/COLOR][/I][/CENTER]" +
   "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
   "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] термины «MQ», «rnq» расценивается как упоминание родных.[/COLOR][/SIZE][/FONT][/CENTER]" +
   "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
   "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] если упоминание и оскорбление родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/COLOR][/SIZE][/FONT][/CENTER]" +
   "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
   "[CENTER][FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| Оск род (BAN 15) |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
   "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
   "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]По результатам проверки жалобы установлено нарушение правил. В соответствии с пунктом [/COLOR][COLOR=rgb(255, 0, 0)]3.04[/COLOR][COLOR=rgb(192, 192, 192)] общих правил серверов нарушителю назначена блокировка аккаунта на [/COLOR][COLOR=rgb(255, 0, 0)]15 дней[/COLOR].[COLOR=rgb(192, 192, 192)] В случае повторных нарушений могут быть применены более строгие меры.[/SIZE][/FONT][/COLOR][/I][/CENTER]" +
   "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
   "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] термины «MQ», «rnq» расценивается как упоминание родных.[/COLOR][/SIZE][/FONT][/CENTER]" +
   "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
   "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] если упоминание и оскорбление родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/COLOR][/SIZE][/FONT][/CENTER]" +
   "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
   "[CENTER][FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| Flood |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]" +
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/COLOR][/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][FONT=georgia][QUOTE][COLOR=rgb(255, 0, 0)][SIZE=4]3.05.[/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока[/COLOR][COLOR=rgb(255, 0, 0)] | Mute 30 минут[/QUOTE][/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]" +
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| MG |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/COLOR][/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][FONT=georgia][QUOTE][COLOR=rgb(255, 0, 0)][SIZE=4]2.18.[/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе[/COLOR][COLOR=rgb(255, 0, 0)] | Mute 30 минут[/QUOTE][/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] использование смайлов в виде символов «))», «=D» запрещено в IC чате.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] телефонное общение также является IC чатом.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] за написанный однократно вопросительный «?» или восклицательный «!» знак в IC чате, наказание не выдается.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| CAPS |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/COLOR][/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][FONT=georgia][QUOTE][COLOR=rgb(255, 0, 0)][SIZE=4]3.02.[/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Запрещено использование верхнего регистра (Caps Lock) при написании любого текста в любом чате[/COLOR][COLOR=rgb(255, 0, 0)] | Mute 30 минут[/QUOTE][/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Пример:[/I][/COLOR][COLOR=rgb(209, 213, 216)] *ПрОдАм*, *куплю МАШИНУ*.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| Транслит |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/COLOR][/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][FONT=georgia][QUOTE][COLOR=rgb(255, 0, 0)][SIZE=4]3.20.[/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Запрещено использование транслита в любом из чатов[/COLOR][COLOR=rgb(255, 0, 0)] | Mute 30 минут[/QUOTE][/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Пример:[/I][/COLOR][COLOR=rgb(209, 213, 216)] «Privet», «Kak dela», «Narmalna».[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| Злоуп знаком |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/COLOR][/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][FONT=georgia][QUOTE][COLOR=rgb(255, 0, 0)][SIZE=4]3.06.[/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Запрещено злоупотребление знаков препинания и прочих символов[/COLOR][COLOR=rgb(255, 0, 0)] | Mute 30 минут[/QUOTE][/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Пример:[/I][/COLOR][COLOR=rgb(209, 213, 216)] «???????», «!!!!!!!», «Дааааааааааааааааааааааа» и так далее.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| объявы в гос |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/COLOR][/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][FONT=georgia][QUOTE][COLOR=rgb(255, 0, 0)][SIZE=4]3.22.[/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC)[/COLOR][COLOR=rgb(255, 0, 0)] | Mute 30 минут[/QUOTE][/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Пример:[/I][/COLOR][COLOR=rgb(209, 213, 216)] в помещении центральной больницы писать в чат: «Продам эксклюзивную шапку дешево!!!»[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| ООС Оск |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/COLOR][/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][FONT=georgia][QUOTE][COLOR=rgb(255, 0, 0)][SIZE=4]3.03.[/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены[/COLOR][COLOR=rgb(255, 0, 0)] | Mute 30 минут[/QUOTE][/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| Оск Адм |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/COLOR][/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][FONT=georgia][QUOTE][COLOR=rgb(255, 0, 0)][SIZE=4]2.54.[/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации[/COLOR][COLOR=rgb(255, 0, 0)] | Mute 180 минут[/QUOTE][/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Пример:[/I][/COLOR][COLOR=rgb(209, 213, 216)] оформление жалобы в игре с текстом: «Быстро починил меня», «Админы вы задрали уже когда работать будете меня тут ДБшат я 3 жалобы уже подал!!!!!!!!», «МОЗГИ ВКЛЮЧИТЕ Я УВОЛЮ ВАС ЩА» и т.д. и т.п., а также при взаимодействии с другими игроками.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Пример:[/I][/COLOR][COLOR=rgb(209, 213, 216)] оскорбление администрации в любой чат, включая репорт подлежит наказанию в виде блокировки доступа к использованию всех видов чатов - [/COLOR][/SIZE][COLOR=rgb(255, 0, 0)][SIZE=4]Mute 180 минут.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| Оск Проекта |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/COLOR][/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][FONT=georgia][QUOTE][COLOR=rgb(255, 0, 0)][SIZE=4]2.40.[/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе[/COLOR][COLOR=rgb(255, 0, 0)] | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/QUOTE][/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| Полит Пропаганда |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/COLOR][/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][FONT=georgia][QUOTE][COLOR=rgb(255, 0, 0)][SIZE=4]3.18.[/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов[/COLOR][COLOR=rgb(255, 0, 0)] | Mute 120 минут / Ban 10 дней[/QUOTE][/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| Политика |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/COLOR][/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][FONT=georgia][QUOTE][COLOR=rgb(255, 0, 0)][SIZE=4]2.35.[/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате[/COLOR][COLOR=rgb(255, 0, 0)] | Mute 120 минут / Ban 7 дней[/QUOTE][/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| Реклама Промо |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/COLOR][/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][FONT=georgia][QUOTE][COLOR=rgb(255, 0, 0)][SIZE=4]3.21.[/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах[/COLOR][COLOR=rgb(255, 0, 0)] | Ban 30 дней[/QUOTE][/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] чаты семейные, строительных компаний, транспортных компаний, фракционные чаты, IC, OOC, VIP и так далее.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Исключение:[/I][/COLOR][COLOR=rgb(209, 213, 216)] промокоды, предоставленные разработчиками, а также распространяемые через официальные ресурсы проекта.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Пример:[/I][/COLOR][COLOR=rgb(209, 213, 216)] если игрок упомянет промокод, распространяемый через официальную публичную страницу ВКонтакте либо через официальный Discord в любом из чатов, наказание ему не выдается.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| Введение в заблуждение |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/COLOR][/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][FONT=georgia][QUOTE][COLOR=rgb(255, 0, 0)][SIZE=4]3.11.[/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Запрещено введение игроков проекта в заблуждение путем злоупотребления командами[/COLOR][COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan[/QUOTE][/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] /me чтобы поднять кошелек введите /pay 228 5000. Для продажи автомобиля введите /sellmycar id 2828 (счёт в банке) цена.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| ООС Угрозы |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/COLOR][/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][FONT=georgia][QUOTE][COLOR=rgb(255, 0, 0)][SIZE=4]2.37.[/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Запрещены OOC-угрозы, в том числе и завуалированные, а также угрозы наказанием со стороны администрации[/COLOR][COLOR=rgb(255, 0, 0)] | Mute 120 минут / Ban 7 - 15 дней[/QUOTE][/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] блокировка аккаунта выдаётся в случае, если есть прямые угрозы жизни, здоровью игрока или его близким. По решению главного администратора может быть выдана перманентная блокировка.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| Н/ПРО |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/COLOR][/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][FONT=georgia][QUOTE][COLOR=rgb(255, 0, 0)][SIZE=4]4.01.[/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Запрещено редактирование объявлений, не соответствующих ПРО[/COLOR][COLOR=rgb(255, 0, 0)] | Mute 30 минут[/QUOTE][/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| Н/ППЭ |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/COLOR][/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][FONT=georgia][QUOTE][COLOR=rgb(255, 0, 0)][SIZE=4]4.02.[/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Запрещено проведение эфиров, не соответствующих Role Play правилам и логике[/COLOR][COLOR=rgb(255, 0, 0)] | Mute 30 минут[/QUOTE][/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| Редактирование в лич целях |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/COLOR][/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][FONT=georgia][QUOTE][COLOR=rgb(255, 0, 0)][SIZE=4]4.04.[/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком[/COLOR][COLOR=rgb(255, 0, 0)] | Ban 7 дней + ЧС организации[/QUOTE][/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| Слив |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/COLOR][/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][FONT=georgia][QUOTE][COLOR=rgb(255, 0, 0)][SIZE=4]3.08.[/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Запрещены любые формы «слива» посредством использования глобальных чатов[/COLOR][COLOR=rgb(255, 0, 0)] | PermBan[/QUOTE][/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| Слив склада |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/COLOR][/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][FONT=georgia][QUOTE][COLOR=rgb(255, 0, 0)][SIZE=4]2.09.[/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Запрещено сливать склад фракции / семьи путем взятия большого количества ресурсов или превышая допустимый лимит, установленный лидером[/COLOR][COLOR=rgb(255, 0, 0)] | Ban 15 - 30 дней / PermBan[/QUOTE][/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] в описании семьи должны быть указаны условия взаимодействия со складом. Если лидер семьи предоставил неограниченный доступ к складу и забыл снять его, администрация не несет ответственности за возможные последствия. Жалобы по данному пункту правил принимаются только от лидера семьи.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] исключение всех или части игроков из состава семьи без ведома лидера также считается сливом.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| Временные биз на аук |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/COLOR][/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][FONT=georgia][QUOTE][COLOR=rgb(255, 0, 0)][SIZE=4]3.01.[/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]После покупки казино владелец обязан ждать срока окончания владения Казино / СТО - 15 суток. Запрещено продавать и передавать казино / СТО третьим лицам, продавать бизнес в государство и выкупать обратно, любые другие виды и способы сохранения бизнеса у себя или выставления его на аукцион[/COLOR][COLOR=rgb(255, 0, 0)] | Permban[/QUOTE][/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| NRP Oбман |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/COLOR][/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][FONT=georgia][QUOTE][COLOR=rgb(255, 0, 0)][SIZE=4]2.05.[/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики[/COLOR][COLOR=rgb(255, 0, 0)] | Permban[/QUOTE][/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| Выдача себя за Адм |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/COLOR][/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][FONT=georgia][QUOTE][COLOR=rgb(255, 0, 0)][SIZE=4]3.10.[/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Запрещена выдача себя за администратора, если таковым не являетесь[/COLOR][COLOR=rgb(255, 0, 0)] | Ban 7 - 15 дней[/QUOTE][/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| Реклама |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/COLOR][/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][FONT=georgia][QUOTE][COLOR=rgb(255, 0, 0)][SIZE=4]2.31.[/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube-каналы и тому подобное[/COLOR][COLOR=rgb(255, 0, 0)] | Ban 7 дней / PermBan[/QUOTE][/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] если игрок не использует глобальный чат, чтобы дать свои контактные данные для связи, это не будет являться рекламой.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| Читы |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]В ходе рассмотрения жалобы выявлено серьёзное нарушение игроком пункта[/COLOR][COLOR=rgb(255, 0, 0)] 2.22[/COLOR][COLOR=rgb(192, 192, 192)] общих правил серверов нарушителю назначена мера пресечения в виде [/COLOR][COLOR=rgb(255, 0, 0)]бессрочной блокировки игрового аккаунта (PermBan).[/COLOR][COLOR=rgb(192, 192, 192)] В случае повторных нарушений могут быть применены более строгие меры.[/SIZE][/FONT][/COLOR][/I][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] запрещено внесение любых изменений в оригинальные файлы игры.[/COLOR][/SIZE][/FONT][/CENTER]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Исключение:[/I][/COLOR][COLOR=rgb(209, 213, 216)] разрешено изменение шрифта, его размера и длины чата (кол-во строк).[/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Исключение:[/I][/COLOR][COLOR=rgb(209, 213, 216)] блокировка за включенный счетчик FPS не выдается.[/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
       title: '| Сборка (BAN 15) |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]Использование модифицированной сборки игры (изменение оригинальных файлов игры) является нарушением пункта[/COLOR][COLOR=rgb(255, 0, 0)] 2.22[/COLOR][COLOR=rgb(192, 192, 192)] общих правил проекта. В ходе рассмотрения жалобы установлено, что игрок совершил данное нарушение. В связи с этим, к игроку будет применена мера пресечения в виде временной блокировки игрового аккаунта на[/COLOR][COLOR=rgb(255, 0, 0)] 15 дней.[/SIZE][/FONT][/COLOR][/I][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] запрещено внесение любых изменений в оригинальные файлы игры.[/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]<br>"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Исключение:[/I][/COLOR][COLOR=rgb(209, 213, 216)] разрешено изменение шрифта, его размера и длины чата (кол-во строк).[/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]<br>"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Исключение:[/I][/COLOR][COLOR=rgb(209, 213, 216)] блокировка за включенный счетчик FPS не выдается.[/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
     },
     {
        title: '| Сборка (BAN 30) |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]Использование модифицированной сборки игры (изменение оригинальных файлов игры) является нарушением пункта[/COLOR][COLOR=rgb(255, 0, 0)] 2.22[/COLOR][COLOR=rgb(192, 192, 192)] общих правил проекта. В ходе рассмотрения жалобы установлено, что игрок совершил данное нарушение. В связи с этим, к игроку будет применена мера пресечения в виде временной блокировки игрового аккаунта на[/COLOR][COLOR=rgb(255, 0, 0)] 30 дней.[/SIZE][/FONT][/COLOR][/I][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]<br>"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] запрещено внесение любых изменений в оригинальные файлы игры.[/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]<br>"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Исключение:[/I][/COLOR][COLOR=rgb(209, 213, 216)] разрешено изменение шрифта, его размера и длины чата (кол-во строк).[/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]<br>"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Исключение:[/I][/COLOR][COLOR=rgb(209, 213, 216)] блокировка за включенный счетчик FPS не выдается.[/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
     },
     {
        title: '| Музыка в войс чате |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/COLOR][/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][FONT=georgia][QUOTE][COLOR=rgb(255, 0, 0)][SIZE=4]3.14.[/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Запрещено включать музыку в Voice Chat[/COLOR][COLOR=rgb(255, 0, 0)] | Mute 60 минут[/QUOTE][/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
     },
     {
        title: '| Злоупом знаком |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/COLOR][/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][FONT=georgia][QUOTE][COLOR=rgb(255, 0, 0)][SIZE=4]3.06.[/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Запрещено злоупотребление знаков препинания и прочих символов[/COLOR][COLOR=rgb(255, 0, 0)] | Mute 30 минут[/QUOTE][/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Пример:[/I][/COLOR][COLOR=rgb(209, 213, 216)] «???????», «!!!!!!!», «Дааааааааааааааааааааааа» и так далее.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: '| Оск ник |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/COLOR][/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][FONT=georgia][QUOTE][COLOR=rgb(255, 0, 0)][SIZE=4]4.09.[/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе завуалированные), а также слова политической или религиозной направленности[COLOR=rgb(255, 0, 0)] | Устное замечание + смена игрового никнейма / PermBan[/QUOTE][/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: '| Фейк ник |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]К нарушителю будут применены меры в соответствии со следующим пунктом общих правил проекта:[/COLOR][/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][FONT=georgia][QUOTE][COLOR=rgb(255, 0, 0)][SIZE=4]4.09.[/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию[COLOR=rgb(255, 0, 0)] | Устное замечание + смена игрового никнейма / PermBan[/QUOTE][/COLOR][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#00FF00][I]Одобрено, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
       title: '----------------------------------------------------| Передача жалобы |----------------------------------------------------',
       content:
          '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
    },
    {
        title: '| Тех спецу |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]Ваша жалоба переадресована Техническому Специалисту, ожидайте ответа в данной теме.[/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF8C00][I]На рассмотрении.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: TEX_PREFIX,
      status: true,
    },
    {
      title: '| ГКФ/ЗГКФ |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]Ваша жалоба переадресована ГКФ @Esenia_Dolmatova , ЗГКФ @Zloy_Litvinenko [/SIZE][/FONT][FONT=georgia][SIZE=4], ожидайте ответа в данной теме.[/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF8C00][I]На рассмотрении.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: PIN_PREFIX,
      status:true,
    },
    {
      title: '| Кураторам Адм |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]Ваша жалоба переадресована [/SIZE][/FONT][FONT=georgia][SIZE=4]Кураторам @Sofia_Portnyagina , @Alex Dolmatinov ღ [/SIZE][/FONT][FONT=georgia][SIZE=4], ожидайте ответа в данной теме.[/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF8C00][I]На рассмотрении.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: PIN_PREFIX,
      status: true,
    },
    {
       title: '| В жб на тех |',
     content:
     "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
     "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]Вы ошиблись разделом, обратитесь в раздел жалоб на технических специалистов - [URL='https://forum.blackrussia.online/index.php?forums/Сервер-№10-black.1191/']*Нажмите сюда*[/URL][/I][/SIZE][/FONT][/CENTER]" +
     "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
     "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
     "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
     "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: CLOSE_PREFIX,
       status: false,
   },
    {
        title: '| В жб на адм |',
      content:
     "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
     "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]Вы ошиблись разделом, обратитесь в раздел жалоб на администрацию - [URL='https://forum.blackrussia.online/index.php?forums/Жалобы-на-администрацию.468/']*Нажмите сюда*[/URL][/I][/SIZE][/FONT][/CENTER]" +
      "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
     "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
     "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
     "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
          prefix: CLOSE_PREFIX,
        status: false,
    },
    {
         title: '| В жб на АП |',
       content:
     "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
     "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]Вы ошиблись разделом, обратитесь в раздел жалоб на хелперов - [URL='https://forum.blackrussia.online/threads/black-%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D0%BE%D0%B2-%D0%9F%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.12754928/post-53262231']*Нажмите сюда*[/URL][/I][/SIZE][/FONT][/CENTER]" +
     "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
     "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
     "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
     "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: CLOSE_PREFIX,
       status: false,
    },
    {
        title: '| В жб на ЛД |',
        content:
      "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
      "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
      "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]Вы ошиблись разделом, обратитесь в раздел жалоб на лидеров - [URL='https://forum.blackrussia.online/index.php?forums/Жалобы-на-лидеров.469/']*Нажмите сюда*[/URL][/I][/SIZE][/FONT][/CENTER]" +
      "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
      "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
      "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
      "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
         prefix: CLOSE_PREFIX,
       status: false,
    },
    {
          title: '| В жб на сотрудников |',
        content:
      "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
      "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
      "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]Вы ошиблись разделом, обратитесь в раздел жалоб на сотрудников в разделе вашей организации.[/I][/SIZE][/FONT][/CENTER]" +
      "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
      "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
      "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
      "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
         prefix: CLOSE_PREFIX,
        status: false,
    },
    {
          title: '| В ОБЖ |',
        content:
      "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
      "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
      "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]Вы ошиблись разделом, обратитесь в раздел обжалований наказаний - [URL='https://forum.blackrussia.online/index.php?forums/Обжалование-наказаний.471/']*Нажмите сюда*[/URL][/I][/SIZE][/FONT][/CENTER]" +
      "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
      "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
      "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
      "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
        prefix: CLOSE_PREFIX,
       status: false,
      },
      {
         title: '| В тех. раздел |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]Вы ошиблись разделом, обратитесь в технический раздел - [URL='https://forum.blackrussia.online/index.php?forums/Технический-раздел-black.488/']*Нажмите сюда*[/URL][/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: '----------------------------------------------------| Другие ответы для жб на игроков |----------------------------------------------------',
      content:
          '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
      },
      {
        title: '| Отказ СШ |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]Выражение СШ не содержит явного оскорбления и может рассматриваться как набор букв. В правилах проекта нет конкретного запрета на его использование, однако в зависимости от контекста администрация оставляет за собой право принимать меры в случае нарушения норм общения.[/COLOR][/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
     "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
     "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
        title: '| вирт на донат |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]Обмен автокейса, покупка доп слота на машину в семью и тд на виртуальную валюту запрещен, соответственно никакого нарушения со стороны игрока нет.[/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| жб на 2+ игроков |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]Нельзя писать одну жалобу на двух и более игроков (на каждого игрока отдельная жалоба).[/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| Уже наказан |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]Данный игрок уже получил наказание. Благодарим за обращение.[/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: CLOSE_PREFIX,
      status: false,
      },
      {
        title: '| Отказ никнейм |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]Никнейм игрока в ваших доказательствах не соответствует никнейму игрока на которого вы жалуетесь.(Создайте новую жалобу и укажите корректный никнейм).[/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
        title: '| отказ долг |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]Ваша жалоба не подлежит рассмотрению. Жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами. Также игровой долг может быть осуществлен ТОЛЬКО через банковский счет.[/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|📌 На рассмотрении 📌|',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]Ваша жалоба взята на рассмотрение. Ожидайте, пожалуйста, ответа в ближайшее время. Мы просим воздержаться от создания дубликатов данной темы. Благодарим за понимание[/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF8C00][I]На рассмотрении.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: PIN_PREFIX,
      status: true,
    },
    {
        title: '| Не достаточно док-в |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]Недостаточно доказательств для корректного рассмотрения вашей жалобы.[/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| Отсутствуют док-ва |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]Отсутствуют доказательства - следовательно, рассмотрению не подлежит. Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.[/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| нецензурный заголовок |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]Ваша жалоба отказана, так как в заголовке содержится нецензурная лексика и некорректное оформление. Обратите внимание, что за подобные нарушения ваш форумный аккаунт будет заблокирован.[/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| Док-ва не открывается |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]Ваши доказательства не открываются, что делает невозможным их рассмотрение. Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее еще раз и сделайте новую жалобу.[/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| Док-ва обрываются |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]Ваша жалоба отказана, так как видео-доказательства обрываются. Загрузите полную видеозапись на любой другой видеохостинг, например YouTube, Google Диск, Яндекс Диск, Rutube и так далее.[/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| Отсутствует сервер |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]На доказательствах отсутствует сервер - следовательно, рассмотрению не подлежит.[/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
        title: '| Док-ва отредакт |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]Доказательства, предоставленные вами, были отредактированы, что делает их недействительными для рассмотрения.[/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| Док-ва в соц сетях |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]Доказательства в социальных сетях и т.д. не принимаются. Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.[/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
        title: '| Док-ва в плохом качестве |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]Предоставленные вами доказательства имеют плохое качество, что затрудняет их анализ и делает невозможным для дальнейшего рассмотрения жалобы. Для корректного рассмотрения просьба предоставить более четкие и качественные материалы.[/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| Нарушений нет |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]Игрок не совершил никаких нарушений.[/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][HR][/HR][/CENTER]" +
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]Внимательно изучите общие правила серверов - [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL][/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Подделка доказательств |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]После тщательной проверки предоставленных вами доказательств было установлено, что они являются поддельными и созданы с использованием графических редакторов (фотошоп). В связи с нарушением правил нашего форума, касающихся достоверности информации и честного взаимодействия, ваш форумный аккаунт будет  заблокирован. Мы призываем всех пользователей соблюдать правила и предоставлять только достоверные данные. Спасибо за понимание.[/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| Личный Username не реклама |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]В действиях игрока не выявлено нарушений правил проекта. Указание своего имени пользователя (Username) для связи не является рекламой и, следовательно, не противоречит правилам.[/COLOR][/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][HR][/HR][/CENTER]" +
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]Внимательно изучите общие правила серверов - [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL][/COLOR][/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| Нет условий сделки |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]На предоставленных доказательствах отсутствуют условия сделки - следовательно, рассмотрению не подлежит.[/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| Нет time |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]Ваша жалоба отказана так как на предоставленных доказательствах отсутствуют дата и время (/time), что делает их невозможными для корректного рассмотрения.[/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| Нет таймкодов |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]В вашей жалобе отсутствуют таймкоды, что делает невозможным её рассмотрение. Если жалоба длится более 3-х минут, для корректного анализа нам необходимы точные временные метки событий. Например: 0:30 — условие сделки. 1:20 — обмен машинами. 2:20 — подмена машины на другую и выход из игры. Пожалуйста, укажите таймкоды в самой сути жалобы, чтобы мы могли корректно рассмотреть ваше обращение[/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| Прошло 3 дня |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]Ваша жалоба отказана, так как с момента нарушения прошло более 72 часов.[/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| Уже был ответ |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]Ваша жалоба отказана, так как по данной жалобе ранее уже был предоставлен полный и обоснованный ответ. Решение остается в силе, и повторные жалобы без новых значимых обстоятельств рассматриваться не будут. Рекомендуем ознакомиться с предыдущим ответом.[/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| Не по форме |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]Ваша жалоба составлена не по форме. Внимательно прочитайте правила подачи жалоб на игроков, закрепленные в этом разделе.[/I][/FONT][/SIZE][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=rgb(192, 192, 192)][I]Примечание:[/I][/COLOR][COLOR=rgb(209, 213, 216)] Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: '------------------------------------------------------| RP Биографии |------------------------------------------------------',
      content:
          '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
      },
    {
        title: '|📗 RP био одобрена 📗|',
      content:
    "[CENTER][FONT=Book Antiqua][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/SIZE][/FONT]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Ваша RolePlay - биография одобрена.[/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][COLOR=rgb(127, 255, 0)][SIZE=4]Одобрено, закрыто.[/FONT][/COLOR][/SIZE][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|📕 RP био отказана 📕|',
      content:
    "[CENTER][FONT=Book Antiqua][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/SIZE][/FONT]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Ваша RolePlay - биография отказана.[/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Отказано, закрыто.[/FONT][/COLOR][/SIZE][/CENTER]",
      prefix: UNACCEPT_PREFIX,
       status: false,
    },
    {
        title: '|📒 На доработке 📒|',
      content:
    "[CENTER][FONT=Book Antiqua][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/SIZE][/FONT]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Ваша RolePlay биография поставлена на доработку.[/SIZE][/FONT][/CENTER]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Внимательно прочитайте правила создания RP - биографий, закрепленные в данном разделе. Вам даётся 24 часа для исправления ошибок.[/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][COLOR=rgb(154, 205, 50)][SIZE=4]На доработке.[/FONT][/COLOR][/SIZE][/CENTER]",
      prefix: V_PREFIX,
       status: false,
    },
    {
        title: '|📕 RP био nRP Ник 📕|',
      content:
    "[CENTER][FONT=Book Antiqua][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/SIZE][/FONT]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Ваша RolePlay - биография отказана, так как у вас NonRP NickName.[/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Отказано, закрыто.[/FONT][/COLOR][/SIZE][/CENTER]",
      prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: '| RP био заголовок не по форме |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]Ваша RolePlay - биография отказана, так как заголовок оформлен неправильно.[/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
      prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: '|📕 более 1 рп био на ник 📕|',
      content:
    "[CENTER][FONT=Book Antiqua][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/SIZE][/FONT]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Ваша RolePlay - биография отказана, так как запрещено создавать более одной RP Биографии на один Ник.[/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Отказано, закрыто.[/FONT][/COLOR][/SIZE][/CENTER]",
      prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: '|📕 RP био некоррект. возраст 📕|',
      content:
    "[CENTER][FONT=Book Antiqua][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/SIZE][/FONT]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Ваша RolePlay - биография отказана, так как в ней указан некорректный возраст.[/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Отказано, закрыто.[/FONT][/COLOR][/SIZE][/CENTER]",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: '|📕 RP био мало информации 📕|',
      content:
    "[CENTER][FONT=Book Antiqua][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/SIZE][/FONT]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Ваша RolePlay - биография отказана, так как в ней написано мало информации.[/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Отказано, закрыто.[/FONT][/COLOR][/SIZE][/CENTER]",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: '|📕 RP био нет 18 лет 📕|',
      content:
    "[CENTER][FONT=Book Antiqua][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/SIZE][/FONT]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Ваша RolePlay - биография отказана, так как персонажу нет 18 лет.[/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Отказано, закрыто.[/FONT][/COLOR][/SIZE][/CENTER]",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: '|📕 RP био от 1 лица 📕|',
      content:
    "[CENTER][FONT=Book Antiqua][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/SIZE][/FONT]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Ваша RolePlay - биография отказана, так как написана от 1-го лица.[/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Отказано, закрыто.[/FONT][/COLOR][/SIZE][/CENTER]",
      prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: '| RP био не по форме |',
      content:
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(192, 192, 192)]Ваша RolePlay - биография отказана, так как она составлена не по форме.[/I][/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.ibb.co/4FnVsC8/image.png[/IMG][/CENTER]"+
    "[CENTER][FONT=georgia][SIZE=4][COLOR=#FF0000][I]Отказано, закрыто.[/I][/COLOR][/SIZE][/FONT][/CENTER]",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: '|📕 RP био не до работал 📕|',
      content:
    "[CENTER][FONT=Book Antiqua][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/SIZE][/FONT]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Ваша RolePlay - биография отказана, так как вы её не до работали.[/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Отказано, закрыто.[/FONT][/COLOR][/SIZE][/CENTER]",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: '|📕 RP био неграмотная 📕|',
      content:
    "[CENTER][FONT=Book Antiqua][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/SIZE][/FONT]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Ваша RolePlay - биография отказана, так как она оформлена неграмотно.[/SIZE][/FONT][/CENTER]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Примечание: Тавтология — это риторическая фигура, представляющая собой необоснованное повторение одних и тех же (или однокоренных) или близких по смыслу слов.[/SIZE][/CENTER][/FONT]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Примечание: Грамматическая ошибка - это ошибка в структуре языковой единицы: в структуре слова, словосочетания или предложения; это нарушение какой-либо грамматической нормы - словообразовательной, морфологической, синтаксической.[/SIZE][/CENTER][/FONT]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Примечание: Пунктуационная ошибка - это неиспользование пишущим необходимого знака препинания или его употребление там, где он не требуется, а также необоснованная замена одного знака препинания другим.[/SIZE][/CENTER][/FONT]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Отказано, закрыто.[/FONT][/COLOR][/SIZE][/CENTER]",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: '|📕 RP био тавтология 📕|',
      content:
    "[CENTER][FONT=Book Antiqua][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/SIZE][/FONT]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Ваша RolePlay - биография отказана, так как она оформлена неграмотно.[/SIZE][/FONT][/CENTER]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Примечание: Тавтология — это риторическая фигура, представляющая собой необоснованное повторение одних и тех же (или однокоренных) или близких по смыслу слов.[/SIZE][/CENTER][/FONT]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Отказано, закрыто.[/FONT][/COLOR][/SIZE][/CENTER]",
       prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
        title: '|📕 RP био знаки препинания 📕|',
      content:
    "[CENTER][FONT=Book Antiqua][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/SIZE][/FONT]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Ваша RolePlay - биография отказана, так как она оформлена неграмотно.[/SIZE][/FONT][/CENTER]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Примечание: Пунктуационная ошибка - это неиспользование пишущим необходимого знака препинания или его употребление там, где он не требуется, а также необоснованная замена одного знака препинания другим.[/SIZE][/CENTER][/FONT]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Отказано, закрыто.[/FONT][/COLOR][/SIZE][/CENTER]",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: '|📕 RP био граммат. ошибки 📕|',
      content:
    "[CENTER][FONT=Book Antiqua][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/SIZE][/FONT]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Ваша RolePlay - биография отказана т.к. она оформлена неграмотно.[/SIZE][/FONT][/CENTER]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Примечание: Грамматическая ошибка - это ошибка в структуре языковой единицы: в структуре слова, словосочетания или предложения; это нарушение какой-либо грамматической нормы - словообразовательной, морфологической, синтаксической.[/SIZE][/CENTER][/FONT]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Отказано, закрыто.[/FONT][/COLOR][/SIZE][/CENTER]",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: '|📕 RP био скопирована 📕|',
      content:
    "[CENTER][FONT=Book Antiqua][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/SIZE][/FONT]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Ваша RolePlay - биография отказана, так как она скопирована.[/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Отказано, закрыто.[/FONT][/COLOR][/SIZE][/CENTER]",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: '|📕 скопирована со своей старой био 📕|',
      content:
    "[CENTER][FONT=Book Antiqua][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/SIZE][/FONT]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Ваша RolePlay - биография отказана, так как она скопирована с вашей прошлой РП Биографии на другой ник. Нужно на новый ник писать новую историю.[/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Отказано, закрыто.[/FONT][/COLOR][/SIZE][/CENTER]",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: '|📕 мало инфо детство 📕|',
      content:
    "[CENTER][FONT=Book Antiqua][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/SIZE][/FONT]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Ваша RolePlay - биография отказана, так как в пункте *Детство* мало информации.[/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Отказано, закрыто.[/FONT][/COLOR][/SIZE][/CENTER]",
      prefix: UNACCEPT_PREFIX,
       status: false,
    },
    {
        title: '|📕 мало инфо юность 📕|',
      content:
    "[CENTER][FONT=Book Antiqua][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/SIZE][/FONT]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Ваша RolePlay - биография отказана, так как в пункте *Юность и Взрослая жизнь* мало информации.[/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Отказано, закрыто.[/FONT][/COLOR][/SIZE][/CENTER]",
      prefix: UNACCEPT_PREFIX,
       status: false,
    },
    {
        title: '|📕 мало инфо 📕|',
      content:
    "[CENTER][FONT=Book Antiqua][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/SIZE][/FONT]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Ваша RolePlay - биография отказана, так как в пункте *Детство* и *Юность и Взрослая жизнь* мало информации.[/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Отказано, закрыто.[/FONT][/COLOR][/SIZE][/CENTER]",
      prefix: UNACCEPT_PREFIX,
       status: false,
    },
    {
      title: '------------------------------------------------------| RP Ситуации |------------------------------------------------------',
      content:
          '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
      },
    {
        title: '|👍 RP сит одобрена 👍|',
      content:
    "[CENTER][FONT=Book Antiqua][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/SIZE][/FONT]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Ваша RolePlay Ситуация одобрена.[/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][COLOR=rgb(127, 255, 0)][SIZE=4]Одобрено, закрыто.[/FONT][/COLOR][/SIZE][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|👎 RP сит отказана 👎|',
      content:
    "[CENTER][FONT=Book Antiqua][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/SIZE][/FONT]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Ваша RolePlay Ситуация отказана.[/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Отказано, закрыто.[/FONT][/COLOR][/SIZE][/CENTER]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
     title: '|👎 Ошибка разделом 👎|',
      content:
    "[CENTER][FONT=Book Antiqua][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/SIZE][/FONT]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Вы ошиблись разделом, это раздел для написания RP-ситуаций.[/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Отказано, закрыто.[/FONT][/COLOR][/SIZE][/CENTER]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|👎 RP сит скопирована 👎|',
      content:
    "[CENTER][FONT=Book Antiqua][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/SIZE][/FONT]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Ваша RolePlay Ситуация отказана, так как она скопирована.[/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Отказано, закрыто.[/FONT][/COLOR][/SIZE][/CENTER]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|👎 RP сит не по форме 👎|',
      content:
    "[CENTER][FONT=Book Antiqua][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/SIZE][/FONT]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Ваша RolePlay Ситуация отказана, так как она составлена не по форме.[/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Отказано, закрыто.[/FONT][/COLOR][/SIZE][/CENTER]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|👎 RP сит тег темы 👎|',
      content:
    "[CENTER][FONT=Book Antiqua][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/SIZE][/FONT]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Ваша RolePlay Ситуация отказана, так как название темы указано не верно[/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Отказано, закрыто.[/FONT][/COLOR][/SIZE][/CENTER]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|👎 RP сит нет смысла 👎|',
      content:
    "[CENTER][FONT=Book Antiqua][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/SIZE][/FONT]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Ваша RolePlay Ситуация отказана, так как в ней нет имеющего смысла.[/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Отказано, закрыто.[/FONT][/COLOR][/SIZE][/CENTER]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: '---------------------------------------------------| Неофициальные RP организации |---------------------------------------------------',
      content:
          '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
      },
      {
        title: '|🔏 Неофиц орг одобрена 🔏|',
      content:
    "[CENTER][FONT=Book Antiqua][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/SIZE][/FONT]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Ваша Неофициальная RolePlay организация одобрена.[/SIZE][/FONT][/CENTER]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Вы должны проявлять активность в организации. Раз в неделю прикрепляйте в данную тему любые скриншоты, видеозаписи об каких либо активных действиях в вашей организации. В случае отсутствия активности организация будет закрыта.[/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][COLOR=rgb(127, 255, 0)][SIZE=4]Одобрено.[/FONT][/COLOR][/SIZE][/CENTER]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|🔐 Неофиц орг отказано 🔐|',
      content:
    "[CENTER][FONT=Book Antiqua][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/SIZE][/FONT]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Ваша Неофициальная RolePlay организация отказана.[/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Отказано, закрыто.[/FONT][/COLOR][/SIZE][/CENTER]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
     title: '|🔒 На доработке 🔒|',
      content:
    "[CENTER][FONT=Book Antiqua][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/SIZE][/FONT]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Ваша Неофициальная RolePlay организация поставлена на доработку.[/SIZE][/FONT][/CENTER]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Вам нужно доработать свою неофиц. организацию и исправить всевозможные ошибки. На это вам даётся 24 часа.[/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][COLOR=rgb(154, 205, 50)][SIZE=4]На доработке.[/FONT][/COLOR][/SIZE][/CENTER]",
      prefix: V_PREFIX,
       status: false,
    },
    {
        title: '|🔐 Не доработал 🔐|',
      content:
    "[CENTER][FONT=Book Antiqua][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/SIZE][/FONT]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Ваша Неофициальная RolePlay организация отказана.[/SIZE][/FONT][/CENTER]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Поскольку вы её не доработали и не исправили ошибки в отведённый срок. [/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Отказано, закрыто.[/FONT][/COLOR][/SIZE][/CENTER]",
      prefix: V_PREFIX,
       status: false,
    },
    {
        title: '|🔐 Нарушает правила 🔐|',
      content:
    "[CENTER][FONT=Book Antiqua][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/SIZE][/FONT]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Ваша Неофициальная RolePlay организация отказана.[/SIZE][/FONT][/CENTER]" +
    "[CENTER][HR][/HR]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Деятельность вашей организации может нарушать какие-либо правила на проекте, что запрещается не только правилами проекта, но и правилами создания неофициальных организаций.[/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Отказано, закрыто.[/FONT][/COLOR][/SIZE][/CENTER]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|🔐 Неофиц орг нет смысла 🔐|',
      content:
    "[CENTER][FONT=Book Antiqua][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/SIZE][/FONT]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Ваша Неофициальная RolePlay организация отказана, так как в ней нет имеющего смысла.[/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Отказано, закрыто.[/FONT][/COLOR][/SIZE][/CENTER]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|🔐 дата создания некорректно 🔐|',
      content:
    "[CENTER][FONT=Book Antiqua][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/SIZE][/FONT]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Ваша неофициальная RolePlay организация отказана, так как дата создания в заголовке указана некорректно.[/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Отказано, закрыто.[/FONT][/COLOR][/SIZE][/CENTER]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|🔐 нет старт состава 3+ человек 🔐|',
      content:
    "[CENTER][FONT=Book Antiqua][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/SIZE][/FONT]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Ваша неофициальная RolePlay организация отказана, так как у вас нет стартового состава из трёх и более человек.[/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Отказано, закрыто.[/FONT][/COLOR][/SIZE][/CENTER]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|🔐 не зарегистрированы 🔐|',
      content:
    "[CENTER][FONT=Book Antiqua][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/SIZE][/FONT]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Ваша неофициальная RolePlay организация отказана, так как указанные вами участники не зарегистрированы на сервере.[/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Отказано, закрыто.[/FONT][/COLOR][/SIZE][/CENTER]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|🔐 Ошибка разделом 🔐|',
      content:
    "[CENTER][FONT=Book Antiqua][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/SIZE][/FONT]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Вы ошиблись разделом, это раздел для создания неофициальных организаций.[/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Отказано, закрыто.[/FONT][/COLOR][/SIZE][/CENTER]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|🔐 не по форме 🔐|',
      content:
    "[CENTER][FONT=Book Antiqua][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/SIZE][/FONT]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Ваша Неофициальная RolePlay организация отказана, так как составлена не по форме.[/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Отказано, закрыто.[/FONT][/COLOR][/SIZE][/CENTER]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|🔐 заголовок не по форме 🔐|',
      content:
    "[CENTER][FONT=Book Antiqua][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/SIZE][/FONT]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Ваша неофициальная RolePlay организация отказана, так как заголовок составлен не по форме.[/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Отказано, закрыто.[/FONT][/COLOR][/SIZE][/CENTER]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|🔐 скопирована 🔐|',
      content:
    "[CENTER][FONT=Book Antiqua][SIZE=4]{{ greeting }}, уважаемый(-ая) {{ user.mention }}.[/SIZE][/FONT]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][SIZE=4]Ваша Неофициальная RolePlay организация отказана, так как она скопирована.[/SIZE][/FONT][/CENTER]" +
    "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
    "[CENTER][FONT=Book Antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Отказано, закрыто.[/FONT][/COLOR][/SIZE][/CENTER]",
       prefix: UNACCEPT_PREFIX,
      status: false,
        },
        {
           title: '-------------------------------------------------------| Отказ жалобы |------------------------------------------------------',
           content:
          '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
        },
        {
            title: '|👾 Ошибка сервером 👾|',
            content:
            "[CENTER][FONT=Book Antiqua][SIZE=4]Доброго времени суток, уважаемый(-ая) {{ user.name }}.[/SIZE][/FONT][/CENTER]" +
            "[CENTER][IMG width=695px]https://i.postimg.cc/q701vmzc/117-20250512071957.png[/IMG]" +
            "[CENTER][FONT=Book Antiqua][SIZE=4]Ошиблись сервером, переношу на нужный.[/SIZE][/FONT][/CENTER]",
            prefix: WAIT_PREFIX,
           status: false,
    },



    ];

  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton('На рассмотрение', 'pin');
    addButton('Одобрить', 'accepted');
    addButton('Отказать', 'unaccept');
    addButton('Закрыть', 'closed');
    addButton('Ответы КФ', 'selectAnswer');

    // Поиск информации о теме
    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
    $('button#closed').click(() => editThreadData(CLOSE_PREFIX, false));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#Texy').click(() => editThreadData(TEX_PREFIX, true));
    $('button#Resheno').click(() => editThreadData(RESHENO_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));

    $('button#selectAnswer').click(() => {
      XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
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
    $('.button--icon--reply').before(
      `<button type="button" class="button rippleButton" id="${id}" style="margin: 3px;">${name}</button>`
    );
  }

  function buttonsMarkup(buttons) {
    return `<div class="select_answer">${buttons
      .map(
        (btn, i) =>
          `<button id="answers-${i}" class="button--primary button rippleButton" style="margin:5px"><span class="button-text">${btn.title}</span></button>`
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
            discussion_open: 0,
            sticky: 1,
            _xfToken: XF.config.csrf,
            _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
            _xfWithData: 1,
            _xfResponseType: 'json',
          }),
        }).then(() => location.reload());
    }
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
})();
