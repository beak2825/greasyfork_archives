// ==UserScript==
// @name         Fixr Bot - (old)
// @namespace    http://tampermonkey.net/
// @version      3000.2.2
// @description  fixr bot part 1
// @author       You
// @match        https://fixr.co/*organiser/timepiec*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/513417/Fixr%20Bot%20-%20%28old%29.user.js
// @updateURL https://update.greasyfork.org/scripts/513417/Fixr%20Bot%20-%20%28old%29.meta.js
// ==/UserScript==


function wait(sec) {
    return new Promise(resolve => setTimeout(resolve, sec*1000));
}

function find(text, type = 'span') {
    const items = document.querySelectorAll(type);
    for (let i = 0; i < items.length; i++) {
        const x = items[i];
        if (x.textContent.includes(text)) {
            console.log(x);
            return x; // Return the matching element
        }
    }
    return null; // Return null if no element was found
}

function find_inside(text, type = 'span', inside) {
    const items = inside.querySelectorAll(type);
    console.log(items);
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



let Days = ['Saturday', 'Wednesday'];
const Dates = {
    'Wednesday': null,
    'Saturday': null,
};


(function() {
    'use strict';
    async function stuff() {
        //await waitForDay(); // Wait for Day to change
        await wait(1);
        console.log('Launched bot', Days, Dates);

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
                const dayAndDate = getElementByXPath(bannerXPATH + '/a/div/div/div/div[2]/div[1]/span');
                const poundSymbol = getElementByXPath(bannerXPATH + '/a/div/div/div/div[2]/div[4]/span');
                console.log(day);

                const x = poundSymbol.textContent.includes('£');
                const y = dayAndDate.textContent.includes(day.toUpperCase()) && Dates[day] == null;
                const z = dayAndDate.textContent.includes(day.toUpperCase()) && dayAndDate.textContent.includes(Dates[day]);
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
            sendMessage(selectedDay);
            selectedBanner.childNodes[0].click();
        } else {
            window.location.href = 'https://fixr.co/organiser/timepiece'
        }
    }
    stuff();
})();


//getDay();















