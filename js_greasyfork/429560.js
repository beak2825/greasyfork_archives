// ==UserScript==
// @name         Cubedcraft Highlighter
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Highlighter for cubedcraft file manager.
// @author       LegitMeme
// @match        https://playerservers.com/dashboard/filemanager/*
// @icon         https://www.google.com/s2/favicons?domain=playerservers.com
// @downloadURL https://update.greasyfork.org/scripts/429560/Cubedcraft%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/429560/Cubedcraft%20Highlighter.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // CONFIG:
    var enableYMLProcessor = true; // Default: true; * Enables the processor for YML files.
    var enableJSONProcessor = true; // Default: true; * Enables the processor for JSON files.
    var enableTXTProcessor = true; // Default: true; * Enables the processor for TXT files.
    var enableShortcuts = true; // Default: true; * Enables shortcuts such as: ctrl + s for updating the processor and ctrl + p to automatically parse/unparse.
    var JSONParser = false; // Default: false; * Parse JSON when processing, may cause some glitches when enabled; Does nothing when JSONProcessor is disabled.
    var JSONSpaceCount = 3; // Default: 3; * Amount of spaces used by the json parser.
    var autoProcess = false; // Default: false; * Automatically processes the viewed file on load.
    var autoScrollDown = false // Default: false; * Automatically scrolls down on load; Does nothing when autoProcess is disabled.
    // All colors can be modified below and are in hex format;


    // [!] DO NOT MODIFY ANYTHING BELOW (Except for CSS) IF YOU DON'T KNOW WHAT YOU'RE DOING;
    // Document Check
    var _ = document.getElementById("edit-file-content");
    if (!(_) || !(document.getElementById("edit-file-name"))) {
        return;
    }

    // Globals
    var init = true;
    var processed = false;
    var parserEnabled = false;
    var updateFunc = function() {};
    var container = document.createElement('div');
    var style = document.createElement('style');
    style.type = 'text/css';

    function fetchBuffer() {
        if (init === true) {
            init = false;
            return _.value.split("\n");
        } else {
            var temp = document.createElement('div');
            temp.innerHTML = document.getElementById("edit-file-content").innerHTML.replaceAll("<div>", "<br>").replaceAll("</div>", "").replaceAll("<br>", "\n").replaceAll("&nbsp;", " ");
            return temp.textContent.split("\n");
        }
    }

    function fetchJSONBuffer() {
        if (init === true) {
            init = false;
            return JSON.stringify(JSON.parse(_.value), null, JSONSpaceCount).split("\n");
        } else {
            var temp = document.createElement('div');
            temp.innerHTML = document.getElementById("edit-file-content").innerHTML.replaceAll("<div>", "<br>").replaceAll("</div>", "").replaceAll("<br>", "\n").replaceAll("&nbsp;", " ");
            console.log(temp.textContent[120]);
            return JSON.stringify(JSON.parse(temp.textContent), null, JSONSpaceCount).split("\n");
        }
    }


    // Initialize Parsers [Handle Config, Style, Set Update Function];
    if (document.getElementById("edit-file-name").value.indexOf(".yml") !== -1 && enableYMLProcessor) {
        parserEnabled = true;
        style.innerHTML = `.yaml-comment { color: #3A3A3A; }
                           .yaml-index { color: #FF3731; }
                           .yaml-string { color: #00DC8F; }
                           .yaml-int { color: #e32b56; }
                           .yaml-true { color: #23d613; }
                           .yaml-false { color: #e81515; }`
        updateFunc = function() {
            let buffer = fetchBuffer();
            let out = "";
            let text = "";
            for (let i = 0; i < buffer.length; i++) {
                if (buffer[i].trim()[0] == "#") {
                    text = buffer[i].replaceAll(" ", "&nbsp;");
                    out += "<span class=\"yaml-comment\">" + text + "</span>";
                    out += "<br>";
                } else if (buffer[i].indexOf(":") === -1) {
                    let temp = buffer[i].replaceAll(" ", "&nbsp;");
                    let match = temp.replaceAll("&nbsp;", "")[0];
                    if (match == "-") {
                        out += temp;
                    } else {
                        out += "<span class=\"yaml-string\">" + temp + "</span>";
                    }
                    out += "<br>";
                } else {
                    let text = buffer[i].replaceAll(" ", "&nbsp;").split(":");
                    out += "<span class=\"yaml-index\">" + text[0] + "</span>:";

                    if (text[1].match(/\d+/g)) {
                        out += "<span class=\"yaml-int\">" + text[1] + "</span>";
                    } else if (text[1].match(/true/g)) {
                        out += "<span class=\"yaml-true\">" + text[1] + "</span>";
                    } else if (text[1].match(/false/g)) {
                        out += "<span class=\"yaml-false\">" + text[1] + "</span>";
                    } else {
                        out += "<span class=\"yaml-string\">" + text[1] + "</span>";
                    }
                    out += "<br>";
                }
            }

            out = out.replace(new RegExp("<br>$"), '');
            return out;
        }

    } else if (document.getElementById("edit-file-name").value.indexOf(".json") !== -1 && enableJSONProcessor) {
        parserEnabled = true;
        style.innerHTML = `.json-comment { color: #3A3A3A; }
                           .json-base { color: #f27a11 }
                           .json-array { color: #1bded7 }
                           .json-index { color: #FF3731; }
                           .json-string { color: #00DC8F; }
                           .json-int { color: #e32b56; }
                           .json-true { color: #23d613; }
                           .json-false { color: #e81515; }
                           .json-seperator { color: white; }`
        if (JSONSpaceCount > 10) {
            JSONSpaceCount = 10;
        }

        _.value = JSON.stringify(JSON.parse(_.value), null, JSONSpaceCount);
        updateFunc = function() {
            let buffer;
            if (JSONParser) {
                buffer = fetchJSONBuffer();
            } else {
                buffer = fetchBuffer();
            }

            let out = "";
            let text = "";
            for (let i = 0; i < buffer.length; i++) {
                if (buffer[i].trim()[0] == "#") {
                    text = buffer[i].replaceAll(" ", "&nbsp;");
                    out += "<span class=\"json-comment\">" + text + "</span>";
                    out += "<br>";
                } else if (buffer[i].indexOf(":") === -1) {
                    let temp = buffer[i].replaceAll(" ", "&nbsp;");
                    let match = temp.replaceAll("&nbsp;", "")[0];
                    if (match == "[" || match == "]") {
                        out += "<span class=\"json-base\">" + temp + "</span>";
                    } else if (match == "{" || match == "}") {
                        out += "<span class=\"json-array\">" + temp + "</span>";
                    } else {
                        out += "<span class=\"json-string\">" + temp + "</span>";
                    }
                    out += "<br>";
                } else {
                    let text = buffer[i].replaceAll(" ", "&nbsp;").split("\":");
                    out += "<span class=\"json-index\">" + text[0] + "\"</span>:";

                    if (text[1].match(/\d+/g)) {
                        out += "<span class=\"json-int\">" + text[1] + "</span>";
                    } else if (text[1].match(/true/g)) {
                        out += "<span class=\"json-true\">" + text[1] + "</span>";
                    } else if (text[1].match(/false/g)) {
                        out += "<span class=\"json-false\">" + text[1] + "</span>";
                    } else {
                        out += "<span class=\"json-string\">" + text[1] + "</span>";
                    }
                    out += "<br>";
                }
            }

            out = out.replace(new RegExp("<br>$"), '').replaceAll(",", "<span class=\"json-seperator\">,</span>");
            return out;
        }
    } else if (document.getElementById("edit-file-name").value.indexOf(".txt") !== -1 && enableTXTProcessor) {
        parserEnabled = true;
        style.innerHTML = `.txt-comment { color: #3A3A3A; }
                           .txt-true { color: #23d613; }
                           .txt-false { color: #e81515; }`
        updateFunc = function() {
            let buffer = fetchBuffer();
            let out = "";
            let text = "";
            for (let i = 0; i < buffer.length; i++) {
                if (buffer[i].trim()[0] == "#") {
                    text = buffer[i].replaceAll(" ", "&nbsp;");
                    out += "<span class=\"txt-comment\">" + text + "</span>";
                    out += "<br>";
                } else {
                    let temp = buffer[i].replaceAll(" ", "&nbsp;");
                    temp = temp.replaceAll("true", "<span class=\"txt-true\">true</span>");
                    temp = temp.replaceAll("false", "<span class=\"txt-false\">false</span>");
                    out += temp;
                }
            }

            out = out.replace(new RegExp("<br>$"), '');
            return out;
        }
    }

    // Try to load assigned parser
    if (!parserEnabled) {
        return;
    }

    // Global Updating Function
    function update() {
        container.innerHTML = updateFunc();
    }

    function registerProcessShortcut() {
        if (enableShortcuts) {
            document.getElementById('edit-file-content').onkeydown = function(e) {
                e = e || window.event; //Get event
                if (e.ctrlKey) {
                    var c = e.which || e.keyCode; //Get key code
                    switch (c) {
                        case 83:
                            e.preventDefault();
                            e.stopPropagation();
                            update();
                            break;
                    }
                }
            };
        }

    }

    // Global Processing Function
    function process() {
        if (!processed) {
            processed = true;
            _ = document.getElementById("edit-file-content");

            let height = _.scrollTop;
            container.classList = _.classList;
            container.style = "width:100%; background-color: #222222; !important;color: #fff; tabindex=\"1\";";
            container.id = _.id;
            container.contentEditable = true;
            _.parentNode.replaceChild(container, _);
            registerProcessShortcut();

            update();
            document.getElementById('edit-file-content').onblur = function(e) {
                if (processed) {
                    update();
                }
            }

            setTimeout(function() {
                window.scrollTo(0, height);
            }, 1);
        } else {
            update();
            setTimeout(function() {
                window.scrollTo(0, document.body.scrollHeight);
            }, 1);
        }
    }

    function registerUnprocessShortcut() {
        if (enableShortcuts) {
            document.getElementById('edit-file-content').onkeydown = function(e) {
                e = e || window.event; //Get event
                if (e.ctrlKey) {
                    var c = e.which || e.keyCode; //Get key code
                    switch (c) {
                        case 83:
                            e.preventDefault();
                            e.stopPropagation();
                            document.getElementsByClassName("form-group")[2].getElementsByTagName("input")[1].click();
                            break;
                    }
                }
            };
        }
    }

    // Global Unprocessing Function
    function unprocess() {
        if (processed) {
            processed = false;
            init = true;

            let height = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            console.log(height);
            var temp = document.createElement('div');
            temp.innerHTML = document.getElementById("edit-file-content").innerHTML.replaceAll("<br>", "\n").replaceAll("&nbsp;", " ");
            _.value = temp.textContent;
            container.parentNode.replaceChild(_, container);
            registerUnprocessShortcut();

            setTimeout(function() {
                _.scrollTo(0, height);
            }, 1);
        }
    }

    // Create Buttons
    let processButton = document.createElement('a');
    processButton.href = "#";
    processButton.classList.add("btn");
    processButton.classList.add("btn-primary");
    processButton.onclick = process;
    processButton.textContent = "Process";
    processButton.style = "margin-left: 1px;";

    let unProcessButton = document.createElement('a');
    unProcessButton.href = "#";
    unProcessButton.classList.add("btn");
    unProcessButton.classList.add("btn-danger");
    unProcessButton.onclick = unprocess;
    unProcessButton.textContent = "Unprocess";
    unProcessButton.style = "margin-left: 3px;";

    if (autoProcess) {
        process();

        if (autoScrollDown) {
            setTimeout(function() {
                window.scrollTo(0, document.body.scrollHeight);
            }, 1);
        }
    }

    // Setup Document
    document.getElementsByClassName("form-group")[2].appendChild(processButton);
    document.getElementsByClassName("form-group")[2].appendChild(unProcessButton);
    document.getElementsByClassName("form-group")[2].getElementsByTagName("input")[1].onclick = unprocess;
    document.getElementsByTagName('head')[0].appendChild(style);
    registerUnprocessShortcut();

    if (enableShortcuts) {
        document.onkeydown = function(e) {
            e = e || window.event; //Get event
            if (e.ctrlKey) {
                var c = e.which || e.keyCode; //Get key code
                switch (c) {
                    case 80:
                        if (processed) {
                            unprocess();
                        } else {
                            process();
                        }
                        e.preventDefault();
                        e.stopPropagation();
                        break;
                }
            }
        };
    }
})();
