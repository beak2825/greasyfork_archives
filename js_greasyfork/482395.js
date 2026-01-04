// ==UserScript==
// @name           hwmTimers
// @namespace      Tamozhnya1
// @author         xo4yxa, Demin, перф, CheckT, Tamozhnya1
// @description    Таймеры здоровья, гильдии рабочих, кузнецов, наёмников, охотников, воров/рейнджеров, лидеров
// @version        14.1
// @include        *heroeswm.ru/*
// @include        *lordswm.com/*
// @exclude        */rightcol.php*
// @exclude        */ch_box.php*
// @exclude        */chat*
// @exclude        */ticker.html*
// @exclude        */frames*
// @exclude        */brd.php*
// @grant          GM_deleteValue
// @grant          GM_getValue
// @grant          GM_setValue
// @grant 		   GM.xmlHttpRequest
// @grant 		   GM.notification
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/482395/hwmTimers.user.js
// @updateURL https://update.greasyfork.org/scripts/482395/hwmTimers.meta.js
// ==/UserScript==

// авторы         xo4yxa (2008-2009), Demin (2010-2015), перф (2017, 2020-2023), CheckT (2017-2019), Tamozhnya1 (2023-2025)
// (c) 2008-2009, xo4yxa homepage http://hwm.xo4yxa.ru/js/timerestore/
// Счетчики здоровья, манны, смены, охоты
// Скрипт добавляет счетчики, отсчитывающие время:
// - до полного восстановления здоровья и маны,
// - до начала смены Гильдии Рабочих,
// - до окончания работ в Кузнице (с "К" можно перейти в Кузницу),
// - до конца/начала задания в Гильдии Наемников (с "ГН" можно перейти в здание Гильдии Наемников),
// - может просто быть секундомером, что может пригодится для отслеживания времени охоты в ГО (нажатие на "ГО" сбрасывает данный счетчик в 00:00).

// Текущая версия 0.14
// версия 0.14
// * исправлен таймер для кузницы
// + в исключения добавлена страница батлчата
// версия 0.13
// + предупреждение о завершении работ в Кузнице
// + нажатием на "К" можно включить/отключить показ предупреждения для Кузницы (красная "К" - предупреждение будет, обычная "К" - не будет)
// * роль ссылки на кузницу, выполняют цифры для таймера кузницы
// * переработан механизм обнуления таймера ГО
// + правый клик по "ГО" обнуляет и останавливает данный таймер, левый клик обнуляет, а если был остановлен, то и запускает его
// версия 0.12
// * исправлено отображение панели при просмотре фотоальбомов
// * теперь панель не отображается на заглавной странице игры
// + нажатием на "ГР" можно включить/отключить показ предупреждения ГР (красная "ГР" - предупреждение будет, обычная "ГР" - не будет)
// * предупреждение ГР появляется только на одной из вкладок
// * перемещена панель таймеров, новое место между панелью ресурсов и панелью меню, и теперь не сдвигает содержимое страницы вниз
// * счетчик ГО не сбрасывается в 00:00 на каждой странице при новой установке

// (c) 2010-2015, demin  ( https://www.heroeswm.ru/pl_info.php?id=15091 ) homepage https://greasyfork.org/users/1602-demin
// С greasyfork.org скрипт почему-то удален. Остался на https://userscripts-mirror.org/scripts/show/92571
// Предыстория

// # Дата: 2009-07-20 12:32:32
// # От: demin
// # Кому: xo4yxa
// # Тема: скрипт таймеры

// привет, давно жду когда добавишь в этот скрипт подхватывание времени до конца работы с /home.php, если в таймере 00:00. каждый день прихожу на работу, таймер нулевой, т.к. устраивался с дома.
// может добавишь?

// # Дата: 2009-07-20 12:34:28
// # От: xo4yxa
// # Кому: demin
// # Тема: Re: скрипт таймеры

// Привет
// да, обдумываю такой прием, но пока тока в думках, не до скриптов...

// =======

// Прошел год.. На днях изучил ява скрипт и дописал.


// История версий

// [4.7]
// [*] правка англ. строк в настройках
// [*] добавлено мигание "Нет рабочих мест" при нулевом таймере

// [4.6] 22.04.14
// [*] фикс для фф 3.6 скрытия таймера охоты

// [4.5] 30.03.14
// [+] синхронизация с новым таймером ГО (изменения в игре от 25.03.2014)
// [+] добавлена опция в настройках: Скрывать "Следующая охота будет доступна через .."
// [*] изменение ГО: генерация мобов происходит при заходе на карту. если, не заходя на карту, инициировать перемещение с нулевым таймером - таймер не будет запущен, т.к. мобы встретят по прибытии
// [*] исправлен баг: при истечении премиума и покупки его на другом компе, на первом компе выскакивало сообщение, что премиум истек, хотя уже вновь куплен
// [*] исправление: перестало работать мигание "Вы уже устроены" при нулевом таймере, переписано на css3

// [4.4] 14.03.14
// [*] корректировка кода показа настроек, распределение z-index между скриптами

// [4.3] 24.12.13
// [*] новогодний фикс

// [4.2] 19.10.13
// [*] фикс определения активного штрафа трудоголика в сзязи с изменением строки штрафа

// [4.0] 19.06.13
// [*] фикс таймера ГО при побеге мобов

// [3.8-3.9] 07.06.13
// [+] таймер ГН вычисляет время через репутацию
// [*] исправлен баг на com (thx Lord STB)

// [3.7] 31.05.13
// [*] скрипт изменен под новый код флешек игры

// [3.5-3.6] 29.05.13
// [*] скрипт изменен под новый код флешек игры
// [+] для lordswm.com исправлено время окончания премиума (дата пишется по-другому) и окончания лицензии охотника (thx ototo)

// [3.4] 19.05.13
// [+] при наведении на таймер ГР показывает количество оставшихся трудоустройуств до штрафа трудоголика
// [*] для com фикс одной из строк времени ГН (thx todesh)

// [3.3] 04.05.13
// [+] при наведении на таймер ГР показывает наличие премиума + по истечении будет уведомление

// [3.2] 03.05.13
// [+] добавлено определение наличия лицензии О или МО (в здании ГО) с уменьшением времени между охотами - благодарность за предоставление данных ShoniUA
// [+] при наведении на таймер ГО показывает наличие лицензии + по истечении будет уведомление

// [3.0] 20.04.13-28.04.13
// [+] дополнительная опция отключения всех уведомлений о штрафе трудоголика
// [+] выделение цветом "Вы уже устроены" если таймер ГР равен 00:00
// [+] фикс ГК

// [2.3] 19.04.13
// [*] исправлен баг, влияющий на отсчет ГВ (ГРж) и ГО - огромная благодарность за помощь ВалиЕЦ
// [+] теперь таймеры хп и маны фиксируются строго по центру под соответствующими флешками

// [2.0] 09.04.13
// [+] дописан код подсчета времени до штрафа трудоголика
// [+] дописан код регистрации парных охот в ГО
// [+] реакция ГО на переход

// [1.13] 08.04.13 - beta
// [+] объединены два алгоритма окончания боя
// [+] добавлен подсчет времени до штрафа трудоголика (пока без обнуления после победного боя)

// [1.10-1.12] 20.03.13 - 06.04.13 - beta
// [+] косметическая правка половины кода, переписано большинство алгоритмов
// [+] изменен таймер ГО
// [*] изменен таймер ГК
// [+] изменен таймер ГРж (все благодарности Чеширский КотЪ)
// [*] изменены настройки
// [+] в настройках добавлена возможность скрывать "ненужные" таймеры
// [+] автоматическое определение активного премиум аккунта (с корректировкой времени Гильдий)

// [1.00] 17.01.12
// [+] два алгоритма окончания боя (см. настройки)
// [+] поддержка lordswm.com (огромная благодарность Циник за помощь в переводе)
// [+] единоразовое предупреждение о восстановлении армии (таймер здоровья)

// [0.27] 06.01.12
// [*] удалена опция уведомления о восстановленном здоровье после победы в ГВ/ГРж (изменения в игре от 2011-12-14)
// [+] Гильдия Рейнджеров: обновление, опция автовступления в бой (см. настройки) (за тестирование благодарю --BAPBAP-- Кожаное_лицо l-xXx-l Кофе)
// [*] изменения в настройках
// [*] изменения в таймере ГО (реакция на переход и др.)

// [0.26] 23.11.11
// [+] добавлен таймер Гильдии Рейнджеров
// [+] полная поддержка браузеров Хром и др.

// [0.25] 22.06.11
// [*] откат скрипта от таймера ивента

// [0.24] 19.06.11
// [*] временное изменение таймера ГО под ивент - отсчет 30 минут между нападениями на Хранителей леса. После окончания ивента будет произведен откат скрипта.

// [0.23] 25.03.11
// [*] обновление под FF 4.0

// [0.22] 15.03.11
// [*] фикс таймера ГВ - если Готовность армии более 3% при выходе из боя, бой считается победным
// [+] добавлено окно настроек скрипта (обнуление таймеров, настройки ГВ) - модуль настроек взят из скрипта hwmtakeoffon автора xo4yxa

// [0.21] 02.03.11
// [*] возможность полного отключения таймера ГО

// [0.20] 01.02.11
// [+] Изменения в таймере кузни: добавлен расчет дней (огромная благодарность Вещий_Олег за помощь в тестировании).
// [+] скрипт не требует изменений при игре с ЗЕРКАЛА героев
// [+] возможность играть за нескольких персов с зеркала героев в одном браузере

// [0.19] 29.01.11
// [+] Изменения в таймере кузни: поиск двух окончаний работ (при возможности одновременно чинить и улучшать артефакты), подхватывание наименьшего времени.

// [0.18] 20.01.11
// [+] поддержка различных БРАУЗЕРОВ
// [*] исправлено подхватывание времени ГН задания "армия" до принятия задания
// [*] оттестировано окончание времени работ в кузнице (Гильдия Кузнецов)

// [0.17] 07.01.11
// [+] таймер ГО реагирует на нейтралов

// [0.16] 05.01.11
// [+] добавлен таймер Гильдии Воров (после боя гильдии воров необходимо нажать "Вернуться в игру")
// [*] добавлено уведомление об окончании ожидания между засадами в Гильдии Воров
// [+] добавлено уведомление о задании ГН
// [*] роль ссылки на ГН, выполняют цифры таймера ГН
// [+] ко времени ожидания между заданиями ГН добавляется 1 минута
// [*] таймер ГО при установке скрипта более не покажет 100500 дней
// [*] исправлены некоторые грамматические ошибки

// [0.15]
// [*] скрипт изменен под новый год (по окончании НГ переустановка не потребуется)
// [*] в исключаемые страницы добавлены страницы квестов

// [0.14]
// [+] обновленный скрипт hwm time restore (автор xo4yxa)
// [+] подхватывает время устройства на работу с home.php, если таймер нулевой
// [+] совместим с последней версией скрипта HWM_Time_Seconds


// (c) 2017, перф. 10.10.2017 v.5.8: *вместо nick привзяка к id_payler из рекордов охоты; изменение алгоритма получения уровня здоровья.
// (c) 2018, CheckT v.6.0+: Исправления и рефакторинг homepage https://greasyfork.org/ru/scripts/35221-hwm-time-restore
// 6.0.5 Возвращена настройка "не сигналить о событиях".
// 6.0.6 Починена функциональность загружаемого звука и звука на выздоровление
// 6.0.7 Починена функциональность сохранения настроек "скрывать охоту" и трудоголика
// 25.11.2018 v 6.0.9
// - Починен таймер ГВ
// - Починен таймер трудоголика (скорее всего)
// - Починен таймер Абу-Бекра
// - Добавлена настройка "Запретить повторные сигналы в течении 30 секунд"
// Если открыто несколько вкладок, все они могут просигналить, причём с некоторой задержкой, так что получится очередь сигналов.
// Эта настройка позволяет подавить повторные сигналы на 30 секунд.
// Время задаётся в сеуундах в начале скрипта параметром
// disable_alarm_delay
// - Можно задать разный звук для таймеров ГР, ГО+ГН+ГВ, ГК, здоровья
// todo:
// Звук в Firefox не проигрывается. Причина выясняется.

// v6.0.10- небольшое исправление инициализации звука
// v6.0.11- Починен таймер трудоголика
// v6.0.12- Обнаружение боя раздельно для разных персов (актуально для игры с допами)
// v6.0.13
// - Поддержка для режима "не показывать вкладки".
// При этом настройки будут общими для всех персов с такими настройками на этом компьютере.
// Если нужны раздельные настройки, заведите быструю ссылку с любым текстом и ссылкой
// /pl_hunter_stat.php?id=(ид)
// например
// /pl_hunter_stat.php?id=7146446
// v6.0.14- Улучшена обработка режима "не показывать вкладки". Теперь должно нормально работать
// v6.0.15- Исправлено улучшение обработка режима "не показывать вкладки". Теперь должно нормально работать
// v6.1.0- Исправлено замеченные ошибки, немного оптимизировано.
// v6.1.1
// - Бои Гильдии Лидеров не сбрасывают таймер трудоголика
// - Добавлен @homepage
// - Исправление конфликтов с другими скриптами
// v6.1.2
// - Исправлено определение Блага Абу-Бекра
// - Бои Гильдии Лидеров: Культа Солнца не сбрасывают таймер трудоголика
// 2018.12.27 v6.1.4- Бои Гильдии Лидеров: Охота на Гринча не сбрасывают таймер трудоголика
// 2019.01.03 v6.1.5- Удалена конвертация старых настроек
// 2019.01.09 v6.1.6- Исправлен таймер здоровья с бонусом НГ+домом

// (c) 2020, перф. 10.12.2018 v.6.2: Изменение обнаружения охоты
// (c) 2022, перф. 08.12.2022 v.6.3: Изменение обнаружения таймера охоты, v.6.4: Таймер ГР в "Новом оформлении страницы персонажа".
// (c) 01.02.2023 6.4.4, перф: изменение кода отображения времени следующей охоты на странице карты. homepage https://greasyfork.org/ru/scripts/418440-hwm-time-restore
// [6.2] 10.12.2020 [*] Изменение обнаружения охоты.
// [6.3] 08.12.2022 [*] Изменение обнаружения таймера охоты, из-за антигринда.
// [6.4] 08.12.2022 [*] Таймер ГР в "Новом оформлении страницы персонажа".
// [6.4.4] 01.03.2023 [*] Изменение кода отображения времени следующей охоты на странице карты.

// 01.12.2023 Tamozhnya1 7.0 Добавлена работоспособность с новой шапкой и новой страницей персонажа.
// Из hwmTransporter взял определение разультатов боя из таблички результатов в конце боя, определение здоровья, анализ протокола боев для таймера ГВ.
// В способы оповещения добавлены уведомления Windiws
// Аудио можно прогрывать и останавливать
// Добавлены таймеры лидеров и защит
// Глобально переработал код скрипта, приближая его к модели MVC, и к стандартам промышленного программирования, путем правильного именования программных объектов в соответствие с их назначением в предметной области

// 10.9 - если таймер лидеров стоит, а задания не все, перезапускаем

// TODO
// 1) После новогодних праздников в новом интерфейсе может случиться крах из-за того, что в нем неизвестно как определять каталог картинок (а может он останется новогодним) (РЕАЛИЗОВАНО)
// 2) После каждого проигрыша армии в ГН таймер начинает отсчет и репутация падает. Т.о. после последнего боя таймер неточен из-за неправильной репутации
// 3) Главная неприятность- периодически не запскаются таймеры ГО, ГН. Причина то, что при входе в бой обработчик, висящий на кнопке, не всегда успевает до того, как админский обработчик запустит бой.
// Я перевесил свой обработчик на image, но кажется это не помогло.

