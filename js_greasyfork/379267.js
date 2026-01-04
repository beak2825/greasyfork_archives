// ==UserScript==
// @name         2ch autoHide
// @name:ru      2ch автохайд по списку спеллов
// @namespace    poRussia
// @version      20191107
// @author       h010c
// @description  Автоскрытие кремлеботов и ватных дегенератов.
// @homepageURL  https://greasyfork.org/ru/scripts/379267-2ch-autohide
// @icon         https://2ch.hk/favicon.ico
// @supportURL   https://discord.gg/3UrnMXN
// @include      https://2ch.hk/b/*
// @include      https://2ch.pm/b/*
// @include      https://2ch.hk/po/*
// @include      https://2ch.pm/po/*
// @include      https://2ch.hk/news/*
// @include      https://2ch.pm/news/*
// @include      https://2ch.hk/ukr/*
// @include      https://2ch.pm/ukr/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/379267/2ch%20autoHide.user.js
// @updateURL https://update.greasyfork.org/scripts/379267/2ch%20autoHide.meta.js
// ==/UserScript==


// ВНИМАНИЕ! СКРИПТ НЕСОВМЕСТИМ С ДРУГИМИ ВАРИАНТАМИ АВТОСКРЫТИЯ!
//    (такими как через куклоскрипт или через настройки 2ch)

var POST = 1;
var BOTH = 2;
var HEAD = 3;
var RAGE = 1;
var HIDE = 3;

// ============[НАЧАЛО НАСТРОЕК]============
// клики по дизлайкам ставятся в случайном интервале между этими двумя значениями
var minClickDelay = 5500;     // минимальная задержка между кликами, мс
var maxClickDelay = 7000;     // максимальная задержка между кликами, мс

var showInTitle = 1;          // Показывать счётчик дизлайков в заголовке вкладки браузера? 1 = да, 0 = нет

var ignoreQuotes = 1;         // Игнорировать совпадения выражений в >цитируемом тексте? 1 = да, 0 = нет
/*  ignoreQuotes = 0 проверяет чистый текст, поэтому будет работать быстрее и проще, но не позволит
      игнорировать совпадения регулярных выражений в цитируемом тексте и будет скрывать посты, в которых
      наивный анон цитирует животных и ботов, чтобы им ответить.
    ignoreQuotes = 1 проверяет текст с тегами, поэтому не будет ставить RAGE и скрывать посты из-за цитат,
      также конструкции типа св[b][/b]инья будут корректно определены, но этот метод работает чуть медленнее
      (разница составляет миллисекунды, но на некрокомпах может быть заметно).
    Рекомендуется использовать ignoreQuotes = 1. */

var countPosts = 1;           /* Показывать счетчик постов данного ID рядом с ID постера? 1 = да, 0 = нет
                                  Косметическая функция, которая позволяет видеть, кто больше всех насрал в треде.
                                  Нагрузки от неё почти нет. Посты Heaven'ов не считает. */

var hideThreshold = 4;        /* Количество постов с совпадающими выражениями из массива regex, после которого
                                  будут скрыты все посты с этим ID. Не работает с постами под Heaven'ом.
                                    0 = не скрывать другие посты этого ID,
                                    4 = скрывать другие посты, если было 4 поста с совпадениями или более,
                                    10 = скрывать другие посты, если было 10 постов с совпадениями или более... */
/* Подробно: при первоначальном открытии треда проверяется число совпадений для каждого ID в треде и, если число совпадений
    больше или равно указанному значению, все уже существующие посты и все будущие посты с данным ID будут скрыты.
    Если на момент первоначального открытия треда какой-то из ID не превысил порог, но позже при (авто?)обновлении треда
    порог значений для данного ID будет превышен, то скрываться будут уже только вновь добавленные посты, старые же останутся
    в первоначальном виде, так как подразумевается, что вы их уже, вероятно, прочли, и пациент тогда ещё пытался мимикрировать
    под белого человека и изъяснялся сносно. */

var openPostTimeout = 300;    // Задержка перед раскрытием поста, мс. Не менее 100 мс.

var highlight = 1;            /* Подсвечивать посты зелёным/красным? 1 = да, 0 = нет
                                  Добавляет цветной фон к постам на основании соотношения рейджей и лайков. */

var detectUnicode = 1;        /* Определять специальные символы юникода и наказывать за них?
                                  0 = нет, 1 = да(ограниченный набор), 2 = банить всё, кроме русского и английского.
                                  Последний вариант (2) не рекомендуется к использованию. */
/*  Есть особо одарённые тролли, которые, обладая некоторыми знаниями, пытаются смутить анона, вставляя
    внутрь слов невидимые спецсимволы юникода, что мешает определению этих слов, либо заменяют русские буквы
    схожими символами из других языков.
    Эта дополнительная проверка позволит определять такие символы и применять к ним правила скрытия и рагу.
    Такого рода троллей единицы, поэтому при желании эту настройку можно отключить. */

var detectFlood = 1;          /* Определять флуд повторяемыми сообщениями в одном посте?
                                  0 = нет, 1 = да.
                                  Выполняет работу вместо мочераторов, скрывая флуд.
                                  Флуд встречается редко, а настройка сжирает дополнительно 20-25% производительности.
                                  (В треде с 500 постами ~110 мс вместо ~90 мс на Ryzen 5)
                                  На слабых компах рекомендуется отключить. */

var detectSpaces = 1;         /* Определять пробелы в тексте для предотвращения обхода путем разбивки слов на части?
                                  0 = нет, 1 = да.
                                  Предотвращает вот такой обход: "ли бе ра ха".
                                  Ресурсоёмко. Увеличивает время исполнения скрипта в полтора раза. На современных
                                  компьютерах не критично, на устаревших процессорах можно отключить.
                                  (Обработка треда в 500 постов вырастает с 60мс до 90мс на Ryzen 5) */

var removePosts = 0;          /* Удалять полностью посты с совпадениями запрещённых слов?
                                  0 = нет(просто скрывать всё),
                                  1 = удалять только посты, скрывать треды,
                                  2 = удалять только треды, скрывать посты,
                                  3 = удалять всё.
                                  Дизлайки проставляются(в зависимости от настроек) и в удалённых постах. */

var removeLinks = 1;          /* Удалять ссылки на посты с совпадениями запрещённых слов?
                                  0 = нет, 1 = удалять/заменять на ">>лахтопост".
                                  Таким образом лахтопосты полностью исчезнут из поля зрения.
                                  Примечание: ввиду особенности подгрузки дваческриптов функция срабатывает
                                  не сразу, а после подгрузки скриптов двача и остальных ресурсов.
                                  В случае медленного интернет соединения функция может быть неудобной для юзера.
                                  Работает только внутри тредов. */

