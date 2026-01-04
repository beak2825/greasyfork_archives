// ==UserScript==
// @name           Link OpenStreetMap changesets to achavi / Open on achavi
// @description    Turns every changeset into a link that leads to this useful OSM change inspector.
// @name:es        Enlazar los cambios de OpenStreetMap con achavi / Abrir en achavi
// @description:es Convierte cada página con cambios («changeset») en un enlace que se puede abrir con este práctico inspector/comparador de versiones para OSM.
// @namespace      greasyfork.org/users/4813-swyter
// @match          https://www.openstreetmap.org/user/*/history
// @match          https://www.openstreetmap.org/changeset/*
// @match          https://www.openstreetmap.org/history
// @grant          none
// @version        2021.11.11.1
// @author         Swyter
// @license        Unlicense
// @run-at         document-start
// @icon           https://upload.wikimedia.org/wikipedia/commons/b/b0/Openstreetmap_logo.svg
// @downloadURL https://update.greasyfork.org/scripts/399557/Link%20OpenStreetMap%20changesets%20to%20achavi%20%20Open%20on%20achavi.user.js
// @updateURL https://update.greasyfork.org/scripts/399557/Link%20OpenStreetMap%20changesets%20to%20achavi%20%20Open%20on%20achavi.meta.js
// ==/UserScript==

/* swy: create an observer instance (in the *history* page) linked to the callback function as shown here:
      https://www.freecodecamp.org/forum/t/how-can-i-detect-or-trigger-an-event-when-text-in-p-tag-is-changed/270692/4 */
mo = new MutationObserver(function(mutationsList, observer)
{
  for (var mutation of mutationsList)
    if (mutation.type == 'childList')
      console.log('[i] changesets frame refreshed, re-running the link-ifier: ', mutation);

  __relinkifier();
});

function __relinkifier()
{
  console.log('[i] relinkifier()', document.querySelectorAll('div.changesets > ol.changesets > li[id^=changeset_] div.col, div#sidebar_content h2'));
    
  /* swy: this is the meat of the function; we also add an 'ach' attribute to simplify our CSS rules */
  for (var elem of document.querySelectorAll('div.changesets > ol.changesets > li[id^=changeset_] div.col, div#sidebar_content h2'))
    elem.innerHTML = elem.innerHTML.replace(/(\d\d\d\d+)/g, `<a title='View revision $1 on achavi.' ach href=https://nrenner.github.io/achavi/?changeset=$1>$1</a>`);
  
  /* swy: and do the same thing in the *changeset* page, where as a title; in this case the element is static,
          so we don't need to wait for JS to grab it and it in there */
  mo.observe(document.querySelector('div#sidebar_content') || document.createElement('dummy'), { childList: true });
  mo.observe(document.querySelector('div.changesets')      || document.createElement('dummy'), { childList: true });
  mo.observe(document.querySelector('div#sidebar_loader')  || document.createElement('dummy'), { childList: true });
}

window.addEventListener('DOMContentLoaded', function()
{
  __relinkifier(); /* swy: this runs once, when the page is ready; it also sets up the observers */
});

/* --- */

/* swy: the guys at Greasemonkey are a bunch of incompetent folks, they break stuff all the time */
function GM_addStyle(text) { document.documentElement.appendChild(((thing = document.createElement('style')).textContent = text) && thing); }

GM_addStyle(`
  div#sidebar_content > h2 a[ach],
  div#sidebar_content > div.changesets .details a[ach]
  {
    color: #192d86 !important; /* swy: make the overriden links dark blue, so they aren't that bright */
  }
`);