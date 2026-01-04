// ==UserScript==
// @name         Xunlei Remote Batch Add for dydytt.net
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Auto add downloadlinks to clipboard for dydytt.net
// @author       losingrose@gmail.com
// @match        https://www.dydytt.net/*
// @match        https://dydytt.net/*
// @match        https://www.ygdy8.net/*
// @match        https://www.ygdy8.com/*
// @match        http://www.ygdy8.com/*
// @match        https://ygdy8.com/*
// @icon         https://www.google.com/s2/favicons?domain=dydytt.net
// @grant   GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/431833/Xunlei%20Remote%20Batch%20Add%20for%20dydyttnet.user.js
// @updateURL https://update.greasyfork.org/scripts/431833/Xunlei%20Remote%20Batch%20Add%20for%20dydyttnet.meta.js
// ==/UserScript==

function isUrl(uri){
    if(uri == "https://www.ygdy8.net/"||uri=="http://www.dytt8.net/")return false;
    var re = /^(magnet:\?xt=urn:btih:)[0-9a-fA-F]{40}.*$/g;
    if(re.test(uri))return true;
    re = new RegExp("(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]");
    if(re.test(uri))return true;
    re=/.+(thunder[^"]+)[^>]+[>]{1}([^<]+)/g;
    if(re.test(uri))return true;
    return false;
}

(function() {
    'use strict';
    var list = [];
    var sources = document.querySelectorAll("#Zoom a[thunderpid]");
    for(var i in sources){
        if(isUrl(sources[i].innerText)){
            list.push(sources[i].innerText);
        }
    }
    if(list.length==0){
        sources = document.querySelectorAll("#Zoom a[href]");
        for(i in sources){
            if(isUrl(sources[i].href)){
                list.push(sources[i].href);
            }
        }
    }
    if(list.length>0){
        GM_setClipboard(list.join("\n"));
    }
})();