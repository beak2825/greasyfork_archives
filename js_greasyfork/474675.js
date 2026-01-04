// ==UserScript==
// @name        EasierMod lvl 2
// @namespace   Violentmonkey Scripts
// @match       *://2ch.hk/*
// @match       *://2ch.life/*
// @match       *://2ch.su/*
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @version     1.4.5
// @author      miotyanochka
// @description Enterprise-grade production code
// @license WTFPL
// @downloadURL https://update.greasyfork.org/scripts/474675/EasierMod%20lvl%202.user.js
// @updateURL https://update.greasyfork.org/scripts/474675/EasierMod%20lvl%202.meta.js
// ==/UserScript==

//
// Б-же, как же хочется засунуть это все в вебпак

const styleDeleted = `.post_type_deleted {
  background: repeating-linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.0),
    rgba(0, 0, 0, 0.0) 10px,
    rgba(255, 0, 0, 0.1) 10px,
    rgba(255, 0, 0, 0.1) 20px
  )
}`;

const styleHiddenImportant = `.element_hidden_important {
  display: none !important;
}`;

const styleInlineImportant = `.element_inline_important {
  display: inline-block !important;
}`;

const headerExtraStyles = `
  .header {
    max-width: 100%;
  }

  .header__opts {
    white-space: nowrap;
    gap: 4px;
  }

  .header__opts_sticky:not(.header__opts_hovered) {
    transform: translateY(calc(-100% + 10px));
  }

  .header__opts_sticky:not(.header__opts_hovered) > * {
    visibility: hidden;
  }

  .header__myboards {
    display: flex;
    overflow-x: auto;
    gap: 4px;
    scrollbar-width: thin;
  }

  .header__myboards::-webkit-scrollbar {
    height: 6px;
    background-color: var(--theme_default_bg);
  }

  .header__myboards::-webkit-scrollbar-thumb {
    background-color: rgba(155, 155, 155, 0.7);
    border-radius: 20px;
    border: transparent;
  }

  .header__myboards::-webkit-scrollbar-track {
    background-color: rgba(155, 155, 155, 0.5)
  }

  header .autorefresh {
    min-width: 220px;
  }
`;

const postTypeHiddenExtraStyles = `
  .post_type_hidden {
    opacity: 1;
  }
  .post_type_hidden::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--theme_default_postbg);
    opacity: 0.5;
    pointer-events: none;
  }
`;

const modMenuSelector = ".post__detailpart > span:has(.post__btn_type_adm)";
const modCheckboxSelector = '.post__details > input[type*="checkbox"]';
const modInfoSelector = '.post__details > span:has(> span[data-ip])';

const modFeaturesSelector = [modMenuSelector, modInfoSelector].join(", ");

const mainBody = document.querySelector("body.makaba");

const autoHideDeletedKey = 'auto_hide_deleted';

/**
 * Allowed options: undefined (it will hide checkbox everywhere, 'reports' and 'all'.
 *
 * Default is undefined.
 */
const selectAllCheckboxVisibility = 'select_all_checkbox_visibility';

const request = (params) => {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      ...params,
      onload: (response) => resolve(response.responseText),
      onerror: (error) => reject(error),
    });
  });
};

const moderInfoPromise = request({ url: "/moder/reports?json=1&my_reports=1" })
  .then((result) => JSON.parse(result));

const moderBoardsPromise = moderInfoPromise
  .then((result) => result.moder.Boards);

const moderLevelPromise = moderInfoPromise
  .then((result) => result.moder.Level);

//
// Какие-то костыли
function createElementFromHTML(htmlString, tag = "div") {
  var div = document.createElement(tag);
  div.innerHTML = htmlString.trim();

  return div;
}

function absolutnoProklyato(oldFn) {
  return oldFn;
}

//
// Плавающий тултип под жралобы
const reportContainerStyle = `.na_report_container {
  height: auto !important;
  width: auto !important;
  top: 50%
}`;

