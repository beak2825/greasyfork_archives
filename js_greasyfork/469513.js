// ==UserScript==
// @name         GGN Trade Card Balancer
// @namespace    https://greasyfork.org/
// @license      MIT
// @version      1.2
// @description  Generates trade request to balance card sets
// @author       drlivog
// @match        https://*.gazellegames.net/forums.php?*action=viewthread*threadid=*
// @match        https://*.gazellegames.net/user.php?*action=inventory*
// @match        https://*.gazellegames.net/user.php?*action=crafting*
// @match        https://*.gazellegames.net/user.php?*action=trade*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gazellegames.net
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/469513/GGN%20Trade%20Card%20Balancer.user.js
// @updateURL https://update.greasyfork.org/scripts/469513/GGN%20Trade%20Card%20Balancer.meta.js
// ==/UserScript==

/* globals $ */
/* jshint esversion: 11 */

let KEY = ""; //API Key Goes Here
let userid = "";
let threadid = "33690"
let debug=false;

const rounder = 0.5;
const min_have_want_ratio = GM_getValue("min_have_want_ratio", 0.0); //have at least this many cards to offer before trading

//template, will replace _category_ _have_ _want_
const FORUM_TEMPLATE = "==_category_ Cards==_have_\n\n_want_";
const IRC_TEMPLATE = "[H] _have_ [W] _want_";

(function() {
    ('use strict');
    GM_registerMenuCommand("Options", ()=>optionsDialog(),'o');
    if (debug) GM_registerMenuCommand("Get Card Information", ()=>getCardInformation(),'g');
    GM_registerMenuCommand("Reset API KEY", () => {
        if (confirm("Please confirm you would like to reset the API KEY.")) {
            GM_setValue("API_KEY","");
        }
    },'a');
    if (!userid) userid = GM_getValue("userid", userid);
    if (!debug) debug = GM_getValue("debug", false);
    if (window.location.href.includes("threadid="+threadid)) {
        $('<button id="tradebalancer">Card Balance</button>').prependTo('#reply_box');
    } else if (window.location.href.includes("action=inventory")){
        $('<li><a href="#0" id="tradebalancer" value="Card Balance">Trading Card Balance</a></li>').appendTo('#account_links');
    } else if (window.location.href.includes("action=crafting")){
        $('<li><a href="#0" id="tradebalancer" value="Card Balance">Trading Card Balance</a></li>').appendTo('#account_links');
    } else if (window.location.href.includes("action=trade")){
        $('<a href="#0" id="tradebalancer" value="Card Balance">Trading Card Balance</a>&nbsp;&nbsp;').prependTo('#trading_panel div.linkbox');
    }
    $('#tradebalancer').on("click", async (evt) => {
        checkAPIKey();
        const inv = await getInventory(userid);
        const [have, want] = countCards(inv, GM_getValue("ignorelevel2cards", false), GM_getValue("ignorespecialcards", false),
                                        GM_getValue("separatespecialcards", false), GM_getValue("keeponeofcards", false),
                                        GM_getValue("highlevelpet", true), GM_getValue("traderoundup", rounder));
        $(`<div class="modalcontent">
               <div class="modalheader">
               <span class="closemodal">&times;</span>
               </div>
               <h3>Trading Card Balancer</h3>
               <label>Post Type:
               <input type="radio" name="posttype" id="tradepostforum" value="Forum" default><label>Forum</label>&nbsp;
               <input type="radio" name="posttype" id="tradepostirc" value="IRC"><label>IRC</label>
               <br><br>
               <textarea id="tradetext" rows=15 cols=50></textarea>
               <br><br>
               <div align="center"><button id="tradecopy">Copy to Clipboard</button></div>
               </div>`).prependTo('body');
            $('.modalcontent').css({"top": "15%", "left": "35%","padding": "20px", "padding-top": "0px", "position": "fixed", "z-index": "9999999", "border-radius": "10px", "border": "1", "background-color":"rgba(0,0,0,1.0)"});
            $('.modalheader').css("width", "100%").css("height","20px").css("user-select", "none").css("cursor","move");
            document.querySelector('.modalheader').addEventListener("mousedown", mouseDown);
            window.addEventListener("mouseup", mouseUp);
            document.querySelector('.modalheader').addEventListener("touchstart", mouseDown);
            window.addEventListener("touchend", mouseUp);
            $('#tradetext').prop('disabled', true).css({"width":"100%", "height":"100%", "white-space": "pre", "overflow-wrap":"normal", "overflow-x": "auto"});
            $('#tradecopy').click((evt)=>{
                let text = document.querySelector('#tradetext');
                if (text?.selectionStart != text?.selectionEnd) { //string selected in textarea
                    navigator.clipboard.writeText(text.substring(text.selectionStart, text.selectionEnd));
                } else {
                    text.select();
                    text.setSelectionRange(0, text.textLength);
                    navigator.clipboard.writeText(text.value);
                    text.setSelectionRange(0,0);
                }
                evt.target.innerText = "Copied!";
                setTimeout(()=>{$('#tradecopy').text("Copy to Clipboard");}, 5000);
                evt.preventDefault();
            });
            $('.closemodal').css({"color": "#aaa", "float": "right", "font-size": "24px", "font-weight": "bold", "position":"absolute", "top":"3px", "right":"10px"})
                .on("mouseenter", function() { $(this).css({"color": "white", "cursor":"pointer"});})
                .on("mouseleave", function() { $(this).css({"color": "#aaa", "cursor":"none"});})
                .click(function() {document.querySelector('.modalcontent')?.remove();});
            $(document).keydown(function(event) {
                if (event.keyCode == 27) {
                    $('.closemodal').click();
                }
            });
            evt.preventDefault();
            $('#tradepostforum').click((evt)=> { $('#tradetext').text(createPost(true, have, want));}).click();
            $('#tradepostirc').click((evt)=> { $('#tradetext').text(createPost(false, have, want));});
        });
    })();

