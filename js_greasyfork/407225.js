// ==UserScript==
// @name         Undercut Assist
// @namespace    http://www.knightsradiant.pw
// @version      0.51
// @description  Add undercut buttons to trade page
// @author       Talus
// @match        https://politicsandwar.com/index.php?id=26*
// @match        https://politicsandwar.com/index.php?id=90*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      GPL-3.0-or-later
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407225/Undercut%20Assist.user.js
// @updateURL https://update.greasyfork.org/scripts/407225/Undercut%20Assist.meta.js
// ==/UserScript==

(function() {
    function getResourceName(index) {
        const path = "#rightcolumn > table > tbody > tr > td:nth-child(5) > img";
        return $(path)[index].title.toLowerCase();
    }

    function getResourceCount(index) {
        const path = "#rightcolumn > table > tbody > tr > td:nth-child(5)";
        return Number($(path)[index].innerText.replace(/,/g,''))
    }

    function getPpu(index) {
        const path = "#rightcolumn > table > tbody > tr > td:nth-child(6)";
        const ppuRe = RegExp(/([\d,]+)/gms);
        var result = ppuRe.exec($(path)[index].innerText)
        return Number(result[1].replace(/,/g,''));
    }

    function getUndercutPpu(ppu, action) {
        if (action === "Sell") {
            return ppu - 1;
        } else {
            return ppu + 1;
        }
    }

    function getAction(index) {
        const path = "#rightcolumn > table > tbody > tr > td:nth-child(2)";
        var action;
        if ($(path)[index].innerText == "SELLER WANTED") {
            return "Buy";
        }
        return "Sell";
    }

    function getIsOwnTrade(index) {
        const path = "#rightcolumn > table > tbody > tr > td:nth-child(7)";
        return $(path)[index].innerText.trim() == "Delete";
    }

    function getAlliance(index, action) {
        var nation;
        var path;
        if (action == "Sell") {
            path = "#rightcolumn > table > tbody > tr > td:nth-child(2)";
        } else {
            path = "#rightcolumn > table > tbody > tr > td:nth-child(3)";
        }
        return $(path)[index].innerText.split('\n')[2];
    }

    var $ = window.jQuery;

    const path = "#rightcolumn > table > tbody > tr > td:nth-child(6)";
    var trades = $(path);
    for (var i=0; i<trades.length; i++) {
        var action = getAction(i);
        if (action == "Buy") {
            buttonColor = "#337ab7";
        } else {
            buttonColor = "#5cb85c";
        }

        var resourceName = getResourceName(i);
        var ppu = getPpu(i);
        var amount = getResourceCount(i);

        var undercutPpu;
        var buttonColor;
        var buttonBorderStyle = "";
        var buttonText;
        var alliance = getAlliance(i, action);
        if (getIsOwnTrade(i)) {
            undercutPpu = ppu;
            buttonBorderStyle = "border:3px solid red; border-radius:5px";
            buttonText = "Match";
        } else if (alliance == "The Knights Radiant") {
            undercutPpu = ppu;
            buttonBorderStyle = "border:3px solid #ef7910; border-radius:5px";
            buttonText = "Match";
        } else {
            undercutPpu = getUndercutPpu(ppu, action);
            buttonText = "Undercut"
        }

        var createTradeUrl = 'https://politicsandwar.com/nation/trade/create';
        var strBuilder = "<br>";
        strBuilder += "<form action=\""+createTradeUrl+"\">";
        strBuilder += "<input type=\"hidden\" name=\"resource\" value=\""+resourceName+"\">";
        strBuilder += "<input type=\"hidden\" name=\"ppu\" value=\""+undercutPpu+"\">";
        strBuilder += "<input type=\"hidden\" name=\"trade_amount\" value=\""+amount+"\">";
        strBuilder += "<input type=\"hidden\" name=\"action\" value=\""+action+"\">";
        strBuilder += "<input type=\"submit\" value=\""+buttonText+"\" class=\"tradeForm undercut\" style=\"opacity:0.8; background-color:"+buttonColor+"\; "+buttonBorderStyle+"\">";
        strBuilder += "</form>";
        trades[i].innerHTML += strBuilder;
    }
    $(".undercut").mouseenter(function() {
        $(this).fadeTo('fast', 1);
    });
    $(".undercut").mouseleave(function() {
        $(this).fadeTo('fast', 0.8);
    });
})();