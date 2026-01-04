// ==UserScript==
// @name        Thivs's Color Modifications
// @namespace    http://tampermonkey.net/
// @version      v1.00
// @description  Can be used with any variant of FlameScript currently.
// @author        Thivs
// @match        https://flowr.fun/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=flowr.fun
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501516/Thivs%27s%20Color%20Modifications.user.js
// @updateURL https://update.greasyfork.org/scripts/501516/Thivs%27s%20Color%20Modifications.meta.js
// ==/UserScript==

/**************/
/*  CONFIG   */
/*************/
window.ThivColors = {}
let validsettings = ["Thivcolors","ColorWheel","Default","Common","Shiny","Dark","DarkV2","Random","Reverse","Light","ColorWheelV2","Saturated","Shimmer","Unfunny","Unfunny2","Tweaked"]
// CREDITS:
// Thivcolors by Thivs
// ColorWheel by Thivs
// Default by flowr.fun (and florr for until super)
// Common by Common
// Shiny by ???
// Dark by Sunset
// DarkV2 based on Dark, editted by JD1
// Random by Thivs (its different each time still)
// Reverse by flowr.fun (and editted by Thivs)
// Light by ??? (I think Sunset)
// ColorWheelV2 by Thivs (ONLY LIKE HALF DONE)
// Saturated by Qonquer (ONLY LIKE HALF DONE)
// Shimmer by moomoo/2357
// Unfunny by The unfunny 3, remade by me.
// Unfunny2 by me.
// Tweaked by me, based off Default.
let fanciless = ["ColorWheel","Common"]
//window.ThivColors.Input = ""
console.log(window.ThivColors.Input)
window.ThivColors.Input = prompt("Input Color Setting, Valid: " + validsettings.toString(),"Default")
console.log(window.ThivColors.Input)
window.ThivColors.ColorSetting = "Default"
if (validsettings.find((element) => element == window.ThivColors.Input)) {
    window.ThivColors.ColorSetting = window.ThivColors.Input
}
window.ThivColors.rarities = []
for (let i = 0; i < Colors.rarities.length; i++) {
    window.ThivColors.rarities[i] = {}
}
function getrandom(min,max) {
    return (Math.random()*max)+min
}
function roll() {
    let rng = 1/Math.random()
    console.log(rng)
}
roll()

const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
function rgb2hsv (r, g, b) {
    let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
    rabs = r / 255;
    gabs = g / 255;
    babs = b / 255;
    v = Math.max(rabs, gabs, babs),
        diff = v - Math.min(rabs, gabs, babs);
    diffc = c => (v - c) / 6 / diff + 1 / 2;
    percentRoundFn = num => Math.round(num * 100) / 100;
    if (diff == 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(rabs);
        gg = diffc(gabs);
        bb = diffc(babs);

        if (rabs === v) {
            h = bb - gg;
        } else if (gabs === v) {
            h = (1 / 3) + rr - bb;
        } else if (babs === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        }else if (h > 1) {
            h -= 1;
        }
    }
    return {
        h: Math.round(h * 360),
        s: percentRoundFn(s * 250),
        v: percentRoundFn(v * 50)
    };
}
// Rarities