function optionsDialog() {
    $(`<div id="optionsDlg" class="modalcontent">
               <span class="closemodal">&times;</span>
               <h3>Options</h3>
               <label>Ignore Level 2 Cards: <input type="checkbox" id="ignorelevel2cards"></label><br>
               <label>Separate Special Cards: <input type="checkbox" id="separatespecialcards"></label><br>
               <label>Ignore Special Cards: <input type="checkbox" id="ignorespecialcards"></label><br>
               <label>Keep One of Each Card: <input type="checkbox" id="keeponeofcards"></label><br>
               <label>High Level Pet Cards (Dragon): <input type="checkbox" id="highlevelpet"></label><br>
               <label>Round Up:&nbsp; <input type="number" step="0.1" size="4" id="traderoundup" alt="Round-up and display for trades if we have this percentage of cards"></label><br><br>
               <label>Forum Post Template: <textarea id="forumtemplate" rows=5 columns=30 value=''>${GM_getValue("forumtemplate", FORUM_TEMPLATE)}</textarea></label><br><br>
               <label>IRC Post Template: <textarea id="irctemplate" rows=3 columns=100 value=''>${GM_getValue("irctemplate", IRC_TEMPLATE)}</textarea></label><br>
               <br><div align="center"><button id="saveoptions">Save</button>&nbsp;&nbsp;<button id="canceloptions">Cancel</button></div>
           </div>`).appendTo('body');
        if (debug) {
            $('#irctemplate').after('<br><label>User ID:&nbsp <input type="text" id="useridtest"></label>');
            $('#useridtest').val(GM_getValue("userid", userid));
        }
        $('#ignorelevel2cards').prop('checked',GM_getValue("ignorelevel2cards", false));
        $('#separatespecialcards').prop('checked',GM_getValue("separatespecialcards", false));
        $('#ignorespecialcards').prop('checked',GM_getValue("ignorespecialcards", false)).prop('disabled',GM_getValue("separatespecialcards", false));
        $('#keeponeofcards').prop('checked',GM_getValue("keeponeofcards", false));
        $('#highlevelpet').prop('checked',GM_getValue("highlevelpet", true));
        $('#traderoundup').val(GM_getValue("traderoundup", rounder));
        $('.modalcontent').css({"top": "20%", "left": "40%", "margin": "auto","padding": "20px", "position": "fixed", "z-index": "999999999",
                                "border-radius": "10px", "border": "1", "background-color":"rgba(0,0,0,1.0)"});
        $('.closemodal').css({"color": "#aaa", "float": "right", "font-size": "24px", "font-weight": "bold"})
            .on("mouseenter", function() { $(this).css({"color": "white", "cursor":"pointer"});})
            .on("mouseleave", function() { $(this).css({"color": "#aaa", "cursor":"none"});})
            .click(function() {document.querySelector('.modalcontent')?.remove();});
        $('#canceloptions').click(function() {document.querySelector('.modalcontent')?.remove();});
        $('#separatespecialcards').on('change', (evt)=> { $('#ignorespecialcards').prop("disabled", evt.target.checked);});
        $('#saveoptions').click(()=> {
            GM_setValue("ignorelevel2cards", $('#ignorelevel2cards').prop("checked"));
            GM_setValue("separatespecialcards", $('#separatespecialcards').prop("checked"));
            GM_setValue("ignorespecialcards", $('#ignorespecialcards').prop("checked"));
            GM_setValue("keeponeofcards", $('#keeponeofcards').prop("checked"));
            GM_setValue("highlevelpet", $('#highlevelpet').prop("checked"));
            GM_setValue("traderoundup", $('#traderoundup').val());
            GM_setValue("forumtemplate", $('#forumtemplate').val());
            GM_setValue("irctemplate", $('#irctemplate').val());
            if (debug) GM_setValue("userid", $('#useridtest').val());
            document.querySelector('.modalcontent')?.remove();
        });
    }