var hideIcons = 0;            /* Скрывать посты под определённым флажком?
                                  0 = нет,
                                  1 = скрывать,
                                  2 = ставить дизлайк,
                                  3 = скрывать и ставить дизлайк,
                                  4 = удалять,
                                  5 = удалять и ставить дизлайк. */

/*Массив иконок для скрытия, раскомментируйте нужные(удалите // из начала нужных строк).
                                      ВНИМАНИЕ!!!
 ПОСЛЕ _ПОСЛЕДНЕГО_ СЛОВА В СПИСКЕ _РАСКОММЕНТИРОВАННЫХ_ ФЛАЖКОВ НЕ ДОЛЖНО БЫТЬ ЗАПЯТОЙ!
                                      ВНИМАНИЕ!!!
*/
var iconsArray = [
  //  "Коммунизм",
  //  "Социализм",
  //  "Либерализм",
  //  "Монархизм",
  //  "Консерватизм",
  //  "Либертарианство",
  //  "Анкап",
  //  "Анархизм",
  //  "Аноним",
  //  "Оппозиция",
  //  "Власть",
  //  "Национализм",
  //  "Кургинян",
  //  "Ислам",
  //  "Сионизм",
  //  "Технократия",
  //  "Христианство",
  //  "Украина",
  //  "Свобода",
  //  "Беларусь",
  //  "Белоруссия",
  //  "ЛГБТ",
  //  "Nya",
  //  "Госдеп",
  //  "YARRR!!!",
  //  "Родноверие",
  //  "Соцдем",
  //  "Крым",
  //  "Rebel",
  //  "Новороссия",
  //  "НАТО",
  //  "Патриот",
  //  "ОМСК",
  //  "Рептилоиды"
];

var hideEmptyText = 1;        /* Скрывать посты, в которых нет никакого текста и нет картинки?
                                  (Например, сообщения со ссылкой на другое сообщение или просто пустое)
                                  0 = нет, 1 = скрывать, 2 = удалять. */


var hideEmptyTextImg = 0;     /* Скрывать посты, в которых нет никакого текста и есть картинка?
                                  0 = нет,
                                  1 = скрывать,
                                  2 = ставить дизлайк,
                                  3 = скрывать и ставить дизлайк,
                                  4 = удалять,
                                  5 = удалять и ставить дизлайк. */

var hideGreenText = 0;        /* Скрывать посты, в которых только гринтекст(цитата) и нет картинки?
                                  0 = нет,
                                  1 = скрывать,
                                  2 = ставить дизлайк,
                                  3 = скрывать и ставить дизлайк,
                                  4 = удалять,
                                  5 = удалять и ставить дизлайк. */

var hideGreenTextImg = 0;     /* Скрывать посты, в которых только гринтекст(цитата) и есть картинка?
                                  0 = нет,
                                  1 = скрывать,
                                  2 = ставить дизлайк,
                                  3 = скрывать и ставить дизлайк,
                                  4 = удалять,
                                  5 = удалять и ставить дизлайк. */

var refreshTimer = 30;        // Количество секунд, через которые нулевая страница автообновляется.
var refreshFrontPage = 0;     /* Обновлять нулевую и отправлять дизлайки раз в refreshTimer секунд?
    0 - ничего не делать, 1 = работать в /po/, 2 = в /news/, 3 = /po/ и /news/ по очереди
    Это злая настройка, которая будет обновлять нулевую страницу выбранного раздела и автоматически
      проставлять дизлайки(если нужно, согласно правилам) на последние три поста каждого треда.
      Не нужно заходить в каждый тред, не нужно проверять всё вручную. Можно просто поставить в фоновой
      вкладке, оставить на ночь, оставить работать, пока вас нет дома и так далее. С такой низкой скоростью
      постинга, которая сейчас проявляется на полумёртвой борде, посты не будут пропускаться, и вы пассивно
      будете обрабатывать все проходящие через раздел сообщения. */

/*Вложенный массив с регулярными выражениями для скрытия/лайков.
  Первый элемент - место поиска выражения:
    POST - искать только в тексте поста;
    BOTH - искать и в тексте, и в заголовке;
    HEAD - искать только в заголовке треда(для скрытия номерных тредов, например).
  Второй элемент - действие при обнаружении:
    RAGE - ставить дизлайк;
    BOTH - ставить дизлайк и скрывать;
    HIDE - просто скрытие.
  Третий элемент - регулярное выражение.
  Четвёртый элемент - краткое описание, которое появится в заголовке скрытого поста/треда.

  Узнать больше про регулярные выражения можно тут:
    https://www.google.com/search?q=regex+javascript
  Потестировать работоспособность и создать спеллы можно тут:
    https://regex101.com/
    (не забыть слева выбрать "ECMAScript (JavaScript)", справа от строки во флагах выбрать /im)

  [где искать, что делать, /регулярное выражение/im,                                                                     "описание"]*/
