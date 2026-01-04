// ==UserScript==
// @name         PH toolbox
// @namespace    http://tampermonkey.net/
// @version      0.6.5
// @description  PornHub toolbox (https://codeberg.org/aolko/userscripts)
// @author       aolko
// @license      GPL-3.0-or-later
// @match        *://*.pornhub.com/*
// @match        *pornhub.com*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pornhub.com
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_registerMenuCommand
// @resource     PH_CSS https://codeberg.org/aolko/userscripts/raw/branch/master/ph_toolbox/ph.style.css?v1
// @require      https://code.jquery.com/jquery-3.6.1.min.js
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @downloadURL https://update.greasyfork.org/scripts/456919/PH%20toolbox.user.js
// @updateURL https://update.greasyfork.org/scripts/456919/PH%20toolbox.meta.js
// ==/UserScript==

/*
Check the official repo: https://codeberg.org/aolko/userscripts
*/

/*! instant.page v5.1.1 - (C) 2019-2020 Alexandre Dieulot - https://instant.page/license */
let t,e;const n=new Set,o=document.createElement("link"),i=o.relList&&o.relList.supports&&o.relList.supports("prefetch")&&window.IntersectionObserver&&"isIntersecting"in IntersectionObserverEntry.prototype,s="instantAllowQueryString"in document.body.dataset,a="instantAllowExternalLinks"in document.body.dataset,r="instantWhitelist"in document.body.dataset,c="instantMousedownShortcut"in document.body.dataset,d=1111;let l=65,u=!1,f=!1,m=!1;if("instantIntensity"in document.body.dataset){const t=document.body.dataset.instantIntensity;if("mousedown"==t.substr(0,"mousedown".length))u=!0,"mousedown-only"==t&&(f=!0);else if("viewport"==t.substr(0,"viewport".length))navigator.connection&&(navigator.connection.saveData||navigator.connection.effectiveType&&navigator.connection.effectiveType.includes("2g"))||("viewport"==t?document.documentElement.clientWidth*document.documentElement.clientHeight<45e4&&(m=!0):"viewport-all"==t&&(m=!0));else{const e=parseInt(t);isNaN(e)||(l=e)}}if(i){const n={capture:!0,passive:!0};if(f||document.addEventListener("touchstart",function(t){e=performance.now();const n=t.target.closest("a");if(!h(n))return;v(n.href)},n),u?c||document.addEventListener("mousedown",function(t){const e=t.target.closest("a");if(!h(e))return;v(e.href)},n):document.addEventListener("mouseover",function(n){if(performance.now()-e<d)return;if(!("closest"in n.target))return;const o=n.target.closest("a");if(!h(o))return;o.addEventListener("mouseout",p,{passive:!0}),t=setTimeout(()=>{v(o.href),t=void 0},l)},n),c&&document.addEventListener("mousedown",function(t){if(performance.now()-e<d)return;const n=t.target.closest("a");if(t.which>1||t.metaKey||t.ctrlKey)return;if(!n)return;n.addEventListener("click",function(t){1337!=t.detail&&t.preventDefault()},{capture:!0,passive:!1,once:!0});const o=new MouseEvent("click",{view:window,bubbles:!0,cancelable:!1,detail:1337});n.dispatchEvent(o)},n),m){let t;(t=window.requestIdleCallback?t=>{requestIdleCallback(t,{timeout:1500})}:t=>{t()})(()=>{const t=new IntersectionObserver(e=>{e.forEach(e=>{if(e.isIntersecting){const n=e.target;t.unobserve(n),v(n.href)}})});document.querySelectorAll("a").forEach(e=>{h(e)&&t.observe(e)})})}}function p(e){e.relatedTarget&&e.target.closest("a")==e.relatedTarget.closest("a")||t&&(clearTimeout(t),t=void 0)}function h(t){if(t&&t.href&&(!r||"instant"in t.dataset)&&(a||t.origin==location.origin||"instant"in t.dataset)&&["http:","https:"].includes(t.protocol)&&("http:"!=t.protocol||"https:"!=location.protocol)&&(s||!t.search||"instant"in t.dataset)&&!(t.hash&&t.pathname+t.search==location.pathname+location.search||"noInstant"in t.dataset))return!0}function v(t){if(n.has(t))return;const e=document.createElement("link");e.rel="prefetch",e.href=t,document.head.appendChild(e),n.add(t)}

/* PageAutomator */
function PageAutomator(){this.hover=function(t){return document.querySelector(t).dispatchEvent(new MouseEvent("mouseover")),this},this.click=function(t,e="left"){var n=document.querySelector(t);return n?("left"===e?n.dispatchEvent(new MouseEvent("click")):"right"===e&&n.dispatchEvent(new MouseEvent("contextmenu")),this):(console.log("Error: element not found"),this)},this.scroll=function(t){return window.scrollBy(0,t),this},this.scrollTo=function(t){return t.scrollIntoView({behavior:"smooth",block:"start",inline:"nearest"}),this},this.hold=function(t,e){var n=document.querySelector(t);return"left"===e?n.dispatchEvent(new MouseEvent("mousedown")):"right"===e&&n.dispatchEvent(new MouseEvent("mousedown",{button:2})),this},this.moveToPosition=function(t,e){return window.dispatchEvent(new MouseEvent("mousemove",{clientX:t,clientY:e})),this},this.moveToElement=function(t){var e=document.querySelector(t);if(!e)return console.log("Error: element not found"),this;var n=e.getBoundingClientRect(),o=n.left+window.pageXOffset+n.width/2,i=n.top+window.pageYOffset+n.height/2;return window.dispatchEvent(new MouseEvent("mousemove",{clientX:o,clientY:i})),this},this.getPosition=function(){var t={x:0,y:0};return document.addEventListener("mousemove",(function(e){t.x=e.clientX,t.y=e.clientY})),t},this.keyPress=function(t){var e=new KeyboardEvent("keypress",{key:t});return document.dispatchEvent(e),this},this.keyUp=function(t){var e=new KeyboardEvent("keyup",{key:t});return document.dispatchEvent(e),this},this.keyDown=function(t){var e=new KeyboardEvent("keydown",{key:t});return document.dispatchEvent(e),this},this.holdKey=function(t,e){var n={ctrl:17,shift:16,alt:18,win:91},o=new KeyboardEvent("keydown",{keyCode:n[t],which:n[t]});document.dispatchEvent(o),e();o=new KeyboardEvent("keyup",{keyCode:n[t],which:n[t]});return document.dispatchEvent(o),this},this.holdKeySequence=function(t,e){return Mousetrap.bind(t,(function(){e(),Mousetrap.unbind(t)}),"keydown"),this},this.setKeyState=function(t,e){if("numlock"===t){var n=new KeyboardEvent("keydown",{key:"NumLock",code:"NumLock"});document.dispatchEvent(n)}else if("scrolllock"===t){n=new KeyboardEvent("keydown",{key:"ScrollLock",code:"ScrollLock"});document.dispatchEvent(n)}else if("capslock"===t){n=new KeyboardEvent("keydown",{key:"CapsLock",code:"CapsLock"});document.dispatchEvent(n)}return this},this.blockInput=function(){return document.addEventListener("keydown",(function(t){t.preventDefault()})),document.addEventListener("mousedown",(function(t){t.preventDefault()})),this},this.wait=function(t){for(var e=(new Date).getTime(),n=e;n<e+t;)n=(new Date).getTime();return this},this.waitForElement=function(t){for(var e=document.querySelector(t);!e;)e=document.querySelector(t);return this},this.waitForMouse=function(t){for(var e=document.body.style.cursor;e!==t;)e=document.body.style.cursor;return this},this.ifElement=function(t,e,n){var o=document.querySelector(t);return"contains"===e?!!o.innerHTML.includes(n):"does not contain"===e?!o.innerHTML.includes(n):"is"===e?o.innerHTML===n:"is not"===e?o.innerHTML!==n:this},this.onElement=function(t,e){var n=document.querySelector(t);return new MutationObserver((function(t){return e.call(n),this})).observe(n,{attributes:!0,childList:!0,characterData:!0}),this},this.hasText=function(t,e){return t.textContent.trim().includes(e)},this.hasElement=function(t,e){return null!==t.querySelector(e)},this.showNotification=function(t,e){new Notification(t,{body:e});return this},this.showDialog=function(t,e){var n=document.createElement("dialog"),o=document.createElement("strong");o.innerHTML=t;var i=document.createElement("p");return i.innerHTML=e,n.appendChild(o),n.appendChild(i),document.body.appendChild(n),n.show(),this},this.showCustomDialog=function(t){var e=document.createElement("dialog");return e.innerHTML=t,document.body.appendChild(e),e.show(),this},this.getClipboardText=function(){return navigator.clipboard.readText().then((t=>t))},this.setClipboardText=function(t){return navigator.clipboard.writeText(t),this},this.clearClipboard=function(){return navigator.clipboard.writeText(""),this},this.ifUrl=function(t,e){(t.startsWith("/")&&window.location.pathname===t||"/"===t&&"/"===window.location.pathname||window.location.href===t)&&e()},this.navigate=function(t){window.location.href=t},this.get_domain=function(){return window.location.hostname},this.get_protocol=function(){return window.location.protocol},this.get_page=function(){return window.location.pathname},this.get_query=function(){return window.location.search}}

