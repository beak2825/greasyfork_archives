// ==UserScript==
// @name         MAM Browse GR Rankings
// @namespace    MAM
// @version      0.5.4
// @description  GR Rankings for all books on search, requests, and freeleech page
// @author       Dexmaster
// @match        https://www.myanonamouse.net/tor/browse.php*
// @match        https://www.myanonamouse.net/freeleech.php*
// @match        https://www.myanonamouse.net/tor/requests2.php*
// @match        https://www.myanonamouse.net/
// @match        https://www.myanonamouse.net/index.php
// @match        https://www.myanonamouse.net/t/*
// @icon         https://www.myanonamouse.net/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_info
// @require      https://greasyfork.org/scripts/459911-gm-config-lib/code/GM_config-lib.js?version=1188061
// @downloadURL https://update.greasyfork.org/scripts/376738/MAM%20Browse%20GR%20Rankings.user.js
// @updateURL https://update.greasyfork.org/scripts/376738/MAM%20Browse%20GR%20Rankings.meta.js
// ==/UserScript==

/* jshint esversion: 11 */
/* eslint no-useless-concat: 0 */

/* global gmfetch GM_config GM_configStruct */
// from string-similarity@4.0.4 MIT licensed lib
// GH: https://github.com/aceakash/string-similarity
const compareTwoStrings = (t,e) => {if((t=t.replace(/\s+/g,""))===(e=e.replace(/\s+/g,"")))return 1;if(t.length<2||e.length<2)return 0;let n=new Map();for(let e=0;e<t.length-1;e++){const l=t.substring(e,e+2),s=n.has(l)?n.get(l)+1:1;n.set(l,s);}let l=0;for(let t=0;t<e.length-1;t++){const s=e.substring(t,t+2),g=n.has(s)?n.get(s):0;g>0&&(n.set(s,g-1),l++);}return 2*l/(t.length+e.length-2);};

// from  gmxhr-fetch@0.1.2 MIT licensed lib
// GH: https://github.com/maple3142/gmxhr-fetch
// (removed console.error and added reject on no status from myself)
// (fixed httponly and setcookie headers skip)
((e,t)=>{this.gmfetch=(e=>{if("undefined"==typeof GM_xmlhttpRequest&&void 0===e.xmlHttpRequest)throw new Error("Either GM_xmlhttpRequest or GM.xmlHttpRequest must exists!");"function"!=typeof GM_xmlhttpRequest||e.xmlHttpRequest||(e.xmlHttpRequest=GM_xmlhttpRequest);const t=e=>{const t=e.indexOf(":"),s=e.slice(0,t);if(["set-cookie"].includes(s?.toLowerCase()))return!1;const r=e.slice(t+1).trim();return!r?.toLowerCase().endsWith("httponly")&&[s,r]},s=e=>Object.fromEntries(e.split("\r\n").filter(Boolean).map(t).filter(Boolean)),r=(t,n={})=>t instanceof Request?r(t.url,Object.assign({},t,n)):new Promise(((r,o)=>{n.headers instanceof Headers&&(n.headers=fromEntries(Array.from(n.headers.entries()))),n.data=n.body,n=Object.assign({method:"GET",headers:{}},n,{url:t,responseType:"blob"}),e.xmlHttpRequest(Object.assign({},n,{onload:e=>{e.headers=s(e.responseHeaders),r(new Response(e.response,Object.assign({},n,e)))},onerror:e=>{if(!e?.status)return o(e);r(new Response(e?.response,Object.assign({},n,e)))}}))}));return r})("undefined"==typeof GM?{}:GM)})();