const reportContainerHTML = `
<div class="na na_report_container" id="na_reports" style="display: inline-block">
    <div id="rep_clause_post_element" class="element_hidden_important">
        <a href="/moder/reports?my_reports=1" title="В репорты" target="_blank">🔥<strong>
                <div id="rep_clause_post_count" style="color: red" class="element_inline_important"></div>
            </strong>
        </a>
        <button id="rep_prev_post" class="button desktop" type="button">🔼</button>
        <button id="rep_next_post" class="button desktop" type="button">🔽</button>
    </div>
    <div id="rep_clause_status" title="Неприятного не постят. Молодец!">✔️</div>
</div>
`;

const reportContainerEl = createElementFromHTML(reportContainerHTML).querySelector("#na_reports");

const clauseDetailsHTML = `
<div class="clause_marker" style="color: red;">🔥 <strong></strong> <span class="clause_remove" title="Удалить жалобы на приятное" style="cursor: pointer;">♻️</span>
</div>
`;

const clauseElRaw = createElementFromHTML(clauseDetailsHTML);
const clauseEl = clauseElRaw.querySelector(".clause_marker");

//
// Мне нереально лень решать проблемы скоупинга
let reporterBanWindowAction;

const makeReportBanForm = () => {
  const clauseBanForm = `<div id="clauseban-window" class="qr">
      <div class="qr__header" id="clause-window-header">Забанить репортера?<span class="qr__close" id="qr-clauseban-window-close">X</span></div>
      <div class="qr__body settings" style="text-align: center">
        Выдать бан до: <input type="text" size=10 id="clause_banexpires" class="input" value="">
      </div>
      <div class="setting-buttons qr__footer">
          <hr>
          <input id="clause_ban_btn" type="button" class="button" value="Забанить">
      </div>
  </div>`;

  const board = "reports";
  const banReason = `Общее 12 - Злоупотребление жалобами //!${board}`;
  let banTarget = "";

  const element = createElementFromHTML(clauseBanForm);
  const clauseBanFormEl = element.querySelector("#clauseban-window");
  const closeBtn = element.querySelector("#qr-clauseban-window-close");

  const datePicker = element.querySelector("#clause_banexpires");

  const triggerWindow = (reportIp) => {
    if (!reportIp) {
      clauseBanFormEl.style.display = "none";
      banTarget = "";
    } else {
      banTarget = reportIp;
      clauseBanFormEl.style.display = "block";

      $(clauseBanFormEl)
        .find("#clause_banexpires")
        .datepicker({ dateFormat: "yy/mm/dd", defaultDate: +2 })
        .datepicker("setDate", +2);
    }
  };

  const banBtn = element.querySelector("#clause_ban_btn");

  banBtn.onclick = () => {
    if (!banTarget || !confirm("Вы уверены в своих действиях?")) {
      return;
    }

    const banTimestamp =
      datePicker.value &&
      Math.floor(new Date(datePicker.value).getTime() / 1000);

    const fd = new FormData();
    fd.set("subnet", "255.255.255.255");
    fd.set("reason", banReason);
    if (banTimestamp) {
      fd.set("expires", banTimestamp);
    }

    fd.set("ip", banTarget);

    request({
      method: "POST",
      url: "/moder/actions/panel_ban",
      data: fd,
    })
      .then(() => $alert("Успешно"))
      .catch((e) => {
        console.error(e);
        $alert("Что-то пошло не так");
      })
      .finally(() => triggerWindow());
  };

  closeBtn.onclick = () => triggerWindow();

  mainBody.appendChild(clauseBanFormEl);
  draggable_qr("clauseban-window", "center");

  return triggerWindow;
};

let reportsData = [];
let myBoards = [];
let modLevel = 0;
const threadReportsMap = new Map();
let currentPost;

const removeAllBySelector = (selector) => {
  elements = document.querySelectorAll(selector);

  if (elements) {
    elements.forEach((el) => el.parentNode.removeChild(el));
  }
};

const moveTo = (isDownside) => {
  let sorted = [...threadReportsMap.keys()].sort();

  if (!isDownside) {
    sorted = sorted.reverse();
  }

  const nextPost = currentPost
    ? sorted.find((post) =>
        isDownside ? post > currentPost : post < currentPost
      )
    : sorted[0];

  currentPost = nextPost;

  if (!nextPost) {
    return;
  }

  const target = document.getElementById(`post-${nextPost}`);

  if (!target) {
    return;
  }

  target.classList.add("post_type_highlight");

  const y = target.offsetTop - window.innerHeight / 2;

  window.scrollTo({
    top: y,
    left: 0,
    behavior: "smooth",
  });
};

