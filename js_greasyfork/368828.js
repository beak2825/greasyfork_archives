// ==UserScript==
// @name Habr.Features
// @version 3.7.71
// @description Всякое-разное для Habr aka habr.com
// @author AngReload
// @include https://habr.com/*
// @include http://habr.com/*
// @namespace habr_comments
// @run-at document-start
// @grant GM.xmlHttpRequest
// @connect m.habr.com
// @icon https://habr.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/368828/HabrFeatures.user.js
// @updateURL https://update.greasyfork.org/scripts/368828/HabrFeatures.meta.js
// ==/UserScript==
/* global localStorage, MutationObserver, GM */

// настройки по умолчанию
const FLAGS = {};

// размеры кнопок
FLAGS.SMALL_BUTTONS = false;

// Предотвратить закрытие страницы, если статья удалена
FLAGS.PREVENT_CLOSING_DELETED_PAGES = false;

// остановка гифок
// клик по гифке заменит картинку на заглушку
// повторный клик вернет гифку на место
FLAGS.GIF_STOP = true;
// остановить гифки при загрузке страницы
FLAGS.GIF_STOP_ONLOAD = false;
// цвета заглушки
FLAGS.GIF_STOP_COLOR_FG = 'White'; // White
FLAGS.GIF_STOP_COLOR_BG = 'LightGray'; // LightGray or WhiteSmoke
// менять src вместо создания-удаления нод
FLAGS.GIF_STOP_OVERTYPE = false;

// показывать счетчики рейтинга в виде:
// рейтинг = число_плюсов - число_минусов
FLAGS.RATING_DETAILS = true;
// клик мышкой по рейтингу меняет вид на простой \ детальный
FLAGS.RATING_DETAILS_ONCLICK = false;
// рейтинг = число_голосовавших * (процент_плюсов - процент_минусов)%
FLAGS.RATING_DETAILS_PN = false;

// карма = число_голосовавших * (процент_товарищей - процент_неприятелей)%
FLAGS.KARMA_DETAILS = true;

// показывать метки времени в текущем часовом поясе
// абсолютно, либо относительно текущего времени, либо относительно родительского времени
// меняется по клику, в всплывающей подсказке другие виды времени, автообновляется
FLAGS.TIME_DETAILS = true;

// добавить возможность сортировки комментариев
FLAGS.COMMENTS_SORT = true;
// сортировать комменты при загрузке страницы или оставить сортировку по времени
FLAGS.COMMENTS_SORT_ONLOAD = true;
// список доступных сортировок
FLAGS.COMMENTS_SORT_BY_FRESHNESS = true;
FLAGS.COMMENTS_SORT_BY_TREND = true; // самая полезная сортировка
FLAGS.COMMENTS_SORT_BY_QUALITY = false;
FLAGS.COMMENTS_SORT_BY_RATING = false;
FLAGS.COMMENTS_SORT_BY_POPULARITY = false;
FLAGS.COMMENTS_SORT_BY_REDDIT = false;
FLAGS.COMMENTS_SORT_BY_RANDOM = false;

// добавить возможность сворачивать комментарии
FLAGS.COMMENTS_HIDE = false;
// свернуть комментарии если их глубина вложенности равна некому числу
FLAGS.HIDE_LEVEL = 4;
// свернуть комменты с 4-го уровня
FLAGS.HIDE_LEVEL_4 = false;
// сделать «возврат каретки» для комментариев чтобы глубина вложенности не превышала некого числа
FLAGS.LINE_LEN = 8;
// отбивать каждый следущий уровень вложенности дополнительным отступом
FLAGS.REDUCE_NEW_LINES = true;
// глубина вложенности при «возврате каретки» комментариев обозначается разным цветом
FLAGS.RAINBOW_NEW_LINE = true;

// заменить ссылки ведущие к новым комментариям на дерево комментариев
FLAGS.COMMENTS_LINKS = true;

// запоминание галки «Использовать MarkDown» для комментариев
FLAGS.COMMENTS_MD = true;

// добавить ссылку на хабрасторадж в форму редактирования комментариев
FLAGS.HTSO_BTN = true;

// добавить ссылку на отслеживаемых в странице профиля
FLAGS.SUBS_BTN = true;

// включить поиск комментариев в профилях
FLAGS.FIND_COMMENTS = true;

// линии вдоль прокрутки для отображения размеров поста и комментариев
FLAGS.SCROLL_LEGEND = true;

// добавляет кнопку активации ночного режима
FLAGS.NIGHT_MODE = true;

// добавляет диалок настроек
FLAGS.CONFIG_INTERFACE = true;

// включить разные стили
FLAGS.USERSTYLE = true;
// лента постов с увеличенными отступами, нижний бар выровнен вправо
FLAGS.USERSTYLE_FEED_DISTANCED = true;
// мелкий фикс для отступа в счетчике ленты
FLAGS.USERSTYLE_COUNTER_NEW_FIX_SPACE = true;
// удаляет правую колонку, там где не жалко
FLAGS.USERSTYLE_REMOVE_SIDEBAR_RIGHT = true;
// аватарки без скруглений
FLAGS.USERSTYLE_REMOVE_BORDER_RADIUS_AVATARS = true;
// большие аватарки в профиле и карточках
FLAGS.USERSTYLE_USERINFO_BIG_AVATARS = true;
// ограничить размер картинок в комментах
FLAGS.USERSTYLE_COMMENTS_IMG_MAXSIZE = 0;
// ограничить размер картинок в комментах
FLAGS.USERSTYLE_COMMENTS_OPACITY = false;
// нормальные стили для комментариев
FLAGS.USERSTYLE_COMMENTS_FIX = true;
// нормальные стили для кода
FLAGS.USERSTYLE_CODE_FIX = true;
// окантовка границ спойлеров
FLAGS.USERSTYLE_SPOILER_BORDERS = true;
// делает глючные плавающие блоки статичными
FLAGS.USERSTYLE_STATIC_STICKY = true;
// показывать язык подсветки блоков кода
FLAGS.USERSTYLE_HLJS_LANG = true;
// показывать язык кода только при наведении
FLAGS.USERSTYLE_HLJS_LANG_HOVER = false;
// свой шрифт для блоков кода
FLAGS.USERSTYLE_CODE_FONT = ''; // PT Mono
// размер табов в коде
FLAGS.USERSTYLE_CODE_TABSIZE = 2;
// для ночного режима
FLAGS.USERSTYLE_CODE_NIGHT = true;
// для настроек
FLAGS.USERSTYLE_CONFIG_INTERFACE = true;
FLAGS.SCROLL_BEHAVIOR_SMOOTH = true;

const configOptions = [
  ['KARMA_DETAILS', 'счётчики кармы с плюсами и минусами'],
  ['RATING_DETAILS', 'рейтинги с плюсами и минусами'],
  ['RATING_DETAILS_PN', 'рейтинги в процентах'],
  ['TIME_DETAILS', 'отметки о времени с подробностями'],
  ['PREVENT_CLOSING_DELETED_PAGES', 'предотвратить закрытие страницы, если статья удалена'],
  ['GIF_STOP', 'остановка гифок'],
  ['GIF_STOP_ONLOAD', 'остановить гифки при загрузке страницы'],
  ['COMMENTS_SORT', 'сортировка комментов'],
  ['COMMENTS_SORT_ONLOAD', 'сортировать комменты при загрузке'],
  ['COMMENTS_SORT_BY_FRESHNESS', 'сортировка новые'],
  ['COMMENTS_SORT_BY_TREND', 'сортировка горячие'],
  ['COMMENTS_SORT_BY_QUALITY', 'сортировка хорошие'],
  ['COMMENTS_SORT_BY_REDDIT', 'сортировка проверенные'],
  ['COMMENTS_SORT_BY_RATING', 'сортировка рейтинговые'],
  ['COMMENTS_SORT_BY_POPULARITY', 'сортировка популярные'],
  ['COMMENTS_SORT_BY_RANDOM', 'сортировка случайные'],
  // ['COMMENTS_HIDE', 'сворачивание комментов'],
  // ['HIDE_LEVEL_4', 'свернуть комменты с 4-го уровня'],
  // ['REDUCE_NEW_LINES', 'возврат каретки с уменьшением ширины'],
  // ['RAINBOW_NEW_LINE', 'возврат каретки комментов в разных цветах'],
  // ['COMMENTS_LINKS', '"читать комментарии" ведёт на корень комментов'],
  // ['COMMENTS_MD', 'запоминать галку MarkDown'],
  ['USERSTYLE_COMMENTS_OPACITY', 'заминусованные комменты без прозрачности'],
  // ['FIX_JUMPING_SCROLL', 'заморозить высоту статьи при загрузке'],
  ['SCROLL_LEGEND', 'ленгенда страницы у скроллбара'],
  ['SUBS_BTN', 'табы подписок в профилях'],
  ['FIND_COMMENTS', 'поиск по комментариям в профилях'],
  ['NIGHT_MODE', 'ночной режим'],
  ['SMALL_BUTTONS', 'маленькие кнопки настроек и ночного режима'],
  // ['USERSTYLE', 'стилизация'],
  ['USERSTYLE_COMMENTS_FIX', 'стили комментов'],
  ['USERSTYLE_HLJS_LANG', 'показать язык для блоков кода'],
  // ['USERSTYLE_HLJS_LANG_HOVER', 'язык кода скрыт до наведении курсора'],
  ['USERSTYLE_STATIC_STICKY', 'зафиксировать плавающие блоки'],
  // ['USERSTYLE_SPOILER_BORDERS', 'видимые границы спойлеров'],
  ['USERSTYLE_FEED_DISTANCED', 'большие отступы между постами в ленте'],
  ['USERSTYLE_REMOVE_SIDEBAR_RIGHT', 'удалить правую колонку сайта'],
  // ['USERSTYLE_REMOVE_BORDER_RADIUS_AVATARS', 'квадратные аватарки'],
  ['USERSTYLE_USERINFO_BIG_AVATARS', 'по возможности большие аватарки в профилях'],
];

// сохраняем умолчания для панели настроек
if (!localStorage.getItem('habrafixFlags')) {
  localStorage.setItem('habrafixFlags', JSON.stringify(FLAGS));
} else {
  const jsonString = localStorage.getItem('habrafixFlags');
  const loadedConfig = jsonString ? JSON.parse(jsonString) : {};
  const loadedKeys = Object.keys(loadedConfig);
  Object.keys(FLAGS).forEach((key) => {
    if (
      loadedKeys.includes(key) &&
      configOptions.find(arr => arr[0] === key)
    ) {
      FLAGS[key] = loadedConfig[key];
    }
  });
}

let BUTTON_SIZE = 16;
let BUTTON_SIZE2 = 25;
let BUTTON_SIZE4 = 48;
let KARMA_WIDTH = 84; // ?

if (FLAGS.SMALL_BUTTONS) {
  BUTTON_SIZE = 16;
  BUTTON_SIZE2 = 25;
  BUTTON_SIZE4 = 48;
  KARMA_WIDTH = 84; // ?
} else {
  BUTTON_SIZE = 32;
  BUTTON_SIZE2 = 25;
  BUTTON_SIZE4 = 88;
  KARMA_WIDTH = 84;
}