var regexArray = [
  [BOTH, BOTH, /(?:^|\s)[ао]?леш(?:ень)?к[ауие]/im,                                                                                          "алёшка"],
  [BOTH, BOTH, /безвизг/im,                                                                                                                  "безвизг"],
  [BOTH, BOTH, /горелодуп/im,                                                                                                                "горелодупый"],
  [BOTH, BOTH, /(?:^|\s)ебин/im,                                                                                                             "ебинность"],
  [BOTH, BOTH, /(?:^|\s)ж[ео]вто/im,                                                                                                         "жовто-блакитный"],
  [BOTH, BOTH, /за?робитч/im,                                                                                                                "заробитчане"],
  [BOTH, BOTH, /(?:[зж]а(?:падн|(?:океан|мор)ск)|м[еу]р+иканск)\S{2,3}\s(?:бар[ие]|хозя[ие][вн])/im,                                         "западный барин"],
  [BOTH, BOTH, /кастрюл\S{7,}/im,                                                                                                            "кастрюлеголовый"],
  [BOTH, BOTH, /с?к[аео][кх]+(?:е?л|ол[^адо]|уас)/im,                                                                                        "какол"],
  [BOTH, BOTH, /киберсот/im,                                                                                                                 "киберсотня"],
  [BOTH, BOTH, /[кп]о[кп]озиц/im,                                                                                                            "кокозиция"],
  [BOTH, BOTH, /(?:^|\s)копро(?!тив|ф[аи]|сл)/im,                                                                                            "копро"],
  [BOTH, BOTH, /(?:кря|сра)кл/im,                                                                                                            "крякл"],
  [BOTH, BOTH, /лехаим/im,                                                                                                                   "лехаим"],
  [BOTH, BOTH, /(?:^|\s|(?!бе)..)л[еия]б([еиуя](?:ср|рд?(?:[^аинт]|[ат][^аил]|ня|ал(?:ье|(?!ьн|из[аиом]|\S{0,4}(?:\s|$))))))/im,             "либераш"],
  [BOTH, BOTH, /(?:^|\s)л[еи]б((?:ер)?\.?\s|ро[ни]|мраз)/im,                                                                                 "леброн"],
  //[BOTH, BOTH, /либеральн\S{2,3}\sпидораш/im,                                                                                                "перефорс пидорашки"],
  [BOTH, BOTH, /маида(?:ун|нут)/im,                                                                                                          "майдаун"],
  [BOTH, BOTH, /малолетн\S{2,3}\s(?:дебил|долбо)/im,                                                                                         "быдло с тупичка"],
  [BOTH, BOTH, /(?:^|\s)ман(?:я(?![^\s.,!?])|еч|юн|ь(?![цчя])к?)/im,                                                                         "маня"],
  [BOTH, BOTH, /(?:^|\s)машк/im,                                                                                                             "машк"],
  [BOTH, BOTH, /мивин\S/im,                                                                                                                  "мивина"],
  [BOTH, BOTH, /мыкол/im,                                                                                                                    "мыкола"],
  [BOTH, BOTH, /н[ао]в[ао]л(?:яш|ьн(?:[еоя][^вгм]|ы[нш]))/im,                                                                                "навальнята"],
  [BOTH, BOTH, /(насра|(?:ху|пын)я|(?:^|\s)о[вн]а)льн/im,                                                                                    "насральный"],
  [BOTH, BOTH, /(?:о|фб)кат[ыь]ш/im,                                                                                                         "окатыш"],
  [BOTH, BOTH, /(?:ольк|лахт|бот)\S+\s(?:\S{0,3}\s)?фбк|фбк\sбот/im,                                                                         "ольки из фбк"],
  [BOTH, BOTH, /(?:^|\s)окраин(ск|е?ц)/im,                                                                                                   "окраина"],
  [BOTH, BOTH, /п[еи]ндо[сх]/im,                                                                                                             "пиндос"],
  [BOTH, BOTH, /под\s*?кроватью/im,                                                                                                          "под кроватью"],
  [BOTH, BOTH, /понадус/im,                                                                                                                  "понадусёровый"],
  [BOTH, BOTH, /(?:^|\s)порашн\S/im,                                                                                                         "порашник"],
  [BOTH, BOTH, /(?:^|\s)порос(?!си)\S/im,                                                                                                    "порось"],
  [BOTH, BOTH, /порохо[^вм]/im,                                                                                                              "порохобот"],
  [BOTH, BOTH, /пятач?о?к/im,                                                                                                                "пятак"],
  [BOTH, BOTH, /(?:^|[^п])р[ао]гул/im,                                                                                                       "рагуль"],
  [BOTH, BOTH, /реда\S{4,7}\s(?:\S+\s)?соц\S*?\s?сет/im,                                                                                     "редактор"],
  [BOTH, BOTH, /сало(?:ед|питек|стан|ин)/im,                                                                                                 "сало"],
  [BOTH, BOTH, /св[иы]дом/im,                                                                                                                "свидомый"],
  [BOTH, BOTH, /\Sсв[иы]н|(?:^|\s)св[иы]н(?!ин|ь|о(?:соб|фе|мат)|с[кт]|е?ц|[тч][ия]|(?:ая|ей|о(?:го|е|й|му?)|ую|ым)([\s.,!?]|$))/im,         "свинявый"],
  [BOTH, BOTH, /с[иы]ськ\S{4,}([\s.,!?]|$)/im,                                                                                               "сиськобот"],
  [BOTH, BOTH, /(?:^|\s|под)сис+([яи](ль|т)?н+(?!д))/im,                                                                                     "сисян"],
  [BOTH, BOTH, /срын[оь]?[кч]/im,                                                                                                            "срыночек"],
  [BOTH, BOTH, /(?:^|\s)а?са?ша(?:й|ш)к/im,                                                                                                  "сшашка"],
  [BOTH, BOTH, /(?:^|\s)тарас(?!\S*?\sшев)/im,                                                                                               "тарас"],
  [BOTH, BOTH, /укроп(?!ост|асп)/im,                                                                                                         "укроп"],
  [BOTH, BOTH, /(?:у(?:[сх]р|рк)|срукр)(?:[аоу]и|уа)н/im,                                                                                    "усраина"],
  [BOTH, BOTH, /х[аио]х[ио]?л(?!ом(?:[аеуы]|ой)[.,?!]?)/im,                                                                                  "хахлы"],
  [BOTH, BOTH, /(?:^|\s)хранц/im,                                                                                                            "хранция"],
  [BOTH, BOTH, /хр(?:ю(?!че)|як)/im,                                                                                                         "хрю"],
  [BOTH, BOTH, /чубат/im,                                                                                                                    "чубатый"],
  [BOTH, BOTH, /швайн/im,                                                                                                                    "швайн"],
  [BOTH, BOTH, /(?:^|\s)шв(?:[яиыю]т|[ао]бод)/im,                                                                                            "швятая/швобода"],
  [BOTH, BOTH, /шпрот/im,                                                                                                                    "шпрот"],
  [HEAD, BOTH, /К[ао]мрад|Дим ?Юрь?ич/im,                                                                                                    "быдло с тупичка"],
  [HEAD, BOTH, /ком+унист поясняет|анти(?:советчик|ком+унис)|вестник бури/im,                                                                "красножопый людоед"],
  [HEAD, BOTH, /шульман/im,                                                                                                                  "(((Шульман)))"],
  [HEAD, HIDE, /Месяцеслов/im,                                                                                                               "Месяцеслов"],
  [HEAD, BOTH, /к.{0,5}р.{0,5}ы.{0,5}м.{0,5}и.*н.*о.*в.*о.*р.*о.*с.*и.*я/im,                                                                 "крымодебилы"],
  [HEAD, BOTH, /к(?=[рыминовся\s]{16,22})(?:р?ы?м?\s?н?о?в?о?р?о?с*и?я?){16,22}/im,                                                          "крымодебилы"]
];
// ============[КОНЕЦ  НАСТРОЕК]============
var perfTimer = performance.now();
var clicksArray = [];
var clicksTaskActive = 0;
var timeoutID;