/* globals $ */
var $ = window.jQuery;

var frame = document.createElement('div');
document.body.appendChild(frame);

GM_config.init(
{
  'id': 'ph__config', // The id used for this instance of GM_config
  'title': "⚙ PH toolbox settings",
  'fields': // Fields object
  {
    'labsFrontend': {
      'label': 'Experimental frontend',
      'section': 'Experimental',
      'type': 'checkbox',
      'default': false
    },
    'Layout': {
      'label': 'Layout',
      'section': 'General',
      'type': 'radio',
      'options': ['Default','Basic'],
      'default': 'Default'
    },
    'HideShortVids': {
      'label': 'Hide short videos',
      'type': 'checkbox',
      'default': false
    },
    'ShortVidMin': {
      'label': 'Minimum video length (in seconds)',
      'type': 'int',
      'min': 0,
      'max': 600,
      'default': 60
    }
  },
  'events':
  {
    'open': function(){
      GM_config.frame.setAttribute('style', `
        position: fixed; /* Stay in place */
        display: flex !important;
        flex-direction: column;
        align-items: center;
        z-index: 9999; /* Sit on top */
        left: 0;
        top: 0;
        width: 100%; /* Full width */
        height: 100%; /* Full height */
        overflow: auto; /* Enable scroll if needed */
      `);
    }
  },
  'frame': frame,
  'css': `
  #ph__config{background: hsl(0 0% 0% / .8);}
  #ph__config_wrapper{
    position: relative;
    top: 20%;
    margin:auto !important;
    background: #000;
    border-radius: 8px;
    max-width: 500px;
    border: 2px solid #ff9000;
    transition: all .5s ease-in-out;
  }
  #ph__config_header,.config_var{padding: 10px;}
  `
});

if (typeof GM_registerMenuCommand === 'function') {
    GM_registerMenuCommand('Settings', function() {
        GM_config.open();
    });
}

function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function match(string, cases) {
  var matched = false;
  for (var key in cases) {
    if (key.includes("||")) {
      var orKeys = key.split("||");
      orKeys.forEach(function(orKey) {
        if (orKey === string) {
          cases[key]();
          matched = true;
        }
      });
    } else if (key === string) {
      cases[key]();
      matched = true;
    }
  }
  if (!matched && cases.hasOwnProperty("default")) {
    cases["default"]();
  } else if (!matched) {
    throw new Error(`No case found for ${string}`);
  }
}


function showVids(url){
  var full_url = ph__domain + url+"/videos";
  console.log(full_url);
  $(`body`).append(`
             <dialog class="ph_dialog ph_modelVideos__window">
                <div class="heading">
                    <div class="left"><h2><i class="fa-solid fa-puzzle-piece-simple"></i> Model's videos</h2></div>
                    <div class="right"><a id="ph_modal-close" class="button"><i class="fa-solid fa-times"></i></a></div>
                </div>
                <div class="ph_modelVideos__container"></div>
             </dialog>
         `)
  //$( "dialog.phmodelVideos__window" ).load( "${full_url}/videos #videosTab > div > div > div:nth-child(2)" );
  $.ajax({
    url:full_url,
    type: 'GET',
    cache: false,
    success: function(data){
      $('dialog.ph_modelVideos__window > .ph_modelVideos__container').html($(data).find('#videosTab > .sectionWrapper > .profileVids').html());
    }
  });
};

function parseURL(url){
  var getQueryParams = function (query) {
    var params = {};
    new URLSearchParams(query).forEach(function (value, key) {
      var decodedKey = decodeURIComponent(key);
      var decodedValue = decodeURIComponent(value);
      // This key is part of an array
      if (decodedKey.endsWith("[]")) {
        decodedKey = decodedKey.replace("[]", "");
        params[decodedKey] || (params[decodedKey] = []);
        params[decodedKey].push(decodedValue);
        // Just a regular parameter
      } else {
        params[decodedKey] = decodedValue;
      }
    });

    return params;
  };

  var _url = new URL(url);
  _url._path = _url.pathname.split( '/' ).join(`#/#`).split(`#`);
  _url._path[0] = _url.origin;
  _url._params = getQueryParams(_url.searchParams);
  return _url;
}

function secondsToTime(e) {
  var h = Math.floor(e / 3600).toString().padStart(2, '0'),
      m = Math.floor(e % 3600 / 60).toString().padStart(2, '0'),
      s = Math.floor(e % 60).toString().padStart(2, '0');
  
  if (h > 0) {
    // Include the hours value in the output string if it is greater than 0
    return h + ':' + m + ':' + s;
  } else {
    // Omit the hours value if it is 0 or less
    return m + ':' + s;
  }
}


function timeToSeconds(e) {
  // Split the input time string into an array of hours, minutes, and seconds
  var [m, s] = e.split(":");
  
  // Convert the hours, minutes, and seconds to integers and return the total number of seconds
  return parseInt(m, 10) * 60 + parseInt(s, 10);
}

function shuffleMessages(messages) {
  for (let i = messages.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [messages[i], messages[j]] = [messages[j], messages[i]];
  }
  return messages;
}

function getRandomMessage(dict) {
  let messages = shuffleMessages(dict);
  return messages[0];
}

const dict__messages = {
  video: {
    malicious: [
      "This video is a scam and contains malicious content",
      "This video contains ads and is trying to sell you something",
      "This video is promoting premium accounts or external links",
      "This video contains external links that could be harmful"
    ],
    tease: [
      "This video might contain no climax or might contain external links",
      "This video might be edited to cut out content and might contain external links",
      "This video might contain purposely cut content and might contain external links"
    ],
    wrong_classification: [
      "This video is not in the correct category",
      "This video is not using the correct tags"
    ]
  },
  profile: {
    malicious: [
      "This page is a scam and contains malicious content",
      "This page contains ads and is trying to sell you something",
      "This page is promoting premium accounts or external links",
      "This page contains external links that could be harmful"
    ],
    tease: [
      "This page might contain no climax or might contain external links",
      "This page might be edited to cut out content and might contain external links",
      "This page might contain purposely cut content and might contain external links"
    ],
    wrong_classification: [
      "This page is not in the correct category",
      "This page is not using the correct tags"
    ],
    inactive_profile: [
      "This profile is fake or no longer active.",
      "This user has not been active on the site in some time or this page is fake.",
      "We're sorry, but this profile is no longer available or this page is fake.",
      "Unfortunately, the user associated with this profile is no longer active on the platform.",
    ]
  },
  something_went_wrong: [
    "Whoops, something broke here, try to reload the page",
    "There was an error with loading the data, please try again later",
    "There was a script error, please try again later"
  ]
  
}



