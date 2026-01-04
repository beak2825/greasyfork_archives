// ==UserScript==
// @name         Lazyfoo Readable CSS
// @namespace    codesthings.com
// @license      MIT
// @version      1.1
// @description  Adds a readable CSS to Lazyfoo's tutorials.
// @author       JamesCodesThings
// @match        *://*.lazyfoo.net/tutorials/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/448219/Lazyfoo%20Readable%20CSS.user.js
// @updateURL https://update.greasyfork.org/scripts/448219/Lazyfoo%20Readable%20CSS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const readableCss = `body.readable {
  font-family: sans-serif;
  font-size: 1.2rem;
  background-color: #222;
  line-height: 1.25;
}

.readable br {
  content: " ";
  line-height:22px;
   display: block;
   margin: 3rem 0;
}

.readable div.content {
  position: relative;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
}

.readable h6 {
  font-family: monospace;
  font-size: 1.2rem;
  line-height: 1.0;
  margin: 3rem;
  font-weight: normal;
}

.readable div.tutPreface {
  background-color:#333;
  border-color: #333;
  padding: 1rem 2rem 3rem 2rem;
  margin-bottom: 0;

  position: relative;
  width: auto;
}

.readable div.tutPreface::after{
  content: ' ';
  position: absolute;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  height: 1px;
  background: white;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);

}

.readable div.tutText {
  background-color: #333;
  border-color: #333;
  padding: 3rem 2rem;
  width: auto;
  margin-left: 0;
  margin-right: 0;
  margin-bottom: 0;

}

.readable div.tutImg {
  margin: 3rem 0;
}

.readable a.nav, a.leftNav {
  color: #3AF;
  text-decoration: none;
}

.readable a.nav:hover, a.leftNav:hover {
  color: #58F;
}

.readable a.tutLink {
  color: #3AF;
  text-decoration: none;
}

.readable a.tutLink:hover {
  color: #58F;
}

.readable table.tutToC {
  width: auto;
  margin: 0 0;
  border-spacing: 0;
}

.readable td.ToCTitle {
  background-color: #333;
  border-top: 0;
  border-left: 0;
  border-right: 0;
}

.readable td.tutLink {
  background-color: #333;
  border: 0;
}


.readable div.tutCodeHeader {
  background: #333;
  border-left: 0;
  border-top: 0;
  border-right: 0;
  margin: 0;
  width: auto;
  padding: 1rem 2rem;
}

.readable div.tutCode {
  font-family: monospace;
  font-weight: lighter;
  line-height: 1.3;
  color: white;
  background: #2b2b2b;
  border: 0;
  margin: 0;
  width: auto;
  padding: 2rem;
}

.readable div.tutFooter {
  width: auto;
  margin: 0;
  padding: 2rem;
  background: #111;
  border: 0;
}

.readable div.tutFooter a::after{
  content: " >";
}

.readable div.tutFooter a.leftNav::after {
  content: '';
}

.readable div.tutFooter a.leftNav::before {
  content: '< ';
}`;

document.body.className += 'readable';
    GM_addStyle(readableCss);
})();