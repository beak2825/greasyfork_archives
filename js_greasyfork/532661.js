// ==UserScript==
// @name         BLACK | Скрипт для Кураторов Форума by J.Murphy (Бирюзовый)
// @namespace    https://forum.blackrussia.online
// @version      2.7
// @description  Последнее обновление (11.04.2025)
// @author       J.Murphy
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @collaborator J.Murphy
// @icon    https://icons.iconarchive.com/icons/google/noto-emoji-food-drink/256/32382-hamburger-icon.png
// @downloadURL https://update.greasyfork.org/scripts/532661/BLACK%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20by%20JMurphy%20%28%D0%91%D0%B8%D1%80%D1%8E%D0%B7%D0%BE%D0%B2%D1%8B%D0%B9%29.user.js
// @updateURL https://update.greasyfork.org/scripts/532661/BLACK%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20by%20JMurphy%20%28%D0%91%D0%B8%D1%80%D1%8E%D0%B7%D0%BE%D0%B2%D1%8B%D0%B9%29.meta.js
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
	const WAIT_PREFIX = 14; // ожидание
    const V_PREFIX = 1; // Префикс "Важно"
    const RED = 98;
    const GREEN = 119;
      const BLUE = 156;
       const YELLOW = 194;
      const ORANGE = 273;
    const PURPLE = 312;
        const LIME = 352;
           const PINK = 394;
           const CHERRY = 435;
      const BLACK = 449;
      const INDIGO = 519;
          const WHITE = 560;
      const MAGENTA = 599;
      const CRIMSON = 640;
       const GOLD = 682;
      const AZURE = 723;
      const PLATINUM = 785;
      const AQUA = 844;
      const GRAY = 885;
      const ICE = 954;
       const CHILL = 994;
     const CHOCO = 1036;
     const MOSCOW = 1082;
     const SPB = 1124;
     const UFA = 1167;
         const SOCHI = 1234;
     const KAZAN = 1276;
     const SAMARA= 1320;
    const ROSTOV= 1362;
     const ANAPA = 1402;
       const EKB = 1444;
      const KRASNODAR = 1488;
     const ARZAMAS = 1531;
      const NOVOSIBIRSK = 1572;
          const GROZNY = 1614;
      const SARATOV = 1653;
    const OMSK = 1698;
     const IRKUTSK= 1740;
      const VOLGOGRAD= 1786;
        const VORONEZH= 1828;
       const BELGOROD= 1870;
     const MAKHACHKALA = 1912;
     const VLADIKAVKAZ = 1954;
     const VLADIVOSTOK = 1996;
     const KALININGRAD = 2038;
     const CHELYABINSK = 2080;
     const KRASNOYARSK = 2122;
     const CHEBOKSARY = 2164;
     const KHABAROVSK = 2206;
    const PERM = 2248;
     const TULA = 2290;
     const RYAZAN= 2332;
     const MURMANSK = 2374;
       const PENZA = 2416;
          const KURSK = 2458;
        const ARKHANGELSK= 2500;
     const ORENGURG = 2545;
       const KIROV = 2584;
           const KEMEROVO= 2626;
     const TYUMEN= 2663;
      const TOLYATTI= 2702;
      const IVANOVO= 2735;
      const STAVROPOL = 2767;
    const SMOLENSK = 2799;
     const PSKOV = 2831;
     const BRYANSK = 2863;
         const OREL = 2895;
    const YAROSLAVL = 2927;
        const BARNAUL = 2959;
       const LIPETSK = 2991;
      const ULYANOVSK = 3023;
     const YAKUTSK = 3055;
      const TAMBOV = 3309;
      const BRATSK = 3344;
      const ASTRAKHAN = 3379;
    const CHITA = 3414;
    const KOSTROMA = 3449;
     const VLADIMIR = 3484;
     const KALUGA = 3519;
      const NOVGOROD = 3555;
      const TAGANROG = 3590;
     const VOLOGDA = 3625;
      const TVER= 3666;
     const TOMSK = 3728;
       const ISHEVSK = 3767;
     const SURGUT = 3800;
     const PODOLSK = 3837;
     const MAGADAN = 3932;
    const CHEREPOVETS = 3967;
