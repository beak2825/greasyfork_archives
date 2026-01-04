// ==UserScript==
// @name         AtCoderPenaltyRateCheckEaser
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  提出フォームの上にペナルティ率を表示して、提出前に確認しやすくします
// @author       Masaoki Seta
// @match        https://atcoder.jp/contests/*/tasks/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459897/AtCoderPenaltyRateCheckEaser.user.js
// @updateURL https://update.greasyfork.org/scripts/459897/AtCoderPenaltyRateCheckEaser.meta.js
// ==/UserScript==

function getStandingsData(contestName) {
  const REQUEST_URL = `https://atcoder.jp/contests/${contestName}/standings/json`;
  return $.ajax({
    type: 'GET',
    url: REQUEST_URL,
    dataType: 'json',
  })
  .fail(() => console.error(`AtCoderPenaltyRateCheckEaser: Could not get data in function, getStandingsData. Request URL : ${REQUEST_URL}`));
}

$(() => {
  'use strict';

  if (!'contestScreenName' in window) {
    console.error('AtCoderPenaltyRateCheckEaser: Could not get contestScreenName.');
    return;
  }

  function gotPenalty(preblemData) {
    if (preblemData.Penalty > 0) return true;
    if (preblemData.Failure > 0 && preblemData.Status !== 1) return true;
    return false;
  }

  function gotCorrect(preblemData) {
    return preblemData.Status === 1;
  }

   const PROBLEM_NAME = location.href.split('/').pop();

   getStandingsData(contestScreenName).done((res) => {
      const standingsData = res.StandingsData;
      let totalCount = 0, penaltyCount = 0, acCount = 0;
      standingsData.forEach((userData) => {
        const problemData = userData.TaskResults[PROBLEM_NAME];
        if (problemData == null) return;
        totalCount++;
        if (gotPenalty(problemData)) penaltyCount++;
        if (gotCorrect(problemData)) acCount++;
      });
      const panaltyRate = penaltyCount * 100/totalCount;
      const panaltyRateStr = totalCount > 0 ? (panaltyRate).toFixed(2) + '%' : 'No Submit';
      const makeRateStyle = ((rate) => {
        let style = '';
        if (rate >= 33.3) style = 'background: red;';
        else if (rate >= 20.0) style = 'background: yellow;';
        return style;
      });
      const panaltyRateStyle = makeRateStyle(panaltyRate);

      const acRate = acCount * 100 / totalCount;
      // const acRateStr = totalCount > 0 ? (acRate).toFixed(2) + '%' : 'No Submit';
      // const acRateStyle = makeRateStyle(acCount);

      $('.form-horizontal.form-code-submit').prepend(`
<div>
<table id="acsa-table" class="table table-bordered table-hover th-center td-center td-middle">
  <thead>
    <th style="width: 34%">ノーペナ者数/提出者数</th>
    <th style="width: 33%">ペナルティ率</th>
    <th style="width: 33%">正解者数/提出者数</th>
  </thead>
  <tbody>
    <td>${ totalCount - penaltyCount }/${ totalCount }</td>
    <td style="${ panaltyRateStyle }">${ panaltyRateStr }</td>
    <td>${ acCount }/${ totalCount }</td>
  </tbody>
</table>
</div>
      `);
    });
});