const collectReports = (postNum) => {
  const board = CFG.BOARD.NAME;
  const thread = CFG.BOARD.THREADID;

  const reports = reportsData.filter(
    (report) =>
      report.board === board &&
      report.thread === thread &&
      report.posts &&
      report.posts.includes(postNum)
  );

  return reports;
};

const banReporter = (postNum) => {
  const reports = collectReports(postNum).map((x) => x.ip);

  if (!reports || reports.length !== 1) {
    return;
  }

  const reporterMarker = reports[0];

  reporterBanWindowAction(reporterMarker);
};

const removeClauses = async (postNum) => {
  const reports = collectReports(postNum).map((x) => x.num);

  if (reports.length === 0) {
    return;
  }

  await request({
    method: "GET",
    url: [
      "/moder/reports/delete",
      reports.map((num) => `num=${num}`).join("&"),
    ].join("?"),
  })
    .then(() => updateThreadReportsMap())
    .catch((e) => {
      console.error(e);
      $alert("Ошибка удаления жалоб");
    });
};

const updateThreadReportsMap = async (firstRun) => {
  const board = CFG.BOARD.NAME;
  const thread = CFG.BOARD.THREADID;

  try {
    if (!firstRun && !myBoards.includes(board)) {
      return;
    }

    const reports = await request({
      method: "GET",
      url: "/moder/reports?json=1&my_reports=1",
    }).then((result) => {
      const raw = JSON.parse(result);

      myBoards = raw.moder.Boards;
      modLevel = raw.moder.Level;

      return raw.reports;
    });

    reportsData = reports || [];

    removeAllBySelector(".post__details .clause_marker");
    threadReportsMap.clear();

    const threadReports = reportsData.filter(
      (report) => report.board === board && report.thread === thread
    );

    threadReports.reduce((acc, val) => {
      const reactedOn = val.posts && val.posts.length ? val.posts : [thread];

      reactedOn.map((postNum) => {
        const clauseList = threadReportsMap.get(postNum) || [];
        threadReportsMap.set(postNum, [...clauseList, val.comment]);
      });
    }, []);

    threadReportsMap.forEach((clauses, post) => {
      const postHeaderEl = document.querySelector(`div#post-details-${post}`);
      if (!postHeaderEl) {
        return;
      }

      const markerEl = clauseEl.cloneNode(true);
      markerEl.title = clauses.join("\n");

      const stringEl = markerEl.querySelector("div > strong");

      stringEl.textContent = `${clauses.length} жалоб`;

      const recycleEl = markerEl.querySelector(".clause_remove");
      recycleEl.onclick = () => removeClauses(post);

      if (modLevel > 2 && clauses.length === 1) {
        const banEl = createElementFromHTML("🚯", "span");
        banEl.onclick = () => banReporter(post);
        banEl.title = "Забанить репортера";
        banEl.style.cursor = "pointer";

        markerEl.appendChild(banEl);
      }

      postHeaderEl.appendChild(markerEl);
    });

    const clauseCount = threadReports.length;

    const clausePostsEl = document.getElementById("rep_clause_post_element");
    const clauseStatusEl = document.getElementById("rep_clause_status");

    if (clauseCount > 0) {
      const clausePostCounterEl = document.getElementById(
        "rep_clause_post_count"
      );
      clausePostCounterEl.textContent = String(clauseCount);

      clauseStatusEl.classList.add("element_hidden_important");

      clausePostsEl.classList.remove("element_hidden_important");
      clausePostsEl.classList.add("element_inline_important");
    } else {
      clauseStatusEl.classList.remove("element_hidden_important");

      clausePostsEl.classList.add("element_hidden_important");
      clausePostsEl.classList.remove("element_inline_important");
    }
  } catch (e) {
    $alert("Подгрузка жалоб сломалась...");

    console.error(e);
  }
};

