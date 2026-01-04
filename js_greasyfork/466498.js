// ==UserScript==
// @name         WPLocker load links
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  WPLocker download links convertation to actual links
// @author       Aneugene
// @match        *://www.wplocker.com/wordpress-plugins/*
// @match        *://www.wplocker.com/template/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wplocker.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466498/WPLocker%20load%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/466498/WPLocker%20load%20links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let links = document.getElementsByClassName('quote')[0];
    if (links == undefined){
        return;
    }
    links = links.innerHTML.slice(18, -19).split('<br>');
    let form_link = ''
    for (let i=0;i<links.length;i++){
        form_link = form_link + '<a href="'+links[i]+'" target="_blank">'+links[i].split('/')[2]+'</a><br>'
    }
    document.getElementsByClassName('quote')[0].innerHTML = form_link;
})();