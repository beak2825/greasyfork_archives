// ==UserScript==
// @name         Kinopoisk subtitle petition
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Helper for subtitle petition
// @author       Apkawa
// @license      MIT
// @match        https://forms.yandex.ru/surveys/10022784.8ae29888f3224e212d4a904160b6baf0a05acd37/*
// @match        https://hd.kinopoisk.ru/*
// @match        https://kinopoisk.ru/*
// @match        https://www.kinopoisk.ru/*
// @icon         https://www.google.com/s2/favicons?domain=kinopoisk.ru
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant        none
// @homepage     https://github.com/Apkawa/userscripts
// @homepageUrl  https://github.com/Apkawa/userscripts
// @supportUrl   https://github.com/Apkawa/userscripts/issues
// @downloadUrl  https://github.com/Apkawa/userscripts/raw/master/dist/hd.kinopoisk.ru/kp_subtitle_petition.user.js
// @updateUrl    https://github.com/Apkawa/userscripts/raw/master/dist/hd.kinopoisk.ru/kp_subtitle_petition.user.js
// @downloadURL https://update.greasyfork.org/scripts/433362/Kinopoisk%20subtitle%20petition.user.js
// @updateURL https://update.greasyfork.org/scripts/433362/Kinopoisk%20subtitle%20petition.meta.js
// ==/UserScript==
(function() {
    "use strict";
    function getElementByXpath(xpath, root = document) {
        const e = document.evaluate(xpath, root, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        return e && e;
    }
    function getElementsByXpath(xpath, root = document) {
        const iterator = document.evaluate(xpath, root, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
        const result = [];
        let el = iterator.iterateNext();
        while (el) {
            result.push(el);
            el = iterator.iterateNext();
        }
        return result;
    }
    function markElementHandled(wrapFn, attrName = "_handled") {
        return function(el) {
            if (el.getAttribute(attrName)) return;
            el.setAttribute(attrName, "1");
            wrapFn(el);
        };
    }
    function waitElement(match, callback, root = document.body) {
        const observer = new MutationObserver((mutations => {
            let matchFlag = false;
            mutations.forEach((mutation => {
                if (!mutation.addedNodes) return;
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    const node = mutation.addedNodes[i];
                    matchFlag = match(node);
                }
            }));
            if (matchFlag) {
                _stop();
                callback();
                _start();
            }
        }));
        let isStarted = false;
        function _start() {
            if (isStarted) return;
            observer.observe(root || document.body, {
                childList: true,
                subtree: true,
                attributes: false,
                characterData: false
            });
            isStarted = true;
        }
        function _stop() {
            observer.disconnect();
            isStarted = false;
        }
        _start();
        return () => {
            _stop();
        };
    }
    function E(tag, attributes = {}, ...children) {
        const element = document.createElement(tag);
        for (const [k, v] of Object.entries(attributes)) element.setAttribute(k, v);
        const fragment = document.createDocumentFragment();
        children.forEach((child => {
            if ("string" === typeof child) child = document.createTextNode(child);
            fragment.appendChild(child);
        }));
        element.appendChild(fragment);
        return element;
    }
    function mapLocation(map) {
        const s = document.location.hostname + document.location.pathname;
        for (const [k, v] of Object.entries(map)) if (RegExp(k).test(s)) v();
    }
    function parseSearch() {
        return Object.fromEntries(new URLSearchParams(window.location.search).entries());
    }
    Object.keys;
    Object.entries;
    Object.values;
    const FORM_URL = "https://forms.yandex.ru/surveys/10022784.8ae29888f3224e212d4a904160b6baf0a05acd37/";
    function radioByText(text) {
        const xpath = `//p[text() = '${text}']/../..`;
        const matchingElement = getElementByXpath(xpath);
        null === matchingElement || void 0 === matchingElement ? void 0 : matchingElement.click();
    }
    function selectByLabel(label, option) {
        const xpath = `//p[text() = '${label}']/ancestor::tbody//select`;
        const select = getElementByXpath(xpath);
        const selected = getElementByXpath(`//option[@selected]`, select);
        selected.removeAttribute("selected");
        const opt = getElementByXpath(`//option[text() = '${option}']`, select);
        select.value = null === opt || void 0 === opt ? void 0 : opt.value;
        opt.setAttribute("selected", "1");
        return select;
    }
    function fillInputByLabel(label, text) {
        const xpath = `//p[text() = '${label}']/ancestor::tbody//input`;
        const el = getElementByXpath(xpath);
        el.value = text;
        return el;
    }
    function getUserName() {
        const el = getElementByXpath(`//span[@class='user__name']`);
        return (null === el || void 0 === el ? void 0 : el.innerText) || "";
    }
    function normalizeKPLink(s) {
        return s.replace(/www\./, "");
    }
    function renderHdKinopoiskRequestLink(sub) {
        const filmContainer = getElementByXpath("ancestor::section", sub);
        if (!filmContainer) return;
        const subNames = [].slice.call(sub.getElementsByTagName("li")).map((el => el.innerText));
        const audio = getElementByXpath(`//div[text() = 'Аудиодорожки']/../ul`);
        const audioNames = [].slice.call(null === audio || void 0 === audio ? void 0 : audio.getElementsByTagName("li")).map((el => el.innerText));
        function getInfo() {
            const link = getElementByXpath(`//a[text() ='Подробнее на КиноПоиске']`, filmContainer).href.toString();
            const type = getElementByXpath(`//button[text() = 'О сериале']`) ? "series" : "film";
            return {
                link: normalizeKPLink(link),
                type: type
            };
        }
        if (!audioNames.includes("Английский")) {
            const info = Object.assign(Object.assign({}, getInfo()), {
                mode: "audio"
            });
            const formUrl = FORM_URL + "?" + new URLSearchParams(info).toString();
            const li = E("li", {}, E("a", {
                href: formUrl,
                target: "_blank"
            }, "Запросить оригинальную озвучку"));
            null === audio || void 0 === audio ? void 0 : audio.appendChild(li);
        }
        if (!subNames.includes("Русские")) {
            const info = getInfo();
            const formUrl = FORM_URL + "?" + new URLSearchParams(info).toString();
            const li = E("li", {}, E("a", {
                href: formUrl,
                target: "_blank"
            }, "Запросить русские сабы"));
            sub.appendChild(li);
        }
    }
    function renderKinopoiskRequestLink(sub) {
        var _a, _b;
        const filmContainer = getElementByXpath("ancestor::body", sub);
        if (!filmContainer) return;
        const country = null === (_a = getElementByXpath(`//div[text() = 'Страна']/following-sibling::div`, filmContainer)) || void 0 === _a ? void 0 : _a.innerText;
        const audio = getElementByXpath(`//div[text() = 'Аудиодорожки']/following-sibling::div`, filmContainer);
        const audioNames = null === audio || void 0 === audio ? void 0 : audio.innerText.split(", ");
        const subNames = sub.innerText.split(", ");
        const info = {
            link: normalizeKPLink(window.location.href),
            type: (null === (_b = /https:\/\/(?:www.|)kinopoisk.ru\/(series|film)\//.exec(window.location.href)) || void 0 === _b ? void 0 : _b[1]) || ""
        };
        if (!(null === audioNames || void 0 === audioNames ? void 0 : audioNames.includes("Английский")) && "Россия" !== country) {
            const formUrl = FORM_URL + "?" + new URLSearchParams(Object.assign(Object.assign({}, info), {
                mode: "audio"
            })).toString();
            const li = E("a", {
                href: formUrl,
                target: "_blank"
            }, "Запросить оригинальную озвучку");
            null === audio || void 0 === audio ? void 0 : audio.appendChild(li);
        }
        if (!subNames.includes("Русские")) {
            const formUrl = FORM_URL + "?" + new URLSearchParams(info).toString();
            const li = E("a", {
                href: formUrl,
                target: "_blank"
            }, "Запросить русские сабы");
            sub.appendChild(li);
        }
    }
    (function() {
        console.warn("DEPRECATED");
        mapLocation({
            "^forms.yandex.ru/": () => {
                const params = parseSearch();
                if ("film" === params.type) radioByText("Фильм"); else radioByText("Сериал");
                if ("audio" === params.mode) {
                    radioByText("Аудиодорожку/озвучку");
                    selectByLabel("Какую аудиодорожку добавить?", "Оригинальную");
                } else {
                    radioByText("Субтитры");
                    const el = fillInputByLabel("Выберите субтитры:", params.lang || "Русский");
                    const hiddenEl = getElementByXpath(`ancestor::table//input[@type='hidden']`, el);
                    null === hiddenEl || void 0 === hiddenEl ? void 0 : hiddenEl.setAttribute("value", "30010730");
                }
                fillInputByLabel("Ссылка на фильм/сериал на КиноПоиске", params.link || "");
                fillInputByLabel("Ваша почта", `${getUserName()}@yandex.ru`);
            },
            "^hd.kinopoisk.ru/": () => {
                const xpath = `//div[text() = 'Субтитры']/../ul`;
                waitElement((el => Boolean(getElementByXpath(xpath, el))), (() => {
                    const subtitles = getElementsByXpath(xpath);
                    for (const el of subtitles) markElementHandled(renderHdKinopoiskRequestLink)(el);
                }));
            },
            "(www.|)kinopoisk.ru/(series|film)": () => {
                const xpath = `//div[text() = 'Субтитры']/following-sibling::div`;
                waitElement((el => Boolean(getElementByXpath(xpath, el))), (() => {
                    const subtitles = getElementsByXpath(xpath);
                    for (const el of subtitles) markElementHandled(renderKinopoiskRequestLink)(el);
                }));
            }
        });
    })();
})();