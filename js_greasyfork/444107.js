// ==UserScript==
// @name         MoxxiMod 8
// @namespace    https://studiomoxxi.com/
// @description  one click at a time
// @author       Ben
// @match        *.outwar.com/*
// @version      40
// @grant        GM_xmlhttpRequest
// @license      MIT
// @run-at       document-start
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_xmlhttpRequest
// @grant        GM_addValueChangeListener
// @grant        unsafeWindow
// @require      http://code.jquery.com/jquery-3.6.0.min.js
// @require      https://torax.outwar.com/ajax.js
// @require      https://torax.outwar.com/drag.js
// @downloadURL https://update.greasyfork.org/scripts/444107/MoxxiMod%208.user.js
// @updateURL https://update.greasyfork.org/scripts/444107/MoxxiMod%208.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

const url = document.URL;


if (
    url.match("mob.php") ||
    url.match("mob_talk") ||
    url.match("rampidgaming.outwar") ||
    url.match(/attack\/[0-9]+/i)
){
    return
};

if (window.self !== window.top) { return; }


loadCustomTheme();


(function patchInnerHTMLGetter() {
    const descriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
    Object.defineProperty(Element.prototype, 'innerHTML', {
        get: function () {
            const value = descriptor.get.call(this);
            if (typeof value === 'string' && value.includes('&lt;') && value.includes('&gt;')) {
                const txt = document.createElement('textarea');
                txt.innerHTML = value;
                return txt.value;
            }
            return value;
        },
        set: function (v) {
            return descriptor.set.call(this, v);
        },
        configurable: true
    });
})();



if (url.match("outwar")) {

    GM_addStyle (`
    body > center > div.sub-header-container{display:none;z-index:9999;}
    body > center > div.header-container.fixed-top{display:none;}
    body > center > div.sub-header-container2{display:none;}
    body > center > div.sub-header-container > header{height:46px;box-shadow:0 5px 5px 0 rgba(0,0,0,1) !important;}
    #accordionExample{display:none;}
    body > center > div.sub-header-container{top:0px}
    #container{position:relative;top:-70px}
    #sidebar ul.menu-categories.ps{border-right:0px !important;top:-90px;z-index:100;}
    body > center > div.sub-header-container > header > ul.navbar-nav.flex-row.mr-auto.toolbar-nav > li:nth-child(1) > div > span{width:150px !important;}
    span.toolbarSpan{margin-left:7px;vertical-align:middle;cursor:pointer;}
    .form-control-new{display:inline-block;border: 1px solid #1b2e4b;color:#e6e6e6;letter-spacing:1px;padding-left:10px;padding-right:10px;background:#1b2e4b;font-size:18px;box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);border-radius:5px;transition: .5s ease-out;}
    .form-control-new:hover{opacity:0.5;}
    .navbar{min-height: 0px !important;}
    @keyframes gradientScroll {
        0% {background-position: 0% 50%;}
        50% {background-position: 100% 50%;}
        100% {background-position: 0% 50%;}
    }
    .sub-header-container .navbar {
        -webkit-box-shadow: 0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12),0 3px 5px -1px rgba(0,0,0,.2);
        -moz-box-shadow: 0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12),0 3px 5px -1px rgba(0,0,0,.2);
        box-shadow: 0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12),0 3px 5px -1px rgba(0,0,0,.2);
        background: linear-gradient(270deg, #1B2E4B, #1a1c2d, #1B2E4B); /* Define the gradient colors */
        background-size: 300% 300%; /* Set the size larger than 100% to create the scrolling effect */
        background-position: 0% 50%; /* Start position of the gradient */
        animation: gradientScroll 5s linear infinite; /* 5 seconds animation duration, moves left to right infinitely */
        border-radius: 0;
        padding: 0;
        justify-content: flex-start;
        min-height: 53px;
        width: 100%;
    }
    .pop td {text-align:left;padding:2px;font-size:11px;color:#FFFFFF;padding-right:10px;}
    #language-dropdown > div > p.top-exp.mr-1.menu_mid_size{display:none !important;}
    #language-dropdown > div > p.top-rage{display:none;}
    body > center > div.sub-header-container > header > ul.navbar-nav.flex-row.mr-auto.toolbar-nav > li:nth-child(1) > div > span{display:none;}
    li.toolbarButtons{margin-right:13px;}
    #dropdownCharacters{width:230px !important;margin-left:1rem;font-weight:700;visibility:visible !important;}
    #dropdownRgas{visibility:visible !important;}
    .btn-mm{background-color:#060818;margin-left:3px;margin-right:3px;color:#FFFFFF;padding:.4375rem 1.25rem;font-size:14px;font-weight:400;transition: .5s ease-out;cursor:pointer;border-radius:10px;box-shadow: 0 5px 20px 0 rgba(0,0,0,.1);letter-spacing:2px;}
    .btn-mm:hover{filter: saturate(250%);opacity:0.75;}
    .pointer{cursor:pointer;}
    #content > div.footer-wrapper{display:none;}
    #container > div.footer-wrapper{display:none;}
    body img[src*="items/skillitem.jpg"] {content: url("https://studiomoxxi.com/moxximod/aneuro.webp") !important;}
    body img[src*="items/questshard.jpg"] {content: url("https://studiomoxxi.com/moxximod/newqshard.gif") !important;}
    body img[src*="images/potion22.jpg"] {content: url("https://studiomoxxi.com/moxximod/firewater_new.webp") !important;}
    body img[src*="items/cycle4aug3.gif"] {content: url("https://studiomoxxi.com/moxximod/aug_doom.webp") !important;}
    body img[src*="items/cycle4aug2.gif"] {content: url("https://studiomoxxi.com/moxximod/aug_um.webp") !important;}
    body img[src*="items/skullepiccore.gif"] {content: url("https://studiomoxxi.com/moxximod/epic_skull_core.webp") !important;}
    body img[src*="items/velepichelmfinal.gif"] {content: url("https://studiomoxxi.com/moxximod/epic_veld_helm.webp") !important;}
    body img[src*="items/pvpchestv3.gif"] {content: url("https://studiomoxxi.com/moxximod/epic_pvp_v3.webp") !important;}
    table.table{margin-bottom: 0rem;}
    .little-space{margin-top:0px;}
    .table td, .table th{padding:8px !important;}
    .bio .widget-content-area h3:after{display:none;}
    img[src*="images/toolbar/Attacked.png"] {display: none;}
    `);

    GM_addStyle (`
    #toolbarTiles img{width:30px;height:30px;border-radius:5px;margin-right:3px;margin-left:3px;}
    img.tile-still:hover{filter: saturate(250%);opacity:0.5;}
    img.tile-animate{cursor:pointer;transition: .5s ease-out;animation: fadeIn 1s ease-in-out forwards, tileanimate 1s infinite;box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);}
    img.tile-still{cursor:pointer;transition: .5s ease-out;animation: fadeIn 1s ease-in-out forwards;box-shadow: 0 0 3px rgba(0, 0, 0, 1);}
    @keyframes fadeIn {from {opacity: 0;} to {opacity: 1;}}
    @keyframes tileanimate{0% {filter: saturate(100%);} 50% {filter: saturate(250%); } 100% {filter: saturate(100%);}}
    `);

    GM_addStyle (`
    #travelDiv{z-index:5;height:0px;box-shadow: 0 0 10px rgba(0, 0, 0, 1);overflow:auto;text-align:center;display:inline-block;}
    .travel-destination{width:300px;margin-bottom:7px;height:40px;padding:5px;text-align:left;}
    img.travel-img{height:25px;width:25px;border-radius:5px;margin-right:15px;margin-left:5px;box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);}
    `);

    GM_addStyle (`
    #appsDiv{z-index:5;height:0px;box-shadow: 0 0 10px rgba(0, 0, 0, 1);overflow:hidden;text-align:left;}
    div.appDiv{display:inline-block;font-size:9px;text-align:center;font-family:monospace,monospace;width:95px;}
    img.app-img{background: linear-gradient(to bottom, #898989, #262626);height:60px;width:60px;margin:7px;border-radius:10px;padding:10px;box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);box-shadow: inset 0.4em 0.4em 0.4em 0 rgba(255,255,255,0.8), inset -0.4em -0.4em 0.4em 0 rgba(0,0,0,0.8);cursor:pointer}
    img.app-img:hover{filter: saturate(250%);opacity:0.75;transition: .5s ease-out;}
    `);

    GM_addStyle (`
    #casterDiv{z-index:5;height:0px;box-shadow: 0 0 10px rgba(0, 0, 0, 1);overflow:hidden;}
    img.castable{height:40px;width:40px;margin:3px;border-radius:8px;box-shadow: 0 0 5px rgba(0, 0, 0, 1);background:#000000;cursor:pointer;transition: 0.25s ease-out;border: 2px #475254 SOLID;}
    img.castable:hover{filter: saturate(250%);opacity:0.5;}
    img.caster-selected{border:4px #00CC00 SOLID !important;width:40px !important;height:40px !important;padding:5px !important;}
    `);

    GM_addStyle (`
    #searchDiv{z-index:0;height:0px;box-shadow: 0 0 10px rgba(0, 0, 0, 1);overflow:hidden;text-align:center;}
    #searchDiv > form > input,#searchDiv > input{font-size:18px;}
    `);

    GM_addStyle (`
    #itemtable > tbody > tr:nth-child(2) > td:nth-child(2) > img:nth-child(1){min-width:58px;}
    body img[src*="gem_green1"] {content: url("https://studiomoxxi.com/ow_themes/custom_jobs/classic_01/gem_green.webp") !important;width: 25px !important;margin:2px;border:0px solid #666666;margin-top:5px;}
    body img[src*="gem_blue2"] {content: url("https://studiomoxxi.com/ow_themes/custom_jobs/classic_01/gem_blue.webp") !important;width: 25px !important;margin:2px;border:0px solid #666666;margin-top:5px;}
    body img[src*="gem_red2"] {content: url("https://studiomoxxi.com/ow_themes/custom_jobs/classic_01/gem_red.webp") !important;width: 25px !important;margin:2px;border:0px solid #666666;margin-top:5px;}
    body img[src*="gem_white2"] {content: url("https://studiomoxxi.com/ow_themes/custom_jobs/classic_01/gem_white.webp") !important;width: 25px !important;margin:2px;border:0px solid #666666;margin-top:5px;}
    body img[src*="gemslot2"] {width: 30px !important;margin-bottom:5px;border:1px solid #666666;}
    #itemtable>tbody>tr:nth-child(2)>td:nth-child(2)>img:nth-child(8) {width: 25px !important;margin:4px !important;}
    #itemtable>tbody>tr:nth-child(2)>td:nth-child(2)>img:nth-child(9) {width: 25px !important;margin:4px !important;}
    #itemtable>tbody>tr:nth-child(2)>td:nth-child(2)>img:nth-child(10) {width: 25px !important;margin:4px !important;}
    #itemtable>tbody>tr:nth-child(2)>td:nth-child(2)>img:nth-child(11) {width: 25px !important;margin:4px !important;}
    #itemtable>tbody>tr:nth-child(2)>td:nth-child(2)>img:nth-child(12) {width: 25px !important;margin:4px !important;}
    `);

    GM_addStyle (`
    #authSlider{height:28px;padding:3px;z-index:99999;box-shadow: 0 0 10px rgba(0, 0, 0, 1);overflow:hidden;width:100%;text-align:center;color:#FFFFFF;position:fixed;font-weight:500 !important;font-size:16px;bottom:0px;}
    `)

    GM_addStyle (`
    .mm-cell{background-color:#060818;}
    `)

    GM_addStyle (`
    #blankOverlay{height:100%;width:100%;z-index:1000;position:fixed;top:0px;border-radius:0px;opacity:0.99;}
    `)

    GM_addStyle (`
    #loadingOverlay{height:100%;width:100%;z-index:9999;position:fixed;top:0px;border-radius:0px;opacity:0.85;}
    #loadingOverlay > img{position:absolute;top:50%;left:50%;transform: translate(-50%,-50%);}
    `)

    GM_addStyle (`
    .dropdown-menu{box-shadow: 0px 0px 10px rgba(0, 0, 0, 1);}
    `)

    GM_addStyle(`
    img[src="images/store_head.jpg"]{display:none;}
    img[src="images/page/gladiator/Gladiator.png"]{display:none;}
    `)
};


let authSliderCreated = false;
let superfetchCache = {}


if (window.location.href.toString().match(/outwar\.com\/characters\/[0-9]+/i)){window.location.href = window.location.href.replace("characters/","profile?id=")};

$('head').append('<style>' + '#content { display: none; }' + '</style>');


let didPageLoadedRun = false;
var observer = new MutationObserver(function(mutationsList, observer) {
    if (document.querySelector("#container")) {
        didPageLoadedRun = true;
        pageLoaded();
        observer.disconnect();
    };
});
observer.observe(document, { childList: true, subtree: true });


setTimeout(function() {
    if (!didPageLoadedRun){
        didPageLoadedRun = true;
        pageLoaded();
        console.log('MOXXIMOD: Triggered 2 second lag timer');
    };
}, 2000);


async function pageLoaded() {

    const server = window.location.toString().match('sigil') ? "sigil" : "torax";
    const serverNo = server == "sigil" ? "1" : "2";


    const rgSessId = document.body.innerHTML.match(/rg_sess_id=([A-Za-z0-9]+)"/i);
    const rgaName = rgSessId ? rgSessId[1] : "null";


    const toolbarData = document.querySelector("body > center > div.sub-header-container > header > ul.navbar-nav.flex-row.mr-auto.toolbar-nav").innerHTML.replace(/[\n\r]/g,'');


    if (GM_getValue('developer') == "on"){
        await developer()
    };


    async function moxximod(){

        const charId = (document.body.innerHTML.match(/outwar\.com\/page\?x=([0-9]+)/i) || [0,0])[1];

        const dataTime = toolbarData.match(/<p class="top-clock">(.*?)<\/p>/i)[1];
        const dataLevel = toolbarData.match(/<span class="toolbar_level">(.*?)<\/span>/i)[1];
        const dataRage = parseInt(toolbarData.replace(/,/g,'').match(/<span class="toolbar_rage">(.*?)<\/span>/i)[1]);
        const dataExp = parseInt(toolbarData.replace(/,/g,'').match(/<span class="toolbar_exp">(.*?)<\/span>/i)[1]);
        const dataEnhancementExp = parseInt(toolbarData.replace(/,/g,'').match(/<b>Enhancement Exp:<\/b><\/td><td>([0-9]+)<\/td><\/tr>/i)[1]);
        const dataToLevel = toolbarData.match(/<b>Needed to Level:<\/b><\/td><td>(.*?)<\/td><\/tr>/i)[1];
        const dataGrowth = parseInt(toolbarData.replace(/,/g,'').match(/<b>Growth Today:<\/b><\/td><td>(.*?)<\/td><\/tr>/i)[1]);
        const dataMinimum = parseInt(toolbarData.replace(/,/g,'').match(/<b>Minimum:<\/b><\/td><td>([0-9]+)<\/td><\/tr>/i)[1]);
        const dataExpPerTurn = parseInt(toolbarData.replace(/,/g,'').match(/Growth Today:<\/b><\/td><td>.*?<\/td><\/tr><tr><td><b>Per Turn:<\/b><\/td><td>([0-9]+)<\/td><\/tr>/i)[1]);
        const dataRagePerTurn = parseInt(toolbarData.replace(/,/g,'').match(/<tr><td><b>Per Turn:<\/b><\/td><td>([0-9]+)<\/td><\/tr><tr><td><b>Maximum:/i)[1]);
        const dataMaximum = parseInt(toolbarData.replace(/,/g,'').match(/<b>Maximum:<\/b><\/td><td>([0-9]+)<\/td><\/tr>/i)[1]);
        const dataPremium = parseFloat(toolbarData.replace(/,/g, '').match(/Premium:<\/b><\/td><td><font size=2 color=#00FF00>.*?\.<\/font><font color=#00CC00>[0-9]+<\/font>/i).toString().replace("</font><font color=#00CC00>","").replace("Premium:</b></td><td><font size=2 color=#00FF00>","").replace("</font>",""));
        const dataAttack = parseInt(toolbarData.replace(/,/g,'').match(/<b>Attack:<\/b><\/td><td>([0-9]+)<\/td><\/tr>/i)[1]);
        const dataHp = parseInt(toolbarData.replace(/,/g,'').match(/<b>Hit Points:<\/b><\/td><td>([0-9]+)<\/td><\/tr>/i)[1]);
        const dataCritical = parseInt(toolbarData.replace(/,/g,'').match(/<b>Critical:<\/b><\/td><td>([0-9]+)%<\/td><\/tr>/i)[1]);
        const dataRampage = parseInt(toolbarData.replace(/,/g,'').match(/<b>Rampage:<\/b><\/td><td>([0-9]+)%<\/td><\/tr>/i)[1]);
        const dataBlock = parseInt(toolbarData.replace(/,/g,'').match(/<b>Block:<\/b><\/td><td>([0-9]+)%<\/td><\/tr>/i)[1]);

        const profileData = await superfetchProfile('profile');

        await menu(rgaName,charId,serverNo,profileData);
        await toolbar(rgaName,charId,serverNo,profileData,toolbarData,dataTime,dataLevel,dataRage,dataExp,dataEnhancementExp,dataToLevel,dataGrowth,dataMinimum,dataExpPerTurn,dataRagePerTurn,dataMaximum,dataAttack,dataHp,dataCritical,dataRampage,dataBlock);

        if (document.body.innerHTML.match('images/ErrorImg.jpg') || document.body.innerHTML.match('img/error.png')){
            return;
        };

        await updateRga(rgaName);

        if (url.match("profile") && !url.match("crew_profile")) {
            await onOff("profilePage");
            if (GM_getValue("onOff(profilePage)") != "false"){ await profilePage(server) };
        } else if (url.match("home") && !url.match("crew_home") && !url.match("homepost") && !url.match("type=statistics")) {
            if (GM_getValue("onOff(home)") != "false"){ await homeNew(profileData) };
            await onOff("home");
        } else if (url.match("world")){
            if (GM_getValue("onOff(world)") != "false"){ await world(profileData,server) };
            await onOff("world");
        } else if (url.match("cast_skills")){
            if (GM_getValue("onOff(cast_skills)") != "false"){ await castSkills() };
            await onOff("cast_skills");
        } else if (url.match("crew_profile")){
            if (GM_getValue("onOff(crew_profile)") != "false"){ await crewProfile(server) };
            await onOff("crew_profile");
        } else if (url.match("crew_vault")){
            if (GM_getValue("onOff(crew_vault)") != "false"){ await crewVaultNew(charId) };
            await onOff("crew_vault");
        } else if (url.match("trade")){
            if (GM_getValue("onOff(trade)") != "false"){ await trade() };
            await onOff("trade");
        } else if (url.match("crew_raidresults")){
            if (GM_getValue("onOff(crew_raidresults)") != "false"){ await raidResultsNew(server,serverNo,rgaName,charId) };
            await onOff("crew_raidresults");
        } else if (url.match("itemtransfer")){
            if (GM_getValue("onOff(itemtransfer)") != "false"){ await itemTransfer() };
            await onOff("itemtransfer");
        } else if (url.match("crew_bossspawns")){
            if (GM_getValue("onOff(crew_bossspawns)") != "false"){ await bossSpawns() }
            await onOff("crew_bossspawns");
        } else if (url.match("boss_stats")){
            if (GM_getValue("onOff(boss_stats)") != "false"){ await bossStats() };
            await onOff("boss_stats");
        } else if (url.match("changefaction")){
            if (GM_getValue("onOff(changeFaction)") != "false"){ await changeFaction(profileData) };
            await onOff("changefaction");
        } else if (url.match("augmentequip")){
            if (GM_getValue("onOff(augmentequip)") != "false"){ await augmentEquip(profileData,server) };
            await onOff("augmentequip");
        } else if (url.match("closedpvp")){
            if (GM_getValue("onOff(closedpvp)") != "false"){ await closedPvpNew(profileData,server,charId) };
            await onOff("closedpvp");
        } else if (url.match("closedpvp")){
            if (GM_getValue("onOff(closedpvp)") != "false"){ await closedpvp(profileData,server,charId) };
            await onOff("closedpvp");
        } else if (url.match("treasury") && !url.match("crew_treasury") && !url.match('mytreasury') && !url.match("search_for") && !url.match("type=vision") && !url.match("type=questreport")){
            if (GM_getValue("onOff(treasury)") != "false"){ await treasury() };
            await onOff("treasury");
        } else if (url.match("pointtransfer")){
            if (GM_getValue("onOff(pointtransfer)") != "false"){ await pointTransfer(dataPremium) };
            await onOff("pointtransfer");
        } else if (url.match(/gladiator\?mobid=[0-9]+/i)){
            if (GM_getValue("onOff(gladiator)") != "false"){ await gladiator(charId,profileData) };
            await onOff("gladiator");
        } else if (url.match("myaccount")){
            if (GM_getValue("onOff(myaccount)") != "false"){ await myaccount(charId,profileData) };
            await onOff("myaccount");
        } else if (url.match("type=vision")){
            await moxxivision(server,serverNo,rgaName,charId);
        } else if (url.match("type=moxxiraider")){
            await moxxiRaider(server,serverNo,rgaName,charId);
        } else if (url.match("type=questreport")){
            await blankOverlay(server,serverNo,rgaName,charId);
            await appQuestReport(server,serverNo,rgaName,charId);
        }  else if (url.match("type=statistics")){
            await statistics(server,serverNo,rgaName,charId);
        } else if (url.match("blacksmith")){
            if (GM_getValue("onOff(blacksmith)") != "false"){ await blacksmith(server,serverNo,rgaName,charId) };
            await onOff("blacksmith");
        } else if (url.match(/raidattack\.php\?raidid=[0-9]+/i)){
            await raidattack();
        } else if (url.match("spawntimeview")){
            await oracle();
        } else if (url.match("crew_permissions")){
            await crewpermissions();
        } else if (url.match("crew_bootmem")){
            await bootmem();
        } else if (url.match("cauldron")){
            await cauldron();
        };
    };


    await moxximod();


    $('#content').show();


    await itemOnHover();
    await itemDropMenu(server,serverNo,rgaName);
    await openBp();
    await openPotionBp();
    await ctrlDragCheckboxToggle();


    await charactersNavigation();
    await toolbarPointsIcon(toolbarData);
    const toolbarTiles = document.querySelector("#toolbarTiles");
    const noTiles = ['blacksmith','augmentequip','trade','security_prompt','augmentremove','crew_bootmem','type=moxxiraider']
    if (!noTiles.some(tile => url.includes(tile))) {
        await tiles();
    } else if (toolbarTiles){
        toolbarTiles.remove();
    };


    const devButton = document.querySelector("#btnDev");
    if (devButton){
        devButton.addEventListener("click", async () => {
            const pop = document.querySelector("#developer");
            if (pop){
                GM_setValue('developer','off');
                pop.remove();
            }
            await developer(rgaName,serverNo);
        });
    };
};


async function myaccount() {
    GM_addStyle(`
        #zero-config > tbody > tr > td {padding:0px !important;}
        img.f-img {height:18px;width:18px;margin-left:6px;cursor:pointer;}
    `)
    const table = document.querySelector("#zero-config");
    const rows = Array.from(table.querySelectorAll("tr"));
    const rowsLoop = async (row) => {
        const cell = row.querySelector("td");
        const charId = row.innerHTML.match(/suid=([0-9]+)/i)?.[1] || 0;
        if (charId != 0) {
            getFaction(cell,charId);
        };
    };
    await Promise.all(rows.map(rowsLoop));

    async function getFaction(cell,charId){
        cell.style.width = '45px'
        const profileData = await superfetchProfile(`profile?id=${charId}`);
        const f = profileData.faction;
        const l = profileData.loyalty;
        const i = f == "Alvar" ? 'a' : f == "Delruk" ? 'd' : f == "Vordyn" ? 'v' : 'none';
        if (i == "none"){
            cell.innerHTML = cell.innerHTML;
        } else {
            cell.innerHTML = cell.innerHTML + `<img class="f-img" src="https://studiomoxxi.com/moxxibots/factions/${i}.png" onmouseover="statspopup(event,'<b>${f} loyalty level ${l}<b>')" onmouseout="kill()">`;
        };
    };
};



async function profilePage(server){

    GM_addStyle (`
        #allAugs > img {height:26px;width:26px;margin:1px;border-radius:5px;border:2px #475254 SOLID;}
        #skillsDiv > img {height:35px;width:35px;margin:1px;border-radius:5px;border:2px #475254 SOLID;}
        #missingRobot, #skills > img {height:40px;width:40px;margin:3px;border-radius:5px;border:2px #475254 SOLID;}
        div.card-body{padding:0px;}
        #divHeaderName > font{text-transform: uppercase;font-size: 1.5em;font-weight: bold;margin-bottom: 1rem;word-wrap: break-word;}
        #pbuttons{margin-bottom:1rem !important;}
        #content > div > div:nth-child(1){max-width:350px !important;}
        #content > div > div:nth-child(2){max-width:800px !important;}
        .widget{padding:10px !important;}
        .progress{margin-bottom:0rem;}
        #UnderlingTable > thead > tr > th{padding:10px;margin:5px;margin-top:10px}
        #UnderlingTable > tbody > tr > td{padding:10px;margin:5px}
        #UnderlingTable > thead > tr > th,#UnderlingTable > tbody > tr > td{padding:3px;margin:0px;}
        #UnderlingTable > thead > tr > th:nth-child(4){display:none;}
        #UnderlingTable > tbody > tr > td:nth-child(4){display:none;}
        div.profile-comments{text-align: left !important;}
        div.crestDiv > img{height:32px;width:32px;}
        #profileSlayerDiv > div > div > img {height:50px !important;}
        div.smallSlayerDiv {height:50px;width:50px;overflow:hidden;display:inline-block;}
        #god_slayer{width:600px;}
    `);


    let profileHeader = document.querySelector("#divHeader").innerHTML.replace(/[0-9]+ Profile Hits/i,'')
    const charName = profileHeader.match(/<font size="3">(.*?)<\/font>/i)[1];
    const profileInfo = document.querySelectorAll('div.card')[0].innerHTML.replace(`<h5 class="card-title">PLAYER INFO</h5>`,"").replace(`<table class="table table-striped" cellpadding="0" cellspacing="0" width="100%">`,`<table class="charinfo" cellpadding="0" cellspacing="0" width="100%">`)
    const profileEq = document.querySelectorAll('div.card')[1].innerHTML.replace(`<h5 class="card-title">EQUIPMENT</h5>`,"").replace(`/images/thedude.png`,'https://studiomoxxi.com/moxximod/thedudeplus.png').replace('left:214px; top:346px;','left:10px; top:300px;').replace('left:258px; top:346px;','left:54px; top:300px;').replace('</div> </div>','')
    const profileCrests = document.querySelectorAll('div.card')[2].innerHTML.replace(`<h5 class="card-title">SKILL CRESTS</h5>`,"")
    const profileMastery = document.querySelectorAll('div.card')[3].innerHTML.replace(`<h5 class="card-title">MASTERIES</h5>`,"")
    const profilePic = document.querySelectorAll('div.card')[5].innerHTML.match(/src="([^"]*)"/i)[1]
    const profileSlayer = document.querySelectorAll('div.card')[9].innerHTML.replace(`</h5>`,`</h5><p>`).replace(/<div class="divGodSlayerImg" style="display: inline-block;height:50px;width:50px;background-image: url\(/g,`<div class="smallSlayerDiv"><img src=`).replace(/\); background-position: 0px;"/g,'').replace(/ onmouseout="kill\(\);"><\/div>/g,` onmouseout="kill();"></div>`)
    const profileLings = document.querySelector("#UnderlingTable").outerHTML.replace('table table-striped-dark mt-1','')
    const profileLingsLength = (profileLings.match(/profile\.php\?id=[0-9]+/g) || []).length;
    const profileSkills = document.querySelector('#divSkillsCast').innerHTML.replace(/<img src="\/images\/profile\/ProfileSkills\.png">/i,"");

    const successfulAttacks = parseInt(profileMastery.replace(/,/g,'').match(/([0-9]+) Successful Attacks/i)[1]);
    const successfulDefends = parseInt(profileMastery.replace(/,/g,'').match(/([0-9]+) Successfully Defended/i)[1]);
    const crewHits = parseInt(profileMastery.replace(/,/g,'').match(/([0-9]+) Crew Hits/i)[1]);
    const expStrip = parseInt(profileMastery.replace(/,/g,'').match(/([0-9]+) Exp Stripped/i)[1]);


    const profileInfoArray = profileInfo.replace(/[\n\r]/g,'').match(/<tr>.*?<\/tr>/g);
    const infoClass = profileInfoArray[0];
    const infoExp = profileInfoArray[1];
    const infoGrowth = profileInfoArray[2];
    const infoPower = profileInfoArray[3];
    const infoAttack = profileInfoArray[4];
    const infoHp = profileInfoArray[5];
    const infoChaos = profileInfoArray[6];
    const infoEle = profileInfoArray[7];
    const infoResist = profileInfoArray[8];
    const infoWilderness = profileInfoArray[9];
    const infoParent = profileInfoArray[11];
    const infoFaction = profileInfoArray[12];
    const infoCrew = profileInfoArray[13];

    const strength = profileInfoArray[14] ? profileInfoArray[14].match(/role="progressbar" style="width: ([0-9]+)%;/i) [1] : 0;


    const godslayerLevel = profileInfoArray[10].match(/<font size="2">([0-9]+)<\/font>/i)[1];
    const totalGods = (await info('All gods data')).length;


    const charId = document.body.innerHTML.match(/trade\?tradeWith=([0-9]+)/i)[1];

    let uploadPicLink = '';
    if (document.querySelector("#divProfile > div:nth-child(2) > div > div > div.col-xl-8.col-md-7 > div > div:nth-child(1) > div > a") != null){
        GM_addStyle (`#uploadPicLinkDiv{margin-bottom:-25px;}`)
        uploadPicLink = document.querySelector("#divProfile > div:nth-child(2) > div > div > div.col-xl-8.col-md-7 > div > div:nth-child(1) > div > a").outerHTML;
    };

    if (document.querySelector("#divActions > a:nth-child(1)")){
        var playerAttack = document.querySelector("#divActions > a:nth-child(1)").outerHTML.replace(`<img src="/images/profile/ProfileAttack.png" alt="ATTACK" border="0">`,"").replace(`<img src="http://sigil.outwar.com/images/profile/ProfileAttack.png" alt="ATTACK" border="0">`,"").replace(`</a>`,"")
        var playerName = playerAttack.match(/<a href="javascript:void\(0\);" onclick="showAttackWindow\('([^']*)','([0-9]+)','[0-9]+','[^']*'\)">/i)[1]
        var playerId = playerAttack.match(/<a href="javascript:void\(0\);" onclick="showAttackWindow\('([^']*)','([0-9]+)','[0-9]+','[^']*'\)">/i)[2]
    }


    if (window.location.href.match("id") == null){
        GM_addStyle (`#pbuttons{display:none !important;}`)
    }

    if (playerAttack == undefined){GM_addStyle (`#atk_button{display:none !important;}`)}

    var isplayerpp = "no"

    if (profileHeader.match(/<img src="[^"]*" onmouseover="popup\(event,'Preferred Player','808080'\)" onmouseout="kill\(\)">/i) != null){
        profileHeader = profileHeader.replace(/<img src="[^"]*" onmouseover="popup\(event,'Preferred Player','808080'\)" onmouseout="kill\(\)">/i,"")
        isplayerpp = "yes"
    }

    if (isplayerpp == "yes"){
        profileHeader = profileHeader.replace(`<font size="3">`,`<font style="color:#E79A31;font-size:20px;letter-spacing:0.1rem;text-transform:uppercase;">`)
    } else {
        profileHeader = profileHeader.replace(`<font size="3">`,`<font style="font-size:20px;letter-spacing:0.25rem;text-transform:uppercase;">`)
    };

    const notMyProfileButtons = `<div id="pbuttons">
    <a href="xxx" id="atk_button">`+playerAttack+`ATTACK</a>&emsp;
    <a href=send_ow_message?name=`+playerName+`>MESSAGE</a>&emsp;
    <a href=profile?id=`+playerId+`&ally=1>ALLY</a>&emsp;
    <a href=blocklist?id=`+playerId+`>BLOCK</a>&emsp;
    <a href=trade?tradeWith=`+playerId+`>TRADE</a>&emsp;
    <a href=crew_invites?inv=`+playerName+`>INVITE</a>&emsp;
    <a href=profile?id=`+playerId+`&enemy=1>ENEMY</a>&emsp;
    <a href=treasury?search_for=`+playerName+`>TREASURY</a>
    </div>`


    document.querySelector("#content").innerHTML = `

    ${notMyProfileButtons}
    <div class="row justify-content-center" id="outwarProfileContent">
    <div class="col-lg-5 col-md-5 col-sm-12 col-12 layout-spacing layout-spacing">
    <div class="widget profile-widget mb-3">
        ${profileHeader}
        <table class="charinfo" cellpadding="0" cellspacing="0" width="100%">
        <tbody>
        ${infoCrew}
        <span id="isppspan"></span><p>
        <span id="classLogo"></span>
        ${infoClass}
        ${infoExp}
        ${infoGrowth}
        <tr><td width="50%" style="padding-top: 2px; padding-bottom: 2px; padding-left: 2px;"><b><font size="1">MAXIMUM RAGE</font></b></td><td width="50%" style="padding-top: 2px; padding-bottom: 2px;"><b><font size="2"><div id="maximumRageDiv"><img src="https://studiomoxxi.com/moxximod/loading-gif.gif" style="height:15px;width:15px;"></div></font></b></td></tr>
        ${infoPower}
        ${infoChaos}
        ${infoEle}
        ${infoResist}
        <tr><td width="50%" style="padding-top: 2px; padding-bottom: 2px; padding-left: 2px;"><b><font size="1">STRENGTH</font></b></td><td width="50%" style="padding-top: 2px; padding-bottom: 2px;"><b><font size="2">${strength}%</font></b></td></tr>
        <tr><td width="50%" style="padding-top: 2px; padding-bottom: 2px; padding-left: 2px;"><b><font size="1">GOD SLAYER LEVEL</font></b></td><td width="50%" style="padding-top: 2px; padding-bottom: 2px;"><b><font size="2"><a href="javascript:void(0);" id="godslayerPop">${godslayerLevel} / ${totalGods}</a></font></b></td></tr>
        ${infoWilderness}
        ${infoParent}
        <tr><td width="50%" style="padding-top: 2px; padding-bottom: 2px; padding-left: 2px;"><b><font size="1">UNDERLINGS</font></b></td><td width="50%" style="padding-top: 2px; padding-bottom: 2px;"><b><font size="2"><a href="javascript:void(0);" id="lingPop">${profileLingsLength}</a></font></b></td></tr>
        <tr><td width="266px" style="padding-top: 2px; padding-bottom: 2px;" colspan="2" align="center"><b><font size="2">FROM EQUIPMENT</font></b></td></tr>
            <tr><td width="50%" style="padding-top: 2px; padding-bottom: 2px; padding-left: 2px;"><b><font size="1">ELEMENTAL ATTACK</font></b></td><td width="50%" style="padding-top: 2px; padding-bottom: 2px;"><b><font size="2"><div id="elementalFromItemsDiv"><img src="https://studiomoxxi.com/moxximod/loading-gif.gif" style="height:15px;width:15px;"></div></font></b></td></tr>
            <tr><td width="50%" style="padding-top: 2px; padding-bottom: 2px; padding-left: 2px;"><b><font size="1">CHAOS ATTACK</font></b></td><td width="50%" style="padding-top: 2px; padding-bottom: 2px;"><b><font size="2"><div id="chaosFromItemsDiv"><img src="https://studiomoxxi.com/moxximod/loading-gif.gif" style="height:15px;width:15px;"></div></font></b></td></tr>
            <tr><td width="50%" style="padding-top: 2px; padding-bottom: 2px; padding-left: 2px;"><b><font size="1">MAXIMUM RAGE</font></b></td><td width="50%" style="padding-top: 2px; padding-bottom: 2px;"><b><font size="2"><div id="maxRageFromItemsDiv"><img src="https://studiomoxxi.com/moxximod/loading-gif.gif" style="height:15px;width:15px;"></div></font></b></td></tr>
        <tr><td width="266px" style="padding-top: 2px; padding-bottom: 2px;" colspan="2" align="center"><b><font size="2">FROM AUGMENTS</font></b></td></tr>
            <tr><td width="50%" style="padding-top: 2px; padding-bottom: 2px; padding-left: 2px;"><b><font size="1">ELEMENTAL ATTACK</font></b></td><td width="50%" style="padding-top: 2px; padding-bottom: 2px;"><b><font size="2"><div id="elementalFromAugsDiv"><img src="https://studiomoxxi.com/moxximod/loading-gif.gif" style="height:15px;width:15px;"></div></font></b></td></tr>
            <tr><td width="50%" style="padding-top: 2px; padding-bottom: 2px; padding-left: 2px;"><b><font size="1">CHAOS ATTACK</font></b></td><td width="50%" style="padding-top: 2px; padding-bottom: 2px;"><b><font size="2"><div id="chaosFromAugsDiv"><img src="https://studiomoxxi.com/moxximod/loading-gif.gif" style="height:15px;width:15px;"></div></font></b></td></tr>
            <tr><td width="50%" style="padding-top: 2px; padding-bottom: 2px; padding-left: 2px;"><b><font size="1">MAXIMUM RAGE</font></b></td><td width="50%" style="padding-top: 2px; padding-bottom: 2px;"><b><font size="2"><div id="maxRageFromAugsDiv"><img src="https://studiomoxxi.com/moxximod/loading-gif.gif" style="height:15px;width:15px;"></div></font></b></td></tr>
        <tr><td width="266px" style="padding-top: 2px; padding-bottom: 2px;" colspan="2" align="center"><b><font size="2">SERVER RANKS</font></b></td></tr>
            <tr><td width="50%" style="padding-top: 2px; padding-bottom: 2px; padding-left: 2px;"><b><font size="1">TOTAL POWER RANK</font></b></td><td width="50%" style="padding-top: 2px; padding-bottom: 2px;"><b><font size="2"><div id="totalPowerRankDiv"><img src="https://studiomoxxi.com/moxximod/loading-gif.gif" style="height:15px;width:15px;"></div></font></b></td></tr>
            <tr><td width="50%" style="padding-top: 2px; padding-bottom: 2px; padding-left: 2px;"><b><font size="1">ELEMENTAL RANK</font></b></td><td width="50%" style="padding-top: 2px; padding-bottom: 2px;"><b><font size="2"><div id="elementalRankDiv"><img src="https://studiomoxxi.com/moxximod/loading-gif.gif" style="height:15px;width:15px;"></div></font></b></td></tr>
            <tr><td width="50%" style="padding-top: 2px; padding-bottom: 2px; padding-left: 2px;"><b><font size="1">CHAOS DAMAGE RANK</font></b></td><td width="50%" style="padding-top: 2px; padding-bottom: 2px;"><b><font size="2"><div id="chaosDamageRankDiv"><img src="https://studiomoxxi.com/moxximod/loading-gif.gif" style="height:15px;width:15px;"></div></font></b></td></tr>
        <tr><td width="266px" style="padding-top: 2px; padding-bottom: 2px;" colspan="2" align="center"><b><font size="2">MASTERIES</font></b></td></tr>
            <tr><td width="50%" style="padding-top: 2px; padding-bottom: 2px; padding-left: 2px;"><b><font size="1">SUCCESSFUL ATTACKS</font></b></td><td width="50%" style="padding-top: 2px; padding-bottom: 2px;"><b><font size="2">${successfulAttacks.toLocaleString()}</font></b></td></tr>
            <tr><td width="50%" style="padding-top: 2px; padding-bottom: 2px; padding-left: 2px;"><b><font size="1">SUCCESSFUL DEFENDS</font></b></td><td width="50%" style="padding-top: 2px; padding-bottom: 2px;"><b><font size="2">${successfulDefends.toLocaleString()}</font></b></td></tr>
            <tr><td width="50%" style="padding-top: 2px; padding-bottom: 2px; padding-left: 2px;"><b><font size="1">EXPERIENCE STRIPPED</font></b></td><td width="50%" style="padding-top: 2px; padding-bottom: 2px;"><b><font size="2">${expStrip.toLocaleString()}</font></b></td></tr>
        </tbody>
        </table>
    </div>
    </div>

    <div class="bio col-lg-7 col-md-7 col-sm-12 col-12 layout-spacing layout-spacing">
    <div class="card-body" id="profilePictureDiv"><img src="${profilePic}" style="width:100%;max-height:350px;border-radius:8px;margin-bottom:1rem" class="profile-widget"></div>
    <div style="position:relative;top:-40px;left:5px;text-align:left;" id="uploadPicLinkDiv">`+uploadPicLink+`</div>

    <div class="row justify-content-center">
    <div class="col-lg-6 col-md-6 col-sm-12 col-12 layout-spacing layout-spacing">
    <div class="widget profile-widget mb-3">
    <h5>EQUIPMENT</h5><p>
    ${profileEq}
        <div style="position:absolute; left:288px; top:389px; width:32px; height:32px;text-align:center" class="crestDiv" id="classCrestDiv"></div>
        <div style="position:absolute; left:288px; top:343px; width:32px; height:32px;text-align:center" class="crestDiv" id="ferocityCrestDiv"></div>
        <div style="position:absolute; left:244px; top:389px; width:32px; height:32px;text-align:center" class="crestDiv" id="preservationCrestDiv"></div>
        <div style="position:absolute; left:244px; top:343px; width:32px; height:32px;text-align:center" class="crestDiv" id="afflictionCrestDiv"></div>
    </div>
    </div>
    <div class="col-lg-6 col-md-6 col-sm-12 col-12 layout-spacing layout-spacing" id="removeDivWallIdentifier">
    <div class="widget profile-widget mb-3" id="skillsDiv"><h5 class="card-title">SKILLS AND EFFECTS</h5><p></p>${profileSkills}<span id="missing" style="text-align:right;opacity:1;"></span></div>
    <div class="widget profile-widget mb-3" id="slottedAugsDiv"><h5 class="card-title">SLOTTED AUGMENTS</h5><p></p><span id="allAugs"></span></div>
    <div style="text-align:right"><a href="javascript:void(0);" id="screenshotButton"><i class="fa fa-camera"></i></a></div>
    </div>

    </div>
    </div>
    `

    if (isplayerpp == "yes"){
        document.querySelector("#isppspan").innerHTML = `<font color="#E79A31"><font size="1"><b>PREFERRED PLAYER</b></font>`
    }
    ;


    const classCrest = profileCrests.match(/left:9px.*\n(.*)/i)
    const ferocityCrest = profileCrests.match(/left:83px.*\n(.*)/i)
    const preservationCrest = profileCrests.match(/left:157px.*\n(.*)/i)
    const afflictionCrest = profileCrests.match(/left:231px.*\n(.*)/i)
    if (classCrest){
        document.querySelector("#classCrestDiv").innerHTML = classCrest[1]
    }
    if (ferocityCrest){
        document.querySelector("#ferocityCrestDiv").innerHTML = ferocityCrest[1]
    }
    if (preservationCrest){
        document.querySelector("#preservationCrestDiv").innerHTML = preservationCrest[1]
    }
    if (afflictionCrest){
        document.querySelector("#afflictionCrestDiv").innerHTML = afflictionCrest[1]
    }


    const allPotionsInfo = await info("All Potions");
    const allPotions = allPotionsInfo.map(([item]) => item);
    const activePotions = (profileSkills.match(/alt="([^"]*)"/g) || []).map(match => match.slice(5, -1).replace(/'/g,''));
    const missingPotions = allPotions.filter(item => !activePotions.includes(item));
    const missingString = missingPotions.map((item, index) => (index > 0 && index % 2 === 0) ? `<br>${item}` : item).join(', ').replace(/'/g,'');
    document.querySelector("#missing").innerHTML = `<a id="missingPotions" onmouseout="kill()"><img src="https://studiomoxxi.com/moxximod/bot.png" id="missingRobot"></a>`

    if (GM_getValue("auth").match("Full")){
        document.querySelector("#missingPotions").setAttribute("onmouseover", `statspopup(event,'<b>Missing ${missingPotions.length} Potions</b><p>${missingString}')`);
    } else {
        document.querySelector("#missingPotions").setAttribute("onmouseover", `statspopup(event,'<b>Missing ${missingPotions.length} Potions</b><p>MoxxiMod+ subscribers can see a complete list of uncast potions here')`);
    };

    if (isplayerpp == "yes"){
        GM_addStyle (`
        #divHeaderName{color:#E79A31 !important;}
        .bg-danger,.bg-primary,.bg-secondary,.bg-success,.bg-warning{background-color:#E79A31 !important;}
        -moz-box-shadow: 0px 0px 3px 3px rgba(209,156,32,0.5);
        box-shadow: 0px 0px 3px 3px rgba(209,156,32,0.5);}
        #content > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > table > tbody > tr:nth-child(4) > td:nth-child(2) > b > font{color:#E79A31 !important;}
        #content > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > table > tbody > tr:nth-child(5) > td:nth-child(2) > b > font{color:#E79A31 !important;}
        #content > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > table > tbody > tr:nth-child(6) > td:nth-child(2) > b > font{color:#E79A31 !important;}
        #content > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > table > tbody > tr:nth-child(8) > td:nth-child(2) > b > font{color:#E79A31 !important;}
        `)
    };


    const faction = infoFaction.toString().match(/([A-Za-z]+) \((.*?)\)/i)
    const factionLvl = parseInt(faction[2])
    let factionImg;
    let profileFactionImg = [];

    if (faction[1] == "Vordyn"){
        GM_addStyle (`.profile-widget{-webkit-box-shadow:0px 0px 3px 3px rgba(252,41,205,0.3);`)
        factionImg = 'https://studiomoxxi.com/moxxibots/factions/v.png'
    } else if (faction[1] == "Delruk"){
        GM_addStyle (`.profile-widget{-webkit-box-shadow:0px 0px 3px 3px rgba(255,120,39,0.3);`)
        factionImg = 'https://studiomoxxi.com/moxxibots/factions/d.png'
    } else if (faction[1] == "Alvar"){
        GM_addStyle (`.profile-widget{-webkit-box-shadow:0px 0px 3px 3px rgba(0,159,255,0.3);`)
        factionImg = 'https://studiomoxxi.com/moxxibots/factions/a.png'
    } else {
        GM_addStyle (`.profile-widget{-webkit-box-shadow:0px 0px 3px 3px rgba(26,26,26,1);`)
    };

    for (let i = 0; i < factionLvl; i++) {
        profileFactionImg.push(`<img src="`+factionImg+`" style="height:8%;width:8%;margin-top:0.5rem;margin-right:0.1rem;margin-left:0.1rem;">`)
    };

    if (factionLvl >= 1){
        document.querySelector("#classLogo").setAttribute("onmouseover", `statspopup(event,'<b>${faction[1]}</b><br>Loyalty Level ${factionLvl}')`);
        document.querySelector("#classLogo").setAttribute("onmouseout", `kill()`);
    };

    document.querySelector("#classLogo").innerHTML = profileFactionImg.join('')


    const arrayOfItems = profileEq.match(/itempopup\(event,'[0-9]+'\)/g);
    getAugs(arrayOfItems);
    async function getAugs(arrayOfItems){
        let augs = []
        const itemLoop = async (item) => {
            const items = await superfetch(`item_rollover.php?id=${item.match(/[0-9]+/i)}`)
            const allAugs = items.match(/src="[^"]*" ONMOUSEOVER="itempopup\(event,'[0-9]+_[0-9]+'\)"/g)
            if (allAugs){
                for (let i = 0; i < allAugs.length; i++) {
                    augs.push(allAugs[i])
                };
            };
        };
        if (arrayOfItems){
            await Promise.all(arrayOfItems.map(itemLoop));
            document.querySelector("#allAugs").innerHTML = augs.sort().join('').replace(/src=/g,'<img src=').replace(/'\)"/g,`')" onmouseout="kill()">`)
        }
    };


    document.querySelector("#lingPop").addEventListener('click', async function(){
        createWindow("Underlings", "underling_table", 400, 1000, 1);
        document.querySelector("#underling_table_content").innerHTML = profileLings;
    });


    document.querySelector("#godslayerPop").addEventListener('click', async function(){
        createWindow("God Slayer", "god_slayer", 600, 600, -200);
        document.querySelector("#god_slayer_content").innerHTML = profileSlayer.replace('<h5 class="card-title">GOD SLAYER</h5>','');
    });


    const ajaxMaxRage = await superfetch('ajax/rankings.php?type=char_maxRage');
    const regexMaxRage = new RegExp(`"name":"${charName}","stat":([0-9]+)`);
    const maxrage = ajaxMaxRage.match(regexMaxRage) ? parseInt(ajaxMaxRage.match(regexMaxRage)[1]).toLocaleString() : "Not available";
    document.querySelector("#maximumRageDiv").innerHTML = maxrage;


    const ajaxPower = await superfetch('ajax/rankings.php?type=char_power');
    const regexPower = new RegExp(`"name":"${charName}","stat":"[0-9]+","pic":"[^"]*","rank":([0-9]+)`)
    const power = ajaxPower.match(regexPower) ? ajaxPower.match(regexPower)[1] + " / 100" : "Not ranked";
    document.querySelector("#totalPowerRankDiv").innerHTML = power;


    const ajaxChaos = await superfetch('ajax/rankings.php?type=char_chaos');
    const regexChaos = new RegExp(`"name":"${charName}","pic":"[^"]*","stat":[0-9]+,"rank":([0-9]+)`)
    const chaos = ajaxChaos.match(regexChaos) ? ajaxChaos.match(regexChaos)[1] + " / 100" : "Not ranked";
    document.querySelector("#chaosDamageRankDiv").innerHTML = chaos;


    const ajaxEle = await superfetch('ajax/rankings.php?type=char_elepower');
    const regexEle = new RegExp(`"name":"${charName}","pic":"[^"]*","stat":[0-9]+,"rank":([0-9]+)`)
    const elemental = ajaxEle.match(regexEle) ? ajaxEle.match(regexEle)[1] + " / 100" : "Not ranked";
    document.querySelector("#elementalRankDiv").innerHTML = elemental;


    document.querySelector("#screenshotButton").addEventListener('click', () => {
        loadingOverlay();

        document.querySelector("#screenshotButton").remove();

        GM_addStyle(`
            .justify-content-center{justify-content:left !important;}
            #loadingOverlay{opacity:1;}
        `)

        const content = document.querySelector("#content");
        content.innerHTML = content.innerHTML.replace(/<\/div>.*?[\n\r].*?<div class="col-lg-6 col-md-6 col-sm-12 col-12 layout-spacing layout-spacing" id="removeDivWallIdentifier">/i,'');

        document.querySelector("#profilePictureDiv").remove();
        document.querySelector("#uploadPicLinkDiv").remove();

        const targetDiv = document.querySelector("#outwarProfileContent");

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js';
        document.head.appendChild(script);
        script.onload = async () => {
            await captureScreenshot();
        };

        async function captureScreenshot(){
            html2canvas(targetDiv, { useCORS: true, logging: true, onrendered: function(canvas) {
                canvas.toBlob(blob => {
                    if (navigator.clipboard && navigator.clipboard.write) {
                        const item = new ClipboardItem({'image/png': blob});
                        navigator.clipboard.write([item]).then(() => {
                            window.location.href = window.location.href;
                        }).catch(err => {
                            alert('Error copying screenshot to clipboard')
                            window.location.href = window.location.href;
                        });
                    } else {
                        alert('Clipboard API not supported. Copying screenshot to clipboard is not possible.');
                        window.location.href = window.location.href;
                    }
                });
            }});
        };
    });

    statsFromItemsAndAugs();
    notes(profileHeader,charId,server);

    async function statsFromItemsAndAugs(){

        let eleFromItems = 0;
        let eleFromAugs = 0;
        let chaosFromItems = 0;
        let chaosFromAugs = 0;
        let mrFromItems = 0;
        let mrFromAugs = 0;
        const augIds = [];
        const parseEq = profileEq.replace(/[\n\r]/g,'').match(/<div.*?>.*?<\/div>/g).slice(0,10);
        const itemLoop = async (item) => {
            const itemid = (item.match(/id=([0-9]+)/i) || [0,0])[1];
            if (itemid > 0){
                const itemData = await superfetchItem(itemid);
                eleFromItems += itemData.ele;
                mrFromItems += itemData.maxrage;
                chaosFromItems += itemData.chaosdmg;
                for (let i = 0; i < itemData.augids.length; i++) {
                    const augid = itemData.augids[i];
                    augIds.push(augid);
                };
            };
        };
        await Promise.all(parseEq.map(itemLoop));
        const augLoop = async (aug) => {
            const augData = await superfetchItem(aug);
            eleFromItems -= augData.ele;
            chaosFromItems -= augData.chaosdmg;
            eleFromAugs += augData.ele;
            chaosFromAugs += augData.chaosdmg;
            mrFromAugs += augData.maxrage;
        }
        await Promise.all(augIds.map(augLoop));
        document.querySelector("#elementalFromItemsDiv").innerHTML = eleFromItems.toLocaleString();
        document.querySelector("#chaosFromItemsDiv").innerHTML = chaosFromItems.toLocaleString();
        document.querySelector("#maxRageFromItemsDiv").innerHTML = mrFromItems.toLocaleString();
        document.querySelector("#elementalFromAugsDiv").innerHTML = eleFromAugs.toLocaleString();
        document.querySelector("#chaosFromAugsDiv").innerHTML = chaosFromAugs.toLocaleString();
        document.querySelector("#maxRageFromAugsDiv").innerHTML = mrFromAugs.toLocaleString();
    };
};


async function menu(rgaName,charId,serverNo,profileData){
    GM_addStyle (`#accordionExample{display:revert !important;background:#060818;}`)

    if (document.querySelector("#accordionExample > a")){
        const buyPointsLink = document.querySelector("#accordionExample > a").outerHTML.match(/href="([^"]*)">/i)[1];
        const crewId = profileData.crewid;
        const level = profileData.level;

        document.querySelector("#accordionExample").innerHTML = `
        <li class="menu">
        <a href="#rga" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">
        <div><span> MY RGA</span></div>
        <div><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
        </a>
        <ul class="collapse submenu list-unstyled" id="rga" data-parent="#accordionExample">
        <input type="text" id="rg_sess_id" value="${rgaName}" class="form-control-new" onclick="this.select();" style="margin-top:15px;margin-bottom:5px;height:20px !important;font-size:10px !important;width:80% !important"><br>

        <li><a href="/myaccount">MY RGA</a></li>
        <li><a href="/treasury.php?type=vision">MOXXIVISION</a></li>
        <li><a href="/accountinfo">MY ACCOUNT</a></li>
        <li>
        <a class="dropdown-toggle collapsed" href="#pvpmenu" id="dropdown06" data-toggle="collapse" aria-expanded="false">SAVED SEC WORD</a>
        <ul id="pvpmenu" class="list-unstyled sub-submenu collapse">
        <li><input type="text" id="global_sec_word" class="form-control-new" value="no security word saved" spellcheck="false" style="width:100px;margin-left:30px;margin-top:0px;margin-bottom:5px;height:20px !important;font-size:10px !important;"><button id="secWordButton" class="btn-mm" style="height:20px;width:20px;padding:0px;font-size:9px;">✓</button><img src="images/questwiki.jpg" onmouseover="statspopup(event,'Save a security word to your browser<br>When logging into a new RGA, the browser will automatically try to use your saved secuirty word to unlock pages on Outwar<br>This is helpful if you use the same security word for more than one account<br><br>This feature is local-only<br>Your security word is not sent to any third-party server or storage center<br>It is only saved to your browser for local access')" onmouseout="kill()"></li>
        </ul>
        </li>
        <li><a href="/user_preferences">PREFERENCES</a></li>
        <li><a href="?cmd=logout">LOGOUT</a></li>
        </ul>
        </li>

        <li class="menu">
        <a href="/home" class="dropdown-toggle">
        <div><span> HOME</span></div>
        </a>
        </li>

        <li class="menu" id="character">
        <a href="#components" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">
        <div><span> CHARACTER</span></div>
        <div><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
        </a>
        <ul class="collapse submenu list-unstyled" id="components" data-parent="#accordionExample">
        <li><a href="/profile">PROFILE</a></li>
        <li><a href="/ow_messagecenter">MESSAGES</a></li>
        <li><a href="/cast_skills">SKILLS</a></li>
        <li><a href="/home?type=statistics">STATISTICS</a></li>
        <li><a href="/allies">MY ALLIES</a></li>
        <li><a href="/underlings">UNDERLINGS</a></li>
        <li><a href="https://rampidgaming.outwar.com/ppoverview_s2?owsrv=${serverNo}&owchar=${charId}&rg_sess_id=${rgaName}" TARGET="BLANK">PREF PLAYER</a></li>
        </ul>
        </li>

        <li class="menu" id="economy">
        <a href="#elements" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">
        <div><span> ECONOMY</span></div>
        <div><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
        </a>
        <ul class="collapse submenu list-unstyled" id="elements" data-parent="#accordionExample">
        <li><a href="/treasury?type=-1">BUY ITEMS</a></li>
        <li><a href="/mytreasury">SELL ITEMS</a></li>
        <li><a href="/supplies">SUPPLIES</a></li>
        <li><a href="/pointtransfer">TRANSFER PNTS</a></li>
        <li><a TARGET="_blank" href="${buyPointsLink}"> BUY POINTS</a></li>
        </ul>
        </li>

        <li class="menu">
        <a href="#datatables" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">
        <div><span> SERVER</span></div>
        <div><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
        </a>
        <ul class="collapse submenu list-unstyled" id="datatables" data-parent="#accordionExample">
        <li><a href="/attack_search">SEARCH</a></li>
        <li><a href="/newrankings">RANKINGS</a></li>
        <li><a href="/gladiator">GLADIATORS</a></li>
        <li><a href="/event?eventid=woz">WAR OF ZHUL</a></li>
        <li><a href="/event?eventid=top">TRIAL OF POWER</a></li>
        </ul>
        </li>

        <li class="menu">
        <a href="#menuCrew" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">
        <div><span> CREW</span></div>
        <div><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
        </a>
        <ul class="collapse submenu list-unstyled" id="menuCrew" data-parent="#accordionExample">
        </ul>
        </li>

        <li class="menu">
        <a href="#pvp" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">
        <div><span> PVP</span></div>
        <div><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
        </a>
        <ul class="collapse submenu list-unstyled" id="pvp" data-parent="#accordionExample">
        <li><a href="/attacklog">ATTACK LOG</a></li>
        <li><a href="/pvptourney">OPEN TOURNEY</a></li>
        <li><a href="/closedpvp">PVP BRAWL</a></li>
        <li><a href="/closedpvp?type=1">FACTION BRAWL</a></li>
        <li><a href="/bounty">BOUNTY BOARD</a></li>
        <li><a href="/crew_hitlist">CREW HITLIST</a></li>
        <li><a href="/myhitlist">MY HITLIST</a></li>
        </ul>
        </li>

        <li class="menu">
        <a href="#items" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">
        <div><span> ITEMS</span></div>
        <div><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
        </a>
        <ul class="collapse submenu list-unstyled" id="items" data-parent="#accordionExample">
        <li><a href="/vault">VAULT</a></li>
        <li><a href="/blacksmith">BLACKSMITH</a></li>
        <li><a href="/augmentequip">AUGMENTS</a></li>
        <li><a href="/itemtransfer">ITEM TRANSFER</a></li>
        <li><a href="/dungeons">DUNGEONS</a></li>
        <li><a href="/cauldron">CAULDRON</a></li>
        <li><a href="/kotw">KOTW</a></li>
        </ul>
        </li>

        <li class="menu">
        <a href="#quests" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">
        <div><span> QUESTS</span></div>
        <div><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
        </a>
        <ul class="collapse submenu list-unstyled" id="quests" data-parent="#accordionExample">
        <li><a href="/weeklyquests">BOOSTERS</a></li>
        <li><a href="/questlog">QUEST LOG</a></li>
        <li><a href="/collections">COLLECTIONS</a></li>
        <li><a href="/challenge">CHALLENGES</a></li>
        </ul>
        </li>

        <li class="menu">
        <a href="/world" class="dropdown-toggle">
        <div><span> WORLD</span></div>
        </a>
        </li>
        `


        var ulElement = document.getElementById("menuCrew");
        if (crewId > 0){
            const liHome = document.createElement("li");
            const liProfile = document.createElement("li");
            const liPrime = document.createElement("li");
            const liRaids = document.createElement("li");
            const liRaider = document.createElement("li");
            const liBosses = document.createElement("li");
            const liVault = document.createElement("li");
            const liCap = document.createElement("li");
            const liGods = document.createElement("li");
            const liLeave = document.createElement("li");
            liHome.innerHTML = `<a href="crew_home">CREW HOME</a>`
            liProfile.innerHTML = `<a href="crew_profile">CREW PROFILE</a>`
            liRaider.innerHTML = `<a href="primegods?type=moxxiraider">MOXXI+ RAIDER</a>`
            liPrime.innerHTML = `<a href="primegods">PRIME GODS</a>`
            liRaids.innerHTML = `<a href="crew_raidresults.php?crewid=${crewId}">RAID RESULTS</a>`
            liBosses.innerHTML = `<a href="crew_bossspawns">RAID BOSSES</a>`
            liVault.innerHTML = `<a href="crew_vault">CREW VAULT</a>`
            liCap.innerHTML = `<a href="crew_capstatus">CAP STATUS</a>`
            liLeave.innerHTML = `<a href="crew_leavecrew">LEAVE CREW</a>`
            ulElement.appendChild(liHome);
            ulElement.appendChild(liProfile);
            ulElement.appendChild(liRaider);
            ulElement.appendChild(liPrime);
            ulElement.appendChild(liBosses);
            ulElement.appendChild(liRaids);
            ulElement.appendChild(liVault);
            ulElement.appendChild(liCap);
            ulElement.appendChild(liGods);
            ulElement.appendChild(liLeave);
        } else {
            var liInvites = document.createElement("li");
            liInvites.innerHTML = `<a href="/crewinvites">CREW INVITES</a>`
            ulElement.appendChild(liInvites);
        };
        if (level >= 91){
            const ulElement = document.querySelector("#components");
            const newLiElement = document.createElement("li");
            newLiElement.innerHTML = `<a href="/changefaction">FACTIONS</a>`;
            ulElement.appendChild(newLiElement);
        };


        if (GM_getValue('globalSecurityWord')){
            const savedSecWord = GM_getValue('globalSecurityWord');
            document.querySelector("#global_sec_word").value = savedSecWord;
        };

        document.querySelector("#secWordButton").addEventListener('click', async function(){
            const inputText = document.querySelector("#global_sec_word").value
            GM_setValue('globalSecurityWord',inputText);
            await secword();
            alert(`Successfully saved ${inputText} to your browser`)
        });

    };
};


async function challengeStatus(){
    const data = await superfetch(`ajax/challenge_status`);
    if (data.match('Trustees do not have access to this page')){
        data = `{"result":true,"tokens":"NA","p_tokens":"NA","timeleft":59210}`
    }
    return data;
}


async function toolbar(rgaName,charId,serverNo,profileData,toolbarData,dataTime,dataLevel,dataRage,dataExp,dataEnhancementExp,dataToLevel,dataGrowth,dataMinimum,dataExpPerTurn,dataRagePerTurn,dataMaximum,dataAttack,dataHp,dataCritical,dataRampage,dataBlock){

    const threeLineThing = document.querySelector("body > center > div.sub-header-container > header > a");
    if (threeLineThing){
        threeLineThing.remove();
    };

    const toolbarDivcount = document.querySelectorAll("li.nav-item.more-dropdown.little-space.hide-on-mob").length
    for (let i = 3; i < toolbarDivcount+3; i++) {
        document.querySelector("li.nav-item.more-dropdown.little-space.hide-on-mob:nth-child("+i+")").setAttribute("style","display:none")
    };

    const toolbarNewLi = document.createElement('li');
    toolbarNewLi.innerHTML = `
    <span id="toolbarCharacters" class="toolbarSpan"></span>
    <span id="toolbarLastBtn" class="toolbarSpan"><a onmouseout="kill()" class="form-control-new" style="cursor:pointer;">&#9194;</a></span>
    <span id="toolbarNextBtn" class="toolbarSpan"><a onmouseout="kill()" class="form-control-new" style="cursor:pointer;">&#9193;</a></span>
    <span id="toolbarPoints" class="toolbarSpan"></span>
    <span id="toolbarRgas" class="toolbarSpan"></span>
    <span id="toolbarClock" class="toolbarSpan"></span>
    <span id="toolbarLvl" class="toolbarSpan"></span>
    <span id="toolbarRage" class="toolbarSpan"></span>
    <span id="toolbarCaps" class="toolbarSpan"></span>
    `;
    toolbarNewLi.setAttribute('class','nav-item more-dropdown little-space hide-on-mob')
    const toolbarUl = document.querySelector("body > center > div.sub-header-container > header > ul.navbar-nav.flex-row.mr-auto.toolbar-nav");
    toolbarUl.appendChild(toolbarNewLi);

    const utcDate = new Date();
    const estOffset = 5 * 60;
    const estDate = new Date(utcDate.getTime() - estOffset * 60000);
    const estFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'UTC',
        weekday: 'long'
    });
    const dayOfTheWeek = estFormatter.format(estDate);

    const untilMax = Math.ceil((dataMaximum - dataRage) / dataRagePerTurn);
    const maxTime = (parseInt(dataTime.match(/([0-9]+):/i)[1]) + untilMax) % 12;
    const maxHour = (untilMax > 0) ? `${maxTime}:00` : "NOW";

    const expTable = `<table class=pop><tr><td><b>EXPERIENCE:</td><td>${dataExp.toLocaleString()}</td></tr><tr><td><b>ENHANCEMENT EXP:</td><td>${dataEnhancementExp.toLocaleString()}</td></tr><tr><td><b>NEEDED TO LEVEL:</td><td>${dataToLevel}</td></tr><tr><td><b>GROWTH TODAY:</td><td>${dataGrowth.toLocaleString()}</td></tr><tr><td><b>MINIMUM EXP:</td><td>${dataMinimum.toLocaleString()}</td></tr><tr><td><b>PER TURN:</td><td>${dataExpPerTurn.toLocaleString()}</td></tr></table>`
    const rageTable = `<table class=pop><tr><td><b>MAXIMUM:</td><td>${dataMaximum.toLocaleString()}</td></tr><tr><td><b>WILL MAX:</td><td>${maxHour}</td></tr><tr><td><b>PER TURN:</td><td>${dataRagePerTurn.toLocaleString()}</td></tr><tr><td><b>ATTACK:</td><td>${dataAttack.toLocaleString()}</td></tr><tr><td><b>HIT POINTS:</td><td>${dataHp.toLocaleString()}</td></tr><tr><td><b>CRITICAL:</td><td>${dataCritical.toLocaleString()}%</td></tr><tr><td><b>RAMPAGE:</td><td>${dataRampage.toLocaleString()}%</td></tr><tr><td><b>BLOCK:</td><td>${dataBlock.toLocaleString()}%</td></tr></table>`

    if (GM_getValue("savedRgas") == undefined) {GM_setValue("savedRgas","no sessions saved")}
    if (GM_getValue("savedRgas") == "no sessions saved"){
        document.querySelector("#toolbarRgas").remove()
    } else {

        const options = GM_getValue("savedRgas")
        document.querySelector("#toolbarRgas").innerHTML = `
        <select id="dropdownRgas" class="form-control-new">
        <option>My RGAs</option>
        ${options}
        </select>
        `

        document.getElementById("dropdownRgas").addEventListener("change", function() {
            var selectedValue = this.value;
            if (selectedValue !== "") {
                window.location.href = selectedValue;
            };
        });
    };


    document.querySelector("#toolbarPoints").innerHTML = `<a onmouseover="statspopup(event,'loading...')" onmouseout="kill()" class="form-control-new" style="cursor:pointer;">&#128176;</a>`

    document.querySelector("#toolbarClock").innerHTML = `<a onmouseover="statspopup(event,'<table class=pop><tr><td><b>${dayOfTheWeek.toUpperCase()}</td></tr></table>')" onmouseout="kill()" class="form-control-new">${dataTime}</a>`

    document.querySelector("#toolbarLvl").innerHTML = `<a onmouseover="statspopup(event,'${expTable}')" onmouseout="kill()" class="form-control-new">LEVEL: ${dataLevel}</a>`

    document.querySelector("#toolbarRage").innerHTML = `<a onmouseover="statspopup(event,'${rageTable}')" onmouseout="kill()" class="form-control-new" id="toolbarRageText">RAGE: ${dataRage.toLocaleString()}</a>`

    document.querySelector("#toolbarCaps").innerHTML = `<a onmouseout="kill()" class="form-control-new">CAPS: <span id="toolbarCapsData"><img src="https://studiomoxxi.com/moxximod/loading-gif.gif" style="height:15px;width:15px"></span></a>`

    if (toolbarData.match(`<span style="color:#00CC00">`)){ document.querySelector("#toolbarRageText").setAttribute("style","border: 2px SOLID #FF0000 !important") };

    if (dataToLevel.match(/LEVEL!/)){ document.querySelector("#toolbarLvl a").setAttribute("style","border: 2px SOLID #00FF00 !important") };

    document.querySelector("#language-dropdown > svg").outerHTML = `<a class="form-control-new"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg></a>`

    GM_addStyle(`
        #btnCharacters{width:230px;overflow:hidden;vertical-align:middle;text-align:left;padding-left:10px;margin-left:10px;}
        #charactersDiv{padding:10px;overflow:auto;}
        #charactersDiv:hover{opacity:1;}
        #charactersDiv > table > thead > tr > th {font-size:16px;padding-right:6px;padding-left:6px;}
        #charactersDiv > table > tbody > tr > td {font-size:16px;padding-right:6px;padding-left:6px;}
        a.char-shortcut{font-size:20px;}
        a.char-shortcut:hover{color:#000000;}
        .tr-highlight {color:#ffffff !important;}
        #charactersDiv > table > tbody > tr:hover {background-color:#ffffff !important;cursor:pointer;color:#000000 !important;}
        #charactersDiv > table > tbody > tr:hover td:first-child { border-top-left-radius: 10px;border-bottom-left-radius: 10px;}
        #charactersDiv > table > tbody > tr:hover td:last-child {border-top-right-radius: 10px;border-bottom-right-radius: 10px;}
    `)
    document.querySelector("#toolbarCharacters").innerHTML = `<a class="form-control-new" id="btnCharacters" style="cursor:pointer;">${profileData.name}</a>`

    const raidForming = document.body.innerHTML.match('images/toolbar/NewRaid.png')
    const newMessage = document.body.innerHTML.match(/img border="0" src="\/images\/toolbar\/Message\.png"/i);
    const playerTrade = document.body.innerHTML.match(/img border="0" src="\/images\/toolbar\/Trade\.png"/i);
    const crewTrade = document.body.innerHTML.match(/img border="0" src="\/img\/CrewTrade\.png"/i);
    const toolbarButtons = document.querySelector("body > center > div.sub-header-container > header > ul.navbar-item.flex-row.ml-auto")
    toolbarButtons.innerHTML = `
    <span id="tipsBtnDiv"></span>
    <li class="toolbarButtons"><a href="javascript:void(0);" id="btnTravel" onmouseover="statspopup(event,'<b>Fast travel<b>')" onmouseout="kill()"><img src="https://studiomoxxi.com/moxximod/fasttravel.png" height="25px" width="25px"></a></li>
    <li class="toolbarButtons" id="btnAppsLi"><a href="javascript:void(0);" id="btnApps" onmouseover="statspopup(event,'<b>MoxxiMod apps<b>')" onmouseout="kill()"><img src="https://studiomoxxi.com/moxximod/toolbarbot.png" id="toolbarbot" height="25px" width="25px"></a></li>
    <li class="toolbarButtons"><a href="javascript:void(0);" id="btnCaster" onmouseover="statspopup(event,'<b>Caster<b>')" onmouseout="kill()"><img src="https://studiomoxxi.com/moxximod/castericon.webp" height="25px" width="25px"></a></li>
    <li class="toolbarButtons"><a href="javascript:void(0);" id="btnSearch" onmouseover="statspopup(event,'<b>Search<b>')" onmouseout="kill()"><img src="https://studiomoxxi.com/moxximod/searchicon.webp" height="25px" width="25px"></a></li>
    <span id="notesBtnDiv"></span>
    <li class="toolbarButtons"><a href="javascript:void(0);" onclick="toggleEquipment();" onmouseover="statspopup(event,'<b>Equipment<b>')" onmouseout="kill()"><img src="https://studiomoxxi.com/moxximod/toolbareq.png"></a></li>
    <li class="toolbarButtons"><a href="javascript:void(0);" id="toggleAugments" onmouseover="statspopup(event,'<b>Slotted Augments<b>')" onmouseout="kill()"><img src="https://studiomoxxi.com/moxximod/augmenticon.png"></a></li>
    <li class="toolbarButtons"><a onclick="toggleBackpack(null,${charId});" href="javascript:void(0);" onmouseover="statspopup(event,'<b>Backpack<b>')" onmouseout="kill()"><img src="https://studiomoxxi.com/moxximod/toolbarbp.png" style="margin-right:1rem;"></a></li>
    `
    if (raidForming){
        const raidFormingLi = document.createElement("li");
        raidFormingLi.classList.add('toolbarButtons');
        raidFormingLi.innerHTML = `<a href="crew_raidsforming"><img src="https://studiomoxxi.com/moxximod/NewRaid.png" onmouseover="statspopup(event,'<b>Raid forming</b>')" onmouseout="kill()" height="25px" width="25px"></a>`
        toolbarButtons.insertBefore(raidFormingLi,toolbarButtons.firstChild)
    };
    if (newMessage){
        const newMessageLi = document.createElement("li");
        newMessageLi.classList.add('toolbarButtons');
        newMessageLi.innerHTML = `<a href="ow_messagecenter"><img src="https://studiomoxxi.com/moxximod/messages.png" onmouseover="statspopup(event,'<b>New Messages</b>')" onmouseout="kill()" height="25px" width="25px"></a>`
        toolbarButtons.insertBefore(newMessageLi,toolbarButtons.firstChild)
    };
    if (playerTrade){
        const newMessageLi = document.createElement("li");
        newMessageLi.classList.add('toolbarButtons');
        newMessageLi.innerHTML = `<a href="trade"><img src="images/toolbar/Trade.png" onmouseover="statspopup(event,'<b>Trade Proposal</b>')" onmouseout="kill()" height="25px" width="25px"></a>`
        toolbarButtons.insertBefore(newMessageLi,toolbarButtons.firstChild)
    };
        if (crewTrade){
        const newMessageLi = document.createElement("li");
        newMessageLi.classList.add('toolbarButtons');
        newMessageLi.innerHTML = `<a href="trade?isCrewTrade=1"><img src="img/CrewTrade.png" onmouseover="statspopup(event,'<b>Crew Trade Proposal</b>')" onmouseout="kill()" height="25px" width="25px"></a>`
        toolbarButtons.insertBefore(newMessageLi,toolbarButtons.firstChild)
    };

    document.querySelector("#toggleAugments").addEventListener('click', async function(){
        GM_addStyle(`
            #popUpSlottedAugsDiv > img {height:40px;width:40px;margin:3px;border-radius:8px;border:2px #475254 SOLID;}
        `)
        const augsArray = [];
        const equipment = await superfetch("equipment");
        const itemIdArray = equipment.match(/event,'[0-9]+'/g);
        const itemLoop = async (item) => {
            const itemId = item.match(/[0-9]+/i);
            const itemData = await superfetchItem(itemId);
            const augs = itemData.augs;
            if (augs != ""){
                for (let aug of augs.trim().split(/(?=<img)/)){
                    augsArray.push(aug);
                }
            }
        };
        await Promise.all(itemIdArray.map(itemLoop));

        const augsString = augsArray.sort().reduce((html, element, index) =>
            html + element + ((index + 1) % 6 === 0 ? '<br>' : ''), '');

        createWindow("Slotted Augments", "slotted_augments", 276, 276, -200);
        document.querySelector("#slotted_augments_content").innerHTML = `
        <center>
        <div id="popUpSlottedAugsDiv">loading</div>
        `;
        document.querySelector("#popUpSlottedAugsDiv").innerHTML = augsString

    });

    document.querySelector("#btnTravel").addEventListener("click", async () => { travelMenu(rgaName,charId,serverNo,profileData) } );
    document.querySelector("#btnApps").addEventListener("click", async () => { appsMenu(rgaName,charId,serverNo,profileData) } );
    document.querySelector("#btnCaster").addEventListener("click", async () => { casterMenu(rgaName,charId,serverNo,profileData) } );
    document.querySelector("#btnSearch").addEventListener("click", async () => { searchMenu(rgaName,charId,serverNo) });


    const robotDiv = document.createElement("div");
    robotDiv.style.position = "fixed";
    robotDiv.style.bottom = '8px';
    robotDiv.style.left = '8px';
    robotDiv.style.cursor = 'pointer';
    robotDiv.style.zIndex = "101";
    robotDiv.style.alignItems = "center";
    robotDiv.innerHTML = `
        <div id="mmDevMode" style="display:inline-block">
        <a href="javascript:void(0);" id="btnDev" onmouseover="statspopup(event,'<b>Developer Logs</b>')" onmouseout="kill()"><img src="https://studiomoxxi.com/moxximod/icon_dev.webp" style="height:20px;width:20px;"></a>
        </div>
        <div id="mmOnOffDiv" style="display:inline-block">
        </div>
    `
    if (!document.URL.match('type=vision')){
        document.body.appendChild(robotDiv);
    };

    if (!url.match("home") || url.match("crew_home")) {
        var toolbarDiv = document.createElement("div");
        toolbarDiv.id = "alertBar"
        toolbarDiv.style.width = "100%";
        toolbarDiv.style.height = "34px";
        toolbarDiv.style.position = "fixed";
        toolbarDiv.style.bottom = "0";
        toolbarDiv.style.backgroundColor = "#1A1C2D";
        toolbarDiv.style.zIndex = "100";
        toolbarDiv.style.boxShadow = "0 -5px 5px 0 rgba(0,0,0,1)";
        toolbarDiv.classList.add('navbar')
        toolbarDiv.style.display = "flex";
        toolbarDiv.style.justifyContent = "center";
        toolbarDiv.style.alignItems = "center";
        toolbarDiv.innerHTML = `<span id="toolbarTiles" class="toolbarSpan"><img src="https://studiomoxxi.com/moxximod/loading-gif.gif" style="height:20px;width:20px"></span>`

        document.body.appendChild(toolbarDiv);
    };


    GM_addStyle (`body > center > div.sub-header-container{display:revert !important;}`);

    await getGodCaps();

    async function getGodCaps(){
        const capData = await superfetch("crew_capstatus");
        const parseData = new DOMParser();
        const capDataDoc = parseData.parseFromString(capData, 'text/html');
        const inCrewCheck = capData.match(/only be involved in killing ([0-9]+) guardians/i);
        if (!inCrewCheck){
            document.querySelector("#toolbarCapsData").innerHTML = "N/A";
            return;
        };
        const capLimit = parseInt(capData.match(/only be involved in killing ([0-9]+) guardians/i)[1]);
        const capCurrent = parseInt(capData.match(/killed in last 7 days:<\/b> ([0-9]+)/i)[1]);
        const caps = capLimit - capCurrent;

        const div = Array.from(capDataDoc.querySelectorAll('h5')).find(h5 => h5.textContent.trim() === 'Player Cap Status' )?.closest('div');
        const htmlString = Array.from(div.querySelectorAll('tr'))
            .slice(1)
            .map(tr => {
                tr.querySelector('td')?.remove();
                return tr.outerHTML;
            }).join('');

        document.querySelector("#toolbarCapsData").innerHTML = `${caps}/${capLimit}`;
        const capsTable = `<table class=pop><tr><td><b>RAID</u></b></td><td><b>EXPIRY</u></b></td></tr></tr>${htmlString.replace(/[\n\r]/g,'')}</table>`
        if (Array.from(div.querySelectorAll('tr')).length > 1){
            document.querySelector("#toolbarCaps").setAttribute("onmouseover", `statspopup(event,'${capsTable}')`);
        };
    };

};


async function toolbarPointsIcon(toolbarData){
    const toolbarPoints = document.querySelector("#toolbarPoints");
    if (!toolbarPoints){
        return;
    };
    const fetchTokens = await challengeStatus();
    const qbp = await superfetch('ajax/backpackcontents.php?tab=quest');
    const dataGold = parseFloat(toolbarData.replace(/,/g, '').match(/<tr><td><b>Gold:<\/b><\/td><td>(.*)<\/td><\/tr>/i)[1]);
    const dataPoints = parseFloat(toolbarData.replace(/,/g, '').match(/<tr><td><b>Points:<\/b><\/td><td><font size=2 color=#00FF00>(.*)<\/font><\/td><\/tr>/i)[1]);
    const dataSkillPoints = parseFloat(toolbarData.replace(/,/g, '').match(/<tr><td><b>Skill:<\/b><\/td><td>(.*)<\/td><\/tr>/i)[1]);
    const dataPremium = parseFloat(toolbarData.replace(/,/g, '').match(/Premium:<\/b><\/td><td><font size=2 color=#00FF00>.*?\.<\/font><font color=#00CC00>[0-9]+<\/font>/i).toString().replace("</font><font color=#00CC00>","").replace("Premium:</b></td><td><font size=2 color=#00FF00>","").replace("</font>",""));
    const dataFreeTokens = fetchTokens.match('error') ? "NA" : parseInt(fetchTokens.match(/"tokens":"(.*?)"/i)[1]);
    const dataPremiumTokens = fetchTokens.match('error') ? "NA" : parseInt(fetchTokens.match(/"p_tokens":"(.*?)"/i)[1]);
    const dataReps = qbp.match(/data-name="Badge Reputation"/i) ? parseInt(qbp.match(/data-name="Badge Reputation" data-itemqty="([0-9]+)"/i)[1]) : 0;
    const table = `<table class=pop><tr><td><b>PB POINTS:</td><td>${dataPoints.toLocaleString()}</td></tr><tr><td><b>PREM POINTS:</td><td>${dataPremium.toLocaleString()}</td></tr><tr><td><b>FREE TOKENS:</td><td>${dataFreeTokens.toLocaleString()}</td></tr><tr><td><b>PREM TOKENS:</td><td>${dataPremiumTokens.toLocaleString()}</td></tr><tr><td><b>GOLD:</td><td>${dataGold.toLocaleString()}</td></tr><tr><td><b>SKILL POINTS:</td><td>${dataSkillPoints.toLocaleString()}</td></tr><tr><td><b>BADGE REPS:</td><td>${dataReps}</td></tr></table>`
    toolbarPoints.setAttribute('onmouseover',`statspopup(event,'${table}')`);

    const negTimeLeft = fetchTokens.match(/"timeleft":-[0-9]+/i);
    const myTokens = parseInt(fetchTokens.match(/"tokens":"([0-9]+)"/i)[1])

    if (negTimeLeft && myTokens == 30){
        const toolbarLink = document.querySelector("#toolbarPoints a");
        toolbarLink.style.transition = "box-shadow 1s ease-in-out";
        toolbarLink.style.boxShadow = "inset 0 0 0 0px #F9E400";
        setTimeout(() => { toolbarLink.style.boxShadow = "inset 0 0 0 1px #F9E400"; }, 100);
     };

    if (dataReps >= 15){
        const toolbarLink = document.querySelector("#toolbarPoints a");
        toolbarLink.style.transition = "box-shadow 1s ease-in-out";
        toolbarLink.style.boxShadow = "inset 0 0 0 0px #F9E400";
        setTimeout(() => { toolbarLink.style.boxShadow = "inset 0 0 0 1px #00FF00"; }, 100);
    };
}


async function charactersNavigation(){
    const button = document.querySelector("#btnCharacters")
    if (!button){
        return;
    };

    const myAccount = await superfetch('myaccount')
    button.addEventListener('click', async () => {
        await characterMenu(myAccount);
    });


    const currentChar = document.querySelector("#btnCharacters").innerHTML
    const stickyPath = window.location.pathname;
    const stickySearch = window.location.search ? window.location.search.replace('?','&').replace(/&suid=[0-9]+/i,'') : '';
    const parseData = new DOMParser();
    const myAccountDocument = parseData.parseFromString(myAccount, 'text/html');
    let trElements = myAccountDocument.querySelectorAll("tr");
    const charsArray = [];
    for (const tr of trElements){
        const html = tr.innerHTML
        if (html.match(/suid=[0-9]+/i)){
            const id = html.match(/suid=([0-9]+)/i)[1];
            const tds = html.match(/<td.*?\/td>/g)
            const name = tds[1].replace(/<.*?>/g,'');
            const trustee = tds[4].match('Remove selected Trustee') ? true : false;
            if (!trustee){
                charsArray.push({
                    name: name,
                    id: id
                });
            };
        };
    };
    charsArray.sort((a, b) => a.name.localeCompare(b.name));
    const index = charsArray.findIndex(obj => obj.name.trim() === currentChar.trim());
    const nextCharacter = charsArray[(index + 1) % charsArray.length];
    const nextCharacterId = nextCharacter.id;
    const nextCharacterName = nextCharacter.name;
    const toolbarNextBtn = document.querySelector("#toolbarNextBtn");
    toolbarNextBtn.setAttribute("onmouseover", `statspopup(event,'Switch to <b>${nextCharacterName}</b>')`);
    toolbarNextBtn.addEventListener('click', async () => {
        window.location.href = `${stickyPath}?suid=${nextCharacterId}${stickySearch}`;
    });
    const lastCharacter = charsArray[(index - 1 + charsArray.length) % charsArray.length];
    const lastCharacterId = lastCharacter.id;
    const lastCharacterName = lastCharacter.name;
    const toolbarLastBtn = document.querySelector("#toolbarLastBtn");
    toolbarLastBtn.setAttribute("onmouseover", `statspopup(event,'Switch to <b>${lastCharacterName}</b>')`);
    toolbarLastBtn.addEventListener('click', async () => {
        window.location.href = `${stickyPath}?suid=${lastCharacterId}${stickySearch}`;
    });
}


async function characterMenu(myAccount) {

    const menu = document.querySelector("#btnCharacters");
    if (!menu.classList.contains("menu-created")) {
        await charactersMenuBuild(myAccount);
        menu.classList.add("menu-created");
    }
    if (menu.classList.contains("menu-open")) {
        await charactersMenuClose();
    } else {
        await charactersMenuOpen();
        menu.classList.add("menu-open");
    };
};

async function charactersMenuOpen(){

    GM_addStyle (`#charactersDiv {animation: moveAnimationChars 0.25s ease forwards;position:fixed;display:flex;flex-direction:column;}`);
    GM_addStyle (`@keyframes moveAnimationChars {0% {height:0px;position:fixed;top:0px;} 100% {height:535px;position:fixed;top:48px;}}`);
    document.querySelector("#filter").select();
};

async function charactersMenuBuild(myAccount){
    const currentChar = document.querySelector("#btnCharacters").innerHTML;
    const stickyPath = window.location.pathname;
    const stickySearch = window.location.search ? window.location.search.replace('?','&').replace(/&suid=[0-9]+/i,'') : '';
    const parseData = new DOMParser();
    const myAccountDocument = parseData.parseFromString(myAccount, 'text/html');
    let trElements = myAccountDocument.querySelectorAll("tr");
    const charsArray = [];
    const trusteesArray = [];
    for (const tr of trElements){
        const html = tr.innerHTML
        if (html.match(/suid=[0-9]+/i)){
            const id = html.match(/suid=([0-9]+)/i)[1];
            const servNo = html.match(/serverid=([0-9]+)/i)[1];
            const serv = servNo == "1" ? "sigil" : "torax";
            const tds = html.match(/<td.*?\/td>/g)
            const name = tds[1].replace(/<.*?>/g,'');
            const level = tds[2].replace(/<.*?>/g,'');
            const crew = tds[3].replace(/<.*?>/g,'');
            const trustee = tds[4].match('Remove selected Trustee') ? true : false;
            const currentCharStyling = name.toLowerCase().trim() == currentChar.toLowerCase().trim() ? "tr-highlight" : "none"
            if (trustee){
                trusteesArray.push(`<tr alphaSort="${name}" class="tr-link ${currentCharStyling}" id="${stickyPath}?suid=${id}${stickySearch}"><td class="filt">${name}</td><td>${level}</td><td>${crew}</td><td><a class="char-shortcut" href="https://${serv}.outwar.com/myaccount_trust_remove.php?trustee=${id}&ac_serverid=${servNo}" onmouseover="statspopup(event,'Remove trustee')" onmouseout="kill()">&#10008;</a></td></tr>`);
            } else {
                const power = tds[6].replace(/<.*?>/g,'');
                const ele = parseInt(tds[7].replace(/,/g,'').match(/>([0-9]+)</i)[1]);
                charsArray.push(`<tr alphaSort="${name}" class="tr-link ${currentCharStyling}" id="${stickyPath}?suid=${id}${stickySearch}"><td class="filt">${name}</td><td>${level}</td><td>${power}</td><td>${ele.toLocaleString()}</td><td>${crew}</td><td><a class="char-shortcut" href="crew_vault?suid=${id}" onmouseover="statspopup(event,'Explore')" onmouseout="kill()">&#9784;</a> <a class="char-shortcut" href="crew_vault?suid=${id}" onmouseover="statspopup(event,'Crew vault')" onmouseout="kill()">&#9874;</a> <a class="char-shortcut" href="crew_vault?suid=${id}" onmouseover="statspopup(event,'Character vault')" onmouseout="kill()">&#9876;</a> <a class="char-shortcut" href="itemtransfer?suid=${id}" onmouseover="statspopup(event,'Item transfer')" onmouseout="kill()">&#10149;</a> <a class="char-shortcut" href="augmentequip?suid=${id}" onmouseover="statspopup(event,'Augments')" onmouseout="kill()">&#9881;</a> <a class="char-shortcut" href="augmentequip?suid=${id}" onmouseover="statspopup(event,'Blacksmith')" onmouseout="kill()">&#9879;</a> <a class="char-shortcut" href="augmentequip?suid=${id}" onmouseover="statspopup(event,'Treasury')" onmouseout="kill()">&#9878;</a></td></tr>`);
            };
        };
    };


    var image = document.querySelector("#btnCharacters").getBoundingClientRect();
    var newDiv = document.createElement('div');
    newDiv.id = 'charactersDiv';
    newDiv.classList.toggle('widget');
    newDiv.style.position = 'absolute';
    newDiv.style.zIndex = 53;
    newDiv.style.boxShadow = "10px 10px 10px rgba(0, 0, 0, 1)"
    newDiv.style.top = image.top + window.scrollY + 'px';
    newDiv.style.left = image.left + window.scrollX-0 + 'px';
    document.body.appendChild(newDiv);

    async function loadCharacters(){
        document.querySelector("#charactersDiv").innerHTML = `
            <div id="inputContainer" style="display:flex;align-items:center;gap:0.5rem;width:100%;">
                <input type="text" class="form-control-new" style="margin-bottom:0.5rem;flex-grow:1;width:100%" placeholder="Search" id="filter" autocomplete="off">
                <span class="form-control-new" id="btnTrustees" style="cursor:pointer;margin-bottom:0.5rem;">TRUSTEES</span>
            </div>
            <table class="character-menu-table sortable filterable" id="characterDropdownTable">
            <thead><tr><th>CHARACTER</th><th>LVL</th><th>POWER</th><th>ELE</th><th>CREW</th><th>SHORTCUT</th></tr></thead>
            <tbody>
            ${charsArray.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })).join('')}
            </tbody>
            </table>
            <p style="margin-top:0.2rem;">
            <span id="underTableSpan"></span>
       `
        document.querySelector("#btnTrustees").addEventListener('click',loadTrustees);
        document.querySelector("#filter").select();
        await attachTableRowLinks();
        await enterKeyShortcut();
        await filterTables(true);
        await sortableTables();
    };

    async function loadTrustees(){
        document.querySelector("#charactersDiv").innerHTML = `
            <div id="inputContainer" style="display:flex;align-items:center;gap:0.5rem;width:100%;">
                <input type="text" class="form-control-new" style="margin-bottom:0.5rem;flex-grow:1;width:100%" placeholder="Search" id="filter" autocomplete="off">
                <span class="form-control-new" id="btnMyCharacters" style="cursor:pointer;margin-bottom:0.5rem;">RGA</span>
            </div>
            <table class="character-menu-table sortable filterable" id="characterDropdownTable">
            <thead><tr><th>CHARACTER</th><th>LVL</th><th>CREW</th></tr></thead>
            <tbody>
            ${trusteesArray.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })).join('')}
            </tbody>
            </table><p style="margin-top:0.2rem;">
            <span id="underTableSpan"></span>
       `
        document.querySelector("#btnMyCharacters").addEventListener('click',loadCharacters);
        document.querySelector("#filter").select();
        await attachTableRowLinks();
        await enterKeyShortcut();
        await filterTables(true);
        await sortableTables();
    };

    await loadCharacters();


    async function attachTableRowLinks(){
        document.querySelectorAll('tr.tr-link').forEach(tr => {
            tr.addEventListener('click', async () => {
                window.location.href = tr.id;
            })
        });
    };


    async function enterKeyShortcut(){
        document.querySelector("#filter").addEventListener("keypress", function(event) {
            document.querySelector("#underTableSpan").innerHTML = '<center><i>Type [enter] to go to the character at the top of the list</i>'
            if (event.key === "Enter") {
                const tr = document.querySelector("#characterDropdownTable tbody tr:not([style*='display: none'])");
                if (tr){
                    window.location.href = tr.id;
                };
            };
        });
    };

};


async function charactersMenuClose(){
    const menu = document.querySelector("#btnCharacters");
    menu.classList.remove("menu-open");
    GM_addStyle (`#charactersDiv {animation: rewindTravel 0.25s ease forwards;}`)
    GM_addStyle (`@keyframes rewindTravel {0% {height:535px;position:fixed;top:48px;} 100% {height:0px;position:fixed;top:0px;}}`)
}


async function tiles(){
    GM_addStyle(`
        div.alert-tile-bar {
            display:inline-block;
            padding-left:3px !important;
            padding-right:3px !important;
            padding-bottom:5px !important;
            padding-top:6px !important;
            border:3px SOLID #19191A;
            text-align:center;
            font-size:11px;
            border-top-width:3px !important;
            margin-right:1px;
            margin-left:1px;
            height:46px;
            border-top-left-radius:10px !important;
            border-top-right-radius:10px !important;
            border-bottom-left-radius:0px !important;
            border-bottom-right-radius:0px !important;
            font-family:monospace;
            animation: fadeIn 1s ease-in-out forwards;
            box-shadow: 0 0 5px rgba(0, 0, 0, 1), 0 0 10px rgba(0, 0, 0, 1), 0 0 15px rgba(0, 0, 0, 1);
            bottom: 24px;
            transition:transform 0.4s ease-in-out;
        }
        div.alert-tile-bar:hover {
            transform: scale(1.75) translateY(-8px);
            z-index: 9999;
        }
    `)

    const endpoints = ['myaccount','gladiator','primegods','crew_bossspawns','supplies','event?eventid=top','event?eventid=woz'];
    const responses = await Promise.all(endpoints.map(endpoint => superfetch(endpoint)));

    if (responses[1] == "error"){
        return;
    };

    const tileEvents = [];
    const tileGods = [];
    const tileBosses = [];
    const tileGlad = [];
    const now = Math.round(new Date().getTime())

    const rgaTrade = responses[0].match(/<a href="trade\?suid=([0-9]+)&serverid=[0-9]+"><img border="0" height="13" src="[^"]*" alt="Trade">/i)
    if (rgaTrade){
        tileEvents.push(`<a href="trade?suid=${rgaTrade[1]}"><img class="tile-still" src="https://studiomoxxi.com/moxximod/newTrade.webp" onmouseover="statspopup(event,'<b>RGA Alert</b><br>Pending trade')" onmouseout="kill()"></a>`)
    };
    const crewTrade = responses[0].match(/a href="\/trade\?isCrewTrade=1"/i)
    if (crewTrade){
        tileEvents.push(`<a href="trade?isCrewTrade=1"><img class="tile-still" src="https://studiomoxxi.com/moxximod/newCrewTrade.webp" onmouseover="statspopup(event,'<b>RGA Alert</b><br>Pending crew trade')" onmouseout="kill()"></a>`)
    };

    const parseData = new DOMParser();
    const gladiator = parseData.parseFromString(responses[1], 'text/html');
    const divs = gladiator.querySelectorAll('.divQuest');
    for (var g = 0; g < divs.length; g++){
        const divContent = divs[g].innerHTML.replace(/[\n\r]/g,'');
        if (divContent.match('Will retreat in')){
            const gladName = divContent.match(/event,'Find (.*?)!'/i)[1];
            const gladImg = divContent.match(/src="([^"]*)"/i)[1];
            const gladInfo = divContent.match(/<\/div> <div class="divQuestMob"> <a href="[^"]*"><img onmouseover="popup\(event,'Find (.*?)!',1\);" onmouseout="kill\(\);" src="([^"]*)"><\/a>/i)
            const gladLink = divContent.match(/<a href="(gladiator\?mobid=[0-9]+)">/i)[1]
            const godHtmlId = gladName.replace(/ /g,'').replace(/,/g,'')
            const retreatsIn = parseInt(divContent.match(/countdown = ([0-9]+)/i)[1])*1000
            const timeRemaining = Math.ceil((retreatsIn-now)/(3.6e+6))
            let classEffect;
            if (timeRemaining <= 24){
                classEffect = "tile-animate"
            } else {
                classEffect = "tile-still"
            };
            tileGlad.push(`<a href="${gladLink}"><img onmouseout="kill()" onmouseover="statspopup(event,'<b>${gladName}</b><br>Retreats in ${timeRemaining} hours')" src="${gladImg}" class="${classEffect}" id="${godHtmlId}"></a>`)
        };
    };

    const spawnedGodsArray = [];
    const primeParser = new DOMParser();
    const primeGods = primeParser.parseFromString(responses[2], 'text/html');
    const mobBox = primeGods.querySelectorAll('span.mobbox:not(.grey)');
    if (mobBox) {
        for (var i = 0; i < mobBox.length; i++){
            const mob = mobBox[i]
            const link = mob.innerHTML.match(/primegods\?mobid=[0-9]+/i);
            const name = mob.innerHTML.match(/event,'([^']*)'/i)[1];
            const img = mob.innerHTML.match(/src="([^"]*)"/i)[1];
            spawnedGodsArray.push(name);
            const time = ((parseFloat(mob.innerHTML.match(/style="width: (.*?)%"/i)[1]))/100*23).toFixed(1);
            const timePercent = Math.ceil(time/23*100);
            let classEffect;
            if (time <= 2){
                classEffect = "tile-animate"
            } else {
                classEffect = "tile-still"
            };
            tileGods.push(`<a href="${link}"><img onmouseout="kill()" onmouseover="statspopup(event,'<b>Prime god spawned!</b><br>${name}<br>${time} hours remaining')" src="${img}" class="${classEffect}"></a>`);
        };
    };

    if ((GM_getValue("untilbrawl") == undefined && GM_getValue("brawlends") == undefined) || (GM_getValue("untilbrawl") <= now || GM_getValue("brawlends") <= now)){
        const closedPvp = await superfetch('closedpvp');
        const countdownBrawl = parseInt(closedPvp.match(/var countdown = ([0-9]+)/i)[1])*1000
        if (closedPvp.match('Brawl ends in')){
            GM_setValue("brawlends",countdownBrawl);
            GM_deleteValue("untilbrawl");
        } else {
            GM_setValue("untilbrawl",countdownBrawl);
            GM_deleteValue("brawlends");
        };
    };
    let brawlMsg; let brawlTimer; let brawlStyle;
    if (GM_getValue("untilbrawl") >= now){
        brawlMsg = "Brawl</b> starts in"
        brawlTimer = GM_getValue("untilbrawl");
        brawlStyle = 'filter:grayscale(100%);'
    } else {
        brawlMsg = "Brawl</b> ends in"
        brawlTimer = GM_getValue("brawlends");
        brawlStyle = ''
    };
    const differenceBrawl = (brawlTimer-now)/(3.6e+6)
    if (differenceBrawl <= 72){
        tileEvents.push(`<a href="closedpvp?type=1"><img class="tile-still" src="https://studiomoxxi.com/moxximod/newBrawl90.webp" onmouseover="statspopup(event,'<b>Level 95 ${brawlMsg} ${Math.ceil(differenceBrawl)} hours')" onmouseout="kill()" style="${brawlStyle}"></a>`)
        tileEvents.push(`<a href="closedpvp"><img class="tile-still" src="https://studiomoxxi.com/moxximod/newBrawl.webp" onmouseover="statspopup(event,'<b>Level 85 ${brawlMsg} ${Math.ceil(differenceBrawl)} hours')" onmouseout="kill()" style="${brawlStyle}"></a>`)
    };

    const aliveBosses = responses[3].replace(/[\n\r]/g,'').match(/a href="formraid\.php\?target=[0-9]+".*?<a href="boss_stats\.php\?spawnid=[0-9]+">/g);
    if (aliveBosses){
        for (let i = 0; i <= aliveBosses.length-1; i++) {
            const boss = aliveBosses[i]
            const bossName = boss.match(/<h[0-9]+ class="card-user_name">(.*?)<\/h3>/i)[1];
            const bossHealth = boss.replace(/\s+/g,'').match(/<pclass="card-user_occupation">([0-9]+)%/i)[1];
            const bossImg = boss.match(/src="([^"]*)"/i)[1]
            const bossId = boss.match(/boss_stats\.php\?spawnid=([0-9]+)/i)[1]
            let classEffect;
            if (bossHealth <= 10){
                classEffect = "tile-animate"
            } else {
                classEffect = "tile-still"
            };
            tileBosses.push(`<a href="boss_stats.php?spawnid=${bossId}"><img class="${classEffect}" src="${bossImg}" onmouseover="statspopup(event,'<b>${bossName}</b><br>Health: ${bossHealth}%<br>(click for stats)')" onmouseout="kill()"></a>`)
        };
    };

    const supplies = parseInt(responses[4].replace(/\s/g,'').match(/<imgborder="0"src="images\/suppliestriangle\.gif"width="11"height="11">([0-9]+)%<\/td>/i)[1]);
    if (supplies < 100){
        tileEvents.push(`<a href="javascript:void(0);" id="maxSupplies"><img src="https://studiomoxxi.com/moxximod/newSupplies.webp" class="tile-still" onmouseover="popup(event,'<b>Supplies: ${supplies}%</b><br>(Click to max)')" onmouseout="kill()"></a>`)
    };

    const strength = parseInt(document.body.innerHTML.match(/'Strength: ([0-9]+)'/i)[1])
    if (strength < 100){
        tileEvents.push(`<a href="javascript:void(0);"><img src="https://studiomoxxi.com/moxximod/newStrength.webp" class="tile-still" onmouseover="popup(event,'<b>Strength: ${strength}%</b>')" onmouseout="kill()"></a>`)
    };

    if (responses[5].match(/var countdown = ([0-9]+)/i)){
        const countdownTOP = parseInt(responses[5].match(/var countdown = ([0-9]+)/i)[1])*1000
        const differenceTOP = (countdownTOP-now)/(3.6e+6)
        if (differenceTOP <= 336){
            tileEvents.push(`<a href="event?eventid=top"><img class="tile-still" src="https://studiomoxxi.com/moxximod/newEvents.webp" onmouseover="statspopup(event,'<b>Trial of Power</b><br>${Math.ceil(differenceTOP)} hours</b>')" onmouseout="kill()"></a>`)
        };
    };

    if (responses[6].match(/var countdown = ([0-9]+)/i)){
        const countdownWOZ = parseInt(responses[6].match(/var countdown = ([0-9]+)/i)[1])*1000
        const differenceWOZ = (countdownWOZ-now)/(3.6e+6)
        if (differenceWOZ <= 336){
            tileEvents.push(`<a href="event?eventid=woz"><img class="tile-still" src="https://studiomoxxi.com/moxximod/newEvents.webp" onmouseover="statspopup(event,'<b>War of Zhul</b><br>${Math.ceil(differenceWOZ)} hours</b>')" onmouseout="kill()"></a>`)
        };
    };

    //if (responses[7].match(/Currently Storing <b>[0-9]+ \/ [0-9]+<\/b> Items/i)){
        //const currentlyStoring = responses[7].match(/Currently Storing <b>([0-9]+) \/ ([0-9]+)<\/b> Items/i);
        //const current = parseInt(currentlyStoring[1]);
        //const capacity = parseInt(currentlyStoring[2]);
        //if (capacity <= current){
            //tileEvents.push(`<a href="crew_vault"><img class="tile-still" src="https://studiomoxxi.com/moxximod/newCrewVault.webp" onmouseover="statspopup(event,'<b>Crew Vault is Full!</b><br>${current} / ${capacity}</b>')" onmouseout="kill()"></a>`)
        //};
    //};


    var checkElementInterval = setInterval(function() {
        var targetElement = document.querySelector("body > center > div.sub-header-container > header");
        if (targetElement) {

            const tilesAll = [];
            if (tileEvents.length > 0){
                tilesAll.push(`<div class="list-group-item alert-tile-bar" id="tilesDivEvents">${tileEvents.join('')}</div>`);
            }
            if (tileGods.length > 0){
                tilesAll.push(`<div class="list-group-item alert-tile-bar">${tileGods.join('')}</div>`);
            }
            if (tileBosses.length > 0){
                tilesAll.push(`<div class="list-group-item alert-tile-bar">${tileBosses.join('')}</div>`);
            }
            if (tileGlad.length > 0){
                tilesAll.push(`<div class="list-group-item alert-tile-bar">${tileGlad.join('')}</div>`);
            }

            if ((!url.match("home") || url.match("crew_home"))) {
                document.querySelector("#toolbarTiles").innerHTML = tilesAll.join('')
            };

            if (document.querySelector("#maxSupplies")){
                document.querySelector("#maxSupplies").addEventListener("click", maxSupplies);
            };

            clearInterval(checkElementInterval);
        };
    }, 500);

    const homeTilesContainer = document.querySelector("#homeTilesContainer");
    if (url.match("home") && homeTilesContainer) {
        document.querySelector("#homeTilesContainer").innerHTML = `${tileEvents.join('')}${tileBosses.join('')}${tileGlad.join('')}${tileGods.join('')}`
    };

};


async function maxSupplies(){
    fetch('supplies', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: new URLSearchParams({'buymax': 'Buy Max',})})
    document.querySelector("#maxSupplies").remove();
    const tileHealthDiv = document.querySelector("#tileHealthDiv");
    if (tileHealthDiv){
        if (!tileHealthDiv.innerHTML.match('tile')){
            tileHealthDiv.remove();
        };
    }
    const homepageTiles = document.querySelector("#homeTilesContainer");
    if (!homepageTiles){
        if (document.querySelectorAll("#tilesDivEvents img").length == 0){
            document.querySelector("#tilesDivEvents").remove();
        };
    };
};


async function travelMenu(rgaName,charId,serverNo,profileData) {
    casterMenuClose();
    appsMenuClose();
    searchMenuClose();

    const menu = document.querySelector("#btnTravel");
    if (!menu.classList.contains("menu-created")) {
        await travelMenuBuild(profileData);
        menu.classList.add("menu-created");
    }
    if (menu.classList.contains("menu-open")) {
        await travelMenuClose();
    } else {
        await travelMenuOpen(rgaName,charId,serverNo);
        menu.classList.add("menu-open");
        menu.classList.remove("menu-close");
    };
};

async function travelMenuOpen(rgaName,charId,serverNo){
    const server = serverNo == "1" ? "sigil" : "torax";

    document.querySelector("#btnTravel > img").classList.toggle('rotate180');
    GM_addStyle (`#btnTravel > img {transition: transform 0.5s ease;}`)
    GM_addStyle (`.rotate180 {transform: rotate(180deg);}`)

    if (!GM_getValue("auth").match("Full")){
        GM_addStyle (`a.plus-destination{opacity:0.25;}`)
        const plusOnly = document.querySelectorAll("a.plus-destination")
        for (let i = 0; i < plusOnly.length; i++) {
            plusOnly[i].innerHTML = `<img src="https://studiomoxxi.com/moxximod/toolbarbot.png" class="travel-img">MM+ REQUIRED`
        };
    };

    GM_addStyle (`#travelDiv {animation: moveAnimation 0.5s ease forwards;position:fixed;}`)
    GM_addStyle (`@keyframes moveAnimation {0% {width:370px;height:0px;position:fixed;top:0px;} 100% {width:370px;height:535px;position:fixed;top:45px;}}`)

    document.querySelector("#travelRoomNum").addEventListener("keyup", async function(event) {
        if (event.keyCode === 13) {
            const roomNum = document.querySelector("#travelRoomNum").value
            await goToRoomNum(server,charId,roomNum)
        };
    });

    const travelTeleporterArray = document.querySelectorAll(".travel-teleporter");
    for (let i = 0; i < travelTeleporterArray.length; i++) {
        var teleporter = travelTeleporterArray[i];
        const keyName = teleporter.innerHTML.match(/alt="([^"]*)"/i)[1];
        teleporter.addEventListener("click", async function() {
            await activateKeyFromBp(server,rgaName,charId,serverNo,keyName);
            window.location.href = "world"
        });
    };
    const plusDestinationArray = document.querySelectorAll(".plus-destination");
    for (let i = 1; i < plusDestinationArray.length; i++) {
        var room = plusDestinationArray[i];
        const roomNum = room.innerHTML.match(/alt="([^"]*)"/i)[1];
        room.addEventListener("click", async function() {
            await goToRoomNum(server,charId,roomNum);
        });
    };
}


async function developer(){

    GM_addStyle(`
        #devDiv{ color: #e3e3e3; padding-left: 0.5rem; background-color:#282828; overflow-y:auto; overflow-x:hidden; max-height:200px; min-height:200px; font-family:monospace;padding-top: 0.25rem; }
        #developer{ width:98%; bottom: 2%; left: 1% !important; z-index:600 !important; box-shadow: 5px 1px 20px 15px rgba(0,0,0,1) }
        #developer_handle { width:100% !important; background-color:#000000;color:#e3e3e3; }
        #clearLogs { cursor: pointer; }
        #devDiv > hr { margin-top: 2px; margin-bottom: 2px; border-top: 1px solid #5e5e5e; }
    `);

    GM_setValue('developer','on');

    createWindow(`Developer Logs <span id="clearLogs">[clear]</span>`, "developer", 1, 200);
    const pop = document.querySelector("#developer_content");

    document.querySelector("#developer").style.removeProperty("top");

    pop.innerHTML = `<div id="devDiv"></div>`;

    await developerPrint();

    document.querySelector("#clearLogs").addEventListener('click', async ()=> {
        GM_deleteValue('developerLog');
        document.querySelector("#devDiv").innerHTML = "";
    });

    document.querySelector('img[src="/images/x.jpg"]').addEventListener('click', async ()=> { await turnOffDev() });
    async function turnOffDev(){ GM_setValue('developer','off') };

    await developerProcess()
};

async function developerProcess(){


    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const [input, init] = args;
        const method = init?.method || "GET";
        const url = typeof input === "string" ? input : input.url;
        developerPrint(`${method}: ${url}`);
        return await originalFetch.apply(this, args);
    };


    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        this._requestUrl = url;
        return originalOpen.call(this, method, url, ...rest);
    };
    XMLHttpRequest.prototype.send = function(body) {
        const fetchUrl = this._requestUrl;
        developerPrint(`HTTP: ${fetchUrl}`);
        return originalSend.call(this, body);
    };


    window.onerror = function(message, source, lineno, colno, err) {
        const error = err || new Error(message);
        developerPrint(`<font color="#FF0000">${error}</font>`);
        return false;
    };


    window.addEventListener("unhandledrejection", function(event) {
        const error = event.reason instanceof Error ? event.reason : new Error(event.reason);
        const line = event.reason.stack.match(/:([0-9]+):[0-9]+/i)?.[1] || "Unknown";
        developerPrint(`${error} (MoxxiMod line ${line})`, "FF0000");
    });


    const originalGMRequest = GM_xmlhttpRequest;
    GM_xmlhttpRequest = function(details) {
        const method = details.method || 'GET';
        const data = details.data;
        if (method === 'POST') {
            developerPrint(`MOXXIMOD: ${data}`);
        };
        return originalGMRequest(details);
    };

};

async function developerPrint(msg, color = "e3e3e3"){

    const onOffCheck = GM_getValue('developer')
    if (onOffCheck != "on"){
        return;
    };

    const arr = JSON.parse(GM_getValue('developerLog', '[]'))
    if (msg){

        const now = (new Date()).toString().replace(/GMT.*?$/, '');

        arr.push(`<font color="#${color}">${now} ${msg}</font>`);
        GM_setValue("developerLog", JSON.stringify(arr));
    };
    document.querySelector("#devDiv").innerHTML = arr.reverse().slice(0, 200).join('<hr>');
};

async function travelMenuBuild(profileData){

    const fastTravelHtml = `
    <input style="width:300px;" id="travelRoomNum" type="text" placeholder="ENTER ROOM #" class="form-control-new travel-destination plus-destination" autocomplete="off">
    <a href="javascript:void(0);" class="form-control-new travel-destination plus-destination"><img alt="36195" class="travel-img" src="images/mobs/mobl7.jpg">AEZEL, GARDEN MANIC</a>
    <a href="javascript:void(0);" class="form-control-new travel-destination plus-destination"><img alt="1066" class="travel-img" src="images/mobs/aiyuken.png">AIYUKEN</a>
    <a href="javascript:void(0);" class="form-control-new travel-destination travel-teleporter"><img alt="Astral Ward" class="travel-img" src="images/items/saveitem2.jpg">ASTRAL RIFT</a></a>
    <a href="javascript:void(0);" class="form-control-new travel-destination travel-teleporter"><img alt="Astral Teleporter" class="travel-img" src="images/items/astralteleporter.png">ASTRAL RUINS</a>
    <a href="world.php?room=25989" class="form-control-new travel-destination"><img class="travel-img" src="images/rooms/tile_chaltoken.jpg">CHALLENGE ARENA</a>
    <a href="javascript:void(0);" class="form-control-new travel-destination plus-destination"><img alt="32877" class="travel-img" src="images/mobs/chaosgolem4.jpg">CHAOS GOLEMS</a>
    <a href="javascript:void(0);" class="form-control-new travel-destination travel-teleporter"><img alt="Sanctum Key" class="travel-img" src="images/rooms/tile_badge.jpg">CITY SANCTUM</a>
    <a href="javascript:void(0);" class="form-control-new travel-destination plus-destination"><img alt="26201" class="travel-img" src="images/mobs/runenpc4.jpg">ELEMENTAL OVERLORD</a>
    <a href="javascript:void(0);" class="form-control-new travel-destination plus-destination"><img class="travel-img" id="travelEliteAntogonist">ELITE ANTAGONIST</a>
    <a href="javascript:void(0);" class="form-control-new travel-destination plus-destination"><img alt="50" class="travel-img" src="images/rooms/tile_glad1.png">GLADIATOR ARENA</a>
    <a href="javascript:void(0);" class="form-control-new travel-destination plus-destination"><img alt="28040" class="travel-img" src="images/rooms/tile_infinity.png">INFINITE TOWER</a>
    <a href="world.php?room=11" class="form-control-new travel-destination"><img class="travel-img" src="images/4way.jpg">INTERSECTION ROOM 11</a>
    <a href="javascript:void(0);" class="form-control-new travel-destination plus-destination"><img class="travel-img" id="travelPrecisionAdversary">PRECISION ADVERSARY</a>
    <a href="javascript:void(0);" class="form-control-new travel-destination plus-destination"><img alt="28123" class="travel-img" src="images/mobs/mobm91.jpg">PRISON: HOVOK</a>
    <a href="javascript:void(0);" class="form-control-new travel-destination travel-teleporter"><img alt="Grove Insignia" class="travel-img" src="images/rooms/tile_tgrove.png">TWILIGHT GROVE</a>
    <a href="javascript:void(0);" class="form-control-new travel-destination travel-teleporter"><img alt="Triworld Teleporter" class="travel-img" src="images/rooms/tile_doorts2.png">TRIWORLD SANCTUARY</a>
    <a href="javascript:void(0);" class="form-control-new travel-destination plus-destination"><img alt="42550" class="travel-img" src="images/rooms/tile_vault.png">VAULT OF MADNESS</a>
    <a href="javascript:void(0);" class="form-control-new travel-destination travel-teleporter"><img alt="Veiled Teleporter" class="travel-img" src="images/items/veiledtp.png">VEILED PASSAGE</a>
    <a href="javascript:void(0);" class="form-control-new travel-destination travel-teleporter"><img alt="Veldara Teleporter" class="travel-img" src="images/items/veldarateleporter.jpg">VELDARA GARRISON</a>
    `

    var image = document.querySelector("#btnTravel").getBoundingClientRect();
    var newDiv = document.createElement('div');
    newDiv.id = 'travelDiv';
    newDiv.classList.toggle('widget');
    newDiv.innerHTML = fastTravelHtml;
    newDiv.style.position = 'absolute';
    newDiv.style.top = image.top + window.scrollY + 'px';
    newDiv.style.left = image.left + window.scrollX-320 + 'px';
    document.body.appendChild(newDiv);

    if (profileData.faction == "Vordyn"){
        document.querySelector("#travelEliteAntogonist").setAttribute('alt', '43049');
        document.querySelector("#travelEliteAntogonist").setAttribute('src', 'images/mobs/owmob129.png');
        document.querySelector("#travelPrecisionAdversary").setAttribute('alt', '43500');
        document.querySelector("#travelPrecisionAdversary").setAttribute('src', 'images/mobs/owmob1129.png');
    } else if (profileData.faction == "Alvar"){
        document.querySelector("#travelEliteAntogonist").setAttribute('alt', '43173');
        document.querySelector("#travelEliteAntogonist").setAttribute('src', 'images/mobs/owmob1058.png');
        document.querySelector("#travelPrecisionAdversary").setAttribute('alt', '43504');
        document.querySelector("#travelPrecisionAdversary").setAttribute('src', 'images/mobs/owmob784.png');
    } else if (profileData.faction == "Delruk"){
        document.querySelector("#travelEliteAntogonist").setAttribute('alt', '42903');
        document.querySelector("#travelEliteAntogonist").setAttribute('src', 'images/mobs/owmob1050.png');
        document.querySelector("#travelPrecisionAdversary").setAttribute('alt', '43502');
        document.querySelector("#travelPrecisionAdversary").setAttribute('src', 'images/mobs/owmob176.png');
    } else {
        document.querySelector("#travelEliteAntogonist").parentElement.remove();
        document.querySelector("#travelPrecisionAdversary").parentElement.remove();
    }
};


async function goToRoomNum(server,charId,roomNum){
    await loadingOverlay();
    await travelMenuClose();
    const send = await mmplus(`GoToRm|rganame|${server}|${charId}|${roomNum}`);
    if (send.match('Full')){


        async function endlessLoop() {
            const data = await superfetch('ajax_changeroomb.php',true);
            if (data.match(/"curRoom":"([0-9]+)"/i)[1] == roomNum) {
                window.location.href = "world"
                return;
            };
            setTimeout(endlessLoop, 250);
        };
        endlessLoop();
    } else {
        await loadingOff();
    };
};


async function activateKeyFromBp(server,rgaName,charId,serverNo,keyName){
    const kbp = await superfetch(`https://${server}.outwar.com/ajax/backpackcontents.php?rg_sess_id=${rgaName}&suid=${charId}&serverid=${serverNo}&tab=key`);
    if (!kbp.match(keyName)){
        alert('ERROR: You do not have the teleporter needed')
    } else {
        const dataIid = (await backpack(kbp,keyName)).iid;
        const teleporter = new URLSearchParams({ 'action': 'activate', 'itemids[]': dataIid });
        await superpost(`https://${server}.outwar.com/ajax/backpack_action.php?rg_sess_id=${rgaName}&suid=${charId}&serverid=${serverNo}`,teleporter.toString());
    };
};


async function appsMenu(rgaName,charId,serverNo,profileData) {
    travelMenuClose();
    casterMenuClose();
    searchMenuClose();

    const menu = document.querySelector("#btnApps");
    if (!menu.classList.contains("menu-created")) {
        await appsMenuBuild(rgaName,charId,serverNo);
        menu.classList.add("menu-created");
    }
    if (menu.classList.contains("menu-open")) {
        await appsMenuClose();
    } else {
        await appsMenuOpen(rgaName,charId,serverNo);
        menu.classList.add("menu-open");
        menu.classList.remove("menu-close");
    };
};


async function appsMenuOpen(rgaName,charId,serverNo) {

    document.querySelector("#btnApps > img").classList.toggle('rotate180');
    GM_addStyle (`#btnApps > img {transition: transform 0.5s ease;}`)
    GM_addStyle (`.rotate180 {transform: rotate(180deg);}`)

    GM_addStyle (`#appsDiv {animation: moveAnimation 0.5s ease forwards;position:fixed;}`)
    GM_addStyle (`@keyframes moveAnimation {0% {width:535px;height:0px;position:fixed;top:0px;} 100% {width:535px;height:535px;position:fixed;top:45px;}}`)
};

async function appsMenuBuild(rgaName,charId,serverNo){
    const server = serverNo == "1" ? "sigil" : "torax";
    const serverOther = server == "sigil" ? "torax" : "sigil";
    const serverOtherNo = server == "sigil" ? "2" : "1";

    const appsHtml = `
    <div class="appDiv" id="authApp"><img src="https://studiomoxxi.com/moxximod/authenticateicon.webp" class="app-img"><p>AUTHENTICATE</div>
    <div class="appDiv" id="backpackApp"><img src="https://studiomoxxi.com/moxximod/bpicon.webp" class="app-img"><p>BACKPACKS</div>
    <div class="appDiv plus-app" id="reportBadge"><img src="images/items/badge4d.png" class="app-img"><p>BADGE REPORT</div>
    <div class="appDiv plus-app" id="reportChaos"><img src="https://studiomoxxi.com/moxximod/chaosicon.webp" class="app-img"><p>CHAOS REPORT</div>
    <div class="appDiv plus-app" id="chaosTeles"><img src="https://studiomoxxi.com/moxximod/chaosteleicon.webp" class="app-img"><p>CHAOS TELES</div>
    <div class="appDiv" id="goToDiscord"><img src="https://studiomoxxi.com/moxximod/discordicon.png" class="app-img"><p>DISCORD</div>
    <div class="appDiv plus-app" id="reportEnhancer"><img src="https://studiomoxxi.com/moxximod/enhanceicon.webp" class="app-img"><p>ENHANCER REPORT</div>
    <div class="appDiv" id="calculatorApp"><img src="https://studiomoxxi.com/moxximod/exchangeicon.webp" class="app-img"><p>EXCHANGE RATES</div>
    <div class="appDiv" id="exportRgaNew"><img src="https://studiomoxxi.com/moxximod/exporticon.webp" class="app-img"><p>EXPORT RGA</div>
    <div class="appDiv plus-app" id="gladiatorApp"><img src="https://studiomoxxi.com/moxximod/gladicon.png" class="app-img"><p>GLADIATORS</div>
    <div class="appDiv" id="illusionsApp"><img src="https://studiomoxxi.com/moxximod/illusionicon.webp" class="app-img"><p>ILLUSIONS</div>
    <div class="appDiv" id="itemStorage"><img src="https://studiomoxxi.com/moxximod/storageicon.png" class="app-img"><p>INVENTORY</div>
    <div class="appDiv plus-app" id="itemAnalyzer"><img src="https://studiomoxxi.com/moxximod/itemmanageicon.webp" class="app-img"><p>ITEM UPGRADES</div>
    <div class="appDiv plus-app" id="reportLing"><img src="https://studiomoxxi.com/moxximod/lingicon.webp" class="app-img"><p>LING REPORT</div>
    <div class="appDiv plus-app" id="mobAttacker"><img src="landing/atkicon.png" class="app-img"><p>MOB ATTACKER</div>
    <div class="appDiv" id="moxxiVision"><img src="https://studiomoxxi.com/moxximod/sm%20icon.webp" class="app-img"><p>MOXXIVISION</div>
    <div class="appDiv" id="themeApp"><img src="https://studiomoxxi.com/moxximod/themeicon.png" class="app-img"><p>OUTWAR THEME</div>
    <div class="appDiv plus-app" id="primeRaider"><img src="https://studiomoxxi.com/moxximod/moxxiraidernewicon.webp" class="app-img"><p>MOXXI+ RAIDER</div>
    <div class="appDiv plus-app" id="raidsReport"><img src="https://studiomoxxi.com/moxximod/raidreporticon.webp" class="app-img"><p>RAIDS REPORT</div>
    <div class="appDiv plus-app" id="reportRune"><img src="https://studiomoxxi.com/moxximod/runeicon.webp" class="app-img"><p>RUNE REPORT</div>
    <div class="appDiv plus-app" id="savedRgas"><img src="https://studiomoxxi.com/moxximod/usersicon.png" class="app-img"><p>SAVED RGAS</div>
    <div class="appDiv" id="serverSwitch"><img src="https://studiomoxxi.com/moxximod/appSwitch${serverOther}.webp" class="app-img"><p><span id="serverSwitchSpan">X</span></div>
    <div class="appDiv" id="questreportApp"><img src="images/toolbar/Quests.png" class="app-img"><p>UNFINISHED QUESTS</div>
    <div class="appDiv" id="wildernessApp"><img src="https://studiomoxxi.com/moxximod/wildernessicon.webp" class="app-img"><p>WILDERNESS</div>
    <div class="appDiv plus-app" id="catalystReport"><img src="https://studiomoxxi.com/moxximod/factions_app.png" class="app-img"><p>CATALYST REPORT</div>
    `

    var image = document.querySelector("#btnApps").getBoundingClientRect();
    var newDiv = document.createElement('div');
    newDiv.id = 'appsDiv';
    newDiv.classList.toggle('widget');
    newDiv.innerHTML = appsHtml;
    newDiv.style.position = 'absolute';
    newDiv.style.top = image.top + window.scrollY + 'px';
    newDiv.style.left = image.left + window.scrollX-485 + 'px';
    document.body.appendChild(newDiv);

    if (!GM_getValue("auth").match("Full")){
        GM_addStyle (`div.plus-app{opacity:0.25;}`)
    };

    document.querySelector("#serverSwitchSpan").innerHTML = "TO " + serverOther.toUpperCase();
    document.querySelector("#serverSwitch").addEventListener('click', async function(){
        const ajax = await superfetch(`ajax/accounts.php?t_serv=${serverOtherNo}`);
        const id = (ajax.match(/"id":"([0-9]+)"/i) || ['0','0'])[1];
        if (id == '0'){
            alert(`ERROR: No ${serverOther} chars found`);
        } else {
            window.location.href = `https://${serverOther}.outwar.com/world?suid=${id}&serverid=${serverOtherNo}`
        };
    });

    document.querySelector("#authApp").addEventListener('click',async function(){
        await appsMenuClose();
        await mmplus('AuthCheck|rganame');
    });
    document.querySelector("#exportRgaNew").addEventListener('click',async function(){
        await blankOverlay(server,serverNo,rgaName,charId);
        await appExportRgaNew(server,serverNo,rgaName,charId);
    });
    document.querySelector("#itemStorage").addEventListener('click',async function(){
        await blankOverlay(server,serverNo,rgaName,charId);
        await appItemStorage(server,serverNo,rgaName,charId);
    });
    document.querySelector("#illusionsApp").addEventListener('click',async function(){
        await blankOverlay(server,serverNo,rgaName,charId);
        await appIllusions(server,serverNo,rgaName,charId);
    });
    document.querySelector("#chaosTeles").addEventListener('click',async function(){
        await blankOverlay(server,serverNo,rgaName,charId);
        await appChaosTeles(server);
    });
    document.querySelector("#wildernessApp").addEventListener('click',async function(){
        await blankOverlay(server,serverNo,rgaName,charId);
        await appWilderness(server,serverNo,rgaName,charId);
    });
    document.querySelector("#savedRgas").addEventListener('click',async function(){
        await blankOverlay(server,serverNo,rgaName,charId);
        await appSavedRgas(server,serverNo,rgaName,charId);
    });
    document.querySelector("#questreportApp").addEventListener('click',async function(){
        window.location.href = "treasury.php?type=questreport"
    });
    document.querySelector("#itemAnalyzer").addEventListener('click',async function(){
        await blankOverlay(server,serverNo,rgaName,charId);
        await appItemAnalyzer(server,serverNo,rgaName,charId);
    });
    document.querySelector("#mobAttacker").addEventListener('click',async function(){
        await blankOverlay(server,serverNo,rgaName,charId);
        await appMobAttacker(server,serverNo,rgaName,charId);
    });
    document.querySelector("#primeRaider").addEventListener('click',async function(){
        window.location.href = "primegods?type=moxxiraider"
    });
    document.querySelector("#gladiatorApp").addEventListener('click',async function(){
        await blankOverlay(server,serverNo,rgaName,charId);
        await appGladiator(server,serverNo,rgaName,charId);
    });
    document.querySelector("#raidsReport").addEventListener('click',async function(){
        await blankOverlay(server,serverNo,rgaName,charId);
        await appRaidsReport(server,serverNo,rgaName,charId);
    });

    document.querySelector("#backpackApp").addEventListener('click',async function(){
        await blankOverlay(server,serverNo,rgaName,charId);
        await appBackpack(server,serverNo,rgaName,charId);
    });

    document.querySelector("#calculatorApp").addEventListener('click',async function(){
        await blankOverlay(server,serverNo,rgaName,charId);
        await appCalculator(server,serverNo,rgaName,charId);
    });

    document.querySelector("#moxxiVision").addEventListener('click',async function(){
        window.location.href = "treasury.php?type=vision"
    });
    document.querySelector("#themeApp").addEventListener('click',async function(){
        await appCustomTheme();
    });
    document.querySelector("#reportBadge").addEventListener('click',async function(){
        await appsMenuClose();
        await mmplus(`BadgeNeeds|rganame|${server}`);
    });
    document.querySelector("#reportChaos").addEventListener('click',async function(){
        await appsMenuClose();
        await mmplus(`ChaosNeeds|rganame|${server}`);
    });
    document.querySelector("#reportRune").addEventListener('click',async function(){
        await appsMenuClose();
        await mmplus(`RuneNeeds|rganame|${server}`);
    });
    document.querySelector("#reportEnhancer").addEventListener('click',async function(){
        await appsMenuClose();
        await mmplus(`EnhanceNeeds|rganame|${server}`);
    });
    document.querySelector("#reportLing").addEventListener('click',async function(){
        await appsMenuClose();
        await mmplus(`LingNeeds|rganame|${server}`);
    });
    document.querySelector("#catalystReport").addEventListener('click',async function(){
        await appsMenuClose();
        await mmplus(`FactionNeeds|rganame|${server}`);
    });
    document.querySelector("#goToDiscord").addEventListener('click',async function(){
        window.open("https://discord.com/invite/f35cccbWU8?utm_source=Discord%20Widget&utm_medium=Connect", "_blank");
    });
}

async function appExportRgaNew(server,serverNo,rgaName,charId){
    GM_addStyle(`
        #overlayWidget{text-align:center;padding:3rem}
        #exportRgaTxt{width:80%;font-size:36px;margin-top:1rem;text-align:center;height:100px;}
    `)

    document.querySelector("#overlayWidget").innerHTML = '<img src="https://studiomoxxi.com/moxximod/loading-gif.gif" style="height:100px;width:100px">'

    const chars = await superfetch(`ajax/accounts.php?t_serv=${serverNo}`);
    const ids = chars.match(/"id":"[0-9]+"/g).map(id => id.match(/[0-9]+/)[0]);

    const rows = [];
    const tots = { lvl: 0,loyalty:0,exp:0,power:0,ele:0,chaos:0,mr:0,rpt:0,res:0,atk:0,hp:0,slayer:0,wilderness:0 }
    const getRgaCharDataForExport = async (id) => {
        const profileData = await superfetchProfile(`profile?suid=${id}`);
        const name = '<td>' + profileData.name + '</td>'
        tots.lvl += profileData.level;
        const lvl = '<td>' + profileData.level + '</td>'
        const faction = `<td class="faction-${profileData.faction}">` + profileData.faction + '</td>'
        tots.loyalty += profileData.loyalty;
        const loyalty = `<td class="faction-${profileData.faction}">` + profileData.loyalty + '</td>'
        tots.exp += profileData.exp;
        const exp = '<td>' + profileData.exp.toLocaleString() + '</td>'
        tots.power += profileData.power;
        const power = '<td>' + profileData.power.toLocaleString() + '</td>'
        tots.ele += profileData.elemental;
        const ele = '<td>' + profileData.elemental.toLocaleString() + '</td>'
        tots.chaos += profileData.chaos;
        const chaos = '<td>' + profileData.chaos.toLocaleString() + '</td>'
        tots.mr += profileData.maxrage;
        const mr = '<td>' + profileData.maxrage.toLocaleString() + '</td>'
        tots.rpt += profileData.rageperturn;
        const rpt = '<td>' + profileData.rageperturn.toLocaleString() + '</td>'
        tots.res += profileData.resist;
        const res = '<td>' + profileData.resist + '</td>'
        tots.atk += profileData.attack;
        const atk = '<td>' + profileData.attack.toLocaleString() + '</td>'
        tots.hp += profileData.hp;
        const hp = '<td>' + profileData.hp.toLocaleString() + '</td>'
        tots.slayer += profileData.godslayer;
        const slayer = '<td>' + profileData.godslayer + '</td>'
        tots.wilderness += profileData.wilderness;
        const wilderness = '<td>' + profileData.wilderness.toLocaleString() + '</td>'
        const core = `<td><img src="https://outwar.com${profileData.core.img}" class="item-img" onmouseover="itempopup(event,'${profileData.core.id}')" onmouseout="hideTooltip()"></td>`
        const head = `<td><img src="https://outwar.com${profileData.head.img}" class="item-img" onmouseover="itempopup(event,'${profileData.head.id}')" onmouseout="hideTooltip()"></td>`
        const neck = `<td><img src="https://outwar.com${profileData.neck.img}" class="item-img" onmouseover="itempopup(event,'${profileData.neck.id}')" onmouseout="hideTooltip()"></td>`
        const weapon = `<td><img src="https://outwar.com${profileData.weapon.img}" class="item-img" onmouseover="itempopup(event,'${profileData.weapon.id}')" onmouseout="hideTooltip()"></td>`
        const body = `<td><img src="https://outwar.com${profileData.body.img}" class="item-img" onmouseover="itempopup(event,'${profileData.body.id}')" onmouseout="hideTooltip()"></td>`
        const shield = `<td><img src="https://outwar.com${profileData.shield.img}" class="item-img" onmouseover="itempopup(event,'${profileData.shield.id}')" onmouseout="hideTooltip()"></td>`
        const belt = `<td><img src="https://outwar.com${profileData.belt.img}" class="item-img" onmouseover="itempopup(event,'${profileData.belt.id}')" onmouseout="hideTooltip()"></td>`
        const pants = `<td><img src="https://outwar.com${profileData.pants.img}" class="item-img" onmouseover="itempopup(event,'${profileData.pants.id}')" onmouseout="hideTooltip()"></td>`
        const ring = `<td><img src="https://outwar.com${profileData.ring.img}" class="item-img" onmouseover="itempopup(event,'${profileData.ring.id}')" onmouseout="hideTooltip()"></td>`
        const foot = `<td><img src="https://outwar.com${profileData.foot.img}" class="item-img" onmouseover="itempopup(event,'${profileData.foot.id}')" onmouseout="hideTooltip()"></td>`
        const gem = `<td><img src="https://outwar.com${profileData.gem.img}" class="item-img" onmouseover="itempopup(event,'${profileData.gem.id}')" onmouseout="hideTooltip()"></td>`
        const rune = `<td><img src="https://outwar.com${profileData.rune.img}" class="item-img" onmouseover="itempopup(event,'${profileData.rune.id}')" onmouseout="hideTooltip()"></td>`
        const orb1 = `<td><img src="https://outwar.com${profileData.orb1.img}" class="item-img" onmouseover="itempopup(event,'${profileData.orb1.id}')" onmouseout="hideTooltip()"></td>`
        const orb2 = `<td><img src="https://outwar.com${profileData.orb2.img}" class="item-img" onmouseover="itempopup(event,'${profileData.orb2.id}')" onmouseout="hideTooltip()"></td>`
        const orb3 = `<td><img src="https://outwar.com${profileData.orb3.img}" class="item-img" onmouseover="itempopup(event,'${profileData.orb3.id}')" onmouseout="hideTooltip()"></td>`
        const badge = `<td><img src="https://outwar.com${profileData.badge.img}" class="item-img" onmouseover="itempopup(event,'${profileData.badge.id}')" onmouseout="hideTooltip()"></td>`
        rows.push('<tr>' + name + lvl + faction + loyalty + exp + power + ele + chaos + mr + rpt + res + atk + hp + slayer + wilderness + core + head + neck + weapon + body + shield + belt + pants + ring + foot + gem + rune + orb1 + orb2 + orb3 + badge);
    };
    await Promise.all(ids.map(getRgaCharDataForExport));
    const avg = Object.fromEntries(
        Object.entries(tots).map(([key, value]) => [key, Math.round(value / ids.length)])
    );
    rows.push(`<tr class="avg-row"><td>Average</td><td>${avg.lvl}</td><td>--</td><td>${avg.loyalty}</td><td>${avg.exp.toLocaleString()}</td><td>${avg.power.toLocaleString()}</td><td>${avg.ele.toLocaleString()}</td><td>${avg.chaos.toLocaleString()}</td><td>${avg.mr.toLocaleString()}</td><td>${avg.rpt.toLocaleString()}</td><td>${avg.res.toLocaleString()}</td><td>${avg.atk.toLocaleString()}</td><td>${avg.hp.toLocaleString()}</td><td>${avg.slayer.toLocaleString()}</td><td>${avg.wilderness.toLocaleString()}</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>`);
    const headers = `<thead><tr><th>NAME</th><th>LVL</th><th>FACTION</th><th>LOYALTY</th><th>EXPERIENCE</th><th>POWER</th><th>ELEMENTAL</th><th>CHAOS</th><th>MAX RAGE</th><th>RPT</th><th>RESIST</th><th>ATTACK</th><th>HP</th><th>SLAYER</th><th>WILDERNESS</th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr></thead>`
    const toolTip = `<div id="dhtmltooltip" onmouseover="hideTooltip()" onmouseout="hideTooltip()"></div>`
    const table = `<div class="container"><table id="exportTable">${headers}${rows.join('')}</table></div>`
    const header = `<div class="container"><h1>RGA Export created using MoxxiMod v${GM_info.script.version}</h1></div>`
    const style = `
        <style>
        body {background: #181a1b;}
        #exportTable{margin:0 auto;box-shadow:0 40px 40px 0 rgba(1,1,1,1);}
	    table > thead > tr > th {padding-right: 6px;padding-left:6px;color:#FFFFFF;background:#1e1e1e;text-align:left;font-family:monospace;font-size:14px;cursor:pointer;padding:9px;}
        table > tbody > tr > td {padding-right: 6px;padding-left:6px;color:#FFFFFF;font-family:monospace;font-size:14px;height:40px;}
        table > tbody > tr:nth-child(odd){background:#2d2d2d;}
        table > tbody > tr:nth-child(even){background:#1e1e1e;}
        img.item-img {height:35px; width:35px;border-radius:10px;cursor:pointer;}
        td.faction-Delruk {color:#f6b861;}
	    td.faction-Alvar {color:#b7d9fb;}
	    td.faction-Vordyn {color:#ffb7f1;}
	    #dhtmltooltip {position: absolute;display: none;z-index: 9999;background: #000000;border: none;border-radius:1rem;box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 1);}
	    #dhtmltooltip iframe {border: none;width: 325px;height: 375px;}
        div.container{margin:1rem;text-align:center;}
        h1{font-family:monospace;color:#ffffff;}
        tr.avg-row{background-color:#4c5c72 !important;}
        </style>
    `
    const sortScript = `
        <script>
        const table = document.querySelector("#exportTable");
        const headers = table.querySelectorAll('thead th');
        const sortDirections = Array(headers.length).fill(true);
        headers.forEach((header, columnIndex) => {
        header.addEventListener('click', () => {
            const rows = Array.from(table.querySelectorAll('tbody tr'));
            const allValues = rows.map(row =>
            row.children[columnIndex].textContent.trim().replace(/,/g, '')
            );
            const isNumeric = allValues.every(val => !isNaN(val));
            const ascending = sortDirections[columnIndex];
            const sortedRows = rows.sort((rowA, rowB) => {
            let cellA = rowA.children[columnIndex].textContent.trim();
            let cellB = rowB.children[columnIndex].textContent.trim();
            if (isNumeric) {
                cellA = Number(cellA.replace(/,/g, ''));
                cellB = Number(cellB.replace(/,/g, ''));
                return ascending ? cellA - cellB : cellB - cellA;
            } else {
                return ascending
                ? cellA.localeCompare(cellB)
                : cellB.localeCompare(cellA);
            }
            });
            sortDirections[columnIndex] = !ascending;
            const tbody = table.querySelector('tbody');
            sortedRows.forEach(row => tbody.appendChild(row));
        });
        });
        </script>
    `
    const mouseOverScript = `
        <script>
        function itempopup(e, itemId) {
        e.preventDefault?.();

        const popup = document.getElementById("dhtmltooltip");
        if (!popup) return;

        popup.innerHTML = \`
            <iframe src="https://${server}.outwar.com/item_rollover.php?id=\${itemId}" style:"width:325px;height:375px;border:0px;overflow:hidden;">
            </iframe>\`;

        const mouseX = e.clientX + window.scrollX;
        const mouseY = e.clientY + window.scrollY;

        const popupWidth = 325;
        const popupHeight = 375;
        const padding = 15;

        const maxLeft = window.scrollX + window.innerWidth - popupWidth - padding;
        const maxTop = window.scrollY + window.innerHeight - popupHeight - padding;

        const left = Math.min(mouseX + 10, maxLeft);
        const top = Math.min(mouseY + 10, maxTop);

        popup.style.left = \`\${left}px\`;
        popup.style.top = \`\${top}px\`;
        popup.style.display = "block";
        }

        function hideTooltip() {
        const popup = document.getElementById("dhtmltooltip");
        if (popup) popup.style.display = "none";
        }
        </script>
    `
    const title = `<title>${server}${charId}</title>`;

    const html = title + '\n\n' + style + '\n\n' + toolTip + '\n\n' +  header + '\n\n' + table + '\n\n' + sortScript + '\n\n' + mouseOverScript;
    const url = await mmplus(`PageHost|${html}`);
    document.querySelector("#overlayWidget").innerHTML = `
        <h1>Your Exported RGA</h1>
        <input type="text" id="exportRgaTxt" class="form-control-new" autocomplete="off" value="${url}" onfocus="this.select()"><p>
        <i class="fa fa-clipboard" id="copyExportRgaLinkToClipboard" style="margin-top:2rem;font-size:56px;cursor:pointer;" onmouseover="statspopup(event,'Copy link to clipboard')" onmouseout="kill()"></i>
    `

    document.querySelector("#copyExportRgaLinkToClipboard").addEventListener('click', async function(){
        const url = document.querySelector("#exportRgaTxt").value;
        navigator.clipboard.writeText(url);
        alert('Copied to clipboard');
    });
};



async function appExportrga(server,serverNo,rgaName,charId){

    GM_addStyle(`
        #overlayWidget{text-align:center;padding:3rem}
        #exportRgaTxt{width:80%;font-size:36px;margin-top:1rem;text-align:center;height:100px;}
    `)

    document.querySelector("#overlayWidget").innerHTML = '<img src="https://studiomoxxi.com/moxximod/loading-gif.gif" style="height:100px;width:100px">'

    const chars = await superfetch(`ajax/accounts.php?t_serv=${serverNo}`);
    const ids = chars.match(/"id":"[0-9]+"/g).map(id => id.match(/[0-9]+/)[0]);
    let string = `ExportRGA|${server}|`
    const getRgaCharDataForExport = async (id) => {
        const profile = await superfetchProfile(`profile?suid=${id}`);
        const array = [];
        const name = profile.name;
        const level = profile.level;
        const exp = profile.exp;
        const mr = profile.maxrage;
        const power = profile.power;
        const ele = profile.elemental;
        const atk = profile.attack;
        const hp = profile.hp;
        const chaos = profile.chaos;
        const resist = profile.resist;
        const core = [profile.core.img,profile.core.id];
        const head = [profile.head.img,profile.head.id];
        const neck = [profile.neck.img,profile.neck.id];
        const weapon = [profile.weapon.img,profile.weapon.id];
        const body = [profile.body.img,profile.body.id];
        const shield = [profile.shield.img,profile.shield.id];
        const belt = [profile.belt.img,profile.belt.id];
        const pants = [profile.pants.img,profile.pants.id];
        const ring = [profile.ring.img,profile.ring.id];
        const foot = [profile.foot.img,profile.foot.id];
        const gem = [profile.gem.img,profile.gem.id];
        const badge = [profile.badge.img,profile.badge.id];
        const rune = [profile.rune.img,profile.rune.id];
        const orb1 = [profile.orb1.img,profile.orb1.id];
        const orb2 = [profile.orb2.img,profile.orb2.id];
        const orb3 = [profile.orb3.img,profile.orb3.id];
        array.push(name,level,exp,power,ele,resist,atk,hp,chaos,mr,core[0],core[1],head[0],head[1],neck[0],neck[1],weapon[0],weapon[1],body[0],body[1],shield[0],shield[1],belt[0],belt[1],pants[0],pants[1],ring[0],ring[1],foot[0],foot[1],gem[0],gem[1],rune[0],rune[1],orb1[0],orb1[1],orb2[0],orb2[1],orb3[0],orb3[1],badge[0],badge[1]);
        string += array.join(',').replace(/http:\/\/[A-Za-z]+\./g,'') + ',';
    };
    await Promise.all(ids.map(getRgaCharDataForExport));

    const url = await mmplus(string.slice(0,-1));
    document.querySelector("#overlayWidget").innerHTML = `
        <h1>Your Exported RGA</h1>
        <input type="text" id="exportRgaTxt" class="form-control-new" autocomplete="off" value="${url}" onfocus="this.select()"><p>
        <i class="fa fa-clipboard" id="copyExportRgaLinkToClipboard" style="margin-top:2rem;font-size:56px;cursor:pointer;" onmouseover="statspopup(event,'Copy link to clipboard')" onmouseout="kill()"></i>
    `

    document.querySelector("#copyExportRgaLinkToClipboard").addEventListener('click', async function(){
        const url = document.querySelector("#exportRgaTxt").value;
        navigator.clipboard.writeText(url);
        alert('Copied to clipboard');
    })
};


async function appQuestReport(){

    GM_addStyle(`
        #overlayWidget{text-align:center;}
        #questReportOuterDiv{display:flex;flex-direction:column;height:100%;}
        #questReportInnerDiv{height:100%;overflow:auto;flex-grow:1;margin-bottom:1rem;}
        #hiddenDiv{position:absolute;bottom:10px;}
    `)

    document.querySelector("#overlayWidget").innerHTML = `<img src="https://studiomoxxi.com/moxximod/loading-gif.gif" style="height:100px;width:100px">`

    const log = await superfetch('questlog');
    const acceptedQuests = (log.match(/questrow[0-9]+/g) || []).map(i => i.match(/[0-9]+/)[0]);
    const newQuests = (log.match(/quest=[0-9]+/g) || []).map(i => i.match(/[0-9]+/)[0]);
    const allQuests = [...new Set([...acceptedQuests, ...newQuests])];
    const questsArray = [];
    const hiddenArray = [];
    const getQuestInfo = async (id) => {
        const quest = await superfetch(`show_quest.php?quest=${id}`);
        if (!quest.match(/<title>Show Quest: (.*?)<\/title>/i)){
            hiddenArray.push(id);
            return;
        };

        const questExp = ((quest.replace(/,/g,'').match(/received [0-9]+ experience/g) || ['0']).map(i => parseInt(i.match(/[0-9]+/)[0]))).reduce((a, b) => a + b, 0);

        const questName = quest.match(/<title>Show Quest: (.*?)<\/title>/i)[1];

        const questShards = ((quest.replace(/,/g,'').match(/Collect: [0-9]+ Quest Shard/g) || ['0']).map(i => parseInt(i.match(/[0-9]+/)[0]))).reduce((a, b) => a + b, 0);

        questsArray.push(
            `
            <tr>
            <td><input type="checkbox" class="questListCheckbox" name="${questName}"></td>
            <td>${questName}</td>
            <td>${questShards}</td>
            <td>${questExp.toLocaleString()}</td>
            </tr>
            `
        );
    };
    await Promise.all(allQuests.map(getQuestInfo));
    document.querySelector("#overlayWidget").innerHTML = `
    <div id="questReportOuterDiv">
    <div id="questReportInnerDiv">
    <table class="table table-striped sortable" style="text-align:left">
    <thead><tr><th></th><th>Unfinished Quest</th><th>Quest Shards Needed</th><th>Total Quest Exp</th></tr></thead>
    ${questsArray.join('')}
    </table>
    </div>
    <div style="width:auto">
    <button class="btn-mm" id="makeQuestList">SEND ME A QUEST LIST OF SELECTED QUESTS</button><br>
    <i>This is a moxximod+ feature. Please only click once</i>
    </div>
    </div>
    <div id="hiddenDiv"></div>
    `

    if (hiddenArray.length > 0){
        document.querySelector("#hiddenDiv").innerHTML = `
        <i class="fa fa-eye" style="font-size:24px;cursor:pointer;" onmouseover="statspopup(event,'<b>Unable to find information on ${hiddenArray.length} incomplete quests<br>${hiddenArray.join(', ')}')" onmouseout="kill()"></b></i>
        `
    };

    document.querySelector("#makeQuestList").addEventListener('click', async function(){
        const selected = [];
        const checkboxes = document.querySelectorAll('input.questListCheckbox:checked');
        checkboxes.forEach(i => {
            selected.push(i.outerHTML.match(/name="([^"]*)"/i)[1]);
        });
        await mmplus(`QuestList|rganame|${selected.join(',')}`);
    });
    await sortableTables();
};


async function appCalculator(){

    GM_addStyle(`
        div.item-calc-div {display: inline-block;font-size: 10px;text-align: center;font-family: monospace,monospace;margin:0.5rem;background:#000000;box-shadow:0 3px 3px 0 rgba(0,0,0,0.7);padding:0.5rem;border-radius:10px;}
        .item-calc-div > img {height:60px; width:60px;border-radius:10px;margin-bottom:1rem;background:#000000;}
        .item-txt-calc {width:80px;}
        #overlayWidget{text-align:center;}
    `);

    document.querySelector("#overlayWidget").innerHTML = '<img src="https://studiomoxxi.com/moxximod/loading-gif.gif" style="height:100px;width:100px">'

    const targetItems = [
        'Faction Change',
        'Character Class Change',
        'Cosmic Mote',
        'Vault Tear',
        'Interstellar Vessel',
        'Dimensional Bond',
        'Power Potion Pack',
        'Bottled Chaos',
        'Add Augment Slot',
        'Wrapped Package',
        'Remove Augment',
        'Pulsating Stone',
        'Thunder Ball',
        'Force of Veldara',
        'Remove All Augments',
        'Profound Ward',
        'Spark the Fury',
        'Rechage Totem',
        'Recharge the Fury',
        'Standard Issue Neuralyzer',
        'Vanishas Fragrance',
        'Advanced Neuralyzer',
        'Ask the Oracle: Spawn Time',
        'Echo Trove'
    ];
    const vendor = await superfetch('ajax/ajax_treasury.php?search_for=Vendor')

    const allItems = vendor.replace(/"/g,'').match(/[0-9]+,[0-9]+,.*?,.*?,.*?,/g)
    const items = [];
    const parseEachItem = async (item) => {
        for (let i = 0; i < targetItems.length; i++) {
            if (item.includes(targetItems[i])) {
                const string = item.match(/([0-9]+),[0-9]+,(.*?),(.*?),(.*?),/i)
                const rollover = await superfetch(`item_rollover.php?id=${string[1]}&data=1`);
                const tradable = rollover.match(/\[Player Bound\]/i) ? false : true;
                items.push(`<div class="item-calc-div"><img src="images/${string[3].replace(/\\/g,'')}" onmouseover="statspopup(event,'<b>${string[2]}<b>')" onmouseout="kill()"><br><input type="text" alt="${string[4]}" tradable="${tradable}" class="form-control-new item-txt-calc" disabled></div>`);
            };
        };
    };
    await Promise.all(allItems.map(parseEachItem));
    document.querySelector("#overlayWidget").innerHTML = `
        <div class="item-calc-div" style="width:280px">
        <h5>PREMIUM POINTS</h5><br>
        <input type="text" class="form-control-new" id="calcPrem">
        </div>
        <div class="item-calc-div" style="width:280px">
        <h5>PLAYERBOUND POINTS</h5><br>
        <input type="text" class="form-control-new" id="calcPb">
        </div>
        <div class="item-calc-div" style="width:280px">
        <h5>TOKENS</h5><br>
        <input type="text" class="form-control-new" id="calcTk">
        </div>
        <div class="item-calc-div" style="width:280px">
        <h5>CASH</h5><br>
        <input type="text" class="form-control-new" id="calcCash">
        </div>
        <hr>
        ${items.join('')}
        <hr>
        <img src="images/profile/ProPP.png" id="calcPP">
    `

    const usd = 1000
    const pb = 69444.5
    const pr = 57143
    const tk = 15625

    document.querySelector("#calcPb").addEventListener('input', async function(){
        const pnt = document.querySelector("#calcPb").value
        document.querySelector("#calcPrem").value = (pnt*pr/pb).toFixed(2);
        document.querySelector("#calcTk").value = (pnt*tk/pb).toFixed(2);
        document.querySelector("#calcCash").value = (pnt*usd/pb).toFixed(2);
        await itemMath();
    });

    document.querySelector("#calcPrem").addEventListener('input', async function(){
        const pnt = document.querySelector("#calcPrem").value
        document.querySelector("#calcPb").value = (pnt*pb/pr).toFixed(2);
        document.querySelector("#calcTk").value = (pnt*tk/pr).toFixed(2);
        document.querySelector("#calcCash").value = (pnt*usd/pr).toFixed(2);
        await itemMath();
    });

    document.querySelector("#calcTk").addEventListener('input', async function(){
        const pnt = document.querySelector("#calcTk").value
        document.querySelector("#calcPrem").value = (pnt*pr/tk).toFixed(2);
        document.querySelector("#calcPb").value = (pnt*pb/tk).toFixed(2);
        document.querySelector("#calcCash").value = (pnt*usd/tk).toFixed(2);
        await itemMath();
    });

    document.querySelector("#calcCash").addEventListener('input', async function(){
        const pnt = document.querySelector("#calcCash").value
        document.querySelector("#calcPrem").value = (pnt*pr/usd).toFixed(2);
        document.querySelector("#calcPb").value = (pnt*pb/usd).toFixed(2);
        document.querySelector("#calcTk").value = (pnt*tk/usd).toFixed(2);
        await itemMath();
    });

    async function itemMath(){
        const allTxtBoxes = document.querySelectorAll(".item-txt-calc");
        allTxtBoxes.forEach(i => {
            const price = parseFloat(i.outerHTML.match(/alt="([^"]*)"/i)[1]);
            const tradable = i.outerHTML.match(/tradable="([^"]*)"/i)[1] == "true"
            if (tradable){
                i.value = (document.querySelector("#calcPrem").value/price).toFixed(1);
            } else {
                i.value = (document.querySelector("#calcPb").value/price).toFixed(1);
            };
        });
    };

    if (document.body.innerHTML.match('Ultimate Preferred Player')){
        document.querySelector("#calcPP").setAttribute('onmouseover',`statspopup(event,'<b>Item prices include preferred player discount<b>')`);
        document.querySelector("#calcPP").setAttribute('onmouseout',`kill()`);
    } else {
        document.querySelector("#calcPP").setAttribute('onmouseover',`statspopup(event,'<b>Item prices do not include preferred player discount<b>')`);
        document.querySelector("#calcPP").setAttribute('onmouseout',`kill()`);
        document.querySelector("#calcPP").setAttribute('style','filter: grayscale(100%);');
    };
};


async function appItemStorage(server,serverNo,rgaName,charId){


    document.querySelector("#overlayWidget").innerHTML = `
    <div id="itemFilterDiv" style="height:5%;"></div>
    <div id="itemStorageDiv" style="text-align:center;height:95%;overflow:auto;">
    <img src="https://studiomoxxi.com/moxximod/loading-gif.gif" style="height:100px;width:100px">
    </div>
    `

    const charDropdown = document.body.innerHTML.replace(/[\n\r]/g,'').match(/<optgroup label="My Characters">.*?<option value="0">--Change Server--<\/option>/i)
    const charIdArray = charDropdown.toString().match(/value="[0-9]+"/g).map(match => match.match(/[0-9]+/)[0]).slice(0, -1);

    let obj = {};

    const inventory = async (id) => {
        const types = ['regular', 'quest', 'orb', 'potion', 'key', 'utility'];

        for (const type of types) {
            const bp = await superfetch(`ajax/backpackcontents.php?tab=${type}&suid=${id}`);
            const parseData = new DOMParser();
            const backpack = parseData.parseFromString(bp, 'text/html');
            const hasItems = backpack.querySelector("#item0");
            if (hasItems){
                const allItems = backpack.querySelectorAll('img');
                for (let i = 0; i < allItems.length; i++) {
                    const items = allItems[i].outerHTML.match(/data-itemidqty="[0-9]+" data-name="[^"]*".*?data-iid="[0-9]+".*?src="[^"]*"/g).map(i => [
                        i.match(/data-name="([^"]*)"/i)[1],
                        i.match(/data-itemidqty="([0-9]+)"/i)[1],
                        i.match(/src="([^"]*)"/i)[1],
                        i.match(/data-iid="([0-9]+)"/i)[1],
                    ]);
                    for (let item of items){
                        const itemName = item[0];
                        const itemQuantity = parseInt(item[1]);
                        const itemImg = item[2];
                        const itemId = item[3];
                        if (!obj[itemName]){
                            obj[itemName] = {
                                quantity: 0,
                                image: itemImg,
                                id: itemId
                            };
                        };
                        obj[itemName].quantity += itemQuantity
                    };
                };
            };
        };
        const lookEq = await superfetch(`equipment?suid=${id}`);
        const equipped = (lookEq.match(/src="[^"]*" ONMOUSEOVER="itempopup\(event,'[0-9]+'\)" ONMOUSEOUT="kill\(\)" onclick="removeItem\('[0-9]+',[0-9]+,[0-9]+\);document\.getElementById\('[^']*'\)\.innerHTML=''" alt="[^"]*"/g) || []).map(item => [
            item.match(/alt="([^"]*)"/i)[1],
            "1",
            item.match(/src="([^"]*)"/i)[1],
            item.match(/event,'([0-9]+)'/)
        ]);
        for (let i = 0; i < equipped.length; i++) {
            const item = equipped[i];
            const itemName = item[0];
            const itemQuantity = parseInt(item[1]);
            const itemImg = item[2];
            const itemId = item[3];
            if (!obj[itemName]){
                obj[itemName] = {
                    quantity: 0,
                    image: itemImg,
                    id: itemId
                };
            };
            obj[itemName].quantity += itemQuantity
        };
    };
    await Promise.all(charIdArray.map(inventory));
    let tableData = Object.entries(obj).map(([name, data]) => {
        return `<tr><td><img src="${data.image}" style="width:25px;height:25px"></td><td><a href="itemlink?id=${data.id}" target="blank">${name}</a></td><td>${data.quantity}</td></tr>`;
    });
    document.querySelector("#itemFilterDiv").innerHTML = `<input type="text" class="form-control-new mb-3" "style="font-size:15px;width:50%;" id="filterInput" placeholder="Filter...">`
    document.querySelector("#itemStorageDiv").innerHTML = `
    <table id="inventory" class="table table-striped sortable">
    <thead><tr><th>Image</th><th>Item</th><th>Qnt</th></tr></thead>
    <tbody>${tableData.join('')}</tbody>
    </table>
    `

    document.getElementById("filterInput").addEventListener("keyup", function() {
        var filter = this.value.toLowerCase();
        var rows = document.querySelectorAll("#inventory tr");

        rows.forEach(function(row, index) {
            if (index === 0) return;
            var cells = row.getElementsByTagName("td");
            var showRow = false;
            for (var i = 0; i < cells.length; i++) {
                var cell = cells[i];
                if (cell.textContent.toLowerCase().indexOf(filter) > -1) {
                    showRow = true;
                    break;
                }
            }
            row.style.display = showRow ? "" : "none";
        });
    });

    sortableTables();
};


async function appIllusions(server,serverNo,rgaName,charId){

    GM_addStyle (`
    .form-control-new{height:30px;width:350px;margin:3px;padding-left:10px;}
    #search > img{height:40px;width:40px;margin:5px;border-radius:5px;border:2px #475254 SOLID;background-color:#000000;}
    .list-group-item{padding:7px 9px !important;}
    `)

    document.querySelector("#overlayWidget").innerHTML = `
    <center>
    <!-- Search boxes -->
    <div class="row justify-content-center">
    <div class="col-xl-3 col-lg-6 col-md-6 col-sm-12 col-12 layout-spacing px-1">
    <h3>Illusion Item Search</h3>
    <form class="form" id="myForm" action="https://torax.outwar.com/livesearchcore/AjaxProcessor.php" method="post">
    <input type="text" name="slot10" class="illusion-search form-control-new" autocomplete="off" placeholder="Core">
    </form>
    <form class="form" id="myForm" action="https://torax.outwar.com/livesearchcore/AjaxProcessor.php" method="post">
    <input type="text" name="slot5" class="illusion-search form-control-new" autocomplete="off" placeholder="Head">
    </form>
    <form class="form" id="myForm" action="https://torax.outwar.com/livesearchcore/AjaxProcessor.php" method="post">
    <input type="text" name="slot6" class="illusion-search form-control-new" autocomplete="off" placeholder="Neck">
    </form>
    <form class="form" id="myForm" action="https://torax.outwar.com/livesearchcore/AjaxProcessor.php" method="post">
    <input type="text" name="slot3" class="illusion-search form-control-new" autocomplete="off" placeholder="Weapon">
    </form>
    <form class="form" id="myForm" action="https://torax.outwar.com/livesearchcore/AjaxProcessor.php" method="post">
    <input type="text" name="slot0" class="illusion-search form-control-new" autocomplete="off" placeholder="Body">
    </form>
    <form class="form" id="myForm" action="https://torax.outwar.com/livesearchcore/AjaxProcessor.php" method="post">
    <input type="text" name="slot1" class="illusion-search form-control-new" autocomplete="off" placeholder="Shield">
    </form>
    <form class="form" id="myForm" action="https://torax.outwar.com/livesearchcore/AjaxProcessor.php" method="post">
    <input type="text" name="slot7" class="illusion-search form-control-new" autocomplete="off" placeholder="Belt">
    </form>
    <form class="form" id="myForm" action="https://torax.outwar.com/livesearchcore/AjaxProcessor.php" method="post">
    <input type="text" name="slot9" class="illusion-search form-control-new" autocomplete="off" placeholder="Pants">
    </form>
    <form class="form" id="myForm" action="https://torax.outwar.com/livesearchcore/AjaxProcessor.php" method="post">
    <input type="text" name="slot4" class="illusion-search form-control-new" autocomplete="off" placeholder="Ring">
    </form>
    <form class="form" id="myForm" action="https://torax.outwar.com/livesearchcore/AjaxProcessor.php" method="post">
    <input type="text" name="slot2" class="illusion-search form-control-new" autocomplete="off" placeholder="Foot">
    </form>
    </div>
    <!-- The dude -->
    <div class="col-xl-3 col-lg-6 col-md-6 col-sm-12 col-12 layout-spacing px-1"">
    <div style="position:relative; width:300px; height:385px; background-image:url(/images/thedude.png)" id="thedude">
    <div id="slot10" class="illusion-slot" style="position:absolute; left:61px; top:12px; width:41px; height:41px;text-align:center"></div>
    <div id="slot5" class="illusion-slot" style="position:absolute; left:118px; top:7px; width:62px; height:46px;text-align:center"></div>
    <div id="slot6" class="illusion-slot" style="position:absolute; left:197px; top:12px; width:41px; height:41px;text-align:center"></div>
    <div id="slot3" class="illusion-slot" style="position:absolute; left:45px; top:67px; width:56px; height:96px;text-align:center"></div>
    <div id="slot0" class="illusion-slot" style="position:absolute; left:121px; top:67px; width:56px; height:96px;text-align:center"></div>
    <div id="slot1" class="illusion-slot" style="position:absolute; left:198px; top:67px; width:56px; height:96px;text-align:center"></div>
    <div id="slot9" class="illusion-slot" style="position:absolute; left:118px; top:175px; width:62px; height:75px;text-align:center"></div>
    <div id="slot7" class="illusion-slot" style="position:absolute; left:61px; top:192px; width:41px; height:41px;text-align:center"></div>
    <div id="slot4" class="illusion-slot" style="position:absolute; left:197px; top:192px; width:41px; height:41px;text-align:center"></div>
    <div id="slot2" class="illusion-slot" style="position:absolute; left:118px; top:262px; width:62px; height:66px;text-align:center"></div>
    </div>
    Click item to remove<br>
    </div>
    <!-- List of items -->
    <div class="col-xl-3 col-lg-6 col-md-6 col-sm-12 col-12 layout-spacing px-1" style="text-align:left;">
    <div class="list-group text-left">
    <div class="list-group-item">CORE: <span id="txtslot10"></span></div>
    <div class="list-group-item">HEAD: <span id="txtslot5"></span></div>
    <div class="list-group-item">NECK: <span id="txtslot6"></span></div>
    <div class="list-group-item">WEAPON: <span id="txtslot3"></span></div>
    <div class="list-group-item">BODY: <span id="txtslot0"></span></div>
    <div class="list-group-item">SHIELD: <span id="txtslot1"></span></div>
    <div class="list-group-item">BELT: <span id="txtslot7"></span></div>
    <div class="list-group-item">PANTS: <span id="txtslot9"></span></div>
    <div class="list-group-item">RING: <span id="txtslot4"></span></div>
    <div class="list-group-item">FOOT: <span id="txtslot2"></span></div>
    <button class="mm-btn" id="applyIllusions">APPLY ILLUSIONS</button>
    </div>
    </div>
    </div>
    <!-- Item search results -->
    <div id="search"></div>
    `

    const eq = await superfetch('equipment?r=0');
    const items = eq.match(/src="[^"]*" ONMOUSEOVER="itempopup\(event,'[0-9]+'\)" ONMOUSEOUT="kill\(\)" onclick="removeItem\('[0-9]+',[0-9]+,[0-9]+\);document\.getElementById\('slot[0-9]+'\)/g);
    const slots = items.map(i => i.match(/slot[0-9]+/)[0]);
    for (let i = 0; i < slots.length; i++) {
        const slot = slots[i]
        const dude = document.querySelector(`#${slot}`)
        if (dude){
            const regex = new RegExp(`src="[^"]*" ONMOUSEOVER="itempopup\\(event,'[0-9]+'\\)" ONMOUSEOUT="kill\\(\\)" onclick="removeItem\\('[0-9]+',[0-9]+,[0-9]+\\);document\.getElementById\\('${slot}'\\)`);
            const img = eq.match(regex).toString().match(/src="([^"]*)"/i)[1];
            const iid = eq.match(regex).toString().match(/event,'([0-9]+)'/i)[1];
            dude.setAttribute('alt',iid)
            dude.innerHTML = `<img src="${img}">`
        };
    };

    const dudeSlot = document.querySelectorAll(".illusion-slot");
    for (let i = 0; i < dudeSlot.length; i++) {
        dudeSlot[i].addEventListener('click', function(){
            const slot = dudeSlot[i].outerHTML.match(/id="([^"]*)"/i)[1];
            document.querySelector(`#txt${slot}`).innerHTML = '';
            dudeSlot[i].innerHTML = ''
        });
    };

    const search = document.querySelectorAll(".illusion-search");
    for (let i = 0; i < search.length; i++) {
        search[i].addEventListener('input', async function(){
            const value = search[i].value;
            const html = search[i].outerHTML
            const slot = html.match(/name="([^"]*)"/i)[1]
            const dude = document.querySelector(`#${slot}`).outerHTML
            const iid = dude.match(/alt="([^"]*)"/i)[1]
            const post = await fetch('livesearchcore/AjaxProcessor.php', {
                method: 'POST',
                headers: { "content-type": "application/x-www-form-urlencoded; charset=UTF-8","x-requested-with": "XMLHttpRequest" },
                body: `ls_anti_bot=ajaxlivesearch_guard&ls_token=${iid}&ls_page_loaded_at=0&ls_current_page=1&ls_query_id=ls_query&ls_query=${value}&ls_items_per_page=10000`
            });
            const data = await post.text();
            const array = data.replace(/\\/g,'').match(/<td style='display: none;'>[0-9]+<\/td><td style=''>.*?<\/td><td style=''><img src="[^"]*"><\/td>/g);
            if (array.length > 0){
                const elArray = [];
                for (let i of array){
                    const iId = i.match(/<td style='display: none;'>([0-9]+)<\/td><td style=''>.*?<\/td><td style=''><img src="[^"]*"><\/td>/)[1];
                    const iName = i.match(/<td style='display: none;'>[0-9]+<\/td><td style=''>(.*?)<\/td><td style=''><img src="[^"]*"><\/td>/)[1];
                    const iImg = i.match(/<td style='display: none;'>[0-9]+<\/td><td style=''>.*?<\/td><td style=''><img src="([^"]*)"><\/td>/)[1];
                    const iClass = slot;
                    const el = `<img name="${iName}" class="${iClass}" src="${iImg}" data-id="${iId}" style="cursor:pointer">`
                    elArray.push(el);
                };
                document.querySelector("#search").innerHTML = elArray.join('');
            };

            const resultSelect = document.querySelectorAll(`.${slot}`)
            for (let i = 0; i < resultSelect.length; i++) {
                const node = resultSelect[i];
                node.addEventListener('click', function() {
                    const img = node.outerHTML.match(/src="([^"]*)"/i)[1];
                    const name = node.outerHTML.match(/name="([^"]*)"/i)[1];
                    const iid = node.outerHTML.match(/data-id="([^"]*)"/i)[1];
                    document.querySelector(`#${slot}`).innerHTML = `<img src="${img}">`
                    document.querySelector(`#txt${slot}`).innerHTML = name;
                    document.querySelector(`#txt${slot}`).setAttribute('data-illusion-id', iid);
                });
            };
        });
    };

    document.querySelector("#applyIllusions").addEventListener('click', async () => {

        const dude = document.querySelector("#thedude").innerHTML;
        const eqid = dude.match(/alt="([0-9]+)"/i)?.[1] || "er";
        if (eqid == "er"){
            alert("ERROR: Unable to access blacksmith");
            return;
        };
        const blacksmith = await superfetch('blacksmith');
        const nonce = blacksmith.match(/name="form-nonce" value="([^"]*)"/i)?.[1] || "er";
        if (nonce == "er"){
            alert("ERROR: Unable to access blacksmith");
            return;
        };
        const getCost = await superpost(`blacksmith.php?itemid=${eqid}`,`itemid=${eqid}&illusionitem.x=1&illusionitem.y=1&form-nonce=${nonce}`);
        const free = getCost.match(/jQuery\('#costspan'\)\.html\("Free!"\);/i);
        if (!free){
            alert("ERROR: Can only apply illusions for preferred player RGAs");
            return;
        } else {
            await applyIllusions();
        };
    });

    async function applyIllusions(){
        await loadingOverlay();
        const allIllusions = document.querySelectorAll('[data-illusion-id]');
        for (i of allIllusions){
            const blacksmith = await superfetch('blacksmith', true);
            const nonce = blacksmith.match(/name="form-nonce" value="([^"]*)"/i)?.[1] || "er";
            const slot = i.id.match(/slot[0-9]+/i)[0];
            const iid = i.outerHTML.match(/data-illusion-id="([0-9]+)"/i)[1];
            const eq = document.querySelector(`#${slot}`);
            const eqid = eq.outerHTML.match(/alt="([0-9]+)"/i)[1];
            const url = "blacksmith"
            const body = `itemid=${eqid}&illusionitem_x=1&form-nonce=${nonce}&illusiondest=${iid}`
            const post = await superpost(url,body);
        };
        window.location.href = "profile";
    };

};


async function appCustomTheme(){

    await appsMenuClose();

    GM_addStyle(`
    .widget {-webkit-box-shadow: 0px 0px 3px 3px rgba(0,0,0,1);}
    .widget-content-area {-webkit-box-shadow: 0px 0px 3px 3px rgba(0,0,0,1);}
    #premadeThemes {white-space: nowrap;padding:15px;border-radius:10px;}
    .premadeDiv {display:inline-block;text-align:center;font-size:9px;font-family:monospace;}
    img.premade{transition: .5s ease-out;height:100px;width:100px;border-radius:10px;box-shadow:0 5px 5px 0 rgba(0,0,0,1);border:2px #475254 SOLID;margin:10px;cursor:pointer;}
    img.premade:hover{filter: saturate(250%);}
    `)

    document.querySelector("#content").innerHTML = `
    <!-- Header Widget -->
    <div class="widget" style="width:1115px !important;margin-top:0.5rem;">
    <h3>Outwar Theme</h3>
    Enter all colors as 6-digit <a href="https://htmlcolorcodes.com/" target="_blank">hexadecimal</a> codes
    <hr>
    <button class="btn-mm" id="updateTheme">UPDATE THEME</button><button class="btn-mm" id="resetTheme">RESET THEME</button>
    </div>
    <!-- Premade Themes -->
    <div class="widget" style="width:1115px !important;margin-top:1rem;">
    <div class="list-group-item" style="width:100%;overflow:auto;text-align:left;max-width:100% !important;" id="premadeThemes">
    </div>
    </div>
    <!-- Lower Widget -->
    <div class="row justify-content-center">
    <!-- Left -->
    <div style="margin:1rem;width:350px">
    <!-- Background Image -->
    <div class="widget widget-chart-one mb-3" style="text-align:left">
    background image url
    <input style="width:100%;" id="themeBgImg" type="text" class="form-control-new mb-2 theme-input" autocomplete="off">
    </div>
    <!-- Text and links -->
    <div class="widget widget-chart-one mb-3" style="text-align:left">
    text color
    <input style="width:100%;" id="themeTxt" type="text" class="form-control-new mb-2 theme-input" autocomplete="off">
    link color
    <input style="width:100%;" id="themeLink" type="text" class="form-control-new mb-2 theme-input" autocomplete="off">
    link hover color
    <input style="width:100%;" id="themeLinkHover" type="text" class="form-control-new mb-2 theme-input" autocomplete="off">
    </div>
    <!-- Scrollbar -->
    <div class="widget widget-chart-one mb-3" style="text-align:left">
    scrollbar slider color
    <input style="width:100%;" id="themeScrollSlider" type="text" class="form-control-new mb-2 theme-input" autocomplete="off">
    scrollbar track color
    <input style="width:100%;" id="themeScrollTrack" type="text" class="form-control-new mb-2 theme-input" autocomplete="off">
    </div>
    </div>
    <!-- Middle -->
    <div style="margin:1rem;width:350px">
    <!-- Toolbar and Widget Color -->
    <div class="widget widget-chart-one mb-3" style="text-align:left">
    toolbar background color
    <input style="width:100%;" id="themeToolbarBg" type="text" class="form-control-new mb-2 theme-input" autocomplete="off">
    main content background color
    <input style="width:100%;" id="themeContentBg" type="text" class="form-control-new mb-2 theme-input" autocomplete="off">
    </div>
    <!-- Tables -->
    <div class="widget widget-chart-one mb-3" style="text-align:left">
    table background color
    <input style="width:100%;" id="themeTableBg" type="text" class="form-control-new mb-2 theme-input" autocomplete="off">
    table header text color
    <input style="width:100%;" id="themeTableHeaderTxt" type="text" class="form-control-new mb-2 theme-input" autocomplete="off">
    table text color
    <input style="width:100%;" id="themeTableTxt" type="text" class="form-control-new mb-2 theme-input" autocomplete="off">
    </div>
    </div>
    <!-- Right -->
    <div style="margin:1rem;width:350px">
    <!-- Text Boxes and Buttons -->
    <div class="widget widget-chart-one mb-3" style="text-align:left">
    button and textbox background color
    <input style="width:100%;" id="themeBoxBg" type="text" class="form-control-new mb-2 theme-input" autocomplete="off">
    button and textbox text color
    <input style="width:100%;" id="themeBoxTxt" type="text" class="form-control-new mb-2 theme-input" autocomplete="off">
    </div>
    <!-- Menu -->
    <div class="widget widget-chart-one mb-3" style="text-align:left">
    menu background color
    <input style="width:100%;" id="themeMenuBg" type="text" class="form-control-new mb-2 theme-input" autocomplete="off">
    menu text color
    <input style="width:100%;" id="themeMenuTxt" type="text" class="form-control-new mb-2 theme-input" autocomplete="off">
    menu hover color
    <input style="width:100%;" id="themeMenuHover" type="text" class="form-control-new mb-2 theme-input" autocomplete="off">
    menu subtext color
    <input style="width:100%;" id="themeMenuSubTxt" type="text" class="form-control-new mb-2 theme-input" autocomplete="off">
    menu subtext hover
    <input style="width:100%;" id="themeMenuSubTxtHover" type="text" class="form-control-new mb-2 theme-input" autocomplete="off">
    </div>
    </div>
    </div>
    `

    const premadeDetails = {
        1: ['vordyn','F6DCF5','EE6CD7','F8C2F2','EE6CD7','F8C2F2','842266','300E25','292438','EE6CD7','F8C2F2','191320','F6DCF5','191320','F6DCF5','842266','EE6CD7','F8C2F2'],
        2: ['alvar','CDE5FA','45B0DB','274E83','274E83','0D2F4C','0D2F4C','0B1426','08335E','274E83','CDE5FA','274E83','CDE5FA','274E83','CDE5FA','45B0DB','CDE5FA','45B0DB'],
        3: ['delruk','FDE9D6','FDBB5F','FE7626','FE7626','6A241C','6A241C','290C08','18080A','FE7626','FDE9D6','B84313','FDE9D6','18080A','FDBB5F','FE7626','B84313','FE7626'],
        4: ['lagoon','B8C6C3','EDEEDB','23466A','23466A','161C2A','142335','0F151C','66706A','9BB1B5','B8C6C3','132A45','ABBDBE','141D2A','ABBDBE','727C76','9BB1B5','B8C6C3'],
        5: ['triangle','FCFFFF','DA8D95','77573A','77573A','0F0613','0F0613','171C28','1D1221','DA8D95','FCFFFF','77573A','FCFFFF','142936','FCFFFF','77573A','DA8D95','77573A'],
        6: ['cyberpunk','C1C5CD','FD3FF5','6EC4EF','6EC4EF','1A1A16','1C1C3C','1A1A16','281842','6EC4EF','C1C5CD','1C1C3C','C1C5CD','04202D','FD3FF5','6EC4EF','C1C5CD','6EC4EF'],
        7: ['haze','FDFDFD','AE9ADE','EFB9EB','EFB9EB','181F3A','303148','181F3A','39374E','EFB9EB','FDFDFD','3A3E51','EFB9EB','3A3E51','FDFDFD','AE9ADE','AE9ADE','FDFDFD'],
        8: ['leather','ffffff','907552','ffffff','907552','272017','272017','070508','272017','907552','ffffff','272017','ffffff','11120F','ffffff','272017','ffffff','907552'],
        9: ['doodle','1F94BA','15C391','85446C','1F94BA','1D1C21','1D1C21','1D1C21','1D1C21','576590','873F63','1E9EC2','1D1C21','1D1C21','645A7D','18A9AA','18A9AA','15C391'],
        10: ['ring','ffffff','E7A300','ffffff','E7A300','1D1D1D','070707','0C0C0C','1D1D1D','E7A300','ffffff','1D1D1D','ffffff','1D1D1D','E7A300','0C0C0C','ffffff','E7A300'],
        11: ['woods','d5d5d5','828282','d5d5d5','3D3D3D','111111','1A1A1A','111111','242424','828282','d5d5d5','0D0D0D','d5d5d5','1A1A1A','d5d5d5','5B5B5B','5B5B5B','d5d5d5'],
        12: ['view','CEE4EA','5AC5D1','5A8081','5AC5D1','12353D','12353D','030911','0E312C','5A8081','CEE4EA','153833','0E312C','CEE4EA','B3D6E3','5A8081','5AC5D1'],
        13: ['carbon','BFBDBC','C61C30','43413F','E22F35','050303','050303','1F1C1D','1F1C1D','C61C30','BFBDBC','1F1C1D','E22F35','0E0C0D','BFBDBC','43413F','BFBDBC','C61C30'],
        14: ['classic','d3d3d3','d3d3d3','fff000','3D3D3D','1B1B1B','1B1B1B','0b0b0b','232323','fff000','d3d3d3','282828','d3d3d3','0b0b0b','d3d3d3','232323','fff000','d3d3d3'],
        15: ['sunrise','FAC7DC','50B3B1','DB5B7F','50B3B1','122034','0F1E32','09181F','122034','DB5B7F','FAC7DC','221424','C95175','3F2E42','50B3B1','FF90A1','47AAAF','FAC7DC'],
        16: ['spotlight','b2b2b2','939393','FFFFFF','b2b2b2','181818','060606','181818','262626','b2b2b2','939393','262626','b2b2b2','181818','b2b2b2','262626','b2b2b2','939393'],
        17: ['calibrate','ffffff','CEF382','EE9B5A','EE9B5A','024671','5c3047','234259','024671','CEF382','d1a8a2','3c274c','EE7462','003150','CEF382','4D69A1','EE9B5A','d1a8a2'],
        18: ['lake','7AB0EE','908D5C','5896E0','76ADE1','0F2336','2E3447','0B0E16','2E3543','76ADE1','ffffff','2E3543','ffffff','0B0E16','ffffff','7AB0EE','D3A145','76ADE1'],
        19: ['osiris','67C5F8','F7F554','ffffff','67C5F8','111219','13161E','191925','333340','ffffff','ffffff','090A11','ffffff','090A11','ffffff','0754A1','67C5F8','F7F554'],
        20: ['cove','ffffff','14E7D9','EE9B5A','EE9B5A','171954','5c3047','120C42','024671','CEF382','d1a8a2','3c274c','EE7462','210D51','EA9DAC','4D69A1','EE9B5A','d1a8a2'],
        21: ['river','D9E4F6','C3E5F2','E57EAC','D9E4F6','121E2A','080C12','080C12','061A41','D9E4F6','E57EAC','121E2A','E57EAC','121E2A','E57EAC','061A41','D9E4F6','C3E5F2']
    };

    const premadeCount = Object.keys(premadeDetails).length;
    const premadeArray = [];
    for (let i = 1; i <= premadeCount; i++) {
        premadeArray.push(`
            <div class="premadeDiv">
            <img src="https://studiomoxxi.com/moxximod/plus_wallpapers/${i}.webp" class="premade" id="premade${i}"><br>
            ${premadeDetails[i][0].toUpperCase()}
            </div>
        `);
    };

    document.querySelector("#premadeThemes").innerHTML = premadeArray.join('');
    for (let i = 1; i <= premadeCount; i++) {
        document.querySelector(`#premade${i}`).addEventListener('click', async function(){

            document.querySelector("#themeBgImg").value = `https://studiomoxxi.com/moxximod/plus_wallpapers/${i}.webp`

            const inputs = document.querySelectorAll('input.theme-input');

            for (let x = 1; x < inputs.length; x++) {
                if (premadeDetails[i][x]){
                    inputs[x].value = premadeDetails[i][x];
                };
            };
        });
    };

    document.querySelector("#updateTheme").addEventListener('click', async function(){

        const inputs = document.querySelectorAll('input.theme-input');

        const hexArray = [];
        inputs.forEach(async element => {

            const value = element.value.replace(/#/g,'');
            const id = element.id

            if ((/^\w{6}$/.test(value) || id == "themeBgImg") || value == '') {
                if (value != ''){
                    GM_setValue(id,value);
                    if (!value.match('studiomoxxi')){
                        hexArray.push(`'${value}'`);
                    };
                };
            } else {
                alert(`Invalid entry for ${id}. Please make sure all values are 6-digit hex codes`);
                return;
            };
        });

        console.log(`Theme value array: ${hexArray.join(',')}`)
        await loadCustomTheme();
    });

    document.querySelector("#resetTheme").addEventListener('click', async function(){
        const inputs = document.querySelectorAll('input.theme-input');
        inputs.forEach(async element => {
            const id = element.id
            GM_deleteValue(id);
        });
        window.location.href = window.location;
    });
};


async function loadCustomTheme(){
    if (GM_getValue("themeBoxBg")){
        const value = GM_getValue("themeBoxBg");
        GM_addStyle(`
            .form-control-new {background:#${value} !important}
            .form-control {background:#${value} !important}
            .btn-mm {background-color:#${value} !important;}
            .btn-primary {background-color:#${value} !important;border:0px SOLID !important;}
            .btn {background-color:#${value} !important;border:0px SOLID !important;}
            .swal2-popup {background-color:#${value} !important}
            .btn-info{background-color:#${value} !important;}
            .alert-light-warning{background-color:#${value} !important;}
        `);
    };
    if (GM_getValue("themeBoxTxt")){
        const value = GM_getValue("themeBoxTxt");
        GM_addStyle(`
            .form-control-new {color:#${value} !important}
            .form-control-new::placeholder {color:#${value} !important;opacity:0.3;}
            .form-control {color:#${value} !important}
            .form-control::placeholder {color:#${value} !important;opacity:0.3;}
            .btn-mm {color:#${value} !important;}
            .btn-primary {color:#${value} !important;border:0px SOLID !important;}
            .btn {color:#${value} !important;border:0px SOLID !important;}
            .swal2-popup {color:#${value} !important}
            .btn-info {color:#${value} !important}
            .alert-light-warning{color:#${value} !important}
            #mailCollapseTwo > div > div.alert.alert-light-warning.border-0.mb-4 > button > svg{color:#${value} !important}
            body{color:#${value} !important;}
        `);
    };
    if (GM_getValue("themeBgImg")){
        const value = GM_getValue("themeBgImg");
        var height = window.screen.availHeight
        var width = window.screen.availWidth
        GM_addStyle(`
            body > center{background-image: url("${value}") !important;
            background-size: ${width}px ${height}px !important;
            background-attachment: fixed !important;
            background-position:center !important;
            background-repeat:no-repeat !important;
        `);
    };
    if (GM_getValue("themeScrollSlider") && GM_getValue("themeScrollTrack")){
        const value1 = GM_getValue("themeScrollSlider");
        const value2 = GM_getValue("themeScrollTrack");
        GM_addStyle(`
            * {scrollbar-color: #`+value1+` #`+value2+`;}
            *::-webkit-scrollbar-track {background:#`+value2+`;}
            *::-webkit-scrollbar-thumb {background-color:#`+value1+`;}
            * {scrollbar-width: 7px;}
            *::-webkit-scrollbar {width: 7px;}
        `);
    };
    if (GM_getValue("themeToolbarBg")){
        const value = GM_getValue("themeToolbarBg");
        GM_addStyle(`
            .navbar {background:#${value} !important;}
            #sidebar ul.menu-categories li.menu > .dropdown-toggle[aria-expanded=true] {background:#${value} !important;}
            .nav-link.active {background-color: #${value} !important; border-color: #${value} !important;}
            .nav-tabs {border-bottom: #${value} !important;}
        `);
    };
    if (GM_getValue("themeContentBg")){
        const value = GM_getValue("themeContentBg");
        GM_addStyle(`
            .widget {background-color:#${value}}
            .widget-content-area {background-color:#${value}}
            .widget-content {background-color:#${value}}
            .custom-dropdown-menu {background-color:#${value} !important;}
            .swal2-modal {background-color: #${value} !important;}
            #bpWin_handle {background-color: #${value} !important;}
            #eqWin_handle {background-color: #${value} !important;}
            .widget-header{background-color:#${value} !important;}
            .modal-content{background-color:#${value} !important;}
            .mailbox-inbox{background-color:#${value} !important;}
            .content-box{background-color:#${value} !important;}
            .msg-close{background:#${value} !important;}
        `);
    };
    if (GM_getValue("themeTableBg")){
        const value = GM_getValue("themeTableBg");
        GM_addStyle(`
            .table {background-color:#${value} !important;}
            .table-striped {background-color:#${value} !important;}
            .list-group-item {background-color: #${value} !important;}
            .wquesttable{background-color: #${value} !important;}
            .list-group-item {border: #${value} 1px SOLID !important;margin-bottom:4px !important;}
            .b-skills {background-color: #${value} !important;}
            hr {border-top: 1px SOLID #${value} !important;}
            .skillsbox{background-color:#${value} !important;}
            .modal-footer{border-top: 1px SOLID #${value} !important;}
            .modal-header{border: 1px SOLID #${value} !important;}
            .page-link{background:#${value} !important;}
            .page-link{background:#${value} !important;}
            #zero-config_info {border: 1px SOLID #${value} !important;}
            #mailHeadingEleven > div > div{background:#${value} !important;}
            #content-header-row > div > div > div > div > div.tab-title{background:#${value} !important;}
            p.mail-content.text-left{border-top: 1px SOLID #${value} !important;}
            div.d-flex.msg-close{border-bottom: 1px SOLID #${value} !important;}
            td[id*="questStep"]{background-color:#${value} !important;}
        `);
    };
    if (GM_getValue("themeTableHeaderTxt")){
        const value = GM_getValue("themeTableHeaderTxt");
        GM_addStyle(`
            .table > thead > tr > th {color:#${value} !important;}
            .table {border:#${value} SOLID 1px !important;}
            .table > tbody > tr {border:#${value} SOLID 1px !important;}
            .table > thead {border-top:#${value} SOLID 1px !important;}
            .table > border-collapse: revert !important;}
            .table-striped > thead > tr > th {color:#${value} !important;}
            .table-striped {border:#${value} SOLID 1px !important;}
            .table-striped > tbody > tr {border:#${value} SOLID 1px !important;}
            .table-striped > thead {border-top:#${value} SOLID 1px !important;}
            .table-striped > border-collapse: revert !important;}
            table.dataTable > thead > tr > th {color:#${value} !important;}
            table.dataTable {border:#${value} SOLID 1px !important;}
            table.dataTable > tbody > tr {border:#${value} SOLID 1px !important;}
            table.dataTable > thead {border-top:#${value} SOLID 1px !important;}
            table.dataTable {border-collapse: revert !important;}
        `);
    };
    if (GM_getValue("themeTableTxt")){
        const value = GM_getValue("themeTableTxt");
        GM_addStyle(`
            .table > tbody > tr > td {color:#${value} !important;}
            .table-striped > tbody > tr > td {color:#${value} !important;}
            #eqWin_handle > tbody > tr > td {color:#${value} !important;}
            #bpWin_handle > tbody > tr > td {color:#${value} !important;}
        `);
    };
    if (GM_getValue("themeTxt")){
        const value = GM_getValue("themeTxt");
        GM_addStyle(`
        .list-group.list-group-media{color:#${value} !important;}
        .list-group.list-group-media{color:#${value} !important;}
        .list-group-item{color:#${value} !important;}
        .media{color:#${value} !important;}
        .media-body{color:#${value} !important;}
        h6{color:#${value} !important;}
        h5{color:#${value} !important;}
        h4{color:#${value} !important;}
        h3{color:#${value} !important;}
        .list-group-item{color:#${value} !important;}
        .media{color:#${value} !important;}
        .media-body{color:#${value} !important;}
        p{color:#${value} !important;}
        .list-group-item{color:#${value} !important;}
        .bio{color:#${value} !important;}
        .widget{color:#${value} !important;}
        .widget-content-area{color:#${value} !important;}
        #cvMsg{color: #${value} !important;}
        div.dataTables_wrapper{color: #${value} !important;}
        div.dataTables_length label{color: #${value} !important;}
        `);
    };
    if (GM_getValue("themeLink")){
        const value = GM_getValue("themeLink");
        GM_addStyle(`
            a:not(.dropdown-toggle):not(.form-control-new){color:#${value} !important;}
            .form-control-new{border: 1px SOLID #${value} !important;}
            .form-control{border: 1px SOLID #${value} !important;}
            div.dataTables_wrapper{color:#${value} !important;}
            div.dataTables_info{color:#${value} !important;}
            #mailInbox > svg{color:#${value} !important;}
            #draft > svg{color:#${value} !important;}
            #sentmail > svg{color:#${value} !important;}
            #trashed > svg{color:#${value} !important;}
            #btn-compose-mail{display:none !important;}
            td[id*="questStep"] > a > font > b{color:#${value} !important;}
        `);
    };
    if (GM_getValue("themeLinkHover")){
        const value = GM_getValue("themeLinkHover");
        GM_addStyle(`
            a:not(.dropdown-toggle):not(.form-control-new):hover{color:#${value} !important;}
        `);
    };
    if (GM_getValue("themeMenuBg")){
        const value = GM_getValue("themeMenuBg");
        GM_addStyle(`
            #accordionExample{background:#${value} !important;}
            #sidebar{background:#${value} !important;}
            .dropdown-menu {background: #${value} !important;border:0px SOLID !important;}
            .nav-link.active{background-color:#${value} !important;}
            .nav-link.active{border-color:#${value} !important;}
        `);
    };
    if (GM_getValue("themeMenuTxt")){
        const value = GM_getValue("themeMenuTxt");
        GM_addStyle(`
            a.dropdown-toggle {color:#${value} !important;}
            #sidebar ul.menu-categories li.menu>.dropdown-toggle svg {color:#${value} !important;}
        `);
    };
    if (GM_getValue("themeMenuHover")){
        const value = GM_getValue("themeMenuHover");
        GM_addStyle(`
            #sidebar ul.menu-categories li.menu > .dropdown-toggle.dropdown-toggle:hover {background:#${value} !important;}
            .btn-group .dropdown-menu a.dropdown-item:hover {background:#${value} !important;}
            .btn-group .dropdown-menu .dropdown-item:hover {background:#${value} !important;}
        `);
    };
    if (GM_getValue("themeMenuSubTxt")){
        const value = GM_getValue("themeMenuSubTxt");
        GM_addStyle(`
            #sidebar ul.menu-categories ul.submenu > li a {color:#${value} !important;}
        `);
    };
    if (GM_getValue("themeMenuSubTxtHover")){
        const value = GM_getValue("themeMenuSubTxtHover");
        GM_addStyle(`
        #sidebar ul.menu-categories ul.submenu>li a:hover:before {background-color:#${value} !important;}
        #sidebar ul.menu-categories ul.submenu > li a:hover {color:#${value} !important;}
        `);
    };
};


async function appChaosTeles(server){
    document.querySelector("#overlayWidget").innerHTML = `
    <center>
    <img src="https://studiomoxxi.com/moxximod/loading-gif.gif" style="height:100px;width:100px">`
    const charDropdown = document.body.innerHTML.replace(/[\n\r]/g,'').match(/<optgroup label="My Characters">.*?<option value="0">--Change Server--<\/option>/i)
    const charIdArray = charDropdown.toString().match(/value="[0-9]+"/g).map(match => match.match(/[0-9]+/)[0]).slice(0, -1);
    let tableRows = []
    let totalTeles = 0
    const inventory = async (id) => {
        const kBp = await superfetch(`ajax/backpackcontents.php?tab=key&suid=${id}`);
        const keys = await backpack(kBp, "Arena Teleporter");
        const teleporters = keys.quantity;
        if (teleporters > 0){
            const profileData = await superfetchProfile(`profile?suid=${id}`);
            const name = profileData.name;
            const rage = profileData.currentrage.toLocaleString();
            const circ = profileData.skills.list.match('Circumspect') ? "Yes" : "No"
            const power = profileData.power.toLocaleString();
            const ele = profileData.elemental.toLocaleString();
            tableRows.push(`<tr><td>${name}</td><td>${power}</td><td>${ele}</td><td>${rage}</td><td>${circ}</td><td>${teleporters}</td></tr>`);
            totalTeles += teleporters;
        };
    };
    await Promise.all(charIdArray.map(inventory));
    document.querySelector("#overlayWidget").innerHTML = `
    <table class="table table-striped mb-3" id="arenaTeleTable">
    <thead><tr><th>Character</th><th>Power</th><th>Elemental</th><th>Rage</th><th>Circumspect Cast</th><th>Arena Teleporters</th></thead>
    <tbody>
    ${tableRows.join('')}
    </tbody>
    </table>
    <brr><center>
    <button class="btn-mm" id="useTeleporters"></button>
    `
    if (totalTeles > 0){
        document.querySelector("#useTeleporters").innerHTML = `USE ${totalTeles} ARENA TELEPORTERS`
        document.querySelector("#useTeleporters").addEventListener('click', async function() {
            document.querySelector("#useTeleporters").remove();
            await mmplus(`ChaosTele|rganame|${server}`);
        });
    } else {
        document.querySelector("#arenaTeleTable").remove();
        document.querySelector("#useTeleporters").outerHTML = `YOU HAVE NO ARENA TELEPORTERS TO USE`
    };
};


async function appBackpack(server,serverNo,rgaName,charId){

    GM_addStyle(`
        #backpackDiv{height:90%;background-color:#1b2d4a;box-shadow: 5px 5px 5px rgba(0, 0, 0, 1);padding:15px;display: flex; flex-wrap: wrap; justify-content: center;}
        #actionButtons{text-align:center;margin-top:1rem;}
        div.bp-items-div{height:90px;overflow:auto;padding:10px;border-radius:0px;width:100%;text-align:center;background-color: #000000;border: 3px SOLID #2c2f30;margin-top: 1rem;border-radius: 5px; }
        div.bp-slot{background-image: url("/images/bp/bp_tile.gif");width: 60px;height: 60px;margin: 1px;position: relative;display:inline-block;}
        img.item-selectable{height:46px;width:46px;margin:7px;border-radius:7px;transition: 0.1s ease-out;cursor:pointer;}
        img.item-selected{border:5px #00CC00 SOLID;padding:3px;height:60px;width:60px;margin:0px;}
        .bp-widget { display:inline-block;border-radius:30px; background-image: url(/images/bg.jpg); flex: 1 1 300px; min-width:300px; box-sizing:border-box; padding-top:15px; margin:5px;}
    `)

    document.querySelector("#overlayWidget").innerHTML = `
        <div id="backpackDiv" style="text-align:center;overflow:auto;">
        <img src="https://studiomoxxi.com/moxximod/loading-gif.gif" style="height:100px;width:100px;margin-top:2rem;">
        </div>
        <div id="actionButtons"></div>
    `

    const ajax = await superfetch(`ajax/accounts.php?t_serv=${serverNo}`);
    const charIds = ajax.match(/"id":"[0-9]+"/g).map(i => i.match(/[0-9]+/));
    const widgets = [];
    const fetchProfilesAndBackpacks = async (id) => {
        const profile = await superfetch(`profile?suid=${id}`,true);
        const name = profile.match(/<font size="3">(.*?)<\/font>/i)[1];
        const sub = profile.match(/<font size="2">Level [0-9]+ [A-Za-z]+<\/font>/i);
        const parser = new DOMParser();
        const profileHtml = parser.parseFromString(profile, 'text/html');
        const bp = await superfetch(`ajax/backpackcontents?tab=regular&suid=${id}`,true);
        const backpackHtml = parser.parseFromString(bp, 'text/html');
        const items = backpackHtml.querySelectorAll('img');
        const allItems = [];
        items.forEach(item => {
            const img = item.outerHTML.match(/src="([^"]*)"/)[1];
            const iid = item.outerHTML.match(/data-iid="([0-9]+)"/)[1];
            allItems.push(`
                <div class="bp-slot">
                <img src="${img}" class="item-selectable" id="${id}" onmouseover="itempopup(event,'${iid}')" onmouseout="kill()">
                </div>
            `);
        });
        const thedude = profileHtml.querySelector('div[style="position:relative; width:300px; height:385px; background-image:url(/images/thedude.png)"]').outerHTML.replace(/onclick="[^"]*"/g,'');
        if (allItems.length == 0){
            return;
        }
        widgets.push(`
            <div class="bp-widget">
            <center>
            <div><h5>${name}</h5>${sub}</div>
            ${thedude}
            <div class="bp-items-div">${allItems.join('')}</div>
            </div>
        `)
    };
    await Promise.all(charIds.map(fetchProfilesAndBackpacks));
    document.querySelector("#backpackDiv").innerHTML = widgets.join('');

    const itemSelectable = document.querySelectorAll(".item-selectable");
    itemSelectable.forEach(item => {
        item.addEventListener('click', async function(){
            item.classList.toggle('item-selected');
        });
    });

    document.querySelector("#actionButtons").innerHTML = `
        <button class="btn-mm" id="bpActivate">ACTIVATE</button>
        <button class="btn-mm" id="bpEquip">EQUIP</button>
        <button class="btn-mm" id="bpVault">VAULT</button>
    `
    document.querySelector("#bpActivate").addEventListener('click', async function(){ await bpAction('Activate') });
    document.querySelector("#bpEquip").addEventListener('click', async function(){ await bpAction('Equip') });
    document.querySelector("#bpVault").addEventListener('click', async function(){ await bpAction('Vault') });

    async function bpAction(type){

        const actionString = [];
        const selectedItems = document.querySelectorAll(".item-selected");
        const parseSelectedItems = async (item) => {
            const charid = item.outerHTML.match(/id="([0-9]+)"/i)[1];
            const itemid = item.outerHTML.match(/event,'([0-9]+)'/i)[1];
            actionString.push(`rganame&${charid}&${itemid}`);
        };
        await Promise.all(Array.from(selectedItems).map(parseSelectedItems));

        document.querySelector("#overlayWidget").innerHTML = `
            <div id="backpackDiv" style="text-align:center;overflow:auto;">
            <img src="https://studiomoxxi.com/moxximod/loading-gif.gif" style="height:100px;width:100px;margin-top:2rem;">
            </div>
            <div id="actionButtons"></div>
        `
        await mmplus(`${type}|rganame|${server}|${actionString.join(',')}`);
        await appBackpack(server,serverNo,rgaName,charId);
    };
};


async function appWilderness(server,serverNo,rgaName,charId){

    GM_addStyle(`
        #overlayWidget{text-align:center;}
    `);

    async function wilderness() {
        const fetch = await superfetch('wilderness',true);
        const parser = new DOMParser();
        const doc = parser.parseFromString(fetch, 'text/html');
        const wildernessContent = doc.querySelector("#divWildernessContainer > div.row.mx-3.mt-3 > div:nth-child(2)").innerHTML.replace(`<a id="wildernessLink"`,`<a id="wildernessLink" TARGET="wildatk"`);
        const level = doc.querySelector("#divHeader > h1").innerHTML;
        document.querySelector("#overlayWidget").innerHTML = `
            <h6>Level ${level}</h6><p>
            ${wildernessContent}
            <p>Click above button once to attack mob<br>Mob will update once defeated<p style="margin-top:1.5rem">
            <p style="margin-top:1rem;">
            <button id="spamWilderness" class="btn-mm">SPAM ATTACK</button><p>
            <span id="spamCnt"></span><p>
            <iframe id="wildatk" name="wildatk" src="" style="opacity: 0 !important;height:0px !important;width:0px !important;"></iframe>
        `;
        document.querySelector("#spamWilderness").addEventListener("click", spam);
        document.querySelector("#wildernessLink > img").addEventListener("click", frame);
    };

    function frame() {
        wilderness();
        document.querySelector("#wildernessLink > img").click();
    };


    let count = 0;
    function spam() {
        setTimeout(function() {
            document.querySelector("#wildernessLink > img").click();
            count += 1;
            document.querySelector("#spamCnt").innerHTML = count;
            spam();
        }, 250);
    };


    wilderness();

}

async function appWilderness_old(server,serverNo,rgaName,charId){

    GM_addStyle(`
        div.wilderness-div{width:100%;text-align:center;}
        img.wilderness-mob-img{border-radius:10px;box-shadow:0 5px 5px 0 rgba(0,0,0,1);margin-bottom:1rem;height:250px;width:250px;}
        input.txt {background: #FFFFFF !important;color: #000000 !important;opacity: 1 !important;}
        .wilderness-info{margin-bottom:1rem;width:250px;}
        .wilderness-info-div{display:inline-block;margin-right:4px;margin-left:4px;}
    `)

    document.querySelector("#overlayWidget").innerHTML = `
    <div class="wilderness-div">
    <div id="wildernessLvl"></div>
    <div id="wildernessImg"><img src="https://studiomoxxi.com/moxximod/loading-gif.gif" style="height:100px;width:100px;margin-bottom:1rem;"></div>
    <div id="wildernessInfo">
    <div class="wilderness-info-div">
    <div class="form-control-new wilderness-info" style="padding:1rem;opacity:1 !important;">
    WINS<br>
    <input id="wildernessWins" type="number" class="form-control-new txt" style="width:180px;" disabled>
    </div><br>
    <div class="form-control-new wilderness-info" style="padding:1rem;opacity:1 !important;">
    LOSSES<br>
    <input id="wildernessLosses" type="number" class="form-control-new txt" style="width:180px;" disabled>
    </div>
    </div>
    <div class="wilderness-info-div">
    <div class="form-control-new wilderness-info" style="padding:1rem;opacity:1 !important;">
    TOTAL<br>
    <input id="wildernessTotal" type="number" class="form-control-new txt" style="width:180px;" disabled>
    </div><br>
    <div class="form-control-new wilderness-info" style="padding:1rem;opacity:1 !important;">
    BEST <img src="images/questwiki.jpg" onmouseover="statspopup(event,'% health remaining of best attack against current mob')" onmouseout="kill()" style="margin-bottom:5px;"><br>
    <input id="wildernessBest" type="number" class="form-control-new txt" style="width:180px;" disabled>
    </div>
    </div>
    </div>
    <button class="btn-mm" id="startWilderness">START</button>
    </div>
    `
    const atkLink = await appWildernessLoad()
    document.querySelector("#startWilderness").addEventListener('click', async function(){
        await appWildernessAttack(atkLink,0,0,100000000);
    });
};

async function appWildernessLoad(){
    const wilderness = await superfetch('wilderness',true);
    const atkLink = wilderness.match(/id="wildernessLink" href="([^"]*)"/i)[1];
    document.querySelector("#wildernessLvl").innerHTML = `<h1> LEVEL ${wilderness.match(/<h1>(.*?)<\/h1>/i)[1]}</h1>`;
    document.querySelector("#wildernessImg").innerHTML = `<img src="${wilderness.match(/src="([^"]*)" width="250" height="250"/i)[1]}" class="wilderness-mob-img">`;
    return atkLink;
};

async function appWildernessAttack(atkLink,wins,losses,best){

    const attack = await superfetch(atkLink,true);

    if (attack.match(/var successful = 1/i)){
        wins += 1;
        best = 100000000;
        atkLink = await appWildernessLoad();

    } else {
        losses += 1;
        const mobHp = parseInt(attack.match(/var defender_health_start = ([0-9]+)/i)[1]);
        const mobBaseDmgTaken = (attack.match(/defender_taken\[[0-9]+\] = '[0-9]+'/g) || []).reduce((sum, match) => sum + parseInt(match.match(/'([0-9]+)'/)[1]), 0);
        const mobHolyDmgTaken = (attack.match(/defender_elemental_taken\[[0-9]+\]\[[0-9]+\] = new Damage\([0-9]+, 'holy'\)/g) || []).reduce((sum, match) => sum + parseInt(match.match(/\(([0-9]+)/)[1]), 0);
        const mobArcnDmgTaken = (attack.match(/defender_elemental_taken\[[0-9]+\]\[[0-9]+\] = new Damage\([0-9]+, 'arcane'\)/g) || []).reduce((sum, match) => sum + parseInt(match.match(/\(([0-9]+)/)[1]), 0);
        const mobShadDmgTaken = (attack.match(/defender_elemental_taken\[[0-9]+\]\[[0-9]+\] = new Damage\([0-9]+, 'shadow'\)/g) || []).reduce((sum, match) => sum + parseInt(match.match(/\(([0-9]+)/)[1]), 0);
        const mobFireDmgTaken = (attack.match(/defender_elemental_taken\[[0-9]+\]\[[0-9]+\] = new Damage\([0-9]+, 'fire'\)/g) || []).reduce((sum, match) => sum + parseInt(match.match(/\(([0-9]+)/)[1]), 0);
        const mobKinkDmgTaken = (attack.match(/defender_elemental_taken\[[0-9]+\]\[[0-9]+\] = new Damage\([0-9]+, 'kinetic'\)/g) || []).reduce((sum, match) => sum + parseInt(match.match(/\(([0-9]+)/)[1]), 0);
        const mobChosDmgTaken = (attack.match(/defender_elemental_taken\[[0-9]+\]\[[0-9]+\] = new Damage\([0-9]+, 'chaos'\)/g) || []).reduce((sum, match) => sum + parseInt(match.match(/\(([0-9]+)/)[1]), 0);
        const mobRemainingHp = Math.max((mobHp-mobBaseDmgTaken-mobHolyDmgTaken-mobArcnDmgTaken-mobShadDmgTaken-mobFireDmgTaken-mobKinkDmgTaken-mobChosDmgTaken),0);
        const percent = ((mobRemainingHp/mobHp).toFixed(5))*100;
        if (percent < best){
            best = percent;
        };
    };
    document.querySelector("#wildernessWins").value = wins
    document.querySelector("#wildernessLosses").value = losses
    document.querySelector("#wildernessTotal").value = wins+losses
    document.querySelector("#wildernessBest").value = best
    await appWildernessAttack(atkLink,wins,losses,best);
};


async function appSavedRgas(server,serverNo,rgaName,charId){

    document.querySelector("#overlayWidget").innerHTML = `
    <div style="text-align:center;" id="saveRgasContainer">
    <h6>List session ids seperated by commas or paste from OWH</h6><hr>
    <textarea id="sessionsTextArea" class="form-control-new mb-3" style="resize:none;" cols="70" rows="10"></textarea><br>
    <button class="btn-mm" id="saveRgas">SAVE RGAS</button>
    <button class="btn-mm" id="deleteRgas">RESET RGAS</button><hr>
    <span id="hud"></span>
    </div>
    `

    if (GM_getValue('savedRgas').match("option")){
        const storage = GM_getValue('savedRgas')
        const sessions = storage.match(/rg_sess_id=[A-Za-z0-9]+/g).map(i => i.match(/rg_sess_id=([A-Za-z0-9]+)/)[1]);
        document.querySelector("#sessionsTextArea").value = sessions.join(',')
    };

    document.querySelector("#saveRgas").addEventListener('click',saveError);

    const box = document.querySelector("#sessionsTextArea");
    box.addEventListener('keyup', async function(){
        box.value = box.value.replace(/.*?:/g,'').replace(/ /g,'').replace(/[\n\r]/g,',');
        const count = (box.value.match(/\b[a-zA-Z0-9]{32}\b/g) || []).length;

        if (count >= 1){
            document.querySelector("#saveRgas").addEventListener('click',saveRgas);
            document.querySelector("#saveRgas").removeEventListener('click',saveError);
            document.querySelector("#hud").innerHTML = `Found ${count} sessions`
        };

        const characters = box.value.length;
        if (count != (characters+1)/33){
            document.querySelector("#saveRgas").removeEventListener('click',saveRgas);
            document.querySelector("#saveRgas").addEventListener('click',saveError);
            document.querySelector("#hud").innerHTML = `ERROR: Invalid entry`
        };

        if (box.value == ''){
            document.querySelector("#saveRgas").removeEventListener('click',saveRgas);
            document.querySelector("#saveRgas").addEventListener('click',saveError);
            document.querySelector("#hud").innerHTML = ''
        };
    });

    async function saveRgas(){
        document.querySelector("#saveRgasContainer").innerHTML = '<img src="https://studiomoxxi.com/moxximod/loading-gif.gif" height="80px" width="80px">'
        const postedRgas = await mmplus(`CustomRGA|rganame|${server}|${box.value}`);
        GM_setValue('savedRgas', postedRgas.replace(/value="home/g,`value="https://${server}.outwar.com/home`));
        await blankOff();
    };

    async function saveError(){
        alert('ERROR: Invalid entry');
    };

    document.querySelector("#deleteRgas").addEventListener('click', function(){
        GM_deleteValue('savedRgas');
        alert('Saved RGAs have been cleared');
        document.querySelector("#sessionsTextArea").value = '';
    });
};


async function appRaidsReport(server,serverNo,rgaName,charId){
    GM_addStyle(`
    img.raidsReportImg{box-shadow: 5px 5px 5px rgba(0, 0, 0, 1);cursor:pointer;transition: .5s ease-out;width:110px;height:110px;border-radius:5px;position:inline-block;margin-bottom:7px;animation: fadeIn 1s ease-in-out forwards;}
    @keyframes fadeIn {from {opacity: 0;} to {opacity: 1;}}
    img.raidsReportImg:hover{filter: saturate(250%);opacity:0.5;}
    div.reportImgDiv{display: inline-block;font-size: 9px;text-align: center;font-family: monospace,monospace;height:130px;width:130px;margin:10px;}
    `)
    document.querySelector("#overlayWidget").innerHTML = `
    <div id="raidsReportDiv" style="height:100%;overflow:auto;text-align:center;">
    <img src="https://studiomoxxi.com/moxximod/loading-gif.gif" style="height:100px;width:100px">
    </div>
    `
    const crewId = document.body.innerHTML.match(/crewid=([0-9]+)/i)[1]
    const raidResults = await superfetch(`crew_raidresults.php?all_results=Display+all+raid+results&crewid=${crewId}`);
    const targetsArray = raidResults.replace(/[\n\r]/g,'').replace(/[:\-]/g, "").match(/[0-9]+ [0-9]+[A-Za-z]+<\/td>.*?<td align="left" valign="top">.*?<\/td>/g).map(i => i.match(/<td align="left" valign="top">(.*?)<\/td>/i)[1])
    let uniqueTargets = [...new Set(targetsArray)];
    let imgArray = [];
    for (let i = 0; i < uniqueTargets.length; i++) {
        const godName = uniqueTargets[i]
        const nameTrimmed = godName.replace(/(,.*|of.*|The|the.*)/g, '');
        const regex = new RegExp(`${godName.replace(/\s+/g,'')}<\\/td><tdalign="left"valign="top"><fontcolor="[^"]*"><b>[A-Za-z]+<\\/b><\\/font><\\/td><tdalign="left"valign="top"><ahref="raidattack\\.php\\?raidid=[0-9]+">`)
        const raidId = raidResults.replace(/[\n\r]/g,'').replace(/[:\-]/g, "").replace(/\s+/g,'').match(regex).map(i => i.match(/raidid=([0-9]+)/i)[1]);
        const raid = await superfetch(`raidattack.php?raidid=${raidId}`);
        const raidImg = raid.replace(/[\n\r]/g,'').replace(/\s+/g,'').match(/<divclass="defenderimageskinborderd-flexjustify-content-centeralign-items-centermb-3"><imgsrc="([^"]*)"><\/div>/i)[1]
        imgArray.push(`<div class="reportImgDiv"><img src="${raidImg}" id="${nameTrimmed.replace(/ /g,'').toLowerCase()}" alt="${godName}" class="raidsReportImg"><br>${nameTrimmed.toUpperCase()}</div>`);
    };
    document.querySelector("#raidsReportDiv").innerHTML = `
    <h6>Which raid target would you like to run a damage report for?</h6><hr>
    ${imgArray.join('')}
    `

    const btnArray = document.querySelectorAll(".raidsReportImg");
    for (let i = 0; i < btnArray.length; i++) {
        const btn = btnArray[i]
        btn.addEventListener('click',async function(){
            const alt = btn.outerHTML.match(/alt="([^"]*)"/i)[1]
            const regex = new RegExp(`<td align="left" valign="top">${alt}<\/td>.*?raidid=[0-9]+">`,'g')
            const raidsArray = raidResults.replace(/[\n\r]/g,'').replace(/[:\-]/g, "").match(regex).map(i => i.match(/raidid=([0-9]+)/i)[1]);
            mmplus(`RaidsReport|rganame|${server}|${raidsArray.toString()}`);
            await blankOff();
        });
    };
};


async function appItemAnalyzer(server,serverNo,rgaName,charId){

    document.querySelector("#overlayWidget").innerHTML = `
    <div id="itemStorageDiv" style="text-align:center;height:100%;overflow:auto;">
    <img src="https://studiomoxxi.com/moxximod/loading-gif.gif" style="height:100px;width:100px">
    </div>
    `

    const charDropdown = document.body.innerHTML.replace(/[\n\r]/g,'').match(/<optgroup label="My Characters">.*?<option value="0">--Change Server--<\/option>/i)
    const charIdArray = charDropdown.toString().match(/value="[0-9]+"/g).map(match => match.match(/[0-9]+/)[0]).slice(0, -1);

    let tableData = [];
    const inventory = async (id) => {

        const fetchEq = await superfetch(`equipment?suid=${id}`);
        const itemsId = fetchEq.replace(/[\n\r]/g,'').replace(/<div style="position:absolute; left:10px; top:346px; width:32px; height:32px;text-align:center">.*/i,'').match(/event,'([0-9]+)'/g);

        if (itemsId){
            for (let i = 0; i < itemsId.length; i++) {
                const iid = itemsId[i].match(/[0-9]+/i)[0];
                const itemData = await superfetchItem(iid);
                const name = itemData.name;
                const gems = itemData.gems;
                const augs = itemData.augids.length;
                const open = itemData.augsOpen;
                const atk = itemData.atk;
                const hp = itemData.hp;
                const maxrage = itemData.maxrage;
                const rarity = itemData.rarity;

                if (gems != 4){
                    const upgrades = await info("Cost to One Gem");
                    const cost = upgrades[rarity][gems];
                    tableData.push(`
                        <tr id="row${iid}">
                        <td><a id="delete${iid}" href="javascript:void(0);">&#x2718;</a></td>
                        <td><input type="checkbox" id="check${iid}"></td>
                        <td><a href="blacksmith?itemid=${iid}&suid=${id}" target="_blank" id="iid${iid}" class="itemLink">${name}</a></td>
                        <td>${gems}</td>
                        <td>${augs+open}</td>
                        <td><a href="augmentequip?suid=${id}" target="_blank">${open}</a></td>
                        <td>${((atk+hp)*0.15/cost).toFixed(2)}</td>
                        <td>${(maxrage*0.15/cost).toFixed(2)}</td>
                        </tr>
                    `);
                };
            };
        };
    };
    await Promise.all(charIdArray.map(inventory));

    document.querySelector("#itemStorageDiv").innerHTML = `
    <table id="inventory" class="table table-striped sortable" style="text-align:left">
    <thead><tr>
    <th><img src="images/questwiki.jpg" onmouseover="statspopup(event,'Click to delete the row')" onmouseout="kill()" style="margin-bottom:5px;"></th>
    <th><img src="images/questwiki.jpg" onmouseover="statspopup(event,'Mark completed. Will auto-check if you click on the item name')" onmouseout="kill()" style="margin-bottom:5px;"></th>
    <th>Item</th>
    <th>Gems</th>
    <th>Aug Slots</th>
    <th>Open Augs</th>
    <th>ATK+HP Gained per Point<br>with one gem added</th>
    <th>Max Rage gained per Point<br>with one gem added</th>
    </tr></thead>
    <tbody>${tableData.join('')}</tbody>
    </table>
    `

    const itemLinks = document.querySelectorAll(".itemLink")
    for (let i = 0; i < itemLinks.length; i++) {
        const link = itemLinks[i]
        const iid = link.outerHTML.match(/id="iid([0-9]+)"/)[1]
        document.querySelector(`#iid${iid}`).addEventListener('click',function(){
            document.querySelector(`#check${iid}`).checked = true;
        });
        document.querySelector(`#delete${iid}`).addEventListener('click',function(){
            document.querySelector(`#row${iid}`).remove();
        });
    };

    sortableTables();
};


async function appMobAttacker(server,serverNo,rgaName,charId){

    GM_addStyle(`
        #mobAtkWidget {text-align:center;}
        .mob-div > input {width: 100px;font-size: 10px;padding: 5px;margin:5px;}
        .mob-div > img {height: 100px;width: 100px;border-radius: 15px;border:2px SOLID #313131;cursor: pointer;margin:5px;}
        .mob-div {display: inline-block;margin-bottom: 1rem;font-family: monospace;font-size: 12px;text-align: center;}
        #authSlider{display:none;}
        .mob-selected{border: 3px #00CC00 SOLID !important;padding: 3px !important;animation: mob-selected 1s infinite;}
        @keyframes mob-selected{0% {filter: saturate(100%);} 50% {filter: saturate(250%); } 100% {filter: saturate(100%);}}
    `)

    document.querySelector("#overlayWidget").innerHTML = `
        <div id="mobAtkWidget">
        <h4>CREATING BATTLE PLAN</h4><br>
        <img src="https://studiomoxxi.com/moxximod/loading-gif.gif" style="height:100px;width:100px">
        </div>
    `

    if (GM_getValue('savedRgas') != "no sessions saved" && GM_getValue('savedRgas')){
        const rgas = GM_getValue('savedRgas').match(/rg_sess_id=[A-Za-z0-9]+&suid=[0-9]+&serverid=[0-9]+/g);
        await loadChars(rgas);

    } else {
        await loadChars([`rg_sess_id=${rgaName}&suid=${charId}&serverid=${serverNo}`]);
    };

    async function loadChars(rgas){
        const strings = []
        const parseChars = async (string) => {

            const session = string.match(/rg_sess_id=([A-Za-z0-9]+)/)[1];
            const auth = await mmplus(`AuthCheck|${session}`);

            if (!auth.match("Full")){
                return;
            };

            const startingId = string.match(/suid=([0-9]+)/i)[1];
            const ajax = await superfetch(`ajax/accounts.php?t_serv=${serverNo}&${string}`);
            const chars = ajax.match(/"id":"[0-9]+"/g).map(id => id.match(/[0-9]+/i));
            chars.forEach(async char => {
                strings.push(string.replace(startingId,char));
            });
        };
        await Promise.all(rgas.map(parseChars));

        let mobs = {
            "seeping":{charNames:[],charIds:[],quest:2092,id:4379,mobName:'SEEPING',roomNum:32876,mobImg:'images/mobs/chaosgolem5.jpg'},
            "deluged":{charNames:[],charIds:[],quest:2093,id:4380,mobName:'DELUGED',roomNum:32878,mobImg:'images/mobs/chaosgolem2.jpg'},
            "volatile":{charNames:[],charIds:[],quest:2094,id:4381,mobName:'VOLATILE',roomNum:32877,mobImg:'images/mobs/chaosgolem4.jpg'},
            "lorren3":{charNames:[],charIds:[],quest:1532,id:3731,mobName:'PERPETUAL',roomNum:26616,mobImg:'images/mobs/mobc62.jpg'},
            "aestor3":{charNames:[],charIds:[],quest:1891,id:3920,mobName:'ROENOV',roomNum:27528,mobImg:'images/mobs/mobm93.jpg'},
            "aestor4":{charNames:[],charIds:[],quest:1916,id:3921,mobName:'SKITTOR',roomNum:27527,mobImg:'images/mobs/mobz2.jpg'},
            "aestor5":{charNames:[],charIds:[],quest:1917,id:3922,mobName:'ERGON',roomNum:27526,mobImg:'images/mobs/mobi18.jpg'},
            "ferocity":{charNames:[],charIds:[],quest:2035,id:4038,mobName:'ULKOR',roomNum:28122,mobImg:'images/mobs/mobc48.jpg'},
            "class":{charNames:[],charIds:[],quest:2033,id:4035,mobName:'YOUNIS',roomNum:28113,mobImg:'images/mobs/mobk9.jpg'},
            "hovok":{charNames:[],charIds:[],quest:0,id:4046,mobName:'HOVOK',roomNum:28123,mobImg:'images/mobs/mobm91.jpg'},
            "rank5":{charNames:[],charIds:[],quest:1941,id:3931,mobName:'DARKLORD',roomNum:27608,mobImg:'images/mobs/moba76.jpg'},
            "rank10":{charNames:[],charIds:[],quest:1942,id:3932,mobName:'FIREPRIEST',roomNum:27609,mobImg:'images/mobs/mobh85.jpg'},
            "rank15":{charNames:[],charIds:[],quest:1943,id:3933,mobName:'ENCHANTER',roomNum:27632,mobImg:'images/mobs/mobi58.jpg'},
            "rank20":{charNames:[],charIds:[],quest:1944,id:3934,mobName:'DIVINER',roomNum:27633,mobImg:'images/mobs/mobz78.jpg'},
            "normok2":{charNames:[],charIds:[],quest:2047,id:4050,mobName:'CORVOK',roomNum:27624,mobImg:'images/mobs/mobd12.jpg'},
            "invader":{charNames:[],charIds:[],quest:2359,id:5274,mobName:'INVADER',roomNum:37878,mobImg:'images/mobs/mobh31.png'},
            "thief":{charNames:[],charIds:[],quest:0,id:3519,mobName:'THIEF',roomNum:26199,mobImg:'images/mobs/mobz59.jpg'},
            "betrayer":{charNames:[],charIds:[],quest:0,id:3520,mobName:'BETRAYER',roomNum:26200,mobImg:'images/mobs/mobz41.jpg'},
            "plant":{charNames:[],charIds:[],quest:0,id:4392,mobName:'PLANT',roomNum:31686,mobImg:'images/mobs/woodsplant.jpg'},
            "gveiled":{charNames:[],charIds:[],quest:0,id:5301,mobName:'GUARD',roomNum:42619,mobImg:'images/mobs/veiledguard.png'},
            "kveiled":{charNames:[],charIds:[],quest:0,id:5302,mobName:'KEEPER',roomNum:42620,mobImg:'images/mobs/veiledkeeper.png'},
            "aprecision":{charNames:[],charIds:[],quest:0,id:5481,mobName:'PRECISION',roomNum:0,mobImg:'images/mobs/owmob784.png'},
            "dprecision":{charNames:[],charIds:[],quest:0,id:5482,mobName:'PRECISION',roomNum:0,mobImg:'images/mobs/owmob176.png'},
            "vprecision":{charNames:[],charIds:[],quest:0,id:5483,mobName:'PRECISION',roomNum:0,mobImg:'images/mobs/owmob1129.png'}
        };

        const circArray = [];
        const oorArray = [];

        async function scanChars(string){

            const profileData = await superfetchProfile(`profile?${string}`);

            const kbp = await superfetch(`ajax/backpackcontents.php?tab=key&${string}`);
            const veiledteleporter = kbp.match(/data-name="Veiled Teleporter"/i);
            const veiledidol = kbp.match(/data-name="Veiled Idol"/i);
            const groveinsignia = kbp.match(/data-name="Grove Insignia"/i);

            const id = string.match(/rg_sess_id=([A-Za-z0-9]+)/i)[1] + '&' + string.match(/suid=([0-9]+)/i)[1];
            const name = profileData.name;
            const rage = profileData.currentrage;
            const circ = profileData.skills.list.includes("Circumspect") ? "Yes" : "No"
            const faction = profileData.faction;
            const loyalty = profileData.loyalty;

            if (rage < 1000){
                oorArray.push(name);

            } else {
                for (const mobName of Object.keys(mobs)) {
                    const mob = mobs[mobName];

                    const quest = mob.quest == 0 ? "noquest" : await superfetch(`quest_info.php?questnum=${mob.quest}&${string}`);

                    if (quest != "error"){

                        if (mobName == "hovok"){
                            const quantum = await superfetch(`quest_info.php?questnum=${2038}&${string}`);
                            const explosive = await superfetch(`quest_info.php?questnum=${2039}&${string}`);
                            const violent = await superfetch(`quest_info.php?questnum=${2040}&${string}`);
                            const onslaught = await superfetch(`quest_info.php?questnum=${2041}&${string}`);
                            if (quantum != "error" || explosive != "error" || violent != "error" || onslaught != "error"){
                                const search = await superfetch(`mob_search.php?target=${mob.id}&${string}`);
                                if (search.match(/Quest help activated/i)){
                                    mob.charNames.push(name);
                                    mob.charIds.push(id);
                                };
                            };

                        } else if (mobName.match("veiled")){
                            if (mobName == "gveiled" && veiledteleporter){
                                const search = await superfetch(`mob_search.php?target=${mob.id}&${string}`);
                                if (search.match(/Quest help activated/i)){
                                    mob.charNames.push(name);
                                    mob.charIds.push(id);
                                };
                            } else if (mobName == "kveiled" && veiledidol){
                                const search = await superfetch(`mob_search.php?target=${mob.id}&${string}`);
                                if (search.match(/Quest help activated/i)){
                                    mob.charNames.push(name);
                                    mob.charIds.push(id);
                                };
                            };

                        } else if (mobName.match("precision")){
                            if (mobName == "aprecision" && faction == "Alvar" && loyalty >= 1 && groveinsignia){
                                const search = await superfetch(`mob_search.php?target=${mob.id}&${string}`);
                                if (search.match(/Quest help activated/i)){
                                    mob.charNames.push(name);
                                    mob.charIds.push(id);
                                };
                            } else if (mobName == "dprecision" && faction == "Delruk" && loyalty >= 1 && groveinsignia){
                                const search = await superfetch(`mob_search.php?target=${mob.id}&${string}`);
                                if (search.match(/Quest help activated/i)){
                                    mob.charNames.push(name);
                                    mob.charIds.push(id);
                                };
                            } else if (mobName == "vprecision" && faction == "Vordyn" && loyalty >= 1 && groveinsignia){
                                const search = await superfetch(`mob_search.php?target=${mob.id}&${string}`);
                                if (search.match(/Quest help activated/i)){
                                    mob.charNames.push(name);
                                    mob.charIds.push(id);
                                };
                            };

                        } else {
                            const search = await superfetch(`mob_search.php?target=${mob.id}&${string}`);
                            if (search.match(/Quest help activated/i)){
                                mob.charNames.push(name);
                                mob.charIds.push(id);
                            };
                        };
                    };
                };
            };
        };
        await Promise.all(strings.map(scanChars));

        const divs = [];
        if (oorArray.length > 0){
            divs.push(`<div class="mob-div"><img src="images/rfury.jpg"><br>OUT OF RAGE<br>${oorArray.length} attackers<br><input type="text" class="form-control-new" value="${oorArray.join(',')}"></div>`);
        };
        for (const mobName of Object.keys(mobs)) {
            const mob = mobs[mobName]
            if (mob.charIds.length > 0){
                divs.push(`
                    <div class="mob-div">
                    <img src="${mob.mobImg}" class="mob-img" name="${mob.mobName.toLowerCase()}" alt="${mob.roomNum}|${mob.charIds.join(',')}"><br>
                    ${mob.mobName}<br>
                    ${mob.charIds.length} attackers<br>
                    <input type="text" class="form-control-new list-of-chars" value="${mob.charNames.join(',')}">
                    </div>
                `);
            };
        };

        document.querySelector("#mobAtkWidget").innerHTML = `
            <h4>CLICK MOB IMAGES TO SELECT TARGETS</h4>
            <div style="background-color:#000000;padding:10px;border-radius:10px;box-shadow:5px 5px 5px rgba(0, 0, 0, 1);margin-bottom:1rem;">
            ${divs.join('')}
            </div>
            <button class="btn-mm" id="attackMobs">ATTACK SELECTED MOBS</button>
        `

        const textBoxes = document.querySelectorAll(".list-of-chars");
        textBoxes.forEach(i => {
            i.addEventListener('click',function(){
                i.select();
            });
        });

        const mobPics = document.querySelectorAll(".mob-img");
        mobPics.forEach(i => {
            i.addEventListener('click',function(){
                i.classList.toggle('mob-selected');
            });
        });

        document.querySelector("#attackMobs").addEventListener('click',async function(){
            const cmd = [`NewMobAtk|rganame|${server}|`];
            const selectedMobs = document.querySelectorAll(".mob-selected");
            selectedMobs.forEach(i => {
                const mobName = i.outerHTML.match(/name="([^"]*)"/i)[1];
                const selectedChars = i.outerHTML.match(/alt="([^"]*)"/i)[1];
                cmd.push(`${mobName}|${selectedChars.replace(/amp;/g,'')}`);
            });
            document.querySelector("#attackMobs").remove();
            await mmplus(cmd.join("\n"));
            GM_addStyle('#authSlider{display:revert !important;}');
        });
    };
};


async function appGladiator(server,serverNo,rgaName,charId){
    GM_addStyle(`
        div.glad-app-box{box-shadow:5px 5px 5px rgba(0, 0, 0, 1);border-radius:10px !important;padding:20px !important;}
        img.glad-app-mob-img{height:250px;width:250px;margin:10px;border-radius:10px;box-shadow: 5px 5px 5px rgba(0, 0, 0, 1);transition: width 0.5s ease, height 0.5s ease;}
        #gladWorkspace{opacity:0;transition:opacity 0.5s ease;}
        #gladWorkspace > div{margin:10px;display:inline-block;vertical-align:top;}
        img.glad-despawned{filter:grayscale(100%);}
        img.glad-spawned{cursor:pointer;}
        td.my-glad-attacks{filter:invert(100%)}
        input.glad-txt{background:#FFFFFF !important;color:#000000 !important;opacity:1 !important;}
        #gladSkillsCast > table > tbody > tr > td > img{width: 30px;height: 30px;margin: 1px;border-radius: 5px;border: 2px #475254 SOLID;}
        #gladSkillsMissing > table > tbody > tr > td > img{width: 30px;height: 30px;margin: 1px;border-radius: 5px;border: 2px #475254 SOLID;}
        #rankingsOverflow{max-height:400px;overflow:auto;}

    `)
    const ajax = await superfetch('ajax_changeroomb');
    const room = ajax.match(/"curRoom":"([0-9]+)"/i)[1];
    if (room == "28031"){
        const gladPage = await superfetch('gladiator');
        const parser = new DOMParser();
        const gladHtml = parser.parseFromString(gladPage, 'text/html');
        const divQuest = gladHtml.querySelectorAll(".divQuest");
        const gladMobs = [];
        divQuest.forEach(div => {
            const html = div.innerHTML;
            const status = html.match("Will retreat in") ? "glad-spawned" : "glad-despawned";
            const imgSrc = html.match(/src="[^"]*"/i);
            const mobId = html.match(/mobid=[0-9]+/i);
            const mobName = html.match(/<h1>(.*?)<\/h1>/i)[1];
            const img = `<img ${imgSrc} class="${status} glad-app-mob-img" alt="${mobId}" name="${mobName}">`
            gladMobs.push(img);
        });
        document.querySelector("#overlayWidget").innerHTML = `
            <div style="text-align:center">
                ${gladMobs.join('')}
                <div id="gladWorkspace">
                    <div style="width:45%">
                        <div class="list-group-item glad-app-box" id="gladTools" style="margin-bottom:20px;">tools</div>
                        <div class="list-group-item glad-app-box" id="gladSkillsCast" style="margin-bottom:20px;">skills cast</div>
                        <div class="list-group-item glad-app-box" id="gladSkillsMissing" style="margin-bottom:20px;">skills missing</div>
                    </div>
                    <div style="width:45%">
                        <div class="list-group-item glad-app-box" id="gladRankings" style="margin-bottom:20px;">
                        rankings
                        </div>
                    </div>
                </div>
            </div>
        `

        const allGlads = document.querySelectorAll(".glad-app-mob-img");
        const aliveGlads = document.querySelectorAll(".glad-spawned");
        aliveGlads.forEach(img => {
            img.addEventListener('click', async function(){
                const imgData = img.outerHTML;

                const mobName = imgData.match(/name="([^"]*)"/i)[1];
                document.querySelector("#gladTools").innerHTML = `
                    Current Rage: <span id="gladRage">loading</span><br>
                    <h2>${mobName}</h2>
                    Stop after <input id="stopAttacks" type="number" class="form-control-new glad-txt" style="width:100px;" autocomplete="off"> attacks or <input id="stopDamage" type="number" class="form-control-new glad-txt" autocomplete="off" style="width:200px;"> damage
                    <br>
                    <button id="atkGlad" class="btn-mm" style="margin-top:20px;">Attack ${mobName}</button>
                `

                const mobId = imgData.match(/alt="mobid=([0-9]+)"/i)[1];
                await appGladiatorGetRankings(mobId,charId);

                const profileData = await superfetchProfile('profile');
                document.querySelector("#gladSkillsCast").innerHTML = `<table class="table table-striped"><tr><td><h6>Active Skills & Potions</h6>${profileData.skills.images.join('')}</tr></td></table>`
                const castPotionsList = profileData.skills.list;
                const allOwPotions = await info("All Potions");
                const missingPotions = [];
                allOwPotions.forEach(pot => {
                    const potName = pot[0];
                    const potImg = pot[1];
                    if (!castPotionsList.includes(potName)){
                        missingPotions.push(`<img src="${potImg}" onmouseover="statspopup(event,'<b>${potName}<b>')" onmouseout="kill()">`)
                    };
                });
                document.querySelector("#gladSkillsMissing").innerHTML = `<table class="table table-striped"><tr><td><h6>Missing Potions</h6>${missingPotions.join('')}</tr></td></table>`

                document.querySelector("#atkGlad").addEventListener('click', async function(){
                    const stopAttacks = parseInt(document.querySelector("#stopAttacks").value.replace(/,/g,''));
                    if (stopAttacks > 1000){
                        alert('Cannot attack gladiator more than 1,000 times');
                        return;
                    };
                    const stopDamage = document.querySelector("#stopDamage").value.replace(/,/g,'');
                    if (isNaN(stopAttacks) || isNaN(stopDamage) || stopAttacks == '' || stopDamage == ''){
                        alert('ERROR: Please enter target amounts for number of attacks and damage');
                    } else {
                        const regex = new RegExp(`"name":"${mobName}","level":"[0-9]+","rage":"[0-9]+","h":"[^"]*","encid":"[^"]*","mobId":"[0-9]+","spawnId":"[0-9]+","image":"[^"]*"`,'i');
                        const string = ajax.match(regex).toString();
                        const spawnId = string.match(/"spawnId":"([0-9]+)"/)[1]
                        await mmplus(`MultiMobAtk|rganame|${server}|${charId}|${stopAttacks}|${spawnId}|${stopDamage}`);
                    };
                });

                setInterval(async () => {
                    const userstats = await superfetch('userstats',true);
                    const rage = userstats.match(/"rage":"([^"]*)"/i) ? userstats.match(/"rage":"([^"]*)"/i)[1] : "Error";
                    document.querySelector("#gladRage").innerHTML = rage;
                }, 500);

                allGlads.forEach(resize => { resize.style.width = '50px'; resize.style.height = '50px'; });
                document.querySelector("#gladWorkspace").style.opacity = "1";
            });
        });
    } else {

        document.querySelector("#overlayWidget").innerHTML = `<center><h3>Must be in the Gladiator Arena</h3><hr><button class="btn-mm" id="goTo28031">GO TO RM 28031</button></center>`
        document.querySelector("#goTo28031").addEventListener('click', async function(){ await goToRoomNum(server,charId,28031); });
    };
};


async function appGladiatorGetRankings(mobId,charId){
    const gladPageTxt = await superfetch(`gladiator?mobid=${mobId}`,true);
    const parser = new DOMParser();
    const gladPageHtml = parser.parseFromString(gladPageTxt, 'text/html');
    const divs = Array.from(gladPageHtml.querySelectorAll('.mt-lg-0 .grid-item')).map(div => div.innerHTML);
    let columns = divs.indexOf("Atks") + 1;

    const rankArrays = [];
    let tempArray = [];
    divs.forEach((div, index) => {
        tempArray.push(div);

        if ((index + 1) % (columns) === 0) {
            rankArrays.push(tempArray);
            tempArray = [];
        }
    });

    const rows = [];
    rankArrays.forEach(col => {
        let row = ''
        for (let i = 0; i < columns; i++) {
            if (col.toString().match(`id=${charId}`)){
                row += `<td class="my-glad-attacks">${col[i]}</td>`
            } else {
                row += `<td>${col[i]}</td>`
            }
        };
        rows.push(`<tr>${row}</tr>`);
    });
    document.querySelector("#gladRankings").innerHTML = `
        <div id="rankingsOverflow">
        <table id="rankingsTable" class="table table-striped">
        ${rows.join('').replace(/<a.*?>/g,'')}
        </table>
        </div><br>
        <button id="resfreshRankings" class="btn-mm" style="margin-bottom:10px;">Refresh Rankings</button>
    `

    let targetRow = document.querySelector(".my-glad-attacks");
    if (targetRow) {
        targetRow.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    document.querySelector("#resfreshRankings").addEventListener('click', async function(){
        await appGladiatorGetRankings(mobId,charId);
    });
};


async function casterMenu(rgaName,charId,serverNo,profileData){
    travelMenuClose();
    appsMenuClose();
    searchMenuClose();

    const menu = document.querySelector("#btnCaster");
    if (!menu.classList.contains("menu-created")) {
        await casterMenuBuild(rgaName,charId,serverNo,profileData);
        menu.classList.add("menu-created");
    };
    if (menu.classList.contains("menu-open")) {
        await casterMenuClose();
        await casterMenuRefresh(rgaName,charId,serverNo,profileData);
        menu.classList.add("menu-close");
        menu.classList.remove("menu-open");
    } else {
        await casterMenuOpen(rgaName,charId,serverNo);
        await casterMenuRefresh(rgaName,charId,serverNo,profileData);
        menu.classList.add("menu-open");
        menu.classList.remove("menu-close");
    };
};


async function casterMenuOpen(rgaName,charId,serverNo) {

    document.querySelector("#btnCaster > img").classList.toggle('rotate180');
    GM_addStyle (`#btnCaster > img {transition: transform 0.5s ease;}`);
    GM_addStyle (`.rotate180 {transform: rotate(180deg);}`);

    GM_addStyle (`#casterDiv {animation: moveAnimation 0.5s ease forwards;position:fixed;}`)
    GM_addStyle (`@keyframes moveAnimation {0% {width:700px;height:0px;position:fixed;top:0px;} 100% {width:700px;height:535px;position:fixed;top:45px;}}`)
};


async function casterMenuBuild(rgaName,charId,serverNo,profileData) {
    const server = serverNo == "1" ? "sigil" : "torax";


    const casterHtml = `
    <div id="casterSkills"></div><p>
    <div id="casterPotions"></div>
    <p style="margin-top:1rem;">
    <center>
    <button class="btn-mm" id="casterCastAll" style="background-color:#480000">Cast selected</button>
    <button class="btn-mm" id="casterSelectAll">Select all skills</button>
    <button class="btn-mm" id="casterDeselectAll">Deselect all skills</button>
    <p style="margin-top:1rem;">
    <select class="btn-mm" id="casterPresetsDrop"><option value="" disabled="" selected="" hidden="">Select preset</option></select>
    <button class="btn-mm" id="saveAsPreset">Save preset</button>
    <button class="btn-mm" id="deletePreset">Delete preset</button>
    `

    var image = document.querySelector("#btnCaster").getBoundingClientRect();
    var newDiv = document.createElement('div');
    newDiv.id = 'casterDiv';
    newDiv.classList.toggle('widget');
    newDiv.innerHTML = casterHtml;
    newDiv.style.position = 'absolute';
    newDiv.style.top = image.top + window.scrollY + 'px';
    newDiv.style.left = image.left + window.scrollX-650 + 'px';
    document.body.appendChild(newDiv);


    document.getElementById('casterDiv').addEventListener('click', function(event) {
        if (event.target.tagName.toLowerCase() === 'img') {
            const imgElement = event.target;
            if (imgElement.id === 'boosterPotions' && !imgElement.classList.contains('caster-selected')) {
                const confirmBoost = confirm('Are you sure you want to cast booster potions for 25 points?');
                if (confirmBoost) {
                    imgElement.classList.toggle('caster-selected');
                } else {
                    return;
                }
            } else {
                imgElement.classList.toggle('caster-selected');
            }
        }
    });

    document.querySelector("#casterSelectAll").addEventListener('click', function() {
        $("#casterSkills > img").addClass("caster-selected");
    });
    document.querySelector("#casterDeselectAll").addEventListener('click', function() {
        $("#casterSkills > img").removeClass("caster-selected");
    });
    document.querySelector("#casterCastAll").addEventListener('click', async function() {

        if (document.querySelector("#boosterPotions")){
            if (document.querySelector("#boosterPotions").classList.contains("caster-selected")) {
                await superfetch('userbuff.php?castboost=1',true);
                await superfetch('userbuff.php?castboost=1',true);
                await superfetch('userbuff.php?castboost=1',true);
                await superfetch('userbuff.php?castboost=1',true);
                await superfetch('userbuff.php?castboost=1',true);
            };
        };

        const selectedImages = document.querySelector("#casterDiv").querySelectorAll("img.caster-selected");
        const imgIds = Array.from(selectedImages).map(img => img.id);
        await mmplus(`Cast|rganame|${server}|${charId}|${imgIds.join(',')}`);
        await casterMenuClose();
    });

    document.querySelector("#saveAsPreset").addEventListener('click', async function(){
        const selectedImages = document.querySelector("#casterDiv").querySelectorAll("img.caster-selected");
        const imagesArray = Array.from(selectedImages, node => node.currentSrc).map(url => url.replace("https://torax.outwar.com/", ""));
        const presetName = prompt('Please name this preset');
        if (presetName == ''){
            alert(`You did not enter a name for the preset. It wasn't saved`);
        } else if (presetName.length > 20){
            alert(`Error: Maximum length allowed is 20 characters`);
        } else {
            for (let i = 0; i < 10; i++) {
                const value = GM_getValue(`casterPreset(${i})`);
                if (!value){
                    GM_setValue(`casterPreset(${(i)})`, presetName + "|" + imagesArray.toString());
                    document.querySelector("#casterPresetsDrop").innerHTML += `<option id="casterPreset(${i})" value="casterPreset(${i})" data-images="${imagesArray}">${presetName}</option>`
                    break;
                };
                if (i == 9){
                    alert(`You aleady have the maximum of 10 presets. Please delete one before adding more.`);
                };
            };
        };
    });

    for (let i = 0; i < 10; i++) {
        const value = GM_getValue(`casterPreset(${i})`);
        if (value){

            const presetName = value.split('|').slice(0, 1);
            const presetArray = value.split('|').slice(1);
            document.querySelector("#casterPresetsDrop").innerHTML += `<option id="casterPreset(${i})" value="casterPreset(${i})" data-images="${presetArray}">${presetName}</option>`
        };
    };

    document.querySelector("#deletePreset").addEventListener('click', async function(){
        const targetPreset = document.querySelector("#casterPresetsDrop").value;
        document.querySelector(`[id="${targetPreset}"]`).remove();
        GM_deleteValue(targetPreset);
    });

    document.querySelector("#casterPresetsDrop").addEventListener('change', async function() {

        const dataImages = this.options[this.selectedIndex].outerHTML.match(/data-images="([^"]*)"/i);
        const presetArray = dataImages[1].split(',');

        const casterDiv = document.getElementById("casterDiv");


        casterDiv.querySelectorAll("img.caster-selected").forEach(img => {
            img.classList.remove("caster-selected");
        });


        presetArray.forEach(imageSrc => {
            casterDiv.querySelectorAll("img").forEach(img => {

                if (img.src.includes(imageSrc.trim())) {
                    img.classList.add("caster-selected");
                };
            });
        });
    });

    GM_addStyle (`#casterDiv {animation: moveAnimation 0.5s ease forwards;position:fixed;}`)
    GM_addStyle (`@keyframes moveAnimation {0% {width:700px;height:0px;position:fixed;top:0px;} 100% {width:700px;height:535px;position:fixed;top:45px;}}`)
};

async function casterMenuRefresh(rgaName,charId,serverNo,profileData){
    document.querySelector("#casterSkills").innerHTML = '<img src="https://studiomoxxi.com/moxximod/loading-gif.gif" height="50px" width="50px">';
    document.querySelector("#casterPotions").innerHTML = '<img src="https://studiomoxxi.com/moxximod/loading-gif.gif" height="50px" width="50px">';
    const allCast = profileData.skills.list;

    let potsArray = [];

    if (!allCast.match("Boost One")){
        potsArray.push(`<img src="images/items/icon_vial_blue.jpg" class="castable cast-potion" onmouseover="statspopup(event,'<b>Cast all 5 booster potions</b><br>Cost: 25 points')" onmouseout="kill()" id="boosterPotions">`);
    };

    const potionBp = await superfetch('ajax/backpackcontents.php?tab=potion');
    const parseData = new DOMParser();
    const potionBpDoc = parseData.parseFromString(potionBp, 'text/html');
    const allPots = potionBpDoc.querySelectorAll('img');
    for (let i = 0; i < allPots.length; i++) {
        const potion = allPots[i].outerHTML;
        const potId = potion.match(/data-iid="([0-9]+)"/i)[1];
        const potImg = potion.match(/src="([^"]*)"/i)[1];
        const potAlt = potion.match(/alt="([^"]*)"/i)[1];
        if (!allCast.includes(potAlt)){
            potsArray.push(`<img src="${potImg}" class="castable cast-potion" id="${potId}" onmouseover="itempopup(event,'${potId}')" onmouseout="kill()">`);
        };
    };

    let skillsArray = [];
    let skillIdArray = [];
    const classEndpoints = ['cast_skills.php','cast_skills.php?C=4','cast_skills.php?C=5','cast_skills.php?C=6','cast_skills.php?C=7']
    const skillClasses = await Promise.all(classEndpoints.map(endpoint => fetch(endpoint).then(res => res.text())));
    for (let i = 0; i < skillClasses.length; i++) {
        const skillIds = skillClasses[i].match(/loadskill\([0-9]+\)/g) || [];
        for (let i = 0; i < skillIds.length; i++) {
            skillIdArray.push(skillIds[i].match(/[0-9]+/i))
        };
    };
    const skillInfos = await Promise.all(skillIdArray.map(endpoint => fetch(`skills_info.php?id=${endpoint}`).then(res => res.text())));
    for (let i = 0; i < skillInfos.length; i++) {
        const info = skillInfos[i]
        if (info.match(`<input type="submit" name="cast" class="btn btn-primary" value="Cast Skill">`)){
            const skillName = info.match(/<h5>(.*?)<\/h5>/i)[1]
            const skillImg = info.match(/style="[^"]*" src="([^"]*)"/i)[1]
            const skillId = info.match(/value="([0-9]+)"/i)[1]
            const skillText = info.replace(/[\n\r]/g,'').replace(/'/g,'').match(/<h5>(.*?)<\/div>/)[1];
            if (!allCast.includes(skillName)){
                skillsArray.push(`<img src="${skillImg}" class="castable cast-skill" id="${skillId}" onmouseover="statspopup(event,'<b>${skillName}</b><br>${skillText}')" onmouseout="kill()">`)
            };
        };
    };
    document.querySelector("#casterSkills").innerHTML = skillsArray.join(' ');
    document.querySelector("#casterPotions").innerHTML = potsArray.join (' ');
};


async function searchMenu(rgaName,charId,serverNo) {
    casterMenuClose();
    appsMenuClose();
    travelMenuClose();

    const menu = document.querySelector("#btnSearch");
    if (!menu.classList.contains("menu-created")) {
        await searchMenuBuild(rgaName,charId,serverNo);
        menu.classList.add("menu-created");
    }
    if (menu.classList.contains("menu-open")) {
        await searchMenuClose();
    } else {
        await searchMenuOpen(rgaName,charId,serverNo);
        menu.classList.add("menu-open");
        menu.classList.remove("menu-close");
    };
};


async function searchMenuOpen(rgaName,charId,serverNo) {

    document.querySelector("#btnSearch > img").classList.toggle('rotate180');
    GM_addStyle (`#btnSearch > img {transition: transform 0.5s ease;}`);
    GM_addStyle (`.rotate180 {transform: rotate(180deg);}`);

    GM_addStyle (`#searchDiv {animation: moveAnimation 0.5s ease forwards;position:fixed;}`)
    GM_addStyle (`@keyframes moveAnimation {0% {width:270px;height:0px;position:fixed;top:0px;} 100% {width:270px;height:275px;position:fixed;top:45px;}}`)

    document.querySelector("#t-text").select();
};

async function searchMenuBuild(rgaName,charId,serverNo){

    const searchHtml = `
    <h4>Search</h4>
    <form method="post" action="playersearch.php" target="_parent" style="display:inline-block;">
    <input style="width:230px;" id="t-text" name="search" type="text" placeholder="PLAYER PROFILE" class="form-control-new mb-2" autocomplete="off">
    </form>
    <br>
    <input style="width:230px;" id="playerTrade" type="text" placeholder="PLAYER TRADE" class="form-control-new mb-2" autocomplete="off">
    <br>
    <form method="post" action="crewsearch.php" target="_parent" style="display:inline-block">
    <input style="width:230px;" id="t-text" name="search" type="text" placeholder="CREW" class="form-control-new mb-2" autocomplete="off">
    </form>
    <br>
    <input style="width:230px;" id="treasurySearch" type="text" placeholder="TREASURY" class="form-control-new mb-2" autocomplete="off">
    <br>
    <input style="width:230px;" id="rgaSearch" type="text" placeholder="ITEM ON RGA" class="form-control-new mb-2" autocomplete="off">
    <br>
    <div id="rgaSearchDiv"></div>
    `

    var image = document.querySelector("#btnSearch").getBoundingClientRect();
    var newDiv = document.createElement('div');
    newDiv.id = 'searchDiv';
    newDiv.classList.toggle('widget');
    newDiv.innerHTML = searchHtml;
    newDiv.style.position = 'absolute';
    newDiv.style.top = image.top + window.scrollY + 'px';
    newDiv.style.left = image.left + window.scrollX-220 + 'px';
    document.body.appendChild(newDiv);

    document.querySelector("#treasurySearch").addEventListener("keyup", function(event) {

        if (event.keyCode === 13) {
            const treasuryLookupItem = document.querySelector("#treasurySearch").value.replace(/ /g,'+')
            window.location.href = `treasury?search_for=${treasuryLookupItem}`
        };
    });

    document.querySelector("#rgaSearch").addEventListener("keyup", async function(event) {

        if (event.keyCode === 13) {

            document.body.style.pointerEvents = 'none';
            document.querySelector("#container").setAttribute('style','opacity:0.25; transition: opacity 0.5s ease;');
            document.querySelector("body > center > div.sub-header-container").setAttribute('style','opacity:0.25; transition: opacity 0.5s ease;');

            const startingCharId = document.body.innerHTML.match(/<option value="([0-9]+)" selected/i)[1]

            GM_addStyle (`#searchDiv {animation: growSearch 0.5s ease forwards;position:fixed;}`)
            GM_addStyle (`@keyframes growSearch {0% {width:270px;height:275px;position:fixed;top:45px;} 100% {width:270px;height:500px;position:fixed;top:45px;}}`)

            const itemName = document.querySelector("#rgaSearch").value.toLowerCase()
            document.querySelector("#rgaSearchDiv").innerHTML = `
            <div id="rgaSearchResults" style="max-height:280px;overflow:auto;">
            <img src="https://studiomoxxi.com/moxximod/loading-gif.gif" style="height:75px;width:75px;padding:10px">
            </div>
            `;

            const charDropdown = document.body.innerHTML.replace(/[\n\r]/g,'').match(/<optgroup label="My Characters">.*?<option value="0">--Change Server--<\/option>/i)
            const charIdArray = charDropdown.toString().match(/value="[0-9]+"/g).map(match => match.match(/[0-9]+/)[0]).slice(0, -1);
            let rows = []
            const lookForItem = async (id) => {
                let found = 0;

                const matchBp = new RegExp(`data-itemidqty="[0-9]+" data-name="${itemName}"`, 'i');
                const types = ['regular', 'quest', 'orb', 'potion', 'key', 'utility'];
                for (const type of types) {
                    const bp = await superfetch(`ajax/backpackcontents.php?tab=${type}&suid=${id}`);
                    const item = await backpack(bp, itemName);
                    found += parseInt(item.quantity);
                };

                const matchEq = new RegExp(`alt="${itemName}"`, 'i');
                const lookEq = await superfetch(`equipment?suid=${id}`);
                found += lookEq.match(matchEq) ? 1 : 0

                if (found > 0){
                    const profile = await superfetch(`profile?suid=${id}`);
                    const name = `<a href='home.php?suid=${id}'>${profile.match(/<font size="3">(.*?)<\/font>/i)[1]}</a>`;
                    rows.push(`<tr><td>${name}</td><td>${found}</td></tr>`);
                };
            };
            await Promise.all(charIdArray.map(lookForItem));

            await superfetch(`ajax_changeroomb.php?suid=${startingCharId}`);

            document.querySelector("#rgaSearchResults").innerHTML = `
            <table class="table table-striped sortable" style="text-align:left;border-radius:10px;box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);">
            <thead><tr><th>Char</th><th>Qnt</th></tr></thead>
            <tbody>
            ${rows.join('')}
            </tbody>
            </table>
            `

            await sortableTables();

            document.body.style.pointerEvents = 'auto';
            document.querySelector("#container").setAttribute('style','opacity:1; transition: opacity 0.5s ease;');
            document.querySelector("body > center > div.sub-header-container").setAttribute('style','opacity:1; transition: opacity 0.5s ease;');
        };
    });

    document.querySelector("#playerTrade").addEventListener("keyup", async function(event) {

        if (event.keyCode === 13) {
            const lookupPlayer = document.querySelector("#playerTrade").value
            const profileData = await superfetchProfile(`profile?transnick=${lookupPlayer}`);
            const charId = profileData.charid;
            if (charId > 0){
                window.location.href = `trade?tradeWith=${charId}`;
            } else {
                alert(`ERROR: Could not find ${lookupPlayer} to trade with`);
            };
        };
    });
};


async function searchMenuClose(){
    const menu = document.querySelector("#btnSearch");
    menu.classList.add("menu-close");
    menu.classList.remove("menu-open");
    document.querySelector("#btnSearch > img").classList.remove('rotate180');
    GM_addStyle (`#searchDiv {animation: rewindSearch 0.5s ease forwards;}`)
    GM_addStyle (`@keyframes rewindSearch {0% {width:270px;height:275px;position:fixed;top:45px;} 100% {width:270px;height:0px;position:fixed;top:-1000px;}}`)

    if (document.querySelector("#rgaSearchDiv")){
        document.querySelector("#rgaSearchDiv").innerHTML = '';
    }
}


async function travelMenuClose(){
    const menu = document.querySelector("#btnTravel");
    menu.classList.add("menu-close");
    menu.classList.remove("menu-open");
    document.querySelector("#btnTravel > img").classList.remove('rotate180');
    GM_addStyle (`#travelDiv {animation: rewindTravel 0.5s ease forwards;}`)
    GM_addStyle (`@keyframes rewindTravel {0% {width:370px;height:535px;position:fixed;top:45px;} 100% {width:370px;height:0px;position:fixed;top:-1000px;}}`)
}


async function appsMenuClose(){
    const menu = document.querySelector("#btnApps");
    menu.classList.add("menu-close");
    menu.classList.remove("menu-open");
    document.querySelector("#btnApps > img").classList.remove('rotate180');
    GM_addStyle (`#appsDiv {animation: rewindApps 0.5s ease forwards;}`)
    GM_addStyle (`@keyframes rewindApps {0% {width:535px;height:535px;position:fixed;top:45px;} 100% {width:535px;height:0px;position:fixed;top:-1000px;}}`)

}


async function casterMenuClose(){
    const menu = document.querySelector("#btnCaster");
    menu.classList.add("menu-close");
    menu.classList.remove("menu-open");
    document.querySelector("#btnCaster > img").classList.remove('rotate180');
    GM_addStyle (`#casterDiv {animation: rewindCaster 0.5s ease forwards;}`)
    GM_addStyle (`@keyframes rewindCaster {0% {width:700px;height:535px;position:fixed;top:45px;} 100% {width:700px;height:0px;position:fixed;top:-1000px;}}`)
};


async function bossSpawns(){

    const size = 280
    GM_addStyle (`
    #bossSpawnDiv{width:1030px;text-align:left;}
    div.bossSpawnTile{display:inline-block;height:${size}px;overflow:hidden;box-shadow: 0 0 10px rgba(0, 0, 0, 1);margin:4px;text-align:center;border-radius:4px;}
    div.bossSpawnTile > img{width:${size}px;height:${size}px;}
    div.bossSpawnText{width:${size-30}px;position:relative;left:15px;top:-200px;background:#000000;padding:15px;border-radius:15px;font-size:14px;opacity:0.9;box-shadow: 0 0 3px rgba(0, 0, 0, 1);}
    `);

    var bosses = document.querySelectorAll(".col-12.col-xl-6");
    const bossesArray = [];
    bosses.forEach(function(div) {
        const i = div.innerHTML
        const img = i.match(/img src="([^"]*)"/i)[1]
        const name = i.match(/<b>(.*?)<\/b>/i)[1].replace(/(,.*| .*)/g, '')
        const spawnid = i.match(/boss_stats\.php\?spawnid=([0-9]+)/i)[1]
        const form = i.match(/formraid\.php\?target=[0-9]+/i) ? `<a href="${i.match(/formraid\.php\?target=[0-9]+/i)}">Form Raid</a>` : ''
        const health = i.match(/<p class="card-user_occupation">.*?[0-9]+%/i) ? `<p><h5>${i.match(/<p class="card-user_occupation">.*?([0-9]+)%/i)[1]}%</h5>` : ''
        bossesArray.push(`
            <div class="bossSpawnTile">
            <img src="${img}"><br>
            <div class="bossSpawnText">
            <h5><b>${name.toUpperCase()}</b></h5>
            <a href="boss_stats.php?spawnid=${spawnid}">Crew Table</a>
            ${health}
            ${form}
            </div>
            </div>
            `);
    });
    document.querySelector("#content").innerHTML = `
    ${bossesArray.join('')}
    `;
};

async function bossStats(){

    GM_addStyle(`
    img.bossCrewPic{width:30px;height:30px;}
    div.bossStatsContainer{position:relative;width: 50%;flex-grow: 8;margin-top: 130px;margin-bottom: 0;margin-left: 212px;max-width: 1300px;}
    @keyframes fadeIn {from {opacity: 0;} to {opacity: 1;}}
    #content{display:none !important;}
    #bossTableDiv{animation: bossTable 2s ease forwards;}
    @keyframes bossTable {0% {opacity:0;} 100% {opacity:1}}");
    `)

    const boss = document.body.innerHTML.match(/<h1 class="w-100">(.*?)<\/h1>/i)[1];
    const specs = await info(boss);

    const newDiv = document.createElement("div");
    newDiv.classList.add('bossStatsContainer')
    newDiv.innerHTML = `
    <div class="widget mb-3">
    <h1>${boss}
    <a onmouseover="popup(event,'${specs[2]}')" onmouseout="kill()"><img src="https://studiomoxxi.com/moxximod/loot.png" height="20px" style="margin-bottom:10px"></a>
    </h1>
    <span id="hpremaining"></span>
    </div>
    <img src="https://studiomoxxi.com/moxximod/loading-gif.gif" width="80px" height="80px" id="loading">
    <div id="bossTableContainer">
    </div>
    `
    document.querySelector("#container").appendChild(newDiv);

    const rows = document.querySelectorAll("#content-header-row > div > table > tbody > tr");
    let totItems = 0;
    let obj = []
    rows.forEach(function(i) {
        const crew = (i.innerHTML.match(/<font color="#CC0000".*?>(.*?)<\/font>/i) || ['error','error'])[1];
        const id = i.innerHTML.match(/crew_profile\.php\?id=([0-9]+)/i)[1];
        const dmg = i.innerHTML.replace(/,|\(.*?\)| /g, '').match(/<td>([0-9]+)<\/td>/i)[1];
        const items = i.innerHTML.replace(/'/g,'').match(/<td onmouseover="popup\(event,([^']*),808080\)" onmouseout="kill\(\)">([0-9]+)<\/td>/i);

        obj.push({crew: crew, id: id, dmg: dmg, loot: items[1], count: items[2]})

        totItems += parseInt(items[2]);
    });
    if (totItems > 0){
        await bossStatus_dead(obj);
    } else {
        await bossStatus_alive(boss,obj,specs);
    };
};

async function bossStatus_alive(boss,obj,specs){
    GM_addStyle(`
    #almostDeadTimer {color: #ff0000;font-size:20px;}
    `)
    const data = [];

    const total = obj.reduce((acc, obj) => acc + parseInt(obj.dmg), 0);
    const hp = specs[0];
    const totloot = specs[1];
    document.querySelector("#hpremaining").innerHTML = `<h5>Health Remaining: ${(hp-total).toLocaleString()} (${((hp-total)/hp*100).toFixed(3)}%)</h5>`
    let active = 0;
    let dmgpmin = 0;
    const getData = async (c) => {

        const crew = c.crew;

        const id = c.id;

        const dmg = parseInt(c.dmg);

        const perc = (dmg/total*100).toFixed(3);

        const fetch = await superfetch(`crew_raidresults.php?crewid=${id}`);
        const regex = new RegExp(`<td align="left" valign="top">${boss}<\/td>`)
        const last = fetch.match(/<tr>[\s\S]*?<\/tr>/g).filter(tr => tr.match(regex));

        const raidtime = last.length > 0 ? last[0].match(/[0-9]+-[0-9]+-[0-9]+ [0-9]+:[0-9]+[A-Za-z]m/i)[0].replaceAll("-","/").replace("am",":00 AM").replace("pm",":00 PM").replace(/ 0/i," ") : '01/01/01 01:01:01 AM';
        var d = new Date();
        var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        var owtime = new Date(utc + (3600000 * parseFloat('-5.0')));
        const sinceLast = (owtime - new Date(raidtime))/3600000

        const raidid = last.length > 0 ? last[0].match(/raidid=([0-9]+)/i)[1] : '0';
        const raidattack = await superfetch(`raidattack.php?raidid=${raidid}`);
        const parse = new DOMParser().parseFromString(raidattack, 'text/html');

        const raiddmg = raidattack.replace(/,/g,'').match(/<i>Total Attacker Damage: [0-9]+<\/i>/i) ? parseInt(raidattack.replace(/,/g,'').match(/<i>Total Attacker Damage: ([0-9]+)<\/i>/i)[1]).toLocaleString() : '--';
        let status;
        if (sinceLast <= 0.033){
            status = '<b><font color="#00ff00">ACTIVE</font></b>';
            dmgpmin += parseInt(raiddmg.replace(/,/g,''));
            active += 1;
        } else if (sinceLast < 1){
            status = '<b><font color="#00ff00">ACTIVE</font></b>';
            active += 1;
        } else {
            status = `<a style="opacity:0.5">INACTIVE</a>`;
        };

        const char = (parse.querySelector("#message_0 > div > div > span > b") || {textContent: "na"}).textContent.replace(/ .*/i,"")
        const profileData = await superfetchProfile(`profile?transnick=${char}`);
        const markdown = profileData.skills.list.includes('Markdown') ? profileData.skills.images.toString().match(/<b>Level [0-9]+ Markdown<\/b><br \/>You become more focused and alert for battle\. Decreases cost by [0-9]+% to form\/join raids\.<br \/>(.*?) left<br>/i)[1] : "--"

        const crewPro = await superfetch(`crew_profile?id=${id}`);
        const pic = crewPro.match(/https:\/\/upload\.outwar\.com\/crewuploaded\/[A-Za-z][0-9]+\.[A-Za-z]+/i) || "images/logodefault.gif";

        data.push({
            pic: `<img src="${pic}" class="bossCrewPic">`,
            name: `<a href="crew_profile?id=${id}">${crew}</a>`,
            dmg: dmg,
            perc: `${perc}%`,
            items: (parseInt(dmg)/hp*totloot).toFixed(1),
            projected: (perc/100*totloot).toFixed(1),
            status: status,
            raid: raiddmg,
            md: markdown
        });
    };
    await Promise.all(obj.map(getData));

    data.sort((a, b) => b.dmg - a.dmg);

    const rows = data.map(({ pic, name, dmg, perc, items, projected, status, raid, md }) => `
    <tr>
    <td>${pic}</td>
    <td>${name}</td>
    <td>${dmg.toLocaleString()}</td>
    <td>${perc}</td>
    <td>${items}</td>
    <td>${projected}</td>
    <td>${status}</td>
    <td>${raid}</td>
    <td>${md}</td>
    </tr>
    `);

    document.querySelector("#loading").remove();

    document.querySelector("#bossTableContainer").innerHTML = `
    <div id="bossTableDiv" class="widget">
    <div class="list-group-item">
    <div id="almostDeadTimer"></div><i>There are ${active} crews actively raiding doing ${dmgpmin.toLocaleString()} damage per minute</i>
    </div>
    <table class="table table-striped">
    <thead><tr><th></th><th>Crew</th><th>Damage</th><th>Percent</th><th>Items</th><th>Projected</th><th>Status</th><th>Last Raid</th><th>Markdown</th></tr></thead>
    <tbody>
    ${rows.join('')}
    </tbody>
    </table>
    </div>
    `

    const timeUntilDeath = (hp-total)/dmgpmin;
    if (timeUntilDeath < 200){
        document.querySelector("#almostDeadTimer").innerHTML = `${boss} will die in about ${Math.ceil(timeUntilDeath)} minutes`
    }
};

async function bossStatus_dead(obj){
    const highlight = {
        value: ['Blazing Serpent','Ghostly Stalker','Exalted Perfection','Transcended Extract','Demonic Teleporter','Augment of Madness','8-Bit Banana','Key to the Alsayic Ruins (Solo)'],
        rare: ['Catalyst','Tier 2 Booster Upgrade','Blossom','Augment of Simulation'],
        epic: ['Descendant','Ancestral','Boon of Vision']
    };
    const data = [];

    const getData = async (c) => {

        const crew = c.crew;

        const id = c.id;

        const dmg = parseInt(c.dmg);

        const count = c.count;

        const loot = c.loot.split('<br>');

        const lootStyled = loot.map(value =>
            highlight.value.some(item => value.includes(item))
            ? `<font color="#FFDE5B">${value}</font>`
            : highlight.rare.some(item => value.includes(item))
            ? `<font color="#FF8000">${value}</font>`
            : highlight.epic.some(item => value.includes(item))
            ? `<font color="#FF00FF">${value}</font>`
            : value
        );

        const crewPro = await superfetch(`crew_profile?id=${id}`);
        const pic = crewPro.match(/https:\/\/upload\.outwar\.com\/crewuploaded\/[A-Za-z][0-9]+\.[A-Za-z]+/i) || "images/logodefault.gif";
        data.push({id:id,crew:crew,pic:pic,id:id,dmg:dmg,count:count,loot:lootStyled.slice(0, -1).join(', ')});
    };
    await Promise.all(obj.map(getData));

    data.sort((a, b) => b.dmg - a.dmg);

    const rows = data.map(({ id, crew, pic, dmg, count, loot}) => `
    <tr>
    <td><img src="${pic}" class="bossCrewPic"></td>
    <td><a href="crew_profile?id=${id}">${crew}</a></td>
    <td>${dmg.toLocaleString()}</td>
    <td>${count}</td>
    <td>${loot}</td>
    </tr>
    `);

    document.querySelector("#loading").remove();

    document.querySelector("#bossTableContainer").innerHTML = `
    <div id="bossTableDiv" class="widget">
    <table class="table table-striped">
    <thead><tr><th></th><th>Crew</th><th>Damage</th><th>Items</th><th>Loot</th></tr></thead>
    <tbody>
    ${rows.join('')}
    </tbody>
    </table>
    </div>
    `
};


async function itemTransfer(){

    GM_addStyle(`
    #items > img, #itemsSelectedDiv > img {position:revert;height:40px;width:40px;margin:5px;border-radius:5px;transform:translate(0%,0%);background-color:#000000;}
    .item-desel {border:2px #475254 SOLID !important;}
    .item-sel {border:3px #00CC00 SOLID !important;padding:2px;animation: item-selected 1s infinite;}
    #itemsSelectedDiv > img{cursor: pointer;}
    @keyframes item-selected{0% {filter: saturate(100%);} 50% {filter: saturate(250%); } 100% {filter: saturate(100%);}}
    `)

    const charDropdown = document.querySelector("#divHeader > select")
    charDropdown.classList.add('form-control-new')
    charDropdown.setAttribute('style','font-size:15px;padding:0.75rem;border-radius:6px;margin-bottom:0.5rem;width:100%;');

    let allItems = (document.querySelector("#divItemtransfer").innerHTML.match(/<img alt="[^"]*" style="[^"]*" src="[^"]*" onmouseover="itempopup\(event,[0-9]+, [0-9]+, '', [0-9]+\)" onmouseout="kill\(\)">/g) ?? []).map(i => (i.replace('src','class="item item-desel" src'))).join('');

    document.querySelector("#content").innerHTML = `
        <div class="row justify-content-center" id="content-header-row">
        <div class="bio col-lg-8 col-md-8 col-sm-12 col-12 layout-spacing layout-spacing" id="availableItemsToTransfer">
        <div style="display:inline-block;text-align:left; width: 100%;" id="items">
        <h4>Item Transfer</h4><hr style="margin-top:10px;margin-bottom:10px;">
        ${allItems}
        </div></div>
        <div class="col-lg-4 col-md-4 col-sm-12 col-12 layout-spacing layout-spacing" style="text-align:left">
        <div class="widget text-left mb-3" id="itemsSelectedOuterDiv">
        <h6>Items Selected: <span id="selectedCount">0</span></h6>
        <div id="itemsSelectedDiv"></div>
        </div>
        <div class="widget text-left mb-3">
        <span id="sendItemsText"><h4>Send Items</h4></span>
        ${charDropdown.outerHTML}<br>
        <button id="sendItems" class="btn-mm">SEND ITEMS</button><button id="sendAndGo" class="btn-mm">SEND AND GO</button>
        <hr>
        <a href="javascript:void(0);" id="setDefaultChar">Set default transfer character</a><p><span id="togglePb"></span><p>
        <i><b>SEND AND GO</b> will transfer the selected items and then change characters to the character receiving the items</i>
        </div></div></div>
    `

    if (window.location.href.match('Playerbound=1')){
        document.querySelector("#togglePb").innerHTML = `<a href="itemtransfer.php?includePlayerbound=0">Hide playerbound items</a>`
    } else {
        document.querySelector("#togglePb").innerHTML = `<a href="itemtransfer.php?includePlayerbound=1">Show playerbound items</a>`
    };

    if (GM_getValue("transferDefault")){
        const charId = GM_getValue("transferDefault")
        document.querySelector('select[name="self"]').value = charId;
    };

    const items = document.querySelectorAll(".item")
    const itemHandling = async (item) => {

        item.addEventListener('click', async function(){
            item.classList.toggle('item-sel')
            item.classList.toggle('item-desel')
            await updateItemsSelected();
        });

        item.addEventListener('dblclick', async function(){
            const itemName = item.outerHTML.match(/alt="([^"]*)"/i)[1]
            const all = document.querySelectorAll(`img[alt="${itemName}"]`);
            const selectAll = async (item) => {
                item.classList.toggle('item-sel')
                item.classList.toggle('item-desel')
            }
            await Promise.all(Array.from(all).map(selectAll));
            await updateItemsSelected();
        });
    };
    await Promise.all(Array.from(items).map(itemHandling));

    async function updateItemsSelected(){
        document.querySelector("#itemsSelectedDiv").innerHTML = ''
        const selectedItems = document.querySelectorAll(".item-sel");
        const selectedArray = []
        for (let i = 0; i < selectedItems.length; i++) {
            selectedArray.push(selectedItems[i].outerHTML.replace('item-sel','item-desel'))
        };
        document.querySelector("#itemsSelectedDiv").innerHTML = selectedArray.join('');
        document.querySelector("#selectedCount").innerHTML = selectedArray.length;
    };

    document.querySelector("#sendItems").addEventListener('click', async function(){
        await loadingOverlay()
        const itemIds = document.querySelector("#itemsSelectedDiv").innerHTML.match(/event,[0-9]+/g).map(i => `&checkbox%5B%5D=${i.match(/[0-9]+/)[0]}`).join('');
        const charId = document.querySelector('select[name="self"]').value;
        await superpost('itemtransfer',`self=${charId}&submit=Send+items%21${itemIds}`);

        document.querySelector("#itemsSelectedDiv").innerHTML = '';
        const selectedItems = document.querySelectorAll(".item-sel");
        document.querySelector("#selectedCount").innerHTML = '0'
        for (let i = 0; i < selectedItems.length; i++) {
            selectedItems[i].remove();
        };
        await loadingOff();
    });

        document.querySelector("#sendAndGo").addEventListener('click', async function(){
            await loadingOverlay()
            const itemIds = document.querySelector("#itemsSelectedDiv").innerHTML.match(/event,[0-9]+/g).map(i => `&checkbox%5B%5D=${i.match(/[0-9]+/)[0]}`).join('');
            const charId = document.querySelector('select[name="self"]').value;
            await superpost('itemtransfer',`self=${charId}&submit=Send+items%21${itemIds}`);

            document.querySelector("#itemsSelectedDiv").innerHTML = '';
            const selectedItems = document.querySelectorAll(".item-sel");
            document.querySelector("#selectedCount").innerHTML = '0'
            for (let i = 0; i < selectedItems.length; i++) {
                selectedItems[i].remove();
            };
            window.location.href = `world?suid=${charId}`
        });

    document.querySelector("#setDefaultChar").addEventListener('click', function(){
        const charId = document.querySelector('select[name="self"]').value;
        GM_setValue("transferDefault",charId);
    });

    if (window.location.href.match('type=selectbadge')){
        await selectBadge();
    };
};


async function selectBadge(){
    GM_addStyle(`#itemsSelectedOuterDiv{display:none;}`)
    document.querySelector(`img[src*="images/items/badge26a.gif"]`).click();
    document.querySelector("#sendItemsText").innerHTML = `<h5>Transfer Badge of Absolution</h5><br>`
    document.querySelector("#setDefaultChar").remove();
    document.querySelector("#availableItemsToTransfer").remove();
    document.querySelector("#togglePb").innerHTML = `<i>Completing badge transfer will load the selected account in your browser</i>`;
    document.querySelector("#sendItems").addEventListener('click', async function(){
        const selectedCharId = document.querySelector("#content-header-row > div > div:nth-child(2) > select").value
        //await superpost(`ajax/backpack_action.php?suid=${selectedCharId}`,`action=equip&itemids%5B%5D=505739120`)
        window.location.href = `world?suid=${selectedCharId}`
    });
};

async function crewVaultNew(charId){
    const manager = document.body.innerHTML.match(/<h5>Award Item<\/h5>/i) ? true : false;
    if (manager){
        crewVaultManager(charId);
    } else {
        crewVaultViewer();
    };
};

async function crewVaultManager(charId){

    const cvCapacity = document.body.innerHTML.match(/<b>[0-9]+ \/ [0-9]+<\/b>/i);
    const cvItems = document.querySelectorAll('img.crew_itembox_item:not(.treasuryimg)');
    const cvAwardTo = document.querySelector('select[name="awardto"]').innerHTML;
    const crewName = document.querySelector('h4').innerText;
    const crewPoints = document.querySelector('h4 img').outerHTML.match(/event,'([^']*)'/i)[1];

    GM_addStyle(`
        .widget{  flex: 1; min-width: 0; padding: 10px; }
        .cv-search-container { display: flex; flex-wrap: wrap; gap: 0.5rem; font-family: monospace; }
        .cv-item-img { height:35px; width:35px; border: 2px #475254 SOLID; border-radius: 15px; margin:2px; cursor:pointer; }
        #cvItemContainer > div > .cv-item-img-selected { height:35px; width:35px; border: 3px #00CC00 SOLID; border-radius: 15px; margin:2px; cursor:pointer; padding:3px; }
        .cv-item-container { display:inline-block; }
        .db { width:100%; word-wrap: break-word; }
        body { overflow-y: scroll; overflow-x: auto; }
    `)


    const content = document.querySelector("#content");
    content.innerHTML = '<img src="https://studiomoxxi.com/moxximod/loading-gif.gif" height="50px" width="50px">'


    const itemTypesArray = [];
    const raidboundArray = [];
    const ammyChestObj = {};


    async function parseCrewVaultItems(cvItems){
        const itemImgArray = [];
        const iterateEach = async (i) => {
            const item = i.outerHTML;
            const itemName = item.match(/alt="([^"]*)"/i)[1];
            const itemImg = item.match(/src="([^"]*)"/i)[1];
            const itemId = item.match(/event,'([0-9]+)'/i)[1];
            const itemData = await superfetchItem(itemId);

            const itemTypeOption = `<option value="${itemData.slot}">${itemData.slot}</option>`
            if (!itemTypesArray.includes(itemTypeOption)){
                itemTypesArray.push(itemTypeOption)
            };

            if (itemName.match('Amulet Chest') && itemData.raidboundArray.length > 0){
                await parseAmmyChest(itemData);
            };

            if (itemData.raidbound){
                await parseRaidboundItem(itemData);
            };

            const img = document.createElement('img');
            img.dataset.name = itemName;
            img.src = itemImg;
            img.classList.add('cv-item-img')
            img.setAttribute('onmouseover', `itempopup(event,'${itemId}')`);
            img.setAttribute('onmouseout', 'kill()');
            img.dataset.type = itemData.slot;
            img.dataset.id = itemId;
            img.dataset.playerbound = itemData.playerbound;
            img.dataset.raidbound = itemData.raidboundArray;
            itemImgArray.push('<div class="cv-item-container">' + img.outerHTML + '</div>');
        };
        await Promise.all(Array.from(cvItems).map(iterateEach));
        return itemImgArray;
    };


    const itemImgArray = await parseCrewVaultItems(cvItems);


    async function parseRaidboundItem(itemData){
        const raidboundCharArray = itemData.raidboundArray
        for (let char of raidboundCharArray){
            const selectOption = `<option value="${char}">${char}</option>`
            if (!raidboundArray.includes(selectOption)){
                raidboundArray.push(selectOption);
            };
        };
    };


    async function parseAmmyChest(itemData){
        const quantity = parseInt(itemData.name.match(/[0-9]+/i));
        for (let char of itemData.raidboundArray){
            if (!ammyChestObj[char]){
                ammyChestObj[char] = 0;
            };
            ammyChestObj[char] += quantity;
        };
    };

    const sortAmmyData = Object.entries(ammyChestObj).sort(([, a], [, b]) => b - a);
    const ammyChestArray = [];
    for (let option of sortAmmyData){
        const charName = option[0];
        const totalQuantity = option[1];
        ammyChestArray.push(`<option value="${charName}">${charName} [${totalQuantity}]</option>`);
    };

    const crewMenu = `<a href="crew_pointbank">BANK</a> | <a href="crew_treasury">TREASURY</a> | <a href="crew_stones">UPGRADES</a> | <a href="crew_actionlog">LOGS</a>`

    const sortByMenu = `<select id="optionSort" class="form-control"><option value="name">Name</option><option value="new">Newest</option></select>`

    const selectMenu = `<select id="optionSelect" class="form-control"><option value="none" selected diabled></option><option value="selectall">Select all visible</option><option value="selectnone">Deselect all</option></select>`

    const presetMenu = `
        <select class="form-control" id="optionPreset">
        <option value="none">None</option>
        <option value="ammychests">Amulet Chests</option>
        <option value="artifacts">Artifacts</option>
        <option value="blackhand">Blackhand Set</option>
        <option value="blazing">Blazing Set</option>
        <option value="talismen">Boss Talismen</option>
        <option value="catalyst">Catalysts/Blossoms</option>
        <option value="chancellor">Chancellor Set</option>
        <option value="deathwalker">Deathwalker</option>
        <option value="dragon">Dragon Set</option>
        <option value="ethereal">Ethereal Items</option>
        <option value="exalted">Exalted Set</option>
        <option value="ghostly">Ghostly Set</option>
        <option value="stamps">Guardian Stamps</option>
        <option value="lifeforces">Life Forces</option>
        <option value="lostartifacts">Lost Artifacts</option>
        <option value="noble">Noble Set</option>
        <option value="perfection">Perfectionist Set</option>
        <option value="soulgems">Soul Gems</option>
        <option value="spiral">Spiral Set</option>
        <option value="trinkets">Trinkets</option>
        <option value="voidmaker">Voidmaker</option>
        <option value="wilker">Wilker Items</option>
        <option value="wonderland">Wonderland Equipment</option>
        </select>
    `

    const cvHtml = `
        <div class="row justify-content-center">
            <div class="w-3 col-lg-9 col-md-9 col-sm-12 col-12 layout-spacing px-1">
                <div class="cv-search-container">
                    <div class="widget mb-2 cv-search">
                    TYPE<br>
                    <select class="form-control" id="optionType">
                    <option value="none">None</option>
                    ${itemTypesArray.join('')}
                    </select>
                    </div>
                    <div class="widget mb-2 cv-search">
                    RAIDBOUND<br>
                    <select class="form-control" id="optionRaidbound">
                    <option value="none">None</option>
                    ${raidboundArray.sort().join('')}
                    </select>
                    </div>
                    <div class="widget mb-2 cv-search">
                    ITEM NAME<br>
                    <input id="optionName" type="text" class="form-control mb-2" autocomplete="off">
                    </div>
                    <div class="widget mb-2 cv-search">
                    ITEM ID<br>
                    <input id="optionId" type="text" class="form-control mb-2" autocomplete="off">
                    </div>
                </div>
                <div class="cv-search-container">
                    <div class="widget mb-2 cv-search">
                    PRESETS<br>
                    ${presetMenu}
                    </div>
                    <div class="widget mb-2 cv-search">
                    SORT BY<br>
                    ${sortByMenu}
                    </div>
                    <div class="widget mb-2 cv-search">
                    AMULET CHESTS
                    <select class="form-control" id="optionChests">
                    <option value="none">None</option>
                    ${ammyChestArray.join('')}
                    </select>
                    </div>
                    <div class="widget mb-2 cv-search">
                    SELECT<br>
                    ${selectMenu}
                    </div>
                </div>
                <div class="widget mb-2" id="cvItemContainer">
                    ${itemImgArray.sort().join('')}
                </div>
            </div>
            <div class="w-3 col-lg-3 col-md-3 col-sm-12 col-12 layout-spacing px-1">
                <div class="widget mb-2 cv-search">
                <h5>${crewName}</h5>
                Storing ${cvCapacity} items<br>
                ${crewPoints}<br>
                ${crewMenu}
                </div>
                <div class="widget mb-2 cv-search">
                SELECT NAME
                <input id="selectName" type="text" class="form-control mb-2" autocomplete="off">
                AWARD BY SELECT
                <select class="form-control" id="awardTo">
                <option value="na" disabled selected></option>
                ${cvAwardTo}
                </select><p style="margin-top:1rem;">
                <button id="award" class="btn-mm">AWARD</button> <button id="delete" class="btn-mm">DELETE</button>
                </div>
                    <div class="mb-2 cv-search db" id="db">
                    </div>
                <div class="widget mb-2 cv-search" style="min-height:300px">
                <h5>Selected Items (<span id="selectedQnt">0</span>)</h5>
                    <div id="selectedItemsDiv" style="height:100%;margin-top:0.5rem;">
                    </div>
                </div>
            </div>
        </div>
    `


    content.innerHTML = cvHtml;


    document.querySelector("#awardTo").value = charId;


    document.addEventListener('click', async (e) => {
        const img = e.target.closest('img.cv-item-img');
        if (!img) return;
        const id = img.dataset.id;
        const sourceImg = document.querySelector(`#cvItemContainer img[data-id="${id}"]`);
        if (sourceImg) {
            sourceImg.classList.toggle('cv-item-img-selected');
            await updateSelectedItemsDiv();
        };
    });


    document.querySelector('#cvItemContainer').addEventListener('dblclick', async (e) => {
        const img = e.target.closest('img.cv-item-img');
        if (!img) return;
        const name = img.dataset.name;
        if (!name) return;
        const matchingImages = document.querySelectorAll(`img.cv-item-img[data-name="${name}"]`);
        matchingImages.forEach(el => {
            if (!el.hidden){
                el.classList.toggle('cv-item-img-selected');
            };
        });
        await updateSelectedItemsDiv();
    });


    async function updateSelectedItemsDiv() {
        const selected = document.querySelectorAll('#cvItemContainer img.cv-item-img-selected');
        document.querySelector("#selectedQnt").innerHTML = selected.length;
        const selectedDiv = document.querySelector('#selectedItemsDiv');
        selectedDiv.innerHTML = '';
        selected.forEach(img => {
            const clone = img.cloneNode(true);
            clone.hidden = false;
            selectedDiv.appendChild(clone);
        });
        await checkSelectedItems();
    };


    document.querySelector("#selectName").addEventListener('input', () => {
        const input = document.querySelector("#selectName").value;
        const options = document.querySelectorAll('#awardTo option');
        const match = Array.from(options).find(opt => !opt.disabled && opt.textContent.trim().toLowerCase() === input.trim().toLowerCase());
        if (match) {
            document.querySelector("#awardTo").value = match.value;
        };
    });


    document.querySelector("#selectName").addEventListener('keydown', async (event) => {
        if (event.key === 'Enter') {
            await awardItems();
        };
    });


    document.querySelector("#award").addEventListener('click', async () => {
        await awardItems();
    });


    async function awardItems(){
        const awardToId = document.querySelector("#awardTo").value;
        if (awardToId == "na"){
            await dbMsg('Please select a character to award to');
            return;
        };

        const selectedItems = document.querySelectorAll("#selectedItemsDiv img.cv-item-img");
        if (selectedItems.length == 0){
            await dbMsg('Please select at least 1 item');
            return;
        };

        await loadingOverlay();
        const selectedItemsArray = [];
        const itemPrefix = 'v_selected%5B%5D=';
        for (let item of selectedItems){
            const id = item.dataset.id;
            selectedItemsArray.push(itemPrefix + id);
        };

        const order = 1
        const v_selected = selectedItemsArray.join('&');
        const form_nonce = await getNonce();
        const awardto = awardToId;
        const award = 'Award+Items'
        const rbsel = awardToId;
        const body = `order=${order}&${v_selected}&form-nonce=${form_nonce}&awardto=${awardto}&award=${award}&rbsel=${rbsel}`;
        const url = 'crew_vault';
        const postAward = await superpost(url,body);
        const str = postAward.match(/<strong>Status:<\/strong>.*/i)[0];
        await dbMsg(str);
        const parseData = new DOMParser();
        const responseDoc = parseData.parseFromString(postAward, 'text/html');
        const cvItems = responseDoc.querySelectorAll('img.crew_itembox_item:not(.treasuryimg)');
        const itemImgArray = await parseCrewVaultItems(cvItems)
        document.querySelector("#selectedItemsDiv").innerHTML = '';
        document.querySelector("#selectedQnt").innerHTML = 0;
        document.querySelector("#cvItemContainer").innerHTML = itemImgArray.sort().join('');

        runFilters()

        await sortCv();

        await loadingOff();
    };


    document.querySelector("#delete").addEventListener('click', async () => {

        const selectedItems = document.querySelectorAll("#selectedItemsDiv img.cv-item-img");
        if (selectedItems.length == 0){
            await dbMsg('Please select at least 1 item');
            return;
        } else {
            const confirm = window.confirm(`Are you sure you want to delete ${selectedItems.length} items?`);
            if (!confirm){
                return;
            };
        };

        await loadingOverlay();
        const selectedItemsArray = [];
        const itemPrefix = 'v_selected%5B%5D=';
        for (let item of selectedItems){
            const id = item.dataset.id;
            selectedItemsArray.push(itemPrefix + id);
        };

        const order = 1
        const v_selected = selectedItemsArray.join('&');
        const form_nonce = await getNonce();
        const awardto = "0";
        const award = 'Delete+Items'
        const confirm_delete = "on"
        const rbsel = "0";
        const body = `order=${order}&${v_selected}&form-nonce=${form_nonce}&awardto=${awardto}&delete=${award}&rbsel=${rbsel}&confirm_delete=${confirm_delete}`;
        const url = 'crew_vault';
        const postDelete = await superpost(url,body);
        const str = postDelete.match(/<strong>Status:<\/strong>.*/i)[0];
        await dbMsg(str);
        const parseData = new DOMParser();
        const responseDoc = parseData.parseFromString(postDelete, 'text/html');
        const cvItems = responseDoc.querySelectorAll('img.crew_itembox_item:not(.treasuryimg)');
        const itemImgArray = await parseCrewVaultItems(cvItems)
        document.querySelector("#selectedItemsDiv").innerHTML = '';
        document.querySelector("#selectedQnt").innerHTML = 0;
        document.querySelector("#cvItemContainer").innerHTML = itemImgArray.sort().join('');

        runFilters();

        await sortCv();

        await loadingOff();
    });


    document.querySelector("#optionSort").addEventListener('change', () => {
        sortCv();
    });
    async function sortCv(){
        const sortBy = document.querySelector("#optionSort").value;
        if (sortBy == "name"){
            const container = document.querySelector('#cvItemContainer');
            const items = Array.from(container.querySelectorAll('.cv-item-container'));
            items.sort((a, b) => {
            const nameA = a.querySelector('img').dataset.name.toLowerCase();
            const nameB = b.querySelector('img').dataset.name.toLowerCase();
            return nameA.localeCompare(nameB);
            });
            items.forEach(item => container.appendChild(item));
        } else if (sortBy == "new"){
            const container = document.querySelector('#cvItemContainer');
            const items = Array.from(container.querySelectorAll('.cv-item-container'));
            items.sort((a, b) => {
                const idA = parseInt(a.querySelector('img').dataset.id, 10);
                const idB = parseInt(b.querySelector('img').dataset.id, 10);
                return idB - idA;
            });
            items.forEach(item => container.appendChild(item));
        };
    }


    const filters = {
        type: 'none',
        raidbound: 'none',
        chests: 'none',
        name: '',
        id: '',
        preset: 'none'
    };


    function runFilters() {
        const allItems = document.querySelectorAll('#cvItemContainer img.cv-item-img');
        allItems.forEach(item => {

            const matchesType = filters.type === 'none' || item.dataset.type === filters.type;

            const raidboundList = item.dataset.raidbound.split(',');
            const matchesRaidbound = filters.raidbound === 'none' || raidboundList.includes(filters.raidbound);
            const matchesChests = filters.chests === 'none' || (raidboundList.includes(filters.chests) && item.dataset.name.match('Amulet Chest'));

            const matchesName = filters.name === '' || item.dataset.name.toLowerCase().match(filters.name.toLowerCase());

            const matchesId = filters.id === '' || item.dataset.id.match(filters.id);

            const matchesPreset = filters.preset === 'none' || filters.preset.some(term => item.dataset.name.includes(term));;

            item.hidden = !(matchesType && matchesRaidbound && matchesChests && matchesName && matchesId && matchesPreset);
        });
    };


    document.querySelector("#optionType").addEventListener('change', () => {
        filters.type = document.querySelector("#optionType").value;
        runFilters();
    });


    document.querySelector("#optionRaidbound").addEventListener('change', () => {
        filters.raidbound = document.querySelector("#optionRaidbound").value;
        runFilters();
    });


    document.querySelector("#optionChests").addEventListener('change', () => {
        filters.chests = document.querySelector("#optionChests").value;
        runFilters();
    });


    document.querySelector("#optionName").addEventListener('input', () => {
        filters.name = document.querySelector("#optionName").value;
        runFilters();
    });


    document.querySelector("#optionId").addEventListener('input', () => {
        filters.id = document.querySelector("#optionId").value;
        runFilters();
    });


    document.querySelector("#optionPreset").addEventListener('input', () => {
        const preset = document.querySelector("#optionPreset").value;
        const presets = {
            ammychests: ['Amulet Chest'],
            lostartifacts: ['Lost Artifact'],
            artifacts: ['Artifact'],
            blackhand: ['Soul of Blackhand Reborn','Trinket of Aridity Reborn','Myrmidon Helm Reborn','Interstellar Leggings Reborn','Cord of Freezing Winds Reborn','Boots of the Eagle Reborn','Prophecy Mail Reborn','Incredible Tower Shield Reborn','Blackhand Reborn','Ring of the Sea Reborn'],
            blazing: ['Blazing Serpent'],
            talismen: ['Talisman'],
            catalyst: ['Catalyst','Blossom'],
            chancellor: ['Chancellor'],
            deathwalker: ['Deathwalker'],
            dragon: ['Eye of Dalinda','Sinister Dragon Helm','Blade of Xiuhcoatl','Winged Serpents Armor','Gem Scale Shield','Encased Serpents Soul','Strap of Ananta Boga','Studded Legs of Draco','Horned Dragon Boots'],
            ethereal: ['Steed Nucleus','Sorcerer Void','Serpent Eye','Priest Halo','Doomlord Heart'],
            ghostly: ['Ghostly Stalker'],
            stamps: ['Guardian Stamp'],
            lifeforces: ['Life Force'],
            noble: ['Noble Lord'],
            exalted: ['Exalted Perfection'],
            perfection: ['Perfection'],
            soulgems: ['Soulgem'],
            spiral: ['Spiral World'],
            trinkets: ['Brutal Trinket','Noxious Trinket','Aquatic Trinket','Stone Trinket','Mysterious Trinket','Luminous Trinket','Heavenly Trinket','Enflamed Trinket','Agile Trinket'],
            voidmaker: ['Voidmaker'],
            wilker: ['Buglord Thorns','Witch Invocation','Pillager Loot','Conductor Energy','Demonic Armor','Elexocutioner Power Supply'],
            wonderland: ['Black Kings Guard','Red Kings Sash','Ring of Wonders','Insquisitors Harpoon']
        };
        filters.preset = presets[preset] || 'none';
        runFilters();
    });


    document.querySelector("#optionSelect").addEventListener('input', () => {
        const selection = document.querySelector("#optionSelect").value;
        const allItems = document.querySelectorAll('#cvItemContainer img.cv-item-img');
        if (selection === "selectall") {
            for (let item of allItems) {
                if (!item.hidden){
                    item.classList.add('cv-item-img-selected');
                };
            };
            updateSelectedItemsDiv();
            document.querySelector("#optionSelect").value = "none";
        } else if (selection === "selectnone") {
            for (let item of allItems) {
                item.classList.remove('cv-item-img-selected');
            };
            updateSelectedItemsDiv();
            document.querySelector("#optionSelect").value = "none";
        };
    });


    async function checkSelectedItems(){
        const obj = {
            names: [],
            raidbounds: [],
            ammycount: 0,
            itemcount: 0,
            artifact: false
        };
        const allItems = document.querySelectorAll("#selectedItemsDiv img.cv-item-img");
        obj.itemcount = allItems.length;
        for (let item of allItems){
            const itemName = item.dataset.name;
            obj.names.push(itemName);

            if (item.dataset.raidbound){
                obj.raidbounds.push(item.dataset.raidbound.split(','))
            };
            const ammyChest = itemName.match(/Amulet Chest \([0-9]+\)/i);
            if (ammyChest){
                obj.ammycount += parseInt(ammyChest[0].match(/[0-9]+/)?.[0] || 0);
            };
            if (itemName.match('Artifact') && !itemName.match('Lost')){
                obj.artifact = true;
            };
        };

        const allAmmyChests = obj.names.length > 0 && obj.names.every(val => val.startsWith("Amulet Chest"));

        const commonRaidbound = obj.raidbounds.length > 0 ? obj.raidbounds[0].filter(val => obj.raidbounds.every(arr => arr.includes(val))) : [];
        const validRaidboundArray = [];
        for (let char of commonRaidbound){
            validRaidboundArray.push(`<a href="javascript:void(0);" class="raidbound-char-link" data-name="${char}">${char}</a>`);
        };

        if (obj.raidbounds.length > 0 && validRaidboundArray.length == 0){
            document.querySelector("#award").disabled = true;
            const str = `<b><font color="#FF0000">ERROR</font></b><br>Raidbound conflict. Unable to award these items together`
            await dbMsg(str);

        } else if (allItems.length == 1 && obj.artifact){
            await dbMsg('<img src="https://studiomoxxi.com/moxximod/loading-gif.gif" style="width:15px;height:15px;margin:1rem;"><span id="loadingDb">Loading</span>');
            document.querySelector("#award").disabled = false;

            const itemName = obj.names.toString();

            document.querySelector("#loadingDb").innerHTML = "Checking recently awarded items";
            const crewLogs = await superfetchCrewActionLogs('Award Item');

            const recentlyAwardedThisArtifact = [];
            for (log of crewLogs.award){
                const awardedItem = log.name;
                const awardedChar = log.char;
                if (awardedItem == itemName){
                    recentlyAwardedThisArtifact.push(awardedChar);
                };
            };

            document.querySelector("#loadingDb").innerHTML = "Checking profiles for complete god slayers";
            const godData = await info('All gods data');
            const godName = godData.find(i => i.artifact == itemName).name.replace(',','');
            const charsArray = obj.raidbounds[0];
            const artifactNeeded = [];

            const charsLoop = async (char) => {
                const profileData = await superfetchProfile(`profile?transnick=${char}`);
                const ele = profileData.elemental.toLocaleString();
                const power = profileData.power.toLocaleString();
                const slayer = profileData.godslayer;
                const slayerCompleted = profileData.completedgodslayer.split(',');
                if (!slayerCompleted.includes(godName) && !recentlyAwardedThisArtifact.includes(char)){
                    artifactNeeded.push(`<a href="javascript:void(0);" class="raidbound-char-link" data-ele="${ele}" onmouseover="statspopup(event,'<table class=pop><tr><td><b>${char}</b></td><td></td></tr><tr><td>Power</td><td>${power}</td></tr><tr><td>Elemental</td><td>${ele}</td></tr><tr><td>Slayer</td><td>${slayer}</td></tr></table>')" onmouseout="kill()" data-name="${char}">${char}</a>`);
                };
            };
            await Promise.all(charsArray.map(charsLoop));
            const str = `<b>Unfinished God Slayer (${artifactNeeded.length})</b><br>${artifactNeeded.sort().reverse().join(',')}`
            await dbMsg(str);
            await applyRaidboundCharLinks();

        } else if (validRaidboundArray.length > 0 && allAmmyChests){
            document.querySelector("#award").disabled = false;
            const total = obj.ammycount;
            const str = `<b>Amulet Chests Selected (${total})</b><br>${validRaidboundArray.join(',')}`
            await dbMsg(str);
            await applyRaidboundCharLinks();

        } else if (validRaidboundArray.length > 0){
            document.querySelector("#award").disabled = false;
            const str = `<b>Available</b><br>${validRaidboundArray.join(',')}`
            await dbMsg(str);
            await applyRaidboundCharLinks();

        } else if (obj.itemcount == 1){
            const itemName = document.querySelector("#selectedItemsDiv > img").dataset.name;
            const itemId = document.querySelector("#selectedItemsDiv > img").dataset.id;
            await dbMsg(`Selected: <a href="itemlink?id=${itemId}" target="BLANK">${itemName}</a>`);
        } else {
            document.querySelector("#award").disabled = false;
            document.querySelector("#db").innerHTML = '';
        };
    };


    async function applyRaidboundCharLinks(){
        const allLinks = document.querySelectorAll(".raidbound-char-link");
        for (let link of allLinks){
            link.addEventListener('click', async () => {
                const name =  link.dataset.name;
                document.querySelector("#selectName").value = name;
                const options = document.querySelectorAll('#awardTo option');
                const match = Array.from(options).find(opt => !opt.disabled && opt.textContent.trim().toLowerCase() === name.trim().toLowerCase());
                if (match) {
                    document.querySelector("#awardTo").value = match.value;
                } else {
                    document.querySelector("#awardTo").value = "na";
                };
            });
        };
    };


    async function dbMsg(msg){
        document.querySelector("#db").innerHTML = `
            <div class="widget" style="text-align:left;font-size:12px;">
            <div style="width:100%;text-align:right;cursor:pointer;" id="closeDb">X</div>
            ${msg}<br>
            <div id="dbItemId"></div>
            </div>
        `

        document.querySelector("#closeDb").addEventListener('click', async () => {
            document.querySelector("#db").innerHTML = '';
        });

        const countSelected = document.querySelectorAll("#selectedItemsDiv > img").length
        if (countSelected == 1){
            const itemId = document.querySelector("#selectedItemsDiv > img").dataset.id;
            document.querySelector("#dbItemId").innerHTML = `Item ID: ${itemId}`;
        } else {
            document.querySelector("#dbItemId").innerHTML = "";
        };
    };


    async function getNonce(){
        const fetch = await superfetch("crew_vault",true)
        const nonce = fetch.match(/name="form-nonce" value="([^"]*)"/i)[1];
        return nonce;
    };

};

async function crewVaultViewer(){
    return;
};

async function raidattack(){

    const messages = document.querySelectorAll('[id^="message_"]');
    messages.forEach(i => {
        i.style.visibility = 'visible';
    });
};

async function pointTransfer(dataPremium){
    const parentDiv = document.querySelector("#content-header-row");
    const newDiv = document.createElement("div");
    newDiv.className = "statbox widget box box-shadow col-12 form-group";
    newDiv.setAttribute('style','max-width:700px;margin-top:1rem;')
    newDiv.innerHTML = `
    <h6 style="margin-bottom:0px;">You have <b>${dataPremium.toLocaleString()}</b> transferable points and can transfer up to <b>${(dataPremium * 0.9523809523809524).toFixed(2).toLocaleString()}</b> points</h6>
    <span id="taxCalc"></span>
    `
    parentDiv.appendChild(newDiv);
    document.querySelector("#AutoNumber1 > tbody > tr:nth-child(2) > td > input:nth-child(2)").addEventListener('input', function(){
        const input = document.querySelector("#AutoNumber1 > tbody > tr:nth-child(2) > td > input:nth-child(2)").value;
        if (input == '' || input == "0"){
            document.querySelector("#taxCalc").innerHTML = ''
        } else if (input*1.05 > dataPremium){
            document.querySelector("#taxCalc").innerHTML = '<h5 style="margin-bottom:0px;margin-top:1rem;color:#FF0000;"><b>You do not have enough points</b></h5>'
        } else {
        document.querySelector("#taxCalc").innerHTML = `<h5 style="margin-bottom:0px;margin-top:1rem;">${(input*1.05).toLocaleString()} points will be transferred</h5>`
        };
    })
}


async function godstatus() {

    GM_addStyle (`
    #godStatusDiv{width:1030px;text-align:left;}
    div.godStatusTile{display:inline-block;height:250px;overflow:hidden;box-shadow: 0 0 5px rgba(0, 0, 0, 1);margin:2px;text-align:center;}
    div.godStatusTile > img{width:250px;height:250px;}
    div.godStatusText{width:220px;position:relative;left:15px;top:-175px;background:#000000;padding:15px;border-radius:15px;font-size:14px;opacity:0.9;width:220px;box-shadow: 0 0 3px rgba(0, 0, 0, 1);}
    `);

    const allRecentGodKills = document.querySelector("#content").innerHTML.match(/<a href="raidattack\.php\?raidid=[0-9]+">.*?<\/a>[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*/g)

    const raids = await Promise.all(allRecentGodKills.map(async (endpoint) => {
        const godName = endpoint.match(/<a href="raidattack\.php\?raidid=[0-9]+">(.*?)<\/a>/i)[1];
        const raidId = endpoint.match(/<a href="raidattack\.php\?raidid=([0-9]+)">/i)[1];
        const raidTime = endpoint.replace(/\s+/g,'').match(/([0-9]+:[0-9]+:[0-9]+)<\/td>/i)[1];
        const crewName = endpoint.match(/<a href="crew_profile\.php\?id=[0-9]+">(.*?)<\/a>/i)[1];
        const crewId = endpoint.match(/<a href="crew_profile\.php\?id=([0-9]+)">/i)[1];
        const data = await superfetch(endpoint.match(/raidattack\.php\?raidid=[0-9]+/i));
        const items = data.match(/<a href="#" onmouseover="popup\(event,'.*?'\)" onmouseout="kill\(\)">.*?<\/a>/i) ? data.match(/<a href="#" onmouseover="popup\(event,'.*?'\)" onmouseout="kill\(\)">.*?<\/a>/i) : `<a href="#" onmouseout="kill()">0 items</a>`;
        const totalDamage = parseInt((data.replace(/,/g, '').match(/<i>Total Attacker Damage: ([0-9]+)<\/i>/i) || [0,0])[1])
        const godImgHtml = data.replace(/[\n\r]/g,'').replace(/\s+/g,'').match(/<divclass="defenderimageskinborderd-flexjustify-content-centeralign-items-centermb-3"><imgsrc="(.*?)"><\/div>/i)[1]
        return [godName, {
            damage: totalDamage,
            image: `<img src="${godImgHtml}">`,
            crew: crewName,
            crewId,
            god: godName,
            raidId,
            time: raidTime,
            items: items
        }];
    }));
    const allGods = Object.fromEntries(raids);

    const sortedGods = Object.fromEntries(Object.entries(allGods).sort(([, a], [, b]) => b.damage - a.damage));

    let newGodStatusContent = []
    for (const [god, { damage, image, crew, crewId, raidId, time, items }] of Object.entries(sortedGods)) {
        newGodStatusContent.push(`
        <div class="godStatusTile">
        ${image}<br>
        <div class="godStatusText">
        <a href="raidattack.php?raidid=${raidId}">${god.replace(/(,|the|The|of).*/gi, '')}</a><br>
        <a href="crew_profile.php?id=${crewId}">${crew.substring(0, 20)}</a><br>
        Time: ${time}<br>
        Damage: ${damage.toLocaleString()}<br>
        ${items.toString().replace('onmouseout="kill()">','onmouseout="kill()">Found ')}
        </div>
        </div>`)
    };
    const content = newGodStatusContent.map((element, index) => (index + 1) % 4 === 0 ? element + '<br>' : element).join(' ');
    document.querySelector("#content").innerHTML = `<div id="godStatusDiv">${content}</div>`;
};


async function treasury(){
    GM_addStyle(`
        #itemtable { width: 365px !important; }
        #treasuryItemTable td { padding:4px !important; }
        img.item{ height: 35px; width: 35px; border-radius: 8px; box-shadow: 0 0 5px rgba(0, 0, 0, 1); background: #000000; border: 2px #475254 SOLID; }
        div.opt{ display:inline-block; flex:1; }
        div.opt-big{ display:inline-block; flex:3; }
        .optContainer { display: flex; flex-wrap: wrap; gap: 0.5rem; font-family: monospace; }
        .dropdown { position: relative; display: inline-block; width: 100%; cursor: pointer; text-align:left; }
        .dropdown-btn { padding: 10px; border: 1px solid #ccc; cursor: pointer; width: 200px; background: #fff }
        .dropdown-content { padding:0px !important; display: none; position: absolute; background-color: #f9f9f9; border: 1px solid #ccc; width: 100%; max-height: 250px; overflow-y: auto; z-index: 1; }
        .dropdown-content label { display: flex; align-items: flex-start; gap: 0.5rem; padding: 1px 6px 1px 2px; cursor: pointer; transition: background-color 0.2s; }
        .dropdown.show .dropdown-content { display: block; }
        .dropdown-filter { width:100%; }
        .dropdown-content input.check:checked + span { background-color: #0e1726; color: #DDDDDD; }
        .check { display: none; }
        .dropdown-menu > label > span { padding:1px 1px 1px 10px; border-radius:6px; width:100% }
        label { margin-bottom: 0px !important; }
        td.is-vendor{ color: #66FFFF !important; }
        button.form-control-new { font-family:monospace; font-size:14px; }
        img.currency { height:15px; width:15px; margin-right:5px; }
        #windowTreasuryItem { padding:1rem; color:#FFFFFF; background-image: url('/images/bg.jpg');}
        #windowInfo{ margin-top:1rem; border:1px #ffffff solid; padding:1rem; background-color:#000000; border-radius:1rem; font-family:monospace; width:368px; }
        #warning { width:330px; padding:1rem; text-align:center; background-color:#B03939; color:#FFFFFF; border:1px SOLID #000000; border-radius:5px; margin-bottom:1rem; }
        #quantityInput {background-color: #121212 !important; color: #ffffff; border: 1px solid #444; border-radius: 4px; padding: 2px 4px; width: 75px; font-family: monospace; font-size: 12px;}
        .pop-table-cell { padding-right:1rem; }
        #shoutboxButton{ height:46px; width:46px; cursor:pointer; }
        #buyPost { cursor: pointer; }
    `);

    const typesObj = {
        "Potions": [42, 185, 182],
        "Skill Orbs": [187],
        "Augments": [188],
        "Upgrades": [189],
        "Miscellaneous": [43,202,203,226,233],
        "Utility": [190],
        "Amulet Shop": [192],
        "Core": [230],
        "Ring": [193],
        "Head": [194],
        "Neck": [195],
        "Weapon": [196],
        "Body": [197],
        "Shield": [198],
        "Belt": [199],
        "Pants": [200],
        "Foot": [201],
        "Badge": [239],
        "Quest Items": [205,245,243,248],
        "Enhancements": [206,234,244,246,247],
        "Crew": [208,209,207],
        "Keys": [242],
    };

    const itemTypes = Object.keys(typesObj);
    itemTypes.sort((a, b) => { return a.toLowerCase().localeCompare(b.toLowerCase()) });

    const rarityObj = {
        "Rare": { n: 2, color: "1eff00"},
        "Elite": { n: 3, color: "ffde5b"},
        "Godly": { n: 4, color: "CA1111"},
        "Brutal": { n: 5, color: "0070ff"},
        "King": { n: 6, color: "ff8000"},
        "Mythic": { n: 7, color: "9000ba"},
        "Unique": { n: 8, color: "ff00ff"},
    };

    const itemRarities = Object.keys(rarityObj);

    const currObj = {
        0: {name: "points", img: "images/point_small.gif"},
        1: {name: "gold", img: "images/goldcoin.gif"},
        2: {name: "exp", img: "https://studiomoxxi.com/moxximod/exp_icon.png"},
        3: {name: "amulets", img: "images/items/achievementamulet.jpg"}
    };


    document.querySelector("#content").innerHTML = `
        <div class="optContainer">
            <div class="mb-2 opt">
                <input id="treasurySearch" type="text" class="form-control mb-2" autocomplete="off" placeholder="SEARCH">
            </div>
            <div class="mb-2 opt">
                <div class="dropdown">
                <div class="form-control">TYPE [<span id="typeCount">0</span>] ▼</div>
                <div class="dropdown-content dropdown-menu" id="itemTypesOptions">
                ${itemTypes.map(i => `<label><input type="checkbox" value="${i}" class="check type-check"><span>${i}</span></label>`).join('')}
                </div>
                </div>
            </div>
            <div class="mb-2 opt">
                <div class="dropdown">
                <div class="form-control">RARITY [<span id="rarityCount">0</span>] ▼</div>
                <div class="dropdown-content dropdown-menu" id="itemRaritiesOptions">
                ${itemRarities.map(i => `<label><input type="checkbox" value="${i}" class="check rarity-check" id="check${i}"><span style="color:#${rarityObj[i].color}">${i}</span></label>`).join('')}
                </div>
                </div>
            </div>
            <div class="mb-2 opt">
                <div class="dropdown">
                <div class="form-control">UNHIDE ▼</div>
                <div class="dropdown-content dropdown-menu" id="unhideItemsOption">
                </div>
                </div>
            </div>
            <img src="https://studiomoxxi.com/moxximod/treasShoutboxIcon.png" class="open-shoutbox" id="shoutboxButton" onmouseover="statspopup(event,'<b>Open treasury shoutbox<b>')" onmouseout="kill()">
        </div>
        <div class="w-3 col-lg-12 col-md-12 col-sm-12 col-12 layout-spacing px-1">
            <div class="widget mb-2" id="itemTableDiv">
            <img src="https://studiomoxxi.com/moxximod/loading-gif.gif" height="50px" width="50px">
            </div>
        </div>
    `

    await loadUnhide();


    async function loadUnhide(newHide){
        const hiddenArr = GM_getValue('treasuryHidden') || [];
        if (newHide){ hiddenArr.push(newHide) };
        document.querySelector("#unhideItemsOption").innerHTML = `${hiddenArr.sort().map(i => `<label><input type="checkbox" value="${i}" class="check unhide-item"><span>${i}</span></label>`).join('')}`

        document.querySelectorAll('input.unhide-item').forEach(async checkbox => {
            checkbox.addEventListener('change', async function() {
                checkbox.parentElement.remove();
                const targetItemName = checkbox.value;
                const hiddenArr = GM_getValue('treasuryHidden') || [];
                const updatedHiddenArr = hiddenArr.filter(item => item !== targetItemName);
                GM_setValue("treasuryHidden", updatedHiddenArr);
            });
        });
    };

    const originalAjaxRequest = await superfetch('ajax/ajax_treasury.php?category=-1');
    loadItems([originalAjaxRequest]);


    document.querySelectorAll(".dropdown .form-control").forEach(btn => {
        btn.addEventListener('click', function (event) {

            const dropdown = this.parentElement;
            dropdown.classList.toggle("show");
        });
    });


    document.querySelector("#treasurySearch").addEventListener('input', async ()=> {
        const input = document.querySelector("#treasurySearch").value;
        const search = await superfetch(`ajax/ajax_treasury.php?category=-1&search_for=${input}`, true);

        document.querySelectorAll('input.type-check').forEach(async checkbox => {
            checkbox.checked = false;
        });

        await loadItems([search]);
    });


    document.querySelectorAll('input.type-check').forEach(async checkbox => {
        checkbox.addEventListener('change', async function() {

            document.querySelector("#itemTableDiv").innerHTML = '<img src="https://studiomoxxi.com/moxximod/loading-gif.gif" height="50px" width="50px">';

            document.querySelector("#treasurySearch").value = "";

            const selectedArr = Array.from(document.querySelectorAll('#itemTypesOptions input.type-check:checked')).map(input => input.value);

            await handleType(selectedArr);
        });
    });


    async function handleType(selectedArr){
        const arr = [];
        for (const group of selectedArr) {
            for (const type of typesObj[group]){
                const search = await superfetch(`ajax/ajax_treasury.php?category=${type}`);
                arr.push(search);
            };
        };

        if (arr.length > 0){
            await loadItems(arr);
        } else {
            const resetAjax = await superfetch('ajax/ajax_treasury.php?category=-1');
            await loadItems([resetAjax]);
        };
    };


    document.querySelectorAll('input.rarity-check').forEach(async checkbox => {
        checkbox.addEventListener('change', async function() {

            const selectedArr = Array.from(document.querySelectorAll('#itemRaritiesOptions input.rarity-check:checked')).map(input => input.value);

            await handleRarity(selectedArr);

            GM_setValue('treasuryRarity',selectedArr);
        });
    });

    async function handleRarity(selectedArr){
        const amountSelected = (selectedArr || []).length;
        const rows = document.querySelectorAll("#treasuryItemTable > tbody > tr");
        for (const row of rows){
            const rarity = row.dataset.rarity;
            if (amountSelected == 0){
                row.style.display = "";
            } else if (selectedArr.includes(rarity)){
                row.style.display = "";
            } else {
                row.style.display = "None";
            };
        };
        await countFilters();
    };


    async function loadItems(arrOfAjax){
        document.querySelector("#itemTableDiv").innerHTML = '<img src="https://studiomoxxi.com/moxximod/loading-gif.gif" height="50px" width="50px">';
        const searchVal = document.querySelector("#treasurySearch").value || false;
        const hiddenArr = GM_getValue('treasuryHidden') || [];
        const itemRows = [];
        for (const ajax of arrOfAjax){
            const obj = JSON.parse(ajax);
            const array = obj.data;
            const itemsLoop = async (item, index) => {
                const name = item[6][2];
                const levelReq = item[3];

                if (hiddenArr.includes(name)){
                    return;
                };

                if (searchVal && !name.toLowerCase().match(searchVal.toLowerCase())){
                    return;
                };
                const type = item[6][1];
                const price = parseFloat(item[6][4]);
                const currName = currObj[item[5][1]].name;
                const currImg = currObj[item[5][1]].img;
                const currency = `<img src=${currImg} class=currency>${price.toLocaleString()} ${currName}`
                const seller = item[6][7];
                const isVendor = seller == "Vendor" ? "is-vendor" : "";
                const id = item[6][0];
                const imgSrc = item[6][3];
                const imgAtr = `<img src="images/${imgSrc}" onmouseover="itempopup(event,'${id}', ${type})" class="item" onmouseout="kill()">`;
                const data = await superfetchItem(`${id}&data=${type}`);
                const rarity = data.rarity;
                const color = data.rarityColor;
                const slot = data.slot.charAt(0).toUpperCase() + data.slot.slice(1);
                const ele = data.ele.toLocaleString();
                const power = (data.hp + data.atk).toLocaleString();
                const mr = data.maxrage.toLocaleString();
                const findButton = `<button class="form-control-new find" data-item="${name}">FIND</button>`
                const hideButton = `<button class="form-control-new hide" data-item="${name}">HIDE</button>`
                const openButton = `<button class="form-control-new open" data-seller="${seller}" data-id="${id}" data-type="${type}" data-price="${price}" data-currency="${currName}" data-name="${name}">OPEN</button>`;
                const atr = `data-index="${String(index).padStart(4, '0')}" data-id="${id}" data-type="${type}" data-slot="${slot}" data-seller="${seller}" data-rarity="${rarity}" data-name="${name}"`
                const row = `<tr ${atr}><td>${imgAtr}</td><td><font color="${color}">${name}</font></td><td>${slot}</td><td>${levelReq}<td>${power}</td><td>${ele}</td><td>${mr}</td><td class="${isVendor}">${seller}</td><td>${currency}</td><td>${findButton}</td><td>${hideButton}</td><td>${openButton}</td></tr>`;
                itemRows.push(row);
            };
            await Promise.all(array.map(itemsLoop));
        };

        document.querySelector("#itemTableDiv").innerHTML = `
            <table class="table table-striped sortable" id="treasuryItemTable">
            <thead><tr><th></th><th>item</th><th>slot</th><th>lev</th><th>power</th><th>ele</th><th>max rage</th><th>seller</th><th>price</th></tr></thead>
            ${itemRows.sort().join('')}
            </table>
        `


        const storedValues = GM_getValue('treasuryRarity');
        if (storedValues){
            await handleRarity(storedValues);
            for (const value of storedValues){
                document.querySelector(`#check${value}`).checked = true;
            };
        };

        await countFilters();


        const findButtons = document.querySelectorAll("button.find");
        for (const button of findButtons){
            button.addEventListener('click', async() => {
                const targetItemName = button.dataset.item;
                document.querySelector("#treasurySearch").value = targetItemName;
                const search = await superfetch(`ajax/ajax_treasury.php?category=-1&search_for=${targetItemName}`);
                await loadItems([search]);
                const rows = document.querySelectorAll("#itemTable > tbody > tr");
                for (const row of rows){
                    const itemName = row.dataset.name;
                    if (itemName == targetItemName){
                        row.style.display = "";
                    } else {
                        row.style.display = "None";
                    };
                };
            });
        };


        const openButtons = document.querySelectorAll("button.open");
        for (const button of openButtons){
            button.addEventListener('click', async() => {

                const targetItemName = button.dataset.name;
                const targetItemPrice = parseFloat(button.dataset.price);
                const search = await superfetch(`ajax/ajax_treasury.php?category=-1&search_for=${targetItemName}`);
                const prices = JSON.parse(search).data.filter(i => i[6][2] == targetItemName).map(i => parseFloat(i[6][4]));
                const cheapestPrice = Math.min(...prices)

                const targetItemId = button.dataset.id;
                const targetItemType = button.dataset.type;
                const targetItemCurrency = button.dataset.currency;
                const targetItemSeller = button.dataset.seller;
                createWindow("Treasury Item", "treasury_item", 400, 100, -200);
                document.querySelector("#treasury_item_content").innerHTML = `<div id="windowTreasuryItem"><img src="https://studiomoxxi.com/moxximod/loading-gif.gif" height="75px" width="75px"></div>`
                const itemHtml = await superfetch(`item_rollover.php?id=${targetItemId}&data=${targetItemType}`);
                document.querySelector("#windowTreasuryItem").innerHTML = `
                    ${itemHtml}
                    <div id="windowInfo"><center>
                        <div id="warningContainer"></div>
                        <table style="margin-bottom:1rem;">
                        <tr><td class="pop-table-cell"><b>ITEM ID:</b></td><td class="pop-table-cell">${targetItemId}</td></tr>
                        <tr><td class="pop-table-cell"><b>SELLER:</b></td><td class="pop-table-cell">${targetItemSeller}</td></tr>
                        <tr><td class="pop-table-cell"><b>TOTAL PRICE:</b></td><td class="pop-table-cell"><span id="tdPrice">${targetItemPrice.toLocaleString()}</span> ${targetItemCurrency}</td></tr>
                        <tr><td class="pop-table-cell"><b>QUANTITY:</b></td><td class="pop-table-cell"><input type="number" id="quantityInput" value="1" disabled></td></tr>
                        </table>
                        <button class="form-control-new" id="buyItem">BUY ITEM</button>
                    </div>
                `;

                const treasury = await superfetch("treasury", true);
                const nonce = treasury.match(/id="treasury-nonce" value="([^"]*)"/i)[1];

                if (targetItemType == "1"){
                    document.getElementById('quantityInput').disabled = false;
                    document.querySelector("#quantityInput").addEventListener('input', async ()=> {
                        const selectedQuantity = parseInt(document.querySelector("#quantityInput").value);
                        const totalPrice = selectedQuantity * targetItemPrice;
                        document.querySelector("#tdPrice").innerHTML = totalPrice.toLocaleString();
                    });
                };

                if (cheapestPrice < targetItemPrice){
                    document.querySelector("#warningContainer").innerHTML = `
                        <div id="warning">
                        <b>WARNING</b><br> ${targetItemName} is available for ${cheapestPrice.toLocaleString()} ${targetItemCurrency} from a different seller
                        </div>
                        `
                };

                document.querySelector("#buyItem").addEventListener('click', async ()=> {
                    await buyItem(targetItemId,targetItemType,nonce,targetItemPrice);
                });
            });
        };


        async function buyItem(id,type,nonce,price){
            const quantity = document.querySelector("#quantityInput").value;
            const body = `itemid=${id}&isdata=${type}&qty=${quantity}&nonce=${nonce}&price=${price}`;
            const url = 'ajax/treasury_buy';
            const buy = await superpost(url,body);
            const response = buy.replace(/<.*?>/,'').match(/\{"[^"]*":"([^"]*)"\}/i)[1];
            document.querySelector("#windowInfo").innerHTML = response;
            if (type == 0 && response.match('purchased')){
                document.querySelector(`tr[data-id="${id}"]`).remove();
            };
        };


        const hideButtons = document.querySelectorAll("button.hide");
        for (const button of hideButtons){
            button.addEventListener('click', async() => {
                await loadingOverlay();
                const hiddenArr = GM_getValue('treasuryHidden') || [];
                const targetItemName = button.dataset.item;
                await loadUnhide(targetItemName);
                hiddenArr.push(targetItemName);
                GM_setValue("treasuryHidden", hiddenArr);
                const rows = document.querySelectorAll("#treasuryItemTable > tbody > tr");
                for (const row of rows){
                    const name = row.dataset.name;
                    if (name == targetItemName){
                        row.remove();
                    };
                };
                await loadingOff();
            });
        };


        await sortableTables();

    };


    async function countFilters(){
        const countRarity = document.querySelectorAll('input.rarity-check:checked').length;
        document.querySelector("#rarityCount").innerHTML = countRarity;
        const countType = document.querySelectorAll('input.type-check:checked').length;
        document.querySelector("#typeCount").innerHTML = countType;
    };


    document.querySelector("#shoutboxButton").addEventListener('click', async() => {
        createWindow(`Treasury Shoutbox <span id="buyPost">[post]</span>`, "treasury_shoutbox", 720, 100, -200);
        document.querySelector("#treasury_shoutbox_content").innerHTML = `<img src="https://studiomoxxi.com/moxximod/loading-gif.gif" height="50px" width="50px">`;
        const treasury = await superfetch('treasury');
        const parseData = new DOMParser();
        const treasuryDoc = parseData.parseFromString(treasury, 'text/html');
        const list = treasuryDoc.querySelector('ul.list-group');
        document.querySelector("#treasury_shoutbox_content").innerHTML = list.outerHTML;
        const content = document.querySelector("#treasury_shoutbox_content");
        const shouts = content.querySelectorAll('li');
        document.querySelector("#buyPost").addEventListener('click', async() => {
            window.location.href = "tradepost";
        });
    });

};


async function blacksmith(server,serverNo,rgaName,charId){
    var existingDiv = document.querySelector('.col-12.col-xl-6.mb-3.mb-xl-0');
    var newDiv = document.createElement('div');
    newDiv.innerHTML = `<p>
        <div id="itemGems"></div>
    `

    existingDiv.appendChild(newDiv);
    if (window.location.href.match(/itemid=[0-9]+/i) && !window.location.href.match('morphtarget')){
        const iid = window.location.href.match(/itemid=([0-9]+)/i)[1];
        const item = await superfetch(`item_rollover.php?id=${iid}`);
        const gems = 4-(item.match(/\/images\/gemslot2\.jpg/) ? item.match(/\/images\/gemslot2\.jpg/g).length : 0);

        const i = await mvItemSpec(iid);
        const name = i.name.replace(/<.*?>/g,'').replace(/,/g,'');
        const slot = i.slot;
        let atk = parseInt(i.atk.replace(/<.*?>/g,'').replace(/,/g,''));
        let hp = parseInt(i.hp.replace(/<.*?>/g,'').replace(/,/g,''));
        let rpt = parseInt(i.rpt.replace(/<.*?>/g,'').replace(/,/g,''));
        let ept = parseInt(i.ept.replace(/<.*?>/g,'').replace(/,/g,''));
        let mr = parseInt(i.mr.replace(/<.*?>/g,'').replace(/,/g,''));
        let gemMath = '';
        const gemImages = [
            { src: "https://torax.outwar.com/images/gem_green1.jpg", gems: 0 },
            { src: "https://torax.outwar.com/images/gem_blue2.jpg", gems: 1 },
            { src: "https://torax.outwar.com/images/gem_red2.jpg", gems: 2 },
            { src: "https://torax.outwar.com/images/gem_white2.jpg", gems: 3 }
        ];
        for (let i = 0; i < gemImages.length; i++) {
            if (gems <= gemImages[i].gems) {
                atk *= 1.15; hp *= 1.15; rpt *= 1.15; ept *= 1.15; mr *= 1.15;
                const stats = `<div align=left><b>${name.toUpperCase()}<br>[SLOT - ${slot.toUpperCase()}]</b><br>+${Math.ceil(atk).toLocaleString()} ATK<br>+${Math.ceil(hp).toLocaleString()} HP<br>+${Math.ceil(rpt).toLocaleString()} rage per hr<br>+${Math.ceil(ept).toLocaleString()} exp per hr<br>+${Math.ceil(mr).toLocaleString()} max rage`;
                gemMath += `<img src="${gemImages[i].src}" style="height:40px !important;width:40px !important;" onmouseover="statspopup(event,'${stats.replace(/"/g,'')}')" onmouseout="kill()">`;
            };
        };
        if (gems !== 4) {
            document.querySelector("#itemGems").innerHTML = `<h5>GEM CALCULATOR</h5>${gemMath}`;
        };
    };
};


async function gladiator(charId,profileData){
    if (document.body.innerHTML.match(/<h1>Gladiator of Loyalty<\/h1>/i)){

        GM_addStyle(`
        .mark-count {padding:1px;}
        .loyalty-glad-table > tbody > tr > td > img {height:25px;width:25px;margin:3px;}
        .loyalty-glad-table-faction > thead > tr > th {background-color:#000000 !important;color:#FFFFFF !important;}
        .me-row {box-shadow: inset 0 0 2px 2px rgba(255, 255, 255, 0.4);}
        .faction-img {height:30px;width:30px;margin-bottom:10px;margin-right:5px;cursor:pointer;}

        `)
        const factions = ['Alvar','Delruk','Vordyn'];
        const stripe1 = ['232756','9B2E17','832069'];
        const stripe2 = ['2d3b67','5F2216','6F1E58'];
        for (let i = 0; i < factions.length; i++) {
            const f = factions[i];
            GM_addStyle(`
                .tier-1-${f},.tier-1-${f} > a {background-color:#${stripe1[i]} !important;color:#FFFFFF !important;}
                .tier-2-${f},.tier-2-${f} > a {background-color:#${stripe2[i]} !important;color:#FFFFFF !important;}
                .tier-3-${f},.tier-3-${f} > a {background-color:#${stripe1[i]} !important;color:#FFFFFF !important;}
                .tier-4-${f},.tier-4-${f} > a {background-color:#${stripe2[i]} !important;color:#FFFFFF !important;}
                .tier-5-${f},.tier-5-${f} > a {background-color:#${stripe1[i]} !important;color:#FFFFFF !important;}
                .tier---${f},.tier---${f} > a {background-color:#${stripe2[i]} !important;color:#FFFFFF !important;}
            `);
        };

        const myFaction = profileData.faction;

        const div = document.querySelector('.grid-container-faction');

        const parser = new DOMParser();
        const doc = parser.parseFromString(div.innerHTML, 'text/html');

        const divs = Array.from(doc.querySelectorAll('.grid-item')).map(div => div.innerHTML.trim());

        const rankArrays = [];
        let tempArray = [];
        divs.forEach((div, index) => {
            tempArray.push(div);
            if ((index + 1) % 6 === 0) {
                rankArrays.push(tempArray);
                tempArray = [];
            }
        });

        const rows = rankArrays.slice(1).map((data, index) => {

            const filteredRowData = data.filter((_, dataIndex) => dataIndex !== 1 && dataIndex !== 2);

            let newColumn =
            index < 1 && index >= 0 ? `<img src="https://torax.outwar.com/images/rfury.jpg"><img src="/images/items/triworldgladmark.png"><span class="mark-count">x25</span>` :
            index < 2 && index >= 1 ? `<img src="https://torax.outwar.com/images/rfury.jpg"><img src="/images/items/triworldgladmark.png"><span class="mark-count">x21</span>` :
            index < 3 && index >= 2 ? `<img src="https://torax.outwar.com/images/rfury.jpg"><img src="/images/items/triworldgladmark.png"><span class="mark-count">x18</span>` :
            index < 4 && index >= 3 ? `<img src="https://torax.outwar.com/images/rfury.jpg"><img src="/images/items/triworldgladmark.png"><span class="mark-count">x16</span>` :
            index < 5 && index >= 4 ? `<img src="https://torax.outwar.com/images/rfury.jpg"><img src="/images/items/triworldgladmark.png"><span class="mark-count">x15</span>` :
            index < 8 && index >= 5 ? `<img src="/images/items/triworldgladmark.png"><span class="mark-count">x14</span>` :
            index < 11 && index >= 8 ? `<img src="/images/items/triworldgladmark.png"><span class="mark-count">x13</span>` :
            index < 14 && index >= 11 ? `<img src="/images/items/triworldgladmark.png"><span class="mark-count">x12</span>` :
            index < 17 && index >= 14 ? `<img src="/images/items/triworldgladmark.png"><span class="mark-count">x11</span>` :
            index < 20 && index >= 17 ? `<img src="/images/items/triworldgladmark.png"><span class="mark-count">x10</span>` :
            index < 22 && index >= 20 ? `<img src="/images/items/triworldgladmark.png"><span class="mark-count">x9</span>` :
            index < 24 && index >= 22 ? `<img src="/images/items/triworldgladmark.png"><span class="mark-count">x8</span>` :
            index < 26 && index >= 24 ? `<img src="/images/items/triworldgladmark.png"><span class="mark-count">x7</span>` :
            index < 28 && index >= 26 ? `<img src="/images/items/triworldgladmark.png"><span class="mark-count">x6</span>` :
            index < 30 && index >= 28 ? `<img src="/images/items/triworldgladmark.png"><span class="mark-count">x5</span>` :
            index < 42 && index >= 30 ? `<img src="/images/items/triworldgladmark.png"><span class="mark-count">x4</span>` :
            index < 50 && index >= 42 ? `<img src="/images/items/triworldgladmark.png"><span class="mark-count">x3</span>` :
            ''

            let style = ''
            if (filteredRowData[1].match(charId)){
                style = `class="me-row"`
            };

            const rowHTML = filteredRowData.map(cellData => `<td>${cellData}</td>`).join('');
            return `<tr ${style}>${rowHTML}<td>${newColumn}</td></tr>`;
        });

        const chest = {
            Vordyn: 'images/items/vordyngladchest.png',
            Delruk: 'images/items/delrukgladchest.png',
            Alvar: 'images/items/alvargladchest.png'
        };
        const groupedRows = rankArrays.reduce((groups, rowData) => {
            if (rowData[2].match(/title=".*?"/)) {
                const faction = rowData[2].match(/title="(.*?)"/)[1];
                if (!groups[faction]) {
                    groups[faction] = [];
                }
                let img = '';
                let tier = '';
                const rank = parseInt(rowData[1].replace('.',''));
                if (rank >= 1 && rank <= 3) {
                    tier = '1'
                    img = `<img src="${chest[faction]}">`
                } else if (rank >= 4 && rank <= 6) {
                    tier = '2'
                    img = `<img src="${chest[faction]}">`
                } else if (rank >= 7 && rank <= 9) {
                    tier = '3'
                    img = `<img src="${chest[faction]}">`
                } else if (rank >= 10 && rank <= 12) {
                    tier = '4'
                    img = `<img src="${chest[faction]}">`
                } else if (rank >= 13 && rank <= 15) {
                    tier = '5'
                    img = `<img src="${chest[faction]}">`
                } else {
                    tier = '--'
                };

                let style = ''
                if (rowData[3].match(charId)){
                    style = `class="me-row"`
                };

                const trElement = `
                    <tr ${style}>
                    <td class="tier-${tier}-${faction}">${tier}</td>
                    ${rowData.slice(3).map(cellData => `<td class="tier-${tier}-${faction}">${cellData}</td>`).join('')}
                    <td class="tier-${tier}-${faction}">${img}</td>
                    </tr>`;
                    groups[faction].push(trElement);
            }
            return groups;
        }, {});

        const factionHeaders = '<thead><tr><th>tier</th><th>player</th><th>damage</th><th>atks</th><th>prize</th></tr></thead>'
        document.querySelector("#content").innerHTML = `
        <div class="layout-px-spacing">
        <!-- Header -->
        <div class="widget-content widget-content-area text-center mb-3">
        <h1 style="margin-bottom:0rem;">Gladiator of Loyalty</h1>
        </div>
        <div class="row justify-content-center">
        <!-- Left column -->
        <div class="col-lg-6 col-md-6 col-sm-6 col-6 layout-spacing layout-spacing">
        <!-- Left column widget #1 -->
        <div class="widget-content widget-content-area text-left mb-3">
        <table class="table loyalty-glad-table">
        <thead><tr><th>rank</th><th>player</th><th>damage</th><th>atks</th><th>prize</th></tr></thead>
        ${rows.join('')}
        </table>
        </div>
        </div>
        <!-- Right column -->
        <div class="col-lg-6 col-md-6 col-sm-6 col-6 layout-spacing layout-spacing">
        <!-- Right column rankings -->
        <div class="widget-content widget-content-area text-left mb-3">
        <img src="https://studiomoxxi.com/moxxibots/factions/a.png" class='faction-img' id="btnAlvar">
        <img src="https://studiomoxxi.com/moxxibots/factions/d.png" class='faction-img' id="btnDelruk">
        <img src="https://studiomoxxi.com/moxxibots/factions/v.png" class='faction-img' id="btnVordyn">
        <i>click the faction logo to see faction-specific rankings</i>
        <div id="factionRankingsDiv">
        </div>
        </div>
        </div>
        `

        document.querySelector("#factionRankingsDiv").innerHTML = `
            <table class="table loyalty-glad-table loyalty-glad-table-faction">
            ${factionHeaders}
            ${(groupedRows[myFaction] || []).join('')}
            </table>
        `

        document.querySelector("#btnAlvar").addEventListener('click', async function(){
            document.querySelector("#factionRankingsDiv").innerHTML = `
            <table class="table loyalty-glad-table loyalty-glad-table-faction">
            ${factionHeaders}
            ${(groupedRows['Alvar'] || []).join('')}
            </table>
            `
        });
        document.querySelector("#btnDelruk").addEventListener('click', async function(){
            document.querySelector("#factionRankingsDiv").innerHTML = `
            <table class="table loyalty-glad-table loyalty-glad-table-faction">
            ${factionHeaders}
            ${(groupedRows['Delruk'] || []).join('')}
            </table>
            `
        });
        document.querySelector("#btnVordyn").addEventListener('click', async function(){
            document.querySelector("#factionRankingsDiv").innerHTML = `
            <table class="table loyalty-glad-table loyalty-glad-table-faction">
            ${factionHeaders}
            ${(groupedRows['Vordyn'] || []).join('')}
            </table>
            `
        });
    };
};


async function statistics(server,serverNo,rgaName,charId){

    const parseData = new DOMParser();


    const content = document.querySelector("#content");
    content.innerHTML = '<img src="https://studiomoxxi.com/moxximod/loading-gif.gif" height="50px" width="50px">'

    const expChart = await superfetch('expchart');
    const expChartDoc = parseData.parseFromString(expChart, 'text/html');
    const chart = expChartDoc.querySelector("#content-header-row");


    const home = await superfetch('home');
    const homeDoc = parseData.parseFromString(home, 'text/html');
    const box = homeDoc.querySelector('.bio-skill-box');
    const tables = box.querySelectorAll('table');

    content.innerHTML = box.innerHTML + chart.innerHTML;

};


async function homeNew(profileData) {

    const strength = profileData.strength;
    const toLevel = (profileData.exp - profileData.minimum) / (profileData.exp - profileData.minimum + profileData.tolevel) * 100;

    GM_addStyle(`
        h6 { margin-left:0.25rem; margin-right:0.25rem; }
        .widget {border-radius:0px; padding:10px; }
        .justify-left { text-align:left; }
        .home-container { display:flex; justify-content: space-between; gap:10px; }
        .row-1 { height: 410px; max-height: 440px; overflow:hidden; }
        .box  { flex:1; }
        #skillsDiv > img { margin:3px; border-radius:8px; box-shadow: 0 0 5px rgba(0,0,0,1); background:#000000; cursor:pointer; border:2px SOLID #475254;}
        .loading { height:30px; width:30px; margin:1rem; }
        .faction-img { height:40px; width:40px; margin:0.5rem; }
        #homeTilesContainer a img { height:94px; width:94px; margin:6px; border-radius:8px; background:#000000; cursor:pointer; border:2px SOLID #475254; box-shadow: 0 2px 5px rgba(0, 0, 0, 1);}
        .top-bar{ cursor:pointer; text-align:left; padding:0px; width:100%; border:1px SOLID #475254; box-shadow: 0 0 5px rgba(0,0,0,1); border-radius:0.5rem; margin-bottom:0.5rem;}
        #strengthFill { width:${strength}%; background-color: #e7515a; border-radius:0.5rem; height:0.3rem; }
        #experienceFill { width:${toLevel}%; background-color: #2eaf80; border-radius:0.5rem; height:0.3rem; }
        .shoutbox-container { display: flex; flex-direction: column; height: 100%; }
        #shoutboxTable { display: flex; flex-direction: column-reverse; overflow-y: hidden; flex: 1; border-collapse: separate; border-spacing: 0 10px; }
        #shoutboxTable > tbody > tr > td > a { font-weight: 1000; font-family:monospace; font-size:14px; }
        #shoutInput { display: flex; width: 100%; }
        #shoutText { border: none; outline: none; box-shadow: none; background: #1d1e1e; color: #ffffff; padding-left: 10px; flex: 1; font-size: 14px; border-radius:10px 0 0 10px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5); font-family:Helvetica; }
        #shoutPost { font-weight: 1000; border: none; appearance: none; outline: none; background: #1d1e1e; color: #ffffff; border-radius: 0 10px 10px 0; padding: 2px 12px; margin-left: 5px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5); cursor: pointer; font-family:monospace; }
        #shoutboxTable > tbody > tr > td { background-color: #1d1e1e; border-radius: 10px; padding: 5px 10px; color:#ffffff; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5); font-family:Helvetica; font-size:12px; }
        div[style*="background-image:url(/images/thedude.png)"] { border-radius: 10px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5); }
        #shoutboxTable > tbody > tr > td > small { color: #67686e; position:absolute; right:18px; }
        .rankings-table { width: 100%; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5); border-radius:15px; border-collapse: separate; border:1px SOLID #000; overflow: hidden; margin-top:0.5rem; }
        .rankings-table thead tr { background-color: #1e2021; }
        .rankings-table tbody tr:nth-child(even) { background-color: #1e2021; }
        .rankings-table tbody tr:nth-child(odd) { background-color: #2c2f30; }
        .rankings-table tr td { padding: 4px 8px 4px 8px; color:#ffffff; font-family:monospace; }
        .rankings-table tr th { padding: 4px 8px 4px 8px; color:#ffffff; font-family:monospace; }
        img.small-faction { height:15px; width:15px; margin-bottom:0.25rem; margin-right:0.25rem; }
        h7 { margin-left:0.25rem; margin-right:0.25rem; color: #ebedf2; margin-bottom: 1rem; font-weight: 500; line-height: 1.2; font-size: 1rem; }
        h4 { margin-bottom:0.1rem; }
        .crew-img { height:18px; width:18px; border: 1px #000 SOLID; border-radius: 20px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5); }
    `)


    if (profileData.skills.images.length > 56){
        GM_addStyle(` #skillsDiv > img { height:20px; width:20px; } `);
    } else if (profileData.skills.images.length > 28) {
        GM_addStyle(` #skillsDiv > img { height:30px; width:30px; } `);
    } else {
        GM_addStyle(` #skillsDiv > img { height:40px; width:40px; } `);
    };


    const shoutBox = document.querySelector('ul.list-group');

    document.querySelector("#content").innerHTML = `
    <div class="home-container">
        <div class="box row-1" style="display:flex; flex-direction:column;">
            <div class="widget mb-2" id="box1">
            <img src="https://studiomoxxi.com/moxximod/loading-gif.gif" class="loading">
            </div>
            <div class="widget" id="box2" style="flex-grow:1;">
            <img src="https://studiomoxxi.com/moxximod/loading-gif.gif" class="loading">
            </div>
        </div>
        <div class="box widget mb-2 row-1" id="box3">
        <img src="https://studiomoxxi.com/moxximod/loading-gif.gif" class="loading">
        </div>
        <div class="box widget mb-2 row-1" id="box4">
        <img src="https://studiomoxxi.com/moxximod/loading-gif.gif" class="loading">
        </div>
    </div>
    <div class="box widget mb-2 row-2 justify-left" id="box5">
        <h6>Alert Tiles</h6>
        <div id="homeTilesContainer">
        <img src="https://studiomoxxi.com/moxximod/loading-gif.gif" class="loading">
        </div>
    </div>
    <div class="home-container">
        <div class="box widget mb-2 row-3 justify-left" id="box6">
        <img src="https://studiomoxxi.com/moxximod/loading-gif.gif" class="loading">
        </div>
        <div class="box widget mb-2 row-3 justify-left" id="box7">
        <img src="https://studiomoxxi.com/moxximod/loading-gif.gif" class="loading">
        </div>
        <div class="box widget mb-2 row-3 justify-left" id="box8">
        <img src="https://studiomoxxi.com/moxximod/loading-gif.gif" class="loading">
        </div>
    </div>
    <div class="home-container">
        <div class="box widget mb-2 row-4 justify-left" id="box9">
        News
        <img src="https://studiomoxxi.com/moxximod/loading-gif.gif" class="loading">
        </div>
    </div>
    `


    const f = profileData.faction == "None" ? "" : profileData.faction;
    const fColor = f == "Vordyn" ? `<font color="#ffb7f1">` : f == "Delruk" ? `<font color="#f6b861">` : f == "Alvar" ? `<font color="#b7d9fb">` : "";
    document.querySelector("#box1").innerHTML =
    `<div class="top-bar widget" onmouseover="statspopup(event,'<b>Experience needed to level: ${profileData.tolevel.toLocaleString()}<b>')" onmouseout="kill()"><div id="experienceFill"></div></div>` +
    `<h4>${profileData.name}</h4>` +
    `<b>${fColor} Level ${profileData.level} ${f} ${profileData.class} </font></b><br>` +
    `<b>Thank you for using MoxxiMod v${GM_info.script.version}</b><br>` +
    `<span id="mmInstalls"><img src="https://studiomoxxi.com/moxximod/loading-gif.gif" height="18px" width="18px"></span>`


    document.querySelector("#box2").innerHTML =
    `<div class="top-bar widget" onmouseover="statspopup(event,'<b>Strength: ${strength}%<b>')" onmouseout="kill()"><div id="strengthFill"></div></div>` +
    `<h6>Skills & Potions</h6>` +
    `<div id="skillsDiv">${profileData.skills.images.join('')}</div>`


    document.querySelector("#box3").innerHTML = profileData.thedude;


    const rows = [];
    const shouts = [...shoutBox.querySelectorAll("li")].reverse();
    for (const shout of shouts){
        const shouter = shout.outerHTML.match(/<a href="\/profile\?id=[0-9]+">.*?<\/a>/i);
        const time = shout.innerHTML.match(/<small>.*?<\/small>/i);
        const msg = shout.querySelector("span").innerHTML;
        rows.push(`<tr><td>${shouter} ${time}<br>${msg}</td></tr>`);
    };
    document.querySelector("#box4").innerHTML =
    `<div class="shoutbox-container">` +
    `<table id="shoutboxTable">` +
    rows.join('') +
    `</table>` +
    `<div id="shoutInput"><input id="shoutText" autocomplete="off"><button id="shoutPost">SEND</button></div>` +
    `</div>`


    const fetchNews = await superfetch('news');
    const parse = new DOMParser();
    const news = parse.parseFromString(fetchNews, 'text/html');
    const newsHeader = news.querySelector("#content-header-row > div > div:nth-child(1) > div.widget-header > div > div > b").innerHTML
    const newsContent = news.querySelector("#content-header-row > div > div:nth-child(1) > div.widget-content.widget-content-area.newstext").innerHTML.replace(/<br><br>[\n\r]<img border="0" src="[^"]*">/i,'')
    document.querySelector("#box9").innerHTML =
    `<h6 class>Outwar News</h6>` +
    `${newsHeader}<br><br>` +
    `${newsContent}<br><br>` +
    `<a href="news">More News</a>`


    buildRankings();
    async function buildRankings(){
        const endPoints = ["char_power","char_elepower","char_chaos"];
        const uniqueIds = [];
        for (const endPoint of endPoints){
            const fetch = await superfetch(`ajax/rankings.php?type=${endPoint}`);
            const parse = JSON.parse(fetch);
            const results = parse.results;
            for (const result of results){
                const charId = result.id;
                if (!uniqueIds.includes(charId)){
                    uniqueIds.push(charId);
                };
            };
        };
        const obj = { "alvar": [], "delruk": [], "vordyn": [], "none": [] };
        const crews = [];
        const crewIds = [];
        const loopIds = async (id) => {
            const profileData = await superfetchProfile(`profile?id=${id}`);
            const name = profileData.name;
            const ele = profileData.elemental;
            const power = profileData.power;
            const chaos = profileData.chaos;
            const faction = profileData.faction.toLowerCase();
            const loyalty = profileData.loyalty;
            const crewId = profileData.crewid;
            obj[faction].push({ "name": name, "id": id, "loyalty": loyalty, "ele": ele, "power": power, "chaos": chaos, "crewId": crewId });
            if (!crewIds.includes(crewId)){
                crewIds.push(crewId);
            };
        };
        await Promise.all(uniqueIds.map(loopIds));
        const loopCrews = async (id) => {
            const crewProfile = await superfetch(`crew_profile?id=${id}`);
            const crewImg = crewProfile.match(/https:\/\/upload\.outwar\.com\/crewuploaded\/[A-Za-z][0-9]+\.[A-Za-z]+/i)?.[0];
            crews.push({"crewId": id, "crewImg": crewImg });
        };
        await Promise.all(crewIds.map(loopCrews));
        const top10a = obj["alvar"].sort((a, b) => b.loyalty - a.loyalty || b.ele - a.ele).slice(0, 15);
        const rowsAlvar = [];
        top10a.forEach((char, index) => {
            const name = char.name;
            const id = char.id;
            const loyalty = char.loyalty;
            const ele = char.ele.toLocaleString();
            const crewId = char.crewId;
            const crewImg = crewId == 0 ? "" : `<img src="${crews.find(i => i.crewId == crewId).crewImg}" class="crew-img">`;
            rowsAlvar.push(`<tr><td>${index+1}</td><td><a href="profile?id=${id}">${name}</a></td><td>${loyalty}</td><td>${ele}</td><td>${crewImg}</td></tr>`);
        });
        const top10d = obj["delruk"].sort((a, b) => b.loyalty - a.loyalty || b.power - a.power).slice(0, 15);
        const rowsDelruk = [];
        top10d.forEach((char, index) => {
            const name = char.name;
            const id = char.id;
            const loyalty = char.loyalty;
            const power = char.power.toLocaleString();
            const crewId = char.crewId;
            const crewImg = crewId == 0 ? "" : `<img src="${crews.find(i => i.crewId == crewId).crewImg}" class="crew-img">`;
            rowsDelruk.push(`<tr><td>${index+1}</td><td><a href="profile?id=${id}">${name}</a></td><td>${loyalty}</td><td>${power}</td><td>${crewImg}</td></tr>`);
        });
        const top10v = obj["vordyn"].sort((a, b) => b.loyalty - a.loyalty || b.chaos - a.chaos).slice(0, 15);
        const rowsVordyn = [];
        top10v.forEach((char, index) => {
            const name = char.name;
            const id = char.id;
            const loyalty = char.loyalty;
            const chaos = char.chaos.toLocaleString();
            const crewId = char.crewId;
            const crewImg = crewId == 0 ? "" : `<img src="${crews.find(i => i.crewId == crewId).crewImg}" class="crew-img">`;
            rowsVordyn.push(`<tr><td>${index+1}</td><td><a href="profile?id=${id}">${name}</a></td><td>${loyalty}</td><td>${chaos}</td><td>${crewImg}</td></tr>`);
        });
        document.querySelector("#box6").innerHTML =
        `<img src="https://studiomoxxi.com/moxxibots/factions/a.png" class="small-faction"><h7>Alvar Top-15</h7>` +
        `<table class="rankings-table"><thead><tr><th></th><th>PLAYER</th><th>LOY</th><th>ELEMENTAL</th><th></th></tr></thead>${rowsAlvar.join('')}</table>`
        document.querySelector("#box7").innerHTML =
        `<img src="https://studiomoxxi.com/moxxibots/factions/d.png" class="small-faction"><h7>Delruk Top-15</h7>` +
        `<table class="rankings-table"><thead><tr><th></th><th>PLAYER</th><th>LOY</th><th>POWER</th><th></th></tr></thead>${rowsDelruk.join('')}</table>`
        document.querySelector("#box8").innerHTML =
        `<img src="https://studiomoxxi.com/moxxibots/factions/v.png" class="small-faction"><h7>Vordyn Top-15</h7>` +
        `<table class="rankings-table"><thead><tr><th></th><th>PLAYER</th><th>LOY</th><th>CHAOS</th><th></th></tr></thead>${rowsVordyn.join('')}</table>`
    };

    greasy();
    async function greasy(){
        const fork = await superfetch('https://greasyfork.org/en/users/907800-studiomoxxi');
        const dailyInstalls = fork.match(/<dd class="script-list-daily-installs"><span>([0-9]+)<\/span><\/dd>/i)[1]
        const totalInstalls = fork.match(/<dd class="script-list-total-installs"><span>([0-9]+)<\/span><\/dd>/i)[1]
        document.querySelector("#mmInstalls").innerHTML = `
            Total installs: ${totalInstalls}
        `
    };


    document.querySelector("#shoutPost").addEventListener('click', async ()=> {
        const value = document.querySelector("#shoutText").value.replace(/ /g,'+');
        const bodyPreview = `message=${value}&preview=Preview`;
        const previewPost = await superpost(`homepost`, bodyPreview);
        if (previewPost.match('Your message is too short')){
            alert('ERROR: Your message is too short');
            return;
        };
        if (previewPost.match('Your message is too long')){
            alert('ERROR: Your message is too long');
            return;
        };
        const post = previewPost.match(/<i>Your message \(will cost <b>.*?<\/b> points\)<\/i><br><hr>.*?<hr><p>/i);
        if (!post){
            alert ('ERROR: Unknown');
            return;
        };
        const postNonce = previewPost.match(/name="form-nonce" value="([^"]*)"/i)[1];
        const postCost = post[0].match(/<b>(.*?)<\/b>/)[1];
        const postContent = post[0].match(/<hr>(.*?)<hr>/)[1];
        const confirmPost = confirm(`Your message will cost ${postCost} points to post: ${postContent}`);
        if (confirmPost){
            const bodySubmit = `message=${value}&form-nonce=${postNonce}&submit=Submit`;
            await superpost(`homepost`, bodySubmit);
            window.location.href = "home";
        };
    });

};


async function world(profileData,server){
    let roomnum = document.querySelector("#roomid_display").innerHTML;
    if (document.querySelector("#mapHtml").innerHTML){
        await worldApply(profileData,server);
        await worldPathFollower();
    };
    const targetNode = document.querySelector("#mapHtml");

    async function contentChangeCallback(mutations) {
        if (roomnum != document.querySelector("#roomid_display").innerHTML){
            roomnum = document.querySelector("#roomid_display").innerHTML
            worldApply(profileData,server);
        };
        await worldPathFollower();
    };
    const observer = new MutationObserver(contentChangeCallback);
    observer.observe(targetNode, { childList: true, subtree: true });
};

async function worldApply(profileData,server){
    const profilepic = profileData.profilepic;

    GM_addStyle(`
        body{overflow-y: scroll;}
        #content{display:none !important;}
        #mapTable{box-shadow: 0 0 5px rgba(255, 255, 255, 1);border-radius: 20px !important;}
        td.map-tile > div {height:44px !important;width:44px !important;}
        td.map-tile {background-size: cover !important;}
        #new-content{position:relative;width:50%;flex-grow:8;margin-top:130px;margin-bottom:0;margin-left:212px;max-width:1300px;transition: .6s;}
        img[src*="YAH.gif"] {margin-top:8px !important;height:25px;width:25px;content: url("${profilepic}") !important;border-radius:10px;box-shadow:0 5px 5px 0 rgba(0,0,0,1) !important;animation: player-icon 1s infinite;}
        @keyframes player-icon{0% {filter: saturate(100%);} 50% {filter: saturate(250%); } 100% {filter: saturate(100%);}}
        img[src*="owpath.png"] {margin-top:5px !important;height:35px;width:35px;}
        .w-3{-ms-flex: 0 0 27%;flex: 0 0 27%;max-width: 27%;}
        .w-4{-ms-flex: 46%;flex: 0 0 46%;max-width: 46%;}
        #liveWorld{width:100%;font-size:16px;cursor:pointer;font-family:monospace;height:50px;}
        #liveSearch{width:100%;font-size:16px;font-family:monospace;height:50px;}
        .mob-win{border: 1px solid #32CD32 !important;}
        .mob-loss{border: 1px solid #FF0000 !important;}
        #worldSkillsDiv > img {height: 20px;width: 20px;margin: 4px;border-radius: 5px;box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);background: #000000;cursor: pointer;transition: .5s ease-out;}
        .findMobAndAtkAll {padding:2px;border-top-left-radius: inherit;border-top-right-radius:inherit;font-size:16px;font-weight:700;cursor:pointer;letter-spacing:2px;}
        #questLinks{margin-bottom:1rem;}
        #questInfoDiv{position:fixed;transform:translate(-50%, -50%);top:50%;left:50%;width:768px;height:80%;transition:opacity 0.25s ease;}
        #sb-container{display:none !important;}
        #questFrame{transition: .35s ease;height:0px;border-radius:10px;}
        img.world-directional{height:30px;width:30px;margin-right:10px;margin-left:10px;}
        #levelUpDiv{background-image: url("landing/levelupbg.jpg");}
        #qHelp{position:absolute;bottom:1rem;right:1rem;}
        #quest_helper_content{height:400px;width:600px;overflow:auto;}
        #questHelperDiv{text-align:left;max-height:350px;overflow:auto;}
    `)

    const map = document.querySelector("#mapHtml").innerHTML.replace(/td style/g,'td class="map-tile" style').replace('table','table id="mapTable"')
    const num = document.querySelector("#roomid_display").innerHTML
    const name = document.querySelector("#span_roomName").innerHTML.replace(/-/g,'');
    const mobs = document.querySelector("#roomDetails").innerHTML.replace(/<h6 class="[^"]*" style="[^"]*"><a rel="[^"]*" class="sbox" href="[^"]*">/g,`<h6 class="spawnTitle text-left" style="letter-spacing:inherit">`);

    const eq = profileData.thedude;
    const proPic = profileData.profilepic;

    const skills = profileData.skills.images || [];

    if (!document.querySelector("#new-content")){
        var newContent = document.createElement('div');
        newContent.id = 'new-content';
        var containerDiv = document.getElementById('container');
        var firstChild = containerDiv.firstChild;
        containerDiv.insertBefore(newContent, firstChild);
    };

    document.querySelector("#new-content").innerHTML = `
        <div class="row justify-content-center">
        <div class="w-3 col-lg-6 col-md-6 col-sm-12 col-12 layout-spacing px-1" style="min-width:355px">
        <div class="widget mb-2">
        ${map}<br>
        <h5>${name} [${num}]</h5>
        <i>click on the map to move rooms<br><br></i>
        <button class="btn-mm" id="pathFollowBtn">MOVE</button>
        <button class="btn-mm" href="javascript:void(0);" id="questHelper">QUESTS</button>
        </div>
        <div class="mb-2" id="questHelperDiv">
        </div>
        </div>
        <div class="w-4 col-lg-6 col-md-6 col-sm-12 col-12 layout-spacing px-1">
        <div class="widget mb-2" style="padding:5px;">
        <div id="liveSpan" style="display:flex;justify-content:center;"><input id="liveWorld" type="text" class="form-control-new" autocomplete="off""></div>
        </div>
        <div class="widget mb-2" id="mobList">
        <div id="findMobDiv" class="list-group-item list-group-item-action spawnRow findMobAndAtkAll" style="width:calc(33% - 3px);display:inline-block;">FIND MOB</div>
        <div id="atkAllDiv" class="list-group-item list-group-item-action spawnRow findMobAndAtkAll" style="width:calc(33% - 3px);display:inline-block;">ATK ALL</div>
        <div id="room11" class="list-group-item list-group-item-action spawnRow findMobAndAtkAll" style="width:calc(33% - 3px);display:inline-block;">ROOM 11</div>
        <span id="mobSpan">${mobs}</span>
        </div>
        </div>
        <div class="w-3 col-lg-6 col-md-6 col-sm-12 col-12 layout-spacing px-1" style="min-width:355px" id="worldRightColumn">
        <div class="widget mb-2" id="worldSkillsDiv" style="padding:10px">
        <h6>Active Skills & Potions</h6>
        <div id="hasteDiv" style="padding-bottom:10px"><img src="https://studiomoxxi.com/moxximod/loading-gif.gif" height="20px" width="20px"></div>
        ${skills.join('')}
        </div>
        <div class="widget mb-2">
        ${eq}
        </div>
        </div>
    `

    const mapTiles = document.querySelectorAll(".map-tile");
    mapTiles[17].addEventListener('click',async function(){gotoRoom(northRoom,curRoom)});
    mapTiles[23].addEventListener('click',async function(){gotoRoom(westRoom,curRoom)});
    mapTiles[24].id = "currentRoomTile"
    mapTiles[25].addEventListener('click',async function(){gotoRoom(eastRoom,curRoom)});
    mapTiles[31].addEventListener('click',async function(){gotoRoom(southRoom,curRoom)});
    mapTiles[17].style.cursor = "pointer"
    mapTiles[23].style.cursor = "pointer"
    mapTiles[25].style.cursor = "pointer"
    mapTiles[31].style.cursor = "pointer"

    const atkLinks = document.querySelectorAll("#mobSpan > ul > li > div > div > a[href*='attackid']");
    if (atkLinks.length > 0){
        const atkIds = [];
        atkLinks.forEach(function(atk){
            const atkid = atk.href.match(/attackid=[A-Za-z0-9]+/i);
            let atkUrl = `somethingelse.php?${atkid}`

            if (atk.href.match('userspawn=1')){
                atkUrl += '&userspawn=1'
            };
            atkIds.push(atkid);
            atk.href = "javascript:void(0);"
            atk.removeAttribute('target')

            atk.addEventListener('click', async function(){

                const attack = await superfetch(atkUrl,true);
                const mobName = attack.match(/var defender_name = "([^"]*)"/i)[1];
                const mobHp = parseInt(attack.match(/defender_health_start = ([0-9]+)/i)[1]);
                const mobBaseDmgTaken = (attack.match(/defender_taken\[[0-9]+\] = '[0-9]+'/g) || []).reduce((sum, match) => sum + parseInt(match.match(/'([0-9]+)'/)[1]), 0);
                const mobHolyDmgTaken = (attack.match(/defender_elemental_taken\[[0-9]+\]\[[0-9]+\] = new Damage\([0-9]+, 'holy'\)/g) || []).reduce((sum, match) => sum + parseInt(match.match(/\(([0-9]+)/)[1]), 0);
                const mobArcnDmgTaken = (attack.match(/defender_elemental_taken\[[0-9]+\]\[[0-9]+\] = new Damage\([0-9]+, 'arcane'\)/g) || []).reduce((sum, match) => sum + parseInt(match.match(/\(([0-9]+)/)[1]), 0);
                const mobShadDmgTaken = (attack.match(/defender_elemental_taken\[[0-9]+\]\[[0-9]+\] = new Damage\([0-9]+, 'shadow'\)/g) || []).reduce((sum, match) => sum + parseInt(match.match(/\(([0-9]+)/)[1]), 0);
                const mobFireDmgTaken = (attack.match(/defender_elemental_taken\[[0-9]+\]\[[0-9]+\] = new Damage\([0-9]+, 'fire'\)/g) || []).reduce((sum, match) => sum + parseInt(match.match(/\(([0-9]+)/)[1]), 0);
                const mobKinkDmgTaken = (attack.match(/defender_elemental_taken\[[0-9]+\]\[[0-9]+\] = new Damage\([0-9]+, 'kinetic'\)/g) || []).reduce((sum, match) => sum + parseInt(match.match(/\(([0-9]+)/)[1]), 0);
                const mobChosDmgTaken = (attack.match(/defender_elemental_taken\[[0-9]+\]\[[0-9]+\] = new Damage\([0-9]+, 'chaos'\)/g) || []).reduce((sum, match) => sum + parseInt(match.match(/\(([0-9]+)/)[1]), 0);
                const mobRemainingHp = Math.max((mobHp-mobBaseDmgTaken-mobHolyDmgTaken-mobArcnDmgTaken-mobShadDmgTaken-mobFireDmgTaken-mobKinkDmgTaken-mobChosDmgTaken),0);
                const mobPic = atk.parentNode.parentNode.parentNode.querySelector('img.spawnImage').outerHTML.match(/src="([^"]*)"/i)[1];

                let liveTxt = ''
                let liveClass;
                if (attack.match(/var successful = 1/i)){
                    liveClass = 'mob-win';
                    liveTxt += `Won vs ${mobName}`

                    if (attack.match('steps out of the shadows')){
                        window.location.href = 'world'
                    };

                    if (attack.match(/<b>WIN: Found .*?<\/b>/i)){
                        const item = attack.match(/<b>WIN: Found (.*?)<\/b>/i)[1]
                        liveTxt += ` found ${item}!`
                    };

                    if (attack.match(/<\/b>[0-9]+\/[0-9]+ killed<br>/i)){
                        const count = attack.match(/<\/b>([0-9]+\/[0-9]+) killed<br>/i)[1]
                        liveTxt += ` ${count} killed`
                    };
                    liveTxt += ' (click for info)'
                    atk.parentNode.parentNode.parentNode.remove();
                } else {
                    liveClass = 'mob-loss'
                    liveTxt += `Lost vs ${mobName}: ${(mobRemainingHp/mobHp*100).toFixed(2)}% (click for info)`
                };

                document.querySelector("#liveSpan").innerHTML = `<input id="liveWorld" type="text" class="${liveClass} form-control-new" autocomplete="off" value="${liveTxt}">`
                document.querySelector("#liveWorld").addEventListener('click', async function(){ await worldMobAtkInfo(attack,proPic,mobPic) });
            });
        });

        document.querySelector("#atkAllDiv").addEventListener('click', async function(){
            await loadingOverlay();
            for (let i = 0; i < atkIds.length; i++) {
                const atkid = atkIds[i];
                await superfetch(`somethingelse.php?${atkid}`);
            };
            window.location.href = 'world';
        });
    };
    if (mobs.length <= 58){
        document.querySelector("#liveWorld").value = "No mobs found in this room"
    };

    const qLinks = document.querySelectorAll('#mobSpan img[src="/landing/questicon.png"]');
    if (qLinks.length > 0){

        qLinks.forEach(function(q){
            const talk = q.parentNode.outerHTML.match(/href="([^"]*)"/i)[1].replace(/amp;/g,'');
            q.parentNode.href = "javascript:void(0);"
            q.addEventListener('click', mobTalk);

            async function mobTalk(){
                const mob = await superfetch(talk,true);
                const quests = mob.replace(/\.php/g,'').match(/<a href="mob_talk\?id=[0-9]+&stepid=[0-9]+&userspawn=.*?&questid=[0-9]+"><img border="0" src="\/images\/button_quest_up\.gif" hspace="2" align="absmiddle"><font size="3"><b>.*?<\/b><\/font><\/a>/g).map(q => q.replace('<img border=\"0\" src=\"/images/button_quest_up.gif\" hspace=\"2\" align=\"absmiddle\">','').replace(/<a href/g,'<span class="questLink" style="cursor:pointer;" alt').replace(/<\/a>/,'</span>'));
                document.querySelector("#liveSpan").innerHTML = `
                <div id="questLinks" style="margin-top:1rem;">
                <h5>Available Quests</h5><br>
                ${quests.join('<br>')}
                </div>
                `

                const linkArray = document.querySelectorAll('.questLink');
                linkArray.forEach(function(quest){
                    quest.addEventListener('click', async function(){
                        const questLink = quest.outerHTML.match(/alt="([^"]*)"/i)[1].replace(/amp;/g,'');
                        document.querySelector("#liveSpan").innerHTML = `
                        <iframe src="${questLink}" tabindex="-1" id="questFrame" style="border:0px #ffffff none;opacity:0;" scrolling="no" frameborder="1" marginheight="0px" height="500px" width="100%"></iframe>
                        <div id="qHelp"></div>
                        `
                        document.getElementById('questFrame').addEventListener('load', function() {

                            const iframe = document.querySelector("#questFrame");
                            if (iframe) {

                                iframe.style.opacity = '1';

                                var backLink = iframe.contentDocument.querySelector('a[href*="mob.php?id="]');
                                if (backLink) {
                                    backLink.href = "javascript:void(0);"
                                    backLink.addEventListener('click', mobTalk)
                                };

                                const content = iframe.contentDocument.querySelector("#content-header-row")
                                if (content){
                                    content.setAttribute('style','margin-top:0px;')
                                };

                                const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                                iframe.style.height = iframeDocument.body.scrollHeight + 'px';
                            };

                            const questId = questLink.match(/questid=([0-9]+)/i)[1];
                            document.querySelector("#qHelp").innerHTML = `
                                <a href="javascript:void(0);" id="qHelpBtn">
                                <img src="images/questwiki.jpg" onmouseover="statspopup(event,'Quest Helper')" onmouseout="kill()">
                                </a>
                            `
                            document.querySelector("#qHelpBtn").addEventListener('click', async function(){
                                const quest = await superfetch(`show_quest.php?quest=${questId}`)
                                createWindow("Quest Helper", "quest_helper", 600, 250, 0);
                                document.querySelector("#quest_helper_content").innerHTML = quest.replace(/solid #ffffff/g,'solid #333333')
                            });
                        });
                    });
                });
            };
        });
    };

    const haste = await superfetch('skills_info.php?id=3024');

    if (haste.match(/value="Cast Skill"/i)){
        document.querySelector("#hasteDiv").innerHTML = `<a href="javascript:void(0);" id="castHaste">Click to Cast Haste</a>`
        document.querySelector("#castHaste").addEventListener('click', async function(){
            await superpost('cast_skills.php?C=4','castskillid=3024&cast=Cast+Skill');
            window.location.href = 'world'
        });

    } else if (haste.match(/This skill is recharging\. [0-9]+ minutes remaining\./i)){
        const time = haste.match(/This skill is recharging\. ([0-9]+) minutes remaining\./i)[1]
        document.querySelector("#hasteDiv").innerHTML = `Haste is ready in ${time} minutes`

    } else if (haste.match(/You have not learned this skill yet/i)){
        document.querySelector("#hasteDiv").innerHTML = `Haste is not trained`
    };

    document.querySelector("#questHelper").addEventListener('click', function(){
        const quests = document.querySelector(".widget.widget-chart-two").innerHTML
        document.querySelector("#questHelperDiv").outerHTML = `<div class="widget" id="questHelperDiv"><a href="javascript:void(0)" id="hideAllQuests">Hide All Quests</a>` + quests.replace(/<div id="mobsearch" style="font-weight: bold; text-align: center; margin-top: 10px;"><a id="[^"]*" href="#"><img src="[^"]*" onmouseover="[^"]*" onmouseout="[^"]*" border="0"><\/a><\/div>/i,'').replace(/<h5 class="">QUEST HELPER <\/h5>/i,'') + "</div>"

        document.querySelector("#hideAllQuests").addEventListener('click', async ()=> {
            await loadingOverlay();
            const questIds = document.body.innerHTML.match(/quest-[0-9]+/g).map(i => i.match(/[0-9]+/)[0]);
            const hideQuests = async (id) => {
                const url ="ajax/ajax_questlogaction.php";
                const body = `hide=${id}`;
                await superpost(url, body);
            };
            await Promise.all(questIds.map(hideQuests));
            window.location.href = "world";
        });
    });

    document.querySelector("#room11").addEventListener('click', function(){
        window.location.href = "world.php?room=11";
    });

    document.querySelector("#findMobDiv").addEventListener('click', function(){

        document.querySelector("#liveSpan").innerHTML = `
        <input id="liveSearch" type="text" class="form-control-new" autocomplete="off" placeholder="Enter mob name...">
        <button class="btn-mm" id="mobSearchBtn">SEARCH</button>
        `
        document.querySelector("#liveSearch").select();

        document.querySelector("#mobSearchBtn").addEventListener('click', worldMobSearch);
        document.querySelector("#liveSearch").addEventListener("keydown", function(event) { if (event.key === "Enter") { worldMobSearch() } });

        async function worldMobSearch(){
            const searchInput = document.querySelector("#liveSearch").value.replace(/ /g,'+');
            const mobSearch = await superfetch(`https://${server}.outwar.com/mob_search.php?searchterm=${searchInput}`);
            document.querySelector("#liveSpan").innerHTML = mobSearch.replace(/href/g,'alt');
            const searchResults = document.querySelectorAll("#return_data > p > a");
            searchResults.forEach(async r => {
                r.setAttribute('style','cursor:pointer;')
                r.addEventListener('click', async function(){
                    const apply = r.outerHTML.match(/alt="([^"]*)"/i)[1];
                    await superfetch(apply);
                    window.location.href = 'world';
                });
            });
        };
    });

    var levelup = window.getComputedStyle(document.querySelector("#levelup")).getPropertyValue("display");
    if (levelup == "block"){
        var worldRightColumn = document.getElementById("worldRightColumn");
        var newDiv = document.createElement("div");
        newDiv.classList.add('widget');
        newDiv.classList.add('mb-2');
        newDiv.id = "levelUpDiv"
        newDiv.innerHTML = `
            <img src="landing/levelupcenter.jpg" style="height:100%;width:100%;border-radius:8px;cursor:pointer;" id="lvlUpBtn">
        `;
        worldRightColumn.insertBefore(newDiv, worldRightColumn.firstChild);
        document.querySelector("#lvlUpBtn").addEventListener('click',async function(){
            const check = confirm('Are you sure you want to level up?');
            if (check){
                await superfetch('levelup');
                window.location.href = 'world';
            };
        });
    };
};

async function worldPathFollower(){

    const originalFetch = window.fetch;
    const originalXHR = XMLHttpRequest.prototype.open;
    const targetRegex = /quest_help\.php|mob_search\.php\?target=\d+/;
    function intercept(url) {
        if (targetRegex.test(url)) {
            GM_setValue('pathBuildingUrl', url);
        };
    };
    window.fetch = new Proxy(originalFetch, {
        apply(target, thisArg, args) {
            intercept(args[0]);
            return Reflect.apply(target, thisArg, args);
        }
    });
    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        intercept(url);
        return originalXHR.apply(this, [method, url, ...rest]);
    };

    const ajax = await superfetch('ajax_changeroomb', true);

    if (ajax.match(/"questHelpData":"[^"]*"/i)){

        GM_addStyle(`
            @keyframes glow {
            0% {box-shadow: 0 0 0px rgba(255, 255, 255, 0.0);}
            2% {box-shadow: 0 0 0px rgba(255, 255, 255, 0.25);}
            50% {box-shadow: 0 0 10px rgb(255, 255, 255);}
            98% {box-shadow: 0 0 0px rgba(255, 255, 255, 0.25);}
            100% {box-shadow: 0 0 0px rgba(255, 255, 255, 0.0);}
            }
            .path-follow-pulse {animation: glow 2.5s infinite;}
        `)
        document.querySelector("#pathFollowBtn").classList.add("path-follow-pulse")

        document.querySelector("#pathFollowBtn").addEventListener('click', async () => {
            const string = await mmplus('AuthCheck|rganame');
            if (!string.match('Full')){ return; };
            await loadingOverlay();
            await pathMove(ajax);
        });

        async function pathMove(ajax){
            const direction = ajax.match(/"questHelpData":"dpadcenter_(.*?).jpg"/i)[1];
            const regex = new RegExp(`"${direction}":"([0-9]+)"`);
            const nextRoom = ajax.match(regex)[1];
            const move = await superfetch(`ajax_changeroomb.php?room=${nextRoom}`, true);

            if (move.match('teleport to your home bar')){
                window.location.href = window.location;
            };

            if (move.match(/"questHelpData":"[^"]*"/i)){
                await pathMove(move);
            } else {
                const success = move.match(/"3_3":\{"qm":3,"image":[0-9]+\}/i) ? true : false;
                if (success){
                    GM_deleteValue('pathBuildingUrl');
                    window.location.href = window.location;
                } else {

                    document.querySelector("#loadingOverlayText").innerHTML = 'Outwar pathing failed. Resending the request to build a path and trying again.'
                    let attempt = 1;
                    await rebuildPath();
                    async function rebuildPath(){
                        attempt += 1;
                        const pathBuildingUrl = GM_getValue('pathBuildingUrl');
                        await superfetch(pathBuildingUrl);
                        const ajaxNew = await superfetch('ajax_changeroomb', true);
                        if (ajaxNew.match(/"questHelpData":"[^"]*"/i)){
                            await pathMove(ajaxNew);
                        } else if (attempt <= 10){
                            rebuildPath();
                        } else {

                            window.location.href = window.location;
                        };
                    };
                };
            };
        };
    };
};

async function worldMobAtkInfo(attack,proPic,mobPic){

    GM_addStyle(`
        #container{transition: opacity 0.25s ease;}
        #atkInfoDiv{position:fixed;transform:translate(-50%, -25%);top:25%;left:50%;width:768px;height:80%;transition:opacity 0.25s ease;}
        .atk-info-widget{width:45%;display:inline-block;margin:1rem;height:100%;overflow:auto;}
        img.info-img{width:300px;height:150px;box-shadow: 0 0 5px rgba(255, 255, 255, 1);}
    `)

    const plrHp = parseInt(attack.match(/var attacker_health_start = ([0-9]+)/i)[1]);
    const mobHp = parseInt(attack.match(/var defender_health_start = ([0-9]+)/i)[1]);
    const plrBaseDmgTaken = (attack.match(/attacker_taken\[[0-9]+\] = '[0-9]+'/g) || []).reduce((sum, match) => sum + parseInt(match.match(/'([0-9]+)'/)[1]), 0);
    const plrHolyDmgTaken = (attack.match(/attacker_elemental_taken\[[0-9]+\]\[[0-9]+\] = new Damage\([0-9]+, 'holy'\)/g) || []).reduce((sum, match) => sum + parseInt(match.match(/\(([0-9]+)/)[1]), 0);
    const plrArcnDmgTaken = (attack.match(/attacker_elemental_taken\[[0-9]+\]\[[0-9]+\] = new Damage\([0-9]+, 'arcane'\)/g) || []).reduce((sum, match) => sum + parseInt(match.match(/\(([0-9]+)/)[1]), 0);
    const plrShadDmgTaken = (attack.match(/attacker_elemental_taken\[[0-9]+\]\[[0-9]+\] = new Damage\([0-9]+, 'shadow'\)/g) || []).reduce((sum, match) => sum + parseInt(match.match(/\(([0-9]+)/)[1]), 0);
    const plrFireDmgTaken = (attack.match(/attacker_elemental_taken\[[0-9]+\]\[[0-9]+\] = new Damage\([0-9]+, 'fire'\)/g) || []).reduce((sum, match) => sum + parseInt(match.match(/\(([0-9]+)/)[1]), 0);
    const plrKinkDmgTaken = (attack.match(/attacker_elemental_taken\[[0-9]+\]\[[0-9]+\] = new Damage\([0-9]+, 'kinetic'\)/g) || []).reduce((sum, match) => sum + parseInt(match.match(/\(([0-9]+)/)[1]), 0);
    const plrChosDmgTaken = (attack.match(/attacker_elemental_taken\[[0-9]+\]\[[0-9]+\] = new Damage\([0-9]+, 'chaos'\)/g) || []).reduce((sum, match) => sum + parseInt(match.match(/\(([0-9]+)/)[1]), 0);
    const plrRemainingHp = Math.max((plrHp-plrBaseDmgTaken-plrHolyDmgTaken-plrArcnDmgTaken-plrShadDmgTaken-plrFireDmgTaken-plrKinkDmgTaken-plrChosDmgTaken),0);
    const mobBaseDmgTaken = (attack.match(/defender_taken\[[0-9]+\] = '[0-9]+'/g) || []).reduce((sum, match) => sum + parseInt(match.match(/'([0-9]+)'/)[1]), 0);
    const mobHolyDmgTaken = (attack.match(/defender_elemental_taken\[[0-9]+\]\[[0-9]+\] = new Damage\([0-9]+, 'holy'\)/g) || []).reduce((sum, match) => sum + parseInt(match.match(/\(([0-9]+)/)[1]), 0);
    const mobArcnDmgTaken = (attack.match(/defender_elemental_taken\[[0-9]+\]\[[0-9]+\] = new Damage\([0-9]+, 'arcane'\)/g) || []).reduce((sum, match) => sum + parseInt(match.match(/\(([0-9]+)/)[1]), 0);
    const mobShadDmgTaken = (attack.match(/defender_elemental_taken\[[0-9]+\]\[[0-9]+\] = new Damage\([0-9]+, 'shadow'\)/g) || []).reduce((sum, match) => sum + parseInt(match.match(/\(([0-9]+)/)[1]), 0);
    const mobFireDmgTaken = (attack.match(/defender_elemental_taken\[[0-9]+\]\[[0-9]+\] = new Damage\([0-9]+, 'fire'\)/g) || []).reduce((sum, match) => sum + parseInt(match.match(/\(([0-9]+)/)[1]), 0);
    const mobKinkDmgTaken = (attack.match(/defender_elemental_taken\[[0-9]+\]\[[0-9]+\] = new Damage\([0-9]+, 'kinetic'\)/g) || []).reduce((sum, match) => sum + parseInt(match.match(/\(([0-9]+)/)[1]), 0);
    const mobChosDmgTaken = (attack.match(/defender_elemental_taken\[[0-9]+\]\[[0-9]+\] = new Damage\([0-9]+, 'chaos'\)/g) || []).reduce((sum, match) => sum + parseInt(match.match(/\(([0-9]+)/)[1]), 0);
    const mobRemainingHp = Math.max((mobHp-mobBaseDmgTaken-mobHolyDmgTaken-mobArcnDmgTaken-mobShadDmgTaken-mobFireDmgTaken-mobKinkDmgTaken-mobChosDmgTaken),0);
    const plrBLocks = attack.match(/attacker_taken\[[0-9]+\] = 'block'/) ? attack.match(/attacker_taken\[[0-9]+\] = 'block'/g).length : 0;

    const parser = new DOMParser();
    const dom = parser.parseFromString(attack, 'text/html');
    const factionBoxLeft1 = dom.querySelector('.float-div-left.faction-box-1');
    const factionBoxRight1 = dom.querySelector('.float-div-right.faction-box-1');
    const myLoyalty = factionBoxLeft1 ? parseInt(factionBoxLeft1.innerHTML.match(/([0-9]+) \/ [0-9]+/i)[1]) : 0;
    const maxLoyalty = factionBoxLeft1 ? parseInt(factionBoxLeft1.innerHTML.match(/[0-9]+ \/ ([0-9]+)/i)[1]) : 0;
    const multiplier = factionBoxRight1 ? parseInt(factionBoxRight1.innerHTML.match(/[0-9]+/i)) * 0.01 : 0;
    const loyalty = `${(myLoyalty * multiplier * 100)}% / ${(maxLoyalty * multiplier * 100)}%`

    const content = `
        <div class="widget atk-info-widget">
        <center><img src="${proPic}" class="info-img"></center><br>
        <table class="table table-striped mb-3">
        <tr><td>Starting Hit Points</td><td>${plrHp.toLocaleString()}</td></tr>
        <tr><td>Base Damage Taken</td><td>${plrBaseDmgTaken.toLocaleString()}</td></tr>
        <tr><td><font color="#00FFFF">Holy Damage Taken</font></td><td>${plrHolyDmgTaken.toLocaleString()}</td></tr>
        <tr><td><font color="#FFFF00">Arcane Damage Taken</font></td><td>${plrArcnDmgTaken.toLocaleString()}</td></tr>
        <tr><td><font color="#7e01bc">Shadow Damage Taken</font></td><td>${plrShadDmgTaken.toLocaleString()}</td></tr>
        <tr><td><font color="#FF0000">Fire Damage Taken</font></td><td>${plrFireDmgTaken.toLocaleString()}</td></tr>
        <tr><td><font color="#00FF00">Kinetic Damage Taken</font></td><td>${plrKinkDmgTaken.toLocaleString()}</td></tr>
        <tr><td><font color="#f441be">Chaos Damage Taken</font></td><td>${plrChosDmgTaken.toLocaleString()}</td></tr>
        <tr><td>Hit Points Remaining</td><td>${plrRemainingHp.toLocaleString()}</td></tr>
        <tr><td>Successful Blocks</td><td>${plrBLocks.toLocaleString()}</td></tr>
        <tr><td>Faction Bonus</td><td>${loyalty}</td></tr>
        </table>
        </div>
        <div class="widget atk-info-widget">
        <center><img src="${mobPic}" class="info-img"></center><br>
        <table class="table table-striped">
        <tr><td>Starting Hit Points</td><td>${mobHp.toLocaleString()}</td></tr>
        <tr><td>Base Damage Taken</td><td>${mobBaseDmgTaken.toLocaleString()}</td></tr>
        <tr><td><font color="#00FFFF">Holy Damage Taken</font></td><td>${mobHolyDmgTaken.toLocaleString()}</td></tr>
        <tr><td><font color="#FFFF00">Arcane Damage Taken</font></td><td>${mobArcnDmgTaken.toLocaleString()}</td></tr>
        <tr><td><font color="#7e01bc">Shadow Damage Taken</font></td><td>${mobShadDmgTaken.toLocaleString()}</td></tr>
        <tr><td><font color="#FF0000">Fire Damage Taken</font></td><td>${mobFireDmgTaken.toLocaleString()}</td></tr>
        <tr><td><font color="#00FF00">Kinetic Damage Taken</font></td><td>${mobKinkDmgTaken.toLocaleString()}</td></tr>
        <tr><td><font color="#f441be">Chaos Damage Taken</font></td><td>${mobChosDmgTaken.toLocaleString()}</td></tr>
        <tr><td>Hit Points Remaining</td><td>${mobRemainingHp.toLocaleString()}</td></tr>
        </table>
        </div>
        <a href="javascript:void(0);" id="atkInfoClose">close</a>
    `

    document.querySelector("#container").setAttribute('style','opacity:0.1;')
    let newDiv = document.createElement("div");
    newDiv.id = "atkInfoDiv";
    newDiv.innerHTML = content
    document.body.appendChild(newDiv);

    document.querySelector("#atkInfoClose").addEventListener('click', async function(){
        document.querySelector("#container").setAttribute('style','opacity:1;');
        document.querySelector("#atkInfoDiv").remove();
    });
};

async function moxxiRaider(server,serverNo,rgaName,charId){

    const authCheck = await mmplus('AuthCheck|rganame')
    if (!authCheck.match('Full')){
        alert('Moxxi+ Raider can only be used by MoxxiMod+ subscribers but feel free to look around!');
    };

    GM_addStyle(`
        body {overflow: hidden;}
        #moxxiRaiderOverlay { position: fixed; top: 0;left: 0;width: 100vw;height: 100vh;z-index: 1000;background: #0c0c0c;overflow: hidden;pointer-events: auto;display: flex;flex-direction: column; }
        h4 { color: #32CD32; }
        h5 { margin-left: 10px; }
        .widget { overflow: auto; color:#fffdf7;background-color: #181818 !important; padding: 20px; border-radius: 8px; box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.2); }
        .widget2 { overflow: auto; background-color: #2d2d2d; padding: 20px; border-radius: 8px; box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.2); }
        .btn-mm-raider { background-color: #181818; margin-left:3px; margin-right:3px; padding: .4375rem 1.25rem; font-size: 14px; font-weight: 400; border-radius: 10px; transition: 0.25s ease-out; box-shadow: 0 5px 20x 0 rgba(0,0,0,.1); letter-spacing: 2px; color:#ffffff;width:170px;}
        .btn-mm-raider:hover { opacity: 0.5; }
        #topLineDiv { margin-top: 0.75rem; text-align: center; }
        div.main-content { display: flex; flex: 1; margin-right:4.5rem; height:100%; }
        div.column-3 { flex: 0 0 33.33333333%; max-width: 33.333333%; margin: 0.75rem; }
        div.column-2 { flex: 0 0 50.00000000%; max-width: 50.000000%; margin: 0.75rem; }
        div.column-1 { flex: 0 0 66.66666666%; max-width: 66.666666%; margin: 0.75rem; }
        div.raider-menu-outer { position:fixed; top:0px; left: 0px; width:100%; height:100%; background-color: rgba(0, 0, 0, 0.66); display:none;}
        div.raider-menu-inner { color:#fffdf7; position:fixed; top:5%; left: 5%; width:90%; height:90%; overflow:hidden; }
        div.raider-div { text-align: center; height:98%; }
        div.table-div { height: 98%; overflow: auto; width: 100%; border:1px #2d2d2d SOLID; padding:1rem; background-color:#0c0c0c; box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.2); }
        .mob-selected, .char-selected { color: #32CD32 !important; }
        .deselected { color: #fffdf7 !important; }
        .table-raider > thead > tr > th, .table-raider-groups > thead > tr > th { color: #fffdf7; padding:3px 23px 3px 3px; text-align:left; }
        .table-raider > tbody > tr > td, .table-raider-groups > tbody > tr > td { font-size:14px; padding:3px 23px 3px 3px; text-align:left; }
        .table-raider > tbody > tr, .table-raider-groups > tbody > tr { cursor: pointer; padding: 2px; }
        .table-raider > tbody > tr:hover { opacity: 0.5; transition: 0.25s ease-out; }
        input { background-color: #0c0c0c !important; color: #32CD32; box-shadow: 0 0 3px rgba(0, 0, 0, 0.5); border-radius: 5px; padding:0.25rem 0.25rem 0.25rem 1rem; letter-spacing:1px;font-size:14px;width:13rem;}
        input[readonly] { background-color: #0c0c0c !important; color: #fffdf7; box-shadow: 0 0 3px rgba(0, 0, 0, 0.5); border-radius: 5px; padding:0.25rem 0.25rem 0.25rem 1rem; letter-spacing:1px;font-size:14px;width:13rem;}
        #raidSetupTable > tbody > tr > td { padding:0.25rem 3.5rem 0.25rem 0.5rem; letter-spacing:1px; font-size:14px; }
        img.skill-clickable{ height:50px; width:50px; margin:10px; padding:0px; cursor:pointer; border:3px #475254 SOLID; border-radius:15px;transition: 0.25s ease-out;}
        img.skill-selected{ border:3px #32CD32 SOLID; padding:5px; }
        div.raider-workspace-div{ overflow-wrap: break-word;letter-spacing:1px;line-height:24px;font-size:16px; }
        .flashing{ animation: flashOpacity 1s infinite; }
        @keyframes flashOpacity { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
    `);

    const fakeBody = document.createElement('div');
    fakeBody.id = 'moxxiRaiderOverlay';
    document.documentElement.appendChild(fakeBody);

    document.querySelector("#moxxiRaiderOverlay").innerHTML = `
    <div id="topLineDiv">
        <button class="btn-mm-raider" id="raiderMobsBtn">MOBS</button>
        <button class="btn-mm-raider" id="raiderCharactersBtn">CHARACTERS</button>
        <button class="btn-mm-raider" id="raiderSkillsBtn">SKILLS</button>
        <button class="btn-mm-raider" id="raiderStartBtn">RAID</button>
        <button class="btn-mm-raider" id="raiderExitBtn">EXIT</button>
    </div>
    <div class="main-content">
        <div class="widget column-2">
            <h4>Selected Mobs</h4>
            <div id="selectedMobsDiv" class="raider-workspace-div"></div>
        </div>
        <div class="widget column-2">
            <h4>Selected Characters</h4>
            <div id="selectedCharsDiv" class="raider-workspace-div"></div>
        </div>
    </div>
    <div class="main-content">
        <div class="widget column-2">
            <h4>Selected Skills</h4>
            <div id="selectedSkillsDiv" class="raider-workspace-div"></div>
        </div>
        <div class="widget column-2">
            <h4>Raid Setup</h4>
            <table id="raidSetupTable">
            <tr>
            <td>Crew name</td><td><input id="crewName" class="moxxi-raider-input" readonly></td></tr>
            <td>Characters selected</td><td><input id="selectedCharCount" type="number" class="moxxi-raider-input" value="0" readonly></td></tr>
            <td>Characters needed</td><td><input id="neededCharCount" type="number" class="moxxi-raider-input" value="0" readonly></td></tr>
            <td>Number of wins per mob</td><td><input id="raidQuantity" type="number" class="moxxi-raider-input" value="1"></td></tr>
            <td>Stop after losses</td><td><input id="quitAfterValue" type="number" class="moxxi-raider-input" value="10"></td></tr>
            <td>Prime gods selected</td><td><input id="primeGodsSelected" type="number" class="moxxi-raider-input" value="0" readonly></td></tr>
            <td>Prime caps available</td><td><input id="primeCapsAvailable" type="number" class="moxxi-raider-input" value="0" readonly></td></tr>
            <td>Prime caps needed</td><td><input id="primeCapsNeeded" type="number" class="moxxi-raider-input" value="0" readonly></td></tr>
            </tr>
            </table>
        </div>
    </div>
    <div class="raider-menu-outer" id="raiderMobsBackground"><div id="raiderMobsContainer" class="raider-menu-inner widget2"></div></div>
    <div class="raider-menu-outer" id="raiderCharactersBackground"><div id="raiderCharactersContainer" class="raider-menu-inner widget2"></div></div>
    <div class="raider-menu-outer" id="raiderSkillsBackground"><div id="raiderSkillsContainer" class="raider-menu-inner widget2"></div></div>
    <div class="raider-menu-outer" id="raiderSettingsBackground"><div id="raiderSettingsContainer" class="raider-menu-inner widget2"></div></div>
    `;


    document.querySelector("#raiderExitBtn").addEventListener('click', async () => {
        window.location.href = `home?suid=${charId}`
    });


    document.querySelector("#raiderMobsContainer").innerHTML = `
        <div class="raider-div" id="raiderMobsDiv">
        <img src="https://studiomoxxi.com/moxximod/loading-gif.gif" style="width:100px;height:100px;">
        </div>
        <a href="javascript:void(0);" id="closeMobs" class="raider-close">close mobs</a> | <a href="javascript:void(0);" id="copyMobs">copy selected mobs</a> | <a href="javascript:void(0);" id="mobListSelect">select with list</a>
    `;


    document.querySelector("#raiderMobsBtn").addEventListener('click', async () => {
        document.querySelector("#raiderMobsBackground").style.display = 'revert';
    });


    async function raiderMobs(crewName){

        const primeGodRows = [];
        const primeGods = await superfetch('primegods');
        const parseData = new DOMParser();
        const primeGodsDom = parseData.parseFromString(primeGods, 'text/html');
        const aliveGods = primeGodsDom.querySelectorAll('.mobbox:not(.grey)');
        for (let god of aliveGods){
            const html = god.innerHTML;
            const mobId = html.match(/primegods\?mobid=([0-9]+)/i)[1];
            const mobPage = await superfetch(`primegods?mobid=${mobId}`);

            const charCount = mobPage.match(/Max Members: ([0-9]+)/i)[1];

            const crewKills = mobPage.match(/<b>[0-9]+<\/b>/g) ? mobPage.match(/<b>[0-9]+<\/b>/g).map(i => parseInt(i.match(/[0-9]+/i))) : [0];
            const totalKills = crewKills.reduce((a, b) => a + b, 0);

            const mobName = html.match(/event,'([^']*)'/i)[1].replace(/,/,'');
            const mobImg = html.match(/src="([^"]*)"/i)[1];
            const mobTime = html.match(/style="width: [0-9]+\.[0-9]+%"/i) ? (parseFloat(html.match(/style="width: ([0-9]+\.[0-9]+)%"/i)[1]) / 100 * 23).toFixed(1) : "er";

            primeGodRows.push(`<tr class="clickable-mob deselected" data-name="${mobName}" data-prime="true" data-min="${charCount}"><td><img src="${mobImg}" style="width:25px;height:25px;border-radius:5px;"></td><td>${mobName}</td><td>${totalKills}</td><td>${mobTime} hours</td>`);
        };

        const raidMobRows = [];
        const mobData = await databaseGodData();
        for (let mob of mobData){
            const type = mob.Type;
            if (type == 1){
                const mobName = mob.OWName.replace(/,/g,'');
                const minChars = mob.LaunchValue;
                raidMobRows.push(`<tr class="clickable-mob deselected" data-name="${mobName}" data-prime="false" data-min="${minChars}"><td>${mobName}</td><td>${minChars}</td></tr>`);
            };
        };

        document.querySelector("#raiderMobsDiv").innerHTML = `
        <div class="main-content">
            <div class="column-2">
                <div class="table-div">
                <table class="table-raider sortable">
                <thead><tr><th></th><th>PRIME GODS</th><th>KILLS</th><th>DESPAWN</th></thead>
                <tbody>
                ${primeGodRows.sort().join("")}
                </tbody>
                </table>
                </div>
            </div>
            <div class="column-2">
                <div class="table-div">
                <table class="table-raider sortable">
                <thead><tr><th>RAID MOBS</th><th>CHARS</th></thead>
                <tbody>
                ${raidMobRows.sort().join("")}
                </tbody>
                </table>
                </div>
            </div>
        </div>
        `

        const clickableMobs = document.querySelectorAll('.clickable-mob');
        for (let mobRow of clickableMobs){
            mobRow.addEventListener('click', async () => {
                mobRow.classList.toggle('mob-selected');
                mobRow.classList.toggle('deselected');
            });
        };
    };


    document.querySelector("#closeMobs").addEventListener('click', async () => {
        const selectedMob = document.querySelectorAll('.mob-selected');
        if (selectedMob.length > 0){
            const selectedMobsArray = [];
            let minimumCharsNeeded = 0;
            let numberOfPrimeGodsSelected = 0;
            for (let mobRow of selectedMob){

                const mobName = mobRow.outerHTML.match(/data-name="([^"]*)"/i)[1];
                selectedMobsArray.push(mobName);

                const primeCheck = mobRow.outerHTML.match(/data-prime="([^"]*)"/i)[1];
                if (primeCheck == "true"){
                    numberOfPrimeGodsSelected += 1;
                };

                const mobMinimum = parseInt(mobRow.outerHTML.match(/data-min="([^"]*)"/i)[1]);
                if (mobMinimum > minimumCharsNeeded){
                    minimumCharsNeeded = mobMinimum;
                    document.querySelector("#neededCharCount").value = mobMinimum;
                };
            };

            document.querySelector("#selectedMobsDiv").innerHTML = selectedMobsArray.join(',');

            document.querySelector("#primeGodsSelected").value = numberOfPrimeGodsSelected;
        } else {
            document.querySelector("#neededCharCount").value = "0"
            document.querySelector("#primeGodsSelected").value = "0"
            document.querySelector("#selectedMobsDiv").innerHTML = ""
        };
        await updateRaidSetupValues();

        document.querySelector("#raiderMobsBackground").style.display = 'none';
    });


    document.querySelector("#raiderCharactersContainer").innerHTML = `
        <div class="raider-div" id="raiderCharactersDiv">
        <img src="https://studiomoxxi.com/moxximod/loading-gif.gif" style="width:100px;height:100px;">
        </div>
        <a href="javascript:void(0);" id="closeCharacters">close characters</a> | <a href="javascript:void(0);" id="saveGroup">save group</a> | <a href="javascript:void(0);" id="copySelected">copy selected</a> | <a href="javascript:void(0);" id="selectByList">select by list</a> | <a href="javascript:void(0);" id="selectAllChars">select all</a> | <a href="javascript:void(0);" id="deselectAllChars">deselect all</a>
    `;


    document.querySelector("#raiderCharactersBtn").addEventListener('click', async () => {
        document.querySelector("#raiderCharactersBackground").style.display = 'revert';
    });


    async function raiderCharacters(crewName){
        const decodedCrewName = new DOMParser().parseFromString(crewName, 'text/html').body.textContent;
        const allCharsArray = [];

        const myAccount = await superfetch('myaccount');
        const parseData = new DOMParser();
        const myAccountDom = parseData.parseFromString(myAccount, 'text/html');
        const trs = [...myAccountDom.querySelectorAll('tr')];
        const parseCharacterData = async (tr) => {
            if (tr.innerHTML.match(/suid=([0-9]+)/i)){
            //if (tr.innerHTML.includes(decodedCrewName)){
                const id = tr.innerHTML.match(/suid=([0-9]+)/i)[1];
                const profileData = await superfetchProfile(`profile?suid=${id}`);
                const name = profileData.name;
                const crew = profileData.crewname;
                if (crew == "None"){
                    return;
                };
                const rage = profileData.currentrage.toLocaleString();
                const ele = profileData.elemental.toLocaleString();
                const power = profileData.power.toLocaleString();
                const circ = profileData.skills.list.split(', ').includes('Circumspect');
                const capData = await superfetch(`crew_capstatus?suid=${id}`);
                const capLimit = parseInt(capData.match(/only be involved in killing ([0-9]+) guardians/i)[1]);
                const capCurrent = parseInt(capData.match(/killed in last 7 days:<\/b> ([0-9]+)/i)[1]);
                const caps = Math.max(0, capLimit - capCurrent);
                allCharsArray.push(`<tr class="clickable-char deselected" data-caps="${caps}" id="id${id}" data-name="${name}"><td>${name}</td><td>${rage}</td><td>${ele}</td><td>${power}</td><td>${circ}</td><td>${caps}</td><td class="crew-td">${crew}</td></tr>`);
            };
        };
        await Promise.all(trs.map(parseCharacterData));

        document.querySelector("#raiderCharactersDiv").innerHTML = `
        <div class="main-content">
            <div class="column-1">
                <div class="table-div">
                <table class="table-raider sortable">
                <thead><tr><th>CHAR</th><th>RAGE</th><th>ELE</th><th>POWER</th><th>CIRC</th><th>CAPS</th><th>CREW</th></thead>
                <tbody>
                ${allCharsArray.join('')}
                </tbody>
                </table>
                </div>
            </div>
            <div class="column-3">
                <div class="table-div" id="characterGroupsDiv">
                </div>
            </div>
        </div>
        `

        const clickableChars = document.querySelectorAll('.clickable-char');
        for (let charRow of clickableChars){
            charRow.addEventListener('click', async () => {
                charRow.classList.toggle('char-selected');
                charRow.classList.toggle('deselected');
            });
        };

        await loadSavedGroups();
    };


    document.querySelector("#closeCharacters").addEventListener('click', async () => {
        const selectedChars = document.querySelectorAll('.char-selected');

        const selectedCharsCrews = document.querySelectorAll('tr.char-selected td.crew-td');
        const noOfCrews = (new Set(Array.from(selectedCharsCrews, el => el.innerHTML.trim()))).size;
        if (noOfCrews > 1){
            alert('ERROR: Multiple crews selected');
            return;
        };

        if (selectedChars.length > 0){
            const selectedCharsArray = [];
            let minimumCapsAvailable = 1000;
            for (let charRow of selectedChars){

                const selectedCharName = charRow.outerHTML.match(/data-name="([^"]*)"/i)[1];
                const selectedCharCaps = charRow.outerHTML.match(/data-caps="([^"]*)"/i)[1];
                const selectedCharId = charRow.outerHTML.match(/id="([^"]*)"/i)[1];
                selectedCharsArray.push(`<data value="${selectedCharId}">${selectedCharName}</data>`);

                if (selectedCharCaps < minimumCapsAvailable){
                    minimumCapsAvailable = selectedCharCaps;
                    document.querySelector("#primeCapsAvailable").value = selectedCharCaps;
                };
            };

            document.querySelector("#selectedCharsDiv").innerHTML = selectedCharsArray.join(',');
            document.querySelector("#selectedCharCount").value = selectedChars.length;
        } else {
            document.querySelector("#selectedCharsDiv").innerHTML = ""
            document.querySelector("#selectedCharCount").value = "0"
            document.querySelector("#primeCapsAvailable").value = "0"
        };
        await updateRaidSetupValues();
        document.querySelector("#raiderCharactersBackground").style.display = 'none';
    });


    document.querySelector("#raiderSkillsContainer").innerHTML = `
        <div class="raider-div" id="raiderSkillsDiv">
        <img src="https://studiomoxxi.com/moxximod/loading-gif.gif" style="width:100px;height:100px;">
        </div>
        <a href="javascript:void(0);" id="closeSkills">close skills</a> | <a href="javascript:void(0);" id="selectAllSkills">select all skills</a> | <a href="javascript:void(0);" id="deselectAllSkills">de-select all skills</a>
    `;


    document.querySelector("#raiderSkillsBtn").addEventListener('click', async () => {
        document.querySelector("#raiderSkillsBackground").style.display = 'revert';
    });


    async function raiderSkills(crewName){
        const parseData = new DOMParser();
        const allSkillsData = [];

        const skillsClass = await superfetch('cast_skills.php');
        const skillsPreservation = await superfetch('cast_skills.php?C=5');
        const skillsMisc = await superfetch('cast_skills.php?C=7');

        const skillsClassDom = parseData.parseFromString(skillsClass, 'text/html');
        const skillsPreservationDom = parseData.parseFromString(skillsPreservation, 'text/html');
        const skillsMiscDom = parseData.parseFromString(skillsMisc, 'text/html');

        const allSkillsArray = [
            ...skillsClassDom.querySelectorAll('li.list-group-item-action'),
            ...skillsPreservationDom.querySelectorAll('li.list-group-item-action'),
            ...skillsMiscDom.querySelectorAll('li.list-group-item-action')
        ];
        for (let skill of allSkillsArray){
            const name = skill.innerHTML.match(/alt="([^"]*)"/i)[1];
            const img = skill.innerHTML.match(/src="([^"]*)"/i)[1];
            const text = skill.querySelector('p.mg-b-0').innerHTML.replace(/[ \t]{2,}|\r?\n|\r/g,'').replace(/'/g,'');
            allSkillsData.push(`<img data-name="${name}" class="skill-clickable" src="${img}" onmouseover="popup(event,'<b>${name}</b><br>${text}')" onmouseout="kill()">`);
        };

        const allPotionsArray = [];
        const potionData = await info("All Potions");
        for (let pot of potionData){
            const img = pot[1];
            const name = pot[0];
            if (!name.match(/Boost [A-Za-z0-9]+/i)){
                allPotionsArray.push(`<img data-name="${name}" class="skill-clickable" src="${img}" onmouseover="popup(event,'<b>${name}</b>')" onmouseout="kill()">`);
            };
        };
        document.querySelector("#raiderSkillsDiv").innerHTML = `
        <div class="main-content">
            <div class="column-3">
                <div class="table-div" style="text-align:left" id="allSkillsDiv">
                    <h5>All Skills</h5>
                    ${allSkillsData.join('')}
                </div>
            </div>
            <div class="column-1">
                <div class="table-div" style="text-align:left">
                    <h5>All Potions</h5>
                    ${allPotionsArray.join('')}
                </div>
            </div>
        </div>
        `

        const clickableSkills = document.querySelectorAll('.skill-clickable');
        for (let skill of clickableSkills){
            skill.addEventListener('click', async () => {
                skill.classList.toggle('skill-selected');
            });
        };

        document.querySelector("#selectAllSkills").addEventListener('click', async () => {
            const allSkillsDiv = document.querySelector("#allSkillsDiv");
            const skills = allSkillsDiv.querySelectorAll("img");
            for (let skill of skills){
                skill.classList.add('skill-selected');
            };
        });
        document.querySelector("#deselectAllSkills").addEventListener('click', async () => {
            const allSkillsDiv = document.querySelector("#allSkillsDiv");
            const skills = allSkillsDiv.querySelectorAll("img");
            for (let skill of skills){
                skill.classList.remove('skill-selected');
            };
        });
    };


    document.querySelector("#closeSkills").addEventListener('click', async () => {
        const selectedSkillsArray = [];
        const selectedSkills = document.querySelectorAll('.skill-selected');
        for (let skill of selectedSkills){
            const name = skill.outerHTML.match(/data-name="([^"]*)"/i)[1];
            selectedSkillsArray.push(name);
        };
        document.querySelector("#selectedSkillsDiv").innerHTML = selectedSkillsArray.join(',')
        document.querySelector("#raiderSkillsBackground").style.display = 'none';
    });


    document.querySelector("#raiderStartBtn").addEventListener('click', async () => {
        const charactersSelected = parseInt(document.querySelector("#selectedCharCount").value);
        const charactersNeeded = parseInt(document.querySelector("#neededCharCount").value);
        const primeCapsAvailable = parseInt(document.querySelector("#primeCapsAvailable").value);
        const primeCapsNeeded = parseInt(document.querySelector("#primeCapsNeeded").value);
        const selectedMob = document.querySelectorAll('.mob-selected');
        if (selectedMob.length == 0){
            alert(`ERROR: Please select at least 1 prime god or mob to raid`);
            return;
        } else if (charactersNeeded > charactersSelected){
            alert(`ERROR: You selected ${charactersSelected} characters but need ${charactersNeeded} to run these raids.`);
            return;
        } else if (primeCapsNeeded > primeCapsAvailable){
            alert(`ERROR: You are trying to complete ${primeCapsNeeded} prime god raids but the group only has enough caps to do ${primeCapsAvailable}.`);
            return;
        };
        const raidBtn = document.querySelector("#raiderStartBtn");
        raidBtn.disabled = true;
        raidBtn.classList.add("flashing");

        const numOfRaidsPerMob = parseInt(document.querySelector("#raidQuantity").value) > 1 ? document.querySelector("#raidQuantity").value : 1;

        const stopAfterLosses = parseInt(document.querySelector("#quitAfterValue").value) > 1 ? document.querySelector("#quitAfterValue").value : 1;

        const strCharacters = document.querySelector("#selectedCharsDiv").innerHTML.match(/value="id[0-9]+"/g).map(i => i.match(/[0-9]+/)[0]).join(',');
        const strMobs = document.querySelector("#selectedMobsDiv").innerHTML;
        const strSkills = document.querySelector("#selectedSkillsDiv").innerHTML;

        const strRaid = `NewRaider|rganame|${server}|${strMobs}|${numOfRaidsPerMob}|${strCharacters}|${strSkills}|${stopAfterLosses}`;
        await mmplus(strRaid);
        for (let i = 0; i < 10; i++) {
            raidBtn.innerHTML = 10 - i;
            await new Promise(resolve => setTimeout(resolve, 1000));
        };
        raidBtn.disabled = false;
        raidBtn.innerHTML = "RAID"
        raidBtn.classList.remove("flashing")
    });


    async function databaseGodData() {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: "http://outwar.link/raiderdata/gods.txt?t=",
                headers: {
                    "Cache-Control": "no-cache",
                    "Pragma": "no-cache"
                },
                onload: function(response) {
                    resolve(JSON.parse(response.responseText));
                }
            });
        });
    };


    async function updateRaidSetupValues(){
        const numberOfWinsPerMob = parseInt(document.querySelector("#raidQuantity").value);
        const primeGodsSelected = parseInt(document.querySelector("#primeGodsSelected").value);
        const primeCapsAvailable = parseInt(document.querySelector("#primeCapsAvailable").value);
        const selectedCharCount = parseInt(document.querySelector("#selectedCharCount").value);
        const neededCharCount = parseInt(document.querySelector("#neededCharCount").value);
        const primeCapsNeeded = numberOfWinsPerMob * primeGodsSelected;

        document.querySelector("#primeCapsNeeded").value = primeCapsNeeded;

        if (primeCapsNeeded > primeCapsAvailable){
            document.querySelector("#primeCapsAvailable").style.color = "red";
        } else {
            document.querySelector("#primeCapsAvailable").style.color = "white";
        };

        if (selectedCharCount < neededCharCount){
            document.querySelector("#selectedCharCount").style.color = "red";
        } else {
            document.querySelector("#selectedCharCount").style.color = "white";
        };
    };
    document.getElementById('raidQuantity').addEventListener('input', async () => {
        await updateRaidSetupValues();
    });


    document.querySelector("#saveGroup").addEventListener('click', async() => {
        const selectedChars = document.querySelectorAll('.char-selected');
        if (selectedChars.length < 2){
            alert("Please select at least 2 characters to make a group with");
        } else {
            const groupName = prompt("Enter a name for the group");
            if (groupName){
                if (groupName.match((/[:|]/))){
                    alert("Invalid group name: Cannot use | or : in a group name");
                } else {
                    const idsArrayForGroup = [];
                    for (let charRow of selectedChars){
                        const charId = charRow.outerHTML.match(/id="([^"]*)"/i)[1];
                        idsArrayForGroup.push(charId);
                    };
                    const storedGroupsRaw = GM_getValue('moxxiRaiderGroups');
                    const storedGroups = storedGroupsRaw ? JSON.parse(storedGroupsRaw) : [];
                    storedGroups.push({ name: groupName, chars: idsArrayForGroup });
                    GM_setValue('moxxiRaiderGroups', JSON.stringify(storedGroups));
                    await loadSavedGroups();
                };
            };
        };
    });


    async function loadSavedGroups(){
        const storedGroupsRaw = GM_getValue('moxxiRaiderGroups');
        const storedGroups = storedGroupsRaw ? JSON.parse(storedGroupsRaw) : [];
        const groupRowsArray = [];
        for (let group of storedGroups){
            const groupName = group.name;
            const groupChars = group.chars
            const groupLength = groupChars.length;
            groupRowsArray.push(`<tr><td><a href="javascript:void(0);" class="clickable-group" data-chars="${groupChars}">${groupName}</td><td>${groupLength}</td><td><a href="javascript:void(0)" class="raider-delete-group" data-group-name="${groupName}">X</td></tr>`);
        }
        document.querySelector("#characterGroupsDiv").innerHTML = `
            <table class="table-raider-groups sortable">
            <thead><tr><th>GROUP</th><th>CHARS</th><th>DELETE</th></thead>
            <tbody>
            ${groupRowsArray.join('')}
            </tbody>
            </table>
        `

        const clickableGroups = document.querySelectorAll('.clickable-group');
        for (let group of clickableGroups){
            group.addEventListener('click', async () => {

                const clickableChars = document.querySelectorAll('.clickable-char');
                for (let charRow of clickableChars){
                    charRow.classList.remove('char-selected');
                    charRow.classList.add('deselected');
                }

                const chars = group.outerHTML.match(/data-chars="([^"]*)"/i)[1];
                const charsArray = chars.split(",");
                for (let char of charsArray){
                    const targetChar = document.querySelector(`#${char}`);
                    if (targetChar){
                        targetChar.classList.add('char-selected');
                        targetChar.classList.remove('deselected');
                    };
                };
            });
        };

        const deleteGroups = document.querySelectorAll('.raider-delete-group');
        for (let group of deleteGroups){
            group.addEventListener('click', async () => {
                const groupName = group.outerHTML.match(/data-group-name="([^"]*)"/i)[1];
                const groupsFiltered = storedGroups.filter(obj => obj.name !== groupName);
                GM_setValue('moxxiRaiderGroups', JSON.stringify(groupsFiltered));
                await loadSavedGroups();
            });
        };
    };


    document.querySelector("#copySelected").addEventListener('click', async () => {
        const selectedChars = document.querySelectorAll('.char-selected');
        if (selectedChars.length > 0){
            const selectedCharsArray = [];
            for (let charRow of selectedChars){
                const selectedCharName = charRow.outerHTML.match(/data-name="([^"]*)"/i)[1];
                selectedCharsArray.push(selectedCharName);
            };
            try {
                navigator.clipboard.writeText(selectedCharsArray.join(','))
                alert('Copied to clipboard!');
            } catch {
                alert('Failed to copy');
            };
        };
    });


    document.querySelector("#selectByList").addEventListener('click', async () => {
        const charsList = prompt("Enter list of characters separated by commas");
        if (charsList){
            const charsListArray = charsList.split(',').map(name => name.trim().toLowerCase());
            const clickableChars = document.querySelectorAll('.clickable-char');
            for (let charRow of clickableChars){
                const name = charRow.dataset.name.toLowerCase();
                if (charsListArray.includes(name)){
                    charRow.classList.remove("deselected");
                    charRow.classList.add("char-selected");
                };
            };
        };
    });


    document.querySelector("#copyMobs").addEventListener('click', async () => {
        const selectedMobs = document.querySelectorAll('.mob-selected:not(.deselected)');
        if (selectedMobs.length > 0){
            const selectedMobsArray = [];
            for (let mobRow of selectedMobs){
                const selectedMobName = mobRow.outerHTML.match(/data-name="([^"]*)"/i)[1];
                selectedMobsArray.push(selectedMobName);
            };
            try {
                navigator.clipboard.writeText(selectedMobsArray.join(','))
                alert(`Copied ${selectedMobsArray.length} mobs to clipboard!`);
            } catch {
                alert('Failed to copy');
            };
        };
    });


    document.querySelector("#mobListSelect").addEventListener('click', async () => {
        const mobsList = prompt("Enter list of mobs separated by commas");
        if (mobsList){
            const mobsListArray = mobsList.split(',').map(name => name.trim().toLowerCase());
            const clickableMobs = document.querySelectorAll('.clickable-mob');
            for (let mobRow of clickableMobs){
                const name = mobRow.dataset.name.toLowerCase();
                if (mobsListArray.includes(name)){
                    mobRow.classList.remove("deselected");
                    mobRow.classList.add("mob-selected");
                };
            };
        };
    });


    document.querySelector("#selectAllChars").addEventListener('click', async () => {
        const clickableChars = document.querySelectorAll('.clickable-char');
        for (let charRow of clickableChars){
            charRow.classList.remove("deselected");
            charRow.classList.add("char-selected");
        };
    });


    document.querySelector("#deselectAllChars").addEventListener('click', async () => {
        const clickableChars = document.querySelectorAll('.clickable-char');
        for (let charRow of clickableChars){
            charRow.classList.add("deselected");
            charRow.classList.remove("char-selected");
        };
    });


    const myProfile = await superfetchProfile(`profile?id=${charId}`);
    const crewName = myProfile.crewname;
    document.querySelector("#crewName").value = crewName;

    await raiderSkills(crewName);
    await raiderMobs(crewName);
    await raiderCharacters(crewName);
    await sortableTables();

};


async function raidResultsNew(server,serverNo,rgaName,charId){

    GM_addStyle(`
        .div-top-outer { width: 100%; display: flex; gap: 10px; font-family:monospace; font-size:14px; }
        .top-div-inner { flex:1; box-sizing: border-box; flex-wrap: wrap; padding:10px; }
        .small-loading { height:35px; width:35px; padding:5px; }
        tr.raidRow { cursor:pointer; }
        #raidResultsWindow > table > tbody > tr > td {padding:0.25rem;}
        .mm-plus-option { color: #FFFF00; }
    `)

    const crewTitle = document.body.innerHTML.match(/<font size="4">(.*?)<\/font>/i)[1];
    const crewId = document.body.innerHTML.match(/name="crewid" value="([0-9]+)"/i)[1];

    document.querySelector("#content").innerHTML = `
    <div class="div-top-outer">
        <div class="top-div-inner" style="text-align:left">${crewTitle}</div>
        <div class="top-div-inner" style="text-align:right" id="db"></div>
    </div>
    <div class="div-top-outer mb-2">
        <div class="widget top-div-inner">RAID NAME<br><span id="raidName"></span></div>
        <div class="widget top-div-inner">RAID RESULT<br><span id="raidResult"></span></div>
        <div class="widget top-div-inner">FIND CHARACTER<br><span id="findCharacter"></span></div>
        <div class="widget top-div-inner">FIND ITEM<br><span id="findItem"></span></div>
        <div class="widget top-div-inner">TOOLS<br><span id="tools"></span></div>
        <div class="widget top-div-inner">LOAD RAIDS<br><span id="loadRaids"></span></div>
    </div>
    <div id="raidResultsContent" style="height:100%;">
    </div>
    `

    raidResultsLoadRaids(server,serverNo,rgaName,charId,crewId)

};

async function raidResultsLoadRaids(server,serverNo,rgaName,charId,crewId,loadRaidsValue){

    const parseData = new DOMParser();
    document.querySelector("#raidResultsContent").innerHTML = ``;
    document.querySelector("#raidName").innerHTML = `<img src="https://studiomoxxi.com/moxximod/loading-gif.gif" class="small-loading">`;
    document.querySelector("#raidResult").innerHTML = `<img src="https://studiomoxxi.com/moxximod/loading-gif.gif" class="small-loading">`;
    document.querySelector("#findCharacter").innerHTML = `<img src="https://studiomoxxi.com/moxximod/loading-gif.gif" class="small-loading">`;
    document.querySelector("#findItem").innerHTML = `<img src="https://studiomoxxi.com/moxximod/loading-gif.gif" class="small-loading">`;
    document.querySelector("#loadRaids").innerHTML = `<img src="https://studiomoxxi.com/moxximod/loading-gif.gif" class="small-loading">`;
    document.querySelector("#tools").innerHTML = `<img src="https://studiomoxxi.com/moxximod/loading-gif.gif" class="small-loading">`;


    document.querySelector("#db").innerHTML = `parsing raid results`
    const raidResults = await superfetch(`crew_raidresults.php?all_results=Display+all+raid+results&crewid=${crewId}`, true);
    const doc = parseData.parseFromString(raidResults, 'text/html');

    const loadRaids = loadRaidsValue ? loadRaidsValue : 10
    const raidsArray = Array.from(doc.querySelectorAll('table.table-striped tr')).slice(0, loadRaids);
    document.querySelector("#db").innerHTML = `loading ${loadRaids} raids`

    const tableRows = [];
    const allRaidsData = [];
    const arrayMobNames = [];
    const arrayItemNames = [];
    const arrayCharacterNames = [];


    const rowsLoop = async (row) => {
        const raidUrl = row.outerHTML.match(/raidattack\.php\?raidid=[0-9]+/i);
        if (!raidUrl){
            return;
        };
        const raidId = raidUrl.toString().match(/[0-9]+/).toString();
        const cells = Array.from(row.querySelectorAll('td'));
        const raidTime = cells[0].textContent;
        const raidName = cells[1].textContent.replace(/,.*/,'');

        if (!arrayMobNames.includes(raidName)){
            arrayMobNames.push(raidName);
        };

        const raid = await superfetch(raidUrl);
        const raidDoc = parseData.parseFromString(raid, 'text/html');
        const thisRaidChars = {};
        const thisRaidTotals = { total: 0, base: 0, holy: 0, arcane: 0, shadow: 0, fire: 0, kinetic: 0, chaos: 0, vile: 0 };
        //if (raidId == "16517940"){
        const dmgBoxes = Array.from(raidDoc.querySelectorAll('span.dmgbox-text'));
        for (box of dmgBoxes){
            const charName = box.textContent.split(/\s+/)[0];

            if (!arrayCharacterNames.includes(charName)){
                arrayCharacterNames.push(charName);
            };
            if (!thisRaidChars[charName]){
                thisRaidChars[charName] = { total: 0, base: 0, holy: 0, arcane: 0, shadow: 0, fire: 0, kinetic: 0, chaos: 0, vile: 0 };
            };
            const base = parseInt(box.outerHTML.replace(/,/g,'').match(/Base: ([0-9]+)/i)?.[1] || 0);
            const holy = parseInt(box.outerHTML.replace(/,/g,'').match(/([0-9]+) holy/i)?.[1] || 0);
            const arcane = parseInt(box.outerHTML.replace(/,/g,'').match(/([0-9]+) arcane/i)?.[1] || 0);
            const shadow = parseInt(box.outerHTML.replace(/,/g,'').match(/([0-9]+) shadow/i)?.[1] || 0);
            const fire = parseInt(box.outerHTML.replace(/,/g,'').match(/([0-9]+) fire/i)?.[1] || 0);
            const kinetic = parseInt(box.outerHTML.replace(/,/g,'').match(/([0-9]+) kinetic/i)?.[1] || 0);
            const chaos = parseInt(box.outerHTML.replace(/,/g,'').match(/([0-9]+) chaos/i)?.[1] || 0);
            const vile = parseInt(box.outerHTML.replace(/,/g,'').match(/([0-9]+) vile/i)?.[1] || 0);
            const total = base + holy + arcane + shadow + fire + kinetic + chaos + vile;
            thisRaidChars[charName].base += base;
            thisRaidChars[charName].holy += holy;
            thisRaidChars[charName].arcane += arcane;
            thisRaidChars[charName].shadow += shadow;
            thisRaidChars[charName].fire += fire;
            thisRaidChars[charName].kinetic += kinetic;
            thisRaidChars[charName].chaos += chaos;
            thisRaidChars[charName].vile += vile;
            thisRaidChars[charName].total += total;
            thisRaidTotals.base += base;
            thisRaidTotals.holy += holy
            thisRaidTotals.arcane += arcane
            thisRaidTotals.shadow += shadow
            thisRaidTotals.fire += fire
            thisRaidTotals.kinetic += kinetic
            thisRaidTotals.chaos += chaos
            thisRaidTotals.vile += vile
            thisRaidTotals.total += total;
        };

        const damageArray = Object.entries(thisRaidChars).sort((a, b) => b[1].total - a[1].total).map(([key, value]) => ({ name: key, ...value }));
        const mvpChar = damageArray[0].name;
        const damagePop = damageArray.map(player => `<b>${player.name}:</b> ${player.total.toLocaleString()}`).join('<br>');
        const damage = `<a href="javascript:void(0);" onmouseover="popup(event,'<div style=\\'text-align:left;\\'>${damagePop}</div>')" onmouseout="kill()">${mvpChar}</a>`
        const damages = `<a href="javascript:void(0);" onmouseover="popup(event,'<div style=\\'text-align:left;\\'><b>Base:</b> ${thisRaidTotals.base.toLocaleString()}<br><font color=#00FFFF><b>Holy:</b> ${thisRaidTotals.holy.toLocaleString()}</font><br><font color=#FFFF00><b>Arcane:</b> ${thisRaidTotals.arcane.toLocaleString()}</font><br><font color=#9f02d3><b>Shadow:</b> ${thisRaidTotals.shadow.toLocaleString()}</font><br><font color=#FF0000><b>Fire:</b> ${thisRaidTotals.fire.toLocaleString()}</font><br><font color=#00FF00><b>Kinetic:</b> ${thisRaidTotals.kinetic.toLocaleString()}</font><br><font color=#F441BE><b>Chaos:</b> ${thisRaidTotals.chaos.toLocaleString()}</font><br><font color=#CCCCCC><b>Vile:</b> ${thisRaidTotals.vile.toLocaleString()}</font></div>')" onmouseout="kill()">${thisRaidTotals.total.toLocaleString()}</a>`

        const datasetDamage = damageArray.map(i => [i.name,i.total]);

        const raidLoot = raid.match(/<a href="#" onmouseover="popup\(event,'<b>(.*?)<\/b>'\)" onmouseout="kill\(\)">/i)?.[1] ?? '';
        if (raidLoot != ''){
            const lootArray = raidLoot.split('<br>').map(i => i.replace(/ x[0-9]+/i,''));
            for (loot of lootArray){
                if (!arrayItemNames.includes(loot)){
                    arrayItemNames.push(loot);
                };
            };
        };

        const result = cells[2].outerHTML.match(/<b>(.*?)<\/b>/i)[1];
        const resultColor = cells[2].outerHTML.match(/<font color="[^"]*">/i).toString();

        const raidMembers = Object.keys(thisRaidChars).length;
        const raidDead = (raid.match(/images\/dead\.jpg/g) || []).length;

        const totalAttacks = raid.match(/Base: [0-9]+/g).length;
        const eleBlock = raid.match(/images\/block2\.jpg/g) ? Math.ceil((raid.match(/images\/block2\.jpg/g).length)/totalAttacks*100) : 0;
        const regBlock = raid.match(/images\/block\.jpg/g) ? Math.ceil((raid.match(/images\/block\.jpg/g).length)/totalAttacks*100) : 0;
        const eleShield = raid.match(/items\/[A-Za-z]+_ele_shield\.jpg/g) ? Math.ceil((raid.match(/items\/[A-Za-z]+_ele_shield\.jpg/g).length)/totalAttacks*100) : 0;
        const calcScore = ((eleBlock*2 + regBlock*3 + eleShield*10)/500).toFixed(2);
        const blockScore = `<a href="javascript:void(0);" onmouseover="popup(event,'<div style=\\'text-align:left;\\'><b>Regular:</b> ${regBlock}%<br><b>Elemental:</b> ${eleBlock}%<br><b>Shield:</b> ${eleShield}%</div>')" onmouseout="kill()">${calcScore}</a>`


        const loyalty = { a: 0, amax: 0, d: 0, dmax: 0, v: 0, vmax: 0, total: 0, totalmax: 0 };
        const factionboxes = raidDoc.querySelector('div.factionboxes');
        if (factionboxes){
            const factionbox = Array.from(factionboxes.querySelectorAll('span.factionbox'));
            for (let box of factionbox){
                const boxHtml = box.outerHTML;
                const loy = parseInt(boxHtml.match(/([0-9]+)\/[0-9]+/i)[1]);
                const max = parseInt(boxHtml.match(/[0-9]+\/([0-9]+)/i)[1]);
                if (boxHtml.match('Alvar Loyalty')){
                    loyalty.a = loy
                    loyalty.amax = max
                    loyalty.total += loy
                    loyalty.totalmax += max
                } else if (boxHtml.match('Delruk Loyalty')){
                    loyalty.d = loy
                    loyalty.dmax = max
                    loyalty.total += loy
                    loyalty.totalmax += max
                } else if (boxHtml.match('Vordyn Loyalty')){
                    loyalty.v = loy
                    loyalty.vmax = max
                    loyalty.total += loy
                    loyalty.totalmax += max
                };
            };
        };
        const loyaltyCalc = loyalty.totalmax == 0 ? "--" : (loyalty.total / loyalty.totalmax * 100).toFixed(1) + "%";
        const loyaltyPercentage = `<a href="javascript:void(0);" onmouseover="popup(event,'<div style=\\'text-align:left;\\'><b>Alvar:</b> ${loyalty.a}/${loyalty.amax}<br><b>Delruk:</b> ${loyalty.d}/${loyalty.dmax}<br><b>Vordyn:</b> ${loyalty.v}/${loyalty.vmax}<br><b>Total:</b> ${loyalty.total}/${loyalty.totalmax}</div>')" onmouseout="kill()">${loyaltyCalc}</a>`

        const sin = (raid.match(/color:#CC0000;"><b>(.*?)<\/b>/i) || [])[1] === "0" ? "YES" : "NO";

        const raidHealth = raid.match(/[0-9]+%<\/span><\/div>/g).map(i => i.match(/[0-9]+/)).slice(-1).toString();


        const newRow = `
            <tr class="raidRow" data-id=${raidId} data-name="${raidName}" data-result=${result} data-url="${raidUrl}" data-loot="${raidLoot.split('<br>')}" data-members="${Object.keys(thisRaidChars)}" data-damages='${JSON.stringify(datasetDamage)}'>
            <td>${raidTime}</td><td>${resultColor}${raidName}</font></td><td>${raidHealth}%</td><td>${raidMembers} (🕱${raidDead})</td><td>${damages}</td><td>${damage}</td><td>${loyaltyPercentage}</td><td>${blockScore}</td><td>${sin}</td><td>${raidLoot}</td>
            </tr>
        `
        tableRows.push(newRow);
    };
    await Promise.all(raidsArray.map(rowsLoop));

    const raidNameDropdown = `<option value="none" selected>None</option>` + arrayMobNames.sort().map(i => `<option value="${i}">${i}</option>`);
    const findItemDropdown = `<option value="none" selected>None</option>` + arrayItemNames.sort().map(i => `<option value="${i}">${i}</option>`)
    const findCharacterDropdown = `<option selected value="none">None</option>` + arrayCharacterNames.sort().map(i => `<option value="${i}">${i}</option>`);;
    const raidResultDropdown = `<option value="ALL" selected>All raids</option><option value="WIN">Winning raids</option><option value="LOSS">Losing raids</option>`
    const toolsDropdown = `<option disabled selected value="blank"></option><option value="toolRaidsReport" class="mm-plus-option">Raids Report</option>High score</option><option value="toolHighScore">High score</option>`
    const loadRaidsDropdown = `<option value="10">10</option><option value="25">25</option><option value="50">50</option><option value="100">100</option><option value="250">250</option><option value="500">500</option><option value="1000">1000</option>`


    document.querySelector("#db").innerHTML = ``
    document.querySelector("#raidName").innerHTML = `<select id="optionRaidName" class="form-control">${raidNameDropdown}</select>`
    document.querySelector("#raidResult").innerHTML = `<select id="optionRaidResult" class="form-control">${raidResultDropdown}</select>`
    document.querySelector("#findCharacter").innerHTML = `<select id="optionFindCharacter" class="form-control">${findCharacterDropdown}</select>`
    document.querySelector("#findItem").innerHTML = `<select id="optionFindItem" class="form-control">${findItemDropdown}</select>`
    document.querySelector("#loadRaids").innerHTML = `<select id="optionLoadRaids" class="form-control">${loadRaidsDropdown}</select>`
    document.querySelector("#tools").innerHTML = `<select id="optionTools" class="form-control">${toolsDropdown}</select>`
    document.querySelector("#raidResultsContent").innerHTML = `
        <table id="raidResultsTable" class="table table-striped mb-4 sortable">
        <thead><tr><th>timestamp</th><th>name</th><th>health</th><th>attackers</th><th>damage</th><th>mvp</th><th>loyalty</th><th>block</th><th>sin</th><th>loot</th></tr></thead>
        ${tableRows.sort().reverse().join('')}
        </table>
    `


    document.querySelectorAll('tr.raidRow').forEach(row => {
        row.addEventListener('click', function(event) {
            window.open(row.dataset.url, 'blank');
        });
    });



    document.querySelector("#optionLoadRaids").addEventListener('change', async () => {
        const value = document.querySelector("#optionLoadRaids").value;
        document.querySelector("#db").innerHTML = ``
        await raidResultsLoadRaids(server,serverNo,rgaName,charId,crewId,value);
        document.querySelector("#optionLoadRaids").value = value;
    });


    const filters = {
        mobName: 'none',
        raidResult: 'ALL',
        characterName: 'none',
        itemName: 'none',
    };


    function runFilters() {
        const allRaids = document.querySelectorAll('tr.raidRow');
        allRaids.forEach(raid => {

            const mobNameData = raid.dataset.name;
            const mobNameFilter = filters.mobName === 'none' || filters.mobName === mobNameData;

            const raidResultData = raid.dataset.result;
            const raidResultFilter = filters.raidResult === 'ALL' || filters.raidResult === raidResultData;

            const characterNameData = raid.dataset.members.split(',');
            const characterNameFilter = filters.characterName === 'none' || characterNameData.includes(filters.characterName);

            const itemNameData = raid.dataset.loot.split(',').map(i => i.replace(/ x[0-9]+/,''))
            const itemNameFilter = filters.itemName === 'none' || itemNameData.includes(filters.itemName);
            raid.hidden = !(mobNameFilter && raidResultFilter && characterNameFilter && itemNameFilter);
        });
    };


    document.querySelector("#optionRaidName").addEventListener('change', () => {
        filters.mobName = document.querySelector("#optionRaidName").value;
        runFilters();
    });


    document.querySelector("#optionRaidResult").addEventListener('change', () => {
        filters.raidResult = document.querySelector("#optionRaidResult").value;
        runFilters();
    });


    document.querySelector("#optionFindCharacter").addEventListener('change', () => {
        filters.characterName = document.querySelector("#optionFindCharacter").value;
        runFilters();
    });


    document.querySelector("#optionFindItem").addEventListener('change', () => {
        filters.itemName = document.querySelector("#optionFindItem").value;
        runFilters();
    });


    document.querySelector("#optionTools").addEventListener('change', async () => {
        const selected = document.querySelector("#optionTools").value;
        if (selected == "toolHighScore"){
            await toolHighScore();
        } else if (selected == "toolRaidsReport"){
            await toolRaidsReport();
        };

        document.querySelector("#optionTools").value = "blank";
    });


    async function toolHighScore(){
        const allDamages = [];

        const allRaids = Array.from(document.querySelectorAll('tr.raidRow'))
            .filter(row => {
                const style = window.getComputedStyle(row);
                return style.display !== 'none' && style.visibility !== 'hidden';
            });
        for (let raid of allRaids){
            const raidId = raid.dataset.id;
            const damageData = JSON.parse(raid.dataset.damages);
            for (d of damageData){
                d.push(raidId);
                allDamages.push(d);
            };
        };
        const top10 = allDamages
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([name, score, id], i) => `<tr><td>${i + 1}</td><td>${name}</td><td>${score.toLocaleString()}</td><td><a href="raidattack.php?raidid=${id}" target="blank">View Raid</a></td></tr>`)
            .join('');

            createWindow("High Scores - Single Raid Total Damage", "high_scores", 500, 500, -200);
            document.querySelector("#high_scores_content").innerHTML = `
                <div id="raidResultsWindow">
                <table class="table table-striped">
                <thead><tr><th>#</th><th>character</th><th>damage</th><th>raid</th></tr></thead>
                ${top10}
                </table>
                </div>
            `;
    };


    async function toolRaidsReport(){
        await blankOverlay(server,serverNo,rgaName,charId);
        await appRaidsReport(server,serverNo,rgaName,charId);
    };

    await sortableTables();

};


async function raidResults(){

    GM_addStyle(`
    #moxxiResults > thead > tr > th:nth-child(1){display:none;}
    #moxxiResults > tbody > tr > td:nth-child(1){display:none;}
    `)

    const crewId = document.body.innerHTML.match(/name="crewid" value="([0-9]+)"/i)[1];
    document.querySelector("#content-header-row > table > tbody > tr > td > form").outerHTML = `
    <center>
    <a href="crew_raidresults.php?crewid=${crewId}"><button class="btn-mm">Moxximod raid results</button></a>&nbsp;
    <form method="get" style="display:inline-block">
    <input type="submit" class="btn-mm" name="all_results" value="Display all raid results">&nbsp;
    <input type="submit" class="btn-mm" name="wins" value="Display only victorious raids">&nbsp;
    <input type="submit" class="btn-mm" name="most_recent" value="Display most recent raids">
    <input type="hidden" name="crewid" value="${crewId}">
    </form>
    </center><hr>
    `
    if (url.match(/crew_raidresults\.php\?crewid=[0-9]+&moxximod/i)){

        document.querySelector("#content-header-row > table > tbody > tr > td > div").setAttribute('style','display:none;');
        const headerDiv = document.querySelector("#content-header-row > div.col-12.layout-spacing")
        if (headerDiv){
            document.querySelector("#content-header-row > div.col-12.layout-spacing").setAttribute('style','display:none;')
        }

        const oldTable = document.querySelector("#content-header-row > table");
        const newElement = document.createElement("div");
        newElement.classList.add('widget')
        newElement.innerHTML = `
        <div style="width:100%;display:flex;justify-content:space-between;width:100%;margin-bottom:10px;">
            <div id="showHideLosingRaids"></div>
            <div></div>
        </div>
        <table id="moxxiResults" class="table table-striped sortable">
        <thead><tr><th>Position</th><th>Time</th><th>Raid</th><th>Chars</th><th>Result</th><th>%</th><th>Damage</th><th>Reg Block</th><th>Ele Block</th><th>Shield</th><th>Loyalty</th><th>Sin</th><th>Loot</th></tr></thead>
        <tbody></tbody>
        </table>
        `;
        oldTable.insertAdjacentElement("afterend", newElement);

        const hideLosingRaids = GM_getValue('hideLosingRaids') || false;;

        if (hideLosingRaids){
            document.querySelector("#showHideLosingRaids").innerHTML = '<a href="javascript:void(0);">Show losing raids</a>'
        } else {
            document.querySelector("#showHideLosingRaids").innerHTML = '<a href="javascript:void(0);">Hide losing raids</a>'
        };

        document.querySelector("#showHideLosingRaids").addEventListener('click', async function(){
            if (hideLosingRaids){
                GM_setValue('hideLosingRaids',false);
                window.location.href = window.location;
            } else {
                GM_setValue('hideLosingRaids',true);
                window.location.href = window.location;
            };
        });

        let data = [];
        const raidsArray = document.querySelectorAll("#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr");
        const buildTable = async (item,index) => {
            const row = item.innerHTML;
            const raidPosition = index + 1
            const raidTime = row.match(/[0-9]+:[0-9]+/i);
            const raidAttackers = parseInt(row.match(/<td align="left" valign="top">([0-9]+)<\/td>/i)[1]);
            const raidResult = row.match(/<font color="[^"]*"><b>.*?<\/b><\/font>/i);
            if (hideLosingRaids && raidResult.toString().match('LOSS')){
                return;
            };
            const raidId = row.match(/raidid=([0-9]+)/i)[1];
            const raidName = row.match(/>.*?</g)[1].toString().match(/>(.*?)</i)[1].replace(/(,.*|of.*| The | the.*)/g, '');
            const raidFetch = await superfetch(`raidattack.php?raidid=${raidId}`);
            const raidPercent = raidFetch.match(/[0-9]+%<\/span><\/div>/g).map(i => i.match(/[0-9]+/)).slice(-1).toString();
            const raidDamage = parseInt(raidFetch.replace(/,/g, '').match(/<i>Total Attacker Damage: ([0-9]+)<\/i>/i)[1]);
            const raidAttacks = raidFetch.match(/Base: [0-9]+/g).length;
            const raidEleblock = raidFetch.match(/images\/block2\.jpg/g) ? Math.ceil((raidFetch.match(/images\/block2\.jpg/g).length)/raidAttacks*100) : 0;
            const raidRegblock = raidFetch.match(/images\/block\.jpg/g) ? Math.ceil((raidFetch.match(/images\/block\.jpg/g).length)/raidAttacks*100) : 0;
            const raidDied = raidFetch.match(/images\/dead\.jpg/g) ? (raidFetch.match(/images\/dead\.jpg/g).length) : 0;
            const raidShield = raidFetch.match(/items\/[A-Za-z]+_ele_shield\.jpg/g) ? Math.ceil((raidFetch.match(/items\/[A-Za-z]+_ele_shield\.jpg/g).length) / raidAttacks * 100) : 0;
            const raidItems = (raidFetch.match(/<a href="#" onmouseover="popup\(event,'<b>(.*?)<\/b>'\)" onmouseout="kill\(\)">.*?<\/a>/i) || ['',''])[1];
            const alvarLoyalty = raidFetch.match(/Alvar Loyalty/i) ? raidFetch.replace(/[\n\r]/g,'').replace(/\s+/g,'').match(/AlvarLoyalty\/MaximumLoyalty'\);"onmouseout="kill\(\);">[0-9]+\/[0-9]+/i) : "0/0";
            const delrukLoyalty = raidFetch.match(/Delruk Loyalty/i) ? raidFetch.replace(/[\n\r]/g,'').replace(/\s+/g,'').match(/DelrukLoyalty\/MaximumLoyalty'\);"onmouseout="kill\(\);">[0-9]+\/[0-9]+/i) : "0/0";
            const vordynLoyalty = raidFetch.match(/Vordyn Loyalty/i) ? raidFetch.replace(/[\n\r]/g,'').replace(/\s+/g,'').match(/VordynLoyalty\/MaximumLoyalty'\);"onmouseout="kill\(\);">[0-9]+\/[0-9]+/i) : "0/0";
            const raidLoyalty = parseInt(alvarLoyalty.toString().match(/([0-9]+)\/[0-9]+/i)[1])+parseInt(delrukLoyalty.toString().match(/([0-9]+)\/[0-9]+/i)[1])+parseInt(vordynLoyalty.toString().match(/([0-9]+)\/[0-9]+/i)[1])
            const raidMaxloyalty = parseInt(alvarLoyalty.toString().match(/[0-9]+\/([0-9]+)/i)[1])+parseInt(delrukLoyalty.toString().match(/[0-9]+\/([0-9]+)/i)[1])+parseInt(vordynLoyalty.toString().match(/[0-9]+\/([0-9]+)/i)[1])
            const raidSin = (raidFetch.match(/color:#CC0000;"><b>(.*?)<\/b>/i) || [])[1] === "0" ? "YES" : "NO";
            data.push(rowData = {
                position: raidPosition,
                time: raidTime,
                name: `<a href="raidattack.php?raidid=${raidId}">${raidName}</a>`,
                attackers: `${raidAttackers} (🕱${raidDied})`,
                result: raidResult,
                percent: `${raidPercent}%`,
                damage: raidDamage.toLocaleString(),
                regblock: `${raidRegblock}%`,
                eleblock: `${raidEleblock}%`,
                shield: `${raidShield}%`,
                loyalty: `${raidLoyalty}/${raidMaxloyalty}`,
                sin: raidSin,
                items: raidItems
            });
        };
        await Promise.all(Array.from(raidsArray).slice(1).map((raid, index) => buildTable(raid, index)));

        data.sort((a, b) => a.position - b.position);
        data.forEach(rowData => {
            const rowElement = document.querySelector("#moxxiResults > tbody").insertRow();
            rowElement.innerHTML = Object.values(rowData).map(value => `<td>${value}</td>`).join('');
        });

        await sortableTables();
    };
};


async function changeFaction(profileData){
    GM_addStyle(` .codex-img { width: calc(10% - 10px); margin: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.5); } `)

    document.querySelector("#content-header-row > div > h1").remove();

    const rightContent = document.querySelector("#content-header-row > div > div > div:nth-child(2)");
    const completedCodex = document.querySelector("#content-header-row > div > div > div > div.mt-3 > div > div.widget-content.widget-content-area").innerHTML;
    const completedArray = completedCodex.match(/Triworld Codex Chapter [0-9]+/g) || [];
    const imgArray = [];
    for (let i = 0; i < completedArray.length; i++) {
        imgArray.push(`<img src="images/items/tiupgrade${completedArray[i].match(/[0-9]+/i)}.png" class="codex-img">`);
    };
    rightContent.outerHTML = `
    <div class="col-12 col-md-8">
    <div class="widget mb-3" id="codexContainer"><h3>COMPLETED CODEX</h3><span style="display:inline-block;text-align:left;">${imgArray.join('')}</span></div>
    <div class="widget mb-3"><h3>LOYALTY RANKINGS</h3>
    <div id="loyaltyRankings"><img src="https://studiomoxxi.com/moxximod/loading-gif.gif" height="90px" width="90px"></div>
    </div>
    <div class="widget">
    <h3>FACTION LOYALTY</h3><p>
    Players can increase their loyalty with each faction (up to a maximum of 10) by completing Catalyst tasks provided by the Alvar Emissary, Delruk Emissary and Vordyn Emissary. Completing these tasks will award a Proven Loyalty item, which can be exchanged with Artel, Dumar or Valka to permanently increase your loyalty with that faction. Secondary rewards such as augments are also earned by increasing loyalty. The first 2 catalyst quests have been added with this update, with the remaining 8 to be released with future updates. While the Catalyst of Evolution is playerbound, all other catalysts will be tradeable.<p>
    Increasing your loyalty with each faction can provide bonus damage for yourself vs mobs and for all members vs raids. The bonus damage amount is determined by the effect % each encounter has, multiplied by the amount of maximum loyalty that takes effect during the encounter. Loyalty will only take effect through your current active faction.<p>
    In addition to bonus damage, loyalty can also be used to increase the power of your Triworld Influence skill, which is earned by completing the Faction Initiations quest. The power of this skill is determined by the amount of codexes collected, increased by up to 100% based on your highest faction loyalty (10% per loyalty). Codexes can be found from expansion related content which players need to discover, with 29 being added with this initial update out of the eventual total of 50. While codex 1-10 are playerbound, all other codexes will be tradeable.<p>
    </div>
    </div>
    `

    const leftContent = document.querySelector("#content-header-row > div > div > div:nth-child(1)")
    leftContent.outerHTML = `
    <div class="col-12 col-md-4">
    <div class="widget mb-3" id="factionLogo">test</div>
    <div class="widget mb-3"><h3>CHANGE FACTION</h3>${leftContent.innerHTML}</div>
    <div class="widget">
    <h3>FACTIONS</h3><p>
    <font color="#f6b861">The <b>Delruk</b> Alliance was formed by members of Diamond City and other nearby lands. They focus on base attack and vile damage.</font><p>
    <font color="#b7d9fb">The <b>Alvar</b> Liberation was formed by the survivors of the Astral Dimension war. They focus on original elemental damages.</font><p>
    <font color="#ffb7f1">The <b>Vordyn</b> Rebellion was formed on Veldara during the reign of Thanox. They focus on chaos damage.</font><p>
    Factions work similar to classes, with each character being able to choose one of 3 options. Each character is able to change faction once per month for free via the Change Faction page (also linked via the character menu) and the free faction change timer resets at the start of every month, however changing faction more than once per month will require a Faction Change item. Unlike classes, bonuses for being in each faction are not initially provided via direct stats, instead they provide access to faction specific content and activate your Faction Loyalty. While this initial update focuses primarily on the loyalty system and damage bonuses, content including level 95 enhancements will be added in the future focusing on faction specific stats.<p>
    </div>
    </div>
    `

    const faction = profileData.faction;
    if (faction == "Vordyn"){
        document.querySelector("#factionLogo").innerHTML = `<img src="https://studiomoxxi.com/moxxibots/factions/v.png" style="height:200px;width:200px;margin:20px;">`
        GM_addStyle (`.widget,.widget-content-area{-webkit-box-shadow:0px 0px 3px 3px rgba(252,41,205,0.3);`)
    } else if (faction == "Alvar"){
        document.querySelector("#factionLogo").innerHTML = `<img src="https://studiomoxxi.com/moxxibots/factions/a.png" style="height:200px;width:200px;margin:20px;">`
        GM_addStyle (`.widget,.widget-content-area{-webkit-box-shadow:0px 0px 3px 3px rgba(0,159,255,0.3);`)
    } else if (faction == "Delruk"){
        document.querySelector("#factionLogo").innerHTML = `<img src="https://studiomoxxi.com/moxxibots/factions/d.png" style="height:200px;width:200px;margin:20px;">`
        GM_addStyle (`.widget,.widget-content-area{-webkit-box-shadow:0px 0px 3px 3px rgba(255,120,39,0.3);`)
    } else {
        document.querySelector("#factionLogo").innerHTML = "No faction selected"
    }
    document.querySelector("#content-header-row > div > div > div:nth-child(1) > div.widget.mb-3 > h4").outerHTML = "Free faction change every calendar month"

    document.querySelector("#content-header-row > div > div > div:nth-child(1) > div.widget.mb-3 > div.mt-3").remove();
    document.querySelector(".clock-builder-output.flip-clock-small-wrapper").remove();

    document.querySelector("#content-header-row > div > div > div:nth-child(1) > div.widget.mb-3 > form > button").setAttribute('style','margin-bottom:1rem;')

    factionRankings();
};

async function factionRankings(){

    GM_addStyle(`
        table.alvar-rankings > tbody > tr > th {color:#b7d9fb;}
        table.delruk-rankings > tbody > tr > th {color:#f6b861;}
        table.vordyn-rankings > tbody > tr > th {color:#ffb7f1;}
    `)

    const powerRankings = await superfetch('ajax/rankings.php?type=char_power');
    const idArray = powerRankings.match(/"id":"[0-9]+"/g).map(i => i.match(/[0-9]+/));
    const rankings = {
        alvar: [],
        delruk: [],
        vordyn: []
    };
    const profiles = async (i) => {
        const profile = await superfetchProfile(`profile?id=${i}`);
        const name = profile.name;
        const faction = profile.faction;
        const loyalty = profile.loyalty;
        if (faction != "None"){
            rankings[faction.toLowerCase()].push({name:name,level:loyalty});
        };
    }
    await Promise.all(idArray.map(profiles));

    for (var key in rankings) {
        if (rankings.hasOwnProperty(key)) {

            rankings[key].sort((a, b) => b.level - a.level);
            rankings[key] = rankings[key].slice(0, 15);
        };
    };
    var alvarTable = '<table class="rankings-table table table-striped alvar-rankings"><tr><th><img src="https://studiomoxxi.com/moxxibots/factions/a.png" height="15px" width="15px"></th><th>ALVAR</th><th>LVL</th></tr>' + rankings.alvar.map((obj, index) => `<tr><td>${index + 1}</td><td width="180px">${obj.name}</td><td>${obj.level}</td></tr>`).join('') + '</table>';
    var delrukTable = '<table class="rankings-table table table-striped delruk-rankings"><tr><th><img src="https://studiomoxxi.com/moxxibots/factions/d.png" height="15px" width="15px"></th><th>DELRUK</th><th>LVL</th></tr>' + rankings.delruk.map((obj, index) => `<tr><td>${index + 1}</td><td width="180px">${obj.name}</td><td>${obj.level}</td></tr>`).join('') + '</table>';
    var vordynTable = '<table class="rankings-table table table-striped vordyn-rankings"><tr><th><img src="https://studiomoxxi.com/moxxibots/factions/v.png" height="15px" width="15px"></th><th>VORDYN</th><th>LVL</th></tr>' + rankings.vordyn.map((obj, index) => `<tr><td>${index + 1}</td><td width="180px">${obj.name}</td><td>${obj.level}</td></tr>`).join('') + '</table>';
    document.querySelector("#loyaltyRankings").innerHTML = `
    <div style="display:inline-block">
    ${alvarTable}</div>
    <div style="display:inline-block">
    ${delrukTable}</div>
    <div style="display:inline-block">
    ${vordynTable}</div>
    <br><i>Loyalty rankings only include players who rank top-100 for power. Other players may have a higher loyalty level but will not appear on loyalty rankings
    `
};


async function crewProfile(server){

    GM_addStyle (`
        .crew-profile-pic{box-shadow: 5px 5px 5px rgba(0, 0, 0, 1);width:100%;border-radius:6px;display:inline-block;}
        #nativeMemberTable{max-height:533px;overflow:auto;}
        #crewMemberDiv{width:100%;text-align:left;display:none;margin-top:15px;}
        #crewMemberTable > tbody > tr > td > img{width:30px;height:30px;display:inline-block;border-radius:10px;}
        .button-container{display:inline-block;}
        #scrollButtons > center > a{padding:10px;font-size:16px;}
        #scrollButtons{padding-left:10px;padding-bottom:10px;padding-right:10px;}
        #actionSpace > img{margin:4px;padding:4px;box-shadow: 5px 5px 5px rgba(0, 0, 0, 1);width:40px;height:40px;border: 2px inset;}
        #actionSpace{overflow-y:auto;overflow-x:hidden;max-height:250px;}
        #crewMemberTable{height:100%;overflow:hidden;box-sizing: border-box;}
    `);

    const crewName = document.body.innerHTML.match(/<h2>(.*?)<\/h2>/i)[1]
    const crewPic = (document.body.innerHTML.match(/<img src="([^"]*)" width="[0-9]+" height="[0-9]+">/i) || ['','images/logodefault.gif'])[1]
    const crewUpgrades = document.body.innerHTML.match(/<img border="0" src="[^"]*" onmouseover="popup\(event,'<div style=&quot;width:200px&quot;><b>.*? \(Level [0-9]+\/[0-9]+ \+[0-9]+\)<\/b><br>.*?<\/div>','808080'\)" ;="" onmouseout="kill\(\)">/g)
    const crewStones = document.body.innerHTML.match(/<img style="border:2px inset;" src="[^"]*" onmouseover="[^"]*" ;="" onmouseout="kill\(\)">/g) || [];
    const crewAllies = document.body.innerHTML.replace(/[\n\r]/g,'').replace(/col-6/g,'col-4').match(/(<h5 class="card-title">CREW ALLIES<\/h5>.*?)<h5 class="card-title">CREW ENEMIES<\/h5>/i)[1];
    const crewMembers = document.body.innerHTML.match(/<td><a href="profile\.php\?id=[0-9]+">.*?<\/a><\/td>/g);
    const parseData = new DOMParser();
    const bodyHtml = parseData.parseFromString(document.body.innerHTML, 'text/html');
    const nativeMemberTable = bodyHtml.querySelector('.table.table-bordered.table-striped').innerHTML;
    const nativeDetails = bodyHtml.querySelector('.row div ul').parentNode.parentNode.outerHTML;
    const breakAlliance = document.body.innerHTML.match(/id=[0-9]+&ally=2/i)
    const formAlliance = document.body.innerHTML.match(/id=[0-9]+&ally=1/i)
    const dropdownOptions = bodyHtml.querySelector("#content-header-row > div:nth-child(2) > div > div.btn-group.mb-3.mr-2");
    const treasuryLink = document.body.innerHTML.match(/<a href="(\/treasury\?search_for=.*?)">/i)[1]
    const crewId = document.body.innerHTML.match(/crew_trophyroom\.php\?crewid=([0-9]+)/i)[1]

    const myCrewButtons = `
    <div class="btn-group show" role="group">
    <button type="button" class="btn-mm dropdown-toggle" data-toggle="dropdown">CREW PAGES <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg></button>
    <div id="crewActionsDropdown" class="dropdown-menu" style="will-change: transform; position: absolute; transform: translate3d(0px, 38px, 0px); top: 0px; left: 0px;">
    <a class="dropdown-item" href="trade?isCrewTrade=1&amp;tradeWith=${crewId}">Trade with ${crewName}</a>
    <a class="dropdown-item" href="${treasuryLink}">${crewName} Treasury</a>
    <a class="dropdown-item" href="crew_raidresults.php?crewid=${crewId}">Raid Results</a>
    <a class="dropdown-item" href="javascript:void(0);" id="showCrewUpgrades">Crew Upgrades</a>
    <a class="dropdown-item" href="javascript:void(0);" id="showCrewAllies">Crew Allies</a>
    </div>
    </div>`


    document.querySelector("#content").innerHTML = `

    <div class="widget-content widget-content-area">
    <div class="bio-skill-box">
    <div class="row">

    <div class="col-12 col-xl-5">
    <h3>${crewName}</h3><hr>
    ${nativeDetails}<hr>
    <div>

    <div class="button-container">
    <div class="btn-group show" role="group">
    <button type="button" class="btn-mm dropdown-toggle" data-toggle="dropdown">MEMBER DETAILS <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg></button>
    <div class="dropdown-menu" style="will-change: transform; position: absolute; transform: translate3d(0px, 38px, 0px); top: 0px; left: 0px;">
    <a class="dropdown-item" href="javascript:void(0);" id="mbr-stats">STATISTICS</a>
    <a class="dropdown-item" href="javascript:void(0);" id="mbr-items">ITEMS</a>
    <a class="dropdown-item" href="javascript:void(0);" id="mbr-skills">SKILLS</a>
    </div>
    </div>
    </div>

    <div class="button-container">
    ${myCrewButtons}
    </div>

    <hr>
    <div id="actionSpace"></div>
    </div>
    </div>

    <div class="col-12 col-xl-4">
    <img src="${crewPic}" class="crew-profile-pic">
    </div>

    <div class="col-12 col-xl-3">
    <div id="nativeMemberTable">
    <table class="table table-striped">
    ${nativeMemberTable.replace(/<th>Level<\/th>/i,'').replace(/<td>\b\d{1,3}\b<\/td>/g,'')}
    </table>
    </div>
    </div>

    </div>
    </div>
    </div>

    <div id="crewMemberDiv" class="widget-content widget-content-area" style="border-radius:0px;top:-5px;">
    <div id="crewMemberTable"></div>
    </div>

    `


    var crewActionsDropdown = document.getElementById("crewActionsDropdown");
    if (dropdownOptions){
        if (dropdownOptions.innerHTML.match(/href="\/crew_invites"/)) {
            crewActionsDropdown.innerHTML += `<a class="dropdown-item" href="crew_invites">Send Crew Invites</a>`;
        }
        if (dropdownOptions.innerHTML.match(/href="\/crew_image"/)) {
            crewActionsDropdown.innerHTML += `<a class="dropdown-item" href="crew_image">Edit Crew Picture</a>`;
        }
        if (dropdownOptions.innerHTML.match(/href="\/crew_changerank"/)) {
            crewActionsDropdown.innerHTML += `<a class="dropdown-item" href="crew_changerank">Change Ranks</a>`;
        }
        if (dropdownOptions.innerHTML.match(/href="\/crew_ranknames"/)) {
            crewActionsDropdown.innerHTML += `<a class="dropdown-item" href="crew_ranknames">Change Rank Names</a>`;
        }
        if (dropdownOptions.innerHTML.match(/href="\/crew_bootmem"/)) {
            crewActionsDropdown.innerHTML += `<a class="dropdown-item" href="crew_bootmem">Boot Members</a>`;
        }
        if (dropdownOptions.innerHTML.match(/href="\/crew_actionlog"/)) {
            crewActionsDropdown.innerHTML += `<a class="dropdown-item" href="crew_actionlog">Crew Action Log</a>`;
        }
        if (dropdownOptions.innerHTML.match(/href="\/crew_vault"/)) {
            crewActionsDropdown.innerHTML += `<a class="dropdown-item" href="crew_vault">Vault & Storage</a>`;
        }
        if (dropdownOptions.innerHTML.match(/href="\/crew_capstatus"/)) {
            crewActionsDropdown.innerHTML += `<a class="dropdown-item" href="crew_capstatus">Character Cap Status</a>`;
        }
        if (dropdownOptions.innerHTML.match(/href="\/crew_adminpanel"/)) {
            crewActionsDropdown.innerHTML += `<a class="dropdown-item" href="crew_adminpanel">Admin Panel</a>`;
        }
    };

    if (formAlliance){
        var a = document.createElement("a");
        a.className = "dropdown-item";
        a.setAttribute('style','cursor:pointer;')
        a.addEventListener('click', function(){
            window.location.href = `crew_profile.php?${formAlliance.toString().replace('amp;','')}`
            alert('You are now allied to this crew');
            window.location.href = window.location.href.replace(/&ally=[0-9]+/i,'');
        })
        a.textContent = "Form Alliance";
        crewActionsDropdown.appendChild(a);
    };
    if (breakAlliance){
        var a = document.createElement("a");
        a.className = "dropdown-item";
        a.setAttribute('style','cursor:pointer;')
        a.addEventListener('click', function(){
            window.location.href = `crew_profile.php?${breakAlliance.toString().replace('amp;','')}`
            alert('You are no longer allied to this crew');
            window.location.href = window.location.href.replace(/&ally=[0-9]+/i,'');
        })
        a.textContent = "Break Alliance";
        crewActionsDropdown.appendChild(a);
    };

    document.querySelector("#mbr-stats").addEventListener('click',memberStats)
    document.querySelector("#mbr-items").addEventListener('click',memberItems)
    document.querySelector("#mbr-skills").addEventListener('click',memberSkills)

    async function memberStats(){

        document.querySelector("#actionSpace").innerHTML = `<div><img src="https://studiomoxxi.com/moxximod/loading-gif.gif" style="height:100px;width:100px;padding:20px"></div>`

        const memberData = []
        let count = 0
        const buildTable = async (item) => {
            count++
            const position = count;
            const charId = item.match(/<a href="profile\.php\?id=([0-9]+)">/i)[1];
            const profile = (await superfetch(`profile?id=${charId}`)).replace(/\s/g,'');
            const name = `<a href='profile.php?id=${charId}'>${profile.match(/<fontsize="3">(.*?)<\/font>/i)[1]}</a>`;
            const level = profile.match(/<fontsize="2">Level([0-9]+).*?<\/font>/i)[1];
            const power = parseInt(profile.replace(/,/g,'').match(/TOTALPOWER<\/font><\/b><\/td>.*?<fontsize="2">([0-9]+)<\/font>/i)[1]).toLocaleString();
            const ele = parseInt(profile.replace(/,/g,'').match(/ELEMENTALATTACK<\/font><\/b><\/td>.*?<fontsize="2">([0-9]+)<\/font>/i)[1]).toLocaleString();
            const slayer = parseInt(profile.replace(/,/g,'').match(/GODSLAYERLEVEL<\/font><\/b><\/td>.*?<fontsize="2">([0-9]+)<\/font>/i)[1]).toLocaleString();
            const wldr = parseInt(profile.replace(/,/g,'').match(/WILDERNESSLEVEL<\/font><\/b><\/td>.*?<fontsize="2">([0-9]+)<\/font>/i)[1]).toLocaleString();
            const chaos = parseInt(profile.replace(/,/g,'').match(/CHAOSDAMAGE<\/font><\/b><\/td.*?<fontsize="2">([0-9]+)<\/font>/i)[1]).toLocaleString();
            const atk = parseInt(profile.replace(/,/g,'').match(/ATTACK<\/font><\/b><\/td>.*?<fontsize="2">([0-9]+)<\/font>/i)[1]).toLocaleString();
            const hp = parseInt(profile.replace(/,/g,'').match(/HITPOINTS<\/font><\/b><\/td>.*?<fontsize="2">([0-9]+)<\/font>/i)[1]).toLocaleString();
            const growth = parseInt(profile.replace(/,/g,'').match(/GROWTHYESTERDAY<\/font><\/b><\/td>.*?<fontsize="2">(.*?)<\/font>/i)[1]).toLocaleString();
            const resistance = parseInt(profile.replace(/,/g,'').match(/ELEMENTALRESIST<\/font><\/b><\/td>.*?<fontsize="2">([0-9]+)<\/font>/i)[1]).toLocaleString();
            const factionMatch = profile.match(/<fontsize="1">FACTION<\/font><\/b><\/td><tdwidth="50%"style="padding-top:2px;padding-bottom:2px;"><b><fontsize="2">(.*?)\((.*?)\)<\/font>/i)
            const faction = factionMatch[1]
            const loyalty = factionMatch[2] === "" ? '0' : factionMatch[2];
            memberData.push({ position,name,level,power,ele,chaos,faction,loyalty,slayer,wldr,atk,hp,resistance,growth });
        };
        await Promise.all(crewMembers.map(buildTable));

        memberData.sort((a, b) => a.position - b.position);

        const memberDataWithoutPosition = memberData.map(({ position, ...rest }) => rest);
        const allRows = [];
        memberDataWithoutPosition.forEach(char => {
            const row = [];
            Object.keys(char).forEach(td => {
                row.push(`<td>${char[td]}</td>`);
            });
            allRows.push(`<tr>${row.join('')}</tr>`);
        });
        document.querySelector("#crewMemberTable").innerHTML = `
            <table id="crewMemberTable" class="table sortable">
            <thead><th>name</th><th>level</th><th>power</th><th>ele</th><th>chaos</th><th>faction</th><th>loyalty</th><th>slayer</th><th>wldr</th><th>atk</th><th>hp</th><th>resistance</th><th>growth</th></thead>
            <tbody>${allRows.join('')}</tbody>
            </table>
        `

        let totalPower = 0; let totalEle = 0; let totalChaos = 0; let totalLoyalty = 0; let totalSlayer = 0; let totalWldr = 0; let totalRes = 0; let totalGrowth = 0; let totalAtk = 0; let totalHp = 0
        memberDataWithoutPosition.forEach(function(obj) {
            Object.entries(obj).forEach(function([key, value]) {
                var cell = document.createElement("td");
                cell.innerHTML = value;
                if (value.match(/<a href='profile\.php\?id=[0-9]+'>.*?<\/a>/i)){
                    cell.setAttribute('style',`position: sticky;left:0px;`);
                };
                if (key == "power"){ totalPower += parseInt(value.replace(/,/g,'')) };
                if (key == "ele"){ totalEle += parseInt(value.replace(/,/g,'')) };
                if (key == "chaos"){ totalChaos += parseInt(value.replace(/,/g,'')) };
                if (key == "loyalty"){ totalLoyalty += parseInt(value.replace(/,/g,'')) };
                if (key == "wldr"){ totalWldr += parseInt(value.replace(/,/g,'')) };
                if (key == "slayer"){ totalSlayer += parseInt(value.replace(/,/g,'')) };
                if (key == "resistance"){ totalRes += parseInt(value.replace(/,/g,'')) };
                if (key == "growth"){ totalGrowth += parseInt(value.replace(/,/g,'')) };
                if (key == "atk"){ totalAtk += parseInt(value.replace(/,/g,'')) };
                if (key == "hp"){ totalHp += parseInt(value.replace(/,/g,'')) };
            });
        });

        GM_addStyle(`#crewMemberDiv{overflow:hidden;display:block;}`);

        document.querySelector("#actionSpace").innerHTML = `
        <div class="row">
        <div class="col-6 pr-1">
        <ul class="list-group text-left">
        <li class="list-group-item"><b>Total Power:</b> ${totalPower.toLocaleString()}</li>
        <li class="list-group-item"><b>Total Elemental:</b> ${totalEle.toLocaleString()}</li>
        <li class="list-group-item"><b>Total Resistance:</b> ${totalRes.toLocaleString()}</li>
        <li class="list-group-item"><b>Total God Slayer:</b> ${totalSlayer.toLocaleString()}</li>
        <li class="list-group-item"><b>Total Growth:</b> ${totalGrowth.toLocaleString()}</li>
        </ul>
        </div>
        <div class="col-6 pl-1">
        <ul class="list-group text-left">
        <li class="list-group-item"><b>Total Chaos Damage:</b> ${totalChaos.toLocaleString()}</li>
        <li class="list-group-item"><b>Total Faction Loyalty:</b> ${totalLoyalty.toLocaleString()}</li>
        <li class="list-group-item"><b>Total Wilderness:</b> ${totalWldr.toLocaleString()}</li>
        <li class="list-group-item"><b>Total Attack:</b> ${totalAtk.toLocaleString()}</li>
        <li class="list-group-item"><b>Total Hit Points:</b> ${totalHp.toLocaleString()}</li>
        </ul>
        </div>
        </div>
        `

        await sortableTables();
    };

    async function memberItems(){

        document.querySelector("#actionSpace").innerHTML = `<div><img src="https://studiomoxxi.com/moxximod/loading-gif.gif" style="height:100px;width:100px;padding:20px"></div>`

        const memberData = []
        let count = 0
        const buildTable = async (item) => {
            count++
            const position = count;
            const charId = item.match(/<a href="profile\.php\?id=([0-9]+)">/i)[1];
            const profile = (await superfetch(`profile?id=${charId}`)).replace(/[\n\r]/g,'');
            const name = `<a href='profile.php?id=${charId}'>${profile.match(/<font size="3">(.*?)<\/font>/i)[1]}</a>`;
            const core = profile.match(/left:61px; top:12px; width:41px; height:41px;text-align:center">(.*?)<\/div>/i)[1]
            const head = profile.match(/left:118px; top:7px; width:62px; height:46px;text-align:center">(.*?)<\/div>/i)[1]
            const neck = profile.match(/left:197px; top:12px; width:41px; height:41px;text-align:center">(.*?)<\/div>/i)[1]
            const wepn = profile.match(/left:45px; top:67px; width:56px; height:96px;text-align:center">(.*?)<\/div>/i)[1]
            const body = profile.match(/left:121px; top:67px; width:56px; height:96px;text-align:center">(.*?)<\/div>/i)[1]
            const shld = profile.match(/left:198px; top:67px; width:56px; height:96px;text-align:center">(.*?)<\/div>/i)[1]
            const belt = profile.match(/left:61px; top:192px; width:41px; height:41px;text-align:center">(.*?)<\/div>/i)[1]
            const pant = profile.match(/left:118px; top:175px; width:62px; height:75px;text-align:center">(.*?)<\/div>/i)[1]
            const ring = profile.match(/left:197px; top:192px; width:41px; height:41px;text-align:center">(.*?)<\/div>/i)[1]
            const foot = profile.match(/left:118px; top:262px; width:62px; height:66px;text-align:center">(.*?)<\/div>/i)[1]
            const cgem = profile.match(/left:10px; top:346px; width:32px; height:32px;text-align:center">(.*?)<\/div>/i)[1]
            const bdge = profile.match(/left:214px; top:346px; width:32px; height:32px;text-align:center">(.*?)<\/div>/i)[1]
            const rune = profile.match(/left:54px; top:346px; width:32px; height:32px;text-align:center">(.*?)<\/div>/i)[1]
            const bstr = profile.match(/left:258px; top:346px; width:32px; height:32px;text-align:center">(.*?)<\/div>/i)[1]
            const orbs = profile.match(/left:100px; top:346px; width:99px; height:32px;text-align:center">(.*?)<\/div>/i)[1]
            memberData.push({ position,name,core,head,neck,wepn,body,shld,belt,pant,ring,foot,orbs,cgem,bdge,rune,bstr });
        };
        await Promise.all(crewMembers.map(buildTable));

        memberData.sort((a, b) => a.position - b.position);

        const memberDataWithoutPosition = memberData.map(({ position, ...rest }) => rest);
        const allRows = [];
        memberDataWithoutPosition.forEach(char => {
            const row = [];
            Object.keys(char).forEach(td => {
                row.push(`<td>${char[td]}</td>`);
            });
            allRows.push(`<tr>${row.join('')}</tr>`);
        });
        document.querySelector("#crewMemberTable").innerHTML = `
            <table id="crewMemberTable" class="table">
            <tbody>${allRows.join('')}</tbody>
            </table>
        `

        GM_addStyle(`#crewMemberDiv{overflow:hidden;display:block;}`);

        document.querySelector("#actionSpace").innerHTML = ''
    };

    async function memberSkills(){

        document.querySelector("#actionSpace").innerHTML = `<div><img src="https://studiomoxxi.com/moxximod/loading-gif.gif" style="height:100px;width:100px;padding:20px"></div>`

        const memberData = []
        let count = 0
        const buildTable = async (item) => {
            count++
            const position = count;
            const charId = item.match(/<a href="profile\.php\?id=([0-9]+)">/i)[1];
            const profile = await superfetch(`profile?id=${charId}`);
            const parseData = new DOMParser();
            const profileHtml = parseData.parseFromString(profile, 'text/html');
            const skills = profileHtml.querySelector("#divSkillsCast").innerHTML.replace(/<img src=".*?ProfileSkills\.png">/i,'')
            const name = `<a href='profile.php?id=${charId}'>${profile.match(/<font size="3">(.*?)<\/font>/i)[1]}</a>`;
            memberData.push({ position,name,skills });
        };
        await Promise.all(crewMembers.map(buildTable));

        memberData.sort((a, b) => a.position - b.position);

        const memberDataWithoutPosition = memberData.map(({ position, ...rest }) => rest);
        const allRows = [];
        memberDataWithoutPosition.forEach(char => {
            const row = [];
            Object.keys(char).forEach(td => {
                row.push(`<td>${char[td]}</td>`);
            });
            allRows.push(`<tr>${row.join('')}</tr>`);
        });
        document.querySelector("#crewMemberTable").innerHTML = `
            <table id="crewMemberTable" class="table">
            <tbody>${allRows.join('')}</tbody>
            </table>
        `

        GM_addStyle(`#crewMemberDiv{overflow:hidden;display:block;}`);

        document.querySelector("#actionSpace").innerHTML = ''
    };


    document.querySelector("#showCrewUpgrades").addEventListener('click',function(){
        document.querySelector("#actionSpace").innerHTML = `${crewUpgrades.join(' ')}<br>${crewStones.join(' ')}`
    });

    document.querySelector("#showCrewAllies").addEventListener('click',function(){
        document.querySelector("#actionSpace").innerHTML = crewAllies
    });

    notes(crewName,crewId,server);
};

async function augmentEquip(profileData,server){
    GM_addStyle(`
        .augment-equip-item-div > img {height:40px;width:40px;margin:3px;border-radius:8px;border:2px #475254 SOLID;}
        .selectable-item,.selectable-aug,.selectable-item-table {cursor:pointer}
        .btn-aug {height:40px;width:100%;margin-bottom:10px;}
        .btn-item {padding:10px;height:60px;width:60px;margin:3px;border-radius:16px;border:2px #475254 SOLID;background:#000000;box-shadow:5px 5px 5px rgba(0, 0, 0, 1);}
        #equippedAugDataTable > tbody > tr > td > img{height:30px;width:30px;border-radius:8px;border:2px #475254 SOLID;}
        div.item-action{display:inline-block;cursor:pointer;}
        div.item-action:hover{opacity:0.5;}

    `)

    const slots = ["core","head","neck","weapon","body","shield","belt","pants","ring","foot"]
    const equippedArray = [];
    const equippedItems = Object.fromEntries(Object.entries(profileData).filter(([key]) => slots.includes(key)));
    const equippedIds = Object.values(equippedItems).map(item => item.id);
    for (const item of Object.values(equippedItems)) {
        const id = item.id;
        const img = item.img;
        equippedArray.push(`<img src="${img}" onmouseover="itempopup(event,'${id}')" onmouseout="kill()" class="selectable-item">`);
    };

    const unequippedItems = document.querySelectorAll('div.divItem');
    const unequippedArray = [];
    for (let item of unequippedItems){
        const itemId = item.innerHTML.match(/event,'([0-9]+)'/i)[1];
        if (!equippedIds.includes(itemId)){
            item.querySelector('img').setAttribute('class','selectable-item')
            unequippedArray.push(item.innerHTML);
        };
    };

    const availableAugs = [];
    const allAugs = document.querySelectorAll('div[id^="augment"]');
    for (let aug of allAugs){
        const augId = aug.innerHTML.match(/event,'([0-9]+)'/i)[1];
        aug.querySelector('img').setAttribute('class','selectable-aug');
        aug.querySelector('img').setAttribute('id',`augment-${augId}`);
        availableAugs.push(aug.innerHTML.replace(/onclick="[^"]*"/i,''));
    };

    const backgroundColor = window.getComputedStyle(document.body).backgroundColor;

    document.querySelector("#content").innerHTML = `
        <div class="row justify-content-center">
        <div class="col-lg-5 col-md-5 col-sm-12 col-12 layout-spacing layout-spacing">
        <div class="widget profile-widget mb-3 augment-equip-item-div">
        <h4>EQUIPPED ITEMS</h4>
        ${equippedArray.join('')}
        </div>

        <div class="widget profile-widget mb-3 augment-equip-item-div">
        <h4>OTHER ITEMS</h4>
        ${unequippedArray.join('')}
        </div>

        <div class="widget profile-widget mb-3 augment-equip-item-div" id="availableAugsDiv">
        <h4>AVAILABLE AUGMENTS</h4>
        ${availableAugs.sort().join('')}
        </div>

        </div>

        <div class="col-lg-7 col-md-7 col-sm-12 col-12 layout-spacing">
        <div class="widget profile-widget mb-3" style="display:none;" id="showHideDiv">
        <div id="slottedAugsDropdownMenu" class="mb-3"></div>

        <div style="display:inline-block">
        <div id="augmentEquipSlottedAug" class="mb-3" style="background:${backgroundColor};display:none;margin-right:10px;text-align:left;border:2px #475254 solid;padding:10px;border-radius:5px;"></div><p style="margin-bottom:0px;">
        <div id="augmentEquipSelectedItemDiv" class="mb-3" style="background:${backgroundColor};display:inline-block;text-align:left;margin-right:10px;border:2px #475254 solid;padding:10px;border-radius:5px;"></div>
        <div style="display:inline-block;vertical-align:top;">
        </div>
        </div>
        <div style="display:inline-block;vertical-align:top;">
        <div id="selectedAugDiv">
        </div>
        <div style="display:inline-block;">
        <button class="btn-mm btn-aug" id="btnAddAugment">Add Augment</button><br>
        <button class="btn-mm btn-aug" id="btnAutoSelectThisType">Auto Select This Type</button><br>
        <button class="btn-mm btn-aug" id="btnClearAutoSelect">Clear Auto Select Type</button>
        <center>

        <div id="btnAddNewSlot" class="item-action">
        <img src="https://torax.outwar.com/images/addaugs.jpg" class="btn-item" onmouseover="statspopup(event,'<b>MoxxiMod+</b><br>Add Augment Slot')" onmouseout="kill()">
        <div id="cntAddNewSlot" class="item-count"></div>
        </div>
        <div id="btnRemoveAug" class="item-action">
        <img src="https://torax.outwar.com/images/items/AugmentRemover.gif" class="btn-item" onmouseover="statspopup(event,'<b>MoxxiMod+</b><br>Remove Augment')" onmouseout="kill()">
        <div id="cntRemoveAug" class="item-count"></div>
        </div>
        <div id="btnRemoveAllAugs" class="item-action">
        <img src="https://torax.outwar.com/images/items/AllAugmentRemover.png" class="btn-item" onmouseover="statspopup(event,'<b>MoxxiMod+</b><br>Remove All Augments')" onmouseout="kill()">
        <div id="cntRemoveAllAugs" class="item-count"></div>
        </div>
        </div>
        </div>
        </div>

        <div class="widget profile-widget mb-3">
        <h4>EQUIPPED AUG DATA</h4>
        <div id="equippedAugDataDiv"><img src="https://studiomoxxi.com/moxximod/loading-gif.gif" style="width:35px;height:35px;"></div>
        </div>
        </div>
        </div>
        </div>
    `

    const selectableItems = document.querySelectorAll('img.selectable-item');
    for (let item of selectableItems){
        item.addEventListener('click', async function itemClick(event) {

            item.removeEventListener('click', itemClick);

            document.querySelector("#augmentEquipSlottedAug").style.display = "none";

            const itemId = item.outerHTML.match(/event,'([0-9]+)'/i)[1];
            await augmentEquipItemHandler(itemId);
            await getItemCounts();

            item.addEventListener('click', itemClick);
        });
    };


    document.querySelector("#btnAddAugment").addEventListener('click', async function(){
        addAugment();
    });
    document.addEventListener("keydown", function(event) {
        if (event.ctrlKey && event.code === "Space") {
            addAugment();
        };
    });

    async function addAugment(){
        const itemDiv = document.querySelector("#selectedItemId");
        const augDiv = document.querySelector("#selectedAugId");
        const dropDown = document.querySelector("#selectAugDropdown").value;
        if (!itemDiv){
            alert('Please select an item before trying to add an augment');
            return;
        };
        if (!dropDown.match(/slot"([^"]*)"/i)){
            alert('Please select an augment slot from the dropdown menu');
            return;
        };
        if (!augDiv){
            alert('Please select an augment');
            return;
        };
        if (dropDown.match(/id"([^"]*)"/i)){
            const confirm = window.confirm('Are you sure you want to overwrite the existing augment?');
            if (!confirm){
                return;
            };
        };
        const itemId = itemDiv.innerHTML
        const augId = augDiv.innerHTML
        const slotNum = dropDown.match(/slot"([^"]*)"/i)[1];

        const fetchNonce = await superfetch(`getiteminfo.php?id=${itemId}&augmentid=${augId}`);
        const formNonce = fetchNonce.match(/name="form-nonce" value="([^"]*)"/i)[1];
        const postBody = `form-itemid=${itemId}&form-augmentid=${augId}&form-slotid=${slotNum}&form-nonce=${formNonce}&form-submitted=Augment+Item%21`
        await superpost('augmentequip', postBody);
        document.querySelector("#augmentEquipSelectedItemDiv").innerHTML = '<img src="https://studiomoxxi.com/moxximod/loading-gif.gif">'

        document.querySelector(`#augment-${augId}`).remove();

        document.querySelector("#selectedAugDiv").innerHTML = '';
        document.querySelector("#augmentEquipSlottedAug").style.display = "none";

        await augmentEquipItemHandler(itemId);
    }


    if (GM_getValue("auth").match("Full")){
        document.querySelector("#btnAddNewSlot").addEventListener('click', async function(){
            const itemDiv = document.querySelector("#selectedItemId");
            if (!itemDiv){
                alert('Please select an item before trying to add an augment');
                return;
            };
            const confirm = window.confirm('Are you sure you want to add an augment slot to this item?');
            if (!confirm){
                return;
            };
            const itemId = itemDiv.innerHTML
            const postBody = `item=${itemId}&submit=Submit`
            const post = await superpost('addaug', postBody);
            if (post.match('This item already has 5 augment slots')){
                alert('Error: This item already had 5 augment slots');
                return;
            };
            if (post.match('You do not have an add aug item')){
                alert('Error: You do not have an add aug item');
                return;
            };
            await augmentEquipItemHandler(itemId);
            await getItemCounts();
        });
    } else {
        document.querySelector("#btnAddNewSlot > img").setAttribute('style','opacity:0.33');
    };


    if (GM_getValue("auth").match("Full")){
        document.querySelector("#btnRemoveAug").addEventListener('click', async function(){
            const itemDiv = document.querySelector("#selectedItemId");
            const dropDown = document.querySelector("#selectAugDropdown").value;
            if (!itemDiv){
                alert('Please select an item before trying to remove augments');
                return;
            };
            if (!dropDown.match(/id"([^"]*)"/i)){
                alert('Please select an augment slot from the dropdown menu');
                return;
            };
            const confirm = window.confirm('Are you sure you want to remove this augment?');
            if (!confirm){
                return;
            };
            const itemId = itemDiv.innerHTML
            const slotNum = dropDown.match(/slot"([^"]*)"/i)[1];
            const postBody = `form-itemid=${itemId}&form-slotid=${slotNum}&form-removesubmitted=Remove+Augment%21`
            const post = await superpost('augmentremove', postBody);
            if (post.match('You do not own the item required to use this page')){
                alert('Error: You do not have a remove augment item');
                return;
            };
            document.querySelector("#augmentEquipSlottedAug").style.display = "none";
            await augmentEquipItemHandler(itemId);
            await getItemCounts();
        });
    } else {
        document.querySelector("#btnRemoveAug > img").setAttribute('style','opacity:0.33');
    };


    if (GM_getValue("auth").match("Full")){
        document.querySelector("#btnRemoveAllAugs").addEventListener('click', async function(){
            const itemDiv = document.querySelector("#selectedItemId");
            if (!itemDiv){
                alert('Please select an item before trying to remove augments');
                return;
            };
            const confirm = window.confirm('Are you sure you want to remove all the augments from this item?');
            if (!confirm){
                return;
            };
            const itemId = itemDiv.innerHTML
            const postBody = `form-itemid=${itemId}&form-slotid=1&form-removeall=Remove+ALL+Augments%21`
            const post = await superpost('augmentremove', postBody);
            if (post.match('You do not own the item required to use this page')){
                alert('Error: You do not have a remove all augments item');
                return;
            };
            await augmentEquipItemHandler(itemId);
            await getItemCounts();
        });
    } else {
        document.querySelector("#btnRemoveAllAugs > img").setAttribute('style','opacity:0.33');
    };


    document.querySelector("#btnAutoSelectThisType").addEventListener('click', async function(){
        const selectedAug = document.querySelector("#selectedAugDiv").innerHTML.match(/img src="([^"]*)"/i);
        if (!selectedAug){
            alert('Please select an augment');
            return;
        };
        const selectedAugImg = selectedAug[1];
        GM_setValue('autoSelectAug', selectedAugImg);
        alert('Autoselect saved');
    });


    document.querySelector("#btnClearAutoSelect").addEventListener('click', async function(){
        GM_deleteValue('autoSelectAug');
        alert('Cleared auto select');
    });


    const equippedAugDataRows = [];
    async function getAugs(item){
        const itemId = item.match(/event,'([0-9]+)'/i)[1];
        const itemData = await superfetchItem(itemId);
        const itemImg = itemData.img;
        const augIdArray = itemData.augids;
        async function getAugData(augId){
            const augData = await superfetchItem(augId);
            const augImg = augData.img;
            const augEle = augData.ele;
            const augPower = augData.atk + augData.hp;
            const augChaos = augData.chaosdmg;
            const augMr = augData.maxrage;
            const augVile = augData.vile;
            const augRatio = (augData.maxrage / augData.rpt).toFixed(1);
            equippedAugDataRows.push(`
                <tr>
                <td><img src="${augImg}" onmouseover="itempopup(event,'${augId}')" onmouseout="kill()"></td>
                <td><img src="${itemImg}" class="selectable-item-table" alt="event,'${itemId}'"></td>
                <td>${augEle.toLocaleString()}</td>
                <td>${augPower.toLocaleString()}</td>
                <td>${augChaos}</td>
                <td>${augMr.toLocaleString()}</td>
                <td>${augVile.toLocaleString()}</td>
                <td>${augRatio}</td>
                </tr>
            `)
        };
        await Promise.all(augIdArray.map(getAugData));
    };
    await Promise.all(equippedArray.map(getAugs));
    document.querySelector("#equippedAugDataDiv").innerHTML = `
    <table class="table table-striped sortable" id="equippedAugDataTable">
    <thead><tr><th>Aug</th><th>Item</th><th>Ele</th><th>Power</th><th>Chaos</th><th>Max rage</th><th>vile</th><th>rpt:mr</th></tr></thead>
    <tbody>${equippedAugDataRows.join('')}</tbody>
    </table>
    `
    const selectableItemsTable = document.querySelectorAll('img.selectable-item-table');
    for (let item of selectableItemsTable){
        item.addEventListener('click', async function itemClick(event) {

            item.removeEventListener('click', itemClick);

            document.querySelector("#augmentEquipSlottedAug").style.display = "none";

            const itemId = item.outerHTML.match(/event,'([0-9]+)'/i)[1];
            await augmentEquipItemHandler(itemId);
            await getItemCounts();

            item.addEventListener('click', itemClick);
        });
    };
    await sortableTables();


    async function augmentEquipItemHandler(itemId){
        const rollover = await superfetch(`item_rollover.php?id=${itemId}`, true);
        document.querySelector("#augmentEquipSelectedItemDiv").innerHTML = `
            Selected Item:
            <span id="selectedItemId">${itemId}</span>
            <br>
            ${rollover}
        `

        document.querySelector("#slottedAugsDropdownMenu").innerHTML = `<select class="form-control" id="selectAugDropdown"><option value="" disabled selected hidden>Select slot...</option></select>`

        const firstOpenSlot = [];

        const itemAugs = rollover.match(/(event,'[0-9]+_[0-9]+'|augslot\.jpg)/g);
        if (itemAugs){
            for (var i = 0; i < itemAugs.length; i++){
                const string = itemAugs[i];
                if (string == "augslot.jpg"){
                    const newOption = document.createElement('option');
                    newOption.value = `slot"${i + 1}"`;
                    newOption.text = `${i + 1}. Open augment slot`;
                    document.querySelector("#selectAugDropdown").add(newOption)
                    if (firstOpenSlot.length == 0){
                        firstOpenSlot.push(`slot"${i + 1}"`);
                    };
                } else {
                    const augId = string.match(/[0-9]+_[0-9]+/i);
                    const fetchAug = await superfetch(`item_rollover.php?id=${augId}`, true);
                    const augName = (fetchAug.match(/align="left">(.*?)<\/td>/i) || ['',''])[1].replace('td colspan="2"','a');
                    const newOption = document.createElement('option');
                    newOption.value = `slot"${i + 1}" id"${augId}"`;
                    newOption.text = `${i + 1}. ${augName}`;
                    document.querySelector("#selectAugDropdown").add(newOption)
                };
            };
        };

        if (firstOpenSlot[0]){
            document.querySelector("#selectAugDropdown").value = firstOpenSlot[0];
        };

        document.querySelector("#selectAugDropdown").addEventListener('change', async function(){
            const selectedValue = this.value;
            const selectedSlot = selectedValue.match(/slot"([^"]*)"/i)[1];
            const selectedAugId = selectedValue.match(/id"([^"]*)"/i)
            if (selectedAugId){
                const augId = selectedAugId[1];
                const fetchAug = await superfetch(`item_rollover.php?id=${augId}`);
                document.querySelector("#augmentEquipSlottedAug").innerHTML = `Slotted Augment (slot ${selectedSlot})<br>` + fetchAug;
                document.querySelector("#augmentEquipSlottedAug").style.display = "inline-block"
            } else {
                document.querySelector("#augmentEquipSlottedAug").innerHTML = `Unused augment slot ${selectedSlot}`;
            }
        });

        document.querySelector("#showHideDiv").style.display = "block";

        const selectableAugs = document.querySelectorAll('img.selectable-aug');
        for (let aug of selectableAugs){
            aug.addEventListener('click', async function(){
                await selectAug(aug);
            });
        };

        if (GM_getValue('autoSelectAug')){
            const augToAutoSelect = GM_getValue('autoSelectAug');
            const lookForAug = Array.from(document.querySelectorAll("#availableAugsDiv img")).find(img => img.src.includes(augToAutoSelect));
            if (lookForAug){
                await selectAug(lookForAug);
            };
        };

        async function selectAug(aug){
            const augId = aug.outerHTML.match(/event,'([0-9]+)'/i)[1];
            const rollover = await superfetch(`item_rollover.php?id=${augId}`);
            document.querySelector("#selectedAugDiv").innerHTML =
            `<div class="mb-3" style="background:${backgroundColor};display:inline-block;text-align:left;margin-right:10px;border:2px #475254 solid;padding:10px;border-radius:5px;">
            Selected augment: <span id="selectedAugId">${augId}</span><br> ${rollover}
            `
        };
    };

    async function getItemCounts(){
        let addAug = 0;
        let removeAug = 0;
        let removeAllAug = 0;
        const vault = await superfetch('vault',true);
        if (vault.match(/addaugs\.jpg/g)){ addAug += vault.match(/addaugs\.jpg/g).length };
        if (vault.match(/AugmentRemover\.gif/g)){ removeAug += vault.match(/AugmentRemover\.gif/g).length };
        if (vault.match(/AllAugmentRemover\.png/g)){ removeAllAug += vault.match(/AllAugmentRemover\.png/g).length };
        document.querySelector("#cntAddNewSlot").innerHTML = addAug + "x";
        document.querySelector("#cntRemoveAug").innerHTML = removeAug + "x";
        document.querySelector("#cntRemoveAllAugs").innerHTML = removeAllAug + "x";
    };

    await toolTip('Ctrl + Space to add an augment to an item once selected');

};


async function augmentEquipOLD(server){

    document.querySelector("#content-header-row > div > div:nth-child(1)").setAttribute('style','display:none;');

    document.querySelector("#content-header-row > div > div:nth-child(2)").classList.add("widget");

    document.body.setAttribute('style','overflow-y:scroll;')


    let wasAnAugmentClicked = false;

    const addAugText = document.querySelector("#content-header-row > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(2)")
    addAugText.innerHTML = addAugText.innerHTML.replace(/You have no augments in this category/g,'')
    var augChange = document.querySelector("#item-container")
    const addAugWidget = document.querySelector("#content-header-row > div > div.row.widget > div:nth-child(2) > div:nth-child(1)")
    let observer = new MutationObserver(mutationRecords => {
        addAug();
    });
    observer.observe(augChange, {
      childList: true,
      subtree: true,
      characterDataOldValue: true
    });
    addAug();
    function addAug(){

        const selectedAug = document.querySelector('h3[style="text-align:center;"]')
        if (document.querySelector("#item-container").innerHTML.match(/src="\/images\/augslot\.jpg"><h5>Slot ([0-9]+)<\/h5>/i) && selectedAug){
            var openAug = document.querySelector("#item-container").innerHTML.match(/src="\/images\/augslot\.jpg"><h5>Slot ([0-9]+)<\/h5>/i)[1]
            document.querySelector("#form-slotid").value = openAug;
        };

        if (addAugWidget && !wasAnAugmentClicked){
            if (GM_getValue("savedAug")){
                const savedAugImg = GM_getValue("savedAug")
                const savedAugLookup = document.querySelectorAll(`img[src="${savedAugImg}"]`)
                for (let aug of savedAugLookup){
                    if (aug.hasAttribute('onclick') && !wasAnAugmentClicked){
                        aug.click();
                        wasAnAugmentClicked = true;
                    };
                };
            };
        };

        if (addAugWidget && !document.querySelector("#saveAugType") && selectedAug){
            const newDivElement = document.createElement("div");
            newDivElement.setAttribute('id','saveAugType');
            newDivElement.setAttribute('class','col-inner');
            newDivElement.setAttribute('style','padding:10px;');
            newDivElement.innerHTML = `<button id="saveAugName" class="btn btn-primary" style="margin-rght:15px;">Auto Select This Aug</button><button id="clearAugName" class="btn btn-primary" style="margin-left:15px;">Clear Save</button><p>`
            addAugWidget.appendChild(newDivElement);
            document.querySelector("#saveAugName").addEventListener("click", function(){
                const augImgName = document.querySelector("#item-container").innerHTML.match(/Selected Augment.*[\n\r].*/).toString().match(/src="([^"]*)"/i)[1];
                GM_setValue("savedAug", augImgName);
                alert('Will auto-select this augment when adding augs')
            });
            document.querySelector("#clearAugName").addEventListener("click", function(){
                GM.deleteValue("savedAug")
                alert('Saved augment has been cleared')
            });
        }
    }

};


async function trade(){

    if (document.body.innerHTML.match('This trade has been completed!') || url.match("usertradelog") || url.match("tradepost")){
        return;
    };

    const otherName = document.body.innerHTML.replace(/[\n\r]/g,'').replace(/\s+/g,'').match(/<h1>Tradingwith(.*?)<\/h1>/i)[1];

    GM_addStyle(`
    #divTrade > div > div > img {min-width:50px;min-height:50px;margin-bottom:7px;}
    #divTrade > div > div > p {position:relative;top:0px;height:15px;width:50px;left:0px;font-size:10px !important;border: SOLID 1px #2B2B2B;}
    button.btn-mm{font-size:11px;padding:0.5rem;}
    #otherGuy > a{color:#00CC00;}
    #otherGuy > a:hover{color:#FFFFFF;}
    hr {margin-top:15px;margin-bottom:15px;}
    .treasury-box{ font-size: 12px; margin-bottom:1rem; }
    `);

    const myaccount = await superfetch('myaccount');

    const slotDiv = document.querySelectorAll("#divTrade > div")
    const removeNoItems = async (div) => {
        if (div.innerHTML.toString().match('You have no items in this category')){
            div.remove();
        };
    };
    await Promise.all([...slotDiv].map(removeNoItems));

    const slotHeader = document.querySelectorAll("#divTrade > div > h1")
    const removeHeaders = async (header) => {
        header.remove();
    };
    await Promise.all([...slotHeader].map(removeHeaders));

    const quantityP = document.querySelectorAll("#divTrade > div > div > p")
    const formatQuantity = async (qnt) => {
        qnt.setAttribute('class','form-control-new')
    };
    await Promise.all([...quantityP].map(formatQuantity));

    const myOffer = document.querySelector("#divTradeMyOffer");
    const theirOffer = document.querySelector("#divTradeTheirOffer");
    if (myOffer && theirOffer){
        myOffer.classList.remove('col-lg-6')
        theirOffer.classList.remove('col-lg-6')
        myOffer.classList.add('col-lg-5')
        theirOffer.classList.add('col-lg-5')
    };

    var parentDiv = document.querySelector("#divTradeData")
    var newDiv = document.createElement("div");
    newDiv.className = "col-12 col-lg-2";
    newDiv.setAttribute('style','padding:19px;display:inline-block;overflow:hidden;')
    newDiv.innerHTML = `
    <strong>Menu</strong>
    <div class="divBlackBox statbox widget box box-shadow" style="border: 4px solid #2B2B2B;font-family:monospace;">
    TOTAL ITEMS<br><input style="width:120px;margin-bottom:1rem;" id="totQnty" type="text" class="form-control-new" autocomplete="off" value="0" disabled>
    DEFAULT QNT<br><input style="width:120px;margin-bottom:1rem;" id="defQnty" type="text" class="form-control-new" autocomplete="off">
    <div class="btn-group show" role="group">
    <button type="button" class="treasury-box form-control-new dropdown-toggle" data-toggle="dropdown">SELECT <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg></button>
    <div id="tradeQuickSelect" class="dropdown-menu" style="will-change: transform; position: absolute; transform: translate3d(0px, 38px, 0px); top: 0px; left: 0px;">
    <a class="dropdown-item select-all" id="all" href="javascript:void(0);">ALL ITEMS</a>
    <a class="dropdown-item select-all" id="blackhand" href="javascript:void(0);">BLACKHAND ITEMS</a>
    <a class="dropdown-item select-all" id="dragon" href="javascript:void(0);">DRAGON ITEMS</a>
    <a class="dropdown-item select-all" id="basicaugs" href="javascript:void(0);">BASIC AUGS</a>
    <a class="dropdown-item select-all" id="amulets" href="javascript:void(0);">AMULETS</a>
    </div>
    </div>
    <p>
    <img src="https://studiomoxxi.com/moxximod/toolbareq.png" style="margin-right:0.5rem;cursor:pointer;" onmouseover="statspopup(event,'<b>${otherName}s Equipment<b>')" onmouseout="kill()" id="theirEq">
    </div>`

    if (document.body.innerHTML.match('You have accepted this trade')){
        const parseData = new DOMParser();
        const myAccount = parseData.parseFromString(myaccount, 'text/html');
        const charsTable = myAccount.querySelector("#zero-config").innerHTML;
        const otherId = document.body.innerHTML.match(/name="tradeWith" value="([0-9]+)"/i)[1]
        const idMatch = new RegExp(`outwar\\.com\/world\\?suid=${otherId}`);
        if (charsTable.match(idMatch)){
            document.querySelector("#divTradeMyOffer > div:nth-child(4)").innerHTML = `
            <div id="otherGuy">
            <a href="trade?suid=${otherId}">Go to ${otherName}</a>
            </div>
            `
        };
    };

    const lists = {
        blackhand: ['Soul of Blackhand Reborn','Myrmidon Helm Reborn','Trinket of Aridity Reborn','Blackhand Reborn','Prophecy Mail Reborn','Incredible Tower Shield Reborn','Cord of Freezing Winds Reborn','Interstellar Leggings Reborn','Ring of the Sea Reborn','Boots of the Eagle Reborn'],
        basicaugs: ['Augment'],
        dragon:  ['Eye of Dalinda','Sinister Dragon Helm','Blade of Xiuhcoatl','Winged Serpents Armor','Gem Scale Shield','Encased Serpents Soul','Strap of Ananta Boga','Studded Legs of Draco','Horned Dragon Boots'],
        amulets: ['Amulet Chest (10)','Amulet Chest (20)','Amulet Chest (25)','Amulet Chest (30)','Amulet Chest (40)','Amulet Chest (50)']
    };

    const divItem = document.querySelectorAll(".divItem");

    for (let i = 0; i < divItem.length; i++) {

        const itemName = divItem[i].outerHTML.match(/alt="([^"]*)"/i)[1];

        if (!itemName.match('Amulet Chest') && !itemName.match('Skull of Demonology')){
            divItem[i].classList.add("all");
        };

        for (const key in lists){
            if (lists[key].includes(itemName)){

                divItem[i].classList.add(key);
            };
        };

        divItem[i].addEventListener("click", async function() {

            const maxItems = parseInt(divItem[i].outerHTML.match(/event, '[^']*', '[^']*', '[^']*', '([0-9]+)'/i)[1]);

            if (maxItems > 1){

                let setValue = GM_getValue("tradeQuantity")
                if (setValue > maxItems){
                    setValue = maxItems;
                };

                if (GM_getValue("tradeQuantity")){
                    document.querySelector("#cauldronqtyspinner").value = setValue;
                };
            };
        });
    };

    var child = parentDiv.firstElementChild.nextElementSibling;
    parentDiv.insertBefore(newDiv, child);

    const selectAllButtons = document.querySelectorAll(".select-all");
    for (let i = 0; i < selectAllButtons.length; i++) {
        var button = selectAllButtons[i];
        const buttonId = button.id

        button.addEventListener("click", async function() {

            const items = document.querySelectorAll(`.${buttonId}`)

            const selectAll = async (item) => {

                const maxItems = parseInt(item.outerHTML.match(/event, '[^']*', '[^']*', '[^']*', '([0-9]+)'/i)[1]);
                const tradeWith = document.body.innerHTML.match(/name="tradeWith" value="([0-9]+)"/i)[1]
                const isCrewTrade = document.body.innerHTML.match(/id="isCrewTrade" value="([0-9]+)"/i)[1]
                const itemId = item.outerHTML.match(/event, '([^']*)', '[^']*', '[^']*'/i)[1];
                const itemHash = item.outerHTML.match(/event, '[^']*', '[^']*', '([^']*)'/i)[1];

                const response = await fetch(`trade.php?tradeWith=${tradeWith}&isCrewTrade=${isCrewTrade}&qty=${maxItems}&addItem=${itemId}&addHash=${itemHash}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                });
                if (response){
                    window.location.href =  `trade?isCrewTrade=${isCrewTrade}`
                };
            };
            await Promise.all([...items].map(selectAll));
        });
    };


    const quantityText = document.querySelector("#defQnty")
    if (GM_getValue('tradeQuantity')){
        quantityText.value = GM_getValue('tradeQuantity');
    };
    document.querySelector("#defQnty").addEventListener('input', async function(){
        const defaultQuantityValue = quantityText.value
        GM_setValue('tradeQuantity',defaultQuantityValue);
    });


    document.querySelector("#theirEq").addEventListener('click', async function(){
        const tradeWith = document.body.innerHTML.match(/name="tradeWith" value="([0-9]+)"/i)[1]
        const profileData = await superfetchProfile(`profile?id=${tradeWith}`);
        createWindow(`${otherName}'s Equipment`, "their_eq", 300, 100, 0);
        document.querySelector("#their_eq_content").innerHTML = profileData.thedude.replace(/<div class="[^"]*">/g,'');
    });


    const countItems = []
    const spans = document.querySelectorAll('span.boxItem');
    for (const span of spans){
        const count = span.innerHTML.match(/<p>([0-9]+)<\/p>/i)?.[1] || "1";
        countItems.push(parseInt(count));
    };
    document.querySelector("#totQnty").value = countItems.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

};

async function closedPvpNew(profileData,server,charid){

    GM_addStyle(`
        h6 { margin-left:0.25rem; margin-right:0.25rem; }
        .widget {border-radius:0px; padding:10px; }
        .justify-left { text-align:left; }
        .home-container { display:flex; justify-content: space-between; gap:10px; }
        .row-1 { height: 520px; max-height: 520px; overflow:hidden; }
        .box  { flex:1; }
        #popSkillsAndPotions > img { height:50px; width:50px; margin:3px; border-radius:8px; box-shadow: 0 0 5px rgba(0,0,0,1); background:#000000; cursor:pointer; border:2px SOLID #475254;}
        .small-table-img { height:25px; width:25px; margin:5px; border-radius:8px; box-shadow: 0 0 5px rgba(0,0,0,1); background:#000000; cursor:pointer; border:2px SOLID #475254;}
        #skillsDiv > img { height:25px; width:25px; margin:3px; border-radius:8px; box-shadow: 0 0 5px rgba(0,0,0,1); background:#000000; cursor:pointer; border:2px SOLID #475254;}
        .loading { height:30px; width:30px; margin:1rem; }
        tr.attacked{ display: none; }
        button.form-control-new { font-family:monospace; font-size:14px; }
        .red-neg { filter: hue-rotate(-45deg) saturate(200%); }
        .green-neg { filter: hue-rotate(60deg) saturate(200%); }
        #skills_potions,#popSkillsAndPotions { width:336px; text-align:left; }
    `);

    const brawlType = window.location.href.match('type=1') ? 1 : 0;
    const brawlName = brawlType == 0 ? "OPEN" : brawlType == 1 ? "FACTION" : "";
    const brawlActive = document.body.innerHTML.match('BRAWL IS ACTIVE') ? true : false;
    const brawlEntered = document.body.innerHTML.match('You are entered into the brawl') ? true : false;
    const brawlInfo = document.querySelector('ul.striped-list.text-left.list-group');


    const charData = [];
    const node = Array.from(document.querySelectorAll('div.widget-content')).find(i => !i.innerHTML.includes('<h4>') && i.innerHTML.includes('<table class="table table-striped">'));
    if (!node){ return; };
    const oldTableRows = node.querySelectorAll('table tbody tr');
    if (brawlType == 1){
        for (const row of oldTableRows){
            const cells = row.querySelectorAll("td");
            const rank = cells[0].innerHTML.replace('.','');
            const frank = cells[1].innerHTML.replace('.','');
            const faction = cells[2].innerHTML
            const charid = cells[3].outerHTML.match(/id=([0-9]+)/i)?.[1] || "0";
            const name = cells[3].textContent
            const wins = cells[4]?.textContent.trim() || "";
            const damage = cells[5]?.innerHTML.trim() || "";
            const attacks = cells[6]?.textContent.trim() || "0";
            charData.push({
                rank: rank, frank: frank, faction: faction, charid: charid, name: name, wins: wins, damage: damage, attacks: attacks
            });
        };
    } else if (brawlType == 0){
        for (const row of oldTableRows){
            const cells = row.querySelectorAll("td");
            const rank = cells[0].innerHTML.replace('.','');
            const charid = cells[1].outerHTML.match(/id=([0-9]+)/i)?.[1] || "0";
            const name = cells[1].textContent
            const wins = cells[2]?.textContent.trim() || "";
            const damage = cells[3]?.innerHTML.trim() || "";
            const attacks = cells[4]?.textContent.trim() || "0";
            charData.push({
                rank: rank, frank: "", faction: "N/A", charid: charid, name: name, wins: wins, damage: damage, attacks: attacks
            });
        };
    };


    document.querySelector("#content").innerHTML = `
    <div class="home-container">
        <div class="box row-1" style="display:flex; flex-direction:column;">
            <div class="widget mb-2" id="box4">
            <img src="https://studiomoxxi.com/moxximod/loading-gif.gif" class="loading">
            </div>
            <div class="widget mb-2" id="box7">
            <img src="https://studiomoxxi.com/moxximod/loading-gif.gif" class="loading">
            </div>
            <div class="widget" id="box5" style="flex-grow:1;align-content:center;">
            <img src="https://studiomoxxi.com/moxximod/loading-gif.gif" class="loading">
            </div>
        </div>
        <div class="box row-1" style="display:flex; flex-direction:column;">
            <div class="widget mb-2" id="box2" style="flex-grow:1;">
            <img src="https://studiomoxxi.com/moxximod/loading-gif.gif" class="loading">
            </div>
            <div class="widget" id="box1">
                <div style="display:inline-block;height:100%;text-align:center;margin-right:0.5rem;">
                <table>
                <tr><td><h6>SUNDER ARMOR</h6></td></tr>
                <tr><td><input type="text" autocomplete="off" style="margin-bottom:0.5rem;" id="sunder1" class="list-group-item"></td></tr>
                <tr><td><input type="text" autocomplete="off" style="margin-bottom:0.5rem;" id="sunder2" class="list-group-item"></td></tr>
                <tr><td><input type="text" autocomplete="off" style="margin-bottom:0.5rem;" id="sunder3" class="list-group-item"></td></tr>
                <tr><td><button class="form-control-new" style="border-radius:0px;" id="castSunder">CAST</button></td></tr>
                </table>
                </div>
                <div style="display:inline-block;height:100%;text-align:center;margin-left:0.5rem;">
                <table>
                <tr><td><h6>POISON DART</h6></td></tr>
                <tr><td><input type="text" autocomplete="off" style="margin-bottom:0.5rem;" id="dart" class="list-group-item"></td></tr>
                <tr><td><button class="form-control-new" style="border-radius:0px;" id="castDart">CAST</button></td></tr>
                </table>
                </div>
            </div>
        </div>
        <div class="box widget mb-2 row-1" id="box3">
            <img src="https://studiomoxxi.com/moxximod/loading-gif.gif" class="loading">
        </div>
    </div>
    <div class="box widget mb-2 row-2 justify-left" id="box6">
        <img src="https://studiomoxxi.com/moxximod/loading-gif.gif" class="loading">
    </div>
    `

    document.querySelector("#box4").innerHTML = `
    <table class="table table-striped">
    <tr><td>NAME</td><td>${profileData.name}</td></tr>
    <tr><td>FACTION</td><td>${profileData.faction}</td></tr>
    <tr><td>POWER</td><td>${profileData.power.toLocaleString()}</td></tr>
    <tr><td>ELEMENTAL</td><td>${profileData.elemental.toLocaleString()}</td></tr>
    <tr><td>CHAOS</td><td>${profileData.chaos.toLocaleString()}</td></tr>
    <tr><td>STRENGTH</td><td>${profileData.strength}%</td></tr>
    </table>
    `


    document.querySelector("#box7").innerHTML = brawlInfo.outerHTML;


    document.querySelector("#box2").innerHTML =
    `<h6>Your Skills & Potions</h6>` +
    `<div id="skillsDiv">${profileData.skills.images.join('')}</div>`


    getSkillLog();
    async function getSkillLog(){
        const castSkills = await superfetch("cast_skills");
        const parseData = new DOMParser();
        const skillsDoc = parseData.parseFromString(castSkills, 'text/html');
        const logTable = skillsDoc.querySelector("table.table.table-bordered.table-striped.mb-4");
        document.querySelector("#box3").innerHTML = `<div style="height:100%;overflow:hidden;"><h6>Skill Log</h6><table class="table table-striped" id="logTable">${logTable.innerHTML}</table></div>`;
    };


    brawlData();
    const skillsData = {}
    async function brawlData(){
        const newTableRows = [];
        const parseCharData = async (char) => {

            const profileDataTarget = await superfetchProfile(`profile?id=${char.charid}`);
            skillsData[char.charid] = profileDataTarget.skills.images;

            const cop = profileDataTarget.skills.data.find(i => i.name == "Circle of Protection")?.time || "-";

            const negs = [];
            const negSkillsReceived = profileData.skills.data.filter(i => i.cast == char.name);
            for (const negSkill of negSkillsReceived){
                const str = `<img src="${negSkill.img}" class="small-table-img red-neg" onmouseover="popup(event,'<b>${negSkill.name}</b><br /><br />${negSkill.time} mins left<br>Cast By ${negSkill.cast}')" onmouseout="kill()">`
                if (char.name != profileData.name){ negs.push(str) };
            };
            const negSkillsCast = profileDataTarget.skills.data.filter(i => i.cast == profileData.name);
            for (const negSkill of negSkillsCast){
                const str = `<img src="${negSkill.img}" class="small-table-img green-neg" onmouseover="popup(event,'<b>${negSkill.name}</b><br /><br />${negSkill.time} mins left<br>Cast By ${negSkill.cast}')" onmouseout="kill()">`
                if (char.name != profileData.name){ negs.push(str) };
            };
            if (negs.length == 0){
                negs.push("-");
            };

            const crewName = profileDataTarget.crewname;
            const crewId = profileDataTarget.crewid;
            const crewProfile = await superfetch(`crew_profile?id=${crewId}`);
            const crewImg = crewProfile.match(/https:\/\/upload\.outwar\.com\/crewuploaded\/[A-Za-z][0-9]+\.[A-Za-z]+/i)?.[0];

            const attack10x = profileDataTarget.name != profileData.name && char.attacks != "10" ? `<button class="form-control-new attack-10x" data-id="${char.charid}">ATK 10x</button></td>` : "-"
            const waitForCop = profileDataTarget.name != profileData.name && char.attacks != "10" ? `<button class="form-control-new wait-for-cop" data-coptime="${cop}" data-id="${char.charid}">COP WAIT</button>` : "-"

            const playerPower = profileData.power;
            const targetPower = profileDataTarget.power;
            let power;
            if (targetPower == 0){power = "suspended" }
            else if (Math.abs(playerPower-targetPower) <= (playerPower*0.0375)){power = `<font color="#ffea00">${targetPower.toLocaleString()}</font>`}
            else if ((targetPower-playerPower) >= (playerPower*0.0375)){power = `<font color="#d40000">${targetPower.toLocaleString()}</font>`}
            else if ((playerPower-targetPower) >= (playerPower*0.0375)){power = `<font color="#00dc24">${targetPower.toLocaleString()}</font>`};

            const playerEle = profileData.elemental;
            const targetEle = profileDataTarget.elemental;
            let ele;
            if (targetEle == 0){ele = "suspended" }
            else if (Math.abs(playerEle-targetEle) <= (playerEle*0.0375)){ele = `<font color="#ffea00">${targetEle.toLocaleString()}</font>`}
            else if ((targetEle-playerEle) >= (playerEle*0.0375)){ele = `<font color="#d40000">${targetEle.toLocaleString()}</font>`}
            else if ((playerEle-targetEle) >= (playerEle*0.0375)){ele = `<font color="#00dc24">${targetEle.toLocaleString()}</font>`};

            const skillsLength = profileDataTarget.skills.images.length;

            const rowStyle = char.attacks == "10" ? `attacked` : "";
            const chestFaction = parseInt(char.frank) <= 10 ? "💎" : "";
            const chestBrawl = parseInt(char.rank) <= 30 ? "💰" : "";
            newTableRows.push({
                position: char.rank,
                html:
                    `<tr class="${rowStyle}">` +
                    `<td>${char.faction}</td>` +
                    `<td>${char.rank} ${chestBrawl} </td>` +
                    `<td>${char.frank} ${chestFaction}</td>` +
                    `<td><img src="${crewImg}" class="small-table-img" onmouseover="popup(event,'<b>${crewName}</b>')" onmouseout="kill()"><a href="profile?id=${char.charid}">${char.name}</a></td>` +
                    `<td>${power}</td>` +
                    `<td>${ele}</td>` +
                    `<td>${char.wins}</td>` +
                    `<td>${char.damage}</td>` +
                    `<td>${cop}</td>` +
                    `<td><a href="javascript:void(0)" class="skill-counter" data-id="${char.charid}" data-name="${char.name}">${skillsLength}</a></td>` +
                    `<td>${negs.join('')}</td>` +
                    `<td>${char.attacks}</td>` +
                    `<td>${attack10x}</td>`+
                    `<td>${waitForCop}</td>` +
                    `</tr>`
            });
        };
        await Promise.all(charData.map(parseCharData));
        newTableRows.sort((a, b) => a.position - b.position);
        document.querySelector("#box6").innerHTML = `
        <table class="table table-striped sortable">
        <thead><tr><th></th><th>rnk</th><th>fac</th><th>character</th><th>power</th><th>ele</th><th>wins</th><th>dmg</th><th>cop min</th><th>skills</th><th>negs</th><th>atks</th><th>attack</th><th>wait</th></tr></thead>
        <tbody>${newTableRows.map(row => row.html).join("")}</tbody>
        </table>
        `

        const buttonsAttack10x = document.querySelectorAll("button.attack-10x");
        for (btn of buttonsAttack10x){
            const attackCharId = btn.dataset.id;
            btn.addEventListener('click', async()=> {
                await mmplus(`Atk10x|rganame|${server}|${profileData.charid}|${attackCharId}`);
            });
        };

        const buttonsWaitForCop = document.querySelectorAll("button.wait-for-cop");
        for (btn of buttonsWaitForCop){
            const attackCharId = btn.dataset.id;
            const atkCopTime = btn.dataset.coptime;
            btn.addEventListener('click', async()=> {
                await mmplus(`AtkCOP|rganame|${server}|${profileData.charid}|${attackCharId}|${atkCopTime}`);
            });
        };

        const buttonsSkillsPop = document.querySelectorAll("a.skill-counter");
        for (const btn of buttonsSkillsPop){
            const charId = btn.dataset.id;
            btn.addEventListener('click', async()=> {
                const skills = skillsData[charId];
                const name = btn.dataset.name;
                createWindow(`<b>${name}</b>`, "skills_potions", 336, 336, 0);
                document.querySelector("#skills_potions_content").innerHTML = `<center><div id="popSkillsAndPotions">loading</div>`;
                document.querySelector("#popSkillsAndPotions").innerHTML = skills.join('');
            });
        };

        sortableTables();
    };


    if (brawlActive){
        document.querySelector("#box5").innerHTML = `<button id="showAll" class="form-control-new" style="margin:0 0.5rem 0 0.5rem;">SHOW ALL</button><button id="hideAttacked" class="form-control-new" style="margin:0 0.5rem 0 0.5rem;">HIDE ATTACKED</button>`;
        document.querySelector("#showAll").addEventListener('click', async() => {
            document.querySelectorAll("tr.attacked").forEach(tr => { tr.style.display = "revert" });
        });
        document.querySelector("#hideAttacked").addEventListener('click', async() => {
            document.querySelectorAll("tr.attacked").forEach(tr => { tr.style.display = "none" });
        });
    } else if (brawlEntered){
        document.querySelector("#box5").innerHTML = `<h5>YOU ARE ENTERED INTO ${brawlName} BRAWL</h5>`
    } else if (!brawlEntered){
        document.querySelector("#box5").innerHTML = `<h5><a href="closedpvp?enter=1&type=${brawlType}">JOIN ${brawlName} BRAWL</a></h5>`
    };


    document.querySelector("#castSunder").addEventListener('click', async()=> {
        const sunder1 = document.querySelector("#sunder1").value.replace(/\t/g,'');
        const sunder2 = document.querySelector("#sunder2").value.replace(/\t/g,'');
        const sunder3 = document.querySelector("#sunder3").value.replace(/\t/g,'');
        const body = `target%5B%5D=${sunder1}&target%5B%5D=${sunder2}&target%5B%5D=${sunder3}&castskillid=21&cast=Cast+Skill`
        await superpost(`cast_skills.php?C=6`,body);
        window.location.href = window.location;
    });
    document.querySelector("#castDart").addEventListener('click', async()=> {
        const dart = document.querySelector("#dart").value.replace(/\t/g,'');
        const body = `target%5B%5D=${dart}&castskillid=16&cast=Cast+Skill`
        await superpost(`cast_skills.php?C=6`,body);
        window.location.href = window.location;
    });

};


async function closedpvp(profileData,server,charid){
    GM_addStyle(`
    #content-header-row > div:nth-child(3) > div{height:100%}
    #content-header-row > div:nth-child(2) > div:nth-child(1) > div{left:25px;}
    .brawl-skills > img {width: 30px;height: 30px;margin: 2px;border-radius: 5px;border: 2px #475254 SOLID;}
    img.nwo-brawl-icon{height:15px;width:15px;margin-right:0.5rem;}
    `)

    if (document.body.innerHTML.match('BRAWL IS ACTIVE') && document.body.innerHTML.match('You are entered into the brawl')){

        const playerRows = document.querySelectorAll("#content-header-row > div:nth-child(4) > div > table > tbody > tr");

        document.querySelector("#content-header-row > div:nth-child(3) > div:nth-child(2)").remove();
        document.querySelector("#content-header-row > div:nth-child(3) > div.widget-content.widget-content-area.mt-3").remove();
        document.querySelector("#content-header-row > h2").remove();
        document.querySelector("#content-header-row > div:nth-child(2) > div > ul").remove();
        document.querySelector("#content-header-row > div:nth-child(2) > div > p").remove();
        document.querySelector("#content-header-row > div:nth-child(2) > div > h4").remove();
        if (document.querySelector("#content-header-row > div:nth-child(2) > div > h3")){
            document.querySelector("#content-header-row > div:nth-child(2) > div > h3").remove();
        };

        const allCast = profileData.skills.images;
        const yourName = profileData.name;
        const yourPower = profileData.power;
        const yourCrew = profileData.crewid;
        document.querySelector("#content-header-row > div:nth-child(2) > div.widget-content.widget-content-area.mt-3").innerHTML = `
        <h5>Your Power</h5>
        ${yourPower.toLocaleString()}<hr>
        <h5>Your skills</h5>
        <div class="brawl-skills">${allCast.join(' ')}</div><hr>
        <button class="btn-mm" id="hideAttacked" style="margin-bottom:10px;">HIDE ATTACKED PLAYERS</button>
        <button class="btn-mm" id="showAll" style="margin-bottom:10px;">SHOW ALL PLAYERS</button>
        `
        document.querySelector("#content-header-row > div:nth-child(3)").innerHTML = `
        <div class="widget-content widget-content-area">
        <img src="https://studiomoxxi.com/moxximod/bot.png">
        <hr>
        <h5> Sunder armor</h5>
        <input style="width:135px;" id="saTarget1" type="text" class="form-control-new" autocomplete="off">
        <input style="width:135px;" id="saTarget2" type="text" class="form-control-new" autocomplete="off">
        <input style="width:135px;" id="saTarget3" type="text" class="form-control-new" autocomplete="off"><br>
        <button class="btn-mm" id="castSunderArmor" style="margin-top:10px;">CAST SUNDER ARMOR</button><hr>
        <h5 style="margin-top:1rem;">Poison dart</h5>
        <input style="width:135px;" id="pdTarget" type="text" class="form-control-new" autocomplete="off"><br>
        <button class="btn-mm" id="castPoisonDart" style="margin-top:10px;">CAST POISON DART</button>
        </div>
        `
        let saCharging;
        let pdCharging;
        const sunderArmor = await superfetch('skills_info.php?id=21');
        const saCooldown = sunderArmor.match(/This skill is recharging\. [0-9]+ minutes remaining\./i);
        const saUnknown = sunderArmor.match(/You have not learned this skill yet/i);
        if (saCooldown || saUnknown){
            document.querySelector("#castSunderArmor").outerHTML = `<br>Sunder armor isn't available to cast`
            saCharging = true;
        }
        const poisonDart = await superfetch('skills_info.php?id=16');
        const pdCooldown = poisonDart.match(/This skill is recharging\. [0-9]+ minutes remaining\./i);
        const pdUnknown = poisonDart.match(/You have not learned this skill yet/i);
        if (pdCooldown || pdUnknown){
            document.querySelector("#castPoisonDart").outerHTML = `<br>Poison dart isn't available to cast`
            pdCharging = true;
        }

        var parentElement = document.querySelector("#content > div.layout-px-spacing");

        var newDiv = document.createElement("div");
        newDiv.innerHTML = `
        <table id="brawlTable" class="table table-striped">
        <thead><tr><th>Rank</th><th>Player</th><th>Prize</th><th>Power</th><th>Wins</th><th>Damage</th><th>Skills</th><th>Atks</th><th>Attack</th><th>Wait</th></thead>
        <tbody></tbody>
        </table>`;
        newDiv.setAttribute('class','row justify-content-center widget-content widget-content-area');
        newDiv.setAttribute('style','margin-top:1rem;margin-left:2px;margin-right:2px;');
        parentElement.appendChild(newDiv);

        let data = [];
        const buildTable = async (item,index) => {
            const row = item.innerHTML.replace(/,/g,'').replace(/\s+/g,'').replace(/[\n\r]/g,'');
            const brawlPlayerid = row.match(/id=([0-9]+)/i)[1];
            const targetProfileData = await superfetchProfile(`profile?id=${brawlPlayerid}`);
            const brawlRank = parseInt(row.match(/<td>([0-9]+)\.<\/td>/i)[1]);
            let brawlPrize = '';
            if (brawlRank == 1){ brawlPrize = '20 coins'}
            else if (brawlRank == 2){ brawlPrize = '17 coins'}
            else if (brawlRank == 3){ brawlPrize = '15 coins'}
            else if (brawlRank == 4){ brawlPrize = '13 coins'}
            else if (brawlRank == 5){ brawlPrize = '11 coins'}
            else if (brawlRank <= 8){ brawlPrize = '10 coins'}
            else if (brawlRank <= 11){ brawlPrize = '9 coins'}
            else if (brawlRank <= 14){ brawlPrize = '8 coins'}
            else if (brawlRank <= 17){ brawlPrize = '7 coins'}
            else if (brawlRank <= 20){ brawlPrize = '6 coins'}
            else if (brawlRank <= 25){ brawlPrize = '5 coins'}
            else if (brawlRank <= 30){ brawlPrize = '4 coins'}
            const brawlPlayer = row.match(/<ahref="profile\?id=[0-9]+">(.*?)<\/a>/i)[1];
            const parsePower = targetProfileData.power;
            const parseCrew = targetProfileData.crewid;
            const nwoCheck = parseCrew == 6637 && yourCrew == 6637 ? `<img src="https://studiomoxxi.com/moxximod/nwo-server-icon.png" class="nwo-brawl-icon">` : ''
            let brawlPlayerpower;
            if (parsePower == 0){brawlPlayerpower = "suspended" }
            else if (Math.abs(yourPower-parsePower) <= (yourPower*0.0375)){brawlPlayerpower = `<font color="#ffea00">${parsePower.toLocaleString()}</font>`}
            else if ((parsePower-yourPower) >= (yourPower*0.0375)){brawlPlayerpower = `<font color="#d40000">${parsePower.toLocaleString()}</font>`}
            else if ((yourPower-parsePower) >= (yourPower*0.0375)){brawlPlayerpower = `<font color="#00dc24">${parsePower.toLocaleString()}</font>`};
            const brawlString = row.replace(/<ahref.*?<\/a>/g,'').match(/<td>([0-9]+)<\/td><td>([0-9]+)<\/td><td>(.*?)<\/td>/i);
            const brawlWins = brawlString[1];
            const brawlDamage = parseInt(brawlString[2]).toLocaleString();
            const brawlYourattacks = brawlString[3];
            const brawlCop = targetProfileData.skills.list.includes("Circle of Protection") ? `<font color="#ffea00">Circle of Protection: ${targetProfileData.skills.images.toString().match(/Reduce base damage taken in PvP combat by [0-9]+%\.<br \/>(.*?)<br>/i)[1]}</font>` : '';
            const brawlCopstring = brawlCop.match(/: .*?</i) ? `${brawlCop.match(/: .*?</i).toString().replace(/:\s*|\s+|min|</gi, '').replace(/s/g,'')}` : ''
            const displaySkills = [];
            const castByMeRegex = new RegExp(`Cast By ${yourName}`);
            const allCastSkills = targetProfileData.skills.images;
            if (brawlPlayer == yourName){
                displaySkills.push('-');
            } else {
                allCastSkills.forEach(skill => {
                    if (skill.match(castByMeRegex) || skill.match("Circle of Protection")){
                        displaySkills.push(skill);
                    };
                });
            };
            const brawlAttackbtn = brawlYourattacks.match('10') || brawlYourattacks.match('-') ? '' : `<button class="btn-mm attack-10x" id="" alt="${brawlPlayerid}">ATTACK 10X</button>`;
            const brawlWaitforcop = brawlYourattacks.match('10') || brawlCop == '' ? '' : `<button class="btn-mm wait-for-cop" alt="${brawlPlayerid}|${brawlCopstring}">WAIT FOR COP</button>`;
            data.push(rowData = {
                rank: brawlRank,
                player: `${nwoCheck}<a href="profile?id=${brawlPlayerid}">${brawlPlayer}</a>`,
                prize: brawlPrize,
                power: brawlPlayerpower,
                wins: brawlWins,
                damage: brawlDamage,
                skills: `<div class="brawl-skills">` + displaySkills.join('') + `</div>`,
                attacks: `<span class="attacked-${brawlYourattacks}">${brawlYourattacks}</span>`,
                attack10x: brawlAttackbtn,
                wait: brawlWaitforcop
            });
        };
        await Promise.all(Array.from(playerRows).map((raid, index) => buildTable(raid, index)));

        data.sort((a, b) => a.rank - b.rank);
        data.forEach(rowData => {
            const rowElement = document.querySelector("#brawlTable > tbody").insertRow();
            rowElement.innerHTML = Object.values(rowData).map(value => `<td>${value}</td>`).join('');
        });

        if (data.length-1 != document.querySelectorAll('.attacked-10').length){
            document.querySelectorAll('.attacked-10').forEach(function(element) {
                element.closest('tr').style.display = 'none';
            });
        };

        document.querySelector("#hideAttacked").addEventListener('click', async function(){
            document.querySelectorAll('.attacked-10').forEach(function(element) {
                element.closest('tr').style.display = 'none';
            });
        });

        document.querySelector("#showAll").addEventListener('click', async function(){
            document.querySelectorAll('.attacked-10').forEach(function(element) {
                element.closest('tr').style.display = 'revert';
            });
        });

        if (!saCharging){
            document.querySelector("#castSunderArmor").addEventListener('click', async function(){
                const target1 = document.querySelector("#saTarget1").value.replace(/\t/g,'')
                const target2 = document.querySelector("#saTarget2").value.replace(/\t/g,'')
                const target3 = document.querySelector("#saTarget3").value.replace(/\t/g,'')
                const body = `target%5B%5D=${target1}&target%5B%5D=${target2}&target%5B%5D=${target3}&castskillid=21&cast=Cast+Skill`
                if (GM_getValue('auth').match("Full")){
                    await superpost(`cast_skills.php?C=6`,body);
                    window.location.href = window.location;
                } else {
                    displayAuthStatus(GM_getValue('auth'));
                };
            });
        };

        if (!pdCharging){
            document.querySelector("#castPoisonDart").addEventListener('click', async function(){
                const target = document.querySelector("#pdTarget").value
                const body = new URLSearchParams({ 'target[]': target, 'castskillid': '16', 'cast': 'Cast Skill' });
                if (GM_getValue('auth').match("Full")){
                    await superpost(`cast_skills.php?C=6`,body);
                    window.location.href = window.location;
                } else {
                    displayAuthStatus(GM_getValue('auth'));
                };
            });
        };

        const attack10x = document.querySelectorAll(".attack-10x");
        for (let i = 0; i < attack10x.length; i++) {
            var button = attack10x[i];
            const atkCharId = button.outerHTML.match(/alt="([0-9]+)"/i)[1];
            button.addEventListener("click", async function() {
                await mmplus(`Atk10x|rganame|${server}|${charid}|${atkCharId}`);
            });
        };

        const waitForCop = document.querySelectorAll(".wait-for-cop");
        for (let i = 0; i < waitForCop.length; i++) {
            var button = waitForCop[i];
            const atkCharId = button.outerHTML.match(/alt="([0-9]+)\|.*?"/i)[1];
            const atkCopTime = button.outerHTML.match(/alt=".*?\|(.*?)"/i)[1];
            button.addEventListener("click", async function() {
                await mmplus(`AtkCOP|rganame|${server}|${charid}|${atkCharId}|${atkCopTime}`);
            });
        };
    } else if (window.location.search == "?type=1"){

        const tables = document.querySelectorAll("table");
        const factionObj = { Alvar: 0, Vordyn: 0, Delruk: 0 };
        Array.from(tables).filter(table => {
            return Array.from(table.querySelectorAll("tr")).some(tr => {
                const tds = tr.querySelectorAll("td");
                if (tds[2]){
                    const faction = tds[2].innerHTML.match(/title="([^"]*)"/i);
                    if (faction){
                        factionObj[faction[1]] += 1;
                    };
                };
            });
        });
        const totAlvar = factionObj.Alvar
        const totDelruk = factionObj.Delruk
        const totVordyn = factionObj.Vordyn

        const ul = document.querySelector("ul.striped-list");
        ul.querySelectorAll("li")[2].remove();
        const liAlvar = document.createElement("li");
        liAlvar.innerHTML = `<font color="#f6b861"><b>Delruk Participants:</b> ${totDelruk}`;
        liAlvar.classList.add('list-group-item')
        liAlvar.classList.add('pl-3');
        ul.appendChild(liAlvar);
        const liDelruk = document.createElement("li");
        liDelruk.innerHTML = `<font color="#b7d9fb"><b>Alvar Participants:</b> ${totAlvar}`;
        liDelruk.classList.add('list-group-item')
        liDelruk.classList.add('pl-3');
        ul.appendChild(liDelruk);
        const liVordyn = document.createElement("li");
        liVordyn.innerHTML = `<font color="#ffb7f1"><b>Vordyn Participants:</b> ${totVordyn}`;
        liVordyn.classList.add('list-group-item')
        liVordyn.classList.add('pl-3');
        ul.appendChild(liVordyn);
        const liTotal = document.createElement("li");
        liTotal.innerHTML = `<b>Total Participants:</b> ${totDelruk + totAlvar + totVordyn}`;
        liTotal.classList.add('list-group-item')
        liTotal.classList.add('pl-3');
        ul.appendChild(liTotal);
    };
};


async function castSkills(){

    GM_addStyle(`
        .widget-content-area{box-shadow:0 0px 0px 0 rgba(0,0,0,0);}
        .widget-content-area{-webkit-box-shadow:0 0px 0px 0 rgba(0,0,0,0);}
    `)

    const ulElement = document.querySelector("#simpletab");
    const newLiElement = document.createElement("li");
    newLiElement.setAttribute('class','nav-item');
    newLiElement.innerHTML = `<a class="nav-link " href="auto_skiller" role="tab" aria-selected="false">Auto Skiller</a>`;
    ulElement.appendChild(newLiElement);
};


async function support(){
    if (GM_getValue("auth").match("Full")){
        alert('WARNING: Submitting a support ticket will prevent MoxxiMod+ features from running until the support ticket is fully resolved by Outwar');
    };
};


async function crewpermissions(){
    GM_addStyle(`
        #content-header-row > table{width:100% !important;}
        #content-header-row > table > tbody > tr > td > form > table{width:100%;}
        #content-header-row > table > tbody > tr > td > form > table > tbody > tr > td{padding:5px;}
        #content-header-row > table > tbody > tr > td > form > table > tbody > tr:not(:nth-last-child(-n+2)) {border-bottom:1px SOLID #444444;}
        #content-header-row > table > tbody > tr > td > form > table > tbody > tr > td > font > b{font-size:14px;}
    `)

    document.querySelector("#content-header-row > div").remove();
    document.querySelector("#content-header-row > table > tbody > tr > td > form > table > tbody > tr:nth-child(1)").remove();
    const weirdTableBulbs = document.querySelectorAll("#content-header-row > table > tbody > tr > td > form > table > tbody > tr > td > img");
    const randomTableBrs = document.querySelectorAll("#content-header-row > table > tbody > tr > td > form > table > tbody > tr > td > br");
    weirdTableBulbs.forEach(i => {
        i.remove();
    });
    randomTableBrs.forEach(i => {
        i.remove();
    });
    const table = document.querySelector("#content-header-row > table > tbody > tr > td > form > table");
    table.classList.add('widget')

    for (let i = 1; i < table.rows.length - 1; i++) {
        let row = table.rows[i];
        let newCell = row.insertCell(-1);
        newCell.innerHTML = "ALL";
        newCell.setAttribute('style','cursor:pointer;')
        newCell.addEventListener('click', function(){
            const boxes = row.querySelectorAll("input[type=checkbox]");
            const allChecked = Array.from(boxes).every(box => box.checked);
            boxes.forEach(box => {
                box.checked = !allChecked;
            });
        });
    };

    var newRow = table.insertRow(table.rows.length - 1);
    for (let i = 0; i < table.rows[0].cells.length; i++) {
        var newCell = newRow.insertCell(i);
        if (i >= 2){
            newCell.setAttribute('style','text-align:center;cursor:pointer;')
            newCell.innerHTML = 'ALL';
            newCell.addEventListener('click', function() {

                let columnIndex = i;
                let checkboxes = [];
                for (let j = 1; j < table.rows.length - 1; j++) {
                    let checkbox = table.rows[j].cells[columnIndex].querySelector("input[type=checkbox]");
                    if (checkbox) {
                        checkboxes.push(checkbox);
                    }
                }

                const allChecked = checkboxes.every(box => box.checked);

                checkboxes.forEach(box => {
                    box.checked = !allChecked;
                });
            });
        };
    };

    var lastRow = table.rows[table.rows.length - 1];
    var lastCell = lastRow.cells[0];
    lastCell.setAttribute('style','text-align:left;padding:10px;')
    const button = document.querySelector('input[name="setperm"]')
    button.classList.add('btn-mm');
};


async function bootmem(){

    const rows = document.querySelectorAll('.table.table-striped tbody tr');
    rows.forEach(row => {
        const nameCell = row.querySelector('td:first-child');
        const input = row.querySelector('input[type="checkbox"]');
        if (nameCell && input) {
            const nameValue = nameCell.innerHTML;
            input.id = `BOOT${nameValue.toLowerCase()}`;
        };
    });

    const newDiv = document.createElement('div');
    newDiv.style.position = 'fixed';
    newDiv.style.bottom = '0';
    newDiv.style.left = '0';
    newDiv.style.height = '40px';
    newDiv.style.width = '100%';
    newDiv.style.zIndex = '1000';
    newDiv.innerHTML = `
        <div class="widget" style="padding:5px;">
        <p style="text-align:center;">
        <input type="text" class="form-control-new" placeholder="Select by name..." style="width:100%;" id="bootByName"></input>
        </p>
        </div>
    `;
    document.body.appendChild(newDiv);

    document.querySelector("#bootByName").addEventListener('input', async () => {
        const bootList = document.querySelector("#bootByName").value.replace(/ /g,',');
        const bootArray = bootList.split(',');
        for (let char of bootArray){
            const inputBox = document.querySelector(`#BOOT${char.toLowerCase()}`)
            if (inputBox){
                inputBox.checked = true;
            };
        };
    });
};


async function oracle(){
    if (document.body.innerHTML.match(/You may view the Oracle's prediction in your message center/i)){
        document.querySelector("#content-header-row").innerHTML = `<img src="https://studiomoxxi.com/moxximod/loading-gif.gif" height="80px" width="80px">`
        const messages = await superfetch('ow_messagecenter');
        const message = messages.match(/view_ow_message\.php\?id=[0-9]+/i);
        window.location.href = message;
    } else {
        return;
    };
};

async function moxxivision(server,serverNo,rgaName,charId){

    await blankOverlay(server,serverNo,rgaName,charId);
    const closeLink = document.body.innerHTML.match(/<a href="([^"]*)">CLOSE<\/a>/i)[1];

    GM_addStyle(`
        #overlayWidget{background-image: url("https://studiomoxxi.com/moxximod/claptrap_loading.webp") !important;background-size: 100% 100% !important;background-attachment: fixed !important;background-position: center !important;background-repeat: no-repeat !important;}
        #blankOverlay{background-color:#181818 !important;}
        h1{font-family:VT323,monospace;letter-spacing:6px;margin-bottom:1rem;}
        #mvRgaSelectDiv{height:300px;overflow-y:auto;overflow-x:hidden;width:600px;border:1px solid #ffffff;background:#000000;}
        .mv-rga-select-table > tbody > tr:hover{transition: 0.1s ease-out;background-color:#0C0C0C;}
        .mv-rga-select-table th, .mv-rga-select-table td {vertical-align:middle;font-family:VT323,monospace;padding: 8px 10px;font-size:14px;cursor:pointer;color:#FFFFFF;}
        .mv-rga-select-table{width:600px;}
        .rga-selected{transition: 0.1s ease-out;background-color:#181818 !important;}
    `);

    GM_addStyle(`
    #moxxivision{width:100%;height:100%;background:#181818;position:fixed;top:0px;left:0px;z-index:100;}
    div.mv-table-container{text-align:left;display:inline-block;box-shadow: 0 0 10px rgba(0, 0, 0, 1);padding:10px;background-color:#0C0C0C;}
    .mv-table > thead > tr > th{text-transform: uppercase;padding:5px;background-color:#1e1e1e;color:#ffffff;font-weight:100;border:1px solid #000000;}
    .mv-table > tbody > tr > td{padding:5px;color:#ffffff;border:1px solid #000000;}
    .mv-table > tbody > tr > td > img{height:35px;width:35px;border-radius:5px;margin:3px;background-color:#000000;}
    .mv-table > thead > tr > th > img{height:30px;width:30px;border-radius:5px;}
    .mv-table > tbody > tr:nth-child(even){background-color:#1e1e1e;}
    .mv-table > tbody > tr:nth-child(odd){background-color:#2d2d2d;}
    td.mv-augs > img {width:15px !important;height:15px !important;}
    img.mv-augs-big{width:20px !important;height:20px !important;}
    #mvContent{position:absolute;transition: top 0.5s ease;width:100%;text-align:center;overflow:auto;height:90%;display:inline-block;box-shadow: 0 0 10px rgba(0, 0, 0, 1);padding:10px;background-color:#0C0C0C;}
    .row1{text-align:center;position:fixed;top:0px;width:100%;z-index:101;background:#0C0C0C;padding:5px;box-shadow: 0 0 5px rgba(0, 0, 0, 1);}
    .row2{text-align:center;position:fixed;top:-200px;width:100%;z-index:102;background:#0C0C0C;padding:5px;transition: top 0.5s ease;box-shadow: 0 0 5px rgba(0, 0, 0, 1);}
    .row2-container{max-width:1200px;margin: 0 auto;}
    #loadingDiv{padding:100px;font-size:62px;color:#ffffff;font-family:Montserrat,sans-serif;letter-spacing:10px;position:fixed;top:0px;text-align:center;height:100%;width:100%;z-index:201;background-image: url("https://studiomoxxi.com/moxximod/claptrap_loading.webp");background-size: 100% 100%;background-attachment: fixed;background-position:center;background-repeat:no-repeat;}
    .mv-btn{letter-spacing:3px;margin:2px;font-size:14px;display:inline-block;font-family:"VT323",monospace;border: 1px solid white;color:#ffffff;padding: 2px 4px;width:200px;text-transform:uppercase;cursor:pointer;text-align:center;transition: top 1s ease;}
    .mv-btn-sub{letter-spacing:3px;margin:2px;font-size:14px;display:inline-block;font-family:"VT323",monospace;border: 1px solid white;color:#ffffff;padding: 1px 2px;width:50px;text-transform:uppercase;cursor:pointer;text-align:center;transition: top 1s ease;}
    .mv-btn:hover,.mv-btn-sub:hover{animation: btn-hover 0.5s ease forwards;}
    @keyframes btn-hover {0%{filter:blur(0px);background-color:#0C0C0C;color:#ffffff;} 100%{filter:blur(1px);background-color:#0C0C0C;color:#ffffff;}}
    .mv-filter{background-color: #0C0C0C;color: #ffffff;border: 1px solid #ffffff;margin-bottom: 0.5rem;width: 100%;font-family: VT323,monospace;font-size: 16px;padding: 7px;}
    .blank-cell{background-color:#0C0C0C !important;color:#0C0C0C !important;border:0px !important;}
    span.blink{animation: blink 0.5s infinite;}
    @keyframes blink{50%{opacity:0;}}
    div.aug-data-div {display:inline-block;margin:3px;text-align:center;background: #000000;padding-left:5px;padding-right:5px;padding-top:5px;border-radius:4px;border: 1px SOLID #000000;box-shadow: 0 0 2px rgba(0, 0, 0, 1);}
    img.mv-item{margin:3px;background: #000000;border-radius:4px;border: 1px SOLID #000000;box-shadow: 0 0 3px rgba(0, 0, 0, 1);height:30px;width:30px;}
    .mv-btn-sub-active{ border: 1px SOLID #FF0; color:#FF0 !important; }
    img.btn-eq-pop{ height:25px !important; width:25px !important; cursor: pointer; background-color: transparent !important; }
    `)

    document.querySelector("#overlayWidget").innerHTML = `
        <center>
        <h1 style="border:0px SOLID #ffffff;font-size:72px;padding:10px;color:#ffffff;letter-spacing:10px;font-weight:100;font-family:Montserrat,sans-serif;">MOXXIVISION v4</h1>
        <div id="moxxivisionLoadDiv">
        <div style="width:600px;text-align:left;">
        <a href="javascript:void(0);" id="mvSelectAll">select all</a> / <a href="javascript:void(0);" id="mvDeselectAll">deselect all</a>
        </div>
        <div id="mvRgaSelectDiv">
        </div><br>
        <a href="javascript:void(0);" style="width:300px;background-color:#000000;padding:15px;" class="mv-btn" id="mvStart">
        </a>
        </div>
        `

    document.querySelector("#mvSelectAll").addEventListener('click', async function(){
        document.querySelectorAll("#mvRgaSelectDiv > table > tbody tr").forEach(tr => {
            tr.classList.add("rga-selected");
        });
    });
    document.querySelector("#mvDeselectAll").addEventListener('click', async function(){
        document.querySelectorAll("#mvRgaSelectDiv > table > tbody tr").forEach(tr => {
            tr.classList.remove("rga-selected");
        });
    });

    const rgas = [];

    if (GM_getValue('savedRgas') == "no sessions saved" || !GM_getValue('auth').match('Full')){
        document.querySelector("#moxxivisionLoadDiv").innerHTML = `<img src="https://studiomoxxi.com/moxximod/loading-gif.gif" height="80px" width="80px">`
        const ajax = await superfetch(`ajax/accounts.php?t_serv=${serverNo}`);
        const charIds = ajax.match(/"id":"[0-9]+"/g).map(i => i.match(/[0-9]+/));
        const buildLoadDataArray = async (id) => {
            const profileData = await superfetchProfile(`profile?id=${id}`);
            const character = profileData.name;
            const level = profileData.level;
            rgas.push([`rg_sess_id=${rgaName}&suid=${id}&serverid=${serverNo}`,'--',id.toString(),character,level]);
        };
        await Promise.all(charIds.map(buildLoadDataArray));
        GM_addStyle(`.mv-rga-cell{display:none;}`)
        await mv(rgas);

    } else {
        const array = GM_getValue('savedRgas').split('><');
        const rows = [];
        const tableRows = async (id) => {
            const rga = id.match(/>(.*?)</i)[1];
            const sess = id.match(/rg_sess_id=([A-Za-z0-9]+)/i)[1];
            rows.push(`<tr><td>${rga}</td><td id="sess">${sess}</td></tr>`);
        };
        await Promise.all(array.map(tableRows));
        document.querySelector("#mvRgaSelectDiv").innerHTML = `
            <table class="mv-rga-select-table">
            <thead><tr><th>RGA</th><th>SESSION</th></tr></thead>
            <tbody>${rows.join('')}</tbody>
            </table>
            `

        document.querySelector("#mvStart").addEventListener('click', async function(){
            const rows = document.querySelectorAll('.rga-selected');
            const array = [];

            if (rows.length == 0){
                alert ('Please select at least 1 RGA');

            } else {
                this.outerHTML = '<span class="blink">&#x29D6;</span>'
                rows.forEach(tr => { array.push(tr.innerHTML.match(/<td id="sess">(.*?)<\/td>/i)[1]) });
                const get = await mmplus(`IDGrab|rganame|${server}|${array.join(',')}`);
                const parse = get.match(/<tr><td>.*?<\/td><td>.*?<\/td><td>.*?<\/td><td>.*?<\/td><\/tr>/g);
                parse.forEach(async function(i){
                    const string = i.match(/<tr><td>(.*?)<\/td><td>(.*?)<\/td><td>(.*?)<\/td><td>.*?<\/td><\/tr>/i)
                    const profileData = await superfetchProfile(`profile?id=${string[1]}`);
                    const character = profileData.name;
                    const level = profileData.level;

                    rgas.push([`rg_sess_id=${string[2]}&suid=${string[1]}&serverid=${serverNo}`,string[3],string[1],character,level]);
                });

                if (rows.length == 1){
                    GM_addStyle(`.mv-rga-cell{display:none;}`)
                };

                await mv(rgas);
            };
        });
    };

    const rows = document.querySelectorAll('table.mv-rga-select-table tbody tr');
    rows.forEach(tr => {
        tr.addEventListener('click', async function (){
            this.classList.toggle('rga-selected');
        });
    });

    async function mv(rgas){

        document.querySelector("#blankOverlay").outerHTML = `
        <div id="moxxivision">
        <!-- Header buttons -->
        <div class="row1" id="mvHeader">
        <a href="javascript:void(0);" class="mv-btn open-btn" alt="character">CHARACTER</a>
        <a href="javascript:void(0);" class="mv-btn" id="equipment-equipped">EQUIPPED</a>
        <a href="javascript:void(0);" class="mv-btn open-btn" alt="equipment">SLOTS</a>
        <a href="javascript:void(0);" class="mv-btn open-btn" alt="storage">STORAGE</a>
        <a href="javascript:void(0);" class="mv-btn open-btn" alt="plus">PLUS TABS</a>
        <a href="${closeLink}" class="mv-btn">EXIT</a>
        </div>
        <!-- Character buttons -->
        <div class="row2" id="div-character" style="text-align:center">
        <div class="row2-container">
        <a href="javascript:void(0);" class="mv-btn close-btn" id="character-overview">OVERVIEW</a>
        <a href="javascript:void(0);" class="mv-btn close-btn" id="character-stats">STATS</a>
        <a href="javascript:void(0);" class="mv-btn close-btn" id="character-factions">FACTIONS</a>
        <a href="javascript:void(0);" class="mv-btn close-btn" id="character-collections">COLLECTIONS</a>
        <a href="javascript:void(0);" class="mv-btn close-btn" id="character-skills">SKILLS</a>
        <a href="javascript:void(0);" class="mv-btn close-btn" id="character-underlings">UNDERLINGS</a>
        <a href="javascript:void(0);" class="mv-btn close-btn" id="character-god-slayer">GOD SLAYER</a>
        <a href="javascript:void(0);" class="mv-btn close-btn" id="character-codex">CODEX</a>
        <a href="javascript:void(0);" class="mv-btn close-btn">CLOSE</a>
        </div>
        </div>
        <!-- Equipment buttons -->
        <div class="row2" id="div-equipment" style="text-align:center">
        <div class="row2-container">
        <a href="javascript:void(0);" class="mv-btn eq-slot close-btn" id="equipment-10">CORE</a>
        <a href="javascript:void(0);" class="mv-btn eq-slot close-btn" id="equipment-5">HEAD</a>
        <a href="javascript:void(0);" class="mv-btn eq-slot close-btn" id="equipment-6">NECK</a>
        <a href="javascript:void(0);" class="mv-btn eq-slot close-btn" id="equipment-3">WEAPON</a>
        <a href="javascript:void(0);" class="mv-btn eq-slot close-btn" id="equipment-0">BODY</a>
        <a href="javascript:void(0);" class="mv-btn eq-slot close-btn" id="equipment-1">SHIELD</a>
        <a href="javascript:void(0);" class="mv-btn eq-slot close-btn" id="equipment-7">BELT</a>
        <a href="javascript:void(0);" class="mv-btn eq-slot close-btn" id="equipment-9">PANTS</a>
        <a href="javascript:void(0);" class="mv-btn eq-slot close-btn" id="equipment-4">RING</a>
        <a href="javascript:void(0);" class="mv-btn eq-slot close-btn" id="equipment-2">FOOT</a>
        <a href="javascript:void(0);" class="mv-btn close-btn" id="equipment-chaos-gem">CHAOS GEM</a>
        <a href="javascript:void(0);" class="mv-btn close-btn" id="equipment-badge">BADGE</a>
        <a href="javascript:void(0);" class="mv-btn close-btn" id="equipment-orbs">ORBS</a>
        <a href="javascript:void(0);" class="mv-btn close-btn" id="equipment-rune">RUNE</a>
        <a href="javascript:void(0);" class="mv-btn close-btn" id="equipment-booster">BOOSTER</a>
        <a href="javascript:void(0);" class="mv-btn close-btn" id="equipment-crests">CRESTS</a>
        <a href="javascript:void(0);" class="mv-btn close-btn" id="equipment-augments">AUGMENTS</a>
        <a href="javascript:void(0);" class="mv-btn close-btn">CLOSE</a>
        </div>
        </div>
        <!-- Storage buttons -->
        <div class="row2" id="div-storage" style="text-align:center">
        <div class="row2-container">
        <a href="javascript:void(0);" class="mv-btn close-btn" id="storage-backpack">BACKPACK</a>
        <a href="javascript:void(0);" class="mv-btn bp-tab close-btn" id="storage-quest-items" alt="quest">QUEST ITEMS</a>
        <a href="javascript:void(0);" class="mv-btn bp-tab close-btn" id="storage-orbs" alt="orb">ORBS</a>
        <a href="javascript:void(0);" class="mv-btn bp-tab close-btn" id="storage-potions" alt="potion">POTIONS</a>
        <a href="javascript:void(0);" class="mv-btn bp-tab close-btn" id="storage-keys" alt="key">KEYS</a>
        <a href="javascript:void(0);" class="mv-btn bp-tab close-btn" id="storage-utility" alt="utility">UTILITY</a>
        <a href="javascript:void(0);" class="mv-btn close-btn" id="storage-equipment">EQUIPMENT</a>
        <a href="javascript:void(0);" class="mv-btn close-btn" id="storage-vault">VAULT</a>
        <a href="javascript:void(0);" class="mv-btn close-btn" id="storage-augments">AUGMENTS</a>
        <a href="javascript:void(0);" class="mv-btn close-btn">CLOSE</a>
        </div>
        </div>
        <!-- Special view buttons -->
        <div class="row2" id="div-plus" style="text-align:center">
        <div class="row2-container">
        <a href="javascript:void(0);" class="mv-btn mv-plus open-btn close-btn" id="plus-events" alt="events">EVENT MANAGER</a>
        <a href="javascript:void(0);" class="mv-btn mv-plus close-btn" id="plus-item-slotting" alt="slotting">ITEM SLOTTING</a>
        <a href="javascript:void(0);" class="mv-btn mv-plus close-btn" id="plus-augment-data" alt="slotting">AUGMENT DATA</a>
        <a href="javascript:void(0);" class="mv-btn mv-plus close-btn" id="plus-max-rage">MR OPTIMIZER</a>
        <a href="javascript:void(0);" class="mv-btn close-btn">CLOSE</a>
        </div>
        </div>
        <!-- Events view buttons -->
        <div class="row2" id="div-events" style="text-align:center">
        <div class="row2-container">
        <a href="javascript:void(0);" class="mv-btn woz-top close-btn" id="plus-events-war-of-zhul">WAR OF ZHUL</a>
        <a href="javascript:void(0);" class="mv-btn woz-top close-btn" id="plus-events-trial-of-power">TRIAL OF POWER</a>
        <a href="javascript:void(0);" class="mv-btn close-btn" id="plus-events-halloween">HALLOWEEN</a>
        <a href="javascript:void(0);" class="mv-btn close-btn" id="plus-events-christmas">CHRISTMAS</a>
        <a href="javascript:void(0);" class="mv-btn close-btn">CLOSE</a>
        </div>
        </div>
        <!-- Content -->
        <div id="mvContent">
        <span style="border:0px SOLID #ffffff;font-size:62px;position:relative;top:100px;color:#ffffff;letter-spacing:10px;font-weight:100;font-family:Montserrat,sans-serif;">
        <span class="blink">//</span> MOXXIVISION v_4
        </span>
        </div>
        <!-- End -->
        </div>
        `

        var heightHeader = document.querySelector("#mvHeader").clientHeight + 10;
        document.querySelector("#mvContent").setAttribute('style',`top:${heightHeader}px`)

        const open = document.querySelectorAll(".open-btn")
        open.forEach(function(button){
            button.addEventListener('click',async function(){
                const alt = this.outerHTML.match(/alt="([^"]*)"/i)[1];
                var currentPosition = document.getElementById(`div-${alt}`).getBoundingClientRect();
                document.getElementById(`div-${alt}`).style.top = currentPosition.top + 200 + 'px';

                var heightDiv = document.getElementById(`div-${alt}`).clientHeight;
                document.querySelector("#mvContent").style.top = heightDiv + 10 + 'px';

                await new Promise(resolve => setTimeout(resolve, 500));
                const vh = window.innerHeight;
                document.querySelector('#mvContent').style.height = '';
            });
        });

        const close = document.querySelectorAll(".close-btn")
        close.forEach(function(button){
            button.addEventListener('click',async function(){
                const div = this.parentElement.parentElement.outerHTML.match(/id="([^"]*)"/i)[1];
                var currentPosition = document.getElementById(div).getBoundingClientRect();
                document.getElementById(div).style.top = currentPosition.top - 200 + 'px';

                var heightHeader = document.querySelector("#mvHeader").clientHeight + 10;
                document.querySelector("#mvContent").style.top = heightHeader + "px";

                const vh = window.innerHeight;
                document.querySelector('#mvContent').style.height = vh - heightHeader - 10 + 'px';
            });
        });

        document.querySelector("#character-overview").addEventListener('click', async function(){
            await mvCharacterOverview(rgas)
        });
        document.querySelector("#character-stats").addEventListener('click', async function(){
            await mvCharacterStats(rgas)
        });
        document.querySelector("#character-factions").addEventListener('click', async function(){
            await mvCharacterFactions(rgas)
        });
        document.querySelector("#character-collections").addEventListener('click', async function(){
            await mvCharacterCollections(rgas)
        });
        document.querySelector("#character-skills").addEventListener('click', async function(){
            await mvCharacterSkills(rgas)
        });
        document.querySelector("#character-underlings").addEventListener('click', async function(){
            await mvCharacterUnderlings(rgas)
        });
        document.querySelector("#character-god-slayer").addEventListener('click', async function(){
            await mvCharacterGodSlayer(rgas)
        });
        document.querySelector("#character-codex").addEventListener('click', async function(){
            await mvCharacterCodex(rgas)
        });
        document.querySelector("#equipment-equipped").addEventListener('click', async function(){
            await mvEquipmentEquipped(rgas)
        });
        const slots = Array.from(document.querySelectorAll(".eq-slot"));
        for (let i = 0; i < slots.length; i++) {
            slots[i].addEventListener('click',async function(){
                const slot = this.innerHTML.toLowerCase();
                await mvEquipmentSlot(rgas,slot);
            });
        };
        document.querySelector("#equipment-chaos-gem").addEventListener('click', async function(){
            await mvEquipmentChaosGem(rgas)
        });
        document.querySelector("#equipment-badge").addEventListener('click',async function(){
            await mvEquipmentBadge(rgas)
        });
        document.querySelector("#equipment-orbs").addEventListener('click',async function(){
            await mvEquipmentOrbs(rgas)
        });
        document.querySelector("#equipment-rune").addEventListener('click',async function(){
            await mvEquipmentRune(rgas)
        });
        document.querySelector("#equipment-booster").addEventListener('click',async function(){
            await mvEquipmentBooster(rgas)
        });
        document.querySelector("#equipment-crests").addEventListener('click',async function(){
            await mvEquipmentCrests(rgas)
        });
        document.querySelector("#equipment-augments").addEventListener('click',async function(){
            await mvEquipmentAugments(rgas)
        });
        document.querySelector("#storage-backpack").addEventListener('click', async function(){
            await mvStorageBackpack(rgas)
        });
        const bpType = Array.from(document.querySelectorAll(".bp-tab"));
        for (let i = 0; i < bpType.length; i++) {
            bpType[i].addEventListener('click', async function(){
                const tab = this.outerHTML.match(/alt="([^"]*)"/i)[1];
                await mvStorageItems(rgas,tab);
            });
        };
        document.querySelector("#storage-equipment").addEventListener('click', async function(){
            await mvStorageEquipment(rgas)
        });
        document.querySelector("#storage-vault").addEventListener('click', async function(){
            await mvStorageVault(rgas)
        });
        document.querySelector("#storage-augments").addEventListener('click', async function(){
            await mvStorageAugments(rgas)
        });
        const tabs = Array.from(document.querySelectorAll(".mv-plus"));
        for (let i = 0; i < tabs.length; i++) {
            tabs[i].addEventListener('click',async function(){
                const string = await mmplus('AuthCheck|rganame');
                const tab = this.outerHTML.match(/id="plus-([^"]*)"/i)[1];
                if (tab == "events"){
                    const events = Array.from(document.querySelectorAll(".woz-top"));
                    for (let i = 0; i < events.length; i++) {
                        events[i].addEventListener('click',async function(){
                            const event = this.innerHTML;
                            await mvEvents(rgas,event,string);
                        });
                    };
                    document.querySelector("#plus-events-halloween").addEventListener('click', async function(){ await mvHalloween(rgas,string) });
                    document.querySelector("#plus-events-christmas").addEventListener('click', async function(){ await mvChristmas(rgas,string) });
                }
                else if (tab == "item-slotting"){
                    await mvItemSlotting(rgas,string);
                }
                else if (tab == "max-rage"){
                    await mvMaxRage(rgas,string);
                }
                else if (tab == "augment-data"){
                    await mvAugmentData(rgas,string);
                };
            });
        };
    };
};



async function mvCharacterOverview(rgas){
    const endpoints = ['profile','supplies'];
    const array = await mvFetch(rgas,endpoints);
    let totMr = 0;
    let totPower = 0;
    let totEle = 0;
    let totChaos = 0;
    let totRpt = 0;
    let totSupplies = 0;
    const rows = [];
    const table = async (i) => {
        const charclass = i.profile.class;
        const crew = i.profile.crewname;
        const rage = i.profile.currentrage.toLocaleString();
        const exp = i.profile.exp.toLocaleString();
        const tolvl = i.profile.tolevel.toLocaleString();
        const today = i.profile.growthtoday.toLocaleString();
        const yesterday = i.profile.growthyesterday.toLocaleString();
        const strength = i.profile.strength;
        const supplies = parseInt(i.supplies.replace(/\s/g,'').match(/<imgborder="0"src="images\/suppliestriangle\.gif"width="11"height="11">([0-9]+)%<\/td>/i)[1])
        const gold = i.profile.gold.toLocaleString();
        rows.push(`<tr>${i.static}<td>${charclass}</td><td>${crew}</td><td>${rage}</td><td>${exp}</td><td>${tolvl}</td><td>${today}</td><td>${yesterday}</td><td>${strength}</td><td>${supplies}</td><td>${gold}</td></tr>`);

        totMr += i.profile.maxrage;
        totPower += i.profile.power;
        totEle += i.profile.elemental;
        totChaos += i.profile.chaos;
        totRpt += i.profile.rageperturn;
        totSupplies += parseInt(i.supplies.replace(/\s/g,'').match(/<imgborder="0"src="images\/suppliestriangle\.gif"width="11"height="11">([0-9]+)%<\/td>/i)[1])
    };
    await Promise.all(array.map(table));
    const avgSupplies = (totSupplies/array.length).toFixed(2);

    document.querySelector("#mvContent").innerHTML = `
    <div class="mv-table-container">
    <table class="mv-table" id="mvTable">
    <thead><tr>
    <th style="width:200px;font-weight:900;">TOTAL POWER</th>
    <th style="width:200px;font-weight:900;">TOTAL ELEMENTAL</th>
    <th style="width:200px;font-weight:900;">TOTAL CHAOS</th>
    <th style="width:200px;font-weight:900;">TOTAL RPT</th>
    <th style="width:200px;font-weight:900;">TOTAL MAX RAGE</th>
    <th style="width:200px;font-weight:900;">SUPPLIES (<a href="javascript:void(0)" id="maxAllSuppliesLink">MAX ALL</a>)</th>
    </tr></thead>
    <tbody><tr>
    <td>${totPower.toLocaleString()}</td>
    <td>${totEle.toLocaleString()}</td>
    <td>${totChaos.toLocaleString()}</td>
    <td>${totRpt.toLocaleString()}</td>
    <td>${totMr.toLocaleString()}</td>
    <td><span id="avgSupplies">${avgSupplies}%</span></td>
    </tr></thead>
    </table>
    </div>
    <p>
    <div class="mv-table-container">
    <table class="mv-table sortable" id="mvTable">
    <thead><tr><th>char</th><th>&#x2713</th><th>eq</th><th class="mv-rga-cell">rga</th><th>lvl</th><th>class</th><th>crew</th><th>rage</th><th>experience</th><th>to level</th><th>growth today</th><th>yesterday</th><th>strength</th><th>supplies</th><th>gold</th></tr></thead>
    <tbody>${rows.join('')}</tbody>
    </table></div>
    `

    document.querySelector("#maxAllSuppliesLink").addEventListener('click', async function(){

        const loadingDiv = document.createElement("div");
        loadingDiv.innerHTML = `loading<br><span class="blink">&#x29D6;</span>`
        loadingDiv.id = "loadingDiv"
        document.body.appendChild(loadingDiv);

        const maxAllSupplies = async (i) => {
            const string = i.static.match(/href="profile\?(rg_sess_id=[A-Za-z0-9]+&suid=[0-9]+&serverid=[0-9]+)"/i)[1];
            await fetch(`supplies?${string}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: new URLSearchParams({'buymax': 'Buy Max',})})
        };
        await Promise.all(array.map(maxAllSupplies));
        document.querySelector("#avgSupplies").innerHTML = "MAXED"
        document.querySelector("#loadingDiv").remove();
    });
    await sortableTables();
    await mvEqButtons();
    document.querySelector("#loadingDiv").remove();
};

async function mvCharacterStats(rgas){
    const endpoints = ['profile','home'];
    const array = await mvFetch(rgas,endpoints);
    const rows = [];
    const table = async (i) => {
        const mr = i.profile.maxrage.toLocaleString();
        const power = i.profile.power.toLocaleString();
        const ele = i.profile.elemental.toLocaleString();
        const atk = i.profile.attack.toLocaleString();
        const hp = i.profile.hp.toLocaleString();
        const chaos = i.profile.chaos.toLocaleString();
        const res1 = i.home.holyresist;
        const res2 = i.home.arcaneresist;
        const res3 = i.home.shadowresist;
        const res4 = i.home.fireresist;
        const res5 = i.home.kineticresist;
        const rpt = i.profile.rageperturn.toLocaleString();
        const ept = i.profile.expperturn.toLocaleString();
        const ramp = i.profile.rampage.toLocaleString();
        const wilderness = i.profile.wilderness.toLocaleString();
        const mrrptratio = i.profile.maxrage/i.profile.rageperturn
        rows.push(`<tr>
        ${i.static}
        <td>${mr}</td>
        <td>${power}</td>
        <td>${ele}</td>
        <td>${atk}</td>
        <td>${hp}</td>
        <td>${chaos}</td>
        <td><font color="#00FFFF">${res1}</td>
        <td><font color="#FFFF00">${res2}</td>
        <td><font color="#7e01bc">${res3}</td>
        <td><font color="#FF0000">${res4}</td>
        <td><font color="#00FF00">${res5}</td>
        <td>${rpt}</td>
        <td>${ramp}%</td>
        <td>${mrrptratio.toFixed(1)}</td>
        <td>${ept}</td>
        <td>${wilderness}</td>
        </tr>`);
    };
    await Promise.all(array.map(table));
    document.querySelector("#mvContent").innerHTML = `
    <div class="mv-table-container"><table class="mv-table sortable" id="mvTable">
    <thead><tr><th>char</th><th>&#x2713</th><th>eq</th><th class="mv-rga-cell">rga</th><th>lvl</th><th>max rage</th><th>power</th><th>ele</th><th>atk</th><th>hp</th><th>chaos</th><th>res</th><th>res</th><th>res</th><th>res</th><th>res</th><th>rpt</th><th>ramp</th><th>mr:rpt</th><th>ept</th><th>wilderness</th></tr></thead>
    <tbody>${rows.join('')}</tbody>
    </table></div>
    `
    await sortableTables();
    await mvEqButtons();
    document.querySelector("#loadingDiv").remove();
};

async function mvCharacterFactions(rgas){
    const endpoints = ['profile','home'];
    const array = await mvFetch(rgas,endpoints);
    const rows = [];
    const table = async (i) => {
        const faction = i.profile.faction;
        const a = i.home.alvar;
        const d = i.home.delruk;
        const v = i.home.vordyn;
        const c = i.home.codex;
        const t = a + d + v
        rows.push(`<tr>
        ${i.static}
        <td>${faction}</td>
        <td>${a}</td>
        <td>${d}</td>
        <td>${v}</td>
        <td>${t}</td>
        <td>${c}</td>
        </tr>`);
    };
    await Promise.all(array.map(table));
    document.querySelector("#mvContent").innerHTML = `
    <div class="mv-table-container"><table class="mv-table sortable" id="mvTable">
    <thead><tr><th>char</th><th>&#x2713</th><th>eq</th><th class="mv-rga-cell">rga</th><th>lvl</th><th>current faction</th><th>alvar loyalty</th><th>delruk loyalty</th><th>vordyn loyalty</th><th>total loyalty</th><th>codex level</th></tr></thead>
    <tbody>${rows.join('')}</tbody>
    </table></div>
    `
    await sortableTables();
    await mvEqButtons();
    document.querySelector("#loadingDiv").remove();
};

async function mvCharacterSkills(rgas){
    const endpoints = ['home','cast_skills?C=7','profile'];
    const array = await mvFetch(rgas,endpoints);
    const rows = [];
    const table = async (i) => {
        const wall = i.skills.match(/alt="Shield Wall"/i) ? "X" : "";
        const slayer = i.skills.match(/alt="God Slayer"/i) ? "X" : "";
        const grind = i.skills.match(/alt="Daily Grind"/i) ? "X" : "";
        const influence = i.skills.match(/alt="Triworld Influence"/i) ? "X" : "";
        const skillclass = i.home.skillclass;
        const skillpoints = i.home.skillpoints;
        const active = i.profile.skills.images;
        rows.push(`<tr>${i.static}<td>${skillclass}</td><td>${skillpoints}</td><td>${wall}</td><td>${slayer}</td><td>${grind}</td><td>${influence}</td><td style="max-width:750px;">${active.join('')}</td></tr>`);
    };
    await Promise.all(array.map(table));
    document.querySelector("#mvContent").innerHTML = `
    <div class="mv-table-container"><table class="mv-table sortable" id="mvTable">
    <thead><tr><th>char</th><th>&#x2713</th><th>eq</th><th class="mv-rga-cell">rga</th><th>lvl</th><th>class</th><th>skill points</th><th><img src="images/skills/shieldwall.png"></th><th><img src="images/skills/GodSlayerSkill.png"></th><th><img src="images/skills/dailygrind.png"></th><th><img src="images/skills/influenceskill.png"></th><th>active skills</th></tr></thead>
    <tbody>${rows.join('')}</tbody>
    </table></div>
    `
    await sortableTables();
    await mvEqButtons();
    document.querySelector("#loadingDiv").remove();
};

async function mvCharacterUnderlings(rgas){
    const endpoints = ['profile','home'];
    const array = await mvFetch(rgas,endpoints);
    const rows = [];
    const table = async (i) => {
        const lings = i.profile.underlings;
        const loyalty = i.home.underlingloyalty * 10;
        const allLings = i.profile.underlingids;
        let allLingsAtk = 0;
        let allLingsHp = 0;
        let allLingsPower = 0;
        let allLingsExp = 0;
        if (allLings){
            const lingLoop = async (lingid) => {
                const id = lingid
                const lingProfile = await superfetchProfile(`profile?id=${id}`);
                allLingsAtk += lingProfile.attack;
                allLingsHp += lingProfile.hp;
                allLingsPower += lingProfile.power;
                allLingsExp += lingProfile.exp;
            };
            await Promise.all(allLings.map(lingLoop));
        }
        const maxAtk = allLingsAtk >= 11236 ? "100%" : (allLingsAtk/11236*100).toFixed(1) + "%"
        const maxHp = allLingsHp >= 25545 ? "100%" : (allLingsHp/25545*100).toFixed(1) + "%"
        rows.push(`<tr>${i.static}<td>${lings}</td><td>${allLingsExp.toLocaleString()}</td><td>${allLingsPower.toLocaleString()}</td><td>${loyalty}</td><td>${maxAtk}</td><td>${maxHp}</td></tr>`);
    };
    await Promise.all(array.map(table));
    document.querySelector("#mvContent").innerHTML = `
    <div class="mv-table-container"><table class="mv-table sortable" id="mvTable">
    <thead><tr><th>char</th><th>&#x2713</th><th>eq</th><th class="mv-rga-cell">rga</th><th>lvl</th><th>lings</th><th>total experience</th><th>total power</th><th>loyalty enhancement</th><th>ATK % MAXED BUFF</th></th><th>HP % MAXED BUFF</th></tr></thead>
    <tbody>${rows.join('')}</tbody>
    </table></div>
    `
    await sortableTables();
    await mvEqButtons();
    document.querySelector("#loadingDiv").remove();
};

async function mvCharacterGodSlayer(rgas){
    const endpoints = ['profile'];
    const array = await mvFetch(rgas,endpoints);
    const allgods = await info("All gods data");
    const rows = [];
    const table = async (i) => {
        const crew = i.profile.crewname;
        const completed = i.profile.completedgodslayer.split(',');
        const allgodsnames = allgods.map(god => god.name.replace(',',''));
        const needed = allgodsnames.filter(god => !completed.includes(god));
        const list = needed.map(god => god.replace(/(,| ,| the|The).*/gi, ''));
        rows.push(`<tr>${i.static}<td>${crew}</td><td>${i.profile.godslayer}</td><td class="filt" style="max-width:750px;">${list.join(', ')}</td></tr>`);
    };
    await Promise.all(array.map(table));
    document.querySelector("#mvContent").innerHTML = `
    <div class="mv-table-container">
    <input type="text" id="filter" class="mv-filter" placeholder="Filter missing gods..."><br>
    <table class="mv-table sortable filterable" id="mvTable">
    <thead><tr><th>char</th><th>&#x2713</th><th>eq</th><th class="mv-rga-cell">rga</th><th>lvl</th><th>crew</th><th>slayer lvl</th><th>gods missing</th></tr></thead>
    <tbody>${rows.join('')}</tbody>
    </table></div>
    `
    await filterTables();
    await sortableTables();
    await mvEqButtons();
    document.querySelector("#loadingDiv").remove();
};

async function mvCharacterCollections(rgas){
    const endpoints = ['collections'];
    const array = await mvFetch(rgas,endpoints);
    const rows = [];
    const table = async (i) => {
        const parser = new DOMParser()
        const x = parser.parseFromString(i.collections, 'text/html');
        const anjou = (x.querySelector("#divCollections > div.row > div:nth-child(1) > div > div > div.user-info.w-100.pr-3 > ul").innerHTML.match(/img/g) || []).length + " / 3"
        const reikar = (x.querySelector("#divCollections > div.row > div:nth-child(2) > div > div > div.user-info.w-100.pr-3 > ul").innerHTML.match(/img/g) || []).length + " / 3"
        const lorren = (x.querySelector("#divCollections > div.row > div:nth-child(3) > div > div > div.user-info.w-100.pr-3 > ul").innerHTML.match(/img/g) || []).length + " / 3"
        const lucile = (x.querySelector("#divCollections > div.row > div:nth-child(4) > div > div > div.user-info.w-100.pr-3 > ul").innerHTML.match(/img/g) || []).length + " / 3"
        const weima = (x.querySelector("#divCollections > div.row > div:nth-child(5) > div > div > div.user-info.w-100.pr-3 > ul").innerHTML.match(/img/g) || []).length + " / 3"
        const souma = (x.querySelector("#divCollections > div.row > div:nth-child(6) > div > div > div.user-info.w-100.pr-3 > ul").innerHTML.match(/img/g) || []).length + " / 3"
        const vanisha = (x.querySelector("#divCollections > div.row > div:nth-child(7) > div > div > div.user-info.w-100.pr-3 > ul").innerHTML.match(/img/g) || []).length + " / 3"
        const drolba = (x.querySelector("#divCollections > div.row > div:nth-child(8) > div > div > div.user-info.w-100.pr-3 > ul").innerHTML.match(/img/g) || []).length + " / 3"
        const quibel = (x.querySelector("#divCollections > div.row > div:nth-child(9) > div > div > div.user-info.w-100.pr-3 > ul").innerHTML.match(/img/g) || []).length + " / 3"
        rows.push(`<tr>${i.static}<td>${anjou}</td><td>${reikar}</td><td>${lorren}</td><td>${lucile}</td><td>${weima}</td><td>${souma}</td><td>${vanisha}</td><td>${drolba}</td><td>${quibel}</td></tr>`);
    };
    await Promise.all(array.map(table));
    document.querySelector("#mvContent").innerHTML = `
    <div class="mv-table-container"><table class="mv-table sortable" id="mvTable">
    <thead><tr><th>char</th><th>&#x2713</th><th>eq</th><th class="mv-rga-cell">rga</th><th>lvl</th><th>anjou</th><th>reikar</th><th>lorren</th><th>lucile</th><th>weima</th><th>souma</th><th>vanisha</th><th>drolba</th><th>quibel</th></tr></thead>
    <tbody>${rows.join('')}</tbody>
    </table></div>
    `
    await sortableTables();
    await mvEqButtons();
    document.querySelector("#loadingDiv").remove();
};

async function mvCharacterCodex(rgas){
    const endpoints = ['changefaction'];
    const array = await mvFetch(rgas,endpoints);
    const rows = [];
    const table = async (i) => {
        const completed = (i.changefaction.match(/Triworld Codex Chapter [0-9]+<br>/g) || ['0']).map(i => parseInt(i.match(/[0-9]+/i)))
        const incomplete = [];
        for (let i = 1; i <= 50; i++) {
            if (!completed.includes(i)) { incomplete.push(i) };
        };
        rows.push(`<tr>${i.static}<td>${completed.length}</td><td class="filt">${incomplete.join(',')}</td></tr>`);
    };
    await Promise.all(array.map(table));
    document.querySelector("#mvContent").innerHTML = `
    <div class="mv-table-container">
    <input type="text" id="filter" class="mv-filter" placeholder="Filter missing codex..."><br>
    <table class="mv-table sortable filterable" id="mvTable">
    <thead><tr><th>char</th><th>&#x2713</th><th>eq</th><th class="mv-rga-cell">rga</th><th>lvl</th><th>influence</th><th>incomplete codex</th></tr></thead>
    <tbody>${rows.join('')}</tbody>
    </table></div>
    `
    await filterTables();
    await sortableTables();
    await mvEqButtons();
    document.querySelector("#loadingDiv").remove();
};

async function mvEquipmentEquipped(rgas,slot){
    const endpoints = ['profile'];
    const array = await mvFetch(rgas,endpoints);
    const rows = [];
    const table = async (i) => {
        const slotsize = 'height:35px;width:35px'
        const mr = i.profile.maxrage.toLocaleString();
        const power = i.profile.power.toLocaleString();
        const ele = i.profile.elemental.toLocaleString();
        const core = `<img src="${i.profile.core.img}" onmouseover="itempopup(event,'${i.profile.core.id}')" onmouseout="kill()" style="${slotsize}">`
        const head = `<img src="${i.profile.head.img}" onmouseover="itempopup(event,'${i.profile.head.id}')" onmouseout="kill()" style="${slotsize}">`
        const neck = `<img src="${i.profile.neck.img}" onmouseover="itempopup(event,'${i.profile.neck.id}')" onmouseout="kill()" style="${slotsize}">`
        const weapon = `<img src="${i.profile.weapon.img}" onmouseover="itempopup(event,'${i.profile.weapon.id}')" onmouseout="kill()" style="${slotsize}">`
        const body = `<img src="${i.profile.body.img}" onmouseover="itempopup(event,'${i.profile.body.id}')" onmouseout="kill()" style="${slotsize}">`
        const shield = `<img src="${i.profile.shield.img}" onmouseover="itempopup(event,'${i.profile.shield.id}')" onmouseout="kill()" style="${slotsize}">`
        const belt = `<img src="${i.profile.belt.img}" onmouseover="itempopup(event,'${i.profile.belt.id}')" onmouseout="kill()" style="${slotsize}">`
        const pants = `<img src="${i.profile.pants.img}" onmouseover="itempopup(event,'${i.profile.pants.id}')" onmouseout="kill()" style="${slotsize}">`
        const ring = `<img src="${i.profile.ring.img}" onmouseover="itempopup(event,'${i.profile.ring.id}')" onmouseout="kill()" style="${slotsize}">`
        const foot = `<img src="${i.profile.foot.img}" onmouseover="itempopup(event,'${i.profile.foot.id}')" onmouseout="kill()" style="${slotsize}">`
        const chaosgem = `<img src="${i.profile.gem.img}" onmouseover="itempopup(event,'${i.profile.gem.id}')" onmouseout="kill()" style="${slotsize}">`
        const badge = `<img src="${i.profile.badge.img}" onmouseover="itempopup(event,'${i.profile.badge.id}')" onmouseout="kill()" style="${slotsize}">`
        const rune = `<img src="${i.profile.rune.img}" onmouseover="itempopup(event,'${i.profile.rune.id}')" onmouseout="kill()" style="${slotsize}">`
        const orb1 = `<img src="${i.profile.orb1.img}" onmouseover="itempopup(event,'${i.profile.orb1.id}')" onmouseout="kill()" style="${slotsize}">`
        const orb2 = `<img src="${i.profile.orb2.img}" onmouseover="itempopup(event,'${i.profile.orb2.id}')" onmouseout="kill()" style="${slotsize}">`
        const orb3 = `<img src="${i.profile.orb3.img}" onmouseover="itempopup(event,'${i.profile.orb3.id}')" onmouseout="kill()" style="${slotsize}">`

        rows.push(`<tr>${i.static}<td>${power}</td><td>${ele}</td><td>${mr.toLocaleString()}</td><td>${core}</td><td>${head}</td><td>${neck}</td><td>${weapon}</td><td>${body}</td><td>${shield}</td><td>${belt}</td><td>${pants}</td><td>${ring}</td><td>${foot}</td><td>${chaosgem}</td><td>${badge}</td><td>${rune}</td><td>${orb1}</td><td>${orb2}</td><td>${orb3}</td></tr>`);
    };
    await Promise.all(array.map(table));
    document.querySelector("#mvContent").innerHTML = `
    <div class="mv-table-container">
    <table class="mv-table sortable" id="mvTable">
    <thead><tr><th>char</th><th>&#x2713</th><th>eq</th><th class="mv-rga-cell">rga</th><th>lvl</th><th>POW</th><th>ELE</th><th>MR</th><th>COR</th><th>HED</th><th>NCK</th><th>WEP</th><th>BDY</th><th>SHD</th><th>BELT</th><th>PNT</th><th>RNG</th><th>FOT</th><th>GEM</th><th>BDG</th><th>RNE</th><th>ORB</th><th>ORB</th><th>ORB</th></tr></thead>
    <tbody>${rows.join('').replace(/onclick="[^"]*"/g,'')}</tbody>
    </table></div>
    `
    await sortableTables();
    await mvEqButtons();
    document.querySelector("#loadingDiv").remove();
};

async function mvEquipmentSlot(rgas,slot){
    const endpoints = ['profile'];
    const array = await mvFetch(rgas,endpoints);
    const rows = [];
    const table = async (i) => {
        const itemid = i.profile[slot].id;
        const itemData = await superfetchItem(itemid);
        rows.push(`
            <tr>
            ${i.static}
            <td style="max-width:200px"><font color="#${itemData.rarityColor}">${itemData.name}</font></td>
            <td><img src="${itemData.img}" onmouseover="itempopup(event,'${itemid}')" onmouseout="kill()" style="height:35px;width:35px"></td>
            <td style="max-width:75px" class="mv-augs">${itemData.augs}</td>
            <td>${itemData.gems}</td>
            <td>${itemData.atk.toLocaleString()}</td>
            <td>${itemData.hp.toLocaleString()}</td>
            <td>${itemData.ele.toLocaleString()}</td>
            <td>${itemData.chaosdmg}</td>
            <td>${itemData.resist}</td>
            <td>${itemData.chaosres}</td>
            <td>${itemData.vile}</td>
            <td>${itemData.rpt.toLocaleString()}</td>
            <td>${itemData.ept.toLocaleString()}</td>
            <td>${itemData.rampage}%</td>
            <td>${itemData.critical}%</td>
            <td>${itemData.maxrage.toLocaleString()}</td>
            <td>${itemData.block}%</td>
            <td>${itemData.eleblock}%</td>
            <td>${itemData.ps}</td>
            </tr>
        `);
    };
    await Promise.all(array.map(table));
    document.querySelector("#mvContent").innerHTML = `
    <div class="mv-table-container">
    <table class="mv-table sortable" id="mvTable">
    <thead><tr><th>char</th><th>&#x2713</th><th>eq</th><th class="mv-rga-cell">rga</th><th>lvl</th><th>name</th><th>img</th><th>augs</th><th>gem</th><th>atk</th><th>hp</th><th>ele</th><th><font color="#f441be">chs</th><th>res</th><th><font color="#f441be">res</th><th>vle</th><th>rpt</th><th>ept</th><th>rmp</th><th>crt</th><th>mr</th><th>blk</th><th><font color="#00FF00">blk</th><th>ps</th></tr></thead>
    <tbody>${rows.join('')}</tbody>
    </table></div>
    `
    await sortableTables();
    await mvEqButtons();
    document.querySelector("#loadingDiv").remove();
};

async function mvEquipmentChaosGem(rgas){
    const endpoints = ['profile'];
    const array = await mvFetch(rgas,endpoints);
    const rows = [];
    const table = async (i) => {
        const itemid = i.profile.gem.id;
        const itemData = await superfetchItem(itemid);
        rows.push(`
            <tr>
            ${i.static}
            <td style="max-width:200px"><font color="#${itemData.rarityColor}">${itemData.name}</font></td>
            <td><img src="${itemData.img}" onmouseover="itempopup(event,'${itemid}')" onmouseout="kill()" style="height:35px;width:35px"></td>
            <td>${itemData.chaosdmg.toLocaleString()}</td>
            <td>${itemData.rampage}%</td>
            <td>${itemData.critical}%</td>
            <td>${itemData.maxrage.toLocaleString()}</td>
            </tr>
        `);
    };

    await Promise.all(array.map(table));
    document.querySelector("#mvContent").innerHTML = `
    <div class="mv-table-container">
    <table class="mv-table sortable" id="mvTable">
    <thead><tr><th>char</th><th>&#x2713</th><th>eq</th><th class="mv-rga-cell">rga</th><th>lvl</th><th>name</th><th>img</th><th>chaos</th><th>rampage</th><th>critical</th><th>max rage</th></tr></thead>
    <tbody>${rows.join('')}</tbody>
    </table></div>
    `
    await sortableTables();
    await mvEqButtons();
    document.querySelector("#loadingDiv").remove();
};

async function mvEquipmentBadge(rgas){
    const endpoints = ['profile'];
    const array = await mvFetch(rgas,endpoints);
    const rows = [];
    const table = async (i) => {
        const itemid = i.profile.badge.id;
        const itemData = await superfetchItem(itemid);
        rows.push(`
            <tr>
            ${i.static}
            <td style="max-width:200px"><font color="#${itemData.rarityColor}">${itemData.name}</font></td>
            <td><img src="${itemData.img}" onmouseover="itempopup(event,'${itemid}')" onmouseout="kill()" style="height:35px;width:35px"></td>
            <td>${itemData.atk.toLocaleString()}</td>
            <td>${itemData.hp.toLocaleString()}</td>
            <td>${itemData.ele.toLocaleString()}</td>
            </tr>
        `);
    };
    await Promise.all(array.map(table));
    document.querySelector("#mvContent").innerHTML = `
    <div class="mv-table-container">
    <table class="mv-table sortable" id="mvTable">
    <thead><tr><th>char</th><th>&#x2713</th><th>eq</th><th class="mv-rga-cell">rga</th><th>lvl</th><th>name</th><th>img</th><th>atk</th><th>hp</th><th>elemental</th></tr></thead>
    <tbody>${rows.join('')}</tbody>
    </table></div>
    `
    await sortableTables();
    await mvEqButtons();
    document.querySelector("#loadingDiv").remove();
};

async function mvEquipmentOrbs(rgas){
    const endpoints = ['profile'];
    const array = await mvFetch(rgas,endpoints);
    const rows = [];
    const table = async (i) => {
        const orb1id = i.profile.orb1.id;
        const orb2id = i.profile.orb2.id;
        const orb3id = i.profile.orb3.id;
        const orb1Data = await superfetchItem(orb1id);
        const orb2Data = await superfetchItem(orb2id);
        const orb3Data = await superfetchItem(orb3id);
        rows.push(`
            <tr>
            ${i.static}
            <td><img src="${orb1Data.img}" onmouseover="itempopup(event,'${orb1id}')" onmouseout="kill()" style="height:35px;width:35px"></td>
            <td><img src="${orb2Data.img}" onmouseover="itempopup(event,'${orb2id}')" onmouseout="kill()" style="height:35px;width:35px"></td>
            <td><img src="${orb3Data.img}" onmouseover="itempopup(event,'${orb3id}')" onmouseout="kill()" style="height:35px;width:35px"></td>
            <td><font color="#${orb1Data.rarity}">${orb1Data.name}</font></td>
            <td><font color="#${orb2Data.rarity}">${orb2Data.name}</font></td>
            <td><font color="#${orb3Data.rarity}">${orb3Data.name}</font></td>
            <td>${(orb1Data.maxrage + orb2Data.maxrage + orb3Data.maxrage).toLocaleString()}</td>
            <td>${(orb1Data.ele + orb2Data.ele + orb3Data.ele).toLocaleString()}</td>
            <td>${(orb1Data.atk + orb2Data.atk + orb3Data.atk).toLocaleString()}</td>
            <td>${(orb1Data.hp + orb2Data.hp + orb3Data.hp).toLocaleString()}</td>
            <td>${(orb1Data.rpt + orb2Data.rpt + orb3Data.rpt).toLocaleString()}</td>
            <td>${(orb1Data.ept + orb2Data.ept + orb3Data.ept).toLocaleString()}</td>
            <td>${(orb1Data.chaosdmg + orb2Data.chaosdmg + orb3Data.chaosdmg).toLocaleString()}</td>
            </tr>
        `);
    };
    await Promise.all(array.map(table));
    document.querySelector("#mvContent").innerHTML = `
    <div class="mv-table-container">
    <table class="mv-table sortable" id="mvTable">
    <thead><tr><th>char</th><th>&#x2713</th><th>eq</th><th class="mv-rga-cell">rga</th><th>lvl</th><th>img</th><th>img</th><th>img</th><th>orb 1</th><th>orb 2</th><th>orb 3</th><th>mr</th><th>ele</th><th>atk</th><th>hp</th><th>rpt</th><th>ept</th><th>chaos</th></tr></thead>
    <tbody>${rows.join('')}</tbody>
    </table></div>
    `
    await sortableTables();
    await mvEqButtons();
    document.querySelector("#loadingDiv").remove();
};

async function mvEquipmentRune(rgas){
    const endpoints = ['profile','ajax/backpackcontents.php?tab=quest'];
    const array = await mvFetch(rgas,endpoints);
    const rows = [];
    const table = async (i) => {
        const fusers = (i.quest.match(/data-name="Elemental Fuser" data-itemqty="([0-9]+)"/i) || [0,0])[1];
        const itemid = i.profile.rune.id;
        const itemData = await superfetchItem(itemid);
        rows.push(`
            <tr>
            ${i.static}
            <td style="max-width:200px"><font color="#${itemData.rarityColor}">${itemData.name}</font></td>
            <td><img src="${itemData.img}" onmouseover="itempopup(event,'${itemid}')" onmouseout="kill()" style="height:35px;width:35px"></td>
            <td>${itemData.ele.toLocaleString()}</td>
            <td>${fusers}</td>
            </tr>
        `);
    };
    await Promise.all(array.map(table));
    document.querySelector("#mvContent").innerHTML = `
    <div class="mv-table-container">
    <table class="mv-table sortable" id="mvTable">
    <thead><tr><th>char</th><th>&#x2713</th><th>eq</th><th class="mv-rga-cell">rga</th><th>lvl</th><th>name</th><th>img</th><th>elemental</th><th><img src="images/items/elementalfuser.jpg" onmouseover="statspopup(event,'Elemental Fusers')" onmouseout="kill()"></th></tr></thead>
    <tbody>${rows.join('')}</tbody>
    </table></div>
    `
    await sortableTables();
    await mvEqButtons();
    document.querySelector("#loadingDiv").remove();
};

async function mvEquipmentBooster(rgas){
    const endpoints = ['profile'];
    const array = await mvFetch(rgas,endpoints);
    const rows = [];
    const table = async (i) => {
        const itemid = i.profile.booster.id;
        const itemData = await superfetchItem(itemid);
        rows.push(`
            <tr>
            ${i.static}
            <td style="max-width:200px"><font color="#${itemData.rarityColor}">${itemData.name}</font></td>
            <td><img src="${itemData.img}" onmouseover="itempopup(event,'${itemid}')" onmouseout="kill()" style="height:35px;width:35px"></td>
            </tr>
        `);
    };
    await Promise.all(array.map(table));
    document.querySelector("#mvContent").innerHTML = `
    <div class="mv-table-container">
    <table class="mv-table sortable" id="mvTable">
    <thead><tr><th>char</th><th>&#x2713</th><th>eq</th><th class="mv-rga-cell">rga</th><th>lvl</th><th>booster</th><th>img</th></tr></thead>
    <tbody>${rows.join('')}</tbody>
    </table></div>
    `
    await sortableTables();
    await mvEqButtons();
    document.querySelector("#loadingDiv").remove();
};

async function mvEquipmentCrests(rgas){
    const endpoints = ['profile'];
    const array = await mvFetch(rgas,endpoints);
    const rows = [];
    const table = async (i) => {
        const crest1 = await superfetchItem(i.profile.ccrest.id);
        const crest2 = await superfetchItem(i.profile.pcrest.id);
        const crest3 = await superfetchItem(i.profile.fcrest.id);
        const crest4 = await superfetchItem(i.profile.acrest.id);
        rows.push(
            `<tr>
            ${i.static}
            <td><img src="${crest1.img}" onmouseover="itempopup(event,'${i.profile.ccrest.id}')" onmouseout="kill()" style="height:35px;width:35px"></td>
            <td><img src="${crest3.img}" onmouseover="itempopup(event,'${i.profile.fcrest.id}')" onmouseout="kill()" style="height:35px;width:35px"></td>
            <td><img src="${crest2.img}" onmouseover="itempopup(event,'${i.profile.pcrest.id}')" onmouseout="kill()" style="height:35px;width:35px"></td>
            <td><img src="${crest4.img}" onmouseover="itempopup(event,'${i.profile.acrest.id}')" onmouseout="kill()" style="height:35px;width:35px"></td>
            <td style="max-width:200px"><font color="#${crest1.rarity}">${crest1.name}</font></td>
            <td style="max-width:200px"><font color="#${crest3.rarity}">${crest3.name}</font></td>
            <td style="max-width:200px"><font color="#${crest2.rarity}">${crest2.name}</font></td>
            <td style="max-width:200px"><font color="#${crest4.rarity}">${crest4.name}</font></td>
            </tr>`
        );
    };
    await Promise.all(array.map(table));
    document.querySelector("#mvContent").innerHTML = `
    <div class="mv-table-container">
    <table class="mv-table sortable" id="mvTable">
    <thead><tr><th>char</th><th>&#x2713</th><th>eq</th><th class="mv-rga-cell">rga</th><th>lvl</th><th>img</th><th>img</th><th>img</th><th>img</th><th>class</th><th>ferocity</th><th>preservation</th><th>affliction</th></tr></thead>
    <tbody>${rows.join('')}</tbody>
    </table></div>
    `
    await sortableTables();
    await mvEqButtons();
    document.querySelector("#loadingDiv").remove();
};

async function mvEquipmentAugments(rgas){
    const endpoints = ['profile'];
    const array = await mvFetch(rgas,endpoints);
    const rows = [];
    let totalOpen = 0;
    const table = async (i) => {
        const core = await superfetchItem(i.profile.core.id);
        const head = await superfetchItem(i.profile.head.id);
        const neck = await superfetchItem(i.profile.neck.id);
        const weapon = await superfetchItem(i.profile.weapon.id);
        const body = await superfetchItem(i.profile.body.id);
        const shield = await superfetchItem(i.profile.shield.id);
        const belt = await superfetchItem(i.profile.belt.id);
        const pants = await superfetchItem(i.profile.pants.id);
        const ring = await superfetchItem(i.profile.ring.id);
        const foot = await superfetchItem(i.profile.foot.id);
        const allaugs = core.augs + head.augs + neck.augs + weapon.augs + body.augs + shield.augs + belt.augs + pants.augs + ring.augs + foot.augs
        const augcount = (allaugs.match(/itempopup\(event,'[0-9]+_[0-9]+'\)/g) || []).length
        totalOpen += core.openaugs + head.openaugs + neck.openaugs + weapon.openaugs + body.openaugs + shield.openaugs + belt.openaugs + pants.openaugs + ring.openaugs + foot.openaugs
        rows.push(`<tr>${i.static}<td>${augcount}</td><td class="mv-augs" style="max-width:615px;">${allaugs}</td></tr>`)
    };
    await Promise.all(array.map(table));
    document.querySelector("#mvContent").innerHTML = `
    <div class="mv-table-container">
    <table class="mv-table" id="mvTable">
    <thead><tr>
    <th style="width:200px;font-weight:900;text-align:center;">TOTAL OPEN AUG SLOTS</th>
    </tr></thead>
    <tbody><tr>
    <td style="text-align:center;">${totalOpen}</td>
    </tr></thead>
    </table>
    </div>
    <p>
    <div class="mv-table-container">
    <table class="mv-table sortable" id="mvTable">
    <thead><tr><th>char</th><th>&#x2713</th><th>eq</th><th class="mv-rga-cell">rga</th><th>lvl</th><th>count</th><th>slotted augments</th></tr></thead>
    <tbody>${rows.join('')}</tbody>
    </table></div>
    `
    await sortableTables();
    await mvEqButtons();
    document.querySelector("#loadingDiv").remove();
};

async function mvStorageUtility(rgas){
    const endpoints = ['ajax/backpackcontents.php?tab=utility'];
    const array = await mvFetch(rgas,endpoints);
    const rows = [];
    const table = async (i) => {
        const bpCapacity = parseInt(i.utility.match(/data-maxval="([0-9]+)"/i)[1]);
        const bpCount = parseInt(i.utility.match(/data-curitemct="([0-9]+)"/i)[1]);
        const bpOpen = bpCapacity-bpCount;
        const match = i.utility.replace(/\s+/g, ' ').replace(/[\n\r]/g,'').match(/src="[^"]*" alt="[^"]*" ONMOUSEOVER="itempopup\(event,'[0-9]+'\)"/g) || [];
        const items = match.length < 250 ? match.map(i => `<img ${i} onmouseout="kill()" class="mv-item">`) : ['Too many items to display'];
        rows.push(`
            <tr>
            ${i.static}
            <td>${bpCount}</td>
            <td>${bpCapacity}</td>
            <td>${bpOpen}</td>
            <td style="max-width:315px">${items.join('')}</td>
            </tr>
        `);
    };
    await Promise.all(array.map(table));
    document.querySelector("#mvContent").innerHTML = `
    <div class="mv-table-container">
    <table class="mv-table sortable" id="mvTable">
    <thead><tr><th>char</th><th>&#x2713</th><th>eq</th><th class="mv-rga-cell">rga</th><th>lvl</th><th>count</th><th>capacity</th><th>open slots</th><th>backpack items</th></tr></thead>
    <tbody>${rows.join('')}</tbody>
    </table></div>
    `

    const selectable = document.querySelectorAll('img.mv-selectable');
    for (var i = 0; i < selectable.length; i++){
        const item = selectable[i];
        item.addEventListener('click', async function(){
            item.classList.toggle('mv-backpack-selected')
        })
    }

    await sortableTables();
    await mvEqButtons();

    document.querySelector("#loadingDiv").remove();
};

async function mvStorageBackpack(rgas){
    const endpoints = ['ajax/backpackcontents.php?tab=regular'];
    const array = await mvFetch(rgas,endpoints);
    const rows = [];
    const table = async (i) => {
        const bpCapacity = parseInt(i.regular.match(/data-maxval="([0-9]+)"/i)[1]);
        const bpCount = parseInt(i.regular.match(/data-curitemct="([0-9]+)"/i)[1]);
        const bpOpen = bpCapacity-bpCount;
        const match = i.regular.replace(/\s+/g, ' ').replace(/[\n\r]/g,'').match(/src="[^"]*" alt="[^"]*" ONMOUSEOVER="itempopup\(event,'[0-9]+'\)"/g) || [];
        const items = match.length < 250 ? match.map(i => `<img ${i} onmouseout="kill()" class="mv-item">`) : ['Too many items to display'];
        rows.push(`
            <tr>
            ${i.static}
            <td>${bpCount}</td>
            <td>${bpCapacity}</td>
            <td>${bpOpen}</td>
            <td style="max-width:315px">${items.join('')}</td>
            </tr>
        `);
    };
    await Promise.all(array.map(table));
    document.querySelector("#mvContent").innerHTML = `
    <div class="mv-table-container">
    <table class="mv-table sortable" id="mvTable">
    <thead><tr><th>char</th><th>&#x2713</th><th>eq</th><th class="mv-rga-cell">rga</th><th>lvl</th><th>count</th><th>capacity</th><th>open slots</th><th>backpack items</th></tr></thead>
    <tbody>${rows.join('')}</tbody>
    </table></div>
    `

    const selectable = document.querySelectorAll('img.mv-selectable');
    for (var i = 0; i < selectable.length; i++){
        const item = selectable[i];
        item.addEventListener('click', async function(){
            item.classList.toggle('mv-backpack-selected')
        })
    }

    await sortableTables();
    await mvEqButtons();

    document.querySelector("#loadingDiv").remove();
};

async function mvStorageItems(rgas,tab){
    const endpoints = [`ajax/backpackcontents.php?tab=${tab}`];
    const array = await mvFetch(rgas,endpoints);
    const headerArray = [];

    const itemsList = async (i) => {
        const itemsParse = i[tab].replace(/\s+/g, ' ').replace(/[\n\r]/g,'').replace(/'/g,'').match(/src="[^"]*" alt="[^"]*"/g);
        if (itemsParse){
            for (let n = 0; n < itemsParse.length; n++) {
                headerArray.push(itemsParse[n]);
            };
        };
    };
    await Promise.all(array.map(itemsList));

    headerArray.sort((a, b) => {
        const altA = a.match(/alt="([^"]*)"/)[1];
        const altB = b.match(/alt="([^"]*)"/)[1];
        return altA.localeCompare(altB);
    });

    const header = ([...new Set(headerArray)]).map(i => `<th><img ${i.match(/src="[^"]*"/i)} onmouseover="statspopup(event,'${i.match(/alt="([^"]*)"/i)[1]}')" onmouseout="kill()"></th>`);

    const noOfTables = Math.ceil(header.length/18);

    const headers = []
    const rows = []

    for (let i = 0; i < noOfTables; i++) {

        const slicedHeader = header.slice(i*18,(i+1)*18);
        headers[i+1] = slicedHeader;

        const row = []

        const table = async (a) => {

            const names = slicedHeader.join('').match(/event,'[^']*'/g).map(p => p.match(/'([^']*)'/)[1]);
            const item = a[tab].replace(/\s+/g, ' ').replace(/[\n\r]/g,'').replace(/'/g,'');

            let cells = a.static;

            for (let n = 0; n < names.length; n++) {
                const regex = new RegExp(`data-itemidqty="[0-9]+" data-name="${names[n]}"`);
                const count = (item.match(regex) || ['itemidqty="0"']).map(m => m.match(/itemidqty="([0-9]+)"/)[1]);

                cells += '<td>' + count + '</td>';
            };

            row.push('<tr>' + cells + '</tr>');
        };
        await Promise.all(array.map(table));

        rows[i+1] = row;
    };
    document.querySelector("#mvContent").innerHTML = `
    <span id="tableNoSpan"></span>
    <div class="mv-table-container" id="mv-table-container">
    <table class="mv-table sortable" id="mvTable">
    <thead><tr><th>char</th><th>&#x2713</th><th>eq</th><th class="mv-rga-cell">rga</th><th>lvl</th>${headers[1].join('')}</tr></thead>
    <tbody>${rows[1].join('')}</tbody>
    </table></div></div>
    `

    if (noOfTables > 1){
        const tableLinks = [];

        for (let i = 0; i < noOfTables; i++) {
            tableLinks.push(`<a href="javascript:void(0);" class="mv-btn-sub" style="margin-bottom:10px;" id="items-table-${i+1}">${i+1}</a>`)
        };
        document.querySelector("#tableNoSpan").innerHTML = `<center>${tableLinks.join('')}</center>`
        document.querySelector("#items-table-1").classList.add('mv-btn-sub-active');

        for (let i = 0; i < noOfTables; i++) {
            document.querySelector(`#items-table-${i+1}`).addEventListener('click', async function(){

                document.querySelector('.mv-btn-sub-active').classList.remove('mv-btn-sub-active');
                document.querySelector(`#items-table-${i+1}`).classList.add('mv-btn-sub-active');

                document.querySelector("#mv-table-container").innerHTML = `
                <table class="mv-table sortable" id="mvTable">
                <thead><tr><th>char</th><th>&#x2713</th><th>eq</th><th class="mv-rga-cell">rga</th><th>lvl</th>${headers[i+1].join('')}</tr></thead>
                <tbody>${rows[i+1].join('')}</tbody>
                </table>
                `
                await sortableTables();
                await mvEqButtons();
            });
        };
    };
    await sortableTables();
    await mvEqButtons();
    document.querySelector("#loadingDiv").remove();
}

async function mvStorageEquipment(rgas){
    const endpoints = ['augmentequip'];
    const array = await mvFetch(rgas,endpoints);
    const rows = [];
    let tableMsg = ''
    const table = async (i) => {
        if (i.augmentequip.match(/<h1>Manage Augments<\/h1>/i)){;
            const items = i.augmentequip.match(/<img style="max-width:40px;max-height:40px" border="0" src="[^"]*" onmouseover="itempopup\(event,'[0-9]+'\)" onmouseout="kill\(\)">/g)
            if (items){
                rows.push('<tr>' + i.static + '<td style="width:650px">' + items.join('') + '</td></tr>')[1]
            };
        } else {
            tableMsg = '<i>Equipment will only display for the originating RGA because security word is required to access items</i>'
        };
    };
    await Promise.all(array.map(table));
    document.querySelector("#mvContent").innerHTML = `
    <div class="mv-table-container">
    <center><font color="#2D2D2D">${tableMsg}</font></center>
    <table class="mv-table sortable" id="mvTable">
    <thead><tr><th>char</th><th>&#x2713</th><th>eq</th><th class="mv-rga-cell">rga</th><th>lvl</th><th>all equipment</th></tr></thead>
    <tbody>${rows.join('')}</tbody>
    </table></div>
    `
    await sortableTables();
    await mvEqButtons();
    document.querySelector("#loadingDiv").remove();
}

async function mvStorageVault(rgas){
    const endpoints = ['vault'];
    const array = await mvFetch(rgas,endpoints);
    let tableMsg = ''
    const rows = [];
    const table = async (i) => {
        if (i.vault.match(/Currently Storing/i)){;
            const vaultCapacity = parseInt(i.vault.match(/Currently Storing <b>[0-9]+ \/ ([0-9]+)<\/b>/i)[1]);
            const vaultCount = parseInt(i.vault.match(/Currently Storing <b>([0-9]+) \/ [0-9]+<\/b>/i)[1]);
            const vaultOpen = vaultCapacity-vaultCount;
            const parseData = new DOMParser();
            const vaultDoc = parseData.parseFromString(i.vault, 'text/html');
            const items = vaultDoc.querySelectorAll("td");
            const itemsArray = [];
            if (items){
                for (let i of items){
                    const item = i.innerHTML
                    if (item.match(/event,'[0-9]+'/i) && item.match(/src="[^"]*"/i) && item.match('checkbox')){
                        const itemId = item.match(/event,'([0-9]+)'/i)[1];
                        const itemImg = item.match(/src="([^"]*)"/i)[1];
                        itemsArray.push(`<img src="${itemImg}" class="mv-item" onmouseover="itempopup(event,'${itemId}')" onmouseout="kill()">`)
                    };
                };
                rows.push(`
                    <tr>
                    ${i.static}
                    <td>${vaultCount}</td>
                    <td>${vaultCapacity}</td>
                    <td>${vaultOpen}</td>
                    <td style="width:800px">${itemsArray.join('')}</td>
                    </tr>
                `);
            };
        } else {
            tableMsg = '<i>Vault items will only display for the originating RGA because security word is required to access items</i>'
        };
    };
    await Promise.all(array.map(table));
    document.querySelector("#mvContent").innerHTML = `
    <div class="mv-table-container">
    <center><font color="#2D2D2D">${tableMsg}</font></center>
    <table class="mv-table sortable" id="mvTable">
    <thead><tr><th>char</th><th>&#x2713</th><th>eq</th><th class="mv-rga-cell">rga</th><th>lvl</th><th>items</th><th>capacity</th><th>open slots</th><th>vault</th></tr></thead>
    <tbody>${rows.join('')}</tbody>
    </table></div>
    `
    await sortableTables();
    await mvEqButtons();
    document.querySelector("#loadingDiv").remove();
};

async function mvStorageAugments(rgas){
    const endpoints = ['augmentequip'];
    const array = await mvFetch(rgas,endpoints);
    const rows = [];
    let tableMsg = ''
    const table = async (i) => {
        if (i.augmentequip.match(/<h1>Manage Augments<\/h1>/i)){;
            const match = i.augmentequip.match(/width="20" height="20" src="[^"]*" onmouseover="itempopup\(event,'[0-9]+'\)"/g)
            if (match){
                const items = match.map(m => `<img ${m} onmouseout="kill()">`);
                rows.push('<tr>' + i.static + '<td style="width:650px">' + items.join('') + '</td></tr>')[1]
            };
        } else {
            tableMsg = '<i>Augments will only display for the originating RGA because security word is required to access items</i>'
        };
    };
    await Promise.all(array.map(table));
    document.querySelector("#mvContent").innerHTML = `
    <div class="mv-table-container">
    <center><font color="#2D2D2D">${tableMsg}</font></center>
    <table class="mv-table sortable" id="mvTable">
    <thead><tr><th>char</th><th>&#x2713</th><th>eq</th><th class="mv-rga-cell">rga</th><th>lvl</th><th>all augments</th></tr></thead>
    <tbody>${rows.join('')}</tbody>
    </table></div>
    `
    await sortableTables();
    await mvEqButtons();
    document.querySelector("#loadingDiv").remove();
};



async function mvItemSlotting(rgas,string){
    document.querySelector("#mvContent").innerHTML = `
    <div class="mv-table-container" id="item-slotting-div">
    <input type="text" id="itemLink" class="mv-filter" style="width:800px" placeholder="Link to item you are slotting...">
    </div>
    `

    document.querySelector("#itemLink").addEventListener('input', async function() {
        const input = document.querySelector("#itemLink").value;
        const link = input.match(/itemlink\?id=[0-9]+/i);

        if (link){

            const itemidNew = link.toString().match(/[0-9]+/);

            const sNew = await superfetchItem(itemidNew);
            const imgNew = sNew.img;
            const nameNew = sNew.name;
            const eleNew = sNew.ele;
            const mrNew = sNew.maxrage;
            const slot = sNew.slot;

            if (!string.match('Full')){ rgas = rgas.slice(0, 2) };
            const endpoints = ['profile','equipment?r=0'];
            const array = await mvFetch(rgas,endpoints);
            const rows = [];

            const table = async (i) => {
                const mrChar = i.profile.maxrage;
                const eleChar = i.profile.elemental;
                const itemid = i.profile[slot].id;
                const s = await superfetchItem(itemid);
                const imgCurrent = s.img;
                const nameCurrent = s.name;
                const eleCurrent = s.ele;
                const mrCurrent = s.maxrage;
                rows.push(`<tr>
                ${i.static}
                <td>${eleChar.toLocaleString()}</td>
                <td>${mrChar.toLocaleString()}</td>
                <td class="blank-cell"></td>
                <td><img src="${imgCurrent}" onmouseover="itempopup(event,'${itemid}')" onmouseout="kill()" style="height:35px;width:35px"></td>
                <td style="max-width:200px">${nameCurrent}</td>
                <td>${eleCurrent.toLocaleString()}</td>
                <td>${mrCurrent.toLocaleString()}</td>
                <td class="blank-cell"></td>
                <td><img src="${imgNew}" onmouseover="itempopup(event,'${itemidNew}')" onmouseout="kill()" style="height:35px;width:35px"></td>
                <td style="max-width:200px">${nameNew}</td>
                <td>${eleNew.toLocaleString()}</td>
                <td>${mrNew.toLocaleString()}</td>
                <td class="blank-cell"></td>
                <td>${(eleNew-eleCurrent).toLocaleString()}</td>
                <td>${(mrNew-mrCurrent).toLocaleString()}</td>
                </tr>`);
            };
            await Promise.all(array.map(table));
            document.querySelector("#item-slotting-div").innerHTML = `
            <div id="banner"></div>
            <table class="mv-table sortable" id="mvTable">
            <thead><tr>
            <th>character</th>
            <th>&#x2713</th>
            <th>EQ</th>
            <th class="mv-rga-cell">rga</th>
            <th>lvl</th>
            <th>tot ele</th>
            <th>tot mr</th>
            <th class="blank-cell"></th>
            <th>img</th>
            <th>current item</th>
            <th>ele</th>
            <th>mr</th>
            <th class="blank-cell"></th>
            <th>img</th>
            <th>new item</th>
            <th>ele</th>
            <th>mr</th>
            <th class="blank-cell"></th>
            <th>ele change</th>
            <th>mr change</th>
            </tr></thead>
            <tbody>${rows.join('')}</tbody>
            `
            await sortableTables();
            await mvEqButtons();
            if (!string.match('Full')){ await mvNotSpecial("ITEM SLOTTING") };
            document.querySelector("#loadingDiv").remove();
        } else {
            alert('Invalid item link entered');
        };
    });
};


async function mvAugmentData(rgas,string){
    if (!string.match('Full')){ rgas = rgas.slice(0, 2) };
    const endpoints = ['profile'];
    const array = await mvFetch(rgas,endpoints);
    const rows = [];
    const table = async (i) => {
        const augObj = {};
        let augTotal = 0;
        let augTotalEle = 0;
        let augTotalPower = 0;
        let augTotalMr = 0;
        let augTotalChaos = 0;
        let augTotalVile = 0;
        const core = await superfetchItem(i.profile.core.id);
        const head = await superfetchItem(i.profile.head.id);
        const neck = await superfetchItem(i.profile.neck.id);
        const weapon = await superfetchItem(i.profile.weapon.id);
        const body = await superfetchItem(i.profile.body.id);
        const shield = await superfetchItem(i.profile.shield.id);
        const belt = await superfetchItem(i.profile.belt.id);
        const pants = await superfetchItem(i.profile.pants.id);
        const ring = await superfetchItem(i.profile.ring.id);
        const foot = await superfetchItem(i.profile.foot.id);
        const augIdsArrayOfArrays = [core.augids,head.augids,neck.augids,weapon.augids,body.augids,shield.augids,belt.augids,pants.augids,ring.augids,foot.augids];
        const allAugIds = augIdsArrayOfArrays.flat();
        const processAugs = async (id) => {
            const aug = await superfetchItem(id);
            augTotal += 1;
            augTotalEle += aug.ele;
            augTotalPower += aug.atk;
            augTotalPower += aug.hp;
            augTotalMr += aug.maxrage;
            augTotalChaos += aug.chaosdmg;
            augTotalVile += aug.vile;
            if (augObj[aug.name]){
                augObj[aug.name].count += 1;
            } else {
                augObj[aug.name] = { id: id, name: aug.name, img: aug.img, count: 1 };
            };
        };
        await Promise.all(allAugIds.map(processAugs));

        const sortedArrayOfAugs = Object.entries(augObj).sort(([, a], [, b]) => b.count - a.count);
        const sortedObjectOfAugs = Object.fromEntries(sortedArrayOfAugs);

        const augImgArray = [];
        Object.keys(sortedObjectOfAugs).forEach(type => {
            const obj = augObj[type];
            const img = obj.img;
            const count = obj.count;
            const id = obj.id;
            augImgArray.push(`<div class="aug-data-div"><img src="${img}" onmouseover="itempopup(event,'${id}')" onmouseout="kill()"><br>${count}</div>`)
        });

        rows.push(`
            <tr>
            ${i.static}
            <td>${augTotal}</td>
            <td>${augTotalEle.toLocaleString()}</td>
            <td>${augTotalPower.toLocaleString()}</td>
            <td>${augTotalMr.toLocaleString()}</td>
            <td>${augTotalChaos.toLocaleString()}</td>
            <td class="mv-augs" style="max-width:500px">${augImgArray.join('')}</td>
            </tr>
        `);
    };
    await Promise.all(array.map(table));

    document.querySelector("#mvContent").innerHTML = `
    <div class="mv-table-container">
    <table class="mv-table sortable" id="mvTable">
    <thead><tr><th>char</th><th>&#x2713</th><th>eq</th><th class="mv-rga-cell">rga</th><th>lvl</th><th>augs</th><th>ele</th><th>power</th><th>max rage</th><th>chaos</th><th>quantities</th></tr></thead>
    <tbody>${rows.join('')}</tbody>
    </table></div>
    `


    await sortableTables();
    await mvEqButtons();
    document.querySelector("#loadingDiv").remove();
};

async function mvMaxRage(rgas,string){
    const endpoints = ['home','profile'];
    if (!string.match('Full')){ rgas = rgas.slice(0, 2) };
    const array = await mvFetch(rgas,endpoints);
    const rows = [];
    const table = async (i) => {
        const mr = i.home.maxrage;
        const charclass = i.profile.class;

        const upgraded = i.home.mrupgrades.purchased;
        const max = i.home.mrupgrades.max;
        const available = max - upgraded;

        let mrFromItems = 0;
        let mrFromGems = 0;
        let missingGems = 40;
        let costToGem = 0;

        const core = await superfetchItem(i.profile.core.id);
        const head = await superfetchItem(i.profile.head.id);
        const neck = await superfetchItem(i.profile.neck.id);
        const weapon = await superfetchItem(i.profile.weapon.id);
        const body = await superfetchItem(i.profile.body.id);
        const shield = await superfetchItem(i.profile.shield.id);
        const belt = await superfetchItem(i.profile.belt.id);
        const pants = await superfetchItem(i.profile.pants.id);
        const ring = await superfetchItem(i.profile.ring.id);
        const foot = await superfetchItem(i.profile.foot.id);

        const eq = [core,head,neck,weapon,body,shield,belt,pants,ring,foot];

        for (let n = 0; n < 10; n++) {
            const item = eq[n];
            const rarity = item.rarity;
            const maxrage = item.maxrage;
            mrFromItems += maxrage;
            const gems = item.gems;
            let x = gems == 3 ? 0.15 : gems == 2 ? 0.3225 : gems == 1 ? 0.520875 : gems == 0 ? 0.74900625 : 0;
            if (charclass == "Monster") {
                x *= 1.1
            } else if (charclass == "Pop Star"){
                x *= 1.05
            };
            mrFromGems += (maxrage * x);
            missingGems -= gems;
            if (rarity != ''){
                const upgrades = await info("Cost to Full Gem");
                costToGem += upgrades[rarity][gems]
            };
        }


        const maxMr = Math.ceil(mrFromGems) + mr + available;

        const perPoint = missingGems == 0 ? 0 : Math.ceil(mrFromGems/costToGem)

        rows.push(`<tr>
        ${i.static}
        <td>${charclass}</td>
        <td>${mr.toLocaleString()}</td>
        <td>${upgraded.toLocaleString()}</td>
        <td>${available.toLocaleString()}</td>
        <td>${missingGems}</td>
        <td>${(Math.ceil(mrFromGems) + available).toLocaleString()}</td>
        <td>${costToGem.toLocaleString()}</td>
        <td>${maxMr.toLocaleString()}</td>
        <td>${perPoint}</td>
        </tr>`);
    };
    await Promise.all(array.map(table));
    document.querySelector("#mvContent").innerHTML = `
    <div id="banner"></div>
    <div class="mv-table-container"><table class="mv-table sortable" id="mvTable">
    <thead><tr>
    <th>char</th>
    <th class="mv-rga-cell">rga</th>
    <th>&#x2713</th>
    </th>eq</th>
    <th>lvl</th>
    <th>class</th>
    <th>max rage</th>
    <th>char upgrades</th>
    <th>upgrades available</t>
    <th>missing gems</th>
    <th>max gains</th>
    <th>full gem cost</th>
    <th>mr if maxed</th>
    <th>mr per point</th>
    </tr></thead>
    <tbody>${rows.join('')}</tbody>
    </table></div>
    `
    await sortableTables();
    await mvEqButtons();
    if (!string.match('Full')){ await mvNotSpecial("MAX RAGE") };
    document.querySelector("#loadingDiv").remove();
};

async function mvEvents(rgas,event,string){
    const peram = event == "WAR OF ZHUL" ? "woz" : "top"
    const qItemLong = event == "WAR OF ZHUL" ? "Summoning Shard" : "Trial Insignia"
    const qItemShort = event == "WAR OF ZHUL" ? "shards" : "insignias"
    const qItemImg = event == "WAR OF ZHUL" ? "images/warshard.jpg" : "images/items/trialinsignia.jpg"

    let runsLeft;
    const eventPage = await superfetch(`event?eventid=${peram}`);
    if (eventPage.match('START COUNTDOWN')){
        runsLeft = 31;
    } else if (eventPage.match(/countdown = ([0-9]+)/i)){
        const timer = parseInt(eventPage.match(/countdown = ([0-9]+)/i)[1])*1000;
        const now = ((new Date().getTime()) - 18000000);
        runsLeft = (timer-now)/3600000/10.8;
    } else {
        runsLeft = 31;
    };

    if (!string.match('Full')){ rgas = rgas.slice(0, 2) };
    const endpoints = ['equipment','home','ajax/backpackcontents.php?tab=quest','ajax/backpackcontents.php?tab=potion'];
    const array = await mvFetch(rgas,endpoints);
    const rows = [];
    const regex = new RegExp(`data-itemidqty="[0-9]+" data-name="${qItemLong}"`);
    const table = async (i) => {
        const parseData = new DOMParser();
        const pbp = parseData.parseFromString(i.potion, 'text/html');
        const fury = (await backpack(i.potion,"Recharge the Fury")).quantity;
        const spark = (await backpack(i.potion,"Spark the Fury")).quantity;
        const elepot = (await backpack(i.potion,"Potion of Elemental Resistance")).quantity;
        const kixpot = (await backpack(i.potion,"Kix Potion")).quantity;
        const amdirpot = (await backpack(i.potion,"Potion of Amdir")).quantity;
        const squidpot = (await backpack(i.potion,"Squidberry Juice")).quantity;
        const wonderlandpot = (await backpack(i.potion,"Wonderland Potion")).quantity;
        const qitem = (await backpack(i.quest,qItemLong)).quantity;
        const refills = fury + (spark/2);
        const mr = i.home.maxrage;
        const rpt = i.home.rageperturn;
        const booster = i.equipment.match(/getElementById\('slot18'\)/i) ? i.equipment.match(/src="([^"]*)" ONMOUSEOVER="itempopup\(event,'([0-9]+)'\)" ONMOUSEOUT="kill\(\)" onclick="removeItem\('[0-9]+',[0-9]+,[0-9]+\);document\.getElementById\('slot18'\)/i) : "";
        const boosterImg = i.equipment.match(/getElementById\('slot18'\)/i) ? `<img src="${booster[1]}" onmouseover="itempopup(event,'${booster[2]}')" onmouseout="kill()">` : "";
        rows.push(`<tr>
        ${i.static}
        <td>${boosterImg}</td>
        <td class="fury-count">${fury}</td>
        <td class="spark-count">${spark}</td>
        <td>${elepot}</td>
        <td>${kixpot}</td>
        <td>${amdirpot}</td>
        <td>${squidpot}</td>
        <td>${wonderlandpot}</td>
        <td>${qitem}</td>
        <td class="max-rage">${mr.toLocaleString()}</td>
        <td>${rpt.toLocaleString()}</td>
        <td class="projected-qitem">${Math.ceil(runsLeft*(mr+rpt)/20000+qitem)}</td>
        <td width="130px"><input type="text" class="mv-filter fury-math-input" value="${refills}" style="margin-bottom:0px;"></td>
        <td class="fury-math-output">${Math.ceil(refills*mr/20000) + Math.ceil(runsLeft*(mr+rpt)/20000+qitem)}</td>
        </tr>`);
    };
    await Promise.all(array.map(table));
    document.querySelector("#mvContent").innerHTML = `
    <div id="banner"></div>
    <div class="mv-table-container"><table class="mv-table sortable" id="mvTable">
    <thead>
    <th>char</th>
    <th>&#x2713</th>
    <th>eq</th>
    <th class="mv-rga-cell">rga</th>
    <th>lvl</th>
    <th>bst</th>
    <th><img src="images/rfury.jpg" onmouseover="popup(event,'Recharge the Fury')" onmouseout="kill()"></th>
    <th><img src="images/items/sfury.jpg" onmouseover="popup(event,'Spark the Fury')" onmouseout="kill()"></th>
    <th><img src="images/items/eleresistpotion.png" onmouseover="popup(event,'Potion of Elemental Resistance')" onmouseout="kill()"></th>
    <th><img src="images/potion28.jpg" onmouseover="popup(event,'Kix Potion')" onmouseout="kill()"></th>
    <th><img src="images/items/arelepot.jpg" onmouseover="popup(event,'Potion of Amdir')" onmouseout="kill()"></th>
    <th><img src="images/items/Item_SquidberryJuice.jpg" onmouseover="popup(event,'Squidberry Juice')" onmouseout="kill()"></th>
    <th><img src="images/items/itemz95.png" onmouseover="popup(event,'Wonderland Potion')" onmouseout="kill()"></th>
    <th><img src="${qItemImg}" onmouseover="popup(event,'${qItemLong}')" onmouseout="kill()"></th>
    <th>max rage</th>
    <th>rpt</th>
    <th>proj tot ${qItemShort}</th>
    <th>furys to use</th>
    <th>new proj ${qItemShort}</th>
    </thead>
    <tbody>${rows.join('')}</tbody>
    </table></div>
    `


    document.querySelector("#banner").innerHTML = `
    <div style="background:#2d2d2d;width:100%;height:60px;text-align:center;justify-content:center;align-items:center;display:flex;margin-bottom:1rem;">
    <h1 style="margin-bottom:0rem !important;">RUNS LEFT: ${runsLeft}</h1>
    </div>
    `


    const furyInput = Array.from(document.querySelectorAll(".fury-math-input"));
    for (let i = 0; i < furyInput.length; i++) {
        furyInput[i].addEventListener('input',async function(){
            const cellInput = parseFloat(this.value);
            const cellOutput = this.parentNode.parentNode.querySelector('.fury-math-output');
            const cellMaxRage = parseInt(this.parentNode.parentNode.querySelector('.max-rage').innerHTML.replace(/,/g,''));
            const cellQItem = parseInt(this.parentNode.parentNode.querySelector('.projected-qitem').innerHTML.replace(/,/g,''));
            cellOutput.innerHTML = Math.ceil(((cellInput*cellMaxRage)/20000) + cellQItem);
        });
    };

    await sortableTables();
    await mvEqButtons();
    if (!string.match('Full')){ await mvNotSpecial(event) };
    document.querySelector("#loadingDiv").remove();
};

async function mvHalloween(rgas,string){
    if (!string.match('Full')){ rgas = rgas.slice(0, 2) };
    const endpoints = ['home','ajax/backpackcontents.php?tab=quest','quest_info.php?questnum=2498'];
    const array = await mvFetch(rgas,endpoints);
    const rows = [];
    const table = async (i) => {
        const mr = i.home.maxrage;
        const rpt = i.home.rageperturn;
        const components = (await backpack(i.quset, "Server Components")).quantity
        let queststep;
        if (i.questnum.match(/Server Components:<\/b> [0-9]+\/[0-9]+/i)){
            const componentsNeeded = i.questnum.match(/Server Components:<\/b> [0-9]+\/([0-9]+)/i)[1];
            queststep = `Find ${componentsNeeded} components`
        } else if (i.questnum.match(/<b>.*?: <\/b>[0-9]+\/[0-9]+ killed/i)){
            const mobNeeded = i.questnum.match(/<b>(.*?): <\/b>[0-9]+\/[0-9]+ killed/i)[1];
            queststep = `Kill ${mobNeeded}`
        } else if (i.questnum.match('error')){
            queststep = 'Finished'
        } else {
            queststep = 'Unknown'
        }
        //const canes = parseInt((i.quest.match(/data-itemidqty="([0-9]+)" data-name="Candy Cane"/i) || [0,0])[1]);
        //<th><img src="images/items/XmasCandyCane2013.jpg" onmouseover="popup(event,'Candy Cane')" onmouseout="kill()"></th>
        rows.push(`
        <tr>
        ${i.static}
        <td>${mr.toLocaleString()}</td>
        <td>${rpt.toLocaleString()}</td>
        <td>${components}</td>
        <td>${queststep}</td>
        </tr>`);
    };
    await Promise.all(array.map(table));
    document.querySelector("#mvContent").innerHTML = `
    <div id="banner"></div>
    <div class="mv-table-container"><table class="mv-table sortable" id="mvTable">
    <thead><tr>
    <th>char</th>
    <th>&#x2713</th>
    <th>eq</th>
    <th class="mv-rga-cell">rga</th>
    <th>lvl</th>
    <th>max rage</th>
    <th>rpt</th>
    <th>server components</th>
    <th>quest step</th>
    </tr></thead>
    <tbody>${rows.join('')}</tbody>
    </table>
    </div>
    `
    await sortableTables();
    await mvEqButtons();
    if (!string.match('Full')){ await mvNotSpecial("HOLIDAYS") };
    document.querySelector("#loadingDiv").remove();
}

async function mvChristmas(rgas,string){
    if (!string.match('Full')){ rgas = rgas.slice(0, 2) };
    const endpoints = ['home','ajax/backpackcontents.php?tab=quest','quest_info.php?questnum=1193'];
    const array = await mvFetch(rgas,endpoints);
    const rows = [];
    const table = async (i) => {
        const mr = i.home.maxrage;
        const rpt = i.home.rageperturn;
        const components = (await backpack(i.quest, "Candy Cane")).quantity
        let queststep;
        if (i.questnum.match(/Candy Cane:<\/b> [0-9]+\/[0-9]+/i)){
            const canesNeeded = i.questnum.match(/Candy Cane:<\/b> [0-9]+\/([0-9]+)/i)[1];
            queststep = `Find ${canesNeeded} canes`
        } else if (i.questnum.match('error')){
            queststep = 'Finished'
        } else {
            queststep = 'Unknown'
        }
        //const canes = parseInt((i.quest.match(/data-itemidqty="([0-9]+)" data-name="Candy Cane"/i) || [0,0])[1]);
        //<th><img src="images/items/XmasCandyCane2013.jpg" onmouseover="popup(event,'Candy Cane')" onmouseout="kill()"></th>
        rows.push(`
        <tr>
        ${i.static}
        <td>${mr.toLocaleString()}</td>
        <td>${rpt.toLocaleString()}</td>
        <td>${components}</td>
        <td>${queststep}</td>
        </tr>`);
    };
    await Promise.all(array.map(table));
    document.querySelector("#mvContent").innerHTML = `
    <div id="banner"></div>
    <div class="mv-table-container"><table class="mv-table sortable" id="mvTable">
    <thead><tr>
    <th>char</th>
    <th>&#x2713</th>
    <th>eq</th>
    <th class="mv-rga-cell">rga</th>
    <th>lvl</th>
    <th>max rage</th>
    <th>rpt</th>
    <th>candy canes</th>
    <th>quest step</th>
    </tr></thead>
    <tbody>${rows.join('')}</tbody>
    </table>
    </div>
    `
    await sortableTables();
    await mvEqButtons();
    if (!string.match('Full')){ await mvNotSpecial("HOLIDAYS") };
    document.querySelector("#loadingDiv").remove();
}



async function mvFetch(rgas,endpoints){

    const loadingDiv = document.createElement("div");
    loadingDiv.innerHTML = `loading<br><span class="blink">&#x29D6;</span>`
    loadingDiv.id = "loadingDiv"
    document.body.appendChild(loadingDiv);

    const array = [];

    const fetch = async (endpoint) => {
        for (let i = 0; i < rgas.length; i++) {

            const key = endpoint.match(/[a-zA-Z]{2,}(?![a-zA-Z])/g)?.pop();

            const login = rgas[i][0]

            const url = endpoint.match(/\?/i) ? endpoint.replace(/\?/i,`?${login}&`) : `${endpoint}?${login}`

            let data;
            if (url.match("profile")){
                data = await superfetchProfile(url)
            } else if (url.match("home")){
                data = await superfetchHome(url);
            } else {
                data = await superfetch(url);
            };

            if (!array[i]) { array[i] = {} };

            if (!array[i].static) {
                array[i].static = `
                    <td><a href="profile?${rgas[i][0]}" target="_blank">${rgas[i][3]}</a></td>
                    <td><input type="checkbox" name="${rgas[i][3]}" class="mv-checkbox"></td>
                    <td><img src="https://studiomoxxi.com/moxximod/toolbareq.png" class="btn-eq-pop"></td>
                    <td class="mv-rga-cell">${rgas[i][1]}</td>
                    <td>${rgas[i][4]}</td>
                    `
                };

            array[i][key] = data;
        };
    };
    await Promise.all(endpoints.map(fetch));

    if (!document.querySelector("#mvCopyChars")){
        await mvCopy();
    };

    return array;
};

async function mvEqButtons(){

    GM_addStyle(`#mvEqPop{z-index:999 !important;}`)
    const eqBtns = document.querySelectorAll('img.btn-eq-pop');
    for (const btn of eqBtns) {
        btn.addEventListener('click', async (e) => {
            createWindow("Equipment", "mvEqPop", 300, 100, 0.2);
            const tr = e.currentTarget.closest('tr');
            const link = tr.querySelector('td a');
            const href = link.getAttribute('href');
            const params = new URLSearchParams(href.split('?')[1]);
            const charId = params.get('suid');
            const profileData = await superfetchProfile(`profile?id=${charId}`);
            document.querySelector("#mvEqPop_content").innerHTML = profileData.thedude;
        });
    };
};

async function mvCopy(){
    var copyDiv = document.createElement('div');
    copyDiv.innerHTML = '<i class="fa fa-clipboard"></i>'
    copyDiv.style.position = 'fixed';
    copyDiv.style.bottom = '15px';
    copyDiv.style.left = '15px';
    copyDiv.id = "mvCopyChars"
    copyDiv.style.zIndex = '9999';
    copyDiv.style.cursor = 'pointer';
    document.body.appendChild(copyDiv);

    document.querySelector("#mvCopyChars").setAttribute('onmouseover',`statspopup(event,'Copy list of selected chars to clipboard')`);
    document.querySelector("#mvCopyChars").setAttribute('onmouseout','kill()');

    document.querySelector("#mvCopyChars").addEventListener('click', async function(){
        const checkboxes = document.querySelectorAll(".mv-checkbox");
        const selectedCharsArray = [];
        const loopThroughCheckboxes = async (i) => {
            if(i.checked){
                selectedCharsArray.push(i.outerHTML.match(/name="([^"]*)"/i)[1]);
            };
        };
        await Promise.all(Array.from(checkboxes).map(loopThroughCheckboxes));

        if (selectedCharsArray.length > 0){
            navigator.clipboard.writeText(selectedCharsArray.join(','))
            .then(function() {
                alert(`Copied ${selectedCharsArray.length} names to clipboard: ${selectedCharsArray.join(',')}`)
            }).catch(function(err) {
                alert('Unable to copy: ', err);
            });
        } else {
            alert('No characters selected');
        };
    });
};

async function mvItemSpec(itemid){
    const item = (await superfetch(`item_rollover.php?id=${itemid}`)).replace(/<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>/g,'').replace(/<span style="color:#[A-Za-z0-9]+">/g,'').replace(/,|%/g,'');
    const slot = (item.match(/\[Slot - (.*?)\]<br\/>/i) || ['','slot unknown'])[1].toLowerCase();
    const img = itemid > 0 ? `<td><img src="${(item.match(/<img src="([^"]*)" style="border:1px solid #666666;margin:2px;">/i) || ['',''])[1]}" onmouseover="itempopup(event,'${itemid}')" onmouseout="kill()"></img></td>` : '<td></td>';
    const rarity = (item.match(/text-shadow: #47462E 1px 1px 2px;color:#([A-Za-z0-9]+)/i) || ['',''])[1];
    const name = `<td style="max-width:200px"><font color="#${rarity}">` + (item.match(/align="left">(.*?)<\/td>/i) || ['',''])[1].replace('td colspan="2"','a')+'</font></td>';
    const cloned = item.match(/\[Cloned: .*?\]/i) ? true : false;
    const augs = '<td style="max-width:75px">' + (item.match(/src="[^"]*" ONMOUSEOVER="itempopup\(event'[0-9]+_[0-9]+'\)"/g) || []).map(i => `<img ${i.replace('(event','(event,')} onmouseout="kill()" class="mv-augs">`).join('') + '</td>';
    const openaugs = item.match(/\/images\/augslot\.jpg/) ? item.match(/\/images\/augslot\.jpg/g).length : 0;
    const gems = '<td>' +(4-((item.match(/src="\/images\/gemslot2\.jpg"/g) || []).length)) + '</td>';
    const atk = '<td>' + parseInt((item.match(/\+([0-9]+) ATK<br>/i) || [0,0])[1]).toLocaleString() + '</td>';
    const hp = '<td>' + parseInt((item.match(/\+([0-9]+) HP<br>/i) || [0,0])[1]).toLocaleString() + '</td>';
    const ele1 = parseInt((item.match(/\+([0-9]+) Holy<\/span>/i) || [0,0])[1]);
    const ele2 = parseInt((item.match(/\+([0-9]+) Arcane<\/span>/i) || [0,0])[1]);
    const ele3 = parseInt((item.match(/\+([0-9]+) Shadow<\/span>/i) || [0,0])[1]);
    const ele4 = parseInt((item.match(/\+([0-9]+) Fire<\/span>/i) || [0,0])[1]);
    const ele5 = parseInt((item.match(/\+([0-9]+) Kinetic<\/span>/i) || [0,0])[1]);
    const elemental = '<td>' + (ele1 + ele2 + ele3 + ele4 + ele5).toLocaleString() + '</td>';;
    const ele6 = '<td>' + parseInt((item.match(/\+([0-9]+) Chaos<\/span>/i) || [0,0])[1]).toLocaleString() + '</td>';
    const res1 = parseInt((item.match(/\+([0-9]+) Holy Resist/i) || [0,0])[1]);
    const res2 = parseInt((item.match(/\+([0-9]+) Arcane Resist/i) || [0,0])[1]);
    const res3 = parseInt((item.match(/\+([0-9]+) Shadow Resist/i) || [0,0])[1]);
    const res4 = parseInt((item.match(/\+([0-9]+) Fire Resist/i) || [0,0])[1]);
    const res5 = parseInt((item.match(/\+([0-9]+) Kinetic Resist/i) || [0,0])[1]);
    const resist = '<td>' + (res1 + res2 + res3 + res4 + res5).toLocaleString() + '</td>';;
    const res6 = '<td>' + (item.match(/\+([0-9]+) Chaos Resist/i) || [0,0])[1] + '</td>';
    const vile = '<td>' + parseInt((item.match(/\+([0-9]+) vile energy/i) || [0,0])[1]).toLocaleString() + '</td>';
    const rpt = '<td>' + parseInt((item.match(/\+([0-9]+) rage per hr/i) || [0,0])[1]).toLocaleString() + '</td>';
    const ept = '<td>' + parseInt((item.match(/\+([0-9]+) exp per hr/i) || [0,0])[1]).toLocaleString() + '</td>';
    const rampage = '<td>' + (item.match(/\+([0-9]+) rampage/i) || [0,0])[1] + '</td>';
    const critical = '<td>' + (item.match(/\+([0-9]+) critical hit/i) || [0,0])[1] + '</td>';
    const mr = '<td>' + parseInt((item.match(/\+([0-9]+) max rage/i) || [0,0])[1]).toLocaleString() + '</td>';
    const block = '<td>' + (item.match(/\+([0-9]+) block/i) || [0,0])[1] + '</td>';
    const eleblock = '<td>' + (item.match(/\+([0-9]+) elemental block/i) || [0,0])[1] + '</td>';
    const ps = '<td>' + (item.match(/\+(\d+(\.\d+)?) perfect strike/i) || [0,0])[1] + '</td>';;
    return {slot:slot,img:img,name:name,rarity:rarity,cloned:cloned,augs:augs,openaugs:openaugs,gems:gems,atk:atk,hp:hp,elemental:elemental,ele6:ele6,resist:resist,res6:res6,vile:vile,rpt:rpt,ept:ept,rampage:rampage,critical:critical,mr:mr,block:block,eleblock:eleblock,ps:ps};
};

async function mvNotSpecial(tab){
    document.querySelector("#banner").innerHTML = `
    <div style="background:#870000;width:100%;height:80px;text-align:center;justify-content:center;align-items:center;display:flex;margin-bottom:1rem;">
    <a href="https://www.patreon.com/moxximod" target="_blank" class="mv-btn" style="width:400px;padding:4px 8px;">PLEASE SUBSCRIBE TO MOXXIMOD+ TO UNLOCK THE ${tab} TAB</a>
    </div>
    `
};


async function openPotionBp(){
    window.XMLHttpRequest.prototype.realOpen = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function(method, url) {
        if (url.includes('ajax/backpackcontents.php?tab=potion')) {
            this.onreadystatechange = function() {
                if (this.readyState === 4) {
                    var pbp = this.responseText;
                    const inbp = pbp.replace(/'/g,'').match(/data-name="[^"]*"/g).map(pot => pot.match(/"([^"]*)"/i)[1]);
                    info("All Potions").then(array => {
                        const allpots = array.map(([item]) => item);
                        const missing = allpots.filter(item => !inbp.includes(item) && item != "Boost One" && item != "Boost Two" && item != "Boost Three" && item != "Boost Four" && item != "Boost Five");
                        if (GM_getValue('auth').match('Full')){
                            document.querySelector("#backpackitemct").innerHTML = `missing<img src="https://studiomoxxi.com/moxximod/toolbarbot.png" height="20px" width="20px" onmouseover="statspopup(event,'<font color=#FFFFFF><b>POTIONS NOT IN BACKPACK</b><br>${missing.join('<br>')}')" onmouseout="kill()">`
                        } else {
                            document.querySelector("#backpackitemct").innerHTML = `missing<img src="https://studiomoxxi.com/moxximod/toolbarbot.png" height="20px" width="20px" onmouseover="statspopup(event,'<font color=#FFFFFF>Please subscribe to MoxxiMod+ to see missing potions')" onmouseout="kill()">`
                        };
                    });
                };
            };
        };
        this.realOpen.apply(this, arguments);
    };
};


function openBp() {
    const open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (url.includes('ajax/backpackcontents.php')) {
            const displayBpDiv = document.querySelector("#simpletabContent");
            if (displayBpDiv) {
                displayBpDiv.style.display = 'none';
            };
            this.addEventListener('load', async function () {
                await backpackButtons();
                displayBpDiv.style.display = 'revert';
            });
        }
        return open.apply(this, arguments);
    };
};

async function backpackButtons(){
    GM_addStyle(`
        .mm-bp-btn { padding: 5px 10px 2px 10px !important; margin-left: 3px !important; margin-right:3px !important; }
        #massbuttons { display:flex; flex-wrap: wrap; }
        #moxximass { padding:3px; width:100%; justify-content:space-between;text-align:right; }
        img.small-loading{ height:25px; width:25px; margin-right:5px; }
        .backpackSlotFade{ opacity:0.25;filter:saturate(0); }
    `)

    const buttonDiv = document.querySelector("#massbuttons");

    const lastChild = buttonDiv.querySelector('a');
    if (lastChild) {
        lastChild.remove();
    };


    if (!document.querySelector("#moxximass")){
        const newDiv = document.createElement('div');
        newDiv.id = 'moxximass';
        newDiv.setAttribute('style','display:none;');
        buttonDiv.parentNode.insertBefore(newDiv, buttonDiv.nextSibling);
    };


    document.querySelectorAll('#massbuttons svg').forEach(svg => svg.remove());

    document.querySelectorAll('#massbuttons button').forEach(btn => btn.classList.add('mm-bp-btn'));

    document.querySelectorAll('#massbuttons button').forEach(btn => { btn.textContent = btn.textContent.toUpperCase() });

    let backpackAction = 'none';


    if (!document.querySelector("#transferItems")){
        const newBtn = document.createElement('button');
        newBtn.className = 'btn btn-dark mr-2 btn-sm mt-1 mb-1 mm-bp-btn';
        newBtn.innerHTML = `TRANSFER`;
        newBtn.id = 'transferItems'
        buttonDiv.appendChild(newBtn);
        newBtn.addEventListener('click', async () => { await transferItems() });
    };
    if (!document.querySelector("#equipItems")){
        const newBtn = document.createElement('button');
        newBtn.className = 'btn btn-dark mr-2 btn-sm mt-1 mb-1 mm-bp-btn';
        newBtn.innerHTML = `EQUIP`;
        newBtn.id = 'equipItems'
        buttonDiv.appendChild(newBtn);
        newBtn.addEventListener('click', async () => { await equipItems() });
    };


    async function equipItems(){
        backpackAction = 'equipItems'

        $('#moxximass').show();
        $('#massbuttons').hide();
        $('#dropmenudiv').hide();
        $('.backpackslot').removeClass('backpackSlotHighlight');
        document.querySelector("#moxximass").innerHTML = `
            <div id="equipItemsMsg"><span id="loading"></span>Equipping <span id="eqQnt">0</span> items</div>
            <div>
                <button class="btn btn-primary ml-2 btn-sm mt-1 mb-1" id="equip">EQUIP</button>
                <button class="btn btn-primary ml-2 btn-sm mt-1 mb-1" id="best">BEST</button>
                <button class="btn btn-dark ml-2 btn-sm mt-1 mb-1" id="close">X</button>
            </div>
        `
        const tab = document.querySelector('a.backpacktab.active').innerHTML;
        await equipItemsFunction(tab);

        document.querySelector("#close").addEventListener('click', async () =>{
            await closeMoxxiBpMenu();
        });
    };


    async function equipItemsFunction(tab){

        document.querySelector("#equip").addEventListener('click', async () => {
            const selectedItems = document.querySelectorAll('img.backpackSlotHighlight');
            if (selectedItems.length < 1){
                alert('Please select at least 1 item to equip');
                return;
            };
            await bpLoadOn();
            for (item of selectedItems){
                const iid = item.dataset.iid;
                const url = 'ajax/backpack_action'
                const body = `action=equip&itemids%5B%5D=${iid}`
                await superpost(url,body)
            };
            await refreshBp(tab);
            await bpLoadOff();
        });

        document.querySelector("#best").addEventListener('click', async () => {
            await bpLoadOn();
            const best = {
                core:{ele:0,iid:''},
                head:{ele:0,iid:''},
                neck:{ele:0,iid:''},
                weapon:{ele:0,iid:''},
                body:{ele:0,iid:''},
                shield:{ele:0,iid:''},
                belt:{ele:0,iid:''},
                pants:{ele:0,iid:''},
                ring:{ele:0,iid:''},
                foot:{ele:0,iid:''}
            };
            $('.backpackslot').removeClass('backpackSlotHighlight');
            const allItems = bpContents.querySelectorAll("img");
            for (let item of allItems){
                const iid = item.dataset.iid;
                const itemData = await superfetchItem(iid);
                const slot = itemData.slot;
                const ele = itemData.ele;
                if (!best[slot]) {
                    continue;
                };
                if (best[slot].ele < ele){
                    best[slot].ele = ele;
                    best[slot].iid = iid;
                };
            };
            for (const slot in best) {
                const { ele, iid } = best[slot];
                if (ele > 0){
                    document.querySelector(`[data-iid="${iid}"]`).classList.add('backpackSlotHighlight')
                };
            };
            const countSelected = document.querySelectorAll('img.backpackSlotHighlight').length;
            document.querySelector("#eqQnt").innerHTML = countSelected;
            await bpLoadOff();
        });

        await bpLoadOn();
        const bpContents = document.querySelector("#backpack-contents-container");
        const allItems = bpContents.querySelectorAll("img");
        const itemLoop = async (item) => {
            const iid = item.dataset.iid;
            const itemData = await superfetchItem(iid);

            const slot = itemData.slot;
            if (slot == "other" || slot == "skill orb"){
                item.classList.add('backpackSlotFade');
                return;
            };

            if (!item.dataset.equipListener) {
                item.dataset.equipListener = 'true';

                item.addEventListener('click', async () => {
                    if (backpackAction == 'equipItems'){
                        item.classList.toggle('backpackSlotHighlight');
                        const countSelected = document.querySelectorAll('img.backpackSlotHighlight').length;
                        document.querySelector("#eqQnt").innerHTML = countSelected;
                    };
                });
            };
        };
        await Promise.all(Array.from(allItems).map(itemLoop));
        await bpLoadOff();
    };


    async function transferItems(){
        backpackAction = 'transferItems'
        const checkSecurity = await superfetch('pointtransfer', true);
        const locked = checkSecurity.match(/<strong>Security Prompt<\/strong>/i)
        if (locked){
            const securityQuestion = checkSecurity.match(/<label for="">.*?<\/label>/i);
            const promptValue = checkSecurity.match(/name="prompt_number" value="([0-9]+)"/i)?.[1];

            $('#moxximass').show();
            $('#massbuttons').hide();
            $('#dropmenudiv').hide();
            $('.backpackslot').removeClass('backpackSlotHighlight');
            document.querySelector("#moxximass").innerHTML = `
                <div style="margin-left:5px;margin-right:5px;">${securityQuestion}<br><input type="password" class="form-control form-control-sm " id="secWordInput"></div>
                <div>
                    <span id="securityMsg" style="color:#FF0000;margin-right:1rem;"></span>
                    <button class="btn btn-primary ml-2 btn-sm mt-1 mb-1" id="submitSecWord">SUBMIT</button>
                    <button class="btn btn-dark m-2 btn-sm mt-1 mb-1" id="close">X</button>
                </div>
            `
            document.querySelector("#submitSecWord").addEventListener('click', async () => {
                const input = document.querySelector("#secWordInput").value;
                const submitSecWord = await superpost('security_prompt.php',`prompt_number=${promptValue}&answer=${input}&security_submitted=Continue`);
                if (submitSecWord.match(/<strong>Security Prompt<\/strong>/i)){
                    document.querySelector("#securityMsg").innerHTML = "invalid entry"
                } else {
                    await transferItemsFunction();
                };
            });

            document.querySelector("#close").addEventListener('click', async () =>{
                await closeMoxxiBpMenu();
            });
        } else {
            const tab = document.querySelector('a.backpacktab.active').innerHTML;
            await transferItemsFunction(tab);
        };
    };

    async function transferItemsFunction(tab){
        $('#moxximass').show();
        $('#massbuttons').hide();
        $('#dropmenudiv').hide();
        $('.backpackslot').removeClass('backpackSlotHighlight');
        const dropDown = document.querySelector("#charselectdropdown").innerHTML.replace(/<option value="0">[\s\S]*$/, '')
        document.querySelector("#moxximass").innerHTML = `
            <div style="margin-left:5px;margin-right:5px;"><select class="form-control form-control-sm" style="width:100%">${dropDown}</select></div>
            <div style="display:flex;width:100%;align-items:center;justify-content:space-between;">
                <div style="margin-left:0.5rem;">
                    Transfering <span id="transferQnt">0</span> items
                </div>
                <div>
                    <span id="loading"></span>
                    <button class="btn btn-primary ml-2 btn-sm mt-1 mb-1" id="submitTransfer">TRANSFER</button>
                    <button class="btn btn-dark m-2 btn-sm mt-1 mb-1" id="close">X</button>
                </div>
            </div>
        `

        const allItems = bpContents.querySelectorAll("img");
        await bpLoadOn();
        const itemLoop = async (item) => {
            const iid = item.dataset.iid;
            const itemData = await superfetchItem(iid);

            if (itemData.playerbound){
                item.classList.add('backpackSlotFade');
                return;
            };

            for (let augid of itemData.augids){
                const augData = await superfetchItem(augid);
                if (augData.playerbound){
                    item.classList.add('backpackSlotFade');
                    return;
                };
            };
            if (!item.dataset.transferListener) {
                item.dataset.transferListener = 'true';

                item.addEventListener('click', async () => {
                    if (backpackAction == 'transferItems'){
                        item.classList.toggle('backpackSlotHighlight');
                        const countSelected = document.querySelectorAll('img.backpackSlotHighlight').length;
                        document.querySelector("#transferQnt").innerHTML = countSelected;
                    };
                });
            };
        };
        await Promise.all(Array.from(allItems).map(itemLoop));
        await bpLoadOff();

        document.querySelector("#submitTransfer").addEventListener('click',async () => {
            const selectedItems = document.querySelectorAll('img.backpackSlotHighlight');
            if (selectedItems.length < 1){
                alert('Please select at least 1 item to transfer');
            } else {
                await bpLoadOn();
                const itemsToTransfer = [];
                for (let item of selectedItems){
                    const iid = item.dataset.iid;
                    itemsToTransfer.push(`&checkbox%5B%5D=${iid}`);
                };
                const itemIds = itemsToTransfer.join('');
                const sendToCharId = document.querySelector('#moxximass select').value;
                await superpost('itemtransfer',`self=${sendToCharId}&submit=Send+items%21${itemIds}`);
                await refreshBp(tab);
                await bpLoadOff();
            };
        });

        document.querySelector("#close").addEventListener('click', async () =>{
            const refreshBp = await superfetch(`ajax/backpackcontents.php?tab=${tab}`, true)
            document.querySelector("#backpack-contents").innerHTML = refreshBp;
            await closeMoxxiBpMenu();
        });
    };

    async function closeMoxxiBpMenu(){
        $('#moxximass').hide();
        $('#massbuttons').show();
        $('#dropmenudiv').show();
        $('.backpackslot').removeClass('backpackSlotHighlight');
        $('.backpackslot').removeClass('backpackSlotFade');
        backpackAction = 'none';
    };


    const bpObserver = new MutationObserver(() => {
        const tab = document.querySelector('a.backpacktab.active').innerHTML;
        doubleClickEquip(tab);
        if (backpackAction == 'equipItems') { equipItemsFunction(tab); };
        if (backpackAction == 'transferItems') { transferItemsFunction(tab); };

        const content = document.querySelector("#simpletabContent small");
        content.innerHTML = `Ctrl click 'vault' for qty selection<p style="margin-left:0.5rem;">Double-click equipment to equip`
    });
    const bpContents = document.querySelector("#backpack-contents");
    if (!bpContents.dataset.observing){
        bpObserver.observe(bpContents, { childList: true, subtree: true });
    };
    bpContents.dataset.observing = true;

    async function bpLoadOn(){
        $('#backpack-contents').hide();
        document.querySelector("#loading").innerHTML = '<img src="https://studiomoxxi.com/moxximod/loading-gif.gif" class="small-loading">'
    };

    async function bpLoadOff(){
        document.querySelector("#loading").innerHTML = ''
        $('#backpack-contents').show();
    };


    async function doubleClickEquip(tab){
        const allItemImages = document.querySelectorAll('#backpack-contents img');
        for (const item of allItemImages){
            item.style.cursor = "pointer";
            item.addEventListener('dblclick', async ()=> {

                if (document.querySelector("#massbuttons")?.style.display != "none"){

                    document.querySelector("#backpack-contents").innerHTML = `<img src="https://studiomoxxi.com/moxximod/loading-gif.gif" class="small-loading">`

                    document.querySelector("#dropmenudiv").style.visibility = 'hidden';

                    const itemId = item.dataset.iid;
                    await superpost('ajax/backpack_action.php', `action=equip&itemids%5B%5D=${itemId}`);

                    await refreshBp(tab);
                };
            });
        };
    };


    async function refreshBp(tab){
        const refresh = await superfetch(`ajax/backpackcontents.php?tab=${tab.toLowerCase()}`, true)
        document.querySelector("#backpack-contents").innerHTML = refresh;
    };

};


async function blankOverlay(server,serverNo,rgaName,charId){

    if (document.querySelector("#mmOnOff")){
        document.querySelector("#mmOnOff").remove();
    };

    appsMenuClose();

    $("body").append(`
    <div id="blankOverlay">
    <a href="https://${server}.outwar.com/home?rg_sess_id=${rgaName}&suid=${charId}&serverid=${serverNo}">CLOSE</a>
    <div class="widget" style="width:90%;height:90%;left:5%;right:5%;box-shadow: 0 6px 10px 0 rgba(0,0,0,1),0 1px 18px 0 rgba(0,0,0,1),0 3px 5px -1px rgba(0,0,0,.2);" id="overlayWidget">
    </div>
    </div>`);

    document.body.style.overflow = 'hidden';

    document.querySelector("#blankOverlay").setAttribute('style',`background:#000000;padding:20px;`)
};


async function itemOnHover(){
    const tip = document.getElementById('dhtmltooltip');
    if (!tip){
        return;
    };

    const observerCallback = async () => {
        if (tip.innerHTML.match(/id="itemtable"/i)) {

            observer.disconnect();

            await parse(tip);

            await itemOnHover();
        };
    };
    const observer = new MutationObserver(observerCallback);

    observer.observe(tip, { attributes: true, childList: true, subtree: true });

    async function parse(tip){

        if (tip.innerHTML.match(/Triworld Codex Chapter [0-9]+/i)){
            const codex = tip.innerHTML.match(/(Triworld Codex Chapter [0-9]+)/i)[1];
            tip.innerHTML = tip.innerHTML.replace('[Slot - Other]','<br><div id="codexCheck"><img src="https://studiomoxxi.com/moxximod/loading-gif.gif" height="25px" width="25px"></div>')
            const changefaction = await superfetch(`changefaction`);
            const codexCheckDiv = document.querySelector("#codexCheck");
            if (changefaction.match(codex) && codexCheckDiv){
                document.querySelector("#codexCheck").innerHTML = `<font color="#ff0000">${codex} has already been activated on this account</font>`
            } else if (codexCheckDiv) {
                document.querySelector("#codexCheck").innerHTML = `<font color="#00ff00">${codex} has not been activated on this account</font>`
            }
            return;
        };

        let itemHoly = parseInt((tip.innerHTML.replace(/,/g,'').match(/\+([0-9]+) <span style="[^"]*">Holy/i) || [0,0])[1]);
        let itemArcane = parseInt((tip.innerHTML.replace(/,/g,'').match(/\+([0-9]+) <span style="[^"]*">Arcane/i) || [0,0])[1]);
        let itemShadow = parseInt((tip.innerHTML.replace(/,/g,'').match(/\+([0-9]+) <span style="[^"]*">Shadow/i) || [0,0])[1]);
        let itemFire = parseInt((tip.innerHTML.replace(/,/g,'').match(/\+([0-9]+) <span style="[^"]*">Fire/i) || [0,0])[1]);
        let itemKinetic = parseInt((tip.innerHTML.replace(/,/g,'').match(/\+([0-9]+) <span style="[^"]*">Kinetic/i) || [0,0])[1]);
        let itemChaos = parseInt((tip.innerHTML.replace(/,/g,'').match(/\+([0-9]+) <span style="[^"]*">Chaos/i) || [0,0])[1]);
        let itemHolyRes = parseInt((tip.innerHTML.replace(/,/g,'').match(/\+([0-9]+) Holy Resist/i) || [0,0])[1]);
        let itemArcaneRes = parseInt((tip.innerHTML.replace(/,/g,'').match(/\+([0-9]+) Arcane Resist/i) || [0,0])[1]);
        let itemShadowRes = parseInt((tip.innerHTML.replace(/,/g,'').match(/\+([0-9]+) Shadow Resist/i) || [0,0])[1]);
        let itemFireRes = parseInt((tip.innerHTML.replace(/,/g,'').match(/\+([0-9]+) Fire Resist/i) || [0,0])[1]);
        let itemKineticRes = parseInt((tip.innerHTML.replace(/,/g,'').match(/\+([0-9]+) Kinetic Resist/i) || [0,0])[1]);
        let augsHoly = 0
        let augsArcane = 0
        let augsShadow = 0
        let augsFire = 0
        let augsKinetic = 0
        let augsChaos = 0
        let augsHolyRes = 0
        let augsArcaneRes = 0
        let augsShadowRes = 0
        let augsFireRes = 0
        let augsKineticRes = 0
        const allAugs = tip.innerHTML.match(/[0-9]+_[0-9]+/g) || []

        const augs = async (iid) => {
            const aug = await superfetch(`item_rollover.php?id=${iid}`);

            itemHoly -= parseInt((aug.replace(/,/g,'').match(/\+([0-9]+) <span style="[^"]*">Holy/i) || [0,0])[1]);
            augsHoly += parseInt((aug.replace(/,/g,'').match(/\+([0-9]+) <span style="[^"]*">Holy/i) || [0,0])[1]);
            itemHolyRes -= parseInt((aug.replace(/,/g,'').match(/\+([0-9]+) Holy Resist/i) || [0,0])[1]);
            augsHolyRes += parseInt((aug.replace(/,/g,'').match(/\+([0-9]+) Holy Resist/i) || [0,0])[1]);

            itemArcane -= parseInt((aug.replace(/,/g,'').match(/\+([0-9]+) <span style="[^"]*">Arcane/i) || [0,0])[1]);
            augsArcane += parseInt((aug.replace(/,/g,'').match(/\+([0-9]+) <span style="[^"]*">Arcane/i) || [0,0])[1]);
            itemArcaneRes -= parseInt((aug.replace(/,/g,'').match(/\+([0-9]+) Arcane Resist/i) || [0,0])[1]);
            augsArcaneRes += parseInt((aug.replace(/,/g,'').match(/\+([0-9]+) Arcane Resist/i) || [0,0])[1]);

            itemShadow -= parseInt((aug.replace(/,/g,'').match(/\+([0-9]+) <span style="[^"]*">Shadow/i) || [0,0])[1]);
            augsShadow += parseInt((aug.replace(/,/g,'').match(/\+([0-9]+) <span style="[^"]*">Shadow/i) || [0,0])[1]);
            itemShadowRes -= parseInt((aug.replace(/,/g,'').match(/\+([0-9]+) Shadow Resist/i) || [0,0])[1]);
            augsShadowRes += parseInt((aug.replace(/,/g,'').match(/\+([0-9]+) Shadow Resist/i) || [0,0])[1]);

            itemFire -= parseInt((aug.replace(/,/g,'').match(/\+([0-9]+) <span style="[^"]*">Fire/i) || [0,0])[1]);
            augsFire += parseInt((aug.replace(/,/g,'').match(/\+([0-9]+) <span style="[^"]*">Fire/i) || [0,0])[1]);
            itemFireRes -= parseInt((aug.replace(/,/g,'').match(/\+([0-9]+) Fire Resist/i) || [0,0])[1]);
            augsFireRes += parseInt((aug.replace(/,/g,'').match(/\+([0-9]+) Fire Resist/i) || [0,0])[1]);

            itemKinetic -= parseInt((aug.replace(/,/g,'').match(/\+([0-9]+) <span style="[^"]*">Kinetic/i) || [0,0])[1]);
            augsKinetic += parseInt((aug.replace(/,/g,'').match(/\+([0-9]+) <span style="[^"]*">Kinetic/i) || [0,0])[1]);
            itemKineticRes -= parseInt((aug.replace(/,/g,'').match(/\+([0-9]+) Kinetic Resist/i) || [0,0])[1]);
            augsKineticRes += parseInt((aug.replace(/,/g,'').match(/\+([0-9]+) Kinetic Resist/i) || [0,0])[1]);

            itemChaos -= parseInt((aug.replace(/,/g,'').match(/\+([0-9]+) <span style="[^"]*">Chaos/i) || [0,0])[1]);
            augsChaos += parseInt((aug.replace(/,/g,'').match(/\+([0-9]+) <span style="[^"]*">Chaos/i) || [0,0])[1]);
        };
        await Promise.all(allAugs.map(augs));
        if (augsHoly > 0){ tip.innerHTML = tip.innerHTML.replace(/&nbsp; \+(.*?) <span style="[^"]*">Holy/i,`&nbsp; +${itemHoly.toLocaleString()} <font color="#00FF00">(+${augsHoly})</font> Holy`) }
        if (augsHolyRes > 0){ tip.innerHTML = tip.innerHTML.replace(/&nbsp; \+(.*?) Holy Resist/i,`&nbsp; +${itemHolyRes.toLocaleString()} <font color="#00FF00">(+${augsHolyRes})</font> Holy Resist`) }
        if (augsArcane > 0){ tip.innerHTML = tip.innerHTML.replace(/&nbsp; \+(.*?) <span style="[^"]*">Arcane/i,`&nbsp; +${itemArcane.toLocaleString()} <font color="#00FF00">(+${augsArcane})</font> Arcane`) }
        if (augsArcaneRes > 0){ tip.innerHTML = tip.innerHTML.replace(/&nbsp; \+(.*?) Arcane Resist/i,`&nbsp; +${itemArcaneRes.toLocaleString()} <font color="#00FF00">(+${augsArcaneRes})</font> Arcane Resist`) }
        if (augsShadow > 0){ tip.innerHTML = tip.innerHTML.replace(/&nbsp; \+(.*?) <span style="[^"]*">Shadow/i,`&nbsp; +${itemShadow.toLocaleString()} <font color="#00FF00">(+${augsShadow})</font> Shadow`) }
        if (augsShadowRes > 0){ tip.innerHTML = tip.innerHTML.replace(/&nbsp; \+(.*?) Shadow Resist/i,`&nbsp; +${itemShadowRes.toLocaleString()} <font color="#00FF00">(+${augsShadowRes})</font> Shadow Resist`) }
        if (augsFire > 0){ tip.innerHTML = tip.innerHTML.replace(/&nbsp; \+(.*?) <span style="[^"]*">Fire/i,`&nbsp; +${itemFire.toLocaleString()} <font color="#00FF00">(+${augsFire})</font> Fire`) }
        if (augsFireRes > 0){ tip.innerHTML = tip.innerHTML.replace(/&nbsp; \+(.*?) Fire Resist/i,`&nbsp; +${itemFireRes.toLocaleString()} <font color="#00FF00">(+${augsFireRes})</font> Fire Resist`) }
        if (augsKinetic > 0){ tip.innerHTML = tip.innerHTML.replace(/&nbsp; \+(.*?) <span style="[^"]*">Kinetic/i,`&nbsp; +${itemKinetic.toLocaleString()} <font color="#00FF00">(+${augsKinetic})</font> Kinetic`) }
        if (augsKineticRes > 0){ tip.innerHTML = tip.innerHTML.replace(/&nbsp; \+(.*?) Kinetic Resist/i,`&nbsp; +${itemKineticRes.toLocaleString()} <font color="#00FF00">(+${augsKineticRes})</font> Kinetic Resist`) }
        if (augsChaos > 0){ tip.innerHTML = tip.innerHTML.replace(/&nbsp; \+(.*?) <span style="[^"]*">Chaos/i,`&nbsp; +${itemChaos.toLocaleString()} <font color="#00FF00">(+${augsChaos})</font> Chaos`) }
    };
};



async function itemDropMenu(server,serverNo,rgaName){
    const menu = document.getElementById('dropmenudiv');
    if (!menu){
        return;
    };
    menu.style.display = "none";

    const observerCallback = async () => {

        observer.disconnect();

        const tip = document.getElementById('dhtmltooltip');
        const itemSlot = tip.innerHTML.match(/\[Slot - (.*?)\]/i)?.[1] || 'None';

        if (tip.innerHTML.match(/Triworld Codex Chapter [0-9]+/i)){
            await codexMenuModify(menu,tip);
        };

        if (tip.innerHTML.match('Augment') && !tip.innerHTML.match('Add Augment Slot') && !tip.innerHTML.match('Remove All Augments') && !tip.innerHTML.match('Remove Augment')){
            await augmentMenuModify(menu,tip);
        }
        if (tip.innerHTML.match('Badge of Absolution')){
            await absolutionMenuModify(menu,tip);
        }
        const eqSlots = ['Core','Head','Neck','Weapon','Body','Shield','Belt','Pants','Ring','Foot'];
        if (eqSlots.includes(itemSlot)){
            await eqCompareModifyMenu(menu,tip,itemSlot);
        };

        await itemDropMenu(server,serverNo,rgaName);
    };
    menu.style.display = "revert";
    const observer = new MutationObserver(observerCallback);
    observer.observe(menu, { attributes: true, childList: true, subtree: true });

    async function eqCompareModifyMenu(menu,tip,itemSlot){
        GM_addStyle(`
            #windowEqCompare { justify-content:center; display: flex; align-items: flex-start; background-image: url('/images/bg.jpg'); }
            .itemTable { display:inline-block;margin:1rem; }
        `);
        const newLink = document.createElement('a');
        newLink.href = "javascript:void(0);";
        newLink.onclick = async function() {
            createWindow("Equipment Compare", "eq_compare", 700, 100, -200);
            document.querySelector("#eq_compare_content").innerHTML = `<div id="windowEqCompare"><img src="https://studiomoxxi.com/moxximod/loading-gif.gif" height="75px" width="75px"></div>`

            const selectedId = document.body.innerHTML.match(/<a href="\/itemlink\?id=([0-9]+)&owner=[0-9]+">View<\/a>/i)?.[1] || 0;

            const charId = (document.body.innerHTML.match(/outwar\.com\/page\?x=([0-9]+)/i) || [0,0])[1];
            const profileData = await superfetchProfile(`profile?id=${charId}`);
            const equippedItem = profileData[itemSlot.toLowerCase()];
            const equippedId = equippedItem.id;
            if (selectedId == 0 || equippedId == 0){
                document.querySelector("#windowEqCompare").innerHTML = '<b>ERROR</b><br>Unable to parse data from the selected item and/or equipped item from the same slot<br>Please try again'
            } else {
                const selectedData = await superfetchItem(selectedId);
                const equippedData = await superfetchItem(equippedId);
                document.querySelector("#windowEqCompare").innerHTML = `
                <div class="itemTable"><b>EQUIPPED ${itemSlot.toUpperCase()}</b><br>${equippedData.raw}</div>
                <div class="itemTable"><b>SELECTED ${itemSlot.toUpperCase()}</b><br>${selectedData.raw}</div>
                `
            };
        };
        newLink.innerHTML = `<i class="fa fa-star"></i> Compare`;
        menu.appendChild(newLink);
    };

    async function codexMenuModify(menu,tip){
        const charId = (document.body.innerHTML.match(/outwar\.com\/page\?x=([0-9]+)/i) || [0,0])[1]
        const codex = tip.innerHTML.match(/(Triworld Codex Chapter [0-9]+)/i)[1];
        const newLink = document.createElement('a');
        newLink.href = "javascript:void(0);";
        newLink.onclick = async function() {
            GM_addStyle(`#overlayWidget{text-align:center;}`)
            await blankOverlay(server,serverNo,rgaName,charId);
            document.querySelector("#overlayWidget").innerHTML = '<img src="https://studiomoxxi.com/moxximod/loading-gif.gif" style="height:100px;width:100px">'
            const rgaCharIds = document.body.innerHTML.replace(/[\n\r]/g,'').match(/<optgroup label="My Characters">.*?<\/optgroup>/i).toString().match(/value="[0-9]+"/g).map(i => i.match(/"([0-9]+)"/i)[1])
            const data = [];
            const rgaCodexLoop = async (id) => {
                const changefaction = await superfetch(`changefaction?suid=${id}`);
                const charName = (changefaction.match(/uname=(.*?)'/i) || ['','error'])[1];
                const codexLvl = (changefaction.match(/Triworld Codex Chapter [0-9]+/g) || []).length;
                const complete = changefaction.match(codex) ? "true" : "false";
                if (charName != "error" && id != "0"){
                    const profileData = await superfetchProfile(`profile?id=${id}`);
                    const power = profileData.power;
                    const ele = profileData.elemental;
                    const loyalty = profileData.loyalty;
                    data.push(`<tr><td>${charName}</td><td>${loyalty}</td><td>${power.toLocaleString()}</td><td>${ele.toLocaleString()}</td><td>${complete}</td><td>${codexLvl}</td><td><a href="trade?rg_sess_id=${rgaName}&suid=${charId}&serverid=${serverNo}&tradeWith=${id}">trade</a></td></tr>`);
                };
            };
            await Promise.all(rgaCharIds.map(rgaCodexLoop));
            document.querySelector("#overlayWidget").innerHTML = `
                <div style="text-align:center;height:100%;overflow:auto;">
                <h3>${codex}</h3>
                <table class="table table-striped sortable" style="text-align:left">
                <thead><tr><th>character</th><th>loyalty</th><th>power</th><th>ele</th><th>completed?</th><th>codex lvl</th><th>trade</th></tr></thead>
                ${data.join('')}
                </table>
                </div>
            `
            await sortableTables();
        };
        newLink.innerHTML = `<i class="fa fa-star"></i> Codex Check`;
        menu.appendChild(newLink);
    };

    async function augmentMenuModify(menu,tip){
        const newLink = document.createElement('a');
        newLink.href = "augmentequip";
        newLink.innerHTML = `<i class="fa fa-star"></i> Add Augment`;
        menu.appendChild(newLink);
    };

    async function absolutionMenuModify(menu,tip){
        const newLink = document.createElement('a');
        newLink.href = "itemtransfer?type=selectbadge";
        newLink.innerHTML = `<i class="fa fa-star"></i> Transfer`;
        menu.appendChild(newLink);
    }

}

async function blankOff(){
    GM_addStyle(`
        @keyframes fadeOut {from {opacity: 1;} to {opacity: 0;}}
        #blankOverlay {animation: fadeOut 1s ease;}
    `)
    await new Promise(resolve => setTimeout(resolve, 1000));
    document.querySelector("#blankOverlay").remove();
    document.body.style.overflowY = 'visible';
};


async function loadingOverlay(){
    GM_addStyle(`
        #loadingOverlayText{text-align:center;background-color:#000000;color:#ffffff;font-size:24px;}
    `)

    $("body").append(`
    <div id="loadingOverlay">
        <img src="https://studiomoxxi.com/moxximod/loading-gif.gif">
        <div id="loadingOverlayText"></div>
    </div>`);

    document.body.style.overflow = 'hidden';

    document.querySelector("#loadingOverlay").setAttribute('style',`background:#000000;padding:20px;`)
};

async function loadingOff(){
    document.body.style.overflowY = 'visible';
    document.querySelector("#loadingOverlay").remove();
};


async function info(request){

    if (request == 'All gods data'){
        return [
            { name:"Ag Nabak the Abomination", artifact:"Artifact of Ag Nabak" },
            { name:"Agnar, Astral Betrayer", artifact:"Artifact of Agnar" },
            { name:"Akkel the Enflamed Warrior", artifact:"Artifact of Akkel" },
            { name:"Amalgamated Apparition", artifact:"Artifact of Amalgamated" },
            { name:"Ancient Magus Tarkin", artifact:"Artifact of Tarkin" },
            { name:"Anguish", artifact:"Artifact of Anguish" },
            { name:"Animated Captain", artifact:"Artifact of Animated Captain" },
            { name:"Animation of Chaos", artifact:"Artifact of Chaos" },
            { name:"Animation of Elements", artifact:"Artifact of Elements" },
            { name:"Animation of Power", artifact:"Artifact of Power" },
            { name:"Animation of Versatility", artifact:"Artifact of Versatility" },
            { name:"Animation of Supremacy", artifact:"Artifact of Supremacy" },
            { name:"Anvilfist", artifact:"Artifact of Anvilfist" },
            { name:"Archdevil Yirkon", artifact:"Artifact of Yirkon" },
            { name:"Arcon, the Arcane Deity", artifact:"Artifact of Arcon" },
            { name:"Balerion, Dragon of Dread", artifact:"Artifact of Balerion" },
            { name:"Banok, Demon of Insanity", artifact:"Artifact of Banok" },
            { name:"Baron Mu, Dark Rider of the Undead", artifact:"Artifact of Baron Mu" },
            { name:"Beast of Cards", artifact:"Artifact of Beast of Cards" },
            { name:"Bloodchill the Grizzly", artifact:"Artifact of Bloodchill" },
            { name:"Bolkor, the Holy Master", artifact:"Artifact of Bolkor" },
            { name:"Brutalitar, Lord of the Underworld", artifact:"Artifact of Brutalitar" },
            { name:"Crane", artifact:"Artifact of Crane" },
            { name:"Crantos, Defender of Ultimation", artifact:"Artifact of Crantos" },
            { name:"Crolvak, the Fire Master", artifact:"Artifact of Crolvak" },
            { name:"Detox", artifact:"Artifact of Detox" },
            { name:"Dexor, Victor of Veldara", artifact:"Artifact of Dexor" },
            { name:"Dlanod, the Crazed Chancellor", artifact:"Artifact of Dlanod" },
            { name:"Dreg nor, Keeper of the Infernal Essence", artifact:"Artifact of Dreg Nor" },
            { name:"Ebliss, Fallen Angel of Despair", artifact:"Artifact of Ebliss" },
            { name:"Emperor Neudeus, Controller of the Universe", artifact:"Artifact of Emperor Neudeus" },
            { name:"Envar, Demon of Lunacy", artifact:"Artifact of Envar" },
            { name:"Esquin, the Kinetic Master", artifact:"Artifact of Esquin" },
            { name:"Felroc, Overseer of Hellfire", artifact:"Artifact of Felroc" },
            { name:"Firan, the Fire Deity", artifact:"Artifact of Firan" },
            { name:"Freezebreed, The Frozen Manipulator", artifact:"Artifact of Freezebreed" },
            { name:"Ganja the Stone Golem", artifact:"Artifact of Ganja" },
            { name:"Garland, The Lord Keeper", artifact:"Artifact of Garland" },
            { name:"Gnorb", artifact:"Artifact of Gnorb" },
            { name:"Gorganus of the Wood", artifact:"Artifact of Gorganus" },
            { name:"Great Lord Ganeshan", artifact:"Artifact of Ganeshan" },
            { name:"Gregov, Knight of the Woods", artifact:"Artifact of Gregov" },
            { name:"Grivvek, Protector of the Brood", artifact:"Artifact of Grivvek" },
            { name:"Hackerphage, Protector of the Gateway", artifact:"Artifact of Hackerphage" },
            { name:"Holgor, the Holy Deity", artifact:"Artifact of Holgor" },
            { name:"Howldroid, Tormentor of the Pit", artifact:"Artifact of Howldroid" },
            { name:"Hyrak, Bringer of Nightmares", artifact:"Artifact of Hyrak" },
            { name:"Jade Dragonite", artifact:"Artifact of Jade Dragonite" },
            { name:"Jazzmin, Maiden of Vitality", artifact:"Artifact of Jazzmin" },
            { name:"Jorun the Blazing Swordsman", artifact:"Artifact of Jorun" },
            { name:"Karvaz, Lord of Alsayic", artifact:"Artifact of Karvaz" },
            { name:"Keeper of Nature", artifact:"Artifact of Nature" },
            { name:"Kinark, the Kinetic Deity", artifact:"Artifact of Kinark" },
            { name:"King Ashnar, Lord of the Unliving", artifact:"Artifact of Ashnar" },
            { name:"Kretok, Descendant of Nature", artifact:"Artifact of Kretok" },
            { name:"Kro Shuk, Doomslayer", artifact:"Artifact of Kro Shuk" },
            { name:"Lacuste of the Swarm", artifact:"Artifact of Lacuste" },
            { name:"Lady Ariella", artifact:"Artifact of Ariella" },
            { name:"Lady Chaos, Queen of the Abyss", artifact:"Artifact of Lady Chaos" },
            { name:"Lord Narada", artifact:"Artifact of Narada" },
            { name:"Lord Sibannac", artifact:"Artifact of Sibannac" },
            { name:"Lord Suka", artifact:"Artifact of Suka" },
            { name:"Lord Varan", artifact:"Artifact of Varan" },
            { name:"Lord Xordam", artifact:"Artifact of Xordam" },
            { name:"Melt Bane, The Forbidden Demon Dragon", artifact:"Artifact of Melt Bane" },
            { name:"Mistress of the Sword", artifact:"Artifact of Mistress" },
            { name:"Murderface", artifact:"Artifact of Murderface" },
            { name:"Murfax, Beast of the Caves", artifact:"Artifact of Murfax" },
            { name:"Nafir, God of Desolation", artifact:"Artifact of Nafir" },
            { name:"Nar Zhul, Slayer of All", artifact:"Artifact of Nar Zhul" },
            { name:"Nayark the Mummified Sorcerer", artifact:"Artifact of Nayark" },
            { name:"Nessam", artifact:"Artifact of Nessam" },
            { name:"Noxious Slug", artifact:"Artifact of Noxious" },
            { name:"Numerocure, The Black Messenger of Evil", artifact:"Artifact of Numerocure" },
            { name:"Old World Drake", artifact:"Artifact of Drake" },
            { name:"Ormsul the Putrid", artifact:"Artifact of Ormsul" },
            { name:"Pinosis", artifact:"Artifact of Pinosis" },
            { name:"Q-SEC Commander", artifact:"Artifact of Q-Sec" },
            { name:"Quiver, The Renegade", artifact:"Artifact of Quiver" },
            { name:"Raiyar, the Shadow Master", artifact:"Artifact of Raiyar" },
            { name:"Rancid, Lord of Thugs", artifact:"Artifact of Rancid" },
            { name:"Rezun, Demon of Madness", artifact:"Artifact of Rezun" },
            { name:"Rillax, Twin of Wisdom", artifact:"Artifact of Rillax" },
            { name:"Rotborn, Eater of the Dead", artifact:"Artifact of Rotborn" },
            { name:"Samatha Dark-Soul", artifact:"Artifact of Samatha" },
            { name:"Sarcrina the Astral Priestess", artifact:"Artifact of Sarcrina" },
            { name:"Shadow", artifact:"Artifact of Shadow" },
            { name:"Shayar, the Shadow Deity", artifact:"Artifact of Shayar" },
            { name:"Sigil, Lich of Woe", artifact:"Artifact of Sigil" },
            { name:"Skarthul the Avenged", artifact:"Artifact of Skarthul" },
            { name:"Skybrine The Inescapable", artifact:"Artifact of Skybrine" },
            { name:"Slashbrood, Devourer of the Blackness", artifact:"Artifact of Slashbrood" },
            { name:"Smoot the Yeti", artifact:"Artifact of Smoot" },
            { name:"Straya, the Underworld Ruler", artifact:"Artifact of Straya" },
            { name:"Sylvanna TorLai", artifact:"Artifact of Sylvanna" },
            { name:"Synge, The Red Dragon", artifact:"Artifact of Synge" },
            { name:"Terrance, Rebel of Rallis", artifact:"Artifact of Terrance" },
            { name:"Thanox, Balancer of Chaos", artifact:"Artifact of Thanox" },
            { name:"The Emerald Assassin", artifact:"Artifact of Emerald Assassin" },
            { name:"Threk, King of Lords", artifact:"Artifact of Threk" },
            { name:"Traxodon the Plaguebringer", artifact:"Artifact of Traxodon" },
            { name:"Tsort", artifact:"Artifact of Tsort" },
            { name:"Tylos, The Lord Master", artifact:"Artifact of Tylos" },
            { name:"Valzek, Harbinger of Death", artifact:"Artifact of Valzek" },
            { name:"Varsanor, Master of Darkness", artifact:"Artifact of Varsanor" },
            { name:"Villax, Twin of Strength", artifact:"Artifact of Villax" },
            { name:"Viserion, the Necrodragon", artifact:"Artifact of Viserion" },
            { name:"Vitkros, Hydra of the Deep", artifact:"Artifact of Vitkros" },
            { name:"Volgan the Living Ironbark", artifact:"Artifact of Volgan" },
            { name:"Wanhiroeaz the Devourer", artifact:"Artifact of Wanhiroeaz" },
            { name:"Windstrike The Vile", artifact:"Artifact of Windstrike" },
            { name:"Xynak, the Arcane Master", artifact:"Artifact of Xynak" },
            { name:"Zertan, The Collector", artifact:"Artifact of Zertan" },
            { name:"Zikkir the Dark Archer", artifact:"Artifact of Zikkir" }

        ]

    } else if (request == 'Cosmos, Great All Being'){
        return [100000000000,50,'Demonic Teleporter<br>Recharge the Fury<br>Cosmos Talisman<br>Tome of Daily Grind<br>Key to Knights Horror<br>Astral Shard<br>Quest Shard<br>Recharge Totem<br>Star Power<br>Ticket to the Mystifying Carnival<br>Containment Orb<br>Orb of the Scepter<br>Amulet Chest (50)']

    } else if (request == 'Death, Reaper of Souls'){
        return [290000000000,80,'Recharge Totem<br>Recharge the Fury<br>Standard Issue Neuralyzer<br>Death Talisman<br>Pirate Treasure Map<br>Key of the Elements<br>Advanced Neuralyzer<br>Trinket Items<br>Elemental Vigor Orb<br>Elemental Assault Orb<br>Elemental Defense Orb<br>Amulet Chest (50)<br>Chancellor Items<br>Spiral Gear']

    } else if (request == 'Maekrix, Dreaded Striker'){
        return [320000000000,73,'Red Dragon Items<br>Astral Totem<br>Maekrix Talisman<br>Key to the Alsayic Ruins (Solo)<br>Juggernaut Talisman<br>Advanced Neuralyzer<br>Irthys Vigor Orb<br>Irthys Assault Orb<br>Irthys Defense Orb<br>Add Augment Slot<br>Remove Augment<br>Amulet Chest (50)<br>Nobel Gear']

    } else if (request == 'Blackhand Reborn'){
        return [570000000000,61,'Augment of the Reborn Knight<br>Core of Blackhand<br>Essence of Reincarnation<br>Blackhand Talisman<br>Profound Ward<br>8-Bit Banana<br>Buckler of Insanity<br>Hauberk of Lunacy<br>Charm of Havoc<br>Unstoppable Concoction<br>Advanced Neuralyzer<br>Power Potion Pack<br>Flask of Endurance<br>Magic Gem<br>Thunder Ball<br>Perfection Gear<br>Exalted Gear']

    } else if (request == 'Zyrak, Vision of Madness'){
        return [1200000000000,65,'Augment of Madness<br>Unstable Jewel<br>Veldarabloom<br>Scripture of Zyrak<br>Pulsating Stone<br>Bottled Chaos<br>Thunder Ball<br>Force of Veldara<br>Interstellar Vessel<br>Vault Tear<br>Vial of Insanity<br>Demonic Madness<br>Infinite Tower Spheroid<br>Transcended Extract<br>Tier 2 Booster Upgrade<br>Ghostly Gear<br>Boon of Vision<br>Ancestral Tombs']

    } else if (request == 'Triworld Simulation'){
        return [2400000000000,39,'6x Vault Tear<br>20x Remove Augment Bundle<br>5x Echo Trove<br>Augment of Simulation<br>Cosmic Mote<br>Amalgamation Blossoms<br>Catalysts of Accumulation<br>Faction Change<br>Codex Chapter 30<br>Codex Chapter 31<br>Triworld Experience Ward<br>Descendant Set Items<br>Quest Experience Potion<br>Blazing Serpent Gear']

    } else if (request == 'Arkron, God of Trials'){
        return [1500000000000,160,'']

    } else if (request == 'Gorath, Baron of Necromancy'){
        return [1500000000000,160,'']

    } else if (request == 'Bazak, Demon of Hatred'){
        return [1500000000000,160,'']

    } else if (request == 'Tarak, Brute of Affliction'){
        return [1500000000000,160,'']

    } else if (request == 'Vorox, Mind of Ruin'){
        return [1500000000000,160,'']
    } else if (request == 'All Potions'){
        return [
            [`Triworld Tincture`,`/images/items/triworldtincture.png`],
            [`Seething Echoes`,`/images/items/coepotion1.png`],
            [`20 Year Aged Whiskey`,`/images/items/whiskeypot.png`],
            [`Blazing Holiday Sauce`,`/images/items/emblemPotion2.jpg`],
            [`Bottle of Holy Slaughter`,`/images/potion26.jpg`],
            [`Brew of Precision`,`/images/items/potion3.gif`],
            [`Holy Vile`,`/images/items/Pot_HolyVile.jpg`],
            [`Damned Element Shot`,`/images/items/h16_Pot6.png`],
            [`Demonic Madness`,`/images/items/vaultpot2.png`],
            [`Dose of Destruction`,`/images/pot2.jpg`],
            [`Evil Scream`,`/images/potion25.jpg`],
            [`Fire Water`,`/images/potion22.jpg`],
            [`Flask of Burning Souls`,`/images/items/basicflask1.gif`],
            [`Flask of Conjured Lightning`,`/images/basicflask4.gif`],
            [`Flask of Endurance`,`/images/items/itemz28.jpg`],
            [`Flask of Flaming Death`,`/images/basicflask2.gif`],
            [`Flask of Forbidden Knowledge`,`/images/basicflask3.gif`],
            [`Flask of Super Nova`,`/images/basicflask5.gif`],
            [`Funny Little Mushroom`,`/images/mushroom.jpg`],
            [`Griznix Potion`,`/images/items/purepwnagepotion.png`],
            [`Halloween Potion`,`/images/items/itemz27.jpg`],
            [`Jabberwocky Blood`,`/images/items/Item_JabberwockyBlood.jpg`],
            [`Kinetic Potency`,`/images/items/KineticShot.jpg`],
            [`Kix Potion`,`/images/potion28.jpg`],
            [`Kombucha`,`/images/items/Putrid%20Power%20Clusters.jpg`],
            [`Liquid Bone Juice`,`/images/items/Item_JabberwockyBlood.jpg`],
            [`Major Chaos Philter`,`/images/items/itemz82.jpg`],
            [`Marsh Water`,`/images/potion24.jpg`],
            [`Minor Chaos Philter`,`/images/items/itemz91.jpg`],
            [`Olympian Juicebox`,`/images/items/lesserolympian.png`],
            [`Olympian Push`,`/images/items/2k8.png`],
            [`Potion of Amdir`,`/images/items/arelepot.jpg`],
            [`Potion of Deceit`,`/images/items/potion2.gif`],
            [`Potion of Elemental Resistance`,`/images/items/eleresistpotion.png`],
            [`Potion of Enraged Alsayic`,`/images/items/PotionofEA.jpg`],
            [`Pumpkin Juice`,`/images/halloween/PumpkinJuice.gif`],
            [`Quantum Quattro`,`/images/items/pot_quantumquattro.jpg`],
            [`Rampage Vile`,`/images/items/Pot_RampageVile.jpg`],
            [`Reikavons Elixir`,`/images/items/ReikavonsElixer.jpg`],
            [`Remnant Solice Lev 8`,`/images/items/goldpotionzorleetz.jpg`],
            [`Remnant Solice Lev 9`,`/images/items/85remnant.jpg`],
            [`Remnant Solice Lev 10`,`/images/items/90remnant.png`],
            [`Remnant Solice Lev 11`,`/images/items/95remnant.png`],
            [`Sammy Sosas Special Sauce`,`/images/pot5.jpg`],
            [`Squidberry Juice`,`/images/items/Item_SquidberryJuice.jpg`],
            [`Star Power`,`/images/items/starpowerelec.jpg`],
            [`Strong Man Elixir`,`/images/items/potion1.gif`],
            [`Sugar Daddy`,`/images/items/sugardaddy.png`],
            [`Unstoppable Concoction`,`/images/items/juggerelepot.jpg`],
            [`Vial of Insanity`,`/images/items/vaultpot1.png`],
            [`Vile Energy Lev 6`,`/images/items/vile_energy_potion.jpg`],
            [`Wonderland Potion`,`/images/items/itemz95.png`],
            [`Zhulian Potion`,`/images/items/wozpotionzor.jpg`],
            [`Zombie Potion 1`,`/images/items/potion_1.gif`],
            [`Zombie Potion 2`,`/images/items/potion_2.gif`],
            [`Zombie Potion 3`,`/images/items/potion_3.gif`],
            [`Zombie Potion 4`,`/images/items/potion_4.gif`],
            [`Zombie Potion 5`,`/images/items/potion_5.gif`],
            [`Zombie Potion 6`,`/images/items/potion_6.gif`],
            [`Boost One`,`/images/items/icon_vial_blue.jpg`],
            [`Boost Two`,`/images/items/icon_vial_green.jpg`],
            [`Boost Three`,`/images/items/icon_vial_orange.jpg`],
            [`Boost Four`,`/images/items/icon_vial_red.jpg`],
            [`Boost Five`,`/images/items/icon_vial_yellow.jpg`]
        ]
    } else if (request = "Cost to Full Gem"){
        return {
            "Common": [10, 9, 7, 4, 0],
            "Uncommon": [20, 18, 14, 8, 0],
            "Rare": [40, 36, 28, 16, 0],
            "Elite": [80, 72, 56, 32, 0],
            "Godly": [160, 144, 112, 64, 0],
            "Brutal": [240, 216, 168, 96, 0],
            "King": [320, 288, 216, 128, 0],
            "Mythic": [400, 360, 280, 160, 0]
        };
    } else if (request = "Cost to One Gem"){
        return {
            "Common":[1,2,3,4,0],
            "Uncommon":[2,4,6,8,0],
            "Rare":[4,8,12,16,0],
            "Elite":[8,16,24,32,0],
            "Godly":[16,32,48,64,0],
            "Brutal":[24,48,72,96,0],
            "King":[32,64,96,128,0],
            "Mythic":[40,80,120,160,0]
        }
    } else {
        return 'error';
    };
};


async function superfetch(url,skipCache){
    if (!skipCache && superfetchCache.hasOwnProperty(url)) {
        return superfetchCache[url];
    } else {
        while (true) {
            try {
                let data = await fetch(url).then(res => res.text());
                if (data.match(/"error":"Rate limit exceeded/i)){
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } else {

                    superfetchCache[url] = data;

                    if (data.match('images/ErrorImg.jpg')){
                        data = "error"
                    };

                    //console.log(`Superfetch complete for ${url}`)
                    return data;
                };
            } catch (error) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            };
        };
    };
};


async function superpost(url,body){
    while (true) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: body
            });

            const data = await response.text();

            if (data.includes("Rate limit exceeded. Please be kind to our servers ;)")) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            } else {
                return data;
            }
        } catch (error) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        };
    };
};


async function updateRga(rgaName){
    const storedRga = GM_getValue("rgaName") || "none";
    if (rgaName != storedRga){
        await mmplus(`AuthCheck|${rgaName}`);
        await GM_setValue("rgaName",rgaName);
    };
};


function mmplus(string) {
    return new Promise((resolve) => {
        if (document.querySelector("#rg_sess_id")) {
            const rgaName = document.querySelector("#rg_sess_id").value;
            auth(rgaName);
            secword();
        } else if (document.body.innerHTML.match(/rg_sess_id=([A-Za-z0-9]+)">[\n\r]<img src="\/assets\/img\/getpoints\.webp">/i)) {
            const rgaName = document.body.innerHTML.match(/rg_sess_id=([A-Za-z0-9]+)">[\n\r]<img src="\/assets\/img\/getpoints\.webp">/i)[1];
            auth(rgaName);
            secword();
        } else {
            return;
        };
        function auth(rgaName){
            const task = string.replace(/rganame/g,rgaName);
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'http://new.outwar.link:8001/',
                data: task,
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                onload: function(data) {
                    const response = data.response;

                    if (response.match(/^[a-zA-Z]+$/)){
                        GM_setValue("auth", response);
                    };
                    displayAuthStatus(response).then(() => {
                        resolve(response);
                    });
                }
            });
        };
    });
};


async function secword(){
    if (GM_getValue('globalSecurityWord')){
        const savedSecWord = GM_getValue('globalSecurityWord');
        const transfer = await superfetch("pointtransfer");
        if (transfer.match(/<strong>Security Prompt<\/strong>/i)){
            const prompt = (transfer.match(/name="prompt_number" value="([0-9]+)"/i) || [0,0])[1]
            await superpost('security_prompt.php',`prompt_number=${prompt}&answer=${savedSecWord}&security_submitted=Continue`);
        };
    };
};

async function notes(string,id,server){

    GM_addStyle(`
        #notesText{ resize: none; width:600px; height:250px; }
    `)

    const name = string.replace(/<.*?>/g,'').replace(/[\n\r]/g,'').replace(/ /g,'');
    const fileName = `mmNote(${name},${id},${server})`

    document.querySelector("#notesBtnDiv").innerHTML = `<li class="toolbarButtons"><a href="javascript:void(0);" id="notesDiv" onmouseover="statspopup(event,'<b>${name} Notes<b>')" onmouseout="kill()"><img src="https://studiomoxxi.com/moxximod/notes.png" height="25px" width="25px"></a></li>`

    document.querySelector("#notesDiv").addEventListener('click', async function(){
        createWindow(`${name} Notes`, "notes", 600, 250, 0);
        document.querySelector("#notes_content").innerHTML =
        `<textarea class="form-control-new" id="notesText"></textarea>`

        if (GM_getValue(fileName)){
            document.querySelector("#notesText").value = GM_getValue(fileName);
        };

        document.querySelector("#notesText").focus();

        document.querySelector('img[onclick="closeWindow(\'notes\');"]').outerHTML = '<img src="images/x.jpg" id="saveAndClose">'
        document.querySelector("#saveAndClose").setAttribute('onmouseover',`statspopup(event,'<b>Save and close</b>')`)
        document.querySelector("#saveAndClose").setAttribute('onmouseout',`kill()`)
        document.querySelector("#saveAndClose").setAttribute('style','cursor:pointer')
        document.querySelector("#saveAndClose").addEventListener('click', function(){
            const noteContent = document.querySelector("#notesText").value;
            GM_setValue(fileName,noteContent);
            document.querySelector("#notes").remove();
        });
    });
};


async function onOff(name){
    document.querySelector("#mmOnOffDiv").innerHTML = `<img src=https://studiomoxxi.com/moxximod/bot.png height="20px" width="20px" id="mmOnOff">`

    const toggle = GM_getValue(`onOff(${name})`);
    if (toggle == "false"){
        document.querySelector("#mmOnOff").setAttribute('onmouseover',`statspopup(event,'Turn on MoxxiMod for this page')`);
        document.querySelector("#mmOnOff").setAttribute('onmouseout','kill()');
        document.querySelector("#mmOnOff").style.filter = 'saturate(0) opacity(0.5)'
        document.querySelector("#mmOnOff").addEventListener('click', async function(){
            GM_setValue(`onOff(${name})`,'true');
            window.location.href = window.location;
        });
    } else {
        document.querySelector("#mmOnOff").setAttribute('onmouseover',`statspopup(event,'Turn off MoxxiMod for this page')`);
        document.querySelector("#mmOnOff").setAttribute('onmouseout','kill()');
        document.querySelector("#mmOnOff").addEventListener('click', async function(){
            GM_setValue(`onOff(${name})`,'false');
            window.location.href = window.location;
        });
    };
};


async function cauldron(){
    GM_addStyle(`
    .rec-img{ height:50px; width:50px; margin:0.25rem; border: 2px #475254 SOLID }
    `)
    const table = document.getElementById('Table_01');
    const newRow = table.insertRow(-1);
    newRow.innerHTML =
    `<td></td>` +
    `<td>` +
    `<a href="cauldron?select=anomalous+steak&select=bizarre+flank&select=peculiar+haunch"><img src="images/items/secretjuicykebab.jpg" class="rec-img"></a><br>` +
    `<a href="cauldron?select=obscure+ribs&select=abnormal+heart&select=mysterious+peas"><img src="images/items/secretheartystew.jpg" class="rec-img"></a><br>` +
    `<a href="cauldron?select=orb+of+the+scepter&select=scepter+shaft&select=nuclear+fuel"><img src="images/items/icon_staff_top.jpg" class="rec-img"></a><br>` +
    `Shortcut buttons work if you have more than 1 of each needed ingredient available` +
    `</td>`
    const search = window.location.search;
    if (search.match(/\?select=.*/)){
        await loadingOverlay();
        const selects = search.match(/\?select=.*/)[0].split('&').map(i => i.match(/select=(.*)/)[1].replace(/\+/g,' '));
        const items = document.querySelectorAll('a[href^="javascript:selectQty"]');
        for (const item of items){
            const data = item.outerHTML.match(/'[0-9]+','[^']*'/i)[0].split(',');
            const name = data[1].toLowerCase().replace(/'/g,'');
            const id = data[0].replace(/'/g,'');
            if (selects.includes(name)){
                await superfetch(`cauldron?qty=1&itemid=${id}`);
            };
        };
        window.location.href = 'cauldron';
    };
};


async function ctrlDragCheckboxToggle() {
    const checkForBoxes = document.querySelector('input[type="checkbox"]:not([disabled])');
    if (!checkForBoxes){
        return;
    };

    let startX, startY, selectionBox;
    let isDragging = false;
    let toggleTo = null;

    function createSelectionBox() {
        const box = document.createElement('div');
        box.style.position = 'absolute';
        box.style.border = '2px dashed #007bff';
        box.style.backgroundColor = 'rgba(0, 123, 255, 0.1)';
        box.style.zIndex = '9999';
        box.style.pointerEvents = 'none';
        document.body.appendChild(box);
        return box;
    }

    function rectIntersects(rect1, rect2) {
        return !(rect2.left > rect1.right ||
                rect2.right < rect1.left ||
                rect2.top > rect1.bottom ||
                rect2.bottom < rect1.top);
    }

    document.addEventListener('mousedown', function(e) {
        if (!e.ctrlKey || e.button !== 0) return;
        isDragging = true;
        startX = e.pageX;
        startY = e.pageY;


        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
        document.body.style.msUserSelect = 'none';

        const target = document.elementFromPoint(e.clientX, e.clientY);
        if (target && target.type === 'checkbox') {
            toggleTo = !target.checked;
        }

        selectionBox = createSelectionBox();
        selectionBox.style.left = `${startX}px`;
        selectionBox.style.top = `${startY}px`;
    });

    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;

        const x = Math.min(e.pageX, startX);
        const y = Math.min(e.pageY, startY);
        const width = Math.abs(e.pageX - startX);
        const height = Math.abs(e.pageY - startY);

        selectionBox.style.left = `${x}px`;
        selectionBox.style.top = `${y}px`;
        selectionBox.style.width = `${width}px`;
        selectionBox.style.height = `${height}px`;
    });

    document.addEventListener('mouseup', function() {
        if (!isDragging) return;
        isDragging = false;


        document.body.style.userSelect = '';
        document.body.style.webkitUserSelect = '';
        document.body.style.msUserSelect = '';

        const boxRect = selectionBox.getBoundingClientRect();

        document.querySelectorAll('input[type="checkbox"]:not([disabled])').forEach(checkbox => {
            const rect = checkbox.getBoundingClientRect();
            if (
                rectIntersects(boxRect, rect) &&
                !checkbox.disabled &&
                checkbox.offsetParent !== null
            ) {
                if (checkbox.checked !== toggleTo) {
                    checkbox.click();
                }
            }
        });

        if (selectionBox) {
            selectionBox.remove();
            selectionBox = null;
        }

        toggleTo = null;
    });

    await toolTip(`Ctrl + Left Click and drag your mouse to easily select checkboxes`);
};


async function toolTip(content){
    document.querySelector("#tipsBtnDiv").innerHTML = `<li class="toolbarButtons"><a href="javascript:void(0);" id="notesDiv" onmouseover="statspopup(event,'<b>MoxxiMod Tip:</b><br>${content}')" onmouseout="kill()"><img src="https://studiomoxxi.com/moxximod/tipIcon.webp" height="25px" width="25px"></a></li>`
};


async function displayAuthStatus(status) {
    const session = document.querySelector("#rg_sess_id").value;
    if (authSliderCreated == false) {
        var newDiv = document.createElement('div');
        newDiv.id = 'authSlider';
        document.body.appendChild(newDiv);
    };
    if (status.match("NotAuthed") && session != "null") {
        document.querySelector("#authSlider").innerHTML = `THIS RGA IS NOT SUBSCRIBED TO MOXXIMOD+`;
        document.querySelector("#authSlider").setAttribute('style', 'background:#870000;');
    } else {
        document.querySelector("#authSlider").innerHTML = `THANK YOU FOR SUBSCRIBING TO MOXXIMOD+`;
        document.querySelector("#authSlider").setAttribute('style', 'background:#008700;');
    };

    GM_addStyle("#authSlider {animation: none;}");

    document.querySelector("#authSlider").offsetHeight;

    GM_addStyle("#authSlider {animation: authSliderAnimation 4s ease forwards;}");
    GM_addStyle("@keyframes authSliderAnimation {0% {position:fixed;bottom:-35px;} 50% {position:fixed;bottom:0px;} 100% {position:fixed;bottom:-35px;}}");
    authSliderCreated = true;
};


async function filterTables(acceptPartialMatch) {

    const filterInput = document.getElementById('filter');
    const tableRows = document.querySelectorAll('.filterable tbody tr');
    filterInput.addEventListener('input', function() {
        const filterValue = this.value.trim().toLowerCase();
        tableRows.forEach(row => {
            const cells = row.querySelectorAll('.filt');
            let matched = false;
            cells.forEach(cell => {
                const values = cell.textContent.split(',').map(item => item.trim().toLowerCase());
                if (acceptPartialMatch){
                    matched = values.some(value => value.includes(filterValue));
                } else {
                    matched = values.includes(filterValue);
                };
            });
            if (filterValue === '' || matched) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            };
        });
    });
};


let mvOrderSaveArray = ''
async function sortableTables() {
    document.querySelectorAll('table.sortable').forEach(table => {
        Array.from(table.querySelectorAll('thead th')).forEach(header => {
            header.addEventListener('click', event => {
                const columnIndex = header.cellIndex;
                const tbody = table.querySelector('tbody');
                const rows = Array.from(tbody.querySelectorAll('tr'));
                const isAscending = !header.classList.contains('ascending');

                if (allNumeric(rows, columnIndex)) {
                    sortNumeric(rows, columnIndex, isAscending);
                } else {
                    sortAlphabetical(rows, columnIndex, isAscending);
                }

                rows.forEach(row => tbody.removeChild(row));
                rows.forEach(row => tbody.appendChild(row));
                table.querySelectorAll('thead th').forEach(th => {
                    th.classList.remove('ascending', 'descending');
                });
                header.classList.toggle('ascending', isAscending);
                header.classList.toggle('descending', !isAscending);

                mvTableOrder();
            });
            header.style.cursor = 'pointer';
        });
    });

    function allNumeric(rows, columnIndex) {
        for (let row of rows) {
            const cellValue = row.cells[columnIndex].textContent.trim().replace(/,/g, '');
            if (isNaN(parseFloat(cellValue))) {
                return false;
            }
        }
        return true;
    }

    function sortNumeric(rows, columnIndex, isAscending) {
        rows.sort((a, b) => {
            const aValue = parseFloat(a.cells[columnIndex].textContent.replace(/,/g, '').trim());
            const bValue = parseFloat(b.cells[columnIndex].textContent.replace(/,/g, '').trim());
            return isAscending ? aValue - bValue : bValue - aValue;
        });
    }

    function sortAlphabetical(rows, columnIndex, isAscending) {
        rows.sort((a, b) => {
            const aValue = a.cells[columnIndex].textContent.trim();
            const bValue = b.cells[columnIndex].textContent.trim();
            return isAscending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        });
    }


    const mvTable = document.querySelector("#mvTable");

    function mvTableOrder(){
        if (mvTable){
            const order = document.querySelectorAll("#mvTable > tbody > tr > td:nth-child(1) > a")
            const array = [];
            order.forEach(td => {
                array.push(td.innerHTML)
            });
            mvOrderSaveArray = array;
        };
    };

    if (mvTable && mvOrderSaveArray){
        const tbody = mvTable.querySelector('tbody');
        const rowMap = {};
        mvTable.querySelectorAll('tbody > tr').forEach((row, index) => {
            const cellValue = row.querySelector('td:first-child').textContent.trim();
            rowMap[cellValue] = row;
        });
        tbody.innerHTML = '';
        mvOrderSaveArray.forEach(value => {
            const row = rowMap[value];
            if (row) {
                tbody.appendChild(row);
            }
        });
    }


    GM_addStyle(`table.sortable th:not(:empty):after {content: "▾";margin-left: 0.1em;}`);
};

async function superfetchItem(itemid){

    const itemData = {};

    const rarities = {
        "cccccc": "Common",
        "FFFFFF": "Uncommon",
        "1eff00": "Rare",
        "ffde5b": "Elite",
        "CA1111": "Godly",
        "0070ff": "Brutal",
        "ff8000": "King",
        "9000ba": "Mythic"
    };

    const raw = await superfetch(`item_rollover.php?id=${itemid}`);
    itemData.raw = raw;

    const html = (await superfetch(`item_rollover.php?id=${itemid}`)).replace(/<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>/g,'').replace(/<span style="color:#[A-Za-z0-9]+">/g,'').replace(/,|%/g,'');

    itemData.slot = (html.match(/\[Slot - (.*?)\]<br\/>/i) || ['','slot unknown'])[1].toLowerCase();
    itemData.img = (html.match(/<img src="([^"]*)" style="border:1px solid #666666;margin:2px;">/i) || ['',''])[1];
    itemData.rarityColor = (html.match(/text-shadow: #47462E 1px 1px 2px;color:#([A-Za-z0-9]+)/i) || ['',''])[1];
    itemData.rarity = rarities[itemData.rarityColor];
    itemData.name = (html.match(/align="left">(.*?)<\/td>/i) || ['',''])[1].replace('td colspan="2"','a');
    itemData.cloned = html.match(/\[Cloned: .*?\]/i) ? true : false;
    itemData.clonedset = itemData.cloned ? html.match(/\[Cloned: (.*?)\]/i)[1] : "None";
    itemData.openaugs = html.match(/\/images\/augslot\.jpg/) ? html.match(/\/images\/augslot\.jpg/g).length : 0;
    itemData.augids = (html.match(/event'[0-9]+_[0-9]+'/g) || []).map(i => i.match(/event'([0-9]+_[0-9]+)/i)[1]);
    itemData.augs = (html.match(/src="[^"]*" ONMOUSEOVER="itempopup\(event'[0-9]+_[0-9]+'\)"/g) || []).map(i => `<img ${i.replace('(event','(event,')} onmouseout="kill()">`).join('')
    itemData.augsOpen = html.match(/\/images\/augslot\.jpg/) ? html.match(/\/images\/augslot\.jpg/g).length : 0;
    itemData.gems = 4-((html.match(/src="\/images\/gemslot2\.jpg"/g) || []).length);
    itemData.atk = parseInt((html.match(/\+([0-9]+) ATK<br>/i) || [0,0])[1]);
    itemData.hp = parseInt((html.match(/\+([0-9]+) HP<br>/i) || [0,0])[1]);
    itemData.holydmg = parseInt((html.match(/\+([0-9]+) Holy<\/span>/i) || [0,0])[1]);
    itemData.arcanedmg = parseInt((html.match(/\+([0-9]+) Arcane<\/span>/i) || [0,0])[1]);
    itemData.shadowdmg = parseInt((html.match(/\+([0-9]+) Shadow<\/span>/i) || [0,0])[1]);
    itemData.firedmg = parseInt((html.match(/\+([0-9]+) Fire<\/span>/i) || [0,0])[1]);
    itemData.kineticdmg = parseInt((html.match(/\+([0-9]+) Kinetic<\/span>/i) || [0,0])[1]);
    itemData.ele = itemData.holydmg + itemData.arcanedmg + itemData.shadowdmg + itemData.firedmg + itemData.kineticdmg
    itemData.chaosdmg = parseInt((html.match(/\+([0-9]+) Chaos<\/span>/i) || [0,0])[1]);
    itemData.holyres = parseInt((html.match(/\+([0-9]+) Holy Resist/i) || [0,0])[1]);
    itemData.arcaneres = parseInt((html.match(/\+([0-9]+) Arcane Resist/i) || [0,0])[1]);
    itemData.shadowres = parseInt((html.match(/\+([0-9]+) Shadow Resist/i) || [0,0])[1]);
    itemData.fireres = parseInt((html.match(/\+([0-9]+) Fire Resist/i) || [0,0])[1]);
    itemData.kineticres = parseInt((html.match(/\+([0-9]+) Kinetic Resist/i) || [0,0])[1]);
    itemData.resist = itemData.holyres + itemData.arcaneres + itemData.shadowres + itemData.fireres + itemData.kineticres;
    itemData.chaosres = (html.match(/\+([0-9]+) Chaos Resist/i) || [0,0])[1];
    itemData.vile = parseInt((html.match(/\+([0-9]+) vile energy/i) || [0,0])[1]);
    itemData.rpt = parseInt((html.match(/\+([0-9]+) rage per hr/i) || [0,0])[1]);
    itemData.ept = parseInt((html.match(/\+([0-9]+) exp per hr/i) || [0,0])[1]);
    itemData.rampage = (html.match(/\+([0-9]+) rampage/i) || [0,0])[1];
    itemData.critical = (html.match(/\+([0-9]+) critical hit/i) || [0,0])[1];
    itemData.maxrage = parseInt((html.match(/\+([0-9]+) max rage/i) || [0,0])[1]);
    itemData.block = (html.match(/\+([0-9]+) block/i) || [0,0])[1];
    itemData.eleblock = (html.match(/\+([0-9]+) elemental block/i) || [0,0])[1];
    itemData.ps = (html.match(/\+(\d+(\.\d+)?) perfect strike/i) || [0,0])[1];
    itemData.playerbound = html.match("Player Bound") ? true : false;
    itemData.raidbound = html.match("Available to") ? true : false;
    if (itemData.raidbound){
        const rbArray = html.replace(/<br \/>/g,'\n').replace(/\t.*/g,'').match(/&nbsp;&nbsp;.*/g);
        itemData.raidboundArray = rbArray.map(i => (i.match(/&nbsp;&nbsp;(.*)/)[1]));
    } else {
        itemData.raidboundArray = [];
    }

    return itemData;

};

async function superfetchProfile(path){


    const profileData = {};

    const html = (await superfetch(path)).replace(/[\n\r]/g,'').replace(/,/g,'');


    profileData.charid = (html.match(/allies\.php\?uid=([0-9]+)/i) || [0,0])[1];
    profileData.name = (html.match(/<font size="3">(.*?)<\/font>/i) || ['er','er'])[1];
    profileData.level = parseInt((html.match(/<font size="2">Level ([0-9]+)/i) || [0,0])[1]);
    profileData.class = (html.match(/<font size="2">Level [0-9]+ (.*?)<\/font>/i) || ['er','er'])[1];
    profileData.exp = parseInt(((html.match(/<font size="1">TOTAL EXPERIENCE.*?<\/tr>/i) || '').toString().match(/>([0-9]+)</i) || [0,0])[1]);
    profileData.power = parseInt(((html.match(/<font size="1">TOTAL POWER.*?<\/tr>/i) || '').toString().match(/>([0-9]+)</i) || [0,0])[1]);
    profileData.attack = parseInt(((html.match(/<font size="1">ATTACK.*?<\/tr>/i) || '').toString().match(/>([0-9]+)</i) || [0,0])[1]);
    profileData.hp = parseInt(((html.match(/<font size="1">HIT POINTS.*?<\/tr>/i) || '').toString().match(/>([0-9]+)</i) || [0,0])[1]);
    profileData.growthyesterday = parseInt(((html.match(/<font size="1">GROWTH YESTERDAY.*?<\/tr>/i) || '').toString().match(/>([0-9]+)</i) || [0,0])[1]);
    profileData.elemental = parseInt(((html.match(/<font size="1">ELEMENTAL ATTACK.*?<\/tr>/i) || '').toString().match(/>([0-9]+)</i) || [0,0])[1]);
    profileData.resist = parseInt(((html.match(/<font size="1">ELEMENTAL RESIST.*?<\/tr>/i) || '').toString().match(/>([0-9]+)</i) || [0,0])[1]);
    profileData.chaos = parseInt(((html.match(/<font size="1">CHAOS DAMAGE.*?<\/tr>/i) || '').toString().match(/>([0-9]+)</i) || [0,0])[1]);
    profileData.wilderness = parseInt(((html.match(/<font size="1">WILDERNESS LEVEL.*?<\/tr>/i) || '').toString().match(/>([0-9]+)</i) || [0,0])[1]);
    profileData.godslayer = parseInt(((html.match(/<font size="1">GOD SLAYER LEVEL.*?<\/tr>/i) || '').toString().match(/>([0-9]+)</i) || [0,0])[1]);
    profileData.strength = parseInt((html.replace(/\s+/g,'').match(/role="progressbar"style="width:([0-9]+)%;height:8px;"/i) || [0,0])[1]);


    const factionLookup = (html.match(/<b><[A-Za-z]+ size="1">FACTION.*?<\/tr>/i) || '').toString().replace(/\(\)/i,'(0)');
    profileData.faction = (factionLookup.match(/([A-Za-z0-9]+) \([0-9]+\)/i) || ['er','er'])[1];
    profileData.loyalty = parseInt((factionLookup.match(/[A-Za-z0-9]+ \(([0-9]+)\)/i) || ['er','er'])[1]);

    profileData.thedude = (html.replace(/808080/g,',808080').replace(/\(event/g,'(event,').replace(/<h5 class="card-title">EQUIPMENT<\/h5>/i,'').match(/<!--Equipment Items-->(.*?)<!--Skill Runes-->/i) || ['er','er'])[1].replace(/<div class="[^"]*">/g,'');


    function parseSection(html, L, T, W, H) {
        const selectorRegex = new RegExp(`left:${L}px;top:${T}px;width:${W}px;height:${H}px;.*?<\/div>`)
        const section = html.replace(/\s+/g,'').match(selectorRegex)?.[0] || '';
        const id = (section.match(/event'([0-9]+)'/i) || [0,0])[1];
        const name = (section.match(/alt="([^"]*)"/i) || ['None','None'])[1];
        const img = (section.match(/src="([^"]*)"/i) || ['None','None'])[1];
        return { id, name, img };
    };


    profileData.core = parseSection(html, 61, 12, 41, 41);
    profileData.head = parseSection(html, 118, 7, 62, 46);
    profileData.neck = parseSection(html, 197, 12, 41, 41);
    profileData.weapon = parseSection(html, 45, 67, 56, 96);
    profileData.body = parseSection(html, 121, 67, 56, 96);
    profileData.shield = parseSection(html, 198, 67, 56, 96);
    profileData.belt = parseSection(html, 61, 192, 41, 41);
    profileData.pants = parseSection(html, 118, 175, 62, 75);
    profileData.ring = parseSection(html, 197, 192, 41, 41);
    profileData.foot = parseSection(html, 118, 262, 62, 66);
    profileData.gem = parseSection(html, 10, 346, 32, 32);
    profileData.rune = parseSection(html, 54, 346, 32, 32);
    profileData.badge = parseSection(html, 214, 346, 32, 32);
    profileData.booster = parseSection(html, 258, 346, 32, 32);
    profileData.ccrest = parseSection(html, 9, 9, 60, 60);
    profileData.fcrest = parseSection(html, 83, 9, 60, 60);
    profileData.pcrest = parseSection(html, 157, 9, 60, 60);
    profileData.acrest = parseSection(html, 231, 9, 60, 60);


    const allOrbs = (html.match(/<div style="position:absolute; left:100px; top:346px; width:99px; height:32px;text-align:center">.*?<\/div>/i) || '').toString();
    const orbIds = (allOrbs.match(/event'[0-9]+'/g) || []).map(i => i.match(/event'([0-9]+)'/i)[1]);
    const orbNames = (allOrbs.match(/alt="[^"]*"/g) || []).map(i => i.match(/alt="([^"]*)"/i)[1]);
    const orbImgs = (allOrbs.match(/src="[^"]*"/g) || []).map(i => i.match(/src="([^"]*)"/i)[1]);
    for (let i = 0; i < 3; i++) {
        profileData[`orb${i + 1}`] = {
            id: orbIds[i] || 0,
            name: orbNames[i] || "None",
            img: orbImgs[i] || "None"
        };
    };

    const godKills = (html.match(/<!--God Kills-->.*?<!--Medals-->/i) || '').toString();
    profileData.completedgodslayer = (godKills.match(/<b>.*?<\/b>/g) || ['<b>None</b>']).map(i => i.match(/<b>(.*?)<\/b>/i)[1]).join(',');
    const skillsCast = (html.match(/<!--Skills-->.*?<!--Start Left Column-->/i) || '').toString();
    profileData.skills = {
        images: html.match(/<!--Skills-->.*?<!--Start Left Column-->/i) ? (html.match(/<!--Skills-->.*?<!--Start Left Column-->/i).toString().match(/<img align.*?ONMOUSEOUT="kill\(\)">/g) || []).map(i => i.replace(/event'/g,`event,'`).replace(/'808080/g,`',808080`)) : [],
        list: (skillsCast.match(/alt="[^"]*"/g) || ['"None"']).map(i => i.match(/"([^"]*)"/i)[1]).join(', '),
        data: []
    };

    for (const skill of profileData.skills.images){
        const skillName = skill.match(/alt="([^"]*)"/i)?.[1] || '';
        const hoursLeft = parseInt(skill.match( /([0-9]+) hour/i)?.[1] || "0");
        const minsLeft = parseInt(skill.match(/([0-9]+) min/i)?.[1] || "0");
        const timeLeft = hoursLeft * 60 + minsLeft;
        const castBy = skill.match(/<br>Cast By (.*?)'/i)?.[1] || "";
        const img = skill.match(/src="([^"]*)"/i)[1];
        profileData.skills.data.push({ name: skillName, time: timeLeft, cast: castBy, img: img });
    };

    profileData.crewname = (html.match(/<a href="\/crew_profile\?id=[0-9]+">(.*?)<\/a>/i) || ['None','None'])[1];
    profileData.crewid = parseInt((html.match(/<a href="\/crew_profile\?id=([0-9]+)">.*?<\/a>/i) || [0,0])[1]);
    profileData.underlings = (((html.match(/<table id="UnderlingTable" class="table table-striped-dark mt-1">.*?<\/table>/i) || '').toString().match(/profile\.php\?id=[0-9]+/g)) || []).length;
    profileData.underlingids = (((html.match(/<table id="UnderlingTable" class="table table-striped-dark mt-1">.*?<\/table>/i) || '').toString().match(/profile\.php\?id=[0-9]+/g)) || ['0']).map(i => i.match(/[0-9]+/)[0]);
    profileData.profilepic = (html.match(/class="profilepic" src="([^"]*)"/i) || ['er','er'])[1];

    if (!path.match(/\?id=/i) && !path.match(/\?transnick=/i)){
        profileData.currentrage = parseInt((html.replace(/<.*?>/g,'').replace(/\s+/g,'').match(/RAGE:([0-9]+)/i) || [0,0])[1]);
        profileData.maxrage = parseInt((html.replace(/<.*?>/g,'').replace(/\s+/g,'').match(/Maximum:([0-9]+)/i) || [0,0])[1]);
        profileData.rageismaxed = profileData.currentrage == profileData.maxrage;
        profileData.growthtoday = parseInt((html.replace(/<.*?>/g,'').replace(/\s+/g,'').match(/GrowthToday:([0-9]+)/i) || [0,0])[1]);
        profileData.tolevel = parseInt((html.replace(/<.*?>/g,'').replace(/\s+/g,'').match(/NeededtoLevel:([0-9]+)/i) || [0,0])[1]);
        profileData.minimum = parseInt((html.replace(/<.*?>/g,'').replace(/\s+/g,'').match(/Minimum:([0-9]+)/i) || [0,0])[1]);
        profileData.expperturn = parseInt((html.replace(/<.*?>/g,'').replace(/\s+/g,'').match(/PerTurn:([0-9]+)Minimum/i) || [0,0])[1]);
        profileData.rageperturn = parseInt((html.replace(/<.*?>/g,'').replace(/\s+/g,'').match(/PerTurn:([0-9]+)Maximum/i) || [0,0])[1]);
        profileData.rampage = parseInt((html.replace(/<.*?>/g,'').replace(/\s+/g,'').match(/Rampage:([0-9]+)%/i) || [0,0])[1]);
        profileData.critical = parseInt((html.replace(/<.*?>/g,'').replace(/\s+/g,'').match(/Critical:([0-9]+)%/i) || [0,0])[1]);
        profileData.gold = parseInt(html.replace(/<.*?>/g,'').replace(/\s+/g,'').match(/Gold:([0-9]+)/i)?.[1] || "")
    }

    return profileData;

};

async function superfetchHome(path){

    const homeData = {};

    const html = (await superfetch(path)).replace(/\s+/g,'').replace(/[\n\r]/g,'');

    homeData.name = (html.match(/<h6class="">(.*?)<\/h6>/i) || ['er','er'])[1];
    homeData.level = parseInt((html.match(/<spanclass="toolbar_level">([0-9]+)<\/span>/i) || [0,0])[1]);
    homeData.currentrage = parseInt((html.replace(/<.*?>/g,'').replace(/\s+/g,'').replace(/,/g,'').match(/RAGE:([0-9]+)/i) || [0,0])[1]);
    homeData.maxrage = parseInt((html.replace(/<.*?>/g,'').replace(/\s+/g,'').replace(/,/g,'').match(/Maximum:([0-9]+)/i) || [0,0])[1]);
    homeData.growthtoday = parseInt((html.replace(/<.*?>/g,'').replace(/\s+/g,'').replace(/,/g,'').match(/GrowthToday:([0-9]+)/i) || [0,0])[1]);
    homeData.expperturn = parseInt((html.replace(/<.*?>/g,'').replace(/\s+/g,'').replace(/,/g,'').match(/PerTurn:([0-9]+)Minimum/i) || [0,0])[1]);
    homeData.rageperturn = parseInt((html.replace(/<.*?>/g,'').replace(/\s+/g,'').replace(/,/g,'').match(/PerTurn:([0-9]+)Maximum/i) || [0,0])[1]);
    homeData.rampage = parseInt((html.replace(/<.*?>/g,'').replace(/\s+/g,'').match(/Rampage:([0-9]+)%/i) || [0,0])[1]);
    homeData.critical = parseInt((html.replace(/<.*?>/g,'').replace(/\s+/g,'').match(/Critical:([0-9]+)%/i) || [0,0])[1]);

    homeData.skillpoints = parseInt(html.match(/Skill:<\/b><td>([0-9]+)<\/div>/i)[1]);
    homeData.skillclass = html.replace(/PopStar|Monster|Gangster/g,'').match(/Level[0-9]+([A-Za-z]+)<\/span>/i)[1];

    homeData.holyresist = parseInt(html.match(/HolyResist:<\/b><\/font><\/td><tdalign="right"><fontface="Verdana,Arial,Helvetica,sans-serif"size="1">([0-9]+)<\/font>/i)[1]);
    homeData.arcaneresist = parseInt(html.match(/ArcaneResist:<\/b><\/font><\/td><tdalign="right"><fontface="Verdana,Arial,Helvetica,sans-serif"size="1">([0-9]+)<\/font>/i)[1]);
    homeData.shadowresist = parseInt(html.match(/ShadowResist:<\/b><\/font><\/td><tdalign="right"><fontface="Verdana,Arial,Helvetica,sans-serif"size="1">([0-9]+)<\/font>/i)[1]);
    homeData.fireresist = parseInt(html.match(/FireResist:<\/b><\/font><\/td><tdalign="right"><fontface="Verdana,Arial,Helvetica,sans-serif"size="1">([0-9]+)<\/font>/i)[1]);
    homeData.kineticresist = parseInt(html.match(/KineticResist:<\/b><\/font><\/td><tdalign="right"><fontface="Verdana,Arial,Helvetica,sans-serif"size="1">([0-9]+)<\/font>/i)[1]);
    homeData.chaosresist = parseInt(html.match(/ChaosResist:<\/b><\/font><\/td><tdalign="right"><fontface="Verdana,Arial,Helvetica,sans-serif"size="1">([0-9]+)<\/font>/i)[1]);

    homeData.alvar = parseInt(html.replace(/<.*?>/g,'').match(/Alvar:([0-9]+)/i)[1]);
    homeData.delruk = parseInt(html.replace(/<.*?>/g,'').match(/Delruk:([0-9]+)/i)[1]);
    homeData.vordyn = parseInt(html.replace(/<.*?>/g,'').match(/Vordyn:([0-9]+)/i)[1]);
    homeData.codex = parseInt(html.replace(/<.*?>/g,'').match(/TriworldInfluence:([0-9]+)/i)[1]);

    homeData.underlingloyalty = html.match(/UnderlingLoyalty:<\/b><\/font><\/td><tdalign="right"><fontface="Verdana,Arial,Helvetica,sans-serif"size="1">([0-9]+)/i)[1];
    homeData.mrupgrades = {
        purchased: parseInt((html.replace(/,/g,'').match(/MaximumRage:<\/b><\/font><\/td><tdstyle="padding-bottom:5px;"align="right"><fontface="VerdanaArialHelveticasans-serif"size="1">([0-9]+)\/[0-9]+/i) || [0,0])[1]),
        max: parseInt((html.replace(/,/g,'').match(/MaximumRage:<\/b><\/font><\/td><tdstyle="padding-bottom:5px;"align="right"><fontface="VerdanaArialHelveticasans-serif"size="1">[0-9]+\/([0-9]+)/i) || [0,0])[1])
    };

    return homeData;

};


async function superfetchCrewActionLogs(search){

    const searchValue = search ? '&search%5Bvalue%5D=' + search.replace(/ /g,'+') : ""

    const logUrls = [];

    for (let i = 0; i <= 4800; i += 200) {
        const url = `ajax/ajax_crew_actionlog.php?start=${i}&length=200${searchValue}`;
        logUrls.push(url);
    };

    const logs = {
        award: [],
        deposit: [],
        delete: [],
    };

    const checkLogs = async (log) => {
        const fetchLog = await superfetch(log, true);
        const data = JSON.parse(fetchLog);
        const array = data.data;
        for (let log of array){
            const date = log[2];
            const action = log[1];
            const itemAward = action.match(/Awarded (.*) \(([0-9]+)\) to (.*)/i);
            const itemDeposit = action.match(/Deposited (.*) \(([0-9]+)\)/i);
            const itemDelete = action.match(/Crew\([0-9]+\): Deleted (.*) \(([0-9]+)\)/i)
            if (itemAward){
                logs.award.push({ date: date, name: itemAward[1], id: itemAward[2], char: itemAward[3] });
            } else if (itemDeposit){
                logs.deposit.push({ date: date, name: itemDeposit[1], id: itemDeposit[2] });
            } else if (itemDelete){
                logs.delete.push({ date: date, name: itemDelete[1], id: itemDelete[2] })
            };
        };
    };

    await Promise.all(logUrls.map(checkLogs));

    return logs;

};


async function backpack(bpHtml, itemName) {
    const backpack = new DOMParser().parseFromString(bpHtml, 'text/html');
    const match = Array.from(backpack.querySelectorAll('[data-name]'))
        .find(i => i.dataset.name?.toLowerCase() === itemName.toLowerCase());
    if (!match) {
        return { iid: 0, quantity: 0 };
    };
    return {
        iid: match.dataset.iid || 0,
        quantity: parseInt(match.dataset.itemidqty || 0)
    };
};