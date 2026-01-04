// ==UserScript==
// @namespace    https://tampermonkey.myso.kr/
// @name         스마트에디터ONE 보이스 입력기
// @description  네이버 블로그 스마트에디터ONE에서 마이크를 이용해 글을 쓸 수 있게 됩니다.
// @copyright    2021, myso (https://tampermonkey.myso.kr)
// @license      Apache-2.0
// @version      1.0.5
// @author       Won Choi
// @connect      naver.com
// @connect      pstatic.net
// @match        *://blog.naver.com/*/postwrite*
// @match        *://blog.naver.com/*Redirect=Write*
// @match        *://blog.naver.com/*Redirect=Update*
// @match        *://blog.naver.com/PostWriteForm*
// @match        *://blog.naver.com/PostUpdateForm*
// @match        *://blog.editor.naver.com/editor*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/polyfill/Object.fromEntries.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-app.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-add-style.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-add-script.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-xmlhttp-request-async.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/donation.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/lib/naver-blog.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/uuid/8.3.2/uuidv4.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.7.2/bluebird.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js
// @downloadURL https://update.greasyfork.org/scripts/428676/%EC%8A%A4%EB%A7%88%ED%8A%B8%EC%97%90%EB%94%94%ED%84%B0ONE%20%EB%B3%B4%EC%9D%B4%EC%8A%A4%20%EC%9E%85%EB%A0%A5%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/428676/%EC%8A%A4%EB%A7%88%ED%8A%B8%EC%97%90%EB%94%94%ED%84%B0ONE%20%EB%B3%B4%EC%9D%B4%EC%8A%A4%20%EC%9E%85%EB%A0%A5%EA%B8%B0.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author myso
// ==/OpenUserJS==
GM_App(async function main() {
    GM_donation('#viewTypeSelector, #postListBody, #wrap_blog_rabbit, #writeTopArea, #editor_frame', 0);
    GM_addStyle(`
    .se-utils > ul > li > button { margin-top: 14px !important; }
    .se-util-button-voice.se-util-button-active { border: 1px solid #0f0 !important; }
    .se-util-button-voice::before { display: inline-block; width: 37px; height: 37px; line-height: 40px; text-align: center; font-size: 16px; color: #666; content: '\\1F399\\FE0F' !important; }
    .se-utils-item-voice-loading .se-util-button-voice::before { animation: spin1 2s infinite linear; }
    .se-utils-item-voice[data-process-keyword-info]::after {
      display: none; position: absolute; z-index: -1; margin:auto; right: 20px; top: -240px; bottom: 0px; margin-bottom: 10px;
      padding: 15px; width: 300px; height: auto; overflow-y: auto; white-space: pre-line;
      border: 1px solid #ddd; border-radius: 8px; background-color: #fff;
      content: attr(data-process-keyword-info); line-height: 1.5rem;
    }
    .se-utils-item-voice[data-process-keyword-info]:hover::after { display: block; }
    `);
    const uri = new URL(location.href), params = Object.fromEntries(uri.searchParams.entries());
    const user = await NB_blogInfo('', 'BlogUserInfo'); if(!user) return;
    const blog = await NB_blogInfo(user.userId, 'BlogInfo'); if(!blog) return;
    function toggle() {
        if(toggle.flag = !toggle.flag) {
            GM_addScript(async () => {
                const btn = document.querySelector('.se-util-button-voice');
                const se = window.SmartEditor && await window.SmartEditor._editorPromise; if(!se) return;
                const recognition = window.__recognition || new webkitSpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.lang="ko-KR";
                recognition.start();
                recognition.onresult = async (event) => {
                    window.__transcript_reset = clearTimeout(window.__transcript_reset);
                    window.__transcript_timer = clearTimeout(window.__transcript_timer);
                    const transcript = Array.from(event.results).reduce((output, data) => {
                        if(!data.isFinal) se.toastInfo(data[0]['transcript']);
                        return (data.isFinal ? data[0]['transcript'].trim() : null) || output;
                    }, null);
                    if(transcript && window.__transcript_lasts !== transcript && (window.__transcript_lasts = transcript)) {
                        window.__transcript_reset = setTimeout(()=>(recognition.stop(), btn && btn.classList.remove('se-util-button-active')), 30000);
                        window.__transcript_timer = setTimeout(()=>se._editingService.lineBreak(), 3000);
                        se._editingService.writeTextWithSoftLineBreak(`${window.__transcript_lasts}  `);
                        se._editingService.erase();
                    }
                };
                recognition.onerror = async (event) => console.error(event);
                window.__recognition = recognition;
                if(btn) btn.classList.toggle('se-util-button-active', true);
            });
        } else {
            GM_addScript(() => {
                const btn = document.querySelector('.se-util-button-voice');
                const recognition = window.__recognition;
                if(recognition) recognition.stop();
                if(btn) btn.classList.toggle('se-util-button-active', false);
            });
        }
        return toggle.flag;
    }
    async function handler(e) {
        const mnu = document.querySelector('.se-ultils-list'); if(!mnu) return;
        const wrp = mnu.querySelector('.se-utils-item.se-utils-item-voice') || document.createElement('li'); wrp.classList.add('se-utils-item', 'se-utils-item-voice'); mnu.prepend(wrp);
        const btn = wrp.querySelector('button') || document.createElement('button'); btn.classList.add('se-util-button', 'se-util-button-voice'); btn.innerHTML = '<span class="se-utils-text">보이스 입력</span>'; wrp.append(btn);
        btn.onclick = GM_donationApp(()=>toggle());
    }
    window.addEventListener('keyup', handler, false);
    window.addEventListener('keydown', handler, false);
    window.addEventListener('keypress', handler, false);
    handler();
});