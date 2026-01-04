// ==UserScript==
// @name         iMSteam Plus
// @version      0.1
// @description  Modified version of iMSteam, which adds other sites\trackers and more.
// @author       iMAboud. Mod by Ner_Kun
// @license MIT
// @match        https://store.steampowered.com/*
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/1302606
// @downloadURL https://update.greasyfork.org/scripts/495171/iMSteam%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/495171/iMSteam%20Plus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const sites = [
        {name: "Online Fix", url: "https://online-fix.me/index.php?do=search&subaction=search&story={SearchGameName}", icon: "https://i.imgur.com/WAXRAUw.png"},
        {name: "Skidrow", url: "https://www.skidrowreloaded.com/?s={SearchGameName}", icon: "https://i.imgur.com/sfzB2DE.png"},
        {name: "FitGirl", url: "https://fitgirl-repacks.site/?s={SearchGameName}", icon: "https://i.imgur.com/GOFbweI.png"},
        {name: "SteamRIP", url: "https://steamrip.com/?s={SearchGameName}", icon: "https://i.imgur.com/tmvOT86.png"},
        {name: "Dodi", url: "https://dodi-repacks.site/?s={SearchGameName}", icon: "https://i.imgur.com/g71t1Ge.png"},
        {name: "Gload", url: "https://gload.to/?s={SearchGameName}", icon: "https://gload.to/logo.png"},
        {name: "GOG", url: "https://www.gog-games.to/search/{SearchGameName}", icon: "https://i.imgur.com/wXfz72C.png"},
        {name: "Crack Status", url: "https://crackstatus.net/tracker.php?nm={SearchGameName}", icon: "https://crackstatus.net/styles/templates/default/images/Hot_icons/rel/PNL2.png"},
        {name: "RuTracker", url: "https://rutracker.org/forum/tracker.php?nm={SearchGameName}", icon: "https://i.imgur.com/FUojuvE.png"},
        {name: "1377x", url: "https://www.1377x.to/category-search/{SearchGameName}/Games/1/", icon: "https://www.1377x.to/images/logo.svg"},
        {name: "VseTop", url: "https://vsetop.org/index.php?do=search&subaction=search&search_start=0&full_search=1&story={SearchGameName}", icon: "https://vsetop.org/templates/vsetop/images/logo3.gif"},
        {name: "HowLongToBeat", url: "https://howlongtobeat.com/?q={SearchGameName}", icon: "https://howlongtobeat.com/img/icons/apple-touch-icon-72x72.png"},
        {name: "Toloka", url: "https://toloka.to/tracker.php?nm={SearchGameName}", icon: "https://toloka.to/templates/Saphic/images/left-overlay_13.png"},
        {name: "Іsland of pleasure", url: "https://island-of-pleasure.site/search/{SearchGameName}", icon: "https://island-of-pleasure.site/templates/flat-cinema/images/logo.png"},
        {name: "f95zone", url: "https://f95zone.to/search/?q={SearchGameName}&o=relevance", icon: "https://f95zone.to/assets/logo.png"}
    ];
    const translations = {
        en: {
            settings: "Settings",
            selectSites: "Select Sites to Display",
            language: "Language",
            english: "English",
            ukrainian: "Українська",
            save: "Save",
            default: "Default",
            searchOn: "Search on"
        },
        uk: {
            settings: "Налаштування",
            selectSites: "Виберіть сайти для відображення",
            language: "Мова",
            english: "Англійська",
            ukrainian: "Українська",
            save: "Зберегти",
            default: "За замовчуванням",
            searchOn: "Пошук на"
        }
    };

    let lang = localStorage.getItem('language') || (navigator.language.startsWith('uk') ? 'uk' : 'en');

    function t(key) {
        return translations[lang][key] || key;
    }

    function createButton(site, gameName) {
        const gameNameElement = document.getElementById("appHubAppName");
        if (gameNameElement) {
            const linkButton = document.createElement("a");
            const searchURL = site.url.replace('{SearchGameName}', encodeURIComponent(gameName));
            linkButton.href = searchURL;
            linkButton.setAttribute("target", "_blank");
            linkButton.title = `${t('searchOn')} ${site.name}`;
            linkButton.style.display = 'inline-block';
            linkButton.style.marginRight = '10px';
            linkButton.style.position = 'relative';

            const img = new Image();
            img.src = site.icon;
            img.alt = site.name;
            img.style.width = '64px';
            img.style.height = '32px';
            img.style.objectFit = 'contain';
            img.style.transition = 'transform 0.3s ease-in-out, filter 0.3s ease-in-out';
            img.style.borderRadius = '8px';
            img.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.3)';
            img.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';

            linkButton.appendChild(img);
            gameNameElement.parentNode.appendChild(linkButton);


            linkButton.addEventListener('mouseenter', () => {
                img.style.transform = 'scale(1.1)';
            });
            linkButton.addEventListener('mouseleave', () => {
                img.style.transform = 'scale(1)';
            });
        }
    }

    function saveChanges() {
        sites.forEach(site => {
            const checkbox = document.querySelector(`input[name="${site.name}"]`);
            if (checkbox) {
                localStorage.setItem(site.name, checkbox.checked);
            }
        });
        localStorage.setItem('language', lang);
        location.reload();
    }

    function createSettingsButton() {
        const gameNameElement = document.getElementById("appHubAppName");
        if (gameNameElement) {
            const settingsLink = document.createElement("a");
            settingsLink.href = "#";
            settingsLink.setAttribute("target", "_self");
            settingsLink.title = t('settings');
            settingsLink.style.display = 'inline-block';
            settingsLink.style.marginRight = '10px';
            settingsLink.style.position = 'relative';

            const img = new Image();
            img.src = "https://i.imgur.com/Hur3rSd.png";
            img.alt = t('settings');
            img.style.width = '64px';
            img.style.height = '32px';
            img.style.objectFit = 'contain';
            img.style.transition = 'transform 0.3s ease-in-out, filter 0.3s ease-in-out';
            img.style.borderRadius = '8px';
            img.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.3)';
            img.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
            img.style.filter = 'brightness(1.5)';

            settingsLink.appendChild(img);
            settingsLink.onclick = function(e) {
                e.preventDefault();
                const panel = document.getElementById("settingsPanel");
                if (panel) {
                    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
                }
            };
            gameNameElement.parentNode.appendChild(settingsLink);

            settingsLink.addEventListener('mouseenter', () => {
                img.style.transform = 'scale(1.1)';
            });
            settingsLink.addEventListener('mouseleave', () => {
                img.style.transform = 'scale(1)';
            });
        }
    }

    function createSettingsPanel() {
        const panel = document.createElement("div");
        panel.id = "settingsPanel";
        panel.style.display = 'none';
        panel.style.position = 'fixed';
        panel.style.top = '20px';
        panel.style.right = '20px';
        panel.style.backgroundColor = '#222';
        panel.style.border = '1px solid #555';
        panel.style.padding = '10px';
        panel.style.zIndex = '1000';
        panel.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        panel.style.borderRadius = '10px';

        const title = document.createElement("h3");
        title.textContent = t('selectSites');
        title.style.color = '#fff';
        panel.appendChild(title);

        sites.forEach(site => {
            const label = document.createElement("label");
            label.style.display = 'flex';
            label.style.alignItems = 'center';
            label.style.color = '#fff';

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = JSON.parse(localStorage.getItem(site.name) || 'true');
            checkbox.onchange = () => {
                localStorage.setItem(site.name, checkbox.checked);
            };

            const img = new Image();
            img.src = site.icon;
            img.alt = site.name;
            img.style.width = '32px';
            img.style.height = '16px';
            img.style.objectFit = 'contain';
            img.style.marginRight = '10px';


            label.appendChild(checkbox);
            label.appendChild(img);
            label.appendChild(document.createTextNode(site.name));
            panel.appendChild(label);
        });

        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.justifyContent = "space-between";
        buttonContainer.style.alignItems = "center";
        buttonContainer.style.marginTop = "10px";

        const saveButtonImg = document.createElement("img");
        saveButtonImg.src = "https://i.imgur.com/9OGoO5g.png";
        saveButtonImg.alt = t('save');
        saveButtonImg.title = t('save');
        saveButtonImg.style.cursor = 'pointer';
        saveButtonImg.onclick = saveChanges;

        const resetButtonImg = document.createElement("img");
        resetButtonImg.src = "https://i.imgur.com/7SzbgQs.png";
        resetButtonImg.alt = t('default');
        resetButtonImg.title = t('default');
        resetButtonImg.style.cursor = 'pointer';
        resetButtonImg.onclick = resetToDefault;

        const languageLabel = document.createElement("img");
        languageLabel.src = "https://i.imgur.com/N4yWJ9f.png";
        languageLabel.alt = t('language');
        languageLabel.title = t('language');
        languageLabel.style.cursor = 'pointer';
        languageLabel.style.margin = '0 10px';
        languageLabel.style.filter = 'brightness(10.5)';
        languageLabel.onclick = () => {
            const languageMenu = document.getElementById("languageMenu");
            if (languageMenu) {
                languageMenu.style.display = languageMenu.style.display === 'none' ? 'block' : 'none';
            }
        };

        const languageMenu = document.createElement("div");
        languageMenu.id = "languageMenu";
        languageMenu.style.display = 'none';
        languageMenu.style.position = 'absolute';
        languageMenu.style.top = '100%';
        languageMenu.style.right = '0';
        languageMenu.style.backgroundColor = '#222';
        languageMenu.style.border = '1px solid #555';
        languageMenu.style.padding = '10px';
        languageMenu.style.zIndex = '1000';
        languageMenu.style.borderRadius = '10px';

        const languageSelect = document.createElement("select");
        languageSelect.style.backgroundColor = '#333';
        languageSelect.style.color = '#fff';
        const enOption = document.createElement("option");
        enOption.value = "en";
        enOption.textContent = t('english');
        const ukOption = document.createElement("option");
        ukOption.value = "uk";
        ukOption.textContent = t('ukrainian');

        languageSelect.appendChild(enOption);
        languageSelect.appendChild(ukOption);

        languageSelect.value = lang;

        languageSelect.addEventListener("change", () => {
            lang = languageSelect.value;
            localStorage.setItem('language', lang);
        });

        languageMenu.appendChild(languageSelect);
        panel.appendChild(languageMenu);

        buttonContainer.appendChild(saveButtonImg);
        buttonContainer.appendChild(languageLabel);
        buttonContainer.appendChild(resetButtonImg);

        panel.appendChild(buttonContainer);

        document.body.appendChild(panel);
    }

    function resetToDefault() {
        sites.forEach(site => {
            localStorage.removeItem(site.name);
        });
        localStorage.removeItem('language');
        location.reload();
    }

    function init() {
        const gameNameElement = document.getElementById("appHubAppName");
        if (gameNameElement) {
            const gameName = gameNameElement.textContent.trim();

            sites.forEach(site => {
                const isEnabled = JSON.parse(localStorage.getItem(site.name) || 'true');
                if (isEnabled) {
                    createButton(site, gameName);
                }
            });

            createSettingsButton();
            createSettingsPanel();
        }
    }

    init();
})();
