// ==UserScript==
// @name         ylSuspPreview
// @namespace    http://tampermonkey.net/
// @version      0.5.2
// @description  Shows suspended players on scheduled/nierozegrane matches page
// @author       You
// @match        https://www.managerzone.com/?p=match&sub=scheduled
// @icon         https://www.google.com/s2/favicons?sz=64&domain=managerzone.com
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/468427/ylSuspPreview.user.js
// @updateURL https://update.greasyfork.org/scripts/468427/ylSuspPreview.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var lastDD;

    initListeners();

    $(document).ajaxComplete(function (event, xhr, settings) {
        if (settings.url.includes("return_bool")) { //MZ's ajax called after tactic change
             ShowSuspendedPlayers(lastDD);}
         else if(settings.url.includes("ajax.php?p=matches&sub=list&sport=soccer"))  // change comp type or time range
         {
             initListeners();
         }
    });

    function ShowSuspendedPlayers(dd) {
        if(!dd)
            return;

        var urlWithSlotId = dd.find('[onclick*="location.href"]').length > 0 ? dd.find('[onclick*="location.href"]:first').attr("onclick") : "";
        if (urlWithSlotId == "")
            return;
        var slotLetter = $("#" + extractSubstring(urlWithSlotId, "$('#", "').val()", false)).val();//

        var url = readAndTranformUrlFromButton(dd.find(".help_button:first"));

        $.ajax({
            url: url,
            type: 'GET',
            success: function (data) {
                var redRow = jQuery(extractSubstring(data, "<div", "');")).find("#tacticset" + slotLetter.toUpperCase() + " tr:has(td[style*='color: red'])");
                dd.prev(".susps").remove();
                var suspList = $("<dd class='susps'></dd>");
                redRow.each(function () {
                    var playerName = $(this).find("td:nth(1)").text();
                    playerName = playerName.split(' ')[1];
                    playerName = playerName ?? $(this).find("td:nth(1)").text();
                    var playerId = $(this).find("td:nth(0)").text();

                    suspList.append(playerId + "." + "<a href='https://www.managerzone.com/?p=tactics&save_tab=" + slotLetter + "'>" + playerName + "</a><br>");
                });
                dd.before(suspList);
            },
            error: function () {
                console.log('Error loading ' + url);
            }
        });
    };

    function readAndTranformUrlFromButton(btn) {
        var url = btn.attr("onclick");
        url = extractSubstring(url, "?p=tactics", "' +");
        url = "https://www.managerzone.com/ajax.php" + url.replace("availability", "tactics-availability") + "&sport=soccer";
        return url;
    }

    function unescapeHTML(htmlString) {
        var doc = new DOMParser().parseFromString(htmlString, "text/html");
        var docdoc = doc.documentElement.textContent;

        return docdoc;
    }

    function extractSubstring(source, start, end, withStart = true) {
        var startIndex = source.indexOf(start);
        if (startIndex === -1) {
            return ""; // Start not found in source
        }

        if (!withStart)
            startIndex += start.length;

        var endIndex = source.indexOf(end, startIndex);
        if (endIndex === -1) {
            return ""; // End not found in source
        }
        var returnreturn = source.substring(startIndex, endIndex);
        return returnreturn;
    }

    function initListeners(){

        //1
       setTimeout(function () {
        $(".invalidFixtureTactic").each(function () {   // for all red divs
ShowSuspendedPlayers($(this).parent());
        });
    }, 1500);

        //2
            $("#results-fixtures-wrapper select").change(function(){
        debugger;
     setTimeout(function () {
        $(".invalidFixtureTactic").each(function () {   // for all red divs
ShowSuspendedPlayers($(this).parent());
        });
    }, 1500);
    });

        //3
           $(".fixtureTacticListWrapper select").change(function () {
        var sel = $(this);
        lastDD = sel.closest("dd");
    });

    }


    // Your code here...
})();