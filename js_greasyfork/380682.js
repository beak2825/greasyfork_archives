// ==UserScript==
// @name         Typografická pomůcka Deníku N
// @namespace    http://tampermonkey.net/
// @version      3.6
// @description  Zabránění dvojitému ukládání do databáze
// @author       Ondřej Horník
// @match        https://denikn.cz/wp-admin/*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/380682/Typografick%C3%A1%20pom%C5%AFcka%20Den%C3%ADku%20N.user.js
// @updateURL https://update.greasyfork.org/scripts/380682/Typografick%C3%A1%20pom%C5%AFcka%20Den%C3%ADku%20N.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const $ = unsafeWindow.jQuery;
    const tinymce = unsafeWindow.tinymce;

    /**
     * =================================================================
     * KONFIGURACE
     * =================================================================
     */
    const CONFIG = {
        selectors: {
            mainContent: '#content', excerpt: '#excerpt', title: '#title', altTitle: '#acf-field__dn_remp_cabrio_title2',
            note: '#acf-field_dn_note', imgCaption: '#acf-field_dn_detail_thumbnail_caption', publishBtn: '#publish',
            mediaButtons: '#wp-content-media-buttons', displayName: '.display-name', charCount: '.char-count', datepicker: '.hasDatepicker',
            captionSingle: '#attachment-details-caption', captionGallery: '#attachment-details-two-column-caption',
            korektorBox: '.acf-field-dn-korektor', korektorDateBox: '.acf-field-dn-korektor-date',
            korektorFieldsToHide: ['.acf-field-dn-korektor-publish', '.acf-field-dn-korektor-off', '.acf-field-dn-korektor-paper', '.acf-field-dn-korektor-publish-after'],
            editorSelectTarget: '.acf-field-dn-korektor .acf-label', postQuerySubmit: '#post-query-submit',
            editLinks: 'span.edit a[href*="action=edit"]'
        },
        ids: {
            typoButton: 'dn-typo-button', captionTypoButton: 'dn-caption-typo-button', captionLicenseButton: 'dn-caption-license-button',
            captionLicenseList: 'dn-caption-license-list',
            gchatRequestDiv: 'dn-gchat-request-div', gchatRequestBtn: 'dn-gchat-request-btn',
            gchatNotifyDiv: 'dn-gchat-notify-div', gchatNotifyBtn: 'dn-gchat-notify-btn',
            editorSelect: 'dn-editor-select', waitingForProofBtn: 'dn-waiting-for-proof-btn',
            greyboxOverlay: 'dn-greybox-overlay', greyboxContainer: 'dn-greybox-container',
            airtableStatsDiv: 'dn-airtable-stats-div',
            greyboxClose: 'dn-greybox-close', greyboxProgress: 'dn-greybox-progress-bar', greyboxIframe: 'dn-greybox-iframe'
        },
        googleChat: {
            //webhookUrl: 'https://chat.googleapis.com/v1/spaces/AAQA7QnL3-4/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=8E7zyfzMCfJ29SDLKwoqh-XkZvpeigQxsZQXkmtQVsc' // Testovací prostor korkonátora
            webhookUrl: 'https://chat.googleapis.com/v1/spaces/AAQAkI5t9Gc/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=kn8-PtmS3TVEnolAICXi79n-fiqYBMVscEdXjfDKl30'
        },
        myServer: {
            apiUrl: 'https://enko.bezpochyb.cz/api/index.php', // Změňte na URL vašeho API
            apiKey: 'qzCm4XvG5nVIX44dxnV3SPnLDWTRwLz9' // Shodný s config.php
        },
        colors: { default: 'red', stamped: 'orange', done: 'green', blink: 'yellow', baseBorder: '#7e8993', licenseBtnBg: '#fae282', requestBtnBg: '#ec5b13', notifyBtnBg: '#6fbe41', waitingBtnColor: '#e14d43' },
        photoCredits: { 'gabo': ' Foto: Gabriel Kuchta, Deník N', 'ludvik': ' Foto: Ludvík Hradilek, Deník N' },
        licenses: {
            'blanklink': { text: 'PRÁZDNÝ ODKAZ', html: '<a href="ZDE VLOŽ ADRESU CÍLE ODKAZU">ZDE VLOŽ TEXT ODKAZU</a>' }, 'ccbync2': { text: 'CC BY-NC 2.0', html: '<a href="https://creativecommons.org/licenses/by-nc/2.0/legalcode">CC BY-NC 2.0</a>' },
            'ccby2': { text: 'CC BY 2.0', html: '<a href="https://creativecommons.org/licenses/by/2.0/legalcode">CC BY 2.0</a>' }, 'ccbysa2': { text: 'CC BY-SA 2.0', html: '<a href="https://creativecommons.org/licenses/by-sa/2.0/legalcode">CC BY-SA 2.0</a>' },
            'ccbyncnd2': { text: 'CC BY-NC-ND 2.0', html: '<a href="https://creativecommons.org/licenses/by-nc-nd/2.0/legalcode">CC BY-NC-ND 2.0</a>' }, 'ccbysa3': { text: 'CC BY-SA 3.0', html: '<a href="https://creativecommons.org/licenses/by-sa/3.0/legalcode">CC BY-SA 3.0</a>' },
            'ccby3': { text: 'CC BY 3.0', html: '<a href="https://creativecommons.org/licenses/by/3.0/legalcode">CC BY 3.0</a>' }, 'ccbysa4': { text: 'CC BY-SA 4.0', html: '<a href="https://creativecommons.org/licenses/by-sa/4.0/legalcode">CC BY-SA 4.0</a>' },
            'ccby4': { text: 'CC BY 4.0', html: '<a href="https://creativecommons.org/licenses/by/4.0/legalcode">CC BY 4.0</a>' }, 'ccbyncsa4': { text: 'CC BY-NC-SA 4.0', html: '<a href="https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode">Creative Commons – Attribution-NonCommercial-ShareAlike 4.0 International – CC BY-NC-SA 4.0</a>' },
        },
        // --- ZDE DOPLŇTE UŽIVATELSKÁ ID ---
        // Nahraďte "ID_UZIVATELE_X" reálnými ID uživatelů z Google Chatu.
        // ID zjistíte tak, že na uživatele v chatu kliknete pravým tlačítkem a zvolíte "Kopírovat odkaz".
        // ID je číselná část na konci odkazu. Např. pro "https://chat.google.com/u/0/dm/AbCdEf12345" je ID "AbCdEf12345".
        editors: {
            "Ondřej Horník": "116271831627383632035",
            "Barbora Němcová": "101111691819766318289",
            "Eva Mošpanová": "118398215520513693233",
            "Filip Titlbach": "107278747533721946010",
            "Filip Zajíček": "114199498459180175029",
            "Irena Hejdová": "118106765558162310736",
            "Jan Jiřička": "105910085624615995440",
            "Jan Kudláček": "101860049329160990021",
            "Jan Pavec": "110349952360238438243",
            "Jan Tvrdoň": "101166746778985167497",
            "Julie Lubojacká": "101959041125572240128",
            "Karolína Pláničková": "101985546322783612928",
            "Libor Stejskal": "107844037949260904080",
            "Lukáš Werner": "101135031069069700102",
            "Magdalena Slezáková": "103522276545480647541",
            "Michael Švec": "107454485925587702968",
            "Pavel Tomášek": "101097570083265404951",
            "Petr Koubský": "111616057844732711842",
            "Petra Bartošová": "102100505583717737400",
            "Regina Rieznerová": "117570636399822204095",
            "Štěpán Vojtěch": "110122772774770154286",
            "Tomáš Linhart": "117770638904026037214",
            "Tomáš Morvay": "107912188163405254654",
            "Václav Ferebauer": "116633384401835714573",
            "Vít Svoboda": "114756717413161082524"
        },
        editorList: [ "Ondřej Horník", "Barbora Němcová", "Eva Mošpanová", "Filip Titlbach", "Filip Zajíček", "Irena Hejdová", "Jan Jiřička", "Jan Kudláček", "Jan Pavec", "Jan Tvrdoň", "Julie Lubojacká", "Karolína Pláničková", "Libor Stejskal", "Lukáš Werner", "Magdalena Slezáková", "Michael Švec", "Pavel Tomášek", "Petr Koubský", "Petra Bartošová", "Regina Rieznerová", "Štěpán Vojtěch", "Tomáš Linhart", "Tomáš Morvay", "Václav Ferebauer", "Vít Svoboda"]
    };

    /**
     * =================================================================
     * GREYBOX PRO OVERLAY EDITACI
     * =================================================================
     */
    const GreyboxApp = {
        activeTrElement: null,
        init: function() {
            if (!document.body.classList.contains('post-type-dn_mpm')) return;
            this.ui.create();
            this.events.init();
        },
        ui: {
            create: function() {
                GM_addStyle(`
                    #${CONFIG.ids.greyboxOverlay} { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); z-index: 99998; display: none; justify-content: center; align-items: center; }
                    #${CONFIG.ids.greyboxContainer} { position: relative; background: #fdfdfd; width: 95%; max-width: 1800px; height: 90%; border-radius: 5px; box-shadow: 0 5px 15px rgba(0,0,0,0.5); display: flex; flex-direction: column; }
                    #${CONFIG.ids.greyboxClose} { position: absolute; top: -25px; right: -25px; width: 50px; height: 50px; background: #A33; color: white; border-radius: 50%; text-align: center; line-height: 50px; cursor: pointer; font-size: 32px; font-family: Arial, sans-serif; z-index: 99999; border: 2px solid white; }
                    #${CONFIG.ids.greyboxProgress} { position: absolute; top: 0; left: 0; width: 0%; height: 4px; background-color: #0073aa; transition: width 0.3s ease; z-index: 1; border-top-left-radius: 5px; }
                    #${CONFIG.ids.greyboxIframe} { width: 100%; height: 100%; border: none; border-radius: 5px; }
                    tr.recently-edited > td { background-color: #fffbe6 !important; transition: background-color 0.5s ease; }
                `);
                const overlay = document.createElement('div');
                overlay.id = CONFIG.ids.greyboxOverlay;
                overlay.innerHTML = `<div id="${CONFIG.ids.greyboxContainer}"><div id="${CONFIG.ids.greyboxClose}">&times;</div><div id="${CONFIG.ids.greyboxProgress}"></div><iframe id="${CONFIG.ids.greyboxIframe}"></iframe></div>`;
                document.body.appendChild(overlay);
            }
        },
        events: {
            init: function() {
                document.querySelectorAll(CONFIG.selectors.editLinks).forEach(link => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault(); e.stopPropagation();
                        const previouslyEdited = document.querySelector('tr.recently-edited');
                        if (previouslyEdited) previouslyEdited.classList.remove('recently-edited');
                        GreyboxApp.activeTrElement = link.closest('tr');
                        GreyboxApp.loadUrl(link.href);
                    });
                });
                const overlay = document.getElementById(CONFIG.ids.greyboxOverlay);
                const closeBtn = document.getElementById(CONFIG.ids.greyboxClose);
                closeBtn.addEventListener('click', () => this.hide());
                overlay.addEventListener('click', (e) => { if (e.target === overlay) this.hide(); });
            },
            hide: function() {
                const overlay = document.getElementById(CONFIG.ids.greyboxOverlay);
                const iframe = document.getElementById(CONFIG.ids.greyboxIframe);
                if (overlay) overlay.style.display = 'none';
                if (iframe) iframe.src = 'about:blank';
                if (GreyboxApp.activeTrElement) {
                    const elementToFade = GreyboxApp.activeTrElement;
                    elementToFade.classList.add('recently-edited');
                    setTimeout(() => {
                        elementToFade.classList.remove('recently-edited');
                    }, 2500);
                    GreyboxApp.activeTrElement = null;
                }
            }
        },
        loadUrl: function(url) {
            const overlay = document.getElementById(CONFIG.ids.greyboxOverlay), iframe = document.getElementById(CONFIG.ids.greyboxIframe), progressBar = document.getElementById(CONFIG.ids.greyboxProgress);
            overlay.style.display = 'flex';
            progressBar.style.width = '0%'; progressBar.style.display = 'block'; progressBar.style.backgroundColor = '#0073aa';
            iframe.src = url;
            GM_xmlhttpRequest({ method: 'GET', url: url, onprogress: (p) => { if (p.lengthComputable) progressBar.style.width = ((p.loaded / p.total) * 100) + '%'; }, onload: () => { progressBar.style.width = '100%'; setTimeout(() => { progressBar.style.display = 'none'; }, 500); }, onerror: () => { progressBar.style.backgroundColor = 'red'; } });
        }
    };

    /**
     * =================================================================
     * TYPOGRAFICKÁ POMŮCKA - KOMPLETNÍ IMPLEMENTACE
     * =================================================================
     */
    const TypoApp = {
        rules: (function() {
            const begin = String.raw`(?<![\[|<][^\]|>]*)`, end = String.raw`(?<![^\]|>]*[<|\[])`;
            return [
                [new RegExp(String.raw`(facebook.com\/(?!permalink\.php)(?!watch\/)[^\?\"\n]+)\?[^\"\n]+`, "gi"), "$1", 1], [new RegExp(String.raw`(https?:\/\/(www.)?(twitter|facebook|instagram).com\/[^"\n]+)$`, "gi"), "$1\n"],
                [new RegExp(String.raw`\<\!--more--\>([^\n])`), "<!--more-->\n$1", 1], [new RegExp(String.raw`\<\!--more--\>“`), "<!--more-->„", 1], [new RegExp(begin + String.raw`[  ]<\/a>` + end, "g"), "</a> "],
                [new RegExp(begin + String.raw` `, "g"), " "], [new RegExp(begin + String.raw` +`, "g"), " "], [new RegExp(begin + String.raw` +`, "g"), " "], [new RegExp(begin + String.raw`​+`, "g"), ""],
                [new RegExp(begin + String.raw`( | ){2,}` + end, "g"), "$1"], [new RegExp(begin + String.raw`\n[  ]+` + end, "g"), "\n"], [new RegExp(begin + String.raw`\.{3}` + end, "g"), "…"],
                [new RegExp(begin + String.raw`(Den+(ík|íku|íkem)) N` + end, "g"), "$1\u00A0N"], [new RegExp(begin + String.raw`(Den+(ík|íku|íkem)) E` + end, "g"), "$1\u00A0E"],
                [new RegExp(begin + String.raw`(Kontext(u|em|y|ů|ům|ech)?) N` + end, "g"), "$1\u00A0N"], [new RegExp(begin + String.raw`(Studi(o|a|u|em)) N` + end, "g"), "$1\u00A0N"],
                [new RegExp(begin + String.raw`(Minut(a|y|ě|u|ou)) N` + end, "g"), "$1\u00A0N"], [new RegExp(begin + String.raw`(Edic(e|i|í|)) N` + end, "g"), "$1\u00A0N"],
                [new RegExp(begin + String.raw`(Point(a|y|ě|u|ou)) N` + end, "g"), "$1\u00A0N"], [new RegExp(begin + String.raw`(Debat(a|y|ě|u|ou)) N` + end, "g"), "$1\u00A0N"],
                [new RegExp(begin + String.raw`(Bistr(o|a|u|em)) N` + end, "g"), "$1\u00A0N"], [new RegExp(begin + String.raw`(Výlet) N` + end, "g"), "$1\u00A0N"],
                [new RegExp(begin + String.raw`(Výlet(u|em|y|ů|ům|ech)) N` + end, "g"), "$1\u00A0N"], [new RegExp(begin + String.raw`(Arén(a|y|ě|u|ou)) N` + end, "g"), "$1\u00A0N"],
                [new RegExp(begin + String.raw`\<(\/?)h([12456])` + end, "gi"), "<$1h3"], [new RegExp(begin + String.raw`‒`, "g"), "–"], [new RegExp(begin + String.raw`[  ](-{1,2}|–|—)(,*)[  ]` + end, "g"), "\u00A0–$2 "],
                [new RegExp(begin + String.raw`(\d) ` + end, "g"), "$1\u00A0"], [new RegExp(begin + String.raw`(\d)\. ([a-z1-9áéíóúůžščďťňřšě])` + end, "g"), "$1.\u00A0$2"],
                [new RegExp(begin + String.raw`(\d+)(\.*)[  ]*[-–]+[  ]*(\d+)(\.*)` + end, "g"), "$1$2–$3$4"], [new RegExp(begin + String.raw`(\d+)[  ]:[  ](\d+)` + end, "g"), "$1\u00A0:\u00A0$2"],
                [new RegExp(begin + String.raw`(\d)\.(\d{3})` + end, "g"), "$1\u00A0$2"], [new RegExp(String.raw`(>)[“”"]`, "g"), "$1„"], [new RegExp(begin + String.raw`(\s|^|\()[“”"]` + end, "g"), "$1„"],
                [new RegExp(String.raw`(<[/].+>)[„]`, "g"), "$1“"], [new RegExp(String.raw`(\s|^),,`, "g"), "$1„"], [new RegExp(String.raw`(\s|^),`, "g"), "$1‚"], [new RegExp(String.raw`„,`, "g"), "„‚"],
                [new RegExp(begin + String.raw`(\S)[“”"]` + end, "g"), "$1“"], [new RegExp(begin + String.raw`(\s|^)[‘’']` + end, "g"), "$1‚"], [new RegExp(String.raw`(>)[‘’']`, "g"), "$1‚"],
                [new RegExp(String.raw`(<[/].+>)[‚]`, "g"), "$1‘"], [new RegExp(begin + String.raw`(\S)[‘’']` + end, "g"), "$1‘"],
                [new RegExp(begin + String.raw`([a-zA-Záéíóúůžščďťňřšě^])[‘’′´']([a-zA-Záéíóúůžščďťňřšě\-])` + end, "g"), "$1’$2"], [new RegExp(begin + String.raw`rock’n‘roll` + end, "g"), "rock’n’roll"],
                [new RegExp(begin + String.raw`Rock’n‘roll` + end, "g"), "Rock’n’roll"], [new RegExp(begin + String.raw`(\(|„|‚)(.) ` + end, "g"), "$1$2\u00A0"],
                [new RegExp(begin + String.raw`(tzv|tzn|tj|mj|sv|resp)\. ` + end, "g"), "$1.\u00A0"], [new RegExp(begin + String.raw`mld\. (Kč|eur\GBP|USD)` + end, "gi"), "mld.\u00A0$1"],
                [new RegExp(begin + String.raw`TOP 09` + end, "g"), "TOP\u00A009"], [new RegExp(begin + String.raw`(Chart(a|y|ě|u|ou)) 77` + end, "g"), "$1\u00A077"],
                [new RegExp(begin + String.raw`(Pra(ha|hy|ze|hu|hou)) (\d{1,2})(?!\d)` + end, "g"), "$1\u00A0$3"], [new RegExp(begin + String.raw`([A-ZÁÉÍÓÚŮČĎŤŇŘŠŽ][a-záéíóúůžščďťňřšě]+) ([IVX]+\.)` + end, "g"), "$1\u00A0$2"],
                [new RegExp(begin + String.raw`(foto:) ` + end, "gi"), "$1\u00A0", 1], [new RegExp(begin + String.raw`(.),*[  ]*a\.[  ]*s\.` + end, "g"), "$1,\u00A0a.\u00A0s."],
                [new RegExp(begin + String.raw`(.),*[  ]*s\.[  ]*r\.[  ]*o\.` + end, "g"), "$1,\u00A0s.\u00A0r.\u00A0o."], [new RegExp(begin + String.raw`(.),*[  ]*spol\.*[  ]s\.*[  ]*r\.[  ]*o\.` + end, "g"), "$1,\u00A0spol.\u00A0s\u00A0r.\u00A0o."],
                [new RegExp(begin + String.raw`(?<=(^|\s|>)[szkvaiouSZKVAIOU&§])( )` + end, "g"), "\u00A0"], [new RegExp(begin + String.raw`&amp; `, "g"), "&amp;\u00A0"],
                [new RegExp(begin + String.raw`více méně` + end, "g"), "víceméně"], [new RegExp(begin + String.raw`Více méně` + end, "g"), "Víceméně"],
                [new RegExp(begin + String.raw`(člán)(ek|ku|kem) 66` + end, "gi"), "$1$2\u00A066"], [new RegExp(begin + String.raw`(Nord Stream(u|em)?) (1|2)` + end, "gi"), "$1\u00A0$3"],
                [new RegExp(begin + String.raw`([Čč])lán(ek|ku|kem|ky|cích|) (\d+)` + end, "g"), "$1lán$2\u00A0$3"], [new RegExp(begin + String.raw`Euro (\d)` + end, "g"), "Euro\u00A0$1"],
                [new RegExp(begin + String.raw`Leopard(y|ů|ům|ech)? (\d)` + end, "g"), "Leopard$1\u00A0$2"], [new RegExp(begin + String.raw`fenzív`, "gi"), "fenziv"],
                [new RegExp(begin + String.raw`milión`, "g"), "milion"], [new RegExp(begin + String.raw`Milión`, "g"), "Milion"], [new RegExp(begin + String.raw`([Ss])ezón`, "g"), "$1ezon"],
                [new RegExp(begin + String.raw`balón`, "g"), "balon"], [new RegExp(begin + String.raw`Balón`, "g"), "Balon"], [new RegExp(begin + String.raw`ašinéri`, "g"), "ašineri"],
                [new RegExp(begin + String.raw`\<\/(.+)><\1>`, "g"), ""], [new RegExp(begin + String.raw`(\s)\[lock\] `, "g"), "$1[lock]", 1], [new RegExp(begin + String.raw` \[lock\], `, "g"), "[lock], ", 1],
                [new RegExp(begin + String.raw`\n\n(http(s)?:\/\/)?(www\.)(youtube\.com/.+)\n\n\&nbsp\;\n` + end, "g"), "\n\n$1$3$4\n"],
                [new RegExp(String.raw`(?<=\<script( type=\"text\/javascript\"\>)?.*)[„“”](?=.*(\<\/script\>)?)`, "g"), "\""]
            ];
        })(),
        init: function() { this.ui.init(); this.events.init(); this.helpers.checkTypoStatus(); },
        helpers: {
            _preventPageLeave: false,
            setPreventPageLeave: function(prevent) { // NOVÁ FUNKCE
                this._preventPageLeave = prevent;
            },
            switchToHtmlMode: function() { if ($(CONFIG.selectors.mainContent).css('display') === 'none') { tinymce.execCommand('mceToggleEditor', true, 'content'); return true; } return false; },
            switchToWysiwygMode: function() { tinymce.execCommand('mceToggleEditor', false, 'content'); },
            getTimestamp: function() { const userName = $(CONFIG.selectors.displayName).first().text(), dateTime = new Date().toLocaleString('cs-CZ'), stampText = `<!--Poslední typografie: ${userName} ${dateTime}-->`; return [/<!--Poslední typografie: .+?-->/g, stampText]; },
            checkTypoStatus: function() { const wasSwitched = this.switchToHtmlMode(), content = $(CONFIG.selectors.mainContent).val(), [stampRegex] = this.getTimestamp(), typoButton = document.getElementById(CONFIG.ids.typoButton); if (typoButton) { if (stampRegex.test(content)) { typoButton.style.backgroundColor = CONFIG.colors.stamped; } else { typoButton.style.backgroundColor = CONFIG.colors.default; } } if (wasSwitched) this.switchToWysiwygMode(); },
            stampArticle: function() { const [stampRegex, stampText] = this.getTimestamp(); let content = $(CONFIG.selectors.mainContent).val(); content = stampRegex.test(content) ? content.replace(stampRegex, stampText) : content + ` ${stampText}`; $(CONFIG.selectors.mainContent).val(content); },
            sendGoogleChatMessage: function(cardPayload) {
                return fetch(CONFIG.googleChat.webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
                    body: JSON.stringify(cardPayload)
                });
            },
            getArticleId: function() {
                const urlParams = new URLSearchParams(window.location.search);
                return urlParams.get('post');
            },
            sendMyServerRequest: function(method, endpoint, data = null) {
                const headers = {
                    'Content-Type': 'application/json'
                };

                /* // Přidání API klíče pro autentizaci
                if (CONFIG.myServer.apiKey) {
                    headers['Authorization'] = `Bearer ${CONFIG.myServer.apiKey}`;
                }*/

                // Endpoint bude jednoduše `?url=...`, `?stats=true`, nebo prázdný pro POST/PATCH na kořen
                const url = `${CONFIG.myServer.apiUrl}${endpoint}`;
                const options = {
                    method: method,
                    headers: headers,
                    body: data ? JSON.stringify(data) : null // Data se posílají přímo, ne ve wrapperu 'records'
                };

                console.log(`Sending ${method} request to ${url} with data:`, options.body); // Debug log
                return fetch(url, options);
            },
            getQueueStats: async function() {
                let totalCount = 0;
                let urgentCount = 0;
                let newspaperCount = 0;

                try {
                    const statsResponse = await this.sendMyServerRequest('GET', '?stats=true'); // Voláme API endpoint pro statistiky
                    if (statsResponse.ok) {
                        const statsJson = await statsResponse.json();
                        totalCount = statsJson.total || 0;
                        urgentCount = statsJson.urgent || 0;
                        newspaperCount = statsJson.newspaper || 0;
                    } else {
                        console.error('Chyba při získávání statistik z API:', statsResponse.status, statsResponse.statusText, await statsResponse.text());
                    }
                } catch (error) {
                    console.error('Obecná chyba při získávání statistik z API:', error);
                }

                return {
                    total: totalCount,
                    urgent: urgentCount,
                    newspaper: newspaperCount
                };
            }
        },
        ui: {
            init: function() { this.addMainTypoButton(); this.addCaptionTools(CONFIG.selectors.captionSingle, 'single'); this.addCaptionTools(CONFIG.selectors.captionGallery, 'gallery'); this.addGoogleChatRequestButton(); this.addGoogleChatNotifyButton(); this.addWaitingForProofreadingButton(); this.hideUnnecessaryFields(); },
            addMainTypoButton: function() { const button = document.createElement('span'); button.id = CONFIG.ids.typoButton; button.className = 'ed_button button button-small'; button.textContent = 'Typografie'; button.style.cssText = `margin: 2px; font-weight: bold; height: 26px; line-height: 24px; background-color: ${CONFIG.colors.default}; color: white; border: solid ${CONFIG.colors.baseBorder} 1px;`; $(CONFIG.selectors.mediaButtons).append(button); },
            addCaptionTools: function(targetSelector, idSuffix) { $(document).on('click', targetSelector, () => { if (document.getElementById(`${CONFIG.ids.captionTypoButton}-${idSuffix}`)) return; const ref = document.querySelector(targetSelector), typoBtn = this.createButton('typografie', `${CONFIG.ids.captionTypoButton}-${idSuffix}`, CONFIG.colors.default, 'white'), licenseBtn = this.createButton('licence', `${CONFIG.ids.captionLicenseButton}-${idSuffix}`, CONFIG.colors.licenseBtnBg, 'black'), licenseList = this.createLicenseList(idSuffix); this.insertAfter(licenseList, ref); this.insertAfter(licenseBtn, licenseList); this.insertAfter(typoBtn, licenseBtn); }); },
            createButton: function(text, id, bgColor, color) { const btn = document.createElement('div'); btn.id = id; btn.textContent = text; btn.style.cssText = `margin: 2px; margin-top: 5px; margin-right: 5px; padding: 5px; font-weight: bold; height: 26px; line-height: 24px; background-color: ${bgColor}; color: ${color}; text-align: center; border-radius: 10px; cursor: pointer; display: inline-block`; return btn; },
            createLicenseList: function(idSuffix) { const list = document.createElement('ul'); list.id = `${CONFIG.ids.captionLicenseList}-${idSuffix}`; list.style.cssText = "display: none; margin: 2px; padding: 5px; background: #fae282; position: relative; width: 250px;"; let innerHTML = `<div data-action="close" style="font-weight: bold; margin-bottom: 5px; cursor: pointer;">❌ skrýt</div>`; for (const [key, value] of Object.entries(CONFIG.photoCredits)) { innerHTML += `<li data-action="add-credit" data-credit-key="${key}" style="cursor: pointer;">${value.trim().split(':')[1].split(',')[0]}</li>`; } for (const [key, value] of Object.entries(CONFIG.licenses)) { innerHTML += `<li data-action="add-license" data-license-key="${key}" style="cursor: pointer;">${value.text}</li>`; } list.innerHTML = innerHTML; return list; },
            addGoogleChatRequestButton: function() { const target = document.querySelector(CONFIG.selectors.korektorDateBox); if (!target) return; const div = document.createElement('div'); div.id = CONFIG.ids.gchatRequestDiv; div.style.padding = '10px'; div.innerHTML = `<hr><label><input type="checkbox" id="gchatZadostUrgent">&nbsp;urgentní</label><br><br><label><input type="checkbox" id="gchatZadostNoviny">&nbsp;noviny</label><br><br><label><input type="checkbox" id="gchatZadostNespecha">&nbsp;nespěchá</label><br><br><label><input type="checkbox" id="gchatZadostPublikovat">&nbsp;po korektuře publikovat</label><br><br><span id="${CONFIG.ids.gchatRequestBtn}" class="ed_button button button-small" style="background-color: ${CONFIG.colors.requestBtnBg}; color: white; font-weight: bold;">Požádej o korekturu</span>`; this.insertAfter(div, target); },
            addGoogleChatNotifyButton: function() {
                const target = document.querySelector(CONFIG.selectors.korektorBox);
                if (!target) return;
                const urlParams = new URLSearchParams(window.location.search);
                const clan_editor = urlParams.get("clan_editor");

                if (clan_editor) {
                    const editorInfo = document.createElement('div');
                    editorInfo.innerHTML = `Editor: ${clan_editor}`;
                    editorInfo.style.marginBottom = '10px';
                    target.prepend(editorInfo);
                } else {
                    const select = document.createElement('select');
                    select.id = CONFIG.ids.editorSelect;
                    select.style.marginBottom = '10px';
                    let options = '<option value="">---vyber editora---</option>';
                    CONFIG.editorList.sort().forEach(name => {
                        options += `<option value="${name}">${name}</option>`;
                    });
                    select.innerHTML = options;
                    target.prepend(select);
                }

                const div = document.createElement('div');
                div.id = CONFIG.ids.gchatNotifyDiv;
                div.style.padding = '10px';
                div.innerHTML = `<span id="${CONFIG.ids.gchatNotifyBtn}" class="ed_button button button-small" style="background-color: ${CONFIG.colors.notifyBtnBg}; color: white; font-weight: bold;">Oznam zkorigováno</span>`;

                if (urlParams.get("clan_pokorpublik") === "true") {
                    div.innerHTML += '<div style="margin-top: 10px; color: red; font-weight: bold;">Po korektuře publikuj!</div>';
                }

                this.insertAfter(div, target);
            },
            addWaitingForProofreadingButton: function() { const target = document.getElementById('post-query-submit'); if (!target) return; const button = document.createElement('span'); button.id = CONFIG.ids.waitingForProofBtn; button.className = 'ed_button button button-small'; button.innerHTML = 'Čeká na korekturu&nbsp;🖉'; button.style.cssText = `margin-bottom: 10px; height: 30px; font-size: 110%; line-height: 30px; color: ${CONFIG.colors.waitingBtnColor}; border: 1px solid ${CONFIG.colors.waitingBtnColor};`; this.insertAfter(button, target); },
            hideUnnecessaryFields: function() { CONFIG.selectors.korektorFieldsToHide.forEach(selector => { $(selector).hide(); }); },
            insertAfter: function(newNode, referenceNode) { referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling); }
        },
