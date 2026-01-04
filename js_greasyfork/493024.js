// ==UserScript==
// @name:en           Display YouTube video upload dates as absolute dates (yyyy-mm-dd or other custom formats)
// @name              以绝对时间显示 YouTube 的视频上传日期 (yyyy-mm-dd 或其他自定义格式)
// @name:zh-TW        以絕對日期顯示 YouTube 的影片上傳日期 (yyyy-mm-dd 或其他自訂格式)
// @name:ja-JP        絶対日付を YouTube の動画アップロード日付として表示します (yyyy-mm-dd または他のカスタム形式)
// @description:en    Show full upload dates, instead of "1 year ago", "2 weeks ago", etc. You can customize the date and time format.
// @description       显示具体日期而不是“2 星期前”，“1 年前”这种相对日期。可自定义日期和时间格式。
// @description:zh-TW 顯示絕對日期，而不是「2 週前」、「1 年前」等相對日期。可自訂日期和時間格式。
// @description:ja-JP YouTubeの動画アップロード日付を「1 年前」などの相対的な表現ではなく、具体的な日付を表示します。表示形式をカスタマイズできます。
// @version           0.7.2
// @author            InMirrors
// @namespace         https://greasyfork.org/users/518374
// @match             https://www.youtube.com/*
// @icon              https://www.youtube.com/s/desktop/814d40a6/img/favicon_144x144.png
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_addStyle
// @grant             GM_registerMenuCommand
// @license           MIT
// @downloadURL https://update.greasyfork.org/scripts/493024/%E4%BB%A5%E7%BB%9D%E5%AF%B9%E6%97%B6%E9%97%B4%E6%98%BE%E7%A4%BA%20YouTube%20%E7%9A%84%E8%A7%86%E9%A2%91%E4%B8%8A%E4%BC%A0%E6%97%A5%E6%9C%9F%20%28yyyy-mm-dd%20%E6%88%96%E5%85%B6%E4%BB%96%E8%87%AA%E5%AE%9A%E4%B9%89%E6%A0%BC%E5%BC%8F%29.user.js
// @updateURL https://update.greasyfork.org/scripts/493024/%E4%BB%A5%E7%BB%9D%E5%AF%B9%E6%97%B6%E9%97%B4%E6%98%BE%E7%A4%BA%20YouTube%20%E7%9A%84%E8%A7%86%E9%A2%91%E4%B8%8A%E4%BC%A0%E6%97%A5%E6%9C%9F%20%28yyyy-mm-dd%20%E6%88%96%E5%85%B6%E4%BB%96%E8%87%AA%E5%AE%9A%E4%B9%89%E6%A0%BC%E5%BC%8F%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const PROCESSED_MARKER = '\u200B'; // Zero-Width Space
    const DEFAULT_DATE_FORMAT = 'yyyy-MM-dd';

    // Keywords for identifying relative date strings.
    const DATE_TIME_KEYWORDS_EN = 'second minute hour day week month year';
    const DATE_TIME_KEYWORDS_ZH = '秒 分 时 時 天 日 周 週 月 年'
    const DEFAULT_DATE_TIME_KEYWORDS = [DATE_TIME_KEYWORDS_EN, DATE_TIME_KEYWORDS_ZH].join(' ').split(' ');
    const DEFAULT_AGO_KEYWORDS = ['ago', '前'];
    const DEFAULT_OLD_UPLOAD_KEYWORDS = ['day', 'week', 'month', 'year', '天', '日', '周', '週', '月', '年'];
    const DEFAULT_MONTH_NAMES = 'JAN FEB MAR APR MAY JUN JUL AUG SEP OCT NOV DEC';
    const DEFAULT_DAY_NAMES = 'Sun Mon Tue Wed Thu Fri Sat';

    // Get basic settings from storage
    const SETTINGS = GM_getValue("basic", {});
    const DATE_FORMAT = SETTINGS.dateFormat || DEFAULT_DATE_FORMAT;
    const DATE_TIME_KEYWORDS = SETTINGS.dateTimeKeywords?.length ? SETTINGS.dateTimeKeywords : DEFAULT_DATE_TIME_KEYWORDS;
    const AGO_KEYWORDS = SETTINGS.agoKeywords?.length ? SETTINGS.agoKeywords : DEFAULT_AGO_KEYWORDS;
    const OLD_UPLOAD_KEYWORDS = SETTINGS.oldUploadKeywords?.length ? SETTINGS.oldUploadKeywords : DEFAULT_OLD_UPLOAD_KEYWORDS;
    const MONTH_NAMES = SETTINGS.monthNames?.length ? SETTINGS.monthNames : DEFAULT_MONTH_NAMES.split(' ');
    const DAY_NAMES = SETTINGS.dayNames?.length ? SETTINGS.dayNames : DEFAULT_DAY_NAMES.split(' ');
    const PREPEND_DATES_ENABLED = SETTINGS.prependDatesEnabled ?? false;

    // Get advanced settings from storage
    let timerModeEnabled = GM_getValue("timerModeEnabled", false);
    let fomattingTimer = null; // for timer mode
    let useAllConfigsEnabled = GM_getValue("useAllConfigsEnabled", false);
    // Test all configs to find valid ones for the current page
    let findValidConfigEnable = GM_getValue("findValidConfigEnable", false);

    // === Debug Mode ===

    let debugModeEnabled = GM_getValue("debugModeEnabled", false);
    let debugVidsArrayLength = GM_getValue("debugVidsArrayLength", 4);

    if (debugModeEnabled) {
        GM_registerMenuCommand(`Toggle Debug mode ${debugModeEnabled ? "OFF" : "ON"}`, () => {
            debugModeEnabled = !debugModeEnabled;
            GM_setValue("debugModeEnabled", debugModeEnabled);
            alert(`Debug mode is now ${debugModeEnabled ? "ON" : "OFF"}`);
        });
        GM_registerMenuCommand("Set vids array length", () => {
            let input = prompt("Please enter a number, 0 to disable slicing:", debugVidsArrayLength);
            if (input == null) { // input canceled
                return;
            }
            if (input.trim() !== "" && !isNaN(input)) { // valid input
                debugVidsArrayLength = Number(input);
                GM_setValue("debugVidsArrayLength", debugVidsArrayLength);
                alert("Value updated to: " + debugVidsArrayLength);
            } else {
                alert("Invalid input. Please enter a number.");
            }
        });
        GM_registerMenuCommand(`Toggle all configs mode ${useAllConfigsEnabled ? "OFF" : "ON"}`, () => {
            useAllConfigsEnabled = !useAllConfigsEnabled;
            GM_setValue("useAllConfigsEnabled", useAllConfigsEnabled);
            alert(`All configs mode is now ${useAllConfigsEnabled ? "ON" : "OFF"}`);
        });
        GM_registerMenuCommand(`Toggle all configs mode ${useAllConfigsEnabled ? "OFF" : "ON"}`, () => {
            useAllConfigsEnabled = !useAllConfigsEnabled;
            GM_setValue("useAllConfigsEnabled", useAllConfigsEnabled);
            alert(`All configs mode is now ${useAllConfigsEnabled ? "ON" : "OFF"}`);
        });
        GM_registerMenuCommand(`Toggle find valid config mode ${findValidConfigEnable ? "OFF" : "ON"}`, () => {
            findValidConfigEnable = !findValidConfigEnable;
            if (findValidConfigEnable) {
                useAllConfigsEnabled = true;
                GM_setValue("useAllConfigsEnabled", useAllConfigsEnabled);
            }
            GM_setValue("findValidConfigEnable", findValidConfigEnable);
            alert(`Find valid config mode is now ${findValidConfigEnable ? "ON" : "OFF"}`);
        });
    }

    /**
     * Validate configs array
     * @param {Array} configs - array of config objects
     * @returns {boolean} - true if all configs are valid, false otherwise
     */
    function validateConfigs(configs) {
        const errors = [];

        configs.forEach(config => {
            // Get id and set a default value if necessary
            const { id = '[no id]' } = config;

            // Properties that must be non-empty strings
            const stringProps = [
                "id",
                "videoContainerSelector",
                "metaSpansSelector",
                "vidLinkSelector",
            ];

            // string properties must be non-empty strings
            stringProps.forEach(prop => {
                if (typeof config[prop] !== "string" || config[prop].trim() === "") {
                    errors.push(`${id}: "${prop}" must be a non-empty string`);
                }
            });

            // urlPattern must be RegExp
            if (!(config.urlPattern instanceof RegExp)) {
                errors.push(`${id}: "urlPattern" must be a RegExp`);
            }

            // shouldCreateDateSpan must be boolean
            if (typeof config.shouldCreateDateSpan !== "boolean") {
                errors.push(`${id}: "shouldCreateDateSpan" must be a boolean`);
            }

            // Conditional validation
            if (config.shouldCreateDateSpan === true) {
                if (typeof config.insertAfterIndex !== "number") {
                    errors.push(`${id}: "insertAfterIndex" must be a number when shouldCreateDateSpan is true`);
                }
            }
        });

        if (errors.length > 0) {
            console.log('[YTDF] Validation errors:');
            errors.forEach(err => console.log(" - " + err));
            return false;
        } else {
            console.log('[YTDF] All configs are valid!');
            return true;
        }
    }

    // === Setting UI ===

    const translations = {
        en: {
            menuTitle: 'Open Settings Panel',
            panelTitle: 'Settings',
            saveBtn: 'Save',
            resetBtn: 'Reset',
            languageLabel: 'Language',
            prependDatesLabel: 'Prepend dates',
            prependDatesHelp: 'Insert absolute dates before the original relative dates. Default is after.',
            dateFormatLabel: 'Date format',
            dateFormatHelp: 'The format for the displayed date. You can get syntax help from the script\'s readme.',
            oldUploadKeywordsLabel: 'Keywords for old uploads',
            oldUploadKeywordsHelp: 'Keywords to identify old uploads. Only formatted dates will be shown for these.',
            dateTimeKeywordsLabel: 'Date and time keywords *',
            dateTimeKeywordsHelp: 'Keywords used to identify relative date strings.',
            agoKeywordsLabel: 'Ago keyword *',
            agoKeywordsHelp: 'Keyword used to identify the "ago" part of relative dates, such as "ago" in "1 day ago".',
            monthNamesLabel: 'Month names',
            monthNamesHelp: 'The names of the months used in the date format (MMM).',
            dayNamesLabel: 'Day of the week names',
            dayNamesHelp: 'The names of the days of the week used in the date format (ww).',
            stringsFooterBasic: 'Click the ? icon to use the example.',
            stringsFooterI18n: 'You <b>MUST</b> use <b>translations</b> in your YouTube language to fill in these keyword settings (marked with <b>*</b>). if your YouTube language is not English, 中文 or 日本語.',
            helpTooltip: '{desc} Example:\n{example}',
            inputPlaceholder: 'Enter value...',
            alertSaved: 'Settings saved, please refresh the page to apply changes',
            confirmReset: 'Reset to defaults?'
        },
        zh: {
            menuTitle: '打开设置面板',
            panelTitle: '设置',
            saveBtn: '保存',
            resetBtn: '重置',
            languageLabel: '语言',
            prependDatesLabel: '插入日期到前面',
            prependDatesHelp: '插入绝对日期到原始的相对日期前，默认在后面。',
            dateFormatLabel: '日期格式',
            dateFormatHelp: '显示日期的格式。详细语法请查阅脚本的帮助文档。',
            oldUploadKeywordsLabel: '旧视频关键字',
            oldUploadKeywordsHelp: '用于识别旧视频的关键字。匹配的视频只显示格式化后的日期，不显示原始文本。',
            dateTimeKeywordsLabel: '日期和时间关键字 *',
            dateTimeKeywordsHelp: '用于识别相对日期字符串的关键字。',
            agoKeywordsLabel: '“前”的关键字 *',
            agoKeywordsHelp: '相对日期中的关键字，例如 "1天前" 中的 "前"。',
            monthNamesLabel: '月份名称',
            monthNamesHelp: '日期格式中 "MMM" 对应的月份名称。',
            dayNamesLabel: '周几的名称',
            dayNamesHelp: '日期格式中 "ww" 对应的周几的名称。',
            stringsFooterBasic: '点击 ? 图标以使用示例',
            stringsFooterI18n: '中文用户不用管下面的。',
            helpTooltip: '{desc}示例：\n{example}',
            inputPlaceholder: '请输入...',
            alertSaved: '设置已保存，请刷新页面以应用更改',
            confirmReset: '要重置为默认值吗？'
        }
    };

    let currentStrings = (() => {
        let currentLang = SETTINGS.language || 'en';
        return translations[currentLang] || translations.en;
    })();

    const panelCSS = `
:root { --ytdf-panel-bg:#fff; --ytdf-accent:#1e88e5; }
#ytdf-panel {
    width: 520px;
    margin: 40px auto;
    border-radius: 10px;
    max-height: 600px;
    overflow: auto;
    background: var(--ytdf-panel-bg);
    box-shadow: 0 6px 24px rgba(0,0,0,0.12);
    font-family: Arial, sans-serif;
    color: black;
    position: fixed;
    top: 50px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    display: none; /* Initially hidden */
}
.ytdf-header { display:flex; align-items:center; justify-content:space-between; padding:16px 20px; border-bottom:1px solid #eef2f7; }
.ytdf-header h1 { font-size:18px; font-weight:bolder; margin:0; }
.ytdf-header .ytdf-buttons { display:flex; gap:8px; }
.ytdf-button { background:var(--ytdf-accent); color:#fff; border:none; padding:8px 12px; border-radius:7px; cursor:pointer; }
.ytdf-button.ytdf-secondary { background:#edf2f7; color:#111; border:1px solid #d1dae8; }
.ytdf-container { padding:18px; display:grid; gap:14px; }
.ytdf-section { padding:12px; border-radius:8px; box-shadow: 0px 0px 6px lightgray; }
.ytdf-section-title { font-size:18px; font-weight:bolder; margin-block:10px; }
.ytdf-section.ytdf-selects       { background:hsl(110,60%,99%); border-left:4px solid hsl(110,50%,70%); }
.ytdf-section.ytdf-switches      { background:hsl(190,60%,99%); border-left:4px solid hsl(190,50%,70%); }
.ytdf-section.ytdf-strings-basic { background:hsl(250,60%,99%); border-left:4px solid hsl(250,70%,70%); }
.ytdf-section.ytdf-strings-i18n  { background:hsl(340,60%,99%); border-left:4px solid hsl(340,70%,70%); }
.ytdf-switch-row { display:flex; align-items:center; gap:10px; padding:6px 0; }
.ytdf-switch-row label { flex:1; display:flex; align-items:center; gap:8px; font-size:14px; }
.ytdf-toggle { width:40px; height:22px; background:#cbd5e1; border-radius:20px; position:relative; cursor:pointer; flex:0 0 auto; }
.ytdf-toggle .ytdf-knob { position:absolute; top:2px; left:2px; width:18px; height:18px; background:white; border-radius:50%; transition:all 0.18s; }
.ytdf-toggle.ytdf-on { background:#4fbe79; }
.ytdf-toggle.ytdf-on .ytdf-knob { left:20px; }
.ytdf-string-label-help, .ytdf-select-row { display:flex; align-items:center; gap:10px; padding:8px 0; border-top:1px dashed rgba(0,0,0,0.04); }
.ytdf-string-row:first-child, .ytdf-select-row:first-child { border-top:none; }
.ytdf-select-label { width:140px; font-size:14px; }
.ytdf-string-label { font-size:14px; }
.ytdf-string-input, .ytdf-select-input { flex:1; }
.ytdf-string-input input[type="text"], .ytdf-select-input select { width:100%; padding:8px; border-radius:6px; border:1px solid #cbd5e1; }
.ytdf-help { margin-left:auto; cursor:pointer; user-select:none; font-size:12px; color:#0366d6; }
.ytdf-footer-note { font-size:12px; color:#718096; margin-top:6px; }
@media (max-width:600px) { #ytdf-panel { width:92%; top: 20px; left: 4%; transform: none; } }
    `;

    // Inject HTML and CSS into the page
    GM_addStyle(panelCSS);

    // Function to create the panel element using DOM manipulation
    // Use this approach to bypass YouTube's TrustedHTML restriction
    function createPanelElement() {
        const panel = document.createElement('div');
        panel.id = 'ytdf-panel';

        // Header
        const header = document.createElement('div');
        header.className = 'ytdf-header';
        const h1 = document.createElement('h1');
        h1.dataset.langKey = 'panelTitle';
        h1.textContent = 'Settings';
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'ytdf-buttons'; const resetButton = document.createElement('button');
        resetButton.className = 'ytdf-button ytdf-secondary';
        resetButton.id = 'ytdf-reset-btn';
        resetButton.dataset.langKey = 'resetBtn';
        resetButton.textContent = 'Reset'; const saveButton = document.createElement('button');
        saveButton.className = 'ytdf-button';
        saveButton.id = 'ytdf-save-btn';
        saveButton.dataset.langKey = 'saveBtn';
        saveButton.textContent = 'Save'; buttonsDiv.appendChild(resetButton);
        buttonsDiv.appendChild(saveButton);
        header.appendChild(h1);
        header.appendChild(buttonsDiv);
        panel.appendChild(header);

        // Container
        const container = document.createElement('div');
        container.className = 'ytdf-container';

        // Section: Selects (Language)
        const selectsSection = document.createElement('div');
        selectsSection.className = 'ytdf-section ytdf-selects';
        const selectRow = document.createElement('div');
        selectRow.className = 'ytdf-select-row';
        const selectLabel = document.createElement('div');
        selectLabel.className = 'ytdf-select-label';
        selectLabel.dataset.langKey = 'languageLabel';
        selectLabel.textContent = 'Language';
        const selectInput = document.createElement('div');
        selectInput.className = 'ytdf-select-input';
        const langSelect = document.createElement('select');
        langSelect.id = 'ytdf-lang-select';
        const optionEn = document.createElement('option');
        optionEn.value = 'en';
        optionEn.textContent = 'English';
        const optionZh = document.createElement('option');
        optionZh.value = 'zh';
        optionZh.textContent = '中文';
        langSelect.appendChild(optionEn);
        langSelect.appendChild(optionZh);
        selectInput.appendChild(langSelect);
        selectRow.appendChild(selectLabel);
        selectRow.appendChild(selectInput);
        selectsSection.appendChild(selectRow);

        // Section: Switches (Prepend dates)
        const switchesSection = document.createElement('div');
        switchesSection.className = 'ytdf-section ytdf-switches';
        const switchRow = document.createElement('div');
        switchRow.className = 'ytdf-switch-row';
        const label = document.createElement('label');
        const toggleDiv = document.createElement('div');
        toggleDiv.className = 'ytdf-toggle';
        toggleDiv.dataset.key = 'prependDatesEnabled';
        toggleDiv.setAttribute('role', 'switch');
        toggleDiv.setAttribute('tabindex', '0');
        const knobDiv = document.createElement('div');
        knobDiv.className = 'ytdf-knob';
        toggleDiv.appendChild(knobDiv);
        const spanPrependDates = document.createElement('span');
        spanPrependDates.dataset.langKey = 'prependDatesLabel';
        spanPrependDates.textContent = 'Prepend dates';
        const helpDiv = document.createElement('div');
        helpDiv.className = 'ytdf-help';
        helpDiv.dataset.langKey = 'prependDatesHelp';
        helpDiv.dataset.desc = 'Add absolute dates before or after the original dates.';
        helpDiv.textContent = '❓';
        label.appendChild(toggleDiv);
        label.appendChild(spanPrependDates);
        label.appendChild(helpDiv);
        switchRow.appendChild(label);
        switchesSection.appendChild(switchRow);

        // Section: Strings Basic (Date format, Old upload keywords)
        const stringsBasicSection = document.createElement('div');
        stringsBasicSection.className = 'ytdf-section ytdf-strings-basic';
        const footerNoteBasic = document.createElement('div');
        footerNoteBasic.className = 'ytdf-footer-note';
        footerNoteBasic.dataset.langKey = 'stringsFooterBasic';
        footerNoteBasic.textContent = 'Click the ? icon to use the example.';
        stringsBasicSection.appendChild(footerNoteBasic);

        // Date format row
        const dateFormatRow = document.createElement('div');
        dateFormatRow.className = 'ytdf-string-row';
        dateFormatRow.dataset.key = 'dateFormat';
        const dateFormatLabelHelp = document.createElement('div');
        dateFormatLabelHelp.className = 'ytdf-string-label-help';
        const dateFormatLabel = document.createElement('div');
        dateFormatLabel.className = 'ytdf-string-label';
        dateFormatLabel.dataset.langKey = 'dateFormatLabel';
        dateFormatLabel.textContent = 'Date format';
        const dateFormatHelp = document.createElement('div');
        dateFormatHelp.className = 'ytdf-help';
        dateFormatHelp.dataset.langKey = 'dateFormatHelp';
        dateFormatHelp.dataset.example = 'yyyy-MM-dd';
        dateFormatHelp.dataset.desc = 'Date format help';
        dateFormatHelp.textContent = '❓';
        dateFormatLabelHelp.appendChild(dateFormatLabel);
        dateFormatLabelHelp.appendChild(dateFormatHelp);
        const dateFormatInputDiv = document.createElement('div');
        dateFormatInputDiv.className = 'ytdf-string-input';
        const dateFormatInput = document.createElement('input');
        dateFormatInput.type = 'text';
        dateFormatInput.id = 'ytdf-dateFormat';
        dateFormatInput.setAttribute('placeholder', '');
        dateFormatInputDiv.appendChild(dateFormatInput);
        dateFormatRow.appendChild(dateFormatLabelHelp);
        dateFormatRow.appendChild(dateFormatInputDiv);
        stringsBasicSection.appendChild(dateFormatRow);

        // Old upload keywords row
        const oldUploadKeywordsRow = document.createElement('div');
        oldUploadKeywordsRow.className = 'ytdf-string-row';
        oldUploadKeywordsRow.dataset.key = 'oldUploadKeywords';
        const oldUploadKeywordsLabelHelp = document.createElement('div');
        oldUploadKeywordsLabelHelp.className = 'ytdf-string-label-help';
        const oldUploadKeywordsLabel = document.createElement('div');
        oldUploadKeywordsLabel.className = 'ytdf-string-label';
        oldUploadKeywordsLabel.dataset.langKey = 'oldUploadKeywordsLabel';
        oldUploadKeywordsLabel.textContent = 'Old upload keywords';
        const oldUploadKeywordsHelp = document.createElement('div');
        oldUploadKeywordsHelp.className = 'ytdf-help';
        oldUploadKeywordsHelp.dataset.langKey = 'oldUploadKeywordsHelp';
        oldUploadKeywordsHelp.dataset.example = 'day week month year';
        oldUploadKeywordsHelp.dataset.desc = 'Old upload keywords help';
        oldUploadKeywordsHelp.textContent = '❓';
        oldUploadKeywordsLabelHelp.appendChild(oldUploadKeywordsLabel);
        oldUploadKeywordsLabelHelp.appendChild(oldUploadKeywordsHelp);
        const oldUploadKeywordsInputDiv = document.createElement('div');
        oldUploadKeywordsInputDiv.className = 'ytdf-string-input';
        const oldUploadKeywordsInput = document.createElement('input');
        oldUploadKeywordsInput.type = 'text';
        oldUploadKeywordsInput.id = 'ytdf-oldUploadKeywords';
        oldUploadKeywordsInput.setAttribute('placeholder', '');
        oldUploadKeywordsInputDiv.appendChild(oldUploadKeywordsInput);
        oldUploadKeywordsRow.appendChild(oldUploadKeywordsLabelHelp);
        oldUploadKeywordsRow.appendChild(oldUploadKeywordsInputDiv);
        stringsBasicSection.appendChild(oldUploadKeywordsRow);

        // Section: Strings I18n (Date and time keywords, Ago keywords, Month names)
        const stringsI18nSection = document.createElement('div');
        stringsI18nSection.className = 'ytdf-section ytdf-strings-i18n';
        const footerNoteI18n = document.createElement('div');
        footerNoteI18n.className = 'ytdf-footer-note';
        footerNoteI18n.dataset.langKey = 'stringsFooterI18n';
        footerNoteI18n.textContent = 'You must complete these two keywords settings if your YouTube language is not English, 中文 or 日本語.';
        stringsI18nSection.appendChild(footerNoteI18n);

        // Date and time keywords row
        const dateTimeKeywordsRow = document.createElement('div');
        dateTimeKeywordsRow.className = 'ytdf-string-row';
        dateTimeKeywordsRow.dataset.key = 'dateTimeKeywords';
        const dateTimeKeywordsLabelHelp = document.createElement('div');
        dateTimeKeywordsLabelHelp.className = 'ytdf-string-label-help';
        const dateTimeKeywordsLabel = document.createElement('div');
        dateTimeKeywordsLabel.className = 'ytdf-string-label';
        dateTimeKeywordsLabel.dataset.langKey = 'dateTimeKeywordsLabel';
        dateTimeKeywordsLabel.textContent = 'Date and time keywords';
        const dateTimeKeywordsHelp = document.createElement('div');
        dateTimeKeywordsHelp.className = 'ytdf-help';
        dateTimeKeywordsHelp.dataset.langKey = 'dateTimeKeywordsHelp';
        dateTimeKeywordsHelp.dataset.example = 'second minute hour day week month year';
        dateTimeKeywordsHelp.dataset.desc = 'Date time keywords help';
        dateTimeKeywordsHelp.textContent = '❓';
        dateTimeKeywordsLabelHelp.appendChild(dateTimeKeywordsLabel);
        dateTimeKeywordsLabelHelp.appendChild(dateTimeKeywordsHelp);
        const dateTimeKeywordsInputDiv = document.createElement('div');
        dateTimeKeywordsInputDiv.className = 'ytdf-string-input';
        const dateTimeKeywordsInput = document.createElement('input');
        dateTimeKeywordsInput.type = 'text';
        dateTimeKeywordsInput.id = 'ytdf-dateTimeKeywords';
        dateTimeKeywordsInput.setAttribute('placeholder', '');
        dateTimeKeywordsInputDiv.appendChild(dateTimeKeywordsInput);
        dateTimeKeywordsRow.appendChild(dateTimeKeywordsLabelHelp);
        dateTimeKeywordsRow.appendChild(dateTimeKeywordsInputDiv);
        stringsI18nSection.appendChild(dateTimeKeywordsRow);

        // Ago keywords row
        const agoKeywordsRow = document.createElement('div');
        agoKeywordsRow.className = 'ytdf-string-row';
        agoKeywordsRow.dataset.key = 'agoKeywords';
        const agoKeywordsLabelHelp = document.createElement('div');
        agoKeywordsLabelHelp.className = 'ytdf-string-label-help';
        const agoKeywordsLabel = document.createElement('div');
        agoKeywordsLabel.className = 'ytdf-string-label';
        agoKeywordsLabel.dataset.langKey = 'agoKeywordsLabel';
        agoKeywordsLabel.textContent = 'Ago keyword';
        const agoKeywordsHelp = document.createElement('div');
        agoKeywordsHelp.className = 'ytdf-help';
        agoKeywordsHelp.dataset.langKey = 'agoKeywordsHelp';
        agoKeywordsHelp.dataset.example = 'ago';
        agoKeywordsHelp.dataset.desc = 'Ago keyword help';
        agoKeywordsHelp.textContent = '❓';
        agoKeywordsLabelHelp.appendChild(agoKeywordsLabel);
        agoKeywordsLabelHelp.appendChild(agoKeywordsHelp);
        const agoKeywordsInputDiv = document.createElement('div');
        agoKeywordsInputDiv.className = 'ytdf-string-input';
        const agoKeywordsInput = document.createElement('input');
        agoKeywordsInput.type = 'text';
        agoKeywordsInput.id = 'ytdf-agoKeywords';
        agoKeywordsInput.setAttribute('placeholder', '');
        agoKeywordsInputDiv.appendChild(agoKeywordsInput);
        agoKeywordsRow.appendChild(agoKeywordsLabelHelp);
        agoKeywordsRow.appendChild(agoKeywordsInputDiv);
        stringsI18nSection.appendChild(agoKeywordsRow);

        // Month names row
        const monthNamesRow = document.createElement('div');
        monthNamesRow.className = 'ytdf-string-row';
        monthNamesRow.dataset.key = 'monthNames';
        const monthNamesLabelHelp = document.createElement('div');
        monthNamesLabelHelp.className = 'ytdf-string-label-help';
        const monthNamesLabel = document.createElement('div');
        monthNamesLabel.className = 'ytdf-string-label';
        monthNamesLabel.dataset.langKey = 'monthNamesLabel';
        monthNamesLabel.textContent = 'Month names';
        const monthNamesHelp = document.createElement('div');
        monthNamesHelp.className = 'ytdf-help';
        monthNamesHelp.dataset.langKey = 'monthNamesHelp';
        monthNamesHelp.dataset.example = 'JAN FEB MAR APR MAY JUN JUL AUG SEP OCT NOV DEC';
        monthNamesHelp.dataset.desc = 'Month names help';
        monthNamesHelp.textContent = '❓';
        monthNamesLabelHelp.appendChild(monthNamesLabel);
        monthNamesLabelHelp.appendChild(monthNamesHelp);
        const monthNamesInputDiv = document.createElement('div');
        monthNamesInputDiv.className = 'ytdf-string-input';
        const monthNamesInput = document.createElement('input');
        monthNamesInput.type = 'text';
        monthNamesInput.id = 'ytdf-monthNames';
        monthNamesInput.setAttribute('placeholder', '');
        monthNamesInputDiv.appendChild(monthNamesInput);
        monthNamesRow.appendChild(monthNamesLabelHelp);
        monthNamesRow.appendChild(monthNamesInputDiv);
        stringsI18nSection.appendChild(monthNamesRow);

        // Day names row
        const dayNamesRow = document.createElement('div');
        dayNamesRow.className = 'ytdf-string-row';
        dayNamesRow.dataset.key = 'dayNames';
        const dayNamesLabelHelp = document.createElement('div');
        dayNamesLabelHelp.className = 'ytdf-string-label-help';
        const dayNamesLabel = document.createElement('div');
        dayNamesLabel.className = 'ytdf-string-label';
        dayNamesLabel.dataset.langKey = 'dayNamesLabel';
        dayNamesLabel.textContent = 'Day names';
        const dayNamesHelp = document.createElement('div');
        dayNamesHelp.className = 'ytdf-help';
        dayNamesHelp.dataset.langKey = 'dayNamesHelp';
        dayNamesHelp.dataset.example = 'Sun Mon Tue Wed Thu Fri Sat';
        dayNamesHelp.dataset.desc = 'Day names help';
        dayNamesHelp.textContent = '❓';
        dayNamesLabelHelp.appendChild(dayNamesLabel);
        dayNamesLabelHelp.appendChild(dayNamesHelp);
        const dayNamesInputDiv = document.createElement('div');
        dayNamesInputDiv.className = 'ytdf-string-input';
        const dayNamesInput = document.createElement('input');
        dayNamesInput.type = 'text';
        dayNamesInput.id = 'ytdf-dayNames';
        dayNamesInput.setAttribute('placeholder', '');
        dayNamesInputDiv.appendChild(dayNamesInput);
        dayNamesRow.appendChild(dayNamesLabelHelp);
        dayNamesRow.appendChild(dayNamesInputDiv);
        stringsI18nSection.appendChild(dayNamesRow);

        container.appendChild(selectsSection);
        container.appendChild(switchesSection);
        container.appendChild(stringsBasicSection);
        container.appendChild(stringsI18nSection);

        panel.appendChild(container);
        return panel;
    }

    const panelElementToInsert = createPanelElement();

    if (panelElementToInsert) {
        document.body.appendChild(panelElementToInsert);
    } else {
        console.error('[YTDF] Failed to create panel element.');
    }

    // === Setting UI Logic ===

    // Corresponding runtime values are constants at the top of the file
    // Only local settings stored in the GM storage are modified by the UI

    const panelElement = document.getElementById('ytdf-panel');

    function saveSettings(obj) {
        GM_setValue("basic", obj);
    }

    // Update all text in the UI based on the selected language
    function updateUIText(lang) {
        currentStrings = translations[lang] || translations.en;
        document.querySelectorAll('[data-lang-key]').forEach(el => {
            const key = el.dataset.langKey;
            if (currentStrings[key]) {
                // Help elements
                if (el.dataset.desc) {
                    el.dataset.desc = currentStrings[key];
                }
                else {
                    el.innerHTML = currentStrings[key];
                }
            }
        });

        // Update placeholders and titles which are not covered by the generic loop
        document.querySelectorAll('.ytdf-string-input input').forEach(input => {
            input.setAttribute('placeholder', currentStrings.inputPlaceholder);
        });
        attachHelpHandlers(); // Re-attach to update tooltips
    }

    function setToggle(el, value) {
        if (value) {
            el.classList.add('ytdf-on');
        } else {
            el.classList.remove('ytdf-on');
        }
        el.setAttribute('aria-checked', !!value);
    }

    function applySettingsToUI(settings) {
        const langSelect = document.getElementById('ytdf-lang-select');
        langSelect.value = settings.language || 'en';
        updateUIText(langSelect.value);

        const arrayToStr = (array) => Array.isArray(array) ? array.join(' ') : '';

        setToggle(document.querySelector('.ytdf-toggle[data-key="prependDatesEnabled"]'), settings.prependDatesEnabled);
        document.getElementById('ytdf-dateFormat').value = settings.dateFormat || '';
        document.getElementById('ytdf-oldUploadKeywords').value = arrayToStr(settings.oldUploadKeywords);
        document.getElementById('ytdf-dateTimeKeywords').value = arrayToStr(settings.dateTimeKeywords);
        document.getElementById('ytdf-agoKeywords').value = arrayToStr(settings.agoKeywords);
        document.getElementById('ytdf-monthNames').value = arrayToStr(settings.monthNames);
        document.getElementById('ytdf-dayNames').value = arrayToStr(settings.dayNames);
    }

    function readUIToSettings() {
        const stringToArray = (str) => str.split(' ').filter(Boolean);
        return {
            language: document.getElementById('ytdf-lang-select').value,
            prependDatesEnabled: document.querySelector('.ytdf-toggle[data-key="prependDatesEnabled"]').classList.contains('ytdf-on'),
            dateFormat: document.getElementById('ytdf-dateFormat').value,
            oldUploadKeywords: stringToArray(document.getElementById('ytdf-oldUploadKeywords').value),
            dateTimeKeywords: stringToArray(document.getElementById('ytdf-dateTimeKeywords').value),
            agoKeywords: stringToArray(document.getElementById('ytdf-agoKeywords').value),
            monthNames: stringToArray(document.getElementById('ytdf-monthNames').value),
            dayNames: stringToArray(document.getElementById('ytdf-dayNames').value),
        };
    }

    function attachToggleHandlers() {
        document.querySelectorAll('.ytdf-toggle').forEach(t => {
            t.addEventListener('click', () => {
                const newState = !t.classList.contains('ytdf-on');
                setToggle(t, newState);
            });
            t.addEventListener('keydown', (ev) => {
                if (ev.key === ' ' || ev.key === 'Enter') {
                    ev.preventDefault();
                    t.click();
                }
            });
        });
    }

    function attachHelpHandlers() {
        document.querySelectorAll('.ytdf-string-row, .ytdf-switch-row').forEach(row => {
            const help = row.querySelector('.ytdf-help');
            if (!help) return;
            const example = help.dataset.example || '';
            const desc = help.dataset.desc || '';
            const key = row.dataset.key;

            // Switch rows
            if (!key) {
                help.setAttribute('title', desc);
                return;
            }

            const titleText = currentStrings.helpTooltip
                .replace('{desc}', desc)
                .replace('{example}', example);
            help.setAttribute('title', titleText);

            if (example) {
                help.addEventListener('click', () => {
                    const input = document.getElementById('ytdf-' + key);
                    if (input) {
                        input.value = example;
                        input.focus();
                    }
                });
            }
        });
    }

    // --- Panel Visibility Controls ---
    function showPanel() {
        if (panelElement) panelElement.style.display = 'block';
    }

    function hidePanel() {
        if (panelElement) panelElement.style.display = 'none';
    }

    GM_registerMenuCommand(currentStrings.menuTitle, showPanel);

    document.addEventListener('keydown', (ev) => {
        if (ev.key === 'Escape') {
            hidePanel();
        }
    });

    document.addEventListener('click', (e) => {
        // Hide only if the panel is visible and the click is outside the panel
        if (panelElement.style.display === 'block' && !panelElement.contains(e.target)) {
            // And also ensure the click is not on a Tampermonkey menu item
            if (!e.target.closest('.GM-style-mt')) {
                hidePanel();
            }
        }
    }, true); // Use capture to catch the click early

    // --- Handlers ---
    // save button
    document.getElementById('ytdf-save-btn').addEventListener('click', () => {
        saveSettings(readUIToSettings());
        alert(currentStrings.alertSaved);
    });
    // reset button
    document.getElementById('ytdf-reset-btn').addEventListener('click', () => {
        if (!confirm(currentStrings.confirmReset)) return;
        // Saving default values, but keeping the language setting
        const currentLang = document.getElementById('ytdf-lang-select').value;
        const settingsToSave = { language: currentLang };
        saveSettings(settingsToSave);
        alert(currentStrings.alertSaved);
        applySettingsToUI(settingsToSave);
    });
    // language dropdown
    document.getElementById('ytdf-lang-select').addEventListener('change', (e) => {
        updateUIText(e.target.value);
    });

    // --- Initialize the UI ---
    try {
        applySettingsToUI(SETTINGS);
        attachToggleHandlers();
    }
    catch (e) {
        console.error('[YTDF] Error initializing UI:', e);
    }

    // === Date Formatting ===

    /**
     * Find elements in a NodeList containing any of the specified keywords.
     *
     * @param {NodeList | Array} nodeList - A NodeList or array of elements to search.
     * @param {string[]} keywords - Array of keywords to search for in element textContent.
     * @param {boolean} [findAll=false] - If true, return all matches; if false, return the first match.
     * @returns {Element | Element[] | undefined} - A single element, an array of elements, or undefined if no match.
     */
    function findElementsByKeywords(nodeList, keywords, findAll = false) {
        // Convert NodeList to a real Array (if it isn't already)
        const elements = Array.from(nodeList);

        if (findAll) {
            // Return all matching elements as an array
            return elements.filter(el =>
                keywords.some(keyword => el.textContent.includes(keyword))
            );
        } else {
            // Return only the first matching element
            return elements.find(el =>
                keywords.some(keyword => el.textContent.includes(keyword))
            );
        }
    }

    /**
     * Format a date (string, number, or Date) into a string with a custom template.
     *
     * @param {string|number|Date} date - Date string, timestamp, or Date object
     * @param {string} [template="yyyy-MM-dd HH:mm:ss"] - Template string (e.g., "yyyy-MM-dd HH:mm:ss")
     * @param {boolean} [useLocal=true] - Whether to use local time (true) or UTC (false)
     * @param {string[]} [months] - Uppercase month names (default: English JAN-DEC)
     * @param {string[]} [days] - Day names (default: English Sun-Sat)
     * @returns {string} Formatted date string, or "" if invalid
     *
     * Supported tokens:
     * - yyyy: 4-digit year
     * - yy: 2-digit year
     * - MMM: uppercase month name from given array
     * - MM: 2-digit month
     * - dd: 2-digit day
     * - ww: day of week
     * - HH: 24-hour format (00-23)
     * - hh: 12-hour format (01-12)
     * - ap: AM/PM
     * - mm: 2-digit minutes
     * - ss: 2-digit seconds
     */
    function getDateStr(date, template = "yyyy-MM-dd HH:mm:ss", useLocal = true, months, days) {
        const defaultMonths = [
            "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
            "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
        ];
        const defaultDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const monthNames = months || defaultMonths;
        const dayNames = days || defaultDays;

        const dt = new Date(date);

        // If invalid date, return empty string
        if (isNaN(dt.getTime())) {
            return "";
        }

        // Get local or UTC info automatically
        const getMethod = (key) => useLocal ? dt[`get${key}`]() : dt[`getUTC${key}`]();

        const pad = (num, size = 2) => String(num).padStart(size, "0");

        const map = {
            yyyy: String(getMethod("FullYear")),
            yy: String(getMethod("FullYear")).slice(-2),
            MMM: monthNames[getMethod("Month")],
            MM: pad(getMethod("Month") + 1),
            dd: pad(getMethod("Date")),
            ww: dayNames[getMethod("Day")],
            HH: pad(getMethod("Hours")),
            hh: pad((getMethod("Hours") % 12) || 12),
            ap: getMethod("Hours") < 12 ? "AM" : "PM",
            mm: pad(getMethod("Minutes")),
            ss: pad(getMethod("Seconds")),
        };
        return template.replaceAll(/(yy(yy)?|MMM?|dd|ww|HH|hh|mm|ss|ap)/g, n => map[n]);
    }

    function getUploadDate() {
        let el = document.body.querySelector('player-microformat-renderer script');
        if (el) {
            let parts = el.textContent.split('"startDate":"', 2);
            if (parts.length == 2) {
                return parts[1].split('"', 1)[0];
            }
            parts = el.textContent.split('"uploadDate":"', 2);
            if (parts.length == 2) {
                return parts[1].split('"', 1)[0];
            }
        }

        return null;
    }

    // Check if the video is a live broadcast
    function getIsLiveBroadcast() {
        let el = document.body.querySelector('player-microformat-renderer script');
        if (!el) {
            return null;
        }

        let parts = el.textContent.split('"isLiveBroadcast":', 2);
        if (parts.length != 2) {
            return false;
        }

        let isLiveBroadcast = !!parts[1].split(',', 1)[0];
        if (!isLiveBroadcast) {
            return false;
        }

        parts = el.textContent.split('"endDate":"', 2);
        if (parts.length == 2) {
            return false;
        }

        return true;
    }

    // Update the upload date in the video description
    function processDescription() {
        let uploadDate = getUploadDate();
        if (uploadDate) {
            // Format the date and check if it's a live broadcast
            uploadDate = getDateStr(uploadDate, DATE_FORMAT, true, MONTH_NAMES, DAY_NAMES);
            let isLiveBroadcast = getIsLiveBroadcast();

            if (isLiveBroadcast) {
                document.body.classList.add('ytud-description-live');
            } else {
                document.body.classList.remove('ytud-description-live');
            }

            // Update the upload date in the video description
            let el = document.querySelector('#info-container > #info > b');
            if (!el) {
                let span = document.querySelector('#info-container > #info > span:nth-child(1)');
                if (span) {
                    el = document.createElement('b');
                    el.textContent = uploadDate;
                    span.insertAdjacentElement('afterend', el);
                }
            } else {
                if (el.parentNode.children[1] !== el) {
                    let container = el.parentNode;
                    el = container.removeChild(el);
                    container.children[0].insertAdjacentElement('afterend', el);
                }
                if (el.firstChild.nodeValue !== uploadDate) {
                    el.firstChild.nodeValue = uploadDate;
                }
            }
        }
    }

    // This section for the topic sidebar is too different and is kept separate.
    /* search list - topic in sidebar */
    function processTopicSidebar() {
        let vids = document.querySelectorAll('#contents > ytd-universal-watch-card-renderer > #sections > ytd-watch-card-section-sequence-renderer > #lists > ytd-vertical-watch-card-list-renderer > #items > ytd-watch-card-compact-video-renderer');
        if (vids.length > 0) {
            vids.forEach((el) => {
                let holders = el.querySelectorAll('div.text-wrapper > yt-formatted-string.subtitle');
                if (holders.length === 0) {
                    return;
                }

                let holder = holders[0];
                let separator = ' • ';
                let parts = holder.firstChild.nodeValue.split(separator, 2);
                if (parts.length < 2) {
                    return;
                }
                let dateText = parts[1];
                let text = el.getAttribute('date-text');

                if (text !== null && text === dateText) {
                    return;
                }

                el.setAttribute('date-text', dateText);
                let link = el.querySelector('a#thumbnail').getAttribute('href');
                let videoId = urlToVideoId(link);
                fetchAndUpdateUploadDate(videoId, holder, dateText);
            });
        }
    }

    // Extract video id from the URL
    function urlToVideoId(url) {
        let parts = url.split('/shorts/', 2);
        if (parts.length === 2) {
            url = parts[1];
        } else {
            url = parts[0];
        }

        parts = url.split('v=', 2);
        if (parts.length === 2) {
            url = parts[1];
        } else {
            url = parts[0];
        }

        return url.split('&', 1)[0];
    }

    // Retrieve the upload date from a remote source using the video id and invoke the callback with the result
    function getRemoteUploadDate(videoId, callback) {
        let body = { "context": { "client": { "clientName": "WEB", "clientVersion": "2.20240416.01.00" } }, "videoId": videoId };

        fetch('https://www.youtube.com/youtubei/v1/player?prettyPrint=false', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                return response.json();
            })
            .then(data => {
                let object = data.microformat.playerMicroformatRenderer;

                if (object.liveBroadcastDetails?.isLiveNow) {
                    callback(object.liveBroadcastDetails.startTimestamp);
                    return;
                } else if (object.publishDate) {
                    callback(object.publishDate);
                    return;
                }

                callback(object.uploadDate);
            })
            .catch(error => {
                console.error('[YTDF] There was a problem with the fetch operation:', error);
            });
    }

    /**
     * Process and update upload date info for a video element
     * @param {string} videoId - YouTube video ID
     * @param {HTMLElement} dateElem - DOM element that holds the date
     * @param {string} originalDateText - The original relative time text
     */
    function fetchAndUpdateUploadDate(videoId, dateElem, originalDateText) {
        getRemoteUploadDate(videoId, (uploadDate) => {
            const formattedDate = getDateStr(uploadDate, DATE_FORMAT, true, MONTH_NAMES, DAY_NAMES) + PROCESSED_MARKER;
            let displayText;
            // Show only formatted date for old uploads
            if (OLD_UPLOAD_KEYWORDS.some(keyword => originalDateText.includes(keyword))) {
                displayText = formattedDate;
            }
            // Keep original + formatted date for recent uploads
            else {
                if (PREPEND_DATES_ENABLED) {
                    displayText = `${formattedDate} · ${originalDateText}`;
                }
                else {
                    displayText = `${originalDateText} · ${formattedDate}`;
                }
            }
            dateElem.firstChild.nodeValue = displayText;
        });
    }

    /**
     * Finds and processes video elements on the page based on a given configuration.
     * This function queries for video containers, extracts metadata,
     * and updates the date information.
     * @param {object} config - Configuration for a specific type of video list.
     * @param {string} config.id - Identifier for the configuration.
     * @param {RegExp} config.urlPattern - A regular expression to test against the current URL.
     * @param {string} config.videoContainerSelector - CSS selector for the video container elements.
     * @param {string} config.metaSpansSelector - CSS selector for metadata spans within the video container.
     * @param {string} config.vidLinkSelector - CSS selector for the video link element.
     * @param {boolean} config.shouldCreateDateSpan - If a new date span needs to be created.
     * @param {number} config.insertAfterIndex - Index at which to insert the new date span.
     */
    function findAndProcessVids(config) {
        // Skip when current address does not match the pattern
        if (config.urlPattern &&
            !config.urlPattern.test(window.location.href) &&
            !useAllConfigsEnabled) {
            return;
        }

        let vids = document.querySelectorAll(config.videoContainerSelector);
        if (vids.length === 0) {
            // if (debugModeEnabled) console.warn(`[YTDF] No vids found for [${config.id}]`);
            return; // No videos found for this config, just return.
        }

        // Only process some elements to avoid excessive logging in debug mode.
        if (debugModeEnabled && debugVidsArrayLength != 0 && vids.length > 1) {
            vids = Array.from(vids).slice(0, debugVidsArrayLength);
        }

        vids.forEach((vidContainer) => {
            const metaSpans = vidContainer.querySelectorAll(config.metaSpansSelector);
            if (metaSpans.length === 0) {
                if (debugModeEnabled && !findValidConfigEnable)
                    console.warn(`[YTDF] No metaSpan found for [${config.id}]`);
                return;
            }

            let dateSpan;
            // Check if a new date span needs to be created.
            if (config.shouldCreateDateSpan) {
                dateSpan = document.createElement('span');
                dateSpan.className = 'inline-metadata-item style-scope ytd-video-meta-block ytdf-date';
                dateSpan.appendChild(document.createTextNode(''));
                metaSpans[config.insertAfterIndex].insertAdjacentElement('afterend', dateSpan);
            } else {
                // Find the date span by looking for keywords.
                const spansEndWithAgo = Array.from(metaSpans).filter(span =>
                    AGO_KEYWORDS.some(ago => span.textContent.includes(ago))
                )
                dateSpan = findElementsByKeywords(spansEndWithAgo, DATE_TIME_KEYWORDS);
            }

            if (!dateSpan) {
                if (debugModeEnabled && !findValidConfigEnable)
                    console.warn(`[YTDF] dateSpan is null for [${config.id}]`);
                return;
            }

            const dateText = dateSpan.textContent;
            if (!dateText) {
                if (debugModeEnabled && !findValidConfigEnable)
                    console.warn(`[YTDF] dateText is null for [${config.id}]`);
                return;
            }

            // Skip if already processed.
            if (dateText.includes(PROCESSED_MARKER)) {
                return;
            }

            // Mark as processed by adding an invisible marker character.
            // Using textContent or innerText may cause issues.
            // For example, on a channel's video page, switching between sorting methods might not update the dates.
            dateSpan.firstChild.nodeValue = dateText + PROCESSED_MARKER;

            // Find the video link element to extract the video ID.
            const vidLinkElem = vidContainer.querySelector(config.vidLinkSelector);
            if (!vidLinkElem) {
                if (debugModeEnabled && !findValidConfigEnable)
                    console.warn(`[YTDF] No vidLinkElem found for [${config.id}]`);
                return;
            }

            const vidLink = vidLinkElem.getAttribute('href');
            if (!vidLink) {
                if (debugModeEnabled && !findValidConfigEnable)
                    console.warn(`[YTDF] vidLink is null for [${config.id}]`);
                return;
            }
            const videoId = urlToVideoId(vidLink);
            if (!videoId) {
                if (debugModeEnabled && !findValidConfigEnable)
                    console.warn(`[YTDF] videoId is null for [${config.id}]`);
                return;
            }

            if (findValidConfigEnable) {
                console.warn(`[YTDF] [${config.id}] is valid`);
            }

            fetchAndUpdateUploadDate(videoId, dateSpan, dateText);
        });
    }

    // Configuration array for different video list types.
    const configs = [
        {
            id: 'Video Page Sidebar',
            urlPattern: /watch\?v=/,
            videoContainerSelector: 'yt-lockup-view-model.lockup',
            metaSpansSelector: '.yt-core-attributed-string--link-inherit-color',
            vidLinkSelector: '.yt-lockup-view-model__content-image',
            shouldCreateDateSpan: false,
        },
        {
            id: 'Homepage Videos',
            urlPattern: /www\.youtube\.com\/?$/,
            videoContainerSelector: 'ytd-rich-item-renderer.style-scope.ytd-rich-grid-renderer',
            metaSpansSelector: '.yt-core-attributed-string--link-inherit-color',
            vidLinkSelector: '.yt-lockup-view-model__content-image',
            shouldCreateDateSpan: false,
        },
        {
            id: 'Homepage Shorts',
            urlPattern: /XXXwww\.youtube\.com\/?$/, // remove XXX to enable this config
            videoContainerSelector: 'dummy',
            metaSpansSelector: '#metadata-line > span',
            vidLinkSelector: '.yt-lockup-view-model__content-image',
            shouldCreateDateSpan: true,
            insertAfterIndex: 0,
        },
        {
            id: 'Search List Videos',
            urlPattern: /results\?search_query=/,
            videoContainerSelector: 'ytd-video-renderer.ytd-item-section-renderer',
            metaSpansSelector: '.inline-metadata-item',
            vidLinkSelector: '#thumbnail',
            shouldCreateDateSpan: false,
        },
        {
            id: 'Search List Shorts',
            urlPattern: /XXXresults\?search_query=/,
            videoContainerSelector: 'dummy',
            metaSpansSelector: '#metadata-line > span',
            vidLinkSelector: '.yt-lockup-view-model__content-image',
            shouldCreateDateSpan: true,
            insertAfterIndex: 0,
        },
        {
            id: 'Subscriptions',
            urlPattern: /subscriptions/,
            videoContainerSelector: '#dismissible',
            metaSpansSelector: '#metadata-line > span',
            vidLinkSelector: 'h3 > a',
            shouldCreateDateSpan: false,
        },
        {
            id: 'Channel Videos',
            urlPattern: /www.youtube.com\/[^\/]+?\/videos/,
            videoContainerSelector: 'ytd-rich-grid-media.ytd-rich-item-renderer',
            metaSpansSelector: '#metadata-line > span',
            vidLinkSelector: 'h3 > a',
            shouldCreateDateSpan: false,
        },
        {
            id: 'Channel Featured Videos',
            // Some channel addresses don't include an "@" symbol.
            // Lack a suitable RegEx to match these addresses without incorrectly matching others.
            // The current RegEx only matches regular channel addresses.
            urlPattern: /www.youtube.com\/@[^\/]+?\/?(featured)?$/,
            videoContainerSelector: 'ytd-grid-video-renderer.yt-horizontal-list-renderer',
            metaSpansSelector: '#metadata-line > span',
            vidLinkSelector: 'a#thumbnail',
            shouldCreateDateSpan: false,
        },
        {
            id: 'Channel For You Videos',
            urlPattern: /www.youtube.com\/@[^\/]+?\/?(featured)?$/,
            videoContainerSelector: 'ytd-channel-video-player-renderer.ytd-item-section-renderer',
            metaSpansSelector: '#metadata-line > span',
            vidLinkSelector: '#title a',
            shouldCreateDateSpan: false,
        },
        {
            id: 'Video Playlist',
            urlPattern: /playlist\?list=/,
            videoContainerSelector: 'ytd-playlist-video-renderer.ytd-playlist-video-list-renderer',
            metaSpansSelector: 'span.yt-formatted-string',
            vidLinkSelector: 'a#thumbnail',
            shouldCreateDateSpan: false,
        }
    ];

    // === Date Formatting Launching ===

    // Run all formatters
    function runAllFormatters() {
        try {
            if (debugModeEnabled) {
                if (!validateConfigs(configs)) {
                    return;
                }
            }
            processDescription();
            processTopicSidebar();
            // Process all video lists
            configs.forEach(findAndProcessVids);
        }
        catch (error) {
            console.error('[YTDF] Error running formatters:', error);
        }
    }

    // Get all video container selectors from the configs array
    let validConfigs = [];

    function updateSelectors() {
        const currentUrl = window.location.href;
        const newConfigs = configs.filter(config => config.urlPattern.test(currentUrl));
        if (newConfigs !== validConfigs) {
            validConfigs = newConfigs;
            if (debugModeEnabled) {
                console.log('[YTDF] Valid configs:');
                console.log(validConfigs);
            }
        }
    }

    function updateFormattingTimer() {
        if (fomattingTimer !== null) { clearInterval(fomattingTimer); }
        fomattingTimer = setInterval(() => {
            runAllFormatters();
        }, 1000)
    }

    // Dates on the subscriptions page aren't updated promptly using the observer
    // Don't know why. So add a timer to handle it
    let subscriptionsPageTimer = null;
    const subscriptionsPagePattern = /subscriptions/;
    function handleSubscriptionsPageTimer() {
        if (subscriptionsPagePattern.test(window.location.href)) {
            subscriptionsPageTimer = setInterval(() => {
                runAllFormatters();
            }, 1000);
        }
        else if (subscriptionsPageTimer !== null) {
            clearInterval(subscriptionsPageTimer);
            subscriptionsPageTimer = null;
        }
    }

    window.addEventListener('yt-navigate-finish', () => {
        updateSelectors()
        handleSubscriptionsPageTimer();
    });

    // Run once on script load for the initial page content.
    updateSelectors();
    runAllFormatters();

    // Use a MutationObserver to detect page changes
    const observer = new MutationObserver((mutationsList, observer) => {
        let observerConfigs = useAllConfigsEnabled ? configs : validConfigs;
        if (observerConfigs.length === 0) {
            if (debugModeEnabled) {
                console.warn('[YTDF] No valid configs found, skipping observer...');
            }
            return;
        }

        // handleSubscriptionsPageTimer() handles the subscriptions page, just return
        if (subscriptionsPagePattern.test(window.location.href)) { return; }

        let shouldRunFormatters = false;
        const videoContainerSelectors = observerConfigs.flatMap(config => config.videoContainerSelector);
        const videoContainerSelectorsStr = videoContainerSelectors
            .filter(selector => selector && typeof selector === 'string') // filter out invalid ones
            .join(', ');

        for (const mutation of mutationsList) {
            // Condition 1: New elements added to the DOM (e.g., infinite scroll)
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Node is an element
                        // Check if the added node is a video card itself
                        if (node.matches(videoContainerSelectorsStr)) {
                            shouldRunFormatters = true;
                        } else {
                            // Check if the added node contains a video card
                            if (node.querySelector(videoContainerSelectorsStr)) {
                                shouldRunFormatters = true;
                            }
                        }
                    }
                });
            }

            // Condition 2: Attributes change on existing elements
            // Only switching sorting methods on the channel videos page meets this condition
            // This handles cases like a video card's info being replaced
            if (mutation.type === 'attributes') {
                const videoLinkSelector = configs.find(config => config.id === 'Channel Videos').vidLinkSelector;
                // Check if the mutation target is a video link
                if (mutation.target.matches(videoLinkSelector)) {
                    // If the link's href changed, we need to run the formatters
                    if (mutation.oldValue !== mutation.target.href) {
                        shouldRunFormatters = true;
                    }
                }
            }
        }

        if (shouldRunFormatters) {
            // Use a debounce or a slight delay to prevent running too frequently
            clearTimeout(window.formatterDebounce);
            window.formatterDebounce = setTimeout(() => {
                runAllFormatters();
            }, 500); // Wait 500ms before running
        }
    });

    if (!timerModeEnabled) {
        // Start observing the entire document body
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['href'] // Only observe href attribute changes
        });
    }
    else {
        // Start a timer on page load
        updateFormattingTimer();
    }

    let styleTag = document.createElement('style');
    let cssCode = "#info > span:nth-child(3) {display:none !important;}"
        + "#info > span:nth-child(4) {display:none !important;}"
        + "#info > b {font-weight:500 !important;margin-left:6px !important;}"
        + "#date-text {display:none !important;}"
        + ".ytud-description-live #info > span:nth-child(1) {display:none !important;}"
        + ".ytud-description-live #info > b {margin-left:0 !important;margin-right:6px !important;}";
    styleTag.textContent = cssCode;
    document.head.appendChild(styleTag);
})();