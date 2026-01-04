// ==UserScript==
// @name         HWMShortHeader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       Mirn
// @description  ShortHeader
// @match        https://www.heroeswm.ru/map.php
// @grant        none
// @run-at        document-end
// @include        https://www.heroeswm.ru/*
// @include        https://www.lordswm.com/*
// @include        http://178.248.235.15/*
// @downloadURL https://update.greasyfork.org/scripts/421458/HWMShortHeader.user.js
// @updateURL https://update.greasyfork.org/scripts/421458/HWMShortHeader.meta.js
// ==/UserScript==

(function() {

    var ids = ['MenuTavern', 'MenuRoulette', 'MenuStat', 'MenuChat'];

    ids.forEach(id => {
        var el = getElementByXpath("//div[contains(@id,'" + id + "')]/ancestor::div[contains(@class, 'mm_item')]");
        el.style.display = 'none';
    })

})();

function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}