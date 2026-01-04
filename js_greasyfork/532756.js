// ==UserScript==
// @name         TaxACT.com 1099-B TSV importer
// @namespace    http://tampermonkey.net/
// @version      2025-04-13
// @description  Import 1099-B items to TaxACT. Click on "Add entries" and paste your 1099-B items, one per line. Click "Done", and refresh the page to get started.
// @author       You
// @match        https://www.taxact.com/*
// @exclude      https://www.taxact.com/taxmanager/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=taxact.com
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://code.jquery.com/jquery-3.7.1.min.js#sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532756/TaxACTcom%201099-B%20TSV%20importer.user.js
// @updateURL https://update.greasyfork.org/scripts/532756/TaxACTcom%201099-B%20TSV%20importer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var scriptName = "taxAct1099bTsvImporter";
    console.log(scriptName, "Starting for URL ", location.href);
    if (typeof(window[scriptName]) !== "undefined") {
        console.log(scriptName, "Running a 2nd time... abort.");
        return;
    }

    function loadSettings() {
        var s = GM_getValue('settings', '{}');
        return JSON.parse(s);
    }

    function saveSettings(o) {
        GM_setValue('settings', JSON.stringify(o));
    }

    function addOptions() {
        var settings = loadSettings();
        var div = document.createElement("div");
        div.style = "position: absolute; top: 0px; right: 0px; z-index: 1000; background-color: white; border: 1px solid black; margin: 100px; padding: 10px;";
        var addLink = document.createElement("a");
        addLink.innerText = "Add entries";
        addLink.href="#";
        var textarea = document.createElement("textarea");
        textarea.style = "width: 1000px; height: 150px; display: block; padding: 5px;";
        var doneButton = document.createElement("input");
        doneButton.style = "margin: 10px;";
        doneButton.type = "button";
        doneButton.value = "Done";
        var dryRunDiv = document.createElement("div");
        var dryRunCheckBox = document.createElement("input");
        dryRunCheckBox.id = "dryRunCheckBox";
        dryRunCheckBox.name = "dryRunCheckBox";
        dryRunCheckBox.type = "checkbox";
        dryRunCheckBox.checked = ((typeof(settings.dryRun) === "undefined") ? true : !!settings.dryRun);
        var dryRunLabel = document.createElement("label");
        dryRunLabel.style = "display: inline-block; margin: 5px;";
        dryRunLabel.setAttribute("for", "dryRunCheckBox");
        dryRunLabel.innerText = "Dry-run (don't click any buttons, only fill out the forms)";
        dryRunDiv.appendChild(dryRunCheckBox);
        dryRunDiv.appendChild(dryRunLabel);
        addLink.onclick = function() {
            div.appendChild(textarea);
            div.appendChild(dryRunDiv);
            div.appendChild(doneButton);
            div.removeChild(addLink);
            if (settings.entries && settings.entries.length) {
                var entries = "";
                for (var i = 0; i < settings.entries.length; i++) {
                    entries += settings.entries[i].join("\t") + "\n";
                }
                textarea.value = entries;
            } else {
                textarea.value = "Delete this text and enter one 1099-B item per line, separated by 'tabs'. Example:\n" +
                    "Term and Type\tbox1a\tbox1b\tbox1c\tbox1d\tbox1e\towner (optional; must be exact match)\n" +
                    "B\tdescription and amount\tdate acquired or various\tdate sold\tsales proceeds\tcost\towner (optional; must be exact match)\n";
            }
            return false;
        };
        doneButton.onclick = function() {
            var entriesToSave = [];
            var entries = textarea.value.split("\n");
            for (var i = 0; i < entries.length; i++) {
                var entry = entries[i];
                if (!entry) {
                    continue;
                }
                var values = entry.split("\t");
                entriesToSave.push(values);
            }
            settings.entries = entriesToSave;
            settings.entryNumber = 0;
            settings.dryRun = !!dryRunCheckBox.checked;
            saveSettings(settings);
            div.removeChild(textarea);
            div.removeChild(dryRunDiv);
            div.removeChild(doneButton);
            div.appendChild(addLink);
        };
        div.appendChild(addLink);
        $("body").append(div);
    }
    var fixDate = function(str) {
        if (str.length == "00/00/00".length) {
            return str.substring(0, str.length - 2) + "20" + str.substring(str.length - 2);
        }
        if (str.toLowerCase() === "various") {
            return "Various";
        }
        return str;
    };
    var fixMoney = function(str) {
        str = str.split("$").join("").split(",").join("");
        var point = str.lastIndexOf(".");
        if (point == -1) {
            point = 0;
        } else {
            var fraction = str.substring(point + 1);
            str = str.substring(0, point);
            if (fraction.length == 1) {
                fraction = fraction + "0";
            } else {
                fraction = fraction.substring(0, 2);
            }
            point = parseInt(fraction, 10) >= 50 ? 1 : 0;
        }
        var whole = parseInt(str, 10) + point;
        var wholeStr = String(whole);
        var out = "";
        for (var i = wholeStr.length - 3; i > 0; i -= 3) {
            wholeStr = wholeStr.substring(0, i) + "," + wholeStr.substring(i);
        }
        return wholeStr;
    }

    function setRadio(selector, val) {
        var els = $(selector);
        for (var i = 0; i < els.length; i++) {
            var el = $(els[i]);
            if (el.text() === val) {
                $("input[type=radio]", el).click();
                return;
            }
        }
        console.log(scriptName, "Couldn't find value ", val, " in radio elements ", els);
    }

    var page1Loaded = function() {
        var settings = loadSettings();
        // console.log(scriptName, 'settings=', settings);
        addOptions();
        if (typeof(settings.entries) === "undefined" || settings.entryNumber >= settings.entries.length) {
            console.log(scriptName, "No entries to file. Last entry number ", settings.entryNumber);
            return;
        }
        var entry = settings.entries[settings.entryNumber];
        console.log(scriptName, "Input for entry ", settings.entryNumber, " out of ", settings.entries.length, ". Row: ", entry);
        if (entry.length < 5) {
            console.log(scriptName, "Not enough values in entry: ", entry);
            return;
        }
        setTermAndType(entry[0]);
        setTimeout(function() {
            $("div[data-responsive]:contains('1a. Description of Investment or Property') input[type=text]").val(entry[1]);
            $("div[data-responsive]:contains('1b. Date Acquired') input[type=text]").val(fixDate(entry[2]));
            $("div[data-responsive]:contains('1c. Date Sold or Disposed') input[type=text]").val(fixDate(entry[3]));
            $("div[data-responsive]:contains('1d. Sales Proceeds') input[type=text]").val(fixMoney(entry[4]));
            $("div[data-responsive]:contains('1e. Cost or Other Basis') input[type=text]").val(fixMoney(entry[5]));
            if (entry[6]) {
                setRadio("ta-icon-layout:contains('Ownership') div[class=radio-group]", entry[6]);
            }
            settings.entryNumber++;
            saveSettings(settings);
            scrollAndClick("#CONTINUE-ion-lbl");
        }, 1000 + (Math.random() * 1000));
    };

    function setTermAndType(letter) {
        var parent = $("div.row div.picklist:contains('Term and Type')");
        var lis = $("li", parent);
        for (var i = 0; i < lis.length; i++) {
            var text = $(lis[i]).text();
            if (!text) {
                text = "";
            }
            // Something like "B - Short-term transaction in which basis was NOT reported to the IRS"
            if (text.indexOf(letter + " - ") !== -1) {
                // Found it.
                $("input[type=text]", parent).val(text);
                return;
            }
        }
        console.log(scriptName, "Couldn't find term and type for letter ", letter);
    }

    function scrollAndClick(el) {
        console.log(scriptName, "Scrolling and clicking on element ", el);
        var e = $(el);
        if (e.length == 0) {
            console.log(scriptName, "Element not found ", el);
            return;
        }
        e.get(0).scrollIntoView();
        var settings = loadSettings();
        if (!settings.dryRun) {
            setTimeout(function() { e.click(); }, 300 + (Math.random() * 1000));
        }
    };

    var page2Loaded = function() {
        scrollAndClick("#CONTINUE-ion-btn");
    };

    var addMoreLoaded = function() {
        var settings = loadSettings();
        // console.log(scriptName, 'settings=',settings);
        if (typeof(settings.entries) === "undefined" || settings.entryNumber >= settings.entries.length) {
            console.log(scriptName, "No entries to file.");
            addOptions();
            return;
        }
        scrollAndClick("button:contains('Yes')");
    };

    var callPageFn = function(name, page) {
        setTimeout(function() {
            console.log(scriptName, "Calling function for page ", name);
            page.fn();
        }, 300 + (500 * Math.random()));
    };

    var pages = {
        page1: { title: "Enter the transaction details, one sale at a time", fn: page1Loaded },
        page2: { title: "Do any of the following apply to this sale", fn: page2Loaded },
        addMore: { title: "Do you need to add another sale from this 1099-B", fn: addMoreLoaded }
    };
    var currentPage = undefined;
    console.log(scriptName, "Starting main loop...");
    window[scriptName] = window.setInterval(function() {
        if (document.readyState !== "complete") {
            return;
        }
        var title = $("#question-title").text();
        // console.log(scriptName, "current page:", currentPage, "; title: ", title);
        for (var pageName in pages) {
            if (currentPage === pageName) {
                continue;
            }
            var page = pages[pageName];
            if (title.indexOf(page.title) !== -1) {
                console.log(scriptName, "From page ", currentPage, " to ", pageName, ". Title: ", title);
                currentPage = pageName;
                callPageFn(pageName, page);
            }
        }
    }, 200);
})();