const setupSelectAllCheckboxVisibility = () => {
  if (localStorage[selectAllCheckboxVisibility] === 'all') {
    return;
  }

  const onReportsPage = /^\/moder\/reports/.test(window.location.pathname);

  if (localStorage[selectAllCheckboxVisibility] === 'reports' && onReportsPage) {
    return;
  }

  const onAnyModPage = /^\/moder\//.test(window.location.pathname);

  if (!onAnyModPage) {
    return;
  }

  $("input#checkall")
    .prop("checked", false)
    .addClass("element_hidden_important");
}

const enableReportFeatures = () => {
  GM_addStyle(reportContainerStyle);
  GM_addStyle(styleInlineImportant);
  mainBody.appendChild(reportContainerEl);

  const repPrevBtn = reportContainerEl.querySelector("#rep_prev_post");
  const repNextBtn = reportContainerEl.querySelector("#rep_next_post");

  repPrevBtn.onclick = () => moveTo(false);
  repNextBtn.onclick = () => moveTo(true);

  reporterBanWindowAction = makeReportBanForm();

  const oldUpdatePosts = absolutnoProklyato(PostF.updatePosts).bind(PostF);

  PostF.updatePosts = function (originalCallback) {
    const callback = function (...params) {
      updateThreadReportsMap();
      return originalCallback(...params);
    }
    // callback будет вызван после подгрузки постов
    return oldUpdatePosts(callback);
  };

  // Прогон после загрузки
  updateThreadReportsMap(true);
};

//
// лоулвл ип в треде
const showPostsIPUpdate = async (board, thread_id, threadEl) => {
  const posts = $(threadEl)
    .find(".post__details:not(:has(.post__detailpart > .pik))")
    .get();

  if (posts.length === 0) {
    return;
  }

  const threadData = await request({
    url: `/moder/posts/${board}?action=show_thread&parent=${thread_id}&json=true`,
  });

  const threadPosts = JSON.parse(threadData).posts.reduce((acc, val) => {
    return { ...acc, [val.num]: val };
  }, {});

  posts.forEach((postEl) => {
    const postId = postEl.id.replace("post-details-", "");

    const postData = threadPosts[postId];

    if (!postData) {
      return;
    }

    const { ip, vip, country } = postData;

    const ipData = `
      <span class="pik" data-ip="${ip}">
        <span class="ip__data">${ip}</span>
        ${
          country
            ? `&nbsp;<img src="/flags/${country}.png" alt="${country}">`
            : ""
        }
      </span>&nbsp;
      ${vip ? `<span style="color:#ff0000">${vip}</span>` : ""}
    `;

    const info = createElementFromHTML(ipData, "span");
    info.classList.add("post__detailpart");

    if (modFeaturesDisabled) {
      info.classList.add("element_hidden_important");
    }

    const oldIpDetailsParts = $(postEl)
      .find(".post__detailpart:has(.pik)")
      .get();

    oldIpDetailsParts.forEach((el) => postEl.removeChild(el));

    const reportDetailEl = postEl.querySelector('.clause_marker');
    postEl.insertBefore(info, reportDetailEl);
  });
};

const enableModIps = () => {
  //
  // Отключаем дефолтную функцию рендеринга доп. инфы для постов
  ModIp.load = () => {};

  const threadEl = document.querySelector("div.thread");

  const updatePostIps = () => {
    if (
      !modFeaturesDisabled &&
      !Store.get("other.disableip", false)
    ) {
      showPostsIPUpdate(
        CFG.BOARD.NAME,
        CFG.BOARD.THREADID,
        threadEl
      ).catch((e) => console.error(e));
    }
  };

  const oldUpdatePosts = absolutnoProklyato(PostF.updatePosts).bind(PostF);

  PostF.updatePosts = function (originalCallback) {
    const callback = function (...params) {
      updatePostIps();
      return originalCallback(...params);
    }
    // callback будет вызван после подгрузки постов
    return oldUpdatePosts(callback);
  };

  // Прогон после загрузки
  updatePostIps();
};

//
// Куча продукта жаваскриптного, идентичного натуральному
const clearSelection = () => {
  $(modCheckboxSelector).prop("checked", false);
};

