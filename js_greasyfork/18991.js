// ==UserScript==
// @name         [MTurk Worker] Dashboard Enhancer
// @namespace    http://kadauchi.com/
// @version      2.2.0
// @description  Brings many enhancements to the MTurk Worker Dashboard.
// @author       Kadauchi
// @icon         http://i.imgur.com/oGRQwPN.png
// @include      https://worker.mturk.com/dashboard*
// @downloadURL https://update.greasyfork.org/scripts/18991/%5BMTurk%20Worker%5D%20Dashboard%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/18991/%5BMTurk%20Worker%5D%20Dashboard%20Enhancer.meta.js
// ==/UserScript==

try { if (mturksuite) return; } catch (e) {}

const toNum = (string) => Number(string.replace(/[^0-9.]/g, ``));
const toDate = (string) => string.split(`T`)[0];
const toMoney = (number) => `$${number.toFixed(2)}`;
const needPlus = (number) => number > 0 ? `+` : ``;

const statusDetailsTable = document.querySelector(
  `div[data-react-class="require('reactComponents/dailyWorkerStatisticsTable/DailyWorkerStatisticsTable')['default']"]`,
);
const statusDetailsArr = JSON.parse(statusDetailsTable.dataset.reactProps).bodyData;
const statusDetailsObj = statusDetailsArr.reduce((obj, details) => ({ ...obj, [toDate(details.date)]: details }), {});

const hitsOverviewTable = document.getElementById(`dashboard-hits-overview`);
const hitsOverviewRows = hitsOverviewTable.querySelectorAll(`.col-xs-5.text-xs-right`);
const hitsOverview = {
  approved: toNum(hitsOverviewRows[0].textContent),
  pending: toNum(hitsOverviewRows[1].textContent),
  rejected: toNum(hitsOverviewRows[2].textContent),
};

function allApprovedRate() {
  const row = document.createElement(`div`);
  row.className = `row m-b-sm`;

  const col1 = document.createElement(`div`);
  col1.className = `col-xs-7`;
  row.appendChild(col1);

  const strong = document.createElement(`strong`);
  strong.textContent = `All Approved Rate`;
  col1.appendChild(strong);

  const col2 = document.createElement(`div`);
  col2.className = `col-xs-5 text-xs-right`;
  col2.textContent = `${(
    ((hitsOverview.approved + hitsOverview.pending) /
     (hitsOverview.approved + hitsOverview.pending + hitsOverview.rejected)) *
    100
  ).toFixed(4)}%`;
  row.appendChild(col2);

  const hr = document.getElementById(`dashboard-hits-overview`).getElementsByTagName(`hr`)[1];
  hr.parentNode.insertBefore(row, hr);
}

function allRejectedRate() {
  const row = document.createElement(`div`);
  row.className = `row m-b-sm`;

  const col1 = document.createElement(`div`);
  col1.className = `col-xs-7`;
  row.appendChild(col1);

  const strong = document.createElement(`strong`);
  strong.textContent = `All Rejected Rate`;
  col1.appendChild(strong);

  const col2 = document.createElement(`div`);
  col2.textContent = `${(
    (hitsOverview.approved / (hitsOverview.approved + hitsOverview.rejected + hitsOverview.pending)) *
    100
  ).toFixed(4)}%`;
  col2.className = `col-xs-5 text-xs-right`;
  row.appendChild(col2);

  const hr = document.getElementById(`dashboard-hits-overview`).getElementsByTagName(`hr`)[1];
  hr.parentNode.insertBefore(row, hr);
}

function fourDigitPercents() {
  for (const row of document.getElementById(`dashboard-hits-overview`).getElementsByClassName(`row`)) {
    if (row.textContent.includes(`Approval Rate`)) {
      row.getElementsByClassName(`text-xs-right`)[0].textContent = `${(
        (hitsOverview.approved / (hitsOverview.approved + hitsOverview.rejected)) *
        100
      ).toFixed(4)}%`;
    }
    if (row.textContent.includes(`Rejection Rate`)) {
      row.getElementsByClassName(`text-xs-right`)[0].textContent = `${(
        (hitsOverview.rejected / (hitsOverview.approved + hitsOverview.rejected)) *
        100
      ).toFixed(4)}%`;
    }
  }
}

function hitStatusChanges() {
  const old = localStorage.getItem(`statusDetailsObj`) ? JSON.parse(localStorage.getItem(`statusDetailsObj`)) : {};
  localStorage.setItem(`statusDetailsObj`, JSON.stringify(statusDetailsObj));

  function applyChanges(node) {
    node.querySelectorAll(`.desktop-row`).forEach((row) => {
      const date = row.querySelector(`a`).href.split(`/status_details/`)[1];

      row.querySelectorAll(`.text-xs-right`).forEach((col) => {
        const key = col.classList[2].replace(`-column`, ``).replace(`-`, `_`);
        const change = statusDetailsObj[date][key] - (old[date] ? old[date][key] : 0);

        if (change !== 0) {
          const span = document.createElement(`span`);
          span.textContent = key.includes(`rewards`) || key.includes(`earnings`) ? `${needPlus(change)}${toMoney(change)}` : `${needPlus(change)}${change}`;
          span.style.float = `left`;
          span.style.fontSize = `70%`;
          col.appendChild(span);
        }
      });
    });
  }

  const observer = new MutationObserver((mutationsList, observer) => {
    mutationsList.forEach((mutation) => {
      const addedNode = mutation.addedNodes[0];

      if (addedNode && addedNode.classList.contains(`expanded-row`)) {
        applyChanges(addedNode);
      }
    });
  });

  observer.observe(statusDetailsTable, { childList: true, subtree: true });
}

