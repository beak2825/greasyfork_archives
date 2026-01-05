// ==UserScript==
// @name         Uniquploader beta
// @namespace    I just can't think of a decent name, feel free to message me better ones.
// @version      0.7.2
// @description  Some simple but hopefully usefull improvements to the uploading process of Steam.
// @author       uniQ
// @match        *://steamcommunity.com/sharedfiles/edititem/*/3/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27761/Uniquploader%20beta.user.js
// @updateURL https://update.greasyfork.org/scripts/27761/Uniquploader%20beta.meta.js
// ==/UserScript==

(function() {
    'use strict';

        var twoButtonExits = document.getElementsByClassName("btn_blue_white_innerfade btn_medium")[1]; //unnesessary, but easier to understand

    document.getElementsByClassName("btn_blue_white_innerfade btn_medium")[0].style.display = "none";
    if (twoButtonExits) {
        document.getElementsByClassName("btn_blue_white_innerfade btn_medium")[1].style.display = "none";
        document.getElementsByClassName("page_control_or")[0].style.display = "none";
    }

    //... and simulating a click when the previous check returns true
    document.getElementsByClassName("btn_blue_white_innerfade btn_medium")[0].outerHTML += "<a href=\"#\" id=\"NewSubmit\" class=\"btn_blue_white_innerfade btn_medium\"><span>Upload Image</span></a>";
    document.getElementById("NewSubmit").onclick = function () {
        if (document.getElementById("check_heightFix").checked) {
            document.getElementById("image_width").value = 1;
            document.getElementById("image_height").value = 1000;
        }
        if (document.getElementById("check_newAppID").checked) {
            document.getElementsByName("consumer_app_id")[0].value = document.getElementById("input_appID_selection").value;
        }
        if (twoButtonExits) {
            document.getElementsByClassName("btn_blue_white_innerfade btn_medium")[2].click();
        } else {
            document.getElementsByClassName("btn_blue_white_innerfade btn_medium")[0].click();
        }
    };

    
    //document.getElementsByName// delete the missplaced <input> for the consumer_app_id
    var type_selection_HTML = "<div class=\"detailBox collection\" id=\"div_file_type_selection\"><div class=\"createCollectionArrow\"></div>\r\n" +
        "<div class=\"title\">Select the file type</div>\r\n" +
        "<input type=\"radio\" id=\"radioArt\" name=\"radio_file_type\" checked /> Artwork<br />\r\n" +
        "<input type=\"radio\" id=\"radioScreen\" name=\"radio_file_type\" /> Screenshot<br />\r\n";

    // Infinite height
    type_selection_HTML += "</div>\r\n" +
        "<div class=\"detailBox collection\" id=\"div_features\"><div class=\"createCollectionArrow\"></div>\r\n" +
        "<div class=\"title\">Some features</div>\r\n" +
        "<input type=\"checkbox\" id=\"check_heightFix\">\r\n" +
        "<div class=\"visiblityOptionsDesc\">Infinite Height</div>\r\n" +
        "<br />\r\n" +
        "<input type=\"checkbox\" id=\"check_newAppID\">\r\n" +
        "<div class=\"visiblityOptionsDesc\">Change the AppID</div>\r\n" +
        "</div>\r\n" +

        // gameselection hidden at first
        "<div class=\"detailBox collection\" id=\"div_appID_selection\" style=\"display: none;\"><div class=\"createCollectionArrow\"></div>\r\n" +
        "<div class=\"title\">Enter the new AppID</div>\r\n" +
        "e.g. 753 for \"Steam\", or 760 for \"Steam Screenshots\"" +
        "<br />" +
        "<br />" +
        "<input type=\"text\" class=\"titleField\" id=\"input_appID_selection\" name=\"\" maxlength=\"6\" value=\"" + document.getElementById("ConsumerAppID").value + "\">\r\n" +
        "<div class=\"visiblityOptionsDesc\"></div>\r\n" +
        "</div>\r\n";
        

    document.getElementsByClassName("detailBox collection")[3].outerHTML = type_selection_HTML + document.getElementsByClassName("detailBox collection")[3].outerHTML;

    // add onclick events
    document.getElementById("radioArt").onclick = function () { document.getElementsByName("file_type")[0].value = 3; };
    document.getElementById("radioScreen").onclick = function () { document.getElementsByName("file_type")[0].value = 5; };
    document.getElementById("check_newAppID").onclick = function () {
        if (document.getElementById("check_newAppID").checked) {
            document.getElementById("div_appID_selection").style.display = "";
        } else {
            document.getElementById("div_appID_selection").style.display = "none";
        }
    };
            // why not take a break from looking through this code?
            // you can enjoy Yuri instead MBHKH-four9sixTN-TQzeroJC
            // feel free to message me on Steam :^)

})();