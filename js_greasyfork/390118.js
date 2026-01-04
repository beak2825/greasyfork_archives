// ==UserScript==
// @name         Goatlings: Custom Halloween Theme
// @version      0.44
// @description  Complete overhaul of the Goatlings site theme
// @namespace    https://greasyfork.org/en/users/322117
// @author       Felix G. "Automalix"
// @match        http://www.goatlings.com/*
// @match        http://www.goatlings.com
// @run-at       document-body
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/390118/Goatlings%3A%20Custom%20Halloween%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/390118/Goatlings%3A%20Custom%20Halloween%20Theme.meta.js
// ==/UserScript==

/* None of this script allows for an unfair advantage playing any of the games,
fighting enemies, or buying items from shops/auctions/trades. It is 100% cosmetic ONLY. */

var url = document.URL;
var idContent = document.getElementById('content');
var textContent = document.body.textContent || document.body.innerText;

// Function lets you append new CSS values into the head of page
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) {return;}
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);}

// Auth Token
var urls = [], l = document.links;
for(var h=0; h<l.length; h++){
    urls.push(l[h].href);}
var list = urls.toString();
var pos = list.indexOf("logout");
var auth1 = pos + 7;
var auth2 = pos + 39;
var token = list.slice(auth1, auth2);
console.log('current auth token ' + token);
// End Auth Token

// Background (the part that isn't the content)
addGlobalStyle ('body {background-image:url(https://i.imgur.com/2AH21GH.png); background-color:#12101b; color:white} ');

// Remove header image and center all tables
addGlobalStyle ('#header img {visibility:hidden; margin-top:-125px;}'
                +'#content table{margin-left:auto; margin-right:auto;}');

// Changing the main content div, colour changes, and centering stuff after I took out the sidebar
addGlobalStyle ('#content {width:860px; min-height: 580px; padding-left:25px; padding-right:25px; margin-left:15px; margin-top:-3px; background-color:#2c2b2f}'
                +'a {color:#ff8136} a:hover {color:#f5a06e}'
                +'hr, .item-invent-view {border-color:#954471}'
                +'#wrapper {background-color:#221d29}'
                +'.news-post {background-color:#222 !important; border-color:#954471; padding:15px}'
                +'.button {background-color:#954471; border-color:#d56b95;} .button:hover{background-color:#af618c}'
                +'.item-hover{background-color:#2c2b2f}'
                +'textarea, input {color:#fff; background-color:#954471; border:1px solid #d56b95; border-radius:3px; padding: 1px 0 1px 0}'
                +'select {color:#fff; background-color:#954471; border:1px solid #d56b95; border-radius:3px}'
                +'.item_area, .profile-info, .forum-post, .news-post {margin-left:auto; margin-right:auto}'
                +'.forum-post-info {border-right:0px solid #ae8960;}'
                +'.pet-profile-box {margin-left:60px;}'
                +'.profile-part-one {text-align:center; width:200px; margin-left:100px;}'
                +'.profile-part-one table {width:200px; padding-left:15px;}'
                +'.profile-part-two {text-align:center; width:200px; margin-left:125px;}'
                +'#wrapper #content #n {margin-right:35px;}'
                +'.random_event{margin:auto !important}'
                +'.flash_data, .bank-area, .page-title{border-color:#954471}'
                +'.profile-info, .pet-profile-box, .pet-profile-box-two {border-color:#954471}'
                +'.mypets-pet {border-color:#954471; line-height:0.1px}'
                +'.mypets-pet a{line-height:14px}'
                +'.mypets-pet img{margin-bottom:8px}');

// Kill Sidebar Images
addGlobalStyle ('.search-top img, .search-med img, .search-bot img, .navlink img {display:none;}');

// HA Buddy Image Positioning
addGlobalStyle ('#sidebar {margin-left:30px; margin-top:-193px !important; visibility:hidden; height:97px !important; width:100px !important; position:absolute;}'
                +'#sidebar img {height:100px; border-radius:80px; visibility:visible !important;}'
                +'#newb {visibility:visible;');

// Active Goat Image Positioning
addGlobalStyle ('#active_pet_image img{margin-left:-117px; margin-top:-147px !important; visibility:visible !important; position:absolute; width:105px; height:105px;}');

// Brand spankin' new search bar
addGlobalStyle ('.search-mid input{visibility:hidden !important;background-image: none !important;}'
                +'.search-new {color:#ffffcd; margin-top:5px; margin-bottom:-15px;}');

