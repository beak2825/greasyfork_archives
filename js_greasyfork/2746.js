// ==UserScript==
// @name           Torrenter
// @namespace      http://www.google.com/search?q=mabakay
// @version        2.3.6
// @description    Adds links to torrent sites on popular movie websites.
// @description:pl Dodaje linki do stron z torrentami na popularnych stronach o filmach.
// @author         mabakay
// @copyright      2010 - 2024, mabakay
// @date           28 Oct 2024
// @license        MIT
// @run-at         document-end
// @icon64URL      https://raw.githubusercontent.com/mabakay/torrenter/master/torrenter_64.png
// @supportURL     https://github.com/mabakay/torrenter
// @match          http://www.filmweb.pl/*
// @match          https://www.filmweb.pl/*
// @match          http://release24.pl/*
// @match          https://release24.pl/*
// @match          http://www.imdb.com/*
// @match          https://www.imdb.com/*
// @match          http://www.rottentomatoes.com/*
// @match          https://www.rottentomatoes.com/*
// @require        https://openuserjs.org/src/libs/sizzle/GM_config.min.js
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/2746/Torrenter.user.js
// @updateURL https://update.greasyfork.org/scripts/2746/Torrenter.meta.js
// ==/UserScript==
"use strict";
class TorrenterConfigurator {
    get localization() {
        var _a;
        return (_a = TorrenterConfigurator._localization[this._language]) !== null && _a !== void 0 ? _a : TorrenterConfigurator._localization["en"];
    }
    getConfigurationProperty(name, defaultValue) {
        return GM_config.get(name, defaultValue);
    }
    getConfiguration() {
        return {
            engines: [
                "https://thepiratebay10.org/search/{title}[ {year}]/0/7/0",
                "https://torrentgalaxy.to/torrents.php?search={title}[ {year}]&sort=seeders&order=desc",
                "https://1337x.to/sort-search/{title}[ {year}]/seeders/desc/1/",
                "https://torrentz2eu.org/index.html?q={title}[ {year}]",
                "https://yts.mx/browse-movies/{title}[/all/all/0/seeds/{year}/all]",
                "https://eztv.re/search/{title}[ {year}]",
                "https://www.torlock.com/?q={title}[ {year}]&sort=seeds&order=desc",
                "https://www.torrentdownloads.me/search/?new=1&s_cat=0&search={title}[ {year}]",
                "https://www.limetorrents.lol/search/all/{title}[ {year}]/seeds/1/"
            ],
            showEngines: this.getConfigurationProperty("showEngines", true),
            showUserEngines: this.getConfigurationProperty("showUserEngines", false),
            showUserEnginesFirst: this.getConfigurationProperty("showUserEnginesFirst", false),
            userEngines: this.getConfigurationProperty("userEngines", "").split(/\r?\n/).filter((item) => { return !!item; }),
        };
    }
    constructor(changeCallback, onInitCallback) {
        let languages = window.navigator.languages.map(item => item.replace('-', '_'));
        this._language = languages.find(lang => TorrenterConfigurator._localization[lang])
            || languages.find(lang => TorrenterConfigurator._localization[lang.split(/-|_/)[0]])
            || 'en';
        if (!GM_config || !GM_registerMenuCommand) {
            return;
        }
        let gmConfiguration = {
            "id": "mabakay_Torrenter",
            "title": this.localization.settingsTitle,
            "fields": {
                "showEngines": {
                    "label": this.localization.showBuildInEngines,
                    "type": "checkbox",
                    "default": true
                },
                "showUserEngines": {
                    "label": this.localization.showUserEngines,
                    "type": "checkbox",
                    "default": false
                },
                "showUserEnginesFirst": {
                    "label": this.localization.showUserEnginesFirst,
                    "type": "checkbox",
                    "default": false
                },
                "userEngines": {
                    "label": this.localization.userEngines,
                    "type": "textarea",
                    "default": "",
                }
            },
            "events": {
                "init": onInitCallback,
                "open": (document, window, frame) => {
                    let userEnginesFiled = document.getElementById("mabakay_Torrenter_field_userEngines");
                    userEnginesFiled.setAttribute("cols", "80");
                    userEnginesFiled.setAttribute("rows", "10");
                    userEnginesFiled.setAttribute("placeholder", this.localization.eg + " https://search-site.com/?title={title}&year={year}&orderby=seeds[&imdbTag={imdb}]");
                    let enginesFieldDescription = document.createElement("div");
                    enginesFieldDescription.setAttribute("style", "font-size: 12px;margin: 5px 6px;color: gray;");
                    enginesFieldDescription.innerHTML = this.localization.addEngineDescription;
                    let enginesLabelField = document.getElementById("mabakay_Torrenter_userEngines_field_label");
                    enginesLabelField.after(enginesFieldDescription);
                    let saveButton = document.getElementById("mabakay_Torrenter_saveBtn");
                    saveButton.textContent = this.localization.saveButtonCaption;
                    let closeButton = document.getElementById("mabakay_Torrenter_closeBtn");
                    closeButton.textContent = this.localization.closeCaptionButton;
                    let restToDefaultsLink = document.getElementById("mabakay_Torrenter_resetLink");
                    restToDefaultsLink.textContent = this.localization.resetLinkCaption;
                    GM_config.frame.setAttribute("style", "inset: 166px auto auto 326px;border: 1px solid rgb(0, 0, 0);height: 440px;margin: 0px;opacity: 1;overflow: auto;padding: 0px;position: fixed;width: 650px;z-index: 9999;display: block;");
                },
                "save": () => {
                    GM_config.close();
                    if (changeCallback) {
                        changeCallback();
                    }
                }
            }
        };
        GM_config.init(gmConfiguration);
        GM_registerMenuCommand(this.localization.configureMenuItem, () => { GM_config.open(); });
    }
}
TorrenterConfigurator._localization = {
    en: {
        settingsTitle: "Torrenter Script Settings",
        showBuildInEngines: "Show Build-in Engines",
        showUserEngines: "Show User Definied Engines",
        showUserEnginesFirst: "Show User Definied Engines First",
        userEngines: "User Engines",
        eg: "e.g.",
        addEngineDescription: "Type by separating with an enter. Available variables are:</br>&emsp;{title} - movie title</br>&emsp;{year} - movie release year</br>&emsp;{imdb} - position ID in www.imdb.com</br>&emsp;[] - optional fragment, removed if the internal tag is not found by the site processor",
        saveButtonCaption: "Save",
        closeCaptionButton: "Close",
        resetLinkCaption: "Reset to defaults",
        configureMenuItem: "Configure"
    },
    pl: {
        settingsTitle: "Ustawienia skryptu Torrenter",
        showBuildInEngines: "Pokaż wyszukiwarki wbudowane",
        showUserEngines: "Pokaż wyszukiwarki użytkownika",
        showUserEnginesFirst: "Pokaż wyszukiwarki użytkownika jako pierwsze",
        userEngines: "Wyszukiwarki użytkownika",
        eg: "np.",
        addEngineDescription: "Podaj rozdzielając enterem. Dostępne zmienne to:</br>&emsp;{title} - tytuł filmu</br>&emsp;{year} - rok wydania filmu</br>&emsp;{imdb} - ID pozycji w serwisie www.imdb.com</br>&emsp;[] - fragment opcjonalny usuwany jeżeli wewnętrzny tag nie zostanie odnaleziony przez parser strony",
        saveButtonCaption: "Zapisz",
        closeCaptionButton: "Anuluj",
        resetLinkCaption: "Przywróć ustawienia domyślne",
        configureMenuItem: "Skonfiguruj"
    },
    pt_PT: {
        settingsTitle: "Definições do script Torrenter",
        showBuildInEngines: "Mostrar motores de pesquisa incorporados",
        showUserEngines: "Mostrar motores de pesquisa definidos pelo utilizador",
        showUserEnginesFirst: "Mostrar primeiro os motores de pesquisa definidos pelo utilizador",
        userEngines: "Motores de pesquisa do utilizador",
        eg: "p. ex.",
        addEngineDescription: "Digite separando com um enter. As variáveis disponíveis são:</br>&emsp;{title} - título do filme</br>&emsp;{year} - ano de lançamento do filme</br>&emsp;{imdb} - ID da posição em www.imdb.com</br>&emsp;[] - fragmento opcional, removido se a etiqueta interna não for encontrada pelo processador do site",
        saveButtonCaption: "Guardar",
        closeCaptionButton: "Fechar",
        resetLinkCaption: "Repor as predefinições",
        configureMenuItem: "Definições"
    },
    pt_BR: {
        settingsTitle: "Configurações do script Torrenter",
        showBuildInEngines: "Mostrar mecanismos de busca incorporados",
        showUserEngines: "Mostrar mecanismos de busca definidos pelo usuário",
        showUserEnginesFirst: "Mostrar primeiro os mecanismos de busca definidos pelo usuário",
        userEngines: "Mecanismos de busca do usuário",
        eg: "p. ex.",
        addEngineDescription: "Digite separando com um enter. As variáveis disponíveis são:</br>&emsp;{title} - título do filme</br>&emsp;{year} - ano de lançamento do filme</br>&emsp;{imdb} - ID da posição em www.imdb.com</br>&emsp;[] - fragmento opcional, removido se a tag interna não for encontrada pelo processador do site",
        saveButtonCaption: "Salvar",
        closeCaptionButton: "Fechar",
        resetLinkCaption: "Redefinir para os padrões",
        configureMenuItem: "Configurações"
    }
};
class Torrenter {
    apply(config, siteProcessor) {
        let torrenterElements = document.getElementsByClassName("torrenter");
        if (torrenterElements && torrenterElements.length > 0) {
            for (let i = torrenterElements.length - 1; i >= 0; i--) {
                torrenterElements[i].remove();
            }
        }
        setTimeout(() => { siteProcessor((tag, style, itemStyle, args) => { return this.createLinkSpan(config, tag, style, itemStyle, args); }); }, 250);
    }
    static getSiteProcessor(hostName) {
        switch (hostName) {
            case "release24.pl":
                return Torrenter.processRelease24;
            case "www.filmweb.pl":
                return Torrenter.processFilmweb;
            case "www.imdb.com":
                return Torrenter.processImdb;
            case "www.rottentomatoes.com":
                return Torrenter.processRottenTomatoes;
        }
    }
    createLinkSpan(config, tag, style, itemStyle, args) {
        let span = document.createElement(tag);
        span.setAttribute("style", style);
        span.classList.add("torrenter");
        let engines = [];
        if (config.showEngines && config.showUserEngines) {
            if (config.showUserEnginesFirst) {
                engines = config.userEngines.concat(config.engines);
            }
            else {
                engines = config.engines.concat(config.userEngines);
            }
        }
        else if (config.showEngines) {
            engines = config.engines;
        }
        else if (config.showUserEngines) {
            engines = config.userEngines;
        }
        for (let i = 0; i < engines.length; i++) {
            let link = document.createElement("a");
            link.setAttribute("href", Torrenter.format(engines[i], args));
            if (itemStyle) {
                link.setAttribute("style", itemStyle);
            }
            let urlRegex = /(https?:\/\/)(.+?)\//;
            let regexResult = engines[i].match(urlRegex);
            link.innerHTML = Torrenter.getFavIconImg(regexResult[2]);
            link.setAttribute("title", regexResult[2]);
            if (i > 0) {
                let separator = document.createElement("span");
                separator.innerHTML = "&nbsp;|&nbsp;";
                span.appendChild(separator);
            }
            span.appendChild(link);
        }
        return span;
    }
    static getFavIconImg(url) {
        return '<img src="' + window.location.protocol + '//www.google.com/s2/favicons?domain=' + url + '" width="16px" height="16px">';
    }
    static format(str, args) {
        return str.replace(/(?:\[[^{}]*?)?{(\w+)}(?:[^{}]*?\])?/g, (text, placeholder) => {
            if (text[0] == "[" && text[text.length - 1] == "]") {
                return args.hasOwnProperty(placeholder) && args[placeholder] != null ? text.substring(1, text.length - 1).replace("{" + placeholder + "}", encodeURIComponent(args[placeholder])) : "";
            }
            else {
                return args.hasOwnProperty(placeholder) ? encodeURIComponent(args[placeholder]) : text;
            }
        });
    }
    static processRelease24(createLinkSpan) {
        let titleElement = document.getElementById("mainwindow");
        let loopCount = titleElement.childElementCount;
        for (let i = 1; i < loopCount; i++) {
            let elem = titleElement.children[i];
            if (elem.className === "wpis") {
                let title_regex = /\"(.*)\"\s*(\(([0-9]{4})\))?/;
                let match = elem.children[0].children[0].innerHTML.match(title_regex);
                if (match != null) {
                    let title = match[1];
                    let year = match.length === 4 && match[3] ? match[3] : null;
                    let span = createLinkSpan("span", "margin-left: 1em; font-weight: normal;", "position: relative; top: 5px;", { title, year });
                    elem.children[2].children[0].children[0].children[0].children[0].children[1].children[0].children[0].children[0].appendChild(span);
                }
            }
        }
    }
    static processFilmweb(createLinkSpan) {
        let titleElement = document.querySelector(".filmCoverSection__title");
        let title;
        let year;
        if (titleElement) {
            let smallTitleElement = document.querySelector(".filmCoverSection__originalTitle");
            if (smallTitleElement) {
                title = smallTitleElement.textContent;
            }
            else {
                title = titleElement.textContent;
            }
            let yearRegexp = /([0-9]{4})/;
            let match = document.querySelector(".filmCoverSection__year").textContent.match(yearRegexp);
            if (match != null) {
                year = match[1];
            }
        }
        let headerElement = document.querySelector(".filmCoverSection__titleDetails");
        if (headerElement && title) {
            headerElement.insertBefore(createLinkSpan("span", "display: inline-flex;", "position: relative; top: 2px; z-index: 1;", { title, year }), document.querySelector('.preview__content'));
        }
    }
    static processImdb(createLinkSpan) {
        let titleElement = document.querySelector('[data-testid*="hero__pageTitle"]');
        let title;
        let year;
        if (titleElement) {
            let smallTitleElement = titleElement.nextElementSibling;
            if (smallTitleElement && smallTitleElement.textContent && smallTitleElement.textContent.indexOf("Original title:") > -1) {
                title = smallTitleElement.textContent;
                // Remove "Original title" prefix
                let titleRegexp = /Original title: (.*)|.*/;
                let titleMatch = title.match(titleRegexp);
                if (titleMatch != null) {
                    title = titleMatch[1];
                }
            }
            else {
                title = titleElement.textContent;
            }
            let yearElement = document.querySelector('[data-testid*="hero__pageTitle"] ~ ul > li');
            if (yearElement) {
                let yearRegexp = /([0-9]{4})/;
                let match = yearElement.textContent.match(yearRegexp);
                if (match != null) {
                    year = match[1];
                }
            }
        }
        let headerElement = document.querySelector('[data-testid*="hero__pageTitle"] ~ ul');
        if (headerElement && title) {
            let match = window.location.pathname.match(/\/(tt.*?)(?:\/|\?|$)/i);
            let imdb = match != null ? match[1] : null;
            headerElement.appendChild(createLinkSpan("span", "margin-left: 1em; display: inline-block;", null, { title, year, imdb }));
        }
    }
    static processRottenTomatoes(createLinkSpan) {
        let titleElement = document.querySelector("media-hero rt-text[slot=title]");
        let title;
        let year;
        if (titleElement) {
            title = titleElement.textContent;
            let yearRegexp = /([0-9]{4})/;
            let match = document.querySelectorAll("media-hero rt-text[slot=metadataProp]")[1].textContent.match(yearRegexp);
            if (match != null) {
                year = match[1];
            }
        }
        let headerElement = document.querySelector("media-hero rt-text[slot=title]");
        if (headerElement && title) {
            headerElement.appendChild(createLinkSpan("span", "margin-left: 1em;font-size: 0.5em;position: relative;top: -7px;", "position: relative; top: 2px;", { title, year }));
        }
    }
}
let hostName = window.location.hostname;
let siteProcessor = Torrenter.getSiteProcessor(hostName);
let applyFunction = (config) => {
    if (siteProcessor) {
        let torrenter = new Torrenter();
        torrenter.apply(config, siteProcessor);
    }
};
let configurator = new TorrenterConfigurator(() => applyFunction(configurator.getConfiguration()), () => applyFunction(configurator.getConfiguration()));
