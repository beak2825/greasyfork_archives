// ==UserScript==
// @name         OF Ticket Counter (OTC)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Ticket reply counter
// @author       Roland CS
// @match        https://onlyfans.zendesk.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/424351/OF%20Ticket%20Counter%20%28OTC%29.user.js
// @updateURL https://update.greasyfork.org/scripts/424351/OF%20Ticket%20Counter%20%28OTC%29.meta.js
// ==/UserScript==

(function () {

    const counterCheck = function () {
        if (GM_getValue('counter')) {
            let counter = GM_getValue('counter');
            GM_setValue('counter', ++counter);
            alert('Added');
        } else {
            GM_setValue('counter', 1)
            alert('Started');
        }
    }

    const counterMinus = function () {
        if (GM_getValue('counter')) {
            let counter = GM_getValue('counter');
            GM_setValue('counter', --counter);
            alert('-1');
        }
    }

    const checkDate = function (day) {
        if (GM_getValue('date')) {
            if (GM_getValue('date') !== day) {
                GM_setValue('counter', 0);
                GM_setValue('day', day);
            }
        } else {
            GM_setValue('day', day)
        }
    }

    const counterToZero = () => {
        GM_setValue('counter', 0)
    }

    const checkCounterElement = function (bar) {
        let counterValue = document.getElementById('counter-id-value')
        if (counterValue) {
            counterValue.innerHTML = counterValue.innerHTML = GM_getValue('counter');
        } else {
            createCounterObject(bar);
        }
    }

    const createCounterObject = function (bar) {

        let elementToAppend = document.createElement("div");
        elementToAppend.className = 'stats-group';
        bar.appendChild(elementToAppend);

        let header = document.createElement("h4")
        header.innerHTML = 'Tickets replied '
        elementToAppend.appendChild(header);

        let headerAddon = document.createElement("span");
        headerAddon.innerHTML = '(today)';
        header.appendChild(headerAddon);

        let counterSquare = document.createElement("ul");
        elementToAppend.appendChild(counterSquare);

        let listElement = document.createElement('li');
        counterSquare.appendChild(listElement);

        let counterValue = document.createElement("div");
        counterValue.className = 'cell-value';
        counterValue.id = 'counter-id-value';
        counterValue.innerHTML = GM_getValue('counter');
        listElement.appendChild(counterValue);

        let counterTitle = document.createElement('div');
        counterTitle.className = 'cell-title';
        counterTitle.innerHTML = 'Processed';
        listElement.appendChild(counterTitle);
    }

    const checkDashboard = function () {

        let statElement = document.getElementsByClassName('indicators clearfix')[0];
        if (statElement) {
            checkCounterElement(statElement);
        }
    }


    let today = new Date().toLocaleDateString();
    checkDate(today);

    window.addEventListener('load', function () {

        let dashboard = document.getElementsByClassName('ember-view nav-tab-list')[0];

        dashboard.addEventListener("click", function () {
            checkDashboard();
        });
    })

    document.addEventListener('keydown', function (event) {
        if (event.ctrlKey && event.altKey && event.key === '=') {
            counterCheck();
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.ctrlKey && event.altKey && event.key === '-') {
            counterMinus();
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.ctrlKey && event.altKey && event.key === '0') {
            counterToZero();
        }
    });

})();