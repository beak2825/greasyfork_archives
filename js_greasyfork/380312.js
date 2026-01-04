// ==UserScript==
// @name         muahahaha gcal allcals
// @namespace    muahahaha
// @version      1.0
// @description  display all calendars
// @match        https://calendar.google.com/calendar/*
// @run          document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380312/muahahaha%20gcal%20allcals.user.js
// @updateURL https://update.greasyfork.org/scripts/380312/muahahaha%20gcal%20allcals.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var delay_seconds=2;

    function muahahaha_gcal_allcals(){
        var p=document.querySelector('a[href*="google.com"][href*="policies/privacy"]');
        if(p){
            p.parentElement.innerHTML=p.parentElement.innerHTML+' – <a class="'+p.className+'" id="muahahaha_gcal_allcals" target="_blank" href="#" tabindex="-1" title="Display all calendars">DAC</a>';
            var a=document.querySelector('#muahahaha_gcal_allcals');
            a.addEventListener('click',function($event){
                $event.preventDefault();
                $event.stopImmediatePropagation();
                var l=[].slice.call($event.target.parentElement.previousSibling.querySelectorAll('li>label'));
                l.forEach(function($v){
                    if($v.querySelector('div[role="checkbox"]').getAttribute('aria-checked')==='false'){
                        $v.click();
                    }
                });
            });
        }
        else{
            console.log('NOOOOOO!!!!!!');
            setTimeout(muahahaha_gcal_allcals,delay_seconds*1000);
        }
    }

    muahahaha_gcal_allcals();

})();