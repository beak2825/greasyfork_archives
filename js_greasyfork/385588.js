// ==UserScript==
// @description  Автоскрытие кремлеботов и ватных дегенератов по картинкам и спеллам.
// @include      https://2ch.hk/b/*
// @include      https://2ch.pm/b/*
// @include      https://2ch.hk/po/*
// @include      https://2ch.pm/po/*
// @include      https://2ch.hk/news/*
// @include      https://2ch.pm/news/*
// @include      https://2ch.hk/ukr/*
// @include      https://2ch.pm/ukr/*
// @icon         https://2ch.hk/favicon.ico
// @name         2ch autoHide + images
// @name:ru      2ch автохайд по списку спеллов и картинок
// @namespace    poRussia
// @run-at       document-end
// @version      20190611
// @downloadURL https://update.greasyfork.org/scripts/385588/2ch%20autoHide%20%2B%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/385588/2ch%20autoHide%20%2B%20images.meta.js
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

var hideThreshold = 3;        /* Количество постов с совпадающими выражениями из массива regex, после которого
                                  будут скрыты все посты с этим ID. Не работает с постами под Heaven'ом.
                                    0 = не скрывать другие посты этого ID,
                                    3 = скрывать другие посты, если было 3 поста с совпадениями или более,
                                    10 = скрывать другие посты, если было 10 постов с совпадениями или более... */
/* Подробно: при первоначальном открытии треда проверяется число совпадений для каждого ID в треде и, если число совпадений
    больше или равно указанному значению, все уже существующие посты и все будущие посты с данным ID будут скрыты.
    Если на момент первоначального открытия треда какой-то из ID не превысил порог, но позже при (авто?)обновлении треда
    порог значений для данного ID будет превышен, то скрываться будут уже только вновь добавленные посты, старые же останутся
    в первоначальном виде, так как подразумевается, что вы их уже, вероятно, прочли, и пациент тогда ещё пытался мимикрировать
    под белого человека и изъяснялся сносно. Значение по умолчанию будет увеличено после ввода хайда по картинкам, пока для тестов 3. */

var openPostTimeout = 300;    // Задержка перед раскрытием поста, мс. Не менее 100 мс.

var highlight = 1;            /* Подсвечивать посты зелёным/красным? 1 = да, 0 = нет
                                  Добавляет цветной фон к постам на основании соотношения рейджей и лайков. */

var detectUnicode = 1;        /* Определять специальные символы юникода и наказывать за них?
                                  1 = да(ограниченный набор), 0 = нет, 2 = банить всё, кроме русского и английского. */
/*  Есть особо одарённые тролли, которые, обладая некоторыми знаниями, пытаются смутить анона, вставляя
    внутрь слов невидимые спецсимволы юникода, что мешает определению этих слов, либо заменяют русские буквы
    схожими символами из других языков. Это временно, и они перебесятся, но пока такая опция будет полезна.
    Эта дополнительная проверка позволит определять такие символы и применять к ним правила скрытия и рагу.
    Такого рода троллей единицы, поэтому при желании эту настройку можно отключить. */

var removePosts = 0;          /* Удалять полностью посты с совпадениями запрещённых слов?
                                  0 = нет, 1 = удалять только посты, 2 = удалять только треды, 3 = удалять всё
                                  Дизлайки проставляются(в зависимости от настроек) и в удалённых постах. */

var hideEmptyText = 1;        /* Скрывать посты, в которых нет никакого текста и нет картинки?
                                  (Например, сообщения со ссылкой на другое сообщение или просто пустое)
                                  0 = нет, 1 = скрывать, 2 = удалять */

var hideEmptyTextImg = 0;     /* Скрывать посты, в которых нет никакого текста и есть картинка?
                                  0 = нет,
                                  1 = скрывать,
                                  2 = ставить дизлайк,
                                  3 = скрывать и ставить дизлайк
                                  4 = удалять
                                  5 = удалять и ставить дизлайк */