const __markWholeChain = (num) => {
  var to_mark = [];
  var recurse = function (arr) {
    for (var i = 0; i < arr.length; i++) {
      if (to_mark.indexOf(arr[i]) >= 1) continue;

      $("#post-" + arr[i]).addClass("post_type_highlight");
      $("#post-details-" + arr[i] + " input[name=delete]").prop(
        "checked",
        true
      );

      to_mark.push(arr[i]);
      var post = Post(arr[i]);
      recurse(post.getReplies());
    }
  };
  recurse([num]);

  var list = "";
  var count = 0;

  while (to_mark.length) {
    count++;
    var current_num = to_mark.pop();
    if (!(count % 5)) {
      list += current_num.toString() + "\n";
    } else {
      list += current_num.toString();
      if (to_mark.length) list += ",";
    }
  }

  $alert("Выделено " + count + " постов:\n\n" + list);
};

const __ajaxModRequest = (url) => {
  $alert("Работаем...", "wait");

  $.ajax(url, {
    dataType: "json",
    timeout: 10000,
    success: (data) => {
      if (data && data.result == 1) {
        $close($id("alert-wait"));
        $alert("Успешно");
        clearSelection();
        if (CFG.BOARD.THREADID) {
          if (typeof PostF != "undefined") {
            PostF.updateThread();
          } else {
            updateThread();
          }
        } else {
        }
        return false;
      }

      if (data.result != 1) {
        return $alert(`Ошибка! Код ${data.error.code}, ${data.error.message}`);
      }

      $alert("Ошибка парсинга ответа");
    },
    error: () => {
      $close($id("alert-wait"));
      $alert(
        "Возникла проблема, попробуйте еще раз после обновления страницы."
      );
    },
  });
};

const __updatePosts = () =>
  function (callback) {
    const that = this;
    var replyhtml = "";
    var todel = "";
    Post(CFG.BOARD.THREADID).fetchPosts({ update: true }, function (data) {
      if (data.hasOwnProperty("error")) return callback && callback(data);
      var tmpost = Post(1);
      var origHeight = window.pageYOffset;
      if (data.deleted) {
        const cssSelectorLine = data.deleted
          .map((postNum) => "#post-" + postNum)
          .join(", ");

        var autoHideDeleted = localStorage[autoHideDeletedKey] === "true";
        $(cssSelectorLine).addClass("post_type_deleted" + (autoHideDeleted ? " post_type_hidden" : ""));
      }
      var origAfterDelHeight = window.pageYOffset;
      var afterDelDiff = origHeight - origAfterDelHeight;
      that._append(data.data);
      window.scrollTo(0, origHeight - afterDelDiff);
      for (var i = 0; i < data.updated; i++) {
        tmpost.num = data.data[i].num;
        var repliesTo = tmpost.raw().repliesTo;
        if (repliesTo) {
          for (var j = 0; j < repliesTo.length; j++) {
            tmpost.num = repliesTo[j];
            replyhtml = tmpost.getReplyLinks();
            if (replyhtml) {
              var refmap = _.id("refmap-" + tmpost.num);
              if (refmap) {
                refmap.style.display = "block";
                refmap.innerHTML = replyhtml;
              }
            }
          }
        }
      }
      that._markPosts(CFG.BOARD.THREADID, true);
      if (CFG.BOARD.NAME == "math") MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
      if (callback) callback(data);
    });
  };

let lastAutoUpdateState = false;

const __removeAdminMenu = () =>
  function (e) {
    var el = e.relatedTarget;

    try {
      while (1) {
        if (el.id == "ABU-select") break;
        else {
          el = el.parentNode;

          if (!el) break;
        }
      }
    } catch (e) {}

    if (!el) {
      $del($id("ABU-select"));

      if (lastAutoUpdateState) {
        MAutoUpdate.start();

        lastAutoUpdateState = false;
      }
    }
  };

//
// Кнопка сброса выделения
const makeClearSelBtn = () => {
  const clearSelected = document.createElement("button");
  clearSelected.innerHTML = "Сброс галок";
  clearSelected.className = "button";
  clearSelected.addEventListener("click", (event) => {
    clearSelection();
  });

  return clearSelected;
};

