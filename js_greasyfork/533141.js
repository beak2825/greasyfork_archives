// ==UserScript==
// @name         Heasley's Egg Navigator - Remove Reset
// @namespace    egg.traverse
// @version      1.4.2.2
// @description  Traverse every page in Torn in search for eggs
// @author       Heasleys4hemp [1468764]
// @match        https://www.torn.com/*
// @grant        GM.addStyle
// @grant        GM.registerMenuCommand
// @run-at       document-start
// @license      MIT
// @require      https://www.torn.com/js/script/lib/jquery-1.8.2.js
// @downloadURL https://update.greasyfork.org/scripts/533141/Heasley%27s%20Egg%20Navigator%20-%20Remove%20Reset.user.js
// @updateURL https://update.greasyfork.org/scripts/533141/Heasley%27s%20Egg%20Navigator%20-%20Remove%20Reset.meta.js
// ==/UserScript==
'use strict';
var ButtonFloat = parseInt(localStorage.getItem('eeh-float')) || 0;
var ButtonFloatPos = parseInt(localStorage.getItem('eeh-float-pos')) || 0; //0 - bottom ; 1 - top
var linkIndex = localStorage.getItem('eeh-index') || 0;
var pressTimer;

if (typeof GM == 'undefined') {
    window.GM = {};
}

if (typeof GM.addStyle == "undefined") { //Add GM.addStyle for browsers that do not support it (e.g. TornPDA, Firefox+Greasemonkey)
    GM.addStyle = function (aCss) {
        'use strict';
        let head = document.getElementsByTagName('head')[0];
        if (head) {
            let style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.textContent = aCss;
            head.appendChild(style);
            return style;
        }
        return null;
    };
}

if (typeof GM.registerMenuCommand != "undefined") {
    GM.registerMenuCommand('Toggle Floating Button', toggleFloatButton,
                           {
        autoClose: false
    }
    );

    GM.registerMenuCommand('Toggle Float Position', toggleFloatPosition,
                           {
        autoClose: false
    }
    );
}

