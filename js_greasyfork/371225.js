// ==UserScript==
// @name         AtCoderResultNotifier
// @namespace    https://satanic0258.github.io/
// @version      1.0.6
// @description  Send submission result notifications on AtCoder.
// @author       satanic0258
// @include      https://atcoder.jp/*
// @grant        none
// @copyright    2023, satanic0258 (https://satanic0258.github.io/)
// @license      MIT License; https://opensource.org/licenses/MIT
// @downloadURL https://update.greasyfork.org/scripts/371225/AtCoderResultNotifier.user.js
// @updateURL https://update.greasyfork.org/scripts/371225/AtCoderResultNotifier.meta.js
// ==/UserScript==

/*jshint esversion: 6 */

$(function() {
    'use strict';

    // localStorageに保存するキー
    const storageKey_WJ = 'AtCoderResultNotifier_WJ';
    const storageKey_lastFetchedAt = 'AtCoderResultNotifier_lastFetchedAt';

    // リクエスト間隔(デフォルトで公式と同じ5秒)
    const intervalOfRequest_ms = 5 * 1000;
    let timer = null;

    // 非アクティブになってから動作を停止するまでの時間(デフォルトで5分)
    const lifetimeOfWatchingAtInactive_ms = 5 * 60 * 1000;

    // 最後のアクセスからWJデータを無効にするまでの時間(デフォルトで10分)
    const lifetimeOfWJ_ms = 10 * 60 * 1000;

    // 最後の通知からコンテナを初期化するまでの時間(デフォルトで10秒)
    const lifetimeOfContainer_ms = 10 * 1000;

    // 充分大きい値 (充分大きい時刻として使用)
    const INF = (Number.MAX_SAFE_INTEGER - 1) / 2;

    // 最終通知時刻 (コンテナ初期化に使用)
    let lastNotifiedAt = null;

    // このタブで最後にアクティブだった時刻 (非アクティブ時の動作判定で使用)
    let lastFocusedAt = INF;

    // ジャッジステータスを大別
    function classifyStatus(status){ // => ['default', 'success', 'warning']
        if(status === 'AC') return 'success';
        if(status === 'WJ' || status === 'WR' || status.match(/^[\d|\/|\ ]*$/) !== null) return 'default';
        return 'warning';
    }

    // 提出IDから問題名を取得
    function requestProblemNameFromIDAsync(contestName, id){
        const requestURL = 'https://atcoder.jp/contests/' + contestName + '/submissions/' + id;
        let retVal = "ERROR: can't load ProblemName";

        return new Promise(function(resolve){
            $.ajax({
                type: 'GET',
                url: requestURL,
                dataType: 'html',
            })
            .done(function(data){
                const table = $($.parseHTML(data)).find('table');
                if(table) {
                    const nameWithLink = $(table[0]).find('td')[1].innerHTML;

                    // リンクを別タブで開くようにする
                    retVal = nameWithLink.replace(/">/, '" target="_blank">');
                }
            })
            .always(function(){
                resolve(retVal);
            });
        });
    }

    // localStorageのlastFocusedAtを調べてWJを調べる必要があるか確認
    function isValidLastFocusedAt() {
        const storedLastFocusedAt = localStorage.getItem(storageKey_lastFetchedAt);

        if(!storedLastFocusedAt) return false;

        // このタブより後に別のタブがアクティブになっていたら調べない
        if(lastFocusedAt !== Number(storedLastFocusedAt)) return false;

        // 非アクティブになってから5分経っていたら調べない
        if(new Date().getTime() > lastFocusedAt + lifetimeOfWatchingAtInactive_ms) return false;

        return true;
    }

    // コンテストcontestNameのIDの提出を確認
    function reloadWJAsync(contestName, ID, jsonData) {
        return new Promise(function(resolve){
            if(jsonData[ID]){
                const html = $.parseHTML(jsonData[ID].Html);
                const resultStatus = $(html[0]).find('span').text(); // WJ, 2/7, AC, 2/7 WA, TLE, RE,...
                const resultLabel = classifyStatus(resultStatus); // WJ or AC or WA

                // WJがWJではなくなったら通知
                if(resultLabel !== 'default'){
                    let execTime = "", usedMemory = "";
                    if(html.length > 1){
                        execTime = $(html[1]).text();
                        usedMemory = $(html[2]).text();
                    }

                    let problemName = null;
                    requestProblemNameFromIDAsync(contestName, ID) // 提出IDから問題名を取得(非同期)
                    .then(function(name){
                        problemName = name;

                        // 通知コンテナに通知を追加
                        $('#AtCoderResultNotifier-container').append('<div class="AtCoderResultNotifier-notification">' +
                             '<ul>' +
                                 '<li>' + problemName + '</li>' +
                                 '<li><a href="' + 'https://atcoder.jp/contests/' + contestName + '/submissions/' + ID + '" target="_blank">#' + ID + '</a>　<span class="label label-' + resultLabel + '">' + resultStatus + '</span>　' + execTime + '　' + usedMemory + '</li>' +
                             '</ul>'+
                        '</div>');

                        lastNotifiedAt = new Date().getTime();

                        // 通知し終えたのでnullを返す
                        resolve();
                    });
                }
                else{
                    // まだWJなので引き続き確認を続ける
                    resolve(ID);
                }
            }
            else{
                // ここには来ない，再度確認する
                resolve(ID);
            }
        });
    }

    // コンテストcontestNameのWJを確認
    function reloadWJOnContestAsync(contestName, WJjson) {
        return new Promise(function(resolve){
            const IDary = WJjson[contestName].ID;
            const requestURL = 'https://atcoder.jp/contests/' + contestName + '/submissions/me/status/json?sids[]=' + IDary.join('&sids[]=');

            $.ajax({
                type: 'GET',
                url: requestURL,
                dataType: 'json',
            })
            .done(function(data) {
                data = data.Result;
                let promisesOfContest = [];

                // 各WJを確認
                IDary.forEach(function(ID){
                    promisesOfContest.push(reloadWJAsync(contestName, ID, data));
                });

                // このcontestで全てのWJを処理し終えたらjsonを更新
                Promise.all(promisesOfContest)
                .then(function(IDs){
                    // WJでなくなった提出のIDはnullになるためフィルタリング
                    IDs = IDs.filter(v => v);

                    if(IDs.length > 0){
                        WJjson[contestName].ID = IDs;
                    }
                    else{
                        delete WJjson[contestName];
                    }

                    resolve();
                });
            })
            .fail(function(){
                console.log('ERROR: GET', requestURL);
                resolve();
            });
        });
    }

    // WJとなっている提出を全て確認
    function reloadAllWJAsync() {
        // 最終通知時刻からlifetimeOfContainer_ms経っていたらコンテナを初期化
        if(!lastNotifiedAt || new Date().getTime() > lastNotifiedAt + lifetimeOfContainer_ms){
            $('#AtCoderResultNotifier-container').empty();
            lastNotifiedAt = INF;
        }

        if(document.hasFocus()){
            lastFocusedAt = new Date().getTime();
            localStorage.setItem(storageKey_lastFetchedAt, lastFocusedAt);
        }

        // 非アクティブになってからある程度時間が経っていたら確認しない
        if(!isValidLastFocusedAt()){
            clearTimeout(timer);
            return Promise.resolve();
        }

        // 既存のWJを取得
        let WJjson = JSON.parse(localStorage.getItem(storageKey_WJ));
        if(!WJjson) return Promise.resolve();

        let promisesOfAll = [];

        // 各コンテストを確認
        for(const contestName in WJjson){
            // 最終アクセス時からlifetimeOfWJ_ms経っていたらWJデータを削除
            const lastFetchedAt = WJjson[contestName].lastFetchedAt;
            if(!lastFetchedAt || new Date().getTime() > lastFetchedAt + lifetimeOfWJ_ms){
                delete WJjson[contestName];
                continue;
            }

            promisesOfAll.push(reloadWJOnContestAsync(contestName, WJjson));
        }

        // 全てのcontestのWJを処理し終えたらlocalStorageを更新
        return Promise.all(promisesOfAll)
        .then(function(){
            localStorage.setItem(storageKey_WJ, JSON.stringify(WJjson));
            timer = setTimeout(reloadAllWJAsync, intervalOfRequest_ms);
        });
    }

    function collectWJ() {
        // コンテスト名を取得
        const contestName = location.href.match(/^https:\/\/atcoder\.jp\/contests\/([^\/]*).*$/)[1];

        // 既存のlocalStorageのWJを取得
        let WJjson = JSON.parse(localStorage.getItem(storageKey_WJ));
        if(!WJjson) WJjson = {};

        let WJmap = WJjson[contestName];
        if(!WJmap) WJmap = {};

        let WJset = new Set(WJmap.ID);
        if(!WJset) WJset = new Set();

        // 現在の提出状況を取得，新規WJを追加
        const table = $('body').find('.table-responsive>table>tbody');

        table.find('tr').each(function(i, elem){
            if(classifyStatus($(elem).find('.label').text()) === 'default'){
                const tds = $(elem).find('td');
                const url = $(tds[tds.length - 1]).find('a').attr('href');
                WJset.add(url.match(/^.*\/submissions\/([0-9]+?)$/)[1]);
            }
        });

        // WJをlocalStorageに保存
        if(WJset.size > 0){
            WJmap.lastFetchedAt = new Date().getTime().toString();
            WJmap.ID = [...WJset];

            WJjson[contestName] = WJmap;
        }
        else{
            delete WJjson[contestName];
        }
        localStorage.setItem(storageKey_WJ, JSON.stringify(WJjson));
    }

    // ----------->8----------- main ----------->8-----------

    // 見ているページが提出一覧であればまずWJを収集する
    if(location.href.match(/^https:\/\/atcoder\.jp\/contests\/[^\/]*\/submissions\/me$/) !== null){
        collectWJ();
    }

    $(window)
    .bind("focus",function(){ //フォーカスが当たったら最終アクティブ時刻とタイマーを更新
        // 別のAtCoderタブ->このAtCoderタブと切り替えたときに二重でcallされるのを防ぐ
        setTimeout(function(){
            lastFocusedAt = new Date().getTime();
            localStorage.setItem(storageKey_lastFetchedAt, lastFocusedAt);
        }, 50);

        // focusを繰り返されたときに複数個タイマーがセットされるのを防ぐ
        clearTimeout(timer);
        timer = setTimeout(reloadAllWJAsync, intervalOfRequest_ms);
    })
    .bind("blur",function(){ //フォーカスが外れたら最終アクティブ時刻を設定するのみ，タイマーは更新しない
        lastFocusedAt = new Date().getTime();
        localStorage.setItem(storageKey_lastFetchedAt, lastFocusedAt);
    });

    // このスクリプトが読み込まれた時のアクティブ状態で初期化
    lastFocusedAt = new Date().getTime();
    localStorage.setItem(storageKey_lastFetchedAt, lastFocusedAt);

    timer = setTimeout(reloadAllWJAsync, intervalOfRequest_ms);

    // コンテナを用意
    $('body').append('<div id="AtCoderResultNotifier-container"></div>');

    // 通知要素のスタイルを定義
    $('head').append('<style type="text/css">' +
'#AtCoderResultNotifier-container{' +
    'position: fixed;' +
    'top: 120px;' +
    'left: 20px;' +
    'z-index: 1000;' +
'}' +
'.AtCoderResultNotifier-notification{' +
    'position: sticky;' +
    'top: 0;' +
    'left: 0;' +
    'background: #FFF;' +
    'border-radius: 4px;' +
    'border: medium solid #000;' +
    'cursor: pointer;' +

    '-webkit-animation: AtCoderResultNotifier-fadeOut 7s ease 0s forwards;' +
    'animation: AtCoderResultNotifier-fadeOut 7s ease 0s forwards;' +
    'overflow:hidden;' +
'}' +
'@keyframes AtCoderResultNotifier-fadeOut {' +
    '  0% {opacity:0;height:  0px;}' +
    ' 15% {opacity:1;height:4.4em;}' +
    ' 85% {opacity:1;height:4.4em;border-width: 3px 3px;}' +
    '100% {opacity:0;height:  0px;border-width: 0px 3px;}' +
'}' +
'@-webkit-keyframes AtCoderResultNotifier-fadeOut {' +
    '  0% {opacity:0;height:  0px;}' +
    ' 15% {opacity:1;height:4.4em;}' +
    ' 85% {opacity:1;height:4.4em;border-width: 3px 3px;}' +
    '100% {opacity:0;height:  0px;border-width: 0px 3px;}' +
'}' +
'.AtCoderResultNotifier-notification>ul{' +
    'list-style: none;' +
    'margin: 0;' +
    'padding: .3em .8em 0 .8em;' +
'}' +
        '</style>');

    // 通知をクリックしたら消すようにする
    $(document).on('click', '.AtCoderResultNotifier-notification', function(){
        $(this).remove();
    });
});