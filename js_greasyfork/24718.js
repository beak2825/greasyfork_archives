// ==UserScript==
// @name        soup.io_force_working_asset_hosts
// @namespace   http://animeisouronlysalvationfromthehorrorofexistence.soup.io/
// @include     http://*soup.io/*
// @include     https://*soup.io/*
// @description  Right now soup.io have problem with many image hosts which results in nearly half of the images being not displayed. Here's a workaround - force browser to use known-to-be-working asset hosts.
// @version     5
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/24718/soupio_force_working_asset_hosts.user.js
// @updateURL https://update.greasyfork.org/scripts/24718/soupio_force_working_asset_hosts.meta.js
// ==/UserScript==


// A list of known to be working asset hosts.
var working_hosts = [ 'asset-0', 'asset-1', 'asset-2', 'asset-3', 'asset-4', 'asset-5' ];
var regex = new RegExp("asset-[^012345]", "g");

function force_working_asset_hosts(){
    var tags = document.getElementsByTagName('img');
    var anchors = document.getElementsByTagName('a');
    var links = document.getElementsByTagName('link');

    for (var i = 0; i < tags.length; i++) {
        var rand_host = working_hosts[Math.floor(Math.random()*working_hosts.length)];
        tags[i].src = tags[i].src.replace(regex, rand_host);
    }

    for (var i = 0; i < anchors.length; i++) {
        var rand_host = working_hosts[Math.floor(Math.random()*working_hosts.length)];
        anchors[i].href = anchors[i].href.replace(regex, rand_host);
    }

    for (var i = 0; i < links.length; i++) {
        var rand_host = working_hosts[Math.floor(Math.random()*working_hosts.length)];
        links[i].href = links[i].href.replace(regex, rand_host);
    }
}

force_working_asset_hosts();

var observer = new MutationObserver(function(mutations) {
    force_working_asset_hosts();
});

var config = { attributes: true, childList: true, characterData: true };
var target = document.getElementById('more_history');
 
observer.observe(target, config);