var hideGreenText = 0;        /* Скрывать посты, в которых только гринтекст(цитата) и нет картинки?
                                  0 = нет,
                                  1 = скрывать,
                                  2 = ставить дизлайк,
                                  3 = скрывать и ставить дизлайк
                                  4 = удалять
                                  5 = удалять и ставить дизлайк */

var hideGreenTextImg = 0;     /* Скрывать посты, в которых только гринтекст(цитата) и есть картинка?
                                  0 = нет,
                                  1 = скрывать,
                                  2 = ставить дизлайк,
                                  3 = скрывать и ставить дизлайк
                                  4 = удалять
                                  5 = удалять и ставить дизлайк */

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
  [BOTH, BOTH, /(^|\s)[сc]?с[аaоo]в[оo]?[кk]?с/imu,                                                                      "алёшка"],
  [BOTH, BOTH, /(?:[зж]а(?:падн|океанск)|м[еу]р+иканск)\S{2,3}\s(?:бар[ие]|хозя[ие][вн])/im,                             "западный барин"],
  [BOTH, BOTH, /с?к[аео][кх]+[ео]?л/im,                                                                                  "какол"],
  [BOTH, BOTH, /киберсот/im,                                                                                             "киберсотня"],
  [BOTH, BOTH, /[кk][оo][мm][мm][иu]/imu,                                                                                "кокозиция"],
  [BOTH, BOTH, /(^|\s)[еe][лlь]ц[иu]н/imu,                                                                               "копро"],
  [BOTH, BOTH, /крохотусик/im,                                                                                           "крохотусик"],
  [BOTH, BOTH, /крякл/im,                                                                                                "крякл"],
  [BOTH, BOTH, /лехаим/im,                                                                                               "лехаим"],
  [BOTH, BOTH, /(?:[пnp][лl][юu][cсs]|[мm][ийi][hнn][уyu][сcs])\s(?:пятна[дшх]|15)/im,                                   "либераш"],
  [BOTH, BOTH, /маидаун/im,                                                                                              "майдаун"],
  [BOTH, BOTH, /(?:^|\s)ман(?:я(?![^\s.,!?])|юн|ь(?![чя])к?)/im,                                                         "маня"],
  [BOTH, BOTH, /(?:^|\s)машк/im,                                                                                         "машк"],
  [BOTH, BOTH, /перефорс/imu,                                                                                            "мивина"],
  [BOTH, BOTH, /мыкол/im,                                                                                                "мыкола"],
  [BOTH, BOTH, /н[ао]в[ао]л(?:яш|ьн(?:[еоя][^вгм]|ыш))/im,                                                               "навальнята"],
  [BOTH, BOTH, /(?:о|фб)кат[ыь]ш/im,                                                                                     "окатыш"],
  [BOTH, BOTH, /(?:ольк|лахт|бот)\S+\s(?:\S{0,3}\s)?фбк/im,                                                              "ольки из фбк"],
  [BOTH, BOTH, /[вb].{0,20}[аa].{0,20}[тt].{0,20}[нh].*[иu].*[кk]/imu,                                                   "насральный"],
  [BOTH, BOTH, /[рp]ы[нh][оoь]?[кk]/imu,                                                                                 "пиндос"],
  [BOTH, BOTH, /под\s?кроватью/im,                                                                                       "под кроватью"],
  [BOTH, BOTH, /чистые/imu,                                                                                              "понадусёровый"],
  [BOTH, BOTH, /(?:^|\s)порос\S/im,                                                                                      "порось"],
  [BOTH, BOTH, /порохо[^вм]/im,                                                                                          "порохобот"],
  [BOTH, BOTH, /пятач?о?к/im,                                                                                            "пятак"],
  [BOTH, BOTH, /(?:^|[^п])р[ао]гул/im,                                                                                   "рагуль"],
  [BOTH, BOTH, /реда\S{4,7}\s(?:\S+\s)?соц\S*?\s?сет/im,                                                                 "редактор"],
  [BOTH, BOTH, /сало(?:ед|питек)/im,                                                                                     "салоед"],
  [BOTH, BOTH, /св[иы]дом/im,                                                                                            "свидомый"],
  [BOTH, BOTH, /\Sсв[иы]н|(?:^|\s)св[иы]н(?!ин|ь|оф|омат|с[кт]|е?[йц]|[тч]и|(?:ая|о(?:го|е|й|му)|ую|ым)([\s.,!?]|$))/im, "свинявый"],
  [BOTH, BOTH, /с[иы]ськ\S{4,}/im,                                                                                       "сиськобот"],
  [BOTH, BOTH, /(?:[оo]л[ьb](?:[кk]|[гg][ийi][нhn])|л[аa][хx][тt]|пригожин(?:ец|ц))/im,                                  "сисян"],
  [BOTH, BOTH, /срын[оь]?[кч]/im,                                                                                        "срыночек"],
  [BOTH, BOTH, /сшашк/im,                                                                                                "сшашка"],
  [BOTH, BOTH, /[рpr][аa](?:[шх]|sh)[аaкk]/im,                                                                           "тарас"],
  [BOTH, BOTH, /укроп/im,                                                                                                "укроп"],
  [BOTH, BOTH, /у(?:[сх]р|рк)(?:[аоу]и|уа)н/im,                                                                          "усраина"],
  [BOTH, BOTH, /х[аио]х[ио]?л(?!ом(?:[аеуы]|ой)[.,?!]?(?:\s|$))/im,                                                      "хахлы"],
  [BOTH, BOTH, /(?:^|\s)хранц/im,                                                                                        "хранция"],
  [BOTH, BOTH, /хр(?:ю(?!че)|як)/im,                                                                                     "хрю"],
  [BOTH, BOTH, /чубат/im,                                                                                                "чубатый"],
  [BOTH, BOTH, /шваин/im,                                                                                                "швайн"],
  [BOTH, BOTH, /(?:^|\s)шв[яи]т/im,                                                                                      "швятая"],
  [BOTH, BOTH, /шпрот/im,                                                                                                "шпрот"],
  [HEAD, BOTH, /шульман/im,                                                                                              "(((Шульман)))"],
  [HEAD, HIDE, /Месяцеслов/im,                                                                                           "Месяцеслов"],
  [HEAD, BOTH, /к.{0,5}р.{0,5}ы.{0,5}м.{0,5}и.*н.*о.*в.*о.*р.*о.*с.*и.*я/im,                                             "крымодебилы"],
  [HEAD, BOTH, /к(?=[рыминовся\s]{16,22})(?:р?ы?м?\s?н?о?в?о?р?о?с*и?я?){16,22}/im,                                      "крымодебилы"]
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
var reChrStrip = new RegExp('[^\\u000a\\u002f\\u0041-\\u005a\\u0061-\\u007a\\u00c0-\\u017f\\u03ff-\\u0460 \\d]', 'g');
var hideTotalSpan1, hideTotalSpan2;
unicodeFixes();