var displayBlock = document.getElementById("fullscreen-container");
var title = document.title;
var pager = document.getElementsByClassName("pager")[0];
var inputListener = function() { delayClicksAfterUserInput(event.target, event.button); };
var reChrStrip = new RegExp('[\\u0000-\\u0009\\u000b-\\u001f\\u0021-\\u002e\\u003a-\\u003b\\u005b-\\u0060\\u007b-\\u00bf\\u0482-\\u0487\\u2000-\\u200f\\u205f-\\u206f]', 'g');
var hideTotalSpan1, hideTotalSpan2;
var regexArraySpace = [];
var toxicLinksArray = [];
unicodeFixes();

var postCountArray = [];
var hiddenIdsArray = [];

var ahSettingsLink, menuDiv;
createMenuLink();

if (document.URL.slice(-1) =="/") {
  hideOpPosts();
  hidePosts();
  refreshFPage();

  if (pager.style.display === "") { return; }

  var callback = function(mutationsList, observer) {
    for(var m = 0; m < mutationsList.length; m++) {
      var man = mutationsList[m].addedNodes;
      if (!man.length || man[0].tagName != "DIV" || man[0].className != "thread") { continue; }

      hideOpPosts(man[0].firstChild.firstChild);
      for (var i = 2; i < man[0].childNodes.length; i++) {
        hidePosts(man[0].childNodes[i].firstChild.firstChild);
      }
    }
  };

  var observer = new MutationObserver(callback);
  observer.observe(document.getElementById('posts-form'), { attributes: false, childList: true, subtree: false });
} else if (document.URL.includes("/res/")) {
  var hiddenCount = 0;
  hidePosts();
  insertHideTotalSpans();

  var callback = function(mutationsList, observer) {
    for(var m = 0; m < mutationsList.length; m++) {
      var man = mutationsList[m].addedNodes;
      if (!man.length || man[0].tagName != "DIV" || man[0].className !== "" || man[0].firstChild.className != "thread__post") { continue; }
      hidePosts(man[0].firstChild.firstChild);
      removeToxicLinks();
    }
  };
  var observer = new MutationObserver(callback);
  observer.observe(document.getElementsByClassName("thread")[0], { attributes: false, childList: true, subtree: false });

  if (removeLinks) {
    removeToxicLinks();
    var callbackPopup = function(mutationsList, observer) {
      for(var m = 0; m < mutationsList.length; m++) {
        var man = mutationsList[m].addedNodes;
        if (!man.length || man[0].tagName != "DIV" || !man[0].classList.contains("post_preview")) { continue; }
        removeToxicLinks(man[0]);
      }
    };
    var observerPopup = new MutationObserver(callbackPopup);
    observerPopup.observe(document.getElementById("posts-form"), { attributes: false, childList: true, subtree: false });
  }
}

function insertHideTotalSpans() {
  hideTotalSpan1 = document.createElement("span");
  hideTotalSpan1.className = "post-hidden";
  hideTotalSpan1.style.cursor = "pointer";
  hideTotalSpan1.title = "Счётчик автоскрытых постов. Скрипт выполнялся " + String(Math.round(performance.now() - perfTimer)) + " мс.\n\n  Примечание: если у вас напердолен " +
                         "браузер для анонимности,\n  или вкладка загружалась в фоне, то указанное здесь значение\n  производительности может быть неверным.";
  hideTotalSpan1.textContent = "👀 "+ String(hiddenCount) + " ";
  var threadNavStats = document.getElementsByClassName("thread-nav__stats");
  threadNavStats[0].insertBefore(hideTotalSpan1, threadNavStats[0].firstChild);
  hideTotalSpan2 = hideTotalSpan1.cloneNode(true);
  threadNavStats[1].insertBefore(hideTotalSpan2, threadNavStats[1].firstChild);
}

function hideOpPosts(node) {
  var opPostsCollection = [];

  if (node) { opPostsCollection.push(node); }
  else { opPostsCollection = document.getElementsByClassName("post_type_oppost"); }

  for (var i = 0; i < opPostsCollection.length; i++) {
    var opPost = opPostsCollection[i];
    var thread = opPost.parentNode.parentNode;
    if (thread.style.display == "none") { continue; }

    var regexResult = regexCheck(opPost, 1);
    if (regexResult > -1) {
      if (regexArray[regexResult][1] < 3) { requestDislike(opPost); }
      if (regexArray[regexResult][1] > 1) {
        if (removePosts < 2) {
          insertHideThread(thread, opPost, " • hide: " + regexArray[regexResult][3]);
        }
        thread.style.display = "none";
        continue;
      }
    }

    var iconResult = iconCheck(opPost);
    if (iconResult > -1) {
      if (hideIcons == 2 || hideIcons == 3 || hideIcons == 5) { requestDislike(opPost); }
      if (hideIcons != 2) {
        if (hideIcons == 1 || hideIcons == 3) {
          insertHideThread(thread, opPost, " • hide: флаг-" + iconsArray[iconResult]);
        }
        thread.style.display = "none";
      }
    }
  }
}

function insertHideThread(thread, opPost, hideReason) {
  var hideDiv = document.createElement("div");
  hideDiv.className = "thread thread_hidden";

  var postTitle, postsNum, divPostDetailsSpans = opPost.getElementsByClassName("post__detailpart");
  hideDiv.innerHTML = "Скрытый тред" + ((postTitle = opPost.getElementsByClassName("post__title")).length ? " ("+postTitle[0].textContent.trim()+")" : "") +
  ((postsNum = thread.getElementsByClassName("thread__missed")).length ? " • " + postsNum[0].innerText.substring(10, postsNum[0].innerText.indexOf("постов", 10) + 6) : "") +
  (divPostDetailsSpans.length ? " • " + divPostDetailsSpans[divPostDetailsSpans.length - 3].innerHTML : "") +
  (divPostDetailsSpans.length ? divPostDetailsSpans[divPostDetailsSpans.length - 2].innerHTML : "") +
  hideReason + " " + divPostDetailsSpans[divPostDetailsSpans.length - 1].innerHTML;

  var msgText = opPost.getElementsByClassName("post__message_op")[0].innerText.trim();
  hideDiv.title = msgText.length > 800 ? msgText.substring(0, 800) + "..." : msgText; //TODO: fix this

  thread.parentNode.insertBefore(hideDiv, thread);
}

