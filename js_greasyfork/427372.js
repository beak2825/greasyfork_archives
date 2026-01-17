// ==UserScript==
// @name         Add Letterboxd Search Button
// @namespace    https://www.criticker.com/
// @version      2.0
// @description  Adds a button to search the movie on Letterboxd
// @author       n00bCod3r
// @match        https://www.criticker.com/films*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427372/Add%20Letterboxd%20Search%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/427372/Add%20Letterboxd%20Search%20Button.meta.js
// ==/UserScript==

(function() {

  'use strict';
  function formatTitle(title) {
    title.trim();
    title = title.replaceAll('#','%23')
    title = title.replaceAll('+','%2B')
    title = title.replaceAll('&','%26')
    title = title.replaceAll('\'','%27')
    title = title.replaceAll('?', '%3F')
    title = title.replaceAll(' ', '+')
    return title;
  }

  //lbx logo
  const logoURL = 'https://a.ltrbxd.com/logos/letterboxd-decal-dots-pos-rgb-500px.png';
  const titlesList = document.querySelectorAll('div.fl_titlelist_title');

  titlesList.forEach(el => {
    const div = el.querySelector('.fl_name'); //cotnains <a> with movie info
    const title = formatTitle(div.querySelector('a').title);
    //console.log(title);

    //search link for the movie
    const lbxURL = `https://letterboxd.com/search/films/${title}/`;

    //<a> containing the lbx logo image
    const imgAnchor = document.createElement('a');
    imgAnchor.href = lbxURL;
    imgAnchor.target = "blank";
    imgAnchor.rel = "noopener noreferrer";

    //lbx logo image
    const img = document.createElement('img');
    img.src = logoURL;
    img.width = '20';
    imgAnchor.appendChild(img);

    //add image before div
    div.prepend(imgAnchor);
  })

})();