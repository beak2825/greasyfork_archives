// ==UserScript==
// @name         Ebook to GGN Check
// @namespace    https://greasyfork.org/
// @version      0.1
// @license      MIT
// @description  Check MaM and Anna's Archive searches on GGN
// @author       You
// @match        https://www.myanonamouse.net/*browse.php?*
// @match        https://annas-archive.org/search?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=myanonamouse.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473101/Ebook%20to%20GGN%20Check.user.js
// @updateURL https://update.greasyfork.org/scripts/473101/Ebook%20to%20GGN%20Check.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

const ggn_icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADYElEQVQ4TxWTTUycVRSGn/v9f/NHYSAgUBpoCpmGNgaihYhlWihNMMZGNxJoI2narlwYu+qibpqmS+PCv42xMV3UusAQQ9qFqGhsjCmmJmpFC7ZGWhIYZvhmvt+5Xu7mJjf35D3nPc8rCidOyyAGzbAxTZMk8DE0QZTUQZi4BCR+lSDVTBTXyetVvFijKi2arRBxZOKc9KqqyDUJQo84qpJKW0ghqSOQmo1MlIKZJooCrMQHwyTGQCQBou/Y6xJ1dN1E0zSEZpAkiSrUsWyHUKlKoWHENUhC9a7+7d7qj69ZiP0TM9LSVLdKJQxjHDtLNtdIPVGiaiTpZBFCIMqP8SslQidPVFonbdTZsVsR/ePnpZF4mLLGxbff5PhEEctSHamuFr9b4t2b36JFHmcmX2SkeAwzZytf4L+/Vzn91hVE79islNUSVy9fZGDgWeYW7rCwuERHexujI8PM3/2dl4cKnHxhkNs/LPP+p7dIRVuMHx1ibvFnRM+JaTlQ6OHaO5e4fuMLvrm3gtnUSaahmWzaVaOEXJ4e46+VFT6a+56NzW2izX8QccxWLUYcHp2WJ0YGOTc7xaUrV/EzbRitXZiZHLlsmnw2y8xgnqW7yyz8UaGqfKitP6RU2SEO1Br7Tp6Rxw/3MTU1xbVPrqMbgguTRfY2OnhIvlzN8FKv4OtfH/LjgxKvdDsUD+7jqZbjvY8/RBwsXpCFfQ5vnBrll/trLD2O0Np7eL4rxXirxtyTmCPP2AQ1n/nldZ5sezjlR8y+NsnnN28hCmMzMtBiZl6d4FBnG0v3HvBbOeK5Qhf9psd8Oc9ex2QwF/Nos8xnP63SICqcV1u58dWyWuPoKYnRRBCFDA/uZ+hQN2kFSMmLqCsT7/y5RVNDnqbSCr0djejNnejlNerlbT64vYLonjgrG2Mf04CKYeEqiFxF3558C5vSIG3beArhdNpgc30dsaOYqW4oEgMqZgOipXhWgfQUV68T1F2E7ih0a1i6puZWiJqNGOG/yF2y9BRxJSS9p53tXdyTLUTHgaOy5irH/ZhMErF2X5GnEhjFEtt02LYh4we4Zp2aiq2bztJ8YBjfyCgiPURbX78MzA48YROHG7Q4KjPVOpqdYUcl0xIRukipYnBdmwhfpdwiVgnOqKb+BxURb2E6lKcUAAAAAElFTkSuQmCC";
const ggn_search = "https://gazellegames.net/torrents.php?groupname=";

const max_tries = 20;

var timer, tries;

(function(){
    init();
}());

function init() {
    console.log("Started Timer");
    let loc;
    if (window.location.href.includes('myanonamouse.net')) loc = "mam";
    else if (window.location.href.includes('annas-archive.org')) loc = "annas";
    setTimeout(()=>{addGGNLinks(loc);}, 500);
}

async function addGGNLinks(loc) {
    'use strict';
    let torrent_titles, placer;
    if (loc === "mam") {
        torrent_titles = document.querySelectorAll('a.torTitle');
        placer = (place, what) => { return place?.parentElement?.nextElementSibling.append(what); };
        document.querySelectorAll('.nextPage , .prevPage')?.forEach( b => {
            b?.addEventListener("click", init);
        });
    }
    else if (loc === "annas") {
        torrent_titles = document.querySelectorAll('h3.truncate');
        placer = (place, what) => { return place?.prepend(what); };
        const currScroll = window.pageYOffset;
        await async function () {
            window.scrollTo(0, document.body.scrollHeight);
            await new Promise(r => setTimeout(r, 800));
            window.scrollTo(0, currScroll);
        }();
    }
    if (tries++ >= max_tries) return false;
    if (!torrent_titles?.length) { setTimeout(()=>{addGGNLinks(loc);}, 500); return false;}
    console.log(torrent_titles);
    torrent_titles?.forEach( title => {
        let a = document.createElement("a");
        a.href = ggn_search + title?.innerText?.replace(/[!,-:#\?\+\.&\'\"]/gi,""); //remove punctuation
        a.target = "_blank";
        let image = document.createElement("img");
        image.src = ggn_icon;
        image.alt = "Search on GGN";
        a.append(image);
        placer(title, a);
    });
    console.log("Completed Adding Links");
}