function countCards(inv, ignorelvl2=false, ignorespecial=false, separatespecial=false, keepone=false, highlevelpet=true, round=0.5) {
    let have = {};
    let have2 = {};
    let want = {};
    if (debug) {
        console.log("Inventory:");
        console.log(inv);
    }
    for(let cat in CARD_CATEGORIES) {
        if (!highlevelpet && CARD_CATEGORIES[cat]?.Type === "High Level Pet") continue; //skip High Level Pet if setting disabled
        for(let k in CARD_CATEGORIES[cat]?.L1) {
            const cid = CARD_CATEGORIES[cat].L1[k];
            const invItem = getItemId(inv, cid);
            if (invItem != null) {
                if (cat in have === false) have[cat] = {};
                if (cat in have2 === false) have2[cat] = {};
                have2[cat][cid] = have[cat][cid] = parseInt(invItem.amount) - (keepone ? 1:0);
            }
        }
        if (!ignorelvl2 && "L2" in CARD_CATEGORIES[cat]) {
            for(let k in CARD_CATEGORIES[cat]?.L2) {
                const id = CARD_CATEGORIES[cat].L2[k];
                const invItem = getItemId(inv, id);
                if (invItem != null) {
                    for (let l in CARD_CATEGORIES[cat][id]) {
                        const cid = CARD_CATEGORIES[cat][id][l];
                        if (cat in have2 === false) have2[cat] = {};
                        have2[cat][cid] = (have2[cat][cid] || 0) + parseInt(invItem.amount) - (keepone ? 1:0);
                    }
                }
            }
        }
        if ((!ignorespecial || separatespecial) && 'Special' in CARD_CATEGORIES[cat]) {
            for(let k in CARD_CATEGORIES[cat]?.Special) {
                let mycat = separatespecial ? cat+" Special" : cat;
                const id = CARD_CATEGORIES[cat].Special[k];
                const invItem = getItemId(inv, id);
                if (invItem != null) {
                    if (mycat in have === false) have[mycat] = {};
                    if (mycat in have2 === false) have2[mycat] = {};
                    have2[mycat][id] = have[mycat][id] = parseInt(invItem.amount) - (keepone ? 1:0);
                }
            }
        }
        if (cat in have2) {
            let wantAmount = roundUp(getSum(have2[cat])/CARD_CATEGORIES[cat].L1.length, round);
            if (debug) console.log(`${cat}: ${wantAmount} (${getSum(have2[cat])}/${CARD_CATEGORIES[cat].L1.length})`);
            for (let w in CARD_CATEGORIES[cat].L1) {
                const id = CARD_CATEGORIES[cat].L1[w];
                if ((have2[cat][id] || 0) < wantAmount) {
                    if (cat in want === false) want[cat] = {};
                    want[cat][id] = wantAmount - (have2[cat][id] || 0);
                    if (cat in have) delete have[cat][id];
                } else {
                    if (cat in have === false) have[cat] = {};
                    have[cat][id] = Math.min(have[cat][id] || 0, (have2[cat][id] - wantAmount));
                }
                if (cat in have && (!have[cat][id] || have[cat][id]<0)) delete have[cat][id];
            }
        }
        if (cat+" Special" in have2) {
            let mycat = cat+" Special";
            let wantAmount = roundUp(getSum(have2[mycat])/CARD_CATEGORIES[cat].Special.length, round);
            if (debug) console.log(`${mycat}: ${wantAmount} (${getSum(have2[mycat])}/${CARD_CATEGORIES[cat].Special.length})`);
            for (let w in CARD_CATEGORIES[cat].Special) {
                const id = CARD_CATEGORIES[cat].Special[w];
                if ((have2[mycat][id] || 0) < wantAmount) {
                    if (mycat in want === false) want[mycat] = {};
                    want[mycat][id] = wantAmount - (have2[mycat][id] || 0);
                    if (cat in have) delete have[mycat][id];
                } else {
                    if (cat in have === false) have[cat] = {};
                    have[mycat][id] = Math.min(have[mycat][id] || 0, (have2[mycat][id] - wantAmount));
                }
                if (cat in have && (!have[mycat][id] || have[mycat][id]<0)) delete have[mycat][id];
            }
        }
    }
    if (debug) {
        console.log("Have:");
        console.log(have2);
        console.log("Want:");
        console.log(want);
    }
    return [have, want];
}

