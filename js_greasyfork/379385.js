// ==UserScript==
// @description  Автоскрытие кремлеботов и срыночных дегенератов.
// @exclude      https://2ch.hk/po/catalog.html
// @exclude      https://2ch.hk/news/catalog.html
// @include      https://2ch.hk/po/*
// @include      https://2ch.hk/news/*
// @icon         https://2ch.hk/favicon.ico
// @name         2ch autoHide
// @name:ru      2ch автохайд по списку спеллов
// @namespace    poRussia
// @run-at       document-end
// @version      190306
// @downloadURL https://update.greasyfork.org/scripts/379385/2ch%20autoHide.user.js
// @updateURL https://update.greasyfork.org/scripts/379385/2ch%20autoHide.meta.js
// ==/UserScript==


// ВНИМАНИЕ! СКРИПТ НЕСОВМЕСТИМ С ДРУГИМИ ВАРИАНТАМИ АВТОСКРЫТИЯ!
//    (такими как через куклоскрипт или через настройки 2ch)

const POST = 1;
const BOTH = 2;
const HEAD = 3;
const RAGE = 1;
const HIDE = 3;

// ============[НАЧАЛО НАСТРОЕК]============
// клики по дизлайкам ставятся в случайном интервале между этими двумя значениями
const minClickDelay = 5500;    // минимальная задержка между кликами, мс
const maxClickDelay = 7000;    // максимальная задержка между кликами, мс

const showInTitle = 1;         // Показывать счётчик дизлайков в заголовке вкладки браузера? 1 = да, 0 = нет
const ignoreQuotes = 1;        // Игнорировать совпадения выражений в >цитируемом тексте? 1 = да, 0 = нет
/*  ignoreQuotes = 0 проверяет чистый текст, поэтому будет работать быстрее и проще, но не позволит
      игнорировать совпадения регулярных выражений в цитируемом тексте и будет скрывать посты, в которых
      наивный анон цитирует животных и ботов, чтобы им ответить.
    ignoreQuotes = 1 проверяет текст с тегами, поэтому не будет ставить RAGE и скрывать посты из-за цитат,
      также конструкции типа св[b][/b]инья будут корректно определены, но этот метод работает чуть медленнее
      (разница составляет миллисекунды, но на некрокомпах может быть заметно).
    Рекомендуется использовать ignoreQuotes = 1.
*/
const popupChars = 500;        // Количество символов во всплывающей подсказке над скрытым постом.
                               // Наведи на слово 'hide', чтобы увидеть подсказку.

const highlight = 1;           // Подсвечивать посты зелёным/красным? 1 = да, 0 = нет

/*Вложенный массив с регулярными выражениями для скрытия/лайков.
  Первый элемент - место поиска выражения:
    POST - искать только в тексте поста;
    BOTH - искать и в тексте, и в заголовке;
    HEAD - искать только в заголовке треда(для скрытия номерных тредов например).
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
    (не забыть слева выбрать "ECMAScript (JavaScript)", справа от строки во флагах выбрать /imu)

  [где искать, что делать, /регулярное выражение/imu,                                                                    "описание"]*/
const regexArray = [
  [BOTH, BOTH, /(^|\s)[сc]?с[аaоo]в[оo]?[кk]?с/imu,                                                                      "савок"],
   [BOTH, BOTH, /[кk][оo][мm][мm][иu]/imu,                                                                               "комми"],
  [BOTH, BOTH, /перефорс/imu,                                                                                            "перефос"],
  [BOTH, BOTH, /(^|\s)[еe][лlь]ц[иu]н/imu,                                                                               "Ельцин"],
  [BOTH, BOTH, /[рp]ы[нh][оoь]?[кk]/imu,                                                                                 "рынок"],
  [BOTH, BOTH, /[Яя]/imu,                                                                                                 "я"],
[BOTH, BOTH, /сша/imu,                                                                                                 "сша"],
  [BOTH, BOTH, /чистые/imu,                                                                                              "чистые"],
  [BOTH, BOTH, /(([уy]|[кk][оo][пn])[рp]у?[аaоo]|\S[аaиоoуy][рp][уyоo]|[уy][рp][кk][аa])(и[нh]|нд)/imu,                  "украина"],
  [BOTH, BOTH, /[пn][уy][кk][вbкkнhрpсcшю]/imu,                                                                          "пук"],
   [HEAD, HIDE, /Европа/imu,                                                                                              "Европа"],
  [HEAD, BOTH, /[вb].{0,20}[аa].{0,20}[тt].{0,20}[нh].*[иu].*[кk]/imu,                                                    "ватник"]
];
// ============[КОНЕЦ  НАСТРОЕК]============

