// ==UserScript==
// @name         Neopets: Custom Theme
// @version      0.7.4
// @description  A custom theme that overhauls the entire layout of the site.
// @include      http://www.neopets.com/*
// @namespace    https://greasyfork.org/users/322117
// @author       http://twitter.com/Automalix
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/390699/Neopets%3A%20Custom%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/390699/Neopets%3A%20Custom%20Theme.meta.js
// ==/UserScript==
var url = document.URL;
function documentReady(fn) {
    // see if DOM is already available
    if (document.readyState === "complete" || document.readyState === "interactive") setTimeout(fn, 1);
    else document.addEventListener("DOMContentLoaded", fn);
}

var style = document.createElement('style');
function addGlobalStyle() {
    if (!document.getElementsByTagName('head')[0]) return;
    style.type = 'text/css';
    style.innerHTML = "";
    document.getElementsByTagName('head')[0].appendChild(style)
}
addGlobalStyle();
function addCSS(css){
    style.innerHTML += css;
}

try {
    documentReady(function(){
        if(document.getElementById("main") == undefined || document.getElementById("main") == null) {
            document.getElementsByTagName('body')[0].style.backgroundColor = "white !important"}
    })
    var link = document.createElement('link');
    /*  link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'http://images.neopets.com/css/themes/003_hws_9bde9.css'; // can change this if u want a not-halloween theme
        document.getElementsByTagName(`head`)[0].appendChild(link) /**/
} catch(ex){console.log(ex)}