function createPost(forum, have, want) {
    let post = "";
    let index = 0;
    for (let cat in have) {
        let havestr = forum ? "[HAVE]" : "";
        let maxWant = getSum(have[cat]);
        let maxHave = getSum(want[cat]);
        if (!maxWant || !maxHave) continue;
        if (Math.max(maxWant/maxHave, maxWant/(cat.endsWith("Special") ? CARD_CATEGORIES[cat.split(" ")[0]].Special.length : CARD_CATEGORIES[cat].L1.length))
            < min_have_want_ratio) continue; //skip if we don't have too many cards to offer
        for (let cid in have[cat]) {
            if (havestr.length>0) havestr+= forum ? "\n" : ", ";
            if (forum) havestr += Math.min(have[cat][cid], maxHave)+"x "+CARD_NAMES[cid];
            else havestr += CARD_NAMES[cid]+" x"+Math.min(have[cat][cid], maxHave);
        }
        let wantstr = forum ? "[WANT]" : "";
        if (havestr && (!forum || havestr.length>6)) {
            for (let cid in want[cat]) {
                if (wantstr.length>1) wantstr+= forum ? "\n" : ", ";
                if (forum) wantstr += Math.min(want[cat][cid], maxWant)+"x "+CARD_NAMES[cid];
                else wantstr += CARD_NAMES[cid]+" x"+Math.min(want[cat][cid], maxWant);
            }
            if (wantstr && (!forum || wantstr.length>6)) {
                if (post.length>0) post += forum ? "\n\n" : "\n";
                post += GM_getValue(forum?"forumtemplate":"irctemplate", forum?FORUM_TEMPLATE:IRC_TEMPLATE).replaceAll("_category_", cat) //`[H] ${havestr} [W] ${wantstr}`;
                    .replaceAll("_have_", havestr)
                    .replaceAll("_want_", wantstr);
            }
        }
    }
    return post;
}

async function getInventory(userid=null) {
    let url = "https://gazellegames.net/api.php?request=items&type=inventory";
    if (userid) url += "&userid="+userid;
    const header = {
        method: "POST",
        headers: {
            "X-API-Key": KEY
        }
    };
    try {
        const resp = await fetch(url, header);
        const data = await resp?.json();
        return data.response;
    } catch (err) {
        console.error(err);
    }
}

