// ==UserScript==
// @name         Enable Button Chat Allegro
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Omijanie niedostępnego chatu allegro
// @author       Paweł Kaczmarek
// @match        https://allegro.pl/pomoc/kontakt
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499031/Enable%20Button%20Chat%20Allegro.user.js
// @updateURL https://update.greasyfork.org/scripts/499031/Enable%20Button%20Chat%20Allegro.meta.js
// ==/UserScript==
(function(){"use strict";function enableButton(){var button=document.querySelector('button[type="submit"][data-role="channel-submit-button"]');if(button&&button.hasAttribute("disabled")){button.removeAttribute("disabled");console.log("Disabled attribute removed from button")}}window.addEventListener("load",function(){enableButton();var interval=setInterval(function(){var button=document.querySelector('button[type="submit"][data-role="channel-submit-button"]');if(button){button.removeAttribute("disabled");console.log("Disabled attribute removed from button")}},500);setTimeout(function(){clearInterval(interval)},10000)});var observer=new MutationObserver(function(mutations){mutations.forEach(function(mutation){enableButton()})});observer.observe(document.body,{childList:true,subtree:true});document.addEventListener("click",function(){enableButton()})})();
