// ==UserScript==
// @name         OMCStandingsStatistics
// @namespace    none
// @version      1.0.2
// @description  onlinemathcontestでの /standings ページに補助情報を追加します
// @match        https://onlinemathcontest.com/contests/*/standings
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524178/OMCStandingsStatistics.user.js
// @updateURL https://update.greasyfork.org/scripts/524178/OMCStandingsStatistics.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // ------------------------------------------
  // /standings ページのURLパターン
  // ------------------------------------------
  const standingsPattern = /^https:\/\/onlinemathcontest\.com\/contests\/[^/]+\/standings$/;

  if (standingsPattern.test(location.href)) {
    // コンテスト名をURLから抜き出す
    const match = location.href.match(/contests\/([^/]+)\/standings/);
    if (!match) return;
    const contestName = match[1];
    const apiUrl = `https://onlinemathcontest.com/api/contests/${contestName}/standings?rated=0`;

    fetch(apiUrl)
      .then(res => res.json())
      .then(json => {
        const standingsDiv = document.getElementById('standings');
        if (!standingsDiv) {
          console.warn('#standingsが見つかりません');
          return;
        }
        const tasks = json.tasks;
        const standings = json.standings;
        const isPast = json.isPast;
        const isPointVisible = json.is_point_visible;

        // isPast かつ is_point_visible のときのみテーブルを表示
        if(isPast && isPointVisible){
          // テーブルを作成し、standingsDivの最上位に挿入
          const table = document.createElement('table');
          table.style.width = '100%';
          table.style.borderCollapse = 'collapse';
          table.innerHTML = `
            <thead>
              <tr>
                <th style="border:1px solid #ccc; padding:4px;">問題</th>
                <th style="border:1px solid #ccc; padding:4px;">得点</th>
                <th style="border:1px solid #ccc; padding:4px;">人数</th>
                <th style="border:1px solid #ccc; padding:4px;">正解率</th>
                <th style="border:1px solid #ccc; padding:4px;">平均ペナ</th>
                <th style="border:1px solid #ccc; padding:4px;">ペナ率</th>
                <th style="border:1px solid #ccc; padding:4px; width:200px;">レート</th>
              </tr>
            </thead>
            <tbody></tbody>
          `;
          standingsDiv.insertBefore(table, standingsDiv.firstChild);

          const tbody = table.querySelector('tbody');

          // レート→色 (ただし r=0 で黒)
          const rateColors = [
            { min: 1,    max: 400,    color: '#808080' },
            { min: 400,  max: 800,    color: '#804000' },
            { min: 800,  max: 1200,   color: '#008000' },
            { min: 1200, max: 1600,   color: '#00c0c0' },
            { min: 1600, max: 2000,   color: '#0000ff' },
            { min: 2000, max: 2400,   color: '#c0c000' },
            { min: 2400, max: 2800,   color: '#ff8000' },
            { min: 2800, max: 999999, color: '#ff0000' },
          ];

          tasks.forEach((task, idx) => {
            const label = String.fromCharCode('A'.charCodeAt(0) + idx);
            // タスクへのリンク
            const taskUrl = `https://onlinemathcontest.com/contests/${contestName}/tasks/${task.id}`;

            // 集計用
            let triedCount = 0;
            let solvedCount = 0;
            let penSum = 0;
            let penNonZero = 0;
            // レート分布のカウント
            const rateCounter = Array(rateColors.length).fill(0);
            // レート0 (None含む) のユーザーをカウントするための変数
            let countBlack = 0;

            standings.forEach(userStand => {
              const t = userStand.tasks?.[idx];
              if (!t) return;

              const tim = t.time;         // 整数 or null
              const pen = t.penalty;      // 整数 or null
              // userStand.user?.rate がnull/undefinedの場合は0と同じ扱い
              const r   = userStand.user?.rate ?? 0;

              // 提出ずみかどうか
              const tried = (tim != null) || (pen != null && pen >= 1);
              if (tried) {
                triedCount++;
              }

              // CA(正解)したかどうか
              if (tim != null) {
                solvedCount++;
                const realPen = pen ?? 0;
                penSum += realPen;
                if (realPen >= 1) {
                  penNonZero++;
                }
                // レートが0なら黒にする
                if (r === 0) {
                  countBlack++;
                } else {
                  // レートごとにカウント
                  for (let i = 0; i < rateColors.length; i++){
                    if (r >= rateColors[i].min && r < rateColors[i].max) {
                      rateCounter[i]++;
                      break;
                    }
                  }
                }
              }
            });

            // 表示用の文字列
            let peopleText = '0/0';
            let accPct = '0.00%';
            let avgPen = '0.00';
            let penPct = '0.00%';

            if (triedCount > 0) {
              peopleText = `${solvedCount}/${triedCount}`;
              const accuracy = (solvedCount / triedCount) * 100;
              accPct = accuracy.toFixed(2) + '%';
            }
            if (solvedCount > 0) {
              avgPen = (penSum / solvedCount).toFixed(2);
              const penRate = (penNonZero / solvedCount) * 100;
              penPct = penRate.toFixed(2) + '%';
            }

            const tr = document.createElement('tr');
            // ここで問題ラベルをリンク化
            tr.innerHTML = `
              <td style="border:1px solid #ccc; padding:4px;">
                <a href="${taskUrl}">
                  ${label}
                </a>
              </td>
              <td style="border:1px solid #ccc; padding:4px;">${task.admin_point ?? '-'}</td>
              <td style="border:1px solid #ccc; padding:4px;">${peopleText}</td>
              <td style="border:1px solid #ccc; padding:4px;">${accPct}</td>
              <td style="border:1px solid #ccc; padding:4px;">${avgPen}</td>
              <td style="border:1px solid #ccc; padding:4px;">${penPct}</td>
            `;

            // レート分布の棒グラフ
            const tdRate = document.createElement('td');
            tdRate.style.border = '1px solid #ccc';
            tdRate.style.padding = '4px';
            tdRate.style.width = '200px';

            const barDiv = document.createElement('div');
            barDiv.style.width = '100%';
            barDiv.style.height = '16px';
            barDiv.style.display = 'flex';
            barDiv.style.border = '1px solid #ccc';

            if (solvedCount > 0) {
              // まずレート0 (None) のユーザーを描画
              if (countBlack > 0) {
                const ratio = (countBlack / solvedCount) * 100;
                const segBlack = document.createElement('div');
                segBlack.style.width = ratio + '%';
                segBlack.style.backgroundColor = '#000000'; // 黒
                barDiv.appendChild(segBlack);
              }

              // それ以外の既存レート分布を描画
              for (let i = 0; i < rateCounter.length; i++){
                const c = rateCounter[i];
                if (!c) continue;
                const ratio = (c / solvedCount) * 100;
                const seg = document.createElement('div');
                seg.style.width = ratio + '%';
                seg.style.backgroundColor = rateColors[i].color;
                barDiv.appendChild(seg);
              }
            }

            tdRate.appendChild(barDiv);
            tr.appendChild(tdRate);
            tbody.appendChild(tr);
          });
        }
      })
      .catch(err => {
        console.error('Standings API取得失敗:', err);
      });
  }
})();