function hidePosts(node) {
  var postsCollection = [];
  if (node) { postsCollection.push(node); }
  else { postsCollection = document.getElementsByClassName("post_type_reply"); }

  for (var i = 0; i < postsCollection.length; i++) {
    var post = postsCollection[i];
    if (post.classList.contains("post_type_hidden")) { continue; }

    var regexResult = regexCheck(post, 0);
    if (regexResult > -1) {
      if (regexArray[regexResult][1] < 3) { requestDislike(post); }
      if (regexArray[regexResult][1] > 1) {
        if (removePosts == 1 || removePosts == 3) {
          post.style.display = "none";
        } else {
          insertHideSpan(post, regexArray[regexResult][3]);
          post.classList.add("post_type_hidden");
        }
        toxicLinksArray.push(post.getAttribute("data-num"));
        countTrollPosts(post, 1);
        hiddenCount++;
        continue;
      }
    }

    var iconResult = iconCheck(post);
    if (iconResult > -1) {
      if (hideIcons == 2 || hideIcons == 3 || hideIcons == 5) { requestDislike(post); }
      if (hideIcons > 3) {
        post.style.display = "none";
      } else if (hideIcons == 1 || hideIcons == 3) {
        insertHideSpan(post, "флаг-" + iconsArray[iconResult]);
        post.classList.add("post_type_hidden");
      }
      countTrollPosts(post, 1);
      hiddenCount++;
      continue;
    }

    countTrollPosts(post);

    if (greentextCheck(post)) { continue; }

    highlightPosts(post);
  }

  hideTrollPosts(postsCollection);

  if (node && hideTotalSpan1) {
    hideTotalSpan1.textContent = "👀 "+ String(hiddenCount) + " ";
    hideTotalSpan2.textContent = "👀 "+ String(hiddenCount) + " ";
  }
}

function iconCheck(post) {
  if (!hideIcons || !iconsArray.length) { return -1; }

  var postIcon;
  if ((postIcon = post.getElementsByClassName("post__icon")).length) {
    var iconImg;
    if ((iconImg = postIcon[0].getElementsByTagName("img")).length) {
      var iconTitle = iconImg[0].title;
      for (var i = 0; i < iconsArray.length; i++) {
        if (iconsArray[i] == iconTitle) {
          return i;
        }
      }
    }
  }
}

function removeToxicLinks(post) {
  if (post || document.readyState == "complete") {
    var thisPostId;
    var parentLinks;
    if((parentLinks = (post ? post : document).querySelectorAll("div.post__refmap a.post-reply-link")).length) {
      for (var i = 0; i < parentLinks.length; i++) {
        thisPostId = parentLinks[i].getAttribute("data-num");
        for (var j = 0; j < toxicLinksArray.length; j++) {
          if (thisPostId == toxicLinksArray[j]) {
            parentLinks[i].remove();
            break;
          }
        }
      }
    }
    var childLinks;
    if((childLinks = (post ? post : document).querySelectorAll("article.post__message a.post-reply-link")).length) {
      for (var k = 0; k < childLinks.length; k++) {
        thisPostId = childLinks[k].getAttribute("data-num");
        for (var l = 0; l < toxicLinksArray.length; l++) {
          if (thisPostId == toxicLinksArray[l]) {
            childLinks[k].outerHTML = "<a class=\"post-reply-link\">&gt;&gt;лахтопост</a>";
            break;
          }
        }
      }
    }
  } else {
    setTimeout(removeToxicLinks, 200);
  }
}

function countTrollPosts(post, toHide) {
  if (!hideThreshold && !countPosts) { return; }

  var idArray = getId(post);
  var id = idArray[1];
  if (!id) { return; }

  if (countPosts) {
    for (var i = 0; i < postCountArray.length; i++) {
      if(postCountArray[i][0] == id) {
        postCountArray[i][1]++;
        break;
      }
    }
    if (i == postCountArray.length) {
      postCountArray.push([id, 1]);
    }
    var idSpan = idArray[0];
    var postCountDiv = document.createElement("span");
    postCountDiv.innerText = " {" + postCountArray[i][1] + "}";
    postCountDiv.title = "Счётчик постов";
    postCountDiv.style.opacity = "0.4";
    idSpan.parentNode.insertBefore(postCountDiv, idSpan.nextSibling);
  }

  if (hideThreshold && toHide) {
    for (var j = 0; j < hiddenIdsArray.length; j++) {
      if (hiddenIdsArray[j][0] == id) {
        hiddenIdsArray[j][1]++;
        break;
      }
    }
    if (j == hiddenIdsArray.length) {
      hiddenIdsArray.push([id, 1]);
    }
  }
}

function hideTrollPosts(postsCollection) {
  if (!hideThreshold) { return; }

  for (var p = 0; p < postsCollection.length; p++) {
    var post = postsCollection[p];
    if (post.classList.contains("post_type_hidden")) { continue; }
    var id = getId(post)[1];
    if (!id) { continue; }

    for (var i = 0; i < hiddenIdsArray.length; i++) {
      if (hiddenIdsArray[i][1] < hideThreshold) { continue; }
      if (hiddenIdsArray[i][0] == id) {
        insertHideSpan(post, hiddenIdsArray[i][1] + " пост" + (hiddenIdsArray[i][1] > 4 ? "ов" : "а") + " с regex");
        post.classList.add("post_type_hidden");
        hiddenCount++;
        break;
      }
    }
  }
}

function getId(post) {
  var id;
  if ((id = post.getElementsByClassName("post__anon")).length || (id = post.getElementsByClassName("post__email")).length) {
    if ((id = id[0].getElementsByTagName("span")).length) {
      return [id[0], id[0].id.slice(7)];
    }
  }
  return [0, 0];
}

function insertHideSpan(post, reasonText) {
  var hideSpan = document.createElement("span");
  hideSpan.style.cursor = "help";
  hideSpan.style.fontSize = "85%";
  hideSpan.style.userSelect = "none";
  hideSpan.style.mozUserSelect = "none";
  hideSpan.style.webkitUserSelect = "none";
  hideSpan.style.msUserSelect = "none";
  hideSpan.className = "post__hidereason";
  hideSpan.textContent = "• hide: " + reasonText;
  var hideSpanIcon = document.createElement("span");
  hideSpanIcon.style.fontSize = "75%";

  hideSpan.onclick = function() {
    if (this.id != "hs_clicked") {
      hideSpanIcon.textContent = "✔️";
      hideSpanIcon.style.opacity = "0.7";
      post.classList.remove("post_type_hidden");
      this.id = "hs_clicked";
    } else {
      hideSpanIcon.textContent = "❌";
      hideSpanIcon.style.opacity = "0.7";
      this.id = "hs_close";
    }
  };
  hideSpan.onmouseenter = function() {
    if (this.id != "hs_clicked") {
      this.id = setTimeout(openPost, (openPostTimeout < 100 ? 100 : openPostTimeout), this, post, hideSpanIcon);
    }
  };
  hideSpan.onmouseleave = function() {
    if (this.id && this.id != "hs_clicked") {
      clearTimeout(this.id);
      this.id = "";
      if (!post.classList.contains("post_type_hidden")) {
        hideSpanIcon.textContent = "";
        post.classList.add("post_type_hidden");
      }
    }
  };

  var postDetails, postTurnOff;
  if ((postDetails = post.getElementsByClassName("post__details")).length && (postTurnOff = post.getElementsByClassName("turnmeoff")).length) {
    postDetails[0].insertBefore(hideSpan, postTurnOff[1]);
    postDetails[0].insertBefore(hideSpanIcon, postTurnOff[1]);
  }
}

