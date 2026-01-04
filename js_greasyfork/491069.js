// ==UserScript==
// @name         青书学堂自动答题
// @version      1.0.3
// @description  青书学堂作业答案自动填入，解放双手。
// @author       AIScripter
// @match        *://*.qingshuxuetang.com/*
// @icon         https://degree.qingshuxuetang.com/resources/default/images/favicon.ico
// @require      https://unpkg.com/pxmu@1.1.0/dist/web/pxmu.min.js
// @require      https://lib.baomitu.com/lodash.js/latest/lodash.min.js
// @run-at       document-body
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/278051
// @downloadURL https://update.greasyfork.org/scripts/491069/%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/491069/%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function () {
    'use strict'

    // 考试页面解除复制
    if (location.href.indexOf('ExamPaper') !== -1) {
        $('*').unbind('copy');
        return;
    }

    // 做作业
    if (location.href.indexOf('ExercisePaper') !== -1) {
        listenSource([
            {
                fn: () => $('.question-detail-options .question-detail-option').length,
                callback: autoFillAnswer
            },
        ]);
        return;
    }
})();

// url参数转换为对象
function UrlSearch() {
    const url = new URL(location.href);
    const params = {};

    // 处理查询字符串参数
    const search = url.search.replace('?', '');
    const searchParams = search.split('&');
    searchParams.forEach(item => {
        const [key, value] = item.split('=');
        params[key] = value;
    });

    // 处理路径参数
    const pathParts = url.pathname.split('/').filter(part => part !== '');
    params.pathParts = pathParts;

    return params;
}

function listenSource(listen = []) {

    function setup() {
        listen.forEach((item, index) => {
            const {fn, callback} = item;

            if (fn()) {
                callback();
                listen.splice(index, 1);
            }
        });

        if (listen.length) {
            requestAnimationFrame(setup);
        }
    }

    if (listen.length) {
        requestAnimationFrame(setup);
    }
}

window.Manager = {
    search: UrlSearch(), // url参数
};

// 答案自动填入
function autoFillAnswer() {
    var urlSearch = UrlSearch();

    fetch(`https://degree.qingshuxuetang.com/${urlSearch.pathParts[0]}/Student/DetailData?_t=${new Date().getMilliseconds()}&quizId=${urlSearch.quizId}`, {
        method: 'GET', headers: {
            Host: 'degree.qingshuxuetang.com',
            Cookie: Object.entries(Cookies.get()).map(([key, value]) => `${key}=${value}`).join('; '),
            Referer: `https://degree.qingshuxuetang.com/${urlSearch.pathParts[0]}/Student/ExercisePaper?courseId=${urlSearch.courseId}&quizId=${urlSearch.quizId}&teachPlanId=${urlSearch.teachPlanId}&periodId=${urlSearch.periodId}`,
            'sec-ch-ua': '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': 'macOS',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
            'X-Requested-With': 'XMLHttpRequest',
        },
    }).then(res => res.json()).then(res => {
        var questions = res.data.paperDetail.questions;

        Object.values(questions).forEach(item => {
            // 处理单选/多选 答案填入
            for (let i = 0; i < item.solution.length; i++) {
                $(`#${item.questionId}_${item.solution.charAt(i)}`).click();
            }
        });

        pxmu.success({
            msg: '答案已自动填入', bg: '#4CC443',
        });
    }).catch(err => {
        pxmu.fail({
            msg: '答案填入失败。', bg: 'red',
        });
        console.error(err);
    });
}