const easteregg_svg = `<svg xmlns="http://www.w3.org/2000/svg" fill="#AFC372" stroke="transparent" stroke-width="0" width="13" height="17" viewBox="0 0 14 18"><path d="M1.68,16a5.6,5.6,0,0,0,.43.41A5.72,5.72,0,0,0,3,17a4.73,4.73,0,0,0,.74.39,5.08,5.08,0,0,0,.8.3,5.35,5.35,0,0,0,.69.17,8.62,8.62,0,0,0,.87.11h.84a8.46,8.46,0,0,0,.88-.11l.69-.17a7.14,7.14,0,0,0,.81-.31q.38-.18.72-.39a6.57,6.57,0,0,0,.9-.67,5.14,5.14,0,0,0,.41-.4A6.3,6.3,0,0,0,13,11.67a8.86,8.86,0,0,0-.09-1.21c0-.31-.1-.64-.17-1s-.2-.85-.33-1.29-.3-.93-.48-1.39-.33-.81-.51-1.2c-.1-.2-.19-.39-.29-.58L11,4.72c-.18-.33-.4-.69-.64-1s-.4-.55-.62-.82A4.41,4.41,0,0,0,6.5,1,4.41,4.41,0,0,0,3.29,2.86a9.15,9.15,0,0,0-.61.82c-.24.34-.44.68-.62,1L1.87,5l-.33.66c-.16.36-.32.72-.46,1.09S.74,7.7.61,8.16a13.14,13.14,0,0,0-.34,1.3,10,10,0,0,0-.18,1A8.47,8.47,0,0,0,0,11.67a6.29,6.29,0,0,0,.89,3.25A6.63,6.63,0,0,0,1.68,16ZM1.27,14.8a.7.7,0,0,1,.4.38,1.4,1.4,0,0,1,.09.29A6.38,6.38,0,0,1,1.27,14.8Zm1,1.15c.17-.14.46,0,.66.32a1.41,1.41,0,0,1,.14.31A5.55,5.55,0,0,1,2.22,16Zm1.41,1a.44.44,0,0,1,.2-.39c.22-.11.52.1.67.46a1.28,1.28,0,0,1,.09.32A6.22,6.22,0,0,1,3.63,16.94Zm1.58.55a.47.47,0,0,1,.27-.4c.22-.06.46.16.57.51A7.4,7.4,0,0,1,5.21,17.49ZM7,17.6c.11-.35.35-.57.57-.51a.49.49,0,0,1,.27.39A5.66,5.66,0,0,1,7,17.6Zm1.46-.28A1.18,1.18,0,0,1,8.52,17c.16-.36.46-.57.67-.46a.43.43,0,0,1,.2.38A7.27,7.27,0,0,1,8.44,17.32ZM10,16.56a.84.84,0,0,1,.13-.29c.19-.31.47-.44.65-.33A7.57,7.57,0,0,1,10,16.56Zm1.26-1.14a.75.75,0,0,1,.08-.24.72.72,0,0,1,.36-.37A6.76,6.76,0,0,1,11.28,15.42Zm1.06-6q.11.51.18,1a.73.73,0,0,1-.37-.4A.44.44,0,0,1,12.34,9.45ZM10.49,4.67l.3.54c.11.2.21.41.31.63a.85.85,0,0,1-.65-.4C10.24,5.12,10.26,4.78,10.49,4.67Zm-.41,2.2c-.25.09-.58-.12-.74-.46s-.09-.68.16-.76a.69.69,0,0,1,.74.46C10.4,6.45,10.33,6.79,10.08,6.87ZM7.22,1.49a3.3,3.3,0,0,1,1,.51.5.5,0,0,1-.14.59.68.68,0,0,1-.86-.28A.61.61,0,0,1,7.22,1.49Zm-2.39.45a3.34,3.34,0,0,1,1-.46.6.6,0,0,1,0,.83A.66.66,0,0,1,5,2.59.53.53,0,0,1,4.83,1.94ZM3.58,3.12a4.75,4.75,0,0,0,2.91.93A4.7,4.7,0,0,0,9.42,3.1c.24.3.47.62.68.92A4.5,4.5,0,0,1,6.49,5.39,4.46,4.46,0,0,1,2.9,4,9.35,9.35,0,0,1,3.58,3.12ZM7.93,7.54c-.29,0-.57-.25-.64-.64a.59.59,0,0,1,.38-.76c.29,0,.57.25.64.63S8.21,7.5,7.93,7.54Zm-2-.64c-.07.39-.36.67-.65.64s-.45-.38-.38-.77.36-.67.64-.63A.6.6,0,0,1,5.9,6.9Zm-3-.79a.69.69,0,0,1,.74-.46c.25.08.32.42.16.76s-.49.55-.74.46S2.78,6.45,2.94,6.11Zm-.73-.9c.08-.16.18-.33.28-.51.17.14.17.45,0,.74a.89.89,0,0,1-.57.39C2,5.62,2.1,5.41,2.21,5.21ZM1.38,7.08A7.89,7.89,0,0,0,6.52,8.7a7.91,7.91,0,0,0,5.11-1.6c.19.5.36,1,.5,1.52-1,1.2-3.11,2-5.61,2S1.83,9.8.88,8.58C1,8.09,1.19,7.58,1.38,7.08ZM11.55,11.5A.59.59,0,0,1,11,11a.46.46,0,0,1,.4-.57.59.59,0,0,1,.56.52A.47.47,0,0,1,11.55,11.5Zm-1.68.85a.6.6,0,0,1-.59-.5.45.45,0,0,1,.36-.59.62.62,0,0,1,.59.51A.45.45,0,0,1,9.87,12.35Zm-1.77,0a.56.56,0,0,1-.53.57.57.57,0,0,1-.51-.6.52.52,0,1,1,1,0Zm-2,0a.56.56,0,0,1-.5.6.59.59,0,0,1,0-1.17A.55.55,0,0,1,6.06,12.27Zm-2.21-.42a.61.61,0,0,1-.59.5.45.45,0,0,1-.36-.58.6.6,0,0,1,.59-.51A.46.46,0,0,1,3.85,11.85ZM2.13,11a.58.58,0,0,1-.56.52.46.46,0,0,1-.39-.57.59.59,0,0,1,.56-.52A.46.46,0,0,1,2.13,11ZM.65,9.48A.46.46,0,0,1,.78,10a.69.69,0,0,1-.29.36C.53,10.11.59,9.8.65,9.48ZM.38,11.67a4.84,4.84,0,0,1,0-.53c.74,1.68,3.19,3,6.1,3s5.33-1.32,6.09-3c0,.17,0,.35,0,.51a5.86,5.86,0,0,1-.39,2.11C11.21,15.09,9,16,6.51,16S1.75,15.06.75,13.73A5.84,5.84,0,0,1,.38,11.67Z"></path></svg>`;
const EVERY_LINK = ["", "index.php","forums.php#/p=threads&f=67&t=16326854&b=0&a=0","city.php","jobs.php","gym.php","properties.php","page.php?sid=education",
                    "crimes.php","loader.php?sid=missions","newspaper.php","jailview.php","hospitalview.php",
                    "casino.php","page.php?sid=hof","factions.php","competition.php","page.php?sid=list&type=friends",
                    "page.php?sid=list&type=enemies", "page.php?sid=list&type=targets","messages.php","page.php?sid=events","awards.php","points.php","rules.php",
                    "staff.php","credits.php","citystats.php","committee.php","bank.php","donator.php","item.php",
                    "page.php?sid=stocks","fans.php","museum.php","loader.php?sid=racing","church.php",
                    "dump.php","loan.php","page.php?sid=travel","amarket.php","bigalgunshop.php","shops.php?step=bitsnbobs",
                    "shops.php?step=cyberforce","shops.php?step=docks","shops.php?step=jewelry",
                    "shops.php?step=nikeh","shops.php?step=pawnshop","shops.php?step=pharmacy","pmarket.php",
                    "shops.php?step=postoffice","shops.php?step=super","shops.php?step=candy",
                    "shops.php?step=clothes","shops.php?step=recyclingcenter","shops.php?step=printstore","page.php?sid=ItemMarket","estateagents.php","bazaar.php?userId=1",
                    "calendar.php","token_shop.php","freebies.php","bringafriend.php","comics.php","archives.php","joblist.php",
                    "newspaper_class.php","personals.php","newspaper.php#/archive",
                    "profiles.php?XID=1",
                    "bounties.php","usersonline.php","joblist.php?step=search#!p=corpinfo&ID=79286","page.php?sid=log","page.php?sid=ammo","playerreport.php",
                    "loader.php?sid=itemsMods","displaycase.php","trade.php",
                    "crimes.php?step=criminalrecords","page.php?sid=factionWarfare#/dirty-bombs",
                    "index.php?page=fortune","page.php?sid=bunker","church.php?step=proposals",
                    "messageinc.php","preferences.php","messageinc2.php#!p=main","page.php?sid=gallery&XID=1","personalstats.php?ID=1",
                    "properties.php?step=rentalmarket","properties.php?step=sellingmarket","forums.php",
                    "page.php?sid=slots",
                    "page.php?sid=roulette","page.php?sid=highlow","page.php?sid=keno","page.php?sid=craps",
                    "page.php?sid=bookie","page.php?sid=lottery","page.php?sid=blackjack",
                    "page.php?sid=holdem","page.php?sid=russianRoulette","page.php?sid=spinTheWheel",
                    "page.php?sid=spinTheWheelLastSpins","page.php?sid=slotsStats",
                    "page.php?sid=slotsLastRolls","page.php?sid=rouletteStatistics","page.php?sid=rouletteLastSpins",
                    "page.php?sid=highlowStats","page.php?sid=highlowLastGames",
                    "page.php?sid=kenoStatistics","page.php?sid=kenoLastGames","page.php?sid=crapsStats",
                    "page.php?sid=crapsLastRolls","page.php?sid=bookie#/stats/","page.php?sid=lotteryTicketsBought",
                    "page.php?sid=lotteryPreviousWinners","page.php?sid=blackjackStatistics",
                    "page.php?sid=blackjackLastGames","page.php?sid=holdemStats",
                    "loader.php?sid=viewRussianRouletteLastGames","loader.php?sid=viewRussianRouletteStats",
                    "messageinc2.php#!p=viewall","bazaar.php#/add",
                    "bazaar.php#/personalize","factions.php?step=your#/tab=crimes",
                    "factions.php?step=your#/tab=rank","page.php?sid=events#onlySaved=true",
                    "factions.php?step=your#/tab=controls","factions.php?step=your#/tab=info","messages.php#/p=ignorelist",
                    "messages.php#/p=outbox","factions.php?step=your#/tab=upgrades",
                    "messages.php#/p=saved","messages.php#/p=compose","displaycase.php#add","displaycase.php#manage",
                    "factions.php?step=your#/tab=armoury","bazaar.php#/manage","companies.php",
                    "itemuseparcel.php","index.php?page=rehab","index.php?page=people","christmas_town.php",
                    "christmas_town.php#/mymaps","christmas_town.php#/parametereditor","christmas_town.php#/npceditor",
                    "page.php?sid=UserList","index.php?page=hunting","old_forums.php","donatordone.php","revive.php","pc.php",
                    "loader.php?sid=attackLog","loader.php?sid=attack&user2ID=1","loader.php?sid=crimes","loader.php?sid=crimes#/searchforcash",
                    "loader.php?sid=crimes#/bootlegging","loader.php?sid=crimes#/graffiti","loader.php?sid=crimes#/shoplifting",
                    "loader.php?sid=crimes#/pickpocketing","loader.php?sid=crimes#/cardskimming","loader.php?sid=crimes#/burglary","loader.php?sid=crimes#/hustling",
                    "loader.php?sid=crimes#/disposal","loader.php?sid=crimes#/cracking","loader.php?sid=crimes#/forgery","loader.php?sid=crimes#/scamming",
                    "/war.php?step=rankreport&rankID=69","/war.php?step=warreport&warID=420","/war.php?step=raidreport&raidID=69",
                    "/war.php?step=chainreport&chainID=69420",
                    "loader.php?sid=slots" ,"loader.php?sid=slotsLastRolls" ,"loader.php?sid=viewSlotsStats" ,"loader.php?sid=roulette" ,"loader.php?sid=rouletteLastSpins" ,"loader.php?sid=rouletteStatistics" ,"loader.php?sid=highlow" ,"loader.php?sid=viewHighLowLastGames" ,"loader.php?sid=viewHighLowStats" ,"loader.php?sid=keno" ,"loader.php?sid=craps" ,"loader.php?sid=crapsLastRolls" ,"loader.php?sid=crapsLastRolls" ,"loader.php?sid=viewCrapsStats" ,"loader.php?sid=lottery" ,"loader.php?sid=viewLotteryUserStats" ,"loader.php?sid=viewLotteryStats" ,"loader.php?sid=blackjack" ,"loader.php?sid=viewBlackjackLastGames" ,"loader.php?sid=viewBlackjackStats",
                    "page.php?sid=crimes2","authenticate.php","newspaper.php#/tell_your_story","archives.php#/TheBirthOfTorn","profiles.php?XID=4","bazaar.php?userId=4#/","displaycase.php#display/4","profiles.php?XID=15","bazaar.php?userId=15#/","displaycase.php#display/15","profiles.php?XID=19","bazaar.php?userId=19#/","profiles.php?XID=20","bazaar.php?userId=20#/","profiles.php?XID=21","bazaar.php?userId=21#/","profiles.php?XID=10","bazaar.php?userId=10#/","displaycase.php#display/10","profiles.php?XID=17","profiles.php?XID=23","bazaar.php?userId=23#/","profiles.php?XID=50","bazaar.php?userId=50#/","profiles.php?XID=7","bazaar.php?userId=7#/","displaycase.php#display/7","profiles.php?XID=3","profiles.php?XID=104","profiles.php?XID=102","profiles.php?XID=103","profiles.php?XID=100","profiles.php?XID=101","profiles.php?XID=9","profiles.php?XID=8","factions.php?step=your&type=5#/tab=territory","page.php?sid=factionWarfare#/ranked","page.php?sid=factionWarfare#/territory","page.php?sid=factionWarfare#/raids","page.php?sid=factionWarfare#/chains","staff.php#/p=help.app","displaycase.php#display/1","forums.php#/p=forums&f=62&b=0&a=0","displaycase.php#display/50"];

