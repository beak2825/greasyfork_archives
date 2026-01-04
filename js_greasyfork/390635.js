// ==UserScript==
// @name         Palkka.fi helper
// @namespace    sami@kankaristo.fi
// @version      0.5.1
// @description  Auto-fill Palkka.fi forms.
// @author       sami@kankaristo.fi
// @match        https://www.palkka.fi/*
// @grant        none
// @require      https://greasyfork.org/scripts/405927-utillibrary/code/UtilLibrary.js
// @downloadURL https://update.greasyfork.org/scripts/390635/Palkkafi%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/390635/Palkkafi%20helper.meta.js
// ==/UserScript==


Util.LOGGING_ID = "Palkka.fi helper";

const hourlySalary = "15,00";


///
/// Convert a date to a (Finnish) date string.
///
function DateToString(date) {
    return (
        date.getDate()
        + "."
        + (date.getMonth() + 1)
        + "."
        + date.getFullYear()
    );
}


///
/// Fill the form.
///
function FillForm() {
    //Util.Log("FillForm()");
    
    /***************/
    /* Palkkakausi */
    /***************/
    
    var now = new Date();
    var firstDayOfTheMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
    );
    var lastDayOfTheMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0
    );
    var lastWeekDayOfTheMonth = new Date(lastDayOfTheMonth);
    
    // Damn Americans, the week does not start on a Sunday
    if (lastWeekDayOfTheMonth.getDay() == 0) {
        lastWeekDayOfTheMonth.setDate(lastWeekDayOfTheMonth.getDate() - 2);
    }
    else if (lastWeekDayOfTheMonth.getDay() == 6) {
        lastWeekDayOfTheMonth.setDate(lastWeekDayOfTheMonth.getDate() - 1);
    }
    
    var startDay = DateToString(firstDayOfTheMonth);
    var endDay = DateToString(lastDayOfTheMonth);
    var payDay = DateToString(lastWeekDayOfTheMonth);
    
    var startDayInput = document.querySelector("input[name=txtPalkkakausiAlkaa]");
    if ((startDayInput != null) && startDayInput.value == "") {
        Util.Log("firstDayOfTheMonth: ", firstDayOfTheMonth);
        Util.Log("startDay: ", startDay);
        Util.Log("startDayInput: ", startDayInput);
        startDayInput.value = startDay;
        Util.Log("startDayInput.value: ", startDayInput.value);
    }
    
    var endDayInput = document.querySelector("input[name=txtPalkkakausiLoppuu]");
    if ((endDayInput != null) && endDayInput.value == "") {
        Util.Log("lastDayOfTheMonth: ", lastDayOfTheMonth);
        Util.Log("endDay: ", endDay);
        Util.Log("endDayInput: ", endDayInput);
        endDayInput.value = endDay;
        Util.Log("endDayInput.value: ", endDayInput.value);
    }
    
    var payDayInput = document.querySelector("input[name=txtPalkkapaiva]");
    if ((payDayInput != null) && payDayInput.value == "") {
        Util.Log("lastWeekDayOfTheMonth: ", lastWeekDayOfTheMonth);
        Util.Log("payDay: ", payDay);
        Util.Log("payDayInput: ", payDayInput);
        payDayInput.value = payDay;
        Util.Log("payDayInput.value: ", payDayInput.value);
    }
    
    
    /************************/
    /* Tuntipalkka (Tuukka) */
    /************************/
    
    var employeeText = document.querySelector("#lblUserAreaTitle")?.textContent;
    if (employeeText?.includes("Tuukka Aro")) {
        var salaryTypeSelect = document.querySelector("select[name=cboVaihtoehdot]");
        // Find "Tuntipalkka" and select it
        var options = salaryTypeSelect?.options || [];
        var tuntipalkka = null;
        for (var i = 0; i < options.length; ++i) {
            var option = options[i];
            if (option.textContent == "Tuntipalkka") {
                tuntipalkka = option;
                salaryTypeSelect.selectedIndex = i;
            }
        }
        
        if ((tuntipalkka != null) && salaryTypeSelect?.options?.[salaryTypeSelect?.selectedIndex]?.text == "Tuntipalkka") {
            var hourlySalaryInput = document.querySelector("input[name=txtAHinta]");
            if ((hourlySalaryInput != null) && hourlySalaryInput.value == "") {
                Util.Log("hourlySalaryInput: ", hourlySalaryInput);
                hourlySalaryInput.value = hourlySalary;
                Util.Log("hourlySalaryInput.value: ", hourlySalaryInput.value);
            }
        }
    }
}


(
    function () {
        "use strict";
        
        setInterval(FillForm, 500);
    }
)();
