// ==UserScript==
// @name         Steam自动探索队列（每日仅执行一次）
// @namespace    https://keylol.com/t157861-1-1
// @version      1.0
// @description  Steam节庆活动用脚本，每天自动探索3次队列，仅在第一次打开steam网页时执行。
// @author       fall2wish
// @license      MIT
// @match        https://store.steampowered.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steampowered.com
// @downloadURL https://update.greasyfork.org/scripts/470109/Steam%E8%87%AA%E5%8A%A8%E6%8E%A2%E7%B4%A2%E9%98%9F%E5%88%97%EF%BC%88%E6%AF%8F%E6%97%A5%E4%BB%85%E6%89%A7%E8%A1%8C%E4%B8%80%E6%AC%A1%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/470109/Steam%E8%87%AA%E5%8A%A8%E6%8E%A2%E7%B4%A2%E9%98%9F%E5%88%97%EF%BC%88%E6%AF%8F%E6%97%A5%E4%BB%85%E6%89%A7%E8%A1%8C%E4%B8%80%E6%AC%A1%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var currentDate = new Date().toLocaleDateString();
    var lastExecutionDate = localStorage.getItem('lastExecutionDate');

    // 检查是否已经执行过脚本
    if (lastExecutionDate !== currentDate) {
        // 在这里编写你要执行的功能脚本代码
        (function _exec(){
            var appids,
                running = true,
                queueNumber,
                progressDialog = ShowAlertDialog('探索中', $J('<div/>').append($J('<div/>', {'class': 'waiting_dialog_throbber'}) ).append( $J('<div/>', {'id': 'progressContainer'}).text('获取进度...') ), '停止').done(abort);

            function abort(){
                running = false;
                progressDialog.Dismiss();
            }

            function retry(){
                abort();
                ShowConfirmDialog('错误', '是否重试?', '重试', '放弃').done(_exec)
            }

            function clearApp(){
                if(!running)
                    return;
                showProgress();
                var appid = appids.shift();
                !appid ? generateQueue() : $J.post( appids.length ? '/app/' + appid : '/explore/next/', {sessionid: g_sessionID, appid_to_clear_from_queue: appid} ).done(clearApp).fail(retry);
            }

            function generateQueue(){
                running && $J.post('/explore/generatenewdiscoveryqueue', {sessionid: g_sessionID, queuetype: 0}).done(beginQueue).fail(retry);
            }

            function beginQueue(){
                if(!running)
                    return;
                $J.get('/explore/').done(function(htmlText){
                    var cardInfo = htmlText.match(/<div class="subtext">\D+(\d)\D+<\/div>/);
                    if( !cardInfo ){
                        abort();
                        ShowAlertDialog('完成','已完成全部3轮探索队列');
                        return;
                    }
                    var matchedAppids = htmlText.match(/0,\s+(\[.*\])/);
                    if( !matchedAppids ){
                        retry();
                        return;
                    }
                    appids = JSON.parse(matchedAppids[1]);
                    queueNumber = cardInfo[1];
                    appids.length == 0 ? generateQueue() : clearApp();
                    showProgress();
                })
            }

            function showProgress(){
                $J('#progressContainer').html( '<br>剩余' + queueNumber + '个待探索队列, 当前队列剩余' + appids.length + '个待探索游戏' );
            }

            beginQueue();
        })();

        // 更新最后执行时间
        localStorage.setItem('lastExecutionDate', currentDate);
    }
})();