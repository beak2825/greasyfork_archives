// ==UserScript==
// @name         BingoSync Tracker
// @namespace    malkierian.bingoSyncTracker
// @version      1.2.5
// @license      MIT
// @description  Provide various added functionality to BingoSync, including cell counters, difficulty indications, and cell hiding for better focus.
// @author       Malkierian
// @match        *.bingosync.com/room/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bingosync.com
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      https://code.jquery.com/ui/1.13.2/jquery-ui.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450935/BingoSync%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/450935/BingoSync%20Tracker.meta.js
// ==/UserScript==

(function() {
    window.colors = ["#FFFFFF", "#0061FF", "#19D700", "#D7C200", "#D74400", "#EA1616"];
    window.levels = ["unsorted", "vlow", "low", "med", "high", "vhigh"];
    clearGameSettings();
    window.game = "";
    let list = localStorage.getItem("list");
    if(list == null) {
        window.list = ["ShortSM64"];
        saveGameList();
    }
    else
        window.list = JSON.parse(list);
    window.list.sort();
    window.counters = {"slot1" : 0, "slot2" : 0, "slot3" : 0, "slot4" : 0, "slot5" : 0, "slot6" : 0, "slot7" : 0, "slot8" : 0, "slot9" : 0, "slot10" : 0, "slot11" : 0, "slot12" : 0, "slot13" : 0, "slot14" : 0, "slot15" : 0, "slot16" : 0, "slot17" : 0,
                  "slot18" : 0, "slot19" : 0, "slot20" : 0, "slot21" : 0, "slot22" : 0, "slot23" : 0, "slot24" : 0, "slot25" : 0};
    $.noConflict();
    jQuery(document).ready(function() {
        jQuery("#players-panel").parent().parent().parent().after('				\
                <div class="flex-col-content m-b-l"> \
                    <div class="panel panel-default fill-parent"> \
                        <div class="panel-heading"> \
							Advanced Tracker \
                        </div> \
                        <div class="panel-body panel-body-overflow-container"> \
                            <div id="tracker-panel"> \
                                <div style="font-size: 13px;"> \
										Current Game <button id="addGameBtn" class="btn btn-primary btn-sm">Add</button> \
									</div> \
									<div style="margin-top: 8px; text-align: center; color: #000000;"> \
										<select id="gameSelect"></select> \
									</div> \
                                    <input id="fileInput" type="file" style="display:none;" accept=".json" /> \
									<div style="margin-top: 8px; text-align: center"><button class="btn btn-primary" id="importBtn">Import</button><button class="btn btn-primary" id="exportBtn">Export</button></div> \
                                </div> \
                            </div> \
                        </div> \
                    </div> \
                </div>');
        var temp1 = jQuery("#settings-table").find("span[title]").text().replace(/[ .,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
        jQuery("#exportBtn").on("click", function(e) {
            exportGame();
        });
        jQuery("#addGameBtn").on("click", function(e) {
            let game = prompt("Enter custom game abbreviation, max 13 characters (don't add a game that exists on BingoSync)");
            if(game.length > 13)
                game.length = 13;
            window.list.push(game);
            window.game = game;
            window.list.sort();
            populateListSelect();
            clearGameSettings();
            localStorage.setItem("lastSelected", window.game);
            saveGameList();
        });
        jQuery("#importBtn").on("click", function(e) {
            jQuery("#fileInput").click();
        });
        jQuery("#fileInput").on("change", function(e) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener("load", (event) => {
                const result = event.target.result;
                importGame(result);
            });
            reader.readAsText(file);
        });
        setAndLoad(temp1);
        populateListSelect();
        jQuery("#gameSelect").on("change", function(e) {
            window.game = jQuery(this).find(":selected").val();
            localStorage.setItem("lastSelected", window.game);
            loadGame();
            applySettings();
        });
        jQuery(".board-cover").on("click", function() {
            applySettings();
        });
        jQuery('.square').bind('wheel', function(e){
            e.preventDefault();
            var slot = jQuery(this).attr("id");
            var container = jQuery(this).find(".text-container");
            if(window.event.shiftKey) {
                var square = container.text();
                var level = parseInt(container.attr("level"));
                if(e.originalEvent.deltaY < 0 || e.originalEvent.detail) {
                     if(level < 5) {
                         window[window.levels[level]].splice(window[window.levels[level]].indexOf(square), 1);
                         window[window.levels[level + 1]].push(square);
                         setColor(container, level + 1);
                         saveGame();
                    }
                }
                else {
                     if(level > 0) {
                         window[window.levels[level]].splice(window[window.levels[level]].indexOf(square), 1);
                         window[window.levels[level - 1]].push(square);
                         setColor(container, level - 1);
                         saveGame();
                    }
                }
            }
            else {
                if(e.originalEvent.deltaY < 0 || e.originalEvent.detail) {
                    counters[slot] += 1;
                }
                else{
                    if(counters[slot] > 0) {
                        counters[slot] -= 1;
                    }
                }
            }
            jQuery(this).find(".counter").text(counters[slot]);
        });
        jQuery(".square").bind("contextmenu", function(e) {
            if(window.event.altKey) {
                e.preventDefault();
                jQuery(this).find(".starred").addClass("hidden");
                if(jQuery(this).hasClass("jrb")) {
                    jQuery(this).removeClass("jrb");
                    jQuery(this).find(".counter").removeClass("hidden");
                    jQuery(this).find(".text-container").show();
                }
                else  {
                    jQuery(this).addClass("jrb");
                    jQuery(this).find(".counter").addClass("hidden");
                    jQuery(this).find(".text-container").hide();
                }
                return true;
            }
        });
    });
    function applySettings() {
        jQuery(".text-container").each(function(index) {
            if(jQuery(this).parent().find(".counter").length == 0)
                jQuery(this).parent().append('<div class="counter" style="float:left; margin-top: 80px;">0</div>');
            if(window.vlow.includes(jQuery(this).text()))
                jQuery(this).css("color", "#0061FF").attr("level", 1);
            else if(window.low.includes(jQuery(this).text()))
                jQuery(this).css("color", "#19D700").attr("level", 2);
            else if(window.med.includes(jQuery(this).text()))
                jQuery(this).css("color", "#D7C200").attr("level", 3);
            else if(window.high.includes(jQuery(this).text()))
                jQuery(this).css("color", "#D74400").attr("level", 4);
            else if(window.vhigh.includes(jQuery(this).text()))
                jQuery(this).css("color", "#EA1616").attr("level", 5);
            else {
                jQuery(this).css("color", "#FFFFFF").attr("level", 0);
                if(!unsorted.includes(jQuery(this).text())) {
                    window.unsorted.push(jQuery(this).text());
                    saveGame();
                }
            }
        });
    }
    function populateListSelect() {
        let select = jQuery("#gameSelect");
        select.children().remove();
        for(let i = 0; i < window.list.length; i++) {
            select.append("<option value='" + window.list[i] + "'>" + window.list[i] + "</option>");
        }
        select.val(window.game);
    }
    function setColor(square, lev) {
        square.css("color", colors[lev]).attr("level", lev);
    }
    function saveGameList() {
        localStorage.setItem("list", JSON.stringify(window.list));
    }
    function exportGame() {
        let exportObj = {
            game: window.game,
            unsorted: window.unsorted,
            veryLow: window.vlow,
            low: window.low,
            medium: window.med,
            high: window.high,
            veryHigh: window.vhigh
        };
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj, "\t", 2));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", "BingoSyncTracker-" + window.game + ".json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
/*         navigator.clipboard.writeText(JSON.stringify(exportObj), null, "\t").then(function () {
            alert('It worked! Do a CTRL - V to paste');
        }, function () {
            alert('Failure to copy. Check permissions for clipboard');
        }); */
    }
    function importGame(json) {
        let importObj = JSON.parse(json);
        clearGameSettings();
        window.game = importObj.game;
        window.unsorted = importObj.unsorted;
        window.vlow = importObj.veryLow;
        window.low = importObj.low;
        window.med = importObj.medium;
        window.high = importObj.high;
        window.vhigh = importObj.veryHigh;
        saveGame();
        setAndLoad(importObj.game);
    }
    function clearGameSettings() {
        window.unsorted = [];
        window.vlow = [];
        window.low = [];
        window.med = [];
        window.high = [];
        window.vhigh = [];
    }
    function setAndLoad(game) {
        if(window.list.includes(game)) {
            window.game = game;
            loadGame();
        }
        else if(game.search("Custom") == -1) {
            window.game = game;
            window.list.push(game);
            localStorage.setItem("list", JSON.stringify(window.list));
            saveGame();
        }
        else {
            window.game = "ShortSM64";
            let last = localStorage.getItem("lastSelected");
            if(last != null)
                window.game = last;
            loadGame();
            //TODO: game prompt
        }
    }
    function loadGame() {
        window.unsorted   = JSON.parse(localStorage.getItem(window.game + "-uns"));
        window.vlow       = JSON.parse(localStorage.getItem(window.game + "-vlow"));
        window.low        = JSON.parse(localStorage.getItem(window.game + "-low"));
        window.med        = JSON.parse(localStorage.getItem(window.game + "-med"));
        window.high       = JSON.parse(localStorage.getItem(window.game + "-high"));
        window.vhigh      = JSON.parse(localStorage.getItem(window.game + "-vhigh"));
        if (window.unsorted == null) {
            clearGameSettings();
        }
    }
    function saveGame() {
        localStorage.setItem(window.game + "-uns",   JSON.stringify(window.unsorted));
        localStorage.setItem(window.game + "-vlow",  JSON.stringify(window.vlow));
        localStorage.setItem(window.game + "-low",   JSON.stringify(window.low));
        localStorage.setItem(window.game + "-med",   JSON.stringify(window.med));
        localStorage.setItem(window.game + "-high",  JSON.stringify(window.high));
        localStorage.setItem(window.game + "-vhigh", JSON.stringify(window.vhigh));
    }
})();