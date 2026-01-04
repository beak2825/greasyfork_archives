// ==UserScript==
// @name         Neopets: Custom Halloween Theme
// @version      0.35
// @description  A custom Halloween theme that overhauls the entire layout of the site.
// @include      http://www.neopets.com/*
// @exclude      http://www.neopets.com/userlookup.phtml?user=*
// @exclude      http://www.neopets.com/ul_preview.phtml?user=*
// @exclude      http://www.neopets.com/petlookup.phtml?pet=*
// @exclude      http://www.neopets.com/userlookup.phtml?place=*
// @run-at       document-body
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @namespace    https://greasyfork.org/users/248719
// @author       http://twitter.com/RotomDex
// @downloadURL https://update.greasyfork.org/scripts/381840/Neopets%3A%20Custom%20Halloween%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/381840/Neopets%3A%20Custom%20Halloween%20Theme.meta.js
// ==/UserScript==
var url = document.URL;
var noPremium = false; //Turn this on when premium expires

//Auto-type my PIN cuz im a fuckhead
$(function() {
    'use strict';
    var pin = "8025"; //Change this when you change PIN
    var disableAutoTypeUCPet = true;
    if($("#pin_field").val() !== 'undefined'){
        if(window.location.href.startsWith("http://www.neopets.com/convert_pet.phtml") && disableAutoTypeUCPet){}
        else{$("#pin_field").val(pin);}}});

function addGlobalStyle(css){
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) {return}
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style)}

$(function(){ // set SSW dropdown to exact
    'use strict';
    $("#ssw-criteria").val("exact")});

addGlobalStyle('.sidebar {visibility:hidden; position:absolute}'); // Kill sidebar pet

// HTML Style tags
addGlobalStyle('a:link, a:visited {color: #4B9292}'
               +'a:hover {color: #506596}');
addGlobalStyle('#neobdy.en {background-color: #999999}');
//Foundation IDs
addGlobalStyle('#main, .main_theme {border-left:1px solid #000 !important; border-right:1px solid #000 !important}'
               +'#header {background-image:url(http://images.neopets.com/themes/003_hws_9bde9/header_bg.png); background-color:#2B3447 !important;}'
               +'#footer {background-image:url(http://images.neopets.com/themes/003_hws_9bde9/footer_bg.png); background-color:#2B3447 !important;}'
               +'#content {min-height:695px !important}');
//Header Stuff
addGlobalStyle('ul.dropdown {border: 1px solid #000000;background-color: #989898;}'
               +'LI:hover UL.dropdown A, LI.over UL.dropdown A {color: #000000;}'
               +'LI:hover UL.dropdown A:Hover, LI.over UL.dropdown A:hover {color: #506596;}'
               +'.eventIcon, .user {color: #E6E9F0;}'
               +'.eventIcon A:Link, .eventIcon A:Hover, .eventIcon A:Visited, .user A:Link, .user A:Hover, .user A:Visited {color: #4B9292;}'
               //+'.eventIcon.sf {background:url("http://images.neopets.com/themes/003_hws_9bde9/events/item.png") 0px 6px no-repeat}'
               //+'.eventIcon.sf img{visibility:hidden}'
               +'#nst {color: #000000;}');
//Footer stuff
addGlobalStyle('.footerForm {color: #B0B3B9;}'
               +'.copyright, .copyright A:Link, .copyright A:Hover, .copyright A:Visited {color: #1B1B1B;}'
               +'img.footerNifty {visibility:hidden !important;}'
               +'.newPetImg {position:absolute; bottom:0px; right:0px; z-index:99; overflow:hidden;}');

