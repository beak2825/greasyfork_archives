// ==UserScript==
// @name        Batch Balance
// @namespace   https://github.com/tobytorn
// @description Distribute money or change balances for multiple faction members (Not supported on mobile)
// @author      tobytorn [1617955]
// @match       https://www.torn.com/factions.php?step=your*
// @version     2.0.2
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @supportURL  https://github.com/tobytorn/batch-balance
// @license     MIT
// @require     https://unpkg.com/jquery@3.7.0/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/536376/Batch%20Balance.user.js
// @updateURL https://update.greasyfork.org/scripts/536376/Batch%20Balance.meta.js
// ==/UserScript==

// Usage:
// Add the following parameters to the URL of the control page (https://www.torn.com/factions.php?step=your#/tab=controls) to enable this script
// batbal_uids    Comma-separated user IDs
// batbal_amounts Comma-separated amounts
// batbal_action  [Optional] "add" for adding to balance (default), or "give" for giving money
// batbal_asset   [Optional] "money" (default) or "points"
//
// Example: The following URL will add 120 to Leslie, subtract 250 from tobytorn, and add 1.5k to Duke
//   https://www.torn.com/factions.php?step=your#/tab=controls&batbal_uids=15,1617955,4&batbal_amounts=120,-250,1500

'use strict';

