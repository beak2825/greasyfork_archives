// ==UserScript==
// @name         BC Auction: Location Filter
// @description  bcauction.ca has no way to filter results by location. Listed below are item locations I've encountered on the site. Edit the list, removing locations that you DO want to see
// @version      1.4
// @author       mica
// @namespace    greasyfork.org/users/12559
// @include      https://www.bcauction.ca/open.dll/submitDocSearch*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/378158/BC%20Auction%3A%20Location%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/378158/BC%20Auction%3A%20Location%20Filter.meta.js
// ==/UserScript==

var list = [
// Vancouver Island
'Chemainus',
'Comox',
'Courtenay',
'Duncan',
'Ladysmith',
'Nanaimo',
'North Cowichan',
'Parksville',
'Port Alberni',
'Port McNeill',
'Qualicum Bay',
'Victoria - Uvic',
'Victoria',
// Vancouver, Fraser Valley, Sunshine Coast
'Abbotsford',
'Aldergrove',
'Annacis Island',
'Burnaby',
'Campbell River',
'Coquitlam',
'Delta',
'Hope',
'Lake Country',
'Langley',
'Maple Ridge',
'Mission',
'New Westminster',
'Richmond',
'Sechelt',
'Squamish',
'Surrey',
'Vancouver',
// Interior South
'100 Mile House',
'Armstrong',
'Ashcroft',
'Bella Coola',
'Bridge River',
'Castlegar',
'Clearwater',
'Coldstream',
'Cranbrook',
'Enderby',
'Golden',
'Grand Forks',
'Kamloops',
'Kelowna',
'Lillooet',
'Lumby',
'Lytton',
'Merritt',
'Nelson',
'Osoyoos',
'Peachland',
'Penticton',
'Princeton',
'Revelstoke',
'Sparwood',
'Summerland',
'Vernon',
'Williams Lake',
// Interior/Coast North
'Dawson Creek',
'Fort St. James',
'Fort St. John',
'Kitimat',
'McBride',
'Prince George',
'Prince Rupert',
'Quesnel',
'Salmon Arm',
'Smithers',
'Telkwa',
'Terrace',
'Tumbler Ridge',
'Valemount',
'Vanderhoof'
];// ^ leave the comma off the last one!

document.querySelectorAll('tr[name="infoDetail"]').forEach(element => element.remove());
document.querySelectorAll('td[width="75"]').forEach(element => {
    if (list.map(item => item.toUpperCase()).includes(element.innerText.toUpperCase())) {
        element.closest('tr').nextSibling.remove();
        element.closest('tr').remove();
    }
});
