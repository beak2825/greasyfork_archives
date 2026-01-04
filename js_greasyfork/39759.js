// ==UserScript==
// @name         比思
// @namespace    http://tampermonkey.net/
// @version     1.0.2
// @description  比思论坛
// @author       Leo
// @match        *://198.24.151.114/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39759/%E6%AF%94%E6%80%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/39759/%E6%AF%94%E6%80%9D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var links = document.querySelectorAll( '.xst' );
    [].forEach.call(links, function(link) {
        link.setAttribute('target','_blank');
        link.removeAttribute('onclick');
    });
    var domains = document.querySelectorAll( "a" );
    if(domains.length > 0){
      [].forEach.call(domains, function(domain) {
        domain.setAttribute('href',domain.getAttribute('href').replace('hk-pic1.xyz','198.24.151.114'));
      });
    }
    var images = document.querySelectorAll( '[src="static/image/common/none.gif"]' );
    if( images.length > 0 ){
      [].forEach.call(images, function(image) {
        image.setAttribute('src',image.getAttribute('file'));
      });
    }
})();