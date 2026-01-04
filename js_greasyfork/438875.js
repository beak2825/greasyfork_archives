// ==UserScript==
// @name         TradingView Toggle Auto hotkey
// @namespace    https://gist.github.com/cleardevice/febc6f4110e1674054b91ecb5760f3c4
// @version      0.1
// @license      MIT
// @description  Toggle Auto on TradingView by Alt-;
// @author       cleardevice
// @match        https://www.tradingview.com/chart/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438875/TradingView%20Toggle%20Auto%20hotkey.user.js
// @updateURL https://update.greasyfork.org/scripts/438875/TradingView%20Toggle%20Auto%20hotkey.meta.js
// ==/UserScript==

var hotKey = ';';

function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function doc_keyDown(e) {
    if (e.altKey && e.key==hotKey) {
        e.preventDefault();
        var elAuto = getElementByXpath('//div[contains(@class,"chart-controls-bar")]//div[contains(@class,"seriesControlWrapper")]/div[last()]/div');
        elAuto.click();
    }
}
document.addEventListener('keydown', doc_keyDown, false);