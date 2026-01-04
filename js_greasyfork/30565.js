// ==UserScript==
// @name           Primewire Real Links
// @namespace      nitrocode
// @description    For PrimeWire, LetMeWatchThis, and OneChannel. If link text is missing, it will fill it so you can see which CDNs to click on. This will also strip out Promo / Sponsor hosts.
// @version        0.2
// @include        /^https?:\/\/(www\.)?primewire\.ag\/.*$/
// @include        /^https?:\/\/(www\.)?primewire\.is\/.*$/
// @include        /^https?:\/\/(www\.)?primewire\.org\/-.*$/
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/30565/Primewire%20Real%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/30565/Primewire%20Real%20Links.meta.js
// ==/UserScript==

// Purposely did not use jquery because it didn't seem to work too well with FF
// Only run script after the page has fully loaded
window.addEventListener('load', function() {
    // grab all version_host class vars that hold the rocker script
    var links = document.querySelectorAll('.version_host');
    var link_text = "";
    var real_link_count = 0;
    for (var i=0; i<links.length; i++) {
        // cut up the string instead of eval'ing so it's safe
        link_text = links[i].innerHTML.substring(
            links[i].innerHTML.indexOf("'") + 1,
            links[i].innerHTML.lastIndexOf("'")
        );
        // Remove Promo Host and Sponsor Host
        if (!link_text.includes('Host')) {
            links[i].innerHTML = link_text;
            console.log('Found real link: ' + link_text);
            real_link_count++;
        } else {
            links[i].closest('table').remove();
            console.log('Removed: ' + link_text);
        }
    }
    console.log('Found ' + real_link_count + ' real links');
}, false);
