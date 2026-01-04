// ==UserScript==
// @name         Pontos na aba e auto coleta
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.twitch.tv/*
// @namespace
// @downloadURL https://update.greasyfork.org/scripts/393986/Pontos%20na%20aba%20e%20auto%20coleta.user.js
// @updateURL https://update.greasyfork.org/scripts/393986/Pontos%20na%20aba%20e%20auto%20coleta.meta.js
// ==/UserScript==
setTimeout(function(){ function click(t,i){var n=document.createEvent("MouseEvent"),o=document.elementFromPoint(t,i);n.initMouseEvent("click",!0,!0,window,null,t,i,0,0,!1,!1,!1,!1,0,null),o.dispatchEvent(n)}if(typeof bonus=='number'){clearInterval(bonus);clearInterval(bonus_title);var bonus=null,bonus_title=null;if(document.querySelector('.channel-page__panel-container').firstChild.firstChild.getAttribute('original-title')!=null){window.document.title=document.querySelector('.channel-page__panel-container').firstChild.firstChild.getAttribute('original-title')} document.querySelector('.tw-animated-glitch-logo__body').setAttribute('style','')}else{var bonus=setInterval(function(){if(document.querySelector('.community-points-summary')==null)return!1;if(document.querySelector('div.claimable-bonus__icon')){var chest=document.querySelector('div.claimable-bonus__icon').getBoundingClientRect();click(chest.left+Math.floor((Math.random()*8)+1),chest.top+Math.floor((Math.random()*8)+1));}},3000);var bonus_title=setInterval(function(){if(document.querySelector('.community-points-summary')==null)return!1;if(document.querySelector('.channel-page__panel-container').firstChild.firstChild.getAttribute('original-title')==null){document.querySelector('.channel-page__panel-container').firstChild.firstChild.setAttribute('original-title',window.document.title)} window.document.title='('+document.querySelector('.community-points-summary').firstChild.firstChild.nextSibling.firstChild.nextSibling.innerText.replace(/[^\d,]+/i,'')+') '+document.querySelector('.channel-page__panel-container').firstChild.firstChild.getAttribute('original-title')},3000);document.querySelector('.tw-animated-glitch-logo__body').setAttribute('style','fill:rgb(0,199,172)!important')};},5000);
