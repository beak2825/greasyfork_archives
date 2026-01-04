// ==UserScript==
// @name         BS Link Preview
// @namespace    https://bs.to/
// @version      1.2.4
// @description  Zeigt eine Cover- und Genres-Vorschau beim Hovern über BS-Serienlinks
// @author       Asu_nyan
// @match        https://bs.to/
// @match        https://burningseries.co/
// @icon         https://bs.to/favicon.ico
// @require      https://greasyfork.org/scripts/375096-bs-library/code/BS_Library.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383846/BS%20Link%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/383846/BS%20Link%20Preview.meta.js
// ==/UserScript==
// jshint esversion: 9

const BS = window.BS;
const interval = 1000 * 10;
const preview = document.createElement('div');
const image = document.createElement('img');
const genres = document.createElement('div');
const width = 180;
const height = 266;
const space = 50;
let anchors = getAnchors();
let links = getLinks();
let cover_preview = (window.localStorage.cover_preview) ? JSON.parse(window.localStorage.cover_preview) : [];

BS.Helper.InjectCSS(null, `
.genre {
display: inline-block;
font-size: 10pt;
margin-bottom: 4px;
padding: 1px 4px;
border-radius: 1em;
background-color: dodgerblue;
color: white;
}
`);

(function() {
    'use strict';
    loop();
    setInterval(loop, interval);

})();

function loop() {
    cover_preview = (window.localStorage.cover_preview) ? JSON.parse(window.localStorage.cover_preview) : [];
    anchors = getAnchors();
    links = getLinks();
    setup();
    let links_temp = cover_preview.map(x => x.url);
    let new_links = links.filter(x => !links_temp.includes(x));
    console.log(new_links);
    if(new_links.length) {
        let promises = new_links.map(url => fetch(url).then(res => res.text()));
        Promise.all(promises).then(res => {
            res.forEach(processDataBS);
            window.localStorage.cover_preview = JSON.stringify(cover_preview);
        });
    }
}


function setup() {
    genres.style.margin = "4px";
    genres.style.textAlign = "center";
    image.style.width = width + "px";
    image.style.height = height + "px";
    image.style.margin = "0";
    preview.style.boxShadow = "10px 10px 20px 0px rgba(28,28,28,1)";
    preview.style.position = "absolute";
    preview.style.left = "0px";
    preview.style.top = "0px";
    preview.style.maxWidth = width + "px";
    preview.style.background = "#505050";
    preview.style.color = "black";
    preview.style.zIndex = "999";
    preview.style.pointerEvents = "none";
    preview.style.display = "none";
    setEvents();
    preview.appendChild(image);
    document.body.appendChild(preview);
}

function setEvents() {
    anchors.forEach(a => {
        a.setAttribute('data-listener', true);
        a.addEventListener('mouseenter', mEnter);
        a.addEventListener('mouseleave', () => {
            preview.style.display = "none";
        });
    });
}

function mEnter(e) {
    preview.style.display = "initial";
    let show = cover_preview.filter(x => x.url == normalize(e.path[0].href));
    image.src = show[0].cover;
    genres.innerHTML = show[0].genres.map(x => `<span class="genre">${x}</span>`).join(' ');
    preview.appendChild(genres);
    let target_rect = e.target.getBoundingClientRect();
    mPos = { x : e.clientX, y : e.clientY };
    preview.style.left = (mPos.x - width/2) + 'px';
    preview.style.top  = (mPos.y > (window.innerHeight/2)) ? (target_rect.y + window.scrollY - (height + space)) + 'px' : (target_rect.y + window.scrollY + space) + 'px';
}

function getLinks(prevUrls) {
    anchors.forEach(a => a.removeAttribute('title'));
    let allUrls = anchors.map(link => normalize(link.href));
    let filteredUrls = [];
    allUrls.forEach(url => {
        if(prevUrls) {
            if(!prevUrls.includes(url)) prevUrls.push(url);
        } else {
            if(!filteredUrls.includes(url)) filteredUrls.push(url);
        }
    });
    return (prevUrls) ? prevUrls : filteredUrls;
}

function getAnchors(filter) {
    if(filter)
        return Array.from(document.querySelectorAll('a[href^="serie/"]'))
            .concat(Array.from(document.querySelectorAll('a[href^="https://bs.to/serie/"]')))
            .concat(Array.from(document.querySelectorAll('a[href^="https://burningseries.co/serie/"]')))
            .filter(filter);
    return Array.from(document.querySelectorAll('a[href^="serie/"]'))
        .concat(Array.from(document.querySelectorAll('a[href^="https://bs.to/serie/"]')))
        .concat(Array.from(document.querySelectorAll('a[href^="https://burningseries.co/serie/"]')));
}

function normalize(url) {
    if(url){
        let urlArr = url.split('/');
        if(urlArr.length > 4) {
            urlArr.splice(5, urlArr.length);
        }
        return urlArr.join('/');
    }
}

function processDataBS(data) {
    let data_div = document.createElement('div');
    data_div.innerHTML = data;
    let url = data_div.querySelector('meta[property="og:url"').content;
    let genres = Array.from(data_div.querySelectorAll('#sp_left > div.infos > div:nth-child(1) > p > span')).map(e => e.textContent);
    let link = data_div.querySelector('img[alt="Cover"]').src;
    cover_preview.push({url: url, cover: link, genres: genres});
}