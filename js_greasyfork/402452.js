// ==UserScript==
// @name         Toggle Dlsite language
// @namespace    zero.toogledlsitelan
// @license      MIT
// @description  Switch between english and japanese language in DLsite
// @include      *://www.dlsite.com/*
// @version      1.5.3
// @grant        none
// @project page https://greasyfork.org/en/scripts/402452-toggle-dlsite-language
// @downloadURL https://update.greasyfork.org/scripts/402452/Toggle%20Dlsite%20language.user.js
// @updateURL https://update.greasyfork.org/scripts/402452/Toggle%20Dlsite%20language.meta.js
// ==/UserScript==

(function () {
  $( document ).ready(function() {
    var url = window.location.href;
    var cookies = document.cookie.split(';');
    var locale = '';

    // Get locale from cookies
    cookies.forEach(element => {
      if (/locale=..-../.test(element))
        locale = element.substring(element.indexOf('=') + 1);
    });

    // If locale isn't found finish script and give error
    if (locale === '') {
      console.log("DLsite Toogle couldn't find locale cookie, stopping script");
      return;
    }

    // Add toggle button
    var navlink = document.getElementsByClassName('floorNavLink');

    // Window loads two times, stop script on second time
    if(typeof(navlink[0]) === 'undefined') return;

    // Create button node and append it
    let navDiv = document.createElement('div');
    let navA = document.createElement('a');

    navDiv.appendChild(navA);

    navDiv.className = 'floorNavLink-item type-general';
    navDiv.style.width = '125px';
    navA.style.fontWeight = 'bold';

    navlink[0].prepend(navDiv);

    // Set proper text and link to button
    if (url.includes('?locale=')) {
      if (url.includes('ja_JP')) {
        navA.textContent = 'Toggle Site (EN)';
        navA.href = url.replace('ja_JP', 'en_US');
      } else {
        navA.textContent = 'Toggle Site (JP)';
        navA.href = url.replace('en_US', 'ja_JP');
      }
    } else {
      // No locale on url, get from cookies
      
      // Remove version_up at the end of url if it's there
      if(url.includes('#version_up')) url = url.replace('#version_up', '');
        
      if (locale === 'ja-jp') {
        navA.textContent = 'Toggle Site (EN)';
        if(/\/$/.test(url)) navA.href = url + '?locale=en_US'; // Check if url ends with '/'
        else navA.href = url + '/?locale=en_US';
      } else {
        navA.textContent = 'Toggle Site (JP)';
        if(/\/$/.test(url)) navA.href = url + '?locale=ja_JP'; // Check if url ends with '/'
        else navA.href = url + '/?locale=ja_JP';
      }
    }
  });
})();