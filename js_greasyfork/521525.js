// ==UserScript==
// @name         Hide Campaign
// @namespace    vinz3210.gg
// @version      2024-11-20
// @license      MIT 
// @description  remove Campaign
// @author       vinz3210
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/521525/Hide%20Campaign.user.js
// @updateURL https://update.greasyfork.org/scripts/521525/Hide%20Campaign.meta.js
// ==/UserScript==

GM_addStyle(`
  [class^="startpage_buttonWrapper_"]{
    display: none !important;
  }
`);
GM_addStyle(`
  [class^="menu-item_dropdown"] div[class^="menu-dropdown-item_dropdownItem__"]{
    display: none !important;
  }
`);


const svgData = `<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="24px" height="24px" viewBox="0 0 100.000000 100.000000"
 preserveAspectRatio="xMidYMid meet">

<g transform="translate(0.000000,100.000000) scale(0.100000,-0.100000)"
fill="#FFF" stroke="none">
<path d="M45 907 c-3 -6 -4 -167 -3 -357 l3 -345 117 -63 118 -64 112 60 112
60 119 -59 119 -60 56 32 c31 17 81 47 110 65 l52 34 0 349 c0 233 -4 352 -10
356 -6 4 -56 -20 -110 -52 l-99 -59 -121 59 -120 58 -110 -58 -110 -58 -109
58 c-60 31 -112 57 -115 57 -4 0 -9 -6 -11 -13z m728 -131 c17 9 56 32 85 50
29 19 55 34 57 34 3 0 5 -142 5 -314 l0 -315 -90 -54 -89 -53 -120 59 -120 59
-110 -59 -111 -58 -97 52 -98 52 -3 315 c-1 174 0 316 4 316 3 0 48 -23 100
-51 l94 -51 112 60 112 60 118 -59 118 -59 33 16z"/>
<path d="M244 686 c-72 -11 -104 -27 -104 -52 0 -8 9 -14 20 -14 13 0 22 -10
29 -35 5 -20 23 -52 40 -71 25 -27 29 -39 21 -53 -7 -14 -5 -23 10 -36 10 -9
22 -38 26 -62 6 -42 38 -92 51 -79 3 3 9 26 14 51 5 25 18 58 30 75 21 28 22
31 5 49 -9 10 -37 24 -62 30 -57 15 -58 41 -4 96 l40 39 -21 22 c-13 14 -17
24 -10 29 15 9 14 25 -1 24 -7 -1 -45 -7 -84 -13z"/>
<path d="M370 680 c-8 -14 -8 -26 0 -40 l11 -21 30 21 c39 29 39 60 -1 60 -19
0 -33 -7 -40 -20z"/>
<path d="M595 668 c-76 -12 -115 -39 -115 -79 l0 -30 30 21 c45 32 36 6 -11
-31 -22 -17 -45 -44 -50 -58 -9 -22 -6 -29 20 -51 19 -15 33 -38 37 -60 8 -39
21 -68 40 -88 11 -10 19 -2 44 47 39 77 38 101 -4 145 -27 29 -30 36 -15 36
10 0 25 -10 33 -21 l15 -21 30 21 c28 20 30 20 40 4 9 -17 11 -17 24 1 13 18
14 18 30 -4 l15 -22 12 24 c7 12 21 32 32 44 15 17 17 26 9 47 -9 23 -7 29 15
44 24 15 25 17 8 24 -36 13 -179 17 -239 7z"/>
<path d="M778 399 c-45 -23 -53 -59 -14 -59 14 0 31 -9 39 -21 15 -20 15 -20
26 14 8 24 9 42 2 61 -6 14 -12 26 -13 26 -2 -1 -20 -10 -40 -21z"/>
</g>
</svg>`

function addExplorerMode(){
    let a = document.querySelector('[href="/streaks"]')
    let b = a.cloneNode(true)
    b.querySelector("label").innerText = "Explorer"
    b.href = "/explorer"

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = svgData;
    b.querySelector("img").after(tempDiv)
    b.querySelector("img").remove()
    a.after(b)

}

const observer = new MutationObserver(() => {
    if (document.readyState === 'complete') {
        observer.disconnect();
        console.log('The page has fully loaded!');
        addExplorerMode()
    }
});

observer.observe(document.documentElement, { childList: true, subtree: true });