//Sticks your active pet in the footer because the sidebar is Dead
$(function(){
    var active,
        leFooter = document.getElementById('footer'),
        textContent = document.body.textContent || document.body.innerText,
        isPike = textContent.indexOf("Pike")!==-1,
        isAros = textContent.indexOf("Aros")!==-1,
        isElix = textContent.indexOf("Elix")!==-1,
        isTeli = textContent.indexOf("Teli")!==-1,
        isMizand = textContent.indexOf("mizand")!==-1;
    if (isPike){
        active = "https://i.imgur.com/ePKNmbn.png";
        leFooter.insertAdjacentHTML('afterbegin', '<a href="http://www.neopets.com/quickref.phtml">'
                                    +'<img src="'+active+'" class="newPetImg" height="170px"></a>')}
    else {
        if(isAros){
            active = "https://i.imgur.com/gdQJE2c.png";
            leFooter.insertAdjacentHTML('afterbegin', '<a href="http://www.neopets.com/quickref.phtml">'
                                        +'<img src="'+active+'" class="newPetImg" height="170px"></a>')}
        else {
            if(isElix){
                active = "https://i.imgur.com/C3OkA1N.png";
                leFooter.insertAdjacentHTML('afterbegin', '<a href="http://www.neopets.com/quickref.phtml">'
                                            +'<img src="'+active+'" class="newPetImg" height="170px"></a>')}
            else {
                if(isMizand){
                    active = "https://i.imgur.com/sbRnWWr.png";
                    leFooter.insertAdjacentHTML('afterbegin', '<a href="http://www.neopets.com/quickref.phtml">'
                                                +'<img src="'+active+'" class="newPetImg" height="170px"></a>')}
                else {
                    if(isTeli){
                        active = "https://i.imgur.com/MMxJHj4.png";
                        leFooter.insertAdjacentHTML('afterbegin', '<a href="http://www.neopets.com/quickref.phtml">'
                                                    +'<img src="'+active+'" class="newPetImg" height="170px"></a>')}
                    else {
                        active = "http://images.neopets.com/themes/003_hws_9bde9/rotations/9.png";
                        leFooter.insertAdjacentHTML('afterbegin', '<a href="http://www.neopets.com/quickref.phtml">'
                                                    +'<img src="'+active+'" class="newPetImg"></a>')}}}}}}
 );
//Module Styles
addGlobalStyle('.contentModuleHeader {background-color: #20283E; color: #EFEFEF;}'
               +'.contentModuleHeader A:Link, .contentModuleHeader A:Hover, .contentModuleHeader A:Visited {color: #C5C5C5;}'
               +'.moreLink {border: 1px solid #8F8F8F;}'
               +'.contentModuleHeaderAlt {background-color: #5D709B; color: #FFFFFF;}'
               +'.contentModuleHeaderAlt A:Link, .contentModuleHeaderAlt A:Hover, .contentModuleHeaderAlt A:Visited {color: #C2CADA;}'
               +'.moreLinkAlt {border: 1px solid #D8DCE7;}');
// MAMABAR
addGlobalStyle('ul.brand-mamabar-list a {display: block; line-height: 18px; color: #9a9a9a; font-size: 11px; text-decoration: none;}'
               +'font-weight: bold; font-family: Arial, Helvetica, sans-serif;}'
               +'ul.brand-mamabar-list a:hover {text-decoration: underline;}');
// Active State MAMABAR
addGlobalStyle('ul.brand-mamabar-list a.brand-mamabar-active {color: #4B9292; cursor: default;}');
/* Sidebar crap
addGlobalStyle('.sidebarModule {border:1px solid #FFFFFF !important;}'
              +'.sidebarTable {border:1px solid #FFFFFF !important;}'
              +'.sidebarHeader {border:1px solid #FFFFFF !important; background-color: #6d75a2;}'
              +'.sidebarModule {border:1px solid #FFFFFF !important;}'
              +'.sidebarHeader img {display:none !important;}'
              +'.sidebarHeader.medText {border-top:0px solid #FFFFFF !important; color:#FFFFFF !important;}'
              +'.activePet img {border:0px solid #000000 !important;}'
              +'.neopetPhrase.sf {border-bottom:2px solid #FFFFFF !important;}' // border under the neopet saying something
              +'.neofriend form {line-height:2px !important;}' // doesn't seem to change anything
              +'.sidebarHeader.medText a {color:#FFFFFF !important;}'
              +'.activePet {border-bottom:3px solid #FFFFFF !important;}'
              +'.button-link-online {background:#6d75a2 !important; text-shadow:none !important; border:none !important; box-shadow: none !important}' // Neomail button on friends list
              +'.button-link-online:hover {background:#6e76a3 !important;}' // Neomail button on friends list
              +'.neofriend {padding-top:5px !important;}');
*/
// Games Room crap
addGlobalStyle('.gamesRoomDarkModule .rcModuleContent {border-color: #282b58 !important;}'
               +'.gamesRoomDarkModule .rcModuleHeader, .gamesRoomDarkModule .rcModuleTopLeft,.gamesRoomDarkModule .rcModuleTopRight {background-color: #282b58 !important;}'
               +'.gamesRoomCategoryList .rcSelectedTab {background-color:#282b58 !important;}');
