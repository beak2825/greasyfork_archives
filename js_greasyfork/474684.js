// ==UserScript==
// @name        EasierMod lvl 3+
// @namespace   Violentmonkey Scripts
// @match       *://2ch.hk/*
// @match       *://2ch.su/*
// @match       *://2ch.life/*
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @version     1.14.1
// @author      miotyanochka
// @description Enterprise-grade production code
// @license WTFPL
// @downloadURL https://update.greasyfork.org/scripts/474684/EasierMod%20lvl%203%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/474684/EasierMod%20lvl%203%2B.meta.js
// ==/UserScript==

//
// Б-же, как же хочется засунуть это все в вебпак

const styleDeleted = `.post_type_deleted.post_type_deleted {
  background: repeating-linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.0),
    rgba(0, 0, 0, 0.0) 10px,
    rgba(255, 0, 0, 0.1) 10px,
    rgba(255, 0, 0, 0.1) 20px
  );
  opacity: 1;
}`;

const authStyles = `
  .post-auth {
    max-width: 70px;
    overflow: hidden;
    white-space: nowrap;
  }
  .post-auth-warning {
    color: red;
  }
  .open-auth-btn {
    text-decoration: none;
  }
  .open-auth-btn-warning {
    color: red;
    font-weight: bold;
  }
`;

const modPanelPasscodeStyle = `
  [title=Пасскод] {
    cursor: pointer;
  }
`;

const styleHiddenImportant = `.element_hidden_important {
  display: none !important;
}`;

const styleInlineImportant = `.element_inline_important {
  display: inline-block !important;
}`;

const styleSubnetDropdown = `
  .subnet-dropdown-btn {
    position: relative;
    color: var(--theme_default_link);
    cursor: pointer;
  }
  .subnet-dropdown-wrap {
    position: absolute;
    width: max-content;
    z-index: 1;
    display: block;
  }
  .subnet-dropdown-item {
    display: block;
    padding: 3px 10px;
    font: 13px arial;
    cursor: pointer;
    background: var(--theme_default_postbg);
    color: var(--theme_default_text);
  }
  .subnet-dropdown-item:hover {
    background: #666;
    color: #fff;
  }
`;

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

// do not apply these styles for all cases because
// it will break template if try to view posts in another thread in the chain
const postPreviewExtraStyles = `
  .post_preview:has(.post_type_deleted),
  .post_preview:has(.post_type_highlight) {
    display: flex;
  }
`;

const banPasscodeStyles = `
  .ban-passcode {
    border: 2px solid black;
    border-radius: 4px;
  }
  .ban-passcode-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .ban-passcode-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }
  .ban-passcode-reason {
    width: 100%;
    margin: 8px 0 8px;
  }
  .action-menu-small-item {
    letter-spacing: -1px;
  }
`;

const nicknameStyles = `
  .post-nickname {
    margin-left: 4px;
    padding: 0 4px 0;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.2);
  }

  .nickname-modal {
    border: 2px solid black;
    border-radius: 6px;
    padding: 8px;
    width: 180px;
  }

  .nickname-form {
    display: flex;
    flex-direction: column;
  }

  .nickname-modal::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.05);
    z-index: -1;
  }

  .nickname-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .nickname-options.nickname-options {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
  }

  .nickname-field {
    display: flex;
    gap: 2px;
    width: 100%;
  }

  .ip-input {
    min-width: 0;
  }

  .subnet-input {
    width: 40px;
  }

  .pass-input {
    width: 100%;
  }

  .auth-input {
    width: 100%;
  }

  .nickname-footer {
    margin-top: 6px;
    width: 100%;
  }

  .nickname-submit-btn {
    width: 100%;
    background: rgba(0, 255, 0, 0.35);
    border-radius: 4px;
  }

  .nickname-submit-btn:hover {
    background: rgba(0, 255, 0, 0.65);
  }

  .nickname-colors-container {
    display: flex;
    justify-content: space-between;
    background: rgba(0, 0, 0, 0.2);
    margin-top: 5px;
    padding: 5px;
    border-radius: 8px;
  }

  .nickname-color-button {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
  }
`;

const modMenuSelector = ".post__detailpart > span:has(.post__btn_type_adm)";
const modCheckboxSelector = '.post__details > input[type*="checkbox"]';
const modInfoSelector = '.post__details > span:has(> a[href*="moder"])';
const modNavPanelSelector = 'div.nav';
const modTagBtnSelector = '#mod-mark-checkbox';

const modFeaturesSelector = [
  modMenuSelector,
  modInfoSelector,
  modNavPanelSelector,
  modTagBtnSelector,
].join(", ");

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

/**
 * @param {String} ip
 * @return {Array<string>} Format of item: `255.255.0.0/16`
 */
const getSubnetListByIp = (ip) => request({ url: `https://bgp.he.net/ip/${ip}` }).then((res) => {
  const page = document.createElement('div');
  page.innerHTML = res;
  const subnetsNodes = $(page).find("#ipinfo .nowrap a").get();

  if (subnetsNodes.length === 0) {
    return [];
  }

  const subnets = subnetsNodes.map((el) => el.innerHTML)
  return subnets;
});

/**
 * @param {String} ip
 * @param {HTMLElement} subnetListEl
 */
displaySubnetsInfo = (ip, num, subnetListEl) => {
  const getIpMaskRepresentation = (bitCount) => {
    let mask = [];
    for (let i = 0; i < 4; i++) {
      let n = Math.min(bitCount, 8);
      mask.push(256 - Math.pow(2, 8 - n));
      bitCount -= n;
    }
    return mask.join('.');
  }

  const subnetListContent = `
    <a title="Локальный поиск постов по подсети">[NET]</a>
    <div class="subnet-dropdown-wrap" data-num="${num}">
      ${Array(32).fill(0).map((_, i) => `
      <a data-bits="${32 - i}" class="subnet-dropdown-item" href="/moder/posts/${board}?action=show_subnet&cidr=${ip}%2F${32 - i}" target="_blank">
        ${getIpMaskRepresentation(32 - i)} / ${32 - i}
      </a>
      `).join('')}
    </div>
  `;

  clearSubnetListContentFn = () => {
    subnetListEl.innerHTML = '<a title="Локальный поиск постов по подсети">[NET]</a>';
    subnetListEl.removeEventListener('mouseleave', clearSubnetListContentFn);
  }

  subnetListEl.innerHTML = subnetListContent;
  subnetListEl.addEventListener('mouseleave', clearSubnetListContentFn);

  getSubnetListByIp(ip).then((exactSubnets) => {
    const bits = exactSubnets.map((mask) => mask.split('/')[1]);

    bits.forEach((item) => {
      const subnetEl = $(subnetListEl).find(`a[data-bits="${item}"]`).get()[0];
      if (subnetEl) {
        subnetEl.style = "color: red"
      };
    })
  });
}

