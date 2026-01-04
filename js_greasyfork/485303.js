// ==UserScript==
// @name         Facebook Marketplace: Dim Distant Locations
// @description  Items from the locations listed below will be dimmed for easy avoidance. This list is intended for Victoria, BC (where we're often shown items across an ocean). Edit the list for your region, but back it up, as it will get overwritten when I next update
// @match        https://www.facebook.com/*
// @version      0.7
// @author       mica
// @namespace    greasyfork.org/users/12559
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485303/Facebook%20Marketplace%3A%20Dim%20Distant%20Locations.user.js
// @updateURL https://update.greasyfork.org/scripts/485303/Facebook%20Marketplace%3A%20Dim%20Distant%20Locations.meta.js
// ==/UserScript==

const list = [
'100 Mile House, BC',
'Abbotsford, BC',
'Alberni-Clayoquot, BC',
'Armstrong, BC',
'Anmore, BC',
'Belcarra, BC',
'Burnaby, BC',
'Campbell River, BC',
'Cariboo, BC',
'Castlegar, BC',
'Central Kootenay, BC',
'Central Okanagan, BC',
'Chase, BC',
'Chilliwack, BC',
'Coldstream, BC',
'Columbia-Shuswap, BC',
'Comox, BC',
'Comox Valley, BC',
'Coquitlam, BC',
'Courtenay, BC',
'Creston, BC',
'Cumberland, BC',
'Delta, BC',
'Enderby, BC',
'Fraser Valley, BC',
'Fruitvale, BC',
'Gibsons, BC',
'Hope, BC',
'Invermere, BC',
'Kamloops, BC',
'Kelowna, BC',
'Kent, BC',
'Keremeos, BC',
'Kootenay Boundary, BC',
'Ladysmith, BC',
'Lake Country, BC',
'Langley, BC',
'Langley Twp, BC',
'Lantzville, BC',
'Lillooet, BC',
'Logan Lake, BC',
'Lumby, BC',
'Maple Ridge, BC',
'Mission, BC',
'Nanaimo District, BC',
'Nanaimo, BC',
'Nelson, BC',
'New Westminster, BC',
'North Okanagan, BC',
'North Vancouver District, BC',
'North Vancouver, BC',
'Okanagan-Similkameen, BC',
'Oliver, BC',
'Osoyoos, BC',
'Parksville, BC',
'Pemberton, BC',
'Penticton, BC',
'Penticton, BC',
'Pitt Meadows, BC',
'Port Alberni, BC',
'Port Coquitlam, BC',
'Port Moody, BC',
'Powell River, BC',
'Princeton, BC',
'Qualicum Beach, BC',
'qathet, BC',
'Quesnel, BC',
'Revelstoke, BC',
'Richmond, BC',
'Rossland, BC',
'Salmon Arm, BC',
'Sechelt, BC',
'Sicamous, BC',
'Spallumcheen, BC',
'Squamish, BC',
'Strathcona, BC',
'Summerland, BC',
'Sunshine Coast, BC',
'Surrey, BC',
'Thompson-Nicola, BC',
'Tofino, BC',
'Ucluelet, BC',
'Vancouver, BC',
'Vernon, BC',
'West Kelowna, BC',
'West Vancouver, BC',
'Whistler, BC',
'White Rock, BC',
'Williams Lake, BC',
', WA',
', OR',
', AB',
', ON'
];// ^ leave comma off the last one

const observer = new MutationObserver(() => {
    if (location.pathname.includes('/marketplace') && !location.pathname.match(/propertyrentals|profile|you|notifications|inbox/g)) {
        document.querySelectorAll('div[role="main"] a[role="link"] span[dir]:not(.locationChecked)').forEach(element => {
            if (list.some(item => element.innerText.match(item))) {
                element.closest('div:not([class])').style.opacity = '0.15';
            }
            element.classList.add('locationChecked');
        });
    }
});
observer.observe(document.body, {
    childList: true,
    subtree: true
});
