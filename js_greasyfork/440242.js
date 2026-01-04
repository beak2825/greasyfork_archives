// ==UserScript==
// @name         Julia-Pluto-Code-Cell-Show
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  show pluto cell  with ctrl+b,command+b is also fine
// @author       m4mads
// @match        http://localhost:1234/*
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/440242/Julia-Pluto-Code-Cell-Show.user.js
// @updateURL https://update.greasyfork.org/scripts/440242/Julia-Pluto-Code-Cell-Show.meta.js
// ==/UserScript==

(function () {
  "use strict";
  let show_all_btn = () => {
      let show=true;
      let note = document.getElementsByTagName("pluto-notebook");
      if(note== undefined)return;
      document.addEventListener("keydown", function(event) {

          if (event.ctrlKey||event.metaKey && event.key === "b") {
             
              let eles = document.getElementsByTagName("pluto-cell");
              
              if (show) {
                  show_code(eles);
                  show = !show;
                  
              } else {
                  hide_code(eles);
                 
                  show = !show;
              }

          }
      });
};

  let show_code = (eles) => {
    for (let i = 0; i < eles.length; i++) {
      if (eles[i].classList.contains("code_folded")) {
        eles[i].classList.remove("code_folded");
        eles[i].classList.add("show_input");
      }
    }


  };

  let hide_code = (eles) => {
    for (let i = 0; i < eles.length; i++) {
      if (eles[i].classList.contains("show_input")) {
        eles[i].classList.remove("show_input");
        eles[i].classList.add("code_folded");
      }
    }
  };
  show_all_btn()
})();