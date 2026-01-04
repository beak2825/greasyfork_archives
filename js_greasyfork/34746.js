// ==UserScript==
// @name         Velocity Planning for Jira Scrum Boards
// @namespace    http://tampermonkey.net/
// @version      0.1.16
// @description  Velocity Planning for Jira Scrum Sprints Boards
// @author       litodam
// @match        https://*.atlassian.net/secure/RapidBoard.jspa*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34746/Velocity%20Planning%20for%20Jira%20Scrum%20Boards.user.js
// @updateURL https://update.greasyfork.org/scripts/34746/Velocity%20Planning%20for%20Jira%20Scrum%20Boards.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    var addSubtotal = true,
        addBackgroundColor = false,
        addStyleToLabels = true,
        currentBoardId,
        capacityLocalStorageItemName,
        initialCapacity,
        showExtraFieldsLocalStorageItemName,
        initialShowExtraFieldsValue,
        showSprintTimeTrackingTotals = true;


    function loadDataFromStorage() {
        currentBoardId = window.location.href.toLowerCase().split("rapidview=")[1].split("&")[0];

        capacityLocalStorageItemName = 'vp-capacity-lastUsed-' + currentBoardId;
        initialCapacity = window.localStorage.getItem(capacityLocalStorageItemName) || 40;

        showExtraFieldsLocalStorageItemName = 'vp-showExtraFields-lastUsed-' + currentBoardId;
        initialShowExtraFieldsValue = window.localStorage.getItem(showExtraFieldsLocalStorageItemName) || false;
    }
    
    function registerControls() {
        console.log('TM-VP: registering controls...');
        if ($("#vp-controls-container").length === 0) {
            
            // add Capacity input
            var capacityControl = "<div id='vp-controls-container' style='bottom: 15%; position: absolute; left: 65%; font-weight: bold;'>Velocity: <input type='text' id='vp-capacity' value='" + initialCapacity + "' style='width: 40px;margin-left: 5px;padding:2px;text-align: center;'>" +
                "<a href='#' id='vp-refresh' style='font-size: 12px; font-weight: normal; margin-left: 5px;'>refresh</a></div>";

            $("#ghx-view-selector").append(capacityControl);
            $("#vp-refresh").on("click", function() { doMagicJiraStuff(true); });
            console.log('TM-VP: capacity control added');

            var container = $("#vp-controls-container");

            // add ExtraFields control
            //if ($(".ghx-plan-extra-fields:visible").lenght > 0) {
                console.log('TM-VP: found extra fields');

                var extraFieldsControl = "<div style='float: left; font-weight: normal; margin-right: 20px;'><input type='checkbox' id='extraFieldsToggle' name='extraFieldsToggle' value='extraFieldsToggle' /><label for='extraFieldsToggle'>Show extra fields?</label></div>";

                container.prepend(extraFieldsControl);

                if (initialShowExtraFieldsValue) {
                    $('#extraFieldsToggle').prop('checked', true);
                }

                $('#extraFieldsToggle').change(toggleExtraFields);
            //}
        }
    }
    
    function doMagicJiraStuff(force) {
        // skip if in board but not in Backlog tab
        if ($(".subnavigator-title").text() !== "Backlog") {
            return;
        }

        loadDataFromStorage();
        registerControls();
        
        var capacity = $("#vp-capacity").val() || window.localStorage.getItem(capacityLocalStorageItemName) || 40;
        window.localStorage.setItem(capacityLocalStorageItemName, capacity);
        
        var sprints = $(".js-issue-list");
        var sprintsCount = sprints.length;
        
        console.log('TM-VP: found ' + sprintsCount + ' sprints');               
        
        sprints.css('width', '96%');

        sprints.each(function(index, value) { 
            // do not process the last one as it's the backlog
            if (index < sprintsCount -1) {
                var sprintIndex = index;
                console.log('TM-VP: processing sprint #' + sprintIndex);
                var sprint = $(value);

                // process only if not already processed
                if (!sprint.hasClass("TM-VP-processed") || force) {
                    sprint.addClass("TM-VP-processed");

                    // clear all issues first
                    sprint.find(".js-issue").css('background', '');

                    // remove any previous subtotal ballons
                    sprint.find(".issue-vp-subtotal").remove();

                    // process list of issues
                    var issues = sprint.find(".js-issue");
                    console.log('TM-VP: sprint #' + index + ' has #' + issues.length + ' issues');
                    var totalEstimate = 0,
                        totalSpent = 0,
                        totalRemaining = 0;
                    issues.each(function(index, value) {
                        var issue = $(value);
                        console.log('TM-VP: processing issue #' + index + ' from sprint #' + sprintIndex);

                        console.log('TM-VP: totalEstimate: ' + totalEstimate + ' capacity: ' + capacity);

                        // process estimate
                        var estimate = issue.find("span[title='Story Points']").text();
                        if (!estimate) {
                            estimate = issue.find("span[title='Estimation']").text();
                        }
                        if (!estimate) {
                            estimate = issue.find("span[title='Original Time Estimate']").text().replace("h", "");
                        }

                        if (estimate !== '-') {
                            console.log('TM-VP: adding to totalEstimate X = ' + estimate);
                            totalEstimate = totalEstimate + parseFloat(estimate);
                        }

                        if (addBackgroundColor && totalEstimate > capacity) {
                            issue.css('background', 'lightcoral');
                            var container = issue.find("div.ghx-items-container");
                            container.css('background', 'transparent');
                            container.children('span').css('background', 'transparent');
                        }

                        if (addSubtotal) {
                            var style = "style='position: absolute; background: lightblue; left: 100%; top: 8px; margin-left: 5px; padding: 2px; font-size: 11px; font-weight: bold; border-radius: 22px; margin-right: 5px;min-width: 14px; text-align: center;'";

                            if (totalEstimate > capacity) {
                                style = style.replace("lightblue", "lightcoral");
                            }

                            issue.append("<span class='issue-vp-subtotal' " + style + ">" + totalEstimate + "</span>");
                        }

                        if (showSprintTimeTrackingTotals) {
                            var spentElement = issue.find("span.ghx-extra-field[data-tooltip*='Time Spent']");
                            var spent = spentElement.text();
                            if (spent && spent !== "None") {
                                spent = spent.replace("h", "");
                                totalSpent = totalSpent + parseFloat(spent);

                                if (estimate && !isNaN(estimate)) {
                                    if(parseFloat(spent) > parseFloat(estimate)){
                                        spentElement.css("color", "red");
                                    }
                                }
                            }

                            var remaining = issue.find("span.ghx-extra-field[data-tooltip*='Remaining Estimate']").text();
                            if (remaining && remaining !== "None") {
                                remaining = remaining.replace("h", "");
                                totalRemaining = totalRemaining + parseFloat(remaining);
                            }
                        }

                        if (addStyleToLabels) {
                            var labels = issue.find("span.ghx-extra-field[data-tooltip*='Labels: needs']").css({"background-color": "lightcoral", "border-radius": "8px", "padding": "0 5px 0 5px"});
                        }
                    });

                    if (showSprintTimeTrackingTotals && (totalSpent > 0 || totalRemaining > 0)) {
                        var sprintHeader = sprint.prev();
                        sprintHeader.find(".vp-total-spent-container, .vp-total-remaining-container").remove();
                        var sprintHeaderSubtotalsTemplate = "<span class='vp-total-spent-container' style='margin-left: 20px; font-size: smaller; font-weight: bold;'>Total Spent: <span class='vp-total-spent-value' style='background: #9ee084; border-radius: 10px; padding: 3px;'>{totalSpent}h</span></span><span class='vp-total-remaining-container' style='margin-left: 20px; font-size: smaller; font-weight: bold;'>Total Remainig: <span class='vp-total-remaining-value' style='background: lightcoral; border-radius: 10px; padding: 3px;'>{totalRemaining}h</span></span>";
                        sprintHeader.append(sprintHeaderSubtotalsTemplate.replace('{totalSpent}', totalSpent).replace('{totalRemaining}', totalRemaining));
                    }
                }
                else {
                    console.log('TM-VP: skipping sprint  #' + sprintIndex + " as it's been already processed.");
                }
            }
        });

        toggleExtraFields();
    }

    function toggleExtraFields() {
        console.log('TM-VP: toggling extra fields...');
        var checkbox = $('#extraFieldsToggle');
        var extraFieldRows = $(".ghx-plan-extra-fields");

        if (extraFieldRows.length > 0) {
            if (checkbox.prop('checked')) {
                $(".ghx-row.ghx-plan-main-fields, .ghx-row.ghx-plan-extra-fields").css("margin-top", "0").css("margin-bottom", "0");
                extraFieldRows.show();

                window.localStorage.setItem(showExtraFieldsLocalStorageItemName, true);
            } else {
                $(".ghx-row.ghx-plan-main-fields, .ghx-row.ghx-plan-extra-fields").css("margin-top", "5px").css("margin-bottom", "5px");
                extraFieldRows.hide();

                window.localStorage.setItem(showExtraFieldsLocalStorageItemName, false);
            }
        }
    }

    
    // register global ajax handler
    $(document).ajaxSuccess(function() {
        doMagicJiraStuff();
    });
        
    document.addEventListener('keyup', function(event) {        
        var code = event.keyCode || event.which;
        console.log("TM-VP: captured key: " + code);
        switch(code) {
            case 117:
                // F6
                event.preventDefault();
                console.log("TM-VP: handling F6...");
                doMagicJiraStuff();

                break;
        }
    });
    
    doMagicJiraStuff();

})();