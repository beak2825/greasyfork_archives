// ==UserScript==
// @description  Автоскрытие кремлеботов и ватных дегенератов.
// @include      https://2ch.hk/b/*
// @include      https://2ch.pm/b/*
// @include      https://2ch.hk/po/*
// @include      https://2ch.pm/po/*
// @include      https://2ch.hk/news/*
// @include      https://2ch.pm/news/*
// @icon         https://2ch.hk/favicon.ico
// @name         2ch autoHide (img hide feature request)
// @name:ru      2ch автохайд по списку спеллов
// @namespace    poRussia
// @run-at       document-end
// @require      https://greasyfork.org/scripts/381381-2ch-autohide-imagecomparator-bytecode/code/2ch%20autoHide%20imageComparator%20bytecode.js
// @version      2019041002
// @grant        GM.xmlHttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM_xmlHttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/381066/2ch%20autoHide%20%28img%20hide%20feature%20request%29.user.js
// @updateURL https://update.greasyfork.org/scripts/381066/2ch%20autoHide%20%28img%20hide%20feature%20request%29.meta.js
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
var minClickDelay = 5500;    // минимальная задержка между кликами, мс
var maxClickDelay = 7000;    // максимальная задержка между кликами, мс

var showInTitle = 1;         // Показывать счётчик дизлайков в заголовке вкладки браузера? 1 = да, 0 = нет

var ignoreQuotes = 1;        // Игнорировать совпадения выражений в >цитируемом тексте? 1 = да, 0 = нет
/*  ignoreQuotes = 0 проверяет чистый текст, поэтому будет работать быстрее и проще, но не позволит
      игнорировать совпадения регулярных выражений в цитируемом тексте и будет скрывать посты, в которых
      наивный анон цитирует животных и ботов, чтобы им ответить.
    ignoreQuotes = 1 проверяет текст с тегами, поэтому не будет ставить RAGE и скрывать посты из-за цитат,
      также конструкции типа св[b][/b]инья будут корректно определены, но этот метод работает чуть медленнее
      (разница составляет миллисекунды, но на некрокомпах может быть заметно).
    Рекомендуется использовать ignoreQuotes = 1. */

var openPostTimeout = 300;   // Задержка перед раскрытием поста, мс. Не менее 100 мс.
var popupChars = 0;          /* Количество символов во всплывающей подсказке над скрытым постом.
                                  Наведи на слово 'hide', чтобы увидеть подсказку.
                                  Если указать 0, то при наведении мыши на "hide" пост будет раскрываться. */

var highlight = 1;           /* Подсвечивать посты зелёным/красным? 1 = да, 0 = нет
                                  Добавляет цветной фон к постам на основании соотношения рейджей и лайков. */

var detectUnicode = 1;       /* Определять специальные символы юникода и наказывать за них?
                                  1 = да(ограниченный набор), 0 = нет, 2 = банить всё, кроме русского и английского. */
/*  Есть особо одарённые тролли, которые, обладая некоторыми знаниями, пытаются смутить анона, вставляя
      внутрь слов невидимые спецсимволы юникода, что мешает определению этих слов, либо заменяют русские буквы
      схожими символами из других языков. Это временно, и они перебесятся, но пока такая опция будет полезна.
    Эта дополнительная проверка позволит определять такие символы и применять к ним правила скрытия и рагу.
    Такого рода троллей единицы, поэтому при желании эту настройку можно отключить. На данный момент это
      экспериментальная опция, которая тщательно не тестировалась. */

var removePosts = 0;         /* Удалять полностью посты с совпадениями запрещённых слов?
                                  0 = нет, 1 = удалять только посты, 2 = удалять только треды, 3 = удалять всё
                                  Дизлайки проставляются(в зависимости от настроек) и в удалённых постах. */

var hideEmptyText = 1;       /* Скрывать посты, в которых нет никакого текста и нет картинки?
                                  (Например, сообщения со ссылкой на другое сообщение или просто пустое)
                                  0 = нет, 1 = скрывать, 2 = удалять */

var hideEmptyTextImg = 0;    /* Скрывать посты, в которых нет никакого текста и есть картинка?
                                  0 = нет,
                                  1 = скрывать,
                                  2 = ставить дизлайк,
                                  3 = скрывать и ставить дизлайк
                                  4 = удалять
                                  5 = удалять и ставить дизлайк */