function loadcolors() {
    console.log('You are using the color setting ' + window.ThivColors.ColorSetting)
    if (window.ThivColors.ColorSetting == "Thivcolors") { // definitely could do this stuff more efficently, but it only runs once
        window.ThivColors.rarities[0].display = 'Basic'
        window.ThivColors.rarities[0].color = '#4f4c4c'
        window.ThivColors.rarities[0].border = '#403d3d'
        window.ThivColors.rarities[0].hitbox = '#4f4c4c'

        window.ThivColors.rarities[1].display = 'Common'
        window.ThivColors.rarities[1].color = '#918a8a'
        window.ThivColors.rarities[1].border = '#736d6d'
        window.ThivColors.rarities[1].hitbox = '#918a8a'

        window.ThivColors.rarities[2].display = 'Uncommon'
        window.ThivColors.rarities[2].color = '#285c2c'
        window.ThivColors.rarities[2].border = '#204f24'
        window.ThivColors.rarities[2].hitbox = '#285c2c'

        window.ThivColors.rarities[3].display = 'Rare'
        window.ThivColors.rarities[3].color = '#3f4791'
        window.ThivColors.rarities[3].border = '#323973'
        window.ThivColors.rarities[3].hitbox = '#3f4791'

        window.ThivColors.rarities[4].display = 'Epic'
        window.ThivColors.rarities[4].color = '#7a1ee3'
        window.ThivColors.rarities[4].border = '#5d1ba8'
        window.ThivColors.rarities[4].hitbox = '#7a1ee3'

        window.ThivColors.rarities[5].display = 'Legendary'
        window.ThivColors.rarities[5].color = '#ffd063'
        window.ThivColors.rarities[5].border = '#d9a95d'
        window.ThivColors.rarities[5].hitbox = '#ffd063'

        window.ThivColors.rarities[6].display = 'Mythical'
        window.ThivColors.rarities[6].color = '#5dc8e3'
        window.ThivColors.rarities[6].border = '#32abc9'
        window.ThivColors.rarities[6].hitbox = '#5dc8e3'

        //window.ThivColors.rarities[7].color = '#67549c'
        //window.ThivColors.rarities[7].border = '#453869'
        //window.ThivColors.rarities[7].hitbox = '#67549c'
        window.ThivColors.rarities[7].display = 'Divine'
        window.ThivColors.rarities[7].color = '#9258e8'
        window.ThivColors.rarities[7].border = '#714ca8'
        window.ThivColors.rarities[7].hitbox = '#9258e8'

        window.ThivColors.rarities[8].display = 'Super'
        window.ThivColors.rarities[8].color = '#73ff7a'
        window.ThivColors.rarities[8].border = '#47cc4f'
        window.ThivColors.rarities[8].hitbox = '#73ff7a'

        window.ThivColors.rarities[9].display = 'Mega'
        window.ThivColors.rarities[9].color = '#eb4034'
        window.ThivColors.rarities[9].border = '#de1f1f'
        window.ThivColors.rarities[9].hitbox = '#de1f1f'
        Colors.rarities[9].fancy = {
            "border": '#de1f1f',
            "hue": 4,
            "light": 56,
            "sat": 82,
            "spread": 15,
            "period": 3,
            "stars": 2,
        }

        window.ThivColors.rarities[10].display = 'Ultra'
        window.ThivColors.rarities[10].color = '#b647e6'
        window.ThivColors.rarities[10].border = '#9a36bf'
        window.ThivColors.rarities[10].hitbox = '#b647e6'
        Colors.rarities[10].fancy = {
            "border": '#9a36bf',
            "hue": 282,
            "light": 69,
            "sat": 90,
            "spread": 15,
            "period": 1,
            "stars": 3,
        }

        window.ThivColors.rarities[11].display = 'Extreme'
        window.ThivColors.rarities[11].color = '#25a144'
        window.ThivColors.rarities[11].border = '#14702b'
        window.ThivColors.rarities[11].hitbox = '#25a144'
        Colors.rarities[11].fancy = {
            "border": '#14702b',
            "hue": 135,
            "light": 39,
            "sat": 63,
            "spread": 22,
            "period": 0.85,
            "stars": 4,
        }

        window.ThivColors.rarities[12].display = 'Ultimate'
        window.ThivColors.rarities[12].color = '#c22595'
        window.ThivColors.rarities[12].border = '#8f106d'
        window.ThivColors.rarities[12].hitbox = '#c22595'
        Colors.rarities[12].fancy = {
            "border": '#8f106d',
            "hue": 317,
            "light": 62,
            "sat": 100,
            "spread": 35,
            "period": 0.6,
            "stars": 5,
        }

        window.ThivColors.rarities[13].display = 'Insane'
        window.ThivColors.rarities[13].color = '#102657'
        window.ThivColors.rarities[13].border = '#0f2045'
        window.ThivColors.rarities[13].hitbox = '#102657'
        Colors.rarities[13].fancy = {
            "border": '#000000',
            "hue": 221,
            "light": 20,
            "sat": 69,
            "spread": 35,
            "period": 0.6,
            "stars": 8,
        }

        window.ThivColors.rarities[14].display = 'Hyper'
        window.ThivColors.rarities[14].color = '#202124'
        window.ThivColors.rarities[14].border = '#16161a'
        window.ThivColors.rarities[14].hitbox = '#202124'
        Colors.rarities[14].fancy = {
            "border": '#000000',
            "hue": 221,
            "light": 15,
            "sat": 0,
            "spread": 0,
            "period": 0.6,
            "stars": 8,
        }

        window.ThivColors.rarities[15].display = 'Godly'
        window.ThivColors.rarities[15].color = '#ffff88'
        window.ThivColors.rarities[15].border = '#baba67'
        window.ThivColors.rarities[15].hitbox = '#ffff88'
        Colors.rarities[15].fancy = {
            "border": '#baba67',
            "hue": 60,
            "light": 77,
            "sat": 100,
            "spread": 25,
            "period": 0.4,
            "stars": 8,
        }

        window.ThivColors.rarities[16].display = 'Unique'
        window.ThivColors.rarities[16].color = '#2ff74a'
        window.ThivColors.rarities[16].border = '#21bf36'
        window.ThivColors.rarities[16].hitbox = '#2ff74a'
        Colors.rarities[16].fancy = {
            "border": '#21bf36',
            "hue": 128,
            "light": 58,
            "sat": 93,
            "spread": 25,
            "period": 0.4,
            "stars": 8,
        }

        window.ThivColors.rarities[17].display = 'Exotic'
        window.ThivColors.rarities[17].color = '#bf2136'
        window.ThivColors.rarities[17].border = '#8c1626'
        window.ThivColors.rarities[17].hitbox = '#bf2136'
        Colors.rarities[17].fancy = {
            "border": '#8c1626',
            "hue": 352,
            "light": 44,
            "sat": 71,
            "spread": 15,
            "period": 0.4,
            "stars": 8,
        }

        window.ThivColors.rarities[18].display = 'Supreme'
        window.ThivColors.rarities[18].color = '#962ea6'
        window.ThivColors.rarities[18].border = '#692287'
        window.ThivColors.rarities[18].hitbox = '#962ea6'
        Colors.rarities[18].fancy = {
            "border": '#692287',
            "hue": 292,
            "light": 42,
            "sat": 57,
            "spread": 15,
            "period": 0.4,
            "stars": 13,
        }

        window.ThivColors.rarityNames = ['Basic', 'Common', 'Uncommon,"Rare', 'Epic', 'Legendary', 'Mythical', 'Divine', 'Super', 'Mega', 'Ultra', 'Extreme', 'Ultimate', 'Insane', 'Hyper', 'Godly', 'Unique', 'Exotic', 'Supreme']
    }
    if (window.ThivColors.ColorSetting == "ColorWheel") {
        window.ThivColors.rarities[0].display = 'Red'
        window.ThivColors.rarities[0].color = '#ff0000'
        window.ThivColors.rarities[0].border = '#aa0000'
        window.ThivColors.rarities[0].hitbox = '#ff0000'

        window.ThivColors.rarities[1].display = 'Cinder'
        window.ThivColors.rarities[1].color = '#ff5500'
        window.ThivColors.rarities[1].border = '#aa3800'
        window.ThivColors.rarities[1].hitbox = '#ff5500'

        window.ThivColors.rarities[2].display = 'Orange'
        window.ThivColors.rarities[2].color = '#ff8800'
        window.ThivColors.rarities[2].border = '#aa5500'
        window.ThivColors.rarities[2].hitbox = '#ff8800'

        window.ThivColors.rarities[3].display = 'Amber'
        window.ThivColors.rarities[3].color = '#ffaa00'
        window.ThivColors.rarities[3].border = '#aa7700'
        window.ThivColors.rarities[3].hitbox = '#ffaa00'

        window.ThivColors.rarities[4].display = 'Yellow'
        window.ThivColors.rarities[4].color = '#ffcc22'
        window.ThivColors.rarities[4].border = '#aa9907'
        window.ThivColors.rarities[4].hitbox = '#ffcc22'

        window.ThivColors.rarities[5].display = 'Lime'
        window.ThivColors.rarities[5].color = '#aaff33'
        window.ThivColors.rarities[5].border = '#88aa11'
        window.ThivColors.rarities[5].hitbox = '#aaff33'

        window.ThivColors.rarities[6].display = 'Green'
        window.ThivColors.rarities[6].color = '#77cc44'
        window.ThivColors.rarities[6].border = '#479916'
        window.ThivColors.rarities[6].hitbox = '#77cc44'

        window.ThivColors.rarities[7].display = 'Teal'
        window.ThivColors.rarities[7].color = '#46ff88'
        window.ThivColors.rarities[7].border = '#27aa61'
        window.ThivColors.rarities[7].hitbox = '#46ff88'

        window.ThivColors.rarities[8].display = 'Cyan'
        window.ThivColors.rarities[8].color = '#33cccc'
        window.ThivColors.rarities[8].border = '#199999'
        window.ThivColors.rarities[8].hitbox = '#33cccc'

        window.ThivColors.rarities[9].display = 'Blue'
        window.ThivColors.rarities[9].color = '#1199cc'
        window.ThivColors.rarities[9].border = '#036799'
        window.ThivColors.rarities[9].hitbox = '#1199cc'

        window.ThivColors.rarities[10].display = 'Indigo'
        window.ThivColors.rarities[10].color = '#6644bb'
        window.ThivColors.rarities[10].border = '#32168c'
        window.ThivColors.rarities[10].hitbox = '#6644bb'

        window.ThivColors.rarities[11].display = 'Purple'
        window.ThivColors.rarities[11].color = '#9911aa'
        window.ThivColors.rarities[11].border = '#670383'
        window.ThivColors.rarities[11].hitbox = '#9911aa'

        window.ThivColors.rarities[12].display = 'Magenta'
        window.ThivColors.rarities[12].color = '#c22595'
        window.ThivColors.rarities[12].border = '#8f106d'
        window.ThivColors.rarities[12].hitbox = '#c22595'

        window.ThivColors.rarities[13].display = 'Pink'
        window.ThivColors.rarities[13].color = '#ff77aa'
        window.ThivColors.rarities[13].border = '#aa4783'
        window.ThivColors.rarities[13].hitbox = '#ff77aa'

        window.ThivColors.rarities[14].display = 'Orchid'
        window.ThivColors.rarities[14].color = '#ff99dd'
        window.ThivColors.rarities[14].border = '#aa779c'
        window.ThivColors.rarities[14].hitbox = '#ff77dd'

        window.ThivColors.rarities[15].display = 'Lavender'
        window.ThivColors.rarities[15].color = '#ccaaff'
        window.ThivColors.rarities[15].border = '#9988aa'
        window.ThivColors.rarities[15].hitbox = '#ccaaff'

        window.ThivColors.rarities[16].display = 'White'
        window.ThivColors.rarities[16].color = '#ffffff'
        window.ThivColors.rarities[16].border = '#bbbbbb'
        window.ThivColors.rarities[16].hitbox = '#ffffff'

        window.ThivColors.rarities[17].display = 'Gray'
        window.ThivColors.rarities[17].color = '#888a8c'
        window.ThivColors.rarities[17].border = '#666869'
        window.ThivColors.rarities[17].hitbox = '#888a8c'

        window.ThivColors.rarities[18].display = 'Black'
        window.ThivColors.rarities[18].color = '#161924'
        window.ThivColors.rarities[18].border = '#000000'
        window.ThivColors.rarities[18].hitbox = '#111622'

        window.ThivColors.rarityNames = ['Red', 'Cinder', 'Orange,"Amber', 'Yellow', 'Lime', 'Green', 'Cyan', 'Teal', 'Blue', 'Indigo', 'Purple', 'Magenta', 'Pink', 'Orchid', 'Lavendar', 'White', 'Gray', 'Black']
    }
    if (window.ThivColors.ColorSetting == "Default") {
        window.ThivColors.rarities[0].display = 'Common'
        window.ThivColors.rarities[0].color = '#7eef6d'
        window.ThivColors.rarities[0].border = '#66c258'
        window.ThivColors.rarities[0].hitbox = '#7eef6d'

        window.ThivColors.rarities[1].display = 'Unusual'
        window.ThivColors.rarities[1].color = '#ffe65d'
        window.ThivColors.rarities[1].border = '#cfba4b'
        window.ThivColors.rarities[1].hitbox = '#ffe65d'

        window.ThivColors.rarities[2].display = 'Rare'
        window.ThivColors.rarities[2].color = '#4d52e3'
        window.ThivColors.rarities[2].border = '#3e42b8'
        window.ThivColors.rarities[2].hitbox = '#4d52e3'

        window.ThivColors.rarities[3].display = 'Epic'
        window.ThivColors.rarities[3].color = '#861fde'
        window.ThivColors.rarities[3].border = '#6d19b4'
        window.ThivColors.rarities[3].hitbox = '#861fde'

        window.ThivColors.rarities[4].display = 'Legendary'
        window.ThivColors.rarities[4].color = '#de1f1f'
        window.ThivColors.rarities[4].border = '#b41919'
        window.ThivColors.rarities[4].hitbox = '#de1f1f'

        window.ThivColors.rarities[5].display = 'Mythic'
        window.ThivColors.rarities[5].color = '#1fdbde'
        window.ThivColors.rarities[5].border = '#19b1b4'
        window.ThivColors.rarities[5].hitbox = '#1fdbde'

        window.ThivColors.rarities[6].display = 'Ultra'
        window.ThivColors.rarities[6].color = '#ff2b75'
        window.ThivColors.rarities[6].border = '#cf235f'
        window.ThivColors.rarities[6].hitbox = '#ff2b75'

        window.ThivColors.rarities[7].display = 'Super'
        window.ThivColors.rarities[7].color = '#2bffa3'
        window.ThivColors.rarities[7].border = '#23cf84'
        window.ThivColors.rarities[7].hitbox = '#2bffa3'

        window.ThivColors.rarities[8].display = 'Omega'
        window.ThivColors.rarities[8].color = '#494849'
        window.ThivColors.rarities[8].border = '#3c3b40'
        window.ThivColors.rarities[8].hitbox = '#494849'

        window.ThivColors.rarities[9].display = 'Fabled'
        window.ThivColors.rarities[9].color = '#ff5500'
        window.ThivColors.rarities[9].border = '#cf4500'
        window.ThivColors.rarities[9].hitbox = '#ff5500'

        window.ThivColors.rarities[10].display = 'Divine'
        window.ThivColors.rarities[10].color = '#67549c'
        window.ThivColors.rarities[10].border = '#453869'
        window.ThivColors.rarities[10].hitbox = '#67549c'

        window.ThivColors.rarities[11].display = 'Supreme'
        window.ThivColors.rarities[11].color = '#b25dd9'
        window.ThivColors.rarities[11].border = '#9043b3'
        window.ThivColors.rarities[11].hitbox = '#b25dd9'

        window.ThivColors.rarities[12].display = 'Omnipotent'
        window.ThivColors.rarities[12].color = '#888888'
        window.ThivColors.rarities[12].border = '#6e6e6e'
        window.ThivColors.rarities[12].hitbox = '#888888'

        window.ThivColors.rarities[13].display = 'Astral'
        window.ThivColors.rarities[13].color = '#046307'
        window.ThivColors.rarities[13].border = '#035005'
        window.ThivColors.rarities[13].hitbox = '#046307'

        window.ThivColors.rarities[14].display = 'Celestial'
        window.ThivColors.rarities[14].color = '#00bfff'
        window.ThivColors.rarities[14].border = '#009bcf'
        window.ThivColors.rarities[14].hitbox = '#00bfff'

        window.ThivColors.rarities[15].display = 'Seraphic'
        window.ThivColors.rarities[15].color = '#c77e5b'
        window.ThivColors.rarities[15].border = '#a16649'
        window.ThivColors.rarities[15].hitbox = '#c77e5b'

        window.ThivColors.rarities[16].display = 'Transcendent'
        window.ThivColors.rarities[16].color = '#ffffff'
        window.ThivColors.rarities[16].border = '#cfcfcf'
        window.ThivColors.rarities[16].hitbox = '#ffffff'

        window.ThivColors.rarities[17].display = 'Quantum'
        window.ThivColors.rarities[17].color = '#61ffdd'
        window.ThivColors.rarities[17].border = '#4ecfb3'
        window.ThivColors.rarities[17].hitbox = '#61ffdd'

        window.ThivColors.rarities[18].display = 'Galactic'
        window.ThivColors.rarities[18].color = '#ba5f7a'
        window.ThivColors.rarities[18].border = '#974d63'
        window.ThivColors.rarities[18].hitbox = '#ba5f7a'
    }
    if (window.ThivColors.ColorSetting == "Common") {
        window.ThivColors.rarities[0].display = 'Common'
        window.ThivColors.rarities[0].color = '#7eef6d'
        window.ThivColors.rarities[0].border = '#66c258'
        window.ThivColors.rarities[0].hitbox = '#7eef6d'

        window.ThivColors.rarities[1].display = 'Common'
        window.ThivColors.rarities[1].color = '#7eef6d'
        window.ThivColors.rarities[1].border = '#66c258'
        window.ThivColors.rarities[1].hitbox = '#7eef6d'

        window.ThivColors.rarities[2].display = 'Common'
        window.ThivColors.rarities[2].color = '#7eef6d'
        window.ThivColors.rarities[2].border = '#66c258'
        window.ThivColors.rarities[2].hitbox = '#7eef6d'

        window.ThivColors.rarities[3].display = 'Common'
        window.ThivColors.rarities[3].color = '#7eef6d'
        window.ThivColors.rarities[3].border = '#66c258'
        window.ThivColors.rarities[3].hitbox = '#7eef6d'

        window.ThivColors.rarities[4].display = 'Common'
        window.ThivColors.rarities[4].color = '#7eef6d'
        window.ThivColors.rarities[4].border = '#66c258'
        window.ThivColors.rarities[4].hitbox = '#7eef6d'

        window.ThivColors.rarities[5].display = 'Common'
        window.ThivColors.rarities[5].color = '#7eef6d'
        window.ThivColors.rarities[5].border = '#66c258'
        window.ThivColors.rarities[5].hitbox = '#7eef6d'

        window.ThivColors.rarities[6].display = 'Common'
        window.ThivColors.rarities[6].color = '#7eef6d'
        window.ThivColors.rarities[6].border = '#66c258'
        window.ThivColors.rarities[6].hitbox = '#7eef6d'

        window.ThivColors.rarities[7].display = 'Common'
        window.ThivColors.rarities[7].color = '#7eef6d'
        window.ThivColors.rarities[7].border = '#66c258'
        window.ThivColors.rarities[7].hitbox = '#7eef6d'

        window.ThivColors.rarities[8].display = 'Common'
        window.ThivColors.rarities[8].color = '#7eef6d'
        window.ThivColors.rarities[8].border = '#66c258'
        window.ThivColors.rarities[8].hitbox = '#7eef6d'

        window.ThivColors.rarities[9].display = 'Common'
        window.ThivColors.rarities[9].color = '#7eef6d'
        window.ThivColors.rarities[9].border = '#66c258'
        window.ThivColors.rarities[9].hitbox = '#7eef6d'

        window.ThivColors.rarities[10].display = 'Common'
        window.ThivColors.rarities[10].color = '#7eef6d'
        window.ThivColors.rarities[10].border = '#66c258'
        window.ThivColors.rarities[10].hitbox = '#7eef6d'

        window.ThivColors.rarities[11].display = 'Common'
        window.ThivColors.rarities[11].color = '#7eef6d'
        window.ThivColors.rarities[11].border = '#66c258'
        window.ThivColors.rarities[11].hitbox = '#7eef6d'

        window.ThivColors.rarities[12].display = 'Common'
        window.ThivColors.rarities[12].color = '#7eef6d'
        window.ThivColors.rarities[12].border = '#66c258'
        window.ThivColors.rarities[12].hitbox = '#7eef6d'

        window.ThivColors.rarities[13].display = 'Common'
        window.ThivColors.rarities[13].color = '#7eef6d'
        window.ThivColors.rarities[13].border = '#66c258'
        window.ThivColors.rarities[13].hitbox = '#7eef6d'

        window.ThivColors.rarities[14].display = 'Common'
        window.ThivColors.rarities[14].color = '#7eef6d'
        window.ThivColors.rarities[14].border = '#66c258'
        window.ThivColors.rarities[14].hitbox = '#7eef6d'

        window.ThivColors.rarities[15].display = 'Common'
        window.ThivColors.rarities[15].color = '#7eef6d'
        window.ThivColors.rarities[15].border = '#66c258'
        window.ThivColors.rarities[15].hitbox = '#7eef6d'

        window.ThivColors.rarities[16].display = 'Common'
        window.ThivColors.rarities[16].color = '#7eef6d'
        window.ThivColors.rarities[16].border = '#66c258'
        window.ThivColors.rarities[16].hitbox = '#7eef6d'

        window.ThivColors.rarities[17].display = 'Common'
        window.ThivColors.rarities[17].color = '#7eef6d'
        window.ThivColors.rarities[17].border = '#66c258'
        window.ThivColors.rarities[17].hitbox = '#7eef6d'

        window.ThivColors.rarities[18].display = 'Common'
        window.ThivColors.rarities[18].color = '#7eef6d'
        window.ThivColors.rarities[18].border = '#66c258'
        window.ThivColors.rarities[18].hitbox = '#7eef6d'
    }
    if (window.ThivColors.ColorSetting == "Shiny") {
        window.ThivColors.rarities[0].display = '𝖢𝗈𝗆𝗆𝗈𝗇'
        window.ThivColors.rarities[0].color = '#7eef6d'
        window.ThivColors.rarities[0].border = '#66c258'
        window.ThivColors.rarities[0].hitbox = '#7eef6d'
        Colors.rarities[0].fancy = {
            "border": '#55ba45',
            "hue": 110,
            "light": 65,
            "sat": 70,
            "spread": 50,
            "period": 1,
        }

        window.ThivColors.rarities[1].display = '𝖴𝗇𝗎𝗌𝗎𝖺𝗅'
        window.ThivColors.rarities[1].color = '#ffe65d'
        window.ThivColors.rarities[1].border = '#cfba4b'
        window.ThivColors.rarities[1].hitbox = '#ffe65d'
        Colors.rarities[1].fancy = {
            "border": '#c9b136',
            "hue": 50,
            "light": 65,
            "sat": 90,
            "spread": 30,
            "period": 1,
        }

        window.ThivColors.rarities[2].display = '𝖱𝖺𝗋𝖾'
        window.ThivColors.rarities[2].color = '#4d52e3'
        window.ThivColors.rarities[2].border = '#3e42b8'
        window.ThivColors.rarities[2].hitbox = '#4d52e3'
        Colors.rarities[2].fancy = {
            "border": '#373ba4',
            "hue": 240,
            "light": 55,
            "sat": 80,
            "spread": 30,
            "period": 1,
        }

        window.ThivColors.rarities[3].display = '𝖤𝗉𝗂𝖼';
        window.ThivColors.rarities[3].color = '#8d1fbe';
        window.ThivColors.rarities[3].border = '#730fb4';
        window.ThivColors.rarities[3].hitbox = '#8d1fbe';
        Colors.rarities[3].fancy = {
            "border": '#60159d',
            "hue": 270,
            "light": 55,
            "sat": 125,
            "spread": 20,
            "period": 1
        };



        window.ThivColors.rarities[4].display = '𝖫𝖾𝗀𝖾𝗇𝖽𝖺𝗋𝗒'
        window.ThivColors.rarities[4].color = '#de1f1f'
        window.ThivColors.rarities[4].border = '#b41919'
        window.ThivColors.rarities[4].hitbox = '#de1f1f'
        Colors.rarities[4].fancy = {
            "border": '#9d1515',
            "hue": 10,
            "light": 45,
            "sat": 125,
            "spread": 40,
            "period": 1,
        }

        window.ThivColors.rarities[5].display = '𝖬𝗒𝗍𝗁𝗂𝖼'
        window.ThivColors.rarities[5].color = '#1fdbde'
        window.ThivColors.rarities[5].border = '#19b1b4'
        window.ThivColors.rarities[5].hitbox = '#1fdbde'
        Colors.rarities[5].fancy = {
            "border": '#159b9d',
            "hue": 180,
            "light": 45,
            "sat": 100,
            "spread": 10,
            "period": 1,
        }

        window.ThivColors.rarities[6].display = '𝖴𝗅𝗍𝗋𝖺'
        window.ThivColors.rarities[6].color = '#ff2b75'
        window.ThivColors.rarities[6].border = '#cf235f'
        window.ThivColors.rarities[6].hitbox = '#ff2b75'
        Colors.rarities[6].fancy = {
            "border": '#b71f54',
            "hue": 325,
            "light": 55,
            "sat": 200,
            "spread": 40,
            "period": 1,
        }

        window.ThivColors.rarities[7].display = '𝖲𝗎𝗉𝖾𝗋'
        window.ThivColors.rarities[7].color = '#2bffa3'
        window.ThivColors.rarities[7].border = '#23cf84'
        window.ThivColors.rarities[7].hitbox = '#2bffa3'
        Colors.rarities[7].fancy = {
            "border": '#1fb775',
            "hue": 160,
            "light": 60,
            "sat": 100,
            "spread": 40,
            "period": 1.5,
            "stars": 3,
        }

        window.ThivColors.rarities[8].display = '𝖮𝗆𝖾𝗀𝖺'
        window.ThivColors.rarities[8].color = '#56849F'
        window.ThivColors.rarities[8].border = ''
        window.ThivColors.rarities[8].hitbox = '#494849'
        Colors.rarities[8].fancy = {
            "border": '#56849F',
            "hue": 240,
            "light": 70,
            "sat": 50,
            "spread": 20,
            "period": 1,
            "stars": 5,
        }

        window.ThivColors.rarities[9].display = '𝖥𝖺𝖻𝗅𝖾𝖽'
        window.ThivColors.rarities[9].color = '#ff5500'
        window.ThivColors.rarities[9].border = '#cf4500'
        window.ThivColors.rarities[9].hitbox = '#ff5500'
        Colors.rarities[9].fancy = {
            "border": Colors.rarities[9].border,
            "hue": 25,
            "light": 45,
            "sat": 100,
            "spread": 40,
            "period": 1,
            "stars": 10,
        }

        window.ThivColors.rarities[10].display = '𝖣𝗂𝗏𝗂𝗇𝖾'
        window.ThivColors.rarities[10].color = '#67549c'
        window.ThivColors.rarities[10].border = '#453869'
        window.ThivColors.rarities[10].hitbox = '#67549c'
        Colors.rarities[10].fancy = {
            "border": "#53447e",
            "hue": 256,
            "light": 47,
            "sat": 30,
            "spread": 3000,
            "period": 1
        }

        window.ThivColors.rarities[11].display = '𝖲𝗎𝗉𝗋𝖾𝗆𝖾'
        window.ThivColors.rarities[11].color = '#b25dd9'
        window.ThivColors.rarities[11].border = '#9043b3'
        window.ThivColors.rarities[11].hitbox = '#b25dd9'
        Colors.rarities[11].fancy = {
            "border": "#904bb0",
            "hue": 281,
            "light": 61,
            "sat": 62,
            "spread": 12,
            "period": 2,
            "stars": 1
        }

        window.ThivColors.rarities[12].display = '𝖮𝗆𝗇𝗂𝗉𝗈𝗍𝖾𝗇𝗍'
        window.ThivColors.rarities[12].color = '#888888'
        window.ThivColors.rarities[12].border = '#6e6e6e'
        window.ThivColors.rarities[12].hitbox = '#888888'
        Colors.rarities[12].fancy = {
            "border": "#000000",
            "hue": 285,
            "light": 20,
            "sat": 100,
            "spread": 35,
            "period": 1.5,
            "stars": 2
        }

        window.ThivColors.rarities[13].display = '𝖠𝗌𝗍𝗋𝖺𝗅'
        window.ThivColors.rarities[13].color = '#046307'
        window.ThivColors.rarities[13].border = '#035005'
        window.ThivColors.rarities[13].hitbox = '#046307'
        Colors.rarities[13].fancy = {
            "border": "#035005",
            "hue": 122,
            "light": 25,
            "sat": 100,
            "spread": 60,
            "period": 1.5,
            "stars": 2
        }

        window.ThivColors.rarities[14].display = '𝖢𝖾𝗅𝖾𝗌𝗍𝗂𝖺𝗅'
        window.ThivColors.rarities[14].color = '#00bfff'
        window.ThivColors.rarities[14].border = '#009bcf'
        window.ThivColors.rarities[14].hitbox = '#00bfff'
        Colors.rarities[14].fancy = {
            "border": "#007baf",
            "hue": 195,
            "light": 50,
            "sat": 100,
            "spread": 10,
            "period": 1.5,
            "stars": 2
        }

        window.ThivColors.rarities[15].display = '𝖲𝖾𝗋𝖺𝗉𝗁𝗂𝖼'
        window.ThivColors.rarities[15].color = '#c77e5b'
        window.ThivColors.rarities[15].border = '#a16649'
        window.ThivColors.rarities[15].hitbox = '#c77e5b'
        Colors.rarities[15].fancy = {
            "border": "#a16649",
            "hue": 19,
            "light": 57,
            "sat": 49,
            "spread": 15,
            "period": 1.5,
            "stars": 2
        }

        window.ThivColors.rarities[16].display = '𝖳𝗋𝖺𝗇𝗌𝖼𝖾𝗇𝖽𝖾𝗇𝗍'
        window.ThivColors.rarities[16].color = '#ffffff'
        window.ThivColors.rarities[16].border = '#cfcfcf'
        window.ThivColors.rarities[16].hitbox = '#ffffff'
        Colors.rarities[16].fancy = {
            "border": "#cfcfcf",
            "hue": 180,
            "light": 93,
            "sat": 100,
            "spread": 80,
            "period": 1.5,
            "stars": 2
        }

        window.ThivColors.rarities[17].display = '𝖰𝗎𝖺𝗇𝗍𝗎𝗆'
        window.ThivColors.rarities[17].color = '#61ffdd'
        window.ThivColors.rarities[17].border = '#4ecfb3'
        window.ThivColors.rarities[17].hitbox = '#61ffdd'
        Colors.rarities[17].fancy = {
            "border": "#4ecfb3",
            "hue": 167,
            "light": 69,
            "sat": 100,
            "spread": 20,
            "period": 1.5,
            "stars": 2
        }

        window.ThivColors.rarities[18].display = '𝖦𝖺𝗅𝖺𝖼𝗍𝗂𝖼'
        window.ThivColors.rarities[18].color = '#ba5f7a'
        window.ThivColors.rarities[18].border = '#974d63'
        window.ThivColors.rarities[18].hitbox = '#ba5f7a'
        Colors.rarities[18].fancy = {
            "border": "#570d23",
            "hue": 342,
            "light": 25,
            "sat": 100,
            "spread": 80,
            "period": 1,
            "stars": 3
        }
    }
    if (window.ThivColors.ColorSetting == "Dark") {
        window.ThivColors.rarities[0].display = 'Common'
        window.ThivColors.rarities[0].color = '#7eef6d'
        window.ThivColors.rarities[0].border = '#66c258'
        window.ThivColors.rarities[0].hitbox = '#7eef6d'
        Colors.rarities[0].fancy = {
            "border": '#55ba45',
            "hue": 110,
            "light": 23,
            "sat": 70,
            "spread": 20,
            "period": 1,
        }

        window.ThivColors.rarities[1].display = 'Unusual'
        window.ThivColors.rarities[1].color = '#ffe65d'
        window.ThivColors.rarities[1].border = '#cfba4b'
        window.ThivColors.rarities[1].hitbox = '#ffe65d'
        Colors.rarities[1].fancy = {
            "border": '#c9b136',
            "hue": 50,
            "light": 23,
            "sat": 90,
            "spread": 15,
            "period": 1,
        }

        window.ThivColors.rarities[2].display = 'Rare'
        window.ThivColors.rarities[2].color = '#4d52e3'
        window.ThivColors.rarities[2].border = '#3e42b8'
        window.ThivColors.rarities[2].hitbox = '#4d52e3'
        Colors.rarities[2].fancy = {
            "border": '#373ba4',
            "hue": 240,
            "light": 23,
            "sat": 80,
            "spread": 10,
            "period": 1,
        }

        window.ThivColors.rarities[3].display = 'Epic'
        window.ThivColors.rarities[3].color = '#861fde'
        window.ThivColors.rarities[3].border = '#6d19b4'
        window.ThivColors.rarities[3].hitbox = '#861fde'
        Colors.rarities[3].fancy = {
            "border": '#60159d',
            "hue": 270,
            "light": 23,
            "sat": 125,
            "spread": 10,
            "period": 1,
        }

        window.ThivColors.rarities[4].display = 'Legendary'
        window.ThivColors.rarities[4].color = '#de1f1f'
        window.ThivColors.rarities[4].border = '#b41919'
        window.ThivColors.rarities[4].hitbox = '#de1f1f'
        Colors.rarities[4].fancy = {
            "border": '#9d1515',
            "hue": 10,
            "light": 23,
            "sat": 125,
            "spread": 15,
            "period": 1,
        }

        window.ThivColors.rarities[5].display = 'Mythic'
        window.ThivColors.rarities[5].color = '#1fdbde'
        window.ThivColors.rarities[5].border = '#19b1b4'
        window.ThivColors.rarities[5].hitbox = '#1fdbde'
        Colors.rarities[5].fancy = {
            "border": '#159b9d',
            "hue": 180,
            "light": 23,
            "sat": 100,
            "spread": 10,
            "period": 1,
        }

        window.ThivColors.rarities[6].display = 'Ultra'
        window.ThivColors.rarities[6].color = '#E0115F'
        window.ThivColors.rarities[6].border = '#cf235f'
        window.ThivColors.rarities[6].hitbox = '#ff2b75'
        Colors.rarities[6].fancy = {
            "border": '#b71f54',
            "hue": 325,
            "light": 23,
            "sat": 100,
            "spread": 15,
            "period": 1,
        }
        window.ThivColors.rarities[7].display = 'Super'
        window.ThivColors.rarities[7].color = '#2bffa3'
        window.ThivColors.rarities[7].border = '#23cf84'
        window.ThivColors.rarities[7].hitbox = '#2bffa3'
        Colors.rarities[7].fancy = {
            "border": '#1fb775',
            "hue": 160,
            "light": 23,
            "sat": 100,
            "spread": 20,
            "period": 1,
            "stars": 2,
        }
        window.ThivColors.rarities[8].display = 'Omega'
        window.ThivColors.rarities[8].color = '#494849'
        window.ThivColors.rarities[8].border = '#3c3b40'
        window.ThivColors.rarities[8].hitbox = '#1f0104'
        Colors.rarities[8].fancy = {
            "border": '#2c0202',
            "hue": 354,
            "light": 6,
            "sat": 94,
            "spread": 25,
            "period": 1.5,
            "stars": 1,
        }
        window.ThivColors.rarities[9].display = 'Fabled'
        window.ThivColors.rarities[9].color = '#ff5500'
        window.ThivColors.rarities[9].border = '#cf4500'
        window.ThivColors.rarities[9].hitbox = '#ff5500'
        Colors.rarities[9].fancy = {
            "border": Colors.rarities[9].border,
            "hue": 25,
            "light": 23,
            "sat": 100,
            "spread": 15,
            "period": 1,
            "stars": 2,
        }

        window.ThivColors.rarities[10].display = 'Divine'
        window.ThivColors.rarities[10].color = '#9136f6'
        window.ThivColors.rarities[10].border = '#453869'
        window.ThivColors.rarities[10].hitbox = '#67549c'
        Colors.rarities[10].fancy = {
            "border": "#53447e",
            "hue": 256,
            "light": 23,
            "sat": 30,
            "spread": 20,
            "period": 1.5,
            "stars": 3,
        }

        window.ThivColors.rarities[11].display = 'Supreme'
        window.ThivColors.rarities[11].color = '#b25dd9'
        window.ThivColors.rarities[11].border = '#9043b3'
        window.ThivColors.rarities[11].hitbox = '#b25dd9'
        Colors.rarities[11].fancy = {
            "border": "#904bb0",
            "hue": 281,
            "light": 23,
            "sat": 62,
            "spread": 12,
            "period": 2,
            "stars": 1
        }

        window.ThivColors.rarities[12].display = 'Omnipotent'
        window.ThivColors.rarities[12].color = '#888888'
        window.ThivColors.rarities[12].border = '#6e6e6e'
        window.ThivColors.rarities[12].hitbox = '#888888'
        Colors.rarities[12].fancy = {
            "border": "#000000",
            "hue": 285,
            "light": 10,
            "sat": 100,
            "spread": 35,
            "period": 1.5,
            "stars": 2
        }

        window.ThivColors.rarities[13].display = 'Astral'
        window.ThivColors.rarities[13].color = '#046307'
        window.ThivColors.rarities[13].border = '#035005'
        window.ThivColors.rarities[13].hitbox = '#046307'
        Colors.rarities[13].fancy = {
            "border": "#035005",
            "hue": 122,
            "light": 10,
            "sat": 100,
            "spread": 60,
            "period": 1.5,
            "stars": 2
        }

        window.ThivColors.rarities[14].display = 'Celestial'
        window.ThivColors.rarities[14].color = '#00bfff'
        window.ThivColors.rarities[14].border = '#009bcf'
        window.ThivColors.rarities[14].hitbox = '#00bfff'
        Colors.rarities[14].fancy = {
            "border": "#007baf",
            "hue": 195,
            "light": 23,
            "sat": 100,
            "spread": 10,
            "period": 1.5,
            "stars": 2
        }

        window.ThivColors.rarities[15].display = 'Seraphic'
        window.ThivColors.rarities[15].color = '#c77e5b'
        window.ThivColors.rarities[15].border = '#a16649'
        window.ThivColors.rarities[15].hitbox = '#c77e5b'
        Colors.rarities[15].fancy = {
            "border": "#a16649",
            "hue": 19,
            "light": 23,
            "sat": 49,
            "spread": 15,
            "period": 1.5,
            "stars": 2
        }

        window.ThivColors.rarities[16].display = 'Transcendent'
        window.ThivColors.rarities[16].color = '#ffffff'
        window.ThivColors.rarities[16].border = '#cfcfcf'
        window.ThivColors.rarities[16].hitbox = '#ffffff'
        Colors.rarities[16].fancy = {
            "border": "#cfcfcf",
            "hue": 180,
            "light": 23,
            "sat": 100,
            "spread": 80,
            "period": 1.5,
            "stars": 2
        }

        window.ThivColors.rarities[17].display = 'Quantum'
        window.ThivColors.rarities[17].color = '#61ffdd'
        window.ThivColors.rarities[17].border = '#4ecfb3'
        window.ThivColors.rarities[17].hitbox = '#61ffdd'
        Colors.rarities[17].fancy = {
            "border": "#4ecfb3",
            "hue": 167,
            "light": 23,
            "sat": 100,
            "spread": 20,
            "period": 1.5,
            "stars": 2
        }

        window.ThivColors.rarities[18].display = 'Galactic'
        window.ThivColors.rarities[18].color = '#ba5f7a'
        window.ThivColors.rarities[18].border = '#974d63'
        window.ThivColors.rarities[18].hitbox = '#ba5f7a'
        Colors.rarities[18].fancy = {
            "border": "#570d23",
            "hue": 342,
            "light": 10,
            "sat": 100,
            "spread": 80,
            "period": 1,
            "stars": 3
        }
    }
    if (window.ThivColors.ColorSetting == "DarkV2") {
        window.ThivColors.rarities[0].display = 'Common'
        window.ThivColors.rarities[0].color = '#7eef6d'
        window.ThivColors.rarities[0].border = '#66c258'
        window.ThivColors.rarities[0].hitbox = '#7eef6d'
        Colors.rarities[0].fancy = {
            "border": '#55ba45',
            "hue": 110,
            "light": 23,
            "sat": 70,
            "spread": 20,
            "period": 1,
        }

        window.ThivColors.rarities[1].display = 'Unusual'
        window.ThivColors.rarities[1].color = '#ffe65d'
        window.ThivColors.rarities[1].border = '#cfba4b'
        window.ThivColors.rarities[1].hitbox = '#ffe65d'
        Colors.rarities[1].fancy = {
            "border": '#c9b136',
            "hue": 50,
            "light": 23,
            "sat": 90,
            "spread": 15,
            "period": 1,
        }

        window.ThivColors.rarities[2].display = 'Rare'
        window.ThivColors.rarities[2].color = '#4d52e3'
        window.ThivColors.rarities[2].border = '#3e42b8'
        window.ThivColors.rarities[2].hitbox = '#4d52e3'
        Colors.rarities[2].fancy = {
            "border": '#373ba4',
            "hue": 240,
            "light": 23,
            "sat": 80,
            "spread": 10,
            "period": 1,
        }

        window.ThivColors.rarities[3].display = 'Epic'
        window.ThivColors.rarities[3].color = '#861fde'
        window.ThivColors.rarities[3].border = '#6d19b4'
        window.ThivColors.rarities[3].hitbox = '#861fde'
        Colors.rarities[3].fancy = {
            "border": '#60159d',
            "hue": 270,
            "light": 23,
            "sat": 125,
            "spread": 10,
            "period": 1,
        }

        window.ThivColors.rarities[4].display = 'Legendary'
        window.ThivColors.rarities[4].color = '#de1f1f'
        window.ThivColors.rarities[4].border = '#b41919'
        window.ThivColors.rarities[4].hitbox = '#de1f1f'
        Colors.rarities[4].fancy = {
            "border": '#9d1515',
            "hue": 10,
            "light": 23,
            "sat": 125,
            "spread": 15,
            "period": 1,
        }

        window.ThivColors.rarities[5].display = 'Mythic'
        window.ThivColors.rarities[5].color = '#1fdbde'
        window.ThivColors.rarities[5].border = '#19b1b4'
        window.ThivColors.rarities[5].hitbox = '#1fdbde'
        Colors.rarities[5].fancy = {
            "border": '#159b9d',
            "hue": 180,
            "light": 23,
            "sat": 100,
            "spread": 10,
            "period": 1,
        }

        window.ThivColors.rarities[6].display = 'Ultra'
        window.ThivColors.rarities[6].color = '#E0115F'
        window.ThivColors.rarities[6].border = '#cf235f'
        window.ThivColors.rarities[6].hitbox = '#ff2b75'
        Colors.rarities[6].fancy = {
            "border": '#b71f54',
            "hue": 325,
            "light": 23,
            "sat": 100,
            "spread": 15,
            "period": 1,
        }
        window.ThivColors.rarities[7].display = 'Super'
        window.ThivColors.rarities[7].color = '#2bffa3'
        window.ThivColors.rarities[7].border = '#23cf84'
        window.ThivColors.rarities[7].hitbox = '#2bffa3'
        Colors.rarities[7].fancy = {
            "border": '#1fb775',
            "hue": 160,
            "light": 23,
            "sat": 100,
            "spread": 20,
            "period": 1,
            "stars": 2,
        }
        window.ThivColors.rarities[8].display = 'Omega'
        window.ThivColors.rarities[8].color = '#494849'
        window.ThivColors.rarities[8].border = '#3c3b40'
        window.ThivColors.rarities[8].hitbox = '#1f0104'
        Colors.rarities[8].fancy = {
            "border": '#5511aa',
            "hue": 270,
            "light": 20,
            "sat": 90,
            "spread": 25,
            "period": 1,
            "stars": 2,
        }
        window.ThivColors.rarities[9].display = 'Fabled'
        window.ThivColors.rarities[9].color = '#ff5500'
        window.ThivColors.rarities[9].border = '#cf4500'
        window.ThivColors.rarities[9].hitbox = '#ff5500'
        Colors.rarities[9].fancy = {
            "border": Colors.rarities[9].border,
            "hue": 20,
            "light": 24,
            "sat": 95,
            "spread": 20,
            "period": 1,
            "stars": 2,
        }

        window.ThivColors.rarities[10].display = 'Divine'
        window.ThivColors.rarities[10].color = '#9136f6'
        window.ThivColors.rarities[10].border = '#453869'
        window.ThivColors.rarities[10].hitbox = '#67549c'
        Colors.rarities[10].fancy = {
            "border": "#53447e",
            "hue": 256,
            "light": 23,
            "sat": 30,
            "spread": 25,
            "period": 1.5,
            "stars": 3,
        }

        window.ThivColors.rarities[11].display = 'Supreme'
        window.ThivColors.rarities[11].color = '#b25dd9'
        window.ThivColors.rarities[11].border = '#9043b3'
        window.ThivColors.rarities[11].hitbox = '#b25dd9'
        Colors.rarities[11].fancy = {
            "border": "#904bb0",
            "hue": 281,
            "light": 27,
            "sat": 62,
            "spread": 23,
            "period": 2,
            "stars": 4
        }

        window.ThivColors.rarities[12].display = 'Omnipotent'
        window.ThivColors.rarities[12].color = '#888888'
        window.ThivColors.rarities[12].border = '#6e6e6e'
        window.ThivColors.rarities[12].hitbox = '#888888'
        Colors.rarities[12].fancy = {
            "border": "#7333b3",
            "hue": 270,
            "light": 28,
            "sat": 89,
            "spread": 36,
            "period": 1,
            "stars": 4
        }

        window.ThivColors.rarities[13].display = 'Astral'
        window.ThivColors.rarities[13].color = '#046307'
        window.ThivColors.rarities[13].border = '#035005'
        window.ThivColors.rarities[13].hitbox = '#046307'
        Colors.rarities[13].fancy = {
            "border": "#035005",
            "hue": 125,
            "light": 10,
            "sat": 100,
            "spread": 45,
            "period": 1,
            "stars": 4
        }

        window.ThivColors.rarities[14].display = 'Celestial'
        window.ThivColors.rarities[14].color = '#00bfff'
        window.ThivColors.rarities[14].border = '#009bcf'
        window.ThivColors.rarities[14].hitbox = '#00bfff'
        Colors.rarities[14].fancy = {
            "border": "#007baf",
            "hue": 195,
            "light": 23,
            "sat": 100,
            "spread": 10,
            "period": 1.5,
            "stars": 2
        }

        window.ThivColors.rarities[15].display = 'Seraphic'
        window.ThivColors.rarities[15].color = '#c77e5b'
        window.ThivColors.rarities[15].border = '#a16649'
        window.ThivColors.rarities[15].hitbox = '#c77e5b'
        Colors.rarities[15].fancy = {
            "border": "#a16649",
            "hue": 19,
            "light": 23,
            "sat": 49,
            "spread": 15,
            "period": 1.5,
            "stars": 2
        }

        window.ThivColors.rarities[16].display = 'Transcendent'
        window.ThivColors.rarities[16].color = '#ffffff'
        window.ThivColors.rarities[16].border = '#cfcfcf'
        window.ThivColors.rarities[16].hitbox = '#ffffff'
        Colors.rarities[16].fancy = {
            "border": "#ffffff",
            "hue": 190,
            "light": 90,
            "sat": 100,
            "spread": 73,
            "period": 1.5,
            "stars": 2
        }

        window.ThivColors.rarities[17].display = 'Quantum'
        window.ThivColors.rarities[17].color = '#61ffdd'
        window.ThivColors.rarities[17].border = '#4ecfb3'
        window.ThivColors.rarities[17].hitbox = '#61ffdd'
        Colors.rarities[17].fancy = {
            "border": "#8fdfb6",
            "hue": 167,
            "light": 30,
            "sat": 100,
            "spread": 20,
            "period": 1.5,
            "stars": 2
        }

        window.ThivColors.rarities[18].display = 'Galactic'
        window.ThivColors.rarities[18].color = '#ba5f7a'
        window.ThivColors.rarities[18].border = '#974d63'
        window.ThivColors.rarities[18].hitbox = '#ba5f7a'
        Colors.rarities[18].fancy = {
            "border": "#570d23",
            "hue": 335,
            "light": 10,
            "sat": 100,
            "spread": 75,
            "period": 1,
            "stars": 5
        }
    }
    if (window.ThivColors.ColorSetting == "Random") {
        function getRandomInt(max) {
            return Math.floor(Math.random() * max);
        }
        for (let i = 0; i < 19; i++) { // INCREDIBLY inefficent but i do not care it only runs once and is a joke.
            let r = getRandomInt(255)
            let g= getRandomInt(255)
            let b = getRandomInt(255)
            let ro = Math.max(Math.floor((r-10)*0.8),0)
            let go = Math.max(Math.floor((g-10)*0.8),0)
            let bo = Math.max(Math.floor((b-10)*0.8),0)
            let hsv = rgb2hsv(r,g,b)
            r = r.toString(16);
            g = g.toString(16);
            b = b.toString(16);
            ro = ro.toString(16);
            go = go.toString(16);
            bo = bo.toString(16);
            if (r.length < 2) {r = "0" + r}
            if (g.length < 2) {g = "0" + g}
            if (b.length < 2) {b = "0" + b}
            if (ro.length < 2) {ro = "0" + ro}
            if (go.length < 2) {go = "0" + go}
            if (bo.length < 2) {bo = "0" + bo}

            window.ThivColors.rarities[i].display = 'Rarity #' + (i+1)
            window.ThivColors.rarities[i].color = "#" + r + g + b
            window.ThivColors.rarities[i].border = "#" + ro + go + bo
            window.ThivColors.rarities[i].hitbox = "#" + r + g + b
            Colors.rarities[i].fancy = undefined
            if (i > 8) {
                console.log(hsv)
                Colors.rarities[i].fancy = {
                    "border":  "#" + ro + go + bo,
                    "hue": hsv.h,
                    "light": hsv.v,
                    "sat": hsv.s,
                    "spread": 25,
                    "period": 1,
                    "stars": getRandomInt(Math.ceil(i/3.5))
                }
            }
        }
    }
    if (window.ThivColors.ColorSetting == "Reverse") {
        window.ThivColors.rarities[18].display = 'Common'
        window.ThivColors.rarities[18].color = '#7eef6d'
        window.ThivColors.rarities[18].border = '#66c258'
        window.ThivColors.rarities[18].hitbox = '#7eef6d'

        window.ThivColors.rarities[17].display = 'Unusual'
        window.ThivColors.rarities[17].color = '#ffe65d'
        window.ThivColors.rarities[17].border = '#cfba4b'
        window.ThivColors.rarities[17].hitbox = '#ffe65d'

        window.ThivColors.rarities[16].display = 'Rare'
        window.ThivColors.rarities[16].color = '#4d52e3'
        window.ThivColors.rarities[16].border = '#3e42b8'
        window.ThivColors.rarities[16].hitbox = '#4d52e3'

        window.ThivColors.rarities[15].display = 'Epic'
        window.ThivColors.rarities[15].color = '#861fde'
        window.ThivColors.rarities[15].border = '#6d19b4'
        window.ThivColors.rarities[15].hitbox = '#861fde'

        window.ThivColors.rarities[14].display = 'Legendary'
        window.ThivColors.rarities[14].color = '#de1f1f'
        window.ThivColors.rarities[14].border = '#b41919'
        window.ThivColors.rarities[14].hitbox = '#de1f1f'

        window.ThivColors.rarities[13].display = 'Mythic'
        window.ThivColors.rarities[13].color = '#1fdbde'
        window.ThivColors.rarities[13].border = '#19b1b4'
        window.ThivColors.rarities[13].hitbox = '#1fdbde'

        window.ThivColors.rarities[12].display = 'Ultra'
        window.ThivColors.rarities[12].color = '#ff2b75'
        window.ThivColors.rarities[12].border = '#cf235f'
        window.ThivColors.rarities[12].hitbox = '#ff2b75'

        window.ThivColors.rarities[11].display = 'Super'
        window.ThivColors.rarities[11].color = '#2bffa3'
        window.ThivColors.rarities[11].border = '#23cf84'
        window.ThivColors.rarities[11].hitbox = '#2bffa3'

        window.ThivColors.rarities[10].display = 'Omega'
        window.ThivColors.rarities[10].color = '#494849'
        window.ThivColors.rarities[10].border = '#3c3b40'
        window.ThivColors.rarities[10].hitbox = '#494849'

        window.ThivColors.rarities[9].display = 'Fabled'
        window.ThivColors.rarities[9].color = '#ff5500'
        window.ThivColors.rarities[9].border = '#cf4500'
        window.ThivColors.rarities[9].hitbox = '#ff5500'

        window.ThivColors.rarities[8].display = 'Divine'
        window.ThivColors.rarities[8].color = '#67549c'
        window.ThivColors.rarities[8].border = '#453869'
        window.ThivColors.rarities[8].hitbox = '#67549c'

        window.ThivColors.rarities[7].display = 'Supreme'
        window.ThivColors.rarities[7].color = '#b25dd9'
        window.ThivColors.rarities[7].border = '#9043b3'
        window.ThivColors.rarities[7].hitbox = '#b25dd9'

        window.ThivColors.rarities[6].display = 'Omnipotent'
        window.ThivColors.rarities[6].color = '#888888'
        window.ThivColors.rarities[6].border = '#6e6e6e'
        window.ThivColors.rarities[6].hitbox = '#888888'

        window.ThivColors.rarities[5].display = 'Astral'
        window.ThivColors.rarities[5].color = '#046307'
        window.ThivColors.rarities[5].border = '#035005'
        window.ThivColors.rarities[5].hitbox = '#046307'

        window.ThivColors.rarities[4].display = 'Celestial'
        window.ThivColors.rarities[4].color = '#00bfff'
        window.ThivColors.rarities[4].border = '#009bcf'
        window.ThivColors.rarities[4].hitbox = '#00bfff'

        window.ThivColors.rarities[3].display = 'Seraphic'
        window.ThivColors.rarities[3].color = '#c77e5b'
        window.ThivColors.rarities[3].border = '#a16649'
        window.ThivColors.rarities[3].hitbox = '#c77e5b'

        window.ThivColors.rarities[2].display = 'Transcendent'
        window.ThivColors.rarities[2].color = '#ffffff'
        window.ThivColors.rarities[2].border = '#cfcfcf'
        window.ThivColors.rarities[2].hitbox = '#ffffff'

        window.ThivColors.rarities[1].display = 'Quantum'
        window.ThivColors.rarities[1].color = '#61ffdd'
        window.ThivColors.rarities[1].border = '#4ecfb3'
        window.ThivColors.rarities[1].hitbox = '#61ffdd'

        window.ThivColors.rarities[0].display = 'Galactic'
        window.ThivColors.rarities[0].color = '#ba5f7a'
        window.ThivColors.rarities[0].border = '#974d63'
        window.ThivColors.rarities[0].hitbox = '#ba5f7a'
        // let bad = Colors.rarities
        for (let i = 0; i < 9; i++) { // incredibly janky solution but i couldnt care less
            //   console.log(18-i,bad[18-i].fancy)
            Colors.rarities[i].fancy =  Colors.rarities[18-i].fancy
        }
        for (let i = 9; i < 19; i++) {
            Colors.rarities[i].fancy = undefined
        }
    }
    if (window.ThivColors.ColorSetting == "Light") {
        window.ThivColors.rarities[0].display = 'Common'
        window.ThivColors.rarities[0].color = '#BBFFAD'
        window.ThivColors.rarities[0].border = '#9AD08F'
        window.ThivColors.rarities[0].hitbox = '#BBFFAD'
        Colors.rarities[0].fancy = {
            "border": "#9AD08F",
            "hue": 110,
            "light": 84,
            "sat": 100,
            "spread": 12,
            "period": 1
        }
        window.ThivColors.rarities[1].display = 'Unusual'
        window.ThivColors.rarities[1].color = '#FDF784'
        window.ThivColors.rarities[1].border = '#D2CD6D'
        window.ThivColors.rarities[1].hitbox = '#FDF784'
        Colors.rarities[1].fancy = {
            "border": "#D2CD6D",
            "hue": 57,
            "light": 76,
            "sat": 89,
            "spread": 12,
            "period": 1
        }
        window.ThivColors.rarities[2].display = 'Rare'
        window.ThivColors.rarities[2].color = '#6678FF'
        window.ThivColors.rarities[2].border = '#5665D3'
        window.ThivColors.rarities[2].hitbox = '#6678FF'
        Colors.rarities[2].fancy = {
            "border": "#5665D3",
            "hue": 233,
            "light": 70,
            "sat": 86,
            "spread": 12,
            "period": 1
        }
        window.ThivColors.rarities[3].display = 'Epic'
        window.ThivColors.rarities[3].color = '#B76FFF'
        window.ThivColors.rarities[3].border = '#9B61D5'
        window.ThivColors.rarities[3].hitbox = '#B76FFF'
        Colors.rarities[3].fancy = {
            "border": "#9B61D5",
            "hue": 270,
            "light": 72,
            "sat": 85,
            "spread": 15,
            "period": 1
        }
        window.ThivColors.rarities[4].display = 'Legendary'
        window.ThivColors.rarities[4].color = '#FF5959'
        window.ThivColors.rarities[4].border = '#D54444'
        window.ThivColors.rarities[4].hitbox = '#FF5959'
        Colors.rarities[4].fancy = {
            "border": "#D54444",
            "hue": 0,
            "light": 67,
            "sat": 78,
            "spread": 12,
            "period": 1
        }
        window.ThivColors.rarities[5].display = 'Mythic'
        window.ThivColors.rarities[5].color = '#81FFFF'
        window.ThivColors.rarities[5].border = '#66D9D9'
        window.ThivColors.rarities[5].hitbox = '#81FFFF'
        Colors.rarities[5].fancy = {
            "border": "#66D9D9",
            "hue": 180,
            "light": 75,
            "sat": 75,
            "spread": 10,
            "period": 1
        }
        window.ThivColors.rarities[6].display = 'Ultra'
        window.ThivColors.rarities[6].color = '#FF61CA'
        window.ThivColors.rarities[6].border = '#D84FAA'
        window.ThivColors.rarities[6].hitbox = '#FF61CA'
        Colors.rarities[6].fancy = {
            "border": "#D84FAA",
            "hue": 320,
            "light": 69,
            "sat": 72,
            "spread": 20,
            "period": 1
        }
        window.ThivColors.rarities[7].display = 'Super'
        window.ThivColors.rarities[7].color = '#7FFFBF'
        window.ThivColors.rarities[7].border = '#69D19D'
        window.ThivColors.rarities[7].hitbox = '#7FFFBF'
        Colors.rarities[7].fancy = {
            "border": "#69D19D",
            "hue": 150,
            "light": 75,
            "sat": 80,
            "spread": 20,
            "period": 1
        }
        window.ThivColors.rarities[8].display = 'Omega'
        window.ThivColors.rarities[8].color = '#5B686F'
        window.ThivColors.rarities[8].border = '#4C575C'
        window.ThivColors.rarities[8].hitbox = '#5B686F'
        Colors.rarities[8].fancy = {
            "border": "#4C575C",
            "hue": 200,
            "light": 40,
            "sat": 18,
            "spread": 15,
            "period": 1
        }
        window.ThivColors.rarities[9].display = 'Fabled'
        window.ThivColors.rarities[9].color = '#FFB580'
        window.ThivColors.rarities[9].border = '#D4986D'
        window.ThivColors.rarities[9].hitbox = '#FFB580'
        Colors.rarities[9].fancy = {
            "border": "#D4986D",
            "hue": 25,
            "light": 75,
            "sat": 100,
            "spread": 15,
            "period": 1
        }
        window.ThivColors.rarities[10].display = 'Divine'
        window.ThivColors.rarities[10].color = '#8F75D9'
        window.ThivColors.rarities[10].border = '#7862B4'
        window.ThivColors.rarities[10].hitbox = '#8F75D9'
        Colors.rarities[10].fancy = {
            "border": "#7862B4",
            "hue": 256,
            "light": 65,
            "sat": 46,
            "spread": 20,
            "period": 1
        }

        window.ThivColors.rarities[11].display = 'Supreme'
        window.ThivColors.rarities[11].color = '#DA8AFF'
        window.ThivColors.rarities[11].border = '#B374D0'
        window.ThivColors.rarities[11].hitbox = '#DA8AFF'
        Colors.rarities[11].fancy = {
            "border": "#B374D0",
            "hue": 281,
            "light": 77,
            "sat": 76,
            "spread": 15,
            "period": 1,
            "stars": 1
        }

        window.ThivColors.rarities[12].display = 'Omnipotent'
        window.ThivColors.rarities[12].color = '#CD35FF'
        window.ThivColors.rarities[12].border = '#8824A9'
        window.ThivColors.rarities[12].hitbox = '#CD35FF'
        Colors.rarities[12].fancy = {
            "border": "#8824A9",
            "hue": 285,
            "light": 60,
            "sat": 100,
            "spread": 35,
            "period": 1,
            "stars": 2
        }

        window.ThivColors.rarities[13].display = 'Astral'
        window.ThivColors.rarities[13].color = '#5EFF63'
        window.ThivColors.rarities[13].border = '#4DCC51'
        window.ThivColors.rarities[13].hitbox = '#5EFF63'
        Colors.rarities[13].fancy = {
            "border": "#4DCC51",
            "hue": 122,
            "light": 68,
            "sat": 100,
            "spread": 60,
            "period": 1,
            "stars": 2
        }

        window.ThivColors.rarities[14].display = 'Celestial'
        window.ThivColors.rarities[14].color = '#87E1FF'
        window.ThivColors.rarities[14].border = '#77BAD0'
        window.ThivColors.rarities[14].hitbox = '#87E1FF'
        Colors.rarities[14].fancy = {
            "border": "#77BAD0",
            "hue": 195,
            "light": 76,
            "sat": 100,
            "spread": 10,
            "period": 1,
            "stars": 2
        }

        window.ThivColors.rarities[15].display = 'Seraphic'
        window.ThivColors.rarities[15].color = '#FFB694'
        window.ThivColors.rarities[15].border = '#CB9278'
        window.ThivColors.rarities[15].hitbox = '#FFB694'
        Colors.rarities[15].fancy = {
            "border": "#CB9278",
            "hue": 19,
            "light": 79,
            "sat": 85,
            "spread": 15,
            "period": 0.8,
            "stars": 2
        }

        window.ThivColors.rarities[16].display = 'Transcendent'
        window.ThivColors.rarities[16].color = '#ffffff'
        window.ThivColors.rarities[16].border = '#cfcfcf'
        window.ThivColors.rarities[16].hitbox = '#ffffff'
        Colors.rarities[16].fancy = {
            "border": "#cfcfcf",
            "hue": 180,
            "light": 95,
            "sat": 100,
            "spread": 150,
            "period": 0.7,
            "stars": 2
        }

        window.ThivColors.rarities[17].display = 'Quantum'
        window.ThivColors.rarities[17].color = '#AEFFED'
        window.ThivColors.rarities[17].border = '#8DD0C1'
        window.ThivColors.rarities[17].hitbox = '#AEFFED'
        Colors.rarities[17].fancy = {
            "border": "#8DD0C1",
            "hue": 167,
            "light": 84,
            "sat": 100,
            "spread": 27,
            "period": 0.6,
            "stars": 2
        }

        window.ThivColors.rarities[18].display = 'Galactic'
        window.ThivColors.rarities[18].color = '#FF6090'
        window.ThivColors.rarities[18].border = '#CD4C73'
        window.ThivColors.rarities[18].hitbox = '#FF6090'
        Colors.rarities[18].fancy = {
            "border": "#CD4C73",
            "hue": 342,
            "light": 69,
            "sat": 100,
            "spread": 80,
            "period": 0.52,
            "stars": 3
        }

        window.ThivColors.rarities[19].display = 'Eternal'
        window.ThivColors.rarities[19].color = '#5a8c7d'
        window.ThivColors.rarities[19].border = '#497165'
        window.ThivColors.rarities[19].hitbox = '#5a8c7d'

        window.ThivColors.rarities[20].display = 'Chaos'
        window.ThivColors.rarities[20].color = '#20258a'
        window.ThivColors.rarities[20].border = '#191e70'
        window.ThivColors.rarities[20].hitbox = '#20258a'

        window.ThivColors.rarities[21].display = 'Vicious'
        window.ThivColors.rarities[21].color = '#732190'
        window.ThivColors.rarities[21].border = '#5d1a74'
        window.ThivColors.rarities[21].hitbox = '#732190'


    }
    if (window.ThivColors.ColorSetting == "ColorWheelV2") {
        window.ThivColors.rarities[0].display = 'Red'
        window.ThivColors.rarities[0].color = '#ff0000'
        window.ThivColors.rarities[0].border = '#aa0000'
        window.ThivColors.rarities[0].hitbox = '#ff0000'
        Colors.rarities[0].fancy = {
            "border": '#aa0000',
            "hue": 0,
            "light": 50,
            "sat": 100,
            "spread": 0,
            "period": 1,
        }

        window.ThivColors.rarities[1].display = 'Cinder'
        window.ThivColors.rarities[1].color = '#ff5500'
        window.ThivColors.rarities[1].border = '#aa3800'
        window.ThivColors.rarities[1].hitbox = '#ff5500'
        Colors.rarities[1].fancy = {
            "border": '#aa3800',
            "hue": 18,
            "light": 50,
            "sat": 100,
            "spread": 2,
            "period": 1,
        }

        window.ThivColors.rarities[2].display = 'Orange'
        window.ThivColors.rarities[2].color = '#ff8800'
        window.ThivColors.rarities[2].border = '#aa5500'
        window.ThivColors.rarities[2].hitbox = '#ff8800'
        Colors.rarities[2].fancy = {
            "border": '#af5a11',
            "hue": 30,
            "light": 50,
            "sat": 100,
            "spread": 3,
            "period": 1,
        }

        window.ThivColors.rarities[3].display = 'Amber'
        window.ThivColors.rarities[3].color = '#ffaa00'
        window.ThivColors.rarities[3].border = '#aa7700'
        window.ThivColors.rarities[3].hitbox = '#ffaa00'
        Colors.rarities[3].fancy = {
            "border": '#aa8800',
            "hue": 45,
            "light": 50,
            "sat": 100,
            "spread": 4,
            "period": 1,
        }

        window.ThivColors.rarities[4].display = 'Yellow'
        window.ThivColors.rarities[4].color = '#ffd026'
        window.ThivColors.rarities[4].border = '#aa9c11'
        window.ThivColors.rarities[4].hitbox = '#ffcc22'
        Colors.rarities[4].fancy = {
            "border": '#aa9c11',
            "hue": 55,
            "light": 50,
            "sat": 100,
            "spread": 5,
            "period": 1,
        }

        window.ThivColors.rarities[5].display = 'Lime'
        window.ThivColors.rarities[5].color = '#aaff33'
        window.ThivColors.rarities[5].border = '#88aa11'
        window.ThivColors.rarities[5].hitbox = '#aaff33'
        Colors.rarities[5].fancy = {
            "border": '#88aa11',
            "hue": 75,
            "light": 48,
            "sat": 88,
            "spread": 6,
            "period": 1,
            "stars": 1,
        }

        window.ThivColors.rarities[6].display = 'Green'
        window.ThivColors.rarities[6].color = '#77cc44'
        window.ThivColors.rarities[6].border = '#479916'
        window.ThivColors.rarities[6].hitbox = '#77cc44'

        window.ThivColors.rarities[7].display = 'Teal'
        window.ThivColors.rarities[7].color = '#46ff88'
        window.ThivColors.rarities[7].border = '#27aa61'
        window.ThivColors.rarities[7].hitbox = '#46ff88'

        window.ThivColors.rarities[8].display = 'Cyan'
        window.ThivColors.rarities[8].color = '#33cccc'
        window.ThivColors.rarities[8].border = '#199999'
        window.ThivColors.rarities[8].hitbox = '#33cccc'

        window.ThivColors.rarities[9].display = 'Blue'
        window.ThivColors.rarities[9].color = '#1199cc'
        window.ThivColors.rarities[9].border = '#036799'
        window.ThivColors.rarities[9].hitbox = '#1199cc'

        window.ThivColors.rarities[10].display = 'Indigo'
        window.ThivColors.rarities[10].color = '#6644bb'
        window.ThivColors.rarities[10].border = '#32168c'
        window.ThivColors.rarities[10].hitbox = '#6644bb'

        window.ThivColors.rarities[11].display = 'Purple'
        window.ThivColors.rarities[11].color = '#9911aa'
        window.ThivColors.rarities[11].border = '#670383'
        window.ThivColors.rarities[11].hitbox = '#9911aa'

        window.ThivColors.rarities[12].display = 'Magenta'
        window.ThivColors.rarities[12].color = '#c22595'
        window.ThivColors.rarities[12].border = '#8f106d'
        window.ThivColors.rarities[12].hitbox = '#c22595'

        window.ThivColors.rarities[13].display = 'Pink'
        window.ThivColors.rarities[13].color = '#ff77aa'
        window.ThivColors.rarities[13].border = '#aa4783'
        window.ThivColors.rarities[13].hitbox = '#ff77aa'

        window.ThivColors.rarities[14].display = 'Orchid'
        window.ThivColors.rarities[14].color = '#ff99dd'
        window.ThivColors.rarities[14].border = '#aa779c'
        window.ThivColors.rarities[14].hitbox = '#ff77dd'

        window.ThivColors.rarities[15].display = 'Lavender'
        window.ThivColors.rarities[15].color = '#ccaaff'
        window.ThivColors.rarities[15].border = '#9988aa'
        window.ThivColors.rarities[15].hitbox = '#ccaaff'

        window.ThivColors.rarities[16].display = 'White'
        window.ThivColors.rarities[16].color = '#ffffff'
        window.ThivColors.rarities[16].border = '#bbbbbb'
        window.ThivColors.rarities[16].hitbox = '#ffffff'

        window.ThivColors.rarities[17].display = 'Gray'
        window.ThivColors.rarities[17].color = '#888a8c'
        window.ThivColors.rarities[17].border = '#666869'
        window.ThivColors.rarities[17].hitbox = '#888a8c'

        window.ThivColors.rarities[18].display = 'Black'
        window.ThivColors.rarities[18].color = '#161924'
        window.ThivColors.rarities[18].border = '#000000'
        window.ThivColors.rarities[18].hitbox = '#111622'

        window.ThivColors.rarityNames = ['Red', 'Cinder', 'Orange,"Amber', 'Yellow', 'Lime', 'Green', 'Cyan', 'Teal', 'Blue', 'Indigo', 'Purple', 'Magenta', 'Pink', 'Orchid', 'Lavendar', 'White', 'Gray', 'Black']
    }
    if (window.ThivColors.ColorSetting == "Saturated") {
        window.ThivColors.rarities[0].display = '⭑'
        window.ThivColors.rarities[0].color = '#1efa32'
        window.ThivColors.rarities[0].border = '#07af16'
        window.ThivColors.rarities[0].hitbox = '#7eef6d'

        window.ThivColors.rarities[1].display = '⭑⭑'
        window.ThivColors.rarities[1].color = '#f8f834'
        window.ThivColors.rarities[1].border = '#a7a70a'
        window.ThivColors.rarities[1].hitbox = '#ffe65d'

        window.ThivColors.rarities[2].display = '⭑⭑⭑'
        window.ThivColors.rarities[2].color = '#2935f3'
        window.ThivColors.rarities[2].border = '#0310cd'
        window.ThivColors.rarities[2].hitbox = '#4d52e3'

        window.ThivColors.rarities[3].display = '⭑⭑⭑⭑'
        window.ThivColors.rarities[3].color = '#9223f7'
        window.ThivColors.rarities[3].border = '#700bcc'
        window.ThivColors.rarities[3].hitbox = '#861fde'

        window.ThivColors.rarities[4].display = '★'
        window.ThivColors.rarities[4].color = '#ee0606'
        window.ThivColors.rarities[4].border = '#a40505'
        window.ThivColors.rarities[4].hitbox = '#de1f1f'

        window.ThivColors.rarities[5].display = '★⭑'
        window.ThivColors.rarities[5].color = '#0aeded'
        window.ThivColors.rarities[5].border = '#07afaf'
        window.ThivColors.rarities[5].hitbox = '#1fdbde'

        window.ThivColors.rarities[6].display = '★⭑⭑'
        window.ThivColors.rarities[6].color = '#ff3076'
        window.ThivColors.rarities[6].border = '#d9054d'
        window.ThivColors.rarities[6].hitbox = '#ff2b75'

        window.ThivColors.rarities[7].display = '★⭑⭑⭑'
        window.ThivColors.rarities[7].color = '#1af697'
        window.ThivColors.rarities[7].border = '#27ad73'
        window.ThivColors.rarities[7].hitbox = '#2bffa3'

        window.ThivColors.rarities[8].display = '★⭑⭑⭑⭑'
        window.ThivColors.rarities[8].color = '#515151'
        window.ThivColors.rarities[8].border = '#302f34'
        window.ThivColors.rarities[8].hitbox = '#494849'

        window.ThivColors.rarities[9].display = '★★'
        window.ThivColors.rarities[9].color = '#ff5100'
        window.ThivColors.rarities[9].border = '#993100'
        window.ThivColors.rarities[9].hitbox = '#993100'
    }
    if (window.ThivColors.ColorSetting == "Shimmer") {
        window.ThivColors.rarities[0].display = 'Common'
        window.ThivColors.rarities[0].color = '#7eef6d'
        window.ThivColors.rarities[0].border = '#66c258'
        window.ThivColors.rarities[0].hitbox = '#7eef6d'
        Colors.rarities[0].fancy = {
            "border": '#55ba45',
            "hue": 110,
            "light": 60,
            "sat": 70,
            "spread": 20,
            "period": 1,
        }

        window.ThivColors.rarities[1].display = 'Unusual'
        window.ThivColors.rarities[1].color = '#ffe65d'
        window.ThivColors.rarities[1].border = '#cfba4b'
        window.ThivColors.rarities[1].hitbox = '#ffe65d'
        Colors.rarities[1].fancy = {
            "border": '#c9b136',
            "hue": 50,
            "light": 65,
            "sat": 90,
            "spread": 10,
            "period": 1,
        }

        window.ThivColors.rarities[2].display = 'Rare'
        window.ThivColors.rarities[2].color = '#4d52e3'
        window.ThivColors.rarities[2].border = '#3e42b8'
        window.ThivColors.rarities[2].hitbox = '#4d52e3'
        Colors.rarities[2].fancy = {
            "border": '#373ba4',
            "hue": 235,
            "light": 55,
            "sat": 75,
            "spread": 10,
            "period": 1,
        }

        window.ThivColors.rarities[3].display = 'Epic'
        window.ThivColors.rarities[3].color = '#861fde'
        window.ThivColors.rarities[3].border = '#6d19b4'
        window.ThivColors.rarities[3].hitbox = '#861fde'
        Colors.rarities[3].fancy = {
            "border": '#60159d',
            "hue": 270,
            "light": 45,
            "sat": 100,
            "spread": 10,
            "period": 1,
        }

        window.ThivColors.rarities[4].display = 'Legendary'
        window.ThivColors.rarities[4].color = '#de1f1f'
        window.ThivColors.rarities[4].border = '#b41919'
        window.ThivColors.rarities[4].hitbox = '#de1f1f'
        Colors.rarities[4].fancy = {
            "border": '#9d1515',
            "hue": 10,
            "light": 45,
            "sat": 90,
            "spread": 10,
            "period": 1,
        }

        window.ThivColors.rarities[5].display = 'Mythic'
        window.ThivColors.rarities[5].color = '#1fdbde'
        window.ThivColors.rarities[5].border = '#19b1b4'
        window.ThivColors.rarities[5].hitbox = '#1fdbde'
        Colors.rarities[5].fancy = {
            "border": '#159b9d',
            "hue": 180,
            "light": 42,
            "sat": 100,
            "spread": 10,
            "period": 1,
        }

        window.ThivColors.rarities[6].display = 'Ultra'
        window.ThivColors.rarities[6].color = '#ff2b75'
        window.ThivColors.rarities[6].border = '#cf235f'
        window.ThivColors.rarities[6].hitbox = '#ff2b75'
        Colors.rarities[6].fancy = {
            "border": '#b71f54',
            "hue": 325,
            "light": 45,
            "sat": 100,
            "spread": 15,
            "period": 1,
        }

        window.ThivColors.rarities[7].display = 'Super'
        window.ThivColors.rarities[7].color = '#2bffa3'
        window.ThivColors.rarities[7].border = '#23cf84'
        window.ThivColors.rarities[7].hitbox = '#2bffa3'
        Colors.rarities[7].fancy = {
            "border": '#2f9d4c',
            "hue": 160,
            "light": 47,
            "sat": 90,
            "spread": 20,
            "period": 1,
        }

        window.ThivColors.rarities[8].display = 'Omega'
        window.ThivColors.rarities[8].color = '#494849'
        window.ThivColors.rarities[8].border = '#3c3b40'
        window.ThivColors.rarities[8].hitbox = '#494849'
        Colors.rarities[8].fancy = {
            "border": '#2f2f32',
            "hue": 240,
            "light": 30,
            "sat": 20,
            "spread": 25,
            "period": 1,
        }

        window.ThivColors.rarities[9].display = 'Fabled'
        window.ThivColors.rarities[9].color = '#ff5500'
        window.ThivColors.rarities[9].border = '#cf4500'
        window.ThivColors.rarities[9].hitbox = '#ff5500'
        Colors.rarities[9].fancy = {
            "border": Colors.rarities[9].border,
            "hue": 25,
            "light": 45,
            "sat": 100,
            "spread": 15,
            "period": 1,
        }

        window.ThivColors.rarities[10].display = 'Divine'
        window.ThivColors.rarities[10].color = '#67549c'
        window.ThivColors.rarities[10].border = '#453869'
        window.ThivColors.rarities[10].hitbox = '#67549c'
        Colors.rarities[10].fancy = {
            "border": "#53447e",
            "hue": 256,
            "light": 47,
            "sat": 30,
            "spread": 20,
            "period": 1.5
        }

        window.ThivColors.rarities[11].display = 'Supreme'
        window.ThivColors.rarities[11].color = '#b25dd9'
        window.ThivColors.rarities[11].border = '#9043b3'
        window.ThivColors.rarities[11].hitbox = '#b25dd9'
        Colors.rarities[11].fancy = {
            "border": "#904bb0",
            "hue": 281,
            "light": 61,
            "sat": 62,
            "spread": 12,
            "period": 2,
            "stars": 1
        }

        window.ThivColors.rarities[12].display = 'Omnipotent'
        window.ThivColors.rarities[12].color = '#888888'
        window.ThivColors.rarities[12].border = '#6e6e6e'
        window.ThivColors.rarities[12].hitbox = '#888888'
        Colors.rarities[12].fancy = {
            "border": "#000000",
            "hue": 285,
            "light": 20,
            "sat": 100,
            "spread": 35,
            "period": 1.5,
            "stars": 2
        }

        window.ThivColors.rarities[13].display = 'Astral'
        window.ThivColors.rarities[13].color = '#046307'
        window.ThivColors.rarities[13].border = '#035005'
        window.ThivColors.rarities[13].hitbox = '#046307'
        Colors.rarities[13].fancy = {
            "border": "#035005",
            "hue": 122,
            "light": 25,
            "sat": 100,
            "spread": 60,
            "period": 1.5,
            "stars": 2
        }

        window.ThivColors.rarities[14].display = 'Celestial'
        window.ThivColors.rarities[14].color = '#00bfff'
        window.ThivColors.rarities[14].border = '#009bcf'
        window.ThivColors.rarities[14].hitbox = '#00bfff'
        Colors.rarities[14].fancy = {
            "border": "#007baf",
            "hue": 195,
            "light": 50,
            "sat": 100,
            "spread": 10,
            "period": 1.5,
            "stars": 2
        }

        window.ThivColors.rarities[15].display = 'Seraphic'
        window.ThivColors.rarities[15].color = '#c77e5b'
        window.ThivColors.rarities[15].border = '#a16649'
        window.ThivColors.rarities[15].hitbox = '#c77e5b'
        Colors.rarities[15].fancy = {
            "border": "#a16649",
            "hue": 19,
            "light": 57,
            "sat": 49,
            "spread": 15,
            "period": 1.5,
            "stars": 2
        }

        window.ThivColors.rarities[16].display = 'Transcendent'
        window.ThivColors.rarities[16].color = '#ffffff'
        window.ThivColors.rarities[16].border = '#cfcfcf'
        window.ThivColors.rarities[16].hitbox = '#ffffff'
        Colors.rarities[16].fancy = {
            "border": "#cfcfcf",
            "hue": 180,
            "light": 93,
            "sat": 100,
            "spread": 80,
            "period": 1.5,
            "stars": 2
        }

        window.ThivColors.rarities[17].display = 'Quantum'
        window.ThivColors.rarities[17].color = '#61ffdd'
        window.ThivColors.rarities[17].border = '#4ecfb3'
        window.ThivColors.rarities[17].hitbox = '#61ffdd'
        Colors.rarities[17].fancy = {
            "border": "#4ecfb3",
            "hue": 167,
            "light": 69,
            "sat": 100,
            "spread": 20,
            "period": 1.5,
            "stars": 2
        }

        window.ThivColors.rarities[18].display = 'Galactic'
        window.ThivColors.rarities[18].color = '#ba5f7a'
        window.ThivColors.rarities[18].border = '#974d63'
        window.ThivColors.rarities[18].hitbox = '#ba5f7a'
        Colors.rarities[18].fancy = {
            "border": "#570d23",
            "hue": 342,
            "light": 25,
            "sat": 100,
            "spread": 80,
            "period": 1,
            "stars": 3
        }

        window.ThivColors.rarities[19].display = 'Eternal'
        window.ThivColors.rarities[19].color = '#5a8c7d'
        window.ThivColors.rarities[19].border = '#497165'
        window.ThivColors.rarities[19].hitbox = '#5a8c7d'

        window.ThivColors.rarities[20].display = 'Chaos'
        window.ThivColors.rarities[20].color = '#20258a'
        window.ThivColors.rarities[20].border = '#191e70'
        window.ThivColors.rarities[20].hitbox = '#20258a'

        window.ThivColors.rarities[21].display = 'Vicious'
        window.ThivColors.rarities[21].color = '#732190'
        window.ThivColors.rarities[21].border = '#5d1a74'
        window.ThivColors.rarities[21].hitbox = '#732190'
    }
    if (window.ThivColors.ColorSetting == "Unfunny") {
        window.ThivColors.rarities[0].display = 'Epic'
        window.ThivColors.rarities[0].color = '#861fde'
        window.ThivColors.rarities[0].border = '#6d19b4'
        window.ThivColors.rarities[0].hitbox = '#861fde'

        window.ThivColors.rarities[1].display = 'Legendary'
        window.ThivColors.rarities[1].color = '#de1f1f'
        window.ThivColors.rarities[1].border = '#b41919'
        window.ThivColors.rarities[1].hitbox = '#de1f1f'

        window.ThivColors.rarities[2].display = 'Mythic'
        window.ThivColors.rarities[2].color = '#1fdbde'
        window.ThivColors.rarities[2].border = '#19b1b4'
        window.ThivColors.rarities[2].hitbox = '#1fdbde'

        window.ThivColors.rarities[3].display = 'Ultra'
        window.ThivColors.rarities[3].color = '#ff2b75'
        window.ThivColors.rarities[3].border = '#cf235f'
        window.ThivColors.rarities[3].hitbox = '#ff2b75'

        window.ThivColors.rarities[4].display = 'Super'
        window.ThivColors.rarities[4].color = '#2bffa3'
        window.ThivColors.rarities[4].border = '#23cf84'
        window.ThivColors.rarities[4].hitbox = '#2bffa3'

        window.ThivColors.rarities[5].display = 'Omega'
        window.ThivColors.rarities[5].color = '#494849'
        window.ThivColors.rarities[5].border = '#3c3b40'
        window.ThivColors.rarities[5].hitbox = '#494849'

        window.ThivColors.rarities[6].display = 'Fabled'
        window.ThivColors.rarities[6].color = '#ff5500'
        window.ThivColors.rarities[6].border = '#cf4500'
        window.ThivColors.rarities[6].hitbox = '#ff5500'
        Colors.rarities[6].fancy = {
            "border": '#cc3300',
            "hue": 25,
            "light": 45,
            "sat": 100,
            "spread": 15,
            "period": 1,
        }

        window.ThivColors.rarities[7].display = 'Divine'
        window.ThivColors.rarities[7].color = '#67549c'
        window.ThivColors.rarities[7].border = '#453869'
        window.ThivColors.rarities[7].hitbox = '#67549c'
        Colors.rarities[7].fancy = {
            "border": "#53447e",
            "hue": 256,
            "light": 47,
            "sat": 30,
            "spread": 20,
            "period": 1.5
        }

        window.ThivColors.rarities[8].display = 'Supreme'
        window.ThivColors.rarities[8].color = '#b25dd9'
        window.ThivColors.rarities[8].border = '#9043b3'
        window.ThivColors.rarities[8].hitbox = '#b25dd9'
        Colors.rarities[8].fancy = {
            "border": "#904bb0",
            "hue": 281,
            "light": 61,
            "sat": 62,
            "spread": 12,
            "period": 2,
            "stars": 1
        }

        window.ThivColors.rarities[9].display = 'Omnipotent'
        window.ThivColors.rarities[9].color = '#888888'
        window.ThivColors.rarities[9].border = '#6e6e6e'
        window.ThivColors.rarities[9].hitbox = '#888888'
        Colors.rarities[9].fancy = {
            "border": "#000000",
            "hue": 285,
            "light": 20,
            "sat": 100,
            "spread": 35,
            "period": 1.5,
            "stars": 2
        }

        window.ThivColors.rarities[10].display = 'Astral'
        window.ThivColors.rarities[10].color = '#046307'
        window.ThivColors.rarities[10].border = '#035005'
        window.ThivColors.rarities[10].hitbox = '#046307'
        Colors.rarities[10].fancy = {
            "border": "#035005",
            "hue": 122,
            "light": 25,
            "sat": 100,
            "spread": 60,
            "period": 1.5,
            "stars": 2
        }

        window.ThivColors.rarities[11].display = 'Celestial'
        window.ThivColors.rarities[11].color = '#00bfff'
        window.ThivColors.rarities[11].border = '#009bcf'
        window.ThivColors.rarities[11].hitbox = '#00bfff'
        Colors.rarities[11].fancy = {
            "border": "#007baf",
            "hue": 195,
            "light": 50,
            "sat": 100,
            "spread": 10,
            "period": 1.5,
            "stars": 2
        }

        window.ThivColors.rarities[12].display = 'Seraphic'
        window.ThivColors.rarities[12].color = '#c77e5b'
        window.ThivColors.rarities[12].border = '#a16649'
        window.ThivColors.rarities[12].hitbox = '#c77e5b'
        Colors.rarities[12].fancy = {
            "border": "#a16649",
            "hue": 19,
            "light": 57,
            "sat": 49,
            "spread": 15,
            "period": 1.5,
            "stars": 2
        }

        window.ThivColors.rarities[13].display = 'Transcendent'
        window.ThivColors.rarities[13].color = '#ffffff'
        window.ThivColors.rarities[13].border = '#cfcfcf'
        window.ThivColors.rarities[13].hitbox = '#ffffff'
        Colors.rarities[16].fancy = {
            "border": "#cfcfcf",
            "hue": 180,
            "light": 93,
            "sat": 100,
            "spread": 80,
            "period": 1.5,
            "stars": 2
        }

        window.ThivColors.rarities[14].display = 'Quantum'
        window.ThivColors.rarities[14].color = '#61ffdd'
        window.ThivColors.rarities[14].border = '#4ecfb3'
        window.ThivColors.rarities[14].hitbox = '#61ffdd'
        Colors.rarities[14].fancy = {
            "border": "#4ecfb3",
            "hue": 167,
            "light": 69,
            "sat": 100,
            "spread": 20,
            "period": 1.5,
            "stars": 2
        }

        window.ThivColors.rarities[15].display = 'Galactic'
        window.ThivColors.rarities[15].color = '#ba5f7a'
        window.ThivColors.rarities[15].border = '#974d63'
        window.ThivColors.rarities[15].hitbox = '#ba5f7a'
        Colors.rarities[15].fancy = {
            "border": "#570d23",
            "hue": 342,
            "light": 25,
            "sat": 100,
            "spread": 80,
            "period": 1,
            "stars": 3
        }

        window.ThivColors.rarities[16].display = 'Eternal'
        window.ThivColors.rarities[16].color = '#5a8c7d'
        window.ThivColors.rarities[16].border = '#497165'
        window.ThivColors.rarities[6].hitbox = '#5a8c7d'

        window.ThivColors.rarities[17].display = 'Chaos'
        window.ThivColors.rarities[17].color = '#20258a'
        window.ThivColors.rarities[17].border = '#191e70'
        window.ThivColors.rarities[17].hitbox = '#20258a'

        window.ThivColors.rarities[18].display = 'Vicious'
        window.ThivColors.rarities[18].color = '#732190'
        window.ThivColors.rarities[18].border = '#5d1a74'
        window.ThivColors.rarities[18].hitbox = '#732190'

    }
    if (window.ThivColors.ColorSetting == "Unfunny2") {
        window.ThivColors.rarities[0].display = 'Ultra'
        window.ThivColors.rarities[0].color = '#ff2b75'
        window.ThivColors.rarities[0].border = '#cf235f'
        window.ThivColors.rarities[0].hitbox = '#ff2b75'

        window.ThivColors.rarities[1].display = 'Super'
        window.ThivColors.rarities[1].color = '#2bffa3'
        window.ThivColors.rarities[1].border = '#23cf84'
        window.ThivColors.rarities[1].hitbox = '#2bffa3'

        window.ThivColors.rarities[2].display = 'Omega'
        window.ThivColors.rarities[2].color = '#494849'
        window.ThivColors.rarities[2].border = '#3c3b40'
        window.ThivColors.rarities[2].hitbox = '#494849'

        window.ThivColors.rarities[3].display = 'Fabled'
        window.ThivColors.rarities[3].color = '#ff5500'
        window.ThivColors.rarities[3].border = '#cf4500'
        window.ThivColors.rarities[3].hitbox = '#ff5500'
        Colors.rarities[3].fancy = {
            "border": '#cc3300',
            "hue": 25,
            "light": 45,
            "sat": 100,
            "spread": 15,
            "period": 1,
        }

        window.ThivColors.rarities[4].display = 'Divine'
        window.ThivColors.rarities[4].color = '#67549c'
        window.ThivColors.rarities[4].border = '#453869'
        window.ThivColors.rarities[4].hitbox = '#67549c'
        Colors.rarities[4].fancy = {
            "border": "#53447e",
            "hue": 256,
            "light": 47,
            "sat": 30,
            "spread": 20,
            "period": 1.5
        }

        window.ThivColors.rarities[5].display = 'Supreme'
        window.ThivColors.rarities[5].color = '#b25dd9'
        window.ThivColors.rarities[5].border = '#9043b3'
        window.ThivColors.rarities[5].hitbox = '#b25dd9'
        Colors.rarities[5].fancy = {
            "border": "#904bb0",
            "hue": 281,
            "light": 61,
            "sat": 62,
            "spread": 12,
            "period": 2,
            "stars": 1
        }

        window.ThivColors.rarities[6].display = 'Omnipotent'
        window.ThivColors.rarities[6].color = '#888888'
        window.ThivColors.rarities[6].border = '#6e6e6e'
        window.ThivColors.rarities[6].hitbox = '#888888'
        Colors.rarities[6].fancy = {
            "border": "#000000",
            "hue": 285,
            "light": 20,
            "sat": 100,
            "spread": 35,
            "period": 1.5,
            "stars": 2
        }

        window.ThivColors.rarities[7].display = 'Astral'
        window.ThivColors.rarities[7].color = '#046307'
        window.ThivColors.rarities[7].border = '#035005'
        window.ThivColors.rarities[7].hitbox = '#046307'
        Colors.rarities[7].fancy = {
            "border": "#035005",
            "hue": 122,
            "light": 25,
            "sat": 100,
            "spread": 60,
            "period": 1.5,
            "stars": 2
        }

        window.ThivColors.rarities[8].display = 'Celestial'
        window.ThivColors.rarities[8].color = '#00bfff'
        window.ThivColors.rarities[8].border = '#009bcf'
        window.ThivColors.rarities[8].hitbox = '#00bfff'
        Colors.rarities[8].fancy = {
            "border": "#007baf",
            "hue": 195,
            "light": 50,
            "sat": 100,
            "spread": 10,
            "period": 1.5,
            "stars": 2
        }

        window.ThivColors.rarities[9].display = 'Seraphic'
        window.ThivColors.rarities[9].color = '#c77e5b'
        window.ThivColors.rarities[9].border = '#a16649'
        window.ThivColors.rarities[9].hitbox = '#c77e5b'
        Colors.rarities[9].fancy = {
            "border": "#a16649",
            "hue": 19,
            "light": 57,
            "sat": 49,
            "spread": 15,
            "period": 1.5,
            "stars": 2
        }

        window.ThivColors.rarities[10].display = 'Transcendent'
        window.ThivColors.rarities[10].color = '#ffffff'
        window.ThivColors.rarities[10].border = '#cfcfcf'
        window.ThivColors.rarities[10].hitbox = '#ffffff'
        Colors.rarities[10].fancy = {
            "border": "#cfcfcf",
            "hue": 180,
            "light": 93,
            "sat": 100,
            "spread": 80,
            "period": 1.5,
            "stars": 2
        }

        window.ThivColors.rarities[11].display = 'Quantum'
        window.ThivColors.rarities[11].color = '#61ffdd'
        window.ThivColors.rarities[11].border = '#4ecfb3'
        window.ThivColors.rarities[11].hitbox = '#61ffdd'
        Colors.rarities[11].fancy = {
            "border": "#4ecfb3",
            "hue": 167,
            "light": 69,
            "sat": 100,
            "spread": 20,
            "period": 1.5,
            "stars": 2
        }

        window.ThivColors.rarities[12].display = 'Quantipotent'
        window.ThivColors.rarities[12].color = '#61ffdd'
        window.ThivColors.rarities[12].border = '#4ecfb3'
        window.ThivColors.rarities[12].hitbox = '#61ffdd'
        Colors.rarities[12].fancy = {
            "border": "#4ecfb3",
            "hue": 167,
            "light": 69,
            "sat": 100,
            "spread": 20,
            "period": 1.5,
            "stars": 2
        }

        window.ThivColors.rarities[13].display = 'Quantstral'
        window.ThivColors.rarities[13].color = '#61ffdd'
        window.ThivColors.rarities[13].border = '#4ecfb3'
        window.ThivColors.rarities[13].hitbox = '#61ffdd'
        Colors.rarities[13].fancy = {
            "border": "#4ecfb3",
            "hue": 167,
            "light": 69,
            "sat": 100,
            "spread": 20,
            "period": 1.5,
            "stars": 2
        }

        window.ThivColors.rarities[14].display = 'Galactic'
        window.ThivColors.rarities[14].color = '#ba5f7a'
        window.ThivColors.rarities[14].border = '#974d63'
        window.ThivColors.rarities[14].hitbox = '#ba5f7a'
        Colors.rarities[14].fancy = {
            "border": "#570d23",
            "hue": 342,
            "light": 25,
            "sat": 100,
            "spread": 80,
            "period": 1,
            "stars": 3
        }

        window.ThivColors.rarities[15].display = 'Eternal'
        window.ThivColors.rarities[15].color = '#5a8c7d'
        window.ThivColors.rarities[15].border = '#497165'
        window.ThivColors.rarities[15].hitbox = '#5a8c7d'
        Colors.rarities[15].fancy = undefined

        window.ThivColors.rarities[16].display = 'Chaos'
        window.ThivColors.rarities[16].color = '#20258a'
        window.ThivColors.rarities[16].border = '#191e70'
        window.ThivColors.rarities[16].hitbox = '#20258a'
        Colors.rarities[16].fancy = undefined


        window.ThivColors.rarities[17].display = 'Vicious'
        window.ThivColors.rarities[17].color = '#732190'
        window.ThivColors.rarities[17].border = '#5d1a74'
        window.ThivColors.rarities[17].hitbox = '#732190'
        Colors.rarities[17].fancy = undefined


        window.ThivColors.rarities[18].display = 'Otherworldly'
        window.ThivColors.rarities[18].color = '#ffb300'
        window.ThivColors.rarities[18].border = '#db7c00'
        window.ThivColors.rarities[18].hitbox = '#ffb300'
        Colors.rarities[18].fancy = undefined

    }
    if (window.ThivColors.ColorSetting == "Tweaked") {
        window.ThivColors.rarities[0].display = 'Common'
        window.ThivColors.rarities[0].color = '#7eef6d'
        window.ThivColors.rarities[0].border = '#66c258'
        window.ThivColors.rarities[0].hitbox = '#7eef6d'

        window.ThivColors.rarities[1].display = 'Unusual'
        window.ThivColors.rarities[1].color = '#fcce4c'
        window.ThivColors.rarities[1].border = '#d1b13d'
        window.ThivColors.rarities[1].hitbox = '#fcce4c'

        window.ThivColors.rarities[2].display = 'Rare'
        window.ThivColors.rarities[2].color = '#4a4eba'
        window.ThivColors.rarities[2].border = '#3c3f96'
        window.ThivColors.rarities[2].hitbox = '#4a4eba'

        window.ThivColors.rarities[3].display = 'Epic'
        window.ThivColors.rarities[3].color = '#861fde'
        window.ThivColors.rarities[3].border = '#6d19b4'
        window.ThivColors.rarities[3].hitbox = '#861fde'

        window.ThivColors.rarities[4].display = 'Legendary'
        window.ThivColors.rarities[4].color = '#d9332e'
        window.ThivColors.rarities[4].border = '#ad2b1d'
        window.ThivColors.rarities[4].hitbox = '#d9332e'

        window.ThivColors.rarities[5].display = 'Mythic'
        window.ThivColors.rarities[5].color = '#00ccff'
        window.ThivColors.rarities[5].border = '#16a4d0'
        window.ThivColors.rarities[5].hitbox = '#00ccff'

        window.ThivColors.rarities[6].display = 'Ultra'
        window.ThivColors.rarities[6].color = '#ff59a1'
        window.ThivColors.rarities[6].border = '#cf518e'
        window.ThivColors.rarities[6].hitbox = '#ff59a1'

        window.ThivColors.rarities[7].display = 'Super'
        window.ThivColors.rarities[7].color = '#08ff87'
        window.ThivColors.rarities[7].border = '#11d174'
        window.ThivColors.rarities[7].hitbox = '#08ff87'

        window.ThivColors.rarities[8].display = 'Omega'
        window.ThivColors.rarities[8].color = '#494849'
        window.ThivColors.rarities[8].border = '#3c3b40'
        window.ThivColors.rarities[8].hitbox = '#494849'

        window.ThivColors.rarities[9].display = 'Fabled'
        window.ThivColors.rarities[9].color = '#ff5500'
        window.ThivColors.rarities[9].border = '#cf4500'
        window.ThivColors.rarities[9].hitbox = '#ff5500'

        window.ThivColors.rarities[10].display = 'Divine'
        window.ThivColors.rarities[10].color = '#67549c'
        window.ThivColors.rarities[10].border = '#453869'
        window.ThivColors.rarities[10].hitbox = '#67549c'

        window.ThivColors.rarities[11].display = 'Supreme'
        window.ThivColors.rarities[11].color = '#b25dd9'
        window.ThivColors.rarities[11].border = '#9043b3'
        window.ThivColors.rarities[11].hitbox = '#b25dd9'

        window.ThivColors.rarities[12].display = 'Omnipotent'
        window.ThivColors.rarities[12].color = '#520380'
        window.ThivColors.rarities[12].border = '#000000'
        window.ThivColors.rarities[12].hitbox = '#520380'

        window.ThivColors.rarities[13].display = 'Astral'
        window.ThivColors.rarities[13].color = '#046307'
        window.ThivColors.rarities[13].border = '#035005'
        window.ThivColors.rarities[13].hitbox = '#046307'

        window.ThivColors.rarities[14].display = 'Celestial'
        window.ThivColors.rarities[14].color = '#00bfff'
        window.ThivColors.rarities[14].border = '#009bcf'
        window.ThivColors.rarities[14].hitbox = '#00bfff'

        window.ThivColors.rarities[15].display = 'Seraphic'
        window.ThivColors.rarities[15].color = '#c77e5b'
        window.ThivColors.rarities[15].border = '#a16649'
        window.ThivColors.rarities[15].hitbox = '#c77e5b'

        window.ThivColors.rarities[16].display = 'Transcendent'
        window.ThivColors.rarities[16].color = '#ffffff'
        window.ThivColors.rarities[16].border = '#cfcfcf'
        window.ThivColors.rarities[16].hitbox = '#ffffff'

        window.ThivColors.rarities[17].display = 'Quantum'
        window.ThivColors.rarities[17].color = '#61ffdd'
        window.ThivColors.rarities[17].border = '#4ecfb3'
        window.ThivColors.rarities[17].hitbox = '#61ffdd'

        window.ThivColors.rarities[18].display = 'Galactic'
        window.ThivColors.rarities[18].color = '#ba5f7a'
        window.ThivColors.rarities[18].border = '#974d63'
        window.ThivColors.rarities[18].hitbox = '#ba5f7a'
    }
}
loadcolors()
function assignColors() {
    for (let i = 0; i < Colors.rarities.length; i++) {
        Colors.rarities[i].name = window.ThivColors.rarities[i].display
        Colors.rarities[i].color = window.ThivColors.rarities[i].color
        Colors.rarities[i].border = window.ThivColors.rarities[i].border
        Colors.rarities[i].hitbox = window.ThivColors.rarities[i].hitbox
        if (fanciless.find((element) => element == window.ThivColors.ColorSetting)) {
            Colors.rarities[i].fancy = undefined
        }
    }
}
window.ThivColors.assignColors = assignColors
assignColors()
console.log(Colors.rarities)

let loop = 1
window.ThivColors.StealColors = function StealColors() {
    window.ThivColors.assignColors = assignColors
    loop += 1
    if (loop < 33) {
        requestAnimationFrame(StealColors)
    }
}
window.ThivColors.StealColors()
window.ThivColors.assignColors = assignColors

document.addEventListener("keydown", (e) => {
    if (e.key === "]") {
        window.ThivColors.Input = prompt("Input Color Setting, Valid: " + validsettings.toString(),"Default")
        window.ThivColors.ColorSetting = "Default"
        if (validsettings.find((element) => element == window.ThivColors.Input)) {
            window.ThivColors.ColorSetting = window.ThivColors.Input
        }
        loadcolors()
        loop = 1
        window.ThivColors.StealColors()
        window.ThivColors.assignColors = assignColors
        assignColors()
        console.log(Colors.rarities)
    }
});