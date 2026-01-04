// ==UserScript==
// @name         Google Plus & Bing Plus
// @version      7.5
// @description  Add Gemini response, improve speed to search results(Bing), add Google/Bing search buttons, Gemini On/Off toggle
// @author       monit8280
// @match        https://www.bing.com/search*
// @match        https://www.google.com/search*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      generativelanguage.googleapis.com
// @connect      api.cdnjs.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/marked/16.3.0/lib/marked.umd.js
// @license      MIT
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/530097/Google%20Plus%20%20Bing%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/530097/Google%20Plus%20%20Bing%20Plus.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ---------------------- Config ----------------------
    const Config = {
        API: {
            GEMINI_MODEL: 'gemini-2.5-flash',
            GEMINI_URL: 'https://generativelanguage.googleapis.com/v1beta/models/',
            MARKED_CDN_URL: 'https://api.cdnjs.com/libraries/marked'
        },
        VERSIONS: {
            MARKED_VERSION: '16.3.0'
        },
        CACHE: {
            PREFIX: 'gemini_cache_'
        },
        STORAGE_KEYS: {
            CURRENT_VERSION: 'markedCurrentVersion',
            LATEST_VERSION: 'markedLatestVersion',
            LAST_NOTIFIED: 'markedLastNotifiedVersion',
            THEME_MODE: 'themeMode', // 테마 모드 저장
            GEMINI_ENABLED: 'geminiEnabled' // Gemini On/Off 상태 저장
        },
        UI: {
            DEFAULT_MARGIN: 8,
            DEFAULT_PADDING: 16,
            Z_INDEX: 9999
        },
        STYLES: {
            COLORS: {
                BACKGROUND_LIGHT: '#fff',
                BACKGROUND_DARK: '#282c34',
                BORDER_LIGHT: '#e0e0e0',
                BORDER_DARK: '#444',
                TEXT_LIGHT: '#000',
                TEXT_DARK: '#e0e0e0',
                TITLE_LIGHT: '#000',
                TITLE_DARK: '#ffffff',
                BUTTON_BG_LIGHT: '#f0f3ff',
                BUTTON_BG_DARK: '#3a3f4b',
                BUTTON_BORDER_LIGHT: '#ccc',
                BUTTON_BORDER_DARK: '#555',
                CODE_BLOCK_BG_LIGHT: '#f0f0f0',
                CODE_BLOCK_BG_DARK: '#3b3b3b',
            },
            BORDER_RADIUS: '4px',
            FONT_SIZE: {
                TEXT: '14px',
                TITLE: '18px'
            },
            ICON_SIZE: '20px',
            LOGO_SIZE: '24px',
            SMALL_ICON_SIZE: '16px'
        },
        ASSETS: {
            GOOGLE_LOGO: 'https://www.gstatic.com/images/branding/searchlogo/ico/favicon.ico',
            BING_LOGO: 'https://account.microsoft.com/favicon.ico',
            GEMINI_LOGO: 'https://www.gstatic.com/lamda/images/gemini_sparkle_aurora_33f86dc0c0257da337c63.svg',
            REFRESH_ICON: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IS0tIFVwbG9hZGVkIHRvOiBTVkcgUmVwbywgd3d3LnN2Z3JlcG8uY29tLCBHZW5lcmF0b3I6IFNWRyBSZXBvIE1peGVyIFRvb2xzIC0tPg0KPHN2ZyB3aWR0aD0iODAwcHgiIGhlaWdodD0iODAwcHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxwYXRoIGQ9Ik00LjA2MTg5IDEzQzQuMDIxMDQgMTIuNjcyNCA0IDEyLjMzODcgNCAxMkM0IDcuNTgxNzIgNy41ODE3MiA0IDEyIDRDMTQuNTAwNiA0IDE2LjczMzIgNS4xNDcyNyAxOC4yMDAyIDYuOTQ0MTZNMTkuOTM4MSAxMUMxOS45NzkgMTEuMzI3NiAyMCAxMS42NjEzIDIwIDEyQzIwIDE2LjQxODMgMTYuNDE4MyAyMCAxMiAyMEM5LjYxMDYxIDIwIDcuNDY1ODkgMTguOTUyNSA2IDE3LjI5MTZNOSAxN0g2VjE3LjI5MTZNMTguMjAwMiA0VjYuOTQ0MTZNMTguMjAwMiA2Ljk0NDE2VjYuOTk5OTNMMTUuMjAwMiA3TTYgMjBWMTcuMjkxNiIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPg0KPC9zdmc+',
            LIGHT_MODE_ICON: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gVXBsb2FkZWQgdG86IFNWRyBSZXBvLCB3d3cuc3ZncmVwby5jb20sIEdlbmVyYXRvcjogU1ZHIFJlcG8gTWl4ZXIgVG9vbHMgLS0+DQo8c3ZnIHdpZHRoPSI4MDBweCIgaGVpZ2h0PSI4MDBweCIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgY2xhc3M9Imljb24iICB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTg2MSA2NTYuN2wxNDQuNi0xNDQuNkw4NjEgMzY3LjZWMTYzLjFINjU2LjZMNTEyIDE4LjYgMzY3LjQgMTYzLjFIMTYzdjIwNC41TDE4LjQgNTEyLjEgMTYzIDY1Ni43djIwNC40aDIwNC40TDUxMiAxMDA1LjdsMTQ0LjYtMTQ0LjZIODYxeiIgZmlsbD0iI0ZDRDE3MCIgLz48cGF0aCBkPSJNNTEyIDEwMTUuN2MtMi42IDAtNS4xLTEtNy4xLTIuOUwzNjMuMyA4NzEuMUgxNjNjLTUuNSAwLTEwLTQuNS0xMC0xMFY2NjAuOEwxMS40IDUxOS4yYy0xLjktMS45LTIuOS00LjQtMi45LTcuMSAwLTIuNyAxLjEtNS4yIDIuOS03LjFMMTUzIDM2My40VjE2My4xYzAtNS41IDQuNS0xMCAxMC0xMGgyMDAuM0w1MDQuOSAxMS41YzEuOS0xLjkgNC40LTIuOSA3LjEtMi45czUuMiAxLjEgNy4xIDIuOWwxNDEuNiAxNDEuNkg4NjFjNS41IDAgMTAgNC41IDEwIDEwdjIwMC4zTDEwMTIuNiA1MDVjMS45IDEuOSAyLjkgNC40IDIuOSA3LjEgMCAyLjctMS4xIDUuMi0yLjkgNy4xTDg3MSA2NjAuOHYyMDAuM2MwIDUuNS00LjUgMTAtMTAgMTBINjYwLjdsLTE0MS42IDE0MS42Yy0yIDItNC41IDMtNy4xIDN6TTE3MyA4NTEuMWgxOTQuNGMyLjcgMCA1LjIgMS4xIDcuMSAyLjlMNTEyIDk5MS42bDEzNy41LTEzNy41YzEuOS0xLjkgNC40LTIuOSA3LjEtMi45SDg1MVY2NTYuN2MwLTIuNyAxLjEtNS4yIDIuOS03LjFsMTM3LjUtMTM3LjUtMTM3LjUtMTM3LjVjLTEuOS0xLjktMi45LTQuNC0yLjktNy4xVjE3My4xSDY1Ni42Yy0yLjcgMC01LjItMS4xLTcuMS0yLjlMNTEyIDMyLjcgMzc0LjUgMTcwLjJjLTEuOSAxLjktNC40IDIuOS03LjEgMi45SDE3M3YxOTQuNGMwIDIuNy0xLjEgNS4yLTIuOSA3LjFMMzIuNiA1MTIuMWwxMzcuNSAxMzcuNWMxLjkgMS45IDIuOSA0LjQgMi45IDcuMXYxOTQuNHoiIGZpbGw9IiIgLz48cGF0aCBkPSJNNTEyIDUxMi4xbS0yNTcuOCAwYTI1Ny44IDI1Ny44IDAgMSAwIDUxNS42IDAgMjU3LjggMjU3LjggMCAxIDAtNTE1LjYgMFoiIGZpbGw9IiNGN0REQUQiIC8+PHBhdGggZD0iTTUxMiA3NzkuOWMtNzEuNSAwLTEzOC44LTI3LjktMTg5LjQtNzguNC01MC42LTUwLjYtNzguNC0xMTcuOC03OC40LTE4OS40czI3LjktMTM4LjggNzguNC0xODkuNGM1MC42LTUwLjYgMTE3LjgtNzguNCAxODkuNC03OC40IDcxLjUgMCAxMzguOCAyNy45IDE4OS40IDc4LjQgNTAuNiA1MC42IDc4LjQgMTE3LjggNzguNCAxODkuNFM3NTIgNjUwLjkgNzAxLjQgNzAxLjUgNTgzLjUgNzc5LjkgNTEyIDc3OS45eiBtMC01MTUuNmMtNjYuMiAwLTEyOC40IDI1LjgtMTc1LjIgNzIuNi00Ni44IDQ2LjgtNzIuNiAxMDktNzIuNiAxNzUuMnMyNS44IDEyOC40IDcyLjYgMTc1LjJjNDYuOCA0Ni44IDEwOSA3Mi42IDE3NS4yIDcyLjYgNjYuMiAwIDEyOC40LTI1LjggMTc1LjItNzIuNiA0Ni44LTQ2LjggNzIuNi0xMDkgNzIuNi0xNzUuMlM3MzQgMzgzLjcgNjg3LjIgMzM2LjljLTQ2LjgtNDYuOC0xMDktNzIuNi0xNzUuMi03Mi42eiIgZmlsbD0iIiAvPjwvc3ZnPg==', // 라이트 모드 아이콘
            DARK_MODE_ICON: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IS0tIFVwbG9hZGVkIHRvOiBTVkcgUmVwbywgd3d3LnN2Z3JlcG8uY29tLCBHZW5lcmF0b3I6IFNWRyBSZXBvIE1peGVyIFRvb2xzIC0tPg0KPHN2ZyB3aWR0aD0iODAwcHgiIGhlaWdodD0iODAwcHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxwYXRoIGQ9Ik0xOS45MDAxIDIuMzA3MTlDMTkuNzM5MiAxLjg5NzYgMTkuMTYxNiAxLjg5NzYgMTkuMDAwNyAyLjMwNzE5TDE4LjU3MDMgMy40MDI0N0MxOC41MjEyIDMuNTI3NTIgMTguNDIyNiAzLjYyNjUxIDE4LjI5OCAzLjY3NTgzTDE3LjIwNjcgNC4xMDc4QzE2Ljc5ODYgNC4yNjkzNCAxNi43OTg2IDQuODQ5IDE3LjIwNjcgNS4wMTA1NEwxOC4yOTggNS40NDI1MkMxOC40MjI2IDUuNDkxODQgMTguNTIxMiA1LjU5MDgyIDE4LjU3MDMgNS43MTU4N0wxOS4wMDA3IDYuODExMTVDMTkuMTYxNiA3LjIyMDc0IDE5LjczOTIgNy4yMjA3NCAxOS45MDAxIDYuODExMTZMMjAuMzMwNSA1LjcxNTg3QzIwLjM3OTYgNS41OTA4MiAyMC40NzgyIDUuNDkxODQgMjAuNjAyOCA1LjQ0MjUyTDIxLjY5NDEgNS4wMTA1NEMyMi4xMDIyIDQuODQ5IDIyLjEwMjIgNC4yNjkzNCAyMS42OTQxIDQuMTA3OEwyMC42MDI4IDMuNjc1ODNDMjAuNDc4MiAzLjYyNjUxIDIwLjM3OTYgMy41Mjc1MiAyMC4zMzA1IDMuNDAyNDdMMTkuOTAwMSAyLjMwNzE5WiIgZmlsbD0iIzFDMjc0QyIvPg0KPHBhdGggZD0iTTE2LjAzMjggOC4xMjk2N0MxNS44NzE4IDcuNzIwMDkgMTUuMjk0MyA3LjcyMDA5IDE1LjEzMzMgOC4xMjk2N0wxNC45NzY0IDguNTI5MDJDMTQuOTI3MyA4LjY1NDA3IDE0LjgyODcgOC43NTMwNSAxNC43MDQxIDguODAyMzdMMTQuMzA2MiA4Ljk1OTg3QzEzLjg5ODEgOS4xMjE0MSAxMy44OTgxIDkuNzAxMDcgMTQuMzA2MiA5Ljg2MjYxTDE0LjcwNDEgMTAuMDIwMUMxNC44Mjg3IDEwLjA2OTQgMTQuOTI3MyAxMC4xNjg0IDE0Ljk3NjQgMTAuMjkzNUwxNS4xMzMzIDEwLjY5MjhDMTUuMjk0MyAxMS4xMDI0IDE1Ljg3MTggMTEuMTAyNCAxNi4wMzI4IDEwLjY5MjhMMTYuMTg5NyAxMC4yOTM1QzE2LjIzODggMTAuMTY4NCAxNi4zMzc0IDEwLjA2OTQgMTYuNDYyIDEwLjAyMDFMMTYuODU5OSA5Ljg2MjYxQzE3LjI2OCA5LjcwMTA3IDE3LjI2OCA5LjEyMTQxIDE2Ljg1OTkgOC45NTk4N0wxNi40NjIgOC44MDIzN0MxNi4zMzc0IDguNzUzMDUgMTYuMjM4OCA4LjY1NDA3IDE2LjE4OTcgOC41MjkwMkwxNi4wMzI4IDguMTI5NjdaIiBmaWxsPSIjMUMyNzRDIi8+DQo8cGF0aCBkPSJNMTIgMjJDMTcuNTIyOCAyMiAyMiAxNy41MjI4IDIyIDEyQzIyIDExLjUzNzMgMjEuMzA2NSAxMS40NjA4IDIxLjA2NzIgMTEuODU2OEMxOS45Mjg5IDEzLjc0MDYgMTcuODYxNSAxNSAxNS41IDE1QzExLjkxMDEgMTUgOSAxMi4wODk5IDkgOC41QzkgNi4xMzg0NSAxMC4yNTk0IDQuMDcxMDUgMTIuMTQzMiAyLjkzMjc2QzEyLjUzOTIgMi42OTM0NyAxMi40NjI3IDIgMTIgMkM2LjQ3NzE1IDIgMiA2LjQ3NzE1IDIgMTJDMiAxNy41MjI4IDYuNDc3MTUgMjIgMTIgMjJaIiBmaWxsPSIjMUMyNzRDIi8+DQo8L3N2Zz4=' // 다크 모드 아이콘
        },
        MESSAGE_KEYS: {
            PROMPT: 'prompt',
            ENTER_API_KEY: 'enterApiKey',
            GEMINI_EMPTY: 'geminiEmpty',
            PARSE_ERROR: 'parseError',
            NETWORK_ERROR: 'networkError',
            TIMEOUT: 'timeout',
            LOADING: 'loading',
            UPDATE_TITLE: 'updateTitle',
            UPDATE_NOW: 'updateNow',
            SEARCH_ON_GOOGLE: 'searchongoogle',
            SEARCH_ON_BING: 'searchonbing',
            GEMINI_OFF: 'geminiOff'
        }
    };

    // ---------------------- Localization ----------------------
    const Localization = {
        MESSAGES: {
            [Config.MESSAGE_KEYS.PROMPT]: {
                ko: `"${'${query}'}"에 대한 정보를 찾아줘`,
                zh: `请以标记格式填写有关\"${'${query}'}\"的信息。`,
                default: `Please write information about \"${'${query}'}\" in markdown format`
            },
            [Config.MESSAGE_KEYS.ENTER_API_KEY]: {
                ko: 'Gemini API 키를 입력하세요:',
                zh: '请输入 Gemini API 密钥：',
                default: 'Please enter your Gemini API key:'
            },
            [Config.MESSAGE_KEYS.GEMINI_EMPTY]: {
                ko: '⚠️ Gemini 응답이 비어있습니다.',
                zh: '⚠️ Gemini 返回为空。',
                default: '⚠️ Gemini response is empty.'
            },
            [Config.MESSAGE_KEYS.PARSE_ERROR]: {
                ko: '❌ 파싱 오류:',
                zh: '❌ 解析错误：',
                default: '❌ Parsing error:'
            },
            [Config.MESSAGE_KEYS.NETWORK_ERROR]: {
                ko: '❌ 네트워크 오류:',
                zh: '❌ 网络错误：',
                default: '❌ Network error:'
            },
            [Config.MESSAGE_KEYS.TIMEOUT]: {
                ko: '❌ 요청 시간이 초과되었습니다.',
                zh: '❌ 请求超时。',
                default: '❌ Request timeout'
            },
            [Config.MESSAGE_KEYS.LOADING]: {
                ko: '불러오는 중...',
                zh: '加载中...',
                default: 'Loading...'
            },
            [Config.MESSAGE_KEYS.UPDATE_TITLE]: {
                ko: 'marked.min.js 업데이트 필요',
                zh: '需要更新 marked.min.js',
                default: 'marked.min.js update required'
            },
            [Config.MESSAGE_KEYS.UPDATE_NOW]: {
                ko: '확인',
                zh: '确认',
                default: 'OK'
            },
            [Config.MESSAGE_KEYS.SEARCH_ON_GOOGLE]: {
                ko: 'Google 에서 검색하기',
                zh: '在 Google 上搜索',
                default: 'Search on Google'
            },
            [Config.MESSAGE_KEYS.SEARCH_ON_BING]: {
                ko: 'Bing 에서 검색하기',
                zh: '在 Bing 上搜索',
                default: 'Search on Bing'
            },
            [Config.MESSAGE_KEYS.GEMINI_OFF]: {
                ko: '현재 Gemini 옵션이 OFF 상태입니다.',
                zh: '当前 Gemini 选项为关闭状态。',
                default: 'Gemini option is currently OFF.'
            }
        },

        getMessage(key, vars = {}) {
            const lang = navigator.language;
            const langKey = lang.includes('ko') ? 'ko' : lang.includes('zh') ? 'zh' : 'default';
            const template = this.MESSAGES[key]?.[langKey] || this.MESSAGES[key]?.default || '';
            return template.replace(/\$\{(.*?)\}/g, (_, k) => vars[k] || '');
        }
    };

    // ---------------------- Device Detector ----------------------
    const DeviceDetector = {
        _cache: {
            deviceType: null,
            isGeminiAvailable: null
        },

        getDeviceType() {
            if (this._cache.deviceType !== null) return this._cache.deviceType;
            const userAgent = navigator.userAgent;
            const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            const width = window.innerWidth;
            let deviceType;
            const isAndroid = /Android/i.test(userAgent);
            const isIPhone = /iPhone/i.test(userAgent);
            const hasMobileKeyword = /Mobile/i.test(userAgent);
            const isWindows = /Windows NT/i.test(userAgent);
            if (isWindows && !isTouchDevice && width > 1024) deviceType = 'desktop';
            else if ((isAndroid || isIPhone) && hasMobileKeyword) deviceType = 'mobile';
            else if (isAndroid && !hasMobileKeyword && width >= 768) deviceType = 'tablet';
            else if (isTouchDevice && width <= 1024) deviceType = 'mobile';
            else deviceType = 'desktop';
            this._cache.deviceType = deviceType;
            return deviceType;
        },
        isDesktop() { return this.getDeviceType() === 'desktop'; },
        isMobile() { return this.getDeviceType() === 'mobile'; },
        isTablet() { return this.getDeviceType() === 'tablet'; },
        isGeminiAvailable() {
            if (this._cache.isGeminiAvailable === null) {
                const hasRHS = !!document.getElementById('rhs') || !!document.getElementById('b_context') || !!document.querySelector('.b_right');
                this._cache.isGeminiAvailable = this.isDesktop() && hasRHS;
            }
            return this._cache.isGeminiAvailable;
        },
        resetCache() {
            this._cache = { deviceType: null, isGeminiAvailable: null };
        },
        isGoogle() { return window.location.hostname.includes('google.com'); },
        isBing() { return window.location.hostname.includes('bing.com'); }
    };

    // ---------------------- Styles ----------------------
    const StyleGenerator = {
        commonStyles: {
            '#b_results > li.b_ad a': { 'color': 'green !important' },
            '#b_context, .b_context, .b_right': {
                'color': 'initial !important',
                'border': 'none !important',
                'border-width': '0 !important',
                'border-style': 'none !important',
                'border-collapse': 'separate !important',
                'background': 'transparent !important'
            },
            '#rhs': {
                'float': 'right',
                'padding-left': '16px',
                'width': '432px',
                'margin-top': '20px'
            },
            '#rhs #gemini-wrapper': { 'margin-bottom': '20px' },
            '.mobile-useragent #gsr': { 'background-color': '#ffffff !important' }
        },
        geminiBoxStyles: {
            '#gemini-box': {
                'width': '100%',
                'max-width': '100%',
                'border-width': '1px',
                'border-style': 'solid',
                'border-radius': Config.STYLES.BORDER_RADIUS,
                'padding': `${Config.UI.DEFAULT_PADDING}px`,
                'margin-bottom': `${Config.UI.DEFAULT_MARGIN * 2.5}px`,
                'font-family': 'sans-serif',
                'overflow-x': 'auto',
                'position': 'relative',
                'box-sizing': 'border-box',
                'color': 'initial !important'
            }
        },
        themeStyles: {
            '#gemini-box': {
                'background': `var(--gemini-background-color) !important`,
                'border-color': `var(--gemini-border-color) !important`
            },
            '#gemini-box h3': { 'color': `var(--gemini-title-color) !important` },
            '#gemini-content, #gemini-content *': {
                'color': `var(--gemini-text-color) !important`,
                'background': 'transparent !important'
            },
            '#gemini-divider': { 'background': `var(--gemini-border-color) !important` },
            '#gemini-content pre': {
                'background': `var(--gemini-code-block-bg) !important`,
                'padding': `${Config.UI.DEFAULT_MARGIN + 2}px`,
                'border-radius': Config.STYLES.BORDER_RADIUS,
                'overflow-x': 'auto'
            },
            '#google-search-btn, #bing-search-btn': {
                'border-color': `var(--gemini-button-border)`,
                'background-color': `var(--gemini-button-bg)`,
                'color': `var(--gemini-title-color)`,
            },
            '#marked-update-popup': {
                'background': `var(--gemini-background-color)`,
                'border-color': `var(--gemini-button-border)`,
            },
            '#marked-update-popup button': {
                'border-color': `var(--gemini-button-border)`,
                'background-color': `var(--gemini-button-bg)`,
                'color': `var(--gemini-title-color)`,
            }
        },
        contentStyles: {
            '#gemini-content': {
                'font-size': Config.STYLES.FONT_SIZE.TEXT,
                'line-height': '1.6',
                'white-space': 'pre-wrap',
                'word-wrap': 'break-word',
                'overflow-wrap': 'break-word',
                'background': 'transparent !important'
            },
            '#gemini-content ul, #gemini-content ol': { 'list-style-type': 'none' }
        },
        headerStyles: {
            '#gemini-header': {
                'display': 'flex',
                'align-items': 'center',
                'justify-content': 'space-between',
                'margin-bottom': `${Config.UI.DEFAULT_MARGIN}px`
            },
            '#gemini-title-wrap': {
                'display': 'flex',
                'align-items': 'center'
            },
            '#gemini-logo': {
                'width': Config.STYLES.LOGO_SIZE,
                'height': Config.STYLES.LOGO_SIZE,
                'margin-right': `${Config.UI.DEFAULT_MARGIN}px`
            },
            '#gemini-box h3': {
                'margin': '0',
                'font-size': Config.STYLES.FONT_SIZE.TITLE,
                'font-weight': 'bold'
            },
            '#gemini-toggle-switch': {
                'margin-right': `${Config.UI.DEFAULT_MARGIN}px`,
                'display': 'flex',
                'align-items': 'center'
            },
            '#gemini-refresh-btn': {
                'width': Config.STYLES.ICON_SIZE,
                'height': Config.STYLES.ICON_SIZE,
                'cursor': 'pointer',
                'opacity': '0.6',
                'transition': 'transform 0.5s ease',
                'margin-left': `${Config.UI.DEFAULT_MARGIN}px`,
                'filter': 'var(--gemini-icon-filter)'
            },
            '#gemini-theme-toggle-btn': {
                'width': Config.STYLES.ICON_SIZE,
                'height': Config.STYLES.ICON_SIZE,
                'cursor': 'pointer',
                'opacity': '0.6',
                'transition': 'transform 0.5s ease'
            },
            '#gemini-refresh-btn:hover, #gemini-theme-toggle-btn:hover': {
                'opacity': '1',
                'transform': 'rotate(360deg)'
            },
            '#gemini-divider': {
                'height': '1px',
                'margin': `${Config.UI.DEFAULT_MARGIN}px 0`
            }
        },
        searchButtonStyles: {
            '#google-search-btn, #bing-search-btn': {
                'width': '100%',
                'max-width': '100%',
                'font-size': Config.STYLES.FONT_SIZE.TEXT,
                'padding': `${Config.UI.DEFAULT_MARGIN}px`,
                'margin-bottom': `${Config.UI.DEFAULT_MARGIN * 1.25}px`,
                'cursor': 'pointer',
                'border-width': '1px',
                'border-style': 'solid',
                'border-radius': Config.STYLES.BORDER_RADIUS,
                'font-family': 'sans-serif',
                'display': 'flex',
                'align-items': 'center',
                'justify-content': 'center',
                'gap': `${Config.UI.DEFAULT_MARGIN}px`,
                'transition': 'transform 0.2s ease'
            },
            '#google-search-btn img, #bing-search-btn img': {
                'width': Config.STYLES.SMALL_ICON_SIZE,
                'height': Config.STYLES.SMALL_ICON_SIZE,
                'vertical-align': 'middle',
                'transition': 'transform 0.2s ease'
            },
            '.desktop-useragent #google-search-btn:hover, .desktop-useragent #bing-search-btn:hover': {
                'transform': 'scale(1.1)'
            },
            '.desktop-useragent #google-search-btn:hover img, .desktop-useragent #bing-search-btn:hover img': {
                'transform': 'scale(1.1)'
            }
        },
        popupStyles: {
            '#marked-update-popup': {
                'position': 'fixed',
                'top': '30%',
                'left': '50%',
                'transform': 'translate(-50%, -50%)',
                'padding': `${Config.UI.DEFAULT_PADDING * 1.25}px`,
                'z-index': Config.UI.Z_INDEX,
                'border-width': '1px',
                'border-style': 'solid',
                'box-shadow': '0 2px 10px rgba(0,0,0,0.1)',
                'text-align': 'center'
            },
            '#marked-update-popup button': {
                'margin-top': `${Config.UI.DEFAULT_MARGIN * 1.25}px`,
                'padding': `${Config.UI.DEFAULT_PADDING}px ${Config.UI.DEFAULT_PADDING}px`,
                'cursor': 'pointer',
                'border-width': '1px',
                'border-style': 'solid',
                'border-radius': Config.STYLES.BORDER_RADIUS,
                'font-family': 'sans-serif'
            }
        },
        mobileStyles: {
            '.mobile-useragent #google-search-btn, .mobile-useragent #bing-search-btn': {
                'max-width': '100%',
                'width': 'calc(100% - 16px)',
                'margin-left': `${Config.UI.DEFAULT_MARGIN}px !important`,
                'margin-right': `${Config.UI.DEFAULT_MARGIN}px !important`,
                'margin-top': `${Config.UI.DEFAULT_MARGIN}px`,
                'margin-bottom': `${Config.UI.DEFAULT_MARGIN}px`,
                'padding': `${Config.UI.DEFAULT_PADDING * 0.75}px`,
                'border-radius': '16px',
                'box-sizing': 'border-box'
            },
            '.mobile-useragent #gemini-box': {
                'padding': `${Config.UI.DEFAULT_PADDING * 0.75}px`,
                'border-radius': '16px'
            },
            '.mobile-useragent #b_content': {
                'overflow': 'visible !important',
                'position': 'relative'
            }
        },
        generateStyles() {
            const styles = [
                this.commonStyles,
                this.geminiBoxStyles,
                this.themeStyles,
                this.contentStyles,
                this.headerStyles,
                this.searchButtonStyles,
                this.popupStyles,
                this.mobileStyles
            ];
            const cssVariables = `
                :root {
                    --gemini-background-color: ${Config.STYLES.COLORS.BACKGROUND_LIGHT};
                    --gemini-border-color: ${Config.STYLES.COLORS.BORDER_LIGHT};
                    --gemini-text-color: ${Config.STYLES.COLORS.TEXT_LIGHT};
                    --gemini-title-color: ${Config.STYLES.COLORS.TITLE_LIGHT};
                    --gemini-button-bg: ${Config.STYLES.COLORS.BUTTON_BG_LIGHT};
                    --gemini-button-border: ${Config.STYLES.COLORS.BUTTON_BORDER_LIGHT};
                    --gemini-code-block-bg: ${Config.STYLES.CODE_BLOCK_BG_LIGHT};
                    --gemini-icon-filter: none;
                }
                .dark-mode {
                    --gemini-background-color: ${Config.STYLES.COLORS.BACKGROUND_DARK};
                    --gemini-border-color: ${Config.STYLES.COLORS.BORDER_DARK};
                    --gemini-text-color: ${Config.STYLES.COLORS.TEXT_DARK};
                    --gemini-title-color: ${Config.STYLES.COLORS.TITLE_DARK};
                    --gemini-button-bg: ${Config.STYLES.COLORS.BUTTON_BG_DARK};
                    --gemini-button-border: ${Config.STYLES.COLORS.BUTTON_BORDER_DARK};
                    --gemini-code-block-bg: ${Config.STYLES.CODE_BLOCK_BG_DARK};
                    --gemini-icon-filter: invert(1);
                }
            `;
            return cssVariables + styles.reduce((css, styleObj) => {
                for (const [selector, props] of Object.entries(styleObj)) {
                    css += `${selector} {`;
                    for (const [prop, value] of Object.entries(props)) {
                        css += `${prop}: ${value};`;
                    }
                    css += '}';
                }
                return css;
            }, '');
        }
    };
    const Styles = {
        initStyles() {
            const styleElement = document.createElement('style');
            styleElement.id = 'bing-plus-styles';
            styleElement.textContent = StyleGenerator.generateStyles();
            document.head.appendChild(styleElement);
            this.applyMobileStyles();
        },
        applyMobileStyles() {
            if (DeviceDetector.isMobile()) document.documentElement.classList.add('mobile-useragent');
            else if (DeviceDetector.isDesktop()) document.documentElement.classList.add('desktop-useragent');
        }
    };

    // ---------------------- Theme Manager ----------------------
    const ThemeManager = {
        currentTheme: 'light',
        init() {
            const savedTheme = localStorage.getItem(Config.STORAGE_KEYS.THEME_MODE);
            if (savedTheme) this.currentTheme = savedTheme;
            else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) this.currentTheme = 'dark';
            this.applyTheme();
        },
        applyTheme() {
            if (this.currentTheme === 'dark') document.documentElement.classList.add('dark-mode');
            else document.documentElement.classList.remove('dark-mode');
        },
        toggleTheme() {
            this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
            localStorage.setItem(Config.STORAGE_KEYS.THEME_MODE, this.currentTheme);
            this.applyTheme();
            this.updateThemeToggleButtonIcon();
        },
        getThemeToggleButtonIcon() {
            return this.currentTheme === 'light' ? Config.ASSETS.DARK_MODE_ICON : Config.ASSETS.LIGHT_MODE_ICON;
        },
        updateThemeToggleButtonIcon() {
            const themeToggleButton = document.getElementById('gemini-theme-toggle-btn');
            if (themeToggleButton) {
                themeToggleButton.src = this.getThemeToggleButtonIcon();
                themeToggleButton.title = this.currentTheme === 'light' ? 'Dark Mode' : 'Light Mode';
            }
        },
        observeThemeChange() {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                const newTheme = e.matches ? 'dark' : 'light';
                if (this.currentTheme !== newTheme) {
                    this.currentTheme = newTheme;
                    localStorage.setItem(Config.STORAGE_KEYS.THEME_MODE, this.currentTheme);
                    this.applyTheme();
                    this.updateThemeToggleButtonIcon();
                }
            });
        }
    };

    // ---------------------- Utils ----------------------
    const Utils = {
        getQuery() {
            return new URLSearchParams(location.search).get('q');
        },
        getApiKey() {
            let key = localStorage.getItem('geminiApiKey');
            if (!key) {
                key = prompt(Localization.getMessage(Config.MESSAGE_KEYS.ENTER_API_KEY));
                if (key) localStorage.setItem('geminiApiKey', key);
            }
            return key;
        },
        getGeminiEnabled() {
            const val = localStorage.getItem(Config.STORAGE_KEYS.GEMINI_ENABLED);
            return val === null ? true : val === 'true';
        },
        setGeminiEnabled(enabled) {
            localStorage.setItem(Config.STORAGE_KEYS.GEMINI_ENABLED, enabled ? 'true' : 'false');
        }
    };

    // ---------------------- UI ----------------------
    const UI = {
        createSearchButton(query) {
            const btn = document.createElement('button');
            if (DeviceDetector.isGoogle()) {
                btn.id = 'bing-search-btn';
                btn.innerHTML = `
                    <img src="${Config.ASSETS.BING_LOGO}" alt="Bing Logo" style="width: ${Config.STYLES.SMALL_ICON_SIZE}; height: ${Config.STYLES.SMALL_ICON_SIZE}; vertical-align: middle;">
                    ${Localization.getMessage(Config.MESSAGE_KEYS.SEARCH_ON_BING)}
                `;
                btn.onclick = () => window.open(`https://www.bing.com/search?q=${encodeURIComponent(query)}`, '_blank');
            } else {
                btn.id = 'google-search-btn';
                btn.innerHTML = `
                    <img src="${Config.ASSETS.GOOGLE_LOGO}" alt="Google Logo">
                    ${Localization.getMessage(Config.MESSAGE_KEYS.SEARCH_ON_GOOGLE)}
                `;
                btn.onclick = () => window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
            }
            return btn;
        },

        createGeminiToggleSwitch(enabled, onToggle) {
            // 첨부 이미지와 유사하게 구현
            const wrapper = document.createElement('div');
            wrapper.style.display = 'flex';
            wrapper.style.alignItems = 'center';
            wrapper.style.gap = '6px';
            wrapper.style.height = '28px';
            wrapper.style.marginRight = '10px';

            // Toggle bg
            const toggle = document.createElement('div');
            toggle.style.width = '44px';
            toggle.style.height = '24px';
            toggle.style.borderRadius = '12px';
            toggle.style.position = 'relative';
            toggle.style.cursor = 'pointer';
            toggle.style.background = enabled ? '#d1d5db' : '#353535';
            toggle.style.transition = 'background 0.2s';

            // Knob
            const knob = document.createElement('div');
            knob.style.width = '24px';
            knob.style.height = '24px';
            knob.style.borderRadius = '50%';
            knob.style.background = enabled ? '#fff' : '#777';
            knob.style.position = 'absolute';
            knob.style.top = '0';
            knob.style.left = enabled ? '20px' : '0';
            knob.style.boxShadow = '0 1px 3px rgba(0,0,0,0.10)';
            knob.style.transition = 'left 0.2s, background 0.2s';

            toggle.appendChild(knob);

            toggle.onclick = () => {
                const newState = !enabled;
                onToggle(newState);
            };

            // ON/OFF text
            const stateText = document.createElement('span');
            stateText.textContent = enabled ? 'ON' : 'OFF';
            stateText.style.color = enabled ? 'var(--gemini-title-color)' : '#bbb';
            stateText.style.fontWeight = 'bold';
            stateText.style.fontSize = '14px';
            stateText.style.width = '32px';

            wrapper.appendChild(toggle);
            wrapper.appendChild(stateText);

            wrapper.update = (en) => {
                toggle.style.background = en ? '#d1d5db' : '#353535';
                knob.style.left = en ? '20px' : '0';
                knob.style.background = en ? '#fff' : '#777';
                stateText.textContent = en ? 'ON' : 'OFF';
                stateText.style.color = en ? 'var(--gemini-title-color)' : '#bbb';
            };

            return wrapper;
        },

        createGeminiBox(query, apiKey) {
            const box = document.createElement('div');
            box.id = 'gemini-box';

            // Gemini On/Off 상태
            const enabled = Utils.getGeminiEnabled();

            box.innerHTML = `
                <div id="gemini-header">
                    <div id="gemini-title-wrap">
                        <img id="gemini-logo" src="${Config.ASSETS.GEMINI_LOGO}" alt="Gemini Logo">
                        <h3>Gemini Search Results</h3>
                    </div>
                    <div style="display: flex; align-items: center;">
                        <span id="gemini-toggle-switch"></span>
                        <img id="gemini-theme-toggle-btn" title="${ThemeManager.currentTheme === 'light' ? 'Dark Mode' : 'Light Mode'}" src="${ThemeManager.getThemeToggleButtonIcon()}" />
                        <img id="gemini-refresh-btn" title="Refresh" src="${Config.ASSETS.REFRESH_ICON}" />
                    </div>
                </div>
                <hr id="gemini-divider">
                <div id="gemini-content">${enabled ? Localization.getMessage(Config.MESSAGE_KEYS.LOADING) : Localization.getMessage(Config.MESSAGE_KEYS.GEMINI_OFF)}</div>
            `;

            // 토글 스위치 생성 및 삽입
            const toggleWrapper = this.createGeminiToggleSwitch(enabled, (newState) => {
                Utils.setGeminiEnabled(newState);
                // 상태 바뀌면 Gemini 전체 새로고침
                UIRenderer.render();
            });
            box.querySelector('#gemini-toggle-switch').appendChild(toggleWrapper);

            // 테마/새로고침 버튼 이벤트
            box.querySelector('#gemini-refresh-btn').onclick = () => UIRenderer.refreshGemini(query, apiKey);
            box.querySelector('#gemini-theme-toggle-btn').onclick = () => ThemeManager.toggleTheme();

            if (DeviceDetector.isDesktop()) VersionChecker.checkMarkedJsVersion();

            return box;
        },

        createGeminiUI(query, apiKey) {
            const wrapper = document.createElement('div');
            wrapper.id = 'gemini-wrapper';
            wrapper.appendChild(this.createSearchButton(query));
            wrapper.appendChild(this.createGeminiBox(query, apiKey));
            return wrapper;
        },

        removeExistingElements() {
            document.querySelectorAll('#gemini-wrapper, #google-search-btn, #bing-search-btn').forEach(el => el.remove());
        },

        createRHSIfNeeded() {
            if (DeviceDetector.isGoogle() && !document.getElementById('rhs')) {
                const mainContent = document.getElementById('rcnt');
                if (mainContent) {
                    const rhsDiv = document.createElement('div');
                    rhsDiv.id = 'rhs';
                    rhsDiv.setAttribute('jsname', 'Iclw3');
                    rhsDiv.style.cssText = `
                        float: right;
                        padding-left: 16px;
                        width: 432px;
                        margin-top: 20px;
                    `;
                    mainContent.appendChild(rhsDiv);
                }
            }
        }
    };

    // ---------------------- Gemini API ----------------------
    const GeminiAPI = {
        fetch(query, container, apiKey, force = false) {
            const enabled = Utils.getGeminiEnabled();
            if (!enabled) {
                container.innerHTML = Localization.getMessage(Config.MESSAGE_KEYS.GEMINI_OFF);
                return;
            }
            const cacheKey = `${Config.CACHE.PREFIX}${query}`;
            const cached = force ? null : sessionStorage.getItem(cacheKey);
            if (cached) {
                container.innerHTML = marked.parse(cached);
                return;
            }

            if (!apiKey) {
                container.textContent = Localization.getMessage(Config.MESSAGE_KEYS.ENTER_API_KEY);
                return;
            }
            container.textContent = Localization.getMessage(Config.MESSAGE_KEYS.LOADING);

            const promptText = Localization.getMessage(Config.MESSAGE_KEYS.PROMPT, { query });
            GM_xmlhttpRequest({
                method: 'POST',
                url: `${Config.API.GEMINI_URL}${Config.API.GEMINI_MODEL}:generateContent?key=${apiKey}`,
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify({
                    contents: [{ parts: [{ text: promptText }] }],
                    tools: [{ "google_search": {} }],
                    generationConfig: { thinkingConfig: { thinkingBudget: 0 } },
                }),
                onload({ status, responseText }) {
                    try {
                        const parsedResponse = JSON.parse(responseText);
                        const text = parsedResponse?.candidates?.[0]?.content?.parts?.[0]?.text;
                        if (text) {
                            sessionStorage.setItem(cacheKey, text);
                            if (container) container.innerHTML = marked.parse(text);
                        } else {
                            if (container) {
                                if (parsedResponse.error) {
                                    container.textContent = `❌ Gemini API 오류: ${parsedResponse.error.message ||
                                        JSON.stringify(parsedResponse.error)}`;
                                } else {
                                    container.textContent = Localization.getMessage(Config.MESSAGE_KEYS.GEMINI_EMPTY);
                                }
                            }
                        }
                    } catch (e) {
                        if (container) container.textContent = `${Localization.getMessage(Config.MESSAGE_KEYS.PARSE_ERROR)} ${e.message}`;
                    }
                },
                onerror(err) {
                    if (container) container.textContent = `${Localization.getMessage(Config.MESSAGE_KEYS.NETWORK_ERROR)} ${err.finalUrl || err.statusText || JSON.stringify(err)}`;
                },
                ontimeout() {
                    if (container) container.textContent = Localization.getMessage(Config.MESSAGE_KEYS.TIMEOUT);
                }
            });
        }
    };

    // ---------------------- Link Cleaner, Version Checker, RenderState, EventHandler 등 기타 ----------------------
    const LinkCleaner = {
        decodeRealUrl(url, key) {
            const param = new URL(url).searchParams.get(key)?.replace(/^a1/, '');
            if (!param) return null;
            try {
                const decoded = decodeURIComponent(atob(param.replace(/_/g, '/').replace(/-/g, '+')));
                return decoded.startsWith('/') ? location.origin + decoded : decoded;
            } catch {
                return null;
            }
        },
        resolveRealUrl(url) {
            const rules = [
                { pattern: /bing\.com\/(ck\/a|aclick)/, key: 'u' },
                { pattern: /so\.com\/search\/eclk/, key: 'aurl' },
                { pattern: /google\.com\/url/, key: 'url' }
            ];
            for (const { pattern, key } of rules) {
                if (pattern.test(url)) {
                    const real = this.decodeRealUrl(url, key);
                    if (real && real !== url) return real;
                }
            }
            return url;
        },
        convertLinksToReal(root) {
            root.querySelectorAll('a[href]').forEach(a => {
                const realUrl = this.resolveRealUrl(a.href);
                if (realUrl && realUrl !== a.href) a.href = realUrl;
            });
        }
    };

    const VersionChecker = {
        compareVersions(current, latest) {
            const currentParts = current.split('.').map(Number);
            const latestParts = latest.split('.').map(Number);
            for (let i = 0; i < Math.max(currentParts.length, latestParts.length); i++) {
                const c = currentParts[i] || 0;
                const l = latestParts[i] || 0;
                if (c < l) return -1;
                if (c > l) return 1;
            }
            return 0;
        },
        checkMarkedJsVersion() {
            localStorage.setItem(Config.STORAGE_KEYS.CURRENT_VERSION, Config.VERSIONS.MARKED_VERSION);
            GM_xmlhttpRequest({
                method: 'GET',
                url: Config.API.MARKED_CDN_URL,
                onload: ({ responseText }) => {
                    try {
                        const latest = JSON.parse(responseText).version;
                        localStorage.setItem(Config.STORAGE_KEYS.LATEST_VERSION, latest);

                        const lastNotified = localStorage.getItem(Config.STORAGE_KEYS.LAST_NOTIFIED);
                        if (this.compareVersions(Config.VERSIONS.MARKED_VERSION, latest) < 0 &&
                            (!lastNotified || this.compareVersions(lastNotified, latest) < 0)) {
                            const existingPopup = document.getElementById('marked-update-popup');
                            if (existingPopup) existingPopup.remove();

                            const popup = document.createElement('div');
                            popup.id = 'marked-update-popup';
                            popup.innerHTML = `
                                <p><b>${Localization.getMessage(Config.MESSAGE_KEYS.UPDATE_TITLE)}</b></p>
                                <p>Current: ${Config.VERSIONS.MARKED_VERSION}<br>Latest: ${latest}</p>
                                <button>${Localization.getMessage(Config.MESSAGE_KEYS.UPDATE_NOW)}</button>
                            `;
                            popup.querySelector('button').onclick = () => {
                                localStorage.setItem(Config.STORAGE_KEYS.LAST_NOTIFIED, latest);
                                popup.remove();
                            };
                            document.body.appendChild(popup);
                        }
                    } catch (e) { }
                },
                onerror: () => { }
            });
        }
    };

    const RenderState = {
        isRendering: false,
        geminiBoxExists: false,

        startRendering() {
            if (this.isRendering) return false;
            this.isRendering = true;
            return true;
        },
        finishRendering() { this.isRendering = false; },
        maintainGeminiBoxPosition(wrapper) {
            const existingGeminiWrapper = document.getElementById('gemini-wrapper');
            if (existingGeminiWrapper) existingGeminiWrapper.remove();
            if (DeviceDetector.isGoogle()) {
                UI.createRHSIfNeeded();
                const rhsTarget = document.getElementById('rhs');
                if (rhsTarget) {
                    rhsTarget.prepend(wrapper);
                    this.geminiBoxExists = true;
                } else this.geminiBoxExists = false;
            } else if (DeviceDetector.isBing()) {
                const bingContextTarget = document.getElementById('b_context') || document.querySelector('.b_right');
                if (bingContextTarget) {
                    bingContextTarget.prepend(wrapper);
                    this.geminiBoxExists = true;
                } else this.geminiBoxExists = false;
            }
        }
    };

    const EventHandler = {
        observeUrlChange(onChangeCallback) {
            let lastUrl = location.href;
            const checkUrlChange = () => {
                if (location.href !== lastUrl) {
                    lastUrl = location.href;
                    onChangeCallback();
                }
            };
            const originalPushState = history.pushState;
            history.pushState = function (...args) {
                originalPushState.apply(this, args);
                checkUrlChange();
            };
            const originalReplaceState = history.replaceState;
            history.replaceState = function (...args) {
                originalReplaceState.apply(this, args);
                checkUrlChange();
            };
            window.addEventListener('popstate', checkUrlChange);
            const observer = new MutationObserver(checkUrlChange);
            const targetNode = document.querySelector('head > title') || document.body;
            observer.observe(targetNode, { childList: true, subtree: true });
        }
    };

    // ---------------------- UIRenderer ----------------------
    const UIRenderer = {
        renderDesktop(query, apiKey) {
            const wrapper = UI.createGeminiUI(query, apiKey);
            RenderState.maintainGeminiBoxPosition(wrapper);
            if (RenderState.geminiBoxExists) {
                window.requestIdleCallback(() => {
                    const content = wrapper.querySelector('#gemini-content');
                    const enabled = Utils.getGeminiEnabled();
                    if (content) {
                        if (enabled) {
                            const cache = sessionStorage.getItem(`${Config.CACHE.PREFIX}${query}`);
                            if (cache) content.innerHTML = marked.parse(cache);
                            else window.requestIdleCallback(() => GeminiAPI.fetch(query, content, apiKey));
                        } else {
                            content.innerHTML = Localization.getMessage(Config.MESSAGE_KEYS.GEMINI_OFF);
                        }
                    }
                    RenderState.finishRendering();
                });
                return true;
            }
            RenderState.finishRendering();
            return false;
        },
        refreshGemini(query, apiKey) {
            // 새로고침 버튼에서 호출 (cache 무시)
            const content = document.querySelector('#gemini-content');
            if (content) GeminiAPI.fetch(query, content, apiKey, true);
        },
        renderMobile(query) {
            const contentTarget = document.getElementById('b_content') || document.getElementById('main');
            if (!contentTarget) {
                RenderState.finishRendering();
                return false;
            }
            requestAnimationFrame(() => {
                const searchBtn = UI.createSearchButton(query);
                if (contentTarget.parentNode) {
                    contentTarget.parentNode.style.overflow = 'visible';
                    contentTarget.parentNode.style.position = 'relative';
                    contentTarget.parentNode.insertBefore(searchBtn, contentTarget);
                } else {
                    document.body.prepend(searchBtn);
                }
                RenderState.finishRendering();
            });
            return true;
        },
        renderTablet() {
            RenderState.finishRendering();
            return true;
        },
        render() {
            if (!RenderState.startRendering()) return;
            const query = Utils.getQuery();
            if (!query) {
                RenderState.finishRendering();
                return;
            }
            UI.removeExistingElements();
            const deviceType = DeviceDetector.getDeviceType();
            if (deviceType === 'desktop') {
                const apiKey = Utils.getApiKey();
                if (!apiKey) {
                    RenderState.finishRendering();
                    return;
                }
                this.renderDesktop(query, apiKey);
            } else if (deviceType === 'mobile') {
                this.renderMobile(query);
            } else if (deviceType === 'tablet') {
                this.renderTablet();
            } else {
                RenderState.finishRendering();
            }
        }
    };

    // ---------------------- Initializer ----------------------
    const Initializer = {
        init() {
            const initialize = () => {
                ThemeManager.init();
                Styles.initStyles();
                LinkCleaner.convertLinksToReal(document);
                const checkAndRender = () => {
                    const targetElement = document.getElementById('rhs') || document.getElementById('b_context') || document.querySelector('.b_right');
                    if (targetElement || DeviceDetector.isMobile() || DeviceDetector.isTablet()) {
                        UIRenderer.render();
                    } else {
                        if (DeviceDetector.isGoogle()) {
                            UI.createRHSIfNeeded();
                            setTimeout(checkAndRender, 100);
                        } else setTimeout(checkAndRender, 100);
                    }
                };
                checkAndRender();
                EventHandler.observeUrlChange(() => {
                    UIRenderer.render();
                    LinkCleaner.convertLinksToReal(document);
                });
                ThemeManager.observeThemeChange();
            };
            if (document.readyState === 'complete' || document.readyState === 'interactive') setTimeout(initialize, 1);
            else document.addEventListener('DOMContentLoaded', initialize);
        }
    };

    // ---------------------- 실행 ----------------------
    Initializer.init();
})();