const eeeh_observer = new MutationObserver(function(mutations) {
    const url = window.location.href;
    if (url.includes("forums.php") && url.includes("f=67&t=16326854&b=0&a=0") && $('li.parent-post[data-id="23383506"]').length) {
    if (!document.getElementsByClassName("eeh-options").length) {
            insertOptions();
        }
    }
    if (document.getElementById("eggTraverse")) {
        return;
    }

    if (ButtonFloat) {
        if (document.getElementsByTagName('body')[0]) {
            insertFloat();
            return;
        }
    } else {
        // Insert into sidebar
        if (document.querySelector('#sidebar > div:first-of-type')) {
            insertNormal(); // Insert normal sidebar version
            return;
        }
    }
});


eeeh_observer.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});


function insertNormal() {
    console.log("[Heasley][Egg Navigator] Inserting to sidebar...");
    if (!document.getElementById("eggTraverse")) {
        let href = EVERY_LINK[linkIndex];

        let easterspans = `
            <div class="eeh-link"><a href="${href}" id="eggTraverse"><span class="eeh-icon">${easteregg_svg}</span><span class="eeh-name">Egg Navigator (${linkIndex})</span></a></div>
            `;

        const sidebar = document.getElementById('sidebar');
        if (sidebar.firstChild) {
            // Insert the easterspans HTML string after the first child element of sidebar
            $('#sidebar > *').first().after(easterspans);
            $('#eggTraverse').on('mouseup touchend', function(e){
                clearTimeout(pressTimer);
            }).on('mousedown touchstart', function(e) {
                pressTimer = window.setTimeout(function() {
                    return true;
                    linkIndex = 0;
                    localStorage.setItem("eeh-index", linkIndex);
                    $('#eggTraverse').attr('href', EVERY_LINK[0]);
                    $('#eggTraverse .eeh-name').text('Egg Navigator (0)');
                },2500);
                return true;
            }).contextmenu(function(e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                return false;
            }).on('click', function(e) {
                linkIndex++;
                if (linkIndex >= EVERY_LINK.length) linkIndex = 0;
                localStorage.setItem("eeh-index", linkIndex);
                $('#eggTraverse').attr('href', EVERY_LINK[linkIndex]);
                $('#eggTraverse .eeh-name').text(`Egg Navigator (${linkIndex})`);
                return true;
            })



        }
        insertStyle();
    }
}

