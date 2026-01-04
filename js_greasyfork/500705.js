// ==UserScript==
// @name        Atcoder AC Submission Duration
// @namespace   https://oginoshikibu.github.io/
// @version     0.4
// @description AtCoderの順位表で、その問題をACするのにかかった時間を表示する
// @match       https://atcoder.jp/contests/*/standings
// @match       https://atcoder.jp/contests/*/standings/virtual
// @author      oginoshikibu
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/500705/Atcoder%20AC%20Submission%20Duration.user.js
// @updateURL https://update.greasyfork.org/scripts/500705/Atcoder%20AC%20Submission%20Duration.meta.js
// ==/UserScript==

const observer = new MutationObserver((mutations, obs) => {
    const $standingsTbody = $('#standings-tbody');
    if ($standingsTbody.length) {
        $standingsTbody.find('tr').each(function () {
            let times = [];
            $(this).find('.standings-result').slice(1).each(function () {
                const $td = $(this);
                const $timeP = $td.find('p').last(); // 時間を含む<p>タグを取得
                const timeText = $timeP.text(); // <p>タグのテキスト（時間）を取得

                // 正規表現で時間の形式にマッチするかチェック
                if (/^\d+:\d{2}$/.test(timeText)) {
                    times.push({ time: timeText, element: $timeP });
                }
            });

            if (times.length === 0) {
                return;
            }

            times.push({ time: '0:00', element: null });

            // 時間を昇順でソート
            times.sort((a, b) => {
                const [aMin, aSec] = a.time.split(':').map(Number);
                const [bMin, bSec] = b.time.split(':').map(Number);
                return aMin * 60 + aSec - (bMin * 60 + bSec);
            });

            // 時間差を計算して表示
            for (let i = 1; i < times.length; i++) {
                const diff = calculateTimeDifference(times[i - 1].time, times[i].time);
                times[i].element.text(`${times[i].time} (${diff})`);
            }

        });

        // 目的の要素が見つかったので、Observerを停止する
        obs.disconnect();
    }

});

// Observerの設定
observer.observe(document, {
    childList: true,
    subtree: true
});


// 時間の差を計算する関数
function calculateTimeDifference(startTime, endTime) {
    const [startMinutes, startSeconds] = startTime.split(':').map(Number);
    const [endMinutes, endSeconds] = endTime.split(':').map(Number);
    const startTotalSeconds = startMinutes * 60 + startSeconds;
    const endTotalSeconds = endMinutes * 60 + endSeconds;
    const diff = endTotalSeconds - startTotalSeconds;

    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}