// ==UserScript==
// @name         Reddit preview image to full size
// @version      1.1.0
// @description  Redirects preview images on Reddit to their full size counterparts, i.e., from `https://preview.redd.it/<id>.jpg` to `https://i.redd.it/<id>.jpg`
// @author       u/CaptainUnemployment
// @match        https://preview.redd.it/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @namespace https://greasyfork.org/users/846945
// @downloadURL https://update.greasyfork.org/scripts/467659/Reddit%20preview%20image%20to%20full%20size.user.js
// @updateURL https://update.greasyfork.org/scripts/467659/Reddit%20preview%20image%20to%20full%20size.meta.js
// ==/UserScript==

(function () {
  location.replace(
    "https://i.redd.it/" + location.pathname.split("-").at(-1).replace("/", "")
  );
})();
