// ==UserScript==
// @name         Unpin Seasonal Anime - MAL
// @namespace    https://greasyfork.org/en/users/954974-crill0
// @version      0.1
// @description  Move pinned anime in Seasonal tab back to original spot. Currently works for all sorting filters except 'sort by licensor'.
// @author       Crill0
// @match        https://myanimelist.net/anime/season*
// @icon         https://cdn.myanimelist.net/images/favicon.ico
// @run-at       document-end
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/450798/Unpin%20Seasonal%20Anime%20-%20MAL.user.js
// @updateURL https://update.greasyfork.org/scripts/450798/Unpin%20Seasonal%20Anime%20-%20MAL.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const sortOrder = document.querySelector('span.btn-sort-order.selected').id;

    var sortFunction;
    switch(sortOrder) {
        case 'members': {
            function getMembers(el) {
                const m = el.querySelector('.scormem-item.member').innerText;
                return m.endsWith('K') ? m.slice(0, -1) * 1000 : m.endsWith('M') ? m.slice(0, -1) * 1000000 : m;
            }
            sortFunction = (el, pinnedEl) => getMembers(el) < getMembers(pinnedEl);
        }
        break;
        case 'score': {
            const getScore = el => el.querySelector('.scormem-item.score').innerText;
            sortFunction = (el, pinnedEl) => getScore(el) < getScore(pinnedEl);
        }
        break;
        case 'title' : {
            const getTitle = el => el.querySelector('.link-title').innerText;
            sortFunction = (el, pinnedEl) => getTitle(pinnedEl).localeCompare(getTitle(el)) == -1 ? true : false;
        }
        break;
        case 'studio' : {
            const getStudio = el => el.querySelectorAll('.property')[0].querySelector('.item').innerText;
            sortFunction = (el, pinnedEl) => getStudio(pinnedEl).localeCompare(getStudio(el)) == -1 ? true : false;
        }
        break;
        case 'start_date': {
            const getStartDate = el => Date.parse(el.querySelector('.info').firstChild.innerText);
            sortFunction = (el, pinnedEl) => getStartDate(el) > getStartDate(pinnedEl);
        }
        break;
        default:
            sortFunction = null;
    }

    document.querySelectorAll('.seasonal-anime-list').forEach(movePinned);

    function movePinned(el) {
        const animeList = [...el.querySelectorAll("div.seasonal-anime")];
        const pinned = animeList.filter(a => a.innerHTML.match("pin-icon"));
        pinned.forEach(async function(pinnedEl) { 
            const afterEl = sortFunction == null ? null : animeList.find(el => !pinned.includes(el) && sortFunction(el, pinnedEl)); // Element after current pinned element when sorted
            if(afterEl == null) el.insertAdjacentHTML('beforeEnd', pinnedEl.outerHTML); // Insert at end
            else afterEl.insertAdjacentHTML('beforebegin', pinnedEl.outerHTML); // Insert before element
            pinnedEl.remove();
        });
    }
})();