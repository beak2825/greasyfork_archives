// ==UserScript==
// @name         City Find Hax TEST
// @namespace    City Find Hax
// @version      0.9
// @description  Updated City Find Hax
// @author       AquaRegia
// @match        *.torn.com/city.php*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24439/City%20Find%20Hax%20TEST.user.js
// @updateURL https://update.greasyfork.org/scripts/24439/City%20Find%20Hax%20TEST.meta.js
// ==/UserScript==

function checkForItems(){
    jQuery.get(document.location.protocol + "//www.torn.com/city.php?step=mapData&dataType=json", function(json)
    {
        var data = JSON.parse(atob(JSON.parse(json).territoryUserItems));
        console.log(data);


        jQuery("h4").after
        (
            jQuery("<div></div>").html
            (
                "Number of items currently in the city: " + data.length + 
                "<br/>" + 
                "Latest item spawned: " + (data.length > 0 ? data[data.length-1].title : "Nothing, not even a shitty kitten plushie :(") +
                (data.length > 1 ? (
                    "<br/>" + 
                    "Spawn rate (all time): " + function(a, b)
                    {
                        return ((a - b)/(data.length - 1)/3600).toFixed(1) + " hours per spawn";

                    }(parseInt(data[data.length-1].ts, 36), parseInt(data[0].ts, 36)) + 
                    "<br/>" + 
                    "Spawn rate (last " + Math.min(5, data.length) + "): " + function(a, b)
                    {
                        return ((a - b)/(Math.min(5, data.length) - 1)/3600).toFixed(1) + " hours per spawn";
                    }(parseInt(data[data.length-1].ts, 36), parseInt(data[data.length-(Math.min(5, data.length))].ts, 36))) : "")
            ).css("clear", "left")
            .css("margin-bottom", "-20px")
        );
    });
}

checkForItems();