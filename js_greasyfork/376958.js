// ==UserScript==
// @name Trello colouring (CSPL Reporting Solution)
// @namespace https://trello.com/
// @version 1.6
// @description Colour list for Scrum, referenced with Kanban Game
// @match https://trello.com/*
// @require http://code.jquery.com/jquery-latest.js
// @author       Angie
// @downloadURL https://update.greasyfork.org/scripts/376958/Trello%20colouring%20%28CSPL%20Reporting%20Solution%29.user.js
// @updateURL https://update.greasyfork.org/scripts/376958/Trello%20colouring%20%28CSPL%20Reporting%20Solution%29.meta.js
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
    var finalMap = new Map();
    var finalPairMap = new Map();
    
    function printOneMemberWIP() {
        var WIP_LIMIT = 3;
        for (let key of finalMap.keys()) {
            if (finalMap.get(key) == 0) {
                completeWipHtml = completeWipHtml + "<b style='color: orange'>" + key + ": " + finalMap.get(key) + " </b>";
            } else if (finalMap.get(key) > WIP_LIMIT) {
                completeWipHtml = completeWipHtml + "<b style='color: red'>" + key + ": " + finalMap.get(key) + " </b>";
            } else {
                completeWipHtml = completeWipHtml + key + ": " + finalMap.get(key) + " ";
            }

            if (finalPairMap.get(key) == 0) {
                completeWipHtml = completeWipHtml + "<b style='color: orange'>(" + finalPairMap.get(key) + ") , </b>";
            } else {
                completeWipHtml = completeWipHtml + "(" + finalPairMap.get(key) + ") , ";
            }
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

    function printWIP() {
        prevCompleteWipHtml = completeWipHtml;
        completeWipHtml = "";

        /*
            Common Selectors
        */
        var groupASelector = ".list-card.js-member-droppable.ui-droppable";

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

        finalMap.clear();
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

        /* Pair Count */

        finalPairMap.clear();
        for (var i in allMember) {
            finalPairMap.set(allMember[i], 0);
        }

        var normalPairMap = $(memberIPSelector)
        .closest("div.list-wrapper")
        .find("div.js-list-card-members")
        .filter(function(index) {
            return $("div.js-member-on-card-menu", this).length > 1;
        })
        .find("img.member-avatar")
        .map(function() {
            return this.alt.replace(/\(.+\)/, "");
        })
        .toArray()
        .reduce((acc, val) => acc.set(val, 1 + (acc.get(val) || 0)), new Map());

        var blockedPairMap = $(memberIPSelector)
        .closest("div.list-wrapper")
        .find("div.js-list-card-members")
        .filter(function(index) {
            return $("div.js-member-on-card-menu", this).length > 1;
        })
        .closest("a.list-card")
        .find(blockedSelector).parent()
        .closest("a.list-card")
        .find("img.member-avatar")
        .map(function() {
            return this.alt.replace(/\(.+\)/, "");
        })
        .toArray()
        .reduce((acc, val) => acc.set(val, 1 + (acc.get(val) || 0)), new Map());

        for (var [key, value] of finalPairMap.entries()) {
            var point = normalPairMap.get(key) === undefined ? 0 : normalPairMap.get(key);
            var blockedPoint = blockedPairMap.get(key) === undefined ? 0 : blockedPairMap.get(key);
            finalPairMap.set(key, point - blockedPoint);
        }
        
        /* Pair Count END */

        printOneMemberWIP();

        completeWipHtml = completeWipHtml + "</div>";

        /*
            Print Group WIP
        */
        completeWipHtml = completeWipHtml + "<div id='actualGroupAWIP' style='color: grey; background-color: yellowgreen; margin: 3px; padding: 3px; border-radius: 25px' align='middle'>WIP (Max. 5 for each): ";

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