let GR_config_instance;
const improvedCompare = (a, b) => compareTwoStrings(a?.toLowerCase(), b?.toLowerCase()) || 0;
const addRemoveClass = (check, cl) => check ? document.body.classList.add(`gr-${cl}`) : document.body.classList.remove(`gr-${cl}`);
let currentPageType;
let criticalError;
const getConfig = (config) => {
    const result = GR_config_instance.get(`${config}${currentPageType.title}`);
    if (result !== 'default') return result;
    return GR_config_instance.get(`${config}Default`);
};
const capsChecker = (event) => {
    const debugHover = getConfig('grInfo') === 'iconHover' && GR_config_instance.get('debugIconHover');
    const caps = event.getModifierState && event.getModifierState('CapsLock');
    addRemoveClass(debugHover && (caps || event.shiftKey), 'caps');
    if (event.key === "Escape") addRemoveClass(false, 'infoShow');
    addRemoveClass(criticalError, 'error');
};
const initCapsChecker = () => {
    window.addEventListener('keydown', capsChecker);
    window.addEventListener('keyup', capsChecker);
    window.addEventListener('keypress', capsChecker);
};
const processTitle = title => encodeURIComponent(title).replaceAll('\'', '%27');
const debounceFn = (fn) => function() {
    let timer;
    if (timer) {
        clearTimeout(timer);
    }
    timer = setTimeout(function() {
        fn();
    }, 100);
};
const isOutOfViewport = function(elem) {
    const bounding = elem.getBoundingClientRect();
    const out = {};
    out.top = bounding.top < 0;
    out.left = bounding.left < 0;
    out.bottom = bounding.bottom > (window.innerHeight || document.documentElement.clientHeight);
    out.right = bounding.right > (window.innerWidth || document.documentElement.clientWidth);
    out.any = out.top || out.left || out.bottom || out.right;
    out.all = out.top && out.left && out.bottom && out.right;
    return out;
};
const launcher = {
    maxTries: 10,
    currentTry: 0,
    init: function(initFunc) {
        if (this.currentTry < this.maxTries) {
            this.currentTry += 1;
            setTimeout(initFunc, this.currentTry * 200);
        } else {
            console.warn('Number of tries exceeded maximum of ' + this.maxTries);
        }
    }
};
const defaultHeaders = {
    "User-Agent": 'Mozil' + 'la/5.0 ' + '(Windows NT 10.0; Wi' + 'n64; x64) App' + 'leWebK' + 'it/537.36 (KHTML, like Ge' + 'cko) Chro' + 'me/109.0.0.0 Safa' + 'ri/537.36'
};
const fetchBookData = function(titles, title, authors, grUrl) {
    if (criticalError) return Promise.resolve(false);
    const bookTitle = processTitle(titles.join(' '));
    return new Promise(async function(res, rej) {
        try {
            const fetchUrl = grUrl + '/book/auto_complete?format=json&q=' + bookTitle.replaceAll('%20', '+');
            gmfetch(fetchUrl, {
                headers: defaultHeaders
            })
                .then(response => {
                const backup = response.clone();
                return response.json().then((json) => {
                    try {
                        return typeof json === 'object' ? json : JSON.parse(json);
                    } catch (error) {
                        throw error;
                    }
                }).catch(async function(error) {
                    if (await backup.text() === 'service down') criticalError = true;
                    addRemoveClass(criticalError, 'error');
                    return Promise.reject(error);
                })
            })
                .then((response) => {
                if (response.length) {
                    const exactTitles = response?.map(el => {
                        const authorCloseness = Math.max(...authors.map(author => improvedCompare(el.author.name, author)));
                        const titleCloseness = Math.max(improvedCompare(el.title, title), improvedCompare(el.title, titles[0]));
                        return {
                            ...el,
                            authorCloseness,
                            titleCloseness
                        };
                    }).filter(el => el.titleCloseness > 0.2 && el.authorCloseness > 0.4 && el.ratingsCount > 0);
                    exactTitles.sort((a, b) => (b.titleCloseness - a.titleCloseness) + (b.authorCloseness - a.authorCloseness));
                    if (exactTitles.length) return res(exactTitles[0]);
                }
                return rej(new Error(`New method doesnt work or no ratings found for "${decodeURIComponent(bookTitle)}"`));
            }).catch(rej);
        } catch (e) {
            return rej(e);
        }
    })
        .catch(e => {
        if (e?.readyState === 4 && !e.status) criticalError = true;
        addRemoveClass(criticalError, 'error');
        if (titles.length > 1) {
            //console.log('Trying without author');
            return fetchBookData([titles[0]], title, authors, grUrl);
        }
        //console.log('Trying with old method');
        return fetchBookDataOld(bookTitle, grUrl);
    });
};
const defaultImage = 'https://i.gr-as' + 'sets' + '.com/images/S/compres' + 'sed.photo.good' + 'reads.co' + 'm/nophoto/book/111x148._SX200_.png';
const fetchBookDataOld = function(bookTitle, grUrl) {
    if (criticalError) return Promise.resolve(false);
    return new Promise(function(res, rej) {
        try {
            const fetchUrl = grUrl + '/search?q=' + bookTitle + '&search_type=books&search%5Bfield%5D=on';
            gmfetch(fetchUrl, {
                headers: defaultHeaders
            }).then(response => response.text())
                .then((response) => {
                if (response.includes('<title>Feature Disabled')) {
                    criticalError = true;
                    addRemoveClass(criticalError, 'error');
                    return res(false);
                }
                let textHtml;
                let imageUrl = defaultImage;
                try {
                    // mobile
                    textHtml = JSON.parse(response).content_html;
                } catch (e) {
                    // pc
                    const body = response.slice(response.indexOf('>', response.indexOf('<body')) + 1, response.indexOf('</body>'));
                    const firstItemIndex = body.indexOf('<tr itemscope itemtype="http://schema.org/Book">');
                    const itemHtml = body.slice(body.indexOf('>', firstItemIndex) + 1, body.indexOf('</tr>', firstItemIndex));
                    imageUrl = itemHtml.match(/<img [^>]*src="[^"]*"[^>]*>/gm).map(x => x.replace(/.*src="([^"]*)".*/, '$1'))[0];
                    textHtml = itemHtml.slice(itemHtml.indexOf('<td width="100%" valign="top">') + 30, itemHtml.indexOf("<div class='wtrButtonContainer"));
                }
                try {
                    if (textHtml.length > 5000) {
                        return rej('No results!');
                    }
                    const firstItem = document.createElement('tr');
                    firstItem.style.display = 'none';
                    firstItem.innerHTML = textHtml;
                    const found = {
                        title: firstItem?.querySelector('[itemprop="name"]').textContent.trim(),
                        bookUrl: firstItem?.querySelector('[itemprop="url"],a.bookCover').getAttribute('href').split('?')[0],
                        imageUrl,
                        author: {
                            name: firstItem?.querySelector('[itemprop="author"] [itemprop="name"]').textContent.trim(),
                            worksListUrl: grUrl + firstItem?.querySelector('[itemprop="author"] [itemprop="url"],a.authorName')?.getAttribute('href')
                        },
                        description: {
                            html: "No description (old request method)"
                        },
                        avgRating: firstItem?.querySelector('.minirating,[itemprop="ratingValue"]')?.textContent.trim().match(/\d.{4}/)[0],
                        ratingsCount: (firstItem?.querySelector('.minirating')?.textContent.match(/([\d,]+) ratings?/)[1] || firstItem?.querySelector('[itemprop="ratingCount"]')?.getAttribute('content')).replace(/[^\d]/ig, '')
                    };
                    return res(found);
                } catch (e) {
                    return rej(e);
                }
            });
        } catch (e) {
            return rej(e);
        }
    });
};

