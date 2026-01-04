// ==UserScript==
// @name        AO3: Display Tag ID
// @namespace   redrumdre
// @description based on quick and dirty script to display a canonical tag's tag id
// @grant       none
// @include     http://*archiveofourown.org/tags/*/
// @include     https://*archiveofourown.org/tags/*/
// @version 0.0.1.20240902185501
// @downloadURL https://update.greasyfork.org/scripts/506482/AO3%3A%20Display%20Tag%20ID.user.js
// @updateURL https://update.greasyfork.org/scripts/506482/AO3%3A%20Display%20Tag%20ID.meta.js
// ==/UserScript==

function insertAfter(el, referenceNode) {
  referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
}

// this bit checks whether someone is logged in or not. Logged out users will only see tag ids
// for those with RSS feeds, i.e. fandoms, characters, and relationships. Logged in users will
// also see those, plus additional tags, ratings, categories, and warnings.
var log_status = document.getElementsByTagName('body')[0].getAttribute('class');

if (log_status.startsWith('logged-out')) {
  var tag_id = document.getElementsByClassName('rss')[0].getAttribute('href').slice(6,-10);
} else
  var tag_id = document.getElementById('favorite_tag_tag_id').getAttribute('value');

// this bit is where the creation of the tag id element happens.
var tag_id_container = document.createElement('span');
tag_id_container.setAttribute('id', 'tag_id');
tag_id_container.innerHTML = "Include: <strong>filter_ids:" + tag_id + "</strong><br/>Exclude: <strong>-filter_ids:" + tag_id + "</strong>";
tag_id_container.style['vertical-align'] = '-0.3em';
tag_id_container.style['display'] = 'inline-block';
tag_id_container.style['margin-left'] = '0.5em';

insertAfter(tag_id_container, document.querySelector('h2.heading'));