function insertFloat() {
    console.log("[Heasley][Egg Navigator] Inserting floating button...");
    if (!document.getElementById("eggTraverse")) {
        let href = EVERY_LINK[linkIndex];
        const eeh_float = `<a href="${href}" id="eggTraverse" class="eeh-float"><span class="eeh-icon">${easteregg_svg}</span><span class="eeh-name"> #${linkIndex}</span></a>`;

        $('body').append(eeh_float);


        if (ButtonFloatPos) {
            document.querySelector("#eggTraverse.eeh-float").classList.toggle("eeh-float-top");
        } else {
            document.querySelector("#eggTraverse.eeh-float").classList.toggle("eeh-float-bottom");
        }


        $('#eggTraverse').on('mouseup touchend', function(e){
            clearTimeout(pressTimer);
        }).on('mousedown touchstart', function(e) {
            pressTimer = window.setTimeout(function() {
                linkIndex = 0;
                localStorage.setItem("eeh-index", linkIndex);
                $('#eggTraverse').attr('href', EVERY_LINK[0]);
                $('#eggTraverse .eeh-name').text(' #0');
            },2500);
            return true;
        }).contextmenu(function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            return false;
        }).on('click', function(e) {
            linkIndex++;
            if (linkIndex >= EVERY_LINK.length) linkIndex = 0;
            localStorage.setItem("eeh-index", linkIndex);
            $('#eggTraverse').attr('href', EVERY_LINK[linkIndex]);
            $('#eggTraverse .eeh-name').text(` #${linkIndex}`);
            return true;
        });
        insertStyle();
    }
}

