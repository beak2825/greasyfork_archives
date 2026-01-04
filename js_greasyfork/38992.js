// ==UserScript==
// @name Trello colouring
// @namespace https://trello.com/
// @version 1.7
// @description Colour list for Scrum, referenced with Kanban Game
// @match https://trello.com/*
// @require http://code.jquery.com/jquery-latest.js
// @author       Angie
// @downloadURL https://update.greasyfork.org/scripts/38992/Trello%20colouring.user.js
// @updateURL https://update.greasyfork.org/scripts/38992/Trello%20colouring.meta.js
// ==/UserScript==
// Ref: https://greasyfork.org/en/scripts/37171-trello-coloured-scrum-kanban

$(document).ready(function() {

    var red = '#fccbc2',
        blue = '#9ec4ff',
        green = '#dbffd1' ,
        tiffanyblue = '#a4fce6',
        lighttiffanyblue = '#e5fff8',
        grey = '#c4c4c4',
        black = '#898989',
        white = '#fff',
        yellow = '#ffd800',
        creamywhite = '#ffffb3',
        darkred = '#ff6363',
        lightblue = '#dbf3ff',
        lightpurple = '#5aa8fc',
        lightorange = '#ffd396',
        darkdarkred = '#c1150f',
        pink = '#fabaff',
        orange = '#ff8300';

    $('body').hover(function() {
        $("h2:contains('Analysis')").css('color', white).parents('.list').css('background', red);
        $("h2:contains('Development')").css('color', white).parents('.list').css('background', blue);
        $("h2:contains('QA')").css('color', white).parents('.list').css('background', green);
        $("h2:contains('Deployment')").css('color', white).parents('.list').css('background', creamywhite);
        $("h2:contains('Done (')").css('color', white).parents('.list').css('background', black);
        $("span:contains('(Parent)')").parents('.list-card-details').css('background', tiffanyblue).css('border-style', 'solid').css('border-color', lightpurple).css('border-width', '5px');
        $("span:contains('(Child)')").parents('.list-card-details').css('background', tiffanyblue).css('border-style', 'none');
        $(".card-short-id").append(" ").removeClass("hide").css('color', lightorange);
        $("span[class='list-card-title js-card-name']").filter(function () {
            return !new RegExp("\\(\\d+\\)").test($(this).text());
        }).find(".card-short-id").css('color', darkdarkred);
        $("span:contains('[VIP]')").parents('.list-card-details').css('background', darkred).css('border-style', 'none');
        $("span:contains('[Guide]')").parents('.list-card-details').css('background', lightblue).css('border-style', 'none');
    });

    /* Prevent multiple insert to DOM for performance */
    /* Construct whole WIP html string and append all to DOM at once */
    var completeWipHtml = "";
    var prevCompleteWipHtml = "";
    
    function printOneMemberWIP(value, key, map) {
        var WIP_LIMIT = 3;
        if (value == 0) {
            completeWipHtml = completeWipHtml + "<b style='color: orange'>" + key + ": " + value + " , </b>";
        } else if (value > WIP_LIMIT) {
            completeWipHtml = completeWipHtml + "<b style='color: red'>" + key + ": " + value + " , </b>";
        } else {
            completeWipHtml = completeWipHtml + key + ": " + value + " , ";
        }
    }

    function printGroupAWIP(value, key, map) {
        var WIP_LIMIT = 5;
        if (value > WIP_LIMIT) {
            completeWipHtml = completeWipHtml + "<b style='color: red'>" + key + ": " + value + " , </b>";
        } else {
            completeWipHtml = completeWipHtml + key + ": " + value + " , ";
        }
    }

    function printGroupBWIP(value, key, map) {
        var WIP_LIMIT = 6;
        if (value > WIP_LIMIT) {
            completeWipHtml = completeWipHtml + "<b style='color: red'>" + key + ": " + value + " , </b>";
        } else {
            completeWipHtml = completeWipHtml + key + ": " + value + " , ";
        }
    }

    function printWIP() {
        prevCompleteWipHtml = completeWipHtml;
        completeWipHtml = "";

        /*
            Common Selectors
        */
        var groupASelector = "span[title='Group A']";
        var groupBSelector = "span[title='Group B']";

        var analysisSelector = 'textarea:contains("Analysis - In Progress"), textarea:contains("Analysis - Done")';
        var devSelector = 'textarea:contains("Development - In Progress"), textarea:contains("Development - Done")';
        var qaSelector = 'textarea:contains("QA - In Progress"), textarea:contains("QA - Done")';
        var deploySelector = 'textarea:contains("Deployment - In Progress")';
        
        var blockedSelector = "span[title='Keep Monitoring'], span[title^='Pending for']";
        var notExceptionSelector = ".list-card:not(:contains('(Parent)')):not(:contains('[VIP]'))";
        var exceptionSelector = ".list-card:contains('(Parent)'), .list-card:contains('[VIP]')";

        var memberIPSelector = 'textarea:contains("Analysis"), textarea:contains("Development"), textarea:contains("QA"), textarea:contains("Deployment"), textarea:contains("Environment Issue"), textarea:contains("Jail")';

        /*
            Common Selectors END
        */

        /*
            Print Single Member WIP
        */

        var text = "";

        completeWipHtml = completeWipHtml + "<div id='actualWIP' style='color: white'>Member WIP (excluded External Blocker): ";

        var allMember = $("div.list-wrapper")
        .find("img.member-avatar")
        .map(function() {
            return this.alt.replace(/\(.+\)/, "");
        })
        .toArray();

        var finalMap = new Map();
        for (var i in allMember) {
            finalMap.set(allMember[i], 0);
        }

        var normalMap = $(memberIPSelector)
        .closest("div.list-wrapper")
        .find("img.member-avatar")
        .map(function() {
            return this.alt.replace(/\(.+\)/, "");
        })
        .toArray()
        .reduce((acc, val) => acc.set(val, 1 + (acc.get(val) || 0)), new Map());

        var blockedMap = $(memberIPSelector)
        .closest("div.list-wrapper")
        .find(blockedSelector).parent()
        .closest("a.list-card")
        .find("img.member-avatar")
        .map(function() {
            return this.alt.replace(/\(.+\)/, "");
        })
        .toArray()
        .reduce((acc, val) => acc.set(val, 1 + (acc.get(val) || 0)), new Map());

        for (var [key, value] of finalMap.entries()) {
            var point = normalMap.get(key) === undefined ? 0 : normalMap.get(key);
            var blockedPoint = blockedMap.get(key) === undefined ? 0 : blockedMap.get(key);
            finalMap.set(key, point - blockedPoint);
        }
        finalMap.forEach(printOneMemberWIP);

        completeWipHtml = completeWipHtml + "</div>";

        /*
            Print Group WIP
        */
        completeWipHtml = completeWipHtml + "<div id='actualGroupAWIP' style='color: grey; background-color: yellowgreen; margin: 3px; padding: 3px; border-radius: 25px' align='middle'>Group A WIP (Max. 5 for each): ";

        var finalGroupAMap = new Map();

        var analysisIP = $(analysisSelector).closest("div.list-wrapper").find(groupASelector).length;
        /* find blocker but excluding Parent & VIP (Exception) */
        /* ".find(blockedSelector).parent().length" instead of ".find(blockedSelector).length" to count blocked CARDS other than blocked LABELS */
        var analysisBlocked = $(analysisSelector).closest("div.list-wrapper").find(notExceptionSelector).find(groupASelector).parent().find(blockedSelector).parent().length;
        /* find Parent or VIP */
        var analysisException = $(analysisSelector).closest("div.list-wrapper").find(exceptionSelector).find(groupASelector).length;
        finalGroupAMap.set("Analysis", analysisIP - analysisBlocked - analysisException);

        var devIP = $(devSelector).closest("div.list-wrapper").find(groupASelector).length;
        /* find blocker but excluding Parent & VIP (Exception) */
        var devBlocked = $(devSelector).closest("div.list-wrapper").find(notExceptionSelector).find(groupASelector).parent().find(blockedSelector).parent().length;
        /* find Parent or VIP */
        var devException = $(devSelector).closest("div.list-wrapper").find(exceptionSelector).find(groupASelector).length;
        finalGroupAMap.set("Development", devIP - devBlocked - devException);

        var qaIP = $(qaSelector).closest("div.list-wrapper").find(groupASelector).length;
        /* find blocker but excluding Parent & VIP (Exception) */
        var qaBlocked = $(qaSelector).closest("div.list-wrapper").find(notExceptionSelector).find(groupASelector).parent().find(blockedSelector).parent().length;
        /* find Parent or VIP */
        var qaException = $(qaSelector).closest("div.list-wrapper").find(exceptionSelector).find(groupASelector).length;
        finalGroupAMap.set("QA", qaIP - qaBlocked - qaException);

        var deployIP = $(deploySelector).closest("div.list-wrapper").find(groupASelector).length;
        /* find blocker but excluding Parent & VIP (Exception) */
        var deployBlocked = $(deploySelector).closest("div.list-wrapper").find(notExceptionSelector).find(groupASelector).parent().find(blockedSelector).parent().length;
        /* find Parent or VIP */
        var deployException = $(deploySelector).closest("div.list-wrapper").find(exceptionSelector).find(groupASelector).length;
        finalGroupAMap.set("Deployment", deployIP - deployBlocked - deployException);

        finalGroupAMap.forEach(printGroupAWIP);

        completeWipHtml = completeWipHtml + "</div>";
        completeWipHtml = completeWipHtml + "<div id='actualGroupBWIP' style='color: grey; background-color: #e6e600; margin: 3px; padding: 3px; border-radius: 25px' align='middle'>Group B WIP (Max. 6 for each): ";

        var finalGroupBMap = new Map();

        analysisIP = $(analysisSelector).closest("div.list-wrapper").find(groupBSelector).length;
        /* find blocker but excluding Parent & VIP (Exception) */
        analysisBlocked = $(analysisSelector).closest("div.list-wrapper").find(notExceptionSelector).find(groupBSelector).parent().find(blockedSelector).parent().length;
        /* find Parent or VIP */
        analysisException = $(analysisSelector).closest("div.list-wrapper").find(exceptionSelector).find(groupBSelector).length;
        finalGroupBMap.set("Analysis", analysisIP - analysisBlocked - analysisException);

        devIP = $(devSelector).closest("div.list-wrapper").find(groupBSelector).length;
        /* find blocker but excluding Parent & VIP (Exception) */
        devBlocked = $(devSelector).closest("div.list-wrapper").find(notExceptionSelector).find(groupBSelector).parent().find(blockedSelector).parent().length;
        /* find Parent or VIP */
        devException = $(devSelector).closest("div.list-wrapper").find(exceptionSelector).find(groupBSelector).length;
        finalGroupBMap.set("Development", devIP - devBlocked - devException);

        qaIP = $(qaSelector).closest("div.list-wrapper").find(groupBSelector).length;
        /* find blocker but excluding Parent & VIP (Exception) */
        qaBlocked = $(qaSelector).closest("div.list-wrapper").find(notExceptionSelector).find(groupBSelector).parent().find(blockedSelector).parent().length;
        /* find Parent or VIP */
        qaException = $(qaSelector).closest("div.list-wrapper").find(exceptionSelector).find(groupBSelector).length;
        finalGroupBMap.set("QA", qaIP - qaBlocked - qaException);

        deployIP = $(deploySelector).closest("div.list-wrapper").find(groupBSelector).length;
        /* find blocker but excluding Parent & VIP (Exception) */
        deployBlocked = $(deploySelector).closest("div.list-wrapper").find(notExceptionSelector).find(groupBSelector).parent().find(blockedSelector).parent().length;
        /* find Parent or VIP */
        deployException = $(deploySelector).closest("div.list-wrapper").find(exceptionSelector).find(groupBSelector).length;
        finalGroupBMap.set("Deployment", deployIP - deployBlocked - deployException);

        finalGroupBMap.forEach(printGroupBWIP);

        completeWipHtml = completeWipHtml + "</div>";

        /*
            (1)
            Remove elements at once
            Append elements at once
            (2)
            Remove & Append only when there is change
        */

        if (prevCompleteWipHtml != completeWipHtml) {
            console.log("Update WIP!");
            $("#actualWIP").remove();
            $("#actualGroupAWIP").remove();
            $("#actualGroupBWIP").remove();
            $(".board-header-btns.mod-left").first().after(completeWipHtml);
        }

        /*
            Refresh data
        */
        setTimeout(function(){ printWIP(); }, 5000);
    }
    printWIP();

    function markdownAll() {
    var cards = document.getElementsByClassName('list-card-title');
    for (var i = 0; i < cards.length; i++) {
        cards[i].innerHTML = cards[i].innerHTML
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/~~(.+?)~~/g, '<strike>$1</strike>')
            .replace(/\`(.+?)\`/g, '<code>$1</code>');
    }
    setTimeout(markdownAll, 5000);
    }
    markdownAll();
});