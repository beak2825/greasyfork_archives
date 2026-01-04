// ==UserScript==
// @name         Double click bazaar buy
// @description  Double click buy
// @version      1.0
// @match        https://www.torn.com/bazaar.php*
// @author       KingLouisCLXXII [2070312]
// @icon         https://www.google.com/s2/favicons?domain=torn.com
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/844643
// @downloadURL https://update.greasyfork.org/scripts/436108/Double%20click%20bazaar%20buy.user.js
// @updateURL https://update.greasyfork.org/scripts/436108/Double%20click%20bazaar%20buy.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var css = `[aria-labelledby^="buy-confirmation-msg-"][aria-label="Yes"] {position: absolute;
    bottom: 0;
    right: 0;
    height: 50%;
    width: 44px;}
    div>li[id^="option-"]{flex-grow: 1;
    list-style-type: none;
    writing-mode: vertical-lr;
    text-align: center;
    background: linear-gradient(180deg,#fff,#ddd);
    display: none;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border-right:1px solid #aaa}
    div[class*="searchBar___"][class*="tablet___"]>li{
    display: flex;
    }
    div[class*="searchBar___"][class*="tablet___"]>li+div{
    display: none;
    }`,
        head = document.head,
        style = document.createElement('style');

    head.appendChild(style);
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));

    setInterval(()=>{
        if(document.querySelector('ul>li[id^="option-"]')){
            document.querySelectorAll(':not(ul)>[id^="option-"]').forEach(v=>v.remove());
            document.querySelectorAll('li[id^="option-"]').forEach((v,k)=>v.parentElement.parentElement.parentElement.parentElement.parentElement.insertBefore(v,v.parentElement.parentElement.parentElement.parentElement.parentElement.children[k]));
        }
    },500);
})();