events: {
    init: function() { this.bindMainTypoButtonClick(); this.bindCaptionTypoButtonClick(); this.bindLicenseMenuEvents(); this.bindPublishButtonHover(); this.bindGoogleChatRequestClick(); this.bindGoogleChatNotifyClick(); this.bindWaitingForProofreadingClick(); window.addEventListener('beforeunload', (event) => {
        if (TypoApp.helpers._preventPageLeave) {
            event.preventDefault(); // Standardní pro zabránění opuštění stránky
            event.returnValue = 'Probíhá ukládání provedené korektury do databáze, chviličku strpení prosím...'; // Custom zpráva pro některé prohlížeče
            return 'Probíhá ukládání provedené korektury do databáze, chviličku strpení prosím...'; // Custom zpráva pro ostatní prohlížeče
        }
    });
                     },
    bindMainTypoButtonClick: function() { $(document).on('click', `#${CONFIG.ids.typoButton}`, () => TypoApp.runTypography()); },
    bindCaptionTypoButtonClick: function() { $(document).on('click', `[id^="${CONFIG.ids.captionTypoButton}-"]`, function(e) { const targetId = this.id.includes('gallery') ? CONFIG.selectors.captionGallery : CONFIG.selectors.captionSingle; TypoApp.runTypography(targetId); e.target.style.backgroundColor = CONFIG.colors.done; }); },
    bindLicenseMenuEvents: function() { $(document).on('click', `[id^="${CONFIG.ids.captionLicenseButton}-"]`, function(e) { const idSuffix = e.target.id.includes('gallery') ? 'gallery' : 'single', list = document.getElementById(`${CONFIG.ids.captionLicenseList}-${idSuffix}`); if (list) list.style.display = 'block'; }); $(document).on('click', `[id^="${CONFIG.ids.captionLicenseList}-"] li, [id^="${CONFIG.ids.captionLicenseList}-"] div`, function(e) { e.stopPropagation(); const target = e.currentTarget, action = target.dataset.action, list = target.closest('ul'), idSuffix = list.id.includes('gallery') ? 'gallery' : 'single', textarea = document.querySelector(idSuffix === 'gallery' ? CONFIG.selectors.captionGallery : CONFIG.selectors.captionSingle); if (action === 'close') { list.style.display = 'none'; return; } if (action === 'add-credit') { textarea.value += CONFIG.photoCredits[target.dataset.creditKey]; } if (action === 'add-license') { textarea.value += ` ${CONFIG.licenses[target.dataset.licenseKey].html}`; } textarea.focus(); list.style.display = 'none'; }); },
    bindPublishButtonHover: function() { const typoButton = $(`#${CONFIG.ids.typoButton}`); $(document).on('mouseover', CONFIG.selectors.publishBtn, () => { const content = $(CONFIG.selectors.mainContent).val() || ''; if (!content.includes('<!--Poslední typografie:')) { typoButton.css({ borderColor: CONFIG.colors.blink, color: CONFIG.colors.blink }); typoButton.animate({ opacity: 0 }, 200, function() { typoButton.animate({ opacity: 1 }, 200, function() { $(this).trigger('mouseover'); }); }); } }).on('mouseout', CONFIG.selectors.publishBtn, () => { typoButton.stop(true).css({ opacity: 1, borderColor: CONFIG.colors.baseBorder, color: 'white' }); }); },

bindGoogleChatRequestClick: function() {
    $(document).on('click', `#${CONFIG.ids.gchatRequestBtn}`, async function() {
        const btn = this;
        if ($(btn).data('sending')) return;

        const articleId = TypoApp.helpers.getArticleId();
        if (!articleId) {
            alert('Chyba! Článek se nepodařilo zařadit do fronty ke korektuře. Nejprve ulož koncept pro vytvoření jeho ID a potom požádej o korekturu.');
            return;
        }

        $(btn).data('sending', true);
        const originalText = btn.textContent;
        btn.textContent = 'Odesílám...';
        btn.style.backgroundColor = 'silver';

        const title = $(CONFIG.selectors.title).val();
        const editorName = $(CONFIG.selectors.displayName).first().text();
        const charCount = $(CONFIG.selectors.charCount).text();
        const publishAfter = $('#gchatZadostPublikovat').is(':checked');
        const articleUrlForGchat = `${window.location.href}&clan_editor=${encodeURIComponent(editorName)}&clan_pokorpublik=${publishAfter}`;
        const articleUrlForDb = `https://denikn.cz/wp-admin/post.php?post=${articleId}&action=edit`; // Čistá URL pro DB

        let authors = [];
        $('#coauthors-list .coauthor-tag').each(function() { authors.push($(this).text().trim()); });
        const authorsText = authors.join(', ');

        let flagWidgets = [];
        if ($('#gchatZadostUrgent').is(':checked')) flagWidgets.push({ decoratedText: { startIcon: { knownIcon: "PHONE" }, text: "urgentní" } });
        if ($('#gchatZadostNoviny').is(':checked')) flagWidgets.push({ decoratedText: { startIcon: { knownIcon: "TICKET" }, text: "do novin" } });
        if ($('#gchatZadostNespecha').is(':checked')) flagWidgets.push({ decoratedText: { startIcon: { knownIcon: "RESTAURANT_ICON" }, text: "nespěchá" } });
        if (publishAfter) flagWidgets.push({ decoratedText: { startIcon: { knownIcon: "FLIGHT_DEPARTURE" }, text: "po korektuře publikovat" } });

        const datePickerVal = $(CONFIG.selectors.datepicker).val();
        let deadlineText = '';
        let deadlineForDb = null;

        if (datePickerVal) {
            const match = datePickerVal.match(/(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2}):(\d{2})/);
            let dateObj;

            if (match) {
                dateObj = new Date(
                    parseInt(match[1], 10),
                    parseInt(match[2], 10) - 1,
                    parseInt(match[3], 10),
                    parseInt(match[4], 10),
                    parseInt(match[5], 10),
                    parseInt(match[6], 10)
                );
            } else {
                const oldFormatMatch = datePickerVal.match(/(\d{2})\.\s*(\d{2})\.\s*(\d{4})\s*(\d{2}):(\d{2})/);
                if (oldFormatMatch) {
                    dateObj = new Date(
                        parseInt(oldFormatMatch[3], 10),
                        parseInt(oldFormatMatch[2], 10) - 1,
                        parseInt(oldFormatMatch[1], 10),
                        parseInt(oldFormatMatch[4], 10),
                        parseInt(oldFormatMatch[5], 10),
                        0
                    );
                } else {
                    console.warn("Could not parse datePickerVal format. Expected YYYY-MM-DD HH:MM:SS or DD. MM. YYYY HH:MM, got:", datePickerVal);
                }
            }

            if (dateObj && !isNaN(dateObj.getTime())) {
                // PHP API očekává YYYY-MM-DD HH:MM:SS
                const year = dateObj.getFullYear();
                const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                const day = String(dateObj.getDate()).padStart(2, '0');
                const hour = String(dateObj.getHours()).padStart(2, '0');
                const minute = String(dateObj.getMinutes()).padStart(2, '0');
                const second = String(dateObj.getSeconds()).padStart(2, '0');

                deadlineForDb = `${year}-${month}-${day} ${hour}:${minute}:${second}`; // Formát pro MySQL DATETIME
                deadlineText = `Zkorigovat do: ${day}. ${month}. ${hour}:${minute}`;
                flagWidgets.push({ decoratedText: { startIcon: { knownIcon: "CLOCK" }, text: deadlineText } });
            }
        }

        const infoWidgets = [{ decoratedText: { topLabel: "Editor:", text: editorName } }, { decoratedText: { topLabel: "Rozsah:", text: charCount } }];
        if (authorsText) { infoWidgets.splice(1, 0, { decoratedText: { topLabel: "Autor/Autoři:", text: authorsText } }); }

        let card = {
            cardsV2: [{
                cardId: "proofread-request",
                card: {
                    header: { title: "Prosím o korekturu", subtitle: title, imageUrl: "https://cdn.iconscout.com/icon/free/png-512/free-edit-911-523345.png?f=webp&w=256", imageType: "CIRCLE" },
                    sections: [{ widgets: infoWidgets }, { widgets: [{ buttonList: { buttons: [{ text: "Otevřít článek ke korektuře", onClick: { openLink: { url: articleUrlForGchat } } }] } }] }]
                }
            }]
        };

        if (flagWidgets.length > 0) { card.cardsV2[0].card.sections.splice(1, 0, { header: "Příznaky", widgets: flagWidgets }); }

        // --- NOVÁ LOGIKA PRO HLEDÁNÍ/AKTUALIZACI VLASTNÍ DB ---
        const articleDataForDb = { // Data pro vaše API
            article_post_id: articleId, // New: Send article_post_id
            article_title: title,
            article_url: articleUrlForDb,
            editor_name: editorName,
            authors: authorsText,
            char_count: charCount,
            is_urgent: $('#gchatZadostUrgent').is(':checked'),
            for_newspaper: $('#gchatZadostNoviny').is(':checked'),
            not_urgent: $('#gchatZadostNespecha').is(':checked'),
            publish_after_proofreading: publishAfter,
            deadline_at: deadlineForDb,
            status: 0, // 0 for 'Čeká na korekturu'
            corrector_name: null // Vymažeme korektora, pokud editor znovu požádá
        };

        let gchatSuccess = false;
        let myServerSuccess = false;
        let errorMessage = '';

        try {
            // 1. Odeslat zprávu do Google Chat
            const gchatResponse = await TypoApp.helpers.sendGoogleChatMessage(card);
            if (!gchatResponse.ok) {
                throw new Error(`Google Chat API error: ${gchatResponse.status} ${gchatResponse.statusText}`);
            }
            console.log('Google Chat zpráva odeslána.');
            gchatSuccess = true;
        } catch (error) {
            console.error('Chyba při odesílání do Google Chatu:', error);
            errorMessage += `Chyba Google Chat: ${error.message}\n`;
        }

        try {
            // 2. Zpracovat záznam na vlastním serveru (najít/aktualizovat nebo vytvořit)
            let existingRecordFound = false;
            const searchResponse = await TypoApp.helpers.sendMyServerRequest('GET', `?post_id=${articleId}`);

            if (searchResponse.ok) {
                const searchJson = await searchResponse.json();
                if (searchJson.id) {
                    existingRecordFound = true;
                    console.log('Existing record found for update:', searchJson.id);
                }
            } else if (searchResponse.status !== 404) {
                console.error(`API search error: ${searchResponse.status} ${searchResponse.statusText}`, await searchResponse.text());
                throw new Error(`API search error: ${searchResponse.status} ${searchResponse.statusText}`);
            }

            let myServerResponse;
            if (existingRecordFound) {
                myServerResponse = await TypoApp.helpers.sendMyServerRequest('PATCH', '', articleDataForDb);
            } else {
                myServerResponse = await TypoApp.helpers.sendMyServerRequest('POST', '', articleDataForDb);
            }

            if (!myServerResponse.ok) {
                throw new Error(`My Server API error: ${myServerResponse.status} ${myServerResponse.statusText}, Response: ${await myServerResponse.text()}`);
            }
            console.log('My Server záznam zpracován:', existingRecordFound ? 'PATCH' : 'POST', await myServerResponse.json());
            myServerSuccess = true;
        } catch (error) {
            console.error('Chyba při zpracování záznamu na My Serveru:', error);
            errorMessage += `Chyba My Server API: ${error.message}\n`;
        }

        if (gchatSuccess && myServerSuccess) {
            btn.textContent = 'Odesláno';
            btn.style.backgroundColor = CONFIG.colors.done; // Zelená barva pro úspěch
        } else {
            btn.textContent = 'Částečná chyba!';
            btn.style.backgroundColor = 'orange'; // Oranžová pro částečný úspěch/chybu
            alert(`Nastala chyba při zpracování žádosti o korekturu:\n${errorMessage}Zkontrolujte konzoli pro detaily.`);
        }

        // Aktualizace statistik bez ohledu na úspěch odeslání
        try {
            const stats = await TypoApp.helpers.getQueueStats();
            const gchatRequestDiv = $(`#${CONFIG.ids.gchatRequestDiv}`);
            let statsDiv = $(`#${CONFIG.ids.airtableStatsDiv}`);

            if (statsDiv.length === 0) {
                statsDiv = $('<div>').attr('id', CONFIG.ids.airtableStatsDiv).css({
                    marginTop: '15px',
                    padding: '10px',
                    border: `1px solid ${CONFIG.colors.baseBorder}`,
                    borderRadius: '5px',
                    backgroundColor: '#e9f5ff'
                });
                gchatRequestDiv.append(statsDiv);
            }

            statsDiv.html(`
                <b>Statistiky fronty korektur:</b><br>
                Článků ve frontě: ${stats.total}<br>
                Z toho urgent: ${stats.urgent}<br>
                Z toho do novin: ${stats.newspaper}
            `);
        } catch (error) {
            console.error('Chyba při získávání statistik fronty:', error);
            // Zde můžete přidat další UI zpětnou vazbu, pokud se statistiky nepodařilo získat
        }

        $(btn).data('sending', false);
    });
},

