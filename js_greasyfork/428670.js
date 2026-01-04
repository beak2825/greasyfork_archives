// ==UserScript==
// @namespace    https://tampermonkey.myso.kr/
// @name         네이버 블로그 모바일 메인 노출 모니터링
// @description  네이버 모바일 메인에서 유입될 수 있는 내 블로그의 글들의 노출된 현황을 모니터링 할 수 있습니다.
// @copyright    2021, myso (https://tampermonkey.myso.kr)
// @license      Apache-2.0
// @version      1.0.5
// @author       Won Choi
// @connect      naver.com
// @match        *://blog.naver.com/prologue/PrologueList*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/polyfill/Object.fromEntries.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-app.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-add-style.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-add-script.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-xmlhttp-request-async.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-xmlhttp-request-cors.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/donation.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/lib/naver-main.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/lib/naver-blog.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.7.2/bluebird.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/toastify-js/1.11.0/toastify.min.js
// @downloadURL https://update.greasyfork.org/scripts/428670/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EB%B8%94%EB%A1%9C%EA%B7%B8%20%EB%AA%A8%EB%B0%94%EC%9D%BC%20%EB%A9%94%EC%9D%B8%20%EB%85%B8%EC%B6%9C%20%EB%AA%A8%EB%8B%88%ED%84%B0%EB%A7%81.user.js
// @updateURL https://update.greasyfork.org/scripts/428670/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EB%B8%94%EB%A1%9C%EA%B7%B8%20%EB%AA%A8%EB%B0%94%EC%9D%BC%20%EB%A9%94%EC%9D%B8%20%EB%85%B8%EC%B6%9C%20%EB%AA%A8%EB%8B%88%ED%84%B0%EB%A7%81.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author myso
// ==/OpenUserJS==
GM_App(async function main() {
    GM_donation('#post-area', 0);
    GM_addStyle("@import url('https://cdnjs.cloudflare.com/ajax/libs/toastify-js/1.11.0/toastify.min.css')");
    const uri = new URL(location.href), params = Object.fromEntries(uri.searchParams.entries());
    const blogId = params.blogId; if(!blogId) return;
    (async function repeat() {
        Toastify({ text: `메인노출 데이터 가져오는 중...`, }).showToast();
        const items = await NM_searchAll();
        const finds = items.filter(o=>o.url.includes('blog.naver.com') && o.url.includes(`/${blogId}/`));
        if(finds.length) {
            finds.map((item)=>Toastify({ text: `[메인노출:${item.label}] ${item.url}`, duration: 15000, onClick: ()=>window.open(item.url) }).showToast());
        } else {
            Toastify({ text: `메인노출 데이터 없음`, }).showToast();
        }
        Toastify({ text: `5분 뒤 메인노출 데이터를 새로 가져옵니다...`, }).showToast();
        setTimeout(repeat, 1000 * 60 * 5);
    })();
});