var hiddenIdsArray = [];

if (document.URL.slice(-1) =="/") {
  hideOpPosts();
  hidePosts();

  if (refreshFrontPage) { refreshFPage(); }

  if (pager.style.display === "") { return; }

  var callback = function(mutationsList, observer) {
    for(var m = 0; m < mutationsList.length; m++) {
      var man = mutationsList[m].addedNodes;
      if (!man.length || man[0].tagName != "DIV" || man[0].className != "thread") { continue; }

      hideOpPosts(man[0].firstChild.firstChild);
      for (var i = 1; i < man[0].childNodes.length; i++) {
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
    }
  };

  var observer = new MutationObserver(callback);
  observer.observe(document.getElementsByClassName('thread')[0], { attributes: false, childList: true, subtree: false });
}

function insertHideTotalSpans() {
  hideTotalSpan1 = document.createElement("span");
  hideTotalSpan1.className = "post-hidden";
  hideTotalSpan1.style.cursor = "pointer";
  hideTotalSpan1.title = "Счётчик автоскрытых постов. Скрипт выполнялся " + String(performance.now() - perfTimer) + " мс.\n\n  Примечание: если у вас напердолен " +
                         "браузер для анонимности,\n  или вкладка загружалась в фоне, то указанное здесь значение\n  производительности может быть неверным.";
  hideTotalSpan1.textContent = "?? "+ String(hiddenCount) + " ";
  var threadNavStats = document.getElementsByClassName("thread-nav__stats");
  threadNavStats[0].insertBefore(hideTotalSpan1, threadNavStats[0].firstChild);
  hideTotalSpan2 = hideTotalSpan1.cloneNode(true);
  threadNavStats[1].insertBefore(hideTotalSpan2, threadNavStats[1].firstChild);
}

function hideOpPosts(node) {
  var opPost,
      msgText,
      opPostsCollection = [];

  if (node) { opPostsCollection.push(node); }
  else { opPostsCollection = document.getElementsByClassName("post post_type_oppost"); }

  for (var i = 0; i < opPostsCollection.length; i++) {
    opPost = opPostsCollection[i];

    if (opPost.parentNode.parentNode.style.display == "none") { continue; }

    var regexResult = regexCheck(opPost, 1);
    if (regexResult > -1) {
      if (regexArray[regexResult][1] < 3) { requestDislike(opPost); }
      if (regexArray[regexResult][1] > 1) {
        if (removePosts < 2) {
          var hideDiv = document.createElement("div");
          hideDiv.className = "thread thread_hidden";
          msgText = opPost.getElementsByClassName("post__message post__message_op")[0].innerText.trim();
          if (msgText.length > 800) { hideDiv.title = msgText.substring(0, 800) + "..."; }  //TODO: fix this
          else { hideDiv.title = msgText; }

          var divPostDetailsSpans = opPost.getElementsByClassName("post__detailpart");
          hideDiv.innerHTML = "Скрытый тред (" + opPost.getElementsByClassName("post__title")[0].textContent.trim() + ") " +
          divPostDetailsSpans[divPostDetailsSpans.length - 3].innerHTML + divPostDetailsSpans[divPostDetailsSpans.length - 2].innerHTML +
          " • hide: " + regexArray[regexResult][3] + " " + divPostDetailsSpans[divPostDetailsSpans.length - 1].innerHTML;
          opPost.parentNode.parentNode.parentNode.insertBefore(hideDiv, opPost.parentNode.parentNode);
        }
        opPost.parentNode.parentNode.style.display = "none";
      }
    }
  }
}

function hidePosts(node) {
  var post,
      postsCollection = [];

  if (node) { postsCollection.push(node); }
  else { postsCollection = document.getElementsByClassName("post post_type_reply"); }

  for (var i = 0; i < postsCollection.length; i++) {
    post = postsCollection[i];
    if (post.classList.contains("post_type_hidden")) { continue; }

    highlightPosts(post);

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
        countTrollPosts(post);
        hiddenCount++;
        continue;
      }
    }
    greentextCheck(post);
  }

  hideTrollPosts(postsCollection);

  if (node && hideTotalSpan1) {
    hideTotalSpan1.textContent = "?? "+ String(hiddenCount) + " ";
    hideTotalSpan2.textContent = "?? "+ String(hiddenCount) + " ";
  }
}

