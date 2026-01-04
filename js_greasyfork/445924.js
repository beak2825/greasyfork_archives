// ==UserScript==
// @name         OnlyRev
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Revive Filter
// @author       Zero [2669774]
// @match        https://www.torn.com/hospitalview.php*
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/445924/OnlyRev.user.js
// @updateURL https://update.greasyfork.org/scripts/445924/OnlyRev.meta.js
// ==/UserScript==
function hideRev(){
    var rev = document.querySelector('#mainContainer > div.content-wrapper.m-left20.left.spring > div.userlist-wrapper.hospital-list-wrapper > ul').getElementsByTagName('li');
    var el;
        if(rev.length >1){
            for (let i = 0;i<rev.length;i+=2){
                el = rev[i];
                if (el.innerHTML.includes('reviveNotAvailable')){
                    el.style.display = 'none';
                }
            }
        }
        else{
            setTimeout(hide, 100);
        }
}

(function() {
    'use strict';
    const button = `<button id="onlyRev" style="color: var(--default-blue-color); cursor: pointer; margin-right: 0; font-size:30px;">OnlyRev</button>`;
    $('div.content-title > h4').append(button);
    $('#onlyRev').on('click',hideRev);
})();