function latestActivity() {
  const latest = statusDetailsArr[0];
  const date = toDate(latest.date);

  const container = document.createElement(`div`);
  container.className = `row m-b-xl`;

  const col = document.createElement(`div`);
  col.className = `col-xs-12`;
  container.appendChild(col);

  const h2 = document.createElement(`h2`);
  h2.className = `m-b-md`;
  h2.textContent = `Activity for ${date}`;
  col.appendChild(h2);

  const row = document.createElement(`div`);
  row.className = `row`;
  col.appendChild(row);

  const col2 = document.createElement(`div`);
  col2.className = `col-xs-12`;
  row.appendChild(col2);

  const border = document.createElement(`div`);
  border.className = `border-gray-lightest p-a-sm`;
  col2.appendChild(border);

  const earningsRow = document.createElement(`div`);
  earningsRow.className = `row m-b-sm`;
  border.appendChild(earningsRow);

  const earningsText = document.createElement(`div`);
  earningsText.className = `col-xs-7 col-sm-6 col-lg-7`;
  earningsRow.appendChild(earningsText);

  const earningsStrong = document.createElement(`strong`);
  earningsStrong.textContent = `Projected Earnings`;
  earningsText.appendChild(earningsStrong);

  const earningsValue = document.createElement(`div`);
  earningsValue.className = `col-xs-5 col-sm-6 col-lg-5 text-xs-right`;
  earningsValue.textContent = localStorage.todaysearnings || `$0.00`;
  earningsRow.appendChild(earningsValue);

  const bonusesRow = document.createElement(`div`);
  bonusesRow.className = `row m-b-sm`;
  border.appendChild(bonusesRow);

  const bonusesText = document.createElement(`div`);
  bonusesText.className = `col-xs-7 col-sm-6 col-lg-7`;
  bonusesRow.appendChild(bonusesText);

  const bonusesStrong = document.createElement(`strong`);
  bonusesStrong.textContent = `Bonuses`;
  bonusesText.appendChild(bonusesStrong);

  const bonusesValue = document.createElement(`div`);
  bonusesValue.className = `col-xs-5 col-sm-6 col-lg-5 text-xs-right`;
  bonusesValue.textContent = localStorage.todaysbonuses || `$0.00`;
  bonusesRow.appendChild(bonusesValue);

  const collapse = document.createElement(`div`);
  collapse.id = `TodaysActivityAdditionalInfo`;
  collapse.className = `collapse`;
  border.appendChild(collapse);

  const hr = document.createElement(`hr`);
  hr.className = `m-b-sm m-t-0`;
  collapse.appendChild(hr);

  const hr2 = document.createElement(`hr`);
  hr2.className = `m-b-sm m-t-0`;
  border.appendChild(hr2);

  const control = document.createElement(`a`);
  control.className = `collapse-more-less`;
  control.href = `#TodaysActivityAdditionalInfo`;
  control.setAttribute(`aria-controls`, `TodaysActivityAdditionalInfo`);
  control.setAttribute(`aria-expanded`, `false`);
  control.setAttribute(`data-toggle`, `collapse`);
  border.appendChild(control);

  const more = document.createElement(`span`);
  more.className = `more`;
  control.appendChild(more);

  const plus = document.createElement(`i`);
  plus.className = `fa fa-plus-circle`;
  more.appendChild(plus);

  const moreText = document.createTextNode(`\nMore\n`);
  more.appendChild(moreText);

  const less = document.createElement(`span`);
  less.className = `less`;
  control.appendChild(less);

  const minus = document.createElement(`i`);
  minus.className = `fa fa-minus-circle`;
  less.appendChild(minus);

  const lessText = document.createTextNode(`\nLess\n`);
  less.appendChild(lessText);

  const side = document.querySelector(`.col-md-push-8`);
  side.insertBefore(container, side.firstChild);

  bonusesValue.textContent = `$${latest.bonus_rewards.toLocaleString(`en-US`, { minimumFractionDigits: 2 })}`;

  let hitLog =
      date === localStorage.WMTD_date ? (localStorage.WMTD_hitLog ? JSON.parse(localStorage.WMTD_hitLog) : {}) : {};

  async function get(page, rescan) {
    try {
      page = Number.isInteger(page) ? page : 1;

      earningsValue.textContent = `Calculating Page ${page}`;

      const fetchURL = new URL(`https://worker.mturk.com/status_details/${date}`);
      fetchURL.searchParams.append(`page_number`, page);
      fetchURL.searchParams.append(`format`, `json`);

      const response = await fetch(fetchURL, {
        credentials: `include`,
      });

      if (response.status === 429) {
        return setTimeout(get, 2000, page, rescan);
      }

      const json = await response.json();

      for (const hit of json.results) {
        hitLog[hit.hit_id] = hit;
      }

      const logLength = Object.keys(hitLog).length;
      const expectedLength = Number(page) * 20 - 20 + json.num_results;

      if (!rescan && logLength !== expectedLength) {
        return get(1, true);
      } else {
        localStorage.WMTD_hitLog = JSON.stringify(hitLog);
      }

      localStorage.WMTD_lastPage = page;

      if (json.results.length === 20) {
        return get(++page, rescan);
      } else if (logLength !== json.total_num_results) {
        hitLog = {};
        return get(1, true);
      } else {
        let projectedEarnings = 0;
        const reqLog = {};

        for (const key in hitLog) {
          const hit = hitLog[key];

          if (hit.status !== `Rejected`) {
            projectedEarnings += hit.reward.amount_in_dollars;
          }
          if (!reqLog[hit.requester_id]) {
            reqLog[hit.requester_id] = {
              requester_id: hit.requester_id,
              requester_name: hit.requester_name,
              reward: hit.reward.amount_in_dollars,
              submitted: 1,
            };
          } else {
            reqLog[hit.requester_id].submitted += 1;
            reqLog[hit.requester_id].reward += hit.reward.amount_in_dollars;
          }
        }

        const sort = Object.keys(reqLog).sort((a, b) => reqLog[a].reward - reqLog[b].reward);

        const fragment = document.createDocumentFragment();

        for (let i = sort.length - 1; i > -1; i--) {
          const key = sort[i];
          const requester_name = reqLog[key].requester_name;
          const reward = `$${reqLog[key].reward.toLocaleString(`en-US`, { minimumFractionDigits: 2 })}`;
          const submitted = reqLog[key].submitted;

          const reqRow = document.createElement(`div`);
          reqRow.className = `row m-b-sm`;
          fragment.appendChild(reqRow);

          const requester = document.createElement(`div`);
          requester.className = `col-xs-6`;
          reqRow.appendChild(requester);

          const requesterStrong = document.createElement(`strong`);
          requesterStrong.textContent = requester_name;
          requester.appendChild(requesterStrong);

          const submitValue = document.createElement(`div`);
          submitValue.className = `col-xs-3 text-xs-right`;
          submitValue.textContent = submitted;
          reqRow.appendChild(submitValue);

          const rewardValue = document.createElement(`div`);
          rewardValue.className = `col-xs-3 text-xs-right`;
          rewardValue.textContent = reward;
          reqRow.appendChild(rewardValue);
        }

        collapse.appendChild(fragment);

        earningsValue.textContent = `$${projectedEarnings.toLocaleString(`en-US`, { minimumFractionDigits: 2 })}`;
      }
    } catch (error) {
      earningsValue.textContent = error;
    }
  }

  get(
    date === localStorage.WMTD_date ? (localStorage.WMTD_lastPage ? Number(localStorage.WMTD_lastPage) : 1) : 1,
    false,
  );
  localStorage.WMTD_date = date;
}

