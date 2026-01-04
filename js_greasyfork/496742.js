// ==UserScript==
// @name:ja     5ch.net どんぐり大砲ログのスレタイ収集＆フィルタリング
// @name        5ch.net Donguri Cannon Log Analyzer
// @namespace   https://greasyfork.org/users/1310758
// @description Fetches and filters hit responses from donguri 5ch boards
// @match       *://donguri.5ch.net/cannonlogs
// @match       *://*.5ch.net/test/read.cgi/*/*
// @connect     5ch.net
// @license     MIT License
// @author      pachimonta
// @grant       GM_xmlhttpRequest
// @noframes
// @version     2025.05.03.001
// @downloadURL https://update.greasyfork.org/scripts/496742/5chnet%20Donguri%20Cannon%20Log%20Analyzer.user.js
// @updateURL https://update.greasyfork.org/scripts/496742/5chnet%20Donguri%20Cannon%20Log%20Analyzer.meta.js
// ==/UserScript==
(function() {
  'use strict';
  const toggleDisplayText = 'Toggle Table';
  const manual = String.raw`<h2 class="userscript-title">リンク</h2>
<div class="external-link">
  <p><a rel="noreferrer noopener" href="https://web.archive.org/web/20240711172430/https://nanjya.net/donguri/" target="_blank">5chどんぐりシステムの備忘録</a> どんぐりシステムに関する詳細。</p>
  <p><a rel="noreferrer noopener" href="https://donguridepot.stars.ne.jp/" target="_blank">どんぐりランキング置き場</a> 大砲ログの過去ログ検索やログ統計など。</p>
  <p><a rel="noreferrer noopener" href="https://kes.5ch.net/donguri/" target="_blank">どんぐり板</a> どんぐり</p>
</div>
<h2 class="userscript-title">UserScriptの説明</h2>
<div class="userscript-manual">
  <p class="userscript-manual-summary">どんぐり大砲を撃たれたレスのスレッドタイトルを取得し表示をします。スレッドタイトルをクリックすると撃たれたレスにジャンプします。各メタデータでフィルタリング、ソート可能にします。</p>
  <div class="userscript-manual-section">
    フィルターとソートについて。
    <p>テーブル下部の<label for="myfilter">入力欄</label>に<code>bbs=newsplus</code> のように入力すると該当するログだけを表示します。</p>
    <p>カンマ(<code>,</code>) で区切ることで複数の条件が指定できます。</p>
    <p>URLのハッシュ(<code>#</code>)より後に条件を指定することでも機能します。</p>
    <p>大砲ログの<b>各セルをダブルクリック</b>して、その内容の条件を追加できます（再度ダブルクリックで削除）。</p>
    <p><b>列ヘッダーをクリック</b>でソートします。</p>
  </div>
  <p>itest.5ch.net表示だとレスにジャンプするのに遅延が発生するため<strong>PC表示させるためのCookieを設定します。</strong>itest.5ch.net表示させたい場合は<a rel="noreferrer noopener" href="https://itest.5ch.net/" target="_blank">itest.5ch.netトップページ</a>の設定から「常にPC版で表示」をOFFに変えてください。</p>
  <p>右側の<b>${toggleDisplayText}</b> ボタンを押すと元のテーブルと切り替えます。</p>
</div>`;

  const DONGURI_LOG_CSS = String.raw`
    :root {
      --acorn-background: #f6f6f6;
      --acorn-color: #000;
      --acorn-header-background: #f5f7ff;
      --acorn-header-color: #000;
      --myfilter-placeholder-shown-background: #fff;
      --myfilter-background: #cff;
      --myfilter-color: #000;
      --acorn-tfoot-background: #eee;
      --acorn-tfoot-color: #000;
      --acorn-td-hover-background: #ccc;
      --acorn-td-active-background: #ff9;
      --acorn-td-a-visited: #808;
      --acorn-td-a-hover: #000;
      --acorn-th-background: #f5f7ff;
      --acorn-td-background: #fff;
      --acorn-a-color: #0d47a1;
      --acorn-td-border-left-color: #ccc;
      --acorn-td-likely-hit-background: #ffe4e1;
      --acorn-code-color: #d81b60;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --acorn-background: #000;
        --acorn-color: #eee;
        --acorn-header-background: #2b2b2b;
        --acorn-header-color: #fff;
        --myfilter-placeholder-shown-background: #000;
        --myfilter-background: #033;
        --myfilter-color: #fff;
        --acorn-tfoot-background: #222;
        --acorn-tfoot-color: #fff;
        --acorn-td-hover-background: #777;
        --acorn-td-active-background: #bb3;
        --acorn-td-a-visited: #c3c;
        --acorn-td-a-hover: #ccc;
        --acorn-th-background: #2b2b2b;
        --acorn-td-background: #000;
        --acorn-a-color: #ffb300;
        --acorn-td-border-left-color: #333;
        --acorn-td-likely-hit-background: #002b3e;
        --acorn-code-color: #f06292;
      }
    }
    body {
      margin: 0;
      padding: 8px;
      display: block;
      background: var(--acorn-background) !important;
      color: var(--acorn-color);
    }
    header {
      background: var(--acorn-header-background) !important;
      color: var(--acorn-header-color) !important;
    }
    a { color: var(--acorn-a-color); }
    table {
      border-collapse: separate;
      border-spacing: 0;
      white-space: nowrap;
      table-layout: fixed;
    }
    :is(thead, tbody) tr :is(th, td):nth-of-type(-n+9)  {
      width: auto;
    }
    :is(thead, tbody) tr :is(th, td):nth-last-of-type(-n+1) {
      width: 100%;
    }
    table {
      content-visibility: auto;
      contain-intrinsic-size: 40000px;
    }
    table, th, td {
      border: 1px solid var(--acorn-color);
      font-size: 15px;
    }
    thead {
      position: sticky;
      top: 0;
      z-index: 1;
    }
    tfoot {
      position: sticky;
      bottom: 0;
      z-index: 2;
      background: var(--acorn-tfoot-background);
      color: var(--acorn-tfoot-color);
    }
    tfoot p {
      margin: 0;
      padding: 0;
    }
    tr :is(th:first-of-type, td:first-of-type) {
      border-left-width: 0.33rem;
      border-left-color: var(--acorn-td-border-left-color);
    }
    th { background: var(--acorn-th-background) !important; }
    th:hover, td:not([colspan]):hover { background: var(--acorn-td-hover-background); }
    th:active, td:not([colspan]):active { background: var(--acorn-td-active-background); }
    tbody td { background: var(--acorn-td-background); }
    td.likely-hit { background: var(--acorn-td-likely-hit-background); }
    th {
      position: relative;
    }
    th.sortOrder1::after { content: "▲"; }
    th.sortOrder-1::after { content: "▼"; }
    th[class^=sortOrder]::after {
      font-size: 0.5rem;
      opacity: 0.5;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
    }
    td a:visited { color: var(--acorn-td-a-visited); }
    td a:hover { color: var(--acorn-td-a-hover); }
    th, td {
      border-top-width: 0;
      border-left-width: 0;
    }
    :is(th, td):last-child {
      border-right-width: 0;
    }
    tr:last-child td {
      border-bottom-width: 0;
    }
    label {
      display: inline-block;
      text-decoration: underline;
      cursor: pointer;
    }
    label:hover {
      text-decoration: none;
    }
    #myfilter {
      width: calc(100vw - 4rem);
      background: var(--myfilter-background);
      color: var(--myfilter-color);
    }
    #myfilter:placeholder-shown {
      background: var(--myfilter-placeholder-shown-background);
    }
    .userscript-title {
      font-size: .8rem;
      line-height: 1;
      margin: 0;
      padding: 0;
    }
    :is(.external-link, .userscript-manual) {
      font-size: .8rem;
      margin: .4rem 0 .4rem 0;
      & p, & div {
        padding: 0;
        margin: 0 0 0 1.5rem;
        display: list-item;
        list-style-type: disc;
        list-style-position: inside;
      }
    }
    code {
       color: var(--acorn-code-color);
    }
    .toggleDisplay {
      position: fixed;
      top: 40%;
      right: 30px;
      opacity: 0.8;
      background: var(--acorn-tfoot-background);
      font-size: .8rem;
      z-index: 2;
    }
    .toggleDisplay:hover {
      background: var(--acorn-td-hover-background);
      opacity: inherit;
    }
    .progress {
      cursor: progress;
    }
  `;

  const READ_CGI_CSS = String.raw`
    .dongurihit:target, .dongurihit:target * {
      background: #fff;
      color: #000;
    }
  `;

  // Helper functions
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));
  const addStyle = (css) => {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.append(style);
  };
  // Scroll and highlight the relevant post in read.cgi
  const readCgiJump = () => {
    addStyle(READ_CGI_CSS);
    const waitForTabToBecomeActive = () => {
      return new Promise((resolve) => {
        if (document.visibilityState === 'visible') {
          resolve();
        } else {
          const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
              document.removeEventListener('visibilitychange', handleVisibilityChange);
              resolve();
            }
          };
          document.addEventListener('visibilitychange', handleVisibilityChange);
        }
      });
    };
    const scrollActive = () => {
      const hashIsNumber = location.hash.match(/^#(\d+)$/) ? location.hash.substring(1) : null;
      const [dateymd, datehms] = (location.hash.match(/#date=([^&=]{10})([^&=]+)/) || [null, null, null]).slice(1);

      if (!hashIsNumber && !dateymd) {
        return;
      }

      $$('.date').some(dateElement => {
        const post = dateElement.closest('.post');
        if (!post) {
          return;
        }

        const isMatchingPost = post.id === hashIsNumber || (dateymd && dateElement.textContent.includes(dateymd) && dateElement.textContent.includes(datehms));
        if (!isMatchingPost) {
          return;
        }

        post.classList.add('dongurihit');
        if (post.id && location.hash !== `#${post.id}`) {
          history.replaceState(null, '', location.href.slice(0, -location.hash.length));
          location.hash = `#${post.id}`;
          history.replaceState(null, '', location.href);
          return;
        }

        const observer = new IntersectionObserver(entries => {
          waitForTabToBecomeActive().then(() => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                setTimeout(() => post.classList.remove('dongurihit'), 1500);
              }
            });
          });
        });
        observer.observe(post);
        return;
      });
    };

    if (!window.donguriInitialized) {
      window.addEventListener('hashchange', scrollActive);
      window.donguriInitialized = true;
    }
    const scrollToElementWhenActive = () => {
      waitForTabToBecomeActive().then(() => {
        scrollActive();
      });
    };
    scrollToElementWhenActive();
    return;
  };

  // Filter Acorn Cannon Logs
  const donguriFilter = () => {
    console.time(`${location.origin}${location.pathname}`);
    // $('html').toggleAttribute('hidden');
    document.cookie = '5chClassic=on; domain=.5ch.net; path=/; SameSite=Lax;';
    $('body').removeAttribute('style');
    $('header').removeAttribute('style');
    addStyle(DONGURI_LOG_CSS);

    // Storage for bbs list and post titles list
    const bbsOriginList = new Map();
    const bbsNameList = new Map();
    // post titles
    const subjectList = new Map();
    // Index list of tbody tr selectors for each BBS
    const donguriLogBbsRows = new Map();
    // Thread keys for each BBS in the table
    const donguriLogBbsKeys = new Map();

    const columnSelector = {};
    const columns = {
      "order": "順",
      "term": "期",
      "date": "date(投稿時刻)",
      "bbs": "bbs",
      "bbsname": "bbs名",
      "key": "スレッドkey",
      "id": "ハンターID",
      "hunter": "ハンター",
      "target": "ターゲット",
      "subject": "subject"
    };
    const columnKeys = Object.keys(columns);
    const columnValues = Object.values(columns);
    columnKeys.forEach((key, i) => {
      columnSelector[key] = `td:nth-of-type(${i + 1})`;
    });
    const originalTermSelector = 'td:nth-of-type(1)';
    const originalLogSelector = 'td:nth-of-type(2)';
    let completedRows = 0;

    let lastFilteringCriteria = {};

    const table = $('table');
    if (!table) {
      return;
    }
    const thead = $('thead', table);
    let tbody = $('tbody', table);
    $$('th', thead).forEach(header => {
      header.removeAttribute('style');
    });
    const originalTable = table.cloneNode(true);
    originalTable.className = 'originalLog';

    // Create a element to toggle the display between the original table and the UserScript-generated table
    const toggleDisplay = document.createElement('div');
    toggleDisplay.textContent = toggleDisplayText;
    toggleDisplay.className = 'toggleDisplay';

    // Switch between original and UserScript display depending on table state
    toggleDisplay.addEventListener('click', () => {
      if ($('table.originalLog') && $('table.originalLog').hasAttribute('hidden') === false) {
        $('table.originalLog').toggleAttribute('hidden', true);
        table.removeAttribute('hidden');
      } else {
        table.toggleAttribute('hidden', true);
        if (!$('table.originalLog')) {
          table.after(originalTable);
        }
        $('table.originalLog').removeAttribute('hidden');
      }
    });

    const addWeekdayToDatetime = (datetimeStr) => {
      const firstColonIndex = datetimeStr.indexOf(':');
      const splitIndex = firstColonIndex - 2;
      const datePart = datetimeStr.slice(0, splitIndex);
      const timePart = datetimeStr.slice(splitIndex);
      const [year, month, day] = datePart.split('/').map(Number);
      const date = new Date(year, month - 1, day);
      const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
      const weekday = weekdays[date.getDay()];
      return `${datePart}(${weekday}) ${timePart}`;
    };

    const appendThCell = (tr, txt) => {
      const e = tr.appendChild(document.createElement('th'));
      e.textContent = txt;
      return e;
    };
    const appendTdCell = (tr, txt = '') => {
      const e = tr.appendChild(document.createElement('td'));
      if (txt !== '') {
        e.textContent = txt;
      }
      return e;
    };
    if (!$('tr th:nth-of-type(1)', thead)) {
      return;
    }
    const colgroup = document.createElement('colgroup');
    colgroup.span = String(columnKeys.length);
    thead.before(colgroup);
    // 順,期,date(投稿時刻),bbs,bbs名,key,ハンターID,ハンター名,ターゲット,subject
    // order,term,date,bbs,bbsname,key,id,hunter,target,subject
    const tr = $('tr:nth-of-type(1)', thead);
    columnValues.slice(0, 2).forEach((txt, i) => {
      const th = $(`th:nth-of-type(${i + 1})`, tr);
      th.textContent = txt;
      th.setAttribute('scope', 'col');
      th.removeAttribute('style');
    });
    columnValues.slice(2).forEach(txt => appendThCell(tr, txt).setAttribute('scope', 'col'));

    table.insertAdjacentHTML('beforebegin', manual);
    const additionalManual = document.createElement('p');
    additionalManual.textContent = `各メタデータ名: ${JSON.stringify(columns).replace(/"/g,'').replace(/,/g,', ')}`;
    $('.userscript-manual-section:first-of-type').after(additionalManual);
    table.before(toggleDisplay);

    const sanitizeText = (content) => {
      return content.replace(/[\u0000-\u001F\u007F\u200E\u200F\u202A\u202B\u202C\u202D\u202E]/gu, match => `[U+${match.codePointAt(0).toString(16).toUpperCase()}]`);
    };

    // date format "2024/06/1110:37:32.24"
    const japanDate2UnixTimeStr = (jpdate) => {
      const lastDashIndex = jpdate.lastIndexOf('/');
      return Date.parse(jpdate.replace(new RegExp('/', 'g'), '-').slice(0, lastDashIndex + 3) + 'T' + jpdate.slice(lastDashIndex + 3) + '+09:00').toString().substring(0, 10);
    };

    const sanitize = (value) => value.replace(/[^a-zA-Z0-9_:/.\-]/g, '');

    let rows = $$('tr', tbody);
    // Number of 'tbody tr' selectors
    const rowCount = rows.length;
    const userLogRegex = /^(.*)?さん\[([a-f0-9]{8})\]は(.*(?:\[[a-f0-9]{4}\*\*\*\*\])?)?さんを(?:[撃打]っ|外し)た$/u;
    console.time('initialRows');
    const fragment = document.createDocumentFragment();
    const tbodyFragment = document.createElement('tbody');
    fragment.append(tbodyFragment);
    // Expand each cell in the tbody
    rows.forEach((row, i) => {
      const newRow = document.createElement('tr');
      newRow.innerHTML = '<td></td>'.repeat(2);
      const log = sanitizeText($(originalLogSelector, row).textContent.trim());
      const verticalPos = log.lastIndexOf('|');
      const [bbs, key, date] = log.slice(verticalPos + 2).split(' ', 3);
      if (!donguriLogBbsRows.has(bbs)) {
        donguriLogBbsRows.set(bbs, new Map());
      }
      if (!donguriLogBbsKeys.has(bbs)) {
        donguriLogBbsKeys.set(bbs, new Set());
      }
      donguriLogBbsRows.get(bbs).set(i, key);
      donguriLogBbsKeys.get(bbs).add(key);
      newRow.dataset.order = i + 1;
      newRow.dataset.term = sanitize($(originalTermSelector, row).textContent);
      newRow.dataset.date = date;
      newRow.dataset.bbs = bbs;
      newRow.dataset.key = key;
      newRow.dataset.log = log;
      [newRow.dataset.hunter, newRow.dataset.id, newRow.dataset.target] = log.slice(0, verticalPos - 1).match(userLogRegex).slice(1, 4);

      // columns
      $(columnSelector.term, newRow).textContent = $(originalTermSelector, row).textContent;
      $(columnSelector.order, newRow).textContent = newRow.dataset.order;
      appendTdCell(newRow, addWeekdayToDatetime(date));
      appendTdCell(newRow, bbs);
      appendTdCell(newRow);
      appendTdCell(newRow, key);
      appendTdCell(newRow, newRow.dataset.id);
      appendTdCell(newRow, newRow.dataset.hunter);
      appendTdCell(newRow, newRow.dataset.target);
      appendTdCell(newRow);
      if (japanDate2UnixTimeStr(date) === key) {
        $(columnSelector.subject, newRow).classList.add('likely-hit');
      }
      tbodyFragment.append(newRow);
    });
    table.replaceChild(fragment, tbody);
    console.timeEnd('initialRows');
    tbody = tbodyFragment;
    rows = $$('tr', tbody);
    const headers = $$('th', thead);

    let sortOrder = -1; // 1: Ascending order, -1: Descending order
    let lastIndex = null;
    const rsortKeys = ['term', 'date', 'key'];
    // Set click event for each column header
    thead.addEventListener('click', (event) => {
      const th = event.target.closest('th');
      if (!th || table.classList.contains('progress') || completedRows !== rowCount) {
        return;
      }
      table.classList.add('progress');
      if (lastIndex !== null) {
        headers[lastIndex].classList.remove(`sortOrder${sortOrder}`);
      }
      const index = headers.indexOf(th);
      // Reverse the sort order
      sortOrder *= -1;
      if (lastIndex !== index) {
        lastIndex = index;
        sortOrder = !rsortKeys.includes(columnKeys[index]) ? 1 : -1;
      }
      th.classList.add(`sortOrder${sortOrder}`);
      // Sort based on the index of the clicked column
      rows.sort((rowA, rowB) => {
        /*
        const cellA = rowA.cells[index].textContent;
        const cellB = rowB.cells[index].textContent;
        */
        const cellA = rowA.getAttribute(`data-${columnKeys[index]}`);
        const cellB = rowB.getAttribute(`data-${columnKeys[index]}`);

        // Natural order sort by text
        return cellA.localeCompare(cellB, 'ja', {
          numeric: true
        }) * sortOrder;
      });

      // Create a DocumentFragment
      const fragment = document.createDocumentFragment();
      // Add sorted rows to the DocumentFragment
      rows.forEach(row => fragment.append(row));
      // Append the DocumentFragment to tbody
      tbody.append(fragment);
      table.classList.remove('progress');
    });
    const isEqualMaps = (map1, map2) => {
      if (map1.size !== map2.size) {
        return false;
      }
      for (let [key, val] of map1) {
        if (!map2.has(key) || map2.get(key) !== val) {
          return false;
        }
      }
      return true;
    };
    const str2Regex = (str) => {
      try {
        const match = str.match(new RegExp('^/(.*)/([a-z]*)$'));
        if (match.length) {
          return new RegExp(match[1], match[2]);
        }
      } catch (e) {
        return false;
      }
      return false;
    };

    const noSanitizeKeys = ['log', 'bbsname', 'hunter', 'target', 'subject'];
    const equalValueKeys = ['term', 'bbs'];
    const includesValueKeys = ['log', 'bbsname', 'subject', 'date'];

    // Update elements visibility based on filtering criteria
    const filterRows = (val = '') => {
      let count = 0;
      const value = val.trim();

      if (value.length === 0) {
        rows.forEach(row => row.removeAttribute('hidden'));
        $('#myfilterResult').textContent = `${rowCount} 件 / ${rowCount} 件中`;
        lastFilteringCriteria = {};
        return;
      }

      const criteria = value.split(/\s*,\s*/).map(item => item.split('=')).reduce((acc, [key, val]) => {
        if (!columnKeys.includes(key) || !val) {
          return acc;
        }
        const regexResult = str2Regex(val);
        if (typeof(regexResult) === 'object') {
          acc.set(key, regexResult);
          return acc;
        }
        acc.set(key, noSanitizeKeys.includes(key) ? val : sanitize(val));
        return acc;
      }, new Map());

      if (isEqualMaps(lastFilteringCriteria, criteria)) {
        return;
      }
      lastFilteringCriteria = criteria;

      if (criteria.size === 0) {
        rows.forEach(row => row.removeAttribute('hidden'));
        $('#myfilterResult').textContent = `${rowCount} 件 / ${rowCount} 件中`;
        return;
      }

      rows.forEach(row => {
        const isVisible = Array.from(criteria.entries()).every(([key, val]) => {
          if (typeof(val) === 'object') {
            return val.test(row.getAttribute(`data-${key}`));
          } else if (equalValueKeys.includes(key)) {
            return row.getAttribute(`data-${key}`) === val;
          } else if (includesValueKeys.includes(key)) {
            return row.getAttribute(`data-${key}`).includes(val);
          } else {
            return row.getAttribute(`data-${key}`).indexOf(val) === 0;
          }
        });

        if (isVisible) {
          count++;
          row.removeAttribute('hidden');
        } else {
          row.toggleAttribute('hidden', true);
        }
      });

      $('#myfilterResult').textContent = `${count} 件 / ${rowCount} 件中`;
    };

    // Insert the data of each BBS thread list
    const insertCells = (bbs) => {
      completedRows += donguriLogBbsRows.get(bbs).size;
      for (let [index, key] of donguriLogBbsRows.get(bbs)) {
        const row = rows[index];
        if ('subject' in row.dataset && row.dataset.subject.length) {
          continue;
        }
        const {
          date,
          origin
        } = row.dataset;
        const subject = subjectList.get(bbs).get(key) || "???";
        row.dataset.subject = subject;
        const anchor = document.createElement('a');
        anchor.href = `${origin}/test/read.cgi/${bbs}/${key}/?v=pc#date=${date}`;
        anchor.setAttribute('rel', 'noreferrer noopener');
        anchor.target = `${bbs}_${key}`;
        anchor.textContent = subject;
        $(columnSelector.subject, row).append(anchor);
      }
      // After inserting all cells
      if (completedRows === rowCount) {
        filterRows($('#myfilter').value);
        console.timeEnd(`${location.origin}${location.pathname}`);
        // $('html').toggleAttribute('hidden');
      }
    };

    const insertCellsNotCount = (bbs) => {
      for (let [index, key] of donguriLogBbsRows.get(bbs)) {
        if (!subjectList.get(bbs).has(key)) {
          continue;
        }
        const row = rows[index];
        const {
          date,
          origin
        } = row.dataset;
        const subject = subjectList.get(bbs).get(key);
        row.dataset.subject = subject;
        const anchor = document.createElement('a');
        anchor.href = `${origin}/test/read.cgi/${bbs}/${key}/?v=pc#date=${date}`;
        anchor.setAttribute('rel', 'noreferrer noopener');
        anchor.target = `${bbs}_${key}`;
        anchor.textContent = subject;
        $(columnSelector.subject, row).append(anchor);
      }
    };

    const insertBbsnameCells = (bbs) => {
      for (let index of donguriLogBbsRows.get(bbs).keys()) {
        const row = rows[index];
        const origin = bbsOriginList.has(bbs) ? bbsOriginList.get(bbs) : "https://origin";
        const bbsName = bbsNameList.has(bbs) ? bbsNameList.get(bbs) : "???";
        row.dataset.origin = origin;
        row.dataset.bbsname = bbsName;
        $(columnSelector.bbsname, row).textContent = bbsName;
      }
    };

    // Initialize the filter input and its functionalities
    const tfootHtml = String.raw`
      <tfoot>
        <tr>
          <td colspan="${columnKeys.length}">
            <p id="myfilterResult"></p>
            <input
              type="text"
              size="40"
              id="myfilter"
              placeholder="Filter (e.g., bbs=av, key=1711038453, date=06/01(土) 01:55, id=ac351e30, subject=/\p{EPres}/v, log=abesoriさん[97a65812])"
            >
          </td>
        </tr>
      </tfoot>
    `;
    table.insertAdjacentHTML('beforeend', tfootHtml);
    const input = $('#myfilter');
    input.addEventListener('input', () => {
      if (input.value.length) {
        location.hash = `#${input.value}`;
      } else {
        // Prevent page navigation in the case of "#" only
        history.replaceState(null, '', location.pathname);
        filterRows();
      }
      return;
    });
    if (location.hash) {
      input.value = decodeURIComponent(location.hash.substring(1));
    }
    window.addEventListener('hashchange', () => {
      input.value = decodeURIComponent(location.hash.substring(1));
      console.time('filterRows');
      filterRows(input.value);
      console.timeEnd('filterRows');
    });

    const escapeRegExp = (string) => string.replace(/[.\/*+?^${}()|[\]\\]/g, '\\$&');

    tbody.addEventListener('dblclick', function(event) {
      event.preventDefault();
      const target = event.target;
      if (!$('#myfilter') || target.tagName !== 'TD') {
        return;
      }
      let targetTxt = target.textContent.trim();
      if (targetTxt.includes(',')) {
        targetTxt = `/^${escapeRegExp(targetTxt).replace(/,/g, '\\x2c')}$/`;
      } else if (str2Regex(targetTxt) !== false) {
        targetTxt = `/^${escapeRegExp(targetTxt)}$/`;
      }
      const index = Array.prototype.indexOf.call(target.parentNode.children, target);
      const txt = `${columnKeys[index]}=${targetTxt}`;
      const re = new RegExp(`(^|,)${escapeRegExp(txt)}(?:,|$)`);
      const input = $('#myfilter');
      if (re.test(input.value)) {
        const newHash = input.value.replace(re,"$1");
        location.hash = encodeURIComponent(newHash.endsWith(',') ? newHash.slice(0, -1) : newHash);
        if (!newHash.length) {
          history.replaceState(null, '', location.pathname);
        }
      } else if (input.value.length > 1 && input.value.endsWith(',') === false) {
        location.hash += `,${txt}`;
      } else {
        location.hash += txt;
      }
    });

    // GM_xmlhttpRequest wrapper to handle HTTP Get requests
    const xhrGetDat = (url, loadFunc, errorFunc, mime = 'text/plain; charset=shift_jis', type = 'text') => {
      console.time(url);
      GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        responseType: type,
        timeout: 3600 * 1000,
        overrideMimeType: mime,
        onload: response => loadFunc(response),
        onerror: response => errorFunc(response)
      });
    };

    const errorFunc = (response) => {
      console.timeEnd(response.finalUrl);
      console.error(response);
    };

    const ignoreErrorFunc = (response) => {
      console.timeEnd(response.finalUrl);
      console.error(response);
      const url = response.finalUrl;
      const pathname = new URL(url).pathname;
      const slashIndex = pathname.indexOf('/');
      const secondSlashIndex = pathname.indexOf('/', slashIndex + 1);
      const bbs = pathname.substring(slashIndex + 1, secondSlashIndex);
      if (!subjectList.has(bbs)) {
        subjectList.set(bbs, new Map());
      }
      insertCells(bbs);
    };

    const isSubsetOf = (superset, subset) => {
      return [...subset].every(value => superset.has(value));
    };

    const getDifferenceSet = (set1, set2) => {
      return new Set([...set1].filter(value => !set2.has(value)));
    };

    const parser = new DOMParser();

    // Process post titles line to update subjectList and modify the table-cells
    const addBbsPastInfo = (response) => {
      console.timeEnd(response.finalUrl);

      const url = response.finalUrl;
      const urlLength = url.length;
      const afterBbsPath = '/kako/';
      const afterBbsPathLength = afterBbsPath.length;
      const beforeBbsSlashIndex = url.lastIndexOf('/', urlLength - afterBbsPathLength - 1);
      const bbs = url.substring(beforeBbsSlashIndex + 1, urlLength - afterBbsPathLength);
      if (response.status !== 200) {
        console.error(response);
        insertCells(bbs);
        return;
      }
      const html = parser.parseFromString(response.responseText, 'text/html').documentElement;
      $$('[class="main_odd"],[class="main_even"]', html).forEach(p => {
        let [key, subject] = [$('.filename', p).textContent, $('.title', p).textContent];
        if (key.includes('.')) {
          key = key.substring(0, key.lastIndexOf('.'));
        }
        if (subjectList.get(bbs).has(key)) {
          return;
        }
        subjectList.get(bbs).set(key, subject);
      });
      if (!isSubsetOf(new Set(subjectList.get(bbs).keys()), donguriLogBbsKeys.get(bbs))) {
        console.info('Subject not found. {"bbs":"%s","key":"%s"}', bbs, Array.from(getDifferenceSet(donguriLogBbsKeys.get(bbs), new Set(subjectList.get(bbs).keys()))));
      }
      insertCells(bbs);
    };

    // Process post titles line to update subjectList and modify the table-cells
    const addBbsInfo = (response) => {
      console.timeEnd(response.finalUrl);

      const url = response.finalUrl;
      const urlLength = url.length;
      const afterBbsPath = '/lastmodify.txt';
      const afterBbsPathLength = afterBbsPath.length;
      const beforeBbsSlashIndex = url.lastIndexOf('/', urlLength - afterBbsPathLength - 1);
      const bbs = url.substring(beforeBbsSlashIndex + 1, urlLength - afterBbsPathLength);
      subjectList.set(bbs, new Map());
      if (response.status !== 200) {
        console.error(response);
        insertCells(bbs);
        return;
      }

      const lastmodify = response.responseText.trim();
      let lines = lastmodify.split(/[\r\n]+/);
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let [keyDat, subject] = line.split(/\s*<>\s*/, 2);
        let lastDotIndex = keyDat.lastIndexOf('.');
        if (lastDotIndex === -1) {
          continue;
        }
        let key = keyDat.substring(0, lastDotIndex);
        if (!donguriLogBbsKeys.get(bbs).has(key)) {
          continue;
        }
        if (/&#?[a-zA-Z0-9]+;?/.test(subject)) {
          subject = parser.parseFromString(subject, 'text/html').documentElement.textContent;
        }
        subjectList.get(bbs).set(key, subject);
      }
      // All subjects corresponding to the keys in the cell were confirmed
      if (isSubsetOf(new Set(subjectList.get(bbs).keys()), donguriLogBbsKeys.get(bbs))) {
        insertCells(bbs);
      } else {
        insertCellsNotCount(bbs);
        // Check past log
        xhrGetDat(new URL("./kako/", url), addBbsPastInfo, ignoreErrorFunc, 'text/plain; charset=utf-8');
      }
    };

    // Function to process post titles by XHRing lastmodify.txt from the BBS list in the donguri log table
    const xhrBbsInfoFromDonguriRows = () => {
      for (let bbs of donguriLogBbsRows.keys()) {
        const url = `${bbsOriginList.get(bbs)}/${bbs}/lastmodify.txt`;
        xhrGetDat(url, addBbsInfo, ignoreErrorFunc);
      }
    };

    // Function to process the bbsmenu response
    const bbsmenuFunc = (response) => {
      console.timeEnd(response.finalUrl);
      if (response.status !== 200) {
        console.error('Failed to fetch bbsmenu. Status code:', response.status);
        return;
      }
      const domainIndex = '.5ch.net/';
      const domainIndexLength = domainIndex.length;
      let bbsCount = 0;
      outerBlock: for (const menu_list of response.response.menu_list) {
        for (const category_content of menu_list.category_content) {
          const bbs = category_content.directory_name;
          if (!donguriLogBbsRows.has(bbs) || bbsOriginList.has(bbs)) {
            continue;
          }
          const bbsUrl = category_content.url;
          const index = bbsUrl.indexOf(domainIndex);
          if (index === -1) {
            continue;
          }
          const origin = bbsUrl.substring(0, index + domainIndexLength - 1);
          bbsOriginList.set(bbs, origin);
          bbsNameList.set(bbs, category_content.board_name);
          insertBbsnameCells(bbs);
          if (donguriLogBbsKeys.size === ++bbsCount) {
            break outerBlock;
          }
        }
      }
      if (bbsOriginList.size === 0) {
        console.error('No boards found.');
        return;
      }
      xhrBbsInfoFromDonguriRows();
    };
    // Initial data fetch from bbsmenu
    xhrGetDat('https://menu.5ch.net/bbsmenu.json', bbsmenuFunc, errorFunc, 'application/json; charset=utf-8', 'json');
  };

  const processMap = {
    donguriLog: {
      regex: new RegExp(String.raw`^https?://donguri\.5ch\.net/cannonlogs$`),
      handler: donguriFilter
    },
    readCgi: {
      regex: new RegExp(String.raw`^https?://[a-z0-9]+\.5ch\.net/test/read\.cgi/\w+/\d+.*$`),
      handler: readCgiJump
    }
  };
  const processBasedOnUrl = (url) => {
    for (const key in processMap) {
      if (processMap[key].regex.test(url)) {
        processMap[key].handler();
        break;
      }
    }
  };
  processBasedOnUrl(`${location.origin}${location.pathname}`);
})();