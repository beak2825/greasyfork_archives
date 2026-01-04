// ==UserScript==
// @name         Hyvee Nutrition in List View
// @version      0.1
// @description  Simple. Get nutrition facts on the list page while browsing or searching hyvee products. 
// @author       You
// @match        https://www.hy-vee.com/grocery/*
// @match        https://hyvee.com/grocery/*
// @grant        noneaz
// @namespace https://greasyfork.org/users/170524
// @downloadURL https://update.greasyfork.org/scripts/403273/Hyvee%20Nutrition%20in%20List%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/403273/Hyvee%20Nutrition%20in%20List%20View.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}

// the guts of this userscript
function main() {
    setInterval(function(){ doMagic(); }, 2000);
    setTimeout(function(){ doMagic(); }, 2000);

    function doMagic() {
        jQ.each(jQ('#ulProductList .li-head a'), function( index, product ) {

            jQ.get( product , function( data ) {                
                if(!jQ(product).closest(".li-text").find(".nutro").length) {
                    jQ(product).closest(".li-text").append('<img src="'+jQ(jQ(data).find('.performance-facts img')[0]).attr('src')+'" class="nutro" style="float:left;padding:10px">');   
                }
            });
        }); 
    }
}



// load jQuery and execute the main function
addJQuery(main);