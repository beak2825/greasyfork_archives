// ==UserScript==
// @name            DINOcheat : hack/cheat dino google & chrome
// @name:fr         DINOcheat : hack/cheat dino google & chrome
// @name:es         DINOcheat : hack/cheat dino google & chrome
// @name:ja         DINOcheat : hack/cheat dino google & chrome
// @name:it         DINOcheat : hack/cheat dino google & chrome
// @name:de         DINOcheat : Hack/Cheat für Dino Google & Chrome
// @name:zh-CN      DINOcheat ：Hack/Cheat Dino Google & Chrome
// @namespace       http://tampermonkey.net/
// @version         19-11-2025__1.8.6
// @icon            https://raw.githubusercontent.com/DREwX-code/DINOcheat/refs/heads/main/assets/logo/drewx_logo.png
// @description     Use the super features to make your Dino limitless: auto bot ｜ speed ｜ score ｜ immortal ｜ fly ｜ invisibility ｜ pause ｜ 16 dino skins
// @description:fr  Utilisez les super fonctionnalités pour avoir un dino sans limites : bot automatique ｜ vitesse ｜ score ｜ immortel ｜ voler ｜ invisibilité ｜ pause ｜ 16 skins dino
// @description:es  Usa las super funciones para tener un Dino sin límites: bot automático ｜ velocidad ｜ puntuación ｜ inmortal ｜ volar ｜ invisibilidad ｜ pausa ｜ 16 skins de dino
// @description:ja  スーパー機能を使って制限のないDinoを手に入れよう： 自動ボット ｜ 速度 ｜ スコア ｜ 不死 ｜ 飛行 ｜ 透明化 ｜ 一時停止 ｜ 16種類のスキン
// @description:it  Usa le super funzionalità per avere un Dino senza limiti: bot automatico ｜ velocità ｜ punteggio ｜ immortale ｜ volare ｜ invisibilità ｜ pausa ｜ 16 skin dino
// @description:de  Nutze die Superfunktionen, um deinen Dino grenzenlos zu machen: automatischer Bot ｜ Geschwindigkeit ｜ Punktzahl ｜ unsterblich ｜ fliegen ｜ Unsichtbarkeit ｜ Pause ｜ 16 Dino-Skins
// @description:zh-CN  使用超级功能让你的恐龙无限制： 自动机器人 ｜ 速度 ｜ 分数 ｜ 不朽 ｜ 飞行 ｜ 隐身 ｜ 暂停 ｜ 15款恐龙皮肤
// @match        *://chromedino.com/*
// @match        *://tuckercraig.com/dino/*
// @match        *://trex-runner.com/*
// @match        *://dino-chrome.com/*
// @match        *://dinorunner.com/*
// @match        *://googledino.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      greasyfork.org
// @author       Dℝ∃wX
// @copyright    2025 DℝᴇwX
// @license      Apache-2.0
// @run-at       document-idle
// @require      https://update.greasyfork.org/scripts/554218/1698303/DINOcheat%20Translation%20Library.js
// @tag          games
// @tag          bot
// @tag          custom
// @tag          themes
// @tag          immortal
// @tag          dino
// @tag          play
// @downloadURL https://update.greasyfork.org/scripts/486972/DINOcheat%20%3A%20hackcheat%20dino%20google%20%20chrome.user.js
// @updateURL https://update.greasyfork.org/scripts/486972/DINOcheat%20%3A%20hackcheat%20dino%20google%20%20chrome.meta.js
// ==/UserScript==


/*
Copyright 2025 Dℝ∃wX

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/



/*
By using this script, you agree to the Terms of Use.
Original version (French) available here:
https://github.com/DREwX-code/DINOcheat/blob/main/Terms-of-use_FR.md
The French Terms of Use linked above is the definitive policy; in case of any discrepancy with any translation, it prevails.
*/