bindGoogleChatNotifyClick: function() {
    $(document).on('click', `#${CONFIG.ids.gchatNotifyBtn}`, async function() {
        const btn = this;
        if ($(btn).data('sending')) return;

        const articleId = TypoApp.helpers.getArticleId();
        if (!articleId) {
            alert('Chyba! Nelze označit jako zkorigováno. Článek nemá uložené ID.');
            return;
        }

        $(btn).data('sending', true);
        const originalText = btn.textContent;
        const originalBgColor = btn.style.backgroundColor;
        btn.textContent = 'Odesílám, čekej...';
        btn.style.backgroundColor = 'red';

        const title = $(CONFIG.selectors.title).val();
        const correctorName = $(CONFIG.selectors.displayName).first().text();
        const articleUrlForDb = `https://denikn.cz/wp-admin/post.php?post=${articleId}&action=edit`; // Čistá URL pro DB

        let editorName = new URLSearchParams(window.location.search).get("clan_editor");
        if (!editorName) editorName = $(`#${CONFIG.ids.editorSelect}`).val();

        if (!editorName) {
            alert('Prosím, vyberte editora ze seznamu.');
            btn.textContent = originalText;
            btn.style.backgroundColor = originalBgColor;
            $(btn).data('sending', false);
            return;
        }

        const editorId = CONFIG.editors[editorName];
        const editorMention = editorId ? `<users/${editorId}>` : `<b>${editorName}</b>`;
        const articleUrlForGchat = window.location.href.split('&clan_editor')[0].split('&clan_pokorpublik')[0];

        let payload = {
            text: `Ahoj ${editorMention}, tvůj článek je po korektuře.`,
            cardsV2: [{
                cardId: "proofread-done",
                card: {
                    header: { title: "Zkorigováno", subtitle: title, imageUrl: "https://cdn.iconscout.com/icon/free/png-512/free-check-15275847-12403493.png?f=webp&w=256", imageType: "CIRCLE" },
                    sections: [
                        { widgets: [{ decoratedText: { topLabel: "Editor:", text: editorName } }, { decoratedText: { topLabel: "Korektor:", text: correctorName } }] },
                        { widgets: [{ buttonList: { buttons: [{ text: "Zkontrolovat finální verzi", onClick: { openLink: { url: articleUrlForGchat } } }] } }] }
                    ]
                }
            }]
        };

        let gchatSuccess = false;
        let myServerSuccess = false;
        let errorMessage = '';

        try {
            TypoApp.helpers.setPreventPageLeave(true); // Prevent page leave during operations

            // 1. Odeslat zprávu do Google Chat
            const gchatResponse = await TypoApp.helpers.sendGoogleChatMessage(payload);
            if (!gchatResponse.ok) {
                throw new Error(`Google Chat API error: ${gchatResponse.status} ${gchatResponse.statusText}`);
            }
            console.log('Google Chat zpráva odeslána.');
            gchatSuccess = true;
        } catch (error) {
            console.error('Chyba při odesílání do Google Chatu:', error);
            errorMessage += `Chyba Google Chat: ${error.message}\n`;
        }

        try {
            // 2. Zpracovat záznam na vlastním serveru (najít/aktualizovat)
            const searchResponse = await TypoApp.helpers.sendMyServerRequest('GET', `?post_id=${articleId}&status=0`);

            let recordToUpdateFound = false;
            if (searchResponse.ok) {
                const searchJson = await searchResponse.json();
                if (searchJson.id) {
                    recordToUpdateFound = true;
                    console.log('Record found for status update:', searchJson.id);
                }
            } else if (searchResponse.status !== 404) {
                console.error(`API search error (notify): ${searchResponse.status} ${searchResponse.statusText}`, await searchResponse.text());
                throw new Error(`API search error (notify): ${searchResponse.status} ${searchResponse.statusText}`);
            }

            if (recordToUpdateFound) {
                const updateData = {
                    article_post_id: articleId,
                    status: 1, // 1 for 'Zkorigováno'
                    corrector_name: correctorName
                };
                const myServerUpdateResponse = await TypoApp.helpers.sendMyServerRequest('PATCH', '', updateData);
                if (!myServerUpdateResponse.ok) {
                    throw new Error(`My Server API update error: ${myServerUpdateResponse.status} ${myServerUpdateResponse.statusText}, Response: ${await myServerUpdateResponse.text()}`);
                }
                console.log('My Server záznam aktualizován:', await myServerUpdateResponse.json());
                myServerSuccess = true;
            } else {
                console.warn('Ve vlastní databázi nebyl nalezen žádný odpovídající záznam pro aktualizaci, nebo už byl zkorigován.');
                // V tomto scénáři můžete zvážit, zda vytvořit nový záznam nebo jen poslat GChat notifikaci.
                // Prozatím jen logujeme varování a pokračujeme s GChat notifikací.
                myServerSuccess = true; // Consider it a success if no record to update, but GChat still sent.
            }
        } catch (error) {
            console.error('Chyba při aktualizaci záznamu na My Serveru:', error);
            errorMessage += `Chyba My Server API: ${error.message}\n`;
        } finally {
            TypoApp.helpers.setPreventPageLeave(false); // Always allow page leave after operations
        }

        if (gchatSuccess && myServerSuccess) {
            btn.textContent = 'Oznámeno';
            btn.style.backgroundColor = CONFIG.colors.done; // Zelená barva pro úspěch
            $(CONFIG.selectors.korektorBox).find('input[type=checkbox]').prop('checked', true);
        } else {
            btn.textContent = 'Částečná chyba!';
            btn.style.backgroundColor = 'orange'; // Oranžová pro částečný úspěch/chybu
            alert(`Nastala chyba při oznamování zkorigování:\n${errorMessage}Zkontrolujte konzoli pro detaily.`);
        }

        $(btn).data('sending', false);
    });
},
    bindWaitingForProofreadingClick: function() { $(document).on('click', `#${CONFIG.ids.waitingForProofBtn}`, () => { window.location.href = "https://denikn.cz/wp-admin/edit.php?dn_korektor=5"; }); }
},
        runTypography: function(singleFieldSelector = null) {
            const wasSwitched = this.helpers.switchToHtmlMode();
            if (singleFieldSelector) {
                const field = $(singleFieldSelector); let content = field.val();
                this.rules.forEach(rule => { content = content.replace(rule[0], rule[1]); });
                field.val(content.normalize());
            } else {
                const fieldsToProcess = [CONFIG.selectors.mainContent, CONFIG.selectors.excerpt, CONFIG.selectors.title, CONFIG.selectors.altTitle, CONFIG.selectors.note, CONFIG.selectors.imgCaption];
                fieldsToProcess.forEach(selector => {
                    const field = $(selector);
                    if (field.length) {
                        let content = field.val();
                        this.rules.forEach(rule => { if (rule[2] === 1 && selector !== CONFIG.selectors.mainContent) return; content = content.replace(rule[0], rule[1]); });
                        field.val(content.normalize());
                    }
                });
                this.helpers.stampArticle();
                const typoButton = document.getElementById(CONFIG.ids.typoButton);
                if (typoButton) typoButton.style.backgroundColor = CONFIG.colors.done;
            }
            if (wasSwitched) this.helpers.switchToWysiwygMode();
        }
    };

    /**
     * =================================================================
     * HLAVNÍ SMĚROVAČ (ROUTER)
     * =================================================================
     */
    $(document).ready(function() {
        const isEditorPage = document.getElementById('poststuff') !== null;
        const isListPage = window.location.pathname.endsWith('/edit.php') && new URLSearchParams(window.location.search).has('post_type');
        const isInsideIframe = window.self !== window.top;

        if (isListPage && !isInsideIframe) {
            GreyboxApp.init();
        }

        if (isEditorPage) {
            if (isInsideIframe) {
                GM_addStyle(`
                    #wpadminbar, #adminmenumain { display: none !important; }
                    html.wp-toolbar { padding-top: 0 !important; }
                    #wpcontent { margin-left: 0 !important; }
                `);
            }
            if (typeof tinymce !== 'undefined' && tinymce.majorVersion) {
                tinymce.init({}).then(() => TypoApp.init());
            } else if (document.getElementById('content')) {
                TypoApp.init();
            }
        }
    });

})();
