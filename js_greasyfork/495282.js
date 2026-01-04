// ==UserScript==
// @name         OGLight - Bermuda
// @namespace    https://openuserjs.org/users/Pumpk1in
// @version      4.2.7.3
// @description  OGLight script for OGame with some little edits
// @author       Oz, Pumpk1in
// @license      MIT
// @copyright    2019-2023, Oz, Pumpk1in
// @match        https://*.ogame.gameforge.com/game/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_getTab
// @grant        GM_saveTab
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/495282/OGLight%20-%20Bermuda.user.js
// @updateURL https://update.greasyfork.org/scripts/495282/OGLight%20-%20Bermuda.meta.js
// ==/UserScript==
'use strict';

// ogl lazy loading
if(new URL(window.location.href).searchParams.get('oglLazy') == 'true' && !document.hasFocus())
{
    window.onfocus = () => window.location.href = 'https://' + window.location.host + window.location.pathname + window.location.search.replace('&oglLazy=true', '');
    localStorage.setItem('ogl-redirect', false);
    window.stop();
}

// redirect user if needed
let redirect = localStorage.getItem('ogl-redirect');
if(redirect?.indexOf('https') > -1)
{
    GM_addStyle(`
        body { background:#000 !important; }
        body * { display:none !important; }
    `);

    setTimeout(() => window.location.replace(redirect));

    localStorage.setItem('ogl-redirect', false);
    window.stop();
}

// goodbye default tooltips
function goodbyeTipped()
{
    if(typeof Tipped !== 'undefined')
    {
        for(let [key] of Object.entries(Tipped))
        {
            Tipped[key] = function() { return false; }
        }
    }
    else requestAnimationFrame(() => goodbyeTipped());
}

goodbyeTipped();

// #region
const oglcss =
`
/*css*/

:root
{

/* primary  */
    --p0:hsl(210deg 32% 3%);
    --p1:hsl(210deg 32% 6%);
    --p2:hsl(210deg 32% 9%);
    --p3:hsl(210deg 32% 12%);
    --p4:hsl(210deg 32% 15%);
    --p5:hsl(210deg 32% 16%);
    --p6:hsl(210deg 32% 30%);

    /* ui */
    --ui1:hsl(185deg 44% 46%);
    --ui2:hsl(227deg 39% 44%);
    --uigradient:linear-gradient(90deg,#59309b, #38d7b2);
    --uiradius:4px;

    /* neon */
    --neon:hsl(199deg 64% 60%);
    --neonborder:hsl(199deg 100% 81%);

    /* text */
    --textblue:hsl(212deg 19% 50%);
    --textcyan:hsl(197deg 22% 47%);
    --textgold:hsl(42deg 21% 46%);
    --textsand:hsl(42deg 44% 60%);
    --textpremium:hsl(44deg 81% 58%);
    --textdate:hsl(224deg 100% 79%);
    --texttime:hsl(33deg 100% 66%);

    /* colors */
    --gray0:hsl(0deg 0% 35%);
    --gray1:hsl(0deg 0% 50%);
    --gray2:hsl(0deg 0% 65%);

    --yellow0:hsl(50deg 50% 35%);
    --yellow1:hsl(50deg 50% 50%);
    --yellow2:hsl(50deg 50% 65%);

    --orange0:hsl(19deg 92% 67%);

    --red0:hsl(0deg 50% 35%);
    --red1:hsl(0deg 50% 50%);
    --red2:hsl(0deg 50% 64%);

    --green0:hsl(170deg 50% 35%);
    --green1:hsl(170deg 50% 50%);
    --green2:hsl(170deg 50% 65%);

    --blue0:hsl(210deg 50% 35%);
    --blue1:hsl(210deg 50% 50%);
    --blue2:hsl(210deg 50% 65%);

    /* marker */
    --blue:#5476f1;
    --red:#da3e3e;
    --violet:#b646da;
    --green:#32b199;
    --yellow:#e2b431;
    --gray:#171f29;
    --white:#bbb;

    /* rank */
    --global:hsl(0deg 89% 72%);
    --economy:hsl(210deg 87% 75%);
    --techs:hsl(150deg 49% 58%);
    --fleet:hsl(303deg 63% 71%);
    --def:hsl(19deg 69% 64%);

    /* resources */
    --metal:hsl(240deg 24% 68%);
    --crystal:hsl(199deg 72% 74%);
    --deut:hsl(172deg 45% 46%);
    --energy:#f5bbb4;
    --dm:#c688ec;
    --food:hsl(316deg 21% 70%);
}

body
{
    -webkit-text-size-adjust:none;
    -ms-text-size-adjust:none;
    -moz-text-size-adjust:none;
    text-size-adjust:none;
}

.build-it_wrap
{
    display: none !important;
}
}

body.ogl_active
{
    overflow:hidden;
}

.c-right, .c-left
{
    display:none;
}

.icon:not(.sprite):not(.resource):not(.lifeformsprite), .material-icons
{
    direction:ltr;
    display:inline-block;
    font-family:'Material Icons' !important;
    font-weight:normal !important;
    font-style:normal !important;
    font-size:inherit !important;
    image-rendering:pixelated;
    line-height:inherit !important;
    letter-spacing:normal;
    text-transform:none;
    transform:rotate(0.03deg);
    white-space:nowrap;
    word-wrap:normal;
    -webkit-font-feature-settings:'liga';
    font-feature-settings:'liga';
    -webkit-font-smoothing:antialiased;
}

.technology .icon .level, .technology .icon .amount
{
    font-size:10px;
    white-space:nowrap;
}

.input_replacement, input[type="text"], input[type="email"], input[type="password"], input[type="search"],
.technology input[type="number"], .technology input[type="text"]
{
    background-color:#c8d1da !important;
    border:none !important;
    border-radius:2px !important;
    box-shadow:0 0 0 2px #eef7fb !important;
    color:var(--p2) !important;
    font-weight:bold !important;
}

.technology input[type="number"][disabled], .technology input[type="text"][disabled]
{
    background:#333c44 !important;
    box-shadow:0 0 0 2px #52565a !important;
}

#fleet1 .technology.ogl_notEnoughShips input[type="number"], #fleet1 .technology.ogl_notEnoughShips input[type="text"]
#fleet1 .technology.ogl_notEnoughShips input[type="number"][disabled], #fleet1 .technology.ogl_notEnoughShips input[type="text"][disabled]
{
    background:#dd9292 !important;
}

.ogl_hidden
{
    display:none !important;
}

.ogl_invisible
{
    visibility:hidden !important;
}

.ogl_hiddenContent
{
    font-size:0 !important;
    line-height:0;
}

.ogl_centered
{
    text-align:center;
}

.ogl_noPointer
{
    pointer-events:none !important;
}

.ogl_loader
{
    animation:spin .7s infinite linear;
    background:var(--uigradient) border-box;
    border:4px solid transparent;
    border-radius:100%;
    height:40px;
    margin:30px;
    mask-composite:exclude;
    width:40px;
    -webkit-mask:linear-gradient(#888 0 0) padding-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite:xor;
}

@keyframes spin
{
   from { transform:rotate(0); }
   to { transform:rotate(360deg); }
}

#highscoreContent .ogl_loader
{
    position:absolute;
    top:14px;
    right:0px;
}

.ogl_metal, #metal_box .value, .msg .resspan[data-type="metal"] { color:var(--metal) !important; }
.ogl_crystal, #crystal_box .value, .msg .resspan[data-type="crystal"] { color:var(--crystal) !important; }
.ogl_deut, #deuterium_box .value, .msg .resspan[data-type="deut"] { color:var(--deut) !important; }
.ogl_dm, #darkmatter_box .value, .msg .resspan[data-type="dm"] { color:var(--dm) !important; }
.ogl_energy, #energy_box .value { color:var(--energy) !important; }
.ogl_food, #food_box .value, .msg .resspan[data-type="food"] { color:var(--food) !important; }
.ogl_fleet { color:var(--fleet) !important; }

.ogl_shipList
{
    display:grid;
    grid-gap:5px;
    grid-template-columns:repeat(4, 1fr);
}

.ogl_shipList .ogl_shipIcon:hover
{
    cursor:pointer;
    position:relative;
}

.ogl_shipList .ogl_shipIcon:hover:before
{
    border-radius:4px;
    bottom:0;
    box-shadow:inset 0 0 2px 2px var(--neonborder), inset 0 0 12px 3px var(--neon);
    content:'';
    left:0;
    position:absolute;
    right:0;
    top:0;
}

.ogl_shipIcon
{
    background-color:rgba(255,255,255,.1);
    background-position:center;
    background-size:cover !important;
    border:2px solid var(--p2);
    border-radius:4px;
    /*box-shadow:inset 0 0 0 2px rgba(0,0,0,.3);*/
    box-sizing:border-box;
    height:40px;
    width:40px;
}

.ogl_shipIcon.ogl_0 { background:var(--red); }
.ogl_shipIcon.ogl_0.ogl_active { background:var(--green); }
.ogl_shipIcon.ogl_202 { background-image:url(https://gf2.geo.gfsrv.net/cdnd9/60555c3c87b9eb3b5ddf76780b5712.jpg); }
.ogl_shipIcon.ogl_203 { background-image:url(https://gf1.geo.gfsrv.net/cdn34/fdbcc505474e3e108d10a3ed4a19f4.jpg); }
.ogl_shipIcon.ogl_204 { background-image:url(https://gf2.geo.gfsrv.net/cdnd2/9ed5c1b6aea28fa51f84cdb8cb1e7e.jpg); }
.ogl_shipIcon.ogl_205 { background-image:url(https://gf1.geo.gfsrv.net/cdnf1/8266a2cbae5ad630c5fedbdf270f3e.jpg); }
.ogl_shipIcon.ogl_206 { background-image:url(https://gf2.geo.gfsrv.net/cdn45/b7ee4f9d556a0f39dae8d2133e05b7.jpg); }
.ogl_shipIcon.ogl_207 { background-image:url(https://gf1.geo.gfsrv.net/cdn32/3f4a081f4d15662bed33473db53d5b.jpg); }
.ogl_shipIcon.ogl_208 { background-image:url(https://gf1.geo.gfsrv.net/cdn6f/41a21e4253d2231f8937ddef1ba43e.jpg); }
.ogl_shipIcon.ogl_209 { background-image:url(https://gf1.geo.gfsrv.net/cdn07/6246eb3d7fa67414f6b818fa79dd9b.jpg); }
.ogl_shipIcon.ogl_210 { background-image:url(https://gf3.geo.gfsrv.net/cdnb5/347821e80cafc52aec04f27c3a2a4d.jpg); }
.ogl_shipIcon.ogl_211 { background-image:url(https://gf1.geo.gfsrv.net/cdnca/4d55a520aed09d0c43e7b962f33e27.jpg); }
.ogl_shipIcon.ogl_213 { background-image:url(https://gf3.geo.gfsrv.net/cdn2a/c2b9fedc9c93ef22f2739c49fbac52.jpg); }
.ogl_shipIcon.ogl_214 { background-image:url(https://gf3.geo.gfsrv.net/cdn84/155e9e24fc1d34ed4660de8d428f45.jpg); }
.ogl_shipIcon.ogl_215 { background-image:url(https://gf3.geo.gfsrv.net/cdn5a/24f511ec14a71e2d83fd750aa0dee2.jpg); }
.ogl_shipIcon.ogl_218 { background-image:url(https://gf1.geo.gfsrv.net/cdn39/12d016c8bb0d71e053b901560c17cc.jpg); }
.ogl_shipIcon.ogl_219 { background-image:url(https://gf3.geo.gfsrv.net/cdne2/b8d8d18f2baf674acedb7504c7cc83.jpg); }

.ogl_shipIcon.ogl_metal, .ogl_shipIcon.ogl_crystal, .ogl_shipIcon.ogl_deut, .ogl_shipIcon.ogl_dm, .ogl_shipIcon.ogl_energy, .ogl_shipIcon.ogl_food
{
    background-image:url(https://gf3.geo.gfsrv.net/cdned/7f14c18b15064d2604c5476f5d10b3.png) !important;
    background-size:302px !important;
}

.ogl_shipIcon.ogl_metal { background-position:-1px -44px !important; }
.ogl_shipIcon.ogl_crystal { background-position:-39px -44px !important; }
.ogl_shipIcon.ogl_deut { background-position:-76px -44px !important; }
.ogl_shipIcon.ogl_dm { background-position:-153px -45px !important; }
.ogl_shipIcon.ogl_energy { background-position:-114px -45px !important; }
.ogl_shipIcon.ogl_food { background-position:-227px -45px !important; }

.ogl_shipIcon[class*="ogl_mission"]
{
    background-image:url(https://gf2.geo.gfsrv.net/cdn14/f45a18b5e55d2d38e7bdc3151b1fee.jpg);
    background-position:-39px -0;
    background-size:398px !important;
}

.ogl_shipIcon.ogl_mission1 { background-position:-292px 0 !important; }
.ogl_shipIcon.ogl_mission2 { background-position:-364px 0 !important; }
.ogl_shipIcon.ogl_mission3 { background-position:-183px 0 !important; }
.ogl_shipIcon.ogl_mission4 { background-position:-111px 0 !important; }
.ogl_shipIcon.ogl_mission5 { background-position:-255px 0 !important; }
.ogl_shipIcon.ogl_mission6 { background-position:-219px 0 !important; }
.ogl_shipIcon.ogl_mission7 { background-position:-75px 0 !important; }
.ogl_shipIcon.ogl_mission8 { background-position:-147px 0 !important; }
.ogl_shipIcon.ogl_mission9 { background-position:-329px 0 !important; }
.ogl_shipIcon.ogl_mission15 { background-position:-2px 0 !important; }

.ogl_inFlight, .ogl_inFlight:before, .ogl_inFlight:after
{
    border-style:solid;
    border-width:3px 6px 3px 0;
    border-color:transparent #51708f transparent transparent;
    cursor:pointer;
    height:0 !important;
    position:absolute !important;
    right:auto;
    top:0 !important;
    transform:translateX(100%);
    width:0 !important;
}

.ogl_inFlight:before, .ogl_inFlight:after
{
    border:inherit;
}

.ogl_inFlight
{
    top:23px !important;
}

.ogl_inFlight:before
{
    content:'';
    right:-6px !important;
}

.ogl_inFlight:after
{
    bottom:0 !important;
    content:'';
    right:-6px !important;
    top:auto !important;
}

.ogl_inFlight.ogl_active, .ogl_inFlight.ogl_active:before, .ogl_inFlight.ogl_active:after,
{
    border-color:transparent #fff transparent transparent;
}

.ogl_inFlight.ogl_warning, .ogl_inFlight.ogl_warning:before, .ogl_inFlight.ogl_warning:after
{
    border-color:transparent var(--yellow) transparent transparent;
}

.ogl_inFlight.ogl_danger, .ogl_inFlight.ogl_danger:before, .ogl_inFlight.ogl_danger:after
{
    border-color:transparent var(--red) transparent transparent;
}

.ogl_missionType.ogl_inFlight, .ogl_missionType.ogl_inFlight:before, .ogl_missionType.ogl_inFlight:after
{
    border-color:transparent currentColor transparent transparent !important;
}

.ogl_inFlight.ogl_warning, .ogl_inFlight.ogl_danger
{
    animation:blink 1s infinite;
}

.ogl_inFlight[data-mission-type="0"]
{
    display:none;
}

@keyframes blink
{
    20% { opacity:1; }
    50% { opacity:0; }
    100% { opacity:1; }
}

.ogl_planetFleet
{
    top:8px !important;
    right:55px !important;
}

[data-panel="resources"] .ogl_planetFleet
{
    right:94px !important;
}

.ogl_moonFleet
{
    right:37px !important;
    transform:rotate(180deg);
}

[data-panel="resources"] .ogl_moonFleet
{
    right:76px !important;
}

.tpd-tooltip:not(.ogl_tooltip)
{
    display:none !important;
    height:0px !important;
    overflow:hidden !important;
    pointer-events:none !important;
    width:0px !important;
}

.splitLine, .ogl_choseCapacity hr, .ogl_tooltip hr
{
    background:var(--p4) !important;
    border:none !important;
    height:2px !important;
    margin:9px 0 !important;
}

.premiumHighligt span
{
    color:var(--textpremium) !important;
}

.ogl_colorPicker
{
    display:grid;
    grid-template-columns:repeat(2, 1fr);
    width:auto;
}

.ogl_colorButton
{
    background:#151515;
    border:2px solid #1f252b;
    border-radius:20px;
    cursor:pointer;
    height:16px;
    right:7px;
    position:absolute;
    top:7px;
    transition:all .2s;
    user-select:none;
    width:25px;
}

.ogl_colorButton:hover
{
    border-color:#263640;
    filter:brightness(1.2);
}

.ogl_colorPicker > div
{
    border-radius:20px;
    box-shadow:inset 0 0 0 3px rgba(0,0,0,.3);
    cursor:pointer;
    filter:brightness(.9);
    height:20px;
    margin:2px;
    position:relative;
    transition:transform .2s, filter .2s;
    width:30px;
}

.ogl_colorPicker > div:hover
{
    filter:brightness(1.3);
    transform:scale(1.2);
    z-index:2;
}

.ogl_colorPicker > div[data-color="none"]:before
{
    content:'clear';
    display:block;
    font-family:'material icons';
    font-size:10px;
    height:100%;
    left:0;
    line-height:20px;
    position:absolute;
    text-align:center;
    top:0;
    width:100%;
}

[data-color="red"], [data-color="red"] .ogl_colorButton, [data-toggle="red"] { background:var(--red) !important; }
[data-color="yellow"], [data-color="yellow"] .ogl_colorButton, [data-toggle="yellow"] { background:var(--yellow) !important; }
[data-color="green"], [data-color="green"] .ogl_colorButton, [data-toggle="green"] { background:var(--green) !important; }
[data-color="blue"], [data-color="blue"] .ogl_colorButton, [data-toggle="blue"] { background:var(--blue) !important; }
[data-color="violet"], [data-color="violet"] .ogl_colorButton, [data-toggle="violet"] { background:var(--violet) !important; }

[data-color="gray"] { opacity:.2 !important; }
[data-color="gray"] .ogl_colorButton, [data-toggle="gray"] { background:var(--white) !important; }
.ogl_colorPicker [data-color="gray"] { background:var(--white) !important;opacity:1 !important; }
.galaxyTable .ctContentRow [data-color="gray"] { background:#0d1014;opacity:1 !important; }
.galaxyTable .ctContentRow [data-color="gray"]:before { background:#0d1014; }
.galaxyTable .ctContentRow [data-color="gray"] > div { opacity:.2 !important; }

[data-color="halfred"], [data-color="halfred"] .ogl_colorButton, [data-toggle="halfred"] { background:repeating-linear-gradient(-45deg, var(--red), var(--red) 5px, #942424 5px, #942424 10px) !important; }
[data-color="halfyellow"], [data-color="halfyellow"] .ogl_colorButton, [data-toggle="halfyellow"] { background:repeating-linear-gradient(-45deg, var(--yellow), var(--yellow) 5px, #947931 5px, #947931 10px) !important; }
[data-color="halfgreen"], [data-color="halfgreen"] .ogl_colorButton, [data-toggle="halfgreen"] { background:repeating-linear-gradient(-45deg, var(--green), var(--green) 5px, #2b8055 5px, #2b8055 10px) !important; }
[data-color="halfblue"], [data-color="halfblue"] .ogl_colorButton, [data-toggle="halfblue"] { background:repeating-linear-gradient(-45deg, var(--blue), var(--blue) 5px, #314a8c 5px, #314a8c 10px) !important; }
[data-color="halfviolet"], [data-color="halfviolet"] .ogl_colorButton, [data-toggle="halfviolet"] { background:repeating-linear-gradient(-45deg, var(--violet), var(--violet) 5px, #5c2e6b 5px, #5c2e6b 10px) !important; }

.ogl_timeZone.ogl_fulldate:before
{
    content:attr(data-datezone);
    position:relative;
    left:-5px;
}

.ogl_timeZone:after
{
    color:hsl(187deg 72% 71%);
    content:attr(data-timezone);
}

.ogl_timeZone:before, .ogl_timeZone:after
{
    display:inline-block;
    font-size:11px !important;
    line-height:1;
}

.ogl_endTime
{
    font-size:10px;
    font-weight:bold;
    margin-top:8px;
    text-align:center;
}

.ogl_endTime, .ogl_fulldate
{
    color:var(--textdate) !important;
}

.ogl_fulldate.ogl_danger,
.ogl_fulldate.ogl_danger.ogl_timeZone:after
{
    color:var(--red) !important;
}

.ogl_endTime span, .ogl_fulldate span
{
    color:var(--texttime) !important;
}

.ogl_ping
{
    color:#aaa;
    font-size:10px;
    font-weight:bold;
    position:absolute;
    right:-14px;
    top:14px;
}

.ogl_danger
{
    color:var(--red);
}

.ogl_warning
{
    color:var(--orange0);
}

.ogl_caution
{
    color:var(--yellow);
}

.ogl_ok
{
    color:var(--green);
}

.ogl_none
{
    color:#41515e;
}

#siteFooter .material-icons
{
    font-size:14px !important;
    vertical-align:middle;
}

#darkmatter_box img
{
    display:none;
}

#chatMsgList .msg_date
{
    position:relative;
    top:6px;
}

.chat_msg .msg_date
{
    position:relative;
    top:3px;
}

.chat_msg .ogl_timeZone:before, .chat_msg .ogl_timeZone:after
{
    font-size:9px !important;
}

#planetbarcomponent #rechts #myPlanets .smallplanet a.alert
{
    bottom:17px !important;
    left:3px !important;
    position:absolute !important;
    top:auto !important;
    z-index:3 !important;
}

#planetbarcomponent #rechts #myPlanets .smallplanet a.constructionIcon,
#planetbarcomponent #rechts #cutty a.constructionIcon,
#planetbarcomponent #rechts #norm a.constructionIcon
{
    bottom:3px !important;
    left:3px !important;
    position:absolute !important;
    top:auto !important;
    z-index:3 !important;
}

#planetbarcomponent #rechts #myPlanets .smallplanet a.constructionIcon.moon,
#planetbarcomponent #rechts #cutty a.constructionIcon.moon,
#planetbarcomponent #rechts #norm a.constructionIcon.moon
{
    left:134px !important;
}

#planetbarcomponent #rechts #myPlanets[data-panel="resources"] .smallplanet a.constructionIcon.moon,
#planetbarcomponent #rechts #cutty[data-panel="resources"] a.constructionIcon.moon,
#planetbarcomponent #rechts [data-panel="resources"] a.constructionIcon.moon
{
    left:96px !important;
}

.smallplanet a.wreckFieldIcon
{
    left:-4px !important;
    top:14px !important;
    z-index:2;
}

[data-multi]::before
{
    border:2px solid #4f8290;
    border-radius:10px;
    border-right:0;
    bottom:-3px;
    content:'';
    display:block;
    height:100%;
    left:-3px;
    position:absolute;
    transform:translateY(-50%);
    width:3px;
    z-index:2;
}

[data-multi="0"]::before { border-color:#00bcd4; }
[data-multi="1"]::before { border-color:#ffeb3b; }
[data-multi="2"]::before { border-color:#009688; }
[data-multi="3"]::before { border-color:#673ab7; }
[data-multi="4"]::before { border-color:#3f51b5; }
[data-multi="5"]::before { border-color:#ff5722; }
[data-multi="6"]::before { border-color:#9c27b0; }
[data-multi="7"]::before { border-color:#ff9800; }
[data-multi="8"]::before { border-color:#4caf50; }
[data-multi="9"]::before { border-color:#e91e63; }
[data-multi="10"]::before { border-color:#ffc107; }

.btn_blue
{
    padding:2px 10px !important;
}

.ogl_button, .btn_blue, #fleet1 .secondcol > *
{
    background:linear-gradient(0deg, #151c22, #232f40) !important;
    border:2px solid var(--p1) !important;
    border-radius:4px !important;
    box-shadow:inset 0 2px #283546 !important;
    box-sizing:border-box !important;
    color:#495c72 !important;
    cursor:pointer !important;
    font-weight:bold !important;
    line-height:20px !important;
    position:relative;
    text-align:center !important;
    text-decoration:none !important;
    text-shadow:-1px 2px var(--p2) !important;
    user-select:none !important;
}

.ogl_button:hover, .btn_blue:hover
{
    filter:brightness(1.3) !important;
}

.ogl_button
{
    line-height:24px !important;
}

.ogl_button .material-icons
{
    font-size:18px !important;
    vertical-align:middle;
}

.ogl_button.ogl_disabled
{
    opacity:.7;
    pointer-events:none;
}

.btn_blue[disabled]
{
    background:hsl(0deg 0% 33%) !important;
    color:hsl(0deg 0% 71%) !important;
    filter:grayscale(1);
}

#galaxyHeader .btn_blue
{
    height:18px !important;
    line-height:14px !important;
    max-width:94px;
    min-width:20px !important;
    overflow:hidden;
    padding:0 2px !important;
    text-overflow:ellipsis;
    white-space:nowrap;
}

/* JUMPGATE
----------------------------*/

#jumpgateForm .ship_selection_table > tbody
{
    background:var(--p1);
}

#jumpgateForm .ship_selection_table .ship_txt_row
{
    padding:0 5px !important;
}

#jumpgateForm .ship_selection_table .ship_txt_row p
{
    padding-bottom:18px;
}

#jumpgateForm .ship_input_row
{
    box-sizing:border-box;
}

#jumpgateForm input
{
    border-radius:3px !important;
    margin-left:3px !important;
    padding:0 5px !important;
    width:64px !important;
}

#jumpgateForm .ogl_delta
{
    background:var(--p3) !important;
    border-radius:2px;
    bottom:3px;
    box-shadow:inset 0 9px var(--p4), 0 0 0 2px var(--p0);
    color:var(--textcyan) !important;
    cursor:pointer;
    font-size:16px;
    height:18px;
    left:40px;
    line-height:18px;
    position:absolute;
    text-align:center;
    text-decoration:none;
    width:40px;
}

#jumpgateForm .ogl_delta:hover
{
    box-shadow:inset 0 0 1px 2px var(--neonborder), inset 0 0 12px 3px var(--neon);;
    color:#fff !important;
}

/* LEFT MENU
----------------------------*/

.ogl_universeName
{
    color:#aeaac1;
    font-size:12px;
    font-weight:bold;
    line-height:12px;
    pointer-events:none;
    position:absolute;
    text-align:right;
    top:92px;
    width:138px;
}

.ogl_universeName div
{
    color:var(--textsand);
    font-size:11px;
}

.ogl_planetsCount
{
    color:var(--gray2);
}

.ogl_planetsCount .material-icons
{
    display:inline-block;
    font-size:15px !important;
    margin-left:3px;
    vertical-align:sub;
}

#tutorialiconcomponent #helper a
{
    transform:scale(.75);
}

#links .menubutton
{
    filter:hue-rotate(-7deg);
    position:relative;
}

#links .menubutton span
{
    color:hsl(208deg 27% 58%);
    position:relative;
}

#links .menubutton.selected span, #links .menubutton:hover span
{
    color:hsl(194deg 66% 93%);
}

#links .menubutton[data-oglupdate="true"] span
{
    color:#ff9109 !important;
}

#links .menubutton.ogl_active span
{
    color:#97dfb0 !important;
    text-shadow:0 0 11px #000 !important;
}

#links .menubutton.ogl_active:after
{
    background:hsl(180deg, 100%, 50%, 15%);
    border-radius:3px;
    bottom:5px;
    box-shadow:inset 0 0 5px 0px hsl(155deg, 100%, 75%, 40%);
    content:'';
    display:block;
    left:6px;
    position:absolute;
    right:7px;
    top:3px;
}

.ogl_stats
{
    background:var(--p2);
    border-radius:var(--uiradius);
    box-shadow:0 0 0 2px #0a0f14;
    box-sizing:border-box;
    font-weight:bold;
    margin:12px 0;
    padding:8px;
    position:relative;
    text-shadow:1px 1px #000;
    width:132px;
    display:none;
}

.ogl_stats .ogl_button
{
    font-size:18px !important;
    height:29px;
    line-height:29px;
    padding:0;
    position:absolute;
    right:-4px;
    top:-2px;
    transform:translateX(100%);
    width:29px;
}

.ogl_stats .ogl_button:nth-of-type(2)
{
    top:29px;
}

.ogl_stats .ogl_button:nth-of-type(3)
{
    top:60px;
}

.ogl_statsDetails h3, .ogl_statsItem
{
    background:#1c2736;
    white-space:nowrap;
}

.ogl_statsDetails
{
    user-select:none;
}

.ogl_statsDetails h3
{
    /*border:2px solid hsl(210deg 26% 24%);*/
    border-radius:4px;
    color:var(--textblue);
    font-size:11px;
    font-weight:bold;
    line-height:25px;
    overflow:hidden;
    padding:0 10px;
    text-overflow:ellipsis;
    text-transform:uppercase;
}

.ogl_statsDetails h3 u
{
    color:#fff;
    text-decoration:none;
}

.ogl_statsDetails h3 u:hover
{
    text-decoration:underline;
}

.ogl_statsDetails > div:last-child
{
    display:flex;
    flex-direction:column;
    justify-content:space-between;
}

.ogl_statsRecap
{
    display:grid;
    grid-gap:14px;
    grid-template-columns:160px 120px 120px 120px 120px;
    margin-top:20px;
}

.ogl_statsRecap > div:first-child
{
    color:var(--textblue);
}

.ogl_statsRecap > div
{
    background:#1c2736 !important;
    /*border:2px solid #0e151c;*/
    border-radius:4px;
    font-size:14px;
    font-weight:bold;
    line-height:36px;
    padding:2px 9px;
    position:relative;
    text-align:center;
    text-shadow:-1px -1px 0 rgba(0,0,0,.3);
}

.ogl_statsRecap > div:nth-child(1) { background:linear-gradient(230deg, #619fdf, #3c2d4e); }
.ogl_statsRecap > div:nth-child(2) { background:linear-gradient(230deg, #3f9dfd, #274189); }
.ogl_statsRecap > div:nth-child(3) { background:linear-gradient(230deg, #2ead84, #194056); }
.ogl_statsRecap > div:nth-child(4) { background:linear-gradient(230deg, #935fe7, #3b2a46); }

.ogl_statsRecap > div div
{
    background:#2c3b50;
    border-radius:10px;
    color:#f76363 !important;
    font-size:10px;
    line-height:10px;
    padding:3px 6px;
    position:absolute;
    right:-1px;
    top:-3px;
}

.ogl_statsTables
{
    display:grid;
}

.ogl_statsColumn
{
    border-radius:8px;
    display:block;
    font-size:11px;
}

.ogl_statsColumn > div
{
    display:grid;
    grid-gap:3px 14px;
    grid-template-columns:160px 120px 120px 120px 120px;
}

.ogl_statsColumn > div:not(:last-child)
{
    margin-bottom:3px;
}

.ogl_shipsArea
{
    display:grid;
    grid-gap:5px;
    grid-template-columns:repeat(5, 1fr);
    margin-bottom:20px;
}

.ogl_statsItem
{
    /*border:2px solid hsl(210deg 26% 24%);*/
    border-radius:4px;
    display:grid;
    font-weight:bold;
    grid-template-columns:40px auto;
    line-height:25px;
    padding:0 8px 0 2px;
    text-align:right;
}

.ogl_statsItem.ogl_newLine
{
    grid-row:6;
}

.ogl_statsItem div
{
    text-indent:4px;
}

.ogl_dateArea > div:nth-child(1)
{
    display:grid;
    grid-gap:4px;
    grid-template-columns:repeat(5, 1fr);
    margin-bottom:5px;
}

.ogl_dateArea > div:nth-child(2)
{
    background:#1c2736;
    border-radius:6px;
    display:grid;
    grid-gap:4px;
    grid-template-columns:repeat(16, 1fr);
    margin:20px 0;
    overflow:hidden;
    padding:10px;
}

.ogl_dateArea > div:nth-child(1) > div
{
    background:#1c2736;
    border-radius:14px;
    color:var(--textblue);
    cursor:pointer;
    font-weight:bold;
    line-height:30px;
    text-align:center;
}

.ogl_dateArea > div:nth-child(1) > div:hover
{
    filter:brightness(1.3);
}

.ogl_dateArea > div > div.ogl_active
{
    color:#b3934b !important;
}

.ogl_dateArea .ogl_button
{
    line-height:21px !important;
}

.ogl_dateArea .ogl_calendarIcon
{
    color:#6e8eaf;
    font-size:22px !important;
    line-height:24px !important;
    opacity:.3;
    text-align:center;
}

.ogl_statsDetails .ogl_calendar
{
    color:var(--textsand);
    overflow:hidden;
    max-width:400px;
    user-select:none;
}

.ogl_statsDetails .ogl_calendar > div
{
    display:grid;
    grid-gap:4px 0;
    grid-template-columns:repeat(7, 1fr);
}

.ogl_dateArea > div:nth-child(2) > div
{
    background:#222f40 !important;
    border:none !important;
    border-radius:14px !important;
    box-shadow:none !important;
    text-shadow:none !important;
}

.ogl_dateArea > div:nth-child(2) > div.ogl_disabled
{
    background:none !important;
    opacity:.3;
    pointer-events:none;
}

.ogl_statsDetails .ogl_calendar .month
{
    display:inline-block;
    font-weight:bold;
}

.ogl_statsDetails .ogl_calendar .cell
{
    color:#fff;
    line-height:26px;
    position:relative;
    text-align:center;
    width:35px;
}

.ogl_statsDetails .ogl_calendar .day
{
    color:var(--textblue);
    font-size:10px;
    font-weight:bold;
    line-height:25px;
}

.ogl_statsDetails .ogl_calendar .ogl_beforeDate
{
    background: linear-gradient(90deg, transparent 60%, var(--textsand));
}

.ogl_statsDetails .ogl_calendar .ogl_firstDate
{
    border-bottom-left-radius:8px;
    border-top-left-radius:8px;
}

.ogl_statsDetails .ogl_calendar .ogl_lastDate
{
    border-bottom-right-radius:8px;
    border-top-right-radius:8px;
}

.ogl_statsDetails .ogl_calendar .cell:not(.day):not(.empty)
{
    cursor:pointer;
}

.ogl_statsDetails .ogl_calendar .cell:not(.day):not(.empty):hover
{
    background:var(--p5);
    color:#fff;
}

.ogl_statsDetails .ogl_calendar .ogl_disabled
{
    opacity:.2;
    pointer-events:none;
}

.ogl_statsDetails .ogl_calendar .ogl_active
{
    background:var(--textsand);
    color:var(--p1);
    font-weight:bold;
}

.ogl_statsDetails .ogl_shipIcon
{
    height:21px;
    margin:auto;
}

.ogl_statsDetails .ogl_statsArea
{
    background:var(--p2);
    border-radius:0 0 var(--uiradius) var(--uiradius);
    padding:10px;
    position:relative;
}

/*.ogl_statsDetails .ogl_statsArea:last-child:before,
.ogl_statsDetails .ogl_statsArea:last-child:after
{
    background:var(--p2);
    border-radius:0 5px 5px 0;
    bottom:41px;
    color:var(--textsand);
    content:'ø / day';
    line-height:21px;
    padding:0 10px;
    position:absolute;
    left:0;
    transform:translateX(-100%);
}

.ogl_statsDetails .ogl_statsArea:last-child:after
{
    bottom:10px;
    content:'ø / day + prod';
}*/

.ogl_statsDetails .ogl_statsArea > h3
{
    color:hsl(208deg 23% 33%);
    font-size:11px;
    font-weight:bold;
    padding:20px 0 14px 0;
    text-align:center;
}

.ogl_statsDetails .ogl_statsArea > div
{
    display:grid;
    grid-gap:5px;
    grid-template-columns:repeat(4, 1fr);
    position:relative;
    z-index:1;
}

.ogl_statsDetails .ogl_statsArea > div > div
{
    background:#0e141a;
    border:2px solid #151f28;
    border-radius:8px;
    display:grid;
    justify-content:center;
    padding:2px 4px;
    text-align:center;
}

.ogl_statsDetails .ogl_statsArea > div > div > div:not(.ogl_shipIcon)
{
    font-size:11px;
}

.ogl_statsDetails .ogl_statsArea .ogl_newLine
{
    grid-row:5;
}

.ogl_dateFilters
{
    bottom:0;
    display:grid;
    grid-auto-flow:column;
    left:0;
    line-height:26px;
    position:absolute;
    user-select:none;
    width:100%;
}

.ogl_dateFilters > div.material-icons
{
    color:var(--textblue);
    pointer-events:none;
    text-decoration:none;
}

.ogl_dateFilters > div
{
    cursor:pointer;
    text-align:center;
    text-decoration:underline;
}

.ogl_dateFilters > div:hover, .ogl_dateFilters > div.ogl_active
{
    color:var(--textsand);
}

.ogl_dateFilters > div.ogl_active
{
    pointer-events:none;
}

.ogl_labelLimit
{
    background:hsl(210deg 27% 18%);
    border-radius:2px;
    box-shadow:0 3px 5px rgba(0,0,0,.8);
    display:block !important;
    font-weight:bold;
    left:-6px;
    padding:3px 5px;
    position:absolute;
    text-shadow:none;
    top:-10px;
    z-index:2;
}

.ogl_labelLimit.tooltipRight
{
    cursor:pointer;
}

.ogl_stats .ogl_date
{
    color:#4f5b73;
    display:block;
    font-size:10px;
    margin-top:5px;
    text-align:right;
}

.ogl_stats h2
{
    margin-bottom:10px;
    text-align:center;
}

.ogl_stats .ogl_0
{
    background:#252d3e;
    font-size:22px !important;
    text-align:center;
}

.ogl_stats .ogl_0:before
{
    color:#fff;
    content:'functions';
}

.ogl_stats > div
{
    color:#a9bbda;
    display:grid;
    font-size:10px;
    grid-template-columns:40px auto;
}

.ogl_stats .ogl_shipIcon, .ogl_sideView .ogl_shipIcon
{
    background-position:center;
    border:none;
    border-radius:0;
    border-right:1px solid #0d1013;
    height:18px !important;
    width:37px !important;
}

.ogl_stats .number
{
    color:var(--yellow);
    font-size:11px;
    line-height:17px;
    padding:0 5px;
    text-align:right;
}

/* DETAILS
----------------------------*/

#technologydetails .ogl_detailAction
{
    display:grid;
    grid-gap:2px;
    grid-template-columns:repeat(4, 1fr);
    left:3px;
    position:absolute;
    right:3px;
    top:3px;
}

#shipyard .ogl_detailAction, #defense .ogl_detailAction
{
    grid-template-columns:repeat(1, 1fr);
}

#technologydetails .costs li.ogl_noMoney
{
    color:var(--red);
}

#technologydetails .costs li.ogl_active
{
    color:var(--green);
}

#technologydetails > .sprite_large:before
{
    background:rgba(92,142,214,.4);
    box-shadow:inset 0 0 56px #000, inset 0 0 0 1px #000;
    content:'';
    height:100%;
    left:0;
    left:0;
    position:absolute;
    top:0;
    width:100%;
}

#technologydetails .technology_tree
{
    border-radius:0 5px 0 0;
}

#technologydetails .ogl_button
{
    color:var(--textcyan);
    font-size:18px !important;
    height:30px;
    line-height:26px !important;
    width:100%;
}

#technologydetails .ogl_detailActions
{
    display:grid;
    grid-gap:4px;
    grid-template-columns:repeat(4, 1fr);
    padding:4px;
}

.ogl_lockBuild.ogl_disabled
{
    opacity:.5;
}

.ogl_lockBuild.ogl_active, .ogl_lockBuild.ogl_active:hover
{
    color:var(--textpremium) !important;
}

#technologydetails h3
{
    background:none !important;
    color:var(--textblue) !important;
    font-size:16px !important;
    text-indent:7px !important;
    top:3px !important;
}

#technologydetails h3::before
{
    display:none !important;
}

#technologydetails > .description
{
    background:var(--p1);
    box-shadow:0 -2px var(--p0);
}

#technologydetails .content
{
    background:linear-gradient(to bottom, var(--p2), var(--p3));
    height:203px !important;
    left:203px !important;
}

#technologydetails .level, #technologydetails .amount
{
    color:#606f8c !important;
    font-size:12px !important;
    font-weight:bold !important;
    left:7px !important;
    top:25px !important;
}

#technologydetails .level i
{
    font-size:20px !important;
    vertical-align:bottom;
}

#technologydetails .level span
{
    color:var(--textpremium);
    font-size:16px;
    vertical-align:bottom;
}

#technologydetails .build_duration strong
{
    display:none;
}

#technologydetails .build_duration
{
    bottom:23px;
    margin:0 !important;
    padding-left:24px;
    position:absolute;
    top:auto;
}

#technologydetails .build_duration:before
{
    color:var(--textpremium);
    content:'hourglass_top';
    font-family:'material icons';
    font-size:21px;
    left:0;
    position:absolute;
    top:8px;
}

#technologydetails .build_duration .ogl_timeZone
{
    font-weight:bold;
    left:29px;
    position:absolute;
    width:230px;
}

#technologydetails .build_duration .bonus
{
    display:none;
}

#technologydetails .possible_build_start
{
    bottom:55px;
    margin:0;
    position:absolute;
    right:10px;
    top:auto;
}

#technologydetails .additional_energy_consumption,
#technologydetails .energy_production
{
    bottom:81px;
    margin:0 !important;
    padding-left:24px;
    position:absolute;
    right:10px;
}

#technologydetails .research_laboratory_levels_sum
{
    bottom:81px;
    margin:0 !important;
    padding-left:24px;
    position:absolute;
    right:10px;
}

#technologydetails .research_laboratory_levels_sum:before
{
    color:var(--textpremium);
    content:'science';
    font-family:'material icons';
    font-size:21px;
    left:0;
    position:absolute;
    top:1px;
}

#technologydetails .additional_energy_consumption:before,
#technologydetails .energy_production:before
{
    color:var(--textpremium);
    content:'flash_on';
    font-family:'material icons';
    font-size:21px;
    left:0;
    position:absolute;
    top:1px;
}

#technologydetails .information .ogl_endTime
{
    display:block;
    margin:0;
}

#technologydetails .costs
{
    font-size:12px !important;
    font-weight:bold !important;
    top:59px !important;
}

#technologydetails .resource.icon
{
    display:block !important;
    height:21px !important;
    line-height:21px !important;
    margin:0 !important;
    width:fit-content !important;
    width:-moz-fit-content !important;
}

#technologydetails .resource.icon::before
{
    display:inline-block !important;
    image-rendering:-webkit-optimize-contrast !important;
    margin:0 5px 0 -24px !important;
    transform:scale(0.5) !important;
    transform-origin:top right !important;
    vertical-align:text-top !important;
}

#technologydetails .costs p
{
    display:none;
}

#technologydetails .bonus
{
    color:var(--green1) !important;
}

/* RIGHT MENU
----------------------------*/

#commandercomponent
{
    margin-right:9px;
}

#planetList
{
    background:var(--p2);
    border-radius:var(--uiradius) var(--uiradius) 0 0;
    box-shadow:0 0 0 2px #0a0f14;
    box-sizing:border-box;
    margin-top:5px;
    padding:5px;
    width:162px !important;
}

.smallplanet
{
    border-radius:0 !important;
    display:grid;
    grid-column-gap:20px;
    grid-template-columns:auto 36px;
    height:auto !important;
    font-size:10px;
    margin:0 0 3px 0!important;
    position:relative !important;
    width:100% !important;
}

.smallplanet *
{
    box-sizing:border-box;
    font-size:inherit !important;
    font-weight:normal !important;
}

.smallplanet img
{
    background:#284563;
    border-radius:50% !important;
    box-shadow:0 0 0 1px #000 !important;
    height:14px;
    left:3px !important;
    margin:0 !important;
    position:absolute !important;
    top:12px !important;
    transition:transform .3s;
    width:14px;
    z-index:2;
}

.smallplanet .planetlink img
{
    top:10px !important;
    height:18px;
    width:18px;
}

.planetlink, .moonlink
{
    background:linear-gradient(225deg, transparent, #212b39);
    background-position:0 !important;
    border:none !important;
    border-radius:5px;
    height:36px !important;
    overflow:hidden;
    position:relative !important;
    transition:box-shadow .3s;
    z-index:1;
}

.planetlink *, .moonlink *
{
    pointer-events:none;
}

.planetlink
{
    background:linear-gradient(155deg, transparent, #212b39);
}

.planetlink:hover, .smallplanet .planetlink.active
{
    background:linear-gradient(155deg, transparent, #384883);
}

.moonlink:hover, .smallplanet .moonlink.active
{
    background:linear-gradient(225deg, transparent, #384883);
}

.smallplanet .planetlink
{
    left:0 !important;
    text-align:left;
    top:0 !important;
}

.smallplanet .moonlink
{
    bottom:0 !important;
    left:0 !important;
    text-align:left;
    top:auto !important;
}

.smallplanet .planet-name,
.smallplanet .planet-koords
{
    left:26px !important;
    position:absolute !important;
}

.smallplanet .planet-koords
{
    color:hsl(208deg 3% 57%) !important;
    letter-spacing:-0.05em;
    top:18px !important;
}

.smallplanet .planet-name
{
    color:hsl(208deg 32% 63%) !important;
    font-weight:bold !important;
    max-width:89px;
    overflow:hidden;
    text-overflow:ellipsis;
    top:5px !important;
}

.ogl_linkedHarvest
{
    height:0;
    margin-bottom:0;
    transform:scale(0) translateY(-60px);
    transition:transform .2s, height .2s, margin .2s;
    width:100%;
}

.ogl_linkedHarvest.ogl_active
{
    font-size:10px !important;
    height:25px;
    margin-top:5px;
    margin-bottom:5px;
    transform:scale(1) translateY(0);
}

.smallplanet .ogl_shortcut
{
    bottom:3px;
    color:var(--textsand);
    font-size:16px !important;
    right:1px;
    pointer-events:none;
    position:absolute;
    transform:scale(0);
    transition:transform .2s;
    z-index:3;
}

.ogl_shortcuts .ogl_shortcut
{
    transform:scale(1);
}

.ogl_shortcuts .smallplanet .ogl_timer
{
    display:none;
}

.ogl_shortcuts .smallplanet a
{
    cursor:crosshair;
}

.ogl_shortcuts[data-panel="resources"] img
{
    transform:translatex(-25px);
}

.ogl_shortcuts .ogl_stock
{
    transform:translatex(-16px);
}

div#banner_skyscraper
{
    transform:translateX(55px) !important;
}

#bannerSkyscrapercomponent
{
    margin-left:180px !important;
}

#pageContent
{
    display:grid;
    grid-gap:0 12px;
    grid-template-columns:150px 670px 180px;
    width:1030px !important;
}

#top, #box, #mainContent
{
    background-repeat:no-repeat;
    grid-column:1 / -1;
}

#rechts
{
    margin:-55px 0 0 0 !important;
}

#right #top, #info, #box, #mainContent,
#rechts, #cutty, #myPlanets, #countColonies,
#planetList, .ogl_resourcesSum, .ogl_keyList
{
    width:100% !important;
}

#planetbarcomponent
{
    width:180px !important;
}

#countColonies
{
    background:var(--p2) !important;
    border-radius:var(--uiradius);
    box-shadow:0 0 0 2px #0a0f14;
    color:transparent !important;
    font-size:10px;
    height:58px !important;
    line-height:20px !important;
    margin:0 !important;
    user-select:none;
}

#countColonies p
{
    display:none;
}

#netz #tabs
{
    padding:6px 16px 0 14px;
}

#netz #alliance ul#tab-ally
{
    display:grid;
    grid-template-columns:repeat(5, 1fr);
}

#alliance #inhalt .tabsbelow li
{
    font-size:11px;
}

.ogl_menuOptions
{
    display:grid;
    font-size:16px;
    grid-gap:2px;
    grid-template-columns:repeat(4, 1fr);
    margin-top:3px;
    overflow:hidden;
    padding:5px;
}

.ogl_menuOptions .ogl_manageData { color:#c54f4f !important; }
.ogl_menuOptions .ogl_harvest { color:#50deec !important; }
.ogl_menuOptions .ogl_shipPicker { color:#e4b633 !important;font-size:11px;font-weight:bold; }
.ogl_menuOptions .ogl_missionPicker3 { color:#c2f75a !important; }
.ogl_menuOptions .ogl_missionPicker4 { color:#43ec77 !important; }

.ogl_menuOptions .ogl_button
{
    line-height:22px !important;
}

.ogl_menuOptions .ogl_button.ogl_active, .ogl_shortcuts .ogl_menuOptions .ogl_harvest.ogl_active
{
    border-color:var(--neonborder) !important;
    box-shadow:inset 0 10px hsl(0deg 0% 100% / 7%), 0 0 5px 0px var(--neon) !important;
}

.ogl_panel
{
    bottom:4px;
    box-sizing:border-box;
    display:grid;
    font-size:12px;
    grid-gap:2px;
    grid-template-columns:repeat(4, 1fr);
    padding:0 5px;
    position:absolute;
    right:0;
    text-align:center;
    width:100%;
}

.ogl_panel > div
{
    cursor:pointer;
    height:20px;
    line-height:16px !important;
}

[data-panel="resources"] .planet-name,
[data-panel="resources"] .planet-koords,
[data-panel="resources"] .ogl_timer,
[data-panel="resources"] .ogl_jumpGateTimer
{
    opacity:0 !important;
    pointer-events:none;
}

[data-panel="resources"] .smallplanet
{
    grid-template-columns:repeat(2, 1fr);
}

[data-panel="resources"] .ogl_stock
{
    display:grid;
}

.ogl_stock
{
    display:none;
    grid-template-rows:repeat(3, 1fr);
    line-height:10px;
    pointer-events:none;
    position:absolute;
    right:5px;
    text-align:right;
    top:4px;
    transition:transform .3s;
}

.ogl_stock > *
{
    font-size:9px !important;
    font-weight:bold !important;
}

.ogl_stock > .ogl_full
{
    color:var(--red) !important;
}

.ogl_prod
{
    grid-template-columns:repeat(4, 1fr) !important;
}

.ogl_mines
{
    font-weight:bold;
}

.ogl_sideLock
{
    bottom:0;
    color:var(--yellow1);
    cursor:pointer;
    font-size:16px !important;
    position:absolute;
    right:-20px;
}

.ogl_sideLock:hover
{
    color:#fff;
}

.planetlink .ogl_timer, .moonlink .ogl_timer
{
    bottom:3px;
    color:var(--red0) !important;
    content:'';
    font-size:11px !important;
    font-weight:bold !important;
    position:absolute;
    right:4px;
}

.ogl_timer[data-timer]:before
{
    content:attr(data-timer);
}

.planetlink .ogl_timer.ogl_medium, .moonlink .ogl_timer.ogl_medium, .ogl_medium
{
    color:var(--yellow0) !important;
}

.planetlink .ogl_timer.ogl_short, .moonlink .ogl_timer.ogl_short, .ogl_short
{
    color:var(--green0) !important;
}

.ogl_resourcesSum
{
    background:var(--p2);
    border-radius:0 0 var(--uiradius) var(--uiradius);
    box-shadow:0 0 0 2px #0a0f14;
    box-sizing:border-box;
    display:grid;
    font-size:11px;
    font-weight:bold;
    grid-template-columns:auto 52px;
    line-height:15px;
    padding:8px;
    position:relative;
    text-align:right;
    text-shadow:1px 1px #000;
    user-select:none;
    width:146px;
}

.ogl_resourcesSum .ogl_loader
{
    border-width:3px;
    height:15px;
    margin:0 0 -4px 3px;
    width:15px;
}

.ogl_resourcesSum > *,
.ogl_resourcesSum .ogl_sub
{
    opacity:1;
    transition:transform .1s;
}

.ogl_resourcesSum.ogl_active > *,
.ogl_resourcesSum.ogl_active .ogl_sub
{
    opacity:0;
    transform:translateX(30px);
}

.ogl_resourcesSum:after
{
    color:#98bfcd;
    content:'chevron_right';
    cursor:pointer;
    font-family:"material icons";
    font-size:24px;
    position:absolute;
    right:-22px;
    top:50%;
    transform:translateY(-50%);
}

.ogl_resourcesSum .ogl_shipIcon
{
    height:20px;
}

.ogl_resourcesSum i
{
    color:hsl(210deg 21% 29%);
    font-size:22px !important;
    left:4px;
    position:absolute;
    bottom:10px;
}

.ogl_resourcesSum .ogl_sub
{
    display:inline-block;
    font-size:9px !important;
    margin-left:4px;
    opacity:.7;
}

.ogl_planetCount .material-icons
{
    font-size:12px !important;
    margin-right:5px;
    vertical-align:bottom;
}

.ogl_resourcesSum .splitLine
{
    margin:4px 0 !important;
}

.ogl_keyList
{
    background:var(--p2);
    border-radius:var(--uiradius);
    box-shadow:0 0 0 2px #0a0f14;
    box-sizing:border-box;
    display:grid;
    grid-gap:5px;
    grid-template-columns:repeat(3, 1fr);
    font-size:11px;
    font-weight:bold;
    margin-bottom:40px;
    margin-top:7px;
    padding:4px;
    position:relative;
    width:162px;
}

.ogl_key
{
    background:linear-gradient(to top left, var(--p3) 45%, var(--p1));
    background-position:0 !important;
    border:none !important;
    border-radius:3px;
    box-shadow:inset 0 1px rgba(255, 255, 255, .07), 0 0 0 2px var(--p1);
    box-sizing:border-box;
    border-radius:5px;
    color:#7790c1;
    cursor:pointer;
    font-size:10px;
    font-weight:bold;
    line-height:24px !important;
    text-align:center;
    width:100%;
}

.ogl_key:hover
{
    background:linear-gradient(to top left, var(--p5) 45%, var(--p3));
    color:#fff;
}

.ogl_planetCount
{
    color:var(--p6);
}

/* TOOLTIP
----------------------------*/

.ogl_tooltip
{
    background:var(--p3);
    border-image:var(--uigradient) 1;
    border-style:solid;
    border-width:2px 0 0 0;
    box-sizing:border-box !important;
    display:block;
    font-size:11px;
    height:auto;
    max-height:600px !important;
    max-width:440px;
    min-width:20px;
    opacity:0;
    overflow:initial !important;
    padding:12px 16px;
    pointer-events:none;
    position:absolute;
    transform-style:preserve-3d;
    width:auto;
    z-index:1000000;
}

.ogl_tooltip.ogl_active
{
    /*animation:show .15s;*/
    opacity:1;
    pointer-events:auto;
}

@keyframes show
{
    0% { opacity:0; }
    50% { opacity:0; }
    100% { opacity:1; }
}

.ogl_close
{
    background:var(--p2);
    border:5px solid var(--p5);
    border-radius:30px;
    color:#bbb;
    cursor:pointer;
    font-size:16px !important;
    padding:2px;
    position:absolute;
    right:-10px;
    top:-10px;
    user-select:none;
    z-index:3;
}

.ogl_tooltip .ogl_close
{
    right:-14px;
    top:-14px;
}

.ogl_close:hover
{
    color:#fff;
}

.ogl_tooltip .ogl_value
{
    color:var(--textpremium);
    font-size:10px;
    font-weight:bold;
}

.ogl_tooltip:before
{
    background:rgba(0, 0, 0, .8);
    bottom:-10px;
    content:'';
    display:block;
    filter:blur(10px);
    left:-10px;
    pointer-events:none;
    position:absolute;
    right:-10px;
    top:-10px;
    transform:translateZ(-1px);
    z-index:-1;
}

.ogl_tooltip:after
{
    background:var(--p3);
    bottom:-5px;
    box-shadow:0 0 10px #000;
    content:'';
    display:block;
    height:12px;
    left:50%;
    pointer-events:none;
    position:absolute;
    transform:translateX(-50%) rotate(45deg) translateZ(-1px);
    width:12px;
    z-index:-1;
}

.ogl_tooltip.ogl_left:after
{
    border:none;
    bottom:auto;
    left:auto;
    margin-top:-8px;
    top:50%;
    transform:rotate(45deg) translateZ(-1px);
    right:-5px;
}

.ogl_tooltip.ogl_right:after
{
    border:none;
    bottom:auto;
    left:-5px;
    transform:rotate(45deg) translateZ(-1px);
    margin-top:-8px;
    top:50%;
}

.ogl_tooltip.ogl_rightTop:after
{
    border:none;
    bottom:auto;
    left:-5px;
    transform:rotate(45deg) translateZ(-1px);
    bottom:14px;
}

.ogl_tooltip.ogl_bottom:after
{
    border:none;
    bottom:auto;
    left:50%;
    top:-5px;
    transform:translateX(-50%) rotate(45deg) translateZ(-1px);
}

.ogl_tooltip > div > div[style*="display: none"],
.ogl_tooltip > div > div[style*="display:none"]
{
    display:block !important;
}

.ogl_tooltip .galaxyTooltip .ogl_actions
{
    display:grid;
    font-family:"Material Icons";
    grid-gap:5px;
    grid-template-columns:repeat(5, 1fr);
    margin:5px 0;
}

.ogl_tooltip .galaxyTooltip .ogl_actions > *
{
    background:var(--p1);
    border:2px solid var(--p1);
    border-radius:3px;
    box-shadow:inset 0 11px rgba(255,255,255,.04);
    box-sizing:border-box;
    color:var(--textcyan);
    cursor:pointer;
    font-size:16px !important;
    line-height:22px !important;
    text-align:center;
    text-decoration:none !important;
    text-shadow:1px 2px var(--p2);
    width:100% !important;
}

.ogl_tooltip .galaxyTooltip .ogl_actions > *:hover
{
    background:var(--p1) !important;
    color:#fff !important;
}

.ogl_tooltip .ogl_stalkInfo
{
    display:grid;
    grid-gap:8px;
    grid-template-columns:auto minmax(min-content, 125px);
    margin:10px 0 10px 0;
}

.ogl_tooltip .ogl_stalkActions
{
    display:grid;
    grid-gap:5px;
    grid-template-columns:repeat(5, 1fr);
}

.ogl_tooltip .ogl_stalkActions .ogl_button
{
    font-size:14px !important;
    margin-bottom:5px;
    width:100%;
}

.ogl_stalkPoints
{
    background:var(--p2);
    border:2px solid var(--p1);
    border-radius:3px;
    color:#bdc1c9;
    display:grid;
    grid-auto-rows:min-content;
    grid-column:2;
    grid-row:1;
    grid-gap:3px;
    padding:5px;
}

.ogl_stalkPoints > div
{
    align-self:end;
    background:var(--p3);
    border-radius:0;
    font-size:10px;
    font-weight:bold;
    line-height:18px;
    grid-template-columns:min-content auto;
    padding:2px 8px 2px 28px;
    position:relative;
    text-align:right;
    white-space:nowrap;
}

.ogl_stalkPoints > div i
{
    font-size:16px !important;
    position:absolute;
    left:3px;
}

.ogl_stalkPoints > div:nth-child(1) { color:var(--global); }
.ogl_stalkPoints > div:nth-child(2) { color:var(--economy); }
.ogl_stalkPoints > div:nth-child(3) { color:var(--techs); }
.ogl_stalkPoints > div:nth-child(4) { color:var(--fleet); }
.ogl_stalkPoints > div:nth-child(5) { color:var(--def); }

.ogl_stalkPoints > div:nth-child(1):before
{
    background-position:0 -3px;
}

.ogl_stalkPoints > div:nth-child(2):before
{
    background-position:100% -3px;
}

.ogl_stalkPoints > div:nth-child(3):before
{
    background-position:80% -3px;
}

.ogl_stalkPoints > div:nth-child(4):before
{
    background-position:60% -3px;
}

.ogl_stalkPoints > div:nth-child(5):before
{
    background-position:60% -3px;
    filter:hue-rotate(27deg) brightness(1.75);
}

.ogl_stalkPoints > div:nth-child(6):before
{
    background-position:60% -3px;
    filter:hue-rotate(67deg) brightness(1.75);
}

.ogl_tooltip .ogl_stalk
{
    color:var(--textcyan);
}

.ogl_tooltip .ogl_stalk .float_right, .ogl_tooltip .ogl_stalk .float_left
{
    font-weight:bold;
}

.ogl_actionsContainer
{
    display:grid;
    grid-gap:5px;
    grid-template-columns:repeat(4, 1fr);
    margin-top:5px;
}

.ogl_actionsContainer .material-icons
{
    font-size:18px !important;
}

.ogl_stalkPlanets [data-multi]:before
{
    height:calc(100% + 2px);
}

.ogl_stalkPlanets .ogl_mainPlanet
{
    color:var(--textpremium);
    position:relative;
    margin-left:2px;
    z-index:1;
}

.ogl_tooltip .ogl_stalkPlanets
{
    background:var(--p2);
    border:2px solid var(--p1);
    border-radius:5px;
    box-sizing:border-box;
    display:grid;
    grid-auto-rows:min-content;
    grid-gap:5px;
    max-height:300px;
    padding:5px 15px;
    overflow-x:hidden;
    overflow-y:auto;
    overscroll-behavior:none;
    width:100%;
}

.ogl_tooltip .ogl_stalkPlanets > div
{
    background:var(--p6);
    box-shadow: 0 0 5px #000;
    color:#fff;
    font-weight:bold;
    grid-gap:5px;
    padding:6px 5px 8px 5px;
    position:relative;
    width:120px;
}

.ogl_tooltip .ogl_stalkPlanets > div:after
{
    background:hsl(210deg 27% 15%);
    content:'';
    height:25px;
    left:0;
    position:absolute;
    top:0;
    width:100%;
}

.ogl_tooltip .ogl_stalkPlanets > div > span
{
    cursor:pointer;
    position:relative;
    z-index:1;
}

.ogl_tooltip .ogl_stalkPlanets > div > span:hover
{
    color:var(--textsand);
    text-decoration:underline;
}

.ogl_tooltip .ogl_stalkPlanets .ogl_planetIcon,
.ogl_tooltip .ogl_stalkPlanets .ogl_moonIcon
{
    color:var(--textblue);
    cursor:pointer;
    font-size:18px !important;
    position:absolute;
    right:5px;
    top:4px;
    z-index:1;
}

.ogl_tooltip .ogl_stalkPlanets .ogl_planetIcon
{
    right:25px;
}

.ogl_tooltip .ogl_stalkPlanets .ogl_moonIcon
{
    opacity:.2;
    pointer-events:none;
}

.ogl_tooltip .ogl_stalkPlanets .ogl_moonIcon.ogl_active
{
    opacity:1;
    pointer-events:auto;
}

.ogl_tooltip .ogl_stalkPlanets .ogl_planetIcon:hover,
.ogl_tooltip .ogl_stalkPlanets .ogl_moonIcon:hover
{
    color:var(--textsand);
}

.galaxyTooltip.ogl_stalk h1
{
    margin-bottom:10px !important;
}

.galaxyTooltip .ListImage
{
    background:var(--p4);
    border:2px solid var(--p5);
    border-radius:5px;
    padding:6px;
    text-align:center;
    width:75px;
}

.galaxyTooltip .ListImage > li > *
{
    margin:auto;
}

.galaxyTooltip .ListLinks
{
    border-radius:5px;
    padding:6px;
    min-width:100px;
    width:auto !important;
}

.htmlTooltip h1, .galaxyTooltip h1
{
    text-align:center;
    margin-bottom:20px !important;
}

.htmlTooltip h1 span, .galaxyTooltip h1 span
{
    color:var(--textcyan);
    font-size:14px;
    font-weight:bold;
}

.galaxyTooltip h1 a
{
    font-size:11px;
    font-weight:bold;
}

.ogl_ranking
{
    font-size:12px !important;
    margin-left:5px;
}

.ogl_ranking, .ogl_ranking a
{
    color:var(--textsand) !important;
    text-decoration:none !important;
}

.ogl_ranking:hover, .ogl_ranking:hover a
{
    color:#fff !important;
}

.ogl_colors
{
    display:grid;
    grid-gap:2px;
    grid-template-columns:repeat(12, 1fr);
    margin:6px 0 14px 0;
    width:100%;
}

.ogl_colorAll
{
    margin:10px 0;
}

.ogl_colorAll .ogl_colors
{
    margin:0;
}

.ogl_colorAll .ogl_colors > *
{
    border:none;
    border-radius:65px;
}

.ogl_colorAll .ogl_colors > *:hover
{
    transform:scale(1.2);
}

.ogl_colorAll div[data-color="none"]
{
    background:var(--p2);
}

.ogl_colors > *
{
    border:2px solid var(--p2);
    border-radius:3px;
    box-sizing:border-box;
    cursor:pointer;
    font-size:10px !important;
    height:18px;
    position:relative;
    transition:all .2s;
    width:100%;
}

.ogl_colors > *:hover
{
    filter:brightness(1.2);
    transform:scale(1.25);
    z-index:3;
}

.ogl_colorAll .ogl_colors > *
{
    width:100%;
}

.ogl_colorAll div[data-color="gray"]
{
    background:var(--white);
    opacity:1 !important;
}

.ogl_colorAll div[data-color="none"]
{
    border-color:var(--p5);
}

.ogl_colorAll div[data-color="none"]:before
{
    border-radius:inherit;
    content:'clear';
    display:block;
    font-family:'material icons';
    font-size:10px;
    height:100%;
    left:0;
    line-height:18px;
    position:absolute;
    text-align:center;
    top:0;
    width:100%;
}

.ogl_colorAll.ogl_tooltipColor div[data-color="none"]:before
{
    line-height:20px;
}

.ogl_tooltipColor .ogl_colors
{
    display:grid;
    grid-template-columns:repeat(2, 1fr);
    margin:0 !important;
}

.ogl_tooltipColor .ogl_colors > *
{
    height:20px !important;
    width:30px !important;
}

.ogl_choseCapacityAll
{
    color:var(--textpremium) !important;
    margin-right:5px;
    text-transform:none !important;
}

.ogl_choseCapacity > div
{
    display:grid;
    grid-template-columns:40px auto;
    margin-bottom:4px;
}

.ogl_choseCapacity .ogl_shipIcon
{
    border-color:var(--p6);
    border-radius:0;
    border-right:none;
    color:#ffc729 !important;
    cursor:pointer;
    font-size:22px !important;
    height:26px;
    text-align:center;
    text-shadow:0 0 5px #000;
}

.ogl_choseCapacity .ogl_shipIcon:hover
{
    color:#ffdd61 !important;
}

.ogl_choseCapacity button,
.ogl_resourceToKeep button
{
    color:var(--green1);
    float:right;
    font-weight:bold;
    text-transform:uppercase;
}

.ogl_choseCapacity h2
{
    color:var(--textcyan);
    font-weight:bold;
    margin-bottom:20px;
    text-align:center;
}

.ogl_choseCapacity input
{
    border-radius:0 3px 3px 0 !important;
    box-shadow:0 0 0 1px #000 !important;
    height:22px !important;
    padding:0 5px !important;
    text-align:right;
    width:140px !important;
}

.ogl_tooltip .ogl_metal, .ogl_tooltip .ogl_crystal, .ogl_tooltip .ogl_deut, .ogl_tooltip .ogl_food
{
    display:inline-block;
    font-size:10px !important;
    font-weight:bold !important;
    border-radius:3px;
}

.ogl_tooltip .ogl_metal .value, .ogl_tooltip .ogl_crystal .value, .ogl_tooltip .ogl_deut .value, .ogl_tooltip .ogl_food .value
{
    font-size:10px !important;
    font-weight:bold !important;
}

.ogl_inFlightTable, table.fleetinfo:not(.ogl_ignored) tbody
{
    display:grid;
    grid-gap:3px;
    grid-template-columns:repeat(4, 1fr);
}

.ogl_inFlightTable tr:not(.ogl_full), table.fleetinfo:not(.ogl_ignored) tr
{
    background:var(--p2);
    border-radius:4px;
}

.ogl_inFlightTable .value, table.fleetinfo:not(.ogl_ignored) td.value
{
    display:table-cell !important;
    padding:3px 7px;
}

.ogl_inFlightTable .ogl_shipIcon, table.fleetinfo .ogl_shipIcon
{
    background-position:center;
    display:table-cell !important;
    height:20px !important;
    width:36px !important;
}

.ogl_inFlightTable .ogl_full, table.fleetinfo:not(.ogl_ignored) .ogl_full
{
    grid-column:1 / -1;
    height:7px;
    padding:0;
    visibility:hidden;
}

table.fleetinfo:not(.ogl_ignored) tr.ogl_metal, .ogl_inFlightTable tr.ogl_metal { background:hsl(240deg 14% 18%) !important; }
table.fleetinfo:not(.ogl_ignored) tr.ogl_crystal, .ogl_inFlightTable tr.ogl_crystal { background:hsl(205deg 45% 18%) !important; }
table.fleetinfo:not(.ogl_ignored) tr.ogl_deut, .ogl_inFlightTable tr.ogl_deut { background:hsl(170deg 32% 18%) !important; }
table.fleetinfo:not(.ogl_ignored) tr.ogl_food, .ogl_inFlightTable tr.ogl_food { background:hsl(321deg 23% 16%) !important; }

table.fleetinfo .fleetDetailsName
{
    box-sizing:border-box;
    color:#bba862;
    justify-self:center;
    grid-column:1 / 3;
    max-width:70px;
    overflow:hidden;
    padding:0 5px;
    text-align:center;
    text-overflow:ellipsis;
    white-space:nowrap;
    width:100%;
}

.ogl_shipData
{
    min-width:120px;
}

.ogl_shipData h3
{
    color:var(--textcyan);
    font-weight:bold;
    text-align:center;
}

.ogl_shipData span
{
    color:var(--textsand);
    float:right;
    font-weight:bold;
}

.ogl_economy
{
    border:2px solid var(--p1);
    border-bottom:0;
    border-radius:5px;
}

.ogl_economy .ogl_total
{
    background:var(--p1);
    padding:10px 12px;
}

.ogl_economy > div:not(.ogl_total):hover
{
    box-shadow:inset 0 0 12px 3px var(--neon);
    cursor:pointer;
}

.ogl_economy .ogl_total .ogl_metal > div,
.ogl_economy .ogl_total .ogl_crystal> div,
.ogl_economy .ogl_total .ogl_deut > div
{
    display:inline-block;
    text-align:center;
}

.ogl_economy .ogl_total b
{
    font-size:16px;
}

.ogl_economy > div
{
    background:var(--p2);
    border-bottom:2px solid var(--p1);
    display:grid;
    grid-template-columns:auto 120px 120px 120px;
    font-size:10px;
    padding:1px 12px 2px 12px;
    position:relative;
    text-align:right;
}

.ogl_economy > div b
{
    display:inline-block;
    font-size:12px;
    margin:1px 0;
}

.ogl_economy > div i
{
    display:inline-block;
    font-size:10px;
    position:relative;
    opacity:.7;
    text-align:left;
    text-indent:4px;
    top:-1px;
    vertical-align:bottom;
    width:64px;
}

.ogl_economy > div h3
{
    color:#fff;
    font-size:10px;
    margin:2px 0;
    text-align:left;
}

.ogl_economy > div h3 span
{
    color:#969696;
    display:inline-block;
    width:65px;
}

.ogl_blackHole
{
    border-radius:5px;
    display:grid;
    grid-gap:7px 20px;
    grid-template-columns:repeat(4, 1fr);
}

.ogl_blackHole > div
{
    display:grid;
    grid-template-columns:40px 120px;
    position:relative;
}

.ogl_blackHole .ogl_shipIcon
{
    background-position:center;
    border-radius:4px 0 0 4px !important;
    height:26px;
}

.ogl_blackHole input
{
    border-radius:0 4px 4px 0 !important;
    bottom:0;
    box-shadow:none !important;
    height:22px !important;
    line-height:22px !important;
    top:0;
}

.ogl_chartArea
{
    align-items:center;
    background:#1c2736;
    border:2px solid hsl(208deg 29% 16%);
    border-radius:6px;
    display:grid;
    grid-gap:20px;
    grid-template-columns:125px auto;
    margin-bottom:20px;
    padding:14px;
}

.ogl_pie
{
    background:rgba(255,255,255,.1);
    border-radius:50%;
    display:block;
    height:110px;
    position:relative;
    text-align:center;
    transform:rotate(-90deg);
    width:110px;
}

.ogl_pie:before
{
    background:#1c2736;
    border-radius:50%;
    content:'';
    height:1px;
    left:50%;
    padding:25%;
    position:absolute;
    top:50%;
    transform:translate(-50%, -50%);
    width:1px;
}


.ogl_pieLabel, .ogl_pieItems
{
    position:relative;
    z-index:1;
}

.ogl_pieLabel
{
    background:#222f40;
    border-radius:4px;
    box-sizing:border-box;
    color:var(--textblue);
    display:block;
    padding:10px;
    white-space:nowrap;
    width:100%;
}

.ogl_pieLabel > span
{
    display:grid;
    font-weight:bold;
    grid-gap:6px;
    grid-template-columns:15px 120px 50px 50px;
    margin:4px;
}

.ogl_pieLabel > span > span
{
    overflow:hidden;
    text-overflow:ellipsis;
}

.ogl_pieLabel > span > span:last-child
{
    color:#fff;
}

.ogl_pieLabel > span b
{
    color:var(--textgold);
    text-align:right;
}

.ogl_pieLabel > div span:last-of-type
{
    color:#fff;
}

.ogl_pieLabel > div b
{
    opacity:.7;
    text-align:right;
}

.ogl_pieLabel > div > div
{
    border-radius:50%;
    display:inline-block;
    height:10px;
    margin-top:3px;
    width:10px;
}

/* POPUP
----------------------------*/

.ogl_overlay, .ogl_popup
{
    display:none;
}

.ogl_overlay.ogl_active
{
    align-items:center;
    background:rgba(0,0,0,.7);
    display:flex;
    justify-content:center;
    left:0;
    position:fixed;
    top:0;
    height:100%;
    width:100%;
    z-index:10000;
}

.ogl_popup.ogl_active
{
    background:var(--p3);
    border-radius:0 0 3px 3px;
    border-top:3px solid;
    border-image:var(--uigradient) 1;
    box-shadow:0 0 16px 2px #000;
    display:block;
    position:relative;
}

.ogl_popup.ogl_active.ogl_cleaned
{
    background:none;
    border:none;
    box-shadow:none;
}

.ogl_popup.ogl_active.ogl_cleaned .ogl-loader
{
    background:none;
}

.ogl_popup.ogl_active.ogl_cleaned .ogl_close
{
    display:none;
}

.ogl_popup.ogl_active > div:not(.ogl_close)
{
    box-sizing:border-box;
    max-height:calc(90vh - 40px);
    overflow-x:hidden;
    overflow-y:auto;
}

.ogl_popup.ogl_active > div:not(.ogl_close) > div:first-child:not(.ogl_loader)
{
    padding:25px;
}

.ogl_popup.ogl_active img
{
    border:2px dashed #303d4e;
    border-radius:5px;
    display:block;
    margin:20px;
}

.ogl_popup.ogl_active input
{
    height:16px;
    width:120px;
}

.ogl_planetList .ogl_linkedMoon
{
    margin-bottom:10px;
}

.ogl_planetList .ogl_button
{
    width:100%;
}

.ogl_planetList div[data-coords]
{
    background:var(--p2);
    border:2px solid var(--p1);
    border-width:2px 2px 0 2px;
    display:grid;
    font-size:11px;
    grid-gap:10px;
    grid-template-columns:180px auto;
    line-height:25px;
    padding:2px 5px;
    position:relative;
    white-space:nowrap;
}

.ogl_planetList div[data-coords]:nth-child(2)
{
    border-radius:6px 6px 0 0;
}

.ogl_planetList div[data-coords]:last-child
{
    border-bottom:2px solid var(--p1);
    border-radius:0 0 6px 6px;
}

.ogl_planetList .ogl_coords
{
    display:grid;
    grid-template-columns:70px auto;
    overflow:hidden;
}

.ogl_planetList .ogl_coords b
{
    color:var(--textgold);
}

.ogl_planetList .ogl_actions
{
    color:var(--textblue);
    display:grid;
    grid-gap:10px;
    grid-template-columns:repeat(2, 1fr);
}

.ogl_planetList .ogl_actions .ogl_planet
{
    cursor:pointer;
    font-size:17px !important;
    line-height:21px !important;
    width:33px !important;
}

.ogl_planetList .ogl_actions .ogl_planet:hover
{
    color:var(--textsand);
}

.ogl_planetList .ogl_actions .ogl_planet.ogl_disabled
{
    background:hsl(354deg 23% 14%) !important;
    color:var(--red2) !important;
    opacity:.5;
    pointer-events:none;
}

.ogl_lockedIcon
{
    color:var(--textpremium);
    bottom:-2px;
    cursor:pointer;
    font-size:15px !important;
    position:absolute;
    right:-20px;
}

.ogl_lockedIcon.ogl_ok
{
    color:var(--green);
}

.ogl_lockedIcon:hover
{
    color:#fff;
}

.ogl_lockInfo
{
    width:auto;
}

.ogl_lockInfo hr
{
    border:none;
    grid-column:1 / 6;
    height:24px;
    margin:0;
    width:100%;
}

.ogl_lockLine
{
    align-items:center;
    background:var(--p2);
    border:2px solid var(--p1);
    box-shadow:inset 0 43px var(--p1), inset 0 -43px var(--p1);
    display:grid;
    font-size:12px;
    grid-gap:2px 0;
    grid-template-columns:auto 140px 140px 140px 130px;
    justify-items:flex-end;
    overflow:hidden;
    padding:8px;
    white-space:nowrap;
}

.ogl_lockLine:nth-child(1)
{
    margin-bottom:10px;
}

.ogl_lockLine > div
{
    align-self:normal;
    height:25px;
    line-height:25px;
    padding:0 8px;
    text-align:right;
}

.ogl_lockInfo .ogl_type
{
    text-align:left;
}

.ogl_lockLine .ogl_shipIcon
{
    border-color:var(--p6);
    height:28px;
    margin:-1px 0 0 auto;
    padding:0 5px;
}

.ogl_lockLine .material-icons
{
    font-size:16px !important;
}

.ogl_lockLine .ogl_button
{
    margin-left:3px;
    padding:0 5px;
}

.ogl_lockLine .ogl_ok.material-icons
{
    font-size:22px !important;
    margin-left:5px;
    vertical-align:middle;
}

.ogl_lockLine .ogl_delete
{
    cursor:pointer;
}

.ogl_fullGrid
{
    grid-column-end:-1;
    grid-column-start:1;
}

.ogl_lockPopup
{
    display:grid;
    grid-gap:20px;
}

.ogl_lockedContainer
{
    align-items:center;
    display:grid;
    grid-gap:5px;
    grid-template-columns:400px 80px 120px 120px 120px 40px 40px 40px;
    line-height:24px;
}

.ogl_lockedContainer .ogl_header
{
    grid-row-start:1;
}

.ogl_lockedContainer .ogl_button
{
    border-left:none;
    border-radius:0;
    box-shadow:inset 0 14px rgb(255 255 255 / 7%);
    height:32px;
    line-height:28px !important;
    font-size:16px !important;
    padding:0;
    text-align:center;
    width:100%;
}

.ogl_lockedContainer .ogl_button.ogl_disabled
{
    background:#2c2c2c !important;
    color:#545454;
    pointer-events:none;
    opacity:.5;
}

.ogl_mineContainer
{
    align-items:center;
    display:grid;
    grid-gap:7px;
    grid-template-columns:auto auto auto auto auto auto auto;
    line-height:24px;
    user-select:none;
}

.ogl_mineContainer > *, .ogl_lockedContainer > *
{
    background:#1c2736;
    border-radius:4px;
    padding:0 16px;
    white-space:nowrap;
}

.ogl_mineContainer .material-icons, .ogl_lockedContainer .material-icons
{
    color:var(--textblue);
    cursor:pointer;
    font-size:16px !important;
    padding:0;
    text-align:center;
}

.ogl_mineContainer .material-icons:hover, .ogl_lockedContainer .material-icons:hover
{
    color:var(--textsand);
}

.ogl_mineContainer .ogl_header, .ogl_lockedContainer .ogl_header
{
    background:#202d3e;
}

.ogl_mineContainer b.ogl_header
{
    color:var(--textblue);
    font-size:15px;
    font-weight:bold;
    text-align:right;
}

.ogl_mineContainer span, .ogl_lockedContainer span
{
    color:var(--textblue);
    font-size:11px;
    font-weight:bold;
    overflow:hidden;
    position:relative;
    text-align:left;
    text-overflow:ellipsis;
}

.ogl_mineContainer span[data-multi], .ogl_lockedContainer span[data-multi]
{
    overflow:visible;
}

.ogl_lockedContainer span.ogl_header
{
    color:#fff;
}

.ogl_mineContainer i, .ogl_lockedContainer i
{
    color:var(--textblue);
    font-size:11px;
    font-weight:normal;
}

.ogl_mineContainer strong, .ogl_lockedContainer strong
{
    color:#fff;
}

.ogl_mineContainer b, .ogl_lockedContainer b
{
    display:inline-block;
    font-size:12px;
    text-align:left;
}

.ogl_mineContainer div
{
    float:right;
    font-size:9px;
    margin-left:15px;
    opacity:.5;
    font-style:italic;
}

/* OVERVIEW
----------------------------*/

.ogl_storage
{
    background:rgba(0,0,0,.8);
    border-top:1px solid #000;
    color:var(--yellow2);
    display:none;
    font-size:9px;
    font-weight:bold;
    height:32px;
    line-height:14px;
    padding-top:4px;
    pointer-events:none;
    position:absolute;
    top:14px;
    width:49px;
}

#resourcesbarcomponent:hover .ogl_storage
{
    display:block;
}

#resourcesbarcomponent #resources .value
{
    font-weight:bold;
}

#resourcesbarcomponent *
{
    pointer-events:none;
}

#resourcesbarcomponent #darkmatter_box a,
#resourcesbarcomponent [class*="tooltip"]
{
    pointer-events:all;
}

#overviewcomponent #planetdata
{
    bottom:47px;
    position:absolute !important;
    right:0;
}

.ogl_hiddenCopy
{
    left:-10000px;
    position:fixed;
    top:-10000px;
    z-index:-1;
}

/* GALAXY
----------------------------*/

.galaxyTable, #galaxytable
{
    background:#0d1014;
    border-collapse:collapse;
}

#galaxyLoading:after
{
    background:rgba(0,0,0,.7);
    border-radius:8px;
    content:attr(data-currentposition);
    font-size:13px;
    font-weight:bold;
    left:50%;
    padding:5px;
    position:absolute;
    top:50%;
    transform:translate(-50%, -50%);
}

#galaxyheadbg2
{
    border-left:none;
    border-right:none;
    display:grid;
    grid-template-columns:66px 140px 35px 50px auto 80px 90px;
    line-height:25px;
    width:auto;
}

#galaxyheadbg2 > th
{
    width:100% !important;
}

.galaxyTable .ctContentRow:not([class*="filtered_"]), .ogl_spyTable tr,
#galaxytable .row:not([class*="filtered_"])
{
    height:30px;
    opacity:1;
    position:relative;
}

.galaxyTable .ctContentRow:not(.bdaySlot):before,
#galaxytable .row:not(.bdaySlot):before
{
    background:linear-gradient(to right, rgba(23,31,41,.6) 10px, rgba(23,31,41,.96) 200px);
    content:'';
    height:33px;
    left:0;
    position:absolute;
    width:100%;
}

.galaxytable .expeditionDebrisSlot:before,
#galaxytable .expeditionDebrisSlot:before
{
    height:64px;
}

.galaxyTable .ctContentRow > div,
#galaxytable .row > div
{
    background:none !important;
    border-radius:0;
    box-shadow:inset 1px 0 rgba(255,255,255,.03), inset -1px 0 rgba(0,0,0,.5), inset 0 1px rgba(255,255,255,.03), inset 0 -1px rgba(0,0,0,.5);
    filter:brightness(100%) !important;
    font-size:11px;
    font-weight:normal;
    line-height:17px !important;
    padding:0 5px;
    text-shadow:1px 1px var(--p1);
    transition:background .2s;
    white-space:nowrap;
    z-index:10;
}

.galaxyTable .ctContentRow .cellPlanetName span
{
    margin-right:auto;
    max-width:90px;
    overflow:hidden;
    text-align:left;
    text-overflow:ellipsis;
}

.galaxyTable .ctContentRow[class*="filtered_filter_"]:not([data-color]):before,
#galaxytable .row[class*="filtered_filter_"]:not([data-color]):before
{
    background:#0d1014;
}

.galaxyTable .ctContentRow[class*="filtered_filter_"]:not([data-color]) td
{
    opacity:.2;
}

.galaxyTable .ctContentRow *
{
    white-space:nowrap;
}

.galaxyTable .ctContentRow .cellPlayerName span[class*="status_"]
{
    cursor:pointer;
}

.galaxyTable .ctContentRow .cellPlayerName span:hover
{
    text-decoration:underline;
}

.galaxyTable .ctContentRow .cellPlayerName .float_right
{
    color:var(--textsand);
    margin-left:auto;
    text-decoration:none;
}

.galaxyTable .phalanxlink, .galaxyTable .phalanxInctive
{
    margin-right:36px !important;
}

.galaxyTable .galaxyRow .galaxyCell.cellPlayerName > span:not(.ownPlayerRow)
{
    cursor:pointer;
    display:inline-block;
    max-width:70px;
    overflow:hidden;
    margin-right:4px;
    text-overflow:ellipsis;
}

#galaxytable tr.row
{
    display:grid;
    grid-gap:3px;
    grid-template-columns:22px 40px 162px 38px 38px 162px 70px 101px;
    height:33px !important;
    margin-bottom:2px;
}

#galaxytable tr.row:last-child
{
    margin:0;
}

#galaxytable .moon, #galaxytable .moon_a
{
    background-size:100%;
    filter:brightness(100%);
    margin:1px 3px;
}

#galaxytable tr.row td
{
    background:none !important;
    box-shadow:inset 1px 0 rgb(255 255 255 / 3%), inset -1px 0 rgb(0 0 0 / 50%), inset 0 1px rgb(255 255 255 / 3%), inset 0 -1px rgb(0 0 0 / 50%);
    box-sizing:border-box;
    height:33px !important;
    line-height:33px !important;
    margin:0 !important;
    position:relative;
    width:100% !important;
}

#galaxytable div.activity
{
    border:none !important;
    border-radius:2px !important;
    box-shadow:0 0 3px 1px rgba(0,0,0,.7);
    color:#000 !important;
    font-size:11px !important;
    font-weight:bold !important;
    height:14px !important;
    line-height:14px !important;
    margin-left:-5px !important;
    margin-top:-2px !important;
    padding:0 !important;
    text-align:center !important;
    width:20px !important;
    z-index:10;
}

#galaxytable div.activity.minute15
{
    background:#b70000 !important;
    line-height:18px !important;
    width:14px !important;
}

#galaxytable div.activity.minute15:before
{
    content:'*';
    color:#fff;
    line-height:15px;
}

#galaxytable div.activity.minute60
{
    display:none !important;
}

#galaxytable div.activity.showMinutes
{
    background:#ffa800 !important;
}

#galaxytable .planetname img
{
    height:16px;
    position: absolute;
    right:43px;
    top:8px;
    width:16px;
}

#galaxytable td.playername
{
    width:240px;
}

#galaxytable .playername .float_right,
#galaxytable .playername .float_right a
{
    color:var(--textgold);
}

#galaxytable .ListImage .planetTooltip, #galaxytable tr.row td.moon img
{
    margin-left:-5px;
}

#galaxytable td.moon
{
    width:30px;
}

#galaxytable tr.row td.planetname, #galaxytable tr.row td.planetname1
{
    text-align:left;
    text-indent:10px;
}

#galaxytable tr td.action
{
    padding-top:3px !important;
}

#galaxytable tr td.playername
{
    padding:0 5px !important;
}

#galaxytable tr td.playername span[class^="status_"]
{
    cursor:pointer;
}

#galaxytable tr td.playername span[class^="status_"]:hover
{
    text-decoration:underline;
}

#galaxytable .playername a
{
    display:inline-block;
    max-width:72px;
    overflow:hidden;
    text-overflow:ellipsis;
    vertical-align:unset;
    white-space:nowrap;
}

#galaxytable tr.row td span.status
{
    margin-left:-2px !important;
    vertical-align:top !important;
}

#galaxytable .playername .honorRank
{
    margin:2px 0 0 -1px !important;
    pointer-events:none;
    position:relative;
    top:6px;
    vertical-align:top;
}

.status_abbr_longinactive
{
    color:#616161!important;
}

.status_abbr_inactive
{
    color:#989898!important;
}

#galaxytable .playername
{
    text-align:left;
}

#galaxytable .activity,
#galaxytable .fleetAction
{
    pointer-events:none;
}

.galaxyTable .cellDebris
{
    text-align:center;
}

.galaxyTable .microdebris,
#galaxytable .debrisField
{
    background:none !important;
    color:#fff;
    font-size:10px;
    left:0;
    line-height:14px;
    padding:0;
    position:absolute;
    white-space:nowrap;
    width:100% !important;
}

.galaxyTable .cellDebris.ogl_active,
#galaxytable .debris.ogl_active
{
    background:#ad5b21 !important;
    opacity:1 !important;
}

#galaxytable .debris.ogl_active a
{
    color:#fff !important;
    padding-top:1px;
}

#galaxytable td.debris a
{
    font-size:10px;
    line-height:14px;
    text-decoration:none;
    width:100% !important;
    white-space:nowrap;
}

.expeditionDebrisSlot
{
    background:var(--p3);
}

.expeditionDebrisSlot:before
{
    display:none;
}

.expeditionDebrisSlotBox
{
    align-items:center;
    background:none !important;
    border:none !important;
    box-shadow:none !important;
    display:grid !important;
    grid-template-columns:20% auto auto auto !important;
    margin:6px 0 5px 0 !important;
    padding:4px 0 5px 0 !important;
    width:642px !important;
}

.expeditionDebrisSlotBox li
{
    list-style:none;
}

.expeditionDebrisSlotBox > img
{
    float:right;
    justify-self:center;
}

.expeditionDebrisSlotBox > div
{
    line-height:1.6;
    text-align:left;
}

.expeditionDebrisSlotBox a
{
    color:var(--green1);
}

.expeditionDebrisSlotBox a:hover
{
    text-decoration:underline;
}

#galaxytable .status_abbr_ally_own
{
    color:hsl(140deg 47% 46%) !important;
}

.galaxyTooltip h1
{
    margin:0 !important;
}

/* SIDEVIEW
----------------------------*/

.ogl_sideView
{
    background:var(--p3);
    bottom:0;
    box-sizing:border-box;
    padding:50px 20px 40px 20px;
    position:fixed;
    top:0;
    transition:transform .3s;
    transform:translateX(100%);
    right:0;
    user-select:none;
    width:300px;
    z-index:10000;
}

.ogl_sideView.ogl_opened
{
    transition:none;
}

.ogl_sideView.ogl_active
{
    box-shadow:0 0 10px #000;
    transform:translateX(0%);
}

.ogl_sideView .ogl_close
{
    right:20px;
    top:10px;
}

.ogl_sideView .ogl_loader
{
    left:calc(50% - 65px);
    position:absolute;
    top:calc(50% - 65px);
}

.ogl_sideView .ogl_stalkList.ogl_disabled
{
    opacity:.2;
    pointer-events:none;
}

.ogl_sideView .ogl_stalkList > div
{
    margin-bottom:10px;
}

.ogl_sideView .ogl_stalkPlanets
{
    background:var(--p2);
    border:2px solid var(--p1);
    border-radius:3px;
    overflow-y:auto;
    padding:10px;
    height:calc(100vh - 325px);
}

.ogl_sideView .ogl_stalkPlanets > div
{
    align-items:center;
    background:var(--p6);
    box-shadow:0 0 5px #000;
    box-sizing:border-box;
    color:#fff;
    display:grid;
    font-size:10px;
    font-weight:bold;
    grid-gap:5px;
    grid-template-columns:60px auto 20px 20px 20px;
    line-height:25px;
    margin-bottom:5px;
    padding:0 7px 2px 7px;
    position:relative;
}

.ogl_sideView .ogl_stalkPlanets > div > div
{
    position:relative;
    white-space:nowrap;
    z-index:1;
}

.ogl_sideView .ogl_stalkPlanets > div > div:nth-child(1)
{
    color:#fff;
    cursor:pointer;
}

.ogl_sideView .ogl_stalkPlanets > div > div:nth-child(1):hover
{
    text-decoration:underline;
}

.ogl_stalkPlanets > div.ogl_currentSystem > div:nth-child(1)
{
    color:var(--textsand);
}

.ogl_sideView .ogl_stalkPlanets > div > div:nth-child(2)
{
    font-style:italic;
    overflow:hidden;
    text-overflow:ellipsis;
}

.ogl_ptreIcon
{
    fill:#353a3c;
    height:20px;
    vertical-align:middle;
}

.ptreFrames
{
    display:grid;
    grid-gap:5px;
    grid-template-columns:repeat(6, 1fr);
}

.ptreLegend
{
    color:var(--textblue);
    font-size:10px;
    margin-top:20px;
    text-align:left;
}

.ptreContent .ptreBestReport .ogl_button
{
    color:var(--textcyan);
    padding:5px;
}

.ptreContent h3
{
    color:var(--textcyan);
    font-weight:bold;
    padding:10px 0;
    text-align:left;
}

.ptreContent [data-check]
{
    align-self:center;
    background:currentColor;
    border-radius:50%;
    height:0;
    left:50%;
    position:absolute;
    top:50%;
    transform:translate(-50%, -50%);
    width:0;
}

.ptreContent [data-check].ogl_active
{
    background:none;
    box-shadow:inset 0 0 0 3px currentColor;
}

.ptreActivities > span
{
    color:var(--red2);
}

.ptreActivities > div
{
    display:grid;
    grid-gap:5px;
    grid-template-columns:repeat(12, 1fr);
}

.ptreActivities > div > *
{
    align-items:center;
    background:var(--p2);
    color:#656f78;
    display:grid;
    grid-gap:5px;
    grid-template-rows:18px auto;
    padding:5px 3px;
}

.ptreActivities > div > * > *
{
    display:inline-block;
    margin:auto;
}

.ptreActivities .ptreDotStats
{
    height:30px;
    position:relative;
    width:30px;
}

.ptreContent
{
    text-align:center;
}

.ptreBestReport
{
    display:grid;
    grid-template-rows:45px auto;
}

.ogl_sideView .ogl_stalkPoints
{
    grid-gap:2px;
    margin:0;
}

.ogl_sideView .ogl_stalkPoints > div
{
    border-color:var(--p2);
}

.ogl_pinnedContent.ogl_stalkPlanets > div
{
    display:block;
    font-size:11px;
}

.ogl_pinnedContent.ogl_stalkPlanets > div.ogl_new > span
{
    border-bottom:1px dashed;
}

.ogl_currentSystem
{
    color:var(--textpremium);
}

.ogl_pinnedContent.ogl_stalkPlanets .ogl_checked
{
    color:var(--green1);
    font-size:14px !important;
    position:absolute;
    right:2px;
}

.msg_title
{
    position:relative;
}

.msg_title .ogl_checked
{
    color:var(--green1);
    font-size:14px !important;
    margin-left:7px;
    position:absolute;
    vertical-align:sub;
}

.ogl_sideView .ogl_stalkPlanets > div:after
{
    background:var(--p3);
    content:'';
    height:25px;
    left:0;
    position:absolute;
    top:0;
    width:100%;
}

.ogl_sideView .ogl_stalkPlanets > div.ogl_active:after
{
    background:var(--p5);
}

.ogl_sideView .ogl_stalkPlanets > div > span
{
    position:relative;
    z-index:1;
}

.ogl_sideView .ogl_stalkPlanets .ogl_playerName
{
    color:var(--textcyan);
    cursor:pointer;
    overflow:hidden;
    position:relative;
    white-space:nowrap;
    z-index:1;
}

.ogl_sideView .ogl_stalkPlanets .ogl_playerName:hover
{
    color:var(--textsand);
}

.ogl_sideView h1
{
    color:var(--textcyan);
    font-size:16px;
    font-weight:bold;
    text-align:center;
}

.ogl_pinnedHistory
{
    float:left;
    font-size:20px !important;
    margin-right:10px;
}

.ogl_pinnedContent.ogl_stalkPlanets > div span
{
    line-height:24px;
    position:relative;
    z-index:1;
}

.ogl_sideView .ogl_stalkPlanets > div .ogl_planetIcon,
.ogl_sideView .ogl_stalkPlanets > div .ogl_moonIcon,
.ogl_sideView .ogl_stalkPlanets > div .ogl_flagIcon
{
    border-radius:50%;
    color:var(--textblue);
    cursor:pointer;
    font-size:18px !important;
    justify-self:end;
}

.ogl_stalkPlanets > div .ogl_planetIcon.ogl_done,
.ogl_stalkPlanets > div .ogl_moonIcon.ogl_done
{
    color:#34952e;
}

.ogl_sideView .ogl_stalkPlanets > div .ogl_planetIcon:hover,
.ogl_sideView .ogl_stalkPlanets > div .ogl_moonIcon:hover,
.ogl_sideView .ogl_stalkPlanets > div .ogl_flagIcon:hover,
.ogl_sideView .ogl_stalkPlanets > div .ogl_flagIcon.ogl_active
{
    color:#fff;
}

.ogl_stalkPlanets > div .ogl_planetIcon.ogl_noPointer,
.ogl_stalkPlanets > div .ogl_moonIcon.ogl_noPointer,
.ogl_stalkPlanets > div .ogl_flagIcon.ogl_noPointer
{
    opacity:.2;
}

.ogl_stalkPlanets > div .ogl_planetIcon.ogl_disabled,
.ogl_stalkPlanets > div .ogl_moonIcon.ogl_disabled,
.ogl_stalkPlanets > div .ogl_flagIcon.ogl_disabled
{
    color:hsl(111deg 56% 49%) !important;
}

.ogl_stalkPlanets > div .ogl_planetIcon.ogl_danger,
.ogl_stalkPlanets > div .ogl_moonIcon.ogl_danger,
.ogl_stalkPlanets > div .ogl_flagIcon.ogl_danger
{
    color:hsl(0deg 67% 52%) !important;
}

.ogl_stalkPlanets > div .ogl_planetIcon.ogl_loading,
.ogl_stalkPlanets > div .ogl_moonIcon.ogl_loading,
.ogl_stalkPlanets > div .ogl_flagIcon.ogl_loading
{
    color:var(--yellow1) !important;
    pointer-events:none;
}

.ogl_pinnedContent.ogl_stalkPlanets > div .ogl_planetIcon,
.ogl_pinnedContent.ogl_stalkPlanets > div .ogl_moonIcon
{
    float:right;
    margin-right:40px;
}

.ogl_pinnedContent.ogl_stalkPlanets > div .ogl_planetActivity,
.ogl_pinnedContent.ogl_stalkPlanets > div .ogl_moonActivity
{
    position:absolute;
    top:0;
}

.ogl_pinnedContent.ogl_stalkPlanets > div .ogl_planetActivity
{
    right:85px;
}

.ogl_pinnedContent.ogl_stalkPlanets > div .ogl_moonActivity
{
    right:28px;
}

.ogl_pinnedContent.ogl_stalkPlanets div[data-activity]
{
    color:var(--yellow1) !important;
}

.ogl_pinnedContent.ogl_stalkPlanets div[data-activity].ogl_short
{
    color:var(--red1) !important;
}

.ogl_pinnedContent.ogl_stalkPlanets div[data-activity="60"]
{
    color:#fff !important;
    opacity:.2;
}

.ogl_sideView .ogl_stalkList > div:nth-child(1)
{
    background:var(--p2);
    border-radius:3px;
    display:grid;
    grid-gap:3px;
    grid-template-columns:repeat(8, 1fr);
    padding:5px;
}

.ogl_sideView .ogl_stalkList > div:nth-child(2),
.ogl_sideView .ogl_stalkList > div:nth-child(3),
.ogl_pinnedSelector
{
    background:var(--p2);
    border-radius:3px;
    display:grid;
    grid-gap:5px;
    padding:5px;
    text-align:center;
}

.ogl_sideView .ogl_stalkList > div:nth-child(2)
{
    grid-template-columns:repeat(6, 1fr);
}

.ogl_sideView .ogl_stalkList > div:nth-child(3)
{
    grid-template-columns:repeat(5, 1fr);
}

.ogl_sideView .ogl_stalkList > div:nth-child(2) > div,
.ogl_sideView .ogl_stalkList > div:nth-child(3) > div
{
    background:var(--p4);
    border-radius:3px;
    cursor:pointer;
    font-weight:bold;
    line-height:22px;
}

.ogl_historyButton
{
    font-size:20px !important;
    margin-right:7px;
    padding:0 10px;
}

.ogl_historyList
{
    background:var(--p2);
    display:grid;
    grid-gap:5px;
    max-height:calc(100vh - 116px);
    overflow:auto;
    padding:15px
}

.ogl_historyList .ogl_button
{
    background:#19242e !important;
    border:2px solid #1e2b38;
    box-shadow:0 0 5px #000;
    display:grid;
    grid-template-columns:90px auto auto;
    font-size:11px;
    font-weight:normal !important;
    padding:0 10px;
    text-align:left;
    white-space:nowrap;
}

.ogl_historyList .ogl_button:hover
{
    background:var(--p5) !important;
    text-shadow:none !important;
}

.ogl_historyList .ogl_button > *
{
    line-height:23px !important;
}

.ogl_historyList .ogl_button b
{
    display:inline-block;
    max-width:90px;
    overflow:hidden;
    text-align:left;
    text-overflow:ellipsis;
}

.ogl_historyList .ogl_button span
{
    color:var(--textsand);
    display:inline-block;
    font-size:10px;
    text-align:left;
}

.ogl_historyList .ogl_button .float_right
{
    color:var(--fleet) !important;
    text-align:right;
}

.ogl_pinnedSelector
{
    background:none;
    padding:0;
}

.ogl_pinnedSelector > li
{
    font-size:11px;
    padding:3px 10px;
    text-align:left;
}

.ogl_pinnedSelector > li span
{
    color:var(--textsand);
    font-size:10px;
}

.ogl_sideView .ogl_stalkList > div:nth-child(2) > div.ogl_disabled,
.ogl_sideView .ogl_stalkList > div:nth-child(3) > div.ogl_disabled
{
    background:none;
    opacity:.2;
    pointer-events:none;
}

.ogl_sideView .ogl_stalkList > div:nth-child(2) > div:hover,
.ogl_sideView .ogl_stalkList > div:nth-child(3) > div:hover
{
    box-shadow:inset 0 0 12px 3px var(--neon);
    color:#fff !important;
}

.ogl_sideView .ogl_stalkList > div:nth-child(2) > div.ogl_active,
.ogl_sideView .ogl_stalkList > div:nth-child(3) > div.ogl_active
{
    box-shadow:inset 0 0 1px 1px var(--neonborder), inset 0 0 12px 3px var(--neon);
    color:#fff !important;
}

.ogl_sideView .ogl_toggleGalaxies
{
    background:var(--p2);
    border-radius:3px;
    display:grid;
    grid-gap:3px;
    grid-template-columns:repeat(6, 1fr);
    margin-top:20px;
}

.ogl_sideView .ogl_toggleSystems
{
    background:var(--p2);
    border-radius:3px;
    display:grid;
    grid-gap:5px;
    grid-template-columns:repeat(5, 1fr);
    margin:20px 0 20px 0;
}

.ogl_sideView .ogl_toggleGalaxies > div, .ogl_sideView .ogl_toggleSystems > div
{
    color:#fff;
    border-radius:3px;
    cursor:pointer;
    font-weight:bold;
    line-height:26px;
    text-align:center;
}

.ogl_sideView .ogl_toggleGalaxies > div:hover, .ogl_sideView .ogl_toggleSystems > div:hover
{
    background:var(--p4);
}

.ogl_sideView .ogl_toggleGalaxies .ogl_active, .ogl_sideView .ogl_toggleSystems .ogl_active
{
    background:var(--p1) !important;
    box-shadow: inset 0 0 1px 2px var(--neonborder), inset 0 0 12px 3px var(--neon);
    color:#fff;
}

.ogl_sideView .ogl_toggleGalaxies .ogl_disabled, .ogl_sideView .ogl_toggleSystems .ogl_disabled
{
    background:none !important;
    box-shadow:none !important;
    color:hsl(210deg 30% 18%);
    pointer-events:none;
}

.ogl_sideView .ogl_toggleColors
{
    display:grid;
    grid-template-columns:repeat(6, 1fr);
}

.ogl_sideView .ogl_toggle, .ogl_sideView .ogl_sideSelection
{
    border:2px solid var(--p3);
    border-radius:20px;
    box-sizing:border-box;
    cursor:pointer;
    font-size:14px !important;
    height:20px;
    opacity:.3;
    position:relative;
    width:100%;
}

.ogl_sideView .ogl_stalkPlanets > div > span:hover
{
    color:var(--textsand);
    cursor:pointer;
}

.ogl_sideView .ogl_toggle:hover
{
    filter:brightness(1.2);
}

.ogl_sideView .ogl_toggle.ogl_active
{
    opacity:1;
}

.ogl_sideSelection
{
    background:var(--p2);
    color:var(--textcyan) !important;
    grid-column:-3;
    grid-row:2;
    line-height:16px !important;
    opacity:1 !important;
    text-align:center;
}

.ogl_sideSelection:hover
{
    color:#fff !important;
}

.ogl_sideSelection:last-child
{
    grid-column:-2;
    grid-row:2;
}

/* MESSAGE
----------------------------*/

.msg
{
    border-radius:5px;
    box-shadow:0 0 0 2px var(--p1) !important;
    overflow:hidden;
}

.msg .ogl_metal, .msg .ogl_crystal, .msg .ogl_deut,
.msg .ogl_food, .msg [data-type]
{
    background:hsl(206deg 30% 21%);
    display:inline-block;
    padding:2px;
    font-size:10px;
    font-weight:bold;
    border-radius:3px;
}

.msg_status
{
    box-shadow:2px 0 var(--p1);
}

.msg_status:before
{
    background:none !important;
}

.ogl_expeResult
{
    background:hsl(207deg 33% 13%);
    border-bottom:2px solid var(--p1);
    color:var(--textpremium);
    font-size:10px;
    font-weight:bold;
    padding:3px 0;
    z-index:1;
    text-align:center;
    position:relative;
}

.ogl_expeResult > div:not(.ogl_button)
{
    background:none !important;
    font-size:11px !important;
    margin:0 4px;
}

.msg_new .ogl_expeResult
{
    background:hsl(204deg 23% 27%);
}

.ogl_button.ogl_ignoreRaid
{
    box-shadow:inset 0 8px rgb(255 255 255 / 7%);
    color:var(--textcyan) !important;
    font-size:18px !important;
    left:8px;
    line-height:16px !important;
    position:absolute;
    top:1px;
    width:30px;
}

.ogl_button.ogl_ignoreRaid:hover
{
    color:#fff !important;
}

.ogl_button.ogl_ignoreRaid.ogl_active
{
    color:var(--red1) !important;
}

.ogl_button.ogl_ignoreRaid:before
{
    content:'toggle_off';
}

.ogl_button.ogl_ignoreRaid.ogl_active:before
{
    content:'toggle_on';
}

/* CONFIG
----------------------------*/

.ogl_scriptTitle
{
    font-size:45px;
    font-weight:bold;
}

.ogl_scriptTitle span
{
    color:#85a0c1;
    font-size:16px;
    font-weight:normal;
}

.ogl_globalConfig
{
    display:grid;
    grid-gap:20px;
    grid-template-columns:repeat(2, 1fr);
}

.ogl_globalConfig > div:nth-child(1)
{
    align-items:center;
    display:flex;
    flex-direction:column;
    justify-content:center;
}

.ogl_globalConfig p
{
    margin-bottom:10px;
    padding:10px 0;
}

.ogl_globalConfig input[type="number"]
{
    background-color:#c8d1da !important;
    border:none !important;
    border-radius:2px !important;
    box-shadow:0 0 0 2px #eef7fb !important;
    color:var(--p2) !important;
    font-size:12px;
    font-weight:bold !important;
    line-height:20px;
    padding:2px 5px;
    -webkit-appearance:textfield;
    -webkit-box-sizing:content-box;
}

.ogl_kofi
{
    background:var(--ui1);
    border:2px solid var(--darkblue);
    border-radius:4px;
    color:#fff !important;
    display:block;
    line-height:36px !important;
    padding:0 14px;
    text-decoration:none !important;
    text-shadow:1px 1px rgba(0,0,0,.3);
}

.ogl_kofi:after
{
    color:var(--red);
    content:'favorite';
    font-family:'material icons';
    font-size:16px !important;
    margin-left:7px;
    text-shadow:none;
    vertical-align:bottom;
    -webkit-text-stroke:2px var(--p3);
}

.ogl_kofi:hover
{
    background:var(--ui2);
}

.ogl_config
{
    background:var(--p2);
    border-radius:4px;
    display:grid;
    grid-gap:10px;
    padding:20px;
}

.ogl_config a:hover
{
    color:var(--sunset);
}

.ogl_globalConfig h2
{
    border-bottom:2px dashed #1e2a36;
    color:var(--textsand);
    font-size:10px;
    font-weight:bold;
    margin-top:7px;
    padding:7px 0;
    text-align:left;
}

.ogl_globalConfig hr
{
    background:none;
    border:none;
    height:2px;
    margin:5px 0;
    width:100%;
}

.ogl_config hr
{
    margin:10px 0;
}

.ogl_globalConfig .ogl_button
{
    color:var(--textcyan);
    padding:0 8px;
}

.ogl_config > div
{
    display:grid;
    grid-gap:30px;
    grid-template-columns:auto max-content;
    line-height:22px;
    white-space:nowrap;
}

.ogl_config > .ogl_manageData
{
    grid-gap:5px;
    grid-template-columns:repeat(3, 1fr);
}

.ogl_config > .ogl_manageData > *
{
    font-size:11px;
    font-weight:bold;
}

.ogl_config > .ogl_manageData > *:first-child
{
    color:#d55757;
}

.ogl_confToggle
{
    background:#304050;
    border-radius:50px;
    cursor:pointer;
    font-size:11px;
    font-weight:bold;
    position:relative;
    width:50px;
}

.ogl_confToggle.ogl_active:hover
{
    background:var(--ui2);
}

.ogl_confToggle:hover
{
    background:#3c4f62;
}

.ogl_confToggle.ogl_active
{
    background:var(--ui1);
}

.ogl_confToggle:before
{
    box-sizing:border-box;
    content:'OFF';
    height:100%;
    padding:0 5px;
    position:absolute;
    text-align:right;
    width:100%;
}

.ogl_confToggle.ogl_active:before
{
    content:'ON';
    text-align:left;
}

.ogl_confToggle:after
{
    background:#fff;
    border-radius:50px;
    box-shadow:0 0 4px rgba(0,0,0,.5);
    content:'';
    height:16px;
    left:3px;
    position:absolute;
    top:3px;
    transition:left .2s;
    width:16px;
}

.ogl_confToggle.ogl_active:after
{
    left:calc(50px - 20px);
}

/* FLEET1
----------------------------*/

#fleet1 #buttonz .content
{
    margin-bottom:35px;
}

#fleet1 #continueToFleet2,
#fleet2 #sendFleet,
#fleet2 #backToFleet1,
.ogl_fleetBtn
{
    background:linear-gradient(to bottom right, var(--p3) 45%, var(--p1)) !important;
    border:2px solid var(--p1) !important;
    border-radius:4px;
    box-shadow:inset 0 1px rgba(255,255,255,.07);
    color:var(--green1) !important;
    height:auto !important;
    text-decoration:none !important;
}

#fleet1 #continueToFleet2:hover,
#fleet2 #sendFleet:hover,
#fleet2 #backToFleet1:hover,
.ogl_fleetBtn:hover
{
    color:#fff !important;
}

#fleet1 #continueToFleet2,
.ogl_fleetBtn
{
    cursor:pointer;
    font-size:12px;
    font-weight:bold;
    margin:0 !important;
    line-height:34px;
    text-align:center;
    text-transform:uppercase;
    user-select:none;
    width:120px;
}

#fleet2 #backToFleet1
{
    color:var(--red1) !important
}

#fleet1 #continueToFleet2 span
{
    height:34px !important;
    line-height:34px !important;
}

#fleet1 #continueToFleet2.off,
#fleet2 #sendFleet.off
{
    background:linear-gradient(to top left, var(--p3) 45%, var(--p1)) !important;
    color:var(--red1) !important;
    opacity:.7;
}

#fleet1 #continueToFleet2 span,
#fleet2 #sendFleet span,
#fleet2 #backToFleet1 span
{
    color:inherit !important;
    padding:0 !important;
}

#fleet1 #continueToFleet2.off span,
#fleet2 #sendFleet.off span
{
    color:inherit !important;
}

#fleet1 #buttonz .header
{
    display:none !important;
}

#fleet1 #buttonz #battleships
{
    margin-left:8px !important;
    width:441px !important;
}

#fleet1 #buttonz #battleships ul,
#fleet1 #buttonz #civilships ul,
#shipyard #technologies_battle ul,
#shipyard #technologies_civil ul
{
    padding:0 !important;
}

#shipyard #technologies_battle
{
    margin-left:0 !important;
    width:400px !important;
}

#shipyard #technologies_civil
{
    margin-left:0 !important;
    width:240px !important;
}

#fleet1 #allornone
{
    padding-bottom:10px;
}

#fleet1 #allornone .info
{
    display:none;
}

#fleet1 .allornonewrap
{
    align-items:end !important;
    background:none !important;
    border:none !important;
    display:grid !important;
    grid-gap:2px !important;
    grid-template-columns:118px auto min-content !important;
    margin-top:7px !important;
    padding:0 !important;
    width:637px !important;
}

#fleet1 .allornonewrap .secondcol
{
    align-items:end !important;
    background:none !important;
    border:none !important;
    display:grid !important;
    float:right !important;
    grid-column-start:1 !important;
    grid-row-start:1 !important;
    grid-gap:2px !important;
    grid-template-columns:repeat(4, 1fr) !important;
    margin:0 !important;
    padding:0 !important;
}

#fleet1 .allornonewrap .firstcol
{
    background:var(--p1);
    border-radius:4px;
    bottom:-27px !important;
    padding:4px;
    position:absolute !important;
    right:19px !important;
    width:auto !important;
}

#fleet1 .allornonewrap .secondcol .clearfloat
{
    display:none !important;
}

#fleet1 .send_all, #fleet1 .send_none,
#fleet1 .ogl_expeButton, #fleet1 .show_fleet_apikey, .ogl_capacityContainer
{
    background:linear-gradient(to bottom right, var(--p3) 45%, var(--p1)) !important;
    border:2px solid var(--p1) !important;
    border-radius:4px;
    box-shadow:inset 0 1px rgba(255,255,255,.07);
    color:#fff !important;
    cursor:pointer;
    font-size:12px;
    font-weight:bold;
    grid-row-start:1;
    height:auto;
    position:relative;
    text-decoration:none !important;
    width:38px;
}

#fleet1 .send_all:before, #fleet1 .send_none:before,
#fleet1 .ogl_expeButton:before, #fleet1 .show_fleet_apikey:before
{
    content:'';
    line-height:34px !important;
    width:100%;
}

#fleet1 .send_all:hover, #fleet1 .send_none:hover,
#fleet1 .ogl_expeButton:hover, #fleet1 .show_fleet_apikey:hover
{
    color:#fff !important;
}

#fleet1 .send_all, #fleet1 .send_none
{
    font-family:"Material Icons";
    font-size:20px;
}

#fleet1 #sendall, #fleet1 #resetall
{
    background:none;
    height:100%;
    left:-1px;
    padding:1px;
    position:absolute;
    text-align:center;
    top:-1px;
    width:100%;
}

#fleet1 .send_all { color:#d0af37 !important; }
#fleet1 .send_none { color:#bd4d4d !important; }
#fleet1 .ogl_expeButton { color:#4087f1 !important;display:none; }
#fleet1 .show_fleet_apikey { color:#9c9c9c !important;grid-column-start:3; }

#fleet1 .send_all:before { content:'double_arrow'; }
#fleet1 .send_none:before { content:'exposure_zero'; }
#fleet1 .ogl_expeButton:before { content:'EXP'; }
#fleet1 .show_fleet_apikey:before { content:'API'; }

#fleet1 .ogl_capacityContainer
{
    box-sizing:border-box;
    grid-column-start:2;
    grid-row-start:1;
    height:38px;
    padding:5px;
    position:relative;
    width:100% !important;
}

#fleet1 .ogl_capacityContainer i
{
    font-size:17px !important;
    position:absolute;
    right:7px;
    top:7px;
}

#fleet1 .ogl_capacityContainer:hover i
{
    color:var(--textsand);
}

#fleet1 .ogl_capacityInfo
{
    background:#0c1014;
    border:2px solid #0c1014;
    bottom:4px;
    box-sizing:border-box;
    font-size:10px;
    font-weight:bold;
    height:8px;
    left:7px;
    line-height:16px;
    position:absolute;
    right:30px;
}

#fleet1 .ogl_capacityInfo p
{
    pointer-events:none;
    transform:translate(0px, -22px);
}

#fleet1 .ogl_capacityInfo p b:nth-child(1)
{
    color:var(--textsand);
}

#fleet1 .ogl_capacityInfo .ogl_capacityCurrent,
#fleet1 .ogl_capacityInfo .ogl_capacityRequired
{
    display:block;
    height:100%;
    left:0;
    position:absolute;
    top:0;
    z-index:-1;
}

#fleet1 .ogl_capacityInfo .ogl_capacityCurrent
{
    background:#b18b22;
    min-width:1px;
    transition:width .3s;
    width:0%;
}

#fleet1 .ogl_capacityInfo .ogl_capacityRequired
{
    color:var(--skyblue);
    text-align:left;
    transform:translate(0px, -22px);
    white-space:nowrap;
}

#fleet1 .ogl_capacityInfo .ogl_capacityRequired > div
{
    background:repeating-linear-gradient(-45deg, #303e6f, #303e6f 5px, transparent 5px, transparent 10px);
    height:100%;
    transform:translate(0px, 6px);
    width:100%;
}

.ogl_preloadResources
{
    display:grid;
    grid-template-columns:38px 180px;
    grid-gap:10px 2px;
}

.ogl_preloadResources div:last-child
{
    display:grid;
    grid-gap:5px;
    grid-template-columns:repeat(2, 1fr);
}

.ogl_preloadResources .ogl_shipIcon
{
    color:var(--textpremium) !important;
    cursor:pointer;
    font-size:22px !important;
    height:24px;
    padding:0;
    text-align:center;
    text-shadow:0 0 4px #000;
}

.ogl_preloadResources input
{
    border:none !important;
    box-shadow:none !important;
}

.ogl_preloadResources h2
{
    color:var(--textcyan);
    font-weight:bold;
    padding:10px 0;
    text-align:left;
}

.ogl_preloadResources div:last-child, .ogl_preloadResources h2
{
    grid-column-start:1;
    grid-column-end:3;
}

#fleet1 .ogl_required
{
    background:var(--p2);
    border-bottom:2px solid var(--p1);
    color:#fff;
    font-size:10px;
    line-height:20px;
    padding:0 4px;
    user-select:none;
}

#fleet1 .ogl_required:hover
{
    color:var(--textsand);
}

#fleet1 .ogl_delta
{
    background:var(--p2);
    border-bottom:2px solid var(--p1);
    border-radius:0 0 0 6px;
    color:var(--textcyan);
    font-size:15px !important;
    line-height:20px !important;
    padding:0 3px;
    position:absolute;
    right:0;
    top:0;
    user-select:none;
}

#fleet1 .ogl_delta:hover
{
    color:var(--textsand);
}

#fleet1 .technology input[type="number"], #fleet1 .technology input[type="text"]
{
    border-radius:0 0 2px 2px !important;
    bottom:-16px  !important;
    height:18px !important;
}

.ogl_emptyGrid
{
    color:#fff;
    display:grid;
    font-size:12px;
    font-weight:normal;
    float:right;
    grid-gap:5px;
    grid-template-columns:repeat(4, auto);
    margin:0 16px;
    overflow:hidden;
    width:fit-content;
    width:-moz-fit-content;
}

.ogl_emptyShip
{
    background:hsl(0deg 36% 21%);
    border:1px solid #000;
    border-radius:3px;
    display:grid;
    grid-template-columns:32px auto;
    line-height:15px;
}

.ogl_emptyGrid .ogl_shipIcon
{
    background-position:center;
    border:none !important;
    border-right:1px solid #000 !important;
    border-radius:0 !important;
    height:15px;
    image-rendering:-webkit-optimize-contrast;
    width:32px;
}

.ogl_emptyShip span
{
    display:inline-block;
    padding:0 8px;
}

#fleetdispatchcomponent #warning p
{
    margin:30px auto 18px auto;
}

/* FLEET2
----------------------------*/

#fleet2 .percentageBarWrapper, #fleet2 #fleetboxmission,
#fleet2 ul#missions span.textlabel, #fleet2 div#mission .missionHeader,
#missionNameWrapper, #fleet2 .resbuttons
{
    display:none !important;
}

#fleet2 #buttonz ul#missions
{
    background:var(--p2);
    border:2px solid var(--p3);
    border-radius:5px;
    display:grid;
    grid-template-columns:repeat(12, 1fr);
    height:auto !important;
    margin:0 !important;
    margin-left:14px !important;
    padding:4px 0 !important;
    width:637px !important;
}

#fleet2 #buttonz ul#missions [data-mission]
{
    border-radius:6px;
}

#fleet2 #buttonz ul#missions .selected:before,
#fleet2 #buttonz ul#missions [data-mission]:hover:before
{
    box-shadow:inset 0 0 1px 2px var(--neonborder), inset 0 0 12px 3px var(--neon);
    border-radius:6px;
    content:'';
    display:block;
    height:100%;
    width:100%;
}

#fleet2 #mission ul li
{
    color:var(--textcyan) !important;
    list-style:disc !important;
}

#fleet2 #fleetboxbriefingandresources #start, #fleet2 #resources
{
    background:var(--p2) !important;
    border:2px solid var(--p3);
}

#fleet2 div#mission
{
    column-gap:16px !important;
    margin-top:23px !important;
}

#fleetboxdestination h2
{
    visibility:hidden;
}

#fleet2 .briefing_overlay
{
    margin-top:-50px !important;
    min-height:calc(100% + 60px) !important;
}

#fleet2 .res
{
    display:grid;
    grid-template-columns:auto 23px 23px 23px 42px;
    grid-gap:6px;
    height:auto;
    margin:0 !important;
    position:relative;
    width:auto !important;
}

#fleet2 .res .min, #fleet2 .res .max, #fleet2 .ogl_resourceSaver, #fleet2 .ogl_delta
{
    background:var(--p3) !important;
    border-radius:2px;
    bottom:0;
    box-shadow:inset 0 12px var(--p4), 0 0 0 2px var(--p1);
    color:var(--textcyan) !important;
    cursor:pointer;
    font-size:16px;
    height:24px;
    left:auto !important;
    line-height:24px !important;
    position:relative !important;
    text-align:center !important;
    text-decoration:none !important;
    top:auto !important;
    width:100% !important;
}

#fleet2 .res .min:hover, #fleet2 .res .max:hover,
#fleet2 .ogl_resourceSaver:hover, #fleet2 .ogl_delta:hover
{
    box-shadow:inset 0 0 1px 2px var(--neonborder), inset 0 0 12px 3px var(--neon);;
    color:#fff !important;
}

#fleet2 .res .min img, #fleet2 .res .max img
{
    display:none;
}

#fleet2 .res .min:before
{
    content:'double_arrow';
    display:block;
    font-family:'Material Icons';
    transform:scaleX(-1);
}

#fleet2 .res .max:before
{
    content:'double_arrow';
    display:block;
    font-family:'Material Icons';
}

#fleet2 .res input
{
    border-radius:3px !important;
    box-shadow:0 0 0 1px #000 !important;
    height:18px !important;
    padding:0 5px !important;
    text-align:right;
    width:91px !important;
}

#fleet2 .res_wrap:nth-child(1) input { border:2px solid #bb8aa7 !important; }
#fleet2 .res_wrap:nth-child(2) input { border:2px solid var(--metal) !important; }
#fleet2 .res_wrap:nth-child(3) input { border:2px solid var(--crystal) !important; }
#fleet2 .res_wrap:nth-child(4) input { border:2px solid var(--deut) !important; }

.ogl_choseCapacity > div:nth-child(1) input { border:2px solid red !important; }
.ogl_choseCapacity > div:nth-child(2) input { border:2px solid red !important; }
.ogl_choseCapacity > div:nth-child(3) input { border:2px solid red !important; }
.ogl_choseCapacity > div:nth-child(4) input { border:2px solid red !important; }

#fleet2 .resourceIcon
{
    border-radius:6px !important;
    height:24px !important;
    margin-right:3px !important;
}

#fleet2 #resources .res_wrap
{
    background:none !important;
    border:none !important;
    border-radius:1px !important;
    box-shadow:none !important;
    height:auto !important;
    padding:0 !important;
    margin:7px !important;
    text-align:right !important;
    width:290px !important;
}

#fleet2 .ogl_resourceSaver,
#fleet2 .ogl_delta
{
    background:var(--p3);
    border:none;
    color:#fff;
    cursor:pointer;
    display:inline-block;
    padding:0;
    text-align:center;
    top:auto;
    width:15px;
}

#fleet2 .ogl_delta
{
    font-size:14px !important;
}

#fleet2 .ogl_resourceSaver
{
    font-size:20px !important;
    top:auto;
    width:100%;
}

#fleet2 .ogl_resourceSaver.ogl_active
{
    color:var(--red1) !important;
    font-size:10px !important;
    font-weight:bold;
    white-space:nowrap;
}

.ogl_fleetSpeed
{
    border:2px solid var(--p3);
    border-radius:5px;
    color:var(--textcyan);
    display:grid;
    grid-template-columns:repeat(10, 1fr);
    margin:15px;
    overflow:hidden;
    position:relative;
    text-align:center;
    top:11px;
    width:635px;
}

.ogl_fleetSpeed.ogl_big
{
    grid-template-columns:repeat(20, 1fr);
}

.ogl_fleetSpeed > div
{
    background:var(--p2);
    cursor:pointer;
    font-size:11px;
    font-weight:bold;
    line-height:20px;
    padding:5px 1px 5px 0;
    position:relative;
    transition:all .2s;
}

.ogl_fleetSpeed.ogl_big > div:nth-child(odd)
{
    color:#607486;
}

.ogl_fleetSpeed > div.ogl_active, .ogl_fleetSpeed > div:hover
{
    border-radius:3px;
    box-shadow:inset 0 0 12px 3px var(--neon);
    color:#fff;
    opacity:1;
}

.ogl_fleetSpeed > div.ogl_active
{
    box-shadow:inset 0 0 1px 2px var(--neonborder), inset 0 0 12px 3px var(--neon);
}

#loadAllResources
{
    background:none !important;
    bottom:11px;
    display:grid !important;
    font-size:0 !important;
    height:24px !important;
    left:auto !important;
    position:absolute !important;
    right:7px !important;
    top:auto !important;
    width:auto !important;
}

.ogl_unloadAllResources
{
    font-weight:bold;
    /*background:hsl(0deg 100% 62%) !important;
    box-shadow:inset 0 12px hsl(8deg 78% 42% / 11%), inset 0 -11px 17px 6px hsl(210deg 30% 9%), 0 0 0 2px var(--p1);
    bottom:11px;
    color:hsl(0deg 64% 67%) !important;
    cursor:pointer;
    font-size:16px;
    font-weight:bold;
    height:24px !important;
    line-height:24px !important;
    margin:0 !important;
    padding:0 !important;
    position:absolute;
    right:53px;
    text-align:center !important;
    text-decoration:none !important;
    width:40px !important;*/
}

#loadAllResources a, .ogl_unloadAllResources
{
    background:linear-gradient(0deg, #151c22, #232f40) !important;
    border-radius:4px !important;
    box-shadow:inset 0 2px #283546, 0 0 0 2px var(--p1) !important;
    color:#efae37 !important;
    cursor:pointer !important;
    font-size:20px;
    height:24px !important;
    line-height:24px !important;
    margin:0 !important;
    padding:0 !important;
    text-align:center !important;
    text-decoration:none !important;
    text-shadow:-1px 2px var(--p2) !important;
    user-select:none !important;
    width:40px !important;
    /*
    background:hsl(174deg 100% 67%) !important;
    box-shadow:inset 0 12px hsl(8deg 78% 42% / 11%), inset 0 -11px 17px 6px hsl(210deg 30% 9%), 0 0 0 2px var(--p1);
    color:hsl(161deg 34% 68%) !important;
    cursor:pointer;
    font-size:20px;
    height:24px !important;
    line-height:24px !important;
    margin:0 !important;
    padding:0 !important;
    text-align:center !important;
    text-decoration:none !important;
    width:40px !important;*/
}

.ogl_unloadAllResources
{
    bottom:11px;
    color:#c14242 !important;
    font-size:16px;
    position:absolute;
    right:53px;
}

#loadAllResources a:hover, .ogl_unloadAllResources:hover
{
    box-shadow: inset 0 0 1px 2px var(--neonborder), inset 0 0 12px 3px var(--neon) !important;
    color:#fff !important;
}

#loadAllResources a:before
{
    content:'double_arrow';
    display:block;
    font-family:'Material Icons';
}

#loadRoom
{
    bottom:12px !important;
    font-size:0 !important;
    left:7px !important;
    position:absolute !important;
    top:auto !important;
}

#loadRoom > div
{
    font-size:10px !important;
}

.planetlink.ogl_active, .moonlink.ogl_active
{
    box-shadow:inset 0 0 1px 2px var(--neonborder), inset 0 0 10px 2px hsl(233deg 43% 53%), 0 0 0 2px var(--p1) !important;
}

.ogl_acsInfo .value span
{
    display:inline-block;
    margin-left:5px;
}

/* MESSAGES
----------------------------*/

.ogl_spyTable
{
    background:var(--p2);
    border-radius:5px;
    box-shadow:0 0 0 2px var(--p1);
    color:var(--textcyan);
    counter-reset:count;
    font-size:10px;
    margin:60px auto 0 auto;
    text-align:center;
    user-select:none;
    width:100%;
}

.ogl_spyTable > div > div, .ogl_spyTable .ogl_totalSum
{
    align-items:center;
    display:grid;
    grid-gap:2px;
    grid-template-columns:52px 105px 95px auto 65px 65px minmax(127px, min-content);
    position:relative;
}

.ogl_spyTable > div:nth-child(1)
{
    text-transform:uppercase;
}

.ogl_spyTable .ogl_totalSum
{
    border-top:2px solid var(--p1);
    text-align:right;
}

.ogl_spyTable > div:nth-child(2) > div
{
    background:var(--p3) !important;
    border-top:2px solid var(--p1);
    counter-increment:count 1;
    height:22px;
    transition:height .2s;
}

.ogl_spyTable .ogl_totalSum th:nth-child(3):before
{
    content:counter(count);
}

.ogl_spyTable th
{
    font-weight:bold;
    padding:5px;
    position:relative;
}

.ogl_spyTable th.ogl_headerActions
{
    display:grid;
    grid-template-columns:repeat(4, 1fr);
    padding:3px;
}

.ogl_spyTable th.ogl_headerActions > div:nth-child(1)
{
    grid-column:-2;
}

.ogl_spyTable .ogl_headerActions .ogl_button
{
    color:var(--text);
    font-size:15px !important;
}

.ogl_spyTable th.ogl_active
{
    color:var(--textpremium);
}

.ogl_spyTable th[data-filter]
{
    cursor:pointer;
}

.ogl_spyTable th[data-filter]:hover
{
    color:#fff !important;
}

.ogl_spyTable th[data-filter]:after
{
    content:'unfold_more';
    font-family:'material icons';
    font-size:14px;
    opacity:.5;
    text-transform:initial;
    vertical-align:sub;
}

.ogl_spyTable td
{
    background:var(--p3);
    box-sizing:border-box;
    overflow:hidden;
    padding:5px;
    position:relative;
    text-overflow:ellipsis;
    white-space:nowrap;
}

.ogl_spyTable .ogl_attacked td
{
    background:hsl(0deg 22% 14%);
    opacity:.8;
}

.ogl_spyTable td:not(:first-child)
{
    box-shadow:-2px 0 var(--p2);
}

.ogl_spyTable a
{
    text-decoration:none;
}

.ogl_spyTable .ogl_danger,
#fleet2 #mission ul li span.ogl_danger
{
    color:var(--red2) !important;
}

.ogl_spyTable .ogl_warning
{
    color:var(--yellow2) !important;
}

#fleet2 #mission ul li span.ogl_warning
{
    color:var(--orange0) !important;
}

.ogl_spyTable a:hover
{
    color:var(--textsand) !important;
}

.ogl_spyTable .ogl_coords
{
    text-align:left;
    text-indent:14px;
}

.ogl_spyTable .ogl_coords .ogl_type
{
    font-size:14px !important;
    left:-12px;
    position:absolute;
    top:4px;
    vertical-align:middle;
}

.ogl_spyTable .ogl_inFlight
{
    border-color:transparent red transparent transparent !important;
    bottom:2px;
    left:-1px;
    top:auto !important;
    transform:scale(.7) rotate(180deg);
    transform-origin:right;
    right:auto !important;
}

.ogl_spyTable .ogl_name a
{
    color:inherit !important;
    font-weight:bold;
}

.ogl_spyTable .ogl_name a:hover
{
    color:var(--textsand) !important;
}

.ogl_spyTable .ogl_renta
{
    padding:0;
}

.ogl_spyTable .ogl_important,
.ogl_spyTable .ogl_important a
{
    color:#fff;
}

.ogl_spyTable .ogl_renta a
{
    display:block;
    padding:5px;
}

.ogl_spyTable .ogl_renta div
{
    font-weight:bold;
    text-align:right;
}

.ogl_spyTable .ogl_renta span,
.ogl_spyTable .ogl_renta:hover div
{
    display:none;
}

.ogl_spyTable .ogl_renta:hover span
{
    display:block;
    font-weight:bold;
    text-align:right;
}

.ogl_spyTable .ogl_colorButton
{
    background:var(--p1);
    border:none;
    border-radius:20px;
    cursor:pointer;
    height:15px;
    margin:0;
    overflow:hidden;
    padding:0;
    position:absolute;
    right:2px;
    top:4px;
    width:24px;
}

.ogl_spyTable .ogl_colorDiv .ogl_colorButton
{
    border:none !important;
    bottom:0 !important;
    height:100% !important;
    left:0 !important;
    right:0 !important;
    top:0 !important;
    width:100% !important;
}

.ogl_spyTable .ogl_reportOptions
{
    align-items:center;
    display:grid;
    grid-auto-flow:column;
    grid-gap:5px;
    height:22px;
    justify-content:space-around;
    padding:0 5px;
}

.ogl_spyTable aside
{
    background:linear-gradient(to bottom, var(--p3), var(--p1));
    border-top:2px solid var(--p1);
    color:var(--textpremium);
    display:none;
    font-weight:bold;
    grid-gap:0;
    grid-template-columns:repeat(5, 1fr);
    padding:5px;
}

.ogl_spyTable aside.ogl_active
{
    display:grid;
}

.ogl_spyTable aside ul
{
    padding:5px 0;
}

.ogl_spyTable aside ul:nth-child(1)
{
    padding-top:25px;
}

.ogl_spyTable aside ul .ogl_shipIcon
{
    background-position:center;
    height:20px;
    margin:auto;
}

.ogl_spyTable aside ul a
{
    color:#fff;
}

.ogl_spyTable aside ul a.ogl_disabled
{
    color:#777;
    pointer-events:none;
    text-decoration:none;
}

.ogl_spyTable aside ul > *:not(.ogl_shipIcon)
{
    padding:3px 0;
    width:100%;
}

.ogl_reportOptions > *
{
    background:hsl(205deg 26% 22%);
    border-radius:3px;
    color:#fff !important;
    cursor:pointer;
    font-size:12px;
    height:16px;
    line-height:17px !important;
    user-select:none;
    text-align:center;
    text-decoration:none !important;
    width:16px;
}

.ogl_reportOptions > *.material-icons
{
    font-size:14px !important;
}

.ogl_reportOptions > div:hover, .ogl_reportOptions > a:hover
{
    box-shadow:inset 0 0 4px 2px var(--neon);
    color:#fff !important;
}

.ogl_spyTable .ogl_expand:before
{
    content:'expand_more';
}

.ogl_spyTable .ogl_extended .ogl_expand:before
{
    content:'expand_less';
}

.ogl_spyTable .ogl_added
{
    display:block;
}

.ogl_sim
{
    background:linear-gradient(to top, #1a2027, #2e3948) !important;
    box-shadow:inset 0 1px 3px #374454;
    border-radius:5px;
    color:#9ea5af !important;
    cursor:pointer;
    float:left;
    font-size:16px;
    font-weight:bold;
    line-height:26px;
    text-align:center;
}

.ogl_sim:hover
{
    background:linear-gradient(to bottom, #1a2027, #2e3948) !important;
    box-shadow:inset 0 -1px 3px #374454;
}

.ogl_sim ~ .ogl_sim
{
    margin-left:7px;
}

#subtabs-nfFleetTrash
{
    width:627px;
    right:7px;
}

#subtabs-nfFleetTrash
{
    background-image:none !important;
}

#subtabs-nfFleetTrash .trash_box
{
    left:0 !important;
}

#subtabs-nfFleetTrash .btn_trash
{
    width:96px;
}

#subtabs-nfFleetTrash .ogl_trash
{
    font-size:16px !important;
    line-height:23px !important;
    position:absolute;
    right:98px;
    top:0;
    width:40px;
}

#subtabs-nfFleetTrash .ogl_trash:hover
{
    color:#fff;
}

#messages .tab_favorites, #messages .tab_inner
{
    background:hsl(210deg 11% 9%) !important;
    box-shadow:0 0 0 2px var(--p0);
    border-radius:5px;
}

#messages .tab_favorites:before, #messages .tab_inner:before
{
    display:none !important;
}

/* FLEET EVENTS
----------------------------*/
#eventboxContent h2 .ogl_button
{
    background:linear-gradient(to bottom, #405887, #324979) !important;
    border-radius:5px !important;
    box-shadow:inset 0 0 0 1px #475a82 !important;
    color:#fff !important;
    font-size:16px !important;
    line-height:16px !important;
    position:absolute;
    right:53px;
    top:5px;
}

#eventboxContent .eventFleet
{
    box-shadow:inset 0 -1px #0d1014;
}

#eventboxContent .eventFleet .ogl_timeZone:before,
#eventboxContent .eventFleet .ogl_timeZone:after,
#eventboxContent .allianceAttack .ogl_timeZone:before,
#eventboxContent .allianceAttack .ogl_timeZone:after
{
    font-size:10px !important;
}

.eventFleet[data-mission-type="1"], .fleetDetails[data-mission-type="1"], .ogl_missionType[data-mission-type="1"]
{
    color:#ea463e !important;
}

.eventFleet[data-mission-type="2"], .fleetDetails[data-mission-type="2"], .ogl_missionType[data-mission-type="2"]
{
    color:#ff6046 !important;
}

.eventFleet[data-mission-type="3"], .fleetDetails[data-mission-type="3"], .ogl_missionType[data-mission-type="3"]
{
    color:#7cd157 !important;
}

.eventFleet[data-mission-type="4"], .fleetDetails[data-mission-type="4"], .ogl_missionType[data-mission-type="4"]
{
    color:#2ADCA3 !important;
}

.eventFleet[data-mission-type="5"], .fleetDetails[data-mission-type="5"], .ogl_missionType[data-mission-type="5"]
{
    color:#e48d50 !important;
}

.eventFleet[data-mission-type="6"], .fleetDetails[data-mission-type="6"], .ogl_missionType[data-mission-type="6"]
{
    color:#cabe6e !important;
}

.eventFleet[data-mission-type="7"], .fleetDetails[data-mission-type="7"], .ogl_missionType[data-mission-type="7"]
{
    color:#62C5DC !important;
}

.eventFleet[data-mission-type="8"], .fleetDetails[data-mission-type="8"], .ogl_missionType[data-mission-type="8"]
{
    color:#7EBA89 !important;
}

.eventFleet[data-mission-type="9"], .fleetDetails[data-mission-type="9"], .ogl_missionType[data-mission-type="9"]
{
    color:#fd2e2e !important;
}

.eventFleet[data-mission-type="10"], .fleetDetails[data-mission-type="10"], .ogl_missionType[data-mission-type="10"]
{
    color:#6f899d !important;
}

.eventFleet[data-mission-type="15"], .fleetDetails[data-mission-type="15"], .ogl_missionType[data-mission-type="15"]
{
    color:#6d98e2 !important;
}

.eventFleet[data-mission-type="16"], .fleetDetails[data-mission-type="16"], .ogl_missionType[data-mission-type="16"]
{
    color:#72c4d4 !important;
}

#eventContent .ogl_loader
{
    margin:30px auto;
}

#eventContent tbody
{
    outline:1px solid #000;
}

#eventContent tr, #eventContent .odd, #eventContent .part-even
{
    background:#101920;
    line-height:22px;
}

#eventContent tr td
{
    font-size:10px;
    padding:0;
    position:relative;
    text-align:left;
    vertical-align:middle;
}

#eventContent tr td *
{
    font-size:inherit !important;
}

#eventContent tr td *:not(.textBeefy):not(a)
{
    color:inherit;
}

#eventContent tr td a:not(.icon_link)
{
    background:rgba(0,0,0,.4);
    border-radius:40px;
    text-decoration:none;
}

.sendProbe .icon_link
{
    background:none;
}

#eventContent tr td figure
{
    margin-right:2px;
}

#eventContent tr .icon_movement,
#eventContent tr .icon_movement_reserve
{
    background-position-y:center;
    height:100%;
    padding:0;
}

#eventContent tr .icon_movement span,
#eventContent tr .icon_movement_reserve span
{
    left:0;
    position:absolute;
    top:0;
}

.detailsFleet
{
    width:auto !important;
}

.eventFleet[data-return-flight="true"]
{
    box-shadow:inset 0 150px 0 rgba(0,0,0,.5);
}

#eventContent td a:hover
{
    color:#73a7c5;
}

#eventContent tr[data-return-flight="true"] td
{
    opacity:.5;
}

#eventContent .originFleet span, #eventContent .destFleet span
{
    pointer-events:none !important;
    display:block !important;
    overflow:visible;
    width:auto;
}

#eventContent .originFleet span:after, #eventContent .destFleet span:after
{
    content:attr(title);
    font-size:10px;
    overflow:hidden;
    text-align:center;
    text-overflow:ellipsis;
    vertical-align:middle;
}

.eventFleet .countDown, .eventFleet .arrivalTime
{
    text-align:left;
    text-indent:5px;
}

#eventContent .countDown
{
    text-align:left;
    text-indent:5px;
    text-shadow:1px 1px #000;
}

#eventboxContent .eventFleet, #eventboxContent .allianceAttack
{
    align-items:center;
    display:grid;
    grid-gap:2px;
    grid-template-columns:85px 72px 23px 95px 70px auto 16px 95px 70px 20px 20px 20px;
    grid-template-columns:85px 72px 23px 97px 69px auto 19px 87px 70px 20px 21px 20px;
    white-space:nowrap;
}

#eventboxContent .eventFleet td:not(.icon_movement):not(.icon_movement_reserve)
{
    overflow:hidden;
    text-overflow:ellipsis;
}

.eventFleet .missionFleet img
{
    position:relative;
    top:2px;
    vertical-align:top !important;
}

.fleetDetails.detailsOpened
{
    height:auto !important;
}

#movement .fleetDetails
{
    background:var(--p3);
    border:2px solid #09161e;
    border-radius:4px;
}

#movement .fleetDetails > *:not(.ogl_topLine):not(.ogl_shipDetail):not(.ogl_actions)
{
    display:none !important;
}

#movement .fleetDetails[data-return-flight="1"]
{
    background:var(--p2);
}

#movement .fleetDetails[data-return-flight="1"] > div
{
    opacity:.5;
}

#movement .fleetDetails .ogl_shipIcon[class*="ogl_mission"]
{
    border-radius:5px !important;
    height:34px !important;
}

#movement .fleetDetails .ogl_topLine
{
    color:#fff;
    display:grid;
    grid-template-columns:80px 60px 66px 112px 16px 112px 66px 60px 80px;
    padding:2px;
}

#movement .fleetDetails .ogl_topLine > *:first-child
{
    display:none;
}

#movement .fleetDetails.detailsClosed .ogl_topLine
{
    grid-template-columns:18px 80px 60px 66px 103px 16px 103px 66px 60px 80px;
}

#movement .fleetDetails.detailsClosed .ogl_topLine > *:first-child
{
    display:block;
}

#movement .fleetDetails .ogl_topLine *
{
    bottom:auto !important;
    font-size:10px !important;
    height:24px !important;
    left:auto !important;
    margin:0 !important;
    position:relative !important;
    right:auto !important;
    top:auto !important;
    width:100% !important;
}

#movement .fleetDetails .ogl_topLine *:not(.ogl_shipIcon)
{
    background-position:center !important;
}

#movement .fleetDetails .ogl_topLine .ogl_timeZone
{
    font-size:0 !important;
}

#movement .fleetDetails .ogl_topLine .ogl_timeZone:after
{
    font-size:10px !important;
}

#movement .fleetDetails .ogl_topLine > *
{
    background:#1c2736;
    box-sizing:border-box;
    padding:0 2px;
    overflow:hidden;
    text-align:center;
    text-overflow:ellipsis;
    white-space:nowrap;
}

/*#movement .fleetDetails .ogl_topLine > .ogl_active:after
{
    background:currentColor;
    content:'';
    height:100%;
    left:0;
    opacity:.2;
    position:absolute;
    top:0;
    width:100%;
}*/

#movement .fleetDetails .ogl_topLine figure
{
    margin-right:5px !important;
    width:16px !important;
}

#movement .fleetDetails .ogl_shipDetail
{
    box-sizing:border-box;
    color:#ababab;
    display:grid;
    grid-gap:3px;
    grid-template-columns:repeat(19, 1fr);
    padding:2px;
    width:100%;
}

#movement .fleetDetails .ogl_shipDetail .ogl_movementItem
{
    background:#1c2736;
    border-radius:3px;
    line-height:14px;
    text-align:center;
}

#movement .fleetDetails .ogl_shipDetail .ogl_movementItem:nth-child(5)
{
    /*visibility:hidden;*/
}

#movement .fleetDetails .ogl_shipDetail .ogl_shipIcon
{
    border:none;
    border-radius:3px;
    box-shadow:none;
    display:inline-block;
    height:17px;
    width:100%;
}

#movement .fleetDetails .ogl_actions
{
    background:#1c2736;
    direction:rtl;
    height:16px;
    margin:0 2px;
    overflow:hidden;
}

#movement .fleetDetails .ogl_actions *
{
    bottom:auto !important;
    font-size:10px !important;
    left:auto !important;
    line-height:16px !important;
    margin:0 !important;
    position:relative !important;
    right:auto !important;
    text-align:center;
    top:auto !important;
}

#movement .fleetDetails .ogl_actions > *
{
    direction:ltr;
    display:inline-block;
    height:16px !important;
    margin-left:5px !important;
}

#movement .fleetDetails .ogl_actions .ogl_backTime
{
    width:140px;
}

#movement .fleetDetails .ogl_actions .ogl_agsName
{
    width:70px;
}

#movement .fleetDetails .ogl_actions .ogl_agsName > *
{
    padding:0 !important;
    position:absolute !important;
    right:0 !important;
}

#movement .fleetDetails .ogl_actions .ogl_timeZone
{
    background:#1c2736;
    border-radius:3px;
    height:16px;
    position:absolute !important;
    right:0 !important;
    text-indent:2px;
}

#movement .fleetDetails .mission
{
    color:inherit !important;
    display:block;
    height:16px;
    line-height:12px !important;
}

#movement .fleetDetails .mission:before
{
    background:currentColor;
    border-radius:3px;
    content:'';
    display:block;
    height:16px;
    left:0;
    opacity:.2;
    position:absolute;
    top:0;
    width:100%;
}

#movement .fleetDetails.detailsClosed
{
    height:auto !important;
}

#movement .fleetDetails.detailsClosed .absTime
{
    visibility:visible;
}

#movement .fleetDetails.detailsClosed .ogl_shipDetail
{
    display:none;
}

#movement .fleetDetails.detailsClosed .ogl_shipDetail >*:not(:first-child)
{
    display:none;
}

#movement .fleetDetails .ogl_timeZone:before,
#movement .fleetDetails .ogl_timeZone:after
{
    font-size:10px !important;
}

#movement .fleetDetails .ogl_topLine .ogl_shipIcon[class*="ogl_mission"]
{
    border:none !important;
    height:32px !important;
    top:4px !important;
    transform:scale(.5);
    transform-origin:top left;
    width:32px !important;
}

#movement .originPlanet .honorRank, #movement .destinationPlanet .honorRank
{
    display:none;
}

/*
.detailsOpened .ogl_backTimer
{
    background:#232f3a !important;
    border-radius:2px !important;
    right:205px !important;
    line-height:16px !important;
    padding:0 9px !important;
    position:absolute !important;
    top:3px !important;
}

.ogl_backTimer:before, .ogl_backTimer:after
{
    font-size:10px !important;
    vertical-align:middle !important;
}

.detailsOpened .marker01, .detailsOpened .marker02
{
    visibility:hidden !important;
}

.ogl_shipDetail
{
    color:hsl(214deg 10% 68%);
    display:grid;
    grid-gap:2px;
    grid-template-columns:repeat(21, 1fr);
    height:18px;
    pointer-events:none;
    position:absolute;
    left:85px;
    text-align:center;
    top:25px;
    white-space:nowrap;
}

.ogl_shipDetail > div
{
    display:grid;
}

.ogl_shipDetail .ogl_shipIcon
{
    border:none;
    border-radius:4px 4px 0 0;
    box-shadow:none;
    display:inline-block;
    height:24px;
    image-rendering:-webkit-optimize-contrast;
    margin:auto;
    position:relative;
    width:24px;
    z-index:-1;
}

.ogl_shipDetail span
{
    background:hsl(210deg 29% 8%);
    border-radius:2px;
    line-height:14px;
    margin-top:-6px;
    font-weight:bold;
    font-size:9px;
}

.fleetDetails.detailsOpened
{
    border-radius:4px;
    height:59px !important;
}

.detailsOpened .timer
{
    font-size:10px !important;
    font-weight:bold !important;
    left:7px !important;
    top:23px !important;
    width:auto !important;
}

.detailsClosed .timer
{
    top:-4px !important;
}

.detailsOpened .absTime
{
    left:7px !important;
    top:36px !important;
}

.detailsClosed .absTime
{
    left:6px !important;
    position:absolute !important;
    top:10px !important;
    visibility:visible !important;
}

.detailsOpened .nextTimer
{
    font-size:10px !important;
    font-weight:bold !important;
    left:auto !important;
    right:7px !important;
    top:24px !important;
    width:auto !important;
}

.detailsOpened .nextabsTime
{
    left:auto !important;
    right:7px !important;
    top:40px !important;
    width:auto !important;
}

.detailsOpened .nextabsTime:after
{
    font-size:10px !important;
}

.detailsOpened .allianceName
{
    top:45px;
}

.detailsClosed .nextTimer, .detailsClosed .nextabsTime,
.detailsClosed .nextMission, .detailsClosed .ogl_fulldate
{
    display:none !important;
}

.detailsClosed .fleetDetailButton
{
    display:none !important;
}

.detailsClosed .reversal
{
    top:2px !important;
}

.detailsClosed .starStreak .route > a
{
    background:none !important;
    left:326px !important;
    margin:0 !important;
    top:-3px !important;
}

.detailsOpened .originData
{
    left:107px !important;
    text-align:right !important;
}

.detailsOpened .destinationData
{
    left:470px !important;
    text-align:left !important;
}

.fleetDetails
{
    background:hsl(210deg 29% 11%) !important;
    border:2px solid var(--p0) !important;
    box-shadow:inset 0 23px var(--p2) !important;
    margin:12px 5px 0 5px !important;
}

.fleetDetails.detailsOpened .mission
{
    border-radius:2px !important;
    color:inherit !important;
    display:inline-block !important;
    left:7px !important;
    padding:1px 10px !important;
    top:3px !important;
    width:92px !important;
}

.fleetDetails .mission
{
    color:inherit !important;
}

.fleetDetails .mission:before
{
    background:currentColor;
    content:'';
    display:block;
    height:100%;
    left:0;
    opacity:.2;
    position:absolute;
    top:0;
    width:100%;
}

.detailsOpened .nextMission,
#movementcomponent .starStreak .origin,
#movementcomponent .starStreak .destination
{
    display:none !important;
}

.detailsOpened .starStreak
{
    background:none !important;
    border:none !important;
    overflow:initial !important;
}

.detailsOpened .reversal
{
    left:auto !important;
    right:338px !important;
    top:1px !important;
    z-index:2 !important;
}

.detailsOpened .fedAttack
{
    left:auto !important;
    right:43px !important;
    top:1px !important;
}

.detailsOpened .sendMail
{
    left:auto !important;
    right:22px !important;
    top:1px !important;
}

.detailsOpened .originData, .detailsOpened .destinationData
{
    color:#fff !important;
    width:168px !important;
}

.detailsOpened .originPlanet, .detailsOpened .destinationPlanet
{
    display:inline-block !important;
    position:relative !important;
    top:auto !important;
    left:auto !important;
    max-width:100px !important;
    right:auto !important;
    vertical-align:middle !important;
    width:auto !important;
}

.detailsOpened .destinationPlanet
{
    max-width:60px !important;
}

.detailsOpened .absTime:after
{
    font-size:10px !important;
}

.detailsClosed .mission
{
    border-radius:4px;
    height:20px;
    line-height:17px;
    text-align:center;
}

#movementcomponent .detailsOpened .starStreak .route a
{
    background:none !important;
    left:103px !important;
    margin-left:0 !important;
    margin-top:5px !important;
    position:absolute !important;
    top:-33px !important;
    transform:scaleX(1) !important;
    transform-origin:right !important;
}

#movementcomponent .detailsOpened .starStreak .route a.fleet_icon_forward
{
    transform:scaleX(-1) !important;
    transform-origin:right !important;
}*/

#highscoreContent div.content table#ranks tbody tr td
{
    height:22px;
}

#highscoreContent div.content table#ranks tbody tr:nth-child(odd) td
{
    background:hsl(214deg 27% 10%) !important;
}

#highscoreContent div.content table#ranks tbody tr:nth-child(even) td
{
    background:hsl(212deg 26% 8%) !important;
}

#highscoreContent div.content table#ranks tbody tr.buddyrank td
{
    background:hsl(258deg 33% 16%) !important;
}

#highscoreContent div.content table#ranks tbody tr.allyrank td
{
    background:hsl(177deg 33% 16%) !important;
}

#highscoreContent div.content table#ranks tbody tr.myrank td
{
    background:hsl(212deg 29% 26%) !important;
}

#highscoreContent .honorRank
{
    position:absolute;
}

#highscoreContent .honorScore
{
    pointer-events:none;
}

#highscoreContent .playername
{
    color:#eee;
    display:inline-block;
    font-weight:bold;
    overflow:hidden;
    position:relative;
    text-overflow:ellipsis;
    text-indent:21px;
    vertical-align:bottom;
    white-space:nowrap;
}

#highscoreContent .playername:hover
{
    text-decoration:underline;
}

#highscoreContent a
{
    position:relative;
}

#highscoreContent .ally-tag
{
    float:right;
    font-weight:bold;
}

#highscoreContent .ally-tag > a
{
    color:hsl(213deg 22% 56%) !important;
}

#highscoreContent .honorScore
{
    display:none !important;
    font-size:0 !important;
    left:20px;
    position:absolute;
    top:6px;
}

#highscoreContent .honorScore span,
#highscoreContent .stats_counter
{
    font-size:9px !important;
    font-weight:bold;
}

#highscoreContent #ranks tbody .score
{
    color:hsl(208deg 17% 47%) !important;
    font-size:11px;
    padding:2px 4px;
    position:relative;
    vertical-align:top;
}

#highscoreContent #ranks tbody .score .ogl_scoreDiff
{
    bottom:0;
    font-size:10px;
    position:absolute;
    right:4px;
}

#highscoreContent #ranks tbody .score .small
{
    color:hsl(210deg 11% 57%);
    font-size:10px;
    font-weight:bold;
}

.ogl_inFlightTable hr
{
    grid-column:1 / -1;
}

.ogl_missionList [data-mission-type]
{
    border:2px solid var(--p2);
    border-radius:4px;
    display:inline-block;
    height:34px;
    margin-right:2px;
    position:relative;
    width:17px;
}

.ogl_missionList [data-mission-occurence]:after
{
    background:var(--p2);
    bottom:0;
    color:#fff;
    content:attr(data-mission-occurence);
    dispay:block;
    height:17px;
    line-height:17px;
    position:absolute;
    right:0;
    text-align:center;
    width:17px;
}

.ogl_missionList [data-mission-type="1"]
{
    background:url(https://gf1.geo.gfsrv.net/cdn9a/cd360bccfc35b10966323c56ca8aac.gif);
}

.ogl_missionList [data-mission-type="3"]
{
    background:url(https://gf1.geo.gfsrv.net/cdn38/2af2939219d8227a11a50ff4df7b51.gif);
}

.ogl_missionList [data-mission-type="4"]
{
    background:url(https://gf3.geo.gfsrv.net/cdnb0/4dab966bded2d26f89992b2c6feb4c.gif);
}

.ogl_missionList [data-mission-type="7"]
{
    background:url(https://gf3.geo.gfsrv.net/cdn8a/0bbcbc3a6d6b102c979413d82bac47.gif);
}

.ogl_missionList [data-mission-type="8"]
{
    background:url(https://gf1.geo.gfsrv.net/cdn08/26dd1bcab4f77fe67aa47846b3b375.gif);
}

.ogl_missionList [data-mission-type="15"]
{
    background:url(https://gf1.geo.gfsrv.net/cdnf7/892b08269e0e0bbde60b090099f547.gif);
}

.ogl_ptreLogs, .ogl_logs
{
    background:var(--p2);
    border:1px solid #000;
    border-radius:4px;
    overflow:auto;
    margin:0 auto 50px auto;
    padding:10px 0;
    position:relative;
    text-indent:10px;
    width:654px;
}

.ogl_logs
{
    color:#e96e6e;
}

.ogl_logs h3
{
    color:grey;
    margin-bottom:5px;
}

.ogl_logs u
{
    color:#aaa;
    text-decoration:none;
}

.ogl_ptreLogs h3
{
    color:grey;
    margin-bottom:5px;
}

.ogl_ptreLogs div
{
    font-size:12px;
    margin:3px 0;
    opacity:.5;
}

.ogl_ptreLogs div:last-child
{
    opacity:1;
}

.ogl_ptreLogs div > span
{
    color:var(--textdate);
}

.ogl_ptreLogs div > b
{
    color:#b1a465;
}

.ogl_leftMenuIcon
{
    background:linear-gradient(to bottom, #1b2024 50%, #000 50%);
    border-radius:4px;
    display:block;
    height:27px;
    margin-right:11px;
    user-select:none;
    text-align:center;
    width:27px !important;
}

.ogl_leftMenuIcon a
{
    color:#353a3c !important;
}

.ogl_leftMenuIcon a:hover, .ogl_leftMenuIcon svg:hover
{
    color:#d39343 !important;
    fill:#d39343 !important;
}

.ogl_leftMenuIcon a .ogl_danger
{
    color:#a74545 !important;
}

.ogl_leftMenuIcon a, .ogl_leftMenuIcon a i
{
    display:block;
    height:100%;
    width:100%;
}

.ogl_leftMenuIcon .material-icons
{
    font-size:20px !important;
    line-height:27px !important;
}

.information .required_population
{
    position:relative;
    top:15px;
}

div.alert_triangle
{
    top:55px !important;
}

.ogl_share
{
    background: var(--p3);
    border-radius:0 0 3px 3px;
    border-top:3px solid;
    border-image:var(--uigradient) 1;
    box-shadow:0 0 16px 2px #000;
    padding:20px;
}

/* CUSTOM PUMPK1IN */

.ogl_confContainer{
    width: 108px;display: grid;grid-gap: 8px;grid-template-columns: auto auto;
}

.ogl_globalConfig{
    grid-template-columns: 3fr 4fr;
}

.pump-ed {
    font-size:0.5em;
    display:block;
}

.ogl_scriptTitle span {
    display: block;
    text-align: center;
}

/* END CUSTOM PUMPK1IN */

/*!css*/
`;

GM_addStyle(oglcss);
// #endregion

// ogl
// #region
class OGLight
{
    constructor(cache)
    {
        //if(!document.body) document.location.reload();
        //document.body.classList.add('ogl_noPointer');

        /* CUSTOM PUMPK1IN */
        document.body.classList.add("OGlight_enabled");
        /* END CUSTOM PUMPK1IN */

        if(document.querySelector('#fleet1 .allornonewrap .secondcol'))
        {
            document.querySelector('#fleet1 .allornonewrap .secondcol').prepend(document.querySelector('#fleet1 .show_fleet_apikey'));
            document.querySelector('#fleetboxbriefingandresources form').prepend(document.querySelector('#fleetboxmission #missions'));
        }

        if(redirect && redirect.indexOf('https') > -1) return;

        this.performances = [['Initial',performance.now()]];
        this.mode = new URLSearchParams(window.location.search).get('ogl_mode') || 0; // 1:collect 2:raid 3:locked 4:linked
        this.page = new URL(window.location.href).searchParams.get('component') || new URL(window.location.href).searchParams.get('page');
        this.id = GM_getValue('ogl_id') || false;
        this.ptre = localStorage.getItem('ogl-ptreTK') || false;
        this.ptre = (this.ptre && this.ptre.indexOf('false') > -1) ? false : this.ptre;
        this.version = GM_info.script.version.indexOf('b') > -1 ? 'beta' : 'v'+GM_info.script.version;
        this.ogameVersion = document.querySelector('meta[name="ogame-version"]').getAttribute('content');
        this.updateQueue = [];
        this.observerQueue = {};
        this.mutationList = {};
        this.observerExcludedID = ['tempcounter', 'resources_metal', 'resources_crystal', 'resources_deuterium', 'resources_darkmatter', 'resources_energy', 'promotionCountdown'];
        this.observerExcludedClass = ['OGameClock', 'textBeefy', 'ogl_endTime', 'planetlink', 'moonlink', 'ogl_stock', 'ogl_resourcesSum', 'ogl_panel', 'ogl_metal', , 'ogl_crystal', 'ogl_deut', 'ogl_stats', 'ogl_menuOptions'];
        this.maxPinnedTargets = 30;
        this.observerTimers = [];
        this.galaxyLoaded = false;
        this.observer = new MutationObserver(mutations =>
        {
            (() =>
            {
                let now = performance.now();

                for(let i=0, len=mutations.length; i<len; i++)
                {
                    let mutation = mutations[i];

                    if(this.observerExcludedID.indexOf(mutation.target.id) > -1) return;
                    if(mutation.target.className.trim().split(' ').filter(e => this.observerExcludedClass.includes(e)).length > 0) return;

                    /*if(mutation.target.id && mutation.target.id != "") console.log('#'+mutation.target.id+': '+(performance.now()-this.perf));
                    else if(mutation.target.className && mutation.target.className != "") console.log('.'+mutation.target.className+': '+(performance.now()-this.perf));
                    else console.log(mutation.target.outerHTML+': '+(performance.now()-this.perf));*/

                    if(this.page == 'galaxy' && (mutation.target.classList.contains('microplanet') || mutation.target.classList.contains('planetMoveIcons') || mutation.target.id == 'amountColonized') && !this.galaxyLoaded && document.querySelector('#galaxyLoading').style.display.trim() != '')
                    {
                        this.galaxyLoaded = true;
                        this.galaxyCoords = [galaxy, system];
                        this.mutationList['crawler'] = now;
                        this.mutationList['galaxy'] = now;
                    }
                    else if(mutation.target.id == 'stat_list_content')
                    {
                        this.mutationList['crawler'] = now;
                        this.mutationList['highscore'] = now;
                    }
                    else if(mutation.target.classList.contains('ui-tabs-panel'))
                    {
                        this.mutationList['messagesdate'] = now;
                        this.mutationList['tablereport'] = now;
                    }
                    else if(mutation.target.id == 'technologydetails_content')
                    {
                        this.mutationList['details'] = now;
                    }
                    else if(mutation.target.classList.contains('ui-dialog-content'))
                    {
                        let dialogType = mutation.target.getAttribute('data-page');
                        if(dialogType == 'jumpgatelayer') this.mutationList['jumpgate'] = now;
                        else if(dialogType == 'phalanx') this.mutationList['tooltip'] = now;
                        else if(dialogType == 'messages') this.mutationList['simbutton'] = now;
                    }
                    else if(mutation.target.id == 'eventboxContent')
                    {
                        this.mutationList['eventbox'] = now;
                    }
                    else if(mutation.target.className.indexOf('tooltip') && !mutation.target.classList.contains('ogl_tooltipReady'))
                    {
                        this.mutationList['tooltip'] = now;
                    }
                    /*else if(this.observerQueue['tooltip'])
                    {
                        this.mutationList['tooltip'] = now;
                    }*/
                }
            })();

            if(Object.keys(this.mutationList).length > 0) tryUpdate();
        });

        let tryUpdate = () =>
        {
            Object.keys(this.mutationList).forEach(k =>
            {
                if(typeof this.observerQueue[k] === 'function') this.observerQueue[k]();
                delete this.mutationList[k];
            });
        }

        // fix resources tooltips
        if(!document.querySelector('#metal_box')?.getAttribute('title') && this.mode != 1 && this.mode != 4) getAjaxResourcebox();

        this.loop();
        window.addEventListener('beforeunload', () => this.save());
        this.observer.observe(document.documentElement, {childList:true, subtree:true, attributes:true});

        // player data
        this.account = {};
        this.account.id = document.querySelector('head meta[name="ogame-player-id"]').getAttribute('content');
        this.account.name = document.querySelector('head meta[name="ogame-player-name"]').getAttribute('content');
        this.account.rank = document.querySelector('#bar a[href*="page=highscore"').parentNode.textContent.match(/\d+/g)[0];
        this.account.planetCount = document.querySelector('#countColonies span').textContent.match(/\d+/g)[0];
        this.account.planetMax = document.querySelector('#countColonies span').textContent.match(/\d+/g)[1];
        this.account.class = document.querySelector('#characterclass .sprite').classList.contains('miner') ? 1 : document.querySelector('#characterclass .sprite').classList.contains('warrior') ? 2 : 3;
        this.account.totalResources = [0,0,0];
        this.account.totalProd = [0,0,0];
        this.account.planetsCount = document.querySelector('#countColonies .textCenter span').textContent;

        // universe data
        this.universe = {};
        this.universe.ecoSpeed = document.querySelector('head meta[name="ogame-universe-speed"]').getAttribute('content');
        this.universe.fleetSpeedHolding = document.querySelector('head meta[name="ogame-universe-speed-fleet-holding"]').getAttribute('content');
        this.universe.fleetSpeedWar = document.querySelector('head meta[name="ogame-universe-speed-fleet-war"]').getAttribute('content');
        this.universe.fleetSpeedPeaceful = document.querySelector('head meta[name="ogame-universe-speed-fleet-peaceful"]').getAttribute('content');

        this.universe.name = document.querySelector('head meta[name="ogame-universe-name"]').getAttribute('content');
        this.universe.number = window.location.host.replace(/\D/g,'');
        this.universe.lang = document.querySelector('head meta[name="ogame-language"]').getAttribute('content');
        this.universe.timestamp = document.querySelector('head meta[name="ogame-timestamp"]').getAttribute('content') * 1000;

        // current planet data
        this.current = {};
        this.current.smallplanet = document.querySelector('.smallplanet.hightlightPlanet') || document.querySelector('.smallplanet.hightlightMoon') || document.querySelector('.smallplanet');
        this.current.type = document.querySelector('head meta[name="ogame-planet-type"]').getAttribute('content');
        this.current.coords = this.current.smallplanet.querySelector('.planetlink .planet-koords').textContent.slice(1,-1).split(':');
        this.current.id = document.querySelector('head meta[name="ogame-planet-id"]').getAttribute('content');
        this.current.metal = Math.floor(resourcesBar.resources.metal.amount);
        this.current.crystal = Math.floor(resourcesBar.resources.crystal.amount);
        this.current.deut = Math.floor(resourcesBar.resources.deuterium.amount);
        this.current.energy = Math.floor(resourcesBar.resources.energy.amount);
        this.current.food = Math.floor(resourcesBar.resources.food?.amount || 0);
        this.current.population = Math.floor(resourcesBar.resources.population?.amount || 0);

        this.cache = cache || {};

        this.next = {};
        this.next.smallplanet = this.current.smallplanet.nextElementSibling || document.querySelectorAll('.smallplanet')[0];

        this.prev = {};
        this.prev.smallplanet = this.current.smallplanet.previousElementSibling || document.querySelectorAll('.smallplanet')[document.querySelectorAll('.smallplanet').length - 1];

        if(document.querySelector('.moonlink'))
        {
            if(document.querySelectorAll('.moonlink').length > 1)
            {
                this.next.smallplanetWithMoon = this.next.smallplanet;
                if(!this.next.smallplanetWithMoon.querySelector('.moonlink'))
                {
                    do this.next.smallplanetWithMoon = this.next.smallplanetWithMoon.nextElementSibling || document.querySelectorAll('.moonlink')[0].parentNode;
                    while(!this.next.smallplanetWithMoon.querySelector('.moonlink'));
                }

                this.prev.smallplanetWithMoon = this.prev.smallplanet;
                if(!this.prev.smallplanetWithMoon.querySelector('.moonlink'))
                {
                    do this.prev.smallplanetWithMoon = this.prev.smallplanetWithMoon.previousElementSibling || document.querySelectorAll('.moonlink')[document.querySelectorAll('.moonlink').length - 1].parentNode;
                    while(!this.prev.smallplanetWithMoon.querySelector('.moonlink'));
                }
            }
            else
            {
                this.next.smallplanetWithMoon = this.current.smallplanet;
                this.prev.smallplanetWithMoon = this.current.smallplanet;
            }
        }

        let universeInfo = `<div>
            <ul>
                <li>Economy : ${this.universe.ecoSpeed}</li>
                <li>Peaceful fleets : ${this.universe.fleetSpeedPeaceful}</li>
                <li>War fleets : ${this.universe.fleetSpeedWar}</li>
                <li>Holding fleets : ${this.universe.fleetSpeedHolding}</li>
            </ul>
        </div>`;

        (document.querySelector('#pageReloader') || document.querySelector('#logoLink')).classList.add('tooltipBottom');
        (document.querySelector('#pageReloader') || document.querySelector('#logoLink')).setAttribute('title', universeInfo);
        document.querySelector('#pageContent').appendChild(Util.createDom('div', {'class':'ogl_universeName'}, `${this.universe.name}.${this.universe.lang}`));
        document.querySelector('#bar ul').appendChild(Util.createDom('li', {'class':'ogl_planetsCount'}, `${this.account.planetsCount}<span class="material-icons">language</span>`));

        this.ptreIcon =
        `
            <?xml version="1.0" encoding="UTF-8" standalone="no"?>
            <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
            <svg class="ogl_ptreIcon" width="100%" height="100%" viewBox="0 0 280 290" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
                <g transform="matrix(1,0,0,1,-1101.56,-1607.07)">
                    <path d="M1262.77,1770.22C1262.48,1770.26 1262.18,1770.28 1261.87,1770.28C1258.35,1770.28 1255.49,1767.42 1255.49,1763.9C1255.49,1760.37 1258.35,1757.51 1261.87,1757.51C1262.02,1757.51 1262.17,1757.52 1262.32,1757.53L1262.32,1757.52L1286.56,1757.52C1286.56,1757.52 1286.56,1757.52 1286.56,1757.51L1320.4,1757.51L1320.42,1757.52L1322.46,1757.52C1322.53,1757.52 1322.61,1757.52 1322.68,1757.52C1326.2,1757.52 1329.06,1760.38 1329.06,1763.9C1329.06,1764.05 1329.06,1764.19 1329.05,1764.33C1328.84,1775.83 1319.09,1785.49 1307.19,1785.49C1297.26,1785.49 1288.87,1779.03 1286.24,1770.22L1262.77,1770.22ZM1159.8,1770.02C1159.51,1770.06 1159.21,1770.08 1158.9,1770.08C1155.38,1770.08 1152.52,1767.22 1152.52,1763.69C1152.52,1760.17 1155.38,1757.31 1158.9,1757.31C1159.05,1757.31 1159.2,1757.31 1159.34,1757.32L1159.34,1757.32L1183.59,1757.32C1183.59,1757.31 1183.59,1757.31 1183.59,1757.31L1217.43,1757.31L1217.45,1757.32L1219.49,1757.32C1219.56,1757.31 1219.63,1757.31 1219.7,1757.31C1223.23,1757.31 1226.09,1760.17 1226.09,1763.69C1226.09,1763.84 1226.08,1763.99 1226.07,1764.13C1225.87,1775.63 1216.11,1785.28 1204.21,1785.28C1194.28,1785.28 1185.89,1778.83 1183.27,1770.02L1159.8,1770.02ZM1118.14,1732.74C1117.85,1732.78 1117.55,1732.8 1117.24,1732.8C1113.72,1732.8 1110.86,1729.94 1110.86,1726.42C1110.86,1722.89 1113.72,1720.03 1117.24,1720.03C1117.39,1720.03 1117.54,1720.04 1117.68,1720.05L1117.68,1720.04L1147.5,1720.04L1180.12,1607.07L1240.55,1647.87L1302.84,1622.64L1339.85,1720.04L1363.42,1720.04C1363.74,1719.99 1364.06,1719.97 1364.38,1719.97C1367.9,1719.97 1370.77,1722.83 1370.77,1726.36C1370.77,1729.88 1367.9,1732.74 1364.38,1732.74C1364.35,1732.74 1364.32,1732.74 1364.3,1732.74L1364.3,1732.74L1118.14,1732.74ZM1101.56,1896.65L1101.56,1792.25L1240.99,1833.55L1381.11,1792.88L1381.11,1896.72L1101.56,1896.65Z"/>
                </g>
            </svg>
        `;

        // ogl database
        this.DBName = `ogl_test_${this.universe.number}-${this.universe.lang}_${this.account.id}`;
        //this.db = this.DBName == localStorage.getItem('ogl_lastKeyUsed') && ogldb ? ogldb : JSON.parse(GM_getValue(this.DBName) || '{}');

        this.db = JSON.parse(GM_getValue(this.DBName) || '{}');
        this.db.players = this.db.players || [];
        this.db.positions = this.db.positions || [];
        this.db.stats = this.db.stats || { total:{} };
        this.db.loca = this.db.loca || {};
        this.db.ships = this.db.ships || {};
        this.db.me = this.db.me || {};
        this.db.me.techs = this.db.me.techs || {};
        this.db.me.planets = this.db.me.planets || {};
        this.db.myActivities = this.db.myActivities || {};
        this.db.pinnedList = this.db.pinnedList || [];
        this.db.spyProbesCount = this.db.spyProbesCount || 6;
        this.db.topScore = this.db.topScore || [0, 0];
        this.db.checkedSystems = this.db.checkedSystems || [];
        this.db.lastEmpireUpdate = this.db.lastEmpireUpdate || 0;
        this.db.lastVersionCheck = this.db.lastVersionCheck || 0;
        this.db.newVersion = this.db.newVersion || 0;
        this.db.servertTimezone = this.db.servertTimezone || 0;
        this.db.clientTimezone = this.db.clientTimezone || 0;

        if(!this.db.ships?.[202] && this.page != 'fleetdispatch')
        {
            window.location.href = `https://${window.location.host}/game/index.php?page=ingame&component=fleetdispatch`;
            return;
        }

        this.db.options = this.db.options || {};
        this.db.options.rval = this.db.options.rval || 300000 * this.universe.ecoSpeed;
        this.db.options.defaultShip = this.db.options.defaultShip || 202;
        this.db.options.defaultMission = this.db.options.defaultMission || 3;
        this.db.options.resSaver = this.db.options.resSaver || [0,0,0,0];
        this.db.options.spyFilter = this.db.options.spyFilter || '$';
        this.db.options.togglesOff = this.db.options.togglesOff || ['autoclean', 'fleetDetailsName', 'bigShip', 'rightMenuTooltips', 'ignoreExpeShips'];
        this.db.options.excludedColors = this.db.options.excludedColors || [];
        this.db.options.targetFilter = this.db.options.targetFilter || [];
        this.db.options.dateFilter = this.db.options.dateFilter || 7;
        this.db.options.tooltipDelay = this.db.options.tooltipDelay || 600;

        this.current.techs = this.db.me.planets[this.current.coords.join(':')]?.techs || {};

        this.checkTopScore();
        this.betterInputs();

        this.db.checkedSystems = Array.from(new Set(this.db.checkedSystems));

        // update old player positions
        if(!this.db.dataFormat || this.db.dataFormat < 4)
        {
            let oldDB = JSON.parse(localStorage.getItem('ogl_redata') || '{}');
            if(oldDB.stalkList)
            {
                if(confirm('Do you want to import your V3 targets ?'))
                {
                    for(let v of Object.values(oldDB.stalkList))
                    {
                        let newObj = {};
                        newObj.id = v.id;
                        newObj.playerID = v.player;
                        newObj.coords = v.coords;
                        newObj.rawCoords = v.coords.split(':').map(x => x.padStart(3, '0')).join('');
                        newObj.moonID = v.moonID || -1;
                        newObj.color = v.color;

                        if(v.color && v.id == -1)
                        {
                            newObj.id = -2;
                            newObj.playerID = -2;
                        }

                        let entryID = this.find(this.db.positions, 'coords', v.coords)[0] ?? this.db.positions.length;
                        this.db.positions[entryID] = {...this.db.positions[entryID], ...newObj};
                    }
                }

                this.db.dataFormat = 4;
            }
            else this.db.dataFormat = 4;

            //this.saveAsync();
        }

        // clear old empty player positions
        if(this.db.dataFormat < 5)
        {
            let tmpDB = [];
            this.db.positions.forEach(e =>
            {
                if(e.id != '-1') tmpDB.push(e);
            });
            this.db.positions = tmpDB;
            this.db.dataFormat = 5;
        }

        // clear badly formatted PTRE key
        if(this.db.dataFormat < 6)
        {
            if(this.ptre && (this.ptre.replace(/-/g, '').length != 18 || this.ptre.indexOf('TM') != 0))
            {
                localStorage.removeItem('ogl-ptreTK');
            }

            this.db.dataFormat = 6;
        }

        // generate a new id
        if(!this.id || !this.id[0])
        {
            let uuid = [crypto.randomUUID(), 0];
            GM_setValue('ogl_id', uuid);
            this.id == uuid;
        }

        // check OGL version
        this.checkVersion();

        // ogl components
        this.component = {};
        this.component.lang = new LangManager(this);
        this.component.popup = new PopupManager(this);
        this.component.crawler = new CrawlerManager(this);
        this.component.galaxy = new GalaxyManager(this);
        this.component.highscore = new HighscoreManager(this);
        this.component.fleet = new FleetManager(this);
        this.component.keyboard = new KeyboardManager(this);
        this.component.sidebar = new SidebarManager(this);
        this.component.tooltip = new TooltipManager(this);
        this.component.color = new ColorManager(this);
        this.component.time = new TimeManager(this);
        this.component.message = new MessageManager(this);
        this.component.jumpgate = new JumpgateManager(this);
        this.component.empire = new EmpireManager(this);
        this.component.menu = new MenuManager(this);

        if(this.page == 'galaxy' && !this.galaxyLoaded)
        {
            document.querySelector('#amountColonized').textContent = document.querySelector('#amountColonized').textContent;
        }

        this.performances.push(['Loaded',performance.now()]);
        this.displayPerformances();
    }

    delay(ms)
    {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    findRaw(table, key, value)
    {
        const result = [];
        const isValid = e => typeof e[key] !== typeof undefined && e[key].toString().toLowerCase() === value.toString().toLowerCase();

        for(let i=0; i<table.length; i++)
        {
            let item = table[i];
            if(isValid(item)) result.push(item);
        }

        result.sort((a, b) => a.rawCoords - b.rawCoords)

        return result;
    }

    find(table, key, value, multipleResult)
    {
        const result = [];
        const tmp = [];
        const lowerValue = value.toString().toLowerCase();
        const typeUndefined = typeof undefined;

        let isValid;
        if(key == 'coords' || key == 'rawCoords') isValid = e => e[key] === value;
        else isValid = e => typeof e[key] !== typeUndefined && e[key].toString().toLowerCase() === lowerValue;

        if(multipleResult)
        {
            for(let i=0, len=table.length; i<len; i++)
            {
                let item = table[i];
                if(isValid(item))
                {
                    tmp.push(item);
                }
            }

            tmp.sort((a, b) => a.rawCoords - b.rawCoords).forEach(entry =>
            {
                let index = table.indexOf(entry).toString();
                result.push(index);
            });
        }
        else
        {
            let index = table.findIndex(isValid);
            if(!isNaN(index) && index > -1) result.push(index);
        }

        return result;
    }

    getPositionsByCoords(sliced)
    {
        let table = this.db.positions;
        let result = {};
        const isValid = e => e.color && e.color != 'none' && this.db.options.excludedColors.indexOf(e.color) == -1;

        for(let i=0, len=table.length; i<len; i++)
        {
            let item = table[i];
            let id = sliced ? item.rawCoords.slice(0, -3) : item.rawCoords;
            if(isValid(item))
            {
                if(!result[id]) result[id] = [];
                result[id].push(item);
            }
        }

        return result;
    }

    getPositionsByPlayerId(id)
    {
        let table = this.db.positions;
        let result = {};
        const isValid = e => typeof e.playerID !== typeof undefined && e.playerID == id;

        for(let i=0, len=table.length; i<len; i++)
        {
            let item = table[i];
            let id = item.playerID;
            if(isValid(item))
            {
                if(!result[id]) result[id] = [];
                result[id].push(item);
            }
        }

        return result;
    }

    getPlayersById()
    {
        let table = this.db.players;
        let result = {};

        for(let i=0, len=table.length; i<len; i++)
        {
            result[table[i].id] = table[i];
        }

        return result;
    }

    findTargets(table, key, min, max)
    {
        const result = [];
        const tmp = [];
        let isValid;
        isValid = e => e.color && e.color != 'none' && parseInt(e[key]) >= parseInt(min) && parseInt(e[key]) <= parseInt(max) && this.db.options.excludedColors.indexOf(e.color) == -1;

        for(let i=0, len=table.length; i<len; i++)
        {
            let item = table[i];
            if(isValid(item))
            {
                tmp.push(item);
            }
        }

        tmp.sort((a, b) => a.rawCoords - b.rawCoords).forEach(entry =>
        {
            let index = table.indexOf(entry).toString();
            result.push(index);
        });

        return result;
    }

    saveObj(table, entry, newEntry)
    {
        let index = table.indexOf(entry).toString() ?? table.length;
        table[index] = {...table[index], ...newEntry};
    }

    observeMutation(callback, id)
    {
        this.observerQueue[id] = callback;
    }

    addToUpdateQueue(callback)
    {
        this.updateQueue.push(callback);
    }

    async loop()
    {
        setInterval(() => this.updateQueue.forEach(callback => callback()), 400);
    }

    betterInputs()
    {
        setInterval(() =>
        {
            document.querySelectorAll('.ogl_input:not(.ogl_inputReady)').forEach(input =>
            {
                input.classList.add('ogl_inputReady');

                input.addEventListener('input', () => { setTimeout(() => input.dispatchEvent(new Event('change')), 10); });
                input.addEventListener('change', () =>
                {
                    if(input.value)
                    {
                        let newValue =  parseInt(input.value.toLowerCase().replace(/[\,\. ]/g, '').replace('g', '000000000').replace('m', '000000').replace('k', '000'));
                        input.value = isNaN(newValue) || newValue <= 0 ? 0 : newValue.toLocaleString('de-DE');
                    }
                });

                setTimeout(() => input.dispatchEvent(new Event('change')), 10);
            });
        }, 300);
    }

    save(data)
    {
        if(data && typeof data === 'object') this.db = data;
        GM_saveTab([this.cache]);
        GM_setValue(this.DBName, JSON.stringify(this.db));
        unsafeWindow.ogl = null;
    }

    saveAsync(data)
    {
        setTimeout(() => this.save(data));
    }

    checkVersion()
    {
        let leftMenu = document.querySelector('#menuTable').appendChild(Util.createDom('li', {},
        `
            <span class="menu_icon ogl_leftMenuIcon">
                <a class="tooltipRight" data-title="Buy me a coffee <3" href="https://ko-fi.com/oglight" target="_blank"><i class="material-icons">local_cafe</i></a>
            </span>
            <a class="menubutton tooltipRight" href="https://board.fr.ogame.gameforge.com/index.php?thread/722955-oglight/" target="_blank">
                <span class="textlabel">OGLight ${this.version}</span>
            </a>
        `));

        if(this.ptre)
        {
            let link = this.universe.lang == 'fr' ? `https://board.fr.ogame.gameforge.com/index.php?thread/740025-paye-ton-re-ptre-int%C3%A9gration-oglight/` : `https://forum.origin.ogame.gameforge.com/forum/thread/37-ptre-spy-report-sharing-tool-over-discord-and-ingame-oglight/`;

            document.querySelector('#menuTable').appendChild(Util.createDom('li', {},
            `
                <span class="menu_icon ogl_leftMenuIcon">
                    <a class="tooltipRight" href="${link}" target="_blank">${this.ptreIcon}</a>
                </span>
                <a class="menubutton tooltipRight" href="https://ptre.chez.gg/" target="_blank">
                    <span class="textlabel">PTRE</span>
                </a>
            `));
        }

        let updateButton = () =>
        {
            leftMenu.querySelector('.menubutton').classList.add('ogl_active');
            leftMenu.querySelector('.menubutton').setAttribute('data-title', 'A new version is available !');
            leftMenu.querySelector('.menubutton').setAttribute('href', 'https://openuserjs.org/scripts/nullNaN/OGLight');
        }

        let isOldVersion = this.version.replace(/\D/g, "") != this.db.newVersion && this.version.indexOf('b') == -1;

        let target = document.querySelector('#siteFooter .fright');
        target.appendChild(Util.createDom('span', {}, '| '));
        target.appendChild(Util.createDom('a', {'target':'_blank', 'href':'https://board.fr.ogame.gameforge.com/index.php?thread/740025-paye-ton-re-ptre-intégration-oglight/'}, this.ptre ? 'PTRE <span class="ogl_ok material-icons">done</span>' : 'PTRE <span class="ogl_danger material-icons">clear</span>'));

        if(typeof GM_xmlhttpRequest !== 'undefined' && serverTime.getTime() > this.db.lastVersionCheck + 3600000 && !isOldVersion)
        {
            this.db.lastVersionCheck = serverTime.getTime();

            GM_xmlhttpRequest(
            {
                method:'GET',
                url:'https://openuserjs.org/meta/nullNaN/OGLight.meta.js/',
                onload:result =>
                {
                    let updateAvailable = (result.responseText.replace(/\D/g, "") != this.version.replace(/\D/g, "") && this.version.indexOf('b') == -1) ? true : false;

                    if(updateAvailable)
                    {
                        this.db.newVersion = result.responseText.replace(/\D/g, "");
                        updateButton();
                    }
                }
            });
        }
        else if(isOldVersion && this.db.newVersion != 0) updateButton();

        this.checkOGLID();
    }

    checkTopScore()
    {
        if(!this.db.researchSpeed || this.db.topScore[1] < serverTime.getTime() - 3600000) // check every 1h max
        {
            fetch('https://' + window.location.host + '/api/serverData.xml')
            .then(result => result.text())
            .then(txt =>
            {
                let parser = new DOMParser();
                let xmlResult = parser.parseFromString(txt, 'text/xml');
                this.db.topScore = [parseInt(Number(xmlResult.querySelector('topScore').innerHTML)), serverTime.getTime()];
                this.db.researchSpeed = parseInt(xmlResult.querySelector('researchDurationDivisor').innerHTML);
            });
        }
    }

    displayPerformances()
    {
        if(this.version.indexOf('b') !== -1)
        {
            let initialTime = 0;
            let previousTime = 0;

            setTimeout(() =>
            {
                console.groupCollapsed(`[OGL loading performances]`);

                this.performances.forEach((entry, index) =>
                {
                    if(entry[0] != 'Initial') console.log(`${entry[0].padEnd(16, '_')} ${(entry[1] - previousTime).toFixed(2)} ms`);
                    else initialTime = entry[1];

                    previousTime = entry[1];

                    if(index == this.performances.length - 1)
                    {
                        console.log(''.padEnd(24, '-'));
                        console.log('Total'.padEnd(16, '_') + ` ${(entry[1] - initialTime).toFixed(2)} ms`);
                    }
                });

                console.groupEnd();
            }, 500);
        }
    }

    checkOGLID()
    {
        if(serverTime.getTime() > this.id[1] + 86400000)
        {
            let version = this.version == 'beta' ? `${this.version}-${hash}` : this.version;

            let json =
            {
                ogl_id:this.id[0] || '-',
                version:version || '-',
                script_name:GM_info.script.name || '-',
                script_namespace:GM_info.script.downloadURL || '-',
            }

            fetch('https://ptre.chez.gg/scripts/oglight_update_version.php?tool=oglight', { method:'POST', body:JSON.stringify(json) })
            .then(response => response.json())
            .then(data =>
            {
                if(data.code == 1)
                {
                    this.id[1] = serverTime.getTime();
                    GM_setValue('ogl_id', this.id);
                }
            });
        }
    }
}

class CrawlerManager
{
    constructor(ogl)
    {
        this.ogl = ogl;
        this.ogl.db.stats.total = this.ogl.db.stats.total || {};
        if(this.ogl.page == 'highscore' || this.ogl.page == 'supplies') this.init();

        this.ogl.observeMutation(() =>
        {
            this.init();
        }, 'crawler');

        /*Util.getJSON(`https://${window.location.host}/game/index.php?page=fetchTechs`, result =>
        {
            this.ogl.current.techs = result;
            let coords = this.ogl.current.coords.join(':');
            if(this.ogl.current.type == 'moon') coords += ':M';

            this.ogl.db.me.planets[coords] = this.ogl.db.me.planets[coords] || {};
            this.ogl.db.me.planets[coords].techs = this.ogl.current.techs;

            // this.ogl.saveAsync();
        });*/

        // if(this.ogl.current.type == 'planet') this.getPlanetProduction();
    }

    init()
    {
        if(this.ogl.page == 'supplies')
        {
            let coords = this.ogl.current.coords.join(':');
            let upgrade = document.querySelector('.targetlevel')?.getAttribute('data-value');

            if(upgrade && this.ogl.current.type == 'planet')
            {
                let techID = document.querySelector('.targetlevel').closest('.technology').getAttribute('data-technology');

                this.ogl.db.me.planets[coords] = this.ogl.db.me.planets[coords] || {};
                this.ogl.db.me.planets[coords].upgrade = [techID, parseInt(upgrade)];

            }
            else
            {
                this.ogl.db.me.planets[coords] = this.ogl.db.me.planets[coords] || {};
                this.ogl.db.me.planets[coords].upgrade = [];
            }
            // this.ogl.saveAsync();
        }
        else if(this.ogl.page == 'highscore')
        {
            if(document.querySelector('#stat_list_content .ajaxLoad')
            || !document.querySelector('#row #player').classList.contains('active')) return;

            this.ogl.db.lastRankUpdate = !this.ogl.db.lastRankUpdate || typeof this.ogl.db.lastRankUpdate !== 'object' ? {} : this.ogl.db.lastRankUpdate;
            this.ogl.db.lastStatusUpdate = !this.ogl.db.lastStatusUpdate ||  typeof this.ogl.db.lastStatusUpdate !== 'object' ? {} : this.ogl.db.lastStatusUpdate;

            let rankPoint = document.querySelector('a#points').classList.contains('active');
            let rankFleet = document.querySelector('a#fleet').classList.contains('active');
            let rankPage = document.querySelector('.pagebar .activePager')?.textContent || 1;
            let updateRank = serverTime.getTime() - (this.ogl.db.lastRankUpdate?.[rankPage] || 0) > 12 * 60 * 60 * 1000;
            let updateStatus = serverTime.getTime() - (this.ogl.db.lastStatusUpdate?.[rankPage] || 0) > 12 * 60 * 60 * 1000;

            if(updateStatus)
            {
                Util.getXML(`https://${window.location.host}/api/players.xml`, result =>
                {
                    let xmlTimestamp = parseInt(result.querySelector('players').getAttribute('timestamp')) * 1000;

                    document.querySelectorAll('#ranks tbody > tr').forEach((line, index) =>
                    {
                        setTimeout(() =>
                        {
                            let id = line.getAttribute('id').replace('position', '');
                            let playerStatus = result.querySelector(`player[id="${id}"]`)?.getAttribute('status') || 'status_abbr_active';

                            if(playerStatus.indexOf('v') > -1  && playerStatus != 'status_abbr_active') playerStatus = 'status_abbr_vacation';
                            else if(playerStatus === "I") playerStatus = 'status_abbr_longinactive';
                            else if(playerStatus === "i") playerStatus = 'status_abbr_inactive';

                            let entryID = this.ogl.find(this.ogl.db.players, 'id', id)[0] ?? this.ogl.db.players.length;
                            let player = this.ogl.db.players[entryID];

                            if(player && (player.lastStatusUpdate ?? 0) < xmlTimestamp)
                            {
                                line.querySelector('.playername').classList.remove(Array.from(line.querySelector('.playername').classList).filter(e => e.startsWith('status_'))[0]);

                                this.ogl.db.players[entryID].status = playerStatus;

                                line.querySelector('.playername').classList.add(playerStatus);
                            }
                        }, index);
                    });

                    this.ogl.db.lastStatusUpdate[rankPage] = xmlTimestamp;
                    // this.ogl.saveAsync();
                });
            }

            // add status / names
            document.querySelectorAll('#ranks tbody > tr').forEach((line, index) =>
            {
                let id = line.getAttribute('id').replace('position', '');
                let playerIndex = this.ogl.find(this.ogl.db.players, 'id', id)[0] ?? this.ogl.db.players.length;

                let player = {};
                player.id = id;
                player.name = line.querySelector('.playername').textContent.trim();
                player.ally = line.querySelector('.ally-tag')?.textContent.trim().slice(1, -1);

                if(player.name.indexOf('...') > -1 && this.ogl.db.players[playerIndex]?.name && this.ogl.db.players[playerIndex].name.indexOf(player.name.replace(/\./g, '')) > -1)
                {
                    player.name = this.ogl.db.players[playerIndex].name;
                    line.querySelector('.playername').textContent = player.name;
                }

                if(rankPoint)
                {
                    player.rank = line.querySelector('.position').textContent.trim();
                    player.total = parseInt(line.querySelector('.score').textContent.replace(/\D/g,''));
                }
                else if(rankFleet)
                {
                    player.power = parseInt(line.querySelector('.score').textContent.replace(/\D/g,''));
                }

                if(!player.id) return;
                this.ogl.db.players[playerIndex] = {...this.ogl.db.players[playerIndex], ...player};

                if(this.ogl.db.players?.[playerIndex]?.status)
                {
                    let status = Array.from(this.ogl.db.players[playerIndex].status.split(' ')).filter(e => e.startsWith('status_'))[0];
                    line.querySelector('.playername').classList.add(status);
                }

                line.querySelector('.playername').classList.remove('status_abbr_honorableTarget');

                // check rank et score
                if(rankPoint && updateRank)
                {
                    this.ogl.db.players[playerIndex].veryOldRank = this.ogl.db.players[playerIndex].oldRank || this.ogl.db.players[playerIndex].rank;
                    this.ogl.db.players[playerIndex].oldRank = this.ogl.db.players[playerIndex].rank || player.rank;

                    this.ogl.db.players[playerIndex].veryOldTotal = this.ogl.db.players[playerIndex].oldTotal || this.ogl.db.players[playerIndex].total || player.total;
                    this.ogl.db.players[playerIndex].oldTotal = this.ogl.db.players[playerIndex].total || player.total;
                }

                player = this.ogl.db.players[playerIndex];

                // display rank & score movements
                if(rankPoint)
                {
                    let rankMovement = (player.veryOldRank || 0) - player.rank;
                    if(!player.veryOldRank)
                    {
                        line.querySelector('.movement').textContent = 'NEW';
                        line.querySelector('.movement').classList.add('ogl_warning');
                    }
                    else
                    {
                        if(player.veryOldRank != player.rank)
                        {
                            let sign = rankMovement > 0 ? '+' : '';

                            line.querySelector('.movement').textContent = `(${sign + parseInt(rankMovement)})`;

                            if(rankMovement > 0) line.querySelector('.movement').classList.add('ogl_ok');
                            else if(rankMovement < 0) line.querySelector('.movement').classList.add('ogl_danger');
                        }
                        else line.querySelector('.movement').textContent = '-';
                    }

                    let diff = (player.total - player.veryOldTotal) || 0;
                    let diffSign = diff > 0 ? '+' : '';
                    line.querySelector('.ogl_scoreDiff') && line.querySelector('.ogl_scoreDiff').remove();
                    let scoreDiff = line.querySelector('.score').appendChild(Util.createDom('div', {'class':'ogl_scoreDiff'}, diffSign + Util.formatNumber(diff)));
                    if(diff > 0) scoreDiff.classList.add('ogl_ok');
                    else if(diff < 0) scoreDiff.classList.add('ogl_danger');
                    else scoreDiff.classList.add('ogl_none');
                }
            });

            if(rankPoint && updateRank) this.ogl.db.lastRankUpdate[rankPage] = serverTime.getTime();

            // this.ogl.saveAsync();
        }
        else if(this.ogl.page == 'galaxy')
        {
            // store spy probes to send
            if(!this.spyProbeCountDone && document.querySelector('a[onclick*="sendShips"]'))
            {
                let ships = document.querySelector('a[onclick*="sendShips"]').getAttribute('onclick').match(/\d+/g).map(Number);
                if(ships[0] == 6 && ships[5] != this.ogl.db.spyProbesCount)
                {
                    this.ogl.db.spyProbesCount = ships[5];
                    this.spyProbeCountDone = true;
                    // this.ogl.saveAsync();
                }
            }

            // antispam galaxy security
            if(this.ogl.galaxyCoords[0] != document.querySelector('#galaxy_input').value || this.ogl.galaxyCoords[1] != document.querySelector('#system_input').value) return;

            this.ogl.component.tooltip.close(true);

            let ptrePosition = {};
            let ptreActivities = {};
            let selector = document.querySelectorAll('.galaxyTable .ctContentRow');
            let refreshPinnedTarget = false;
            let currentSystemRaw = parseInt(galaxy)*1000+parseInt(system);

            selector.forEach(line =>
            {
                if(!line.querySelector('.position') && !line.querySelector('.cellPosition')) return; // ignore p16 & 17
                if(line.querySelector('.playername.admin') || line.querySelector('.cellPlayerName.admin')) return; // ignore admins

                let isOld = false; // old OGL data format
                let info = this.getCurrentInfo(line);
                let player = info[0];
                let planet = info[1];

                let planetIndex = this.ogl.find(this.ogl.db.positions, 'coords', planet.coords)[0];

                if(this.ogl.ptre)
                {
                    let oldPositionEntry = this.ogl.db.positions[planetIndex];

                    if(oldPositionEntry || this.ogl.db.checkedSystems.indexOf(currentSystemRaw) > -1)
                    {
                        let oldPlayerEntry;
                        oldPositionEntry = oldPositionEntry || { id:-1, playerID:-1 };

                        if(oldPositionEntry && oldPositionEntry.playerID && oldPositionEntry.playerID > -1)
                        {
                            let oldPlayerIndex = this.ogl.find(this.ogl.db.players, 'id', oldPositionEntry.playerID)[0];
                            oldPlayerEntry = this.ogl.db.players[oldPlayerIndex];

                            if(oldPlayerEntry && document.querySelector('.ogl_sideView.ogl_active') && this.ogl.db.sidebarView == 'pinned' && this.ogl.db.pinnedList[0] == oldPlayerEntry)
                            {
                                refreshPinnedTarget = true;
                            }
                        }
                        else if(this.ogl.db.checkedSystems.indexOf(currentSystemRaw) > -1) oldPlayerEntry = {};

                        // prepare PTRE positions
                        if(oldPositionEntry
                        && (planet.id != oldPositionEntry.id || player.id != oldPositionEntry.playerID || planet.moonID != oldPositionEntry.moonID))
                        {
                            if((!oldPositionEntry?.playerID || oldPositionEntry?.playerID == -1) && player.id == -1) return;

                            ptrePosition[planet.coords] = {}
                            ptrePosition[planet.coords].id = planet.id;
                            ptrePosition[planet.coords].teamkey = this.ogl.ptre;
                            ptrePosition[planet.coords].galaxy = planet.coords.split(':')[0];
                            ptrePosition[planet.coords].system = planet.coords.split(':')[1];
                            ptrePosition[planet.coords].position = planet.coords.split(':')[2];
                            ptrePosition[planet.coords].timestamp_ig = serverTime.getTime();

                            ptrePosition[planet.coords].player_id = player.id;
                            ptrePosition[planet.coords].name = player.name || false;
                            ptrePosition[planet.coords].rank = player.rank || -1;
                            ptrePosition[planet.coords].score = player.total || -1;
                            ptrePosition[planet.coords].fleet = player.fleet || -1;
                            ptrePosition[planet.coords].status = player.statusTags;

                            ptrePosition[planet.coords].old_player_id = oldPositionEntry?.playerID || -1;
                            ptrePosition[planet.coords].timestamp_api = oldPlayerEntry?.lastAPIUpdate || -1;
                            ptrePosition[planet.coords].old_name = oldPlayerEntry?.name || false;
                            ptrePosition[planet.coords].old_rank = oldPlayerEntry?.rank || -1;
                            ptrePosition[planet.coords].old_score = oldPlayerEntry?.total || -1;
                            ptrePosition[planet.coords].old_fleet = oldPlayerEntry?.fleet || -1;

                            if(planet.moonID > -1)
                            {
                                ptrePosition[planet.coords].moon = {};
                                ptrePosition[planet.coords].moon.id = planet.moonID;
                            }
                        }
                    }
                }

                // save new player data
                if(player.id)
                {
                    let playerEntryID = this.ogl.find(this.ogl.db.players, 'id', player.id)[0] ?? this.ogl.db.players.length;
                    if(this.ogl.db.players[playerEntryID]?.id == -2) isOld = true;
                    this.ogl.db.players[playerEntryID] = {...this.ogl.db.players[playerEntryID], ...player};
                }

                planetIndex = planetIndex ?? this.ogl.db.positions.length;

                // unmark empty positions if needed
                if(this.ogl.db.positions[planetIndex]?.color)
                {
                    if((this.ogl.db.positions[planetIndex]?.id != planet.id && !isOld) || planet.id == -1)
                    {
                        planet.color = false;
                    }
                }

                // save (or remove) new position data
                this.ogl.db.positions[planetIndex] = {...this.ogl.db.positions[planetIndex], ...planet}
                if(planet.id == -1 || player.id == -1)
                {
                    delete this.ogl.db.positions[planetIndex];
                    this.ogl.db.positions.splice(planetIndex, 1);
                }

                // update targets list if needed
                if(document.querySelector('.ogl_sideView.ogl_active') && this.ogl.db.sidebarView == 'targetList')
                {
                    document.querySelectorAll(`.ogl_sideView [data-playerID="${planet.playerID}"]`).forEach(e =>
                    {
                        if(player.id != -1)
                        {
                            e.querySelectorAll('div')[1].textContent = player.name;
                            e.querySelectorAll('div')[1].className = '';
                            e.querySelectorAll('div')[1].classList.add(player.status);
                        }
                        else e.remove();
                    });
                }

                // prepare PTRE activities
                if(this.ogl.ptre && planet.id > -1 && player.id > -1 && this.ogl.db.pinnedList.indexOf(player.id) > -1)
                {
                    ptreActivities[planet.coords] = {};
                    ptreActivities[planet.coords].id = planet.id;
                    ptreActivities[planet.coords].player_id = player.id;
                    ptreActivities[planet.coords].teamkey = this.ogl.ptre;
                    ptreActivities[planet.coords].mv = line.querySelector('span[class*="vacation"]') ? true : false;
                    ptreActivities[planet.coords].activity = planet.activity;
                    ptreActivities[planet.coords].galaxy = planet.coords.split(':')[0];
                    ptreActivities[planet.coords].system = planet.coords.split(':')[1];
                    ptreActivities[planet.coords].position = planet.coords.split(':')[2];
                    ptreActivities[planet.coords].main = this.ogl.db.positions[planetIndex].main || false;

                    if(planet.moonID > -1)
                    {
                        ptreActivities[planet.coords].moon = {};
                        ptreActivities[planet.coords].moon.id = planet.moonID;
                        ptreActivities[planet.coords].moon.activity = planet.moonActivity;
                    }
                }
            });

            this.ogl.db.checkedSystems.push(currentSystemRaw);

            // this.ogl.saveAsync();

            // refresh pinned menu
            if(document.querySelector('.ogl_sideView.ogl_active') && this.ogl.db.sidebarView == 'pinned') refreshPinnedTarget = true;

            // send activities to PTRE
            if(Object.keys(ptreActivities).length > 0)
            {
                let tmpCoords = [galaxy, system];

                fetch('https://ptre.chez.gg/scripts/oglight_import_player_activity.php?tool=oglight', { method:'POST', body:JSON.stringify(ptreActivities) })
                .then(response => response.json())
                .then(data =>
                {
                    Util.logPtre(data, {galaxy:galaxy, system:system});

                    if(data.code == 1)
                    {
                        if(refreshPinnedTarget && this.ogl.component.sidebar)
                        {
                            new Promise(resolve =>
                            {
                                resolve(this.ogl.component.sidebar.displayPinnedTarget());
                            })
                            .then(() =>
                            {
                                document.querySelectorAll(`.ogl_pinnedContent [data-coords^="${tmpCoords[0]}:${tmpCoords[1]}:"]`).forEach(e =>
                                {
                                    if(!e.querySelector('.ogl_checked')) e.appendChild(Util.createDom('div', {'class':'material-icons ogl_checked tooltipLeft', 'title':data.message}, 'check_circle'));
                                });
                            });
                        }
                    }
                });
            }
            else if(refreshPinnedTarget) this.ogl.component.sidebar?.displayPinnedTarget(); // update position

            // send positions to PTRE
            if(Object.keys(ptrePosition).length > 0)
            {
                fetch('https://ptre.chez.gg/scripts/api_galaxy_import_infos.php?tool=oglight', { method:'POST', body:JSON.stringify(ptrePosition) })
                .then(response => response.json())
                .then(data =>
                {
                    Util.logPtre(data, {galaxy:galaxy, system:system});

                    if(data.code != 1) console.log("Can't send data to PTRE");
                    else
                    {
                        console.log('PTRE : ', currentSystemRaw, ptrePosition)
                        if(document.querySelector('.ogl_sideView.ogl_active') && this.ogl.db.sidebarView == 'pinned' && this.ogl.db.pinnedList[0] == player.id) this.ogl.component.sidebar?.displayPinnedTarget();
                    }
                });
            }
        }

        this.ogl.performances.push(['Crawler',performance.now()]);
    }

    getCurrentInfo(line)
    {
        let player = {};
        let planet = {};

        // update player data
        player.id = line.querySelector('.cellPlayerName').textContent.trim().length == 0 ? - 1 : line.querySelector('.cellPlayerName [rel^="player"]')?.getAttribute('rel').replace('player', '') || this.ogl.account.id;
        player.name = line.querySelector('.cellPlayerName [rel^="player"]')?.childNodes[0].textContent.trim() || line.querySelector('.cellPlayerName .ownPlayerRow')?.textContent.trim();
        player.status = Array.from(line.querySelector('.cellPlayerName span[class*="status_"]')?.classList || []).filter(e => e.startsWith('status_'))[0];
        player.lastUpdate = serverTime.getTime();
        player.lastStatusUpdate = serverTime.getTime();

        if(player.status == 'status_abbr_honorableTarget') player.status = 'status_abbr_active';

        let status = line.querySelector('.cellPlayerName pre')?.textContent.trim().replace('(', '').replace(')', '').replace(/ /g, '').replace('ph', '').replace('A', '').replace('o', '').replace('f', '').replace('d', '').replace(',', '') || '';
        if(player.id == -1) status = -1;

        player.statusTags = status;

        let tooltip = document.querySelector('#player'+player.id);
        if(tooltip)
        {
            player.name = tooltip.querySelector('h1 span').textContent;
            player.rank = tooltip.querySelector('.rank a')?.textContent || -1;
        }
        else if(player.id > -1)
        {
            player.rank = this.ogl.account.rank;
        }

        let position = parseInt(line.querySelector('.cellPosition').textContent);
        let coords = `${document.querySelector('#galaxy_input').value}:${document.querySelector('#system_input').value}:${position}`;

        // update position
        planet.id = line.querySelector('[data-planet-id]')?.getAttribute('data-planet-id') || -1;
        planet.playerID = line.querySelector('.cellPlayerName').textContent.trim().length == 0 ? -1 : line.querySelector(`.cellPlayerName [rel^="player"]`)?.getAttribute('rel').replace('player', '') || this.ogl.account.id;
        planet.coords = coords;
        planet.rawCoords = coords.split(':').map(x => x.padStart(3, '0')).join('');
        planet.moonID = line.querySelector('[data-moon-id]')?.getAttribute('data-moon-id') || -1;
        planet.lastUpdate = serverTime.getTime();
        planet.activity = line.querySelector('[data-planet-id] .activity.minute15') ? '*' : line.querySelector('[data-planet-id] .activity')?.textContent.trim() || 60;
        planet.moonActivity = line.querySelector('[data-moon-id] .activity.minute15') ? '*' : line.querySelector('[data-moon-id] .activity')?.textContent.trim() || 60;

        return [player, planet];
    }

    buildStalkWindow(playerID)
    {
        let playerIndex = this.ogl.find(this.ogl.db.players, 'id', playerID)[0];
        let player = this.ogl.db.players[playerIndex];

        let content = Util.createDom('div', {'class':'galaxyTooltip'});
        content.innerHTML =
        `<h1><span>${player.name}</span><a href="https://${window.location.host}/game/index.php?page=highscore&site=${Math.max(1, Math.ceil(player.rank / 100))}&category=1&searchRelId=${player.id}" data-rank="${player.rank == -1 ? '(b)' : player.rank}" class="ogl_ranking">${player.rank == -1 ? '(b)' : '#'+player.rank}</a></h1>
        <div class="ogl_actions"></div>
        <div class="ogl_stalkActions"></div>
        <div class="ogl_colorAll"></div>
        <div class="ogl_stalkInfo">
            <div class="ogl_stalkPlanets"></div>
            <div class="ogl_stalkPoints">
                <div title="${Util.formatNumber(player.total)}"><i class="material-icons">star</i>${Util.formatToUnits(player.total)}</div>
                <div title="${Util.formatNumber(player.eco)}"><i class="material-icons">attach_money</i>${Util.formatToUnits(player.eco)}</div>
                <div title="${Util.formatNumber(player.tech)}"><i class="material-icons">science</i>${Util.formatToUnits(player.tech)}</div>
                <div title="${Util.formatNumber(player.fleet)}"><i class="material-icons">military_tech</i>${Util.formatToUnits(player.fleet)}</div>
                <div title="${Util.formatNumber(player.def)}"><i class="material-icons">security</i>${Util.formatToUnits(player.def)}</div>
            </div>
        </div>`;

        let actions = content.querySelector('.ogl_stalkActions');

        let write = actions.appendChild(Util.createDom('div', {'class':'ogl_button material-icons', 'data-playerid':player.id}, 'edit'));
        if(document.querySelector('#chatBar'))
        {
            write.classList.add('sendMail');
            write.classList.add('js_openChat');
        }
        else write.addEventListener('click', () => window.location.href = `https://${window.location.host}/game/index.php?page=chat&playerId=${player.id}`);

        let buddy = actions.appendChild(Util.createDom('adiv', {'class':'ogl_button material-icons'}, 'person_add_alt_1'));
        buddy.addEventListener('click', () => window.location.href = `https://${window.location.host}/game/index.php?page=ingame&component=buddies&action=7&id=${player.id}&ajax=1`);

        let ignore = actions.appendChild(Util.createDom('adiv', {'class':'ogl_button material-icons'}, 'block'));
        ignore.addEventListener('click', () => window.location.href = `https://${window.location.host}/game/index.php?page=ignorelist&action=1&id=${player.id}`);

        let mmorpgstats = actions.appendChild(Util.createDom('adiv', {'class':'ogl_button material-icons'}, 'leaderboard'));
        mmorpgstats.addEventListener('click', () =>
        {
            let lang = ['fr', 'de', 'en', 'es', 'pl', 'it', 'ru', 'ar', 'mx', 'tr', 'fi', 'tw', 'gr', 'br', 'nl',
                    'hr', 'sk', 'cz', 'ro', 'us', 'pt', 'dk', 'no', 'se', 'si', 'hu', 'jp', 'ba'].indexOf(this.ogl.universe.lang);

            let link = `https://www.mmorpg-stat.eu/0_fiche_joueur.php?pays=${lang}&ftr=${player.id.replace(/\D/g,'')}.dat&univers=_${this.ogl.universe.number}`;
            window.open(link, '_blank');
        });

        let pin = actions.appendChild(Util.createDom('div', {'class':'ogl_button material-icons'}, 'push_pin'));
        pin.addEventListener('click', () =>
        {
            this.ogl.db.pinnedList.forEach((e, index) =>
            {
                if(e && e == player.id) this.ogl.db.pinnedList.splice(index, 1);
            });

            this.ogl.db.pinnedList.unshift(player.id);
            if(this.ogl.db.pinnedList.length > this.ogl.maxPinnedTargets) this.ogl.db.pinnedList.length = this.ogl.maxPinnedTargets;

            // this.ogl.saveAsync();

            this.ogl.component.sidebar?.displayPinnedTarget();
            this.ogl.component.crawler.checkPlayerApi(this.ogl.db.pinnedList[0]);
        });

        this.ogl.component.color.addColorUI(false, content.querySelector('.ogl_colorAll'), this.ogl.find(this.ogl.db.positions, 'playerID', player.id, true));

        let planetCount = 0;
        let rawStart = '000000';
        let multi = 1;
        let isMulti = false;

        this.ogl.find(this.ogl.db.positions, 'playerID', player.id, true).forEach(planetIndex =>
        {
            let planet = this.ogl.db.positions[planetIndex];
            let splitted = planet.coords.split(':');

            let item = Util.createDom('div', {'data-coords':planet.coords});
            let coordsDiv = item.appendChild(Util.createDom('span', {}, planet.coords));

            coordsDiv.addEventListener('click', () =>
            {
                this.ogl.component.tooltip.close(true);
                this.ogl.component.galaxy.goToPosition(splitted[0], splitted[1], splitted[2]);
            });

            if(this.ogl.page == 'galaxy' && document.querySelector('#galaxy_input').value == splitted[0] && document.querySelector('#system_input').value == splitted[1])
            {
                coordsDiv.classList.add('ogl_currentSystem');
            }

            if(planet.main) item.appendChild(Util.createDom('div', {'class':'material-icons ogl_mainPlanet'}, 'star'));

            let mSpy = item.appendChild(Util.createDom('div', {'class':'ogl_moonIcon material-icons', 'data-type':3}, 'brightness_2'));
            mSpy.addEventListener('click', () => this.ogl.component.fleet.sendSpyProbe([splitted[0], splitted[1], splitted[2], 3], this.ogl.db.spyProbesCount, mSpy, true));
            if(serverTime.getTime() - planet.lastMoonSpy < 60 * 60 * 1000) mSpy.classList.add('ogl_done');

            let pSpy = item.appendChild(Util.createDom('div', {'class':'ogl_planetIcon material-icons', 'data-type':1}, 'language'));
            pSpy.addEventListener('click', () => this.ogl.component.fleet.sendSpyProbe([splitted[0], splitted[1], splitted[2], 1], this.ogl.db.spyProbesCount, pSpy, true));
            if(serverTime.getTime() - planet.lastSpy < 60 * 60 * 1000) pSpy.classList.add('ogl_done');

            if(planet.moonID > 0) mSpy.classList.add('ogl_active');
            planet.color ? item.setAttribute('data-color', planet.color) : item.removeAttribute('data-color');

            content.querySelector('.ogl_stalkPlanets').appendChild(item);

            if(rawStart == planet.rawCoords.slice(0, -3))
            {
                item.setAttribute('data-multi', multi);
                isMulti = true;
            }
            else if(isMulti)
            {
                multi++;
                isMulti = false;
            }

            rawStart = planet.rawCoords.slice(0, -3);

            planetCount++;
        });

        content.querySelector('.ogl_stalkPoints').appendChild(Util.createDom('div', {}, `<i class="material-icons">language</i>${planetCount}`));

        return content;
    }

    getPlanetProduction()
    {
        return;
        let currentCoords = this.ogl.current.coords.join(':');

        ['metal', 'crystal', 'deut'].forEach((res, index) =>
        {
            let data = resourcesBar.resources[res.replace('deut', 'deuterium')].tooltip;
            //let currentRes = Math.floor(resourcesBar.resources[res.replace('deut', 'deuterium')].amount);
            let prod = data.replace(/\./g, '').match(/\d+/g)[2];

            this.ogl.db.me.planets[currentCoords] = this.ogl.db.me.planets[currentCoords] || {};
            this.ogl.db.me.planets[currentCoords].production = this.ogl.db.me.planets[currentCoords].production || [];
            this.ogl.db.me.planets[currentCoords].storage = this.ogl.db.me.planets[currentCoords].storage || [];

            if(data.indexOf('overmark') == -1)
            {
                this.ogl.db.me.planets[currentCoords].production[index] = (prod / 3600).toFixed(2);
            }

            this.ogl.db.me.planets[currentCoords].storage[index] = resourcesBar.resources[res.replace('deut', 'deuterium')].storage;

            this.ogl.db.me.planets[currentCoords].production[3] = serverTime.getTime();
        });

        // this.ogl.saveAsync();
    }

    checkPlayerPtre(playerID, callback)
    {
        if(this.ogl.ptre)
        {
            Util.getJSON(`https://ptre.chez.gg/scripts/api_galaxy_get_infos.php?tool=oglight&team_key=${this.ogl.ptre}&player_id=${playerID}`, ptreData =>
            {
                Util.logPtre(ptreData, {playerID:playerID});

                if(ptreData.code == 1)
                {
                    let playerEntryID = this.ogl.find(this.ogl.db.players, 'id', playerID)[0] ?? this.ogl.db.players.length;
                    this.ogl.db.players[playerEntryID] = this.ogl.db.players[playerEntryID] || {};
                    this.ogl.db.players[playerEntryID].lastPTRECheck = serverTime.getTime();

                    ptreData.galaxy_array.forEach(entry =>
                    {
                        let planet = {};
                        planet.id = entry.id;
                        planet.playerID = entry.player_id;
                        planet.coords = entry.coords;
                        planet.rawCoords =  entry.coords.split(':').map(x => x.padStart(3, '0')).join('');
                        planet.moonID = entry.moon?.id ?? -1;
                        planet.lastUpdate = entry.timestamp_ig;
                        planet.activity = false;
                        planet.moonActivity = false;

                        let planetEntryID = this.ogl.find(this.ogl.db.positions, 'coords', planet.coords)[0] ?? this.ogl.db.positions.length;

                        this.ogl.db.positions[planetEntryID] = this.ogl.db.positions[planetEntryID] || {};

                        if(!this.ogl.db.positions[planetEntryID].lastUpdate || this.ogl.db.positions[planetEntryID].lastUpdate < planet.lastUpdate)
                        {
                            this.ogl.db.positions[planetEntryID] = {...this.ogl.db.positions[planetEntryID], ...planet};
                        }
                    });

                    // this.ogl.saveAsync();
                }

                if(callback) callback(playerID);
                if(document.querySelector('.ogl_sideView.ogl_active') && this.ogl.db.sidebarView == 'pinned' && this.ogl.db.pinnedList[0] == playerID) this.ogl.component.sidebar?.displayPinnedTarget();
            });
        }
    }

    checkPlayerApi(playerID, callback, forced)
    {
        if(!playerID || playerID <= 0) return;

        let lastAPICheck = this.ogl.db.players[this.ogl.find(this.ogl.db.players, 'id', playerID)[0]]?.lastAPICheck || 0;
        let lastPTRECheck = this.ogl.db.players[this.ogl.find(this.ogl.db.players, 'id', playerID)[0]]?.lastPTRECheck || 0;

        if(serverTime.getTime() - lastAPICheck > 3 * 60 * 60 * 1000)
        {
            Util.getXML(`https://${window.location.host}/api/playerData.xml?id=${playerID}`, result =>
            {
                let playerEntryID = this.ogl.find(this.ogl.db.players, 'id', playerID)[0] ?? this.ogl.db.players.length;

                let player = {};
                player.id = playerID;
                player.total = parseInt(result.querySelector('position[type="0"]').getAttribute('score'));
                player.eco = parseInt(result.querySelector('position[type="1"]').getAttribute('score'));
                player.tech = parseInt(result.querySelector('position[type="2"]').getAttribute('score'));
                player.power = parseInt(result.querySelector('position[type="3"]').getAttribute('score'));
                player.def = Math.max(player.power - (player.total - player.eco - player.tech), 0);
                player.fleet = player.power - player.def;
                player.ally = result.querySelector('alliance tag')?.textContent || false;
                player.lastAPICheck = serverTime.getTime();
                player.lastPTRECheck = serverTime.getTime();
                player.lastAPIUpdate = parseInt(result.querySelector('playerData').getAttribute('timestamp')) * 1000;
                player.name = result.querySelector('playerData').getAttribute('name');

                if(this.ogl.page == 'highscore') player.rank = document.querySelector(`#position${playerID} .position`)?.textContent.trim();

                if(this.ogl.db.players[playerEntryID]?.name && this.ogl.db.players[playerEntryID].name.indexOf('...') == -1)
                {
                    player.name = this.ogl.db.players[playerEntryID].name;
                }

                this.ogl.db.players[playerEntryID] = {...this.ogl.db.players[playerEntryID], ...player};

                // update player positions
                result.querySelectorAll('planet').forEach((apiPlanet, index) =>
                {
                    let planet = {};
                    planet.id = apiPlanet.getAttribute('id');
                    planet.playerID = playerID;
                    planet.coords = apiPlanet.getAttribute('coords');
                    planet.rawCoords = apiPlanet.getAttribute('coords').split(':').map(x => x.padStart(3, '0')).join('');
                    planet.moonID = apiPlanet.querySelector('moon')?.getAttribute('id') ?? -1;
                    planet.main = !index;
                    planet.lastUpdate = parseInt(result.querySelector('playerData').getAttribute('timestamp')) * 1000;
                    planet.lastAPIUpdate = parseInt(result.querySelector('playerData').getAttribute('timestamp')) * 1000;
                    planet.activity = false;
                    planet.moonActivity = false;

                    let planetEntryID = this.ogl.find(this.ogl.db.positions, 'coords', planet.coords)[0] ?? this.ogl.db.positions.length;

                    this.ogl.db.positions[planetEntryID] = this.ogl.db.positions[planetEntryID] || {};

                    if(!this.ogl.db.positions[planetEntryID].lastUpdate || this.ogl.db.positions[planetEntryID].lastUpdate < planet.lastUpdate)
                    {
                        this.ogl.db.positions[planetEntryID] = {...this.ogl.db.positions[planetEntryID], ...planet};
                    }

                    if(planet.main) this.ogl.db.positions[planetEntryID].main = true;
                    else this.ogl.db.positions[planetEntryID].main = false;
                });

                // this.ogl.saveAsync();

                if(this.ogl.ptre) this.checkPlayerPtre(playerID, callback);
                else if(callback) callback(playerID, callback);
            });
        }
        else if(this.ogl.ptre && (forced || serverTime.getTime() - lastPTRECheck > 10 * 60 * 1000))
        {
            this.checkPlayerPtre(playerID, callback);
        }
        else
        {
            if(callback) callback(playerID, callback);
        }
    }
}

class HighscoreManager
{
    constructor(ogl)
    {
        this.ogl = ogl;
        if(this.ogl.page == 'highscore') this.init();
        this.ogl.observeMutation(() => this.init(), 'highscore');
    }

    init()
    {
        if(!document.querySelector('.playername')) return;

        document.querySelectorAll('#ranks tbody tr').forEach(line =>
        {
            line.querySelector('.playername').classList.add('tooltipRight');
            line.querySelector('.playername').classList.add('tooltipClose');
            line.querySelector('.playername').setAttribute('data-title', 'loading...');

            line.querySelector('.playername').addEventListener('mouseenter', e =>
            {
                let id = line.getAttribute('id').replace('position', '');
                if(e.target?.classList.contains('ogl_highlight')) return;

                this.ogl.component.crawler.checkPlayerApi(id, () =>
                {
                    this.ogl.component.tooltip.update(e.target, this.ogl.component.crawler.buildStalkWindow(id));
                });
            });
        });

        this.ogl.performances.push(['Highscore',performance.now()]);
    }
}

class GalaxyManager
{
    constructor(ogl)
    {
        this.ogl = ogl;
        //if(this.ogl.page == 'galaxy') this.init();
        this.ogl.observeMutation(() => this.init(), 'galaxy');

        if(this.ogl.page == 'galaxy')
        {
            document.querySelector('#galaxyLoading').setAttribute('data-currentPosition', `${galaxy}:${system}`);

            let updateTargets = (g, s) =>
            {
                document.querySelectorAll('.ogl_stalkPlanets.ogl_scrollable > div.ogl_currentSystem').forEach(item => item.classList.remove('ogl_currentSystem'));
                document.querySelectorAll(`.ogl_stalkPlanets.ogl_scrollable > div[data-minicoords="${g}:${s}"]`).forEach(item => item.classList.add('ogl_currentSystem'));
            }

            // old galaxy perf fix
            /*loadContent = (g, s) =>
            {
                mobile = true;
                isMobile = true;

                if(this.xhr) this.xhr.abort();
                $("#galaxyLoading").show();
                document.querySelector('#galaxyLoading').setAttribute('data-currentPosition', `${g}:${s}`);

                if(0 === galaxy.length || !$.isNumeric(+galaxy)) g = 1;
                if(0 === system.length || !$.isNumeric(+system)) s = 1;

                $("#galaxy_input").val(g);
                $("#system_input").val(s);

                let phalanxSystemLink = $('#galaxyHeader .phalanxlink.btn_system_action');

                if(phalanxSystemLink.length) phalanxSystemLink.attr('href', phalanxSystemLink.attr('href').replace(/(galaxy=)\d+/, "$1" + galaxy).replace(/(system=)\d+/, "$1" + system));

                this.xhr = $.post(contentLink, {
                    galaxy:g,
                    system:s
                }, displayContentGalaxy)
                .always(function()
                {
                    mobile = false;
                    isMobile = false;
                });

                updateTargets(g, s);
            }*/

            loadContentNew = (g, s) =>
            {
                this.ogl.galaxyLoaded = false;

                if(!canSwitchGalaxy && notEnoughDeuteriumMessage)
                {
                    fadeBox(notEnoughDeuteriumMessage, true);
                    return;
                }

                if(this.xhr) this.xhr.abort();
                $("#galaxyLoading").show();
                document.querySelector('#galaxyLoading').setAttribute('data-currentPosition', `${g}:${s}`);

                if(0 === galaxy.length || !$.isNumeric(+galaxy)) g = 1;
                if(0 === system.length || !$.isNumeric(+system)) s = 1;

                $("#galaxy_input").val(g);
                $("#system_input").val(s);

                let phalanxSystemLink = $('#galaxyHeader .phalanxlink.btn_system_action');

                if(phalanxSystemLink.length) phalanxSystemLink.attr('href', phalanxSystemLink.attr('href').replace(/(galaxy=)\d+/, "$1" + galaxy).replace(/(system=)\d+/, "$1" + system));

                this.xhr = $.post(galaxyContentLink, {
                    galaxy:g,
                    system:s
                }, renderContentGalaxy);

                updateTargets(g, s);
            }
        }

        this.goToPosition = (g, s, p) =>
        {
            if(this.ogl.page == 'galaxy')
            {
                this.ogl.component.tooltip.container.textContent = '';
                this.ogl.component.tooltip.close(true);

                galaxy = g;
                system = s;

                loadContentNew(g, s);
            }
            else
            {
                Util.redirect(`https://${window.location.host}/game/index.php?page=ingame&component=galaxy&galaxy=${g}&system=${s}&position=${p}`, this.ogl);
            }
        }

        this.ogl.performances.push(['Galaxy',performance.now()]);
    }

    init()
    {
        document.querySelectorAll('.galaxyTable .ctContentRow').forEach(line =>
        {
            line.removeAttribute('data-color');
            line.querySelector('.cellPlayerName').classList.remove('tooltipRel');
            line.querySelector('.cellDebris').classList.remove('ogl_active');

            if(!line.querySelector('.cellPosition')) return; // ignore p16 & 17
            if(line.querySelector('.cellPlayerName.admin')) return; // ignore admins

            let id;
            if(line.querySelector('.ownPlayerRow')) id = this.ogl.account.id;
            else id = line.querySelector('.cellPlayerName [rel^="player"]')?.getAttribute('rel').replace('player', '');

            if(id)
            {
                let position = line.querySelector('.cellPosition').textContent;

                if(position >= 10) line.querySelector('.cellPlayerName > span[class*="status_"]').classList.add('tooltipRightTop');
                else line.querySelector('.cellPlayerName > span[class*="status_"]').classList.add('tooltipRight');

                line.querySelector('.cellPlayerName > span[class*="status_"]').classList.add('ogl_noPointer');
                line.querySelector('.cellPlayerName > span[class*="status_"]').classList.add('tooltipClose');
                line.querySelector('.cellPlayerName > span[class*="status_"]').classList.remove('tooltipRel');
                line.querySelector('.cellPlayerName > span[class*="status_"]').setAttribute('data-title', 'loading...');
                line.querySelector('.cellPlayerName > span[class*="status_"]').classList.remove('ogl_noPointer');

                let player = this.ogl.db.players[this.ogl.find(this.ogl.db.players, 'id', id)[0]];

                if(!player) return;
                let a = Util.createDom('a', {'class':'float_right', 'href':`https://${window.location.host}/game/index.php?page=highscore&site=${Math.max(1, Math.ceil(player.rank / 100))}&category=1&searchRelId=${player.id}`}, `${player.rank == -1 ? '(b)' : '#'+player.rank}`);
                line.querySelector('.cellPlayerName').appendChild(a);

                line.querySelector('.cellPlayerName > span[class*="status_"]').addEventListener('mouseenter', e =>
                {
                    if(e.target.classList.contains('ogl_highlight')) return;

                    this.ogl.component.crawler.checkPlayerApi(id, () =>
                    {
                        this.ogl.component.tooltip.update(e.target, this.ogl.component.crawler.buildStalkWindow(id));
                    });
                });

                // pin target
                line.querySelector('.cellPlayerName > span[class*="status_"]').addEventListener('click', () =>
                {
                    this.ogl.db.pinnedList.forEach((e, index) =>
                    {
                        if(e && e == player.id) this.ogl.db.pinnedList.splice(index, 1);
                    });

                    this.ogl.db.pinnedList.unshift(player.id);
                    if(this.ogl.db.pinnedList.length > this.ogl.maxPinnedTargets) this.ogl.db.pinnedList.length = this.ogl.maxPinnedTargets;

                    // this.ogl.saveAsync();

                    new Promise(resolve =>
                    {
                        resolve(this.ogl.component.crawler.checkPlayerApi(this.ogl.db.pinnedList[0]));
                    })
                    .then(() =>
                    {
                        this.ogl.component.sidebar.displayPinnedTarget();
                    })
                    .then(() =>
                    {
                        document.querySelectorAll(`.ogl_pinnedContent [data-coords^="${galaxy}:${system}:"]`).forEach(e =>
                        {
                            if(!e.querySelector('.ogl_checked')) e.appendChild(Util.createDom('div', {'class':'material-icons ogl_checked'}, 'check_circle'));
                        });
                    });
                });

                let planetID = line.querySelector('[data-planet-id]').getAttribute('data-planet-id');
                let index = this.ogl.find(this.ogl.db.positions, 'id', planetID, true);
                line.setAttribute('data-color', this.ogl.db.positions[index[0]]?.color);
                let button = line.querySelector('.cellPlanetName').appendChild(Util.createDom('div', {'class':'ogl_colorButton tooltipClose', 'data-color':this.ogl.db.positions[index[0]]?.color}));
                button.addEventListener('click', event =>
                {
                    let content = Util.createDom('div', {'class':'ogl_colorAll ogl_tooltipColor'});
                    this.ogl.component.color.addColorUI(button, content, index, event);
                    this.ogl.component.tooltip.open(button, false, content);
                });
            }

            if(line.querySelector('.microdebris'))
            {
                let element = line.querySelector('.microdebris');
                let id = '#' + element.getAttribute('rel');

                let total = 0;
                document.querySelector(id).querySelectorAll('.debris-content').forEach(resources =>
                {
                    let value = Util.formatFromUnits(resources.innerText.replace(/(\D*)/, ''));
                    element.innerHTML += Util.formatToUnits(parseInt(value), 1) + '<br>';
                    total += parseInt(value);
                });

                if(total >= this.ogl.db.options.rval) element.closest('.cellDebris').classList.add('ogl_active');
            }

            document.querySelectorAll('.expeditionDebrisSlotBox:not(.ogl_debrisReady)').forEach(element =>
            {
                element.classList.add('ogl_debrisReady');

                let content = element.querySelectorAll('.ListLinks li');
                if(!content[0]) content = document.querySelectorAll('#debris16 .ListLinks li');

                let scouts = content[3];
                let action = content[4];
                let res =
                [
                    content[0].textContent.replace(/(\D*)/, ''),
                    content[1].textContent.replace(/(\D*)/, ''),
                    content[2].textContent.replace(/(\D*)/, '')
                ];

                element.innerHTML = `
                    <img src="https://gf1.geo.gfsrv.net/cdnc5/fa3e396b8af2ae31e28ef3b44eca91.gif">
                    <div>
                        <div class="ogl_metal">${res[0]}</div>
                        <div class="ogl_crystal">${res[1]}</div>
                        <div class="ogl_deut">${res[2]}</div>
                    </div>
                    <div>
                        <div>${scouts.textContent}</div>
                        <div>${action.outerHTML}</div>
                    </div>
                `;
            });
        });

        if(system != 499) this.ogl.component.keyboard.sent = false;
    }
}

class MenuManager
{
    constructor(ogl)
    {
        this.ogl = ogl;
        this.init();
    }

    init()
    {
        document.querySelector('#countColonies .ogl_menuOptions')?.remove();
        document.querySelector('#countColonies .ogl_panel')?.remove();

        this.mainDom = document.querySelector('#countColonies').appendChild(Util.createDom('div', {'class':'ogl_menuOptions'}));
        this.subDom = document.querySelector('#countColonies').appendChild(Util.createDom('div', {'class':'ogl_panel'}));

        // main buttons
        this.addOptions();
        this.addShips();
        this.addMissions();
        this.addHarvest();

        // sub buttons
        this.addSubEco();
        this.addSubProd();
        this.addSubPins();
        this.addSubTargets();

        this.checkImportExport();

        this.ogl.performances.push(['Menu',performance.now()]);
    }

    addOptions()
    {
        let button = this.mainDom.appendChild(Util.createDom('div', {'class':'material-icons ogl_manageData ogl_button'}, 'settings'));
        button.addEventListener('click', () =>
        {
            this.ogl.component.popup.load();

            let globalContainer = Util.createDom('div', {'class':'ogl_globalConfig'});
            let sideContainer = globalContainer.appendChild(Util.createDom('div'));
            let container = globalContainer.appendChild(Util.createDom('div', {'class':'ogl_config'}));

            // CUSTOM PUMPK1IN
            //sideContainer.appendChild(Util.createDom('h1', {'class':'ogl_scriptTitle'}, `OGLight <span>(${this.ogl.version == 'beta' ? `${this.ogl.version}-${hash}` : this.ogl.version})</span>`));
            sideContainer.appendChild(Util.createDom('h1', {'class':'ogl_scriptTitle'}, `OGLight <span>(${this.ogl.version == 'beta' ? `${this.ogl.version}-${hash}` : this.ogl.version}) <br><span style="font-size:0.8em;">Pumpk1in edition</span></span>`));
            // END CUSTOM PUMPK1IN
            sideContainer.appendChild(Util.createDom('hr'));
            sideContainer.appendChild(Util.createDom('p', {}, this.ogl.component.lang.getText('kofi')));
            sideContainer.appendChild(Util.createDom('div', {}, "<a class='ogl_kofi' href='https://ko-fi.com/O4O22XV69' target='_blank'>Buy me a coffee</a>"));

            let rval = container.appendChild(Util.createDom('div', {}, '<span>Resources Value (RVal)</span>'));
            let rvalInput = rval.appendChild(Util.createDom('input', {'type':'text', 'class':'ogl_input'}));
            rvalInput.value = this.ogl.db.options.rval;

            let ptre = container.appendChild(Util.createDom('div', {}, '<span><a href="https://ptre.chez.gg/" target="_blank">PTRE</a> Teamkey</span>'));
            let ptreInput = ptre.appendChild(Util.createDom('input', {'type':'password', 'placeholder':'TM-XXXX-XXXX-XXXX-XXXX'}));
            if(this.ogl.ptre) ptreInput.value = this.ogl.ptre;

            ptreInput.addEventListener('focus', () => ptreInput.setAttribute('type', 'text'));
            ptreInput.addEventListener('blur', () => ptreInput.setAttribute('type', 'password'));

            this.ogl.component.popup.open(globalContainer);
            setTimeout(() => rvalInput.dispatchEvent(new Event('change')), 500);

            container.appendChild(Util.createDom('h2', {}, 'Interface'));

            let minifyPictures = container.appendChild(Util.createDom('div', {}, `<span>${this.ogl.component.lang.getText('minifyPictures')}</span>`));
            let minifyToggle = minifyPictures.appendChild(Util.createDom('div', {'class':'ogl_confToggle'}));
            if(localStorage.getItem('ogl-minipics')) minifyToggle.classList.add('ogl_active');

            minifyToggle.addEventListener('click', () =>
            {
                if(localStorage.getItem('ogl-minipics'))
                {
                    localStorage.removeItem('ogl-minipics');
                    minifyToggle.classList.remove('ogl_active');
                }
                else
                {
                    localStorage.setItem('ogl-minipics', true);
                    minifyToggle.classList.add('ogl_active');
                }
            });

            let timezoneMode = container.appendChild(Util.createDom('div', {}, `<span>${this.ogl.component.lang.getText('timezoneMode')}</span>`));
            timezoneMode.appendChild(Util.createDom('div', {'class':'ogl_confToggle ogl_active', 'data-conf':'timezoneMode'}));

            let timers = container.appendChild(Util.createDom('div', {}, `<span>${this.ogl.component.lang.getText('displayTimers')}</span>`));
            timers.appendChild(Util.createDom('div', {'class':'ogl_confToggle ogl_active', 'data-conf':'timers'}));

            let fleetDetailsName = container.appendChild(Util.createDom('div', {}, `<span>${this.ogl.component.lang.getText('fleetDetailsName')}</span>`));
            fleetDetailsName.appendChild(Util.createDom('div', {'class':'ogl_confToggle ogl_active', 'data-conf':'fleetDetailsName'}));

            let rightMenuTooltips = container.appendChild(Util.createDom('div', {}, `<span>${this.ogl.component.lang.getText('rightMenuTooltips')}</span>`));
            rightMenuTooltips.appendChild(Util.createDom('div', {'class':'ogl_confToggle ogl_active', 'data-conf':'rightMenuTooltips'}));

            let tooltipDelay = container.appendChild(Util.createDom('div', {}, `<span>${this.ogl.component.lang.getText('tooltipDelay')}</span>`));
            let tooltipDelayInput = tooltipDelay.appendChild(Util.createDom('input', {'type':'number', 'min':'0', 'max':'2000'}));
            tooltipDelayInput.value = this.ogl.db.options.tooltipDelay;

            /* CUSTOM PUMPK1IN */
            let unfoldEventsOnOverview = container.appendChild(Util.createDom('div', {}, `<span>${this.ogl.component.lang.getText('unfoldEventsOnOverview')}</span>`));
            unfoldEventsOnOverview.appendChild(Util.createDom('div', {'class':'ogl_confToggle ogl_active', 'data-conf':'unfoldEventsOnOverview'}));

            let transportsCalcDetails = container.appendChild(Util.createDom('div', {}, `<span>${this.ogl.component.lang.getText('transportsCalcDetails')}</span>`));
            let transportOrNot = transportsCalcDetails.appendChild(Util.createDom('div', {'class':'ogl_confContainer'}));
            transportOrNot.appendChild(Util.createDom('div', {'class':'ogl_confToggle ogl_active', 'data-conf':'transportsCalcDetails'}));
            transportOrNot.appendChild(Util.createDom('div', {'class':'ogl_confToggle ogl_active', 'data-conf':'transportsNBDetails'}));

            let energyCalcDetails = container.appendChild(Util.createDom('div', {}, `<span>${this.ogl.component.lang.getText('energyCalcDetails')}</span>`));
            energyCalcDetails.appendChild(Util.createDom('div', {'class':'ogl_confToggle ogl_active', 'data-conf':'energyCalcDetails'}));
            /* END CUSTOM PUMPK1IN */

            container.appendChild(Util.createDom('h2', {}, 'Attacks & stats'));

            let stats = container.appendChild(Util.createDom('div', {}, `<span>${this.ogl.component.lang.getText('rentaStats')}</span>`));
            stats.appendChild(Util.createDom('div', {'class':'ogl_confToggle ogl_active', 'data-conf':'renta'}));

            let ignoreConsumption = container.appendChild(Util.createDom('div', {}, `<span>${this.ogl.component.lang.getText('excludeConso')}</span>`));
            ignoreConsumption.appendChild(Util.createDom('div', {'class':'ogl_confToggle ogl_active', 'data-conf':'ignoreConsumption'}));

            let spytable = container.appendChild(Util.createDom('div', {}, `<span>${this.ogl.component.lang.getText('spiesTable')}</span>`));
            spytable.appendChild(Util.createDom('div', {'class':'ogl_confToggle ogl_active', 'data-conf':'spytable'}));

            let autoclean = container.appendChild(Util.createDom('div', {}, `<span>${this.ogl.component.lang.getText('autoClean')}</span>`));
            autoclean.appendChild(Util.createDom('div', {'class':'ogl_confToggle ogl_active', 'data-conf':'autoclean'}));

            let ignoreExpeShips = container.appendChild(Util.createDom('div', {}, `<span>${this.ogl.component.lang.getText('ignoreExpeShips')}</span>`));
            ignoreExpeShips.appendChild(Util.createDom('div', {'class':'ogl_confToggle ogl_active', 'data-conf':'ignoreExpeShips'}));

            let bigShip = container.appendChild(Util.createDom('div', {}, `<span>${this.ogl.component.lang.getText('bigShip')}</span>`));
            bigShip.appendChild(Util.createDom('div', {'class':'ogl_confToggle ogl_active', 'data-conf':'bigShip'}));

            let ignoreVacation = container.appendChild(Util.createDom('div', {}, `<span>${this.ogl.component.lang.getText('ignoreVacation')}</span>`));
            ignoreVacation.appendChild(Util.createDom('div', {'class':'ogl_confToggle ogl_active', 'data-conf':'ignoreVacation'}));

            container.appendChild(Util.createDom('h2', {}, 'Data'));

            let data;

            let dataDiv = container.appendChild(Util.createDom('div', {'class':'ogl_manageData'}));

            let resetButton = dataDiv.appendChild(Util.createDom('a', {'class':'ogl_button tooltip', 'title':'Reset all your data'}, 'RESET ALL'));
            resetButton.addEventListener('click', () =>
            {
                if(confirm('Do you really want to reset your data ?'))
                {
                    this.ogl.save({});
                    document.location.reload();
                }
            });

            dataDiv.appendChild(Util.createDom('a', {'class':'ogl_button tooltip', 'data-title':'Reset only your stats'}, 'RESET STATS'))
            .addEventListener('click', () =>
            {
                if(confirm('Do you really want to reset your stats ?'))
                {
                    this.ogl.db.stats = {};
                    this.ogl.save();
                    document.location.reload();
                }
            });

            dataDiv.appendChild(Util.createDom('a', {'class':'ogl_button tooltip', 'title':'Reset only your targets'}, 'RESET TARGETS'))
            .addEventListener('click', () =>
            {
                if(confirm('Do you really want to reset your targets list ?'))
                {
                    this.ogl.db.players = [];
                    this.ogl.db.positions = [];
                    this.ogl.db.pinnedList = [];
                    this.ogl.db.dataFormat = 0;
                    this.ogl.save();
                    document.location.reload();
                }
            });

            dataDiv.appendChild(Util.createDom('label', {'class':'ogl_button tooltip', 'for':'ogl_import', 'title':'Import data'}, 'IMPORT'));
            let importButton = dataDiv.appendChild(Util.createDom('input', {'id':'ogl_import', 'class':'ogl_hidden', 'type':'file'}));
            importButton.addEventListener('change', () =>
            {
                let file = importButton.files[0];

                let reader = new FileReader();
                reader.onload = () =>
                {
                    try { JSON.parse(reader.result); }
                    catch (e) { return false; }
                    data = reader.result;

                    let parsed = JSON.parse(reader.result);

                    if(parsed.dataFormat >= 4)
                    {
                        this.ogl.save(parsed);
                        document.location.reload();
                    }
                    else alert(`Wrong data format`);
                };
                reader.readAsText(file);
            });

            let exportButton = dataDiv.appendChild(Util.createDom('a', {'class':'ogl_button', 'download':`ogl_${this.ogl.universe.name}_${this.ogl.universe.lang}_${serverTime.getTime()}`}, 'EXPORT'));
            exportButton.href = URL.createObjectURL(new Blob([JSON.stringify(this.ogl.db)], {type: 'application/json'}));

            let saveButton = dataDiv.appendChild(Util.createDom('a', {'class':'ogl_button'}, 'SAVE'));
            saveButton.addEventListener('click', () =>
            {
                this.ogl.db.options.rval = Util.formatFromUnits(rvalInput.value || '0');
                this.ogl.db.options.tooltipDelay = parseInt(tooltipDelayInput.value || '0');
                this.ogl.save();

                if(ptreInput.value && ptreInput.value.replace(/-/g, '').length == 18 && ptreInput.value.indexOf('TM') == 0)
                {
                    localStorage.setItem('ogl-ptreTK', ptreInput.value);
                    document.location.reload();
                }
                else
                {
                    localStorage.removeItem('ogl-ptreTK');

                    if(ptreInput.value) fadeBox('Error, wrong PTRE teamkey format', true);
                    else document.location.reload();
                }
            });

            container.querySelectorAll('.ogl_confToggle[data-conf]').forEach(button =>
            {
                let id = button.getAttribute('data-conf');

                if(this.ogl.db.options.togglesOff.indexOf(id) > -1) button.classList.remove('ogl_active');

                button.addEventListener('click', () =>
                {
                    let index = this.ogl.db.options.togglesOff.indexOf(id);
                    index > -1 ? this.ogl.db.options.togglesOff.splice(index, 1) : this.ogl.db.options.togglesOff.push(id);
                    button.classList.toggle('ogl_active');
                });
            });
        });
    }

    addShips()
    {
        let button = this.mainDom.appendChild(Util.createDom('div', {'class':'ogl_shipPicker ogl_button tooltipLeft tooltipClick tooltipClose', 'data-title':'loading...'}, this.ogl.component.lang.getText('abbr'+this.ogl.db.options.defaultShip)));
        button.addEventListener('click', () =>
        {
            let cargoChoice = Util.createDom('div', {'id':'ogl_defaultShipPicker', 'class':'ogl_shipList'});
            this.ogl.component.fleet.defaultShipsList.forEach(shipID =>
            {
                let cargoType = cargoChoice.appendChild(Util.createDom('div', {'class':'ogl_shipIcon ogl_'+shipID}));
                cargoType.addEventListener('click', () =>
                {
                    this.ogl.db.options.defaultShip = shipID;
                    this.ogl.save();
                    document.location.reload();
                });
            });

            this.ogl.component.tooltip.update(button, cargoChoice);
        });
    }

    addMissions()
    {
        let mission = this.ogl.db.options.defaultMission;
        this.mainDom.appendChild(Util.createDom('div', {'class':`material-icons ogl_missionPicker${this.ogl.db.options.defaultMission} ogl_button`}, this.ogl.db.options.defaultMission == 4 ? 'keyboard_tab' : 'swap_horiz'))
        .addEventListener('click', () =>
        {
            this.ogl.db.options.defaultMission = this.ogl.db.options.defaultMission == 4 ? 3 : 4;
            this.ogl.save();

            Util.redirect(window.location.href.replace(`&mission=${mission}`, `&mission=${this.ogl.db.options.defaultMission}`), this.ogl);
        });
    }

    addHarvest()
    {
        let button = this.mainDom.appendChild(Util.createDom('div', {'class':'material-icons ogl_harvest ogl_button'}, 'all_inclusive'));
        let linkedButton = Util.createDom('div', {'class':'ogl_linkedHarvest ogl_button'}, this.ogl.current.type == 'moon' ? this.ogl.component.lang.getText('linkedPlanets') : this.ogl.component.lang.getText('linkedMoons'));

        button.addEventListener('click', () =>
        {
            if(this.ogl.page == 'fleetdispatch' && (this.ogl.mode == 1 || this.ogl.mode == 4))
            {
                Util.redirect(redirectOverviewLink, this.ogl);
            }
            else
            {
                (document.querySelector('#myPlanets') || document.querySelector('#myWorlds')).classList.toggle('ogl_shortcuts');
                button.classList.toggle('ogl_active');

                document.querySelectorAll('.smallplanet > a').forEach(planet =>
                {
                    if(planet.closest('.ogl_shortcuts'))
                    {
                        planet.addEventListener('click', event =>
                        {
                            event.preventDefault();
                            this.ogl.db.collectSource = [...this.ogl.current.coords, ...[this.ogl.current.type == 'planet' ? '1' : '3']];
                            this.ogl.db.collectDestination = planet.closest('.smallplanet').querySelector('.planet-koords').textContent.slice(1, -1).split(':');
                            planet.classList.contains('moonlink') ? this.ogl.db.collectDestination.push('3') : this.ogl.db.collectDestination.push('1');
                            this.ogl.save();

                            Util.redirect(`https://${window.location.host}/game/index.php?page=ingame&component=fleetdispatch&ogl_mode=1&galaxy=${this.ogl.db.collectDestination[0]}&system=${this.ogl.db.collectDestination[1]}&position=${this.ogl.db.collectDestination[2]}&type=${this.ogl.db.collectDestination[3]}&mission=${this.ogl.db.options.defaultMission}`, this.ogl);
                        });
                    }
                });

                linkedButton.classList.toggle('ogl_active');
            }
        });

        if(this.ogl.page == 'fleetdispatch' && (this.ogl.mode == 1 || this.ogl.mode == 4))
        {
            button.classList.add('ogl_active');
        }

        document.querySelector('#countColonies').parentNode.insertBefore(linkedButton, document.querySelector('#planetList'));
        linkedButton.addEventListener('click', () =>
        {
            if(this.ogl.current.smallplanet.querySelector('.moonlink'))
            {
                this.ogl.db.collectSource = [...this.ogl.current.coords, ...[this.ogl.current.type == 'planet' ? '1' : '3']];
                this.ogl.save();
                Util.redirect(`https://${window.location.host}/game/index.php?page=ingame&component=fleetdispatch&ogl_mode=4&type=${this.ogl.current.type == 'planet' ? '3' : '1'}&mission=${this.ogl.db.options.defaultMission}`, this.ogl);
            }
            else
            {
                this.ogl.db.collectSource = [...this.ogl.next.smallplanetWithMoon.querySelector('.planet-koords').textContent.slice(1, -1).split(':'), ...[this.ogl.current.type == 'planet' ? '3' : '1']];
                this.ogl.save();
                let cp = this.ogl.current.type == 'planet' ? new URL(this.ogl.next.smallplanetWithMoon.querySelector('a.planetlink').href).searchParams.get('cp') : new URL(this.ogl.next.smallplanetWithMoon.querySelector('a.moonlink').href).searchParams.get('cp');
                Util.redirect(`https://${window.location.host}/game/index.php?page=ingame&component=fleetdispatch&ogl_mode=4&cp=${cp}&type=${this.ogl.current.type == 'planet' ? '1' : '3'}&mission=${this.ogl.db.options.defaultMission}`, this.ogl);

            }
        });
    }

    addSubEco()
    {
        let button = this.subDom.appendChild(Util.createDom('div', {'class':'material-icons tooltip ogl_button', 'title':this.ogl.component.lang.getText('economyView')}, 'account_balance'));

        document.querySelectorAll('.planetlink, .moonlink').forEach(element =>
        {
            let coords = element.parentNode.querySelector('.planet-koords').textContent.slice(1, -1);
            if(element.classList.contains('moonlink')) coords += ':M';

            let container = element.appendChild(Util.createDom('div', {'class':'ogl_stock'}));

            let deltaTime = Math.floor((serverTime.getTime() - this.ogl.db.me.planets[coords]?.production?.[3] || 0) / 1000);
            deltaTime = 0;

            ['metal', 'crystal', 'deut'].forEach((res, index) =>
            {
                let oldValue = this.ogl.db.me.planets[coords]?.resources?.[res] || 0;
                let storage = this.ogl.db.me.planets?.[coords]?.storage?.[res];

                let prodSinceLastUpdate = (this.ogl.db.me.planets[coords]?.production?.[index] || 0) * deltaTime;
                let newValue = Math.floor(oldValue + prodSinceLastUpdate);
                let item = container.appendChild(Util.createDom('div', {'class':`ogl_${res}`}));

                if(!element.classList.contains('moonlink') && storage)
                {
                    if(oldValue < storage && newValue >= storage) newValue = storage;
                    if(newValue >= storage) item.classList.add('ogl_full');
                }

                item.textContent = Util.formatToUnits(newValue);
                item.setAttribute('data-value', newValue);
            });
        });

        button.addEventListener('click', () =>
        {
            if((document.querySelector('#myPlanets') || document.querySelector('#myWorlds')).getAttribute('data-panel'))
            {
                (document.querySelector('#myPlanets') || document.querySelector('#myWorlds')).removeAttribute('data-panel');
                this.ogl.db.menuView = false;
                // this.ogl.saveAsync();
            }
            else
            {
                (document.querySelector('#myPlanets') || document.querySelector('#myWorlds')).setAttribute('data-panel', 'resources');
                this.ogl.db.menuView = 'resources';
                // this.ogl.saveAsync();
            }
        });

        if(this.ogl.db.menuView == 'resources') (document.querySelector('#myPlanets') || document.querySelector('#myWorlds')).setAttribute('data-panel', 'resources');
    }

    addSubProd()
    {
        let button = this.subDom.appendChild(Util.createDom('div', {'class':'tooltip ogl_button', 'title':this.ogl.component.lang.getText('productionView')}, 'ø'));
        button.addEventListener('click', () =>
        {
            this.ogl.component.popup.load();

            let container = Util.createDom('div', {'class':'ogl_mineContainer'});
            let sum = [0,0,0];
            let sumProd = [0,0,0];
            let count = 0;

            container.appendChild(Util.createDom('span', {'class':'ogl_header'}, '&nbsp;'));
            container.appendChild(Util.createDom('span', {'class':'ogl_header'}, '&nbsp;'));
            container.appendChild(Util.createDom('span', {'class':'ogl_header'}, '&nbsp;'));
            container.appendChild(Util.createDom('span', {'class':'ogl_header'}, '&nbsp;'));

            let headerMetal = container.appendChild(Util.createDom('b', {'class':'ogl_metal ogl_header'}));
            let headerCrystal = container.appendChild(Util.createDom('b', {'class':'ogl_crystal ogl_header'}));
            let headerDeut = container.appendChild(Util.createDom('b', {'class':'ogl_deut ogl_header'}));

            document.querySelectorAll('.smallplanet').forEach(planet =>
            {
                let name = planet.querySelector('.planet-name').textContent;
                let coords = planet.querySelector('.planet-koords').textContent.slice(1, -1);
                let upgrading = planet.querySelector('.constructionIcon');

                if(this.ogl.db.me.planets[coords])
                {
                    let fieldUsed = this.ogl.db.me.planets[coords].fieldUsed || 0;
                    let fieldMax = this.ogl.db.me.planets[coords].fieldMax || 0;

                    let newLine = container.appendChild(Util.createDom('span', {}, `[${coords}]`));
                    if(planet.getAttribute('data-multi')) newLine.setAttribute('data-multi', planet.getAttribute('data-multi'));
                    container.appendChild(Util.createDom('i', {}, name));
                    container.appendChild(Util.createDom('i', {}, `${fieldUsed || '?'}/${fieldMax || '?'} (<strong>${fieldMax-fieldUsed}</strong>)`));

                    let temperature = container.appendChild(Util.createDom('i', {}, (this.ogl.db.me.planets[coords].temperature || '?') + '°C'));

                    if(this.ogl.db.me.planets[coords].temperature >= 150) temperature.style.color = "#af644d"; // too hot
                    else if(this.ogl.db.me.planets[coords].temperature >= 50) temperature.style.color = "#af9e4d"; // hot
                    else if(this.ogl.db.me.planets[coords].temperature >= 0) temperature.style.color = "#4daf67"; // normal
                    else if(this.ogl.db.me.planets[coords].temperature >= -100) temperature.style.color = "#4dafa6"; // cold
                    else temperature.style.color = "#4d79af"; // too cold

                    let metalLevel = (upgrading && this.ogl.db.me.planets[coords].upgrade?.[0] == 1) ? `(${this.ogl.db.me.planets[coords].upgrade?.[1]})` : (this.ogl.db.me.planets[coords]?.techs?.[1] || '?');
                    let crystalLevel = (upgrading && this.ogl.db.me.planets[coords].upgrade?.[0] == 2) ? `(${this.ogl.db.me.planets[coords].upgrade?.[1]})` : (this.ogl.db.me.planets[coords]?.techs?.[2] || '?');
                    let deutLevel = (upgrading && this.ogl.db.me.planets[coords].upgrade?.[0] == 3) ? `(${this.ogl.db.me.planets[coords].upgrade?.[1]})` : (this.ogl.db.me.planets[coords]?.techs?.[3] || '?');

                    container.appendChild(Util.createDom('b', {'class':'ogl_metal'}, metalLevel + `<div>+${Util.formatToUnits(Math.round((this.ogl.db.me.planets[coords]?.production[0] || 0) * 60 * 60 * 24))}</div>`));
                    container.appendChild(Util.createDom('b', {'class':'ogl_crystal'}, crystalLevel + `<div>+${Util.formatToUnits(Math.round((this.ogl.db.me.planets[coords]?.production[1] || 0) * 60 * 60 * 24))}</div>`));
                    container.appendChild(Util.createDom('b', {'class':'ogl_deut'}, deutLevel + `<div>+${Util.formatToUnits(Math.round((this.ogl.db.me.planets[coords]?.production[2] || 0) * 60 * 60 * 24))}</div>`));

                    sum = [sum[0] + parseInt(this.ogl.db.me.planets[coords]?.techs?.[1] || 0), sum[1] + parseInt(this.ogl.db.me.planets[coords]?.techs?.[2] || 0), sum[2] + parseInt(this.ogl.db.me.planets[coords]?.techs?.[3] || 0)];
                    sumProd = [sumProd[0] + (this.ogl.db.me.planets[coords]?.production?.[0] || 0) * 60 * 60 * 24, sumProd[1] + (this.ogl.db.me.planets[coords]?.production?.[1] || 0) * 60 * 60 * 24, sumProd[2] + (this.ogl.db.me.planets[coords]?.production?.[2] || 0) * 60 * 60 * 24];
                    count++;
                }
            });

            headerMetal.innerHTML = 'ø ' + (sum[0] / count).toFixed(1) + `<div>+${Util.formatToUnits(Math.round(sumProd[0]))}</div>`;
            headerCrystal.innerHTML = 'ø ' + (sum[1] / count).toFixed(1) + `<div>+${Util.formatToUnits(Math.round(sumProd[1]))}</div>`;
            headerDeut.innerHTML = 'ø ' + (sum[2] / count).toFixed(1) + `<div>+${Util.formatToUnits(Math.round(sumProd[2]))}</div>`;

            let shareButton = Util.createDom('div', {'class':'ogl_button'}, '<i class="material-icons">file_download</i>Download (.jpg)');
            shareButton.addEventListener('click', () =>
            {
                shareButton.textContent = 'loading...';
                shareButton.classList.add('ogl_disabled');
                Util.takeScreenshot(container, shareButton, `ogl_${this.ogl.universe.name}_${this.ogl.universe.lang}_empire_${serverTime.getTime()}`);
            });

            this.ogl.component.popup.open(container, () =>
            {
                this.ogl.component.popup.content.appendChild(shareButton);
            });
        });
    }

    addSubPins()
    {
        let button = this.subDom.appendChild(Util.createDom('div', {'class':'material-icons tooltip ogl_button', 'title':this.ogl.component.lang.getText('pinnedView')}, 'push_pin'));
        button.addEventListener('click', () => this.ogl.component.sidebar?.displayPinnedList());
    }

    addSubTargets()
    {
        let button = this.subDom.appendChild(Util.createDom('div', {'class':'material-icons tooltip ogl_button', 'title':this.ogl.component.lang.getText('targetView')}, 'gps_fixed'));
        button.addEventListener('click', () => this.ogl.component.sidebar?.displayTargetList());
    }

    checkImportExport()
    {
        if(this.ogl.db.nextImportExport < Date.now())
        {
            document.querySelector('.menubutton[href*=traderOverview]').classList.add('ogl_active');
        }

        window.addEventListener('beforeunload', () =>
        {
            let textTarget = document.querySelector('.bargain_text');
            let button = document.querySelector('.import_bargain.hidden');

            if(textTarget && button)
            {
                let today = new Date(serverTime.getTime());
                let tomorow = new Date(serverTime.getTime() + 86400000);

                if(textTarget.textContent.match(/\d+/g))
                {
                    this.ogl.db.nextImportExport = new Date(today.getFullYear(), today.getMonth(), today.getDate(), textTarget.textContent.match(/\d+/g)[0], 0, 0).getTime();
                }
                else
                {
                    this.ogl.db.nextImportExport = new Date(tomorow.getFullYear(), tomorow.getMonth(), tomorow.getDate(), 8, 0, 0).getTime();
                }

                this.ogl.save();
            }
            else if(textTarget && textTarget.textContent == '')
            {
                this.ogl.db.nextImportExport = serverTime.getTime();
                this.ogl.save();
            }
        });
    }
}class ColorManager
{
    constructor(ogl)
    {
        this.ogl = ogl;
        this.colors = ['red', 'halfred', 'yellow', 'halfyellow', 'green', 'halfgreen', 'blue', 'halfblue', 'violet', 'halfviolet', 'gray', 'none'];
    }

    addColorUI(sender, parent, planetIDs, clickEvent, callback)
    {
        let container = parent.appendChild(Util.createDom('div', {'class':'ogl_colors'}));
        this.colors.forEach(color =>
        {
            let button = container.appendChild(Util.createDom('div', {'data-color':color}));
            button.addEventListener('click', () =>
            {
                planetIDs.forEach(planetID =>
                {
                    this.ogl.db.positions[planetID].colorID = this.ogl.db.positions[planetID].playerID;
                    if(planetIDs.length == 1 && this.ogl.db.positions[planetID].color == color) color = false;
                    this.ogl.db.positions[planetID].color = color;
                    this.ogl.db.lastColorUsed = color;

                    if(document.querySelector('.ogl_sideView.ogl_active') && this.ogl.db.sidebarView == 'targetList')
                    {
                        let target = document.querySelector(`.ogl_sideView [data-planetID="${this.ogl.db.positions[planetID].id}"]`);
                        if(target)
                        {
                            target.setAttribute('data-color', color);
                            if(color == 'none' || color == false) target.remove();
                        }
                        else if(!target && color != 'none' && color != false)
                        {
                            this.ogl.component.sidebar?.displayTargetList();
                        }
                    }
                });

                if(sender)
                {
                    sender.setAttribute('data-color', color);
                    if(sender.closest('.row')) sender.closest('.row').setAttribute('data-color', color);
                    if(sender.closest('.galaxyRow')) sender.closest('.galaxyRow').setAttribute('data-color', color);
                    if(sender.closest('.ogl_spyTable')) sender.closest('[data-coords]').setAttribute('data-color', color);
                }

                if(callback) callback(color);

                setTimeout(() => this.ogl.component.tooltip.close(true), 100);
                // this.ogl.saveAsync();

                if(document.querySelector('.ogl_sideView.ogl_active') && this.ogl.db.sidebarView == 'pinned') this.ogl.component.sidebar?.displayPinnedTarget();

                if(planetIDs.length > 1) submitForm();
            });

            if(color == 'none') color = false;

            if(clickEvent && clickEvent.shiftKey && color == this.ogl.db.lastColorUsed)
            {
                button.click();
            }
        });
    }
}

class TooltipManager
{
    constructor(ogl)
    {
        this.ogl = ogl;
        this.ogl.tooltipList = this.ogl.tooltipList || {};
        this.ogl.tmpTooltip = this.ogl.tmpTooltip || {};
        this.dom = document.body.appendChild(Util.createDom('div', {'class':'ogl_tooltip tpd-tooltip'}));
        this.cross = this.dom.appendChild(Util.createDom('div', {'class':'ogl_close material-icons ogl_hidden'}, 'clear'));
        this.container = this.dom.appendChild(Util.createDom('div', {}));

        this.openDelay = this.ogl.db.options.tooltipDelay;
        this.closeDelay = 1;
        this.updateDelay = 50;

        this.openTimer;
        this.updateTimer;

        document.addEventListener('click', e =>
        {
            if(!this.dom.classList.contains('ogl_active') && !this.dom.classList.contains('ogl_highlight')) return;
            if(e.target != this.dom && !e.target.closest('.ogl_tooltip'))
            {
                this.lastSender = false;
                this.close(true);
            }
        });

        this.dom.addEventListener('mouseout', e =>
        {
            let target = e.toElement || e.relatedTarget || e.target;

            if(!this.dom.contains(target) && target != this.lastSender && this.cross.classList.contains('ogl_hidden') && !target.classList.contains('ogl_highlight'))
            {
                this.timer = setTimeout(e => this.close(), this.tooltipDelay);
            }
        });

        this.cross.addEventListener('click', () => this.close());
        this.ogl.observeMutation(() => this.initTooltip(), 'tooltip');

        this.ogl.performances.push(['Tooltip',performance.now()]);
    }

    initTooltip()
    {
        let senderList = document.querySelectorAll(`[class*="tooltip"]:not(.ogl_tooltipReady)`);

        senderList.forEach((sender, index) =>
        {
            setTimeout(() =>
            {
                if(sender.classList.contains('ogl_tooltipReady') || !this.ogl.component.tooltip || sender.closest('.ogl_tooltipReady')) return;
                if(!sender.classList.contains('tooltipRel') && !sender.getAttribute('title') && !sender.getAttribute('data-title'));

                sender.classList.add('ogl_tooltipReady');

                if(sender.parentNode && sender.parentNode.closest('.ogl_tooltipReady')) return;
                if(this.ogl.db.options.togglesOff.indexOf('rightMenuTooltips') == -1 && (sender.classList.contains('planetlink') || sender.classList.contains('moonlink')))
                {
                    sender.removeAttribute('title');
                    return;
                }

                if(sender.getAttribute('title') && !sender.getAttribute('data-title'))
                {
                    sender.setAttribute('data-title', sender.getAttribute('title'));
                    if(!sender.classList.contains('icon_apikey')) sender.removeAttribute('title');
                }

                let tooltipID;

                if(sender.classList.contains('icon_apikey') || sender.classList.contains('show_fleet_apikey'))
                {
                    sender.classList.add('tooltipClick');
                }

                if(sender.classList.contains('tooltipRel'))
                {
                    let id = '#' + sender.getAttribute('rel');
                    tooltipID = id;
                }

                if(sender.classList.contains('tooltipClick'))
                {
                    sender.addEventListener('click', e =>
                    {
                        if(e.target != sender) this.close();
                        this.lastSender = sender;
                        this.open(sender, tooltipID);
                    });

                    sender.addEventListener('mouseenter', e =>
                    {
                        clearTimeout(this.openTimer);
                        clearTimeout(this.updateTimer);
                    });
                }
                else
                {
                    sender.addEventListener('mouseenter', e =>
                    {
                        clearTimeout(this.openTimer);

                        if(e.target != sender) this.close();
                        if(this.ogl.component.tooltip.dom.contains(sender)) return;
                        if(sender == this.lastSender && (sender.getAttribute('data-title') == 'loading...' || this.dom.classList.contains('.ogl_active'))) return;

                        this.lastSender = sender;

                        if(sender.getAttribute('data-title') == 'loading...')
                        {
                            this.open(sender, tooltipID);
                        }
                        else
                        {
                            this.openTimer = setTimeout(() => this.open(sender, tooltipID), this.openDelay);
                        }
                    });

                    sender.addEventListener('mouseout', e =>
                    {
                        if(sender.contains(e.toElement) || (sender.classList.contains('tooltipClose') && this.dom.classList.contains('.ogl_active'))) return;

                        clearTimeout(this.openTimer);
                        clearTimeout(this.updateTimer);

                        if(!this.cross.classList.contains('ogl_hidden')) return;

                        this.closeTimer = setTimeout(e => this.close(), this.closeDelay);
                    });
                }

                //if(index == senderList.length-1) document.body.classList.remove('ogl_noPointer');

            }, index);
        });
    }

    rebuildTooltip(sender)
    {
        let rect = sender.getBoundingClientRect();
        let win = sender.ownerDocument.defaultView;

        this.position =
        {
            x:rect.left + win.pageXOffset,
            y:rect.top + win.pageYOffset
        };

        this.dom.style.top = 0 + 'px';
        this.dom.style.left = 0 + 'px';
        this.dom.style.width = 'auto';

        let tooltipWidth = this.dom.offsetWidth + 3;

        if(sender.classList.contains('tooltipClose') || sender.classList.contains('tooltipCustom') || sender.classList.contains('tooltipRel'))
        {
            this.cross.classList.remove('ogl_hidden');
            this.dom.classList.remove('ogl_noPointer');
        }
        else
        {
            this.cross.classList.add('ogl_hidden');
            this.dom.classList.add('ogl_noPointer');
        }

        if(sender.classList.contains('tooltipLeft'))
        {
            this.dom.classList.add('ogl_left');
            this.position.x -= this.dom.offsetWidth + 5;
            this.position.y -= this.dom.offsetHeight / 2;
            this.position.y += rect.height / 2;
        }
        else if(sender.classList.contains('tooltipRight'))
        {
            this.dom.classList.add('ogl_right');
            this.position.x += rect.width + 5;
            this.position.y -= this.dom.offsetHeight / 2;
            this.position.y += rect.height / 2;
        }
        else if(sender.classList.contains('tooltipRightTop'))
        {
            this.dom.classList.add('ogl_rightTop');
            this.position.x += rect.width;
            this.position.y -= this.dom.offsetHeight - 20;
            this.position.y += rect.height / 2;
        }
        else if(sender.classList.contains('tooltipBottom'))
        {
            this.dom.classList.add('ogl_bottom');
            this.position.x -= this.dom.offsetWidth / 2;
            this.position.x += rect.width / 2;
            this.position.y += rect.height;
        }
        else
        {
            this.position.x -= this.dom.offsetWidth / 2;
            this.position.x += rect.width / 2;
            this.position.y -= this.dom.offsetHeight;
            this.position.y -= 4;
        }

        this.position.x = Math.round(this.position.x);
        this.position.y = Math.round(this.position.y);

        this.position.x = this.position.x - (this.position.x % 2);
        this.position.y = this.position.y - (this.position.y % 2);

        this.dom.style.top = this.position.y + 'px';
        this.dom.style.left = this.position.x + 'px';
        this.dom.style.width = tooltipWidth + 'px';

        setTimeout(() =>
        {
            if(this.container.textContent.trim() != '' || this.container.innerHTML != '') this.dom.classList.add('ogl_active');
        }, 10);
    }

    open(sender, tooltipID, data)
    {
        clearTimeout(this.closeTimer);
        if(sender != this.lastSender) this.close();
        else if(sender.classList.contains('ogl_highlight')) return;

        let content;
        this.container.textContent = '';

        //if(tooltipID) content = this.ogl.tooltipList[tooltipID] || this.ogl.tmpTooltip[tooltipID];
        if(tooltipID) content = document.querySelector(`${tooltipID}`).outerHTML;
        else if(data) content = data;
        else
        {
            content = sender.getAttribute('title') || sender.getAttribute('data-title');
            if(content) sender.setAttribute('data-title', content);
        }

        if(!content)
        {
            this.close();
            return;
        }

        document.querySelectorAll('.ogl_highlight').forEach(e => e.classList.remove('ogl_highlight'));
        sender.classList.add('ogl_highlight');

        if(typeof content == 'object' && content.style && content.style.display == 'none') content.style.display = 'block';
        typeof content == 'object' ? this.container.appendChild(content) : this.container.innerHTML = content;

        if(this.container.textContent.indexOf('|') > -1) this.container.innerHTML = this.container.innerHTML.replace(/\|/g, '<div class="splitLine"></div>');

        // remove right menu tooltip on fleet 2
        if(sender.closest('.ogl_shortcuts') && (sender.classList.contains('planetlink') || sender.classList.contains('moonlink'))) return;

        sender.removeAttribute('title');

        if(this.updateBeforeDisplay(sender)) return;
        this.dom.className = 'ogl_tooltip tpd-tooltip';
        this.dom.style.width = 'auto';

        this.rebuildTooltip(sender);
    }

    update(sender, newData)
    {
        let excludedClasses = ['ogl_capacityContainer', 'ogl_resourceSaver'];

        let delay = sender.getAttribute('data-title') == 'loading...' ? 0 : this.openDelay + this.updateDelay;
        if(sender.className.trim().split(' ').filter(e => excludedClasses.includes(e)).length > 0) delay = 0;

        clearTimeout(this.openTimer);
        clearTimeout(this.updateTimer);

        this.updateTimer = setTimeout(() =>
        {
            if(sender != this.lastSender) return;

            this.container.textContent = '';

            if(!newData) return;

            typeof newData == 'object' ? this.container.appendChild(newData) : this.container.innerHTML = newData;
            this.rebuildTooltip(sender);
        }, delay);
    }

    close(forced)
    {
        clearTimeout(this.closeTimer);

        let ignore = false;

        document.querySelectorAll(':hover').forEach(element =>
        {
            if(element.classList.contains('ogl_tooltip')) ignore = true;
            if(element.classList.contains('ogl_highlight')) ignore = true;
            if(element.classList.contains('ogl_close')) ignore = false;
        });

        if(!ignore || forced)
        {
            document.querySelectorAll('.ogl_highlight').forEach(e => e.classList.remove('ogl_highlight'));
            this.dom.classList.remove('ogl_active');
            this.lastSender = false;
        }
    }

    updateBeforeDisplay(sender)
    {
        if(this.container.querySelector('.fleetinfo'))
        {
            if(sender.closest('.allianceAttack'))
            {
                this.container.querySelector('.fleetinfo').classList.add('ogl_ignored');
                return;
            }

            this.container.querySelectorAll('.fleetinfo tr').forEach(line =>
            {
                if(line.textContent.trim() == '') line.classList.add('ogl_hidden');
                else if(!line.querySelector('td')) line.classList.add('ogl_full');
                else
                {
                    let name = line.querySelector('td').textContent.replace(':', '');
                    let id = (Object.entries(this.ogl.db.ships).find(e => e[1].name == name) || [false])[0];
                    if(!id) id = Util.findObjectByValue(this.ogl.db.loca, line.querySelector('td').textContent.replace(':', '')) || -1
                    if(id && line.querySelector('.value'))
                    {
                        line.classList.add('ogl_'+id);
                        line.querySelector('td').textContent = '';
                        line.querySelector('td').className = 'ogl_shipIcon ogl_'+id;

                        line.title = line.querySelector('.value').textContent;
                        line.querySelector('.value').textContent = Util.formatToUnits(line.querySelector('.value').textContent);

                        if(this.ogl.db.options.togglesOff.indexOf('fleetDetailsName') == -1)
                        {
                            line.appendChild(Util.createDom('div', {'class':'fleetDetailsName'}, name));
                            line.classList.add('ogl_activeNames');
                        }
                    }
                }
            });

            this.container.querySelector('h1').remove();
            this.container.querySelector('.splitLine').remove();
            this.container.querySelector('.ogl_full').remove();
        }

        if(sender.classList.contains('moonlink'))
        {
            sender.classList.add('tooltipRight');
            sender.classList.remove('tooltipLeft');

            if(this.ogl.db.options.togglesOff.indexOf('rightMenuTooltips') == -1)
            {
                return true;
            }
        }
        else if(sender.classList.contains('planetlink'))
        {
            sender.classList.remove('tooltipRight');
            sender.classList.add('tooltipLeft');
            //this.position.x += sender.closest('[data-panel="stock"]') ? 80 : 45;

            //this.container.querySelectorAll('a').forEach(e => e.remove());

            if(this.ogl.db.options.togglesOff.indexOf('rightMenuTooltips') == -1)
            {
                return true;
            }
        }

        if(sender.closest('#top') || sender.closest('#box'))
        {
            sender.classList.add('tooltipBottom');
            sender.classList.remove('tooltip');
        }
    }
}

class FleetManager
{
    constructor(ogl)
    {
        this.ogl = ogl;
        this.spyReady = true;

        // add "shortcut" icons
        document.querySelectorAll('.smallplanet > a.planetlink, .smallplanet > a.moonlink').forEach(link =>
        {
            if(link.classList.contains('planetlink')) link.parentNode.setAttribute('data-coords', link.querySelector('.planet-koords').textContent.slice(1, -1));
            if(!link.querySelector('.ogl_shortcut')) link.appendChild(Util.createDom('div', {'class':'material-icons ogl_shortcut'}, 'flag'));
        });

        this.shipsList = [202,203,204,205,206,207,208,209,210,211,213,214,215,217,218,219];
        this.defaultShipsList = [202,203,219,210];

        this.checkFleetMovement();

        if(this.ogl.page == 'fleetdispatch' || this.ogl.page == 'shipyard') this.updateShipsTooltip();
        if(this.ogl.page != 'fleetdispatch') return;

        // language names
        this.ogl.db.loca.metal = loca.LOCA_ALL_METAL;
        this.ogl.db.loca.crystal = loca.LOCA_ALL_CRYSTAL;
        this.ogl.db.loca.deut = loca.LOCA_ALL_DEUTERIUM;
        this.ogl.db.loca.food = loca.LOCA_ALL_FOOD;
        this.ogl.db.loca.dm = LocalizationStrings.darkMatter;
        this.ogl.db.loca.item = 'Item';
        this.ogl.db.loca.conso = loca.LOCA_FLEET_FUEL_CONSUMPTION;
        this.ogl.db.loca.energy = resourcesBar.resources.energy.tooltip.split('|')[0];
        this.ogl.db.servertTimezone = serverTimeZoneOffsetInMinutes * 60000;
        this.ogl.db.clientTimezone = localTimeZoneOffsetInMinutes * 60000;

        // fleetDispatcher variables name
        this.resourceNames = [loca.LOCA_ALL_METAL, loca.LOCA_ALL_CRYSTAL, loca.LOCA_ALL_DEUTERIUM, loca.LOCA_ALL_FOOD];
        this.selectKeys = ['selectMaxMetal', 'selectMaxCrystal', 'selectMaxDeuterium', 'selectMaxFood'];
        this.resourceOnKeys = ['metalOnPlanet', 'crystalOnPlanet', 'deuteriumOnPlanet', 'foodOnPlanet'];
        this.cargoKeys = ['cargoMetal', 'cargoCrystal', 'cargoDeuterium', 'cargoFood'];
        this.resourceKeys = ['metal', 'crystal', 'deut', 'food'];

        // wait for fleetDispatcher to be ready
        if(fleetDispatcher && !fleetDispatcher.fetchTargetPlayerDataTimeout)
        {
            this.ogl.component.popup.load(true);

            // force shipsData fetch
            if(!unsafeWindow.shipsData || !fleetDispatcher?.fleetHelper?.shipsData)
            {
                let params = {};
                fleetDispatcher.appendShipParams(params);
                fleetDispatcher.appendTargetParams(params);
                fleetDispatcher.appendTokenParams(params);
                params.union = fleetDispatcher.union;

                $.post(fleetDispatcher.checkTargetUrl, params, response =>
                {
                    let data = JSON.parse(response);
                    fleetDispatcher.fleetHelper.shipsData = data.shipsData;
                    fleetDispatcher.updateToken(data.newAjaxToken);
                    this.init();
                });
            }
            else this.init();
        }
        else setTimeout(() => this.ogl.component.fleet = new FleetManager(this.ogl), 30);

        // replace default fleet movement (page movement)
    }

    init()
    {
        this.ogl.component.popup.close();

        fleetDispatcher.refreshDataAfterAjax = function (data)
        {
            this.setOrders(data.orders);

            if(!fleetDispatcher.isInitialized)
            {
                fleetDispatcher.isInitialized = true;
                return;
            }

            this.setTargetInhabited(data.targetInhabited);
            this.setTargetPlayerId(data.targetPlayerId);
            this.setTargetPlayerName(data.targetPlayerName);
            this.setTargetIsStrong(data.targetIsStrong);
            this.setTargetIsOutlaw(data.targetIsOutlaw);
            this.setTargetIsBuddyOrAllyMember(data.targetIsBuddyOrAllyMember);
            this.setTargetPlayerColorClass(data.targetPlayerColorClass);
            this.setTargetPlayerRankIcon(data.targetPlayerRankIcon);
            this.setPlayerIsOutlaw(data.playerIsOutlaw);
            this.setTargetPlanet(data.targetPlanet);
        };

        fleetDispatcher.apiTechData.forEach(tech => this.ogl.db.me.techs[tech[0]] = tech[1]);

        this.shipsList.forEach(shipID =>
        {
            if(fleetDispatcher.fleetHelper.shipsData?.[shipID])
            {
                this.ogl.db.ships[shipID] = {};
                this.ogl.db.ships[shipID].name = fleetDispatcher.fleetHelper.shipsData[shipID].name;
                this.ogl.db.ships[shipID].capacity = fleetDispatcher.fleetHelper.shipsData[shipID].cargoCapacity || fleetDispatcher.fleetHelper.shipsData[shipID].baseCargoCapacity;
                this.ogl.db.ships[shipID].speed = fleetDispatcher.fleetHelper.shipsData[shipID].speed;
            }
        });

        this.initialDeutOnPlanet = fleetDispatcher.deuteriumOnPlanet;

        // update "[resource]OnPlanet" fleetDispatcher variables
        this.resourceOnKeys.forEach((resourceOnKey, index) =>
        {
            fleetDispatcher[resourceOnKey] = Math.max(0, this.ogl.current[this.resourceKeys[index]] - this.ogl.db.options.resSaver[index]) || 0;
        });

        this.totalOnPlanet = fleetDispatcher.metalOnPlanet + fleetDispatcher.crystalOnPlanet + fleetDispatcher.deuteriumOnPlanet + fleetDispatcher.foodOnPlanet || this.ogl.current.metal + this.ogl.current.crystal + this.ogl.current.deut + this.ogl.current.food || 0;

        this.updatePlanetList();
        this.updatePrevNextLink();

        if(fleetDispatcher.shipsOnPlanet.length == 0 || document.querySelector('#fleet1 #warning')) return;

        if(!fleetDispatcher.fleetHelper?.getShipData)
        {
            fleetDispatcher.fleetHelper.getShipData = shipID =>
            {
                return shipsData[shipID];
            }
        }

        // this.ogl.saveAsync();

        this.addRequired();
        this.addReverse();
        this.addCapacity();
        this.overWriteEnterKey();
        this.replaceSpeedSelector();
        this.planetsAreDestinations();
        this.resourcesSaving();

        // select max resources ignoring resource saving
        fleetDispatcher.selectForcedMaxAll = () =>
        {
            // ignore resSaver variables
            this.resourceOnKeys.forEach((resourceOnKey, index) =>
            {
                fleetDispatcher[resourceOnKey] = Math.max(0, this.ogl.current[this.resourceKeys[index]]);
            });

            fleetDispatcher.selectMaxAll();
            fleetDispatcher.refresh();

            this.resourceOnKeys.forEach((resourceOnKey, index) =>
            {
                fleetDispatcher[resourceOnKey] = Math.max(0, this.ogl.current[this.resourceKeys[index]] - this.ogl.db.options.resSaver[index]);
            });
        }

        document.querySelector('#loadAllResources').addEventListener('click', event =>
        {
            if(event.shiftKey)
            {
                event.preventDefault();
                setTimeout(() => fleetDispatcher.selectForcedMaxAll());
            }
        });

        for(let i=0; i<3; i++)
        {
            document.querySelector('#'+this.selectKeys[i]).addEventListener('click', event =>
            {
                fleetDispatcher[this.cargoKeys[i]] = 0;
                if(event.shiftKey)
                {
                    event.preventDefault();

                    setTimeout(() =>
                    {
                        fleetDispatcher[this.resourceOnKeys[i]] = Math.max(0, this.ogl.current[this.resourceOnKeys[i]]);

                        fleetDispatcher[this.selectKeys[i]]();
                        fleetDispatcher.refresh();

                        fleetDispatcher[this.resourceOnKeys[i]] = Math.max(0, this.ogl.current[this.resourceOnKeys[i]] - this.ogl.db.options.resSaver[i]);
                    });
                }
            });
        }

        let unload = document.querySelector('#loadAllResources').parentNode.appendChild(Util.createDom('div', {'class':'ogl_unloadAllResources'}, '0'));
        unload.addEventListener('click', () =>
        {
            fleetDispatcher.cargoMetal = 0;
            fleetDispatcher.cargoCrystal = 0;
            fleetDispatcher.cargoDeuterium = 0;
            fleetDispatcher.cargoFood = 0;
            fleetDispatcher.refresh();
        });

        this.overWriteFleetDispatcher('selectShip', (shipID, amount) =>
        {
            document.querySelector(`[data-technology="${shipID}"]`).classList.remove('ogl_notEnoughShips')
            let available = fleetDispatcher.shipsOnPlanet.find(e => e.id == this.ogl.db.options.defaultShip)?.number || 0;

            if(amount > available)
            {
                document.querySelector(`[data-technology="${shipID}"]`).classList.add('ogl_notEnoughShips');
                setTimeout(() => document.querySelector(`[data-technology="${shipID}"]`).classList.remove('ogl_notEnoughShips'), 3000);
            }
            amount = Math.min(available, amount);

            this.cargoMax = fleetDispatcher.getCargoCapacity();
            this.cargoList = [fleetDispatcher.cargoMetal, fleetDispatcher.cargoCrystal, fleetDispatcher.cargoDeuterium];
        }, shipID =>
        {
            if(this.cargoMax <= fleetDispatcher.getCargoCapacity() && this.cargoList.reduce((a, b) => a+b) > 0)
            {
                fleetDispatcher.cargoMetal = this.cargoList[0];
                fleetDispatcher.cargoCrystal = this.cargoList[1];
                fleetDispatcher.cargoDeuterium = this.cargoList[2];
            }

            setTimeout(() => document.querySelector(`[data-technology="${shipID}"] input`)?.dispatchEvent(new Event('change')), 10);
        });

        if(this.ogl.mode == 1 || this.ogl.mode == 4) this.collectResources();

        if(this.ogl.mode == 3)
        {
            let cumul = [0, 0, 0];
            let destination = `${fleetDispatcher.targetPlanet.galaxy}:${fleetDispatcher.targetPlanet.system}:${fleetDispatcher.targetPlanet.position}`;

            this.ogl.db.lockedList.forEach(key =>
            {
                if(this.ogl.db.lock[destination][key])
                {
                    cumul[0] += this.ogl.db.lock[destination][key].metal;
                    cumul[1] += this.ogl.db.lock[destination][key].crystal;
                    cumul[2] += this.ogl.db.lock[destination][key].deut;
                }
            });

            let resToSend = [Math.min(cumul[0], fleetDispatcher.metalOnPlanet), Math.min(cumul[1], fleetDispatcher.crystalOnPlanet), Math.min(cumul[2], fleetDispatcher.deuteriumOnPlanet)];

            let shipsAmount = this.calcRequiredShips(this.ogl.db.options.defaultShip, Math.min(resToSend[0] + resToSend[1] + resToSend[2]));
            fleetDispatcher.selectShip(this.ogl.db.options.defaultShip, shipsAmount);

            fleetDispatcher.cargoDeuterium = Math.min(resToSend[2], fleetDispatcher.getDeuteriumOnPlanetWithoutConsumption(), fleetDispatcher.getFreeCargoSpace());
            fleetDispatcher.cargoCrystal = Math.min(resToSend[1], fleetDispatcher.crystalOnPlanet, fleetDispatcher.getFreeCargoSpace());
            fleetDispatcher.cargoMetal = Math.min(resToSend[0], fleetDispatcher.metalOnPlanet, fleetDispatcher.getFreeCargoSpace());

            fleetDispatcher.refresh();

            this.overWriteFleetDispatcher('submitFleet2', () =>
            {
                this.ogl.db.lockedList.forEach(key =>
                {
                    if(this.ogl.db.lock[destination][key])
                    {
                        if(cumul[0] > 0)
                        {
                            let metalSent = Math.max(this.ogl.db.lock[destination][key].metal - fleetDispatcher.cargoMetal, 0);
                            cumul[0] -= metalSent;
                            this.ogl.db.lock[destination][key].metal = metalSent;
                        }

                        if(cumul[1] > 0)
                        {
                            let crystalSent = Math.max(this.ogl.db.lock[destination][key].crystal - fleetDispatcher.cargoCrystal, 0);
                            cumul[1] -= crystalSent;
                            this.ogl.db.lock[destination][key].crystal = crystalSent;
                        }

                        if(cumul[2] > 0)
                        {
                            let deutSent = Math.max(this.ogl.db.lock[destination][key].deut - fleetDispatcher.cargoDeuterium, 0);
                            cumul[2] -= deutSent;
                            this.ogl.db.lock[destination][key].deut = deutSent;
                        }

                        //if(this.ogl.db.lock[destination][key].metal == 0 && this.ogl.db.lock[destination][key].crystal == 0 && this.ogl.db.lock[destination][key].deut == 0) delete(this.ogl.db.lock[destination][key]);
                    }
                });

                this.ogl.save();
            });
        }

        this.overWriteFleetDispatcher('setTargetPlanet', false, () =>
        {
            // preselect default mission
            if(fleetDispatcher.union)
            {
                fleetDispatcher.mission = 2;
                fleetDispatcher.refresh();

                // update ACS data
                let acsArrivalTime = (Object.values(fleetDispatcher.unions).find(a => a.id == fleetDispatcher.union)?.time || 0) * 1000;
                if(acsArrivalTime)
                {
                    document.querySelector('.ogl_acsInfo') && document.querySelector('.ogl_acsInfo').remove();
                    let li = Util.createDom('li', {'class':'ogl_acsInfo'}, 'acs:');
                    document.querySelector('#fleetBriefingPart1').prepend(li);

                    let span = li.appendChild(Util.createDom('span', {'class':'value'}));
                    let spanOffset = span.appendChild(Util.createDom('span'));
                    let count = span.appendChild(Util.createDom('span', {'class':'ogl_warning'}));

                    this.acsInterval = setInterval(() =>
                    {
                        if(!fleetDispatcher.getDuration()) return;
                        let newTime = serverTime.getTime() + fleetDispatcher.getDuration() * 1000;
                        let acsTime = acsArrivalTime;
                        let tl = acsTime - serverTime.getTime();
                        let tl3 = tl * 30 / 100;
                        let delta = newTime - acsTime;
                        let offset = tl3 - delta;

                        if(delta > 0)
                        {
                            spanOffset.textContent = `+${new Date(delta).toISOString().slice(11,19)}`;
                            spanOffset.classList.add('ogl_danger');
                        }
                        else
                        {
                            spanOffset.textContent = '+00:00:00';
                            spanOffset.classList.remove('ogl_danger');
                        }

                        if(delta < tl3) count.textContent = `${new Date(offset).toISOString().slice(11,19)}`;
                        else count.textContent = 'too late';

                        if(!fleetDispatcher.union)
                        {
                            clearInterval(this.acsInterval);
                            document.querySelector('.ogl_acsInfo') && document.querySelector('.ogl_acsInfo').remove();
                        }

                    }, 333);
                }
            }

            if(!fleetDispatcher.mission)
            {
                fleetDispatcher.mission = this.ogl.db.options.defaultMission;
                fleetDispatcher.refresh();
            }
            this.updatePlanetList();
        });

        this.overWriteFleetDispatcher('trySubmitFleet1', false, () =>
        {
            this.conso = fleetDispatcher.getConsumption();

            if(this.ogl.mode == 1 || this.ogl.mode == 4)
            {
                fleetDispatcher.resetCargo();
                fleetDispatcher.cargoDeuterium = Math.min(fleetDispatcher.getDeuteriumOnPlanetWithoutConsumption(), fleetDispatcher.getFreeCargoSpace());
                fleetDispatcher.cargoCrystal = Math.min(fleetDispatcher.crystalOnPlanet, fleetDispatcher.getFreeCargoSpace());
                fleetDispatcher.cargoMetal = Math.min(fleetDispatcher.metalOnPlanet, fleetDispatcher.getFreeCargoSpace());
                fleetDispatcher.cargoFood = Math.min(fleetDispatcher.foodOnPlanet || 0, fleetDispatcher.getFreeCargoSpace());
            }
        });

        this.overWriteFleetDispatcher('switchToPage', () =>
        {
            if(this.ogl.mode == 3) this.tmpCargo = [fleetDispatcher.metal, fleetDispatcher.crystal, fleetDispatcher.deut];
        }, () =>
        {
            // change right menu planets actions (links -> destinations shortcuts)
            if(fleetDispatcher.currentPage == 'fleet2')
            {
                (document.querySelector('#myPlanets') || document.querySelector('#myWorlds')).classList.add('ogl_shortcuts');

                if(this.ogl.mode == 3)
                {
                    fleetDispatcher.metal = [this.tmpCargo[0], this.tmpCargo[1], this.tmpCargo[2]];
                }
            }
            else
            {
                (document.querySelector('#myPlanets') || document.querySelector('#myWorlds')).classList.remove('ogl_shortcuts');
            }
        });

        this.overWriteFleetDispatcher('trySubmitFleet2', () =>
        {
            this.tmpDeutOnPlanet = fleetDispatcher.deuteriumOnPlanet;
            fleetDispatcher.deuteriumOnPlanet = this.initialDeutOnPlanet;
        },
        () =>
        {
            fleetDispatcher.deuteriumOnPlanet = this.tmpDeutOnPlanet;
        });

        this.overWriteFleetDispatcher('submitFleet2', () =>
        {
            this.fleetSent = true;
            let coords = this.ogl.current.coords.join(':');
            if(this.ogl.current.type == 'moon') coords += ':M';

            // update blind target
            if(this.targetSelected)
            {
                if(this.ogl.db.options.nextTargets[0] && !this.ogl.db.options.nextTargets[1])
                {
                    this.ogl.db.options.nextTargets[0] = 0;
                }
                else
                {
                    this.ogl.db.options.nextTargets[0] = this.ogl.db.options.nextTargets[1];
                }

                this.ogl.db.options.nextTargets[1] = 0;
            }

            let now = new Date(Date.now());
            let midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime();

            // update resources on planet
            this.ogl.db.me.planets[coords].resources.metal = Math.max(0, this.ogl.db.me.planets[coords].resources.metal - fleetDispatcher.cargoMetal);
            this.ogl.db.me.planets[coords].resources.crystal = Math.max(0, this.ogl.db.me.planets[coords].resources.crystal - fleetDispatcher.cargoCrystal);
            this.ogl.db.me.planets[coords].resources.deut = Math.max(0, this.ogl.db.me.planets[coords].resources.deut - fleetDispatcher.cargoDeuterium - fleetDispatcher.getConsumption());

            // save sent fleet data
            this.ogl.db.lastFleet = {};
            this.ogl.db.lastFleet.shipsToSend = fleetDispatcher.shipsToSend;
            this.ogl.db.lastFleet.targetPlanet = fleetDispatcher.targetPlanet;
            this.ogl.db.lastFleet.speedPercent = fleetDispatcher.speedPercent;
            this.ogl.db.lastFleet.cargoMetal = fleetDispatcher.cargoMetal;
            this.ogl.db.lastFleet.cargoCrystal = fleetDispatcher.cargoCrystal;
            this.ogl.db.lastFleet.cargoDeuterium = fleetDispatcher.cargoDeuterium;
            this.ogl.db.lastFleet.mission = fleetDispatcher.mission;
            this.ogl.db.lastFleet.expeditionTime = fleetDispatcher.expeditionTime;

            // add consumption to stats
            this.ogl.db.stats[midnight] = this.ogl.db.stats[midnight] || { idList:[], expe:{}, raid:{}, expeOccurences:{}, raidOccurences:0, consumption:0 };
            this.ogl.db.stats[midnight].consumption = (this.ogl.db.stats?.[midnight]?.consumption || 0) - fleetDispatcher.getConsumption();
            this.ogl.db.stats.total = this.ogl.db.stats.total || {};
            this.ogl.db.stats.total.consumption = (this.ogl.db.stats?.total?.consumption || 0) - fleetDispatcher.getConsumption();

            // redirect to messages page when using the spies table
            if(this.ogl.mode == 2)
            {
                localStorage.setItem('ogl-redirect', `https://${window.location.host}/game/index.php?page=messages`);
            }

            this.ogl.save();
        });

        // add mission's name as tooltip
        document.querySelectorAll('#fleet2 ul#missions a').forEach(e =>
        {
            e.classList.add('tooltip');
            e.setAttribute('title', e.querySelector('span').textContent);
        });
    }

    // add a callback before and/or after a fleetdispatcher function
    overWriteFleetDispatcher(functionName, beforeCallback, afterCallback)
    {
        let old = fleetDispatcher[functionName];

        fleetDispatcher[functionName] = function(param, param2)
        {
            beforeCallback && beforeCallback(param, param2);
            old.call(fleetDispatcher, param, param2);
            afterCallback && afterCallback(param, param2);
        }
    }

    // replace the default "enter" key action on fleetdispatch
    overWriteEnterKey()
    {
        let btn = document.querySelector('#continueToFleet2');
        let newBtn = Util.createDom('div', {'class':'ogl_fleetBtn'}, btn.innerHTML);
        btn.parentNode.replaceChild(newBtn, btn);

        newBtn.addEventListener('click', event =>
        {
            this.nextPageAction(event, true);
        });

        this.fleet1Pressed = false;
        this.fleet2Pressed = false;

        document.querySelector('#fleetdispatchcomponent').addEventListener('keypress', event => { if((event.keyCode || event.which) == 13) event.preventDefault();return false; });
        window.addEventListener('keyup', () => { this.fleet1Pressed = false; this.fleet2Pressed = false; });
        window.addEventListener('keydown', event =>
        {
            let keycode = event.keyCode ? event.keyCode : event.which;

            if(keycode == 13)
            {
                event.preventDefault();

                if(((!document.querySelector('.ui-dialog') || document.querySelector('.ui-dialog').style.display == 'none')
                && !document.querySelector('.chat_box_textarea:focus') && (!document.querySelector('.ogl_overlay.ogl_active'))))
                {
                    this.nextPageAction(event);
                }
                else if(document.querySelector('.ui-dialog').style.display != 'none' && document.querySelector('.ui-dialog a.ok'))
                {
                    document.querySelector('.ui-dialog a.ok').click();
                }
            }
        });
    }

    async nextPageAction(event, noKeyCheck)
    {
        if(navigator.userAgentData && navigator.userAgentData.mobile) noKeyCheck = true;

        //if(!noKeyCheck && document.querySelector('.ogl_capacityContainer.ogl_highlight')) return;
        if(document.querySelector('.ajax_loading').style.display != 'none') return;
        if(this.fleetSent && fleetDispatcher.targetPlanet.position != 16) return;

        //if(fleetDispatcher.currentPage == 'fleet1' && !this.fleet1Pressed && !fleetDispatcher.fetchTargetPlayerDataTimeout)
        if(fleetDispatcher.currentPage == 'fleet1' && !this.fleet1Pressed)
        {
            if(!noKeyCheck && !event.shiftKey) this.fleet1Pressed = true;

            if(!this.ogl.db.options.nextTargets?.[0] && !this.ogl.db.options.nextTargets?.[1] && this.targetSelected) return;

            let differentPosition = false;

            ['galaxy', 'system', 'position', 'type'].forEach(key =>
            {
                if(fleetDispatcher.currentPlanet[key] != fleetDispatcher.targetPlanet[key]) differentPosition = true;
            });

            if(event.shiftKey)
            {
                if(!this.ogl.db.options.nextTargets[0] && !this.ogl.db.options.nextTargets[1]) return;
                document.querySelector('.ogl_keyList [data-trigger="T"]') && document.querySelector('.ogl_keyList [data-trigger="T"]').click();
                this.updatePlanetList();
            }
            else
            {
                if(!differentPosition && (fleetDispatcher.shipsToSend.length == 0 || this.ogl.mode == 4))
                {
                    fleetDispatcher.targetPlanet.type = fleetDispatcher.targetPlanet.type == 3 ? 1 : 3;
                    this.updatePlanetList();
                }
            }

            if(fleetDispatcher.shipsToSend.length == 0)
            {
                let required = this.calcRequiredShips(this.ogl.db.options.defaultShip);
                fleetDispatcher.selectShip(this.ogl.db.options.defaultShip, required);

                if(!fleetDispatcher.mission && !differentPosition)
                {
                    fleetDispatcher.mission = this.ogl.db.options.defaultMission;

                    if(!fleetDispatcher.cargoMetal && !fleetDispatcher.cargoCrystal && !fleetDispatcher.cargoDeuterium)
                    {
                        fleetDispatcher.selectMaxAll();
                    }
                }

                fleetDispatcher.refresh();
            }
            else
            {
                await new Promise((resolve, reject) => setTimeout(() => resolve(), 250));
                fleetDispatcher.trySubmitFleet1();
            }
        }
        else if(fleetDispatcher.currentPage == 'fleet2' && !this.fleet2Pressed)
        {
            if(!noKeyCheck) this.fleet2Pressed = true;

            let differentPosition = false;
            fleetDispatcher.speedPercent = this.sliderSpeed.querySelector('.ogl_active').getAttribute('data-step');

            ['galaxy', 'system', 'position', 'type'].forEach(key =>
            {
                if(fleetDispatcher.currentPlanet[key] != fleetDispatcher.targetPlanet[key]) differentPosition = true;
            });

            if(!differentPosition)
            {
                fleetDispatcher.targetPlanet.type = fleetDispatcher.targetPlanet.type == 3 ? 1 : 3;
                this.updatePlanetList();
                fleetDispatcher.updateTarget();
            }
            else
            {
                await new Promise((resolve, reject) => setTimeout(() =>
                {
                    if(fleetDispatcher.targetPlanet.position == 16)
                    {
                        this.fleet2Pressed = false;
                        this.fleetSent = false;
                    }

                    if(!this.fleetSent)
                    {
                        resolve();
                        fleetDispatcher.trySubmitFleet2();
                    }
                }, 250));
            }
        }
    }

    updateShipsTooltip()
    {
        document.querySelectorAll('.technology').forEach(ship =>
        {
            let shipID = ship.getAttribute('data-technology');
            let shipData = this.ogl.db.ships[shipID];

            if(shipData)
            {
                let amount = parseInt(ship.querySelector('.amount').getAttribute('data-value'));

                ship.title = `
                    <div class="ogl_shipData">
                        <h3>${shipData.name}</h3>
                        <div class="splitLine"></div>
                        <div>Speed: <span>${Util.formatNumber(shipData.speed)}</span></div>
                        <div>Capacity: <span>${Util.formatNumber(shipData.capacity)}</span></div>
                        <div class="splitLine"></div>
                        <div>Quantity: <span>x${Util.formatNumber(amount)}</span></div>
                        <div>Total capacity: <span>${Util.formatNumber(amount * shipData.capacity)}</span></div>
                    </div>
                `;
            }
        });
    }

    updatePrevNextLink()
    {
        if(this.ogl.mode != 1 && this.ogl.mode != 4) return;

        let onMoon = this.ogl.db.collectSource[3] == 3 ? true : false;

        if(this.ogl.mode == 1)
        {
            let next = !onMoon ? this.ogl.next.smallplanet : this.ogl.next.smallplanetWithMoon;
            let nextCoords = `${next.querySelector('.planet-koords').textContent.slice(1, -1)}:${this.ogl.current.type == 'moon' ? 3 : 1}`;

            let prev = !onMoon ? this.ogl.prev.smallplanet : this.ogl.prev.smallplanetWithMoon;
            let prevCoords = `${prev.querySelector('.planet-koords').textContent.slice(1, -1)}:${this.ogl.current.type == 'moon' ? 3 : 1}`;

            let destinationCoords = this.ogl.db.collectDestination.join(':');

            if(nextCoords == destinationCoords) // next
            {
                if(!onMoon)
                {
                    this.ogl.next.smallplanet = this.ogl.next.smallplanet.nextElementSibling || document.querySelectorAll('.smallplanet')[0];
                }
                else
                {
                    if(document.querySelector('.moonlink') && document.querySelectorAll('.moonlink').length > 1)
                    {
                        do this.ogl.next.smallplanetWithMoon = this.ogl.next.smallplanetWithMoon.nextElementSibling || document.querySelectorAll('.moonlink')[0].parentNode;
                        while(!this.ogl.next.smallplanetWithMoon.querySelector('.moonlink'));
                    }
                }
            }
            else if(prevCoords == destinationCoords) // prev
            {
                if(!onMoon)
                {
                    this.ogl.prev.smallplanet = this.ogl.prev.smallplanet.previousElementSibling || document.querySelectorAll('.smallplanet')[document.querySelectorAll('.smallplanet').length - 1];
                }
                else
                {
                    if(document.querySelector('.moonlink') && document.querySelectorAll('.moonlink').length > 1)
                    {
                        do this.ogl.prev.smallplanetWithMoon = this.ogl.prev.smallplanetWithMoon.previousElementSibling || document.querySelectorAll('.moonlink')[document.querySelectorAll('.moonlink').length - 1].parentNode;
                        while(!this.ogl.prev.smallplanetWithMoon.querySelector('.moonlink'));
                    }
                }
            }
        }

        if(this.ogl.mode == 1) // chosen destination
        {
            let next = !onMoon ? this.ogl.next.smallplanet : this.ogl.next.smallplanetWithMoon;
            if(next)
            {
                let nextCoords = next.querySelector('.planet-koords').textContent.slice(1, -1).split(':');
                let id = !onMoon ? new URL(next.querySelector('a.planetlink').href).searchParams.get('cp') : new URL(next.querySelector('a.moonlink').href).searchParams.get('cp');
                this.ogl.nextLink = `https://${window.location.host}/game/index.php?page=ingame&component=fleetdispatch&ogl_mode=1&cp=${id}&galaxy=${this.ogl.db.collectDestination[0]}&system=${this.ogl.db.collectDestination[1]}&position=${this.ogl.db.collectDestination[2]}&type=${this.ogl.db.collectDestination[3]}&mission=${this.ogl.db.options.defaultMission}`;

                if(this.ogl.db.collectSource[0] == nextCoords[0] && this.ogl.db.collectSource[1] == nextCoords[1] && this.ogl.db.collectSource[2] == nextCoords[2])
                {
                    this.ogl.nextLink = `https://${window.location.host}/game/index.php?page=ingame&component=overview`;
                }
            }

            let prev = !onMoon ? this.ogl.prev.smallplanet : this.ogl.prev.smallplanetWithMoon;
            if(prev)
            {
                let id = !onMoon ? new URL(prev.querySelector('a.planetlink').href).searchParams.get('cp') : new URL(prev.querySelector('a.moonlink').href).searchParams.get('cp');
                this.ogl.prevLink = `https://${window.location.host}/game/index.php?page=ingame&component=fleetdispatch&ogl_mode=1&cp=${id}&galaxy=${this.ogl.db.collectDestination[0]}&system=${this.ogl.db.collectDestination[1]}&position=${this.ogl.db.collectDestination[2]}&type=${this.ogl.db.collectDestination[3]}&mission=${this.ogl.db.options.defaultMission}`;
            }
        }
        else if(this.ogl.mode == 4) // linked planet/moon
        {
            let nextCoords = this.ogl.next.smallplanetWithMoon.querySelector('.planet-koords').textContent.slice(1, -1).split(':');
            let nextCp = this.ogl.current.type == 'planet' ? new URL(this.ogl.next.smallplanetWithMoon.querySelector('a.planetlink').href).searchParams.get('cp') : new URL(this.ogl.next.smallplanetWithMoon.querySelector('a.moonlink').href).searchParams.get('cp');
            this.ogl.nextLink = `https://${window.location.host}/game/index.php?page=ingame&component=fleetdispatch&ogl_mode=4&cp=${nextCp}&type=${this.ogl.current.type == 'planet' ? '3' : '1'}&mission=${this.ogl.db.options.defaultMission}`;

            if(this.ogl.db.collectSource[0] == nextCoords[0] && this.ogl.db.collectSource[1] == nextCoords[1] && this.ogl.db.collectSource[2] == nextCoords[2])
            {
                this.ogl.nextLink = `https://${window.location.host}/game/index.php?page=ingame&component=overview`;
            }

            let prevCp = this.ogl.current.type == 'planet' ? new URL(this.ogl.prev.smallplanetWithMoon.querySelector('a.planetlink').href).searchParams.get('cp') : new URL(this.ogl.prev.smallplanetWithMoon.querySelector('a.moonlink').href).searchParams.get('cp');
            this.ogl.prevLink = `https://${window.location.host}/game/index.php?page=ingame&component=fleetdispatch&ogl_mode=4&cp=${prevCp}&type=${this.ogl.current.type == 'planet' ? '3' : '1'}&mission=${this.ogl.db.options.defaultMission}`;
        }

        this.linksUpdated = true;
    }

    // update rightmenu to display fleet's target
    updatePlanetList()
    {
        let targetCoords = `${fleetDispatcher.targetPlanet.galaxy}:${fleetDispatcher.targetPlanet.system}:${fleetDispatcher.targetPlanet.position}`;
        let type = fleetDispatcher.targetPlanet.type;

        document.querySelectorAll('.smallplanet a.ogl_active').forEach(e => e.classList.remove('ogl_active'));
        let target = document.querySelector(`.smallplanet[data-coords="${targetCoords}"]`);

        if(target && type == 1)
        {
            document.querySelector(`.smallplanet[data-coords="${targetCoords}"] .planetlink`)?.classList.add('ogl_active');
        }
        else if(target && type == 3)
        {
            document.querySelector(`.smallplanet[data-coords="${targetCoords}"] .moonlink`)?.classList.add('ogl_active');
        }
    }

    // resources to keep on planet
    resourcesSaving()
    {
        document.querySelectorAll('#fleet2 #resources .res_wrap .resourceIcon').forEach(resource =>
        {
            // set index according to this.resourceKeys order (metal, crystal, deut, food)
            let index = 0;
            this.resourceKeys.forEach((res, ind) => { if(resource.classList.contains(res.replace('deut', 'deuterium'))) index = ind; });

            resource = resource.parentNode;

            let deltaResources = resource.querySelector('.res').appendChild(Util.createDom('div', {'class':'ogl_delta material-icons'}, 'fiber_smart_record'));
            deltaResources.addEventListener('click', () =>
            {
                let resourceValue = Util.formatFromUnits(resource.querySelector('input').value) || 0;
                let currentMax = fleetDispatcher[this.resourceOnKeys[index]];

                if(index == 2) currentMax -= fleetDispatcher.getConsumption();

                fleetDispatcher[this.cargoKeys[index]] = Math.min(currentMax, Math.max(0, currentMax - resourceValue));
                resource.querySelector('input').value = fleetDispatcher[this.cargoKeys[index]];

                setTimeout(() => document.querySelector('#sendFleet').focus(), 100);
            });

            let edit = resource.querySelector('.res').appendChild(Util.createDom('div', {'class':'ogl_resourceSaver material-icons tooltip ogl_input', 'title':`${this.resourceNames[index]} ${this.ogl.component.lang.getText('keepOnPlanet')}`}, 'play_for_work'));
            edit.addEventListener('click', () =>
            {
                this.ogl.component.tooltip.close(true);
                edit.classList.add('tooltipClose');
                this.ogl.component.tooltip.lastSender = edit;

                let content = Util.createDom('div', {'class':'ogl_preloadResources'}, `<h2>${this.resourceNames[index]} ${this.ogl.component.lang.getText('keepOnPlanet')}</h2>`);
                content.appendChild(Util.createDom('div', {'class':`ogl_shipIcon ogl_${this.resourceKeys[index]}`}));

                let input = content.appendChild(Util.createDom('input', {'type':'text', 'class':'ogl_input'}, '0'));
                input.addEventListener('keydown', e =>
                {
                    if(e.keyCode === 13)
                    {
                        this.fleet2Pressed = true;
                        content.querySelector('button').click();
                    }
                });

                setTimeout(() => input.focus(), 100);

                content.appendChild(Util.createDom('button', {'class':'ogl_button ogl_fullGrid'}, 'OK'))
                .addEventListener('click', () =>
                {
                    this.ogl.db.options.resSaver[index] = parseInt(input.value?.replace(/\D/g,'') || 0);
                    fleetDispatcher[this.resourceOnKeys[index]] = Math.max(0, this.ogl.current[this.resourceKeys[index]] - this.ogl.db.options.resSaver[index]);
                    this.totalOnPlanet = fleetDispatcher.metalOnPlanet + fleetDispatcher.crystalOnPlanet + fleetDispatcher.deuteriumOnPlanet + fleetDispatcher.foodOnPlanet || this.ogl.current.metal + this.ogl.current.crystal + this.ogl.current.deut + this.ogl.current.food || 0;
                    fleetDispatcher.refresh();
                    this.ogl.component.tooltip.close(true);

                    if(this.ogl.db.options.resSaver[index])
                    {
                        edit.classList.remove('material-icons');
                        edit.classList.add('ogl_active');
                        edit.textContent = '-' + Util.formatToUnits(this.ogl.db.options.resSaver[index], 0);
                    }
                    else
                    {
                        edit.classList.add('material-icons');
                        edit.classList.remove('ogl_active');
                        edit.textContent = 'play_for_work';
                    }

                    edit.classList.remove('tooltipClose');
                    // this.ogl.saveAsync();
                });

                this.ogl.component.tooltip.update(edit, content);
            });

            edit.addEventListener('mouseover', () => edit.classList.remove('tooltipClose'));

            if(this.ogl.db.options.resSaver[index])
            {
                edit.classList.remove('material-icons');
                edit.classList.add('ogl_active');
                edit.textContent = '-' + Util.formatToUnits(this.ogl.db.options.resSaver[index], 0);
            }

            resource.querySelector('input').classList.add('ogl_input');
        });
    }

    // right menu planets are destination shortcut on fleet2
    planetsAreDestinations()
    {
        document.querySelectorAll('.smallplanet > a.planetlink, .smallplanet > a.moonlink').forEach(link =>
        {
            link.addEventListener('click', event =>
            {
                if(fleetDispatcher.currentPage == 'fleet2')
                {
                    event.preventDefault();

                    document.querySelector('.smallplanet a.ogl_active') && document.querySelector('.smallplanet a.ogl_active').classList.remove('ogl_active');

                    let destination = link.closest('.smallplanet').querySelector('.planet-koords').textContent.slice(1, -1).split(':');
                    let type = link.classList.contains('planetlink') ? 1 : 3;
                    fleetDispatcher.targetPlanet.galaxy = destination[0];
                    fleetDispatcher.targetPlanet.system = destination[1];
                    fleetDispatcher.targetPlanet.position = destination[2];
                    fleetDispatcher.targetPlanet.type = type;
                    fleetDispatcher.refresh();
                    fleetDispatcher.updateTarget();

                    link.classList.add('ogl_active');
                }
            });
        });
    }

    // replace the default speed selector
    replaceSpeedSelector()
    {
        this.sliderSpeed = Util.createDom('div', {'class':'ogl_fleetSpeed'});
        if(this.ogl.account.class == 2) this.sliderSpeed.classList.add('ogl_big');
        document.querySelector('#fleetboxbriefingandresources form').insertBefore(this.sliderSpeed, document.querySelector('#fleet2 div#mission'));

        let steps = this.ogl.account.class == 2 ? .5 : 1;

        for(let i=steps; i<=10; i+=steps)
        {
            let step = this.sliderSpeed.appendChild(Util.createDom('div', {'data-step':i}, i*10));
            if(fleetDispatcher.speedPercent == i) step.classList.add('ogl_active');
        }

        this.sliderSpeed.addEventListener('click', event =>
        {
            if(!event.target.getAttribute('data-step')) return;

            if(fleetDispatcher.cargoDeuterium + this.conso >= fleetDispatcher.deuteriumOnPlanet)
            {
                fleetDispatcher.speedPercent = event.target.getAttribute('data-step');
                fleetDispatcher.cargoDeuterium = 0;
                fleetDispatcher.selectMaxDeuterium();
            }

            this.sliderSpeed.querySelectorAll('div').forEach(e => e.classList.remove('ogl_active'));
            event.target.classList.add('ogl_active');
            fleetDispatcher.speedPercent = event.target.getAttribute('data-step');

            fleetDispatcher.refresh();
            this.conso = fleetDispatcher.getConsumption();

            setTimeout(() => document.querySelector('#sendFleet').focus(), 100);
        });

        this.sliderSpeed.addEventListener('mouseover', event =>
        {
            if(!event.target.getAttribute('data-step')) return;
            fleetDispatcher.speedPercent = event.target.getAttribute('data-step');
            fleetDispatcher.refresh();
        });

        this.sliderSpeed.addEventListener('mouseout', event =>
        {
            fleetDispatcher.speedPercent = this.sliderSpeed.querySelector('.ogl_active').getAttribute('data-step');
            fleetDispatcher.refresh();
        });
    }

    updateSpeedPercent()
    {
        this.sliderSpeed.querySelectorAll('div').forEach(e => e.classList.remove('ogl_active'));
        this.sliderSpeed.querySelector(`[data-step="${fleetDispatcher.speedPercent}"]`).classList.add('ogl_active');
    }

    // add required ship indicator to move all the resources
    addRequired()
    {
        this.defaultShipsList.forEach(shipID =>
        {
            let tech = document.querySelector(`#fleet1 .technology[data-technology="${shipID}"]`);
            let required = this.calcRequiredShips(shipID);
            tech?.querySelector('.icon')?.appendChild(Util.createDom('div', {'class':'ogl_required'}, Util.formatNumber(required)))
            .addEventListener('click', e =>
            {
                e.stopPropagation();
                fleetDispatcher.selectShip(shipID, required);
                fleetDispatcher.refresh();
            });
        });
    }

    // reverse the ship selection
    addReverse()
    {
        fleetDispatcher.totalFret = 0;

        fleetDispatcher.shipsOnPlanet.forEach(ship =>
        {
            fleetDispatcher.totalFret += this.ogl.db.ships[ship.id].capacity * ship.number;

            let tech = document.querySelector(`#fleet1 .technology[data-technology="${ship.id}"`);
            tech.querySelector('input').classList.add('ogl_input');
            tech.querySelector('.icon').appendChild(Util.createDom('div', {'class':'ogl_delta material-icons'}, 'fiber_smart_record'))
            .addEventListener('click', e =>
            {
                e.stopPropagation();
                let delta = fleetDispatcher.shipsOnPlanet.find(e => e.id == ship.id)?.number - (fleetDispatcher.findShip(ship.id)?.number || 0);
                fleetDispatcher.selectShip(ship.id, delta);
                fleetDispatcher.refresh();
            });
        });
    }

    // cargo capacity indicator & preload resources
    addCapacity()
    {
        let container = document.querySelector('#fleet1 .allornonewrap').appendChild(Util.createDom('div', {'class':'ogl_capacityContainer tooltip', 'title':this.ogl.component.lang.getText('capacityPicker')}));
        let dom = container.appendChild(Util.createDom('div', {'class':'ogl_capacityInfo'}));
        let required = dom.appendChild(Util.createDom('div', {'class':'ogl_capacityRequired'}, this.ogl.component.lang.getText('required') + ' ' + Util.formatNumber(this.totalOnPlanet)));

        let capacityValues = dom.appendChild(Util.createDom('p'));
        let current = dom.appendChild(Util.createDom('div', {'class':'ogl_capacityCurrent'}));
        container.appendChild(Util.createDom('i', {'class':'material-icons'}, 'launch'));
        required.appendChild(Util.createDom('div'));
        required.style.width = Math.min(this.totalOnPlanet / fleetDispatcher.totalFret * 100, 100) + '%';
        if(this.totalOnPlanet > fleetDispatcher.totalFret) bar.classList.add('ogl_active');

        this.overWriteFleetDispatcher('resetCargo', false, () =>
        {
            let domWidth = fleetDispatcher.getCargoCapacity() / fleetDispatcher.totalFret * 100;
            current.style.width = domWidth + '%';
            capacityValues.innerHTML = `<span class="float_right"><b>${Util.formatNumber(fleetDispatcher.getCargoCapacity())}</b> / <b>${Util.formatNumber(fleetDispatcher.totalFret)}</b></span>`;
        });

        container.addEventListener('mouseout', () =>
        {
            container.classList.remove('tooltipClose');
        });

        container.addEventListener('click', () =>
        {
            this.ogl.component.tooltip.close(true);
            container.classList.add('tooltipClose');
            this.ogl.component.tooltip.lastSender = container;

            let content = Util.createDom('div', {'class':'ogl_preloadResources'}, `<h2>${this.ogl.component.lang.getText('capacityPicker')}</h2>`);
            let inputList = {};
            ['metal', 'crystal', 'deut'].forEach(res =>
            {
                let icon = content.appendChild(Util.createDom('div', {'class':`ogl_shipIcon ogl_${res} material-icons`}, 'double_arrow'));
                icon.addEventListener('click', () =>
                {
                    let attr = res == 'metal' ? 'metalOnPlanet' : res == 'crystal' ? 'crystalOnPlanet' : 'deuteriumOnPlanet';
                    inputList[res].value = fleetDispatcher[attr];
                });

                inputList[res] = content.appendChild(Util.createDom('input', {'type':'text', 'class':'ogl_input'}, '0'));
                inputList[res].addEventListener('keydown', e =>
                {
                    if(e.keyCode === 13)
                    {
                        this.fleet1Pressed = true;
                        content.querySelectorAll('button')[1].click();
                    }
                });
            });
            setTimeout(() => inputList.metal.focus(), 100);

            let actions = content.appendChild(Util.createDom('div'));

            actions.appendChild(Util.createDom('button', {'class':'ogl_button'}, 'Max.'))
            .addEventListener('click', () =>
            {
                inputList.metal.value = fleetDispatcher.metalOnPlanet;
                inputList.crystal.value = fleetDispatcher.crystalOnPlanet;
                inputList.deut.value = fleetDispatcher.deuteriumOnPlanet;

                fleetDispatcher.refresh();
            });

            actions.appendChild(Util.createDom('button', {'class':'ogl_button'}, 'OK'))
            .addEventListener('click', () =>
            {
                fleetDispatcher.cargoMetal = 0;
                fleetDispatcher.cargoCrystal = 0;
                fleetDispatcher.cargoDeuterium = 0;
                fleetDispatcher.refresh();

                let total = parseInt(inputList.metal.value?.replace(/\D/g,'') || 0) + parseInt(inputList.crystal.value?.replace(/\D/g,'') || 0)  + parseInt(inputList.deut.value?.replace(/\D/g,'') || 0);
                let required = this.calcRequiredShips(this.ogl.db.options.defaultShip, total);

                (async() =>
                {
                    await fleetDispatcher.selectShip(this.ogl.db.options.defaultShip, required);
                    fleetDispatcher.cargoMetal = Math.min(parseInt(inputList.metal.value?.replace(/\D/g,'') || 0), fleetDispatcher.metalOnPlanet, fleetDispatcher.getFreeCargoSpace());
                    fleetDispatcher.cargoCrystal = Math.min(parseInt(inputList.crystal.value?.replace(/\D/g,'') || 0), fleetDispatcher.crystalOnPlanet, fleetDispatcher.getFreeCargoSpace());
                    fleetDispatcher.cargoDeuterium = Math.min(parseInt(inputList.deut.value?.replace(/\D/g,'') || 0), fleetDispatcher.deuteriumOnPlanet, fleetDispatcher.getFreeCargoSpace());
                    fleetDispatcher.refresh();

                    this.ogl.component.tooltip.close(true);

                    container.classList.remove('tooltipClose');
                })();
            });

            this.ogl.component.tooltip.update(container, content);
        });
    }

    // collect resources when the harvest button has been clicked
    collectResources()
    {
        let required = this.calcRequiredShips(this.ogl.db.options.defaultShip);
        fleetDispatcher.selectShip(this.ogl.db.options.defaultShip, required);

        if(this.ogl.mode == 4)
        {
            fleetDispatcher.targetPlanet.type = fleetDispatcher.targetPlanet.type == 3 ? 1 : 3;
        }

        fleetDispatcher.refresh();

        this.overWriteFleetDispatcher('submitFleet2', () => localStorage.setItem('ogl-redirect', this.ogl.nextLink));
    }

    checkFleetMovement()
    {
        if(this.ogl.page == 'movement')
        {
            document.querySelectorAll('.fleetDetails').forEach(line =>
            {
                let onBack = line.getAttribute('data-return-flight');
                let missionType = line.getAttribute('data-mission-type');

                // header
                let header = Util.createDom('div', {'class':'ogl_topLine'});

                let smallMission = header.appendChild(Util.createDom('div'));
                smallMission.appendChild(Util.createDom('div', {'class':'ogl_shipIcon ogl_mission'+missionType}));

                let leftTime = header.appendChild(Util.createDom('div'));
                leftTime.appendChild(line.querySelector('.timer') || Util.createDom('div'));

                let leftAbsTime = header.appendChild(Util.createDom('div'));
                leftAbsTime.appendChild(line.querySelector('.absTime') || Util.createDom('div'));

                let originCoords = header.appendChild(Util.createDom('div'));
                originCoords.appendChild(line.querySelector('.originCoords') || Util.createDom('div'));
                if(onBack) originCoords.classList.add('ogl_active');

                let originPlanet = header.appendChild(Util.createDom('div'));
                originPlanet.appendChild(line.querySelector('.originPlanet') || Util.createDom('div'));
                if(onBack) originPlanet.classList.add('ogl_active');

                let iconFleet = header.appendChild(Util.createDom('div', {'class':'ogl_active'}));
                iconFleet.appendChild(line.querySelector('.starStreak .route a') || Util.createDom('div'));
                iconFleet.querySelector('a').style.transform = 'scale(.75)';

                let destinationPlanet = header.appendChild(Util.createDom('div'));
                destinationPlanet.appendChild(line.querySelector('.destinationPlanet') || Util.createDom('div'));
                if(!onBack) destinationPlanet.classList.add('ogl_active');

                let destinationCoords = header.appendChild(Util.createDom('div'));
                destinationCoords.appendChild(line.querySelector('.destinationCoords') || Util.createDom('div'));
                if(!onBack) destinationCoords.classList.add('ogl_active');

                let rightAbsTime = header.appendChild(Util.createDom('div'));
                rightAbsTime.appendChild(line.querySelector('.nextabsTime') || Util.createDom('div'));

                let rightTime = header.appendChild(Util.createDom('div'));
                rightTime.appendChild(line.querySelector('.nextTimer') || Util.createDom('div'));

                // grid
                let id = '#'+iconFleet.querySelector('a').getAttribute('rel');
                let div = document.querySelector(id);
                let container = Util.createDom('div', {'class':'ogl_shipDetail'});

                div.querySelectorAll('.fleetinfo tr').forEach((line, index) =>
                {
                    if(line.querySelector('td'))
                    {
                        let shipLine = Util.createDom('div', {'class':'ogl_movementItem'});
                        let shipID = Util.findObjectByValue(this.ogl.db.loca, line.querySelector('td').textContent.replace(':', ''))
                        || (Object.entries(this.ogl.db.ships).find(e => e[1].name == line.querySelector('td').textContent.replace(':', '')) || [false])[0] || -1;

                        if(shipID == 'metal') container.prepend(shipLine);
                        else if(shipID == 'crystal') container.insertBefore(shipLine, container.querySelectorAll('.ogl_movementItem')[1]);
                        else if(shipID == 'deut') container.insertBefore(shipLine, container.querySelectorAll('.ogl_movementItem')[2]);
                        else if(shipID == 'food') container.insertBefore(shipLine, container.querySelectorAll('.ogl_movementItem')[3]);
                        //else if(shipID == -1) container.prepend(shipLine);
                        else if(shipID && shipID != -1) container.appendChild(shipLine);

                        let shipNumber = line.querySelector('td.value') ? line.querySelector('td.value').textContent : '0';
                        if(shipID && shipID != -1)
                        {
                            shipLine.appendChild(Util.createDom('div', {'class':'ogl_shipIcon ogl_'+shipID}));
                            shipLine.appendChild(Util.createDom('span', {'class':'ogl_'+shipID}, Util.formatToUnits(Util.formatNumber(shipNumber), 0).replace(' ','')));
                        }
                    }
                });

                let missionIcon = Util.createDom('div', {'class':'ogl_shipIcon ogl_mission'+missionType});
                container.prepend(Util.createDom('div', {'class':'ogl_movementItem'}, missionIcon.outerHTML));

                // actions
                let actions = Util.createDom('div', {'class':'ogl_actions'});

                let reduceButton = actions.appendChild(Util.createDom('div'));
                let reduceContent = reduceButton.appendChild(line.querySelector('.openDetails') || Util.createDom('div'));
                if(reduceContent.innerHTML === '') reduceButton.classList.add('ogl_hidden');

                let backButton = actions.appendChild(Util.createDom('div'));
                let backContent = backButton.appendChild(line.querySelector('.reversal') || Util.createDom('div'));
                if(!onBack) destinationCoords.classList.add('ogl_active');
                if(backContent.innerHTML === '') backButton.classList.add('ogl_hidden');

                if(backButton.querySelector('a'))
                {
                    let time = backButton.querySelector('a').getAttribute('data-title') || backButton.querySelector('a').getAttribute('title');
                    time = time.replace('<br>',' ');
                    time = time.replace(/ \.$/, '');
                    time = time.trim().replace(/[ \.]/g, ':');
                    time = time.split(':');

                    let initialTime = Date.now();
                    time = new Date(`${time[4]}-${time[3]}-${time[2]}T${time[5]}:${time[6]}:${time[7]}`).getTime();

                    let domParent = actions.appendChild(Util.createDom('div', {'class':'ogl_backTime'}));
                    let domElement = domParent.appendChild(Util.createDom('div', {'class':'ogl_fulldate ogl_hiddenContent ogl_timeZone ogl_backTimer'}));

                    setInterval(() =>
                    {
                        const deltaTime = Date.now() - initialTime;
                        const newTime = new Date((time + timeDelta - Math.round(timeDiff / 100000) * 100000) + deltaTime * 2);

                        domElement.setAttribute('data-servertime', newTime.getTime());
                        domElement.setAttribute('data-datezone', `${newTime.toLocaleDateString('fr-FR').replace(/\//g, '.')} `);
                        domElement.setAttribute('data-timezone', ` ${newTime.toLocaleTimeString('fr-FR')}`);
                    }, 500);
                }
                else actions.appendChild(Util.createDom('div'));

                let mailButton = actions.appendChild(Util.createDom('div'));
                let mailContent = mailButton.appendChild(line.querySelector('.sendMail') || Util.createDom('div'));
                if(mailContent.innerHTML === '') mailButton.classList.add('ogl_hidden');

                let agsButton = actions.appendChild(Util.createDom('div'));
                let agsContent = agsButton.appendChild(line.querySelector('.fedAttack a') || Util.createDom('div'));
                if(!onBack) destinationCoords.classList.add('ogl_active');
                if(agsContent.innerHTML === '') agsButton.classList.add('ogl_hidden');

                let agsName = actions.appendChild(Util.createDom('div', {'class':'ogl_agsName'}));
                let agsNameContent = agsName.appendChild(line.querySelector('.allianceName') || Util.createDom('div'));
                if(agsNameContent.innerHTML === '') agsName.classList.add('ogl_hidden');

                actions.appendChild(Util.createDom('div'));

                /*let misisonText = actions.appendChild(Util.createDom('div'));
                misisonText.appendChild(line.querySelector('.mission') || Util.createDom('div'));*/

                line.appendChild(actions);
                line.appendChild(container);
                line.appendChild(header);
            });

            return;
            // update back timer
            /*let updateBackTimer = (parent, time, offset) =>
            {
                let newTime = new Date(`${time[4]}-${time[3]}-${time[2]}T${time[5]}:${time[6]}:${time[7]}`).getTime();
                newTime = new Date((newTime - Math.round(timeDiff / 100000) * 100000) + offset * 2);

                parent.setAttribute('data-servertime', newTime.getTime());
                parent.setAttribute('data-datezone', `${newTime.toLocaleDateString('fr-FR').replace(/\//g, '.')} `);
                parent.setAttribute('data-timezone', ` ${newTime.toLocaleTimeString('fr-FR')}`);
            }*/

            // add back timer
            document.querySelectorAll('.reversal a').forEach((button, index) =>
            {
                setTimeout(() =>
                {
                    let time = button.getAttribute('data-tooltip') || button.getAttribute('title');
                    time = time.replace('<br>',' ');
                    time = time.replace(/ \.$/, '');
                    time = time.trim().replace(/[ \.]/g, ':');
                    time = time.split(':');

                    let initialTime = Date.now();
                    time = new Date(`${time[4]}-${time[3]}-${time[2]}T${time[5]}:${time[6]}:${time[7]}`).getTime();

                    let domElement = button.closest('.fleetDetails').appendChild(Util.createDom('div', {'class':'ogl_fulldate ogl_hiddenContent ogl_timeZone ogl_backTimer'}));

                    setInterval(() =>
                    {
                        const deltaTime = Date.now() - initialTime;
                        const newTime = new Date((time + timeDelta - Math.round(timeDiff / 100000) * 100000) + deltaTime * 2);

                        domElement.setAttribute('data-servertime', newTime.getTime());
                        domElement.setAttribute('data-datezone', `${newTime.toLocaleDateString('fr-FR').replace(/\//g, '.')} `);
                        domElement.setAttribute('data-timezone', ` ${newTime.toLocaleTimeString('fr-FR')}`);
                    }, 500);
                }, index * 5);
            });

            // replace default mouvement menu
            document.querySelectorAll('.starStreak .route').forEach(movement =>
            {
                let id = '#'+movement.querySelector('a').getAttribute('rel');
                let div = document.querySelector(id);
                let container = movement.closest('.fleetDetails').appendChild(Util.createDom('div',{'class':'ogl_shipDetail'}));

                movement.querySelector('a').classList.add('ogl_inFlight');

                div.querySelectorAll('.fleetinfo tr').forEach((line, index) =>
                {
                    if(line.querySelector('td'))
                    {
                        let shipLine = Util.createDom('div', {'class':'ogl_movementItem'});
                        let shipID = Util.findObjectByValue(this.ogl.db.loca, line.querySelector('td').textContent.replace(':', ''))
                        || (Object.entries(this.ogl.db.ships).find(e => e[1].name == line.querySelector('td').textContent.replace(':', '')) || [false])[0] || -1;

                        if(shipID == 'metal') container.prepend(shipLine);
                        else if(shipID == 'crystal') container.insertBefore(shipLine, container.querySelectorAll('.ogl_movementItem')[1]);
                        else if(shipID == 'deut') container.insertBefore(shipLine, container.querySelectorAll('.ogl_movementItem')[2]);
                        else if(shipID == 'food') container.insertBefore(shipLine, container.querySelectorAll('.ogl_movementItem')[3]);
                        else if(shipID == -1) container.prepend(shipLine);
                        else container.appendChild(shipLine);

                        let shipNumber = line.querySelector('td.value') ? line.querySelector('td.value').textContent : '0';
                        if(shipID && shipID != -1)
                        {
                            shipLine.appendChild(Util.createDom('div', {'class':'ogl_shipIcon ogl_'+shipID}));
                            shipLine.appendChild(Util.createDom('span', {'class':'ogl_'+shipID}, Util.formatToUnits(Util.formatNumber(shipNumber), 0).replace(' ','')));
                        }
                    }
                });
            });
        }
    }

    calcRequiredShips(shipID, resources)
    {
        resources = resources ?? this.totalOnPlanet;
        return Math.ceil(resources / this.ogl.db.ships[shipID].capacity);
    }

    sendSpyProbe(coords, count, sender, noPopup, callback)
    {
        this.spyQueue = this.spyQueue || [];
        this.spyQueue.push({coords:coords, count:count, sender:sender, noPopup:noPopup, callback:callback});

        sender && sender.classList.add('ogl_loading');
        if(this.spyReady) this.trySendProbes();
    }

    trySendProbes()
    {
        if(this.spyQueue?.length)
        {
            let coords = this.spyQueue[0].coords;
            let count = this.spyQueue[0].count;
            let sender = this.spyQueue[0].sender;
            let noPopup = this.spyQueue[0].noPopup;
            let callback = this.spyQueue[0].callback;

            let params =
            {
                mission:6,
                galaxy:coords[0],
                system:coords[1],
                position:coords[2],
                type:coords[3],
                shipCount:count,
                token:token,
            }

            let self = this;

            this.spyReady = false;

            $.ajax(miniFleetLink,
            {
                data:params,
                dataType:"json",
                type:"POST",
                success:function(data)
                {
                    if(typeof data.newAjaxToken != "undefined")
                    {
                        token = data.newAjaxToken;
                    }

                    if(sender)
                    {
                        sender.classList.remove('ogl_disabled');
                        sender.classList.remove('ogl_danger');
                    }

                    if(!data.response.success && data.response.coordinates) fadeBox(data.response.message + ' ' + coords[0] + ":" + coords[1] + ":" + coords[2], !data.response.success);
                    if(data.response.coordinates && !noPopup) fadeBox(data.response.message + ' ' + data.response.coordinates.galaxy + ":" + data.response.coordinates.system + ":" + data.response.coordinates.position, !data.response.success);

                    if(sender && data.response.success)
                    {
                        sender.classList.remove('ogl_loading');
                        sender.classList.add('ogl_disabled');

                        let index = self.ogl.find(self.ogl.db.positions, 'coords', `${coords[0]}:${coords[1]}:${coords[2]}`)[0];
                        if(index)
                        {
                            coords[3] == 3 ? self.ogl.db.positions[index].lastMoonSpy = serverTime.getTime() : self.ogl.db.positions[index].lastSpy = serverTime.getTime();
                            self.ogl.save();
                        }
                    }
                    else if(sender && !data.response.success && data.response.coordinates)
                    {
                        sender.classList.remove('ogl_loading');
                        sender.classList.add('ogl_danger');
                    }

                    if(callback) callback(data);

                    self.spyReady = true;

                    if(data.response.coordinates)
                    {
                        self.spyQueue.shift();
                    }

                    self.trySendProbes();
                },
                error:function(error)
                {
                    fadeBox('Error');
                    sender.classList.remove('ogl_loading');
                    if(sender) sender.classList.add('ogl_danger');

                    self.spyReady = true;
                    self.trySendProbes();
                }
            });
        }
    }

    expedition(mainShipID)
    {
        fleetDispatcher.resetShips();
        fleetDispatcher.resetCargo();

        let coords = [fleetDispatcher.currentPlanet.galaxy, fleetDispatcher.currentPlanet.system, fleetDispatcher.currentPlanet.position];
        let fillerID = 0;
        let maxTotal = 0;
        let minShip = 0;
        let currentStep = 0;
        let minFactor202to203 = 3;
        let minFactor202to219 = 5.75;

        let steps =
        {
            10000 : { 202:10, 'max':40000 },
            100000 : { 202:125, 'max':500000 },
            1000000 : { 202:300, 'max':1200000 },
            5000000 : { 202:450, 'max':1800000 },
            25000000 : { 202:600, 'max':2400000 },
            50000000 : { 202:750, 'max':3000000 },
            75000000 : { 202:900, 'max':3600000 },
            100000000 : { 202:1050, 'max':4200000 },
            Infinity : { 202:1250, 'max':5000000 },
        }

        for(const [key, value] of Object.entries(steps))
        {
            steps[key][203] = Math.ceil(steps[key][202] / minFactor202to203);
            steps[key][219] = Math.ceil(steps[key][202] / minFactor202to219);

            if(this.ogl.db.topScore[0] < key && !currentStep) currentStep = key;
        }

        maxTotal = steps[currentStep]['max'];
        minShip = steps[currentStep][mainShipID];
        maxTotal = this.ogl.account.class == 3 ? maxTotal * 3 * this.ogl.universe.ecoSpeed : maxTotal * 2;
        let mainAmount = Math.max(minShip, this.calcRequiredShips(mainShipID, maxTotal));

        [218, 213, 211, 215, 207].forEach(shipID =>
        {
            let count = document.querySelector(`.technology[data-technology="${shipID}"] .amount`).getAttribute('data-value');
            if(fillerID == 0 && count > 0) fillerID = shipID;
        });

        if(this.ogl.db.options.togglesOff.indexOf('bigShip') > -1) fillerID = 0;

        shipsOnPlanet.forEach(ship =>
        {
            if(ship.id == mainShipID) fleetDispatcher.selectShip(ship.id, mainAmount);
            else if(ship.id == fillerID && mainShipID != fillerID) fleetDispatcher.selectShip(ship.id, 1);
            else if(ship.id == 210) fleetDispatcher.selectShip(ship.id, 1);
            else if(ship.id == 219 && mainShipID != 219) fleetDispatcher.selectShip(ship.id, 1);
        });

        fleetDispatcher.targetPlanet.galaxy = coords[0];
        fleetDispatcher.targetPlanet.system = coords[1];
        fleetDispatcher.targetPlanet.position = 16;
        fleetDispatcher.targetPlanet.type = 1;
        fleetDispatcher.targetPlanet.name = 'Expedition';
        fleetDispatcher.mission = 15;
        fleetDispatcher.expeditionTime = 1;
        fleetDispatcher.refresh();

        //setTimeout(() => document.querySelector('#continueToFleet2').focus(), 100);
    }
}

class EmpireManager
{
    constructor(ogl)
    {
        this.ogl = ogl;
        this.addTimers();

        /* CUSTOM PUMPK1IN */
        this.unfoldEventsOnOverview();
        /* END CUSTOM PUMPK1IN */

        this.resourceSum = Util.createDom('div', {'class':'ogl_resourcesSum'});
        let i = this.resourceSum.appendChild(Util.createDom('i'));
        i.appendChild(Util.createDom('div', {'class':'ogl_loader'}));
        this.resourceSum.appendChild(Util.createDom('div', {'class':'ogl_metal'}, '0'));
        this.resourceSum.appendChild(Util.createDom('div', {'class':'ogl_sub ogl_metal'}, '+0'));
        this.resourceSum.appendChild(Util.createDom('div', {'class':'ogl_crystal'}, '0'));
        this.resourceSum.appendChild(Util.createDom('div', {'class':'ogl_sub ogl_crystal'}, '+0'));
        this.resourceSum.appendChild(Util.createDom('div', {'class':'ogl_deut'}, '0'));
        this.resourceSum.appendChild(Util.createDom('div', {'class':'ogl_sub ogl_deut'}, '+0'));

        (document.querySelector('#cutty') || document.querySelector('#norm')).querySelector('#myPlanets, #myWorlds').after(this.resourceSum);

        if(!this.ogl.prevLink) this.ogl.prevLink = this.ogl.current.type == 'moon' ? this.ogl.prev.smallplanetWithMoon.querySelector('.moonlink')?.getAttribute('href') || this.ogl.prev.smallplanet.querySelector('.planetlink')?.getAttribute('href') : this.ogl.prev.smallplanet.querySelector('.planetlink')?.getAttribute('href');
        if(!this.ogl.nextLink) this.ogl.nextLink = this.ogl.current.type == 'moon' ? this.ogl.next.smallplanetWithMoon.querySelector('.moonlink')?.getAttribute('href') || this.ogl.next.smallplanet.querySelector('.planetlink')?.getAttribute('href') : this.ogl.next.smallplanet.querySelector('.planetlink')?.getAttribute('href');

        this.mainResources = ['metal', 'crystal', 'deut', 'dm'];
        this.myPlanets = {};
        this.total = [0,0,0,0];
        this.onPlanet = [0,0,0,0];
        this.prod = [0,0,0,0];
        this.locked = [0,0,0,0];
        this.flightResources = [0,0,0,0];

        let isGroup = false;
        let lastCoords, countGroup = 0;

        document.querySelectorAll('.smallplanet').forEach(p =>
        {
            let coords = p.querySelector('.planetlink .planet-koords').textContent.slice(1,-1).split(':');

            if(lastCoords == coords[0] + ':' + coords[1])
            {
                p.setAttribute('data-multi', countGroup);
                isGroup = true;
            }
            else
            {
                if(isGroup) countGroup++;
                isGroup = false;
            }

            lastCoords = coords[0] + ':' + coords[1];
        });

        this.ogl.observeMutation(() => this.reloadEventbox(), 'eventbox');

        new Promise(resolve =>
        {
            resolve(this.checkPlanetResources());
        })
        .then(() =>
        {
            this.checkLockedTechs();
            this.checkStorage();
            this.getEmpireData();
            this.checkMovement();
            this.addStats();
            this.checkCrawlers();

            this.ogl.performances.push(['Empire',performance.now()]);
        });

        //this.checkPlanetResources();
        //this.checkLockedTechs();
        //this.checkStorage();
        //this.checkMovement();
        //this.addStats();
        //this.checkCrawlers();

        //setTimeout(() => this.getEmpireData(), 10);
    }

    /* CUSTOM PUMPK1IN */
    unfoldEventsOnOverview()
    {
        if(this.ogl.db.options.togglesOff.indexOf('unfoldEventsOnOverview') > -1) return;

        if (window.location.href.indexOf("component=overview") > -1) {
            document.getElementById("eventboxContent").style.display = "block";
            this.reloadEventbox();
        }
    }
    /* END CUSTOM PUMPK1IN */

    // add planet "last refresh" timer
    addTimers()
    {
        if(this.ogl.db.options.togglesOff.indexOf('timers') > -1) return;

        let now = serverTime.getTime();
        let currentCoords = this.ogl.current.coords.join(':');

        if(!this.ogl.db.myActivities[currentCoords]) this.ogl.db.myActivities[currentCoords] = [0, 0];

        let planetActivity = this.ogl.db.myActivities[currentCoords][0];
        let moonActivity = this.ogl.db.myActivities[currentCoords][1];

        if(this.ogl.current.type == 'moon') moonActivity = now;
        else planetActivity = now;

        this.ogl.db.myActivities[currentCoords] = [planetActivity, moonActivity];

        document.querySelectorAll('.smallplanet').forEach(planet =>
        {
            let coords = planet.querySelector('.planet-koords').textContent.slice(1, -1);
            let timers = this.ogl.db.myActivities[coords] || [0,0];

            let pt =  Math.min(Math.round((now - timers[0]) / 60000), 60);
            let pTimer = planet.querySelector('.planetlink').appendChild(Util.createDom('div', {'class':'ogl_timer ogl_medium ogl_short', 'data-timer':pt}));

            this.updateTimer(pTimer, timers[0]);
            setInterval(() => this.updateTimer(pTimer, timers[0]), 20000);

            if(planet.querySelector('.moonlink'))
            {
                let mt =  Math.min(Math.round((now - timers[1]) / 60000), 60);
                let mTimer = planet.querySelector('.moonlink').appendChild(Util.createDom('div', {'class':'ogl_timer ogl_medium ogl_short', 'data-timer':mt}));

                this.updateTimer(mTimer, timers[1]);
                setInterval(() => this.updateTimer(mTimer, timers[1]), 20000);
            }
        });
    }

    updateTimer(element, timer)
    {
        let time = Math.min(Math.round((serverTime.getTime() - timer) / 60000), 60);

        if(time >= 15) element.classList.remove('ogl_short');
        if(time >= 30) element.classList.remove('ogl_medium');
        if(time >= 60) return;

        element.setAttribute('data-timer', time);
    }

    checkPlanetResources()
    {
        let coords = this.ogl.current.coords.join(':');
        if(this.ogl.current.type == 'moon') coords += ':M';

        this.ogl.db.me.planets[coords] = this.ogl.db.me.planets[coords] || {};
        this.ogl.db.me.planets[coords].resources = this.ogl.db.me.planets[coords].resources || {};
        this.ogl.db.me.planets[coords].resources.metal = this.ogl.current.metal;
        this.ogl.db.me.planets[coords].resources.crystal = this.ogl.current.crystal;
        this.ogl.db.me.planets[coords].resources.deut = this.ogl.current.deut;
        this.ogl.db.me.planets[coords].resources.food = this.ogl.current.food;
        this.ogl.db.me.planets[coords].resources.population = this.ogl.current.population;

        // this.ogl.saveAsync();
    }

    checkMovement()
    {
        // remove deleted / relocated planets
        Object.keys(this.ogl.db.me.planets).forEach(k =>
        {
            if(!document.querySelector(`.smallplanet[data-coords="${k.replace(':M', '')}"]`))
            {
                delete this.ogl.db.me.planets[k];
            }
        });

        Object.entries(this.ogl.db.me.planets).forEach(planet =>
        {
            let coords = planet[0];

            this.myPlanets[coords] = this.myPlanets[coords] || {};
            this.myPlanets[coords].resources = this.ogl.db.me.planets[coords].resources || { metal:0, crystal:0, deut:0 };
            this.myPlanets[coords].resourcesFlight = this.myPlanets[coords].resourcesFlight || { metal:0, crystal:0, deut:0 };
            this.myPlanets[coords].ships = {};
            this.myPlanets[coords].shipsFlight = this.myPlanets[coords].shipsFlight || {};
            this.myPlanets[coords].opponentShips = this.myPlanets[coords].opponentShips || {};
            this.myPlanets[coords].missions = this.myPlanets[coords].missions || [];

            this.ogl.db.me.planets[coords] = this.ogl.db.me.planets[coords] || { techs:{} };
            Object.keys(this.ogl.db.ships).forEach(ship => this.myPlanets[coords].ships[ship] = this.ogl.db.me.planets[coords].techs?.[ship] || 0);
        });

        Util.getXML(`https://${window.location.host}/game/index.php?page=componentOnly&component=eventList&ajax=1`, result =>
        {
            let idList = [];
            let resourceKeys = ['metal', 'crystal', 'deut', 'food'];

            result.querySelectorAll('.eventFleet').forEach(line =>
            {
                let coords;
                let coordsNode, isMoon;
                let id = line.getAttribute('id').replace('eventRow-', '');
                let mission = line.getAttribute('data-mission-type');
                let back = line.getAttribute('data-return-flight') == 'false' ? false : true;
                let fromAnotherPlayer = document.querySelector(`.smallplanet[data-coords="${line.querySelector('.coordsOrigin').textContent.trim().slice(1,-1)}"]`) ? false : true;
                let toAnotherPlayer = document.querySelector(`.smallplanet[data-coords="${line.querySelector('.destCoords').textContent.trim().slice(1,-1)}"]`) ? false : true;

                if((mission == '1' || mission == '6') && fromAnotherPlayer) // ennemy attacks and spies
                {
                    coordsNode = line.querySelector('.destCoords');
                    isMoon = line.querySelector('.destFleet figure.moon');
                }
                else if((mission == '1' && back)    // attack
                || mission == '3'                   // transpo
                || mission == '4'                   // deploy
                || (mission == '7' && back)         // colo
                || (mission == '8' && back)         // harvest
                || (mission == '15' && back))       // expedition
                {
                    if(idList.indexOf(parseInt(id)) > -1) return;
                    if(mission == '3' && !back) idList.push(parseInt(id) + 1);

                    if(toAnotherPlayer || back)
                    {
                        coordsNode = line.querySelector('.coordsOrigin');
                        isMoon = line.querySelector('.originFleet figure.moon');
                    }
                    else
                    {
                        coordsNode = line.querySelector('.destCoords');
                        isMoon = line.querySelector('.destFleet figure.moon');
                    }
                }
                else return;

                coords = coordsNode.textContent.trim().slice(1,-1);
                if(isMoon) coords += ':M';

                this.myPlanets[coords] = this.myPlanets[coords] || {};
                this.myPlanets[coords].missions.push(mission);

                let tooltip = Util.createDom('div', {}, (line.querySelector('.icon_movement .tooltip') || line.querySelector('.icon_movement_reserve .tooltip')).getAttribute('title'));
                tooltip.querySelectorAll('.fleetinfo tr').forEach(subline =>
                {
                    if(subline.textContent.trim() == '') subline.classList.add('ogl_hidden');
                    else if(!subline.querySelector('td')) subline.classList.add('ogl_full');
                    else
                    {
                        let name = subline.querySelector('td').textContent.replace(':', '');
                        let shipID = (Object.entries(this.ogl.db.ships).find(e => e[1].name == name) || [false])[0];
                        let resourceName = resourceKeys.find(e => this.ogl.component.lang.getText(e) == name);

                        const sublineValue = Util.formatFromUnits(subline.querySelector('.value')?.textContent || 0);

                        if(shipID && shipID > -1 && sublineValue)
                        {
                            if((mission == '1' || mission == '6') && fromAnotherPlayer) this.myPlanets[coords].opponentShips[shipID] = (this.myPlanets[coords].opponentShips[shipID] || 0) + sublineValue;
                            else if(!toAnotherPlayer || back) this.myPlanets[coords].shipsFlight[shipID] = (this.myPlanets[coords].shipsFlight[shipID] || 0) + sublineValue;
                        }
                        else if(resourceName && (!toAnotherPlayer || back))
                        {
                            this.myPlanets[coords].resourcesFlight[resourceName] = (this.myPlanets[coords].resourcesFlight[resourceName] || 0) + sublineValue;
                        }
                    }
                });
            });

            // fleet movements
            Object.entries(this.myPlanets).forEach(entry =>
            {
                let content = Util.createDom('table', {'class':'ogl_inFlightTable'});
                Object.entries(entry[1].shipsFlight).forEach(ship =>
                {
                    let tr = content.appendChild(Util.createDom('tr'));
                    tr.appendChild(Util.createDom('td', {'class':`ogl_shipIcon ogl_${ship[0]}`}));
                    tr.appendChild(Util.createDom('td', {'class':'value'}, Util.formatToUnits(ship[1])));
                });

                content.appendChild(Util.createDom('tr', {'class':'ogl_full'}));

                Object.entries(entry[1].resourcesFlight).forEach(res =>
                {
                    let tr = content.appendChild(Util.createDom('tr', {'class':`ogl_${res[0]}`}));
                    tr.appendChild(Util.createDom('td', {'class':`ogl_shipIcon ogl_${res[0]}`}));
                    tr.appendChild(Util.createDom('td', {'class':`value`}, Util.formatToUnits(res[1] || '0')));
                });

                content.appendChild(Util.createDom('hr'));
                let missionsDiv = content.appendChild(Util.createDom('div', {'class':`ogl_missionList`}));

                [...new Set(entry[1].missions)].forEach(missionID =>
                {
                    let occurences = entry[1].missions.filter(x => x === missionID).length;
                    missionsDiv.appendChild(Util.createDom('div', {'data-mission-type':missionID, 'data-mission-occurence':`${occurences}`}));
                });

                let icon = document.querySelector(`.smallplanet[data-coords="${entry[0].replace(':M', '')}"]`).appendChild(Util.createDom('div', {'class':`ogl_missionType tooltipLeft ogl_inFlight ${entry[0].indexOf(':M') > 1 ? 'ogl_moonFleet' : 'ogl_planetFleet'}`, 'title':'loading'}));
                //if(Object.values(entry[1].resourcesFlight).reduce((previousValue, currentValue) => previousValue + currentValue) > 0) icon.classList.add('ogl_active');

                icon.setAttribute('data-mission-type', (entry[1].missions || [0])[0] || 0);

                if(document.querySelector(`.smallplanet[data-coords="${entry[0].replace(':M', '')}"] .alert`) && (entry[1].isAttacked || entry[1].isSpied))
                {
                    document.querySelector(`.smallplanet[data-coords="${entry[0].replace(':M', '')}"] .alert`).remove();
                }

                icon.addEventListener('mouseenter', () =>
                {
                    this.ogl.component.tooltip.update(icon, content)
                });
            });

            // resources summary
            document.querySelectorAll('.smallplanet').forEach(planet =>
            {
                let coords = planet.querySelector('.planet-koords').textContent.slice(1, -1);

                resourceKeys.forEach((resourceKey, index) =>
                {
                    this.total[index] += this.ogl.db.me.planets[coords]?.resources[resourceKey] || 0;
                    this.total[index] += this.ogl.db.me.planets[coords+':M']?.resources[resourceKey] || 0;
                    this.total[index] += this.myPlanets[coords]?.resourcesFlight[resourceKey] || 0;
                    this.total[index] += this.myPlanets[coords+':M']?.resourcesFlight[resourceKey] || 0;

                    this.onPlanet[index] += this.ogl.db.me.planets[coords]?.resources[resourceKey] || 0;
                    this.onPlanet[index] += this.ogl.db.me.planets[coords+':M']?.resources[resourceKey] || 0;

                    this.prod[index] += parseFloat(this.ogl.db.me.planets[coords]?.production?.[index]) || 0;

                    this.flightResources[index] += this.myPlanets[coords]?.resourcesFlight[resourceKey] || 0;
                    this.flightResources[index] += this.myPlanets[coords+':M']?.resourcesFlight[resourceKey] || 0;

                    Object.values(this.ogl.db.lock?.[coords] || {}).forEach(lock =>
                    {
                        this.locked[index] += parseFloat(lock?.[resourceKey]) || 0;
                    });
                });
            });

            this.ogl.account.totalProd = this.prod;

            let displayIndex = 0;

            this.resourceSum.addEventListener('click', () =>
            {
                displayIndex = displayIndex == 3 ?  0 : displayIndex + 1;
                this.resourceSum.classList.add('ogl_active');
                selectDisplay();
            });

            let selectDisplay = () =>
            {
                let target, icon;

                if(displayIndex == 0)
                {
                    icon = 'functions';
                    target = this.total;
                }
                else if(displayIndex == 1)
                {
                    icon = 'send';
                    target = this.flightResources;
                }
                else if(displayIndex == 2)
                {
                    icon = 'public';
                    target = this.onPlanet;
                }
                else if(displayIndex == 3)
                {
                    icon = 'lock';
                    target = this.locked;
                }

                this.resourceSum.textContent = '';
                this.resourceSum.appendChild(Util.createDom('i', {'class':'material-icons'}, icon));
                this.resourceSum.appendChild(Util.createDom('div', {'class':'ogl_metal'}, Util.formatToUnits(target[0]) || '0'));
                this.resourceSum.appendChild(Util.createDom('div', {'class':'ogl_sub ogl_metal'}, '+'+Util.formatToUnits(Math.round(this.prod[0]*24*3600), 0) || '+0'));
                this.resourceSum.appendChild(Util.createDom('div', {'class':'ogl_crystal'}, Util.formatToUnits(target[1]) || '0'));
                this.resourceSum.appendChild(Util.createDom('div', {'class':'ogl_sub ogl_crystal'}, '+'+Util.formatToUnits(Math.round(this.prod[1]*24*3600), 0) || '+0'));
                this.resourceSum.appendChild(Util.createDom('div', {'class':'ogl_deut'}, Util.formatToUnits(target[2]) || '0'));
                this.resourceSum.appendChild(Util.createDom('div', {'class':'ogl_sub ogl_deut'}, '+'+Util.formatToUnits(Math.round(this.prod[2]*24*3600), 0) || '+0'));

                setTimeout(() => this.resourceSum.classList.remove('ogl_active'), 50);
            }

            selectDisplay();
        });

        /*
        Util.getXML(`https://${window.location.host}/game/index.php?page=componentOnly&component=eventList&ajax=1`, result =>
        {
            let idList = [];
            let resName = ['metal', 'crystal', 'deut'];

            result.querySelectorAll('.eventFleet').forEach((line, index) =>
            {
                let id = line.getAttribute('id').replace('eventRow-', '');
                let mission = line.getAttribute('data-mission-type');
                let back = line.getAttribute('data-return-flight') == 'false' ? false : true;

                if((mission == '1' || mission == '6') && !back) // ennemy attacks and spies
                {
                    let target = line.querySelector('.destCoords').textContent.trim().slice(1,-1);
                    if(document.querySelector(`.smallplanet[data-coords="${target}"]`))
                    {
                        if(line.querySelector('.destFleet figure.moon')) target += ':M';

                        this.myPlanets[target] = this.myPlanets[target] || {};
                        this.myPlanets[target].resFlight = this.myPlanets[target].resFlight || [0,0,0];
                        this.myPlanets[target].ships = this.myPlanets[target].ships || {};

                        console.log(this.myPlanets[target].nextFleetEventType)
                        if(!this.myPlanets[target].nextFleetEventType) this.myPlanets[target].nextFleetEventType = mission;

                        if(mission == '1') this.myPlanets[target].isAttacked = true;
                        else if(mission == '6') this.myPlanets[target].isSpied = true;

                        let tempElem = Util.createDom('div', {}, (line.querySelector('.icon_movement .tooltip') || line.querySelector('.icon_movement_reserve .tooltip')).getAttribute('title'));
                        tempElem.querySelectorAll('.fleetinfo tr').forEach(subline =>
                        {
                            if(subline.textContent.trim() == '') subline.classList.add('ogl_hidden');
                            else if(!subline.querySelector('td')) subline.classList.add('ogl_full');
                            else
                            {
                                let name = subline.querySelector('td').textContent.replace(':', '');
                                let id = (Object.entries(this.ogl.db.ships).find(e => e[1].name == name) || [false])[0];
                                if(id && id > -1 && subline.querySelector('.value'))
                                {
                                    this.myPlanets[target].ships[id] = (this.myPlanets[target].ships[id] || 0) + Util.formatFromUnits(subline.querySelector('.value').textContent);
                                }
                            }
                        });
                    }
                }

                if((mission == '1' && back)     // attack
                || mission == '3'               // transpo
                || mission == '4'               // deploy
                || (mission == '7' && back)     // colo
                || (mission == '8' && back)     // harvest
                || (mission == '15' && back))   // expedition
                {
                    let target;
                    if(idList.indexOf(parseInt(id)) > -1) return;
                    if(mission == '3' && !back) idList.push(parseInt(id) + 1);

                    if(!back) target = line.querySelector('.destCoords').textContent.trim().slice(1,-1);
                    else target = line.querySelector('.coordsOrigin').textContent.trim().slice(1,-1);

                    if(document.querySelector(`.smallplanet[data-coords="${target}"]`))
                    {
                        if((!back && line.querySelector('.destFleet figure.moon')) || (back && line.querySelector('.originFleet figure.moon')))
                        {
                            target += ':M';
                        }

                        this.myPlanets[target] = this.myPlanets[target] || {};
                        this.myPlanets[target].resFlight = this.myPlanets[target].resFlight || [0,0,0];
                        this.myPlanets[target].ships = this.myPlanets[target].ships || {};
                        this.myPlanets[target].missionList = this.myPlanets[target].missionList || [];

                        if(!this.myPlanets[target].nextFleetEventType) this.myPlanets[target].nextFleetEventType = mission;
                        this.myPlanets[target].missionList.push(mission);

                        let tempElem = Util.createDom('div', {}, (line.querySelector('.icon_movement .tooltip') || line.querySelector('.icon_movement_reserve .tooltip')).getAttribute('title'));
                        if(tempElem.querySelectorAll('th').length > 1)
                        {
                            let trLen = tempElem.querySelectorAll('tr').length;

                            for(let i=0; i<3; i++)
                            {
                                let res = parseInt(tempElem.querySelectorAll('tr')[trLen-3+i].querySelector('.value').textContent.replace(/\./g,''));
                                this.myPlanets[target].resFlight[i] += res;
                                this.ogl.account.totalResources[i] += parseInt(res);
                                this.total[i] += res;
                            }
                        }

                        tempElem.querySelectorAll('.fleetinfo tr').forEach(subline =>
                        {
                            if(subline.textContent.trim() == '') subline.classList.add('ogl_hidden');
                            else if(!subline.querySelector('td')) subline.classList.add('ogl_full');
                            else
                            {
                                let name = subline.querySelector('td').textContent.replace(':', '');
                                let id = (Object.entries(this.ogl.db.ships).find(e => e[1].name == name) || [false])[0];
                                if(id && id > -1 && subline.querySelector('.value'))
                                {
                                    this.myPlanets[target].ships[id] = (this.myPlanets[target].ships[id] || 0) + Util.formatFromUnits(subline.querySelector('.value').textContent);
                                }
                            }
                        });
                    }
                }
            });

            Object.entries(this.myPlanets).forEach(entry =>
            {
                let content = Util.createDom('table', {'class':'ogl_inFlightTable'});
                Object.entries(entry[1].ships).forEach(ship =>
                {
                    let tr = content.appendChild(Util.createDom('tr'));
                    tr.appendChild(Util.createDom('td', {'class':`ogl_shipIcon ogl_${ship[0]}`}));
                    tr.appendChild(Util.createDom('td', {'class':'value'}, Util.formatToUnits(ship[1])));
                });

                content.appendChild(Util.createDom('tr', {'class':'ogl_full'}));

                Object.entries(entry[1].resFlight).forEach(res =>
                {
                    let tr = content.appendChild(Util.createDom('tr', {'class':`ogl_${resName[res[0]]}`}));
                    tr.appendChild(Util.createDom('td', {'class':`ogl_shipIcon ogl_${resName[res[0]]}`}));
                    tr.appendChild(Util.createDom('td', {'class':`value`}, Util.formatToUnits(res[1] || '0')));
                });

                content.appendChild(Util.createDom('hr'));
                let missionsDiv = content.appendChild(Util.createDom('div', {'class':`ogl_missionList`}));

                //entry[1].missionList.forEach(missionID =>
                [...new Set(entry[1].missionList)].forEach(missionID =>
                {
                    let occurences = entry[1].missionList.filter(x => x === missionID).length;
                    missionsDiv.appendChild(Util.createDom('div', {'data-mission-type':missionID, 'data-mission-occurence':`${occurences}`}, ));
                });

                // let link = entry[0].indexOf(':M') > -1 ? 'moonlink' : 'planetlink';

                let icon = document.querySelector(`.smallplanet[data-coords="${entry[0].replace(':M', '')}"]`).appendChild(Util.createDom('div', {'class':`ogl_missionType tooltipLeft ogl_inFlight ${entry[0].indexOf(':M') > 1 ? 'ogl_moonFleet' : 'ogl_planetFleet'}`, 'title':'loading...'}));
                if(entry[1].resFlight.reduce((previousValue, currentValue) => previousValue + currentValue) > 0) icon.classList.add('ogl_active');

                if(entry[1].isAttacked) icon.classList.add('ogl_danger');
                else if(entry[1].isSpied) icon.classList.add('ogl_warning');

                icon.setAttribute('data-mission-type', entry[1].nextFleetEventType);

                if(document.querySelector(`.smallplanet[data-coords="${entry[0].replace(':M', '')}"] .alert`) && (entry[1].isAttacked || entry[1].isSpied))
                {
                    document.querySelector(`.smallplanet[data-coords="${entry[0].replace(':M', '')}"] .alert`).remove();
                }

                icon.addEventListener('mouseenter', () =>
                {
                    this.ogl.component.tooltip.update(icon, content)
                });
            });

            document.querySelectorAll('.smallplanet').forEach(planet =>
            {
                let resName = ['metal', 'crystal', 'deut'];
                let coords = planet.querySelector('.planet-koords').textContent.slice(1, -1);

                for(let i=0; i<3; i++)
                {
                    this.total[i] += parseInt(planet.querySelector(`.ogl_stock .ogl_${resName[i]}`).getAttribute('data-value')) || 0;
                    this.total[i] += this.ogl.db.me.planets[coords+':M']?.resources[resName[i]] || 0;

                    this.onPlanet[i] += parseInt(planet.querySelector(`.ogl_stock .ogl_${resName[i]}`).getAttribute('data-value')) || 0;
                    this.onPlanet[i] += this.ogl.db.me.planets[coords+':M']?.resources[resName[i]] || 0;

                    this.prod[i] += parseFloat(this.ogl.db.me.planets[coords]?.production?.[i]) || 0;

                    Object.values(this.ogl.db.lock?.[coords] || {}).forEach(lock =>
                    {
                        this.locked[i] += parseFloat(lock?.[resName?.[i]]) || 0;
                    });
                }
            });

            this.ogl.account.totalProd = this.prod;

            let displayIndex = 0;

            this.resourceSum.addEventListener('click', () =>
            {
                displayIndex = displayIndex == 3 ?  0 : displayIndex + 1;
                this.resourceSum.classList.add('ogl_active');
                selectDisplay();
            });

            let selectDisplay = index =>
            {
                let target, icon;

                if(displayIndex == 0)
                {
                    icon = 'functions';
                    target = this.total;
                }
                else if(displayIndex == 1)
                {
                    icon = 'send';
                    target = this.ogl.account.totalResources;
                }
                else if(displayIndex == 2)
                {
                    icon = 'public';
                    target = this.onPlanet;
                }
                else if(displayIndex == 3)
                {
                    icon = 'lock';
                    target = this.locked;
                }

                this.resourceSum.textContent = '';
                this.resourceSum.appendChild(Util.createDom('i', {'class':'material-icons'}, icon));
                this.resourceSum.appendChild(Util.createDom('div', {'class':'ogl_metal'}, Util.formatToUnits(target[0]) || '0'));
                this.resourceSum.appendChild(Util.createDom('div', {'class':'ogl_sub ogl_metal'}, '+'+Util.formatToUnits(Math.round(this.prod[0]*24*3600), 0) || '+0'));
                this.resourceSum.appendChild(Util.createDom('div', {'class':'ogl_crystal'}, Util.formatToUnits(target[1]) || '0'));
                this.resourceSum.appendChild(Util.createDom('div', {'class':'ogl_sub ogl_crystal'}, '+'+Util.formatToUnits(Math.round(this.prod[1]*24*3600), 0) || '+0'));
                this.resourceSum.appendChild(Util.createDom('div', {'class':'ogl_deut'}, Util.formatToUnits(target[2]) || '0'));
                this.resourceSum.appendChild(Util.createDom('div', {'class':'ogl_sub ogl_deut'}, '+'+Util.formatToUnits(Math.round(this.prod[2]*24*3600), 0) || '+0'));

                setTimeout(() => this.resourceSum.classList.remove('ogl_active'), 50);
            }

            selectDisplay();

            // todo
            //console.log(this.ogl.db.me.planets) // res on planet
            //console.log(this.flightResources) // res in flight
            //console.log(this.total) // res total
        });*/
    }

    addStats(startDate, endDate)
    {
        if(this.ogl.db.options.togglesOff.indexOf('renta') > -1) return;

        if(this.ogl.db.stats.NaN) delete this.ogl.db.stats.NaN;

        document.querySelector('.ogl_stats')?.remove();

        let entry = Object.keys(this.ogl.db.stats).sort()[0];
        if(!isNaN(entry)) this.ogl.db.stats.firstEntry = entry;

        for (const [key, value] of Object.entries(this.ogl.db.stats))
        {
            if(Date.now() - key > 31 * 24 * 60 * 60 * 1000)
            {
                delete this.ogl.db.stats[key];
            }
        }

        // this.ogl.saveAsync();

        startDate = startDate || Date.now() - this.ogl.db.options.dateFilter * 24 * 60 * 60 * 1000;
        endDate = endDate  || Date.now();

        let days = Math.round((endDate - startDate) / 24 / 60 / 60 / 1000);
        let rangeDate = days;

        this.dailiesStats = [];
        let raidOccurences = 0;
        let expeOccurences = 0;

        if(startDate >= 0)
        {
            for(let i=0; i<days; i++)
            {
                let date = new Date(endDate - i * 24 * 60 * 60 * 1000);
                let midnight = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0).getTime();
                this.dailiesStats.push(this.ogl.db.stats[midnight] || false);

                // fix
                if(this.ogl.db.stats?.[midnight]?.raidOccuences)
                {
                    this.ogl.db.stats[midnight].raidOccurences = (this.ogl.db.stats[midnight].raidOccurences || 0) + this.ogl.db.stats.total.raidOccuences;
                    delete this.ogl.db.stats[midnight].raidOccuences;
                }

                raidOccurences += this.ogl.db.stats?.[midnight]?.raidOccurences || 0;
                expeOccurences += this.ogl.db.stats?.[midnight]?.expeOccurences && Object.values(this.ogl.db.stats?.[midnight]?.expeOccurences).length ? Object.values(this.ogl.db.stats?.[midnight]?.expeOccurences).reduce((a, b) => a + b) : 0;
            }
        }
        else
        {
            // fix
            if(this.ogl.db.stats?.total?.raidOccuences)
            {
                this.ogl.db.stats.total.raidOccurences = (this.ogl.db.stats.total.raidOccurences || 0) + this.ogl.db.stats.total.raidOccuences;
                delete this.ogl.db.stats.total.raidOccuences;
            }

            this.dailiesStats.push(this.ogl.db.stats.total || false);
            raidOccurences += this.ogl.db.stats?.total?.raidOccurences || 0;
            expeOccurences += this.ogl.db.stats?.total?.expeOccurences && Object.values(this.ogl.db.stats?.total?.expeOccurences).length ? Object.values(this.ogl.db.stats?.total?.expeOccurences).reduce((a, b) => a + b) : 0;

            let now = new Date();
            let midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime();
            rangeDate = (midnight - this.ogl.db.stats.firstEntry) / (24 * 60 * 60 * 1000) || (Math.ceil((Date.now() - Object.keys(this.ogl.db.stats).sort()[0]) / 24 / 60 / 60 / 1000) + 1) || 1;
        }



        let cumul = { metal:0, crystal:0, deut:0, dm:0 };
        let cumulExpe = { metal:0, crystal:0, deut:0, dm:0 };
        let cumulRaid = { metal:0, crystal:0, deut:0, dm:0 };
        let cumulConso = 0;
        let cumulExpeOccurences = {};
        let emptyData = true;

        Object.values(this.dailiesStats).forEach(daily =>
        {
            if(!daily || (!daily.raid && !daily.expe)) return;

            if(emptyData) emptyData = false;

            ['metal','crystal','deut','dm',202,203,204,205,206,207,208,209,210,211,213,214,215,218,219].forEach(id =>
            {
                cumul[id] = parseInt(cumul[id]) || 0;
                if(isNaN(id)) cumulRaid[id] = parseInt(cumulRaid[id]) || 0;
                cumulExpe[id] = parseInt(cumulExpe[id]) || 0;

                let dayRaidValue = parseInt(daily?.raid?.[id]) || 0;
                let dayExpeValue = parseInt(daily?.expe?.[id]) || 0;

                // raids
                if(dayRaidValue && isNaN(id))
                {
                    cumul[id] = cumul[id] + dayRaidValue;
                    cumulRaid[id] = cumulRaid[id] + dayRaidValue;
                }

                // expeditions
                if(dayExpeValue)
                {
                    cumul[id] = cumul[id] + dayExpeValue;
                    cumulExpe[id] = cumulExpe[id] + dayExpeValue;

                    if(!isNaN(id) && this.ogl.db.options.togglesOff.indexOf('ignoreExpeShips') > -1)
                    {
                        let shipData = Datafinder.getTech(id);

                        cumul.metal = (cumul.metal || 0) + (shipData.metal || 0) * dayExpeValue;
                        cumul.crystal = (cumul.crystal || 0) + (shipData.crystal || 0) * dayExpeValue;
                        cumul.deut = (cumul.deut || 0) + (shipData.deut || 0) * dayExpeValue;

                        cumulExpe.metal = (cumulExpe.metal || 0) + (shipData.metal || 0) * dayExpeValue;
                        cumulExpe.crystal = (cumulExpe.crystal || 0) + (shipData.crystal || 0) * dayExpeValue;
                        cumulExpe.deut = (cumulExpe.deut || 0) + (shipData.deut || 0) * dayExpeValue;
                    }
                }
            });

            cumulConso += daily.consumption || 0;

            if(daily.expeOccurences)
            {
                for(let k of Object.keys(daily.expeOccurences))
                {
                    cumulExpeOccurences[k] = (cumulExpeOccurences[k] || 0) + (daily?.expeOccurences?.[k] || 0);
                }
            }
        });

        if(this.ogl.db.options.togglesOff.indexOf('ignoreConsumption') == -1) cumulConso = 0;

        let dom = document.querySelector('#links').appendChild(Util.createDom('div', {'class':'ogl_stats'}));
        ['metal', 'crystal', 'deut', 'dm'].forEach(res =>
        {
            let line = dom.appendChild(Util.createDom('div'));
            line.appendChild(Util.createDom('div', {'class':`ogl_shipIcon ogl_${res}`}));
            line.appendChild(Util.createDom('div', {'class':`number ogl_${res}`}, Util.formatToUnits((res == 'deut' ? cumul[res]+cumulConso : cumul[res]) || '0')));
        });

        dom.appendChild(Util.createDom('div', {'class':'ogl_labelLimit'}, Math.floor(rangeDate) + LocalizationStrings.timeunits.short.day));

        let more = dom.appendChild(Util.createDom('button', {'class':'ogl_button material-icons tooltip ogl_moreStats', 'title':this.ogl.component.lang.getText('moreStats')}, 'open_in_full'));
        more.addEventListener('click', () =>
        {
            this.ogl.component.popup.load();

            let container = Util.createDom('div', {'class':'ogl_statsDetails'});
            let dateArea = container.appendChild(Util.createDom('div', {'class':'ogl_dateArea'}));
            let mainArea = container.appendChild(Util.createDom('div', {'class':'ogl_mainArea'}));

            let today = new Date();
            today.setHours(0,0,0,0);

            let currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            let currentDay = today.getDate();
            let prevMonthLength = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0).getDate();
            let monthLength = new Date(currentMonth.getFullYear(), currentMonth.getMonth()+1, 0).getDate();

            let filterDiv = dateArea.appendChild(Util.createDom('div'));
            [1, 7, 14, 30, 40000].forEach(filter =>
            {
                let button = filterDiv.appendChild(Util.createDom('div', {'class':''}, filter.toString().replace(/^1$/, 'today').replace(/^7$/, '7d').replace(/^14$/, '14d').replace(/^30$/, '30d').replace('40000', 'all')));
                if(this.ogl.db.options.dateFilter == filter) button.classList.add('ogl_active');
                button.addEventListener('click', () =>
                {
                    this.ogl.db.options.dateFilter = filter;
                    this.addStats(Date.now() - filter * 24 * 60 * 60 * 1000, Date.now());
                    document.querySelector('.ogl_stats .ogl_moreStats').click();
                    // this.ogl.saveAsync();
                });
            });

            // 1 - 31 days grid
            let dayDiv = dateArea.appendChild(Util.createDom('div'));
            for(let i=currentDay; i>currentDay-31; i--)
            {
                let totalSum = 0;
                let timestamp = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i, 0, 0, 0).getTime();
                let dateDiff = today.getDate() - i;
                let btn = Util.createDom('div', {'class':'ogl_button'}, i > 0 ? i : prevMonthLength+i);
                dayDiv.prepend(btn);

                if(timestamp === today.getTime()) btn.classList.add('ogl_today');
                if(timestamp >= startDate && timestamp < endDate) btn.classList.add('ogl_active');

                if(this.ogl.db.stats[timestamp])
                {
                    let raidSum, expeSum = 0;

                    if(this.ogl.db.stats[timestamp].raid) raidSum = Object.values(this.ogl.db.stats[timestamp].raid).reduce((sum, a) => sum + a, 0);
                    if(this.ogl.db.stats[timestamp].expe) expeSum = Object.values(this.ogl.db.stats[timestamp].expe).reduce((sum, a) => sum + a, 0);

                    totalSum = raidSum + expeSum;
                }

                if(totalSum == 0) btn.classList.add('ogl_disabled');

                btn.addEventListener('click', () =>
                {
                    this.addStats(Date.now() - (dateDiff + 1) * 24 * 60 * 60 * 1000, Date.now() - (dateDiff) * 24 * 60 * 60 * 1000);
                    document.querySelector('.ogl_stats .ogl_moreStats').click();
                });
            }

            let calendarIcon = Util.createDom('i', {'class':'material-icons ogl_calendarIcon'}, 'date_range');
            dayDiv.prepend(calendarIcon);

            //if(this.daysOpen) dayDiv.classList.remove('ogl_hidden');

            /*let plusBtn = filterDiv.appendChild(Util.createDom('div', {'class':'ogl_button'}, '+'));
            plusBtn.addEventListener('click', () =>
            {
                dayDiv.classList.toggle('ogl_hidden');
                this.daysOpen = !dayDiv.classList.contains('ogl_hidden');
            });*/

            let tables = mainArea.appendChild(Util.createDom('div', {'class':'ogl_statsTables'}));
            let recap = mainArea.appendChild(Util.createDom('div', {'class':'ogl_statsRecap tooltip', 'title':Util.formatToUnits(cumul.metal + cumul.crystal + cumul.deut)}));
            recap.appendChild(Util.createDom('div', {}, 'Total'));
            this.mainResources.forEach(res =>
            {
                let div = recap.appendChild(Util.createDom('div', {'class':`ogl_${res}`}, Util.formatToUnits(cumul[res] || '0')));
                if(res == 'deut' && cumulConso) div.appendChild(Util.createDom('div', {'class':`ogl_${res}`}, Util.formatToUnits(cumulConso)));
            });

            let firstCol = tables.appendChild(Util.createDom('span', {'class':'ogl_statsColumn'}));

            let chartArea = firstCol.appendChild(Util.createDom('span', {'class':'ogl_chartArea', 'data-html2canvas-ignore':true}));
            let chart = chartArea.appendChild(Util.createDom('span', {'class':'ogl_pie'}));
            let labels = chartArea.appendChild(Util.createDom('span', {'class':'ogl_pieLabel'}))
            let dataSum = Object.values(cumulExpeOccurences).reduce((a,b) => b>0 ? a+b : a+0, 0);
            let pieStats = Object.entries(cumulExpeOccurences).sort((a, b) => a[0].localeCompare(b[0])).map(x => (1 / (dataSum / x[1]) * 100));
            let gradient = '';
            let sum = 0;
            let colors = ['#e64a19', '#19bd9b', '#f9a825', '#64648b', '#c52b51', '#05abc3', '#c5ced3'];

            pieStats.forEach((v, index) =>
            {
                gradient += `${colors[index]} ${Math.max(sum, 0)||0}%, ${colors[index]} ${Math.max(sum + v, 0)||0}%, `;
                sum += v;

                if(index == pieStats.length-1 && (isNaN(sum) || sum < 0)) gradient = '';
            });

            chart.style.background = `conic-gradient(${gradient}#000)`;

            Object.entries(cumulExpeOccurences).sort((a, b) => a[0].localeCompare(b[0])).forEach((e, index) =>
            {
                if(e[0] == 'none') e[0] = 'other';

                let label = labels.appendChild(Util.createDom('span', {}, `<span>${this.ogl.component.lang.getText(e[0])}</span><span>${Util.formatToUnits(Math.max(0, e[1]))}</span><b>${Math.max(0, pieStats[index].toFixed(2)) || 0}%</b>`));
                label.prepend(Util.createDom('span', {'style':'background:'+colors[index]}));
            });

            let shipsArea = firstCol.appendChild(Util.createDom('span', {'class':'ogl_shipsArea', 'data-html2canvas-ignore':true}));
            let expeArea = firstCol.appendChild(Util.createDom('div'));

            for (const [key, value] of Object.entries(cumulExpe))
            {
                if(!this.mainResources.includes(key))
                {
                    let entry = shipsArea.appendChild(Util.createDom('div', {'class':'ogl_statsItem'}, `<div class="ogl_shipIcon ogl_${key}"></div><div class="ogl_${key}">${Util.formatToUnits(value)}</div>`));
                    if(value < 0) entry.classList.add('ogl_danger');
                }
            }

            let withWithout = this.ogl.db.options.togglesOff.indexOf('ignoreExpeShips') == -1 ? 'w/o' : 'w/';
            expeArea.appendChild(Util.createDom('h3', {}, `Expe (<u class="tooltip" title="ø ${Util.formatToUnits(Math.round((cumulExpe.metal + cumulExpe.crystal + cumulExpe.deut) / expeOccurences))} | Σ ${Util.formatToUnits(Math.round(cumulExpe.metal + cumulExpe.crystal + cumulExpe.deut))}">${Util.formatNumber(expeOccurences)}</u>) ${withWithout} ships`));
            for (const [key, value] of Object.entries(cumulExpe))
            {
                if(this.mainResources.includes(key))
                {
                    let entry = expeArea.appendChild(Util.createDom('div', {'class':'ogl_statsItem'}, `<div class="ogl_shipIcon ogl_${key}"></div><div class="ogl_${key}">${Util.formatToUnits(value)}</div>`));
                    if(value < 0) entry.classList.add('ogl_danger');
                }
            }

            let raidArea = firstCol.appendChild(Util.createDom('div'));
            raidArea.appendChild(Util.createDom('h3', {}, `Raid (<u class="tooltip" title="ø ${Util.formatToUnits(Math.round((cumulRaid.metal + cumulRaid.crystal + cumulRaid.deut) / raidOccurences))} | Σ ${Util.formatToUnits(Math.round(cumulRaid.metal + cumulRaid.crystal + cumulRaid.deut))}">${Util.formatNumber(raidOccurences)}</u>)`));
            for (const [key, value] of Object.entries(cumulRaid))
            {
                raidArea.appendChild(Util.createDom('div', {'class':'ogl_statsItem'}, `<div class="ogl_shipIcon ogl_${key}"></div><div class="ogl_${key}">${Util.formatToUnits(value)}</div>`));
            }

            raidArea.appendChild(Util.createDom('h3', {}, 'ø / day'));
            for (const [key, value] of Object.entries(cumul))
            {
                if(this.mainResources.includes(key)) raidArea.appendChild(Util.createDom('div', {'class':'ogl_statsItem'}, `<div class="ogl_shipIcon ogl_${key}"></div><div class="ogl_${key}">${Util.formatToUnits(Math.round(value/rangeDate))}</div>`));
            }

            raidArea.appendChild(Util.createDom('h3', {}, 'ø + prod  / day'));
            for (const [key, value] of Object.entries(cumul))
            {
                if(this.mainResources.includes(key))
                {
                    let resIndex =  key == 'metal' ? '0' : key == 'crystal' ? '1' : '2';
                    let totalRes = parseInt(this.ogl.account.totalProd[resIndex]);

                    if(key == 'dm') raidArea.appendChild(Util.createDom('div', {'class':'ogl_statsItem'}, `<div class="ogl_shipIcon ogl_${key}"></div><div class="ogl_${key}">${Util.formatToUnits(Math.round(value/rangeDate))}</div>`));
                    else if(isNaN(key)) raidArea.appendChild(Util.createDom('div', {'class':'ogl_statsItem'}, `<div class="ogl_shipIcon ogl_${key}"></div><div class="ogl_${key}">${Util.formatToUnits(Math.round(parseFloat(value)/rangeDate) + totalRes*24*3600)}</div>`));
                }
            }

            if(!sum || emptyData)
            {
                chartArea.classList.add('ogl_hidden');
                shipsArea.classList.add('ogl_hidden');
                expeArea.classList.add('ogl_hidden');

                if(emptyData) raidArea.classList.add('ogl_hidden');
            }

            let shareButton = Util.createDom('div', {'class':'ogl_button'}, '<i class="material-icons">file_download</i>Download (.jpg)');
            shareButton.addEventListener('click', () =>
            {
                shareButton.textContent = 'loading...';
                shareButton.classList.add('ogl_disabled');

                container.querySelectorAll('[data-html2canvas-ignore]').forEach(e => e.style.display = 'none');
                container.querySelectorAll('.ogl_shipIcon').forEach(e => e.style.visibility = 'hidden');

                Util.takeScreenshot(container, shareButton, `ogl_${this.ogl.universe.name}_${this.ogl.universe.lang}_stats_${serverTime.getTime()}`);
            });

            this.ogl.component.popup.open(container, () =>
            {
                this.ogl.component.popup.content.appendChild(shareButton);
            });
        });

        let blackholeButton = dom.appendChild(Util.createDom('button', {'class':'ogl_button material-icons tooltip', 'title':this.ogl.component.lang.getText('signalBlackhole')}, 'sentiment_very_dissatisfied'));
        blackholeButton.addEventListener('click', () =>
        {
            this.ogl.component.popup.load();

            let date = new Date();
            let midnight = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0).getTime();

            let container = Util.createDom('div', {'class':'ogl_blackHole'});
            [202,203,204,205,206,207,208,209,210,211,213,214,215,218,219].forEach(shipID =>
            {
                let content = container.appendChild(Util.createDom('div'));
                content.appendChild(Util.createDom('div', {'class':'ogl_shipIcon ogl_'+shipID}));
                content.appendChild(Util.createDom('input', {'type':'text', 'class':'ogl_checkInput', 'data-ship':shipID}));
            });

            let confirmButton = Util.createDom('div', {'class':'ogl_button'}, 'OK');
            confirmButton.addEventListener('click', () =>
            {
                if(confirm('Do you really want to add this black hole ?'))
                {
                    let result = {};
                    container.querySelectorAll('input').forEach(input =>
                    {
                        let shipID = parseInt(input.getAttribute('data-ship'));
                        let amount = parseInt(input.value.replace(/[\,\. ]/g, ''));
                        if(!isNaN(shipID) && !isNaN(amount)) result[shipID] = amount;
                    });

                    this.ogl.db.stats[midnight] = this.ogl.db.stats[midnight] = this.ogl.db.stats[midnight] || { idList:[], expe:{}, raid:{}, expeOccurences:{}, raidOccurences:0, consumption:0 };
                    this.ogl.db.stats[midnight].expe = this.ogl.db.stats[midnight].expe || {};
                    this.ogl.db.stats.total.expe = this.ogl.db.stats.total.expe || {};
                    this.ogl.db.stats[midnight].expeOccurences = this.ogl.db.stats[midnight].expeOccurences || {};
                    this.ogl.db.stats.total.expeOccurences = this.ogl.db.stats.total.expeOccurences || {};

                    for(let [k,v] of Object.entries(result))
                    {
                        this.ogl.db.stats[midnight].expe[k] = (this.ogl.db.stats[midnight].expe?.[k] || 0) - v;
                        this.ogl.db.stats.total.expe[k] = (this.ogl.db.stats.total.expe?.[k] || 0) - v;
                    }

                    this.ogl.db.stats[midnight].expeOccurences.blackhole = (this.ogl.db.stats[midnight].expeOccurences?.blackhole || 0) + 1;
                    this.ogl.db.stats.total.expeOccurences.blackhole = (this.ogl.db.stats.total.expeOccurences?.blackhole || 0) + 1;

                    this.addStats();
                    this.ogl.component.popup.close();
                }
            });

            this.ogl.component.popup.open(container, () =>
            {
                this.ogl.component.popup.content.appendChild(confirmButton);
            });
        });
    /*
        let resetButton = dom.appendChild(Util.createDom('button', {'class':'ogl_button material-icons tooltip', 'title':this.ogl.component.lang.getText('eraseData')}, 'delete_forever'));
        resetButton.addEventListener('click', () =>
        {
            if(confirm('Do you want to erase stats data ?'))
            {
                delete this.ogl.db.stats;
                this.ogl.save();
                document.location.reload();
            }
        });
    */
    }

    addCalendar(startDate, endDate)
    {
        let domElement = Util.createDom('div', {'class':'ogl_calendar'});

        // Liste des jours de la semaine
        let dayList = [];
        for(let i=0; i<7; i++)
        {
            dayList.push(new Date(24*60*60*1000*(4+i)).toLocaleString('en-EN', {weekday:'long'}));
        }

        // Date actuelle
        let today = new Date();
        today.setHours(0,0,0,0);

        // Mois actuel
        let currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // On créé le div qui contiendra les jours de notre calendrier
        let content = document.createElement('div');
        domElement.appendChild(content);

        // Création des cellules contenant le jour de la semaine
        for(let i=0; i<dayList.length; i++)
        {
            content.appendChild(Util.createDom('span', {'class':'cell day'}, dayList[i].substring(0, 3).toUpperCase()));
        }

        // Création des cellules vides si nécessaire
        for(let i=1; i<currentMonth.getDay(); i++)
        {
            content.appendChild(Util.createDom('div', {'class':'cell empty'}));
        }

        // Nombre de jour dans le mois affiché
        let monthLength = new Date(currentMonth.getFullYear(), currentMonth.getMonth()+1, 0).getDate();

        // Création des cellules contenant les jours du mois affiché
        for(let i=1; i<=monthLength; i++)
        {
            let cell = content.appendChild(Util.createDom('span', {'class':'cell'}, i));

            // Timestamp de la cellule
            let timestamp = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i, 0, 0, 0).getTime();

            // Ajoute une classe spéciale pour aujourd'hui
            if(timestamp === today.getTime()) cell.classList.add('ogl_today');
            else if (timestamp > today.getTime()) cell.classList.add('ogl_disabled');

            if(timestamp >= startDate && timestamp < endDate)
            {
                cell.classList.add('ogl_active');
            }

            if(timestamp - 24 * 60 * 60 * 1000 <= startDate && timestamp >= startDate && !content.querySelector('.ogl_firstDate')) cell.classList.add('ogl_firstDate');
            if(timestamp + 24 * 60 * 60 * 1000 >= endDate && !content.querySelector('.ogl_lastDate')) cell.classList.add('ogl_lastDate');

            let dateDiff = today.getDate() - i;
            let total = 0;

            if(this.ogl.db.stats[timestamp])
            {
                let raids = Object.keys(this.ogl.db.stats?.[timestamp]?.raid || {}).length ? Object.values(this.ogl.db.stats?.[timestamp]?.raid || {a:0}).reduce((a, b) => a + b) : 0;
                let expes = Object.keys(this.ogl.db.stats?.[timestamp]?.expe || {}).length ? Object.values(this.ogl.db.stats?.[timestamp]?.expe || {a:0}).reduce((a, b) => a + b) : 0;
                total = raids + expes;
            }

            if(total == 0) cell.classList.add('ogl_disabled');

            cell.addEventListener('click', () =>
            {
                this.addStats(Date.now() - (dateDiff + 1) * 24 * 60 * 60 * 1000, Date.now() - (dateDiff) * 24 * 60 * 60 * 1000);
                document.querySelector('.ogl_stats .ogl_moreStats').click();
            });
        }

        if(!content.querySelector('.ogl_firstDate') && content.querySelector('.cell.empty'))
        {
            content.querySelector('.cell.empty:last-of-type').classList.add('ogl_disabled');
            content.querySelector('.cell.empty:last-of-type').classList.add('ogl_beforeDate');
        }

        return domElement;
    }

    lockTech(tech)
    {
        let coords = this.ogl.current.coords.join(':');
        tech.onMoon = this.ogl.current.type == 'moon';

        this.ogl.db.lock = this.ogl.db.lock || {};
        this.ogl.db.lock[coords] = this.ogl.db.lock[coords] || {};
        this.ogl.db.lock[coords][`${tech.id}_${tech.level}_${this.ogl.current.type}`] = tech;
        // this.ogl.saveAsync();

        this.checkLockedTechs();
    }

    checkLockedTechs(refresh, noSub)
    {
        let coords = this.ogl.current.coords.join(':');
        let pageList = ['supplies', 'facilities', 'research', 'shipyard', 'defenses', 'lfbuildings', 'lfresearch'];

        if(pageList.indexOf(this.ogl.page) > -1 && this.ogl.db.lock?.[coords])
        {
            Object.keys(this.ogl.db.lock[coords]).forEach(key =>
            {
                if(this.ogl.db.lock[coords][key] && key.indexOf(this.ogl.current.type) > -1)
                {
                    if(this.ogl.db.lock[coords][key].level <= parseInt(document.querySelector(`[data-technology="${this.ogl.db.lock[coords][key].id}"] .targetlevel`)?.getAttribute('data-value') || document.querySelector(`[data-technology="${this.ogl.db.lock[coords][key].id}"] .level`)?.getAttribute('data-value') || 0))
                    {
                        delete(this.ogl.db.lock[coords][key]);
                    }
                }
            });
        }

        document.querySelectorAll('.smallplanet').forEach(planet =>
        {
            planet.querySelector('.ogl_lockedIcon') && planet.querySelector('.ogl_lockedIcon').remove();

            let coords = planet.querySelector('.planet-koords').textContent.slice(1, -1);

            if(this.ogl.db.lock?.[coords] && Object.entries(this.ogl.db.lock[coords]).length > 0)
            {
                let button = planet.appendChild(Util.createDom('div', {'class':'ogl_lockedIcon material-icons tooltipLeft'}, 'lock'));

                let tooltipCumul = [0,0,0];
                let isReady = false;

                for(let tech of Object.values(this.ogl.db.lock[coords]))
                {
                    tooltipCumul[0] += tech.metal;
                    tooltipCumul[1] += tech.crystal;
                    tooltipCumul[2] += tech.deut;

                    if(tech.metal == 0 && tech.crystal == 0 && tech.deut == 0) isReady = true;
                }

                if(isReady) button.classList.add('ogl_ok');

                button.title = 'Locked' + '<div class="splitLine"></div>';
                ['metal','crystal','deut'].forEach((res, index) =>
                {
                    let resName = this.ogl.component.lang.getText(res);
                    button.title += `<div>${resName}:&nbsp;<span class="ogl_${res} float_right">${Util.formatToUnits(tooltipCumul[index])}</span></div>`;
                });

                button.addEventListener('click', () =>
                {
                    this.ogl.component.popup.load();

                    if(!noSub)
                    {
                        this.availableResources = [(this.ogl.db.me?.planets?.[coords]?.resources?.metal || 0), (this.ogl.db.me?.planets?.[coords]?.resources?.crystal || 0), (this.ogl.db.me?.planets?.[coords]?.resources?.deut || 0)];
                    }

                    let container = Util.createDom('div', {'class':'ogl_lockPopup'});
                    let planetContainer = container.appendChild(Util.createDom('div', {'class':'ogl_lockedContainer'}));
                    let moonContainer = container.appendChild(Util.createDom('div', {'class':'ogl_lockedContainer'}));

                    let cumul = [0, 0, 0, 0, 0, 0];

                    for(let tech of Object.values(this.ogl.db.lock[coords]))
                    {
                        let targetContainer = tech.onMoon ? moonContainer : planetContainer;
                        targetContainer.appendChild(Util.createDom('span', {}, tech.name));
                        targetContainer.appendChild(Util.createDom('i', {}, tech.amount > 1 ? tech.amount : tech.level));
                        targetContainer.appendChild(Util.createDom('b', {'class':'ogl_metal'}, Util.formatToUnits(tech.metal)));
                        targetContainer.appendChild(Util.createDom('b', {'class':'ogl_crystal'}, Util.formatToUnits(tech.crystal)));
                        targetContainer.appendChild(Util.createDom('b', {'class':'ogl_deut'}, Util.formatToUnits(tech.deut)));

                        let substract = targetContainer.appendChild(Util.createDom('b', {'class':'material-icons'}, 'remove'));

                        if(this.availableResources[0] <= 0 && this.availableResources[1] <= 0 && this.availableResources[2] <= 0)
                        {
                            substract.classList.add('ogl_disabled');
                        }

                        substract.addEventListener('click', () =>
                        {
                            let key = `${tech.id}_${tech.level}_${tech.onMoon ? 'moon' : 'planet'}`;

                            if(this.availableResources[0] > 0) this.ogl.db.lock[coords][key].metal = Math.max(tech.metal - (this.ogl.db.me?.planets?.[coords]?.resources?.metal || 0), 0);
                            if(this.availableResources[1] > 0) this.ogl.db.lock[coords][key].crystal = Math.max(tech.crystal - (this.ogl.db.me?.planets?.[coords]?.resources?.crystal || 0), 0);
                            if(this.availableResources[2] > 0) this.ogl.db.lock[coords][key].deut = Math.max(tech.deut - (this.ogl.db.me?.planets?.[coords]?.resources?.deut || 0), 0);

                            this.availableResources[0] -= tech.metal;
                            this.availableResources[1] -= tech.crystal;
                            this.availableResources[2] -= tech.deut;

                            // this.ogl.saveAsync();
                            this.ogl.component.popup.close();
                            this.checkLockedTechs(coords, true);
                        });

                        let send = targetContainer.appendChild(Util.createDom('b', {'class':'material-icons'}, 'local_shipping'));
                        send.addEventListener('click', () =>
                        {
                            this.ogl.db.lockedList = [];
                            this.ogl.db.lockedList.push(`${tech.id}_${tech.level}_${tech.onMoon ? 'moon' : 'planet'}`);
                            this.ogl.save();

                            let splitted = coords.split(':');
                            Util.redirect(`https://${window.location.host}/game/index.php?page=ingame&component=fleetdispatch&ogl_mode=3&galaxy=${splitted[0]}&system=${splitted[1]}&position=${splitted[2]}&mission=${this.ogl.db.options.defaultMission}&type=${tech.onMoon ? 3 : 1}`, this.ogl);
                        });

                        let remove = targetContainer.appendChild(Util.createDom('b', {'class':'material-icons'}, 'close'));
                        remove.addEventListener('click', () =>
                        {
                            delete this.ogl.db.lock[coords][`${tech.id}_${tech.level}_${!tech.onMoon ? 'planet' : 'moon'}`];
                            // this.ogl.saveAsync();
                            this.ogl.component.popup.close();
                            this.checkLockedTechs(coords, noSub);
                        });

                        let offset = tech.onMoon ? 3 : 0;
                        cumul[0 + offset] += tech.metal;
                        cumul[1 + offset] += tech.crystal;
                        cumul[2 + offset] += tech.deut;
                    }

                    ['planet', 'moon'].forEach(e =>
                    {
                        let headerContainer = e == 'planet' ? planetContainer : moonContainer;
                        let offset = e == 'planet' ? 0 : 3;

                        headerContainer.appendChild(Util.createDom('span', {'class':'ogl_header'}, 'Total ' + e));
                        headerContainer.appendChild(Util.createDom('i', {'class':'ogl_header'}, '&nbsp;'));
                        headerContainer.appendChild(Util.createDom('b', {'class':'ogl_header ogl_metal'}, Util.formatToUnits(cumul[0 + offset])));
                        headerContainer.appendChild(Util.createDom('b', {'class':'ogl_header ogl_crystal'}, Util.formatToUnits(cumul[1 + offset])));
                        headerContainer.appendChild(Util.createDom('b', {'class':'ogl_header ogl_deut'}, Util.formatToUnits(cumul[2 + offset])));
                        headerContainer.appendChild(Util.createDom('i', {'class':'ogl_header'}, '&nbsp;'));

                        let send = headerContainer.appendChild(Util.createDom('b', {'class':'ogl_header material-icons'}, 'local_shipping'));
                        send.addEventListener('click', () =>
                        {
                            this.ogl.db.lockedList = [];

                            for(let tech of Object.values(this.ogl.db.lock[coords]))
                            {
                                if(this.ogl.db.lock[coords][`${tech.id}_${tech.level}_${e}`])
                                {
                                    this.ogl.db.lockedList.push(`${tech.id}_${tech.level}_${e}`);
                                    this.ogl.save();

                                    let splitted = coords.split(':');
                                    Util.redirect(`https://${window.location.host}/game/index.php?page=ingame&component=fleetdispatch&ogl_mode=3&galaxy=${splitted[0]}&system=${splitted[1]}&position=${splitted[2]}&mission=${this.ogl.db.options.defaultMission}&type=${tech.onMoon ? 3 : 1}`, this.ogl);
                                }
                            }
                        });

                        let remove = headerContainer.appendChild(Util.createDom('b', {'class':'ogl_header material-icons'}, 'close'));
                        remove.addEventListener('click', () =>
                        {
                            for(let tech of Object.values(this.ogl.db.lock[coords]))
                            {
                                if(this.ogl.db.lock[coords][`${tech.id}_${tech.level}_${e}`]) delete this.ogl.db.lock[coords][`${tech.id}_${tech.level}_${e}`];
                            }

                            // this.ogl.saveAsync();
                            this.ogl.component.popup.close();
                            this.checkLockedTechs(coords);
                        });
                    });

                    this.ogl.component.popup.open(container);
                });

                if(refresh && refresh == coords) button.click();
            }
        });
    }

    checkStorage()
    {
        if(this.ogl.current.type == 'moon') return;

        let storage =
        {
            'metal' : resourcesBar.resources.metal.storage,
            'crystal' : resourcesBar.resources.crystal.storage,
            'deut' : resourcesBar.resources.deuterium.storage,
        };

        ['metal', 'crystal', 'deut'].forEach(res =>
        {
            let prod = resourcesBar.resources[res.replace('deut', 'deuterium')].tooltip.replace(/\./g, '').match(/\d+/g)[2];
            let timeLeft = prod > 0 ? Math.floor((storage[res] - this.ogl.current[res]) / prod) || 0 : 0;
            let day = Math.max(0, Math.floor(timeLeft / 24));
            let hour = Math.max(0, Math.floor(timeLeft % 24));

            let box = document.querySelector(`#${res.replace('deut', 'deuterium')}_box`);
            let text = day > 365 ? `> 365${LocalizationStrings.timeunits.short.day}` : `${day}${LocalizationStrings.timeunits.short.day}<br>${hour}${LocalizationStrings.timeunits.short.hour}`;
            box.querySelector('.resourceIcon').appendChild(Util.createDom('div', {'class':'ogl_storage'}, text));
       });
    }

    checkCrawlers()
    {
        if(this.ogl.current.type == 'planet' && (this.ogl.page == 'supplies' || this.ogl.page == 'shipyard'))
        {
            let currentCoords = this.ogl.current.coords.join(':');

            let maxCrawler = ((this.ogl.db.me.planets?.[currentCoords]?.techs?.[1] || 0) + (this.ogl.db.me.planets?.[currentCoords]?.techs?.[2] || 0) + (this.ogl.db.me.planets?.[currentCoords]?.techs?.[3] || 0)) * 8;
            if(document.querySelector('#officers .geologist.on') && this.ogl.account.class == 1) maxCrawler += maxCrawler * .1;
            document.querySelector('.technology[data-technology="217"] .amount span').appendChild(Util.createDom('span', {'class':'ogl_maxCrawler'}, ` / ${Util.formatNumber(Math.floor(maxCrawler))}`));
        }
    }

    getEmpireData(forced)
    {
        let now = Date.now();

        if((now > this.ogl.db.lastEmpireUpdate + 300000 && document.visibilityState === 'visible') || forced) // update every 5 mn
        {
            let stacks = 0;
            let maxLoop = document.querySelector('.smallplanet .moonlink') ? 2 : 1;

            for(let i=0; i<maxLoop; i++)
            {
                $.ajax(
                {
                    url:`https://${window.location.host}/game/index.php?page=ajax&component=empire&ajax=1&asJson=1&planetType=${i}`,
                    type:'GET',
                    dataType:'json',
                    success:result =>
                    {
                        let data = JSON.parse(result.mergedArray).planets;
                        if(!data) return;

                        Object.values(data).forEach(p =>
                        {
                            let stockDiv = Util.createDom('div', {'class':'ogl_stock'});
                            let coords = p.coordinates.slice(1, -1);

                            if(p.type != 1) coords += ':M';

                            let currentPlanetCoords = this.ogl.current.coords.join(':');
                            if(this.ogl.current.type == 'moon') currentPlanetCoords += ':M';

                            this.ogl.db.me.planets[coords] = this.ogl.db.me.planets[coords] || { techs:{} };
                            this.ogl.db.me.planets[coords].techs = this.ogl.db.me.planets[coords].techs || {};
                            this.ogl.db.me.planets[coords].resources = this.ogl.db.me.planets[coords].resources || {};
                            this.ogl.db.me.planets[coords].production = this.ogl.db.me.planets[coords].production || [];
                            this.ogl.db.me.planets[coords].storage = (this.ogl.db.me.planets[coords].storage?.constructor?.name == 'array' ? {} : this.ogl.db.me.planets[coords].storage) || {};

                            Object.keys(p).forEach(k =>
                            {
                                if(!isNaN(k))
                                {
                                    this.ogl.db.me.planets[coords].techs[k] = p[k];
                                }
                                else
                                {
                                    // resources
                                    if(k == 'metal' && coords != currentPlanetCoords) this.ogl.db.me.planets[coords].resources.metal = p[k];
                                    else if(k == 'crystal' && coords != currentPlanetCoords) this.ogl.db.me.planets[coords].resources.crystal = p[k];
                                    else if(k == 'deuterium' && coords != currentPlanetCoords) this.ogl.db.me.planets[coords].resources.deut = p[k];
                                    else if(k == 'food' && coords != currentPlanetCoords) this.ogl.db.me.planets[coords].resources.food = p[k];
                                    else if(k == 'population' && coords != currentPlanetCoords) this.ogl.db.me.planets[coords].resources.population = p[k];
                                    // storage
                                    else if(k == 'metalStorage') this.ogl.db.me.planets[coords].storage.metal = p[k];
                                    else if(k == 'crystalStorage') this.ogl.db.me.planets[coords].storage.crystal = p[k];
                                    else if(k == 'deuteriumStorage') this.ogl.db.me.planets[coords].storage.deut = p[k];
                                    else if(k == 'foodStorage') this.ogl.db.me.planets[coords].storage.food = p[k];
                                    else if(k == 'populationStorage') this.ogl.db.me.planets[coords].storage.population = p[k];
                                    // production
                                    else if(k == 'production')
                                    {
                                        this.ogl.db.me.planets[coords].production[0] = (p[k].hourly[0]/ 3600).toFixed(2);
                                        this.ogl.db.me.planets[coords].production[1] = (p[k].hourly[1]/ 3600).toFixed(2);
                                        this.ogl.db.me.planets[coords].production[2] = (p[k].hourly[2]/ 3600).toFixed(2);
                                        this.ogl.db.me.planets[coords].production[3] = serverTime.getTime();
                                    }
                                    // other
                                    else if(k == 'fieldUsed') this.ogl.db.me.planets[coords].fieldUsed = p[k];
                                    else if(k == 'fieldMax') this.ogl.db.me.planets[coords].fieldMax = p[k];
                                    else if(k == 'temperature') this.ogl.db.me.planets[coords].temperature = p[k].match(/[-+]?[0-9]*\.?[0-9]+/g)[1];
                                }
                            });

                            let targetType = i != 1 ? 'planetlink' : 'moonlink';
                            let targetID = i != 1 ? p.id : p.planetID;
                            let target = document.querySelector(`.smallplanet[id="planet-${targetID}"] .${targetType}`);

                            ['metal', 'crystal', 'deut'].forEach(res =>
                            {
                                let storage = this.ogl.db.me.planets?.[coords]?.storage?.[res];
                                let amount = this.ogl.db.me.planets[coords].resources[res];
                                let line = stockDiv.appendChild(Util.createDom('div', {'class':`ogl_${res}`}, Util.formatToUnits(amount)));

                                if(storage && amount >= storage && i != 1) line.classList.add('ogl_full');
                            });

                            target.querySelector('.ogl_stock').innerHTML = stockDiv.innerHTML;
                        });

                        stacks++;
                        if(stacks == maxLoop)
                        {
                            this.ogl.db.lastEmpireUpdate = now;
                            this.ogl.saveAsync();
                        }
                    }
                });
            }
        }
        //else setTimeout(() => this.getEmpireData(true), 60000);
    }

    reloadEventbox()
    {
        if(document.querySelector('#eventboxContent h2 .ogl_button') || !document.querySelector('#eventboxContent h2')) return;

        let button = document.querySelector('#eventboxContent h2').appendChild(Util.createDom('div', {'class':'ogl_button material-icons'}, 'refresh'));
        button.addEventListener('click', () =>
        {
            if(document.querySelector('#eventboxContent #eventContent').querySelector('.ogl_loader')) return;

            document.querySelector('#eventboxContent #eventContent').textContent = '';
            document.querySelector('#eventboxContent #eventContent').appendChild(Util.createDom('div', {'class':'ogl_loader'}));

            Util.getRaw(eventlistLink, result =>
            {
                $("#eventboxContent").html(result);
                toggleEvents.loaded = true;
            });
        });
    }
}

class Datafinder
{
    static getTech(id)
    {
        let tech =
        {
            // base
            1 : { priceFactor:1.5 },
            2 : { priceFactor:1.6 },
            3 : { priceFactor:1.5 },
            4 : { priceFactor:1.5 },
            12 : { priceFactor:1.8 },
            33 : { energyFactor:2 },
            36 : { priceFactor:5, energyFactor:2.5 },
            124 : { priceFactor:1.75 },
            199 : { priceFactor:3, energyFactor:3 },

            // ship
            202: { metal:2000,      crystal:2000,       deut:0 },
            203: { metal:6000,      crystal:6000,       deut:0 },
            204: { metal:3000,      crystal:1000,       deut:0 },
            205: { metal:6000,      crystal:4000,       deut:0 },
            206: { metal:20000,     crystal:7000,       deut:2000 },
            207: { metal:45000,     crystal:15000,      deut:0 },
            208: { metal:10000,     crystal:20000,      deut:10000 },
            209: { metal:10000,     crystal:6000,       deut:2000 },
            210: {  crystal:1000,       deut:0 },
            211: { metal:50000,     crystal:25000,      deut:15000 },
            212: { metal:0,         crystal:2000,       deut:500 },
            213: { metal:60000,     crystal:50000,      deut:15000 },
            214: { metal:5000000,   crystal:4000000,    deut:1000000 },
            215: { metal:30000,     crystal:40000,      deut:15000 },
            217: { metal:2000,      crystal:2000,       deut:1000 },
            218: { metal:85000,     crystal:55000,      deut:20000 },
            219: { metal:8000,      crystal:15000,      deut:8000 },

            // def
            401: { metal:2000,  crystal:0,      deut:0 },
            402: { metal:1500,  crystal:500,    deut:0 },
            403: { metal:6000,  crystal:2000,   deut:0 },
            404: { metal:20000, crystal:15000,  deut:2000 },
            405: { metal:5000,  crystal:3000,   deut:0 },
            406: { metal:50000, crystal:50000,  deut:30000 },
            407: { metal:10000, crystal:10000,  deut:0 },
            408: { metal:50000, crystal:50000,  deut:0 },

            // lifeforms
            "11101":{"name":"Residential Sector","type":"Building","lifeform":"Human","metal":7,"crystal":2,"deut":0,"energy":"","priceFactor":1.2,"energyFactor":"","baseBonus1":210,"factorBonus1":1.21,"maxBonus1":"","baseBonus2":16,"factorBonus2":1.2,"maxBonus2":"","baseBonus3":9,"factorBonus3":1.15,"maxBonus3":"","durationFactor":1.21,"duration":40},"11102":{"name":"Biosphere Farm","type":"Building","lifeform":"Human","metal":5,"crystal":2,"deut":0,"energy":8,"priceFactor":1.23,"energyFactor":1.02,"baseBonus1":10,"factorBonus1":1.15,"maxBonus1":"","baseBonus2":10,"factorBonus2":1.14,"maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.25,"duration":40},"11103":{"name":"Research Centre","type":"Building","lifeform":"Human","metal":20000,"crystal":25000,"deut":10000,"energy":10,"priceFactor":1.3,"energyFactor":1.08,"baseBonus1":0.25,"factorBonus1":1,"maxBonus1":0.25,"baseBonus2":2,"factorBonus2":1,"maxBonus2":0.99,"baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.25,"duration":16000},"11104":{"name":"Academy of Sciences","type":"Building","lifeform":"Human","metal":5000,"crystal":3200,"deut":1500,"energy":15,"priceFactor":1.7,"energyFactor":1.25,"baseBonus1":20000000,"factorBonus1":1.1,"maxBonus1":"","baseBonus2":1,"factorBonus2":1,"maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.6,"duration":16000},"11105":{"name":"Neuro-Calibration Centre","type":"Building","lifeform":"Human","metal":50000,"crystal":40000,"deut":50000,"energy":30,"priceFactor":1.7,"energyFactor":1.25,"baseBonus1":100000000,"factorBonus1":1.1,"maxBonus1":"","baseBonus2":1,"factorBonus2":1,"maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.7,"duration":64000},"11106":{"name":"High Energy Smelting","type":"Building","lifeform":"Human","metal":9000,"crystal":6000,"deut":3000,"energy":40,"priceFactor":1.5,"energyFactor":1.1,"baseBonus1":1.5,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.3,"duration":2000},"11107":{"name":"Food Silo","type":"Building","lifeform":"Human","metal":25000,"crystal":13000,"deut":7000,"energy":"","priceFactor":1.09,"energyFactor":"","baseBonus1":1,"factorBonus1":1,"maxBonus1":"","baseBonus2":1,"factorBonus2":1,"maxBonus2":0.8,"baseBonus3":0.8,"factorBonus3":1,"maxBonus3":"","durationFactor":1.17,"duration":12000},"11108":{"name":"Fusion-Powered Production","type":"Building","lifeform":"Human","metal":50000,"crystal":25000,"deut":15000,"energy":80,"priceFactor":1.5,"energyFactor":1.1,"baseBonus1":1.5,"factorBonus1":1,"maxBonus1":"","baseBonus2":1,"factorBonus2":1,"maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.2,"duration":28000},"11109":{"name":"Skyscraper","type":"Building","lifeform":"Human","metal":75000,"crystal":20000,"deut":25000,"energy":50,"priceFactor":1.09,"energyFactor":1.02,"baseBonus1":1.5,"factorBonus1":1,"maxBonus1":"","baseBonus2":1.5,"factorBonus2":1,"maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.2,"duration":40000},"11110":{"name":"Biotech Lab","type":"Building","lifeform":"Human","metal":150000,"crystal":30000,"deut":15000,"energy":60,"priceFactor":1.12,"energyFactor":1.03,"baseBonus1":5,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.2,"duration":52000},"11111":{"name":"Metropolis","type":"Building","lifeform":"Human","metal":80000,"crystal":35000,"deut":60000,"energy":90,"priceFactor":1.5,"energyFactor":1.05,"baseBonus1":0.5,"factorBonus1":1,"maxBonus1":1,"baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.3,"duration":90000},"11112":{"name":"Planetary Shield","type":"Building","lifeform":"Human","metal":250000,"crystal":125000,"deut":125000,"energy":100,"priceFactor":1.2,"energyFactor":1.02,"baseBonus1":1.5,"factorBonus1":1,"maxBonus1":0.8,"baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.2,"duration":95000},"11201":{"name":"Intergalactic Envoys","type":"Tech 1","lifeform":"Human","metal":5000,"crystal":2500,"deut":500,"energy":"","priceFactor":1.3,"energyFactor":"","baseBonus1":1,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.2,"duration":1000},"11202":{"name":"High-Performance Extractors","type":"Tech 2","lifeform":"Human","metal":7000,"crystal":10000,"deut":5000,"energy":"","priceFactor":1.5,"energyFactor":"","baseBonus1":0.06,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.3,"duration":2000},"11203":{"name":"Fusion Drives","type":"Tech 3","lifeform":"Human","metal":15000,"crystal":10000,"deut":5000,"energy":"","priceFactor":1.3,"energyFactor":"","baseBonus1":0.5,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.3,"duration":2500},"11204":{"name":"Stealth Field Generator","type":"Tech 4","lifeform":"Human","metal":20000,"crystal":15000,"deut":7500,"energy":"","priceFactor":1.3,"energyFactor":"","baseBonus1":0.1,"factorBonus1":1,"maxBonus1":0.5,"baseBonus2":0.2,"factorBonus2":1,"maxBonus2":0.99,"baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.3,"duration":3500},"11205":{"name":"Orbital Den","type":"Tech 5","lifeform":"Human","metal":25000,"crystal":20000,"deut":10000,"energy":"","priceFactor":1.4,"energyFactor":"","baseBonus1":4,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.2,"duration":4500},"11206":{"name":"Research AI","type":"Tech 6","lifeform":"Human","metal":35000,"crystal":25000,"deut":15000,"energy":"","priceFactor":1.5,"energyFactor":"","baseBonus1":0.1,"factorBonus1":1,"maxBonus1":0.99,"baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.3,"duration":5000},"11207":{"name":"High-Performance Terraformer","type":"Tech 7","lifeform":"Human","metal":70000,"crystal":40000,"deut":20000,"energy":"","priceFactor":1.3,"energyFactor":"","baseBonus1":0.1,"factorBonus1":1,"maxBonus1":0.5,"baseBonus2":0.2,"factorBonus2":1,"maxBonus2":0.99,"baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.3,"duration":8000},"11208":{"name":"Enhanced Production Technologies","type":"Tech 8","lifeform":"Human","metal":80000,"crystal":50000,"deut":20000,"energy":"","priceFactor":1.5,"energyFactor":"","baseBonus1":0.06,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.3,"duration":6000},"11209":{"name":"Light Fighter Mk II","type":"Tech 9","lifeform":"Human","metal":320000,"crystal":240000,"deut":100000,"energy":"","priceFactor":1.5,"energyFactor":"","baseBonus1":0.3,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.4,"duration":6500},"11210":{"name":"Cruiser Mk II","type":"Tech 10","lifeform":"Human","metal":320000,"crystal":240000,"deut":100000,"energy":"","priceFactor":1.5,"energyFactor":"","baseBonus1":0.3,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.4,"duration":7000},"11211":{"name":"Improved Lab Technology","type":"Tech 11","lifeform":"Human","metal":120000,"crystal":30000,"deut":25000,"energy":"","priceFactor":1.5,"energyFactor":"","baseBonus1":0.1,"factorBonus1":1,"maxBonus1":0.99,"baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.3,"duration":7500},"11212":{"name":"Plasma Terraformer","type":"Tech 12","lifeform":"Human","metal":100000,"crystal":40000,"deut":30000,"energy":"","priceFactor":1.3,"energyFactor":"","baseBonus1":0.1,"factorBonus1":1,"maxBonus1":0.5,"baseBonus2":0.2,"factorBonus2":1,"maxBonus2":0.99,"baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.3,"duration":10000},"11213":{"name":"Low-Temperature Drives","type":"Tech 13","lifeform":"Human","metal":200000,"crystal":100000,"deut":100000,"energy":"","priceFactor":1.3,"energyFactor":"","baseBonus1":0.1,"factorBonus1":1,"maxBonus1":0.5,"baseBonus2":0.2,"factorBonus2":1,"maxBonus2":0.99,"baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.3,"duration":8500},"11214":{"name":"Bomber Mk II","type":"Tech 14","lifeform":"Human","metal":160000,"crystal":120000,"deut":50000,"energy":"","priceFactor":1.5,"energyFactor":"","baseBonus1":0.3,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.4,"duration":9000},"11215":{"name":"Destroyer Mk II","type":"Tech 15","lifeform":"Human","metal":160000,"crystal":120000,"deut":50000,"energy":"","priceFactor":1.5,"energyFactor":"","baseBonus1":0.3,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.4,"duration":9500},"11216":{"name":"Battlecruiser Mk II","type":"Tech 16","lifeform":"Human","metal":320000,"crystal":240000,"deut":100000,"energy":"","priceFactor":1.5,"energyFactor":"","baseBonus1":0.3,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.4,"duration":10000},"11217":{"name":"Robot Assistants","type":"Tech 17","lifeform":"Human","metal":300000,"crystal":180000,"deut":120000,"energy":"","priceFactor":1.5,"energyFactor":"","baseBonus1":0.2,"factorBonus1":1,"maxBonus1":0.99,"baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.3,"duration":11000},"11218":{"name":"Supercomputer","type":"Tech 18","lifeform":"Human","metal":500000,"crystal":300000,"deut":200000,"energy":"","priceFactor":1.3,"energyFactor":"","baseBonus1":0.1,"factorBonus1":1,"maxBonus1":0.99,"baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.3,"duration":13000},"12101":{"name":"Meditation Enclave","type":"Building","lifeform":"Rock´tal","metal":9,"crystal":3,"deut":0,"energy":"","priceFactor":1.2,"energyFactor":"","baseBonus1":150,"factorBonus1":1.22,"maxBonus1":"","baseBonus2":12,"factorBonus2":1.2,"maxBonus2":"","baseBonus3":5,"factorBonus3":1.15,"maxBonus3":"","durationFactor":1.21,"duration":40},"12102":{"name":"Crystal Farm","type":"Building","lifeform":"Rock´tal","metal":7,"crystal":2,"deut":0,"energy":10,"priceFactor":1.2,"energyFactor":1.03,"baseBonus1":8,"factorBonus1":1.15,"maxBonus1":"","baseBonus2":6,"factorBonus2":1.14,"maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.21,"duration":40},"12103":{"name":"Rune Technologium","type":"Building","lifeform":"Rock´tal","metal":40000,"crystal":10000,"deut":15000,"energy":15,"priceFactor":1.3,"energyFactor":1.1,"baseBonus1":0.25,"factorBonus1":1,"maxBonus1":0.25,"baseBonus2":2,"factorBonus2":1,"maxBonus2":0.99,"baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.25,"duration":16000},"12104":{"name":"Rune Forge","type":"Building","lifeform":"Rock´tal","metal":5000,"crystal":3800,"deut":1000,"energy":20,"priceFactor":1.7,"energyFactor":1.35,"baseBonus1":16000000,"factorBonus1":1.14,"maxBonus1":"","baseBonus2":1,"factorBonus2":1,"maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.6,"duration":16000},"12105":{"name":"Oriktorium","type":"Building","lifeform":"Rock´tal","metal":50000,"crystal":40000,"deut":50000,"energy":60,"priceFactor":1.65,"energyFactor":1.3,"baseBonus1":90000000,"factorBonus1":1.1,"maxBonus1":"","baseBonus2":1,"factorBonus2":1,"maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.7,"duration":64000},"12106":{"name":"Magma Forge","type":"Building","lifeform":"Rock´tal","metal":10000,"crystal":8000,"deut":1000,"energy":40,"priceFactor":1.4,"energyFactor":1.1,"baseBonus1":2,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.3,"duration":2000},"12107":{"name":"Disruption Chamber","type":"Building","lifeform":"Rock´tal","metal":20000,"crystal":15000,"deut":10000,"energy":"","priceFactor":1.2,"energyFactor":"","baseBonus1":1.5,"factorBonus1":1,"maxBonus1":"","baseBonus2":0.5,"factorBonus2":1,"maxBonus2":0.4,"baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.25,"duration":16000},"12108":{"name":"Megalith","type":"Building","lifeform":"Rock´tal","metal":50000,"crystal":35000,"deut":15000,"energy":80,"priceFactor":1.5,"energyFactor":1.3,"baseBonus1":1,"factorBonus1":1,"maxBonus1":0.5,"baseBonus2":1,"factorBonus2":1,"maxBonus2":0.5,"baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.4,"duration":40000},"12109":{"name":"Crystal Refinery","type":"Building","lifeform":"Rock´tal","metal":85000,"crystal":44000,"deut":25000,"energy":90,"priceFactor":1.4,"energyFactor":1.1,"baseBonus1":2,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.2,"duration":40000},"12110":{"name":"Deuterium Synthesiser","type":"Building","lifeform":"Rock´tal","metal":120000,"crystal":50000,"deut":20000,"energy":90,"priceFactor":1.4,"energyFactor":1.1,"baseBonus1":2,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.2,"duration":52000},"12111":{"name":"Mineral Research Centre","type":"Building","lifeform":"Rock´tal","metal":250000,"crystal":150000,"deut":100000,"energy":120,"priceFactor":1.8,"energyFactor":1.3,"baseBonus1":0.5,"factorBonus1":1,"maxBonus1":0.5,"baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.3,"duration":90000},"12112":{"name":"Advanced Recycling Plant","type":"Building","lifeform":"Rock´tal","metal":250000,"crystal":125000,"deut":125000,"energy":100,"priceFactor":1.5,"energyFactor":1.1,"baseBonus1":0.6,"factorBonus1":1,"maxBonus1":0.3,"baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.3,"duration":95000},"12201":{"name":"Volcanic Batteries","type":"Tech 1","lifeform":"Rock´tal","metal":10000,"crystal":6000,"deut":1000,"energy":"","priceFactor":1.5,"energyFactor":"","baseBonus1":0.25,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.3,"duration":1000},"12202":{"name":"Acoustic Scanning","type":"Tech 2","lifeform":"Rock´tal","metal":7500,"crystal":12500,"deut":5000,"energy":"","priceFactor":1.5,"energyFactor":"","baseBonus1":0.08,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.3,"duration":2000},"12203":{"name":"High Energy Pump Systems","type":"Tech 3","lifeform":"Rock´tal","metal":15000,"crystal":10000,"deut":5000,"energy":"","priceFactor":1.5,"energyFactor":"","baseBonus1":0.08,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.3,"duration":2500},"12204":{"name":"Cargo Hold Expansion (Civilian Ships)","type":"Tech 4","lifeform":"Rock´tal","metal":20000,"crystal":15000,"deut":7500,"energy":"","priceFactor":1.3,"energyFactor":"","baseBonus1":0.4,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.4,"duration":3500},"12205":{"name":"Magma-Powered Production","type":"Tech 5","lifeform":"Rock´tal","metal":25000,"crystal":20000,"deut":10000,"energy":"","priceFactor":1.5,"energyFactor":"","baseBonus1":0.08,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.3,"duration":4500},"12206":{"name":"Geothermal Power Plants","type":"Tech 6","lifeform":"Rock´tal","metal":50000,"crystal":50000,"deut":20000,"energy":"","priceFactor":1.5,"energyFactor":"","baseBonus1":0.25,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.3,"duration":5000},"12207":{"name":"Depth Sounding","type":"Tech 7","lifeform":"Rock´tal","metal":70000,"crystal":40000,"deut":20000,"energy":"","priceFactor":1.5,"energyFactor":"","baseBonus1":0.08,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.3,"duration":5500},"12208":{"name":"Ion Crystal Enhancement (Heavy Fighter)","type":"Tech 8","lifeform":"Rock´tal","metal":160000,"crystal":120000,"deut":50000,"energy":"","priceFactor":1.5,"energyFactor":"","baseBonus1":0.3,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.4,"duration":6000},"12209":{"name":"Improved Stellarator","type":"Tech 9","lifeform":"Rock´tal","metal":75000,"crystal":55000,"deut":25000,"energy":"","priceFactor":1.5,"energyFactor":"","baseBonus1":0.15,"factorBonus1":1,"maxBonus1":0.5,"baseBonus2":0.3,"factorBonus2":1,"maxBonus2":0.99,"baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.3,"duration":6500},"12210":{"name":"Hardened Diamond Drill Heads","type":"Tech 10","lifeform":"Rock´tal","metal":85000,"crystal":40000,"deut":35000,"energy":"","priceFactor":1.5,"energyFactor":"","baseBonus1":0.08,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.3,"duration":7000},"12211":{"name":"Seismic Mining Technology","type":"Tech 11","lifeform":"Rock´tal","metal":120000,"crystal":30000,"deut":25000,"energy":"","priceFactor":1.5,"energyFactor":"","baseBonus1":0.08,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.3,"duration":7500},"12212":{"name":"Magma-Powered Pump Systems","type":"Tech 12","lifeform":"Rock´tal","metal":100000,"crystal":40000,"deut":30000,"energy":"","priceFactor":1.5,"energyFactor":"","baseBonus1":0.08,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.3,"duration":8000},"12213":{"name":"Ion Crystal Modules","type":"Tech 13","lifeform":"Rock´tal","metal":200000,"crystal":100000,"deut":100000,"energy":"","priceFactor":1.2,"energyFactor":"","baseBonus1":0.1,"factorBonus1":1,"maxBonus1":0.5,"baseBonus2":0.1,"factorBonus2":1,"maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.3,"duration":8500},"12214":{"name":"Optimised Silo Construction Method","type":"Tech 14","lifeform":"Rock´tal","metal":220000,"crystal":110000,"deut":110000,"energy":"","priceFactor":1.3,"energyFactor":"","baseBonus1":0.1,"factorBonus1":1,"maxBonus1":0.5,"baseBonus2":0.2,"factorBonus2":1,"maxBonus2":0.99,"baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.3,"duration":9000},"12215":{"name":"Diamond Energy Transmitter","type":"Tech 15","lifeform":"Rock´tal","metal":240000,"crystal":120000,"deut":120000,"energy":"","priceFactor":1.3,"energyFactor":"","baseBonus1":0.1,"factorBonus1":1,"maxBonus1":0.5,"baseBonus2":0.2,"factorBonus2":1,"maxBonus2":0.99,"baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.3,"duration":9500},"12216":{"name":"Obsidian Shield Reinforcement","type":"Tech 16","lifeform":"Rock´tal","metal":250000,"crystal":250000,"deut":250000,"energy":"","priceFactor":1.4,"energyFactor":"","baseBonus1":0.5,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.4,"duration":10000},"12217":{"name":"Rune Shields","type":"Tech 17","lifeform":"Rock´tal","metal":500000,"crystal":300000,"deut":200000,"energy":"","priceFactor":1.5,"energyFactor":"","baseBonus1":0.2,"factorBonus1":1,"maxBonus1":0.5,"baseBonus2":0.2,"factorBonus2":1,"maxBonus2":0.99,"baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.3,"duration":13000},"12218":{"name":"Rock’tal Collector Enhancement","type":"Tech 18","lifeform":"Rock´tal","metal":300000,"crystal":180000,"deut":120000,"energy":"","priceFactor":1.7,"energyFactor":"","baseBonus1":0.2,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.4,"duration":11000},"13101":{"name":"Assembly Line","type":"Building","lifeform":"Mecha","metal":6,"crystal":2,"deut":0,"energy":"","priceFactor":1.21,"energyFactor":"","baseBonus1":500,"factorBonus1":1.21,"maxBonus1":"","baseBonus2":24,"factorBonus2":1.2,"maxBonus2":"","baseBonus3":22,"factorBonus3":1.15,"maxBonus3":"","durationFactor":1.22,"duration":40},"13102":{"name":"Fusion Cell Factory","type":"Building","lifeform":"Mecha","metal":5,"crystal":2,"deut":0,"energy":8,"priceFactor":1.18,"energyFactor":1.02,"baseBonus1":18,"factorBonus1":1.15,"maxBonus1":"","baseBonus2":23,"factorBonus2":1.12,"maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.2,"duration":48},"13103":{"name":"Robotics Research Centre","type":"Building","lifeform":"Mecha","metal":30000,"crystal":20000,"deut":10000,"energy":13,"priceFactor":1.3,"energyFactor":1.08,"baseBonus1":0.25,"factorBonus1":1,"maxBonus1":0.25,"baseBonus2":2,"factorBonus2":1,"maxBonus2":0.99,"baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.25,"duration":16000},"13104":{"name":"Update Network","type":"Building","lifeform":"Mecha","metal":5000,"crystal":3800,"deut":1000,"energy":10,"priceFactor":1.8,"energyFactor":1.2,"baseBonus1":40000000,"factorBonus1":1.1,"maxBonus1":"","baseBonus2":1,"factorBonus2":1,"maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.6,"duration":16000},"13105":{"name":"Quantum Computer Centre","type":"Building","lifeform":"Mecha","metal":50000,"crystal":40000,"deut":50000,"energy":40,"priceFactor":1.8,"energyFactor":1.2,"baseBonus1":130000000,"factorBonus1":1.1,"maxBonus1":"","baseBonus2":1,"factorBonus2":1,"maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.7,"duration":64000},"13106":{"name":"Automatised Assembly Centre","type":"Building","lifeform":"Mecha","metal":7500,"crystal":7000,"deut":1000,"energy":"","priceFactor":1.3,"energyFactor":"","baseBonus1":2,"factorBonus1":1,"maxBonus1":0.99,"baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.3,"duration":2000},"13107":{"name":"High-Performance Transformer","type":"Building","lifeform":"Mecha","metal":35000,"crystal":15000,"deut":10000,"energy":40,"priceFactor":1.5,"energyFactor":1.05,"baseBonus1":1,"factorBonus1":1,"maxBonus1":"","baseBonus2":0.3,"factorBonus2":1,"maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.4,"duration":16000},"13108":{"name":"Microchip Assembly Line","type":"Building","lifeform":"Mecha","metal":50000,"crystal":20000,"deut":30000,"energy":40,"priceFactor":1.07,"energyFactor":1.01,"baseBonus1":2,"factorBonus1":1,"maxBonus1":"","baseBonus2":2,"factorBonus2":1,"maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.17,"duration":12000},"13109":{"name":"Production Assembly Hall","type":"Building","lifeform":"Mecha","metal":100000,"crystal":10000,"deut":3000,"energy":80,"priceFactor":1.14,"energyFactor":1.04,"baseBonus1":2,"factorBonus1":1,"maxBonus1":"","baseBonus2":6,"factorBonus2":1,"maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.3,"duration":40000},"13110":{"name":"High-Performance Synthesiser","type":"Building","lifeform":"Mecha","metal":100000,"crystal":40000,"deut":20000,"energy":60,"priceFactor":1.5,"energyFactor":1.1,"baseBonus1":2,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.2,"duration":52000},"13111":{"name":"Chip Mass Production","type":"Building","lifeform":"Mecha","metal":55000,"crystal":50000,"deut":30000,"energy":70,"priceFactor":1.5,"energyFactor":1.05,"baseBonus1":0.3,"factorBonus1":1,"maxBonus1":1,"baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.3,"duration":50000},"13112":{"name":"Nano Repair Bots","type":"Building","lifeform":"Mecha","metal":250000,"crystal":125000,"deut":125000,"energy":100,"priceFactor":1.4,"energyFactor":1.05,"baseBonus1":1.3,"factorBonus1":1,"maxBonus1":0.5,"baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.4,"duration":95000},"13201":{"name":"Catalyser Technology","type":"Tech 1","lifeform":"Mecha","metal":10000,"crystal":6000,"deut":1000,"energy":"","priceFactor":1.5,"energyFactor":"","baseBonus1":0.08,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.3,"duration":1000},"13202":{"name":"Plasma Drive","type":"Tech 2","lifeform":"Mecha","metal":7500,"crystal":12500,"deut":5000,"energy":"","priceFactor":1.3,"energyFactor":"","baseBonus1":0.2,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.3,"duration":2000},"13203":{"name":"Efficiency Module","type":"Tech 3","lifeform":"Mecha","metal":15000,"crystal":10000,"deut":5000,"energy":"","priceFactor":1.5,"energyFactor":"","baseBonus1":0.03,"factorBonus1":1,"maxBonus1":0.3,"baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.4,"duration":2500},"13204":{"name":"Depot AI","type":"Tech 4","lifeform":"Mecha","metal":20000,"crystal":15000,"deut":7500,"energy":"","priceFactor":1.3,"energyFactor":"","baseBonus1":0.1,"factorBonus1":1,"maxBonus1":0.5,"baseBonus2":0.2,"factorBonus2":1,"maxBonus2":0.99,"baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.3,"duration":3500},"13205":{"name":"General Overhaul (Light Fighter)","type":"Tech 5","lifeform":"Mecha","metal":160000,"crystal":120000,"deut":50000,"energy":"","priceFactor":1.5,"energyFactor":"","baseBonus1":0.3,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.4,"duration":4500},"13206":{"name":"Automated Transport Lines","type":"Tech 6","lifeform":"Mecha","metal":50000,"crystal":50000,"deut":20000,"energy":"","priceFactor":1.5,"energyFactor":"","baseBonus1":0.06,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.3,"duration":5000},"13207":{"name":"Improved Drone AI","type":"Tech 7","lifeform":"Mecha","metal":70000,"crystal":40000,"deut":20000,"energy":"","priceFactor":1.3,"energyFactor":"","baseBonus1":0.1,"factorBonus1":1,"maxBonus1":0.5,"baseBonus2":0.2,"factorBonus2":1,"maxBonus2":0.99,"baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.3,"duration":5500},"13208":{"name":"Experimental Recycling Technology","type":"Tech 8","lifeform":"Mecha","metal":160000,"crystal":120000,"deut":50000,"energy":"","priceFactor":1.5,"energyFactor":"","baseBonus1":1,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.4,"duration":6000},"13209":{"name":"General Overhaul (Cruiser)","type":"Tech 9","lifeform":"Mecha","metal":160000,"crystal":120000,"deut":50000,"energy":"","priceFactor":1.5,"energyFactor":"","baseBonus1":0.3,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.4,"duration":6500},"13210":{"name":"Slingshot Autopilot","type":"Tech 10","lifeform":"Mecha","metal":85000,"crystal":40000,"deut":35000,"energy":"","priceFactor":1.2,"energyFactor":"","baseBonus1":0.15,"factorBonus1":1,"maxBonus1":0.9,"baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.3,"duration":7000},"13211":{"name":"High-Temperature Superconductors","type":"Tech 11","lifeform":"Mecha","metal":120000,"crystal":30000,"deut":25000,"energy":"","priceFactor":1.3,"energyFactor":"","baseBonus1":0.1,"factorBonus1":1,"maxBonus1":0.5,"baseBonus2":0.2,"factorBonus2":1,"maxBonus2":0.99,"baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.3,"duration":7500},"13212":{"name":"General Overhaul (Battleship)","type":"Tech 12","lifeform":"Mecha","metal":160000,"crystal":120000,"deut":50000,"energy":"","priceFactor":1.5,"energyFactor":"","baseBonus1":0.3,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.4,"duration":8000},"13213":{"name":"Artificial Swarm Intelligence","type":"Tech 13","lifeform":"Mecha","metal":200000,"crystal":100000,"deut":100000,"energy":"","priceFactor":1.5,"energyFactor":"","baseBonus1":0.06,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.3,"duration":8500},"13214":{"name":"General Overhaul (Battlecruiser)","type":"Tech 14","lifeform":"Mecha","metal":160000,"crystal":120000,"deut":50000,"energy":"","priceFactor":1.5,"energyFactor":"","baseBonus1":0.3,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.4,"duration":9000},"13215":{"name":"General Overhaul (Bomber)","type":"Tech 15","lifeform":"Mecha","metal":320000,"crystal":240000,"deut":100000,"energy":"","priceFactor":1.5,"energyFactor":"","baseBonus1":0.3,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.4,"duration":9500},"13216":{"name":"General Overhaul (Destroyer)","type":"Tech 16","lifeform":"Mecha","metal":320000,"crystal":240000,"deut":100000,"energy":"","priceFactor":1.5,"energyFactor":"","baseBonus1":0.3,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.4,"duration":10000},"13217":{"name":"Experimental Weapons Technology","type":"Tech 17","lifeform":"Mecha","metal":500000,"crystal":300000,"deut":200000,"energy":"","priceFactor":1.5,"energyFactor":"","baseBonus1":0.2,"factorBonus1":1,"maxBonus1":0.5,"baseBonus2":0.2,"factorBonus2":1,"maxBonus2":0.99,"baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.3,"duration":13000},"13218":{"name":"Mechan General Enhancement","type":"Tech 18","lifeform":"Mecha","metal":300000,"crystal":180000,"deut":120000,"energy":"","priceFactor":1.7,"energyFactor":"","baseBonus1":0.2,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.4,"duration":11000},"14101":{"name":"Sanctuary","type":"Building","lifeform":"Kaelesh","metal":4,"crystal":3,"deut":0,"energy":"","priceFactor":1.21,"energyFactor":"","baseBonus1":250,"factorBonus1":1.21,"maxBonus1":"","baseBonus2":16,"factorBonus2":1.2,"maxBonus2":"","baseBonus3":11,"factorBonus3":1.15,"maxBonus3":"","durationFactor":1.22,"duration":40},"14102":{"name":"Antimatter Condenser","type":"Building","lifeform":"Kaelesh","metal":6,"crystal":3,"deut":0,"energy":9,"priceFactor":1.21,"energyFactor":1.02,"baseBonus1":12,"factorBonus1":1.15,"maxBonus1":"","baseBonus2":12,"factorBonus2":1.14,"maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.22,"duration":40},"14103":{"name":"Vortex Chamber","type":"Building","lifeform":"Kaelesh","metal":20000,"crystal":20000,"deut":30000,"energy":10,"priceFactor":1.3,"energyFactor":1.08,"baseBonus1":0.25,"factorBonus1":1,"maxBonus1":0.25,"baseBonus2":2,"factorBonus2":1,"maxBonus2":0.99,"baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.25,"duration":16000},"14104":{"name":"Halls of Realisation","type":"Building","lifeform":"Kaelesh","metal":7500,"crystal":5000,"deut":800,"energy":15,"priceFactor":1.8,"energyFactor":1.3,"baseBonus1":30000000,"factorBonus1":1.1,"maxBonus1":"","baseBonus2":1,"factorBonus2":1,"maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.7,"duration":16000},"14105":{"name":"Forum of Transcendence","type":"Building","lifeform":"Kaelesh","metal":60000,"crystal":30000,"deut":50000,"energy":30,"priceFactor":1.8,"energyFactor":1.3,"baseBonus1":100000000,"factorBonus1":1.1,"maxBonus1":"","baseBonus2":1,"factorBonus2":1,"maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.8,"duration":64000},"14106":{"name":"Antimatter Convector","type":"Building","lifeform":"Kaelesh","metal":8500,"crystal":5000,"deut":3000,"energy":"","priceFactor":1.25,"energyFactor":"","baseBonus1":1,"factorBonus1":1,"maxBonus1":0.5,"baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.35,"duration":2000},"14107":{"name":"Cloning Laboratory","type":"Building","lifeform":"Kaelesh","metal":15000,"crystal":15000,"deut":20000,"energy":"","priceFactor":1.2,"energyFactor":"","baseBonus1":2,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.2,"duration":12000},"14108":{"name":"Chrysalis Accelerator","type":"Building","lifeform":"Kaelesh","metal":75000,"crystal":25000,"deut":30000,"energy":30,"priceFactor":1.05,"energyFactor":1.03,"baseBonus1":2,"factorBonus1":1,"maxBonus1":"","baseBonus2":6,"factorBonus2":1,"maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.18,"duration":16000},"14109":{"name":"Bio Modifier","type":"Building","lifeform":"Kaelesh","metal":87500,"crystal":25000,"deut":30000,"energy":40,"priceFactor":1.2,"energyFactor":1.02,"baseBonus1":200,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.2,"duration":40000},"14110":{"name":"Psionic Modulator","type":"Building","lifeform":"Kaelesh","metal":150000,"crystal":30000,"deut":30000,"energy":140,"priceFactor":1.5,"energyFactor":1.05,"baseBonus1":1,"factorBonus1":1,"maxBonus1":0.25,"baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.8,"duration":52000},"14111":{"name":"Ship Manufacturing Hall","type":"Building","lifeform":"Kaelesh","metal":75000,"crystal":50000,"deut":55000,"energy":90,"priceFactor":1.2,"energyFactor":1.04,"baseBonus1":1.5,"factorBonus1":1,"maxBonus1":0.7,"baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.3,"duration":90000},"14112":{"name":"Supra Refractor","type":"Building","lifeform":"Kaelesh","metal":500000,"crystal":250000,"deut":250000,"energy":100,"priceFactor":1.4,"energyFactor":1.05,"baseBonus1":0.5,"factorBonus1":1,"maxBonus1":0.3,"baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.3,"duration":95000},"14201":{"name":"Heat Recovery","type":"Tech 1","lifeform":"Kaelesh","metal":10000,"crystal":6000,"deut":1000,"energy":"","priceFactor":1.5,"energyFactor":"","baseBonus1":0.03,"factorBonus1":1,"maxBonus1":0.3,"baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.4,"duration":1000},"14202":{"name":"Sulphide Process","type":"Tech 2","lifeform":"Kaelesh","metal":7500,"crystal":12500,"deut":5000,"energy":"","priceFactor":1.5,"energyFactor":"","baseBonus1":0.08,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.3,"duration":2000},"14203":{"name":"Psionic Network","type":"Tech 3","lifeform":"Kaelesh","metal":15000,"crystal":10000,"deut":5000,"energy":"","priceFactor":1.5,"energyFactor":"","baseBonus1":0.05,"factorBonus1":1,"maxBonus1":0.5,"baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.4,"duration":2500},"14204":{"name":"Telekinetic Tractor Beam","type":"Tech 4","lifeform":"Kaelesh","metal":20000,"crystal":15000,"deut":7500,"energy":"","priceFactor":1.5,"energyFactor":"","baseBonus1":0.2,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.4,"duration":3500},"14205":{"name":"Enhanced Sensor Technology","type":"Tech 5","lifeform":"Kaelesh","metal":25000,"crystal":20000,"deut":10000,"energy":"","priceFactor":1.5,"energyFactor":"","baseBonus1":0.2,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.4,"duration":4500},"14206":{"name":"Neuromodal Compressor","type":"Tech 6","lifeform":"Kaelesh","metal":50000,"crystal":50000,"deut":20000,"energy":"","priceFactor":1.3,"energyFactor":"","baseBonus1":0.4,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.4,"duration":5000},"14207":{"name":"Neuro-Interface","type":"Tech 7","lifeform":"Kaelesh","metal":70000,"crystal":40000,"deut":20000,"energy":"","priceFactor":1.5,"energyFactor":"","baseBonus1":0.1,"factorBonus1":1,"maxBonus1":0.99,"baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.3,"duration":5500},"14208":{"name":"Interplanetary Analysis Network","type":"Tech 8","lifeform":"Kaelesh","metal":80000,"crystal":50000,"deut":20000,"energy":"","priceFactor":1.2,"energyFactor":"","baseBonus1":0.6,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.2,"duration":6000},"14209":{"name":"Overclocking (Heavy Fighter)","type":"Tech 9","lifeform":"Kaelesh","metal":320000,"crystal":240000,"deut":100000,"energy":"","priceFactor":1.5,"energyFactor":"","baseBonus1":0.3,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.4,"duration":6500},"14210":{"name":"Telekinetic Drive","type":"Tech 10","lifeform":"Kaelesh","metal":85000,"crystal":40000,"deut":35000,"energy":"","priceFactor":1.2,"energyFactor":"","baseBonus1":0.1,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.2,"duration":7000},"14211":{"name":"Sixth Sense","type":"Tech 11","lifeform":"Kaelesh","metal":120000,"crystal":30000,"deut":25000,"energy":"","priceFactor":1.5,"energyFactor":"","baseBonus1":0.2,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.4,"duration":7500},"14212":{"name":"Psychoharmoniser","type":"Tech 12","lifeform":"Kaelesh","metal":100000,"crystal":40000,"deut":30000,"energy":"","priceFactor":1.5,"energyFactor":"","baseBonus1":0.06,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.3,"duration":8000},"14213":{"name":"Efficient Swarm Intelligence","type":"Tech 13","lifeform":"Kaelesh","metal":200000,"crystal":100000,"deut":100000,"energy":"","priceFactor":1.5,"energyFactor":"","baseBonus1":0.1,"factorBonus1":1,"maxBonus1":0.99,"baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.3,"duration":8500},"14214":{"name":"Overclocking (Large Cargo)","type":"Tech 14","lifeform":"Kaelesh","metal":160000,"crystal":120000,"deut":50000,"energy":"","priceFactor":1.5,"energyFactor":"","baseBonus1":1,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.4,"duration":9000},"14215":{"name":"Gravitation Sensors","type":"Tech 15","lifeform":"Kaelesh","metal":240000,"crystal":120000,"deut":120000,"energy":"","priceFactor":1.5,"energyFactor":"","baseBonus1":0.1,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.4,"duration":9500},"14216":{"name":"Overclocking (Battleship)","type":"Tech 16","lifeform":"Kaelesh","metal":320000,"crystal":240000,"deut":100000,"energy":"","priceFactor":1.5,"energyFactor":"","baseBonus1":0.3,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.4,"duration":10000},"14217":{"name":"Psionic Shield Matrix","type":"Tech 17","lifeform":"Kaelesh","metal":500000,"crystal":300000,"deut":200000,"energy":"","priceFactor":1.5,"energyFactor":"","baseBonus1":0.2,"factorBonus1":1,"maxBonus1":0.5,"baseBonus2":0.2,"factorBonus2":1,"maxBonus2":0.99,"baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.3,"duration":13000},"14218":{"name":"Kaelesh Discoverer Enhancement","type":"Tech 18","lifeform":"Kaelesh","metal":300000,"crystal":180000,"deut":120000,"energy":"","priceFactor":1.7,"energyFactor":"","baseBonus1":0.2,"factorBonus1":1,"maxBonus1":"","baseBonus2":"","factorBonus2":"","maxBonus2":"","baseBonus3":"","factorBonus3":"","maxBonus3":"","durationFactor":1.4,"duration":11000}
        }

        return tech[parseInt(id)];
    }
}

class Util
{
    static importToPTRE(apiKey, ogl)
    {
        Util.getJSON(`https://ptre.chez.gg/scripts/oglight_import.php?tool=oglight&team_key=${ogl.ptre}&sr_id=${apiKey}`, result =>
        {
            fadeBox(result.message_verbose, result.code != 1);
        });
    }

    static genTrashsimLink(apiKey, ogl)
    {
        let coords = ogl.current.coords;

        let jsonTechs = {"0":
        [{
            planet:
            {
                galaxy:coords[0],
                system:coords[1],
                position:coords[2],
            },
            class: ogl.account.class,
            characterClassesEnabled: true,
            "research": {}
        }]};

        for(let [key, value] of Object.entries(ogl.db.me.techs))
        {
            jsonTechs[0][0].research[key] = {"level":value};
        }

        jsonTechs = btoa(JSON.stringify(jsonTechs));
        let lang = ogl.universe.lang == 'us' ? 'en' : ogl.universe.lang == 'ar' ? 'es' : ogl.universe.lang;

        return 'https://trashsim.universeview.be/' + lang + '?SR_KEY=' + apiKey + '#prefill=' + jsonTechs;
    }

    static getXML(url, callback)
    {
        let cancelController = new AbortController();
        let signal = cancelController.signal;

        fetch(url, {signal:signal})
        .then(response => response.text())
        .then(data =>
        {
            let xml = new DOMParser().parseFromString(data, 'text/html');
            callback(xml);
        })
        .catch(error => console.log(`Failed to fetch ${url} : ${error}`));

        //window.addEventListener('beforeunload', () => cancelController.abort());
    }

    static getJSON(url, callback)
    {
        let cancelController = new AbortController();
        let signal = cancelController.signal;

        fetch(url, {signal:signal})
        .then(response => response.json())
        .then(data => callback(data))
        .catch(error => console.log(`Failed to fetch ${url} : ${error}`));

        //window.addEventListener('beforeunload', () => cancelController.abort());
    }

    static getRaw(url, callback)
    {
        let cancelController = new AbortController();
        let signal = cancelController.signal;

        fetch(url, {method:'get', signal:signal, headers:{'Accept':'application/json'}})
        .then(response => response.text())
        .then(data => callback(data))
        .catch(error => console.log(`Failed to fetch ${url} : ${error}`));

        //window.addEventListener('beforeunload', () => cancelController.abort());
    }

    static createDom(element, params, content)
    {
        params = params || {};
        content = content ?? '';

        let dom = document.createElement(element);
        Object.entries(params).forEach(p => dom.setAttribute(p[0], p[1]));
        dom.innerHTML = content;

        return dom;
    }

    static updateCheckIntInput(callback)
    {
        let old = checkIntInput;

        checkIntInput = function(id, minVal, maxVal)
        {
            old.call(window, id, minVal, maxVal);
            callback();
        }
    }

    static formatToUnits(value, forced, offset)
    {
        if(!value) return 0;

        value = value.toString().replace(/[\,\. ]/g, '');

        if(isNaN(value)) return value;

        let precision = 0;

        value = parseInt(value);

        if(value == 0 || forced == 0 || value < 1000) precision = 0;
        else if(value < 1000000 || forced == 1) precision = 1;
        else precision = 2;

        // const abbrev = ['', LocalizationStrings.unitKilo, LocalizationStrings.unitMega, LocalizationStrings.unitMilliard];
        const abbrev = ['', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
		const unrangifiedOrder = Math.floor(Math.log10(Math.abs(value)) / 3);
		const order = Math.max(0, Math.min(unrangifiedOrder, abbrev.length-1));
        const suffix = abbrev[order];

        let result = (value / Math.pow(10, order * 3)).toFixed(precision);

        /*if(offset)
        {
            result = `<span style="font-size:${Math.max(10 + Math.floor((order-1) * 1.5), 10)}px;">${result} ${suffix}</span>`;
        }
        else
        {
            result = suffix ? result + ' ' + suffix : result;
        }*/

        return suffix ? result + ' ' + suffix : result;
    }

    static formatFromUnits(value)
    {
        if( ! value || value === '?') return 0;
        let offset = (value.split(LocalizationStrings.thousandSeperator).length - 1) * 3;

        if(LocalizationStrings.thousandSeperator == LocalizationStrings.decimalPoint) offset = 0;

        let splitted = value.match(/\d+/g)[0].length;
        //let splitted = value.split(/[\,\.]/g)[0].length;
        //if(value.match(/\d+/g) && value.match(/\d+/g).map(Number).length == 1) splitted -= 1;

        if(value.indexOf(LocalizationStrings.unitMilliard) > -1)
        {
            //let padEnd = value.indexOf(LocalizationStrings.thousandSeperator) > -1 ? 12 : 9;
            value = value.replace(LocalizationStrings.unitMilliard, '');
            value = value.replace(/[\,\. ]/g, '');
            value = value.padEnd(9 + offset + splitted, '0');
        }
        else if(value.indexOf(LocalizationStrings.unitMega) > -1)
        {
            value = value.replace(LocalizationStrings.unitMega, '');
            value = value.replace(/[\,\. ]/g, '');
            value = value.padEnd(6 + offset + splitted, '0');
        }
        else if(value.indexOf(LocalizationStrings.unitKilo) > -1)
        {
            value = value.replace(LocalizationStrings.unitKilo, '');
            value = value.replace(/[\,\. ]/g, '');
            value = value.padEnd(3 + offset + splitted, '0');
        }
        else
        {
            value = value.replace(/[\,\. ]/g, '');
        }

        return parseInt(value);
    }

    static formatNumber(number)
    {
        return (number || '0').toLocaleString('de-DE');
    }

    static findObjectByValue(object, value)
    {
        return Object.keys(object).find(key => object[key] === value);
    }

    static logPtre(data, params)
    {
        params = params || { galaxy:0, system:0, id:0 };

        let source = params.galaxy && params.system ? `${params.galaxy}:${params.system}` : `#${params.playerID}`;

        let div = document.querySelector('.ogl_ptreLogs') || (document.querySelector('#middle') || document.querySelector('#highscoreContent')).appendChild(Util.createDom('div', {'class':'ogl_ptreLogs'}, '<h3>PTRE Logs :</h3>'));
        div.appendChild(Util.createDom('div', {}, `<span>${new Date(Date.now()).toLocaleTimeString('fr-FR')}</span> ➜ ${data.message} <b>[${source}]</b>`));

        if(div.querySelectorAll('div').length > 5)  div.querySelectorAll('div')[0].remove();
    }

    static takeScreenshot(element, button, name)
    {
        if(typeof html2canvas === 'undefined')
        {
            Util.getRaw('https://cdn.jsdelivr.net/npm/html2canvas@1.0.0-rc.5/dist/html2canvas.min.js', result =>
            {
                document.head.appendChild(Util.createDom('script', {'type':'text/javascript'}, result));
                Util.takeScreenshot(element, button, name);
            })
        }
        else
        {
            html2canvas(element, {backgroundColor:'#151f28'}).then(canvas =>
            {
                const dataURL = canvas.toDataURL();
                const link = Util.createDom('a', {'download':name, 'href':dataURL});
                link.click();

                button.innerHTML = '<i class="material-icons">file_download</i>Download (.jpg)';
                button.classList.remove('ogl_disabled');
            });
        }
    }

    static redirect(url, ogl)
    {
        if(ogl) ogl.component.popup.load(true);
        setTimeout(() => window.location.href = url, 200);
    }
}

class MessageManager
{
    constructor(ogl)
    {
        this.ogl = ogl;
        this.spyTable;
        this.dataList = [];
        this.tableReady = false;
        this.reportList = [];
        this.trashQueue = [];

        if(this.ogl.page == 'messages')
        {
            // check reports tab
            this.ogl.observeMutation(() => this.checkCurrentTab(), 'tablereport');

            // check opened message
            this.ogl.observeMutation(() =>
            {
                let detail = document.querySelector('.detail_msg');

                if(detail && detail.getAttribute('data-message-type') == 10 && !detail.classList.contains('ogl_detailReady'))
                {
                    detail.classList.add('ogl_detailReady');

                    let apiKey = Util.createDom('div', {});
                    //apiKey.innerHTML = detail.querySelector('.icon_apikey').getAttribute('data-tooltip') || detail.querySelector('.icon_apikey').getAttribute('title');
                    apiKey.innerHTML = detail.querySelector('.icon_apikey').getAttribute('title');
                    apiKey = apiKey.querySelector('input').value;

                    let simButton = detail.querySelector('.msg_actions').appendChild(Util.createDom('div', {'class':'icon_nf ogl_sim'}, 'S'));
                    simButton.addEventListener('click', () => window.open(Util.genTrashsimLink(apiKey, this.ogl), '_blank'));

                    if(this.ogl.ptre)
                    {
                        let ptreButton = detail.querySelector('.msg_actions').appendChild(Util.createDom('div', {'class':'icon_nf ogl_sim tooltip', 'title':'import to PTRE'}, 'P'));
                        ptreButton.addEventListener('click', () => Util.importToPTRE(apiKey, this.ogl));
                    }
                }
            }, 'simbutton');

            this.ogl.performances.push(['Message',performance.now()]);
        }
    }

    checkCurrentTab()
    {
        this.trashQueueProcessing = false;
        this.trashQueue = [];
        if(document.querySelectorAll('.msg').length < 1) return;

        let tokenInterval = setInterval(() =>
        {
            this.tokenInput = document.querySelectorAll('[name="token"]')[0];
            if(!this.tokenInput) return;

            clearInterval(tokenInterval);

            let self = this;

            const { get, set } = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');

            try
            {
                Object.defineProperty(this.tokenInput, "value",
                {
                    get() { return get.call(this); },
                    set(newVal)
                    {
                        setTimeout(() =>
                        {
                            if(self.trashQueue.length > 0 && !self.trashQueueProcessing)
                            {
                                self.trashQueueProcessing = true;

                                let id = self.trashQueue[0];
                                let buttonSelector = document.querySelector(`[data-msg-id="${id}"] .js_actionKill`);

                                if(buttonSelector && !buttonSelector.classList.contains('ogl_noPointer'))
                                {
                                    buttonSelector.click();

                                    let line = self.spyTable?.querySelector(`[data-spy-id="${id}"]`);
                                    if(line)
                                    {
                                        if(line.nextSibling?.tagName == 'ASIDE') line.nextSibling.remove();

                                        self.sum = self.sum || 0;
                                        self.sum -= parseInt(line.getAttribute('data-renta'));

                                        self.sumDetail = self.sumDetail || [0, 0, 0];
                                        self.sumDetail[0] -= parseInt(line.getAttribute('data-metal'));
                                        self.sumDetail[1] -= parseInt(line.getAttribute('data-crystal'));
                                        self.sumDetail[2] -= parseInt(line.getAttribute('data-deut'));

                                        self.calcTotal(self.sum, self.sumDetail, self.sumDetail[0] + self.sumDetail[1] + self.sumDetail[2]);
                                        line.remove();

                                        const isValid = e => e.id == id;

                                        for(let i=0, len=self.dataList.length; i<len; i++)
                                        {
                                            let item = self.dataList[i];
                                            if(isValid(item))
                                            {
                                                self.dataList.splice(i, 1);
                                                break;
                                            }
                                        }
                                    }
                                }
                                else this.value = newVal;

                                self.tokenReady = true;
                                self.trashQueue.shift();
                            }
                            else self.trashQueueProcessing = false;
                        }, 50);

                        return set.call(this, newVal);
                    }
                });

                if(this.trashQueue.length > 0) this.tokenInput.value = this.tokenInput.value;
            }
            catch(e) {};

        }, 100);

        let tabID = ogame.messages.getCurrentMessageTab();

        if(tabID == 21) this.checkRaid();
        else if(tabID == 22) this.checkExpeditions();
        else if(tabID == 23) this.checkTransports();
        else if(tabID == 24) this.checkDebris();
        else if(tabID == 25) this.checkTrash();
        else if(tabID == 20) this.checkReports();

        if(this.spyTable)
        {
            if(tabID == 20)
            {
                this.spyTable.classList.remove('ogl_hidden');
                document.querySelector('#subtabs-nfFleetTrash .ogl_trash') && document.querySelector('#subtabs-nfFleetTrash .ogl_trash').classList.remove('ogl_hidden');
            }
            else
            {
                this.spyTable.classList.add('ogl_hidden');
                document.querySelector('#subtabs-nfFleetTrash .ogl_trash') && document.querySelector('#subtabs-nfFleetTrash .ogl_trash').classList.add('ogl_hidden');
            }
        }
    }

    checkTrash()
    {
        this.reviveReady = true;

        // ogame bug fix
        document.querySelectorAll('.msg .js_actionRevive').forEach(button =>
        {
            button.classList.remove('js_actionRevive');
            button.addEventListener('click', () =>
            {
                if(!this.reviveReady)
                {
                    setTimeout(() => button.click(), 150);
                    return;
                }

                let msg = button.closest('.msg');
                let id = msg.getAttribute('data-msg-id');
                let tokenMsg = document.querySelectorAll('[name="token"]')[0].getAttribute('value');

                this.reviveReady = false;

                $.ajax(
                {
                    type:'POST',
                    url:'?page=messages',
                    dataType:'json',
                    data:
                    {
                        ajax:1,
                        token:tokenMsg,
                        messageId:id,
                        action:104
                    }
                }).done(result =>
                {
                    if(result[id] == true && result.newAjaxToken)
                    {
                        msg.remove();
                        document.querySelectorAll('[name="token"]').forEach(e => e.setAttribute('value', result.newAjaxToken));
                        ogame.messages.token = result.newAjaxToken;

                        this.reviveReady = true;
                    }
                }).fail(result =>
                {
                    console.log('bug, please refresh');
                    this.reviveReady = true;
                });
            });
        });
    }

    checkRaid()
    {
        let messages = document.querySelectorAll('#ui-id-2 div[aria-hidden="false"] .msg:not(.ogl_raidDone)');

        if(messages.length > 0 && messages.length != document.querySelectorAll('#ui-id-2 div[aria-hidden="false"] .msg:not(.ogl_raidDone) .msg_date.ogl_timeZone').length)
        {
            setTimeout(() => this.checkRaid(), 100);
            return;
        }

        let urls = [];

        this.ogl.cache.msg = this.ogl.cache.msg || {};

        messages.forEach((message, index) =>
        {
            let content = message.querySelector('.msg_content');

            if(!message.querySelector('.ogl_timeZone')) return;
            message.classList.add('ogl_raidDone');
            if(!content.querySelector('.msg_ctn2')) return;

            if(document.querySelector('#subtabs-nfFleetTrash.ui-state-active')) return;

            let id = message.getAttribute('data-msg-id');

            if(this.ogl.cache.msg[id]) this.loadRaidMessages(id);
            else
            {
                console.log('fetch')
                let groupID = Math.floor(index / 15) * 10;

                urls[groupID] = urls[groupID] || [];
                urls[groupID].push(`https://${window.location.host}/game/index.php?page=messages&messageId=${id}&tabid=21&ajax=1`);
            }
        });

        urls.forEach((group, index) =>
        {
            setTimeout(() =>
            {
                Promise.all(group.map(url =>
                fetch(url).then(response => { if(response.status == 503) { throw Error(response.status) } else return response.text() }).catch(err => { const mute = err })))
                .then(texts =>
                {
                    texts.forEach(data =>
                    {
                        let result = new DOMParser().parseFromString(data, 'text/html');

                        if(!result.querySelector('.detail_msg'))
                        {
                            console.error("Can't fetch combat report : server data error | " + data);
                            return;
                        }

                        let id = result.querySelector('.detail_msg').getAttribute('data-msg-id');
                        let message = document.querySelector(`.msg[data-msg-id="${id}"]`);

                        if(!message.querySelector('.msg_date'))
                        {
                            console.error("Can't fetch combat report : message date error | " + data);
                            return;
                        }

                        let htmlReport = result.getElementsByClassName('detail_msg')[0].innerHTML;
                        let json = JSON.parse(htmlReport.substring((htmlReport.search("var combatData") + 35),(htmlReport.search("var attackerJson") - 12)));

                        this.ogl.cache.msg[id] = json;

                        this.loadRaidMessages(id);
                    });

                    // this.ogl.saveAsync();
                    this.ogl.component.empire.addStats();
                })
                .catch(error => console.log(`Failed to fetch combat report : ${error}`));
            }, index * 150);
        });
    }

    loadRaidMessages(id)
    {
        let report = {};
        let json = this.ogl.cache.msg[id];
        let message = document.querySelector(`.msg[data-msg-id="${id}"]`);
        let date = new Date(parseInt(message.querySelector('.msg_date').getAttribute('data-servertime')));
        let midnight = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0).getTime();

        let loot = { metal:json.loot.metal, crystal:json.loot.crystal, deut:json.loot.deuterium, food:json.loot.food };
        let renta = { metal:0, crystal:0, deut:0, food:0 };
        let loss = { metal:0, crystal:0, deut:0, food:0 };

        /*let loot = [json.loot.metal, json.loot.crystal, json.loot.deuterium];
        let renta = [0,0,0];
        let loss = [0,0,0];*/

        let fleetID = [];
        let leftSide = false;
        let probesOnly = false;

        Object.values(json.attackerJSON.member).forEach(v => { if(v && v.ownerID == this.ogl.account.id) fleetID.push(v.fleetID) });
        if(fleetID.length > 0) leftSide = true;

        Object.values(json.defenderJSON.member).forEach(v => { if(v && v.ownerID == this.ogl.account.id) fleetID.push(v.fleetID) });

        let atkRounds = json.attackerJSON.combatRounds;
        let defRounds = json.defenderJSON.combatRounds;

        fleetID.forEach(fleet =>
        {
            if(Object.values(atkRounds[0].ships).length == 1 && Object.values(atkRounds[0].ships)[0]?.[210]) probesOnly = true;

            // def
            if(defRounds[defRounds.length-1].losses && defRounds[defRounds.length-1].losses[fleet])
            {
                for(let [k,v] of Object.entries(defRounds[defRounds.length-1].losses[fleet]))
                {
                    let shipData = Datafinder.getTech(k);
                    Object.keys(shipData).forEach(x => loss[x] = (loss[x] || 0) + shipData[x] * v);
                }
            }

            // atk
            if(atkRounds[atkRounds.length-1].losses && atkRounds[atkRounds.length-1].losses[fleet])
            {
                for(let [k,v] of Object.entries(atkRounds[atkRounds.length-1].losses[fleet]))
                {
                    let shipData = Datafinder.getTech(k);
                    Object.keys(shipData).forEach(x => loss[x] = (loss[x] || 0) + shipData[x] * v);
                }
            }
        });

        // repaired
        if(json.defender[0] && json.defender[0].ownerID == this.ogl.account.id)
        {
            for(let [k,v] of Object.entries(json.repairedDefense))
            {
                let shipData = Datafinder.getTech(k);
                Object.keys(shipData).forEach(x => loss[x] = (loss[x] || 0) - shipData[x] * v);
            }
        }

        if(leftSide) Object.keys(loss).forEach(x => renta[x] = (renta[x] || 0) - loss[x] + loot[x]);
        else Object.keys(loss).forEach(x => renta[x] = (renta[x] || 0) - loss[x] - loot[x]);

        let line = Util.createDom('div', {'class':'ogl_expeResult'});
        Object.keys(renta).forEach(r =>
        {
            report[r] = renta[r];
            line.appendChild(Util.createDom('div', {'class':`ogl_${r}`}, Util.formatToUnits(renta[r] || '0')));
        });

        message.prepend(line);

        let target = json.coordinates.position == 16 ? 'expe' : 'raid';

        this.ogl.db.stats[midnight] = this.ogl.db.stats[midnight] || { idList:[], expe:{}, raid:{}, expeOccurences:{}, raidOccurences:0, consumption:0 };
        this.ogl.db.stats.ignored = this.ogl.db.stats.ignored || {};
        this.ogl.db.stats.total = this.ogl.db.stats.total || {};
        this.ogl.db.stats.total.expeOccurences = this.ogl.db.stats.total.expeOccurences || {};
        this.ogl.db.stats.total.raidOccurences = this.ogl.db.stats.total.raidOccurences || 0;

        let newEntry = !this.ogl.db.stats[midnight].idList.includes(id) && !this.ogl.db.stats.ignored[id];
        //let totalRenta = renta.reduce((sum, x) => sum + x);

        let saveReport = () =>
        {
            this.ogl.db.stats.total[target] = this.ogl.db.stats.total[target] || {};

            if(!this.ogl.db.stats[midnight].idList.includes(id) && !this.ogl.db.stats.ignored[id])
            {
                this.ogl.db.stats[midnight].idList.push(id);

                for(let [k,v] of Object.entries(report))
                {
                    this.ogl.db.stats[midnight][target][k] = (this.ogl.db.stats[midnight][target][k] || 0) + v;
                    this.ogl.db.stats.total[target][k] = (this.ogl.db.stats.total[target][k] || 0) + v;
                }

                if(target == 'expe')
                {
                    this.ogl.db.stats[midnight].expeOccurences['fight'] = (this.ogl.db.stats[midnight].expeOccurences['fight'] || 0) + 1;
                    this.ogl.db.stats.total.expeOccurences['fight'] = (this.ogl.db.stats.total.expeOccurences['fight'] || 0) + 1;

                    this.ogl.db.stats[midnight].expeOccurences['none'] = (this.ogl.db.stats[midnight].expeOccurences['none'] || 0) - 1;
                    this.ogl.db.stats.total.expeOccurences['none'] = (this.ogl.db.stats.total.expeOccurences['none'] || 0) - 1;
                }
                else
                {
                    this.ogl.db.stats[midnight].raidOccurences = (this.ogl.db.stats[midnight].raidOccurences || 0) + 1;
                    this.ogl.db.stats.total.raidOccurences = (this.ogl.db.stats.total.raidOccurences || 0) + 1;
                }
            }
        }

        let deleteReport = () =>
        {
            if(target == 'raid')
            {
                this.ogl.db.stats.total[target] = this.ogl.db.stats.total[target] || {};

                this.ogl.db.stats[midnight].raidOccurences = (this.ogl.db.stats[midnight].raidOccurences || 0) - 1;
                this.ogl.db.stats.total.raidOccurences = (this.ogl.db.stats.total.raidOccurences || 0) - 1;
            }
        }

        saveReport();

        // ignore button
        if(target == 'raid')
        {
            let ignore = line.appendChild(Util.createDom('div', {'class':'ogl_button ogl_ignoreRaid material-icons tooltip', 'title':this.ogl.component.lang.getText('ignoreRaid')}));
            if(this.ogl.db.stats.ignored[id]) ignore.classList.add('ogl_active');
            ignore.addEventListener('click', () =>
            {
                if(this.ogl.db.stats.ignored[id])
                {
                    delete this.ogl.db.stats.ignored[id];
                    ignore.classList.remove('ogl_active');
                }
                else
                {
                    ignore.classList.add('ogl_active');
                    let index = this.ogl.db.stats[midnight].idList.indexOf(id);
                    this.ogl.db.stats.ignored[id] = serverTime.getTime();

                    this.ogl.db.stats[midnight].idList.splice(index, 1);
                    deleteReport();

                    for(let [k,v] of Object.entries(report))
                    {
                        this.ogl.db.stats[midnight][target][k] = (this.ogl.db.stats[midnight][target][k] || 0) - v;
                        this.ogl.db.stats.total[target][k] = (this.ogl.db.stats.total[target][k] || 0) - v;
                    }
                }

                saveReport();
                // this.ogl.saveAsync();
                this.ogl.component.empire.addStats();
            });

            // ignore spies fights
            if(newEntry && probesOnly && !this.ogl.db.ships[210]?.capacity) ignore.click();
        }
    }

    checkExpeditions()
    {
        let messages = document.querySelectorAll('#ui-id-2 div[aria-hidden="false"] .msg:not(.ogl_expeditionDone)');

        if(messages.length > 0 && messages.length != document.querySelectorAll('#ui-id-2 div[aria-hidden="false"] .msg:not(.ogl_expeditionDone) .msg_date.ogl_timeZone').length)
        {
            setTimeout(() => this.checkExpeditions(), 100);
            return;
        }

        this.messagePending = [];

        messages.forEach((message, messageIndex) =>
        {
            if(!message.querySelector('.ogl_timeZone')) return;
            message.classList.add('ogl_expeditionDone');

            if(document.querySelector('#subtabs-nfFleetTrash.ui-state-active')) return;

            if(message.querySelector('.msg_title a').textContent.indexOf(':16]') == -1) return;

            setTimeout(() =>
            {
                let id = message.getAttribute('data-msg-id');
                let date = new Date(parseInt(message.querySelector('.msg_date').getAttribute('data-servertime')));
                let midnight = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0).getTime();
                let type = 'none';
                let typeList = ['metal','crystal','deut','dm',202,203,204,205,206,207,208,209,210,211,213,214,215,217,218,219];

                this.messagePending.push(id);

                let result = {};

                typeList.forEach(typeID =>
                {
                    if(message.textContent.indexOf(this.ogl.component.lang.getText(typeID)) > -1)
                    {
                        if(!isNaN(typeID)) type = 'ships';
                        else if(typeID == 'metal' || typeID == 'crystal' || typeID == 'deut') type = 'resources';
                        else if(typeID == 'dm') type = 'dm';
                        result[typeID] = this.getExpeValue(this.ogl.component.lang.getText(typeID), message);
                    }

                    if(result[typeID] == -1)
                    {
                        type = 'none';
                        delete result[typeID];
                    }
                });

                if(message.querySelector('a.itemLink'))
                {
                    type = 'item';
                    result.item = 1;
                }

                message.querySelector('.msg_content').prepend(Util.createDom('div', {'class':'ogl_expeResult'}, type.replace('none', '-')));

                this.ogl.db.stats[midnight] = this.ogl.db.stats[midnight] || { idList:[], expe:{}, raid:{}, expeOccurences:{}, raidOccurences:0, consumption:0 };

                if(this.ogl.db.stats[midnight].idList.indexOf(id) == -1)
                {
                    this.ogl.db.stats[midnight].idList.push(id);
                    this.ogl.db.stats.total.expe = this.ogl.db.stats.total.expe || {};
                    this.ogl.db.stats.total.expeOccurences = this.ogl.db.stats.total.expeOccurences || {};

                    for(let [k,v] of Object.entries(result))
                    {
                        this.ogl.db.stats[midnight].expe[k] = (this.ogl.db.stats[midnight].expe[k] || 0) + v;
                        this.ogl.db.stats.total.expe[k] = (this.ogl.db.stats.total?.expe?.[k] || 0) + v;
                    }

                    this.ogl.db.stats[midnight].expeOccurences[type] = (this.ogl.db.stats[midnight].expeOccurences[type] || 0) + 1;
                    this.ogl.db.stats.total.expeOccurences[type] = (this.ogl.db.stats.total.expeOccurences[type] || 0) + 1;
                }

                if(this.messagePending.length == messages.length)
                {
                    // this.ogl.saveAsync();
                    this.ogl.component.empire.addStats();
                }
            }, messageIndex * 5);
        });
    }

    checkDebris()
    {
        let messages = document.querySelectorAll('#ui-id-2 div[aria-hidden="false"] .msg:not(.ogl_debrisDone)');

        if(messages.length > 0 && messages.length != document.querySelectorAll('#ui-id-2 div[aria-hidden="false"] .msg:not(.ogl_debrisDone) .msg_date.ogl_timeZone').length)
        {
            setTimeout(() => this.checkDebris(), 100);
            return;
        }

        messages.forEach(message =>
        {
            if(!message.querySelector('.ogl_timeZone')) return;
            message.classList.add('ogl_debrisDone');

            if(!message.querySelector('.icon_apikey') && message.querySelector('.msg_head').textContent.indexOf(':17]') < 0) return;

            let content = message.querySelector('.msg_content');
            let regex = new RegExp('\\'+LocalizationStrings.thousandSeperator, 'g');

            let id = message.getAttribute('data-msg-id');
            let date = new Date(parseInt(message.querySelector('.msg_date').getAttribute('data-servertime')));
            let midnight = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0).getTime();

            let report = {};

            let numList = content.textContent.replace(regex, '').match(/\d+/g);
            let target = parseInt(numList[numList.length - 3]) == 16 ? 'expe' : 'raid';

            if(!message.querySelector('.icon_apikey'))
            {
                report.dm = parseInt(numList[numList.length - 2]);
                message.prepend(Util.createDom('div', {'class':'ogl_expeResult'}, `Renta: ${report.DM} ${this.ogl.component.lang.getText('DM')}`));
            }
            else
            {
                report.metal = parseInt(numList[numList.length - 3]);
                report.crystal = parseInt(numList[numList.length - 2]);
                report.deut = parseInt(numList[numList.length - 1]);
                message.prepend(Util.createDom('div', {'class':'ogl_expeResult'}, `Renta: ${Util.formatToUnits(report.metal)} | ${Util.formatToUnits(report.crystal)} | ${Util.formatToUnits(report.deut)}`));
            }

            this.ogl.db.stats[midnight] = this.ogl.db.stats[midnight] || { idList:[], expe:{}, raid:{}, expeOccurences:{}, raidOccurences:0, consumption:0 };
            this.ogl.db.stats.total = this.ogl.db.stats.total || {};
            this.ogl.db.stats.total[target] = this.ogl.db.stats.total[target] || {};

            if(this.ogl.db.stats[midnight].idList.indexOf(id) == -1)
            {
                this.ogl.db.stats[midnight].idList.push(id);
                this.ogl.db.stats.total.expe = this.ogl.db.stats.total.expe || {};
                this.ogl.db.stats.total.expeOccurences = this.ogl.db.stats.total.expeOccurences || {};

                for(let [k,v] of Object.entries(report))
                {
                    this.ogl.db.stats[midnight][target][k] = (this.ogl.db.stats[midnight][target][k] || 0) + v;
                    this.ogl.db.stats.total[target][k] = (this.ogl.db.stats.total[target][k] || 0) + v;
                }
            }
        });

        // this.ogl.saveAsync();
        this.ogl.component.empire.addStats();
    }

    checkReports()
    {
        if(document.querySelector('#subtabs-nfFleetTrash.ui-state-active')) return;
        if(this.ogl.db.options.togglesOff.indexOf('spytable') > -1) return;

        this.dataList = [];
        this.reportList = [];
        if(this.spyTable) this.spyTable.remove();

        if(!document.querySelector('#subtabs-nfFleetTrash .ogl_trash'))
        {
            let deleteSpyDef = document.querySelector('#subtabs-nfFleetTrash').appendChild(Util.createDom('div', {'class':'material-icons ogl_button ogl_trash tooltip', 'title':this.ogl.component.lang.getText('deleteSpyDef')}, 'visibility_off'));
            deleteSpyDef.addEventListener('click', () =>
            {
                document.querySelectorAll('.msg').forEach(e =>
                {
                    let id = e.getAttribute('data-msg-id');
                    if(e.querySelector('.espionageDefText') && this.trashQueue.indexOf(id) == -1) this.trashQueue.push(id);
                    if(this.trashQueue.length == 1) this.tokenInput.value = this.tokenInput.value;
                });
            });
        }

        let messages = document.querySelectorAll('#ui-id-2 div[aria-hidden="false"] .msg:not(.ogl_ready)');
        if(messages.length > 0 && messages.length != document.querySelectorAll('#ui-id-2 div[aria-hidden="false"] .msg:not(.ogl_ready) .msg_date.ogl_timeZone').length)
        {
            setTimeout(() => this.checkReports(), 100);
            return;
        }

        let positionsList = this.ogl.getPositionsByCoords();

        if(this.ogl.ptre)
        {
            let ptreJSON = {};

            messages.forEach(report =>
            {
                if(report.querySelector('.espionageDefText'))
                {
                    let id = report.getAttribute('data-msg-id');
                    let tmpHTML = Util.createDom('div', {}, report.querySelector('span.player').getAttribute('title') || report.querySelector('span.player').getAttribute('data-title'));
                    let playerID = tmpHTML.querySelector('[data-playerId]').getAttribute('data-playerId');
                    let a = report.querySelector('.espionageDefText a');
                    let params = new URLSearchParams(a.getAttribute('href'));
                    let coords = [params.get('galaxy') || "0", params.get('system') || "0", params.get('position') || "0"];
                    let type = a.querySelector('figure.moon') ? 3 : 1;
                    let timestamp = report.querySelector('.msg_date.ogl_timeZone').getAttribute('data-servertime');

                    ptreJSON[id] = {};
                    ptreJSON[id].player_id = playerID;
                    ptreJSON[id].teamkey = this.ogl.ptre;
                    ptreJSON[id].galaxy = coords[0];
                    ptreJSON[id].system = coords[1];
                    ptreJSON[id].position = coords[2];
                    ptreJSON[id].spy_message_ts = timestamp;
                    ptreJSON[id].moon = {};

                    if(type == 1)
                    {
                        ptreJSON[id].activity = '*';
                        ptreJSON[id].moon.activity = '60';
                    }
                    else
                    {
                        ptreJSON[id].activity = '60';
                        ptreJSON[id].moon.activity = '*';
                    }
                }
            });

            if(Object.keys(ptreJSON).length > 0)
            {
                fetch('https://ptre.chez.gg/scripts/oglight_import_player_activity.php?tool=oglight', { method:'POST', body:JSON.stringify(ptreJSON) })
                .then(response => response.json())
                .then(data =>
                {
                    if(data.code != 1)
                    {
                        console.log('error', data);
                    }
                    else
                    {
                        Object.keys(ptreJSON).forEach(id =>
                        {
                            document.querySelector(`.msg[data-msg-id="${id}"] .msg_title`).appendChild(Util.createDom('div', {'class':'material-icons ogl_checked tooltipLeft', 'title':'activities imported to PTRE'}, 'check_circle'));
                        });
                    }
                });
            }
        }

        // prevent the user to spam click on the same delete button
        document.querySelectorAll('#ui-id-2 div[aria-hidden="false"] .msg:not(.ogl_ready) .js_actionKill').forEach(button =>
        {
            button.addEventListener('click', () =>  button.classList.add('ogl_noPointer'));
        });

        messages.forEach((report, index) =>
        {
            let id = report.getAttribute('data-msg-id');
            report.classList.add('ogl_ready');
            if(this.reportList.indexOf(id) > -1) return;
            if(report.closest('#fleettrashmessagespage')) return;

            let params = new URLSearchParams(report.querySelector('.msg_head a')?.href);
            let compacting = report.querySelectorAll('.compacting');

            if((compacting.length > 0 && !compacting[3].querySelector('.resspan')) || !report.querySelector('.msg_title a'))
            {
                if(this.trashQueue.indexOf(id) == -1) this.trashQueue.push(id);
            }
            else if(compacting.length > 0 && compacting[3].querySelector('.resspan'))
            {
                this.reportList.push(id);

                let typeList = ['metal','crystal','deut','dm'];

                typeList.forEach(typeID =>
                {
                    let regex = new RegExp(`<span class="resspan">${this.ogl.component.lang.getText(typeID)}:`, 'g');
                    report.querySelector('.msg_content').innerHTML = report.querySelector('.msg_content').innerHTML.replace(regex, `<span class="resspan" data-type="${typeID}"><span>${this.ogl.component.lang.getText(typeID)}:</span>`);
                });

                let data = {};
                data.id = report.getAttribute('data-msg-id');
                data.date = report.querySelector('.msg_date').getAttribute('data-servertime');
                data.clientDate = report.querySelector('.msg_date').getAttribute('data-clienttime');
                data.status = compacting[0].querySelectorAll('span[class^="status"]')[0].className;
                data.name = compacting[0].querySelectorAll('span[class^="status"]')[0].textContent.replace(/&nbsp;/g,'').trim();
                data.coords = [params.get('galaxy') || "0", params.get('system') || "0", params.get('position') || "0"];
                data.tmpCoords = data.coords.map(x => x.padStart(3, '0')).join('');
                data.type = report.querySelector('.msg_head figure.moon') ? 3 : 1;
                //data.color = (this.ogl.db.positions[this.ogl.find(this.ogl.db.positions, 'coords', data.coords.join(':'))] || {}).color;
                data.color = positionsList[data.tmpCoords]?.[0]?.color;
                data.activityColor = compacting[0].querySelectorAll('span.fright')[0].querySelector('font') && compacting[0].querySelectorAll('span.fright')[0].querySelector('font').getAttribute('color');
                data.activity = compacting[0].querySelectorAll('span.fright')[0].textContent ? parseInt(compacting[0].querySelectorAll('span.fright')[0].textContent.match(/\d+/)[0]) : -1;
                data.resources =
                [
                    Util.formatFromUnits(compacting[3].querySelectorAll('.resspan')[0].textContent.replace(/(\D*)/, '')),
                    Util.formatFromUnits(compacting[3].querySelectorAll('.resspan')[1].textContent.replace(/(\D*)/, '')),
                    Util.formatFromUnits(compacting[3].querySelectorAll('.resspan')[2].textContent.replace(/(\D*)/, '')),
                ];
                data.total = data.resources.reduce((sum, x) => sum + x);
                data.loot = parseInt(compacting[4].querySelector('.ctn').textContent.replace(/(\D*)/, '').replace(/%/, '')) / 100;
                data.renta = Math.ceil(data.total * data.loot);

                /* CUSTOM PUMPK1IN
                 * Shitty PUMPK1IN fix because some plugins add more lines so compacting[5] is no more the one containing fleet/defense
                 */

                // data.fleet = compacting[5].querySelectorAll('span').length > 0 ? Util.formatFromUnits(compacting[5].querySelectorAll('span.ctn')[0].textContent.replace(/(\D*)/, '').split(' ')[0]) : -1;
                // data.defense = compacting[5].querySelectorAll('span').length > 1 ? Util.formatFromUnits(compacting[5].querySelectorAll('span.ctn')[1].textContent.replace(/(\D*)/, '').split(' ')[0]) : -1;

                data.fleet = -1; data.defense = -1; // Start with unknown fleet / def
                for (var i = 0; i < compacting.length; i++) {
                    for (const span of compacting[i].querySelectorAll('span.ctn')) {
                        if ( span.textContent.includes('Fl') || span.textContent.includes('στό') ) {
                            data.fleet = Util.formatFromUnits(span.textContent.replace(/(\D*)/, '').split(' ')[0]);
                            //console.log(data.coords + ' found fleet: ' + data.fleet);
                        }
                        if ( span.textContent.includes('Déf') || span.textContent.includes('Def') || span.textContent.includes('άμυ') ) {
                            data.defense = Util.formatFromUnits(span.textContent.replace(/(\D*)/, '').split(' ')[0]);
                            //console.log(data.coords + ' found defense: ' + data.defense);
                        }
                    }
                }

                /* END CUSTOM PUMPK1IN */

                data.attacked = report.querySelector('.msg_actions .icon_attack img') ? true : false;
                data.trash = report.querySelector('.msg_head .fright a .icon_refuse');
                data.detail = report.querySelector('.msg_actions a.fright').href;
                data.spy = report.querySelector('a[onclick*="sendShipsWithPopup"]').getAttribute('onclick');
                data.attack = report.querySelector('.icon_attack').closest('a').href;
                data.api = report.querySelector('.icon_apikey');
                data.dom = report;

                if(data.renta < this.ogl.db.options.rval && data.fleet == 0 && this.ogl.db.options.togglesOff.indexOf('autoclean') == -1)
                {
                    if(this.trashQueue.indexOf(data.id) == -1) this.trashQueue.push(data.id);
                }
                else
                {
                    this.dataList.push(data);
                }
            }
        });

        if(this.dataList.length > 0)
        {
            setTimeout(() => this.buildSpyTable());
        }
    }

    checkTransports()
    {
        let messages = document.querySelectorAll('#ui-id-2 div[aria-hidden="false"] .msg:not(.ogl_transpoDone)');

        if(messages.length > 0 && messages.length != document.querySelectorAll('#ui-id-2 div[aria-hidden="false"] .msg:not(.ogl_transpoDone) .msg_date.ogl_timeZone').length)
        {
            setTimeout(() => this.checkTransports(), 100);
            return;
        }

        messages.forEach(message =>
        {
            if(!message.querySelector('.ogl_timeZone')) return;
            message.classList.add('ogl_transpoDone');

            let typeList = ['metal','crystal','deut','dm'];
            let regex = new RegExp(`${this.ogl.component.lang.getText(typeList[0])}[ ]?:[ ]?(.*?) ${this.ogl.component.lang.getText(typeList[1])}`, 'g');
            message.innerHTML = message.innerHTML.replace(/&nbsp;/g, ' ').trim().replace(regex, `${this.ogl.component.lang.getText(typeList[0])}: <span class="ogl_metal">$1</span> ${this.ogl.component.lang.getText(typeList[1])}`);

            regex = new RegExp(`${this.ogl.component.lang.getText(typeList[1])}[ ]?:[ ]?(.*?) ${this.ogl.component.lang.getText(typeList[2])}`, 'g');
            message.innerHTML = message.innerHTML.replace(/&nbsp;/g, ' ').trim().replace(regex, `${this.ogl.component.lang.getText(typeList[1])}: <span class="ogl_crystal">$1</span> ${this.ogl.component.lang.getText(typeList[2])}`);

            regex = new RegExp(`${this.ogl.component.lang.getText(typeList[2])}[ ]?:[ ]?([^a-zA-Z<]+)`, 'g');
            message.innerHTML = message.innerHTML.replace(/&nbsp;/g, ' ').trim().replace(regex, `${this.ogl.component.lang.getText(typeList[2])}: <span class="ogl_deut">$1</span>`);

        });
    }

    cleanString(str)
    {
        ['.', '(', ')', ':', ','].forEach(car => str = str.replace(new RegExp('\\'+car, 'g'), '')); // remove caracter(s)
        [' de '].forEach(car => str = str.replace(new RegExp('\\'+car, 'g'), ' ')); // replace caracter(s) with a space
        return str;
    }

    getExpeValue(locaAttr, message)
    {
        let regex;
        let isResource;
        ['metal', 'crystal', 'deut'].forEach(res => { if(this.ogl.component.lang.getText(res) == locaAttr) isResource = true; });

        let regexBefore = new RegExp('(\\d+) '+this.cleanString(locaAttr), 'g');
        let regexAfter = new RegExp(this.cleanString(locaAttr)+' (\\d+)', 'g');

        let stringResult = regexBefore.exec(this.cleanString(message.innerHTML))?.[1] || regexAfter.exec(this.cleanString(message.innerHTML))?.[1] || -1;

        return parseInt(stringResult);
    }

    buildSpyTable()
    {
        let highlightIndex;

        this.dataList.sort((a, b) =>
        {
            if(this.ogl.db.options.spyFilter == "$") return b.renta - a.renta;
            else if(this.ogl.db.options.spyFilter == "COORDS") return a.tmpCoords - b.tmpCoords;
            else if(this.ogl.db.options.spyFilter == "FLEET") return b.fleet - a.fleet;
            else if(this.ogl.db.options.spyFilter == "DEF") return b.defense - a.defense;
            else if(this.ogl.db.options.spyFilter == "DATE") return b.date - a.date;
            else if(this.ogl.db.options.spyFilter == "R_$") return a.renta - b.renta;
            else if(this.ogl.db.options.spyFilter == "R_COORDS") return b.tmpCoords - a.tmpCoords;
            else if(this.ogl.db.options.spyFilter == "R_FLEET") return a.fleet - b.fleet;
            else if(this.ogl.db.options.spyFilter == "R_DEF") return a.defense - b.defense;
            else if(this.ogl.db.options.spyFilter == "R_DATE") return a.date - b.date;
        });

        if(this.spyTable) this.spyTable.remove();

        let tmpTable = Util.createDom('div', {'class':'ogl_spyTable'});
        let thead = tmpTable.appendChild(Util.createDom('div'));
        let tbody = tmpTable.appendChild(Util.createDom('div'));

        let header = thead.appendChild(Util.createDom('div'));
        //header.appendChild(Util.createDom('th', {}, ''));
        header.appendChild(Util.createDom('th', {'data-filter':'DATE'}, 'age'));
        header.appendChild(Util.createDom('th', {'data-filter':'COORDS'}, 'coords'));
        header.appendChild(Util.createDom('th', {}, 'name'));
        header.appendChild(Util.createDom('th', {'data-filter':'$'}, 'renta'));
        header.appendChild(Util.createDom('th', {'data-filter':'FLEET'}, 'fleet'));
        header.appendChild(Util.createDom('th', {'data-filter':'DEF'}, 'def'));
        //header.appendChild(Util.createDom('th', {'class':'ogl_shipIcon ogl_'+this.ogl.db.options.defaultShip}));
        let headerActions = header.appendChild(Util.createDom('th', {'class':'ogl_headerActions'}));

        let clean = headerActions.appendChild(Util.createDom('div', {'class':'material-icons ogl_button tooltip', 'title':this.ogl.component.lang.getText('cleanReport')}, 'cleaning_services'));
        clean.addEventListener('click', () =>
        {
            this.spyTable.querySelectorAll('div[data-coords]').forEach(line =>
            {
                if(!line.querySelector('.ogl_renta.ogl_important') && !line.querySelector('.ogl_refleet.ogl_important'))
                {
                    (line.querySelector('.ogl_reportOptions div[data-title="delete"]') || line.querySelector('.ogl_reportOptions div[title="delete"]')).click();
                }
            });
        });

        header.querySelectorAll('th[data-filter]').forEach(filter =>
        {
            if(this.ogl.db.options.spyFilter.indexOf(filter.getAttribute('data-filter')) > -1)
            {
                filter.classList.add('ogl_active');
                highlightIndex = [].indexOf.call(filter.parentNode.children, filter);
            }

            filter.addEventListener('click', () =>
            {
                highlightIndex = [].indexOf.call(filter.parentNode.children, filter);
                this.ogl.db.options.spyFilter = this.ogl.db.options.spyFilter.indexOf('R_') > -1 ? filter.getAttribute('data-filter') : 'R_'+filter.getAttribute('data-filter');
                // this.ogl.saveAsync();

                this.spyTable.remove();
                this.spyTable = false;
                document.querySelectorAll('.msg.ogl_ready').forEach(e => e.classList.remove('ogl_ready'));
                this.checkReports();
            });
        });

        let sum = 0;
        let sumTotal = 0;
        let sumDetail = [0,0,0];

        for(let r=0, len=this.dataList.length; r<len; r++)
        {
            let report = this.dataList[r];

            if(report.coords.join(':') == '0:0:0') return;
            let content = tbody.appendChild(Util.createDom('div', {'data-coords':report.coords.join(':'), 'data-color':report.color, 'data-spy-id':report.id, 'data-renta':report.renta, 'data-metal':report.resources[0], 'data-crystal':report.resources[1] ,'data-deut':report.resources[2]}));
            let expanded = tbody.appendChild(Util.createDom('aside'));
            if(report.attacked) content.classList.add('ogl_attacked');

            // index
            //let indexContent = content.appendChild(Util.createDom('td'));

            // date
            let deltaDate =  serverTime.getTime() - report.date;
            let dateObj = new Date(parseInt(report.clientDate));
            let formatedDate = `${dateObj.toLocaleDateString('fr-FR')} ${dateObj.toLocaleTimeString('fr-FR')}`;
            let dateContent = content.appendChild(Util.createDom('td', {'class':'ogl_reportDate tooltip', 'title':formatedDate}));
            let date = dateContent.appendChild(Util.createDom('div'));

            if(deltaDate < 3600000) date.textContent = Math.max(0, (Math.floor(deltaDate / 60000) || 0)).toString() + LocalizationStrings.timeunits.short.minute;
            else if(deltaDate < 86400000) date.textContent = Math.max(0, (Math.floor(deltaDate / 3600000) || 0)).toString() + LocalizationStrings.timeunits.short.hour;
            else date.textContent = Math.max(0, (Math.floor(deltaDate / 86400000) || 0)).toString() + LocalizationStrings.timeunits.short.day;

            if(report.activity > 0 && report.activity < 16 && report.activityColor != '#FFFF00') date.classList.add('ogl_danger');
            else if(report.activity > 0 && report.activity < 60) date.classList.add('ogl_warning');

            // coords
            let coords = content.appendChild(Util.createDom('td', {'class':'ogl_coords'}));
            let coordsA = Util.createDom('a',
            { 'href': `https://${window.location.host}/game/index.php?page=ingame&component=galaxy&galaxy=${report.coords[0]}&system=${report.coords[1]}&position=${report.coords[2]}`}, `<span>${report.coords.join(':')}</span>`);
            coords.appendChild(coordsA);

            // type
            coordsA.appendChild(Util.createDom('div', {'class':'material-icons ogl_type'}, report.type == 1 ? 'language' : 'brightness_2'))
            if(report.attacked) coords.appendChild(Util.createDom('div', {'class':'ogl_inFlight'}));

            // player
            let detail = content.appendChild(Util.createDom('td', {'class':'ogl_name '+report.status}));
            detail.appendChild(Util.createDom('a', {'class':'msg_action_link overlay', 'href':report.detail}, report.name));

            // ships
            let shipsA;
            //shipList = [this.ogl.db.options.defaultShip, this.ogl.db.options.secondShip];

            [this.ogl.db.options.defaultShip].forEach(shipID =>
            {
                let shipsCount = this.ogl.component.fleet.calcRequiredShips(shipID, Math.round(report.renta * 1.07)); // 7% more resources
                shipsA = Util.createDom('a',
                {
                    'href': `https://${window.location.host}/game/index.php?page=ingame&component=fleetdispatch&galaxy=${
                    report.coords[0]}&system=${report.coords[1]}&position=${report.coords[2]}&type=${report.type == 3 ? 3 : 1}&mission=1&am${shipID}=${shipsCount}&ogl_mode=2&oglLazy=true`
                }, '<span>' + Util.formatToUnits(shipsCount, 1) + ' ' + this.ogl.component.lang.getText('abbr' + this.ogl.db.options.defaultShip) + '</span>');
                if(!this.ogl.current.techs[this.ogl.db.options.defaultShip] || this.ogl.current.techs[this.ogl.db.options.defaultShip] < shipsCount) shipsA.classList.add('ogl_danger');
            });

            // renta
            let renta = content.appendChild(Util.createDom('td', {'class':'tooltip ogl_renta'}));
            shipsA.innerHTML += `<div>${Util.formatNumber(report.renta) || '0'}</div>`;
            renta.appendChild(shipsA);

            if(report.renta >= this.ogl.db.options.rval) renta.classList.add('ogl_important');
            let resources = ['metal', 'crystal', 'deut'];
            let resourcesName = [this.ogl.component.lang.getText('metal'), this.ogl.component.lang.getText('crystal'), this.ogl.component.lang.getText('deut')];
            resources.forEach((res, index) =>
            {
                renta.title += `<div>${resourcesName[index]}:&nbsp;<span class="ogl_${resources[index]} float_right">${Util.formatToUnits(report.resources[index])}</span></div>`;
            });
            renta.title += `<hr><div>Total:&nbsp;<span class="float_right">${Util.formatToUnits(report.total)}</span></div>`;

            let currentRes = report.total;
            let currentRenta = report.renta;
            let shipList = [202,203,219,210];

            expanded.appendChild(Util.createDom('ul'));
            shipList.forEach(ship => expanded.appendChild(Util.createDom('ul', {'data-ship':ship}, `<div class="ogl_shipIcon ogl_${ship}"></div>`)));

            for(let i=0; i<6; i++)
            {
                currentRenta = Math.ceil(currentRes * report.loot);
                currentRes = currentRes - currentRenta;

                expanded.querySelector('ul').appendChild(Util.createDom('li', {}, Util.formatToUnits(currentRenta)));

                shipList.forEach(ship =>
                {
                    let shipsCount = this.ogl.component.fleet.calcRequiredShips(ship, Math.round(currentRenta * 1.07));

                    let a = Util.createDom('a',
                    {
                        'class' : 'ogl_added',
                        'href': `https://${window.location.host}/game/index.php?page=ingame&component=fleetdispatch&galaxy=${
                        report.coords[0]}&system=${report.coords[1]}&position=${report.coords[2]}&type=${report.type == 3 ? 3 : 1}&mission=1&am${ship}=${shipsCount}&ogl_mode=2&oglLazy=true`
                    }, shipsCount.toLocaleString('de-DE') || '0');

                    expanded.querySelector(`[data-ship="${ship}"]`).appendChild(a);
                    if(shipsCount === Infinity) a.classList.add('ogl_disabled');
                });
            }

            // fleet
            let fleet = content.appendChild(Util.createDom('td', {'class':'ogl_refleet'}, (Util.formatToUnits(report.fleet, 1) || '0').replace('-1', '?')))
            if(report.fleet >= this.ogl.db.options.rval || report.fleet == -1)
            {
                fleet.classList.add('ogl_important');
                content.classList.add('ogl_caution');
            }

            // def
            let def = content.appendChild(Util.createDom('td', {'class':'ogl_redef'}, (Util.formatToUnits(report.defense, 1) || '0').replace('-1', '?')));
            if(report.defense > 0 || report.defense == -1)
            {
                def.classList.add('ogl_important');
                content.classList.add('ogl_caution');
            }

            // color
            let colorContent = coords.appendChild(Util.createDom('div', {'class':'ogl_colorButton tooltipClose'}));
            colorContent.addEventListener('click', event =>
            {
                if(report.coords[2] <= 15)
                {
                    let colors = Util.createDom('div', {'class':'ogl_colorAll ogl_tooltipColor'});

                    let planetIndexes = this.ogl.find(this.ogl.db.positions, 'coords', report.coords.join(':'));
                    let playerIndex = this.ogl.find(this.ogl.db.players, 'name', report.name)[0];

                    if(planetIndexes.length == 0 && !playerIndex)
                    {
                        console.log(`This player doesn't exist in OGL database, please check the galaxy`);
                    }
                    else if(planetIndexes.length == 0 && playerIndex)
                    {
                        this.ogl.component.crawler.checkPlayerApi(this.ogl.db.players[playerIndex].id, () =>
                        {
                            planetIndexes = this.ogl.find(this.ogl.db.positions, 'coords', report.coords.join(':'));

                            this.ogl.component.color.addColorUI(colorContent, colors, planetIndexes, event, color => report.color = color);
                            this.ogl.component.tooltip.open(colorContent, false, colors);
                        });
                    }
                    else
                    {
                        this.ogl.component.color.addColorUI(colorContent, colors, planetIndexes, event, color => report.color = color);
                        this.ogl.component.tooltip.open(colorContent, false, colors);
                    }
                }
            });

            //actions
            let actions = content.appendChild(Util.createDom('td', {'class':'ogl_reportOptions'}));
            actions.appendChild(Util.createDom('div', {'class':'material-icons tooltip', 'onclick':report.spy, 'title':'spy this planet'}, 'visibility'));

            let more = actions.appendChild(Util.createDom('div', {'class':'material-icons tooltip ogl_expand', 'title':'expand'}));
            more.addEventListener('click', () =>
            {
                expanded.classList.toggle('ogl_active');
            });

            // attack
            let attack = actions.appendChild(Util.createDom('a', {'class':'material-icons tooltip', 'href':report.attack, 'title':'attack this planet'}, 'adjust'));

            let apiKey = Util.createDom('div', {});
            apiKey.innerHTML = report.api.getAttribute('title') || report.api.getAttribute('data-title');

            if(!apiKey.querySelector('input')) console.log(report);
            apiKey = apiKey.querySelector('input').value;

            if(report.api && report.coords[2] <= 15)
            {
                let simButton = actions.appendChild(Util.createDom('div', {'class':'tooltip', 'title':'trashsim'}, 'S'));
                simButton.addEventListener('click', () => window.open(Util.genTrashsimLink(apiKey, this.ogl), '_blank'));

                if(this.ogl.ptre)
                {
                    let ptreButton = actions.appendChild(Util.createDom('div', {'class':'ogl_smallPTRE tooltip', 'title':'import to PTRE'}, 'P'));
                    ptreButton.addEventListener('click', () => Util.importToPTRE(apiKey, this.ogl));
                }
            }

            let trash = actions.appendChild(Util.createDom('div', {'class':'material-icons tooltip', 'title':'delete'}, 'clear'));
            trash.addEventListener('click', () =>
            {
                if(this.trashQueue.indexOf(report.id) == -1) this.trashQueue.push(report.id);
                if(this.trashQueue.length == 1 && !this.trashQueueProcessing)
                {
                    this.tokenInput.value = this.tokenInput.value;
                }
                /*let token = document.querySelectorAll('[name="token"]')[0].getAttribute('value');
                if(token == this.oldToken) return;
                this.oldToken = token;*/

                /*this.sum = this.sum || 0;
                this.sum -= report.renta;
                this.sumDetail = this.sumDetail || [0, 0, 0];
                this.sumDetail[0] -= report.metal;
                this.sumDetail[1] -= report.crystal;
                this.sumDetail[2] -= report.deut;
                this.calcTotal(this.sum, this.sumDetail, this.sumDetail[0] + this.sumDetail[1] + this.sumDetail[2]);

                const isValid = e => e.id == report.id;
                const isValid = e => e.id == report.id;

                for(let i=0, len=this.dataList.length; i<len; i++)
                {
                    let item = this.dataList[i];
                    if(isValid(item))
                    {
                        this.dataList.splice(i, 1);
                        break;
                    }
                }

                content.remove();
                expanded.remove();
                report.trash?.click();*/
            });

            if(report.api && !report.dom.querySelector('.ogl_sim'))
            {
                let otherSimbutton = report.dom.querySelector('.msg_actions').appendChild(Util.createDom('div', {'class':'icon_nf ogl_sim'}, 'S'));
                otherSimbutton.addEventListener('click', () => window.open(Util.genTrashsimLink(apiKey, this.ogl), '_blank'));

                if(this.ogl.ptre)
                {
                    let otherPtreButton = report.dom.querySelector('.msg_actions').appendChild(Util.createDom('div', {'class':'icon_nf ogl_sim tooltip', 'title':'import to PTRE'}, 'P'));
                    otherPtreButton.addEventListener('click', () => Util.importToPTRE(apiKey, this.ogl));
                }
            }

            if(highlightIndex) content.querySelectorAll(`td`)[highlightIndex].classList.add('highlighted');

            sumTotal += report.total;
            sum += report.renta;
            for(let i=0; i<3; i++) sumDetail[i] += report.resources[i];

            if(r == this.dataList.length - 1)
            {
                this.spyTable = tmpTable;
                document.querySelector('ul.subtabs').after(this.spyTable);

                this.sum = sum;
                this.sumDetail = sumDetail;
                this.calcTotal(sum, sumDetail, sumTotal);
            }
        }

        //document.querySelector('.ogl_key.material-icons') && document.querySelector('.ogl_key.material-icons').classList.remove('ogl_hidden');
    }

    calcTotal(sumValue, sumDetail, sumTotal)
    {
        document.querySelector('.ogl_spyTable .ogl_totalSum') && document.querySelector('.ogl_spyTable .ogl_totalSum').remove();
        let total = this.spyTable.appendChild(Util.createDom('div', {'class':'ogl_totalSum'}));

        total.appendChild(Util.createDom('th', {}, ''));
        total.appendChild(Util.createDom('th', {}, ''));
        total.appendChild(Util.createDom('th', {}, ''));
        let cell = total.appendChild(Util.createDom('th', {'class':'tooltip'}, Util.formatToUnits(sumValue)));
        total.appendChild(Util.createDom('th', {}, ''));
        total.appendChild(Util.createDom('th', {}, ''));
        total.appendChild(Util.createDom('th', {}, ''));

        let resources = ['metal', 'crystal', 'deut'];
        let resourcesName = [this.ogl.component.lang.getText('metal'), this.ogl.component.lang.getText('crystal'), this.ogl.component.lang.getText('deut')];
        sumDetail.forEach((res, index) =>
        {
            cell.title += `<div>${resourcesName[index]}:&nbsp;<span class="ogl_${resources[index]} float_right">${Util.formatToUnits(sumDetail[index])}</span></div>`;
        });
        cell.title += `<hr><div>Total:&nbsp;<span class="float_right">${Util.formatToUnits(sumTotal)}</span></div>`;
    }
}

class KeyboardManager
{
    constructor(ogl)
    {
        this.ogl = ogl;
        this.dom = (document.querySelector('#cutty') || document.querySelector('#norm')).appendChild(Util.createDom('div', {'class':'ogl_keyList'}));

        this.sent = false;

        document.addEventListener('keypress', event =>
        {
            if(!this.sent && (!document.querySelector('.ui-dialog') || document.querySelector('.ui-dialog').style.display == 'none')
            && !document.querySelector('.chat_box_textarea:focus') && document.activeElement.tagName != 'INPUT' && document.activeElement.tagName != 'TEXTAREA')
            {
                this.sent = true;

                let keycode = event.keyCode ? event.keyCode : event.which;
                let keyNumber = parseInt(String.fromCharCode(keycode));
                let charList = Object.keys(this.ogl.keyboardActionsList).map(x => x.split('|'));

                if(keycode == 91 || keycode == 17) return; // windows key

                charList.forEach(c =>
                {
                    if(c.indexOf(String.fromCharCode(keycode).toLowerCase()) > -1)
                    {
                        this.ogl.keyboardActionsList[c.join('|')](event);
                    }
                    else if(keyNumber > 1 && keyNumber <= 9 && keycode)
                    {
                        this.ogl.keyboardActionsList['2-9'] && this.ogl.keyboardActionsList['2-9'](keyNumber);
                    }
                    else if(keycode == 13 && this.ogl.keyboardActionsList['enter'])
                    {
                        this.ogl.keyboardActionsList['enter']();
                    }
                });
            }
        });

        document.addEventListener('keyup', () => this.sent = false);

        this.addKey('i', this.ogl.component.lang.getText('prevPlanet'), () => this.goToNextPlanet(this.ogl.prevLink));
        this.addKey('o', this.ogl.component.lang.getText('nextPlanet'), () => this.goToNextPlanet(this.ogl.nextLink));

        if(this.ogl.page == 'fleetdispatch')
        {

            this.addKey('r', this.ogl.component.lang.getText('reverseAllShipsRes'), () =>
            {
                if(fleetDispatcher.currentPage == 'fleet1') document.querySelectorAll('#fleet1 li[data-status="on"] .ogl_delta').forEach(e => e.click());
                if(fleetDispatcher.currentPage == 'fleet2') document.querySelectorAll('#fleet2 .res .ogl_delta').forEach(e => e.click());
            });

            this.addKey('s', this.ogl.component.lang.getText('scExpe'), () =>
            {
                if(fleetDispatcher.currentPage == 'fleet1') this.ogl.component.fleet.expedition(202);
            });

            this.addKey('l', this.ogl.component.lang.getText('lcExpe'), () =>
            {
                if(fleetDispatcher.currentPage == 'fleet1') this.ogl.component.fleet.expedition(203);
            });

            this.addKey('f', this.ogl.component.lang.getText('pfExpe'), () =>
            {
                if(fleetDispatcher.currentPage == 'fleet1') this.ogl.component.fleet.expedition(219);
            });

            this.addKey('a', this.ogl.component.lang.getText('allShipsRes'), event =>
            {
                if(fleetDispatcher.currentPage == 'fleet1') fleetDispatcher.selectAllShips();
                if(fleetDispatcher.currentPage == 'fleet2')
                {
                    if(event.shiftKey) fleetDispatcher.selectForcedMaxAll();
                    else fleetDispatcher.selectMaxAll();
                }
                fleetDispatcher.refresh();
            });

            this.addKey('2-9', this.ogl.component.lang.getText('splitShipsRes'), keyNumber =>
            {
                this.keyNumberClickFleet1 = this.keyNumberClickFleet1 || 0;
                this.keyNumberClickFleet2 = this.keyNumberClickFleet2 || 0;

                if(fleetDispatcher.currentPage == 'fleet1')
                {
                    if(isNaN(keyNumber)) keyNumber = 2 + this.keyNumberClickFleet1;
                    this.keyNumberClickFleet2 = this.keyNumberClickFleet1;
                    this.keyNumberClickFleet1++;
                    if(this.keyNumberClickFleet1 > 7) this.keyNumberClickFleet1 = 0;

                    fleetDispatcher.shipsOnPlanet.forEach(ship => fleetDispatcher.selectShip(ship.id, Math.ceil(ship.number / keyNumber)));
                }
                else if(fleetDispatcher.currentPage == 'fleet2')
                {
                    if(isNaN(keyNumber)) keyNumber = 2 + this.keyNumberClickFleet2;
                    this.keyNumberClickFleet2++;
                    if(this.keyNumberClickFleet2 > 7) this.keyNumberClickFleet2 = 0;

                    let fleetDispatcherResources = ['metalOnPlanet', 'crystalOnPlanet', 'deuteriumOnPlanet'];

                    document.querySelectorAll('#fleet2 #resources .res_wrap').forEach((resource, index) =>
                    {
                        let cargoType = ['cargoMetal', 'cargoCrystal', 'cargoDeuterium'];

                        let currentMax = fleetDispatcher[fleetDispatcherResources[index]];
                        if(index == 2) currentMax -= fleetDispatcher.getConsumption();

                        fleetDispatcher[cargoType[index]] = Math.max(Math.ceil(currentMax / keyNumber), 0);
                        resource.querySelector('input').value = fleetDispatcher[cargoType[index]];

                        //fleetDispatcher.focusSendFleet();
                    });
                }
                fleetDispatcher.refresh();
            });

            this.addKey('p', this.ogl.component.lang.getText('prevFleet'), () =>
            {
                if(fleetDispatcher.currentPage != 'fleet1' || !this.ogl.component.fleet.sliderSpeed || !fleetDispatcher) return;
                if(!this.ogl.db.lastFleet) return;

                fleetDispatcher.resetShips();
                if(this.ogl.db.lastFleet.shipsToSend) Object.values(this.ogl.db.lastFleet.shipsToSend).forEach(ship => fleetDispatcher.selectShip(ship.id, ship.number));

                if(this.ogl.db.lastFleet.targetPlanet)
                {
                    document.querySelector('#galaxy').value = this.ogl.db.lastFleet.targetPlanet.galaxy;
                    document.querySelector('#system').value = this.ogl.db.lastFleet.targetPlanet.system;
                    document.querySelector('#position').value = this.ogl.db.lastFleet.targetPlanet.position;
                    document.querySelector('#position').value = this.ogl.db.lastFleet.targetPlanet.position;

                    fleetDispatcher.targetPlanet = this.ogl.db.lastFleet.targetPlanet;
                    fleetDispatcher.mission = this.ogl.db.lastFleet.mission;
                    fleetDispatcher.cargoMetal = Math.min(this.ogl.db.lastFleet.cargoMetal, fleetDispatcher.metalOnPlanet, fleetDispatcher.getFreeCargoSpace());
                    fleetDispatcher.cargoCrystal = Math.min(this.ogl.db.lastFleet.cargoCrystal, fleetDispatcher.crystalOnPlanet, fleetDispatcher.getFreeCargoSpace());
                    fleetDispatcher.cargoDeuterium = Math.min(this.ogl.db.lastFleet.cargoDeuterium, fleetDispatcher.deuteriumOnPlanet, fleetDispatcher.getFreeCargoSpace());
                    fleetDispatcher.speedPercent = this.ogl.db.lastFleet.speedPercent;

                    if(fleetDispatcher.mission == 15)
                    {
                        fleetDispatcher.expeditionTime = this.ogl.db.lastFleet.expeditionTime;
                        fleetDispatcher.updateExpeditionTime();
                    }

                    this.ogl.component.fleet.updateSpeedPercent();
                }

                fleetDispatcher.refresh();
                this.ogl.component.fleet.updatePlanetList();
            });

            this.addKey('t', this.ogl.component.lang.getText('attackCurrentTarget'), () =>
            {
                if(!fleetDispatcher) return;

                new Promise(resolve => resolve(this.ogl.component.sidebar.displayTargetList(true)))
                .then(() =>
                {
                    if(this.ogl.db.options.nextTargets[0])
                    {
                        fleetDispatcher.resetShips();

                        let shipID = this.ogl.db.options.defaultShip;
                        let shipCount = this.ogl.component.fleet.calcRequiredShips(shipID, this.ogl.db.options.rval);
                        fleetDispatcher.selectShip(shipID, shipCount);

                        let coords =  this.ogl.db.options.nextTargets[0].split(':');
                        fleetDispatcher.targetPlanet.galaxy = coords[0];
                        fleetDispatcher.targetPlanet.system = coords[1];
                        fleetDispatcher.targetPlanet.position = coords[2];
                        fleetDispatcher.targetPlanet.type = 1;
                        fleetDispatcher.targetPlanet.name = '-';
                        fleetDispatcher.mission = 1;
                        fleetDispatcher.refresh();
                        if(fleetDispatcher.currentPage == 'fleet2') fleetDispatcher.updateTarget();

                        this.ogl.component.fleet.targetSelected = true;

                        if(!this.ogl.db.options.nextTargets[0] && !this.ogl.db.options.nextTargets[1])
                        {
                            fadeBox(this.ogl.component.lang.getText('targetListEnd'), true);
                            fleetDispatcher.resetShips();
                            fleetDispatcher.refresh();
                            return;
                        }
                    }
                    else
                    {
                        fadeBox(this.ogl.component.lang.getText('noTargetSelected'), true);
                    }
                });
            });
        }

        if(this.ogl.page == 'galaxy')
        {
            this.addKey('s', 'Previous galaxy', () => submitOnKey('ArrowDown'));
            this.addKey('z|w', 'Next galaxy', () => submitOnKey('ArrowUp'));
            this.addKey('q|a', 'Previous system', () => submitOnKey('ArrowLeft'));
            this.addKey('d', 'Next system', () => submitOnKey('ArrowRight'));
        }

        if(this.ogl.page == 'messages')
        {
            this.addKey('enter', 'Send fleet on next spies table line', () =>
            {
                let nextRaidDom = document.querySelectorAll('.ogl_spyTable div[data-coords]:not(.ogl_attacked):not(.ogl_caution)')[0];

                if(document.querySelector('.ogl_spyTable') && nextRaidDom)
                {
                    nextRaidDom.querySelector('.ogl_renta a').click();
                }
            });
        }

        this.ogl.performances.push(['Keyboard',performance.now()]);
    }

    addKey(key, text, callback)
    {
        this.ogl.keyboardActionsList = this.ogl.keyboardActionsList || {};
        this.ogl.keyboardActionsList[key] = callback;

        let tip = this.dom.appendChild(Util.createDom('div', {'class':'ogl_button tooltipLeft', 'title':text, 'data-trigger':key.toUpperCase()}, key.toUpperCase()));
        if(key == 'enter')
        {
            tip.classList.add('material-icons');
            tip.textContent = 'subdirectory_arrow_left';
        }
        tip.addEventListener('click', event => callback(event));
    }

    goToNextPlanet(link)
    {
        if((this.ogl.mode != 1 && this.ogl.mode != 4) || this.ogl.component.fleet.linksUpdated)
        {
            Util.redirect(link, this.ogl);
            /*fetch(`https://${window.location.host}/game/index.php?page=fetchResources&ajax=1`)
            .then(() =>
            {
                Util.redirect(link, this.ogl);
                return;
            });*/
        }
    }
}

class SidebarManager
{
    constructor(ogl)
    {
        this.ogl = ogl;
        this.dom = document.body.appendChild(Util.createDom('div', {'class':'ogl_sideView'}));
        this.cross = this.dom.appendChild(Util.createDom('div', {'class':'ogl_close material-icons'}, 'clear'));
        this.content = this.dom.appendChild(Util.createDom('div'));
        this.ogl.db.sidebarView = this.ogl.db.sidebarView || false;

        this.cross.addEventListener('click', () => this.close());
        this.init();
    }

    init()
    {
        if(this.ogl.db.sidebarView == 'pinned') this.displayPinnedTarget();
        if(this.ogl.db.sidebarView == 'targetList') this.displayTargetList();

        this.ogl.performances.push(['Sidebar',performance.now()]);
    }

    displayPinnedTarget()
    {
        if(this.ogl.db.sidebarView != 'pinned')
        {
            this.ogl.db.sidebarView = 'pinned';
            // this.ogl.saveAsync();
        }

        this.oldContent = Util.createDom('div', {}, this.content.innerHTML);
        this.content.textContent = '';

        if(this.ogl.db.pinnedList.length > 0)
        {
            let player = this.ogl.db.players[this.ogl.find(this.ogl.db.players, 'id', this.ogl.db.pinnedList[0])[0]];

            let container = Util.createDom('div');
            container.innerHTML = `
                <h1><span>${player.name}</span></h1>
                <div class="splitLine"></div>
                <div class="ogl_scrollable">
                    <div class="ogl_stalkPoints">
                        <div title="${player.total}"><i class="material-icons">star</i>${Util.formatToUnits(player.total)}</div>
                        <div title="${player.eco}"><i class="material-icons">attach_money</i>${Util.formatToUnits(player.eco)}</div>
                        <div title="${player.tech}"><i class="material-icons">science</i>${Util.formatToUnits(player.tech)}</div>
                        <div title="${player.fleet}"><i class="material-icons">military_tech</i>${Util.formatToUnits(player.fleet)}</div>
                        <div title="${player.def}"><i class="material-icons">security</i>${Util.formatToUnits(player.def)}</div>
                    </div>
                    <div class="ogl_actionsContainer"></div>
                    <div class="splitLine"></div>
                    <div class="ogl_stalkInfo">
                        <div class="ogl_stalkPlanets ogl_pinnedContent"></div>
                    </div>
                </div>
            `;

            let rawStart = '000000';
            let multi = 1;
            let isMulti = false;

            let positionsList = this.ogl.getPositionsByPlayerId(this.ogl.db.pinnedList[0]);
            let buttonsContainer;

            if(positionsList && this.ogl.db.pinnedList[0] && positionsList[this.ogl.db.pinnedList[0]])
            {
                positionsList[this.ogl.db.pinnedList[0]].sort((a, b) => a.rawCoords - b.rawCoords).forEach(planetIndex =>
                {
                    let planet = planetIndex;
                    let splitted = planet.coords.split(':');

                    let item = Util.createDom('div', {'data-coords':planet.coords});
                    let coordsDiv = item.appendChild(Util.createDom('span', {}, planet.coords));
                    coordsDiv.addEventListener('click', () =>
                    {
                        this.scroll = document.querySelector('.ogl_pinnedContent').scrollTop;
                        this.ogl.component.tooltip.close();
                        this.ogl.component.galaxy.goToPosition(splitted[0], splitted[1], splitted[2]);
                    });

                    if(this.ogl.page == 'galaxy' && document.querySelector('#galaxy_input').value == splitted[0] && document.querySelector('#system_input').value == splitted[1])
                    {
                        coordsDiv.classList.add('ogl_currentSystem');
                    }

                    if(this.oldContent.querySelector(`[data-coords="${planet.coords}"] .ogl_checked`))
                    {
                        item.appendChild(Util.createDom('div', {'class':'material-icons ogl_checked'}, 'check_circle'));
                    }

                    if(this.oldContent.textContent.trim() && !this.oldContent.querySelector(`[data-coords="${planet.coords}"]`))
                    {
                        item.classList.add('ogl_new');
                    }

                    if(planet.main) coordsDiv.appendChild(Util.createDom('div', {'class':'material-icons ogl_mainPlanet'}, 'star'));

                    let mSpy = item.appendChild(Util.createDom('div', {'class':'ogl_moonIcon material-icons', 'data-type':3}, 'brightness_2'));
                    mSpy.addEventListener('click', () => this.ogl.component.fleet.sendSpyProbe([splitted[0], splitted[1], splitted[2], 3], this.ogl.db.spyProbesCount, mSpy, true));
                    if(serverTime.getTime() - planet.lastMoonSpy < 60 * 60 * 1000) mSpy.classList.add('ogl_done');

                    let pSpy = item.appendChild(Util.createDom('div', {'class':'ogl_planetIcon material-icons', 'data-type':1}, 'language'));
                    pSpy.addEventListener('click', () => this.ogl.component.fleet.sendSpyProbe([splitted[0], splitted[1], splitted[2], 1], this.ogl.db.spyProbesCount, pSpy, true));
                    if(serverTime.getTime() - planet.lastSpy < 60 * 60 * 1000) pSpy.classList.add('ogl_done');

                    if(planet.moonID == -1) mSpy.classList.add('ogl_noPointer');
                    planet.color ? item.setAttribute('data-color', planet.color) : item.removeAttribute('data-color');

                    // refresh old activities after 3h
                    if(planet.activity && serverTime.getTime() - planet.lastUpdate > 3 * 60 * 60 * 1000) planet.activity = false;
                    if(planet.moonActivity && serverTime.getTime() - planet.lastUpdate > 3 * 60 * 60 * 1000) planet.moonActivity = false;

                    let pActivityDom = item.appendChild(Util.createDom('div', {'class':'ogl_planetActivity', 'data-activity':planet.activity}, planet.activity || '?'));
                    let mActivityDom = item.appendChild(Util.createDom('div', {'class':'ogl_moonActivity', 'data-activity':planet.moonActivity}, planet.moonActivity || '?'));

                    if(planet.activity)
                    {
                        pActivityDom.textContent = planet.activity;
                        if(planet.activity == '*') pActivityDom.classList.add('ogl_short');
                    }

                    if(planet.moonID > -1 && planet.moonActivity)
                    {
                        mActivityDom.textContent = planet.moonActivity;
                        if(planet.moonActivity == '*') mActivityDom.classList.add('ogl_short');
                    }

                    if(planet.moonID == -1) mActivityDom.classList.add('ogl_hidden');

                    if(rawStart == planet.rawCoords.slice(0, -3))
                    {
                        item.setAttribute('data-multi', multi);
                        isMulti = true;
                    }
                    else if(isMulti)
                    {
                        multi++;
                        isMulti = false;
                    }

                    rawStart = planet.rawCoords.slice(0, -3);

                    container.querySelector('.ogl_stalkPlanets').appendChild(item);
                });

                buttonsContainer = container.querySelector('.ogl_actionsContainer');

                let ptreAction = frame =>
                {
                    frame = frame || 'week';

                    this.ogl.component.popup.load();
                    let container = Util.createDom('div', {'class':'ptreContent'});

                    if(!this.ogl.ptre)
                    {
                        container.innerHTML = `Error: no teamkey registered`;
                        this.ogl.component.popup.open(container);
                        return;
                    }

                    Util.getJSON(`https://ptre.chez.gg/scripts/oglight_get_player_infos.php?tool=oglight&team_key=${this.ogl.ptre}&pseudo=${player.name}&player_id=${player.id}&input_frame=${frame}`, result =>
                    {
                        if(result.code == 1 && result.activity_array.activity_array && result.activity_array.check_array)
                        {
                            let arrData = JSON.parse(result.activity_array.activity_array);
                            let checkData = JSON.parse(result.activity_array.check_array);

                            container.innerHTML = `
                                <h3>${this.ogl.component.lang.getText('reportFound')} :</h3>
                                <div class="ptreBestReport">
                                    <div>
                                        <div><b class="ogl_fleet"><i class="material-icons">military_tech</i>${Util.formatToUnits(result.top_sr_fleet_points)} pts</b></div>
                                        <div><b>${new Date(result.top_sr_timestamp * 1000).toLocaleDateString('fr-FR')}</b></div>
                                    </div>
                                    <div>
                                        <a class="ogl_button" target="_blank" href="${result.top_sr_link}">${this.ogl.component.lang.getText('topReportDetails')}</a>
                                        <a class="ogl_button" target="_blank" href="https://ptre.chez.gg/?country=${this.ogl.universe.lang}&univers=${this.ogl.universe.number}&player_id=${player.id}">${this.ogl.component.lang.getText('playerProfile')}</a>
                                    </div>
                                </div>
                                <div class="splitLine"></div>
                                <h3>${result.activity_array.title}</h3>
                                <div class="ptreActivities"><span></span><div></div></div>
                                <div class="splitLine"></div>
                                <div class="ptreFrames"></div>
                                <!--<ul class="ptreLegend">
                                    <li><u>Green circle</u>: no activity detected & fully checked</li>
                                    <li><u>Green dot</u>: no activity detected</li>
                                    <li><u>Red dot</u>: multiple activities detected</li>
                                    <li><u>Transparent dot</u>: not enough planet checked</li>
                                </ul>-->
                            `;

                            ['last24h', '2days', '3days', 'week', '2weeks', 'month'].forEach(f =>
                            {
                                let btn = container.querySelector('.ptreFrames').appendChild(Util.createDom('div', {'class':'ogl_button'}, f));
                                btn.addEventListener('click', () => ptreAction(f));
                            });

                            if(result.activity_array.succes == 1)
                            {
                                arrData.forEach((line, index) =>
                                {
                                    if(!isNaN(line[1]))
                                    {
                                        let div = Util.createDom('div', {'class':'tooltip'}, `<div>${line[0]}</div>`);
                                        let span = div.appendChild(Util.createDom('span', {'class':'ptreDotStats'}));
                                        let dot = span.appendChild(Util.createDom('div', {'data-acti':line[1], 'data-check':checkData[index][1]}));

                                        let dotValue = line[1] / result.activity_array.max_acti_per_slot * 100 * 7;
                                        dotValue = Math.ceil(dotValue / 30) * 30;

                                        dot.style.color = `hsl(${Math.max(0, 100 - dotValue)}deg 75% 40%)`;
                                        dot.style.opacity = checkData[index][1] + '%';
                                        dot.style.padding = '7px';

                                        let title;
                                        let checkValue = Math.max(0, 100 - dotValue);

                                        if(checkValue === 100) title = '- No activity detected';
                                        else if(checkValue >= 60) title = '- A few activities detected';
                                        else if(checkValue >= 40) title = '- Some activities detected';
                                        else title = '- A lot of activities detected';

                                        if(checkData[index][1] == 100) title += '<br>- Perfectly checked';
                                        else if(checkData[index][1] >= 75) title += '<br>- Nicely checked';
                                        else if(checkData[index][1] >= 50) title += '<br>- Decently checked';
                                        else if(checkData[index][1] > 0) title = 'Poorly checked';
                                        else title = 'Not checked';

                                        div.setAttribute('title', title);

                                        if(checkData[index][1] === 100 && line[1] == 0) dot.classList.add('ogl_active');

                                        container.querySelector('.ptreActivities > div').appendChild(div);
                                    }
                                });
                            }
                            else
                            {
                                container.querySelector('.ptreActivities > span').textContent = result.activity_array.message;
                            }
                        }
                        else if(result.code == 1)
                        {
                            container.textContent = result.activity_array.message;
                        }
                        else container.textContent = result.message;
                        this.ogl.component.popup.open(container);
                    });
                }

                let ptreBtn = buttonsContainer.appendChild(Util.createDom('div', {'class':'ogl_button ptrePinned tooltip', 'title':'Display PTRE data'}, 'PTRE'));
                ptreBtn.addEventListener('click', () => ptreAction());

                let ptreSyncBtn = buttonsContainer.appendChild(Util.createDom('div', {'class':'material-icons ogl_button tooltip', 'title':'Sync data with OGame API and PTRE'}, 'sync'));
                ptreSyncBtn.addEventListener('click', () =>
                {
                    this.ogl.component.crawler.checkPlayerApi(this.ogl.db.pinnedList[0], () =>
                    {
                        fadeBox('Data synced successfully');
                    }, true);
                });
            }
            else
            {
                buttonsContainer = container.querySelector('.ogl_actionsContainer');
            }

            let historyBtn = buttonsContainer.appendChild(Util.createDom('div', {'class':'material-icons ogl_button tooltip', 'title':'History list'}, 'history'));
            historyBtn.addEventListener('click', () => this.displayPinnedList());

            let deleteBtn = buttonsContainer.appendChild(Util.createDom('div', {'class':'material-icons ogl_button tooltip', 'title':'Remove'}, 'delete'));
            deleteBtn.addEventListener('click', () =>
            {
                this.ogl.db.pinnedList.forEach((e, index) =>
                {
                    if(e && e == player.id)
                    {
                        this.ogl.db.pinnedList.splice(index, 1);
                        this.ogl.db.pinnedList.length > 0 ? historyBtn.click() : this.ogl.component.sidebar.close();
                    }
                });
            });

            this.open(container, true);
        }

        if(this.scroll) document.querySelector('.ogl_pinnedContent').scrollTo(0, this.scroll);
    }

    displayPinnedList()
    {
        let content = Util.createDom('div', {'class':'ogl_historyList'});
        this.ogl.db.pinnedList.forEach(playerID =>
        {
            let historyPlayer = this.ogl.db.players[this.ogl.find(this.ogl.db.players, 'id', playerID)[0]];
            let btn = content.appendChild(Util.createDom('div', {'class':`ogl_button ${historyPlayer.status}`}));
            btn.appendChild(Util.createDom('b', {}, historyPlayer.name));
            btn.appendChild(Util.createDom('span', {}, '#' + (historyPlayer.rank?.toString().replace('-1', '(b)') || '?')));
            btn.appendChild(Util.createDom('i', {'class':'float_right'}, `<i class="material-icons">military_tech</i>${Util.formatToUnits(historyPlayer.fleet)}`));

            this.open(content);

            btn.addEventListener('click', () =>
            {
                this.ogl.db.pinnedList.forEach((e, index) =>
                {
                    if(e && e == playerID) this.ogl.db.pinnedList.splice(index, 1);
                });

                this.ogl.db.pinnedList.unshift(playerID);
                if(this.ogl.db.pinnedList.length > this.ogl.maxPinnedTargets) this.ogl.db.pinnedList.length = this.ogl.maxPinnedTargets;

                // this.ogl.saveAsync();
                this.ogl.component.sidebar.displayPinnedTarget();
                this.ogl.component.crawler.checkPlayerApi(this.ogl.db.pinnedList[0]);
            });
        });
    }

    displayTargetList(silencedMode)
    {
        if(!silencedMode && this.ogl.db.sidebarView != 'targetList')
        {
            this.ogl.db.sidebarView = 'targetList';
            // this.ogl.saveAsync();
        }
        if(!silencedMode) this.load();

        let ignoreVacation = this.ogl.db.options.togglesOff.indexOf('ignoreVacation') == -1;
        let playersList = this.ogl.getPlayersById();
        let positionsList = this.ogl.getPositionsByCoords(true);

        let container = Util.createDom('div');
        let currentGalaxy = this.ogl.db.options?.targetFilter?.[0] || 1;
        let currentSystem = this.ogl.db.options?.targetFilter?.[1] || 0;

        let systemSteps = 50;
        //let currentRaw = parseInt(`${currentGalaxy}:${currentSystem}:1`.split(':').map(x => x.padStart(3, '0')).join(''));

        let targetCoords;
        let nextTargetCoords;
        this.ogl.db.options.nextTargets = this.ogl.db.options.nextTargets || [0, 0];

        let colors = container.appendChild(Util.createDom('div', {'class':'ogl_toggleColors'}));
        let gMenu = container.appendChild(Util.createDom('div', {'class':'ogl_toggleGalaxies'}));
        let sMenu = container.appendChild(Util.createDom('div', {'class':'ogl_toggleSystems'}));
        let content = container.appendChild(Util.createDom('div', {'class':'ogl_stalkPlanets ogl_scrollable'}));

        ['red', 'halfred', 'yellow', 'halfyellow', 'green', 'halfgreen', 'blue', 'halfblue', 'violet', 'halfviolet', 'gray'].forEach(color =>
        {
            let toggle = colors.appendChild(Util.createDom('div', {'class':'ogl_toggle', 'data-toggle':color}));
            if(this.ogl.db.options.excludedColors.indexOf(color) == -1) toggle.classList.add('ogl_active');

            toggle.addEventListener('click', () =>
            {
                let colorIndex = this.ogl.db.options.excludedColors.indexOf(color);
                if(colorIndex > -1) this.ogl.db.options.excludedColors.splice(colorIndex, 1);
                else this.ogl.db.options.excludedColors.push(color);

                // this.ogl.saveAsync();
                this.displayTargetList();
            });
        });

        for(let g=1; g<=12; g++)
        {
            let gDiv = gMenu.appendChild(Util.createDom('div', {'class':'ogl_disabled', 'data-galaxy':g}, g));
            if(currentGalaxy == g) gDiv.classList.add('ogl_active');
            gDiv.addEventListener('click', () =>
            {
                this.ogl.db.options.targetFilter[0] = g;
                // this.ogl.saveAsync();
                this.displayTargetList();
            });

            for(let s=0; s<500; s+=systemSteps)
            {
                let planetsList = [];

                if(g==1)
                {
                    let sDiv = sMenu.appendChild(Util.createDom('div', {'class':'ogl_disabled', 'data-system':s}, s.toString()));
                    sDiv.addEventListener('click', () =>
                    {
                        this.ogl.db.options.targetFilter[1] = s;
                        // this.ogl.saveAsync();
                        this.displayTargetList();
                    });
                }

                /*let loopRawStart = parseInt(`${g}:${s}:1`.split(':').map(x => x.padStart(3, '0')).join(''));
                let loopRawEnd = loopRawStart + systemSteps * 1000;*/

                for(let sr=s; sr<s+systemSteps; sr++)
                {
                    let loopRawPosition = `${g}:${sr}:1`.split(':').map(x => x.padStart(3, '0')).join('').slice(0, -3);
                    if(positionsList[loopRawPosition]) planetsList.push(positionsList[loopRawPosition]);
                }

                let indexList = planetsList.flat();

                //let indexList = this.ogl.findTargets(this.ogl.db.positions, 'rawCoords', loopRawStart, loopRawEnd);
                if(indexList.length > 0)
                {
                    gDiv.classList.remove('ogl_disabled');
                    if(g == currentGalaxy) sMenu.querySelector(`[data-system="${s}"]`).classList.remove('ogl_disabled');
                }

                indexList.forEach(entry =>
                {
                    //let entry = this.ogl.db.positions[index];
                    let player = playersList[entry.playerID];

                    if(ignoreVacation && player?.status?.indexOf('vacation') > -1) return;

                    if(targetCoords && !nextTargetCoords)
                    {
                        nextTargetCoords = entry.coords;
                        this.ogl.db.options.nextTargets[1] = entry.coords;
                    }

                    if(this.ogl.db.options.nextTargets[0] == entry.coords)
                    {
                        targetCoords = entry.coords;
                        nextTargetCoords = false;
                    }

                    if(currentGalaxy == g && currentSystem == s)
                    {
                        gDiv.classList.add('ogl_active');
                        sMenu.querySelector(`[data-system="${s}"]`).classList.add('ogl_active');

                        let splitted = entry.coords.split(':');
                        let div = content.appendChild(Util.createDom('div', {'data-color':entry.color, 'data-playerID':entry.playerID, 'data-planetID':entry.id, 'data-minicoords':`${splitted[0]}:${splitted[1]}`}));

                        // coords
                        let coordsDiv = div.appendChild(Util.createDom('div', {}, entry.coords));
                        coordsDiv.addEventListener('click', () =>
                        {
                            this.ogl.component.tooltip.close();
                            this.ogl.component.galaxy.goToPosition(splitted[0], splitted[1], splitted[2]);
                        });

                        // player name
                        div.appendChild(Util.createDom('div', {'class':player?.status}, player?.name || '?'));

                        let pSpy = div.appendChild(Util.createDom('div', {'class':'ogl_planetIcon material-icons', 'data-type':1}, 'language'));
                        pSpy.addEventListener('click', () => this.ogl.component.fleet.sendSpyProbe([splitted[0], splitted[1], splitted[2], 1], this.ogl.db.spyProbesCount, pSpy, true));
                        if(serverTime.getTime() - entry.lastSpy < 60 * 60 * 1000) pSpy.classList.add('ogl_done');

                        let mSpy = div.appendChild(Util.createDom('div', {'class':'ogl_moonIcon material-icons ogl_noPointer', 'data-type':3}, 'brightness_2'));
                        if(entry.moonID && entry.moonID > -1) mSpy.classList.remove('ogl_noPointer');
                        mSpy.addEventListener('click', () => this.ogl.component.fleet.sendSpyProbe([splitted[0], splitted[1], splitted[2], 3], this.ogl.db.spyProbesCount, mSpy, true));
                        if(serverTime.getTime() - entry.lastMoonSpy < 60 * 60 * 1000) mSpy.classList.add('ogl_done');

                        let flag = div.appendChild(Util.createDom('div', {'class':'ogl_flagIcon material-icons'}, 'flag'));
                        if(targetCoords == entry.coords) flag.classList.add('ogl_active');
                        flag.addEventListener('click', () =>
                        {
                            this.ogl.db.options.nextTargets = [entry.coords, 0];
                            this.displayTargetList();
                        });
                    }
                });
            }
        }

        if(!silencedMode) this.open(container);
    }

    open(html, noLoad)
    {
        let update = () =>
        {
            this.content.textContent = '';
            this.content.appendChild(html);
            this.dom.classList.add('ogl_active');

            if(this.ogl.page == 'galaxy')
            {
                document.querySelectorAll('.ogl_stalkPlanets.ogl_scrollable > div.ogl_currentSystem').forEach(item => item.classList.remove('ogl_currentSystem'));
                document.querySelectorAll(`.ogl_stalkPlanets.ogl_scrollable > div[data-minicoords="${galaxy}:${system}"]`).forEach(item => item.classList.add('ogl_currentSystem'));
            }
        }

        if(noLoad) update();
        else setTimeout(() => update(), 100);
    }

    load()
    {
        this.content.innerHTML = '<div class="ogl_loader"></div>';
        this.dom.classList.add('ogl_active');
    }

    close()
    {
        this.ogl.db.sidebarView = false;
        this.dom.classList.remove('ogl_active');
        // this.ogl.saveAsync();
    }
}

class PopupManager
{
    constructor(ogl)
    {
        this.ogl = ogl;

        this.overlay = document.body.appendChild(Util.createDom('div', {'class':'ogl_overlay'}));
        this.dom = this.overlay.appendChild(Util.createDom('div', {'class':'ogl_popup'}));
        this.cross = this.dom.appendChild(Util.createDom('div', {'class':'ogl_close material-icons'}, 'clear'));
        this.content = this.dom.appendChild(Util.createDom('div'));

        this.cross.addEventListener('click', () => this.close());
        this.overlay.addEventListener('click', event => { if(event.target === this.overlay) this.close(); });

        this.ogl.performances.push(['Popup',performance.now()]);
    }

    load()
    {
        this.content.innerHTML = '';
        this.content.appendChild(Util.createDom('div', {'class':'ogl_loader'}));
        document.body.classList.add('ogl_active');
        this.dom.classList.add('ogl_active');
        this.overlay.classList.add('ogl_active');
        this.dom.classList.add('ogl_cleaned');
    }

    open(html, callback)
    {
        setTimeout(() =>
        {
            clearTimeout(this.ogl.component.tooltip.openTimer);
            clearTimeout(this.ogl.component.tooltip.updateTimer);
            this.ogl.component.tooltip.close();

            this.content.innerHTML = '';
            this.content.appendChild(html);
            document.body.classList.add('ogl_active');
            this.dom.classList.remove('ogl_cleaned');
            this.dom.classList.add('ogl_active');
            this.overlay.classList.add('ogl_active');

            if(callback) callback();
        }, Math.random() * (400 - 100 + 1) + 100);
    }

    close()
    {
        document.body.classList.remove('ogl_active');
        this.dom.classList.remove('ogl_active');
        this.overlay.classList.remove('ogl_active');
    }
}

class JumpgateManager
{
    constructor(ogl)
    {
        this.ogl = ogl;
        this.ogl.db.jumpGateTimers = this.ogl.db.jumpGateTimers || {};

        if(this.page == 'facilities' || this.ogl.current.type == 'moon')
        {
            let calcTimer = level =>
            {
                return (0.25 * Math.pow(level, 2) - 7.57 * level + 67.34) / this.ogl.universe.fleetSpeedWar * 60000;
            }

            jumpgateDone = a =>
            {
                var a = $.parseJSON(a);
                if(a.status)
                {
                    planet = a.targetMoon;
                    $(".overlayDiv").dialog("destroy");

                    let originCoords = this.ogl.current.coords.join(':');
                    let originLevel = this.ogl.current.smallplanet.querySelector('.moonlink').getAttribute('data-jumpgatelevel');

                    let destinationCoords = document.querySelector(`.moonlink[href*="${jumpGateTargetId}"]`).parentNode.querySelector('.planet-koords').textContent.slice(1, -1);
                    let destinationLevel = document.querySelector(`.moonlink[href*="${jumpGateTargetId}"]`).getAttribute('data-jumpgatelevel');

                    let now = serverTime.getTime();
                    this.ogl.db.jumpGateTimers[originCoords] = now + calcTimer(originLevel);
                    this.ogl.db.jumpGateTimers[destinationCoords] = now + calcTimer(destinationLevel);

                    this.ogl.save();
                }
                errorBoxAsArray(a.errorbox);
                if(typeof(a.newToken) != "undefined") setNewTokenData(a.newToken);
            }
        }

        this.ogl.observeMutation(() =>
        {
            if(document.querySelector('#jumpgateForm') && !document.querySelector('#jumpgateForm').classList.contains('ogl_ready'))
            {
                document.querySelector('#jumpgateForm').classList.add('ogl_ready');
                document.querySelectorAll('#jumpgateForm .ship_txt_row:not(.tdInactive)').forEach(ship =>
                {
                    ship.style.position = 'relative';
                    let delta = ship.appendChild(Util.createDom('div',{'class':'ogl_delta'}, '<i class="material-icons">fiber_smart_record</i>'));

                    delta.addEventListener('click', event =>
                    {
                        let input = ship.nextElementSibling.querySelector('input');
                        let selected = input.value.replace(/\./g, '') || 0;
                        let amount = parseInt(input.getAttribute('rel'));

                        input.value = amount - selected;
                    });
                });
            }
        }, 'jumpgate');

        this.addTimer();

        this.ogl.performances.push(['Jumpgate',performance.now()]);
    }

    addTimer()
    {
        document.querySelectorAll('.smallplanet').forEach(planet =>
        {
            let coords = planet.querySelector('.planet-koords').textContent.slice(1, -1);
            if(this.ogl.db.jumpGateTimers[coords] && this.ogl.db.jumpGateTimers[coords] > serverTime.getTime())
            {
                if(!planet.querySelector('.moonlink')) return;

                let updateTimer = () => new Date(this.ogl.db.jumpGateTimers[coords] - (serverTime.getTime() + 3600000)).toLocaleTimeString('fr-FR').substr(3);

                let timer = updateTimer();
                let div = planet.querySelector('.moonlink').appendChild(Util.createDom('div', {'class':'ogl_jumpGateTimer'}, timer));
                let interval = setInterval(() =>
                {
                    if(this.ogl.db.jumpGateTimers[coords] <= serverTime.getTime()) clearInterval(interval);
                    else div.textContent = updateTimer();
                }, 1000);
            }
        });
    }
}

class TimeManager
{
    constructor(ogl)
    {
        this.ogl = ogl;
        this.currentDetail;

        const ping = (performance.timing.responseEnd - performance.timing.requestStart) / 1000;
        let li = Util.createDom('li', {'class':'ogl_ping'}, `${ping} s`);
        document.querySelector('#bar ul').appendChild(li);
        if(ping >= 2) li.classList.add('ogl_danger');
        else if(ping >= 1) li.classList.add('ogl_warning');

        if(this.ogl.page == 'messages')
        {
            this.ogl.observeMutation(() =>
            {
                document.querySelectorAll('.msg_date:not(.ogl_timeZone)').forEach(element =>
                {
                    this.updateTime(element);
                });
            }, 'messagesdate');
        }

        this.checkCurrentBuilding();

        // update ogame main clock
        let clock = document.querySelector('#bar ul li.OGameClock:not(.ogl_ready)');
        clock.classList.add('ogl_ready');
        this.updateTime(clock);
        this.observe(clock);

        // update fleets timers
        this.ogl.addToUpdateQueue(() =>
        {
            document.querySelectorAll('#arrivalTime:not(.ogl_ready), #returnTime:not(.ogl_ready)').forEach((element, index) =>
            {
                element.classList.add('ogl_ready');
                if(element.closest('#rocketattack')) return;
                this.updateTime(element);
                this.observe(element);
            });

            document.querySelectorAll('.allianceAttack .arrivalTime:not(.ogl_ready), .eventFleet .arrivalTime:not(.ogl_ready), .fleetDetails .absTime:not(.ogl_ready), .fleetDetails .nextabsTime:not(.ogl_ready)').forEach((element, index) =>
            {
                element.classList.add('ogl_ready');
                if(element.closest('#rocketattack')) return;
                this.updateTime(element);
            });
        });

        let pages = ['supplies', 'facilities', 'shipyard', 'defenses', 'research', 'lfbuildings', 'lfresearch'];
        if(pages.indexOf(this.ogl.page) > -1)
        {
            Util.updateCheckIntInput(() => this.checkDetail());
            this.ogl.observeMutation(() => this.checkDetail(), 'details');
        }

        this.ogl.performances.push(['Time',performance.now()]);
    }

    observe(target)
    {
        let observer = new MutationObserver(() => this.updateTime(target));
        observer.observe(target, {childList:true});
    }

    updateTime(domElement)
    {
        domElement.classList.add('ogl_hiddenContent');
        domElement.classList.add('ogl_timeZone');

        let serverRawTime = domElement.textContent;
        if(!serverRawTime || serverRawTime.trim() == '') return;

        let timeMode = false;
        let splitted = serverRawTime.replace(/ \.$/, '').trim().replace(/[ \.]/g, ':').split(':');

        if(splitted.length <= 5)
        {
            timeMode = true;
            splitted = ["01","01","2000"].concat(splitted);
        }

        splitted = splitted.map(e => e.padStart(2, '0'));
        if(splitted[2].length == 2) splitted[2] = '20' + splitted[2]; // ex: 10.05.22 => 10.05.2022

        let serverDate = new Date(`${splitted[2]}-${splitted[1]}-${splitted[0]}T${splitted[3]}:${splitted[4]}:${splitted[5]}`);
        let unixTimestamp = serverDate.getTime() + this.ogl.db.servertTimezone;
        let serverTimeMs = serverDate.getTime();
        //let serverClientTimeDiff = timeDiff > 1000000 || timeDiff < -1000000 ? timeDiff : 0;
        let serverClientTimeDiff = this.ogl.db.servertTimezone - this.ogl.db.clientTimezone;
        let clientTimeMs = this.ogl.db.options.togglesOff.indexOf('timezoneMode') == -1 ? serverDate.getTime() + serverClientTimeDiff : serverDate.getTime();
        let clientDate = new Date(clientTimeMs);
        domElement.setAttribute('data-unixtimestamp', unixTimestamp);
        domElement.setAttribute('data-servertime', serverTimeMs);
        domElement.setAttribute('data-clienttime', clientTimeMs);

        if(timeMode)
        {
            domElement.setAttribute('data-timezone', clientDate.toLocaleTimeString('fr-FR'));
        }
        else
        {
            domElement.classList.add('ogl_fulldate');
            domElement.setAttribute('data-datezone', `${clientDate.toLocaleDateString('fr-FR').replace(/\//g, '.')} `);
            domElement.setAttribute('data-timezone', ` ${clientDate.toLocaleTimeString('fr-FR')}`);
        }

/*
        let time = domElement.textContent;
        let newTime;
        let timeMode = false;

        if(!time) return;

        time = time.replace(/ \.$/, '');
        time = time.trim().replace(/[ \.]/g, ':');
        time = time.split(':');

        if(time.length <= 5)
        {
            timeMode = true;
            time = ["01","01","2000"].concat(time);
        }

        time.forEach((t, index) => time[index] = t.padStart(2, '0'));
        if(time[2].length == 2) time[2] = '20' + time[2];

        newTime = new Date(`${time[2]}-${time[1]}-${time[0]}T${time[3]}:${time[4]}:${time[5]}`).getTime();
        domElement.setAttribute('data-servertime', newTime);

        //newTime = new Date(newTime - Math.round(timeDiff / 100000) * 100000);
        //domElement.setAttribute('data-timestamp', newTime.getTime());

        if(timeMode)
        {
            domElement.setAttribute('data-timezone', newTime.toLocaleTimeString('fr-FR'));
        }
        else
        {
            domElement.classList.add('ogl_fulldate');
            domElement.setAttribute('data-datezone', `${newTime.toLocaleDateString('fr-FR').replace(/\//g, '.')} `);
            domElement.setAttribute('data-timezone', ` ${newTime.toLocaleTimeString('fr-FR')}`);
        }*/
    }

    checkCurrentBuilding()
    {
        let countDownID = ['buildingCountdown', 'researchCountdown', 'shipyardCountdown2', 'lfbuildingCountdown'];
        ['restTimebuilding', 'restTimeresearch', 'restTimeship2', 'restTimelfbuilding '].forEach((building, index) =>
        {
            try
            {
                let time = new Date(serverTime - Math.round(timeDiff / 100000) * 100000 + eval(building) * 1000);
                let parent = document.querySelector(`span#${countDownID[index]}`).closest('.content');
                let div =  parent.appendChild(Util.createDom('div', {'class':'ogl_endTime'}));
                div.innerHTML = `${time.toLocaleDateString('fr-FR').replace(/\//g, '.')} <span>${time.toLocaleTimeString('fr-FR')}</span>`;
            }
            catch(e){}
        });
    }

    checkDetail()
    {
        // fix an ogame bug when an user spam click
        if(document.querySelectorAll('#technologydetails').length > 1)
        {
            document.querySelectorAll('#technologydetails').forEach((e, index) => { if(index > 0) e.remove() });
        }

        this.currentDetail = document.querySelector('#technologydetails_content');
        if(this.currentDetail && this.currentDetail.querySelector('.og-loading') && this.currentDetail.querySelector('.og-loading').style.display == 'none')
        {
            //let amount = parseInt(this.currentDetail.querySelector('#build_amount')?.value || 1) || 1;
            let domTime = this.currentDetail.querySelector('.build_duration time');

            // prev / next / lock buttons actions
            if(!this.currentDetail.querySelector('.ogl_detailActions'))
            {
                let isInitial = true;

                let tech = {};
                tech.id = parseInt(this.currentDetail.querySelector('#technologydetails').getAttribute('data-technology-id'));
                tech.name = this.currentDetail.querySelector('#technologydetails h3').textContent;

                tech.initial = {};
                tech.initial.time = domTime.getAttribute('datetime');
                tech.initial.level = parseInt(this.currentDetail.querySelector('.information .level') ? this.currentDetail.querySelector('.information .level').getAttribute('data-value') : 0);
                tech.initial.metal = parseInt(!this.currentDetail.querySelector('.costs .metal') ? 0 : this.currentDetail.querySelector('.costs .metal').getAttribute('data-value'));
                tech.initial.crystal = parseInt(!this.currentDetail.querySelector('.costs .crystal') ? 0 : this.currentDetail.querySelector('.costs .crystal').getAttribute('data-value'));
                tech.initial.deut = parseInt(!this.currentDetail.querySelector('.costs .deuterium') ? 0 : this.currentDetail.querySelector('.costs .deuterium').getAttribute('data-value'));
                tech.initial.energy = parseInt(!this.currentDetail.querySelector('.costs .energy') ? 0 : this.currentDetail.querySelector('.costs .energy').getAttribute('data-value'));

                tech.current = {};
                tech.current.level = tech.initial.level;
                tech.current.metal = tech.initial.metal;
                tech.current.crystal = tech.initial.crystal;
                tech.current.deut = tech.initial.deut;
                tech.current.energy = tech.initial.energy;

                tech.data = Datafinder.getTech(tech.id) || {};
                tech.data.priceFactor = tech.data.priceFactor || 2;
                tech.data.energyFactor = tech.data.energyFactor || 2;
                tech.data.durationFactor = tech.data.durationFactor || tech.data.priceFactor;

                tech.isBaseBuilding = tech.id < 100;
                tech.isBaseResearch = tech.id > 100 && tech.id <= 199;
                tech.isShip = tech.id > 200 && tech.id <= 299;
                tech.isDef = tech.id > 400 && tech.id <= 499;
                tech.isLfBuilding = (tech.id > 11100 && tech.id <= 11199) || (tech.id > 12100 && tech.id <= 12199) || (tech.id > 13100 && tech.id <= 13199) || (tech.id > 14100 && tech.id <= 14199);
                tech.isLfResearch = (tech.id > 11200 && tech.id <= 11299) || (tech.id > 12200 && tech.id <= 12299) || (tech.id > 13200 && tech.id <= 13299) || (tech.id > 14200 && tech.id <= 14299);

                let self = this;

                let coords = this.ogl.current.coords.join(':');
                if(this.ogl.current.type == 'moon') coords += ':M';

                let baseTechs =
                {
                    // buildings
                    robot:this.ogl.db.me?.planets?.[coords]?.techs?.[14] || 0,
                    nanite:this.ogl.db.me?.planets?.[coords]?.techs?.[15] || 0,
                    labo:this.ogl.db.me?.planets?.[coords]?.techs?.[31] || 0,

                    // researches
                    energy:this.ogl.db.me?.planets?.[coords]?.techs?.[113] || 0,
                    network:this.ogl.db.me?.planets?.[coords]?.techs?.[123] || 0,
                };

                let humanTechs =
                {
                    center:this.ogl.db.me?.planets?.[coords]?.techs?.[11103] || 0,
                };

                let rocktalTechs =
                {
                    center:this.ogl.db.me?.planets?.[coords]?.techs?.[12104] || 0,
                };

                let mechanTechs =
                {
                    center:this.ogl.db.me?.planets?.[coords]?.techs?.[13103] || 0,
                };

                let kaeleshTechs =
                {
                    center:this.ogl.db.me?.planets?.[coords]?.techs?.[14103] || 0,
                };

                let currentRace = document.querySelector('#lifeform .lifeform-item-icon')?.className.replace(/\D/g, '') || 0;
                let center = currentRace == 1 ? humanTechs.center : currentRace == 2 ? rocktalTechs.center : currentRace == 3 ? mechanTechs.center : currentRace == 4 ? kaeleshTechs.center : 0;

                // best labs
                let networkLevel = 0;
                let laboList = [];
                Object.entries(this.ogl.db.me.planets).forEach(p => { if(p[0] != coords && p[0].indexOf(':M') == -1) laboList.push(p[1].techs[31])});
                laboList.sort((a, b) => b - a);
                laboList.length = Math.min(laboList.length, baseTechs.network);
                if(laboList.length) networkLevel = laboList.reduce((a, b) => a + b);

                let updateFullDate = () =>
                {
                    let li = this.currentDetail.querySelector('.ogl_timeZone.ogl_fulldate') || this.currentDetail.querySelector('.build_duration').appendChild(Util.createDom('div', {'class':'ogl_timeZone ogl_fulldate'}));
                    let totalTime = 0;

                    let indexArr = domTime.getAttribute('datetime').replace('PT', '').replace('P', '').match(/\D+/g).map(String);
                    let valueArr = domTime.getAttribute('datetime').replace('PT', '').replace('P', '').match(/\d+/g).map(Number);

                    valueArr.forEach((value, index) =>
                    {
                        if(indexArr[index] == "DT") totalTime += value * 86400;
                        if(indexArr[index] == "H") totalTime += value * 3600;
                        if(indexArr[index] == "M") totalTime += value * 60;
                        if(indexArr[index] == "S") totalTime += value;
                    });

                    let seconds = totalTime;
                    let newTime = new Date(serverTime.getTime() + seconds * 1000);
                    li.setAttribute('data-datezone', `${newTime.toLocaleDateString('fr-FR').replace(/\//g, '.')} `);
                    li.setAttribute('data-timezone', ` ${newTime.toLocaleTimeString('fr-FR')}`);
                }

                let updateDomTime = () =>
                {
                    let totalTime = 0;

                    let indexArr = tech.initial.time.replace('PT', '').replace('P', '').match(/\D+/g).map(String);
                    let valueArr = tech.initial.time.replace('PT', '').replace('P', '').match(/\d+/g).map(Number);

                    valueArr.forEach((value, index) =>
                    {
                        if(indexArr[index] == "DT") totalTime += value * 86400;
                        if(indexArr[index] == "H") totalTime += value * 3600;
                        if(indexArr[index] == "M") totalTime += value * 60;
                        if(indexArr[index] == "S") totalTime += value;
                    });

                    if(!isInitial)
                    {
                        if(this.currentDetail.querySelector('#build_amount')) totalTime = totalTime * parseInt(this.currentDetail.querySelector('#build_amount')?.value || 1) || 1;

                        // time formulas for each techs type
                        if(tech.isLfBuilding)
                        {
                            totalTime = Math.round(tech.current.level * tech.data.duration * Math.pow(tech.data.durationFactor, tech.current.level)) / (1 + baseTechs.robot) / (Math.pow(2, baseTechs.nanite)) / this.ogl.universe.ecoSpeed;
                        }
                        else if(tech.isLfResearch)
                        {
                            totalTime = Math.round(tech.current.level * tech.data.duration * Math.pow(tech.data.durationFactor, tech.current.level)) * (1 - 0.02 * center) / (this.ogl.db.researchSpeed * this.ogl.universe.ecoSpeed);
                        }
                        else if(tech.isBaseBuilding && tech.id != 15)
                        {
                            let levelRatio = tech.id == 43 ? 1 : 4 - tech.current.level / 2;
                            totalTime = (tech.current.metal + tech.current.crystal) / (2500 * Math.max(levelRatio, 1) * (1 + baseTechs.robot) * (Math.pow(2, baseTechs.nanite))) / this.ogl.universe.ecoSpeed * 3600;
                        }
                        else if(tech.isBaseResearch)
                        {
                            totalTime = (tech.current.metal + tech.current.crystal) / (1000 * (1 + baseTechs.labo + networkLevel)) / (this.ogl.db.researchSpeed * this.ogl.universe.ecoSpeed) * 3600;
                        }
                        else if(tech.id != 15)
                        {
                            totalTime = totalTime * Math.pow(tech.data.durationFactor, tech.current.level - tech.initial.level);
                        }

                        let bonus = 0;

                        if(tech.isBaseResearch && this.ogl.account.class == 3) bonus += 25;
                        if(tech.isBaseResearch && document.querySelector(`[data-technology="${tech.id}"] .acceleration`)) bonus += parseInt(document.querySelector(`[data-technology="${tech.id}"] .acceleration`).getAttribute('data-value'));
                        if(tech.isBaseResearch && document.querySelector('#officers .technocrat.on')) totalTime = totalTime - totalTime * 25 / 100;

                        totalTime = totalTime - totalTime * bonus / 100;
                    }

                    let seconds = Math.ceil(totalTime || 1);
                    let w = Math.floor(seconds / (3600*24*7));
                    let d = Math.floor(seconds % (3600*24*7) / (3600*24));
                    let h = Math.floor(seconds % (3600*24) / 3600);
                    let m = Math.floor(seconds % 3600 / 60);
                    let s = Math.floor(seconds % 60);

                    let wd = Math.floor(seconds / (3600*24));

                    domTime.setAttribute('datetime', `${wd}DT${h}H${m}M${s}S`);

                    domTime.textContent = '';
                    if(w > 0) domTime.textContent += `${w}${LocalizationStrings.timeunits.short.week} `;
                    if(d > 0) domTime.textContent += `${d}${LocalizationStrings.timeunits.short.day} `;
                    if(h > 0) domTime.textContent += `${h}${LocalizationStrings.timeunits.short.hour} `;
                    if(m > 0 && w <= 0) domTime.textContent += `${m}${LocalizationStrings.timeunits.short.minute} `;
                    if(s > 0 && w <= 0 && d <= 0) domTime.textContent += `${s}${LocalizationStrings.timeunits.short.second}`;

                    updateFullDate();
                }

                let updateLevel = function(newLevel, updateDom)
                {
                    isInitial = false;

                    tech.current.level = newLevel > 0 ? newLevel : 1;
                    if(self.currentDetail.querySelector('.information .level')) self.currentDetail.querySelector('.information .level').setAttribute('data-step', tech.current.level - tech.initial.level);

                    ['metal', 'crystal', 'deut', 'energy', 'energyConsumption', 'energyProduction'].forEach(res =>
                    {
                        // cost
                        if(res == 'energy' && tech.isLfBuilding) tech.current[res] = Math.ceil(tech.current.level * tech.data[res] * Math.pow(tech.data.energyFactor, tech.current.level));
                        else if(tech.isLfBuilding || tech.isLfResearch) tech.current[res] = Math.ceil(tech.data[res] * Math.pow(tech.data.priceFactor, tech.current.level - 1) * tech.current.level);
                        else if(!tech.isShip && !tech.isDef) tech.current[res] = Math.ceil(tech.initial[res] * Math.pow(tech.data.priceFactor, tech.current.level - tech.initial.level));

                        // consumption
                        if(res == 'energyConsumption')
                        {
                            let consumption = 0;
                            let prevConsumption = 0;
                            let domEnergy = document.querySelector('.additional_energy_consumption .value');

                            if(tech.id == 1 || tech.id == 2)
                            {
                                consumption = Math.ceil(10 * tech.current.level * Math.pow(1.1, tech.current.level));
                                prevConsumption = Math.ceil(10 * (tech.current.level-1) * Math.pow(1.1, (tech.current.level-1)));
                            }
                            else if(tech.id == 3)
                            {
                                consumption = Math.ceil(20 * tech.current.level * Math.pow(1.1, tech.current.level));
                                prevConsumption = Math.ceil(20 * (tech.current.level-1) * Math.pow(1.1, (tech.current.level-1)));
                            }

                            if(consumption && prevConsumption && domEnergy)
                            {
                                domEnergy.textContent = Util.formatNumber(consumption - prevConsumption);
                            }
                        }

                        // production
                        if(res == 'energyProduction')
                        {
                            let production = 0;
                            let prevProduction = 0;
                            let domEnergy = document.querySelector('.energy_production .value');

                            if(tech.id == 4)
                            {
                                production = Math.ceil(20 * tech.current.level * Math.pow(1.1, tech.current.level));
                                prevProduction = Math.ceil(20 * (tech.current.level-1) * Math.pow(1.1, (tech.current.level-1)));
                            }
                            else if(tech.id == 12)
                            {
                                production = Math.ceil(30 * tech.current.level * Math.pow((1.05 + baseTechs.energy * 0.01), tech.current.level));
                                prevProduction = Math.ceil(30 * (tech.current.level-1) * Math.pow((1.05 + baseTechs.energy * 0.01), (tech.current.level-1)));
                            }

                            if(production && prevProduction && domEnergy)
                            {
                                domEnergy.innerHTML = `${Util.formatNumber(production)} <span class="bonus" data-value="${production-prevProduction}">(+${Util.formatNumber(production-prevProduction)})</span>`;
                            }
                        }

                        if(updateDom)
                        {
                            let target = self.currentDetail.querySelector('.costs .' + res.replace('deut', 'deuterium'));

                            if(target)
                            {
                                target.textContent = Util.formatToUnits(tech.current[res]);
                                target.setAttribute('data-total', tech.current[res]);
                                target.setAttribute('title', `${Util.formatNumber(tech.current[res])} ${self.ogl.component.lang.getText(res)}`);
                                self.currentDetail.querySelector('.information .level').innerHTML = `Level ${tech.current.level - 1} <i class="material-icons">arrow_forward</i> <span>${tech.current.level}</span>`;

                                if(self.ogl.current[res] < tech.current[res]) target.classList.add('insufficient');
                                else target.classList.remove('insufficient');

                                 /* CUSTOM PUMPK1IN */
                                if(self.ogl.db.options.togglesOff.indexOf('transportsCalcDetails') == -1)
                                {
                                    if(self.ogl.current[res] < tech.current[res]) {
                                        let missingRessources = Math.floor(tech.current[res] - self.ogl.current[res]);
                                        let spoun = document.createElement("span");
                                        spoun.classList.add('malus', 'insufficient');

                                        let transportNeeded = '';

                                        if(self.ogl.db.options.togglesOff.indexOf('transportsNBDetails') == -1)
                                        {
                                            let PTshipData = self.ogl.db.ships[202];
                                            let GTshipData = self.ogl.db.ships[203];
                                            let PTneed = Math.ceil(missingRessources / PTshipData.capacity);
                                            let GTneed = Math.ceil(missingRessources / GTshipData.capacity);

                                            transportNeeded = ` <span style='font-size:0.95em;font-weight:normal;color:#848484;'>${PTneed} ${self.ogl.component.lang.getText('abbr202')} / ${GTneed} ${self.ogl.component.lang.getText('abbr203')}</span>`;
                                        }

                                        target.append(spoun);
                                        target.querySelector('.malus').innerHTML = " <small style='font-size:0.85em;'>(-" + Util.formatToUnits(Util.formatNumber(missingRessources)) + ")" + transportNeeded + "</small>";
                                    }
                                }
                                /* END CUSTOM PUMPK1IN */
                            }
                        }

                        /*
                        if(tech.initial[res])
                        {
                            let ratio = res == 'energy' ? tech.energyRatio : tech.ratio;
                            let isLfBuilding = (tech.id > 11100 && tech.id <= 11199) || (tech.id > 12100 && tech.id <= 12199) || (tech.id > 13100 && tech.id <= 13199) || (tech.id > 14100 && tech.id <= 14199);
                            let isLfResearch = (tech.id > 11200 && tech.id <= 11299) || (tech.id > 12200 && tech.id <= 12299) || (tech.id > 13200 && tech.id <= 13299) || (tech.id > 14200 && tech.id <= 14299);

                            if(res == 'energy' && isLfBuilding) tech.current[res] = Math.ceil(tech.current.level * tech.basePrice[res] * Math.pow(ratio, tech.current.level));
                            else if(isLfBuilding) tech.current[res] = Math.ceil(tech.basePrice[res] * Math.pow(ratio, tech.current.level - 1) * tech.current.level);
                            else if(isLfResearch) tech.current[res] = Math.ceil(tech.basePrice[res] * Math.pow(ratio, tech.current.level - 1) * tech.current.level);
                            else tech.current[res] = Math.ceil(tech.initial[res] * Math.pow(ratio, tech.current.level - tech.initial.level));

                            if(updateDom)
                            {
                                let target = self.currentDetail.querySelector('.costs .' + res.replace('deut', 'deuterium'));
                                target.textContent = Util.formatToUnits(tech.current[res]);
                                target.setAttribute('data-total', tech.current[res]);
                                target.setAttribute('title', `${Util.formatNumber(tech.current[res])} ${self.ogl.component.lang.getText(res)}`);
                                self.currentDetail.querySelector('.information .level').innerHTML = `Level ${tech.current.level - 1} <i class="material-icons">arrow_forward</i> <span>${tech.current.level}</span>`;

                                if(self.ogl.current[res] < tech.current[res]) target.classList.add('insufficient');
                                else target.classList.remove('insufficient');
                            }
                        }*/
                    });

                    /* CUSTOM PUMPK1IN */
                    if(self.ogl.db.options.togglesOff.indexOf('energyCalcDetails') == -1)
                    {
                        let spoun = document.createElement("span");
                        spoun.classList.add('spoun');
                        let current_energy = document.getElementById('resources_energy').getAttribute('data-raw');

                        if( tech.id == 1 || tech.id == 2 || tech.id == 3 ) {
                            self.currentDetail.querySelector('.additional_energy_consumption .value').append(spoun);
                            let malus_value = current_energy - self.currentDetail.querySelector('.additional_energy_consumption .value').textContent;
                            if( malus_value < 0 ) self.currentDetail.querySelector('.additional_energy_consumption .value .spoun').classList.add('insufficient','resource');
                            else self.currentDetail.querySelector('.additional_energy_consumption .value .spoun').classList.add('bonus');

                            self.currentDetail.querySelector('.additional_energy_consumption .value .spoun').textContent = " (" + Util.formatNumber(Math.floor( malus_value )) + ")";
                        }
                    }
                    /* END CUSTOM PUMPK1IN */

                    updateDomTime();

                    return tech;
                }

                let container = this.currentDetail.querySelector('.sprite_large').appendChild(Util.createDom('div', {'class':'ogl_detailActions'}));

                if(this.currentDetail.querySelector('.information .level'))
                {
                    this.currentDetail.querySelector('.information .level').setAttribute('data-ratio', tech.ratio);

                    let prevButton = container.appendChild(Util.createDom('div', {'class':'ogl_button material-icons'}, 'chevron_left'));
                    let initButton = container.appendChild(Util.createDom('div', {'class':'ogl_button  material-icons'}, 'cancel'));
                    let nextButton = container.appendChild(Util.createDom('div', {'class':'ogl_button material-icons'}, 'chevron_right'));

                    prevButton.addEventListener('click', () => updateLevel(tech.current.level - 1, true));
                    initButton.addEventListener('click', () => updateLevel(tech.initial.level, true));
                    nextButton.addEventListener('click', () => updateLevel(tech.current.level + 1, true));

                    /* CUSTOM PUMPK1IN */
                    //initButton.click();
                    if(this.ogl.db.options.togglesOff.indexOf('transportsCalcDetails') == -1) initButton.click();
                    /* END CUSTOM PUMPK1IN */
                }

                let lockButton = container.appendChild(Util.createDom('div', {'class':'ogl_button material-icons'}, 'lock'));
                lockButton.addEventListener('click', () =>
                {
                    let amount = 1;
                    let levelDiff = tech.current.level - tech.initial.level;
                    if(levelDiff < 0) return;

                    if(this.currentDetail.querySelector('#build_amount'))
                    {
                        levelDiff = 0;
                        amount = parseInt(this.currentDetail.querySelector('#build_amount').value || 1);
                    }

                    for(let i=0; i<=levelDiff; i++)
                    {
                        let tmpTech = updateLevel(tech.initial.level + i);
                        let lockedTech = {};
                        lockedTech.id = tmpTech.id;
                        lockedTech.name = tmpTech.name;
                        lockedTech.amount = amount;
                        lockedTech.level = tmpTech.current.level;
                        lockedTech.metal = tmpTech.current.metal * amount;
                        lockedTech.crystal = tmpTech.current.crystal * amount;
                        lockedTech.deut = tmpTech.current.deut * amount;

                        this.ogl.component.empire.lockTech(lockedTech);
                    }
                });

                let checkInput = () =>
                {
                    let currentAmount = parseInt(this.currentDetail.querySelector('#build_amount')?.value || 1) || 1;
                    let energyProd = parseInt(this.currentDetail.querySelector('.energy_production .bonus')?.getAttribute('data-value') || 0) * currentAmount;
                    let energyConso = parseInt(this.currentDetail.querySelector('.additional_energy_consumption .value')?.getAttribute('data-value') || 0) * currentAmount;

                    if(energyProd) this.currentDetail.querySelector('.energy_production .value .bonus').textContent = `(+${Util.formatNumber(energyProd)})`;
                    if(energyConso) this.currentDetail.querySelector('.additional_energy_consumption .value').textContent = Util.formatNumber(energyConso);

                    ['metal', 'crystal', 'deut', 'energy'].forEach(res =>
                    {
                        let target = self.currentDetail.querySelector('.costs .' + res.replace('deut', 'deuterium'));
                        if(target)
                        {
                            let newValue = tech.initial[res] * currentAmount;
                            target.textContent = Util.formatToUnits(newValue);
                            target.setAttribute('data-total', newValue);
                            target.setAttribute('title', `${Util.formatNumber(newValue)} ${self.ogl.component.lang.getText(res)}`);

                            if(this.ogl.current[res] < newValue) target.classList.add('insufficient');
                            else target.classList.remove('insufficient');

                            /* CUSTOM PUMPK1IN */
                            if(this.ogl.db.options.togglesOff.indexOf('transportsCalcDetails') == -1)
                            {
                                if( this.ogl.current[res] < newValue ) {
                                    console.log(this.ogl.current[res]);
                                    console.log(newValue);

                                    let missingRessources = Math.floor(newValue - this.ogl.current[res]);
                                    let spoun = document.createElement("span");
                                    spoun.classList.add('malus', 'insufficient');

                                    let transportNeeded = '';

                                    if(this.ogl.db.options.togglesOff.indexOf('transportsNBDetails') == -1)
                                    {
                                        let PTshipData = this.ogl.db.ships[202];
                                        let GTshipData = this.ogl.db.ships[203];
                                        let PTneed = Math.ceil(missingRessources / PTshipData.capacity);
                                        let GTneed = Math.ceil(missingRessources / GTshipData.capacity);

                                        transportNeeded = ` <span style='font-size:0.95em;font-weight:normal;color:#848484;'>${PTneed} ${this.ogl.component.lang.getText('abbr202')} / ${GTneed} ${this.ogl.component.lang.getText('abbr203')}</span>`;
                                    }

                                    target.append(spoun);
                                    target.querySelector('.malus').innerHTML = " <small style='font-size:0.85em;'>(-" + Util.formatToUnits(Util.formatNumber(missingRessources)) + ")" + transportNeeded + "</small>";
                                }
                            }
                            /* END CUSTOM PUMPK1IN */
                        }
                    });

                    updateDomTime()
                }

                updateDomTime();
                Util.updateCheckIntInput(() => checkInput());

                if(this.currentDetail.querySelector('.information .level')) this.currentDetail.querySelector('.information .level').innerHTML = `Level ${tech.current.level - 1} <i class="material-icons">arrow_forward</i> <span>${tech.current.level}</span>`;

                if(this.currentDetail.querySelector('#build_amount')) // ships or def
                {
                    this.currentDetail.querySelector('#build_amount').setAttribute('onkeyup', 'checkIntInput(this, 1, 999999);event.stopPropagation();');
                    this.currentDetail.querySelector('#build_amount').addEventListener('click', () => checkInput());
                    this.currentDetail.querySelector('.maximum') && this.currentDetail.querySelector('.maximum').addEventListener('click', () => setTimeout(checkInput, 20));
                }

                this.ogl.addToUpdateQueue(() => updateFullDate());
            }
        }
    }
}

class LangManager
{
    constructor(ogl)
    {
        this.ogl = ogl;

        this.en =
        {
            abbr202 : "SC",
            abbr203 : "LC",
            abbr219 : "PF",
            abbr210 : "SP",
            planets : "planets",
            ships : "Ships",
            items : "Items",
            other : "Other",
            resources : "Resources",
            fight : "Fight",
            noMoonError : "Error, there is no moon here",
            capacityPicker : "Resources to send",
            scExpe : "Small cargo expedition",
            lcExpe : "Large cargo expedition",
            pfExpe : "Pathfinder expedition",
            allShipsRes : "Select all ships (page 1) <br>or all resources (page 2)",
            splitShipsRes : "Split all ships (page 1) <br>or all resources (page 2)",
            prevFleet : "Repeat previous fleet",
            required : "req.",
            reverseAllShipsRes : "Reverse all selected ships (page 1) <br>or all resources (page 2)",
            nextPlanet : "Go to next planet",
            prevPlanet : "Go to previous planet",
            gain : "Gain",
            timeLimits : "Day;Week;Month;All",
            spyPosition : "Spy this position",
            flagTarget : "Set next target",
            attackCurrentTarget : "Attack next target",
            noTargetSelected : "No target selected",
            timerInfo : "Last refresh",
            blackhole : "Black hole",
            signalBlackhole : "Signal a blackhole",
            moreStats : "More statistics",
            eraseData : "Erase data",
            defaultView : "Default view",
            economyView : "Economy view",
            productionView : "Production view",
            pinnedView : "Pinned target",
            targetView : "Targets list",
            oglConfig : "OGLight settings",
            defaultShip : "Default ship",
            defaultMission : "Default mission",
            autoCollect : "Collect resources",
            minifyPictures : "Minify large pictures",
            displayTimers : "Display refresh timers",
            rentaStats : "Display stats",
            excludeConso : "Exclude deut consumption from stats",
            spiesTable : "Display spies table",
            autoClean : "Autoclean spies table",
            cleanReport : "Clean spies reports",
            inFlight : "In flight",
            linkedMoons : "Linked moons",
            linkedPlanets : "Linked planets",
            kofi : "Do you like OGLight ? Then support me :)",
            wrongTarget : "Warning, the targeted planet has changed and will be removed from the list !",
            deleteSpyDef : "Delete spies agaisnt my planets",
            rentaPerDay : "Mean ($daysd)",
            totalPerDay : "Mean+prod ($daysd)",
            ignoreRaid : "Ignore this raid",
            keepOnPlanet : "to keep on planet",
            switchNameCoords : "switch coords/names",
            sendResources : "Send resources",
            sendMissingResources : "Deduct resources on the planet from the total",
            fleetDetailsName : "Display ships name in fleet details",
            onPlanets : "On planets",
            reportFound : "Top report",
            topReportDetails : "Top report details",
            playerProfile : "Player profile",
            rightMenuTooltips : "Hide right menu tooltips",
            bigShip : "Use the biggest available ship (expeditions)",
            targetListEnd : "End of targets list",
            ignoreVacation : "Hide players in vacation mode (targets list)",
            tooltipDelay : "Tooltip delay (ms)",
            timezoneMode : "Use timezone mode",
            ignoreExpeShips : "Ignore ships found in expeditions",
            /* CUSTOM PUMPK1IN */
            unfoldEventsOnOverview : "Unfold events on Overview",
            transportsCalcDetails : "Build: missing ressources (+ NB transport needed?)",
            energyCalcDetails : "Show remain/missing energy when building mines",
            /* END CUSTOM PUMPK1IN */
        }

        this.fr =
        {
            abbr202 : "PT",
            abbr203 : "GT",
            abbr219 : "EC",
            abbr210 : "SP",
            planets : "planètes",
            ships : "Vaisseaux",
            other : "Autre",
            resources : "Ressources",
            fight : "Combat",
            noMoonError : "Erreur, il n'y a pas de lune ici",
            capacityPicker : "Ressources à envoyer",
            scExpe : "Expedition au PT",
            lcExpe : "Expedition au GT",
            allShipsRes : "Selectionner tous les vaisseux (page 1) <br>ou toutes les ressources (page2)",
            splitShipsRes : "Diviser tous les vaisseux (page 1) <br>ou toutes les ressources (page2)",
            prevFleet : "Répéter la flotte précédente",
            reverseAllShipsRes : "Inverser tous les vaisseaux (page 1) <br>ou toutes ressources selectionné(e)s (page 2)",
            nextPlanet : "Se rendre sur la planète suivante",
            prevPlanet : "Se rendre sur la planète précédente",
            gain : "Gain",
            timeLimits : "Jour;Semaine;Mois;Tout",
            spyPosition : "Espionner cette position",
            flagTarget : "Définir la prochaine cible",
            attackCurrentTarget : "Attaquer la prochaine cible",
            noTargetSelected : "Aucune cible définie",
            timerInfo : "Dernier refresh",
            blackhole : 'Trou noir',
            signalBlackhole : "Signaler un trou noir",
            moreStats : "Plus de statistiques",
            eraseData : "Supprimer les données",
            defaultView : "Vue par défaut",
            economyView : "Vue économie",
            productionView : "Vue production",
            pinnedView : "Cible épinglée",
            targetView : "Liste des cibles",
            oglConfig : "Configuration d'OGLight",
            defaultShip : "Vaisseau par défaut",
            defaultMission : "Mission par défaut",
            autoCollect : "Collecter les ressources",
            cleanReport : "Nettoyer les rapports",
            minifyPictures : "Réduire les grandes images",
            displayTimers : "Afficher les timers de refresh",
            rentaStats : "Afficher les statistiques",
            excludeConso : "Ignorer la conso de deut dans les stats",
            spiesTable : "Afficher le tableau de RE",
            autoClean : 'Suppression automatique des "mauvais" RE',
            inFlight : "En vol",
            linkedMoons : "Lunes associées",
            linkedPlanets : "Planètes associées",
            kofi : "Vous aimez OGLight ? Alors soutenez-moi :)",
            wrongTarget : "Attention, la planète ciblée a changée et va être supprimée de la liste !",
            deleteSpyDef : "Supprimer les espionnages contre mes planètes",
            rentaPerDay : "Moyenne ($daysj)",
            totalPerDay : "Moyenne+prod ($daysj)",
            ignoreRaid : "Ignorer ce raid",
            keepOnPlanet : "à garder sur la planète",
            switchNameCoords : "alterner coords/noms",
            sendResources : "Envoyer les ressources",
            sendMissingResources : "Déduire les ressources à quai",
            fleetDetailsName : "Afficher le nom des vaisseaux",
            onPlanets : "A quai",
            reportFound : "Meilleur rapport",
            topReportDetails : "Détails du rapport",
            playerProfile : "Profil de la cible",
            rightMenuTooltips : "Cacher les tooltips du menu de droite",
            bigShip : "Utiliser le plus gros vaisseau disponible (expeditions)",
            targetListEnd : "Fin de la liste de cibles",
            ignoreVacation : "Cacher les joueurs en MV (liste de cibles)",
            tooltipDelay : "Délai d'ouverture des tooltips (ms)",
            timezoneMode : "Utiliser le mode décalage horaire",
            ignoreExpeShips : "Ignorer les vaisseaux trouvés lors des expéditions",
            /* CUSTOM PUMPK1IN */
            unfoldEventsOnOverview : "Déplier les événements sur la vue générale",
            transportsCalcDetails : "Build: ressources manquantes (+ PT/GT nécessaires?)",
            energyCalcDetails : "Voir énergie restante/manquante sur le build mines",
            /* END CUSTOM PUMPK1IN */
        }

        this.gr =
        {
            abbr202 : "μΜ",
            abbr203 : "ΜΜ",
            abbr219 : "PF",
            abbr210 : "ΚΣ",
            planets : "Πλανήτες",
            ships : "Πλοία",
            items : "Αντικέιμενα",
            other : "Λοιπά",
            resources : "Πόροι",
            fight : "Μάχες",
            noMoonError : "Σφάλμα, δεν υπάρχει φεγγάρι εδώ",
            capacityPicker : "Πόροι για αποστολή",
            scExpe : "Αποστολή με μικρά μεταγωγικά",
            lcExpe : "Αποστολή με μεγάλα μεταγωγικά",
            allShipsRes : "Επιλέξτε όλα τα πλοία (σελίδα 1) ή όλους τους πόρους (σελίδα 3))",
            splitShipsRes : "Διαχωρίστε όλα τα πλοία (σελίδα 1) ή όλους τους πόρους (σελίδα 3) με την επιλεγμένη τιμή (2-9)",
            prevFleet : "Επάληψη προηγούμενου στόλου",
            required : "Απαιτ.",
            reverseAllShipsRes : "Αντιστρέψτε όλα τα επιλεγμένα πλοία (σελίδα 1) ή όλους τους πόρους (σελίδα 3)",
            nextPlanet : "Πηγαίνετε στον επόμενο πλανήτη",
            gain : "Κέρδος",
            timeLimits : "Ημέρα;Εβδομάδα;Μήνας;Σύνολο",
            spyPosition : "Κατασκοπεύστε αυτήν τη θέση",
            flagTarget : "Ορίστε τον επόμενο στόχο",
            attackCurrentTarget : "Επίθεση στον επόμενο στόχο",
            noTargetSelected : "Δεν έχει επιλεγεί στόχος",
            timerInfo : "Τελευταία ανανέωση",
            blackhole : "Μαύρη τρύπα",
            signalBlackhole : "Σημειώστε μια μαύρη τρύπα",
            moreStats : "Επιπλέον στατιστικά",
            eraseData : "Διαγραφή δεδομένων",
            defaultView : "Προεπιλεγμένη προβολή",
            economyView : "Προβολή οικονομίας",
            productionView : "Προβολή παραγωγής",
            pinnedView : "Καρφιτσωμένος στόχος",
            targetView : "Λίστα στόχων",
            oglConfig : "OGLight ρυθμίσεις",
            defaultShip : "Σκάφος προεπιλογής",
            defaultMission : "Προεπιλεγμένη μετακίνηση",
            autoCollect : "Συλλέξτε πόρους",
            minifyPictures : "Ελαχιστοποίηση μεγάλων εικόνων",
            displayTimers : "Προβολή χρονόμετρων ανανέωσης",
            rentaStats : "Στατιστικά εσόδων",
            excludeConso : "Εξαίρεση της κατανάλωσης δευτερίου από τα στατιστικά",
            spiesTable : "Εμφάνιση πίνακα κατασκοπειών",
            autoClean : "Αυτόματη εκκαθάριση πίνακα κατασκοπειών",
            inFlight : "Εν πτήση",
            linkedMoons : "Συνδεδεμένα φεγγάρια",
            linkedPlanets : "Συνδεδεμένοι πλανήτες",
            kofi : "Σας αρέσει το OGLight ; Τότε υποστηρίξτε με :)",
            wrongTarget : "Προειδοποίηση, ο στοχευμένος πλανήτης δεν υπάρχει πλέον και θα αφαιρεθεί από τη λίστα!",
            deleteSpyDef : "Διαγραφή κατασκ. αναφορών των πλανητών μου",
            rentaPerDay : "Mean ($daysd)",
            totalPerDay : "Mean+prod ($daysd)",
            ignoreRaid : "Αγνόησε αυτή τη μάχη",
            keepOnPlanet : "Να παραμείνουν στον πλανήτη",
            switchNameCoords : "Εναλλαγή συντεταγμένων / ονομάτων",
            sendResources : "Αποστολή πόρων",
            sendMissingResources : "Αφαιρέστε τους πόρους στον πλανήτη από το σύνολο",
            /* CUSTOM PUMPK1IN */
            unfoldEventsOnOverview : "Επέκταση των γεγονότων στη γενική προβολή",
            transportsCalcDetails : "Δημιουργία: λείπουν πόροι (+ PT/GT απαιτείται ;)",
            energyCalcDetails : "Δείτε ενέργεια που απομένει/αλείπει στο ορυχείο",
            /* END CUSTOM PUMPK1IN */
        }

        this.ogl.performances.push(['Lang',performance.now()]);
    }

    // get text by key. priority : library > local key > english key
    getText(key)
    {
        if(this[this.ogl.universe.lang] && this[this.ogl.universe.lang][key]) return this[this.ogl.universe.lang][key];
        else if(this.ogl.db.loca[key]) return this.ogl.db.loca[key];
        else if(this.ogl.db.ships[key]?.name) return this.ogl.db.ships[key].name;
        else if(this.en[key]) return this.en[key];
        else return 'TEXT_NOT_FOUND';
    }
}

let hash = new Date('2022', '12', '14', '14', '48', '12');

if(localStorage.getItem('ogl-minipics'))
{
    GM_addStyle(`
        #supplies > header, #facilities > header, #research > header,
        #shipyard > header, #defense > header, #fleet1 .planet-header,
        #fleet2 .planet-header, #fleet3 .planet-header, #lfbuildings > header, #lfresearch > header
        {
            height:34px !important;
        }

        #overviewcomponent #planet,
        #overviewcomponent #detailWrapper
        {
            height:auto !important;
            min-height:208px !important;
            position:relative !important;
        }

        #technologydetails_wrapper
        {
            position:relative !important;
        }

        #detail.detail_screen
        {
            height:300px !important;
            position:relative !important;
        }
    `);
}

let oglcache;

GM_getTab(obj =>
{
    oglcache = obj[0] || {};
});

hash.setMonth(hash.getMonth() - 1);
hash = (Math.ceil(hash.getTime() / 1000) - 1000000000).toString().match(/.{1,3}/g);
hash = `${hash[hash.length - 2]}.${hash[hash.length - 1]}`;

function initOGLight()
{
    try { unsafeWindow.ogl = new OGLight(oglcache); }
    catch(e)
    {
        if(redirect && redirect.indexOf('https') > -1) return;

        setTimeout(() =>
        {
            let version = GM_info.script.version.indexOf('b') > -1 ? 'beta' : 'v'+GM_info.script.version;

            console.group(`[OGL ${version == 'beta' ? version+'-'+hash : version}]`);
            console.error(e);
            console.groupEnd();
            document.querySelector('.ogl_leftMenuIcon .material-icons').textContent = 'cancel';
            document.querySelector('.ogl_leftMenuIcon .material-icons').classList.add('ogl_danger');

            let errorList = [];

            let errors = e.stack.split('\n');
            errors.forEach((error, index) =>
            {
                if(index > 1) return;

                let splitted = error.split(':');
                let line = splitted[splitted.length-2];

                if(line !== 'TypeError') errorList.push('<div> ➜' + error.replace(/ *\([^)]*\) */g, '') + ':<u>' + line + '</u></div>');
                else errorList.push(`<div>${error}</div>`);
            });

            document.querySelector('#middle').appendChild(Util.createDom('div', {'class':'ogl_logs'}, `<h3>OGLight ${version} error :</h3><div>${errorList.join('')}</div>`));
        }, 100);
    }
}

if(new URL(window.location.href).searchParams.get('component') != 'empire')
{
    if(document.readyState !== 'loading') // safari mac OS fix
    {
        initOGLight();
    }
    else
    {
        window.addEventListener("DOMContentLoaded", () => initOGLight());
    }
}

const oglMaterial =
`
@font-face
{
    font-family:'Material Icons';
    font-style:normal;
    font-weight:400;
    src:local('Material Icons'), local('MaterialIcons-Regular'),
    url(data:application/octet-stream;base64,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);
}
`;

GM_addStyle(oglMaterial);