// интерфейс для хранения настроек
const userConfig = {
  // имя записи в localsorage
  key: 'habrafix',
  // модель настроек: ключ - возможные значения
  model: {
    time_publications: ['fromNow', 'absolute'],
    time_comments: ['fromParent', 'fromNow', 'absolute'],
    comments_order: ['trend', 'time'],
    scores_details: [true, false],
    comment_markdown: [false, true],
    night_mode: [false, true],
  },
  config: {},
  // при старте для конфига берем сохраненные параметры либо по умолчанию
  init() {
    let jsonString = localStorage.getItem(userConfig.key);
    const loadedConfig = jsonString ? JSON.parse(jsonString) : {};
    const loadedKeys = Object.keys(loadedConfig);
    const config = {};
    Object.keys(userConfig.model).forEach((key) => {
      const exist = loadedKeys.indexOf(key) >= 0;
      config[key] = exist ? loadedConfig[key] : userConfig.model[key][0];
    });
    jsonString = JSON.stringify(config);
    localStorage.setItem(userConfig.key, jsonString);
    userConfig.config = config;
  },
  getItem(key) {
    const jsonString = localStorage.getItem(userConfig.key);
    const config = JSON.parse(jsonString);
    return config[key];
    // return userConfig.config[key];
  },
  setItem(key, value) {
    let jsonString = localStorage.getItem(userConfig.key);
    const config = JSON.parse(jsonString);
    config[key] = value;
    jsonString = JSON.stringify(config);
    localStorage.setItem(userConfig.key, jsonString);
    userConfig.config = config;
  },
  // каруселит параметр по значения модели
  shiftItem(key) {
    const currentValue = userConfig.getItem(key);
    const availableValues = userConfig.model[key];
    const currentIdx = availableValues.indexOf(currentValue);
    const nextIdx = (currentIdx + 1) % availableValues.length;
    const nextValue = availableValues[nextIdx];
    userConfig.setItem(key, nextValue);
    return nextValue;
  },
};
userConfig.init();

// свои стили
const userStyleEl = document.createElement('style');
let userStyle = '';

if (FLAGS.SCROLL_LEGEND) {
  userStyle += `
    .legend_el {
      position: fixed;
      width: 4px;
      right: 0;
      transition: top 1s ease-out, height 1s ease-out;
      z-index: 10000;
    }

    #xpanel {
      right: 4px;
    }
  `;
}

if (FLAGS.USERSTYLE_FEED_DISTANCED) {
  userStyle += `
    .post__body_crop {
      text-align: right;
    }

    .post__body_crop .post__text {
      text-align: left;
    }

    .post__footer {
      text-align: right;
    }

    .posts_list .content-list__item_post {
      padding: 40px 0;
    }
  `;
}

if (FLAGS.USERSTYLE_COUNTER_NEW_FIX_SPACE) {
  userStyle += `
    .toggle-menu__item-counter_new {
      margin-left: 4px;
    }
  `;
}

if (FLAGS.USERSTYLE_COMMENTS_OPACITY) {
  userStyle += `
    .comment__message_downgrade {
      opacity: 1;
    }
  `;
}

if (FLAGS.USERSTYLE_REMOVE_SIDEBAR_RIGHT || FLAGS.PREVENT_CLOSING_DELETED_PAGES) {
  // remove for
  // https://habr.com/post/352896/
  // https://habr.com/sandbox/
  // https://habr.com/sandbox/115216/
  // https://habr.com/users/saggid/posts/
  // https://habr.com/users/saggid/comments/
  // https://habr.com/users/saggid/favorites/
  // https://habr.com/users/saggid/favorites/posts/
  // https://habr.com/users/saggid/favorites/comments/
  // https://habr.com/company/pvs-studio/blog/353640/
  // https://habr.com/company/pvs-studio/blog/
  // https://habr.com/company/pvs-studio/blog/top/
  // https://habr.com/company/pvs-studio/
  // https://habr.com/feed/
  // https://habr.com/top/
  // https://habr.com/top/yearly/
  // https://habr.com/all/
  // https://habr.com/all/top10/

  // display for
  // https://habr.com/company/pvs-studio/profile/
  // https://habr.com/company/pvs-studio/vacancies/
  // https://habr.com/company/pvs-studio/fans/all/rating/
  // https://habr.com/company/pvs-studio/workers/new/rating/
  // https://habr.com/feed/settings/
  // https://habr.com/users/
  // https://habr.com/hubs/
  // https://habr.com/hubs/admin/
  // https://habr.com/companies/
  // https://habr.com/companies/category/software/
  // https://habr.com/companies/new/
  // https://habr.com/flows/design/

  const path = window.location.pathname;
  const isPost = /^\/(ru|en)\/post\/\d+\/$/.test(path);
  const isSandbox = /^\/(ru|en)\/sandbox\//.test(path);
  const isUserPosts = /^\/(ru|en)\/users\/[^/]+\/posts\//.test(path);
  const isUserComments = /^\/(ru|en)\/users\/[^/]+\/comments\//.test(path);
  const isUserFavorites = /^\/(ru|en)\/users\/[^/]+\/favorites\//.test(path);
  // const isUserSubscription = /^\/(ru|en)\/users\/[^/]+\/subscription\//.test(path);
  const isCompanyBlog = /^\/(ru|en)\/company\/[^/]+\/blog\//.test(path);
  const isCompanyBlog2 = /^\/(ru|en)\/company\/[^/]+\/(page\d+\/)?$/.test(path);
  const isCompanyBlogPost = /^\/(ru|en)\/company\/[^/]+\/blog\/[^/]+/.test(path);
  const isFeed = /^\/(ru|en)\/feed\//.test(path);
  const isHome = /^\/(ru|en)\/$/.test(path);
  const isTop = /^\/(ru|en)\/top\//.test(path);
  const isAll = /^\/(ru|en)\/all\//.test(path);
  const isNews = /^\/(ru|en)\/news\//.test(path);
  const isNewsT = /^\/(ru|en)\/news\/t\/\d+\/$/.test(path);

  if (FLAGS.USERSTYLE_REMOVE_SIDEBAR_RIGHT && (
    isPost || isSandbox ||
    isUserPosts || isUserComments || isUserFavorites ||
    isCompanyBlog || isCompanyBlog2 ||
    isFeed || isHome || isTop || isAll ||
    isNews || isNewsT
  )) {
    userStyle += `
    .sidebar_right,
    .sidebar {
      display: none;
    }

    .content_left {
      padding-right: 0;
    }

    .comment_plain {
      max-width: 860px;
    }
  `;
  }

  if (FLAGS.PREVENT_CLOSING_DELETED_PAGES && (
    isPost || isSandbox ||
    isCompanyBlogPost ||
    isNews || isNewsT
  )) {
    window.onbeforeunload = (e) => {
      const xhr = new XMLHttpRequest();
      xhr.open('HEAD', '', false);
      xhr.send();
      if (xhr.status < 200 || xhr.status >= 400) {
        e.preventDefault();
        const message = 'Статья уже удалена или недоступна';
        e.returnValue = message;
        return message;
      }
      return undefined;
    };
  }
}

if (FLAGS.USERSTYLE_REMOVE_BORDER_RADIUS_AVATARS) {
  userStyle += `
    .user-info__image-pic,
    .user-pic_popover,
    .media-obj__image-pic,
    .company-info__image-pic {
      border-radius: 0;
    }
  `;
}

if (FLAGS.USERSTYLE_USERINFO_BIG_AVATARS) {
  userStyle += `
    .page-header {
      height: auto;
    }

    .media-obj__image-pic_hub,
    .user-info__stats .media-obj__image-pic_user,
    /* .media-obj__image-pic_company, */
    .company-info__image-pic {
      width: auto;
      height: auto;
    }

    .page-header_tall .company-info__image-pic {
      width: 48px;
      height: 48px;
    }
  `;
}

if (FLAGS.COMMENTS_SORT) {
  userStyle += `
    .comments_order {
      color: #333;
      font-size: 14px;
      font-family: "-apple-system",BlinkMacSystemFont,Arial,sans-serif;
      text-rendering: optimizeLegibility;
      border-bottom: 1px solid #e3e3e3;
      padding: 8px;
      text-align: right;
    }

    .comments_order a {
      color: #548eaa;
      font-style: normal;
      text-decoration: none;
    }

    .comments_order a:hover {
      color: #487284;
    }
  `;
}

if (FLAGS.USERSTYLE_COMMENTS_FIX) {
  userStyle += `
    .content-list_comments {
      overflow: visible;
    }

    .comment__folding-dotholder {
      display: none !important;
    }

    .content-list_nested-comments {
      border-left: 1px solid #e3e3e3;
      margin: 0;
      /*padding-top: 20px;*/
      padding-left: 20px !important;
    }

    .content-list_comments {
      /*border-left: 1px solid silver;*/
      margin: 0;
      /*padding-left: 0;*/
      padding-top: 20px;
      /*background: #FCE4EC;*/
    }

    #comments-list .js-form_placeholder:not(:empty) {
      border-left: 1px solid #e3e3e3;
      padding-left: 20px;
    }

    .comments_new-line {
      border-left: 1px solid #777;
      border-bottom: 1px solid #777;
      border-top: 1px solid #777;
      margin-left: -${FLAGS.LINE_LEN * 21}px !important;
      background: white;
      padding-bottom: 4px;
    }

    /* .comment__head_topic-author.comment__head_new-comment */
    .comment__head_topic-author .user-info {
      text-decoration: underline;
    }

    /* фикс, когда не добавляется класс &_plus или minus при user_vote_action */
    .voting-wjt__button[title="Вы проголосовали положительно"] {
      color: #7ba600;
    }
    .voting-wjt__button[title="Вы проголосовали отрицательно"] {
      color: #d53c30;
    }
  `;
}

if (FLAGS.USERSTYLE_COMMENTS_FIX && FLAGS.RAINBOW_NEW_LINE) {
  userStyle += `
    .comments_new-line-1 {
      border-color: #0caefb;
    }

    .comments_new-line-2 {
      border-color: #06feb7;
    }

    .comments_new-line-3 {
      border-color: #fbcb02;
    }

    .comments_new-line-0 {
      border-color: #fb0543;
    }

    .js-comment_parent:not(:hover) {
      color: #cd66cd !important;
    }
  `;
}

if (FLAGS.USERSTYLE_COMMENTS_FIX && FLAGS.REDUCE_NEW_LINES) {
  userStyle += `
    .comments_new-line .comments_new-line {
      margin-left: -${(FLAGS.LINE_LEN - 1) * 21}px !important;
    }
  `;
}

if (FLAGS.USERSTYLE_COMMENTS_IMG_MAXSIZE) {
  userStyle += `
    .comment__message img {
      max-height: ${FLAGS.USERSTYLE_COMMENTS_IMG_MAXSIZE}px;
    }

    .comment__message .spoiler .img {
      max-height: auto;
    }
  `;
}

if (FLAGS.USERSTYLE_CODE_FIX) {
  let addFont = '';
  if (FLAGS.USERSTYLE_CODE_FONT) {
    addFont = FLAGS.USERSTYLE_CODE_FONT;
    if (addFont.indexOf(' ') >= 0) {
      addFont = `"${addFont}"`;
    }
    addFont += ',';
  }

  const tabSize = FLAGS.USERSTYLE_CODE_TABSIZE || 4;

  userStyle += `
    .editor .text-holder textarea,
    .tm-editor__textarea,
    pre {
      font-family: ${addFont} 'Ubuntu Mono', Menlo, Monaco, Consolas, 'Lucida Console', 'Courier New', monospace;
    }

    code {
      font-family: ${addFont} 'Ubuntu Mono', Menlo, Monaco, Consolas, 'Lucida Console', 'Courier New', monospace !important;;
      -o-tab-size: ${tabSize};
      -moz-tab-size: ${tabSize};
      tab-size: ${tabSize};
      background: #f7f7f7;
      border-radius: 3px;
      color: #505c66;
      display: inline-block;
      font-weight: 500;
      line-height: 1.29;
      padding: 5px 9px;
      vertical-align: 1px;
    }
  `;
}

if (FLAGS.USERSTYLE_SPOILER_BORDERS) {
  userStyle += `
    .spoiler .spoiler_text {
      border: 1px dashed rgb(12, 174, 251);
    }
  `;
}

if (FLAGS.USERSTYLE_STATIC_STICKY) {
  userStyle += `
    .wrapper-sticky,
    .js-ad_sticky,
    .js-ad_sticky_comments {
      position: static !important;
    }
    .sticky-spacer {
      display: none !important;
    }
  `;
}

if (FLAGS.GIF_STOP) {
  userStyle += `
    .habrafix_gif-stop:hover {
      outline: 4px solid #548eaa;
      outline-offset: -4px;
    }
  `;
}

