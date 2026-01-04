// ==UserScript==
// @name         Geoguessr Styles Scan
// @description  Provides utility functions to make your geoguessr scripts independent of arbitrary changes to class name suffixes
// @version      1.0.1
// @author       victheturtle#5159
// @license      MIT
// @namespace    https://greasyfork.org/users/967692-victheturtle
// ==/UserScript==

const _cndic = {};
const _hrefset = new Set();

async function scanStyles() {
    for (let node of document.querySelectorAll('head link[rel="stylesheet"], head style[data-n-href*=".css"]')) {
        const href = node.href || location.origin+node.dataset.nHref;
        if (_hrefset.has(href)) continue;
        _hrefset.add(href);
        await fetch(href)
        .then(res => res.text())
        .then(stylesheet => {
            for (let className of stylesheet.split(".")) {
                const ind = className.indexOf("__");
                if (ind != -1) _cndic[className.substr(0, ind+2)] = className.substr(0, ind+7);
            };
        });
    };
};

const cn = (classNameStart) => _cndic[classNameStart]; // cn("status_section__") -> "status_section__8uP8o"

const checkAllStylesFound = (STYLES_USED) => STYLES_USED.reduce((res, className) => res && cn(className), true);

async function requireClassName(classNameStart) {
    if (_cndic[classNameStart]) return _cndic[classNameStart];
    return await scanStyles().then(() => _cndic[classNameStart]);
}