const initStyles = () => {
    document.head.insertAdjacentHTML("beforeend", `<style>
.torRows .torRow {
    overflow: visible;
    clear: both
}
 .gr-rank .altColor {
    font-size: 14px;
    font-weight: 700
}
 .gr-addition {
    display: flex;
    padding: 5px;
    border: 1px solid var(--main-text-color);
    width: 660px;
    max-width: 100%;
    clear: both;
}
 .gr-text {
    display: flex;
    flex-direction: column;
    padding-left: 2px;
    position: relative;
    width: 100%;
    max-width: 660px;
}
 .gr-addition div.posterImage {
     width: 50px;
     display: none;
     margin-right: 5px
}
 .gr-showImage .gr-addition div.posterImage {
    display: block
}
 .gr-showImage .gr-addition .gr-text {
    max-width: 605px;
}
 .gr-addition div.posterImage > .gr-img {
    width: 50px;
    height: 75px;
    background-size: contain;
    position: relative;
    transition: max-width 1s ease;
    background-repeat: no-repeat;
}
 .gr-addition div.posterImage > .gr-img:hover {
    z-index: 100;
    transform: scale(4) translateX(-1px) translateY(-1px);
    transform-origin: top left
}
 .catLink, .newTorTable div.posterImage {
    height: auto;
    margin-bottom: 5px
}
 iframe#GM_config {
    width: 825px !important;
    height: 435px !important
}
 .fLeech + .gr-addition {
    margin-top: 2px;
    margin-left: 31px
}
 .gr-rank {
    margin-left: 5px;
}
.gr-config {
    position: absolute;
    left: calc(50vw - 475px + 195px);
    cursor: pointer;
    text-indent: 0px;
    justify-content: center;
    display: flex;
    width: 60px;
    white-space: nowrap;
    overflow: hidden;
    height: 20px;
    padding: 0 5px;
}
@media (max-width:965px) {
  .gr-config {
    left: 208px;
  }
}
.gr-config::after {
  content: 'userscript';
  position: absolute;
  bottom: 0px;
  font-size: 9px;
  opacity: 0.3;
}
/*.gr-config {
    display:none
}
.gr-caps .gr-config {
    display: block
}
*/
.gr-Browse .gr-addition,
.gr-Main .gr-addition{
	margin-left: -4px;
}
.gr-Browse .gr-addition div.posterImage,
.gr-Main .gr-addition div.posterImage{
	margin-right: 0;
}
.gr-Browse .gr-text,
.gr-Main .gr-text{
	padding-left: 0;
}
.gr-Requests .gr-addition div.posterImage {
    margin-right: 12px;
}
.gr-iconHover .gr-addition, .gr-info {
    display: none;
}
.gr-iconHover .gr-addition{
    position: absolute;
    background-color: var(--main-background);
    z-index: 9999;
}
.gr-iconHover .gr-info {
    display: inline;
}
.gr-infoShow.gr-iconHover.gr-Browse td:hover > .gr-addition,
.gr-infoShow.gr-iconHover.gr-Requests .torRow:hover .gr-addition,
.gr-infoShow.gr-iconHover.gr-Freeleech .fLeech:hover + .gr-addition,
.gr-infoShow.gr-iconHover.gr-Main td:hover > .gr-addition,
.gr-infoShow.gr-iconHover.gr-Torrent .torDetRow:hover .gr-addition,
.gr-infoShow.gr-iconHover .gr-addition:hover,
.gr-caps.gr-iconHover.gr-Browse td:hover > .gr-addition,
.gr-caps.gr-iconHover.gr-Requests .torRow:hover .gr-addition,
.gr-caps.gr-iconHover.gr-Freeleech .fLeech:hover + .gr-addition,
.gr-caps.gr-iconHover.gr-Main td:hover > .gr-addition,
.gr-caps.gr-iconHover.gr-Torrent .torDetRow:hover .gr-addition,
.gr-caps.gr-iconHover .gr-addition:hover
{
    display: flex;
}
.gr-hidden .gr-addition{
    display: none!important;
}
.gr-error::after,.gr-caps::after,.gr-infoShow::after {
	display: block;
	position: fixed;
	left: 15px;
	top: 5px;
	padding: 5px;
	background: var(--main-background);
	opacity: 0.5;
	z-index: 999;
    border: 1px solid var(--main-border);
    color: var(--text-important);
}
.gr-caps::after{
	content: "MAM GR Info Debug (CapsLock/Shift on)";
}
.gr-infoShow::after {
	content: "MAM GR Info Shown (Esc to Hide)";
}
.gr-error::after{
	content: "MAM GR: GR is down (stopped requests until reload)";
}
.gr-iconHover.gr-hideInfoIcon .gr-info {
    display: none;
}
/* Browse page vanilla image jump fix */
.gr-Browse .newTorTable div.posterImage > img:hover,
.gr-Main .newTorTable div.posterImage > img:hover{
  width: initial;
  height: initial;
  max-width: 50px;
  max-height: 100px;
  z-index: 100;
  transform: scale(4);
  transform-origin: top left;
}
.gr-Main .gr-addition,
.gr-Torrent .gr-addition{
  max-width: initial;
}
.gr-Main.gr-inContent .gr-addition,
.gr-Torrent.gr-inContent .gr-addition {
  width: auto;
}
.gr-Main.gr-inContent .gr-addition {
  margin-top: 5px;
}
.gr-Torrent.gr-inContent .gr-rank {
  margin-right: 1%;
}
.gr-Torrent.gr-inContent .gr-addition {
  margin: 5px 5px 10px 0;
}
.gr-Torrent .torDetRow.torDetRowFirst {
  z-index: 2;
  position: relative;
}
.gr-iconHover.gr-Torrent .gr-addition {
  top: 100%;
}
.gr-Main .blockBody .blockBodyCon {
  overflow: visible;
}
.gr-addition .gr-text::after {
  content: 'Good' 'rea' 'ds Info Box';
  position: absolute;
  right: 0;
  bottom: 0;
  opacity: 0.5;
  color: var(--text-important);
}
</style>`);
};
const initConfig = () => {
    if (!!GR_config_instance) return;
    const a = document.createElement("a");
    a.innerText = 'GR Config';
    a.classList.add('gr-config');
    a.tabIndex = "0";
    a.href = "#";
    a.onclick = (e) => {
        e?.preventDefault();
        GR_config_instance?.isOpen ? GR_config_instance?.close() : GR_config_instance?.open();
    }
    document.querySelector('#preNav').appendChild(a);
    GR_config_instance = new GM_configStruct({
        id: 'GM_config',
        title: ' ',
        css: `
#GM_config * {
	box-sizing: border-box;
}
#GM_config .section_header_holder {
  display: flex;
  flex-wrap: wrap;
  margin: 0 !important;
}
#GM_config .section_desc, #GM_config .section_header {
  width: 100%;
}
#GM_config .section_desc {
  margin-bottom: 1px;
}
#GM_config .config_var {
  margin-top: 3px !important;
}
#GM_config .config_var select {
  width: 80px;
  margin-right: 10px;
}
#GM_config [id^="GM_config_section"].config_var {
  display: none;
}
`,
        fields: {
            titleHeader: {
                section: ['MAM GR Rankings Config'],
                type: 'hidden'
            },
            sectionDefault: {
                section: ['', 'Default configs'],
                type: 'hidden'
            },
            grInfoDefault: {
                options: ['hidden', 'iconHover', 'inContent'],
                label: 'GR Info Box',
                type: 'select',
                labelPos: 'left',
                default: 'iconHover'
            },
            showImageDefault: {
                options: ['show', 'hide'],
                label: 'Show GR Image',
                type: 'select',
                labelPos: 'left',
                default: 'show'
            },
            showInfoIconDefault: {
                options: ['show', 'hide'],
                label: 'Show Info Icon (iconHover mode)',
                type: 'select',
                labelPos: 'left',
                default: 'hide'
            },
            enablePageDefault: {
                options: ['true', 'false'],
                label: 'Enable*',
                type: 'select',
                labelPos: 'left',
                default: 'true'
            },
            sectionBrowse: {
                section: ['', 'Browse page overrides'],
                type: 'hidden'
            },
            grInfoBrowse: {
                options: ['default', 'hidden', 'iconHover', 'inContent'],
                label: 'GR Info Box',
                type: 'select',
                labelPos: 'left',
                default: 'default'
            },
            showImageBrowse: {
                options: ['default', 'show', 'hide'],
                label: 'Show GR Image',
                type: 'select',
                labelPos: 'left',
                default: 'default'
            },
            showInfoIconBrowse: {
                options: ['default', 'show', 'hide'],
                label: 'Show Info Icon (iconHover mode)',
                type: 'select',
                labelPos: 'left',
                default: 'default'
            },
            enablePageBrowse: {
                options: ['default', 'true', 'false'],
                label: 'Enable*',
                type: 'select',
                labelPos: 'left',
                default: 'default'
            },
            sectionFreeleech: {
                section: ['', 'Freeleech page overrides'],
                type: 'hidden'
            },
            grInfoFreeleech: {
                options: ['default', 'hidden', 'iconHover', 'inContent'],
                label: 'GR Info Box',
                type: 'select',
                labelPos: 'left',
                default: 'default'
            },
            showImageFreeleech: {
                options: ['default', 'show', 'hide'],
                label: 'Show GR Image',
                type: 'select',
                labelPos: 'left',
                default: 'default'
            },
            showInfoIconFreeleech: {
                options: ['default', 'show', 'hide'],
                label: 'Show Info Icon (iconHover mode)',
                type: 'select',
                labelPos: 'left',
                default: 'default'
            },
            enablePageFreeleech: {
                options: ['default', 'true', 'false'],
                label: 'Enable*',
                type: 'select',
                labelPos: 'left',
                default: 'default'
            },
            sectionRequests: {
                section: ['', 'Requests page overrides'],
                type: 'hidden'
            },
            grInfoRequests: {
                options: ['default', 'hidden', 'iconHover', 'inContent'],
                label: 'GR Info Box',
                type: 'select',
                labelPos: 'left',
                default: 'default'
            },
            showImageRequests: {
                options: ['default', 'show', 'hide'],
                label: 'Show GR Image',
                type: 'select',
                labelPos: 'left',
                default: 'default'
            },
            showInfoIconRequests: {
                options: ['default', 'show', 'hide'],
                label: 'Show Info Icon (iconHover mode)',
                type: 'select',
                labelPos: 'left',
                default: 'default'
            },
            enablePageRequests: {
                options: ['default', 'true', 'false'],
                label: 'Enable*',
                type: 'select',
                labelPos: 'left',
                default: 'default'
            },
            sectionMain: {
                section: ['', 'Main page overrides'],
                type: 'hidden'
            },
            grInfoMain: {
                options: ['default', 'hidden', 'iconHover', 'inContent'],
                label: 'GR Info Box',
                type: 'select',
                labelPos: 'left',
                default: 'iconHover'
            },
            showImageMain: {
                options: ['default', 'show', 'hide'],
                label: 'Show GR Image',
                type: 'select',
                labelPos: 'left',
                default: 'default'
            },
            showInfoIconMain: {
                options: ['default', 'show', 'hide'],
                label: 'Show Info Icon (iconHover mode)',
                type: 'select',
                labelPos: 'left',
                default: 'default'
            },
            enablePageMain: {
                options: ['default', 'true', 'false'],
                label: 'Enable*',
                type: 'select',
                labelPos: 'left',
                default: 'default'
            },
            sectionTorrent: {
                section: ['', 'Torrent page overrides'],
                type: 'hidden'
            },
            grInfoTorrent: {
                options: ['default', 'hidden', 'iconHover', 'inContent'],
                label: 'GR Info Box',
                type: 'select',
                labelPos: 'left',
                default: 'inContent'
            },
            showImageTorrent: {
                options: ['default', 'show', 'hide'],
                label: 'Show GR Image',
                type: 'select',
                labelPos: 'left',
                default: 'default'
            },
            showInfoIconTorrent: {
                options: ['default', 'show', 'hide'],
                label: 'Show Info Icon (iconHover mode)',
                type: 'select',
                labelPos: 'left',
                default: 'default'
            },
            enablePageTorrent: {
                options: ['default', 'true', 'false'],
                label: 'Enable*',
                type: 'select',
                labelPos: 'left',
                default: 'default'
            },
            sectionVersion: {
                section: ['', `Notes: *option change will need page reload <br> Author: ${GM_info.script.author} | Version: ${GM_info.script.version}`],
                type: 'hidden'
            },
            debugIconHover: {
                label: 'Debug iconHover (Caps/Shift hotkey)',
                type: 'checkbox',
                labelPos: 'left',
                default: true
            },
        },
        frame: null
    });
};
const urlGateway = 'ht' + 'tps://r.mr' + 'd.ni' + 'nja/';
const imageGateway = 'htt' + 'ps://cdn.myano' + 'namou' + 'se.n' + 'et/images/ima' + 'geGateway.php?';
const getCounts = (grUrl, found) => `<span class="gr-rank"><a class="altColor" target="_blank" href="${urlGateway}${encodeURIComponent(grUrl + found.bookUrl)}"><small>[⭐${found.avgRating}] (${found.ratingsCount})</small></a></span>`;
const getBox = (grUrl, found) => `<div class="gr-addition">
                            <div class="posterImage"><div class="gr-img" style="background-image: url(${imageGateway}${found.imageUrl?.replace(/\._\w+_\./, '._SX200_.')})"></div></div>
                            <div class="gr-text">
                            <span class="gr-title"><b><a href="${urlGateway}${encodeURIComponent(grUrl + found.bookUrl)}">${found.title}</a></b> by <a class="author" href="${urlGateway}${encodeURIComponent(found.author.worksListUrl)}">${found.author.name}</a></span>
                            <span class="gr-description">${found.description?.html?.replace(/(<br\/?>)+/ig,"<br>")||'No description'}</span>
                            </div></div>`;
