// ==UserScript==
// @name         AtCoder Jump to Submissions from Standings
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  順位表の得点をダブルクリックすると、該当するコンテスタントの実装を見ることができます。
// @match        https://atcoder.jp/contests/*/standings*
// @require      https://code.jquery.com/jquery-3.6.1.min.js
// @author       hiro_hiro
// @license      CC0
// @supportURL   https://github.com/KATO-Hiro/AtCoder-Jump-to-Submissions-from-Standings/issues
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397528/AtCoder%20Jump%20to%20Submissions%20from%20Standings.user.js
// @updateURL https://update.greasyfork.org/scripts/397528/AtCoder%20Jump%20to%20Submissions%20from%20Standings.meta.js
// ==/UserScript==

$(function () {
    'use strict';

    $(document).on('dblclick', '.standings-result', function () {
        const $standingsType = getStandingsType($('body'));

        const $prefix = addPrefixIfNeeds($standingsType);

        const $clickedColumnIndex = getClickedColumnIndex(this, $standingsType);
        const $taskUrls = $('body').find('thead a');
        const $taskId = getTaskId($taskUrls, $clickedColumnIndex);

        const $username = getUserName(this);

        const $displayLanguage = getDisplayLanguage($(location));
        const $suffix = addSuffixIfNeeds($displayLanguage);

        // 順位表の範囲外なら、提出ページに遷移しない
        if ($clickedColumnIndex < $taskUrls.length) {
            jumpToPersonalSubmissions($prefix, $taskId, $username, $suffix);
        }
    });
})();

function getStandingsType(object) {
    let $standingsType = '';
    let isVirtual = $(object).find('script:contains("virtual")')[0];
    let isMultiply = $(object).find('script:contains("multiply_ranks")')[0];
    let isTeam = $(object).find('script:contains("team")')[0];
    let isExtended = $(object).find('script:contains("extended")')[0];

    // HACK: if分岐はメンテナンス的によくないかも
    // HACK: 他の言語のEnumに相当する構文がデフォルトで存在しない?
    if (isVirtual) {
        $standingsType = 'virtual';
    } else if (isMultiply) {
        $standingsType = 'multiply';
    } else if (isTeam) {
        $standingsType = 'team';
    } else if (isExtended) {
        $standingsType = 'extended';
    } else {
        $standingsType = 'general';
    }

    return $standingsType
}

function addPrefixIfNeeds(standingsType) {
    let prefix = '';

    if (standingsType != 'general') {
        prefix = '../';
    }

    return prefix
}

function getTaskId(taskUrls, clickedColumnIndex) {
    let $taskId = '';

    taskUrls.each((index) => {
        if (index == clickedColumnIndex) {
            const $url = taskUrls[index].pathname;
            const $elements = $url.split('/');
            const $length = $elements.length;

            $taskId = $elements[$length - 1]; // 0-indexed
        }
    });

    return $taskId
}

// HACK: 順位表の列数に応じた処理をしているため、AtCoderのUIが変更されると動かなくなる可能性がある
// WHY : 順位表の得点の欄に、問題のIDが含まれていないため
function getClickedColumnIndex(object, standingsType) {
    let $clickedColumnIndex = $(object)[0].cellIndex;

    // コンテスト当日の順位表と延長戦順位表・バーチャル順位表の列の並びに違いがある
    // 当日の順位表の並びに合わせる
    if (standingsType == 'virtual' || standingsType == 'extended') {
        $clickedColumnIndex -= 1
    }

    // 順位とユーザ名の欄を扱わずに済むようにインデックスを補正
    // A問題がindex = 0となるようにしている
    $clickedColumnIndex -= 3

    return $clickedColumnIndex
}

function getUserName(object) {
    const $standings = $(object).siblings('td');
    const $username = $standings.find('.username span').text();

    return $username
}

function getDisplayLanguage(location) {
    let language = 'jp';
    const params = location.attr('search');

    if (params.match(/lang=en/)) {
        language = 'en';
    }

    return language
}

function addSuffixIfNeeds($displayLanguage) {
    let suffix = '&lang=';

    if ($displayLanguage == 'en') {
        suffix += 'en';
    } else {
        suffix = '';
    }

    return suffix
}

function jumpToPersonalSubmissions(prefix, taskId, username, suffix) {
    setTimeout(function () {
        location.href = `${prefix}submissions?f.Task=${taskId}&f.Language=&f.Status=AC&f.User=${username}${suffix}`;
    }, 250)
}