if (FLAGS.USERSTYLE_HLJS_LANG) {
  let hover = '';
  if (FLAGS.USERSTYLE_HLJS_LANG_HOVER) hover = ':hover';
  userStyle += `
    pre {
      position: relative;
    }

    .hljs${hover}::after {
      position: absolute;
      font-size: 12px;
      content: 'code';
      right: 0;
      top: 0;
      padding: 1px 5px 0 4px;
      /*border-bottom: 1px solid #e5e8ec;
      border-left: 1px solid #e5e8ec;
      border-bottom-left-radius: 3px;
      color: #505c66;*/
      opacity: .5;
    }
  `;
  userStyle += [
    ['1c', '1C:Enterprise (v7, v8)'],
    ['abnf', 'Augmented Backus-Naur Form'],
    ['accesslog', 'Access log'],
    ['actionscript', 'ActionScript'],
    ['ada', 'Ada'],
    ['apache', 'Apache'],
    ['applescript', 'AppleScript'],
    ['arduino', 'Arduino'],
    ['armasm', 'ARM Assembly'],
    ['asciidoc', 'AsciiDoc'],
    ['aspectj', 'AspectJ'],
    ['autohotkey', 'AutoHotkey'],
    ['autoit', 'AutoIt'],
    ['avrasm', 'AVR Assembler'],
    ['awk', 'Awk'],
    ['axapta', 'Axapta'],
    ['bash', 'Bash'],
    ['basic', 'Basic'],
    ['bnf', 'Backus–Naur Form'],
    ['brainfuck', 'Brainfuck'],
    ['cal', 'C/AL'],
    ['capnproto', 'Cap’n Proto'],
    ['ceylon', 'Ceylon'],
    ['clean', 'Clean'],
    ['clojure-repl', 'Clojure REPL'],
    ['clojure', 'Clojure'],
    ['cmake', 'CMake'],
    ['coffeescript', 'CoffeeScript'],
    ['coq', 'Coq'],
    ['cos', 'Caché Object Script'],
    ['cpp', 'C++'],
    ['crmsh', 'crmsh'],
    ['crystal', 'Crystal'],
    ['cs', 'C#'],
    ['csp', 'CSP'],
    ['css', 'CSS'],
    ['d', 'D'],
    ['dart', 'Dart'],
    ['delphi', 'Delphi'],
    ['diff', 'Diff'],
    ['django', 'Django'],
    ['dns', 'DNS Zone file'],
    ['dockerfile', 'Dockerfile'],
    ['dos', 'DOS .bat'],
    ['dsconfig', 'dsconfig'],
    ['dts', 'Device Tree'],
    ['dust', 'Dust'],
    ['ebnf', 'Extended Backus-Naur Form'],
    ['elixir', 'Elixir'],
    ['elm', 'Elm'],
    ['erb', 'ERB (Embedded Ruby)'],
    ['erlang-repl', 'Erlang REPL'],
    ['erlang', 'Erlang'],
    ['excel', 'Excel'],
    ['fix', 'FIX'],
    ['flix', 'Flix'],
    ['fortran', 'Fortran'],
    ['fsharp', 'F#'],
    ['gams', 'GAMS'],
    ['gauss', 'GAUSS'],
    ['gcode', 'G-code (ISO 6983)'],
    ['gherkin', 'Gherkin'],
    ['glsl', 'GLSL'],
    ['go', 'Go'],
    ['golo', 'Golo'],
    ['gradle', 'Gradle'],
    ['groovy', 'Groovy'],
    ['haml', 'Haml'],
    ['handlebars', 'Handlebars'],
    ['haskell', 'Haskell'],
    ['haxe', 'Haxe'],
    ['hsp', 'HSP'],
    ['htmlbars', 'HTMLBars'],
    ['http', 'HTTP'],
    ['hy', 'Hy'],
    ['inform7', 'Inform 7'],
    ['ini', 'Ini'],
    ['irpf90', 'IRPF90'],
    ['java', 'Java'],
    ['javascript', 'JavaScript'],
    ['jboss-cli', 'jboss-cli'],
    ['json', 'JSON'],
    ['julia-repl', 'Julia REPL'],
    ['julia', 'Julia'],
    ['kotlin', 'Kotlin'],
    ['lasso', 'Lasso'],
    ['ldif', 'LDIF'],
    ['leaf', 'Leaf'],
    ['less', 'Less'],
    ['lisp', 'Lisp'],
    ['livecodeserver', 'LiveCode'],
    ['livescript', 'LiveScript'],
    ['llvm', 'LLVM IR'],
    ['lsl', 'Linden Scripting Language'],
    ['lua', 'Lua'],
    ['makefile', 'Makefile'],
    ['markdown', 'Markdown'],
    ['mathematica', 'Mathematica'],
    ['matlab', 'Matlab'],
    ['maxima', 'Maxima'],
    ['mel', 'MEL'],
    ['mercury', 'Mercury'],
    ['mipsasm', 'MIPS Assembly'],
    ['mizar', 'Mizar'],
    ['mojolicious', 'Mojolicious'],
    ['monkey', 'Monkey'],
    ['moonscript', 'MoonScript'],
    ['n1ql', 'N1QL'],
    ['nginx', 'Nginx'],
    ['nimrod', 'Nimrod'],
    ['nix', 'Nix'],
    ['nsis', 'NSIS'],
    ['objectivec', 'Objective-C'],
    ['ocaml', 'OCaml'],
    ['openscad', 'OpenSCAD'],
    ['oxygene', 'Oxygene'],
    ['parser3', 'Parser3'],
    ['perl', 'Perl'],
    ['pf', 'pf'],
    ['pgsql', 'PostgreSQL'],
    ['plaintext', 'просто текст'], // на будущее
    ['php', 'PHP'],
    ['pony', 'Pony'],
    ['powershell', 'PowerShell'],
    ['processing', 'Processing'],
    ['profile', 'Python profile'],
    ['prolog', 'Prolog'],
    ['protobuf', 'Protocol Buffers'],
    ['puppet', 'Puppet'],
    ['purebasic', 'PureBASIC'],
    ['python', 'Python'],
    ['q', 'Q'],
    ['qml', 'QML'],
    ['r', 'R'],
    ['rib', 'RenderMan RIB'],
    ['roboconf', 'Roboconf'],
    ['routeros', 'Microtik RouterOS script'],
    ['rsl', 'RenderMan RSL'],
    ['ruby', 'Ruby'],
    ['ruleslanguage', 'Oracle Rules Language'],
    ['rust', 'Rust'],
    ['scala', 'Scala'],
    ['scheme', 'Scheme'],
    ['scilab', 'Scilab'],
    ['scss', 'SCSS'],
    ['shell', 'Shell Session'],
    ['smali', 'Smali'],
    ['smalltalk', 'Smalltalk'],
    ['sml', 'SML'],
    ['sqf', 'SQF'],
    ['sql', 'SQL'],
    ['stan', 'Stan'],
    ['stata', 'Stata'],
    ['step21', 'STEP Part 21'],
    ['stylus', 'Stylus'],
    ['subunit', 'SubUnit'],
    ['swift', 'Swift'],
    ['taggerscript', 'Tagger Script'],
    ['tap', 'Test Anything Protocol'],
    ['tcl', 'Tcl'],
    ['tex', 'TeX'],
    ['thrift', 'Thrift'],
    ['tp', 'TP'],
    ['twig', 'Twig'],
    ['typescript', 'TypeScript'],
    ['vala', 'Vala'],
    ['vbnet', 'VB.NET'],
    ['vbscript-html', 'VBScript in HTML'],
    ['vbscript', 'VBScript'],
    ['verilog', 'Verilog'],
    ['vhdl', 'VHDL'],
    ['vim', 'Vim Script'],
    ['x86asm', 'Intel x86 Assembly'],
    ['xl', 'XL'],
    ['xml', 'HTML, XML'],
    ['xquery', 'XQuery'],
    ['yaml', 'YAML'],
    ['zephir', 'Zephir'],
  ].map(([langTag, langName]) => `.hljs.${langTag}${hover}::after{content:'${langName} [${langTag}]'}`).join('');
}