// The Dropdown CSS
addGlobalStyle ('#user-info-wrap {margin-top:-15px} #navigation {text-align: left;width: 100%;height: 31px;} #template_nav {margin-top:-37px !important;'
                +'margin-left:25px !important;height: 31px;list-style: none; padding: 0;} ul.dropdown {width: auto; list-style: none; white-space: nowrap;'
                +'position: absolute;top: 30px;left: 5px;padding: 4px 7px 4px 4px;margin: 0px;}li.nav_image {float: left;position: relative;list-style: none;'
                +'z-index: 9000; margin-left: 2px;} li ul.dropdown {display: none; text-align: left; list-style: none; z-index: 5; font-size: 8pt; line-height: 14px;'
                +'text-decoration: none; font-weight: lighter;} li>ul {top: auto; left: auto;} LI:hover UL.dropdown, LI.over UL.dropdown {display: block;}'
                +'ul.dropdown {border: 4px solid #af618c; border-top: 0px solid black; border-radius:5px; background-color: #954471;} LI:hover UL.dropdown A, LI.over UL.dropdown A {color: #f8c4c8;}'
                +'LI:hover UL.dropdown A:Hover, LI.over UL.dropdown A:hover {color: #faf4e6;} ul ul ul {left: 100%; top: 0;}');

// Widen the forum tables
var hasEmoticons = textContent.indexOf("special codes")!==-1;
if(url.includes('/forums')){
    if(hasEmoticons) {
        addGlobalStyle ('table{width:500px !important;}');
    }
    else {
        addGlobalStyle ('#content table {margin-left:auto; margin-right:auto; width:800px;}'
                        +'td {padding-left:5px !important;}');
        addGlobalStyle ('div.forum-reply table{width:200px !important;}');
    }
    addGlobalStyle('tr {background-color:#3d3c42; border:2px solid #954471}'
                  +'.forum-post, .forum-post-info {border-color:#954471; background-color:#222;}'
                  +'.forum-post{margin:10px auto 0 auto; padding:10px}');
}