let modFeaturesDisabled = Store.get("thread.modFuncsDisabled") || false;

const hideModeFeaturesIfThisOptionIsSelected = () => {
  if (modFeaturesDisabled) {
    $(modCheckboxSelector)
      .addClass("element_hidden_important")
      .removeClass("turnmeoff");

    $(modFeaturesSelector).addClass("element_hidden_important");

    reportContainerEl.style.display = "none";
  }
}

//
// Галка скрытия наличия вилки
const makeHideModToolsChkbx = () => {
  const modMode = document.createElement("input");
  modMode.setAttribute("type", "checkbox");
  modMode.setAttribute("name", "show_modfeatures");

  modMode.addEventListener("change", function () {
    modFeaturesDisabled = this.checked;
    Store.set("thread.modFuncsDisabled", this.checked);

    if (this.checked) {
      $(modCheckboxSelector)
        .addClass("element_hidden_important")
        .removeClass("turnmeoff");
      $(modFeaturesSelector).addClass("element_hidden_important");

      reportContainerEl.style.display = "none";
    } else {
      $(modCheckboxSelector)
        .addClass("turnmeoff")
        .removeClass("element_hidden_important");
      $(modFeaturesSelector).removeClass("element_hidden_important");

      reportContainerEl.style.display = "inline-block";
    }
  });

  const checkboxContainer = document.createElement("div");
  checkboxContainer.append(modMode);
  checkboxContainer.append("Скрыть модфичи");

  if (modFeaturesDisabled !== modMode.checked) {
    modMode.click();
  }

  return checkboxContainer;
};

//
// Замещение пробандеровского таймера автообновления
const makeAutorefreshChkbx = () => {
  const aRChkBx = document.createElement("input");
  aRChkBx.setAttribute("type", "checkbox");
  aRChkBx.className = "autorefresh-checkbox js-refresh-checkbox";
  aRChkBx.checked = Store.get("thread.autorefresh") || false;

  aRChkBx.addEventListener("change", function () {
    if (this.checked) {
      MAutoUpdate.start();
    } else {
      MAutoUpdate.stop();
    }

    Store.set("thread.autorefresh", !!this.checked);
  });

  const countdown = document.createElement("span");
  countdown.className = "autorefresh-countdown js-refresh-count";

  const checkboxContainer = document.createElement("span");
  checkboxContainer.className = "autorefresh tn__refresh js-refresh";
  checkboxContainer.style.display = "inline-block";

  checkboxContainer.append(aRChkBx);
  checkboxContainer.append("Автообновление ");
  checkboxContainer.append(countdown);

  return checkboxContainer;
};

//
// Костыльный фикс показа удаленных постов
const setDeletedFix = function () {
  const _wPost = absolutnoProklyato(Post);

  function __Post(num) {
    const handler = _wPost(num);
    const _wPreview = absolutnoProklyato(handler.previewHTML).bind(handler);

    handler.previewHTML = function () {
      const postBody = $(`#post-${num}:first`)[0];

      if (postBody) {
        const isDeletedPost = postBody.className.includes('post_type_deleted');
        return `<div class="${isDeletedPost ? 'post_type_deleted' : ''}">${postBody.innerHTML}</div>`;
      }

      const result = _wPreview();
      return result;
    };

    return handler;
  }

  Post = __Post;
};

//
// Еще более костыльный фикс автоподгрузки вилки на новых постах
// вообще хуй знает надо биндить или нет :clueless:
const setPostBodyFix = function () {
  const ___generatePostBody = absolutnoProklyato(PostF._generatePostBody).bind(
    PostF
  );

  function wGeneratePostBody(post) {
    const result = ___generatePostBody(post);

    const domNode = createElementFromHTML(result);

    if (modFeaturesDisabled) {
      $(domNode)
        .find(modCheckboxSelector)
        .removeClass("turnmeoff")
        .addClass("element_hidden_important");
      $(domNode).find(modFeaturesSelector).addClass("element_hidden_important");
    }

    return domNode.innerHTML;
  }

  PostF._generatePostBody = wGeneratePostBody;
};

