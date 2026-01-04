// ==UserScript==
// @name         AtCoderStandingsAnalysis
// @namespace    https://github.com/RTnF/AtCoderStandingsAnalysis
// @version      0.2.1
// @description  順位表のjsonを集計し、上部にテーブルを追加します。
// @author       RTnF
// @match        https://atcoder.jp/*standings*
// @exclude      https://atcoder.jp/*standings/json
// @grant        none
// @license      CC0-1.0
// @downloadURL https://update.greasyfork.org/scripts/398439/AtCoderStandingsAnalysis.user.js
// @updateURL https://update.greasyfork.org/scripts/398439/AtCoderStandingsAnalysis.meta.js
// ==/UserScript==

// ソート済み配列のうちval未満が何個あるか求める
function countLower(arr, val) {
  var lo = -1;
  var hi = arr.length;
  while (hi - lo > 1) {
    var mid = Math.floor((hi + lo) / 2);
    if (arr[mid] < val) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return hi;
}

// 換算: Rating -> innerRating
function innerRating(rate, comp) {
  var ret = rate;
  if (rate <= 0) {
    throw "rate <= 0";
  }
  if (ret < 400) {
    ret = 400 * (1 - Math.log(400 / rate));
  }
  ret += 1200 * (Math.sqrt(1 - Math.pow(0.81, comp)) / (1 - Math.pow(0.9, comp)) - 1) / (Math.sqrt(19) - 1);
  return ret;
}

$(function () {
  'use strict';

  const cols = ["#808080", "#804000", "#008000", "#00C0C0", "#0000FF", "#C0C000", "#FF8000", "#FF0000"];
  const threshold = [-10000, 400, 800, 1200, 1600, 2000, 2400, 2800];
  const canvasWidth = 250;
  const canvasHeight = 25;

  // 表を先頭に追加
  $('#vue-standings').prepend(`
<div>
  <table id="acsa-table" class="table table-bordered table-hover th-center td-center td-middle">
    <thead>
    </thead>
    <tbody>
    </tbody>
  </table>
</div>
  `);

  // 表の更新
  vueStandings.$watch('standings', function (newVal, oldVal) {
    if (!newVal) {
      return;
    }
    var data;
    var task = newVal.TaskInfo;
    if (vueStandings.filtered) {
      data = vueStandings.filteredStandings;
    } else {
      data = newVal.StandingsData;
    }

    $('#acsa-table > tbody').empty();
    $('#acsa-table > tbody').append(`
<tr style="font-weight: bold;">
  <td>問題</td>
  <td>得点</td>
  <td>人数</td>
  <td>正解率</td>
  <td>平均ペナ</td>
  <td>ペナ率</td>
  <td>内部レート</td>
</tr>
    `);
    for (let i = 0; i < task.length; i++) {
      var isTried = vueStandings.tries[i] > 0;
      $('#acsa-table > tbody').append(`
<tr>
  <td style="padding: 4px;">` + task[i].Assignment + `</td>
  <td style="padding: 4px;">-</td>
  <td style="padding: 4px;">` + vueStandings.ac[i] + ` / ` + vueStandings.tries[i] + `</td>
  <td style="padding: 4px;">` + (isTried ? (vueStandings.ac[i] / vueStandings.tries[i] * 100).toFixed(2) + "%" : "-") + `</td>
  <td style="padding: 4px;">-</td>
  <td style="padding: 4px;">-</td>
  <td style="padding: 4px; width: ` + canvasWidth + `px;"><canvas style="vertical-align: middle;" width="` + canvasWidth + `px" height="` + canvasHeight +`px"></canvas></td>
</tr>
      `);
      if (!isTried) {
        continue;
      }

      // トップの得点を満点とみなす
      var maxScore = -1;
      var myScore = -1;
      // 不正解数 / 提出者数
      var avePenalty = 0;
      // ペナルティ >= 1 の人数 / 提出者数
      var ratioPenalty = 0;
      var rates = [];
      for (let j = 0; j < data.length; j++) {
        // 参加登録していない
        if (!data[j].TaskResults) {
          continue;
        }
        // アカウント削除
        if (data[j].UserIsDeleted) {
          continue;
        }
        var result = data[j].TaskResults[task[i].TaskScreenName];
        // 未提出のときresult === undefined
        if (result) {
          if (data[j].UserScreenName === vueStandings.userScreenName) {
            myScore = result.Score;
          }
          // 赤い括弧内の数字
          var penalty = result.Score === 0 ? result.Failure : result.Penalty;
          avePenalty += penalty;
          if (penalty > 0) {
            ratioPenalty++;
          }
          if (maxScore < result.Score) {
            maxScore = result.Score;
          }
        }
      }
      // 正解者の内部レート配列を作成する
      // 初出場はカウントしない
      if (maxScore > 0) {
        for (let j = 0; j < data.length; j++) {
          if (data[j].Competitions > 0
          &&  data[j].TaskResults[task[i].TaskScreenName]
          &&  data[j].TaskResults[task[i].TaskScreenName].Score === maxScore) {
            rates.push(innerRating(Math.max(data[j].Rating, 1), data[j].Competitions));
          }
        }
        rates.sort(function (a, b) { return a - b; });
      }

      myScore /= 100;
      maxScore /= 100;
      avePenalty /= vueStandings.tries[i];
      ratioPenalty /= vueStandings.tries[i];
      ratioPenalty *= 100;

      $('#acsa-table > tbody > tr:eq(' + (i+1) + ') > td:eq(1)').text(myScore >= 0 ? myScore.toFixed() : "-");
      $('#acsa-table > tbody > tr:eq(' + (i+1) + ') > td:eq(4)').text(avePenalty.toFixed(2));
      $('#acsa-table > tbody > tr:eq(' + (i+1) + ') > td:eq(5)').text(ratioPenalty.toFixed(2) + "%");
      if (maxScore > 0) {
        var canvas = $('#acsa-table > tbody > tr:eq(' + (i+1) + ') > td:eq(6) > canvas')[0];
        if (canvas.getContext) {
          var context = canvas.getContext('2d');
          for (let k = 0; k < 8; k++) {
            context.fillStyle = cols[k];
            // 色の境界から右端までの矩形描画
            var x = Math.round(countLower(rates, threshold[k]) / rates.length * canvasWidth);
            context.fillRect(x, 0, canvasWidth - x, canvasHeight);
          }
        }
      }
    }
  }, {deep: true, immediate: true})
});