// ==UserScript==
// @name         Dev_Multi_Open2
// @namespace    http://phi.pf-control.de/apps/userscripts
// @version      1.5
// @description  Easier Opening in Deviantart Notification Center
// @author       Dediggefedde
// @match        https://www.deviantart.com/notifications/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      http://ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/jquery-ui.min.js
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/391702/Dev_Multi_Open2.user.js
// @updateURL https://update.greasyfork.org/scripts/391702/Dev_Multi_Open2.meta.js
// ==/UserScript==
/* globals $*/
// make IDE recognise $ from jquery

(function() {
    "use strict";

    //class names, may need updates when template changes
    let selectees = "" + //things that drag can select
        "section._3fxzN._3q1dq ," + //watch thumbs
        "div._1AEwc"; //notification entries
    let topBar = "div._1MpFZ._3DiMC._65VTy._2Jm2O > div._1MpFZ._3DiMC";
    let selectedEl = "._1S1FT"; //selected entries
    let viewAllBut = "a._25AwR._2gSAL._2aAuV._31fTQ._1dZ7P"; //._3xVcb._1KcL_._21wpm"; //identify view-all-button
    let stackCount = "div.paUD_._1dZ7P"; //display of "# deviations" in a stack

    let selfTrg = false; //prevent self triggering
    let selContainer; //selection container

    //load JqueryUI style and
    //activate dynamic insertion (check every second for GUI changes)
    function prepareSite() {
        let scr = $("<link rel=\"stylesheet\" href=\"//code.jquery.com/ui/1.12.1/themes/smoothness/jquery-ui.css\">");
        scr.appendTo(document.head);
        let sty = $("<style type=\"text/css\"></style>");
        sty.append(".ui-selectable-helper{background-image:linear-gradient(rgb(0,255,0),rgb(0,100,0));opacity:0.3;}");
        sty.append(".dmo_openAll{top: 68%;}");
        sty.appendTo(document.head);

        scr.ready(function() {
            setInterval(dynamicInsertion, 1000);
        });
    }

    //selection/unselection event
    function selecting(ev, ui) {
        let target = $(ui.selecting);
        let select = true; //selecting or unselecting
        if (target.length == 0) {
            target = $(ui.unselecting);
            select = false;
        }

        selfTrg = true; //self trigger prevention by click on checkmark
        let el = target.find("input[type=checkbox]").parent(); //checkmark event trigger source: Container
        if (el.length > 0) { //trigger event wrong
            if (!select) {
                el.click(); //unselecting DOM (this causes self-trigger)
                if (ev == 0) {
                    target.removeClass("ui-selected").addClass("ui-unselecting");
                }
            } else {
                el.click(); //selecting DOM
                if (ev == 0) {
                    target.addClass("ui-selecting");
                }
            }
        }
        selfTrg = false;
    }

    //insert Open all Button
    function insertOpenButton() {
        if ($("button.dmo2_openTab").length > 0) {
            return; //identify top bar
        }
        //copy last button and change itto "open in tab"
        let btnOpen = $(topBar).find("button").last().clone().html("Open in new Tab").css("margin", "0px 15px").appendTo(topBar);
        $("button.eNvqE").addClass("_1BMgL"); //add space between buttons
        btnOpen.click(function() { //use url for normal case and script openALL button for stacks
            let els = $(selectees).filter(selectedEl);
            if (els.length > 5) {
                if (!confirm(`You are about to open ${els.length} Tabs. Proceed?`)) {
                    return;
                }
            }
            els.each(function() {
                if ($(this).attr("url") != undefined) {
                    window.open($(this).attr("url"));
                } else {
                    $(this).find("button.dmo_openAll").click();
                }
            });
        });
    }

    //recursive call to get all deviations in stack
    //results in open a new window for each element
    //called by "open all" button for stacks
    function getStackURLs(offset, userid, type) {
        return new Promise(function(resolve, reject) {
            GM.xmlHttpRequest({
                method: "GET",
                url: "https://www.deviantart.com/_napi/da-messagecentre/api/stack?stackId=uq:devwatch:tg%3D" + type + ",sender%3D" + userid + "&type=deviations&offset=" + offset + "&limit=24",
                onerror: function(response) {
                    reject(response);
                },
                onload: function(response) {
                    let resp = JSON.parse(response.responseText);
                    //response.results[0].deviation.url;

                    for (const el of resp.results) {
                        window.open(el.deviation.url);
                    }
                    if (resp.hasMore) {
                        resolve(getStackURLs(24, userid, type));
                    } else {
                        resolve(1);
                    }
                }
            });
        });
    }


    //called by "open all" button. calls getStackURL depending on type (deviation, polls etc.)
    function requestAllOpen(event) {
        event.preventDefault(); //prevent bubbling
        event.stopPropagation();

        let sender = $(event.target);
        let userid = sender.closest(selectees).find("a.user-link").attr("data-userid");

        switch (sender.attr("type")) {
            case "1":
                getStackURLs(0, userid, "deviations");
                getStackURLs(0, userid, "groupdeviations");
                break;
            case "2":
                getStackURLs(0, userid, "journals");
                break;
            case "3":
                getStackURLs(0, userid, "polls");
                break;
        }
    }

    //inserts button "Open all" calling requestAllOpen and sets its "type".
    function insertOpenAllButton() {
        let el = $("<button>Open All</button>").attr("dmo2_openAll", true).click(requestAllOpen);
        el.attr("class", $(viewAllBut).attr("class")).addClass("dmo_openAll");
        $(viewAllBut).parent().not("[dmo2_openAll]").attr("dmo2_openAll", true).append(el);

        $("button.dmo_openAll:not([type])").each(function() {
            let type = $(this).closest(selectees).find(stackCount).text();
            if (type.indexOf("Deviations") != -1) {
                $(this).attr("type", 1);
            } else if (type.indexOf("Journals") != -1) {
                $(this).attr("type", 2);
            } else if (type.indexOf("Polls") != -1) {
                $(this).attr("type", 3);
            } else {
                $(this).attr("type", 0);
            }
        })
    }

    //calls JQUERY UI to make things selectable
    //also inserts open-buttons
    function makeSelectable() {
        selContainer.selectable({ //jquery ui selectable
            filter: selectees,
            distance: 10, //allows clicking. deprecated, hopefully stays a while
            selecting: selecting, //during selection; select/unselect only regarding mark-area
            unselecting: selecting,
            cancel: "[contenteditable]"
        });

        $(selectees).find("label input").change(function(event) { //change selection by hand
            if (!selfTrg) {
                event.stopPropagation();
                let target = $(this).closest(selectees);
                let el = {};
                if (!target.hasClass(selectedEl)) {
                    el.unselecting = target;
                } else {
                    el.selecting = target;
                }
                selecting(0, el);
                selContainer.selectable("refresh");
                selContainer.data("ui-selectable")._mouseStop(null);
            }
        });
        insertOpenButton();
    }

    //called every second to check if UI has changed and selectable needs to be updated.
    //necessary for javascript navigation DA is using and endless pages.
    function dynamicInsertion() {
        $(selectees).not("[url]").each(function() { //href disappears for selected items. copy it beforehand
            $(this).attr("url", $(this).find("a[data-hook=\"deviation_link\"]").attr("href"));
        });
        insertOpenAllButton();
        if ($(selectees).not("[dmo2]").length == 0) {
            return; //only do if you have selectees without attribute
        }
        $(selectees).attr("dmo2", true);
        selContainer = $(selectees).parents("section").parent(); // $(selcont);
        makeSelectable();
    }

    //start call of script.
    prepareSite();
})();

/* deviantart API
https://www.deviantart.com/_napi/da-messagecentre/api/stack?stackId=uq:devwatch:tg%3Ddeviations,sender%3D4165994&type=deviations&offset=0&limit=24
stackId	uq:devwatch:tg=deviations,sender=4165994
type	deviations
offset	0
limit	24

response
response.results[0].deviation.url
response.counts.total
response.hasMore*/