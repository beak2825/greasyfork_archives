// ==UserScript==
// @name         Autopost VK
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Autopost для VK
// @author       ʄɛռɨx
// @include      https://vk.com/(указываем свою страничку)
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476938/Autopost%20VK.user.js
// @updateURL https://update.greasyfork.org/scripts/476938/Autopost%20VK.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
   let
     text = 'text with #tampermonkey #userscript',
     date = new Date(2023,10,26,10,1).getTime()/1000;
    let
      send_post  = document.querySelector('#send_post'),
      post_field = document.querySelector('#post_field'),
      post_action= document.querySelectorAll('.post_action_btn_layout')[1],
      postpone   = document.querySelector('#postpone_date1');

post_field.focus();
post_field.innerHTML = text;
    
    simulateClick(post_action);
    postpone   = document.querySelector('#postpone_date1');
    
    postpone.value = date;
    send_post.click();
    
})();

function simulateClick(element){
    let ev = new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': true,
    });
    let canceled = !element.dispatchEvent(ev);
    return canceled;
}