function countTrollPosts(post) {
  if (!hideThreshold) { return; }

  var id = getId(post);
  if (!id) { return; }

  for (var i = 0; i < hiddenIdsArray.length; i++) {
    if (hiddenIdsArray[i][0] == id) {
      hiddenIdsArray[i][1]++;
      break;
    }
  }
  if (i == hiddenIdsArray.length) {
    hiddenIdsArray.push([id, 1]);
  }
}

function hideTrollPosts(postsCollection) {
  if (!hideThreshold) { return; }

  for (var p = 0; p < postsCollection.length; p++) {
    var post = postsCollection[p];
    if (post.classList.contains("post_type_hidden")) { continue; }
    var id = getId(post);
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
  if ((id = post.getElementsByClassName("post__anon")).length) {
    if ((id = id[0].getElementsByTagName("span")).length) {
      return id[0].id.slice(7);
    }
  }
  return undefined;
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
    if (this.id != "clicked") {
      hideSpanIcon.textContent = "??";
      hideSpanIcon.style.opacity = "0.7";
      openPost(this, post, hideSpanIcon);
      this.id = "clicked";
    } else {
      hideSpanIcon.textContent = "?";
      hideSpanIcon.style.opacity = "0.7";
      this.id = "close";
    }
  };
  hideSpan.onmouseenter = function() {
    if (this.id != "clicked") {
      this.id = setTimeout(openPost, (openPostTimeout < 100 ? 100 : openPostTimeout), this, post, hideSpanIcon);
    }
  };
  hideSpan.onmouseleave = function() {
    if (this.id && this.id != "clicked") {
      clearTimeout(this.id);
      this.id = "";
      if (!post.classList.contains("post_type_hidden")) {
        hideSpanIcon.textContent = "";
        post.classList.add("post_type_hidden");
      }
    }
  };

  post.getElementsByClassName("post__details")[0].insertBefore(hideSpan, post.getElementsByClassName("turnmeoff")[1]);
  post.getElementsByClassName("post__details")[0].insertBefore(hideSpanIcon, post.getElementsByClassName("turnmeoff")[1]);
}

