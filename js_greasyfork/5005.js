// ==UserScript==
// @name        HoM Calculator CSS Fix
// @version     0.0.1
// @description Rewrite Hall of Monuments stylesheet links for better browser compatibility.
// @include     https://hom.guildwars2.com/*
// @run-at      document-end
// @grant       none
// @namespace   https://greasyfork.org/users/5243
// @downloadURL https://update.greasyfork.org/scripts/5005/HoM%20Calculator%20CSS%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/5005/HoM%20Calculator%20CSS%20Fix.meta.js
// ==/UserScript==

document.head.innerHTML = document.head.innerHTML.replace(
  "<link rel=\"stylesheet\" href=\"https://static.staticwars.com/combo/_"+
                                                               "/yui/3.2.0/cssfonts/fonts-min.css&amp;"+
                                                               "/yui/3.2.0/cssreset/reset-min.css&amp;"+
                                                               "/yui/3.2.0/cssgrids/grids-min.css&amp;"+
                                                               "/yui/3.2.0/overlay/assets/skins/sam/overlay.css&amp;"+
                                                               "/yui/3.2.0/widget/assets/skins/sam/widget.css&amp;"+
                                                               "/yui/3.2.0/widget/assets/skins/sam/widget-stack-min.css\">",
  
  "<link rel=\"stylesheet\" href=\"https://static.staticwars.com/yui/3.2.0/cssfonts/fonts-min.css\">"+
  "<link rel=\"stylesheet\" href=\"https://static.staticwars.com/yui/3.2.0/cssreset/reset-min.css\">"+
  "<link rel=\"stylesheet\" href=\"https://static.staticwars.com/yui/3.2.0/cssgrids/grids-min.css\">"+
  "<link rel=\"stylesheet\" href=\"https://static.staticwars.com/yui/3.2.0/overlay/assets/skins/sam/overlay.css\">"+
  "<link rel=\"stylesheet\" href=\"https://static.staticwars.com/yui/3.2.0/widget/assets/skins/sam/widget.css\">"+
  "<link rel=\"stylesheet\" href=\"https://static.staticwars.com/yui/3.2.0/widget/assets/skins/sam/widget-stack-min.css\">");