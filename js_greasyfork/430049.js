// ==UserScript==
// @name         Allow Sidebar Hide Google Drive
// @namespace    http://tampermonkey.net/
// @version      0.2
// @license      MIT
// @description  Google Drive Folder/File List wide, create button to hide google drive left side bar so there're more estate for showing file name
// @author       Benyamin Limanto <me@benyamin.xyz>
// @match        https://drive.google.com/drive/*
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430049/Allow%20Sidebar%20Hide%20Google%20Drive.user.js
// @updateURL https://update.greasyfork.org/scripts/430049/Allow%20Sidebar%20Hide%20Google%20Drive.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var defaultCollapsed = true;

    var status = true; var newStyle = document.createElement("style");
    var btnCollapse = document.createElement("button");
    btnCollapse.innerText = "<"; btnCollapse.style.marginLeft = "210px";
    btnCollapse.style.padding = "4px"; btnCollapse.style.fontWeight = "bolder"; btnCollapse.style.cursor = "pointer";
    btnCollapse.style.background = "#fff"; btnCollapse.style.borderRadius = "4px"; btnCollapse.style.border = "#0011008c solid 1px";
    btnCollapse.style.top = "13px";
    btnCollapse.onclick = function() {
      if(status) {
          newStyle.innerText = ".ALpC8b,.a-ec-Gd.a-ec-Gd-Cs-mp-S { display: block !important; } .ZHllM {position: relative;}";
          status = false;
          btnCollapse.innerText = "<";
          btnCollapse.style.position = "absolute";
          btnCollapse.style.marginLeft = "210px";
      } else {
          newStyle.innerText = ".ALpC8b,.a-ec-Gd.a-ec-Gd-Cs-mp-S { display: none !important; }";
          status = true;
          btnCollapse.innerText = ">";
          btnCollapse.style.position = "inherit";
          btnCollapse.style.marginLeft = 0;
      }
    };

    var newButton = document.querySelector(".a-ec-Gd-Cs-mp-S");
    newButton.after(btnCollapse);
    // Set Style and Append
    newStyle.id = "new-style";
    newStyle.innerText = ".a-hrN2W-S-kl-Gd > .a-s-tb-kl-Gd-ig, .a-D-B-Lc-j { min-width: 0px !important; } .ZHllM {position: relative;}";
    console.log(newStyle.innerText);
    document.body.appendChild(newStyle);

    if (defaultCollapsed) {
        status = false;
        btnCollapse.click();
    }
})();