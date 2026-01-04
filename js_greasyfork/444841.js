// ==UserScript==
// @name         Clickette Images Beta
// @description  Enables the testing version of Clickette Images.
// @version      v0.1
// @match        clickette.cf/*
// @grant        none
// @license      GNU
// @namespace https://greasyfork.org/users/913212
// @downloadURL https://update.greasyfork.org/scripts/444841/Clickette%20Images%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/444841/Clickette%20Images%20Beta.meta.js
// ==/UserScript==

enableBeta();
const myTimeout = setTimeout(test(), 3000);
function enableBeta() {
  document.getElementById("logo").src = "http://clickette.cf/assets/logo_images.png";
}
function test() {
const queryString = window.location.search;
console.log(queryString);
const urlParams = new URLSearchParams(queryString);
const query = urlParams.get('gsc.q')
    history.pushState({}, null, 'http://clickette.cf/search?gsc.q=' + query + '#gsc.tab=1&gsc.q=' + query);
      console.log('Images beta enabled');
    document.title = 'Clickette Images - The Webs Images, Uncensored'
}