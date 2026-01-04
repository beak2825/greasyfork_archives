// ==UserScript==
// @name         GGn Inventory Trimming
// @namespace    -
// @version      1.01
// @description  Trimming inventory to prevent browser lag
// @author       Someone
// @match        https://gazellegames.net/user.php?action=crafting
// @include      https://gazellegames.net/user.php?action=trade*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383999/GGn%20Inventory%20Trimming.user.js
// @updateURL https://update.greasyfork.org/scripts/383999/GGn%20Inventory%20Trimming.meta.js
// ==/UserScript==

(function() {
    $("#header").append("<div id='trim_info' style='position:fixed;top:0;left:0;color:white;background-color:black;padding:5px 10px;z-index:99'><div id='trim_answer'><span>Trim Inventory ? </span><a href='#' id='trim_answer_yes'>Yes</a> <a href='#'  id='trim_answer_no'>No</a></div></div>");
    $("#trim_answer_no").click(function() {$("#trim_answer").remove();})
    $("#trim_answer_yes").click(function() {
        $("#trim_answer").remove();
        $("#trim_info").append("<span>Trimming... </span>");
        setTimeout(function() {
            var itemlimit = 100;
            var element = document.getElementById('items-wrapper');
            if (typeof(element) == 'undefined' || element == null) {element = document.getElementById("main-items-wrapper")}
            var elem = element.getElementsByClassName("item");
            var itemcounter = [];
            for (var i=0; i<elem.length; i++) {
                var itemcode = elem[i].getAttribute("data-item");
                //console.log(itemcode);
                itemcounter[itemcode] = ( typeof itemcounter[itemcode] != 'undefined' && itemcounter[itemcode] instanceof Array ) ? itemcounter[itemcode] : [];
                if (itemcounter[itemcode].length >= itemlimit) {
                    elem[i].parentNode.removeChild(elem[i]);
                    i--;
                } else {
                    itemcounter[itemcode].push("");
                }
            }
            $("#trim_info").append("<span>Done!</span>");
        }, 100);
    })
})();