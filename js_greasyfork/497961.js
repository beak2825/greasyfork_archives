// ==UserScript==
// @name         Hentai Nexus Addon
// @namespace    http://tampermonkey.net/
// @version      v1.0.0
// @description  Adds some QoL changes to hentainexus.com
// @author       Exiua
// @match        https://hentainexus.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hentainexus.com
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/497961/Hentai%20Nexus%20Addon.user.js
// @updateURL https://update.greasyfork.org/scripts/497961/Hentai%20Nexus%20Addon.meta.js
// ==/UserScript==

/*
 * For blacklisting to work, add a blacklist object to the script's storage.
 * E.g. "blacklist": {"authors": [], "tags": []}
 * Blacklist entries should be added as seen (case-sensitive) without the usage count 
 * (e.g., `ugly bastard (20)` would be `"blacklist": {"authors": [], "tags": ["ugly bastard"]}`)
 */

const SEEN_COLOR = '#3DFAFF';
const BLACKLIST_COLOR = 'red'; //'#D72222';
const POST_REGEX = /\/view\/(\d+)/gm;

let blacklist = null;
let center = 0;
let nextPageBtn = null;
let prevPageBtn = null;

(function() {
    'use strict';

    main();
    //setTimeout(main, 3000);
})();

function main(){
    blacklist = blacklist == null ? GM_getValue("blacklist") : blacklist;

    const current_url = window.location.href;
    if(current_url.includes("/view/")){
        console.log("Handling Post");
        handlePost(current_url);
    }
    else if(current_url.includes("/read/")){
        console.log("Handling Reader");
        configureReader();
    }
    else{
        console.log("Handling Gallery");
        handleGallery();
    }
}

function configureReader(){
    const pager = document.getElementById("nextLink");
    pager.onclick = null;
    const img = pager.getElementsByTagName("img")[0];
    const imgRect = img.getBoundingClientRect();
    const width = imgRect.right-imgRect.left;
    //console.log(width, imgRect.left, imgRect.left + width);
    center = (imgRect.left + imgRect.right) / 2;
    nextPageBtn = document.getElementsByClassName("pagination-next reader-pagination-next")[0];
    prevPageBtn = document.getElementsByClassName("pagination-previous reader-pagination-prev")[0];
    pager.addEventListener("click", handlePagerClick);
}

function handlePagerClick(event){
    let mouseX = event.clientX;
    let mouseY = event.clientY;
    console.log(mouseX, mouseY);
    if (mouseX >= center) {
        nextPageBtn.click();
    }
    else{
        prevPageBtn.click();
    }
}

function handlePost(url){
    POST_REGEX.lastIndex = 0;
    const match = POST_REGEX.exec(url);
    //console.log(match, url);
    GM_setValue(match[1], url);

    // Check for blacklisted tags
    const metadata = document.getElementsByTagName("table")[0].children[0];
    for(const row of metadata.children){
        const rowName = row.children[0].innerText;
        console.log(rowName);
        if (rowName === "Artist"){
            handleArtist(row);
        }
        else if (rowName == "Tags"){
            handleTags(row);
        }
    }
}

function handleArtist(artistRow){
    const artistElm = artistRow.getElementsByTagName("a")[0];
    const artist = substringBeforeLastSpace(artistElm.innerText);
    //console.log(artist);
    if (blacklist.authors.includes(artist)){
        artistElm.setAttribute("style", "color: " + BLACKLIST_COLOR + " !important;");
    }
}

function handleTags(tagRow){
    const tags = tagRow.children[1];
    for(const tagElm of tags.children){
        const tagAnchor = tagElm.getElementsByTagName("a")[0];
        const tag = substringBeforeLastSpace(tagAnchor.innerText);
        console.log(tag);
        if (blacklist.tags.includes(tag)){
            tagAnchor.setAttribute("style", "color: " + BLACKLIST_COLOR + ";");
        }
    }
}

function substringBeforeLastSpace(str) {
  const lastIndex = str.lastIndexOf(' ');
  return lastIndex === -1 ? str : str.substring(0, lastIndex);
}

function handleGallery(){
    const posts = document.getElementsByClassName("columns is-multiline is-mobile")[0];
    //console.log(posts);
    for(const post of posts.children){
        const anchor = post.getElementsByTagName("a")[0];
        const postLink = anchor.getAttribute("href");
        POST_REGEX.lastIndex = 0;
        const match = POST_REGEX.exec(postLink);
        //console.log(match[1]);
        if(GM_getValue(match[1]) != null){
            fadePost(anchor);
        }
    }
}

function fadePost(anchor){
    const title = anchor.getElementsByTagName("p")[0];
    title.setAttribute("style", "color: " + SEEN_COLOR + ";");
    const img = anchor.getElementsByTagName("img")[0];
    img.setAttribute("style", "opacity: 20%;");
}