// ==UserScript==
// @name        KoLE2-alpha
// @namespace   fnoot/kol/kole2-alpha
// @description Misc enhancements for kingdom of loathing
// @include     http://www.kingdomofloathing.com/*
// @include     https://www.kingdomofloathing.com/*
// @include     https://kingdomofloathing.com/*
// @version     0.2.4.1
// @grant    	GM_getValue
// @grant    	GM_setValue
// @grant    	GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/5052/KoLE2-alpha.user.js
// @updateURL https://update.greasyfork.org/scripts/5052/KoLE2-alpha.meta.js
// ==/UserScript==
/*

changes 0.2.3 > 0.2.4
- fixed HP detection (for min autofight hp) in compact mode char pane
- 'auto button' option; choose choice adventure buttons to auto-click
- (.4.1) Fixed an incorrect title

changes 0.2.2 > 0.2.3
- 'Watch text' option; halt and show alert when specified text appears
- increased daily reminder click delay to account for unpredictable time before the buttons work
- improved example topbar theme
- fixed sword nullification (thanks to Marge for the Talkie for testing)
- improved styling here and there

changes 0.2.1 > 0.2.2
- quick "Auto Fight" checkbox
- auto daily reminder clicking

changes 0.2 > 0.2.1
- includes new https url

changes 0.1 > 0.2
- Topbar icon theming
- Auto fight min HP% setting
- /qs * <item> to sell all

*/
// kole 1 (defunct): http://userscripts.org/scripts/show/149194

