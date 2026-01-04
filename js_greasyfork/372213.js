// ==UserScript==
// @name         Redirect To Google
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fuck default baidu.
// @author       Hnayan
// @match        *://www.baidu.com/s?wd=*
// @downloadURL https://update.greasyfork.org/scripts/372213/Redirect%20To%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/372213/Redirect%20To%20Google.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //Just use '=' to split it,because all '=' in query's inside will convert to '%D3',as same as blank will convert.
    //So don't think about 'wd=bla=blah=bl3' and 'hello world'.
    const query = window.location.search.split('=')[1];
    const googleSite = `https://www.google.com.hk/search?q=${query}`;
    //I don't want to see baidu's page
    const mask = document.createElement("div");
    mask.id = 'maskk';
    mask.style = 'position:absolute;width:100%;height:100%;z-index:9999;left:0;top:0;background-color:gray;opacity:0.95;';
    document.body.appendChild(mask);
    //open in current tab
    const virtualButton=document.createElement("a");
    virtualButton.setAttribute('href', googleSite);
    virtualButton.click();
})();