// Pet lookups
if (url === 'http://www.neopets.com/petlookup.phtml'){
    addGlobalStyle('#content table {width:465px}'
                   +'#content table tr{padding-bottom:5px}'
                   +'#CustomNeopetView {width:400px; height:400px; padding-top:4px; padding-bottom:4px}')}
// Everything BUT the Games Room
if(!url.includes('/games/')){
    if(!url.includes('snowager')){
        if(!url.includes('/dome/')){
            if(!url.includes('/quests')){
                addGlobalStyle('.content {padding-left:20px; padding-right:20px;}');}}}} // indent everything 20px
// News page edits
if (url.includes('/nf.phtml')){
    addGlobalStyle('.content {padding-left:70px; padding-right:70px;}');
    // delete the half of the new features table that is ugly
    $(function(){
        $('.content > table:nth-of-type(1) > tbody > tr > td:nth-of-type(3)').hide()});
    addGlobalStyle('#newfeatures {width:700px !important; height:100% !important;}'
                   +'#newfeatures div {padding-right:0px !important}')}
// If the pages AREN'T neoboards/neomail, make all the borders go away
if(!url.includes('neoboards')){
    if (!url.includes('/neomessages')){
        addGlobalStyle('.contentModuleTable {border:0px solid #FFFFFF !important;}'
                       +'.contentModule {border:0px solid #FFFFFF !important;}'
                       +'.medText {border:0px solid #FFFFFF !important;}'
                       +'td img {border:0px solid #dfdfdf !important;}')}}
// Inventory edits
addGlobalStyle('.neopointItem {border:1px solid #999 !important;)'
               +'.otherItem {border:1px solid #999 !important;)'); // Border around items
if(url.includes('/inventory')){
    addGlobalStyle('table.inventory {padding-top:2px !important;}'
                   +'.contentModule {border:1px solid #000 !important}')}
// Quick Ref edits
if(url.includes('quickref')){
    addGlobalStyle('.contentModule {margin-left: 75px !important; border:1px solid #3f3f3f !important; width:805px;}')}
// SDB edit
if(url.includes('safetydeposit.phtml')){
    addGlobalStyle('.content form table {width:90% !important; margin:auto}'
                   +'.content form table tbody tr td img {border:1px solid #000 !important; margin:3px 0 3px 0}')}
// Shop Wizard changes
if(url.includes('type=wizard')){
    addGlobalStyle('.contentModule {width:700px; margin: 0 auto}')}
// Bank page edit
if(url.includes('bank.phtml')){
    addGlobalStyle('td.content div table {text-align:center !important; margin: 0 auto}')}
// NeoBoard topics
if(url.includes('neoboards/boardlist.phtml?board')){
    addGlobalStyle('.blistSmall {padding-top: 5px !important; padding-bottom: 5px !important; padding-right:2px !important; padding-left:5px !important}'
                   +'a.blistTopic.light {line-height:2.2 !important;}'
                   +'.blistSmall {line-height:1 !important;}')}
// My shop
if(url.includes('market.phtml?type=your')){
    addGlobalStyle('td.content form table{margin-left:auto; margin-right:auto}')}
