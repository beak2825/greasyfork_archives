// ==UserScript==
// @name         Unpkg link button for npm package
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add unpkg link button for npm package
// @author       @heineiuo
// @license      MIT
// @match        https://www.npmjs.com/package/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=npmjs.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440623/Unpkg%20link%20button%20for%20npm%20package.user.js
// @updateURL https://update.greasyfork.org/scripts/440623/Unpkg%20link%20button%20for%20npm%20package.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    function getName(){
        return document.querySelector('meta[property="og:title"]').content
    }

    function getLink(name){
        return `https://unpkg.com/${name}/`
    }

    function createElement(){
      const el = document.createElement('div')
      el.innerHTML= `<div data-nosnippet="true">
      <a href="${encodeURI(getLink(getName()))}" target="_blank">
      <img
      src="https://unpkg.com/favicon.ico"
      height="20px"
      title="This package can be explored on unpkg.com"
      alt="Unpkg icon, This package can be explored on unpkg.com"
      class="aa30d277 pl3"
      data-nosnippet="true"
      />
      </a>
      </div>`
      return el
    }

    function addButton(){
        const h2 = document.querySelector('#top h2')
        h2.appendChild(createElement())
    }

    window.addEventListener('load', addButton)

})();