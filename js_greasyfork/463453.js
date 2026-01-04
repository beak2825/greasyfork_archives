// ==UserScript==
// @name            AtCoder Add Submissions Shortcuts
// @name:ja         AtCoder Add Submissions Shortcuts
// @namespace       https://github.com/xe-o
// @version         0.3
// @description     Add links to the AtCoder task page that open a list of submissions for the current task with custom filters applied.
// @description:ja  AtCoderの各問題ページのタブメニューに対して、任意のフィルター・並び順を適用した状態でその問題の提出一覧を開くリンクを追加します。
// @author          XERO
// @license         MIT
// @match           https://atcoder.jp/contests/*/tasks/*
// @grant           GM_getValue
// @grant           GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/463453/AtCoder%20Add%20Submissions%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/463453/AtCoder%20Add%20Submissions%20Shortcuts.meta.js
// ==/UserScript==

(async function () {
  const linkSettings = [
    {
      label: "Fastest",
      icon: "time",
      urlParams: "f.Status=AC&orderBy=time_consumption",
    },
    {
      label: "Shortest",
      icon: "flag",
      urlParams: "f.Status=AC&orderBy=source_length",
    },
  ];

  const pathArray = window.location.pathname.split("/");
  const taskId = pathArray[pathArray.length - 1];
  const contestId = pathArray[2];
  const submissionsUrl = `https://atcoder.jp/contests/${contestId}/submissions`;

  const cachedLinksHtml = GM_getValue(
    `atcoder-submission-shortcuts:${contestId}:${taskId}`
  );
  if (cachedLinksHtml) {
    addLinksToDom(cachedLinksHtml);
  } else {
    const response = await fetch(submissionsUrl, { method: "HEAD" });
    if (response.ok) {
      const linksHtml = linkSettings
        .map(({ label, icon, urlParams }) =>
          createButtonHtml(submissionsUrl, taskId, label, icon, urlParams)
        )
        .join("");
      GM_setValue(
        `atcoder-submission-shortcuts:${contestId}:${taskId}`,
        linksHtml
      );
      addLinksToDom(linksHtml);
    }
  }

  function createButtonHtml(submissionsUrl, taskId, label, icon, urlParams) {
    const buttonUrl = `${submissionsUrl}?${urlParams}&f.Task=${taskId}`;
    return `<li><a href="${buttonUrl}"><span class="glyphicon glyphicon-${icon}" style="margin-right:4px;" aria-hidden="true"></span>${label}</a></li>`;
  }

  function addLinksToDom(linksHtml) {
    const pullRightListItem = document.querySelector("li.pull-right");
    if (pullRightListItem) {
      pullRightListItem.insertAdjacentHTML("beforebegin", linksHtml);
    }
  }
})();
