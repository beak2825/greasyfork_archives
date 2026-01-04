// ==UserScript==
// @name         sukebei Enhancer
// @version      1.0
// @description  sukebei enhancer...
// @author       HappyTreeFriends
// @namespace    https://greasyfork.org/users/317047
// @match        https://sukebei.nyaa.si/*
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/cash/8.1.0/cash.min.js
// @icon         https://www.google.com/s2/favicons?domain=sukebei.nyaa.si
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/434772/sukebei%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/434772/sukebei%20Enhancer.meta.js
// ==/UserScript==
(function() {
    'use strict';

    if (document.querySelector('.panel-title')) {
        const element = document.querySelector('.panel-title');
        const title = element.innerText;
        const button = document.createElement("button");
        button.innerHTML = 'Copy';
        button.onclick = function() {
            copyToClipboard(getFinalTitle(title));
        };
        element.prepend(button);
        //copyToClipboard(title);
        document.querySelectorAll('a').forEach(item => {
            if(item.href.includes('magnet')){
                item.onclick = function() {
                    copyToClipboard(getFinalTitle(title));
                };
            };
        });

    }

    if (document.querySelector('table.torrent-list')) {
        //console.log('torrent-list');
        const table = document.querySelector('table.torrent-list tbody');
        table.querySelectorAll('tr').forEach(row => {
            const javName = row.childNodes[3].innerText;
            const td = row.childNodes[5];
            const a = document.createElement("a");
            a.innerHTML = '<i class="fa fa-fw fa-copy"></i>';
            a.onclick = function() {
                copyToClipboard(getFinalTitle(javName));
            };
            td.append(a);

        });
    }


})();

function getFinalTitle(text){
    const reg1 = /\+\+\+ (\[HD\]|)/g;
    const reg2 = /[\<\>\:\"\/\\\|\?\*]/g;
    return text.replace(reg1, "").trim();
}


var copyToClipboard = function(secretInfo) {
    const tempInput = document.createElement('INPUT');
    document.body.appendChild(tempInput);
    tempInput.setAttribute('value', secretInfo)
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
}