function openPost(elem, post, icon) {
  if (elem.id != "clicked" && post.classList.contains("post_type_hidden")) {
    icon.textContent = "??";
    icon.style.opacity = "1.0";
    post.classList.remove("post_type_hidden");
  }
}

function greentextCheck(post) {
  if (!hideEmptyText && ! hideEmptyTextImg && !hideGreenText && !hideGreenTextImg) { return; }

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
        return;
      case 2:
        post.style.display = "none";
        return;
    }
  }

  if (hideEmptyTextImg && hasImages && !len) {
    if (hideEmptyTextImg == 2) {
      requestDislike(post);
      return;
    } else if (hideEmptyTextImg == 3 || hideEmptyTextImg == 5) {
      requestDislike(post);
    }
    hiddenCount++;
    if (hideEmptyTextImg == 1 || hideEmptyTextImg == 3) {
      insertHideSpan(post, "картинка без текста");
      post.classList.add("post_type_hidden");
      return;
    }
    if (hideEmptyTextImg == 4 || hideEmptyTextImg == 5) {
      post.style.display = "none";
      return;
    }
  }

  msgText = msgText.replace(/<span class=\"unkfunc\">.*?<\/span>/g, "");
  if (msgText.length) { return; }

  if (hideGreenText && !hasImages) {
    if (hideGreenText == 2) {
      requestDislike(post);
      return;
    } else if (hideGreenText == 3 || hideGreenText == 5) {
      requestDislike(post);
    }
    hiddenCount++;
    if (hideGreenText == 1 || hideGreenText == 3) {
      insertHideSpan(post, "гринтекст");
      post.classList.add("post_type_hidden");
      return;
    }
    if (hideGreenText == 4 || hideGreenText == 5) {
      post.style.display = "none";
      return;
    }
  }

  if (hideGreenTextImg && hasImages) {
    if (hideGreenTextImg == 2) {
      requestDislike(post);
      return;
    } else if (hideGreenTextImg == 3 || hideGreenTextImg == 5) {
      requestDislike(post);
    }
    hiddenCount++;
    if (hideGreenTextImg == 1 || hideGreenTextImg == 3) {
      insertHideSpan(post, "гринтекст с картинкой");
      post.classList.add("post_type_hidden");
      return;
    }
    if (hideGreenTextImg == 4 || hideGreenTextImg == 5) {
      post.style.display = "none";
      return;
    }
  }
}

