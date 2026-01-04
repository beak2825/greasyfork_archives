// ==UserScript==
// @name        booru.io full height images
// @namespace   abdrool
// @match       https://booru.io/*
// @grant       GM_addStyle
// @version     1.1
// @author      abdrool
// @description Use your full viewport to view images on booru.io. The navbar only displays on hover, while the bottom elements are pushed down the page a bit.
// @require     http://code.jquery.com/jquery-latest.js
// @require     https://cdn.jsdelivr.net/npm/jquery.initialize@1.3.0/jquery.initialize.min.js
// @downloadURL https://update.greasyfork.org/scripts/428110/booruio%20full%20height%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/428110/booruio%20full%20height%20images.meta.js
// ==/UserScript==


let customCss = `
#navbar {
  transform: translateY(-100%);
  transition: transform .5s cubic-bezier(.4,0,.2,1) .5s;
}

#navbar-wrapper:hover #navbar {
  transform: translateY(0%);
  transition-delay: 0s;
}

#navbar-wrapper {
  position: absolute;
  top: 0%;
  width: 100%;
}

.card, body {
  margin-top: 0px !important;
}
`
GM_addStyle(customCss);

function updateCardSize() {
  let card = $(".card");
  let img = $(".card img")
  let aspect = img.width() / img.height();
  
  let new_height = $(window).height();
  let new_width = aspect * new_height;
  if (new_width > $(window).width()) {
    new_width = $(window).width();
    new_height = new_width / aspect;
  }
  
  let sheet = document.styleSheets[0];
  let rules = sheet.cssRules || sheet.rules;
  if (rules[0].selectorText == ".card") {
    sheet.deleteRule(0);
  }
  if (window.location.pathname.startsWith("/p/")){
    console.log("updating card " + new_width + "x" + new_height);
    sheet.insertRule(".card{width: " + new_width + "px !important; height: " + new_height + "px !important}", 0);
  }
}


$(document).ready(function() {
  let navbar = $("#app-root > :first-child > :first-child");
  navbar.attr("id", "navbar");
  navbar.wrap("<div id='navbar-wrapper'></div>");
  let wrapper = $("#navbar-wrapper");
  wrapper.height(navbar.height());
    
  $.initialize(".card img", function(){
    updateCardSize();
    const o = new MutationObserver(updateCardSize);
    o.observe(document.querySelector(".card"), { attributes: true, attributeFilter: ["style"] });
  });
  
});