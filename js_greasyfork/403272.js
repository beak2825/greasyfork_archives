// ==UserScript==
// @name         Hyvee Sort Lowest Price
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.hy-vee.com/grocery/*
// @match        https://hyvee.com/grocery/*
// @match        https://www.hy-vee.com/aisles-online/lists/*
// @grant        noneaz
// @namespace https://greasyfork.org/users/170524
// @downloadURL https://update.greasyfork.org/scripts/403272/Hyvee%20Sort%20Lowest%20Price.user.js
// @updateURL https://update.greasyfork.org/scripts/403272/Hyvee%20Sort%20Lowest%20Price.meta.js
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
    doMagic();

    // Run after each ajax request
    function doMagic() {
        console.log( "doMagic" );
        var list;
        var container;
        var selector;

        var browseList = jQ("#ulProductList li.js-item");
        var galleryList = jQ("[class^=styles__CardContainer]");

        if(browseList.length) {
            list = browseList;
            container = jQ("#ulProductList");
            selector = 'p.price';
        }
        else if(galleryList.length) {
            list = galleryList;
            container = jQ("[class^=grid__GridContainer]");
            selector = 'p[class^=styles__Price]';
        }
        else {
            return;
        }

        var numericallyOrderedDivs = list.sort(function (a, b) {
            a = getPrice(a, selector);
            b = getPrice(b, selector);

            return a - b;
        });
        container.html("cleared");
        container.html(numericallyOrderedDivs);
    }

    function getPrice(el, selector) {
        var pr = jQ(el).find(selector).text();

        if(pr.split("/").length) {
            var res = pr.split("/").pop();
            if(!isNaN(getFloat(res))) pr = res;
        }

        return getFloat(pr);
    }

    function getFloat(st) {
        return parseFloat(st.replace(/[^0-9.]/g, '').replace(/\.{2,}/g, '.'));
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
            doMagic();
            setTimeout(function(){ doMagic(); }, 2000);

            //If you want to pass the Ajax request object, pass the 'pointer' below
            clearInterval(intervalId);

        }, 1);//I found a delay of 1 to be sufficient, modify it as you need.
        return proxied.apply(this, [].slice.call(arguments));
    };
}

// load jQuery and execute the main function
addJQuery(main);