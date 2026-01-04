// ==UserScript==
// @name        Lemmy UX Improvements
// @namespace   lemmy-ux-improvements
// @match       https://lemmy.world/*
// @match       https://lemmy.ml/*
// @grant       none
// @version     1.0
// @license     MIT
// @author      https://lemmy.world/u/lawrence
// @description This script does two things: 1)Thumbnail links open in new tab. 2)If the user is a mod of some communities, the communities links appear below the profile link in the top-right menu.
// @downloadURL https://update.greasyfork.org/scripts/473760/Lemmy%20UX%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/473760/Lemmy%20UX%20Improvements.meta.js
// ==/UserScript==

// Source code: https://github.com/lawrence-lemmy/lemmy-ux-improvements

window.onload = function () {
  setTimeout(function () {

    // Thumbnail external links open in new tab
    const thumbnails = document.querySelectorAll('a.thumbnail, a.text-body');
    thumbnails.forEach(function (e) {
      e.setAttribute('target', '_blank');
    });

    // Communities that the user moderates appear inside the top-right menu
    if (
      window.isoData &&
      window.isoData.site_res &&
      window.isoData.site_res.my_user &&
      window.isoData.site_res.my_user.moderates
    ) {
      const moderates = window.isoData.site_res.my_user.moderates;
      moderates.forEach(function (e) {
        const profile_element = document.querySelector('ul.dropdown-menu > li');
        if (!profile_element) return;
        const new_item = profile_element.cloneNode(true);
        const link = new_item.querySelector('a');
        if (!link) return;
        link.setAttribute('title', e.community.name);
        link.setAttribute('href', '/c/' + e.community.name);
        link.innerText = e.community.name;
        profile_element.insertAdjacentElement('afterend', new_item);
      });
    }
  }, 1000); // Delay execution for 1 second after loading all assets
}