var hideGreenText = 0;       /* Скрывать посты, в которых только гринтекст(цитата) и нет картинки?
                                  0 = нет,
                                  1 = скрывать,
                                  2 = ставить дизлайк,
                                  3 = скрывать и ставить дизлайк
                                  4 = удалять
                                  5 = удалять и ставить дизлайк */

var hideGreenTextImg = 0;    /* Скрывать посты, в которых только гринтекст(цитата) и есть картинка?
                                  0 = нет,
                                  1 = скрывать,
                                  2 = ставить дизлайк,
                                  3 = скрывать и ставить дизлайк
                                  4 = удалять
                                  5 = удалять и ставить дизлайк */

var showHideButton = true;   // Показывать кнопку hide возле картинок

var threshold_to_hide = 5;   // Количество скрытых постов, при превышении которого их автор маркируется как лахтобот
var hideOnThreshold = 3;     /* Скрывать посты лахтоботов, которые определяются настройкой выше
														    0 = нет
														    1 = скрывать
                                2 = ставить дизлайк
                                3 = скрывать и ставить дизлайк */

var refreshTimer = 30;       // Количество секунд, через которые нулевая страница автообновляется.
var refreshFrontPage = 0;    /* Обновлять нулевую и отправлять дизлайки раз в refreshTimer секунд?
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

  [где искать, что делать, /регулярное выражение/im,                                                                                 "описание"]*/
