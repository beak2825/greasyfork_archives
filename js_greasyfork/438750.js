// ==UserScript==
// @name           Neopets Links Redirector
// @author         Rae
// @description    Redirects Neopets inventory links to non-beta version, Premium button to Beta premium portal, and NC mall button to the actual mall.
// @include        *neopets.com/*
// @include        *thedailyneopets.com/*
// @include        *jellyneo.net/*
// @include        *ncmall.neopets.com/mall/shop.phtml?page=&cat=
// @version        2.0c
// @namespace      https://greasyfork.org/users/866507
// @downloadURL https://update.greasyfork.org/scripts/438750/Neopets%20Links%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/438750/Neopets%20Links%20Redirector.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
    for (var i=0,link; (link=document.links[i]); i++) {
        link.href = link.href.replace('neopets.com/inventory.phtml', 'neopets.com/inventory.phtml/');
        link.href = link.href.replace('neopets.com/objects.phtml?type=inventory', 'neopets.com/inventory.phtml/');
        link.href = link.href.replace('https://secure.nc.neopets.com/get-nickcash', 'http://ncmall.neopets.com/mall/shop.phtml?page=&cat=');
        link.href = link.href.replace('nc.neopets.com/membership/', 'neopets.com/premium/');
    }

})();