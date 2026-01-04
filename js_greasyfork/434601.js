// ==UserScript==
// @name         Japanese WaniKani dashboard
// @namespace    ddonovan
// @version      0.2
// @description  Translate the WaniKani dashboard into 日本語
// @author       Djack Donovan
// @copyright    2021 Djack Donovan
// @include      /^https://(www|preview).wanikani.com/*
// @icon         https://www.wanikani.com/favicon.ico
// @run-at       document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/434601/Japanese%20WaniKani%20dashboard.user.js
// @updateURL https://update.greasyfork.org/scripts/434601/Japanese%20WaniKani%20dashboard.meta.js
// ==/UserScript==

if (!window.wkof) {
    alert('Japanese WaniKani dashboard script requires Wanikani Open Framework.\nYou will now be forwarded to installation instructions.');
    window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
    return;
}

function replaceInText(element, pattern, replacement) {
    for (let node of element.childNodes) {
        switch (node.nodeType) {
            case Node.ELEMENT_NODE:
            case Node.DOCUMENT_NODE:
                replaceInText(node, pattern, replacement);
                break;
            case Node.TEXT_NODE:
                node.textContent = node.textContent.replace(pattern, replacement);
                break;
        }
    }
}

var substitutionGroups = [
    // main buttons
    { class: 'lessons-and-reviews__lessons-button', substitutions: [
        { level: 26, source: 'Lessons', target: '授業' },
    ] },
    { class: 'lessons-and-reviews__reviews-button', substitutions: [
        { level: 26, source: 'Reviews', target: '復習' },
    ] },

    // review forecast
    { class: 'forecast', substitutions: [
        { level: 26, source: 'Review Forecast', target: '復習予報' },
        { level: 18, source: 'Review Forecast', target: 'Review 予報' },
    ] },
    { class: 'review-forecast__day-label', substitutions: [
        { level: 18, source: 'Monday', target: '月曜日' },
        { level: 18, source: 'Tuesday', target: '火曜日' },
        { level: 18, source: 'Wednesday', target: '水曜日' },
        { level: 18, source: 'Thursday', target: '木曜日' },
        { level: 18, source: 'Friday', target: '金曜日' },
        { level: 18, source: 'Saturday', target: '土曜日' },
        { level: 18, source: 'Sunday', target: '日曜日' },
        { level: 3, source: 'Today', target: '今日' },
    ] },
    { class: 'review-forecast__hour', substitutions: [
        { level: 6, source: '12 am', target: '午前0時' },
        { level: 6, source: '12 pm', target: '午後0時' },
        { level: 6, source: /(\d+) am/g, target: '午前$1時' },
        { level: 6, source: /(\d+) pm/g, target: '午後$1時' },
    ] },

    // progress panel
    { class: 'progress-component', substitutions: [
        { level: 11, source: /Level (\d+) Progress/g, target: '$1級進行' },
        { level: 0, source: /(\d+) of (\d+)/g, target: '$2つに$1つ' },
        { level: 23, source: 'kanji passed', target: '漢字を心得る' },
        { level: 10, source: 'kanji passed', target: '漢字 passed' },
        { level: 9, source: 'Radicals', target: '部首' },
        { level: 10, source: 'Kanji', target: '漢字' },
        { level: 15, source: 'Vocabulary', target: '単語' },
    ] },

    // nav bar
    { class: 'navigation-shortcut--lessons', substitutions: [
        { level: 26, source: 'Lessons', target: '授業' },
    ] },
    { class: 'navigation-shortcut--reviews', substitutions: [
        { level: 26, source: 'Reviews', target: '復習' },
    ] },
    { class: 'sitemap__section-header', substitutions: [
        { level: 0, source: 'Levels', target: 'レベル' },
        { level: 9, source: 'Radicals', target: '部首' },
        { level: 10, source: 'Kanji', target: '漢字' },
        { level: 15, source: 'Vocabulary', target: '単語' },
        { level: 0, source: 'Help', target: 'ヘルプ' },
    ] },

    // lesson page
    { id: 'lessons-summary', substitutions: [
        { level: 9, source: 'Radicals', target: '部首' },
        { level: 10, source: 'Kanji', target: '漢字' },
        { level: 15, source: 'Vocabulary', target: '単語' },
        { level: 29, source: 'Lessons Summary', target: '授業の大略' },
        { level: 26, source: 'Lessons Summary', target: '授業 Summary' },
        { level: 10, source: 'Start Session', target: 'セッションを始めます' },
    ] },
    { id: 'supplement-nav', substitutions: [
        { level: 8, source: 'name', target: '名前' },
        { level: 10, source: 'found in kanji', target: '漢字に見付ける' },
        { level: 9, source: 'radicals', target: '部首' },
        { level: 11, source: 'meaning', target: '意味' },
        { level: 10, source: 'readings', target: '読み方' },
        { level: 14, source: 'examples', target: '例え' },
        { level: 10, source: 'reading', target: '読み方' },
        { level: 21, source: 'kanji composition', target: '漢字の分解' },
        { level: 10, source: 'kanji composition', target: '漢字 composition' },
        { level: 32, source: 'context', target: '文脈' }, // not WaniKani vocabulary
    ] },

    // review page
    { id: 'reviews-summary', substitutions: [
        { level: 9, source: 'Radicals', target: '部首' },
        { level: 10, source: 'Kanji', target: '漢字' },
        { level: 15, source: 'Vocabulary', target: '単語' },
        { level: 29, source: 'Reviews Summary', target: '復習の大略' },
        { level: 26, source: 'Reviews Summary', target: '復習 Summary' },
        { level: 10, source: 'Start Session', target: 'セッションを始めます' },
        { level: 21, source: 'Answered Correctly', target: '正解' },
        { level: 21, source: 'Answered Incorrectly', target: '不正解' },
    ] },
];

var level;

try {
    window.wkof.include('Apiv2');
    window.wkof.ready('Apiv2').then(fetch_data);
    function fetch_data() {
        window.wkof.Apiv2.fetch_endpoint('user').then(process_response);
    }
    function process_response(response) {
        level = response.data.level;
        runSubstitutions();
    }

    //let progressElement = document.getElementsByClassName('progress-component')[0];
    //let match = progressElement.innerHTML.match(/Level (\d+) Progress/);
    //level = parseInt(match[1]);
} catch {
    level = 50;
    window.addEventListener('load', function() {
        runSubstitutions();
    }, false);
}

function runSubstitutions()
{
    for (let substitutionGroup of substitutionGroups) {
        if (substitutionGroup.class)
        {
            let elements = document.getElementsByClassName(substitutionGroup.class);
            for (let element of elements) {
                for (let substitution of substitutionGroup.substitutions) {
                    if (level > substitution.level) {
                        replaceInText(element, substitution.source, substitution.target);
                    }
                }
            }
        }
        if (substitutionGroup.id)
        {
            let element = document.getElementById(substitutionGroup.id);
            if (element)
            {
                for (let substitution of substitutionGroup.substitutions) {
                    if (level > substitution.level) {
                        replaceInText(element, substitution.source, substitution.target);
                    }
                }
            }
        }
    }
}
