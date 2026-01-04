// ==UserScript==
// @name        Subscene Cleaner
// @description Cleans up Subscene
// @author      Lelobster
// @namespace   https://github.com/LeLobster/userscripts/
// @locale      English
// @include     https://subscene.com/subtitles/*
// @match       https://subscene.com/subtitles/*
// @exclude     https://subscene.com/subtitles/*/*
// @version     1.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/30546/Subscene%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/30546/Subscene%20Cleaner.meta.js
// ==/UserScript==

document.addEventListener('DOMContentLoaded', hideTV);
document.addEventListener('DOMContentLoaded', styleSettings);
document.addEventListener('DOMContentLoaded', cleanSubs);

function hideTV() {
    series = document.querySelector('h2');
    if (series.textContent == 'TV-Series') {
        series.nextElementSibling.style.display = 'none'
        series.style.display = 'none'
    }
}

function styleSettings() {  
    document.getElementsByClassName('subtitles byFilm')[0].style.marginTop = '-99px';
    
    document.styleSheets[0].insertRule('* { vertical-align: top !important; }', 0);
    document.styleSheets[0].insertRule('#content { min-height: unset !important; }', 0);
    document.styleSheets[0].insertRule('.sustain { display: none !important; }', 0);
    document.styleSheets[0].insertRule('.subtitles td div { \
        overflow-x: auto !important; width: 444px !important; \
    }', 0);
    
    document.querySelector('#content').style.width = '90%';
    document.querySelector('header').style.width = '90%';
    document.querySelector('footer').style.width = '90';
    document.querySelector('div#search div.filter ul li a').style.display = 'none'
    
    document.querySelector('.byFilm .poster').style.display = 'none';
    nameHeader = document.querySelector('.byFilm .header');
    nameHeader.style.paddingLeft = '0px';
    nameHeader.style.width = '-moz-available';
    ratingHeader = document.querySelector('[class="content clearfix"]');
    ratingHeader.childNodes[1].style.display = 'none';
    ratingHeader.childNodes[3].style.display = 'none';
    ratingHeader.style.padding = '0px';
    
    if (document.querySelector('.header ul li:nth-child(2)') != null) {
        document.querySelector('.header ul li:nth-child(2)').style.display = 'none';
    }
}

function cleanSubs() {
    subList = document.querySelectorAll('div.content table tbody tr');
    sepArr = [];
    goodUploaders = ['GoldenBeard', 'Luis-subs'];
    keepLangs = ['english'];
    // hiddenLanguages = 0
    // hiddenDuplicates = 0
    // trailerSubs = 0
    
    subList.forEach(function(subTr) {
        // Remove empty tr's
        langStart = subTr.firstElementChild.id.toLowerCase();
        if (subTr.childElementCount < 2 && keepLangs.indexOf(langStart) == -1) {
            subTr.remove(subTr);
        } else if (subTr.childElementCount > 1) {
            // Remove unwanted languages
            subLang = subTr.firstElementChild.firstElementChild.firstElementChild.innerText.toLowerCase();
            if (keepLangs.indexOf(subLang) == -1) {
                subTr.remove(subTr);
                // hiddenLanguages++
            } else {
                // Remove subtitles with the word trailer
                subComment = subTr.lastElementChild.innerText.toLowerCase();
                subName = subTr.firstElementChild.firstElementChild.lastElementChild.innerText.toLowerCase();
                if (subComment.indexOf('trailer') != -1 || subName.indexOf('trailer') != -1) {
                    subTr.remove(subTr);
                    // trailerSubs++
                } else {
                    // Remove duplicate subtitles
                    currentHref = subTr.firstElementChild.firstElementChild.href;
                    if (sepArr.indexOf(currentHref) == -1) {
                        sepArr.push(currentHref);
                    } else {
                        subTr.remove(subTr);
                        // hiddenDuplicates++
                    }
                }
            }
            uploadName = subTr.children[3].innerText;
            if (goodUploaders.indexOf(uploadName) != -1) {
                subTr.style.fontWeight = 'bold';
            }
        }
    });
    // console.log(trailerSubs, 'trailer subtitles hidden')
    // console.log(hiddenLanguages, 'unwanted language subtitles hidden');
    // console.log('Another', hiddenDuplicates, 'duplicate subtitles hidden');
}