function openPost(elem, post, icon) {
  if (elem.id != "hs_clicked" && post.classList.contains("post_type_hidden")) {
    icon.textContent = "👀";
    icon.style.opacity = "1.0";
    post.classList.remove("post_type_hidden");
  }
}

function greentextCheck(post) {
  if (!hideEmptyText && !hideEmptyTextImg && !hideGreenText && !hideGreenTextImg) { return false; }

  var hasImages = post.getElementsByClassName("post__images").length;
  var msgText = post.getElementsByClassName("post__message")[0].innerHTML.trim();
  msgText = msgText.replace(/<a href="\/(?:po|news)\/res\/.*?<\/a>|<br>/g, "");
  msgText = msgText.trim();
  var len = msgText.length;

  if (hideEmptyText && !hasImages && (!len || (len == 4 && new RegExp('[бb][ауui][мm][пp]', 'i').test(msgText)))) {
    hiddenCount++;
    switch (hideEmptyText) {
      case 1:
        insertHideSpan(post, len ? "бамп" : "пустой пост");
        post.classList.add("post_type_hidden");
        return true;
      case 2:
        post.style.display = "none";
        return true;
    }
  }

  if (hideEmptyTextImg && hasImages && !len) {
    if (hideEmptyTextImg == 2) {
      requestDislike(post);
      return false;
    } else if (hideEmptyTextImg == 3 || hideEmptyTextImg == 5) {
      requestDislike(post);
    }
    hiddenCount++;
    if (hideEmptyTextImg == 1 || hideEmptyTextImg == 3) {
      insertHideSpan(post, "картинка без текста");
      post.classList.add("post_type_hidden");
      return true;
    }
    if (hideEmptyTextImg == 4 || hideEmptyTextImg == 5) {
      post.style.display = "none";
      return true;
    }
  }

  msgText = msgText.replace(/<span class=\"unkfunc\">.*?<\/span>/g, "");
  if (msgText.length) { return false; }

  if (hideGreenText && !hasImages) {
    if (hideGreenText == 2) {
      requestDislike(post);
      return false;
    } else if (hideGreenText == 3 || hideGreenText == 5) {
      requestDislike(post);
    }
    hiddenCount++;
    if (hideGreenText == 1 || hideGreenText == 3) {
      insertHideSpan(post, "гринтекст");
      post.classList.add("post_type_hidden");
      return true;
    }
    if (hideGreenText == 4 || hideGreenText == 5) {
      post.style.display = "none";
      return true;
    }
  }

  if (hideGreenTextImg && hasImages) {
    if (hideGreenTextImg == 2) {
      requestDislike(post);
      return false;
    } else if (hideGreenTextImg == 3 || hideGreenTextImg == 5) {
      requestDislike(post);
    }
    hiddenCount++;
    if (hideGreenTextImg == 1 || hideGreenTextImg == 3) {
      insertHideSpan(post, "гринтекст с картинкой");
      post.classList.add("post_type_hidden");
      return true;
    }
    if (hideGreenTextImg == 4 || hideGreenTextImg == 5) {
      post.style.display = "none";
      return true;
    }
  }
}

function regexCheck(post, isOpPost) {
  var postTitle;
  var postMsg;
  var postTitleText;
  var len = regexArray.length;

  if ((postTitle = post.getElementsByClassName("post__title")).length && (postTitleText = postTitle[0].textContent.trim())) {
    if (detectUnicode == 1) { postTitleText = postTitleText.replace(reChrStrip, detectSpaces ? " " : ""); }
    for (var i = 0; i < len; i++) {
      if (regexArray[i][0] > 1 && regexArray[i][2].test(postTitleText)) { return i; }
    }
  }

  if ((postMsg = post.getElementsByClassName(isOpPost ? "post__message_op" : "post__message")).length) {
    var msgText = postMsg[0].innerHTML.trim();
    msgText = msgText.replace(/<su[bp]><su[bp]><su[bp]><su[bp]><su[bp]>.*?<\/su[bp]><\/su[bp]><\/su[bp]><\/su[bp]><\/su[bp]>(?!<\/su[bp]>)/g,"");

    if (ignoreQuotes) {
      msgText = msgText.replace(/<(?:a href=(?!"(?:irc|mailto):).*?<\/a|span class="[suo](?:poiler)?"|\/?(?:em|strong|su[bp]))>/g, "");

      var splitStart = -1;
      while ((splitStart = msgText.indexOf("<span class=\"unkfunc\">")) > -1 ) {
        msgText = msgText.substring(0, splitStart) + msgText.substring(msgText.indexOf("</span>", splitStart + 22) + 7);
      }
      msgText = msgText.replace(/<\/span>/g, "");
    } else {
      msgText = msgText.replace(/<(?:a href=(?!"(?:irc|mailto):).*?<\/a|span class="[suo](?:poiler)?"|\/?(?:em|span|strong|su[bp]))>/g, "");
    }
    msgText = msgText.replace(detectSpaces ? /(?:<br>)+|\//g : /(?:<br>+)/g, " ");

    if (detectUnicode == 1) { msgText = msgText.replace(reChrStrip, detectSpaces ? " " : ""); }

    msgText = msgText.replace(/\s+/g, " ");

    for (var l = 0; l < len; l++) {
      if (regexArray[l][0] < 3 && regexArray[l][2].test(msgText)) { return l; }
    }
  }
  return -1;
}

function unicodeFixes() {
  var unicodeCharsArray = [
    ["а", "аa",   "аaàáâãäåæāăą"],
    ["б", "бb6",  "бb6"],
    ["в", "вb",   "вbß"],
    ["г", "гr",   "гrѓґŕŗř"],
    ["д", "дdg",  "дdgðďđĝğġģ"],
    ["е", "еёe",  "еёeѐєèéêëēĕėęě"],
    ["ё", "еёe",  "еёeѐєèéêëēĕėęě"],
    ["ж", "жj",   "жјĵ"],
    ["з", "з3",   "з3"],
    ["и", "ийiu", "иuiйіїѝìíîïùúûüĩīĭįıũūŭůűų"],
    ["й", "ийiu", "иuiйіїѝìíîïùúûüĩīĭįıũūŭůűų"],
    ["к", "кk",   "кkќķĸ"],
    ["л", "л",    "лљ"],
    ["м", "мm",   "мm"],
    ["н", "нh",   "нhњĥħ"],
    ["о", "оo0",  "оo0òóôõöøōŏő"],
    ["п", "пn",   "пnñńņňŉŋ"],
    ["р", "рp",   "рpþ"],
    ["с", "сc",   "сcçćĉċč"],
    ["т", "тt",   "тtţťŧ"],
    ["у", "уy",   "уyўýÿŷ"],
    ["ф", "ф",    "ф"],
    ["х", "хx",   "хx×"],
    ["ц", "ц",    "ц"],
    ["ч", "ч4",   "ч4"],
    ["ш", "шщ",   "шщ"],
    ["щ", "шщ",   "шщ"],
    ["ъ", "ъьb",  "ъьb"],
    ["ы", "ы",    "ы"],
    ["ь", "ъьb",  "ъьb"],
    ["э", "э",    "эє"],
    ["ю", "ю",    "ю"],
    ["я", "я",    "я"]
  ];

  for (var r = 0; r < regexArray.length; r++) {
    var needsSpace = false;
    var partStartIndex = 0;
    var stParts = [];
    var st = regexArray[r][2].source;
    var charIndex;

    for (charIndex = 0; charIndex < st.length - 2; charIndex++) {
      if (st[charIndex] == "(" && st[charIndex + 1] == "?" && st[charIndex + 2] == "!") {   //TODO
        stParts.push([1, st.slice(partStartIndex, charIndex + 3), ""]);
        partStartIndex = charIndex + 3;
        var brackets = 1;
        while (brackets && charIndex < st.length) {
          charIndex++;
          if (st[charIndex] == "(" && st[charIndex - 1] != "\\") {
            brackets++;
          } else if (st[charIndex] == ")" && st[charIndex - 1] != "\\") {
            brackets--;
          }
        }
        stParts.push([0, st.slice(partStartIndex, charIndex + 1), ""]);
        partStartIndex = charIndex + 1;
      }
    }

    if (partStartIndex <= st.length - 1) {
      stParts.push([1, st.slice(partStartIndex), ""]);
    }

    if (detectSpaces) {
      if (st.slice(0,7) == "(?:^|\\s") {
        needsSpace = false;
      } else {
        needsSpace = true;
      }
    }

    st = "";
    var bracket;
    for (var part = 0; part < stParts.length; part++) {
      if (stParts[part][0]) {
        var stTemp = stParts[part][1].replace(/\[[^\^][^\]]+\](?![\+\{\*\?]|\[\^)/g, "$&+");  //TODO
        stTemp = stTemp.replace(/\]\?/, "]*?");
        for (charIndex = stTemp.length - 1; charIndex >= 0; charIndex--) {
          for (var u = 0; u < unicodeCharsArray.length; u++) {
            if(stTemp[charIndex].toLowerCase() == unicodeCharsArray[u][0]) {
              if (charIndex === 0) {
                if (stTemp[charIndex + 1] == "+" || stTemp[charIndex + 1] == "{" || stTemp[charIndex + 1] == "*"){
                  bracket = "]";
                } else if (stTemp[charIndex + 1] == "?") {
                  bracket = "]*";
                } else {
                  bracket = "]+";
                }
                stTemp = "[" + unicodeCharsArray[u][detectUnicode > 0 ? 2 : 1] + bracket + stTemp.slice(charIndex + 1);
                break;
              }
              for (var v = charIndex - 1; v >= 0; v--) {
                if (stTemp[v] == "[") {
                  if ((v == charIndex - 1 || v < charIndex - 1 && stTemp[v + 1] != "^" && v > 0 && stTemp[v - 1] != "\\") || v === 0) {
                    stTemp = stTemp.slice(0, charIndex) + unicodeCharsArray[u][detectUnicode > 0 ? 2 : 1] + stTemp.slice(charIndex + 1);
                  }
                  break;
                } else if (stTemp[v] == "]" && (v === 0 || (v > 0 && stTemp[v - 1] != "\\"))) {
                  if (charIndex == stTemp.length - 1) {
                    bracket = "]+";
                  } else if (stTemp[charIndex + 1] == "+" || stTemp[charIndex + 1] == "{" || stTemp[charIndex + 1] == "*" ||
                            (charIndex < stTemp.length - 2 && stTemp[charIndex + 1] == "[" && stTemp[charIndex + 2] == "^")) {
                    bracket = "]";
                  } else if (stTemp[charIndex + 1] == "?") {
                    bracket = "]*";
                  } else {
                    bracket = "]+";
                  }
                  stTemp = stTemp.slice(0, charIndex) + "[" + unicodeCharsArray[u][detectUnicode > 0 ? 2 : 1] + bracket + stTemp.slice(charIndex + 1);
                  break;
                }
              }
              if (v == -1) {
                if (charIndex < stTemp.length - 1 && stTemp[charIndex + 1] != "+" && stTemp[charIndex + 1] != "{" && stTemp[charIndex + 1] != "*" && stTemp[charIndex + 1] != "?") {
                  bracket = "]+";
                } else if (charIndex < stTemp.length - 1 && stTemp[charIndex + 1] == "?") {
                  bracket = "]*";
                } else {
                  bracket = "]";
                }
                stTemp = stTemp.slice(0, charIndex) + "[" + unicodeCharsArray[u][detectUnicode > 0 ? 2 : 1] + bracket + stTemp.slice(charIndex + 1);
              }
              break;
            }
          }
        }
        stParts[part][1] = stTemp;
      }
      st = st + stParts[part][1];
    }
    if (detectSpaces) {
      if (needsSpace) {
        st = st + "|(?:^|\\s)(?:";
        for (s = 0; s < stParts.length; s++) {
          stParts[s][2] = stParts[s][1].replace(/\[[^\^]/g, "\\s*?$&");
          st = st + stParts[s][2];
        }
        st = st + ")(?:\\s|$)";
      } else {
        st = st + "|" + st.replace(/\[[^\^]/g, "\\s*?$&") + "(?:\\s|$)";
      }
    }
    stParts.length = 0;
    regexArray[r][2] = new RegExp(st, "im");
  }

  if (detectFlood) {
    regexArray.push([POST, BOTH, /(.{5,30})\1{7}/, "флуд"]);
  }

  if (detectUnicode == 2) {
    regexArray.push([BOTH, BOTH, /[\u0080-\u00a0\u00ad\u0180-\u03ff\u0460-\u200f\u2028-\u2037\u205f-\u218f\u2460-\u24ff\u2c60-\uffff]/, "unicode"]);
  }
}

function highlightPosts(post) {
  if (!highlight) { return; }

  var like,
      dislike,
      likeSpan,
      dislikeSpan,
      likeCount,
      dislikeCount;

  if ((like = post.getElementsByClassName("post__rate_type_like")[0]) && (likeSpan = like.children[1])) {
    likeCount = parseInt(likeSpan.innerHTML, 10);
  }
  if ((dislike = post.getElementsByClassName("post__rate_type_dislike")[0]) && (dislikeSpan = dislike.children[1])) {
    dislikeCount = parseInt(dislikeSpan.innerHTML, 10);
  }
  if (!likeCount) { likeCount = 1; }
  if (!dislikeCount) { dislikeCount = 1; }

  var r = likeCount / dislikeCount;
  if (r > 1.33) {
    post.style.backgroundColor = 'rgba(120,' + String(Math.min(120 + r*13, 250)) + ',120,0.2)';
  } else if (r < 0.75) {
    post.style.backgroundColor = 'rgba(' + String(Math.min(120 + 1/r*13, 250)) + ',120,120,0.2)';
  } else if (likeCount + dislikeCount > 30) {
    post.style.backgroundColor = 'rgba(120,120,220,0.2)';
  }
}

function delayClicksAfterUserInput(element, mouseButton) {
  if (!clicksTaskActive || !timeoutID || mouseButton !== 0) { return; }

  if (element.id.includes("like-count") || element.classList.contains("post__rate") || element.classList.contains("post__rate-icon") || element.parentNode.classList.contains("post__rate-icon")) {
    clearTimeout(timeoutID);
    timeoutID = setTimeout(scheduledDislike, minClickDelay + Math.random() * (maxClickDelay - minClickDelay));
  }
}

function requestDislike(post) {
  var element = post.getElementsByClassName("post__detailpart post__rate post__rate_type_dislike")[0];
  if (element && !element.classList.contains("post__rate_disliked")) {
    clicksArray.push(element);
    if (showInTitle) { document.title = "[👎"+clicksArray.length+"] " + title; }
    if (clicksTaskActive === 0) {
      clicksTaskActive = 1;
      document.addEventListener("click", inputListener);
      timeoutID = setTimeout(scheduledDislike, minClickDelay + Math.random() * (maxClickDelay - minClickDelay));
    }
  }
}

function scheduledDislike() {
  if (displayBlock.style.display == "block") {
    timeoutID = setTimeout(scheduledDislike, 1000);
    return;
  }

  timeoutID = 0;
  var element = clicksArray.shift();
  var postClass = element.parentNode.parentNode.classList;
  if (postClass.contains("post_type_hidden")) {
    element.click();
    postClass.add("post_type_hidden");
  } else {
    element.click();
  }
  if (clicksArray.length) {
    if (showInTitle) { document.title = "[👎"+clicksArray.length+"] " + title; }
    timeoutID = setTimeout(scheduledDislike, minClickDelay + Math.random() * (maxClickDelay - minClickDelay));
  } else {
    document.title = title;
    clicksTaskActive = 0;
    document.removeEventListener("click", inputListener);
  }
}

function refreshFPage() {
  if (!refreshFrontPage) { return; }
  var targetUrl = "https://2ch." + (document.URL.includes("hk", 6) ? "hk" : "pm");
  switch (refreshFrontPage) {
    case 1:
      if (document.URL.slice(-4) != "/po/") { return; }
      targetUrl = targetUrl +"/po/";
      break;
    case 2:
      if (document.URL.slice(-6) != "/news/") { return; }
      targetUrl = targetUrl +"/news/";
      break;
    case 3:
      if (document.URL.includes("/po/", 6)) {
        targetUrl = targetUrl +"/news/";
      } else {
        targetUrl = targetUrl +"/po/";
      }
  }
  setTimeout(refresh, refreshTimer * 1000, targetUrl);
}

function refresh(link) {
  document.location = link;
}

function createMenuLink() {
  var adminbarMenu;
  if((adminbarMenu = document.getElementsByClassName("adminbar__menu desktop")).length) {
    ahSettingsLink = document.createElement("a");
    ahSettingsLink.style.float = "right";
    ahSettingsLink.innerText = "🙈 2ch autohide";
    adminbarMenu[0].insertBefore(ahSettingsLink, null);
    ahSettingsLink.onclick = buildMenu;
  }
}

function buildMenu() {
  var myBody;
  if((myBody = document.getElementsByTagName("body")).length) {
    ahSettingsLink.innerText = "🛠️ 2ch autohide";
    menuDiv = document.createElement("div");
    menuDiv.style.top = "60px";
    menuDiv.style.left = "50%";
    menuDiv.style.width = "800px";
    menuDiv.style.height = "600px";
    menuDiv.style.marginLeft = "-400px";
    menuDiv.style.display = "block";
    menuDiv.style.position = "fixed";
    menuDiv.style.boxShadow = "0 0 3px 1px black";
    menuDiv.className = "qr";
    menuDiv.innerHTML = "<center><br><span>Здесь когда-нибудь будут настройки в виде удобного меню, а пока тут только ссылка на дискорд для желающих " +
                        "помочь советом или зайти поругаться, приглашаются абсолютно все.</span><br><br>" +
                        "<a href=\"https://discord.gg/3UrnMXN\" target=\"_blank\" style=\"color: #718AD4; font-size: 40px; font-style: bold;\">Discord</a>" +
                        "<br>(откроется в новом окне)<br><br>";
    myBody[0].insertBefore(menuDiv, null);
    ahSettingsLink.onclick = destroyMenu;

    var closeMenu = document.createElement("a");
    closeMenu.innerText = "Закрыть";
    closeMenu.onclick = destroyMenu;
    menuDiv.firstChild.insertBefore(closeMenu, null);
  }
}

function destroyMenu() {
  ahSettingsLink.innerText = "🙈 2ch autohide";
  menuDiv.remove();
  ahSettingsLink.onclick = buildMenu;
}