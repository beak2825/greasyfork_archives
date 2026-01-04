// ==UserScript==
// @namespace    https://tampermonkey.myso.kr/
// @name         네이버 검색결과 지수 분석
// @description  네이버 검색결과에서 상대평가 지수를 확인할 수 있습니다.
// @copyright    2021, myso (https://tampermonkey.myso.kr)
// @license      Apache-2.0
// @version      1.0.16
// @author       Won Choi
// @connect      naver.com
// @match        *://search.naver.com/search.naver?*
// @match        *://m.search.naver.com/search.naver?*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-app.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-add-style.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-add-script.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-xmlhttp-request-async.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/donation.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/lib/naver-search-rx.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/lib/naver-search-nx.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/uuid/8.3.2/uuidv4.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.7.2/bluebird.min.js
// @downloadURL https://update.greasyfork.org/scripts/428686/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EA%B2%80%EC%83%89%EA%B2%B0%EA%B3%BC%20%EC%A7%80%EC%88%98%20%EB%B6%84%EC%84%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/428686/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EA%B2%80%EC%83%89%EA%B2%B0%EA%B3%BC%20%EC%A7%80%EC%88%98%20%EB%B6%84%EC%84%9D.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author myso
// ==/OpenUserJS==
async function observe(target) {
    const uri = new URL(location.href), query = uri.searchParams.get('query'); if(!query) return;
    const observer = new MutationObserver(async function(mutations) {
        let start = (30 * (Math.ceil(Math.max(0, target.children.length) / 30) - 1)) + 1;
        await update(query, start);
    });
    const config = { attributes: true, childList: true, characterData: true };
    observer.observe(target, config);
    await update(query);
}
async function update(keyword, start = 1) {
    const uri = new URL(location.href);
    const mode = uri.searchParams.get('mode');
    const where = 'view';
    const items = Array.from(document.querySelectorAll('[data-cr-gdid][data-cr-rank]'));
    const scores = await NX_score(keyword, start, where, mode);
    await Promise.map(items, async (item) => {
        const title = item.querySelector('.total_tit');
        const score = scores.find((o)=>o.crGdid == item.dataset.crGdid); Object.assign(item.dataset, score);
        if(score) delete item.dataset.crTitleScore;
        if(!score && !item.dataset.crTitleScore && title) {
            item.dataset.crTitleScore = true;
            const scores = await NX_score(title.textContent, 1, where, mode);
            const score = scores.find((o)=>o.crGdid == item.dataset.crGdid); Object.assign(item.dataset, score);
        }
    });
}
GM_App(async function main() {
    GM_donation('#container', 0);
    GM_addStyle(`
    :not([data-cr-area="rvw*o"])[data-cr-rank]::after { display: block; margin: 0px 15px 15px; padding: 0.5rem 1rem; font-size: 14px; color: #000; font-weight: bold;  border-radius: 8px; }
    :not([data-cr-area="rvw*o"])[data-cr-rank][data-cr-score-a][data-cr-score-b][data-cr-score-c]::after { background-color: #52565e; color: #fff; content: '전문성: ' attr(data-cr-score-a) ' / 신뢰성: ' attr(data-cr-score-b) ' / 관련성: ' attr(data-cr-score-c) }
    :not([data-cr-area="rvw*o"])[data-cr-rank][data-cr-score-a][data-cr-score-b][data-cr-score-c][data-cr-title-score]::after { content: '전문성: ' attr(data-cr-score-a) ' / 신뢰성: ' attr(data-cr-score-b) ' / 관련성: (알 수 없음)' }
    :not([data-cr-area="rvw*o"])[data-cr-rank]:not([data-cr-score-a])::after { background-color: #e4002b; color: #fff; content: '오류 : 분석 결과를 알 수 없음.'; }
    `);
    const wrp = document.querySelector('ul.lst_total'); if(wrp) observe(wrp);
})