// Appending the new Header, and all of the dropdown links.
var theHeader = document.getElementById('header');
theHeader.insertAdjacentHTML('beforebegin', '<img src="https://i.imgur.com/C7pynMN.png" id="#newb">');
theHeader.insertAdjacentHTML('beforebegin', '<ul id="template_nav"><li class="nav_image"><a href="http://www.goatlings.com/"><img src="https://i.imgur.com/4Br88bA.png" alt="" width="72"'
                             +'height="31" border="0"></a></li><li class="nav_image"><a href="http://www.goatlings.com/townmap/"><img src="https://i.imgur.com/4Br88bA.png" alt="" width="72"'
                             +'height="31" border="0"></a><ul class="dropdown"><li><a href="http://www.goatlings.com/Palace">» Palace</a></li><li><a href="http://www.goatlings.com/fountain">'
                             +'» Fountain</a></li><li><a href="http://www.goatlings.com/clubs">» Clubs</a></li><li><a href="http://www.goatlings.com/bank">» Bank</a></li><li>'
                             +'<a href="http://www.goatlings.com/donate">» Donate</a></li></ul></li><li class="nav_image"><a href="http://www.goatlings.com/news/">'
                             +'<img src="https://i.imgur.com/4Br88bA.png" alt="" width="72" height="31" border="0"></a><ul class="dropdown"><li>'
                             +'<a href="http://www.goatlings.com/forums/view_topic/10201">» Event Calendar</a></li></ul></li><li class="nav_image"><a href="http://www.goatlings.com/mystuff/">'
                             +'<img src="https://i.imgur.com/4Br88bA.png" alt="" width="72" height="31" border="0"></a><ul class="dropdown"><li><a href="http://www.goatlings.com/inventory/">'
                             +'» Inventory</a></li><li><a href="http://www.goatlings.com/itemsorter">» Item Sorter</a></li><li><a href="http://www.goatlings.com/usershop/index/">» My Shop</a>'
                             +'</li><li><a href="http://www.goatlings.com/gallery/index/">» My Gallery</a></li><li><a href="http://www.goatlings.com/storage">» My Safe</a></li><li>'
                             +'<a href="http://www.goatlings.com/auctions/your">» My Auctions</a></li><li><a href="http://www.goatlings.com/mypets/">» My Goatlings</a></li><li>'
                             +'<a href="http://www.goatlings.com/forums/yourtopics/">» My Forum Topics</a></li><li><a href="http://www.goatlings.com/buddies">» My Buddies</a></li><li>'
                             +'<a href="http://www.goatlings.com/settings">» My Settings</a></li><li><a href="http://www.goatlings.com/trades/yourtrades">» My Trades</a></li><li>'
                             +'<a href="http://www.goatlings.com/habuddy">» My HA Buddy</a></li><li><a href="http://www.goatlings.com/wishlist/">» My Wish List</a></li></ul></li>'
                             +'<li class="nav_image"><a href="http://www.goatlings.com/create/"><img src="https://i.imgur.com/4Br88bA.png" alt="" width="72" height="31" border="0">'
                             +'</a><ul class="dropdown"><li><a href="http://www.goatlings.com/create/adopt/">» Adopt</a></li><li><a href="http://www.goatlings.com/create/cre/">» Create</a>'
                             +'</li><li><a href="http://www.goatlings.com/create/surrender/">» Abandon</a></li></ul></li><li class="nav_image"><a href="http://www.goatlings.com/arcade/">'
                             +'<img src="https://i.imgur.com/4Br88bA.png" alt="" width="72" height="31" border="0"></a><ul class="dropdown"><li><a href="http://www.goatlings.com/hol">'
                             +'» Higher or Lower</a></li><li><a href="http://www.goatlings.com/drop_box">» Magic Hat</a></li><li><a href="http://www.goatlings.com/daily_item">» Gachapon</a></li>'
                             +'<li><a href="http://www.goatlings.com/raffle">» Raffle</a></li><li><a href="http://www.goatlings.com/trivia">» Treasure Trivia</a></li><li>'
                             +'<a href="http://www.goatlings.com/lucky_numbers/index/0l">» Lucky Three</a></li><li><a href="http://www.goatlings.com/lucky_numbers/index/1">» Lucky Four</a></li>'
                             +'<li><a href="http://www.goatlings.com/lucky_numbers/index/2">» Lucky Five</a></li><li><a href="http://www.goatlings.com/referral">» Referral Contest</a></li>'
                             +'<li><a href="http://www.goatlings.com/wishing">» Wishing Well</a></li><li><a href="http://www.goatlings.com/catchstar">» Catch a Falling Star</a></li><li>'
                             +'<a href="http://www.goatlings.com/random">» Pick a Card</a></li><li><a href="http://www.goatlings.com/slots">» Triple Scoop</a></li><li>'
                             +'<a href="http://www.goatlings.com/fishing">» Gone Fishin</a></li><li><a href="http://www.goatlings.com/ss_mine">» Rainbow Caverns</a></li><li>'
                             +'<a href="http://www.goatlings.com/token">» Goat Token</a></li><li><a href="http://www.goatlings.com/rps">» Fluttersnap</a></li></ul></li><li class="nav_image">'
                             +'<a href="http://www.goatlings.com/ShoppingDistrict/"><img src="https://i.imgur.com/4Br88bA.png" alt="" width="72" height="31" border="0"></a><ul class="dropdown">'
                             +'<li><a href="http://www.goatlings.com/shops/view/3">» Appearance Dolls</a></li><li><a href="http://www.goatlings.com/shops/view/14">» Library</a></li><li>'
                             +'<a href="http://www.goatlings.com/shops/view/1">» Toy Shop</a></li><li><a href="http://www.goatlings.com/shops/view/9">» VIP</a></li><li>'
                             +'<a href="http://www.goatlings.com/shops/view/4">» Party Supplies</a></li><li><a href="http://www.goatlings.com/shops/view/5">» Gift Shop</a></li><li>'
                             +'<a href="http://www.goatlings.com/shops/view/2">» Fruit Salad</a></li><li><a href="http://www.goatlings.com/shops/view/10">» General Foods</a></li><li>'
                             +'<a href="http://www.goatlings.com/shops/view/11">» Bakery</a></li><li><a href="http://www.goatlings.com/shops/view/19">» Ice Cream Parlor</a></li><li>'
                             +'<a href="http://www.goatlings.com/shops/view/28">» Seasonal Antique Shop</a></li><li><a href="http://www.goatlings.com/shops/view/8">» Battle Weapons</a>'
                             +'</li><li><a href="http://www.goatlings.com/shops/view/26">» Battle Pets</a></li><li><a href="http://www.goatlings.com/shops/view/17">» Battle Defense</a></li>'
                             +'<li><a href="http://www.goatlings.com/shops/view/7">» Remedies and Elixirs</a></li><li><a href="http://www.goatlings.com/shops/view/22">» HA Buddy Hair Salon</a>'
                             +'</li><li><a href="http://www.goatlings.com/shops/view/20">» HA Buddy Face Space</a></li><li><a href="http://www.goatlings.com/shops/view/23">» HA Buddy Hats</a></li>'
                             +'<li><a href="http://www.goatlings.com/shops/view/12">» HA Buddy Boutique</a></li><li><a href="http://www.goatlings.com/shops/view/21">» HA Buddy Base Place</a></li>'
                             +'<li><a href="http://www.goatlings.com/shops/view/24">» HA Buddy Accessories</a></li><li><a href="http://www.goatlings.com/shops/view/25">» HA Buddy Background</a></li>'
                             +'<li><a href="http://www.goatlings.com/shops/view/16">» Display Name Icons</a></li><li><a href="http://www.goatlings.com/pawn">» Pawn Shop</a></li><li>'
                             +'<a href="http://www.goatlings.com/craft">» Crafting</a></li></ul></li><li class="nav_image"><a href="http://www.goatlings.com/battle/">'
                             +'<img src="https://i.imgur.com/4Br88bA.png" alt="" width="72" height="31" border="0"></a><ul class="dropdown"><li><a href="http://www.goatlings.com'
                             +'/battle/challengers">» Battle Center</a></li><li><a href="http://www.goatlings.com/battle/train_challengers">» Training Center</a></li><li>'
                             +'<a href="http://www.goatlings.com/battle/thebattle">» Current Battle</a></li><li><a href="http://www.goatlings.com/mypets">» My Pets</a></li></ul></li>'
                             +'<li class="nav_image"><a href="http://www.goatlings.com/forums/index"><img src="https://i.imgur.com/4Br88bA.png" alt="" width="72" height="31" border="0"></a>'
                             +'<ul class="dropdown"><li><a href="http://www.goatlings.com/forums/view/2/">» News & Announcements</a></li><li><a href="http://www.goatlings.com/forums/view/16/">'
                             +'» Official Contests And Events</a></li><li><a href="http://www.goatlings.com/forums/view/4/">» Introductions</a></li><li>'
                             +'<a href="http://www.goatlings.com/forums/view/1/">» General Chat</a></li><li><a href="http://www.goatlings.com/forums/view/5/">» Help</a></li><li>'
                             +'<a href="http://www.goatlings.com/forums/view/8/">» Ideas and Suggestions</a></li><li><a href="http://www.goatlings.com/forums/view/3/">» Bugs</a></li><li>'
                             +'<a href="http://www.goatlings.com/forums/view/6/">» Shops, Trades, & Auctions</a></li><li><a href="http://www.goatlings.com/forums/view/20/">» Battle</a></li><li>'
                             +'<a href="http://www.goatlings.com/forums/view/9/">» Roleplay Chat</a></li><li><a href="http://www.goatlings.com/forums/view/15/">» Clubhouse Bulletin Board</a></li>'
                             +'<li><a href="http://www.goatlings.com/forums/view/12/">» HA Buddy</a></li><li><a href="http://www.goatlings.com/forums/view/17/">» Member Contests And Events</a></li>'
                             +'<li><a href="http://www.goatlings.com/forums/view/7/">» Galleries</a></li><li><a href="http://www.goatlings.com/forums/view/18/">» Creative Writing Nook</a></li>'
                             +'<li><a href="http://www.goatlings.com/forums/view/14/">» Artists Alley</a></li><li><a href="http://www.goatlings.com/forums/view/13/">» Member Created Designs</a>'
                             +'</li><li><a href="http://www.goatlings.com/forums/view/19/">» Goatlings Gazette Submissions</a></li><li><a href="http://www.goatlings.com/forums/view/10/">'
                             +'» Off Topic</a></li></ul></li><li class="nav_image"><a href="http://www.goatlings.com/explore/index"><img src="https://i.imgur.com/4Br88bA.png" alt="" width="72"'
                             +'height="31" border="0"></a><ul class="dropdown"><li><a href="http://www.goatlings.com/explore/view">» Current Adventure</a></li><li><a href="#">» Misty Meadows</a>'
                             +'<br><a href="http://www.goatlings.com/explore/create/1/'+token+'">　1　</a><a href="http://www.goatlings.com/explore/create/3/'+token+'">2　</a>'
                             +'<a href="http://www.goatlings.com/explore/create/4/'+token+'">3　</a><a href="http://www.goatlings.com/explore/create/5/'+token+'">4　</a>'
                             +'<a href="http://www.goatlings.com/explore/create/6/'+token+'">5</a></li><li><a href="#">» Enchanted Forest</a><br>'
                             +'<a href="http://www.goatlings.com/explore/create/7/'+token+'">　1　</a><a href="http://www.goatlings.com/explore/create/12/'+token+'">2　</a>'
                             +'<a href="http://www.goatlings.com/explore/create/9/'+token+'">3　</a><a href="http://www.goatlings.com/explore/create/10/'+token+'">4　</a>'
                             +'<a href="http://www.goatlings.com/explore/create/11/'+token+'">5　</a></li><li><a href="#">» Phantom Forest</a><br>'
                             +'<a href="http://www.goatlings.com/explore/create/13/'+token+'">　1　</a><a href="http://www.goatlings.com/explore/create/14/'+token+'">2　</a>'
                             +'<a href="http://www.goatlings.com/explore/create/15/'+token+'">3　</a><a href="http://www.goatlings.com/explore/create/16/'+token+'">4　</a>'
                             +'<a href="http://www.goatlings.com/explore/create/17/'+token+'">5　</a></li><li><a href="#">» Rainbow Caverns</a><br>'
                             +'<a href="http://www.goatlings.com/explore/create/18/'+token+'">　1　</a><a href="http://www.goatlings.com/explore/create/19/'+token+'">2　</a>'
                             +'<a href="http://www.goatlings.com/explore/create/20/'+token+'">3　</a><a href="http://www.goatlings.com/explore/create/21/'+token+'">4　</a>'
                             +'<a href="http://www.goatlings.com/explore/create/22/'+token+'">5　</a></li><li><a href="#">» Majestic Mountain</a><br>'
                             +'<a href="http://www.goatlings.com/explore/create/23/'+token+'">　1　</a><a href="http://www.goatlings.com/explore/create/24/'+token+'">2　</a>'
                             +'<a href="http://www.goatlings.com/explore/create/25/'+token+'">3　</a><a href="http://www.goatlings.com/explore/create/26/'+token+'">4　</a>'
                             +'<a href="http://www.goatlings.com/explore/create/27/'+token+'">5　</a></li><li><a href="#">» Sea of Clouds</a><br>'
                             +'<a href="http://www.goatlings.com/explore/create/28/'+token+'">　1　</a><a href="http://www.goatlings.com/explore/create/29/'+token+'">2　</a>'
                             +'<a href="http://www.goatlings.com/explore/create/30/'+token+'">3　</a><a href="http://www.goatlings.com/explore/create/31/'+token+'">4　</a>'
                             +'<a href="http://www.goatlings.com/explore/create/32/'+token+'">5　</a></li><li><a href="http://www.goatlings.com/battle/thebattle">» Current Battle</a></li>'
                             +'</ul></li><li class="nav_image"><a href="http://www.goatlings.com/creativepark"><img src="https://i.imgur.com/4Br88bA.png" alt="" width="72" height="31" border="0"></a>'
                             +'<ul class="dropdown"><li><a href="http://www.goatlings.com/graphics">» Graphics</a></li><li><a href="http://www.goatlings.com/flairbanners">» Flair Banners</a></li>'
                             +'<li><a href="http://www.goatlings.com/coloringpages">» Coloring Pages</a></li><li><a href="http://www.goatlings.com/avatars">» Avatars</a></li><li>'
                             +'<a href="http://www.goatlings.com/premadelayouts">» Profile Layouts</a></li></ul></li><li class="nav_image"><a href="http://www.goatlings.com/login/logout/'+token
                             +'/"><img src="https://i.imgur.com/4Br88bA.png" alt="" width="72" height="31" border="0"></a></ul>');