function openFirstWeek() {
  statusDetailsTable.querySelector(`.fa.expand-button.fa-plus-circle`).click();
}

function rejectionsBelow99() {
  const row = document.createElement(`div`);
  row.className = `row m-b-sm`;

  const col1 = document.createElement(`div`);
  col1.className = `col-xs-7`;
  row.appendChild(col1);

  const strong = document.createElement(`strong`);
  strong.textContent = `Rejections ≤ 99%`;
  col1.appendChild(strong);

  const col2 = document.createElement(`div`);
  col2.textContent = Math.round(
    (hitsOverview.rejected - 0.01 * (hitsOverview.approved + hitsOverview.rejected + hitsOverview.pending)) / -0.99,
  ).toLocaleString();
  col2.className = `col-xs-5 text-xs-right`;
  row.appendChild(col2);

  const additional = document
  .getElementById(`dashboard-hits-overview`)
  .getElementsByClassName(`border-gray-lightest`)[0];
  additional.appendChild(row);
}

function rejectionsBelow95() {
  const row = document.createElement(`div`);
  row.className = `row m-b-sm`;

  const col1 = document.createElement(`div`);
  col1.className = `col-xs-7`;
  row.appendChild(col1);

  const strong = document.createElement(`strong`);
  strong.textContent = `Rejections ≤ 95%`;
  col1.appendChild(strong);

  const col2 = document.createElement(`div`);
  col2.textContent = Math.round(
    (hitsOverview.rejected - 0.05 * (hitsOverview.approved + hitsOverview.rejected + hitsOverview.pending)) / -0.95,
  ).toLocaleString();
  col2.className = `col-xs-5 text-xs-right`;
  row.appendChild(col2);

  const additional = document
  .getElementById(`dashboard-hits-overview`)
  .getElementsByClassName(`border-gray-lightest`)[0];
  additional.appendChild(row);
}

allApprovedRate();
allRejectedRate();
fourDigitPercents();
hitStatusChanges();
latestActivity();
openFirstWeek();
rejectionsBelow99();
rejectionsBelow95();