const ph__domain = window.location.origin;

// global namespace for placing cleanup functions in
var cleanup = cleanup || {};

const ph__url = parseURL(window.location.href);

window.addEventListener("load", function(){
  'use strict';

  console.log("[PageAutomator] Automator started");

  var automator = new PageAutomator();

  console.log(`[PH toolbox] Started`);

  // TODO: Update elements for theme refresh in PH

  cleanup.page = function(){
    $(`#age-verification-container,#age-verification-wrapper,.abAlertShown,#js-abContainterMain`).remove();
  }
  cleanup.header = function(){
    var elements = [
      ".networkBarWrapper",
      "#countryRedirectMessage",
      "#welcome",
      "#leftMenu a.menuLink.customUpgradeBtn.removeAdLink",
      "#leftMenu a.menuLink.halfWidth.js-menuAnalytics[href*='https://www.modelhub.com/']",
      "#leftMenu a.menuLink.halfWidth.js-menuAnalytics[href*='https://www.pornhubapparel.com/']",
      "#leftMenu a.menuLink.halfWidth.js-menuAnalytics[href*='https://www.uviu.com/']",
      "#leftMenu a.menuLink.halfWidth.leftItem.js-menuAnalytics[href*='https://www.pornhub.com/sex/']",
      "#leftMenu button.menuLink.removeAdLink",
      //"#profileMenuDropdownScroll > div.menuSection > .menuLink:has(a[href*='/user/orders'])",
      "#profileMenuDropdownScroll > div.menuSection > .menuLink:has(a[href*='/user/verification'])",
      "#profileMenuDropdownScroll > div.menuSection > .menuLink > a[href*='/user/orders']",
      "header > #headerMenuContainer",
      "body > div.wrapper > div.container > div.frontListingWrapper > div:nth-child(1) > div",
    ];
    elements.forEach(function(el) { 
      $(el).remove();
    });
    $(`#coummunityMenuItems > li:nth-child(3)`).remove();
    $(getElementByXpath(`/html/body/div[4]/div[3]/div[5]/div[2]/comment()[3]`)).next().remove();
    $(`#menuItem2 > div > div > div.leftPanel.videos > ul > li:nth-child(10)`).remove();
    $(`#dropdownHeaderSubMenu > div.innerHeaderSubMenu.trendingWrapper`).remove();
    $(`#menuItem3 > div > div > div.rightPanel`).remove();
    $(`#menuItem3 > div > div > div.leftPanel > div.pornInLang`).remove();
  }
  cleanup.body = function(){
    $(`#player`).removeClass(`original`);
    $(`#player`).addClass(`wide`);
    $(`#hd-rightColVideoPage`).removeClass(`original`);
    $(`#hd-rightColVideoPage`).addClass(`wide`);
    $(`div.mgp_controlBar > div.mgp_front > div.mgp_cinema`).remove();
    $(`#recommendedVideos`).attr('class','videos user-playlist allRecommendedVideos');
    $(`#recommendedVideosVPage > a`).remove();
    $(`#hd-leftColVideoPage > div.video-wrapper.js-relatedRecommended.js-relatedVideos.relatedVideos`).addClass('allRelatedVideos');
    $(`#loadMoreRelatedVideosCenter`).remove();
  }

  $("#profileMenuDropdownScroll > div.menuSection > .menuLink > a[href*='/feeds']").removeClass("halfWidth");
  $("#profileMenuDropdownScroll > div.menuSection > .menuLink > a[href*='/feeds'] > span").addClass("inline");
  $("#profileMenuDropdownScroll > div.menuSection > .menuLink > a[href*='/feeds'] > .iconHolder").remove();
  $(`<i class="ph-icon-rss-feed inline"></i>`).insertBefore("#profileMenuDropdownScroll > div.menuSection > .menuLink > a[href*='/feeds'] > span");
  $("#leftMenu a.menuLink[href*='https://help.pornhub.com/hc/en-us/categories/4419836212499']").removeClass("halfWidth");
//
  var flags = JSON.parse(localStorage.getItem('flags')) || {"videos":[],"models":[]};

  var favCategories = [
    { "name": "Uncategorized", "id": "0" },
    { "name": "General", "id": "1" }
  ];

  // Global styles
  GM_addStyle(`
        /* https://sleazyfork.org/ru/scripts/368777-pornhub-crack-for-russia */
        #age-verification-container,#age-verification-wrapper,.abAlertShown,#js-abContainterMain{display:none!important}

        @supports (display: grid) {
            html.supportsGridLayout #header #headerMenuContainer #headerMainMenuInner ul#headerMainMenu>li .wideDropdown.categories .innerDropdown {
                grid-template-columns: .75fr auto !important;
            }
            html.supportsGridLayout #header {
                grid-template-rows: auto !important;
            }
        }

        #header #headerMenuContainer #headerMainMenuInner ul#headerMainMenu>li .wideDropdown.categories .middlePanel{
            width: 100%;
        }

        .ph_dialog{
            margin:auto !important;
            background: #000;
            border-radius: 8px;
            min-width: 500px;
            max-width: 800px;
            border: 2px solid #ff9000;
            transition: all .5s ease-in-out;
        }

        .ph_dialog > .heading{
            display: flex;
            align-content: center;
            padding: 10px;
            background: hsl(0,0%,10%);
        }

        .ph_dialog > .heading > a{
            text-decoration: unset;
            color: #ff9000;
        }

        .ph_dialog > .heading > *{
            display: flex;
            align-content: center;
        }

        .ph_dialog > .heading > .left > .button,.ph_dialog > .heading > .right > .button{
            display: flex;
            justify-content: center;
            align-items: center;
            width: 24px;
            height: 24px;
            font-size: 16pt;
            padding: 0;
            margin: 0;
        }

        .ph_dialog > .heading > .left{
            flex: 1;
        }

        .ph_dialog > .heading > .right{
            margin-left: auto;
        }

        .ph_dialog > .body{
            color: var(--ph__white);
            padding: 10px;
            overflow-y: auto;
            max-height: 800px;
        }

        .ph_dialog > .body >*:not(:last-child){
          margin: 0 0 10px 0;
        }

        .ph_comments__window > .ph_comments__container{
            padding: 10px;
        }

        .ph_comments__window > .ph_comments__container .cmtHeader{
            padding: 1em !important;
        }

        .ph_comments__window > .ph_comments__container #cmtContent{
            overflow-y: auto;
            max-height: 500px;
        }

        .ph_recommended__window > .ph_recommended__container #recommendedVideos{
            overflow-y: auto;
            max-height: 500px;
        }

        .ph_related__window > .ph_related__container #relatedVideosCenter{
            overflow-y: auto;
            max-height: 500px;
        }

        .ph_modelVideos__window > .ph_modelVideos__container{
            overflow-y: auto;
            max-height: 500px;
        }

        .ph_dialog::backdrop{
            z-index: 1;
            background: rgba(0,0,0,.8);
        }

        .ph_video-actions button{
            padding: 4px 24px;
            display: inline-block;
            margin-bottom: 5px;
            border-radius: 8px;
            padding: 8px 18px;
            background: #1b1b1b;
            font-weight: 400;
            font-size: 14px;
            color: #fff;
            text-transform: capitalize;
            white-space: nowrap;
            border: 1px solid #ff9000;
        }
        .ph_video-actions button:hover{
            text-decoration: none;
            background-color: #2f2f2f;
        }
        .ph_videoShortcuts1{
          display: inline-flex;
          gap: 4px;
        }
        #ph_flag__msgbox{
          display: flex;
          gap: 8px;
          align-items: flex-start;
          padding: 8px;
          boder-radius: 8px;
          background: #ff9000;
          color: black;
        }
        #ph_flag__msgbox .icon{
          display: flex;
          flex: 0 0 32px;
          align-items: center;
          justify-content: center;
          height: 24px;
          width: 24px;
          font-size: 16px;
        }
        #ph_flag__msgbox .text{
          flex: 1;
        }
        .video-action-sub-tab.addToStream li .wrap .thumbnail-info-wrapper span.title, ul.videos li .wrap .thumbnail-info-wrapper span.title {
            max-height: min-content;
        }
        @media only screen and (min-width: 1350px){
            .video-action-sub-tab.addToStream li .wrap .thumbnail-info-wrapper span.title, ul.videos li .wrap .thumbnail-info-wrapper span.title {
                max-height: min-content;
            }
        }
    `);

  GM_addStyle(GM_getResourceText("PH_CSS"));

  $(`header`).append(`
  <link href="//cdn.jsdelivr.net/npm/@sweetalert2/theme-dark@4/dark.css" rel="stylesheet">
  <script src="https://github.com/lofcz/sweetalert2-neutral/releases/download/v11.6.15-NEUTRAL/sweetalert2.all.min.js" defer></script>
  `);

  $(`body`).append(`
        <script src="https://cdn.jsdelivr.net/gh/aolko/fontawesome-pro@master/fontawesome-pro-6.1.2-web/js/all.min.js" data-auto-replace-svg="nest"></script>
        <script src="https://cdn.jsdelivr.net/gh/aolko/fontawesome-pro@master/fontawesome-pro-6.1.2-web/js/v4-shims.min.js"></script>
    `);

  console.info("[PH Toolbox] Cleaning up the page...");
  cleanup.page();
  cleanup.header();
  cleanup.body();

  console.info("[PH Toolbox] Guessing your location...");

  // LOCAL: specific pages

  if(window.location.href.indexOf("/video/search") > -1 || window.location.href.indexOf("/transgender") > -1) {
    // PH search page
    console.info("[PH Toolbox] You are currently searching for a video");
    if(GM_config.get("HideShortVids") === true){
      var hiddenEl = 0;
      $(`ul.videos > .videoBox`).each(function(){
        var videoDuration = $(`.linkVideoThumb > .marker-overlays > var.duration`,this).text();
        if(timeToSeconds(videoDuration) < GM_config.get("ShortVidMin")){
          $(this).hide();
          hiddenEl++;
        }
      });
      console.log(`[PH Toolbox] Hidden ${hiddenEl} videos shorter than ${secondsToTime(GM_config.get("ShortVidMin"))}`);
    }
  }
  else if(window.location.href.indexOf("/view_video.php") > -1) {
    // PH video page
    console.info("[PH Toolbox] You are currently watching a video");
    var modelURL = $(`#hd-leftColVideoPage > div:nth-child(1) > div.video-actions-container > div.video-actions-tabs > div.video-action-tab.about-tab.active > div.video-detailed-info > div.video-info-row.userRow > div.userInfo > div > span > a`).attr('href');

    $(`#hd-leftColVideoPage > div:nth-child(1) > div.video-actions-container > div.video-actions-tabs > div.video-action-tab.about-tab.active > div.video-detailed-info > div.video-info-row.userRow > div.userInfo > div.usernameWrap > span.usernameBadgesWrapper`).append(`
            <div class="ph_quickActions" style="display: flex; align-items: center; gap: 5px; margin: 0 5px 0 0;">
                <a href="${modelURL}/photos" data-popup><i class="fa-solid fa-images-user"></i> images</a>
                <a href="${modelURL}/videos" data-popup><i class="fa-solid fa-film"></i> videos</a>
            </div>
        `);

    $(`#ph_loadVids`).click(function(){
      var modelURL = $(`#hd-leftColVideoPage > div:nth-child(1) > div.video-actions-container > div.video-actions-tabs > div.video-action-tab.about-tab.active > div.video-detailed-info > div.video-info-row.userRow > div.userInfo > div > span > a`).attr('href');
      showVids(modelURL);
      document.querySelector(`.ph_modelVideos__window`).showModal();
    });

    $(`#relatedVideosCenter > .pcVideoListItem`).each(function(){
      var related_modelURL = $(`.wrap > .thumbnail-info-wrapper > .videoUploaderBlock > .usernameWrap > a`,this).attr('href');
      var related_vidURL = $(`.wrap > .thumbnail-info-wrapper > .title > a`,this).attr('href');
      $(`.wrap > .thumbnail-info-wrapper > .title`,this).append(`
                <div class="ph_quickActions">
                    <a href="https://9xbud.com/https://www.pornhub.com/${related_vidURL}" class="tooltipTrig" data-title="Download"><i class="fa-solid fa-download"></i></a>
                </div>
            `);
    });

    $(`#recommendedVideos > .pcVideoListItem`).each(function(){
      var recommended_modelURL = $(`.wrap > .thumbnail-info-wrapper > .videoUploaderBlock > .usernameWrap > a`,this).attr('href');
      var recommended_vidURL = $(`.wrap > .thumbnail-info-wrapper > .title > a`,this).attr('href');
      $(`.wrap > .thumbnail-info-wrapper > .title`,this).append(`
                <div class="ph_quickActions">
                    <a href="https://9xbud.com/https://www.pornhub.com/${recommended_vidURL}" class="tooltipTrig" data-title="Download"><i class="fa-solid fa-download"></i></a>
                </div>
            `);
    });

    $(`body`).append(`
            <dialog class="ph_dialog ph_comments__window">
                <div class="heading">
                    <div class="left"><h2><i class="fa-solid fa-puzzle-piece-simple"></i> Comments</h2></div>
                    <div class="right"><a id="ph_modal-close" class="button"><i class="fa-solid fa-times"></i></a></div>
                </div>
                <div class="ph_comments__container"></div>
            </dialog>
        `);

    $(`body`).append(`
            <dialog class="ph_dialog ph_recommended__window">
                <div class="heading">
                    <div class="left"><h2><i class="fa-solid fa-puzzle-piece-simple"></i> Recommended videos</h2></div>
                    <div class="right"><a id="ph_modal-close" class="button"><i class="fa-solid fa-times"></i></a></div>
                </div>
                <div class="ph_recommended__container"></div>
            </dialog>
        `);

    $(`body`).append(`
            <dialog class="ph_dialog ph_related__window">
                <div class="heading">
                    <div class="left"><h2><i class="fa-solid fa-puzzle-piece-simple"></i> Related videos</h2></div>
                    <div class="right"><a id="ph_modal-close" class="button"><i class="fa-solid fa-times"></i></a></div>
                </div>
                <div class="ph_related__container"></div>
            </dialog>
        `);

    function isFlagged(){
      var cur_url = ph__url.href;
      cur_url = cur_url.replace(/#+$/, ''); // Remove # character from the end of the URL
      if(localStorage.flags){
        var flags = JSON.parse(localStorage.flags);
        // check against current url
        var video = $.grep(flags.videos, function(v) {
          return v.url === cur_url;
        })[0];
        if (video) {
          return {
            flagged: true,
            reason: video.reason,
            url: video.url
          };
        }
      }
      return { flagged: false };
    }
             
    $(`body`).append(`
        <dialog class="ph_dialog ph_flagVideo__window">
            <div class="heading">
                <div class="left"><h2><i class="fa-solid fa-flag"></i> Flag video</h2></div>
                <div class="right"><a id="ph_modal-close" class="button"><i class="fa-solid fa-times"></i></a></div>
            </div>
            <div class="body">
              <div style="display:flex; gap: 4px;">
                <select id="ph_videoFlagReason" style="flex:1;">
                  <option value="scam">Scam</option>
                  <option value="ad">Ad</option>
                  <option value="low_quality">Low quality</option>
                  <option value="no_finisher">No orgasm/cumshot/creampie/climax</option>
                  <option value="teaser">Teaser</option>
                  <option value="wrong_tags">Wrong tags</option>
                  <option value="wrong_category">Wrong category</option>
                </select>
                <button id="ph_flagVideo_btn">Flag video</button>
              </div>
              <div style="display:flex; gap: 4px;">
                <span style="flex:1;font-weight:600;" id="ph_flagVideo_status"></span>
                <button id="ph_flagVideo_clear_btn">Clear flags</button>
              </div>
            </div>
        </dialog>
    `);
    $(`<div id="ph_flag__msgbox"><span class="icon"><i class="fa-regular fa-flag"></i></span><span class="text"></span></div>`).insertBefore(`#player`);
    if(isFlagged().flagged){
      $(`#ph_flagVideo_status`).html(`<i class="fa-solid fa-warning fa-fw"></i> This video was flagged as "${isFlagged().reason}"`);
      $(`#ph_videoFlagReason`).prop("disabled",true);
      $(`#ph_flagVideo_btn`).prop("disabled",true);
      match(isFlagged().reason, {
        "scam||ad||low_quality": function() { 
            $(`#ph_flag__msgbox>.text`).text(`
              ${getRandomMessage(dict__messages.video.malicious)}
            `);
         },
        "no_finisher||teaser": function() { 
            $(`#ph_flag__msgbox>.text`).text(`
              ${getRandomMessage(dict__messages.video.tease)}
            `);
         },
         "wrong_tags||wrong_category": function(){
            $(`#ph_flag__msgbox>.text`).text(`
              ${getRandomMessage(dict__messages.video.wrong_classification)}
            `);
         }
      });
      
    } else {
      $(`#ph_flag__msgbox`).remove();
      $(`#ph_flagVideo_status`).text(`This video wasn't flagged`);
    }

    
    $(`#under-player-comments`).appendTo(`.ph_comments__container`);

    $(`#hd-leftColVideoPage > div:nth-child(1) > div.video-actions-container > div.video-actions-tabs > div.video-action-tab.about-tab.active > div.video-detailed-info > div.video-info-row.userRow > div.userActions`).append(`
            <div class="ph_commentsButton videoSubscribeButton">
                <button type="button">
                    <i class="buttonIcon"></i>
                    <span class="buttonLabel">Comments</span>
                </button>
            </div>
        `);

    $(`#hd-leftColVideoPage > div:nth-child(1) > div.title-container.translate > h1`).append(`<div class="ph_videoShortcuts1"></div>`);
    $(`#hd-leftColVideoPage > div:nth-child(1) > div.title-container.translate > h1 > .ph_videoShortcuts1`).append(`<a id="ph_incognitoTab" href="#"><i class="fa-solid fa-user-secret"></i></a>`);
    $(`#hd-leftColVideoPage > div:nth-child(1) > div.title-container.translate > h1 > .ph_videoShortcuts1`).append(`<a id="ph_flag_btn" href="#"><i class="fa-solid fa-flag"></i></a>`);

    $(`#ph_incognitoTab`).click(function(){
      GM_openInTab(window.location.href, {"incognito":true});
    });

    $(`.ph_commentsButton>button`).click(function(){
      document.querySelector(`.ph_comments__window`).showModal();
    });

    $(`<div class="video-wrapper ph_video-actions" style="margin:20px 0; padding: 10px;"></div>`).insertAfter(`#hd-leftColVideoPage > div:nth-child(1)`);
    $(`.ph_video-actions`).html(`
            <button id="ph_videoOnly_btn">Basic layout</button>
            <button id="ph_videoDownload_btn">Video download</button>
        `);

    if(GM_config.get("Layout") === "Basic"){
      $(`#ph_videoOnly_btn`).hide();
      $(`.ph_video-actions`).append(`
            <button id="ph_relatedVids_btn">Related</button>
            <button id="ph_recommendedVids_btn">Recommended</button>
        `);

      $(`#ph_recommendedVids_btn`).click(function(){
        document.querySelector(`.ph_recommended__window`).showModal();
      });

      $(`#ph_relatedVids_btn`).click(function(){
        document.querySelector(`.ph_related__window`).showModal();
      });

      $(`#ph_flag_btn`).click(function(){
        document.querySelector(`.ph_flagVideo__window`).showModal();
      });

      $(`#recommendedVideos`).appendTo(`.ph_recommended__container`);
      $(`#relatedVideosCenter`).appendTo(`.ph_related__container`);
      $(`#hd-rightColVideoPage`).hide();
      $(`#hd-leftColVideoPage > div.video-wrapper.js-relatedRecommended.js-relatedVideos.relatedVideos.allRelatedVideos`).hide();
      $(`#under-player-playlists`).hide();

      GM_addStyle(`
        html.supportsGridLayout.fluidContainer #main-container #vpContentContainer:not(.premiumLocked) {
            grid-template-columns: 1fr;
        }
      `);
    } else {

    }

    $(`#ph_flagVideo_btn`).click(function(){
      var url = ph__url.toString();
      var videoFlag = {"url":url.replace("#", ""), "reason":$(`#ph_videoFlagReason`).val()}
      flags.videos.push(videoFlag);
      localStorage.setItem('flags', JSON.stringify(flags));

      document.querySelector(`.ph_flagVideo__window`).close();
      Swal.fire({
        icon: 'success',
        title: 'Flagged',
        text: `Video was flagged with the reason "${$(`#ph_videoFlagReason`).val()}"`,
      }).then((result) => {
        if (result.isConfirmed) {
          document.location.reload(true);
        }
      });
    });

    $(`#ph_videoOnly_btn`).click(function(){
      $(`.ph_video-actions`).append(`
            <button id="ph_relatedVids_btn">Related</button>
            <button id="ph_recommendedVids_btn">Recommended</button>
        `);

      $(`#ph_recommendedVids_btn`).click(function(){
        document.querySelector(`.ph_recommended__window`).showModal();
      });

      $(`#ph_relatedVids_btn`).click(function(){
        document.querySelector(`.ph_related__window`).showModal();
      });

      $(`#recommendedVideos`).appendTo(`.ph_recommended__container`);
      $(`#relatedVideosCenter`).appendTo(`.ph_related__container`);
      $(`#hd-rightColVideoPage`).hide();
      $(`#hd-leftColVideoPage > div.video-wrapper.js-relatedRecommended.js-relatedVideos.relatedVideos.allRelatedVideos`).hide();
      $(`#under-player-playlists`).hide();

      GM_addStyle(`
            html.supportsGridLayout.fluidContainer #main-container #vpContentContainer:not(.premiumLocked) {
                grid-template-columns: 1fr;
            }
        `);
    });


    $(`#ph_videoDownload_btn`).click(function(){
      var url = window.location;
      var newUrl = window.location.href.replace(/(https?:\/\/)/, "$19xbud.com/");
      window.location = newUrl;
        });

    $(`.allActionsContainer .CTAs #ctaBox`).append(`
      <li><span style="display:inline-block;width:100%;height:5px;"></span></li>
      <li><a href="#"><span>Favorite</span></a></li>
    `);

    automator.onElement("#player",function(){
      if (automator.hasText(this, "No valid sources are available for this video.")) {
        Swal.fire("PH Toolbox","Your player went stale. Refresh the page.","info");
      }
    })
  }
  else if(window.location.href.indexOf("/model/") > -1 
  || window.location.href.indexOf("/pornstar/") > -1 
  || window.location.href.indexOf("/channels/") > -1 
  || window.location.href.indexOf("/users/") > -1) {
    // PH profile
    console.info("[PH Toolbox] You are currently watching a model/channel/user page");

    // Get the cache from local storage
    var cache = JSON.parse(localStorage.getItem('favCache')) || {};

    // Function to cache the response for a request
    function cacheResponse(url, response) {
      cache[url] = response;
      localStorage.setItem('favCache', JSON.stringify(cache));
    }

    // Favorites check
    function isFavorite(url){
      if(localStorage.favorites){
        // get the favorites value from the localstorage
        var _fav = JSON.parse(localStorage.favorites);
        // check against current url
        if($.inArray(url, _fav.profiles) !== -1){
          return true;
        }
      }
      return false;
    }

    function isFlagged(){
      var cur_url = ph__url.href;
      cur_url = cur_url.replace(/#+$/, ''); // Remove # character from the end of the URL
      if(localStorage.flags){
        var flags = JSON.parse(localStorage.flags);
        // check against current url
        var model = $.grep(flags.models, function(m) {
          return m.url === cur_url;
        })[0];
        if (model) {
          return {
            flagged: true,
            reason: model.reason,
            url: model.url
          };
        }
      }
      return { flagged: false };
    }

    if(isFavorite(ph__url.href)){
      $(`#mainMenuProfile > div.userButtonsMenu > div.userButtons`).append(`
                <div class="float-left mainButton">
                    <button id="ph_unfav_btn" class="buttonBase" type="button">
                        <i class="fa-regular fa-star fa-fw" style="background:unset;"></i>
                        <span class="buttonLabel">Unfavorite</span>
                    </button>
                </div>
            `);
    } else {
      $(`#mainMenuProfile > div.userButtonsMenu > div.userButtons`).append(`
                <div class="float-left mainButton">
                    <button id="ph_fav_btn" class="buttonBase" type="button">
                        <i class="fa-solid fa-star fa-fw" style="background:unset;"></i>
                        <span class="buttonLabel">Favorite</span>
                    </button>
                </div>
            `);
    };
    $(`#mainMenuProfile > div.userButtonsMenu > div.userButtons`).append(`
      <div class="float-left mainButton">
          <button id="ph_flag_btn" class="buttonBase" type="button">
              <i class="fa-solid fa-flag fa-fw" style="background:unset;"></i>
              <span class="buttonLabel">Flag</span>
          </button>
      </div>
    `);

    $(`#ph_fav_btn`).click(function(e){
      //e.preventDefault();
      var info = {};
      if (localStorage.favorites){
        var favorites = JSON.parse(localStorage.favorites);
        if (favorites.profiles.length === 0){
          var _fav = {"profiles":[ph__url],"vids":[],"playlists":[]};
          localStorage.favorites = JSON.stringify(_fav);
        } else {
          favorites.profiles.push(ph__url);
          localStorage.favorites = JSON.stringify(favorites);

          info = {
            "name":$(".topProfileHeader > div.coverImage div.name > h1").text().trim(),
            "avatar":$(".topProfileHeader > #avatarPicture #getAvatar").attr("src")
          };

          // Add the favorite item to the cache
          cacheResponse(ph__url, {"name": info.name, "avatar": info.avatar});

          Swal.fire({
            icon: 'success',
            title: 'Added to favorites',
            text: 'Model was added to favorites',
          }).then((result) => {
            if (result.isConfirmed) {
              document.location.reload(true);
            }
          });
        }
      } else {
        console.log("[PH toolbox] no localstorage");
        var _fav = {"profiles":[ph__url],"vids":[],"playlists":[]};
        localStorage.favorites = JSON.stringify(_fav);
      }
    });
    $(`#ph_unfav_btn`).click(function(e){
      //e.preventDefault();
      if (localStorage.favorites){
        var favorites = JSON.parse(localStorage.favorites);
        if (favorites.profiles.length === 0){
          var _fav = {"profiles":[ph__url],"vids":[],"playlists":[]};
          localStorage.favorites = JSON.stringify(_fav);
        } else {
          favorites.profiles = favorites.profiles.filter(url => url !== ph__url.href);
          localStorage.favorites = JSON.stringify(favorites);

          // Remove the favorite item from the cache
          delete cache[ph__url];
          localStorage.setItem('favCache', JSON.stringify(cache));

          Swal.fire({
            icon: 'success',
            title: 'Removed from favorites',
            text: 'Model was removed from favorites',
          }).then((result) => {
            if (result.isConfirmed) {
              document.location.reload(true);
            }
          });
        }
      } else {
        console.log("[PH toolbox] no localstorage");
        var _fav = {"profiles":[],"vids":[],"playlists":[]};
        localStorage.favorites = JSON.stringify(_fav);
      }
    });

    if(GM_config.get("HideShortVids") === true){
      var hiddenEl = 0;
      $(`ul.videos > .videoBox`).each(function(){
        var videoDuration = $(`.linkVideoThumb > .marker-overlays > var.duration`,this).text();
        if(timeToSeconds(videoDuration) < GM_config.get("ShortVidMin")){
          $(this).hide();
          hiddenEl++;
        }
      });
      console.log(`[PH Toolbox] Hidden ${hiddenEl} videos shorter than ${secondsToTime(GM_config.get("ShortVidMin"))}`);
    }

    $(`<div id="ph_flag__msgbox"><span class="icon"><i class="fa-regular fa-flag"></i></span><span class="text"></span></div>`).insertAfter(`#svgProfileElements`);

    $(`body`).append(`
        <dialog class="ph_dialog ph_flagModel__window">
            <div class="heading">
                <div class="left"><h2><i class="fa-solid fa-flag"></i> Flag model</h2></div>
                <div class="right"><a id="ph_modal-close" class="button"><i class="fa-solid fa-times"></i></a></div>
            </div>
            <div class="body">
            <div style="display:flex; gap: 4px;">
              <select id="ph_modelFlagReason" style="flex:1;">
                <optgroup label="Malicious activity">
                  <option value="scam">Scam</option>
                  <option value="ad">Ads</option>
                  <option value="premium">Premium account</option>
                </optgroup>
                <optgroup label="Pleasure denial">
                  <option value="no_finisher">Showoff/poser</option>
                  <option value="teaser">Teaser</option>
                  <option value="turnoff">Turn-off</option>
                </optgroup>
                <optgroup label="Misclassification">
                  <option value="dead_profile">Dead profile</option>
                  <option value="fake_profile">Fake profile</option>
                  <option value="wrong_gender">Wrong gender</option>
                </optgroup>
              </select>
              <button id="ph_flagModel_btn">Flag model</button>
              </div>
              <div style="display:flex; gap: 4px;">
                <span style="flex:1;" id="ph_flagModel_status">This model wasn't flagged</span>
                <button id="ph_flagModel_clear_btn">Clear flags</button>
              </div>
            </div>
        </dialog>
    `);

    if(isFlagged().flagged){
      $(`#ph_flagModel_status`).html(`<i class="fa-solid fa-warning fa-fw"></i> This profile was flagged as "${isFlagged().reason}"`);
      $(`#ph_modelFlagReason`).prop("disabled",true);
      $(`#ph_flagModel_btn`).prop("disabled",true);
      match(isFlagged().reason, {
        "scam||ad||premium": function() { 
            $(`#ph_flag__msgbox>.text`).text(`
              ${getRandomMessage(dict__messages.profile.malicious)}
            `);
         },
        "no_finisher||teaser||turnoff": function() { 
            $(`#ph_flag__msgbox>.text`).text(`
              ${getRandomMessage(dict__messages.profile.tease)}
            `);
         },
         "dead_profile||fake_profile": function(){
            $(`#ph_flag__msgbox>.text`).text(`
              ${getRandomMessage(dict__messages.profile.inactive_profile)}
            `);
         },
         "wrong_gender": function(){
          $(`#ph_flag__msgbox>.text`).text(`
            ${getRandomMessage(dict__messages.profile.wrong_classification)}
          `);
         }
      });
    } else {
      $(`#ph_flag__msgbox`).remove();
      $(`#ph_flagModel_status`).text(`This profile wasn't flagged`);
    }

    $(`#ph_flag_btn`).click(function(){
      document.querySelector(`.ph_flagModel__window`).showModal();
    });

    $(`#ph_flagModel_btn`).click(function(){
      var url = ph__url.toString();
      var modelFlag = {"url":url.replace("#", ""), "reason":$(`#ph_modelFlagReason`).val()}
      flags.models.push(modelFlag);
      localStorage.setItem('flags', JSON.stringify(flags));

      document.querySelector(`.ph_flagModel__window`).close();
      Swal.fire({
        icon: 'success',
        title: 'Flagged',
        text: `Profile was flagged with the reason "${$(`#ph_modelFlagReason`).val()}"`,
      }).then((result) => {
        if (result.isConfirmed) {
          document.location.reload(true);
        }
      });
    });


  }
  else if(window.location.href.indexOf("/playlist/") > -1) {
    // PH playlist
    console.info("[PH Toolbox] You are currently watching a playlist");
  }
  else if(window.location.href.indexOf("/user/friend_requests") > -1){

    $(`
      <button id="ph_massFriendSpam" class="orangeButton clearfix" style="margin: 10px 0;" type="button">Mark all as spam</button>
    `).insertBefore(`.showingInfo.vgf`)
    var spamBtnClicks = 0;

    $(`#ph_massFriendSpam`).click(function(){
      $.wait = function(ms) {
        var defer = $.Deferred();
        setTimeout(function() { defer.resolve(); }, ms);
        return defer;
      };
      spamBtnClicks++;
      if ($("#profileFeaturedVideo > .sectionWrapper > #moreData").children().length) {
        var _el = $("#profileFeaturedVideo > .sectionWrapper > #moreData");
        console.warn("[PH Toolbox] Mass marking friend requests as spam...");
        $(`li.requestBox`,_el).each(function(){
          //$(this).css("background","red");
          $("a.spam",this).trigger("click");
          automator.click("#modalWrapMTubes > div > div > div.modal-body > div:nth-child(3) > button.spriteProfileIcons.orangeButton.bigButton.yesBtn");
        });
      } else {
        console.info("[PH Toolbox] Can't do anything, chief. No friend requests.");
        if(spamBtnClicks < 3){
        } else if(spamBtnClicks > 3 && spamBtnClicks < 5){
          Swal.fire('Hi, buddy','Calm down please, you have no friend requests right now.','info');
        } else if(spamBtnClicks > 10 && spamBtnClicks < 30){
          Swal.fire('Hey','I said calm down.','warning');
        } else if(spamBtnClicks > 30){
          Swal.fire({
            title: 'HEY!!!',
            html: 'STOP. CLICKING. THE. BUTTON.',
            icon: 'error',
            timer: 10000,
            timerProgressBar: true,
            allowEscapeKey: false,
            allowEnterKey: false,
            allowOutsideClick: false,
            showConfirmButton: false,
          });
          $(`#ph_massFriendSpam`).prop('disabled', true);
          $(`#ph_massFriendSpam`).addClass('disabled');
          $.wait(15000).then(function(){
            Swal.fire({
              title: 'Haha',
              html: 'I have disabled the button. Who\'s laughing now?',
              timer: 10000,
              timerProgressBar: true,
              allowEscapeKey: false,
              allowEnterKey: false,
              allowOutsideClick: false,
              showConfirmButton: false,
            });
          });
        }
      }
    });
    
  }
  else{
    // Other cases
  }

  // GLOBAL: All pages

  $(`dialog.ph_dialog #ph_modal-close`).click(function(){
      $(this).closest(`.ph_dialog`)[0].close();
      console.log($(this));
    });

  // Add profile shortcuts on pages with video thumbs
  $(`div.thumbnail-info-wrapper.clearfix > div.videoUploaderBlock.clearfix`).each(function(){
    var modelUrl_list = $(`.usernameWrap a`,this).attr('href');
    $(this).append(`
            <div class="ph_quickActions" style="display: inline-flex; align-items: center; gap: 5px; margin: 0 5px 0 0;">
                <a href="${modelUrl_list}/photos" data-popup><i class="fa-solid fa-images-user"></i> images</a>
                <a href="${modelUrl_list}/videos" data-popup><i class="fa-solid fa-film"></i> videos</a>
            </div>
        `);
  });

  $(`
    <div class="menuLink">
      <a href="/toolbox" class="halfWidth">
        <i class="fa-solid fa-toolbox fa-fw inline" style="color:var(--ph__brand--primary);"></i>
        <span class="inline" style="color:var(--ph__brand--primary);">PH Toolbox</span>
      </a>
      <a href="/toolbox/favorites" class="halfWidth">
        <i class="fa-solid fa-heart fa-fw inline" style="color:var(--ph__brand--primary);"></i>
        <span class="inline" style="color:var(--ph__brand--primary);">[PH Toolbox] Favorites</span>
      </a>
    </div>
  `).insertAfter(`#profileMenuDropdownScroll > div.menuSection > .menuLink:has(a[href*='/translate/sign_up'])`);


  // Userscript pages
  if(window.location.href.indexOf("/toolbox") > -1) {
    console.info("[PH Toolbox] Page: Toolbox");
    $(`head>title`).text(`PH toolbox`);
    $(`.wrapper > .container`).html(`
      <div class="sectionWrapper">
        <div class="section" style="padding: 20px;">
          <h1>PH Toolbox</h1>
          <h2>Links</h2>
          <p>
            <ul>
              <li><a href="/toolbox/favorites/">My favorites</a></li>
            </ul>
          </p>
        </div>
      </div>
    `);
    if(window.location.href.indexOf("/favorites") > -1) {

      var favorites = JSON.parse(localStorage.favorites);
      console.info("[PH Toolbox] Page: Toolbox » Favorites");
      $(`head>title`).text(`PH toolbox: Favorites`);
      $(`head`).append(`
        <link rel="stylesheet" href="https://di.phncdn.com/www-static/css/./pornstar-beforeaction-pc.css?cache=2022121401" type="text/css" />
        <link rel="stylesheet" href="https://di.phncdn.com/www-static/css/./pornstar-pornstars-pc.css?cache=2022121401" type="text/css" />
      `);
      $(`.wrapper > .container`).addClass(`ph__root`);
      $(`.wrapper > .container`).html(`
        <div class="sectionWrapper">
          <div class="section" style="padding: 20px;">
            <a id="ph_getFavorites" href="#" class="buttonBase orangeButton big">Get favorites</a>
          </div>
        </div>
        <div class="sectionWrapper">
          <div class="section" style="padding: 20px;">
            <a href="/toolbox"><h1>PH Toolbox</h1></a>
            <h2>Favorites</h2>
            <p><i class="fa-regular fa-warning"></i> If your images or text appear to be broken or missing - wait a few moments and refresh the page.</p>
          </div>
        </div>
        <div class="pornstar_container">
          <div class="sectionWrapper">
            <!-- Model list -->
            <ul id="ph_favModels" class="videos row-5-thumbs popular-pornstar">
            </ul>
            <!-- / -->
          </div>
        </div>
      `);

      $(`#ph_favModels`).append(`<div class="ph__loader">Loading the favorites...</div>`);
      //$(`.ph__loader`).show();

      // Set the rate limit in milliseconds
      var rateLimit = 5000;

      // Set the maximum number of concurrent promises
      var maxConcurrentPromises = 2;

      var promises = [];

      function jsonInfo(url){
        var Url = new URL(url);
        var relUrl = Url.pathname + Url.search;
        return new Promise(function(resolve, reject) {
          var info = {};
          $.ajax({
            type: "GET",
            url: relUrl,
            success: function (response) {
              info = {
                "name":$(".topProfileHeader > div.coverImage div.name > h1", response).text().trim(),
                "avatar":$(".topProfileHeader > #avatarPicture #getAvatar", response).attr("src")
              };
              resolve(info);
            },
            error: function(jqxhr, status, exception) {
                // Group the error message in the console
                console.groupCollapsed(`Error: ${exception.message}`);
                //console.error(exception);
                //alert('Exception:', exception);
                reject(exception);
                console.groupEnd();
            }
          });
        });
      }

      // Get the cache from local storage
      var cache = JSON.parse(localStorage.getItem('favCache')) || {};

      // Function to check if a request is cached
      function isCached(url) {
        return cache.hasOwnProperty(url);
      }

      // Function to get the cached response for a request
      function getCachedResponse(url) {
        return cache[url];
      }

      // Function to cache the response for a request
      function cacheResponse(url, response) {
        cache[url] = response;
        localStorage.setItem('favCache', JSON.stringify(cache));
      }

      // Create a function to process the promises
      function processPromises() {
        // Check if there are more promises in the array
        if (promises.length > 0) {
          // Get the next batch of promises
          const batch = promises.splice(0, maxConcurrentPromises);

          // Wait for the batch to complete
          Promise.all(batch)
            .then(function() {
              // Process the next batch of promises
              setTimeout(processPromises(),rateLimit);
            })
            .catch(function(error) {
              // Group the error message in the console
              console.groupCollapsed(`Error: ${error.message}`);
              console.error(error);
              console.groupEnd();

              // Process the next batch of promises
              setTimeout(processPromises(),rateLimit);
            });
        } else {
          // Hide the loader element
          $(`.ph__loader`).hide();
        }
      }
      
      function sendRequests() {
        // Initialize a flag to track if all items are cached
        var allCached = true;

        $.each(favorites.profiles, function(index, profileUrl) {
          // Set the retry count to 0
          var retryCount = 0;
          var info = jsonInfo(profileUrl);
        
          // Function to send the request and handle the response
          function sendRequest() {
            // Check if the request is already cached
            if (isCached(profileUrl)) {
              // Get the cached response
              var cachedResponse = getCachedResponse(profileUrl);

              // Check if the cached response is valid
              var isValid = true;
              for (var prop in cachedResponse) {
                /*if (!cachedResponse.hasOwnProperty(prop) && !cachedResponse[prop]) {
                  isValid = false;
                  break;
                }*/
                if (cachedResponse.hasOwnProperty(prop) && cachedResponse[prop]) {
                  // prop is not empty, so continue to the next iteration
                  continue;
                } else {
                  // prop is empty or does not exist, so set isValid to false
                  isValid = false;
                  break;
                }
              }

              if (isValid) {
                // Do something with the cached response
                var htmlItem = `
                <li class="modelLi">
                  <div class="wrap">
                      <a href="${profileUrl}">
                          <span class="pornstar_label">
                              <span class="title-album">
                                  <span>Model</span>
                              </span>
                          </span>
                          <img class="lazy"
                              src="${cachedResponse.avatar}"
                              alt="${cachedResponse.name}">
                      </a>
                      <div class="thumbnail-info-wrapper">
                          <a href="${profileUrl}" class="title">
                              <span class="modelName">${cachedResponse.name}</span>
                          </a>
                      </div>
                  </div>
                </li>
                `;
                // Append the HTML to the DOM and fade it in
                $(`#ph_favModels`).append(htmlItem).find('.modelLi').fadeIn();
                
                console.log(cachedResponse);
              } else {
                // Set the allCached flag to false
                allCached = false;

                // Add the request promise to the array
                promises.push(
                  jsonInfo(profileUrl)
                    .then(function(info) {
                      // Cache the response
                      cacheResponse(profileUrl, info);

                      // Do something with the response
                      //console.log(info);
                      var htmlItem = `
                      <li class="modelLi">
                        <div class="wrap">
                            <a href="${profileUrl}">
                                <span class="pornstar_label">
                                    <span class="title-album">
                                        <span>Model</span>
                                    </span>
                                </span>
                                <img class="lazy"
                                    src="${info.avatar}"
                                    alt="${info.name}">
                            </a>
                            <div class="thumbnail-info-wrapper">
                                <a href="${profileUrl}" class="title">
                                    <span class="modelName">${info.name}</span>
                                </a>
                            </div>
                        </div>
                      </li>
                      `;
                      // Append the HTML to the DOM and fade it in
                      $(`#ph_favModels`).append(htmlItem).find('.modelLi').fadeIn();
                      console.log(info);
                    })
                    .catch(function(error) {
                      // Increment the retry count
                      retryCount++;

                      // If the retry count is less than the maximum number of retries, retry the request
                      if (retryCount < 5) {
                        console.warn(`[PH Toolbox] Can't get the model info, retrying... (${retryCount}/5)`)
                        sendRequest();
                      } else {
                        // Group the error message in the console
                        console.groupCollapsed(`[PH toolbox] Error: ${error.message}`);
                        console.error(error);
                        console.groupEnd();
                      }
                    })
                );
              }
            } else {
              // Set the allCached flag to false
              allCached = false;

              // Add the request promise to the array
              promises.push(
                jsonInfo(profileUrl)
                  .then(function(info) {
                    // Cache the response
                    cacheResponse(profileUrl, info);

                    // Do something with the response
                    //console.log(info);
                    var htmlItem = `
                    <li class="modelLi">
                      <div class="wrap">
                          <a href="${profileUrl}">
                              <span class="pornstar_label">
                                  <span class="title-album">
                                      <span>Model</span>
                                  </span>
                              </span>
                              <img class="lazy"
                                  src="${info.avatar}"
                                  alt="${info.name}">
                          </a>
                          <div class="thumbnail-info-wrapper">
                              <a href="${profileUrl}" class="title">
                                  <span class="modelName">${info.name}</span>
                              </a>
                          </div>
                      </div>
                    </li>
                    `;
                    // Append the HTML to the DOM and fade it in
                    $(`#ph_favModels`).append(htmlItem).find('.modelLi').fadeIn();
                    console.log(info);
                  })
                  .catch(function(error) {
                    // Increment the retry count
                    retryCount++;

                    // If the retry count is less than the maximum number of retries, retry the request
                    if (retryCount < 5) {
                      console.warn(`[PH Toolbox] Can't get the model info, retrying... (${retryCount}/5)`)
                      sendRequest();
                    } else {
                      // Group the error message in the console
                      console.groupCollapsed(`[PH toolbox] Error: ${error.message}`);
                      console.error(error);
                      console.groupEnd();
                    }
                  })
              );
            }
          }

          // Send the request in the background
          setTimeout(sendRequest, 0);
        });

        // Check if all items are cached
        if (allCached) {
          // Hide the loader element
          $(`.ph__loader`).hide();
        } else {
          // Process the promises
          processPromises();
        }
      };

      $(`#ph_getFavorites`).click(function(){
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          showCloseButton: false,
          title: "Getting favorites",
          timer: 5000,
          timerProgressBar: true
        });
        if($(`#ph_favModels`).length){
          $(`#ph_favModels`).html("");
        }
        
        setTimeout(sendRequests,rateLimit);

        // Wait for all the promises to complete
        setTimeout(processPromises(),rateLimit);
      });
    }
  }

  //---

  $(`body > div.footerContentWrapper > h2`).html(`Running scripts`);
  $(`body > div.footerContentWrapper > p`).html(`
        <p><i class="fa-solid fa-puzzle-piece-simple"></i> <span>PH Toolbox</span>,
        <i class="fa-solid fa-puzzle-piece-simple"></i> <span>pornhub crack for Russia</span>
    `);
});