/* Appending HALLOWEEN Theme CSS */
addCSS(`BODY{background-color:#999;overflow-x: hidden;font-family: Verdana, Arial, Helvetica, sans-serif; font-size:9pt;}A:Link,A:Visited{color:#4b9292}A:Hover{color:#506596}#main,.main_theme{border-left:2px solid #747474;border-right:2px solid #747474}#header{background-color:#2b3447;background-image:url(http://images.neopets.com/themes/003_hws_9bde9/header_bg.png)}#footer{background-color:#2b3447;background-image:url(http://images.neopets.com/themes/003_hws_9bde9/footer_bg.png)}ul.dropdown{border:1px solid #000;background-color:#989898}LI.over UL.dropdown A,LI:hover UL.dropdown A{color:#000}LI.over UL.dropdown A:hover,LI:hover UL.dropdown A:Hover{color:#506596}.eventIcon,.user{color:#e6e9f0}.eventIcon A:Hover,.eventIcon A:Link,.eventIcon A:Visited,.user A:Hover,.user A:Link,.user A:Visited{color:#4b9292}#nst{color:#000}.sidebarModule{border:2px solid #e4e4e4}.sidebarTable{border:2px solid #c9c9c9}.sidebarHeader{background-color:#4b9292;border-bottom:2px solid #c9c9c9}.sidebarHeader A:Hover,.sidebarHeader A:Link,.sidebarHeader A:Visited{color:#b9dbdb}.contentModuleHeader{background-color:#20283e;color:#b0b3b9}.contentModuleHeader A:Hover,.contentModuleHeader A:Link,.contentModuleHeader A:Visited{color:#c5c5c5}.moreLink{border:1px solid #8f8f8f}.contentModuleHeaderAlt{background-color:#5d709b;color:#e6e9f0}.contentModuleHeaderAlt A:Hover,.contentModuleHeaderAlt A:Link,.contentModuleHeaderAlt A:Visited{color:#c2cada}.moreLinkAlt{border:1px solid #d8dce7}.rcModuleHeader,.rcModuleHeader a,.rcModuleHeader a:hover,.rcModuleHeader a:link,.rcModuleHeader a:visited{color:#fff}.gamesRoomDarkModule .rcModuleContent{border-color:#20283e}.gamesRoomDarkModule .rcModuleContentOuter{border-color:#d0d3d9}.gamesRoomDarkModule .rcModuleHeader,.gamesRoomDarkModule .rcModuleTopLeft,.gamesRoomDarkModule .rcModuleTopRight{background-color:#20283e}.gamesRoomDarkModule .rcModuleBottomLeft{background:transparent url(http://images.neopets.com/themes/003_hws_9bde9/games/bot_left_corner_dark.png) no-repeat top left}.gamesRoomDarkModule .rcModuleBottomRight{background:transparent url(http://images.neopets.com/themes/003_hws_9bde9/games/bot_right_corner_dark.png) no-repeat top right}.rcModuleHeader,.rcModuleHeader a,.rcModuleHeader a:hover .rcModuleHeader a:visited,.rcModuleHeader a:link{color:#fff;text-decoration:none}.gamesRoomLiteModule .rcModuleContent{border-color:#5d709b}.gamesRoomLiteModule .rcModuleContentOuter{border-color:#d0d3d9}.gamesRoomLiteModule .rcModuleHeader,.gamesRoomLiteModule .rcModuleTopLeft,.gamesRoomLiteModule .rcModuleTopRight{background-color:#5d709b}.gamesRoomLiteModule .rcModuleBottomLeft{background:transparent url(http://images.neopets.com/themes/003_hws_9bde9/games/bot_left_corner_lite.png) no-repeat top left}.gamesRoomLiteModule .rcModuleBottomRight{background:transparent url(http://images.neopets.com/themes/003_hws_9bde9/games/bot_right_corner_lite.png) no-repeat top right}.gamesRoomCategoryList .rcNavTab{background-color:#5d709b}.gamesRoomCategoryList .rcSelectedTab{background-color:#20283e}a #carouselPrev{background:transparent url(http://images.neopets.com/themes/003_hws_9bde9/games/btn_back_arrow.png) no-repeat top right}a #carouselNext{background:transparent url(http://images.neopets.com/themes/003_hws_9bde9/games/btn_next_arrow.png) no-repeat top right}a:hover #carouselPrev{background:transparent url(http://images.neopets.com/themes/003_hws_9bde9/games/btn_back_arrow_ov.png) no-repeat top right;cursor:pointer}a:hover #carouselNext{background:transparent url(http://images.neopets.com/themes/003_hws_9bde9/games/btn_next_arrow_ov.png) no-repeat top right;cursor:pointer}.gamesBtn .btnLeft{background:transparent url(http://images.neopets.com/themes/003_hws_9bde9/games/btn_left_sel.png) no-repeat top left}.gamesBtn .btnRight{background:transparent url(http://images.neopets.com/themes/003_hws_9bde9/games/btn_right_sel.png) no-repeat top left}.gamesBtn .btnCenter{background:transparent url(http://images.neopets.com/themes/003_hws_9bde9/games/btn_center_sel.png) no-repeat top left}.gamesBtn a .btnLeft{background:transparent url(http://images.neopets.com/themes/003_hws_9bde9/games/btn_left.png) no-repeat top left}.gamesBtn a .btnRight{background:transparent url(http://images.neopets.com/themes/003_hws_9bde9/games/btn_right.png) no-repeat top left}.gamesBtn a .btnCenter{background:transparent url(http://images.neopets.com/themes/003_hws_9bde9/games/btn_center.png) no-repeat top left}.gamesBtn a,.gamesBtn a:hover,.gamesBtn a:link,.gamesBtn a:visited{color:#fff}.gamesBtn a:hover .btnLeft{background:transparent url(http://images.neopets.com/themes/003_hws_9bde9/games/btn_left_ov.png) no-repeat top left}.gamesBtn a:hover .btnRight{background:transparent url(http://images.neopets.com/themes/003_hws_9bde9/games/btn_right_ov.png) no-repeat top left}.gamesBtn a:hover .btnCenter{background:transparent url(http://images.neopets.com/themes/003_hws_9bde9/games/btn_center_ov.png) no-repeat top left}.showAllWrap .rcModuleContent{background:transparent url(http://images.neopets.com/themes/003_hws_9bde9/games/showallbg.jpg) no-repeat top left}#showAllSorting{color:#fff}.category{background-color:#20283e;color:#fff}.footerForm{color:#b0b3b9}.copyright,.copyright A:Hover,.copyright A:Link,.copyright A:Visited{color:#1b1b1b}#ban,.ban_theme_bg{background-color:#747474;background-image:url(http://images.neopets.com/themes/003_hws_9bde9/banner_bg.png)}.marqueeSlot,.marqueeSlot A:Hover,.marqueeSlot A:Link,.marqueeSlot A:Visited{background-color:#5d709b;color:#e6e9f0}.marqueeSlotOn,.marqueeSlotOn A:Hover,.marqueeSlotOn A:Link,.marqueeSlotOn A:Visited{background-color:#4b5a7e;color:#e6e9f0}ul.brand-mamabar-list a{display:block;line-height:18px;color:#9a9a9a;font-size:11px;text-decoration:none;font-weight:700;font-family:Arial,Helvetica,sans-serif}ul.brand-mamabar-list a:hover{text-decoration:underline}ul.brand-mamabar-list a.brand-mamabar-active{color:#4b9292;cursor:default}`);

