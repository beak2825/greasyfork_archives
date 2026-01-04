// ==UserScript==
// @name         AtCoderHeuristicContestBarChart
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  横軸を順位、縦軸を総スコアとする棒グラフを、順位表上部に出力
// @author       pitP
// @license      MIT
// @match        https://atcoder.jp/contests/ahc*/standings*
// @require      https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.min.js
// @downloadURL https://update.greasyfork.org/scripts/477377/AtCoderHeuristicContestBarChart.user.js
// @updateURL https://update.greasyfork.org/scripts/477377/AtCoderHeuristicContestBarChart.meta.js
// ==/UserScript==

(function () {
    'use strict';
    $('#vue-standings').prepend(`
    <div>
    <canvas id='BarChart'></canvas>
    </div>
    `);

    vueStandings.$watch('standings', function (newVal, oldVal) {
        if (!newVal) {
            return;
        }
        var data;
        var task = newVal.TaskInfo;
        if (vueStandings.filtered) {
            data = vueStandings.filteredStandings;
        }
        else {
            data = newVal.StandingsData;
        }


        const target_user = data.filter(item => item.TotalResult.Count > 0);
        const rank = Array.from({ length: target_user.length }, (_, i) => i + 1);
        const score = target_user.map(item => item.TotalResult.Score / 100);

        var ctx = document.getElementById("BarChart");
        var BarChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: rank,
                datasets: [
                    {
                        label: 'TotalScore',
                        data: score,
                        backgroundColor: "rgba(0, 255, 0, 1)",
                    }
                ]
            },
        });
    }, { deep: true, immediate: true })
})();