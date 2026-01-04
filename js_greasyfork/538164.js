// ==UserScript==
// @name               G-搜尋結果語言在地化
// @name:en            G-LangLoc
// @name:ja            G-検索結果言語ローカライズ
// @name:ko            G-검색 결과 언어 로컬라이제이션
// @name:fr            G-Localisation des résultats de recherche
// @name:es            G-Localización de resultados de búsqueda
// @name:de            G-Suchergebnisse-Lokalisierung
// @name:uk            G-Локалізація результатів пошуку
// @name:it            G-Localizzazione dei risultati di ricerca
// @name:pt            G-Localização dos resultados de pesquisa
// @name:ar            G-توطين نتائج البحث
// @name:th            G-การแปลผลการค้นหา
// @name:hi            G-खोज परिणाम स्थानीयकरण
// @name:nl            G-Lokalisatie van zoekresultaten
// @description        將Google搜尋結果改為僅限於目標語言
// @description:en     Restrict Google search results to the target language
// @description:ja     Google検索結果をターゲット言語に限定する
// @description:ko     Google 검색 결과를 목표 언어로 제한
// @description:fr     Limiter les résultats de recherche Google à la langue cible
// @description:es     Restringir los resultados de búsqueda de Google al idioma objetivo
// @description:de     Google-Suchergebnisse auf die Zielsprache beschränken
// @description:uk     Обмежити результати пошуку Google цільовою мовою
// @description:it     Limita i risultati di ricerca di Google alla lingua target
// @description:pt     Restringir os resultados de pesquisa do Google ao idioma-alvo
// @description:ar     تقييد نتائج بحث Google باللغة المستهدفة
// @description:th     จำกัดผลการค้นหาของ Google ไว้ที่ภาษาเป้าหมาย
// @description:hi     Google खोज परिणामों को लक्ष्य भाषा तक सीमित करें
// @description:nl     Google-zoekresultaten beperken tot de doeltaal

// @icon               https://www.google.com/favicon.ico
// @match              https://www.google.com/search*
// @grant              GM_setValue
// @grant              GM_getValue
// @grant              GM_registerMenuCommand
// @version            1.0.2

// @author             Max
// @namespace          https://github.com/Max46656
// @license            MPL2.0
// @downloadURL https://update.greasyfork.org/scripts/538164/G-%E6%90%9C%E5%B0%8B%E7%B5%90%E6%9E%9C%E8%AA%9E%E8%A8%80%E5%9C%A8%E5%9C%B0%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/538164/G-%E6%90%9C%E5%B0%8B%E7%B5%90%E6%9E%9C%E8%AA%9E%E8%A8%80%E5%9C%A8%E5%9C%B0%E5%8C%96.meta.js
// ==/UserScript==

class LanguageManager {
    constructor() {
        // 使用 'use strict' 確保嚴格模式
        'use strict';

        // 初始化預設語言和自動應用狀態
        this._selectedLang = GM_getValue('selectedLang', 'lang_zh-TW');
        this._autoApply = GM_getValue('autoApply', true);

        this.init();
    }

    _languages = {
        'lang_zh-TW': '繁體中文 (Traditional Chinese)',
        'lang_en': 'English',
        'lang_ja': '日本語 (Japanese)',
        'lang_ko': '한국어 (Korean)',
        'lang_fr': 'Français (French)',
        'lang_es': 'Español (Spanish)',
        'lang_de': 'Deutsch (German)',
        'lang_uk-UA': 'українська мова (Ukrainian)',
        'lang_it': 'Italiano (Italian)',
        'lang_pt': 'Português (Portuguese)',
        'lang_ar': 'العربية (Arabic)',
        'lang_th': 'ไทย (Thai)',
        'lang_hi': 'हिन्दी (Hindi)',
        'lang_nl': 'Nederlands (Dutch)'
    };

    _selectedLang;
    _autoApply;

    init() {
        this._applyLanguage();
        this._initToggleSwitch();
        GM_registerMenuCommand('自動切換開關', () => this._toggleAutoApply());
        GM_registerMenuCommand('選擇語言', () => this._selectLanguage());
    }

    _selectLanguage() {
        let langPrompt = '可用語言：\n' + Object.entries(this._languages).map(([code, name], index) => `${index + 1}. ${name}`).join('\n');
        let choice = prompt(`${langPrompt}\n\n輸入您偏好的語言編號 (1-${Object.keys(this._languages).length})：`);
        let index = parseInt(choice) - 1;
        let langKeys = Object.keys(this._languages);
        if (index >= 0 && index < langKeys.length) {
            let oldLang = this._selectedLang;
            this._selectedLang = langKeys[index];
            GM_setValue('selectedLang', this._selectedLang);
            alert(`語言已設為 ${this._languages[this._selectedLang]}`);
            // 若自動應用啟用，更新網址
            if (this._autoApply) {
                let url = window.location.href;
                url = this._removeLangFromUrl(url, oldLang);
                url = this._addLangToUrl(url, this._selectedLang);
                if (url !== window.location.href) {
                    window.location.href = url;
                }
            }
        } else {
            alert('無效的選擇，請重試。');
        }
    }

    _addLangToUrl(url, lang) {
        let langParam = `lr=${lang}`;
        if (!url.includes(`lr=`)) {
            // 若無 lr 參數，新增 ?lr=<lang> 或 &lr=<lang>
            return url.includes('?') ? url + `&${langParam}` : url + `?${langParam}`;
        } else if (!url.includes(lang)) {
            // 若 lr 存在，追加 %7C<lang>
            // %7C => |
            return url.replace(/lr=([^&]*)/, `lr=$1%7C${lang}`);
        }
        return url;
    }