var regexArray = [
  [BOTH, BOTH, /(?:^|\s)[aaoo0]?л[еeё]ш(?:[еe][нh][ьb])?[кk][аaуyиеe]/im,                                                                        "алёшка"],
  [BOTH, BOTH, /[з3][аa][пn][аa][дg][нh]\S{2,3}\s[б6][аa][рp][иiuеe]/im,                                                                         "западный барин"],
  [BOTH, BOTH, /[сc]?[кk][аaеeоo0][кk][хx]?[еeёоo0]?л/im,                                                                                        "какол"],
  [BOTH, BOTH, /[кk][ийiu][б6][еe][pр][сc][оo0][тt]/im,                                                                                          "киберсотня"],
  [BOTH, BOTH, /[кпkn][оo0][кпkn][оo0][з3][ийiu]ц/im,                                                                                            "кокозиция"],
  [BOTH, BOTH, /(?:^|\s)[кk][оo0][пn][рp][оo0](?!т|сл)/im,                                                                                       "копро"],
  [BOTH, BOTH, /[кk][рp][оo0][хx][оo0][тt][уy][сc][иiu][кk]/im,                                                                                  "крохотусик"],
  [BOTH, BOTH, /[кk][рp]я[кk]л/im,                                                                                                               "крякл"],
  [BOTH, BOTH, /л[еe][хx][аa][ийu][мm]/im,                                                                                                       "лехаим"],
  [BOTH, BOTH, /л[еeиuя][б6][еeийuуyя][рp]д?(?:[^аин]|а[^л]|ал(?!ьн))/im,                                                                        "либераш"],
  [BOTH, BOTH, /[мm][аa][ийiu][дg][аa][уy][нh]/im,                                                                                               "майдаун"],
  [BOTH, BOTH, /(?:^|\s)[мm][аa][нh](?:я(?![^\s.,!?])|ю[нh]|[ьb](?![чя])[кk]?)/im,                                                               "маня"],
  [BOTH, BOTH, /(?:^|\s)[мm][аa]ш[кk]/im,                                                                                                        "машк"],
  [BOTH, BOTH, /[мm][ийui][вb][ийui][нh]\S/im,                                                                                                   "мивина"],
  [BOTH, BOTH, /[нh][аaоo0][вb][аaоo0]л(?:яш|[ьb][нh](?:[еёeоoя][^вгм]))/im,                                                                     "навальнята"],
  [BOTH, BOTH, /(?:[оo0]|ф[б6][кk])[кk][аa][тt][ыьb]ш/im,                                                                                        "окатыш"],
  [BOTH, BOTH, /(?:[оo]л[ьb][кk]|л[аa][хx][тt]|[б6][оo0][тt])\S+\s(?:\S{0,3}\s)?ф[б6][кk]/im,                                                    "ольки из фбк"],
  [BOTH, BOTH, /([нh][аa][сc][рp][аa]|(?:[xх][уy]|[пn]ы[нh])я|(?:^|\s)[оo0][вbнh][аa])л[ьb][нh]/im,                                              "насральный"],
  [BOTH, BOTH, /[пn][еeийu][нh][дg][оo0][сc]/im,                                                                                                 "пиндос"],
  [BOTH, BOTH, /[пn][оo0][дg]\s[кk][рp][оo0][вb][аa][тt][ьb]ю/im,                                                                                "под кроватью"],
  [BOTH, BOTH, /[пn][оo0][нh][аa][дg][уy][сc]/im,                                                                                                "понадусёровый"],
  [BOTH, BOTH, /(?:^|\s)[пn][оo0][рp][оo0][сc]\S/im,                                                                                             "порось"],
  [BOTH, BOTH, /[пn][оo0][рp][оo0][хx][оo0][^вм]/im,                                                                                             "порохобот"],
  [BOTH, BOTH, /[пn]я[тt][аa](?:ч[оo0])?[кk]/im,                                                                                                 "пятак"],
  [BOTH, BOTH, /(?:^|[^п])[рp][аaоo]г[уy]л/im,                                                                                                   "рагуль"],
  [BOTH, BOTH, /[рp][еe][дg][аa]\S{4,7}\s(?:\S+\s)?[сc][оo0]ц\S*?\s?[сc][еe][тt]/im,                                                             "редактор"],
  [BOTH, BOTH, /[сc][вb][ийuыi][дg][оo0][мm]/im,                                                                                                 "свидомый"],
  [BOTH, BOTH, /\S[сc][вb][ийuыi][нh]|(?:^|\s)[сc][вb][ийuыi][нh](?!ин|ь|оф|омат|с[кт]|е?[йц]|[тч]и|(?:ая|о(?:го|е|й|му)|ую|ым)([\s.,!?]|$))/im, "свинявый"],
  [BOTH, BOTH, /[сc][иuыi][сc][ьb][кk]\S{4,}/im,                                                                                                 "сиськобот"],
  [BOTH, BOTH, /(?:^|\s|[пn][оo0][дg])[сc][ийu][сc]+([яийiu](л[ьb]|[тt])?[нh]+(?!д))/im,                                                         "сисян"],
  [BOTH, BOTH, /[сc][рp]ы[нh][оo0ь]?[кkч]/im,                                                                                                    "срыночек"],
  [BOTH, BOTH, /сшашк/im,                                                                                                                        "сшашка"],
  [BOTH, BOTH, /(?:^|\s)[тt][аa][рp][аa][сc]\S*?(?!\sшев)/im,                                                                                    "тарас"],
  [BOTH, BOTH, /[уy][кk][рp][оo0][пn]/im,                                                                                                        "укроп"],
  [BOTH, BOTH, /[уy](?:[сc][рp]|[рp][кk])(?:[аaоo0уy][иiu]|[уy][аa])[нh]/im,                                                                     "усраина"],
  [BOTH, BOTH, /[хx][аийоao0ui][хx][ийuоo0i]?л/im,                                                                                               "хахлы"],
  [BOTH, BOTH, /[хx][рp](?:[ю](?!че)|я[кk])/im,                                                                                                  "хрю"],
  [BOTH, BOTH, /ч[уy][б6][аa][тt]/im,                                                                                                            "чубатый"],
  [BOTH, BOTH, /ш[вb][аa][йийiu][нh]/im,                                                                                                         "швайн"],
  [BOTH, BOTH, /(?:^|\s)[шщ][вb][яи][тt]/im,                                                                                                     "швятая"],
  [BOTH, BOTH, /ш[пn][рp][оo][тt]/im,                                                                                                            "шпрот"],
  [HEAD, BOTH, /Шульман/im,                                                                                                                      "(((Шульман)))"],
  [HEAD, HIDE, /Месяцеслов/im,                                                                                                                   "Месяцеслов"],
  [HEAD, BOTH, /[кk].{0,5}[рp].{0,5}ы.{0,5}[мm].{0,5}[ийu].*[нh].*[оo].*[вb].*[оo].*[рp].*[оo].*[сc].*[ийu].*я/im,                               "крымодебилы"],
  [HEAD, BOTH, /(?=[кkрpымmнhоoвbсcийuiя\s]{17,23})(?:[кk]?[рp]?ы?[мm]?\s?[нh]?[оo]?[вb]?[оo]?[рp]?[оo]?[сc]*[ийui]?я?){17,23}/im,               "крымодебилы"]
];
// ============[КОНЕЦ  НАСТРОЕК]============

var gm = {};

