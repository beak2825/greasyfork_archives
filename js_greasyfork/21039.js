// ==UserScript==
// @name       Hero Salesforce
// @namespace  http://herodigital.com/
// @version    1.2
// @description  Adds some functionality to Salesforce
// @match      https://*.salesforce.com/*
// @copyright  2016+, Ryan Brill
// @require    https://code.jquery.com/jquery-latest.min.js
// @require    https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.13.0/moment.min.js
// @require    https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.13.1/lodash.min.js
// @downloadURL https://update.greasyfork.org/scripts/21039/Hero%20Salesforce.user.js
// @updateURL https://update.greasyfork.org/scripts/21039/Hero%20Salesforce.meta.js
// ==/UserScript==

(function() {

    // Add > 0 option to the probability dropdown
    var $probabilitySelect = $(".reportRunPage #probability");
    $probabilitySelect.find("option").eq(10).before($('<option value="gt0">&gt; 0%</option>'));

    // Add Probability percentage and current month highlighting to Forecast table
    var $table = $(".reportRunPage .reportTable");

    if ($table.length) {

        var rows = $table.find("tr"),
            today = new Date(),
            thisMonth = today.getMonth()+1 + '/1/' + today.getFullYear(),
            num = 0;

        $(rows[1]).find('th,td').each(function(i, item) {
            if ($(item).text() == thisMonth) {
                num = i;
            }
        });

        $(rows).find('td:nth-child(' + (num+1) + ')').each(function(j, elem) {
            $(elem).css('background-color', '#87cbf0');
        });

        //grabs your SessionId from the cookies and set it so we can re-use it
        var session = document.cookie.match(/(^|;\s*)sid=(.+?);/)[2];

        var salesforceOpportunities = [];
        var recursiveAjax = function(apiCall) {
            var dfd = $.Deferred();

            $.ajax({
                type: "GET",
                url: apiCall,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', "OAuth " + session);
                    xhr.setRequestHeader('Accept', "application/json");
                },
                success: function(data) {
                    salesforceOpportunities = salesforceOpportunities.concat(data.records);
                    if (data.done == true) {
                        dfd.resolve(salesforceOpportunities);
                    } else {
                        recursiveAjax("https://na30.salesforce.com" + data.nextRecordsUrl).done(function(data) {
                            dfd.resolve(salesforceOpportunities);
                        });
                    }
                }
            });

            return dfd.promise();
        };

        recursiveAjax("https://na30.salesforce.com/services/data/v24.0/query/?q=SELECT+id,o.AccountId,a.name,o.Name,o.Probability+FROM+Opportunity+o,o.Account+a").then(function(data) {
            var currentAccount = '',
                currentOpportunity = '';

            // Add Probability cell to table
            $table.find("tr").each(function(i, item) {
                if ($(item).hasClass('headerRow')) {
                    if (i === 0) {
                        $(item).find("th:nth-child(2)").after('<th class="headerDark"></th>');
                    } else {
                        $(item).find("th:nth-child(3)").after('<th class="headerDark">Probability</th>');
                    }
                } else if ($(item).hasClass('dataRow')) {
                    if ($(item).find("td:nth-child(2)").html() != '&nbsp;') {
                        // Update the currentAccount
                        currentAccount = $(item).find("td:nth-child(2)").text();
                    }
                    // Update the currentAccount
                    currentOpportunity = $(item).find("td:nth-child(3)").text();
                    // Find the matching Opportunity and get the Probability

                    //$(item).find("td:nth-child(3)").after('<td>' + _.find(data, {'Name':currentOpportunity, 'Account': {'Name': currentAccount}}).Probability + '%</td>');

                    var probabilityText = "N/A";
                    if (_.find(data, {'Name':currentOpportunity, 'Account': {'Name': currentAccount}})) {
                        probabilityText = _.find(data, {'Name':currentOpportunity, 'Account': {'Name': currentAccount}}).Probability + '%';
                    }
                    $(item).find("td:nth-child(3)").after('<td>' + probabilityText + '</td>');

                } else if ($(item).hasClass('subTotalRow')) {
                    $(item).find("td:nth-child(3)").after('<td></td>');
                } else if ($(item).hasClass('grandTotalRow')) {
                    $(item).find("th:nth-child(2)").after('<td></td>');
                }
            });

            // Update floating header
            $("#floatingHeaderButtons").on("click", function() {
                $("#floatingHeader #fHeaderRow2").find("th:nth-child(3)").after('<th class="headerDark">Probability</th>');
            });

        });

    }

})();

(function() {

    // Create selector to find non-empty inputs
    $.extend($.expr[':'],{
        hasValue: function(el){
            return $(el).val() !== "";
        }
    });

    // Add buttons to increment / decrement month on revenue schedule
    var $table = $(".scheduleEdit .tabularEditElement");

    if ($table.length) {

        $table.find("tr.buttonRow:first td.buttonCell").append('<input value="- 1 Month" class="btn subtractMonth" name="pull" title="Pull" type="button">');
        $table.find("tr.buttonRow:first td.buttonCell").append('<input value="+ 1 Month" class="btn addMonth" name="push" title="Push" type="button">');
        $table.find(".addMonth").on("click", function() {
            var rows = $table.find("tr.dataRow");

            $(rows).each(function(i, item) {
                var el = $(item).find(".dateInput input"),
                    dateVal = $(el).val();

                if (dateVal) {
                    $(el).val(moment(dateVal, "M/D/YYYY").add(1, 'M').endOf('month').format("M/D/YYYY"));
                }
            });
        });

        $table.find(".subtractMonth").on("click", function() {
            var rows = $table.find("tr.dataRow");

            $(rows).each(function(i, item) {
                var el = $(item).find(".dateInput input"),
                    dateVal = $(el).val();

                if (dateVal) {
                    $(el).val(moment(dateVal, "M/D/YYYY").subtract(1, 'M').endOf('month').format("M/D/YYYY"));
                }
            });
        });

        // Adjust revenue for last month as previous months change
        $table.find("tr.buttonRow:first td.buttonCell").append('<label><input type="checkbox" class="enableAutoAdjust" checked="checked"> Enable Auto Adjust</label>');
        var $revenueInputs = $table.find("tr td:nth-child(3) input"),
            convertToFloat = function(val) {
                return parseFloat(val.replace(/[^\d\.]/g, ""));
            };
        $revenueInputs.on("blur", function(e) {
            var projectTotal = $("td.CurrencyElement").text(),
                scheduleTotal = 0,
                filledInputs = $table.find("tr td:nth-child(3) input:hasValue"),
                lastInput;
            if (!$(".enableAutoAdjust").prop('checked')) {
                return;
            }
            projectTotal = convertToFloat(projectTotal);
            $revenueInputs.each(function(i, item) {
                if ($(item).val()) {
                    scheduleTotal += convertToFloat($(item).val());
                }
            });

            // Editing the last input
            if (e.target == filledInputs[filledInputs.length - 1]) {
                lastInput = $table.find("tr td:nth-child(3) input:eq(" + filledInputs.length + ")");
                lastInput.val(projectTotal - scheduleTotal);
                $table.find("tr.dataRow:eq(" + filledInputs.length + ") .dateInput input").val(moment($("tr.dataRow:eq(" + (filledInputs.length - 1) + ") .dateInput input").val()).add(1, 'M').endOf('month').calendar());
            } else {
                lastInput = filledInputs[filledInputs.length - 1];
                var lastVal = convertToFloat($table.find(lastInput).val()),
                    newLastVal = lastVal - (scheduleTotal - projectTotal);
                $table.find(lastInput).val(newLastVal);
            }

        });

    }

})();