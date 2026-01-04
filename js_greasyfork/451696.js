// ==UserScript==
// @name            AtCoder Submission Timer
// @name:ja         AtCoder Submission Timer
// @namespace       https://github.com/Coki628/ac-submission-timer
// @version         1.0.2
// @description     AtCoderの問題画面にタイマーをセットして、指定時間後にコードを提出します。
// @description:ja  AtCoderの問題画面にタイマーをセットして、指定時間後にコードを提出します。
// @author          Coki628
// @license         MIT
// @match           https://atcoder.jp/contests/*/tasks/*
// @downloadURL https://update.greasyfork.org/scripts/451696/AtCoder%20Submission%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/451696/AtCoder%20Submission%20Timer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('#submit').after(`
        <button style="margin-left: 5px;" type="button" class="btn btn-secondary" id="ac-sub-timer-btn" data-toggle="modal" data-target="#ac-sub-timer-modal">
            Submission Timer
        </button>
    `);
    $('#ac-sub-timer-btn').after(`
        <div class="modal fade" id="ac-sub-timer-modal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal"><span>×</span></button>
                        <h4 class="modal-title">AtCoder Submission Timer</h4>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <div>
                                <input style="width: 80px; display: inline-block; margin-left: 20px;" type="number" class="form-control" id="ac-sub-timer-value"> 分後に提出！
                            </div>
                            <div style="margin-top: 10px; margin-left: 20px;" id="ac-sub-timer-info-text">
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button id="ac-sub-timer-set" type="button" class="btn btn-primary">セットする</button>
                        <button type="button" class="btn btn-default" data-dismiss="modal">閉じる</button>
                    </div>
                </div>
            </div>
        </div>
    `);

    let timerId = 0;
    $('#ac-sub-timer-set').on('click', function() {
        if (timerId > 0) {
            clearTimeout(timerId);
            timerId = 0;
            // console.log('timer cleared');
            $('#ac-sub-timer-info-text').text('タイマーをキャンセルしました。');
        }
        const min = $('#ac-sub-timer-value').val();
        if (min && min > 0) {
            const millisec = min * 60 * 1000;
            timerId = setTimeout(() => {
                $('#submit').trigger('click');
            }, millisec);
            // console.log('timer set');
            // 予定時刻を算出
            const mo = moment().add(millisec, 'milliseconds');
            $('#ac-sub-timer-info-text').html(`
                タイマーを${min}分後にセットしました。<br>
                ${min}分後にコードが提出されます。(${mo.hours()}時${mo.minutes()}分頃)
            `);
        }
    });
})();
