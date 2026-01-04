// ==UserScript==
// @name        AO3: Display Tag ID – Fixed
// @namespace   WhyEssEff
// @description a quick and dirty script to display a canonical tag's tag id in its /works page – written by adustyspectacle (to 1.3), updated by WhyEssEff
// @version     1.4
// @history     1.4 – WhyEssEff's quick fix
// @history     1.3 - changed how the tag id's displayed
// @history     1.2 - updated include urls to work with ao3's https switch
// @history     1.1 - changed the include to be more specific
// @grant       none
// @match     http://*archiveofourown.org/tags/*/works*
// @match     https://*archiveofourown.org/tags/*/works*
// @match     http://*archiveofourown.org/works?*
// @match     https://*archiveofourown.org/works?*
// @downloadURL https://update.greasyfork.org/scripts/468511/AO3%3A%20Display%20Tag%20ID%20%E2%80%93%20Fixed.user.js
// @updateURL https://update.greasyfork.org/scripts/468511/AO3%3A%20Display%20Tag%20ID%20%E2%80%93%20Fixed.meta.js
// ==/UserScript==

function insertAfter(el, referenceNode) {
  referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
}

// this bit checks whether someone is logged in or not. Logged out users will only see tag ids
// for those with RSS feeds, i.e. fandoms, characters, and relationships. Logged in users will
// also see those, plus additional tags, ratings, categories, and warnings.
var log_status = document.getElementsByTagName('body')[0].getAttribute('class');
var tag_id;
if (log_status.startsWith('logged-out')) {
  tag_id = document.getElementsByClassName('rss')[0].getAttribute('href').slice(6,-10);
} else {
  tag_id = document.getElementById('favorite_tag_tag_id').getAttribute('value');
}

// this bit is where the creation of the tag id element happens.
var tag_id_container = document.createElement('span');
tag_id_container.setAttribute('id', 'tag_id');
tag_id_container.innerHTML = "Include: <strong>filter_ids:" + tag_id + "</strong><br/>Exclude: <strong>-filter_ids:" + tag_id + "</strong>";
tag_id_container.style['vertical-align'] = '-0.3em';
tag_id_container.style['display'] = 'inline-block';
tag_id_container.style['margin-left'] = '0.5em';

insertAfter(tag_id_container, document.querySelector('h2.heading'));