// ==UserScript==
// @name         ANUBIS
// @namespace    ANUBIS-DEADlock
// @version      1.2.0
// @description  디시인사이드 고급 검색 및 필터링 검색 기능
// @author       DEADlock
// @match        https://gall.dcinside.com/*/board/lists*
// @match        https://gall.dcinside.com/board/lists*
// @match        https://gall.dcinside.com/*/board/view*
// @match        https://gall.dcinside.com/board/view*
// @icon         https://i.imgur.com/B2wWa8r.png
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/544311/ANUBIS.user.js
// @updateURL https://update.greasyfork.org/scripts/544311/ANUBIS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    const CONFIG = {
        IDS: {
            STYLES: 'anubis-global-styles',
            SEARCH_MODAL: 'anubis-search-chamber',
            DIRECT_SEARCH_MODAL: 'anubis-direct-search-chamber',
            FILTER_MODAL: 'anubis-filter-chamber',
            RESULTS_MODAL: 'anubis-results-chamber',
            SETTINGS_MODAL: 'anubis-settings-chamber',
            ADVANCED_SEARCH_BTN: 'anubis-advanced-search-btn',
            SEARCH_INFO_TEXT: 'anubis-search-info-text',
            TOOLTIP: 'anubis-tooltip',
            TOP_BTN_WRAPPER: 'anubis-top-btn-wrapper',
            QUICK_SEARCH_BTN: 'anubis-quick-search-btn',
            QUICK_FILTER_BTN: 'anubis-quick-filter-btn',
        },
        CLASSES: {
            MODAL: 'anubis-chamber',
            DARK_THEME: 'anubis-dark-theme',
            TOP_ICON_BTN: 'anubis-top-icon-btn',
        },
        SELECTORS: {
            USER_POPUP_LIST: '.user_data_list',
            POST_CONTAINER: '.ub-content',
            WRITER_INFO: '.gall_writer.ub-writer',
            RECENT_GALLERY_LIST: '.newvisit_box ul.newvisit_list',
            RECENT_GALLERY_LINK: 'li a.lately_log',
            CURRENT_GALLERY_NAME: '.page_head h2 a',
            POST_ROW: 'tr.ub-content.us-post',
            POST_TITLE: 'td.gall_tit.ub-word > a:first-child',
            POST_COMMENT_COUNT: 'a.reply_numbox',
            POST_DATE: 'td.gall_date',
            POST_VIEWS: 'td.gall_count',
            POST_RECOMMEND: 'td.gall_recommend',
            TOP_AREA_RIGHT: '.list_array_option .right_box',
            GALLERY_ISSUE_BOX_RIGHT: '.gall_issuebox.fr',
        },
        CONSTANTS: {
            SEARCH_CHUNK_SIZE: 5,
            MAX_SEARCH_PAGES: 200,
            MAX_DATE_SEARCH_PAGES: 1000, // Safeguard limit for date searches
            MAX_DATE_SEARCH_DAYS: 60,
        },
        STORAGE_KEYS: {
            DEFAULT_SEARCH_TYPE: 'anubis_default_search_type',
            DEFAULT_END_PAGE: 'anubis_default_end_page',
            DEFAULT_DATE_RANGE: 'anubis_default_date_range',
            BUTTON_POSITION: 'anubis_button_position',
            FILTER_RECO_ENABLED: 'anubis_filter_reco_enabled',
            FILTER_COMMENTS_ENABLED: 'anubis_filter_comments_enabled',
            FILTER_VIEWS_ENABLED: 'anubis_filter_views_enabled',
            FILTER_MIN_RECO: 'anubis_filter_min_reco',
            FILTER_MIN_COMMENTS: 'anubis_filter_min_comments',
            FILTER_MIN_VIEWS: 'anubis_filter_min_views',
            FILTER_EXCLUDE_GALLCHU: 'anubis_filter_exclude_gallchu',
        },
        STYLES: `
            :root{--font-main:'Malgun Gothic',sans-serif;--font-size-base:13px;--font-size-header:16px;--font-size-progress:12px;--color-bg:#fff;--color-border:#ddd;--color-border-light:#e0e0e0;--color-border-dark:#ccc;--color-text-primary:#333;--color-text-secondary:#777;--color-text-link:inherit;--color-text-inverse:#fff;--color-accent:#3b4890;--color-btn-confirm-bg:#333;--color-btn-confirm-text:#fff;--color-btn-cancel-bg:#fff;--color-btn-cancel-text:#333;--color-progress-bg:#e9ecef;--color-progress-bar:#3b4890;--color-input-bg:#fff;--color-input-text:#555;--color-toggle-bg:#ccc;--color-row-hover:#f5f5f5;--svg-arrow-fill:'%23333333'}
            body.anubis-dark-theme{--color-bg:#1f1f1f;--color-border:#4a4b4f;--color-border-light:#444549;--color-border-dark:#555;--color-text-primary:#ccc;--color-text-secondary:#aaa;--color-accent:#5865f2;--color-btn-confirm-bg:#eee;--color-btn-confirm-text:#333;--color-btn-cancel-bg:#444;--color-btn-cancel-text:#e8e8e8;--color-progress-bg:#495057;--color-progress-bar:#5865f2;--color-input-bg:#1f1f1f;--color-input-text:#ccc;--color-toggle-bg:#555;--color-row-hover:#2a2b2d;--svg-arrow-fill:'%23cccccc'}
            .anubis-chamber{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10001;display:none;font-family:var(--font-main);background-color:var(--color-bg);border:1px solid var(--color-border);color:var(--color-text-primary);border-radius:0;box-shadow:0 5px 25px rgba(0,0,0,.2);transition:background-color .3s,color .3s,border-color .3s,width .3s ease}
            .anubis-chamber-header{display:flex;justify-content:space-between;align-items:center;padding:15px 20px;border-bottom:1px solid var(--color-border-light);font-size:var(--font-size-header);font-weight:700}
            .anubis-chamber-close{background:0 0;border:none;font-size:24px;font-weight:700;color:var(--color-text-secondary);cursor:pointer;transition:color .2s}
            .anubis-chamber-close:hover:not(:disabled){color:var(--color-text-primary)}
            .anubis-chamber-close:disabled{opacity:.6;cursor:not-allowed}
            .anubis-chamber-body{padding:20px}
            .anubis-chamber-footer{display:flex;justify-content:space-between;align-items:center;padding:15px 20px}
            #anubis-settings-chamber{width:400px;max-width:95%}
            #anubis-search-chamber,#anubis-direct-search-chamber,#anubis-filter-chamber{width:450px}
            #anubis-results-chamber{width:800px;max-width:95%}
            #anobis-results-chamber.loading-state{width:600px}
            .anubis-form-group{margin-bottom:20px}
            .anubis-form-label,.anubis-settings-label{display:block;font-weight:700;font-size:var(--font-size-base);color:var(--color-text-primary);margin-bottom:8px}
            .anubis-form-description{font-size:var(--font-size-base);color:var(--color-text-secondary);margin-top:4px;margin-bottom:10px}
            #anubis-search-chamber .anubis-form-group .anubis-form-description{margin-bottom:15px}
            .anubis-input-group,.anubis-radio-group{display:flex;align-items:center;gap:10px}
            .anubis-radio-group{flex-wrap:wrap}
            .anubis-radio-group label{cursor:pointer;font-size:var(--font-size-base)}
            .anubis-text-input,.anubis-page-input,.anubis-date-input,.anubis-select-input{padding:8px;border:1px solid var(--color-border-dark);border-radius:0;font-size:var(--font-size-base);background-color:var(--color-input-bg);color:var(--color-input-text);box-sizing:border-box;transition:border-color .2s,background-color .3s,color .3s}
            .anubis-text-input:focus,.anubis-page-input:focus,.anubis-date-input:focus,.anubis-select-input:focus{outline:0;border-color:var(--color-text-primary)}
            .anubis-text-input{width:100%}
            .anubis-page-input{width:100px;text-align:center;-moz-appearance:textfield}
            .anubis-page-input::-webkit-outer-spin-button,.anubis-page-input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
            .anubis-date-input{width:150px}
            body.anubis-dark-theme .anubis-date-input{color-scheme:dark}
            .anubis-select-input{width:100%;-webkit-appearance:none;-moz-appearance:none;appearance:none;background-image:url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22' || var(--svg-arrow-fill) || '%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E');background-repeat:no-repeat;background-position:right 10px center;background-size:10px;padding-right:30px}
            body.anubis-dark-theme .anubis-select-input option{background:var(--color-input-bg);color:var(--color-input-text)}
            .anubis-slider-container{display:flex;align-items:center;gap:15px}
            .anubis-slider{flex-grow:1;-webkit-appearance:none;width:100%;height:8px;background:linear-gradient(to right,var(--color-accent) 0%,var(--color-accent) var(--slider-progress,0%),var(--color-border-light) var(--slider-progress,0%),var(--color-border-light) 100%);outline:none;border-radius:4px}
            .anubis-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:18px;height:18px;background:var(--color-accent);cursor:pointer;border-radius:50%}
            .anobis-slider::-moz-range-thumb{width:18px;height:18px;background:var(--color-accent);cursor:pointer;border-radius:50%;border:none}
            .anubis-slider-value{min-width:40px;text-align:center}
            .anubis-button-group{display:flex;gap:10px}
            .anubis-btn{padding:8px 25px;border:1px solid var(--color-border-dark);border-radius:4px;cursor:pointer;font-weight:700;font-size:var(--font-size-base);text-align:center;flex-shrink:0;transition:filter .2s,opacity .2s}
            .anubis-btn:hover:not(:disabled){filter:brightness(.9)}
            .anubis-btn:disabled{opacity:.6;cursor:not-allowed}
            .anubis-confirm-btn{background-color:var(--color-btn-confirm-bg);color:var(--color-btn-confirm-text);border-color:var(--color-btn-confirm-bg)}
            .anubis-confirm-btn:hover:not(:disabled){filter:brightness(1.4)}
            body.anubis-dark-theme .anubis-confirm-btn:hover:not(:disabled){filter:brightness(.85)}
            .anubis-cancel-btn{background-color:var(--color-btn-cancel-bg);color:var(--color-btn-cancel-text);border-color:var(--color-border-dark)}
            body.anubis-dark-theme .anubis-cancel-btn:hover:not(:disabled){filter:brightness(.8)}
            .anubis-progress-container{margin-top:5px}
            .anubis-progress-wrapper{position:relative;height:18px;background-color:var(--color-progress-bg);border-radius:4px;overflow:hidden}
            .anubis-progress-bar{width:0;height:100%;background-color:var(--color-progress-bar);transition:width .3s ease}
            .anubis-progress-text{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:var(--color-text-inverse);font-size:var(--font-size-progress);font-weight:700;text-shadow:1px 1px 2px rgba(0,0,0,.5)}
            body.anubis-dark-theme .anubis-progress-text{color:#fff}
            #anubis-results-chamber .anubis-chamber-body{padding:0}
            .anubis-status-container{padding:20px}
            .anubis-status-container.finished{padding:15px 20px 10px}
            .anubis-search-info-line,.anubis-date-filter-line,.anubis-status-text,.anubis-user-info{font-size:var(--font-size-base);color:var(--color-text-primary)}
            .anubis-results-list{list-style:none;padding:0 20px 10px;margin:0;max-height:60vh;overflow-y:auto}
            .anubis-results-header,.anubis-results-row{display:flex;align-items:flex-start;padding:9px 0;border-bottom:1px solid #f0f0f0;font-size:var(--font-size-base);transition:background-color .2s}
            body.anubis-dark-theme .anubis-results-header,body.anubis-dark-theme .anubis-results-row{border-bottom-color:var(--color-border-light)}
            .anubis-results-header{font-weight:700;border-bottom-width:2px;border-bottom-color:var(--color-border-light)}
            .anubis-results-row:last-child{border-bottom:none}
            .anubis-results-row:not(.no-results):hover{background-color:var(--color-row-hover)}
            .anubis-results-row a{text-decoration:none;color:var(--color-text-link)}
            .anubis-results-row a:hover{text-decoration:underline}
            .anubis-comment-count{color:var(--color-text-secondary);font-weight:400;padding-left:4px}
            .col-no{width:70px;text-align:center;flex-shrink:0}
            .col-title{flex-grow:1;text-align:left;word-break:break-all}
            .col-date{width:110px;text-align:center;flex-shrink:0}
            .col-views,.col-reco{width:60px;text-align:center;flex-shrink:0}
            .anubis-settings-item{display:flex;justify-content:space-between;align-items:center}
            .anubis-settings-item-sub{padding-left:15px;margin-top:15px}
            #anubis-settings-save-status{color:var(--color-text-secondary);font-size:var(--font-size-base);margin-right:auto;display:none}
            #anubis-top-btn-wrapper{display:inline-flex;align-items:center;gap:2px}
            .anubis-top-icon-btn{display:flex;align-items:center;justify-content:center;width:21px;height:21px;box-sizing:border-box;border:1px solid var(--color-border-dark);background-color:var(--color-bg);border-radius:0;cursor:pointer;color:var(--color-text-secondary)}
            .anubis-top-icon-btn svg{color:var(--color-text-secondary)}
            body.anubis-dark-theme .anubis-top-icon-btn{border-color:var(--color-border)}
            body.anubis-dark-theme .anubis-top-icon-btn svg{color:var(--color-text-secondary)}
            .anubis-top-icon-btn.no-border{border:none}
            .anubis-filter-group{display:flex;align-items:center;justify-content:flex-start;gap:10px}
            .anubis-filter-group-label-wrapper{display:flex;align-items:center;gap:5px}
            .anubis-filter-group-label-wrapper .anubis-form-label{margin-bottom:0;cursor:pointer}
            .anubis-filter-input{padding:4px 8px!important}
            .anubis-filter-input:disabled{background-color:var(--color-row-hover)!important;opacity:.7}
            .anubis-tooltip-wrapper{position:relative;display:inline-flex;align-items:center}
            .anubis-tooltip-icon{cursor:pointer;font-weight:700;color:var(--color-text-secondary);border:1px solid var(--color-text-secondary);border-radius:50%;width:14px;height:14px;display:inline-flex;justify-content:center;align-items:center;font-size:10px;line-height:1}
            .anubis-tooltip-text{visibility:hidden;width:350px;background-color:var(--color-bg);color:var(--color-text-primary);text-align:left;border-radius:4px;padding:8px 12px;position:absolute;z-index:10002;bottom:150%;left:50%;transform:translateX(-50%);opacity:0;transition:opacity .3s;font-size:var(--font-size-base);font-weight:400;line-height:1.4;box-shadow:0 2px 5px rgba(0,0,0,.2);border:1px solid var(--color-border-dark)}
            .anubis-tooltip-text::before{content:"";position:absolute;top:100%;left:50%;margin-left:-6px;border-width:6px;border-style:solid;border-color:var(--color-border-dark) transparent transparent transparent;z-index:10001}
            .anubis-tooltip-text::after{content:"";position:absolute;top:100%;left:50%;margin-left:-5px;border-width:5px;border-style:solid;border-color:var(--color-bg) transparent transparent transparent;z-index:10002}
            .anubis-tooltip-wrapper:hover .anubis-tooltip-text{visibility:visible;opacity:1}
        `,
    };

    // --- TEMPLATES ---
    const TEMPLATES = {
        _create: {
            formGroup: ({ id, label, description, contentHTML, style = '' }) => `
                <div id="${id || ''}" class="anubis-form-group" style="${style}">
                    <label class="anubis-form-label">${label}</label>
                    ${description ? `<p class="anubis-form-description">${description}</p>` : ''}
                    ${contentHTML}
                </div>`,
            inputGroup: (contentHTML) => `<div class="anubis-input-group">${contentHTML}</div>`,
            button: ({ id, text, classes = [] }) => `<button id="${id}" class="anubis-btn ${classes.join(' ')}">${text}</button>`,
            slider: ({ id, min, max, value, unit }) => `
                <div class="anubis-slider-container">
                    <input type="range" id="${id}" min="${min}" max="${max}" value="${value}" class="anubis-slider">
                    <span id="${id}-value" class="anubis-slider-value">${value}${unit}</span>
                </div>`,
            gallerySelector: (idPrefix) => `
                <div style="width: 70%;">
                    <select class="anubis-select-input" id="${idPrefix}-gallery-select" style="width: 100%;"></select>
                </div>
                <div id="${idPrefix}-gallery-direct-input-container" style="display: none; margin-top: 10px; width: 100%;">
                    <div style="width: 70%; margin-bottom: 10px;">
                        <input type="text" class="anubis-text-input" id="${idPrefix}-gallery-direct-input" placeholder="갤러리 ID (갤러리명X)" style="width: 100%;">
                    </div>
                    <div class="anubis-radio-group">
                        <label><input type="radio" name="${idPrefix}-gallery-type" value="board" checked> 정식</label>
                        <label><input type="radio" name="${idPrefix}-gallery-type" value="mgallery"> 마이너</label>
                        <label><input type="radio" name="${idPrefix}-gallery-type" value="mini"> 미니</label>
                        <label><input type="radio" name="${idPrefix}-gallery-type" value="person"> 인물</label>
                    </div>
                </div>`,
            tooltip: (text) => `
                <div class="anubis-tooltip-wrapper">
                    <span class="anubis-tooltip-icon">i</span>
                    <div class="anubis-tooltip-text">${text}</div>
                </div>`,
        },

        chamber({ id, title, bodyHTML, footerHTML, extraClasses = [] }) {
            return `
                <div id="${id}" class="${CONFIG.CLASSES.MODAL} ${extraClasses.join(' ')}">
                    <div class="anubis-chamber-header">
                        <span>${title}</span>
                        <button class="anubis-chamber-close">&times;</button>
                    </div>
                    <div class="anubis-chamber-body">${bodyHTML}</div>
                    ${footerHTML ? `<div class="anubis-chamber-footer">${footerHTML}</div>` : ''}
                </div>`;
        },

        searchChamber({ userInfo }) {
            const C = this._create;
            const tooltipText = '설정한 날짜가 지나치게 과거일 경우<br>페이지 이동을 통해 대략적인 페이지 위치를 파악한 후에<br>검색을 시작할 페이지를 설정해 주세요';
            const body = `
                ${C.formGroup({ label: '글쓴이', contentHTML: `<div class="anubis-user-info">${userInfo.displayName}</div>` })}
                ${C.formGroup({ label: '갤러리 선택', contentHTML: C.gallerySelector('anubis-search') })}
                ${C.formGroup({
                    label: '검색 범위 유형',
                    description: '검색 범위를 설정할 유형입니다',
                    contentHTML: `<div style="width: 50%;"><select class="anubis-select-input" id="anubis-search-type"><option value="page">페이지</option><option value="date">날짜</option></select></div>`
                })}
                ${C.formGroup({
                    id: 'anubis-page-range-options',
                    label: '페이지 범위',
                    description: `설정한 페이지의 게시글을 검색합니다 (최대 ${CONFIG.CONSTANTS.MAX_SEARCH_PAGES}페이지)`,
                    contentHTML: C.inputGroup(`<input type="number" class="anubis-page-input" id="anubis-start-page" min="1" value="1"><span>-</span><input type="number" class="anubis-page-input" id="anubis-end-page" min="1">`)
                })}
                <div id="anubis-date-options-wrapper" style="display: none;">
                    ${C.formGroup({
                        label: `<div style="display: flex; align-items: center; gap: 5px;"><b>시작 페이지</b>${C.tooltip(tooltipText)}</div>`,
                        description: '검색을 시작할 페이지를 설정합니다',
                        contentHTML: `<div style="width: 25%;"><input type="number" class="anubis-page-input" id="anubis-date-start-page" min="1" value="1" style="width: 100%;"></div>`
                    })}
                    ${C.formGroup({
                        label: '날짜 범위',
                        description: `설정한 날짜의 결과를 출력합니다 (최대 ${CONFIG.CONSTANTS.MAX_DATE_SEARCH_DAYS}일)`,
                        contentHTML: C.inputGroup(`<input type="date" class="anubis-date-input" id="anubis-start-date"><span>-</span><input type="date" class="anubis-date-input" id="anubis-end-date">`)
                    })}
                </div>`;
            const footer = `<div class="anubis-button-group" style="justify-content: flex-end; width: 100%;">
                    ${C.button({ id: 'anubis-search-confirm', text: '검색', classes: ['anubis-confirm-btn'] })}
                    ${C.button({ id: 'anubis-search-cancel', text: '취소', classes: ['anubis-cancel-btn'] })}
                </div>`;
            return this.chamber({ id: CONFIG.IDS.SEARCH_MODAL, title: '고급 작성글 검색', bodyHTML: body, footerHTML: footer });
        },

        directSearchChamber() {
            const C = this._create;
            const tooltipText = '설정한 날짜가 지나치게 과거일 경우<br>페이지 이동을 통해 대략적인 페이지 위치를 파악한 후에<br>검색을 시작할 페이지를 설정해 주세요';
            const body = `
                ${C.formGroup({
                    label: '글쓴이',
                    contentHTML: `<input type="text" id="anubis-direct-search-user-input" class="anubis-text-input" placeholder="식별 코드 또는 IP를 입력해주세요">`
                })}
                ${C.formGroup({ label: '갤러리 선택', contentHTML: C.gallerySelector('anubis-direct-search') })}
                ${C.formGroup({
                    label: '검색 범위 유형',
                    description: '검색 범위를 설정할 유형입니다',
                    contentHTML: `<div style="width: 50%;"><select class="anubis-select-input" id="anubis-direct-search-type"><option value="page">페이지</option><option value="date">날짜</option></select></div>`
                })}
                ${C.formGroup({
                    id: 'anubis-direct-page-range-options',
                    label: '페이지 범위',
                    description: `설정한 페이지의 게시글을 검색합니다 (최대 ${CONFIG.CONSTANTS.MAX_SEARCH_PAGES}페이지)`,
                    contentHTML: C.inputGroup(`<input type="number" class="anubis-page-input" id="anubis-direct-start-page" min="1" value="1"><span>-</span><input type="number" class="anubis-page-input" id="anubis-direct-end-page" min="1">`)
                })}
                <div id="anubis-direct-date-options-wrapper" style="display: none;">
                     ${C.formGroup({
                        label: `<div style="display: flex; align-items: center; gap: 5px;"><b>시작 페이지</b>${C.tooltip(tooltipText)}</div>`,
                        description: '검색을 시작할 페이지를 설정합니다',
                        contentHTML: `<div style="width: 25%;"><input type="number" class="anubis-page-input" id="anubis-direct-date-start-page" min="1" value="1" style="width: 100%;"></div>`
                    })}
                    ${C.formGroup({
                        label: '날짜 범위',
                        description: `설정한 날짜의 결과를 출력합니다 (최대 ${CONFIG.CONSTANTS.MAX_DATE_SEARCH_DAYS}일)`,
                        contentHTML: C.inputGroup(`<input type="date" class="anubis-date-input" id="anubis-direct-start-date"><span>-</span><input type="date" class="anubis-date-input" id="anubis-direct-end-date">`)
                    })}
                </div>`;
            const footer = `<div class="anubis-button-group" style="justify-content: flex-end; width: 100%;">
                    ${C.button({ id: 'anubis-direct-search-confirm', text: '검색', classes: ['anubis-confirm-btn'] })}
                    ${C.button({ id: 'anubis-direct-search-cancel', text: '취소', classes: ['anubis-cancel-btn'] })}
                </div>`;
            return this.chamber({ id: CONFIG.IDS.DIRECT_SEARCH_MODAL, title: '고급 작성글 검색', bodyHTML: body, footerHTML: footer });
        },

        filterChamber() {
            const C = this._create;
            const tooltipText = '설정한 날짜가 지나치게 과거일 경우<br>페이지 이동을 통해 대략적인 페이지 위치를 파악한 후에<br>검색을 시작할 페이지를 설정해 주세요';
            const createFilterGroup = (id, label) => `
                <div class="anubis-form-group anubis-filter-group" style="margin-bottom: 15px;">
                    <div class="anubis-filter-group-label-wrapper">
                         <input type="checkbox" id="anubis-filter-${id}-enabled" style="transform: scale(1.2);">
                         <label for="anubis-filter-${id}-enabled" class="anubis-form-label">${label}</label>
                    </div>
                    <div class="anubis-input-group">
                        <input type="number" class="anubis-page-input anubis-filter-input" id="anubis-filter-${id}" min="0" placeholder="0">
                        <span>이상</span>
                    </div>
                </div>`;

            const body = `
                <div class="anubis-form-group" style="display: flex; align-items: center; justify-content: flex-start; margin-bottom: 25px;">
                    <label class="anubis-form-label" style="margin-bottom: 0; margin-right: 10px;">개념글 제외</label>
                    <input type="checkbox" id="anubis-filter-exclude-gallchu" style="transform: scale(1.2);">
                </div>
                ${createFilterGroup('reco', '추천 수')}
                ${createFilterGroup('comments', '댓글 수')}
                ${createFilterGroup('views', '조회 수')}
                ${C.formGroup({
                    label: '검색 범위 유형',
                    description: '검색 범위를 설정할 유형입니다',
                    contentHTML: `<div style="width: 50%;"><select class="anubis-select-input" id="anubis-filter-search-type"><option value="page">페이지</option><option value="date">날짜</option></select></div>`
                })}
                ${C.formGroup({
                    id: 'anubis-filter-page-range-options',
                    label: '페이지 범위',
                    description: `설정한 페이지의 게시글을 검색합니다 (최대 ${CONFIG.CONSTANTS.MAX_SEARCH_PAGES}페이지)`,
                    contentHTML: C.inputGroup(`<input type="number" class="anubis-page-input" id="anubis-filter-start-page" min="1" value="1"><span>-</span><input type="number" class="anubis-page-input" id="anubis-filter-end-page" min="1">`)
                })}
                <div id="anubis-filter-date-options-wrapper" style="display: none;">
                    ${C.formGroup({
                        label: `<div style="display: flex; align-items: center; gap: 5px;"><b>시작 페이지</b>${C.tooltip(tooltipText)}</div>`,
                        description: '검색을 시작할 페이지를 설정합니다',
                        contentHTML: `<div style="width: 25%;"><input type="number" class="anubis-page-input" id="anubis-filter-date-start-page" min="1" value="1" style="width: 100%;"></div>`
                    })}
                    ${C.formGroup({
                        label: '날짜 범위',
                        description: `설정한 날짜의 결과를 출력합니다 (최대 ${CONFIG.CONSTANTS.MAX_DATE_SEARCH_DAYS}일)`,
                        contentHTML: C.inputGroup(`<input type="date" class="anubis-date-input" id="anubis-filter-start-date"><span>-</span><input type="date" class="anubis-date-input" id="anubis-filter-end-date">`)
                    })}
                </div>`;
            const footer = `<div class="anubis-button-group" style="justify-content: flex-end; width: 100%;">
                    ${C.button({ id: 'anubis-filter-confirm', text: '검색', classes: ['anubis-confirm-btn'] })}
                    ${C.button({ id: 'anubis-filter-cancel', text: '취소', classes: ['anubis-cancel-btn'] })}
                </div>`;
            return this.chamber({ id: CONFIG.IDS.FILTER_MODAL, title: '필터링 검색', bodyHTML: body, footerHTML: footer });
        },

        resultsChamber(data) {
            const { isLoading } = data;
            const body = isLoading ? this._resultsLoadingBody(data) : this._resultsDoneBody(data);
            return this.chamber({
                id: CONFIG.IDS.RESULTS_MODAL,
                title: isLoading ? '검색 중' : '검색 결과',
                bodyHTML: body,
                footerHTML: isLoading ? '' : `<div class="anubis-button-group"></div>`,
                extraClasses: isLoading ? ['loading-state'] : []
            });
        },

        _resultsLoadingBody({ userInfo, statusText, progress, galleryDisplayName }) {
            const infoLine = userInfo ? `${CORE_LOGIC.escapeHtml(galleryDisplayName)} → ${CORE_LOGIC.escapeHtml(userInfo.displayName)}` : `${CORE_LOGIC.escapeHtml(galleryDisplayName)}`;
            return `
                <div class="anubis-status-container loading">
                    <p id="${CONFIG.IDS.SEARCH_INFO_TEXT}" class="anubis-search-info-line">${infoLine}</p>
                    <p class="anubis-status-text">${statusText}</p>
                    <div class="anubis-progress-container">
                        <div class="anubis-progress-wrapper">
                            <div class="anubis-progress-bar" style="width: ${progress}%;"></div>
                            <span class="anubis-progress-text">${progress}%</span>
                        </div>
                    </div>
                </div>`;
        },

        _resultsDoneBody({ posts, statusText, galleryDisplayName, startDate, endDate, userInfo }) {
            const infoLine = userInfo ? `${CORE_LOGIC.escapeHtml(galleryDisplayName)} → ${CORE_LOGIC.escapeHtml(userInfo.displayName)}` : `${CORE_LOGIC.escapeHtml(galleryDisplayName)}`;
            const formatDate = (dateStr) => dateStr.replaceAll('-', '.').slice(2);
            const dateFilterLine = (startDate || endDate) ? `<p class="anubis-date-filter-line">(${startDate ? formatDate(startDate) : ''} ~ ${endDate ? formatDate(endDate) : ''})</p>` : '';
            const resultsHeader = `
                <div class="anubis-results-header">
                    <div class="col-no">번호</div><div class="col-title">제목</div><div class="col-date">작성일</div>
                    <div class="col-views">조회</div><div class="col-reco">추천</div>
                </div>`;
            const postListHTML = posts.length > 0
                ? posts.map(post => {
                    const d = new Date(post.timestamp);
                    const pad = (num) => String(num).padStart(2, '0');
                    const postDate = `${String(d.getFullYear()).slice(2)}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
                    return `
                        <div class="anubis-results-row">
                            <div class="col-no">${post.postNo}</div>
                            <div class="col-title"><a href="${post.url}" target="_blank" rel="noopener noreferrer">${CORE_LOGIC.escapeHtml(post.title)}</a><span class="anubis-comment-count">${post.commentCount > 0 ? `[${post.commentCount}]` : ''}</span></div>
                            <div class="col-date">${postDate}</div>
                            <div class="col-views">${post.views}</div>
                            <div class="col-reco">${post.reco}</div>
                        </div>`;
                }).join('')
                : '<div class="anubis-results-row no-results" style="justify-content:center;">검색 결과가 없습니다.</div>';
            return `
                <div class="anubis-status-container finished">
                    <p class="anubis-search-info-line">${infoLine}</p>
                    ${dateFilterLine}
                    <p class="anubis-status-text">${statusText}</p>
                </div>
                <div class="anubis-results-list">${resultsHeader}${postListHTML}</div>`;
        },

        settingsChamber() {
            const C = this._create;
            const body = `
                ${C.formGroup({
                    label: '추가 버튼 생성 위치',
                    contentHTML: `
                        <div style="width: 50%;">
                            <select class="anubis-select-input" id="anubis-button-position">
                                <option value="bottom">하단</option>
                                <option value="top">상단</option>
                            </select>
                        </div>
                    `
                })}
                ${C.formGroup({
                    label: '기본 검색 범위 유형',
                    contentHTML: `<div style="width: 50%;"><select class="anubis-select-input" id="anubis-default-search-type"><option value="page">페이지</option><option value="date">날짜</option></select></div>`
                })}
                ${C.formGroup({
                    label: '기본 검색 페이지 범위',
                    contentHTML: C.slider({ id: 'anubis-default-end-page', min: 1, max: CONFIG.CONSTANTS.MAX_SEARCH_PAGES, value: 20, unit: 'p' })
                })}
                ${C.formGroup({
                    label: '기본 검색 날짜 범위',
                    contentHTML: C.slider({ id: 'anubis-default-date-range', min: 1, max: CONFIG.CONSTANTS.MAX_DATE_SEARCH_DAYS, value: 1, unit: '일' })
                })}
                <div class="anubis-settings-item-sub">
                </div>`;
            const footer = `
                ${C.button({ id: 'anubis-reset-settings', text: '설정 초기화', classes: ['anubis-cancel-btn'] })}
                <div class="anubis-button-group" style="align-items: center;">
                    <span id="anubis-settings-save-status"></span>
                    ${C.button({ id: 'anubis-settings-save', text: '저장', classes: ['anubis-confirm-btn'] })}
                </div>`;
            return this.chamber({ id: CONFIG.IDS.SETTINGS_MODAL, title: 'ANUBIS 설정', bodyHTML: body, footerHTML: footer });
        },
    };

    // --- DOM UTILITIES ---
    const DOM_UTILS = {
        injectStyles: () => {
            if (document.getElementById(CONFIG.IDS.STYLES)) return;
            const styleSheet = document.createElement('style');
            styleSheet.id = CONFIG.IDS.STYLES;
            styleSheet.innerText = CONFIG.STYLES;
            document.head.appendChild(styleSheet);
        },

        isDarkMode: () => !!document.getElementById('css-darkmode'),

        updateTheme: () => document.body.classList.toggle(CONFIG.CLASSES.DARK_THEME, DOM_UTILS.isDarkMode()),

        showChamber(id, innerHTML, onClose) {
            this.hideChamber(id);
            const chamberWrapper = document.createElement('div');
            chamberWrapper.innerHTML = innerHTML;
            const newChamber = chamberWrapper.firstElementChild;
            document.body.appendChild(newChamber);
            newChamber.style.display = 'block';
            newChamber.querySelector('.anubis-chamber-close')?.addEventListener('click', () => {
                let shouldClose = true;
                if (onClose) shouldClose = onClose();
                if (shouldClose !== false) this.hideChamber(id);
            });
            return newChamber;
        },

        hideChamber: (id) => document.getElementById(id)?.remove(),

        createAdvancedSearchButton(popupUlElement) {
            const listItem = document.createElement('li');
            listItem.id = CONFIG.IDS.ADVANCED_SEARCH_BTN;
            listItem.className = 'bg_grey';
            listItem.innerHTML = `<a href="javascript:void(0);">고급 검색<em class="sp_img icon_go"></em></a>`;
            listItem.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                CORE_LOGIC.openSearchChamber(popupUlElement);
                popupUlElement.closest('.user_data_lyr')?.style.setProperty('display', 'none');
            });
            const target = Array.from(popupUlElement.querySelectorAll('li a')).find(a => a.textContent.trim() === '작성글 검색');
            if (target) target.parentElement.before(listItem);
            else popupUlElement.appendChild(listItem);
        },

        createTopButtons() {
            const rightBox = document.querySelector(CONFIG.SELECTORS.TOP_AREA_RIGHT);
            const topBox = document.querySelector(CONFIG.SELECTORS.GALLERY_ISSUE_BOX_RIGHT);
            if ((!rightBox && !topBox) || document.getElementById(CONFIG.IDS.QUICK_SEARCH_BTN) || document.getElementById(CONFIG.IDS.QUICK_FILTER_BTN)) return;

            const buttonPosition = CORE_LOGIC.settings.buttonPosition;

            if (buttonPosition === 'top' && topBox) {
                const searchBtn = document.createElement('button');
                searchBtn.type = 'button';
                searchBtn.id = CONFIG.IDS.QUICK_SEARCH_BTN;
                searchBtn.className = 'relate';
                searchBtn.textContent = 'S';
                searchBtn.style.marginLeft = '2px';
                searchBtn.addEventListener('click', () => CORE_LOGIC.openDirectSearchChamber());

                const filterBtn = document.createElement('button');
                filterBtn.type = 'button';
                filterBtn.id = CONFIG.IDS.QUICK_FILTER_BTN;
                filterBtn.className = 'relate';
                filterBtn.textContent = 'F';
                filterBtn.style.marginLeft = '2px';
                filterBtn.addEventListener('click', () => CORE_LOGIC.openFilterChamber());

                topBox.prepend(filterBtn);
                topBox.prepend(searchBtn);

            } else if (rightBox) { // '하단' 위치 또는 기본값
                const wrapper = document.createElement('div');
                wrapper.id = CONFIG.IDS.TOP_BTN_WRAPPER;

                const searchBtn = document.createElement('span');
                searchBtn.id = CONFIG.IDS.QUICK_SEARCH_BTN;
                searchBtn.className = CONFIG.CLASSES.TOP_ICON_BTN;
                searchBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 48 48" fill="currentColor"><path d="m47.008 41.814-14.992-14.685c1.754-2.77 2.68-5.968 2.68-9.262c0-9.565-7.783-17.349-17.348-17.349-9.565 0-17.348 7.783-17.348 17.349 0 9.565 7.783 17.346 17.348 17.346 3.654 0 7.151-1.133 10.127-3.281l14.908 14.605c.621.609 1.441.945 2.313.945.896 0 1.736-.354 2.363-.994 1.274-1.302 1.252-3.398-.051-4.674zm-29.66-11.396c-6.92 0-12.55-5.631-12.55-12.551s5.63-12.55 12.55-12.55 12.549 5.63 12.549 12.55c0 3.259-1.242 6.347-3.5 8.696-2.39 2.486-5.604 3.855-9.049 3.855z"></path></svg>`;
                searchBtn.addEventListener('click', () => CORE_LOGIC.openDirectSearchChamber());

                const filterBtn = document.createElement('span');
                filterBtn.id = CONFIG.IDS.QUICK_FILTER_BTN;
                filterBtn.className = CONFIG.CLASSES.TOP_ICON_BTN;
                filterBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M21.877,2.5186A1,1,0,0,0,21,2H3a1,1,0,0,0-.8437,1.5371L9,14.291V19a1,1,0,0,0,.5527.8945l4,2A1,1,0,0,0,15,21V14.291L21.8438,3.5371A1.0021,1.0021,0,0,0,21.877,2.5186ZM13.1563,13.4629A1.0062,1.0062,0,0,0,13,14v5.3818l-2-1V14a1.007,1.007,0,0,0-.1562-.5371L4.8213,4H19.1787Z"></path></svg>`;
                filterBtn.addEventListener('click', () => CORE_LOGIC.openFilterChamber());

                wrapper.appendChild(searchBtn);
                wrapper.appendChild(filterBtn);

                const anchorDiv = rightBox.querySelector('.output_array');
                wrapper.style.marginRight = '2px';
                if (anchorDiv) {
                    anchorDiv.style.display = 'flex';
                    anchorDiv.style.alignItems = 'center';
                    anchorDiv.prepend(wrapper);
                } else {
                    wrapper.style.float = 'left';
                    rightBox.prepend(wrapper);
                }
            }
        },
    };

    // --- DATA PARSERS ---
    const DATA_PARSER = {
        extractUserInfo(popupUlElement) {
            const writerElement = popupUlElement.closest(CONFIG.SELECTORS.POST_CONTAINER)?.querySelector(CONFIG.SELECTORS.WRITER_INFO);
            if (!writerElement) return null;
            const nick = writerElement.dataset.nick?.trim();
            const uid = writerElement.dataset.uid?.trim();
            const ip = writerElement.dataset.ip?.trim();
            const filterKey = uid ? `id:${uid}` : (ip ? `ip:${ip}` : null);
            if (!filterKey) return null;
            let displayName = '정보 없음';
            if (uid) displayName = `${nick} (${uid})`;
            else if (ip) displayName = (nick && nick !== ip) ? `${nick} (${ip})` : `유동 (${ip})`;
            return { displayName, filterKey, nick };
        },

        getRecentGalleries() {
            const list = document.querySelector(CONFIG.SELECTORS.RECENT_GALLERY_LIST);
            if (!list) return [];
            const galleries = [];
            list.querySelectorAll(CONFIG.SELECTORS.RECENT_GALLERY_LINK).forEach(link => {
                try {
                    const url = new URL(link.href);
                    const id = url.searchParams.get('id');
                    const type = url.pathname.split('/').filter(Boolean)[0];
                    const name = link.textContent.trim();
                    if (id && name) galleries.push({ id, name, type });
                } catch (e) { console.error("ANUBIS: 갤러리 정보 파싱 중 오류", e); }
            });
            return galleries;
        },

        parseGalleryNameFromHtml(html) {
            const doc = new DOMParser().parseFromString(html, "text/html");
            const el = doc.querySelector(CONFIG.SELECTORS.CURRENT_GALLERY_NAME);
            if (!el) return null;
            const clone = el.cloneNode(true);
            clone.querySelectorAll('em, span').forEach(e => e.remove());
            return clone.textContent.trim();
        },

        parseUserPostsFromHtml(html, targetFilterKey, galleryId, galleryType) {
            const doc = new DOMParser().parseFromString(html, "text/html");
            const posts = [];
            const path = galleryType === 'board' ? 'board' : `${galleryType}/board`;
            doc.querySelectorAll(CONFIG.SELECTORS.POST_ROW).forEach(tr => {
                const writerEl = tr.querySelector(CONFIG.SELECTORS.WRITER_INFO);
                if (!writerEl) return;
                const uid = writerEl.dataset.uid?.trim();
                const ip = writerEl.dataset.ip?.trim();
                const currentKey = uid ? `id:${uid}` : (ip ? `ip:${ip}` : null);
                if (currentKey !== targetFilterKey) return;

                const titleEl = tr.querySelector(CONFIG.SELECTORS.POST_TITLE);
                const postNo = tr.dataset.no;
                const timestamp = tr.querySelector(CONFIG.SELECTORS.POST_DATE)?.title;
                if (!titleEl || !postNo || !timestamp) return;

                posts.push({
                    title: titleEl.textContent.trim(),
                    url: `https://gall.dcinside.com/${path}/view/?id=${galleryId}&no=${postNo}`,
                    timestamp, postNo,
                    views: tr.querySelector(CONFIG.SELECTORS.POST_VIEWS)?.textContent.trim() ?? '0',
                    reco: tr.querySelector(CONFIG.SELECTORS.POST_RECOMMEND)?.textContent.trim() ?? '0',
                    commentCount: parseInt(tr.querySelector(CONFIG.SELECTORS.POST_COMMENT_COUNT)?.textContent.replace(/[\[\]]/g, '') ?? '0', 10) || 0,
                });
            });
            return posts;
        },

        parseAllPostsFromHtml(html, galleryId, galleryType) {
            const doc = new DOMParser().parseFromString(html, "text/html");
            const posts = [];
            const path = galleryType === 'board' ? 'board' : `${galleryType}/board`;
            doc.querySelectorAll(CONFIG.SELECTORS.POST_ROW).forEach(tr => {
                const titleEl = tr.querySelector(CONFIG.SELECTORS.POST_TITLE);
                const postNo = tr.dataset.no;
                const timestamp = tr.querySelector(CONFIG.SELECTORS.POST_DATE)?.title;
                if (!titleEl || !postNo || !timestamp) return;

                posts.push({
                    title: titleEl.textContent.trim(),
                    url: `https://gall.dcinside.com/${path}/view/?id=${galleryId}&no=${postNo}`,
                    timestamp, postNo,
                    views: parseInt(tr.querySelector(CONFIG.SELECTORS.POST_VIEWS)?.textContent.trim() ?? '0', 10),
                    reco: parseInt(tr.querySelector(CONFIG.SELECTORS.POST_RECOMMEND)?.textContent.trim() ?? '0', 10),
                    commentCount: parseInt(tr.querySelector(CONFIG.SELECTORS.POST_COMMENT_COUNT)?.textContent.replace(/[\[\]]/g, '') ?? '0', 10) || 0,
                    dataType: tr.dataset.type,
                });
            });
            return posts;
        },
    };

    // --- CORE LOGIC ---
    const CORE_LOGIC = {
        settings: {},
        isSettingsDirty: false,
        currentUserInfo: null,
        isSearchCancelled: false,

        async initialize() {
            DOM_UTILS.injectStyles();
            await this.loadSettings();
            this.setupMenuCommands();
            this.setupObservers();
            if (window.location.href.includes('/board/lists')) {
                const interval = setInterval(() => {
                    if (document.querySelector(CONFIG.SELECTORS.TOP_AREA_RIGHT) || document.querySelector(CONFIG.SELECTORS.GALLERY_ISSUE_BOX_RIGHT)) {
                        setTimeout(() => {
                            DOM_UTILS.createTopButtons();
                        }, 50); // 다른 스크립트와의 충돌을 피하기 위해 0.05초 지연
                        clearInterval(interval);
                    }
                }, 100);
                setTimeout(() => clearInterval(interval), 10000);
            }
            DOM_UTILS.updateTheme();
        },

        async loadSettings() {
            const S = CONFIG.STORAGE_KEYS;
            this.settings.defaultSearchType = await GM_getValue(S.DEFAULT_SEARCH_TYPE, 'page');
            this.settings.defaultEndPage = await GM_getValue(S.DEFAULT_END_PAGE, 20);
            this.settings.defaultDateRange = await GM_getValue(S.DEFAULT_DATE_RANGE, 1);
            this.settings.buttonPosition = await GM_getValue(S.BUTTON_POSITION, 'bottom');
        },

        setupMenuCommands() {
            GM_registerMenuCommand('고급 검색 기본값 설정', () => this.openSettingsChamber());
        },

        setupObservers() {
            new MutationObserver(() => DOM_UTILS.updateTheme()).observe(document.head, { childList: true });
            new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType !== Node.ELEMENT_NODE) continue;
                        const popup = node.querySelector(CONFIG.SELECTORS.USER_POPUP_LIST) || (node.matches(CONFIG.SELECTORS.USER_POPUP_LIST) ? node : null);
                        if (popup && !popup.querySelector(`#${CONFIG.IDS.ADVANCED_SEARCH_BTN}`)) {
                            DOM_UTILS.createAdvancedSearchButton(popup);
                        }
                    }
                }
            }).observe(document.body, { childList: true, subtree: true });
        },

        openSearchChamber(popupUlElement) {
            const userInfo = DATA_PARSER.extractUserInfo(popupUlElement);
            if (!userInfo || !userInfo.filterKey) return alert('사용자 정보를 가져오는 데 실패했습니다.');
            this.currentUserInfo = userInfo;
            const modalHTML = TEMPLATES.searchChamber({ userInfo });
            const chamber = DOM_UTILS.showChamber(CONFIG.IDS.SEARCH_MODAL, modalHTML);
            this.bindSearchChamberEvents(chamber);
        },

        openDirectSearchChamber() {
            const modalHTML = TEMPLATES.directSearchChamber();
            const chamber = DOM_UTILS.showChamber(CONFIG.IDS.DIRECT_SEARCH_MODAL, modalHTML);
            this.bindDirectSearchChamberEvents(chamber);
        },

        async openFilterChamber() {
            const modalHTML = TEMPLATES.filterChamber();
            const chamber = DOM_UTILS.showChamber(CONFIG.IDS.FILTER_MODAL, modalHTML);
            await this.bindFilterChamberEvents(chamber);
        },

        bindSearchChamberEvents(chamber) {
            this._bindGallerySelector(chamber, 'anubis-search');
            const searchTypeSelect = chamber.querySelector('#anubis-search-type');
            const pageRangeOptions = chamber.querySelector('#anubis-page-range-options');
            const dateOptionsWrapper = chamber.querySelector('#anubis-date-options-wrapper');

            searchTypeSelect.addEventListener('change', () => {
                const isPage = searchTypeSelect.value === 'page';
                pageRangeOptions.style.display = isPage ? 'block' : 'none';
                dateOptionsWrapper.style.display = isPage ? 'none' : 'block';
            });

            chamber.querySelector('#anubis-end-page').value = this.settings.defaultEndPage;
            const today = new Date();
            chamber.querySelector('#anubis-end-date').value = today.toISOString().split('T')[0];
            today.setDate(today.getDate() - (this.settings.defaultDateRange - 1));
            chamber.querySelector('#anubis-start-date').value = today.toISOString().split('T')[0];
            searchTypeSelect.value = this.settings.defaultSearchType;
            searchTypeSelect.dispatchEvent(new Event('change'));

            chamber.querySelector('#anubis-search-confirm').addEventListener('click', () => {
                const galleryInfo = this._getGalleryInfoFromSelector(chamber, 'anubis-search');
                if (!galleryInfo.galleryId) return alert("갤러리를 선택하거나 ID를 입력해 주세요.");
                const baseParams = { userInfo: this.currentUserInfo, ...galleryInfo };
                DOM_UTILS.hideChamber(CONFIG.IDS.SEARCH_MODAL);
                this._executeSearch(chamber, baseParams);
            });
            chamber.querySelector('#anubis-search-cancel').addEventListener('click', () => DOM_UTILS.hideChamber(CONFIG.IDS.SEARCH_MODAL));
        },

        bindDirectSearchChamberEvents(chamber) {
            this._bindGallerySelector(chamber, 'anubis-direct-search');
            const searchTypeSelect = chamber.querySelector('#anubis-direct-search-type');
            const pageRangeOptions = chamber.querySelector('#anubis-direct-page-range-options');
            const dateOptionsWrapper = chamber.querySelector('#anubis-direct-date-options-wrapper');

            searchTypeSelect.addEventListener('change', () => {
                const isPage = searchTypeSelect.value === 'page';
                pageRangeOptions.style.display = isPage ? 'block' : 'none';
                dateOptionsWrapper.style.display = isPage ? 'none' : 'block';
            });

            chamber.querySelector('#anubis-direct-end-page').value = this.settings.defaultEndPage;
            const today = new Date();
            chamber.querySelector('#anubis-direct-end-date').value = today.toISOString().split('T')[0];
            today.setDate(today.getDate() - (this.settings.defaultDateRange - 1));
            chamber.querySelector('#anubis-direct-start-date').value = today.toISOString().split('T')[0];
            searchTypeSelect.value = this.settings.defaultSearchType;
            searchTypeSelect.dispatchEvent(new Event('change'));

            chamber.querySelector('#anubis-direct-search-confirm').addEventListener('click', () => {
                const userInput = chamber.querySelector('#anubis-direct-search-user-input').value.trim();
                if (!userInput) return alert("글쓴이 정보를 입력해 주세요.");

                let filterKey, displayName;
                if (/^(\d{1,3}\.){1,3}\d{1,3}$/.test(userInput)) {
                    filterKey = `ip:${userInput}`;
                    displayName = userInput;
                } else {
                    const match = userInput.match(/(.+)\s\((.+)\)/);
                    if (match) {
                        filterKey = `id:${match[2]}`;
                        displayName = userInput;
                    } else {
                        filterKey = `id:${userInput}`;
                        displayName = userInput;
                    }
                }

                const galleryInfo = this._getGalleryInfoFromSelector(chamber, 'anubis-direct-search');
                if (!galleryInfo.galleryId) return alert("갤러리를 선택하거나 ID를 입력해 주세요.");
                const baseParams = { userInfo: { filterKey, displayName }, ...galleryInfo };
                DOM_UTILS.hideChamber(CONFIG.IDS.DIRECT_SEARCH_MODAL);
                this._executeSearch(chamber, baseParams);
            });
            chamber.querySelector('#anubis-direct-search-cancel').addEventListener('click', () => DOM_UTILS.hideChamber(CONFIG.IDS.DIRECT_SEARCH_MODAL));
        },

        async bindFilterChamberEvents(chamber) {
            const S = CONFIG.STORAGE_KEYS;
            const recoEnabledCheck = chamber.querySelector('#anubis-filter-reco-enabled');
            const commentsEnabledCheck = chamber.querySelector('#anubis-filter-comments-enabled');
            const viewsEnabledCheck = chamber.querySelector('#anubis-filter-views-enabled');
            const recoInput = chamber.querySelector('#anubis-filter-reco');
            const commentsInput = chamber.querySelector('#anubis-filter-comments');
            const viewsInput = chamber.querySelector('#anubis-filter-views');

            const setupFilterGroup = async (id, checkEl, inputEl) => {
                checkEl.checked = await GM_getValue(S[`FILTER_${id.toUpperCase()}_ENABLED`], true);
                inputEl.value = await GM_getValue(S[`FILTER_MIN_${id.toUpperCase()}`], 0);
                inputEl.disabled = !checkEl.checked;
                checkEl.addEventListener('change', () => inputEl.disabled = !checkEl.checked);
            };

            chamber.querySelector('#anubis-filter-exclude-gallchu').checked = await GM_getValue(S.FILTER_EXCLUDE_GALLCHU, false);
            await Promise.all([
                setupFilterGroup('reco', recoEnabledCheck, recoInput),
                setupFilterGroup('comments', commentsEnabledCheck, commentsInput),
                setupFilterGroup('views', viewsEnabledCheck, viewsInput)
            ]);

            const searchTypeSelect = chamber.querySelector('#anubis-filter-search-type');
            const pageRangeOptions = chamber.querySelector('#anubis-filter-page-range-options');
            const dateOptionsWrapper = chamber.querySelector('#anubis-filter-date-options-wrapper');
            searchTypeSelect.addEventListener('change', () => {
                const isPage = searchTypeSelect.value === 'page';
                pageRangeOptions.style.display = isPage ? 'block' : 'none';
                dateOptionsWrapper.style.display = isPage ? 'none' : 'block';
            });

            chamber.querySelector('#anubis-filter-end-page').value = this.settings.defaultEndPage;
            const today = new Date();
            chamber.querySelector('#anubis-filter-end-date').value = today.toISOString().split('T')[0];
            today.setDate(today.getDate() - (this.settings.defaultDateRange - 1));
            chamber.querySelector('#anubis-filter-start-date').value = today.toISOString().split('T')[0];
            searchTypeSelect.value = this.settings.defaultSearchType;
            searchTypeSelect.dispatchEvent(new Event('change'));

            chamber.querySelector('#anubis-filter-confirm').addEventListener('click', async () => {
                await GM_setValue(S.FILTER_EXCLUDE_GALLCHU, chamber.querySelector('#anubis-filter-exclude-gallchu').checked);
                await GM_setValue(S.FILTER_RECO_ENABLED, recoEnabledCheck.checked);
                await GM_setValue(S.FILTER_COMMENTS_ENABLED, commentsEnabledCheck.checked);
                await GM_setValue(S.FILTER_VIEWS_ENABLED, viewsEnabledCheck.checked);
                await GM_setValue(S.FILTER_MIN_RECO, parseInt(recoInput.value, 10) || 0);
                await GM_setValue(S.FILTER_MIN_COMMENTS, parseInt(commentsInput.value, 10) || 0);
                await GM_setValue(S.FILTER_MIN_VIEWS, parseInt(viewsInput.value, 10) || 0);

                const baseParams = {
                    minReco: recoEnabledCheck.checked ? (parseInt(recoInput.value, 10) || 0) : 0,
                    minComments: commentsEnabledCheck.checked ? (parseInt(commentsInput.value, 10) || 0) : 0,
                    minViews: viewsEnabledCheck.checked ? (parseInt(viewsInput.value, 10) || 0) : 0,
                    excludeGallchu: chamber.querySelector('#anubis-filter-exclude-gallchu').checked
                };
                DOM_UTILS.hideChamber(CONFIG.IDS.FILTER_MODAL);
                this._executeSearch(chamber, baseParams, true);
            });

            chamber.querySelector('#anubis-filter-cancel').addEventListener('click', () => DOM_UTILS.hideChamber(CONFIG.IDS.FILTER_MODAL));
        },

        _executeSearch(chamber, baseParams, isFilter = false) {
            const searchType = chamber.querySelector('select[id$="-search-type"]').value;

            if (isFilter) {
                const urlParams = new URLSearchParams(window.location.search);
                const galleryId = urlParams.get('id');
                if (!galleryId) return alert('현재 갤러리 정보를 가져올 수 없습니다.');

                const galleryType = window.location.pathname.split('/').filter(Boolean)[0];
                const galleryDisplayName = DATA_PARSER.parseGalleryNameFromHtml(document.documentElement.outerHTML) || galleryId;
                baseParams = { ...baseParams, galleryId, galleryType, galleryDisplayName };
            }

            let searchParams = {};
            if (searchType === 'page') {
                const startPage = parseInt(chamber.querySelector('input[id$="-start-page"]').value, 10);
                const endPage = parseInt(chamber.querySelector('input[id$="-end-page"]').value, 10);
                if (isNaN(startPage) || isNaN(endPage) || startPage < 1 || endPage < startPage) return alert("올바른 페이지 범위를 입력해 주세요.");
                if (endPage - startPage + 1 > CONFIG.CONSTANTS.MAX_SEARCH_PAGES) return alert(`한 번에 최대 ${CONFIG.CONSTANTS.MAX_SEARCH_PAGES} 페이지만 검색할 수 있습니다.`);
                searchParams = { startPage, endPage };
                const searchFn = isFilter ? this.filterPosts : this.searchPostsByPage;
                searchFn.call(this, { ...baseParams, ...searchParams });
            } else {
                const startDate = chamber.querySelector('input[id$="-start-date"]').value;
                const endDate = chamber.querySelector('input[id$="-end-date"]').value;
                if (!startDate || !endDate) return alert("시작일과 종료일을 모두 입력해 주세요.");
                const start = new Date(startDate);
                const end = new Date(endDate);
                if (start > end) return alert("시작일은 종료일보다 이전이어야 합니다.");
                const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1;
                if (diffDays > CONFIG.CONSTANTS.MAX_DATE_SEARCH_DAYS) return alert(`최대 ${CONFIG.CONSTANTS.MAX_DATE_SEARCH_DAYS}일까지 검색할 수 있습니다.`);
                const dateStartPage = parseInt(chamber.querySelector('input[id$="-date-start-page"]').value, 10) || 1;
                searchParams = { startDate, endDate, dateStartPage };
                const searchFn = isFilter ? this.filterPosts : this.searchPostsByDate;
                searchFn.call(this, { ...baseParams, ...searchParams });
            }
        },

        async _pageSearchEngine(params, pagesToFetch, processor, stopTimestamp = null) {
            this.isSearchCancelled = false;
            const totalPages = pagesToFetch.length;
            const isDateSearch = !!stopTimestamp;

            const startTimestamp = isDateSearch ? new Date(params.startDate.replace(/-/g, '/')).getTime() : 0;
            let progressEndTimestamp = isDateSearch ? Date.now() : 0;

            if (isDateSearch) {
                const firstPageNum = pagesToFetch[0];
                if (firstPageNum) {
                    const firstPageHtml = await this.fetchPageHtml(params.galleryType, params.galleryId, firstPageNum);
                    if (firstPageHtml) {
                        const firstPagePosts = DATA_PARSER.parseAllPostsFromHtml(firstPageHtml, params.galleryId, params.galleryType).filter(p => p.dataType !== 'icon_notice');
                        if (firstPagePosts.length > 0) {
                            progressEndTimestamp = new Date(firstPagePosts[0].timestamp).getTime();
                        }
                    }
                }
            }

            const totalDuration = progressEndTimestamp - startTimestamp;
            let lastScannedTimestamp = progressEndTimestamp;

            DOM_UTILS.showChamber(CONFIG.IDS.RESULTS_MODAL, TEMPLATES.resultsChamber({ ...params, isLoading: true, statusText: '검색 준비 중...', progress: 0 }), () => this.isSearchCancelled = true);

            if (params.isDirectInput) {
                const firstPageHtml = await this.fetchPageHtml(params.galleryType, params.galleryId, 1);
                if (firstPageHtml && !this.isSearchCancelled) {
                    const newGalleryName = DATA_PARSER.parseGalleryNameFromHtml(firstPageHtml);
                    if (newGalleryName) {
                        params.galleryDisplayName = newGalleryName.endsWith('갤러리') ? newGalleryName : newGalleryName + ' 갤러리';
                        const infoElement = document.getElementById(CONFIG.IDS.SEARCH_INFO_TEXT);
                        if (infoElement) infoElement.innerHTML = `${this.escapeHtml(params.galleryDisplayName)}${params.userInfo ? ` → ${this.escapeHtml(params.userInfo.displayName)}` : ''}`;
                    }
                }
            }

            const allPosts = [];
            const foundPostNos = new Set();
            let failedPages = [];
            let shouldStop = false;

            for (let i = 0; i < totalPages; i += CONFIG.CONSTANTS.SEARCH_CHUNK_SIZE) {
                if (this.isSearchCancelled || shouldStop) break;

                if (isDateSearch && i > 0 && i % 100 === 0) {
                    await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));
                }

                const chunk = pagesToFetch.slice(i, i + CONFIG.CONSTANTS.SEARCH_CHUNK_SIZE);
                const promises = chunk.map(page => this.fetchPageHtml(params.galleryType, params.galleryId, page));
                const results = await Promise.all(promises);

                results.forEach((html, index) => {
                    if (shouldStop) return;
                    if (html) {
                        const postsFromPage = processor(html);
                        postsFromPage.forEach(post => {
                            if (!foundPostNos.has(post.postNo)) {
                                foundPostNos.add(post.postNo);
                                allPosts.push(post);
                            }
                        });

                        const regularPosts = DATA_PARSER.parseAllPostsFromHtml(html, params.galleryId, params.galleryType).filter(p => p.dataType !== 'icon_notice');
                        if (regularPosts.length > 0) {
                            lastScannedTimestamp = new Date(regularPosts[regularPosts.length - 1].timestamp).getTime();
                            if (isDateSearch && lastScannedTimestamp < startTimestamp) {
                                shouldStop = true;
                            }
                        }

                    } else {
                        failedPages.push(chunk[index]);
                    }
                });

                const resultsChamber = document.getElementById(CONFIG.IDS.RESULTS_MODAL);
                if (resultsChamber && !this.isSearchCancelled) {
                    let progress = 0;
                    let statusText = '';

                    if (isDateSearch) {
                        const scannedDuration = progressEndTimestamp - lastScannedTimestamp;
                        progress = totalPages > 0 ? Math.round((scannedDuration / totalDuration) * 100) : 0;
                        progress = Math.max(0, Math.min(progress, 100));
                        statusText = '게시글 탐색 중...';
                    } else {
                        progress = Math.round(((i + chunk.length) / totalPages) * 100);
                        statusText = `${Math.min(i + chunk.length, totalPages)}/${totalPages} 페이지 검색 중...`;
                    }

                    resultsChamber.querySelector('.anubis-status-text').textContent = statusText;
                    resultsChamber.querySelector('.anubis-progress-bar').style.width = `${progress}%`;
                    resultsChamber.querySelector('.anubis-progress-text').textContent = `${progress}%`;
                }
            }

            if (failedPages.length > 0 && !this.isSearchCancelled) {
                const resultsChamber = document.getElementById(CONFIG.IDS.RESULTS_MODAL);
                if (resultsChamber) {
                    resultsChamber.querySelector('.anubis-status-text').textContent = '로딩 실패 페이지 재시도 중...';
                }

                const uniqueFailedPages = [...new Set(failedPages)].sort((a, b) => a - b);
                const pagesToRetrySet = new Set();
                uniqueFailedPages.forEach(page => {
                    pagesToRetrySet.add(page);
                    pagesToRetrySet.add(page + 1);
                    pagesToRetrySet.add(page + 2);
                });

                const pagesToRetry = [...pagesToRetrySet].sort((a, b) => a - b);
                failedPages = [];

                for (let i = 0; i < pagesToRetry.length; i += CONFIG.CONSTANTS.SEARCH_CHUNK_SIZE) {
                    if (this.isSearchCancelled) break;

                    const chunk = pagesToRetry.slice(i, i + CONFIG.CONSTANTS.SEARCH_CHUNK_SIZE);
                    const promises = chunk.map(page => this.fetchPageHtml(params.galleryType, params.galleryId, page));
                    const results = await Promise.all(promises);

                    results.forEach((html, index) => {
                        if (this.isSearchCancelled) return;
                        if (html) {
                            const postsFromPage = processor(html);
                            postsFromPage.forEach(post => {
                                if (!foundPostNos.has(post.postNo)) {
                                    foundPostNos.add(post.postNo);
                                    allPosts.push(post);
                                }
                            });
                        } else {
                            failedPages.push(chunk[index]);
                        }
                    });
                }
            }

            return { posts: allPosts, failedPages };
        },

        async searchPostsByPage(params) {
            const pagesToFetch = Array.from({ length: params.endPage - params.startPage + 1 }, (_, i) => params.startPage + i);
            const processor = (html) => DATA_PARSER.parseUserPostsFromHtml(html, params.userInfo.filterKey, params.galleryId, params.galleryType);
            const { posts: allPosts, failedPages } = await this._pageSearchEngine(params, pagesToFetch, processor);
            if (this.isSearchCancelled) return;
            allPosts.sort((a, b) => b.postNo - a.postNo);
            const failureText = this.formatFailedPages(failedPages);
            const statusText = `총 ${allPosts.length}개의 글을 찾았습니다. (${params.startPage}~${params.endPage}p)${failureText}`;
            const finalModalHTML = TEMPLATES.resultsChamber({ ...params, posts: allPosts, isLoading: false, statusText });
            DOM_UTILS.showChamber(CONFIG.IDS.RESULTS_MODAL, finalModalHTML);
        },

        async searchPostsByDate(params) {
            const dateStartPage = params.dateStartPage || 1;
            const pagesToFetch = Array.from({ length: CONFIG.CONSTANTS.MAX_DATE_SEARCH_PAGES }, (_, i) => dateStartPage + i);
            const processor = (html) => DATA_PARSER.parseUserPostsFromHtml(html, params.userInfo.filterKey, params.galleryId, params.galleryType);
            const { posts: allPosts, failedPages } = await this._pageSearchEngine(params, pagesToFetch, processor, new Date(params.startDate.replace(/-/g, '/')).getTime());
            if (this.isSearchCancelled) return;

            const startTimestamp = new Date(params.startDate.replace(/-/g, '/')).getTime();
            const end = new Date(params.endDate.replace(/-/g, '/'));
            end.setHours(23, 59, 59, 999);
            const endTimestamp = end.getTime();
            const filteredPosts = allPosts.filter(p => {
                const postTime = new Date(p.timestamp).getTime();
                return postTime >= startTimestamp && postTime <= endTimestamp;
            });

            filteredPosts.sort((a, b) => b.postNo - a.postNo);
            const failureText = this.formatFailedPages(failedPages);
            const statusText = `총 ${filteredPosts.length}개의 글을 찾았습니다.${failureText}`;
            const finalModalHTML = TEMPLATES.resultsChamber({ ...params, posts: filteredPosts, isLoading: false, statusText });
            DOM_UTILS.showChamber(CONFIG.IDS.RESULTS_MODAL, finalModalHTML);
        },

        async filterPosts(params) {
            const isDateSearch = !!params.startDate;
            const dateStartPage = params.dateStartPage || 1;
            const pagesToFetch = isDateSearch
                ? Array.from({ length: CONFIG.CONSTANTS.MAX_DATE_SEARCH_PAGES }, (_, i) => dateStartPage + i)
                : Array.from({ length: params.endPage - params.startPage + 1 }, (_, i) => params.startPage + i);

            const processor = (html) => {
                return DATA_PARSER.parseAllPostsFromHtml(html, params.galleryId, params.galleryType)
                    .filter(post => {
                        const isGallchu = ['icon_recomtxt', 'icon_recomimg', 'icon_recomovie'].includes(post.dataType);
                        return post.dataType !== 'icon_notice' &&
                               !(params.excludeGallchu && isGallchu) &&
                               post.reco >= params.minReco &&
                               post.commentCount >= params.minComments &&
                               post.views >= params.minViews;
                    });
            };
            const { posts: allPosts, failedPages } = await this._pageSearchEngine(params, pagesToFetch, processor, params.startDate ? new Date(params.startDate.replace(/-/g, '/')).getTime() : null);
            if (this.isSearchCancelled) return;

            let finalPosts = allPosts;
            if (params.startDate) {
                const startTimestamp = new Date(params.startDate.replace(/-/g, '/')).getTime();
                const end = new Date(params.endDate.replace(/-/g, '/'));
                end.setHours(23, 59, 59, 999);
                const endTimestamp = end.getTime();
                finalPosts = allPosts.filter(p => {
                    const postTime = new Date(p.timestamp).getTime();
                    return postTime >= startTimestamp && postTime <= endTimestamp;
                });
            }

            finalPosts.sort((a, b) => b.postNo - a.postNo);
            const failureText = this.formatFailedPages(failedPages);
            const statusText = `총 ${finalPosts.length}개의 글을 찾았습니다.${failureText}`;
            const finalModalHTML = TEMPLATES.resultsChamber({ ...params, posts: finalPosts, isLoading: false, statusText });
            DOM_UTILS.showChamber(CONFIG.IDS.RESULTS_MODAL, finalModalHTML);
        },

        fetchPageHtml(galleryType, galleryId, pageNum) {
            const path = galleryType === 'board' ? 'board' : `${galleryType}/board`;
            const url = `https://gall.dcinside.com/${path}/lists/?id=${galleryId}&page=${pageNum}`;
            return new Promise(resolve => {
                GM_xmlhttpRequest({
                    method: 'GET', url, timeout: 10000,
                    onload: res => res.status === 200 ? resolve(res.responseText) : resolve(null),
                    onerror: () => resolve(null), ontimeout: () => resolve(null)
                });
            });
        },

        async openSettingsChamber() {
            this.isSettingsDirty = false;
            await this.loadSettings();
            const chamberHTML = TEMPLATES.settingsChamber();
            const onCloseCallback = () => this.isSettingsDirty ? confirm('설정이 저장되지 않았습니다.\n계속하시겠습니까?') : true;
            const chamber = DOM_UTILS.showChamber(CONFIG.IDS.SETTINGS_MODAL, chamberHTML, onCloseCallback);
            await this._bindSettingsChamberEvents(chamber);
        },

        async _bindSettingsChamberEvents(chamber) {
            const saveStatus = chamber.querySelector('#anubis-settings-save-status');
            const markDirty = () => { this.isSettingsDirty = true; saveStatus.style.display = 'none'; };
            const updateSliderTrack = (slider) => {
                const min = slider.min || 1, max = slider.max || 1, value = slider.value || 1;
                slider.style.setProperty('--slider-progress', `${((value - min) / (max - min)) * 100}%`);
            };

            const positionSelect = chamber.querySelector('#anubis-button-position');
            const endPageSlider = chamber.querySelector('#anubis-default-end-page');
            const endPageValue = chamber.querySelector('#anubis-default-end-page-value');
            const dateRangeSlider = chamber.querySelector('#anubis-default-date-range');
            const dateRangeValue = chamber.querySelector('#anubis-default-date-range-value');

            const updateUI = async () => {
                await this.loadSettings();
                chamber.querySelector('#anubis-default-search-type').value = this.settings.defaultSearchType;
                positionSelect.value = this.settings.buttonPosition;
                endPageSlider.value = this.settings.defaultEndPage;
                endPageValue.textContent = `${this.settings.defaultEndPage}p`;
                updateSliderTrack(endPageSlider);
                dateRangeSlider.value = this.settings.defaultDateRange;
                dateRangeValue.textContent = `${this.settings.defaultDateRange}일`;
                updateSliderTrack(dateRangeSlider);
            };

            chamber.querySelectorAll('select, input[type="range"]').forEach(el => el.addEventListener('input', markDirty));

            endPageSlider.addEventListener('input', () => {
                endPageValue.textContent = `${endPageSlider.value}p`;
                updateSliderTrack(endPageSlider);
                markDirty();
            });
            dateRangeSlider.addEventListener('input', () => {
                dateRangeValue.textContent = `${dateRangeSlider.value}일`;
                updateSliderTrack(dateRangeSlider);
                markDirty();
            });

            chamber.querySelector('#anubis-settings-save').addEventListener('click', async () => {
                const S = CONFIG.STORAGE_KEYS;
                await GM_setValue(S.DEFAULT_SEARCH_TYPE, chamber.querySelector('#anubis-default-search-type').value);
                await GM_setValue(S.BUTTON_POSITION, positionSelect.value);
                await GM_setValue(S.DEFAULT_END_PAGE, parseInt(endPageSlider.value, 10));
                await GM_setValue(S.DEFAULT_DATE_RANGE, parseInt(dateRangeSlider.value, 10));
                this.isSettingsDirty = false;
                saveStatus.textContent = '저장됨';
                saveStatus.style.display = 'inline';
            });

            chamber.querySelector('#anubis-reset-settings').addEventListener('click', async () => {
                if (confirm("ANUBIS 설정을 기본값으로 되돌리시겠습니까?")) {
                    const keysToDelete = (await GM_listValues()).filter(key => key.startsWith('anubis_'));
                    await Promise.all(keysToDelete.map(key => GM_deleteValue(key)));
                    await updateUI();
                    markDirty();
                }
            });

            await updateUI();
        },

        _getGalleryInfoFromSelector(chamber, idPrefix) {
            const gallerySelect = chamber.querySelector(`#${idPrefix}-gallery-select`);
            const isDirectInput = gallerySelect.value === '__direct_input__';
            if (isDirectInput) {
                const id = chamber.querySelector(`#${idPrefix}-gallery-direct-input`).value.trim();
                const type = chamber.querySelector(`input[name="${idPrefix}-gallery-type"]:checked`).value;
                return { galleryId: id, galleryType: type, galleryDisplayName: `갤러리 (ID: ${id})`, isDirectInput: true };
            }
            const selectedOption = gallerySelect.options[gallerySelect.selectedIndex];
            return { galleryId: selectedOption.value, galleryType: selectedOption.dataset.type, galleryDisplayName: `${selectedOption.textContent.trim()} 갤러리`, isDirectInput: false };
        },

        async _bindGallerySelector(chamber, idPrefix) {
            const gallerySelect = chamber.querySelector(`#${idPrefix}-gallery-select`);
            const directInputContainer = chamber.querySelector(`#${idPrefix}-gallery-direct-input-container`);
            const recentGalleries = DATA_PARSER.getRecentGalleries();
            const galleryMap = new Map(recentGalleries.map(g => [g.id, g]));
            const urlParams = new URLSearchParams(window.location.search);
            const currentGalleryId = urlParams.get('id');
            if (currentGalleryId && !galleryMap.has(currentGalleryId)) {
                const name = DATA_PARSER.parseGalleryNameFromHtml(document.documentElement.outerHTML) || currentGalleryId;
                const type = window.location.pathname.split('/').filter(Boolean)[0];
                galleryMap.set(currentGalleryId, { id: currentGalleryId, name, type });
            }
            gallerySelect.innerHTML = '<option value="__direct_input__">직접 입력</option>' + [...galleryMap.values()].map(g => `<option value="${g.id}" data-type="${g.type}">${this.escapeHtml(g.name)}</option>`).join('');
            gallerySelect.value = galleryMap.has(currentGalleryId) ? currentGalleryId : '__direct_input__';
            const toggleDirectInput = () => directInputContainer.style.display = gallerySelect.value === '__direct_input__' ? 'block' : 'none';
            gallerySelect.addEventListener('change', toggleDirectInput);
            toggleDirectInput();
        },

        escapeHtml(text) {
            if (typeof text !== 'string') return text;
            const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
            return text.replace(/[&<>"']/g, m => map[m]);
        },

        formatFailedPages(pages) {
            if (!pages || pages.length === 0) return '';
            const uniquePages = [...new Set(pages)].sort((a, b) => a - b);
            if (uniquePages.length === 0) return '';
            const ranges = [];
            let start = uniquePages[0];
            let end = uniquePages[0];
            for (let i = 1; i < uniquePages.length; i++) {
                if (uniquePages[i] === end + 1) {
                    end = uniquePages[i];
                } else {
                    ranges.push(start === end ? `${start}p` : `${start}~${end}p`);
                    start = uniquePages[i];
                    end = uniquePages[i];
                }
            }
            ranges.push(start === end ? `${start}p` : `${start}~${end}p`);
            return ` (실패: ${ranges.join(', ')})`;
        },
    };

    CORE_LOGIC.initialize();

})();