try {
  if (typeof GM.getValue != "undefined") {
    gm.getValue = GM.getValue;
  } else throw 0;
  if (typeof GM.setValue != "undefined") {
    gm.setValue = GM.setValue;
  } else throw 0;
  if (typeof GM.xmlHttpRequest != "undefined") {
    gm.xmlHttpRequest = GM.xmlHttpRequest;
  } else throw 0;
} catch(e) {
  try {
    if (typeof GM_getValue != "undefined") {
      gm.getValue = GM_getValue;
    } else throw 0;
    if (typeof GM_setValue != "undefined") {
      gm.setValue = GM_setValue;
    } else throw 0;
    if (typeof GM_xmlHttpRequest != "undefined") {
      gm.xmlHttpRequest = GM_xmlHttpRequest;
    } else throw 0;
	} catch(e) {
    console.log("Install GreaseMonkey");
	}
}

var clicksArray = [];
var clicksTaskActive = 0;
var timeoutID;

var displayBlock = document.getElementById("fullscreen-container");
var title = document.title;
var pager = document.getElementsByClassName("pager")[0];
var inputListener = function() { delayClicksAfterUserInput(event.target, event.button); };
var reChrStrip = new RegExp('[^\\u000a\\u002f\\u0041-\\u005a\\u0061-\\u007a\\u0410-\\u044f \\dёЁ]', 'g');

