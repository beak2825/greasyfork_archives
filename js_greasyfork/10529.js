// ==UserScript==
// @name           Finya profilepic zoom remover
// @include        http://*.finya.de/User/*
// @description    Remove zoom effect from Finya userimages
// @version 1.01
// @namespace      https://greasyfork.org/users/8629
// @downloadURL https://update.greasyfork.org/scripts/10529/Finya%20profilepic%20zoom%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/10529/Finya%20profilepic%20zoom%20remover.meta.js
// ==/UserScript==

// Disable gallery hover zoom
if (typeof GM_addStyle === 'undefined') 
    GM_addStyle = function(css) {
        var head = document.getElementsByTagName('head')[0], style = document.createElement('style');
        if (!head) {return}
        style.type = 'text/css';
        try {style.innerHTML = css}
        catch(x) {style.innerText = css}
        head.appendChild(style);
    };
	
GM_addStyle('#profile-gallery:hover #profilepic { transform: Scale(1.0) !important; }');
