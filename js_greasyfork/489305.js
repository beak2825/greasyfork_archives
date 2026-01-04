// ==UserScript==
// @name           Improved Ticket Worked Checker
// @namespace      http://www.plus.net
// @include        https://workplace.plus.net/reports/tickets/open_tickets_report.html?strAction=breakdown&intPartnerID=0&strCallCentre=*
// @version        9.0
// @require        https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @require        https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js
// @author         Rob Mead (edited by Rob Clayton)
// @description    Improvement to Rob Mead's ticket worked checker, adding a button that inserts the current date, a button to copy the output to the clipboard, a reset feature, loading indicator, result highlighting, and a toggle to enable/disable the highlights dynamically.
// @downloadURL https://update.greasyfork.org/scripts/489305/Improved%20Ticket%20Worked%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/489305/Improved%20Ticket%20Worked%20Checker.meta.js
// ==/UserScript==

function addJQuery(callback) {
    var script = document.createElement("script");
    script.setAttribute("src", "https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js");
    script.addEventListener('load', function() {
        var script = document.createElement("script");
        script.textContent = "(" + callback.toString() + ")();";
        document.body.appendChild(script);
    }, false);
    document.body.appendChild(script);
}

function main() {
    $("head").append(
        '<link href="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/cupertino/jquery-ui.css" rel="stylesheet" type="text/css">'
    );

    // CSS for the loading spinner and result highlights
    var spinnerStyle = `
        <style>
            #loadingSpinner {
                display: none;
                position: fixed;
                z-index: 1000;
                left: 50%;
                top: 50%;
                width: 50px;
                height: 50px;
                margin: -25px 0 0 -25px;
                border: 8px solid rgba(0, 0, 0, 0.1);
                border-top: 8px solid #000;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            .yes-result {
                color: green;
                font-weight: bold;
            }
            .no-result {
                color: red;
                font-weight: bold;
            }
             #runReport {
                background-color: #4CAF50; /* Green */
                border: none;
                color: white;
                padding: 5px 5px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 11px;
                margin: 4px 2px;
                cursor: pointer;
                border-radius: 8px;
            }
            #runReport:hover {
                background-color: #45a049; /* Darker green */
                 }
            #resetReport {
                background-color: red;
                border: none;
                color: white;
                padding: 5px 5px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 11px;
                margin: 4px 2px;
                cursor: pointer;
                border-radius: 8px;
            }
            #resetReport:hover {
                background-color: #FFC0CB; /* Pink */
            }
            #currentDateBtn {
                background-color: #3498db; /* Blue */
                border: none;
                color: white;
                padding: 5px 5px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 11px;
                margin: 4px 2px;
                cursor: pointer;
                border-radius: 8px;
            }
            #currentDateBtn:hover {
                background-color: #2980b9; /* Darker blue */
            }
            #copyWorkedColumn {
                background-color: #FFD700; /* Gold */
                border: none;
                color: black;
                padding: 5px 5px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 11px;
                margin: 4px 2px;
                cursor: pointer;
                border-radius: 8px;
            }
            #copyWorkedColumn:hover {
                background-color: #FFC107; /* Darker Gold */
            }
        </style>
    `;
    $('head').append(spinnerStyle);

    var content = '<table id="headTable"><tbody>\
                    <tr>\
                        <td><span>Tickets</span></td>\
                        <td><span>Advisor</span></td>\
                        <td><span>Date</span></td>\
                    </tr>\
                    <tr>\
                        <td><textarea id="ticketList" style="height:20px;width:200px;"></textarea></td>\
                        <td><textarea id="advisor" style="height:20px;width:200px;"></textarea></td>\
                        <td><input type="text" id="ticketdate" style="height:20px;width:200px;"></input><button id="currentDateBtn">Insert Current Date</button></td>\
                        <td><input type="button" id="runReport" value="Run Report"></input></td>\
                        <td><input type="button" id="resetReport" value="Reset" style="background-color: red; color: white;"></input></td>\
                    </tr>\
                    <tr>\
                        <td colspan="5"><input type="checkbox" id="toggleHighlight"> Enable/Disable Highlighting</td>\
                    </tr>\
                </tbody></table>\
                <hr></hr>\
                <div id="results">\
                    <table><tbody id="resultTable" style="border-bottom: 1px solid #ddd; padding:10px;">\
                        <tr>\
                            <th style="width:200px;">Ticket</th>\
                            <th style="width:200px;">Worked That Day?</th>\
                            <th style="width:200px;">Worked By This Advisor?</th>\
                            <td id="runCell" style="display:none;"><input id="copyWorkedColumn" type="button" value="Copy Worked Column"></input></td>\
                        </tr>\
                    </tbody></table>\
                </div>\
                <div id="loadingSpinner"></div>';

    $('.table-header').get(0).innerHTML = $('.table-header').get(0).innerHTML + '<input type="button" value="Create Table" id="makeTable"></input>';

    var makeButton = $('body').find('#makeTable').get(0);
    makeButton.addEventListener("click", function() {
        $('body').find('table').remove();
        $('body').append(content);

        var runButton = $('#runReport').get(0);
        runButton.addEventListener("click", function() {
            var ticketLines = $('#ticketList').val().split(/\n/);
            var tickets = [];
            for (var i = 0; i < ticketLines.length; i++) {
                if (/\S/.test(ticketLines[i])) {
                    tickets.push($.trim(ticketLines[i]));
                }
            }

            var selectdate = $("body").find("#ticketdate").get(0).value;
            if (selectdate === "") {
                alert("Please enter a date before running the report.");
                return;
            }

            // Show the loading spinner when the report starts
            $("#loadingSpinner").show();

            for (var i = 0; i < tickets.length; i++) {
                $("#resultTable").append('<tr style="border-bottom: 1px solid #ddd;" id="' + tickets[i] + '">\
                            <td style="border-bottom: 1px solid #ddd;" align="center" name="ticketName"><a href="https://workplace.plus.net/tickets/ticket_show.html?ticket_id=' + tickets[i] + '" target="_blank" >' + tickets[i] + '</a></td>\
                            <td style="border-bottom: 1px solid #ddd;" align="center" name="workedDay"></td>\
                            <td style="border-bottom: 1px solid #ddd;" align="center" name="workAdvisor"></td>\
                        </tr>');
            }
            $("#runCell").get(0).style.display = "block";

            // Run the report after creating the table
            runReport();
        });

        var copyWorkedColumnButton = $('#copyWorkedColumn').get(0);
        copyWorkedColumnButton.addEventListener("click", function() {
            var workedColumnText = "";
            $('td[name="workedDay"]').each(function() {
                workedColumnText += $(this).text() + "\n"; // New line separated values
            });

            // Copy to clipboard
            navigator.clipboard.writeText(workedColumnText)
                .catch(err => {
                    console.error('Failed to copy: ', err);
                });
        });

        // Add event listener for inserting current date
        $('#currentDateBtn').click(function() {
            var currentDate = new Date();
            var day = currentDate.getDate();
            var month = currentDate.getMonth() + 1; // Months are zero indexed
            var year = currentDate.getFullYear().toString().substr(-2); // Last two digits of year
            var formattedDate = ("0" + day).slice(-2) + "/" + ("0" + month).slice(-2) + "/" + year;
            $('#ticketdate').val(formattedDate);
        });

        // Add event listener for resetting the report
        $('#resetReport').click(function() {
            resetReport();
        });

        // Add event listener for toggling the highlights
        $('#toggleHighlight').change(function() {
            toggleHighlighting();
        });

        function resetReport() {
            $('#ticketList').val('');             // Clear ticket input
            $('#advisor').val('');                // Clear advisor input
            $('#ticketdate').val('');             // Clear date input
            $('#resultTable').find('tr:gt(0)').remove(); // Remove all rows except the header
            $("#runCell").get(0).style.display = "none"; // Hide the "Copy Worked Column" button
            $('#toggleHighlight').prop('checked', false); // Uncheck the highlight toggle
        }

        function toggleHighlighting() {
            var highlightEnabled = $('#toggleHighlight').prop('checked');

            $('td[name="workedDay"], td[name="workAdvisor"]').each(function() {
                var cellText = $(this).text().trim();

                // Remove previous highlight classes
                $(this).removeClass("yes-result no-result");

                if (highlightEnabled) {
                    if (cellText === "Yes") {
                        $(this).addClass("yes-result"); // Add green highlight for "Yes"
                    } else if (cellText === "No") {
                        $(this).addClass("no-result"); // Add red highlight for "No"
                    } else if (cellText === "Error") {
                        $(this).addClass("no-result"); // Highlight "Error" as red
                    }
                }
            });
        }

        function runReport() {
            $('td[name="ticketName"]').each(function() {
                var questionID = $(this).text().trim();
                var questionID2 = "https://workplace.plus.net/tickets/ticket_show.html?ticket_id=" + questionID;
                var workedThatDay = $('tr[id="' + questionID + '"]').children('td[name="workedDay"]').get(0);
                var workedThatAdvisor = $('tr[id="' + questionID + '"]').children('td[name="workAdvisor"]').get(0);
                var selectdate = $("body").find("#ticketdate").get(0).value;
                var selectAdvisor = $("body").find("#advisor").get(0).value;

                $.ajax({
                    url: questionID2,
                    type: 'GET',
                    async: true,
                    success: function(data) {
                        data = "<div>" + data + "</div>";
                        var highlightEnabled = $('#toggleHighlight').prop('checked');
                        if ($("tr td:first-child:contains('" + selectdate + "'):not(:contains('Automated process'))", data).length > 0) {
                            workedThatDay.innerHTML = "Yes";
                            if (highlightEnabled) {
                                workedThatDay.classList.add("yes-result"); // Add green highlight for "Yes"
                            }
                        } else {
                            workedThatDay.innerHTML = "No";
                            if (highlightEnabled) {
                                workedThatDay.classList.add("no-result"); // Add red highlight for "No"
                            }
                        }
                        if ($("tr td:first-child:contains('" + selectdate + "'):contains('" + selectAdvisor + "')", data).length > 0) {
                            workedThatAdvisor.innerHTML = "Yes";
                            if (highlightEnabled) {
                                workedThatAdvisor.classList.add("yes-result"); // Add green highlight for "Yes"
                            }
                        } else {
                            workedThatAdvisor.innerHTML = "No";
                            if (highlightEnabled) {
                                workedThatAdvisor.classList.add("no-result"); // Add red highlight for "No"
                            }
                        }

                        // Hide the spinner once all tickets are processed
                        if ($('td[name="workedDay"]:empty').length === 0) {
                            $("#loadingSpinner").hide();
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error('Error fetching data for ticket ' + questionID + ': ' + error);
                        workedThatDay.innerHTML = "Error";
                        if (highlightEnabled) {
                            workedThatDay.classList.add("no-result"); // Highlight "Error" as red
                        }
                        workedThatAdvisor.innerHTML = "Error";
                        if (highlightEnabled) {
                            workedThatAdvisor.classList.add("no-result"); // Highlight "Error" as red

                            // Hide the spinner in case of error
                            if ($('td[name="workedDay"]:empty').length === 0) {
                                $("#loadingSpinner").hide();
                            }
                        }
                    }
                });
            });
        }
    }, false);
}

addJQuery(main);