/* Ad destroyer 9000 */
addCSS(`#ban, td[width="304"][valign="top"][align="left"], div[style="position: relative; float: right; width: 160px; height: 630px; margin-left: 5px;"],div[style="width: 400px; text-align: center; margin-top: 20px; margin-left: auto; margin-right: auto; margin-bottom: 10px;"],#NP_300x250_BTF, .adBox, #fb1kcode, #NP160, #NP300x250, #np_playbuzz_1x1, #invMrec
{display:none !important; height:0.01px !important; width:0.01px !important; position:absolute !important; top:0}`);

// Kill sidebar
addCSS(`.sidebar {visibility:hidden; position:absolute; left:-99px;}`);
// Kill footer image
addCSS(`img.footerNifty {visibility:hidden !important;} .newPetImg {position:absolute;bottom:0px;right:0px;z-index:99;overflow:hidden;}`);

/* content is to made the min-height of the page not teeny
removing bdTower helps align the bd. various other fixes */
addCSS(`#content {min-height:76vh !important;}
#bdTower {display:none;}
.content > table {margin:0 auto !important}
div[style="width: 635px;"]{width: 100% !important}
body[bgcolor="white"], body[bgcolor="#ffffff"] {background-color: #FFF !important}
.bx-wrapper {text-align:center}
input[type="radio"] {margin-bottom: 8px; margin-top: -5px;}`);
/*Trudys surprise*/
if(url.includes("trudys_surprise")) addCSS(`.content > div:nth-child(2) {width:100% !important;}`)

//* Auto-type my PIN cuz im a fuckhead
documentReady(function () {
    "use strict";
    let pin = "8025", //Change this when you change PIN
        disableAutoTypeUCPet = true;
    if (document.querySelector("#pin_field") !== null && document.querySelector("#pin_field").value !== 'undefined') {
        if (url === "http://www.neopets.com/convert_pet.phtml" && disableAutoTypeUCPet) return;
        else document.querySelector("#pin_field").value = pin;
    }});
//* Sticks active pet in the footer because the sidebar is Dead
documentReady(function(){
    try {
        var active, textContent, isPike, isAros, isElix, isMizand, rand, addToFooter;
        rand = Math.floor(Math.random() * 11 + 1);
        addToFooter = document.getElementById('footer');
        textContent = document.body.textContent || document.body.innerText;
        isPike = textContent.indexOf("Pike") !== -1;
        isAros = textContent.indexOf("Aros") !== -1;
        isElix = textContent.indexOf("Elix") !== -1;
        isMizand = textContent.indexOf("mizand") !== -1;

        if(addToFooter) {
            if (isPike) {
                active = "https://i.imgur.com/ePKNmbn.png";
                addToFooter.insertAdjacentHTML('afterbegin', '<a href="http://www.neopets.com/quickref.phtml">' +
                                               '<img src="' + active + '" class="newPetImg" height="170px"></a>')
            }
            else if (isAros) {
                active = "https://i.imgur.com/gdQJE2c.png";
                addToFooter.insertAdjacentHTML('afterbegin', '<a href="http://www.neopets.com/quickref.phtml">' +
                                               '<img src="' + active + '" class="newPetImg" height="170px"></a>')
            }
            else if (isElix) {
                active = "https://i.imgur.com/C3OkA1N.png";
                addToFooter.insertAdjacentHTML('afterbegin', '<a href="http://www.neopets.com/quickref.phtml">' +
                                               '<img src="' + active + '" class="newPetImg" height="170px"></a>')
            }
            else if (isMizand) {
                active = "https://i.imgur.com/sbRnWWr.png";
                addToFooter.insertAdjacentHTML('afterbegin', '<a href="http://www.neopets.com/quickref.phtml">' +
                                               '<img src="' + active + '" class="newPetImg" height="170px"></a>')
            }
            else {
                active = "http://images.neopets.com/themes/003_hws_9bde9/rotations/" + rand + ".png";
                addToFooter.insertAdjacentHTML('afterbegin', '<a href="http://www.neopets.com/quickref.phtml">' +
                                               '<img src="' + active + '" class="newPetImg"></a>')
            }
        }
    } catch(ex){}
});
// Shop Till Auto-Fill
if (url.includes('market.phtml?type=till')) {
    try{
        var np = document.body.innerHTML.match(/You currently have <b>([0-9,\,]*) NP<\/b> in your till./)[1];
        np = np.replace(/,/g, '');
        if (np == 0) return;
        document.querySelector('[name="amount"]').value = np;
    }
    catch(e){}
}
// Neolodge selectors for lazy idiots (me)
if (url.includes('neolodge')){
    documentReady(function () {
        'use strict';
        document.querySelector('select[name=hotel_rate]').value = 5;
        document.querySelector('select[name=nights]').value = 28;
        document.getElementsByName("pet_name")[0][0].remove();
    });
}

