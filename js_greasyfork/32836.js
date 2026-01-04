// ==UserScript==
// @name         Dark Mousehunt
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       Hazado
// @include		http://mousehuntgame.com/*
// @include		https://mousehuntgame.com/*
// @include		http://www.mousehuntgame.com/*
// @include		https://www.mousehuntgame.com/*
// @include		http://apps.facebook.com/mousehunt/*
// @include		https://apps.facebook.com/mousehunt/*
// @include		http://hi5.com/friend/games/MouseHunt*
// @include		http://mousehunt.hi5.hitgrab.com/*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32836/Dark%20Mousehunt.user.js
// @updateURL https://update.greasyfork.org/scripts/32836/Dark%20Mousehunt.meta.js
// ==/UserScript==

setInterval(function () {
    var test = document.querySelectorAll('div,td,a');
    for (var i = 0; i < test.length; i++) {
        if (test[i].className.match(/^(trapImageView-trapAuraContainer|trapImageView-layer|campPage-trap-itemBrowser-item-image|campPage-trap-itemBrowser-armed-item-image|value|mousehuntHud-menu|mousehuntHud-premiumShop-newItemsBanner|mousehuntHud-huntersHorn-container|mousehuntHud-gameInfo|pageUtil-link|mousehuntHud|wrapper|shield|icon|active_poster|fools_gold|jsDialog|active-listings|buy|sell|history|listing|labyrinth|section|hud|rank|score|title|timer|name|help|friendsOnline|layer sigil|item|icon|mousehuntHeaderView-gameTabs|menuItem|floatr|arrow|mousehuntTooltip|travelPage|adversariesPage)|hud/i) === null) {
            if (test[i].id.match(/MHH_Display|hudLocationContent|overlayBg|overlayPopup|jsDialog|ajax|pagemessage/i) === null) {
                if (test[i].target === undefined || test[i].target.match(/_self|_blank/i) === null) {
                    test[i].style.backgroundColor = "#28292a";
                    test[i].style.color = "#CCC";
                }
            }
        }
    }
}, 100);
document.body.style.backgroundColor = "#28292a";
document.body.style.color = "#CCC";
document.body.style.backgroundImage = "none";