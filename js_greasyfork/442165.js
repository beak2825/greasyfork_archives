// ==UserScript==
// @name         🔥 Fire๖ۣۜMarcos Theme 🔥
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  🔘 Fire๖ۣۜMarcos's Official Shell Shockers Theme 🔘
// @author       AtHomeGaming
// @match        https://shellshock.io/*
// @match        https://eggcombat.com/*
// @match        https://eggfacts.fun/*
// @match        https://biologyclass.club/*
// @match        https://egghead.institute/*
// @match        https://egg.dance/*
// @match        https://eggisthenewblack.com/*
// @match        https://mathfun.rocks/*
// @match        https://hardboiled.life/*
// @match        https://overeasy.club/*
// @match        https://zygote.cafe/*
// @match        https://eggsarecool.com/*
// @match        https://deadlyegg.com/*
// @match        https://mathgames.world/*
// @match        https://hardshell.life/*
// @match        https://violentegg.club/*
// @match        https://yolk.life/*
// @match        https://softboiled.club/*
// @match        https://scrambled.world/*
// @match        https://deathegg.world/*
// @match        https://violentegg.fun/*
// @match        https://geometry.monster/*
// @match        https://humanorganising.org/*
// @match        https://algebra.vip/*
// @match        https://mathdrills.info/*
// @match        https://geometry.report/*
// @match        https://mathlete.fun/*
// @match        https://shellshock.io/unblocked/*
// @match        https://mathlete.pro/*
// @icon         https://gray-wagm-prod.cdn.arcpublishing.com/resizer/b-15--6Jk0TG95jg-30GKlQAi98=/1200x675/smart/filters:quality(85)/cloudfront-us-east-1.images.arcpublishing.com/gray/FAX4FE4H45CWTCHWJHP7OVW2F4.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442165/%F0%9F%94%A5%20Fire%E0%B9%96%DB%A3%DB%9CMarcos%20Theme%20%F0%9F%94%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/442165/%F0%9F%94%A5%20Fire%E0%B9%96%DB%A3%DB%9CMarcos%20Theme%20%F0%9F%94%A5.meta.js
// ==/UserScript==

document.title="Shell Shockers";
setTimeout(function(){
    document.getElementById("logo").innerHTML = "<img style='width: 250px; height: 250px; ' img src='https://i.pinimg.com/originals/2d/3f/3b/2d3f3b87f398c8f45543fba4b4a5249d.png'>";
}, 2000);
let style = document.createElement('link');
style.rel = 'stylesheet';
style.href = 'https://fire-theme.athomegaming12.repl.co/style.css';
document.head.appendChild(style);