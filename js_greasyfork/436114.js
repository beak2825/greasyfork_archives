// ==UserScript==
// @name         BOJ Practice Time Setting
// @namespace    http://www.acmicpc.net
// @version      0.1
// @license MIT
// @description  BOJ 연습 편집에서 '시작 시간'을 클릭하면 현재 시간으로, '종료 시간'을 클릭하면 최대 시간(시작 시간 + 14일 - 1분)으로 설정해 줍니다.
// @author       cgiosy
// @match        https://www.acmicpc.net/group/practice/edit/*
// @match        https://www.acmicpc.net/group/practice/create/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436114/BOJ%20Practice%20Time%20Setting.user.js
// @updateURL https://update.greasyfork.org/scripts/436114/BOJ%20Practice%20Time%20Setting.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const getLocalDate = (date, minutes) => {
        return new Date(date.getTime() + ((-date.getTimezoneOffset() + (minutes || 0)) * 60) * 1000);
    };
    const getLocalDateString = (date, minutes) => {
        return getLocalDate(date, minutes).toISOString().replace('T', ' ').slice(0, 16);
    };

    const practiceStart = document.querySelector('input[name=practice_start]');
    const practiceEnd = document.querySelector('input[name=practice_end]');
    const practiceProblems = document.querySelector('input[name=problem_id]');

    const setPracticeStartTimeToNow = () => {
        practiceStart.value = getLocalDateString(new Date());
        update_datetime_diff();
    };
    const maximizePracticeEndTime = () => {
        practiceEnd.value = getLocalDateString(new Date(practiceStart.value), 60 * 24 * 14 - 1);
        update_datetime_diff();
    };
    const addPracticeProblems = () => {
        practiceProblems.value.split(/\s+/).forEach((problemId) => {
            problem_add(problemId);
        });
    };

    document.querySelector('label[for=practice_start]').onclick = setPracticeStartTimeToNow;
    document.querySelector('label[for=practice_end]').onclick = maximizePracticeEndTime;
    document.querySelector('label[for=problem_id]').onclick = addPracticeProblems;
})();