function insertOptions() {
    console.log("[Heasley][Egg Navigator] Inserting options...");
    if (!document.getElementsByClassName("eeh-options").length) {
        const post = $('li.parent-post[data-id="23383506"]').find('div.post-container div.post');
        let enabled_float = ButtonFloat ? "enabled" : "disabled";
        let enabledClass_float = ButtonFloat ? "eeh-green" : "eeh-red";

        let enabled_float_pos = ButtonFloatPos ? "top" : "bottom";

        post.before(`
    <div class="eeh-options"><button id="eeh-float-toggle">Toggle floating button</button>
    <p>Floating button: <span id="eeh-float-toggle-label" class="${enabledClass_float}">${enabled_float}</span></p>
    </div>
    <div class="eeh-options"><button id="eeh-float-pos-toggle">Toggle float position</button>
    <p>Float position: <span id="eeh-float-pos-toggle-label">${enabled_float_pos}</span></p>
    </div>
    `);
        $('#eeh-float-toggle').click(function() {
            if (toggleFloatButton()) {
                $('#eeh-float-toggle-label').text("enabled");
            } else {
                $('#eeh-float-toggle-label').text("disabled");
            }
            $('#eeh-float-toggle-label').toggleClass('eeh-green eeh-red');
        });

        $('#eeh-float-pos-toggle').click(function() {
            if (toggleFloatPosition()) {
                $('#eeh-float-pos-toggle-label').text("top"); //1
            } else {
                $('#eeh-float-pos-toggle-label').text("bottom"); //0
            }
        });
    }
}

