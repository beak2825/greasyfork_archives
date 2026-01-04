// ==UserScript==
// @name     IGN to OpenDatarchives
// @include     https://geoservices.ign.fr/*
// @version  1
// @description IGN FTP URLs to OpenDatarchives https URLs
// @grant    none
// @namespace https://greasyfork.org/users/825193
// @downloadURL https://update.greasyfork.org/scripts/433891/IGN%20to%20OpenDatarchives.user.js
// @updateURL https://update.greasyfork.org/scripts/433891/IGN%20to%20OpenDatarchives.meta.js
// ==/UserScript==

async function main() {
const cache = {};
const iris_url = 'https://geoservices.ign.fr/irisge';
  if (window.location.href == iris_url) {
    if (!(iris_url in cache)) {
      await fetch('https://labs.webgeodatavore.com/partage/experiment-mapping-ign/mapping_iris_ge.json').then(r => r.json()).then(json => {
        cache[iris_url] = json;
      })
    }
    console.log(cache[iris_url]);
    [...document.querySelectorAll('a')].forEach(el => {
      if (el.href in cache[iris_url]) {
        el.href = cache[iris_url][el.href];
      }
    })
  }
}

main();