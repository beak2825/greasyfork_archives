// ==UserScript==
// @name         AtCoder Submission Status
// @name:en      AtCoder Submission Status
// @namespace    https://github.com/9sako6/atcoder-userscripts
// @version      1.3
// @description  AtCoderで提出した解答がいくつのテストケースでACか, WAか...が一目でわかるように表示する
// @description:en This script shows submission's statuses clearly!
// @author       9sako6
// @match        https://atcoder.jp/contests/*/submissions/*
// @exclude      https://atcoder.jp/contests/*/submissions/me
// @license     MIT
// @supportURL   https://github.com/9sako6/atcoder-userscripts/issues
// @downloadURL https://update.greasyfork.org/scripts/383817/AtCoder%20Submission%20Status.user.js
// @updateURL https://update.greasyfork.org/scripts/383817/AtCoder%20Submission%20Status.meta.js
// ==/UserScript==

function main() {
  /**
  * count each status
  */
  const statusPanel = document.getElementsByClassName('panel-default')[2];
  const testCaseElems = statusPanel.querySelector('tbody').querySelectorAll('tr');
  const statusCounter = {};

  testCaseElems.forEach((elem) => {
    const statusCodeColumnNum = 1;
    const statusCode = elem.querySelectorAll('td')[statusCodeColumnNum].querySelector('span').textContent;

    statusCounter[statusCode] ? statusCounter[statusCode]++ : statusCounter[statusCode] = 1;
  });

  const statusCodes = Object.keys(statusCounter).sort();

  /**
   * Making result table.
   *   Don't use `<table></table>` to avoid conflict 'AtCoder TestCase Extension'.
   */
  const testCasesCount = testCaseElems.length;
  const rowWidthPercent = 100 / statusCodes.length;

  const resultTable = `
    <div id="added-result-panel" class="panel panel-default">
      <div class="table table-bordered table-striped th-center">
        <div style="width: 100%; display: flex;">
        ${statusCodes.map((status, index) => `<div style="width: ${rowWidthPercent}%; text-align: center; border: 0.1px solid #ddd; border-top: 0; border-bottom: 0; border-right: 0; ${index == 0 ? "border-left: 0;" : ""}">
              <div style="line-height: 2em; border: 0.1px solid #ddd; border-top: 0; border-right: 0; border-left: 0; border-bottom: 1;">
                <span class="label label-${status === 'AC' ? 'success' : 'warning'}" aria-hidden="true" data-toggle="tooltip" data-placement="top" style="text-align: center; line-height: 2em;">${status}</span>
              </div>
            <div style="line-height: 1.8em;">${statusCounter[status]}/${testCasesCount}</div>
          </div>`).join('')}
        </div>
      </div>
    </div>`;

  statusPanel.insertAdjacentHTML("beforebegin", resultTable);
}

(function () {
  try {
    main();
  } catch (_error) {
    // noop
  }
})();
