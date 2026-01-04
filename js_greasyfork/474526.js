// ==UserScript==
// @name         blu-ray.com cover download
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Download cover images from blu-ray.com
// @author       Martin Larsen AKA Greasyshark
// @match        https://www.blu-ray.com/*
// @grant        GM_download

// @downloadURL https://update.greasyfork.org/scripts/474526/blu-raycom%20cover%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/474526/blu-raycom%20cover%20download.meta.js
// ==/UserScript==

/* globals $ */

(function() {
  'use strict';

   $("div[id$=trigger]:first").parent().prepend("<div><a href='#''>Download all</a></div>")
     .click(function(){
       const [na, media, title, id] = document.location.href.match(/https:\/\/.*\/(.*?)\/(.*)\/(\d+)/);
       let prefix = "";
       switch(media) {
           case "dvd": prefix = "dvd"; break;
           case "digital": prefix = "uv"; break;
       }
       $("a[id$=overlay]").each((i,el) => {
          const type = el.id.replace(/large|image_overlay/g,"");
          const src = `https://images.static-bluray.com/movies/${prefix}covers/${id}_${type}.jpg`;
          const arg = { url: src, name: `${title}_${type}.jpg` };
          GM_download(arg);
       })
     });
})();