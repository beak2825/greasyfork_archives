// ==UserScript==
// @name         SkyFetch - BlueSky 最高分辨率图片下载
// @namespace    https://github.com/CookSleep
// @version      1.1
// @name:en      SkyFetch - High-Resolution Image Downloader for BlueSky
// @name:en-uk   SkyFetch - High-Resolution Image Downloader for BlueSky
// @name:ja      SkyFetch - BlueSky用高解像度画像ダウンローダー
// @name:ko      SkyFetch - BlueSky용 고해상도 이미지 다운로더
// @name:ru      SkyFetch - Загрузчик Изображений Высокого Разрешения для BlueSky
// @name:zh-CN   SkyFetch - BlueSky 最高分辨率图片下载
// @name:zh-TW   SkyFetch - BlueSky 最高解析度圖片下載
// @name:yue     SkyFetch - BlueSky 最高解析度圖片下載
// @description         在 BlueSky 含有图片的帖子右下角添加下载按钮，自动下载最高分辨率图片，可自定义命名规则。
// @description:en      Add a download button at the bottom right of BlueSky posts containing images to automatically download the highest resolution images with customizable naming rules.
// @description:en-uk   Add a download button at the bottom right of BlueSky posts containing images to automatically download the highest resolution images with customizable naming rules.
// @description:ja      画像を含むBlueSkyの投稿の右下隅にダウンロードボタンを追加し、最高解像度の画像を自動的にダウンロードし、カスタマイズ可能な命名規則を適用します。
// @description:ko      이미지가 포함된 BlueSky 게시물의 오른쪽 하단에 다운로드 버튼을 추가하여 최고 해상도 이미지를 자동으로 다운로드하고 사용자 정의 가능한 명명 규칙을 적용합니다.
// @description:ru      Добавляет кнопку загрузки в правый нижний угол постов BlueSky, содержащих изображения, для автоматической загрузки изображений наивысшего разрешения с настраиваемыми правилами именования.
// @description:zh-CN   在 BlueSky 含有图片的帖子右下角添加下载按钮，自动下载最高分辨率图片，可自定义命名规则。
// @description:zh-TW   在 BlueSky 含有圖片的帖子右下角添加下載按鈕，自動下載最高解析度圖片，可自定義命名規則。
// @description:yue     在 BlueSky 含有圖片的帖子右下角添加下載按鈕，自動下載最高解析度圖片，可自定義命名規則。
// @author       Cook Sleep
// @match        https://bsky.app/*
// @grant        GM_download
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/524331/SkyFetch%20-%20BlueSky%20%E6%9C%80%E9%AB%98%E5%88%86%E8%BE%A8%E7%8E%87%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/524331/SkyFetch%20-%20BlueSky%20%E6%9C%80%E9%AB%98%E5%88%86%E8%BE%A8%E7%8E%87%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

/*
 * 本脚本使用了 [Twitter Media Downloader](https://greasyfork.org/es/scripts/423001-twitter-media-downloader) 项目的下载按钮 SVG，
 * 该项目基于 MIT 许可证发布。
 * MIT 许可证: https://opensource.org/licenses/MIT
 *
 * This script uses the download button SVG from the [Twitter Media Downloader](https://greasyfork.org/es/scripts/423001-twitter-media-downloader) project,
 * which is licensed under the MIT License.
 * MIT License: https://opensource.org/licenses/MIT
 */

