// ==UserScript==
// @icon https://www.glassdoor.com/app/static/img/mobile/icons/touch-icon-57.png
// @name            Remove Glassdoor Paywall 2.0
// @name:pt-BR      Remover Paywall Glassdoor 2.0
// @description     Hide Glasdoor paywall belt from page navigation and reenable scroll.
// @description:pt-br Esconder a faixa de login e reabilitar o scroll da página.
// @version         2.0.1
// @namespace       http://www.greasyfork.org
// @author         	dmcadoo,peckjon,R4wwd0G
// @include        	http*://*glassdoor.*
// @downloadURL https://update.greasyfork.org/scripts/440159/Remove%20Glassdoor%20Paywall%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/440159/Remove%20Glassdoor%20Paywall%2020.meta.js
// ==/UserScript==


 
setInterval(function() {
    if(document.getElementById('ContentWallHardsell')) {
        document.getElementById('ContentWallHardsell').style.display='none'
    }
    
     document.getElementsByClassName('hardsellOverlay')[0].remove();
  document.getElementsByTagName("body")[0].style.overflow = "scroll";
  let style = document.createElement('style');
  style.innerHTML = `
    #LoginModal {
      display: none!important;
    }
  `;
  document.head.appendChild(style);
  window.addEventListener("scroll", function (event) {
    event.stopPropagation();
  }, true);
}, 3000)  