///////////////////////////

// Appending the new Search bar
var theFooter = document.getElementById('footer');
theFooter.insertAdjacentHTML('beforebegin', '<div style="display:flex; flex-direction:row; justify-content:center">'
                             +'<form action="http://www.goatlings.com/search/searchpro" method="post" accept-charset="utf-8">'
                             +'<input type="hidden" name="csrf_test_name" value="'+token+'"><div class="search-new"><input type="text" name="search" style="width:90px; font-size:12px; height:20px">'
                             +' <select name="specifics" style="width:90px;"><option value="1">Exact</option><option value="0">Contains</option></select> <select name="type" style="'
                             +'width:90px;"><option value="0">Item Name</option><option value="1">Members</option><option value="2">Pets</option></select> <input type="submit" name="s"'
                             +'value="Search" style="width:90px;"></div></form></div>');

// Changes the text from 12 am to 4 am on pages telling you about the reset
var isReset = textContent.indexOf("resets at")!==-1;
if (isReset){
    document.getElementById("content").innerHTML = document.getElementById("content").innerHTML.replace('12am', '4 am');}

// Add back button on some pages that don't have it & spruce up the error page
var foundError = textContent.indexOf("ERROR:")!==-1;
if(foundError){
    addGlobalStyle ('#content {text-align:center; padding-top:25px;}');
    idContent.insertAdjacentHTML('afterbegin', '<h2 class="page-title" style="text-align:left">Oops!</h2>');
    idContent.insertAdjacentHTML('beforeend', '<br><br><button onclick="window.history.go(-1)">Back</button>');}

