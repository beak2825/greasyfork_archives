// ==UserScript==
// @name         Citadeli UI
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Slight improvements to UI.
// @author       You
// @match        https://citadeli.ru/game/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=citadeli.ru
// @license      GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462611/Citadeli%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/462611/Citadeli%20UI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const turnStart = /^(?<before>ходит )(?<name>.+?)(?<after>)$/;
    const finishedTurn = /^(?<before>)(?<name>.+?)(?<after> завершил свой ход)$/;
    const turnTimeout = /^(?<before>)(?<name>.+?)(?<after> пропускает свой ход по таймауту)$/;
    const goldStolen = /^(?<before>Вор )(?<name>.+?)(?<after> своровал \d+? золота у .+? .+?)$/;

    const selectedCard = /^(?<before>)(?<name>.+?)(?<after> выбрал карту персонажа)$/;
    const takeGold = /^(?<before>)(?<name>.+?)(?<after> своим действием берёт золото)$/;
    const build = /^(?<before>)(?<name>.+?)(?<after> платит \d+? золота\(ых\), и строит .+?)$/;
    const drawCards = /^(?<before>)(?<name>.+?)(?<after> своим действием тянет карты)$/;

    const takesCrown = /^(?<before>)(?<name>.+?)(?<after> получает корону)$/;
    const merchantTakesCoin = /^(?<before>Купец )(?<name>.+?)(?<after> берет дополнительную монентку)$/;
    const stealGold = /^(?<before>Вор )(?<name>.+?)(?<after> ворует у зодчий)$/;
    const stealCards = /^(?<before>Чародей )(?<name>.+?)(?<after> тянет \d+? карту\(карт\) из колоды)$/;
    const gatherTax = /^(?<before>)(?<name>.+?)(?<after> получает \d+? золота\(ых\) налогов)$/;
    const drawAdditionalCards = /^(?<before>)(?<name>.+?)(?<after> takes two additional cards as an Architect)$/;
    const destroyBuilding = /^(?<before>Кондротьер )(?<name>.+?)(?<after> уничтожает квартал фиолетовый, \w+?, и платит \d+? золота)$/;
    const thiefSteals = /^(?<before>Вор )(?<name>.+?)(?<after> ворует у \w+?)$/;

    const assassinTurn = /^(?<before>Король вызывает Ассасина, )(?<name>.+?)(?<after> - Ассасин)$/;
    const thiefTurn = /^(?<before>Король вызывает Вора, )(?<name>.+?)(?<after> - Вор)$/;
    const magicianTurn = /^(?<before>Король вызывает Чародея, )(?<name>.+?)(?<after> - Чародей)$/;
    const kingTurn = /^(?<before>Король вызывает Короля, )(?<name>.+?)(?<after> - Король)$/;
    const bishopTurn = /^(?<before>Король вызывает Епископа, )(?<name>.+?)(?<after> - Епископ)$/;
    const merchantTurn = /^(?<before>Король вызывает Купца, )(?<name>.+?)(?<after> - Купец)$/;
    const architectTurn = /^(?<before>Король вызывает Зодчего, )(?<name>.+?)(?<after> - Зодчий)$/;
    const warlordTurn = /^(?<before>Король вызывает Кондотьера, )(?<name>.+?)(?<after> - Кондотьер)$/;

    console.log("hello world");
    $(document).ready(function() {
        const history = $("#history").contents().filter(function() {
            return this.nodeType === 3; //Node.TEXT_NODE
        });
        for (const item of history) {
            const text = item.wholeText.trim();
            tryRegex(item, text, turnStart)
            || tryRegex(item, text, finishedTurn)
            || tryRegex(item, text, turnTimeout)

            || tryRegex(item, text, goldStolen)

            || tryRegex(item, text, selectedCard)
            || tryRegex(item, text, takeGold)
            || tryRegex(item, text, build)
            || tryRegex(item, text, drawCards)

            || tryRegex(item, text, assassinTurn)
            || tryRegex(item, text, thiefTurn)
            || tryRegex(item, text, magicianTurn)
            || tryRegex(item, text, kingTurn)
            || tryRegex(item, text, bishopTurn)
            || tryRegex(item, text, merchantTurn)
            || tryRegex(item, text, architectTurn)
            || tryRegex(item, text, warlordTurn)

            || tryRegex(item, text, takesCrown)
            || tryRegex(item, text, merchantTakesCoin)
            || tryRegex(item, text, stealGold)
            || tryRegex(item, text, stealCards)
            || tryRegex(item, text, gatherTax)
            || tryRegex(item, text, drawAdditionalCards)
            || tryRegex(item, text, destroyBuilding)
            || tryRegex(item, text, thiefSteals);
        }
    });

    function tryRegex(item, text, regex) {
        const newText = text.replace(regex, "$<before><b>$<name></b>$<after>");
        if (newText != text) {
            $(item).replaceWith(newText);
            return true;
        }
        return false;
    }
})();