// ==UserScript==
// @name         Emuparadise Fix
// @version      1.3.1
// @description  Add working download links to Emuparadise
// @author       potato_potato
// @match        https://www.emuparadise.me/*
// @grant        none
// @run-at       document-end
// @namespace https://greasyfork.org/users/445910
// @downloadURL https://update.greasyfork.org/scripts/415598/Emuparadise%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/415598/Emuparadise%20Fix.meta.js
// ==/UserScript==
'use strict';

let style_content = `
.download_container {
    display: flex;
    flex-direction: row;
    align-items: center;
    vertical-align: middle;
    line-height: 2em;
}
.download_container > a {
    margin-right: 0.5em !important;
}
.download_container > .gamelist {
    line-height: inherit;
    float: none;
}
.download_icon_link {
    width: 15px !important;
    height: 15px !important;
}
.download_icon {
    width: 15px !important;
    height: 15px !important;
}
.top-menu-social-icon {
    width: 39px;
}
.pinned_icon {
    position: absolute;
    right: 0.25em;
}
`;

// Inject our stylesheet into the page's <head>.
function inject_style() {
    let head = document.head;
    let style = document.createElement('style');
    style.type = 'text/css';
    style.rel = 'stylesheet';
    style.appendChild(document.createTextNode(style_content));
    head.appendChild(style);
}

// Get the direct download link for a given ROM's gid.
function download_url(gid) {
    return `https://www.emuparadise.me/roms/get-download.php?gid=${gid}&test=true`
}

// Returns `null` if it fails to find a valid integer
function get_gid(url) {
    let parts = url.split('?')[0].split('/');
    if (parts.length < 6) return 0;
    let gid = parseInt(parts[5]);
    if (!isNaN(gid)) return gid;
}

// Create a download `A` element with a download icon
function create_download_link(gid, fancy) {
    let link = document.createElement('a');
    link.href = download_url(gid);
    link.target = '_blank';
    link.rel = 'alternate';
    link.title = 'Download';
    link.classList.add("download_icon_link");
    if (fancy == true) {
        link.text = '';
        let img = document.createElement('img');
        img.classList.add("download_icon");
        //img.src = 'https://freeiconshop.com/wp-content/uploads/edd/download-flat.png';
        //img.src = 'https://img.icons8.com/officel/2x/download.png';
        img.src = 'http://icons.iconarchive.com/icons/designbolts/thin-download/512/Simple-Download-icon.png';
        link.appendChild(img);
    } else {
        link.text = '⬇️';
    }
    return link;
}

// Pin a link to the top right of the page
function corner_pin(link) {
    link.classList.add('top-level', 'pinned_icon', 'download_icon_link');
    document.querySelector('.menu').appendChild(link);
}

// Replace the `href` for all download links to the current ROM with a direct download URL.
function patch_download_links(gid) {
    let end = `${gid}-download`;
    document.querySelectorAll('.download-link > a').forEach(link => {
        if (link.href != null && link.href.endsWith(end)) {
            link.href = download_url(gid);
        };
    })
}

// Prepend direct download links to any links to ROM pages.
// Note that we have to wrap the links in a Div.
function patch_game_lists() {
    let game_links = document.querySelectorAll('a.gamelist');
    game_links.forEach(link => {
        console.log(link.href);
        let gid = get_gid(link.href);
        if (gid != null) {
            let wrapper = document.createElement('div');
            wrapper.classList.add("download_container");
            link.parentElement.replaceChild(wrapper, link);
            let down = create_download_link(gid, true, '15px');
            wrapper.appendChild(down);
            wrapper.appendChild(link);
        }
    });
}

// Entry function.
(function() {
    inject_style();
    let gid = get_gid(document.location.href);
    if (gid != null && document.querySelector('.download-link') != null) {
        let download_link = create_download_link(gid, true);
        corner_pin(download_link);
    }
    patch_download_links(gid);
    patch_game_lists();
})();