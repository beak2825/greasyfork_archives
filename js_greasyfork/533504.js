// ==UserScript==
// @name         thief_ambush_in_one_click
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world, Serega!
// @author       You
// @match        /^https{0,1}:\/\/((www|my)\.(heroeswm|lordswm)\.(ru|com)|178\.248\.235\.15)*
// @include      /^https{0,1}:\/\/((www|my)\.(heroeswm|lordswm)\.(ru|com)|178\.248\.235\.15)*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533504/thief_ambush_in_one_click.user.js
// @updateURL https://update.greasyfork.org/scripts/533504/thief_ambush_in_one_click.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let links = ['https://my.lordswm.com', 'https://www.heroeswm.ru'];

    let link = location.href.slice(0,22) === 'https://my.lordswm.com' ? links[0] : links[1];

    let myCoordsLS = JSON.parse(localStorage.getItem('myCoordsLS'));
    if (myCoordsLS === null) localStorage.setItem('myCoordsLS', JSON.stringify(''));

    const mapCoordinates = [
        {id: 1, name: 'Empire capital', possibleIds: [2,3,4,5,8,11,7,12]},
        {id: 2, name: 'East river', possibleIds: [1,3,4,14,15,5,11]},
        {id: 3, name: 'Tiger lake', possibleIds: [1,2,4,8,12,9,6,24]},
        {id: 4, name: 'Rogues wood', possibleIds: [1,2,3,6]},
        {id: 5, name: 'Wolf dale', possibleIds: [1,2,11]},
        {id: 6, name: 'Peacful camp', possibleIds: [3,4]},
        {id: 7, name: 'Lizard lowland', possibleIds: [1,5,8]},
        {id: 8, name: 'Green wood', possibleIds: [1,12,3]},
        {id: 9, name: 'Eagle nest', possibleIds: [6,3]},
        {id: 10, name: 'Portal ruins', possibleIds: [5,11]},
        {id: 11, name: 'Dragon caves', possibleIds: [10,1,2]},
        {id: 12, name: 'Shining spring', possibleIds: [1,3]},
        {id: 13, name: 'Sunny city', possibleIds: [12,9]},
        {id: 14, name: 'Magma mines', possibleIds: [2,4]},
        {id: 15, name: 'Bear mountain', possibleIds: [2,4]},
        {id: 16, name: 'Fairy trees', possibleIds: [15,18]},
        {id: 17, name: 'Harbour city', possibleIds: [15,14]},
        {id: 18, name: 'Mithril coast', possibleIds: [15,16]},
        {id: 19, name: 'Great wall', possibleIds: [20,21]},
        {id: 20, name: 'Titans valley', possibleIds: [19,22]},
        {id: 21, name: 'Fisshing village', possibleIds: [22,20]},
        {id: 22, name: 'Kingdom castle', possibleIds: [21,20]},
        {id: 23, name: 'Ungovernable steppe', possibleIds: [12,9,13]},
        {id: 24, name: 'Crystal garden', possibleIds: []},
        {id: 25, name: 'East island', possibleIds: [4,3,6]},
        {id: 26, name: 'The wilderness', possibleIds: [5]},
        {id: 27, name: 'Sublime arbor', possibleIds: [8]},]

    let coordToAmbush;

    if (location.href.includes('map.php')) {
        let myCoordinates = document.getElementsByClassName('map_sector_selected');
        myCoordinates = myCoordinates[0].id;
        myCoordinates = myCoordinates.match(/\d+/)[0];
        coordToAmbush = mapCoordinates.filter(el => el.id == myCoordinates);
        localStorage.setItem('myCoordsLS', JSON.stringify(coordToAmbush[0].possibleIds));
    }

    const panel = document.getElementById('breadcrumbs');
    const nobr = panel.getElementsByTagName('nobr');
    const to_ambush_btn = document.createElement('a');
    to_ambush_btn.style.cursor = 'pointer';
    to_ambush_btn.innerText = 'To ambush!';
    nobr[0].append(to_ambush_btn);


    const ambush = () => {
        let form = new FormData()
        form.append('id', myCoordsLS[0])
        form.append('with_who', 0)

        fetch(`${link}/thief_ambush.php`, {
            method: 'POST',
            body: form,
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Content-length': 15,
            }
        }).then(res => location.reload())
    }

    to_ambush_btn.addEventListener('click', () => {
        ambush();
    })
})();