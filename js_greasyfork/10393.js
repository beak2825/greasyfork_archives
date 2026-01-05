// ==UserScript==
// @name         Search Liste engine
// @version      0.2
// @description  SearchBox for Family
// @author       Gohan89
// @match        http://www.marchofhistory.com/*
// @grant        none
// ==/UserScript==
jQuery.expr[":"].Contains = function(obj,index,meta) {
    return jQuery(obj).text().toUpperCase().indexOf(meta[3].toUpperCase()) >= 0;
};
$(document).on("click", ".tabsMenu.ui-tabs-anchor", function(){
   $("div.searchbox").remove();
   $("div.listingStrategie_wrapper").prepend("<div class='searchbox'><input name='search'></div>");
});