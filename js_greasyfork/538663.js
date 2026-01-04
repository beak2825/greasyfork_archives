// ==UserScript==
// @name             디시인사이드 갤스코프2
// @name:ko          디시인사이드 갤스코프2
// @namespace        https://gallog.dcinside.com/appetite8514
// @author           우왁굳(유튜버) 마이너 갤러리
// @version          1.5.8-release
// @description      디시인사이드 게시글 본문 페이지에서 작성자의 최근 글 목록을 플로팅 UI로 보여주고, 다른 유저의 활동도 분석합니다.
// @description:ko   디시인사이드 게시글 본문 페이지에서 작성자의 최근 글 목록을 플로팅 UI로 보여주고, 다른 유저의 활동도 분석합니다.
// @match            https://gall.dcinside.com/*/board/view*
// @match            https://gall.dcinside.com/board/view*
// @grant            GM_xmlhttpRequest
// @grant            GM_setValue
// @grant            GM_getValue
// @grant            GM_deleteValue
// @grant            GM_registerMenuCommand
// @icon             https://i.imgur.com/JPUBQQd.png
// @run-at           document-end
// @license          MIT
// @downloadURL https://update.greasyfork.org/scripts/538663/%EB%94%94%EC%8B%9C%EC%9D%B8%EC%82%AC%EC%9D%B4%EB%93%9C%20%EA%B0%A4%EC%8A%A4%EC%BD%94%ED%94%842.user.js
// @updateURL https://update.greasyfork.org/scripts/538663/%EB%94%94%EC%8B%9C%EC%9D%B8%EC%82%AC%EC%9D%B4%EB%93%9C%20%EA%B0%A4%EC%8A%A4%EC%BD%94%ED%94%842.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const CONFIG = {
        DEBUG_MODE: false,
        WRITER_INFO_SELECTOR: '.gallview_head .gall_writer.ub-writer[data-nick]',
        POST_ROW_SELECTOR: 'tr.ub-content',
        POST_TITLE_SELECTOR: 'td.gall_tit.ub-word > a:first-child',
        POST_WRITER_SELECTOR: 'td.gall_writer.ub-writer',
        POST_DATE_SELECTOR: 'td.gall_date',
        BOX_ID: 'userscope-floating-box',
        BOX_POSITION_ID: 'userscopeBoxPosition_v2',
        MODAL_ID: 'userscope-scope-modal',
        STYLE_ID: 'userscope-styles',
        USER_SEARCH_CONTAINER_ID: 'userscopeUserSearchContainer',
        ICON_URL: 'https://i.imgur.com/JPUBQQd.png',
        MAX_PAGES_TO_ANALYZE: 200,
        FETCH_TIMEOUT_MS: 10000,
        MULTI_PAGE_FETCH_CHUNK_SIZE: 5,
        MULTI_PAGE_FETCH_CHUNK_DELAY: 200,
        SCOPE_EXTENSION_MENU_ITEM_CLASS: 'userscope-scope-extension-li',
        SCOPE_EXTENSION_MENU_ITEM_TEXT: '집중 스코프',
        USER_POPUP_UL_SELECTOR: '.user_data_list',
        GEMINI_API_KEY_ID: 'GEMINI_API_KEY_DCIMON_V2',
        GEMINI_MODEL_ID: 'GEMINI_MODEL_DCIMON_V1',
        DEFAULT_GEMINI_MODEL: 'gemini-2.0-flash',
        AVAILABLE_GEMINI_MODELS: [ 'gemini-2.0-flash', 'gemini-1.5-flash-latest', 'gemini-2.5-flash', 'gemini-2.5-flash-lite-preview-06-17' ],
        AI_ANALYSIS_MODAL_ID: 'userscope-ai-analysis-modal',
        AI_ANALYSIS_BUTTON_ID: 'userscope-ai-analyze-btn',
        TOGGLE_BUTTON_ID: 'userscope-toggle-btn',
        BOX_VISIBILITY_ID: 'userscopeBoxVisibility_v2',
        TOGGLE_BUTTON_POSITION_ID: 'userscopeToggleButtonPosition_v1',
        SETTINGS_MODAL_ID: 'userscope-settings-modal',
    };

    class ApiClient {
        #config; #log;
        constructor(config, log) { this.#config = config; this.#log = log || (() => {}); }
        fetchGeminiAPI(prompt, model, apiKey) {
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
            const payload = { contents: [{ parts: [{ text: prompt }] }], safetySettings: [{ category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" }, { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" }, { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" }, { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }] };
            this.#log('Gemini API 요청 전송:', { model });
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "POST", url: apiUrl, headers: { "Content-Type": "application/json" }, data: JSON.stringify(payload),
                    onload: response => {
                        try { const parsed = JSON.parse(response.responseText); this.#log('API 응답 성공:', parsed); resolve(parsed); }
                        catch (e) { this.#log('API 응답 JSON 파싱 실패:', e); reject({ error: { message: "API 응답을 파싱하는 데 실패했습니다." } }); }
                    },
                    onerror: error => { this.#log('API 네트워크 오류:', error); reject({ error: { message: "네트워크 요청에 실패했습니다." } }); },
                    ontimeout: () => { this.#log('API 요청 시간 초과'); reject({ error: { message: "API 요청 시간이 초과되었습니다." } }); }
                });
            });
        }
    }

    class DataExtractor {
        #config; #log;
        constructor(config, log) { this.#config = config; this.#log = log || (() => {}); }
        getWriterInfo(tr) {
            const writerTd = tr.querySelector(this.#config.POST_WRITER_SELECTOR);
            if (!writerTd) {
                this.#log("[getWriterInfo] 실패: writerTd (td.gall_writer.ub-writer) 요소를 찾을 수 없음. TR HTML:", tr.outerHTML.substring(0, 300));
                return { key: null, name: "알수없음" };
            }
            const ip = writerTd.dataset.ip?.trim();
            const uid = writerTd.dataset.uid?.trim();
            const nick = writerTd.querySelector(".nickname em")?.textContent.trim() || writerTd.querySelector(".nickname")?.textContent.trim();
            const key = uid ? `id:${uid}` : (ip ? `ip:${ip}` : null);
            if (!key) this.#log("[getWriterInfo] 경고: 유효한 식별자(uid/ip)를 찾을 수 없음. Nick:", nick, "TR HTML:", tr.outerHTML.substring(0, 300));
            return { key, name: nick || (ip ? `유동(${ip})` : "알수없음") };
        }
        getPostData(tr) {
            const titleEl = tr.querySelector(this.#config.POST_TITLE_SELECTOR);
            if (!titleEl) return null;
            const title = titleEl.textContent.trim();
            const post_no = tr.dataset.no;
            const timestamp = tr.querySelector(this.#config.POST_DATE_SELECTOR)?.title;
            if (post_no && title && timestamp) { return { post_no, title, timestamp }; }
            this.#log("[getPostData] 경고: 필수 데이터가 누락되었습니다.", { post_no, title, timestamp });
            return null;
        }
    }

    class UIManager {
        #config; #state; #eventHandlers; #log;
        constructor(config, state, eventHandlers, log) { this.#config = config; this.#state = state; this.#eventHandlers = eventHandlers; this.#log = log || (() => {}); }
        isDarkMode = () => !!document.getElementById('css-darkmode');
        injectStyles() {
            if (document.getElementById(this.#config.STYLE_ID)) return;
            const css = `
    @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');
    :root {
        --userscope-bg-light: #fff; --userscope-text-light: #333; --userscope-border-light: #ddd; --userscope-status-bg-light: #f9f9f9; --userscope-link-light: #1f6b99; --userscope-btn-bg-light: #f8f9fa; --userscope-btn-text-light: #212529; --userscope-btn-border-light: #dee2e6; --userscope-input-border-light: #ccc;
        --userscope-bg-dark: #2c2d30; --userscope-text-dark: #e8e8e8; --userscope-border-dark: #4a4b4f; --userscope-status-bg-dark: #2a2a2a; --userscope-link-dark: #5dade2; --userscope-btn-bg-dark: #343a40; --userscope-btn-text-dark: #f8f9fa; --userscope-btn-border-dark: #495057; --userscope-input-border-dark: #555;
    }
    #${this.#config.BOX_ID} { position: fixed; z-index: 10001; padding: 14px 18px; border-radius: 7px; font-family: "Pretendard", sans-serif; user-select: none; transition: box-shadow .3s ease; white-space: nowrap; top: 150px; left: 20px; box-shadow: 0 3px 12px rgba(0, 0, 0, .15); background: var(--userscope-bg, var(--userscope-bg-light)); color: var(--userscope-text, var(--userscope-text-light)); border: 1px solid var(--userscope-border, var(--userscope-border-light)); }
    #userscope-header { display: flex; align-items: center; font-weight: 600; font-size: 16px; cursor: move; margin-bottom: 10px; }
    #userscope-header img { width: 32px; height: 32px; margin-right: 8px; border-radius: 6px; opacity: .95; }
    #userscope-status { font-size: 13px; opacity: .9; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px dashed var(--userscope-status-border, #eee); }
    #userscope-post-list { list-style-type: decimal; padding-left: 25px; margin: 0; max-height: 300px; overflow-y: auto; font-size: 13px; }
    #userscope-post-list li { margin-bottom: 8px; }
    #userscope-post-list a { text-decoration: none; color: var(--userscope-link, var(--userscope-link-light)); }
    #userscope-post-list a:hover { text-decoration: underline; }
    #userscope-post-list small { margin-left: 8px; opacity: .7; font-size: .9em; }
    #userscope-footer { margin-top: 12px; display: flex; gap: 8px; flex-direction: column; }
    .userscope-theme-dark #${this.#config.BOX_ID} { --userscope-bg: var(--userscope-bg-dark); --userscope-text: var(--userscope-text-dark); --userscope-border: var(--userscope-border-dark); }
    .userscope-theme-dark #userscope-status { --userscope-status-border: #444; }
    .userscope-theme-dark #userscope-post-list a { --userscope-link: var(--userscope-link-dark); }
    #${this.#config.MODAL_ID}, #${this.#config.AI_ANALYSIS_MODAL_ID}, #${this.#config.SETTINGS_MODAL_ID} { display:none; position:fixed; top:0; left:0; width:100%; height:100%; z-index:10002; background-color:rgba(0,0,0,0.5); font-family:"Pretendard",sans-serif; }
    #${this.#config.MODAL_ID} .userscope-modal-base { max-width:420px; }
    .userscope-modal-base { position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); z-index:10003; width:90%; max-width:550px; border-radius:8px; box-shadow:0 5px 20px rgba(0,0,0,0.3); padding:0; }
    .userscope-modal-header { padding:12px 18px; font-size:18px; font-weight:700; display:flex; justify-content:space-between; align-items:center; }
    .userscope-modal-header .modal-title { display:flex; align-items:center; font-weight:600; }
    .userscope-modal-header .modal-icon { width:36px; height:36px; margin-right:8px; border-radius:6px; opacity:0.95; }
    .userscope-modal-header .close-btn { background:none; border:none; font-size:24px; font-weight:700; cursor:pointer; padding:0 5px; }
    .userscope-modal-content { display:flex; flex-direction:column; padding:15px 18px; font-size:14px; line-height:1.6; }
    .userscope-modal-content .scope-modal-content { display:flex; flex-direction:column; text-align:center; }
    .userscope-modal-content p { font-size:.95em; opacity:.9; margin-top:0; }
    .userscope-modal-content .scope-input-group { display:flex; justify-content:center; align-items:center; margin:30px 0; }
    .userscope-modal-content .scope-page-input { width:80px; padding:8px 10px; text-align:center; border:1px solid; border-radius:5px; font-size:1.1em; background-color:transparent; color:inherit; -moz-appearance:textfield; }
    .userscope-modal-content .scope-page-input::-webkit-outer-spin-button, .userscope-modal-content .scope-page-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
    .userscope-modal-content .scope-input-separator { margin:0 10px; font-size:1.2em; opacity:.8; }
    .userscope-modal-footer { display:flex; justify-content:flex-end; align-items:center; }
    .userscope-modal-footer .scope-modal-buttons { display:flex; gap:10px; }
    .userscope-modal-footer .modal-confirm-btn, .userscope-modal-footer .modal-cancel-btn { padding:8px 16px; border:none; border-radius:5px; cursor:pointer; font-weight:500; transition:background-color .2s ease; }
    .userscope-theme-light .userscope-modal-base { background-color:#fff; color:#333; border:1px solid #ccc; }
    .userscope-theme-light .userscope-modal-header { border-bottom:1px solid #ddd; }
    .userscope-theme-light .userscope-modal-header .close-btn { color:#aaa; }
    .userscope-theme-light .userscope-modal-header .close-btn:hover { color:#000; }
    .userscope-theme-light .scope-page-input { border-color:#ccc; }
    .userscope-theme-light .modal-confirm-btn { background-color:#007bff; color:#fff; }
    .userscope-theme-light .modal-confirm-btn:hover { background-color:#0056b3; }
    .userscope-theme-light .modal-cancel-btn { background-color:#f1f3f5; color:#333; border:1px solid #ddd; }
    .userscope-theme-light .modal-cancel-btn:hover { background-color:#e9ecef; }
    .userscope-theme-dark .userscope-modal-base { background-color:#2c2d30; color:#e8e8e8; border:1px solid #4a4b4f; font-family: "Pretendard", sans-serif; }
    .userscope-theme-dark .userscope-modal-header { border-bottom:1px solid #444549; }
    .userscope-theme-dark .userscope-modal-header .close-btn { color:#bbb; }
    .userscope-theme-dark .userscope-modal-header .close-btn:hover { color:#fff; }
    .userscope-theme-dark .scope-page-input { border-color:#555; }
    .userscope-theme-dark .modal-confirm-btn { background-color:#0d6efd; color:#fff; }
    .userscope-theme-dark .modal-confirm-btn:hover { background-color:#0b5ed7; }
    .userscope-theme-dark .modal-cancel-btn { background-color:#495057; color:#f1f3f5;border:1px solid #5a6268; }
    .userscope-theme-dark .modal-cancel-btn:hover { background-color:#5a6268; }
    #${this.#config.USER_SEARCH_CONTAINER_ID} { display:inline-flex; vertical-align:middle; }
    #userscopeUserInput { height:25px; border-radius:4px; padding:0 7px; font-size:12px; font-family:"Pretendard",sans-serif; width:110px; transition:border-color .2s; }
    #userscopeUserSearchBtn { height:25px; padding:0 10px; margin-left:4px; font-size:12px; border-radius:4px; border:none; cursor:pointer; font-weight:600; transition:background-color .2s; }
    #userscopeUserInput:focus { outline:none; }
    .userscope-theme-light #userscopeUserInput { border:1px solid #ccc; background-color:#fff; color:#333; }
    .userscope-theme-light #userscopeUserInput:focus { border-color:#007bff; }
    .userscope-theme-light #userscopeUserSearchBtn { background-color:#007bff; color:#fff; }
    .userscope-theme-light #userscopeUserSearchBtn:hover { background-color:#0056b3; }
    .userscope-theme-dark #userscopeUserInput { border:1px solid #555; background-color:#2c2d30; color:#e8e8e8; }
    .userscope-theme-dark #userscopeUserInput:focus { border-color:#0d6efd; }
    .userscope-theme-dark #userscopeUserSearchBtn { background-color:#0d6efd; color:#fff; }
    .userscope-theme-dark #userscopeUserSearchBtn:hover { background-color:#0b5ed7; }
    .${CONFIG.SCOPE_EXTENSION_MENU_ITEM_CLASS}.bg_jingrey { background:#3b4890!important }
    #${this.#config.AI_ANALYSIS_MODAL_ID} .userscope-modal-base .modal-content { max-height:80vh; overflow-y:auto; }
    #${this.#config.AI_ANALYSIS_MODAL_ID} .ai-analysis-list { list-style-type: decimal; padding-left: 1.5em; margin: 0; font-size: 14px; line-height: 1.6; }
    #${this.#config.AI_ANALYSIS_MODAL_ID} .ai-analysis-list li:last-child { margin-bottom: 0; }
    #${this.#config.AI_ANALYSIS_MODAL_ID} .modal-footer-inline { display: flex; justify-content: space-between; align-items: center; }
    #${this.#config.AI_ANALYSIS_MODAL_ID} .modal-credits-inline { display: flex; flex-direction: column; align-items: flex-end; opacity: .7; }
    .gallscope-copy-btn { align-self:center; padding: 5px 12px; font-size: 13px; border-radius: 5px; cursor: pointer; font-family: "Pretendard", sans-serif; font-weight: 500; transition: all .2s ease-in-out; }
    .userscope-theme-light .gallscope-copy-btn { border: 1px solid #ccc; background-color: transparent; color: #555; }
    .userscope-theme-light .gallscope-copy-btn:hover { background-color: #f1f3f5; border-color: #bbb; }
    .userscope-theme-dark .gallscope-copy-btn { border: 1px solid #555; background-color: transparent; color: #ccc; }
    .userscope-theme-dark .gallscope-copy-btn:hover { background-color: #3a3b3f; border-color: #666; color: #fff; }
    .userscope-modal-base hr { width: 100%; border: none; margin: 7px 0; }
    .userscope-theme-dark .userscope-modal-base hr { border-top: 1px solid #444549; }
    .userscope-theme-light .userscope-modal-base hr { border-top: 1px solid #ccc; }
    #${this.#config.AI_ANALYSIS_MODAL_ID} .ai-analysis-disclaimer { text-align: right; font-size: 11px; opacity: 0.6; margin-top: 8px; }
    #${this.#config.TOGGLE_BUTTON_ID} { position: fixed; bottom: 25px; right: 25px; width: 42px; height: 42px; background-color: var(--userscope-bg-dark, #fff); background-image: url(${this.#config.ICON_URL}); background-size: cover; background-position: center; background-repeat: no-repeat; border-radius: 50%; border: 2px solid #ddd; box-shadow: 0 2px 8px rgba(0,0,0,0.15); cursor: pointer; z-index: 10000; transition: transform .2s ease, box-shadow .2s ease; overflow: hidden; }
    #${this.#config.TOGGLE_BUTTON_ID}:hover { transform: scale(1.1); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
    .userscope-theme-dark #${this.#config.TOGGLE_BUTTON_ID} { background-color: var(--userscope-bg-dark); border-color: var(--userscope-border-dark); }
    #${this.#config.SETTINGS_MODAL_ID} .settings-input-group { margin-bottom: 20px; }
    #${this.#config.SETTINGS_MODAL_ID} label { display: block; font-weight: 600; margin-bottom: 8px; font-size: 15px; }
    #${this.#config.SETTINGS_MODAL_ID} input, #${this.#config.SETTINGS_MODAL_ID} select { width: 100%; box-sizing: border-box; padding: 10px; border-radius: 5px; font-size: 14px; background-color: transparent; color: inherit; border: 1px solid var(--userscope-input-border, var(--userscope-input-border-light)); }
    #${this.#config.SETTINGS_MODAL_ID} p.description { font-size: 12px; opacity: 0.7; margin-top: 8px; margin-bottom: 0; }
    /* 설정 모달의 input과 select 박스 자체의 다크모드 스타일 */
.userscope-theme-dark #${this.#config.SETTINGS_MODAL_ID} input,
.userscope-theme-dark #${this.#config.SETTINGS_MODAL_ID} select {
    background-color: var(--userscope-bg-dark);
    color: var(--userscope-text-dark);
    border-color: var(--userscope-input-border-dark);
}

/* [핵심] select 박스를 클릭했을 때 나오는 드롭다운 옵션의 다크모드 스타일 */
.userscope-theme-dark #${this.#config.SETTINGS_MODAL_ID} select option {
    background-color: var(--userscope-bg-dark);
    color: var(--userscope-text-dark);
}

    /* [수정] 푸터 버튼 공통 스타일 */
    .userscope-footer-btn {
        padding: 8px 0;
        border-radius: 5px;
        cursor: pointer;
        font-weight: 500;
        font-size: 13.5px;
        transition: background-color .2s;
        background-color: var(--userscope-btn-bg, var(--userscope-btn-bg-light));
        color: var(--userscope-btn-text, var(--userscope-btn-text-light));
        border: 1px solid var(--userscope-btn-border, var(--userscope-btn-border-light));
        box-shadow: 0 1px 2px rgba(0, 0, 0, .05);
    }
    .userscope-footer-btn:hover:not(:disabled) { filter: brightness(.95); }
    .userscope-footer-btn:disabled { cursor: not-allowed; opacity: 0.6; }

    /* 다크모드 공통 스타일 */
    .userscope-theme-dark .userscope-footer-btn {
        background-color: var(--userscope-btn-bg-dark);
        color: var(--userscope-btn-text-dark);
        border: 1px solid var(--userscope-btn-border-dark);
    }

    /* 개별 버튼의 고유 스타일 (주로 크기 및 레이아웃) */
    #userscope-expand-btn { width: 100%; }
    #userscope-ai-btn-group { display: flex; gap: 5px; width: 100%; }
    #userscope-ai-btn-group > #${this.#config.AI_ANALYSIS_BUTTON_ID} { flex-grow: 1; width: auto; }
    #userscope-ai-settings-btn { flex-shrink: 0; width: 38px; font-size: 16px; line-height: 1; }
    `;
            const styleEl = document.createElement('style'); styleEl.id = this.#config.STYLE_ID; styleEl.textContent = css.replace(/\s+/g, ' ').trim(); document.head.appendChild(styleEl);
        }
        getGalleryName() { return document.querySelector('.gallname')?.textContent ?? 'Unknown'; }
        updateTheme() { document.body.classList.toggle('userscope-theme-dark', this.isDarkMode()); document.body.classList.toggle('userscope-theme-light', !this.isDarkMode()); }
        #_extractInfoFromWriterElement(writerElement) {
            if (!writerElement) return null;
            const nick = writerElement.dataset.nick?.trim(); const uid = writerElement.dataset.uid?.trim(); const ip = writerElement.dataset.ip?.trim();
            const filterKey = uid ? `id:${uid}` : (ip ? `ip:${ip}` : null);
            if (!filterKey) { this.#log('작성자 식별자(uid/ip)를 찾을 수 없습니다.'); return null; }
            const displayName = nick ? `${nick}(${uid || ip})` : `유동(${ip})`;
            this.#log("작성자 정보 추출:", { displayName, filterKey }); return { displayName, filterKey };
        }
        extractWriterInfoFromView() { const writerEl = document.querySelector(this.#config.WRITER_INFO_SELECTOR); return this.#_extractInfoFromWriterElement(writerEl); }
        extractWriterInfoFromPopup(popupUlElement) {
            const contentContainer = popupUlElement.closest('.ub-content');
            if (!contentContainer) { this.#log('[extractWriterInfoFromPopup] 실패: 상위 .ub-content 컨테이너를 찾을 수 없음.'); return null; }
            const writerElement = contentContainer.querySelector('.gall_writer.ub-writer');
            if (!writerElement) { this.#log('[extractWriterInfoFromPopup] 실패: .ub-content 내부에서 .gall_writer 요소를 찾을 수 없음.'); return null; }
            this.#log('[extractWriterInfoFromPopup] 성공: 작성자 정보를 추출합니다.');
            return this.#_extractInfoFromWriterElement(writerElement);
        }
        injectUserSearchUI() {
            if (document.getElementById(this.#config.USER_SEARCH_CONTAINER_ID)) return;
            const galleryTitleElement = document.querySelector('.page_head .fl h2');
            if (!galleryTitleElement) { this.#log('검색 UI 삽입 위치(갤러리 이름)를 찾지 못했습니다.'); return; }
            const container = document.createElement('div'); container.id = this.#config.USER_SEARCH_CONTAINER_ID; container.style.cssText = 'display: flex; align-items: center; margin-left: 5px; margin-top: 5px;';
            container.innerHTML = `<input type="text" id="userscopeUserInput" placeholder="식별코드 또는 IP 검색"><button id="userscopeUserSearchBtn" title="해당 유저의 작성글 검색">검색</button>`;
            galleryTitleElement.after(container); galleryTitleElement.parentElement.style.cssText = 'display: flex; align-items: center;';
            const inputEl = document.getElementById('userscopeUserInput');
            document.getElementById('userscopeUserSearchBtn').addEventListener('click', this.#eventHandlers.onUserSearch);
            inputEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); this.#eventHandlers.onUserSearch(); } });
            this.#log('사용자 검색 UI 삽입 완료');
        }
        renderToggleButton(clickHandler) {
            if (document.getElementById(this.#config.TOGGLE_BUTTON_ID)) return;
            const button = document.createElement('div');
            button.id = this.#config.TOGGLE_BUTTON_ID;
            button.title = '갤스코프 보이기/숨기기 (드래그하여 이동)';
            if (this.#state.toggleButtonPosition) {
                button.style.top = this.#state.toggleButtonPosition.top; button.style.left = this.#state.toggleButtonPosition.left; button.style.bottom = 'auto'; button.style.right = 'auto';
            }
            document.body.appendChild(button);
            let wasDragged = false; let offsetX, offsetY, startX, startY;
            const onMouseMove = (e) => {
                if (!wasDragged && (Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5)) { wasDragged = true; button.style.bottom = 'auto'; button.style.right = 'auto'; }
                if (wasDragged) {
                    let newLeft = e.clientX - offsetX;
                    let newTop = e.clientY - offsetY;

                    const buttonRect = button.getBoundingClientRect();
                    const viewportWidth = window.innerWidth;
                    const viewportHeight = window.innerHeight;

                    newLeft = Math.max(0, Math.min(newLeft, viewportWidth - buttonRect.width));
                    newTop = Math.max(0, Math.min(newTop, viewportHeight - buttonRect.height));

                    button.style.left = `${newLeft}px`;
                    button.style.top = `${newTop}px`;
                }
            };
            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp);
                if (wasDragged) { const finalPosition = { top: button.style.top, left: button.style.left }; this.#state.toggleButtonPosition = finalPosition; GM_setValue(this.#config.TOGGLE_BUTTON_POSITION_ID, JSON.stringify(finalPosition)); }
                setTimeout(() => { wasDragged = false; }, 0);
            };
            button.addEventListener('mousedown', (e) => {
                if (e.button !== 0) return; e.preventDefault();
                startX = e.clientX; startY = e.clientY; const rect = button.getBoundingClientRect(); offsetX = e.clientX - rect.left; offsetY = e.clientY - rect.top;
                document.addEventListener('mousemove', onMouseMove); document.addEventListener('mouseup', onMouseUp, { once: true });
            });
            button.addEventListener('click', (e) => { if (wasDragged) { e.stopPropagation(); return; } clickHandler(); });
        }
        setBoxVisibility(visible) { const box = document.getElementById(this.#config.BOX_ID); if (box) { box.style.display = visible ? 'block' : 'none'; } }
        renderFloatingBox(writerInfo) {
            if (document.getElementById(this.#config.BOX_ID)) return;
            const box = document.createElement('div'); box.id = this.#config.BOX_ID;
            box.innerHTML = `<div id="userscope-header"><img src="${this.#config.ICON_URL}" alt="UserScope Icon"><span>${writerInfo.displayName}의 최근 글 목록</span></div><div id="userscope-status">분석 대기 중...</div><ul id="userscope-post-list"></ul>
<div id="userscope-footer">
  <button id="userscope-expand-btn" class="userscope-footer-btn">스코프 확장</button>
  <div id="userscope-ai-btn-group">
    <button id="${this.#config.AI_ANALYSIS_BUTTON_ID}" class="userscope-footer-btn">🤖 AI 유저 분석</button>
    <button id="userscope-ai-settings-btn" class="userscope-footer-btn" title="갤스코프2 설정">⚙️</button>
  </div>
</div>`;
            document.body.appendChild(box); this.#state.boxElement = box;
            if (this.#state.boxPosition) { box.style.top = this.#state.boxPosition.top; box.style.left = this.#state.boxPosition.left; }
            this.#setupDragAndDrop(box);
            document.getElementById('userscope-expand-btn').addEventListener('click', () => this.showScopeModal());
            document.getElementById(this.#config.AI_ANALYSIS_BUTTON_ID).addEventListener('click', this.#eventHandlers.onAIAnalyze);
            document.getElementById('userscope-ai-settings-btn').addEventListener('click', () => this.showSettingsModal());
        }
        #setupDragAndDrop(element) {
            const header = element.querySelector('#userscope-header'); let offsetX, offsetY;
            const onMouseMove = (e) => {
                let newLeft = e.clientX - offsetX;
                let newTop = e.clientY - offsetY;

                const elementRect = element.getBoundingClientRect();
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;

                newLeft = Math.max(0, newLeft);
                newLeft = Math.min(newLeft, viewportWidth - elementRect.width);

                newTop = Math.max(0, newTop);
                newTop = Math.min(newTop, viewportHeight - elementRect.height);

                element.style.left = `${newLeft}px`;
                element.style.top = `${newTop}px`;
            };
            const onMouseUp = () => { document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp); const finalPosition = { top: element.style.top, left: element.style.left }; this.#state.boxPosition = finalPosition; GM_setValue(this.#config.BOX_POSITION_ID, JSON.stringify(finalPosition)); };
            header.addEventListener('mousedown', (e) => { if (e.button !== 0) return; e.preventDefault(); offsetX = e.clientX - element.offsetLeft; offsetY = e.clientY - element.offsetTop; document.addEventListener('mousemove', onMouseMove); document.addEventListener('mouseup', onMouseUp, { once: true }); });
        }
        updateStatus(message, isLoading = false) { const statusEl = document.getElementById('userscope-status'); if (!statusEl) return; const loadingGif = isLoading ? ` <img src="//nstatic.dcinside.com/dc/w/images/loading_bar.gif" alt="" style="vertical-align: middle; margin-left: 5px;">` : ''; statusEl.innerHTML = `${message}${loadingGif}`; }
        renderPostList(posts, startPage, endPage, failedPages = 0) {
            this.#state.currentPosts = posts; const listEl = document.getElementById('userscope-post-list'); if (!listEl) return;
            let statusMessage;

            const totalAnalyzed = endPage - startPage + 1;
            const rangeText = (totalAnalyzed === 1)
            ? `페이지 ${startPage}`
        : `${startPage} ~ ${endPage}p`;

            if (posts.length === 0) {
                statusMessage = `글을 찾지 못했습니다. (${rangeText} 분석)`;
                listEl.innerHTML = `<li>글을 찾지 못했습니다.</li>`;
            }
            else {
                statusMessage = `총 ${posts.length}개의 글 발견 (${rangeText})`;
                const galleryId = new URLSearchParams(window.location.search).get('id'); const basePath = window.location.pathname.replace(/\/view.*/, '/view'); const fragment = document.createDocumentFragment();
                posts.forEach(post => {
                    const postViewUrl = `${basePath}?id=${galleryId}&no=${post.post_no}`; const postDate = new Date(post.timestamp).toLocaleString('ko-KR', { hour12: false, dateStyle: 'short', timeStyle: 'short' }); const li = document.createElement('li');
                    li.innerHTML = `<a href="${postViewUrl}" target="_blank" title="${this.#eventHandlers.escapeHtml(post.title)}">${this.#eventHandlers.escapeHtml(post.title)}</a> <small>(${postDate})</small>`; fragment.appendChild(li);
                });
                listEl.innerHTML = ''; listEl.appendChild(fragment);
            }
            if (failedPages > 0) { statusMessage += ` <span style="color: #ff6b6b;" title="${failedPages}개의 페이지를 불러오는 데 실패했습니다.">(오류: ${failedPages})</span>`; }
            this.updateStatus(statusMessage, false);
        }
        showAIAnalysisModal(content, isLoading = false) {
            let modal = document.getElementById(this.#config.AI_ANALYSIS_MODAL_ID);
            if (!modal) { modal = document.createElement('div'); modal.id = this.#config.AI_ANALYSIS_MODAL_ID; document.body.appendChild(modal); }
            const writer = this.#state.pendingWriterInfo || this.#state.writerInfo; const headerTitle = writer ? `${writer.displayName} 분석 결과` : 'AI 유저 분석 결과';
            modal.innerHTML = `<div class="userscope-modal-base"></div>`; const modalBase = modal.querySelector('.userscope-modal-base');
            modalBase.innerHTML = `<div class="userscope-modal-header"><div class="modal-title"><img src="${this.#config.ICON_URL}" class="modal-icon"><span>${this.#eventHandlers.escapeHtml(headerTitle)}</span></div><button class="close-btn">×</button></div><div class="userscope-modal-content"></div>`;
            const contentDiv = modalBase.querySelector('.userscope-modal-content');
            if (isLoading) { contentDiv.innerHTML = `<p style="text-align: left;">AI가 유저를 분석하고 있습니다...<br>잠시만 기다려주세요.</p>`; }
            else {
                contentDiv.innerHTML = this.#buildAIAnalysisContent(content);
                const copyBtn = contentDiv.querySelector('.gallscope-copy-btn');
                if (copyBtn) {
                    copyBtn.addEventListener('click', (e) => {
                        const headerLine = `${writer.displayName} 분석결과`; const separator = '---------------'; const disclaimer = '※ AI의 팩폭입니다. 과몰입 금지. 긁?';
                        const timestamp = this.#eventHandlers.getFormattedTimestamp().slice(0, 16); const creditLine = `${timestamp} Powered by 갤스코프`;
                        const copyText = [headerLine, separator, content.trim(), separator, disclaimer, creditLine].join('\n');
                        navigator.clipboard.writeText(copyText).then(() => { e.target.textContent = '복사 완료!'; setTimeout(() => { e.target.textContent = '결과 복사'; }, 2000); }).catch(err => { console.error('Copy failed:', err); e.target.textContent = '복사 실패'; });
                    });
                }
            }
            modal.style.display = 'block'; modalBase.querySelector('.close-btn').onclick = () => { modal.style.display = 'none'; }; this.updateTheme();
        }
        #buildAIAnalysisContent(content) {
            const listItems = content.split('\n').filter(line => line.trim() !== '').map(line => `<li>${this.#eventHandlers.escapeHtml(line.replace(/^\d+\.\s*/, ''))}</li>`).join('');
            return `<ol class="ai-analysis-list">${listItems}</ol><small class="modal-credits-inline">※ AI의 팩폭입니다. 과몰입 금지. 긁?</small><hr><div class="modal-footer-inline" style="align-items: flex-end;"><button class="gallscope-copy-btn">결과 복사</button><div style="text-align: right;"><div class="modal-credits-inline" style="margin-bottom: 5px;"><small>Powered by Google Gemini (${this.#state.selectedGeminiModel})</small><small>${this.#eventHandlers.getFormattedTimestamp()} by 갤스코프</small></div></div></div>`;
        }
        renderScopeModal() {
            if (document.getElementById(this.#config.MODAL_ID)) return;
            const modalContainer = document.createElement('div'); modalContainer.id = this.#config.MODAL_ID;
            modalContainer.innerHTML = `<div class="userscope-modal-base"><div class="userscope-modal-header"><div class="modal-title"><img src="${this.#config.ICON_URL}" class="modal-icon"><span>집중 스코프 설정</span></div><button class="close-btn">×</button></div><div class="userscope-modal-content"><div class="scope-modal-content"><div style="font-weight:700; font-size:15px;">스코프 범위 설정</div><p>분석할 페이지 범위를 직접 입력해주세요.</p><div class="scope-input-group"><input type="number" id="userscope-modal-start" value="1" min="1" class="scope-page-input"><span class="scope-input-separator">-</span><input type="number" id="userscope-modal-end" value="20" min="1" class="scope-page-input"></div><div class="userscope-modal-footer"><div id="userscope-modal-target" style="font-size:13px; text-align:left; flex-grow:1; opacity: 0.9;"></div><div class="scope-modal-buttons"><button id="userscope-modal-confirm" class="modal-confirm-btn">확인</button></div></div></div></div></div>`;
            document.body.appendChild(modalContainer);
            modalContainer.querySelector('.close-btn').addEventListener('click', () => this.hideScopeModal());
            document.getElementById('userscope-modal-confirm').addEventListener('click', this.#eventHandlers.onScopeAnalyze);
            modalContainer.addEventListener('click', (e) => { if (e.target === modalContainer) { this.hideScopeModal(); } });
        }
        showScopeModal() {
            const modal = document.getElementById(this.#config.MODAL_ID); if (!modal) return;
            const startInput = document.getElementById('userscope-modal-start'); const endInput = document.getElementById('userscope-modal-end');
            if (startInput) startInput.value = "1"; if (endInput) endInput.value = "20";
            const targetInfoEl = document.getElementById('userscope-modal-target');
            if (targetInfoEl) { const writer = this.#state.pendingWriterInfo || this.#state.writerInfo; targetInfoEl.textContent = writer ? `대상: ${writer.displayName}` : ''; targetInfoEl.style.display = writer ? 'block' : 'none'; }
            modal.style.display = 'block'; this.updateTheme();
        }
        hideScopeModal() { const modal = document.getElementById(this.#config.MODAL_ID); if (modal) modal.style.display = 'none'; }
        renderSettingsModal() {
            if (document.getElementById(this.#config.SETTINGS_MODAL_ID)) return;
            const modalContainer = document.createElement('div');
            modalContainer.id = this.#config.SETTINGS_MODAL_ID;
            const modelOptions = this.#config.AVAILABLE_GEMINI_MODELS.map(model => `<option value="${model}">${model}</option>`).join('');
            modalContainer.innerHTML = `
                <div class="userscope-modal-base">
                    <div class="userscope-modal-header">
                        <div class="modal-title"><img src="${this.#config.ICON_URL}" class="modal-icon"><span>갤스코프 설정</span></div>
                        <button class="close-btn">×</button>
                    </div>
                    <div class="userscope-modal-content">
                        <div class="settings-input-group">
                            <label for="userscope-settings-api-key">Gemini API 키</label>
                            <input type="password" id="userscope-settings-api-key" placeholder="API 키를 입력하세요">
                            <p class="description">AI 유저 분석 기능을 사용하려면 API 키가 필요합니다.</p>
                        </div>
                        <div class="settings-input-group">
                            <label for="userscope-settings-model">Gemini 모델</label>
                            <select id="userscope-settings-model">${modelOptions}</select>
                        </div>
                        <div class="userscope-modal-footer">
                            <button id="userscope-settings-reset-ui" class="modal-cancel-btn">UI 위치 초기화</button>
                            <div style="flex-grow: 1;"></div>
                            <button id="userscope-settings-save" class="modal-confirm-btn">저장</button>
                        </div>
                    </div>
                </div>`;
            document.body.appendChild(modalContainer);
            const closeModal = () => this.hideSettingsModal();
            modalContainer.querySelector('.close-btn').addEventListener('click', closeModal);
            modalContainer.addEventListener('click', e => { if (e.target === modalContainer) closeModal(); });
            document.getElementById('userscope-settings-save').addEventListener('click', this.#eventHandlers.onSaveSettings);
            document.getElementById('userscope-settings-reset-ui').addEventListener('click', this.#eventHandlers.onResetUIPosition);
        }
        showSettingsModal() {
            const modal = document.getElementById(this.#config.SETTINGS_MODAL_ID); if (!modal) return;
            modal.querySelector('#userscope-settings-api-key').value = this.#state.geminiApiKey;
            modal.querySelector('#userscope-settings-model').value = this.#state.selectedGeminiModel;
            modal.style.display = 'block'; this.updateTheme();
        }
        hideSettingsModal() { const modal = document.getElementById(this.#config.SETTINGS_MODAL_ID); if (modal) modal.style.display = 'none'; }
    }

    class UserScope {
        #config = CONFIG;
        #state = {
            writerInfo: null, pendingWriterInfo: null, isAnalyzing: false, boxPosition: null, currentPosts: [], geminiApiKey: '',
            selectedGeminiModel: CONFIG.DEFAULT_GEMINI_MODEL, isBoxVisible: true, isInitialAnalysisDone: false, toggleButtonPosition: null,
        };
        #ui; #extractor; #apiClient; #utils;
        constructor() {
            const createLogger = (context) => (...messages) => { if (this.#config.DEBUG_MODE) { console.log(`%c[UserScope|${context}]`, "color: #0088cc; font-weight: bold;", ...messages); } };
            this.#utils = { log: createLogger("Core"), escapeHtml: (text) => { if (typeof text !== 'string') return text; const map = { '&': '&', '<': '<', '>': '>', '"': '"', "'": '\'' }; return text.replace(/[&<>"']/g, m => map[m]); }, sleep: ms => new Promise(resolve => setTimeout(resolve, ms)), getFormattedTimestamp: () => new Date().toLocaleString('sv-SE'), };
            const eventHandlers = {
                onScopeAnalyze: this.#handleScopeAnalysis.bind(this), onUserSearch: this.#handleUserSearch.bind(this), onAIAnalyze: this.#handleAIAnalysis.bind(this),
                onSaveSettings: this.#handleSaveSettings.bind(this), onResetUIPosition: this.#handleResetUIPosition.bind(this),
                escapeHtml: this.#utils.escapeHtml, getFormattedTimestamp: this.#utils.getFormattedTimestamp,
            };
            this.#ui = new UIManager(this.#config, this.#state, eventHandlers, createLogger("UI"));
            this.#extractor = new DataExtractor(this.#config, createLogger("Extractor"));
            this.#apiClient = new ApiClient(this.#config, createLogger("API"));
        }
        async init() {
            this.#utils.log('초기화 시작');
            await this.#loadSettings();
            this.#setupMenuCommands();
            this.#ui.injectStyles();
            this.#ui.updateTheme();
            this.#setupThemeObserver();
            this.#ui.renderScopeModal();
            this.#ui.renderSettingsModal();
            this.#ui.injectUserSearchUI();
            this.#setupUserPopupObserver();
            this.#ui.renderToggleButton(this.#handleToggleClick.bind(this));
            this.#state.writerInfo = this.#ui.extractWriterInfoFromView();
            if (!this.#state.writerInfo) {
                this.#utils.log('메인 작성자 정보를 찾을 수 없어 자동 실행을 중단합니다.');
                const toggleBtn = document.getElementById(this.#config.TOGGLE_BUTTON_ID);
                if(toggleBtn) toggleBtn.style.display = 'none';
                return;
            }
            if (this.#state.isBoxVisible) { this.#showBoxAndAnalyze(); }
        }
        async #loadSettings() {
            try {
                const savedPosition = await GM_getValue(this.#config.BOX_POSITION_ID, null); if (savedPosition) this.#state.boxPosition = JSON.parse(savedPosition);
                const savedTogglePosition = await GM_getValue(this.#config.TOGGLE_BUTTON_POSITION_ID, null);
                if (savedTogglePosition) { this.#state.toggleButtonPosition = JSON.parse(savedTogglePosition); }
            } catch (e) { this.#utils.log('저장된 설정 로딩 실패:', e); }
            this.#state.isBoxVisible = await GM_getValue(this.#config.BOX_VISIBILITY_ID, true);
            this.#state.geminiApiKey = await GM_getValue(this.#config.GEMINI_API_KEY_ID, '');
            this.#state.selectedGeminiModel = await GM_getValue(this.#config.GEMINI_MODEL_ID, this.#config.DEFAULT_GEMINI_MODEL);
        }
        async #showBoxAndAnalyze() {
            const box = document.getElementById(this.#config.BOX_ID);
            if (!box) {
                this.#ui.renderFloatingBox(this.#state.writerInfo);
                await this.startAnalysis(1, 5); this.#state.isInitialAnalysisDone = true;
            } else { this.#ui.setBoxVisibility(true); }
        }
        async #handleToggleClick() {
            this.#state.isBoxVisible = !this.#state.isBoxVisible; this.#utils.log(`박스 표시 상태 변경: ${this.#state.isBoxVisible}`);
            await GM_setValue(this.#config.BOX_VISIBILITY_ID, this.#state.isBoxVisible);
            if (this.#state.isBoxVisible) { this.#showBoxAndAnalyze(); } else { this.#ui.setBoxVisibility(false); }
        }
        #setupMenuCommands() {
            if (typeof GM_registerMenuCommand === 'function') {
                this.#utils.log('메뉴 단축키를 등록합니다.');
                GM_registerMenuCommand("갤스코프2: 설정 열기", () => this.#ui.showSettingsModal());
            }
        }
        async #handleSaveSettings() {
            const apiKey = document.getElementById('userscope-settings-api-key').value.trim();
            const model = document.getElementById('userscope-settings-model').value;
            await GM_setValue(this.#config.GEMINI_API_KEY_ID, apiKey);
            await GM_setValue(this.#config.GEMINI_MODEL_ID, model);
            this.#state.geminiApiKey = apiKey; this.#state.selectedGeminiModel = model;
            this.#utils.log('설정이 저장되었습니다:', { model }); this.#ui.hideSettingsModal(); alert('설정이 저장되었습니다.');
        }
        async #handleResetUIPosition() {
            if (confirm("갤스코프 분석창과 토글 버튼의 위치를 초기화하시겠습니까?\n\n(페이지가 새로고침됩니다)")) {
                try {
                    await GM_deleteValue(this.#config.BOX_POSITION_ID); await GM_deleteValue(this.#config.TOGGLE_BUTTON_POSITION_ID);
                    this.#state.boxPosition = null; this.#state.toggleButtonPosition = null;
                    this.#ui.hideSettingsModal(); alert("UI 위치가 초기화되었습니다. 페이지를 새로고침하여 적용합니다.");
                    location.reload();
                } catch (error) { this.#utils.log('UI 위치 초기화 중 오류 발생:', error); alert("위치 초기화 중 오류가 발생했습니다."); }
            }
        }
        #setupThemeObserver() { const themeObserver = new MutationObserver(() => { this.#utils.log('테마 변경 감지.'); this.#ui.updateTheme(); }); themeObserver.observe(document.head, { childList: true }); }
        #setupUserPopupObserver() { const observer = new MutationObserver((mutations) => { for (const mutation of mutations) { for (const node of mutation.addedNodes) { if (node.nodeType !== Node.ELEMENT_NODE) continue; const popupUl = node.querySelector(this.#config.USER_POPUP_UL_SELECTOR); if (popupUl) { this.#addScopeMenuItemToPopup(popupUl); } } } }); observer.observe(document.body, { childList: true, subtree: true }); }
        #addScopeMenuItemToPopup(popupUlElement) { if (popupUlElement.querySelector(`.${this.#config.SCOPE_EXTENSION_MENU_ITEM_CLASS}`)) return; const li = document.createElement('li'); li.className = `bg_jingrey ${this.#config.SCOPE_EXTENSION_MENU_ITEM_CLASS}`; li.innerHTML = `<a href="javascript:void(0);" style="font-weight:600;" title="해당 유저의 작성글을 집중 분석합니다.">${this.#config.SCOPE_EXTENSION_MENU_ITEM_TEXT}<em class="sp_img icon_go"></em></a>`; li.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); const writerInfo = this.#ui.extractWriterInfoFromPopup(popupUlElement); if (writerInfo) { this.#handleScopeExtensionRequest(writerInfo); } else { alert('사용자 정보를 추출하는 데 실패했습니다.'); } const popupContainer = popupUlElement.closest('.user_data_lyr'); if (popupContainer) popupContainer.style.display = 'none'; }); popupUlElement.appendChild(li); }
        #handleScopeExtensionRequest(writerInfo) { this.#state.pendingWriterInfo = writerInfo; this.#ui.showScopeModal(); }
        #handleUserSearch() { const inputEl = document.getElementById('userscopeUserInput'); const userInput = inputEl.value.trim(); if (!userInput) { alert('검색할 ID 또는 IP를 입력해주세요.'); inputEl.focus(); return; } const filterKey = /^\d{1,3}(\.\d{1,3})+$/.test(userInput) ? `ip:${userInput}` : `id:${userInput}`; const targetUserInfo = { displayName: userInput, filterKey: filterKey }; inputEl.value = ''; this.#handleScopeExtensionRequest(targetUserInfo); }
        #handleScopeAnalysis() {
            const start = parseInt(document.getElementById('userscope-modal-start').value, 10); const end = parseInt(document.getElementById('userscope-modal-end').value, 10);
            if (isNaN(start) || isNaN(end) || start <= 0 || end < start) { alert('올바른 페이지 범위를 입력해주세요.'); document.getElementById('userscope-modal-start').focus(); return; }
            this.#ui.hideScopeModal(); this.#state.isBoxVisible = true; GM_setValue(this.#config.BOX_VISIBILITY_ID, true);
            if (this.#state.pendingWriterInfo) {
                this.#state.writerInfo = this.#state.pendingWriterInfo; this.#state.pendingWriterInfo = null;
                let box = document.getElementById(this.#config.BOX_ID);
                if (!box) { this.#ui.renderFloatingBox(this.#state.writerInfo); }
                else { box.querySelector('#userscope-header span').textContent = this.#state.writerInfo.displayName; this.#ui.setBoxVisibility(true); }
            }
            this.startAnalysis(start, end);
        }
        async #handleAIAnalysis() {
            this.#utils.log('AI 분석 요청됨');
            if (!this.#state.geminiApiKey) {
                alert('Gemini API 키가 설정되지 않았습니다.\n우측의 톱니바퀴(⚙️) 버튼을 눌러 등록해주세요.');
                return;
            }
            if (!this.#state.currentPosts || this.#state.currentPosts.length < 5) {
                alert('분석할 게시글이 충분하지 않습니다. (최소 5개 필요)');
                return;
            }
            this.#ui.showAIAnalysisModal('', true);
            const prompt = this.#createAIPersonalityPrompt(this.#state.currentPosts);
            try {
                const response = await this.#apiClient.fetchGeminiAPI(prompt, this.#state.selectedGeminiModel, this.#state.geminiApiKey);
                const analysisText = response.candidates?.[0]?.content?.parts?.[0]?.text;
                if (analysisText) { this.#ui.showAIAnalysisModal(analysisText.trim()); }
                else {
                    const errorMsg = response?.error?.message ?? "유효한 응답을 받지 못했습니다.";
                    this.#utils.log("AI 분석 실패 응답:", response);
                    this.#ui.showAIAnalysisModal(`분석 실패: ${errorMsg}`);
                }
            } catch (error) {
                this.#utils.log("AI 분석 오류:", error);
                this.#ui.showAIAnalysisModal(`분석 중 오류 발생: ${error.error.message}`);
            }
        }
        #createAIPersonalityPrompt(posts) { return `너는 디시 ${this.#ui.getGalleryName()} 갤러리 20년차 유저다. 웬만한 건 다 꿰뚫어 보지만 말을 아끼는 편이야. 한마디 툭 던져도 그게 정곡을 찌르는 팩트지. 아래 유저 글 목록 보고, 이 유저가 어떤 유형인지 최대한 객관적으로 관찰해서 딱 세 줄로 요약해봐. 쓸데없는 미사여구는 빼고, 보이는 그대로 무심하게. 첫 줄은 핵심 특징, 두 번째 줄은 글쓰기 패턴, 세 번째 줄은 결론. 출력은 정확히 **세 줄**이어야 해.\n 단, 출력에 특수문자를 사용해선 안 돼. 너무 나쁜 말은 하지 말아줘. 갤러리 유저를 비하하는 단어를 사용해선 안 돼.\n\n**분석할 게시물 제목 목록:**\n[\n${posts.slice(0, 200).map(p => `"${p.title.replace(/"/g, '\\"')}"`).join(',\n')}\n]\n`; }
        async startAnalysis(startPage, endPage) { if (this.#state.isAnalyzing) { this.#utils.log('이미 분석이 진행 중입니다.'); return; } const totalPages = endPage - startPage + 1; if (totalPages > this.#config.MAX_PAGES_TO_ANALYZE) { alert(`한 번에 최대 ${this.#config.MAX_PAGES_TO_ANALYZE} 페이지만 분석할 수 있습니다.`); return; } this.#state.isAnalyzing = true; this.#toggleButtons(false); this.#ui.updateStatus(`분석 시작 (${startPage} ~ ${endPage}p)`, true); try { const { posts, failedPages } = await this.fetchUserPosts(startPage, endPage); this.#utils.log(`분석 완료. 찾은 게시물: ${posts.length}개, 실패한 페이지: ${failedPages}개`); this.#ui.renderPostList(posts, startPage, endPage, failedPages); } catch (error) { this.#utils.log('분석 중 오류:', error); this.#ui.updateStatus(`오류 발생: ${error.message}`, false); } finally { this.#state.isAnalyzing = false; this.#toggleButtons(true); } }
        #toggleButtons(enable) { document.getElementById('userscope-expand-btn')?.toggleAttribute('disabled', !enable); document.getElementById(this.#config.AI_ANALYSIS_BUTTON_ID)?.toggleAttribute('disabled', !enable); document.getElementById('userscope-modal-confirm')?.toggleAttribute('disabled', !enable); }
        async fetchUserPosts(startPage, endPage) {
            const { filterKey } = this.#state.writerInfo; this.#utils.log(`게시물 fetch 시작. 대상: ${filterKey}, 페이지: ${startPage}~${endPage}`);
            const galleryId = new URLSearchParams(window.location.search).get('id'); const listPageUrl = window.location.href.replace(/\/view.*/, '/lists/');
            const baseUrl = `${new URL(listPageUrl).origin}${new URL(listPageUrl).pathname}`;
            const allPosts = []; let failedPages = 0; const pagesToFetch = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i); let processedCount = 0;
            for (let i = 0; i < pagesToFetch.length; i += this.#config.MULTI_PAGE_FETCH_CHUNK_SIZE) {
                const chunk = pagesToFetch.slice(i, i + this.#config.MULTI_PAGE_FETCH_CHUNK_SIZE); const promises = chunk.map(page => this.#fetchPageHtml(`${baseUrl}?id=${galleryId}&page=${page}`));
                const htmlResults = await Promise.all(promises);
                for (const html of htmlResults) {
                    processedCount++; this.#ui.updateStatus(`${processedCount} / ${pagesToFetch.length} 페이지 분석 중...`, true);
                    if (html) { allPosts.push(...this.#parsePostsFromHtml(html, filterKey)); } else { failedPages++; }
                }
                if (i + this.#config.MULTI_PAGE_FETCH_CHUNK_SIZE < pagesToFetch.length) { await this.#utils.sleep(this.#config.MULTI_PAGE_FETCH_CHUNK_DELAY); }
            }
            allPosts.sort((a, b) => parseInt(b.post_no, 10) - parseInt(a.post_no, 10)); return { posts: allPosts, failedPages };
        }
        #fetchPageHtml(url) {
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: 'GET', url: url, timeout: this.#config.FETCH_TIMEOUT_MS,
                    onload: res => { if (res.status === 200) { resolve(res.responseText); } else { resolve(null); } },
                    onerror: () => { resolve(null); },
                    ontimeout: () => { resolve(null); },
                });
            });
        }
        #parsePostsFromHtml(html, targetFilterKey) {
            const doc = new DOMParser().parseFromString(html, "text/html"); const postRows = doc.querySelectorAll(this.#config.POST_ROW_SELECTOR);
            if(postRows.length === 0) { this.#utils.log(`[Parser] 게시물 행을 찾지 못했습니다.`); }
            const foundPosts = [];
            postRows.forEach((tr) => {
                const writerInfo = this.#extractor.getWriterInfo(tr);
                if (writerInfo?.key === targetFilterKey) { const postData = this.#extractor.getPostData(tr); if (postData) { foundPosts.push(postData); } }
            });
            return foundPosts;
        }
    }

    try { new UserScope().init(); }
    catch (error) { console.error('%c[UserScope] 스크립트 실행 중 치명적인 오류 발생!', 'color: red; font-weight: bold;', error); }
})();