const buttons = [

     {
            title: '----| ответы обозначенные 💥, могут отвечать только ГКФ/ЗГКФ|----',
      content:
          '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
      },
     {
            title: '----| ответы обозначенные ✅,💫 могут отвечать кф отвечающие за жб|----',
      content:
          '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
      },



    {
            title: '----------------------------------------------------------------| CHAT ---------------------------------------------------------------',
      content:
          '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
      },

{
        title: '|💥 3.04 7 дней 💥|',
      content:
      "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]По результатам проверки жалобы установлено нарушение правил. В соответствии с пунктом [COLOR=rgb(255, 0, 0)]3.04[/COLOR] общих правил серверов нарушителю назначена блокировка аккаунта на [COLOR=rgb(255, 0, 0)]7 дней[/COLOR]. В случае повторных нарушений могут быть применены более строгие меры.[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]3.04.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено косвенное упоминание и оскорбление родных вне зависимости от чата (IC или OOC) [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 120 минут / Ban 7-15 дней [COLOR=rgb(255, 0, 0)][/COLOR] [/COLOR][/SIZE][/FONT][/SPOILER]" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] термины «MQ», «rnq» расценивается как упоминание родных. [/SIZE][/FONT][/COLOR]<br><br>" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] если упоминание и оскорбление родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления. [/SIZE][/FONT][/COLOR]<br><br>" +
    "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
    "[HEADING=3][CENTER][B][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 255, 200)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },

   {
        title: '|💥 3.04 15 дней 💥|',
      content:
      "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]По результатам проверки жалобы установлено нарушение правил. В соответствии с пунктом [COLOR=rgb(255, 0, 0)]3.04[/COLOR] общих правил серверов нарушителю назначена блокировка аккаунта на [COLOR=rgb(255, 0, 0)]15 дней[/COLOR] [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]3.04.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено косвенное упоминание и оскорбление родных вне зависимости от чата (IC или OOC) [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 120 минут / Ban 7-15 дней [COLOR=rgb(255, 0, 0)][/COLOR] [/COLOR][/SIZE][/FONT][/SPOILER]" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] термины «MQ», «rnq» расценивается как упоминание родных. [/SIZE][/FONT][/COLOR]<br><br>" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] если упоминание и оскорбление родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления. [/SIZE][/FONT][/COLOR]<br><br>" +
    "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
    "[HEADING=3][CENTER][B][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 255, 200)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },

  {
        title: '|💥 3.04 МУТ 120 💥|',
      content:
      "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]По результатам проверки жалобы установлено нарушение правил. В соответствии с пунктом [COLOR=rgb(255, 0, 0)]3.04[/COLOR] общих правил серверов нарушителю назначена блокировка чата на [COLOR=rgb(255, 0, 0)]120 минут[/COLOR]. В случае повторных нарушений могут быть применены более строгие меры.[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]3.04.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено косвенное упоминание и оскорбление родных вне зависимости от чата (IC или OOC) [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 120 минут / Ban 7-15 дней [COLOR=rgb(255, 0, 0)][/COLOR] [/COLOR][/SIZE][/FONT][/SPOILER]" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] термины «MQ», «rnq» расценивается как упоминание родных. [/SIZE][/FONT][/COLOR]<br><br>" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] если упоминание и оскорбление родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления. [/SIZE][/FONT][/COLOR]<br><br>" +
    "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
    "[HEADING=3][CENTER][B][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 255, 200)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
  {
        title: '|💥2.54 Оск Адм 💥|',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/q79d1ngk/image2-3-1-1-1-10.gif[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Нарушитель понесёт наказание, предусмотренное соответствующим пунктом общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]3.04.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещены любые формы неуважительного обращения, неадекватного поведения и угроз в адрес администрации, независимо от их характера и способа выражения.  [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 180 минут [/COLOR][/SIZE][/FONT][/SPOILER]" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Пример: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] Также недопустимо использование оскорбительных или пренебрежительных формулировок при подаче жалоб, например: 'Быстро почини меня', 'Админы, вы задрали', 'Когда работать будете', 'Мозги включите', 'Я вас уволю сейчас'. Подобное поведение рассматривается как нарушение установленных правил и влечёт за собой соответствующие меры ответственности. [/SIZE][/FONT][/COLOR]"+
    "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][B][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(0, 255, 200)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 255, 200)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
      title: '|💥2.35 Оск религии/нации 💥|',
      content:
        "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Нарушитель понесёт наказание, предусмотренное соответствующим пунктом общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]2.35.[/COLOR][COLOR=rgb(209, 213, 216)] На игровых серверах строго запрещены любые IC и OOC конфликты, связанные с национальными или религиозными разногласиями. Это касается любых форм взаимодействия, включая высказывания, намёки или действия, нарушающие принципы уважения и равенства. Нарушение правила повлечёт строгое наказание.[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 120 минут / Ban 7 дней [/COLOR][/SIZE][/FONT][/SPOILER]<br>" +
    "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
         "[HEADING=3][CENTER][B][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(0, 255, 200)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 255, 200)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
     },
       {
      title: '|💥2.19 СОФТ ГОЛОС 💥|',
      content:
        "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Нарушитель понесёт наказание, предусмотренное соответствующим пунктом общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]2.19.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено использование любого софта для изменения голоса [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | | Mute 60 минут [/COLOR][/SIZE][/FONT][/SPOILER]<br>" +
    "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
         "[HEADING=3][CENTER][B][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(0, 255, 200)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 255, 200)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
     },
{
        title: '|💥3.21 РЕКЛАМА ПРОМОКОДА 💥|',
      content:
        "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.21.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Ban 30 дней [/COLOR][/SIZE][/FONT][/SPOILER]<br>" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] чаты семейные, строительных компаний, транспортных компаний, фракционные чаты, IC, OOC, VIP и так далее. [/SIZE][/FONT][/COLOR]<br>" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] промокоды, предоставленные разработчиками, а также распространяемые через официальные ресурсы проекта. [/SIZE][/FONT][/COLOR]<br>" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Исключение: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] если игрок упомянет промокод, распространяемый через официальную публичную страницу ВКонтакте либо через официальный Discord в любом из чатов, наказание ему не выдается. [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },


    {
        title: '|💥 3.02 CAPS 💥|',
      content:
        "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]3.02.[/COLOR][COLOR=rgb(209, 213, 216)]На игровых серверах запрещено использование текста, полностью написанного заглавными буквами (CapsLock), во всех чатах. Такой стиль написания считается несоответствующим правилам общения, поскольку затрудняет восприятие текста и нарушает общую гармонию коммуникации. Соблюдение этого правила способствует поддержанию удобного и приятного общения между игроками. [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 30 минут [/COLOR][/SIZE][/FONT][/SPOILER]<br>" +
    "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 255, 200)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
        title: '|💥2.18 MG 💥|',
      content:
        "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]2.18.[/COLOR][COLOR=rgb(209, 213, 216)]Запрещено использовать метагейминг (MG) — применение информации из OOC, которая недоступна вашему персонажу в рамках IC процесса. Такое поведение нарушает границы игрового процесса и мешает созданию правдоподобной ролевой атмосферы.[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 30 минут [/COLOR][/SIZE][/FONT][/SPOILER]<br>" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]использование смайлов в виде символов «))», «=D» запрещено в IC чате.[/SIZE][/FONT][/COLOR]" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]телефонное общение также является IC чатом.[/SIZE][/FONT][/COLOR]" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]за написанный однократно вопросительный «?» или восклицательный «!» знак в IC чате, наказание не выдается.[/SIZE][/FONT][/COLOR]" +
    "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 255, 200)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|💥 3.05 Flood 💥|',
      content:
        "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]3.05.[/COLOR][COLOR=rgb(209, 213, 216)]Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 30 минут [/COLOR][/SIZE][/FONT][/SPOILER]<br>" +
    "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 255, 200)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
        title: '|💥2.40 Оск Проекта 💥|',
      content:
        "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]2.40.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором) [/COLOR][/SIZE][/FONT][/SPOILER]<br>" +
   "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
    "[HEADING=3][CENTER][B][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 255, 200)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
       title: '|💥3.23 Мат в Vip chat 💥|',
      content:
        "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]3.23.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 30 минут [/COLOR][/SIZE][/FONT][/SPOILER]<br>" +
     "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
         "[HEADING=3][CENTER][B][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(0, 255, 200)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 255, 200)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
 {
        title: '|💥3.18 Полит Пропаганда 💥|',
      content:
        "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]3.18.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено политическое и религиозное пропагандирование [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 120 минут / Ban 10 дней [/COLOR][/SIZE][/FONT][/SPOILER]<br>" +
    "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(0, 255, 200)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 255, 200)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|💥2.35 Политика 💥|',
      content:
        "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]2.35.[/COLOR][COLOR=rgb(209, 213, 216)] На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 120 минут / Ban 7 дней [/COLOR][/SIZE][/FONT][/SPOILER]<br>" +
    "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|💥2.31 Реклама 💥|',
      content:
        "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]2.31.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Ban 7 дней / PermBan [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
     "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|💥4.04 Редактирование в лич целях 💥|',
      content:
        "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]4.04.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Ban 7 дней + ЧС организации [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
      "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|💥3.20 Транслит 💥|',
      content:
        "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]3.20.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено использование транслита в любом из чатов [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 30 минут [/COLOR][/SIZE][/FONT][/SPOILER]<br>" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Пример: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]«Privet», «Kak dela», «Narmalna».[/SIZE][/FONT][/COLOR]<br>" +
  "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
        title: '|💥 3.06 Злоуп знаком 💥|',
      content:
        "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]3.06.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено злоупотребление знаков препинания и прочих символов [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)]][SIZE=4][FONT=georgia] | Mute 30 минут [/COLOR][/SIZE][/FONT][/SPOILER]<br>" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Пример: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] «???????», «!!!!!!!», «Дааааааааааааааааааааааа» и так далее.[/SIZE][/FONT][/COLOR]<br>" +
      "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|💥 3.10 Выдача себя за Адм 💥|',
      content:
        "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]3.10.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещена выдача себя за администратора, если таковым не являетесь [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Ban 7 - 15 + ЧС администрации [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
      "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|💥 3.08 Слив глобального чата 💥|',
      content:
        "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]3.08.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещены любые формы «слива» посредством использования глобальных чатов [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | PermBan [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
     "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 255, 200)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
 {
      title: '|💥 3.14 Музыка в войс чате 💥|',
      content:
        "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]3.14.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено включать музыку в Voice Chat  [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 60 минут [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
       "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
     },
{
      title: '|💥 3.16 ШУМ В ВОЙС ЧАТЕ 💥|',
      content:
        "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]3.16.[/COLOR][COLOR=rgb(209, 213, 216)]  Запрещено создавать посторонние шумы или звуки  [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 30 минут [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
       "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
     },
     {
        title: '|💥 2.38 Распространение личной информации 💥|',
      content:
     "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]2.38.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено распространять личную информацию игроков и их родственников. [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia]  | Ban 15 - 30 дней / PermBan + ЧС проекта [/COLOR][/SIZE][/FONT][/SPOILER]<br>" +
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]распространение личной информации пользователя без его согласия запрещено.[/SIZE][/FONT][/COLOR]<br>" +
   "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 255, 200)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
 {
        title: '|💥 3.11 Ввод в заблуждение 💥|',
      content:
     "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]3.11. [/COLOR][COLOR=rgb(209, 213, 216)] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia]  | Ban 15 - 30 дней / PermBan  [/COLOR][/SIZE][/FONT][/SPOILER]<br>" +
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]/me чтобы поднять кошелек введите /pay 228 5000. Для продажи автомобиля введите /sellmycar id 2828 (счёт в банке) цена..[/SIZE][/FONT][/COLOR]<br>" +
   "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 255, 200)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|💥 2.37. ОСС УГРозы 💥|',
      content:
     "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]2.37. [/COLOR][COLOR=rgb(209, 213, 216)]Запрещены OOC-угрозы, в том числе и завуалированные, а также угрозы наказанием со стороны администрации [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Mute 120 минут / Ban 7 - 15 дней. [/COLOR][/SIZE][/FONT][/SPOILER]<br>" +
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]блокировка аккаунта выдаётся в случае, если есть прямые угрозы жизни, здоровью игрока или его близким. По решению главного администратора может быть выдана перманентная блокировка.[/SIZE][/FONT][/COLOR]<br>" +
   "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 255, 200)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    { title: '----------------------------------------------------------------| RolePlay |----------------------------------------------------------------',
      content:
          '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
      },
{
        title: '|💥2.05 NRP Oбман 💥|',
      content:
      "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]2.05.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Permban [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации. [/SIZE][/FONT][/COLOR]<br><br>" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны). [/SIZE][/FONT][/COLOR]<br><br>" +
    "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
    "[HEADING=3][CENTER][B][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 255, 200)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },

    {
        title: '|💥2.22 Стороннее ПО 💥|',
      content:
        "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]2.22.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Ban 15 - 30 дней / PermBan [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] запрещено внесение любых изменений в оригинальные файлы игры. [/SIZE][/FONT][/COLOR]<br><br>" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Исключение: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] разрешено изменение шрифта, его размера и длины чата (кол-во строк). [/SIZE][/FONT][/COLOR]<br><br>" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Исключение: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] блокировка за включенный счетчик FPS не выдается. [/SIZE][/FONT][/COLOR]<br><br>" +
   "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 255, 200)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|💥2.09 СЛИВ СКЛАДА/СОСТАВА СЕМЬИ 💥|',
      content:
        "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]2.09.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле, а также запрещено исключение всех или части игроков из состава семьи без ведома лидера также считается сливом [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Ban 15 - 30 дней / PermBan [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
     "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 255, 200)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|💥3.04 долг 💥|',
      content:
        "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(255, 0, 0)]3.04.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещается брать в долг игровые ценности и не возвращать их. [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Ban 30 дней / permban [/COLOR][/SIZE][/FONT][/SPOILER]<br>" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется; [/SIZE][/FONT][/COLOR]<br>" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда; [/SIZE][/FONT][/COLOR]<br>" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами. [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '|💥4.09 Оск ник 💥|',
      content:
        "[CENTER]"+
  "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]4.09.[/COLOR][COLOR=rgb(209, 213, 216)]   Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Устное замечание + смена игрового никнейма / PermBan. [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
     "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
      title: '|💥4.10 Фейк акк 💥|',
      content:
        "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]4.10.[/COLOR][COLOR=rgb(209, 213, 216)]  Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Устное замечание + смена игрового никнейма / PermBan. [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
   "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(0, 255, 200)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 255, 200)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
      },
{
      title: '|✅2.19 DM ✅|',
      content:
      "[CENTER]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
     "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
     "[HEADING=3][SPOILER][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]2.19.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4] | Jail 60 минут[/SIZE][/FONT][/COLOR][/SPOILER][/HEADING]<br><br>" +
     "[CENTER][I][B][FONT=georgia][COLOR=rgb(0, 255, 200)][SIZE=4]Примечание: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/SIZE][/COLOR][/I][/B][/FONT]<br><br>" +
     "[CENTER][I][B][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/SIZE][/I][/B][/FONT][/COLOR]<br><br>" +
   "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia][COLOR=rgb(0, 255, 200)]SERVER[/COLOR] [COLOR=rgb(0, 255, 200)][/COLOR] [/FONT][/SIZE][/COLOR][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]BLACK[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]"+
     "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br><br>",
        prefix: ACCEPT_PREFIX,
       status: false,
     },
 {
        title: '|✅2.13 DB ✅|',
      content:
      "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]2.13.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Jail 60 минут [/COLOR][/SIZE][/FONT][/SPOILER]<br>" +
  "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br><br>",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
 {
        title: '|✅2.20 Mass DM ✅|',
      content:
       "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]2.20.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Warn / Ban 3 - 7 дней [/COLOR][/SIZE][/FONT][/SPOILER]<br>" +
   "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br><br>",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
 {
        title: '|✅2.15 TK ✅|',
      content:
        "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]2.15.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Jail 60 минут / Warn (за два и более убийства)[/COLOR][/SIZE][/FONT][/SPOILER]<br>" +
   "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
    "[HEADING=3][CENTER][B][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(0, 255, 200)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 255, 200)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>"+
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|✅2.16 SK ✅|',
      content:
       "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]2.16.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Jail 60 минут / Warn (за два и более убийства) [/COLOR][/SIZE][/FONT][/SPOILER]<br>" +
    "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 255, 200)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
        title: '|✅2.17 PG ✅|',
      content:
       "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]2.17.[/COLOR]][COLOR=rgb(209, 213, 216)] Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia]  | Jail 30 минут [/COLOR][/SIZE][/FONT][/SPOILER]<br>" +
    "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
        title: '|✅2.01 Nrp поведение✅|',
      content:
     "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]2.01.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено поведение, нарушающее нормы процессов Role Play режима игры[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia]  | Jail 30 минут [/COLOR][/SIZE][/FONT][/SPOILER]<br>" +
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]ездить на крышах транспортных средств, бегать или ходить по столам в казино, целенаправленная провокация сотрудников правоохранительных органов с целью развлечения, целенаправленная помеха в проведении различных собеседований и так далее.[/SIZE][/FONT][/COLOR]<br>" +
   "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 255, 200)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|✅2.02 Уход от RP ✅|',
      content:
       "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]2.02.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] |Jail 30 минут / Warn [/COLOR][/SIZE][/FONT][/SPOILER]<br>" +
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания или ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснуться Вашего персонажа. Уходить в интерьер или зеленую зону во время перестрелки с целью избежать смерти или уйти от Role Play процесса и так далее.[/SIZE][/FONT][/COLOR]<br>" +
   "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 255, 200)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|✅2.03 NRP drive ✅|',
      content:
        "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]2.03.[/COLOR][COLOR=rgb(209, 213, 216)]Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Jail 30 минут [/COLOR][/SIZE][/FONT][/SPOILER]<br>" +
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] езда на скутере по горам, езда на любом транспортном средстве по встречным полосам, нарушая все правила дорожного движения без какой-либо причины, намеренное создание аварийных ситуаций на дорогах и так далее.[/SIZE][/FONT][/COLOR]<br>" +
   "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 255, 200)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
 {
        title: '|✅2.47 fdrive ✅|',
      content:
      "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]2.47.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора)[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Jail 60 минут [/COLOR][/SIZE][/FONT][/SPOILER]<br>" +
  "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 255, 200)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|✅2.21 Багоюз ✅|',
      content:
       "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]2.21.[/COLOR][COLOR=rgb(0, 255, 127)] Запрещено пытаться обходить игровую систему или использовать любые баги сервера[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Ban 15 - 30 дней / PermBan [/COLOR][/SIZE][/FONT][/SPOILER]<br>" +
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] под игровой системой подразумеваются функции и возможности, которые реализованы в игре для взаимодействия между игроками, а также взаимодействия игроков с функциями, у которых есть свое конкретное предназначение.[/SIZE][/FONT][/COLOR]<br>" +
   "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|✅2.55 Багоюз Аним ✅|',
      content:
     "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]2.55.[/COLOR][COLOR=rgb(209, 213, 216)]Запрещается багоюз связанный с анимацией в любых проявлениях.[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Jail 60 / 120 минут [/COLOR][/SIZE][/FONT][/SPOILER]<br>" +
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]если игрок, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде Jail на 120 минут. Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками. [/SIZE][/FONT][/COLOR]<br>" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]если игрок использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде Jail на 60 минут. [/SIZE][/FONT][/COLOR]<br>" +
   "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|✅6.03 Nrp коп ✅|',
      content:
       "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]6.03.[/COLOR][COLOR=rgb(209, 213, 216)]Запрещено поведение не подражающее полицейскому[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Warn [/COLOR][/SIZE][/FONT][/SPOILER]<br>" +
    "[HEADING=3][CENTER][/CENTER][/HEADING]" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/I][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] поведение, не соответствующее сотруднику УМВД/ГИБДД/ФСБ.[/SIZE][/FONT][/COLOR]<br>" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Пример: [/SIZE][/FONT][/COLOR][/I]<br>" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(209, 213, 216)]* Открытие огня по игрокам без причины;[/COLOR][/SIZE][/FONT]" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(209, 213, 216)]* Расстрел машин без причины;[/COLOR][/SIZE][/FONT]" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(209, 213, 216)]* Нарушение ПДД без причины;[/COLOR][/SIZE][/FONT]" +
    "[FONT=georgia][SIZE=4][COLOR=rgb(209, 213, 216)]* Сотрудник на служебном транспорте кричит о наборе в свою семью на спавне.[/COLOR][/SIZE][/FONT]<br>" +
  "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 255, 200)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
{
        title: '|✅ Nrp ВЧ ✅|',
      content:
     "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(209, 213, 216)]2. За нарушение правил нападения на Войсковую Часть выдаётся предупреждение [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ) [/COLOR][/SIZE][/FONT][/SPOILER]<br>" +
     "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
        title: '|✅2.54 NRP АКСЕССУАР ✅|',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/q79d1ngk/image2-3-1-1-1-10.gif[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Нарушитель понесёт наказание, предусмотренное соответствующим пунктом общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]2.54.[/COLOR][COLOR=rgb(209, 213, 216)]Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера  [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут. [/COLOR][/SIZE][/FONT][/SPOILER]" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Пример: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] слишком большие аксессуары на голове персонажа, имитация гитарой половых органов и тому подобное. [/SIZE][/FONT][/COLOR]"+
    "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][B][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(0, 255, 200)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 255, 200)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '|✅ 2.04 помеха рп процессу ✅|',
      content:
      "[CENTER][IMG width=695px]https://i.postimg.cc/q79d1ngk/image2-3-1-1-1-10.gif[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]" +
     "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
     "[HEADING=3][SPOILER][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]2.04.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4] | Ban 10 дней / Обнуление аккаунта (при повторном нарушении).[/SIZE][/FONT][/COLOR][/SPOILER][/HEADING]<br><br>" +
     "[CENTER][I][B][FONT=georgia][COLOR=rgb(0, 255, 200)][SIZE=4]Пример: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Таран дальнобойщиков, инкассаторов под разными предлогами.[/SIZE][/COLOR][/I][/B][/FONT]<br><br>" +
    "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][B][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(0, 255, 200)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 255, 200)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix: ACCEPT_PREFIX,
       status: false,
     },
      {
        title: '|✅ 2.11 ФРАКЦИОННОЕ ТС В ЛИЧ ЦЕЛЯХ ✅|',
      content:
     "[CENTER][IMG width=695px]https://i.postimg.cc/q79d1ngk/image2-3-1-1-1-10.gif[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][SPOILER][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]2.11.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] Запрещено использование рабочего или фракционного транспорта в личных целях[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia]  | Jail 30 минут [/COLOR][/SIZE][/FONT][/SPOILER]<br>" +
  "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][B][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(0, 255, 200)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 255, 200)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },

    {
        title: '|✅ 2.50 АРЕСТ В ИНТЕРЬЕРЕ ✅|',
      content:
     "[CENTER][IMG width=695px]https://i.postimg.cc/q79d1ngk/image2-3-1-1-1-10.gif[/IMG]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    '[HEADING=3][CENTER][/CENTER][/HEADING]'+
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][SPOILER][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]2.50.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4] | Ban 7 - 15 дней + увольнение из организации [/SIZE][/FONT][/COLOR][/SPOILER][/HEADING]<br><br>" +
   "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][B][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(0, 255, 200)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 255, 200)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },

    {
      title: '|✅ 6.02 розыск без причины ✅|',
      content:
  "[CENTER][IMG width=695px]https://i.postimg.cc/q79d1ngk/image2-3-1-1-1-10.gif[/IMG]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
     "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
     "[HEADING=3][SPOILER][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]6.02.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] Запрещено выдавать розыск без Role Play причины.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4] | Warn[/SIZE][/FONT][/COLOR][/SPOILER][/HEADING]<br><br>" +
    "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]"+
    "[HEADING=3][CENTER][B][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(0, 255, 200)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 255, 200)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix: ACCEPT_PREFIX,
       status: false,
     },
    {
        title: '|✅1.13 Гос в каз/раб ✅|',
      content:
        "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Нарушитель будет наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[SPOILER][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]1.13.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено работать или находится в казино/платных контейнерах в форме Гос.[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=georgia] | Jail 30 минут [/COLOR][/SIZE][/FONT][/SPOILER]<br>" +
    "[CENTER][I][B][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Исключение: [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4] В форме ОПГ разрешается. [/SIZE][/FONT][/COLOR]<br>" +
    "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=#00FF00][I][B][FONT=georgia][SIZE=4]Одобрено![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: ACCEPT_PREFIX,
      status: false,
    },

    {
       title: '----------------------------------------------------| Передача жалобы от игроков |----------------------------------------------------',
       content:
          '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
    },
    {
      title: '|💫 ГКФ/ЗГКФ 💫|',
      content:
       "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[COLOR=rgb(0, 255, 200)][I][FONT=georgia][SIZE=4]Ваша жалоба переадресована [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(0, 255, 200)][I][FONT=georgia][SIZE=4]ГКФ @Nikita_Guobrozul , ЗГКФ @Esenia_Dolmatova [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(0, 255, 200)][I][FONT=georgia][SIZE=4], ожидайте ответа в данной теме.[/SIZE][/FONT]<br><br>" +
    "[SPOILER][I][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 255, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: PIN_PREFIX,
      status: false,
    },

     {
      title: '|💫 ГКФ 💫|',
      content:
       "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[COLOR=rgb(0, 255, 200)][I][FONT=georgia][SIZE=4]Уважаемый пользователь, ваше обращение было рассмотрено и переадресовано [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(0, 255, 200)][I][FONT=georgia][SIZE=4] Главному Куратору форума, @Nikita_Guobrozul [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(0, 255, 200)][I][FONT=georgia][SIZE=4]. Он ознакомится с вашей жалобой и предоставит ответ в ближайшее время. Пожалуйста, следите за обновлениями в данной теме. Благодарим за ваше терпение и понимание![/SIZE][/FONT]<br><br>" +
    "[SPOILER][I][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 255, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: PIN_PREFIX,
      status: false,
    },
    {
        title: '|💫 Техническому специалисту 💫|',
      content:
         "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[COLOR=rgb(0, 255, 200)][I][FONT=georgia][SIZE=4]Ваша жалоба переадресована [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(0, 255, 200)][I][FONT=georgia][SIZE=4]Техническому Специалисту [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(0, 255, 200)][I][FONT=georgia][SIZE=4], ожидайте ответа в данной теме.[/SIZE][/FONT]<br><br>" +
    "[SPOILER][I][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
   "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 255, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: TEX_PREFIX,
      status: false,
    },
    {
      title: '|💫 Кураторам Администрации 💫|',
      content:
        "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[COLOR=rgb(0, 255, 200)][I][FONT=georgia][SIZE=4]Ваша жалоба переадресована [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(0, 255, 200)][I][FONT=georgia][SIZE=4]Кураторам @Joseph Murphy, @Greenfield Stoyn [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(0, 255, 200)][I][FONT=georgia][SIZE=4], ожидайте ответа в данной теме.[/SIZE][/FONT]<br><br>" +
    "[SPOILER][I][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
   "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 255, 200)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 255, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: PIN_PREFIX,
      status: false,
    },
     {
     title: '💫 В жб на теха 💫|',
     content:
    "[CENTER]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
     "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Вы ошиблись разделом, обратитесь в раздел жалоб на технических специалистов - [/I][URL='https://forum.blackrussia.online/index.php?forums/Сервер-№10-black.1191/']*Нажмите сюда*[/URL][/SIZE][/FONT][/COLOR][/B][/I][/CENTER][/HEADING]<br><br>" +
     "[FONT=georgia][SPOILER][SIZE=4][I][COLOR=rgb(0, 255, 200)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT][/SPOILER]<br><br>" +
     "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 255, 200)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
     "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix: CLOSE_PREFIX,
        status: false,
   },
    {
        title: '|💫 В жб на администрацию 💫|',
        content:
     "[CENTER]"+
     "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
     "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Вы ошиблись разделом, обратитесь в раздел жалоб на администрацию - [/I][URL='https://forum.blackrussia.online/index.php?forums/Жалобы-на-администрацию.468/']*Нажмите сюда*[/URL][/SIZE][/FONT][/COLOR][/B][/I][/CENTER][/HEADING]<br><br>" +
     "[FONT=georgia][SPOILER][SIZE=4][I][COLOR=rgb(0, 255, 200)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT][/SPOILER]<br><br>" +
   "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
     "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
          prefix: CLOSE_PREFIX,
          status: false,
  },
    {
        title: '|💫 В жБ на Агентов Поддержки 💫|',
        content:
       "[CENTER]"+
          "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
          "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Вы ошиблись разделом, обратитесь в раздел жалоб на хелперов - [/I][URL='https://forum.blackrussia.online/threads/black-Жалобы-на-Агентов-Поддержки-Для-Игроков.4847458/page-3#post-22446785']*Нажмите сюда*[/URL][/SIZE][/FONT][/COLOR][/B][/I][/CENTER][/HEADING]<br><br>" +
          "[FONT=georgia][SPOILER][SIZE=4][I][COLOR=rgb(0, 255, 200)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
         "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
          "" +
          "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто![/SIZE][/FONT][/B][/COLOR][/CENTER][/HEADING]",
       prefix: CLOSE_PREFIX,
       status: false,
  },
    {
        title: '|💫 В ЖБ НА ЛИДЕРОВ 💫|',
        content:
     "[CENTER]"+
        "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
        "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Вы ошиблись разделом, обратитесь в раздел жалоб на лидеров - [/I][URL='https://forum.blackrussia.online/index.php?forums/Жалобы-на-лидеров.469/']*Нажмите сюда*[/URL][/SIZE][/FONT][/COLOR][/B][/I][/CENTER][/HEADING]<br><br>" +
        "[FONT=georgia][SPOILER][SIZE=4][I][COLOR=rgb(0, 255, 200)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT][/SPOILER]<br><br>" +
       "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
        "" +
        "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
         prefix: CLOSE_PREFIX,
         status: false,
   },
    {
        title: '|💫 В ЖБ на сотрудников 💫|',
        content:
           "[CENTER]"+
           "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
           "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Вы ошиблись разделом, обратитесь в раздел жалоб на сотрудников в разделе вашей организации.[/SIZE][/FONT][/COLOR][/B][/I][/CENTER][/HEADING]<br><br>" +
           "[FONT=georgia][SPOILER][SIZE=4][I][COLOR=rgb(0, 255, 200)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT][/SPOILER]<br><br>" +
          "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
           "" +
           "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
           prefix: CLOSE_PREFIX,
           status: false,
    },
     {
        title: '|💫 В ОБЖАЛОВАНИЕ 💫|',
        content:
        "[CENTER]"+
           "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
           "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Вы ошиблись разделом, обратитесь в раздел обжалований наказаний - [/I][URL='https://forum.blackrussia.online/index.php?forums/Обжалование-наказаний.471/']*Нажмите сюда*[/URL][/SIZE][/FONT][/COLOR][/B][/I][/CENTER][/HEADING]<br><br>" +
           "[FONT=georgia][SPOILER][SIZE=4][I][COLOR=rgb(0, 255, 200)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT][/SPOILER]<br><br>" +
           "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
           "" +
           "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: CLOSE_PREFIX,
       status: false,
      },
    {
         title: '|💫 В ТЕХ РАЗДЕЛ 💫|',
      content:
   "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Вы ошиблись разделом, обратитесь в технический раздел - [/I][URL='https://forum.blackrussia.online/index.php?forums/Технический-раздел-black.488/']*Нажмите сюда*[/URL][/SIZE][/FONT][/COLOR][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[FONT=georgia][SPOILER][SIZE=4][I][COLOR=rgb(0, 255, 200)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Закрыто![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: CLOSE_PREFIX,
      status: false,
    },

    {
      title: '----------------------------------------------------| Отказ жалоб на игроков |----------------------------------------------------',
      content:
          '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
      },
   {
        title: '|💥 СШ набор букв 💥|',
      content:
       "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Выражение  СШ не содержит явного оскорбления и может рассматриваться как набор букв. В правилах проекта нет конкретного запрета на его использование, однако в зависимости от контекста администрация оставляет за собой право принимать меры в случае нарушения норм общения. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][I][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
      "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|💥 Подделка доказательств 💥|',
      content:
       "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] После тщательной проверки предоставленных вами доказательств было установлено, что они являются поддельными и созданы с использованием графических редакторов (фотошоп). В связи с нарушением правил нашего форума, касающихся достоверности информации и честного взаимодействия, ваш форумный аккаунт будет  заблокирован. Мы призываем всех пользователей соблюдать правила и предоставлять только достоверные данные. Спасибо за понимание. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][I][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
      "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
       prefix: UNACCEPT_PREFIX,
      status: false,
    },

    {
        title: '|✅ Недостаточно док ✅|',
      content:
      "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Ваша жалоба рассмотрена, но, к сожалению, представленных доказательств недостаточно для объективного решения. Чтобы мы могли принять меры, пожалуйста, добавьте дополнительные материалы (скриншоты, видео, и т. д.), подтверждающие ваши слова. Без достаточных доказательств жалоба не может быть удовлетворена. Вы можете подать новую жалобу с более полными данными. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][I][SIZE=4][COLOR=rgb(0, 255, 200)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/SIZE][/I][/FONT][/SPOILER]<br><br>" +
     "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
        "[HEADING=3][CENTER][B][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 255, 200)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
"[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
     {
        title: '|✅ Никнейм ✅|',
      content:
      "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Никнейм, указанный в форме, отличается от никнейма, зафиксированного в доказательствах нарушения. Пожалуйста, уточните информацию. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][I][COLOR=rgb(0, 255, 200)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
   "[HEADING=3][CENTER][B][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 255, 200)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
     {
        title: '|✅ нецензурный заголовок ✅|',
      content:
      "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Ваша жалоба отклонена, так как в заголовке содержится нецензурная лексика и некорректное оформление. Обратите внимание, что за подобные нарушения ваш форумный аккаунт будет заблокирован.  [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][I][COLOR=rgb(0, 255, 200)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
   "[HEADING=3][CENTER][B][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 255, 200)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
      {
        title: '|✅ Отсутствуют док-ва ✅|',
      content:
      "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Отсутствуют доказательства - следовательно, рассмотрению не подлежит. Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][I][COLOR=rgb(0, 255, 200)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
   "[HEADING=3][CENTER][B][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 255, 200)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },

    {
        title: '|✅ ДОК-ВА IMGUR ✅|',
      content:
   "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Ваши доказательства не удалось открыть. Загрузите материалы на фото-видеохостинг Imgur и создайте новую жалобу с актуальными ссылками. Это позволит нам быстрее и точнее рассмотреть ваше обращение. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][I][COLOR=rgb(0, 255, 200)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT][/SPOILER]<br><br>" +
      "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 255, 200)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|✅ ДОК-ВА В YAPX ✅|',
      content:
      "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Ваши доказательства не открываются. Пожалуйста, загрузите материалы на фотовидеохостинг YAPX и подайте новую жалобу с актуальными ссылками. Это позволит нам оперативно и точно рассмотреть ваше обращение.. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][I][COLOR=rgb(0, 255, 200)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT][/SPOILER]<br><br>" +
      "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 255, 200)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|✅ ДОК-ВА НА GOOGLE DISK ✅|',
      content:
        "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Ваши доказательства не открываются. Пожалуйста, загрузите материалы на Google Диск и подайте новую жалобу с актуальными ссылками. Это поможет нам быстрее и точнее рассмотреть ваше обращение. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][I][COLOR=rgb(0, 255, 200)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT][/SPOILER]<br><br>" +
      "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 255, 200)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
     {
        title: '|✅ ДОК-ВА не открывается ✅|',
      content:
    "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Ваши доказательства не открываются, что делает невозможным их рассмотрение. Пожалуйста, загрузите материалы на такие платформы, как Imgur, Yandex Disk, YouTube, Google Диск или другие подобные видеохостинги и предоставьте ссылку. Только в этом случае мы сможем корректно рассмотреть вашу жалобу [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][I][COLOR=rgb(0, 255, 200)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT][/SPOILER]<br><br>" +
      "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 255, 200)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },

     {
        title: '|✅ ДОК-ВА В СОЦ.СЕТЯХ ✅|',
      content:
       "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Доказательства в социальных сетях и т.д. не принимаются. Пожалуйста, загрузите материалы на Imgur, YAPX или Google Диск и отправьте новую жалобу с актуальными ссылками. Это ускорит рассмотрение вашего обращения [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][I][COLOR=rgb(0, 255, 200)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT][/SPOILER]<br><br>" +
     "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 255, 200)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|✅ Док-ва обрываются ✅|',
      content:
     "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Ваша жалоба отказана, так как Видео-доказательства обрываются. Загрузите полную Видеозапись на видео-хостинг RUTUBE,IMGUR. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][I][SIZE=4][COLOR=rgb(0, 255, 200)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT][/SPOILER]<br><br>" +
   "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|✅ Док-ва отредакт ✅|',
      content:
       "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Доказательства, предоставленные вами, были отредактированы, что делает их недействительными для рассмотрения.Жалоба не может быть рассмотрена в текущем виде. Пожалуйста, предоставьте новые, неизменённые доказательства. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][I][SIZE=4][COLOR=rgb(0, 255, 200)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT][/SPOILER]<br><br>" +
   "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },

    {
        title: '|✅ Док-ва в соц сетях ✅|',
      content:
     "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Доказательства в социальных сетях и т.д. не принимаются. Загрузите доказательства на фото-видео хостинги YouTube,Imgur, Yapx и так далее. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][I][COLOR=rgb(0, 255, 200)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]SERVER [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 255, 200)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
      {
        title: '|✅ Док-ва в плохом качестве ✅|',
      content:
       "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Предоставленные вами доказательства имеют плохое качество, что затрудняет их анализ и делает невозможным дальнейшее рассмотрение жалобы. Для корректного рассмотрения просьба предоставить более четкие и качественные материалы. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][SIZE=4][I][COLOR=rgb(0, 255, 200)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT][/SPOILER]<br><br>" +
     "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
     {
        title: '|✅ Нарушений нет ✅|',
      content:
      "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Нарушений со стороны игрока не было замечено. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Внимательно изучите общие правила серверов - [/I][URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL][/SIZE][/FONT][/COLOR][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[FONT=georgia][SPOILER][SIZE=4][I][COLOR=rgb(0, 255, 200)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(0, 255, 200)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 255, 200)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|✅ Нет условий сделки ✅|',
      content:
     "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] На предоставленных доказательствах отсутствуют условия сделки, что делает невозможным их использование для анализа ситуации. Без этих данных жалоба не может быть рассмотрена. Пожалуйста, представьте новые доказательства, в которых будут указаны все условия сделки. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[FONT=georgia][SPOILER][SIZE=4][I][COLOR=rgb(0, 255, 200)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT][/SPOILER]<br><br>" +
     "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(0, 255, 200)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 255, 200)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|✅ Нет time ✅|',
      content:
       "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Ваша жалоба отказана так как на предоставленных доказательствах отсутствуют дата и время (/time), что делает их невозможными для корректного рассмотрения. Для дальнейшего анализа необходимо, чтобы все материалы содержали точные временные метки. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[FONT=georgia][SPOILER][SIZE=4][I][COLOR=rgb(0, 255, 200)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT][/SPOILER]<br><br>" +
      "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
      {
        title: '|✅ Нет сервера ✅|',
      content:
       "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] На доказательствах отсутствует сервер. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[FONT=georgia][SPOILER][SIZE=4][I][COLOR=rgb(0, 255, 200)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT][/SPOILER]<br><br>" +
      "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },

    {
        title: '|✅ Нет таймкодов ✅|',
      content:
       "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]В вашей жалобе отсутствуют таймкоды, что делает невозможным её рассмотрение. Если жалоба длится более 3-х минут, для корректного анализа нам необходимы точные временные метки событий. Например: 0:30 — условие сделки. 1:20 — обмен машинами. 2:20 — подмена машины на другую и выход из игры. Пожалуйста, укажите таймкоды в самой сути жалобы, чтобы мы могли корректно рассмотреть ваше обращение [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[FONT=georgia][SPOILER][SIZE=4][I][COLOR=rgb(0, 255, 200)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT][/SPOILER]<br><br>" +
      "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|✅ Прошло 3 дня ✅|',
      content:
       "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Ваша жалоба отказана, т.к. с момента нарушения прошло более 72-ух часов. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[FONT=georgia][SPOILER][SIZE=4][I][COLOR=rgb(0, 255, 200)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT][/SPOILER]<br><br>" +
     "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(0, 255, 200)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 255, 200)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|✅ Уже был ответ ✅|',
      content:
      "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Ваша жалоба отклонена, так как по данному вопросу ранее уже был предоставлен полный и обоснованный ответ. Решение остается в силе, и повторные жалобы без новых значимых обстоятельств рассматриваться не будут. Рекомендуем ознакомиться с предыдущим ответом.[/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[FONT=georgia][SPOILER][SIZE=4][I][COLOR=rgb(0, 255, 200)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
     "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|✅ Не по форме ✅|',
      content:
       "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Ваша жалоба составлена не по форме. Внимательно прочитайте правила подачи жалоб на игроков, закрепленные в этом разделе. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[FONT=georgia][SPOILER][SIZE=4][I][COLOR=rgb(0, 255, 200)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/I][/SIZE][/FONT][/SPOILER]<br><br>" +
     "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|✅ жб на 2+ игроков ✅|',
      content:
       "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Нельзя писать одну жалобу на двух и белее игроков ( на каждого игрока отдельная жалоба). [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][I][SIZE=4][COLOR=rgb(0, 255, 200)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/SIZE][/I][/FONT][/SPOILER]<br><br>" +
     "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|💥 отказ долг 💥|',
      content:
       "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Ваша жалоба не подлежит рассмотрению. жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами. Также игровой долго может быть осуществлен ТОЛЬКО через банковский счет. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][I][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
      "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
 {
        title: '|💥 вирт на донат 💥|',
      content:
       "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Ваша жалоба отклонена, так как обмен автокейсов, покупка дополнительных слотов на машину для семьи и подобные операции за виртуальную валюту являются запрещёнными. Соответственно нарушений со стороны игрока отсутствуют.  [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][FONT=georgia][I][SIZE=4][COLOR=rgb(0, 255, 200)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/SIZE][/I][/FONT][/SPOILER]<br><br>" +
     "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
 {
            title: '|✅ Ошибка сервером ✅|',
            content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
            "[CENTER][FONT=georgia]Доброго времени суток, уважаемый(-ая) {{ user.name }}.[/FONT][/CENTER]<br><br>"+
            "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
            "[CENTER][FONT=georgia] Ошиблись сервером, переношу на нужный. [/FONT][/CENTER]",


    },
  {
        title: '|✅ ОШИБКА РАЗДЕЛОМ ✅|',
      content:
       "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Вы ошиблись разделом. Ваше обращение будет перенесено в соответствующий раздел для дальнейшего рассмотрения. Спасибо за понимание! [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][I][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
      "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
       prefix: UNACCEPT_PREFIX,
      status: false,
    },

 {
      title: '------------------------------------------------------| RP Биографии |------------------------------------------------------',
      content:
          '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
      },
    {
        title: '| одобрена |',
      content:
     "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Ваша RolePlay - биография одобрена. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
     "[FONT=georgia][SIZE=4][CENTER][SPOILER][I][B][COLOR=rgb(0, 221, 0)]Одобрено [/COLOR][/CENTER][/SPOILER][/I][/SIZE][/FONT]<br><br>" ,
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| отказана |',
      content:
       "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
       status: false,
    },
    {
        title: '| На доработке |',
      content:
      "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Ваша RolePlay - биография на доработке. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
     "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На доработке![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
      prefix: V_PREFIX,
    },
    {
        title: '| nick |',
      content:
      "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к у вас NonRP NickName. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
     "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/B][/I][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: '| заголовок не по форме |',
      content:
       "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. заголовок оформлен неправильно. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
     "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/B][/I][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: '| более 1 рп био на ник |',
      content:
    "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к запрещено создавать более одной RP Биографии на один Nick. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
     "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(0, 255, 200)][FONT=georgia][/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 255, 200)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
    },
    {
        title: '| некоррект. возраст |',
      content:
    "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. в ней указан некорректный возраст. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: '| мало информации |',
      content:
     "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. в ней написано мало информации. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
      "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: '| нет 18 лет |',
      content:
     "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. персонажу нет 18 лет. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
     "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 255, 200)][SIZE=5][FONT=georgia]SERVER[/FONT][COLOR=rgb(0, 255, 200)][FONT=georgia]SERVER[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 255, 200)][FONT=georgia] BLACK[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: '| RP био от 1го лица |',
      content:
        "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. написана от 1го лица. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/B][/I][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: '| не по форме |',
      content:
     "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. она составлена не по форме. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
     "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: '| не дополнена |',
      content:
      "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. вы её не дополнили. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
     "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
       "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: '| неграмотная |',
      content:
     "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. она оформлена неграмотно. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br>" +
  "[HEADING=3][CENTER][I][B][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/I][/B][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Тавтология — это риторическая фигура, представляющая собой необоснованное повторение одних и тех же (или однокоренных) или близких по смыслу слов.[/SIZE][/CENTER][/COLOR][/FONT]" +
    "[HEADING=3][CENTER][I][B][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/I][/B][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Грамматическая ошибка - это ошибка в структуре языковой единицы: в структуре слова, словосочетания или предложения; это нарушение какой-либо грамматической нормы - словообразовательной, морфологической, синтаксической.[/SIZE][/CENTER][/COLOR][/FONT]" +
    "[HEADING=3][CENTER][I][B][COLOR=rgb(0, 255, 200)][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/I][/B][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Пунктуационная ошибка - это неиспользование пишущим необходимого знака препинания или его употребление там, где он не требуется, а также необоснованная замена одного знака препинания другим.[/SIZE][/CENTER][/COLOR][/FONT]" +
     "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: '| тавтология |',
      content:
       "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. она оформлена неграмотно. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/I][/B][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Тавтология — это риторическая фигура, представляющая собой необоснованное повторение одних и тех же (или однокоренных) или близких по смыслу слов.[/SIZE][/CENTER][/COLOR][/FONT]" +
     "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: '| знаки препинания |',
      content:
       "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. она оформлена неграмотно. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][COLOR=rgb(0, 255, 200)][COLOR=rgb(0, 0, 221)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/I][/B][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Пунктуационная ошибка - это неиспользование пишущим необходимого знака препинания или его употребление там, где он не требуется, а также необоснованная замена одного знака препинания другим.[/SIZE][/CENTER][/COLOR][/FONT]" +
     "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: '| граммат. ошибки |',
      content:
      "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. она оформлена неграмотно. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/I][/B][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Грамматическая ошибка - это ошибка в структуре языковой единицы: в структуре слова, словосочетания или предложения; это нарушение какой-либо грамматической нормы - словообразовательной, морфологической, синтаксической.[/SIZE][/CENTER][/COLOR][/FONT]" +
     "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: '| скопирована |',
      content:
    "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. она скопирована. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
     "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: '| скопирована со своей старой био |',
      content:
       "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. она скопирована с вашей прошлой РП Биографии на другой ник. Нужно на новый ник писать новую историю. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
      "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
      "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: '| мало инфо детство |',
      content:
      "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к в пункте Детство мало информации. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
     "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
      "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
       status: false,
    },
    {
        title: '| мало инфо юность |',
      content:
     "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к в пункте Юность и Взрослая жизнь мало информации. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
       "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
       status: false,
    },
    {
        title: '| мало инфо |',
      content:
   "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к в пункте *Детство* и *Юность и Взрослая* жизнь мало информации. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
     "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
       status: false,
    },
    {
        title: '| нет города на проекте |',
      content:
     "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. на проекте нет данного города/поселка. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
    "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: '| прибывание в городе которого нет |',
      content:
    "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. в ней описывается прибывание в городе которого не существует на проекте. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
     "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
       "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
 {
        title: '| ОШИБКА РАЗДЕЛОМ |',
      content:
       "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Вы ошиблись разделом. Ваше обращение будет перенесено в соответствующий раздел для дальнейшего рассмотрения. Спасибо за понимание! [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][I][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
      "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
       prefix: UNACCEPT_PREFIX,
      status: false,
    },



    {
      title: '------------------------------------------------------| RP Ситуации |-------------------------------------------------------------------',
      content:
          '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
      },
    {
        title: '| одобрена |',
      content:
      "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Ваша RolePlay Ситуация одобрена. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
       "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| отказана |',
      content:
      "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Ваша RolePlay Ситуация отказана. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP ситуаций закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
   "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
    "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| скопирована |',
      content:
    "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Ваша RolePlay Ситуация отказана т.к она скопирована. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP ситуаций закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
   "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
    "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| не по форме |',
      content:
    "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Ваша RolePlay Ситуация отказана т.к она составлена не по форме. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP ситуаций закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
   "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
    "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| НАЗВАНИЕ ТЕМЫ |',
      content:
      "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Ваша RolePlay Ситуация отказана т.к название темы указано не верно [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
   "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
    "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '| нет смысла |',
      content:
      "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Ваша RolePlay Ситуация отказана т.к в ней нет имеющего смысла. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP ситуаций закрепленные в данном разделе [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
    "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
 {
        title: '| ОШИБКА РАЗДЕЛОМ |',
      content:
       "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Вы ошиблись разделом. Ваше обращение будет перенесено в соответствующий раздел для дальнейшего рассмотрения. Спасибо за понимание! [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][I][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
      "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
       prefix: UNACCEPT_PREFIX,
      status: false,
    },




    {
      title: '---------------------------------------------------| Неофициальные RP организации |---------------------------------------------------',
      content:
          '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
      },
      {
        title: '| одобрена |',
      content:
          "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Ваша Неофициальная RolePlay организация одобрена. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
   "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
       "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|⛔ отказано ⛔|',
      content:
        "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Ваша Неофициальная RolePlay организация отказана. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
       "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|⛔ нет смысла ⛔|',
      content:
          "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Ваша Неофициальная RolePlay организация отказана т.к в ней нет имеющего смысла. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
       "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|⛔ 3+ ⛔|',
      content:
           "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Ваша Неофициальная RolePlay организация отказана т.к у вас нет стартового состава от 3ёх+ человек. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
     "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
       "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|⛔ не по форме ⛔|',
      content:
          "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Ваша Неофициальная RolePlay организация отказана т.к составлена не по форме. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
     "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
       "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: '|⛔ скопирована ⛔|',
      content:
            "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Ваша Неофициальная RolePlay организация отказана т.к она скопирована. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
   "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
       "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
      status: false,
        },
 {
        title: '|⛔ ОШИБКА РАЗДЕЛОМ ⛔|',
      content:
       "[CENTER]"+
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(0, 255, 200)][FONT=georgia][SIZE=4] Вы ошиблись разделом. Ваше обращение будет перенесено в соответствующий раздел для дальнейшего рассмотрения. Спасибо за понимание! [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[SPOILER][I][FONT=georgia][SIZE=4][COLOR=rgb(0, 255, 200)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
      "[IMG]http://vignette4.wikia.nocookie.net/animal-jam-clans-1/images/d/d4/....................................................................................................................................Wolf_Divider.png/revision/latest?cb=20160711170607[/IMG][/CENTER]<br>"+
     "" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: UNACCEPT_PREFIX,
       prefix: UNACCEPT_PREFIX,
      status: false,
    },
     {
            title: '----------------------------------------------------------------| ПЕРЕМЕЩЕНИЕ ЖАЛОБ| ---------------------------------------------------------------',
      content:
          '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
      },
     {
        title: '| RED 1 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
           thread: RED,
        },
{
        title: '| GREEN 2 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: GREEN,
        },
    {
        title: '| BLUE 3 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: BLUE,
        },
{
        title: '| YELLOW 4 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: YELLOW,
        },
    {
        title: '| ORANGE 5 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: ORANGE,
        },
     {
        title: '| PURPLE 6 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: PURPLE,
        },
    {
        title: '| LIME 7 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: LIME,
        },
    {
        title: '| PINK 8 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: PINK,
        },
     {
        title: '| CHERRY 9 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: CHERRY,
        },
    {
        title: '| BLACK 10 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: BLACK,
        },
    {
        title: '| INDIGO 11 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: INDIGO,
        },
    {
        title: '| WHITE 12 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: WHITE,
        },
     {
        title: '| MAGENTA 13 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: MAGENTA,
        },
    {
        title: '| CRIMSON 14 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: CRIMSON ,
        },
    {
        title: '| GOLD 15 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: GOLD,
        },
     {
        title: '| AZURE 16 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: AZURE,
        },
     {
        title: '| PLATINUM 17 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: PLATINUM,
        },
     {
        title: '| AQUA 18 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: AQUA ,
        },
    {
        title: '| GRAY 19 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: GRAY,
        },
     {
        title: '| ICE 20 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: ICE,
        },
     {
        title: '| CHILL 21 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: CHILL,
        },
    {
        title: '| CHOCO 22 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: CHILL,
        },
    {
        title: '| MOSCOW 23 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: MOSCOW,
        },
     {
        title: '| SPB 24 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread:  SPB,
        },
     {
        title: '| UFA 25 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: UFA,
        },
     {
        title: '| SOCHI 26 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: SOCHI,
        },

     {
        title: '| KAZAN  27 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: KAZAN ,
        },
     {
        title: '| SAMARA 28 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: SAMARA,
        },
     {
        title: '| ROSTOV 29 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: ROSTOV,
        },
     {
        title: '| ANAPA 30 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: ANAPA,
        },
     {
        title: '| EKB 31 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: EKB,
        },
    {
        title: '| KRASNODAR 32 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: KRASNODAR,
        },
      {
        title: '| ARZAMAS 33 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: ARZAMAS,
        },
     {
        title: '| NOVOSIBIRSK 34 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: NOVOSIBIRSK,
        },
     {
        title: '| GROZNY 35 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: GROZNY,
        },
    {
        title: '| SARATOV 36 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: SARATOV,
        },
    {
        title: '| OMSK 37 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: OMSK,
        },
     {
        title: '| IRKUTSK 38 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: IRKUTSK,
        },
      {
        title: '|  VOLGOGRAD 39 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: VOLGOGRAD,
        },

    {
        title: '| VORONEZH 40 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: VORONEZH,
        },
     {
        title: '| BELGOROD 41 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: BELGOROD,
        },
    {
        title: '| MAKHACHKALA 42 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: MAKHACHKALA,
        },
     {
        title: '| VLADIKAVKAZ 43 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: VLADIKAVKAZ,
        },
        {
        title: '| VLADIVOSTOK 44 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: VLADIVOSTOK,
        },
    {
        title: '| KALININGRAD 45 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: KALININGRAD,
        },
    {
        title: '| CHELYABINSK 46 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: CHELYABINSK,
        },
     {
        title: '| KRASNOYARSK 47 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: KRASNOYARSK,
        },
    {
        title: '| CHEBOKSARY 48 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: CHEBOKSARY,
        },
     {
        title: '| KHABAROVSK 49 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: KHABAROVSK,
        },
  {
        title: '| PERM 50 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: PERM,
        },
     {
        title: '| TULA 51 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: TULA,
        },
    {
        title: '| RYAZAN 52 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: RYAZAN,
        },
    {
        title: '| MURMANSK 53 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: MURMANSK,
        },
    {
        title: '|PENZA 54 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: PENZA,
        },
    {
        title: '| KURSK 55 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: KURSK,
        },
    {
        title: '| ARKHANGELSK 56 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: ARKHANGELSK,
        },
     {
        title: '| ORENGURG 57 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: ORENGURG,
        },
     {
        title: '| KIROV 58|',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: KIROV,
        },
     {
        title: '| KEMEROVO 59|',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: KEMEROVO,
        },
     {
        title: '| TYUMEN 60|',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: TYUMEN,
        },
    {
        title: '| TOLYATTI 61|',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: TOLYATTI,
        },
    {
        title: '| IVANOVO 62 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: IVANOVO,
        },
    {
        title: '| STAVROPOL 63 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: STAVROPOL,
        },
     {
        title: '| SMOLENSK 64 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: SMOLENSK,
        },
    {
        title: '|  PSKOV 65 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread:  PSKOV,
        },
     {
        title: '|  BRYANSK 66 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread:  BRYANSK,
        },
       {
        title: '|  OREL 67 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread:  OREL,
        },
      {
        title: '| YAROSLAVL 68 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread:  YAROSLAVL,
        },
     {
        title: '| BARNAUL 69 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: BARNAUL,
        },
    {
        title: '| LIPETSK 70 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread:  LIPETSK ,
        },
    {
        title: '| ULYANOVSK 71 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread:  ULYANOVSK,
        },
       {
        title: '| YAKUTSK 72 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread:  YAKUTSK,
        },
     {
        title: '| TAMBOV  73 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread:  TAMBOV,
        },
     {
        title: '| TAMBOV  73 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread:  TAMBOV,
        },
     {
        title: '| BRATSK  74 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread:  BRATSK,
        },
    {
        title: '| ASTRAKHAN 75 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread:  ASTRAKHAN,
        },
    {
        title: '| CHITA 76 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread:  CHITA,
        },
     {
        title: '| KOSTROMA  77 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: KOSTROMA ,
        },
      {
        title: '|  VLADIMIR  78 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread:  VLADIMIR,
        },
    {
        title: '|  KALUGA 79 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread:  KALUGA,
        },
    {
        title: '|  NOVGOROD 80 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread:  NOVGOROD,
        },
     {
        title: '|  TAGANROG  81 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: TAGANROG ,
        },
   {
        title: '|  VOLOGDA   82 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: VOLOGDA,
        },
    {
        title: '|  TVER  83 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: TVER,
        },
    {
        title: '|  TOMSK  84 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: TOMSK,
        },
     {
        title: '|  ISHEVSK  85 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: ISHEVSK,
        },
    {
        title: '| SURGUT 86 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread: SURGUT,
        },
     {
        title: '|  PODOLSK 87 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread:  PODOLSK,
        },
     {
        title: '|  MAGADAN 88 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread:  MAGADAN,
        },
    {
        title: '|  CHEREPOVETS 89 |',
      content:

    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(192, 192, 192)][FONT=georgia][SIZE=4]Ваша жалоба перемещена на ваш сервер[/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении[/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
        prefix:  WAIT_PREFIX,
        status: false,
      thread:  CHEREPOVETS ,
        },



  ];
      $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

              // Добавление кнопок при загрузке страницы

            // Добавление кнопок при загрузке страницы
    addButton('На рассмотрение💫', 'pin');
    addButton('Команде Проекта💥', 'teamProject');
    addButton('ГА', 'Ga');
    addButton('Одобрить✅', 'accepted');
    addButton('Отказать⛔', 'unaccept');
    addButton('Теху', 'Texy');
    addButton('Ответы КФ💥', 'selectAnswer');

              // Поиск информации о теме
    const threadData = getThreadData();

     $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
     $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
     $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
     $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
    $(`button#closed`).click(() => editThreadData(CLOSE_PREFIX, false));
     $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
     $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
     $('button#Texy').click(() => editThreadData(TEXY_PREFIX, false));
     $('button#Resheno').click(() => editThreadData(RESHENO_PREFIX, false));
     $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));

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
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}




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
