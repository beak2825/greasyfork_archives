// ==UserScript==
// @name         Gym Tab Hider
// @namespace    https://greasyfork.org/users/191331
// @version      1.5
// @description  Hide unwanted gym stats
// @author       FATU
// @include      *://*torn.com/gym.php
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/369542/Gym%20Tab%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/369542/Gym%20Tab%20Hider.meta.js
// ==/UserScript==

$(window).on("load", function() {
    var checkboxes = [];

    var resetStyle = {
        "-webkit-appearance" : "none",
        "-moz-appearance" : "none",
        "appearance" : "none",
        "border" : "0",
        "cursor" : "pointer",
        "display" : "block",
        "margin-top" : "10px",
        "margin-left" : "auto",
        "padding" : "5px 10px",
        "background" : "linear-gradient(rgb(215, 215, 215) 0px,rgb(127, 127, 127) 80%, rgb(127, 127, 127) 90%, rgb(138, 138, 138))",
        "color" : "#333",
        "font-family" : "inherit",
        "font-size" : "14px",
        "font-weight" : "700",
        "text-transform" : "uppercase",
        "text-shadow" : "rgba(255, 255, 255, 0.4) 0px 1px 0px",
        "border-radius" : "5px"
    };

    $("#gymroot").find(".page-head-delimiter").first().after("<button id='reset'>Reset Tabs</button>");

    $("#reset").css(resetStyle);

    // Run through all tabs, append radio buttons to them & push selectors to array
    $("#gymroot").find("ul").find("li").each(function() {
        var tab = $(this);
        var tabType = tab.find("h3").text();

        // Render checkboxes for each tab
        tab.find("[class^=description]").append("<div class='disable'><input type='checkbox' " + "id='"+ tabType +"' name='" + tabType + "' /><label for='" + tabType + "'> Disable this tab?</label></div>");

        var disableStyle = {
            "margin-top" : "10px",
            "font-weight" : "bold"
        };

        $(".disable").css(disableStyle);

        // Push tab name & checkbox selector to array
        checkboxes.push({[tabType] : $("#" + tabType)});
    });

    // Disable the tab when button is checked
    $.each(checkboxes, function() {
        var tabName = Object.keys(this)[0];
        var tabCheckbox = Object.values(this)[0];
        var tabDisable = {"pointer-events" : "none", "opacity" : ".5"};

        tabCheckbox.on("change", function() {

            // Pointer events will likely cover this, but why not?
            if (tabCheckbox.prop("checked")) {
                localStorage.setItem(tabName, true);
                tabCheckbox.closest("li").css(tabDisable);
            }
        });

        // Check if tab has been disabled
        var checked = localStorage.getItem(tabName);

        // If it's already been checked, disable tab
        if (checked) {
            tabCheckbox.prop("checked", true).closest("li").css(tabDisable);
        }

        // When reset button is pressed, remove all mentions of tabs from localStorage
        // and then reload page
        $("#reset").on("click", function() {
            localStorage.removeItem(tabName);
            location.reload();
        });
    });
});