//return item from array (arr) that has itemid (id)
function getItemId(arr, id) {
    for(let k in arr) {
        if (arr[k]?.itemid === id) return arr[k];
    }
    return null;
}

//returns sum of all values in object (values must be addable)
function getSum(obj) {
    let sum=0;
    for (let key in obj) {
        sum += obj[key];
    }
    return sum;
}

//round up if decimal greater than up, else round down
function roundUp(num, up) {
    const dec = num % 1; //modulus 1 to get decimal portion of number
    if (dec >= up) return Math.ceil(num);
    return Math.floor(num);
}

async function getCardInformation() {
    let itemids = Array();
    for(let cat in CARD_CATEGORIES) { //Get all card ids in the list
        for(let subcat in CARD_CATEGORIES[cat]) {
            for(let id in CARD_CATEGORIES[cat][subcat]) {
                if (!itemids.includes(CARD_CATEGORIES[cat][subcat][id])) { //avoid duplicates
                    itemids.push(CARD_CATEGORIES[cat][subcat][id]);
                }
            }
        }
    }
    itemids.sort();
    console.log(itemids.length);
    const url="https://gazellegames.net/api.php?request=items&itemids="+JSON.stringify(itemids); //API search for itemids
    const header = {
        method: "POST",
        headers: {
            "X-API-Key": GM_getValue("API_KEY", KEY),
            "Content-Type": "application/json"
        }
    };
    fetch(url, header)
        .then((response)=> response.json())
        .then((data)=> {
        let s;
        console.log(data);
        for(let i=0; i<data.response.length; i++) {
            s+=`${data.response[i].id}: "${data.response[i].name}",\n`; //create object with id:name
        }
        console.log(s);
    });
}

function checkAPIKey() {
    if (KEY=="" || KEY==null) {
        if (GM_getValue("API_KEY")) {
            KEY = GM_getValue("API_KEY");
            return true;
        } else {
            const input = window.prompt(`Please input your GGn API key.
    If you don't have one, please generate one from your Edit Profile page: https://gazellegames.net/user.php?action=edit.
    The API key must have "items" permission.`);
                const trimmed = input.trim();
                if (/[a-f0-9]{64}/.test(trimmed)) {
                    GM_setValue("API_KEY", trimmed);
                    KEY = trimmed;
                    return true;
                }
                else {
                    console.log('API key entered is not valid. It must be 64 hex characters 0-9a-f.');
                    throw 'No API key found.';
                    //return false;
                }
            }
        }
    }

let oldPositionX,oldPositionY;
const move = (e) => {
    let modal = document.querySelector('.modalcontent');
    if (!document.body.matches(":active")) {
        window.removeEventListener("mousemove", move);
        return;
    }
    if (e.type === "touchmove") {
        modal.style.top = (e.touches[0].clientY-oldPositionY) + "px";
        modal.style.left = (e.touches[0].clientX-oldPositionX) + "px";
    } else {
        modal.style.top = (e.clientY-oldPositionY) + "px";
        modal.style.left = (e.clientX-oldPositionX) + "px";
    }
};
const mouseDown = (e) => {
    let modal = document.querySelector('.modalcontent');
    oldPositionY = e.clientY-modal.offsetTop;
    oldPositionX = e.clientX-modal.offsetLeft;
    if (e.type === "mousedown") {
        window.addEventListener("mousemove", move);
    } else {
        window.addEventListener("touchmove", move);
    }
};
const mouseUp = (e) => {
    if (e.type === "mouseup") {
        window.removeEventListener("mousemove", move);
    } else {
        window.removeEventListener("touchmove", move);
    }
};

