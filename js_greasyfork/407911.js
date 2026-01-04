

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
75
76
77
78
79
80
81
82

// ==UserScript==
// @name         BaB view currency
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Displays euro currency on top of bustabit
// @author       StatPlayer
// @match        https://www.bustabit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407911/BaB%20view%20currency.user.js
// @updateURL https://update.greasyfork.org/scripts/407911/BaB%20view%20currency.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let waitInterval = setInterval(function() {
        if (document.querySelector('[href="/logout"]') != null) { // waits for the logout button to appear, i.e. we are logged in and at the play screen
            elementFound();
            clearInterval(waitInterval);
        }
    }, 200);
})();

function mutate(mutations) {
  mutations.forEach(function(mutation) {
    alert(mutation.type);
  });
}

function elementFound() {
    let logoutElem = document.querySelector('[href="/logout"]').parentNode;
    let currencyDisplayLI = document.createElement("li");
    let currencyDisplayAnchor = document.createElement("a");
    currencyDisplayAnchor.setAttribute("href", "https://google.com");
    currencyDisplayAnchor.setAttribute("target", "_blank");
    currencyDisplayAnchor.setAttribute("style", "padding: 15px 8px; text-decoration: none; text-transform: uppercase; letter-spacing: 2px; font-size: 12px;");
    let currencyDisplay = document.createElement("span");
    currencyDisplay.textContent = "Loading...";
    currencyDisplayAnchor.appendChild(currencyDisplay);
    currencyDisplayLI.appendChild(currencyDisplayAnchor);
    logoutElem.parentNode.insertBefore(currencyDisplayLI, logoutElem);

    let btcLoaded = false;
    let btcToEur = 10.73;

    let target = document.querySelector('[href="/account/stats"]');

    function mutated() {
        if (!btcLoaded) return;
        let bits = Number.parseFloat(target.children[0].childNodes[1].textContent.replace(/,/g, ''));
        let btc = bits / 1000000;
        let euroPrice = btcToEur*btc;
        currencyDisplay.textContent = "€"+(Math.round(euroPrice*100)/100);
        currencyDisplayAnchor.setAttribute("href", `https://google.com/search?q=${btc}+btc+to+EUR`); // link when users click
    }
    let observer = new MutationObserver( function(mutations) {
        mutated();
    });
    let config = { characterData: true, attributes: false, childList: true, subtree: true };

    observer.observe(target, config);

    mutated();

    function updateBTC() {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "https://blockchain.info/ticker");
        xhr.onload = function() {
            btcToEur = JSON.parse(xhr.response).EUR.last;
            btcLoaded = true;
            console.log("New BTC exchange rate:" + btcToEur);
            mutated();
        };
        xhr.onerror = function() {
            alert(`Error retrieving bitcoin exchange rate`);
        };
        xhr.send();
    }

    updateBTC();

    setInterval(function() {
        updateBTC();
    }, 300000);
}

