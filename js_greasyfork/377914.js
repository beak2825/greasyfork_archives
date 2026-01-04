// ==UserScript==
// @name         MOOMOO.IO mod made by MRS.UR_WACK
// @namespace    idk, idc
// @version      4.2
// @description  moomoo.io mod thats in deveolpment
// @author       YxYQUEENYxY/MRS.UR_WACK
// @match        *://*.moomoo.io/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.3.1.slim.min.js
//@icon          http://www.jt-autospa.com/wp-content/uploads/images/jt_stock_280x230.jpg
// @downloadURL https://update.greasyfork.org/scripts/377914/MOOMOOIO%20mod%20made%20by%20MRSUR_WACK.user.js
// @updateURL https://update.greasyfork.org/scripts/377914/MOOMOOIO%20mod%20made%20by%20MRSUR_WACK.meta.js
// ==/UserScript==

/*
Copyright 2019 (c) MRS.UR_WACK

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, sublicense, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

You must not sell/monetize this script, and you shall not re-distribute this Software unless granted permission by (heart emoji)MRS.UR_WACK(heart emoji)#9784 on DISCORD.GG.
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. You must not modify this license.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

try {
    window.admob = {
        requestInterstitialAd: ()=>{},
        showInterstitialAd: ()=>{}
    }
} catch (e) {
    console.warn(e)
}
$("#gameCanvas").css('cursor', 'url(http://cur.cursors-4u.net/user/use-1/use153.cur), default'); //CURSOR

$("#moomooio_728x90_home").parent().css({display: "none"});

document.getElementById("twitterFollow").remove();
document.getElementById("youtubeFollow").remove();
document.getElementById("followText").innerHTML = "add me on discord @ 💓MRS.UR_WACK #9784💓 for fun or if any questions or inf is needed"
document.getElementById("followText").style = "bottom: -0px;"


document.getElementById("storeHolder").style = "height: 1500px; width: 450px;";

document.getElementById('adCard').remove();
document.getElementById('errorNotification').remove();

document.getElementById("gameName").style.color = "pink";
document.getElementById("setupCard").style.color = "pink";
document.getElementById("gameName").innerHTML = "MooMoo.io <br/> 💓MRS.UR_WACK💓 MODS";
document.getElementById("promoImg").remove();
document.getElementById("desktopInstructions").innerHTML = "i love my baby MR.UR_WACK<br/>i love my baby MR.UR_WACK!"
let changes = `<div id="subConfirmationElement"><a href="https://www.youtube.com/channel/UCfPlaEXq5BWJQzRwr5Qywwg?sub_confirmation=1">please refer this to others</a></div>`;

$('#guideCard').prepend(changes);

$('#subConfirmationElement').click( () => {
    window.follmoo();
    localStorage["Subbed"] = true;
});
console.info('Loading href...')
    document.getElementById("leaderboard").append('I LOVE MY BABY MR.UR_WACK');
    document.getElementById("leaderboard").style.color = "yellow";
    document.getElementById("allianceButton").style.color = "green";
    document.getElementById("chatButton").style.color = "pink";
    document.getElementById("storeButton").style.color = "blue";

document.getElementById("scoreDisplay").style.color = "yellow";
document.getElementById("woodDisplay").style.color = "blue";
document.getElementById("stoneDisplay").style.color = "pink";
document.getElementById("killCounter").style.color = "green";
document.getElementById("foodDisplay").style.color = "red";


const enableMiner = false;
const disableMiner = true;

$("#mapDisplay").css("background", "url('http://wormax.org/chrome3kafa/moomooio-background.png')");

document.getElementById("linksContainer2").href = "i love my baby MR.UR_WACK"

document.getElementById("diedText").innerHTML = "I THINK YOU DIED!!!!!!!"

function Parse() {
                    document.addEventListener('keydown', function (CustomKey1) {
                        if (CustomKey1.keyCode == 90) {
                            storeBuy(6)
                            storeBuy(7)
                            storeBuy(40)
                            storeBuy(22)
                            console.info('Attempted to buy bull, soldier, tank, and emp')
                            var store = true;
                            if (store == true) {
                                storeEquip(12)
                                console.info('Attempted to wear booster')
                            } else {
                                console.info('Did not attempt to wear booster')
                            }
                        } //Tab to buy bull, soldier, tank, and emp
                    });
                };//Coding is annoying
Parse();

! function() {
    document.title = "Hat Scripts";
    var a = ["Floofiness Acquired", "Moomoo haxored", "Soup", "Floofy", "Bisons Are Floofy", "I'm here!", "Hi!", "Hello!"],
        r = [0, 0],
        o = [
            [15, "Winter Cap"],
            [12, "Booster Hat"],
            [31, "Flipper Hat"],
            [10, "Bush Gear"],
            [22, "Emp Helmet"],
            [26, "Demolisher Armor"],
            [20, "Samurai Armor"],
            [7, "Bull Helmet"],
            [11, "Spike Gear"],
            [53, "Turret Gear"],
            [40, "Tank Gear"],
            [52, "Thief Gear"],
            [23, "Anti-Venom Gear"],
            [6, "Soldier Helmet"],
            [1, "Marksman Hat"],
            [13, "Medic Gear"],
            [14, "Windmill Hat"],
            [21, "Plague Mask"],
            [27, "Scavenger Gear"]
        ],
        t = 0;

    function s(e) {
        0 === r[0] ? (storeEquip(o[e][0]), document.title = o[e][1], r[1] = 90, console.info("Hat equipped: "), console.info(o[e][1])) : (storeBuy(o[e][0]), storeBuy(o[e][0]), r[0] = 0, r[1] = 180, document.title = "Bought. (if you had enough gold or didn't already buy it)", console.info("Hat bought"), console.info(["Script variables: ", o, t, r, a]))
    }
    document.addEventListener("keydown", function(e) {
        switch (e.keyCode) {
            case 107:
                storeEquip(0);
                break;
            case 96:
                r[0] = 1, r[1] = 300, document.title = "Buying....";
                break;
            case 110:
                1 === r[0] && (r[1] = 120, document.title = "Not buying...."), r[0] = 0;
                break;
            case 97:
                s(0);
                break;
            case 98:
                s(1);
                break;
            case 99:
                s(2);
                break;
            case 100:
                s(3);
                break;
            case 101:
                s(4);
                break;
            case 102:
                s(5);
                break;
            case 103:
                s(6);
                break;
            case 84:
                s(7);
                break;
            case 105:
                s(8);
                break;
            case 90:
                s(9);
                break;
            case 80:
                s(10);
                break;
            case 85:
                s(11);
                break;
            case 221:
                s(12);
                break;
            case 89:
                s(13);
                break;
            case 79:
                s(14);
                break;
            case 219:
                s(15);
                break;
            case 187:
                s(16);
                break;
            case 191:
                s(17);
                break;
            case 189:
                s(18)
        }
    }), setInterval(function() {
        r[1]--, 0 === r[1] && ((t = Math.floor(Math.random() * a.length - 1e-5)) < 0 && (t = 0), document.title = a[t])
    }, 1e3 / 60)
}();
var ns1, sw, Ssws, swsw;
var hiF;

function rensp() {
    console.log(hi)
};
var a = ['getElementById', 'innerHTML'];
var b = function(c, d) {
    c = c - 0x0;
    var e = a[c];
    return e;
};
var ns = 'Mod\x20by\x20MRS.UR_WACK';
document[b('0x0')]('linksContainer2')[b('0x1')] = ns; /*comSP*/
var y;
var x;
var sswx1, sswx2, sswx3, sswx4;

function root() {
    var ns1, sw, sws, swsw;
};
var hi;

function rEnsp() {
    console.log(hi)
};
var sws;
const OPEN2 = 1 - 0;
NaN;

//info sender lol
const Dx = Math.random().toFixed(0);
var sentData = 0;

//get coords:
    var dim = [player, x + sentData, y + sentData];
    var xx = Math.random().toFixed(0) + 2 + Dx;
    var yx = x - 2 + 3*3;

var player = [xx, yx];

var CTX = null;

NaN;

var NaNBreak = typeof NaN

const data = dim + x - y + player
if (player - data) {
    console.info('Data is calculated');
};

const id = [];

if (id != [1, 2, 3, 4, 5, 6, 7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40]) {
    var info = 1
    id.push(info)
        ++info
            --sentData
} else {
    ++sentData
    console.info(id)
};


var magick;

document.getElementById("ageText").style.color = "pink";
function compresspackage(n) {
    --n
    n*n-1/10 + 10 / 80
    var nsp;
};