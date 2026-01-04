// ==UserScript==
// @name         Fixr Bot
// @namespace    http://tampermonkey.net/
// @version      1.1.9
// @description  fixr bot
// @author       You
// @match        https://fixr.co/*organiser/timepiec*
// @match        https://fixr.co/*event/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fixr.co
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/518601/Fixr%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/518601/Fixr%20Bot.meta.js
// ==/UserScript==

// CONFIG

let Days = ['Saturday']; // days the bot looks for
let TicketLimit = 5; // max tickets bot will buy (will buy the later times if possible)

let TimesIgnoreList = ['6', '12']; // ticket times the bot will not buy. e.g. ['6', '12'] means if any time has a '6' or a '12' in it (like 12-12:30 or 6:30-7) it won't click it.


// CODE

// const Dates = {
//    'Saturday': null,
// };

(function() {
    const userAgents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36",
        "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.0",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36",
        "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/93.0.961.52 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
        "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:80.0) Gecko/20100101 Firefox/80.0",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:62.0) Gecko/20100101 Firefox/62.0",
        "Mozilla/5.0 (Windows NT 6.3; WOW64; rv:40.0) Gecko/20100101 Firefox/40.0",
        "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36",
        "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36",
        "Mozilla/5.0 (Windows NT 6.1; rv:60.0) Gecko/20100101 Firefox/60.0",
        "Mozilla/5.0 (Linux; Android 10; Pixel 4 XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.101 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android 9; SM-G960F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android 9; SM-J530F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Mobile Safari/537.36",
        "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36",
        "Mozilla/5.0 (Windows NT 6.3; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0",
        "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36",
        "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36",
        "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36",
        "Mozilla/5.0 (Linux; Android 9; SM-G960F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.91 Mobile Safari/537.36",
        "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/18.18362 Safari/537.36"
    ];

    // Randomly pick a user-agent from the list
    const randomAgent = userAgents[Math.floor(Math.random() * userAgents.length)];

    // Set the user-agent
    Object.defineProperty(navigator, 'userAgent', {
        value: randomAgent,
        writable: false
    });
    console.log(`Using User-Agent: ${randomAgent}`);
})();

(function() {
    // Randomly select a screen resolution (just the viewport, not the window size)
    const resolutions = [
        { width: 1280, height: 720 },
        { width: 1366, height: 768 },
        { width: 1920, height: 1080 },
        { width: 1440, height: 900 },
        { width: 768, height: 1024 }
    ];

    const randomResolution = resolutions[Math.floor(Math.random() * resolutions.length)];

    // Simulate the resolution by adjusting the viewport size (without resizing the window)
    Object.defineProperty(window, 'innerWidth', {
        value: randomResolution.width,
        writable: false
    });

    Object.defineProperty(window, 'innerHeight', {
        value: randomResolution.height,
        writable: false
    });

    // Optionally, adjust device pixel ratio for more realism
    Object.defineProperty(window, 'devicePixelRatio', {
        value: randomResolution.width / 1920, // Approximate DPI scaling
        writable: false
    });
    console.log(`Simulated Resolution: ${randomResolution.width}x${randomResolution.height}`);
})();





function wait(sec) {
    return new Promise(resolve => setTimeout(resolve, sec*1000));
}

function randomNumber() { // between 1 and 5
    return Math.random() * (1.5 - 0.5) + 0.5;
}

function waitRandom() {
    const sec = randomNumber() * 1000
    console.log(sec);
    return new Promise(resolve => setTimeout(resolve, sec));
}

