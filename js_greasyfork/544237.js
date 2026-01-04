// ==UserScript==
// @name         Gitlab, open file in PhpStorm
// @namespace    micoli.phpstorm.openlinks
// @version      1.0
// @description  Adds a button to open files in PhpStorm from GitLab merge requests
// @author       Youval Teboul
// @match        https://gitlab.com/*
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/544237/Gitlab%2C%20open%20file%20in%20PhpStorm.user.js
// @updateURL https://update.greasyfork.org/scripts/544237/Gitlab%2C%20open%20file%20in%20PhpStorm.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let config = {};
    const PROJECT_KEY = getGitlabProjectName();

    function getGitlabProjectName() {
        const breadcrumbLinks = document.querySelectorAll(
            'nav.gl-breadcrumbs .gl-breadcrumb-list .gl-breadcrumb-item a'
        );
        if (breadcrumbLinks.length > 1) {
            // Prend le texte du deuxième élément
            return breadcrumbLinks[1].textContent.trim();
        }

        return '';
    }

    function loadPreferences() {
        try {
            config = JSON.parse(window.localStorage.getItem('openInPhpStormSettings')) || {};
        } catch {
            config = {};
        }
    }

    function savePreferences() {
        window.localStorage.setItem('openInPhpStormSettings', JSON.stringify(config));
    }

    function getProjectPath() {
        return config[PROJECT_KEY];
    }

    function createIcon() {
        return `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 96 96" id="Phpstorm--Streamline-Svg-Logos" height="20" width="20" style="width: 20px; height: 20px;">
  <desc>
    Phpstorm Streamline Icon: https://streamlinehq.com
  </desc>
  <path fill="url(#a)" d="M52.886 17.5283 49.7527 8.05 17.0388 1 1 19.144l17.625 9.0181V17.5283h34.261Z"></path>
  <path fill="url(#b)" d="M18.625 23.6977 1 19.1445l8.95937 53.815 8.63623-.0685.0294-49.1933Z"></path>
  <path fill="url(#c)" d="M77.375 17.5281H46.7173L59.0352 6.58105l23.735 4.40625L95 41.3806 77.3848 58.8783l-.0098-41.3502Z"></path>
  <path fill="url(#d)" d="m77.395 40.9795-.0196 35.299H26.9092l1.3023 7.6766 31.6858 11.045 35.1031-21.0129L77.395 40.9795Z"></path>
  <path fill="#000000" d="M18.2578 17.0723h59.4844v59.4843H18.2578V17.0723Z"></path>
  <path fill="#ffffff" d="M25.9487 65.2917H47.98v3.6719H25.9487v-3.6719ZM45.16 43.9458l2.8689-3.525c1.8022 1.6643 4.1474 2.6177 6.5996 2.683 1.9584 0 3.1921-.7932 3.1921-2.0857v-.0587c0-.5007-.1258-.903-.5219-1.2671l-.0891-.0775c-.0622-.0512-.1301-.1018-.2042-.1519l-.1158-.0748c-.0603-.0372-.1241-.0741-.1917-.1109l-.1403-.0734c-.0242-.0122-.0489-.0244-.074-.0366l-.1558-.073c-.0538-.0243-.1093-.0486-.1667-.0728l-.1778-.0729c-.0306-.0122-.0616-.0243-.0932-.0365l-.195-.0731c-.0335-.0123-.0675-.0245-.102-.0367l-.2131-.0738c-.0365-.0123-.0736-.0246-.1111-.037l-.2318-.0746-.2446-.0753-.2578-.0762c-.0441-.0128-.0887-.0256-.1339-.0385l-.2782-.0777-.2921-.079-.8958-.2325-.2814-.075-.4133-.114c-.0453-.0127-.0904-.0256-.1354-.0384l-.267-.0779-.2622-.0791c-.0433-.0133-.0863-.0267-.1292-.0401l-.2546-.0815-.2494-.0832c-.0412-.0141-.0821-.0282-.1228-.0424l-.2416-.0863-.2363-.0885c-.039-.0149-.0777-.03-.1162-.0452l-.2281-.0922-.2226-.095c-2.3083-1.0124-3.6897-2.5067-3.7324-5.4639l-.001-.2105c0-3.9626 3.154-6.6023 7.5933-6.6575l.1422-.0008c2.9797-.0527 5.8835.9418 8.2054 2.8102l-2.5263 3.662c-1.6507-1.2913-3.6555-2.0495-5.7477-2.1737-1.8604 0-2.8396.8519-2.8396 1.9583v.0686c0 .8191.3128 1.3379 1.2691 1.811l.1522.0724c.0525.0241.1067.048.1627.072l.1733.0716.1844.0715.1955.0716.207.072.2188.0724.2308.0732.2431.0741.3882.1134.4175.1166.4475.1205.4785.1252c.1055.0276.2099.0555.3133.0837l.3067.0852c.1012.0287.2012.0577.3002.087l.2935.0888c.0484.015.0964.03.1442.0451l.2835.0919.2767.0941c.1367.0476.2708.0961.4024.1456l.2596.1002c2.8184 1.1171 4.3836 2.7253 4.4297 5.6724l.001.2035c0 4.3866-3.3487 6.8543-8.1173 6.8543-3.4517.0125-6.7873-1.2457-9.3706-3.535ZM25.9683 24.9892h9.0083c5.1959 0 8.3668 3.0518 8.4297 7.4737l.001.1932c0 5.0916-3.9657 7.7354-8.9007 7.7354h-3.6425v6.5996h-4.8958V24.9892Zm8.6754 11.0939c2.4186 0 3.8384-1.4393 3.8384-3.3291v-.0588c0-2.1737-1.508-3.3389-3.9167-3.3389h-3.7013v6.7268h3.7796Z"></path>
  <defs>
    <linearGradient id="a" x1="2086.63" x2="2421.3" y1="1740.95" y2="1072.01" gradientUnits="userSpaceOnUse">
      <stop stop-color="#af1df5"></stop>
      <stop offset=".21" stop-color="#bc20e4"></stop>
      <stop offset=".63" stop-color="#dd29b8"></stop>
      <stop offset="1" stop-color="#ff318c"></stop>
    </linearGradient>
    <linearGradient id="b" x1="756.846" x2="3029.1" y1="4249.14" y2="1247.44" gradientUnits="userSpaceOnUse">
      <stop offset=".02" stop-color="#6b57ff"></stop>
      <stop offset=".42" stop-color="#b74af7"></stop>
      <stop offset=".75" stop-color="#ff318c"></stop>
    </linearGradient>
    <linearGradient id="c" x1="3583.81" x2="1301.47" y1="5351.85" y2="-62.967" gradientUnits="userSpaceOnUse">
      <stop stop-color="#293896"></stop>
      <stop offset=".08" stop-color="#3b3aa2"></stop>
      <stop offset=".29" stop-color="#6740c0"></stop>
      <stop offset=".49" stop-color="#8a44d8"></stop>
      <stop offset=".68" stop-color="#a347e9"></stop>
      <stop offset=".86" stop-color="#b249f3"></stop>
      <stop offset="1" stop-color="#b74af7"></stop>
    </linearGradient>
    <linearGradient id="d" x1="4307.83" x2="3131.39" y1="3954.58" y2="2230.9" gradientUnits="userSpaceOnUse">
      <stop offset=".02" stop-color="#6b57ff"></stop>
      <stop offset=".78" stop-color="#b74af7"></stop>
    </linearGradient>
  </defs>
</svg>`;
    }

    function openInPhpStorm(fileRelativePath) {
        const path = getProjectPath() + fileRelativePath;
        const url = `phpstorm://open?file=${encodeURIComponent(path)}`;
        window.open(url, '_blank');
    }

    function addPhpStormButtons() {
        document.querySelectorAll('.diff-file').forEach(diffFile => {
            diffFile.querySelectorAll('button[data-testid="diff-file-copy-clipboard"]').forEach(buttonClipboard => {
                const fileUrl = JSON.parse(buttonClipboard.getAttribute('data-clipboard-text')).text;

                // prevent duplicate button
                if (diffFile.querySelector(`.js-edit-in-phpstorm[data-link="${fileUrl}"]`)) return;

                const button = document.createElement('span');
                button.className = 'js-edit-in-phpstorm';
                button.title = 'Edit file in PhpStorm';
                button.dataset.link = fileUrl;
                button.innerHTML = createIcon();
                button.style.marginTop = '-6px';
                button.style.padding = '0';
                button.onclick = () => openInPhpStorm(fileUrl);

                buttonClipboard.insertAdjacentElement('afterend', button);
            });
        });
    }

    function cleanOldButtons() {
        document.querySelectorAll('.js-edit-in-phpstorm').forEach(btn => {
            if (!btn.parentNode.querySelector('button[data-testid="diff-file-copy-clipboard"]')) {
                btn.remove();
            }
        });
    }

    function setupConfigUI() {
        const html = `
            <div id="phpstorm-settings" style="display:none; background:#fff; padding:10px; border:1px solid #ccc; border-radius: .5rem; position:fixed; top:60px; right:40px; z-index:9999; width: 350px;">
                <div class="form-group">
                    <label for="merge_request_title">Project local path</label>
                    <div data-testid="issue-title-input-field">
                        <input class="form-control" type="text" value="${getProjectPath()}" id="phpstorm-path">
                    </div>
                 </div>
                <button id="phpstorm-save" class="btn btn-confirm btn-md gl-button">Sauvegarder</button>
                <button id="phpstorm-close" class="btn btn-default btn-md gl-button">Fermer</button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);

        const menu = document.querySelector('#disclosure-40 > li.gl-border-t.gl-border-t-dropdown-divider.gl-pt-2.gl-mt-2 > ul');
        if (menu) {
            const li = document.createElement('li');
            li.classList.add('gl-new-dropdown-item');
            li.innerHTML = `<button id="phpstorm-settings-open" type="button" class="gl-new-dropdown-item-content">
                <span class="gl-new-dropdown-item-text-wrapper">
                    <svg data-testid="settings-icon" role="img" aria-hidden="true" class="super-sidebar-nav-item-icon gl-m-auto gl-icon s16 gl-fill-current"><use href="/assets/icons-aa2c8ddf99d22b77153ca2bb092a23889c12c597fc8b8de94b0f730eb53513f6.svg#settings"></use></svg>
                    Config PhpStorm
                </span>
            </button>`;
            menu.appendChild(li);
            document.getElementById('phpstorm-settings-open').onclick = (e) => {
                e.preventDefault();
                document.getElementById('phpstorm-settings').style.display = 'block';
            };
        }

        document.getElementById('phpstorm-save').onclick = function () {
            const value = document.getElementById('phpstorm-path').value;
            config[PROJECT_KEY] = value;
            savePreferences();
            document.getElementById('phpstorm-settings').style.display = 'none';
        };
        document.getElementById('phpstorm-close').onclick = function () {
            document.getElementById('phpstorm-settings').style.display = 'none';
        };
    }

    loadPreferences();
    addPhpStormButtons();
    //cleanOldButtons();
    setInterval(() => {
        addPhpStormButtons();
        //cleanOldButtons();
    }, 1500);
    setTimeout(setupConfigUI, 800);

})();