function insertStyle() {
    GM.addStyle(`
.eeh-link {
  background-color: var(--default-bg-panel-color);
  cursor: pointer;
  overflow: hidden;
  vertical-align: top;
  border-bottom-right-radius: 5px;
  border-top-right-radius: 5px;
  margin-top: 2px;
  height: 23px;
  margin-bottom: 2px;
}

.eeh-link:hover {
  background-color: var(--default-bg-panel-active-color);
}

.eeh-link a {
  display: flex;
  -ms-align-items: center;
  align-items: center;
  color: var(--default-color);
  text-decoration: none;
  height: 100%;
}

.eeh-link a .eeh-icon {
  float: left;
  width: 34px;
  height: 23px;
  display: flex;
  -ms-align-items: center;
  align-items: center;
  justify-content: center;
  margin-left: 0;
}

.eeh-link a .eeh-icon {
  stroke: transparent;
  stroke-width: 0;
}

.eeh-link a .eeh-name {
  line-height: 22px;
  padding-top: 1px;
  overflow: hidden;
  max-width: 134px;
}

.eeh-float .eeh-name {
  margin-left: 5px;
}

.eeh-float .eeh-icon svg {
  width: 20px !important;
  height: 26px !important;
}

#eggTraverse.eeh-float {
    z-index: 999999;
    height: 40px;
    width: 80px;
    cursor: pointer;
    left: -10px;
    padding: 10px 15px 10px 15px;
    box-sizing: border-box;
    border: 1px solid var(--default-panel-divider-outer-side-color);
    position: fixed;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-shadow: var(--default-tabs-text-shadow);
    background: var(--info-msg-bg-gradient);
    box-shadow: var(--default-tabs-box-shadow);
    border-radius: 5px;
    overflow: hidden;
    font-size: 15px;
    font-weight: 700;
    line-height: 18px;
    font-family: arial;
    color: var(--default-color);
    text-decoration: none;
}

#eggTraverse.eeh-float.eeh-float-top {
    top: 80px;
}

#eggTraverse.eeh-float.eeh-float-bottom {
    bottom: 80px;
}

[class*='topSection_'] .eeh-icon-svg-wrap {
    position: absolute;
    -ms-transform: translate(-120%, 10%);
    transform: translate(-120%, 10%);
}

.content-wrapper > #easterrandom .eeh-icon-svg-wrap {
    position: absolute;
    -ms-transform: translate(-140%, 10%);
    transform: translate(-140%, 10%);
}

.eeh-options {
    margin: 20px;
    margin-left: 0px;
}

.eeh-options p {
    margin-top: 5px;
    margin-left: 2px;
    font-size: 15px;
    font-weight: 700;
    line-height: 18px;
    font-family: arial;
}

.eeh-options button {
    background: transparent linear-gradient(180deg ,#CCCCCC 0%,#999999 60%,#666666 100%) 0 0 no-repeat;
    border-radius: 5px;
    font-family: Arial,sans-serif;
    font-size: 14px;
    font-weight: 700;
    text-align: center;
    letter-spacing: 0;
    color: #333;
    text-shadow: 0 1px 0 #ffffff66;
    text-decoration: none;
    text-transform: uppercase;
    margin: 0;
    border: none;
    outline: none;
    overflow: visible;
    box-sizing: border-box;
    line-height: 16px;
    padding: 4px 8px;
    height: auto;
    white-space: nowrap;
    cursor: pointer;
    margin-right: 5px;
}

.eeh-green {
    color: var(--user-status-green-color);
}

.eeh-red {
    color: var(--user-status-red-color);
}


@media screen and (max-width: 1000px) {
    html:not(.html-manual-desktop) [class*='topSection_'] #easterrandom span.eeh-text, .content-wrapper > #easterrandom span.eeh-text {
        display: none;
    }

    [class*='topSection_'] .eeh-icon-svg-wrap {
        -ms-transform: translate(-140%, -110%);
        transform: translate(-140%, -110%);
    }

    html:not(.html-manual-desktop) #eggTraverse.eeh-float.eeh-float-top {
        top: 170px !important;
    }
}

/* SVG Colors */
.eeh-link svg, .eeh-icon-svg svg {
  filter: drop-shadow(0px 0.7px 0.1px #fff);
  width: 13px !important;
  height: 17px !important;
}
.eeh-icon-svg svg path {
  fill: #AFC372 !important;
}
body.dark-mode .eeh-icon svg, body.dark-mode .eeh-icon-svg svg {
  filter: drop-shadow(0px 0px 1.3px #000);
}

/* Torn Edits */
.members-cont>.member-item>a[href="profiles.php?XID=1468764"]>.member>.member-header {
    color: #E0CE00 !important;
}

.members-cont>.member-item>a[href="profiles.php?XID=1468764"]>.member>.member-cont>span::after {
    content: "👑  " url("https://profileimages.torn.com/ad324318-744c-c686-1468764.gif?v=1940629196397");
}
`);
}

function killButton() {
    console.log("[Heasley][Egg Navigator] Killing button...");
    let eeh_button = document.getElementById("eggTraverse");
    if (eeh_button) {
        let parent = eeh_button.closest(`.eeh-link`);
        if (parent) {
            parent.remove();
        } else {
            eeh_button.remove();
        }
    }
}

function toggleFloatButton() {
    killButton();
    if (ButtonFloat) {
        ButtonFloat = 0;
        insertNormal();
    } else {
        ButtonFloat = 1;
        insertFloat();
    }
    localStorage.setItem("eeh-float", ButtonFloat);
    return ButtonFloat;
}

function toggleFloatPosition() {
    console.log("[Heasley][Egg Navigator] Changing float position...");
    if (ButtonFloatPos) {
        ButtonFloatPos = 0;
    } else {
        ButtonFloatPos = 1;
    }
    document.querySelector("#eggTraverse.eeh-float").classList.toggle("eeh-float-top");
    document.querySelector("#eggTraverse.eeh-float").classList.toggle("eeh-float-bottom");
    
    localStorage.setItem("eeh-float-pos", ButtonFloatPos);
    console.log(ButtonFloatPos)
    return ButtonFloatPos;
}