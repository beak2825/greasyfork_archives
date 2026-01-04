// ==UserScript==
// @name         ジョブカン 打刻修正画面に振替られた休憩時間を表示する
// @namespace    https://greasyfork.org/users/5795
// @version      0.9
// @description  自動で労働時間が休憩時間に振替られる機能があるとき、何分休憩時間になったかがわからないので計算して表示する。また、それぞれの打刻で労働・休憩した時間も表示する。
// @author       ikeyan
// @match        https://ssl.jobcan.jp/employee/adit/modify*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415448/%E3%82%B8%E3%83%A7%E3%83%96%E3%82%AB%E3%83%B3%20%E6%89%93%E5%88%BB%E4%BF%AE%E6%AD%A3%E7%94%BB%E9%9D%A2%E3%81%AB%E6%8C%AF%E6%9B%BF%E3%82%89%E3%82%8C%E3%81%9F%E4%BC%91%E6%86%A9%E6%99%82%E9%96%93%E3%82%92%E8%A1%A8%E7%A4%BA%E3%81%99%E3%82%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/415448/%E3%82%B8%E3%83%A7%E3%83%96%E3%82%AB%E3%83%B3%20%E6%89%93%E5%88%BB%E4%BF%AE%E6%AD%A3%E7%94%BB%E9%9D%A2%E3%81%AB%E6%8C%AF%E6%9B%BF%E3%82%89%E3%82%8C%E3%81%9F%E4%BC%91%E6%86%A9%E6%99%82%E9%96%93%E3%82%92%E8%A1%A8%E7%A4%BA%E3%81%99%E3%82%8B.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const tap = (o, ...fns) => {
        fns.forEach(fn => fn(o));
        return o;
    };
    const LabelStartWorkingPattern = /^(出勤|入室)$/;
    const LabelFinishWorkingPattern = /^(退勤|退室)$/;
    const LabelStartRest = "休憩開始";
    const LabelFinishRest = "休憩終了";
    function hmToTimestamp(hm) { const [h, m] = hm.split(":"); return Number(h) * 60 + Number(m); }
    function timestampToHmString(ts) { return `${Math.floor(ts / 60)}時間${String(ts % 60).padStart(2)}分`; }
    function timestampToHmShortString(ts) { return `${Math.floor(ts / 60)}:${String(ts % 60).padStart(2, '0')}`; }
    //　setSummary() で #time-table のinnerHTMLが書き換えられるので、table要素以下が毎回再作成される
    const observer = new MutationObserver(
        mutations => {
            for (const mutation of mutations) {
                if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                    const newTable = [...mutation.addedNodes].find(node => node.matches('table'));
                    if (newTable && [...newTable.querySelectorAll(':scope>tbody>tr>th')].some(th => th.textContent.trim() === "休憩時間")) {
                        insertConvertedBreakTimeRow();
                    }
                }
            }
        }
    ).observe(document.querySelector('#time-table'), {childList: true});
    function insertConvertedBreakTimeRow() {
        const punches = [...document.querySelectorAll('#logs-table tr')]
            .map(tr => ({tr, tds: [...tr.querySelectorAll('td')]}))
            .filter(({tds}) => tds.length > 0)
            .map(({tr, tds: [td0, td1]}) => ({
                tr,
                打刻区分: td0.textContent.trim(),
                時刻: hmToTimestamp(td1.textContent.trim()),
            }))
            .filter(({打刻区分}) => 打刻区分 !== "");

        let lastTime = null;
        punches.forEach(({tr, 打刻区分, 時刻}) => {
            tr.style.position = 'relative';
            const insertNote = s => {
                const td5 = tr.querySelector('td:nth-child(5)');
                td5.prepend(tap(document.createElement('div'), div => {
                    div.textContent = s;
                    div.style = `
                    position: absolute;
                    top: -0.5lh;
                    background-color: white;
                    border-color: gray;
                    border-width: 1px;
                    border-style: solid;
                    `;
                }));
            };
            if (LabelStartWorkingPattern.test(打刻区分) || 打刻区分 == LabelFinishRest) {
                if (lastTime < 0) {
                    insertNote(`💤 ${timestampToHmShortString(時刻 + lastTime)}`);
                }
                if (lastTime > 0) {
                    throw new Error('出勤が2回続けて出ました');
                }
                lastTime = 時刻;
            }
            if (LabelFinishWorkingPattern.test(打刻区分) || 打刻区分 == LabelStartRest) {
                if (lastTime > 0) {
                    insertNote(`🔥 ${timestampToHmShortString(時刻 - lastTime)}`);
                }
                if (lastTime == null || lastTime < 0) {
                    throw new Error('前回が出勤ではありませんでした');
                }
                lastTime = -時刻;
            }
        });
        const rawBreakTime = punches
            .map(({打刻区分, 時刻}, i, arr) => {
                if (打刻区分 == LabelStartRest || i + 1 < arr.length && LabelFinishWorkingPattern.test(打刻区分) && LabelStartWorkingPattern.test(arr[i + 1].打刻区分)) return -時刻;
                if (打刻区分 == LabelFinishRest || 0 <= i - 1 && LabelStartWorkingPattern.test(打刻区分) && LabelFinishWorkingPattern.test(arr[i - 1].打刻区分)) return 時刻;
                return 0;
            })
            .reduce((a, b) => a + b, 0);
        console.log("rawBreakTime:", rawBreakTime);
        const table = [...document.querySelectorAll('#time-table tr')].map(tr => ({name: tr.querySelector(':scope>th').textContent.trim(), value: tr.querySelector(':scope>td').textContent.trim(), tr}));
        const row休憩時間 = table.find(row => row.name == "休憩時間");
        const officialBreakTime = row休憩時間.value.match(/(?:^|⇒)\s*(\d+)時間\s*(\d+)分\s*$/).slice(1, 3).map(Number).reduce((a, b) => a * 60 + b);
        console.log("officialBreakTime:", officialBreakTime);
        const convertedBreakTime = Math.max(0, officialBreakTime - rawBreakTime);
        row休憩時間.tr.insertAdjacentHTML('afterend', `<tr ${convertedBreakTime > 0 ? 'style="background: linear-gradient(transparent 0%, #ffff66 0%)"' : ''}><th class="jbc-text-sub" scope="row">振替られた休憩時間</th><td>${timestampToHmString(convertedBreakTime)}</td></tr>`);
    }
})();