// Add Battle/Training Center links at the bottom of the Fountain's page
if (url.includes('fountain')){
    var isHealed = textContent.indexOf("You have healed all your pets.")!==-1;
    if(isHealed){
        idContent.insertAdjacentHTML('beforeend', '<p style="text-align:center"><a href="http://www.goatlings.com/battle/challengers">To Battle Center</a> -'+
                                     '<a href="http://www.goatlings.com/battle/train_challengers">To Training Center</a></p>');}}
//Rounding some corners in the shops
if(url.includes('/shop')){
    addGlobalStyle('#content img {margin-bottom:7px; }');
   }
if(url.includes('/Shop')){
    addGlobalStyle('#content img {margin-bottom:7px; border-radius:15px}');
   }
//Adjusting margins
if(url.includes('storage')){
    addGlobalStyle('#content img {margin-bottom:7px;}');
}
if(url.includes('gallery')){
    addGlobalStyle('#content img {margin-bottom:7px;}');
}
//No background squares here
if(url.includes('battle/')){
    addGlobalStyle('#content img{background-color:transparent !important; border:none;}');
}
// HA buddy closet
if(url.includes('/habuddy')){
    addGlobalStyle('.base_area {border:none}'
                  +'.item_area {margin:auto; border-color:#954471; background-color:#4d3f47}');
}
//Inventory edits start here
if (url.includes('inventory')){
    //#user-info-points img{visibility:hidden} #user-info-points a {visibility:visible}
    addGlobalStyle('#content {font-color:#FFF; font-size:0.1px;}'
                   +'#content img {margin-bottom:7px}'
                   +'.center, .item-invent, .event, #eej, .random_event {font-size: 12px !important;}'
                   +'h2 {font-size: 18px !important;}'
                   +'#footy {display: inline-block; text-align:center; left: 50%; margin-left: 15px; height: 35px; width:910px; background-color:#2c2b2f !important;}'
                   +'#inventlinks, #vee, .newsBoxText {font-size: 12px !important; text-align:center;}');
    var MyItemsText = textContent.indexOf("My Items")!==-1;
    if(url.includes('inventory/view')){
        if(MyItemsText){
            idContent.insertAdjacentHTML('beforeend', '<p id="inventlinks"><a href="http://www.goatlings.com/itemsorter">Item Sorter</a> '
                                         +'| <a href="http://www.goatlings.com/inventory/">Inventory</a> | <a href="http://www.goatlings.com/gallery">My Gallery</a> '
                                         +'| <a href="http://www.goatlings.com/usershop">My Shop</a> | <a href="http://www.goatlings.com/storage">My Safe</a> '
                                         +'| <a href="http://www.goatlings.com/battle/challengers">Battle Center</a> '
                                         +'| <a href="http://www.goatlings.com/battle/train_challengers">Training Center</a></p>');
            var x = document.getElementById('option');
            var t = document.getElementsByClassName('item-invent-view');
            if(x){
                x.options.remove(0);
                if (x.options[8]){
                    x.options[8].selected=true;}
                else {
                    x.options[1].selected=true;}}
            var EquipText = textContent.indexOf("The item was equipped to your pet!")!==-1;
            if(EquipText){
                var toBattle = document.getElementById('inventlinks');
                toBattle.insertAdjacentHTML('beforebegin', '<p id="inventlinks"><a href="http://www.goatlings.com/battle/challengers">To Battle</a></p>');}}
        else {
            addGlobalStyle('#content {font-size: 12px !important; text-align:center;}');
            idContent.insertAdjacentHTML('beforeend', '<p></p>');
            idContent.insertAdjacentHTML('beforeend', '<p id="inventlinks"><a href="http://www.goatlings.com/itemsorter">Item Sorter</a> '
                                         +'| <a href="http://www.goatlings.com/inventory/">Inventory</a> | <a href="http://www.goatlings.com/gallery">My Gallery</a> '
                                         +'| <a href="http://www.goatlings.com/usershop">My Shop</a> | <a href="http://www.goatlings.com/storage">My Safe</a> '
                                         +'| <a href="http://www.goatlings.com/inventory/send_item_log">Sent Items</a></p>');}}
    else {
        var TotalItems = textContent.indexOf("Total Items")!==-1;
        if(TotalItems){
            idContent.insertAdjacentHTML('afterend', '<div id="footy" style="margin-top:-5px"><p id="inventlinks"><a href="http://www.goatlings.com/itemsorter">Item Sorter</a>'
                                         +' | <a href="http://www.goatlings.com/inventory/">Inventory</a> | <a href="http://www.goatlings.com/gallery">My Gallery</a>'
                                         +' | <a href="http://www.goatlings.com/usershop">My Shop</a> | <a href="http://www.goatlings.com/storage">My Safe</a>'
                                         +' | <a href="http://www.goatlings.com/inventory/send_item_log">Sent Items</a> | <a href="http://www.goatlings.com/inventory/index/2">Stack Items</a>'
                                         +' | <a href="http://www.goatlings.com/inventory/index/1">Unstack Items</a></p></div>');}
        else {
            idContent.insertAdjacentHTML('afterend', '<div id="footy" style="margin-top:-5px"><p id="inventlinks"><a href="http://www.goatlings.com/itemsorter">Item Sorter</a>'
                                         +' | <a href="http://www.goatlings.com/inventory/">Inventory</a> | <a href="http://www.goatlings.com/gallery">My Gallery</a>'
                                         +' | <a href="http://www.goatlings.com/usershop">My Shop</a> | <a href="http://www.goatlings.com/storage">My Safe</a>'
                                         +' | <a href="http://www.goatlings.com/inventory/send_item_log">Sent Items</a> | <a href="http://www.goatlings.com/inventory/index/2">Stack Items</a>'
                                         +' | <a href="http://www.goatlings.com/inventory/index/1">Unstack Items</a></p></div>');
            idContent.insertAdjacentHTML('afterbegin', '<p id="inventlinks"><a href="http://www.goatlings.com/itemsorter">Item Sorter</a>'
                                         +' | <a href="http://www.goatlings.com/inventory/">Inventory</a> | <a href="http://www.goatlings.com/gallery">My Gallery</a>'
                                         +' | <a href="http://www.goatlings.com/usershop">My Shop</a> | <a href="http://www.goatlings.com/storage">My Safe</a>'
                                         +' | <a href="http://www.goatlings.com/inventory/send_item_log">Sent Items</a> | <a href="http://www.goatlings.com/inventory/index/2">Stack Items</a>'
                                         +' | <a href="http://www.goatlings.com/inventory/index/1">Unstack Items</a></p>');}}}
//Inventory edits end here

// Alert if there is new news
var urlstring = "";
var imglist = document.images;
for (var s = 0; s < imglist.length; s++){
    urlstring = urlstring + imglist[s].src;}
var newNews = urlstring.indexOf("http://www.goatlings.com/images/navinews2.gif")!==-1;
if (newNews){
    addGlobalStyle (".newsBox {text-align:center;border-radius:4px 4px 4px 4px; border:1px solid #d56b95;width:500px;display:inline-block;"
                    +"padding:5px;margin-left:180px;margin-top:0px} .newsBoxText {text-align: center;}");
    idContent.insertAdjacentHTML("afterbegin", "<div class='newsBox'><div class='newsBoxText'><b>ALERT!</b><br>"
                                 +"There's <a href='http://www.goatlings.com/news/'>new news</a>!</div></div>");}
