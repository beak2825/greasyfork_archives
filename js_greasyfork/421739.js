// ==UserScript==
// @name      staywithme
// @namespace https://greasyfork.org/users/4785
// @lang      fr
// @description évite salement que les menus apparaissent en dehors de l'écran
// @author    nil
// @version   0.62
// @include   http://silvereburlot.com/partitions.html
// @include   http://wwww.silvereburlot.com/partitions.html
// @grant    none
// @downloadURL https://update.greasyfork.org/scripts/421739/staywithme.user.js
// @updateURL https://update.greasyfork.org/scripts/421739/staywithme.meta.js
// ==/UserScript==

(function launcher() {
  function myinit() {
    var divpart, div = document.getElementById("is-global-layer");
    if (!div) {
      console.log("slt: div 'is-global-layer' not found");
      return;
    }
    
    divpart = div.children.item(2);
    console.log(typeof divpart.textContent);
    //console.log();
    /*
    if ("LES PARTITIONS" != divpart.textContent.toUpperCase()) {
      console.log("slt: 'LES PARTITIONS' not found ? -> div#is-global-layer.children.item(2).textContent")
      div.children.item(2).id = "slt";
      console.log(divpart.textContent.length);
      return;
    }
    */
    //
    divpart.id = "slt";
    console.log(divpart.getAttribute("style"));
    var newstyle = divpart.getAttribute("style").replace(/width:\s*[0-9]*px;/, "width:230px;");
    console.log(newstyle);

    divpart.setAttribute("style", newstyle);
    console.log(divpart.getAttribute("style"));
    //divpart.style = divpart.style.replace(/width:\s*[0-9]+px;/, ""); 
  }
  
  window.addEventListener("DOMContentLoaded", myinit);  
})();