(function() {
    'use strict';

    // =====================
    // CSS 样式管理
    // =====================
    const styles = `
        /* 主题样式 */
        :root {
            --background: #ffffff;
            --background-hover: #f7fafc;
            --background-translucent: rgba(255, 255, 255, 0.95);
            --text: #1a202c;
            --border: #e2e8f0;
            --overlay: rgba(0, 0, 0, 0.5);
            --input-background: #f7fafc;
            --accent: #1083FE;
            --accent-hover: #0168D5;
            --accent-translucent: rgba(16, 131, 254, 0.1);
            --button-background: #ffffff;
            --button-background-hover: #F1F3F5;
            --button-text: #1a202c;
            --button-border: #e2e8f0;
        }

        @media (prefers-color-scheme: dark) {
            :root {
                --background: #161E27;
                --background-hover: #2d3748;
                --background-translucent: rgba(22, 30, 39, 0.95);
                --text: #fff;
                --border: #2d3748;
                --overlay: rgba(0, 0, 0, 0.75);
                --input-background: #2d3748;
                --accent: #208BFE;
                --accent-hover: #4CA2FE;
                --accent-translucent: rgba(32, 139, 254, 0.2);
                --button-background: #1E2936;
                --button-background-hover: #2d3748;
                --button-text: #fff;
                --button-border: #4a5568;
            }
        }

        /* 按钮样式 */
        .tmd-down {
            align-items: center;
        }

        .tmd-down button {
            padding: 5px;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 999px;
            cursor: pointer;
            background: transparent;
            border: none;
        }

        .tmd-down button:hover {
            background-color: var(--hover-color, rgba(120, 142, 165, 0.1));
        }

        /* 深色模式图标颜色 */
        @media (prefers-color-scheme: dark) {
            .tmd-down svg {
                color: hsl(211, 20%, 56%);
            }
            .tmd-down {
                --hover-color: rgba(120, 142, 165, 0.1);
            }
        }

        /* 浅色模式图标颜色 */
        @media (prefers-color-scheme: light) {
            .tmd-down svg {
                color: hsl(211, 20%, 53%);
            }
            .tmd-down {
                --hover-color: rgba(120, 142, 165, 0.1);
            }
        }

        .tmd-down.loading svg {
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .tmd-down.failed svg {
            color: rgb(255, 51, 51);
        }

        /* 设置界面样式 */
        .skyfetch-settings-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--overlay);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1001;
            padding: 16px;
            box-sizing: border-box;
        }

        .skyfetch-settings-content {
            background-color: var(--background);
            color: var(--text);
            padding: 24px;
            border-radius: 12px;
            width: min(480px, 90vw);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            border: 1px solid var(--border);
            position: relative;
        }

        .skyfetch-settings-content h2 {
            margin: 0 0 16px 0;
            font-size: 20px;
            font-weight: 600;
            padding-right: 32px;
        }

        .skyfetch-settings-content label {
            display: block;
            margin: 0 0 8px 0;
            font-weight: 500;
        }

        .skyfetch-settings-content textarea {
            width: 100%;
            padding: 12px;
            margin: 0 0 20px 0;
            border: 1px solid var(--border);
            border-radius: 6px;
            background-color: var(--input-background);
            color: var(--text);
            resize: vertical;
            min-height: 80px;
            font-family: monospace;
            font-size: 14px;
            line-height: 1.4;
            box-sizing: border-box;
        }

        .skyfetch-settings-content textarea:focus {
            outline: none;
            border-color: var(--accent);
            box-shadow: 0 0 0 2px var(--accent-translucent);
        }

        .skyfetch-settings-content .button-group {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
        }

        .skyfetch-settings-content button {
            padding: 8px 16px;
            background-color: var(--button-background);
            color: var(--button-text);
            border: 1px solid var(--button-border);
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s;
        }

        .skyfetch-settings-content button:hover {
            background-color: var(--button-background-hover);
        }

        .skyfetch-settings-content button.primary {
            background-color: var(--accent);
            border-color: var(--accent);
            color: white;
        }

        .skyfetch-settings-content button.primary:hover {
            background-color: var(--accent-hover);
            border-color: var(--accent-hover);
        }

        /* 不支持语言提示弹窗样式 */
        .skyfetch-notice-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--overlay);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1001;
            padding: 16px;
            box-sizing: border-box;
            backdrop-filter: blur(4px);
        }

        .skyfetch-notice-content {
            max-width: 480px;
            width: 90vw;
            background-color: var(--background);
            color: var(--text);
            padding: 28px;
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
            border: 1px solid var(--border);
            position: relative;
        }

        .skyfetch-notice-content h2 {
            font-size: 22px;
            margin: 0 0 20px 0;
            padding-right: 32px;
            font-weight: 600;
            color: var(--text);
        }

        .skyfetch-notice-content p {
            font-size: 15px;
            line-height: 1.6;
            margin: 0 0 16px 0;
            color: var(--text);
            opacity: 0.9;
        }

        .skyfetch-notice-content button {
            width: 100%;
            padding: 12px;
            background-color: var(--accent);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 15px;
            font-weight: 500;
            transition: all 0.2s ease;
        }

        .skyfetch-notice-content button:hover {
            background-color: var(--accent-hover);
            transform: translateY(-1px);
        }

        /* 支持语言列表样式 */
        .skyfetch-supported-languages {
            background: var(--input-background);
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
        }

        .supported-languages-title {
            font-weight: 600;
            font-size: 15px;
            margin-bottom: 16px;
            color: var(--text);
        }

        .supported-languages-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
        }

        .languages-column {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .language-item {
            font-size: 14px;
            color: var(--text);
            opacity: 0.9;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        /* 关闭按钮样式 */
        .skyfetch-close-btn {
            position: absolute;
            top: 24px;
            right: 24px;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border-radius: 8px;
            background: var(--input-background);
            color: var(--text);
            transition: all 0.2s ease;
        }

        .skyfetch-close-btn:hover {
            background: var(--button-background-hover);
            transform: rotate(90deg);
        }

        .skyfetch-close-btn svg {
            width: 20px;
            height: 20px;
        }
    `;
    // 将CSS添加到文档头部
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // =====================
    // 初始设置
    // =====================
    const defaultFilename = 'BlueSky_{userName}_{userId}_{date}';
    let filenamePattern = GM_getValue('filenamePattern', defaultFilename);
    let currentLang = 'en';

    // =====================
    // 多语言翻译
    // =====================
    const translations = {
        'en': {
            settingsTitle: 'SkyFetch Settings',
            filenameLabel: 'Filename Pattern:',
            resetButton: 'Reset',
            saveButton: 'Save',
            downloadButtonLabel: 'Download Image',
            downloadFailed: 'Download failed',
            downloadCompleted: 'Download completed',
            downloading: 'Downloading...',
            unsupportedLanguageTitle: 'Language Not Supported',
            unsupportedLanguageMessage1: 'The current interface language ({lang}) is not supported',
            unsupportedLanguageMessage2: 'Post dates will be marked as "unknown_date" in downloaded image filenames',
            understood: 'Understood',
            supportedLanguages: 'Supported Languages'
        },
        'en-uk': {
            settingsTitle: 'SkyFetch Settings',
            filenameLabel: 'Filename Pattern:',
            resetButton: 'Reset',
            saveButton: 'Save',
            downloadButtonLabel: 'Download Image',
            downloadFailed: 'Download failed',
            downloadCompleted: 'Download completed',
            downloading: 'Downloading...',
            unsupportedLanguageTitle: 'Language Not Supported',
            unsupportedLanguageMessage1: 'The current interface language ({lang}) is not supported',
            unsupportedLanguageMessage2: 'Post dates will be marked as "unknown_date" in downloaded image filenames',
            understood: 'Understood',
            supportedLanguages: 'Supported Languages'
        },
        'ja': {
            settingsTitle: 'SkyFetch 設定',
            filenameLabel: 'ファイル名のパターン:',
            resetButton: 'リセット',
            saveButton: '保存',
            downloadButtonLabel: '画像をダウンロード',
            downloadFailed: 'ダウンロードに失敗しました',
            downloadCompleted: 'ダウンロード完了',
            downloading: 'ダウンロード中...',
            unsupportedLanguageTitle: '未対応の言語',
            unsupportedLanguageMessage1: '現在のインターフェース言語（{lang}）はサポートされていません',
            unsupportedLanguageMessage2: '投稿日は「unknown_date」としてダウンロードされます',
            understood: '了解',
            supportedLanguages: '対応言語'
        },
        'ko': {
            settingsTitle: 'SkyFetch 설정',
            filenameLabel: '파일명 패턴:',
            resetButton: '초기화',
            saveButton: '저장',
            downloadButtonLabel: '이미지 다운로드',
            downloadFailed: '다운로드 실패',
            downloadCompleted: '다운로드 완료',
            downloading: '다운로드 중...',
            unsupportedLanguageTitle: '지원되지 않는 언어',
            unsupportedLanguageMessage1: '현재 인터페이스 언어({lang})는 지원되지 않습니다',
            unsupportedLanguageMessage2: '게시물 날짜는 "unknown_date"로 표시됩니다',
            understood: '확인',
            supportedLanguages: '지원되는 언어'
        },
        'ru': {
            settingsTitle: 'Настройки SkyFetch',
            filenameLabel: 'Шаблон имени файла:',
            resetButton: 'Сбросить',
            saveButton: 'Сохранить',
            downloadButtonLabel: 'Скачать изображение',
            downloadFailed: 'Скачивание не удалось',
            downloadCompleted: 'Скачивание завершено',
            downloading: 'Скачивание...',
            unsupportedLanguageTitle: 'Язык не поддерживается',
            unsupportedLanguageMessage1: 'Текущий язык интерфейса ({lang}) не поддерживается',
            unsupportedLanguageMessage2: 'Даты публикаций будут отмечены как "unknown_date"',
            understood: 'Понятно',
            supportedLanguages: 'Поддерживаемые языки'
        },
        'zh-CN': {
            settingsTitle: 'SkyFetch 设置',
            filenameLabel: '文件名模式:',
            resetButton: '重置',
            saveButton: '保存',
            downloadButtonLabel: '下载图片',
            downloadFailed: '下载失败',
            downloadCompleted: '下载完成',
            downloading: '下载中...',
            unsupportedLanguageTitle: '不支持的语言',
            unsupportedLanguageMessage1: '当前界面语言（{lang}）不受支持',
            unsupportedLanguageMessage2: '下载的图片文件名中的发布日期将标记为"unknown_date"',
            understood: '知道了',
            supportedLanguages: '支持的语言'
        },
        'zh-TW': {
            settingsTitle: 'SkyFetch 設定',
            filenameLabel: '文件名模式:',
            resetButton: '重置',
            saveButton: '保存',
            downloadButtonLabel: '下載圖片',
            downloadFailed: '下載失敗',
            downloadCompleted: '下載完成',
            downloading: '下載中...',
            unsupportedLanguageTitle: '不支援的語言',
            unsupportedLanguageMessage1: '目前介面語言（{lang}）不受支援',
            unsupportedLanguageMessage2: '下載嘅圖片檔名入面嘅發布日期會標記做"unknown_date"',
            understood: '知道了',
            supportedLanguages: '支援的語言'
        },
        'yue': {
            settingsTitle: 'SkyFetch 設定',
            filenameLabel: '文件名模式:',
            resetButton: '重設',
            saveButton: '儲存',
            downloadButtonLabel: '下載圖片',
            downloadFailed: '下載失敗',
            downloadCompleted: '下載完成',
            downloading: '下載中...',
            unsupportedLanguageTitle: '唔支援嘅語言',
            unsupportedLanguageMessage1: '而家嘅界面語言（{lang}）係唔支援嘅',
            unsupportedLanguageMessage2: '下載嘅圖片檔名入面嘅發布日期會標記做"unknown_date"',
            understood: '知道喇',
            supportedLanguages: '支援嘅語言'
        }
    };

    // =====================
    // 语言相关设置
    // =====================
    const languageMapping = {
        'en': 'en',
        'en-GB': 'en-uk',
        'ja': 'ja',
        'ko': 'ko',
        'ru': 'ru',
        'zh-Hans-CN': 'zh-CN',
        'zh-Hant-TW': 'zh-TW',
        'zh-Hant-HK': 'yue'
    };

    /**
     * 检查语言是否受支持
     * @param {string} lang - 语言代码
     * @returns {boolean} 是否支持
     */
    function isLanguageSupported(lang) {
        return lang in translations;
    }

    /**
     * 获取网站当前语言并设置翻译
     * @returns {object} 包含映射前后语言代码的对象
     */
    function getSiteLanguage() {
        const langSelector = document.querySelector('select[data-testid="web_picker"]');
        let siteLanguage = langSelector ? langSelector.value : document.documentElement.lang || 'en';

        // 映射语言代码
        let mappedLanguage = languageMapping[siteLanguage] || 'en';

        // 如果映射后的语言不在支持列表中，使用英语
        if (!isLanguageSupported(mappedLanguage)) {
            mappedLanguage = 'en';
        }

        currentLang = mappedLanguage;
        return { mappedLanguage, siteLanguage };
    }

    /**
     * 语言提示状态管理
     */
    const LanguageNoticeManager = {
        // 存储键名
        STORAGE_KEY: 'skyfetch_language_notice',

        /**
         * 获取上次提示的语言
         * @returns {string|null} 上次提示的语言代码
         */
        getLastNotifiedLang() {
            return GM_getValue(this.STORAGE_KEY, null);
        },

        /**
         * 记录语言提示状态
         * @param {string} lang - 语言代码
         */
        markAsNotified(lang) {
            GM_setValue(this.STORAGE_KEY, lang);
        },

        /**
         * 重置提示状态
         */
        reset() {
            GM_setValue(this.STORAGE_KEY, null);
        },

        /**
         * 检查是否需要显示提示
         * @param {string} currentLang - 当前语言代码
         * @returns {boolean} 是否需要显示提示
         */
        shouldShowNotice(currentLang) {
            const lastNotifiedLang = this.getLastNotifiedLang();

            // 如果从未提示过，或者切换到了新的不支持的语言
            return !lastNotifiedLang || lastNotifiedLang !== currentLang;
        }
    };

    /**
     * 获取浏览器语言并映射到支持的语言代码
     * @returns {string} 映射后的语言代码
     */
    function getBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;

        // 尝试映射浏览器语言
        let mappedLanguage = languageMapping[browserLang] ||
                            languageMapping[browserLang.split('-')[0]] ||
                            'en';

        // 如果映射后的语言不在支持列表中，使用英语
        if (!isLanguageSupported(mappedLanguage)) {
            mappedLanguage = 'en';
        }

        return mappedLanguage;
    }

    // 添加支持的语言列表
    const supportedLanguages = {
        'en': 'English',
        'en-uk': 'English (UK)',
        'ja': '日本語',
        'ko': '한국어',
        'ru': 'Русский',
        'zh-CN': '简体中文',
        'zh-TW': '繁體中文',
        'yue': '粵文'
    };

    /**
     * 显示语言不支持提示
     * @param {string} lang - 不支持的语言代码
     * @returns {Promise} - 用户确认后resolve的Promise
     */
    function showUnsupportedLanguageNotice(lang) {
        return new Promise((resolve) => {
            const browserLang = getBrowserLanguage();
            const t = translations[browserLang] || translations['en'];

            const modal = document.createElement('div');
            modal.className = 'skyfetch-notice-modal';

            const content = document.createElement('div');
            content.className = 'skyfetch-notice-content';

            const closeBtn = document.createElement('div');
            closeBtn.className = 'skyfetch-close-btn';
            closeBtn.innerHTML = `
                <svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
            `;

            const sadFaceIcon = document.createElement('div');
            sadFaceIcon.className = 'skyfetch-sad-face';
            sadFaceIcon.innerHTML = `
                <svg viewBox="0 0 48 48" width="48" height="48">
                    <rect x="0" y="0" width="48" height="48" fill="#0078D7"/>
                    <text x="12" y="32" fill="white" style="font-size: 24px; font-family: monospace;">:(</text>
                </svg>
            `;

            const title = document.createElement('h2');
            title.innerText = t.unsupportedLanguageTitle;

            // 第一行消息：当前界面语言（xxx）不受支持
            const message1 = document.createElement('p');
            message1.innerText = t.unsupportedLanguageMessage1.replace('{lang}', lang || 'unknown');

            // 第二行消息：下载的图片文件名中的发布日期将标记为"unknown_date"
            const message2 = document.createElement('p');
            message2.innerText = t.unsupportedLanguageMessage2;

            const button = document.createElement('button');
            button.className = 'primary';
            button.innerText = t.understood;
            button.onclick = () => {
                modal.remove();
                LanguageNoticeManager.markAsNotified(lang);
                resolve();
            };

            closeBtn.onclick = button.onclick;

            content.appendChild(closeBtn);
            content.appendChild(sadFaceIcon);
            content.appendChild(title);
            content.appendChild(message1);
            content.appendChild(message2);
            content.appendChild(button);

            // 优化后的支持语言列表
            const supportedLangList = document.createElement('div');
            supportedLangList.className = 'skyfetch-supported-languages';
            supportedLangList.innerHTML = `
                <div class="supported-languages-title">${t.supportedLanguages}</div>
                <div class="supported-languages-grid">
                    <div class="languages-column">
                        ${Object.values(supportedLanguages)
                            .slice(0, Math.ceil(Object.values(supportedLanguages).length / 2))
                            .map(lang => `<div class="language-item">• ${lang}</div>`)
                            .join('')}
                    </div>
                    <div class="languages-column">
                        ${Object.values(supportedLanguages)
                            .slice(Math.ceil(Object.values(supportedLanguages).length / 2))
                            .map(lang => `<div class="language-item">• ${lang}</div>`)
                            .join('')}
                    </div>
                </div>
            `;

            content.insertBefore(supportedLangList, button);

            modal.appendChild(content);

            document.body.appendChild(modal);
        });
    }

    /**
     * 监听语言变化
     */
    let isReloading = false; // 是否正在刷新
    const RELOAD_COOLDOWN = 2500; // 刷新冷却时间（毫秒）

    function observeLanguageChange() {
        const observer = new MutationObserver(async (mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'lang') {
                    const { mappedLanguage, siteLanguage } = getSiteLanguage();

                    // 如果切换到不支持的语言，且未显示过提示
                    if (!(siteLanguage in languageMapping) &&
                        LanguageNoticeManager.shouldShowNotice(siteLanguage)) {
                        await showUnsupportedLanguageNotice(siteLanguage);
                        LanguageNoticeManager.markAsNotified(siteLanguage);
                    }

                    const currentTime = Date.now();
                    const lastReload = parseInt(localStorage.getItem('lastReloadTime') || '0');

                    // 如果距离上次刷新不足2秒，则不刷新
                    if (currentTime - lastReload < RELOAD_COOLDOWN) {
                        break;
                    }

                    // 记录本次刷新时间
                    localStorage.setItem('lastReloadTime', currentTime.toString());
                    window.location.reload();
                    break;
                }
            }
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['lang']
        });
    }

    // =====================
    // 菜单命令注册
    // =====================
    /**
     * 获取设置界面的翻译
     * @returns {object} 翻译对象
     */
    function getSettingsTranslations() {
        const browserLang = getBrowserLanguage(); // 使用浏览器语言
        return translations[browserLang] || translations['en'];
    }

    /**
     * 注册菜单命令
     */
    function registerMenuCommand() {
        const t = getSettingsTranslations();
        GM_registerMenuCommand(t.settingsTitle, openSettings);
    }

    // =====================
    // 设置界面
    // =====================
    /**
     * 打开设置界面
     */
    function openSettings() {
        const t = getSettingsTranslations();

        const settingsModal = document.createElement('div');
        settingsModal.className = 'skyfetch-settings-modal';

        const modalContent = document.createElement('div');
        modalContent.className = 'skyfetch-settings-content';

        const closeBtn = document.createElement('div');
        closeBtn.className = 'skyfetch-close-btn';
        closeBtn.innerHTML = `
            <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
        `;
        closeBtn.onclick = () => settingsModal.remove();
        modalContent.appendChild(closeBtn);

        const title = document.createElement('h2');
        title.innerText = t.settingsTitle;
        modalContent.appendChild(title);

        const filenameLabel = document.createElement('label');
        filenameLabel.innerText = t.filenameLabel;
        modalContent.appendChild(filenameLabel);

        const filenameInput = document.createElement('textarea');
        filenameInput.value = filenamePattern;
        modalContent.appendChild(filenameInput);

        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'button-group';

        const resetButton = document.createElement('button');
        resetButton.innerText = t.resetButton;
        resetButton.onclick = () => {
            filenameInput.value = defaultFilename;
        };
        buttonGroup.appendChild(resetButton);

        const saveButton = document.createElement('button');
        saveButton.className = 'primary';
        saveButton.innerText = t.saveButton;
        saveButton.onclick = () => {
            filenamePattern = filenameInput.value || defaultFilename;
            GM_setValue('filenamePattern', filenamePattern);
            settingsModal.remove();
        };
        buttonGroup.appendChild(saveButton);

        modalContent.appendChild(buttonGroup);

        settingsModal.onclick = (e) => {
            if (e.target === settingsModal) {
                settingsModal.remove();
            }
        };

        settingsModal.appendChild(modalContent);
        document.body.appendChild(settingsModal);
    }

    // =====================
    // 页面变化监控
    // =====================
    function observePageChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    addDownloadButton();
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // =====================
    // 下载按钮功能
    // =====================
    /**
     * 在每个帖子和回帖中添加下载按钮
     */
    function addDownloadButton() {
        const t = translations[currentLang];
        const posts = document.querySelectorAll('[data-testid^="postThreadItem"], [data-testid^="feedItem"]');

        posts.forEach(post => {
            if (post.querySelector('.tmd-down')) return;

            const hasImages = post.querySelectorAll('img[src*="cdn.bsky.app/img/feed_thumbnail/plain"]').length > 0;

            if (hasImages) {
                const interactionBar = post.querySelector('div.css-175oi2r[style*="justify-content: space-between"]');
                if (interactionBar) {
                    const downloadBtn = document.createElement('div');
                    downloadBtn.className = 'tmd-down';
                    downloadBtn.title = t.downloadButtonLabel;

                    downloadBtn.innerHTML = `
                        <button type="button" aria-label="${t.downloadButtonLabel}" style="gap: 4px; border-radius: 999px; flex-direction: row; justify-content: center; align-items: center; overflow: hidden; padding: 5px;">
                            <svg viewBox="0 0 24 24" width="20" height="20" style="pointer-events: none;">
                                <g class="download">
                                    <path d="M3,15 v4 q0,2 2,2 h14 q2,0 2,-2 v-4 M7,11 l4,4 q1,1 2,0 l4,-4 M12,4 v11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
                                </g>
                                <g class="completed" style="display: none;">
                                    <path d="M3,15 v4 q0,2 2,2 h14 q2,0 2,-2 v-4 M7,11 l3,4 q1,1 2,0 l8,-11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
                                </g>
                                <g class="loading" style="display: none;">
                                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="4" opacity="0.4"></circle>
                                    <path d="M12,2 a10,10 0 0 1 10,10" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"></path>
                                </g>
                                <g class="failed" style="display: none;">
                                    <circle cx="12" cy="12" r="11" fill="#f33" stroke="currentColor" stroke-width="2" opacity="0.8"></circle>
                                    <path d="M14,5 a1,1 0 0 0 -4,0 l0.5,9.5 a1.5,1.5 0 0 0 3,0 z M12,17 a2,2 0 0 0 0,4 a2,2 0 0 0 0,-4" fill="#fff" stroke="none"></path>
                                </g>
                            </svg>
                        </button>
                    `;

                    interactionBar.appendChild(downloadBtn);

                    downloadBtn.onclick = (event) => {
                        event.stopPropagation(); // 阻止事件冒泡
                        downloadBtn.classList.add('loading');
                        updateButtonStatus(downloadBtn, 'loading');

                        const imageElements = post.querySelectorAll('img[src*="cdn.bsky.app/img/feed_thumbnail/plain"]');
                        const imageUrls = Array.from(imageElements).map(img => convertUrl(img.src)).filter(url => url !== null);
                        const postId = post.getAttribute('data-testid').split('-').pop();
                        const postDate = extractPostDate(post);
                        const { userName, userId } = extractUserInfo(post);

                        if (imageUrls.length === 0) {
                            updateButtonStatus(downloadBtn, 'failed');
                            return;
                        }

                        // 创建一个 Promise 数组来处理所有下载请求
                        const downloadPromises = imageUrls.map((url, index) => {
                            let filename = filenamePattern
                                .replace('{userName}', userName)
                                .replace('{userId}', userId)
                                .replace('{date}', postDate);

                            filename += `_${index + 1}`;
                            filename = sanitizeFileName(filename);
                            filename += '.jpg';

                            return new Promise((resolve, reject) => {
                                GM_download({
                                    url: url,
                                    name: filename,
                                    onerror: (error) => {
                                        console.error('下载失败:', error);
                                        reject(error);
                                    },
                                    onload: () => {
                                        resolve();
                                    }
                                });
                            });
                        });

                        // 使用 Promise.all 等待所有下载完成
                        Promise.all(downloadPromises)
                            .then(() => {
                                updateButtonStatus(downloadBtn, 'completed');
                            })
                            .catch(() => {
                                updateButtonStatus(downloadBtn, 'failed');
                            });
                    };
                }
            }
        });
    }

    /**
     * 更新所有已存在的下载按钮
     */
    function updateAllDownloadButtons() {
        const buttons = document.querySelectorAll('.tmd-down button');
        const t = translations[currentLang] || translations['en'];  // 使用当前语言的翻译

        buttons.forEach(button => {
            button.setAttribute('aria-label', t.downloadButtonLabel);

            const parentDiv = button.closest('.tmd-down');
            if (parentDiv) {
                if (parentDiv.classList.contains('loading')) {
                    parentDiv.title = t.downloading;
                } else if (parentDiv.classList.contains('completed')) {
                    parentDiv.title = t.downloadCompleted;
                } else if (parentDiv.classList.contains('failed')) {
                    parentDiv.title = t.downloadFailed;
                }
            }
        });
    }

    /**
     * 更新按钮状态函数中的提示信息
     * @param {Element} btn - 按钮元素
     * @param {string} status - 状态：'download', 'completed', 'loading', 'failed'
     */
    function updateButtonStatus(btn, status) {
        const t = translations[currentLang];

        btn.classList.remove('download', 'completed', 'loading', 'failed');
        if (status) {
            btn.classList.add(status);
        }

        // 根据当前语言设置提示文本
        btn.title = status === 'completed' ? t.downloadCompleted :
                    status === 'failed' ? t.downloadFailed :
                    status === 'loading' ? t.downloading :
                    t.downloadButtonLabel;

        // 控制 SVG 显示
        const svgGroups = btn.querySelectorAll('g');
        svgGroups.forEach(group => {
            group.style.display = 'none';
        });
        const currentGroup = btn.querySelector(`g.${status}`);
        if (currentGroup) {
            currentGroup.style.display = 'block';
        }
    }

    // =====================
    // 辅助函数
    // =====================
    /**
     * 转换 CDN 链接为最高分辨率 API 端点
     * @param {string} inputUrl - 原始图片链接
     * @returns {string|null} - 转换后的链接或 null
     */
    function convertUrl(inputUrl) {
        if (!inputUrl) return null;

        try {
            const url = new URL(inputUrl);

            if (url.hostname !== 'cdn.bsky.app' || !url.pathname.includes('/img/feed_')) {
                return null;
            }

            const parts = url.pathname.split('/');
            const did = parts.find(part => part.startsWith('did:'));
            const cid = parts[parts.length - 1].split('@')[0];

            if (!did || !cid) {
                return null;
            }

            return `https://bsky.social/xrpc/com.atproto.sync.getBlob?did=${did}&cid=${cid}`;
        } catch (error) {
            return null;
        }
    }

    // 日期格式正则表达式和解析配置
    const datePatterns = {
        'en': /(\w+)\s+(\d{1,2}),\s+(\d{4})/i,
        'en-uk': /(\d{1,2})\s+(\w+)\s+(\d{4})/i,
        'ja': /(\d{4})年(\d{1,2})月(\d{1,2})日/,
        'ko': /(\d{4})년\s+(\d{1,2})월\s+(\d{1,2})일/,
        'ru': /(\d{1,2})\s+([\wа-яё]+)\s+(\d{4})/i,
        'zh-CN': /(\d{4})年(\d{1,2})月(\d{1,2})日/,
        'zh-TW': /(\d{4})年(\d{1,2})月(\d{1,2})日/,
        'yue': /(\d{4})年(\d{1,2})月(\d{1,2})日/
    };

    const dateParseConfig = {
        'en': { yearIndex: 3, monthIndex: 1, dayIndex: 2, monthIsName: true },
        'en-uk': { yearIndex: 3, monthIndex: 2, dayIndex: 1, monthIsName: true },
        'ja': { yearIndex: 1, monthIndex: 2, dayIndex: 3, monthIsName: false },
        'ko': { yearIndex: 1, monthIndex: 2, dayIndex: 3, monthIsName: false },
        'ru': { yearIndex: 3, monthIndex: 2, dayIndex: 1, monthIsName: true },
        'zh-CN': { yearIndex: 1, monthIndex: 2, dayIndex: 3, monthIsName: false },
        'zh-TW': { yearIndex: 1, monthIndex: 2, dayIndex: 3, monthIsName: false },
        'yue': { yearIndex: 1, monthIndex: 2, dayIndex: 3, monthIsName: false }
    };

    // 月份名称映射
    const monthMaps = {
        'en': {
            'january': '01', 'february': '02', 'march': '03', 'april': '04', 'may': '05', 'june': '06',
            'july': '07', 'august': '08', 'september': '09', 'october': '10', 'november': '11', 'december': '12'
        },
        'en-uk': {
            'january': '01', 'february': '02', 'march': '03', 'april': '04', 'may': '05', 'june': '06',
            'july': '07', 'august': '08', 'september': '09', 'october': '10', 'november': '11', 'december': '12'
        },
        'ru': {
            'января': '01', 'февраля': '02', 'марта': '03', 'апреля': '04', 'мая': '05', 'июня': '06',
            'июля': '07', 'августа': '08', 'сентября': '09', 'октября': '10', 'ноября': '11', 'декабря': '12'
        }
    };

    /**
     * 提取帖子发布日期
     * @param {Element} post - 帖子元素
     * @returns {string} - 日期字符串 (YYYY-MM-DD)
     */
    function extractPostDate(post) {
        // 获取映射后的语言代码
        const siteLanguage = getSiteLanguage();
        const lang = siteLanguage.mappedLanguage || 'en';

        const pattern = datePatterns[lang];
        const config = dateParseConfig[lang];

        // 如果没有找到对应的语言配置，使用英语作为后备
        if (!pattern || !config) {
            return 'unknown_date';
        }

        const monthMap = monthMaps[lang] || monthMaps['en'];

        // 主贴时间格式
        const mainPostTime = post.querySelector('div[style*="color: rgb(174, 187, 201)"][style*="line-height: 13.125px"]');
        if (mainPostTime) {
            const dateText = mainPostTime.textContent;
            const match = dateText.match(pattern);
            if (match) {
                let year, month, day;
                const monthText = match[config.monthIndex].toLowerCase();
                if (config.monthIsName) {
                    month = monthMap[monthText] || monthText.padStart(2, '0');
                } else {
                    month = match[config.monthIndex].padStart(2, '0');
                }
                day = match[config.dayIndex].padStart(2, '0');
                year = match[config.yearIndex];
                return `${year}-${month}-${day}`;
            }
        }

        // 回帖时间格式
        const replyTime = post.querySelector('a[data-tooltip][href*="/post/"]');
        if (replyTime) {
            const dateText = replyTime.getAttribute('data-tooltip');
            if (dateText) {
                const match = dateText.match(pattern);
                if (match) {
                    let year, month, day;
                    const monthText = match[config.monthIndex].toLowerCase();
                    if (config.monthIsName) {
                        month = monthMap[monthText] || monthText.padStart(2, '0');
                    } else {
                        month = match[config.monthIndex].padStart(2, '0');
                    }
                    day = match[config.dayIndex].padStart(2, '0');
                    year = match[config.yearIndex];
                    return `${year}-${month}-${day}`;
                }
            }
        }

        return 'unknown_date';
    }

    /**
     * 提取用户名和用户ID
     * @param {Element} post - 帖子元素
     * @returns {object} - 包含用户名和用户ID的对象
     */
    function extractUserInfo(post) {
        let userName = 'unknown_user';
        let userId = 'unknown_id';

        // 主贴样式 - 同时支持暗色和浅色模式
        const mainPost = post.querySelector('div[style*="font-weight: 600"][style*="font-size: 16.875px"]');
        const mainPostId = post.querySelector('div[style*="font-size: 15px"][style*="line-height: 20px"]');

        // 回帖和转发样式 - 同时支持暗色和浅色模式
        const replyPost = post.querySelector('span[style*="font-weight: 600"][style*="line-height: 20px"]');
        const replyPostId = post.querySelector('span[style*="line-height: 20px"]:not([style*="font-weight"])');

        if (mainPost && mainPostId) {
            userName = mainPost.textContent.replace(/[\u202A-\u202E]/g, '').trim();
            userId = mainPostId.textContent.replace(/[\u202A-\u202E]/g, '').trim();
        } else if (replyPost && replyPostId) {
            userName = replyPost.textContent.replace(/[\u202A-\u202E]/g, '').trim();
            userId = replyPostId.textContent.replace(/[\u202A-\u202E]/g, '').trim();
        }

        userId = userId.replace(/\s+/g, '').trim();

        return { userName, userId };
    }

    /**
     * 生成安全的随机标识符
     * @returns {string} - 4位随机标识符
     */
    function generateSecureId() {
        const array = new Uint32Array(1);
        crypto.getRandomValues(array);
        return array[0].toString(36).slice(0, 4);
    }

    /**
     * 清理文件名中的非法字符
     * @param {string} name - 原始文件名
     * @returns {string} - 清理后的文件名
     */
    function sanitizeFileName(name) {
        const secureId = generateSecureId();
        return name + '_' + secureId;
    }

    // =====================
    // 初始化函数
    // =====================
    /**
     * 初始化函数
     */
    async function initialize() {
        // 获取当前BS设置的语言
        const { mappedLanguage, siteLanguage } = getSiteLanguage();
        currentLang = mappedLanguage;

        // 检查是否需要显示语言不支持提示
        const needShowNotice = !(siteLanguage in languageMapping) &&
                              LanguageNoticeManager.shouldShowNotice(siteLanguage);

        if (needShowNotice) {
            await showUnsupportedLanguageNotice(siteLanguage);
            LanguageNoticeManager.markAsNotified(siteLanguage);
        }

        // 添加功能初始化
        addDownloadButton();
        observePageChanges();
        observeLanguageChange();
        registerMenuCommand();
    }

    // =====================
    // 页面加载完成后初始化
    // =====================
    window.addEventListener('load', () => {
        initialize().catch(console.error);
    });

})();
