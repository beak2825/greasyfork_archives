// ==UserScript==
// @name         Bootleggers Sell Cars Script
// @namespace    https://greasyfork.org/en
// @version      0.0.12
// @description  try to take over the world!
// @author       You
// @include      https://www.bootleggers.us/cars
// @require      https://code.jquery.com/jquery-3.2.1.js
// @update       https://greasyfork.org/scripts/375365-bootleggers-sell-cars-script/code/Bootleggers%20Sell%20Cars%20Script.user.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/375365/Bootleggers%20Sell%20Cars%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/375365/Bootleggers%20Sell%20Cars%20Script.meta.js
// ==/UserScript==

$(document).ready(function() {
    var child = document.createElement("li");
    child.innerText = "Sell All";
    $(child).on("click", RunScript);
    $(".actions")[0].insertBefore(child, $(".actions > li")[1]);

    var reloadTimer;
    var counter = 0;

    function RunScript() {
        if ($(".car:not(:has(.is-driving))").length > 0) {
            $(".car:not(:has(.is-driving))").each(function(i) {
                function Ship() {
                    /*$(".car:not(:has(.is-driving))")[0].click();
                    $("select")[0].options[2].selected = true;
                    $($("select")[0]).trigger("change");*/
                    $(".car:not(:has(.is-driving))")[0].click();
                }
                setTimeout(function() {
                    Ship();
                }, 1000);
            });
            //$(".car:not(:has(.is-driving))")[0].click();
        } else {
            alert("All Cars Sold!");
        }
    }
});