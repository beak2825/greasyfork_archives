// ==UserScript==
// @namespace    https://tampermonkey.myso.kr/
// @name         네이버 블로그 검색결과 캡쳐도구
// @description  네이버 블로그에서 발행한 포스팅의 검색결과를 손쉽게 캡쳐하는 도구입니다.
// @copyright    2021, myso (https://tampermonkey.myso.kr)
// @license      Apache-2.0
// @version      1.0.11
// @author       Won Choi
// @connect      naver.com
// @match        *://blog.naver.com/PostList*
// @match        *://blog.naver.com/PostView*
// @match        *://search.naver.com/search*
// @match        *://m.search.naver.com/search*
// @grant        GM_openInTab
// @grant        GM_download
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/428657/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EB%B8%94%EB%A1%9C%EA%B7%B8%20%EA%B2%80%EC%83%89%EA%B2%B0%EA%B3%BC%20%EC%BA%A1%EC%B3%90%EB%8F%84%EA%B5%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/428657/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EB%B8%94%EB%A1%9C%EA%B7%B8%20%EA%B2%80%EC%83%89%EA%B2%B0%EA%B3%BC%20%EC%BA%A1%EC%B3%90%EB%8F%84%EA%B5%AC.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author myso
// ==/OpenUserJS==
async function inject_js(opt) {
    return new Promise((resolve, reject) => {
        var el = document.createElement('script'); el.type = 'text/javascript';
        function resolved() {
            el.parentNode.removeChild(el); resolve();
        }
        if(typeof opt === 'string') {
            el.onload = resolved; el.src = opt;
        }
        if(typeof opt === 'object') {
            el.onload = resolved; el.src = opt.src; el.integrity = opt.integrity;
            el.setAttribute('crossorigin', 'anonymous');
        }
        if(typeof opt === 'function') el.innerHTML = `(${opt})();`;
        if(el.src || el.innerHTML) {
            el.onerror = reject;
            document.head.prepend(el);
        }else reject();
        if(typeof opt === 'function') resolved();
    });
}
async function main_search() {
    if(window.name !== 'nblog_screenshot') return;
    document.title = '스크린샷 촬영 중입니다. 종료하지 말아주세요.';
    const uri = new URL(location.href), highlight = uri.searchParams.get('highlight'), query = uri.searchParams.get('query');
    const dst = new URL(highlight), logNo = dst.searchParams.get('logNo') || /^\/([a-z0-9\-\_\.]+)\/([\d]+)/.exec(dst.pathname)[2];
    GM_addStyle(`
            a[href*="${highlight}"],
            a[href*="logNo=${logNo}"] {
                display:block; position: relative;
            }
            a[href*="${highlight}"]:after,
            a[href*="logNo=${logNo}"]:after {
                content:''; position: absolute; z-index: 1; background: rgba(255, 0, 0, 0.3); border: 3px solid red; margin: auto; left: 0; top: 0; right: 0; bottom: 0;
            }
        `);
    async function screenshot() {
        screenshot.timer = clearTimeout(screenshot.timer);
        screenshot.timer = setTimeout(async () => {
            if(!document.querySelector('#naver-splugin-wrap, #wrap')) return screenshot();
            await inject_js(async function () { window.alert = function(){}; });
            await inject_js({ src: 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.js', integrity: 'sha256-c3RzsUWg+y2XljunEQS0LqWdQ04X1D3j22fd/8JCAKw=' });
            await inject_js(async function () {
                async function screenshot() { return new Promise((resolve)=>html2canvas(document.body, { allowTaint: false, onrendered: resolve })); }
                const canvas = await screenshot(), dataURL = canvas.toDataURL("image/png");
                const uri = new URL(location.href), query = uri.searchParams.get('query');
                const filename = `screenshot_${query}_${Date.now()}_${location.hostname}_${uri.searchParams.get('where') || 'all'}.png`
                window.close();
                window.opener.focus();
                window.opener.postMessage({ action:'screenshot.dataURL', dataURL, filename }, 'https://blog.naver.com');
            });
        }, 1000);
    }
    screenshot();
}
async function main_article() {
    window.addEventListener('message', (e)=>{
        const { action, dataURL, filename } = e.data;
        if(action === 'screenshot.dataURL') {
            GM_download(dataURL, filename);
        }
    });
    async function screenshot(url) {
        return new Promise((resolve)=>{
            const win = window.open(url, 'nblog_screenshot', 'width=640, height=1');
            (function delay() {
                screenshot.timer = clearTimeout(screenshot);
                screenshot.timer = setTimeout(() => {
                    if(!win.closed) return delay();
                    setTimeout(() => resolve(), 1000);
                }, 100);
            })();
        });
    }
    const wrappers = Array.from(document.querySelectorAll('[data-post-editor-version]'));
    wrappers.map((wrapper) => {
        const container = wrapper.querySelector('.lyr_overflow_menu');
        const target = wrapper.querySelector('.copyTargetUrl').value;
        const anchor = document.createElement('a'); anchor.href = '#';
        anchor.innerText = '상위노출 캡처';
        anchor.onclick = async function(e) {
            e.preventDefault();
            const query = prompt('검색 할 키워드를 입력하세요.'); if(!query) return;
            const uri_m = new URL('https://m.search.naver.com/search.naver?ie=UTF-8&sm=chr_hty');
            uri_m.searchParams.set('query', query); uri_m.searchParams.set('highlight', target);
            await screenshot(uri_m.toString());
            const uri_mv = new URL('https://m.search.naver.com/search.naver?ie=UTF-8&sm=chr_hty');
            uri_mv.searchParams.set('query', query); uri_mv.searchParams.set('highlight', target);
            uri_mv.searchParams.set('where', 'm_view');
            await screenshot(uri_mv.toString());
            const uri_d = new URL('https://search.naver.com/search.naver?ie=UTF-8&sm=chr_hty');
            uri_d.searchParams.set('query', query); uri_d.searchParams.set('highlight', target);
            await screenshot(uri_d.toString());
            const uri_dv = new URL('https://search.naver.com/search.naver?ie=UTF-8&sm=chr_hty');
            uri_dv.searchParams.set('query', query); uri_dv.searchParams.set('highlight', target);
            uri_dv.searchParams.set('where', 'post');
            await screenshot(uri_dv.toString());
        }
        container.prepend(anchor);
    });
}
async function main() {
    if(location.hostname.endsWith('search.naver.com')) { await main_search(); } else { await main_article(); }
}
function _requestIdleCallback(callback) {
    if(typeof requestIdleCallback == 'undefined') return setTimeout(callback, 1000);
    return requestIdleCallback(callback);
}
function checkForDOM() { return (document.head) ? main() : _requestIdleCallback(checkForDOM); }
_requestIdleCallback(checkForDOM);