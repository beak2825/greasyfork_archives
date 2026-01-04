
// ==UserScript==
// @name         Walmart Cart Review
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Allows you to see the entire Walmart Grocery cart all at once and sorts from prices from high to low when you add ?sort to the url
// @author       timsayshey
// @match        https://walmart.com/*
// @match        https://www.walmart.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419940/Walmart%20Cart%20Review.user.js
// @updateURL https://update.greasyfork.org/scripts/419940/Walmart%20Cart%20Review.meta.js
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

window.totalRuns = 0;

// the guts of this userscript
function main() {
    jQ("ytd-rich-item-renderer").css("visibility","hidden");

    window.timer = setInterval(go, 500);

    window.onpopstate = function (event) {
        go()
    }

    function go() {
        var divList = jQ("div[class^='CartItem__itemContainer___']");
        if(divList.length) {
            var searchParams = new URLSearchParams(window.location.search);
            if(searchParams.has('sort')) {
                divList.sort(function(a, b){
                    var aa = parseFloat(jQ(a).find("span[class^='Price__priceUnit___']").text().replace(/[^0-9,.]+/g,''));
                    var bb = parseFloat(jQ(b).find("span[class^='Price__priceUnit___']").text().replace(/[^0-9,.]+/g,''));
                    return bb - aa;
                });
                jQ("div[class^='Cart__items___']").html(divList);
            }
            jQ("div[class^='styles__mainContent___'] section,div[class^='styles__mainContent___'] header").remove();
            jQ("div[class^='Cart__items___']").attr("style",`
               width: 100%;
               position: fixed;
               z-index: 9999999999999999;
               left: 0;
               right: 0;
               top: 0;
               bottom: 0;
               background: white;
            `);
        }
    }

    // Detect content changes
    var proxied = window.XMLHttpRequest.prototype.send;
    window.XMLHttpRequest.prototype.send = function() {

        //Here is where you can add any code to process the request.
        //If you want to pass the Ajax request object, pass the 'pointer' below
        var pointer = this
        var intervalId = window.setInterval(function(){
            if(pointer.readyState != 4){
                return;
            }

            //Here is where you can add any code to process the response.
            go();
            setTimeout(function(){ go(); }, 2000);

            //If you want to pass the Ajax request object, pass the 'pointer' below
            clearInterval(intervalId);

        }, 1);//I found a delay of 1 to be sufficient, modify it as you need.
        return proxied.apply(this, [].slice.call(arguments));
    };
}


// load jQuery and execute the main function
addJQuery(main);