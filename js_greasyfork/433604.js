// ==UserScript==
// @name            My Twitch Drop Claimer - inventory ()
// @name:ru         My Twitch Drop Claimer - в инвентаре, не чат
// @namespace
// @version         0.2
// @description     automatically clicks the "Claim" button
// @description:ru  автоматически получает дроп
// @author          dykomenko
// @match        https://www.twitch.tv/drops/inventory
// @icon         https://www.google.com/s2/favicons?domain=twitch.tv
// @grant        none
// @namespace https://greasyfork.org/users/104360
// @downloadURL https://update.greasyfork.org/scripts/433604/My%20Twitch%20Drop%20Claimer%20-%20inventory%20%28%29.user.js
// @updateURL https://update.greasyfork.org/scripts/433604/My%20Twitch%20Drop%20Claimer%20-%20inventory%20%28%29.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

(function() { 'use strict';
             //ty Aaz
             const ClaimButtonNames = [
                 'Claim now', //English
                 'Получить сейчас', //Русский
             ]

             const CloseChatRulesButtonName = ['chat-rules-ok-button', ];

             var ClaimButtonClass = '';
             var CloseChatRulesButtonClass = '';

             const GetClass = function (But, PressIt, ignorName) {

                 let ButtonClass = '';

                 const yNode = document.querySelectorAll('button');

                 if (yNode) {

                     let s = '';

                     for (let i = 0; i < yNode.length; i++) {

                         s = '';

                         if (!ignorName) {
                             s = yNode.item(i).textContent;
                         }

                         if (s == '' && yNode.item(i).attributes[1]) {
                             s = yNode.item(i).attributes[1].nodeValue;
                         }

                         if (s != '' && But.includes(s)) {
                             ButtonClass = '.' + yNode.item(i).classList.value.replace(/ /ig, '.');
                             if (PressIt) {
                                 yNode.item(i).click();
                                 console.log('Button "' + s + '" is pressed');
                             }
                             break;
                         }
                     }
                 }

                 return ButtonClass;

             }

             const GetClaimButton = () => {

                 if (ClaimButtonClass == '') {
                     ClaimButtonClass = GetClass(ClaimButtonNames, false, false);
                 }

                 if (ClaimButtonClass != '') {
                     const xNode = document.querySelector(ClaimButtonClass);

                     if (xNode) {
                         xNode.click();
                         console.log('Claim drop button is pressed');
                     }
                 }

                 if (CloseChatRulesButtonClass == '') {
                     CloseChatRulesButtonClass = GetClass(CloseChatRulesButtonName, true, true);
                 }

             };


             const reload = function(){
                 window.location.reload();
             };

             const vmark = function(){
                 document.querySelectorAll('h2')[2].innerHTML += " ✅";
             }

             setTimeout(vmark, 2000);
             setInterval(GetClaimButton, 29000);
             setInterval(reload, 60000);

            })();