// The actual NeoBoard posts
if(url.includes('neoboards/topic')){
    addGlobalStyle('#boards_table {margin-left:auto; margin-right:auto; width:750px !important; word-wrap: break-word !important;}'
                   +'.topicAuthor.sf {word-wrap: break-word !important; width:160px !important; padding-left:8px; padding-right:8px; padding-top:6px}'
                   +'.topicAuthor.sf table {word-wrap: break-word !important; margin-top:-5px}'
                   +'.topicAuthor.sf table tbody tr td.sf {padding-top:5px;}'
                   +'.sf img {margin-right:5px}'
                   +'.topicAuthor.sf strong.medText {top:10px !important; bottom:-10px !important}'
                   +'.topic font {font-size: 0.8vmax !important;}'
                   +'.topic {padding-left:10px;padding-right:10px;}'
                   +'.content div form table tbody tr td textarea {width:560px; margin-right:20px}'
                   +'.content div form table {width:152px; margin: 0 auto}'
                   +'.content div form table tbody tr td table tbody tr td {padding-left:18px;padding-top:3px}')}
// Neoboard Preferences
if(url.includes('neoboards/preferences')){
    $(function(){$('.content > form:nth-child(15) > table:nth-child(3)').css({"margin": "auto", "width": "100%"});})}
// Neolodge selectors for lazy idiots (me)
if(url.includes('neolodge')){
    $(function(){ 'use strict';
                 $('select[name=hotel_rate]').val(5);
                 $('select[name=nights]').val(28);
                 $('.content > form:nth-child(7) > p:nth-child(3) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > select:nth-child(1)')
                     .find('option').get(0).remove();})}
// No premium fixes start here
if(noPremium === true){
    addGlobalStyle('#content {min-height:100% !important}');
    // Bank
    if(url.includes('bank')){
        $(function(){ $('.content > div:nth-of-type(2) > table > tbody > tr:nth-of-type(1) > td:nth-of-type(2)').hide()});}
    // Items transfer page
    if(url.includes('/items/transfer_list')){
        $(function(){
            $('.content > div:nth-child(1)').hide()});
        addGlobalStyle('#content table tbody tr td.content div {width:950px !important;margin:auto}'
                       +'.itemTable{margin:auto}'
                       +'#NP160 {display:none}')}
    // Quick ref
    if(url.includes('quickref')){
        $(function(){ $('#content > table > tbody > tr > td.content > div:nth-child(3)').hide()});
        addGlobalStyle('#NP300x250 {display:none}'
                      +'#nav, table#nav {margin:auto !important; float:none; padding-bottom:10px}');}
    // Events Page
    if(url.includes('allevents')){
        $(function(){
            $('.content > div:nth-child(1)').hide()});
        addGlobalStyle('#content table tbody tr td.content div {width:950px !important;margin:auto}')}
    // Pin Prefs Page
    if(url.includes('pin_prefs')){
        $(function(){$('.content > div:nth-child(1)').hide()});
        addGlobalStyle('#content table tbody tr td.content div {width:100% !important;margin:auto}')}
    // Neoboard Prefs
    if(url.includes('neoboards/preferences')){
        $(function(){$('.content > form:nth-child(19) > table:nth-child(3)').css({"margin": "auto", "width": "100%"});})}
    // Neolodge
    if(url.includes('neolodge')){
        addGlobalStyle('#content table tbody tr td.content div {width:100% !important;margin:auto}');
        $(function(){$('.content > div:nth-child(1)').hide()});
        $(function(){$('#content > table > tbody > tr > td.content > div:nth-child(2) > form > table:nth-child(4) > tbody > tr > td:nth-child(2) > select').find('option').get(0).remove()})}
    // News page
    if(url.includes('/nf')){
        addGlobalStyle('#np_playbuzz_1x1{display:none}');}
    // Shop Wizard
    if(url.includes('type=wizard')){
        addGlobalStyle('.content div{width:920px !important; margin: 0 auto;text-align:center} .contentModule {width:500px !important; margin: 0 auto}');
        $(function(){$('#content > table > tbody > tr > td.content > div:nth-child(1)').hide()})}
}