var clicksArray = [];
var clicksTaskActive = 0;
var timeoutID;

const displayBlock = document.getElementById("fullscreen-container");
const title = document.title;
const pager = document.getElementsByClassName("pager")[0];
const inputListener = () => { delayClicksAfterUserInput(event.target, event.button); };

if (!document.URL.includes("res")) {
  hideOpPosts();
  hidePosts(0);

  if (pager.style.display == "") { return; }

  var callback = function(mutationsList, observer) {
    for(let m of mutationsList) {
      if (!m.addedNodes.length || m.addedNodes[0].tagName != "DIV" || m.addedNodes[0].className != "thread") { continue; }

      hideOpPosts(m.addedNodes[0].firstChild.firstChild);
      for (let i = 1; i < m.addedNodes[0].childNodes.length; i++) {
        hidePosts(0, m.addedNodes[0].childNodes[i].firstChild.firstChild);
      }
    }
  };

  var observer = new MutationObserver(callback);
  observer.observe(document.getElementById('posts-form'), { attributes: false, childList: true, subtree: false });
} else {
  var hideTotalSpan = document.createElement("span");
  hideTotalSpan.className = "post__anon";
  var opPostEnd = document.getElementsByClassName("post post_type_oppost")[0].childNodes[1];
  hideTotalSpan = opPostEnd.insertBefore(hideTotalSpan, opPostEnd.childNodes[opPostEnd.childNodes.length - 2]);

  var hiddenCount = 0;
  hidePosts(1);

  var callback = function(mutationsList, observer) {
    for(let m of mutationsList) {
      if (!m.addedNodes.length || m.addedNodes[0].tagName != "DIV" || m.addedNodes[0].className != "" || m.addedNodes[0].firstChild.className != "thread__post") { continue; }
      hidePosts(1, m.addedNodes[0].firstChild.firstChild);
    }
  };

  var observer = new MutationObserver(callback);
  observer.observe(document.getElementsByClassName('thread')[0], { attributes: false, childList: true, subtree: false });
}

function hideOpPosts(node) {
  var opPost,
      opPostTitle,
      opPostMsg,
      found,
      opPostsCollection = [];

  if (node) { opPostsCollection.push(node); }
  else { opPostsCollection = document.getElementsByClassName("post post_type_oppost"); }

  for (let i = 0; i < opPostsCollection.length; i++) {
    opPost = opPostsCollection[i];
    if (opPost.parentNode.parentNode.style.display == "none") { continue; }

    let opPostTitleText = "";
    let msgText = "";
    if ((opPostTitle = opPost.getElementsByClassName("post__title")).length) { opPostTitleText = opPostTitle[0].textContent.trim(); }
    if ((opPostMsg = opPost.getElementsByClassName("post__message post__message_op")).length) { msgText = opPostMsg[0].innerText.trim(); }
    else if (!opPostTitleText) { continue; }

    found = -1;
    for (let j = 0; j < regexArray.length; j++) {
      if (opPostTitleText && regexArray[j][0] > 1 && regexArray[j][2].test(opPostTitleText)) {
        found = j;
        break;
      } else if (msgText && regexArray[j][0] < 3 && regexArray[j][2].test(msgText)) {
        found = j;
        break;
      }
    }
    if (found > -1) {
      if (regexArray[found][1] < 3) { requestDislike(opPost); }
      if (regexArray[found][1] > 1) {
        let hideDiv = document.createElement("div");
        hideDiv.className = "thread thread_hidden";
        if (msgText.length > 500) { hideDiv.title = msgText.substring(0, 500) + "..."; }
        else { hideDiv.title = msgText; }

        let divPostDetailsSpans = opPost.getElementsByClassName("post__detailpart");
        hideDiv.innerHTML = "Скрытый тред (" + opPostTitleText + ") • hide: " + regexArray[found][3] + " " + divPostDetailsSpans[divPostDetailsSpans.length - 1].innerHTML;
        opPost.parentNode.parentNode.parentNode.insertBefore(hideDiv, opPost.parentNode.parentNode);
        opPost.parentNode.parentNode.style.display = "none";
      }
    }
  }
}

