// ==UserScript==
// @name         DuckDuckGo Settings Changer
// @namespace    https://violentmonkey.github.io/
// @version      1.0
// @description  Change the default DuckDuckGo search settings, disable Safe Search, open links in background tab and set other preferences more convenient for you
// @author       Streampunk
// @icon         data:image/png;base64,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
// @match        https://duckduckgo.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538872/DuckDuckGo%20Settings%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/538872/DuckDuckGo%20Settings%20Changer.meta.js
// ==/UserScript==
 
// Set a preference of your choice among the available options. Settings will be saved in browser cookies.
// General search settings
// Region (Changes the preferred region for search results):
// xa-ar for Arabia
// xa-en for Arabia (en)
// ar-es for Argentina
// au-en for Australia
// at-de for Austria
// be-fr for Belgium (fr)
// be-nl for Belgium (nl)
// br-pt for Brazil
// bg-bg for Bulgaria
// ca-en for Canada (en)
// ca-fr for Canada (fr)
// ct-ca for Catalan
// cl-es for Chile
// cn-zh for China
// co-es for Colombia
// hr-hr for Croatia
// cz-cs for Czech Republic
// dk-da for Denmark
// ee-et for Estonia
// fi-fi for Finland
// fr-fr for France
// de-de for Germany
// gr-el for Greece
// hk-tzh for Hong Kong
// hu-hu for Hungary
// in-en for India
// id-id for Indonesia
// id-en for Indonesia (en)
// ie-en for Ireland
// il-he for Israel
// it-it for Italy
// jp-jp for Japan
// kr-kr for Korea
// lv-lv for Latvia
// lt-lt for Lithuania
// xl-es for Latin America
// my-ms for Malaysia
// my-en for Malaysia (en)
// mx-es for Mexico
// nl-nl for Netherlands
// nz-en for New Zealand
// no-no for Norway
// pe-es for Peru
// ph-en for Philippines
// ph-tl for Philippines (tl)
// pl-pl for Poland
// pt-pt for Portugal
// ro-ro for Romania
// ru-ru for Russia
// sg-en for Singapore
// sk-sk for Slovak Republic
// sl-sl for Slovenia
// za-en for South Africa
// es-es for Spain
// se-sv for Sweden
// ch-de for Switzerland (de)
// ch-fr for Switzerland (fr)
// ch-it for Switzerland (it)
// tw-tzh for Taiwan
// th-th for Thailand
// tr-tr for Turkey
// ua-uk for Ukraine
// uk-en for United Kingdom
// us-en for United States
// ue-es for United States (es)
// ve-es for Venezuela
// vn-vi for Vietnam
// wt-wt for No region
   var l = 'wt-wt';

// Display Language (Changes the language for elements like buttons, settings, and labels)
// af_ZA for Afrikaans (South Africa)...
//   var ad = '';

// Safe Search (Omits objectionable (mostly adult) material):
// 1 for On, -1 for Moderate; -2 for Off
   var p = '-2';

// Instant Answers (Automatically open relevant Instant Answers):
// 1 for On, -1 for Off
   var z = '1';

// Auto-load Images (Infinite Scroll loads more results in Images, Videos, and Shopping when scrolling):
// 1 for On, -1 for Off
   var c = '1';

// Auto-load Results (Infinite Scroll loads more results when scrolling):
// 1 for On, -1 for Off
   var av = '1';

// Open Links in a New Tab (Opens results in new windows/tabs):
// 1 for On, -1 for Off
   var n = '1';

// Site Icons (Displays favicons for each result):
// 1 for On, -1 for Off
   var f = '1';

// Site Names (Displays site names for each result):
// 1 for On, -1 for Off
   var bh = '1';

// URL Format (Changes how result URLs are displayed):
// 1 for On (Full URLs - Slashes), -1 for Off (Domains Only)
   var af = '1';

// Autocomplete Suggestions (Shows suggestions under the search box as you type):
// 1 for On, -1 for Off
   var ac = '-1';

// Privacy Settings
// Redirect (In some older browsers, it's necessary to redirect your clicks through our server to prevent search leakage):
// 1 for On, -1 for Off
   var d = '-1';

// Address bar Requests - (Search queries are included in URL):
// g for GET, p for POST
   var g = 'p';

// Video Playback (Changes what happens when you click on a video thumbnail):
// 1 for Always play on DuckDuckGo, 2 for Open on third-party site, -1 for Prompt me
   var five = '-1';

// Color Settings
// URLs color (Changes the color of result URLs):
// r for Red
// g for Green
// l for Black
// b for Blue
// p for Purple
// o for Orange
// e for Grey (default)
// or write out the color code you want, e.g. 395323
   var x = 'e';

// Background color (Changes the background color across the entire site):
// w for White (default)
// d for Light green
// g for Intense green
// g2 for Green
// b for Light blue
// b2 for Blue
// r for Intense red
// r2 for Red
// p for Purple
// o for Orange
// or write out the color code you want, e.g. 395323.
   var seven = 'w';

// Snippet Color (Changes the color of descriptive content shown for results):
// g for Grey (default) or write out the color code you want, e.g. 395323
   var eight = 'g';

// Title Color (Changes the color of result titles):
// g for Dark Grey (default), b for Blue or write out the color code you want, e.g. 395323
   var nine = '272b9c';