function regexCheck(post, isOpPost) {
  var postTitle;
  var postMsg;
  var postTitleText = "";
  var found = false;
  var msgText = "";

  if ((postTitle = post.getElementsByClassName("post__title")).length && (postTitleText = postTitle[0].textContent.trim())) {
    if (detectUnicode) {
      if (regexArray[regexArray.length - 1][0] > 1 && regexArray[regexArray.length - 1][2].test(postTitleText)) { return regexArray.length - 1; }
      postTitleText = postTitleText.replace(reChrStrip, "");
    }
    for (var i = 0; i < regexArray.length - 1; i++) {
      if (regexArray[i][0] > 1 && regexArray[i][2].test(postTitleText)) { return i; }
    }
  }

  if ((postMsg = post.getElementsByClassName(isOpPost ? "post__message post__message_op" : "post__message")).length && (msgText = postMsg[0].innerText.trim())) {
    if (detectUnicode) {
      if (regexArray[regexArray.length - 1][0] < 3 && regexArray[regexArray.length - 1][2].test(msgText)) {
        found = true;
        if (!ignoreQuotes) { return regexArray.length - 1; }
      }
      msgText = msgText.replace(reChrStrip, "");
    }
    if (!found) {
      for (var j = 0; j < regexArray.length - 1; j++) {
        if (regexArray[j][0] < 3 && regexArray[j][2].test(msgText)) {
          found = true;
          if (!ignoreQuotes) { return j; }
          break;
        }
      }
    }
    if (found && ignoreQuotes) { //double check posts
      msgText = postMsg[0].innerHTML;
      msgText = msgText.replace(/<a href=.*?<\/a>|<\/?strong>|<\/?em>|<\/?su[bp]>|<span class="[suo](?:poiler)?">/g, "");
      msgText = msgText.replace(/<br>/g, " ");

      var splitStart = -1;
      while ((splitStart = msgText.indexOf("<span class=\"unkfunc\">")) > -1 ) {
        msgText = msgText.substring(0, splitStart) + msgText.substring(msgText.indexOf("</span>", splitStart + 22) + 7);
      }
      msgText = msgText.replace(/<\/span>/g, "");
      if (detectUnicode) {
        if (regexArray[regexArray.length - 1][0] < 3 && regexArray[regexArray.length - 1][2].test(msgText)) { return regexArray.length - 1; }
        msgText = msgText.replace(reChrStrip, "");
      }
      for (var k = 0; k < regexArray.length - 1; k++) {
        if (regexArray[k][0] < 3 && regexArray[k][2].test(msgText)) { return k; }
      }
    }
  }
  return -1;
}

function unicodeFixes() {
  var unicodeCharsArray = [
    ["а", "аa",   "аaaaaaaa?aaa"],
    ["б", "бb6",  "бb6"],
    ["в", "вb",   "вb"],
    ["г", "гr",   "гrѓґrrr"],
    ["д", "дdg",  "дdg?ddgggg"],
    ["е", "еёe",  "еёe?єeeeeeeeee"],
    ["ж", "жj",   "жјj"],
    ["з", "з3",   "з3"],
    ["и", "ийiu", "иuiйії?iiiiuuuuiiii?uuuuuu"],
    ["к", "кk",   "кkќk?"],
    ["л", "л",    "лљ"],
    ["м", "мm",   "мm"],
    ["н", "нh",   "нhњhh"],
    ["о", "оo0",  "оo0ooooooooo"],
    ["п", "пn",   "пnnnnn??"],
    ["р", "рp",   "рp?"],
    ["с", "сc",   "сcccccc"],
    ["т", "тt",   "тtttt"],
    ["у", "уy",   "уyўyyy"],
    ["х", "хx",   "хx"],
    ["ч", "ч4",   "ч4"],
    ["ш", "шщ",   "шщ"],
    ["щ", "шщ",   "шщ"],
    ["ъ", "ъьb",  "ъьb"],
    ["ь", "ъьb",  "ъьb"],
    ["э", "э",    "эє"]
  ];

  for (var r = 0; r < regexArray.length; r++) {
    var st = String(regexArray[r][2]).slice(1, -3);
    for (var charIndex = st.length - 1; charIndex >= 0; charIndex--) {
      for (var u = 0; u < unicodeCharsArray.length; u++) {
        if(st[charIndex].toLowerCase() == unicodeCharsArray[u][0]) {
          for (var v = charIndex - 1; v >= 0; v--) {
            if (st[v] == "[" || st[v] == "]" || v == 0) {
              if(st[v] == "[") {
                st = st.substring(0, charIndex) + unicodeCharsArray[u][detectUnicode > 0 ? 2 : 1] + st.substring(charIndex + 1);
              }
              else {
                st = st.substring(0, charIndex) + "[" + unicodeCharsArray[u][detectUnicode > 0 ? 2 : 1] + "]" + st.substring(charIndex + 1);
              }
              break;
            }
          }
          if (charIndex == 0) { st = "[" + unicodeCharsArray[u][detectUnicode > 0 ? 2 : 1] + "]" + st.substring(1); }
          break;
        }
      }
    }
    regexArray[r][2] = new RegExp(st, "im");
  }

  if (detectUnicode == 1) {
    regexArray.push([BOTH, BOTH, /[\u0080-\u00a0\u00ad\u0180-\u036F\u0460-\u048f\u0492-\u04ff\u2000-\u200f\u2028-\u2037\u205f-\u206f]/, "unicode"]);
  } else if (detectUnicode == 2) {
    regexArray.push([BOTH, BOTH, /[\u0080-\u00a0\u00ad\u0180-\u03ff\u0460-\u200f\u2028-\u2037\u205f-\u218f\u2460-\u24ff\u2c60-\uffff]/, "unicode"]);
  }
}

