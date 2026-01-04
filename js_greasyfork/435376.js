// ==UserScript==
// @name            ShikiLinker
// @description     Редирект-кнопка для Shikimori, которая перенаправляет на Anime365
// @description:en  Redirect button for Shikimori that redirects to Anime 365
// @icon            https://www.google.com/s2/favicons?domain=shikimori.one&sz=64
// @namespace       https://shikimori.one/animes
// @match           https://shikimori.one/animes/*
// @connect         smotret-anime.org
// @grant           GM_xmlhttpRequest
// @author          Jogeer
// @license         MIT
// @version         4.0.0
// @downloadURL https://update.greasyfork.org/scripts/435376/ShikiLinker.user.js
// @updateURL https://update.greasyfork.org/scripts/435376/ShikiLinker.meta.js
// ==/UserScript==
"use strict";
const DEBUG = true;
const SCRIPT = "ShikiLinker";
const ANIME365 = "smotret-anime.org";
const ORIGIN_KEY = "en";
const PAGEURL = new RegExp(/^https?:\/\/shikimori\.o(?:ne|rg)\/animes\/[A-z]?(\d*)-(.*)$/);
//#region Const
const LOCALE = navigator.language.split("-")[0] || ORIGIN_KEY;
const STYLES = {
    class: {
        parent: ".c-about .c-info-right",
        main: `${SCRIPT}`,
        button: `${SCRIPT}-btn`,
        increment: ".rate-show .current-episodes",
    },
    container: {
        parent: "display:flex;flex-direction:row;flex-wrap:wrap;align-content:center;justify-content:center;align-items:center;margin-top:10px",
        button: "text-align:center;background:#18181b;color:white;margin: 0 10px;user-select:none;",
        buttonTo: "flex:1 1 auto;padding:5px;max-width: 160px;",
        buttonEp: "flex:0 1 auto;padding:5px 15px;",
        span: "width:100%;text-align:center;",
    },
};
const CONST = {
    url: {
        shikimori: `https://${globalThis.window.location.hostname}/`,
        anime365: `https://${ANIME365}/`,
    },
    apiUrl: {
        shikimori: `https://${globalThis.window.location.hostname}/api/`,
        anime365: `https://${ANIME365}/api/`,
    },
    headers: {
        default: { "Content-type": "application/json" },
    },
    tags: {
        parentElement: [
            { key: "id", value: STYLES.class.main },
            { key: "class", value: "watch-online" },
            { key: "style", value: STYLES.container.parent },
        ],
        toTitle: [
            { key: "class", value: "link-button" },
            { key: "target", value: "_blank" },
            {
                key: "style",
                value: `${STYLES.container.button}${STYLES.container.buttonTo}`,
            },
        ],
        toEpisode: [
            { key: "class", value: "link-button" },
            { key: "target", value: "_blank" },
            { key: "id", value: STYLES.class.button },
            {
                key: "style",
                value: `${STYLES.container.button}${STYLES.container.buttonEp}`,
            },
        ],
        infoSpan: [{ key: "style", value: STYLES.container.span }],
    },
};
const translations = {
    ru: {
        button: {
            main: {
                text: "Anime 365",
            },
            episode: {
                first: "Первая серия",
                origin: "Серия",
                null: "🚫",
            },
        },
    },
    en: {
        button: {
            main: {
                text: "Anime 365",
            },
            episode: {
                first: "First Episode",
                origin: "Episode",
                null: "🚫",
            },
        },
    },
};
//#endregion
//#region Utils
function LOG(...atrs) {
    const prefix = `%c [${SCRIPT}] `;
    const style = "color:#419541;background:black;";
    DEBUG && console.log(prefix, style, ...atrs);
}
function ns(key) {
    var _a;
    const [lang, _keys] = key.split(":");
    const keys = _keys.split(".");
    const langKey = ((_a = lang !== null && lang !== void 0 ? lang : ORIGIN_KEY) !== null && _a !== void 0 ? _a : "en");
    const translation = keys.reduce((obj, k) => obj === null || obj === void 0 ? void 0 : obj[k], translations[langKey]);
    return translation || key;
}
//#endregion
//#region Main
class ShikiLinker {
    constructor() {
        this._animeId = this._GetAinimeId();
        this._shikiUserData = this._GetUserData();
        this._shikiApiData = null;
        this._anime365ApiData = null;
    }
    _GetAinimeId() {
        var _a;
        return (_a = PAGEURL.exec(globalThis.window.location.href)) === null || _a === void 0 ? void 0 : _a[1];
    }
    _GetUserData() {
        var _a;
        const data = (_a = document.body.dataset.user) !== null && _a !== void 0 ? _a : "{}";
        return JSON.parse(data);
    }
    _GetUserId() {
        return this._shikiUserData.id;
    }
    //#region REQUESTS
    async _MakeRequest(url) {
        return GM.xmlHttpRequest({
            method: "GET",
            headers: CONST.headers.default,
            url,
        });
    }
    async _GetShikimoriApiData() {
        LOG("> GetShikimoriApiData > {IN}");
        const userId = this._GetUserId();
        const url = `${CONST.apiUrl.shikimori}v2/user_rates?user_id=${userId}&target_id=${this._animeId}&target_type=Anime`;
        try {
            const response = await this._MakeRequest(url);
            const parsed = JSON.parse(response.responseText)[0];
            this._shikiApiData = parsed;
            LOG("> _GetShikimoriApiData > DATA:", this._shikiApiData);
        }
        catch (error) {
            console.error(error);
            this._shikiApiData = null;
        }
    }
    async _GetAnime365ApiData() {
        var _a;
        LOG("> GetAnime365ApiData > {IN}");
        const url = `${CONST.apiUrl.anime365}series?myAnimeListId=${this._animeId}`;
        try {
            const response = await this._MakeRequest(url);
            const parsed = JSON.parse(response.responseText);
            this._anime365ApiData = (_a = parsed.data) === null || _a === void 0 ? void 0 : _a[0];
            LOG("> _GetAnime365ApiData > DATA:", this._anime365ApiData);
        }
        catch (error) {
            console.error(error);
            this._anime365ApiData = null;
        }
    }
    //#endregion
    _UpdateGotoButton() {
        LOG("> UpdateGotoButton > {IN}");
        if (!this._anime365ApiData) {
            return;
        }
        const regex = /(?:https:\/\/)(?:.*?\/)(.*)/;
        const match = regex.exec(this._anime365ApiData.url);
        const element = document.querySelector(`#${STYLES.class.main} a`);
        if (match && element) {
            element.setAttribute("href", `${CONST.url.anime365}${match[1]}`);
        }
    }
    _UpdateEpisodeButton() {
        LOG("> UpdateEpisodeButton > {IN}");
        const element = document.querySelector(`#${STYLES.class.button}`);
        const base = `${CONST.url.anime365}episodes/`;
        let text = ns(`${LOCALE}:button.episode.null`);
        let href = "#";
        if (!element || !this._anime365ApiData) {
            return;
        }
        const episodes = this._anime365ApiData.episodes.filter((ep) => ["ona", "ova", "movie", "tv"].includes(ep.episodeType));
        if (this._shikiApiData) {
            const total = episodes.length;
            const watched = this._shikiApiData.episodes;
            if (["completed"].includes(this._shikiApiData.status)) {
                href = `${base}${episodes[0].id}`;
                text = ns(`${LOCALE}:button.episode.first`);
            }
            else if (total > watched) {
                href = `${base}${episodes[watched].id}`;
                text = `${watched + 1} ${ns(`${LOCALE}:button.episode.origin`)}`;
            }
            else if (total === watched) {
                href = `${base}${episodes[watched - 1].id}`;
                text = `${watched} ${ns(`${LOCALE}:button.episode.origin`)}`;
            }
        }
        else {
            href = `${base}${episodes[0].id}`;
            text = ns(`${LOCALE}:button.episode.first`);
        }
        element.setAttribute("href", href);
        element.textContent = text;
    }
    _CreateUpdateObserver() {
        LOG("> _CreateUpdateObserver (XHR / user_rates) > {IN}");
        const self = this;
        const USER_RATES_RX = /\/api\/v2\/user_rates/i;
        if (globalThis.__ShikiLinker_XHR_Patched) {
            return;
        }
        globalThis.__ShikiLinker_XHR_Patched = true;
        const origOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, url, ...rest) {
            const isIncrement = method.toUpperCase() === "POST" && url && USER_RATES_RX.test(url.toString());
            isIncrement &&
                this.addEventListener("load", async () => {
                    LOG("Detected increment request:", url);
                    try {
                        await self._GetShikimoriApiData();
                        self._UpdateEpisodeButton();
                    }
                    catch (e) {
                        LOG("Error after increment:", e);
                    }
                });
            return origOpen.call(this, method, url, ...rest);
        };
    }
    //#region Build
    _CreateSubElement(tag, attributes) {
        let element = document.createElement(tag);
        if (attributes) {
            for (const attribute of attributes) {
                element.setAttribute(attribute.key, attribute.value);
            }
        }
        return element;
    }
    _CreateChildElements() {
        LOG("(BUILD) > CreateChildElements > {IN}");
        let anime365Button = this._CreateSubElement("a", CONST.tags.toTitle);
        anime365Button.textContent = ns(`${LOCALE}:button.main.text`);
        let goToEpisodeButton = this._CreateSubElement("a", CONST.tags.toEpisode);
        goToEpisodeButton.textContent = ns(`${LOCALE}:button.episode.null`);
        let addonInfoSpan = this._CreateSubElement("span", CONST.tags.infoSpan);
        addonInfoSpan.textContent = STYLES.class.main;
        return [anime365Button, goToEpisodeButton, addonInfoSpan];
    }
    _CreateParentElement() {
        LOG("(BUILD) > CreateParentElement > {IN}");
        let element = this._CreateSubElement("div", CONST.tags.parentElement);
        return element;
    }
    _CreateElement() {
        LOG("(BUILD) > CreateElement > {IN}");
        const target = document.querySelector(STYLES.class.parent);
        const parent = this._CreateParentElement();
        const childs = this._CreateChildElements();
        for (const child of childs) {
            parent.appendChild(child);
        }
        return target === null || target === void 0 ? void 0 : target.appendChild(parent);
    }
    //#endregion
    async Execute() {
        LOG("> Execute > {IN}");
        if (!document.querySelector(`#${STYLES.class.main}`)) {
            this._CreateElement();
        }
        await Promise.all([this._GetShikimoriApiData(), this._GetAnime365ApiData()]);
        this._UpdateGotoButton();
        this._UpdateEpisodeButton();
        this._CreateUpdateObserver();
    }
}
//#endregion
//#region Support
function waitForElement(selector, callback) {
    const element = document.querySelector(selector);
    if (element) {
        callback(element);
        return;
    }
    const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element) {
            observer.disconnect();
            callback(element);
        }
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
}
function watchAnimePageChanges(callback) {
    let currentAnimeId = null;
    const getAnimeId = () => { var _a, _b; return (_b = (_a = PAGEURL.exec(globalThis.window.location.href)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : null; };
    const isItNeedToUpdate = async () => {
        const animeId = getAnimeId();
        const existing = document.querySelector(`#${STYLES.class.main}`);
        if (!animeId && existing) {
            existing.remove();
            currentAnimeId = null;
            return;
        }
        if (animeId && animeId !== currentAnimeId) {
            if (existing) {
                existing.remove();
            }
            currentAnimeId = animeId;
            waitForElement(STYLES.class.parent, callback);
        }
    };
    document.addEventListener("turbolinks:load", isItNeedToUpdate);
    globalThis.window.addEventListener("popstate", isItNeedToUpdate);
    // Первичная инициализация
    isItNeedToUpdate();
}
//#endregion
//#region Init
watchAnimePageChanges(() => {
    try {
        const shikiLinker = new ShikiLinker();
        shikiLinker.Execute();
    }
    catch (error) {
        console.error(`${SCRIPT} error:`, error);
    }
});
//#endregion