setupIpNav = (postNumber, keepSameIp) => {
  const ip = getPostIp(postNumber);

  if (!ip) {
    return;
  }

  const naIpPostsElement = document.getElementById('na_ip_posts');

  if (selectedIp === ip && !keepSameIp) {
    selectedIp = null;

    naIpPostsElement.classList.add("element_hidden_important");
    naIpPostsElement.classList.remove("element_inline_important");

    return;
  }

  selectedIp = ip;
  selectedIpPost = postNumber;

  const ipPostCount = postNumbersByIp[selectedIp].length;

  const ipPostCounterEl = document.getElementById(
    'ip_post_count'
  );

  ipPostCounterEl.textContent = String(ipPostCount);

  naIpPostsElement.classList.remove('element_hidden_important');
  naIpPostsElement.classList.add('element_inline_important');

  const ipPostLink = document.getElementById('ip_post_link');
  ipPostLink.setAttribute('href', `/moder/posts/${board}?action=show_ip&ip=${ip}`);
}

const getPostIp = (postNumber) => {
  return Object
    .keys(postNumbersByIp).find((ip) => postNumbersByIp[ip]
    .includes(postNumber));
}

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
  top: 50%;
  order: 2;
}`;

const reportContainerHTML = `
<div class="na_report_container" id="na_reports" style="display: inline-block">
    <div id="rep_clause_post_element" class="element_hidden_important">
        <a href="/moder/reports?my_reports=1" style="display: inline-block; min-width: 45px"  title="В репорты" target="_blank">🔥<strong>
                <div id="rep_clause_post_count" style="color: red;" class="element_inline_important"></div>
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

const ipPostsNavStyles = `
  .na-ip-posts {
    height: auto !important;
    width: auto !important;
    top: calc(50% + 60px);
    order: 3;
  }
`;

const ipPostsContainerHTML = `
<div id="na_ip_posts" class="na-ip-posts element_hidden_important">
  <a id="ip_post_link" href="/moder/posts/test?action=show_ip&ip=127.0.0.1" style="display: inline-block; min-width: 45px" title="Просмотр постов с данного IP на текущей доске" target="_blank">
    🖥️
    <strong>
      <div id="ip_post_count" style="color: red" class="element_inline_important"></div>
    </strong>
  </a>
  <button id="ip_prev_post" class="button desktop" type="button">🔼</button>
  <button id="ip_next_post" class="button desktop" type="button">🔽</button>
</div>
`;

const ipPostsContainerEl = createElementFromHTML(ipPostsContainerHTML).querySelector("#na_ip_posts");

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
let currentReportedPost;

const removeAllBySelector = (selector) => {
  elements = document.querySelectorAll(selector);

  if (elements) {
    elements.forEach((el) => el.parentNode.removeChild(el));
  }
};

