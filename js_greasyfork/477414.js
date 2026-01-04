// ==UserScript==
// @name         StashDB x 1337x
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  This script tries to match the scenes on stash.db to torrents on 1337x.
// @match        https://stashdb.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stashdb.org
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/477414/StashDB%20x%201337x.user.js
// @updateURL https://update.greasyfork.org/scripts/477414/StashDB%20x%201337x.meta.js
// ==/UserScript==

function GetResponse(url, type) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            url: url,
            responseType: type,
            onload: function(response) {
                resolve(response.response);
            },
            onerror: function(error) {
                reject(error);
            }
        });
    });
}

function GetLinks(doc) {
    const links = [];
    const rows = doc.querySelectorAll('div.table-list-wrap table tbody tr');
    rows.forEach(row => {
        const long = row.querySelector('td:nth-child(1) a:nth-child(2)').textContent;
        const link = `https://1337x.to${row.querySelector('td:nth-child(1) a:nth-child(2)').getAttribute('href')}`;
        const size = row.querySelector('td:nth-child(5)').childNodes[0].textContent;
        links.push([long, link, size]);
    });
    return links;
}

async function GetTags(studio, scene, date, performers) {
    // generate keywords
    const studios = [...new Set([studio, studio.replaceAll(' ', '')])];
    const scenes = [scene];
    const dates = [date, date.substring(2)];
    const keywords = [];
    studios.forEach(a => {
        const pairing = [].concat(scenes, dates, performers);
        pairing.forEach(b => {
            keywords.push(`${a} ${b}`);
        });
    });
    dates.forEach(a => {
        const pairing = [].concat(scenes, performers);
        pairing.forEach(b => {
            keywords.push(`${a} ${b}`);
        });
    });

    // get all links
    const links = [];
    await Promise.all(keywords.map(async keyword => {
        //const url = `https://1337x.to/sort-search/${keyword}/time/desc/1/`;
        const url = `https://1337x.to/search/${keyword}/1/`;
        const doc = await GetResponse(url, 'document');
        links.push(...GetLinks(doc));
    }));
    console.log(keywords, links);

    // sort links
    const countMap = new Map();
    const linkMap = new Map();
    links.forEach(link => {
        const count = countMap.get(link[1]);
        if (count == undefined) {
            countMap.set(link[1], 1);
            linkMap.set(link[1], link);
        } else {
            countMap.set(link[1], count + 1);
        }
    });
    const sortedLinks = [...countMap.entries()].sort((a, b) => {
        const hits = b[1] - a[1];
        function Convert(str) {
            str = str.replace(',', '');
            str = str.replace(' MB', '*1e3');
            str = str.replace(' GB', '*1e6');
            try {
                const value = eval(str);
                return value;
            } catch {
                console.log('Bad Value: ', str);
                return 0;
            }
        }
        const sizes = Convert(linkMap.get(b[0])[2]) - Convert(linkMap.get(a[0])[2]);
        return hits * 1e9 + sizes;
    });
    const result = [];
    function GetShortName(long) {
        return long;
        var shortName = long.replaceAll('.', ' ').toLowerCase();
        const words = [].concat(scenes, studios, performers);
        words.forEach(word => {
            shortName = shortName.replaceAll(word.toLowerCase(), '');
        });
        const YY = date.substring(2, 4);
        const MM = date.substring(5, 7);
        const DD = date.substring(8, 10);
        const wordsToDelete = [`${YY} ${MM} ${DD}`, `20${YY} ${MM} ${DD}`, `${DD} ${MM} 20${YY}`, 'xxx', 'and'];
        wordsToDelete.forEach(word => {
            shortName = shortName.replaceAll(word.toLowerCase(), '');
        });
        return shortName;
    }
    sortedLinks.forEach(entry => {
        const link = linkMap.get(entry[0]);
        result.push([`[${entry[1]} hits] [${link[2]}] ${GetShortName(link[0])}`, link[0], link[1]]);
    });
    return result;
}