    _removeLangFromUrl(url, lang) {
        let langParam = `lr=${lang}`;
        let pipeLangStart = `lr=${lang}%7C`;
        let pipeLangMiddleOrEnd = `%7C${lang}`;

        // 語言在開頭且後面有 %7C 其他語言
        if (url.includes(pipeLangStart)) {
            return url.replace(new RegExp(`lr=${lang}%7C`), 'lr=');
        }
        // 語言在中間或結尾
        else if (url.includes(pipeLangMiddleOrEnd)) {
            let newUrl = url.replace(new RegExp(`%7C${lang}((%7C)|(&|$))`, 'g'), '$1');
            // 如果移除後 lr= 變空，移除整個 lr= 參數
            if (newUrl.includes('lr=&') || newUrl.match(/lr=$/)) {
                newUrl = newUrl.replace(/lr=[^&]*(&|$)/, '');
            }
            return newUrl;
        }
        // 語言為獨立的 lr=<lang>
        else if (url.includes(`&${langParam}`)) {
            return url.replace(`&${langParam}`, '');
        } else if (url.includes(`?${langParam}`)) {
            return url.replace(`${langParam}`, '');
        }
        return url;
    }

    _toggleAutoApply() {
        this._autoApply = !this._autoApply;
        GM_setValue('autoApply', this._autoApply);
        let url = window.location.href;
        if (this._autoApply) {
            url = this._addLangToUrl(url, this._selectedLang);
        } else {
            url = this._removeLangFromUrl(url, this._selectedLang);
        }
        if (url !== window.location.href) {
            window.location.href = url;
        }
        alert(`自動應用語言現為 ${this._autoApply ? '啟用' : '禁用'}`);
    }

    _applyLanguage() {
        if (this._autoApply) {
            let url = window.location.href;
            if (!url.includes(this._selectedLang)) {
                url = this._addLangToUrl(url, this._selectedLang);
                if (url !== window.location.href) {
                    window.location.href = url;
                }
            }
        }
    }

_initToggleSwitch() {
        // 尋找 div.RNNXgb 及其母元素
        const searchBar = document.querySelector('div.crJ18e');
        if (!searchBar) return;

        const parent = searchBar.parentElement;
        if (!parent) return;

        const toggleContainer = document.createElement('div');
        toggleContainer.style.margin = '5px 250px 5px 0';
        toggleContainer.style.display = 'flex';
        toggleContainer.style.alignItems = 'center';
        toggleContainer.style.gap = '20px';

        const label = document.createElement('span');
        label.textContent = '';
        label.style.fontSize = '14px';
        label.style.color = '#333';

        const toggleSwitch = document.createElement('div');
        toggleSwitch.className = 'onoffswitch';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'onoffswitch-checkbox';
        checkbox.id = 'LangLocSwitch';
        checkbox.tabIndex = 0;
        checkbox.checked = this._autoApply;

        const toggleLabel = document.createElement('label');
        toggleLabel.className = 'onoffswitch-label';
        toggleLabel.htmlFor = 'LangLocSwitch';

        const style = document.createElement('style');
        style.textContent = `
            .onoffswitch {
                position: relative;
                width: 60px;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
            }
            .onoffswitch-checkbox {
                position: absolute;
                opacity: 0;
                pointer-events: none;
            }
            .onoffswitch-label {
                display: block;
                overflow: hidden;
                cursor: pointer;
                height: 10px;
                padding: 0;
                line-height: 20px;
                border: 0px solid #FFFFFF;
                border-radius: 20px;
                background-color: #9E9E9E;
                transition: background-color 0.4s;
            }
            .onoffswitch-label:before {
                content: "";
                display: block;
                width: 20px;
                margin: -5px;
                background: #FFFFFF;
                position: absolute;
                top: 0;
                bottom: 0;
                right: 45px;
                border-radius: 30px;
                box-shadow: 0 6px 12px 0px #757575;
                transition: right 0.4s;
            }
            .onoffswitch-checkbox:checked + .onoffswitch-label {
                background-color: #42A5F5;
            }
            .onoffswitch-checkbox:checked + .onoffswitch-label,
            .onoffswitch-checkbox:checked + .onoffswitch-label:before {
                border-color: #42A5F5;
            }
            .onoffswitch-checkbox:checked + .onoffswitch-label:before {
                right: 0px;
                background-color: #EA4335;
                box-shadow: 3px 6px 6px 0px rgba(0, 0, 0, 0.2);
            }
        `;

        toggleSwitch.appendChild(checkbox);
        toggleSwitch.appendChild(toggleLabel);
        toggleContainer.appendChild(label);
        toggleContainer.appendChild(toggleSwitch);
        document.head.appendChild(style);

        parent.insertBefore(toggleContainer, searchBar.nextSibling);

        checkbox.addEventListener('change', () => {
            this._autoApply = checkbox.checked;
            GM_setValue('autoApply', this._autoApply);
            let url = window.location.href;
            if (this._autoApply) {
                url = this._addLangToUrl(url, this._selectedLang);
            } else {
                url = this._removeLangFromUrl(url, this._selectedLang);
            }
            if (url !== window.location.href) {
                window.location.href = url;
            }
        });
    }

    _updateToggleSwitch() {
        const checkbox = document.querySelector('.onoffswitch-checkbox');
        if (checkbox) {
            checkbox.checked = this._autoApply;
        }
    }

}

new LanguageManager();
