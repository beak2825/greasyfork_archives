// ==UserScript==
// @name:ko           Hitomi 언어 설정
// @name              Hitomi Language Settings
// @name:ja           Hitomi言語設定
// @name:zh-TW        Hitomi語言設置
// @name:zh-CN        Hitomi语言设置

// @description:ko    모든 언어 또는 특정 언어로 Hitomi 페이지를 고정하고 설정을 기억합니다.
// @description       Pin Hitomi pages to all languages or a specific language, and remembers your choice.
// @description:ja    Hitomiのページをすべての言語または特定の言語に固定し、選択を記憶します。
// @description:zh-TW 將Hitomi頁面固定為所有語言或特定語言，並記住您的選擇。
// @description:zh-CN 将Hitomi页面固定为所有语言或特定语言，并记住您的选择。

// @namespace         https://ndaesik.tistory.com/
// @version           2.1
// @author            ndaesik & SFGFDSD(修改)
// @icon              https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://hitomi.la
// @match             https://hitomi.la/*

// @grant             GM.getValue
// @grant             GM.setValue
// @grant             GM_registerMenuCommand
// @grant             GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/487937/Hitomi%20Language%20Settings.user.js
// @updateURL https://update.greasyfork.org/scripts/487937/Hitomi%20Language%20Settings.meta.js
// ==/UserScript==

(async () => {
    'use strict';

    const STORAGE_KEY = 'hitomi_language_preference';

    const LANGUAGES = {
        'all': 'All Languages',
        'english': 'English',
        'japanese': '日本語',
        'chinese': '中文',
        'korean': '한국어',
        'russian': 'Русский',
        'spanish': 'Español',
        'portuguese': 'Português',
        'french': 'Français',
        'german': 'Deutsch',
        'italian': 'Italiano',
    };

    async function showSettingsMenu() {
        if (document.getElementById('hl-settings-modal')) return;
        const currentPref = await GM.getValue(STORAGE_KEY, { mode: 'all', lang: 'all' });
        const modal = document.createElement('div');
        modal.id = 'hl-settings-modal';
        let radioButtonsHTML = '';
        for (const [key, name] of Object.entries(LANGUAGES)) {
            const isChecked = currentPref.lang === key;
            radioButtonsHTML += `<label><input type="radio" name="language_choice" value="${key}" ${isChecked ? 'checked' : ''}> ${name}</label>`;
        }
        modal.innerHTML = `
            <div class="hl-modal-content">
                <h2>选择语言模式</h2>
                <p>选择“All Languages”恢复默认行为。</p>
                <div class="hl-lang-list">${radioButtonsHTML}</div>
                <div class="hl-button-group">
                    <button id="hl-save-btn">保存并刷新</button>
                    <button id="hl-cancel-btn">取消</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('hl-save-btn').addEventListener('click', async () => {
            const selectedLang = document.querySelector('input[name="language_choice"]:checked').value;
            await GM.setValue(STORAGE_KEY, { mode: selectedLang === 'all' ? 'all' : 'language', lang: selectedLang });

            const searchInput = document.getElementById('query-input');
            if (searchInput) {
                if (/language:\w+/.test(searchInput.value)) {
                    if (selectedLang === 'all') {
                         searchInput.value = searchInput.value.replace(/language:\w+\s*/, '').trim();
                    } else {
                        searchInput.value = searchInput.value.replace(/language:\w+/, `language:${selectedLang}`);
                    }
                }
            }
            window.location.reload();
        });

        const closeModal = () => document.body.removeChild(modal);
        document.getElementById('hl-cancel-btn').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { if (e.target.id === 'hl-settings-modal') closeModal(); });
    }

    async function applyLanguagePreference() {
        const pref = await GM.getValue(STORAGE_KEY, { mode: 'all', lang: 'all' });

        if (pref.mode === 'all') {
            return;
        }

        const targetLang = pref.lang;
        const currentUrl = window.location.toString();

        if (currentUrl.endsWith('hitomi.la/') || currentUrl.includes('-all.html')) {
            let newUrl = currentUrl;
            if (currentUrl.endsWith('hitomi.la/')) {
                newUrl = 'https://hitomi.la/index-all.html';
            }
            newUrl = newUrl.replace(/-all\./, `-${targetLang}\.`);

            if (newUrl !== currentUrl) {
                window.location.replace(newUrl);
                return;
            }
        }

        const logoLink = document.querySelector('#logo > a');
        if (logoLink) {
            logoLink.setAttribute('href', `https://hitomi.la/index-${targetLang}.html`);
        }

        if (currentUrl.includes(`-${targetLang}.`)) {
             if (history.length > 1 && document.referrer.includes('-all.html')) {
                 history.replaceState(null, '', currentUrl);
             }
        }
    }

    GM_addStyle(`
        #hl-settings-fab {
            position: fixed; bottom: 20px; left: 20px; z-index: 9999;
            padding: 12px; background-color: #3a87ad; color: white;
            border: none; border-radius: 50%; width: 56px; height: 56px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.25); cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            transition: transform 0.2s ease-in-out;
        }
        #hl-settings-fab:hover { transform: scale(1.1); }
        #hl-settings-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.6); z-index: 10000; display: flex; align-items: center; justify-content: center; }
        .hl-modal-content { background-color: #fff; color: #333; padding: 20px 25px; border-radius: 8px; width: 90vw; max-width: 400px; box-shadow: 0 5px 20px rgba(0,0,0,0.3); font-family: sans-serif; }
        .hl-modal-content h2 { margin-top: 0; text-align: center; }
        .hl-modal-content p { font-size: 14px; color: #666; text-align: center; margin-bottom: 20px; }
        .hl-lang-list { max-height: 50vh; overflow-y: auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; border-top: 1px solid #eee; border-bottom: 1px solid #eee; padding: 15px 5px; }
        .hl-lang-list label { display: flex; align-items: center; padding: 8px; border-radius: 5px; cursor: pointer; transition: background-color 0.2s; }
        .hl-lang-list label:hover { background-color: #f0f0f0; }
        .hl-lang-list input[type="radio"] { margin-right: 10px; }
        .hl-button-group { margin-top: 20px; display: flex; justify-content: flex-end; gap: 10px; }
        .hl-button-group button { padding: 10px 20px; border-radius: 5px; border: none; font-weight: bold; cursor: pointer; }
        #hl-save-btn { background-color: #3a87ad; color: white; }
        #hl-cancel-btn { background-color: #ccc; color: #333; }
    `);

    const fab = document.createElement('button');
    fab.title = '语言设置';
    fab.id = 'hl-settings-fab';
    fab.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.89 1.45l8 4A2 2 0 0 1 22 7.24v9.53a2 2 0 0 1-1.11 1.79l-8 4a2 2 0 0 1-1.79 0l-8-4A2 2 0 0 1 2 16.77V7.24a2 2 0 0 1 1.11-1.79l8-4a2 2 0 0 1 1.78 0z"></path><polyline points="2.32 6.16 12 11 21.68 6.16"></polyline><line x1="12" y1="22.76" x2="12" y2="11"></line></svg>`;
    fab.addEventListener('click', showSettingsMenu);
    document.body.appendChild(fab);

    GM_registerMenuCommand('设置语言 (Set Language)', showSettingsMenu);

    await applyLanguagePreference();

})();