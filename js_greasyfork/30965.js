// ==UserScript==
// @name         Subeta Autobuy
// @namespace    http://artees.pw/
// @description  This script automatically buys items at the lowest price on the Shop Search page.
// @version      0.5
// @author       Artees
// @match        *://subeta.net/user_shops.php/search/shops/*
// @match        *://subeta.net/shop.php?shopid=*
// @match        *://subeta.net/explore/pawn.php/buy/*
// @grant        none
// @icon         https://subeta.net/favicon.ico
// @icon64       https://img.subeta.net/items/accessory_hustlermoneyclip.gif
// ==/UserScript==

const KEY_AUTOBUY_SOURCE = "autobuySource",
    KEY_AUTOBUY_NPC = "autobuyNpc";

function autobuy() {
    setTimeout(buy, 1000);

    function buy() {
        var source = sessionStorage[KEY_AUTOBUY_SOURCE];
        if (source === undefined) return;
        sessionStorage.removeItem(KEY_AUTOBUY_SOURCE);
        setTimeout(goBack, 20000);
        function goBack() {
            open(source, "_self");
        }
        var rows = getRows(),
            items = [];
        if (rows.length === 0) return;
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i],
                buttons = getButtons(row);
            if (buttons.length === 0) continue;
            items.push(row);
        }
        function getButtons(e) {
            return e.getElementsByClassName("btn btn-primary btn-sm");
        }
        items.sort(comparePrices);
        var item = items[0],
            isNPC = item.innerText.indexOf("NPC Shop") !== -1;
        if (isNPC) {
            sessionStorage[KEY_AUTOBUY_NPC] = source;
        }
        var button = getButtons(item)[0],
            countdown = getCountdown(),
            nextButton = getButtons(items[1])[0],
            openCount = 0,
            clickCount = 4,
            clickIntervalId = setInterval(click, 1000);
        function getCountdown () {
            var s = document.getElementsByTagName("strong");
            for (var i = 0; i < rows.length; i++) {
                if (s[i].innerText === "Buy") return s[i];
            }
        }
        countdown.innerText = clickCount.toString();
        function click() {
            clickCount--;
            countdown.innerText = clickCount.toString();
            if (clickCount > 0) return;
            clearInterval(clickIntervalId);
            button.click();
            if (!isNPC) {
                var sourceIntervalId = setInterval(openSource, 500);
            }
            function openSource() {
                openCount++;
                if (button.disabled && nextButton.disabled && openCount < 10) return;
                open(source, "_self");
                clearInterval(sourceIntervalId);
            }
        }
    }

    function getRows() {
        return document.getElementsByClassName("row");
    }

    function comparePrices(a, b) {
        var aPrice = getPrice(a),
            bPrice = getPrice(b);
        function getPrice(item) {
            var itemText = item.innerHTML,
                end = itemText.indexOf(" sP"),
                start = itemText.lastIndexOf(">", end) + 1,
                priceText = replaceAll(itemText.substring(start, end), ",", "");
            return parseInt(priceText);
        }
        return aPrice - bPrice;
    }

    function replaceAll(target, searchValue, replaceValue) {
        return target.replace(new RegExp(searchValue, 'g'), replaceValue);
    }

    back();

    function back() {
        if (getRows().length > 0) return;
        var npcSource = sessionStorage[KEY_AUTOBUY_NPC];
        if (npcSource === undefined) return;
        sessionStorage.removeItem(KEY_AUTOBUY_NPC);
        open(npcSource, "_self");
    }
}