// ==UserScript==
// @name         tModLoader Mod Browser Mirror Direct Mod List Tools
// @namespace    http://tampermonkey.net/
// @version      2.7.182818284590.45235
// @description  A script that adds a few things to mirror.sgkoi.dev's direct mod list page.
// @author       An Orbit
// @match        https://mirror.sgkoi.dev/direct*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sgkoi.dev
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470869/tModLoader%20Mod%20Browser%20Mirror%20Direct%20Mod%20List%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/470869/tModLoader%20Mod%20Browser%20Mirror%20Direct%20Mod%20List%20Tools.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var urlParams = new URLSearchParams(window.location.search);

    var isDark = urlParams.get("dark") !== null;

    var css = isDark ? `body {
  background-color: black;
  color: white;
}

input, select, option {
  background-color: black;
  border: 1px solid gray;
  color: white;
}

button {
  background-color: #888;
  border: 1px solid #444;
  color: white;
}

td, tbody td, #index td, #index > tbody > tr > td {
  border: 1px solid #888;
}

tr, tbody tr, #index tr, #index > tbody > tr {
  border: unset;
}

index {
  border-collapse: collapse;
}

input[type="checkbox"]:not(:checked) {
  filter: invert(1);
}

a {
  color: aqua;
}

.file.tmod, .file.pak, .file.jar { //sorry if you wanted to use this to analyze Lobotomy Corporation mods or something
  background-color: #030;
}

.file.locpack {
  background-color: #330;
}

.file.png {
  background-color: #003;
}

.file.zip {
  background-color: #033;
}

.file[class~="tar.gz"] {
  background-color: #032;
}

.file.txt {
  background-color: #222;
}

.file.random {
  background-color: #313;
}

.file.invalid-mod {
  background-color: #380000;
  text-decoration: line-through;
}
.file.invalid-mod a {
  text-decoration: line-through;
}` : `.file.tmod, .file.pak, .file.jar {
  background-color: #dfd;
}

.file.locpack {
  background-color: #ffc;
}

.file.png {
  background-color: #ddf;
}

.file.zip {
  background-color: #dff;
}

.file[class~="tar.gz"] {
  background-color: #dfe;
}

.file.txt {
  background-color: #dfdfdf;
}

.file.random {
  background-color: #fef;
}

.file.invalid-mod {
  background-color: #fab;
  text-decoration: line-through;
}
.file.invalid-mod a {
  text-decoration: line-through;
}`;

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');

    head.appendChild(style);

    style.type = 'text/css';
    if (style.styleSheet){
        // This is required for IE8 and below.
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    var months = [null, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    window.parseDate = function(dateStr) {
        dateStr = dateStr.split("/");
        dateStr[2] = dateStr[2].split(" ");
        dateStr = dateStr.flat();
        dateStr[0] = months[parseInt(dateStr[0])];
        dateStr[3] = dateStr[3].split(/(\d+|[AP]M)/).filter(function(t) { return (t.length > 0 && t !== ":") });
        dateStr[3] = dateStr[3].map(x => x.match(/^[AP]M$/) ? x : parseInt(x));
        if(dateStr[3][0] < 12 && dateStr[3][3] == "PM") {
            dateStr[3][0] += 12;
        } else if(dateStr[3][0] == 12 && dateStr[3][3] == "AM") {
            dateStr[3][0] -= 12;
        };
        dateStr[3].splice(3,1);
        dateStr[3] = dateStr[3].map(x => x.toString().padStart(2,"0")).join(":");
        dateStr = `${dateStr[2]} ${dateStr[0]} ${dateStr[1]} ${dateStr[3]}Z+00:00`;
        return new Date(dateStr);
    };
    var parseDate = window.parseDate;

    function createDropdown(optionsArray,id,classes) {
        var dropdown = document.createElement("select");
        for(var i in optionsArray) {
            var option = document.createElement("option");
            var data = optionsArray[i];
            if(data instanceof Array) {
                option.innerText = data[0];
                option.setAttribute("value",data[1]);
            } else {
                option.setAttribute("value",data);
                option.innerText = data;
            };
            dropdown.appendChild(option)
        };
        if(classes) {
            if(classes instanceof Array) {
                for(var j in classes) {
                    dropdown.classList.add(classes[j])
                }
            } else {
                dropdown.setAttribute("class",classes);
            };
        };
        if(id) {
            dropdown.setAttribute("id",id);
        };
        return dropdown
    };

    window.getValueFromInputById = function(inputId) {
        var input = document.getElementById(inputId);
        if(!input) {
            throw new Error(`Couldn't find any element with ID "${inputId}"`)
        };
        if([null,undefined].includes(input.value)) {
            throw new Error(`Couldn't find a value in element "${inputId}"`)
        };
        return input.value
    };
    var getValueFromInputById = window.getValueFromInputById;

    window.entries = [];

    window.modExtensions = [".tmod"]; //Opened to global scope for easier console-driven analysis of other mod lists

    window.invalidModArbitraryThreshold = 278;

    var rows = document.getElementsByTagName("tr");
    rows = Array.from(rows).filter(function(node) { return node.nodeType == 1 && node.childNodes.length > 6});

    for(var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var fileName = row.childNodes[1].innerText;
        var fileSize = parseInt(row.childNodes[3].innerText.replaceAll(",",""));
        var fileDate = parseDate(row.childNodes[5].innerText);
        var fileType = null;
        var isInvalidMod = null;
        var isMod = false;
        if(fileName.endsWith(".png")) {
            fileType = "image";
        } else if(fileName.endsWith(".locpack")) {
            fileType = "locpack";
        } else {
            fileType = "other";
        };
        for(var aa = 0; aa < window.modExtensions.length; aa++) {
            if(fileName.endsWith(window.modExtensions[aa])) {
                isMod = true;
                break //stop checking after the first valid extension
            }
        };
        if(isMod) {
            fileType = "mod";
            if(fileName.endsWith(".tmod") && fileSize < window.invalidModArbitraryThreshold) { //Only apply arbitrary invalid mod threshold to Terraria mods
                //for broken mod files of the format "No mod named 'Name' exists.", threshold is 255+23 because idk how to detect them
                row.classList.add("invalid-mod");
                isInvalidMod = true
            } else {
                isInvalidMod = false
            };
            row.classList.add("mod");
        };
        row.classList.add((fileName.match(/\.(tar\.gz|[^\.]*)$/) ?? [null,"no-extension"])[1]);
        window.entries.push({
            name: fileName,
            size: fileSize,
            date: fileDate,
            type: fileType,
            mod: isMod,
            invalidMod: isInvalidMod,
        });
    };
    var finalSize = window.entries.map(x => x.size).reduce(function(a,b){return a+b},0);

    window.sortOptions = [
        ["No sort", "none"],
        ["Date (Ascending)", "ascendingDate"],
        ["Date (Descending)", "descendingDate"],
        ["Size (Ascending)", "ascendingSize"],
        ["Size (Descending)", "descendingSize"],
        ["Name (Z-A)", "ascendingName"],
        ["Name (A-Z)", "descendingName"]
    ];
    var sortOptions = window.sortOptions;

    window.filterOptions = [
        ["No filter", "none"],
        ["Mods", "mod"],
        ["Images", "image"],
        ["Localization packs", "locpack"],
        ["Other", "other"]
    ];
    var filterOptions = window.filterOptions;

    window.sortFunctions = {
        ascendingDate: function(modEntry1,modEntry2) { return modEntry1.date.getTime() - modEntry2.date.getTime() },
        descendingDate: function(modEntry1,modEntry2) { return modEntry2.date.getTime() - modEntry1.date.getTime() },
        ascendingSize: function(modEntry1,modEntry2) { return modEntry1.size - modEntry2.size },
        descendingSize: function(modEntry1,modEntry2) { return modEntry2.size - modEntry1.size },
        ascendingName: function(modEntry1,modEntry2) { return modEntry2.name.localeCompare(modEntry1.name, "en-US") },
        descendingName: function(modEntry1,modEntry2) { return modEntry1.name.localeCompare(modEntry2.name, "en-US") }
    };
    var sortFunctions = window.sortFunctions;

    window._numberInputOnPress = function(event) {
        if(isNaN(this.value + String.fromCharCode(event.keyCode))) {
            return false
        };
    };

    window._numberInputOnUpdate = function(field) {
        var text = field.value;
        if((!text) && (text !== "")) {
            throw new Error("_numberInputOnUpdate: Could not find value in field")
        };
        var numbersOnly = text.replaceAll(/\D/g,"");
        field.value = numbersOnly
    };

    window.generateReport = function(entriesIn) {
        var totalSize = entriesIn.map(x => x.size).reduce(function(a,b){return a+b},0);
        return `Total items: ${entriesIn.length.toLocaleString()}; Total size: ${totalSize.toLocaleString()} B, Average size: ${(totalSize / entriesIn.length).toLocaleString(undefined, {maximumFractionDigits: 4})} B`
    };
    var generateReport = window.generateReport;

    var header = document.getElementsByTagName("header")[0];
        var report = document.createElement("p");
            report.setAttribute("id","reportText");
            report.innerText = generateReport(window.entries);
        header.appendChild(report);
        var sorter = document.createElement("p");
            sorter.setAttribute("id","sortAndFilter");
            var filterPicker = createDropdown(filterOptions,"filterPicker");
                filterPicker.setAttribute("title","Filter entries");
                sorter.appendChild(filterPicker);
            sorter.appendChild(document.createElement("br"));

            var sortPicker = createDropdown(sortOptions,"sortPicker");
                sortPicker.setAttribute("title","Sort entries");
                sorter.appendChild(sortPicker);
            sorter.appendChild(document.createElement("br"));

            var textFilter = document.createElement("input");
                textFilter.setAttribute("id","textFilter");
                textFilter.setAttribute("placeholder","File name filter");
                textFilter.setAttribute("title","Filter file names");
                sorter.appendChild(textFilter);
            sorter.appendChild(document.createTextNode(String.fromCharCode(160) + "Regex?: "));
            var tfRegexCheck = document.createElement("input");
                tfRegexCheck.setAttribute("type","checkbox");
                tfRegexCheck.setAttribute("id","textFilterIsRegexCheck");
                textFilter.setAttribute("title","Regex?");
                sorter.appendChild(tfRegexCheck);
            sorter.appendChild(document.createTextNode(String.fromCharCode(160) + "Case-insensitive?: "));
            var tfCaseCheck = document.createElement("input");
                tfCaseCheck.setAttribute("type","checkbox");
                tfCaseCheck.setAttribute("id","textFilterIsCiCheck");
                tfCaseCheck.setAttribute("title","Case-insensitive?");
                tfCaseCheck.setAttribute("checked","true");
                sorter.appendChild(tfCaseCheck);
            sorter.appendChild(document.createElement("br"));

            var sizeMin = document.createElement("input");
                sizeMin.setAttribute("id","sizeMinimum");
                sizeMin.setAttribute("placeholder","Minimum size (B)");
                sizeMin.setAttribute("title","Filter file names");
                sizeMin.setAttribute("type","number");
                sizeMin.setAttribute("min","0");
                sizeMin.addEventListener("keypress", window._numberInputOnPress);
                sizeMin.addEventListener("update", window._numberInputOnUpdate);
                sorter.appendChild(sizeMin);
            sorter.appendChild(document.createTextNode(String.fromCharCode(160)));
            var sizeMax = document.createElement("input");
                sizeMax.setAttribute("id","sizeMaximum");
                sizeMax.setAttribute("placeholder","Maximum size (B)");
                sizeMax.setAttribute("title","Filter file names");
                sizeMax.setAttribute("type","number");
                sizeMax.setAttribute("min","0");
                sizeMax.addEventListener("keypress", window._numberInputOnPress);
                sizeMax.addEventListener("update", window._numberInputOnUpdate);
                sorter.appendChild(sizeMax);
            sorter.appendChild(document.createElement("br"));

            sorter.appendChild(document.createTextNode(" Minimum date:" + String.fromCharCode(160)));
            var minDateInput = document.createElement("input");
                minDateInput.setAttribute("type","date");
                minDateInput.setAttribute("id","minDateInput");
                minDateInput.setAttribute("title","Files after date");
                sorter.appendChild(minDateInput);
            sorter.appendChild(document.createTextNode(" Maximum date:" + String.fromCharCode(160)));
            var maxDateInput = document.createElement("input");
                maxDateInput.setAttribute("type","date");
                maxDateInput.setAttribute("id","maxDateInput");
                maxDateInput.setAttribute("title","Files before date");
                sorter.appendChild(maxDateInput);
            sorter.appendChild(document.createElement("br"));

            sorter.appendChild(document.createTextNode("Include invalid mods?:" + String.fromCharCode(160)));
            var invalidCheck = document.createElement("input");
                invalidCheck.setAttribute("type","checkbox");
                invalidCheck.setAttribute("id","includeInvalidModsCheck");
                invalidCheck.setAttribute("title","Include invalid mods?");
                sorter.appendChild(invalidCheck);
            sorter.appendChild(document.createElement("br"));

            var sortBtn = document.createElement("button");
                sortBtn.innerText = "Sort/Filter (can be slow)";
                sortBtn.addEventListener("click",function() {
                    var sortName = getValueFromInputById("sortPicker");

                    var filter = getValueFromInputById("filterPicker");

                    var search = getValueFromInputById("textFilter");
                    var regexCheck = document.getElementById("textFilterIsRegexCheck");
                    var useRegex = regexCheck.checked;
                    var caseCheck = document.getElementById("textFilterIsCiCheck");
                    var caseIns = caseCheck.checked;

                    var fileMinText = getValueFromInputById("sizeMinimum");
                    var fileSizeMin = fileMinText == "" ? null : Math.max(0,Number(fileMinText.replace(/e+$/,"e0")));
                    var fileMaxText = getValueFromInputById("sizeMaximum");
                    var fileSizeMax = fileMaxText == "" ? null : Math.max(0,Number(fileMaxText.replace(/e+$/,"e0")));

                    var dateMinText = getValueFromInputById("minDateInput");
                    var minDate = dateMinText == "" ? null : new Date(`${dateMinText} 00:00:00.000Z+00:00`);
                    var dateMaxText = getValueFromInputById("maxDateInput");
                    var maxDate = dateMaxText == "" ? null : new Date(`${dateMaxText} 23:59:59.999Z+00:00`);

                    var invCheck = document.getElementById("includeInvalidModsCheck");
                    var includeInvalid = invCheck.checked;

                    var filteredData = []; //occurrence number 4892897578079974329834: FUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUCK Array.prototype.filter not allowing me to pass arguments. I run into this problem fucking constantly.
                    if((filter == "none") && (search == "") && includeInvalid) {
                        filteredData = structuredClone(window.entries)
                    } else {
                        for(var i = 0; i < window.entries.length; i++) {
                            if((includeInvalid == false) && (window.entries[i].invalidMod)) { continue };

                            if(search !== "") {
                                var searchInclude = false;
                                if(useRegex) {
                                    var regex = RegExp(search,caseIns ? "i" : "");
                                    searchInclude = regex.test(window.entries[i].name)
                                } else {
                                    if(caseIns) {
                                        searchInclude = window.entries[i].name.toLowerCase().includes(search.toLowerCase())
                                    } else {
                                        searchInclude = window.entries[i].name.includes(search)
                                    }
                                };
                                if(!searchInclude) {
                                    continue
                                }
                            };

                            if(fileSizeMin !== null || fileSizeMax !== null) {
                                if((fileSizeMin !== null && fileSizeMax !== null) && (fileSizeMin > fileSizeMax)) {
                                    alert("Minimum cannot be greater than maximum!");
                                    return
                                };
                                if(fileSizeMin !== null && window.entries[i].size < fileSizeMin) {
                                    continue
                                };
                                if(fileSizeMax !== null && window.entries[i].size > fileSizeMax) {
                                    continue
                                }
                            };

                            if(minDate !== null || maxDate !== null) {
                                if((minDate !== null && maxDate !== null) && (minDate.getTime() > maxDate.getTime())) {
                                    alert("Minimum cannot be greater than maximum!");
                                    return
                                };
                                if(minDate !== null && window.entries[i].date.getTime() < minDate.getTime()) {
                                    continue
                                };
                                if(maxDate !== null && window.entries[i].date.getTime() > maxDate.getTime()) {
                                    continue
                                }
                            };

                            if(filter == "none" || window.entries[i].type == filter) {
                                filteredData.push(window.entries[i])
                            }
                        }
                    };
                    var sortFunction = sortFunctions[sortName];
                    if(sortFunction) {
                        rebuildModList(filteredData.sort(sortFunction))
                    } else {
                        rebuildModList(filteredData)
                    }
                    report.innerText = generateReport(filteredData);
                    alert("Done")
                });
                sorter.appendChild(sortBtn);
        header.appendChild(sorter);

    window.rebuildModList = function(entriesIn) {
        var body = document.getElementsByTagName("tbody")[0];
        body.textContent = "";
        for(var i = 0; i < entriesIn.length; i++) {
            var entry = entriesIn[i];
            var newRow = document.createElement("tr");
                newRow.classList.add((entry.name.match(/\.(tar\.gz|[^\.]*)$/) ?? [null,"no-extension"])[1]);
                newRow.classList.add("file");
                if(entry.type == "mod" && entry.size < window.invalidModArbitraryThreshold) {
                    newRow.classList.add("invalid-mod");
                }
                var nameCell = document.createElement("td");
                    nameCell.setAttribute("class","name");
                    var newLink = document.createElement("a");
                        newLink.innerText = entry.name;
                        newLink.setAttribute("href","https://mirror.sgkoi.dev/direct/" + entry.name);
                        nameCell.appendChild(newLink);
                    newRow.appendChild(nameCell);
                var sizeCell = document.createElement("td");
                    sizeCell.setAttribute("class","length");
                    sizeCell.innerText = entry.size.toLocaleString();
                    newRow.appendChild(sizeCell);
                var dateCell = document.createElement("td");
                    dateCell.setAttribute("class","modified");
                    dateCell.innerText = (entry.date.toLocaleString("en-US", { timeZone: 'UTC' }) + " +00:00").replace(", "," ").replace(/ ([AP]M)/,"$1").replace(".000Z","Z");
                    newRow.appendChild(dateCell);
                body.appendChild(newRow);
        }
    };
    var rebuildModList = window.rebuildModList
})();