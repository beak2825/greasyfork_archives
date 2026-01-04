// ==UserScript==
// @name         SearchSpecificSite
// @version      0.1
// @description  Adds a button to search Reddit posts with Google
// @author       Mario O.M.
// @match        *://*.google.com/search*
// @match        *://*.google.ca/search*
// @run-at       document-end
// @license MIT
// @namespace https://greasyfork.org/users/836868
// @downloadURL https://update.greasyfork.org/scripts/496544/SearchSpecificSite.user.js
// @updateURL https://update.greasyfork.org/scripts/496544/SearchSpecificSite.meta.js
// ==/UserScript==

// If the UI version is new
const newUI = true;

const queryRegex = /q=[^&]+/g;
const siteRegex = /\+site(?:%3A|\:).+\.[^&+]+/g;

const url_YT = '+site%3Ayoutube.com';
const textNode_YT = '|YT';

const url_reddit = '+site%3Areddit.com';
const textNode_reddit = '|Reddit';

const url_ELI5 = '+site%3Areddit.com%2Fr%2Fexplainlikeimfive';
const textNode_ELI5 = '|rELI5';

const url_engL = '+site%3Areddit.com%2Fr%2FEnglishLearning';
const textNode_engL = '|rEngL';

const url_wordref = '+site%3Aforum.wordreference.com';
const textNode_wordref = '|Wordref';

const url_hi = '+site%3Ahinative.com';
const textNode_hi = '|Hi';

const url_bbc = '+site%3Abbc.com';
const textNode_bbc = '|BBC';

const url_cnn = '+site%3Acnn.com';
const textNode_cnn = '|CNN';

const url_npr = '+site%3Anpr.org';
const textNode_npr = '|NPR';

const url_nyt = '+site%3Anytimes.com';
const textNode_nyt = '|nyt';

const url_WP = '+site%3Awashingtonpost.com';
const textNode_WP = '|WP';

const url_WSJ = '+site%3Awsj.com';
const textNode_WSJ = '|WSJ';


const isImageSearch = /[?&]tbm=isch/.test(location.search);

