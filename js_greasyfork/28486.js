// ==UserScript==
// @name            Tripcolor
// @name:de         Tripcolor
// @namespace       http://www.4chan.org/
// @version         1.1.0
// @description     Colorize tripcodes, the way YOU want it
// @description:de  Färbe Tripcodes, wie es DIR gefällt
// @author          Wolvan
// @match           *://boards.4chan.org/*
// @grant           GM_getValue
// @grant           GM_setValue
// @icon            http://i.imgur.com/S2VvpO3.png
// @downloadURL https://update.greasyfork.org/scripts/28486/Tripcolor.user.js
// @updateURL https://update.greasyfork.org/scripts/28486/Tripcolor.meta.js
// ==/UserScript==
/* jshint -W097 */

(function () {
    'use strict';

    const US_META = {
        name: "Tripcolorizer",
        author: "Wolvan",
        version: "1.1.0",
        description: "Colorize Tripcodes"
    };

    const MENU_HTML = '<fieldset id="TripcolorizerOptions"><legend>Settings</legend>%SETTINGS</fieldset><div id="ButtonsDiv"><fieldset id="TripcolorizerTriplist"scrollable="vertical"><legend>Tripcodes</legend><div class="TripcolorizerScrolldiv">%TRIPLIST</div></fieldset><button id="TripcolorizerSaveButton">Save!</button><button id="TripcolorizerCancelButton">Cancel</button></div>';
    const MENU_CSS = '#TripcolorizerMenu{border-width:1px;border-color:#292929;border-style:solid;background-color:#222;color:#BBB;position:fixed;z-index:1002;top:50%;left:50%;transform:translate(-50%,-50%)}#TripcolorizerGlass{background-color:rgba(21,21,21,.82);width:100%;height:100%;z-index:1001;top:0;left:0;position:fixed}#TripcolorizerMenu label{display:inherit}#TripcolorizerMenu .TripcolorizerScrolldiv{max-height:500px;overflow-y:auto}#TripcolorizerMenu #ButtonsDiv{text-align:center}#TripcolorizerMenu input[type=checkbox]{display:inline-block!important}#TripcolorizerMenu .riceCheck{display:none}#TripcolorizerMenuButton{cursor:pointer}';

    Object.filter = function (obj, predicate) {
        var result = {},
            key;
        for (key in obj) {
            if (obj.hasOwnProperty(key) && predicate(obj[key])) {
                result[key] = obj[key];
            }
        }
        return result;
    };
    const utils = {
        append: {
            script: function (scriptCode, name = "TripcolorizerJS") {
                var newScript = document.createElement("script");
                newScript.id = name;
                newScript.innerHTML = scriptCode;
                document.head.appendChild(newScript);
            },
            css: function (style, name = "TripcolorizerStyle") {
                var newStyle = document.createElement("style");
                newStyle.id = name;
                newStyle.innerHTML = style;
                document.head.appendChild(newStyle);
            },
            div: function (htmlCode, name = "TripcolorizerDiv") {
                var newChild = document.createElement("div");
                newChild.id = name;
                newChild.innerHTML = htmlCode;
                document.body.appendChild(newChild);
            }
        },
        randomFrom: {
            object: function (obj) {
                var keys = Object.keys(obj);
                var randomProp = keys[Math.floor(Math.random() * keys.length)];
                return {
                    key: randomProp,
                    value: obj[randomProp]
                };
            },
            array: function (arr) {
                return arr[Math.floor(Math.random * arr.length)];
            }
        }
    };

    const defaultConfig = {
        tripcodes: {},
        settings: {
            colorNewCodes: {
                type: "checkbox",
                defaultValue: true,
                value: true,
                text: "Color unknown tripcodes",
                hint: "Automatically add new Tripcodes to the list"
            },
            colorNames: {
                type: "checkbox",
                defaultValue: true,
                value: true,
                text: "Color names",
                hint: "Color the names next to the tripcode as well"
            },
            autoColorOnUpdate: {
                type: "checkbox",
                defaultValue: true,
                value: true,
                text: "Color new posts automatically",
                hint: "When auto-polling for new replies, the new tripcode gets automatically colored"
            },
            defaultColorSystem: {
                type: "dropdown",
                defaultValue: "hex",
                value: "hex",
                values: [{
                        value: "rgb",
                        text: "RGB"
                    },
                    {
                        value: "hsl",
                        text: "HSL"
                    },
                    {
                        value: "hsv",
                        text: "HSV"
                    },
                    {
                        value: "hex",
                        text: "Hex"
                    }
                ],
                text: "Default Color Representation",
                hint: "Which color representation should new trip values use"
            }
        }
    };

    var config;
    var tmpConfig;

    var mutObs = new MutationObserver(function (mutations) {
        for (let mutation of mutations) {
            for (let node of mutation.addedNodes) {
                if (node && node.classList && node.classList.contains("postContainer")) {
                    colorTrips();
                }
            }
        }
    });

    function loadConfig() {
        try {
            var conf = GM_getValue("tripcolorizerOptions", JSON.stringify(defaultConfig));
            config = {
                tripcodes: {},
                settings: defaultConfig.settings
            };
            var parsedConfig = JSON.parse(conf);
            if (parsedConfig.tripcodes) {
                for (var trip in parsedConfig.tripcodes) {
                    config.tripcodes[trip] = parsedConfig.tripcodes[trip];
                }
            }
            if (parsedConfig.settings) {
                for (var setting in parsedConfig.settings) {
                    if (config.settings[setting]) config.settings[setting].value = parsedConfig.settings[setting].value;
                }
            }

            console.log(`[${US_META.name}]Config loaded`);
        } catch (error) {
            config = Object.assign({}, defaultConfig);
            console.log(`[${US_META.name}]Failed to load config. Using default. Error: ${error}`);
            return;
        }
    }

    // Credit for this hashing algorithm goes to http://userscripts-mirror.org/scripts/review/149083
    function worstHashAlgorithm(str) {
        var sum = 0;
        for (var ind = 0; ind < str.length; ind++) {
            sum += str.charCodeAt(ind);
        }
        return sum;
    }

    function colorTrips() {
        function hsv2hsl(hsvstr) {
            var [hue, sat, val] = hsvstr.match(/[\.\d]+%?/g);
            if (sat.indexOf("%") !== -1) {
                sat = parseFloat(sat) / 100;
            }
            if (val.indexOf("%") !== -1) {
                val = parseFloat(val) / 100;
            }
            var x = `hsl(${
                hue
            }, ${
                Math.floor((sat * val / ((hue = (2 - sat) * val) < 1 ? hue : 2 - hue)) * 100)
            }%, ${
                Math.floor((hue / 2) * 100)
            }%)`;
            return x;
        }

        function intToHexPad(int) {
            var hexnum = int.toString(16).toUpperCase();
            return (hexnum.length === 1 ? "0" + hexnum : hexnum);
        }
        var tripNodes = document.getElementsByClassName("postertrip");
        for (var tripNode of tripNodes) {
            let trip = tripNode.innerHTML;
            if (!config.tripcodes[trip] && config.settings.colorNewCodes.value) {
                let strippedTrip = trip.replace(/!/g, "");
                let baseValues = [
                    worstHashAlgorithm(strippedTrip.substr(0, 4)) % 255,
                    worstHashAlgorithm(strippedTrip.substr(4, 4)) % 255,
                    worstHashAlgorithm(strippedTrip.substr(8)) % 255
                ];
                switch (config.settings.defaultColorSystem.value) {
                    case "hsl":
                    case "hsv":
                        let hue = Math.floor((baseValues[0] / 255) * 360);
                        let sat = baseValues[1] / 255;
                        let light = baseValues[2] / 255;
                        config.tripcodes[trip] = `hsl(${hue}, ${Math.floor(sat * 100)}%, ${Math.floor(light * 100)}%)`;
                        if (config.settings.defaultColorSystem.value === "hsl") break;
                        sat *= light < 0.5 ? light : 1 - light;
                        config.tripcodes[trip] = `hsv(${
                            hue
                        }, ${
                            Math.floor((2 * sat / (light + sat)) * 100)
                        }%, ${
                            Math.floor((light + sat) * 100)
                        }%)`;
                        break;
                    case "hex":
                        config.tripcodes[trip] = `#${
                            intToHexPad(baseValues[0])
                        }${
                            intToHexPad(baseValues[1])
                        }${
                            intToHexPad(baseValues[2])
                        }`;
                        break;
                    case "rgb": // jshint ignore:line
                    default:
                        config.tripcodes[trip] = `rgb(${
                            baseValues[0]
                        }, ${
                            baseValues[1]
                        }, ${
                            baseValues[2]
                        })`;
                        break;
                }
            }
            if (config.tripcodes[trip]) {
                let targets;
                if (config.settings.colorNames.value) {
                    targets = tripNode.parentNode.children;
                } else {
                    targets = [tripNode];
                }
                for (let target of targets) {
                    if (target.tagName.toLowerCase() === "span") {
                        target.classList.add("TripcolorizerStyled");
                        target.style.setProperty("color", config.tripcodes[trip].match(/hsv/gi) ? hsv2hsl(config.tripcodes[trip]) : config.tripcodes[trip], "important");
                    }
                }
            }
        }
    }

    function uncolorTrips() {
        var allStyled = document.getElementsByClassName("TripcolorizerStyled");
        while (allStyled.length > 0) {
            allStyled[0].style.removeProperty("color");
            allStyled[0].classList.remove("TripcolorizerStyled");
        }
    }

    function showMenu() {
        tmpConfig = {};
        tmpConfig.settings = Object.assign({}, config.settings);
        tmpConfig.tripcodes = Object.assign({}, config.tripcodes);

        function closeMenu() {
            document.getElementById("TripcolorizerGlass").remove();
            document.getElementById("TripcolorizerMenu").remove();
        }

        function showGlass() {
            var name = "TripcolorizerGlass";
            var oldelem = document.getElementById(name);
            if (oldelem) oldelem.remove();
            utils.append.div("", name);
        }

        const STRING_TEMPLATES = {
            checkbox: '<td><input class="TripcolorizerSetting"title="%SETTINGSHINT"name="%SETTINGNAME"type="checkbox"id="Tripcolorizer_%SETTINGNAME"%SETTINGSET></td><td><label for="Tripcolorizer_%SETTINGNAME"title="%SETTINGSHINT">%SETTINGTEXT</label></td>',
            dropdown: '<td><select class="TripcolorizerSetting"title="%SETTINGSHINT"name="%SETTINGNAME" id="Tripcolorizer_%SETTINGNAME">%OPTIONS</select></td><td><label for="Tripcolorizer_%SETTINGNAME"title="%SETTINGSHINT">%SETTINGTEXT</label></td>',


            tripcodes: `<tr class="TripcolorizerTrip"><td><input type="text"class="TripcolorizerTripcode"value="%TRIPCODE"placeholder="%TRIPCODE"></td><td><input type="text"class="TripcolorizerTripcolor"value="%TRIPCOLOR"placeholder="%TRIPCOLOR"></td><td><button class="TripcolorizerDeletThis"data-trip="%TRIPCODE">Delete</button></td></tr>`
        };

        function getTriplist() {
            var triplist = '';
            for (var trip in tmpConfig.tripcodes) {
                triplist += STRING_TEMPLATES.tripcodes.replace(/%TRIPCODEEXAMPLE/g, "Tripcode (+! or !!)")
                    .replace(/%TRIPCOLOREXAMPLE/g, "CSS Style for Trip")
                    .replace(/%TRIPCODE/g, trip)
                    .replace(/%TRIPCOLOR/g, tmpConfig.tripcodes[trip]);
            }
            return triplist;
        }

        function addTrip() {
            var trip = document.getElementById("TripcolorizerNewTrip").value;
            var color = document.getElementById("TripcolorizerNewTripColor").value;

            if (trip && color) {
                tmpConfig.tripcodes[trip] = color;
                document.getElementById("TripcolorizerNewTrip").value = "";
                document.getElementById("TripcolorizerNewTripColor").value = "";
                document.getElementById("TripcolorizerTriplistTable").innerHTML = getTriplist();
                bindTripDeleteButtons();
            }
        }

        function bindTripDeleteButtons() {
            var deleteButtons = document.getElementsByClassName("TripcolorizerDeletThis");
            for (var button of deleteButtons) {
                button.addEventListener("click", function () {
                    delete tmpConfig.tripcodes[this.dataset.trip];
                    document.getElementById("TripcolorizerTriplistTable").innerHTML = getTriplist();
                    bindTripDeleteButtons();
                });
            }
        }

        function showMenu() {

            var name = "TripcolorizerMenu";
            var oldelem = document.getElementById(name);
            if (oldelem) oldelem.remove();
            var settingsHTML = '<table id="TripcolorizerSettingsTable">';

            var settingControl = "";

            var setting;
            for (var settingName in tmpConfig.settings) {
                setting = tmpConfig.settings[settingName];
                switch (setting.type) {
                    case "checkbox":
                        settingControl = STRING_TEMPLATES.checkbox.replace(/%SETTINGNAME/g, settingName)
                            .replace(/%SETTINGTEXT/g, setting.text)
                            .replace(/%SETTINGSHINT/g, setting.hint || "")
                            .replace(/%SETTINGSET/g, (setting.value ? 'checked="checked"' : ""));
                        break;
                    case "dropdown":
                        settingControl = STRING_TEMPLATES.dropdown.replace(/%SETTINGNAME/g, settingName)
                            .replace(/%SETTINGTEXT/g, setting.text)
                            .replace(/%SETTINGSHINT/g, setting.hint || "")
                            .replace(/%OPTIONS/g, setting.values.map(function (item) {
                                return `<option value="${item.value}"${item.value === setting.value ? "selected" : ""}>${item.text}</option>`;
                            }));
                        break;
                    default:
                        break;
                }
                settingsHTML += "<tr>" + settingControl + "</tr>";
            }

            settingsHTML += "</table>";

            var triplist = '<table id="TripcolorizerTriplistTable">' + getTriplist();
            triplist += "</table>";
            triplist += '<table id="TripcolorizerTriplistAddTable">';
            triplist += '<tr><td><input type="text"name="NewTrip"id="TripcolorizerNewTrip"placeholder="%TRIPCODEEXAMPLE"></td><td><input type="text"name="NewTripColor"id="TripcolorizerNewTripColor"placeholder="%TRIPCOLOREXAMPLE"><td><button id="TripcolorizerAddTrip">Add</button></td></td></tr>';
            triplist += "</table>";

            utils.append.div(MENU_HTML.replace(/%SETTINGS/g, settingsHTML)
                .replace(/%TRIPLIST/g, triplist)
                .replace(/%TRIPCODEEXAMPLE/g, "Tripcode (+! or !!)")
                .replace(/%TRIPCOLOREXAMPLE/g, "CSS Style for trip"), name);
        }
        showGlass();
        showMenu();

        document.getElementById("TripcolorizerAddTrip").addEventListener("click", addTrip);
        bindTripDeleteButtons();

        document.getElementById("TripcolorizerGlass").addEventListener("click", closeMenu);
        document.getElementById("TripcolorizerCancelButton").addEventListener("click", closeMenu);
        document.getElementById("TripcolorizerSaveButton").addEventListener("click", function () {
            var settingElements = document.getElementsByClassName("TripcolorizerSetting");
            for (var setting of settingElements) {
                switch (setting.tagName.toLowerCase()) {
                    case "input":
                        switch (setting.type.toLowerCase()) {
                            case "checkbox":
                                tmpConfig.settings[setting.name].value = setting.checked;
                                break;
                            default:
                                break;
                        }
                        break;
                    case "select":
                        tmpConfig.settings[setting.name].value = setting.value;
                        break;
                    default:
                        break;
                }
            }
            var tripcodeListElements = document.getElementsByClassName("TripcolorizerTrip");
            for (var tripRow of tripcodeListElements) {
                let children = tripRow.children;
                let tripcode;
                let tripcolor;
                for (let child of children) {
                    child = child.children[0];
                    if (child.classList.contains("TripcolorizerTripcode")) {
                        if (child.value) tripcode = child.value;
                    } else if (child.classList.contains("TripcolorizerTripcolor")) {
                        if (child.value) tripcolor = child.value;
                    }
                }
                if (tripcode && tripcolor) tmpConfig.tripcodes[tripcode] = tripcolor;
            }
            config = Object.assign({}, tmpConfig);
            GM_setValue("tripcolorizerOptions", JSON.stringify(config));
            console.log(`[${US_META.name}]Saved Settings to Tripcolorizer`);
            console.log(`[${US_META.name}]Re-coloring Trips`);
            uncolorTrips();
            colorTrips();
            console.log(`[${US_META.name}]${config.settings.autoColorOnUpdate.value ? "Enabling" : "Disabling"} update observer`);
            if (config.settings.autoColorOnUpdate.value) {
                mutObs.observe(document.getElementsByClassName("thread")[0], {
                    childList: true,
                    subtree: true
                });
            } else {
                mutObs.disconnect();
            }
            closeMenu();
        });
    }

    function keyDownHandler(event) {
        if (event.ctrlKey && event.which === 76) {
            showMenu();
        }
    }

    function init() {
        console.log(`[${US_META.name}]Initializing ${US_META.name} v${US_META.version} by ${US_META.author}`);
        console.log(`[${US_META.name}]Injecting CSS`);
        utils.append.css(MENU_CSS, "TripcolorizerMenuStyling");
        console.log(`[${US_META.name}]Loading config`);
        loadConfig();
        console.log(`[${US_META.name}]Hooking Keyboard Event`);
        document.addEventListener('keydown', keyDownHandler);
        console.log(`[${US_META.name}]Coloring ${!config.settings.colorNewCodes ? "known " : ""}tripcodes`);
        colorTrips();
        if (config.settings.autoColorOnUpdate.value) {
            console.log(`[${US_META.name}]Enabling update observer`);
            mutObs.observe(document.getElementsByClassName("thread")[0], {
                childList: true,
                subtree: true
            });
        }
    }

    init();
})();
