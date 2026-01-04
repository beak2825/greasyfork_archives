// ==UserScript==
// @name         Old Wikipedia Layout Fixed
// @namespace    http://greasyfork.org/
// @version      1.0.1
// @description  Redirects Wikipedia to use the good (pre-2023) skin. Fork of https://greasyfork.org/en/scripts/458494-old-wikipedia-layout with bugfixes.
// @author       Marp
// @match        *://*.wikipedia.org/*
// @icon         https://www.google.com/s2/favicons?domain=www.wikipedia.org
// @grant        none
// @license      MIT
// @source       https://github.com/marp/tampermonkey-scripts
// @downloadURL https://update.greasyfork.org/scripts/497152/Old%20Wikipedia%20Layout%20Fixed.user.js
// @updateURL https://update.greasyfork.org/scripts/497152/Old%20Wikipedia%20Layout%20Fixed.meta.js
// ==/UserScript==

//choose from: vector, monobook, timeless, minerva
const skinchoice = 'vector';

function test(url){
    return !!url.match(/(?!.*useskin)^(|http(s?):\/\/)(|www\.|\w{2,6}\.)(|m\.)wikipedia.org(\/.*|$)/gim);
}

function getNewPage(url) {
    const useskinParam = `useskin=${skinchoice}`;
    let newURL = url;

    if (url.includes('#')) {
        const [baseURL, section] = url.split('#');
        const separator = baseURL.includes('?') ? '&' : '?';
        newURL = `${baseURL}${separator}${useskinParam}#${section}`;
    } else if (!url.includes('useskin=')) {
        const separator = url.includes('?') ? '&' : '?';
        newURL = `${url}${separator}${useskinParam}`;
    }

    return newURL;
}

function fixWikiLinks(){
    var links = Array.prototype.slice.call(document.links, 0);
    links.filter(function(link){
        if(test(link.href)){
            var greatNewLink = getNewPage(link.href);

            if((typeof(link.onclick) == "undefined" || link.onclick == null) && (!link.classList.contains("mw-file-description"))){
                link.addEventListener("click", e => {
					e.preventDefault();
					window.location.assign(greatNewLink);
                });
            }

            if(typeof(link.mousedown) == "undefined" || link.mousedown == null){
                link.addEventListener("mousedown", e => {
                    if (e.button === 1) {
                        e.preventDefault();
                        window.open(greatNewLink, '_blank');
                    }
                });
           }
        }
    });
}

fixWikiLinks();
document.addEventListener("DOMContentLoaded", fixWikiLinks);

const currentURL = window.location.href;
const previousURL = localStorage.getItem('previousURL');

if (test(currentURL) && currentURL !== previousURL) {
    localStorage.setItem('previousURL', currentURL);
    window.location.assign(getNewPage(currentURL));
}
