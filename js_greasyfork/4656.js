// ==UserScript==
// @name       Image Window Fitter
// @namespace  http://use.i.E.your.homepage/
// @version    0.1
// @description  When looking at a large image file that extends beyond the borders of the screen, this will fit it onto your screen
// @match      http*://*/*.jpg
// @match      http*://*/*.jpeg
// @match      http*://*/*.png
// @match      http*://*/*.gif
// @match      http*://*/*.tif
// @match      http*://*/*.tiff
// @match      http*://*/*.bmp
// @author 	   wpatter6
// @copyright  2014+, wpatter6
// @downloadURL https://update.greasyfork.org/scripts/4656/Image%20Window%20Fitter.user.js
// @updateURL https://update.greasyfork.org/scripts/4656/Image%20Window%20Fitter.meta.js
// ==/UserScript==

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

function main() {    
	jQ('img').each(function (){
        if(jQ(this).width() > Math.min(jQ(this).parent().width(), jQ(window).width())){
            console.log("Resizing image " + (jQ(this).attr("id") || ""));
            jQ(this).css({"width":"100%"});
        }
    });
}

addJQuery(main);