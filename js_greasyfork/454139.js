// ==UserScript==
// @name         Get More Spaces in Your Garage for Nitro Type and Math
// @namespace    https://singdevelopmentsblog.wordpress.com
// @version      0.3
// @description  Sing Developments has created this script for you to use for personal use. This script should help you to add spaces to your garage parking lot.
// @author       Sing Developments
// @match        https://www.nitrotype.com/garage
// @match        https://www.nitromath.com/garage/
// @icon         https://singdevelopmentsblog.files.wordpress.com/2022/11/nitrotype-logo.jpg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454139/Get%20More%20Spaces%20in%20Your%20Garage%20for%20Nitro%20Type%20and%20Math.user.js
// @updateURL https://update.greasyfork.org/scripts/454139/Get%20More%20Spaces%20in%20Your%20Garage%20for%20Nitro%20Type%20and%20Math.meta.js
// ==/UserScript==

javascript:(async(a,b='',c,d=JSON.parse(JSON.parse(localStorage['persist:nt']).user).garage)=>{if(!a)return;for(c=0;c<a*30;c++)b+=`garage%5B${c}%5D=${d[c]||''}&`;await fetch('api/v2/loot/arrange-cars',{'headers':{'Authorization':'Bearer '+localStorage.player_token,'Content-Type':'application/x-www-form-urlencoded'},'body':b,'method':'POST','mode':'cors'});alert`Logging you out... Please log back in to see changes.`;document.querySelector('a.dropdown-link[href="/"]').click()})(prompt`Number of garage sections (~30 max):`)