function highlightPosts(node) {
  if (!highlight) { return; }

  var like,
      dislike,
      likeSpan,
      dislikeSpan,
      likeCount,
      dislikeCount,
      r,
      c = 120;

  if ((like = node.getElementsByClassName("post__detailpart post__rate post__rate_type_like")[0]) && (likeSpan = like.children[1])) {
    likeCount = parseInt(likeSpan.innerHTML, 10);
  }
  if ((dislike = node.getElementsByClassName("post__detailpart post__rate post__rate_type_dislike")[0]) && (dislikeSpan = dislike.children[1])) {
    dislikeCount = parseInt(dislikeSpan.innerHTML, 10);
  }
  if (!likeCount) { likeCount = 1; }
  if (!dislikeCount) { dislikeCount = 1; }

  r = likeCount / dislikeCount;
  if (r > 1.33) {
    node.style.backgroundColor = 'rgba('+String(c)+',' + String(Math.min(c+r*13,250)) + ','+String(c)+',0.2)';
  } else if (r < 0.75) {
    node.style.backgroundColor = 'rgba(' + String(Math.min(c+1/r*13,250)) + ','+String(c)+','+String(c)+',0.2)';
  } else if (likeCount + dislikeCount > 30) {
    node.style.backgroundColor = 'rgba('+String(c)+','+String(c)+','+String(c+100)+',0.2)';
  }
}

function delayClicksAfterUserInput(element, mouseButton) {
  if (!clicksTaskActive || !timeoutID || mouseButton !== 0) { return; }

  if (element.id.includes("like-count") || element.classList.contains("post__rate") || element.parentNode.parentNode.classList.contains("post__rate")) {
    clearTimeout(timeoutID);
    timeoutID = setTimeout(scheduledDislike, minClickDelay + Math.random() * (maxClickDelay - minClickDelay));
  }
}

function requestDislike(post) {
  var element = post.getElementsByClassName("post__detailpart post__rate post__rate_type_dislike")[0];
  if (element && !element.classList.contains("post__rate_disliked")) {
    clicksArray.push(element);
    if (showInTitle) { document.title = "[??"+clicksArray.length+"] " + title; }
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
    if (showInTitle) { document.title = "[??"+clicksArray.length+"] " + title; }
    timeoutID = setTimeout(scheduledDislike, minClickDelay + Math.random() * (maxClickDelay - minClickDelay));
  } else {
    document.title = title;
    clicksTaskActive = 0;
    document.removeEventListener("click", inputListener);
  }
}

function refreshFPage() {
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