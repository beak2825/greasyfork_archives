// ==UserScript==
// @name         SO-ify
// @namespace    http://tampermonkey.net/
// @version      2.5.0
// @description  Style SE sites like SO
// @author       amflare
// @include      https://*stackexchange.com
// @include      https://*stackexchange.com/*
// @exclude      https://chat.stackexchange.com/*
// @exclude      https://area51.stackexchange.com/*
// @exclude      https://data.stackexchange.com/*
// @exclude      https://stackexchange.com/
// @exclude      https://stackexchange.com/leagues/*
// @exclude      https://stackexchange.com/questions?tab=*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/34034/SO-ify.user.js
// @updateURL https://update.greasyfork.org/scripts/34034/SO-ify.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const oldCss = ['https://cdn.sstatic.net/Sites/stackoverflow/primary.css','https://cdn.sstatic.net/Sites/stackoverflow/secondary.css'];
  const unifiedCss = ['https://cdn.sstatic.net/Sites/stackoverflow/primary.css'];
  const head = document.head || document.getElementsByTagName('head')[0];
  const regex = /\/(?!Shared)Sites\/(?!stackoverflow).*\.css/;

 // Alter various link tags
  var checkStyles = setInterval(function() {
    let sheets = document.getElementsByTagName("link");
    for (var i = 0; i <= sheets.length - 1; i++) {
      switch (true) {
        case (sheets[i].rel == 'shortcut icon'):
          sheets[i].href = 'https://cdn.sstatic.net/Sites/stackoverflow/img/favicon.ico';
        break;
        case (sheets[i].rel === 'stylesheet' && regex.test(sheets[i].href)):
          sheets[i].remove();
          clearInterval(checkStyles);
        break;
      }
    }
  }, 100);

  var addsheet = function(sheet) {
    let link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = sheet;
    return head.appendChild(link);
  }

  // Add SO Style Sheet
  let primary = addsheet(oldCss[0]);
  // Add secondary stylesheet
  let secondary = addsheet(oldCss[1]);

  // Remove Site Logo From Top Bar
  var checkLogo = setInterval(function() {
    let logo = document.querySelector('.-logo svg');
    if (logo !== null) {
      logo.remove();
      clearInterval(checkLogo);
    }
    let newlogo = document.querySelector('.site-header');
    if (newlogo !== null) {
      newlogo.remove();
      clearInterval(checkLogo);
    }
  }, 100);

  // Change Site Name in Browser Tab
  if (window.location.pathname == '/') {
    document.title = 'Stack Overflow - Where Developers Learn, Share, & Build Careers';
  } else {
    const title = document.title.split(" - ");
    if (title.length > 2) {
      document.title = title[0] +' - '+ title[1] +' - Stack Overflow';
    } else {
      document.title = title[0] + ' - Stack Overflow';
    }
  }

  // Change Site Name In Search Placeholder
  var checkSearch = setInterval(function() {
    let search = document.forms[0].elements.q;
    if (search !== null) {
      search.placeholder = 'Search on Stack Overflow...';
      clearInterval(checkSearch);
    }
  }, 100);

  // Fix font issue
  var addCss = setInterval(function() {
    let body = document.getElementsByTagName("body")[0];
    if (typeof body != "undefined") {
      body.style.fontFamily = 'Arial,"Helvetica Neue",Helvetica,sans-serif';
      body.style.fontSize = '13px';
      body.style.lineHeight = '1.26666667';
      body.style.color = '#242729';
      clearInterval(addCss);
    }
  }, 100);

  // Re-add css files to cache bust
  setTimeout(function(){
    addsheet(oldCss[0]);
    addsheet(oldCss[1]);
    // remove originals because we can
    primary.remove();
    secondary.remove();
  }, 20);
})();