// Visited Title Color (Changes the color of titles for results you've visited):
// g for Grey with checkmark (default), p for Purple or write out the color code you want, e.g. 395323.
   var aa = '950de6';

// Look & Feel Settings
// Theme (Default, Basic, Contrast, Dark, Gray, Terminal):
// -1 for Default, b for Basic, c for Contrast, r for Retro, d for Dark, g for Gray, t for Terminal or write out the color code you want, e.g. 395323
   var ae = '-1';

// Font Size (Changes the font size across the entire site):
// n for Large (default), l for Larger, t for Largest, m for Medium, s for Small
   var s = 'l';

// Page Width (Controls the width of the search box and results):
// n for Normal (default), w for Wide, s for Super wide
   var w = 's';

// Center Alignment (Displays results in the center of the page):
// m for Middle, l for Left (default)
   var m = 'l';

// Title Font (Changes the font of result titles):
// a for Arial
// c for Century Gothic
// g for Georgia
// h for Helvetica
// u for Helvetica Neue
// p for Proxima Nova (default)
// q for Pangea
// n for Sans-serif
// e for Segoe UI
// s for Serif
// t for Times
// o for Tahoma
// b for Trebuchet MS
// v for Verdana
// or write out the font you want
   var a = 'a';

// Title Underline (Underlines result titles):
// 1 for On, -1 for Off (default)
   var u = '-1';

// Font (Changes the font across the entire site):
// a for Arial
// c for Century Gothic
// g for Georgia
// h for Helvetica
// u for Helvetica Neue
// p for Proxima Nova (default)
// q for Pangea
// n for Sans-serif
// e for Segoe UI
// s for Serif
// t for Times
// o for Tahoma
// b for Trebuchet MS
// v for Verdana
// or write out the font you want
   var t = 'a';

// Appearance (Interface Settings)
// Header Behavior (Changes how the header is displayed and its behavior as you scroll):
// 1 for On & Fixed, d for On & Dynamic (default), s for On & scrolling, -1 for Off except for Instant Answer Menu
   var o = 's';

// 'Always protected' Reminder (Shows a reminder that searches on DuckDuckGo are always protected. Turning this off hides the reminder and never affects search protection.)
// 1 for On (default), -1 for Off
   var psb = '-1';

// Advertisements (If you want to support DuckDuckGo):
// 1 for On (default), -1 for Off
   var one = '-1';

// Page Break Numbers (Shows page numbers at result page breaks) & Page Break Lines (Shows horizontal lines at result page breaks):
// 1 for On (default), l for page numbers but no lines, m for break lines but no numbers, -1 for Off
   var v = '1';

// Units of Measure (Preferred units of measure):
// 1 for On (default), m for Metric (kilograms, meters, Celsius), u for US-based (pounds, feet, Fahrenheit), -1 for Off
   var aj = '1';

// Source (A string to identify the source. See this help page for more info https://duckduckgo.com/duckduckgo-help-pages/privacy/t):
// var t = 'raspberrypi';
 
// Set the value of custom settings as activated, so that the script works properly
   var user_settings = 'activated';
 
// A Function to Set a Cookie
function setCookie(cName, cValue) {
  const domain = "domain=" + window.location.hostname;
  document.cookie = cName + "=" + cValue + ";" + domain + ";";
}
 
// A Function to Get a Cookie
function getCookie(cName) {
  let Name = cName + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(Name) == 0) {
      return c.substring(Name.length, c.length);
    }
  }
  return "";
}
 
// A Function that Checks if a Cookie is set
function checkCookie() {
  let user = getCookie("user_settings");
  if (user != "") {
 // Remember to open the console (Press F12)
    console.error("Сookies with custom user settings are set!");
  } else {
 // Apply setCookie
    setCookie('l', l);      // Region
//  setCookie('ad', ad);    // Display Language
    setCookie('p', p);      // Safe Search
    setCookie('z', z);      // Instant Answers
    setCookie('c', c);      // Auto-load Images
    setCookie('av', av);    // Auto-load Results
    setCookie('n', n);      // Open links in New tab
    setCookie('f', f);      // Favicons
    setCookie('bh', bh);    // Site Names
    setCookie('af', af);    // Full URLs
    setCookie('ac', ac);    // Auto-suggest
    setCookie('d', d);      // Redirect
    setCookie('g', g);      // Address bar Requests
    setCookie('5', five);   // Video Playback
    setCookie('x', x);      // URLs color
    setCookie('7', seven);  // Background color
    setCookie('8', eight);  // Snippet color
    setCookie('9', nine);   // Title color
    setCookie('aa', aa);    // Visited Title color
    setCookie('ae', ae);    // Theme
    setCookie('s', s);      // Font Size
    setCookie('w', w);      // Page Width
    setCookie('m', m);      // Center Alignment
    setCookie('a', a);      // Title font
    setCookie('u', u);      // Title Underline
    setCookie('t', t);      // Font
    setCookie('o', o);      // Header Behavior
    setCookie('psb', psb);  // Always protected Reminder
    setCookie('1', one);    // Advertisements
    setCookie('v', v);      // Page Break Numbers & Lines
    setCookie('aj', aj);    // Units of Measure
//  setCookie('t', t);      // Source
    setCookie('user_settings', user_settings);  // User settings enabled
    location.reload();
  }
}
 
// Check if Сookies are set and if not, set a Сookie with custom user settings
checkCookie();