const playerIdMatch = document.cookie.match(/pl_id=(\d+)/);
if(!playerIdMatch) {
    return;
}
const PlayerId = playerIdMatch[1];
const lang = document.documentElement.lang || (location.hostname == "www.lordswm.com" ? "en" : "ru");
const isEn = lang == "en";
const isHeartOnPage = document.querySelector("canvas#heart") || document.querySelector("div#heart_js_mobile") ? true : false;
const isMobileInterface = document.querySelector("div#btnMenuGlobal") ? true : false;
const isMobileDevice = mobileCheck(); // Там нет мышки
const isNewInterface = document.querySelector("div#hwm_header") ? true : false;
const isNewPersonPage = document.querySelector("div#hwm_no_zoom") ? true : false;
const mooving = location.pathname == '/map.php' && !document.getElementById("map_right_block");
const win = window.wrappedJSObject || unsafeWindow;
const BattleResult = { NotFound: 0, Win: 1, Fail: 2 };
const timerNames = ["health", "work", "smith", "enchantment", "merc", "hunt", "thief", "leader", "watcher", "defence", "mana"];
const timeFormats = { full: 1, hoursOrSeconds: 2, secondsLastMinute: 3 };
const timerSettings = {
    leader: {
        timeFormat: timeFormats.hoursOrSeconds
    },
    watcher: {
        timeFormat: timeFormats.hoursOrSeconds
    },
    defence: {
        timeFormat: timeFormats.secondsLastMinute,
        isShowNotEmptyOnly: true
    }
};
const audioScenaries = ["health", "work", "smith", "enchantment", "warlike", "leader", "watcher", "defence"];
const timersAudioMap = {"health": "health", "work": "work", "smith": "smith", "enchantment": "enchantment", "merc": "warlike", "hunt": "warlike", "thief": "warlike", "leader": "leader", "watcher": "watcher", "defence": "defence"};
const fractions = isEn ? ["Knight", "Necromancer", "Wizard", "Elf", "Barbarian", "Dark elf", "Demon", "Dwarf", "Tribal", "Pharaoh"] : ["Рыцарь", "Некромант", "Маг", "Эльф", "Варвар", "Темный эльф", "Демон", "Гном", "Степной варвар", "Фараон"];
const playingAudios = {};
let defaultAudio;
let texts;
const isDevMode = false;
let maxLeaderTasks = 3;
let maxWatchersStars = 9;
const resourcesPath = `${location.protocol}//${location.host.replace("www", "dcdn")}`;
const resourcesPath1 = `${location.protocol}//${location.host.replace("www", "dcdn1")}`;
const resourcesPath2 = `${location.protocol}//${location.host.replace("www", "dcdn2")}`;
const resourcesPath3 = `${location.protocol}//${location.host.replace("www", "dcdn3")}`;
const roulettePng = `${resourcesPath}/i/new_top/_panelRoulette.png`;
const duelsPng = `${resourcesPath3}/i/bselect/duels.png?v=3b`;
const groupsPng = `${resourcesPath}/i/bselect/groups.png?v=3b`;
const turnir_icoPng = `${resourcesPath}/i/mobile_view/icons_add/turnir_ico.png`;
if(location.pathname == "/home.php" || location.pathname == "/pl_info.php" && getUrlParamValue(location.href, "id") == PlayerId) {
    if(isNewPersonPage) {
        const levelInfoCell = Array.from(document.querySelectorAll("div.home_pers_info")).find(x => x.innerHTML.includes(isEn ? "Combat level" : "Боевой уровень"));
        if(levelInfoCell) {
            setPlayerValue("PlayerLevel", parseInt(levelInfoCell.querySelector("div[id=bartext] > span").innerText));
        }
    } else {
        const levelExec = new RegExp(`<b>${isEn ? "Combat level" : "Боевой уровень"}: (\\d+?)<\\/b>`).exec(document.documentElement.innerHTML);
        if(levelExec) {
            setPlayerValue("PlayerLevel", parseInt(levelExec[1]) || 1);
        }
    }
}
const PlayerLevel = parseInt(getPlayerValue("PlayerLevel", 1));
addStyle(`
 .alarm-text {
   animation-duration: 1000ms;
   animation-name: blink;
   animation-iteration-count: infinite;
   animation-direction: alternate;
}
@keyframes blink {
  0% { opacity: 0; }
  30% { opacity: 0.8; }
  60% { opacity: 1; }
  100% { opacity: 1; }
}
`);
_NABEG=2;_GN_OTRYAD=5;_GN_MONSTER=7;_GN_NABEGI=8;_GN_ZASHITA=10;_GN_ARMY=12;_MAL_TOUR=14;_THIEF_WAR=16;_SURVIVAL=20;_NEWGROUP=21;
_ELEMENTALS=22;_GNOMES=23;_NEWKZS=24;NEWKZS=24;_NEWKZS_T=25;NEWKZS_T=25;_NEWTHIEF=26;_NEWCARAVAN=27;_NEWGNCARAVAN=29;_SURVIVALGN=28;
_TUNNEL=30;_SEA=32;_HELL=33;_CASTLEWALLS=35;_UNIWAR=36;_DIFFTUR=37;_UNIWARCARAVAN=38;_PVPGUILDTEST=39;_PVPGUILD=40;_BALANCED_EVENT=41;
_NECR_EVENT=42;_NECR_EVENT2=43;_HELLOWEEN=44;_SURVIVAL_GNOM=45;_DEMON_EVENT=46;_DEMON_EVENT2=47;_DEMON_EVENT3=48;_DEMON_EVENT4=49;_PVEDUEL=50;_DEMONVALENTIN=51;
_QUICKTOUR=52;_BARBTE_ATTACK=53;_BARBTE_DEEP=54;_BARBTE_BOSS=55;_TRANSEVENT=56;_STEPEVENT=57;_STEPEVENT2=58;_KZS_PVE=59;_2TUR=60;_RANGER=61;
_PRAET=62;_RANGER_TEST=63;_SUN_EVENT1=64;_SUN_EVENT2=65;_NEWCARAVAN2=66;_23ATTACK=67;_2TU_FAST=68;_SV_ATTACK=69;_KILLER_BOT=70;_SV_DUEL=71;
_SV_WAR=72;_FAST_TEST=73;_TRUE_EVENT=74;_TIKVA_BOT=75;_TIKVA_ATTACK=76;_ELKA_DEFENSE=77;_PPE_EVENT=78;_ALTNECR_EVENT=79;_CLAN_SUR_DEF=80;_CLAN_SUR_ATT=81;
_QUESTWAR=82;_BARBNEW_DEEP=83;_BARBNEW_BOSS=84;_ELKA_RESCUE=85;_REGWAR1=86;_REGWAR2=87;_CLAN_SUR_CAPT=88;_CLAN_SUR_DEF_PVP=89;_TRUE_TOUR=90;_NOOB_DUEL=91;
_ALTMAG_EVENT=92;_ALTELF_EVENT=93;_NEWPORTAL_EVENT=94;_UNIGUILD=95;_PIRATE_EVENT=96;_TOUR_EVENT=97;_PAST_EVENT=98;_GOLD_EVENT=99;_FAST_TEST2=100;_OHOTA_EVENT=101;
_BUNT_EVENT=102;_ZASADA_EVENT=103;_CLAN_NEW_PVP=104;_SURV_DEEP=105;_SURV_DEEP_BOSS=106;_2AND3_EVENT=107;_CASTLE_EVENT=108;_CARAVAN_EVENT=109;_CAMPAIGN_WAR=110;_NY2016=111;
_ALTTE_EVENT=112;_PVP_EVENT=113;_ALTTE2_EVENT=114;_PIRATE_NEW_EVENT=115;_PVP_KR_EVENT=116;_CATCH_EVENT=117;_PVP_DIAGONAL_EVENT=118;_VILLAGE_EVENT=119;_TRAVEL_EVENT=120;_CASTLE_BATTLE2X2=121;
_PVP_BOT=122;_PIRATE_SELF_EVENT=123;_2ZASADA_EVENT=124;_NEWCARAVAN3=125;_ONEDAY_EVENT=126;_CRE_EVENT=127;_GL_EVENT=128;_1ZASADA_EVENT=129;_NYGL2018_EVENT=130;_EGYPT_EVENT=131;
_GL_DWARF_EVENT=132;_NAIM_MAP_EVENT=133;_2BOT_TUR=134;_CRE_SPEC=135;_CRE_INSERT=136;_CRE_TOUR=137;_GNOM_EVENT=138;_MAPHERO_EVENT=138;_NEWCRE_EVENT=139;_NEWOHOTA_EVENT=140;
_2SURVIVAL=141;_ADVENTURE_EVENT=142;_AMBUSHHERO_EVENT=143;_FRACTION_EVENT=144;_PVP_KZS=145;_REAPING_MAP_EVENT=147;

const periodicEvents = getPeriodicEvents().filter(x => Number(x.period) > 0 && x.text && (x.isWinNotification || x.isSoundNotification));
periodicEvents.forEach(x => x.eventsArray = getEventsArray(x));
//console.log(periodicEvents);