const CARD_CATEGORIES = {
    "Staff": {
        "L1": [2357,2358,2359,2361,2364,2365,2366,2367,2368],
        "L2": [2369,2370,2371],
        "Special": [2388,2400,2410],
        "2369": [2357,2358,2359],
        "2370": [2364,2365,2366],
        "2371": [2361,2367,2368],
        "Type": "Pet"
    },
    "Portal": {
        "L1": [2373,2374,2375,2377,2378,2379,2381,2382,2383],
        "L2": [2376,2380,2384],
        "2376": [2373,2374,2375],
        "2380": [2377,2378,2379],
        "2384": [2381,2382,2383],
        "Type": "Pet"
    },
    "Mario": {
        "L1": [2390,2391,2392,2393,2394,2395,2396,2397,2398],
        "L2": [2401,2402,2403],
        "2401": [2390,2392,2393],
        "2402": [2391,2397,2394],
        "2403": [2395,2396,2398],
        "Type": "Pet"
    },
    "Halloween Pumpkin": {
        "L1": [2589,2590,2591],
        "L2": [2592,2593,2594],
        "2592": [2590,2591],
        "2593": [2589,2591],
        "2594": [2589,2590],
        "Type": "Halloween"
    },
    "Halloween Cupcake": {
        "L1": [2945,2946,2948,2949],
        "L2": [2947,2950],
        "2947": [2945,2946],
        "2950": [2948,2949],
        "Type": "Halloween"
    },
    "Halloween Ghost": {
        "L1": [3263,3265,3266,3267],
        "L2": [3268,3269],
        "3268": [3263,3265],
        "3269": [3266,3267],
        "Type": "Halloween"
    },
    "Pink Valentine": {
        "L1": [2986,2987,2989,2990],
        "L2": [2988,2991],
        "2988": [2986,2987],
        "2991": [2989,2990],
        "Type": "Valentine"
    },
    "Brown Valentine": {
        "L1": [2993,2994,2996,2997],
        "L2": [2995,2998],
        "2995": [2993,2994],
        "2998": [2996,2997],
        "Type": "Valentine"
    },
    "9th Birthday": {
        "L1": [2829,2830,2831],
        "L2": [2833,2834,2835],
        "2833": [2829,2831],
        "2834": [2829,2830],
        "2835": [2830,2831],
        "Type": "Birthday"
    },
    "10th Birthday": {
        "L1": [3023,3024,3026,3027],
        "L2": [3025,3028],
        "3025": [3023,3024],
        "3028": [3026,3027],
        "Type": "Birthday"
    },
    "Retro Birthday": {
        "L1": [3151,3152,3153,3155,3156,3157,3159,3160,3161],
        "L2": [3154,3158,3162],
        "3154": [3151,3152,3153],
        "3158": [3155,3156,3157],
        "3162": [3159,3160,3161],
        "Type": "Birthday"
    },
    "Christmas 2018": {
        "L1": [2698,2699,2700],
        "L2": [2701,2702,2703],
        "2701": [2698,2700],
        "2702": [2698,2699],
        "2703": [2699,2700],
        "Type": "Christmas"
    },
    "Christmas Gingerbread": {
        "L1": [2969,2970,2973,2974],
        "L2": [2972,2975],
        "2972": [2969,2970],
        "2975": [2973,2974],
        "Type": "Christmas"
    },
    "Christmas 2020": {
        "L1": [3105,3106,3108,3109],
        "L2": [3107,3110],
        "3107": [3105,3106],
        "3110": [3108,3109],
        "Type": "Christmas"
    },
    "Christmas 2021": {
        "L1": [3328,3329,3330,3331,3332,3333,3334,3335,3336],
        "L2": [3338,3339,3340],
        "3338": [3331,3332,3333],
        "3339": [3330,3335,3336],
        "3340": [3328,3329,3334],
        "Type": "Christmas"
    },
    "Dragon": {
        "L1": [2595,2704,2836,2951,2976,3029],
        "Type": "High Level Pet"
    }
};