function find(text, type = 'span') {
    const items = document.querySelectorAll(type);
    for (let i = 0; i < items.length; i++) {
        const x = items[i];
        if (x.textContent.includes(text)) {
            //console.log(x);
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

function getXPath(element) {
    if (element.id) {
        // Use the ID if it exists
        return `//*[@id="${element.id}"]`;
    }

    if (element === document.body) {
        return '/html/body';
    }

    let ix = 0;
    const siblings = element.parentNode.childNodes;

    // Count the number of siblings with the same tag name
    for (let i = 0; i < siblings.length; i++) {
        const sibling = siblings[i];
        if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
            ix++;
            if (sibling === element) {
                return `${getXPath(element.parentNode)}/${element.tagName.toLowerCase()}[${ix}]`;
            }
        }
    }

    return `${getXPath(element.parentNode)}/${element.tagName.toLowerCase()}`;
}

const Discord = 'https://discord.com/api/webhooks/1300481982295183361/fRqiPRxaRCsK8AYevLoqswPXAr7BDZ8CkdrCa5HvusBt3ljuA_JZDYZNamvTaOHmpaSj'


function sendMessage(day) {
    const message = {
        content: '@everyone TP **' + day + '** is out!',
    };
    fetch(Discord, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
    })
}

function findWithX(typeOfObject, property, value) {
    const items = document.querySelectorAll(typeOfObject);
    for (let i = 0; i < items.length; i++) {
        const x = items[i];
        if (x[property] == value) {
            //console.log(x);
            return x; // Return the matching element
        }
    }
    return null; // Return null if no element was found
}


// Scripts ---------------------------------------------------------------

function clickBanners() {
    'use strict';
    async function stuff() {
        //await waitForDay(); // Wait for Day to change
        await wait(1);
        console.log('Launched bot', Days);

        const BannerHolder = getElementByXPath('//*[@id="__next"]/div[1]/main/div[2]/div[2]');
        const wholeHTML = BannerHolder.innerHTML;
        let selectedBanner = null;
        let selectedDay = null;

        let FoundDays = {};
        for (let i = 0; i < BannerHolder.childNodes.length; i++) {
            const banner = BannerHolder.childNodes[i];
            const bannerXPATH = getXPath(banner);
            let found = false;

            // Loop through each day in Days
            for (let j = 0; j < Days.length; j++) {
                const day = Days[j];
                const dayAndDate = getElementByXPath(
                    bannerXPATH + '/a/div[2]/div[1]/span'
                );
                const poundSymbol = getElementByXPath(
                    bannerXPATH + '/a/div[2]/div[4]/span'
                );
                console.log(day);

                const x = poundSymbol.textContent.includes('£');
                const y = dayAndDate.textContent.includes(day.toUpperCase()) // && Dates[day] == null;
                const z = dayAndDate.textContent.includes(day.toUpperCase()) // && dayAndDate.textContent.includes(Dates[day]);
                console.log((x && (y || z)));

                if (x && (y || z)) {
                    console.log('FOUND', day);
                    //selectedBanner = banner;
                    //selectedDay = day;
                    found = true;
                    FoundDays[day] = banner
                    //break;
                }
            }

            //if (found) {
            //    break; // Exit the outer loop if found
            //}
        }

        console.log(FoundDays);
        if (Object.keys(FoundDays).length > 0) {
            if (FoundDays.Saturday && FoundDays.Wednesday) {
                selectedDay = 'Saturday';
                selectedBanner = FoundDays.Saturday
            } else if (FoundDays.Wednesday) {
                selectedDay = 'Wednesday';
                selectedBanner = FoundDays.Wednesday
            } else if (FoundDays.Saturday) {
                selectedDay = 'Saturday';
                selectedBanner = FoundDays.Saturday
            } else {
                const x = Object.entries(FoundDays)[0];
                selectedDay = x[0]
                selectedBanner = x[1]
            }
        }

        console.log(selectedDay, selectedBanner);
        if (selectedBanner) {
            //sendMessage(selectedDay);
            selectedBanner.childNodes[0].click();
        } else {
            window.location.href = 'https://fixr.co/organiser/timepiece'
        }
    }
    stuff();
}


async function buyTickets() {
    console.log('launched bot 2');
    await wait(0.5);

    const Wednesday = getElementByXPath('//*[@id="__next"]/div[1]/main/div/div[2]/div[2]')
        .firstElementChild.textContent.includes('Wed');
    console.log(getElementByXPath('//*[@id="__next"]/div[1]/main/div/div[2]/div[2]').firstElementChild);
    console.log('Wednesday:', Wednesday);

    if (Wednesday) {
        TicketLimit = 2;
    }

    if (find('Join waitlist', 'button')) {
        console.log('Refreshing, tickets not out yet.');
        window.location.href = window.location.href;
        return;
    }

    find_and_click('tickets', 'a');
    await wait(0.75);

    let mainHolder = document.querySelectorAll('[data-testid="ticket-list"]')[0];
    const ticketHolder = mainHolder.querySelector('div').querySelector('div');
    console.log(ticketHolder);

    if (ticketHolder.children.length === 0) {
        console.log('Back to home, tickets all gone.');
        window.location.href = 'https://fixr.co/organiser/timepiece';
        return;
    }

    const Tickets = ticketHolder.childNodes;
    let BuyableTickets = [];

    Tickets.forEach((ticket) => {
        let Buyable = true;

        const poundSign = find_inside('£', 'div', ticket);
        if (!poundSign) {
            Buyable = false;
        }

        if (Buyable) {
            // pick the element that actually contains the time
            const time = poundSign.parentElement.parentElement.parentElement.previousElementSibling;
            if (!time) {
                Buyable = false;
            } else {
                // 1) ignore times that contain anything in TimesIgnoreList
                if (TimesIgnoreList.some(t => time.textContent.includes(t))) {
                    Buyable = false;
                }
            }
        }

        // 3) check for Sold Out
        if (Buyable) {
            const soldOut = find_inside('Sold Out', 'div', ticket);
            if (soldOut) {
                Buyable = false;
            }
        }

        if (Buyable) {
            BuyableTickets.push(ticket);
        }
    });

    console.log('All tickets:', Tickets);
    console.log('Good tickets:', BuyableTickets);

    if (BuyableTickets.length === 0) {
        console.log('Refreshing, tickets not out yet or none matched criteria.');
        window.location.href = window.location.href;
        return;
    }

    // BUY FROM THE END (later tickets first) UP TO TicketLimit
    let remaining = TicketLimit;

    for (let i = BuyableTickets.length - 1; i >= 0 && remaining > 0; i--) {
        const ticket = BuyableTickets[i];
        const plusButton = ticket
            .querySelectorAll('path[d="M10 4H6V0H4v4H0v2h4v4h2V6h4V4z"]')[0]
            .parentElement.parentElement;

        console.log('Trying to buy ticket:', ticket, plusButton);

        // data-disabled !== false means it's clickable in your original logic
        if (plusButton.getAttribute('data-disabled') !== false) {
            plusButton.click();
            remaining--;
        }
    }

    await wait(0.2);
    const basket = find('View Basket', 'button');
    if (basket) {
        basket.click();
    }
    await wait(0.2);

    const basketTickets = find('Order summary', 'h2').nextElementSibling;
    console.log('BASKET:', basketTickets);

    const realBasketTickets = basketTickets.querySelectorAll('div.sc-77b693f7-0.hcdsxF');
    console.log(realBasketTickets);

    // Remove tickets with promo code fields, keep clean ones
    let goodTickets = [];
    realBasketTickets.forEach((ticket) => {
        console.log(ticket);
        let good = true;

        ticket.childNodes.forEach((node) => {
            if (node.innerHTML && node.innerHTML.includes('input')) {
                console.log(node, 'contains input');
                good = false;
                const button = ticket.querySelectorAll('button')[0];
                button.click(); // trash can
            }
        });

        if (good) {
            goodTickets.push(ticket);
        }
    });

    console.log('good tickets no promo code: ', goodTickets);

    await wait(1);

    let reserve = find('Reserve', 'button');
    console.log(reserve);
    reserve.click();

    await wait(1);

    for (let i = 0; i < 100; i++) {
        const ele = findWithX('input', 'id', 'ticket-protection-no');
        const ele2 = findWithX('input', 'id', '7960-radio-no');
        if (ele && ele2) {
            ele.click();
            ele2.click();
            const button = find('Continue');
            console.log(button);
            button.click();
        }
        console.log(ele, ele2);
        await wait(1);
    }
}


(function () {
    'use strict';

    const currentUrl = window.location.href;
    console.log(currentUrl);
    console.log(currentUrl.split('/'));

    if (currentUrl == 'https://fixr.co/organiser/timepiece' || currentUrl == 'https://fixr.co/organiser/timepiece?') {
        clickBanners();
    } else {
        buyTickets();
    }
})();