main();
function main() {
    addStyle(`
.button-62 {
  background: linear-gradient(to bottom right, #E47B8E, #FF9A5A);
  border: 0;
  border-radius: 5px;
  color: #FFFFFF;
  cursor: pointer;
  display: inline-block;
  font-family: -apple-system,system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  font-size: 16px;
  font-weight: 500;
  outline: transparent;
  padding: 0 5px;
  text-align: center;
  text-decoration: none;
  transition: box-shadow .2s ease-in-out;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  white-space: nowrap;
}

.button-62:not([disabled]):focus {
  box-shadow: 0 0 .25rem rgba(0, 0, 0, 0.5), -.125rem -.125rem 1rem rgba(239, 71, 101, 0.5), .125rem .125rem 1rem rgba(255, 154, 90, 0.5);
}

.button-62:not([disabled]):hover {
  box-shadow: 0 0 .25rem rgba(0, 0, 0, 0.5), -.125rem -.125rem 1rem rgba(239, 71, 101, 0.5), .125rem .125rem 1rem rgba(255, 154, 90, 0.5);
}
.button-62:disabled,button[disabled] {
    background: linear-gradient(177.9deg, rgb(58, 62, 88) 3.6%, rgb(119, 127, 148) 105.8%);
}
table.smithTable { 
    width: 100%;
    background: BurlyWood;
    border: 5px solid BurlyWood;
    border-radius: 5px;
    margin-top: 1px;
}
table.smithTable th {
    border: 1px none #f5c137;
    overflow: hidden;
    text-align: center;
    font-size: 11px;
}
table.smithTable td {
    border: 1px none #f5c137;
    overflow: hidden;
    text-align: center;
}
table.smithTable tr:nth-child(odd) {
  background: Wheat;
}
table.smithTable tr:nth-child(even) {
  background: white;
}
.waiting {
    cursor: wait;
}
.not-allowed {
    cursor: not-allowed;
}
`);
    initUserName();
    verifyOptionKeys();
    texts = setTexts();
    requestServerTime();
    checkPremiumAccount();
    preloadDefaultAudio();
    if(location.pathname == '/war.php') {
        inBattle(); // в бою
        return;
    }
    if(!isHeartOnPage) {
        return;
    }

    const [army_percent] = healthTimer();
    manaTimer();
    if(location.pathname == "/home.php") {
        setPlayerValue("IsDeer", document.querySelector("img[src*='deer2.png']") ? true : false);
    }
    checkHuntLicense();
    checkWork();
    checkWorkaholic();
    checkMercenary();
    checkLeaders();
    checkWatchers();
    checkRangerGuild();
    checkModWorkebench();
    checkDefences();
    checkAmbushResult();
    if(location.pathname == '/map.php') {
        checkThiefAmbush();
        checkRangerAmbush();
        checkMapHunter();
    }
    createTimersPanel();
    timersPanelDataBind();
    tick();
    skillPotions();
    if(getPlayerBool("viewNativeTimer") && !isMobileInterface) {
        const container = isNewInterface ? document.querySelector("div.sh_MenuPanel") : document.querySelector("table#main_top_table>tbody>tr>td>table>tbody>tr:nth-of-type(3)>td>table>tbody>tr>td:nth-last-of-type(1)");
        const containerRect = container.getBoundingClientRect();
        addStyle(`
.nativeTimerViewer {
    position: absolute;
    width: 80px;
    height: auto;
    color: white;
    font-size: 18px;
    font-weight: bold;
    box-shadow: 2px 3px 20px black, 0 0 60px #8a4d0f inset;
    background: #fffef0;
    text-align: center;
}
`);
        if(isNewInterface) {
            addStyle(`
.nativeTimerViewer {
    top: ${containerRect.height}px;
    left: ${containerRect.width}px;
}
`);
        } else {
            addStyle(`
.nativeTimerViewer {
    top: ${0}px;
    right: ${0}px;
}
`);
        }
        if(win.Timer) {
            const nativeTimerViewer = addElement("div", { class: "nativeTimerViewer", title: isEn ? "Native refresh timer. Pause/Run." : "Встроенный таймер обновления. Остановить/Запустить." }, container);
            nativeTimerViewer.addEventListener("click", function() { if(win.Timer >= 0) { clearTimeout(win.Timer); win.Timer = undefined; } else { win.Refresh(); } });
            if(!isNewInterface) {
                container.style.position = "relative";
            }
            tickNativeTimer();
        }
    }
}
function tickNativeTimer() {
    setTimeout(tickNativeTimer, 1000);
    const nativeTimerViewer = document.querySelector("div.nativeTimerViewer");
    if(getPlayerBool("viewNativeTimer")) {
        if(win.Timer) {
            const container = isNewInterface ? document.querySelector("div.sh_MenuPanel") : document.querySelector("table#main_top_table>tbody>tr>td>table>tbody>tr:nth-of-type(3)>td>table>tbody>tr>td:nth-last-of-type(1)");
            const containerRect = container.getBoundingClientRect();
            // nativeTimerViewer.style.top = `${containerRect.height}px`;
            // nativeTimerViewer.style.left = `${containerRect.width}px`;
            nativeTimerViewer.innerText = win.Delta.toLocaleString();
        }
    } else {
        nativeTimerViewer.style.display = "none";
    }
}
function skillPotions() {
    if(location.pathname == "/pl_info.php" && getUrlParamValue(location.href, "id") == PlayerId) {
        // Обновлям данные о выпитых зельях фракции
        // Skill potion for Dwarf faction till 2024-02-06 11:07
        // Зелье фракции Гном до 06-02-24 11:07
        const skillPotionExpirationRegExp = isEn ? new RegExp("Skill potion for (Knight|Necromancer|Wizard|Elf|Barbarian|Dark elf|Demon|Dwarf|Tribal|Pharaoh) faction till (\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2})", "g") : new RegExp("Зелье фракции (Рыцарь|Некромант|Маг|Эльф|Варвар|Темный эльф|Демон|Гном|Степной варвар|Фараон) до (\\d{2}-\\d{2}-\\d{2} \\d{2}:\\d{2})", "g");
        let skillPotionExpirationRegExpResult;
        while(skillPotionExpirationRegExpResult = skillPotionExpirationRegExp.exec(document.body.innerHTML)) {
            const fractionName = skillPotionExpirationRegExpResult[1];
            const expirationDateText = skillPotionExpirationRegExpResult[2];
            //console.log(`fractionName: ${fractionName}, expirationDateText: ${expirationDateText}, ${parseDate(expirationDateText, true).toLocaleString()}`);
            setPlayerValue(`SkillPotionExpirationTime${fractionName}`, parseDate(expirationDateText, true).getTime() + 60000);
        }
    }
    if(location.pathname == "/home.php") {
        if(isNewPersonPage) {
            const fractionsSpans = Array.from(document.querySelectorAll("div.home_left_column > div:first-child div[id=row] span.home_guild_text"));
            //console.log(fractionsSpans)
            fractionsSpans.forEach(x => {
                const skillPotionExpirationTime = getPlayerValue(`SkillPotionExpirationTime${x.innerText}`);
                if(skillPotionExpirationTime) {
                    x.insertAdjacentHTML("afterend", `<img style="vertical-align: text-top;" width="20px" height="20px" src="${resourcesPath3}/i/artifacts/skill_drink_b.png" title="${(isEn ? "Skill potion till" : "Зелье фракции до") + " " + new Date(parseInt(skillPotionExpirationTime)).toLocaleString() }">`);
                }
            });
        } else {
            const cells = Array.from(document.querySelectorAll("td"));
            const skillInfoCell = cells.find(x => x.innerHTML.includes(isEn ? "Knight:" : "Рыцарь:") && x.innerHTML.includes(isEn ? "Enchanters' guild" : "Гильдия Оружейников") && !x.innerHTML.includes("<td"));
            if(!skillInfoCell) {
                return;
            }
            for(const fraction of fractions) {
                const skillPotionExpirationTime = getPlayerValue(`SkillPotionExpirationTime${fraction}`);
                if(skillPotionExpirationTime) {
                    const fractionNode = findSequentialByValue(skillInfoCell, x => x.nodeName == "#text" && x.textContent.includes(fraction));
                    //console.log(fractionNode)
                    addElement("img", { style: "vertical-align: sub; width: 16px; height: 16px;", src: `${resourcesPath3}/i/artifacts/skill_drink_b.png`, title: (isEn ? "Skill potion till" : "Зелье фракции до") + " " + new Date(parseInt(skillPotionExpirationTime)).toLocaleString() }, fractionNode, "afterend");
                }
            }
        }
    }
    for(const fraction of fractions) {
        const skillPotionExpirationTime = getPlayerValue(`SkillPotionExpirationTime${fraction}`);
        if(skillPotionExpirationTime && parseInt(skillPotionExpirationTime) < getServerTime()) {
            GM.notification(isEn ? `The potion of the ${fraction} faction has expired` : `Истекло время действия зелья фракции ${fraction}`, "ГВД", `${resourcesPath3}/i/artifacts/skill_drink_b.png`);
            deletePlayerValue(`SkillPotionExpirationTime${fraction}`);
        }
    }
}
function verifyOptionKeys() {
    const defaultOptions = {
        healthNotification: false,
        healthSound: "",

        isShowWorkTimer: true,
        workNotification: true,
        workSound: "",
        enrollNumber: "0",
        showWorkaholicAlarmLastTwoEnrolls: true,
        disableWorkaholicAlarm: false,

        isShowSmithTimer: true,
        smithNotification: true,
        smithSound: "",

        isShowEnchantmentTimer: true,
        enchantmentNotification: true,
        enchantmentSound: "",

        isShowMercTimer: true,
        mercNotification: true,
        warlikeSound: "",

        isShowHuntTimer: true,
        huntNotification: true,
        huntLicenseRate: "1",
        huntLicenseExpirationTime: "0",
        huntLicenseText: "",

        isShowThiefTimer: true,
        thiefNotification: true,
        thiefOrRanger: false, // false is thief
        joinRangerBattle: false,

        isShowLeaderTimer: true,
        leaderNotification: true,
        leaderSound: "",

        isShowWatcherTimer: false,
        watcherNotification: true,
        watcherSound: "",

        isShowDefenceTimer: false,
        defenceNotification: true,
        defenceSound: "",

        customTimeRate: "1",
        abuBlessRate: "1",
        abuBlessExpirationTime: "0",
        abuBlessInfo: ""
    };
    const options = JSON.parse(getPlayerValue("hwmTimersOptions", JSON.stringify(defaultOptions)));
    Object.keys(defaultOptions).forEach(x => {
        if(!options.hasOwnProperty(x)) {
            options[x] = defaultOptions[x]; 
        }
        if(options[x] == "yes") {
            options[x] = true;
        }
        if(options[x] == "no") {
            options[x] = false;
        }
        if(options[x] == "1" && (x.startsWith("isShow") || ["showWorkaholicAlarmLastTwoEnrolls", "joinRangerBattle", "thiefOrRanger", "disableWorkaholicAlarm"].includes(x))) {
            options[x] = true;
        }
        if(options[x] == "0" && (x.startsWith("isShow") || ["showWorkaholicAlarmLastTwoEnrolls", "joinRangerBattle", "thiefOrRanger", "disableWorkaholicAlarm"].includes(x))) {
            options[x] = false;
        }
    });
    Object.keys(options).forEach(x => { if(!defaultOptions.hasOwnProperty(x)) { delete options[x]; } });
    setPlayerValue("hwmTimersOptions", JSON.stringify(options));
    //console.log(options);
    //console.log(Object.keys(options).reduce((t, x) => t + `${x}: ${typeof x}, ${options[x]}, ${typeof options[x]}\n`, ""))
}
function inBattle() {
    if(/warlog\|0/.exec(document.querySelector("html").innerHTML)) {
        //flash & html: warlog|0| -> бой происходит сейчас, warlog|1| -> запись боя, |player|7146446| -> id текущего игрока
        const playerIdExec = /\|player\|(\d+)\|/.exec(document.querySelector("html").innerHTML);
        if(playerIdExec && playerIdExec[1] == PlayerId) {
            const finalResultDiv = document.getElementById("finalresult_text");
            if(finalResultDiv.innerHTML.length <= 10) {
                observe(finalResultDiv, parseBattleResultPanel);
            }
            const battleMinute = new Date(getServerTime());
            battleMinute.setSeconds(0, 0);
            //console.log(`enableBattleNotification: ${getPlayerBool("enableBattleNotification")}, enableBattleSoundNotification: ${getPlayerBool("enableBattleSoundNotification")}, battleNotificationTime: ${new Date(parseInt(getPlayerValue("battleNotificationTime", 0))).toLocaleString()}, battleMinute: ${battleMinute.toLocaleString()}`);
            if(document.hidden && (getPlayerBool("enableBattleNotification") || getPlayerBool("enableBattleSoundNotification")) && parseInt(getPlayerValue("battleNotificationTime", 0)) < battleMinute.getTime()) {
                setPlayerValue("battleNotificationTime", battleMinute.getTime());
                if(getPlayerBool("enableBattleNotification")) {
                    GM.notification(isEn ? "Battle started" : "Битва началась", "ГВД", "https://dcdn.heroeswm.ru/i/new_top/_panelBattles.png", function() { window.focus(); });
                }
                if(getPlayerBool("enableBattleSoundNotification")) {
                    new Audio("http://commondatastorage.googleapis.com/codeskulptor-assets/week7-brrring.m4a").play();
                }
            }
        }
    }
}
function parseBattleResultPanel() {
    const finalResultDiv = document.getElementById("finalresult_text");
    if(finalResultDiv.innerHTML.length > 10) {
        const bolds = finalResultDiv.querySelectorAll("font b");
        let result = "fail";
        for(const bold of bolds) {
            if(bold.innerHTML == (isEn ? "Victorious:" : "Победившая сторона:")) {
                //console.log(`${bold.parentNode.nextSibling.nextSibling.firstChild.innerText}, UserName: ${getPlayerValue("UserName")}`);
                if(bold.parentNode.nextSibling.nextSibling.firstChild.innerText == getPlayerValue("UserName")) {
                    result = "win";
                }
                break;
            }
        }
        let expirience = 0;
        let skill = 0;
        const myResult = finalResultDiv.innerHTML.split("<br>").find(x => x.includes(getPlayerValue("UserName")));
        if(myResult) {
            const myResultExec = new RegExp(`(\\d+) ${isEn ? "exp" : "опыт"}.+ (\\d+\\.?\\d*) ${isEn ? "skill" : "умен"}`).exec(myResult);
            if(myResultExec) {
                expirience = parseInt(myResultExec[1]);
                skill = parseFloat(myResultExec[2]);
            }
        }
        checkBattleResults(result, expirience, skill);
        return true; // Сигнал обзёрверу, чтоб заканчивал обработку
    }
}
function checkBattleResults(result, expirience, skill) {
    console.log(`btype: ${win.btype}, battleType: ${getPlayerValue("battleType", "")}, result: ${result}, expirience: ${expirience}, skill: ${skill}`);
    if(win.btype == _NEWCARAVAN2 || win.btype == _RANGER || getPlayerValue("battleType", "") == "thief") {
        if(result == "fail") {
            setPlayerValue("thiefTimeoutEnd", calcThiefTimeoutEnd());
        } else {
            deletePlayerValue("thiefTimeoutEnd");
        }
    }
    if(getPlayerValue("battleType", "") == "hunt") {
        setHuntTimeout();
    }
    if(isMercBattle()) {
        setMercTimeout(result);
    }
    if(isLeaderBattle()) {
        setLeaderTimeout(result);
    }
    if(result == "win" && !isLeaderBattle()) {
        const options = JSON.parse(getPlayerValue("hwmTimersOptions"));
        let enrollNumber = parseInt(options.enrollNumber);
        if(skill >= 0.5) {
            enrollNumber = 0;
        } else if(skill > 0) {
            enrollNumber -= Math.floor(skill / 0.05);
            enrollNumber = Math.max(enrollNumber, 0);
        }
        if(!skill) {
            enrollNumber = 0;
        }
        updateOption("enrollNumber", enrollNumber);
    }
    if(result == "win" && isWatcherBattle()) {
        // Бои ГС
        let starsGained = 0;
        const finalResultDiv = document.getElementById("finalresult_text");
        if(finalResultDiv.innerHTML.indexOf(isEn ? "You managed to improve your result" : "Вы улучшили свой результат") === -1) {
            starsGained = document.querySelectorAll("div#finish_stars img[src*='/i/combat/star.png']").length;
        } else {
            const pointsGainedRegExp = isEn ? /,\s(.+)\sWG/ : /,\s(.+)\sочк/;
            const pointsGainedArr = pointsGainedRegExp.exec(finalResultDiv.innerHTML);
            if(pointsGainedArr) {
                switch(pointsGainedArr[1]) {
                    case "0.2":
                    case "0.3":
                        starsGained = 1;
                        break;
                    case "0.5":
                        starsGained = 2;
                        break;
                }
            }
        }
        if(starsGained > 0) {
            const todayWatchersResults = JSON.parse(getPlayerValue("TodayWatchersResults", `{ "requestTime": 0, "playerLevel": ${PlayerLevel}, "starsGained": 0, "starsLeft": ${maxWatchersStars} }`));
            todayWatchersResults.starsGained += starsGained;
            todayWatchersResults.starsLeft -= starsGained;
            console.log(todayWatchersResults);
            setPlayerValue("TodayWatchersResults", JSON.stringify(todayWatchersResults));
        }
    }
    deletePlayerValue("battleType");
}
function isMercBattle() {
    return win.btype == _GN_OTRYAD || win.btype == _GN_MONSTER || win.btype == _GN_NABEGI || win.btype == _GN_ZASHITA || win.btype == _GN_ARMY || win.btype == _SURVIVALGN || win.btype == _NEWGNCARAVAN;
}
function isLeaderBattle() {
    return win.btype == _CRE_EVENT || win.btype == _GL_EVENT || win.btype == _GL_DWARF_EVENT || win.btype == _NYGL2018_EVENT || win.btype == _CRE_SPEC || win.btype == _CRE_INSERT || win.btype == _CRE_TOUR || win.btype == _NEWCRE_EVENT;
}
function isWatcherBattle() {
    //95, 97, 102, 101, 98, 96, 99, 103, 107, 108, 109
    return win.btype == _UNIGUILD || win.btype == _PIRATE_EVENT || win.btype == _TOUR_EVENT || win.btype == _PAST_EVENT || win.btype == _GOLD_EVENT || win.btype == _OHOTA_EVENT || win.btype == _BUNT_EVENT || win.btype == _ZASADA_EVENT || win.btype == _2AND3_EVENT || win.btype == _CASTLE_EVENT || win.btype == _CARAVAN_EVENT;
}
function calcThiefTimeoutEnd(fromTime = getServerTime()) {
    const options = JSON.parse(getPlayerValue("hwmTimersOptions"));
    return fromTime + 60 * 60000 * options.customTimeRate * (getPlayerBool("IsDeer") ? 0.6 : 1) * options.abuBlessRate;
}
async function preloadDefaultAudio() {
    defaultAudio = new Audio('data:audio/mp3;base64,/+OAxAAAAAAAAAAAAEluZm8AAAAPAAAABQAACcoAMzMzMzMzMzMzMzMzMzMzMzMzM2ZmZmZmZmZmZmZmZmZmZmZmZmZmmZmZmZmZmZmZmZmZmZmZmZmZmZnMzMzMzMzMzMzMzMzMzMzMzMzMzP//////////////////////////AAAAOUxBTUUzLjk4cgE3AAAAAAAAAAAUQCQCTiIAAEAAAAnKGRQoyQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+OAxABX1F4koVjAAQjCEwjMYQMNFN52kFuDMg7zN6S6b5yx01M0x11uJOV6eYZQoAsSQOw1xyGGKAISEUHFBIzpQ4IL0Piieg+pvC30VO49A5D8R9h6gag6YDTJKsOmOseB4gzhU6Y6g7E37tSik5MMoRMLYFtEUGmQaoGWkLwLonYbcty2tqnQCJEMsnK9Pbr07+P5GKTGvK4bf9yH8lmFSURixK2cM4dyWXYbcty5fz5h2GGKAKCOo4ZdxBxTRrjkNYdyUqZlkCzCKDEIpjTxt/3IchyIcxlb/v/D8s5Xp+yh/IcvUljCpKHYdyWXXYYYoAhIQCIOKaQlc5aQuIuicz1SVXbVIoAqRYjEIcvSt/3IfycrxuNy+/Uht/3/l9yGGsM4a4xN36ZlCJhchAAzRgYAAYAFmEHFiPxVhty2uO5OV43G7esK8bdt34vchhrC7FB2XypciEhAImA8jSy7iABdEUrxuNy/sdUgMCEYDAYDIYDEYDEYCeapz8c1sF1vw7MA2FaUsp8YwZDBEYNhWZMjfLOfb9r5p0lxsxHh/+OCxDRkHGbSX5nqA8jG0fWPNSWWZzFJWn3iM+keNcjuMPAiMRxVMchckCm7dWzuJA7X25tHSGDhiM0jUGg8MwA6MVRlMeRFc4LgGgPTMdOTpuI4vqhQgA4YtFoZTF4aHDYY3j+FQNMJQfAAi4ax7z82SvnelEritIYJgGucGiKYohiYMAUZKC4YkCcTDAZFD134cs58m6fmMst8qcprjzGKwLgIXzAkATBsETDcUzIgPDDwQjDgFTBwCQoEZgqBJhEF2OfcOc/Cn7hqWxqSTk3STW5fP0XgIdDBABjGAMDCQJAKCYQHaYBheG5YCoqAOYMA6BBHIQqMFgDblLOU/cKev2nzz53fK+7dLQasZSvPlXDehUIQ4CCIADBYCGJGCgFGBAZEIEgEFjB0AAQIqQxg4Dq9QgHUrTBsATAsGRCBBhuD///8z1+ff/P////+7/Llzes8/u/++cw59bO7zD///33////V4SolSuRCmPL6nAqR9ZQ0l+oyuAOCyR+7FK1oVDzAwRqbMUv6FhjNAQEMzLsmIgS1UOBgAImIjQoipf/jgsQ4ZLx2nAGY2ADAELIgUAh5h5eawLGRKBiAwYwIDS0ZmSGrrBAOmEGpgouigCBMxr2N3HiEvAQ2aIDGiCZphKHYxkpACC0WAgEWEJSRLJMWI9mGDJdQCFQcamMhKN7LzABcSEjHA8AA5elmCe6Wyi8XQAKiAgOjA3eGCAEC4GQCqXiwTLlTL5YaBQRe6EhFFL9fUOA0AL3Q64KYyQbgt8mkv1/V9P4JChgQoIASD1WhYEVpesZBH3VMAQBB5E1E5H4mAwAALneJRhsr1OGyC1DFaKvMma+jkOosKrLL2iNOadDTcpLBz1Mob+FzywCx3ThmMsqTXZiplIWdwPIXRj7WqRrDayxfVC8V+dl1aRR2NtKd6IwPBzgOHArgzcOydwWEtee5yqC3EKOBYBlNSIajDvVs696AXWjEzYj0zWiESlUWuWsb+M/aiFL3KW5SCe1fmpBWfr/+kk8SlmOX/9LVpKtJMzwBIiRGAngdQbAVvPs+70vm3FR5QGDWsugz5YIx02MFFn6TrWuxJy7xiJkYuqGZsQKPgUHGFgQUFQr/44LEOmbMdnABmdgAhKn3zEAY9pkI2cEtkxQaUamfHRgpKYkJoiCQyjYDgEw0JAwcu8oDzYms8RzMdCgUxpsEIUDSIEgZkBmBQsQASPSb7jusKggBA0bDEgFDEtgRBDSAMhKao2qGq3ofo0Q+pg+rdk92msTdeNCMGMCHzCgMUDQsEjAAFi9CS2NSLCkt1uQ+mMtOEyt6EAa4FRqWr4f2BncV48oMCRoXTaC4EoEAjss8vQVBCAAXmuFmzrq+bm26eLBIQ6LLnpruZTO0uh2WRZOBAEFID2syWVM6CoEIwRJp2m7JdqmZul6sLATxwJC3QdtNVrssgZuLSoKguZbDIG4uk+9O3sATbiWKSBtOUpasEyNjmC5Y7EZUwaJtNhpXUudGaf9nNO1xsbcFG2MwFLnphyLy+JPO0xpD708akEpls9Ny2Q0sbi71zrcYzFYlGnqxr7d+UvHK4nDjnf/wbDz0WJFR//tfoLTcY9mqAQMgAqUQjTA76PNjioDGCBQNciLWVhUVUiVilrWC2KV2VhS/qgKJpbEABLIqbRNHks6W/+OCxDNgzGY2JdjIAGUFX4R6LZMFZkWeMMQxQEuhEGaDZvQmaMmtfyoVKQASaC5sNmWQXSdaOsNSFQkoqoml/i0xbZMKFOCoCiqiqu53n+f6HpdnKX1ZUmMisptAzopelsS0qRSxlhkTi7xeJMJl0ndJL4u8g8sZymHJDISmWyhcyQyAZB5IpUzEp19lhlAlTLuZ0153qjKlAkVkVkVi7xaYtMumDFAkJSAZIpQYvEhKL+lpS2qKLTXiQTAEIwxEHXVw7KXZWFTFRVXc/Wcpf1/X9f2WzLWWIuLOPssMoEkMkKgFQCpgurAScxd4uUsWQ/Vdlhq7VSrti0y/stwymXBZzFoi1lhrEWuw7hammtM6fqbXKXVAAJhBoPOtnS8rQ1DUPWa0af52nKcpynKayu1drOX5vSp/n+hmMwy/rWVMS4JgCmIKuqVspXau1iLOXJcmNS7tWlpcJVGqXlVMQU1FMy45OC40VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==');
    defaultAudio.preload = 'auto';
}
function setTexts() {
    const options = JSON.parse(getPlayerValue("hwmTimersOptions"));
    var obj;
    if(isEn) {
        obj = {
            healthNotificationEnabled: 'Army restore alarm on',
            onceHealthNotificationEnabled: 'Alarm once at army restore',
            workNotificationEnabled: 'Workshift alarm on',
            notificationDisabled: 'Alarm off',
            smithNotificationEnabled: 'Blacksmith alarm on',
            enchantmentNotificationEnabled: 'Enchantment completed alarm on',
            mercNotificationEnabled: 'Mercenaries Guild alarm on',
            defenceNotificationEnabled: 'Defence begin alarm on',
            regexp_timegn0: /Come back in (\d+) minutes\./,
            regexp_timegn1: /\. Time left: (\d+) minutes\./,
            regexp_timegn2: /ou have (\d+) minutes left/,
            regexp_timegn3: /\. Time left: (\d+) minutes\./,
            regexp_timegn4: /still have (\d+) minutes/,
            regexp_timegn5: /you still have \d+ attempts and (\d+) minutes/,
            huntNotificationEnabled: 'Hunters Guild alarm on',
            nativeHuntTimerText: 'Next hunt available in',
            thiefNotificationEnabled: !options.thiefOrRanger ? 'Thieves Guild alarm on' : 'Rangers Guild alarm on',
            leaderNotificationEnabled: "Leader's Guild alarm on",
            watcherNotificationEnabled: "Watcher's Guild alarm on",
            regexp_timegre: /Come in (\d+) min/,
            enrollAgainIn: /You may enroll again in (\d+) min/,
            workPlace: 'Work place:',
            workMessage: 'LG: You may enroll again',
            smithMessage: 'BS: Blacksmith works are finished',
            enchantmentMessage: 'BS: Enchantment completed',
            mercMessage: 'MG: Mercenaries Guild has a quest for you',
            huntMessage: 'HG: You notice traces ...',
            leaderMessage: 'LG: One more task enabled',
            watcherMessage: 'WG: new tasks available',
            defenceMessage: 'Defence begining',
            thiefMessage: !options.thiefOrRanger ? 'TG: You may set an ambush' : 'RG: Rangers Guild has a quest for you',
            signalSound: 'Audio file ',
            alarm_mode: '<b>Timer alarm mode</b>:',
            alarm_mode_sound: 'audio',
            alarm_mode_alert: 'message',
            alarm_mode_both: 'notification',
            alarm_mode_none: 'off',
            healthTitle: 'health',
            warlikeTitle: 'MHT(R)G',
            leaderTitle: 'LG',
            watcherTitle: 'WG',
            defenceTitle: "defence",
            workTimerPanelCaption: 'LG',
            smithTimerPanelCaption: 'BS',
            smithWelcome: 'To Blacksmith',
            enchantmentTimerPanelCaption: 'EN',
            enchantmentWelcome: 'To enchantment',
            mercTimerPanelCaption: 'MG',
            mercWelcome: 'To Mercenaries\' Guild',
            huntTimerPanelCaption: 'HG',
            huntTimerPanelTitle: 'To Hunters\' Guild',
            thiefTimerPanelCaption: !options.thiefOrRanger ? 'TG' : 'RG',
            thiefWelcome: !options.thiefOrRanger ? 'To Thieves\' Guild' : 'To Rangers Guild post',
            leaderWelcome: "To leaders guild",
            leaderTimerPanelCaption: "LG",
            watcherTimerPanelCaption: "WG",
            defenceTimerPanelCaption: "D",
            defenceWelcome: 'Defences',
            watcherWelcome: "Watchers' guild",
            manaWelcome: 'Settings',
            successfullyEnrolled: 'You have successfully enrolled',
            currentlyUnemployed: 'You are currently unemployed',
            regexp_map_go: 'During the journey you have access to the',
            huntLicenseExpirationMessage: 'The license expires ',
            resetTimersTitle: 'Reset all timers',
            setOnceThiefTimeout: 'Set TG/RG timer for once to',
            cusomRateTitle: 'Quests HG, MG, TG, RG more often',
            joinRangerBattleText: 'Immediately initiate Rangers\' guild battle on arrival',
            isShowTimersTitle: 'Show timers',
            showWorkaholicAlarmLastTwoEnrollsTitle: 'Notify about workaholic penalty only 2 workshifts away',
            disableWorkaholicAlarmTitle: 'Turn off workaholic penalty notifications',
            huntLicenseAuto: '<b>Hunter license</b> is detected automatically in Hunters\' Guild',
            hide: 'Hide',
            alreadyEemployed: 'You are already employed\.',
            passedLessThanOneHour: 'Less than one hour passed since last enrollment\. Please wait\.',
            noVacancies: 'No vacancies\.'
        };
    } else {
        obj = {
            healthNotificationEnabled: 'Будет предупреждение о восстановлении армии',
            onceHealthNotificationEnabled: 'Установить единоразово предупреждение о восстановлении армии',
            workNotificationEnabled: 'Будет предупреждение о конце рабочего часа',
            notificationDisabled: 'Не будет предупреждения',
            smithNotificationEnabled: 'Будет предупреждение о завершении работ в Кузнице',
            enchantmentNotificationEnabled: 'Будет предупреждение об окончании улучшения',
            mercNotificationEnabled: 'Будет предупреждение Гильдии Наемников',
            defenceNotificationEnabled: 'Будет предупреждение о начале защиты',
            regexp_timegn0: /Приходи через (\d+) мин/,
            regexp_timegn1: /Осталось времени: (\d+) минут/,
            regexp_timegn2: /тебя осталось (\d+) минут/,
            regexp_timegn3: /у тебя еще есть (\d+) минут/,
            regexp_timegn4: /\. Осталось (\d+) минут\./,
            regexp_timegn5: /осталось \d+ попыток и (\d+) минут/,
            huntNotificationEnabled: 'Будет предупреждение Гильдии Охотников',
            nativeHuntTimerText: 'Следующая охота будет доступна через',
            thiefNotificationEnabled: !options.thiefOrRanger ? 'Будет предупреждение Гильдии Воров' : 'Будет предупреждение Гильдии Рейнджеров',
            leaderNotificationEnabled: 'Будет предупреждение Гильдии лидеров',
            watcherNotificationEnabled: 'Будет предупреждение Гильдии стражей',
            regexp_timegre: /приходи через (\d+) мин/,
            enrollAgainIn: /Вы можете устроиться на работу через (\d+)/,
            workPlace: 'Место работы:',
            workMessage: 'ГР: Пора на работу',
            smithMessage: 'ГК: Работа в Кузнице завершена',
            enchantmentMessage: 'ГК: Улучшение завершено',
            mercMessage: 'ГН: Для Вас есть задание в Гильдии Наемников',
            huntMessage: 'ГО: Вы увидели следы ...',
            leaderMessage: 'ГЛ: Ещё одно задание доступно',
            watcherMessage: 'ГС: задания обновились',
            defenceMessage: 'Защита началась',
            thiefMessage: !options.thiefOrRanger ? 'ГВ: Вы можете устроить засаду' : 'ГРж: Есть задание в Гильдии Рейнджеров',
            signalSound: 'Звук сигнала ',
            alarm_mode: '<b>Режим оповещения</b> окончания таймера:',
            alarm_mode_sound: 'звук',
            alarm_mode_alert: 'сообщение',
            alarm_mode_both: 'оповещение',
            alarm_mode_none: 'отключен',
            healthTitle: 'здоровья',
            warlikeTitle: 'ГОНВ(Рж)',
            leaderTitle: 'ГЛ',
            watcherTitle: 'ГС',
            defenceTitle: "защиты",
            workTimerPanelCaption: 'ГР',
            smithTimerPanelCaption: 'ГК',
            smithWelcome: 'В Кузницу',
            enchantmentTimerPanelCaption: 'ОР',
            enchantmentWelcome: 'К улучшениям',
            mercTimerPanelCaption: 'ГН',
            mercWelcome: 'В здание Гильдии Наемников',
            huntTimerPanelCaption: 'ГО',
            huntTimerPanelTitle: 'В здание Гильдии Охотников',
            thiefTimerPanelCaption: !options.thiefOrRanger ? 'ГВ' : 'ГРж',
            thiefWelcome: !options.thiefOrRanger ? 'В здание Гильдии Воров' : 'В здание Гильдии Рейнджеров',
            leaderWelcome: "В гильдию лидеров",
            leaderTimerPanelCaption: "ГЛ",
            watcherTimerPanelCaption: "ГС",
            defenceTimerPanelCaption: "З",
            defenceWelcome: 'Защиты',
            watcherWelcome: "Гильдия стражей",
            manaWelcome: 'Настройки',
            successfullyEnrolled: 'Вы устроены на работу',
            currentlyUnemployed: 'Вы нигде не работаете',
            regexp_map_go: 'Во время пути Вам доступны',
            huntLicenseExpirationMessage: 'Лицензия истекает ',
            resetTimersTitle: 'Обнулить все таймеры',
            setOnceThiefTimeout: 'Единоразово установить таймер ГВ/ГРж равным',
            cusomRateTitle: 'Задания ГО, ГН, ГВ, ГРж чаще на',
            joinRangerBattleText: 'По прибытии вступать в бои Гильдии Рейнджеров',
            isShowTimersTitle: 'Отображать',
            showWorkaholicAlarmLastTwoEnrollsTitle: 'Показывать штраф трудоголика только за 2 часа',
            disableWorkaholicAlarmTitle: 'Отключить уведомления о штрафе трудоголика',
            huntLicenseAuto: '<b>Лицензия охотника</b> определяется автоматически (в Гильдии Охотников)',
            hide: 'Скрывать',
            alreadyEemployed: 'Вы уже устроены\.',
            passedLessThanOneHour: 'Прошло меньше часа с последнего устройства на работу\. Ждите\.',
            noVacancies: 'Нет рабочих мест\.'
        };
    }
    return obj;
}
function createTimersPanel() {
    let newYearSuffix = document.querySelector("img[src*='i/top_ny']") || document.querySelector("img[src*='i/new_top_ny']") ? "_" : ""; // если новый год
    let folder = newYearSuffix ? `${resourcesPath2}/i/top_ny_rus/line/` : `${resourcesPath2}/i/top/line/`;
    const img_link = document.querySelector("img[src*='i/top'][src*='/line/t_end']");
    if(img_link) {
        folder = /(\S*\/line\/)/.exec(img_link.src)[1];
    } else {
        folder = `${resourcesPath2}/i/top_ny_rus/line/`; // Оставим для новой шапки синий, новогодний цвет
        newYearSuffix = "_";
    }
    //console.log(`folder: ${folder}, newYearSuffix: ${newYearSuffix}, ${folder}t_end${newYearSuffix}.jpg`); // folder: https://dcdn2.heroeswm.ru/i/top_ny_rus/line/, newYearSuffix: _

    let container;
    let timersContainerWidth;
    let zIndex = 0;
    let leftMargin = 0;
    let topMargin = 0;
    let height;
    let widthStyle = "";
    let minWidthStyle = "";
    let background = "";
    let boxShadow = "";
    if(isMobileInterface) {
        const panelResourses = document.querySelector("div#panel_resourses");
        if(!panelResourses) {
            return;
        }
        container = panelResourses;
        const gold = panelResourses.querySelectorAll("div.panel_res_link.panel_res_link_add")[1];
        leftMargin = gold.getBoundingClientRect().right - panelResourses.getBoundingClientRect().left + 2;
        height = panelResourses.getBoundingClientRect().height - 2;
        background = `background: url(${folder}t_com_bkg${newYearSuffix}.jpg);`;
        boxShadow = `box-shadow: inset 0 0 0 1px #e2b77d, inset 0 0 4px rgba(0,0,0,.5), inset 0 -${parseInt(panelResourses.getBoundingClientRect().height/2)}px 10px rgba(0,0,0,.5), 0 1px 7px rgba(0,0,0,.7);`;
    } else if(isNewInterface) {
        container = document.querySelector("div.sh_MenuPanel");
        const shContainer = document.querySelector("div.sh_container");
        timersContainerWidth = shContainer.getBoundingClientRect().width - 30 * 2;
        minWidthStyle = `text-align: center; min-width: ${timersContainerWidth}px;`
        topMargin = -65;
        leftMargin = (container.getBoundingClientRect().width - timersContainerWidth) / 2;
        zIndex = 2;
        height = 22;
        document.querySelector("div#ResourcesPanel").style.height = "22px";
        background = `background-color: #4f76a7;`;
        boxShadow = "box-shadow: inset 0 0 0 1px #e2b77d, inset 0 0 4px rgba(0,0,0,.5), inset 0 -12px 10px rgba(0,0,0,.5), 0 1px 7px rgba(0,0,0,.7);";
    } else {
        const dragonLeft = document.querySelector("img[src*='i/top'][src*='/dragon__left']"); // https://dcdn1.heroeswm.ru/i/top_ny_rus/dragon__left_.jpg
        const dragonRight = document.querySelector("img[src*='i/top'][src*='/dragon__right']");
        container = dragonLeft.parentNode;
        timersContainerWidth = dragonRight.getBoundingClientRect().left - dragonLeft.getBoundingClientRect().left + 124;
        widthStyle = `width: ${timersContainerWidth}px;`;
        topMargin = -26;
        leftMargin = -43;
        height = 22;
        background = `background: url(${folder}t_com_bkg${newYearSuffix}.jpg);`;
        boxShadow = "box-shadow: inset 0 0 0 1px #e2b77d;";
    }
    addStyle(`
    .timers-container {
        position: absolute;
        margin: ${topMargin}px 0px 0px ${leftMargin}px;
        text-align: center;
        z-index: ${zIndex};
    }
    .timers-table * {
        font-size: 11px;
        height: ${height}px;
        color: #f5c137;
    }
    .timers-cell {
        text-align: center;
        ${background}
        ${boxShadow}
        white-space: nowrap;
        font-weight: bold;
        border-radius: 5px;
    }
    .timers-cell span {
        cursor: pointer;
    }
    .timers-cell a {
        text-decoration: none;
    }
`);
    let timersHtml = "";
    for(const timer of timerNames.map(x => { return { name: `${x}Timer`, caption: texts[`${x}TimerPanelCaption`] ? texts[`${x}TimerPanelCaption`] + ": " : "" }; })) {
        timersHtml += `<td id="${timer.name}Cell" class="timers-cell"><span id="${timer.name}PanelCaption">${timer.caption}</span><a id="${timer.name}Panel">00:00</a></td>`;
    }
    const timersPanel = addElement("div", { class: "timers-container", innerHTML: `<table cellpadding=0 cellspacing=0 align="center" class="timers-table" style="${widthStyle}${minWidthStyle}"><tr>${timersHtml}</tr></table>` }, container);
    timersPanel.querySelector('#healthTimerPanel').addEventListener("click", function() { updateOption("healthNotification", x => !x.healthNotification); timersPanelDataBind(); });
    timersPanel.querySelector('#workTimerPanelCaption').addEventListener("click", function() { updateOption("workNotification", x => !x.workNotification); timersPanelDataBind(); });
    timersPanel.querySelector('#smithTimerPanelCaption').addEventListener("click", function() { updateOption("smithNotification", x => !x.smithNotification); timersPanelDataBind(); });
    timersPanel.querySelector('#enchantmentTimerPanelCaption').addEventListener("click", function() { updateOption("enchantmentNotification", x => !x.enchantmentNotification); timersPanelDataBind(); });
    timersPanel.querySelector('#mercTimerPanelCaption').addEventListener("click", function() { updateOption("mercNotification", x => !x.mercNotification); timersPanelDataBind(); });
    timersPanel.querySelector('#huntTimerPanelCaption').addEventListener("click", function() { updateOption("huntNotification", x => !x.huntNotification); timersPanelDataBind(); });
    timersPanel.querySelector('#thiefTimerPanelCaption').addEventListener("click", function() { updateOption("thiefNotification", x => !x.thiefNotification); timersPanelDataBind(); });
    timersPanel.querySelector('#leaderTimerPanelCaption').addEventListener("click", function() { updateOption("leaderNotification", x => !x.leaderNotification); timersPanelDataBind(); });
    timersPanel.querySelector('#watcherTimerPanelCaption').addEventListener("click", function() { updateOption("watcherNotification", x => !x.watcherNotification); timersPanelDataBind(); });
    timersPanel.querySelector('#defenceTimerPanelCaption').addEventListener("click", function() { updateOption("defenceNotification", x => !x.defenceNotification); timersPanelDataBind(); });

    timersPanel.querySelector("#manaTimerPanel").addEventListener("click", settings);
}
function timersPanelDataBind() {
    if(!document.getElementById("manaTimerPanel")) {
        return; // timersPanel ещё не создана
    }
    const options = JSON.parse(getPlayerValue("hwmTimersOptions"));
    const leaderTasks = JSON.parse(getPlayerValue("leaderTasks", "[3, 3]"));
    const todayWatchersResults = JSON.parse(getPlayerValue("TodayWatchersResults", `{ "starsGained": 0, "starsLeft": ${maxWatchersStars} }`));
    const timersData = {
        "health": {
            panelTitle: options.healthNotification ? texts.healthNotificationEnabled : texts.onceHealthNotificationEnabled,
            color: options.healthNotification ? '#ff9c00' : '#f5c137'
        },
        "work": {
            panelTitle: [options.abuBlessInfo, getWorkaholicPenaltyText()].join('\n'),
            panelReference: getPlayerValue("LastWorkObjectId") ? `object-info.php?id=${getPlayerValue("LastWorkObjectId")}` : undefined,
            isHideable: true,
            color: !options.disableWorkaholicAlarm && options.enrollNumber > 8 ? '#ff9c00' : '#f5c137'
        },
        "smith": {
            panelReference: "/mod_workbench.php?type=repair",
            isHideable: true
        },
        "enchantment": {
            panelReference: "/mod_workbench.php",
            isHideable: true
        },
        "merc": {
            panelReference: "/mercenary_guild.php",
            isHideable: true
        },
        "hunt": {
            panelTitle: [texts.huntTimerPanelTitle, options.huntLicenseText == "" ? "" : texts.huntLicenseExpirationMessage + options.huntLicenseText].join('\n'),
            panelReference: "/hunter_guild.php",
            isHideable: true
        },
        "thief": {
            panelTitle: !options.thiefOrRanger ? `${isEn ? "Refresh from war log" : "Обновить из протокола боев"}` : `${isEn ? "To ganger's guild" : "В гильдию рейнджеров"}`,
            //panelReference: !options.thiefOrRanger ? "/thief_guild.php" : "/ranger_guild.php",
            panelReference: !options.thiefOrRanger ? "" : "/ranger_guild.php",
            isHideable: true,
            clickHandler: !options.thiefOrRanger ? function(e) { e.preventDefault(); checkAmbushResult(true); } : null
        },
        "leader": {
            panelTitle: `${isEn ? "Tasks available" : "Доступно заданий"}: ${leaderTasks[0]}`,
            panelReference: "/leader_guild.php",
            isHideable: true,
            color: leaderTasks[0] == maxLeaderTasks ? '#FF0000' : '#f5c137'
        },
        "watcher": {
            panelTitle: isEn ? `Stars received today: ${todayWatchersResults.starsGained} from ${todayWatchersResults.starsGained + todayWatchersResults.starsLeft}` : `Получено звёзд сегодня: ${todayWatchersResults.starsGained} из ${todayWatchersResults.starsGained + todayWatchersResults.starsLeft}`,
            panelReference: "/task_guild.php",
            isHideable: true
        },
        "defence": {
            panelReference: "/mapwars.php",
            isHideable: true,
        },
        "mana": { }
    };
    for(const timer in timersData) {
        const timerData = timersData[timer];
        if(timerData.isHideable) {
            const timerPanelCaption = document.getElementById(`${timer}TimerPanelCaption`);
            timerPanelCaption.style.color = options[`${timer}Notification`] ? '#FF0000' : '#f5c137';
            timerPanelCaption.title = options[`${timer}Notification`] ? texts[`${timer}NotificationEnabled`] : texts.notificationDisabled;
            let isShow = options[`isShow${firstUpper(timer)}Timer`];
            const isShowNotEmptyOnly = timerSettings[timer] && timerSettings[timer].isShowNotEmptyOnly;
            if(isShowNotEmptyOnly && !getSecondsLeft(timer)) {
                isShow = false;
            }
            document.getElementById(`${timer}TimerCell`).style.display = isShow ? '' : "none";
            if(timerData.panelCaption) {
                timerPanelCaption.innerText = timerData.panelCaption;
            }
        }
        const timerPanel = document.getElementById(`${timer}TimerPanel`);
        timerPanel.href = timerData.panelReference || "javascript: void(0);";
        timerPanel.title = timerData.panelTitle || texts[`${timer}Welcome`];
        if(timerData.clickHandler) {
            timerPanel.addEventListener("click", timerData.clickHandler);
        }
        if(timerData.color) {
            timerPanel.style.color = timerData.color;
        }
    }
}
function firstUpper(str) { return str[0].toUpperCase() + str.slice(1); }
function timersDataBind() {
    timerNames.forEach(x => {
        document.getElementById(`${x}TimerPanel`).innerHTML = secondsFormat(getSecondsLeft(x), timerSettings[x]?.timeFormat ?? timeFormats.full)
        //+ (x == "leader" ? `-${JSON.parse(getPlayerValue("leaderTasks", "[3, 3]"))[0]}` : "");
    });
}
function checkWork() {
    if(location.pathname == '/object_do.php' || location.pathname == '/object-info.php') {
        if(document.body.innerHTML.match(texts.successfullyEnrolled)) {
            setWorkTimeoutEnd();
        }
    }
    if(location.pathname == '/home.php') {
        if(document.body.innerHTML.match(texts.currentlyUnemployed)) {
            deletePlayerValue("workTimeoutEnd");
            return;
        }
        //const currentlyEmployedAt = isEn ? "Currently employed at:" : "Место работы:";
        const currentlyEmployedAt = isEn ? "employed" : "работы";
        const workObjectRef = Array.from(document.querySelectorAll("a[href^='object-info.php']")).find(x => getParent(x, isNewPersonPage ? "span" : "td").innerHTML.includes(currentlyEmployedAt));
        //console.log(workObjectRef)
        const workObjectId = workObjectRef ? getUrlParamValue(workObjectRef.href, "id") : "";
        // подхватывание времени окончания работы с home.php и его проверка
        const enrollAgainInExec = texts.enrollAgainIn.exec(document.body.innerHTML);
        if(enrollAgainInExec) {
            setWorkTimeoutEnd(getServerTime() + (Number(enrollAgainInExec[1]) + 1) * 60000, workObjectId);
        } else {
            const enrollTimeExec = new RegExp(` ${isEn ? "since" : "с"} (\\d{1,2}:\\d{1,2})`).exec(document.body.innerHTML);
            if(enrollTimeExec) {
                setWorkTimeoutEnd(parseDate(enrollTimeExec[1], false, true).getTime() + (60 + 1) * 60000, workObjectId);
            }
        }
    }
}
function checkWorkaholic() {
    if(location.pathname == '/object-info.php') {
        var parent_trud = document.querySelector("a[href*='objectworkers.php']");
        if(parent_trud) {
            const options = JSON.parse(getPlayerValue("hwmTimersOptions"));
            const workaholicPenaltyExec = new RegExp(`\\*\\&nbsp;(0\\.?\\d?) ${isEn ? "workaholic penalty" : "штраф трудоголика"}`).exec(document.body.innerHTML);
            // отработано смен
            let enrollNumber = Number(options.enrollNumber);
            if(workaholicPenaltyExec) {
                var workaholicPenalty = Number(workaholicPenaltyExec[1]);
                if(workaholicPenalty == 0.8) {
                    enrollNumber = 9;
                } else if(workaholicPenalty == 0.7) {
                    enrollNumber = 10;
                } else if(workaholicPenalty == 0.6) {
                    enrollNumber = 11;
                } else if(workaholicPenalty == 0.5) {
                    enrollNumber = 12;
                } else if(workaholicPenalty == 0.4) {
                    enrollNumber = 13;
                } else if(workaholicPenalty == 0.2) {
                    enrollNumber = 14;
                } else if(workaholicPenalty == 0.1 && enrollNumber < 15) {
                    enrollNumber = 15;
                } else if(workaholicPenalty == 0 && enrollNumber < 48) {
                    enrollNumber = 48;
                }
            } else if(enrollNumber > 8) {
                enrollNumber = 8;
            }
            //console.log(`oldEnrollNumber: ${options.enrollNumber}, enrollNumber: ${enrollNumber}, workaholicPenalty: ${workaholicPenalty}`);
            updateOption("enrollNumber", enrollNumber);
            if(!options.disableWorkaholicAlarm && (!options.showWorkaholicAlarmLastTwoEnrolls || enrollNumber >= 7)) {
                addElement('span', { innerHTML: getWorkaholicPenaltyText(), style: enrollNumber >= 7 ? "color: red; font-weight: bold;" : "" }, parent_trud.parentNode.previousSibling.previousSibling, "beforebegin");
            }
            // замена "Уже устроен"
            parent_trud = document.querySelector("a[href*='objectworkers.php']").parentNode.parentNode;
            if(getServerTime() > parseInt(getPlayerValue("workTimeoutEnd", 0)) && (parent_trud.innerHTML.match(texts.alreadyEemployed) || (texts.alreadyEemployed = parent_trud.innerHTML.match(texts.passedLessThanOneHour)) || (texts.alreadyEemployed = parent_trud.innerHTML.match(texts.noVacancies)))) {
                parent_trud.innerHTML = parent_trud.innerHTML.replace(texts.alreadyEemployed, '<style>@-webkit-keyframes blink {80% {opacity:0.0;}} @-moz-keyframes blink {80% {opacity:0.0;}} @-o-keyframes blink {80% {opacity:0.0;}} @keyframes blink {80% {opacity:0.0;}}</style><font color=blue style="-webkit-animation: blink 1s steps(1,end) 0s infinite; -moz-animation: blink 1s steps(1,end) 0s infinite; -o-animation: blink 1s steps(1,end) 0s infinite; animation: blink 1s steps(1,end) 0s infinite"><b>' + texts.alreadyEemployed + '</b></font>');
            }
        }
    }
}
function getWorkaholicPenaltyText() {
    const options = JSON.parse(getPlayerValue("hwmTimersOptions"));
    const enrollNumber = Number(options.enrollNumber);
    const limits = [9, 11, 48];
    if(enrollNumber < limits[0]) {
        return isEn ? `Workaholic penalty through ${limits[0] - enrollNumber} enrollments` : `Штраф трудоголика через ${limits[0] - enrollNumber} устройств`;
    } else if(enrollNumber < limits[1]) {
        return isEn ? `It will be impossible to get a job in production through ${limits[1] - enrollNumber} enrollments` : `Невозможно устроиться на производство будет через ${limits[1] - enrollNumber} устройств`;
    } else if(enrollNumber < limits[2]) {
        return isEn ? `The opportunity to get a job is ending through ${limits[2] - enrollNumber} enrollments` : `Возможность устраиваться на работу заканчивается через ${limits[2] - enrollNumber} устройств`;
    }
    return "";
}
function setWorkTimeoutEnd(workTimeoutEnd, workObjectId) {
    workTimeoutEnd = workTimeoutEnd || getServerTime() + 60 * 60000;
    workObjectId = workObjectId || getUrlParamValue(location.href, "id");
    const oldValue = parseInt(getPlayerValue("workTimeoutEnd", 0));
    if(Math.abs(oldValue - workTimeoutEnd) > 120000) {
        setPlayerValue("workTimeoutEnd", workTimeoutEnd);
        setPlayerValue("LastWorkObjectId", workObjectId);
        updateOption("enrollNumber", x => Number(x.enrollNumber) + 1);
    }
}
function checkPremiumAccount() {
    const options = JSON.parse(getPlayerValue("hwmTimersOptions"));
    // проверка наличия эффекта блага АБУ Бекра (премиум аккаунт) // skipn=1 это 'Ознакомился' или 'Got it!'
    if(location.pathname == '/home.php' && document.querySelector("img[src*='i/icons/attr_defense.png']") && !document.querySelector("a[href*='home.php?skipn=1']")) {
        const starImage = document.querySelector("img[src$='i/star_extend.png']") || document.querySelector("img[src$='i/star.png']");
        options.abuBlessRate = starImage ? "0.7" : "1";
        options.abuBlessExpirationTime = '0';
        options.abuBlessInfo = starImage ? (starImage.title || starImage.getAttribute("hint")) : '';
        if(starImage) {
            starImage.align = "absmiddle";
            const time_prem = /(\d+-\d+-\d+ \d+:\d+)/.exec(options.abuBlessInfo);
            if(time_prem) {
                const abuEnd = parseDate(time_prem[1], true);
                options.abuBlessExpirationTime = abuEnd.getTime();
            }
        }
    }
    if(options.abuBlessInfo && Number(options.abuBlessExpirationTime) < getServerTime()) {
        options.abuBlessRate = '1';
        options.abuBlessExpirationTime = '0';
        options.abuBlessInfo = '';
    }
    if(parseInt(options.abuBlessExpirationTime) > getServerTime()) {
        maxLeaderTasks = 4;
        maxWatchersStars = 12;
    }
    setPlayerValue("hwmTimersOptions", JSON.stringify(options));
}
function checkHuntLicense() {
    const options = JSON.parse(getPlayerValue("hwmTimersOptions"));
    var form_f2 = document.querySelector("form[name='f2']");
    if(location.pathname == '/hunter_guild.php' && form_f2) {
        while(form_f2.tagName != 'TR') {
            form_f2 = form_f2.parentNode;
        }
        options.huntLicenseRate = '1';
        options.huntLicenseExpirationTime = '0';
        options.huntLicenseText = '';
        if(/(\d+)-(\d+)-(\d+) (\d+):(\d+)/.exec(form_f2.innerHTML)) {
            if(!form_f2.querySelector("input[type='submit'][onclick*='confirm']")) {
                // лицензия МО
                options.huntLicenseRate = '' + (50 / 100);
            } else {
                // лицензия О
                options.huntLicenseRate = '' + (75 / 100);
            }
            const forms = form_f2.querySelectorAll("td");
            var time_lic_mo_max = 0;
            for(const form of forms) {
                if(form.innerHTML.indexOf("<td") != -1) {
                    continue;
                }
                var time_lic_mo = /(\d+-\d+-\d+ \d+:\d+)/.exec(form.innerHTML);
                if(time_lic_mo) {
                    const licEndTime = parseDate(time_lic_mo[1], true).getTime();
                    if(licEndTime > time_lic_mo_max) {
                        time_lic_mo_max = licEndTime;
                        options.huntLicenseExpirationTime = licEndTime;
                        options.huntLicenseText = time_lic_mo[0];
                    }
                }
            }
        }
    }
    if(options.huntLicenseText && Number(options.huntLicenseExpirationTime) < getServerTime()) {
        // лицензия охотника истекла
        options.huntLicenseRate = '1';
        options.huntLicenseExpirationTime = '0';
        options.huntLicenseText = '';
    }
    setPlayerValue("hwmTimersOptions", JSON.stringify(options));
}
function setHuntTimeout(restSeconds, rate = 1) {
    const options = JSON.parse(getPlayerValue("hwmTimersOptions"));
    restSeconds = restSeconds || ((getGameDate().getUTCHours() < 8 ? 20 : 40) * rate * 60 * options.customTimeRate * (getPlayerBool("IsDeer") ? 0.6 : 1) * options.abuBlessRate * options.huntLicenseRate);
    setPlayerValue("huntTimeoutEnd", getServerTime() + restSeconds * 1000);
}
function skipHunt() {
    setHuntTimeout(undefined, 0.5);
    const map_hunt_block_div = document.querySelector("div#map_hunt_block_div");
    if(map_hunt_block_div) {
        observe(map_hunt_block_div, toggleNativeHuntTimerPanel, true);
    }
}
function checkMercenary() {
    if(location.pathname == '/mercenary_guild.php') {
        const mercReputation = parseFloat(new RegExp(`${isEn ? "Reputation" : "Репутация"}: <b>([\\d\\.]+)`).exec(document.body.innerHTML)[1]);
        setPlayerValue("mercReputation", mercReputation);
        const options = JSON.parse(getPlayerValue("hwmTimersOptions"));
        const mercTimeout = (40 - mercReputation * 2) * options.customTimeRate * (getPlayerBool("IsDeer") ? 0.6 : 1) * options.abuBlessRate * 60000;
        let newMercTaskRestTimeExec;
        if(document.querySelector("a[href^='/mercenary_guild.php?action=accept']")) {
            deletePlayerValue("mercTimeoutEnd");
        } else if((newMercTaskRestTimeExec = texts.regexp_timegn0.exec(document.body.innerHTML)) || (newMercTaskRestTimeExec = texts.regexp_timegn1.exec(document.body.innerHTML)) || (newMercTaskRestTimeExec = texts.regexp_timegn2.exec(document.body.innerHTML)) || (newMercTaskRestTimeExec = texts.regexp_timegn3.exec(document.body.innerHTML)) || (newMercTaskRestTimeExec = texts.regexp_timegn4.exec(document.body.innerHTML)) || (newMercTaskRestTimeExec = texts.regexp_timegn5.exec(document.body.innerHTML))) {
            let restTimeout = Number(newMercTaskRestTimeExec[1]);
            if(texts.regexp_timegn0.exec(document.body.innerHTML) && (restTimeout == 19 || restTimeout == 13)) {
                restTimeout++;
            }
            setMercTimeout(null, restTimeout * 60000);
        }
    }
}
function setMercTimeout(battleResult = null, timeout = undefined) {
    console.log(`battleResult: ${battleResult}, timeout: ${timeout}`);
    let mercReputation = parseFloat(getPlayerValue("mercReputation", 0));
    if(battleResult == "win") {
        mercReputation = Math.min(mercReputation + 0.5, 10);
        setPlayerValue("mercReputation", mercReputation);
    }
    if(battleResult == "fail") {
        mercReputation = Math.max(mercReputation - 1, 0);
        setPlayerValue("mercReputation", mercReputation);
    }
    const options = JSON.parse(getPlayerValue("hwmTimersOptions"));
    timeout = timeout || (40 - mercReputation * 2) * options.customTimeRate * (getPlayerBool("IsDeer") ? 0.6 : 1) * options.abuBlessRate * 60000;
    const newTimeoutEnd = getServerTime() + timeout;
    if(Math.abs(parseInt(getPlayerValue("mercTimeoutEnd", 0)) - newTimeoutEnd) > 70000) {
        setPlayerValue("mercTimeoutEnd", newTimeoutEnd);
    }
}
function checkLeaders() {
    //deletePlayerValue("leaderTimeoutEnd");
    const leaderTasks = JSON.parse(getPlayerValue("leaderTasks", "[3, 3]"));
    if(location.pathname == '/leader_guild.php' || !getPlayerValue("leaderTimeoutEnd") && leaderTasks[0] < maxLeaderTasks) {
        checkLeadersCore(); // Если таймер остановился, а заданий меньше максимума, обновим информацию. Или мы на странице лидеров
    }
}
async function checkLeadersCore() {
    const doc = location.pathname == '/leader_guild.php' ? document : await getRequest('/leader_guild.php');
    
    const restTimeExec = /var Delta2 = (\d+);/.exec(doc.body.innerHTML); //var Delta2 = 6674;
    const restTime = restTimeExec ? (getServerTime() + parseInt(restTimeExec[1]) * 1000) : 0;
    if(restTime > 0) {
        refreshTimeout("leader", restTime);
    } else {
        deleteValue("leaderTimeoutEnd");
    }
    const taskContainer = Array.from(doc.querySelectorAll("div")).find(x => x.innerHTML.startsWith(isEn ? "Challenges available" : "Доступно заданий"));
    const tasksExec = new RegExp(`(\\d) ${isEn ? "of" : "из"} (\\d)`).exec(taskContainer.firstChild.textContent);
    //console.log(tasksExec)
    setPlayerValue("leaderTasks", JSON.stringify([parseInt(tasksExec[1]), parseInt(tasksExec[2])]));
    setPlayerValue("leaderGoalsNumber", Array.from(doc.querySelectorAll("form[name=f] > input[type=submit]")).length);

    timersPanelDataBind();
    //console.log(`leaderGoalsNumber: ${getPlayerValue("leaderGoalsNumber")}, leaderTasks: ${getPlayerValue("leaderTasks")}, TimeoutEnd: ${getPlayerValue("leaderTimeoutEnd")}`); // , ${new Date(parseInt(getPlayerValue("leaderTimeoutEnd"))).toLocaleString()}
}
function checkWatchers() {
    refreshTimeout("watcher", tomorrow().getTime());
    const todayWatchersResults = JSON.parse(getPlayerValue("TodayWatchersResults", `{ "requestTime": 0, "playerLevel": ${PlayerLevel}, "starsGained": 0, "starsLeft": ${maxWatchersStars} }`));
    //console.log(todayWatchersResults)
    if(location.pathname == '/task_guild.php' || todayWatchersResults.requestTime + 3600000 < getServerTime() && todayWatchersResults.starsLeft > 0 || todayWatchersResults.requestTime < today().getTime() || todayWatchersResults.playerLevel < PlayerLevel) {
        checkWatchersCore();
    }
}
async function checkWatchersCore() {
    const doc = location.pathname == '/task_guild.php' ? document : await getRequest('/task_guild.php');
    const starsGained = doc.querySelectorAll("img[src*='/i/zvezda.png']").length;
    const starsLeft = doc.querySelectorAll("img[src*='/i/zvezda_empty.png']").length;
    setPlayerValue("TodayWatchersResults", JSON.stringify({ requestTime: getServerTime(), playerLevel: PlayerLevel, starsGained: starsGained, starsLeft: starsLeft }));
    timersPanelDataBind();
    //console.log({ requestTime: getServerTime(), playerLevel: PlayerLevel, starsGained: starsGained, starsLeft: starsLeft })
}
function setLeaderTimeout(result) {
    const leaderGoalsNumber = parseInt(getPlayerValue("leaderGoalsNumber", 0));
    if(result == "win" || result == "fail" && leaderGoalsNumber == 1) {
        // Если победили или проиграли, когда на выбор оставалась одна цель. Тогда уменьшаем количество доступных заданий. А если их был максимум, и таймер стоял, то запустим таймер.
        const leaderTasks = JSON.parse(getPlayerValue("leaderTasks", "[3, 3]"));
        let tasksNumber = leaderTasks[0];
        const maxTasksNumber = leaderTasks[1];
        if(tasksNumber == maxTasksNumber) {
            setPlayerValue("leaderTimeoutEnd", getServerTime() + 3600000 * 3);
        }
        tasksNumber = Math.max(tasksNumber - 1, 0);
        setPlayerValue("leaderTasks", JSON.stringify([tasksNumber, maxTasksNumber]));
        setPlayerValue("leaderGoalsNumber", 3); // Также сбрасываем счетчик доступных целей
    }
}
function refreshTimeout(timer, newTime) {
    const savedTimeoutEnd = getPlayerValue(`${timer}TimeoutEnd`);
    if(!savedTimeoutEnd || Math.abs(newTime - parseInt(savedTimeoutEnd)) / 1000 / 60 > 2) {
        setPlayerValue(`${timer}TimeoutEnd`, newTime);
    }
    //console.log(new Date(parseInt(getPlayerValue(`${timer}TimeoutEnd`, 0))));
}
function checkRangerGuild() {
    if(location.pathname == '/ranger_guild.php') {
        if(document.querySelector("a[href^='ranger_guild.php?action=accept']")) {
            deletePlayerValue("thiefTimeoutEnd");
            updateOption("thiefOrRanger", true);
        }
        var time_gv = texts.regexp_timegre.exec(document.body.innerHTML);
        if(time_gv) {
            time_gv = Number(time_gv[1]) * 60000; // в миллисекундах
            const now = getServerTime();
            var time_gv_temp = time_gv - Math.abs(parseInt(getPlayerValue("thiefTimeoutEnd", 0)) - now);
            if(Math.abs(time_gv_temp) > 70000) {
                setPlayerValue("thiefTimeoutEnd", now + time_gv)
                updateOption("thiefOrRanger", true);
            }
        }
    }
    if(location.pathname == '/ranger_list.php') {
        var link_ranger_attack = document.querySelectorAll("a[href^='ranger_attack.php?join']");
        if(link_ranger_attack.length > 0) {
            deletePlayerValue("thiefTimeoutEnd");
            updateOption("thiefOrRanger", true);
            for(const link_ranger_attackItem of link_ranger_attack) {
                link_ranger_attackItem.addEventListener("click", function() { setPlayerValue("battleType", 'thief'); });
            }
        }
    }
}
function checkModWorkebench() {
    if(location.pathname == '/mod_workbench.php') {
        parseSmithPage(document);
    }
}
function parseSmithPage(doc) {
    let repairData;
    let enchantmentData;
    const bolds = [...doc.querySelectorAll("b")];
    const repairBold = bolds.find(x => x.innerText.includes(isEn ? "Under repair" : "В ремонте"));
    if(repairBold) {
        repairData = repairBold.innerText;
    }
    const enchantmentBold = bolds.find(x => x.innerText.includes(isEn ? "Complete in" : "В работе"));
    if(enchantmentBold) {
        enchantmentData = enchantmentBold.innerText;
    }
    if(repairData) {
        const repairEnd = parseTimeoutEnd(repairData, isEn ? {Hours: "h.", Minutes: "min."} : {Hours: "ч.", Minutes: "мин."}, 59);
        refreshTimeout("smith", repairEnd.getTime()); //console.log(`Окончание ремонта: ${repairEnd.toLocaleString()}`);
    } else {
        deletePlayerValue("smithTimeoutEnd");
    }
    if(enchantmentData) {
        const enchantmentEnd = parseTimeoutEnd(enchantmentData, isEn ? {Hours: "h.", Minutes: "min."} : {Hours: "ч.", Minutes: "мин."}, 59);
        refreshTimeout("enchantment", enchantmentEnd.getTime()); //console.log(`Окончание улучшения: ${enchantmentEnd.toLocaleString()}`);
    } else {
        deletePlayerValue("enchantmentTimeoutEnd");
    }
}
function parseTimeoutEnd(text, masks, defaultSeconds = 0) {
    const restTime = { Hours: 0, Minutes: 0, Seconds: defaultSeconds };
    for(const mask in masks) {
        const regex = new RegExp(`(\\d{1,2}) ${masks[mask]}`);
        const regexResult = regex.exec(text);
        if(regexResult) {
            restTime[mask] = parseInt(regexResult[1]);
        }
    }
    //console.log(text);
    //console.log(restTime);
    const timeEnd = new Date(getServerTime());
    timeEnd.setHours(timeEnd.getHours() + restTime.Hours, timeEnd.getMinutes() + restTime.Minutes, timeEnd.getSeconds() + restTime.Seconds);
    return timeEnd;
}
function checkThiefAmbush() {
    const thief_ambush_cancel = document.querySelector("a[href^='thief_ambush_cancel.php']");
    const form_thief_ambush = document.querySelector("form[action='thief_ambush.php']");
    if(thief_ambush_cancel || form_thief_ambush) {
        deletePlayerValue("thiefTimeoutEnd");
        updateOption("thiefOrRanger", false);
    }
    if(thief_ambush_cancel) {
        setPlayerValue("battleType", "thief"); // Сидим в засаде, будет воровской бой
    }
}
function checkRangerAmbush() {
    var form_ranger_attack = document.querySelector("form[action='ranger_attack.php']");
    if(form_ranger_attack) {
        deletePlayerValue("thiefTimeoutEnd");
        updateOption("thiefOrRanger", true);
        form_ranger_attack.querySelector("input[type='submit']").addEventListener("click", function() { setPlayerValue("battleType", 'thief'); });
        const options = JSON.parse(getPlayerValue("hwmTimersOptions"));
        if(options.joinRangerBattle) {
            setTimeout(function() { setPlayerValue("battleType", 'thief'); form_ranger_attack.submit(); }, 500);
        }
    }
}
function checkMapHunter() {
    const map_hunt_block_div = document.querySelector("div#map_hunt_block_div");
    if(map_hunt_block_div) {
        const nativeHuntTimer = map_hunt_block_div.querySelector("div#next_ht_new");
        if(nativeHuntTimer) {
            setHuntTimeout(win.MapHunterDelta);
        } else {
            deletePlayerValue("huntTimeoutEnd");
            const attackButtons = map_hunt_block_div.querySelectorAll(`div[hint='${isEn ? "Attack" : "Напасть"}'] > img`);
            for(const button of attackButtons) {
                //console.log(button)
                button.addEventListener("click", function() { setPlayerValue("battleType", "hunt"); });
            }
            const skipButtons = map_hunt_block_div.querySelectorAll(`div[hint^='${isEn ? "Pass" : "Пройти"}'] > img`);
            for(const button of skipButtons) {
                button.addEventListener("click", function() { skipHunt(); });
            }
            const callButtons = map_hunt_block_div.querySelectorAll(`div[hint^='${isEn ? "Ask" : "Позвать"}'] > img`);
            for(const button of callButtons) {
                button.addEventListener("click", function() { setTimeout(function() {
                    const askForms = Array.from(document.querySelectorAll("form[action='map.php']"));
                    askForms.forEach(x => x.querySelector("input[type='submit']").addEventListener("click", function() { setPlayerValue("battleType", "hunt"); })); }
                , 200); });
            }
        }
    }
    if(mooving && !getPlayerValue("huntTimeoutEnd")) {
        skipHunt();
    }
    toggleNativeHuntTimerPanel();
}
function toggleNativeHuntTimerPanel() {
    const next_ht_new = document.querySelector("div#next_ht_new");
    if(next_ht_new) {
        document.querySelector("div#map_hunt_block_div").style.display = getPlayerBool("HideNativeHuntTimer") ? "none" : "";
    }
}
function secondsFormat(secondsLeft, timeFormat = timeFormats.full) {
    if(!secondsLeft || secondsLeft < 0) {
        return timeFormat == timeFormats.secondsLastMinute ? "00" : "00:00";
    }
    const days = Math.floor(secondsLeft / 86400);
    const hours = Math.floor((secondsLeft - days * 86400) / 3600);
    const minutes = Math.floor((secondsLeft - days * 86400 - hours * 3600) / 60);
    const seconds = secondsLeft % 60;
    //console.log(`timeFormat: ${timeFormat}, days: ${days}, hours: ${hours}`)
    return (days === 0 ? '' : ((days < 10) ? '0' : '') + days + ':')
    + (days === 0 && hours === 0 ? '' : hours.toString().padStart(2, "0") + ':')
    + (timeFormat == timeFormats.secondsLastMinute && secondsLeft < 60 ? "" : minutes.toString().padStart(2, "0"))
    + ((timeFormat == timeFormats.secondsLastMinute && secondsLeft >= 60 || timeFormat == timeFormats.hoursOrSeconds && (days > 0 || hours > 0)) ? "" : (timeFormat == timeFormats.secondsLastMinute && secondsLeft < 60 ? "" : ':') + seconds.toString().padStart(2, "0"));
}
function getSecondsLeft(timerName) {
    //console.log(`${timerName}: ${getPlayerValue(`${timerName}TimeoutEnd`)}`)
    if(getPlayerValue(`${timerName}TimeoutEnd`)) {
        const result = Math.round((parseInt(getPlayerValue(`${timerName}TimeoutEnd`)) - getServerTime()) / 1000);
        if(result >= 0) {
            return result;
        }
    }
}
function tick() {
    timersDataBind();
    for(const timerName of timerNames) {
        const secondsLeft = getSecondsLeft(timerName);
        if(secondsLeft == 0) {
            deletePlayerValue(`${timerName}TimeoutEnd`);
            signal(timerName);
        } else if(!secondsLeft && getPlayerValue(`${timerName}TimeoutEnd`)) {
            deletePlayerValue(`${timerName}TimeoutEnd`);
        }
        if(timerName == "defence" && secondsLeft <= 60) {
            const timerPanel = document.getElementById(`defenceTimerPanel`);
            if(!timerPanel.classList.contains("alarm-text")) {
                timerPanel.classList.add("alarm-text");
                timerPanel.style.color = "#FF0000";
            }
        }
    }
    processPeriodicEvents();
    setTimeout(tick, 1000);
}
async function signal(timerName) {
    if(timerName == "merc") {
        if(location.pathname == "/mercenary_guild.php" && getPlayerBool("reloadMercPageAfterTimeElapsed")) {
            //console.log(`timerName: ${timerName}, location.pathname: ${location.pathname}, reloadMercPageAfterTimeElapsed: ${getPlayerBool("reloadMercPageAfterTimeElapsed")}`);
            window.location.href = window.location.href;            //location.reload();
        }
    }
    const options = JSON.parse(getPlayerValue("hwmTimersOptions"));
    if(!options[`${timerName}Notification`]) {
        return;
    }
    if(getServerTime() < parseInt(getPlayerValue(`${timerName}LastNotificationTime`, 0)) + 60000) {
        return;
    }
    setPlayerValue(`${timerName}LastNotificationTime`, getServerTime());
    switch(getPlayerValue("NotificationType", '0')) {
        case '0':
            toggleAudio(timersAudioMap[timerName]);
            break;
        case '1':
            alert(texts[`${timerName}Message`]);
            break;
        case '2':
            GM.notification(texts[`${timerName}Message`], "ГВД", `${resourcesPath}/i/fast_t/fast_1x1_t.png`, function() { window.focus(); });
            break;
    }
    if(timerName == 'health') {
        updateOption("healthNotification", false);
        timersPanelDataBind();
    }
    if(timerName == "leader") {
        const leaderTasks = JSON.parse(getPlayerValue("leaderTasks", "[3, 3]"));
        let tasksNumber = leaderTasks[0];
        const maxTasksNumber = leaderTasks[1];
        if(tasksNumber < maxTasksNumber) {
            tasksNumber++;
            setPlayerValue("leaderTasks", JSON.stringify([tasksNumber, maxTasksNumber]));
            timersPanelDataBind();
            if(tasksNumber < maxTasksNumber) {
                setPlayerValue(`${timerName}TimeoutEnd`, getServerTime() + 3600000 * 3);
            }
        }
    }
    if(timerName == "watcher") {
        deletePlayerValue("TodayWatchersResults");
    }
}
function settings() {
    const panelId = GM_info.script.name + "Settings";
    if(showPupupPanel(panelId)) {
        return;
    }
    const bgcinnerHTML = `
<tr>
    <td><b>${texts.isShowTimersTitle}:</b>&nbsp;&nbsp;${texts.workTimerPanelCaption}:<input id=isShowWorkTimerCheckbox type=checkbox>
&nbsp;&nbsp;${texts.smithTimerPanelCaption}:<input id=isShowSmithTimerCheckbox type=checkbox>
&nbsp;&nbsp;${texts.enchantmentTimerPanelCaption}:<input id=isShowEnchantmentTimerCheckbox type=checkbox>
&nbsp;&nbsp;${texts.mercTimerPanelCaption}:<input id=isShowMercTimerCheckbox type=checkbox>
&nbsp;&nbsp;${texts.huntTimerPanelCaption}:<input id=isShowHuntTimerCheckbox type=checkbox>
&nbsp;&nbsp;${texts.thiefTimerPanelCaption}:<input id=isShowThiefTimerCheckbox type=checkbox>
&nbsp;&nbsp;${texts.leaderTimerPanelCaption}:<input id=isShowLeaderTimerCheckbox type=checkbox>
&nbsp;&nbsp;${texts.watcherTimerPanelCaption}:<input id=isShowWatcherTimerCheckbox type=checkbox>
&nbsp;&nbsp;${texts.defenceTimerPanelCaption}:<input id=isShowDefenceTimerCheckbox type=checkbox>
    </td>
</tr>
<tr>
    <td><b>${isEn ? "Notify" : "Оповещать"}:</b>&nbsp;&nbsp;${isEn ? "Hl" : "Зд"}:<input id=healthNotificationCheckbox type=checkbox>
&nbsp;&nbsp;${texts.workTimerPanelCaption}:<input id=workNotificationCheckbox type=checkbox>
&nbsp;&nbsp;${texts.smithTimerPanelCaption}:<input id=smithNotificationCheckbox type=checkbox>
&nbsp;&nbsp;${texts.enchantmentTimerPanelCaption}:<input id=enchantmentNotificationCheckbox type=checkbox>
&nbsp;&nbsp;${texts.mercTimerPanelCaption}:<input id=mercNotificationCheckbox type=checkbox>
&nbsp;&nbsp;${texts.huntTimerPanelCaption}:<input id=huntNotificationCheckbox type=checkbox>
&nbsp;&nbsp;${texts.thiefTimerPanelCaption}:<input id=thiefNotificationCheckbox type=checkbox>
&nbsp;&nbsp;${texts.leaderTimerPanelCaption}:<input id=leaderNotificationCheckbox type=checkbox>
&nbsp;&nbsp;${texts.watcherTimerPanelCaption}:<input id=watcherNotificationCheckbox type=checkbox>
&nbsp;&nbsp;${texts.defenceTimerPanelCaption}:<input id=defenceNotificationCheckbox type=checkbox>
    </td>
</tr>
<tr>
    <td><b>${texts.joinRangerBattleText}:</b> <input id="joinRangerBattleCheckbox" type=checkbox></td>
</tr>
<tr>
    <td><b>${texts.hide}</b> "<i>${texts.nativeHuntTimerText} ..</i>": <input id=hideNativeHuntTimerCheckbox type=checkbox></td>
</tr>
<tr>
    <td><b>${texts.disableWorkaholicAlarmTitle}:</b> <input id=disableWorkaholicAlarmCheckbox type=checkbox></td>
</tr>
<tr>
    <td><b>${texts.showWorkaholicAlarmLastTwoEnrollsTitle}:<b> <input id=showWorkaholicAlarmLastTwoEnrollsCheckbox type=checkbox></td>
</tr>
<tr>
    <td><b>${isEn ? "View native timer" : "Отображать встроеный таймер"}:<b> <input id=viewNativeTimerCheckbox type=checkbox></td>
</tr>
<tr>
    <td><b>${isEn ? "Refresh Mercenary Guild Page When Timer Expires" : "Обновить страницу гильдии наёмников по истечению таймера"}:<b> <input id=reloadMercPageAfterTimeElapsedCheckbox type=checkbox></td>
</tr>
<tr>
    <td id="twmTimersSettingsAbuText"></td>
</tr>
<tr>
    <td id="deerText"></td>
</tr>
<tr>
    <td>${texts.huntLicenseAuto}</td>
</tr>
<tr>
    <td>${texts.cusomRateTitle} <input id="cusomRateInput" type="number" style="width: 50px;" maxlength="2" onfocus="this.select();"> <b>%</b></td>
</tr>
<tr>
    <td>${texts.setOnceThiefTimeout} <input id="onceThiefTimeoutInput" type="number" style="width: 50px;" maxlength="2" onfocus="this.select();"> <b>min</b>
    <input type="button" class="button-62" id="setOnceThiefTimerButton" value="ok"></td>
</tr>
<tr>
    <td> <input type="button" class="button-62" id="resetTimersButton" value="${texts.resetTimersTitle}">&nbsp;&nbsp;&nbsp;</td>
</tr>
<tr>
    <td>${texts.alarm_mode} <input type="radio" name="notificationTypeOption" id="notificationType0Option">${texts.alarm_mode_sound}
    <input type="radio" name="notificationTypeOption" id="notificationType1Option">${texts.alarm_mode_alert}
    <input type="radio" name="notificationTypeOption" id="notificationType2Option">${texts.alarm_mode_both}
    <input type="radio" name="notificationTypeOption" id="notificationType3Option">${texts.alarm_mode_none}
    </td>
</tr>
<tr>
    <td>
        <table>
            <tr>
                <td>${texts.signalSound + texts.healthTitle}</td>
                <td><input size=55 type="text" id="healthSoundInput"></td>
                <td><input size=55 type="button" class="button-62" id="healthSoundInputPlay"></td>
            </tr>
            <tr>
                <td>${texts.signalSound + texts.workTimerPanelCaption}</td>
                <td><input size=55 type="text" id="workSoundInput"></td>
                <td><input size=55 type="button" class="button-62" id="workSoundInputPlay"></td>
            </tr>
            <tr>
                <td>${texts.signalSound + texts.smithTimerPanelCaption}</td>
                <td><input size=55 type="text" id="smithSoundInput"></td>
                <td><input size=55 type="button" class="button-62" id="smithSoundInputPlay"></td>
            </tr>
            <tr>
                <td>${texts.signalSound + texts.enchantmentTimerPanelCaption}</td>
                <td><input size=55 type="text" id="enchantmentSoundInput"></td>
                <td><input size=55 type="button" class="button-62" id="enchantmentSoundInputPlay"></td>
            </tr>
            <tr>
                <td>${texts.signalSound + texts.warlikeTitle}</td>
                <td><input size=55 type="text" id="warlikeSoundInput"></td>
                <td><input size=55 type="button" class="button-62" id="warlikeSoundInputPlay"></td>
            </tr>
            <tr>
                <td>${texts.signalSound + texts.leaderTitle}</td>
                <td><input size=55 type="text" id="leaderSoundInput"></td>
                <td><input size=55 type="button" class="button-62" id="leaderSoundInputPlay"></td>
            </tr>
            <tr>
                <td>${texts.signalSound + texts.watcherTitle}</td>
                <td><input size=55 type="text" id="watcherSoundInput"></td>
                <td><input size=55 type="button" class="button-62" id="watcherSoundInputPlay"></td>
            </tr>
            <tr>
                <td>${texts.signalSound + texts.defenceTitle}</td>
                <td><input size=55 type="text" id="defenceSoundInput"></td>
                <td><input size=55 type="button" class="button-62" id="defenceSoundInputPlay"></td>
            </tr>
        </table>
    </td>
</tr>
<tr>
    <td style="font-size: 12px; font-weight: bold; text-align: left;">
        ${isEn ? "Battle notification" : "Оповещение о битве"}: <label for=battleSoundNotificationCheckbox>${isEn ? "sound" : "звуковое"}</label><input id=battleSoundNotificationCheckbox type=checkbox> <label for=battleNotificationCheckbox>${isEn ? "win" : "вин"}</label><input id=battleNotificationCheckbox type=checkbox>
    </td>
</tr>
<tr>
    <td style="font-size: 14px; font-weight: bold; text-align: center;">
        ${isEn ? "Periodical notifications" : "Периодические оповещения"} <input type=button class="button-62" id=addPeriodicEventButton value="${isEn ? "Add" : "Добавить"}" />
    </td>
</tr>
<tr>
    <td>
        <table id=periodicEventsTable></table>
    </td>
</tr>
`;
    const optionsContainer = addElement("table", { innerHTML: bgcinnerHTML, style: "width: 100%;" });

    optionsContainer.querySelector("#resetTimersButton").addEventListener("click", resetTimers);
    optionsContainer.querySelector("#setOnceThiefTimerButton").addEventListener("click", function() { if(Number(document.getElementById("onceThiefTimeoutInput").value) >= 0) { setPlayerValue("thiefTimeoutEnd", getServerTime() + document.getElementById("onceThiefTimeoutInput").value * 60000); } });
    optionsContainer.querySelector("#cusomRateInput").addEventListener("change", function() { updateOption("customTimeRate", (100 - this.value) / 100); settingsDataBind(); });
    optionsContainer.querySelector("#joinRangerBattleCheckbox").addEventListener("click", function() { updateOption("joinRangerBattle", this.checked); });
    optionsContainer.querySelector("#hideNativeHuntTimerCheckbox").addEventListener("click", function() { setPlayerValue("HideNativeHuntTimer", this.checked); toggleNativeHuntTimerPanel(); }, false);
    optionsContainer.querySelector("#showWorkaholicAlarmLastTwoEnrollsCheckbox").addEventListener("click", function() { updateOption("showWorkaholicAlarmLastTwoEnrolls", this.checked); });
    optionsContainer.querySelector("#viewNativeTimerCheckbox").addEventListener("click", function() { setPlayerValue("viewNativeTimer", this.checked); });
    optionsContainer.querySelector("#reloadMercPageAfterTimeElapsedCheckbox").addEventListener("click", function() { setPlayerValue("reloadMercPageAfterTimeElapsed", this.checked); });
    
    optionsContainer.querySelector("#disableWorkaholicAlarmCheckbox").addEventListener("click", function() { updateOption("disableWorkaholicAlarm", this.checked); });

    optionsContainer.querySelector("#isShowWorkTimerCheckbox").addEventListener("click", function() { updateOption("isShowWorkTimer", this.checked); timersPanelDataBind(); });
    optionsContainer.querySelector("#isShowSmithTimerCheckbox").addEventListener("click", function() { updateOption("isShowSmithTimer", this.checked); timersPanelDataBind(); });
    optionsContainer.querySelector("#isShowEnchantmentTimerCheckbox").addEventListener("click", function() { updateOption("isShowEnchantmentTimer", this.checked); timersPanelDataBind(); });
    
    optionsContainer.querySelector("#isShowMercTimerCheckbox").addEventListener("click", function() { updateOption("isShowMercTimer", this.checked); timersPanelDataBind(); });
    optionsContainer.querySelector("#isShowHuntTimerCheckbox").addEventListener("click", function() { updateOption("isShowHuntTimer", this.checked); timersPanelDataBind(); });
    optionsContainer.querySelector("#isShowThiefTimerCheckbox").addEventListener("click", function() { updateOption("isShowThiefTimer", this.checked); timersPanelDataBind(); });
    optionsContainer.querySelector("#isShowLeaderTimerCheckbox").addEventListener("click", function() { updateOption("isShowLeaderTimer", this.checked); timersPanelDataBind(); });
    optionsContainer.querySelector("#isShowWatcherTimerCheckbox").addEventListener("click", function() { updateOption("isShowWatcherTimer", this.checked); timersPanelDataBind(); });
    optionsContainer.querySelector("#isShowDefenceTimerCheckbox").addEventListener("click", function() { updateOption("isShowDefenceTimer", this.checked); timersPanelDataBind(); });
    
    optionsContainer.querySelector("#battleSoundNotificationCheckbox").checked = getPlayerBool("enableBattleSoundNotification");
    optionsContainer.querySelector("#battleNotificationCheckbox").checked = getPlayerBool("enableBattleNotification");
    optionsContainer.querySelector("#battleSoundNotificationCheckbox").addEventListener("change", function() { setPlayerValue("enableBattleSoundNotification", this.checked); });
    optionsContainer.querySelector("#battleNotificationCheckbox").addEventListener("change", function() { setPlayerValue("enableBattleNotification", this.checked); });
 
    optionsContainer.querySelector("#healthNotificationCheckbox").addEventListener("click", function() { updateOption("healthNotification", this.checked); });
    optionsContainer.querySelector("#workNotificationCheckbox").addEventListener("click", function() { updateOption("workNotification", this.checked); });
    optionsContainer.querySelector("#smithNotificationCheckbox").addEventListener("click", function() { updateOption("smithNotification", this.checked); });
    optionsContainer.querySelector("#enchantmentNotificationCheckbox").addEventListener("click", function() { updateOption("enchantmentNotification", this.checked); });
    optionsContainer.querySelector("#mercNotificationCheckbox").addEventListener("click", function() { updateOption("mercNotification", this.checked); });
    optionsContainer.querySelector("#huntNotificationCheckbox").addEventListener("click", function() { updateOption("huntNotification", this.checked); });
    optionsContainer.querySelector("#thiefNotificationCheckbox").addEventListener("click", function() { updateOption("thiefNotification", this.checked); });
    optionsContainer.querySelector("#leaderNotificationCheckbox").addEventListener("click", function() { updateOption("leaderNotification", this.checked); });
    optionsContainer.querySelector("#watcherNotificationCheckbox").addEventListener("click", function() { updateOption("watcherNotification", this.checked); });
    optionsContainer.querySelector("#defenceNotificationCheckbox").addEventListener("click", function() { updateOption("defenceNotification", this.checked); });

    optionsContainer.querySelector("#workSoundInput").addEventListener("change", function() { updateOption("workSound", this.value.trim()); });
    optionsContainer.querySelector("#warlikeSoundInput").addEventListener("change", function() { updateOption("warlikeSound", this.value.trim()); });
    optionsContainer.querySelector("#leaderSoundInput").addEventListener("change", function() { updateOption("leaderSound", this.value.trim()); });
    optionsContainer.querySelector("#watcherSoundInput").addEventListener("change", function() { updateOption("watcherSound", this.value.trim()); });
    optionsContainer.querySelector("#defenceSoundInput").addEventListener("change", function() { updateOption("defenceSound", this.value.trim()); });
    optionsContainer.querySelector("#smithSoundInput").addEventListener("change", function() { updateOption("smithSound", this.value.trim()); });
    optionsContainer.querySelector("#enchantmentSoundInput").addEventListener("change", function() { updateOption("enchantmentSound", this.value.trim()); });
    optionsContainer.querySelector("#healthSoundInput").addEventListener("change", function() { updateOption("healthSound", this.value.trim()); });

    optionsContainer.querySelector("#healthSoundInputPlay").addEventListener("click", buttonToggleAudio);
    optionsContainer.querySelector("#workSoundInputPlay").addEventListener("click", buttonToggleAudio);
    optionsContainer.querySelector("#smithSoundInputPlay").addEventListener("click", buttonToggleAudio);
    optionsContainer.querySelector("#enchantmentSoundInputPlay").addEventListener("click", buttonToggleAudio);
    optionsContainer.querySelector("#warlikeSoundInputPlay").addEventListener("click", buttonToggleAudio);
    optionsContainer.querySelector("#leaderSoundInputPlay").addEventListener("click", buttonToggleAudio);
    optionsContainer.querySelector("#watcherSoundInputPlay").addEventListener("click", buttonToggleAudio);
    optionsContainer.querySelector("#defenceSoundInputPlay").addEventListener("click", buttonToggleAudio);

    optionsContainer.querySelector("#notificationType0Option").addEventListener("click", function() { if(this.checked) { setPlayerValue("NotificationType", "0"); } });
    optionsContainer.querySelector("#notificationType1Option").addEventListener("click", function() { if(this.checked) { setPlayerValue("NotificationType", "1"); } });
    optionsContainer.querySelector("#notificationType2Option").addEventListener("click", function() { if(this.checked) { setPlayerValue("NotificationType", "2"); } });
    optionsContainer.querySelector("#notificationType3Option").addEventListener("click", function() { if(this.checked) { setPlayerValue("NotificationType", "3"); } });
    optionsContainer.querySelector(`#notificationType${getPlayerValue("NotificationType", 0)}Option`).checked = true;

    createPupupPanel(panelId, getScriptReferenceHtml() + " " + getSendErrorMailReferenceHtml(), [[optionsContainer]]);

    settingsDataBind();
    
    optionsContainer.querySelector("#addPeriodicEventButton").addEventListener("click", function() { addPeriodicEvents(); periodicEventsTableDataBind(); });
    
}
function settingsDataBind() {
    const options = JSON.parse(getPlayerValue("hwmTimersOptions"));
    document.getElementById("isShowWorkTimerCheckbox").checked = options.isShowWorkTimer;
    document.getElementById("isShowEnchantmentTimerCheckbox").checked = options.isShowEnchantmentTimer;
    document.getElementById("isShowSmithTimerCheckbox").checked = options.isShowSmithTimer;
    document.getElementById("isShowMercTimerCheckbox").checked = options.isShowMercTimer;
    document.getElementById("isShowHuntTimerCheckbox").checked = options.isShowHuntTimer;
    document.getElementById("isShowThiefTimerCheckbox").checked = options.isShowThiefTimer;
    document.getElementById("isShowLeaderTimerCheckbox").checked = options.isShowLeaderTimer;
    document.getElementById("isShowWatcherTimerCheckbox").checked = options.isShowWatcherTimer;
    document.getElementById("isShowDefenceTimerCheckbox").checked = options.isShowDefenceTimer;

    document.getElementById("healthNotificationCheckbox").checked = options.healthNotification;
    document.getElementById("workNotificationCheckbox").checked = options.workNotification;
    document.getElementById("enchantmentNotificationCheckbox").checked = options.enchantmentNotification;
    document.getElementById("smithNotificationCheckbox").checked = options.smithNotification;
    document.getElementById("mercNotificationCheckbox").checked = options.mercNotification;
    document.getElementById("huntNotificationCheckbox").checked = options.huntNotification;
    document.getElementById("thiefNotificationCheckbox").checked = options.thiefNotification;
    document.getElementById("leaderNotificationCheckbox").checked = options.leaderNotification;
    document.getElementById("watcherNotificationCheckbox").checked = options.watcherNotification;
    document.getElementById("defenceNotificationCheckbox").checked = options.defenceNotification;

    document.getElementById("joinRangerBattleCheckbox").checked = options.joinRangerBattle;
    document.getElementById("hideNativeHuntTimerCheckbox").checked = getPlayerBool("HideNativeHuntTimer");
    document.getElementById("disableWorkaholicAlarmCheckbox").checked = options.disableWorkaholicAlarm;
    document.getElementById("showWorkaholicAlarmLastTwoEnrollsCheckbox").checked = options.showWorkaholicAlarmLastTwoEnrolls;
    document.getElementById("viewNativeTimerCheckbox").checked = getPlayerBool("viewNativeTimer");
    document.getElementById("reloadMercPageAfterTimeElapsedCheckbox").checked = getPlayerBool("reloadMercPageAfterTimeElapsed");

    document.getElementById("deerText").innerHTML = getPlayerBool("IsDeer") ? `${isEn ? `Deer Yasha. HG, MG, TG, RG tasks 40% more often` : `Олень Яша. Задания ГО, ГН, ГВ, ГРж на 40% чаще`}` : "";
    document.getElementById("twmTimersSettingsAbuText").innerHTML = options.abuBlessInfo;

    document.getElementById("cusomRateInput").value = 100 - options.customTimeRate * 100;
    document.getElementById("onceThiefTimeoutInput").value = 60 * options.customTimeRate * options.abuBlessRate;

    for(const audioScenario of audioScenaries) {
        document.getElementById(`${audioScenario}SoundInput`).value = options[`${audioScenario}Sound`];
        const audioPlayed = playingAudios.hasOwnProperty(audioScenario);
        document.getElementById(`${audioScenario}SoundInputPlay`).value = audioPlayed ? "Stop" : "Play";
        if(audioPlayed) {
            playingAudios[audioScenario].addEventListener("ended", () => { document.getElementById(`${audioScenario}SoundInputPlay`).value = "Play"; }, true);
        }
    }
    periodicEventsTableDataBind();
}
function initAudio(soundUrl, onEnded) {
    let audio = defaultAudio;
    if(soundUrl) {
        audio = new Audio();
        audio.src = soundUrl;
        audio.preload = 'auto';
    }
    if(onEnded) {
        audio.addEventListener("ended", onEnded, true);
    }
    return audio;
}
function buttonToggleAudio(event) { toggleAudio(event.target.id.replace("SoundInputPlay", "")); }
async function toggleAudio(audioScenarioName) {
    const playButton = document.getElementById(`${audioScenarioName}SoundInputPlay`);
    const isPlaying = playingAudios.hasOwnProperty(audioScenarioName);
    if(isPlaying) {
        playingAudios[audioScenarioName].pause();
        delete playingAudios[audioScenarioName];
    } else {
        const options = JSON.parse(getPlayerValue("hwmTimersOptions"));
        const audio = initAudio(options[`${audioScenarioName}Sound`], () => { if(playButton) playButton.value = "Play"; delete playingAudios[audioScenarioName]; });
        playingAudios[audioScenarioName] = audio;
        audio.play();
    }
    if(playButton) {
        playButton.value = isPlaying ? "Play" : "Stop";
    }
}
function updateOption(key, val) {
    const options = JSON.parse(getPlayerValue("hwmTimersOptions"));
    if(typeof val == "function") {
        options[key] = val(options);
    } else {
        options[key] = val;
    }
    setPlayerValue("hwmTimersOptions", JSON.stringify(options));
}
function resetTimers() {
    deletePlayerValue("workTimeoutEnd");
    deletePlayerValue("smithTimeoutEnd");
    deletePlayerValue("enchantmentTimeoutEnd");
    deletePlayerValue("mercTimeoutEnd");
    deletePlayerValue("huntTimeoutEnd");
    deletePlayerValue("thiefTimeoutEnd");
    deletePlayerValue("leaderTimeoutEnd");
}
async function checkDefences() {
    const defenceWaiting = (isNewInterface ? document.querySelector("div#MenuBattles_expandable > a[href='mapwars.php'] > div.sh_dd_container_orange") : document.querySelector("li > a[href='mapwars.php'] > font[color='#ff9c00']")) ? true : false;
    const defenceTimeoutEnd = getPlayerValue("defenceTimeoutEnd");
    //console.log(`defenceWaiting: ${defenceWaiting}, defenceTimeoutEnd: ${(new Date(parseInt(defenceTimeoutEnd || 0))).toLocaleString()} ${defenceTimeoutEnd}`);
    if(defenceWaiting && !defenceTimeoutEnd) {
        const defenceTime = await findDefences();
        setPlayerValue("defenceTimeoutEnd", defenceTime);
        timersPanelDataBind();
        //console.log(`defenceTime: ${defenceTime}, ${new Date(defenceTime).toLocaleString()}`);
    }
    if(!defenceWaiting && defenceTimeoutEnd) {
        deletePlayerValue("defenceTimeoutEnd");
    }
}
async function findDefences() {
    const doc = location.pathname == "/mapwars.php" ? document : await getRequest("/mapwars.php");
    const defenceTable = doc.querySelector("body > center > table:nth-child(2) * table * table.wbwhite");
    if(defenceTable) {
        for(const row of defenceTable.rows) {
            const enlistingRegExp = new RegExp(`${isEn ? "Enlisting in defense possible at" : "вступление на защиту с"} (\\d{1,2}:\\d{1,2})`);
            const defenceEndExec = enlistingRegExp.exec(row.cells[2].innerHTML);
            if(defenceEndExec) {
                return parseDate(defenceEndExec[1], true).getTime();
            }
        }
    }
}
function getPeriodicEvents() {
    const periodicEvents = JSON.parse(getPlayerValue("periodicEvents", "[]"));
    if(periodicEvents.length == 0) {
        periodicEvents.push({ id: 1, text: isEn ? "Duels C`sg" : "Дуэли ГТ", start: 29, period: 30, notify: 2, notificationImage: duelsPng, soundUrl: "http://commondatastorage.googleapis.com/codeskulptor-assets/week7-brrring.m4a" });
        periodicEvents.push({ id: 2, text: isEn ? "Group battles C`sg" : "Групповые бои ГТ", start: 0, period: 30, notify: 2, notificationImage: groupsPng, soundUrl: "http://commondatastorage.googleapis.com/codeskulptor-assets/week7-brrring.m4a" });
        periodicEvents.push({ id: 3, text: isEn ? "Roulette spin" : "Вращение рулетки", start: 0, period: 5, notify: 2, notificationImage: roulettePng, soundUrl: "http://commondatastorage.googleapis.com/codeskulptor-assets/week7-brrring.m4a" });
        periodicEvents.push({ id: 4, text: isEn ? "MT" : "МТ", start: 10, period: 30, notify: 2, notificationImage: turnir_icoPng, soundUrl: "http://commondatastorage.googleapis.com/codeskulptor-assets/week7-brrring.m4a" });
        setPlayerValue("periodicEvents", JSON.stringify(periodicEvents));
    }
    return periodicEvents;
}
function periodicEventsTableDataBind() {
    const table = document.querySelector("#periodicEventsTable");
    table.innerHTML = "";
    const headers = [{ name: "text", title: isEn ? "Notification text" : "Текст сообщения" },
    { name: "start", title: isEn ? "Count begin (min.)" : "Начало отсчёта (мин.)" },
    { name: "period", title: isEn ? "Period (min.)" : "Период (мин.)" },
    { name: "notify", title: isEn ? "Notification time (min. before event)" : "Время оповещения (мин. до события)" },
    { name: "notificationImage", title: isEn ? "Notification image" : "Значок сообщения" },
    { name: "soundUrl", title: isEn ? "Sound URL" : "URL звука" },
    { name: "isWinNotification", title: isEn ? "Notification<br>snd / win" : "Оповещение<br>зв. / вин." },
    { name: "delete", title: isEn ? "Del." : "Уд." }
    ];

    const row = addElement("tr", {}, table);
    for(const header of headers) {
        const cell = addElement("th", { innerHTML: header.title, style: "font-weight: bold; font-size: 14px; text-align: center;" }, row);
    }
    const periodicEvents = getPeriodicEvents();
    for(const periodicEvent of periodicEvents) {
        const row = addElement("tr", { periodicEventId: periodicEvent.id }, table);
        row.innerHTML = `
<td style="text-align: center;">
    <input name="text" type="text" value="${periodicEvent.text || ""}" style="width: 150px;" />
</td>
<td style="text-align: center;">
    <input name="start" type="number" value="${periodicEvent.start}" style="width: 50px;" />
</td>
<td style="text-align: center;">
    <input name="period" type="number" value="${periodicEvent.period}" style="width: 50px;" />
</td>
<td style="text-align: center;">
    <input name="notify" type="number" value="${periodicEvent.notify}" style="width: 50px;" />
</td>
<td style="text-align: center;">
    <input name="notificationImage" type="text" value="${periodicEvent.notificationImage || ""}" style="width: 150px;" />
</td>
<td style="text-align: center;">
    <input name="soundUrl" type="text" value="${periodicEvent.soundUrl || ""}" style="width: 150px;" />
</td>
<td style="text-align: center;">
    <input type=checkbox name="isSoundNotification" ${periodicEvent.isSoundNotification ? "checked" : ""} />
    <input type=checkbox name="isWinNotification" ${periodicEvent.isWinNotification ? "checked" : ""} />
</td>
<td style="text-align: center;">
    <span name="deleteSpan" class="button-62">&times;</span>
</td>
`;
        [...row.querySelectorAll("input")].forEach(x => x.addEventListener("change", function(e) { changePeriodicEvents(periodicEvent.id, this.name, this.type == "checkbox" ? this.checked : (this.type == "number" ? Number(this.value) :  this.value)); }));
        row.querySelector("span[name=deleteSpan]").addEventListener("click", function() { deletePeriodicEvents(periodicEvent.id); periodicEventsTableDataBind(); });
    }
}
function changePeriodicEvents(periodicEventId, fieldName, value) {
    const periodicEvents = JSON.parse(getPlayerValue("periodicEvents", "[]"));
    const periodicEvent = periodicEvents.find(x => x.id == periodicEventId);
    periodicEvent[fieldName] = value;
    setPlayerValue("periodicEvents", JSON.stringify(periodicEvents));
    //console.log(periodicEvent);
}
function addPeriodicEvents() {
    const periodicEvents = JSON.parse(getPlayerValue("periodicEvents", "[]"));
    periodicEvents.push({ id: Date.now(), start: 0, period: 0, notify: 0 });
    setPlayerValue("periodicEvents", JSON.stringify(periodicEvents));
}
function deletePeriodicEvents(id) {
    const periodicEvents = JSON.parse(getPlayerValue("periodicEvents", "[]"));
    const periodicEventIndex = periodicEvents.findIndex(x => x.id == id);
    periodicEvents.splice(periodicEventIndex, 1);
    setPlayerValue("periodicEvents", JSON.stringify(periodicEvents));
}
function processPeriodicEvents() {
    //console.log(periodicEvents);
    const serverTime = getServerTime();
    const serverDate = new Date(serverTime);
    serverDate.setSeconds(0, 0);
    const minutes = serverDate.getMinutes();
    const currentNotifications = [];
    for(const periodicEvent of periodicEvents) {
        const nearestEvent = periodicEvent.eventsArray.find(x => x >= minutes);
        if(nearestEvent == minutes) {
            const lastNotificationDate = new Date(parseInt(getPlayerValue(`periodicEventLastNotificationTime${periodicEvent.id}`, 0)));
            //console.log(`lastNotificationTime: ${getPlayerValue(`periodicEventLastNotificationTime${periodicEvent.id}`)}, lastNotificationDate: ${lastNotificationDate.toLocaleString()}, serverDate: ${serverDate.toLocaleString()}, ${!isValidDate(lastNotificationDate) || lastNotificationDate < serverDate}`);
            if(!isValidDate(lastNotificationDate) || lastNotificationDate < serverDate) {
                setPlayerValue(`periodicEventLastNotificationTime${periodicEvent.id}`, serverDate.getTime());
                currentNotifications.push(periodicEvent);
            }
        }
    }
    if(currentNotifications.length > 0) {
        const evenText = currentNotifications.filter(x => x.isWinNotification).map(x => isEn ? `${x.text} in ${x.notify} min.` : `${x.text} через ${x.notify} мин.`).join("\r\n");
        const notificationImage = currentNotifications.find(x => x.isWinNotification && x.notificationImage)?.notificationImage || `${resourcesPath}/i/fast_t/fast_1x1_t.png`;
        if(evenText) {
            GM.notification(evenText, "ГВД", notificationImage, function() { window.focus(); });
        }
        const soundUrl = currentNotifications.find(x => x.isSoundNotification && x.soundUrl)?.soundUrl || "";
        if(soundUrl) {
            new Audio(soundUrl).play();
        }
    }
}
function getPositiveModule(value, module) {
    let result = value % module;
    if(result < 0) {
        result += module;
    }
    return result;
}
// Returns int array between 0 and 59 minutes
function getEventsArray(periodicEvent) {
    const period = Number(periodicEvent.period);
    if(isNaN(period) || period <= 0) {
        return [];
    }
    const result = [];
    const eventsAmount = 60 / period;
    //console.log(`eventsAmount: ${eventsAmount}`);
    for(let i = 0; i < eventsAmount; i++) {
        result.push(getPositiveModule(Number(periodicEvent.start) - Number(periodicEvent.notify) + period * i, 60));
    }
    result.sort(function(a, b) { return a - b; });
    //console.log(periodicEvent);
    //console.log(result);
    return result;
}
function isValidDate(d) { return d instanceof Date && !isNaN(d); }
// HWM API
async function checkAmbushResult(force = false) {
    if(location.pathname == '/pl_warlog.php') {
        const page = getUrlParamValue(location.href, "page");
        const id = getUrlParamValue(location.href, "id");
        if(id == PlayerId && (!page || page == 0)) {
            var doc = document;
        }
    }
    if(doc || force) {
        doc = doc || await getRequest(`/pl_warlog.php?id=${PlayerId}`);
        processWarlog(doc);
    }
}
function processWarlog(doc) {
    const lastAmbushRef = Array.from(doc.querySelectorAll("a[href*='warlog.php?warid=']")).find(x => {
        if(x.nextSibling.textContent == ": • " || x.nextSibling.nextSibling.textContent == ": • ") {
            return true;
        }
        const rowElements = getSequentialsUntil(x, "br");
        //console.log(rowElements);
        const ranger = rowElements.find(y => y.textContent.includes(isEn ? "Ranger" : "Рейнджер"));
        //console.log(`ranger: ${ranger}`);
        return ranger ? true : false;
    });
    let lastAmbushResult = BattleResult.NotFound;
    if(lastAmbushRef) {
        let currentElement = lastAmbushRef;
        lastAmbushResult = BattleResult.Fail;
        while(currentElement && currentElement.tagName.toLowerCase() != "br") {
            //console.log(currentElement);
            if(currentElement.tagName.toLowerCase() == "b" && currentElement.innerHTML.includes(getPlayerValue("UserName"))) {
                lastAmbushResult = BattleResult.Win;
                break;
            }
            currentElement = nextSequentialElement(currentElement);
        }
        var lastAmbushTime = parseDate(lastAmbushRef.innerText, false, true).getTime();
        var newAmbushSuspendExpireDate = calcThiefTimeoutEnd(lastAmbushTime) + 60000;
    }
    // Если есть неустаревшее поражение
    if(lastAmbushResult == BattleResult.Fail && newAmbushSuspendExpireDate > getServerTime()) {
        //console.log(`lastAmbushResult: ${lastAmbushResult}, lastAmbushTime: ${lastAmbushTime}, thiefTimeoutEnd: ${new Date(parseInt(getPlayerValue("thiefTimeoutEnd"))).toLocaleString()}, newAmbushSuspendExpireDate: ${new Date(newAmbushSuspendExpireDate).toLocaleString()}`);
        // Если нет старого значения AmbushSuspendExpireDate или расхождение с новым из лога больше минуты, то установим новое
        if(!getPlayerValue("thiefTimeoutEnd") || Math.abs(parseInt(getPlayerValue("thiefTimeoutEnd")) - newAmbushSuspendExpireDate) > 60 * 1000) {
            setPlayerValue("thiefTimeoutEnd", newAmbushSuspendExpireDate);
        }
    } else {
        deletePlayerValue("thiefTimeoutEnd");
    }
}
// API
function getUrlParamValue(url, paramName) { return (new URLSearchParams(url.split("?")[1])).get(paramName); }
function addStyle(css) { addElement("style", { type: "text/css", innerHTML: css }, document.head); }
function getParent(element, parentType, number = 1) {
    if(!element) {
        return;
    }
    let result = element;
    let foundNumber = 0;
    while(result = result.parentNode) {
        if(result.nodeName.toLowerCase() == parentType.toLowerCase()) {
            foundNumber++;
            if(foundNumber == number) {
                return result;
            }
        }
    }
}
function getServerTime() { return Date.now() - parseInt(getValue("ClientServerTimeDifference", 0)); }
function getGameDate() { return new Date(getServerTime() + 10800000); } // Игра в интерфейсе всегда показывает московское время // Это та дата, которая в toUTCString покажет время по москве
function today() { const now = new Date(getServerTime()); now.setHours(0, 0, 0, 0); return now; }
function tomorrow() { const today1 = today(); today1.setDate(today1.getDate() + 1); return today1; }
async function requestServerTime() {
    if(parseInt(getValue("LastClientServerTimeDifferenceRequestDate", 0)) + 60 * 60 * 1000 < Date.now()) {
        setValue("LastClientServerTimeDifferenceRequestDate", Date.now());
        const responseText = await getRequestText("/time.php");
        const responseParcing = /now (\d+)/.exec(responseText); //responseText: now 1681711364 17-04-23 09:02
        if(responseParcing) {
            setValue("ClientServerTimeDifference", Date.now() - parseInt(responseParcing[1]) * 1000);
        }
    } else {
        setTimeout(requestServerTime, 60 * 60 * 1000);
    }
}
function observe(target, handler, once = false) {
    const config = { childList: true, subtree: true };
    const ob = new MutationObserver(async function(mut, observer) {
        observer.disconnect();
        let handled = false;
        if(handler.constructor.name === 'AsyncFunction') {
            handled = await handler();
        } else {
            handled = handler();
        }
        if(!once && !handled) {
            observer.observe(target, config);
        }
    });
    ob.observe(target, config);
}
function healthTimer() {
    if(isHeartOnPage) {
        const health_amount = document.getElementById("health_amount");
        const heart_js_mobile_click = document.getElementById("heart_js_mobile_click");
        let heart; // 78 %
        let maxHeart; // 100 %
        let timeHeart; // 405 сек.
        
        if(heart_js_mobile_click) {
            //var hwm_heart=19;var hwm_max_heart=100;var hwm_time_heart=360;
            heart = win.hwm_heart;
            maxHeart = win.hwm_max_heart;
            timeHeart = win.hwm_time_heart;
        } else if(health_amount) {
            const res = /top_line_draw_canvas_heart\((\d+), (\d+), ([\d\.]+)\);/.exec(document.body.innerHTML); // top_line_draw_canvas_heart(0, 100, 405.5);
            if(res) {
                heart = parseInt(res[1]);
                maxHeart = parseInt(res[2]);
                timeHeart = parseFloat(res[3]);
            }
        } else {
            heart = win.heart;
            maxHeart = win.max_heart;
            timeHeart = win.time_heart;
        }
        //console.log(`healthTimer heart: ${heart}, maxHeart: ${maxHeart}, timeHeart: ${timeHeart}`);
        let restSeconds = timeHeart * (maxHeart - heart) / maxHeart;
        if(restSeconds > 0) {
            setPlayerValue("healthTimeoutEnd", getServerTime() + restSeconds * 1000);
        } else {
            deletePlayerValue("healthTimeoutEnd");
        }
        return [heart, maxHeart, timeHeart];
    }
}
function manaTimer() {
    if(isHeartOnPage) {
        const mana_amount = document.getElementById("mana_amount");
        // var mana=15;
        // var max_mana=40;
        // var time_mana=900;
        let mana = 10; // 15
        let maxMana = 10; // 40
        let timeMana = 900; // 900 сек.
        if(mana_amount) {
            // const res = /top_line_draw_canvas_heart\((\d+), (\d+), (\d+)\);/.exec(document.body.innerHTML); // top_line_draw_canvas_heart(0, 100, 405);
            // if(res) {
                // mana = parseInt(res[1]);
                // maxMana = parseInt(res[2]);
                // timeMana = parseInt(res[3]);
            // }
        } else {
            mana = win.mana;
            maxMana = win.max_mana;
            timeMana = win.time_mana;
        }
        //console.log(`manaTimer mana: ${mana}, maxMana: ${maxMana}, timeMana: ${timeMana}`);
        let restSeconds = timeMana * (maxMana - mana) / maxMana;
        //mana+max_mana/time_mana*((curTime-startTime)/1000
        if(restSeconds > 0) {
            setPlayerValue("manaTimeoutEnd", getServerTime() + restSeconds * 1000);
        } else {
            deletePlayerValue("manaTimeoutEnd");
        }
        return [mana, maxMana, timeMana];
    }
}
async function initUserName() {
    if(location.pathname == "/pl_info.php" && getUrlParamValue(location.href, "id") == PlayerId) {
        //console.log(document.querySelector("h1").innerText)
        setPlayerValue("UserName", document.querySelector("h1").innerText);
    }
    if(location.pathname == "/home.php") {
        //console.log(document.querySelector(`a[href='pl_info.php?id=${PlayerId}'] > b`).innerText)
        const userNameRef = document.querySelector(`a[href='pl_info.php?id=${PlayerId}'] > b`);
        if(userNameRef) {
            setPlayerValue("UserName", userNameRef.innerText);
        }
    }
    if(!getPlayerValue("UserName")) {
        const doc = await getRequest(`/pl_info.php?id=${PlayerId}`);
        setPlayerValue("UserName", doc.querySelector("h1").innerText);
    }
}
// dateString - игровое время, взятое со страниц игры. Оно всегда московское
// Как результат возвращаем серверную дату
function parseDate(dateString, isFuture = false, isPast = false) {
    //console.log(dateString)
    if(!dateString) {
        return;
    }
    const dateStrings = dateString.split(" ");

    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    const gameDate = getGameDate();
    let year = gameDate.getUTCFullYear();
    let month = gameDate.getUTCMonth();
    let day = gameDate.getUTCDate();
    const timePart = dateStrings.find(x => x.includes(":"));
    if(timePart) {
        var time = timePart.split(":");
        hours = parseInt(time[0]);
        minutes = parseInt(time[1]);
        if(time.length > 2) {
            seconds = parseInt(time[2]);
        }
        if(dateStrings.length == 1) {
            let result = new Date(Date.UTC(year, month, day, hours, minutes, seconds));
            if(isPast && result > gameDate) {
                result.setUTCDate(result.getUTCDate() - 1);
            }
            if(isFuture && result < gameDate) {
                result.setUTCDate(result.getUTCDate() + 1);
            }
            //console.log(`result: ${result}, gameDate: ${gameDate}`)
            result.setUTCHours(result.getUTCHours() - 3);
            return result;
        }
    }

    const datePart = dateStrings.find(x => x.includes("-"));
    if(datePart) {
        const date = datePart.split("-");
        month = parseInt(date[isEn ? (date.length == 3 ? 1 : 0) : 1]) - 1;
        day = parseInt(date[isEn ? (date.length == 3 ? 2 : 1) : 0]);
        if(date.length == 3) {
            const yearText = isEn ? date[0] : date[2];
            year = parseInt(yearText);
            if(yearText.length < 4) {
                year += Math.floor(gameDate.getUTCFullYear() / 1000) * 1000;
            }
        } else {
            if(isFuture && month == 0 && gameDate.getUTCMonth() == 11) {
                year += 1;
            }
        }
    }
    if(dateStrings.length > 2) {
        const letterDateExec = /(\d{2}):(\d{2}) (\d{2}) (.{3,4})/.exec(dateString);
        if(letterDateExec) {
            //console.log(letterDateExec)
            day = parseInt(letterDateExec[3]);
            //const monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
            const monthShortNames = ['янв', 'фев', 'март', 'апр', 'май', 'июнь', 'июль', 'авг', 'сент', 'окт', 'ноя', 'дек'];
            month = monthShortNames.findIndex(x => x.toLowerCase() == letterDateExec[4].toLowerCase());
            if(isPast && Date.UTC(year, month, day, hours, minutes, seconds) > gameDate.getTime()) {
                year -= 1;
            }
        }
    }
    //console.log(`year: ${year}, month: ${month}, day: ${day}, time[0]: ${time[0]}, time[1]: ${time[1]}, ${new Date(year, month, day, parseInt(time[0]), parseInt(time[1]))}`);
    let result = new Date(Date.UTC(year, month, day, hours, minutes, seconds));
    result.setUTCHours(result.getUTCHours() - 3);
    return result;
}
function getRequest(url) {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({ method: "GET", url: url, overrideMimeType: "text/html; charset=windows-1251",
            onload: function(response) { resolve((new DOMParser).parseFromString(response.responseText, "text/html")); },
            onerror: function(error) { reject(error); }
        });
    });
}
function getRequestText(url, overrideMimeType = "text/html; charset=windows-1251") {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({ method: "GET", url: url, overrideMimeType: overrideMimeType,
            onload: function(response) { resolve(response.responseText); },
            onerror: function(error) { reject(error); }
        });
    });
}
function getValue(key, defaultValue) { return GM_getValue(key, defaultValue); };
function setValue(key, value) { GM_setValue(key, value); };
function deleteValue(key) { return GM_deleteValue(key); };
function getPlayerValue(key, defaultValue) { return getValue(`${key}${PlayerId}`, defaultValue); };
function setPlayerValue(key, value) { setValue(`${key}${PlayerId}`, value); };
function deletePlayerValue(key) { return deleteValue(`${key}${PlayerId}`); };
function getPlayerBool(valueName, defaultValue = false) { return getBool(valueName + PlayerId, defaultValue); }
function getBool(valueName, defaultValue = false) {
    const value = getValue(valueName);
    //console.log(`valueName: ${valueName}, value: ${value}, ${typeof(value)}`)
    if(value != undefined) {
        if(typeof(value) == "string") {
            return value == "true";
        }
        if(typeof(value) == "boolean") {
            return value;
        }
    }
    return defaultValue;
}
function getNearestAncestorSibling(node) {
    let parentNode = node;
    while((parentNode = parentNode.parentNode)) {
        if(parentNode.nextSibling) {
            return parentNode.nextSibling;
        }
    }
}
function getNearestAncestorElementSibling(node) {
    let parentNode = node;
    while((parentNode = parentNode.parentNode)) {
        if(parentNode.nextElementSibling) {
            return parentNode.nextElementSibling;
        }
    }
}
function nextSequential(node) { return node.firstChild || node.nextSibling || getNearestAncestorSibling(node); }
function nextSequentialElement(element) { return element.firstElementChild || element.nextElementSibling || getNearestAncestorElementSibling(element); }
function getSequentialsUntil(firstElement, lastElementTagName) {
    let currentElement = firstElement;
    const resultElements = [currentElement];
    while((currentElement = nextSequential(currentElement)) && currentElement.nodeName.toLowerCase() != lastElementTagName.toLowerCase()) {
        resultElements.push(currentElement);
    }
    if(currentElement) {
        resultElements.push(currentElement);
    }
    return resultElements;
}
function findSequentialByValue(firstElement, selector) {
    let currentElement = firstElement;
    let result;
    while((currentElement = nextSequential(currentElement))) {
        if(selector(currentElement)) {
            return currentElement;
        }
    }
}
function getScriptLastAuthor() {
    let authors = GM_info.script.author;
    if(!authors) {
        const authorsMatch = GM_info.scriptMetaStr.match(/@author(.+)\n/);
        authors = authorsMatch ? authorsMatch[1] : "";
    }
    const authorsArr = authors.split(",").map(x => x.trim()).filter(x => x);
    return authorsArr[authorsArr.length - 1];
}
function getDownloadUrl() {
    let result = GM_info.script.downloadURL;
    if(!result) {
        const downloadURLMatch = GM_info.scriptMetaStr.match(/@downloadURL(.+)\n/);
        result = downloadURLMatch ? downloadURLMatch[1] : "";
        result = result.trim();
    }
    return result;
}
function getScriptReferenceHtml() { return `<a href="${getDownloadUrl()}" title="${isEn ? "Check for update" : "Проверить обновление скрипта"}" target=_blanc>${GM_info.script.name} ${GM_info.script.version}</a>`; }
function getSendErrorMailReferenceHtml() { return `<a href="sms-create.php?mailto=${getScriptLastAuthor()}&subject=${isEn ? "Error in" : "Ошибка в"} ${GM_info.script.name} ${GM_info.script.version} (${GM_info.scriptHandler} ${GM_info.version})" target=_blanc>${isEn ? "Bug report" : "Сообщить об ошибке"}</a>`; }
function addElement(type, data = {}, parent = undefined, insertPosition = "beforeend") {
    const el = document.createElement(type);
    for(const key in data) {
        if(key == "innerText" || key == "innerHTML") {
            el[key] = data[key];
        } else {
            el.setAttribute(key, data[key]);
        }
    }
    if(parent) {
        if(parent.insertAdjacentElement) {
            parent.insertAdjacentElement(insertPosition, el);
        } else if(parent.parentNode) {
            switch(insertPosition) {
                case "beforebegin":
                    parent.parentNode.insertBefore(el, parent);
                    break;
                case "afterend":
                    parent.parentNode.insertBefore(el, parent.nextSibling);
                    break;
            }
        }
    }
    return el;
}
function createPupupPanel(panelName, panelTitle, fieldsMap, panelToggleHandler) {
    const backgroundPopupPanel = addElement("div", { id: panelName, style: "position: fixed; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4); z-index: 200;" }, document.body);
    backgroundPopupPanel.addEventListener("click", function(e) { if(e.target == this) { hidePupupPanel(panelName, panelToggleHandler); }});
    const topStyle = isMobileDevice ? "" : "top: 50%; transform: translateY(-50%);";
    const contentDiv = addElement("div", { style: `${topStyle} padding: 5px; display: flex; flex-wrap: wrap; position: relative; margin: auto; padding: 0; width: fit-content; background-image: linear-gradient(to right, #eea2a2 0%, #bbc1bf 19%, #57c6e1 42%, #b49fda 79%, #7ac5d8 100%); border: 1mm ridge rgb(211, 220, 50);` }, backgroundPopupPanel);
    if(panelTitle) {
        addElement("b", { innerHTML: panelTitle, style: "text-align: center; margin: auto; width: 90%; display: block;" }, contentDiv);
    }
    const divClose = addElement("span", { id: panelName + "close", title: isEn ? "Close" : "Закрыть", innerHTML: "&times;", style: "cursor: pointer; font-size: 20px; font-weight: bold;" }, contentDiv);
    divClose.addEventListener("click", function() { hidePupupPanel(panelName, panelToggleHandler); });

    addElement("div", { style: "flex-basis: 100%; height: 0;"}, contentDiv);

    if(fieldsMap) {
        let contentTable = addElement("table", { style: "flex-basis: 100%; width: min-content;"}, contentDiv);
        for(const rowData of fieldsMap) {
            if(rowData.length == 0) { // Спомощью передачи пустой стороки-массива, указываем, что надо начать новую таблицу после брейка
                addElement("div", { style: "flex-basis: 100%; height: 0;"}, contentDiv);
                contentTable = addElement("table", undefined, contentDiv);
                continue;
            }
            const row = addElement("tr", undefined, contentTable);
            for(const cellData of rowData) {
                const cell = addElement("td", undefined, row);
                if(cellData) {
                    if(typeof(cellData) == "string") {
                        cell.innerText = cellData;
                    } else {
                        cell.appendChild(cellData);
                    }
                }
            }
        }
    }
    if(panelToggleHandler) {
        panelToggleHandler(true);
    }
    return contentDiv;
}
function showPupupPanel(panelName, panelToggleHandler) {
    const backgroundPopupPanel = document.getElementById(panelName);
    if(backgroundPopupPanel) {
        backgroundPopupPanel.style.display = '';
        if(panelToggleHandler) {
            panelToggleHandler(true);
        }
        return true;
    }
    return false;
}
function hidePupupPanel(panelName, panelToggleHandler) {
    const backgroundPopupPanel = document.getElementById(panelName);
    backgroundPopupPanel.style.display = 'none';
    if(panelToggleHandler) {
        panelToggleHandler(false);
    }
}
function mobileCheck() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};