(function() {
    var top = unsafeWindow.top; // :(

    //  debug
    //	GM_deleteValue("kole2Settings");
    //	GM_deleteValue("iconThemes");

    var defaultIconThemes = {
        example: {
            "displayName": "Example Theme (0.2.3)",
            "bg": "#e6e6e6",
            "icons": {
                "https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/map.gif": "http://files.softicons.com/download/application-icons/pixelophilia-2-icons-by-omercetin/png/32/map.png",
                "https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/backpack.gif": "http://findicons.com/files/icons/1334/take_a_hike/32/backpack.png",
                "https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/donate.gif": "http://www.myiconfinder.com/uploads/iconsets/32-32-eea92a656253619edb72bf32fbe14ef9-bag.png",
                "https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/book3.gif": "http://vignette1.wikia.nocookie.net/tibia/images/9/96/Spellbook_of_Dark_Mysteries.gif/revision/latest?cb=20080620235058&path-prefix=en",
                "https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/pliers.gif": "https://cdn4.iconfinder.com/data/icons/harwdware-tools-v2/512/water_pump_pliers_tool-32.png",
                "https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/envelope.gif": "http://files.softicons.com/download/toolbar-icons/iconza-light-blue-icons-by-turbomilk/png/32/mail.png",
                "https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/blackwrench.gif": "http://findicons.com/files/icons/2262/android_developer_common_icon_set_ii/32/options_selected.png",
                "https://s3.amazonaws.com/images.kingdomofloathing.com/itemimages/chat.gif": "http://findicons.com/files/icons/1620/crystal_project/32/delete_group.png"
            }
        }
    };

    var saveIconThemes = function() {
        GM_setValue("iconThemes", JSON.stringify(top.kole.iconThemes));
    };
    
    var setOption = function(name, value) {
        GM_setValue(name, JSON.stringify(value));
    };

    var getOption = function(name) {
        var v = GM_getValue(name, JSON.stringify(configOptions[name].default));
        return JSON.parse(v);
    };

    var closePanel = null;

    var Notification = window.Notification || window.mozNotification || window.webkitNotification;
    var desktopNotify = function desktopNotify(title, options, properties) {
        if (!Notification) return;
        if (Notification.permission !== "granted") return;
        var notification = new Notification(title, options);
        if (properties) for (var k in properties) if (properties.hasOwnProperty(k)) notification[k] = properties[k];
    };


    
    var controlTypes = {
        input: function(name, spec, parent) {
            var input = crel("input", spec.style ? spec.style : {}, parent);
            input.id = "kole_config_" + name;
            var setValue = function() {
                if (spec.onchange) spec.onchange(input.value);
                setOption(name, input.value);
            };
            input.value = getOption(name);
            input.onkeyup = setValue;
            input.onpaste = setValue;
        },
        yesno: function(name, spec, parent) {
            var select = crel("select", {}, parent);
            select.id = "kole_config_" + name;
            with(crel("option", {}, select)) {
                innerHTML = "Yes";
                value = 1;
            }
            with(crel("option", {}, select)) {
                innerHTML = "No";
                value = 0;
            }
            select.selectedIndex = getOption(name) ? 0 : 1;
            select.onchange = function() {
                setOption(name, this.selectedIndex == 0);
            };
        },
        check: function(name, spec, parent) {
            var cbox = crel("input", {}, parent);
            cbox.checked = getOption(name);
            cbox.id = "kole_config_" + name;
            cbox.type = "checkbox";
            cbox.onclick = function() {
                setOption(name, this.checked);
                if (spec.onchange) spec.onchange(this.checked);
            }
        },
        spin: function(name, spec, parent) {
            var min = spec.range[0],
                max = spec.range[1];
            var value = getOption(name);
            if (isNaN(value)) value = configOptions[name].default;
            var displayCallback = spec.displayCallback || function(v) {
                return v;
            };
            var downButton = crel("button", {}, parent);
            downButton.innerHTML = "&lt;";
            var valueSpan = crel("span", {
                display: "inline-block",
                "margin": "0 6px",
                "width": "50px",
                "text-align": "center"
            }, parent);
            var fixPrecision = function() {
                value = Math.round(value * 100) / 100;
            }
            valueSpan.innerHTML = displayCallback(value);
            var upButton = crel("button", {}, parent);
            upButton.innerHTML = "&gt;";
            downButton.onclick = function() {
                value -= spec.step;
                fixPrecision();
                if (value < min) value = min;
                valueSpan.innerHTML = displayCallback(value);
                setOption(name, value);
                if (spec.onchange) spec.onchange(value);
            };
            upButton.onclick = function() {
                value += spec.step;
                fixPrecision();
                if (value > max) value = max;
                valueSpan.innerHTML = displayCallback(value);
                setOption(name, value);
                if (spec.onchange) spec.onchange(value);
            };
        },
        button: function(name, spec, parent) {
            with(crel("a", {}, parent)) {
                onclick = function() {
                    spec.onclick();
                    return false;
                };
                href = "#" + name;
                innerHTML = spec.buttonCaption;
            }
        },
        select: function(name, spec, parent) {
            var ctrl = crel("select", {}, parent);
            var options = typeof spec.options == "function" ? spec.options() : spec.options;
            var idx = 0;
            var selIndex = 0;
            for (var value in options) {
                var opt = crel("option", {}, ctrl);
                opt.innerHTML = options[value];
                opt.value = value;
                if (value == getOption("iconTheme")) selIndex = idx;
                idx++;
            }
            ctrl.selectedIndex = selIndex;
            ctrl.onchange = function() {
                setOption(name, ctrl.options[ctrl.selectedIndex].value);
                if (spec.onchange) spec.onchange(value);
            };
        },
        raw: function(name, spec, parent) {
            parent.innerHTML = spec.html;
        }
    };

    var getSetting = function(name) {
        console.trace();
        throw new Error("Obsolete getSetting()");
    };

    var itemLookup = function(fuzzyName) {
        if (!top.kole) return null;
        var matches = [];
        var item = null;
        for (var name in top.kole.itemIds) {
            if (name.trim().toUpperCase().indexOf(fuzzyName.toUpperCase()) > -1) {
                if (name.toLowerCase() == fuzzyName.toLowerCase()) {
                    return {
                        name: name,
                        id: top.kole.itemIds[name]
                    };
                }
                matches.push({
                    name: name,
                    id: top.kole.itemIds[name]
                });
            }
        }
        if (matches.length > 1) {
            return {
                error: "Multiple matches for \"" + fuzzyName + "\". Please be more specific."
            };
        } else if (matches.length == 1) {
            return matches[0];
        }
        return null;
    };

    var configOptions = {
        hoverHints: {
            default: true,
            control: "check",
            caption: "Hover hints",
            description: "Shows information about an item/effect/icon when the mouse pointer hovers over it"
        },
        hintDelay: {
            default: 225,
            caption: "Hint delay (milliseconds)",
            description: "Specifies how long you need to hover over an item/effect/icon before its description is shown",
            control: "spin",
            range: [0, 2000],
            step: 25
        },
        darkness: {
            default: 0.2,
            caption: "Darkness",
            description: "Darkens the whole game; great for headaches and photosensitives!",
            control: "spin",
            range: [0, 0.8],
            step: 0.1,
            onchange: function(value) {
                top.kole.setDarkness(value);
            },
            displayCallback: function(value) {
                return ((value / 0.8) * 100).toFixed(1).replace(/(\d+)\.0+$/, '$1') + "%";
            }
        },
        stayLoggedIn: {
            default: true,
            caption: "Stay logged in",
            description: "Defeats the timeout that logs you out after an idle period by sending a dummy request every two minutes",
            control: "check",
            onchange: function(value) {
                if (value) xhr("main.php", function() {}, false);
            }
        },
        nullifySword: {
            default: true,
            caption: "Fix prepositions",
            description: "Undoes the effect of the Sword - may no longer work",
            control: "check"
        },
        autoDaily: {
            default: false,
            caption: "Automatic daily reminders",
            description: "Automatically clicks the daily reminder buttons",
            control: "check"
        },
        iconTheme: {
            default: "",
            caption: "Topbar icon theme",
            control: "select",
            description: "Replaces the icons on the topbar with a custom theme",
            options: function() {
                var options = {
                    "": "Vanilla"
                };
                for (themeName in unsafeWindow.top.kole.iconThemes) {
                    options[themeName] = unsafeWindow.top.kole.iconThemes[themeName].displayName
                }
                return options;
            }
        },
        manageIconThemes: {
            caption: "Manage icon themes",
            description: "Import, delete and edit topbar icon themes",
            control: "button",
            buttonCaption: "Manage",
            onclick: function() {
                var reshow = function() {
                    var pop = crel("div");
                    var vanillaManage = crel("div");
                    var newThemeButton = crel("a", {}, vanillaManage);
                    crel("span", {}, vanillaManage).innerHTML = " ";
                    newThemeButton.innerHTML = "New theme";
                    newThemeButton.href = "#";
                    newThemeButton.onclick = function() {
                        managePoop.close();
                        editIconTheme("", reshow);
                    };
                    var importButton = crel("a", {}, vanillaManage);
                    crel("span", {}, vanillaManage).innerHTML = " ";
                    importButton.innerHTML = "Import";
                    importButton.href = "#";
                    importButton.onclick = function() {
                        managePoop.close();
                        importIconTheme(reshow);
                    };
                    crel("h1", {
                        margin: "0 0 12px 0",
                        "font-weight": "100"
                    }, pop).innerHTML = "Topbar Icon Themes";
                    var themeList = [
                        ["Vanilla", vanillaManage]
                    ];
                    for (var name in unsafeWindow.top.kole.iconThemes) {
                        var manage = crel("div");
                        var editButton = crel("a", {}, manage);
                        crel("span", {}, manage).innerHTML = " ";
                        editButton.innerHTML = "Edit";
                        editButton.href = "#";
                        var deleteButton = crel("a", {}, manage);
                        crel("span", {}, manage).innerHTML = " ";
                        deleteButton.innerHTML = "Delete";
                        deleteButton.href = "#";
                        var exportButton = crel("a", {}, manage);
                        crel("span", {}, manage).innerHTML = " ";
                        exportButton.innerHTML = "Export";
                        exportButton.href = "#";
                        with({
                            name: name,
                            theme: unsafeWindow.top.kole.iconThemes[name]
                        }) {
                            deleteButton.onclick = function() {
                                if (!confirm("Delete this theme?")) return;
                                delete top.kole.iconThemes[name];
                                if (name == getOption("iconTheme")) {
                                    setOption("iconTheme", "");
                                    closePanel();
                                    openPanel();
                                    saveSettings();
                                }
                                saveIconThemes();
                                managePoop.close();
                                reshow();
                                return false;
                            };
                            editButton.onclick = function() {
                                editIconTheme(name, reshow);
                                managePoop.close();
                                return false;
                            };
                            exportButton.onclick = function() {
                                poop("<h1 style='font-weight:100; margin:0 0 12px 0'>Export code for " + theme.displayName + "</h1>" + "<textarea onclick='this.select()' style='width:100%; background:rgba(0,0,0,0.2); height:200px' readonly='readonly'>" + exportIconTheme(name).replace(/\</g, "&lt;").replace(/\>/g, "&gt;") + "</textarea><p>Copy and share the above code to distribute your theme.</p>");
                                return false;
                            };
                        }

                        themeList.push([top.kole.iconThemes[name].displayName, manage]);
                    }
                    pop.appendChild(tabulate(themeList, "rgba(0,0,0,0.06"));
                    var managePoop = poop(pop);
                }; // /reshow
                reshow();
            }
        },
        autoFight: {
            default: false,
            caption: "Automatic fighting",
            description: "Always clicks the last item in the combat bar or \"Adventure again\" when available; requires combat bar enabled in KoL options",
            control: "check",
            onchange: function(val){
                quickAF.checked = val;
            }
        },
        autoFightDelay: {
            default: 4000,
            caption: "Automatic fighting delay",
            description: "Defines how long to wait before taking an automatic action in a fight",
            control: "spin",
            range: [500, 10000],
            step: 500,
            displayCallback: function(v) {
                return (v / 1000) + "sec";
            }
        },
        autoFightMinHp: {
            default: 40,
            caption: "Auto fighting minimum HP",
            description: "Cancels automatic fighting when HP drops below this",
            control: "spin",
            range: [0, 100],
            step: 5,
            displayCallback: function(v) {
                return v + "%";
            }
        },
        autoButton: {
            caption: "Automatic Buttons",
            description: "Choose which buttons to auto-click in choice adventures",
            control: "button",
            buttonCaption: "Manage",
            onclick: function(){
                var pop = crel("div");
                crel("h1", {
                    margin: "0 0 12px 0",
                    "font-weight": "100"
                }, pop).innerHTML = "Automatic Buttons";
                crel("p", {
                    "font-size": "small"
                }, pop).innerHTML = "Buttons listed below will be automatically clicked when they appear. Enter one button caption per line. Button captions are case-sensitive.";
                var buttonsStr = GM_getValue("autoButtons")
                if(typeof buttonsStr == "undefined") buttonsStr = "";
                var ta = crel("textarea", {
                    width: "100%",
                    height: "24vh"
                }, pop);
                ta.value = buttonsStr;
                var bottom = crel("div", {"text-align": "right"}, pop);
                var ok = crel("button", {}, bottom);
                ok.innerHTML = "OK";
                var popup = poop(pop);
                ok.onclick = function(){
                    GM_setValue("autoButtons", ta.value);
                    popup.close();
                };
            }            
        },
        autoButtonDelay: {
            default: 4000,
            caption: "Automatic button delay",
            description: "Defines how long to wait before automatically clicking a choice adventure button",
            control: "spin",
            range: [500, 10000],
            step: 500,
            displayCallback: function(v) {
                return (v / 1000) + "sec";
            }
        },
        watchText: {
            default: "",
            caption: "Watch text",
            description: "Watch for text on the page; shows notification and stops autofight. Separate strings with |",
            control: "input",
            style: {width: "95%"},
            onchange: function(val){
                if(val && Notification) Notification.requestPermission();
            }
        },
        chatHelp: {
            caption: "Chat commands",
            buttonCaption: "Show",
            "description": "Shows a list of chat commands added by KoLE",
            "control": "button",
            onclick: function() {
                var pop = crel("div");
                crel("h1", {
                    margin: "0 0 12px 0",
                    "font-weight": "100"
                }, pop).innerHTML = "KoLE Chat Commands";
                crel("p", {
                    "font-size": "small"
                }, pop).innerHTML = "These commands require <i>Modern</i> chat version selected in <a href='account.php?tab=chat'>KoL options</a>";
                pop.appendChild(tabulate([
                    ["<code>/wiki &lt;searchterm&gt;</code>", "Search Coldfront KoL wiki"],
                    ["<code>/qs [amount] &lt;itemname&gt;</code>", "Quicksell item; default amount is 1"],
                    ["<code>/qs * &lt;itemname&gt;</code>", "Quicksell all of an item"]
                ], "rgba(0,0,0,0.06"));
                poop(pop);
            }
        },
        donate: {
            caption: "Appreciation",
            control: "raw",
            description: "Has this been useful?",
            html: '<form target="_blank" action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top" style="margin:none;padding:none;display:inline">' +
                '<input type="hidden" name="cmd" value="_s-xclick">' +
                '<input type="hidden" name="hosted_button_id" value="G33Q3HVDX4G3Y">' +
                '<input type="submit" value="Show via PayPal" src="https://www.paypalobjects.com/en_GB/i/btn/btn_donate_SM.gif" border="0" name="submit">' +
                '<img alt="" border="0" src="https://www.paypalobjects.com/en_GB/i/scr/pixel.gif" width="1" height="1">' +
                '</form>'
        }

    };




    var prepositions = ["about", "above", "across", "after", "against", "along", "among", "around", "at", "before",
        "behind", "below", "beneath", "beside", "between", "beyond", "by", "down", "during", "except",
        "for", "from", "in", "inside", "into", "like", "near", "of", "off", "on", "onto", "out", "outside",
        "over", "past", "through", "throughout", "to", "under", "up", "upon", "with", "within", "without"
    ];

    var OLDnullifySword = function(s) {
        for (var i = 0; i < prepositions.length; i++) {
            var prep = prepositions[i];
            var search = new RegExp(" " + prep, "g");
            s = s.replace(search, "\x09" + prep);
            var search = new RegExp(prep + " ", "g");
            s = s.replace(search, prep + "\x09");
        }
        return s;
    };
    
    var nullifySword = function(s) {
        var sneakySpace = "\x09";
        for (var i = 0; i < prepositions.length; i++) {
            var prep = prepositions[i];
            var search = new RegExp(" " + prep, "g");
            s = s.replace(search, sneakySpace + prep);
            search = new RegExp(prep + " ", "g");
            s = s.replace(search, prep + sneakySpace + " ");
        }
        return s;
    };

    var tabulate = function(data, altColour, cellCallback) {
        var table = crel("table", {
            width: "100%",
            "font-size": "inherit"
        });
        table.setAttribute("cellspacing", 0);
        table.setAttribute("cellpadding", 4);
        if (!cellCallback) cellCallback = function(v) {
            return v;
        };
        var tb = crel("tbody", {}, table);
        if (data.length == 0) return table;
        var alt = false;
        for (var i = 0; i < data.length; i++) {
            var row = data[i];
            var tr = crel("tr", {}, tb);
            if (alt) tr.style.background = altColour;
            alt = !alt;
            for (var x = 0; x < row.length; x++) {
                var td = crel("td", {}, tr);
                var cbResult = cellCallback(row[x]);
                if (typeof cbResult == "string") {
                    td.innerHTML = cbResult;
                } else {
                    td.appendChild(cbResult);
                }
            }
        }
        return table;
    };

    var styleClassIdx = 0;
    var applyStyles = function(el, styles, pseudo){
        var style = document.createElement("style");
        if(typeof pseudo == "undefined") pseudo = "";
        if(pseudo != '') pseudo = ":" + pseudo;
        var className = "hover_styles";
        while(document.querySelectorAll("."+className).length > 0){
           className = "hover_style_" + styleClassIdx;
           styleClassIdx++;
        }
        var styleBlock = "";
        var keys = Object.keys(styles);
        for(var i = 0; i < keys.length; i++){ var key = keys[i];
            styleBlock += key + ":" + styles[key] + ";";
        }
        style.appendChild(document.createTextNode("." + className + pseudo + "{" + styleBlock + "}"));
        document.body.appendChild(style);
        el.classList.add(className);
    };

    // document.createElement > applyStyles > parent.append shortcut
    var crel = function(tag, styles, parent) {
        var el = document.createElement(tag);
        if (typeof styles != "undefined") applyStyles(el, styles);
        if (parent === null) {
            console.warn("parent is null for", tag);
            console.trace();
            return;
        }
        if (typeof parent != "undefined") parent.appendChild(el);
        return el;
    };

    var elX = function(el) {
        return el.offsetParent ? elX(el.offsetParent) + el.offsetLeft : el.offsetLeft;
    };
    var elY = function(el) {
        return el.offsetParent ? elY(el.offsetParent) + el.offsetTop : el.offsetTop;
    };


    if (window !== top) {
        var darkCover = crel("div", {
            "position": "fixed",
            "top": "0",
            "left": "0",
            "right": "0",
            "bottom": "0",
            "background": "#000",
            "opacity": 0,
            "pointer-events": "none",
            "z-index": 999999,
        }, document.body);
        var hintBox = crel("div", {
            "position": "absolute",
            "width": "260px",
            "padding": "12px 0px",
            "border": "1px #bbb solid",
            "border-radius": "5px",
            "box-shadow": "2px 2px 3px rgba(0,0,0,0.4)",
            "pointer-events": "none",
            "background": "#fff",
            "opacity": 0,
            "transform": "scale(0.1,0.1)",
            "transition": "100ms opacity ease-out, 100ms transform ease-out, 100ms -moz-transform ease-out, 100ms -webkit-transform ease-out",
            "z-index": 999998,
            "font-size": "small"
        }, document.body);
        setTimeout(function() {
            darkCover.style.transition = "600ms opacity";
        });

        var initialHintWidth = hintBox.clientWidth;
        var showHint = function(forEl, html) {
            forX = elX(forEl);
            forY = elY(forEl);
            hintBox.innerHTML = html;
            hintBox.style.width = initialHintWidth + "px";
            hintBox.style.left = forX + forEl.clientWidth + 12 + "px";
            if ((elX(hintBox) + hintBox.clientWidth) > document.body.clientWidth) {
                hintBox.style.width = document.body.clientWidth - elX(hintBox) + "px";
            }
            hintBox.style.top = (forY + (hintBox.clientHeight * 1.5)) > document.body.scrollHeight ? document.body.scrollHeight - (hintBox.clientHeight * 1.5) + "px" : forY + "px";
            crel("div", {
                background: "rgba(100, 150, 255,0.04)",
                "position": "absolute",
                "box-shadow": "0 0 22px rgba(100, 150, 255,0.09)",
                "top": "42px",
                "left": "0",
                "right": "0",
                "bottom": "0"
            }, hintBox);
            applyStyles(hintBox, {
                opacity: 1,
                transform: "scale(1,1)"
            });
            if(elY(hintBox) + hintBox.clientHeight > hintBox.parentNode.clientHeight + hintBox.parentNode.scrollTop){
                hintBox.style.top = hintBox.parentNode.clientHeight - (hintBox.clientHeight + 16) + hintBox.parentNode.scrollTop + "px";
            }
            hintElement = forEl;
        };

        var hintTimer = null;
        var hintElement = null;

        var xhr = function(url, callback, cached) {
            if (cached && typeof top.kole.xhrCache[url] != "undefined") {
                setTimeout(function() {
                    callback(top.kole.xhrCache[url]);
                }, 0);
                return {
                    cancel: function() {}
                };
            };
            var canceled = false;
            var req = new XMLHttpRequest();
            var stateChange = function() {
                if (this.readyState == 4) {
                    top.kole.xhrCache[url] = this.responseText;
                    if (!canceled)
                        callback(this.responseText);
                    req.removeEventListener("readystatechange", stateChange);
                }
            };
            req.addEventListener("readystatechange", stateChange, false);
            req.open("GET", url, true);
            req.send();
            return {
                cancel: function() {
                    canceled = true;
                }
            }
        };

        var extractDescription = function(url, callback, cached) {
            return xhr(url, function(response) {
                var tempEl = crel("div");
                tempEl.innerHTML = response;
                var scripts = tempEl.querySelectorAll("script");
                for (var i = scripts.length - 1; i >= 0; i--) scripts[i].parentNode.removeChild(scripts[i]);
                callback(tempEl.querySelectorAll("#description")[0].innerHTML);
            }, cached);
        };

        var cancelLastHintCallback = function() {};

        var cancelHint = function() {
            cancelLastHintCallback();
            if (hintTimer !== null) clearTimeout(hintTimer);
            applyStyles(hintBox, {
                opacity: 0,
                transform: "scale(0.9,0.9)"
            });
        };

        // htmlCallback(done(html)) should return {cancel:function(){...}}
        var setHintTimer = function(el, htmlCallback, ___args) {
            cancelHint();
            // show when both timer AND callback async complete
            var asyncRemaining = 2;
            var hintHtml = "";
            var asyncDone = function() {
                asyncRemaining--;
                if (asyncRemaining == 0) {
                    showHint(el, hintHtml);
                }
            };
            hintTimer = setTimeout(asyncDone, getOption("hintDelay"));
            var cancelLastHintCallback = htmlCallback(function(html) {
                hintHtml = html;
                asyncDone();
            }).cancel;
        };
    } // !top

    if (unsafeWindow == unsafeWindow.top) {
        var whenReady = function(cb) {
            for (var i = 0; i < unsafeWindow.frames.length; i++)
                if (typeof unsafeWindow.frames[i].kole == "undefined") {
                    setTimeout(function() {
                        whenReady(cb);
                    }, 200);
                    return;
                }
            cb();
        }
        if (typeof this.kole != "undefined") {
            alert("A browser plugin or KoL update is conflicting with KoLE");
            return;
        }
        unsafeWindow.kole = null;
        whenReady(function() {
            var GM_itemIds = GM_getValue("itemIds");
            var GM_iconThemes = GM_getValue("iconThemes");
            if(typeof GM_iconThemes != "undefined") GM_iconThemes = JSON.parse(GM_iconThemes);
            if(GM_iconThemes && Object.keys(GM_iconThemes).length == 1 && GM_iconThemes.hasOwnProperty("example")){
                GM_deleteValue("iconThemes");
                GM_iconThemes = undefined;
            }
            unsafeWindow.kole = {
                setDarkness: function(darkness) {
                    for (var i = 0; i < frames.length; i++) {
                        unsafeWindow.frames[i].window.kole.setDarkness(darkness);
                    }
                },
                itemIds: typeof GM_itemIds == "undefined" ? {} : JSON.parse(GM_itemIds),
                iconThemes: typeof GM_iconThemes == "undefined" ? defaultIconThemes : GM_iconThemes,
                xhrCache: {}
            };
        });
    } else {
        unsafeWindow.kole = {
            setDarkness: function(darkness) {
                darkCover.style.opacity = darkness + 0.00001; // fixes gre render bug
            },
            top: top.kole
        };
        unsafeWindow.kole.setDarkness(getOption("darkness"));
    }

    var poop = function(htmlOrElement, onclose) {
        var cover = crel("div", {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.3)",
            opacity: 0,
            transition: "200ms all",
            "z-index": 9002
        });
        var win = crel("div", {
            width: "66vw",
            "min-width": "480px",
            "max-width": "600px",
            margin: "34vh auto 0 auto",
            background: "#eee",
            position: "relative",
            transform: "scale(1,5,1.5) translateY(-30%)",
            "max-height": "78%",
            "overflow": "auto",
            opacity: 0,
            transition: "400ms all",
            "box-shadow": "1px 1px 6px rgba(0,0,0,0.4)"
        }, cover);
        var inner = crel("div", {
            padding: "12px"
        }, win);
        var winner = crel("div", {
            padding: "12px"
        }, inner);
        if (typeof htmlOrElement == "string") {
            winner.innerHTML = htmlOrElement;
        } else {
            winner.appendChild(htmlOrElement)
        }
        var close = function() {
            cover.style.opacity = 0;
            applyStyles(win, {
                "margin-top": "20%",
                opacity: 0
            });
            setTimeout(function() {
                document.body.removeChild(cover);
            }, 600);
            if (onclose) onclose();
        }
        var closeButton = crel("button", {
            position: "absolute",
            top: 0,
            right: 0,
            border: "none",
            background: "#fff",
            "padding": "0 0.8em",
            "font-size": "1.2em"
        }, win);
        applyStyles(closeButton, {
            "background": "#f88"
        }, "hover");
        with(closeButton) {
            onclick = close;
            innerHTML = "&#x2716;";
        }
        document.body.appendChild(cover);
        setTimeout(function() {
            cover.style.opacity = 1;
            applyStyles(win, {
                "transform": "scale(1,1) translateY(-50%)",
                opacity: 1
            });
        }, 100);
        return {
            close: close
        };
    };

    var timedClick = function(el, delay, cancelCaption, oncancel) {
        var cancelButton = crel("button", {
            background: "#fff",
            border: "2px #000 solid",
            transition: delay + "ms box-shadow linear",
            "box-shadow": "inset 0 0 0 rgba(255,0,0,0.9)",
            position: "fixed",
            bottom: 0,
            right: 0,
            padding: "4px",
            width: "200px"
        }, document.body);
        applyStyles(el, {
            transition: delay + "ms box-shadow linear, " + delay + "ms border-color linear",
            "box-shadow": "inset 0 0 0 rgba(0,255,0,0.5)",
            "border-color": "rgba(0,255,0,0)"
        });
        cancelButton.innerHTML = cancelCaption;
        var canceled = false;
        var timer = setTimeout(function() {
            if(!canceled) el.click();
        }, delay + 10);
        setTimeout(function() {
            cancelButton.style.boxShadow = "inset 208px 0 0 rgba(255,0,0,1)";
            el.style.boxShadow = "inset " + el.scrollWidth + "px 0 0 rgba(0,255,0,0.3)";
            el.style.borderColor = "rgba(0,255,0,1)";
        }, 10);
        cancelButton.onclick = function() {
            canceled = true;
            if (oncancel) oncancel();
            document.body.removeChild(cancelButton);
        };
        return timer;
    };

    if (window.name == "mainpane") {
        if (!document) throw new Error("no document");
        if (!document.body) throw new Error("document has no body");
        var quickAFLabel = crel("label", {
            "position": "fixed",
            "top": 0,
            "right": "64px",
            "background": "#eee"
        }, document.body);
        var quickAF = crel("input", {}, quickAFLabel);
        quickAF.id = "quickAF";
        quickAF.checked = getOption("autoFight");
        quickAF.type = "checkbox";
        quickAF.onchange = function(){
            if(!quickAF.checked && autoFightTimer !== null){
                clearTimeout(autoFightTimer);
                autoFightTimer = null;
            }
            setOption("autoFight", quickAF.checked);
        };
        var quickAFText = crel("span", {}, quickAFLabel);
        quickAFText.innerHTML = "Auto Fight";
        
        var watchText = getOption("watchText");
        if(watchText !== ""){
            var watches = watchText.split("|");
            for(var i = 0; i < watches.length; i++){
                if(document.body.innerHTML.indexOf(watches[i]) !== -1){
                    setOption("autoFight", false);
                    quickAF.checked = false;
                    if(!Notification){
                        alert("Text found: " + watches[i]);
                    } else{
                        poop("Text found: " + watches[i]);
                        desktopNotify("[KoLE] Text found: " + watches[i]);
                    }                    
                    break;
                }
            }
        }

       
        var openPanel = function() {
            if (!top.kole) return;
            if (closePanel !== null) {
                console.warn("Panel already open?");
                return;
            }
            koleButton.disabled = true;
            var panel = crel("div", {
                "position": "fixed",
                "top": "0",
                "left": "0",
                "right": "0",
                "max-height": "80%",
                "box-shadow": "0 0 8px rgba(0,0,0,0.6)",
                "border-bottom": "1px #888 solid",
                "transform": "scale(0.1,0.1)",
                "transform-origin": "100% 0",
                "padding": "12px",
                "overflow": "auto",
                "opacity": 0,
                "z-index": 9001,
                "background": "#eef",
                "transition": "320ms all ease-in"
            }, document.body);
            crel("h1", {
                "font-weight": "100"
            }, panel).innerHTML = "KoLE Settings";
            var settingsTable = crel("table", {
                "font-size": "small",
                "width": "100%",
            }, panel);
            settingsTable.setAttribute("cellpadding", 4);
            settingsTable.setAttribute("cellspacing", 0);
            var tbody = crel("tbody", {}, settingsTable);
            var alt = false;
            for (var name in configOptions) {
                alt = !alt;
                var spec = configOptions[name];
                var tr = crel("tr", {
                    background: alt ? "rgba(255,255,255,0.5)" : "transparent"
                }, tbody);
                var labelCell = crel("td", {
                    height: "2em",
                    "width": "200px",
                    "vertical-align": "middle"
                }, tr);
                var label = crel("label", {}, labelCell);
                label.innerHTML = spec.caption;
                label.setAttribute("for", "kole_config_" + name);
                var editCell = crel("td", {
                    "vertical-align": "middle"
                }, tr);
                controlTypes[spec.control](name, spec, editCell);
                if (spec.description) {
                    var descTr = crel("tr", {
                        "font-size": "0.8em",
                        "color": "#666",
                        background: alt ? "rgba(255,255,255,0.5)" : "transparent"
                    }, tbody);
                    var descTd = crel("td", {}, descTr);
                    descTd.innerHTML = spec.description;
                    descTd.setAttribute("colspan", 2);
                }
            }
            with(crel("p", {
                "font-size": "small"
            }, panel)) {
                innerHTML = "Kingdom of Loathing Enhancement <b>alpha</b> by <a href='showplayer.php?who=2362564'>fnoot</a><br>This is an <b>alpha testing</b> version; please report any problems by kmail.";
            }
            var closeButton = crel("button", {
                position: "absolute",
                top: 0,
                right: 0,
                background: "#fff",
                border: "none",
                "font-size": "18px",
                "padding": "0 .8em"
            }, panel);
            applyStyles(closeButton, {
                "background": "#f88"
            }, "hover");
            closeButton.innerHTML = "&#x2716;";
            closePanel = function() {
                closePanel = null;
                koleButton.disabled = false;
                applyStyles(panel, {
                    opacity: 0,
                    "pointer-events": "none",
                    transform: "scale(0.02,0.02)"
                });
                setTimeout(function() {
                    document.body.removeChild(panel);
                    panel = null;
                }, 1000);
            };
            panel.onscroll = function(e){
                applyStyles(closeButton, {top: panel.scrollTop + "px"});
            };
            closeButton.onclick = closePanel;
            setTimeout(function() {
                applyStyles(panel, {
                    opacity: 1,
                    transform: "scale(1,1)"
                });
            }, 100)
        };
        var koleButton = crel("button", {
            "position": "fixed",
            "top": "0",
            "right": "0",
            "z-index": 9000,
            "border": "none",
            "background": "#eee",
            "padding": "3px 6px",
            "transition": "400ms transform ease-out, 300ms opacity ease-out, 400ms 300ms color ease-out, 600ms background ease-out",
            "transform-origin": "100% 0",
            "color": "#000"
        }, document.body);
        applyStyles(koleButton, {
            background: "#adf"
        }, "hover");
        applyStyles(koleButton, {
            transition: "400ms transform ease-in, 300ms opacity ease-in, 200ms color ease-in",
            background: "#adf",
            opacity: 0,
            transform: "scale(6,6)",
            color: "rgba(0,0,0,0)"
        }, "disabled");
        with(koleButton) {
            innerHTML = "KoLE";
            onclick = openPanel;
        }
        
        var autoFightTimer = null;

        if (getOption("autoFight")) {
            (function() { // auto fighting
                if (!top.kole) return;
                var hpPercent = (top.kole.hp / top.kole.maxHp) * 100;
                if (hpPercent < getOption("autoFightMinHp")) {
                    setOption("autoFight", false);
                    return;
                }
                var links = document.querySelectorAll("a");
                var adventureAgainRegex = /Adventure Again \(|Fight Again \(/;
                for (var i = 0; i < links.length; i++) {
                    if (adventureAgainRegex.test(links[i].innerHTML)) {
                        autoFightTimer = timedClick(links[i], getOption("autoFightDelay"), "Cancel automatic fighting", function() {
                            setOption("autoFight", false);
                            quickAF.checked = false;
                        });
                        return;
                    }
                }
                var button12 = document.getElementById("button12");
                if (button12 != null) {
                    autoFightTimer = timedClick(button12, getOption("autoFightDelay"), "Cancel automatic fighting", function() {
                        setOption("autoFight", false);
                        quickAF.checked = false;
                    });
                }
            })();
        }
        if(getOption("autoDaily")){
            var buttons = document.body.querySelectorAll(".bfast");
            if(buttons.length > 0){
               timedClick(buttons[0], 1500, "Cancel Auto Daily", function(){
                  setOption("autoDaily", false);
               });
                setTimeout(function(){
                    location.reload();
                }, 2500);
            }
        }
        
        var autoButtons = GM_getValue("autoButtons");
        if(autoButtons && autoButtons !== "")(function(){
            var buttons = document.querySelectorAll("input[type=submit],value");
            var captions = autoButtons.split(/[\r\n]+/);
            for(var i = 0; i < buttons.length; i++){
                var button = buttons[i];
                var cap = button[button.tagName.toUpperCase() == "INPUT" ? "value" : "innerHTML"];
                if(captions.indexOf(cap) !== -1) timedClick(buttons[i], getOption('autoButtonDelay'), "Cancel Auto-button", function(){
                    GM_setValue("autoButtons", captions.filter(function(caption){ return cap !== caption }).join("\n"));
                });
            }
        })();

        setInterval(function() {
            if (getOption("stayLoggedIn")) {
                xhr("main.php", function() {}, false);
            }
        }, 1000 * 60 * 2);
        var scanItems = function() {
            if (top.kole == null) return;
            var itemIds = top.kole.itemIds;
            var learnedItems = false;
            var itemCells = document.querySelectorAll(".stuffbox table.item .ircm");
            for (var i = 0; i < itemCells.length; i++) {
                var cell = itemCells[i];
                var itemName = cell.innerHTML;
                if (typeof itemIds[itemName] == "undefined") {
                    learnedItems = true;
                    itemIds[itemName] = cell.parentNode.id.replace(/i/, '');
                }
            }
            if (learnedItems) GM_setValue("itemIds", JSON.stringify(itemIds));
        };
        setInterval(scanItems, 3500);

    } // /mainpane

    var chatXhr = function(msg, callback) {
        var url = '/submitnewchat.php?playerid=' + unsafeWindow.playerid + '&pwd=' + unsafeWindow.pwdhash + '&graf=' + encodeURIComponent(msg) + '&j=1';
        xhr(url, function(response) {
            callback(response);
        });
    };

    var getItemCount = function(item, callback) {
        chatXhr("/count " + item, function(res) {
            var countMatches = res.match(/You have (\d+)/);
            if (countMatches && countMatches.length > 0) {
                callback(countMatches[1]);
            } else {
                callback(0);
            }
        });
    };

    var hoverLinks = function() {
        window.addEventListener("load", function() {
            crel("style", {}, document.querySelectorAll("head")[0]).textContent = "a{opacity:0.8;} a:hover{opacity:1;}";
        }, false);
    }

    if (window.name == "menupane") {
        hoverLinks();
        var lastAppliedIconTheme = "";
        var replaceImages = function() {
            var theme;
            if (!unsafeWindow.top.kole) {
                setTimeout(replaceImages, 100);
                return;
            }
            var themeName = getOption("iconTheme");
            if (themeName == lastAppliedIconTheme) return;
            lastAppliedIconTheme = themeName;
            if (themeName == "") {
                theme = {
                    icons: {}
                };
            } else {
                if (typeof unsafeWindow.top.kole.iconThemes[themeName] == "undefined") {
                    setOption("iconTheme", "");
                    console.warn("Can't find icon theme " + themeName);
                    return;
                }
                theme = unsafeWindow.top.kole.iconThemes[themeName];
            }
            var imgs = document.querySelectorAll("img");
            document.body.style.background = typeof theme.bg == "undefined" ? "#fff" : theme.bg;
            for (var i = 0; i < imgs.length; i++) {
                if (typeof imgs[i].originalSrc == "undefined") imgs[i].originalSrc = imgs[i].src;
                var src = imgs[i].originalSrc;
                if (typeof theme.icons[src] != "undefined") {
                    //var width = imgs[i].width;
                    imgs[i].src = theme.icons[src];
                    imgs[i].width = 30;
                } else {
                    imgs[i].src = imgs[i].originalSrc;
                }
            }
        };
        replaceImages();
        setInterval(replaceImages, 500);
    }

    if (window.name == "charpane") {
        hoverLinks();
        var getHp = function() {
            if (!top.kole) {
                setTimeout(getHp, 200);
                return;
            }
            var blacks = document.querySelectorAll(".black");
            for (var i = 0; i < blacks.length; i++) {
                var sib = blacks[i];
                while (sib && sib.tagName.toLowerCase() != "img") {
                    sib = sib.previousSibling;
                }
                if(!sib){
                    // compact charpane?
                    var tr = blacks[i].parentNode.parentNode; // td > tr
                    var tds = tr.querySelectorAll("td");
                    var hptds = [].slice.call(tds, 0).filter(function(td){
                        var imgs = td.querySelectorAll("img");
                        return [].slice.call(imgs, 0).filter(function(img){
                            return img.title == "Hit Points";
                        }).length > 0;
                    });
                    if(hptds.length > 0){
                        var blacks = hptds[0].nextSibling.querySelectorAll(".black");
                        if(blacks.length > 0){
                            var matches = blacks[0].innerHTML.match(/(\d+)&nbsp;\/&nbsp;(\d+)/);
                            top.kole.hp = matches[1];
                            top.kole.maxHp = matches[2];
                            var percent = (top.kole.hp / top.kole.maxHp) * 100;
                            if (percent < getOption("autoFightMinHp")) {
                                blacks[i].style.background = "rgba(255,0,0,0.2)";
                            }
                            return;
                        }
                    }                   
                }
                if (sib && sib.title == "Hit Points") {
                    var matches = blacks[i].innerHTML.match(/(\d+)&nbsp;\/&nbsp;(\d+)/);
                    top.kole.hp = matches[1];
                    top.kole.maxHp = matches[2];
                    var percent = (top.kole.hp / top.kole.maxHp) * 100;
                    if (percent < getOption("autoFightMinHp")) {
                        blacks[i].style.background = "rgba(255,0,0,0.2)";
                    }
                    return;
                }
            }
            top.kole.hp = 1;
            top.kole.maxHp = 1;
            console.warn("[kole] Couldn't find HP");
        };
        getHp();
    }

    if (window.name == "chatpane") {
        hoverLinks();

        var chatLog = function(s) {
            var activeWindow = unsafeWindow.$$('.chatdisplay:visible')[0];
            var toscroll = (activeWindow.scrollHeight - (activeWindow.scrollTop + activeWindow.offsetHeight) < 4);
            var msg = crel("div", {
                color: "#090"
            });
            msg.innerHTML = "<span style='color:#0c0'><span style='opacity:0.4'>[</span>kole<span style='opacity:0.4'>]</span></span> " + s;
            activeWindow.appendChild(msg);
            if (toscroll) {
                activeWindow.scrollTop = activeWindow.scrollHeight;
            }
        };
        var chatCommands = {
            wiki: function(args) {
                window.open("http://kol.coldfront.net/thekolwiki/index.php/Special:Search?search=" + encodeURIComponent(args.trim()) + "&go=Go");
            },
            qs: function(args) {
                args = args.trim();
                var amountMatches = args.match(/(\d+|\*)\s+([\w\s]+)/);
                if (amountMatches && amountMatches.length > 1) {
                    var amount = amountMatches[1];
                    args = amountMatches[2];
                } else {
                    var amount = 1;
                }
                var item = itemLookup(args);
                if (item === null) {
                    chatLog("KoLE doesn't know that item's ID! Teach it by opening your inventory.");
                } else if (item.error) {
                    chatLog("" + item.error);
                } else {
                    if (amount == "*") {
                        chatLog("Retrieving item count");
                        getItemCount(item.name, function(count) {
                            if (count == 0) {
                                chatLog("You don't have any of those!");
                            }
                            chatLog("Quickselling " + count + " x " + item.name);
                            unsafeWindow.dojax("sellstuff.php?action=sell&ajax=1&type=quant&whichitem%5B%5D=" + item.id + "&howmany=" + count + "&pwd=" + unsafeWindow.pwdhash);
                        });
                    } else {
                        chatLog("Quickselling " + amount + " x " + item.name);
                        unsafeWindow.dojax("sellstuff.php?action=sell&ajax=1&type=quant&whichitem%5B%5D=" + item.id + "&howmany=" + amount + "&pwd=" + unsafeWindow.pwdhash);
                    }
                }
            },
            jump: function(args) {
                chatLog("Weeeeeeeee");
            }
        }

        var previousOnload = window.onload;
        window.onload = function() {
            if (previousOnload) previousOnload.apply(this, arguments);
            var oldForm = document.getElementById('InputForm');
            if (oldForm == null) return;
            oldForm = oldForm.parentNode;
            newForm = oldForm.cloneNode(true);
            newForm.style.background = "red";
            oldForm.parentNode.replaceChild(newForm, oldForm);
            var $inp = unsafeWindow.$$("#graf");
            unsafeWindow.$inp = $inp;
            newForm.onsubmit = function(ev) {
                ev.preventDefault();
                var inp = $inp.val();
                var matches = inp.match(/^\/(\w+)(\s+(.*))?/);
                if (matches && matches.length > 0) {
                    var cmd = matches[1];
                    if (typeof chatCommands[cmd] != "undefined") {
                        $inp.val("");
                        chatCommands[cmd].call(this, matches.length > 1 ? matches[2] : undefined);
                        return;
                    }
                }
                $inp.val(getOption("nullifySword") ? nullifySword($inp.val()) : $inp.val());
                unsafeWindow.submitchat(ev);
            };
        };
    };

    var applyHoverHints = function() {
        var els = document.querySelectorAll("a,img");
        var onclickRegex = /\b(descitem|eff|javascript:poop)\("?([\w\.\?\=]+)"?\b(\s*,\s*(\w+)\b\))?/;
        for (var i = 0; i < els.length; i++) {
            var funcUrls = {
                descitem: "desc_item.php?whichitem=",
                eff: "desc_effect.php?whicheffect=",
                "javascript:poop": ""
            };
            var onclick = els[i].getAttribute("onclick") + "";
            var matches = onclick.match(onclickRegex);
            if (onclick && matches && (matches.length > 0)) {
                if (typeof els[i]['@kole2_hoverhint_init'] == "undefined") {
                    els[i]['@kole2_hoverhint_init'] = true;
                    els[i].style.cursor = "help";
                    els[i].title = "";
                    with({
                            func: matches[1],
                            itemId: matches[2],
                            otherPlayer: matches[4]
                        }) {
                            els[i].addEventListener("mouseenter", function() {
                                cancelHint();
                                if (!getOption("hoverHints")) return;
                                hintElement = this;
                                var query = typeof otherPlayer == "undefined" ? itemId : itemId + "&otherplayer=" + otherPlayer;
                                setHintTimer(this, function(callback) {
                                    return extractDescription(funcUrls[func] + query, callback, true);
                                });
                            }, false);
                            els[i].addEventListener("mouseout", function() {
                                if (this == hintElement) cancelHint();
                            }, false);
                        } // with
                } // if not init
            } // if onclick match
        } // for i in els
    }; // applyHoverHints()

    if (window !== top) {
        applyHoverHints();
        setInterval(applyHoverHints, 2500);
    }

    var editIconTheme = function(name, ondone) {
        var startingTheme = getOption("iconTheme");
        var blankSrc = "http://images.kingdomofloathing.com/pixel.gif";
        // temporarily disable theme so Copy Link Location gets the correct URL
        setOption("iconTheme", "");
        //		top.kole.userSettings.iconTheme = "";
        var theme = name == "" ? {
            displayName: "New Theme",
            icons: {}
        } : top.kole.iconThemes[name];
        if (typeof theme == "undefined") theme = {
            displayName: "",
            icons: {}
        };
        var editor = crel("div", {});
        var tableRows = [
            ["<b>Original Image Location</b>", "<b>Icon</b>"]
        ];

        var createImg = function(src) {
            var img = crel("img", {
                cursor: "pointer",
                "vertical-align": "middle"
            });
            img.width = 30;
            img.height = 30;
            img.src = src;
            img.onclick = function() {
                var fileSelect = crel("input");
                var img = this;
                fileSelect.setAttribute("type", "file");
                fileSelect.onchange = function(ev) {
                    var reader = new FileReader();
                    reader.onloadend = function() {
                        img.src = reader.result;
                    };
                    var file = this.files[0];
                    reader.readAsDataURL(file)
                };
                fileSelect.click();
            };
            return img;
        };
        var createInput = function(value) {
            var input = crel("input", {
                width: '340px',
                "font-size": "0.8em"
            });
            input.value = value;
            return input;
        };
        var createDeleteButton = function() {
            var deleteButton = crel("button", {
                border: "none"
            });
            deleteButton.innerHTML = "X";
            deleteButton.onclick = function() {
                if (!confirm("Delete this icon?")) return;
                var row = this.parentNode.parentNode.parentNode;
                row.parentNode.removeChild(row);
                reapplyAlt();
            };
            return deleteButton;
        };

        for (var orig in theme.icons) {
            var right = crel("div");
            right.appendChild(createImg(theme.icons[orig]));
            right.appendChild(createDeleteButton());
            tableRows.push([createInput(orig), right]);
        }

        var table = tabulate(tableRows);
        var reapplyAlt = function() {
            var trs = table.querySelectorAll("tr");
            for (var i = 0; i < trs.length; i++) trs[i].style.background = i % 2 == 1 ? "rgba(0,0,0,0.05)" : "transparent";
        };
        reapplyAlt();
        crel("h1", {
            "font-weight": 100,
            margin: "0 0 12px 0"
        }, editor).innerHTML = "Editing " + theme.displayName;
        var uniqueNameInput = crel("input", {
            width: "200px"
        });
        uniqueNameInput.value = name;
        var displayNameInput = crel("input", {
            width: "200px"
        });
        displayNameInput.value = theme.displayName;
        editor.appendChild(tabulate([
            ["Unique name", uniqueNameInput],
            ["Display name", displayNameInput]
        ], "rgba(0,0,0,0.05)"));


        editor.appendChild(table);
        var addButton = crel("button", {
            "float": "right"
        }, editor);
        addButton.innerHTML = "+";
        addButton.onclick = function() {
            var tr = crel("tr", {}, table);
            var tdl = crel("td", {}, tr);
            var tdr = crel("td", {}, tr);
            var right = crel("div", {}, tdr);
            tdl.appendChild(createInput(""));
            right.appendChild(createImg(blankSrc));
            right.appendChild(createDeleteButton());
            table.appendChild(tr);
        };

        var p = crel("p", {}, editor);
        p.innerHTML = "Click an image to select a replacement. ";
        var helpLink = crel("a", {}, p);
        helpLink.innerHTML = "Help";
        helpLink.href = "#";
        helpLink.onclick = function() {
            poop("<h1 style='font-weight:100; margin:0 0 12px 0'>Theme Editor Help</h1><ol style='font-size:small'>" + "<li>Click the + button to add replacements</li>" + "<li>Right-click on a topbar icon and choose 'Copy Image Location'</li>" + "<li>Paste into the input on the left</li>" + "<li>Left-click on the icon on the right to choose a replacement</li>" + "<li>Give your theme a unique name and a fancy display name</li>" + "<li>????</li>" + "<li>Profit!</li>" + "</ol>" + "<p>Unique names are like filenames. If you change it to something new you'll create a new theme. If you change it to something that exists, you'll overwrite it.</p>");
            return false;
        };

        var saveButton = crel("Button", {}, editor);
        var saved = false;
        saveButton.innerHTML = "Save";
        saveButton.onclick = function() {
            if (uniqueNameInput.value.trim() == "") {
                poop("Please supply a unique name");
                return;
            }
            if (displayNameInput.value.trim() == "") {
                poop("Please supply a display name");
                return;
            }
            var rows = table.querySelectorAll("tr");
            var theme = {
                displayName: displayNameInput.value,
                icons: {}
            };
            for (var i = 1; i < rows.length; i++) {
                var orig = rows[i].querySelectorAll("input")[0].value;
                var repl = rows[i].querySelectorAll("img")[0].src;
                if (orig && repl != blankSrc) {
                    theme.icons[orig] = repl;
                }
            }
            top.kole.iconThemes[uniqueNameInput.value] = theme;
            saveIconThemes();
            saved = true;
            editorPoop.close();
        };

        var editorPoop = poop(editor, function() {
            if (saved) {
                if (uniqueNameInput.value != startingTheme) {
                    setOption("iconTheme", startingTheme);
                }
                if (closePanel) closePanel();
                openPanel();
            } else {
                setOption("iconTheme", startingTheme);
            }
            if (ondone) ondone();
        });
    };

    var exportIconTheme = function(name) {
        var theme = top.kole.iconThemes[name];
        if (!theme) throw new Error("No such theme: " + name);
        var exported = {
            displayName: theme.displayName,
            uniqueName: name,
            icons: theme.icons
        };
        return JSON.stringify(exported);
    };

    var importIconTheme = function(onclose) {
        var pop = crel("div");
        crel("h1", {
            margin: "0 0 12px 0",
            "font-weight": "100"
        }, pop).innerHTML = "Import Icon Theme";
        var textarea = crel("textarea", {
            "width": "100%",
            height: "200px",
            background: "#fff"
        }, pop);
        textarea.placeholder = "Paste the theme code here";
        var button = crel("button", {}, pop);
        button.innerHTML = "Import";
        button.onclick = function() {
            try {
                if (textarea.value.trim().substr(0, 1) !== "{") throw new Error("Import data must start with {");
                var theme = JSON.parse(textarea.value);
                var name = theme.uniqueName;
                if (!theme.icons) throw new error("Missing theme.icons");
                top.kole.iconThemes[name] = theme;
                saveIconThemes();
                importPoop.close();
                if (name == getOption("iconTheme")) {
                    // current theme was changed - reset current to vanilla to clear menupane's cache
                    // alternatively, cache by theme obj rather than name?
                    top.kol.userSettings.iconTheme = "";
                }
                if (closePanel) {
                    closePanel();
                    openPanel();
                }
            } catch (ex) {
                console.warn(ex.message);
                poop("Oops! That theme code doesn't seem quite right!<br><code style='font-size:0.8em'>" + ex.message + "</code>");
                return;
            }
        };
        var importPoop = poop(pop, onclose);
    };

})();