var Base64Binary={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",decodeArrayBuffer:function(r){var e=r.length/4*3,t=new ArrayBuffer(e);return this.decode(r,t),t},removePaddingChars:function(r){return 64==this._keyStr.indexOf(r.charAt(r.length-1))?r.substring(0,r.length-1):r},decode:function(r,e){r=this.removePaddingChars(r),r=this.removePaddingChars(r);var t,n,a,i,h,d,s,f=parseInt(r.length/4*3,10),c=0,y=0;for(t=e?new Uint8Array(e):new Uint8Array(f),r=r.replace(/[^A-Za-z0-9\+\/\=]/g,""),c=0;c<f;c+=3)n=this._keyStr.indexOf(r.charAt(y++))<<2|(h=this._keyStr.indexOf(r.charAt(y++)))>>4,a=(15&h)<<4|(d=this._keyStr.indexOf(r.charAt(y++)))>>2,i=(3&d)<<6|(s=this._keyStr.indexOf(r.charAt(y++))),t[c]=n,64!=d&&(t[c+1]=a),64!=s&&(t[c+2]=i);return t}};

function ImageComparator() {
  var membuf;
  var memory_ptr;
  var db_ptr;
  var buffer_ptr = 102400; // 100K
  var buffer_size = 409600; // 400K
  var lock = false;
  function get_pixels(image) {
    var canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    var context = canvas.getContext("2d");
    context.drawImage(image, 0, 0);
    return context.getImageData(0, 0, canvas.width, canvas.height).data;
  }
  return WebAssembly.instantiate(imageComparatorBytecode).then(function(wasm) {
    membuf = new Uint8Array(wasm.instance.exports.memory.buffer);
    wasm.instance.exports.set_ptrs(buffer_ptr, buffer_ptr + buffer_size);
    buffer_ptr = wasm.instance.exports.get_buffer_ptr();
    db_ptr = wasm.instance.exports.get_db_ptr();
    memory_ptr = wasm.instance.exports.get_memory_ptr();
    return wasm.instance.exports;
  }).then(function(exports) {
    return {
      compare: function(image) {
        var data = get_pixels(image);
        membuf.set(data, buffer_ptr);
        var rate = exports.find_buffer_in_db(image.width, image.height);
        var reader = new DataView(membuf.buffer);
        var width = reader.getUint32(memory_ptr, true);
        var height = reader.getUint32(memory_ptr + 4, true);
        var data = membuf.subarray(memory_ptr, memory_ptr + width * height + 8);
        var hash = btoa(String.fromCharCode.apply(null, data));
        image.setAttribute("alt", rate);
        return [hash, rate != -1 && rate < 10];
      },
      add_to_db: function(b64) {
        var data = new Uint8Array(Base64Binary.decode(b64));
        membuf.set(data, exports.get_db_write_ptr());
        exports.on_write_to_db(data.length);
      }
    };
  });
}

var hideTotalSpan;
var hiddenCount;
var imageComparator;
var imagesComparatorArray = [];
var last_update = 0;
var observer;
var hidden_ids = {};

function setImagesComparatorArray(arr) {
  imagesComparatorArray = arr;
  var script = document.createElement("script");
  script.innerHTML = "var imagesComparatorArray = " + arr.toSource();
  document.getElementsByTagName("head")[0].appendChild(script);
}

function setLastUpdate(date) {
  last_update = date;
  var script = document.createElement("script");
  script.innerHTML = "var last_update = " + date;
  document.getElementsByTagName("head")[0].appendChild(script);
}

window.onload = function() {
  var head = document.getElementsByTagName("head")[0];
  var button_onload = document.createElement("button");
  button_onload.id = "images_onload";
  button_onload.visible = "none";
  var button_load = document.createElement("button");
  button_load.id = "autohide_loadimgs";
  button_load.visible = "none";
  button_load.onclick = function() {
    gm.xmlHttpRequest({
      method: "GET",
      url: "https://greasyfork.org/scripts/381382-2ch-autohide-images-spam-list/code/2ch%20autoHide%20images%20spam-list.js",
      onload: function(response) {
      	eval(response.responseText);
        setImagesComparatorArray(imagesComparatorArray);
        gm.setValue("images_array", JSON.stringify(imagesComparatorArray)).then(function() {
          var last_update = +new Date();
          setLastUpdate(last_update);
          return gm.setValue("last_update", last_update);
        }).then(function() {
          button_onload.click();
        });
    	}
    });
  };
  head.appendChild(button_load);
  head.appendChild(button_onload);
  var script_b64 = document.createElement("script");
  script_b64.innerHTML = "var Base64Binary = " + Base64Binary.toSource();
  head.appendChild(script_b64);
  var script_settings = document.createElement("script");
  script_settings.innerHTML = "(" + addSettings.toSource() + ")();";
  head.appendChild(script_settings);
  gm.getValue("images_array", JSON.stringify([])).then(function(val) {
    setImagesComparatorArray(JSON.parse(val));
    return gm.getValue("last_update", 0);
  }).then(function(date) {
    setLastUpdate(date);
    var promise = new Promise(function(next) {
      button_onload.onclick = next;
    });
    if (imagesComparatorArray.length) {
      button_onload.click();
    } else {
      button_load.click();
    }
    return promise;
  }).then(function() {
    return new ImageComparator();
  }).then(function(comparator) {
    imageComparator = comparator;

    for (var i = 0; i < imagesComparatorArray.length; i++) {
      imageComparator.add_to_db(imagesComparatorArray[i]);
    }

    if (detectUnicode == 1) {
      regexArray.push([BOTH, BOTH, /[\u0080-\u00a0\u00ad\u00c0-\u036F\u0400\u0402-\u040f\u0450\u0452-\u04ff\u2000-\u200f\u2028-\u2037\u205f-\u206f]/, "unicode"]);
    } else if (detectUnicode == 2) {
      regexArray.push([BOTH, BOTH, /[\u0080-\u00a0\u00ad\u00c0-\u0400\u0402-\u040f\u0450\u0452-\u200f\u2028-\u2037\u205f-\u218f\u2460-\u24ff\u2c60-\uffff]/, "unicode"]);
    }

    if (document.URL.slice(-1) =="/") {
      hideOpPosts().then(function() {
      	return hidePosts(0);
      }).then(function() {
      	if (refreshFrontPage) { refreshFPage(); }

      	if (pager.style.display === "") { return; }

      	observer = new MutationObserver(function(mutationsList) {
	        for(var m = 0; m < mutationsList.length; m++) {
	          var mr = mutationsList[m];
	          if (!mr.addedNodes.length || mr.addedNodes[0].tagName != "DIV" || mr.addedNodes[0].className != "thread") { continue; }

  	        hideOpPosts(mr.addedNodes[0].firstChild.firstChild).then(function() {
              (function loop(arr, i) {
                if (i == arr.length) {
                  return;
                }
                hidePosts(0, [arr[i].firstChild.firstChild]).then(function() {
                  loop(arr, i+1);
                });
              })(mr.addedNodes[0].childNodes, 1);
            });
	        }
      	});
      	observer.observe(document.getElementById('posts-form'), { attributes: false, childList: true, subtree: false });
      });
    } else if (document.URL.includes("/res/")) {
      hideTotalSpan = document.createElement("span");
      hideTotalSpan.className = "post__anon";
      var opPostEnd = document.getElementsByClassName("post post_type_oppost")[0].childNodes[1];
      hideTotalSpan = opPostEnd.insertBefore(hideTotalSpan, opPostEnd.childNodes[opPostEnd.childNodes.length - 2]);

      hiddenCount = 0;
      hidePosts(1).then(function() {
        observer = new MutationObserver(function(mutationsList) {
          for(var m = 0; m < mutationsList.length; m++) {
            var mr = mutationsList[m];
            if (!mr.addedNodes.length || mr.addedNodes[0].tagName != "DIV" || mr.addedNodes[0].className !== "" || mr.addedNodes[0].firstChild.className != "thread__post") { continue; }
            hidePosts(1, [mr.addedNodes[0].firstChild.firstChild]);
          }
        });
        observer.observe(document.getElementsByClassName('thread')[0], { attributes: false, childList: true, subtree: false });
      });
    }
  });
};

function hideOpPosts(node) {
  var opPost,
      msgText,
      opPostsCollection = [];

  if (node) { opPostsCollection.push(node); }
  else { opPostsCollection = document.getElementsByClassName("post post_type_oppost"); }

  return new Promise(function(next) {
    var done = 0;
    for (var i = 0; i < opPostsCollection.length; i++) {
      opPost = opPostsCollection[i];

      if (opPost.parentNode.parentNode.style.display == "none") { continue; }

      (function(opPost) {
        comparatorCheck(opPost).then(function(comparatorResult) {
          var regexResult = regexCheck(opPost, 1);

          var dislike = false;
          var remove = false;
          var reason = "";

          if (regexResult > -1) {
            if (regexArray[regexResult][1] < 3) { dislike = true; }
            if (regexArray[regexResult][1] > 1) { remove = true; }
            reason = regexArray[regexResult][3];
          }
          if (comparatorResult) {
            dislike = true;
            remove = true;
            reason = "лахтокартинка";
          }

          if (dislike) { requestDislike(opPost); }
          if (remove) {
            if (removePosts < 2) {
              var hideDiv = document.createElement("div");
              hideDiv.className = "thread thread_hidden";
              msgText = opPost.getElementsByClassName("post__message post__message_op")[0].innerText.trim();
              if (msgText.length > 800) { hideDiv.title = msgText.substring(0, 800) + "..."; }  //TODO: fix this
              else { hideDiv.title = msgText; }

              var divPostDetailsSpans = opPost.getElementsByClassName("post__detailpart");
              hideDiv.innerHTML = "Скрытый тред (" + opPost.getElementsByClassName("post__title")[0].textContent.trim() + ") • hide: " + reason + " " + divPostDetailsSpans[divPostDetailsSpans.length - 1].innerHTML;
              opPost.parentNode.parentNode.parentNode.insertBefore(hideDiv, opPost.parentNode.parentNode);
            }
            opPost.parentNode.parentNode.style.display = "none";
          }

          done++;
          if (done == opPostsCollection.length) {
            next();
          }
        });
      })(opPost);
    }
  });
}

function getId(post) {
  var id = post.getElementsByClassName("post__anon");
  if (id.length) {
    id = id[0].getElementsByTagName("span");
    if (id.length) {
    	return id[0].id;
    }
  }
  return undefined;
}

function hidePosts(inThread, nodes) {
  var postsCollection = nodes ? nodes : document.getElementsByClassName("post post_type_reply");
  var lahtobots = [];

  return new Promise(function(next) {
    var done = 0;
    for (var i = 0; i < postsCollection.length; i++) {
      var post = postsCollection[i];
      if (post.classList.contains("post_type_hidden")) {
        done++;
        continue;
      }

      if (highlight && !nodes) { highlightPosts(post); }

      if (greentextCheck(post)) {
        if (inThread) { hiddenCount++; }
        done++;
        continue;
      }

      var id = getId(post);
      if (!(id in hidden_ids)) {
	  		hidden_ids[id] = 0;
			}

      (function(post, id) {
        comparatorCheck(post).then(function(comparatorResult) {
          var regexResult = regexCheck(post, 0);

          var dislike = false;
          var remove = false;
          var reason = "";

          if (regexResult > -1) {
            if (regexArray[regexResult][1] < 3) { dislike = true; }
            if (regexArray[regexResult][1] > 1) { remove = true; }
            reason = regexArray[regexResult][3];
          }
          if (comparatorResult) {
            dislike = true;
            remove = true;
            reason = "лахтокартинка";
          }
          if (id && hidden_ids[id] >= threshold_to_hide) {
            dislike = hideOnThreshold == 2 || hideOnThreshold == 3;
            remove = hideOnThreshold == 1 || hideOnThreshold == 3;
            reason = "лахтобот";
          }

          if (dislike) { requestDislike(post); }
          if (remove) {
            if (id && ++hidden_ids[id] == threshold_to_hide) {
              lahtobots.push(id);
            }
            if (removePosts == 1 || removePosts == 3) {
              post.style.display = "none";
            } else {
              insertHideSpan(post, reason);
              post.classList.add("post_type_hidden");
            }
            if (inThread) {
              hiddenCount++;
              hideTotalSpan.textContent = "(скрыто постов: " + String(hiddenCount) + ")";
            }
          }
          done++;
          if (done == postsCollection.length) {
            var posts = Array.from(document.getElementsByClassName("post")).filter(function(element) {
              var _id = getId(element);
          		if (_id && lahtobots.indexOf(_id) != -1) {
                return true;
              }
              return false;
            });
            if (posts.length) {
            	hidePosts(inThread, posts).then(next);
            } else {
              next();
            }
          }
        });
      })(post, id);
    }
  });
}

function insertHideSpan(post, reasonText) {
  var hideSpan = document.createElement("span");
  hideSpan.className = "post__time";
  hideSpan.style.cursor = "help";
  hideSpan.textContent = "• hide: " + reasonText;
  if (popupChars) {
    var msgText = post.getElementsByClassName("post__message")[0].innerText.trim();
    if (msgText.length > popupChars) { hideSpan.title = msgText.substring(0, popupChars) + "..."; }
    else { hideSpan.title = msgText; }
  } else {
    hideSpan.onmouseenter = function() { this.id = setTimeout(openPost, (openPostTimeout < 100 ? 100 : openPostTimeout), this, post); };
    hideSpan.onmouseleave = function() {
      this.id = "";
      if (!post.className.includes("post_type_hidden")) { post.className = "post post_type_reply post_type_hidden"; }
    };
  }
  post.getElementsByClassName("post__details")[0].insertBefore(hideSpan, post.getElementsByClassName("turnmeoff")[1]);
}

function openPost(elem, post) {
  if (elem.id && (post.className.includes("post_type_hidden"))) {
    post.className = "post post_type_reply";
  }
}

function greentextCheck(post) {
  if (!hideEmptyText && ! hideEmptyTextImg && !hideGreenText && !hideGreenTextImg) { return false; }

  var hasImages = post.getElementsByClassName("post__images").length;
  var msgText = post.getElementsByClassName("post__message")[0].innerHTML.trim();
  msgText = msgText.replace(/<a href="\/(?:po|news)\/res\/.*?<\/a>/g, "");
  msgText = msgText.replace(/<br>/g, "");
  msgText = msgText.trim();

  if (hideEmptyText && !hasImages && (!msgText.length || msgText.toUpperCase() === "БАМП" || msgText.toUpperCase() === "BUMP")) {
    switch (hideEmptyText) {
      case 1:
        insertHideSpan(post, "пустой пост");
        post.className = "post post_type_reply post_type_hidden";
        return true;
      case 2:
        post.style.display = "none";
        return true;
    }
  }

  if (hideEmptyTextImg && hasImages && !msgText.length) {
    if (hideEmptyTextImg == 2) {
      requestDislike(post);
      return false;
    } else if (hideEmptyTextImg == 3 || hideEmptyTextImg == 5) {
      requestDislike(post);
    }
    if (hideEmptyTextImg == 1 || hideEmptyTextImg == 3) {
        insertHideSpan(post, "картинка без текста");
        post.className = "post post_type_reply post_type_hidden";
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
    if (hideGreenText == 1 || hideGreenText == 3) {
      insertHideSpan(post, "гринтекст");
      post.className = "post post_type_reply post_type_hidden";
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
    if (hideGreenTextImg == 1 || hideGreenTextImg == 3) {
      insertHideSpan(post, "гринтекст с картинкой");
      post.className = "post post_type_reply post_type_hidden";
      return true;
    }
    if (hideGreenTextImg == 4 || hideGreenTextImg == 5) {
      post.style.display = "none";
      return true;
    }
  }
  return false;
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

function comparatorCheck(post) {
  return new Promise(function(next) {
    var images = post.getElementsByClassName("post__image");
    var attrs = post.getElementsByClassName("post__file-attr");
    (function loop(i) {
      if (i == images.length) {
        next(false);
        return;
      }
      var image = images[i].getElementsByTagName("img")[0];
      function iterate() {
        var result = imageComparator.compare(image);
	  		if (showHideButton) {
  	  		addHideButton(attrs[i], result[0]);
	  		}
    		if (result[1]) {
          next(true);
        } else {
          loop(i+1);
        }
      }
      if (image.complete) {
        iterate();
      } else {
      	image.onload = iterate;
      }
    })(0);
  });
}

function addHideButton(attr, hash) {
  var hashButton = document.createElement("a");
  hashButton.innerHTML = "hide";
  hashButton.onclick = function() {
    if (imagesComparatorArray.indexOf(hash) == -1) {
    	imagesComparatorArray.push(hash);
      setImagesComparatorArray(imagesComparatorArray);
      document.getElementById("images_onload").click();
    	gm.setValue("images_array", JSON.stringify(imagesComparatorArray));
    }
  };
  attr.insertBefore(hashButton, attr.lastChild.previousSibling);
}

function addSettings() {
  var last_update_label = document.createElement("span");
  Settings.addCategory("autohide", "Hide lahtopidorases");
  Settings.addEditor("images_spamlist", function(val) {
    var table = document.createElement("table");
    function fillTable() {
      last_update_label.innerHTML = "Последнее обновление: " + (new Date(last_update)).toLocaleString();
      table.innerHTML = "";
      for (var i = 0; i < imagesComparatorArray.length; i++) {
        var tr = document.createElement("tr");
        var td_canvas = document.createElement("td");
        var td_hash = document.createElement("td");
        var bdata = Base64Binary.decode(imagesComparatorArray[i]);
        var width = bdata[0];
        var height = bdata[4];
        var data = new Uint8Array(bdata).subarray(8);
        var canvas = document.createElement("canvas");
        canvas.width = width*4;
        canvas.height = height*4;
        var ctx = canvas.getContext("2d");
        ctx.scale(4, 4);
        for (var y = 0; y < height; y++) {
          for (var x = 0; x < width; x++) {
            var a = data[y * width + x];
            ctx.fillStyle = "rgba(" + a + ", " + a + ", " + a + ")";
            ctx.fillRect(x, y, 1, 1);
          }
        }
        td_canvas.appendChild(canvas);
        var button = document.createElement("button");
        button.innerHTML = "hash";
        button._hash = imagesComparatorArray[i];
        button.onclick = function() {
          alert(this._hash);
        };
        td_hash.appendChild(button);
        td_hash.setAttribute("style", "vertical-align: middle");
        tr.appendChild(td_canvas);
        tr.appendChild(td_hash);
        table.appendChild(tr);
      }
    }
    fillTable();
    document.getElementById("images_onload").onclick = fillTable;
    var button_load = document.createElement("button");
    button_load.id = "autohide_loadimgs_btn";
    button_load.innerHTML = "Обновить базу";
    button_load.onclick = function() {
      document.getElementById("autohide_loadimgs").click();
    };
    var button_export = document.createElement("button");
    button_export.innerHTML = "Экспорт базы в консоль";
    button_export.onclick = function() {
      console.log(imagesComparatorArray);
    };
    var body = $("#setting-editor-body");
    body.append(last_update_label);
    body.append(document.createElement("br"));
    body.append(button_load);
    body.append(document.createElement("br"));
    body.append(button_export);
    body.append(document.createElement("br"));
    body.append(table);
  }, function() {
      return null;
  });
  Settings.addSetting("autohide", "favorites.show_on_new", {
    label: "Hide",
    default: true,
    edit: {
      editor: "images_spamlist",
      saveable: true,
      label: "Редактировать",
      title: "Лахтокартинки",
      path: "other.autohide.data"
    }
  });
}

function highlightPosts(node) {
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

  var cname = String(element.className);
  if (String(element.id).includes("like-count") || cname.includes("SVGAnimatedString") || cname.includes("post__rate")) {
    clearTimeout(timeoutID);
    timeoutID = setTimeout(scheduledDislike, minClickDelay + Math.random() * (maxClickDelay - minClickDelay));
  }
}

function requestDislike(post) {
  var element = post.getElementsByClassName("post__detailpart post__rate post__rate_type_dislike")[0];
  if (element && element.className !== "post__detailpart post__rate post__rate_type_dislike post__rate_disliked") {
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
  element.click();
  element.parentNode.parentNode.className = "post post_type_reply post_type_hidden";
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