const CARD_NAMES = {
    2357: "The Golden Daedy",
    2358: "A Wild Artifaxx",
    2359: "A Red Hot Flamed",
    2361: "Alpaca Out of Nowhere!",
    2364: "thewhale\'s Kiss",
    2365: "Stump\'s Banhammer",
    2366: "Neo's Ratio Cheats",
    2367: "Niko's Transformation",
    2368: "lepik le prick",
    2369: "The Golden Throne",
    2370: "The Biggest Banhammer",
    2371: "The Staff Beauty Parlor",
    2373: "Cake",
    2374: "GLaDOS",
    2375: "Companion Cube",
    2376: "Portal Gun",
    2377: "A Scared Morty",
    2378: "Rick Sanchez",
    2379: "Mr. Poopy Butthole",
    2380: "Rick's Portal Gun",
    2381: "Nyx class Supercarrier",
    2382: "Chimera Schematic",
    2383: "Covetor Mining Ship",
    2384: "Space Wormhole",
    2388: "MuffledSilence\'s Headphones",
    2390: "Mario",
    2391: "Luigi",
    2392: "Princess Peach",
    2393: "Toad",
    2394: "Yoshi",
    2395: "Bowser",
    2396: "Goomba",
    2397: "Koopa Troopa",
    2398: "Wario",
    2400: "LinkinsRepeater Bone Hard Card",
    2401: "Super Mushroom",
    2402: "Fire Flower",
    2403: "Penguin Suit",
    2410: "Zé do Caixão Coffin Joe Card",
    2589: "Ripe Pumpkin",
    2590: "Rotting Pumpkin",
    2591: "Carved Pumpkin",
    2592: "Stormrage Pumpkin",
    2593: "Russian Pumpkin",
    2594: "Green Mario Pumpkin",
    2595: "Lame Pumpkin Trio",
    2698: "Perfect Snowball",
    2699: "Mistletoe",
    2700: "Santa Suit",
    2701: "Abominable Santa",
    2702: "Icy Kisses",
    2703: "Sexy Santa",
    2704: "Christmas Cheer",
    2829: "Ripped Gazelle",
    2830: "Fancy Gazelle",
    2831: "Gamer Gazelle",
    2833: "Future Gazelle",
    2834: "Alien Gazelle",
    2835: "Lucky Gazelle",
    2836: "Supreme Gazelle",
    2945: "Bloody Mario",
    2946: "Mommy's Recipe",
    2947: "Memory Boost",
    2948: "Link was here!",
    2949: "Gohma Sees You",
    2950: "Skultilla the Cake Guard",
    2951: "Who eats whom?",
    2969: "Gingerbread Kitana",
    2970: "Gingerbread Marston",
    2972: "Gingerbread Doomslayer",
    2973: "Millenium Falcon Gingerbread",
    2974: "Gingerbread AT Walker",
    2975: "Mario Christmas",
    2976: "Baby Yoda with Gingerbread",
    2986: "Sonic and Amy",
    2987: "Yoshi and Birdo",
    2988: "Kirlia and Meloetta",
    2989: "Aerith and Cloud",
    2990: "Master Chief and Cortana",
    2991: "Dom and Maria",
    2993: "Chainsaw Chess",
    2994: "Chainsaw Wizard",
    2995: "Angelise Reiter",
    2996: "Ivy Valentine",
    2997: "Jill Valentine",
    2998: "Sophitia",
    3023: "Exodus Truce",
    3024: "Gazelle Breaking Bad",
    3025: "A Fair Fight",
    3026: "Home Sweet Home",
    3027: "Birthday Battle Kart",
    3028: "What an Adventure",
    3029: "After Party",
    3105: "Cyberpunk 2077",
    3106: "Watch Dogs Legion",
    3107: "Dirt 5",
    3108: "Genshin Impact",
    3109: "Animal Crossing",
    3110: "Gazelle",
    3151: "Bill Rizer",
    3152: "Donkey Kong",
    3153: "Duck Hunt Dog",
    3154: "Dr. Mario",
    3155: "Pit",
    3156: "Little Mac",
    3157: "Mega Man",
    3158: "Link",
    3159: "Pac-Man",
    3160: "Samus Aran",
    3161: "Simon Belmont",
    3162: "Kirby",
    3263: "Blinky",
    3265: "Clyde",
    3266: "Pinky",
    3267: "Inky",
    3268: "Ghostbusters",
    3269: "Boo",
    3328: "Santa Claus Is Out There",
    3329: "Back to the Future",
    3330: "Big Lebowski",
    3331: "Picard",
    3332: "Braveheart",
    3333: "Indy",
    3334: "Gremlins",
    3335: "Die Hard",
    3336: "Jurassic Park",
    3338: "Mando",
    3339: "Doomguy ",
    3340: "Grievous"
};