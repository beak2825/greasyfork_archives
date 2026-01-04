// ==UserScript==
// @name        Arrest Target Finding Tool
// @author      IAmBatman [2885239]
// @version     1.1
// @description A script for finding arrest targets.
// @match       https://www.torn.com/factions.php*
// @match       https://www.torn.com/joblist.php*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @namespace https://greasyfork.org/users/1362698
// @downloadURL https://update.greasyfork.org/scripts/528792/Arrest%20Target%20Finding%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/528792/Arrest%20Target%20Finding%20Tool.meta.js
// ==/UserScript==

(async function () {
  "use strict";
  GM_addStyle(`
    .afinder-btn{
    height: 28px !important;
    width: 32px !important;
    padding: 0 5px !important;
    line-height: 0 !important;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translate(125%, -50%);
    }

    .afinder-btn:hover{
        cursor: pointer;
    }

    .afinder-check-faction{
      height: 24px;
      width: 24px;
      stroke: var(--default-green-color);
      position: absolute;
      right: 0;
      transform: translate(125%, 20%);
    }

    .afinder-check-company{
      height: 24px;
      width: 24px;
      stroke: var(--default-green-color);
      position: absolute;
      right: 0;
      top: 0;
      transform: translate(0%, 15%);
    }

    .table-header{
      position: relative;
    }

    .table-row{
      position: relative;
    }

    .item.icons{
      position: relative;
      overflow: visible;
    }
`);

  const apiKey = await GM_getValue("arrestFinderApiKey", null);
  let page;

  if (window.location.href.includes("p=corpinfo")) page = "company";
  else page = "faction";

  if (!apiKey) {
    let key = prompt("Enter your API key, then refresh");

    const url = `https://api.torn.com/key/?key=${key}&selections=info&comment=InvSorter`;

    try {
      const res = await fetch(url);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(res.status);
        return;
      }

      if (data.error && data.error.error) {
        return;
      }

      await GM_setValue("arrestFinderApiKey", key);
    } catch (err) {
      console.error(err);
    }
  }

  const button = document.createElement("button");
  button.classList.add("afinder-btn");
  button.classList.add("torn-btn");
  button.textContent = "AF";

  const obs = new MutationObserver((mutationList, observer) => {
    if (page === "faction" && document.querySelector(".table-header")) {
      document.querySelector(".table-header").appendChild(button);
      observer.disconnect();
    } else if (
      page === "company" &&
      document.querySelector(".employees-wrap")
    ) {
      document
        .querySelector(".employees-wrap")
        .querySelector(".title-black")
        .appendChild(button);
      observer.disconnect();
    }
  });

  obs.observe(document.body, {
    childList: true,
    subtree: true,
  });

  const userIds = [];
  button.addEventListener("click", async (e) => {
    e.preventDefault();
    button.disabled = true;

    let memberElements;
    if (page === "faction") {
      memberElements = document
        .querySelector(".table-body")
        .querySelectorAll('[href*="/profiles.php?XID="]');
    } else {
      memberElements = document
        .querySelector(".employees-wrap")
        .querySelectorAll('[href*="/profiles.php?XID="]');
    }

    for (const memberEl of memberElements) {
      userIds.push(memberEl.href.split("XID=")[1]);
    }

    const now = Math.floor(Date.now() / 1000);
    const oneMonthAgo = now - 60 * 60 * 24 * 30;

    let apiCallCount = 0;
    for (const userId of userIds) {
      const nowUrl = `https://api.torn.com/user/${userId}?key=${apiKey}&selections=personalstats,criminalrecord&stat=jailed&comment=ArrestFinder`;
      const oneMonthAgoUrl = `https://api.torn.com/user/${userId}?key=${apiKey}&selections=personalstats&stat=jailed&timestamp=${oneMonthAgo}&comment=ArrestFinder`;

      try {
        const res1 = await fetch(nowUrl);
        const res2 = await fetch(oneMonthAgoUrl);

        if (!res1.ok || !res2.ok) {
          throw new Error(`${res1.status}, ${res2.status}`);
          return;
        }

        const data1 = await res1.json();
        const data2 = await res2.json();

        if (
          (data1.error && data1.error.error) ||
          (data2.error && data2.error.error)
        ) {
          return;
        }

        const jailCountLastMonth =
          data1.personalstats.jailed - data2.personalstats.jailed;

        if (jailCountLastMonth === 0 && data1.criminalrecord.total > 30000) {
          let rowEl;
          let checkSvg;
          if (page === "faction") {
            rowEl = document
              .querySelector(".table-body")
              .querySelector(`[href*="/profiles.php?XID=${userId}"]`)
              .closest(".table-row");

            checkSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="afinder-check-faction">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>`;
          } else {
            rowEl = document
              .querySelector(".employees-wrap")
              .querySelector(`[href*="/profiles.php?XID=${userId}"]`)
              .closest(".item.icons");

            checkSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="afinder-check-company">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>`;
          }

          const div = document.createElement("div");
          rowEl.appendChild(div);
          div.insertAdjacentHTML("afterend", checkSvg);
          div.remove();
        }

        apiCallCount += 2;
        if (apiCallCount >= 70) {
          console.log("hit rate limit, sleeping for one minute");
          await sleep(60000);
          apiCallCount = 0;
        }
      } catch (err) {
        console.error(err);
      }
    }
    button.disabled = false;
  });

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
})();
