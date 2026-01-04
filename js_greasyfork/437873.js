// ==UserScript==
// @name Greasy Fork Christmas Theme
// @namespace -
// @version 0.3
// @description Greasy Fork christmas theme for better atmosphere.
// @author NotYou
// @match *greasyfork.org/*
// @match *sleazyfork.org/*
// @require https://code.jquery.com/jquery-3.3.1.min.js
// @run-at document-body
// @license GPLv3
// @license-link https://www.gnu.org/licenses/gpl-3.0.txt
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/437873/Greasy%20Fork%20Christmas%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/437873/Greasy%20Fork%20Christmas%20Theme.meta.js
// ==/UserScript==

/*

﹀ Change Log ﹀

0.3 Verison:
- MORE WRAPPER
- MORE CHOCOLATE
- Satna's Hat now works at script pages

0.2 Version:
- More wrapper
- More chocolate

*/

// CSS //

(function() {
let css = `

#main-header {
background: rgba(0, 0, 0, 0) repeating-linear-gradient(290deg, rgb(219, 33, 33), rgb(132, 39, 39) 15px, rgb(151, 151, 151) 10px, rgb(255, 255, 255) 25px) repeat scroll 0% 0% !important;
}

figure {
background: rgba(0, 0, 0, 0) repeating-linear-gradient(40deg, rgb(219, 33, 33), rgb(132, 39, 39) 15px, rgb(151, 151, 151) 10px, rgb(255, 255, 255) 25px) repeat scroll 0% 0% !important;
}

figcaption {
color: rgb(5, 5, 5) !important;
font-weight: 800 !important;
}

option[data-language-url], option[value^="help"] {
background-color: rgb(232, 232, 232);
color: rgb(5, 5, 5) !important;
}

#site-name-text h1 {
line-height: 1.3em;
}

#main-header, #main-header a, #main-header a:active, #main-header a:visited, .sign-out-link {
color: rgb(5, 5, 5) !important;
font-weight: 600;
}

#christmashatjquery {
display: block !important;
position: absolute;
top: -3.22em;
z-index: 10;
left: 0px;
}

#christmashatjs {
display: block !important;
position: absolute;
top: -3.22em;
z-index: 10;
left: 80px;
}

nav nav {
background: rgba(0, 0, 0, 0) repeating-linear-gradient(230deg, rgb(19, 206, 162), rgb(21, 151, 151) 15px, rgb(151, 151, 151) 10px, rgb(255, 255, 255) 25px) repeat scroll 0% 0% !important;
border: 1px solid rgb(5, 5, 5) !important;
border-radius: 4px;
}

.list-option-group .list-current {
background: linear-gradient(rgb(117, 51, 36), rgb(47, 15, 8)), repeating-linear-gradient(-70deg, rgb(219, 85, 33), rgb(132, 61, 39) 15px, rgb(151, 151, 151) 10px, rgb(255, 255, 255) 25px) !important;
background-origin: padding-box, border-box !important;
background-repeat: no-repeat !important;
border: 5px solid transparent !important;
color: rgb(210, 210, 210) !important;
border-radius: 4px !important;
}

.tabs .current {
background: linear-gradient(rgb(117, 51, 36), rgb(47, 15, 8)), repeating-linear-gradient(70deg, rgb(219, 164, 33), rgb(132, 109, 39) 15px, rgb(151, 151, 151) 10px, rgb(255, 255, 255) 25px) !important;
background-origin: padding-box, border-box !important;
border-radius: 0px 0px 4px 4px !important;
background-repeat: no-repeat !important;
border: 5px solid transparent !important;
color: rgb(210, 210, 210) !important;
margin-top: 2px !important;
border-top: 0px !important;
}

.tabs .current a {
color: rgb(210, 210, 210) !important;
}

`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();

// JavaScript //

if(window.location.href.indexOf("scripts/") != -1) {
    var christmas = document.createElement('span');
    christmas.innerHTML = '<img src="https://icons.iconarchive.com/icons/youthedesigner/christmas-graphics/128/santa-hat-icon.png" alt="" id="christmashatjs">';
    document.body.appendChild(christmas);
}

// jQuery //

$('div#site-name').append
('<img src="https://icons.iconarchive.com/icons/youthedesigner/christmas-graphics/128/santa-hat-icon.png" alt="" id="christmashatjquery">');
