(async function () {


    const currentURL = window.location.href;

    if (currentURL.includes(".png")) {
    } else {

        try {
            const initialLang = (await GM_getValue('selectedLang')) || (navigator.language ? navigator.language.slice(0, 2) : 'en') || 'en';
            localStorage.setItem('DINO_LANG', initialLang);
        } catch (e) { }

        const GREASYFORK_PAGE_URL = 'https://greasyfork.org/en/scripts/486972-dinocheat-hack-cheat-dino-google-chrome';

        function getLocalVersion() {
            try {
                if (typeof GM_info !== 'undefined' && GM_info && GM_info.script && GM_info.script.version) {
                    return GM_info.script.version;
                }
            } catch (_) { }
            return '2-11-2025__1.8.5';
        }

        function httpGetCrossOrigin(url) {
            return new Promise((resolve, reject) => {
                if (typeof GM_xmlhttpRequest === 'function') {
                    try {
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url,
                            onload: (res) => resolve(res.responseText),
                            onerror: (err) => reject(err)
                        });
                    } catch (err) {
                        reject(err);
                    }
                } else {
                    fetch(url).then(r => r.text()).then(resolve).catch(reject);
                }
            });
        }

        function parseLatestVersionAndInstall(html) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const versionSpan = doc.querySelector('dd.script-show-version > span');
            const latestVersion = versionSpan ? (versionSpan.textContent || '').trim() : null;
            const installAnchor = doc.querySelector('a.install-link, a[href$=".user.js"]');
            const installHref = installAnchor ? installAnchor.href : GREASYFORK_PAGE_URL;
            return { latestVersion, installHref };
        }

        function getLangSync() {
            try { const v = localStorage.getItem('DINO_LANG'); if (v) return v; } catch (_) { }
            return (navigator.language ? navigator.language.slice(0, 2) : 'en') || 'en';
        }

        function showUpdatePopup(latestVersion, installHref) {
            const langRaw = getLangSync();
            const lang = langRaw === 'zh' ? 'zh-CN' : langRaw;
            const M = {
                fr: {
                    title: 'Mise à jour disponible',
                    desc: `Une nouvelle version de DINOcheat est disponible.\nInstallée: ${getLocalVersion()} • Dernière: ${latestVersion}\nVotre script est obsolète.`,
                    install: 'Installer la nouvelle version',
                    later: 'Plus tard'
                },
                en: {
                    title: 'Update available',
                    desc: `A new version of DINOcheat is available.\nInstalled: ${getLocalVersion()} • Latest: ${latestVersion}\nYour script is outdated.`,
                    install: 'Install new version',
                    later: 'Later'
                },
                es: {
                    title: 'Actualización disponible',
                    desc: `Hay una nueva versión de DINOcheat disponible.\nInstalada: ${getLocalVersion()} • Última: ${latestVersion}\nTu script está obsoleto.`,
                    install: 'Instalar nueva versión',
                    later: 'Más tarde'
                },
                it: {
                    title: 'Aggiornamento disponibile',
                    desc: `È disponibile una nuova versione di DINOcheat.\nInstallata: ${getLocalVersion()} • Ultima: ${latestVersion}\nIl tuo script è obsoleto.`,
                    install: 'Installa la nuova versione',
                    later: 'Più tardi'
                },
                de: {
                    title: 'Update verfügbar',
                    desc: `Eine neue Version von DINOcheat ist verfügbar.\nInstalliert: ${getLocalVersion()} • Neueste: ${latestVersion}\nIhr Skript ist veraltet.`,
                    install: 'Neue Version installieren',
                    later: 'Später'
                },
                ja: {
                    title: 'アップデートがあります',
                    desc: `DINOcheat の新しいバージョンがあります。\nインストール済み: ${getLocalVersion()} • 最新: ${latestVersion}\nお使いのスクリプトは古くなっています。`,
                    install: '新しいバージョンをインストール',
                    later: '後で'
                },
                'zh-CN': {
                    title: '有可用更新',
                    desc: `DINOcheat 有新版本可用。\n已安装: ${getLocalVersion()} • 最新: ${latestVersion}\n您的脚本已过期。`,
                    install: '安装新版本',
                    later: '稍后'
                }
            }[lang] || {
                title: 'Update available',
                desc: `A new version of DINOcheat is available.\nInstalled: ${getLocalVersion()} • Latest: ${latestVersion}\nYour script is outdated.`,
                install: 'Install new version',
                later: 'Later'
            };

            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.inset = '0';
            overlay.style.background = 'rgba(0,0,0,0.55)';
            overlay.style.backdropFilter = 'blur(2px)';
            overlay.style.zIndex = '2147483000';

            const modal = document.createElement('div');
            modal.style.position = 'fixed';
            modal.style.left = '50%';
            modal.style.top = '18%';
            modal.style.transform = 'translate(-50%, 0)';
            modal.style.width = 'min(92vw, 560px)';
            modal.style.background = 'linear-gradient(180deg, #ffffff 0%, #f7f9ff 100%)';
            modal.style.border = '1px solid #e5e7eb';
            modal.style.borderRadius = '14px';
            modal.style.boxShadow = '0 20px 60px rgba(0,0,0,0.25), 0 2px 10px rgba(0,0,0,0.15)';
            modal.style.padding = '22px 20px 16px';
            modal.style.zIndex = '2147483647';

            const title = document.createElement('div');
            title.textContent = M.title;
            title.style.fontSize = '20px';
            title.style.fontWeight = '700';
            title.style.color = '#111827';
            title.style.margin = '2px 6px 8px';

            const text = document.createElement('div');
            text.textContent = M.desc;
            text.style.whiteSpace = 'pre-line';
            text.style.fontSize = '15px';
            text.style.lineHeight = '1.5';
            text.style.color = '#1f2937';
            text.style.margin = '0 6px 16px';

            const actions = document.createElement('div');
            actions.style.display = 'flex';
            actions.style.gap = '10px';
            actions.style.justifyContent = 'flex-end';
            actions.style.marginTop = '8px';

            const laterBtn = document.createElement('button');
            laterBtn.textContent = M.later;
            laterBtn.style.padding = '10px 14px';
            laterBtn.style.borderRadius = '10px';
            laterBtn.style.border = '1px solid #e5e7eb';
            laterBtn.style.background = '#fff';
            laterBtn.style.color = '#111827';
            laterBtn.style.cursor = 'pointer';

            const installBtn = document.createElement('a');
            installBtn.textContent = M.install;
            installBtn.href = installHref || GREASYFORK_PAGE_URL;
            installBtn.target = '_blank';
            installBtn.rel = 'noopener';
            installBtn.style.textDecoration = 'none';
            installBtn.style.padding = '10px 14px';
            installBtn.style.borderRadius = '10px';
            installBtn.style.background = '#1b4ed1';
            installBtn.style.color = '#fff';
            installBtn.style.border = '1px solid #1b4ed1';
            installBtn.style.cursor = 'pointer';

            actions.appendChild(laterBtn);
            actions.appendChild(installBtn);

            laterBtn.addEventListener('click', () => {
                try { document.body.removeChild(overlay); } catch (_) { }
                try { document.body.removeChild(modal); } catch (_) { }
            });

            document.body.appendChild(overlay);
            modal.appendChild(title);
            modal.appendChild(text);
            modal.appendChild(actions);
            document.body.appendChild(modal);
        }

        async function checkForUpdate() {
            try {
                const html = await httpGetCrossOrigin(GREASYFORK_PAGE_URL);
                const { latestVersion, installHref } = parseLatestVersionAndInstall(html);
                if (latestVersion) {
                    const local = (getLocalVersion() || '').trim();
                    if (local && local !== latestVersion) {
                        showUpdatePopup(latestVersion, installHref);
                    }
                }
            } catch (_) {
            }
        }

        checkForUpdate();


        const DEFAULT_THEME_ORDER = [
            'color',
            'mario',
            'trump',
            'joker',
            'batman',
            'night',
            'squid_game',
            'santa',
            'halloween',
            'wednesday',
            'naruto',
            'naruto2',
            'godzilla',
            'cat',
            'ninja',
            'classic'
        ];

        function normalizeThemeOrder(order) {
            const cleaned = Array.isArray(order) ? order.filter(theme => DEFAULT_THEME_ORDER.includes(theme)) : [];
            DEFAULT_THEME_ORDER.forEach(theme => {
                if (!cleaned.includes(theme)) {
                    cleaned.push(theme);
                }
            });
            return cleaned;
        }

        const storedThemeOrder = await GM_getValue('themeOrder');
        let themeOrder = normalizeThemeOrder(storedThemeOrder);
        if (!storedThemeOrder || storedThemeOrder.length !== themeOrder.length || storedThemeOrder.some((theme, idx) => theme !== themeOrder[idx])) {
            await GM_setValue('themeOrder', themeOrder);
        }

        let currentTheme = await GM_getValue('currentTheme', 'classic');
        if (!DEFAULT_THEME_ORDER.includes(currentTheme)) {
            currentTheme = 'classic';
            await GM_setValue('currentTheme', currentTheme);
        }



        if (window.location.href.startsWith("https://chromedino.com/") ||
            window.location.href.startsWith("https://tuckercraig.com/dino/")) {

            var menuFooter = document.querySelector('footer.other-versions.__wrapper ul');

            if (menuFooter) {
                var newMenuItem = document.createElement('li');
                var newLink = document.createElement('a');
                newLink.href = "#";
                newLink.innerHTML = `
                <img src="https://raw.githubusercontent.com/DREwX-code/DINOcheat/refs/heads/main/assets/logo/drewx_logo.png" width="40">
                <span>${DINO_TRANSLATE('menu')}</span>
                `;

                newMenuItem.appendChild(newLink);
                menuFooter.appendChild(newMenuItem);

                newLink.addEventListener('click', function (e) {
                    e.preventDefault();
                    toggleMenuPopup();
                });
            }

        } else if (window.location.href.startsWith("https://dino-chrome.com/") ||
            window.location.href.startsWith("https://googledino.com/")) {

            var mainMenu = document.querySelector('nav.main-menu');
            if (mainMenu) {
                var divider = document.createElement('span');
                divider.className = 'divider';

                var newLink1 = document.createElement('a');
                newLink1.href = "#";
                newLink1.textContent = DINO_TRANSLATE('menu');
                newLink1.style.cursor = 'pointer';

                newLink1.addEventListener('click', function (e) {
                    e.preventDefault();
                    toggleMenuPopup();
                });

                mainMenu.appendChild(divider);
                mainMenu.appendChild(newLink1);
            }
        } else if (window.location.href.startsWith("https://trex-runner.com/")) {

            var existingMenuDiv = document.querySelector('.menu');

            if (existingMenuDiv) {
                var menuLink = document.createElement('a');
                menuLink.href = "#";
                menuLink.innerHTML = `
                    <img src="https://raw.githubusercontent.com/DREwX-code/DINOcheat/refs/heads/main/assets/logo/drewx_logo.png">
                    <span>${DINO_TRANSLATE('menu')}</span>
                `;

                menuLink.addEventListener('click', function (e) {
                    e.preventDefault();
                    toggleMenuPopup();
                });

                existingMenuDiv.appendChild(menuLink);
            }
        }



        if (window.location.hostname === "dinorunner.com") {
            const style = document.createElement('style');
            style.innerHTML = `
            .super-error-popup-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.4);
                z-index: 9998;
                display: none;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .super-error-popup {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.7);
                width: 80%;
                max-width: 600px;
                padding: 20px;
                background: rgba(255, 255, 255, 0.9);
                border: 1px solid black;
                border-radius: 12px;
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
                z-index: 9999;
                display: none;
                opacity: 0;
                transition: transform 0.3s ease, opacity 0.3s ease;
            }

            .super-error-popup.open {
                transform: translate(-50%, -50%) scale(1);
                opacity: 1;
            }

            .super-error-popup .close-btn {
                position: absolute;
                top: 10px;
                right: 10px;
                cursor: pointer;
                font-size: 24px;
                font-weight: bold;
                color: red;
                transition: color 0.3s ease;
            }

            .super-error-popup .close-btn:hover {
                color: #ff4c4c;
            }

            .super-error-popup .content {
                padding-top: 20px;
                font-size: 20px;
            }

            .super-error-popup .content a {
                color: #007bff;
                text-decoration: none;
            }

            .super-error-popup .content a:hover {
                text-decoration: underline;
            }

            .flag-container {
                position: absolute;
                top: 10px;
                left: 10px;
                cursor: pointer;
                display: flex;
                align-items: center;
            }

            .flag-container img {
                width: 40px;
                height: auto;
                border-radius: 4px;
                margin-right: 10px;
                transition: transform 0.2s ease;
                filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
            }

            .flag-container img:hover {
                transform: scale(1.1);
            }

            .flag-dropdown {
                display: none;
                position: absolute;
                top: 35px;
                right: 1px;
                background: #fff;
                border: 1px solid #ddd;
                border-radius: 6px;
                box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
                padding: 8px;
                z-index: 10000;

                max-height: 140px;
                overflow-y: auto;
                overflow-x: hidden;
                scroll-behavior: smooth;
            }

            .flag-dropdown .flag {
                display: block;
                margin: 6px auto;
                width: 36px;
                height: auto;
                border-radius: 4px;
                transition: transform 0.2s ease;
            }

            .flag-dropdown .flag:hover {
                transform: scale(1.1);
            }

            .flag-dropdown::-webkit-scrollbar {
                width: 6px;
            }

            .flag-dropdown::-webkit-scrollbar-track {
                background: #f5f5f5;
                border-radius: 3px;
            }

            .flag-dropdown::-webkit-scrollbar-thumb {
                background-color: #ccc;
                border-radius: 3px;
                transition: background-color 0.2s ease;
            }

            .flag-dropdown::-webkit-scrollbar-thumb:hover {
                background-color: #999;
            }

            `;

            document.head.appendChild(style);

            const overlay = document.createElement('div');
            overlay.className = 'super-error-popup-overlay';
            document.body.appendChild(overlay);

            const popup = document.createElement('div');
            popup.className = 'super-error-popup';
            popup.innerHTML = `
            <div class="flag-container">
                <img src="" alt="flagselect" id="flag-select" class="flag" data-lang="">
                <div class="flag-dropdown" id="flag-dropdown">
                    <img src="https://upload.wikimedia.org/wikipedia/en/c/c3/Flag_of_France.svg" id="flag-fr" class="flag" data-lang="fr">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg" id="flag-es" class="flag" data-lang="es">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Flag_of_Italy.svg/langfr-450px-Flag_of_Italy.svg.png" id="flag-it" class="flag" data-lang="it">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/440px-Flag_of_the_United_Kingdom_%283-5%29.svg.png" id="flag-en" class="flag" data-lang="en">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Flag_of_Germany.svg/langfr-2880px-Flag_of_Germany.svg.png" id="flag-de" class="flag" data-lang="de">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Flag_of_the_People%27s_Republic_of_China.svg" id="flag-zh-CN" class="flag" data-lang="zh-CN">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Flag_of_Japan.svg/1599px-Flag_of_Japan.svg.png" id="flag-ja" class="flag" data-lang="ja">
                </div>
            </div>
            <span class="close-btn">&times;</span>
            <div class="content" id="content-message">
                (Dℝ∃wX) Hello, sorry but this script does not work on this site. I advise you to use this site <a href="https://chromedino.com/" target="_blank">https://chromedino.com/</a>
            </div>
            `;
            document.body.appendChild(popup);

            const flagContainer = document.querySelector('.flag-container');
            const flagDropdown = document.getElementById('flag-dropdown');
            const flags = document.querySelectorAll('#flag-dropdown .flag');
            const currentLang = await GM_getValue('selectedLang', 'en');
            const savedLang = await GM_getValue('selectedLang', 'en');

            const LANG_TO_FLAG = {
                en: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/440px-Flag_of_the_United_Kingdom_%283-5%29.svg.png',
                fr: 'https://upload.wikimedia.org/wikipedia/en/c/c3/Flag_of_France.svg',
                es: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg',
                it: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Flag_of_Italy.svg/langfr-450px-Flag_of_Italy.svg.png',
                de: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Flag_of_Germany.svg/langfr-2880px-Flag_of_Germany.svg.png',
                'zh-CN': 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Flag_of_the_People%27s_Republic_of_China.svg',
                ja: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Flag_of_Japan.svg/1599px-Flag_of_Japan.svg.png'
            };

            const savedFlag = LANG_TO_FLAG[savedLang] || LANG_TO_FLAG.en;
            await GM_setValue('selectedFlag', savedFlag);
            try { localStorage.setItem('DINO_LANG', savedLang); } catch (e) { }

            const flagSelect = document.getElementById('flag-select');
            flagSelect.src = savedFlag;
            flagSelect.dataset.lang = savedLang;
            flagSelect.src = savedFlag;
            flagSelect.dataset.lang = savedLang;
            flagSelect.setAttribute('data-lang', savedLang);
            const contentMessage = document.getElementById('content-message');
            switch (savedLang) {
                case 'fr':
                    contentMessage.innerHTML = '(Dℝ∃wX) Désolé, ce script ne fonctionne pas sur ce site. Je vous conseille d\'utiliser ce site <a href="https://dino-chrome.com/" target="_blank">https://dino-chrome.com/</a>';
                    break;
                case 'es':
                    contentMessage.innerHTML = '(Dℝ∃wX) Lo siento, este script no funciona en este sitio. Le recomiendo que utilice este sitio <a href="https://dino-chrome.com/" target="_blank">https://dino-chrome.com/</a>';
                    break;
                case 'it':
                    contentMessage.innerHTML = '(Dℝ∃wX) Mi dispiace, questo script non funziona su questo sito. Ti consiglio di usare questo sito <a href="https://dino-chrome.com/" target="_blank">https://dino-chrome.com/</a>';
                    break;
                case 'de':
                    contentMessage.innerHTML = '(Dℝ∃wX) Leider funktioniert dieses Skript auf dieser Website nicht. Ich empfehle Ihnen, diese Seite zu verwenden <a href="https://dino-chrome.com/" target="_blank">https://dino-chrome.com/</a>';
                    break;
                case 'zh-CN':
                    contentMessage.innerHTML = '(Dℝ∃wX) 抱歉，此脚本在此网站上无法运行。建议您使用此网站 <a href="https://dino-chrome.com/" target="_blank">https://dino-chrome.com/</a>';
                    break;
                case 'ja':
                    contentMessage.innerHTML = '(Dℝ∃wX) 申し訳ありませんが、このスクリプトはこのサイトでは動作しません。以下のサイトをご利用いただくことをおすすめします <a href="https://dino-chrome.com/" target="_blank">https://dino-chrome.com/</a>';
                    break;
                default:
                    contentMessage.innerHTML = '(Dℝ∃wX) Hello, sorry but this script does not work on this site. I advise you to use this site <a href="https://dino-chrome.com/" target="_blank">https://dino-chrome.com/</a>';
                    break;
            }

            flagContainer.addEventListener('click', (event) => {
                event.stopPropagation();
                flagDropdown.style.display = flagDropdown.style.display === 'block' ? 'none' : 'block';
            });

            document.addEventListener('click', () => {
                flagDropdown.style.display = 'none';
            });

            flags.forEach(flag => {
                flag.addEventListener('click', async function () {
                    const selectedLang = this.dataset.lang;
                    const selectedFlag = this.src;

                    flagSelect.src = selectedFlag;
                    flagSelect.dataset.lang = selectedLang;

                    await GM_setValue('selectedLang', selectedLang);
                    await GM_setValue('selectedFlag', selectedFlag);
                    try { localStorage.setItem('DINO_LANG', selectedLang); } catch (e) { }

                    switch (selectedLang) {
                        case 'fr':
                            contentMessage.innerHTML = '(Dℝ∃wX) Désolé, ce script ne fonctionne pas sur ce site. Je vous conseille d\'utiliser ce site <a href="https://dino-chrome.com/" target="_blank">https://dino-chrome.com/</a>';
                            break;
                        case 'es':
                            contentMessage.innerHTML = '(Dℝ∃wX) Lo siento, este script no funciona en este sitio. Le recomiendo que utilice este sitio <a href="https://dino-chrome.com/" target="_blank">https://dino-chrome.com/</a>';
                            break;
                        case 'it':
                            contentMessage.innerHTML = '(Dℝ∃wX) Mi dispiace, questo script non funziona su questo sito. Ti consiglio di usare questo sito <a href="https://dino-chrome.com/" target="_blank">https://dino-chrome.com/</a>';
                            break;
                        case 'de':
                            contentMessage.innerHTML = '(Dℝ∃wX) Leider funktioniert dieses Skript auf dieser Website nicht. Ich empfehle Ihnen, diese Seite zu verwenden <a href="https://dino-chrome.com/" target="_blank">https://dino-chrome.com/</a>';
                            break;
                        case 'zh-CN':
                            contentMessage.innerHTML = '(Dℝ∃wX) 抱歉，此脚本在此网站上无法运行。建议您使用此网站 <a href="https://dino-chrome.com/" target="_blank">https://dino-chrome.com/</a>';
                            break;
                        case 'ja':
                            contentMessage.innerHTML = '(Dℝ∃wX) 申し訳ありませんが、このスクリプトはこのサイトでは動作しません。以下のサイトをご利用いただくことをおすすめします <a href="https://dino-chrome.com/" target="_blank">https://dino-chrome.com/</a>';
                            break;
                        default:
                            contentMessage.innerHTML = '(Dℝ∃wX) Hello, sorry but this script does not work on this site. I advise you to use this site <a href="https://dino-chrome.com/" target="_blank">https://dino-chrome.com/</a>';
                            break;
                    }
                });
            });

            setTimeout(() => {
                overlay.style.display = 'block';
                popup.classList.add('open');
            }, 1000);





            function openErrorPopup() {
                overlay.style.display = 'block';
                popup.style.display = 'block';
                setTimeout(() => {
                    overlay.style.opacity = '1';
                    popup.classList.add('open');
                }, 10);
            }

            function closeErrorPopup() {
                popup.classList.remove('open');
                overlay.style.opacity = '0';
                setTimeout(() => {
                    overlay.style.display = 'none';
                    popup.style.display = 'none';
                }, 300);
            }

            popup.querySelector('.close-btn').addEventListener('click', closeErrorPopup);
            openErrorPopup();

            return;
        }


        function touche(key) {
            const keyCodes = {
                'ArrowUp': 38,
                'ArrowDown': 40,
                'ArrowLeft': 37,
                'ArrowRight': 39,
            };

            const keyCode = keyCodes[key] || key.charCodeAt(0);

            var event = new KeyboardEvent('keydown', {
                key: key,
                keyCode: keyCode,
                which: keyCode,
                bubbles: true
            });

            document.dispatchEvent(event);
        }



        function updateButtonText(newText) {
            const airWalkButton = getMenuElementById('toggleAirWalkButton');
            if (airWalkButton) {
                airWalkButton.textContent = newText;
            }
        }



        let isShortcutEnabled = false;
        let isToolbarVisible = true;

        let menuPopup = null;
        let menuShadow = null;
        let windowElement = null;

        const getMenuElementById = (id) => menuShadow ? menuShadow.querySelector(`#${id}`) : null;
        const queryMenu = (selector) => menuShadow ? menuShadow.querySelector(selector) : null;
        const setMenuCheckboxState = (id, checked) => {
            const el = getMenuElementById(id);
            if (el) el.checked = checked;
        };
        const updateThemeSelection = (theme) => {
            if (!menuShadow) return;
            const options = menuShadow.querySelectorAll('.theme-option');
            options.forEach(option => {
                option.classList.toggle('active', option.dataset.theme === theme);
            });
        };

        function injectDistanceCode() {
            const increment = 1000 / Runner.instance_.distanceMeter.config.COEFFICIENT;
            Runner.instance_.distanceRan += increment;
        }


        const MENU_POPUP_STYLE = `
        :host {
            position: fixed;
            top: 50px;
            left: 50px;
            width: 300px;
            height: auto;
            max-height: 500px;
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid #333;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
            z-index: 9999;
            display: none;
            opacity: 0;
            transition: opacity 0.3s ease, transform 0.3s ease;
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            font-family: Arial, sans-serif;
            color: #333;
            overflow: visible;
        }

        :host(.open) {
            display: block;
            opacity: 1;
            transform: scale(1);
        }

        .header {
            text-align: center;
            font-weight: bold;
            margin-bottom: 15px;
            font-size: 18px;
            color: #333;
        }

        .content {
            font-size: 16px;
            color: #555;
        }

        .content span {
            display: block;
            margin-bottom: 8px;
        }

        .theme-container {
            margin-top: 12px;
        }

        .dropdown {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
            font-weight: bold;
            color: #333;
        }



        .dropdown-title {
        position: relative;
        padding-right: 18px;
        }

        .dropdown-title::after {
        content: '›';
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%) rotate(0deg);
        font-size: 16px;
        color: #333;
        transition:
            transform 0.6s cubic-bezier(0.4, 0, 0.2, 1),
            color 0.3s ease;
        }

        :host(.theme-open) .dropdown-title::after {
        transform: translateY(-50%) rotate(90deg);
        color: #1b4ed1;
        }


        .theme-panel {
        position: absolute;
        top: -1px;
        left: 100%;
        height: calc(100% + 2px);
        width: 0;
        background: linear-gradient(135deg, rgba(18, 62, 160, 0.96), rgba(28, 138, 255, 0.94));
        border: 1px solid rgb(51, 51, 51);
        border-left: 0;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        border-top-right-radius: 12px;
        border-bottom-right-radius: 12px;
        overflow: hidden;
        box-shadow: none;
        opacity: 1;
        pointer-events: none;
        z-index: 0;
        visibility: hidden;

        transition:
            width 0.6s cubic-bezier(0.4, 0, 0.2, 1),
            box-shadow 0.5s ease,
            padding 0.5s ease,
            visibility 0s linear 0.6s;

        display: flex;
        flex-direction: column;
        gap: 14px;
        box-sizing: border-box;
        will-change: width, box-shadow;
        }

        :host {
        border-radius: 12px;
        transition:
            border-top-right-radius 0.6s ease,
            border-bottom-right-radius 0.6s ease;
        }

        :host(.theme-open) .theme-panel {
        width: 220px;
        padding: 24px 20px;
        box-shadow: 12px 16px 36px rgba(16, 48, 128, 0.32);
        pointer-events: auto;
        visibility: visible;
        transition:
            width 0.6s cubic-bezier(0.4, 0, 0.2, 1),
            box-shadow 0.5s ease,
            padding 0.5s ease,
            visibility 0s linear 0s;
        }

        :host(.theme-open) {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        border-right: 0;
        transition:
            border-top-right-radius 0s linear 0s,
            border-bottom-right-radius 0s linear 0s,
            border 0.6s ease;
        }

        :host(:not(.theme-open)) .theme-panel {
        width: 0;
        padding: 0;
        box-shadow: none;
        visibility: hidden;
        transition-delay: 0s, 0s, 0s, 0.6s;
        }

        :host(:not(.theme-open)) {
        transition:
            border-top-right-radius 0s linear 0.6s,
            border-bottom-right-radius 0s linear 0.6s;
        }


        .theme-option.dragging {
        position: relative;
        opacity: 0.9;
        transform: scale(1.01);
        background: rgba(255, 255, 255, 0.15);
        border: 2px solid rgba(77, 166, 255, 0.9);
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(77, 166, 255, 0.45);
        transition: transform 0.2s ease, opacity 0.2s ease, box-shadow 0.25s ease;
        z-index: 10;
        cursor: grabbing;
        animation: blueGlow 1.6s ease-in-out infinite alternate;
        }

        @keyframes blueGlow {
        from {
            box-shadow: 0 0 8px rgba(77, 166, 255, 0.35);
        }
        to {
            box-shadow: 0 0 14px rgba(77, 166, 255, 0.65);
        }
        }

        .theme-placeholder {
        height: 36px;
        border: 2px dashed rgba(255, 255, 255, 0.2);
        border-radius: 10px;
        background: transparent;
        margin: 6px 0;
        }


        .theme-options {
            display: flex;
            flex-direction: column;
            gap: 8px;
            flex: 1;
            overflow-y: auto;
            overflow-x: hidden;
            padding-right: 4px;
        }

        .theme-option {
            display: block;
            padding: 8px 12px;
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.18);
            color: #fff;
            cursor: pointer;
            user-select: none;
            transition: background 0.2s ease, transform 0.2s ease;
        }

        .theme-options:not(:has(.dragging)) .theme-option:hover {
        background: rgba(255, 255, 255, 0.32);
        transform: translateX(4px);
        }


        .theme-option.active {
            background: rgba(255, 255, 255, 0.75);
            color: #0f2d6a;
            box-shadow: inset 0 0 0 2px rgba(15, 45, 106, 0.25);
            transform: none;
        }

        .btn-small-discreet {
            background-color: #f0f0f0;
            color: #555;
            padding: 5px 10px;
            border: 1px solid #ccc;
            border-radius: 3px;
            font-size: 12px;
            cursor: pointer;
        }

        .btn-small-discreet:hover {
            background-color: #e0e0e0;
        }

        .input-small-discreet {
            width: 80px;
            padding: 5px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }

        .menu-icon {
            width: 25px;
            height: 18px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: absolute;
            right: 15px;
            top: 10px;
            cursor: pointer;
            z-index: 1001;
        }

        .menu-icon .bar {
            height: 3px;
            width: 100%;
            background-color: #555;
            border-radius: 2px;
        }

        .side-panel {
            width: 0;
            height: 100%;
            position: fixed;
            top: 0;
            right: 0;
            background-color: #eaeaea;
            border-radius: 10px;
            overflow-x: hidden;
            transition: width 0.4s ease, border-radius 0.4s ease, background-color 0.4s ease;
            box-shadow: -4px 0 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
        }

        .side-panel.open {
            width: 100%;
            border-radius: 10px;
            background-color: #f0f0f0;
        }

        .side-panel-content {
            padding: 20px;
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 0.4s ease, transform 0.4s ease;
        }

        .side-panel.open .side-panel-content {
            opacity: 1;
            transform: translateY(0);
        }

        .options-title {
            text-align: center;
            font-size: 20px;
            margin-bottom: 20px;
            color: #444;
            margin-block-start: 0em;
        }

        .switch-container {
            display: flex;
            align-items: center;
            font-size: 14px;
            color: #333;
        }

        .checkbox-wrap-green input {
            appearance: none;
            -webkit-appearance: none;
            width: 18px;
            height: 18px;
            border: 1.2px solid;
            border-radius: 4px;
            border-color: #555;
            cursor: pointer;
            display: inline-block;
            position: relative;
            background: #fff;
            transition: 0.2s;
        }

        .checkbox-wrap-green input:checked {
            background: #4CAF50;
            border-color: #555;
        }

        .checkbox-wrap-green input:checked::after {
            content: "✔";
            font-size: 14px;
            color: #ffffff;
            position: absolute;
            left: 2px;
        }

        .checkbox-wrap-blue input {
            appearance: none;
            top: 5px;
            -webkit-appearance: none;
            width: 14px;
            height: 14px;
            border: 1.2px solid #555;
            border-radius: 3px;
            cursor: pointer;
            position: relative;
            background: #fff;
            transition: 0.2s;
        }

        .checkbox-wrap-blue input:checked {
            background: #2196F3;
            border-color: #2196F3;
        }

        .checkbox-wrap-blue input:checked::after {
            content: "✔";
            font-size: 10px;
            color: #ffffff;
            position: absolute;
            left: 1.5px;
        }


        .checkbox-wrap-blue input:focus {
            outline: none !important;
        }

        .switch-label {
            margin-right: 8px;
            color: #808080;
        }

        .discreet-switch {
            position: relative;
            display: inline-block;
            width: 40px;
            height: 20px;
            margin-left: 3px;
        }

        .discreet-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .switch-icon {
            width: 24px;
            height: 24px;
            color: #555;
            cursor: pointer;
        }

        .slider {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ddd;
            border-radius: 30px;
            cursor: pointer;
            transition: 0.4s;
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 2px;
            bottom: 2px;
            background-color: white;
            transition: 0.4s;
            border-radius: 50%;
        }

        input:checked + .slider {
            background-color: #4CAF50;
        }

        input:checked + .slider:before {
            transform: translateX(20px);
        }

        .slider.round {
            border-radius: 30px;
        }

        .slider.round:before {
            border-radius: 50%;
        }

        .credits {
            position: absolute;
            bottom: 10px;
            width: 100%;
            text-align: center;
            font-size: 12px;
            color: #888;
        }

        .credits span .terms-of-use span {
            display: block;
            font-family: 'Courier New', Courier, monospace;
            letter-spacing: 1px;
        }

        .terms-of-use {
            position: absolute;
            top: 97%;
            left: 50%;
            transform: translate(-50%, -50%);
            transition: transform 0.3s ease, color 0.3s ease;
            text-align: center;
            font-size: 12px;
            color: #888;
            cursor: pointer;
        }

        .terms-of-use:hover {
            color: blue;
        }

        .rating-container {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 18px;
        gap: 6px;
        }

        .rating-stars {
        display: flex;
        align-items: center;
        color: #f5c518;
        }

        .star {
        display: inline-block;
        width: 22px;
        height: 22px;
        transition: transform 0.25s ease, color 0.3s ease;
        cursor: pointer;
        }

        .star svg {
        width: 100%;
        height: 100%;
        fill: currentColor;
        }

        .star:hover {
        transform: scale(1.2);
        color: #ffd700;
        filter: drop-shadow(0 0 6px rgba(255, 215, 0, 0.6));
        }

        @keyframes starPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
        }

        .rating-stars .star {
        animation: starPulse 3s ease-in-out infinite;
        animation-delay: calc(var(--i, 0) * 0.2s);
        }

        `;


        let isInvisibleActive = false;

        document.addEventListener('keydown', function (event) {
            if (event.key === 'n' && isShortcutEnabled) {
                toggleInvisible();
            }
        });


        let invisibleInterval;

        function toggleInvisible() {
            if (!isInvisibleActive) {
                Runner.instance_.tRex.config.HEIGHT = -20;
                setMenuCheckboxState('toggleCheckboxInvisible', true);
            } else {
                Runner.instance_.tRex.config.HEIGHT = 47;
                setMenuCheckboxState('toggleCheckboxInvisible', false);
            }

            isInvisibleActive = !isInvisibleActive;
        }

        let isBotActive = false;

        document.addEventListener('keydown', function (event) {
            if (event.key === 'b' && isShortcutEnabled) {
                toggleBot();
            }
        });


        let botInterval;

        function toggleBot() {
            if (!isBotActive) {
                function dispatchKey(type, key) {
                    document.dispatchEvent(new KeyboardEvent(type, { keyCode: key }));
                }

                botInterval = setInterval(function () {
                    const KEY_CODE_SPACE_BAR = 32;
                    const KEY_CODE_ARROW_DOWN = 40;
                    const CANVAS_HEIGHT = Runner.instance_.dimensions.HEIGHT;
                    const DINO_HEIGHT = Runner.instance_.tRex.config.HEIGHT;

                    const obstacle = Runner.instance_.horizon.obstacles[0];
                    const speed = Runner.instance_.currentSpeed;

                    if (obstacle) {
                        const w = obstacle.width;
                        const x = obstacle.xPos;
                        const y = obstacle.yPos;
                        const yFromBottom = CANVAS_HEIGHT - y - obstacle.typeConfig.height;
                        const isObstacleNearby = x < 25 * speed - w / 2;

                        if (isObstacleNearby) {
                            if (yFromBottom > DINO_HEIGHT) {
                            } else if (y > CANVAS_HEIGHT / 2) {
                                dispatchKey("keyup", KEY_CODE_ARROW_DOWN);
                                dispatchKey("keydown", KEY_CODE_SPACE_BAR);
                            } else {
                                dispatchKey("keydown", KEY_CODE_ARROW_DOWN);
                            }
                        }
                    }
                }, Runner.instance_.msPerFrame);

                setMenuCheckboxState('toggleCheckboxBot', true);
            } else {
                clearInterval(botInterval);
                setMenuCheckboxState('toggleCheckboxBot', false);
            }

            isBotActive = !isBotActive;
        }


        let isImmortal = false;

        document.addEventListener('keydown', function (event) {
            if (event.key === 'i' && isShortcutEnabled) {
                toggleImmortality()

            }
        });


        let originalGameOver = Runner.prototype.gameOver;

        function toggleImmortality() {
            if (!isImmortal) {
                Runner.prototype.gameOver = function () { };
                setMenuCheckboxState('toggleCheckboxImmortality', true);
            } else {

                Runner.prototype.gameOver = originalGameOver;
                setMenuCheckboxState('toggleCheckboxImmortality', false);
            }

            isImmortal = !isImmortal;
        }



        function openInfoPanel() {
            let infoPanel = document.getElementById('infoPanel');

            if (!infoPanel) {
                infoPanel = document.createElement('div');
                infoPanel.id = 'infoPanel';
                infoPanel.innerHTML = `
               <span id="closeInfoPanel" style="position: absolute; top: 10px; right: 15px; cursor: pointer; font-size: 24px;">&times;</span>
               <h3>${DINO_TRANSLATE('infoLabel')}</h3>
               `;
                const infoTitle = infoPanel.querySelector('h3');
                if (infoTitle) {
                    infoTitle.style.fontSize = '26px';
                    infoTitle.style.fontWeight = '700';
                    infoTitle.style.textAlign = 'left';
                    infoTitle.style.margin = '0 0 18px 0';
                    infoTitle.style.color = '#20242a';
                    infoTitle.style.letterSpacing = '0.4px';
                    infoTitle.style.position = 'relative';
                    infoTitle.style.display = 'inline-block';
                    infoTitle.style.textTransform = 'uppercase';
                    infoTitle.style.fontFamily = 'Inter, Poppins, Segoe UI, sans-serif';

                    infoTitle.style.paddingBottom = '8px';
                    infoTitle.style.backgroundImage = 'linear-gradient(90deg, #000 0%, #555 100%)';
                    infoTitle.style.backgroundSize = '0% 2px';
                    infoTitle.style.backgroundRepeat = 'no-repeat';
                    infoTitle.style.backgroundPosition = 'left bottom';
                    infoTitle.style.transition = 'background-size 0.4s ease';

                    infoTitle.addEventListener('mouseenter', () => {
                        infoTitle.style.backgroundSize = '100% 2px';
                    });
                    infoTitle.addEventListener('mouseleave', () => {
                        infoTitle.style.backgroundSize = '0% 2px';
                    });
                }



                document.body.appendChild(infoPanel);

                infoPanel.style.position = 'fixed';
                infoPanel.style.top = '0';
                infoPanel.style.right = '-350px';
                infoPanel.style.width = '300px';
                infoPanel.style.height = '100%';
                infoPanel.style.backgroundColor = '#ffffff';
                infoPanel.style.borderLeft = '1px solid #ddd';
                infoPanel.style.borderRadius = '8px';
                infoPanel.style.boxShadow = '-2px 0 10px rgba(0, 0, 0, 0.2)';
                infoPanel.style.padding = '20px';
                infoPanel.style.zIndex = '2000';
                infoPanel.style.transition = 'right 0.3s ease';
                infoPanel.style.display = 'none';
            }

            if (infoPanel.style.display === 'none') {
                infoPanel.style.display = 'block';
                setTimeout(() => {
                    infoPanel.style.right = '0';
                }, 10);

                document.getElementById('closeInfoPanel').addEventListener('click', closeInfoPanel);

                if (!document.getElementById('suggestionsSection')) {
                    addSuggestionsSection(infoPanel);
                }

                fetchInstallCount(infoPanel);
            } else {
                closeInfoPanel();
            }
        }


        function addSuggestionsSection(infoPanel) {
            const suggestionsSection = document.createElement('div');
            suggestionsSection.id = 'suggestionsSection';
            suggestionsSection.style.marginTop = '10px';

            const contactText = document.createElement('p');
            contactText.innerHTML = `
            ${DINO_TRANSLATE('infoContact')}
            <a href="https://greasyfork.org/${DINO_TRANSLATE('link')}/scripts/486972-dinocheat-hack-cheat-dino-google-chrome-bot-rapide-score-imortel/feedback"
                target="_blank" style="color: #007BFF; text-decoration: none;">
                GreasyFork
            </a> ${DINO_TRANSLATE('OrLabel')}
            <a href="https://github.com/DREwX-code" target="_blank" style="color: #007BFF; text-decoration: none;">
                GitHub
            </a>.
            `;
            contactText.style.fontSize = '18px';
            contactText.style.marginTop = '10px';
            contactText.style.textAlign = 'left';

            const privateMessageText = document.createElement('p');
            privateMessageText.innerHTML = `
            ${DINO_TRANSLATE('infoGmail')} :
            <a href="mailto:dr3wx.andrew@gmail.com" style="color: #007BFF; text-decoration: none;">
                dr3wx.andrew@gmail.com
            </a>
            `;
            privateMessageText.style.fontSize = '18px';
            privateMessageText.style.marginTop = '10px';
            privateMessageText.style.textAlign = 'left';

            const separator = document.createElement('hr');
            separator.style.margin = '20px 0';
            separator.style.border = 'none';
            separator.style.borderTop = '1px solid #ddd';

            suggestionsSection.appendChild(contactText);
            suggestionsSection.appendChild(privateMessageText);

            infoPanel.appendChild(suggestionsSection);
            infoPanel.appendChild(separator);


            const newsTitle = document.createElement('h4');
            newsTitle.textContent = DINO_TRANSLATE('newsLabel') || 'Nouveauté';
            newsTitle.style.fontSize = '22px';
            newsTitle.style.fontWeight = '600';
            newsTitle.style.marginBottom = '12px';
            newsTitle.style.color = '#1b4ed1';
            infoPanel.appendChild(newsTitle);

            const newsImg = document.createElement('img');
            newsImg.src = 'https://raw.githubusercontent.com/DREwX-code/DINOcheat/refs/heads/main/assets/toolbar/dinocheat_toolbar.png';
            newsImg.alt = 'Nouvelle fonctionnalité';
            newsImg.style.width = '100%';
            newsImg.style.borderRadius = '6px';
            newsImg.style.boxShadow = '0 2px 10px rgba(0,0,0,0.15)';
            newsImg.style.marginBottom = '12px';
            infoPanel.appendChild(newsImg);

            const newsText = document.createElement('p');
            newsText.textContent = DINO_TRANSLATE('newsText') || 'Découvrez les dernières améliorations de DINOcheat : nouvelles options, optimisation du menu et performance accrue.';
            newsText.style.fontSize = '17px';
            newsText.style.lineHeight = '1.5';
            newsText.style.textAlign = 'left';
            newsText.style.color = '#333';
            infoPanel.appendChild(newsText);

            const newsSeparator = document.createElement('hr');
            newsSeparator.style.margin = '25px 0 15px 0';
            newsSeparator.style.border = 'none';
            newsSeparator.style.borderTop = '1px solid #ddd';
            infoPanel.appendChild(newsSeparator);

        }


        const greasyForkUrl = GREASYFORK_PAGE_URL;

        function fetchInstallCount(infoPanel) {
            fetch(greasyForkUrl)
                .then(response => response.text())
                .then(html => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const installElement = doc.querySelector('dd.script-show-total-installs > span');
                    const installCount = installElement ? installElement.textContent.trim() : "Inconnu";
                    const versionElement = doc.querySelector('dd.script-show-version > span');

                    displayInstallCountAndVersion(installCount, infoPanel);
                });
        }

        function displayInstallCountAndVersion(installCount, infoPanel) {
            const container = document.createElement('div');
            container.style.marginTop = '12px';
            container.style.padding = '10px 14px';
            container.style.border = '1px solid #e4e6eb';
            container.style.borderRadius = '8px';
            container.style.background = 'rgba(245, 247, 255, 0.6)';
            container.style.backdropFilter = 'blur(4px)';
            container.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.05)';

            const versionElement = document.createElement('p');
            versionElement.textContent = `${DINO_TRANSLATE('versionLabel')} : ${getLocalVersion()}`;
            versionElement.style.fontSize = '15px';
            versionElement.style.fontWeight = '500';
            versionElement.style.color = '#1b4ed1';
            versionElement.style.margin = '0 0 6px 0';
            versionElement.style.textAlign = 'left';

            const installCountElement = document.createElement('p');
            installCountElement.style.fontSize = '15px';
            installCountElement.style.fontWeight = '400';
            installCountElement.style.color = '#333';
            installCountElement.style.margin = '0';
            installCountElement.style.textAlign = 'left';

            container.appendChild(versionElement);
            container.appendChild(installCountElement);
            infoPanel.appendChild(container);

            let currentCount = 0;
            const targetCount = parseInt(installCount.replace(/\s/g, '')) || 0;
            const increment = Math.ceil(targetCount / 80);

            const counterInterval = setInterval(() => {
                currentCount += increment;
                if (currentCount >= targetCount) {
                    currentCount = targetCount;
                    clearInterval(counterInterval);
                }
                installCountElement.textContent = `${DINO_TRANSLATE('installLabel')} : ${currentCount.toLocaleString()}`;
            }, 25);
        }



        function closeInfoPanel() {
            const infoPanel = document.getElementById('infoPanel');

            infoPanel.style.right = '-350px';
            setTimeout(() => {
                infoPanel.remove();
            }, 300);
        }

        function closeInfoPanelFast() {
            const infoPanel = document.getElementById('infoPanel');
            infoPanel.remove();
        }


        function openTermsPanel() {
            toggleMenuPopup()
            if (typeof infoPanel !== 'undefined' && infoPanel !== null) {
                closeInfoPanelFast();
            }

            if (typeof shortcutsPanel !== 'undefined' && shortcutsPanel !== null) {
                closeInfoPanelFast();
            }


            const TermsPanel = document.createElement('div');
            TermsPanel.id = 'terms-panel';
            TermsPanel.style.position = 'fixed';
            TermsPanel.style.top = '0';
            TermsPanel.style.left = '0';
            TermsPanel.style.width = '100%';
            TermsPanel.style.height = '100%';
            TermsPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            TermsPanel.style.display = 'flex';
            TermsPanel.style.justifyContent = 'center';
            TermsPanel.style.overflow = 'auto';
            TermsPanel.style.overflowY = 'scroll';
            TermsPanel.style.alignItems = 'flex-start';
            TermsPanel.style.zIndex = '1000';

            const content = document.createElement('div');
            content.style.backgroundColor = 'white';
            content.style.padding = '20px';
            content.style.borderRadius = '10px';
            content.style.textAlign = 'left';
            content.style.maxWidth = '600px';
            content.style.width = '90%';
            content.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';

            const title = document.createElement('h2');
            title.style.textAlign = 'center';
            title.innerHTML = DINO_TRANSLATE('TileTermsLabel');
            content.appendChild(title);



            const text = document.createElement('p');
            text.innerHTML = `${DINO_TRANSLATE('TermsLabel')} `;
            content.appendChild(text);

            const clickableText = document.createElement('span');
            clickableText.id = 'boutonVF';
            clickableText.textContent = 'French';
            clickableText.style.color = 'blue';
            clickableText.style.cursor = 'pointer';
            text.appendChild(clickableText);

            function applyTermsStyles() {
                if (window.location.href.includes('chromedino.com') || window.location.href.includes('tuckercraig.com/dino')) {
                    title.style.fontSize = '2rem';
                    title.style.fontWeight = 'bold';

                    const h5Elements = text.querySelectorAll('h5');
                    h5Elements.forEach(h5 => {
                        h5.style.fontSize = '1.2rem';
                        h5.style.fontWeight = 'bold';
                    });

                    const links = text.querySelectorAll('a');
                    links.forEach(link => {
                        link.style.textDecoration = 'none';
                        link.onmouseover = () => link.style.textDecoration = 'underline';
                        link.onmouseout = () => link.style.textDecoration = 'none';
                        link.style.color = '#007bff';
                    });
                }
            }

            function getLanguageValue() {
                let languageValue;
                if (currentLang === 'fr') {
                    languageValue = 'fr'
                }
                if (currentLang === 'en') {
                    languageValue = 'en'
                }
                if (currentLang === 'it') {
                    languageValue = 'it'
                }
                if (currentLang === 'es') {
                    languageValue = 'es'
                }
                if (currentLang === 'de') {
                    languageValue = 'de'
                }
                if (currentLang === 'zh-CN') {
                    languageValue = 'zh-CN'
                }
                if (currentLang === 'ja') {
                    languageValue = 'ja'
                }
                if (currentLang === 'none') {
                    languageValue = 'en'
                }
                return languageValue;
            }
            let languageValue = getLanguageValue();

            clickableText.addEventListener('click', async function () {
                currentLang = currentLang === 'fr' ? 'en' : 'fr';
                await GM_setValue('selectedLang', currentLang);
                try { localStorage.setItem('DINO_LANG', currentLang); } catch (e) { }
                title.innerHTML = DINO_TRANSLATE('TileTermsLabel');
                content.appendChild(title);
                text.innerHTML = `${DINO_TRANSLATE('TermsLabel')}`;
                content.appendChild(text);
                text.appendChild(clickableText);
                content.appendChild(closeButton);
                if (currentLang === 'fr') {
                    clickableText.remove();
                }
                applyTermsStyles();
                TermsPanel.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });



            applyTermsStyles();


            const closeButton = document.createElement('button');
            closeButton.innerText = `${DINO_TRANSLATE('AgreeLabel')} `;
            closeButton.style.marginTop = '40px';
            closeButton.style.padding = '10px 20px';
            closeButton.style.fontSize = '16px';
            closeButton.style.backgroundColor = '#007BFF';
            closeButton.style.color = 'white';
            closeButton.style.border = 'none';
            closeButton.style.borderRadius = '5px';
            closeButton.style.cursor = 'pointer';
            closeButton.style.transition = 'background-color 0.3s, transform 0.2s';

            closeButton.onmouseover = function () {
                closeButton.style.backgroundColor = '#0056b3';
                closeButton.style.transform = 'scale(1.05)';
            };

            closeButton.onmouseout = function () {
                closeButton.style.backgroundColor = '#007BFF';
                closeButton.style.transform = 'scale(1)';
            };


            closeButton.onclick = async function () {
                if (languageValue === 'fr') {
                    currentLang = 'fr'
                    await GM_setValue('selectedLang', currentLang);
                } else if (languageValue === 'en') {
                    currentLang = 'en'
                    await GM_setValue('selectedLang', currentLang);
                } else if (languageValue === 'it') {
                    currentLang = 'it'
                    await GM_setValue('selectedLang', currentLang);
                } else if (languageValue === 'es') {
                    currentLang = 'es'
                    await GM_setValue('selectedLang', currentLang);
                } else if (languageValue === 'de') {
                    currentLang = 'de'
                    await GM_setValue('selectedLang', currentLang);
                } else if (languageValue === 'zh-CN') {
                    currentLang = 'zh-CN'
                    await GM_setValue('selectedLang', currentLang);
                } else if (languageValue === 'ja') {
                    currentLang = 'ja'
                    await GM_setValue('selectedLang', currentLang);
                } else {
                    currentLang = 'en'
                    await GM_setValue('selectedLang', currentLang);
                }
                try { localStorage.setItem('DINO_LANG', currentLang); } catch (e) { }

                toggleMenuPopup();
                TermsPanel.remove()
                document.body.style.overflow = 'auto';
            };
            if (currentLang === 'fr') {
                clickableText.remove();
            }
            content.appendChild(closeButton);

            TermsPanel.appendChild(content);
            document.body.style.overflow = 'hidden';
            document.body.appendChild(TermsPanel);
        }


        function openShortcutsPanel() {
            let shortcutsPanel = document.getElementById('shortcutsPanel');

            if (!shortcutsPanel) {
                shortcutsPanel = document.createElement('div');
                shortcutsPanel.id = 'shortcutsPanel';
                shortcutsPanel.innerHTML = `
                <span id="closeShortcutsPanel"
                    style="position: absolute; top: 10px; right: 15px; cursor: pointer; font-size: 24px;">&times;</span>
                <h3>${DINO_TRANSLATE('shortcutsTitle')}</h3>
                <ul id="shortcutsList">
                    <li data-description="${DINO_TRANSLATE('jumpDescription')}">${DINO_TRANSLATE('jumpText')}: <strong>"h"</strong></li>
                    <li data-description="${DINO_TRANSLATE('speedDescription')}">${DINO_TRANSLATE('speedText')}: <strong>"v"</strong></li>
                    <li data-description="${DINO_TRANSLATE('immortalityDescription')}">${DINO_TRANSLATE('immortalityText')}: <strong>"i"</strong>
                    </li>
                    <li data-description="${DINO_TRANSLATE('flyDescription')}">${DINO_TRANSLATE('flyText')}: <strong>"a"</strong></li>
                    <li data-description="${DINO_TRANSLATE('scoreDescription')}">${DINO_TRANSLATE('scoreText')}: <strong>"k"</strong></li>
                    <li data-description="${DINO_TRANSLATE('autoJumpDescription')}">${DINO_TRANSLATE('autoJumpText')}: <strong>"b"</strong></li>
                    <li data-description="${DINO_TRANSLATE('addScoreDescription')}">${DINO_TRANSLATE('addScoreText')}: <strong>"s"</strong></li>
                    <li data-description="${DINO_TRANSLATE('breakDescription')}">${DINO_TRANSLATE('breakText')}: <strong>"p"</strong></li>
                    <li data-description="${DINO_TRANSLATE('menuDescription')}">${DINO_TRANSLATE('menuText')}: <strong>"t"</strong></li>
                </ul>
                <div id="descriptionPanel" style="margin-top: 10px; color: #666; display: none;"></div>
            `;
                const listTitle = shortcutsPanel.querySelector('h3');
                if (listTitle) {
                    listTitle.style.fontSize = '26px';
                    listTitle.style.fontWeight = '700';
                    listTitle.style.textAlign = 'left';
                    listTitle.style.margin = '0 0 18px 0';
                    listTitle.style.color = '#20242a';
                    listTitle.style.letterSpacing = '0.4px';
                    listTitle.style.position = 'relative';
                    listTitle.style.display = 'inline-block';
                    listTitle.style.textTransform = 'uppercase';
                    listTitle.style.fontFamily = 'Inter, Poppins, Segoe UI, sans-serif';

                    listTitle.style.paddingBottom = '8px';
                    listTitle.style.backgroundImage = 'linear-gradient(90deg, #000 0%, #555 100%)';
                    listTitle.style.backgroundSize = '0% 2px';
                    listTitle.style.backgroundRepeat = 'no-repeat';
                    listTitle.style.backgroundPosition = 'left bottom';
                    listTitle.style.transition = 'background-size 0.4s ease';

                    listTitle.addEventListener('mouseenter', () => {
                        listTitle.style.backgroundSize = '100% 2px';
                    });
                    listTitle.addEventListener('mouseleave', () => {
                        listTitle.style.backgroundSize = '0% 2px';
                    });
                }


                document.body.appendChild(shortcutsPanel);

                shortcutsPanel.style.position = 'fixed';
                shortcutsPanel.style.top = '0';
                shortcutsPanel.style.right = '-350px';
                shortcutsPanel.style.width = '300px';
                shortcutsPanel.style.height = '100%';
                shortcutsPanel.style.backgroundColor = '#ffffff';
                shortcutsPanel.style.borderLeft = '1px solid #ddd';
                shortcutsPanel.style.borderRadius = '8px';
                shortcutsPanel.style.boxShadow = '-2px 0 10px rgba(0, 0, 0, 0.2)';
                shortcutsPanel.style.padding = '20px';
                shortcutsPanel.style.zIndex = '2000';
                shortcutsPanel.style.transition = 'right 0.3s ease';
                shortcutsPanel.style.display = 'none';
            }

            if (shortcutsPanel.style.display === 'none') {
                shortcutsPanel.style.display = 'block';
                setTimeout(() => {
                    shortcutsPanel.style.right = '0';
                }, 10);

                document.getElementById('closeShortcutsPanel').addEventListener('click', closeShortcutsPanel);
            } else {
                closeShortcutsPanel();
            }

            const listItems = document.querySelectorAll('#shortcutsList li');
            const descriptionPanel = document.getElementById('descriptionPanel');

            listItems.forEach(item => {
                item.addEventListener('mouseover', function () {
                    const description = this.getAttribute('data-description');
                    descriptionPanel.innerText = description;
                    descriptionPanel.style.display = 'block';
                });

                item.addEventListener('mouseout', function () {
                    descriptionPanel.style.display = 'none';
                });
            });
        }

        function closeShortcutsPanel() {
            const shortcutsPanel = document.getElementById('shortcutsPanel');

            shortcutsPanel.style.right = '-350px';
            setTimeout(() => {
                shortcutsPanel.remove();
            }, 300);
        }

        function closeShortcutsPanelFast() {
            const shortcutsPanel = document.getElementById('shortcutsPanel');
            shortcutsPanel.remove();

        }


        function toggleMenuPopup() {
            if (!menuPopup) {
                menuPopup = document.createElement('div');
                menuPopup.className = 'modern-menu-popup';
                menuShadow = menuPopup.attachShadow({ mode: 'open' });
                menuShadow.innerHTML = `
                <style>${MENU_POPUP_STYLE}</style>
                <div class="header">
                    <div class="menu-icon" id="menuIcon">
                        <div class="bar"></div>
                        <div class="bar"></div>
                        <div class="bar"></div>
                    </div>${DINO_TRANSLATE('menu')}
                </div>
                <div class="content">
                    <span>${DINO_TRANSLATE('jumpHeight')} <input type="number" id="jumpHeightInput" class="input-small-discreet" placeholder="10"></span>
                    <span>${DINO_TRANSLATE('speedText')} <input type="number" id="speedInput" class="input-small-discreet" placeholder="7"></span>
                    <span>${DINO_TRANSLATE('scoreText')} <input type="number" id="scoreInput" class="input-small-discreet" placeholder="00000"></span>
                    <span>${DINO_TRANSLATE('immortalityText')} <label class="checkbox-wrap-blue"> <input type="checkbox" id="toggleCheckboxImmortality" tabindex="-1"></label></span>
                    <span>${DINO_TRANSLATE('autoJumpText')} <label class="checkbox-wrap-blue"> <input type="checkbox" id="toggleCheckboxBot" tabindex="-1"></label></span>
                    <span>${DINO_TRANSLATE('invisibleText')} <label class="checkbox-wrap-blue"> <input type="checkbox" id="toggleCheckboxInvisible" tabindex="-1"></label></span>
                    <span>${DINO_TRANSLATE('scorePlus')} <button id="increaseScoreButton" class="btn-small-discreet"> 1000 </button></span>
                    <span>${DINO_TRANSLATE('walkIn')} <button id="toggleAirWalkButton"
                            class="btn-small-discreet">${DINO_TRANSLATE('theAir')}</button></span>
                    <div class="theme-container">
                        <div class="dropdown">
                            <span class="dropdown-title">${DINO_TRANSLATE('dinoTheme')}</span>
                        </div>
                        <div class="theme-panel" id="themePanel">
                            <div class="theme-options" id="themeOptions"></div>
                        </div>
                    </div>
                </div>
                <div class="terms-of-use">
                    <span id="TermsText">${DINO_TRANSLATE('TileTermsLabel')}</span>
                </div>

                <div id="sidePanel" class="side-panel">
                    <div class="side-panel-content">
                        <h2 class="options-title">${DINO_TRANSLATE('optionsTitle')}</h2>

                        <div class="switch-container">
                            <span class="switch-label">${DINO_TRANSLATE('shortcutsLabel')}</span>
                            <svg id="eyeIcon" class="switch-icon icon-spacing" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path
                                    d="M1.73 12c1.36-2.15 4.3-7 10.27-7s8.91 4.85 10.27 7c-1.36 2.15-4.3 7-10.27 7S3.09 14.15 1.73 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z">
                                </path>
                            </svg>
                            <label class="discreet-switch">
                                <input type="checkbox" id="toggleShortcut">
                                <span class="slider round"></span>
                            </label>
                        </div>

                        <div class="switch-container">
                            <span class="switch-label">${DINO_TRANSLATE('breakText')}</span>
                            <svg id="breakIcon" class="switch-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="6" y="4" width="4" height="16"></rect>
                                <rect x="14" y="4" width="4" height="16"></rect>
                            </svg>
                        </div>

                        <div class="switch-container">
                            <span class="switch-label">${DINO_TRANSLATE('infoLabel')}</span>
                            <svg id="infoIcon" class="switch-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="16" x2="12" y2="12"></line>
                                <line x1="12" y1="8" x2="12.01" y2="8"></line>
                            </svg>
                        </div>

                        <div class="switch-container">
                            <span class="switch-label">${DINO_TRANSLATE('ToolbarLabel')}</span>
                            <label class="checkbox-wrap-green">
                                <input type="checkbox" id="toggleToolbar">
                            </label>
                        </div>


                        <div class="switch-container">
                            <span class="switch-label">${DINO_TRANSLATE('switchLabelLang')}</span>
                            <div id="flag-selector" class="flag-conteneur">
                                <img id="selected-flag"
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/440px-Flag_of_the_United_Kingdom_%283-5%29.svg.png"
                                    alt="Selected Flag" class="flag-selected" data-lang="en" />
                                <div id="flag-list" class="flag-list">
                                    <img class="flag-option"
                                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/440px-Flag_of_the_United_Kingdom_%283-5%29.svg.png"
                                        alt="English" data-lang="en" />
                                    <img class="flag-option" src="https://upload.wikimedia.org/wikipedia/en/c/c3/Flag_of_France.svg"
                                        alt="Français" data-lang="fr" />
                                    <img class="flag-option" src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg"
                                        alt="Español" data-lang="es" />
                                    <img class="flag-option"
                                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Flag_of_Italy.svg/langfr-450px-Flag_of_Italy.svg.png"
                                        alt="Italiano" data-lang="it" />
                                    <img class="flag-option"
                                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Flag_of_Germany.svg/langfr-2880px-Flag_of_Germany.svg.png"
                                        alt="Deutsch" data-lang="de" />
                                    <img class="flag-option"
                                        src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Flag_of_the_People%27s_Republic_of_China.svg"
                                        alt="简体中文" data-lang="zh-CN" />
                                    <img class="flag-option"
                                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Flag_of_Japan.svg/1599px-Flag_of_Japan.svg.png"
                                        alt="日本" data-lang="ja" />
                                </div>
                            </div>
                        </div>
                        <br>

                        <hr style="border: none; height: 1px; background: rgba(0,0,0,0.15); margin: 10px 0 6px 0;">
                        <h2 class="options-title">${DINO_TRANSLATE('supportLabel')}</h2>


                        <div class="rating-container">
                            <span class="rating-label">${DINO_TRANSLATE('ratingLabel')}</span>
                            <a href="https://greasyfork.org/${DINO_TRANSLATE('link')}/scripts/486972-dinocheat-hack-cheat-dino-google-chrome-bot-rapide-score-imortel/feedback?locale_override=1"
                                target="_blank" class="rating-stars">
                                <span class="star">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                       <path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                    </svg>
                                </span>
                                <span class="star">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                    </svg>
                                </span>
                                <span class="star">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                    </svg>
                                </span>
                                <span class="star">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                    </svg>
                                </span>
                                <span class="star">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                </svg>
                                </span>

                            </a>
                        </div>

                        <style>

                            .flag-conteneur {
                                position: relative;
                                margin-left: 10px;
                            }

                            .flag-selected {
                                width: 35px;
                                height: 25px;
                                cursor: pointer;
                                transition: transform 0.3s ease, box-shadow 0.3s ease;
                                border-radius: 5px;
                                border: 1px solid #ddd;
                            }

                            .flag-selected:hover {
                                transform: scale(1.1);
                                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                            }

                            .flag-list {
                                position: absolute;
                                width: 100%;
                                top: 0;
                                left: 50px;
                                max-height: 100px;
                                overflow-y: auto;
                                overflow-x: hidden;
                                background-color: white;
                                border: 1px solid #ccc;
                                border-radius: 5px;
                                box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
                                padding: 10px;
                                z-index: 9999;
                                display: none;
                            }

                            .flag-list.show {
                                display: block;
                                opacity: 1;
                                transform: translateY(0);
                            }

                            .flag-list::-webkit-scrollbar {
                                width: 8px;
                            }

                            .flag-list::-webkit-scrollbar-thumb {
                                background-color: #888;
                                border-radius: 5px;
                            }

                            .flag-list::-webkit-scrollbar-thumb:hover {
                                background-color: #555;
                            }

                            .flag-option {
                                width: 35px;
                                height: 25px;
                                cursor: pointer;
                                margin: 5px 0;
                                transition: transform 0.3s ease, background-color 0.3s ease;
                                border-radius: 5px;
                                border: 1px solid transparent;
                            }

                            .flag-option:hover {
                                transform: scale(1.05);
                                background-color: #f9f9f9;
                                border: 1px solid #ddd;
                            }
                        </style>


                    </div>

                    <div class="credits">
                        <span>${DINO_TRANSLATE('creditLabel')}</span>
                    </div>
                </div>
                `;

                document.body.appendChild(menuPopup);
                setTimeout(() => {
                    menuPopup.classList.add('open');
                }, 10);


                const checkbox = getMenuElementById('toggleCheckbox');
                const statusText = getMenuElementById('status');
                const selectedFlag = getMenuElementById('selected-flag');
                const flagList = getMenuElementById('flag-list');
                const flagOptions = menuShadow.querySelectorAll('.flag-option');
                const themePanel = getMenuElementById('themePanel');
                const themeOptionsContainer = getMenuElementById('themeOptions');
                let draggingTheme = null;

                const getDragAfterElement = (container, y) => {
                    const draggableElements = Array.from(container.querySelectorAll('.theme-option:not(.dragging)'));
                    return draggableElements.reduce((closest, child) => {
                        const box = child.getBoundingClientRect();
                        const offset = y - (box.top + box.height / 2);
                        if (offset < 0 && offset > closest.offset) {
                            return { offset, element: child };
                        }
                        return closest;
                    }, { offset: Number.NEGATIVE_INFINITY, element: null }).element;
                };





                const renderThemeOptions = () => {
                    if (!themeOptionsContainer) return;
                    themeOptionsContainer.innerHTML = '';
                    themeOrder.forEach(theme => {
                        const option = document.createElement('div');
                        option.className = 'theme-option';
                        option.dataset.theme = theme;
                        option.textContent = DINO_TRANSLATE(theme);
                        option.draggable = true;

                        option.addEventListener('click', () => {
                            applyTheme(theme);
                        });

                        option.addEventListener('dragstart', (event) => {
                            draggingTheme = theme;
                            option.classList.add('dragging');
                            if (event.dataTransfer) {
                                event.dataTransfer.effectAllowed = 'move';
                                event.dataTransfer.setData('text/plain', theme);
                            }
                        });

                        option.addEventListener('dragend', () => {
                            draggingTheme = null;
                            option.classList.remove('dragging');
                        });

                        themeOptionsContainer.appendChild(option);
                    });
                    updateThemeSelection(currentTheme);
                };

                const handleThemeDragOver = (event) => {
                    if (!themeOptionsContainer) return;
                    if (!draggingTheme) return;
                    event.preventDefault();
                    const draggingEl = themeOptionsContainer.querySelector('.theme-option.dragging');
                    if (!draggingEl) return;
                    const afterElement = getDragAfterElement(themeOptionsContainer, event.clientY);
                    if (!afterElement) {
                        themeOptionsContainer.appendChild(draggingEl);
                    } else if (afterElement !== draggingEl) {
                        themeOptionsContainer.insertBefore(draggingEl, afterElement);
                    }
                };

                const handleThemeDrop = async (event) => {
                    if (!themeOptionsContainer) return;
                    event.preventDefault();
                    const orderedThemes = Array.from(themeOptionsContainer.querySelectorAll('.theme-option')).map(opt => opt.dataset.theme);
                    themeOrder = normalizeThemeOrder(orderedThemes);
                    await GM_setValue('themeOrder', themeOrder);
                    draggingTheme = null;
                    renderThemeOptions();
                };

                const setThemePanelOpen = (open) => {
                    if (!menuPopup || !themePanel) return;
                    if (open) {
                        renderThemeOptions();
                        requestAnimationFrame(() => {
                            themePanel.classList.add('open');
                            menuPopup.classList.add('theme-open');
                        });
                    } else {
                        themePanel.classList.remove('open');
                        menuPopup.classList.remove('theme-open');
                    }
                };

                if (themeOptionsContainer && !themeOptionsContainer.dataset.dragBound) {
                    themeOptionsContainer.addEventListener('dragover', handleThemeDragOver);
                    themeOptionsContainer.addEventListener('drop', handleThemeDrop);
                    themeOptionsContainer.dataset.dragBound = 'true';
                }

                renderThemeOptions();


                async function changeLanguage(flag) {
                    const newLang = flag.getAttribute('data-lang');
                    const newSrc = flag.src;

                    selectedFlag.src = newSrc;
                    selectedFlag.setAttribute('data-lang', newLang);

                    await GM_setValue('selectedLang', newLang);
                    try { localStorage.setItem('DINO_LANG', newLang); } catch (e) { }


                    currentLang = newLang;

                    flagList.classList.remove('show');
                }


                async function loadLanguage() {
                    const savedLang = await GM_getValue('selectedLang');
                    if (savedLang) {
                        const flag = menuShadow.querySelector(`.flag-option[data-lang="${savedLang}"]`);
                        if (flag) {
                            selectedFlag.src = flag.src;
                            selectedFlag.setAttribute('data-lang', savedLang);
                            currentLang = savedLang;
                            try { localStorage.setItem('DINO_LANG', savedLang); } catch (e) { }
                        }
                    } else {
                        selectedFlag.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/440px-Flag_of_the_United_Kingdom_%283-5%29.svg.png';
                        selectedFlag.setAttribute('data-lang', 'en');
                        currentLang = 'en';
                        try { localStorage.setItem('DINO_LANG', 'en'); } catch (e) { }
                    }
                }

                selectedFlag.addEventListener('click', function () {
                    if (flagList.classList.contains('show')) {
                        flagList.classList.remove('show');
                    } else {
                        flagList.classList.add('show');
                        loadLanguage();
                    }
                });

                flagOptions.forEach(function (flag) {
                    flag.addEventListener('click', function () {
                        changeLanguage(flag);
                        closeMenuPopupFast();
                        setTimeout(() => {
                            toggleMenuPopup();
                        }, 20);

                        const shortcutsPanel = document.getElementById('shortcutsPanel');
                        if (shortcutsPanel) {
                            closeShortcutsPanelFast();
                            setTimeout(() => {
                                openShortcutsPanel();
                            }, 2);
                        }

                        const infoPanel = document.getElementById('infoPanel');
                        if (infoPanel) {
                            closeInfoPanelFast();
                            setTimeout(() => {
                                openInfoPanel();
                            }, 2);
                        }

                    });
                });


                function closeMenuPopupFast() {
                    if (menuPopup) {
                        menuPopup.style.display = 'none';
                        setTimeout(() => {
                            if (document.body.contains(menuPopup)) {
                                document.body.removeChild(menuPopup);
                                menuPopup = null;
                                menuShadow = null;
                            }
                        }, 1);
                    }
                }


                document.addEventListener('click', function (e) {
                    if (!menuShadow) return;

                    const path = e.composedPath ? e.composedPath() : [];
                    const flagSelector = getMenuElementById('flag-selector');
                    const flagListRef = getMenuElementById('flag-list');
                    if (flagSelector && flagListRef) {
                        const clickedFlag = path.includes(flagSelector) || path.includes(flagListRef);
                        if (!clickedFlag) {
                            flagListRef.classList.remove('show');
                        }
                    }

                });


                document.addEventListener('DOMContentLoaded', function () {
                    loadLanguage();
                });
                loadLanguage();



                (async function initShortcutState() {
                    const saved = await GM_getValue('shortcutEnabled', false);
                    isShortcutEnabled = saved;
                    const shortcutCheckbox = getMenuElementById('toggleShortcut');
                    if (shortcutCheckbox) shortcutCheckbox.checked = saved;
                })();

                const toggleShortcutEl = getMenuElementById('toggleShortcut');
                if (toggleShortcutEl) {
                    toggleShortcutEl.addEventListener('change', async function () {
                        isShortcutEnabled = this.checked;
                        await GM_setValue('shortcutEnabled', isShortcutEnabled);
                    });
                }

                (async function initToolbarState() {
                    const savedToolbar = await GM_getValue('toolbarVisible', true);
                    isToolbarVisible = savedToolbar;
                    const toolbarCheckbox = getMenuElementById('toggleToolbar');
                    if (toolbarCheckbox) toolbarCheckbox.checked = savedToolbar;
                    if (typeof updateToolbarVisibility === 'function') {
                        updateToolbarVisibility();
                    }
                })();

                const toggleToolbarEl = getMenuElementById('toggleToolbar');
                if (toggleToolbarEl) {
                    toggleToolbarEl.addEventListener('change', async function () {
                        isToolbarVisible = this.checked;
                        if (typeof GM_setValue !== 'undefined') {
                            await GM_setValue('toolbarVisible', isToolbarVisible);
                        }
                        if (typeof updateToolbarVisibility === 'function') {
                            updateToolbarVisibility();
                        }
                    });
                }


                function detectEyeClick() {
                    const eyeIcon = getMenuElementById('eyeIcon');
                    if (eyeIcon) {
                        eyeIcon.addEventListener('click', function () {
                            const infoPanel = document.getElementById('infoPanel');
                            if (infoPanel) {
                                closeInfoPanelFast();
                                setTimeout(() => {
                                    openShortcutsPanel();
                                }, 2);
                            } else {
                                openShortcutsPanel();
                            }
                        });
                    }
                }
                detectEyeClick();


                const breakIcon = getMenuElementById('breakIcon');
                if (breakIcon) {

                    function updatePauseIcon() {
                        const isRunning = Runner.instance_ && Runner.instance_.isRunning();

                        const breakIcon = getMenuElementById('breakIcon');
                        if (breakIcon) {
                            breakIcon.innerHTML = isRunning
                                ? '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>'
                                : '<polygon points="6,4 18,12 6,20"></polygon>';
                        }

                        const pauseBtn = document.querySelector('.dz-btn-pause');
                        if (pauseBtn) {
                            let dzIcon = pauseBtn.querySelector('svg');
                            if (!dzIcon) {
                                dzIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                                dzIcon.setAttribute('viewBox', '0 0 24 24');
                                dzIcon.setAttribute('width', '20');
                                dzIcon.setAttribute('height', '20');
                                dzIcon.setAttribute('fill', 'currentColor');
                                pauseBtn.appendChild(dzIcon);
                            }

                            dzIcon.innerHTML = isRunning
                                ? '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>'
                                : '<polygon points="6,4 18,12 6,20"></polygon>';
                        }
                    }


                    function togglePause() {
                        if (Runner.instance_.isRunning()) {
                            Runner.instance_.stop();
                        } else {
                            Runner.instance_.play();
                        }
                        updatePauseIcon();
                    }

                    window.togglePause = togglePause;
                    function onBreakIconClick() {
                        togglePause();
                    }

                    function onKeydown(event) {
                        if (!isShortcutEnabled) return;
                        if (event.key === 'p') {
                            togglePause();
                            event.preventDefault();
                        }
                    }

                    breakIcon.addEventListener('click', onBreakIconClick);
                    document.addEventListener('keydown', onKeydown);


                    setInterval(updatePauseIcon, 150);
                    updatePauseIcon();
                }


                function detectInfoClick() {
                    const infoIcon = getMenuElementById('infoIcon');
                    if (infoIcon) {
                        infoIcon.addEventListener('click', function () {
                            const shortcutsPanel = document.getElementById('shortcutsPanel');
                            if (shortcutsPanel) {
                                closeShortcutsPanelFast();
                                setTimeout(() => {
                                    openInfoPanel();
                                }, 2);
                            } else {
                                openInfoPanel();
                            }
                        });
                    }
                }

                detectInfoClick();


                function detectTermsClick() {
                    const TermsText = getMenuElementById('TermsText');
                    if (TermsText) {
                        TermsText.addEventListener('click', function () {
                            const shortcutsPanel = document.getElementById('shortcutsPanel');
                            if (shortcutsPanel) {
                                closeShortcutsPanelFast();
                                setTimeout(() => {
                                    openTermsPanel();
                                }, 2);
                            } else {
                                openTermsPanel();
                            }
                        });
                    }
                }

                detectTermsClick();


                const popup = menuPopup;

                popup.style.position = 'absolute';



                const STORAGE_KEY = "theme_order";
                const themeContainer = document.querySelector(".theme-options");

                if (themeContainer) {
                    initThemeDragSort(themeContainer);
                    restoreThemeOrder(themeContainer);
                }

                function initThemeDragSort(container) {
                    const items = container.querySelectorAll(".theme-option");
                    const placeholder = document.createElement("div");
                    placeholder.className = "theme-placeholder";

                    let autoScrollSpeed = 8;
                    let autoScrollMargin = 50;
                    let autoScrollInterval = null;

                    items.forEach(item => {
                        item.setAttribute("draggable", "true");

                        item.addEventListener("dragstart", e => {
                            e.dataTransfer.effectAllowed = "move";
                            e.target.classList.add("dragging");
                            container.classList.add("drag-active");
                            container.insertBefore(placeholder, e.target.nextSibling);
                        });

                        item.addEventListener("dragend", e => {
                            e.target.classList.remove("dragging");
                            container.classList.remove("drag-active");
                            placeholder.remove();
                            saveThemeOrder(container);
                            stopAutoScroll();
                        });
                    });

                    container.addEventListener("dragover", e => {
                        e.preventDefault();
                        const dragging = container.querySelector(".dragging");
                        if (!dragging) return;

                        const afterElement = getThemeDragAfterElement(container, e.clientY);
                        if (afterElement == null) container.appendChild(placeholder);
                        else container.insertBefore(placeholder, afterElement);

                        const rect = container.getBoundingClientRect();
                        if (e.clientY < rect.top + autoScrollMargin) startAutoScroll(-autoScrollSpeed);
                        else if (e.clientY > rect.bottom - autoScrollMargin) startAutoScroll(autoScrollSpeed);
                        else stopAutoScroll();
                    });

                    container.addEventListener("dragleave", stopAutoScroll);
                    container.addEventListener("drop", stopAutoScroll);

                    function startAutoScroll(speed) {
                        if (autoScrollInterval) return;
                        autoScrollInterval = setInterval(() => (container.scrollTop += speed), 16);
                    }

                    function stopAutoScroll() {
                        clearInterval(autoScrollInterval);
                        autoScrollInterval = null;
                    }
                }

                function getThemeDragAfterElement(container, y) {
                    const elements = [...container.querySelectorAll(".theme-option:not(.dragging)")];
                    return elements.reduce(
                        (closest, child) => {
                            const box = child.getBoundingClientRect();
                            const offset = y - box.top - box.height / 2;
                            if (offset < 0 && offset > closest.offset) return { offset, element: child };
                            else return closest;
                        },
                        { offset: Number.NEGATIVE_INFINITY }
                    ).element;
                }

                function saveThemeOrder(container) {
                    const order = [...container.querySelectorAll(".theme-option")].map(el => el.dataset.id || el.textContent.trim());
                    GM_setValue(STORAGE_KEY, order);
                }

                function restoreThemeOrder(container) {
                    const savedOrder = GM_getValue(STORAGE_KEY);
                    if (!savedOrder || !Array.isArray(savedOrder)) return;

                    const itemsMap = {};
                    container.querySelectorAll(".theme-option").forEach(el => {
                        const id = el.dataset.id || el.textContent.trim();
                        itemsMap[id] = el;
                    });
                    savedOrder.forEach(id => {
                        const item = itemsMap[id];
                        if (item) container.appendChild(item);
                    });
                }


                const toggleBotCheckbox = getMenuElementById('toggleCheckboxBot');
                if (toggleBotCheckbox) {
                    toggleBotCheckbox.addEventListener('change', function () {
                        toggleBot();
                    });
                }

                const toggleInvisibleCheckbox = getMenuElementById('toggleCheckboxInvisible');
                if (toggleInvisibleCheckbox) {
                    toggleInvisibleCheckbox.addEventListener('change', function () {
                        toggleInvisible();
                    });
                }

                const toggleImmortalityCheckbox = getMenuElementById('toggleCheckboxImmortality');
                if (toggleImmortalityCheckbox) {
                    toggleImmortalityCheckbox.addEventListener('change', function () {
                        toggleImmortality();
                    });
                }

                const menuIcon = getMenuElementById('menuIcon');
                if (menuIcon) {
                    menuIcon.addEventListener('click', function () {
                        const sidePanel = getMenuElementById('sidePanel');
                        if (sidePanel) {
                            sidePanel.classList.toggle('open');
                        }
                    });
                }

                const dropdownTitle = queryMenu('.dropdown-title');
                if (dropdownTitle && themePanel) {
                    dropdownTitle.addEventListener('click', function () {
                        const shouldOpen = !themePanel.classList.contains('open');
                        setThemePanelOpen(shouldOpen);
                    });
                }

                let isDragging = false;
                let offsetX, offsetY;

                const header = queryMenu('.header');

                function updateJumpHeight(value) {
                    const jumpHeight = parseFloat(value);
                    if (!isNaN(jumpHeight)) {
                        Runner.instance_.tRex.setJumpVelocity(jumpHeight);
                    } else {
                        alert(DINO_TRANSLATE('invalidJumpHeight'));
                    }
                }

                const jumpHeightInput = getMenuElementById('jumpHeightInput');
                if (jumpHeightInput) {
                    jumpHeightInput.addEventListener('keydown', function (event) {
                        if (event.key === 'Enter') {
                            updateJumpHeight(this.value);
                        }
                    });

                    jumpHeightInput.addEventListener('change', function () {
                        updateJumpHeight(this.value);
                    });
                }



                function updateSpeed(value) {
                    const speed = parseFloat(value);
                    if (!isNaN(speed)) {
                        Runner.instance_.setSpeed(speed);
                    } else {
                        alert(DINO_TRANSLATE('invalidSpeed'));
                    }
                }

                const speedInput = getMenuElementById('speedInput');
                if (speedInput) {
                    speedInput.addEventListener('keydown', function (event) {
                        if (event.key === 'Enter') {
                            updateSpeed(this.value);
                        }
                    });

                    speedInput.addEventListener('change', function () {
                        updateSpeed(this.value);
                    });
                }



                function updateScore(value) {
                    const newScore = parseInt(value, 10);
                    if (!isNaN(newScore) && Number.isInteger(newScore) && newScore <= 999990) {
                        Runner.instance_.distanceRan = newScore / Runner.instance_.distanceMeter.config.COEFFICIENT;
                    } else {
                        alert(DINO_TRANSLATE('invalidIntegerScore'));
                    }
                }

                const scoreInput = getMenuElementById('scoreInput');
                if (scoreInput) {
                    scoreInput.addEventListener('keydown', function (event) {
                        if (event.key === 'Enter') {
                            updateScore(this.value);
                        }
                    });

                    scoreInput.addEventListener('change', function () {
                        updateScore(this.value);
                    });
                }



                function increaseScore() {
                    const scoreIncrement = 1000;
                    if (Runner.instance_) {
                        Runner.instance_.distanceRan += scoreIncrement / Runner.instance_.distanceMeter.config.COEFFICIENT;
                    } else {
                        alert(DINO_TRANSLATE('runnerInstanceNotAvailable'));
                    }
                }

                const increaseScoreButton = getMenuElementById('increaseScoreButton');
                if (increaseScoreButton) {
                    increaseScoreButton.addEventListener('click', increaseScore);
                }


                let isWalkingInTheAir = false;

                const toggleAirWalkButton = getMenuElementById('toggleAirWalkButton');
                if (toggleAirWalkButton) {
                    toggleAirWalkButton.addEventListener('click', function () {
                        if (isWalkingInTheAir) {
                            Runner.instance_.tRex.groundYPos = 93;
                            updateButtonText(DINO_TRANSLATE('theAir'));
                            touche('ArrowUp');
                        } else {
                            Runner.instance_.tRex.groundYPos = 0;
                            updateButtonText(DINO_TRANSLATE('theGround'));
                            touche('ArrowUp');
                        }

                        isWalkingInTheAir = !isWalkingInTheAir;
                    });
                }

                if (window.location.href.startsWith("https://dino-chrome.com/") ||
                    window.location.href.startsWith("https://googledino.com/")) {
                    for (let i = 0; i < document.styleSheets.length; i++) {
                        let styleSheet = document.styleSheets[i];

                        try {
                            for (let j = 0; j < styleSheet.cssRules.length; j++) {
                                let rule = styleSheet.cssRules[j];

                                if (rule.selectorText && rule.selectorText.includes('*')) {
                                    styleSheet.deleteRule(j);
                                    break;
                                }
                            }
                        } catch (e) {
                        }
                    }

                    let elements = menuShadow.querySelectorAll('.rating-stars');

                    elements.forEach(element => {
                        element.style.textDecoration = 'none';
                    });
                }



                if (header) {
                    header.addEventListener('mousedown', function (event) {
                        isDragging = true;
                        offsetX = event.clientX - menuPopup.offsetLeft;
                        offsetY = event.clientY - menuPopup.offsetTop;
                        header.style.cursor = 'grabbing';
                    });
                }

                document.addEventListener('mousemove', function (event) {
                    if (isDragging) {
                        menuPopup.style.left = event.clientX - offsetX + 'px';
                        menuPopup.style.top = event.clientY - offsetY + 'px';
                    }
                });

                document.addEventListener('mouseup', function () {
                    if (isDragging) {
                        isDragging = false;
                        if (header) {
                            header.style.cursor = 'move';
                        }
                    }
                });

            } else {
                menuPopup.classList.remove('open');
                setTimeout(() => {
                    if (menuPopup && document.body.contains(menuPopup)) {
                        document.body.removeChild(menuPopup);
                        menuPopup = null;
                        menuShadow = null;
                    }
                }, 300);
            }
        }


        document.addEventListener('keydown', function (event) {
            if (event.key === 'h' && isShortcutEnabled) {
                const userInput = prompt(DINO_TRANSLATE('enterNewJumpHeight'));
                const jumpHeight = parseFloat(userInput);
                if (!isNaN(jumpHeight)) {
                    Runner.instance_.tRex.setJumpVelocity(jumpHeight);
                    const jumpInput = getMenuElementById('jumpHeightInput');
                    if (jumpInput) {
                        jumpInput.value = jumpHeight;
                    }
                } else {
                    alert(DINO_TRANSLATE('invalidJumpHeight'));
                }
            }
        });

        const THEMES = {
            color: {
                imgs: [
                    'https://chromedino.com/assets/chromedino_coloured-1x.png',
                    'https://chromedino.com/assets/chromedino_coloured-2x.png'
                ],
                bg: '#f7f7f7',
                text: '#212529'
            },
            classic: {
                imgs: [
                    'https://dino-chrome.com/static/images/1.png',
                    'https://dino-chrome.com/static/images/2.png'
                ],
                bg: '#f7f7f7',
                text: '#212529'
            },
            mario: {
                imgs: [
                    'https://chromedino.com/assets/offline-sprite-1x-mario.png',
                    'https://chromedino.com/assets/offline-sprite-2x-mario.png'
                ],
                bg: '#75a6fa',
                text: '#212529'
            },
            trump: {
                imgs: [
                    'https://dino-chrome.com/trumpino-game/trump1x.png',
                    'https://dino-chrome.com/trumpino-game/trump2x.png'
                ],
                bg: '#f7f7f7',
                text: '#212529'
            },
            joker: {
                imgs: [
                    'https://chromedino.com/assets/joker1x.png',
                    'https://chromedino.com/assets/joker2x.png'
                ],
                bg: '#f7f7f7',
                text: '#212529'
            },
            batman: {
                imgs: [
                    'https://chromedino.com/assets/batman1x.png',
                    'https://chromedino.com/assets/batman2x.png'
                ],
                bg: '#000',
                text: '#dedede'
            },
            night: {
                imgs: [
                    'https://chromedino.com/assets/offline-sprite-1x-black.png',
                    'https://chromedino.com/assets/offline-sprite-2x-black.png'
                ],
                bg: '#000',
                text: '#dedede'
            },
            squid_game: {
                imgs: [
                    'https://dinorunner.com/static/images/squid-game/squid_game1x.png',
                    'https://dinorunner.com/static/images/squid-game/squid_game2x.png'
                ],
                bg: '#f7f7f7',
                text: '#212529'
            },
            santa: {
                imgs: [
                    'https://dinorunner.com/static/images/santa/offline-sprite-1x-santa.png',
                    'https://dinorunner.com/static/images/santa/offline-sprite-2x-santa.png'
                ],
                bg: '#0078bd',
                text: '#dedede'
            },
            halloween: {
                imgs: [
                    'https://dinorunner.com/static/images/halloween/offline-sprite-1x-halloween.png',
                    'https://dinorunner.com/static/images/halloween/offline-sprite-2x-halloween.png'
                ],
                bg: '#584766',
                text: '#dedede'
            },
            wednesday: {
                imgs: [
                    'https://dinorunner.com/static/images/wednesday/wednesday1x.png',
                    'https://dinorunner.com/static/images/wednesday/wednesday2x.png'
                ],
                bg: '#6fabd1',
                text: '#212529'
            },
            naruto: {
                imgs: [
                    'https://dinorunner.com/static/images/naruto/offline-sprite-1x-naruto.png',
                    'https://dinorunner.com/static/images/naruto/offline-sprite-2x-naruto.png'
                ],
                bg: '#f7f7f7',
                text: '#212529'
            },
            naruto2: {
                imgs: [
                    'https://trex-runner.com/img/offline-sprite-1x-naruto.png',
                    'https://trex-runner.com/img/offline-sprite-2x-naruto.png'
                ],
                bg: '#e1f7fa',
                text: '#212529'
            },
            godzilla: {
                imgs: [
                    'https://dinorunner.com/static/images/godzilla/godzilla.png',
                    'https://dinorunner.com/static/images/godzilla/godzillax2.png'
                ],
                bg: '#2e2e2e',
                text: '#dedede'
            },
            cat: {
                imgs: [
                    'https://dinosaur-game.io/game/nyancat/img/cat.png',
                    'https://dinosaur-game.io/game/nyancat/img/catx2.png'
                ],
                bg: '#060b23',
                text: '#dedede'
            },
            ninja: {
                imgs: [
                    'https://dnery.dev/t-rex-runner/assets/offline-sprite-1x.png',
                    'https://dnery.dev/t-rex-runner/assets/offline-sprite-2x.png'
                ],
                bg: '#f7f7f7',
                text: '#212529'
            }
        };


        function applyTheme(theme) {
            const cfg = THEMES[theme];
            if (!cfg) {
                console.warn(`Thème inconnu : '${theme}'`);
                return;
            }

            const [src1, src2] = cfg.imgs;
            const res1 = document.getElementById('offline-resources-1x');
            const res2 = document.getElementById('offline-resources-2x');
            if (res1) res1.src = src1;
            if (res2) res2.src = src2;

            document.body.style.backgroundColor = cfg.bg;

            if (cfg.text) applyTextColor(cfg.text);

            if (currentTheme !== theme) {
                currentTheme = theme;
                GM_setValue('currentTheme', currentTheme);
            }

            updateThemeSelection(theme);
        }


        function applyTextColor(color) {
            const host = location.hostname;



            const siteSelectors = {
                'chromedino.com': [
                    '.runner-info',
                    '#main-content h1',
                    '#main-content h2',
                    '.high-scores *',
                    '#main-content p',
                    '.copyright',
                    '.___wrapper h3',
                    'li span'
                ],
                'trex-runner.com': [
                    '.desc *',
                    '[title="Privacy Policy"]',
                    'footer *',
                    '.menu *',
                ],
                'dino-chrome.com': [
                    '.mt-3.text-center',
                    '.main-menu *',
                    '.mb-2.fluid-heading.topbar__heading',
                    '.mt-5.mb-3.d-flex.align-items-center.justify-content-between',
                    '.d-flex.flex-wrap.justify-content-center.align-items-start.mt-5.mb-5.mini-games *',
                    '.d-flex.flex-wrap.justify-content-center.align-items-center.mini-games *',
                    '.help__space'
                ],
                'dinorunner.com': ['#score', '.score-container', '.game-info', '.title'],
                'tuckercraig.com': [
                    'span', 'p', 'h1', '.copyright'
                ],
                'googledino.com': [
                    '.d-flex.align-items-center.topbar',
                    '.main-menu *',
                    '.mt-3.text-center',
                    '.mt-5.mb-3.d-flex.align-items-center.justify-content-between :not(.dropdown):not(.dropdown *)',
                ]
            };

            const selectors = new Set([...(siteSelectors[host] || [])]);

            selectors.forEach(sel => {
                document.querySelectorAll(sel).forEach(el => {
                    el.style.color = color;
                });
            });
        }



        if (!window.__DINOcheat_themes_preloaded) {
            Object.values(THEMES).forEach(theme => {
                theme.imgs.forEach(url => {
                    const img = new Image();
                    img.src = url;
                });
            });
            window.__DINOcheat_themes_preloaded = true;
        }


        document.addEventListener('keydown', function (event) {
            const termsPanel = document.getElementById('terms-panel');

            if (event.key === 't' && isShortcutEnabled && termsPanel === null) {
                toggleMenuPopup();
            }
        });



        const style = document.createElement('style');
        style.innerHTML = `
        .super-itck-popup-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.4);
            z-index: 9998;
            display: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .super-itck-popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.7);
            width: 80%;
            max-width: 600px;
            padding: 20px;
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid black;
            border-radius: 12px;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            display: none;
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
        }

        .super-itck-popup.open {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }

        .super-itck-popup .close-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            cursor: pointer;
            font-size: 24px;
            font-weight: bold;
            color: red;
            transition: color 0.3s ease;
        }

        .super-itck-popup .close-btn:hover {
            color: #ff4c4c;
        }

        .super-itck-popup .content {
            padding-top: 20px;
            font-size: 20px;
        }

        .dont-show-again {
            display: flex;
            align-items: center;
            font-size: 12px;
            color: #555;
            margin-top: 10px;
        }

        .dont-show-again input[type="checkbox"] {
            margin-right: 5px;
        }

        .dont-show-again label {
            cursor: pointer;
            color: #777;
        }

        .dont-show-again label:hover {
            color: #000;
        }

        `;
        document.head.appendChild(style);


        const overlay = document.createElement('div');
        overlay.className = 'super-itck-popup-overlay';
        document.body.appendChild(overlay);

        const popup = document.createElement('div');
        popup.className = 'super-itck-popup';
        popup.innerHTML = `
        <span class="close-btn">&times;</span>
        <div class="content">
          ${DINO_TRANSLATE('welcome')}
          <div class="dont-show-again">
            <label>
              <input type="checkbox" id="hidePopupCheckbox">
              ${DINO_TRANSLATE('dontShowAgain')}
            </label>
          </div>
        </div>
        `;

        document.body.appendChild(popup);

        async function openPopup() {
            if (await GM_getValue('hidePopup') === 'true') {
                toggleMenuPopup();
                return;
            }

            overlay.style.display = 'block';
            popup.style.display = 'block';
            setTimeout(() => {
                overlay.style.opacity = '1';
                popup.classList.add('open');
            }, 10);
        }

        async function closePopup() {
            popup.classList.remove('open');
            overlay.style.opacity = '0';

            const hidePopup = document.getElementById('hidePopupCheckbox').checked;
            if (hidePopup) {
                await GM_setValue('hidePopup', 'true');
            }

            setTimeout(() => {
                overlay.style.display = 'none';
                popup.style.display = 'none';
                toggleMenuPopup();
            }, 300);
        }

        popup.querySelector('.close-btn').addEventListener('click', closePopup);
        openPopup();




        const styleZoom = document.createElement('style');
        styleZoom.textContent = `
            .dz-frame{
                width:100%;
                display:flex; flex-direction:column;
                justify-content:center; align-items:center;
                overflow:visible; margin:0; padding:0;
            }
            .dz-stage{ position:relative; display:block; overflow:visible; }
            .runner-canvas{ image-rendering:crisp-edges; image-rendering:pixelated; }

            .dz-controls{
                position:relative;
                display:flex; justify-content:center; align-items:center; gap:12px;
                margin:10px 0; padding:6px 8px; width:max-content; user-select:none;
                background:rgba(255,255,255,0.9); border:1px solid rgba(0,0,0,0.08);
                border-radius:12px; box-shadow:0 6px 18px rgba(0,0,0,0.12);
                font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;
                z-index:999;
                padding-right: 52px;
            }
            .dz-divider{
                width:1px; height:28px; background:rgba(15,17,21,0.18);
                border-radius:999px;
            }
            .dz-btn{
                width:36px; height:36px; border:0; border-radius:999px; cursor:pointer;
                font-size:18px; font-weight:800; line-height:1; background:#0f1115; color:#fff;
                display:grid; place-items:center; transition:transform .08s ease, opacity .15s ease, box-shadow .15s ease;
                box-shadow:0 2px 8px rgba(0,0,0,.25);
            }
            .dz-btn-close{
                position:absolute;
                top:4px; right:6px;
                transform: none;
                width:20px; height:20px;
                border-radius:0;
                background: transparent !important;
                color:#e04845;
                border:none;
                outline:none;
                appearance:none;
                box-shadow:none;
                padding:0;
                display:inline-flex; align-items:center; justify-content:center;
                cursor:pointer;
                transition: color 0.15s ease, opacity 0.15s ease;
            }
            .dz-btn-close:hover{ color:#ff4c4c; }
            .dz-btn-close:active{ opacity:0.9; }
            .dz-btn-close:focus{ outline:none; }
            .dz-btn-close svg{ width:18px; height:18px; }
            .dz-btn-pause {
            background: #1e3a8a;
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 8px;
            width: 36px;
            height: 36px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: #fff;
            transition:
                background 0.25s ease,
                box-shadow 0.25s ease,
                transform 0.2s ease,
                opacity 0.2s ease;
            }

            .dz-btn-pause:hover {
            background: #2541a0;
            box-shadow: 0 2px 6px rgba(30, 58, 138, 0.4);
            transform: translateY(-1px);
            }

            .dz-btn-pause:active {
            background: #1b3282;
            box-shadow: none;
            transform: translateY(0);
            opacity: 0.95;
            }

            .dz-btn-pause svg {
            width: 20px;
            height: 20px;
            fill: currentColor;
            transition: transform 0.2s ease, opacity 0.15s ease;
            }

            .dz-btn-pause:hover svg {
            transform: scale(1.05);
            }

            .dz-btn-pause:active svg {
            transform: scale(0.95);
            }

            .dz-btn-fade {
            opacity: 0.5;
            transition: opacity 0.15s ease;
            }


            `;
        document.head.appendChild(styleZoom);

        const waitFor = (sel, root = document) => new Promise(res => {
            const hit = root.querySelector(sel); if (hit) return res(hit);
            const mo = new MutationObserver(() => {
                const el = root.querySelector(sel); if (el) { mo.disconnect(); res(el); }
            });
            mo.observe(root, { childList: true, subtree: true });
        });
        const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

        let frame, stage, controls, runner, canvas;

        function updateToolbarVisibility() {
            try {
                const allCtrls = document.querySelectorAll('.dz-controls');
                allCtrls.forEach(c => {
                    c.style.display = isToolbarVisible ? 'flex' : 'none';
                });
            } catch (_) { }
        }
        function dedupeZoomUI() {
            try {
                const allFrames = document.querySelectorAll('.dz-frame');
                allFrames.forEach(f => {
                    if (frame && f !== frame) {
                        f.remove();
                    }
                });
                const allCtrls = document.querySelectorAll('.dz-controls');
                allCtrls.forEach(c => {
                    if (!frame || c.closest('.dz-frame') !== frame) {
                        c.remove();
                    }
                });
            } catch (_) { }
        }
        let baseW = 600, baseH = 150;
        let scale = 1;
        let MIN = 0.5, MAX = 3;
        const step = 1.1;
        let preFSScale = null;
        let bodyBgColorCached = '';

        function computeBounds() {
            const marginX = 32;
            const marginY = 120;

            const availW = (window.innerWidth || document.documentElement.clientWidth) - marginX * 2;
            const availH = (window.innerHeight || document.documentElement.clientHeight) - marginY * 2;

            const maxByW = availW / baseW;
            const maxByH = availH / baseH;

            const hardCap = 3;
            const rawMax = clamp(Math.min(maxByW, maxByH), 0.5, hardCap);

            MAX = rawMax / step;

            const minByW = 300 / baseW;
            const minByH = 120 / baseH;
            MIN = clamp(Math.max(minByW, minByH), 0.3, 1);

            if (!sessionStorage.getItem('dzScale')) {
                scale = MIN;
            }
        }

        function ensureScaffold() {
            if (!runner) return;

            if (!frame || !frame.isConnected) {
                frame = document.createElement('div');
                frame.className = 'dz-frame';
                runner.parentNode.insertBefore(frame, runner);
            }
            if (!stage || !stage.isConnected) {
                stage = document.createElement('div');
                stage.className = 'dz-stage';
                frame.appendChild(stage);
            }
            if (runner.parentElement !== stage) {
                stage.appendChild(runner);
            }

            if (!controls || !controls.isConnected) {
                const existing = frame.querySelector('.dz-controls');
                if (existing) {
                    controls = existing;
                } else {
                    document.querySelectorAll('.dz-controls').forEach(c => { if (!frame.contains(c)) c.remove(); });
                    controls = document.createElement('div');
                    controls.className = 'dz-controls';
                    controls.innerHTML = `
                    <button class="dz-btn" data-act="out" title="${DINO_TRANSLATE('zoom_out')}">–</button>
                    <button class="dz-btn" data-act="in" title="${DINO_TRANSLATE('zoom_in')}">+</button>
                    <button class="dz-btn" data-act="fullscreen" title="${DINO_TRANSLATE('fullscreen')}">⛶</button>
                    <span class="dz-divider" aria-hidden="true"></span>
                    <button class="dz-btn dz-btn-pause" data-act="pause" title="${DINO_TRANSLATE('pause_resume')}">
                        <svg class="dz-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M8 5h3v14H8zm5 0h3v14h-3z"/>
                        </svg>
                    </button>

                    <button class="dz-btn dz-btn-close" data-act="close" title="${DINO_TRANSLATE('close_bar')}">
                        <svg class="dz-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>


                        `;
                    frame.insertBefore(controls, stage);
                    updateToolbarVisibility();
                    controls.addEventListener('click', (e) => {
                        const b = e.target.closest('.dz-btn');
                        if (!b) return;

                        if (b.dataset.act === 'in') zoomIn();
                        else if (b.dataset.act === 'out') zoomOut();
                        else if (b.dataset.act === 'fullscreen') toggleFullscreen();
                        else if (b.dataset.act === 'pause' && typeof window.togglePause === 'function') window.togglePause();
                        else if (b.dataset.act === 'close') {
                            isToolbarVisible = false;
                            try {
                                if (typeof GM_setValue !== 'undefined') {
                                    GM_setValue('toolbarVisible', isToolbarVisible);
                                }
                            } catch (_) { }
                            try {
                                if (typeof setMenuCheckboxState === 'function') {
                                    setMenuCheckboxState('toggleToolbar', false);
                                }
                            } catch (_) { }
                            updateToolbarVisibility();
                        }

                        b.blur();
                    });
                }
            }
            dedupeZoomUI();
        }



        function captureBase() {
            const r = runner.getBoundingClientRect();
            baseW = (r.width || runner.offsetWidth || baseW);
            baseH = (r.height || runner.offsetHeight || baseH);
            computeBounds();
        }

        function centerRunner() {
            runner.style.position = 'absolute';
            runner.style.left = '50%';
            runner.style.top = '0';
            runner.style.transformOrigin = '50% 0%';
        }

        function apply() {
            if (!runner || !stage) return;

            const isChromeDino = /chromedino/i.test(location.hostname) || location.href.includes('chrome://dino');

            const effectiveMAX = isChromeDino ? MAX : MAX * step;
            scale = clamp(scale, MIN, effectiveMAX);

            stage.style.width = `${baseW * scale}px`;
            stage.style.height = `${baseH * scale}px`;
            runner.style.willChange = 'transform';
            runner.style.transform = `translateX(-50%) scale(${scale})`;

            const plus = controls?.querySelector('[data-act="in"]');
            const minus = controls?.querySelector('[data-act="out"]');

            if (plus) plus.style.opacity = (effectiveMAX - scale) < 0.02 ? 0.55 : 1;
            if (minus) minus.style.opacity = (scale - MIN) < 0.02 ? 0.55 : 1;

            sessionStorage.setItem('dzScale', String(scale));
        }

        function zoomIn() { scale = clamp(scale * step, MIN, MAX * (/chromedino/i.test(location.hostname) ? 1 : step)); apply(); }
        function zoomOut() { scale = clamp(scale / step, MIN, MAX); apply(); }
        function resetZoom() { scale = clamp(1, MIN, MAX); apply(); }




        let prevHtmlBg = '', prevBodyBg = '', prevFrameBg = '';

        function getPageBg() {
            const b = getComputedStyle(document.body).backgroundColor;
            if (b && b !== 'rgba(0, 0, 0, 0)' && b !== 'transparent') return b;
            const h = getComputedStyle(document.documentElement).backgroundColor;
            if (h && h !== 'rgba(0, 0, 0, 0)' && h !== 'transparent') return h;
            return '#fff';
        }

        function toggleFullscreen() {
            const bg = getPageBg();

            if (!document.fullscreenElement) {
                preFSScale = scale;

                prevHtmlBg = document.documentElement.style.backgroundColor || '';
                prevBodyBg = document.body.style.backgroundColor || '';
                prevFrameBg = frame.style.backgroundColor || '';

                document.documentElement.style.setProperty('--dz-bg', bg);
                document.documentElement.style.backgroundColor = bg;
                document.body.style.backgroundColor = bg;
                frame.style.backgroundColor = bg;
                frame.classList.add('dz-fullscreen');

                frame.requestFullscreen?.();
            } else {
                document.exitFullscreen?.();
            }
        }

        document.addEventListener('fullscreenchange', () => {
            computeBounds();

            const isChromeDino = /chromedino/i.test(location.hostname) || location.href.includes('chrome://dino');
            const extraZoom = isChromeDino ? 1 : step;

            if (document.fullscreenElement) {
                scale = clamp(MAX * extraZoom, MIN, MAX * extraZoom);
                apply();
            } else {
                document.documentElement.style.backgroundColor = prevHtmlBg;
                document.body.style.backgroundColor = prevBodyBg;
                frame.style.backgroundColor = prevFrameBg;
                frame.classList.remove('dz-fullscreen');

                if (preFSScale != null) scale = clamp(preFSScale, MIN, MAX);
                preFSScale = null;
                apply();
            }
        });


        function bindCanvas() {
            if (!canvas) return;
            canvas.addEventListener('dblclick', resetZoom, { passive: true });
        }

        const rewire = () => {
            const newCanvas = document.querySelector('.runner-canvas');
            const newRunner = newCanvas ? (newCanvas.closest('.runner-container') || newCanvas.parentElement) : null;
            if (newRunner && newRunner !== runner) {
                runner = newRunner; canvas = newCanvas;
                ensureScaffold(); centerRunner(); captureBase(); bindCanvas();
                requestAnimationFrame(() => requestAnimationFrame(apply));
                dedupeZoomUI();
            }
            if (frame && !frame.contains(controls)) {
                document.querySelectorAll('.dz-controls').forEach(c => { if (!frame.contains(c)) c.remove(); });
                controls = null; ensureScaffold(); apply(); dedupeZoomUI();
            }
        };

        const mo = new MutationObserver(() => rewire());
        mo.observe(document, { childList: true, subtree: true });

        window.addEventListener('keydown', e => {
            if (e.code === 'Space' || e.code === 'Enter') {
                setTimeout(rewire, 50);
                setTimeout(apply, 80);
            }
        }, { capture: true });

        window.addEventListener('resize', () => { computeBounds(); apply(); });
        document.addEventListener('visibilitychange', () => { if (!document.hidden) { rewire(); apply(); } });
        window.addEventListener('pageshow', () => { rewire(); apply(); });

        (async function boot() {
            canvas = await waitFor('.runner-canvas');
            runner = canvas.closest('.runner-container') || canvas.parentElement;
            ensureScaffold(); centerRunner(); captureBase(); bindCanvas();
            applyTheme(currentTheme);
            requestAnimationFrame(() => requestAnimationFrame(apply));
        })();







        document.addEventListener('keydown', function (event) {
            if (event.key === 'v' && isShortcutEnabled) {
                const userInput = prompt(DINO_TRANSLATE('chooseSpeed'));
                const speed = parseFloat(userInput);
                if (!isNaN(speed)) {
                    Runner.instance_.setSpeed(speed);
                    const speedInputEl = getMenuElementById('speedInput');
                    if (speedInputEl) {
                        speedInputEl.value = speed;
                    }
                } else {
                    alert(DINO_TRANSLATE('invalidSpeed'));
                }
            }
        });


        let isWalkingInTheAir = false;


        document.addEventListener('keydown', function (event) {
            if (event.key === 'a' && isShortcutEnabled) {

                if (isWalkingInTheAir) {
                    Runner.instance_.tRex.groundYPos = 93;
                    updateButtonText(DINO_TRANSLATE('theAir'));
                    touche('ArrowUp');
                } else {
                    Runner.instance_.tRex.groundYPos = 0;
                    updateButtonText(DINO_TRANSLATE('theGround'));
                    touche('ArrowUp');
                }

                isWalkingInTheAir = !isWalkingInTheAir;
            }
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'k' && isShortcutEnabled) {
                const userInput = prompt(DINO_TRANSLATE('enterNewScore'));
                const newScore = parseInt(userInput, 10);
                if (!isNaN(newScore) && Number.isInteger(newScore) && newScore < 999990) {
                    Runner.instance_.distanceRan = newScore / Runner.instance_.distanceMeter.config.COEFFICIENT;
                    const scoreInputEl = getMenuElementById('scoreInput');
                    if (scoreInputEl) {
                        scoreInputEl.value = newScore;
                    }
                } else {
                    alert(DINO_TRANSLATE('invalidIntegerScore'));
                }
            }
        });


        document.addEventListener('keydown', function (event) {
            if (event.key === 's' && isShortcutEnabled) {
                injectDistanceCode();
            }
        });
    }
})();