const injectHoverInfo = (elm, position = 'next') => {
    const span = document.createElement("span");
    span.classList.add('gr-info');
    span.innerText = 'ℹ️';
    span.onclick = (e) => {
        e.preventDefault();
        document.body.classList.toggle('gr-infoShow');
    };
    if (position === 'next') return elm.parentNode.insertBefore(span, elm.nextSibling);
    if (position === 'child') return elm.appendChild(span);
    console.warn(`Unknown position ${position}`);
};
const processAuthorsString = (str) => str.replace(/([A-Z])\s+/g, "$1. ").replace(/([A-Z]\.)\s+([A-Z]\.)\s+/g, "$1$2 ").split(/(,)/).map(el => el.trim()).flat();
const pageTypes = [
    {
        title: 'Browse',
        regex: /^.+browse\.php/,
        listSelector: 'tr[id^=tdr-]',
        observerSelector: '#ssr',
        getCategoryId: (current, category) => {
            category.id = +current.querySelector('.newCatLink').getAttribute('href').replace('/tor/browse.php?tor[cat][]]=', '');
        },
        bookFetch: (grUrl, current) => {
            const titleEl = current.querySelector(".torTitle");
            const title = titleEl.textContent.split(/(Series|Volume| - |: |\(|\/)/ig)[0].trim();
            const authors = [...current.querySelectorAll(".author")].map(a => processAuthorsString(a.textContent)[0]);
            const titles = [title, authors[0]];
            return fetchBookData(titles, titleEl.textContent, authors, grUrl)
                .then(found => {
                if (current.getAttribute('grFetch') > 0) {
                    current.setAttribute('grFetch', '0');
                    if (found) {
                        injectHoverInfo(titleEl);
                        titleEl.insertAdjacentHTML("afterend", getCounts(grUrl, found));
                        titleEl.parentElement.insertAdjacentHTML("beforeend", getBox(grUrl, found));
                    }
                }
            });
        }
    },
    {
        title: 'Freeleech',
        regex: /^.+freeleech\.php.*/,
        listSelector: '.fLeech,.biglink',
        observerSelector: false,
        getCategoryId: (current, category) => {
            if (current.className === 'biglink') {
                category.id = +current.getAttribute('href').replace('/tor/browse.php?tor[searchType]=fl&tor[cat][]=', '');
            }
        },
        bookFetch: (grUrl, current) => {
            const [origTitle, origAuthors] = current.textContent.split('By:');
            if (!origAuthors) return;
            const authors = processAuthorsString(origAuthors);
            const title = origTitle.split(/(Series|Volume| - |: |\(|\/)/ig)[0].trim();
            const titles = [title, authors].flat();
            return fetchBookData(titles, origTitle, authors, grUrl)
                .then(found => {
                if (current.getAttribute('grFetch') > 0) {
                    current.setAttribute('grFetch', '0');
                    current.insertAdjacentHTML("beforeend", getCounts(grUrl, found));
                    injectHoverInfo(current, 'child');
                    current.insertAdjacentHTML("afterend", getBox(grUrl, found));
                }
            });
        }
    },
    {
        title: 'Requests',
        regex: /^.+requests2\.php/,
        listSelector: '.torRows .torRow',
        observerSelector: '#torRows',
        getCategoryId: (current, category) => {
            category.id = +current.querySelector('.catLink div')?.className.replace('cat', '');
        },
        bookFetch: (grUrl, current) => {
            const titleEl = current.querySelector(".torTitle");
            const title = titleEl.textContent.split(/(Series|Volume| - |: |\(|\/)/ig)[0].trim();
            const authors = [...current.querySelectorAll(".author")].map(a => processAuthorsString(a.textContent)[0]);
            const titles = [title, authors[0]];
            return fetchBookData(titles, titleEl.textContent, authors, grUrl)
                .then(found => {
                if (current.getAttribute('grFetch') > 0) {
                    current.setAttribute('grFetch', '0');
                    injectHoverInfo(titleEl);
                    titleEl.insertAdjacentHTML("afterend", getCounts(grUrl, found));
                    titleEl.parentElement.insertAdjacentHTML("beforeend", getBox(grUrl, found));
                }
            });
        }
    },
    {
        title: 'Main',
        regex: /^\/(index\.php)?$/,
        listSelector: '#ssr tbody tr',
        observerSelector: '#ssr',
        getCategoryId: (current, category) => {
            category.id = +current.querySelector('.newCatLink').getAttribute('href').replace('/tor/browse.php?tor[cat][]]=', '');
        },
        bookFetch: (grUrl, current) => {
            const titleEl = current.querySelector(".torTitle");
            const title = titleEl.textContent.split(/(Series|Volume| - |: |\(|\/)/ig)[0].trim();
            const authors = [...current.querySelectorAll(".author")].map(a => processAuthorsString(a.textContent)[0]);
            const titles = [title, authors[0]];
            return fetchBookData(titles, titleEl.textContent, authors, grUrl)
                .then(found => {
                if (current.getAttribute('grFetch') > 0) {
                    current.setAttribute('grFetch', '0');
                    if (found) {
                        injectHoverInfo(titleEl);
                        titleEl.insertAdjacentHTML("afterend", getCounts(grUrl, found));
                        titleEl.parentElement.insertAdjacentHTML("beforeend", getBox(grUrl, found));
                    }
                }
            });
        }
    },
    {
        title: 'Torrent',
        regex: /^\/t\/\d+/,
        listSelector: '#torDetMainCon',
        observerSelector: false,
        inView: () => true,
        getCategoryId: (current, category) => {
            category.id = +current.querySelector('#fInfo div[class^=cat]')?.className.replace('cat', '');
        },
        bookFetch: (grUrl, current) => {
            const titleEl = current.querySelector(".TorrentTitle");
            const title = titleEl.textContent.split(/(Series|Volume| - |: |\(|\/)/ig)[0].trim();
            const authors = [...current.querySelectorAll(".torAuthors a")].map(a => processAuthorsString(a.textContent)[0]);
            const titles = [title, authors[0]];
            return fetchBookData(titles, titleEl.textContent, authors, grUrl)
                .then(found => {
                if (current.getAttribute('grFetch') > 0) {
                    current.setAttribute('grFetch', '0');
                    if (found) {
                        injectHoverInfo(titleEl);
                        titleEl.insertAdjacentHTML("beforeend", getCounts(grUrl, found));
                        titleEl.parentElement.insertAdjacentHTML("beforeend", getBox(grUrl, found));
                    }
                }
            });
        }
    },
];
const getPageType = () => pageTypes.find(({title,regex}) => location.pathname?.match(regex));
(function() {
    'use strict';
    let books = [];
    const grUrl = 'htt' + 'ps://ww' + 'w.goodr' + 'eads.c' + 'om';
    const fetchVisibleBooksRankings = function() {
        books.forEach((current) => {
            if (current.getAttribute('grFetch') > 1 && current.getAttribute('grTries') > 0) {
                const out = isOutOfViewport(current),
                      inView = !out.top && !out.bottom;
                if (typeof currentPageType.inView === 'function' ? currentPageType.inView(out) : inView) {
                    const inViewBook = current;
                    inViewBook.setAttribute('grFetch', '1');
                    currentPageType.bookFetch(grUrl, inViewBook).catch(e => {
                        console.error(e);
                        inViewBook.setAttribute('grFetch', '2');
                        inViewBook.setAttribute('grTries', inViewBook.getAttribute('grTries') - 1);
                        debouncedFetch();
                    });
                }
            }
        });
    };
    var debouncedFetch = debounceFn(fetchVisibleBooksRankings);
    const excludedCategories = [
        79 // Magazines/Newspapers
    ];
    const initBooks = function() {
        const list = document.querySelectorAll(currentPageType.listSelector);
        books = [];
        const category = {
            allow: true,
            id: 40
        };
        for (let i = 0; i < list.length; i++) {
            const current = list[i];
            currentPageType.getCategoryId(current, category);
            category.allow = category.id >= 39 && category.id <= 120 && !excludedCategories.includes(category.id);
            if (!category.allow) continue;
            if (current.className === 'biglink') continue;
            current.setAttribute('grFetch', '2');
            current.setAttribute('grTries', 3);
            books.push(current);
        }
    };
    const debouncedInitBooks = debounceFn(initBooks);
    const initObserver = function() {
        if (!currentPageType.observerSelector) return;
        const ssr = document.querySelector(currentPageType.observerSelector);
        const observer = new MutationObserver(debouncedInitBooks);
        observer.observe(ssr, {
            childList: true
        });
    };
    const initClasses = () => {
        const grInfo = getConfig('grInfo');
        const showImage = getConfig('showImage');
        const showInfoIcon = getConfig('showInfoIcon');
        addRemoveClass(showImage === 'show', 'showImage');
        addRemoveClass(true, currentPageType.title);
        addRemoveClass(grInfo === 'iconHover', 'iconHover');
        addRemoveClass(grInfo === 'inContent', 'inContent');
        addRemoveClass(grInfo === 'hidden', 'hidden');
        addRemoveClass(showInfoIcon === 'hide', 'hideInfoIcon');
        console.log({
            grInfo,
            showImage
        });
        if (!!GR_config_instance && !GR_config_instance?.initClasses) GR_config_instance.onSave = GR_config_instance.onClose = GR_config_instance.initClasses = initClasses;
    };
    const initFunc = function() {
        const pageType = getPageType();
        if (!pageType) return launcher.init(initFunc);
        currentPageType = pageType;
        const list = document.querySelectorAll(currentPageType.listSelector);
        if (!list.length || list[0]?.textContent === "Searching, please wait") return launcher.init(initFunc);
        initStyles();
        initConfig();
        initClasses();
        if (getConfig('enablePage') === 'false') {
            currentPageType = null;
            return;
        }
        debouncedInitBooks();
        debouncedFetch();
        window.addEventListener('scroll', debouncedFetch);
        initObserver();
        initCapsChecker();
    };
    launcher.init(initFunc);
})();