if (FLAGS.USERSTYLE_CODE_NIGHT) {
  userStyle += `
  .night_mode_switcher {
    box-sizing: border-box;
    position: fixed;
    width: 32px;
    height: 32px;
    right: 32px;
    bottom: 32px;
    width: ${BUTTON_SIZE}px;
    height: ${BUTTON_SIZE}px;
    right: ${BUTTON_SIZE}px;
    bottom: ${BUTTON_SIZE}px;
    z-index: 10000;
    background-color: transparent;
    border-radius: 50%;
    border: 4px solid #aaa;
    border-right-width: ${BUTTON_SIZE / 2}px;
    transition: border-color 0.1s ease-out;
  }

  .night_mode_switcher:hover {
    border-color: #333;
  }

  .night .night_mode_switcher {
    border-color: #515151;
  }

  .night .night_mode_switcher:hover {
    border-color: #9e9e9e;
  }

  .night ::-webkit-scrollbar,
  .night ::-webkit-scrollbar-corner,
  .night ::-webkit-scrollbar-track-piece {
    background-color: #000;
  }
  
  .night ::-webkit-scrollbar-thumb {
    background-color: #22272b;
    border: 1px solid #000;
  }
  
  .night ::-webkit-scrollbar-thumb:hover {
    background-color: #2C3237;
  }
  
  .night {
    scrollbar-color: dark;
    scrollbar-face-color: #22272b;
    scrollbar-track-color: #000;
    scrollbar-color: #22272b #000;
  }

  /* bg */
  .night .sidebar-block__suggest,
  .night .dropdown-container,
  .night .poll-result__bar,
  .night .comments_new-line,
  .night .tm-editor__textarea,
  .night .layout,
  .night .toggle-menu__most-read,
  .night .toggle-menu_most-comments,
  .night .partner-info {
    background: #171c20;
  }

  /* text */
  .night .companies-rating__name:not(:hover),
  .night .profile-section__title,
  .night .profile-section__about-text,
  .night .profile-section__invited,
  .night .sidebar-block__suggest,
  .night .user-message__body,
  .night .promo-block__title_total,
  .night .beta-anounce__text,
  .night .defination-list__label,
  .night .defination-list__value,
  .night .search-field__select,
  .night .search-field__input[type="text"],
  .night .search-form__field,
  .night .post-info__title:not(:hover),
  .night .dropdown__user-stats,
  .night .dropdown-container_white .user-info__special,
  .night .n-dropdown-menu__item-link,
  .night body,
  .night .default-block__polling-title,
  .night .poll-result__data-label,
  .night code,
  .night .user-info__fullname,
  .night .user-info__specialization,
  .night .page-header__info-title,
  .night .page-header__info-desc,
  .night .post__title-text,
  .night .post__title_link:not(:visited),
  .night .checkbox__label,
  .night .radio__label,
  .night .tm-editor__textarea,
  .night .footer-block__title,
  .night #TMpanel .container .bmenu > a.current,
  .night .post__text-html,
  .night .comment__message,
  .night .comment-form__preview,
  .night .post-share__title,
  .night .post-donate__title,
  .night .news-block__title,
  .night .news-topic__title:not(:visited),
  .night .partner-info__title,
  .night .partner-info__description {
    color: #9e9e9e;
  }

  /* non important text */
  .night .icon-svg_bookmark,
  .night .icon-svg_views-count,
  .night .icon-svg_post-comments,
  .night .icon-svg_edit,
  .night .icon-svg_recommend,
  .night .icon-svg_report,
  .night .voting-wjt__button:not(.voting-wjt__button_plus):not(.voting-wjt__button_minus),
  .night .icon_comment-edit,
  .night .icon_comment-anchor,
  .night .icon_comment-bookmark,
  .night .icon_comment-branch,
  .night .icon_comment-arrow-up,
  .night .icon_comment-arrow-down,
  .night .layout__elevator {
    color: #515151;
  }

  .night .voting-wjt__button:not(.voting-wjt__button_plus):not(.voting-wjt__button_minus):hover,
  .night .icon_comment-anchor:hover,
  .night .icon_comment-bookmark:hover,
  .night .icon_comment-branch:hover,
  .night .icon_comment-arrow-up:hover,
  .night .icon_comment-arrow-down:hover {
    color: #548eaa;
  }

  .night .n-dropdown-menu__item-link:hover {
    color: white;
  }

  /* top lvl bg */
  .night .h-popover,
  .night .profile-section__user-hub:not(.profile-section__user-hub_cross),
  .night a.sort-panel__item-toggler.active,
  .night .checkbox__label::before,
  .night .radio__label::before,
  .night .content-list__item_conversation:hover,
  .night .search-field__select,
  .night .search-field__input[type="text"],
  .night .search-form__field,
  .night .dropdown-container,
  .night .n-dropdown-menu,
  .night .post__translatation,
  .night code,
  .night .megapost-teasers,
  .night .tm-editor_comments,
  .night .promo-block__header,
  .night .post__text-html blockquote,
  .night .default-block,
  .night .post-share,
  .night .post-donate,
  .night .company-info__author,
  .night .layout__row_footer-links {
    background: #22272B;
  }

  /* not important bg */
  .night .profile-section__user-hub:not(.profile-section__user-hub_cross):hover,
  .night .btn_blue.disabled,
  .night .btn_blue[disabled],
  .night .tracker_page table.tracker_folowers tr.new,
  .night .dropdown__user-stats,
  .night .comment__head_topic-author,
  .night .promo-item:hover,
  .night .layout__row_navbar,
  .night .layout__row_footer,
  .night #TMpanel,
  .night .n-dropdown-menu__item-link_flow:hover,
  .night #tracker-page .tracker-table__row.new {
    background: #1f2327;
  }

  /* borders */
  .night #tracker-page .tracker-table__header,
  .night #tracker-page .tracker-table__cell,
  .night .h-popover,
  .night .h-popover__stats,
  .night .default-block__footer,
  .night .toggle-menu__item-link_bordered,
  .night .default-block_promote,
  .night .sort-panel,
  .night .n-dropdown-menu_flows,
  .night .for_users_only_msg,
  .night #comments-list .js-form_placeholder,
  .night .sidebar-block__suggest,
  .night .content-list_preview-message,
  .night .btn_outline_blue[disabled],
  .night .user-message__body_html pre code,
  .night .content-list_user-dialog,
  .night .wysiwyg-toolbar,
  .night .content-list__item_bordered,
  .night .promo-block__total,
  .night .search-field__select,
  .night .search-field__input[type="text"],
  .night .search-form__field,
  .night .tracker_page table.tracker_folowers tr td,
  .night .tracker_page table.tracker_folowers tr th,
  .night .stacked-menu__item_devided,
  .night .post__text-html table,
  .night .post__text-html table td,
  .night .post__text-html table th,
  .night .n-dropdown-menu__item_border,
  .night .dropdown-container,
  .night .default-block_bordered,
  .night .default_block_polling,
  .night .column-wrapper_tabs .sidebar_right,
  .night .post__type-label,
  .night .promo-block__header,
  .night .user-info__contacts,
  .night .comment__message pre code,
  .night .comment-form__preview pre code,
  .night .sandbox-panel,
  .night .comment__post-title,
  .night .tm-editor__textarea,
  .night .promo-block__footer,
  .night .author-panel,
  .night .promo-block,
  .night .post__text-html pre code,
  .night .footer-block__title,
  .night #TMpanel,
  .night .layout__row_navbar,
  .night .page-header_bordered,
  .night .post-stats,
  .night .company-info__about,
  .night .company-info_post-additional,
  .night .company-info__contacts,
  .night .post-share,
  .night .post-donate,
  .night .content-list__item_devided,
  .night .comments_order,
  .night .comments-section__head,
  .night .content-list_nested-comments,
  .night .default-block__header,
  .night .column-wrapper_bordered,
  .night .tabs-menu,
  .night .toggle-menu,
  .night .news-block__header,
  .night .news-block__footer {
    border-color: #393d41;
  }

  .night .rating-info__progress,
  .night .poll-result__progress {
    background-color: #515151;
  }

  .night .poll-result__progress_winner {
    background-color: #5e8eac;
  }

  .night .layout__elevator:hover {
    background-color: #22272B;
  }

  .night .comment__head_topic-author {
    background: #003030;
  }

  .night .comment__head_my-comment {
    background: #003000;
  }

  .night .comment__head_new-comment {
    background: black
  }

  .night .user-info__nickname_comment,
  .night .icon-svg_logo-habrahabr {
    color: inherit;
  }

  .night [disabled] {
    opacity: 0.5
  }

  .night .content-list_comments .comment__folding-dotholder::before,
  .night .comment.is_selected::after {
    filter: invert(0.9);
  }

  /* img filter */
  .night .comment__message img,
  .night .comment-form__preview img,
  .night .default-block__content #facebook_like_box,
  .night .default-block__content #vk_groups,
  .night .post img,
  .night .page-header__banner img,
  .night .company_top_banner img,
  .night img .teaser__image,
  .night .teaser__image-pic,
  .night .article__body img {
    filter: brightness(0.5);
    transition: filter .6s ease-out;
  }

  .night .comment__message img:hover,
  .night .comment-form__preview img:hover,
  .night .default-block__content #facebook_like_box:hover,
  .night .default-block__content #vk_groups:hover,
  .night img[alt="en"],
  .night img[alt="habr"],
  .night img:hover,
  .night a.post-author__link img,
  .night img.user-info__image-pic,
  .night .teaser__image-pic:hover,
  .night .teaser__image:hover {
    filter: none;
  }

  /* Atelier Cave Dark */
  .night .hljs-comment,
  .night .hljs-quote {
    color:#7e7887 !important
  }
  .night .hljs-variable,
  .night .hljs-template-variable,
  .night .hljs-attribute,
  .night .hljs-regexp,
  .night .hljs-link,
  .night .hljs-tag,
  .night .hljs-name,
  .night .hljs-selector-id,
  .night .hljs-selector-class {
    color:#be4678 !important
  }
  .night .hljs-number,
  .night .hljs-meta,
  .night .hljs-built_in,
  .night .hljs-builtin-name,
  .night .hljs-literal,
  .night .hljs-type,
  .night .hljs-params {
    color:#aa573c !important
  }
  .night .hljs-string,
  .night .hljs-symbol,
  .night .hljs-bullet {
    color:#2a9292 !important
  }
  .night .hljs-title,
  .night .hljs-section {
    color:#576ddb !important
  }
  .night .hljs-keyword,
  .night .hljs-selector-tag {
    color:#955ae7 !important
  }
  .night .hljs-deletion,
  .night .hljs-addition {
    color:#19171c !important;
    display:inline-block !important;
    width:100% !important
  }
  .night .hljs-deletion {
    background-color:#be4678 !important
  }
  .night .hljs-addition {
    background-color:#2a9292 !important
  }
  .night .hljs {
    display:block !important;
    overflow-x:auto !important;
    background:#19171c !important;
    color:#8b8792 !important;
    /*padding:0.5em !important*/
  }
  .night .hljs-emphasis {
    font-style:italic !important
  }
  .night .hljs-strong {
    font-weight:bold !important
  }
  `;
}

if (FLAGS.USERSTYLE_CONFIG_INTERFACE) {
  userStyle += `
  .config_button {
    box-sizing: border-box;
    position: fixed;
    width: ${BUTTON_SIZE}px;
    height: ${BUTTON_SIZE2}px;
    right: ${BUTTON_SIZE}px;
    bottom: ${FLAGS.NIGHT_MODE ? BUTTON_SIZE4 : BUTTON_SIZE}px;
    z-index: 10000;
    background: -webkit-linear-gradient(top, #aaa 50%, transparent 50%);
    background: -moz-linear-gradient(top, #aaa 50%, transparent 50%);
    background: -moz-linear-gradient(top, #aaa 50%, transparent 50%);
    background-size: 10px 10px;
    transition: background 0.1s ease-out;
  }

  .config_button:hover {
    background: -webkit-linear-gradient(top, #333 50%, transparent 50%);
    background: -moz-linear-gradient(top, #333 50%, transparent 50%);
    background: -moz-linear-gradient(top, #333 50%, transparent 50%);
    background-size: 10px 10px;
  }

  .night .config_button {
    background: -webkit-linear-gradient(top, #515151 50%, transparent 50%);
    background: -moz-linear-gradient(top, #515151 50%, transparent 50%);
    background: -moz-linear-gradient(top, #515151 50%, transparent 50%);
    background-size: 10px 10px;
  }

  .night .config_button:hover {
    background: -webkit-linear-gradient(top, #9e9e9e 50%, transparent 50%);
    background: -moz-linear-gradient(top, #9e9e9e 50%, transparent 50%);
    background: -moz-linear-gradient(top, #9e9e9e 50%, transparent 50%);
    background-size: 10px 10px;
  }

  .config_frame {
    box-sizing: border-box;
    position: fixed;
    right: 80px;
    bottom: 32px;
    z-index: 10000;
    border: 1px solid #aaa;
    padding: 8px;
    background: #f7f7f7;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    overflow-y: auto;
    max-height: calc(100vh - 64px);
    min-width: 390px;
  }
  .config_frame label:hover {
    cursor: pointer;
    background: rgba(128, 128, 128, 0.3);
  }
  .config_frame input {
    cursor: pointer;
    position: absolute;
    opacity: 0;
  }
  .config_frame input + span:before {
    content: '';
    display: inline-block;
    width: 0.5em;
    height: 0.5em;
    margin: 0 0.4em 0.1em 0.3em;
    outline: 1px solid currentcolor;
    outline-offset: 1px;
  }
  .config_frame input:checked + span:before {
    background: currentcolor;
  }
  .night .config_frame {
    background: #22272B;
    border-color: #393d41;
  }
  `;
}

userStyleEl.innerHTML = userStyle;

const navigatorEdge = /Edge/.test(navigator.userAgent);

function readyHead(fn) {
  if (document.body) { // если есть body, значит head готов
    fn();
  } else if (document.documentElement && !navigatorEdge) {
    const observer = new MutationObserver(() => {
      if (document.body) {
        observer.disconnect();
        fn();
      }
    });
    observer.observe(document.documentElement, { childList: true });
  } else {
    // рекурсивное ожидание появления DOM
    setTimeout(() => readyHead(fn), 16);
  }
}

readyHead(() => {
  if (document.getElementById('habrafixmarker')) return;
  if (FLAGS.USERSTYLE) document.head.appendChild(userStyleEl);
  if (FLAGS.NIGHT_MODE && userConfig.getItem('night_mode')) {
    document.documentElement.classList.add('night');
  }
});

function ready(fn) {
  const { readyState } = document;
  if (readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      fn();
    });
  } else {
    fn();
  }
}

