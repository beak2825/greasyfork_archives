// ==UserScript==
// @name         AtoZ_Stock_Helper_DEV
// @namespace    AtoZ.Stock_Helper_DEV
// @version      0.0.10
// @description  Helps identify possible investment opportunities
// @author       AlienZombie [2176352]
// @credit       Afwas [1337627] {For using various concepts and pieces of code to achieve my objectives}
// @match        *://*.torn.com/index.php
// @match        *://*.torn.com/preferences.php*
// @match        *://*.torn.com/stockexchange.php*
// @require      https://code.jquery.com/jquery-1.12.0.min.js
// @require      https://greasyfork.org/scripts/404656-ping-alert/code/Ping%20Alert.js?version=812331
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @grant        GM_getResourceText
// @connect      api.torn.com
// @grant        GM_xmlhttpRequest
// @license      GPL v2 or higher. See https://www.gnu.org/licenses/old-licenses/gpl-2.0.html
// @downloadURL https://update.greasyfork.org/scripts/408901/AtoZ_Stock_Helper_DEV.user.js
// @updateURL https://update.greasyfork.org/scripts/408901/AtoZ_Stock_Helper_DEV.meta.js
// ==/UserScript==
/* jshint -W097 */
/*global
   GM_setValue, GM_getValue, GM_log, $, jQuery, document, window, alert, GM_getResourceText, GM_xmlhttpRequest, ping,
   console
 */

'use strict';

// Globals

//******
//* ADD YOUR API KEY TO THE NEXT LINE
//* THERE IS NOTHING ELSE YOU NEED TO CHANGE
//******
var myAPI = "AWjcDPq8BhSxYx1w";
var SettingsPageIdentifier = "#api";
var stockRowIdentifier = "li.item-wrap"; //$("li.item-wrap").children("ul.item").children("li.logo").css("background-color", "#000000")
var stockSummaryIdentifier = "ul.item";
var stockLogoIdentifier = "li.logo";
var stockChartIdentifier = "li.chart";

var stockUrl = "https://api.torn.com/torn/?selections=stocks&key=" + myAPI;

// Interval for refreshing banners in seconds. A good refresh-time is 60 seconds.
// The stockmarket seems to refresh just after 00, 15, 30, 45 minutes every hour.
var interval = 60;

function getTime() {
    var now = new Date().toISOString().slice(11, -1);
    return now;
}

function getDate() {
    var now = new Date().toISOString().slice(0, 10);
    return now;
}

// Prevent caching
$.ajaxSetup({ cache: false });

// The JSON needs to be retreived. Might as well do it here and now
var stocks = [];
var newData = 1;
var refresh = 0;
function getStocks() {
	GM_xmlhttpRequest({
		url: stockUrl,
		responseType: 'json',
		method: "GET",
		onload: function( res ) {
			if (res.responseText.indexOf('<html>') > -1) {
				console.log('Apparent network or server related error in TornStockAlert userscript');
				console.log(res.responseText);
				return;
			}
			var data = res.response;
            stocks = [];
            for(var key in data.stocks) {
                if (key == 25) {
                    stocks.push(["FOO", "Foo", 0, 0.0, "Average"]);
                }
                stocks.push([data.stocks[key].acronym.trim(), data.stocks[key].name, data.stocks[key].current_price, data.stocks[key].available_shares, data.stocks[key].forecast]);
            }
            // If a page is new loaded refresh is 0 --> Add the banners
            // newData denotes a change in data from the servers. Go refresh!
            newData = checkNewData();
            // console.log( getTime() + " Checked newData. newData is : " + newData);
            if (!refresh || newData) {
                $(".stock-alert").remove();
                processAlerts();
                newData = 0;
            }
            if (GM_getValue("toggle-color", "checked") === "checked") {
                addColorToStockMarket();
            }
            experimental = GM_getValue("toggle-experimental", "");
            if (experimental === "checked") {
                // This is a rather dirty hack. I offer 100M if you can come up with
                // a *WORKING* solution to add the banners to pages or elements that
                // are loaded AFTER the DOM. Examples of those pages: forums, laptop.
                selected = GM_getValue("toggle-selected", "");
                if (selected === "checked") {
                    window.setTimeout(function() {
                        $(".stock-alert").remove();
                        processAlerts();
                        $("h4").click(function() {
                            $(".stock-alert").remove();
                            processAlerts();
                        });
                    }, 2000);
                    if (window.location.href.indexOf("/laptop.php") > -1) {
                        setInterval(function() {
                            $(".stock-alert").remove();
                            processAlerts();
                            $("h4").click(function() {
                                $(".stock-alert").remove();
                                processAlerts();
                            });
                        }, 2000);
                    }
                }
            } // End experimental
        }
    });
}
getStocks();

