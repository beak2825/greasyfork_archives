// ==UserScript==
// @name         Vartool Quickplay
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @author       UrsoTriangular
// @description  Adds Vartool mode to the quickplay list
// @match        https://bonk.io/gameframe-release.html
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455058/Vartool%20Quickplay.user.js
// @updateURL https://update.greasyfork.org/scripts/455058/Vartool%20Quickplay.meta.js
// ==/UserScript==

let newdiv = document.createElement("div");
newdiv.id="quickPlayWindow_vartolbutton";
newdiv.className="quickPlayWindowModeDiv";
newdiv.style.display='block'
newdiv.innerHTML=`
<span class="quickPlayWindowText1">VarTOL</span>
<span id="quickPlayWindow_SimplePlayerCount" class="quickPlayWindowText2">? players online</span>
<span class="quickPlayWindowText3">This gamemode is a mash-up of the once-existing jetpack mode VTOL and Arrows</span>`
document.getElementById("quickPlayWindowModeContainer").appendChild(newdiv);

let regex = [
    //if (quick == 'varquick') maps = bonkquick maps
    [/(getOrderedRandomMap\(\w{3},\w{3}\) \{var (\w{3})=\[arguments\];)/, `$1 if($2[0][1] == "varquick") $2[0][1] = "bonkquick";`],
    //join varquick
    [/(function \w{3}\(\)(.{10,100}?!VAR!\[\w{3}\[\d\]\[\d{1,4}\]\]=)\w{3}\.\w{3}\(\d{1,3}\)(;.*?\}[\w$]{3}\(\);\}))/, `$1function varQuick()$2"varquick"$3 document.getElementById('quickPlayWindow_vartolbutton').onclick = varQuick;`],
    //if (quick == "varquick") mo: 'var'
    [/(\w{3}.\w{3}\(\d+\);)((if\(!VAR!\[\w{3}\[\d+\]\[\d+\]\] == )\w{3}\.\w{3}\(\d+\)(\).{8}))/, `$1$3'varquick'$4'var';}else $2`],
    //gets the quickplay button
    //[/((\w{3})\[69\]=document\[\w{3}\[6\]\[445\]\]\(\w{3}\..{3}\(220\))/, `$2[1010] = document.getElementById('quickPlayWindow_vartolbutton');$2[1010].onclick = varQuick;$1`]
];

if (!window.bonkCodeInjectors) window.bonkCodeInjectors = [];
window.bonkCodeInjectors.push(code => {
    try {
        let v = code.match(/function \w{3}\(\).{10,100}?(\w{3}\[\d{1,3}\])\[\w{3}\[\d\]\[\d{1,4}\]\]=\w{3}\.\w{3}\(\d{1,3}\);.*?\}[\w$]{3}\(\);\}/)[1];
        v = v.replace(/([\[\]])/g, "\\$1");

        for (const r of regex) {
            r[0] = RegExp(r[0].source.replace(/!VAR!/g, v));
            console.log(r[0]);
            code = code.replace(r[0], r[1]);
        }
        return code;
    }
    catch (e) {
        console.log("VarTOL Quick was unable to load");
        console.error(e);
    }
});