// Pet lookups
if (url === 'http://www.neopets.com/petlookup.phtml') {
    addCSS(`#content table {width:465px}
    #content table tr{padding-bottom:5px}
    #CustomNeopetView {width:400px;height:400px;padding-top:4px;padding-bottom:4px}`);
}
//* Everything BUT the specified indent 20px
if (!url.includes('/games/') && !url.includes('snowager') && !url.includes('/dome/') && !url.includes('/quests') &&
    !url.includes('userlookup') && !url.includes('ul_preview') && !url.includes('petlookup')) {
    addCSS(`.content {padding-left:20px; padding-right:20px;}`);
}
//* Extra padding for the battledome bc it's a bastard
if (url.includes('/dome/')){
    addCSS(`#bdWrapper {padding-left:80px}`);
}
//* Lab Ray
if (url.includes('/lab2.phtml')) {
    addCSS(`#bxwrap {display:inline-block; margin-left:90px;}`);
}
// News page edits
if (url.includes('/nf.phtml')) {
    addCSS(`.content {padding-left:70px; padding-right:70px;}
    .content > table:nth-of-type(1) > tbody > tr > td:nth-of-type(3) {display:none}
    #newfeatures {width:700px !important; height:100% !important;}
    #newfeatures div {padding-right:0px !important}`);
}
// If the pages AREN'T neoboards/neomail, make all the borders go away
if (!url.includes('neoboards') && !url.includes('/neomessages')) {
    addCSS(`.contentModuleTable {border:0px solid #FFFFFF !important;}
    .contentModule {border:0px solid #FFFFFF !important;}
    .medText {border:0px solid #FFFFFF !important;}
    td img {border:0px solid #dfdfdf !important;}`);
}
/* -------------- Inventory edits  ------------------ */

// Border around items
addCSS(`.neopointItem {border:1px solid #999 !important;}
.otherItem {border:1px solid #999 !important;}`);

if (url.includes('/inventory')) {
    addCSS(`table.inventory {padding-top:2px !important;}
    .contentModule {border:1px solid #000 !important}`);
}
// Quick Ref edits
if (url.includes('quickref')) {
    addCSS(`.contentModule {margin-left: 75px !important; border:1px solid #3f3f3f !important; width:805px;}`);
}
// SDB edit
if (url.includes('safetydeposit.phtml')) {
    addCSS(`.content form table {width:90% !important; margin:auto}
    .content form table tbody tr td img {border:1px solid #000 !important; margin:3px 0 3px 0}`);
}
// Shop Wizard changes
if (url.includes('type=wizard')) {
    addCSS(`.contentModule {width:700px; margin: 0 auto}`);
}
// NeoBoard topics
if (url.includes('neoboards/boardlist.phtml?board')) {
    addCSS(`.blistSmall {padding: 5px 2px 5px 5px !important;line-height:1 !important;}
    a.blistTopic.light {line-height:2.2 !important;}`);
}
// My shop
if (url.includes('market.phtml?type=your')) {
    addCSS(`.content > form:nth-child(18) > table:nth-child(4) {margin: 0 auto; background-color:#ffffcc;}`);
}
// The actual NeoBoard posts
if (url.includes('neoboards/topic')) {
    addCSS(`
    #boards_table {margin:0 auto; width:750px !important;word-wrap: break-word !important;}
    .topicAuthor.sf {word-wrap: break-word !important; width:160px !important; padding: 6px 8px 0 8px;}
    .topicAuthor.sf table {word-wrap: break-word !important; margin-top:-5px}
    .topicAuthor.sf table tbody tr td.sf {padding-top:5px;}
    .sf img {margin-right:5px}
    .topicAuthor.sf strong.medText {top:10px !important; bottom:-10px !important}
    .topic font {font-size: 0.9vmax !important;}
    .topic {padding-left:10px; padding-right:10px;}
    .content div form table tbody tr td textarea {width:560px; margin-right:20px}
    .content div form table {width:152px; margin: 0 auto}
    .content div form table tbody tr td table tbody tr td {padding-left:18px; padding-top:3px}
    `);
}
// Neoboard Preferences
if (url.includes('neoboards/preferences')) {
    addCSS(`
    .content > form:nth-child(16) > table:nth-child(3) {margin:auto;width:86.1%;}
    form{width:80%;margin:auto;}
    `);
}