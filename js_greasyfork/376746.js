// ==UserScript==
// @name         Theme Changer
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Change Service Autopilot's Theme Color
// @author       Tyler
// @match        https://my.serviceautopilot.com/*
// @resource     customCSS http://bgrins.github.io/spectrum/spectrum.css
// @require      http://code.jquery.com/jquery-latest.js
// @require      https://greasyfork.org/scripts/391517-spectrum-js/code/Spectrum%20JS.js?version=743395
// @require      https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/376746/Theme%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/376746/Theme%20Changer.meta.js
// ==/UserScript==
! function () {
    var r = window.jQuery;
    GM_addStyle(GM_getResourceText("customCSS"));
    "use strict";

    //Revert Froala changes
    //document.arrive(".fr-toolbar", function(newElem) {$(newElem).remove()});
    document.arrive("#description", function(newElem) {$(newElem).css('width', '')});

    //Fix formatting on schedule
    r(document)
        .ready(function () {
        r("#servicePlaceholder")
            .length > 0 && document.getElementById("servicePlaceholder")
            .addEventListener("click", function () {
            setTimeout(function () {
                r(".rad-calendar-button")
                    .css("width", "20px"), r("#edEditBudgetedMen")
                    .css("width", "54px"), r("#edEditDetailEndTime")
                    .css("width", "49px")
            }, 1e3)
        }, !1);
        console.log(r('.col-36 form-layout-right'));
        r('.col-36 form-layout-right').remove();
        var o = GM_getValue("color", "green");
        //add the spectrum color picker to the my day page.
        r(".homeBox-ColumnContainer-Right").append("<h2>Color Picker</h2><input type='text' class='basic'/>")

        //Change site formatting
        r("#xtcBanner")
            .hide();
        r("#xtcBannerDomID")
            .hide();
        r(".setupColRight")
            .css("background-color", o), r(".l-NavMenu")
            .css("background-color", o), r(".grid-header-hud")
            .css("background-color", o), r(".grid-header-hud-left")
            .css("background-color", o), r(".grid-header-hud-right")
            .css("background-color", o), r(".l-ViewOverlay-HeaderTitleActions")
            .css("background-color", o), r(".todoGroupHeader")
            .css("background-color", o), r(".tabHeaderSmallFooter")
            .css("background-color", o), r(".headerBannerWide")
            .css("background-color", o), r(".tabHeaderWide2")
            .css("background-color", o), r(".grid-footer4")
            .css("background-color", o), r(".cpHeaderWide")
            .css("background-color", o), r(".edit-form-header")
            .css("background-color", o), r(".tabHeaderWideFooter")
            .css("background-color", o), r(".tabHeaderSmall")
            .css("background-color", o), r(".tabHeaderSmallFooter")
            .css("background-color", o), r(".flexPageLeftContainer")
            .css("background-color", o), r(".position-sticky-top")
            .css("background-color", o), r(".tabHeaderWide")
            .css("background-color", o), r(".client-section-header")
            .css("background-color", o), r(".tabstrip-div")
            .css("background-color", o), r(".sabutton")
            .css("background-color", o), r(".dialogButton")
            .css("background-color", o), r(".settingsPage--SectionDropdown")
            .css("background-color", o), r(".div-add-button")
            .css("background-color", o), r(".AddButton")
            .children("a")
            .css("background-color", o), r(".AddButtonSecondary")
            .children("a")
            .css("background-color", o), r(".AddButton")
            .children("a")
            .css("border", "none"), r(".AddButtonSecondary")
            .children("a")
            .css("color", "white"), r(".AddButtonSecondary")
            .children("a")
            .css("border", "none"), r(".dialogButton")
            .css("border", "none"), r(".sabutton")
            .css("color", "#FFFFFF"), r(".sabutton")
            .css("border", "none"), r(".menu-iconSecondary")
            .css("border-left", "1px solid #FFFFFF"), r(".menu-iconSecondary")
            .children("img")
            .attr("src", "images/arrow-down4.png"), r(".ico-SALogo")
            .wrap(r("<a>", {
            href: "./Home.aspx"
        })), r("#panelTimesheets")
            .after('<a href="/TimesheetList.aspx" id="timesheetListLink" class="link link-Menu link-Menu-BoldHover accounting-BackgroundLight">Timesheet List</a>'), r("#ctl00_PageContent_cvClientTags")
            .hide(), r(document)
            .arrive(".swTime", function (o) {
            r(o)
                .hide()
        }), r(document)
            .arrive(".noteColumn", function (o) {
            r(o)
                .css("overflow", "hidden")
        }),
            r(document).arrive(".sabutton", function (o) {
            r(o)
                .css("display", "block")
        }),
            r(".basic")
            .spectrum({
            color: GM_getValue("color", "green"),
            showInput: !0,
            showPalette: !0,
            showSelectionPalette: !0,
            showInitial: !0,
            localStorageKey: "spectrum.demo",
            preferredFormat: "hex",
            change: function (r) {
                GM_setValue("color", r.toHexString()), location.reload()
            },
            palette: [
                ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)", "rgb(204, 204, 204)", "rgb(217, 217, 217)", "rgb(255, 255, 255)"],
                ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)", "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"],
                ["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)", "rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)", "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)", "rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)", "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)", "rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)", "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)", "rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
            ]
        })
    })
}();
