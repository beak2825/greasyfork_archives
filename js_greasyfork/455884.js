// ==UserScript==
// @name        Ao3 De-Piped Tags
// @match       https://archiveofourown.org/*
// @match       http://archiveofourown.org/*
// @version     1.1
// @author      laireshi
// @description For some fandoms, a character is given two names, like: "Geralt z Rivii | Geralt of Rivia". This script lets you choose which name you want to see.
// @namespace https://greasyfork.org/users/991512
// @downloadURL https://update.greasyfork.org/scripts/455884/Ao3%20De-Piped%20Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/455884/Ao3%20De-Piped%20Tags.meta.js
// ==/UserScript==

//SCRIPT SETTINGS//
const sideToDisplay = 'right'; //left OR right, for character tags with one pipe (two names)
const partToDisplay = 'right'; // left OR right OR central, for character tags with two pipes (three names)
const tagsOnFicPage = 0; //0 to disable, 1 to enable

//SCRIPT FUNCTIONS//
const shortenCharTag = function (fullTag){
    'use strict';

    const pipe = fullTag.indexOf('|');
    let pipeRight = -1;
    if (pipe !== fullTag.lastIndexOf('|')) {
        pipeRight = fullTag.lastIndexOf('|');
    }
    let newTag;
    if (pipeRight === -1) { //just one pipe
        newTag = sideToDisplay === 'left' ? fullTag.slice(0, pipe - 1) : newTag = fullTag.slice(pipe + 2);
    } else { //two pipes
        newTag = partToDisplay === 'left' ? fullTag.slice(0, pipe - 1) : partToDisplay === 'right' ? fullTag.slice(pipeRight + 2) : fullTag.slice(pipe + 2, pipeRight);
    }
    return newTag.trim();
};

const shortenRelTag = function(fullTag){
    'use strict';
    const gen = '&';
    const rom = '/';
    let names = fullTag.includes(rom) ? fullTag.split(rom) : fullTag.replace(/&amp; */g,'&').split(gen);
    names = names.map(n => {
        return n.includes('|') ? shortenCharTag(n) : n;
    });
    return fullTag.includes(rom) === true ? names.join(rom) : names.join(` ${gen} `);
};

const shortenPipes = function(){
    'use strict';
    //work blurbs when browsing tag pages
    let chars = Array.from(document.getElementsByClassName('characters'));
    chars.forEach(char => {
        let charTag = char.childNodes[0].innerHTML;
        if (charTag.includes('|')) {
            charTag = shortenCharTag(charTag);
            char.childNodes[0].innerHTML = charTag;
        }
    });
    let rels = Array.from(document.getElementsByClassName('relationships'));
    rels.forEach(rel => {
        let relTag = rel.childNodes[0].innerHTML;
        if (relTag.includes('|')) {
            relTag = shortenRelTag(relTag);
            rel.childNodes[0].innerHTML = relTag;
        }
    });

    //on a single work page
    if (tagsOnFicPage === 1) {
        let charsFic = Array.from(document.querySelectorAll('dd.character a'));
            charsFic.forEach(cF => {
                let cFTag = cF.innerHTML;
                if (cFTag.includes('|')) {
                    cFTag = shortenCharTag(cFTag);
                    cF.innerHTML = cFTag;
                }
            });
            let relsFic = Array.from(document.querySelectorAll('dd.relationship a'));
            relsFic.forEach(rF => {
                let rFTag = rF.innerHTML;
                if (rFTag.includes('|')) {
                    rFTag = shortenRelTag(rFTag);
                    rF.innerHTML = rFTag;
                }
            });
        }
};

shortenPipes();