// ==UserScript==
// @name         Fixr Bot 2 - (old)
// @namespace    http://tampermonkey.net/
// @version      3000.2.2
// @description  fixr bot part 2
// @author       You
// @match        https://fixr.co/*event/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/513418/Fixr%20Bot%202%20-%20%28old%29.user.js
// @updateURL https://update.greasyfork.org/scripts/513418/Fixr%20Bot%202%20-%20%28old%29.meta.js
// ==/UserScript==

function wait(sec) {
    return new Promise(resolve => setTimeout(resolve, sec*1000));
}

function find(text, type = 'span') {
    const items = document.querySelectorAll(type);
    for (let i = 0; i < items.length; i++) {
        const x = items[i];
        if (x.textContent.includes(text)) {
            return x; // Return the matching element
        }
    }
    return null; // Return null if no element was found
}

function find_inside(text, type = 'span', inside) {
    const items = inside.querySelectorAll(type);
    for (let i = 0; i < items.length; i++) {
        const x = items[i];
        if (x.textContent.includes(text) && x.children.length === 0) {
            return x; // Return the matching element
        }
    }
    return null; // Return null if no element was found
}

function click_nearest(element) {
    const parentAnchor = element.closest('a');
    console.log(parentAnchor);
    if (parentAnchor) {
        parentAnchor.click();
        return;
    }
}

function find_and_click(text, type='span') {
    const items = document.querySelectorAll(type);

    Array.from(items).some(x => {
        if (type == 'a') {
            if (x.href.includes(text)) {
                x.click(); // Click the element
                return true; // Stop the iteration
            }
        } else {
            if (x.textContent.includes(text)) {
                x.click(); // Click the element
                return true; // Stop the iteration
            }
        }
    });
}

function find_and_click_nearest(text, type='span') {
    const items = document.querySelectorAll(type);
    let selected = null;
    console.log('i');
    Array.from(items).some(x => {
        if (x.textContent.includes(text)) {
            console.log('k : ', x.textContent);
            selected = x;
            console.log(selected);
            console.log('m');
            click_nearest(x);
            return true;
        }
    });
    return selected;
}

function getElementByXPath(xpath) {
    const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    return result.singleNodeValue;
}


(function() {
    'use strict';

    window.onload = function() {
        async function stuff() {
            console.log('launched bot 2');
            await wait(.5);

            const Wednesday = getElementByXPath('//*[@id="__next"]/div[1]/main/div/div[2]/div[2]').textContent.includes('Wed')
            console.log('Wednesday:', Wednesday);

            let TicketLimit = 2;
            if (Wednesday) {
                TicketLimit = 2;
            } else {
                TicketLimit = 6;
            }

            if (find('Join waitlist', 'button')) {
                console.log('Refreshing, tickets not out yet.');
                window.location.href = window.location.href;
            }
            find_and_click('tickets', 'a');
            await wait(.75);

            let mainHolder = null
            mainHolder = document.querySelectorAll('[data-testid="ticket-list"]')[0];
            const ticketHolder = mainHolder.querySelector('div').querySelector('div');
            console.log(ticketHolder);
            console.log(ticketHolder.children.length);

            if (ticketHolder.children.length == 0) {
                console.log('Back to home, tickets all gone.');
                window.location.href = 'https://fixr.co/organiser/timepiece';
            }
            const Tickets = ticketHolder.childNodes
            let BuyableTickets = []

            Tickets.forEach((ticket, index) => {
                let Buyable = true
                // CHECK TIME DOESN'T INCLUDE A 6:00 or 12:00 (FOR PROMOS ONLY)
                const poundSign = find_inside('£', 'div', ticket);
                const time = poundSign.previousElementSibling;
                if (time.textContent.includes('6') || time.textContent.includes('12')) {Buyable = false};

                const soldOut = find_inside('Sold Out', 'div', ticket);
                if (soldOut) {Buyable = false};

                //console.log(time.textContent, soldOut);
                if (Buyable) {BuyableTickets.push(ticket)};
            });

            console.log('Good tickets:', BuyableTickets);

            if (BuyableTickets.length == 0) {
                console.log('Refreshing, tickets not out yet.');
                window.location.href = window.location.href;
            }

            if (Wednesday) { // buy first (x) tickets
                for (let i = 0; i < BuyableTickets.length; i++) {
                    const ticket = BuyableTickets[i];
                    const button = ticket.querySelectorAll('path[d="M10 4H6V0H4v4H0v2h4v4h2V6h4V4z"]')[0].parentElement.parentElement;
                    if (i == TicketLimit) {break};

                    if (button.getAttribute('data-disabled') !== false) {
                        button.click();
                    }
                }
            } else { // buy last (x) tickets
                for (let i = BuyableTickets.length - 1; i > BuyableTickets.length - TicketLimit - 1; i--) {
                    console.log(i);
                    const ticket = BuyableTickets[i];
                    const button = ticket.querySelectorAll('path[d="M10 4H6V0H4v4H0v2h4v4h2V6h4V4z"]')[0].parentElement.parentElement;
                    if (i == TicketLimit) {break};

                    if (button.getAttribute('data-disabled') !== false) {
                        button.click();
                    }
                }
            }

            await wait(.1)
            const basket = find('View Basket', 'button');
            basket.click();
            await wait(.5);
            let reserve = find('Reserve', 'button');
            reserve.click();

        }
        stuff();
    };
})();