// Try to prevent refresh if data from server is not new
function checkNewData() {
    // Check 'random' shares
    var change = 0;
    var TCP = GM_getValue("TCP", 0.0);
    if (parseFloat(TCP) !== parseFloat(stocks[stockId.TCP][2])) {
        GM_setValue("TCP", stocks[stockId.TCP][2]);
        change = 1;
    }
    var FHG = GM_getValue("FHG", 0.0);
    if (parseFloat(FHG) !== parseFloat(stocks[stockId.FHG][2])) {
        GM_setValue("FHG", stocks[stockId.FHG][2]);
        change = 1;
    }
    // change denotes a change in shareprices. Go update!
    return change;
}

// Notify adds the cool banner to the top of page index,php
$.fn.notify = function(message) {
    var pre = "<div class=\"info-msg-cont green border-round m-top10 stock-alert\">";
    pre += "<div class=\"info-msg border-round\"><i class=\"info-icon\">";
    pre += "</i><div class=\"delimiter\"><div class=\"msg right-round\"><ul><li>";
    var post = "</li></ul></div></div></div></div>";
    this.after(
        pre + message + post
    );
    return this;
};

function placeBanner(message) {
    // If "checked" then banners are shown on all pages
    // Defaults to Home page only
    selected = GM_getValue("toggle-selected", "");
    if (selected === "checked") {
           $("hr.page-head-delimiter:first").notify(message);
    } else {
        if ($("h4.left:contains('Home')").text().length) {
            $("hr.page-head-delimiter:first").notify(message);
        }
    }
}