const moveToReportedPost = (isDownside) => {
  let sorted = [...threadReportsMap.keys()].sort();

  if (!isDownside) {
    sorted = sorted.reverse();
  }

  const nextPost = currentReportedPost
    ? sorted.find((post) =>
        isDownside ? post > currentReportedPost : post < currentReportedPost
      )
    : sorted[0];

  currentReportedPost = nextPost;

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

let selectedIp = '';
let selectedIpPost;
let postNumbersByIp;
let threadFullData;

const moveToIpPost = (isDownside) => {
  let sorted = [...postNumbersByIp[selectedIp]].sort();

  if (!isDownside) {
    sorted = sorted.reverse();
  }

  let nextPost = selectedIpPost
    ? sorted.find((post) =>
        isDownside ? post > selectedIpPost : post < selectedIpPost
      )
    : sorted[0];

  nextPost = nextPost || sorted[0];

  selectedIpPost = nextPost;

  if (!nextPost) {
    return;
  }

  const target = document.getElementById(`post-${nextPost}`);

  if (!target) {
    return;
  }

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

    const reports = await request({ url: "/moder/reports?json=1&my_reports=1" })
      .then((result) => JSON.parse(result))
      .then((result) => {
        myBoards = result.moder.Boards;
        modLevel = result.moder.Level;

        return result.reports;
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


const highlightAllPostsWithSameIp = (postNumber) => {
  const ip = getPostIp(postNumber);
  const post = Post(postNumber);
  const posts = post.threadPosts();
  const tmpost = Post(1);

  for (var i = 0; i < posts.length; i++) {
    tmpost.num = posts[i];
    ip_ = $('#post-' + posts[i] + ' .ip__data').html();

    if (!tmpost.isRendered())
        continue;
    if (ip != ip_)
        continue;
    $('#post-' + posts[i]).addClass('post_type_highlight');
  }
}

const selectAllPostsByIp = (postNumber) => {
  const ip = getPostIp(postNumber);
  const posts = postNumbersByIp[ip];

  const currentState = $("#post-details-" + postNumber + " input[name=delete]").prop("checked")

  posts.forEach((post) => {
    $("#post-details-" + post + " input[name=delete]").prop(
      "checked",
      !currentState
    );
  });

  if (!currentState) {
    $alert("Выделено " + posts.length + " постов:\n\n" + posts.join(', '));
  }
}

const selectAllPostsByPasscode = (postNumber) => {
  const selectedPost = threadFullData.posts.find((post) => post.num === postNumber);

  if (!selectedPost || !selectedPost.vip) {
    return;
  }

  const posts = threadFullData.posts.filter((post) => post.vip === selectedPost.vip);

  const currentState = $("#post-details-" + selectedPost.num + " input[name=delete]").prop("checked")

  posts.forEach((post) => {
    $("#post-details-" + post.num + " input[name=delete]").prop(
      "checked",
      !currentState
    );
  });

  if (!currentState) {
    const selectedPosts = posts.map((post) => post.num).join(', ');
    $alert("Выделено " + posts.length + " постов:\n\n" + selectedPosts);
  }
}

const selectAllPostsByAuth = (postNumber) => {
  const selectedPost = threadFullData.posts.find((post) => post.num === postNumber);

  if (!selectedPost || !selectedPost.auth) {
    return;
  }

  const posts = threadFullData.posts.filter((post) => post.auth === selectedPost.auth);

  const currentState = $("#post-details-" + selectedPost.num + " input[name=delete]").prop("checked")

  posts.forEach((post) => {
    $("#post-details-" + post.num + " input[name=delete]").prop(
      "checked",
      !currentState
    );
  });

  if (!currentState) {
    const selectedPosts = posts.map((post) => post.num).join(', ');
    $alert("Выделено " + posts.length + " постов:\n\n" + selectedPosts);
  }
}

const selectAllPostsBySubnet = (postNumber, bits) => {
  const selectedPost = threadFullData.posts.find((post) => post.num === postNumber);

  if (!selectedPost) {
    return;
  }

  const posts = threadFullData.posts.filter((post) => areIpsInSameSubnet(post.ip, selectedPost.ip, bits));

  const currentState = $("#post-details-" + selectedPost.num + " input[name=delete]").prop("checked");

  posts.forEach((post) => {
    $("#post-details-" + post.num + " input[name=delete]").prop(
      "checked",
      !currentState
    );
  });

  if (!currentState) {
    const selectedPosts = posts.map((post) => post.num).join(', ');
    $alert("Выделено " + posts.length + " постов:\n\n" + selectedPosts);
  }
}

const areIpsInSameSubnet = (firstIp, secondIp, bits) => {
  const firstIpParts = firstIp.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  const firstIpNum = (+firstIpParts[1]<<24) + (+firstIpParts[2]<<16) + (+firstIpParts[3]<<8) + (+firstIpParts[4]);

  const secondIpParts = secondIp.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  const secondIpNum = (+secondIpParts[1]<<24) + (+secondIpParts[2]<<16) + (+secondIpParts[3]<<8) + (+secondIpParts[4]);

  return (firstIpNum & createIpMask(bits)) === (secondIpNum & createIpMask(bits))
}

const createIpMask = (bits) => {
  return -1 << (32 - bits);
}

const setupMassPostsSelect = () => {
  $('#js-posts').on('click', 'span.pik', function(event) {
    const postElement = $(this).closest('.post');
    const num = postElement.data('num');

    const selectAllPosts = event.ctrlKey;

    if (selectAllPosts) {
      selectAllPostsByIp(num);
    }
  });

  $('#js-posts').on('click', 'span.passcode', function(event) {
    const postElement = $(this).closest('.post');
    const num = postElement.data('num');

    const selectAllPosts = event.ctrlKey;

    if (selectAllPosts) {
      selectAllPostsByPasscode(num);
    }
  });

  $('#js-posts').on('click', 'span.post-auth', function(event) {
    const postElement = $(this).closest('.post');
    const num = postElement.data('num');

    const selectAllPosts = event.ctrlKey;

    if (selectAllPosts) {
      selectAllPostsByAuth(num);
    }
  });

  $('#js-posts').on('click', function(event) {
    if (!event.target.className.includes('subnet-dropdown-item')) {
      return;
    }

    const num = $(event.target).parent().data('num');
    const bits = Number(event.target.dataset.bits);

    const selectAllPosts = event.ctrlKey;

    if (selectAllPosts) {
      selectAllPostsBySubnet(num, bits);
    }
  });
}

const setupIpPostHighlightEvents = () => {
  $('#js-posts').on('click', 'span.pik', function() {
    const postElement = $(this).closest('.post');
    const num = postElement.data('num');

    setupIpNav(num);
  });

  $('#js-posts').on('click', '.post-reply-link', function(e) {
    const element = $(this);
    const num = element.data('num');

    setupIpNav(num, true);
    highlightAllPostsWithSameIp(num);
  });

  window.addEventListener('load', function() {
    const hash = window.location.hash.substring(1);
    if (hash && !isNaN(hash) && Post(hash).exists() && !Post(hash).isThread()) {
      // тут в идеале надо отслеживать процесс загрузки доп. инфы, а не делать костыль с интервалами
      const loadIpInfoInterval = setInterval(() => {
        if (postNumbersByIp) {
          clearInterval(loadIpInfoInterval);

          const postNumber = Number(hash);
          setupIpNav(postNumber);
          highlightAllPostsWithSameIp(postNumber);
        }
      }, 500);
    }
  }, false);
}

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

const enableIpPostsFeature = () => {
  GM_addStyle(ipPostsNavStyles);
  window.navContainerFeature.navContainerNode.appendChild(ipPostsContainerEl);

  const ipPrevBtn = ipPostsContainerEl.querySelector("#ip_prev_post");
  const ipNextBtn = ipPostsContainerEl.querySelector("#ip_next_post");

  ipPrevBtn.onclick = () => moveToIpPost(false);
  ipNextBtn.onclick = () => moveToIpPost(true);

  setupIpPostHighlightEvents();
}

class NavContainerFeature {
  navContainerStyles = `
    .nav {
      top: 50%;
      position: fixed;
      right: 20px;
      transform: translateY(-50%);
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 16px;
    }

    .nav > * {
      cursor: pointer;
      z-index: 999;
      padding: 12px;
      background: var(--theme_default_altbtnbg);
      border-radius: 2px;
    }
  `;

  /**
   * @type {Node}
   */
  navContainerNode;

  init() {
    GM_addStyle(this.navContainerStyles);

    let containerNode = document.createElement("div");
    containerNode.id = "nav";
    containerNode.classList = "nav";

    this.navContainerNode = mainBody.appendChild(containerNode);
  }
}

class AdditionalNavButtons {

  // Variables
  additionalNavButtonsStyles = `
    .na-additional-buttons {
      height: auto !important;
      width: auto !important;
      order: 0;
    }

    #select-replies-prefs {
      display: grid;
      gap: 12px;
      justify-items: center;
      margin: 12px;
    }

    #qr-select-replies-window-close {
      position: absolute;
      right: 4px;
    }`;

  additionalNavButtonsContainerHTML =
    `<div class="na-additional-buttons element_inline_important" id="na_additional_buttons">
       <button id="uncheck-all" class="button additional-button desktop" title="Снять выделение со всех постов" type="button">🔄</button>
       <button id="check-dead-replies" class="button additional-button desktop" title="Выделить все ответы на удалённые посты" type="button">🚮</button>
     </div>`;

  // Initialize button container and dead reply widget
  additionalNavButtonsContainerEl = createElementFromHTML(this.additionalNavButtonsContainerHTML).querySelector("#na_additional_buttons");

  deadReplyWidget = new DeadReplyWidget();

  init = () => {

    GM_addStyle(this.additionalNavButtonsStyles);
    window.navContainerFeature.navContainerNode.appendChild(this.additionalNavButtonsContainerEl);

    this.deadReplyWidget.create();

    const uncheckAllButton = this.additionalNavButtonsContainerEl.querySelector("#uncheck-all");
    const checkDeadReplies = this.additionalNavButtonsContainerEl.querySelector("#check-dead-replies");

    uncheckAllButton.onclick = () => {
      clearSelection();
      window.selectedPostsNavFeature.updateSelectedNavCounter();
    }

    checkDeadReplies.onclick = () => this.deadReplyWidget.show();
  }
}

class DeadReplyWidget {
  deadReplyWidgetHTML = `
   <div class="qr" id="select-replies-window">
     <div class="qr__header" id="select-replies-window-header">
       Выделение постов
       <span class="qr__close" id="qr-select-replies-window-close">X</span>
     </div>
     <div class="qr__body settings" id="select-replies-body">
       <div class="settings__prefs" id="select-replies-prefs">
         <div class="settings__row">
           <span class="settings__label">
             <label>
               <input type="checkbox" id="select-replies-chains" class="settings__checkbox"/>Выделить ветки
             </label>
           </span>
         </div>
         <div class="settings__row">
           <span class="settings__label">
             <label>Лимит постов
               <input type="text" placeholder="Лимит" id="select-replies-limit" class="input" size="6"/>
             </label>
           </span>
         </div>
       </div>
     </div>
     <div class="select-replies-buttons qr__footer">
       <hr/>
       <input type="button" class="button" value="Выделить" id="select-replies-btn"/>
     </div>
   </div>`;

  deadReplyWidgetElement;

  // Create element and register event listeners
  create() {
    this.deadReplyWidgetElement = this.createWidgetElement();

    this.registerButtonEvents();

    mainBody.appendChild(this.deadReplyWidgetElement);
    draggable_qr('select-replies-window', 'center');
  }

  createWidgetElement() {
    return createElementFromHTML(this.deadReplyWidgetHTML).querySelector('#select-replies-window');
  }

  registerButtonEvents() {
    const selectRepliesButton = this.deadReplyWidgetElement.querySelector('#select-replies-btn');
    const closeButton = this.deadReplyWidgetElement.querySelector('#qr-select-replies-window-close');

    selectRepliesButton.onclick = this.handleSelectReplies.bind(this);
    closeButton.onclick = () => this.hide();
  }

  async handleSelectReplies() {
    const limit = this.limit();
    const checkWholeChain = this.checkWholeChain();

    const thread = await this.fetchThread();
    this.checkDeadReplyPosts(thread, limit, checkWholeChain);

    await window.selectedPostsNavFeature.updateSelectedNavCounter();
  }

  limit() {
    return this.deadReplyWidgetElement.querySelector('#select-replies-limit').value;
  }

  checkWholeChain() {
    return this.deadReplyWidgetElement.querySelector('#select-replies-chains').checked;
  }

  async fetchThread() {
    const response = await fetch(location.href.replace('html', 'json'));
    const data = await response.json();

    return data.threads[0].posts.slice(1);
  }

  // Check replies to removed posts
  checkDeadReplyPosts(posts, limit = 0, checkWholeChain = false) {
    const deadReplyPosts = this.findDeadReplyPosts(posts, limit, checkWholeChain);

    deadReplyPosts.forEach(post => this.checkPost(post));

    $alert(`Выделено ${ deadReplyPosts.length } постов.`);
  }

  checkPost(post) {
    const postElement = $(`.post[data-num="${ post.num }"]`);

    postElement.find('.turnmeoff').prop('checked', true);
    postElement.addClass('post_type_highlight');
  }

  // Get replies to removed posts
  findDeadReplyPosts(posts, limit, checkWholeChain) {

    let deadReplyPosts = posts.filter((post, index, self) => this.hasDeadReplies(post, self));

    if (checkWholeChain)
      deadReplyPosts = this.includeWholeChain(deadReplyPosts, posts);

    // Limit from the end of the thread
    if (limit) {
      const postsTrim = new Set([ ...posts ].reverse().slice(0, limit));

      deadReplyPosts = deadReplyPosts.filter(post => postsTrim.has(post));
    }

    return [ ...new Set(deadReplyPosts) ];
  }

  hasDeadReplies(post, posts) {
    const replies = this.findReplies(post);

    if (!replies)
      return false;

    return replies.every(reply => !this.isExistingPost(reply, posts));
  }

  findReplies(post) {
    const replyPattern = />>[0-9]+(?!.*(\(OP\)|→))/g;
    const replies = post.comment?.match(replyPattern);

    return replies?.map(reply => reply.replace('>>', ''));
  }

  isExistingPost(reply, posts) {
    return posts.some(some => some.num === parseInt(reply));
  }

  includeWholeChain(deadReplyPosts, posts) {
    const replies = deadReplyPosts.flatMap(post => this.getReplyChain(posts, post.num));

    return deadReplyPosts.concat(replies);
  }

  // Get whole chain by post
  getReplyChain(posts, postNumber, result = new Set()) {
    const replyPattern = new RegExp(`>>${ postNumber }(?!.*(\(OP\)|→))`, 'g');

    posts.forEach(post => {
      if (post.comment?.match(replyPattern)) {
        result.add(post);
        this.getReplyChain(posts, post.num, result);
      }
    });

    return [ ...result ];
  }

  show() {
    if (this.deadReplyWidgetElement)
      this.deadReplyWidgetElement.style.display = 'block';
  }

  hide() {
    if (this.deadReplyWidgetElement)
      this.deadReplyWidgetElement.style.display = 'none';
  }
}

class SelectedPostsNavFeature {
  selectedPostsNavStyles = `
    .na-selected-posts {
      height: auto !important;
      width: auto !important;
      top: calc(50% - 60px);
      order: 1;
    }
  `;

  selectedPostsContainerHTML = `
    <div id="na_selected_posts" class="na-selected-posts element_hidden_important">
      <span id="selected_post_link" style="display: inline-block; min-width: 45px" title="Выбранные посты в треде">
        🧹
        <strong>
          <div id="selected_post_count" style="color: red" class="element_inline_important"></div>
        </strong>
      </span>
      <button id="selected_prev_post" class="button desktop" type="button">🔼</button>
      <button id="selected_next_post" class="button desktop" type="button">🔽</button>
    </div>
  `;

  selectedPostsContainerEl = createElementFromHTML(this.selectedPostsContainerHTML).querySelector("#na_selected_posts");

  init() {
    GM_addStyle(this.selectedPostsNavStyles);
    window.navContainerFeature.navContainerNode.appendChild(this.selectedPostsContainerEl);

    const ipPrevBtn = this.selectedPostsContainerEl.querySelector("#selected_prev_post");
    const ipNextBtn = this.selectedPostsContainerEl.querySelector("#selected_next_post");

    ipPrevBtn.onclick = () => this.navigateToNextSelectedPost(false);
    ipNextBtn.onclick = () => this.navigateToNextSelectedPost(true);

    this.updateSelectedNavCounter();
    this.setupListeners();
  }

  setupListeners() {
    $('#js-posts').on('click', '[name="delete"]', () => {
      this.updateSelectedNavCounter();
    });

    $('#js-posts').on('mouseover', (e) => {
      if (e.altKey || e.shiftKey) {
        this.updateSelectedNavCounter();
      }
    });

    $('#js-posts').on('click', (e) => {
      if (e.ctrlKey) {
        this.updateSelectedNavCounter();
        e.stopPropagation();
        e.preventDefault();
      }
    });

    $('.makaba').on('click', '#ABU-select', () => {
      this.updateSelectedNavCounter();
    });
  }

  /**
   * @return {Element[]}
   */
  getSelectedPostsNodes() {
    return Array.from(document.querySelectorAll('[name="delete"]:checked'));
  }

  updateSelectedNavCounter() {
    const naSelectedPostsElement = document.getElementById('na_selected_posts');
    const selectedPostCount = this.getSelectedPostsNodes().length;

    if (selectedPostCount === 0) {
      naSelectedPostsElement.classList.add("element_hidden_important");
      naSelectedPostsElement.classList.remove("element_inline_important");
      return;
    }

    const selectedPostCounterEl = document.getElementById(
      'selected_post_count'
    );

    selectedPostCounterEl.textContent = String(selectedPostCount);

    naSelectedPostsElement.classList.remove('element_hidden_important');
    naSelectedPostsElement.classList.add('element_inline_important');
  }

  /**
   * @param {boolean} isDownside
   */
  navigateToNextSelectedPost(isDownside) {
    const selectedPosts = this.getSelectedPostsNodes();

    if (selectedPosts.length === 0) {
      return;
    }

    const nextPost = this.getNextPost(selectedPosts, isDownside);

    const postBodyOffsetTop = $(nextPost).closest('.post').first().offset().top;

    const y = postBodyOffsetTop - window.innerHeight / 2;

    window.scrollTo({
      top: y,
      left: 0,
      behavior: "smooth",
    });
  }


  /**
   * @param {Element[]} selectedPosts
   * @param {boolean} isDownside
   * @return {Element}
   */
  getNextPost(selectedPosts, isDownside) {
    const selectedPostsDistance = selectedPosts.map((elem) =>
      elem.getBoundingClientRect().top - window.innerHeight / 2
    );

    if (isDownside) {
      const nextItemIndex = selectedPostsDistance.findIndex((distance) => distance > 50);

      if (nextItemIndex === -1) {
        return selectedPosts[0];
      }

      return selectedPosts[nextItemIndex];
    }

    if (!isDownside) {
      const prevItemIndex = selectedPostsDistance.findLastIndex((distance) => distance < -50);

      if (window.scrollY === 0) {
        return selectedPosts[selectedPosts.length - 1];
      }

      if (prevItemIndex === -1) {
        return selectedPosts[selectedPosts.length - 1];
      }

      return selectedPosts[prevItemIndex];
    }
  }
}

const enableReportFeatures = () => {
  GM_addStyle(reportContainerStyle);
  GM_addStyle(styleInlineImportant);
  window.navContainerFeature.navContainerNode.appendChild(reportContainerEl);

  const repPrevBtn = reportContainerEl.querySelector("#rep_prev_post");
  const repNextBtn = reportContainerEl.querySelector("#rep_next_post");

  repPrevBtn.onclick = () => moveToReportedPost(false);
  repNextBtn.onclick = () => moveToReportedPost(true);

  reporterBanWindowAction = makeReportBanForm();

  updateThreadReportsMap(true);

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
  GM_addStyle(styleSubnetDropdown);

  const posts = $(threadEl)
    .find(".post__details:not(:has(.post__detailpart > .pik))")
    .get();

  if (posts.length === 0) {
    return;
  }

  const threadDataPromise = request({
    url: `/moder/posts/${board}?action=show_thread&parent=${thread_id}&json=true`,
  }).then((result) => JSON.parse(result));

  const [threadData, modLevel] = await Promise.all([
    threadDataPromise,
    moderLevelPromise,
  ]);

  threadFullData = threadData;
  postNumbersByIp = getPostNumbersByIp(threadData);

  const threadPosts = threadData.posts.reduce((acc, val) => {
    return { ...acc, [val.num]: val };
  }, {});

  const iChanAuth = '6e88330e8fb3548e79ceeb1f6ab28543';

  const nicknames = getAllNicknames();

  posts.forEach((postEl) => {

    const postId = postEl.id.replace("post-details-", "");

    const postData = threadPosts[postId];

    if (!postData) {
      return;
    }

    const { ip, vip, country, auth } = postData;

    const subnetData = `
      <div class="subnet-dropdown-btn" onclick="displaySubnetsInfo('${ip}', '${postId}', this)">
        <a title="Локальный поиск постов по подсети">[NET]</a>
      </div>&nbsp;
    `;
    
    const vipachData = vip > 27383 ? `<div style="margin-top: -2px" title="Многоуважаемый подписчик випача">👑</div>` : "";

    const vipData = vip
      ? (modLevel >= 4
        ? `<a href="/moder/posts_global?passcode=${vip}" target="_blank" style="display: flex">
            <span class="passcode" style="color:#ff0000" title="Глобальный поиск постов по пасскоду">
              ${vip}
            </span>
            ${vipachData}
          </a>&nbsp;`
        : `<div style="display: flex">
            <span style="color:#ff0000">${vip}</span>
            ${vipachData}
          </div>&nbsp;`)
      : "";

    const isIChanAuth = auth === iChanAuth;

    const { nickname, color } = findNicknameInfoForPost(postData, nicknames);

    const authData = auth
      ? isIChanAuth
        ? `<span class="post-auth post-auth-warning">iChan</span>&nbsp;`
        : `<label class="foldable-label"><input type="checkbox"><span class="post-auth">${auth}</span></label>&nbsp;`
      : "";

    const ipData = `
      <span class="pik" data-ip="${ip}">
        <span class="ip__data">${ip}</span>
        ${
          country
            ? `&nbsp;<img src="/flags/${country}.png" alt="${country}">`
            : ""
        }
      </span>&nbsp;
      <a href="/api/whois?ip=${ip}" target="_blank" style="text-decoration:none;" title="WHOIS">[W]</a>&nbsp;
      <a href="/moder/posts/${board}?action=show_ip&ip=${ip}" target="_blank" style="text-decoration:none;" title="Локальный поиск постов по IP">[S]</a>&nbsp;
      <a href="/moder/posts_global?ip=${ip}"target="_blank" style="text-decoration:none;" title="Глобальный поиск постов по IP">[GS]</a>&nbsp;
      ${
        auth ?
        `<a
          href="/moder/posts_global?usercode=${auth}"
          class="open-auth-btn ${isIChanAuth ? 'open-auth-btn-warning' : ''}"
          target="_blank"
          title="Глобальный поиск постов по Auth">
          [AS]
        </a>&nbsp;`
      : ''}
      ${modLevel >= 4 ? subnetData : ""}
      ${modLevel >= 6 ?
        `<a href="/moder/modlog?action=search&text=${ip}"
          target="_blank"
          style="text-decoration:none;"
          title="Поиск мод-действий по IP">
          [MS]
      </a>&nbsp;`
      : ''}
      ${modLevel >= 6 ?
        `<a href="/moder/modlog?action=search&text=${auth}"
          class="open-auth-btn ${isIChanAuth ? 'open-auth-btn-warning' : ''}"
          target="_blank"
          style="text-decoration:none;"
          title="Поиск мод-действий по Auth">
          [AMS]
        </a>&nbsp;`
      : ''}
      ${vipData}
      ${authData}
      ${nickname ? `<span class="post-nickname" style="color: ${color}">${nickname}</span>&nbsp;` : ""}
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

const getPostNumbersByIp = (threadData) => {
  let res = {};

  threadData.posts.forEach((post) => {
    if (!res.hasOwnProperty(post.ip)) {
      res[post.ip] = [];
    }
    res[post.ip].push(post.num);
  })

  return res;
}

const enableModIps = () => {
  // Отключаем дефолтную функцию рендеринга доп. инфы для постов
  ModIp.load = () => {};

  const threadEl = document.querySelector("div.thread");

  const updatePostIps = () => {
    if (
      !modFeaturesDisabled &&
      !Store.get("other.disableip", false) &&
      (!modLevel || modLevel >= 3)
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

  $(`${ modCheckboxSelector }:checked`)
    .each((index, checkbox) => {
      $checkbox = $(checkbox);
      $post = $(`[data-num="${ $checkbox.attr('value') }"]`);

      $checkbox.prop('checked', false);
      $post.removeClass('post_type_highlight');

    });
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

      window.selectedPostsNavFeature.updateSelectedNavCounter();
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
        const previewClasses = [];

        if (postBody.className.includes('post_type_deleted')) {
          previewClasses.push('post_type_deleted')
        };

        if (postBody.className.includes('post_type_highlight')) {
          previewClasses.push('post_type_highlight')
        };

        return `<div class="${previewClasses.join(' ')}">${postBody.innerHTML}</div>`;
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

const setupMultiselectBansByAltButton = () => {
  $('.banlisttable').on('mouseover', 'tbody > tr', function(e) {
    if (e.altKey && e.shiftKey) {
      $(e.currentTarget).find('input').prop('checked', false);
      $(e.currentTarget).removeClass('warning');
    } else if (e.altKey) {
      $(e.currentTarget).find('input').prop('checked', true);
      $(e.currentTarget).addClass('warning');
    }
  });
}

deleteAllByPasscode = async (postNum, isGlobal, skipConfirm) => {
  const selectedPost = threadFullData.posts.find((post) => post.num === postNum);

  if (!selectedPost.vip) {
    return;
  }

  if (!skipConfirm && !confirm("Вы уверены в своих действиях?")) {
    return;
  }

  $alert(`Загружаем посты для пасскода ${selectedPost.vip}...`, 'wait');

  const getPostsByPasscodeRes = await fetch(`/moder/posts_global?passcode=${selectedPost.vip}&json=1`).then((res) => res.json());

  $close($id("alert-wait"));

  const badPosts = isGlobal
    ? getPostsByPasscodeRes.posts
    : getPostsByPasscodeRes.posts.filter((post) => post.board === selectedPost.board);

  const queryPosts = badPosts.map((post) => `&post=${post.board}_${post.num}`).join('');

  $alert('Удаляем неприятное...', 'wait');

  await fetch(`/moder/actions/delete_posts?json=1&dummy=1${queryPosts}`);

  $close($id("alert-wait"));

  PostF.updateThread();
}

showBanPasscodeForm = async (postNum, el, postsAction) => {
  const selectedPost = threadFullData.posts.find((post) => post.num === postNum);

  if (!selectedPost.vip) {
    alert('У этого постера нет пасскода')
    return;
  }

  const banPasscodeHtmlForm = `
    <div class="ban-passcode-header">
      <span>Бан пасскода №${selectedPost.vip}</span>
      <input type="button" class="button" value="X" onclick="$('#ban-passcode').remove()"></div>
    </div>
    <input id="bancomment" type="text" placeholder="Причина бана" class="input ban-passcode-reason">
    <div class="ban-passcode-footer">
      <input id="banexpires" type="text" size="10" class="input">
      <button id="ban-paccode-submit-btn" type="submit" class="button" onclick="banPasscode(${postNum}, '${postsAction}', ${selectedPost.vip}, $('#banexpires').val(), $('#bancomment').val())">Забанить пасскод</button>
    </div>
  `;

  document.body.appendChild($new('div', {
    'class': 'modal mod-ban ban-passcode',
    'id': 'ban-passcode',
    'style': 'left:' + ($offset(el, 'offsetLeft').toString() - 18) + 'px; top:' + ($offset(el, 'offsetTop') + el.offsetHeight - 1).toString() + 'px',
    'html': banPasscodeHtmlForm
  }));

  $('#banexpires').datepicker({
    dateFormat: 'yy/mm/dd',
    defaultDate: +2
  }).datepicker("setDate", +2);

  $('#banreason').focus();
}

banPasscode = async (postNum, postsAction, passcodeNum, expires, bancomment) => {
  if (!confirm("Вы уверены в своих действиях?")) {
    return;
  }

  $('#ban-passcode').remove();

  $alert(`Баним пасскод ${passcodeNum}...`, 'wait');

  await banPasscodeRequest(passcodeNum, expires, bancomment);

  $close($id("alert-wait"));

  if (postsAction === 'removeLocally') {
    deleteAllByPasscode(postNum, false, true);
    return;
  }

  if (postsAction === 'removeGlobally') {
    deleteAllByPasscode(postNum, true, true);
    return;
  }
}

function setupClickablePasscodesForModPanel() {
  moderLevelPromise.then((modLevel) => {
    if (modLevel >= 4) {
      $(document).on("mousedown", "[title=Пасскод]", function (e) {
        const passcode = e.target.innerHTML;
        window.open(`/moder/posts_global?passcode=${passcode}`, '_blank').focus();
      });
    }
  })
}

function banPasscodeRequest(passcodeNum, expires, bancomment) {
  const formData = new FormData();
  formData.append("passcode_num", passcodeNum);
  formData.append("expires", new Date(expires).getTime() / 1000);
  formData.append("comment", bancomment);

  return fetch("/moder/actions/passcode_ban", {
    method: "POST",
    body: formData,
  });
}

function setupPasscodeActions() {
  $(document).on("click", ".post__btn", function (e) {
    setTimeout(() => {
      if (
        $("#delete-all-by-passcode-locally").length > 0 ||
        $("#ABU-select > a:contains('Выделить всю цепочку ответов')").length === 0
      ) {
        return;
      }

      const postNum = $(e.target).closest('[data-num]').data('num');

      const selectedPost = threadFullData.posts.find((post) => post.num === postNum);

      if (!selectedPost.vip) {
        return;
      }

      const hasGlobalAccess = threadFullData.moder.Boards.includes('All');

      const extraButtons = `
        ${modLevel >= 6 ? `<a id="ban-passcode" onclick="showBanPasscodeForm(${postNum}, this)"><span style="color: orange">(Пасс)</span> Забанить</a>` : ''}
        ${modLevel >= 4 ? `<a id="delete-all-by-passcode-locally" onclick="deleteAllByPasscode(${postNum}, false)"><span style="color: orange">(Пасс)</span> Удалить всё</a>` : ''}
        ${modLevel >= 6 ? `<a id="delete-all-by-passcode-locally-and-ban" onclick="showBanPasscodeForm(${postNum}, this, 'removeLocally')"><span style="color: orange">(Пасс)</span> Удалить всё и забанить</a>` : ''}
        ${modLevel >= 4 && hasGlobalAccess ? `<a id="delete-all-by-passcode-globally" onclick="deleteAllByPasscode(${postNum}, true)" class="mod-action-massban"><span style="color: orange">(Пасс)</span> Удалить всё на борде</a>` : ''}
        ${modLevel >= 6 && hasGlobalAccess ? `<a id="delete-all-by-passcode-globally-and-ban" onclick="showBanPasscodeForm(${postNum}, this, 'removeGlobally')" class="mod-action-massban"><span style="color: orange">(Пасс)</span> <span class="action-menu-small-item">Удалить всё и забанить на борде</span></a>` : ''}
      `;

      $("#ABU-select > a:contains('Выделить всю цепочку ответов')").after(extraButtons);
    });
  });
}

// == BEGIN NICKNAME MANAGER ==

showAddNicknameModal = async(el) => {
  // Удаляем существующее модальное окно, если есть
  $('#add-nickname-modal').remove();

  const postNum = Number($(el).data('query').split('_')[1]);

  const selectedPost = threadFullData.posts.find((post) => post.num === postNum);

  if (!selectedPost) {
    return;
  }

  const { ip, vip, auth } = selectedPost;

  // Info: цвета можно менять
  const nicknameColors = [
    '#0000ff',
    '#007e00',
    '#ffff00',
    '#ff0000',
    '#000000',
  ];

  const nicknameHtmlForm = `
    <form class="nickname-form" autocomplete="off">
      <div class="nickname-header">
        <b>Добавить никнейм</b>
        <input type="button" class="button" value="X" onclick="$('#add-nickname-modal').remove()">
      </div>
      
      <div class="nickname-options">
        <label><input type="radio" name="nickname-type" value="ip" checked onchange="toggleNicknameFields()"> IP</label>
        ${auth ? `<label><input type="radio" name="nickname-type" value="auth" onchange="toggleNicknameFields()"> Auth</label>` : ''}
        ${vip ? `<label><input type="radio" name="nickname-type" value="pass" onchange="toggleNicknameFields()"> Pass</label>` : ''}
      </div>
      
      <div id="ip-field" class="nickname-field">
        <input id="ip-input" type="text" placeholder="IP адрес" readonly class="ip-input input" value="${ip}">
        <input id="subnet-input" type="number" placeholder="Сабнет (1-32)" class="subnet-input input" min="1" max="32" value="32">
      </div>
    
      <div id="auth-field" class="nickname-field" style="display: none;">
        <input id="auth-input" type="text" placeholder="Auth ID" readonly class="auth-input input" value="${auth}">
      </div>

      <div id="pass-field" class="nickname-field" style="display: none;">
        <input id="pass-input" type="text" placeholder="Пасскод" readonly class="pass-input input" value="${vip}">
      </div>

      <input id="nickname-input" type="text" placeholder="Введите никнейм" class="nickname-input input">

      <input id="nickname-color-input" type="color" style="display: none;" value="#000000">

      <div class="nickname-colors-container">
        ${nicknameColors.map((color) => `<button type="button" class="nickname-color-button" onclick="setNicknameColor('${color}')" style="background-color: ${color}"></button>`).join('')}
      </div>
      
      <div class="nickname-footer">
        <button id="nickname-submit-btn" type="submit" class="nickname-submit-btn button" onclick="saveNickname()">Сохранить</button>
      </div>
    </form>
  `;

  const modalHeight = 191;

  document.body.appendChild($new('div', {
    'class': 'modal mod-ban nickname-modal',
    'id': 'add-nickname-modal',
    'style': 'left:' + ($offset(el, 'offsetLeft').toString() - 18) + 'px; top:' + ($offset(el, 'offsetTop') + el.offsetHeight - modalHeight).toString() + 'px',
    'html': nicknameHtmlForm
  }));
}

removeNickname = async(el) => {
  const postNum = Number($(el).data('query').split('_')[1]);

  const selectedPost = threadFullData.posts.find((post) => post.num === postNum);

  if (!selectedPost) {
    return;
  }

  const { nickname } = findNicknameInfoForPost(selectedPost, getAllNicknames());

  if (!nickname) {
    return;
  }


  if (!confirm(`Вы уверены, что хотите убрать никнейм ${nickname}?`)) {
    return;
  }

  removeNicknameForPost(selectedPost);
}

toggleNicknameFields = () => {
  const selectedType = $('input[name="nickname-type"]:checked').val();
  
  // Скрываем все поля
  $('.nickname-field').hide();
  
  // Показываем нужное поле
  if (selectedType === 'ip') {
    $('#ip-field').show();
  } else if (selectedType === 'pass') {
    $('#pass-field').show();
  } else if (selectedType === 'auth') {
    $('#auth-field').show();
  }
}

setNicknameColor = (color) => {
  $('#nickname-color-input').val(color);
  $('#nickname-input').css('color', color);
}

saveNickname = () => {
  const nickname = $('#nickname-input').val();
  const selectedType = $('input[name="nickname-type"]:checked').val();
  const color = $('#nickname-color-input').val();
  
  let typeValue = '';
  
  if (selectedType === 'ip') {
    const ip = $('#ip-input').val();
    const subnet = $('#subnet-input').val();
    typeValue = ip + (subnet ? '/' + subnet : '');
  } else if (selectedType === 'pass') {
    typeValue = $('#pass-input').val();
  } else if (selectedType === 'auth') {
    typeValue = $('#auth-input').val();
  }
  
  addNickname(nickname, selectedType, typeValue, color);

  $('#add-nickname-modal').remove();
}

addNickname = (nickname, type, typeValue, color) => {
  const nicknames = getAllNicknames();

  if (type === 'ip') {
    if (typeValue.endsWith('/32')) {
      typeValue = typeValue.slice(0, -3);
    } else {
      type = 'subnet';
    }
  }

  nicknames[type][typeValue] = { nickname, color };
  localStorage.setItem('nicknames', JSON.stringify(nicknames));
}

getAllNicknames = () => {
  const defaultNicknames = { ip: {}, subnet: {}, pass: {}, auth: {} };
  const nicknames = JSON.parse(localStorage.getItem('nicknames')) || defaultNicknames;

  return nicknames;
}

ipToLong = (ip) => {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0) >>> 0;
}

isIpInSubnet = (ip, subnet) => {
  const [subnetIp, maskLength] = subnet.split('/');
  const ipLong = ipToLong(ip);
  const subnetLong = ipToLong(subnetIp);
  const mask = ~(2 ** (32 - parseInt(maskLength)) - 1) >>> 0;

  return (ipLong & mask) === (subnetLong & mask);
}

isIpInAnySubnet = (ip, subnets) => {
  return subnets.some(subnet => isIpInSubnet(ip, subnet));
}

findNicknameInfoForPost = (post, allNicknames) => {
  const { ip, vip, auth } = post;

  if (allNicknames.pass[vip]) {
    return allNicknames.pass[vip];
  }

  if (allNicknames.auth[auth]) {
    return allNicknames.auth[auth];
  }

  if (allNicknames.ip[ip]) {
    return allNicknames.ip[ip];
  }

  const [subnet, nicknameInfoBySubnet] = Object
    .entries(allNicknames.subnet)
    .find(([subnet]) => isIpInSubnet(ip, subnet)) || [];

  if (nicknameInfoBySubnet) {
    return nicknameInfoBySubnet;
  }

  return {};
}

removeNicknameForPost = (post) => {
  const allNicknames = getAllNicknames();

  const { ip, vip, auth } = post;

  if (allNicknames.pass[vip]) {
    delete allNicknames.pass[vip];
  }

  if (allNicknames.auth[auth]) {
    delete allNicknames.auth[auth];
  }

  if (allNicknames.ip[ip]) {
    delete allNicknames.ip[ip];
  }

  const [subnet, nicknameInfoBySubnet] = Object
    .entries(allNicknames.subnet)
    .find(([subnet]) => isIpInSubnet(ip, subnet)) || [];

  if (nicknameInfoBySubnet) {
    delete allNicknames.subnet[subnet];
  }

  localStorage.setItem('nicknames', JSON.stringify(allNicknames));
}

setupNicknameButtons = () => {
  $(".post__btn").on("click", function (e) {
    const clickedButton = e.target;
    
    setTimeout(() => {
      if ($("#add-nickname").length) {
        return;
      }

      const removeFileDataQuery =
        $("#ABU-select > a:contains('Удалить файл')").data("query");

      const removeNicknameDataQuery = removeFileDataQuery.replace("type=1", "type=0");

      const addNicknameNode = `<a
        id="add-nickname"
        draggable="false"
        rel="noopener"
        href="#"
        data-query="${removeNicknameDataQuery}"
        onclick="showAddNicknameModal(this); return false;">
        Добавить никнейм
      </a>`;

      const removeNicknameNode = `<a
        id="remove-nickname"
        draggable="false"
        rel="noopener"
        href="#"
        data-query="${removeNicknameDataQuery}"
        onclick="removeNickname(this); return false;">
        Убрать никнейм
      </a>`;

      $("#ABU-select > a:contains('Удалить файл')").after(removeNicknameNode);
      $("#ABU-select > a:contains('Удалить файл')").after(addNicknameNode);
    });
  });
}

// == END NICKNAME MANAGER ==

//
// С чего вообще всё начиналось
const parser = () => {
  const navPanel = $(".header > .header__opts");

  if (navPanel) {
    const modChkBx = makeHideModToolsChkbx();
    const refreshChkBx = makeAutorefreshChkbx();

    navPanel.append(
      [modChkBx, refreshChkBx].reduce(
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
      enableIpPostsFeature();
      enableModIps();

      window.selectedPostsNavFeature = new SelectedPostsNavFeature();
      window.selectedPostsNavFeature.init();

      window.additionalNavButtons = new AdditionalNavButtons();
      window.additionalNavButtons.init();

    }

    const isOriginModScriptLoaded = typeof ModIp !== 'undefined';

    if (isOriginModScriptLoaded) {
      applyCustomModScripts();
    } else {
      modScriptElement.onload = () => applyCustomModScripts();
    }
  }
};

GM_addStyle(authStyles);
GM_addStyle(styleHiddenImportant);
GM_addStyle(headerExtraStyles);
GM_addStyle(postTypeHiddenExtraStyles);
GM_addStyle(postPreviewExtraStyles);
GM_addStyle(banPasscodeStyles);
GM_addStyle(nicknameStyles);

setupSelectAllCheckboxVisibility();

// внутри треда
// https://2ch.su/test/res/1.html
if (/^\/[a-z0-9]+\/res\//.test(window.location.pathname)) {
  setPostBodyFix();
  setDeletedFix();

  let navContainerFeature = new NavContainerFeature();
  navContainerFeature.init();
  window.navContainerFeature = navContainerFeature;

  clearSelection();
  moveExtraNavElementsToTop();
  hideModeFeaturesIfThisOptionIsSelected();
  hideModFeaturesForNotOwnBoards();
  setupPasscodeActions();
  setupMassPostsSelect();
  setupNicknameButtons();
  parser();
}

// внутри доски
// https://2ch.su/test/
if (/^\/[a-z0-9]+\/$/.test(window.location.pathname)) {
  hideModeFeaturesIfThisOptionIsSelected();
  hideModFeaturesForNotOwnBoards();
}

// на странице банов
// https://2ch.su/moder/banlist
if (/\/moder\/banlist/.test(window.location.pathname)) {
  setupMultiselectBansByAltButton();
}

// внутри мод-панели
// https://2ch.su/moder/posts/test
// https://2ch.su/moder/posts_global
if (
  /\/moder\/posts\//.test(window.location.pathname) ||
  /\/moder\/posts_global/.test(window.location.pathname)
) {
  GM_addStyle(modPanelPasscodeStyle);
  setupClickablePasscodesForModPanel();
}
