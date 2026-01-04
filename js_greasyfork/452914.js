// ==UserScript==
// @name         Kinnnosuke Extension
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add display for shortage / surplus in working days
// @author       subdiox
// @match        https://tms.kinnosuke.jp/*/app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kinnosuke.jp
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452914/Kinnnosuke%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/452914/Kinnnosuke%20Extension.meta.js
// ==/UserScript==

waitForKeyElements('#top_horizontal_scroll_child', pageDidLoad);
waitForKeyElements('#reloginButton', reloginButtonDidLoad);

function reloginButtonDidLoad() {
  moveLogin();
}

function getMinute(str) {
    const hour = Number(str.split(':')[0]);
    const minute = Number(str.split(':')[1]);
    return hour * 60 + minute;
}

function getString(min) {
    const hour = Math.floor(min / 60);
    const minute = min % 60;
    return `${hour}:${minute}`;
}

function pageDidLoad(jNode) {
    const csrftoken = document.querySelector('body').textContent.match(/'X-Flow-Csrftoken': '([0-9a-f]+)'/)[1];
    const x = new XMLHttpRequest();
    x.open('POST', 'https://tms.kinnosuke.jp/LINE/front-api/attendance.getList', !1);
    x.setRequestHeader('X-Flow-Csrftoken', csrftoken);
    x.withCredentials = !0;
    x.send(null);
    const json = JSON.parse(x.responseText);
    const total = json.data.total_data;
    console.log(total)
    const requiredMinutes = getMinute(total[0].contents[1].content);
    const requiredDays = Math.floor(requiredMinutes / 450);
    const workedMinutes = getMinute(total[1].contents[1].content);
    const workedDays = Number(total[8].contents[1].content);
    const paidLeaveDays = Number(total[9].contents[1].content);
    const surplusMinutes = workedMinutes - (workedDays + paidLeaveDays) * 450;
    console.log({
      requiredMinutes,
      requiredDays,
      workedMinutes,
      workedDays,
      paidLeaveDays,
      surplusMinutes
    })
    jNode.append(`
<div class="panel_column slim" style="display: flex; flex-direction: column;">
    <table style="padding: 20px">
        <thead>
            <tr>
                <th colspan="2">勤務時間まとめ</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>所定労働時間合計</td>
                <td>${total[0].contents[1].content}</td>
            </tr>
            <tr>
                <td>勤務時間合計</td>
                <td>${total[1].contents[1].content}</td>
            </tr>
            <tr>
                <td>不足時間合計</td>
                <td>${total[2].contents[1].content}</td>
            </tr>
            <tr>
                <td>所定出勤日数</td>
                <td>${requiredDays}</td>
            </tr>
            <tr>
                <td>出勤日数</td>
                <td>${total[8].contents[1].content}</td>
            </tr>
            <tr>
                <td>不足出勤日数</td>
                <td>${requiredDays - workedDays}</td>
            </tr>
            <tr style='${surplusMinutes < 0 ? "color: red" : ""}'>
                <td>現時点での${surplusMinutes < 0 ? '不足勤務時間合計' : '余剰勤務時間合計'}</td>
                <td>${getString(Math.abs(surplusMinutes))}</td>
            </tr>
        </tbody>
    </table>
</div>
    `);
}