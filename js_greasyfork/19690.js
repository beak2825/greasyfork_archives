// ==UserScript==
// @name         TC City Finds
// @namespace    TC City Finds
// @version      1.2
// @description  Torn City Finds Helper, displays total items & item names
// @author       AAW
// @match        http://www.torn.com/city.php*
// @match        https://www.torn.com/city.php*
// @match        http://torn.com/city.php*
// @match        https://torn.com/city.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19690/TC%20City%20Finds.user.js
// @updateURL https://update.greasyfork.org/scripts/19690/TC%20City%20Finds.meta.js
// ==/UserScript==
jQuery(window).load(function()
{
    jQuery.get(document.location.protocol + "//www.torn.com/city.php?step=mapData&dataType=json", function(json)
    {
        var data = JSON.parse(atob(JSON.parse(json).territoryUserItems));
        console.log(data);


        jQuery("h4").after
        (
            jQuery("<div></div>").html
            (
                "<div class='info-msg-cont gray border-round m-top10'><div class='info-msg border-round'><i class='info-icon'></i><div class='delimiter'><div class='msg right-round'>There are <strong>" + data.length + 
                "</strong> items around the city: " + 
                "<strong><a href='https://www.torn.com/imarket.php#/p=shop&step=shop&type=&searchname=" + data[data.length-1].title + "'>" + (data.length > 0 ? data[data.length-1].title : "N/A") +
                (data.length > 1 ? (
                    "</a></strong></div></div></div></div>" + 
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
});