// ==UserScript==
// @name           AtCoder Non-Participant Hider
// @namespace      https://github.com/Gai-H/atcoder-non-participant-hider
// @version        1.2
// @description    Add a filter to hide non-participants from favs only standings table on AtCoder.
// @description:ja お気に入りの順位表に不参加者を隠すフィルターを追加します。
// @author         Gai
// @source         https://github.com/Gai-H/atcoder-non-participant-hider
// @match          https://atcoder.jp/*standings*
// @exclude        https://atcoder.jp/*standings/json
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/470676/AtCoder%20Non-Participant%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/470676/AtCoder%20Non-Participant%20Hider.meta.js
// ==/UserScript==

const CHECKBOX_ID = "checkbox-fav-only-participant-atcodernonparticipanthider";
const CHECKBOX_TEXT_JA = "お気に入りの不参加者を非表示";
const CHECKBOX_TEXT_EN = "Hide non-participants from favs";
const CHECKBOX_HTML = `
<div class="checkbox">
  <label>
    <input id="${CHECKBOX_ID}" type="checkbox">
    ${document.cookie.includes("language=ja") ? CHECKBOX_TEXT_JA : CHECKBOX_TEXT_EN}
  </label>
</div>
`;

let theCheckbox = null;
let favOnlyCheckbox = null;
let standingsTbody = null;

// チェックボックス追加
const bodyObserver = new MutationObserver((_, observer) => {
  favOnlyCheckbox = document.getElementById("checkbox-fav-only");
  if (!favOnlyCheckbox) return;

  observer.disconnect();
  favOnlyCheckbox.addEventListener("change", onFavOnlyCheckboxChange);

  const favOnlyCheckboxDiv = favOnlyCheckbox.parentElement.parentElement;
  favOnlyCheckboxDiv.insertAdjacentHTML("afterend", CHECKBOX_HTML);

  theCheckbox = document.getElementById(CHECKBOX_ID);
  theCheckbox.disabled = !favOnlyCheckbox.checked;
  theCheckbox.checked = JSON.parse(localStorage.getItem(CHECKBOX_ID) ?? "true");
  theCheckbox.addEventListener("change", onTheCheckboxChange);

  standingsTbody = document.getElementById("standings-tbody");
  standingsTbodyObserver.observe(standingsTbody, {
    childList: true,
    attributeFilter: ["class"],
  });

  hideNonParticipants();
});
bodyObserver.observe(document.body, {
  childList: true,
  subtree: true,
});

// 順位表テーブルのハンドラ
const standingsTbodyObserver = new MutationObserver(() => hideNonParticipants());

// "お気に入りのみ表示"チェックボックスのハンドラ
const onFavOnlyCheckboxChange = () => {
  theCheckbox.disabled = !favOnlyCheckbox.checked;
  hideNonParticipants();
};

// "お気に入りの不参加者を非表示"チェックボックスのハンドラ
const onTheCheckboxChange = () => {
  localStorage.setItem(CHECKBOX_ID, theCheckbox.checked);
  hideNonParticipants();
};

const hideNonParticipants = () => {
  if (!favOnlyCheckbox.checked) return;
  const standingsTrs = standingsTbody.children;
  for (const row of standingsTrs) {
    const rankTd = row.children[0];
    if (theCheckbox.checked && rankTd.innerText === "-") {
      row.classList.add("hidden");
    } else if (!theCheckbox.checked || (theCheckbox.checked && rankTd.innerText !== "-")) {
      row.classList.remove("hidden");
    }
  }
};
