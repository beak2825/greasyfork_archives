// ==UserScript==
// @name         ARZAMAS  | Скрипт для КФ [by M.Perojkov]
// @namespace    https://forum.blackrussia.online
// @version      1.0
// @description  По вопросам обратная связь в Вк: https://vk.com/mikhail_wertin
// @author       Mikhail_Perojkov
// @match         https://forum.blackrussia.online/index.php?threads/*
// @icon        https://cdn-icons-png.flaticon.com/128/4080/4080314.png
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/474252/ARZAMAS%20%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%20%5Bby%20MPerojkov%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/474252/ARZAMAS%20%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%20%5Bby%20MPerojkov%5D.meta.js
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
const buttons = [{ title: 'Приветствие',
content:
'[SIZE=4][COLOR=rgb(178, 22, 54)][I][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/I][/COLOR][/SIZE]',
},
{
     title: '| _________Раздел Жалобы на игроков_________ |',
    },
                 {
                      title: '| На рассмотрение |',
                     content:
                     "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                     "[B][CENTER][COLOR=lavender]Ваша жалоба взята на рассмотрение, не создавайте дубликатов и ожидайте ответа от администрации.<br><br>"+
                     "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                     '[B][CENTER][COLOR=yellow][ICODE]На рассмотрении[/ICODE][/COLOR][/CENTER][/B]',
                     prefix: PIN_PREFIX,
                      status: true,
                     },
                 {
                      title: '| _________ОТКАЗЫ_________ |',
                     },
                  {
                      title: '| Не по форме |',
                      content:
                      "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                      "[B][CENTER][COLOR=lavender] Вашa жалобa составленa не по форме, пожалуйста ознакомьтесь с правилами подачи жалоб.<br><br>"+
                      "[CENTER][B][COLOR=RED]| [URL='https://forum.blackrussia.online/index.php?threads/3429394/'][Color=black]Правила подачи жалоб[/URL] [COLOR=RED]|<br>"+
                      "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                      '[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
                       prefix: UNACCEPT_PREFIX,
                       status: false,
                      },
                  {
                       title: '| Заголовок не по форме |',
                       content:
                      "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                      "[B][CENTER][COLOR=lavender]Заголовок у Вашей жалобы составлен не по форме, пожалуйста ознакомьтесь с правилами подачи жалоб.<br><br>"+
                      "[CENTER][B][COLOR=RED]| [URL='https://forum.blackrussia.online/index.php?threads/3429394/'][Color=lavender]Правила подачи жалоб[/URL] [COLOR=RED]|<br>"+
                      "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                      '[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
                       prefix: UNACCEPT_PREFIX
                      
                      
                       
                      },
                   {
                       title: '| ошибка разделом |',
                       content:
                       "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                       "[B][CENTER][COLOR=red] Вашa жалобa отказана, так как вы ошиблись разделом.<br><br>"+
                       "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                       '[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
                        prefix: UNACCEPT_PREFIX,
                         status: false,
                       },
                  {
                       title: '| Нет нарушений |',
                      content:
                      "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                      "[B][CENTER][COLOR=gold]Со стороны игрока нету нарушения, пожалуйста ознакомьтесь с правилами проекта.<br>"+
                      "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                      '[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
                       prefix: UNACCEPT_PREFIX,
                       status: false,
                        },
                 {
                     title: '| Уже был ответ |',
                      content:
                     "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                     "[B][CENTER][COLOR=lavender]Вам был дан ответ в прошлой теме. Просьба не создавать дубликаты данной темы.<br>"+
                     "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                     '[B][CENTER][COLOR=red][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]',
                     prefix: UNACCEPT_PREFIX,
                      status: false,
                     },
                  {
                      title: '| Наказание выдано ранее |',
                       content:
                      "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                      "[B][CENTER][COLOR=white]Ваша жалоба отказана, так как нарушитель уже был наказан ранее. Спасибо за ваше обрещение. Приятной игры.<br>"+
                      "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                      '[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
                       prefix: CLOSE_PREFIX,
                       status: false,
                      },
                  {
                       title: '| Offtop |',
                       content:
                      "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                      "[B][CENTER][COLOR=black] Прекратите писать offtop. Просьба не создавать дубликаты данной темы, иначе ваш Форумный аккаунт будет заблокирован.<br><br>"+
                      "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                      '[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]' , 
                       prefix: UNACCEPT_PREFIX,
                       status: false,
                      
                    
                      },
                  {
                       title: '| 2+ игрока |',
                        content:
                      "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                      "[B][CENTER][COLOR=lavender] Вашa жалобa отказана, так как нельзя писать жалобу на двух и более игроков.<br><br>"+
                       "[CENTER][B][COLOR=gold] Составьте одну жалобу на одного игрока, а другую жалобу на другого игрока.<br>"+
                      "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                      '[B][CENTER][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR][/CENTER][/B]',
                       prefix: CLOSE_PREFIX,
                      status: false,
                      },
                 {
                      title: '______________Доказательства_______________',
                       },
                  {
                       title: '| Док- ства обрываются |',
                       content:
                      "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                      "[B][CENTER][COLOR=pink] Доказательства были оборваны, отправьте ещё раз жалобу, но с полной записью, а если вы не до конца записывали фрапс (видео-фиксацию), увы ваша жалоба отказана. <br>"+
                      "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                      '[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
                       prefix: UNACCEPT_PREFIX,
                      status: false,
                       },
                  {
                       title: '| Док - ва  отсуствуют |' , 
                       content:
                      "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                      "[B][CENTER][COLOR=lavender]Вы не предоставили доказательства, прикрепите доказательства загруженные на фото/видео хостинг.<br>"+
                      "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                      '[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
                      prefix: UNACCEPT_PREFIX,
                       status: false,
                      },
                  {
                      title: '| От 3 лица |',
                       content:
                      "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                      "[B][CENTER][COLOR=lavender] Жалоба составлена от 3-го лица, подобного рода жалобы не рассматриваются.<br>"+
                      "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                      '[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
                        prefix: UNACCEPT_PREFIX,
                      status: false,
                      },
                 {
                     title: '| Недостаточно доказательств |',
                      content:
                     "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                     "[B][CENTER][COLOR=lavender] Предоставленные доказательства недостаточны для  точного решения, если у вас имеют дополнительные доказательства прикрепите.<br>"+
                     "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                     '[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
                     prefix: UNACCEPT_PREFIX,
                      status: false,
                     },
                  {
                       title: '| Отсутствие условия сделки|',
                      content:
                      "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                      "[B][CENTER][COLOR=lavender] В ваших доказательствах отсутствуют условия сделки, жалоба рассмотрению не подлежит.<br>"+
                      "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                      '[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
                       prefix: UNACCEPT_PREFIX,
                        status: false,
                      },
                  {
                       title: '| Док - ства отредактированны |',
                        content:
                      "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                      "[B][CENTER][COLOR=lavender] Доказательства были подвергнуты редактированию, жалоба рассмотрению не подлежит. <br>"+
                      "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                      '[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
                      prefix: UNACCEPT_PREFIX , 
                       status: false,
                      },
                    {
                         title: '| Док-ва в соц-сети |',
                         content:
                        "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                        "[B][CENTER][COLOR=lavender] Вашa жалобa отказана так как доказательства загруженные в соцсети не принимаются. загрузите док - во через фото/видео хостинг.<br><br>"+
                        "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                        '[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
                        prefix: UNACCEPT_PREFIX,
                         status: false,
                        },
                  {
                       title: '| Дубликат |',
                        content:
                      "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                      "[B][CENTER][COLOR=lavender] Ответ был дан  в прошлой жалобе, пожалуйста перестаньте делать дубликаты, иначе ваш Форумный аккаунт будет заблокирован.<br>"+
                      "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                      '[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
                        prefix: UNACCEPT_PREFIX,
                        status: false,
                      },
                 {
                       title: '| Нужен фрапс |',
                      content:
                     "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                     "[B][CENTER][COLOR=black]В данной ситуации обязательно должен быть фрапс (видео фиксация). В противном случае жалоба будет отказана.<br>"+
                     "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                     '[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
                     prefix: UNACCEPT_PREFIX,
                      status: false,
                     },
                  {
                        title: '| Не работает док-во |',
                        content:
                      "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                      "[B][CENTER][COLOR=black]Ваши доказательства не рабочие. Пожалуйста загрузите на видео/фото хостинге.<br>"+
                      "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                      '[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
                        prefix: UNACCEPT_PREFIX,
                        status: false,
                      },
                  {
                      title: '| Возрастные ограничения на док-ство |',
                       content:
                      "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                      "[B][CENTER][COLOR=lavender]Ваши доказательства вы поставли на возрастные ограничения, пожалуйста загрузите на видео без ограничений <br>"+
                      "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                      '[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
                       prefix: UNACCEPT_PREFIX,
                      status: false,
                      },
                   {
                       title: '| Нету Тайм-коды |',
                         content:
                       "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                       "[B][CENTER][COLOR=lavender] Если видео длится 5-ти и более минут, вам следует указать таймкоды, в противном случае жалоба будет отказана.<br>"+
                       "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                       '[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
                        prefix: UNACCEPT_PREFIX,
                        status: false,
                       },
                  {
                       title: '| Нету /time |',
                       content:
                      "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                      "[B][CENTER][COLOR=lavender]В предоставленных доказательствах отсутствует время (/time), не подлежит рассмотрению.<br>"+
                      "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                      '[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
                       prefix: UNACCEPT_PREFIX,
                       status: false,
                      },
                 {
                      title: '| Неполный фрапс |',
                      content:
                     "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                     "[B][CENTER][COLOR=white]Видеозапись не полная, к сожелению мы вынуждены отказать.<br>"+
                     "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                     '[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
                      prefix: UNACCEPT_PREFIX,
                     status: false,
                     },
                  {
                        title: '| Прошло 3 дня |',
                        content:
                      "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                      "[B][CENTER][COLOR=white]С момента совершения нарушения прошло 3 дня ( 72 часа ), не подлежит рассмотрению.<br>"+
                      "[B][COLOR=gold]Советуем вам зараннее кидать жалобы, приятной вам игры!<br>"+
                       "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                      '[B][CENTER][COLOR=red][ICODE]Закрыто[/ICODE][/COLOR][/CENTER][/B]',
                        prefix: CLOSE_PREFIX,
                        status: false,
                      },
                   {
                         title: '_____________________________________Наказания за убийства____________________________________________',
                         },
                   {
                         title: '| DeathMatch |' ,
                        content:
                       "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                       "[B][CENTER][COLOR=lavender]Данный игрок получит следующее наказание.[Spoiler][color=red]2.19 | [color=lavender] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины.[color=red]  | Jail 60 минут[/Spoiler]<br>"+
                       "[CENTER][COLOR=cocoa] Наказание будет выдано в течение 24 часов.<br>"+
                       "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                       '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
                        prefix: ACCEPT_PREFIX,
                         status: false,
                       },
                 {
                      title: '| Mass DM |',
                       content:
                     "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                     "[B][CENTER][COLOR=lavender] Данный игрок получит следующее наказание.[Spoiler][color=red]2.20 | [color=lavender] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более.[color=red]  | Warn / Бан 7-15 дней.[/Spoiler]<br>"+
                     "[CENTER][COLOR=chocolate] Наказание будет выдано в течение 24 часов.<br>"+
                     "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                     '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
                       prefix: ACCEPT_PREFIX,
                       status: false,
                     },
                  {
                       title: '| DB |',
                       content:
                      "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                      "[B][CENTER][COLOR=lavender] Данный игрок получит следующее наказание.[Spoiler][color=red]2.13 | [color=lavender] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [color=red] | Jail 60 минут. [/Spoiler]<br>"+
                      "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
                      "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                      '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
                       prefix: ACCEPT_PREFIX,
                        status: false,
                      },
                 {
                       title: '| RK |',
                       content:
                     "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                     "[B][CENTER][COLOR=lavender]Данный игрок получит следующее наказание.[Spoiler][color=red]2.14 | [color=lavender] Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти [color=red] | Jail 30 минут. [/Spoiler]<br>"+
                     "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
                     "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                     '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
                       prefix: ACCEPT_PREFIX,
                     status: false,
                     },
                 {
                       title: '| TK |',
                       content:
                     "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                     "[B][CENTER][COLOR=lavender] Даныйй игрок получит следующее наказание.[Spoiler][color=red]2.15 | [color=lavender] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины.[color=red]  | Jail 60 минут / Warn (за два и более убийства)[/Spoiler]<br>"+
                     "[CENTER][COLOR=chocolate] Наказание будет выдано в течение 24 часов.<br>"+
                     "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                     '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
                       prefix: ACCEPT_PREFIX,
                       status: false,
                     },
                 {
                       title: '| SK |',
                      content:
                     "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                     "[B][CENTER][COLOR=chocolate] Данный игрок получит следующее наказание.[Spoiler][color=red]2.16 | [color=lavender] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них.[color=red]  | Jail 60 минут / Warn (за два и более убийства)[/Spoiler]<br>"+
                     "[CENTER][COLOR=chocolate] Наказание будет выдано в течение 24 часов.<br>"+
                     "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                     '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
                       prefix: ACCEPT_PREFIX,
                       status: false,
                     },
                   {
                        title: '| PG |',
                           content:
                       "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                       "[B][CENTER][COLOR=chocolate] Данный игрок получит следующее наказание.[Spoiler][color=red]2.17 | [color=lavender] Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь [color=red]  | Jail 30 минут[/Spoiler]<br>"+
                       "[CENTER][COLOR=chocolate] Наказание будет выдано в течение 24 часов.<br>"+
                       "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                       '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
                        prefix: ACCEPT_PREFIX,
                       status: false,
                        },
                 {
                       title: 'DM от ГОСС',
                      content:
                      "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                     "[B][CENTER][COLOR=lavender] Данный игрок получит следующее наказание.[Spoiler][color=red]5.01 | [color=lavender] Запрещено наносить урон игрокам без Role Play причины на территории госс.[color=red]  | Jail 60 минут[/Spoiler]<br>"+
                     "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
                     "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                     '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
                       prefix: ACCEPT_PREFIX,
                       status: false,
                       },
                  {
                       title: '| DM при задержании |',
                        content:
                      "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                      	"[B][CENTER][COLOR=lavender] Данный  игрок получит следующее наказание.[Spoiler][color=red]6.01 | [color=lavender] Запрещено целенаправленно убивать преступника во время задержания без весомой Role Play причины.  [color=red]  | Warn [/Spoiler]<br>"+
                      "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
                      "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                      '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
                       prefix: ACCEPT_PREFIX,
                       status: false,
                      },
                   {
                        title: '| спасатель эко |',
                       content:
                       "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                       "[B][CENTER][COLOR=lavender] Данный игрок получит следующее наказание.[Spoiler][color=red]6.01 | [color=lavender] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы.  [color=red]  | Ban 10 дней / Обнуление аккаунта (при повторном нарушении) [/Spoiler](br)"+ 
                       "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
                       "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                       '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
                        prefix: ACCEPT_PREFIX,
                        status: false,
                       },
                  {
                      title: '_________________________________Наказания в чатах________________________________________',
                       },
                 {
                      title: '| MG |',
                      content:
                     "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                     "[B][CENTER][COLOR=lavender] Данный игрок получит следующее наказание.[Spoiler][color=red]2.18  [color=lavender] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе.[color=red]  | Mute 30 минут.[/Spoiler]<br>"+
                     "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
                     "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                     '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
                     prefix: ACCEPT_PREFIX,
                       status: false,
                     },
                 {
                       title: '| Не Русский |',
                     content:
                     "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                     "[B][CENTER][COLOR=lavender] Данный игрок получит следующее наказание.[Spoiler][color=red]2.18  [color=lavender] Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке [color=red] | Устное замечание / Mute 30 минут  [/Spoiler]<br>"+
                     "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
                     "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                     '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
                      prefix: ACCEPT_PREFIX,
                      status: false,
                     },
                 {
                       title: '| CAPS |',
                      content:
                     "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                     "[B][CENTER][COLOR=lavender] Данный игрок получит следующее наказание.[Spoiler][color=red]3.02 | [color=lavender] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [color=red]  | Mute 30 минут[/Spoiler]<br>"+
                     "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
                     "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                     '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
                       prefix: ACCEPT_PREFIX,
                      status: false,
                     },
                 {
                       title: '| Оскорбления |',
                      content:
                     "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                     "[B][CENTER][COLOR=lavender] Данный игрок получит следующее наказание.[Spoiler][color=red]3.03 | [color=lavender] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены[color=red]  | Mute 30 минут[/Spoiler]<br>"+
                     "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
                     "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                     '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
                       prefix: ACCEPT_PREFIX,
                      status: false,
                     },{
                          title: '| Упом. родных |',
                          content:
                         "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                         "[B][CENTER][COLOR=lavender] Данный игрок получит следующее наказание.[Spoiler][color=red]3.04 | [color=lavender] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC)  [color=red]  | Mute 120 минут / Ban 7-15 дней.[/Spoiler]<br>"+
                         "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
                         "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                         '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
                          prefix: ACCEPT_PREFIX,
                         status: false,
                         },
                 {
                      title: '| Flood |',
                       content:
                     "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                     "[B][CENTER][COLOR=lavender]Данный игрок получит следующее наказание.[Spoiler][color=red]3.05 | [color=lavender] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока[color=red]  | Mute 30 минут[/Spoiler]<br>"+
                     "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
                     "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                     '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
                      prefix: ACCEPT_PREFIX,
                      status: false,
                     },
                 {
                      title: '| Злоуп.Символами |',
                      content:
                     "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                     "[B][CENTER][COLOR=lavender] Данный игрок получит следующее наказание.[Spoiler][color=red]3.09 | [color=lavender] Запрещено злоупотребление знаков препинания и прочих символов [color=red]  | Mute 30 минут[/Spoiler]<br>"+
                     "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
                     "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                     '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
                       prefix: ACCEPT_PREFIX,
                      status: false,
                     },
                  {
                       title: '| Слив |',
                       content:
                      "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                      "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]3.09 | [color=lavender] Запрещены любые формы «слива» посредством использования глобальных чатов  [color=red]  |  PermBan [/Spoiler]<br>"+
                      "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
                      "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                      '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
                        prefix: ACCEPT_PREFIX,
                        status: false,
                      },
                 {
                      title: '| Угрозы наказаниями |',
                       content:
                     "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                     "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]3.09 | [color=lavender] Запрещены любые угрозы о наказании игрока со стороны администрации [color=red]  | Mute 30 минут[/Spoiler]<br>"+
                     "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
                     "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                     '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
                      prefix: ACCEPT_PREFIX,
                      status: false,
                     },
                  {
                       title: '| Мат в VIP |',
                       content:
                      "[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                      "[B][CENTER][COLOR=lavender] Данный игрок получит следующие наказание.[Spoiler][color=red]*  | [color=lavender]  Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате [color=red]  | Mute 30 минут [/Spoiler]<br>"+
                      "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
                      "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                      '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
                       prefix: ACCEPT_PREFIX,
                        status: false,
                      },
                   {
                       title: '| Оскорбление адм |',
                        content:
                       "[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                       "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red]*  | [color=lavender] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации[color=red]  | Mute 180 минут[/Spoiler]<br>"+
                       "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
                       "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                       '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
                        prefix: ACCEPT_PREFIX,
                        status: false,
                       },
                  {
                       title: '| Выдача за адм |',
                      content:
                      "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                      "[B][CENTER][COLOR=lavender] Данный игрок получит следующее наказание.[Spoiler][color=red]3.10 | [color=lavender] Запрещена выдача себя за администратора, если таковым не являетесь[color=red]  | Ban 15-30 + ЧС администрации.[/Spoiler]<br>"+
                      "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
                      "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                      '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
                        prefix: ACCEPT_PREFIX,
                        status: false,
                      },
                  {
                       title: '| Заблуждение (команды) |',
                      content:
                      "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                      "[B][CENTER][COLOR=lavender]Данный игрок получит следующее наказание.[Spoiler][color=red]3.11 | [color=lavender] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами[color=red]  | Ban 15-30 / Permban[/Spoiler]<br>"+
                      "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
                      "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                      '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
                       prefix: ACCEPT_PREFIX,
                       status: false,
                      },
                 {
                       title: '| Музыка в Voice |',
                       content:
                     "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                     "[B][CENTER][COLOR=lavender]Данный игрок получит следующее наказание.[Spoiler][color=red]3.14 | [color=lavender] Запрещено включать музыку в Voice Chat[color=red]  | Mute 60 минут [/Spoiler]<br>"+
                     "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
                     "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                     '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
                      prefix: ACCEPT_PREFIX,
                     status: false,
                     },
                 {
                     title: '| Политика |',
                       content:
                     "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                     "[B][CENTER][COLOR=lavender]Данный игрок получит следующее наказание.[Spoiler][color=red]3.18 | [color=lavender] Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов [color=red]  | Mute 120 минут / Ban 10 дней [/Spoiler]<br>"+
                     "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
                     "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
                     '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
                      prefix: ACCEPT_PREFIX,
                      status: false,
                     },
                 {
                      title: '| Объявления в госс |',
                       content:
                     "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                     "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]3.22 | [color=lavender] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [color=red]  | Mute 30 минут[/Spoiler]<br>"+
                     "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
                     "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                     '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
                       prefix: ACCEPT_PREFIX,
                       status: false,
                     },
                 {
                     title: '| ООС угрозы |',
                      content:
                     "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                     "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]2.37 | [color=lavender] Запрещены OOC угрозы, в том числе и завуалированные [color=red]  | Ban 15-30 дней / Permban [/Spoiler]<br>"+
                     "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
                     "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                     '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
                      prefix: ACCEPT_PREFIX,
                      status: false,
                     },
                 {
                      title: '| Редакт в личных цел. |',
                      content:
                     "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                     "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]*  [color=lavender] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком[color=red]  | Ban 7 дней + ЧС организации [/Spoiler]<br>"+
                     "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
                     "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                     '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
                       prefix: ACCEPT_PREFIX,
                       status: false,
                     },
                 {
                      title: '| Nick_Name оск |',
                      content:
                     "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                     "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]*  | [color=lavender] Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные)[color=red]  | Устное замечание + смена игрового никнейма / PermBan[/Spoiler]<br>"+
                     "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
                     "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                     '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
                       prefix: ACCEPT_PREFIX,
                      status: false,
                     },
                 {
                      title: '| Шум в войс |',
                       content:
                     "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                     "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]3.16 | [color=lavender]  Запрещено создавать посторонние шумы или звуки[color=red]  | Mute 30 минут[/Spoiler]<br>"+
                     "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
                     "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                     '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
                       prefix: ACCEPT_PREFIX,
                     status: false,
                        },
                  {
                       title: '| Реклама промокода  |',
                       content:
                      "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                      "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]3.23 | [color=lavender]  3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [color=red]  | Ban 30 дней [/Spoiler]<br>"+
                      "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
                      "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                      '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
                        prefix: ACCEPT_PREFIX,
                       status: false,
                      },
                  {
                      title: '_________________________________;ЖБ НЕ ТУДА________________________________________',
                         },
                  {
                      title: '|  ЖБ на АДМ |',
                      content:
                      "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                      "[B][CENTER][COLOR=lavender]Вы ошиблись разделом, обратитесь в раздел жалобы на администрацию. <br>"+
                      "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                      '[B][CENTER][COLOR=red][ICODE]Закрыто[/ICODE][/COLOR][/CENTER][/B]',
                       prefix: CLOSE_PREFIX,
                      status: false,
                      },
                 {
                      title: '|  ЖБ на ЛД |',
                     content:
                     "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                     "[B][CENTER][COLOR=lavender]Вы ошиблись разделом, обратитесь в раздел жалобы на лидеров. <br>"+
                     "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                     '[B][CENTER][COLOR=red][ICODE]Закрыто[/ICODE][/COLOR][/CENTER][/B]',
                      prefix: CLOSE_PREFIX,
                       status: false,
                     },
                 {
                      title: '|  ЖБ на АП |',
                     content:
                     "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                     "[B][CENTER][COLOR=lavender]Обратитесь в раздел жалобы на агентов поддержки. <br>"+
                     "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                     '[B][CENTER][COLOR=red][ICODE]Закрыто[/ICODE][/COLOR][/CENTER][/B]',
                       prefix: CLOSE_PREFIX,
                      status: false,
                     },
                 {
                      title: '|  ЖБ на сотрудников |',
                       content:
                     "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                     "[B][CENTER][COLOR=lavender]Вы ошиблись разделом, обратитесь в раздел жалобы на сотрудников данной организации. <br>"+
                     "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                     '[B][CENTER][COLOR=red][ICODE]Закрыто[/ICODE][/COLOR][/CENTER][/B]',
                      prefix: CLOSE_PREFIX,
                      status: false,
                     },
                 {
                      title: '| В ОБЖ |',
                       content:
                      "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                     "[B][CENTER][COLOR=lavender]Вы ошиблись разделом, обратитесь в раздел обжалование. <br>"+
                     "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                     '[B][CENTER][COLOR=red][ICODE]Закрыто[/ICODE][/COLOR][/CENTER][/B]',
                     prefix: CLOSE_PREFIX,
                     status: false,
                     },
                 {
                     title: '_________________________________Перенаправление________________________________________',
                       },
                 {
                     title: '| Передать Га |',
                      content:
                     "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                     "[B][CENTER][COLOR=lavender]Ваша жалоба была передана[COLOR=red] Главному Администратору[COLOR=orange] на рассмотрение<br>"+
                     "[B][CENTER][COLOR=lavender]Возможно на рассмотрении жалобы потребуется больше времени. Просьба ожидать ответа и не создавать копий данной темы. <br>"+
                     "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                     '[B][CENTER][COLOR=red][ICODE]Передано Главному Администратору[/ICODE][/COLOR][/CENTER][/B]',
                      prefix: GA_PREFIX,
                     status: true,
                     },
                 {
                       title: '| Передать Теху |',
                      content:
                     "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                     "[B][CENTER][COLOR=lavender]Ваша жалоба была передана[COLOR=orange] Техническому специалисту сервера[COLOR=yellow] на рассмотрение<br>"+
                      "[B][CENTER][COLOR=lavender]Возможно на рассмотрении жалобы потребуется больше времени. Просьба ожидать ответа и не создавать копий данной темы. <br>"+
                     "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                     '[B][CENTER][COLOR=blue][ICODE]Передано Техническому специалисту [/ICODE][/COLOR][/CENTER][/B]',
                       prefix: TEX_PREFIX,
                      status: true,
                     },
                  {
                  title: '| Передать куратору |',
                  content:
                 "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                 "[B][CENTER][COLOR=lavender]Ваша жалоба была передана[COLOR=red] Куратору [COLOR=black] администрации [COLOR=orange] на рассмотрение<br>"+
                 "[B][CENTER][COLOR=lavender]Ваша жалоба была передана[COLOR=red] Главному[OLOR=black] Куратору Форума[COLOR=orange] на рассмотрение<br>"+
                 "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
                 '[B][CENTER][COLOR=#7C706B][ICODE] Ожидайте ответа [/ICODE][/COLOR][/CENTER][/B]',
                  prefix: GA_PREFIX,
                   status: true,
                 },
  {
     title: '_________________________________NonRP________________________________________',
     },
 {
     title: '| NonRP обман |',
    content:
    "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]2.05 | [color=lavender] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики[color=red]  | Permban[/Spoiler]<br>"+
    "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
    "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
    '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCEPT_PREFIX,
    status: false,
    },
 {
     title: '| Обман на долг |',
    content:
    "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender] Ваша жалоба рассмотрена и одобрена, игрок получит следующее наказание.[gold][Spoiler][color=red]2.57 | [color=lavender] Запрещается брать в долг игровые ценности и не возвращать их. | Ban 30 дней / permban[color=red]<br>"+
     "[B][CENTER][COLOR=red]Примечание:[color=lavender] займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется;<br>"+
     "[B][CENTER][COLOR=red]Примечание:[color=lavender] при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда;<br>"+
     "[B][CENTER][COLOR=red]Примечание:[color=lavender]  жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами. [/Spoiler]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
    '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
 {
      title: '| NRP поведение |',
      content:
    "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]2.13 | [color=lavender] Запрещено поведение, нарушающее нормы процессов Role Play режима игры [color=red] | Jail 30 минут. [/Spoiler]<br>"+
    "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
    '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
     prefix: ACCEPT_PREFIX,
     status: false,
    },
 {
     title: '| NonRP edit |',
    content:
    "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]*  [color=lavender] Запрещено редактирование объявлений, не соответствующих ПРО[color=red]  | Mute 30 минут[/Spoiler]<br>"+
    "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
    '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
     prefix: ACCEPT_PREFIX,
     status: false,
    },
 {
     title: '| NonRP эфир |',
      content:
    "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]* | [color=lavender] Запрещено проведение эфиров, не соответствующих Role Play правилам и логике[color=red]  | Mute 30 минут[/Spoiler]<br>"+
    "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
    '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
 {

     title: '| NonRP розыск |',
      content:
    "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]* | [color=lavender] Запрещено выдавать розыск без Role Play причины[color=red]  | Warn / Jail 30 минут [/Spoiler]<br>"+
    "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
    '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
    prefix: ACCEPT_PREFIX,
      status: false,
    },
 {
     title: '| NonRP В/ч |',
      content:
    "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]* | [color=lavender] Запрещено нападать на военную часть нарушая Role Play [color=red]  | Warn (для ОПГ) / Jail 30 минут (для Гражданских)  [/Spoiler]<br>"+
    "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
    '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
 {
       title: 'NonRp ограб/похищение',
      content:
     "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender]Нарушитель буден наказан по общим правилам ограблений и похищений.[Spoiler][color=red]* | [color=lavender] [color=gold]  | https://forum.blackrussia.online/index.php?threads/Правила-ограблений-и-похищений.29/ [/Spoiler]<br>"+
    "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
    '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCEPT_PREFIX,
     status: false,
     },
 {
     title: 'NonRp Врач',
     content:
    "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]* | [color=lavender] Запрещено оказание медицинской помощи без Role Play отыгровок;[color=red]  | Jail 30 минут [/Spoiler]<br>"+
    "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
    '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
     prefix: ACCEPT_PREFIX,
     status: false,
      },
  {
     title: 'NonRp Врач',
    content:
    "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]* | [color=lavender] Запрещено оказание медицинской помощи без Role Play отыгровок;[color=red]  | Jail 30 минут [/Spoiler]<br>"+
    "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
    '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCEPT_PREFIX,
    status: false,
     },
 {
    title: 'NonRp Cop',
      content:
     "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]* | [color=lavender] Запрещено оказывать задержание без Role Play отыгровки[color=red]  | Warn [/Spoiler]<br>"+
    "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
    '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
     prefix: ACCEPT_PREFIX,
     status: false,
    },
  {
     title: '| NonRP охранник |',
     content:
    "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]*  | [color=lavender] Охраннику казино запрещено выгонять игрока без причины[color=red]  | Увольнение с должности | Jail 30 минут[/Spoiler]<br>"+
    "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
    '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCEPT_PREFIX,
    status: false,
    },
  {
      title: '| УРП |',
    content:
    "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]2.02 | [color=lavender]  Запрещено целенаправленно уходить от Role Play процесса всеразличными способами[color=red] | Jail 30 минут / Warn Примечание:[color=lavender]уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания или ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснуться Вашего персонажа. Уходить в интерьер или зеленую зону во время перестрелки с целью избежать смерти или уйти от Role Play процесса и так далее. [/Spoiler]<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
    '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
     prefix: ACCEPT_PREFIX,
     status: false,
    },
 {
     title: '| NonRP АКС |',
      content:
    "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]2.52 | [color=lavender] Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера.[color=red]  | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/Spoiler]<br>"+
    "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
    '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
    prefix: ACCEPT_PREFIX,
     status: false,
    },
  {
    title: '_________________________________Нарушение от ГОСС/ОПГ________________________________________',
     },
   {
      title: '| ТС в ЛЦ |',
     content:
    "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender]Данный игрок получит следующее наказание.[Spoiler][color=red]2.31 | [color=lavender] 1.08. Запрещено использование фракционного транспорта в личных целях  [color=red] | Jail 30 минут [/Spoiler]<br>"+
    "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
    '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
    prefix: ACCEPT_PREFIX,
     status: false,
    },
  {
     title: '| Одиночный патруль |',
     content:
    "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]2.31 | [color=lavender] 1.11. Всем силовым структурам запрещен одиночный патруль или конвоирование, минимум 2 сотрудника | Jail 30 минут [color=red] |  Jail 30 минут [/Spoiler]<br>"+
    "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
    '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
    prefix: ACCEPT_PREFIX,
     status: false,
    },
  {
     title: '| Права |',
      content:
    "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]2.31 | [color=lavender] 7.04. Запрещено отбирать водительские права во время погони за нарушителем  [color=red] | Warn [/Spoiler]<br>"+
    "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
    '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
     prefix: ACCEPT_PREFIX,
     status: false,
    },
 {
     title: '_________________________________Прочее________________________________________',
    },
  {
      title: '| Слив склада |',
      content:
    "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]2.21 | [color=lavender] 2.09. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [color=red]  | Ban 15-30 дней / Permban[/Spoiler]<br>"+
    "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
    '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
 {
     title: '| Читы/СТОРОННИЕ ПО/ Сборка |',
     content:
    "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]2.05 | [color=lavender] Запрещено хранить / использовать / распространять стороннее программное обеспечение, сборки или любые другие средства, позволяющие получить преимущество над другими игроками[color=red] | Ban 15 - 30 дней / PermBan [/Spoiler]<br>"+
    "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
    '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
     prefix: ACCEPT_PREFIX,
     status: false,
    },
  {
     title: '| Арест в казино/аукцион |',
    content:
    "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]* 2.50 | [color=lavender] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий [color=red]  | Ban 7 - 15 дней + увольнение из организации[/Spoiler]<br>"+
    "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
    '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
     prefix: ACCEPT_PREFIX,
     status: false,
    },
  {
     title: '| ФЕЙК |',
    content:
    "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]* 4.10 | [color=lavender] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию. Пример: подменять букву i на L и так далее, по аналогии. [color=red]  | PermBan [/Spoiler]<br>"+
    "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
    '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Багоюз аним |',
    content:
    "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]2.55 | [color=lavender]  Запрещается багоюз связанный с анимацией в любых проявлениях.[color=red] | Jail 60 / 120 минут<br>"+
      "[B][CENTER][COLOR=blue]Пример:[color=lavender] если игрок, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде Jail на 120 минут. Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками.<br>"+
      "[B][CENTER][COLOR=blue]Пример:[coloe=lavender] если игрок использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде Jail на 60 минут.[/Spoiler]<br>"+
    "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
    '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
     prefix: ACCEPT_PREFIX,
      status: false,
    },
 {
    title: '_________________________________RolePlay биографии________________________________________',
    },
 {
     title: '| Одобрено |',
    content:
    "[B][CENTER][COLOR=#7C706B][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender] Ваша RolePlay биография одобрена.<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
    '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
     prefix: ACCEPT_PREFIX,
     status: false,
    },
 {
    title: '| Отказано |',
     content:
    "[B][CENTER][COLOR=#7C706B][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender] Ваша RolePlay биография отказана. Внимательно прочтите правила создания РП биографий закрепленые в данном разделе.<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
    '[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
 {
     title: '| Не по форме |',
     content:
    "[B][CENTER][COLOR=#7C706B][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender] Ваша RolePlay биография составлена не по форме. Внимательно прочтите правила создания РП биографий закрепленые в данном разделе.<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
    '[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
     prefix: UNACCEPT_PREFIX,
    status: false,
    },
 {
     title: '| Заголовок не по форме |',
      content:
    "[B][CENTER][COLOR=#7C706B][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender] Заголовок вашей RolePlay биографии составлен не по форме. Внимательно прочтите правила создания РП биографий закрепленые в данном разделе.<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
    '[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
     prefix: UNACCEPT_PREFIX,
      status: false,
    },
 {
     title: '| От 3-его лица |',
     content:
    "[B][CENTER][COLOR=#7C706B][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender] Ваша RolePlay - биография отказана т.к она написана от 3-его лица. Внимательно прочтите правила создания РП биографий закрепленые в данном разделе.<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
    '[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
 {
    title: '| Супергерой |',
    content:
    "[B][CENTER][COLOR=#7C706B][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender]Ваша RolePlay - биография отказана т.к вы приписали суперспособности своему персонажу. Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. <br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
    '[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
 {
    title: '| Копипаст |',
     content:
    "[B][CENTER][COLOR=#7C706B][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender]Ваша RolePlay - биография отказана т.к вы ее скопировали. Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. <br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
    '[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
    prefix: UNACCEPT_PREFIX,
     status: false,
    },
  {
     title: '| На доработке |',
     content:
    "[B][CENTER][COLOR=#7C706B][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender]В вашей RolePlay - биографии недостаточно информации. Даю вам 24 часа на ее дополнение/ исправление, иначе РП биография будет отказана.  <br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
    '[B][CENTER][COLOR=yellow][ICODE]На доработке[/ICODE][/COLOR][/CENTER][/B]',
     prefix: PIN_PREFIX,
     status: true,
    },
  {
     title: '_________________________________RolePlay ситуации________________________________________'
     },
 {
    title: '| Одобрено |',
      content:
    "[B][CENTER][COLOR=#7C706B][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender] Ваша RolePlay - ситуация одобрена.<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
    '[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
    prefix: ACCEPT_PREFIX,
      status: false,
    },
 {
     title: '| Не туда |',
     content:
    "[B][CENTER][COLOR=#7C706B][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender]Ваша RolePlay - ситуация отказана т.к вы не туда попали. <br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
    '[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
     prefix: UNACCEPT_PREFIX,
     status: false,
    },
 {
    title: '| БАНК СЧЕТ И ТП... |',
     content:
    "[B][CENTER][COLOR=#7C706B][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender]Ваша RolePlay - ситуация отказана. Оформите ее без добавлений от себя, по типу (Банк счет...) и тд...<br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
    '[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
 {
      title: '| не по форме |',
    content:
    "[B][CENTER][COLOR=#7C706B][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender]Ваша RolePlay - ситуация отказана т.к она составлена не по форме. <br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
    '[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
     prefix: UNACCEPT_PREFIX,
     status: false,
    },
 	{
    title: '| отказ |',
     content:
    "[B][CENTER][COLOR=#7C706B][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender]Ваша RolePlay - ситуация отказана. <br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
    '[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
     prefix: UNACCEPT_PREFIX,
      status: false,
    },
 {
     title: '| На доработке |',
     content:
    "[B][CENTER][COLOR=#7C706B][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender]В вашей RolePlay - ситуации недостаточно информации. Даю вам 24 часа на ее дополнение/ исправление, иначе РП ситуация будет отказана.  <br>"+
    "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
    '[B][CENTER][COLOR=yellow][ICODE]На доработке[/ICODE][/COLOR][/CENTER][/B]',
    prefix: PIN_PREFIX,
     status: true,
    },
 {
    title: '| Не дополнил |',
     content:
    "[B][CENTER][COLOR=#7C706B][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
    "[B][CENTER][COLOR=lavender] Ваша RolePlay - ситуация отказана т.к вы ее не дополнили. Внимательно прочтите правила создания РП ситуаций закрепленые в данном разделе.<br>"+
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
addButton('Одобрить', 'accepted');
addButton('Отказать', 'unaccept');
addButton('На рассмотрение', 'pin');
addButton ('Передать ГА', 'mainAdmin');
addButton('Тех.Спецу', 'techspec');
addButton('ОТВЕТЫ', 'selectAnswer');

// Поиск информации о теме
const threadData = getThreadData();

$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
$('button#Zakrito').click(() => editThreadData(UNACCEPT_PREFIX, false));

$(`button#selectAnswer`).click(() => {
XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
buttons.forEach((btn, id) => {
if(id > 1) {
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
4 < hours && hours <= 11
? 'Доброе утро'
: 11 < hours && hours <= 15
? 'Добрый день'
: 15 < hours && hours <= 21
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
