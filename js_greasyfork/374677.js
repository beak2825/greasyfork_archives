// ==UserScript==
// @name       LPis Script
// @version    1.0.1
// @description  Scipt that automatically registers you, when using the LPis System. Based on the TISS Quick Registration Script from Manuel Geier
// @match      https://lpis.wu.ac.at/*
// @copyright  Lorenz Kraus
// @require    http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @namespace https://greasyfork.org/users/227665
// @downloadURL https://update.greasyfork.org/scripts/374677/LPis%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/374677/LPis%20Script.meta.js
// ==/UserScript==

(function LPis() {
    var self = this;
    var options = {
        // global option to enable or disable the script [true,false]
        scriptEnabled: true,

        // only if the number is right, the script is enabled [String]
        nameOfGroup: "1195",

        // automatically presses the register button if it is available [true,false]
        autoRegister: true,

        // continuously refresh the page until the script can register you [true,false]
        autoRefresh: true,

        // let the script start at a specific time [true,false]
        startAtSpecificTime: true,

        // define the specific time the script should start [Date]
        // new Date(year, month, day, hours, minutes, seconds, milliseconds)
        // note: months start with 0
        specificStartTime: new Date(2019, 11 - 1, 22, 16, 59, 0, 0),

        // if a specific time is defined, the script will refresh some ms sooner to adjust a delay [Integer]
        delayAdjustmentInMs: 300,

        // show log output of the script on screen [true,false]
        showLog: true,

    };

    ///////////////////////////////////////////////////////////////////////


    self.init = function () {
        self.extendJQuery();
        self.LPisRegistration();
    };

    self.extendJQuery = function () {
        jQuery.fn.justtext = function () {
            return $(this).clone()
                .children()
                .remove()
                .end()
                .text().trim();
        };
    };

    self.LPisRegistration = function () {
        if (options.scriptEnabled) {
            self.pageLog("LPis Registration Script enabled");

            var groupLabel = self.doGroupCheck();
                    if (groupLabel !== null) {
                    self.highlight(groupLabel);
            }

            if (options.startAtSpecificTime) {
                self.pageLog("Scripts starts at: " + self.getFormatedDate(options.specificStartTime));
                self.pageLog("Delay adjustment in ms: " + options.delayAdjustmentInMs);
                self.startTimer(options.specificStartTime.getTime() - options.delayAdjustmentInMs);
            } else {
                self.analysePage();
            }

        } else {
            self.pageLog("LPis Registration Script disabled");
        }
    };

    self.startTimer = function (startTime) {
        var offset = startTime - new Date().getTime();
        if (offset > 0) {
            self.startRefreshTimer(startTime);
        } else {
            self.analysePage();
        }
    };

    self.startRefreshTimer = function (startTime) {
        self.printTimeToStart(startTime);

        var maxMillis = 2147483647;
        var offset = startTime - new Date().getTime();

        // prevent an overflow
        if (offset > maxMillis) {
            offset = maxMillis;
        }

        window.setTimeout(self.refreshPage, offset);
    };

    self.printTimeToStart = function (startTime) {
        var offset = (startTime - new Date().getTime()) / 1000;
        var out = "Refresh in: " + offset + " seconds";
        self.log(out);

        self.pageCountdown(out);

        window.setTimeout(function () {
            self.printTimeToStart(startTime);
        }, 1000);
    };

    self.refreshPage = function () {
        location.reload();
    };


    self.analysePage = function () {
        self.onGroupPage();
    }

    self.onGroupPage = function () {

        // getting group
        var groupLabel = self.doGroupCheck();
        if (groupLabel === null) {
            return;
        }
        self.highlight(groupLabel);

        var groupWrapper = groupLabel.closest('tr');

        // search for the registration button
        var regButton = self.getRegistrationButton(groupWrapper);


        // push the button
        if (regButton.length > 0 && self.getEnabled(groupWrapper)) {

            regButton.focus();

            if (options.autoRegister) {
                regButton.click();
                self.clickHighlight(regButton);
            }
        } else {
            if (self.getGroupCancelButton(groupWrapper).length > 0) {
                self.pageOut('you are registered in group: ' + options.nameOfGroup);
            } else {
                // Only refresh the page if the option is set and if the registration is not yet completed.
                if (options.autoRefresh) {
                    refreshPage();
                    //self.log('Refresh');
                }
            self.pageOut('no registration button found');
            }
        }

    };

    self.getEnabled = function (groupWrapper) {
        var enabled;

        enabled = $(groupWrapper).find("input:submit[disabled='disabled']");

        if (enabled.length === 0) {
            return true;
        }else{
            return false;
        }

    };

    //not a button
    self.getGroupCancelButton = function (groupWrapper) {
        var unregButton = "";

           if($(groupWrapper).find(".action a").text().trim() === "ABmelden"){
           unregButton = $(groupWrapper).find(".action a").text().trim();

        }
        return unregButton;
    };


    self.getRegistrationButton = function (groupWrapper) {
        var regButton;

        regButton = $(groupWrapper).find("input:submit[value='anmelden']");
        if (regButton.length === 0) {
            self.pageOut('registration button not found!');
        }

        return regButton;

    };

    self.doGroupCheck = function () {
        var groupLabel = self.getGroupLabel(options.nameOfGroup);
        if (groupLabel.length === 0) {
            self.pageOut('group not found error: ' + options.nameOfGroup);
            return null;
        } else {
            return groupLabel;
        }
    };


    self.getGroupLabel = function (nameOfGroup) {
        return $(".ver_id a").filter(function () {
            return $(this).text().trim() === nameOfGroup;
        });
    };


    self.highlight = function (object) {
        object.css("background-color", "lightgreen");
    };

    self.clickHighlight = function (object) {
        object.css("background-color", "red");
    };

    self.pageOut = function (text) {
        var out = self.getOutputField();
        out.text(text);
    };

    self.pageCountdown = function (text) {
        var out = self.getCountdownField();
        out.text(text);
    };

    self.pageLog = function (text) {
        self.appendToLogField(text);
    };

    self.getOutputField = function () {
        var outputField = $('#LPScriptOutput');
        if (outputField.length === 0) {
            self.injectOutputField();
            outputField = self.getOutputField();
        }
        return outputField;
    };

    self.getCountdownField = function () {
        var countdownField = $('#LPScriptCountdown');
        if (countdownField.length === 0) {
            self.injectCountdownField();
            countdownField = self.getCountdownField();
        }
        return countdownField;
    };

    self.getLogField = function () {
        var logField = $('#LPScriptLog');
        if (logField.length === 0) {
            self.injectLogField();
            logField = self.getLogField();
            if (options.showLog) {
                logField.show();
            } else {
                logField.hide();
            }
        }
        return logField;
    };

    self.injectOutputField = function () {
        var el = $('#ea_stupl');
        var log = $('#LPScriptLog');
        if (log.length) {
            el = log;
        }
        el.before('<div id="LPScriptOutput" style="color: red; font-weight: bold; font-size: 14pt; padding: 8px 0px;"></div>');
    };

    self.injectCountdownField = function () {
        var el = $('#ea_stupl');
        var log = $('#LPScriptLog');
        if (log.length) {
            el = log;
        }
        el.before('<div id="LPScriptCountdown" style="color: blue; font-weight: bold; font-size: 14pt; padding: 8px 0px;"></div>');
    };

    self.injectLogField = function () {
        $('#ea_stupl').before('<div id="LPScriptLog" style="color: black; background-color: #FFFCD9; font-size: 10pt;"><b>Information Log:</b></div>');
    };

    self.appendToLogField = function (text) {
        var log = self.getLogField();
        var newText = log.html() + "<br />" + text;
        log.html(newText);
    };

    self.getFormatedDate = function (date) {
        return "" + date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ":" + date.getMilliseconds();
    };

    self.log = function (message) {
        console.log(message);
    };

    // Initialize the script
    self.init();
})();
