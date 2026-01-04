// ==UserScript==
// @namespace    https://tampermonkey.myso.kr/
// @name         네이버 블로그 동영상 다운로더
// @description  네이버 블로그 동영상 다운로드 기능을 활성화됩니다.
// @copyright    2021, myso (https://tampermonkey.myso.kr)
// @license      Apache-2.0
// @version      1.1.7
// @author       Won Choi
// @connect      naver.com
// @match        *://blog.naver.com/PostView*
// @match        *://blog.naver.com/PostList*
// @match        *://serviceapi.nmv.naver.com/flash/convertIframeTag*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-app.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-add-style.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-add-script.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/donation.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/toastify-js/1.11.0/toastify.min.js
// @downloadURL https://update.greasyfork.org/scripts/428675/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EB%B8%94%EB%A1%9C%EA%B7%B8%20%EB%8F%99%EC%98%81%EC%83%81%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%8D%94.user.js
// @updateURL https://update.greasyfork.org/scripts/428675/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EB%B8%94%EB%A1%9C%EA%B7%B8%20%EB%8F%99%EC%98%81%EC%83%81%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%8D%94.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author myso
// ==/OpenUserJS==
async function inject_xhr() {
    const XHR = XMLHttpRequest.prototype, send = XHR.send, open = XHR.open;
    XHR.open = function(method, url) { this.url = url; return open.apply(this, arguments); }
    XHR.send = function() {
        this.addEventListener('load', () => {
            var detail_keys = ['url', 'readyState', 'response', 'responseText', 'responseType', 'responseURL', 'responseXML', 'status', 'statusText', 'timeout', 'withCredentials'];
            var detail = detail_keys.reduce((r, o)=>(r[o] = this[o], r), {});
            var event = new CustomEvent('xhrload', { detail });
            window.dispatchEvent(event);
        });
        //this.addEventListener('error', () => alert(`${this.status} 에러\n네이버에서 통신오류가 발생하였습니다 잠시 후 다시 시도해주세요.`));
        send.apply(this, arguments);
    };
};
GM_App(async function main() {
    GM_donation('#viewTypeSelector, #postListBody, #wrap_blog_rabbit, #writeTopArea, #editor_frame', 0);
    GM_addStyle("@import url('https://cdnjs.cloudflare.com/ajax/libs/toastify-js/1.11.0/toastify.min.css')");
    inject_xhr();
    window.addEventListener('xhrload', (e) => {
        const { url, response } = e.detail;
        if(url.includes('https://apis.naver.com/rmcnmv/rmcnmv/vod/play/v2.0/')){
            const info = JSON.parse(response);
            const title = info.meta.subject;
            const video = info.videos.list.reduce((r, o)=>r.size < o.size ? o : r, { size: 0 });
            const toast = Toastify({
                duration: 1000 * 60,
                text: `${title}\n첨부 영상이 발견 됨 (새 창으로 열기)`,
                onClick: () => window.open(video.source),
            }).showToast();
        }
    }, false);
    if(typeof loadUGCPlayer !== 'undefined') loadUGCPlayer();
})