function WrapTags(tags) {
    const ul = document.createElement('ul');
    ul.style.overflowY = 'scroll';  // Enable vertical scrolling
    ul.style.maxHeight = '100px';   // Limit the height to 200 pixels
    ul.setAttribute('class', 'scene-tag-list');
    tags.forEach(tag => {
        const a = document.createElement('a');
        a.setAttribute('href', tag[2]);
        a.appendChild(document.createTextNode(tag[0]));
        const abbr = document.createElement('abbr');
        abbr.setAttribute('title', tag[1]);
        abbr.appendChild(a);
        const span = document.createElement('span');
        span.setAttribute('class', 'tag-item badge bg-none');
        span.appendChild(abbr);
        const li = document.createElement('li');
        li.appendChild(span);
        ul.appendChild(li);
    });
    return ul;
}

async function GetPerformers(url) {
    const data = await new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'POST',
            responseType: 'json',
            data: `{"operationName":"Scene","variables":{"id":"${url.substring(url.lastIndexOf('/') + 1)}"},"query":"query Scene($id: ID!) {\n  findScene(id: $id) {\n    ...SceneFragment\n    __typename\n  }\n}\n\nfragment URLFragment on URL {\n  url\n  site {\n    id\n    name\n    icon\n    __typename\n  }\n  __typename\n}\n\nfragment ImageFragment on Image {\n  id\n  url\n  width\n  height\n  __typename\n}\n\nfragment ScenePerformerFragment on Performer {\n  id\n  name\n  disambiguation\n  deleted\n  gender\n  aliases\n  __typename\n}\n\nfragment SceneFragment on Scene {\n  id\n  release_date\n  title\n  deleted\n  details\n  director\n  code\n  duration\n  urls {\n    ...URLFragment\n    __typename\n  }\n  images {\n    ...ImageFragment\n    __typename\n  }\n  studio {\n    id\n    name\n    parent {\n      id\n      name\n      __typename\n    }\n    __typename\n  }\n  performers {\n    as\n    performer {\n      ...ScenePerformerFragment\n      __typename\n    }\n    __typename\n  }\n  fingerprints {\n    hash\n    algorithm\n    duration\n    submissions\n    user_submitted\n    created\n    updated\n    __typename\n  }\n  tags {\n    id\n    name\n    description\n    aliases\n    __typename\n  }\n  __typename\n}"}`.replaceAll('\n', ''),
            url: 'https://stashdb.org/graphql',
            headers: { "Content-Type": "application/json" },
            onload: function(response) {
                resolve(response.response);
            },
            onerror: function(error) {
                reject(error);
            }
        });
    });
    const performers = data.data.findScene.performers;
    const result = [];
    performers.forEach(performer => {
        //console.log(performer);
        if (performer.performer.gender != 'MALE') {
            result.push(performer.performer.name);
        }
    });
    return result;
}

function SearchTorrents() {
    const cards = document.querySelectorAll('div.card-footer');
    //const cards = [document.querySelector('div.card-footer')];
    cards.forEach(async card => {
        const studio = card.querySelector('div.text-muted a').textContent;
        const scene = card.querySelector('div.d-flex a h6').textContent;
        const date = card.querySelector('div.text-muted strong').textContent;
        const performers = await GetPerformers(card.querySelector('div.d-flex a').getAttribute('href'));
        const tags = await GetTags(studio, scene, date, performers);
        const ul = WrapTags(tags);
        const existingUl = card.querySelector('ul');
        if (existingUl != undefined) {
            existingUl.remove();
        }
        card.appendChild(ul);
    });
}

function AddSearchTorrentsButton() {
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('class', 'btn btn-primary');
    button.onclick = SearchTorrents;
    button.appendChild(document.createTextNode('⚡️'));
    const a = document.createElement('a');
    a.setAttribute('class', 'ms-auto');
    a.appendChild(button);
    document.querySelector('div.scenes-list div').appendChild(a);
}


// Convenience function to execute your callback only after an element matching readySelector has been added to the page.
// Example: runWhenReady('.search-result', augmentSearchResults);
// Gives up after 1 minute.
function runWhenReady(readySelector, callback) {
    var numAttempts = 0;
    var tryNow = function() {
        var elem = document.querySelector(readySelector);
        if (elem) {
            callback(elem);
        } else {
            numAttempts++;
            if (numAttempts >= 34) {
                console.warn('Giving up after 34 attempts. Could not find: ' + readySelector);
            } else {
                setTimeout(tryNow, 250 * Math.pow(1.1, numAttempts));
            }
        }
    };
    tryNow();
}

(function() {
    'use strict';
    runWhenReady('div.scenes-list', AddSearchTorrentsButton);
})();