ready(() => {
  if (document.getElementById('habrafixmarker')) return;
  if (FLAGS.COMMENTS_MD) {
    const mdSelectorEl = document.getElementById('comment_markdown');
    if (mdSelectorEl) {
      if (userConfig.getItem('comment_markdown')) mdSelectorEl.checked = true;
      mdSelectorEl.addEventListener('input', () => {
        userConfig.setItem('comment_markdown', mdSelectorEl.checked);
      });
    }
  }

  if (FLAGS.HTSO_BTN) {
    const commentForm = document.getElementById('comment-form');
    if (commentForm) {
      const toolbar = commentForm.querySelector('.tm-editor__toolbar');
      if (toolbar) {
        const item = document.createElement('li');
        item.classList.add('wysiwyg-toolbar__item');
        item.innerHTML = `
          <button type="button" class="btn btn_wysiwyg" tabindex="0" title="Загрузка картинок"
            onclick="window.open('//hsto.org', '_blank').focus();">
            <svg class="icon-svg icon-svg_spoiler_wysiwyg" aria-hidden="true" aria-labelledby="title"
              version="1.1" role="img" width="24" viewBox="0 0 100 82.9">
              <path
                d="M77.9,82.9H5.6c-3.4,0-5.6-2.4-5.6-5.2V21.9c0-3.5,2.1-6.1,
                5.6-6.1H50v11.1H11v45h61V54.8l12,0v22.9 C84,80.5,81.2,82.9,77.9,82.9L77.9,82.9z">
              </path>
              <polygon points="16.5,66.9 39.8,44.6 50.2,54.4 61.5,39.6 67,50.2 67,66.9 "></polygon>
              <path
                d="M28,44.4c-3.2,0-5.7-2.6-5.7-5.7c0-3.2,2.6-5.8,5.7-5.8c3.2,0,5.8,2.6,5.8,
                5.8C33.8,41.9,31.2,44.4,28,44.4  L28,44.4z">
              </path>
              <polygon points="84,21.9 84,44 72,44 72,21.9 56.1,21.9 78.1,0 100,21.9 "></polygon>
            </svg>
          </button>
        `;
        toolbar.appendChild(item);
      }
    }
  }

  if (FLAGS.SUBS_BTN) {
    const userBtn = document.querySelector('.tabs-menu__item_link');
    const isUserPage = /^\/(ru|en)\/users\/[^/]+\//.test(window.location.pathname);
    if (userBtn && isUserPage) {
      const bar = userBtn.parentElement;

      const tab = document.createElement('a');
      const isSubs = /subscription\/$/.test(window.location.pathname);
      tab.classList.add('tabs-menu__item', 'tabs-menu__item_link');
      tab.href = `${userBtn.href}subscription/`;
      tab.innerHTML = `<h3 class="tabs-menu__item-text ${isSubs ? 'tabs-menu__item-text_active' : ''}">Он читает</h3>`;
      bar.appendChild(tab);

      const tab2 = document.createElement('a');
      const isFols = /followers\/$/.test(window.location.pathname);
      tab2.classList.add('tabs-menu__item', 'tabs-menu__item_link');
      tab2.href = `${userBtn.href}subscription/followers/`;
      tab2.innerHTML = `<h3 class="tabs-menu__item-text ${isFols ? 'tabs-menu__item-text_active' : ''}">Его читают</h3>`;
      bar.appendChild(tab2);
    }
  }

  // надо ли ещё
  Array.from(document.querySelectorAll('iframe[src^="https://codepen.io/"]'))
    .map(el => el.setAttribute('scrolling', 'no'));

  // остановка гифок по клику и воспроизведение при повторном клике
  function toggleGIF(el) {
    // если атрибут со старым линком пуст или отсутствует
    if (!el.dataset.oldSrc) {
      // заменим ссылку на data-url-svg с треугольником в круге
      const w = Math.max(el.clientWidth || 256, 16);
      const h = Math.max(el.clientHeight || 128, 16);
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) / 4;
      const ax = (r * 61) / 128;
      const by = (r * 56) / 128;
      const bx = (r * 35) / 128;
      const svg = `data:image/svg+xml;utf8,
        <svg width='${w}' height='${h}' baseProfile='full' xmlns='http://www.w3.org/2000/svg'>
          <rect x='0' y='0' width='${w}' height='${h}' fill='${FLAGS.GIF_STOP_COLOR_BG}'/>
          <circle cx='${cx}' cy='${cy}' r='${r}' fill='${FLAGS.GIF_STOP_COLOR_FG}'/>
          <polygon points='${cx + ax} ${cy} ${cx - bx} ${cy - by} ${cx - bx} ${cy + by}' fill='${FLAGS.GIF_STOP_COLOR_BG}' />
        </svg>
      `;
      el.dataset.oldSrc = el.getAttribute('src'); // eslint-disable-line no-param-reassign
      el.setAttribute('src', svg);
    } else if (FLAGS.GIF_STOP_OVERTYPE) {
      // иначе поставим svg с троеточием
      const w = el.clientWidth;
      const h = el.clientHeight;
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) / 4;
      const r2 = r / 4;
      const svg = `data:image/svg+xml;utf8,
        <svg width='${w}' height='${h}' baseProfile='full' xmlns='http://www.w3.org/2000/svg'>
          <rect x='0' y='0' width='${w}' height='${h}' fill='${FLAGS.GIF_STOP_COLOR_BG}'/>
          <circle cx='${cx - r}' cy='${cy}' r='${r2}' fill='${FLAGS.GIF_STOP_COLOR_FG}'/>
          <circle cx='${cx}' cy='${cy}' r='${r2}' fill='${FLAGS.GIF_STOP_COLOR_FG}'/>
          <circle cx='${cx + r}' cy='${cy}' r='${r2}' fill='${FLAGS.GIF_STOP_COLOR_FG}'/>
        </svg>
      `;
      el.setAttribute('src', svg);
      // когда отрендерится троеточие, можно менять на исходную гифку
      setTimeout(() => {
        if (el.dataset.oldSrc) {
          el.setAttribute('src', el.dataset.oldSrc);
          el.dataset.oldSrc = ''; // eslint-disable-line no-param-reassign
        }
      }, 100);
    } else {
      const img = document.createElement('img');
      img.setAttribute('src', el.dataset.oldSrc);
      if (el.hasAttribute('align')) {
        img.setAttribute('align', el.getAttribute('align'));
      }
      el.parentNode.insertBefore(img, el);
      img.onclick = () => toggleGIF(img); // eslint-disable-line no-param-reassign
      el.parentNode.removeChild(el);
    }
  }

  if (FLAGS.GIF_STOP) {
    Array.from(document.querySelectorAll('.post__text img[src$=".gif"], .comment__message img[src$=".gif"]'))
      .filter((el) => {
        const excludes = [
          'https://habrastorage.org/storage3/976/d3e/38a/976d3e38a34b003f86f91795524af9f8.gif',
          'https://habrastorage.org/storage3/2e2/522/737/2e2522737ec404a9f76047e108dfaea0.gif',
          'https://habrastorage.org/getpro/habr/post_images/d4b/289/ef0/d4b289ef0a00e969108c25d0c3d75f58.gif',
        ];
        return !excludes.includes(el.getAttribute('src'));
      })
      .forEach((el) => {
        if (FLAGS.GIF_STOP_ONLOAD) toggleGIF(el);
        el.classList.add('habrafix_gif-stop');
        el.onclick = () => toggleGIF(el); // eslint-disable-line no-param-reassign
      });
  }

  // счетчики кармы
  if (FLAGS.KARMA_DETAILS) {
    Array.from(document.querySelectorAll('.user-info__stats-item.stacked-counter')).forEach((itemCounter) => {
      itemCounter.style.marginRight = '16px'; // eslint-disable-line no-param-reassign
    });
    Array.from(document.querySelectorAll('.page-header__stats_karma')).forEach((karmaEl) => {
      karmaEl.style.width = 'auto'; // eslint-disable-line no-param-reassign
      karmaEl.style.minWidth = `${KARMA_WIDTH}px`; // eslint-disable-line no-param-reassign
    });
    Array.from(document.querySelectorAll(`
      .stacked-counter[href="https://habr.com/ru/info/help/karma/"],
      .stacked-counter[href="https://habr.com/en/info/help/karma/"]
    `)).forEach((counterEl) => {
      let total = parseInt(counterEl.title, 10);
      const scoreEl = counterEl.querySelector('.stacked-counter__value');
      if (!scoreEl || !total) return;
      counterEl.style.width = 'auto'; // eslint-disable-line no-param-reassign
      counterEl.style.minWidth = `${KARMA_WIDTH}px`; // eslint-disable-line no-param-reassign
      const score = parseFloat(scoreEl.innerHTML.replace('–', '-').replace(',', '.'), 10);
      if (score > total) total = score;
      const likes = (total + score) / 2;
      const percent = Math.round((100 * likes) / total);
      const details = `&nbsp;= ${total} × (${percent} − ${100 - percent})%`;
      const detailsEl = document.createElement('span');
      detailsEl.innerHTML = details;
      detailsEl.style.color = '#545454';
      detailsEl.style.fontFamily = '"-apple-system",BlinkMacSystemFont,Arial,sans-serif';
      detailsEl.style.fontSize = '13px';
      detailsEl.style.fontWeight = 'normal';
      detailsEl.style.verticalAlign = 'middle';
      scoreEl.appendChild(detailsEl);
      counterEl.title += `, ${(likes).toFixed(2)} плюсов и ${(total - likes).toFixed(2)} минусов`; // eslint-disable-line no-param-reassign
    });
  }

  // счетчики рейтинга с подробностями
  const scoresMap = new Map();

  class Score {
    constructor(el) {
      this.el = el;
      this.parentEl = el.parentNode;
      const data = this.constructor.parse(el);
      this.rating = data.rating;
      this.total = data.total;
      this.likes = data.likes;
      this.dislikes = data.dislikes;
      this.isDetailed = false;
      this.observer = new MutationObserver(() => this.update());
    }

    setDetails(isDetailed) {
      if (this.isDetailed === isDetailed) return;
      this.isDetailed = isDetailed;
      this.update();
    }

    update() {
      const newChild = this.parentEl.querySelector('.voting-wjt__counter, .post-stats__result-counter');
      if (!newChild) return;
      this.el = newChild;
      const data = this.constructor.parse(this.el);
      this.rating = data.rating;
      this.total = data.total;
      this.likes = data.likes;
      this.dislikes = data.dislikes;
      this.observer.disconnect();
      if (this.isDetailed) {
        this.details();
      } else {
        this.simply();
      }
      this.observer.observe(this.parentEl, { childList: true });
    }

    static parse(el) {
      let [, likes, dislikes] = el
        .attributes.title.textContent
        .match(/[0-9]+/g).map(Number);
      let total = likes + dislikes;
      let [, sign, rating] = el.innerHTML.match(/([–]?)(\d+)/); // eslint-disable-line prefer-const
      rating = Number(rating);
      if (sign) rating = -rating;
      // не знаю что там происходит при голосовании, так что на всякий случай
      const diff = rating - (likes - dislikes);
      if (diff < 0) {
        total += Math.abs(diff);
        dislikes += Math.abs(diff);
      } else if (diff > 0) {
        total += diff;
        likes += diff;
      }
      return {
        rating,
        total,
        likes,
        dislikes,
      };
    }

    simply() {
      let innerHTML = '';
      if (this.rating > 0) {
        innerHTML = `+${this.rating}`;
      } else if (this.rating < 0) {
        innerHTML = `–${Math.abs(this.rating)}`;
      } else {
        innerHTML = '0';
      }
      this.el.innerHTML = innerHTML;
    }

    details() {
      let innerHTML = '';
      if (this.rating > 0) {
        innerHTML = `+${this.rating}`;
      } else if (this.rating < 0) {
        innerHTML = `–${Math.abs(this.rating)}`;
      } else {
        innerHTML = '0';
      }
      if (this.total !== 0) {
        let details = '';
        if (FLAGS.RATING_DETAILS_PN) {
          const percent = Math.round((100 * this.likes) / this.total);
          details = `&nbsp;= ${this.total} × (${percent} − ${100 - percent})%`;
        } else {
          details = `&nbsp;= ${this.likes} − ${this.dislikes}`;
        }
        innerHTML += ` <span style='color: #545454; font-weight: normal'>${details}</span>`;
      }
      this.el.innerHTML = innerHTML;
    }
  }

  // парсим их
  Array.from(document.querySelectorAll('.voting-wjt__counter, .post-stats__result-counter')).forEach((el) => {
    scoresMap.set(el, new Score(el));
  });

  // добавляем подробностей
  if (FLAGS.RATING_DETAILS) {
    if (FLAGS.RATING_DETAILS_ONCLICK) {
      const isDetailed = userConfig.getItem('scores_details');
      if (isDetailed) scoresMap.forEach(score => score.setDetails(isDetailed));
      scoresMap.forEach((score) => {
        score.el.onclick = () => { // eslint-disable-line no-param-reassign
          const nowDetailed = userConfig.shiftItem('scores_details');
          scoresMap.forEach(s => s.setDetails(nowDetailed));
        };
      });
    } else {
      scoresMap.forEach(score => score.setDetails(true));
    }
  }

  // метки времени и работа с ними
  const pageLoadTime = new Date();
  const monthNames = [
    'января', 'февраля', 'марта',
    'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября',
    'октября', 'ноября', 'декабря',
  ];
  const monthNamesEng = [
    'January', 'February', 'March',
    'April', 'May', 'June',
    'July', 'August', 'September',
    'October', 'November', 'December',
  ];

  class HabraTime {
    constructor(el, parent) {
      this.el = el;
      this.parent = parent;
      this.attrDatetime = this.constructor.getAttributeDatetime(el);
      this.date = new Date(this.attrDatetime);
    }

    // вот было бы хорошо, если б на хабре были datetime атрибуты
    static getAttributeDatetime(el) {
      const imagination = el.getAttribute('datetime') || el.getAttribute('data-time_published');
      if (imagination) return imagination;

      let recently;
      let day;
      let month;
      let year;
      let time;
      let isEng = false;
      let meridiem;
      if (/^\d\d:\d\d$/.test(el.innerHTML)) {
        [, time] = el.innerHTML.match(/(\d\d:\d\d)/);
        recently = 'сегодня';
      } else if (/^\d\d:\d\d (AM|PM)$/.test(el.innerHTML)) {
        [, time, meridiem] = el.innerHTML.match(/(\d\d:\d\d) (AM|PM)/);
        recently = 'сегодня';
      } else if (/at/.test(el.innerHTML)) {
        isEng = true;
        const re = /((today|yesterday)|([A-z]+) (\d+), (\d+)) at (\d\d:\d\d) (AM|PM)/;
        [,,
          recently,
          month, day, year,
          time,
          meridiem,
        ] = el.innerHTML.match(re);

        if (recently === 'today') {
          recently = 'сегодня';
        } else if (recently === 'yesterday') {
          recently = 'вчера';
        }
      } else {
        const re = /((сегодня|вчера)|(\d+)[ .]([а-я]+|\d+)[ .]?(\d+)?) в (\d\d:\d\d)/;
        [,,
          recently,
          day, month, year,
          time,
        ] = el.innerHTML.match(re);
      }

      const [, h, m] = time.match(/(\d\d):(\d\d)/);
      if (meridiem === 'PM') {
        time = `${Number(h === '12' ? 0 : h) + 12}:${m}`;
      } else if (meridiem === 'AM') {
        time = `${h === '12' ? '00' : h}:${m}`;
      }

      // и местное время
      let moscow;
      if (recently || year === undefined) {
        const offsetMoscow = 3 * 60 * 60 * 1000;
        const yesterdayShift = (recently === 'вчера') ? 24 * 60 * 60 * 1000 : 0;
        const offset = pageLoadTime.getTimezoneOffset() * 60 * 1000;
        const value = (pageLoadTime - yesterdayShift) + offsetMoscow + offset;
        moscow = new Date(value);
      }

      if (recently) {
        day = moscow.getDate();
        month = moscow.getMonth() + 1;
      } else if (month.length !== 2) {
        month = (isEng ? monthNamesEng : monthNames).indexOf(month) + 1;
      } else {
        month = +month;
      }

      if (day < 10) day = `0${+day}`;
      if (month < 10) month = `0${month}`;
      if (year < 100) year = `20${year}`;
      if (year === undefined) year = moscow.getFullYear();

      return `${year}-${month}-${day}T${time}+03:00`;
    }

    absolute() {
      let result = '';

      const time = this.date;
      const day = time.getDate();
      const month = time.getMonth();
      const monthName = monthNames[month];
      const year = time.getFullYear();
      const hours = time.getHours();
      const minutes = time.getMinutes();

      const now = new Date();
      const nowDay = now.getDate();
      const nowMonth = now.getMonth();
      const nowYear = now.getFullYear();

      const yesterday = new Date(now - (24 * 60 * 60 * 1000));
      const yesterdayDay = yesterday.getDate();
      const yesterdayMonth = yesterday.getMonth();
      const yesterdayYear = yesterday.getFullYear();

      const hhmm = `${hours}:${minutes >= 10 ? minutes : `0${minutes}`}`;

      const isToday =
        day === nowDay &&
        month === nowMonth &&
        year === nowYear;
      const isYesterday =
        day === yesterdayDay &&
        month === yesterdayMonth &&
        year === yesterdayYear;

      if (isToday) {
        result = `сегодня в ${hhmm}`;
      } else if (isYesterday) {
        result = `вчера в ${hhmm}`;
      } else if (nowYear === year) {
        result = `${day} ${monthName} в ${hhmm}`;
      } else {
        result = `${day} ${monthName} ${year} в ${hhmm}`;
      }

      return result;
    }

    static relative(milliseconds) {
      let result = '';

      const pluralForm = (n, forms) => {
        if (n % 10 === 1 && n % 100 !== 11) return forms[0];
        if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return forms[1];
        return forms[2];
      };

      const formats = [
        ['год', 'года', 'лет'],
        ['месяц', 'месяца', 'месяцев'],
        ['день', 'дня', 'дней'],
        ['час', 'часа', 'часов'],
        ['минуту', 'минуты', 'минут'],
      ];

      const minutes = milliseconds / 60000;
      const hours = minutes / 60;
      const days = hours / 24;
      const months = days / 30;
      const years = months / 12;
      const idx = [years, months, days, hours, minutes].findIndex(x => x >= 1);

      if (idx === -1) {
        result = 'несколько секунд';
      } else {
        const value = Math.floor([years, months, days, hours, minutes][idx]);
        const forms = formats[idx];
        const form = pluralForm(value, forms);
        result = `${value} ${form}`;
      }
      return result;
    }

    fromNow() {
      const diff = Math.abs(Date.now() - this.date);
      return `${this.constructor.relative(diff)} назад`;
    }

    fromParent() {
      const diff = Math.abs(this.date - this.parent.date);
      return `через ${this.constructor.relative(diff)}`;
    }

    static datetimeToMsk(datetime) {
      const [, yyyy, mm, dd, h, m] = datetime
        .match(/([0-9]+)-([0-9]+)-([0-9]+)T([0-9]+):([0-9]+)/);
      return `${Number(dd)} ${monthNames[mm - 1]} ${yyyy} в ${h}:${m}`;
    }
  }

  // собираем метки времени
  const datesMap = new Map();
  const megapostTimeEl = document.querySelector('.megapost-head__meta > .list_inline > .list__item');
  (megapostTimeEl ? [megapostTimeEl] : [])
    .concat(Array.from(document.querySelectorAll(`
        .post__time,
        .preview-data__time-published,
        time.comment__date-time_published,
        .tm-post__date,
        .user-message__date-time,
        .news-topic__attr_date-time
      `))).forEach((el) => {
      datesMap.set(el, new HabraTime(el));
    });

  function updateTime(el) {
    datesMap.forEach((habraTime) => {
      if (
        !habraTime.el ||
        !document.body.contains(habraTime.el) ||
        (el && el !== habraTime.el)
      ) return;
      let type;
      let otherTypes;
      if (habraTime.parent) {
        type = userConfig.config.time_comments;
        otherTypes = userConfig.model.time_comments
          .filter(str => str !== type);
      } else {
        type = userConfig.config.time_publications;
        otherTypes = userConfig.model.time_publications
          .filter(str => str !== type);
      }
      const title = otherTypes.map(otherType => habraTime[otherType]()).join(', ');
      habraTime.el.innerHTML = habraTime[type](); // eslint-disable-line no-param-reassign
      habraTime.el.setAttribute('title', title);
    });
  }

  if (FLAGS.TIME_DETAILS) {
    datesMap.forEach((habraTime) => {
      habraTime.el.setAttribute(
        'style',
        'cursor: pointer; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none; user-select: none;',
      );
      habraTime.el.onclick = () => { // eslint-disable-line no-param-reassign
        if (habraTime.parent) {
          userConfig.shiftItem('time_comments');
        } else {
          userConfig.shiftItem('time_publications');
        }
        updateTime();
      };
    });
    // подождём, когда дерево комментариев будет построено
    // у некоторых меток времени будут установлены родители
    // тогда и обновим их тексты
    setTimeout(updateTime, 100);
    setInterval(updateTime, 30 * 1000);
  }

  // время публикации, понадобится для корня древа комментариев
  let datePublication = datesMap.get(megapostTimeEl || document.querySelector('.post__time'));
  // если нету публикации поищем самую раннюю метку времени
  if (!datePublication) {
    datePublication = { date: pageLoadTime };
    datesMap.forEach((date) => {
      if (date.date < datePublication.date) datePublication = date;
    });
  }

  if (FLAGS.FIND_COMMENTS) {
    const commentsList = document.querySelector('.user_comments');
    const match = document.location.pathname.match(/users\/([^/]+)\/comments/i);
    if (match && commentsList) {
      const nickname = match[1];
      const originalTitle = document.title;

      const searchForm = document.createElement('div');
      searchForm.classList.add('search-form', 'search-form_expanded');
      searchForm.style.width = 'auto';
      searchForm.innerHTML = `
        <span class="search-field__icon icon-svg_search" style="left: 0;"><svg class="icon-svg" width="32" height="32"
        viewBox="0 0 32 32" aria-hidden="true" version="1.1" role="img"><path d="M21.416 13.21c0 4.6-3.65 8.34-8.14
        8.34S5.11 17.81 5.11 13.21c0-4.632 3.65-8.373 8.167-8.373 4.488 0 8.14 3.772 8.14 8.372zm1.945
        7.083c1.407-2.055 2.155-4.57 2.155-7.084C25.515 6.277 20.04.665 13.277.665S1.04 6.278 1.04 13.21c0 6.93 5.475
        12.542 12.237 12.542 2.454 0 4.907-.797 6.942-2.208l7.6 7.79 3.14-3.22-7.6-7.82z"></path></svg></span>
        <span class="search-field__icon icon-svg_loading" style="left: 0;"><svg class="icon-svg" width="40" height="40"
        viewBox="0 0 100 100" enable-background="new 0 0 0 0"><circle cx="50" cy="50" fill="none" stroke="#333333"
        stroke-width="4" r="20" stroke-dasharray="94.24777960769379 33.41592653589793"
        transform="rotate(88.5132 50 50)"><animateTransform attributeName="transform" type="rotate" calcMode="linear"
        values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform>
        </circle></svg></span>
        <label
          id="comments_search_label"
          class="search-form__field-wrapper"
          style="background: linear-gradient(to right, rgba(84, 142, 170, 0.2) 0%, transparent 0%)"
        >
          <input type="text" class="search-form__field" id="search-comments-field" placeholder="Поиск по тексту комментариев"
            style="position: absolute;background-color: transparent;">
          <button type="button" class="btn btn_search-close" id="search-comments-clear" title="Очистить">
            <svg class="icon-svg icon-svg_navbar-close-search" width="31" height="32" viewBox="0 0 31 32" aria-hidden="true" version="1.1" role="img">
              <path d="M26.67 0L15.217 11.448 3.77 0 0 3.77l11.447 11.45L0 26.666l3.77
                3.77L15.218 18.99l11.45 11.448 3.772-3.77-11.448-11.45L30.44 3.772z">
              </path>
            </svg>
          </button>
        </label>
      `;

      const notFoundLabel = document.createElement('p');
      notFoundLabel.style.textAlign = 'center';
      notFoundLabel.style.fontSize = '18px';
      notFoundLabel.style.color = 'gray';
      notFoundLabel.style.display = 'none';
      notFoundLabel.textContent = 'Ничего не найдено';

      const commentsSubList = document.createElement('ul');
      commentsSubList.classList.add('content-list', 'content-list_comments');
      commentsSubList.id = 'search-comments';
      commentsSubList.style.display = 'none';
      commentsList.insertBefore(commentsSubList, commentsList.firstChild);
      commentsList.insertBefore(notFoundLabel, commentsList.firstChild);
      commentsList.insertBefore(searchForm, commentsList.firstChild);

      const Progress = {
        set(value) {
          if (value === 1) {
            document.title = 'Поиск завершён';
            this.setProgressBar(0);
          } else {
            const percent = Math.round(value * 100);
            document.title = `${percent}%, идёт поиск`;
            this.setProgressBar(value);
          }
        },
        setProgressBar(value) {
          const percent = value * 100;
          document.getElementById('comments_search_label').style.background = `
            linear-gradient(to right, rgba(84, 142, 170, 0.2) ${percent}%, transparent ${percent}%)
          `;
        },
        reset() {
          this.setProgressBar(0);
          document.title = originalTitle;
        },
      };

      const makeComment = (comment) => {
        const commentEl = document.createElement('li');
        commentEl.classList.add('content-list__item', 'content-list__item_comment', 'content-list__item_comment-plain');
        let ratingClass = '';
        let rating = '0';
        if (comment.score > 0) {
          rating = `+${comment.score}`;
          ratingClass = 'voting-wjt__counter_positive';
        } else if (comment.score < 0) {
          rating = `–${Math.abs(comment.score)}`;
          ratingClass = 'voting-wjt__counter_negative';
        }
        let avatar;
        if (comment.avatar === 'https://habr.com/images/avatars/stub-user-middle.gif') {
          avatar = `<svg class="default-image default-image_mini default-image_green" width="24"
          height="24"><use xlink:href="https://habr.com/images/1558430991/common-svg-sprite.svg#slug"></use></svg>`;
        } else {
          avatar = `<img src="${comment.avatar}" class="user-info__image-pic user-info__image-pic_small" width="24" height="24">`;
        }
        commentEl.innerHTML = `
          <div class="comment__post-title">
          <a href="${comment.post.url}" class="comment__post-link">${comment.post.title}</a>
          <div class="comment__post-footer">
          <a href="${comment.post.url}#comments">
          <svg class="icon-svg_comments icon-svg_comments-plain" width="14" height="13">
          <use xlink:href="https://habr.com/images/1556525186/common-svg-sprite.svg#comment"></use>
          </svg>
          <span class="comment__post-comments-counter">${comment.post.comments_count}</span>
          </a>
          </div>
          </div>
          <div class="comment comment_plain" rel="${comment.id}" id="habrafix_comment_${comment.id}">
          <div class="comment__head">
          <a href="https://habr.com/ru/users/${comment.author.login}/"
          class="user-info user-info_inline" rel="user-popover" data-user-login="${comment.author.login}">
          ${avatar}
          <span class="user-info__nickname user-info__nickname_small user-info__nickname_comment">${comment.author.login}</span>
          </a>
          <svg class="icon_comment-edit" title="Комментарий был изменен"
          style="display: ${comment.time_changed !== '0' ? 'block' : 'none'}" width="12"
          height="12"><use xlink:href="https://habr.com/images/1558430991/common-svg-sprite.svg#pencil"></use></svg>
          <time class="comment__date-time comment__date-time_published"
          datetime="${comment.time_published}">${comment.time_published}</time>
          <ul class="inline-list inline-list_comment-nav">
          <li class="inline-list__item inline-list__item_comment-nav">
          <a href="${comment.post.url}#comment_${comment.id}" class="icon_comment-anchor"
          title="Ссылка на комментарий"><svg width="12" height="12">
          <use xlink:href="https://habr.com/images/1556525186/common-svg-sprite.svg#anchor"></use></svg></a>
          </li>
          <li class="inline-list__item inline-list__item_comment-nav">
          <a href="#" class="icon_comment-bookmark " onclick="comments_add_to_favorite(this)" data-type="3"
          data-id="${comment.id}" data-action="add" title="Добавить в закладки">
          <svg width="12" height="12"><use xlink:href="https://habr.com/images/1556525186/common-svg-sprite.svg#book"></use></svg>
          </a>
          </li>
          </ul>
          <div class="voting-wjt voting-wjt_comments js-comment-vote">
          <span class="voting-wjt__counter ${ratingClass}
          js-score" title="Общий рейтинг ${rating}">${rating}</span>
          </div>
          </div>
          <div class="comment__message">${comment.message}</div>
          </div>`;
        return commentEl;
      };

      const addComment = (comment) => {
        document.getElementById('search-comments').appendChild(makeComment(comment));
        const timeEl = document.querySelector(`#habrafix_comment_${comment.id} time`);
        if (FLAGS.TIME_DETAILS) {
          timeEl.setAttribute(
            'style',
            'cursor: pointer; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none; user-select: none;',
          );
          timeEl.onclick = () => { // eslint-disable-line no-param-reassign
            userConfig.shiftItem('time_publications');
            updateTime();
          };
          datesMap.set(timeEl, new HabraTime(timeEl));
          updateTime(timeEl);
        } else {
          timeEl.textContent = HabraTime.datetimeToMsk(comment.time_published);
        }
      };

      // let fetchCors = url => fetch(`https://cors.io/?${url}`);
      let fetchCors = url => fetch(url);

      if (typeof GM !== 'undefined' && GM.xmlHttpRequest) {
        fetchCors = url => new Promise((resolve, reject) => GM.xmlHttpRequest({
          method: 'GET',
          url,
          onload(response) {
            resolve({
              json: () => Promise.resolve(JSON.parse(response.responseText)),
            });
          },
          onerror() { reject(); },
          ontimeout() { reject(); },
        }));
      }

      const loadComments = async (page) => {
        const url = `https://m.habr.com/kek/v1/users/${nickname}/comments?comments=true&user=${nickname}&page=${page}`;
        const res = await fetchCors(url);
        const json = await res.json();
        return json.data;
      };

      const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

      const pageCache = {};
      const memoizedLoadComments = async (page) => {
        if (pageCache[page]) {
          await sleep(0);
          return pageCache[page];
        }
        const result = await loadComments(page);
        pageCache[page] = result;
        return result;
      };

      let latestSearchId = 0;

      const removeResultsList = () => {
        document.getElementById('search-comments-field').value = '';
        latestSearchId += 1;
        document.getElementById('search-comments').innerHTML = '';
        document.getElementById('search-comments').style.display = 'none';
        document.getElementById('comments').style.display = '';
        const footer = document.querySelector('.page__footer');
        if (footer) footer.style.display = '';
        Progress.reset();
        notFoundLabel.style.display = 'none';
        searchForm.classList.remove('loading');
      };

      const addResultsList = () => {
        document.getElementById('search-comments').innerHTML = '';
        document.getElementById('search-comments').style.display = '';
        document.getElementById('comments').style.display = 'none';
        const footer = document.querySelector('.page__footer');
        if (footer) footer.style.display = 'none';
        Progress.set(0);
        notFoundLabel.style.display = 'none';
        searchForm.classList.add('loading');
      };

      document.getElementById('search-comments-clear').onclick = removeResultsList;

      // eslint-disable-next-line consistent-return
      const search = async () => {
        latestSearchId += 1;
        const currentSearchId = latestSearchId;

        const text = document.getElementById('search-comments-field').value;
        if (!text) return removeResultsList();

        addResultsList();

        const filter = (comment) => {
          const t = text.toLowerCase();
          const message = comment.message.toLowerCase();
          const title = comment.post.title.toLowerCase();
          return message.includes(t) || title.includes(t);
        };

        let pages = 1;
        for (let curPage = 1; curPage <= pages; curPage += 1) {
          let data;

          while (!data) {
            try {
              // eslint-disable-next-line no-await-in-loop
              data = await memoizedLoadComments(curPage);
            } catch (e) {
              document.title = 'Ошибка сети, повтор...';
              // eslint-disable-next-line no-await-in-loop
              await sleep(5000);
            }
          }

          // eslint-disable-next-line consistent-return
          if (currentSearchId !== latestSearchId) return; // пользователь изменил текст

          pages = pages === 1 ? data.pages : pages;
          Progress.set(curPage / pages);

          data.comments
            .filter(filter)
            .forEach(addComment);
        }

        if (commentsSubList.childNodes.length === 0) notFoundLabel.style.display = '';
        searchForm.classList.remove('loading');
      };

      const awaitEndOfInput = (func, ms) => {
        let timerId;
        return () => {
          clearTimeout(timerId);
          timerId = setTimeout(func, ms);
        };
      };

      document.getElementById('search-comments-field').oninput = awaitEndOfInput(search, 1000);
    }
  }

  // создаем дерево комментариев
  class ItemComment {
    constructor(el, parent) {
      this.parent = parent;
      this.el = el;
      this.lvl = parent.lvl + 1;
      this.id = Number(el.getAttribute('rel'));
      this.commentEl = el.querySelector('.comment');
      if (this.commentEl) {
        this.timeEl = this.commentEl.querySelector('time');
        this.ratingEl = this.commentEl.querySelector('.js-score');
      }
      this.date = datesMap.get(this.timeEl);
      if (this.date) {
        this.date.parent = parent.date;
      } else {
        this.date = parent.date;
      }
      this.votes = scoresMap.get(this.ratingEl) || {
        total: 0, likes: 0, dislikes: 0, rating: 0,
      };
      this.elList = el.querySelector('.content-list_nested-comments');
    }

    existId(id) {
      return !!this.elList.querySelector(id);
    }

    existNew() {
      return !!this.elList.querySelector('.js-comment_new');
    }

    getLength() {
      let { length } = this.list;
      this.list.forEach((node) => {
        length += node.getLength();
      });
      return length;
    }
  }

  class CommentsTree {
    constructor() {
      this.root = {
        isRoot: true,
        date: datePublication,
        lvl: 0,
        elList: document.getElementById('comments-list'),
        list: [],
      };
    }

    static exist() {
      return !!document.getElementById('comments-list');
    }

    update() {
      if (!this.root.elList) return;
      const recAdd = (node) => {
        node.list = Array.from(node.elList.children) // eslint-disable-line no-param-reassign
          .map(el => new ItemComment(el, node));
        node.list.forEach(recAdd);
      };
      recAdd(this.root);
    }

    walkTree(fn) {
      const walk = (tree) => {
        fn(tree);
        tree.list.forEach(walk);
      };
      walk(this.root);
    }

    sort(fn) {
      if (!this.root.elList) return;
      this.walkTree((tree) => {
        tree.list.sort(fn).forEach(subtree => tree.elList.appendChild(subtree.el));
      });
    }

    shuffle() {
      if (!this.root.elList) return;
      const randInt = maximum => Math.floor(Math.random() * (maximum + 1));
      this.walkTree((tree) => {
        const { list } = tree;
        for (let i = 0; i < list.length; i += 1) {
          const j = randInt(i);
          [list[i], list[j]] = [list[j], list[i]];
        }
        list.forEach(subtree => tree.elList.appendChild(subtree.el));
      });
    }
  }

  const commentsTree = new CommentsTree();
  commentsTree.update();

  FLAGS.sortVariants = [
    ['time', 'старые'],
  ];

  if (FLAGS.COMMENTS_SORT_BY_FRESHNESS) FLAGS.sortVariants.push(['freshness', 'новые']);
  if (FLAGS.COMMENTS_SORT_BY_TREND) FLAGS.sortVariants.push(['trend', 'горячие']);
  if (FLAGS.COMMENTS_SORT_BY_QUALITY) FLAGS.sortVariants.push(['quality', 'хорошие']);
  if (FLAGS.COMMENTS_SORT_BY_REDDIT) FLAGS.sortVariants.push(['reddit', 'проверенные']);
  if (FLAGS.COMMENTS_SORT_BY_RATING) FLAGS.sortVariants.push(['rating', 'рейтинговые']);
  if (FLAGS.COMMENTS_SORT_BY_POPULARITY) FLAGS.sortVariants.push(['popularity', 'популярные']);
  if (FLAGS.COMMENTS_SORT_BY_RANDOM) FLAGS.sortVariants.push(['shuffle', 'случайные']);

  // здесь начинается сортировка комментариев
  const commentsOrderEl = document.createElement('div');
  commentsOrderEl.classList.add('comments_order');
  commentsOrderEl.innerHTML = FLAGS.sortVariants.map(([type, text]) => {
    const underline = (type === 'time') ? '; text-decoration: underline' : '';
    return `<a data-order="${type}" style="cursor: pointer${underline}">${text}</a>`;
  }).join(', ');

  if (FLAGS.COMMENTS_SORT && document.getElementById('comments-list')) {
    const commentsList = document.getElementById('comments-list');
    commentsList.parentElement.insertBefore(commentsOrderEl, commentsList);
  }

  const commentsComparators = {
    time(a, b) {
      return a.id - b.id;
    },

    freshness(a, b) {
      return b.id - a.id;
    },

    rating(a, b) {
      const ascore = a.votes.rating;
      const bscore = b.votes.rating;
      if (bscore !== ascore) return bscore - ascore;
      return b.id - a.id;
    },

    popularity(a, b) {
      const aVotes = a.votes.total;
      const bVotes = b.votes.total;
      if (aVotes !== bVotes) return bVotes - aVotes;
      const aLength = a.getLength();
      const bLength = b.getLength();
      if (aLength !== bLength) return bLength - aLength;
      return b.id - a.id;
    },

    quality(a, b) {
      const aQuality = a.votes.rating / a.votes.total || 0;
      const bQuality = b.votes.rating / b.votes.total || 0;
      if (aQuality !== bQuality) return bQuality - aQuality;
      if (a.votes.rating !== b.votes.rating) return b.votes.rating - a.votes.rating;
      return b.id - a.id;
    },

    trend(a, b) {
      // в первые сутки после публикации статьи число посещений больше чем в остальное время
      const oneDay = 24 * 60 * 60 * 1000;
      const firstDayEnd = +datePublication.date + oneDay;
      // у комментария есть только три дня на голосование с момента его создания
      const threeDays = 3 * oneDay;
      const now = Date.now();

      // прикинем число голосов в первый день
      const aDate = +a.date.date;
      let aViews = 0;
      // в первый день
      if (aDate <= firstDayEnd) {
        aViews += Math.min(firstDayEnd, now) - aDate;
      }
      // и в остальное время
      if (now >= firstDayEnd) {
        const threeDaysEnd = aDate + threeDays;
        // для этого соотношения я собрал статистику
        aViews += (Math.min(threeDaysEnd, now) - Math.max(firstDayEnd, aDate)) / 16;
      }
      const aScore = a.votes.rating / aViews;

      // аналогично
      const bDate = +b.date.date;
      let bViews = 0;
      if (bDate <= firstDayEnd) {
        bViews += Math.min(firstDayEnd, now) - bDate;
      }
      if (now >= firstDayEnd) {
        const threeDaysEnd = bDate + threeDays;
        // найти зависимость активности голосования от времени суток не удалось
        bViews += (Math.min(threeDaysEnd, now) - Math.max(firstDayEnd, bDate)) / 16;
      }
      const bScore = b.votes.rating / bViews;

      if (bScore === aScore) return b.id - a.id;
      return bScore - aScore;
    },

    reddit(a, b) {
      const wilsonScore = (ups, downs) => {
        const n = ups + downs;
        if (n === 0) return 0;
        const z = 1.281551565545;
        const p = ups / n;
        const left = p + ((1 / (2 * n)) * z * z);
        const right = z * Math.sqrt(((p * (1 - p)) / n) + ((z * z) / (4 * n * n)));
        const under = 1 + ((1 / n) * (z * z));
        return (left - right) / under;
      };
      const aScore = wilsonScore(a.votes.likes, a.votes.dislikes);
      const bScore = wilsonScore(b.votes.likes, b.votes.dislikes);
      if (bScore === aScore) return b.id - a.id;
      return bScore - aScore;
    },
  };

  const sortComments = () => {
    const order = userConfig.getItem('comments_order');

    Array.from(commentsOrderEl.children).forEach((el) => {
      if (el.dataset.order === order) {
        el.style.textDecoration = 'underline'; // eslint-disable-line no-param-reassign
      } else {
        el.style.textDecoration = ''; // eslint-disable-line no-param-reassign
      }
    });

    if (order === 'shuffle') {
      commentsTree.shuffle();
    } else {
      const compare = commentsComparators[order];
      commentsTree.sort(compare);
    }
  };

  // сортируем комменты при загрузке страницы
  // или не сортируем, если они уже по порядку
  if (FLAGS.COMMENTS_SORT && FLAGS.COMMENTS_SORT_ONLOAD && userConfig.getItem('comments_order') !== 'time') {
    sortComments();
  }

  Array.from(commentsOrderEl.children).forEach((el) => {
    el.onclick = () => { // eslint-disable-line no-param-reassign
      userConfig.setItem('comments_order', el.dataset.order);
      sortComments();
    };
  });


  // меняем ссылки ведущие к новым комментариям на ссылки к началу комментариев
  if (FLAGS.COMMENTS_LINKS) {
    const commentsLinks = document.getElementsByClassName('post-stats__comments-link');

    for (let i = 0; i < commentsLinks.length; i += 1) {
      const iLink = commentsLinks[i];
      const hrefValue = iLink.getAttribute('href');
      const hrefToComments = hrefValue.replace('#first_unread', '#comments');
      iLink.setAttribute('href', hrefToComments);
    }
  }

  // сворачивание комментов
  // eslint-disable-next-line no-constant-condition
  if (false) { // FLAGS.COMMENTS_HIDE
    const commentHash = window.location.hash;

    const toggle = (subtree) => {
      const listLength = subtree.list.length;
      if (listLength === 0) return;
      /* eslint-disable */
      if (subtree.switcherEl.dataset.isVisibleList === 'true') {
        subtree.switcherEl.dataset.isVisibleList = 'false';
        subtree.switcherEl.innerHTML = `\u229E раскрыть ветку ${subtree.getLength()}`;
        subtree.elList.style.display = 'none';
      } else {
        subtree.switcherEl.dataset.isVisibleList = 'true';
        subtree.switcherEl.innerHTML = '\u229F';
        subtree.elList.style.display = 'block';
      }
      /* eslint-enable */
    };

    commentsTree.walkTree((subtree) => {
      // не пытаемся сворачивать корень
      if (subtree.isRoot) return;
      // у похищенных нет футера
      const footerEl = subtree.commentEl.querySelector('.comment__footer');
      if (footerEl === null) return;
      // создаём переключатель
      const switcher = document.createElement('a');
      switcher.classList.add('comment__footer-link');
      switcher.classList.add('comment__switcher');
      switcher.dataset.isVisibleList = 'true';

      switcher.innerHTML = '\u229F';
      if (subtree.list.length === 0) switcher.innerHTML = '\u22A1';
      switcher.style.cursor = 'pointer';
      switcher.style.marginLeft = '-5px';

      footerEl.insertBefore(switcher, footerEl.children[0]);
      subtree.switcherEl = switcher; // eslint-disable-line no-param-reassign

      switcher.onclick = () => toggle(subtree);

      const isHideLvl = subtree.lvl === FLAGS.HIDE_LEVEL && FLAGS.HIDE_LEVEL_4;
      const isLineLvl = subtree.lvl % FLAGS.LINE_LEN === 0;
      if (isLineLvl) {
        subtree.elList.classList.add('comments_new-line');
        const lineNumber = subtree.lvl / FLAGS.LINE_LEN;
        subtree.elList.classList.add(`comments_new-line-${lineNumber % 4}`);
      }
      // при запуске не сворачиваем ветки с новыми комментами, и содержащие целевой id
      if (
        (isHideLvl || isLineLvl) && !subtree.existNew() &&
        !(commentHash && subtree.existId(commentHash))
      ) {
        toggle(subtree);
      }
    });
  }

  if (FLAGS.SCROLL_LEGEND) {
    const postBodyEl = document.querySelector('.post__body_full') || document.querySelector('.article__body');
    const commentsEl = document.getElementById('comments-list');
    const getPercents = (el) => {
      if (!el) return { topPercent: 0, heightPercent: 0 };
      const pageHeight = document.documentElement.scrollHeight;
      const top = el.getBoundingClientRect().top + window.pageYOffset;
      const topPercent = ((100 * top) / pageHeight).toFixed(2);
      const height = el.clientHeight;
      const heightPercent = ((100 * height) / pageHeight).toFixed(2);

      return { topPercent, heightPercent };
    };

    const updateLegend = (pageEl, legendEl) => {
      const { topPercent, heightPercent } = getPercents(pageEl);
      legendEl.style.top = `${topPercent}%`; // eslint-disable-line no-param-reassign
      legendEl.style.height = `${heightPercent}%`; // eslint-disable-line no-param-reassign
    };

    const legendPost = document.createElement('div');
    legendPost.classList.add('legend_el');
    legendPost.style.background = 'rgba(84, 142, 170, 0.66)';
    updateLegend(postBodyEl, legendPost);
    document.body.appendChild(legendPost);

    const legendComments = document.createElement('div');
    legendComments.classList.add('legend_el');
    legendComments.style.background = 'rgba(49, 176, 7, 0.66)';
    updateLegend(commentsEl, legendComments);
    document.body.appendChild(legendComments);

    setInterval(() => {
      updateLegend(postBodyEl, legendPost);
      updateLegend(commentsEl, legendComments);
    }, 1000);
  }

  if (FLAGS.NIGHT_MODE) {
    const switcherEl = document.createElement('div');
    switcherEl.classList.add('night_mode_switcher');
    switcherEl.onclick = () => {
      const isNightMode = userConfig.shiftItem('night_mode');
      document.documentElement.classList.toggle('night', isNightMode);
    };
    document.body.appendChild(switcherEl);
    setInterval(() => {
      const boolClass = document.documentElement.classList.contains('night');
      const isNightMode = userConfig.getItem('night_mode');
      if (boolClass !== isNightMode) {
        document.documentElement.classList.toggle('night', isNightMode);
      }
    }, 1000);
  }

  if (FLAGS.CONFIG_INTERFACE) {
    const configFrame = document.createElement('div');
    configOptions.forEach(([key, text]) => {
      if (typeof FLAGS[key] !== 'boolean') return;
      const inputEl = document.createElement('input');
      inputEl.type = 'checkbox';
      inputEl.value = key;
      inputEl.checked = FLAGS[key];
      const labelEl = document.createElement('label');
      labelEl.setAttribute('unselectable', 'on');
      labelEl.setAttribute('onselectstart', 'return false');
      const spanEl = document.createElement('span');
      spanEl.innerHTML = text;
      configFrame.appendChild(labelEl);
      labelEl.appendChild(inputEl);
      labelEl.appendChild(spanEl);
      inputEl.onchange = () => {
        FLAGS[key] = inputEl.checked;
        localStorage.setItem('habrafixFlags', JSON.stringify(FLAGS));
      };
      configFrame.appendChild(document.createElement('br'));
    });
    const reloadText = document.createElement('div');
    reloadText.style.textAlign = 'right';
    reloadText.innerHTML = `
      * чтобы увидеть изменения
      <a  href="#" onclick="location.reload(); return false">
        обновите страницу
      </a>`;
    configFrame.appendChild(reloadText);
    configFrame.classList.add('config_frame');
    configFrame.style.display = 'none';
    document.body.appendChild(configFrame);

    const configButton = document.createElement('div');
    configButton.classList.add('config_button');
    document.body.appendChild(configButton);

    configButton.onclick = () => {
      if (configFrame.style.display) {
        configFrame.style.display = '';
      } else {
        configFrame.style.display = 'none';
      }
    };
  }

  setTimeout(() => {
    const marker = document.createElement('meta');
    marker.id = 'habrafixmarker';
    document.head.appendChild(marker);
  }, 300);
});
