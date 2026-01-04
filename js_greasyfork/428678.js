// ==UserScript==
// @namespace    https://tampermonkey.myso.kr/
// @name         네이버 블로그&포스트 글자수 세기
// @description  네이버 블로그&포스트에서 글자수 세기를 활성화합니다.
// @copyright    2021, myso (https://tampermonkey.myso.kr)
// @license      Apache-2.0
// @version      1.1.22
// @author       Won Choi
// @connect      naver.com
// @connect      pstatic.net
// @match        *://blog.naver.com/*/*
// @match        *://blog.naver.com/*/postwrite*
// @match        *://blog.naver.com/*Redirect=Write*
// @match        *://blog.naver.com/*Redirect=Update*
// @match        *://blog.naver.com/PostWriteForm*
// @match        *://blog.naver.com/PostUpdateForm*
// @match        *://blog.naver.com/PostView*
// @match        *://blog.naver.com/lib/smarteditor2/*/smart_editor2_inputarea.html
// @match        *://m.blog.naver.com/*/*
// @match        *://m.blog.naver.com/PostView*
// @match        *://blog.editor.naver.com/editor*
// @match        *://post.editor.naver.com/editor*
// @match        *://post.naver.com/viewer/postView*
// @match        *://m.post.editor.naver.com/editor*
// @match        *://m.post.naver.com/viewer/postView*
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-app.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-add-style.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-add-script.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/donation.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/lib/smart-editor-one.js
// @downloadURL https://update.greasyfork.org/scripts/428678/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EB%B8%94%EB%A1%9C%EA%B7%B8%ED%8F%AC%EC%8A%A4%ED%8A%B8%20%EA%B8%80%EC%9E%90%EC%88%98%20%EC%84%B8%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/428678/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EB%B8%94%EB%A1%9C%EA%B7%B8%ED%8F%AC%EC%8A%A4%ED%8A%B8%20%EA%B8%80%EC%9E%90%EC%88%98%20%EC%84%B8%EA%B8%B0.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author myso
// ==/OpenUserJS==
// ---------------------
GM_App(async function main() {
    GM_donation('#viewTypeSelector, #postListBody, #wrap_blog_rabbit, #writeTopArea, #editor_frame', 0);
    GM_addStyle(`
      head { display: block !important; }
      .se-utils > ul > li > button { margin-top: 14px !important; }
      .se-util-button[data-text]::after { content: attr(data-text); transition-property: opacity; transition-duration: .3s; transition-timing-function: cubic-bezier(.19,1,.22,1); position: absolute; top: 0; right: 100%; bottom: 0; height: 12px; margin: auto 10px auto 0; font-size: 12px; color: #00c73c; white-space: nowrap; opacity: 1; }
      .se-util-button[data-text]:hover::after { display: none; }
      .se-util-button-gamemode { border: 1px solid #f00 !important; }
      .se-util-button-gamemode.se-util-button-active { border: 1px solid #0f0 !important; }
      .se-util-button-gamemode::before { display: inline-block; width: 37px; height: 37px; line-height: 40px; text-align: center; font-size: 16px; color: #666; content: '\\1F579\\FE0F' !important; }
      .se-toast-popup.content-length { position: fixed; z-index: 52; bottom: 0; left: 0; right: 0; margin: auto; }
      .se-toast-popup.content-length .se-toast-popup-container { position: absolute; bottom: 90px; right: 0; left: 0; height: 0; margin: auto; text-align: center; font-size: 0; }
      .se-toast-popup.content-length .se-toast-popup-content { position: relative; display: inline-block; height: 39px; padding-left: 22px; padding-right: 22px; background-color: #fff; -webkit-box-sizing: border-box; box-sizing: border-box; border-radius: 2px; }
      .se-toast-popup.content-length .se-toast-popup-content.se-toast-popup-content-info { -webkit-box-shadow: 1px 1px 4px 0 rgba(63,144,223,.2); box-shadow: 1px 1px 4px 0 rgba(63,144,223,.2); border: 1px solid rgba(63,144,223,.5); }
      .se-toast-popup.content-length .se-toast-popup-message { display: inline-block; margin: 0; padding: 0; border: 0; height: 100%; font-family: se-nanumgothic,\\B098\B214\ACE0\B515,nanumgothic,sans-serif,Meiryo; font-size: 12px; vertical-align: middle; padding-top: 1px; -webkit-box-sizing: border-box; box-sizing: border-box; line-height:37px !important; }
      .se-toast-popup.content-length .se-toast-popup-content-info .se-toast-popup-message { color: #0e86fb; }
      .se-toast-popup.content-length[data-cps="0"]   .se-toast-popup-content { zoom: 1.00; }
      .se-toast-popup.content-length[data-cps="100"] .se-toast-popup-content { zoom: 1.05; }
      .se-toast-popup.content-length[data-cps="200"] .se-toast-popup-content { zoom: 1.10; }
      .se-toast-popup.content-length[data-cps="300"] .se-toast-popup-content { zoom: 1.15; }
      .se-toast-popup.content-length[data-cps="400"] .se-toast-popup-content { zoom: 1.20; }
      .se-toast-popup.content-length[data-cps="500"] .se-toast-popup-content { zoom: 1.25; }
      .se-toast-popup.content-length[data-cps="600"] .se-toast-popup-content { zoom: 1.30; }
      .se-toast-popup.content-length[data-cps="700"] .se-toast-popup-content { zoom: 1.35; }
      .se-toast-popup.content-length[data-cps="800"] .se-toast-popup-content { zoom: 1.40; }
      .se-toast-popup.content-length[data-cps="900"] .se-toast-popup-content { zoom: 1.45; }
      @keyframes rise { from { opacity: 0; transform: translateY(0) scale(1); } 25% { opacity: 1; } to { opacity: 0; transform: translateY(-10em) scale(0); } }
      .se-fires { font-size: 24px; filter: blur(0.02em); margin: 3em auto 0 auto; width: 8em; height: 12em; position: fixed; left: 0; bottom: 0; pointer-events: none; }
      .se-fires::after { display: none;  position: absolute; margin: auto; left: 0; top: auto; right: 0; bottom: 2.5em; height: 2em; line-height: 2em; text-align: center; z-index: 1; font-weight: bold; color: #000; -webkit-text-fill-color: white; -webkit-text-stroke-width: 1px; -webkit-text-stroke-color: black; }
      .se-fires-flare { display: none; animation: rise 1s ease-in infinite; border-radius: 50%; mix-blend-mode: screen; opacity: 0; position: absolute; bottom: 0; width: 5em; height: 5em; }
      .blog_editor[data-cps="50"] .se-fires::after { display: block; content: '하수' }
      .blog_editor[data-cps="50"] .se-fires-flare { display: block; background-image: radial-gradient(rgb(253,216,67) 20%,rgba(253,216,67,0) 70%); }
      .blog_editor[data-cps="100"] .se-fires::after { display: block; content: '평민' }
      .blog_editor[data-cps="100"] .se-fires-flare { display: block; background-image: radial-gradient(rgb(255,185,0) 20%,rgba(255,185,0,0) 70%); }
      .blog_editor[data-cps="150"] .se-fires::after { display: block; content: '시민' }
      .blog_editor[data-cps="150"] .se-fires-flare { display: block; background-image: radial-gradient(rgb(251,147,0) 20%,rgba(251,147,0,0) 70%); }
      .blog_editor[data-cps="200"] .se-fires::after { display: block; content: '초수' }
      .blog_editor[data-cps="200"] .se-fires-flare { display: block; background-image: radial-gradient(rgb(118,216,38) 20%,rgba(118,216,38,0) 70%); }
      .blog_editor[data-cps="250"] .se-fires::after { display: block; content: '중수' }
      .blog_editor[data-cps="250"] .se-fires-flare { display: block; background-image: radial-gradient(rgb(70,205,20) 20%,rgba(70,205,20,0) 70%); }
      .blog_editor[data-cps="300"] .se-fires::after { display: block; content: '고수' }
      .blog_editor[data-cps="300"] .se-fires-flare { display: block; background-image: radial-gradient(rgb(47,174,0) 20%,rgba(47,174,0,0) 70%); }
      .blog_editor[data-cps="350"] .se-fires::after { display: block; content: '영웅' }
      .blog_editor[data-cps="350"] .se-fires-flare { display: block; background-image: radial-gradient(rgb(93,167,248) 20%,rgba(93,167,248,0) 70%); }
      .blog_editor[data-cps="400"] .se-fires::after { display: block; content: '지존' }
      .blog_editor[data-cps="400"] .se-fires-flare { display: block; background-image: radial-gradient(rgb(27,127,237) 20%,rgba(27,127,237,0) 70%); }
      .blog_editor[data-cps="450"] .se-fires::after { display: block; content: '초인' }
      .blog_editor[data-cps="450"] .se-fires-flare { display: block; background-image: radial-gradient(rgb(23,95,231) 20%,rgba(23,95,231,0) 70%); }
      .blog_editor[data-cps="500"] .se-fires::after { display: block; content: '식물신' }
      .blog_editor[data-cps="500"] .se-fires-flare { display: block; background-image: radial-gradient(rgb(49,205,163) 20%,rgba(49,205,163,0) 70%); }
      .blog_editor[data-cps="550"] .se-fires::after { display: block; content: '바람신' }
      .blog_editor[data-cps="550"] .se-fires-flare { display: block; background-image: radial-gradient(rgb(44,201,220) 20%,rgba(44,201,220,0) 70%); }
      .blog_editor[data-cps="600"] .se-fires::after { display: block; content: '물신' }
      .blog_editor[data-cps="600"] .se-fires-flare { display: block; background-image: radial-gradient(rgb(8,164,200) 20%,rgba(8,164,200,0) 70%); }
      .blog_editor[data-cps="650"] .se-fires::after { display: block; content: '달신' }
      .blog_editor[data-cps="650"] .se-fires-flare { display: block; background-image: radial-gradient(rgb(244,160,88) 20%,rgba(244,160,88,0) 70%); }
      .blog_editor[data-cps="700"] .se-fires::after { display: block; content: '별신' }
      .blog_editor[data-cps="700"] .se-fires-flare { display: block; background-image: radial-gradient(rgb(231,120,73) 20%,rgba(231,120,73,0) 70%); }
      .blog_editor[data-cps="750"] .se-fires::after { display: block; content: '태양신' }
      .blog_editor[data-cps="750"] .se-fires-flare { display: block; background-image: radial-gradient(rgb(238,90,41) 20%,rgba(238,90,41,0) 70%); }
      .blog_editor[data-cps="800"] .se-fires::after { display: block; content: '은하신' }
      .blog_editor[data-cps="800"] .se-fires-flare { display: block; background-image: radial-gradient(rgb(174,132,235) 20%,rgba(174,132,235,0) 70%); }
      .blog_editor[data-cps="850"] .se-fires::after { display: block; content: '우주신' }
      .blog_editor[data-cps="850"] .se-fires-flare { display: block; background-image: radial-gradient(rgb(129,101,244) 20%,rgba(129,101,244,0) 70%); }
      .blog_editor[data-cps="900"] .se-fires::after { display: block; content: '수호신' }
      .blog_editor[data-cps="900"] .se-fires-flare { display: block; background-image: radial-gradient(rgb(106,49,255) 20%,rgba(106,49,255,0) 70%); }
      .blog_editor[data-cps="950"] .se-fires::after { display: block; content: '절대신' }
      .blog_editor[data-cps="950"] .se-fires-flare { display: block; background-image: radial-gradient(rgb(66,0,235) 20%,rgba(66,0,235,0) 70%); }
      @keyframes gamemode2 { from { opacity: 1; transform: translateY(0) scale(1) rotate(0); } to { opacity: 0; transform: translateY(-10em) scale(0) rotate(360deg); } }
      .apply-gamemode2 { animation: rise 2s ease-in; animation-fill-mode: forwards; }
    `);
    function gamemode(type = 'gamemode', label = '포스팅 게임', callback) {
        let enabled = gamemode[type] = gamemode[type] || false;
        const mnu = document.querySelector('.se-ultils-list'); if(!mnu) return;
        const wrp = mnu.querySelector(`.se-utils-item.se-utils-item-${type}`) || document.createElement('li'); if(wrp.className) return;
        wrp.classList.add('se-utils-item', `se-utils-item-${type}`); mnu.append(wrp);
        const btn = wrp.querySelector('button') || document.createElement('button'); btn.classList.add('se-util-button', 'se-util-button-gamemode'); btn.innerHTML = `<span class="se-utils-text">${label}</span>`; wrp.append(btn);
        btn.onclick = () => {
            btn.classList.toggle('se-util-button-active', enabled = !enabled);
            if(callback) callback(enabled, (state)=>btn.classList.toggle('se-util-button-active', enabled=!!state), btn);
        }
    }
    function handler(e) {
        // 글자수 세기
        const se_editor = document.querySelector('.blog_editor');
        const se = SE_parse(document); if(!se || !se.content) return;
        const container = document.querySelector('head');
        const se_toast_popup = container.querySelector('.se-toast-popup.content-length') || document.createElement('div');
        const se_toast_popup_container = se_toast_popup.querySelector('.se-toast-popup-container') || document.createElement('div');
        const se_toast_popup_content = se_toast_popup_container.querySelector('.se-toast-popup-content') || document.createElement('div');
        const se_toast_popup_message = se_toast_popup_content.querySelector('.se-toast-popup-message') || document.createElement('p');
        if(!se_toast_popup.className) { se_toast_popup.className = 'se-toast-popup se-toast-interaction-enter content-length'; container.append(se_toast_popup); }
        if(!se_toast_popup_container.className) { se_toast_popup_container.className = 'se-toast-popup-container'; se_toast_popup.append(se_toast_popup_container); }
        if(!se_toast_popup_content.className) { se_toast_popup_content.className = 'se-toast-popup-content se-toast-popup-content-info'; se_toast_popup_container.append(se_toast_popup_content); }
        if(!se_toast_popup_message.className) { se_toast_popup_message.className = 'se-toast-popup-message'; se_toast_popup_message.setAttribute('role', 'alert'); se_toast_popup_content.append(se_toast_popup_message); }
        // 타자수 세기
        const timestamp = Date.now();
        handler.tps = handler.tps || 0;
        handler.cps = handler.cps || 0;
        handler.history = handler.history || [];
        if(e && e.type == 'keyup') {
            handler.tps++;
            handler.history = handler.history.filter((o)=>o.timestamp >= (timestamp - 60000));
            handler.history.push({ timestamp, tps: handler.tps });
            const head = handler.history[0], tail = handler.history[handler.history.length - 1];
            handler.cps = ((head && tail) ? (tail.tps - head.tps) : 0);
        }
        if(!se_editor) {
            se_toast_popup_message.innerText = `글자수 : ${se.contentLength}자 (공백제외: ${se.contentLengthTrim}자)`;
        } else {
            se_editor.dataset.cps = Math.min(Math.floor(handler.cps / 50) * 50, 950);
            se_toast_popup.dataset.cps = Math.min(Math.floor(handler.cps / 100) * 100, 900);
            se_toast_popup_message.innerText = `글자수 : ${se.contentLength}자 (공백제외: ${se.contentLengthTrim}자), 타자수 : ${handler.cps}회/분`;
            gamemode('gamemode1', '게임모드Ⅰ', (enabled) => {
                let se_fires = se_editor.querySelector('.se-fires');
                if(enabled && !se_fires) {
                    se_fires = document.createElement('div');
                    se_fires.className = 'se-fires';
                    Array(50).fill(null).map((v, i, a)=>{
                        const se_flare = document.createElement('div');
                        se_flare.className = 'se-fires-flare';
                        se_flare.style.animationDelay = `${2 * Math.random()}s`;
                        se_flare.style.left = `calc((100% - 5em) * ${i/a.length})`;
                        se_fires.append(se_flare);
                    });
                    se_editor.append(se_fires);
                } else {
                    se_fires.remove();
                }
            });
            gamemode('gamemode2', '게임모드Ⅱ', (enabled, state, element) => {
                const gametime = 1000 * 60 * 30;
                function pause(notice) {
                    window.datetime2 = null;
                    window.gamemode2 = clearTimeout(window.gamemode2);
                    Array.from(document.querySelectorAll('.apply-gamemode2')).map(el=>el.classList.remove('apply-gamemode2'));
                    alert(notice || '30분 타임어택 게임을 포기하였습니다.');
                    state(false);
                    delete element.dataset.text;
                }
                function start() {
                    window.datetime2 = window.datetime2 || Date.now();
                    window.gamemode2 = clearTimeout(window.gamemode2);
                    window.gamemode2 = setTimeout(() => {
                        const diffs = window.datetime2 + gametime - Date.now(); element.dataset.text = `[타임어택] ${(diffs / 1000 / 60).toFixed(2)}분 남음`;
                        const items = Array.from(document.querySelectorAll('.se-module:not(.apply-gamemode2)'));
                        if(diffs <= 3000 + (150 * items.length)) {
                            const index = Math.floor(Math.random() * items.length);
                            const item = items[index]; if(item) { item.classList.add('apply-gamemode2'); }
                        }
                        if(diffs <= 0) {
                            pause('30분 타임어택 게임을 실패하였습니다.');
                        } else { start(); }
                    }, 150);
                }
                if(enabled && confirm('30분 타임어택 게임을 시작합니다.\n30분에 가까워질수록 구성요소들이 사라지는 효과가 적용됩니다.\n게임을 포기하거나 실패하면 글이 원래대로 복원됩니다.')) { start(); } else { pause(); }
            });
        }
    }
    window.addEventListener('keyup', handler, false);
    window.addEventListener('keydown', handler, false);
    window.addEventListener('keypress', handler, false);
    window.addEventListener('click', handler, false);
    handler();
});