(function () {
    // Creating the element
    let el = document.createElement('div');
    el.className = 'hdtb-mitem';

    const link_YT = document.createElement('a');
    const link_reddit = document.createElement('a');
    const link_ELI5 = document.createElement('a');
    const link_engL = document.createElement('a');
    const link_wordref = document.createElement('a');
    const link_hi = document.createElement('a');
    const link_bbc = document.createElement('a');
    const link_cnn = document.createElement('a');
    const link_npr = document.createElement('a');
    const link_nyt = document.createElement('a');
    const link_WP = document.createElement('a');
    const link_WSJ = document.createElement('a');

    // Hyperlink to add 'site:reddit.com' to the query
    link_YT.appendChild(document.createTextNode(textNode_YT));
    link_YT.href = window.location.href.replace(queryRegex, (match) => {
        // Replaces the existing `site` flags
        return match.search(siteRegex) >= 0 ? match.replace(siteRegex, url_YT) : match + url_YT ;
    });

    link_reddit.appendChild(document.createTextNode(textNode_reddit ));
    link_reddit.href = window.location.href.replace(queryRegex, (match) => {
        // Replaces the existing `site` flags
        return match.search(siteRegex) >= 0 ? match.replace(siteRegex, url_reddit ) : match + url_reddit ;
    });

    link_ELI5.appendChild(document.createTextNode(textNode_ELI5));
    link_ELI5.href = window.location.href.replace(queryRegex, (match) => {
        // Replaces the existing `site` flags
        return match.search(siteRegex) >= 0 ? match.replace(siteRegex, url_ELI5) : match + url_ELI5;
    });

    link_engL.appendChild(document.createTextNode(textNode_engL));
    link_engL.href = window.location.href.replace(queryRegex, (match) => {
        // Replaces the existing `site` flags
        return match.search(siteRegex) >= 0 ? match.replace(siteRegex, url_engL) : match + url_engL;
    });

    link_wordref.appendChild(document.createTextNode(textNode_wordref ));
    link_wordref.href = window.location.href.replace(queryRegex, (match) => {
        // Replaces the existing `site` flags
        return match.search(siteRegex) >= 0 ? match.replace(siteRegex, url_wordref ) : match + url_wordref ;
    });

    link_hi.appendChild(document.createTextNode(textNode_hi));
    link_hi.href = window.location.href.replace(queryRegex, (match) => {
        // Replaces the existing `site` flags
        return match.search(siteRegex) >= 0 ? match.replace(siteRegex, url_hi ) : match + url_hi ;
    });

    link_bbc.appendChild(document.createTextNode(textNode_bbc));
    link_bbc.href = window.location.href.replace(queryRegex, (match) => {
        // Replaces the existing `site` flags
        return match.search(siteRegex) >= 0 ? match.replace(siteRegex, url_bbc) : match + url_bbc;
    });

    link_cnn.appendChild(document.createTextNode(textNode_cnn));
    link_cnn.href = window.location.href.replace(queryRegex, (match) => {
        // Replaces the existing `site` flags
        return match.search(siteRegex) >= 0 ? match.replace(siteRegex, url_cnn) : match + url_cnn;
    });

    link_npr.appendChild(document.createTextNode(textNode_npr));
    link_npr.href = window.location.href.replace(queryRegex, (match) => {
        // Replaces the existing `site` flags
        return match.search(siteRegex) >= 0 ? match.replace(siteRegex, url_npr) : match + url_npr;
    });

    link_nyt.appendChild(document.createTextNode(textNode_nyt));
    link_nyt.href = window.location.href.replace(queryRegex, (match) => {
        // Replaces the existing `site` flags
        return match.search(siteRegex) >= 0 ? match.replace(siteRegex, url_nyt) : match + url_nyt;
    });

    link_WP.appendChild(document.createTextNode(textNode_WP));
    link_WP.href = window.location.href.replace(queryRegex, (match) => {
        // Replaces the existing `site` flags
        return match.search(siteRegex) >= 0 ? match.replace(siteRegex, url_WP) : match + url_WP;
    });

    link_WSJ.appendChild(document.createTextNode(textNode_WSJ));
    link_WSJ.href = window.location.href.replace(queryRegex, (match) => {
        // Replaces the existing `site` flags
        return match.search(siteRegex) >= 0 ? match.replace(siteRegex, url_WSJ) : match + url_WSJ;
    });


    if (isImageSearch) {
        //link.classList.add('NZmxZe');
        //el = link;
    } else {
        el.appendChild(link_YT );
        el.appendChild(link_reddit);
        el.appendChild(link_ELI5 );
        el.appendChild(link_engL);
        el.appendChild(link_wordref );
        el.appendChild(link_hi);
        el.appendChild(link_bbc );
        el.appendChild(link_cnn);
        el.appendChild(link_npr );
        el.appendChild(link_nyt);
        el.appendChild(link_WP );
        el.appendChild(link_WSJ);
    }

    // Inserting the element into Google search
    /*
    if (newUI) {
        const toolsBtn = document.querySelector(isImageSearch ? '.ssfWCe' : '.xhjkHe');
        toolsBtn.parentNode.appendChild(el, toolsBtn);
    } else {
        //const toolsBtn = document.querySelector(isImageSearch ? '.ssfWCe' : '.IC1Ck');
        //toolsBtn.parentNode.insertBefore(el, toolsBtn);
    }
    */
    // Inserting the element into Google search
    //const toolsBtn1 = document.querySelector(isImageSearch ? '.ssfWCe' : '.xhjkHe');
    const toolsBtn1 = document.querySelector(isImageSearch ? '.ssfWCe' : '#tools_1');
    if (toolsBtn1!=null){
        toolsBtn1.parentNode.appendChild(el, toolsBtn1);
    }

    /*
    const toolsBtn2 = document.querySelector(isImageSearch ? '.ssfWCe' : '.IC1Ck');
    if (toolsBtn2!=null){
        toolsBtn2.parentNode.insertBefore(el, toolsBtn2);
    }
    */
})();