const moveExtraNavElementsToTop = () => {
  const topPanel = $(".header > .header__menu");
  const topPanelMoreItemsBtn = $(".header > .header__menu > #js-header-more");

  const moveableItemsBeforeMoreItemsBtn = $(".header > .header__opts > a:not(:first-child)");
  const moveableItemsAfterMoreItemsBtn = $(".header > .header__opts > div:not(:first-child)");

  const themeSelector = $(".header > .header__opts > :has(.selectbox > #SwitchStyles)");
  themeSelector.css("display", "inline-block");

  topPanel.append(moveableItemsBeforeMoreItemsBtn, topPanelMoreItemsBtn);
  topPanel.append(moveableItemsAfterMoreItemsBtn);
}

const hideModFeaturesForNotOwnBoards = () => {
  moderBoardsPromise.then((boards) => {
    if (boards.includes('All')) {
      return;
    }

    const pathSegments = window.location.pathname.split('/');
    const currentBoard = pathSegments && pathSegments[1];
    const hasBoardPermissions = boards.includes(currentBoard)

    if (!hasBoardPermissions) {
      $(modCheckboxSelector)
        .addClass("element_hidden_important")
        .removeClass("turnmeoff");
  
      $(modFeaturesSelector).addClass("element_hidden_important");
  
      reportContainerEl.style.display = "none";
    }
  })
}

//
// С чего вообще всё начиналось
const parser = () => {
  const navPanel = $(".header > .header__opts");

  if (navPanel) {
    const clearSelected = makeClearSelBtn();
    const modChkBx = makeHideModToolsChkbx();
    const refreshChkBx = makeAutorefreshChkbx();

    navPanel.append(
      [clearSelected, modChkBx, refreshChkBx].reduce(
        (a, v) => {
          v.classList.add("header__menuitem");
          return [...a, v];
        },

        []
      )
    );

    const nativeUpperARCounter = document.querySelector(
      '.tn div[class*="tn__item"] > span.autorefresh'
    );

    nativeUpperARCounter.innerHTML = "";
    nativeUpperARCounter.setAttribute('style', 'margin-right: -11px;')
  }

  if (typeof PostF === "undefined") {
    console.error("Сосалити!");
  } else {
    GM_addStyle(styleDeleted);

    PostF.updatePosts = __updatePosts();
  }

  const modScriptElement = document.querySelector('script[src="/moder/js"]');

  if (modScriptElement) {
    const applyCustomModScripts = () => {
      if (typeof ajaxModRequest !== "undefined") {
        ajaxModRequest = __ajaxModRequest;
        markWholeChain = __markWholeChain;

        removeAdminMenu = __removeAdminMenu();

        addAdminMenu = (function (old) {
          function jsgovnoebanoe(ev) {
            if (MAutoUpdate.enabled) {
              lastAutoUpdateState = true;

              MAutoUpdate.stop();
            }
            old(ev);
          }

          return jsgovnoebanoe;
        })(addAdminMenu);
      }

      enableReportFeatures();
      enableModIps();
    }

    const isOriginModScriptLoaded = typeof ModIp !== 'undefined';

    if (isOriginModScriptLoaded) {
      applyCustomModScripts();
    } else {
      modScriptElement.onload = () => applyCustomModScripts();
    }
  }
};

GM_addStyle(styleHiddenImportant);
GM_addStyle(headerExtraStyles);
GM_addStyle(postTypeHiddenExtraStyles);

setupSelectAllCheckboxVisibility();

// внутри треда
// https://2ch.hk/test/res/1.html
if (/^\/[a-z0-9]+\/res\//.test(window.location.pathname)) {
  setPostBodyFix();
  setDeletedFix();

  clearSelection();
  moveExtraNavElementsToTop();
  hideModeFeaturesIfThisOptionIsSelected();
  hideModFeaturesForNotOwnBoards();
  parser();
}

// внутри доски
// https://2ch.hk/test/
if (/^\/[a-z0-9]+\/$/.test(window.location.pathname)) {
  hideModeFeaturesIfThisOptionIsSelected();
  hideModFeaturesForNotOwnBoards();
}