function batchBalanceWrapper() {
  console.log('Batch Balance starts');

  const ACTION_INTERVAL_MS = 1000;
  const GM_VALUE_KEY = 'batbal-action';
  const PROFILE_HREF_PREFIX = 'profiles.php?XID=';
  const ACTION_SPECS = {
    give: {
      summary: 'Give',
      text: 'Give',
      waitingText: 'Giving',
      bodyParam: 'giveMoney',
    },
    add: {
      summary: 'Add to balance',
      text: 'Add',
      waitingText: 'Adding',
      bodyParam: 'addToBalance',
    },
  };

  const $ = window.jQuery;

  const LOCAL_STORAGE_PREFIX = 'BATCH_BALANCE_';

  function getLocalStorage(key, defaultValue) {
    const value = window.localStorage.getItem(LOCAL_STORAGE_PREFIX + key);
    try {
      return JSON.parse(value) ?? defaultValue;
    } catch (err) {
      return defaultValue;
    }
  }

  function setLocalStorage(key, value) {
    window.localStorage.setItem(LOCAL_STORAGE_PREFIX + key, JSON.stringify(value));
  }

  const isPda = window.GM_info?.scriptHandler?.toLowerCase().includes('tornpda');
  const [getValue, setValue] =
    isPda || typeof window.GM_getValue !== 'function' || typeof window.GM_setValue !== 'function'
      ? [getLocalStorage, setLocalStorage]
      : [window.GM_getValue, window.GM_setValue];

  const STYLE = `
    .batbal-overlay {
      position: relative;
    }
    .batbal-overlay:after {
      content: '';
      position: absolute;
      background: repeating-linear-gradient(135deg, #2228, #2228 70px, #0008 70px, #0008 80px);
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 900000;
    }
    #batbal-ctrl {
      margin: 10px 0;
      padding: 10px;
      border-radius: 5px;
      background-color: var(--default-bg-panel-color);
      text-align: center;
      line-height: 16px;
    }
    #batbal-ctrl-detail > :not(:first-child),
    #batbal-ctrl > :not(:first-child) {
      margin-top: 10px;
    }
    #batbal-ctrl-title {
      font-size: large;
      font-weight: bold;
    }
    #batbal-ctrl-status {
      font-weight: bold;
    }
    #batbal-ctrl button {
      margin: 0 4px;
    }
    #batbal-ctrl table {
      margin: 0 auto;
    }
    #batbal-ctrl th {
      font-weight: bold;
    }
    #batbal-ctrl th,
    #batbal-ctrl td {
      color: inherit;
      padding: 5px;
      border: 1px solid #ccc;
    }
    #batbal-ctrl td:last-child {
      text-align: right;
    }
    #batbal-ctrl-detail tr.batbal-done:after {
      content: '\u2713';
      color: green;
      padding-left: 6px;
    }
  `;

  const CONTROLLER_HTML = `
    <div id="batbal-ctrl">
      <div id="batbal-ctrl-title">Batch Balance</div>
      <div>
        <table>
          <thead>
            <tr>
              <th colspan="2">Summary</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Action</th>
              <td id="batbal-ctrl-summary-action-type">-</td>
            </tr>
            <tr>
              <th>Asset Type</th>
              <td id="batbal-ctrl-summary-asset-type">-</td>
            </tr>
            <tr>
              <th>Player Count</th>
              <td id="batbal-ctrl-summary-player-count">-</td>
            </tr>
            <tr>
              <th>Player Not in Faction</th>
              <td><span id="batbal-ctrl-summary-player-not-in-faction">-</span></td>
            </tr>
            <tr>
              <th>Total Amount</th>
              <td><span id="batbal-ctrl-summary-total-amount">-</span></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <button id="batbal-ctrl-start" class="torn-btn" disabled>Start</button>
        <button id="batbal-ctrl-show-detail" class="torn-btn">Show details</button>
        <button id="batbal-ctrl-hide-detail" class="torn-btn" style="display: none">Hide details</button>
        <button id="batbal-ctrl-clear-data" class="torn-btn" disabled>Clear data</button>
      </div>
      <button id="batbal-ctrl-submit" class="torn-btn" style="display: none" disabled></button>
      <div>Status: <span id="batbal-ctrl-status"></span></div>
      <div id="batbal-ctrl-detail" style="display: none">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Amount</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>`;

  function formatAmount(v) {
    return (v >= 0 ? '+' : '') + v.toString().replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => s + ',');
  }

  async function sleep(t) {
    await new Promise((r) => setTimeout(r, t));
  }

  // Copied from https://stackoverflow.com/a/25490531
  function getCookie(name) {
    return document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || '';
  }

  function getParams() {
    const params = new URLSearchParams(location.hash.slice(1));
    return params.get('/tab') === 'controls' ? params : null;
  }

  function storeAction(action) {
    setValue(GM_VALUE_KEY, action);
  }

  function parseAction() {
    const params = getParams();
    if (!params) {
      return null;
    }
    const paramUids = params.get('batbal_uids');
    const paramAmounts = params.get('batbal_amounts');
    if (paramUids === null || paramAmounts === null) {
      return null;
    }
    const uids = paramUids.split(',');
    const amounts = paramAmounts.split(',');
    if (amounts.length !== uids.length) {
      return { error: 'Param "batbal_uids" and "batbal_amounts" have different lengths' };
    }
    if (uids.length === 0 || uids.some((x) => !x.match(/^\d+$/))) {
      return { error: 'Param "batbal_uids" is invalid' };
    }
    if (amounts.length === 0 || amounts.some((x) => !x.match(/^[+-]?\d{1,11}$/))) {
      return { error: 'Param "batbal_amounts" is invalid' };
    }
    const actionType = params.get('batbal_action') ?? 'add';
    if (!['give', 'add'].includes(actionType)) {
      return { error: 'Param "batbal_action" is invalid' };
    }
    const assetType = params.get('batbal_asset') ?? 'money';
    if (!['money', 'points'].includes(assetType)) {
      return { error: 'Param "batbal_asset" is invalid' };
    }
    return {
      uidAmounts: uids.map((uid, i) => [uid, parseInt(amounts[i])]).filter(([, amount]) => amount !== 0),
      next: 0,
      actionType,
      assetType,
    };
  }

  function checkAction(parsedAction, storedAction) {
    if (parsedAction && storedAction) {
      if (
        JSON.stringify(parsedAction.uidAmounts) !== JSON.stringify(storedAction.uidAmounts) ||
        parsedAction.actionType !== storedAction.actionType ||
        parsedAction.assetType !== storedAction.assetType
      ) {
        throw new Error(
          "An unfinished Batch Balance operation was found that doesn't match the URL parameters. " +
            'Click "Show details" to view the pending operation. ' +
            'To resume it, clear the URL parameters and refresh the page.' +
            'To discard it, click "Clear data" and refresh the page.',
        );
      }
    }
    return storedAction ?? parsedAction;
  }

  /** @returns Promise<Record<string, { name: string, isInFaction: boolean }>> */
  async function getUidMap() {
    return new Promise((resolve) => {
      const interval = setInterval(function () {
        const $depositors = $('.money___aACfM .userListWrap___voEX8 .userInfoWrap___rjWOK');
        if ($depositors.length === 0) {
          return;
        }
        const map = {};
        $depositors.each(function () {
          const $name = $(this).find(`a[href*="${PROFILE_HREF_PREFIX}"]`).first();
          if ($name.length > 0) {
            const uid = ($name.attr('href') || '').split(PROFILE_HREF_PREFIX)[1];
            map[uid] = {
              name: $name.text().trim(),
              isInFaction: !$(this).hasClass('inactive___Hd0EQ'),
            };
          }
        });
        clearInterval(interval);
        resolve(map);
      }, 200);
    });
  }

  function renderController() {
    GM_addStyle(STYLE);
    const $controlsWrap = $('.faction-controls-wrap');
    $controlsWrap.addClass('batbal-overlay');
    $controlsWrap.before(CONTROLLER_HTML);
    $('#batbal-ctrl-show-detail').on('click', function () {
      $('#batbal-ctrl-detail').show();
      $('#batbal-ctrl-hide-detail').show();
      $(this).hide();
    });
    $('#batbal-ctrl-hide-detail').on('click', function () {
      $('#batbal-ctrl-detail').hide();
      $('#batbal-ctrl-show-detail').show();
      $(this).hide();
    });
    $('#batbal-ctrl-clear-data').on('click', function () {
      if (
        confirm(
          'Are you sure you want to delete the saved Batch Balance data? ' +
            'This will remove any unfinished operations and cannot be undone.',
        )
      ) {
        storeAction(null);
        $('#batbal-ctrl').hide();
        alert('Saved data has been deleted, please refresh the page');
      }
    });
  }

  function updateStatus(s) {
    $('#batbal-ctrl-status').text(String(s));
    if (s instanceof Error) {
      $('#batbal-ctrl-status').css('color', 'red');
    }
  }

  function renderDetails(action, uidMap) {
    const $tbody = $('#batbal-ctrl-detail tbody');
    $tbody.empty();
    let outsideCount = 0;
    action.uidAmounts.forEach(([uid, amount], i) => {
      const amountClass = amount >= 0 ? 't-green' : 't-red';
      const trClass = i < action.next ? 'batbal-done' : '';
      const uidInfo = uidMap[uid] || {};
      const name = uidInfo.name || '';
      const isInFaction = uidInfo.isInFaction || false;
      if (!isInFaction) {
        outsideCount++;
      }
      $tbody.append(`<tr class="${trClass}">
      <td>${uid}</td>
      <td>${name}</td>
      <td><span class="${amountClass}">${formatAmount(amount)}</span></td>
      <td><span class="${!isInFaction ? 't-red' : ''}">${!isInFaction ? 'Not in faction' : ''}</span></td>
    </tr>`);
    });
    const total = action.uidAmounts.reduce((v, [, amount]) => v + amount, 0);
    const totalClass = total >= 0 ? 't-green' : 't-red';
    const actionSpec = ACTION_SPECS[action.actionType];
    $('#batbal-ctrl-summary-action-type').text(actionSpec.summary);
    $('#batbal-ctrl-summary-asset-type').text(action.assetType);
    $('#batbal-ctrl-summary-player-count').text(action.uidAmounts.length);
    $('#batbal-ctrl-summary-player-not-in-faction')
      .text(outsideCount)
      .toggleClass('t-red', outsideCount > 0);
    $('#batbal-ctrl-summary-total-amount').text(formatAmount(total)).addClass(totalClass);
    updateStatus(`Progress: ${action.next} / ${action.uidAmounts.length} done`);
  }

  async function addMoney({ uid, name, amount, actionType, assetType }) {
    const $submit = $('#batbal-ctrl-submit');
    $submit.show();
    const actionSpec = ACTION_SPECS[actionType];
    const textSuffix = ` ${assetType}: ${name} [${uid}] ${formatAmount(amount)}`;
    const queryParam = {
      money: 'factionsGiveMoney',
      points: 'factionsGivePoints',
    }[assetType];
    $submit.text(`${actionSpec.text} ${textSuffix}`);
    $submit.prop('disabled', false);
    return new Promise((resolve, reject) => {
      $submit.on('click', async () => {
        try {
          $submit.off('click');
          $submit.text(`${actionSpec.waitingText} ${textSuffix}`);
          $submit.prop('disabled', true);
          const rfcv = getCookie('rfc_v');
          const rsp = await fetch(`/page.php?sid=${queryParam}&rfcv=${rfcv}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-requested-with': 'XMLHttpRequest',
            },
            body: JSON.stringify({
              option: actionSpec.bodyParam,
              receiver: parseInt(uid),
              amount,
            }),
          });
          const rawData = await rsp.text();
          if (!rsp.ok) {
            throw new Error(`Network error: ${rsp.status} ${rawData}`);
          }
          const data = JSON.parse(rawData);
          if (data.success === true) {
            resolve();
          } else {
            reject(new Error(`Unexpected server response: ${rawData}`));
          }
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  async function start(action, uidMap) {
    storeAction(action);
    $('#batbal-ctrl-start').prop('disabled', true);
    $('#batbal-ctrl-clear-data').prop('disabled', true);

    try {
      while (action.next < action.uidAmounts.length) {
        updateStatus(`Current progress: ${action.next} / ${action.uidAmounts.length} done`);
        const now = Date.now();
        const [uid, amount] = action.uidAmounts[action.next];
        const uidInfo = uidMap[uid] || {};
        const name = uidInfo.name || 'Unknown player';
        await addMoney({ uid, name, amount, actionType: action.actionType, assetType: action.assetType });
        action.next++;
        storeAction(action);
        renderDetails(action, uidMap);
        const elapsed = Date.now() - now;
        if (elapsed < ACTION_INTERVAL_MS) {
          await sleep(ACTION_INTERVAL_MS - elapsed);
        }
      }
      storeAction(null);
      updateStatus('All done!');
    } catch (err) {
      updateStatus(err);
    }
  }

  async function main() {
    try {
      const parsedAction = parseAction();
      const storedAction = getValue(GM_VALUE_KEY, null);
      if (storedAction === null && parsedAction === null) {
        return;
      }

      const uidMap = await getUidMap();
      renderController();
      if (storedAction) {
        renderDetails(storedAction, uidMap);
        $('#batbal-ctrl-clear-data').prop('disabled', false);
      }
      if (parsedAction.error) {
        throw new Error(parsedAction.error);
      }

      const action = checkAction(parsedAction, storedAction);
      if (!storedAction) {
        renderDetails(action, uidMap);
      }
      if (action.actionType === 'give') {
        if (action.uidAmounts.some(([uid]) => !uidMap[uid]?.isInFaction)) {
          throw new Error('Some players are not in the faction');
        }
        if (action.uidAmounts.some(([, amount]) => amount <= 0)) {
          throw new Error('Amounts to give must be positive');
        }
      }

      $('#batbal-ctrl-start').prop('disabled', false);
      $('#batbal-ctrl-start').on('click', () => start(action, uidMap));
    } catch (err) {
      updateStatus(err);
      console.log('Unhandled exception from Batch Balance:', err);
    }
  }

  main();
  console.log('Batch Balance ends');
}

if (document.readyState === 'loading') {
  document.addEventListener('readystatechange', () => {
    if (document.readyState === 'interactive') {
      batchBalanceWrapper();
    }
  });
} else {
  batchBalanceWrapper();
}
