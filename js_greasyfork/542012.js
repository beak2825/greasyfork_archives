// ==UserScript==
// @name         Liste des chaînes Canal+ selon l'ordre TNT
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Rearrange elements inside .z-10 by a defined list of img alt attributes, supporting duplicate alts
// @author       MAX524
// @match        https://www.canalplus.com/live/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542012/Liste%20des%20cha%C3%AEnes%20Canal%2B%20selon%20l%27ordre%20TNT.user.js
// @updateURL https://update.greasyfork.org/scripts/542012/Liste%20des%20cha%C3%AEnes%20Canal%2B%20selon%20l%27ordre%20TNT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Tampermonkey script loaded!');

    const desiredOrder = [
        "TF1",
        "FRANCE 2",
        "FRANCE 3",
        "FRANCE 4",
        "FRANCE 5",
        "M6",
        "ARTE",
        "LCP",
        "W9",
        "TMC",
        "TFX",
        "GULLI",
        "BFM TV",
        "CNEWS",
        "LCI",
        "FRANCE INFO:",
        "CSTAR",
        "T18",
        "TF1 SERIES FILMS",
        "L'EQUIPE",
        "6TER",
        "RMC STORY",
        "RMC DECOUVERTE",
        "CHERIE 25",
        "A LA UNE",
        "CHAINE EVENEMENT",
        "CANAL+",
        "CANAL+ SPORT 360",
        "CANAL+ FOOT",
        "CANAL+ SPORT",
        "CANAL+ BOX OFFICE",
        "CANAL+ GRAND ECRAN",
        "CANAL+ CINEMA(S)",
        "CANAL+ SERIES",
        "CANAL+ DOCS",
        "CANAL+ KIDS",
        "TOUS VOS PROGRAMMES",
        "CANAL+ BOX OFFICE",
        "CANAL+ GRAND ECRAN",
        "CANAL+ CINEMA(S)",
        "OCS",
        "CINE+ FRISSON",
        "CINE+ EMOTION",
        "CINE+ FAMILY",
        "CINE+ FESTIVAL",
        "CINE+ CLASSIC",
        "PARAMOUNT NETWORK",
        "ACTION",
        "TCM CINEMA",
        "POLAR+",
        "SERIE CLUB",
        "WARNER TV ",
        "TV BREIZH",
        "RTL9",
        "AB1",
        "NOVELAS TV",
        "CANAL+ UHD HDR",
        "EVENEMENT SPORT UHD HDR",
        "FRANCE 2 UHD HDR",
        "INFOSPORT+",
        "EVENEMENT SPORT 4K UHD",
        "BEIN SPORTS 1",
        "BEIN SPORTS 2",
        "BEIN SPORTS 3",
        "EUROSPORT 1",
        "EUROSPORT 2",
        "DAZN 1",
        "GOLF+",
        "AUTOMOTO LA CHAINE",
        "EQUIDIA",
        "SPORT EN FRANCE",
        "COMEDIE+",
        "OLYMPIA TV",
        "PARIS PREMIERE",
        "TEVA",
        "BET",
        "TLC",
        "TV5 MONDE",
        "PLANETE+",
        "PLANETE+ CRIME",
        "PLANETE+ AVENTURE",
        "MUSEUM",
        "USHUAÏA TV",
        "HISTOIRE TV",
        "TOUTE L'HISTOIRE",
        "DISCOVERY",
        "Investigation Discovery ",
        "SEASONS",
        "CHASSE ET PECHE",
        "ANIMAUX",
        "TV MONACO",
        "FIGARO TV",
        "8 MONT BLANC",
        "PIWI+",
        "NICKELODEON JR",
        "TIJI",
        "CARTOONITO",
        "BOOMERANG",
        "TELETOON+",
        "TELETOON+",
        "CARTOON NETWORK ",
        "NICKELODEON",
        "NICKELODEON+1",
        "CANAL J",
        "NICKELODEON TEEN",
        "MTV",
        "MCM",
        "COMEDY CENTRAL",
        "J-ONE",
        "MANGAS",
        "GAME ONE",
        "ES1",
        "WARNER TV NEXT",
        "LA CHAINE METEO",
        "FRANCE 24",
        "EURONEWS ",
        "BBC NEWS",
        "CNN INT.",
        "AL JAZEERA ENG",
        "BFM BUSINESS",
        "BLOOMBERG TV",
        "CNBC",
        "I24 NEWS",
        "KTO",
        "CSTAR HITS FRANCE",
        "M6 MUSIC",
        "NRJ HITS",
        "TRACE URBAN",
        "RFM TV",
        "MELODY",
        "MEZZO",
        "MEZZO LIVE",
        "ASTROCENTER TV",
        "XXL",
        "DORCEL TV",
        "DORCEL XXX",
        "VIXEN",
        "UNIONTV",
        "PINK X",
        "MAN-X",
        "CANAL+LIVE 1",
        "CANAL+LIVE 2",
        "CANAL+LIVE 3",
        "CANAL+LIVE 4",
        "CANAL+LIVE 5",
        "CANAL+LIVE 6",
        "CANAL+LIVE 7",
        "CANAL+LIVE 8",
        "CANAL+LIVE 9",
        "CANAL+LIVE 10",
        "CANAL+LIVE 11",
        "CANAL+LIVE 12",
        "CANAL+LIVE 13",
        "CANAL+LIVE 14",
        "CANAL+LIVE 15",
        "CANAL+LIVE 16",
        "CANAL+LIVE 17",
        "CANAL+LIVE 18",
        "CANAL+LIVE 19",
        "CANAL+ PREMIER LEAGUE",
        "BEIN SPORTS MAX 4",
        "BEIN SPORTS MAX 5",
        "BEIN SPORTS MAX 6",
        "BEIN SPORTS MAX 7",
        "BEIN SPORTS MAX 8",
        "BEIN SPORTS MAX 9",
        "BEIN SPORTS MAX 10",
        "EUROSPORT 360 1",
        "EUROSPORT 360 2",
        "EUROSPORT 360 3",
        "EUROSPORT 360 4",
        "EUROSPORT 360 5",
        "EUROSPORT 360 6",
        "EUROSPORT 360 7",
        "EUROSPORT 360 8",
        "EUROSPORT 360 9",
        "EUROSPORT 360 10",
        "EUROSPORT 360 11",
        "EUROSPORT 360 12",
        "EUROSPORT 360 13",
        "EUROSPORT 360 14",
        "EUROSPORT 360 15",
        "EUROSPORT 360 16",
        "EUROSPORT 360 17",
        "EUROSPORT 360 18",
        "EUROSPORT 360 19",
        "EUROSPORT 360 20",
        "EUROSPORT 360 21",
        "EUROSPORT 360 22",
        "EUROSPORT 360 23",
        "EUROSPORT 360 24",
        "EUROSPORT 360 25",
        "EUROSPORT 360 26",
        "EUROSPORT 360 27",
        "EUROSPORT 360 28",
        "EUROSPORT 360 29",
        "EUROSPORT 360 30",
        "EUROSPORT 360 31",
        "EUROSPORT 360 32",
        "DAZN 2",
        "DAZN 3",
        "DAZN 4",
        "DAZN 5",
        "F3 ALPES",
        "F3 ALSACE",
        "F3 AQUITAINE",
        "F3 AUVERGNE",
        "F3 BNORMANDIE",
        "F3 BOURGOGNE",
        "F3 BRETAGNE",
        "F3 CENTRE",
        "F3 CHAMP ARDENNE",
        "F3 CORSEVIASTELLA",
        "F3 COTE D'AZUR",
        "F3 FRANCHE COMTE",
        "F3 HNORMANDIE",
        "F3 LANGUEDOCROU",
        "F3 LIMOUSIN",
        "F3 LORRAINE",
        "F3 MIDI PYRENEES",
        "F3 NORD PDC",
        "F3 PARIS IDF",
        "F3 PAYS DE LA LOIRE",
        "F3 PICARDIE",
        "F3 POITOUCHAR",
        "F3 PROV ALPES",
        "F3 RHONE ALPES",
        "FRANCE3 NOUVELLE AQUITAINE",
        "AL JAZEERA ARABIC",
        "FRANCE 24 ENG",
        "ARTE ALLEMAND",
        "EURONEWS ALL",
        "ARIRANG TV",
        "NHK WORLD-JAPAN",
        "FRANCE TV SERIES",
        "FRANCE TV DOCS"
    ];

    const parentSelector = 'ul.LiveGridTemplate__grid___lw5Qm.liveGrid';
    const scrollPause = 1500; // ms to wait after each scroll
    const scrollRepeats = 3;  // number of times to scroll to last <li>

    // Scroll to the last <li> element currently loaded
    function scrollToLastLi(callback, count = 0) {
        const parent = document.querySelector(parentSelector);
        if (!parent) {
            alert('Channel list container not found!');
            return;
        }
        const items = parent.querySelectorAll('li');
        if (items.length === 0) {
            alert('No channel list items found!');
            return;
        }
        const lastLi = items[items.length - 1];
        // Scroll so last <li> is at bottom of viewport
        lastLi.scrollIntoView({behavior: 'smooth', block: 'end'});

        setTimeout(() => {
            if (count + 1 < scrollRepeats) {
                scrollToLastLi(callback, count + 1);
            } else {
                // After last scroll, scroll to top and callback
                window.scrollTo({top: 0, behavior: 'smooth'});
                setTimeout(callback, scrollPause);
            }
        }, scrollPause);
    }

    function rearrange() {
        const parent = document.querySelector(parentSelector);
        if (!parent) {
            alert('Parent UL not found!');
            return;
        }
        let items = Array.from(parent.querySelectorAll('li'));
        const multiLiveLi = items.shift(); // Exclude Multi-Live

        const altToLis = {};
        items.forEach(li => {
            const img = li.querySelector('.z-10 img[alt]');
            if (img && img.alt) {
                const key = img.alt.trim();
                if (!altToLis[key]) altToLis[key] = [];
                altToLis[key].push(li);
            }
        });

        desiredOrder.forEach(alt => {
            const lis = altToLis[alt.trim()];
            if (lis) {
                lis.forEach(li => parent.appendChild(li));
            }
        });

        if (multiLiveLi) parent.insertBefore(multiLiveLi, parent.firstChild);

        window.scrollTo({top: 0, behavior: 'smooth'});
        console.log('Rearrangement complete!');
    }

    function createMovableButton() {
        if (document.getElementById('rearrangeImgBtn')) return;
        const btn = document.createElement('div');
        btn.id = 'rearrangeImgBtn';
        btn.title = "Réarranger la liste TNT";
        Object.assign(btn.style, {
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            zIndex: 99999,
            background: 'white',
            border: '2px solid #007bff',
            borderRadius: '12px',
            padding: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            cursor: 'grab',
            width: '60px',
            height: 'auto',
            textAlign: 'center',
            userSelect: 'none'
        });
        const img = document.createElement('img');
        img.src = 'https://upload.wikimedia.org/wikipedia/fr/2/2a/Logo_TNT_HD.jpg';
        img.alt = 'TNT';
        img.style.width = '48px';
        img.style.height = 'auto';
        img.style.display = 'block';
        img.style.margin = '0 auto';
        btn.appendChild(img);
        document.body.appendChild(btn);

        let isDragging = false, offsetX = 0, offsetY = 0;
        btn.addEventListener('mousedown', function(e) {
            isDragging = true;
            offsetX = e.clientX - btn.getBoundingClientRect().left;
            offsetY = e.clientY - btn.getBoundingClientRect().top;
            btn.style.cursor = 'grabbing';
        });
        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                btn.style.left = (e.clientX - offsetX) + 'px';
                btn.style.top = (e.clientY - offsetY) + 'px';
                btn.style.right = 'auto';
                btn.style.bottom = 'auto';
                btn.style.position = 'fixed';
            }
        });
        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;
                btn.style.cursor = 'grab';
            }
        });

        btn.addEventListener('click', function(e) {
            if (isDragging) return;
            btn.style.opacity = '0.5';
            btn.style.pointerEvents = 'none';
            scrollToLastLi(() => {
                rearrange();
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'auto';
            });
        });
    }

    function waitForParentAndInjectButton() {
        const parent = document.querySelector(parentSelector);
        if (parent) {
            createMovableButton();
        } else {
            setTimeout(waitForParentAndInjectButton, 500);
        }
    }

    waitForParentAndInjectButton();

})();