function hidePosts(inThread, node) {
  var post,
      postTitle,
      postMsg,
      found,
      postsCollection = [];

  if (node) { postsCollection.push(node); }
  else { postsCollection = document.getElementsByClassName("post post_type_reply"); }

  if (postsCollection) {
    for (let i = 0; i < postsCollection.length; i++) {
      post = postsCollection[i];
      if (post.className == "post post_type_reply post_type_hidden") { continue; }

      if (highlight && !node) { highlightPosts(post); }

      found = -1;
      let postTitleText = "";
      if ((postTitle = post.getElementsByClassName("post__title")).length && (postTitleText = postTitle[0].textContent.trim())) {
        for (let j = 0; j < regexArray.length; j++) {
          if (regexArray[j][0] > 1 && regexArray[j][2].test(postTitleText)) {
            found = j;
            break;
          }
        }
      }

      let msgText = "";
      if (found == -1) {
        if ((postMsg = post.getElementsByClassName("post__message")).length && (msgText = postMsg[0].innerText.trim())) {
          for (let j = 0; j < regexArray.length; j++) {
            if (regexArray[j][0] < 3 && regexArray[j][2].test(msgText)) {
              found = j;
              break;
            }
          }
          if (found > -1 && ignoreQuotes) { //double check posts
            msgText = postMsg[0].innerHTML;
            msgText = msgText.replace(/<a href=.*?<\/a>|<\/?strong>|<\/?em>|<\/?su[bp]>|<span class="[suo](poiler)?">/g, "");
            msgText = msgText.replace(/<br>/g, " ");

            let splitStart = -1;
            while ((splitStart = msgText.indexOf("<span class=\"unkfunc\">")) > -1 ) {
              msgText = msgText.substring(0, splitStart) + msgText.substring(msgText.indexOf("</span>", splitStart + 22) + 7);
            }
            msgText = msgText.replace(/<\/span>/g, "");
            found = -1;
            for (let j = 0; j < regexArray.length; j++) {
              if (regexArray[j][0] < 3 && regexArray[j][2].test(msgText)) {
                found = j;
                break;
              }
            }
          }
        }
      }

      if (found > -1) {
        if (regexArray[found][1] < 3) { requestDislike(post); }
        if (regexArray[found][1] > 1) {
          let hideSpan = document.createElement("span");
          hideSpan.className = "post__anon";
          if (ignoreQuotes && postMsg.length) { msgText = postMsg[0].innerText.trim(); }
          if (msgText.length > popupChars) { hideSpan.title = msgText.substring(0, popupChars) + "..."; }
          else { hideSpan.title = msgText; }
          hideSpan.textContent = "• hide: " + regexArray[found][3];

          post.getElementsByClassName("post__details")[0].insertBefore(hideSpan, post.getElementsByClassName("turnmeoff")[1]);
          post.className = "post post_type_reply post_type_hidden";
          if (inThread) { hiddenCount++; }
        }
      }
    }
    if (inThread) { hideTotalSpan.textContent = "(скрыто постов: " + String(hiddenCount) + ")"; }
  }
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
  if (!clicksTaskActive || !timeoutID || mouseButton != 0) { return; }

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
    if (clicksTaskActive == 0) {
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