// Utility function
// https://stackoverflow.com/questions/5731193/how-to-format-numbers-using-javascript
function formatNumber(number)
{
    // number = number.toFixed(2) + '';
    number = number + '';
    var x = number.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

var stockId = {"TCSE": "0",
               "TSBC": "1",
               "TCB": "2",
               "SYS": "3",
               "SLAG": "4",
               "IOU": "5",
               "GRN": "6",
               "TCHS": "7",
               "YAZ": "8",
               "TCT": "9",
               "CNC": "10",
               "MSG": "11",
               "TMI": "12",
               "TCP": "13",
               "IIL": "14",
               "FHG": "15",
               "SYM": "16",
               "LSC": "17",
               "PRN": "18",
               "EWM": "19",
               "TCM": "20",
               "ELBT": "21",
               "HRG": "22",
               "TGP": "23",
               "WSSB": "25",
               "ISTC": "26",
               "BAG": "27",
               "EVL": "28",
               "MCS": "29",
               "WLT": "30",
               "TCC": "31"};

// Add item to mobile preferences menu
$("#categories").append("<option value=\"stock_market\">Stock market alerts</option>");

// Add a link to the settings menu in preferences.php
$(".headers").children("div.clear").before("<li class=\"delimiter\"></li>\n"+
                                           "<li class=\"c-pointer left-bottom-round\" data-title-name=\"Stock market alerts\" "+
                                           "id=\"stock-market\">\n"+
                                           "<a class=\"t-gray-6 bold h stock-market\">Stock Market Alerts</a>\n"+
                                           "</li>");

// Selector to toggle showing on very page
// selected is ["checked" | ""]
var selected = GM_getValue("toggle-selected", "");
var addColor = GM_getValue("toggle-color", "checked");
var experimental = GM_getValue("toggle-experimental", "");

// Create settings page/pane for stocks
var page = "</div><div id=\"stock-market-page\" class=\"prefs-cont left ui-tabs-panel ";
page += "ui-widget-content ui-corner-bottom\" aria-labelledby=\"ui-id-33\" ";
page += "role=\"tabpanel\" aria-expanded=\"true\" aria-hidden=\"true\" style=\"display: none;\">";
page += "\t<div class=\"inner-block\">";
page += "\t\t<p class=\"m-top3\">These are the watches you have currently set. Click any to remove.</p>";
page += "\t\t<ul class=\"m-top3\" id=\"stock-alert-list\">";
page += "\t\t</ul>";
page += "\t\t<div class=\"m-top3\" id=\"stock-alert-messages\"></div>";
page += "\t\t<form class=\"m-top10\" action=\"\" id=\"stock-form\">";
page += "\t\t\t<select id=\"stock-alert-stock\" name=\"stock-alert-stock\">";
page += "\t\t\t\t<option value=\"TCSE\">TCSE</option>";
page += "\t\t\t\t<option value=\"TCB\">TCB</option>";
page += "\t\t\t\t<option value=\"SYS\">SYS</option>";
page += "\t\t\t\t<option value=\"SLAG\">SLAG</option>";
page += "\t\t\t\t<option value=\"IOU\">IOU</option>";
page += "\t\t\t\t<option value=\"GRN\">GRN</option>";
page += "\t\t\t\t<option value=\"TCHS\">TCHS</option>";
page += "\t\t\t\t<option value=\"YAZ\">YAZ</option>";
page += "\t\t\t\t<option value=\"TCT\">TCT</option>";
page += "\t\t\t\t<option value=\"CNC\">CNC</option>";
page += "\t\t\t\t<option value=\"MSG\">MSG</option>";
page += "\t\t\t\t<option value=\"TMI\">TMI</option>";
page += "\t\t\t\t<option value=\"TCP\">TCP</option>";
page += "\t\t\t\t<option value=\"IIL\">IIL</option>";
page += "\t\t\t\t<option value=\"FHG\">FHG</option>";
page += "\t\t\t\t<option value=\"SYM\">SYM</option>";
page += "\t\t\t\t<option value=\"LSC\">LSC</option>";
page += "\t\t\t\t<option value=\"PRN\">PRN</option>";
page += "\t\t\t\t<option value=\"EWM\">EWM</option>";
page += "\t\t\t\t<option value=\"TCM\">TCM</option>";
page += "\t\t\t\t<option value=\"ELBT\">ELBT</option>";
page += "\t\t\t\t<option value=\"HRG\">HRG</option>";
page += "\t\t\t\t<option value=\"TGP\">TGP</option>";
page += "\t\t\t\t<option value=\"WSSB\">WSSB</option>";
page += "\t\t\t\t<option value=\"ISTC\">ISTC</option>";
page += "\t\t\t\t<option value=\"BAG\">BAG</option>";
page += "\t\t\t\t<option value=\"EVL\">EVL</option>";
page += "\t\t\t\t<option value=\"MCS\">MCS</option>";
page += "\t\t\t\t<option value=\"WLT\">WLT</option>";
page += "\t\t\t\t<option value=\"TCC\">TCC</option>";
page += "\t\t\t</select>";
page += "\t\t\t<select id=\"stock-action\" name=\"stock-action\">";
page += "\t\t\t\t<option value=\"price\">Price</option>";
page += "\t\t\t\t<option value=\"available\">Available</option>";
page += "\t\t\t\t<option value=\"forecast\">Forecast</option>";
page += "\t\t\t</select>";
page += "\t\t\t<select id=\"stock-mutation\" name=\"stock-mutation\">";
page += "\t\t\t\t<option value=\"less\">Less than</option>";
page += "\t\t\t\t<option value=\"equal\">Equals</option>";
page += "\t\t\t\t<option value=\"more\">More than</option>";
page += "\t\t\t</select>";
page += "\t\t\t<select id=\"stock-forecast\" name=\"stock-forecast\" style=\"display: none\">";
page += "\t\t\t\t<option value=\"verypoor\">Very Poor</option>";
page += "\t\t\t\t<option value=\"poor\">Poor</option>";
page += "\t\t\t\t<option value=\"average\">Average</option>";
page += "\t\t\t\t<option value=\"good\">Good</option>";
page += "\t\t\t\t<option value=\"verygood\">Very Good</option>";
page += "\t\t\t</select>";
page += "\t\t\t<input type=\"text\" name=\"stock-value\" id=\"stock-value\" value=\"0\">";
// page += "\t\t\t <input type=\"text\" name=\"stock-note\" id=\"stock-note\" value=\"Add a note\">";
page += "\t\t\t<div class=\"btn-wrap silver change\">";
page += "\t\t\t\t<div class=\"btn\" id=\"stock-market-submit\">";
// page += "\t\t\t\t\t<input class=\"c-pointer\" type=\"submit\" value=\"CREATE\">";
page += 'CREATE';
page += "\t\t\t\t</div>";
page += "\t\t\t</div>";
page += "\t\t\t<div>";
page += "\t\t\t\t<br><input type=\"checkbox\" name=\"city-wide\" value=\"city-wide\" " + selected + "> Check this if you want the banner throughout the city.";
page += "\t\t\t</div>";
page += "\t\t\t<div>";
page += "\t\t\t\t<br><input type=\"checkbox\" name=\"color\" value=\"color\" " + addColor + "> Check this if you want colors on the Stock Market page.";
page += "\t\t\t</div>";
page += "\t\t</form>";
page += "\t</div>";
page += "</div>";

// Put 'page' somewhere between similar panes
$(SettingsPageIdentifier).after(page);

$("input:checkbox[name='city-wide']").change(function() {
    // New state
    console.log("Checkbox changed");
    if(this.checked) {
        GM_setValue("toggle-selected", "checked");
        selected = "checked";
    } else {
        GM_setValue("toggle-selected", "");
        selected = "";
    }
});

$("input:checkbox[name='color']").change(function() {
    // New state
    if(this.checked) {
        GM_setValue("toggle-color", "checked");
        addColor = "checked";
    } else {
        GM_setValue("toggle-color", "");
        addColor = "";
    }
});

// Add alerts. This is for page-load
addAlertsToSettings();

// Add page to settingspage
$("li#stock-market").click(function() {
    // Just the fancy click on the left-side menu
    $("li.ui-tabs-active").removeClass("ui-state-active").removeClass("ui-tabs-active");
    $("li#stock-market").addClass("ui-tabs-active").addClass("ui-state-active");
    // Remove current pane and show Stock page
    $("div.prefs-cont[aria-hidden='false']").css("display", "none").attr("aria-expanded", "false").attr("aria-hidden", "true");
    $("#stock-market-page").css("display", "table-cell").attr("aria-expanded", "true").attr("aria-hidden", "false");
    // $("div.prefs-cont[aria-hidden='false']").replaceWith(page);
    // Bind an eventhandler to the new submit button
    $("div#stock-market-submit").on("click", clickSubmitButton);
    // If another link is clicked remove the pane (revert to it's original state)
    $("li.c-pointer").children("a").click(function() {
        $("li#stock-market").removeClass("ui-state-active").removeClass("ui-tabs-active");
        $("#stock-market-page").css("display", "none").attr("aria-expanded", "false").attr("aria-hidden", "true");
    });
});

// Add existing alerts to settings page
function addAlertsToSettings() {
    // Use .detach() here? .empty() kills the eventhandler
    $("ul#stock-alert-list").empty();
    // This first part is identical to processAlerts()
    var alerts = GM_getValue("stock-alert", "");
    if (alerts === "") {
        // Nothing to do
        return;
    }
    // String split() gets individual alerts
    var alertsInArray = alerts.split("|");
    if (alertsInArray[0].length === 0 ) {
        // .split returns an array with one empty string element
        // if split on an empty string
        return;
    }
    for (var alertKey in alertsInArray) {
        // Split the alert to get the data
        // Example [4,YAZ,available,more,0]
        if (alertsInArray[alertKey] === "") {
            // Nothing to do
            return;
        }
        var alert = alertsInArray[alertKey].split("-");
        var str = "#" + alert[0] + ": \t" + alert[1] + "\t" + alert[2] +
            "\t" + alert[3] + ((alert[2] === "forecast") ? "" : "\t" + alert[4]);
        $("ul#stock-alert-list").append(
            "<li id=\"stock" + alert[0] + "\">" + str + "</li>"
         );
    }
    // Adds an eventListener to the list
    // Remove an alert by clicking on it in settings
    $("ul#stock-alert-list").children().click(function() {
        var id = $(this).attr("id");
        // get the number
        id = id.substr(5);
        console.log("id: " + id);
        // Remove alert from list; store new list
        removeAlert(id);
        // Append the new list to the <ul>
        addAlertsToSettings();
    });
}

function removeAlert(id) {
    var newAlerts = "";
    // This first part is identical to processAlerts()
    var alerts = GM_getValue("stock-alert", "");
    // String split() gets individual alerts
    var alertsInArray = alerts.split("|");
    for (var alertKey in alertsInArray) {
        // Split the alert to get the data
        // Example [4,YAZ,available,more,0]
        var alert = alertsInArray[alertKey].split("-");
        if (alert[0] === id) {
            $("div#stock-alert-messages").css("color", "#FF4000").text(
                "Removed alert: " + alertsInArray[alertKey]);
            continue;
        } else {
            if (newAlerts === "") {
                newAlerts = alertsInArray[alertKey];
            } else {
                newAlerts += "|" + alertsInArray[alertKey];
            }
        }
    }
    GM_setValue("stock-alert", newAlerts);
}

// Toggle menu after forecast is selected. Forecast uses a different sub-menu
$("#stock-action").change(function() {
    if ($(this).val() == "forecast") {
        $("#stock-forecast").css("display", "inline");
        $("#stock-mutation").css("display", "none");
        $("#stock-value").css("display", "none");
    } else {
        $("#stock-forecast").css("display", "none");
        $("#stock-mutation").css("display", "inline");
        $("#stock-value").css("display", "inline");
    }
});

// Event handler for clicking Create
function clickSubmitButton() {
    var data = $("#stock-form").serializeArray();
    // Debug
/*    for (var key in data) {
        // data is an array of  "name" / "value" pairs
        console.log(data[key]);
      }
*/
    // data[0] is name. data[1] is action, data[2] is less/equal/more,
    // data[3] is value, data[4] is poor/average/good
    createAlert(data[0].value, data[1].value,
                ((data[1].value === "forecast") ? data[3].value : data[2].value),
                ((data[1].value === "forecast") ? "" : data[4].value));
}

// Here it happens. The alert gets created and stored
function createAlert(stock, action, mutation, value) {
    var first = 0;
    // Manual reset
    //GM_setValue("stock-alert", "");
    var stored = GM_getValue("stock-alert", "");
    if (stored === "") {
        // Reset counter
        GM_setValue("serial", "0");
        first = 1;
    }
    var newAlert = getSerial() + "-" + stock + "-" + action + "-" +
        mutation + ((action === "forecast") ? "" : "-" + value);
    $("div#stock-alert-messages").css("color", "#00FF80").text(
        "Created alert: " + newAlert);
    stored = ((first) ? "" : stored + "|") + newAlert;
    GM_setValue("stock-alert", stored);
    // I think we are now on the settings page, so refresh it.
    addAlertsToSettings();
}

// Get a unique number to distinguish similar looking queries
function getSerial() {
    // Manual reset
    //GM_setValue("serial", "");
    var serial = GM_getValue("serial", 0);
    if (serial === 0) {
        serial = "1";
        GM_setValue("serial", serial);
    } else {
        serial = (parseInt(serial)+1).toString();
        GM_setValue("serial", serial);
    }
    console.log("Serial: " + serial);
    return serial;
}

// Done creating alerts. Now retreive them
function processAlerts() {
    var text, st;

    // Stored alerts
    var alerts = GM_getValue("stock-alert", "");
    // String split() gets individual alerts
    if (alerts === "") {
        // Nothing to do
        return;
    }
    var alertsInArray = alerts.split("|");
    for (var alert in alertsInArray) {
        // Split the alert to get hte data
        // Example [4,YAZ,available,more,0]
        var al = alertsInArray[alert].split("-");
        // Get stock data for this stock
        var stId = stockId[al[1]];

        st = stocks[stId];
        // console.log("Compare stocks[stId] with al[1]: " + stocks[stId][0] + " <-> " + al[1] + ". stId = " + stId);
        // Switch over action 'price', 'available', 'forecast'
        switch (al[2]) {
            case "price":
                switch (al[3]) {
                    case "less":
                        // if (stock[name][current_value] < value) { ... }
                        if (parseFloat(st[2]) < parseFloat(al[4])) {
                            // Print banner
                            text = al[1] + " - The price of " + st[1] + " ($" + formatNumber(st[2]) + ")  is less than $" + formatNumber(al[4]) + ".";
                            placeBanner(text);
                        }
                        break;
                    case "equal":
                        // Won't happen. Skip
                        break;
                    case "more":
                        // if (stock[name][current_value] > value) { ... }
                        if (parseFloat(st[2]) > parseFloat(al[4])) {
                            // Print banner
                            text = al[1] + " - The price of " + st[1] + " ($" + formatNumber(st[2]) + ") is greater than $" + formatNumber(al[4]) + ".";
                            placeBanner(text);
                        }
                        break;
                    default:
                        console.log("al[3] seems not to match [less|equal|more] ->" + al[3]);
                        break;
                }
                break;
            case "available":
                switch (al[3]) {
                    case "less":
                        // if (stock[name][available_share] < available) { ... }
                        if (parseInt(st[3]) < parseInt(al[4])) {
                            // Print banner
                            text = al[1] + " - There are less than " + formatNumber(al[4]) + " (" + formatNumber(st[4]) + ") shares in " + st[1] + " available.";
                            placeBanner(text);
                        }
                        break;
                    case "equal":
                        // if (stock[name][available_share] == available) { ... }
                        if (parseInt(st[3]) === parseInt(al[4])) {
                            // Print banner
                            text = al[1] + " - There are exactly " + formatNumber(al[4]) + " shares in " + st[1] + " available.";
                            placeBanner(text);
                        }
                        break;
                    case "more":
                        // if (stock[name][available_share] > available) { ... }
                        //
                        if (parseInt(st[3]) > parseInt(al[4])) {
                            // Print banner
                            text = al[1] + " - There are more than " + formatNumber(al[4]) + " (" + formatNumber(st[3]) + ") shares in " + st[1] + " available.";
                            placeBanner(text);
                        }
                        break;
                    default:
                        console.log("al[3] doesn't seem to match [less|equal|more] -> " + al[3]);
                } // most inner switch
                break;
            case "forecast":
                // console.log("al[3]: " + al[3]);
                switch (al[3]) {
                    case "verypoor":
                        if (st[4] === "Very Poor") {
                            // Print banner
                            text = al[1] + " - Forecast for " + st[1] + " is VERY POOR.";
                            placeBanner(text);
                        }
                        break;
                    case "poor":
                        if (st[4] === "Poor") {
                            // Print banner
                            text = al[1] + " - Forecast for " + st[1] + " is POOR.";
                            placeBanner(text);
                        }
                        break;
                    case "average":
                        if(st[4] === "Average") {
                            // Print banner
                            text = al[1] + " - Forecast for " + st[1] + " is AVERAGE.";
                            placeBanner(text);
                        }
                        break;
                    case "good":
                        if (st[4] === "Good") {
                            // Print banner

                            text = al[1] + " - Forecast for " + st[1] + " is GOOD.";
                            placeBanner(text);
                        }
                        break;
                    case "verygood":
                        if (st[4] === "Very Good") {
                            // Print banner
                            text = al[1] + " - Forecast for " + st[1] + " is VERY GOOD.";
                            placeBanner(text);
                        }
                        break;
                    default:
                        console.log("al[3] doesn't seem to match [poor|average|good] -> " + al[3]);
                } // inner switch (al[3])
                break;
            default:
                console.log("al[2] doesn't match [price|available|forecast] -> " + al[2]);
        } // outer most switch
    } // for loop
}

interval = interval * 1000;
window.setInterval(function() {
    refresh = 1;
    getStocks();
    // newData = checkNewData();
    console.log(getTime() + " Auto-refresh");
    if (newData) {
        // $(".stock-alert").remove();
        console.log(getTime() + " New data! Refreshing now");
    }
}, interval);

// http://www.colorpicker.com/
var colors = {
    veryPoor: "#FFB47B",
    poor: "#FFF898",
    good: "#C3F5FF",
    veryGood: "#7D89FF",
    average: "#F2F2F2",
    unavailable: "#FF9A9A",
    available: "#86FF80"
};

function addColorToStockMarket() {
    // if (window.location.href.indexOf("stockexchange.php?step=portfolio") > -1) {
        $("li.item-wrap").each(function() {
            var stock = $(this).attr("data-stock").toUpperCase();
            var forecast = stocks[parseInt(stockId[stock])][4];
            var available = stocks[parseInt(stockId[stock])][3];

            console.log(`<<<<<<<<<<< ${stock} --- ${forecast} --- ${available}`);

            var isAvailable = parseInt(available) > 1;
            var stockColor = colors.unavailable;
            if (isAvailable) {
                stockColor = colors.available;
            }
            var forecastColor = colors.average;

            //var thisItem = $(stockRowIdentifier).children(stockSummaryIdentifier).children(stockLogoIdentifier);

            switch (forecast) {
                case "Very Good":
                    forecastColor = colors.veryGood;
                    break;
                case "Good":
                    forecastColor = colors.good;
                    break;
                case "Poor":
                    forecastColor = colors.poor;
                    break;
                case "Very Poor":
                    forecastColor = colors.veryPoor;
                    break;
            }

            $(this).css("background", `linear-gradient(to right, ${forecastColor} 30%, ${stockColor})`);
        });
    // }
    // if (window.location.href.endsWith("stockexchange.php")) {
    //     $("li.item").each(function() {
    //         var stock = $(this).find("div.abbr-name.d-hide").text();
    //         var forecast = stocks[parseInt(stockId[stock])][4];
    //         var available = stocks[parseInt(stockId[stock])][3];
    //         var availableTreshold = 100000;
    //         var availableBool = parseInt(available) < availableTreshold;
    //         if (availableBool) {
    //             $(this).css("background-color", colors.unavailable);
    //         }
    //         switch (forecast) {
    //             case "Very Good":
    //                 if(availableBool) {
    //                     $(this).css("background-color", colors.veryGoodUnavailable);
    //                 } else {
    //                     $(this).css("background-color", colors.veryGood);
    //                 }
    //                 break;
    //             case "Good":
    //                 if(availableBool) {
    //                     $(this).css("background-color", colors.goodUnavailable);
    //                 } else {
    //                     $(this).css("background-color", colors.good);
    //                 }
    //                 break;
    //             case "Poor":
    //                 if(availableBool) {
    //                     $(this).css("background-color", colors.poorUnavailable);
    //                 } else {
    //                     $(this).css("background-color", colors.poor);
    //                 }
    //                 break;
    //             case "Very Poor":
    //                 if(availableBool) {
    //                     $(this).css("background-color", colors.veryPoorUnavailable);
    //                 } else {
    //                     $(this).css("background-color", colors.veryPoor);
    //                 }
    //                 break;
    //         }
    //     });
    // }
}