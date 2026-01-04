// ==UserScript==
// @name         Ebay-Kleinanzeigen Enlarged search results image on hover
// @name:de      Ebay-Kleinanzeigen Bildervorschau in den Suchergebnissen per mouse over
// @description  Adds a hoverfunction to the search results list that enlarges the main Item image
// @description:de Ebay-Kleinanzeigen Bildervorschau in den Suchergebnissen 
// @version      0.12
// @grant        none
// @icon         http://www.google.com/s2/favicons?domain=www.ebay-kleinanzeigen.de
// @license      MIT
// @include      https://www.ebay-kleinanzeigen.de/*

// @namespace https://greasyfork.org/users/740728
// @downloadURL https://update.greasyfork.org/scripts/422241/Ebay-Kleinanzeigen%20Enlarged%20search%20results%20image%20on%20hover.user.js
// @updateURL https://update.greasyfork.org/scripts/422241/Ebay-Kleinanzeigen%20Enlarged%20search%20results%20image%20on%20hover.meta.js
// ==/UserScript==

(function () {

  function addGlobalStyle(css) {
      var head, style;
      head = document.getElementsByTagName('head')[0];
      if (!head) { return; }
      style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = css;
      head.appendChild(style);
  }  

  addGlobalStyle('.srpimagebox:hover + .preview { display:block; ! important; }');
  addGlobalStyle('.preview{display:none;height:400px;position:absolute;left:120px;top:0px;z-index:999;}');
    
var elements = document.querySelectorAll('.srpimagebox:not(.is-nopic)');
  elements.forEach(function(element, index) {
      item_img_url = element.getAttribute("data-imgsrcretina");
      item_img = item_img_url.substring(0,item_img_url.length-9) + "59.JPG";
      var img = document.createElement("img");
      img.setAttribute('src', item_img);
      img.setAttribute('class', "preview");
      var el = element.insertAdjacentElement("afterend",img);
  });  
  

})();