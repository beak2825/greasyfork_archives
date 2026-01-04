// ==UserScript==
// @name         VRPorn.com QOL
// @description  Automatically expands scene information drop down on vrporn.com. Applies scene sorting by newest as default to all URLs under vrporn.com.
// @version      2025-08-06
// @author       ‘Google “Google ‘Google User’ User” User’
// @match        https://vrporn.com/*
// @icon         http://vrporn.com/favicon.ico
// @grant        none
// @namespace https://greasyfork.org/users/1367889
// @downloadURL https://update.greasyfork.org/scripts/547591/VRPorncom%20QOL.user.js
// @updateURL https://update.greasyfork.org/scripts/547591/VRPorncom%20QOL.meta.js
// ==/UserScript==


function show_more() {
    const sm = document.querySelector('.showmore');
    if (sm) {
        sm.click();
    }
}

function append_sort_newest() {
    const els = document.getElementsByTagName('a');

    for (let url of els) {
        if (url.href.indexOf('sort=') !== -1) continue;

        if (url.href.includes('new/') || url.href.includes('tag/') || url.href.includes('all/') || url.href.includes('studio/') || url.href.includes('pornstar/')) {
            if (url.href.indexOf('?') === -1) {
                url.href = url.href + "?sort=newest";
            } else {
                url.href = url.href + "&sort=newest";
            }
        }
    }
}



window.addEventListener('load', function() {
    setTimeout(append_sort_newest, 1000);
}, false);


window.addEventListener('load', function() {
    setTimeout(show_more, 100);
}, false);
